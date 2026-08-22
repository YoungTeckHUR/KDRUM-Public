const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const AUDIT_DIR = process.env.AUDIT_DIR || 'concept-visual-artifacts';
const AUDIT_LABEL = process.env.AUDIT_LABEL || 'Homepage concept visuals audit';
const SCREENSHOTS = process.env.AUDIT_SCREENSHOTS !== '0';

const cases = [
  { id: 'en-desktop', route: '/', width: 1440, height: 1000, ko: false, mobile: false },
  { id: 'ko-desktop', route: '/ko/', width: 1440, height: 1000, ko: true, mobile: false },
  { id: 'en-mobile', route: '/', width: 390, height: 844, ko: false, mobile: true },
  { id: 'ko-mobile', route: '/ko/', width: 390, height: 844, ko: true, mobile: true },
];

fs.mkdirSync(AUDIT_DIR, { recursive: true });

function pageUrl(route) {
  return `${BASE_URL}${route}`;
}

async function activate(page, tab) {
  const button = page.locator(`.ev4-tab[data-tab="${tab}"]`);
  await button.waitFor({ state: 'visible', timeout: 15000 });
  await button.click();
  await page.waitForFunction(
    value => document.documentElement.dataset.ev4ActiveTab === value,
    tab,
    { timeout: 10000 }
  );
  await page.waitForTimeout(250);
}

async function capture(page, name, selector) {
  if (!SCREENSHOTS) return;
  const loc = page.locator(selector);
  if (await loc.count()) {
    await loc.first().screenshot({ path: path.join(AUDIT_DIR, `${name}.png`) });
  }
}

