/* Current implementation descriptions, independently from validation and release status. */
'use strict';
const review=require('../../docs/assets/capability-review.json');
const theory=require('../../docs/assets/theory-current.json');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={
 'ESTABLISHED':['확립된 기능','Established'],
 'IMPLEMENTED':['구현 완료','Implemented'],
 'COMPLETED':['개발 완료','Development complete'],
 'COMPLETED / SELECTIVE':['개발 완료 · 선택 적용','Complete · selected configurations'],
 'IMPLEMENTED / SELECTIVE':['구현 · 조건부 적용','Implemented · conditional use'],
 'ESTABLISHED / MODERNIZING':['구현 · 성능 개선','Implemented · performance refinement'],
 'ACTIVE DEVELOPMENT':['도구 개발 중','Tool in development'],
 'RELEASE CANDIDATE':['공개 준비 중','Release candidate'],
 'SEPARATE DEVELOPMENT':['별도 도구 개발','Separate tool development'],
 'RESEARCH FUNCTION':['연구 기능','Research function'],
 'EXPERIMENTAL':['실험 연구모형','Experimental research model'],
 'DISABLED / REDEVELOPMENT':['비활성 · 재개발 대상','Disabled · redevelopment'],
};
const label=(status,lang)=>{if(!labels[status])throw Error('Unreviewed status '+status);return labels[status][lang==='ko'?0:1];};
function badgeType(s){return /^(ESTABLISHED|IMPLEMENTED|COMPLETED)/.test(s)?'established':s.startsWith('DISABLED')?'disabled':/RESEARCH|EXPERIMENTAL|RELEASE/.test(s)?'research':'development';}
function refs(ids,lang){return `<p class="method-references"><strong>${lang==='ko'?'이론·자료 근거':'Theory and data references'}</strong> ${ids.map(id=>{const r=review.references[id];if(!r)throw Error('Missing reference '+id);return `<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.label)} ↗</a>`;}).join(' · ')}</p>`;}
function feature(item,lang){const r=review.items[item.id];if(!r)throw Error('Missing reviewed capability '+item.id);const d=r[lang],ko=lang==='ko';
 return `<div class="feature-methodology" data-methodology-for="${item.id}"><h4>${ko?'입력자료와 연결 조건':'Inputs and connection requirements'}</h4><p>${esc(d.inputs)}</p>${r.equation?`<div class="equation"><h4>${ko?'이론·계산 관계':'Governing or calculation relationship'}</h4><div class="formula" role="math" aria-label="${esc(d.symbols)}">${esc(r.equation)}</div><p>${esc(d.symbols)}</p></div>`:''}<h4>${ko?'계산으로 얻는 결과':'Computed or prepared outputs'}</h4><p>${esc(d.outputs)}</p>${refs(r.references,lang)}<a class="numerical-link" href="#${chapterFor(item.id)}">${ko?'관련 이론·수치방법 자세히 보기':'Read the related theory and numerical method'} →</a></div>`;
}
function chapterFor(id){if(['dwnet','junction','kw-river','kw-hill'].includes(id))return 'numerical-1d-implementation';if(['local-inertia','fullswe','multires','flood-extras'].includes(id))return 'numerical-2d-implementation';if(['coupling','wb-1d2d','channelbed'].includes(id))return 'numerical-exchange';if(['structures','dam-operation','dam-forecast','dam-scenario','optimization','subcal'].includes(id))return 'numerical-operations';if(['ga','runoff','continuous','et','snow','dlayer','river-infil','rain-spatial','rain-methods','rain-qc','slope-separate'].includes(id))return 'numerical-processes';return 'numerical-state-data';}
function lifecycle(item,lang){const r=review.items[item.id],ko=lang==='ko';return `<div class="detail-status lifecycle-status" data-review-date="${review.revision}"><h4>${ko?'구현 상태 · 적용 검증 · 배포':'Implementation · application · distribution'}</h4><dl><dt>${ko?'현재 구현':'Current implementation'}</dt><dd>${esc(label(r.status,lang))}</dd><dt>${ko?'적용 시 확인':'Application check'}</dt><dd>${esc(r[lang].check)}</dd><dt>${ko?'공식 배포':'Official distribution'}</dt><dd>${ko?'실제 배포 버전과 포함 기능은 MyWater 안내를 확인합니다.':'Consult MyWater for the distributed version and included capabilities.'} <a href="#download">${ko?'배포 안내':'Distribution information'} →</a></dd></dl></div>`;}
function legend(lang){const ko=lang==='ko';return `<aside class="implementation-legend"><strong>${ko?'1D 하천·2D 범람: 개발 완료':'1D river hydraulics and 2D inundation: development complete'}</strong><p>${ko?'하천망 수리, 2D 국부관성 범람과 양방향 1D–2D 연계를 제공합니다. Full SWE는 지원하는 격자·경계·연계 조건에 맞춰 선택합니다.':'River-network hydraulics, 2D local-inertial inundation and bidirectional 1D–2D exchange are implemented. Select Full SWE within its supported grid, boundary and coupling configurations.'}</p><p class="small">${ko?'개발 완료는 계산 기능의 구현 상태입니다. 유역별 자료·관측 검증과 MyWater 공식 배포 여부는 별도로 확인합니다.':'Completion describes implementation. Basin-specific validation and MyWater distribution are independent considerations.'}</p></aside>`;}
function renderTheory(lang){const ko=lang==='ko';return theory.chapters.map(c=>`<details class="numerical-topic" id="${c.id}" data-theory-review="${theory.revision}"><summary>${esc(c[ko?'titleKo':'titleEn'])}</summary><div class="numerical-body">${c.sections.map(s=>`<h3>${esc(s[ko?'headingKo':'headingEn'])}</h3><p>${esc(s[ko?'textKo':'textEn'])}</p>${s.equation?`<div class="equation"><div class="formula" role="math" aria-label="${esc(s[ko?'unitsKo':'unitsEn'])}">${esc(s.equation)}</div><p>${esc(s[ko?'unitsKo':'unitsEn'])}</p></div>`:''}`).join('')}${refs(c.references,lang)}</div></details>`).join('');}
function validate(data){const assert=require('node:assert/strict');assert.equal(Object.keys(review.items).length,46);assert.deepEqual(data.items.map(i=>i.id).sort(),Object.keys(review.items).sort());for(const i of data.items){const r=review.items[i.id];assert.equal(i.s,r.status,i.id+' current status');for(const l of ['ko','en'])for(const key of ['summary','inputs','mechanism','outputs','check'])assert.ok(r[l][key]?.trim(),`${i.id} ${l} ${key}`);for(const id of r.references)assert.ok(review.references[id],id);}for(const id of ['dwnet','junction','local-inertia','coupling','wb-1d2d'])assert.equal(review.items[id].status,'COMPLETED');assert.equal(review.items.fullswe.status,'COMPLETED / SELECTIVE');assert.equal(review.items.wq.status,'DISABLED / REDEVELOPMENT');}
module.exports={review,theory,labels,label,badgeType,feature,lifecycle,legend,renderTheory,validate,chapterFor};
