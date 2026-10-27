/* Single reviewed source for capability copy. Runs before static-page generation. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const current=require('./current-content.cjs');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const write=(p,d)=>fs.writeFileSync(path.join(root,p),JSON.stringify(d,null,2)+'\n');
const data=read('docs/assets/site-content.json');
const depth=read('docs/assets/feature-depth.json');
for(const item of data.items){const r=current.review.items[item.id];if(!r)throw Error('Missing review '+item.id);item.s=r.status;
 if(item.id==='dlayer'){item.ko='D층 지하수 저장·장기유출';item.en='D-layer groundwater storage & long-term runoff';}
 for(const [lang,suffix] of [['ko','Ko'],['en','En']]){
  item['sum'+suffix]=r[lang].summary;item['detail'+suffix]=r[lang].mechanism;
  item['now'+suffix]=item[lang]+': '+current.label(r.status,lang)+'.';
  delete item['more'+suffix];
  depth[item.id]['principle'+suffix]=r[lang].mechanism;depth[item.id]['example'+suffix]=r[lang].check;
 }
 if(item.id==='coupling'){
  item.diagramCaptionKo='개념도: 하천–범람원 경계에서 월류와 복귀유량을 양방향으로 전달하고 같은 교환체적을 반대 부호로 반영하는 원리입니다. 실제 계산 결과가 아닙니다.';
  item.diagramCaptionEn='Process-family schematic: overflow and return flow use the same exchanged volume with opposite signs in the river and floodplain. This is not a simulation result.';
 }
}
data.provenance={baseline:'Current capability implementation review',reviewed:current.review.revision,source:'Current implementation and model-developer completion confirmation; implementation, application validation and official distribution are separate.'};
data.media.featureStatus=[
 ['Implemented hydrology and hydraulics · research separated','수문·수리 구현 · 연구 기능 별도'],
 ['Established Core · existing D-layer extension implemented','Core 확립 · 기존 D층 확장 구현'],
 ['Established spatially distributed hydrology','분포형 수문 확립'],
 ['Input/output implementation · GUI integration in progress','입력·출력 구현 · GUI 통합 개발'],
 ['Rainfall forcing and input quality checks implemented','공간 강우·입력 품질점검 구현'],
 ['Established snow accumulation and melt','적설·융설 확립'],
 ['Established Core · existing D-layer extension implemented','Core 확립 · 기존 D층 확장 구현'],
 ['Warm-up implementation','워밍업 구현 완료'],['State save and restart implemented','상태 저장·재시작 구현'],
 ['Kinematic routing and 1D hydraulics implemented','운동파·1D 하천수리 구현 완료'],
 ['Calibration and result reporting implemented','보정·결과요약 구현'],
 ['1D river hydraulics: development complete','1D 하천수리 개발 완료'],
 ['Structure and reservoir operation implemented','구조물·저수지 운영 구현'],
 ['2D inundation and 1D–2D exchange complete','2D 범람·1D–2D 연계 개발 완료'],
 ['Sediment and tracer research functions','유사·추적물질 연구 기능'],
 ['Parallel execution implemented · performance refinement','병렬계산 구현 · 성능 개선'],
 ['Result output and water-balance analysis implemented','결과 출력·물수지 분석 구현'],
 ['Hydrology/hydraulics implemented · tools and research separate','수문·수리 구현 · 도구·연구 기능 별도']
];
for(const lang of ['ko','en']){const t=data.media.txt[lang];for(const [k,v] of Object.entries(t))if(typeof v==='string')t[k]=v.replace(/22초/g,'약 24초').replace(/22-second/g,'approximately 24-second').replace(/22 seconds/g,'about 24 seconds');t.rVideoText=lang==='ko'?'K-DRUM 타이틀로 시작하는 약 24초 개념영상입니다.':'An approximately 24-second concept video opening on the K-DRUM title.';t.note=lang==='ko'?'기능의 구현 상태, 적용 검증과 공식 배포 여부는 서로 구분합니다. 2026년 9월의 원본 그림은 보존하고 현재 상태를 옆에 안내합니다.':'Implementation, application validation and official distribution are distinct. Original September 2026 illustrations are preserved with current adjacent status labels.';}
// Editable gallery captions must match the current badges, not the original slide date.
const captionMap={
 11:['Established kinematic routing and completed 1D hydraulic formulations','확립된 운동파 흐름추적과 개발 완료된 1D 하천수리'],
 12:['Implemented river structures, reservoir operation and gate-flow calculations','구현된 하천 수리구조물·저수지 운영·수문 유량 계산'],
 13:['Completed 1D–2D coupling and 2D inundation; multi-resolution is selectively supported','개발 완료된 1D–2D 연계·2D 범람과 선택 적용되는 다중해상도 해석']
};
const gallery=data.media.data.flatMap(group=>group[3]);
for(const [id,pair] of Object.entries(captionMap)){
 const card=gallery.find(entry=>entry[0]===Number(id));
 if(!card)throw Error('Missing current gallery caption '+id);
 [card[3],card[4]]=pair;
}
write('docs/assets/site-content.json',data);write('docs/assets/feature-depth.json',depth);
console.log('PASS current capability and gallery source synchronized');

require('./current-diagram-status.cjs');
