const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const OUTPUT_DIR = process.env.AUDIT_DIR || 'homepage-v4-artifacts';
const LABEL = process.env.AUDIT_LABEL || 'Homepage tabbed v4 audit';
const SCREENSHOTS = process.env.AUDIT_SCREENSHOTS !== '0';

const CASES = [
  { name: 'en-desktop', pathname: '/', viewport: { width: 1440, height: 1000 }, mobile: false, korean: false },
  { name: 'ko-desktop', pathname: '/ko/', viewport: { width: 1440, height: 1000 }, mobile: false, korean: true },
  { name: 'en-mobile', pathname: '/', viewport: { width: 390, height: 844 }, mobile: true, korean: false },
  { name: 'ko-mobile', pathname: '/ko/', viewport: { width: 390, height: 844 }, mobile: true, korean: true },
];

const TOP_TABS = ['overview', 'capabilities', 'results', 'programs', 'research', 'download'];
const CATEGORY_DIAGRAMS = {
  forcing: 'radar',
  hydrology: 'runoff',
  terrain: 'terrain',
  audit: 'balance',
  river: 'river',
  flood: 'flood',
  transport: 'transport',
  platform: 'program',
};
const OUTCOME_DIAGRAMS = ['runoff', 'river', 'flood', 'balance'];
const RESULT_DIAGRAMS = ['spatial', 'hydrograph', 'balanceReview', 'viewer1d'];
const PROGRAM_DIAGRAMS = {
  core: 'engine',
  authoring: 'input',
  floodviewer: 'viewer',
  geometry: 'terrain',
  output: 'netcdf',
  viewer1d: 'viewer1d',
  research: 'estuary',
};
const RESEARCH_DIAGRAMS = new Set(['radar', 'snow', 'balance', 'parallel', 'swgw', 'wildfire']);
const REPRESENTATIVE = ['rain-qc', 'wb', 'dam-operation', 'viewer1d'];

