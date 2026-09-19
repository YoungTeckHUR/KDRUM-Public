'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=require('../../docs/assets/site-content.json');
const base=(process.env.BASE_URL||'http://127.0.0.1:8000/KDRUM-Public').replace(/\/$/,'');
const out=process.env.READABILITY_AUDIT_DIR||'browser-artifacts/readability';
fs.mkdirSync(out,{recursive:true});
const widths=[1440,1366,1280,1024,768,390],results=[];
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const lang of ['ko','en'])for(const width of widths){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
   await page.goto(base+(lang==='ko'?'/ko/':'/'));
   await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');
   const suffix=lang==='ko'?'Ko':'En';
   assert.equal(await page.locator('.capability').count(),46);
   assert.equal(await page.locator('main > section').count(),8);
   assert.equal(await page.locator('#overview .quick-entry').count(),1);
   assert.deepEqual(await page.locator('.quick-entry a').evaluateAll(a=>a.map(n=>n.getAttribute('href'))),['#cap-ga','#cap-continuous','#cap-coupling','#programs']);
   const gallery=page.locator('#grid-hydrology-concepts');
   assert.equal(await gallery.locator('img').count(),5);
   assert.equal(await gallery.locator('.concept-card').count(),4);
   await gallery.scrollIntoViewIfNeeded();
   await gallery.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
   const boxes=await gallery.locator('.concept-card').evaluateAll(cards=>cards.map(c=>{const r=c.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
   assert(Math.abs(boxes[0].y-boxes[1].y)<2,'First thumbnail row');
   assert(Math.abs(boxes[2].y-boxes[3].y)<2,'Second thumbnail row');
   assert(boxes[2].y>boxes[0].y,'2x2 layout rather than 3+1');
   const svgSrcs=await page.locator('main img[src$=".svg"]').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));
   assert.equal(new Set(svgSrcs).size,svgSrcs.length,'No repeated inline SVG diagrams');
   assert.equal(await page.locator('img[src*="/masters/"]').count(),0,'Rejected A/B/C redesign remains absent');
   assert(!(await page.locator('body').textContent()).includes('개념도 확장 원칙'));
   if(lang==='en')assert((await gallery.innerText()).includes('Image labels are in Korean.'));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page has no horizontal overflow');
   const metric=await page.evaluate(()=>({pageHeight:document.documentElement.scrollHeight,capabilitiesTop:document.querySelector('#capabilities').getBoundingClientRect().top+scrollY,visualHeight:document.querySelector('#grid-hydrology-concepts').getBoundingClientRect().height,quickHeight:document.querySelector('.quick-entry').getBoundingClientRect().height}));
   if(width===1440||width===390){
    await page.screenshot({path:path.join(out,`${lang}-${width}-page.png`),fullPage:true});
    const height=Math.ceil((await gallery.boundingBox()).height)+260;
    await page.setViewportSize({width,height:Math.max(1000,height)});
    await gallery.scrollIntoViewIfNeeded();
    await gallery.screenshot({path:path.join(out,`${lang}-${width}-concepts.png`)});
    await page.setViewportSize({width,height:1000});
    const links=gallery.locator('.concept-master > a[data-enlarge], .concept-card > a[data-enlarge]');
    assert.equal(await links.count(),5);
    for(let i=0;i<5;i++){
     const link=links.nth(i);await link.click();
     const dialog=page.locator('#image-viewer');await dialog.locator('img').evaluate(img=>img.decode());
     assert.equal(await dialog.evaluate(d=>d.open),true);
     assert.equal(await dialog.locator('img').getAttribute('src'),await link.evaluate(a=>a.href));
     await dialog.locator('input').evaluate(el=>{el.value='3';el.dispatchEvent(new Event('input',{bubbles:true}));});
     assert.equal(await dialog.locator('img').evaluate(el=>el.style.width),'300%');
     await page.keyboard.press('Escape');assert(await link.evaluate(el=>document.activeElement===el),'Keyboard focus returns');
    }
    // Hash navigation updates the native details asynchronously; await the visible destination.
    for(const id of ['ga','continuous','coupling']){
     await page.locator(`.quick-entry a[href="#cap-${id}"]`).click();
     await page.waitForFunction(id=>{const el=document.getElementById('cap-'+id);return el?.open&&!el.hidden;},id);
     assert(await page.locator('#cap-'+id).evaluate(el=>el.open&&!el.hidden));
     await page.locator('#cap-'+id+' summary').click();
    }
    await page.locator('#feature-group').selectOption('');
    for(const id of ['ga','runoff','et','dlayer']){
     const card=page.locator('#cap-'+id);await card.locator('summary').click();
     const item=data.items.find(x=>x.id===id);
     assert.equal(await card.locator('.detail-overview').innerText(),item['detail'+suffix]);
     assert.equal(await card.locator('.detail-status p').innerText(),item['now'+suffix]);
     assert.equal(await card.locator('.note p').innerText(),item['more'+suffix]);
     assert(item['more'+suffix].length<=(lang==='ko'?120:240),'Supplement stays brief');
     const target=await card.locator('.note .resource-links a').getAttribute('href');
     assert.equal(await page.locator(target).count(),1,'Concept deep link exists');
     await card.locator('summary').click();
    }
   }
   assert.deepEqual(errors,[]);
   results.push({lang,width,status:'PASS',...metric,thumbnailBoxes:boxes,inlineSvgDiagrams:svgSrcs.length});
   await context.close();
  }
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  for(const lang of ['ko','en']){
   const page=await nojs.newPage();await page.goto(base+(lang==='ko'?'/ko/':'/'));
   assert.equal(await page.locator('.capability').count(),46);
   assert.equal(await page.locator('#grid-hydrology-concepts img').count(),5);
   assert.equal(await page.locator('#overview .quick-entry a').count(),4);
   await page.locator('#cap-ga summary').click();assert.notEqual(await page.locator('#cap-ga').getAttribute('open'),null);
   await page.close();
  }
  await nojs.close();
 }finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks:results},null,2));await browser.close();}
 assert.equal(results.length,12);console.log('READABILITY PASS: 12 bilingual/viewport checks, 20 image interactions, preserved capabilities, direct links, no-JS fallback.');
})().then(()=>require('./capability-navigation-audit.cjs').run()).catch(e=>{console.error(e);process.exitCode=1;});
