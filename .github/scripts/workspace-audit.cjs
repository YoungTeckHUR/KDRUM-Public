/* Current navigation contract: short home, one selected feature, complete static fallback.
   Replaces grid-layout assertions; preserves content, keyboard, media and link guarantees. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=require('../../docs/assets/site-content.json'),guidance=require('./capability-guidance.cjs'),layout=require('./navigation-layout.cjs');
const base=(process.env.BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const home=lang=>base+(lang==='ko'?'/ko/':'/')+(base.startsWith('file:')?'index.html':'');
async function bounds(page,label){
 const errors=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...document.querySelectorAll('h1,h2,h3,h4,p,li,figcaption')].filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none'&&e.scrollWidth>e.clientWidth+2).map(e=>e.textContent.slice(0,80))}));
 assert.equal(errors.overflow,false,label+' page overflow');assert.deepEqual(errors.clipped,[],label+' clipped text');
}
async function ready(page,url){await page.goto(url);await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');await page.evaluate(()=>document.fonts.ready);}
async function menuOpen(page){const menu=page.locator('.workspace-menu');if(!await menu.evaluate(el=>el.open))await menu.locator(':scope>summary').click();}
async function choose(page,item){await menuOpen(page);const group=page.locator('.feature-group[data-group="'+item.g+'"]');if(!await group.evaluate(el=>el.open))await group.locator(':scope>summary').click();await group.locator('[data-feature-link="'+item.id+'"]').click();await page.waitForFunction(id=>!document.getElementById('cap-'+id).hidden,item.id);}
async function zoom(page,link){await link.click();assert.ok(await page.locator('#image-viewer').evaluate(d=>d.open));await page.locator('#image-viewer img').evaluate(img=>img.decode());const slider=page.locator('#image-viewer input');await slider.fill('2');await slider.dispatchEvent('input');assert.equal(await page.locator('#image-viewer img').evaluate(el=>el.style.width),'200%');await page.keyboard.press('Escape');assert.ok(await link.evaluate(el=>el===document.activeElement),'image focus restoration');}
async function contrast(page){
 const results=await page.evaluate(()=>{
  const rgb=s=>s.match(/[\d.]+/g).map(Number),lum=a=>a.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  return ['.workspace-nav a[aria-current]','.hero .support','.button.primary','.site-footer p','.site-footer a','.feature-answer p','.capability:not([hidden]) .badge','.workspace-menu summary'].map(selector=>{
   const e=document.querySelector(selector);if(!e||!e.getClientRects().length)return null;let p=e,bg=[255,255,255];while(p){const c=rgb(getComputedStyle(p).backgroundColor);if(c.length===3||c[3]===1){bg=c;break;}p=p.parentElement;}const a=lum(rgb(getComputedStyle(e).color)),b=lum(bg);return {selector,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
  }).filter(Boolean);
 });for(const r of results)assert.ok(r.ratio>=4.5,r.selector+' contrast '+r.ratio);return results;
}
async function inspectFeature(page,item,lang,width){
 const suffix=lang==='ko'?'Ko':'En',card=page.locator('#cap-'+item.id),guide=guidance.get(item.id,lang),pic=layout.asset(item,lang);
 assert.equal(await page.locator('.capability:visible').count(),1);
 assert.equal(await card.getAttribute('data-status'),item.s);assert.equal(await card.locator('h3').innerText(),item[lang]);
 assert.equal(await card.locator(':scope>summary p').innerText(),item['sum'+suffix]);assert.equal(await card.locator('.feature-answer p').innerText(),guide.goal);
 assert.equal(await card.locator('.feature-reference').count(),pic?1:0);
 if(pic){const img=card.locator('.feature-reference img');await img.evaluate(i=>i.decode());assert.deepEqual(await img.evaluate(i=>[i.naturalWidth,i.naturalHeight]),[pic.width,pic.height]);assert.ok((await img.getAttribute('src')).endsWith(pic.src));assert.ok((await img.getAttribute('alt')).startsWith(guide.figure));await zoom(page,card.locator('.feature-reference-image'));}
 else assert.equal(item.id,'wq');
 const technical=card.locator('.technical-details');assert.equal(await technical.evaluate(e=>e.open),false);await technical.locator(':scope>summary').click();
 assert.equal(await card.locator('.detail-overview').innerText(),item['detail'+suffix]);assert.equal(await card.locator('.detail-status p').innerText(),item['now'+suffix]);assert.equal(await card.locator('.interpretation-check p').innerText(),guide.check);
 assert.deepEqual(await card.locator('ol li').allTextContents(),item['steps'+suffix].map((s,i)=>(lang==='ko'?['입력·상태','처리·계산','결과·활용']:['Input / state','Processing','Output / use'])[i]+' — '+s));
 assert.deepEqual(await card.locator('.related-capabilities a').evaluateAll(els=>els.map(e=>e.getAttribute('href'))),guide.related.map(id=>'#cap-'+id));
 for(const a of await technical.locator('[data-enlarge]').all())await zoom(page,a);
 await bounds(page,lang+' '+width+' '+item.id);await technical.locator(':scope>summary').click();
}
async function navigation(page,lang,width){
 await page.locator('.workspace-nav [data-page-link="capabilities"]').click();await page.locator('.capability:visible').waitFor();assert.equal(await page.locator('.capability:visible').count(),1);
 await menuOpen(page);const search=page.locator('#feature-search');await search.fill('zz-no-matching-feature');assert.ok(await page.locator('#no-results').isVisible());assert.equal(await page.locator('[data-feature-link]:visible').count(),0);assert.equal(await page.locator('.capability:visible').count(),1);
 await search.fill('NetCDF');assert.ok(await page.locator('[data-feature-link="netcdf"]').isVisible());await page.locator('[data-feature-link="netcdf"]').click();await page.locator('#cap-netcdf').waitFor({state:'visible'});assert.ok(page.url().endsWith('#cap-netcdf'));assert.equal(await search.inputValue(),'');
 if(width<=800)assert.equal(await page.locator('.workspace-menu').evaluate(e=>e.open),false);
 await menuOpen(page);await search.fill('강우');assert.ok(await page.locator('[data-feature-link="rain-spatial"]').isVisible());await page.locator('#feature-reset').click();assert.equal(await search.inputValue(),'');assert.ok(await search.evaluate(e=>e===document.activeElement));
 await choose(page,data.items.find(i=>i.id==='ga'));await page.locator('#cap-ga .related-capabilities a[href="#cap-runoff"]').click();await page.locator('#cap-runoff').waitFor({state:'visible'});assert.ok(page.url().endsWith('#cap-runoff'));await page.goBack();await page.locator('#cap-ga').waitFor({state:'visible'});assert.ok(page.url().endsWith('#cap-ga'));assert.ok(await page.locator('#cap-ga').isVisible());
 const language=page.locator('.language a[lang="'+(lang==='ko'?'en':'ko')+'"]');assert.ok((await language.getAttribute('href')).endsWith('#cap-ga'));await language.click();assert.equal(await page.locator('html').getAttribute('lang'),lang==='ko'?'en':'ko');assert.ok(await page.locator('#cap-ga').isVisible());await ready(page,home(lang)+'#cap-ga');
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.copiedFeature=value;}}}));await page.locator('#cap-ga .feature-share').click();assert.ok((await page.evaluate(()=>window.copiedFeature)).endsWith('#cap-ga'));
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}}));await page.locator('#cap-ga .feature-share').click();assert.equal(await page.locator('#cap-ga .feature-share-status').innerText(),lang==='ko'?'주소창의 링크를 복사해 주세요.':'Copy the link from the address bar.');
 await page.locator('#cap-ga .technical-details>summary').focus();await page.keyboard.press('Enter');assert.ok(await page.locator('#cap-ga .technical-details').evaluate(e=>e.open));await page.keyboard.press('Enter');
 await zoom(page,page.locator('#cap-ga .feature-reference-image'));
 for(const id of ['programs','research','download','home']){await page.locator('.workspace-nav [data-page-link="'+id+'"]').click();await page.locator('[data-workspace-page="'+id+'"]').waitFor({state:'visible'});assert.equal(await page.locator('[data-workspace-page]:visible').count(),1);assert.ok(await page.locator('[data-workspace-page="'+id+'"]').isVisible());await bounds(page,lang+' '+width+' '+id);}
 for(const [hash,selector] of [['architecture','#overview'],['features','#cap-ga'],['platform','#programs'],['references','#research'],['concept-ga','#concept-ga'],['results','#results'],['cap-not-real','#home']]){await ready(page,home(lang)+'#'+hash);assert.ok(await page.locator(selector).isVisible(),hash+' resolves');await bounds(page,hash);}
 await ready(page,home(lang));if(width===1440){await page.evaluate(()=>document.documentElement.style.zoom='2');await bounds(page,'200% zoom');await page.evaluate(()=>document.documentElement.style.zoom='');}
}
async function run(mode='navigation'){
 guidance.validate(data);require('./capability-contract.cjs').validate(data);
 const out=process.env.CAPABILITY_AUDIT_DIR||process.env.READABILITY_AUDIT_DIR||process.env.LAYOUT_AUDIT_DIR||process.env.AUDIT_DIR||'browser-artifacts/workspace';fs.mkdirSync(out,{recursive:true});
 const results=[],browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 const widths=mode==='details'?[1440,390]:mode==='navigation'?[1440,768,390,320]:[1920,1536,1440,1366,1024,768,390,320];
 try{
  if(mode==='details')await require('./feature-schematic-audit.cjs').run(browser,base,out);
  for(const lang of ['ko','en'])for(const width of widths){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
   await ready(page,home(lang));
   assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.capability').count(),46);assert.equal(await page.locator('.capability:visible').count(),0);assert.equal(await page.locator('[data-workspace-page]:visible').count(),1);assert.ok(await page.locator('#home').isVisible());
   assert.equal(await page.locator('#home .hero-image img').count(),1);assert.equal(await page.locator('.home-topics article').count(),3);
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://youngteckhur.github.io/KDRUM-Public/'+(lang==='ko'?'ko/':''));
   assert.deepEqual(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);}),[]);
   assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id))),[]);
   await page.locator('.hero-image img').evaluate(i=>i.decode());await bounds(page,'home '+lang+' '+width);const colors=await contrast(page);
   const homeHeight=await page.locator('#home').evaluate(e=>e.getBoundingClientRect().height);if(width>=1024)assert.ok(homeHeight<1100,'Short desktop homepage: '+homeHeight);
   if(process.env.AUDIT_SCREENSHOTS!=='0'&&[1440,390].includes(width))await page.screenshot({path:path.join(out,lang+'-'+width+'-home.png'),fullPage:true});
   if(mode==='navigation')await navigation(page,lang,width);
   else if(mode==='details'){
    await page.locator('.workspace-nav [data-page-link="capabilities"]').click();
    for(const item of data.items){await choose(page,item);await inspectFeature(page,item,lang,width);if(process.env.AUDIT_SCREENSHOTS!=='0'){const card=page.locator('#cap-'+item.id);await card.locator('.technical-details>summary').click();await card.screenshot({path:path.join(out,lang+'-'+width+'-'+item.id+'.png')});await card.locator('.technical-details>summary').click();}results.push({lang,width,id:item.id,status:'PASS'});}
   }else{
    for(const id of ['overview','cap-ga','cap-input-precheck','cap-fullswe','programs','research','download','grid-hydrology-concepts','results']){
     await ready(page,home(lang)+'#'+id);for(const img of await page.locator('main img:visible').all())await img.evaluate(i=>i.decode());await bounds(page,lang+' '+width+' '+id);
     if(id.startsWith('cap-')){await page.locator('#'+id+' .technical-details>summary').click();await bounds(page,id+' expanded');await page.locator('#'+id+' .technical-details>summary').click();}
    }
   }
   await ready(page,home(lang)+'#cap-ga');await contrast(page);if(process.env.AUDIT_SCREENSHOTS!=='0'&&[1440,390].includes(width))await page.screenshot({path:path.join(out,lang+'-'+width+'-detail.png'),fullPage:true});
   assert.deepEqual(errors,[]);results.push({lang,width,mode,status:'PASS',homeHeight,contrast:colors});console.log('PASS',mode,lang,width);await context.close();
  }
  if(mode==='navigation'){
   for(const lang of ['ko','en']){const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}}),p=await c.newPage();await p.goto(home(lang));assert.equal(await p.locator('.capability:visible').count(),46);await p.locator('#cap-ga>summary').click();await p.locator('#cap-ga .technical-details>summary').click();assert.ok(await p.locator('#cap-ga .detail-overview').isVisible());assert.ok((await p.locator('#cap-ga .feature-reference-image').getAttribute('href')).endsWith('.webp'));await bounds(p,'no-js '+lang);await c.close();}
   const p=await browser.newPage();await p.goto(base+'/seo-kdrum.html');assert.equal(await p.locator('.faq').count(),12);assert.equal(await p.locator('link[hreflang]').count(),0);await bounds(p,'FAQ');await p.close();
  }
  if(mode==='details')assert.equal(results.filter(r=>r.id).length,184);
 }finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));await browser.close();}
 return results;
}
module.exports={run};
if(require.main===module)run(process.argv[2]).catch(e=>{console.error(e);process.exitCode=1;});
