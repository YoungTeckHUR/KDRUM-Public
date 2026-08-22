const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const OUTPUT_DIR = process.env.AUDIT_DIR || 'homepage-v4-artifacts';
const LABEL = process.env.AUDIT_LABEL || 'Homepage stable tabbed audit';
const SCREENSHOTS = process.env.AUDIT_SCREENSHOTS !== '0';

const CASES = [
  { name: 'en-desktop', pathname: '/', viewport: { width: 1440, height: 1000 }, mobile: false, korean: false },
  { name: 'ko-desktop', pathname: '/ko/', viewport: { width: 1440, height: 1000 }, mobile: false, korean: true },
  { name: 'en-mobile', pathname: '/', viewport: { width: 390, height: 844 }, mobile: true, korean: false },
  { name: 'ko-mobile', pathname: '/ko/', viewport: { width: 390, height: 844 }, mobile: true, korean: true },
];
const TOP_TABS = ['overview', 'capabilities', 'results', 'programs', 'research', 'download'];
const OUTCOME_DIAGRAMS = ['runoff', 'river', 'flood', 'balance'];
const RESULT_DIAGRAMS = ['spatial', 'hydrograph', 'balanceReview', 'viewer1d'];
const PROGRAM_DIAGRAMS = {
  core: 'engine', authoring: 'input', floodviewer: 'viewer', geometry: 'terrain',
  output: 'netcdf', viewer1d: 'viewer1d', research: 'estuary',
};
const REPRESENTATIVE = ['rain-qc', 'wb', 'dam-operation', 'viewer1d'];

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function parseRgb(value) {
  const match = String(value || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  return match ? match.slice(1, 4).map(Number) : null;
}
function isLight(value) {
  const rgb = parseRgb(value);
  return Boolean(rgb && (rgb[0] + rgb[1] + rgb[2]) / 3 > 190);
}
function contrastRatio(foreground, background) {
  const fg = parseRgb(foreground); const bg = parseRgb(background);
  if (!fg || !bg) return 0;
  const lum = (rgb) => {
    const values = rgb.map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
  };
  const a = lum(fg); const b = lum(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
async function capture(page, name, selector = null, fullPage = false) {
  if (!SCREENSHOTS) return;
  const file = path.join(OUTPUT_DIR, name);
  if (selector) {
    const target = page.locator(selector);
    if (await target.count()) await target.screenshot({ path: file });
  } else {
    await page.screenshot({ path: file, fullPage });
  }
}
async function waitReady(page) {
  await page.waitForFunction(() => (
    document.documentElement.dataset.kdrumBrandRuntime === 'ready' &&
    document.documentElement.dataset.kdrumCapabilityAtlas === 'ready' &&
    document.documentElement.dataset.kdrumPublicCopy === 'ready' &&
    document.documentElement.dataset.kdrumExperienceV3Final === 'ready' &&
    document.documentElement.dataset.kdrumExperienceV4 === 'ready' &&
    document.documentElement.dataset.kdrumExperienceV4Stable === 'ready' &&
    Boolean(document.getElementById('ev4-shell'))
  ), null, { timeout: 20000 });
  await page.waitForTimeout(420);
}
async function activateTop(page, id) {
  const tab = page.locator(`#ev4-tab-${id}`);
  await tab.scrollIntoViewIfNeeded();
  await tab.click();
  await page.waitForFunction((panelId) => {
    const visible = [...document.querySelectorAll('.ev4-panel')].filter((item) => !item.hidden);
    return visible.length === 1 && visible[0].dataset.panel === panelId;
  }, id, { timeout: 5000 });
  await page.waitForTimeout(100);
}
async function activateCategory(page, index) {
  const tab = page.locator('#capabilities .catlas-tab').nth(index);
  await tab.scrollIntoViewIfNeeded();
  await tab.click();
  await page.waitForTimeout(280);
  await page.waitForFunction(() => {
    const cards = [...document.querySelectorAll('#capabilities .catlas-card')];
    return cards.length > 0 && cards.every((card) =>
      card.querySelectorAll('.ev4-card-action').length === 1 &&
      !card.querySelector('.ev3-card-visual,.catlas-mini')
    );
  }, null, { timeout: 5000 });
}
async function findCapability(page, id) {
  await activateTop(page, 'capabilities');
  const count = await page.locator('#capabilities .catlas-tab').count();
  for (let index = 0; index < count; index += 1) {
    await activateCategory(page, index);
    const card = page.locator(`#capabilities .catlas-card[data-id="${id}"]`);
    if (await card.count()) return card;
  }
  return null;
}

async function auditCase(browser, testCase, failures, reports) {
  const page = await browser.newPage({ viewport: testCase.viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${BASE_URL}${testCase.pathname}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await waitReady(page);
  const prefix = testCase.name;
  const report = { url, panels: {}, dialogs: {}, errors };

  const base = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('.ev4-tab')];
    const facts = [...document.querySelectorAll('.hero .ev4-facts')];
    const tabWrap = document.querySelector('.ev4-tab-wrap');
    const topbar = document.querySelector('.topbar');
    return {
      stable: document.documentElement.dataset.kdrumExperienceV4Stable,
      tabs: tabs.map((tab) => tab.dataset.tab),
      selectedTabs: tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true').length,
      visiblePanels: [...document.querySelectorAll('.ev4-panel')].filter((panel) => !panel.hidden).map((panel) => panel.dataset.panel),
      tabMinHeight: Math.min(...tabs.map((tab) => tab.getBoundingClientRect().height)),
      tabWrapPosition: getComputedStyle(tabWrap).position,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      topbarBackground: getComputedStyle(topbar).backgroundColor,
      factsContainers: facts.length,
      factsCount: facts[0]?.children.length || 0,
      legacyFactBlocks: document.querySelectorAll('.hero .ev3-hero-facts,.hero .hero-facts').length,
      heroMyWater: document.querySelector('.ev4-download-hero')?.href || '',
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });
  report.base = base;
  if (base.stable !== 'ready') failures.push(`${prefix}: stable finalizer not ready`);
  if (JSON.stringify(base.tabs) !== JSON.stringify(TOP_TABS) || base.selectedTabs !== 1) failures.push(`${prefix}: top tab structure invalid`);
  if (JSON.stringify(base.visiblePanels) !== JSON.stringify(['overview'])) failures.push(`${prefix}: overview is not the only initial panel`);
  if (base.tabMinHeight < 44) failures.push(`${prefix}: top tab target under 44px`);
  if (base.tabWrapPosition === 'sticky' || base.tabWrapPosition === 'fixed') failures.push(`${prefix}: top content tabs still sticky/fixed`);
  if (!isLight(base.bodyBackground) || !isLight(base.topbarBackground)) failures.push(`${prefix}: homepage/header is not light`);
  if (base.factsContainers !== 1 || base.factsCount !== 3 || base.legacyFactBlocks !== 0) failures.push(`${prefix}: hero facts duplicated (${base.factsContainers}/${base.factsCount}/${base.legacyFactBlocks})`);
  if (!base.heroMyWater.includes('menuId=15_126_128')) failures.push(`${prefix}: hero MyWater action missing`);
  if (base.scrollWidth > base.clientWidth + 1) failures.push(`${prefix}: horizontal overflow on entry`);
  await capture(page, `${prefix}-overview-full.png`, null, true);

  await activateTop(page, 'overview');
  const overview = await page.evaluate(() => ({
    outcomes: document.querySelectorAll('#outcomes .ev4-static-card').length,
    diagrams: [...document.querySelectorAll('#outcomes .ev4-static-card svg[data-diagram]')].map((svg) => svg.dataset.diagram),
    outcomeActions: document.querySelectorAll('#outcomes .ev4-card-action,#outcomes .ev3-card-action').length,
    outcomePointers: [...document.querySelectorAll('#outcomes .ev4-static-card')].map((card) => getComputedStyle(card).cursor),
    architectureSteps: document.querySelectorAll('#architecture .arch').length,
    height: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  report.panels.overview = overview;
  if (overview.outcomes !== 4 || JSON.stringify(overview.diagrams) !== JSON.stringify(OUTCOME_DIAGRAMS)) failures.push(`${prefix}: overview result diagrams invalid ${JSON.stringify(overview.diagrams)}`);
  if (overview.outcomeActions !== 0 || overview.outcomePointers.some((cursor) => cursor === 'pointer')) failures.push(`${prefix}: overview information cards appear clickable`);
  if (overview.architectureSteps !== 5) failures.push(`${prefix}: workflow does not contain 5 steps`);
  if ((!testCase.mobile && overview.height > 2150) || (testCase.mobile && overview.height > 2850)) failures.push(`${prefix}: overview still too long (${overview.height}px)`);
  if (overview.scrollWidth > overview.clientWidth + 1) failures.push(`${prefix}: overflow in overview`);
  await capture(page, `${prefix}-overview.png`, '#ev4-panel-overview');

  await activateTop(page, 'capabilities');
  const categoryCount = await page.locator('#capabilities .catlas-tab').count();
  let totalCards = 0; let totalActions = 0; let totalSymbols = 0; let legacyVisuals = 0; let groupVisuals = 0; let pointerCards = 0;
  const heights = [];
  for (let index = 0; index < categoryCount; index += 1) {
    await activateCategory(page, index);
    const values = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('#capabilities .catlas-card')];
      const tabVisuals = [...document.querySelectorAll('#capabilities .catlas-tab svg,#capabilities .catlas-tab img')];
      return {
        cards: cards.length,
        actions: cards.filter((card) => card.querySelectorAll('.ev4-card-action').length === 1).length,
        symbols: cards.filter((card) => card.querySelector('.catlas-symbol')).length,
        legacy: cards.filter((card) => card.querySelector('.ev3-card-visual,.catlas-mini')).length,
        groupVisuals: document.querySelectorAll('#capabilities .catlas-group-visual').length,
        visibleTabVisuals: tabVisuals.filter((node) => getComputedStyle(node).display !== 'none').length,
        pointers: cards.filter((card) => getComputedStyle(card).cursor === 'pointer').length,
        minAction: Math.min(...cards.map((card) => card.querySelector('.ev4-card-action')?.getBoundingClientRect().height || 0)),
        maxCard: Math.max(...cards.map((card) => card.getBoundingClientRect().height)),
        pageHeight: document.documentElement.scrollHeight,
      };
    });
    totalCards += values.cards; totalActions += values.actions; totalSymbols += values.symbols;
    legacyVisuals += values.legacy; groupVisuals += values.groupVisuals; pointerCards += values.pointers; heights.push(values.pageHeight);
    if (values.visibleTabVisuals !== 0) failures.push(`${prefix}: category tab decorative visual remains visible`);
    if (values.minAction < 44) failures.push(`${prefix}: capability action under 44px`);
    if ((!testCase.mobile && values.maxCard > 240) || (testCase.mobile && values.maxCard > 230)) failures.push(`${prefix}: capability card too tall (${values.maxCard}px)`);
  }
  report.panels.capabilities = { categoryCount, totalCards, totalActions, totalSymbols, legacyVisuals, groupVisuals, pointerCards, maxHeight: Math.max(...heights) };
  if (categoryCount !== 8) failures.push(`${prefix}: expected 8 capability categories, found ${categoryCount}`);
  if (totalCards !== 46 || totalActions !== 46 || totalSymbols !== 46 || pointerCards !== 46) failures.push(`${prefix}: capability totals invalid ${totalCards}/${totalActions}/${totalSymbols}/${pointerCards}`);
  if (legacyVisuals !== 0 || groupVisuals !== 0) failures.push(`${prefix}: misleading capability artwork remains (${legacyVisuals}/${groupVisuals})`);
  if ((!testCase.mobile && Math.max(...heights) > 2100) || (testCase.mobile && Math.max(...heights) > 2500)) failures.push(`${prefix}: capability panel still too long (${Math.max(...heights)}px)`);
  await capture(page, `${prefix}-capabilities.png`, '#ev4-panel-capabilities');

  for (const id of REPRESENTATIVE) {
    const card = await findCapability(page, id);
    if (!card) { failures.push(`${prefix}: representative capability missing ${id}`); continue; }
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(260);
    await card.click();
    const dialog = page.locator('#catlas-dialog');
    await dialog.waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(100);
    const metrics = await dialog.evaluate((element) => {
      const title = element.querySelector('#catlas-title');
      const header = element.querySelector('.catlas-dbar');
      const close = element.querySelector('.catlas-close');
      const titleStyle = title ? getComputedStyle(title) : null;
      const headerStyle = header ? getComputedStyle(header) : null;
      const closeStyle = close ? getComputedStyle(close) : null;
      const closeRect = close?.getBoundingClientRect();
      return {
        background: getComputedStyle(element).backgroundColor,
        title: title?.textContent.trim() || '',
        titleColor: titleStyle?.color || '',
        headerBackground: headerStyle?.backgroundColor || '',
        closeColor: closeStyle?.color || '',
        closeBackground: closeStyle?.backgroundColor || '',
        closeWidth: closeRect?.width || 0,
        closeHeight: closeRect?.height || 0,
        svg: element.querySelectorAll('.catlas-graphic svg').length,
        flow: element.querySelectorAll('.catlas-flow > div').length,
        panels: element.querySelectorAll('.catlas-panel').length,
        docText: element.querySelector('.catlas-doc')?.textContent.trim() || '',
      };
    });
    metrics.titleContrast = contrastRatio(metrics.titleColor, metrics.headerBackground);
    metrics.closeContrast = contrastRatio(metrics.closeColor, metrics.closeBackground);
    report.dialogs[id] = metrics;
    if (!isLight(metrics.background) || !metrics.title || metrics.svg !== 1 || metrics.flow !== 3 || metrics.panels < 2 || !metrics.docText) failures.push(`${prefix}: incomplete detail dialog ${id}`);
    if (metrics.titleContrast < 4.5 || metrics.closeContrast < 4.5) failures.push(`${prefix}: low dialog contrast ${id}`);
    if (metrics.closeWidth < 44 || metrics.closeHeight < 44) failures.push(`${prefix}: close target too small ${id}`);
    if (SCREENSHOTS && ['wb', 'viewer1d'].includes(id)) await capture(page, `${prefix}-dialog-${id}.png`, '#catlas-dialog');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(60);
  }

  await activateTop(page, 'results');
  const results = await page.evaluate(() => ({
    cards: document.querySelectorAll('#results .ev4-static-card').length,
    diagrams: [...document.querySelectorAll('#results .ev4-static-card svg[data-diagram]')].map((svg) => svg.dataset.diagram),
    actions: document.querySelectorAll('#results .ev4-card-action,#results .ev3-card-action').length,
    pointers: [...document.querySelectorAll('#results .ev4-static-card')].map((card) => getComputedStyle(card).cursor),
    height: document.documentElement.scrollHeight,
  }));
  report.panels.results = results;
  if (results.cards !== 4 || JSON.stringify(results.diagrams) !== JSON.stringify(RESULT_DIAGRAMS)) failures.push(`${prefix}: results panel invalid ${JSON.stringify(results.diagrams)}`);
  if (results.actions !== 0 || results.pointers.some((cursor) => cursor === 'pointer')) failures.push(`${prefix}: result cards appear clickable`);
  if ((!testCase.mobile && results.height > 1800) || (testCase.mobile && results.height > 2300)) failures.push(`${prefix}: results panel too long (${results.height}px)`);
  await capture(page, `${prefix}-results.png`, '#ev4-panel-results');

  await activateTop(page, 'programs');
  const programs = await page.evaluate((expected) => {
    const cards = [...document.querySelectorAll('#platform .ev3-program-card')];
    const tabBottom = document.querySelector('.ev4-tab-wrap')?.getBoundingClientRect().bottom || 0;
    const headingTop = document.querySelector('#platform h2')?.getBoundingClientRect().top || 0;
    return {
      count: cards.length,
      roles: cards.map((card) => card.dataset.programRole || ''),
      diagrams: cards.map((card) => card.querySelector('svg[data-diagram]')?.dataset.diagram || ''),
      expected: cards.map((card) => expected[card.dataset.programRole] || ''),
      actions: document.querySelectorAll('#platform .ev4-card-action,#platform .ev3-card-action').length,
      pointers: cards.map((card) => getComputedStyle(card).cursor),
      headingClear: headingTop >= tabBottom - 1,
      height: document.documentElement.scrollHeight,
    };
  }, PROGRAM_DIAGRAMS);
  report.panels.programs = programs;
  if (programs.count !== 7 || programs.roles.some((role) => !role)) failures.push(`${prefix}: program roles incomplete`);
  if (JSON.stringify(programs.diagrams) !== JSON.stringify(programs.expected)) failures.push(`${prefix}: program diagrams invalid ${JSON.stringify(programs.diagrams)}`);
  if (programs.actions !== 0 || programs.pointers.some((cursor) => cursor === 'pointer')) failures.push(`${prefix}: program cards appear clickable`);
  if (!programs.headingClear) failures.push(`${prefix}: program heading is clipped by navigation`);
  if ((!testCase.mobile && programs.height > 2200) || (testCase.mobile && programs.height > 3200)) failures.push(`${prefix}: programs panel too long (${programs.height}px)`);
  await capture(page, `${prefix}-programs.png`, '#ev4-panel-programs');

  await activateTop(page, 'research');
  const research = await page.evaluate(() => ({
    cards: document.querySelectorAll('#research .grid3 > .card').length,
    actions: document.querySelectorAll('#research .ev4-card-action,#research .ev3-card-action').length,
    pointers: [...document.querySelectorAll('#research .grid3 > .card')].map((card) => getComputedStyle(card).cursor),
    history: document.querySelectorAll('#research details.ev4-history').length,
    historyOpen: Boolean(document.querySelector('#research details.ev4-history')?.open),
    resources: document.querySelectorAll('#resources .ev4-resource-link').length,
    height: document.documentElement.scrollHeight,
  }));
  report.panels.research = research;
  if (research.cards < 6 || research.actions !== 0 || research.pointers.some((cursor) => cursor === 'pointer')) failures.push(`${prefix}: research cards invalid`);
  if (research.history !== 1 || research.historyOpen) failures.push(`${prefix}: research timeline not collapsed`);
  if (research.resources !== 4) failures.push(`${prefix}: expected 4 research resource links`);
  if ((!testCase.mobile && research.height > 2600) || (testCase.mobile && research.height > 3900)) failures.push(`${prefix}: research panel too long (${research.height}px)`);
  await capture(page, `${prefix}-research.png`, '#ev4-panel-research');

  await activateTop(page, 'download');
  const download = await page.evaluate(() => {
    const links = [...document.querySelectorAll('#references .ev4-download-actions a')];
    const panel = document.querySelector('#references .ev4-download-panel');
    return {
      panel: Boolean(panel), links: links.map((link) => link.href), text: panel?.textContent || '',
      primary: document.querySelector('#references .ev4-download-primary')?.textContent.trim() || '',
      height: document.documentElement.scrollHeight,
    };
  });
  report.panels.download = download;
  if (!download.panel || download.links.length !== 3 || !download.primary) failures.push(`${prefix}: download actions incomplete`);
  if (!download.links.some((href) => href.includes('menuId=15_126_128')) || !download.links.some((href) => href.includes('menuId=15_126_127'))) failures.push(`${prefix}: MyWater/terms link missing`);
  if (!download.text.includes('MyWater')) failures.push(`${prefix}: MyWater wording missing`);
  if (testCase.korean && !download.text.includes('무료로 내려받아 사용할 수 있습니다')) failures.push(`${prefix}: Korean free-download wording missing`);
  if (!testCase.korean && !download.text.includes('free of charge')) failures.push(`${prefix}: English free-download wording missing`);
  if ((!testCase.mobile && download.height > 1500) || (testCase.mobile && download.height > 1900)) failures.push(`${prefix}: download panel too long (${download.height}px)`);
  await capture(page, `${prefix}-download.png`, '#ev4-panel-download');

  if (errors.length) failures.push(`${prefix}: browser errors: ${errors.join(' | ')}`);
  reports[prefix] = report;
  await page.close();
}

(async () => {
  ensureDir(OUTPUT_DIR);
  const failures = [];
  const reports = {};
  const browser = await chromium.launch({ headless: true });
  try {
    for (const testCase of CASES) await auditCase(browser, testCase, failures, reports);
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'report.json'), JSON.stringify({ label: LABEL, failures, reports }, null, 2));
  if (failures.length) {
    console.error('HOMEPAGE STABLE TABBED AUDIT FAILED');
    failures.forEach((failure) => console.error(` - ${failure}`));
    process.exit(1);
  }
  console.log('HOMEPAGE STABLE TABBED AUDIT PASS');
})();
