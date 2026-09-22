/* Independent explanatory illustrations, mapped to individual capabilities. */
const concepts = {
 'rain-spatial': ['rainfall-input', '관측소·레이더 등에서 얻은 강우자료를 공간적으로 배분하여 계산격자의 강우 입력으로 구성합니다.', 'Observed rainfall is spatially mapped to the model grid.'],
 snow: ['snow-storage-melt', '강설은 적설로 저장되고, 이후 기상조건에 따른 융설을 통해 유출에 기여합니다.', 'Snowfall is stored as snowpack and later contributes meltwater to runoff.'],
 hotstart: ['state-continuity', '계산 중 저장한 모형 상태를 읽어 이후 시점의 모의를 이어갑니다.', 'A saved model state provides the starting point for a subsequent simulation.'],
 'slope-separate': ['hillslope-channel', '사면에서 발생한 흐름이 하천으로 유입되고, 하도 흐름을 따라 하류로 전달됩니다.', 'Hillslope runoff enters the channel and is routed downstream.'],
 channelbed: ['channel-geometry', 'DEM만으로 부족한 수중 하상 형상을 단면 등 추가 자료로 보완하는 개념입니다.', 'Cross-section information supplements riverbed geometry that a DEM may not resolve.'],
 'subbasin-report': ['subbasin-assessment', '소유역과 관측지점을 구분하여 유역 내부의 강우·유출·상태를 비교합니다.', 'Subbasins and gauge locations support comparison within the watershed.'],
 'dam-operation': ['river-reservoir', '저수지와 하천 합류부, 수리구조물 및 하류 구간의 연결 관계를 보여줍니다.', 'The illustration shows a reservoir, a confluence, a hydraulic structure and the downstream reach.'],
 coupling: ['river-floodplain', '하천과 범람원 사이의 유출 및 복귀 흐름을 보여주는 양방향 교환 개념입니다.', 'The illustration shows possible outflow and return flow between a river and its floodplain.'],
 'sed-hill': ['sediment-transport', '사면에서 발생한 유사가 물과 함께 이동하고 하류에서 퇴적되는 과정을 보여줍니다.', 'Sediment can be eroded, transported by flow and deposited downstream.'],
 dye: ['conservative-tracer', '상류에서 주입한 보존성 물질의 하류 이동과 지점별 관측 개념을 보여줍니다.', 'An upstream tracer injection is transported downstream and observed at selected locations.'],
 estuary: ['estuary-vertical-section', '하천 유입수와 해수의 연직 분포 및 교환을 보여주는 하구 x-z 단면 개념입니다.', 'An x-z section illustrates the vertical distribution and exchange of river inflow and saline water.'],
 parallel: ['parallel-computation', '계산 작업을 나누어 처리하고 결과를 결합하는 병렬계산의 기본 개념입니다.', 'Parallel tasks contribute to a combined model output.']
};
const directory = 'assets/diagrams/feature-reference-2026-09-19/';
const wave2Directory = 'assets/diagrams/feature-reference-wave2-2026-09-19/';
const wave2Concepts = {
 snow: ['snow-process', '강우·강설 구분, 적설 저장량, 경험적 융설계수 보정과 수문 입력의 관계입니다.', 'Precipitation partition, snow storage, empirical melt-factor adjustment and hydrologic input.'],
 dlayer: ['deep-storage-path', 'D층의 지연 복귀는 상부 토양층 경로로 연결되며, 심부 손실은 별도 활성 조건을 갖습니다.', 'Delayed D-layer return feeds an upper soil-layer pathway; deep loss has separate activation conditions.'],
 continuous: ['continuous-water-storage', '강우가 없는 기간에도 저장상태를 이어가며 다음 강우에 대한 유역의 반응을 계산합니다.', 'Storage states carry through drier periods and influence the response to subsequent rainfall.'],
 'river-infil': ['riverbed-deep-storage', '하천에서 심부 저장층으로 이동하는 물을 보여줍니다. 실제 이동량에는 침투가능량과 저장여유의 제한이 적용됩니다.', 'The illustration shows transfer from a river into deeper storage. Transfer is constrained by infiltration capacity and available storage.'],
 dwnet: ['connected-river-network', '분기·합류와 횡단면으로 연결된 하천망의 개념입니다. 각 구간의 수위·유량을 연결하여 해석합니다.', 'The illustration shows river reaches connected through confluences, branches and cross sections for linked water-level and discharge analysis.'],
 structures: ['hydraulic-structure-flows', '월류턱을 넘는 흐름과 수문 아래 개구부를 통과하는 흐름을 구분하여 보여줍니다.', 'The illustration distinguishes overflow across a weir crest from flow through the opening beneath a sluice gate.'],
 'dam-forecast': ['reservoir-scenario-assessment', '예측 유입과 저수지 연결, 하류 조건을 함께 검토하여 방류 대안을 비교하는 개념입니다.', 'Forecast inflows, reservoir connections and downstream conditions inform comparison of release alternatives.'],
 'local-inertia': ['floodplain-grid-concept', '지형 위의 얕은 물과 격자별 흐름을 보여주는 범람해석 공간 개념입니다.', 'The illustration shows the terrain, shallow water and computational cells that form the spatial setting for floodplain analysis.'],
 'input-precheck': ['input-readiness', '원자료의 공간·시간 범위, 연결성과 값의 범위를 확인하여 실행 준비 상태를 점검합니다.', 'Spatial and temporal extent, connectivity and value ranges are checked to assess readiness for execution.'],
 'rain-summary': ['rainfall-coverage', '관측·예측·결측 구간의 시간수를 구분해 강우자료의 구성과 누락 상태를 요약합니다.', 'Observed, forecast and missing intervals are counted by category to summarize rainfall input coverage.'],
 warmup: ['initial-state-warmup', '초기 토양·유출 상태를 반복 조정하고 목표지점 유량과의 오차 및 수렴품질을 평가합니다.', 'Initial soil and runoff states are adjusted iteratively while target-discharge discrepancy and convergence quality are evaluated.'],
 wb: ['watershed-water-balance', '같은 집계 범위에서 외부 유입, 유출과 저장량 변화를 비교하여 폐합오차를 평가합니다.', 'Boundary inputs, outputs and storage changes are compared over the same accounting domain to evaluate the closure residual.'],
 optimization: ['calibration-evaluation', '관측유량과 여러 매개변수 조합의 결과를 같은 조건에서 비교하고 성능지표로 평가합니다.', 'Observed discharge and parameter-case results are compared under consistent conditions using performance metrics.'],
 'output-integrity': ['result-lifecycle', '실행 조건과 진단을 기록하고 출력 파일의 생성·종료 및 필요한 항목을 점검하여 결과 분석 준비 상태를 확인합니다.', 'Run conditions and diagnostics are recorded, and output creation, closure and requirements are checked for postprocessing readiness.'],
 multires: ['nested-grid-patch', '원지형 격자를 묶은 배경과 원해상도를 유지한 관심영역(Patch)의 관계입니다. 입력보다 세밀한 지형정보를 생성하지 않습니다.', 'Background cells group source-terrain cells while patches retain source resolution; no finer terrain data is created.'],
 'river-viewer': ['river-result-views', '1D 결과를 종단면·횡단면과 수위·유량 시계열로 읽는 개념입니다. 뷰어는 별도 개발 중입니다.', 'The schematic shows longitudinal, cross-sectional and time-series views of 1D outputs. The viewer is under separate development.']
};
const schematicIds=new Set(['input-precheck','rain-summary','warmup','wb','optimization','output-integrity','multires','river-viewer','snow','dlayer']);
Object.assign(concepts,wave2Concepts);
// Shared references stay links, preserving one representative inline illustration.
const linkedConcepts={
 'rain-methods': [['rain-spatial','공간 강우 입력의 개념','Spatial rainfall input concept']],
 'rain-qc': [['rain-spatial','공간 강우 입력의 개념','Spatial rainfall input concept'],['input-precheck','입력자료 점검의 개념','Input checking concept']],
 'kw-hill': [['slope-separate','사면에서 하천으로 이어지는 유출','Runoff from hillslope to channel']],
 'kw-river': [['slope-separate','하도 경로를 통한 유량 전달','Routing along a channel']],
 'wb-1d2d': [['coupling','하천·범람원의 교환 영역','River and floodplain exchange domains']],
 'run-report': [['output-integrity','실행 기록과 출력 점검','Run records and output checks']],
 subcal: [['subbasin-report','소유역별 비교 영역','Subbasin comparison domains'],['optimization','목표지점 보정과 평가','Target-site calibration and evaluation']],
 junction: [['dwnet','분기·합류와 하천망 연결','Branches, confluences and connected reaches']],
 'dam-scenario': [['dam-forecast','저수지망과 운영 대안 비교','Reservoir networks and scenario comparison']],
 fullswe: [['local-inertia','2D 범람해석의 공간 개념','Spatial setting for 2D flood analysis']],
 'flood-extras': [['local-inertia','범람원과 계산격자','Floodplain and computational cells'],['dye','추적자 이동의 개념','Tracer transport concept']],
 'sed-river': [['sed-hill','유사의 이송·퇴적 개념','Sediment transport and deposition concept']],
 netcdf: [['@program-workflow','결과 파일과 분석도구의 연결','Result files and analysis tools']],
 viewer: [['@program-workflow','프로그램별 역할과 결과 분석','Program roles and result interpretation']],
 inputstudio: [['@program-workflow','입력 작성에서 계산까지','From input preparation to model execution']]
};
const galleryConcepts={ga:'concept-ga',runoff:'concept-runoff',et:'concept-et'};
const omittedConcepts={wq:'The water-quality module is disabled; retain the availability explanation without depicting an active result.'};
function getReference(id,lang,prefix=''){
 if(id==='@program-workflow')return {src:prefix+'assets/diagrams/program-workflow-'+lang+'.svg',width:960,height:600,caption:lang==='ko'?'입력 작성, 계산, 결과 저장과 분석 도구의 역할 및 개발 상태입니다.':'Roles and development states of input preparation, computation, output storage and analysis tools.'};
 const concept=concepts[id];if(!concept)return null;
 const schematic=schematicIds.has(id),dir=wave2Concepts[id]?wave2Directory:directory;
 return {src:prefix+dir+concept[0]+(schematic?'-'+lang+'.svg':'-en.webp'),width:schematic?1200:1672,height:schematic?(id==='river-viewer'?930:720):941,caption:concept[lang==='ko'?1:2]};
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function referenceFigure(item, lang, prefix) {
 const concept = concepts[item.id];
 if (!concept) return '';
 const ko = lang === 'ko', asset=getReference(item.id,lang,prefix),caption=asset.caption,file=asset.src;
 const label = ko ? '기능 이해를 돕는 참고 그림' : 'Capability reference illustration';
 const scope = ko ? '개념 설명용 이미지이며 실제 모의 결과가 아닙니다.' : 'Concept illustration; not a simulation result.';
 return `<figure class="figure feature-reference" data-reference-feature="${esc(item.id)}"><a class="feature-reference-image" href="${file}" data-enlarge data-caption="${esc(caption+' '+scope)}" aria-label="${ko?'참고 그림 크게 보기':'Enlarge reference illustration'}: ${esc(item[lang])}"><img src="${file}" alt="${esc(caption)}" width="${asset.width}" height="${asset.height}" loading="lazy" decoding="async"></a><figcaption><strong>${label}</strong><span>${esc(caption)}</span><small>${scope}</small><a href="${file}" data-enlarge data-caption="${esc(caption+' '+scope)}">${ko?'그림 크게 보기 ↗':'Enlarge illustration ↗'}</a></figcaption></figure>`;
}
function referenceLinks(item,lang,prefix){
 const links=linkedConcepts[item.id];if(!links)return '';
 return `<div class="related-reference-links" data-reference-links="${esc(item.id)}"><h4>${lang==='ko'?'관련 참고 그림':'Related reference illustrations'}</h4><div class="resource-links">${links.map(([id,ko,en])=>{const asset=getReference(id,lang,prefix);return `<a href="${asset.src}" data-enlarge data-reference-target="${esc(id)}" data-caption="${esc(asset.caption)}">${esc(lang==='ko'?ko:en)} ↗</a>`;}).join('')}</div></div>`;
}
function validate(data) {
 const fs = require('node:fs'), path = require('node:path');
 for (const [id, concept] of Object.entries(concepts)) {
  if (!data.items.some(item => item.id === id)) throw new Error('Unknown reference feature: '+id);
  if (concept.length !== 3 || concept.some(value => !value.trim())) throw new Error('Incomplete reference: '+id);
  for(const lang of ['ko','en'])if (!fs.existsSync(path.join(__dirname,'../../docs',getReference(id,lang).src))) throw new Error('Missing reference image: '+id+' '+lang);
 }
 const categories=[concepts,linkedConcepts,galleryConcepts,omittedConcepts];
 for(const item of data.items){
  if(categories.filter(group=>Object.hasOwn(group,item.id)).length!==1)throw new Error('Reference coverage must be explicit and unique: '+item.id);
  if(galleryConcepts[item.id]&&galleryConcepts[item.id]!==item.conceptAnchor)throw new Error('Gallery reference changed: '+item.id);
 }
 for(const group of categories)for(const id of Object.keys(group))if(!data.items.some(item=>item.id===id))throw new Error('Unknown coverage feature: '+id);
 for(const links of Object.values(linkedConcepts))for(const [id] of links)for(const lang of ['ko','en']){const asset=getReference(id,lang);if(!asset||!fs.existsSync(path.join(__dirname,'../../docs',asset.src)))throw new Error('Invalid shared reference: '+id);}
 if(data.items.find(item=>item.id==='wq')?.s!=='DISABLED / REDEVELOPMENT')throw new Error('Review water-quality illustration scope after availability changes');
}
module.exports = {concepts,directory,wave2Directory,wave2Concepts,schematicIds,linkedConcepts,galleryConcepts,omittedConcepts,getReference,referenceFigure,referenceLinks,validate};
