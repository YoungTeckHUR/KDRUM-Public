# 홈페이지 전체 문구 최신화 최종 검토 — 2026-11-03

## 기준과 반영 경계

- 저장소: YoungTeckHUR/KDRUM-Public
- 공개 기준 main: 2b471c5da6f9
- 재검토 출발점: Draft PR #94, 00a4650ddc45
- Core 대조 기준: kwater-rnd/KDRUM-Core main d32da8ab272e, Mod_KDRUM_Version.F90의 v3.0.5.14. 공식 배포버전이나 사용자 보유 실행파일 버전으로 간주하지 않는다.
- 개발자의 1D 하천·2D 범람 개발 완료 확인은 유지한다. 소스의 구현, 유역별 관측/실행 검증, 공식 배포를 별도 표시한다.
- main 병합, 자동병합 설정, Pages 배포는 수행하지 않는다. 승인 전 Draft 유지.

## 단계별 결과와 수정 이유

| 단계 | 변경 대상 | 수정 이유와 결과 |
|---|---|---|
| 상태·기능 | docs/assets/capability-review.json, site-content.json, feature-depth.json | 46개 기능 국·영문 상태, 목적, 입력, 계산원리, 출력, 적용조건을 통일. 1D 하천망·분기합류·2D 국부관성·양방향 교환·교환 물수지를 완료로 표시 |
| 이론·방법론 | theory-current.json, numerical-guide.cjs, TECHNICAL_METHODS.md | 전체 13개 주제, 32개 기능의 대표 관계식. 운동파/확산파/국부관성파/동역학파, 공간차분·시간적분·비선형해법을 구분 |
| 전체 동기화 | current-content.cjs, sync-current-data.cjs, build-current-docs.cjs, build-site.cjs, navigation-layout.cjs | 화면·기능표·FAQ·상태문서·Model Card·로드맵·검색 요약을 일관되게 생성 |
| 시각자료·설명 | current-diagram-status.cjs, 개요 SVG 6개, 갤러리 캡션 | 완료 기능의 오래된 상태표기 수정. 날짜가 있는 원본 PDF·영상·이미지는 보존하고 인접 현행 설명 제공 |
| 11월 재검토 | build-site.cjs, navigation-layout.cjs, seo-kdrum.html | 대체되기 전 템플릿의 오래된 ‘확장 중’ 문구, 실제 표시되는 ‘범람 확장 보기’, 검색용 소개의 일괄 개발단계 표현을 수정 |
| 회귀 방지 | current-content-audit.cjs | 완료 기능의 상태뿐 아니라 소개문·검색 안내의 오래된 표현도 검사 |

## Core 근거 대조

- Mod_KDRUM_DWNET_VNext_FV.F90: Q²/A + gI1 운동량 플럭스와 HLLE 관련 경로 확인.
- Mod_KDRUM_DWNET_VNext_Implicit.F90: Backward Euler와 TR-BDF2 경로 확인.
- Mod_Flood2D_Core.F90: 이전 면 유량, 수면경사 구동, 반음해 마찰을 사용하는 국부관성 갱신 확인.
- docs/suite/decisions/FLOOD_SOLVER_SCOPE_DECISION_20260927.md: 표준 1D–2D는 동역학파↔국부관성 및 국부관성↔국부관성, Full SWE는 특수조건 선택 경로로 구분.
- docs/DWNET_FLOOD2D_SOLVER_AND_COUPLING_CONTRACT.md: 과거 실유역 실행 미확인 기록과 지원 조합 제한 존재. 이를 최신 전체실유역 PASS 증거로 바꾸어 쓰지 않음. 교환체적 보존을 결합 운동량 보존으로 확대하지 않음.
- 근거는 파일/경로 확인 범위이며 이번에 엔진 컴파일·유역 재모의·Viewer 결과 검증을 수행한 것은 아니다. 비공개 소스 본문과 내부 설정값은 패치에 복사하지 않았다.

## 검증 결과

