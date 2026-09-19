'use strict';
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{createHash}=require('node:crypto');
const baseline=fs.readFileSync(path.join(__dirname,'../fixtures/typography-before-40ded09.css'),'utf8');
assert.equal(createHash('sha1').update('blob '+Buffer.byteLength(baseline)+'\0').update(baseline).digest('hex'),'3f568b504a147595609ba49b1c67e298cdd57fc0','Exact accepted baseline CSS');
const base=(process.env.BASE_URL||'http://127.0.0.1:8000/KDRUM-Public').replace(/\/$/,'');
const out=path.join(process.env.READABILITY_AUDIT_DIR||'browser-artifacts/readability','typography');
const sizes=[320,390,768,1366,1440,1536,1920];
async function reflow(page,label){
 // Closed native details can retain layout boxes while their contents are not painted.
 // Measure rendered text; the zoom checks below separately open every shared-caption card.
 const m=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...document.querySelectorAll('main h2,main h3,main h4,main p,main li,main figcaption')].filter(el=>el.checkVisibility()&&el.getBoundingClientRect().height>0&&el.getBoundingClientRect().width>0&&(el.scrollWidth>el.clientWidth+2||el.scrollHeight>el.clientHeight+2)).map(el=>el.tagName+': '+el.textContent.slice(0,60))}));
 assert.equal(m.overflow,false,label+' page overflow');assert.deepEqual(m.clipped,[],label+' clipped text');
}
async function metrics(page){return page.evaluate(()=>{
 const font=s=>{const n=document.querySelector(s),cs=getComputedStyle(n);return {size:parseFloat(cs.fontSize),line:parseFloat(cs.lineHeight)};};
 const row=s=>[...document.querySelectorAll(s)].filter(n=>!n.hidden&&n.getBoundingClientRect().height).map(n=>{const r=n.getBoundingClientRect();return {y:r.top+scrollY,h:r.height};});
 return {hero:font('.hero h1'),section:font('#capabilities h2'),body:font('.capability summary p'),detail:font('.cap-detail p'),feature:font('.capability summary h3'),subheading:font('.cap-detail h4'),badge:font('.badge'),caption:font('.hero-image figcaption'),program:font('.program p'),cards:row('.capability:not([open])'),height:document.documentElement.scrollHeight};
 });}
function equalRows(rows,label){const groups=new Map();for(const r of rows){const y=Math.round(r.y);if(!groups.has(y))groups.set(y,[]);groups.get(y).push(r.h);}for(const heights of groups.values())if(heights.length>1)assert.ok(Math.max(...heights)-Math.min(...heights)<2,label+' unequal row heights');}
async function run(){
 fs.mkdirSync(out,{recursive:true});const results=[],supplement=[];
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 try{
 for(const lang of ['ko','en'])for(const width of sizes){
  let before,contentBefore;
  for(const phase of ['before','after']){
   const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
   if(phase==='before')await context.route('**/assets/site.css',r=>r.fulfill({status:200,contentType:'text/css',body:baseline}));
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+(lang==='ko'?'/ko/':'/'));await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');await page.evaluate(()=>document.fonts.ready);
   const content=await page.locator('main').textContent(),m=await metrics(page);
   if(phase==='before'){before=m;contentBefore=content;}else{
    assert.equal(content,contentBefore,'No public text changes');assert.deepEqual(m.hero,before.hero,'Hero sizing retained');assert.deepEqual(m.section,before.section,'Section title sizing retained');
    for(const k of ['body','detail','program'])assert.equal(m[k].size,16,lang+' '+width+' '+k+' 16px');
    assert.equal(m.feature.size,18);assert.equal(m.subheading.size,16);assert.equal(m.badge.size,13);assert.equal(m.caption.size,14);
    assert.ok(m.body.line>=27);equalRows(m.cards,lang+' '+width+' initial cards');await reflow(page,lang+' '+width);
    await page.locator('#feature-group').selectOption('');equalRows((await metrics(page)).cards,lang+' '+width+' all 46 cards');await reflow(page,lang+' '+width+' all cards');
    await page.locator('#feature-group').selectOption('forcing');
    const rows=await page.locator('.concept-card').evaluateAll(cards=>cards.map(c=>{const r=c.getBoundingClientRect(),link=c.querySelector('.concept-links').getBoundingClientRect();return {y:r.top+scrollY,h:link.top-r.top};}));equalRows(rows,lang+' '+width+' concept links');
   }
   if(width===390||width===1440){
    for(const img of await page.locator('main img:visible').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
    await page.goto(base+(lang==='ko'?'/ko/':'/'));await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');
    await page.screenshot({path:path.join(out,phase+'-'+lang+'-'+width+'-page.png'),fullPage:true});
    await page.locator('#grid-hydrology-concepts').screenshot({path:path.join(out,phase+'-'+lang+'-'+width+'-concepts.png')});
    await page.locator('#feature-group').selectOption('');await page.locator('#cap-ga summary').click();
    await page.setViewportSize({width,height:Math.max(1000,Math.ceil(await page.locator('#cap-ga').evaluate(el=>el.getBoundingClientRect().height))+240)});
    if(phase==='after')await reflow(page,lang+' '+width+' open detail');
    await page.locator('#cap-ga').screenshot({path:path.join(out,phase+'-'+lang+'-'+width+'-detail.png')});
    if(phase==='after'&&width===1440){
     await page.evaluate(()=>document.documentElement.style.zoom='2');await reflow(page,lang+' CSS zoom 200%');
     for(const id of ['rain-spatial','rain-methods','wb','coupling']){
      const card=page.locator('#cap-'+id);await card.locator('summary').click();
      assert.ok(await card.locator('figcaption').evaluate(el=>el.checkVisibility()),id+' caption is rendered');
      await reflow(page,lang+' '+id+' open at CSS zoom 200%');
      supplement.push({lang,id,test:'expanded-caption-200-percent',result:'PASS'});await card.locator('summary').click();
     }
    }
   }
   assert.deepEqual(errors,[]);results.push({lang,width,phase,result:'PASS',...m});await context.close();
  }
 }
 for(const lang of ['ko','en']){
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),page=await context.newPage();await page.goto(base+(lang==='ko'?'/ko/':'/'));assert.equal(await page.locator('.capability:visible').count(),46);await page.locator('#cap-ga summary').click();await reflow(page,lang+' no-JS');supplement.push({lang,test:'no-JS',result:'PASS'});await context.close();
 }
 for(const width of [390,1440])for(const suffix of ['/media.html?lang=ko','/media.html?lang=en','/seo-kdrum.html']){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await page.goto(base+suffix);await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');await reflow(page,suffix+' '+width);supplement.push({page:suffix,width,result:'PASS'});await page.close();
 }
 console.log('TYPOGRAPHY PASS: 28 baseline/candidate cases, 14 responsive comparisons, 8 expanded-caption zoom, 2 no-JS and 6 media/FAQ cases; unchanged text/headings and balanced cards.');
 }finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({baseline:'40ded09',checks:results,supplement},null,2));await browser.close();}
 assert.equal(results.length,28);assert.equal(supplement.length,16);
}
module.exports={run};if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});
