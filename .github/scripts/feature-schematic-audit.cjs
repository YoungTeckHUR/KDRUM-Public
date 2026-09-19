/* Inspect actual SVG text geometry, including bilingual panel padding. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {names,directory}=require('./build-feature-reference-svg.cjs');
async function run(browser,base,out){
 const destination=path.join(out,'schematics');fs.mkdirSync(destination,{recursive:true});
 const page=await browser.newPage({viewport:{width:1200,height:720}}),results=[];
 try{for(const lang of ['ko','en'])for(const name of names){
  const file=directory+name+'-'+lang+'.svg';
  const response=await page.goto(base+'/'+file);assert.equal(response.status(),200,file);
  await page.evaluate(()=>document.fonts.ready);
  const layout=await page.evaluate(()=>{
   const root=document.documentElement,view=root.viewBox.baseVal,errors=[];
   const panels=[...document.querySelectorAll('rect[x]')].map(el=>({x:Number(el.getAttribute('x')),y:Number(el.getAttribute('y')),w:Number(el.getAttribute('width')),h:Number(el.getAttribute('height'))})).filter(r=>r.w<1199);
   const texts=[...document.querySelectorAll('text')];
   for(const el of texts){
    const b=el.getBBox(),x=Number(el.getAttribute('x')),y=Number(el.getAttribute('y'));
    if(b.x<0||b.y<0||b.x+b.width>view.width+1||b.y+b.height>view.height+1)errors.push('Canvas: '+el.textContent);
    for(const r of panels)if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h&&(b.x<r.x+6||b.x+b.width>r.x+r.w-6||b.y+b.height>r.y+r.h-6))errors.push('Panel: '+el.textContent);
   }
   return {texts:texts.length,errors,width:view.width,height:view.height};
  });
  assert.deepEqual(layout.errors,[],file+' text remains within canvas and panels');
  assert.ok(layout.texts>=10,file+' contains explanatory labels');
  await page.screenshot({path:path.join(destination,name+'-'+lang+'.png')});
  results.push({file,status:'PASS',...layout});
 }}finally{await page.close();fs.writeFileSync(path.join(destination,'results.json'),JSON.stringify(results,null,2));}
 assert.equal(results.length,16);console.log('PASS 16 bilingual SVG layouts: rendered text bounds and panel padding');
}
module.exports={run};
