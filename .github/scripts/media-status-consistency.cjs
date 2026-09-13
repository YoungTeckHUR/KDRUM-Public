/* Guard against maturity/status contradictions in the public Visual Guide. */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const content=JSON.parse(fs.readFileSync(path.join(root,'docs/assets/site-content.json'),'utf8'));
const siteJs=fs.readFileSync(path.join(root,'docs/assets/site.js'),'utf8');

function assert(condition,message){
  if(!condition){
    console.error(`FAIL: ${message}`);
    process.exitCode=1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

const items=Array.isArray(content.items)?content.items:[];
const waterQualityDisabled=items.some(item=>
  item.s==='DISABLED / REDEVELOPMENT' &&
  /수질|water[- ]?quality/i.test(`${item.ko||''} ${item.en||''} ${item.sumKo||''} ${item.sumEn||''} ${item.nowKo||''} ${item.nowEn||''}`)
);

assert(waterQualityDisabled,'water-quality capability remains explicitly disabled/redevelopment');
assert(siteJs.includes("patchCard('02_water_cycle.jpg','Core 확립 · D-layer 개발 중','Established Core · D-layer in development')"),'gallery 02 distinguishes established Core from D-layer development');
assert(siteJs.includes("patchCard('07_continuous_hydrology.jpg','Core 확립 · D-layer 개발 중','Established Core · D-layer in development')"),'gallery 07 distinguishes established Core from D-layer development');
assert(siteJs.includes('수질 출력은 그림에 포함된 확장 개념이며, 현재 공개 버전에서는 비활성·재개발 후보입니다.'),'gallery 04 carries adjacent Korean water-quality status clarification');
assert(siteJs.includes('Water-quality output is an illustrated extension concept; it is disabled in the current public version and remains a redevelopment candidate.'),'gallery 04 carries adjacent English water-quality status clarification');

if(process.exitCode) process.exit(process.exitCode);
console.log('Media maturity/status consistency checks passed.');
