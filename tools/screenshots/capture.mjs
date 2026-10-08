#!/usr/bin/env node
/**
 * Captures the app screenshots used by the website's "See Stratora in action"
 * carousel, at 1920x1080, into tools/screenshots/out/ (gitignored).
 *
 *   npm run setup     # once — installs Playwright and its Chromium
 *   npm run capture   # all eight shots
 *
 *   node capture.mjs --only alerts.png,ipam.png   # just those two
 *   node capture.mjs --out tools/screenshots/reference  # somewhere other than the default outDir
 *   node capture.mjs --dry-run                    # print the plan, touch nothing
 *   node capture.mjs --headed                     # watch it work
 *   node capture.mjs --keep-auth=false            # force a fresh login
 *
 * Credentials come from the environment (or a .env file beside this script):
 *
 *   STRATORA_URL=https://app.stratora.io
 *   STRATORA_USER=admin
 *   STRATORA_PASS=...
 *
 * The session is cached in .auth.json so repeat runs skip the login form.
 * Both that file and .env are gitignored — never commit either.
 *
 * What gets shot is driven entirely by shots.config.json; see the notes at the
 * top of that file. Pages are targeted BY NAME rather than by UUID wherever the
 * URL contains one, so re-seeding the dev box doesn't break the run.
 */

import { chromium } from "playwright";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const AUTH_FILE = path.join(HERE, ".auth.json");

/* ------------------------------------------------------------------ args -- */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name, fallback = null) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  const idx = argv.indexOf(`--${name}`);
  if (idx !== -1 && argv[idx + 1] && !argv[idx + 1].startsWith("--")) return argv[idx + 1];
  return fallback;
};

const DRY_RUN = flag("dry-run");
const HEADED = flag("headed");
const KEEP_AUTH = value("keep-auth", "true") !== "false";
const ONLY = (value("only") || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

/* ------------------------------------------------------------------- env -- */

/** Minimal .env reader — not worth a dependency for three keys. */
async function loadDotEnv() {
  const file = path.join(HERE, ".env");
  if (!existsSync(file)) return;
  const text = await readFile(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key] !== undefined) continue; // real env wins
    process.env[key] = raw.trim().replace(/^["']|["']$/g, "");
  }
}

/* ---------------------------------------------------------------- helpers -- */

const log = (...args) => console.log(...args);
const fail = (message) => {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
};

/** Wait for the app to stop fetching, then for Leaflet to stop tiling. */
async function settle(page, ms) {
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
  await page
    .waitForFunction(() => !document.querySelector(".leaflet-tile-loading"), null, {
      timeout: 15_000,
    })
    .catch(() => {});
  // Charts and map pans animate after their data lands; nothing observable
  // fires when they finish, so this is a plain settle.
  await page.waitForTimeout(ms);
}

async function login(page, { baseUrl, user, pass }) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  // The redirect to /login is client-side and lands AFTER domcontentloaded, so
  // the URL is still "/" at this point whether or not we hold a session. Wait
  // for the app to settle and look for the form itself.
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
  const needsLogin = (await page.locator("#username").count()) > 0;
  if (!needsLogin) return false;

  if (!user || !pass) {
    throw new Error(
      "the cached session has expired and there are no credentials to renew it.\n" +
        "      Set STRATORA_USER / STRATORA_PASS (or fill in .env) and run again.",
    );
  }

  log("  · signing in…");
  await page.locator("#username").fill(user);
  await page.locator("#password").fill(pass);

  // Exact match matters: the form's FIRST submit button is "Sign in with Entra
  // ID", and a substring selector like :has-text('Sign In') matches it.
  await page.getByRole("button", { name: "Sign In", exact: true }).click();

  await page
    .waitForURL((url) => !/\/login\b/.test(url.toString()), { timeout: 30_000 })
    .catch(() => {});

  if (/\/login\b/.test(page.url())) {
    const error = await page
      .locator("[role=alert], [class*=error]")
      .first()
      .textContent()
      .catch(() => null);
    throw new Error(`sign-in failed — still on /login.${error ? ` App said: ${error.trim()}` : ""}`);
  }

  // The session is a bearer token in localStorage, not a cookie; storageState
  // captures it, but only for origins the context has actually visited.
  return true;
}

/** Bounced back to the login form means the cached token is no longer good. */
function assertSignedIn(page, where) {
  if (/\/login\b/.test(page.url())) {
    throw new Error(
      `redirected to /login while opening ${where} — the cached session expired.\n` +
        "      Re-run with --keep-auth=false to sign in fresh.",
    );
  }
}

/**
 * Open a shot's page. Either a direct URL, or an index page plus the name of
 * the card to click — indexes render cards as click handlers, not links, so
 * there is no href to navigate to directly.
 */
