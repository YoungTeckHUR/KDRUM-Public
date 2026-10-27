/* Explicit 2026-10-28 review contract: protect accuracy, not obsolete status labels. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const current=require('./current-content.cjs');
const data=require('../../docs/assets/site-content.json');
current.validate(data);
assert.equal(current.review.revision,'2026-10-28');
for(const lang of ['ko','en']){
 const file=path.join(root,'docs',lang==='ko'?'ko/index.html':'index.html');
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/data-methodology-for=/g)||[]).length,46,lang+' methodology coverage');
 assert.equal((html.match(/class="detail-status lifecycle-status"/g)||[]).length,46,lang+' separate lifecycle axes');
 for(const i of data.items){assert.ok(html.includes(`data-methodology-for="${i.id}"`),i.id+' detail');const r=current.review.items[i.id];assert.ok(r[lang].mechanism.length>80,i.id+' substantive explanation');}
 for(const c of current.theory.chapters)assert.ok(html.includes(`id="${c.id}"`),lang+' chapter '+c.id);
 for(const id of ['dwnet','junction','local-inertia','coupling','wb-1d2d']){
  const marker=`id="cap-${id}"`,p=html.indexOf(marker),end=html.indexOf('<details class="capability"',p+marker.length);
  const card=html.slice(p,end<0?undefined:end);
  assert.ok(card.includes('data-status="COMPLETED"'),id+' complete');
  assert.ok(!/ACTIVE DEVELOPMENT|VALIDATED DEVELOPMENT|개발 중|개발중|under development|remains in development/.test(card),id+' no contradictory status');
 }
 assert.ok(html.includes('netcdf')&&html.includes('MyWater'));
}
for(const name of ['DEVELOPMENT_STATUS.md','CAPABILITY_ATLAS.md','CAPABILITIES.md','MODEL_CARD.md','TECHNICAL_METHODS.md','ROADMAP.md','llms.txt','docs/llms.txt']){
 const s=fs.readFileSync(path.join(root,name),'utf8');assert.ok(s.includes('2026-10-28'),name+' dated current review');
 assert.ok(!s.includes('public maturity baseline reviewed 2026-10-01'),name+' no frozen status baseline');
}
assert.equal(current.theory.chapters.length,6);
assert.ok(data.media.featureStatus[11][1].includes('개발 완료'));
assert.ok(data.media.featureStatus[13][1].includes('개발 완료'));
console.log('PASS 46 bilingual method/status records, completed hydraulics, six added theory chapters, 3-axis availability and current docs');

for(const lang of ['ko','en']){
 for(const stem of ['model-workflow','river-floodplain']){
  const svg=fs.readFileSync(path.join(root,'docs/assets/diagrams',stem+'-'+lang+'.svg'),'utf8');
  assert.ok(!/IN DEVELOPMENT|in development|developing hydraulic|개발 중|개발·검증 단계/.test(svg),stem+' '+lang+' completed SVG labels');
  assert.ok(lang==='ko'?svg.includes('개발 완료'):/complete|COMPLETED/.test(svg),stem+' '+lang+' current label');
 }
 const p=fs.readFileSync(path.join(root,'docs/assets/diagrams/program-workflow-'+lang+'.svg'),'utf8');
 assert.ok(!/수리 확장 개발|통합 개발 중|INTEGRATION DEV\./.test(p),'Core/output diagram status '+lang);
}
console.log('PASS editable overview SVG status matches the reviewed implementation');
