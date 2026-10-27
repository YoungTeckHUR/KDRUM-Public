/* Deterministic public status/method documents. Never import private model sources. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const data=require('../../docs/assets/site-content.json');
const current=require('./current-content.cjs');
const {review,theory,label}=current;
current.validate(data);
const write=(name,text)=>fs.writeFileSync(path.join(root,name),text.trim()+'\n');
const clean=s=>String(s).replace(/\|/g,'/').replace(/\n/g,' ');
const site='https://youngteckhur.github.io/KDRUM-Public/';
const terms='https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127';
const release='https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list';
const intro=`**검토일 / Reviewed: ${review.revision}**

1D 하천망 수리, 분기·합류, 2D 국부관성 범람과 양방향 1D–2D 연계는 **개발 완료** 기능입니다. Full SWE는 지원하는 격자·경계·연계 조건에 맞춰 사용하는 **개발 완료·선택 적용** 기능입니다. 기능 개선이나 새로운 유역 검증이 계속된다는 이유로 완료된 기능을 개발 중으로 되돌리지 않습니다.

**1D river-network hydraulics, junctions, 2D local-inertial inundation and two-way 1D–2D exchange are development-complete.** Full SWE is complete for supported configurations. Continued refinement and basin-specific evaluation do not change implementation completion into an unfinished capability.

구현 완료, 유역별 적용·관측 검증, 공식 배포는 별개의 정보입니다. 개발 완료는 모든 유역의 무조건적 정확도 인증이나 모든 공식 배포본에 포함되었다는 뜻이 아닙니다. 공식 설치파일·이용조건은 [MyWater K-Series](${release})에서 확인합니다.

Implementation completion, application/observation-based validation and official distribution are distinct. Consult MyWater for actual package versions and terms; do not infer universal accuracy or distribution from implementation alone.`;
let status='# K-DRUM 구현 상태와 적용 범위 / Implementation and application scope\n\n'+intro+'\n\n## 상태 표시 / Status labels\n\n| 표시 / Label | 의미 / Meaning |\n|---|---|\n';
const definitions={
 'ESTABLISHED':'공개 연구와 사용 계보가 있는 기반 기능 / Established scientific and application foundation',
 'IMPLEMENTED':'현행 계산·입출력 경로에 구현 / Implemented in current calculation or data paths',
 'COMPLETED':'개발자 완료 확인과 현행 구현을 대조한 완료 기능 / Completion confirmed by the model developer and checked against current implementation',
 'COMPLETED / SELECTIVE':'완료 기능이나 지원 구성 안에서 선택 / Complete within supported configurations',
 'IMPLEMENTED / SELECTIVE':'지원 입력·모드 조합에 따라 적용 / Applied within supported input/mode combinations',
 'ESTABLISHED / MODERNIZING':'구현된 병렬계산 및 성능 개선 / Implemented parallel computing with ongoing performance refinement',
 'ACTIVE DEVELOPMENT':'입력·통합 GUI 도구의 개발 / Authoring/integrated GUI development',
 'RELEASE CANDIDATE':'공개 준비 중인 별도 결과 도구 / Separate result tool preparing for release',
 'SEPARATE DEVELOPMENT':'별도 개발 결과 도구 / Separately developed result tool',
 'RESEARCH FUNCTION':'연구 활용 범위를 구분한 기능 / Research-specific functionality',
 'EXPERIMENTAL':'독립 실험 연구모형 / Separate experimental research model',
 'DISABLED / REDEVELOPMENT':'현행 활성 계산 대상 아님 / Not active in the current calculation build'
};
for(const [s,desc] of Object.entries(definitions))status+=`| ${label(s,'ko')} / ${label(s,'en')} | ${desc} |\n`;
for(const group of data.groups){status+=`\n## ${group.ko} / ${group.en}\n\n| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |\n|---|---|---|\n`;for(const i of data.items.filter(i=>i.g===group.id)){const r=review.items[i.id];status+=`| [${i.ko} / ${i.en}](${site}ko/#cap-${i.id}) | **${label(r.status,'ko')} / ${label(r.status,'en')}** | ${clean(r.ko.check)} / ${clean(r.en.check)} |\n`;}}
status+='\n## 검토 근거와 경계 / Review basis\n\n이번 표는 모델 개발자의 1D·2D 완료 확인, 현행 계산 경로·빌드 연결, 기능별 입출력 설명과 기존 공개 연구를 대조해 정리했습니다. 별도 모형 재컴파일이나 수치실험을 수행한 결과표가 아닙니다. 코드의 과거 주석·오래된 문서 날짜나 미병합 제안만으로 현재 상태를 결정하지 않았습니다. 공개 문구에는 비공개 소스·실유역 입력·내부 매개변수·운영자료를 옮기지 않았습니다.\n\nThe review combines the model developer’s completion confirmation with current build/call-path evidence, capability input/output descriptions and public research. It is not a newly executed numerical validation campaign. Historical comments and open proposals are not treated as authoritative current availability.\n\n현재 참고자료: [방법론](TECHNICAL_METHODS.md) · [기능 개요](CAPABILITIES.md) · [공개 연구](PUBLICATIONS.md).\n';
write('DEVELOPMENT_STATUS.md',status);
let atlas='# K-DRUM 기능별 현재 설명 / Current capability reference\n\n'+intro+'\n';
let capabilities='# K-DRUM 기능·입력·계산·출력 / Capabilities, inputs, methods and outputs\n\n'+intro+'\n\n홈페이지는 기능별 개요를 먼저 보이고, 이론·입력·관계식·산출물·적용조건은 세부 내용을 펼쳐 확인하도록 구성합니다. / The website keeps overviews compact and reveals theory, inputs, representative equations, outputs and checks in expandable details.\n';
for(const g of data.groups){atlas+=`\n## ${g.ko} / ${g.en}\n\n| 기능 | 현재 구현 | 핵심 역할 |\n|---|---|---|\n`;capabilities+=`\n## ${g.ko} / ${g.en}\n`;for(const it of data.items.filter(i=>i.g===g.id)){const r=review.items[it.id];atlas+=`| [${it.ko}](${site}ko/#cap-${it.id}) / [${it.en}](${site}#cap-${it.id}) | ${label(r.status,'ko')} / ${label(r.status,'en')} | ${clean(r.ko.summary)} / ${clean(r.en.summary)} |\n`;capabilities+=`\n### ${it.ko} / ${it.en}\n\n**${label(r.status,'ko')} / ${label(r.status,'en')}**\n\n${r.ko.mechanism}\n\n${r.en.mechanism}\n\n입력 / Inputs: ${r.ko.inputs} / ${r.en.inputs}\n\n산출물 / Outputs: ${r.ko.outputs} / ${r.en.outputs}\n\n적용 조건 / Check: ${r.ko.check} / ${r.en.check}\n`;if(r.equation)capabilities+=`\n대표 관계식 / Representative relationship:\n\n\`${r.equation}\`\n\n${r.ko.symbols} / ${r.en.symbols}\n`;capabilities+='\n'+r.references.map(id=>{const ref=review.references[id];return `[${ref.label}](${ref.url})`;}).join(' · ')+'\n';}}
atlas+='\n## 함께 읽기 / Related information\n\n[이론·방법론](TECHNICAL_METHODS.md) · [상태와 적용 범위](DEVELOPMENT_STATUS.md) · [공식 다운로드 목록]('+release+')\n\n새 K-DRUM Studio는 기존 InputStudio의 단순 명칭 변경이 아니라 별도 통합 작업환경 개발입니다. 입력도구·Viewer의 개발/공개 상태와 수리엔진의 개발 완료를 혼동하지 않습니다.\n\nNew K-DRUM Studio is separate integrated-workflow development, not a renaming of InputStudio. GUI/public-release status is independent from hydraulic-engine completion.\n';
write('CAPABILITY_ATLAS.md',atlas);write('CAPABILITIES.md',capabilities);
let theoryDoc='# K-DRUM 이론·수치방법 / Theory and numerical methodology\n\n**Reviewed: '+review.revision+'**\n\n다음 식은 지배관계와 보존·해석 원리를 설명합니다. 입력파일의 비공개 형식이나 내부 조정값을 나열하지 않습니다. 외부 참고문헌은 일반 이론의 근거이며 외부 모형과 K-DRUM의 구현·성능이 동일하다는 뜻은 아닙니다.\n\nEquations explain governing principles and interpretation. External references support theory; they do not establish identical implementation or performance between K-DRUM and other models.\n\n운동파·확산파·국부관성·동역학파는 유지하는 물리항의 차이이고, 유한체적·차분·양해·음해는 수치해법의 차이입니다.\n\nKinematic, diffusion, local-inertial and dynamic waves describe equation approximations; finite-volume/difference and explicit/implicit describe numerical methods.\n';
for(const c of theory.chapters){theoryDoc+=`\n## ${c.titleKo} / ${c.titleEn}\n`;for(const s of c.sections){theoryDoc+=`\n### ${s.headingKo} / ${s.headingEn}\n\n${s.textKo}\n\n${s.textEn}\n`;if(s.equation)theoryDoc+=`\n\`${s.equation}\`\n\n${s.unitsKo} / ${s.unitsEn}\n`;}
theoryDoc+='\n'+c.references.map(id=>{const r=review.references[id];return `[${r.label}](${r.url})`;}).join(' · ')+'\n';}
write('TECHNICAL_METHODS.md',theoryDoc);
const model=`# K-DRUM Model Card — Current technical summary

${intro}

## Identity / 모형 구성

K-DRUM: **K-water Distributed Rainfall-runoff Model**. 물리적 기반의 격자단위 분포형 강우유출을 하천망 수리 및 범람원 해석으로 연결합니다. / A physically based grid-distributed rainfall–runoff model connected to river-network and floodplain hydraulics.

## Main methods / 주요 방법론

Grid rainfall (station IDW and gridded/radar inputs), Green–Ampt infiltration, A/B/C/D storage and runoff, moisture-limited ET, snow accumulation/melt and kinematic routing form the hydrological foundation. Current 1D hydraulics distinguishes local-inertial and dynamic-wave paths. The dynamic-wave path uses conservative finite-volume fluxes, cross-section geometry and implicit Backward Euler/TR-BDF2 with nonlinear iteration. 2D local inertia uses previous face flow, surface-gradient forcing and semi-implicit friction; Full SWE includes advective momentum for supported configurations. Shared accepted exchange volumes connect river and floodplain balances.

## Data and results / 자료와 결과

Terrain, land cover, soil/depth, forcing and initial states define the hydrological project. Sections, boundaries, roughness, structures and exchange geometry define hydraulic applications. Outputs include discharge, stage, water storage, water-balance residuals, depth/velocity/inundation and NetCDF/time-series datasets. Coordinate, timestamp, domain and unit consistency are required when comparing products.

## Tools and research / 도구·연구 구분

Existing InputStudio prepares model inputs; new K-DRUM Studio is separate integrated project/control/run/analysis development. FloodViewer and 1D Viewer have their own release readiness. Sediment/tracer functions remain research-specific, water-quality processes are disabled/redevelopment, and Estuary2DV is an independent experimental x-z model.

## Distribution / 배포

This public repository shares technical descriptions, not production source or executables. Use [MyWater K-Series](${release}) and its [terms](${terms}). See [current capability scope](DEVELOPMENT_STATUS.md), [methods](TECHNICAL_METHODS.md) and [research references](PUBLICATIONS.md).
`;
write('MODEL_CARD.md',model);
write('docs/overview.md',`# K-DRUM 개요 / Overview\n\n${intro}\n\n${model.split('## Main methods / 주요 방법론')[1].split('## Distribution')[0]}\n\n[한국어 홈페이지](${site}ko/) · [English website](${site})\n`);
write('ROADMAP.md',`# K-DRUM 개선·확장 계획 / Refinement and extension roadmap

**Reviewed: ${review.revision}**

## Completed calculation foundation / 완료된 계산 기능

1D river-network hydraulics, 2D local-inertial inundation and two-way exchange are complete; they are not future milestones. Full SWE is complete within supported configurations. Existing watershed hydrology, state/output and conservation functions provide the foundation.

1D 하천수리·2D 국부관성 범람·양방향 연계는 완료 기능이며 향후 개발 예정 항목으로 다시 표시하지 않습니다. Full SWE는 지원 구성 안에서 선택합니다.

## Further work / 후속 개선

Refine computational performance and diagnostics without conflating speed with numerical accuracy. Expand basin-specific application evidence through measured geometry, observed stage/flow and inundation comparisons. Improve user-facing setup, error recovery and result interpretation in the new K-DRUM Studio, keeping prior InputStudio and separate Viewer provenance clear.

계산 효율·진단·사용성을 개선하고 유역별 단면·관측자료·침수 비교 사례를 확충합니다. 새 K-DRUM Studio의 프로젝트·제어·실행·분석 연결은 별도 도구 개발 과제입니다.

## Research / 연구 기능

Sediment/tracer and the independent Estuary2DV model retain explicit research scope. The inactive water-quality process module requires separate redevelopment before it is described as available.

## Publication / 공개

Update implementation, validation and distribution independently. Official installation packages and licensing follow [MyWater](${release}); technical pages should not imply that every current option is bundled in an older official release.
`);
const llms=`# K-DRUM — current technical information

Reviewed ${review.revision}.
K-DRUM means K-water Distributed Rainfall-runoff Model.

K-DRUM is a physically based, grid-distributed rainfall–runoff model. The current engine includes completed 1D river-network hydraulics, junctions, 2D local-inertial inundation and bidirectional 1D–2D exchange. Full SWE is development-complete for supported configurations; it is not interchangeable with every coupling/grid combination.

Established hydrology: spatial rainfall/IDW, Green–Ampt infiltration, surface/subsurface runoff, A/B/C/D stores, ET, snow, continuous simulation and kinematic routing. The D layer is an existing storage component, with implemented delayed-return/deep-loss extensions; it is not a spatial aquifer-flow solver.

Current implemented support: warm-up/state save/restart, calibration/evaluation, input/output integrity, structure and reservoir-operation functions, water-balance reporting and NetCDF. Hydrologic warm-up cache and full HotStart have different state coverage.

Implementation completion is separate from basin-specific validation and official distribution. Do not label completed hydraulics as unfinished simply because performance refinement, new validation or GUI work continues.

Existing InputStudio is an input-authoring tool. New K-DRUM Studio is separate integrated project/control/run/analysis development, not merely a product rename. FloodViewer is a release candidate; the 1D Viewer is separately developed. Sediment/tracer remain research functions, water-quality processes are disabled/redevelopment, and Estuary2DV is experimental.

Official executables and terms: ${release}
This technical repository does not directly distribute production source or executables.
Korean homepage: ${site}ko/
English homepage: ${site}
Methods: ${site}ko/#numerical-methods
Scope: https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md
Publications: https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/PUBLICATIONS.md
`;
write('llms.txt',llms);write('docs/llms.txt',llms);
// README keeps institutional references and naming history, but replaces ambiguous current-version copy.
let readme=fs.readFileSync(path.join(root,'README.md'),'utf8');
readme=readme.replace(/K-DRUM is K-water's physically based[^\n]+/,'K-DRUM is K-water’s physically based grid-distributed rainfall–runoff model. The current engine includes completed 1D river hydraulics, 2D inundation and bidirectional coupling, alongside established hydrology, implemented balance/output functions, separately developed tools and clearly identified research modules.');
readme=readme.replace(/K-DRUM은 K-water가 개발해 온[^\n]+/,'K-DRUM은 K-water의 물리적 기반 격자단위 분포형 강우유출모형입니다. 1D 하천수리·2D 범람·양방향 연계는 개발 완료 기능이며, 기존 수문·물수지·출력 기능과 함께 유역–하천–범람원을 연결합니다. 도구 개발·연구 기능·공식 배포 여부는 별도로 안내합니다.');
readme=readme.replace(/Current hydraulic extensions include[^\n]+/,'Current hydraulic capabilities include completed 1D networks, branch/confluence hydraulics, 2D local-inertial inundation and bidirectional dynamic-wave 1D/local-inertial 2D exchange, plus Full SWE within supported configurations. Structure, reservoir, state/output and water-balance functions are implemented. See [current implementation scope](DEVELOPMENT_STATUS.md) and [theory/methods](TECHNICAL_METHODS.md).');
readme=readme.replace('current hydraulic development','completed hydraulic capabilities');
readme=readme.replace('a developing integrated project/run/review workflow, not an officially released consolidated product.','separate new integrated project/control/run/analysis development, not simply a renamed InputStudio or an official consolidated release.');
readme=readme.replace('**Current public baseline:** v3.x / October 2026','**Current technical review:** v3.x / 2026-10-28. Implementation, validation and distribution are tracked separately.');
write('README.md',readme);
console.log('PASS current docs generated from 46-item status/method matrix and theory chapters');

// Refresh the unused legacy atlas metadata without making it a readiness authority.
const legacyPath=path.join(root,'docs/assets/capability-atlas.js');
let legacy=fs.readFileSync(legacyPath,'utf8');
const itemStart=legacy.indexOf('  const items='),itemEnd=legacy.indexOf('  const css=',itemStart);
if(itemStart<0||itemEnd<0)throw Error('Legacy atlas boundaries not found');
legacy=legacy.slice(0,itemStart)+'  const items='+JSON.stringify(data.items)+';\n'+legacy.slice(itemEnd);
fs.writeFileSync(legacyPath,legacy);
