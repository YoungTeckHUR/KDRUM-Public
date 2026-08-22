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
  await page.waitForTimeout(180);
}

async function capture(page, name, selector) {
  if (!SCREENSHOTS) return;
  const loc = page.locator(selector).first();
  if (await loc.count()) await loc.screenshot({ path: path.join(AUDIT_DIR, `${name}.png`) });
}

async function inspectVisibleFigures(page, selector) {
  await page.waitForFunction((target) => {
    const figures = [...document.querySelectorAll(target)].filter(node => node.getClientRects().length);
    return figures.length && figures.every(figure => {
      const img = figure.querySelector('img');
      return img && img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
    });
  }, selector, { timeout: 10000 });
  return page.evaluate((target) => [...document.querySelectorAll(target)]
    .filter(node => node.getClientRects().length)
    .map(figure => {
      const image = figure.querySelector('img');
      const rect = figure.getBoundingClientRect();
      return {
        id: figure.dataset.conceptId || '',
        alt: image?.alt || '',
        src: image?.getAttribute('src') || '',
        width: rect.width,
        height: rect.height,
        naturalWidth: image?.naturalWidth || 0,
        naturalHeight: image?.naturalHeight || 0,
        badge: figure.querySelector('.concept-badge')?.textContent.trim() || '',
      };
    }), selector);
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
  await page.waitForTimeout(500);

  const prefix = testCase.id;
  const expected = { workflow: 1, runoff: 2, flood: 1, balance: 2, viewer: 2, download: 1 };
  const inventory = await page.evaluate((ids) => {
    const figures = [...document.querySelectorAll('.concept-figure[data-concept-id]')];
    return {
      ready: document.documentElement.dataset.kdrumConceptVisuals,
      counts: Object.fromEntries(ids.map(id => [id, figures.filter(node => node.dataset.conceptId === id).length])),
      entries: figures.map(figure => ({
        id: figure.dataset.conceptId,
        alt: figure.querySelector('img')?.alt || '',
        src: figure.querySelector('img')?.getAttribute('src') || '',
        badge: figure.querySelector('.concept-badge')?.textContent.trim() || '',
      })),
      loaderScript: Boolean(document.querySelector('script[data-kdrum-concept-visuals-v1]')),
      loaderStyle: Boolean(document.querySelector('link[data-kdrum-concept-visuals-v1]')),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, Object.keys(expected));

  if (inventory.ready !== 'ready' || !inventory.loaderScript || !inventory.loaderStyle) failures.push(`${prefix}: concept runtime/style not ready`);
  for (const [id, count] of Object.entries(expected)) {
    if ((inventory.counts[id] || 0) < count) failures.push(`${prefix}: missing ${id} concept (${inventory.counts[id] || 0}/${count})`);
  }
  for (const entry of inventory.entries) {
    if (!entry.alt || !entry.badge) failures.push(`${prefix}: incomplete accessible text for ${entry.id}`);
    if (!entry.src.includes('assets/concepts/')) failures.push(`${prefix}: invalid concept path ${entry.id}/${entry.src}`);
  }
  if (inventory.overflow > 1) failures.push(`${prefix}: horizontal overflow ${inventory.overflow}px`);

  await activate(page, 'overview');
  const overviewFigures = await inspectVisibleFigures(page, '#ev4-panel-overview .concept-figure[data-concept-id]');
  const overviewIds = overviewFigures.map(item => item.id);
  for (const id of ['workflow', 'runoff', 'flood', 'balance']) {
    if (!overviewIds.includes(id)) failures.push(`${prefix}: overview missing visible ${id} concept`);
  }
  for (const item of overviewFigures) {
    if (item.width < 90 || item.height < 90) failures.push(`${prefix}: overview ${item.id} too small (${Math.round(item.width)}x${Math.round(item.height)})`);
  }
  await capture(page, `${prefix}-overview-concepts`, '#ev4-panel-overview');

  await activate(page, 'results');
  const resultFigures = await inspectVisibleFigures(page, '#ev4-panel-results .concept-figure[data-concept-id]');
  const resultIds = resultFigures.map(item => item.id);
  for (const id of ['runoff', 'balance', 'viewer']) {
    if (!resultIds.includes(id)) failures.push(`${prefix}: results missing visible ${id} concept`);
  }
  for (const item of resultFigures) {
    if (item.width < 90 || item.height < 90) failures.push(`${prefix}: results ${item.id} too small (${Math.round(item.width)}x${Math.round(item.height)})`);
  }
  await capture(page, `${prefix}-results-concepts`, '#ev4-panel-results');

  await activate(page, 'programs');
  const programFigures = await inspectVisibleFigures(page, '#ev4-panel-programs [data-program-role="viewer1d"] .concept-figure[data-concept-id="viewer"]');
  const programState = await page.evaluate(() => {
    const viewer = document.querySelector('#platform [data-program-role="viewer1d"]');
    return {
      pointer: viewer ? getComputedStyle(viewer).cursor : '',
      actions: viewer?.querySelectorAll('.ev4-card-action,.ev3-card-action').length || 0,
      alt: viewer?.querySelector('[data-concept-id="viewer"] img')?.alt || '',
      legacyDiagram: viewer?.querySelectorAll('svg[data-diagram="viewer1d"]').length || 0,
    };
  });
  if (programFigures.length !== 1) failures.push(`${prefix}: 1D viewer program concept missing`);
  if (programState.pointer === 'pointer' || programState.actions !== 0) failures.push(`${prefix}: viewer program card appears clickable`);
  if (programState.legacyDiagram !== 1) failures.push(`${prefix}: viewer compatibility diagram metadata lost`);
  if (testCase.ko) {
    if (!programState.alt.includes('별도 개발 중') || !programState.alt.includes('공개 GitHub')) failures.push(`${prefix}: Korean viewer boundary alt missing`);
  } else if (!programState.alt.includes('Separate development') || !programState.alt.includes('public GitHub')) {
    failures.push(`${prefix}: English viewer boundary alt missing`);
  }
  await capture(page, `${prefix}-programs-concepts`, '#ev4-panel-programs');

  await activate(page, 'download');
  const downloadFigures = await inspectVisibleFigures(page, '#ev4-panel-download .concept-figure[data-concept-id="download"]');
  const downloadState = await page.evaluate(() => {
    const figure = document.querySelector('#references [data-concept-id="download"]');
    const links = [...document.querySelectorAll('#references .ev4-download-actions a')];
    return {
      alt: figure?.querySelector('img')?.alt || '',
      badge: figure?.querySelector('.concept-badge')?.textContent.trim() || '',
      links: links.map(link => ({ href: link.href, text: link.textContent.trim(), height: link.getBoundingClientRect().height })),
      primaryVisible: Boolean(document.querySelector('#references .ev4-download-primary')?.getClientRects().length),
    };
  });
  if (downloadFigures.length !== 1 || !downloadState.alt.toLowerCase().includes('mywater') || !downloadState.badge) failures.push(`${prefix}: MyWater concept incomplete`);
  if (downloadState.links.length !== 3 || !downloadState.links.some(link => link.href.includes('menuId=15_126_128')) || !downloadState.links.some(link => link.href.includes('menuId=15_126_127'))) failures.push(`${prefix}: MyWater actions invalid`);
  if (downloadState.links.some(link => link.height < 44) || !downloadState.primaryVisible) failures.push(`${prefix}: MyWater target size/visibility invalid`);
  await capture(page, `${prefix}-download-concept`, '#ev4-panel-download');

  await activate(page, 'capabilities');
  const categories = await page.locator('#capabilities .catlas-tab').count();
  let totalCards = 0;
  let totalActions = 0;
  let totalPointers = 0;
  for (let index = 0; index < categories; index += 1) {
    const tab = page.locator('#capabilities .catlas-tab').nth(index);
    await tab.click();
    await page.waitForTimeout(100);
    const values = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('#capabilities .catlas-card')];
      return {
        cards: cards.length,
        actions: cards.filter(card => card.querySelectorAll('.ev4-card-action').length === 1).length,
        pointers: cards.filter(card => getComputedStyle(card).cursor === 'pointer').length,
        genericVisuals: document.querySelectorAll('#capabilities .catlas-group-visual,#capabilities .ev3-group-concept,#capabilities .ev3-card-visual').length,
      };
    });
    totalCards += values.cards;
    totalActions += values.actions;
    totalPointers += values.pointers;
    if (values.genericVisuals !== 0) failures.push(`${prefix}: obsolete capability artwork remains in category ${index}`);
  }
  if (categories !== 8 || totalCards !== 46 || totalActions !== 46 || totalPointers !== 46) failures.push(`${prefix}: capability inventory changed ${categories}/${totalCards}/${totalActions}/${totalPointers}`);

  const staticState = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#outcomes .ev4-static-card,#results .ev4-static-card,#platform .ev3-program-card,#research .ev4-static-card')];
    return {
      pointers: cards.map(card => getComputedStyle(card).cursor),
      actions: cards.reduce((sum, card) => sum + card.querySelectorAll('.ev4-card-action,.ev3-card-action').length, 0),
      compatibility: {
        outcomes: [...document.querySelectorAll('#outcomes svg[data-diagram]')].map(svg => svg.dataset.diagram),
        results: [...document.querySelectorAll('#results svg[data-diagram]')].map(svg => svg.dataset.diagram),
        programs: [...document.querySelectorAll('#platform svg[data-diagram]')].map(svg => svg.dataset.diagram),
      },
    };
  });
  if (staticState.pointers.some(value => value === 'pointer') || staticState.actions !== 0) failures.push(`${prefix}: static cards appear clickable`);

  if (errors.length) failures.push(`${prefix}: browser errors: ${errors.join(' | ')}`);
  reports[prefix] = { inventory, overviewFigures, resultFigures, programState, downloadState, categories, totalCards, totalActions, staticState, errors };
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
