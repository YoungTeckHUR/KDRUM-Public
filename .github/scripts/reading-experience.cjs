/* Static presentation helpers. Core capability content remains in site-content.json. */
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr=(lang,ko,en)=>lang==='ko'?ko:en;
function quickLinks(lang){
 const links=[['ga','유역 수문','Watershed hydrology'],['continuous','장기 물순환','Continuous hydrology'],['coupling','하천·범람','River and floodplain'],['programs','프로그램 구성','Programs']];
 return `<nav class="quick-entry" aria-labelledby="quick-entry-title"><h3 id="quick-entry-title">${tr(lang,'관심 주제 바로가기','Explore by topic')}</h3><div class="quick-entry-links">${links.map(([id,ko,en])=>`<a href="#${id==='programs'?id:'cap-'+id}">${esc(tr(lang,ko,en))} <span aria-hidden="true">→</span></a>`).join('')}</div></nav>`;
}
const concepts=[
 {id:'ga',file:'green-ampt-infiltration-ko.webp',ko:'Green-Ampt 침투',en:'Green-Ampt infiltration',koDesc:'습윤전선의 이동과 토양으로의 침투.',enDesc:'Wetting-front movement and infiltration.'},
 {id:'et',file:'evapotranspiration-soil-water-ko.webp',ko:'증발산·토양수분',en:'Evapotranspiration and soil water',koDesc:'토양에 저장된 물의 대기 환원.',enDesc:'Stored soil water returning to the atmosphere.'},
 {id:'runoff',file:'surface-subsurface-runoff-ko.webp',ko:'지표·지표하 유출',en:'Surface and subsurface runoff',koDesc:'지표와 토양층을 통한 유출 경로.',enDesc:'Runoff pathways over and below the surface.'},
 {id:'dlayer',file:'dlayer-delayed-baseflow-ko.webp',ko:'D층·지연 기저유출',en:'D-layer and delayed baseflow',koDesc:'심부저장과 느린 방출 · 개발 중.',enDesc:'Deeper storage and slow release · in development.'}
];
function visualConcept(lang,pre){
 const L=(ko,en)=>tr(lang,ko,en),dir=pre+'assets/diagrams/grid-hydrology/';
 const mainTitle=L('격자 하나의 물순환 개념도','Water-cycle processes in a grid cell');
 const mainFile=dir+'grid-cell-water-cycle-ko.webp';
 const card=it=>{
  const title=L(it.ko,it.en),file=dir+it.file;
  return `<article class="media-card concept-card" id="concept-${it.id}"><a href="${file}" data-enlarge data-caption="${esc(title)}" aria-label="${esc(title+' · '+L('그림 크게 보기','Enlarge diagram'))}"><img src="${file}" alt="${esc(title+' — '+L(it.koDesc,it.enDesc))}" width="960" height="540" loading="lazy" decoding="async"></a><div class="media-body"><h3>${esc(title)}</h3><p>${esc(L(it.koDesc,it.enDesc))}</p><div class="concept-links"><a href="${file}" data-enlarge data-caption="${esc(title)}">${L('크게 보기','Enlarge')} ↗</a><a href="#cap-${it.id}">${L('관련 기능','Capability')} →</a></div></div></article>`;
 };
 return `<section class="section" id="grid-hydrology-concepts"><div class="wrap"><div class="section-heading"><div><span class="index">VISUAL CONCEPT</span><h2>${L('격자 하나에서 작동하는 수문 기작','Water processes within a grid cell')}</h2><p>${L('강우·침투·증발산과 유출의 연결을 보여주는 개념도입니다. 실제 계산 결과가 아니며, D층은 개발 중인 기능입니다.','Concept diagrams of rainfall, infiltration, evapotranspiration and runoff, not simulation results. The D-layer is in development. Image labels are in Korean.')}</p></div></div><div class="concept-overview-grid"><figure class="figure concept-master"><a href="${mainFile}" data-enlarge data-caption="${esc(mainTitle)}" aria-label="${esc(mainTitle+' · '+L('그림 크게 보기','Enlarge diagram'))}"><img src="${mainFile}" alt="${esc(L('강우, 침투, 증발산, 지표·지표하 유출과 개발 중인 D층을 함께 나타낸 격자 물순환 개념도','Grid-cell water-cycle concept: rainfall, infiltration, evapotranspiration, runoff and the D-layer development extension'))}" width="960" height="540" loading="lazy" decoding="async"></a><figcaption><span>${esc(mainTitle)}</span><a href="${mainFile}" data-enlarge data-caption="${esc(mainTitle)}">${L('그림 크게 보기','Enlarge diagram')} ↗</a></figcaption></figure><div class="gallery-grid concept-thumbnail-grid">${concepts.map(card).join('')}</div></div></div></section>`;
}
function relatedFigure(item,lang,pre){
 const suffix=lang==='ko'?'Ko':'En',caption=item['diagramCaption'+suffix];
 const file=pre+'assets/diagrams/'+item.diagram+'-'+lang+'.svg';
 return `<figure class="figure figure-reference" data-shared-diagram="${esc(item.diagram)}"><figcaption><span>${esc(caption)}</span><a href="${file}" data-enlarge data-caption="${esc(caption)}">${tr(lang,'관련 개념도 크게 보기','Enlarge related diagram')} ↗</a></figcaption></figure>`;
}
module.exports={quickLinks,visualConcept,relatedFigure};
