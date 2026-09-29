#!/usr/bin/env node
/**
 * Captures every homepage section at desktop and phone widths into the
 * handoff bundle's verify/ folder, for side-by-side comparison with
 * $BUNDLE/screens/.
 *
 *   node verify-sections.mjs <baseUrl> <outDir>
 *
 * Also captures the mid-animation states the reference screens show: the
 * install demo's three phases, and each of the ten feature slides.
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:4173";
const OUT = process.argv[3] || "verify";

const SECTIONS = [
  ["hero", "main > section:first-of-type"],
  ["carousel", "#screenshots"],
  ["why-stratora", "#why-stratora"],
  ["how-it-works", "section:has(h2:text-is('Up and running in three steps'))"],
  ["stats", ".stat-scope"],
  ["features", "#features"],
  ["trust", "#security-compliance"],
  ["pricing", "#pricing"],
  ["downloads", "#downloads"],
  ["about", "#about"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  // Walk the page so every IntersectionObserver-gated section mounts and runs.
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await sleep(1200);
}

async function shoot(page, dir, name, selector) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) {
    console.log(`  ✗ ${name}: no match for ${selector}`);
    return;
  }
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await sleep(400);
  await el.screenshot({ path: path.join(dir, `${name}.png`), scale: "css" }).catch((e) => {
    console.log(`  ✗ ${name}: ${e.message.split("\n")[0]}`);
  });
  console.log(`  · ${name}`);
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const [label, width, height] of [
    ["1440", 1440, 900],
    ["390", 390, 844],
  ]) {
    const dir = path.join(OUT, label);
    await mkdir(dir, { recursive: true });
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    console.log(`\n${label}x${height}`);
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await settle(page);
    for (const [name, selector] of SECTIONS) await shoot(page, dir, name, selector);
    await context.close();
  }

  // Mid-animation states the reference screens document.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("\ninstall phases");
  const phaseDir = path.join(OUT, "states");
  await mkdir(phaseDir, { recursive: true });
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
  const how = page.locator("section:has(h2:text-is('Up and running in three steps'))");
  await how.scrollIntoViewIfNeeded();
  for (const [name, waitMs] of [["04-install-1", 400], ["04-install-2", 3200], ["04-install-3", 6000]]) {
    await sleep(waitMs);
    await how.screenshot({ path: path.join(phaseDir, `${name}.png`), scale: "css" });
    console.log(`  · ${name}`);
  }

  console.log("\nfeature slides");
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await settle(page);
  const features = page.locator("#features");
  await features.scrollIntoViewIfNeeded();
  await sleep(500);
  const tabs = page.locator("#features [role=tab]");
  const count = await tabs.count();
  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click();
    await sleep(900);
    const n = String(i + 1).padStart(2, "0");
    await features.screenshot({ path: path.join(phaseDir, `06-features-${n}.png`), scale: "css" });
    console.log(`  · 06-features-${n}`);
  }

  await context.close();
  await browser.close();
  console.log(`\nSaved to ${OUT}\n`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
