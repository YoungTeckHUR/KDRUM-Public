const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=(process.env.BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const out=process.env.AUDIT_DIR||'site-artifacts';fs.mkdirSync(out,{recursive:true});
const data=require('../../docs/assets/site-content.json');const results=[];
const screenshots=process.env.AUDIT_SCREENSHOTS!=='0';
async function noOverflow(page,label){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,label+' horizontal overflow');}
async function loadedImages(page){const imgs=page.locator('img:visible');for(let i=0;i<await imgs.count();i++){await imgs.nth(i).scrollIntoViewIfNeeded();await imgs.nth(i).evaluate(img=>img.decode());}}
async function contrast(page){
 const checks=await page.evaluate(()=>{
  const rgb=value=>value.match(/[\d.]+/g).map(Number),lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  return ['.hero .lead','.hero .support','.button.primary','.button:not(.primary)','.badge.established','.badge.development','.result-count','.site-footer p','.site-footer a'].map(selector=>{
   const el=document.querySelector(selector);if(!el)return null;let node=el,bg;
   while(node){const c=rgb(getComputedStyle(node).backgroundColor);if(c.length===3||c[3]===1){bg=c;break;}node=node.parentElement;}
   const a=lum(rgb(getComputedStyle(el).color)),b=lum(bg||[255,255,255]);return {selector,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
  }).filter(Boolean);
 });
 for(const check of checks)assert.ok(check.ratio>=4.5,`${check.selector} contrast ${check.ratio.toFixed(2)}`);return checks;
}
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});try{
 for(const lang of ['en','ko'])for(const width of [320,390,768,1440]){
  const name=lang+'-'+width,context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url());});
  const url=base+(lang==='ko'?'/ko/':'/');await page.goto(url);await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');
  assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.capability').count(),46);assert.equal(await page.locator('.capability:visible').count(),5);
  if(width<1000)assert.equal(await page.locator('.header-links .nav-download').isVisible(),false);
  const heroRatio=await page.locator('.hero-image img').evaluate(img=>img.getBoundingClientRect().width/img.getBoundingClientRect().height);assert.ok(Math.abs(heroRatio-(width<=700?1.9:1.15))<.02,'Hero respects the responsive image aspect ratio');
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://youngteckhur.github.io/KDRUM-Public/'+(lang==='ko'?'ko/':''));
  for(const group of data.groups){await page.locator('#feature-group').selectOption(group.id);assert.equal(await page.locator('.capability:visible').count(),data.items.filter(i=>i.g===group.id).length);}
  await page.locator('#feature-group').selectOption('');await page.locator('#feature-search').fill('NetCDF');assert.ok(await page.locator('.capability:visible').count()>0);
  await page.locator('#feature-search').fill('zz-no-such-capability');assert.equal(await page.locator('.capability:visible').count(),0);assert.ok(await page.locator('#no-results').isVisible());await page.locator('#feature-search').fill('');
  if(width===1440||width===390){for(const item of data.items){const card=page.locator('#cap-'+item.id);assert.equal(await card.getAttribute('data-status'),item.s);await card.locator('summary').click();assert.ok(await card.getAttribute('open')!==null);assert.ok((await card.locator('.detail-status').innerText()).includes(item[lang==='ko'?'nowKo':'nowEn']));await noOverflow(page,name+' '+item.id);await card.locator('summary').click();}}
  const first=page.locator('#cap-rain-spatial');await first.locator('summary').focus();await page.keyboard.press('Enter');assert.ok(await first.getAttribute('open')!==null);await first.locator('summary').press('Enter');
  for(const id of ['overview','capabilities','results','programs','research','download']){await page.locator('.site-nav a[href="#'+id+'"]').click();assert.ok(page.url().endsWith('#'+id));await noOverflow(page,name+' '+id);}
  // Direct feature hashes remain usable from bookmarked links.
  await page.goto(url+'#cap-dlayer');await page.waitForFunction(()=>document.getElementById('cap-dlayer').open);assert.ok(await page.locator('#cap-dlayer').isVisible());await page.locator('#cap-dlayer summary').click();
  await page.goto(url+'#architecture');assert.ok(await page.locator('#overview').evaluate(el=>Math.abs(el.getBoundingClientRect().top-parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop))<3));
  await loadedImages(page);await noOverflow(page,name);
  const enlarge=page.locator('#overview .figure a').first();await enlarge.click();assert.ok(await page.locator('#image-viewer').evaluate(d=>d.open));await page.locator('#image-viewer img').evaluate(img=>img.decode());
  const zoom=page.locator('#image-viewer input');await zoom.focus();await zoom.press('ArrowRight');await zoom.press('ArrowRight');assert.equal(await zoom.inputValue(),'2');assert.ok(await page.locator('.image-pan').evaluate(el=>el.scrollWidth>el.clientWidth*1.9));await noOverflow(page,name+' zoomed image');await page.keyboard.press('Escape');assert.ok(await enlarge.evaluate(a=>a===document.activeElement));
  const textContrast=await contrast(page);assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  if(width===1440){await page.evaluate(()=>document.documentElement.style.zoom='2');await noOverflow(page,name+' 200% CSS zoom');await page.evaluate(()=>document.documentElement.style.zoom='');}
  const invalidIds=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.filter((id,i)=>ids.indexOf(id)!==i);});assert.deepEqual(invalidIds,[]);
  // Every fragment in the rendered home resolves without framework/runtime rewriting.
  assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id))),[]);
  if(screenshots&&(width===390||width===1440)){await page.goto(url);await page.screenshot({path:path.join(out,name+'-hero.png')});await page.screenshot({path:path.join(out,name+'-home.png'),fullPage:true});await page.locator('#cap-rain-spatial summary').click();await page.locator('#cap-rain-spatial').screenshot({path:path.join(out,name+'-detail.png')});}
  assert.deepEqual(errors,[],name);results.push({name,status:'PASS',capabilities:46,groups:8,keyboard:true,imageZoom:'200%',images:true,overflow:false,textContrast,cssZoom:width===1440?'200% reflow checked':'not sampled'});console.log('PASS',name);await context.close();
 }
 // Content and native details still work with JavaScript unavailable.
 for(const lang of ['en','ko']){const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),p=await context.newPage();await p.goto(base+(lang==='ko'?'/ko/':'/'));assert.equal(await p.locator('.capability:visible').count(),46);await p.locator('#cap-rain-spatial summary').click();assert.ok(await p.locator('#cap-rain-spatial').getAttribute('open')!==null);await noOverflow(p,'no-js '+lang);results.push({name:'no-js-'+lang,status:'PASS'});await context.close();}
 // FAQ and current shared styles are present; no invented language alternates.
 const p=await browser.newPage();await p.goto(base+'/seo-kdrum.html');assert.equal(await p.locator('.faq').count(),12);assert.equal(await p.locator('link[hreflang]').count(),0);assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),'https://youngteckhur.github.io/KDRUM-Public/seo-kdrum.html');await noOverflow(p,'FAQ');await p.close();
}finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
