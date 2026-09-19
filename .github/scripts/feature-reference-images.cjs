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
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function referenceFigure(item, lang, prefix) {
 const concept = concepts[item.id];
 if (!concept) return '';
 const ko = lang === 'ko', caption = concept[ko ? 1 : 2];
 const file = prefix + directory + concept[0] + '-en.webp';
 const label = ko ? '기능 이해를 돕는 참고 그림' : 'Capability reference illustration';
 const scope = ko ? '개념 설명용 이미지이며 실제 모의 결과가 아닙니다.' : 'Concept illustration; not a simulation result.';
 return `<figure class="figure feature-reference" data-reference-feature="${esc(item.id)}"><a class="feature-reference-image" href="${file}" data-enlarge data-caption="${esc(caption+' '+scope)}" aria-label="${ko?'참고 그림 크게 보기':'Enlarge reference illustration'}: ${esc(item[lang])}"><img src="${file}" alt="${esc(caption)}" width="1672" height="941" loading="lazy" decoding="async"></a><figcaption><strong>${label}</strong><span>${esc(caption)}</span><small>${scope}</small><a href="${file}" data-enlarge data-caption="${esc(caption+' '+scope)}">${ko?'그림 크게 보기 ↗':'Enlarge illustration ↗'}</a></figcaption></figure>`;
}
function validate(data) {
 const fs = require('node:fs'), path = require('node:path');
 for (const [id, concept] of Object.entries(concepts)) {
  if (!data.items.some(item => item.id === id)) throw new Error('Unknown reference feature: '+id);
  if (concept.length !== 3 || concept.some(value => !value.trim())) throw new Error('Incomplete reference: '+id);
  if (!fs.existsSync(path.join(__dirname,'../../docs',directory,concept[0]+'-en.webp'))) throw new Error('Missing reference image: '+id);
 }
}
module.exports = {concepts, directory, referenceFigure, validate};