- PR #94 출발 커밋의 최신 GitHub 검사: 서로 다른 10개 검사 모두 success. live-pages는 skipped. 같은 이름의 중복 실행은 추가 검사로 세지 않음.
- 11월 보완본 로컬: site-static-audit, current-content-audit, capability-contract, media-status-consistency, build-site 구문검사 PASS.
- 46개 기능×국·영문, 6개 추가 이론장, 구현/적용/배포 3축, 개요 SVG 상태 검사 PASS.
- 로컬 브라우저 검사 실행 시 Chromium 미설치로 시작 불가. 화면 PASS로 기록하지 않음. 보완 커밋의 GitHub 브라우저 검사 결과를 별도로 확인한다.
- 4개 생성 페이지와 3개 주요 기술문서 재생성 SHA-256 일치 PASS.
- 11월 보완 커밋의 첫 공개내용 검사는 검토보고서의 전체 길이 커밋 식별자를 차단했다. 식별자를 12자리로 줄여 기존 공개내용 검사 규칙을 유지했다. 공개 후 Live Pages 검증은 승인·배포 이후에만 가능하다.

## 남은 이슈와 검토 판단

1. 사용자 보유 실행파일·MyWater 배포본과 현재 Core main의 버전 차이: 홈페이지는 v3.x 개발·시험 계열과 공식 배포 안내를 분리하여 유지한다.
2. 과거 Core 문서의 실유역 미검증 문구와 개발자 완료 확인이 시간상 다르다. 개발 완료 표시는 유지하되 모든 유역 정확도나 모든 계산기 조합 지원을 주장하지 않는다.
3. docs/assets/visuals의 과거 popup/runtime 파일에는 오래된 문구가 남지만 현재 생성 HTML은 해당 runtime chain을 로드하지 않는다(site-static-audit로 차단). 과거 코드 전체를 무조건 최신 기능으로 치환하지 않는다. 재활성화하려면 별도 최신화 필요.
4. 날짜가 있는 원본 발표 이미지/PDF에는 당시 상태가 남을 수 있다. 현행 갤러리 설명과 원본 제작시점을 함께 안내한다.
5. 승인 전 main 병합·공개 반영 금지. 승인 후에도 병합 대상 SHA와 최종 검사 결과를 확인하고, 공개 파일 일치 및 Live Pages를 검증한다.

## 46개 기능 검토 목록

| ID | 기능 | 수정 후 상태 |
|---|---|---|
| rain-spatial | 공간 강우 입력 | ESTABLISHED |
| rain-methods | 강우 공간배분 (IDW) | IMPLEMENTED |
| rain-qc | 강우 고도보정·품질점검 (QC) | IMPLEMENTED |
| rain-summary | 강우자료 완전성 점검 | IMPLEMENTED |
| input-precheck | 입력자료 사전점검·정합성 | IMPLEMENTED |
| ga | Green-Ampt 침투 | ESTABLISHED |
| runoff | 지표·지표하 유출 | ESTABLISHED |
| continuous | 연속·장기모의 | ESTABLISHED |
| et | 증발산·토양수분 | ESTABLISHED |
| snow | 적설·융설 | ESTABLISHED |
| warmup | 워밍업·초기상태 안정화 | IMPLEMENTED |
| hotstart | 상태 저장·재시작 (HotStart) | IMPLEMENTED |
| dlayer | D층 지하수 저장·장기유출 | IMPLEMENTED |
| slope-separate | 사면·하도 경사 개별 적용 | IMPLEMENTED |
| kw-hill | 사면 운동파 추적 | ESTABLISHED |
| kw-river | 하도 운동파 추적 | ESTABLISHED |
| river-infil | 하천 침투·심부저장 연계 | IMPLEMENTED |
| channelbed | 수리해석 지형·하상 보완(ChannelBed) | IMPLEMENTED / SELECTIVE |
| wb | 유역 물수지 분석 | IMPLEMENTED |
| wb-1d2d | 1D-2D 교환 물수지 | COMPLETED |
| run-report | 통합 실행 결과요약 | IMPLEMENTED |
| subbasin-report | 소유역 결과요약 | IMPLEMENTED |
| optimization | 목표지점 매개변수 보정·최적화 | IMPLEMENTED / SELECTIVE |
| subcal | 소유역·목표지점 평가 및 보정 | IMPLEMENTED / SELECTIVE |
| output-integrity | 출력 파일 무결성·생성상태 점검 | IMPLEMENTED |
| dwnet | 1D 하천망 수리 해석 | COMPLETED |
| junction | 하천 분기·합류 수리해석 | COMPLETED |
| structures | 수리구조물 | IMPLEMENTED |
| dam-operation | 댐·저수지 운영 | IMPLEMENTED |
| dam-forecast | 예측 기반 사전방류·하류 제약 검토 | IMPLEMENTED / SELECTIVE |
| dam-scenario | 다수 댐 운영 시나리오 비교 | IMPLEMENTED / SELECTIVE |
| coupling | 양방향 1D-2D 연계 | COMPLETED |
| local-inertia | 2D 국부관성(Local Inertia) 범람 | COMPLETED |
| fullswe | 2D 완전 천수방정식(Full SWE) | COMPLETED / SELECTIVE |
| multires | 다중해상도·관심영역(Patch) 2D | IMPLEMENTED / SELECTIVE |
| flood-extras | 2D 직접강우·배수·구조물·물질추적 | IMPLEMENTED / SELECTIVE |
| sed-hill | 사면 유사·침식·퇴적 | RESEARCH FUNCTION |
| sed-river | 하천 유사이송 | RESEARCH FUNCTION |
| dye | 보존성 물질·염료 추적 | RESEARCH FUNCTION |
| wq | 수질 과정 모듈 | DISABLED / REDEVELOPMENT |
| parallel | 단일·병렬계산(OpenMP·MPI) | ESTABLISHED / MODERNIZING |
| netcdf | NetCDF 통합 결과 출력 | IMPLEMENTED |
| viewer | FloodViewer 결과 분석 | RELEASE CANDIDATE |
| inputstudio | InputStudio 입력자료 작성·점검 | ACTIVE DEVELOPMENT |
| estuary | Estuary2DV 하구 연구모형 | EXPERIMENTAL |
| river-viewer | 1D 하천수리 결과 분석 Viewer | COMPLETED / RELEASE PLANNED |

