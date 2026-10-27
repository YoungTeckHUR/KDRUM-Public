/* Synchronize editable overview SVG text with the 2026-10-28 implementation review.
   Original dated presentation images/PDF/video are not modified. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../../docs/assets/diagrams');
const changes={
 'model-workflow-ko.svg':[
  ['검증된 수문 기반 · 개발 중인 수리 확장','분포형 수문 · 개발 완료된 1D·2D 수리'],
  ['>개발 중</text>','>개발 완료</text>'],
  ['수리 확장: 개발·검증 단계','1D·2D 수리: 개발 완료']
 ],
 'model-workflow-en.svg':[
  ['Established hydrology and developing hydraulic extensions have distinct maturity.','Established hydrology with completed 1D and 2D hydraulic modules.'],
  ['>IN DEVELOPMENT</text>','>COMPLETED</text>'],
  ['Hydraulic extensions: development','1D + 2D hydraulics: complete']
 ],
 'river-floodplain-ko.svg':[
  ['수리 확장 개발 개념도 · 1D 하천, 2D 범람원과 교환 방향','완료된 수리 기능의 개념도 · 1D 하천, 2D 범람원과 양방향 교환'],
  ['1D·2D 수리: 개발 중','1D·2D 수리: 개발 완료'],
  ['양방향 교환: 통제된 개발 검증 · 전체 유역의 운영 인증을 의미하지 않습니다.','동일 교환체적을 반대 부호로 반영 · 유역별 자료와 경계조건에 맞춰 적용합니다.']
 ],
 'river-floodplain-en.svg':[
  ['Developing hydraulic extensions · 1D river, 2D floodplain and exchange directions.','Completed hydraulic modules · river, floodplain and two-way exchange.'],
  ['1D + 2D hydraulics: in development','1D + 2D hydraulics: complete'],
  ['Exchange: controlled development validation · no production certification is implied.','Same exchange volume, opposite signs · apply with basin-specific data and boundaries.']
 ],
 'program-workflow-ko.svg':[
  ['프로그램 연결과 지원 도구 · 각 프로그램의 공개 개발 상태','프로그램 연결과 지원 도구 · 구현 상태와 공식 배포를 구분'],
  ['수리 확장 개발','1D 하천·2D 범람'],
  ['기반 기능 + 확장','수문·수리 구현'],
  ['통합 개발 중','출력 구현 완료'],
  ['y="544" font-size="18" font-weight="400" fill="#885112" text-anchor="start">개발 중</text>','y="544" font-size="18" font-weight="400" fill="#885112" text-anchor="start">선택 기능 구현</text>']
 ],
 'program-workflow-en.svg':[
  ['Program relationships and support tools · public development status.','Program relationships · implementation and official availability are distinct.'],
  ['>Hydraulic extensions</text>','>1D river + 2D flood</text>'],
  ['CORE + EXTENSIONS','IMPLEMENTED'],
  ['INTEGRATION DEV.','IMPLEMENTED'],
  ['>In development</text>','>Selective support</text>']
 ]
};
const descriptions={
 "model-workflow-ko.svg": "강우, 지형·토양 및 초기상태를 받아 분포형 수문과 운동파 유출을 계산한다. 개발 완료된 1D 하천수리와 2D 범람 및 양방향 교환 경로를 통해 유량, 수위, 침수심을 해석한다.",
 "model-workflow-en.svg": "Rainfall, terrain, soil and initial states feed distributed hydrology and kinematic routing. Completed 1D river and 2D inundation modules with two-way exchange provide discharge, stage and flood-depth analysis.",
 "river-floodplain-ko.svg": "1D 하천과 2D 범람원 사이의 양방향 체적 교환을 평면도와 단면도로 설명한다. 하천수리, 범람 및 양방향 교환은 개발 완료된 기능이다. 동일한 교환체적을 두 영역에 반대 부호로 반영한다.",
 "river-floodplain-en.svg": "Plan and cross-section views illustrate completed 1D river, 2D inundation and two-way exchange functions. The same exchanged volume is applied with opposite signs to the river and floodplain.",
 "program-workflow-ko.svg": "InputStudio로 입력을 작성하고 K-DRUM Core의 수문·1D·2D 계산 결과를 NetCDF 등으로 출력하여 FloodViewer로 해석한다. 입력 GUI와 통합 작업환경은 개발 중이고, FloodViewer는 공개 준비 중이다. ChannelBed는 선택적 지형 보완 기능, 1D 결과 뷰어는 별도 개발 도구이며 Estuary2DV는 독립 연구모형이다.",
 "program-workflow-en.svg": "InputStudio authors inputs; Core computes hydrology and 1D/2D hydraulics; implemented NetCDF output feeds result analysis. Authoring and integrated GUI tools remain in development and FloodViewer is a release candidate. ChannelBed provides selective terrain support, the 1D viewer is separately developed, and Estuary2DV is an independent research model."
};
for(const [file,pairs] of Object.entries(changes)){
 const p=path.join(root,file);let s=fs.readFileSync(p,'utf8');
 for(const [old,next] of pairs){
  if(s.includes(old)){if(s.split(old).length!==2)throw Error(file+': ambiguous old label');s=s.replace(old,next);}
  else if(!s.includes(next))throw Error(file+': missing reviewed label');
 }
 s=s.replace(/(<desc\b[^>]*>)[\s\S]*?(<\/desc>)/,(_,a,b)=>a+descriptions[file]+b);
 fs.writeFileSync(p,s);
}
console.log('PASS six editable overview diagrams aligned with completed 1D/2D and implemented output');