async function openTarget(page, shot, baseUrl) {
  if (shot.url) {
    await page.goto(new URL(shot.url, baseUrl).toString(), { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    assertSignedIn(page, shot.url);
    return;
  }

  await page.goto(new URL(shot.index, baseUrl).toString(), { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
  assertSignedIn(page, shot.index);

  // Some indexes paint their chrome before the list data arrives.
  if (shot.indexWaitFor) {
    await page.waitForSelector(shot.indexWaitFor, { timeout: 30_000 });
  }

  // Index pages come in several shapes: card grids titled with an <h3>
  // (dashboards, maps, racks), and tables whose rows are click handlers rather
  // than links (sites). getByText covers all of them — it matches whichever
  // element actually holds the name, whatever its tag.
  const target = shot.pickFirstCard
    ? page.locator("h3").first()
    : page.getByText(shot.pick, { exact: true }).first();

  if ((await target.count()) === 0) {
    const texts = await page.locator("h3, a, td").allTextContents();
    const available = [...new Set(texts.map((t) => t.trim()).filter((t) => t && t.length < 60))];
    throw new Error(
      `nothing titled ${JSON.stringify(shot.pick)} on ${shot.index}.\n` +
        `      Available: ${available.join(" | ") || "(none)"}\n` +
        `      Fix the "pick" value in shots.config.json.`,
    );
  }

  const before = page.url();
  await target.click();
  await page.waitForURL((url) => url.toString() !== before, { timeout: 30_000 }).catch(() => {});
  assertSignedIn(page, shot.pick || shot.index);
}

/* ------------------------------------------------------------------ main -- */

async function main() {
  await loadDotEnv();

  const config = JSON.parse(await readFile(path.join(HERE, "shots.config.json"), "utf8"));
  const baseUrl = process.env.STRATORA_URL || config.baseUrl;
  const user = process.env.STRATORA_USER;
  const pass = process.env.STRATORA_PASS;

  const outDir = path.resolve(REPO_ROOT, value("out", config.outDir));
  const shots = ONLY.length
    ? config.shots.filter((s) => ONLY.includes(s.file) || ONLY.includes(s.file.replace(/\.png$/, "")))
    : config.shots;

  if (!shots.length) fail(`--only matched nothing. Known files: ${config.shots.map((s) => s.file).join(", ")}`);

  log(`\n  Stratora screenshots → ${path.relative(REPO_ROOT, outDir)}`);
  log(`  ${baseUrl} · ${config.viewport.width}x${config.viewport.height} @${config.deviceScaleFactor}x · ${shots.length} shot(s)\n`);

  if (DRY_RUN) {
    for (const shot of shots) {
      const where = shot.url ? shot.url : `${shot.index} → "${shot.pickFirstCard ? "(first card)" : shot.pick}"`;
      log(`  · ${shot.file.padEnd(20)} ${where}`);
    }
    log("\n  --dry-run: nothing captured.\n");
    return;
  }

  const haveAuth = KEEP_AUTH && existsSync(AUTH_FILE);
  if (!haveAuth && (!user || !pass)) {
    fail(
      "no cached session and no credentials.\n" +
        "      Set STRATORA_USER and STRATORA_PASS in the environment, or copy\n" +
        "      .env.example to .env and fill it in.",
    );
  }

  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: !HEADED });
  const context = await browser.newContext({
    viewport: config.viewport,
    deviceScaleFactor: config.deviceScaleFactor,
    colorScheme: config.colorScheme || "dark",
    storageState: haveAuth ? AUTH_FILE : undefined,
    // Real screenshots, not a motion blur of half-finished transitions.
    reducedMotion: "reduce",
  });

  const page = await context.newPage();
  const results = [];

  try {
    const signedIn = await login(page, { baseUrl, user, pass });
    if (signedIn || !haveAuth) {
      await context.storageState({ path: AUTH_FILE });
      log("  · session cached to .auth.json\n");
    }

    for (const shot of shots) {
      const label = `${shot.file} (${shot.title})`;
      try {
        log(`  → ${label}`);
        await openTarget(page, shot, baseUrl);

        if (shot.waitFor) {
          await page.waitForSelector(shot.waitFor, { timeout: 30_000 });
        }
        await settle(page, shot.settleMs ?? config.defaultSettleMs ?? 1500);

        // Anything transient that would date the shot.
        const hide = [...(config.hide || []), ...(shot.hide || [])];
        if (hide.length) {
          await page.addStyleTag({ content: `${hide.join(",")} { visibility: hidden !important; }` });
        }

        const outPath = path.join(outDir, shot.file);
        await page.screenshot({ path: outPath, type: "png", scale: "css" });

        const { size } = await stat(outPath);
        log(`     ${page.url()}`);
        log(`     ${(size / 1024).toFixed(0)} KB\n`);
        results.push({ file: shot.file, ok: true, size, url: page.url() });
      } catch (error) {
        console.error(`     ✗ ${error.message}\n`);
        results.push({ file: shot.file, ok: false, error: error.message });
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const ok = results.filter((r) => r.ok);
  const bad = results.filter((r) => !r.ok);
  const total = ok.reduce((sum, r) => sum + r.size, 0);

  log(`  ${ok.length}/${results.length} captured · ${(total / 1024 / 1024).toFixed(1)} MB total`);
  if (bad.length) {
    log(`  failed: ${bad.map((r) => r.file).join(", ")}`);
    process.exitCode = 1;
  }
  log("");
}

main().catch((error) => fail(error.stack || error.message));
