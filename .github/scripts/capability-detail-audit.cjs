const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=require('../../docs/assets/site-content.json');
const references=require('./feature-reference-images.cjs');references.validate(data);
const {validate,duplicateSentences}=require('./capability-contract.cjs');validate(data);
const base=(process.env.BASE_URL||'http://127.0.0.1:8000/KDRUM-Public').replace(/\/$/,'');
const out=process.env.CAPABILITY_AUDIT_DIR||'browser-artifacts/capability-details';fs.mkdirSync(out,{recursive:true});
const results=[];
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 try{await require('./feature-schematic-audit.cjs').run(browser,base,out);
 for(const lang of ['ko','en'])for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
  await page.goto(base+(lang==='ko'?'/ko/':'/'));
  await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');
  await page.locator('#feature-group').selectOption('');
  const suffix=lang==='ko'?'Ko':'En';
  for(const item of data.items){
   const card=page.locator('#cap-'+item.id);await card.locator('summary').click();
   assert.notEqual(await card.getAttribute('open'),null,item.id+' opens');
   assert.equal(await card.locator('h3').innerText(),item[lang]);
   assert.equal(await card.locator('summary p').innerText(),item['sum'+suffix]);
   assert.equal(await card.locator('.detail-overview').innerText(),item['detail'+suffix]);
   assert.equal(await card.locator('.detail-status p').innerText(),item['now'+suffix]);
   assert.equal(await card.getAttribute('data-status'),item.s);
   const steps=await card.locator('ol li').allTextContents();assert.equal(steps.length,3);
   steps.forEach((s,i)=>assert.equal(s.split(' — ')[1],item['steps'+suffix][i],item.id+' step '+i));
   assert.equal(await card.locator('.figure[data-shared-diagram]').count(),item.diagram?1:0,item.id+' shared figure mapping');
   const concept=references.concepts[item.id],reference=card.locator('.feature-reference');
   assert.equal(await reference.count(),concept?1:0,item.id+' reference image mapping');
   if(concept){
    const caption=concept[lang==='ko'?1:2],image=reference.locator('img'),link=reference.locator('.feature-reference-image');
    assert.equal(await reference.getAttribute('data-reference-feature'),item.id);
    assert.equal(await image.getAttribute('alt'),caption);
    assert.equal(await reference.locator('figcaption span').innerText(),caption);
    const asset=references.getReference(item.id,lang),expected=asset.src;
    assert.ok((await image.getAttribute('src')).endsWith(expected));
    await image.scrollIntoViewIfNeeded();await image.evaluate(el=>el.decode());
    assert.deepEqual(await image.evaluate(el=>[el.naturalWidth,el.naturalHeight]),[asset.width,asset.height]);
    assert.ok(await image.evaluate(el=>el.getBoundingClientRect().width<=640),'Reference stays compact');
    await link.click();await page.locator('#image-viewer img').evaluate(el=>el.decode());
    assert.ok((await page.locator('#image-viewer img').getAttribute('src')).endsWith(expected));
    assert.equal(await page.locator('#image-caption').innerText(),await link.getAttribute('data-caption'));
    await page.keyboard.press('Escape');assert.equal(await link.evaluate(el=>el===document.activeElement),true,'Viewer restores focus');
   }
   const linked=references.linkedConcepts[item.id]||[],linkElements=card.locator('[data-reference-target]');
   assert.equal(await linkElements.count(),linked.length,item.id+' related reference count');
   for(let index=0;index<linked.length;index++){
    const [target,ko,en]=linked[index],link=linkElements.nth(index),asset=references.getReference(target,lang);
    assert.equal(await link.getAttribute('data-reference-target'),target);
    assert.equal(await link.innerText(),(lang==='ko'?ko:en)+' ↗');
    assert.ok((await link.getAttribute('href')).endsWith(asset.src));
    await link.click();await page.locator('#image-viewer img').evaluate(el=>el.decode());
    assert.ok((await page.locator('#image-viewer img').getAttribute('src')).endsWith(asset.src));
    assert.equal(await page.locator('#image-caption').innerText(),asset.caption);
    await page.keyboard.press('Escape');assert.ok(await link.evaluate(el=>el===document.activeElement));
   }
   if(references.galleryConcepts[item.id])assert.equal(await card.locator('a[href="#'+references.galleryConcepts[item.id]+'"]').count(),1);
   if(item.id==='wq'){assert.equal(await reference.count(),0);assert.equal(await linkElements.count(),0);assert.equal(item.s,'DISABLED / REDEVELOPMENT');}
   if(item.diagram){
    const shared=card.locator('.figure[data-shared-diagram]');
    assert.equal(await shared.getAttribute('data-shared-diagram'),item.diagram);
    assert.equal(await shared.locator('img').count(),0,'Shared diagram is not duplicated inline');
    // The dialog retains its last image source after closing; it is not an inline duplicate.
    const img=page.locator(`main img[src$="/diagrams/${item.diagram}-${lang}.svg"]`);
    assert.equal(await img.count(),1,'Exactly one representative diagram remains in main');
    await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
    assert.ok((await shared.locator('a[data-enlarge]').getAttribute('href')).endsWith(`/diagrams/${item.diagram}-${lang}.svg`));
    assert.equal(await shared.locator('figcaption span').innerText(),item['diagramCaption'+suffix]);
    await shared.locator('[data-enlarge]').click();await page.locator('#image-viewer img').evaluate(el=>el.decode());
    assert.equal(await page.locator('#image-caption').innerText(),item['diagramCaption'+suffix]);await page.keyboard.press('Escape');
   }
   const layout=await card.evaluate(el=>({pageOverflow:document.documentElement.scrollWidth>innerWidth+1,clipped:[...el.querySelectorAll('h3,p,li,figcaption')].filter(n=>n.scrollWidth>n.clientWidth+1||n.scrollHeight>n.clientHeight+1).map(n=>n.tagName),height:el.getBoundingClientRect().height}));
   assert.equal(layout.pageOverflow,false,item.id+' page overflow');assert.deepEqual(layout.clipped,[],item.id+' clipped content');
   await page.setViewportSize({width,height:Math.max(1000,Math.ceil(layout.height)+240)});
   await card.scrollIntoViewIfNeeded();
   assert.ok(await card.locator('h3').evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),item.id+' title not occluded');
   const screenshot=`${lang}-${width}-${item.id}.png`;await card.screenshot({path:path.join(out,screenshot)});
   results.push({id:item.id,lang,width,status:'PASS',fields:['name','summary','input','process','output','overview','status','diagram'],diagram:item.diagram,layout,screenshot});
   await card.locator('summary').click();await page.setViewportSize({width,height:1000});
  }
  assert.deepEqual(errors,[]);console.log('PASS all 46 rendered capability details',lang,width);await context.close();
 }}finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks:results,duplicateSentences:duplicateSentences(data)},null,2));await browser.close();}
 assert.equal(results.length,184);
})().catch(e=>{console.error(e);process.exitCode=1;});
