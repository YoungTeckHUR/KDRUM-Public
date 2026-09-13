/* Compare typography on identical content using the pre-density CSS baseline. */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const base=(process.env.BASE_URL||'http://127.0.0.1:8000/KDRUM-Public').replace(/\/$/,'');
const out=process.env.LAYOUT_AUDIT_DIR||'layout-density-artifacts';fs.mkdirSync(out,{recursive:true});
const baselineRef='2fc00db164a0d6d6d8ef6e78ebed745317d0a7ae';
// A committed snapshot survives squash merges and deletion of the PR branch.
const baselineCss=fs.readFileSync(path.join(root,'.github/fixtures/layout-before-2fc00db.css'),'utf8').replace(/\r\n/g,'\n');
assert.equal(createHash('sha256').update(baselineCss).digest('hex'),'077de95bd118ae8d560e9bf4a296f63f679aaaaa14b17b4707b60e39c79ec8c2','Exact pre-density CSS baseline');
const viewports=[[390,844],[768,1024],[1366,768],[1440,900],[1536,864],[1920,1080]];
const report={baselineRef,comparison:'Same content and images; only the stylesheet changes between before and after.',samples:[]};
async function noOverflow(page,label){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label+' overflow');}
async function metrics(page,selectors){return page.evaluate(selectors=>Object.fromEntries(Object.entries(selectors).map(([name,selector])=>{const el=document.querySelector(selector),style=getComputedStyle(el),box=el.getBoundingClientRect();return [name,{fontSize:parseFloat(style.fontSize),lineHeight:style.lineHeight,paddingTop:parseFloat(style.paddingTop),paddingBottom:parseFloat(style.paddingBottom),height:box.height,width:box.width}];})),selectors);}
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});try{
 for(const phase of ['before','after'])for(const lang of ['ko','en'])for(const [width,height] of viewports){
  const name=`${phase}-${lang}-${width}`,context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  if(phase==='before')await context.route('**/assets/site.css',route=>route.fulfill({status:200,contentType:'text/css',body:baselineCss}));
  const page=await context.newPage();await page.goto(base+(lang==='ko'?'/ko/':'/'));await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');
  await page.locator('.hero-image img').evaluate(img=>img.decode());await page.evaluate(()=>document.fonts.ready);
  const home=await metrics(page,{heroTitle:'.hero h1',sectionTitle:'#capabilities h2',body:'body',cardText:'.capability summary p',section:'#capabilities',card:'.capability summary'});
  await page.screenshot({path:path.join(out,name+'-hero.png')});await page.locator('.capability-grid').screenshot({path:path.join(out,name+'-cards.png')});
  if(phase==='after'){
   assert.ok(home.heroTitle.fontSize>=38&&home.heroTitle.fontSize<=46.1,name+' hero target');
   assert.ok(home.sectionTitle.fontSize>=28&&home.sectionTitle.fontSize<=32.1,name+' section title target');
   assert.ok(home.body.fontSize>=15&&home.body.fontSize<=16,name+' body target');
   const [min,max]=width<=700?[15.5,16.1]:[14,15.3];assert.ok(home.cardText.fontSize>=min&&home.cardText.fontSize<=max,name+' card text target');
   await noOverflow(page,name+' home');
  }
  await page.goto(base+'/media.html?lang='+lang);await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');
  const gallery=page.locator('#gallery-'+lang+' .gallery-group').first();
  for(const img of await gallery.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(img=>img.decode());}
  const media=await metrics(page,{pageTitle:'.page-title h1',groupTitle:'#gallery-'+lang+' h2',cardText:'#gallery-'+lang+' .media-body p'});
  await gallery.screenshot({path:path.join(out,name+'-gallery.png')});if(phase==='after')await noOverflow(page,name+' gallery');
  report.samples.push({phase,lang,width,height,home,media,result:'PASS'});console.log('PASS',name);await context.close();
 }
 for(const after of report.samples.filter(x=>x.phase==='after')){
  const before=report.samples.find(x=>x.phase==='before'&&x.lang===after.lang&&x.width===after.width);
  assert.ok(after.home.heroTitle.fontSize<before.home.heroTitle.fontSize,'Hero is more compact');
  assert.ok(after.home.section.paddingTop<=before.home.section.paddingTop,'Section density');
 }
 console.log('PASS typography before/after: 6 viewports x 2 languages; 72 screenshots');
}finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
