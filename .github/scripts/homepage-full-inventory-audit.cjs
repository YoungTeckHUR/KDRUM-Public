const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const OUT_DIR = process.env.AUDIT_DIR || 'homepage-full-inventory-artifacts';
const LABEL = process.env.AUDIT_LABEL || 'K-DRUM full homepage inventory audit';
fs.mkdirSync(OUT_DIR, { recursive: true });

const EXPECTED = {
  blue: 'rgb(0, 102, 179)',
  green: 'rgb(74, 166, 61)',
  orange: 'rgb(243, 152, 0)',
};

const cases = [
  { key: 'en-desktop', url: '/', lang: 'en', width: 1440, height: 1000, mobile: false },
  { key: 'ko-desktop', url: '/ko/', lang: 'ko', width: 1440, height: 1000, mobile: false },
  { key: 'en-mobile', url: '/', lang: 'en', width: 390, height: 844, mobile: true },
  { key: 'ko-mobile', url: '/ko/', lang: 'ko', width: 390, height: 844, mobile: true },
];

const failures = [];
const reports = {};

function parseRgb(value) {
  const m = String(value || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function luminance(value) {
  const rgb = parseRgb(value);
  if (!rgb) return null;
  const linear = rgb.map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function isDark(value, limit = 0.16) {
  const l = luminance(value);
  return l !== null && l < limit;
}

async function screenshot(page, name, selector = null) {
  const file = path.join(OUT_DIR, name);
  if (selector) {
    const target = page.locator(selector).first();
    if (await target.count()) {
      await target.screenshot({ path: file });
      return;
    }
  }
  await page.screenshot({ path: file, fullPage: true });
}

async function activateTop(page, id) {
  const tab = page.locator(`.ev4-tab[data-tab="${id}"]`);
  await tab.click();
  await page.waitForFunction(tabId => {
    const panel = document.querySelector(`#ev4-panel-${tabId}`);
    return document.documentElement.dataset.ev4ActiveTab === tabId && panel && !panel.hidden;
  }, id, { timeout: 8000 });
  await page.waitForTimeout(80);
}

async function auditFirstPaint(browser, testCase) {
  const context = await browser.newContext({
    viewport: { width: testCase.width, height: testCase.height },
    javaScriptEnabled: false,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(BASE_URL + testCase.url, { waitUntil: 'networkidle', timeout: 30000 });
  const firstPaint = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    const html = getComputedStyle(document.documentElement);
    const topbar = document.querySelector('.topbar');
    const hero = document.querySelector('.hero');
    return {
      bodyBg: body.backgroundColor,
      htmlBg: html.backgroundColor,
      bodyColor: body.color,
      topbarBg: topbar ? getComputedStyle(topbar).backgroundColor : '',
      heroBg: hero ? getComputedStyle(hero).backgroundColor : '',
      criticalHref: document.querySelector('link[data-kdrum-kwater-critical]')?.getAttribute('href') || '',
      theme: document.querySelector('meta[name="theme-color"]')?.getAttribute('content') || '',
      colorScheme: document.querySelector('meta[name="color-scheme"]')?.getAttribute('content') || '',
    };
  });
  reports[testCase.key] = reports[testCase.key] || {};
  reports[testCase.key].firstPaint = firstPaint;
  if (!firstPaint.criticalHref.endsWith('kwater-critical.css')) failures.push(`${testCase.key}: render-blocking first-paint stylesheet missing`);
  if (firstPaint.theme.toLowerCase() !== '#0066b3') failures.push(`${testCase.key}: theme color is not K-water blue (${firstPaint.theme})`);
  if (firstPaint.colorScheme.toLowerCase() !== 'light') failures.push(`${testCase.key}: light color-scheme meta missing`);
  if (isDark(firstPaint.bodyBg) || isDark(firstPaint.topbarBg) || isDark(firstPaint.heroBg)) failures.push(`${testCase.key}: dark first paint remains ${JSON.stringify(firstPaint)}`);
  await screenshot(page, `${testCase.key}-first-paint.png`);
  await context.close();
}

async function auditRendered(browser, testCase) {
  const context = await browser.newContext({
    viewport: { width: testCase.width, height: testCase.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror:${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console:${message.text()}`);
  });

  await page.goto(BASE_URL + testCase.url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForFunction(() =>
    document.documentElement.dataset.kdrumExperienceV4Stable === 'ready' &&
    document.documentElement.dataset.kdrumConceptVisuals === 'ready',
    null,
    { timeout: 20000 }
  );
  await page.waitForTimeout(350);

  const report = reports[testCase.key] || {};
  reports[testCase.key] = report;

  const global = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const tabs = [...document.querySelectorAll('.ev4-tab')];
    const panels = [...document.querySelectorAll('.ev4-panel')];
    const topSections = [...document.querySelectorAll('.ev4-panel, .hero, .topbar, footer')];
    return {
      ready: document.documentElement.dataset.kdrumConceptVisuals,
      active: document.documentElement.dataset.ev4ActiveTab,
      tabCount: tabs.length,
      visiblePanels: panels.filter(panel => !panel.hidden).map(panel => panel.dataset.panel),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      variables: {
        blue: root.getPropertyValue('--kw-blue').trim(),
        green: root.getPropertyValue('--kw-green').trim(),
        orange: root.getPropertyValue('--kw-orange').trim(),
      },
      darkTopSurfaces: topSections.map(node => ({
        selector: node.id || node.className || node.tagName,
        bg: getComputedStyle(node).backgroundColor,
      })),
      criticalHref: document.querySelector('link[data-kdrum-kwater-critical]')?.getAttribute('href') || '',
      brandHref: document.querySelector('link[data-kdrum-kwater-brand-v1]')?.getAttribute('href') || '',
    };
  });
  report.global = global;
  if (global.ready !== 'ready') failures.push(`${testCase.key}: concept visual runtime not ready`);
  if (global.tabCount !== 6) failures.push(`${testCase.key}: expected six top-level tabs, found ${global.tabCount}`);
  if (global.visiblePanels.length !== 1) failures.push(`${testCase.key}: expected one visible panel, found ${JSON.stringify(global.visiblePanels)}`);
  if (global.overflow > 1) failures.push(`${testCase.key}: horizontal overflow ${global.overflow}px`);
  if (!global.brandHref.endsWith('kwater-brand-v1.css')) failures.push(`${testCase.key}: final K-water palette stylesheet missing`);
  if (global.variables.blue.toLowerCase() !== '#0066b3' || global.variables.green.toLowerCase() !== '#4aa63d' || global.variables.orange.toLowerCase() !== '#f39800') failures.push(`${testCase.key}: K-water palette variables invalid ${JSON.stringify(global.variables)}`);
  for (const surface of global.darkTopSurfaces) {
    if (isDark(surface.bg)) failures.push(`${testCase.key}: dark top-level surface remains at ${surface.selector}: ${surface.bg}`);
  }

  await activateTop(page, 'overview');
  const overview = await page.evaluate(() => {
    const imageState = img => ({ src: img?.getAttribute('src') || '', alt: img?.alt || '', complete: Boolean(img?.complete), width: img?.naturalWidth || 0 });
    const workflow = document.querySelector('#architecture [data-concept-id="workflow"] img');
    const concepts = [...document.querySelectorAll('#outcomes [data-concept-id]')].map(node => node.dataset.conceptId);
    const outcomes = [...document.querySelectorAll('#outcomes .ev4-static-card')];
    return {
      workflow: imageState(workflow),
      concepts,
      outcomeCount: outcomes.length,
      outcomePointer: outcomes.map(node => getComputedStyle(node).cursor),
      outcomeActions: document.querySelectorAll('#outcomes .ev4-card-action,#outcomes .ev3-card-action').length,
    };
  });
  report.overview = overview;
  if (!overview.workflow.src.endsWith('concepts/kdrum-workflow.svg') || !overview.workflow.alt || !overview.workflow.complete || overview.workflow.width < 100) failures.push(`${testCase.key}: workflow concept image invalid ${JSON.stringify(overview.workflow)}`);
  if (overview.outcomeCount !== 4) failures.push(`${testCase.key}: expected four outcome cards`);
  for (const id of ['runoff', 'flood', 'balance']) if (!overview.concepts.includes(id)) failures.push(`${testCase.key}: overview concept ${id} missing`);
  if (overview.outcomeActions !== 0 || overview.outcomePointer.some(value => value === 'pointer')) failures.push(`${testCase.key}: overview information cards appear clickable`);
  await screenshot(page, `${testCase.key}-overview.png`, '#ev4-panel-overview');

  await activateTop(page, 'capabilities');
  const groups = await page.locator('#capabilities .catlas-tab').evaluateAll(nodes => nodes.map(node => node.dataset.group));
  if (groups.length !== 8 || new Set(groups).size !== 8) failures.push(`${testCase.key}: expected eight unique capability groups, found ${JSON.stringify(groups)}`);
  const capabilityTitles = new Set();
  const capabilityDetails = [];
  for (const group of groups) {
    await page.locator(`#capabilities .catlas-tab[data-group="${group}"]`).click();
    await page.waitForTimeout(100);
    const count = await page.locator('#capabilities .catlas-card').count();
    if (!count) failures.push(`${testCase.key}: capability group ${group} has no cards`);
    const groupVisuals = await page.locator('#capabilities .catlas-group-visual,#capabilities .ev3-group-concept,#capabilities .ev3-card-visual').count();
    if (groupVisuals !== 0) failures.push(`${testCase.key}: obsolete/generic capability imagery remains in ${group}`);
    for (let index = 0; index < count; index += 1) {
      const card = page.locator('#capabilities .catlas-card').nth(index);
      const cardInfo = await card.evaluate(node => ({
        title: node.querySelector('h4,h3')?.textContent.trim() || '',
        status: node.querySelector('.catlas-status')?.textContent.trim() || '',
        action: node.querySelector('.ev4-card-action')?.textContent.trim() || '',
        aria: node.getAttribute('aria-label') || '',
        height: node.getBoundingClientRect().height,
        pointer: getComputedStyle(node).cursor,
      }));
      if (!cardInfo.title || !cardInfo.status || !cardInfo.action || !cardInfo.aria) failures.push(`${testCase.key}: incomplete capability card ${group}/${index}: ${JSON.stringify(cardInfo)}`);
      if (cardInfo.pointer !== 'pointer') failures.push(`${testCase.key}: capability card ${cardInfo.title} lacks pointer affordance`);
      if (testCase.mobile && cardInfo.height > 190) failures.push(`${testCase.key}: mobile capability card too tall ${cardInfo.title} ${cardInfo.height}px`);
      capabilityTitles.add(cardInfo.title);
      await card.click();
      await page.waitForFunction(() => document.querySelector('#catlas-dialog')?.open, null, { timeout: 5000 });
      const detail = await page.evaluate(() => {
        const dlg = document.querySelector('#catlas-dialog');
        const close = dlg?.querySelector('.catlas-close');
        const style = dlg ? getComputedStyle(dlg) : null;
        return {
          title: dlg?.querySelector('#catlas-title')?.textContent.trim() || '',
          status: dlg?.querySelector('.catlas-status')?.textContent.trim() || '',
          lead: dlg?.querySelector('.catlas-dlead')?.textContent.trim() || '',
          steps: dlg?.querySelectorAll('.catlas-flow > div').length || 0,
          panels: dlg?.querySelectorAll('.catlas-panel').length || 0,
          doc: dlg?.querySelector('.catlas-doc')?.getAttribute('href') || '',
          closeHeight: close?.getBoundingClientRect().height || 0,
          bg: style?.backgroundColor || '',
          duplicateStatus: dlg?.querySelectorAll('.catlas-status').length || 0,
        };
      });
      capabilityDetails.push({ group, card: cardInfo.title, detail });
      if (detail.title !== cardInfo.title || !detail.status || detail.lead.length < 20 || detail.steps !== 3 || detail.panels < 2 || !detail.doc.includes('github.com/YoungTeckHUR/KDRUM-Public') || detail.closeHeight < 44 || isDark(detail.bg) || detail.duplicateStatus !== 1) failures.push(`${testCase.key}: invalid detail dialog for ${cardInfo.title}: ${JSON.stringify(detail)}`);
      await page.locator('#catlas-dialog .catlas-close').click();
      await page.waitForFunction(() => !document.querySelector('#catlas-dialog')?.open, null, { timeout: 3000 });
    }
  }
  report.capabilities = { groups, count: capabilityTitles.size, details: capabilityDetails };
  if (capabilityTitles.size !== 46) failures.push(`${testCase.key}: expected 46 unique capabilities, found ${capabilityTitles.size}`);
  await page.locator('#capabilities .catlas-tab').first().click();
  await screenshot(page, `${testCase.key}-capabilities.png`, '#ev4-panel-capabilities');

  await activateTop(page, 'results');
  const results = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#results .ev4-static-card')];
    return {
      count: cards.length,
      concepts: cards.map(card => card.querySelector('[data-concept-id]')?.dataset.conceptId || ''),
      alt: cards.map(card => card.querySelector('img')?.alt || ''),
      actions: document.querySelectorAll('#results .ev4-card-action,#results .ev3-card-action').length,
      pointers: cards.map(card => getComputedStyle(card).cursor),
    };
  });
  report.results = results;
  if (results.count !== 4 || results.actions !== 0 || results.pointers.some(value => value === 'pointer')) failures.push(`${testCase.key}: result cards invalid ${JSON.stringify(results)}`);
  for (const id of ['runoff', 'balance', 'viewer']) if (!results.concepts.includes(id)) failures.push(`${testCase.key}: result concept ${id} missing`);
  if (results.alt.filter(Boolean).length < 3) failures.push(`${testCase.key}: result concept alt text incomplete`);
  await screenshot(page, `${testCase.key}-results.png`, '#ev4-panel-results');

  await activateTop(page, 'programs');
  const programs = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#platform .ev3-program-card')];
    return {
      count: cards.length,
      roles: cards.map(card => card.dataset.programRole || ''),
      viewerConcept: cards.find(card => card.dataset.programRole === 'viewer1d')?.querySelector('[data-concept-id]')?.dataset.conceptId || '',
      actions: document.querySelectorAll('#platform .ev4-card-action,#platform .ev3-card-action').length,
      pointers: cards.map(card => getComputedStyle(card).cursor),
      heights: cards.map(card => Math.round(card.getBoundingClientRect().height)),
    };
  });
  report.programs = programs;
  if (programs.count !== 7 || programs.roles.some(role => !role) || programs.viewerConcept !== 'viewer' || programs.actions !== 0 || programs.pointers.some(value => value === 'pointer')) failures.push(`${testCase.key}: program inventory invalid ${JSON.stringify(programs)}`);
  if (testCase.mobile && programs.heights.some(height => height > 190)) failures.push(`${testCase.key}: mobile program card exceeds compact height ${JSON.stringify(programs.heights)}`);
  await screenshot(page, `${testCase.key}-programs.png`, '#ev4-panel-programs');

  await activateTop(page, 'research');
  const research = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#research .grid3 > .card')];
    const links = [...document.querySelectorAll('#resources .ev4-resource-link')];
    return {
      cards: cards.length,
      actions: document.querySelectorAll('#research .ev4-card-action,#research .ev3-card-action').length,
      pointers: cards.map(card => getComputedStyle(card).cursor),
      resources: links.length,
      resourceActions: links.map(link => link.querySelector('.ev3-link-action')?.textContent.trim() || ''),
    };
  });
  report.research = research;
  if (research.cards < 6 || research.actions !== 0 || research.pointers.some(value => value === 'pointer') || research.resources !== 4 || research.resourceActions.some(value => !value)) failures.push(`${testCase.key}: research/resources inventory invalid ${JSON.stringify(research)}`);
  await screenshot(page, `${testCase.key}-research.png`, '#ev4-panel-research');

  await activateTop(page, 'download');
  const download = await page.evaluate(() => {
    const links = [...document.querySelectorAll('#references .ev4-download-actions a')];
    const image = document.querySelector('#references [data-concept-id="download"] img');
    const active = document.querySelector('.ev4-tab[data-tab="download"]');
    return {
      links: links.map(link => ({ href: link.href, text: link.textContent.trim(), height: link.getBoundingClientRect().height })),
      image: { src: image?.getAttribute('src') || '', alt: image?.alt || '', complete: Boolean(image?.complete), width: image?.naturalWidth || 0 },
      panelText: document.querySelector('#references .ev4-download-panel')?.textContent || '',
      tabBg: active ? getComputedStyle(active).backgroundColor : '',
    };
  });
  report.download = download;
  if (download.links.length !== 3 || !download.links.some(link => link.href.includes('menuId=15_126_128')) || !download.links.some(link => link.href.includes('menuId=15_126_127')) || download.links.some(link => link.height < 44)) failures.push(`${testCase.key}: download links invalid ${JSON.stringify(download.links)}`);
  if (!download.image.src.endsWith('concepts/mywater-download.svg') || !download.image.alt || !download.image.complete || download.image.width < 100) failures.push(`${testCase.key}: MyWater concept image invalid ${JSON.stringify(download.image)}`);
  if (!download.panelText.includes('MyWater')) failures.push(`${testCase.key}: MyWater guidance missing`);
  if (download.tabBg !== EXPECTED.orange) failures.push(`${testCase.key}: download tab is not K-water orange (${download.tabBg})`);
  await screenshot(page, `${testCase.key}-download.png`, '#ev4-panel-download');

  await activateTop(page, 'capabilities');
  const capabilityTabBg = await page.locator('.ev4-tab[data-tab="capabilities"]').evaluate(node => getComputedStyle(node).backgroundColor);
  await activateTop(page, 'research');
  const researchTabBg = await page.locator('.ev4-tab[data-tab="research"]').evaluate(node => getComputedStyle(node).backgroundColor);
  report.palette = { capabilityTabBg, researchTabBg, downloadTabBg: download.tabBg };
  if (capabilityTabBg !== EXPECTED.blue) failures.push(`${testCase.key}: primary tab is not K-water blue (${capabilityTabBg})`);
  if (researchTabBg !== EXPECTED.green) failures.push(`${testCase.key}: research tab is not K-water green (${researchTabBg})`);

  if (errors.length) failures.push(`${testCase.key}: browser errors ${errors.join(' | ')}`);
  report.errors = errors;
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const testCase of cases) {
      await auditFirstPaint(browser, testCase);
      await auditRendered(browser, testCase);
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(OUT_DIR, 'metrics.json'), JSON.stringify({ label: LABEL, baseUrl: BASE_URL, reports, failures }, null, 2));
  if (failures.length) {
    console.error(`${LABEL} FAILED`);
    failures.forEach(item => console.error(` - ${item}`));
    process.exit(1);
  }
  console.log(`${LABEL} PASSED`);
  console.log('Validated EN/KO desktop/mobile, light first paint, K-water three-colour palette, six top tabs, eight capability groups, all 46 detail dialogs, result/program/research/download inventories and concept visuals.');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
