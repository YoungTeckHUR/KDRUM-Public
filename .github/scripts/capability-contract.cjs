// Content contract for individual capability details. No process-family fallback.
const assert=require('node:assert/strict');
const diagramScope={'rain-spatial':'rainfall-grid','rain-methods':'rainfall-grid',wb:'read-results',coupling:'river-floodplain'};
function duplicateSentences(data){
 const duplicates=[];
 for(const lang of ['Ko','En']){
  const sentences=new Map();
  for(const item of data.items)for(const key of ['sum','detail','now']){
   for(const sentence of item[key+lang].split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean)){
    const ids=sentences.get(sentence)||new Set();ids.add(item.id);sentences.set(sentence,ids);
   }
  }
  for(const [sentence,ids] of sentences)if(ids.size>1)duplicates.push({lang,sentence,ids:[...ids]});
 }
 return duplicates;
}
function validate(data){
 assert.equal(data.items.length,46);assert.equal(new Set(data.items.map(i=>i.id)).size,46);
 for(const item of data.items){
  for(const lang of ['Ko','En']){
   for(const field of ['sum','detail','now'])assert.ok(typeof item[field+lang]==='string'&&item[field+lang].trim(),`${item.id}: ${field+lang} is required`);
   assert.notEqual(item['detail'+lang],item['sum'+lang],`${item.id}: detail must explain more than the summary`);
   assert.equal(item['steps'+lang]?.length,3,`${item.id}: input/process/output`);
   assert.ok(item['steps'+lang].every(s=>typeof s==='string'&&s.trim()),item.id+' empty step');
   if(item.diagram===null)assert.equal(item['diagramCaption'+lang],null,item.id+' no orphan caption');
   else {const caption=item['diagramCaption'+lang];assert.ok(typeof caption==='string'&&caption.trim(),item.id+' diagram scope caption');assert.ok(lang==='Ko'?caption.startsWith('개념도:'):caption.startsWith('Process-family schematic:'),item.id+' diagram scope caption');}
  }
  assert.ok(Object.hasOwn(item,'diagram'),item.id+' explicit diagram or null required');
  assert.equal(item.diagram,diagramScope[item.id]||null,item.id+' individually reviewed diagram mapping');
 }
 for(const lang of ['Ko','En'])assert.equal(new Set(data.items.map(i=>i['detail'+lang])).size,46,lang+' duplicated capability overview');
 assert.deepEqual(duplicateSentences(data),[],'Cross-capability repeated prose requires explicit review');
}
module.exports={validate,duplicateSentences,diagramScope};
if(require.main===module){
 const data=require('../../docs/assets/site-content.json');validate(data);
 // Negative controls prove the contract rejects regressions, not just this data.
 for(const mutate of [d=>delete d.items[0].detailKo,d=>d.items[0].detailEn='',d=>d.items[1].detailKo=d.items[0].detailKo,d=>delete d.items[0].diagram,d=>d.items.find(i=>i.id==='hotstart').diagram='grid-water-cycle']){
  const broken=structuredClone(data);mutate(broken);assert.throws(()=>validate(broken));
 }
 console.log('PASS 46 bilingual individual details, scoped diagrams, zero repeated cross-item prose, five negative controls');
}
