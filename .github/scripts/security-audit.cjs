const fs=require('fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const root=require('node:path').resolve(__dirname,'../..');
const read=p=>fs.readFileSync(require('node:path').join(root,p),'utf8');
for(const file of ['index.html','ko/index.html','media.html','seo-kdrum.html']){
 const html=read('docs/'+file),csp=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
 for(const directive of ["default-src 'self'","script-src-attr 'none'","object-src 'none'","base-uri 'none'","form-action 'none'"])assert.ok(csp.includes(directive),file+' '+directive);
 assert.ok(!csp.match(/script-src[^;]*'unsafe-(inline|eval)'/));
 assert.ok(html.includes('data-analytics-toggle'));assert.ok(!/Thiessen|티센/i.test(html));
}
for(const lang of ['ko','en'])assert.ok(!/Thiessen|티센/i.test(read('docs/assets/diagrams/feature-specific/rain-methods-'+lang+'.svg')));
for(const name of fs.readdirSync(require('node:path').join(root,'.github/workflows'))){
 for(const match of read('.github/workflows/'+name).matchAll(/^\s*(?:-\s*)?uses:\s+([^\s#]+)/gm))assert.match(match[1],/@[a-f0-9]{40}$/,name+' immutable action');
}
const source=read('docs/assets/analytics.js');
function run(options={}){
 const listeners={},scriptListeners={},buttonListeners={},calls=[],scripts=[];
 let stored=options.optout?'1':null,reloads=0;
 const status={},button={addEventListener:(n,f)=>buttonListeners[n]=f,closest:s=>s==='[data-language]'?null:{querySelector:()=>status}};
 const ctx={window:{KDRUM_ANALYTICS:{enabled:true,provider:'goatcounter',goatCounterEndpoint:'https://kdrum-public.goatcounter.com/count'}},navigator:{doNotTrack:options.dnt?'1':'0',globalPrivacyControl:!!options.gpc},location:{hostname:options.local?'localhost':'youngteckhur.github.io',pathname:'/KDRUM-Public/',search:'?secret=do-not-send',hash:'#private',reload:()=>reloads++},localStorage:{getItem:()=>{if(options.storageFail)throw Error('denied');return stored;},setItem:(_,v)=>stored=v},document:{documentElement:{lang:'en'},querySelector:s=>s==='[data-analytics-toggle]'?button:status,querySelectorAll:s=>s==='[data-analytics-toggle]'?[button]:[],createElement:()=>({dataset:{},addEventListener:(n,f)=>scriptListeners[n]=f}),head:{append:s=>scripts.push(s)},addEventListener:(n,f)=>listeners[n]=f},addEventListener:(n,f)=>listeners[n]=f,URL};
 vm.runInNewContext(source,ctx);
 return {ctx,calls,scripts,buttonListeners,listeners,button,status,load(){ctx.window.goatcounter.count=p=>calls.push(p);scriptListeners.load?.();},get stored(){return stored;}};
}
for(const options of [{optout:true},{dnt:true},{gpc:true},{storageFail:true},{local:true}])assert.equal(run(options).scripts.length,0,JSON.stringify(options));
const normal=run();assert.equal(normal.scripts.length,1);assert.match(normal.scripts[0].src,/count\.v5\.js$/);assert.match(normal.scripts[0].integrity,/^sha384-/);assert.equal(normal.scripts[0].crossOrigin,'anonymous');normal.load();assert.equal(normal.calls.length,1);assert.equal(normal.calls[0].path,'/KDRUM-Public/');assert.equal(normal.calls[0].referrer,'');
const late=run();late.buttonListeners.click();late.load();assert.equal(late.calls.length,0,'opt-out before script load');assert.equal(late.stored,'1');
normal.buttonListeners.click();normal.listeners.click({target:{closest:()=>({href:'https://www.water.or.kr/',classList:{contains:()=>false},hasAttribute:()=>false})}});assert.equal(normal.calls.length,1,'opt-out stops subsequent events');
console.log('PASS security contract: CSP, no Thiessen offering, immutable actions, DNT/GPC/opt-out/storage failure/local preview, SRI and late-load race');
if(process.argv.includes('--browser'))(async()=>{
 const {chromium}=require('playwright');const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base=process.env.BASE_URL||'http://127.0.0.1:8000/KDRUM-Public';
  for(const suffix of ['/','/ko/','/media.html?lang=en','/seo-kdrum.html']){
   await page.goto(base+suffix);await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');
   await page.locator('.analytics-notice:visible summary').click();await page.locator('[data-analytics-toggle]:visible').waitFor({state:'visible'});
   assert.equal(await page.evaluate(()=>!!document.querySelector('script[src^="https://gc.zgo.at"]')),false,'preview never loads analytics');
   const result=await page.evaluate(async()=>{
    const violations=[];const handler=e=>violations.push(e.effectiveDirective);document.addEventListener('securitypolicyviolation',handler);
    const inline=document.createElement('script');inline.textContent='window.securityProbeExecuted=true';document.head.append(inline);
    const external=document.createElement('script');external.src='https://example.invalid/untrusted.js';document.head.append(external);
    await new Promise(r=>setTimeout(r,150));document.removeEventListener('securitypolicyviolation',handler);
    return {ran:!!window.securityProbeExecuted,violations};
   });
   assert.equal(result.ran,false);assert.ok(result.violations.length>=2,'CSP blocked inline and untrusted remote code');
  }
  // Missing optional local analytics code must not prevent routing or details.
  await page.route('**/assets/analytics*.js',r=>r.abort());await page.goto(base+'/#cap-ga');
  await page.waitForFunction(()=>document.documentElement.dataset.siteReady==='true');assert.ok(await page.locator('#cap-ga').isVisible());
  assert.deepEqual(errors,[]);console.log('PASS browser security: four pages enforce CSP; blocked analytics preserves navigation');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
