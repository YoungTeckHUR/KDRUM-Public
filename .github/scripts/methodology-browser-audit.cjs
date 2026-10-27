/* Render current methodology, lifecycle axes and editable overview diagrams. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const review=require('../../docs/assets/capability-review.json');
const theory=require('../../docs/assets/theory-current.json');
const base=(process.env.BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const out=process.env.METHOD_AUDIT_DIR||'browser-artifacts/methodology';
async function checkBounds(page,label){
 const r=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...document.querySelectorAll('.feature-methodology p,.lifecycle-status dd,.numerical-body p,.formula')].filter(e=>e.getClientRects().length&&e.scrollWidth>e.clientWidth+2).map(e=>e.textContent.slice(0,100))}));
 assert.equal(r.overflow,false,label+' page overflow');assert.deepEqual(r.clipped,[],label+' method text clipped');
}
async function run(){
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({headless:true}),results=[];
 try{
  for(const lang of ['ko','en'])for(const width of [1440,390,320]){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
   const home=base+(lang==='ko'?'/ko/':'/');
   async function go(hash){await page.goto(home+'#'+hash);await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');await page.evaluate(()=>document.fonts.ready);}
   await go('cap-dwnet');
   assert.equal(await page.locator('[data-methodology-for]').count(),46);
   assert.equal(await page.locator('.lifecycle-status').count(),46);
   for(const id of ['dwnet','local-inertia','coupling','fullswe']){
    await go('cap-'+id);const card=page.locator('#cap-'+id);await card.locator('.technical-details').evaluate(e=>e.open=true);
    assert.equal(await card.getAttribute('data-status'),review.items[id].status);
    assert.equal(await card.locator('.lifecycle-status dt').count(),3);
    assert.ok(await card.locator('[data-methodology-for="'+id+'"]').isVisible());
    await checkBounds(page,lang+' '+width+' '+id);
    if(width!==320)await card.screenshot({path:path.join(out,lang+'-'+width+'-'+id+'.png')});
    results.push({lang,width,id,status:'PASS'});
   }
   for(const c of theory.chapters){
    await go(c.id);const topic=page.locator('#'+c.id);assert.ok(await topic.evaluate(e=>e.open));
    assert.ok((await topic.innerText()).length>400);await checkBounds(page,lang+' '+width+' '+c.id);
    if(width!==320)await topic.screenshot({path:path.join(out,lang+'-'+width+'-'+c.id+'.png')});
    results.push({lang,width,id:c.id,status:'PASS'});
   }
   await context.close();
  }
  const p=await browser.newPage({viewport:{width:1200,height:800}});
  for(const lang of ['ko','en'])for(const stem of ['model-workflow','river-floodplain','program-workflow']){
   const file=stem+'-'+lang+'.svg';const response=await p.goto(base+'/assets/diagrams/'+file);assert.equal(response.status(),200);
   await p.evaluate(()=>document.fonts.ready);
   const bad=await p.evaluate(()=>{const v=document.documentElement.viewBox.baseVal;return [...document.querySelectorAll('text')].filter(e=>{const b=e.getBBox();return b.x<0||b.y<0||b.x+b.width>v.width+1||b.y+b.height>v.height+1;}).map(e=>e.textContent);});
   assert.deepEqual(bad,[],file+' SVG canvas bounds');await p.screenshot({path:path.join(out,file+'.png')});
   results.push({file,status:'PASS'});
  }
  await p.close();console.log('PASS methodology browser review:',results.length,'cases');
 }finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
