'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=require('../../docs/assets/site-content.json');
async function run(){
 const base=(process.env.BASE_URL||'http://127.0.0.1:8000/KDRUM-Public').replace(/\/$/,'');
 const out=process.env.NAVIGATION_AUDIT_DIR||path.join(process.env.READABILITY_AUDIT_DIR||'browser-artifacts/readability','navigation');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})}),checks=[];
 const waitOpen=(page,id)=>page.waitForFunction(id=>{const e=document.getElementById('cap-'+id);return e.open&&!e.hidden;},id);
 const overflow=async(page,label)=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label+' horizontal overflow');
 try{
  for(const lang of ['ko','en'])for(const width of [320,390,768,1366,1440,1920]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
   const home=base+(lang==='ko'?'/ko/':'/');await page.goto(home);await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');
   assert.equal(await page.locator('.capability:visible').count(),5,'Initial accepted category/layout is preserved');assert.equal(await page.locator('.capability').count(),46);
   assert.equal(await page.locator('#feature-group option').count(),9);assert.ok((await page.locator('#feature-group option').first().innerText()).includes('46'));
   if(width===390||width===1440)await page.locator('#capabilities').screenshot({path:path.join(out,lang+'-'+width+'-search.png')});
   const query=page.locator('#feature-search'),group=page.locator('#feature-group');
   await query.fill('NetCDF');assert.equal(await group.inputValue(),'');assert.ok(await page.locator('#cap-netcdf').isVisible(),'Global search crosses the default category');
   const ga=data.items.find(i=>i.id==='ga');await query.fill(lang==='ko'?ga.en:ga.ko);assert.ok(await page.locator('#cap-ga').isVisible(),'Other-language capability name is searchable');
   await query.fill('GREEN–AMPT');assert.ok(await page.locator('#cap-ga').isVisible(),'Case and hyphen normalization');
   await query.fill('green ampt');assert.ok(await page.locator('#cap-ga').isVisible(),'All query tokens supported');
   await group.selectOption(ga.g);assert.ok(await page.locator('#cap-ga').isVisible());await group.selectOption('forcing');assert.equal(await page.locator('#cap-ga').isVisible(),false,'Explicit category refines results');
   await query.fill('NetCDF');assert.equal(await group.inputValue(),'');assert.ok(await page.locator('#cap-netcdf').isVisible(),'A new query searches globally');
   await query.fill('zz-no-such-feature-20260919');assert.equal(await page.locator('.capability:visible').count(),0);assert.ok(await page.locator('#no-results').isVisible());
   await page.locator('#feature-reset').click();assert.equal(await query.inputValue(),'');assert.equal(await group.inputValue(),'');assert.equal(await page.locator('.capability:visible').count(),46);assert.ok(await query.evaluate(el=>el===document.activeElement));
   // User-entered strings are data, never HTML or regular-expression programs.
   await query.fill('<img src=x onerror=alert(1)>');assert.equal(await page.locator('.capability:visible').count(),0);assert.equal(await page.locator('img[src="x"]').count(),0);await page.locator('#feature-reset').click();
   // Preserve Korean input-method composition until the completed input is available.
   await group.selectOption('forcing');await query.dispatchEvent('compositionstart');await query.fill('침투');assert.equal(await group.inputValue(),'forcing');await query.dispatchEvent('compositionend');assert.equal(await group.inputValue(),'');assert.ok(await page.locator('#cap-ga').isVisible());
   await page.goto(home+'#cap-ga');await waitOpen(page,'ga');await group.selectOption('forcing');assert.equal(await page.locator('#cap-ga').isVisible(),false);
   await page.locator('.quick-entry a[href="#cap-ga"]').click();await waitOpen(page,'ga');assert.equal(await group.inputValue(),'','Same-fragment re-entry clears hiding filters');
   await page.locator('#cap-ga summary').click();await page.locator('.quick-entry a[href="#cap-ga"]').click();await waitOpen(page,'ga');
   assert.equal(await page.locator('#cap-ga .detail-overview').innerText(),ga[lang==='ko'?'detailKo':'detailEn']);assert.equal(await page.locator('#cap-ga .detail-status p').innerText(),ga[lang==='ko'?'nowKo':'nowEn']);
   if(lang==='en'){assert.equal(await page.locator('#cap-ga .note .resource-links a').innerText(),'View related diagram →');}
   const share=page.locator('#cap-ga [data-share-feature]');await share.click();await page.waitForFunction(()=>document.querySelector('#cap-ga .feature-share-status').textContent.match(/Link copied|복사했습니다/));
   const expected=new URL(home);expected.hash='cap-ga';assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected.href,'Clipboard contains the exact stable feature URL');assert.ok(page.url().endsWith('#cap-ga'));
   // Explicitly denied clipboard uses the address bar and never reports false success.
   await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new DOMException('Denied','NotAllowedError'))}}));
   await share.click();await page.waitForFunction(()=>document.querySelector('#cap-ga .feature-share-status').textContent.match(/주소창|address bar/));assert.ok(page.url().endsWith('#cap-ga'));
   await overflow(page,lang+' '+width);
   if(width===390||width===1440){const card=page.locator('#cap-ga');const h=await card.evaluate(el=>el.getBoundingClientRect().height);await page.setViewportSize({width,height:Math.max(1000,Math.ceil(h)+240)});await card.scrollIntoViewIfNeeded();await card.screenshot({path:path.join(out,lang+'-'+width+'-feature.png')});await page.setViewportSize({width,height:1000});}
   // Manual detail expansion also carries its context into the other language.
   await page.goto(home);await page.locator('#feature-group').selectOption('');await page.locator('#cap-ga summary').click();await waitOpen(page,'ga');
   const other=lang==='ko'?'en':'ko';await page.waitForFunction(other=>document.querySelector('.language a[lang="'+other+'"]').hash==='#cap-ga',other);await page.locator('.language a[lang="'+other+'"]').click();await waitOpen(page,'ga');assert.equal(await page.locator('html').getAttribute('lang'),other);
   await page.locator('.site-nav a[href="#results"]').click();await page.waitForFunction(lang=>document.querySelector('.language a[lang="'+lang+'"]').hash==='#results',lang);
   assert.deepEqual(errors,[]);checks.push({language:lang,width,status:'PASS',globalSearch:true,bilingualSearch:true,normalization:true,categoryRefinement:true,reset:true,imeComposition:true,sameHashReentry:true,clipboard:'granted and denied paths',languageContext:true});await context.close();
  }
  for(const lang of ['ko','en']){const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();await page.goto(base+(lang==='ko'?'/ko/':'/'));assert.equal(await page.locator('.capability:visible').count(),46);assert.equal(await page.locator('#feature-reset').isVisible(),false);await page.locator('#cap-ga summary').click();assert.notEqual(await page.locator('#cap-ga').getAttribute('open'),null);assert.equal(await page.locator('#cap-ga [data-share-feature]').getAttribute('href'),'#cap-ga');await overflow(page,'no-JS '+lang);checks.push({language:lang,javascript:false,status:'PASS'});await context.close();}
  assert.equal(checks.length,14);console.log('NAVIGATION PASS: 12 bilingual/six-width cases and 2 no-JS cases; search, reset, sharing, denied-clipboard fallback and language/deep-link continuity.');
 }finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks},null,2));await browser.close();}
}
module.exports={run};if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
