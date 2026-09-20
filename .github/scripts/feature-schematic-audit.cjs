/* Inspect actual SVG text geometry, including bilingual panel padding. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {names,directory}=require('./build-feature-reference-svg.cjs');
const focused=require('./feature-specific-figures.cjs');
const entries=[...names.map(name=>({name,directory})),...Object.keys(focused.captions).map(name=>({name,directory:focused.directory}))];
const requiredLabels={
 'finite-volume':{ko:['i − 1','i','i + 1'],en:['i − 1','i','i + 1']},
 'flood-extras':{ko:['Domain Mask','Face Mask','차단','개방'],en:['Domain Mask','Face Mask','Wall','Open']},
 'rain-methods':{ko:['Thiessen','IDW'],en:['Thiessen','IDW']},
 'wb-1d2d':{ko:['1D 하천','2D 범람원'],en:['1D river','2D floodplain']},
 netcdf:{ko:['유역 격자 결과','범람 결과'],en:['Watershed-grid output','Flood output']},
 viewer:{ko:['평면 공간분포','선택 위치의 시간 변화'],en:['Plan-view distribution','Time variation at a location']},
 inputstudio:{ko:['공간 자료','프로젝트','엔진 입력'],en:['Spatial data','Project','Engine inputs']},
 'input-readiness':{ko:['원자료','정합성 검사','점검 결과'],en:['Source data','Consistency checks','Check results']},
 'rainfall-coverage':{ko:['관측','예측','결측'],en:['Observed','Forecast','Missing']},
 'initial-state-warmup':{ko:['초기상태','목표지점 유량','진단과 평가'],en:['Initial states','Target discharge','Diagnostic review']},
 'watershed-water-balance':{ko:['저장량 변화','증발산','유출'],en:['Change in storage','Evapotranspiration','Outflow']},
 'calibration-evaluation':{ko:['관측유량','매개변수 범위','성능지표 평가'],en:['Observed discharge','Parameter ranges','Evaluate metrics']},
 'result-lifecycle':{ko:['실행 조건 기록','결과 파일 생성','출력 요건 점검'],en:['Record run context','Write result files','Output integrity']},
 'nested-grid-patch':{ko:['원지형 격자','배경 병합 · Patch 유지'],en:['Source terrain grid','Grouped background · retained patch']},
 'snow-process':{ko:['강우 / 강설 분리','융설계수 보정','적설저장 · 융설'],en:['Rain / snow partition','Melt adjustment','Snow storage / melt']},
 'deep-storage-path':{ko:['D층 저장','상부 토양층 경로','선택적 심부 손실'],en:['D-layer storage','Upper soil-layer path','Optional deep loss']},
 'river-result-views':{ko:['종단면','횡단면','시계열','η₀','t₀'],en:['Longitudinal profile','Cross section','Time series','η₀','t₀']}
};
async function run(browser,base,out){
 const destination=path.join(out,'schematics');fs.mkdirSync(destination,{recursive:true});
 const page=await browser.newPage({viewport:{width:1200,height:720}}),results=[];
 try{for(const lang of ['ko','en'])for(const {name,directory} of entries){
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
   return {texts:texts.length,labels:texts.map(el=>el.textContent),errors,width:view.width,height:view.height};
  });
  assert.deepEqual(layout.errors,[],file+' text remains within canvas and panels');
  for(const label of requiredLabels[name][lang])assert.ok(layout.labels.includes(label),file+' contains required label: '+label);
  await page.setViewportSize({width:layout.width,height:layout.height});
  await page.screenshot({path:path.join(destination,name+'-'+lang+'.png')});
  results.push({file,status:'PASS',...layout});
 }}finally{await page.close();fs.writeFileSync(path.join(destination,'results.json'),JSON.stringify(results,null,2));}
 assert.equal(results.length,entries.length*2);console.log(`PASS ${results.length} bilingual SVG layouts: rendered text bounds and panel padding`);
}
module.exports={run};