async function inspectCase(browser, testCase, failures, reports) {
  const page = await browser.newPage({
    viewport: { width: testCase.width, height: testCase.height },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror:${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console:${message.text()}`);
  });
  page.on('requestfailed', request => {
    const url = request.url();
    if (url.includes('/assets/concepts/') || url.includes('concept-visuals-v1')) {
      errors.push(`requestfailed:${url}:${request.failure()?.errorText || 'unknown'}`);
    }
  });

  await page.goto(pageUrl(testCase.route), { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(
    () => document.documentElement.dataset.kdrumConceptVisuals === 'ready',
    null,
    { timeout: 30000 }
  );
  await page.waitForTimeout(700);

  const expectedIds = ['workflow', 'runoff', 'flood', 'balance', 'viewer', 'download'];
  const base = await page.evaluate((ids) => {
    const figures = [...document.querySelectorAll('.concept-figure[data-concept-id]')];
    const byId = Object.fromEntries(ids.map(id => [id, figures.filter(f => f.dataset.conceptId === id).length]));
    const images = figures.map(figure => {
      const image = figure.querySelector('img');
      const rect = figure.getBoundingClientRect();
      return {
        id: figure.dataset.conceptId,
        alt: image?.getAttribute('alt') || '',
        src: image?.getAttribute('src') || '',
        complete: Boolean(image?.complete),
        naturalWidth: image?.naturalWidth || 0,
        naturalHeight: image?.naturalHeight || 0,
        width: rect.width,
        height: rect.height,
        badge: figure.querySelector('.concept-badge')?.textContent.trim() || '',
      };
    });
    return {
      ready: document.documentElement.dataset.kdrumConceptVisuals,
      byId,
      total: figures.length,
      images,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      loaderScript: Boolean(document.querySelector('script[data-kdrum-concept-visuals-v1]')),
      loaderStyle: Boolean(document.querySelector('link[data-kdrum-concept-visuals-v1]')),
    };
  }, expectedIds);

  const prefix = testCase.id;
  if (base.ready !== 'ready' || !base.loaderScript || !base.loaderStyle) {
    failures.push(`${prefix}: concept runtime/style not ready`);
  }
  const minCounts = { workflow: 1, runoff: 2, flood: 1, balance: 2, viewer: 2, download: 1 };
  for (const [id, count] of Object.entries(minCounts)) {
    if ((base.byId[id] || 0) < count) failures.push(`${prefix}: missing ${id} concept visual (${base.byId[id] || 0}/${count})`);
  }
  for (const item of base.images) {
    if (!item.alt) failures.push(`${prefix}: ${item.id} image has empty alt`);
    if (!item.src.includes('/assets/concepts/') && !item.src.includes('assets/concepts/')) failures.push(`${prefix}: ${item.id} image path invalid (${item.src})`);
    if (!item.complete || item.naturalWidth < 1 || item.naturalHeight < 1) failures.push(`${prefix}: ${item.id} image did not load`);
    if (item.width < 70 || item.height < 70) failures.push(`${prefix}: ${item.id} visual rendered too small (${Math.round(item.width)}x${Math.round(item.height)})`);
  }
  if (base.overflow > 1) failures.push(`${prefix}: horizontal overflow ${base.overflow}px`);

  await activate(page, 'overview');
  const overview = await page.evaluate(() => ({
    workflowVisible: Boolean(document.querySelector('#architecture .concept-workflow')?.getClientRects().length),
    workflowImage: document.querySelector('#architecture .concept-workflow img')?.getAttribute('src') || '',
    outcomeConcepts: [...document.querySelectorAll('#outcomes [data-concept-id]')].map(n => n.dataset.conceptId),
  }));
  if (!overview.workflowVisible || !overview.workflowImage.includes('kdrum-workflow.svg')) failures.push(`${prefix}: workflow visual not visible on overview`);
  if (!overview.outcomeConcepts.includes('runoff') || !overview.outcomeConcepts.includes('flood') || !overview.outcomeConcepts.includes('balance')) failures.push(`${prefix}: overview result concepts incomplete`);
  await capture(page, `${prefix}-overview-concepts`, '#ev4-panel-overview');

  await activate(page, 'results');
  const results = await page.evaluate(() => ({
    concepts: [...document.querySelectorAll('#results [data-concept-id]')].map(n => n.dataset.conceptId),
    visible: [...document.querySelectorAll('#results [data-concept-id]')].filter(n => n.getClientRects().length).length,
  }));
  for (const id of ['runoff', 'balance', 'viewer']) {
    if (!results.concepts.includes(id)) failures.push(`${prefix}: results tab missing ${id}`);
  }
  if (results.visible < 3) failures.push(`${prefix}: result concepts not visible`);
  await capture(page, `${prefix}-results-concepts`, '#ev4-panel-results');

  await activate(page, 'programs');
  const programs = await page.evaluate(() => {
    const viewer = document.querySelector('#platform [data-program-role="viewer1d"]');
    const image = viewer?.querySelector('[data-concept-id="viewer"] img');
    return {
      viewer: Boolean(viewer),
      concept: Boolean(image),
      alt: image?.getAttribute('alt') || '',
      pointer: viewer ? getComputedStyle(viewer).cursor : '',
      actions: viewer?.querySelectorAll('.ev4-card-action,.ev3-card-action').length || 0,
    };
  });
  if (!programs.viewer || !programs.concept) failures.push(`${prefix}: 1D viewer program concept missing`);
  if (programs.pointer === 'pointer' || programs.actions !== 0) failures.push(`${prefix}: viewer program card appears clickable`);
  if (testCase.ko) {
    if (!programs.alt.includes('별도 개발 중') || !programs.alt.includes('공개 GitHub')) failures.push(`${prefix}: Korean viewer public-boundary alt missing`);
  } else if (!programs.alt.includes('Separate development') || !programs.alt.includes('public GitHub')) {
    failures.push(`${prefix}: English viewer public-boundary alt missing`);
  }
  await capture(page, `${prefix}-programs-concepts`, '#ev4-panel-programs');

  await activate(page, 'download');
  const download = await page.evaluate(() => {
    const figure = document.querySelector('#references [data-concept-id="download"]');
    const image = figure?.querySelector('img');
    const links = [...document.querySelectorAll('#references .ev4-download-actions a')];
    const primary = document.querySelector('#references .ev4-download-primary');
    return {
      concept: Boolean(figure),
      alt: image?.getAttribute('alt') || '',
      badge: figure?.querySelector('.concept-badge')?.textContent.trim() || '',
      links: links.map(link => link.href),
      primaryText: primary?.textContent.trim() || '',
      primaryVisible: Boolean(primary?.getClientRects().length),
    };
  });
  if (!download.concept) failures.push(`${prefix}: MyWater concept visual missing`);
  if (!download.alt.toLowerCase().includes('mywater')) failures.push(`${prefix}: MyWater alt missing`);
  if (!download.badge) failures.push(`${prefix}: MyWater concept badge missing`);
  if (download.links.length !== 3) failures.push(`${prefix}: expected 3 MyWater actions, found ${download.links.length}`);
  if (!download.links.some(url => url.includes('menuId=15_126_128')) || !download.links.some(url => url.includes('menuId=15_126_127'))) failures.push(`${prefix}: MyWater or terms URL missing`);
  if (!download.primaryVisible || !download.primaryText) failures.push(`${prefix}: primary download action not visible`);
  await capture(page, `${prefix}-download-concept`, '#ev4-panel-download');

  const staticBehavior = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#outcomes .ev4-static-card,#results .ev4-static-card,#platform .ev3-program-card,#research .ev4-static-card')];
    return {
      pointers: cards.map(card => getComputedStyle(card).cursor),
      actions: cards.reduce((sum, card) => sum + card.querySelectorAll('.ev4-card-action,.ev3-card-action').length, 0),
      capabilityActions: document.querySelectorAll('#capabilities .ev4-card-action').length,
    };
  });
  if (staticBehavior.pointers.some(value => value === 'pointer') || staticBehavior.actions !== 0) failures.push(`${prefix}: static concept cards appear clickable`);
  if (staticBehavior.capabilityActions !== 46) failures.push(`${prefix}: capability action count changed (${staticBehavior.capabilityActions})`);

  if (errors.length) failures.push(`${prefix}: browser errors: ${errors.join(' | ')}`);
  reports[prefix] = { base, overview, results, programs, download, staticBehavior, errors };
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const reports = {};
  try {
    for (const testCase of cases) await inspectCase(browser, testCase, failures, reports);
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(AUDIT_DIR, 'metrics.json'), JSON.stringify({ label: AUDIT_LABEL, baseUrl: BASE_URL, reports, failures }, null, 2));
  if (failures.length) {
    console.error(`${AUDIT_LABEL.toUpperCase()} FAILED`);
    failures.forEach(item => console.error(` - ${item}`));
    process.exit(1);
  }
  console.log(`${AUDIT_LABEL.toUpperCase()} PASSED`);
})();
