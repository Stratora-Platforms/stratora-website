import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const URL = 'https://stratora.io/?v=c342276';

console.log('\n=== fresh-load overflow on LIVE ===');
console.log('  width | scrollWidth | ==vw | side-scroll | PASS');
let allOk = true;
for (const w of [375, 390, 414, 768, 1024, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await c.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0,90)); });
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.waitForLoadState('networkidle').catch(()=>{});
  await p.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y=0;y<h;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,110));} window.scrollTo(0,0); });
  await p.waitForTimeout(900);
  const r = await p.evaluate(async () => {
    window.scrollTo(600,0); await new Promise(r=>setTimeout(r,150));
    const sx = window.scrollX; window.scrollTo(0,0);
    return { vw: window.innerWidth, sw: document.documentElement.scrollWidth, sx };
  });
  const ok = r.sw === r.vw && r.sx === 0;
  if (!ok) allOk = false;
  console.log(`  ${String(w).padStart(5)} | ${String(r.sw).padStart(11)} | ${(r.sw===r.vw?'yes':'NO').padStart(4)} | ${(r.sx===0?'none':'YES').padStart(11)} | ${ok?'ok':'FAIL'}   errors=${errs.length}`);
  await c.close();
}
console.log(allOk ? '\n  All widths pass on live.' : '\n  FAILURES ON LIVE.');

console.log('\n=== new sections present on LIVE ===');
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0,100)); });
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.waitForLoadState('networkidle').catch(()=>{});
  await p.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y=0;y<h;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,110));} window.scrollTo(0,0); });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    heroEscalation: !!document.querySelector('.sd-escalation'),
    heroNoCorrelation: !document.body.innerText.includes('Probable cause') && !document.body.innerText.includes('alerts → 1 incident'),
    windowsServer: document.body.innerText.includes('Single MSI on Windows Server') && !document.body.innerText.includes('Windows Server 2016'),
    stratoraEvent: document.body.innerText.includes('every Stratora event'),
    stickyStory: document.querySelectorAll('#why-stratora .st-para').length,
    howItWorks: !!document.querySelector('.hiw-scan') || document.body.innerText.includes('Up and running in three steps'),
    featuresTabs: document.querySelectorAll('#features [role=tab]').length,
    featurePanels: document.querySelectorAll('#features [role=tabpanel]').length,
    trustLeaderLines: document.querySelectorAll('#security-compliance .sc-draw').length,
    pricingProCard: !!document.querySelector('.pr-card'),
    carouselViews: document.querySelectorAll('.ap-root').length,
    assets: performance.getEntriesByType('resource').filter(x=>x.name.includes('/assets/')).map(x=>x.name.split('/').pop()),
  }));
  console.log(JSON.stringify(r, null, 1));
  console.log('  console errors:', errs.length, errs.slice(0,3));
  await c.close();
}
await b.close();