function parseRgb(value) {
  const match = String(value || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  return match ? match.slice(1, 4).map(Number) : null;
}

function isLight(value) {
  const rgb = parseRgb(value);
  return Boolean(rgb && (rgb[0] + rgb[1] + rgb[2]) / 3 > 190);
}

function contrastRatio(foreground, background) {
  const fg = parseRgb(foreground);
  const bg = parseRgb(background);
  if (!fg || !bg) return 0;
  const luminance = (rgb) => {
    const values = rgb.map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
  };
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

async function waitForV4(page) {
  await page.waitForFunction(() => (
    document.documentElement.dataset.kdrumBrandRuntime === 'ready' &&
    document.documentElement.dataset.kdrumCapabilityAtlas === 'ready' &&
    document.documentElement.dataset.kdrumPublicCopy === 'ready' &&
    document.documentElement.dataset.kdrumExperienceV3Final === 'ready' &&
    document.documentElement.dataset.kdrumExperienceV4 === 'ready' &&
    Boolean(document.getElementById('ev4-shell'))
  ), null, { timeout: 15000 });
  await page.waitForTimeout(200);
}

async function activateTop(page, id) {
  const tab = page.locator(`#ev4-tab-${id}`);
  if (await tab.count() !== 1) throw new Error(`top-level tab not found: ${id}`);
  await tab.click();
  await page.waitForFunction((panelId) => {
    const panel = document.getElementById(`ev4-panel-${panelId}`);
    const visible = [...document.querySelectorAll('.ev4-panel')].filter((item) => !item.hidden);
    return Boolean(panel && !panel.hidden && visible.length === 1 && visible[0] === panel);
  }, id, { timeout: 5000 });
  await page.waitForTimeout(120);
}

async function activateCategory(page, index) {
  const tabs = page.locator('#capabilities .catlas-tab');
  const tab = tabs.nth(index);
  await tab.click();
  await page.waitForFunction(() => {
    const cards = [...document.querySelectorAll('#capabilities .catlas-card')];
    return cards.length > 0 &&
      cards.every((card) => card.querySelector('.ev4-card-action')) &&
      cards.every((card) => !card.querySelector('.ev3-card-visual'));
  }, null, { timeout: 5000 });
  await page.waitForTimeout(100);
}

async function findCapability(page, id) {
  await activateTop(page, 'capabilities');
  const tabs = page.locator('#capabilities .catlas-tab');
  const count = await tabs.count();
  for (let index = 0; index < count; index += 1) {
    await activateCategory(page, index);
    const card = page.locator(`#capabilities .catlas-card[data-id="${id}"]`);
    if (await card.count()) return card;
  }
  return null;
}

async function capture(page, fileName, selector = null, fullPage = false) {
  if (!SCREENSHOTS) return;
  const target = selector ? page.locator(selector) : page;
  if (selector && await target.count() === 0) return;
  const filePath = path.join(OUTPUT_DIR, fileName);
  if (selector) await target.screenshot({ path: filePath });
  else await page.screenshot({ path: filePath, fullPage });
}

async function auditCase(browser, testCase, failures) {
  const page = await browser.newPage({ viewport: testCase.viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));

  const url = `${BASE_URL}${testCase.pathname}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await waitForV4(page);

  const prefix = testCase.name;
  const report = { url, panels: {}, dialogs: {}, errors };

  const base = await page.evaluate(() => {
    const style = (element) => element ? getComputedStyle(element) : null;
    const rect = (element) => {
      if (!element) return null;
      const value = element.getBoundingClientRect();
      return { x: value.x, y: value.y, width: value.width, height: value.height, right: value.right, bottom: value.bottom };
    };
    const tabs = [...document.querySelectorAll('.ev4-tab')];
    return {
      ready: document.documentElement.dataset.kdrumExperienceV4,
      active: document.documentElement.dataset.ev4ActiveTab,
      tabCount: tabs.length,
      tabIds: tabs.map((tab) => tab.dataset.tab),
      tabHeights: tabs.map((tab) => rect(tab)?.height || 0),
      selectedTabs: tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true').length,
      visiblePanels: [...document.querySelectorAll('.ev4-panel')].filter((panel) => !panel.hidden).map((panel) => panel.dataset.panel),
      bodyBackground: style(document.body)?.backgroundColor,
      topbarBackground: style(document.querySelector('.topbar'))?.backgroundColor,
      topbarPosition: style(document.querySelector('.topbar'))?.position,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      heroPrimaryHref: document.querySelector('.ev4-download-hero')?.href || '',
      heroCapabilityLink: document.querySelector('[data-ev4-tab-link="capabilities"]')?.getAttribute('href') || '',
      headerDownloadHref: document.querySelector('.ev4-header-download')?.href || '',
      bodyText: document.body.innerText,
    };
  });
  report.base = base;

  if (base.ready !== 'ready') failures.push(`${prefix}: v4 runtime not ready`);
  if (base.tabCount !== 6 || JSON.stringify(base.tabIds) !== JSON.stringify(TOP_TABS)) {
    failures.push(`${prefix}: top-level tabs mismatch ${JSON.stringify(base.tabIds)}`);
  }
  if (base.selectedTabs !== 1 || JSON.stringify(base.visiblePanels) !== JSON.stringify(['overview'])) {
    failures.push(`${prefix}: default panel selection is not overview-only`);
  }
  if (base.tabHeights.some((height) => height < 44)) failures.push(`${prefix}: a top-level tab is under 44px`);
  if (!isLight(base.bodyBackground) || !isLight(base.topbarBackground)) {
    failures.push(`${prefix}: body/header is not light (${base.bodyBackground}/${base.topbarBackground})`);
  }
  if (base.scrollWidth > base.clientWidth + 1) failures.push(`${prefix}: horizontal overflow on initial view`);
  if (testCase.mobile && base.topbarPosition === 'sticky') failures.push(`${prefix}: mobile topbar remains sticky`);
  if (!base.heroPrimaryHref.includes('menuId=15_126_128')) failures.push(`${prefix}: hero MyWater action missing`);
  if (base.heroCapabilityLink !== '#capabilities') failures.push(`${prefix}: hero capability tab link missing`);
  if (!testCase.mobile && !base.headerDownloadHref.includes('menuId=15_126_128')) {
    failures.push(`${prefix}: header download action missing`);
  }
  if (testCase.korean) {
    if (!base.bodyText.includes('물리적 기반의 격자단위 분포형 강우유출모형')) failures.push(`${prefix}: canonical Korean model wording missing`);
    if (base.bodyText.includes('격자형 분포형')) failures.push(`${prefix}: deprecated Korean terminology remains visible`);
  }

  await capture(page, `${prefix}-overview-full.png`, null, true);
  await capture(page, `${prefix}-hero.png`, '.hero');

  await activateTop(page, 'overview');
  const overview = await page.evaluate(() => ({
    active: document.documentElement.dataset.ev4ActiveTab,
    visiblePanels: [...document.querySelectorAll('.ev4-panel')].filter((panel) => !panel.hidden).map((panel) => panel.dataset.panel),
    outcomes: document.querySelectorAll('#outcomes .ev4-static-card').length,
    outcomeDiagrams: [...document.querySelectorAll('#outcomes svg[data-diagram]')].map((svg) => svg.dataset.diagram),
    outcomePointers: [...document.querySelectorAll('#outcomes .ev4-static-card')].map((card) => getComputedStyle(card).cursor),
    outcomeActions: document.querySelectorAll('#outcomes .ev4-card-action, #outcomes .ev3-card-action').length,
    architectureSteps: document.querySelectorAll('#architecture .arch').length,
    height: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  report.panels.overview = overview;
  if (overview.active !== 'overview' || JSON.stringify(overview.visiblePanels) !== JSON.stringify(['overview'])) failures.push(`${prefix}: overview panel isolation failed`);
  if (overview.outcomes !== 4 || JSON.stringify(overview.outcomeDiagrams) !== JSON.stringify(OUTCOME_DIAGRAMS)) {
    failures.push(`${prefix}: outcome diagrams mismatch ${JSON.stringify(overview.outcomeDiagrams)}`);
  }
  if (overview.outcomePointers.some((cursor) => cursor === 'pointer') || overview.outcomeActions !== 0) failures.push(`${prefix}: overview cards look interactive`);
  if (overview.architectureSteps !== 5) failures.push(`${prefix}: workflow must contain 5 steps`);
  if (overview.scrollWidth > overview.clientWidth + 1) failures.push(`${prefix}: overflow in overview panel`);
  if ((!testCase.mobile && overview.height > 2300) || (testCase.mobile && overview.height > 3900)) failures.push(`${prefix}: overview remains too long (${overview.height}px)`);
  await capture(page, `${prefix}-overview.png`, '#ev4-panel-overview');

  await activateTop(page, 'results');
  const results = await page.evaluate(() => ({
    cards: document.querySelectorAll('#results .ev4-static-card').length,
    diagrams: [...document.querySelectorAll('#results svg[data-diagram]')].map((svg) => svg.dataset.diagram),
    pointers: [...document.querySelectorAll('#results .ev4-static-card')].map((card) => getComputedStyle(card).cursor),
    actions: document.querySelectorAll('#results .ev4-card-action, #results .ev3-card-action').length,
    height: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  report.panels.results = results;
  if (results.cards !== 4 || JSON.stringify(results.diagrams) !== JSON.stringify(RESULT_DIAGRAMS)) failures.push(`${prefix}: result diagrams mismatch ${JSON.stringify(results.diagrams)}`);
  if (results.pointers.some((cursor) => cursor === 'pointer') || results.actions !== 0) failures.push(`${prefix}: result cards look interactive`);
  if (results.scrollWidth > results.clientWidth + 1) failures.push(`${prefix}: overflow in results panel`);
  if ((!testCase.mobile && results.height > 2000) || (testCase.mobile && results.height > 3400)) failures.push(`${prefix}: results panel remains too long (${results.height}px)`);
  await capture(page, `${prefix}-results.png`, '#ev4-panel-results');

  await activateTop(page, 'programs');
  const programs = await page.evaluate((expected) => {
    const cards = [...document.querySelectorAll('#platform .ev3-program-card')];
    const rows = {};
    cards.forEach((card) => {
      const y = Math.round(card.getBoundingClientRect().y);
      rows[y] = (rows[y] || 0) + 1;
    });
    return {
      count: cards.length,
      roles: cards.map((card) => card.dataset.programRole || ''),
      diagrams: cards.map((card) => card.querySelector('svg[data-diagram]')?.dataset.diagram || ''),
      expectedDiagrams: cards.map((card) => expected[card.dataset.programRole] || ''),
      pointers: cards.map((card) => getComputedStyle(card).cursor),
      actions: document.querySelectorAll('#platform .ev4-card-action, #platform .ev3-card-action').length,
      rows: Object.values(rows).sort((a, b) => b - a),
      height: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  }, PROGRAM_DIAGRAMS);
  report.panels.programs = programs;
  if (programs.count !== 7 || programs.roles.some((role) => !role)) failures.push(`${prefix}: program roles incomplete`);
  if (JSON.stringify(programs.diagrams) !== JSON.stringify(programs.expectedDiagrams)) failures.push(`${prefix}: program diagrams mismatch ${JSON.stringify(programs.diagrams)}`);
  if (programs.pointers.some((cursor) => cursor === 'pointer') || programs.actions !== 0) failures.push(`${prefix}: program cards look interactive`);
  if (!testCase.mobile && JSON.stringify(programs.rows) !== JSON.stringify([4, 3])) failures.push(`${prefix}: program desktop layout is not 3+4 (${JSON.stringify(programs.rows)})`);
  if (programs.scrollWidth > programs.clientWidth + 1) failures.push(`${prefix}: overflow in programs panel`);
  if ((!testCase.mobile && programs.height > 2600) || (testCase.mobile && programs.height > 4700)) failures.push(`${prefix}: programs panel remains too long (${programs.height}px)`);
  await capture(page, `${prefix}-programs.png`, '#ev4-panel-programs');

  await activateTop(page, 'research');
  const research = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#research .grid3 > .card')].slice(0, 6);
    return {
      cards: cards.length,
      diagrams: cards.map((card) => card.querySelector('svg[data-diagram]')?.dataset.diagram || ''),
      pointers: cards.map((card) => getComputedStyle(card).cursor),
      actions: document.querySelectorAll('#research .ev4-card-action, #research .ev3-card-action').length,
      detailsCount: document.querySelectorAll('#research details.ev4-history').length,
      historyOpen: Boolean(document.querySelector('#research details.ev4-history')?.open),
      resources: document.querySelectorAll('#resources .ev4-resource-link').length,
      resourceActions: document.querySelectorAll('#resources .ev3-link-action').length,
      height: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });
  report.panels.research = research;
  if (research.cards !== 6 || research.diagrams.some((diagramName) => !RESEARCH_DIAGRAMS.has(diagramName))) failures.push(`${prefix}: research diagrams incomplete ${JSON.stringify(research.diagrams)}`);
  if (new Set(research.diagrams).size !== 6) failures.push(`${prefix}: research diagrams are not distinct`);
  if (research.pointers.some((cursor) => cursor === 'pointer') || research.actions !== 0) failures.push(`${prefix}: research cards look interactive`);
  if (research.detailsCount !== 1 || research.historyOpen) failures.push(`${prefix}: research timeline is not collapsed by default`);
  if (research.resources !== 4 || research.resourceActions !== 4) failures.push(`${prefix}: research resources/actions incomplete`);
  if (research.scrollWidth > research.clientWidth + 1) failures.push(`${prefix}: overflow in research panel`);
  if ((!testCase.mobile && research.height > 2900) || (testCase.mobile && research.height > 5200)) failures.push(`${prefix}: research panel remains too long (${research.height}px)`);
  await capture(page, `${prefix}-research.png`, '#ev4-panel-research');

  await activateTop(page, 'download');
  const download = await page.evaluate(() => {
    const panel = document.querySelector('#references .ev4-download-panel');
    const links = [...document.querySelectorAll('#references .ev4-download-actions a')];
    return {
      panel: Boolean(panel),
      height: panel?.getBoundingClientRect().height || 0,
      links: links.map((link) => link.href),
      primaryText: document.querySelector('#references .ev4-download-primary')?.textContent.trim() || '',
      text: panel?.textContent.trim() || '',
      pageHeight: document.documentElement.scrollHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });
  report.panels.download = download;
  if (!download.panel || download.links.length !== 3) failures.push(`${prefix}: download panel/links incomplete`);
  if (!download.links.some((href) => href.includes('menuId=15_126_128'))) failures.push(`${prefix}: MyWater download link missing`);
  if (!download.links.some((href) => href.includes('menuId=15_126_127'))) failures.push(`${prefix}: terms link missing`);
  if (!download.primaryText) failures.push(`${prefix}: primary download action has no text`);
  if (!download.text.includes('MyWater')) failures.push(`${prefix}: MyWater text missing`);
  if (testCase.korean && !download.text.includes('무료로 내려받아 사용할 수 있습니다')) failures.push(`${prefix}: Korean free-download policy wording missing`);
  if (!testCase.korean && !download.text.includes('free of charge')) failures.push(`${prefix}: English free-download wording missing`);
  if (download.scrollWidth > download.clientWidth + 1) failures.push(`${prefix}: overflow in download panel`);
  if ((!testCase.mobile && download.pageHeight > 1500) || (testCase.mobile && download.pageHeight > 2200)) failures.push(`${prefix}: download panel remains too long (${download.pageHeight}px)`);
  if (testCase.mobile && download.height > 650) failures.push(`${prefix}: mobile download card too tall (${download.height}px)`);
  await capture(page, `${prefix}-download.png`, '#ev4-panel-download');

  await activateTop(page, 'capabilities');
  const categoryTabs = page.locator('#capabilities .catlas-tab');
  const categoryCount = await categoryTabs.count();
  let totalCards = 0;
  let totalActions = 0;
  let totalSymbols = 0;
  let legacyVisuals = 0;
  let pointerCards = 0;
  const groupDiagrams = [];
  const categoryHeights = [];
  for (let index = 0; index < categoryCount; index += 1) {
    await activateCategory(page, index);
    const values = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('#capabilities .catlas-card')];
      const selected = document.querySelector('#capabilities .catlas-tab[aria-selected="true"]');
      return {
        group: selected?.dataset.group || '',
        cards: cards.length,
        actions: cards.filter((card) => card.querySelector('.ev4-card-action')).length,
        symbols: cards.filter((card) => card.querySelector('.catlas-symbol')).length,
        legacyVisuals: cards.filter((card) => card.querySelector('.ev3-card-visual')).length,
        pointerCards: cards.filter((card) => getComputedStyle(card).cursor === 'pointer').length,
        groupDiagram: document.querySelector('#capabilities .catlas-group-visual svg[data-diagram]')?.dataset.diagram || '',
        pageHeight: document.documentElement.scrollHeight,
        minActionHeight: Math.min(...cards.map((card) => card.querySelector('.ev4-card-action')?.getBoundingClientRect().height || 0)),
        actionLabels: cards.map((card) => card.querySelector('.ev4-card-action span')?.textContent.trim() || ''),
      };
    });
    totalCards += values.cards;
    totalActions += values.actions;
    totalSymbols += values.symbols;
    legacyVisuals += values.legacyVisuals;
    pointerCards += values.pointerCards;
    groupDiagrams.push({ group: values.group, diagram: values.groupDiagram });
    categoryHeights.push(values.pageHeight);
    if (values.groupDiagram !== CATEGORY_DIAGRAMS[values.group]) failures.push(`${prefix}: category ${values.group} diagram ${values.groupDiagram} != ${CATEGORY_DIAGRAMS[values.group]}`);
    if (values.minActionHeight < 44) failures.push(`${prefix}: capability action under 44px in ${values.group}`);
    if (values.actionLabels.some((labelText) => !labelText)) failures.push(`${prefix}: blank capability action label in ${values.group}`);
    if (SCREENSHOTS && !testCase.mobile) await capture(page, `${prefix}-capability-${values.group}.png`, '#capabilities');
  }
  const capabilities = {
    categoryCount,
    totalCards,
    totalActions,
    totalSymbols,
    legacyVisuals,
    pointerCards,
    groupDiagrams,
    maxHeight: Math.max(...categoryHeights),
  };
  report.panels.capabilities = capabilities;
  if (categoryCount !== 8) failures.push(`${prefix}: expected 8 capability categories, found ${categoryCount}`);
  if (totalCards !== 46 || totalActions !== 46 || totalSymbols !== 46 || pointerCards !== 46) {
    failures.push(`${prefix}: capability totals cards/actions/symbols/pointer=${totalCards}/${totalActions}/${totalSymbols}/${pointerCards}`);
  }
  if (legacyVisuals !== 0) failures.push(`${prefix}: misleading per-capability thumbnails remain (${legacyVisuals})`);
  if ((!testCase.mobile && capabilities.maxHeight > 2800) || (testCase.mobile && capabilities.maxHeight > 4300)) failures.push(`${prefix}: capability panel remains too long (${capabilities.maxHeight}px)`);
  await capture(page, `${prefix}-capabilities.png`, '#ev4-panel-capabilities');

  for (const id of REPRESENTATIVE) {
    const card = await findCapability(page, id);
    if (!card) {
      failures.push(`${prefix}: representative capability missing ${id}`);
      continue;
    }
    await card.click();
    const dialog = page.locator('#catlas-dialog');
    await dialog.waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(80);
    const metrics = await dialog.evaluate((element) => {
      const style = getComputedStyle(element);
      const header = element.querySelector('.catlas-dbar');
      const title = element.querySelector('#catlas-title');
      const close = element.querySelector('.catlas-close');
      const headerStyle = header ? getComputedStyle(header) : null;
      const titleStyle = title ? getComputedStyle(title) : null;
      const closeStyle = close ? getComputedStyle(close) : null;
      const closeRect = close?.getBoundingClientRect();
      return {
        background: style.backgroundColor,
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
        doc: Boolean(element.querySelector('.catlas-doc')),
      };
    });
    metrics.titleContrast = contrastRatio(metrics.titleColor, metrics.headerBackground);
    metrics.closeContrast = contrastRatio(metrics.closeColor, metrics.closeBackground);
    report.dialogs[id] = metrics;
    if (!isLight(metrics.background) || !metrics.title || metrics.svg !== 1 || metrics.flow !== 3 || metrics.panels < 2 || !metrics.doc) {
      failures.push(`${prefix}: incomplete dialog ${id}: ${JSON.stringify(metrics)}`);
    }
    if (metrics.titleContrast < 4.5 || metrics.closeContrast < 4.5) failures.push(`${prefix}: dialog contrast too low ${id} (${metrics.titleContrast.toFixed(2)}/${metrics.closeContrast.toFixed(2)})`);
    if (metrics.closeWidth < 44 || metrics.closeHeight < 44) failures.push(`${prefix}: dialog close target too small ${id} (${metrics.closeWidth}x${metrics.closeHeight})`);
    if (SCREENSHOTS && ['wb', 'viewer1d'].includes(id)) await capture(page, `${prefix}-dialog-${id}.png`, '#catlas-dialog');
    await page.keyboard.press('Escape');
  }

  if (errors.length) failures.push(`${prefix}: browser errors: ${errors.join(' | ')}`);
  await page.close();
  return report;
}

(async () => {
  ensureDirectory(OUTPUT_DIR);
  const browser = await chromium.launch();
  const failures = [];
  const report = { label: LABEL, baseUrl: BASE_URL, generatedAt: new Date().toISOString(), cases: {} };

  try {
    for (const testCase of CASES) {
      report.cases[testCase.name] = await auditCase(browser, testCase, failures);
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'metrics.json'), JSON.stringify(report, null, 2));
  if (failures.length) {
    console.error(`${LABEL.toUpperCase()} FAILED`);
    failures.forEach((failure) => console.error(` - ${failure}`));
    process.exit(1);
  }
  console.log(`${LABEL.toUpperCase()} PASSED`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
