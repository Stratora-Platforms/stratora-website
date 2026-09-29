#!/usr/bin/env node
/**
 * Fresh-load overflow check.
 *
 * Each width gets its OWN browser context and a cold page load — a resize on an
 * already-loaded page re-runs every ResizeObserver and can hide a first-paint
 * bug, which is exactly how a broken mobile layout slipped through once.
 *
 *   node verify-overflow.mjs <baseUrl>
 *
 * Asserts, per width:
 *   - document.documentElement.scrollWidth === viewport width
 *   - the page cannot actually be scrolled sideways
 *   - #features and #why-stratora text wraps inside the viewport
 */

import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:4173";
const WIDTHS = [375, 390, 414, 768, 1024, 1440];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function check(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
  // Let every IntersectionObserver-gated section mount, without resizing.
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo(0, 0);
  });
  await sleep(900);

  const result = await page.evaluate(async () => {
    window.scrollTo(600, 0);
    await new Promise((r) => setTimeout(r, 150));
    const scrolledX = window.scrollX;
    window.scrollTo(0, 0);

    // Elements inside a horizontal scroller are excluded: the features rail is
    // a deliberately scrolling row of chips on mobile, so its chips extending
    // past the viewport inside their own scroll container is the design, not
    // an overflow. Everything else must wrap inside the screen.
    const inHorizontalScroller = (el) => {
      let n = el.parentElement;
      while (n && n !== document.documentElement) {
        const ox = getComputedStyle(n).overflowX;
        if (ox === "auto" || ox === "scroll") return true;
        n = n.parentElement;
      }
      return false;
    };

    const textFits = (id) => {
      const root = document.getElementById(id);
      if (!root) return { id, found: false };
      let worst = 0;
      let offender = null;
      root.querySelectorAll("h2, h3, p, span, button, li").forEach((el) => {
        if (!el.textContent?.trim()) return;
        if (inHorizontalScroller(el)) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.right > worst) {
          worst = r.right;
          offender = (typeof el.className === "string" ? el.className.slice(0, 40) : el.tagName);
        }
      });
      return { id, found: true, rightMost: Math.round(worst), fits: worst <= window.innerWidth + 1, offender };
    };

    return {
      viewport: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      scrolledX,
      features: textFits("features"),
      why: textFits("why-stratora"),
    };
  });

  await context.close();
  return result;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const rows = [];
  let allPass = true;

  for (const width of WIDTHS) {
    const r = await check(browser, width);
    const scrollWidthOk = r.docScrollWidth === r.viewport;
    const noSideScroll = r.scrolledX === 0;
    const featuresOk = r.features.found ? r.features.fits : false;
    const whyOk = r.why.found ? r.why.fits : false;
    const pass = scrollWidthOk && noSideScroll && featuresOk && whyOk;
    if (!pass) allPass = false;

    rows.push({
      width,
      scrollWidth: r.docScrollWidth,
      scrollWidthOk,
      noSideScroll,
      featuresRight: r.features.rightMost,
      featuresOk,
      whyRight: r.why.rightMost,
      whyOk,
      pass,
    });
  }

  await browser.close();

  console.log("\n  width | scrollWidth | ==vw | no side-scroll | #features | #why | PASS");
  console.log("  ------+-------------+------+----------------+-----------+------+-----");
  for (const r of rows) {
    console.log(
      `  ${String(r.width).padStart(5)} | ${String(r.scrollWidth).padStart(11)} | ${(r.scrollWidthOk ? "yes" : "NO").padStart(4)} | ${(r.noSideScroll ? "yes" : "NO").padStart(14)} | ${String(r.featuresRight).padStart(9)} | ${String(r.whyRight).padStart(4)} | ${r.pass ? "ok" : "FAIL"}`,
    );
  }
  console.log(`\n  ${allPass ? "All widths pass." : "FAILURES PRESENT."}\n`);
  process.exit(allPass ? 0 : 1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