## main 대비 전체 변경 파일

- `.github/scripts/build-current-docs.cjs`
- `.github/scripts/build-feature-reference-svg.cjs`
- `.github/scripts/build-site.cjs`
- `.github/scripts/capability-guidance.cjs`
- `.github/scripts/content-review-notes.cjs`
- `.github/scripts/current-content-audit.cjs`
- `.github/scripts/current-content.cjs`
- `.github/scripts/current-diagram-status.cjs`
- `.github/scripts/feature-specific-figures.cjs`
- `.github/scripts/media-status-consistency.cjs`
- `.github/scripts/methodology-browser-audit.cjs`
- `.github/scripts/navigation-layout.cjs`
- `.github/scripts/numerical-guide.cjs`
- `.github/scripts/site-static-audit.cjs`
- `.github/scripts/sync-current-data.cjs`
- `.github/scripts/workspace-audit.cjs`
- `.github/workflows/homepage-browser-smoke.yml`
- `CAPABILITIES.md`
- `CAPABILITY_ATLAS.md`
- `CHANGELOG_PUBLIC.md`
- `COMMUNITY_CENTER_DESIGN_20261027.md`
- `DEVELOPMENT_STATUS.md`
- `HOMEPAGE_CONTENT_REVIEW_20261028.md`
- `HOMEPAGE_GITHUB_UPDATE_REVIEW_20261001.md`
- `HOMEPAGE_REFRESH_REVIEW_20261027.md`
- `MODEL_CARD.md`
- `PUBLICATION_MANIFEST.json`
- `PUBLICATION_POLICY.md`
- `README.md`
- `ROADMAP.md`
- `TECHNICAL_METHODS.md`
- `docs/assets/capability-atlas.js`
- `docs/assets/capability-identity.json`
- `docs/assets/capability-review.json`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/channelbed-hydraulic-terrain-en.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/channelbed-hydraulic-terrain-ko.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/conservative-tracer-path-ko.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/hydraulic-structures-en.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/hydraulic-structures-ko.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/local-inertia-grid-en.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/local-inertia-grid-ko.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/rainfall-spatial-forcing-en.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/rainfall-spatial-forcing-ko.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/river-deep-storage-exchange-en.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/river-deep-storage-exchange-ko.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/river-floodplain-coupling-en.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/river-floodplain-coupling-ko.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/river-network-hydraulics-en.svg`
- `docs/assets/diagrams/feature-reference-wave2-2026-09-19/river-network-hydraulics-ko.svg`
- `docs/assets/diagrams/feature-specific/inputstudio-en.svg`
- `docs/assets/diagrams/feature-specific/inputstudio-ko.svg`
- `docs/assets/diagrams/model-workflow-en.svg`
- `docs/assets/diagrams/model-workflow-ko.svg`
- `docs/assets/diagrams/program-workflow-en.svg`
- `docs/assets/diagrams/program-workflow-ko.svg`
- `docs/assets/diagrams/river-floodplain-en.svg`
- `docs/assets/diagrams/river-floodplain-ko.svg`
- `docs/assets/feature-depth.json`
- `docs/assets/site-content.json`
- `docs/assets/site-editorial.json`
- `docs/assets/site.css`
- `docs/assets/site.js`
- `docs/assets/theory-current.json`
- `docs/index.html`
- `docs/ko/index.html`
- `docs/llms.txt`
- `docs/media.html`
- `docs/overview.md`
- `docs/seo-kdrum.html`
- `llms.txt`

## 새 대화창용 인계

작업: K-DRUM 홈페이지 전체 문구 최신화. Draft PR #94와 이 보고서를 기준으로 이어간다. 46개 국·영문 기능, 13개 이론 주제, 32개 관계식과 문서 동기화가 준비되어 있다. 11월 재검토에서 소개 템플릿·검색 소개·범람 확장 링크를 추가 정리했다. 기존 Draft를 재사용하며 중복 PR은 만들지 않는다. Core 대조 SHA와 버전은 위 기준을 따른다. 남은 작업은 보완 커밋 CI 최종 확인, 사용자 검토와 병합/공개 승인이다. 엔진 실제 유역 검증을 이번 홈페이지 검사와 혼동하지 않는다. 승인 전 main·Pages를 변경하지 않는다.

## 11월 3일 개발자 추가 확인 반영

1차원 하천 뷰어는 **개발 완료 · 정식 배포 예정**으로 확정한다. 기존 전문 뷰어의 완료와 C# 전환·Studio 통합 작업의 진행 상태는 구분한다. 국·영문 기능 원본, README 생성기, 상태표, Model Card, 검색 요약, 프로그램 카드, FAQ, 도식·참조그림 캡션과 회귀 검사를 같은 기준으로 수정했다. 기존 별도개발 상태를 강제하던 검사도 개발자 확인에 맞게 변경했다. 로컬 정적·기능 계약·미디어 상태 검사 통과. 보완본 GitHub 화면 검사 결과는 PR Checks에서 확인한다.

## 공개 반영 승인 및 최신 업그레이드 날짜

2026년 11월 3일 사용자가 날짜를 금일로 수정하는 조건으로 main 병합과 홈페이지 공개 반영을 승인했다. 최신 업그레이드 표시, 국·영문 현행 검토일, 기능·이론 원고 revision, README 및 sitemap 갱신일을 2026-11-03으로 맞췄다. 날짜가 있는 과거 발표자료와 작업기록의 원래 작성일은 보존한다. 날짜 보완 커밋 검사 후 승인된 PR #94를 병합하고 실제 Pages 파일 일치와 공개 검사를 확인한다.


## Terminology follow-up — 2026-11-03

- Replaced ambiguous Korean “후진 Euler” with “후방 오일러법(Backward Euler)” in the numerical guide, capability detail, theory source and generated documents. Clarified that time discretization differs from spatial upwind differencing.
- Replaced “흐리게” with specific numerical damping, smoothed/lowered discharge peaks, and phase/arrival-time errors. This describes possible discretization error, not physical flood attenuation or an intentional relaxation procedure.
- Added “Full Shallow Water Equations” and the Korean meaning in the bilingual numerical introduction, Full SWE capability detail and detailed theory. Existing English text spelled out the equations but did not explicitly define the abbreviation beside it.
- Source edits: numerical-guide.cjs, capability-review.json, theory-current.json. Regenerated HTML, capability JSON mirrors, CAPABILITIES.md and TECHNICAL_METHODS.md.
- Validation: deterministic generation, static routes/content audit, current content/status audit, media status consistency and git diff whitespace checks passed locally. Browser verification is delegated to repository CI because no local Chromium runtime is installed.
- Theory references: COMSOL knowledge base 1062 (Backward Euler damping); USACE HEC-RAS technical reference, Shallow Water Equations (depth-averaged mass and momentum equations). These references explain terminology, not K-DRUM implementation equivalence.
- Remaining work: verify PR CI before any publication; no engine or solver behavior changed.
