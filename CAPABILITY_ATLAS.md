# K-DRUM 기능별 현재 설명 / Current capability reference

**검토일 / Reviewed: 2026-10-28**

1D 하천망 수리, 분기·합류, 2D 국부관성 범람과 양방향 1D–2D 연계는 **개발 완료** 기능입니다. Full SWE는 지원하는 격자·경계·연계 조건에 맞춰 사용하는 **개발 완료·선택 적용** 기능입니다. 기능 개선이나 새로운 유역 검증이 계속된다는 이유로 완료된 기능을 개발 중으로 되돌리지 않습니다.

**1D river-network hydraulics, junctions, 2D local-inertial inundation and two-way 1D–2D exchange are development-complete.** Full SWE is complete for supported configurations. Continued refinement and basin-specific evaluation do not change implementation completion into an unfinished capability.

구현 완료, 유역별 적용·관측 검증, 공식 배포는 별개의 정보입니다. 개발 완료는 모든 유역의 무조건적 정확도 인증이나 모든 공식 배포본에 포함되었다는 뜻이 아닙니다. 공식 설치파일·이용조건은 [MyWater K-Series](https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list)에서 확인합니다.

Implementation completion, application/observation-based validation and official distribution are distinct. Consult MyWater for actual package versions and terms; do not infer universal accuracy or distribution from implementation alone.

## 강우 입력·품질관리 / Rainfall input & quality checks

| 기능 | 현재 구현 | 핵심 역할 |
|---|---|---|
| [공간 강우 입력](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-rain-spatial) / [Spatial rainfall forcing](https://youngteckhur.github.io/KDRUM-Public/#cap-rain-spatial) | 확립된 기능 / Established | 관측소·레이더·격자 강우의 공간·시간 분포를 유역 계산격자에 연결합니다. / Maps the spatial and temporal distribution of gauge, radar and gridded rainfall to watershed cells. |
| [강우 공간배분 (IDW)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-rain-methods) / [Rainfall mapping (IDW)](https://youngteckhur.github.io/KDRUM-Public/#cap-rain-methods) | 구현 완료 / Implemented | 역거리가중기법(IDW)으로 여러 관측소의 강우를 계산격자에 배분합니다. / Distributes station rainfall to computational cells with inverse-distance weighting (IDW). |
| [강우 고도보정·품질점검 (QC)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-rain-qc) / [Elevation correction & rainfall quality checks](https://youngteckhur.github.io/KDRUM-Public/#cap-rain-qc) | 구현 완료 / Implemented | 강우의 고도 차이와 원자료 품질을 구분하여 격자 강우 입력을 점검합니다. / Separately assesses elevation effects and observation quality when preparing gridded rainfall. |
| [강우자료 완전성 점검](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-rain-summary) / [Rainfall data completeness check](https://youngteckhur.github.io/KDRUM-Public/#cap-rain-summary) | 구현 완료 / Implemented | 모의기간의 관측·예측·결측 구성을 집계해 강우자료의 완전성을 확인합니다. / Summarizes observed, forecast and missing intervals over the simulation period. |
| [입력자료 사전점검·정합성](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-input-precheck) / [Input precheck & consistency](https://youngteckhur.github.io/KDRUM-Public/#cap-input-precheck) | 구현 완료 / Implemented | 공간·시간·연결성·값 범위를 검사하여 실행 전에 입력 불일치를 찾습니다. / Checks spatial, temporal, connectivity and value-range consistency before a run. |

## 유역 수문·연속모의 / Watershed hydrology & state

| 기능 | 현재 구현 | 핵심 역할 |
|---|---|---|
| [Green-Ampt 침투](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-ga) / [Green-Ampt infiltration](https://youngteckhur.github.io/KDRUM-Public/#cap-ga) | 확립된 기능 / Established | Green-Ampt 침투로 토양에 들어가는 물과 지표유출에 기여하는 초과량을 구분합니다. / Uses Green–Ampt infiltration to partition soil entry and surface rainfall excess. |
| [지표·지표하 유출](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-runoff) / [Surface & subsurface runoff](https://youngteckhur.github.io/KDRUM-Public/#cap-runoff) | 확립된 기능 / Established | 각 격자의 지표와 토양층 저장·층간 이동·측방유출을 연결해 유출을 생성합니다. / Generates runoff through surface/soil storage, vertical transfer and lateral flow in each cell. |
| [연속·장기모의](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-continuous) / [Continuous / long-term simulation](https://youngteckhur.github.io/KDRUM-Public/#cap-continuous) | 확립된 기능 / Established | 토양수분·적설·심부 저장의 이력을 이어받아 장기간 유역 반응을 계산합니다. / Carries soil water, snow and deep-storage history through continuous long-term simulation. |
| [증발산·토양수분](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-et) / [Evapotranspiration & soil water](https://youngteckhur.github.io/KDRUM-Public/#cap-et) | 확립된 기능 / Established | 기상에 따른 증발산 수요를 식생·뿌리 분포와 실제 토양 가용수로 제한합니다. / Combines atmospheric evaporative demand with vegetation/root distribution and available soil water. |
| [적설·융설](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-snow) / [Snow accumulation & melt](https://youngteckhur.github.io/KDRUM-Public/#cap-snow) | 확립된 기능 / Established | 강우·강설 구분, 적설수량의 저장과 경험적 융설을 수문 입력에 연결합니다. / Connects precipitation phase, snow-water storage and empirical melt to hydrologic forcing. |
| [워밍업·초기상태 안정화](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-warmup) / [Warm-up & initial-state stabilization](https://youngteckhur.github.io/KDRUM-Public/#cap-warmup) | 구현 완료 / Implemented | 초기 토양·유출 상태를 반복 조정하여 모의 시작의 불균형을 줄입니다. / Iteratively adjusts initial soil/runoff states to reduce initialization imbalance. |
| [상태 저장·재시작 (HotStart)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-hotstart) / [State save & restart (HotStart)](https://youngteckhur.github.io/KDRUM-Public/#cap-hotstart) | 구현 완료 / Implemented | 저장된 상태를 복원해 계산을 재시작하며, 수문 초기상태 캐시와 구분합니다. / Restores saved state for restart, distinguishing full restart from hydrologic initialization caches. |
| [D층 지하수 저장·장기유출](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dlayer) / [D-layer groundwater storage & long-term runoff](https://youngteckhur.github.io/KDRUM-Public/#cap-dlayer) | 구현 완료 / Implemented | 기존 D층의 심부 저장에 지연 복귀·기저유출 반응과 선택적 손실을 연결합니다. / Connects the existing D-layer deep store with delayed return, baseflow response and optional losses. |

## 유출전달·하천지형 / Routing & river terrain

| 기능 | 현재 구현 | 핵심 역할 |
|---|---|---|
| [사면·하도 경사 개별 적용](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-slope-separate) / [Separate hillslope & channel slopes](https://youngteckhur.github.io/KDRUM-Public/#cap-slope-separate) | 구현 완료 / Implemented | 사면 유출과 하도 흐름에 서로 다른 경사를 적용하여 이동 경로를 구분합니다. / Uses distinct hillslope and channel slopes for their respective flow paths. |
| [사면 운동파 추적](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-kw-hill) / [Hillslope kinematic routing](https://youngteckhur.github.io/KDRUM-Public/#cap-kw-hill) | 확립된 기능 / Established | 사면에서 생성된 유출을 연결 격자를 따라 운동파 방식으로 전달합니다. / Routes generated hillslope runoff along connected cells using a kinematic-wave approach. |
| [하도 운동파 추적](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-kw-river) / [Channel kinematic routing](https://youngteckhur.github.io/KDRUM-Public/#cap-kw-river) | 확립된 기능 / Established | 상류와 측방 유입을 합쳐 하도망을 따라 유량을 보존형으로 추적합니다. / Conservatively routes upstream and lateral inflows through the channel network. |
| [하천 침투·심부저장 연계](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-river-infil) / [River infiltration to deeper storage](https://youngteckhur.github.io/KDRUM-Public/#cap-river-infil) | 구현 완료 / Implemented | 하천의 가용수와 침투능·심부 저장여유를 연결해 하천–D층 교환을 계산합니다. / Calculates river-to-D-layer exchange subject to available river water, infiltration capacity and deep-storage space. |
| [수리해석 지형·하상 보완(ChannelBed)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-channelbed) / [Hydraulic terrain & channel-bed representation (ChannelBed)](https://youngteckhur.github.io/KDRUM-Public/#cap-channelbed) | 구현 · 조건부 적용 / Implemented · conditional use | DEM에서 부족한 수중 하상 정보를 단면·중심선 자료와 결합해 보완합니다. / Supplements submerged channel terrain that a DEM alone cannot resolve using sections and centerline data. |

## 물수지·보정·결과검증 / Water balance, calibration & result checks

| 기능 | 현재 구현 | 핵심 역할 |
|---|---|---|
| [유역 물수지 분석](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-wb) / [Basin water-balance analysis](https://youngteckhur.github.io/KDRUM-Public/#cap-wb) | 구현 완료 / Implemented | 유입·유출·증발산·저장 변화의 연결을 분석해 유역 전체 물수지를 점검합니다. / Links inflow, outflow, evapotranspiration and storage changes to audit basin water balance. |
| [1D-2D 교환 물수지](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-wb-1d2d) / [1D-2D exchange water balance](https://youngteckhur.github.io/KDRUM-Public/#cap-wb-1d2d) | 개발 완료 / Development complete | 하천과 범람원이 주고받은 같은 물의 체적을 반대 부호로 대조합니다. / Matches the same exchanged water volume with opposite signs in river and floodplain balances. |
| [통합 실행 결과요약](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-run-report) / [Unified run summary](https://youngteckhur.github.io/KDRUM-Public/#cap-run-report) | 구현 완료 / Implemented | 실행조건·초기화·물수지·경고·성능 정보를 한 실행 단위로 정리합니다. / Summarizes configuration, initialization, balance, warnings and timing for one simulation. |
| [소유역 결과요약](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-subbasin-report) / [Subbasin result summary](https://youngteckhur.github.io/KDRUM-Public/#cap-subbasin-report) | 구현 완료 / Implemented | 유역을 소유역·목표지점으로 나눠 기여량과 모의반응을 비교합니다. / Compares contributions and model response by subbasin and target location. |
| [목표지점 매개변수 보정·최적화](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-optimization) / [Target-point parameter calibration & optimization](https://youngteckhur.github.io/KDRUM-Public/#cap-optimization) | 구현 · 조건부 적용 / Implemented · conditional use | 목표지점의 관측·계산 차이를 여러 성능지표로 비교해 매개변수를 보정합니다. / Calibrates target-site parameters by comparing observations and simulations with multiple performance metrics. |
| [소유역·목표지점 평가 및 보정](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-subcal) / [Subbasin & target-site evaluation and calibration](https://youngteckhur.github.io/KDRUM-Public/#cap-subcal) | 구현 · 조건부 적용 / Implemented · conditional use | 소유역 진단과 목표지점 보정을 연결하여 보정 영향의 공간 범위를 살펴봅니다. / Links subbasin diagnostics and target-site calibration to assess spatial effects of parameter changes. |
| [출력 파일 무결성·생성상태 점검](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-output-integrity) / [Output-file integrity & completion checks](https://youngteckhur.github.io/KDRUM-Public/#cap-output-integrity) | 구현 완료 / Implemented | 결과 파일의 기록기간·변수·마감 상태를 점검하여 사용할 수 있는 결과를 구분합니다. / Checks recorded periods, variables and finalization to identify usable output files. |

## 1D 하천수리·구조물·댐 / 1D river hydraulics, structures & dams

| 기능 | 현재 구현 | 핵심 역할 |
|---|---|---|
| [1D 하천망 수리 해석](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dwnet) / [1D river-network hydraulics](https://youngteckhur.github.io/KDRUM-Public/#cap-dwnet) | 개발 완료 / Development complete | 실측·가상 횡단면과 하천망을 이용하여 1차원 수위·유량을 계산합니다. / Computes one-dimensional stage and discharge on a network of measured or virtual cross sections. |
| [하천 분기·합류 수리해석](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-junction) / [Branch & confluence hydraulics](https://youngteckhur.github.io/KDRUM-Public/#cap-junction) | 개발 완료 / Development complete | 분기·합류 접합부의 저장과 유출입을 연결하여 하천망 전체 수리상태를 계산합니다. / Connects storage and inflow/outflow at branches and confluences in a hydraulic network. |
| [수리구조물](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-structures) / [Hydraulic structures](https://youngteckhur.github.io/KDRUM-Public/#cap-structures) | 구현 완료 / Implemented | 보·수문 등 구조물의 수두·개구 조건에 따라 흐름을 계산해 하천망에 반영합니다. / Calculates weir/gate flows from heads and opening conditions and applies them to the river network. |
| [댐·저수지 운영](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dam-operation) / [Dam & reservoir operation](https://youngteckhur.github.io/KDRUM-Public/#cap-dam-operation) | 구현 완료 / Implemented | 유입·저류·방류의 연속관계와 수위·방류 제약을 결합해 저수지 운영을 모의합니다. / Simulates reservoir operation using inflow–storage–release continuity and stage/release constraints. |
| [예측 기반 사전방류·하류 제약 검토](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dam-forecast) / [Forecast-based pre-release & downstream constraints](https://youngteckhur.github.io/KDRUM-Public/#cap-dam-forecast) | 구현 · 조건부 적용 / Implemented · conditional use | 예측 유입과 하류 제약을 이용해 사전방류 대안을 비교합니다. / Compares pre-release options using forecast inflow and downstream constraints. |
| [다수 댐 운영 시나리오 비교](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dam-scenario) / [Multi-reservoir operating scenarios](https://youngteckhur.github.io/KDRUM-Public/#cap-dam-scenario) | 구현 · 조건부 적용 / Implemented · conditional use | 여러 댐의 운영 대안을 재모의·하도 추적하여 상하류 영향을 비교합니다. / Compares multi-reservoir operation alternatives through replay and river routing. |

## 1D–2D 연계·홍수범람 / 1D–2D coupling & floodplain

| 기능 | 현재 구현 | 핵심 역할 |
|---|---|---|
| [양방향 1D-2D 연계](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-coupling) / [Bidirectional 1D-2D coupling](https://youngteckhur.github.io/KDRUM-Public/#cap-coupling) | 개발 완료 / Development complete | 하천의 월류와 범람원의 복귀유량을 양방향으로 교환하여 두 계산영역을 연결합니다. / Connects river and floodplain domains through bidirectional overflow and return flow. |
| [2D 국부관성(Local Inertia) 범람](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-local-inertia) / [2D Local-Inertia floodplain analysis](https://youngteckhur.github.io/KDRUM-Public/#cap-local-inertia) | 개발 완료 / Development complete | 수면경사·국부가속도·마찰을 이용해 2차원 범람의 수심과 흐름을 계산합니다. / Computes 2D inundation depths and flow using surface gradients, local acceleration and friction. |
| [2D 완전 천수방정식(Full SWE)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-fullswe) / [2D full shallow-water equations (Full SWE)](https://youngteckhur.github.io/KDRUM-Public/#cap-fullswe) | 개발 완료 · 선택 적용 / Complete · selected configurations | 이류 운동량을 포함하는 완전 천수방정식으로 선택한 2D 수리영역을 해석합니다. / Solves the full shallow-water equations, including advective momentum, for supported 2D configurations. |
| [다중해상도·관심영역(Patch) 2D](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-multires) / [Multi-resolution & local-area (Patch) 2D](https://youngteckhur.github.io/KDRUM-Public/#cap-multires) | 구현 · 조건부 적용 / Implemented · conditional use | 관심영역은 원지형 해상도를 유지하고 배경영역을 묶어 계산량을 조절합니다. / Retains original terrain resolution in selected patches while aggregating the background domain. |
| [2D 직접강우·배수·구조물·물질추적](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-flood-extras) / [2D rainfall, drainage, structures & material tracking](https://youngteckhur.github.io/KDRUM-Public/#cap-flood-extras) | 구현 · 조건부 적용 / Implemented · conditional use | 2D 계산에 직접강우·배수·구조물과 추적물질·입자 기능을 선택적으로 연결합니다. / Adds optional direct rainfall, drainage, structures, tracers and particles to supported 2D paths. |

## 연구·확장 기능 / Research & extensions

| 기능 | 현재 구현 | 핵심 역할 |
|---|---|---|
| [사면 유사·침식·퇴적](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-sed-hill) / [Hillslope sediment, erosion & deposition](https://youngteckhur.github.io/KDRUM-Public/#cap-sed-hill) | 연구 기능 / Research function | 사면의 토양조건·유출과 운반능을 이용해 침식·유사 이동·퇴적을 연구합니다. / Represents hillslope detachment, sediment transport and deposition using soil and runoff conditions. |
| [하천 유사이송](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-sed-river) / [River sediment transport](https://youngteckhur.github.io/KDRUM-Public/#cap-sed-river) | 연구 기능 / Research function | 하천으로 공급된 유사와 구간 운반능을 비교하여 이송·퇴적을 연구합니다. / Studies river sediment transport and deposition using upstream supply and reach transport capacity. |
| [보존성 물질·염료 추적](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dye) / [Conservative material & dye tracking](https://youngteckhur.github.io/KDRUM-Public/#cap-dye) | 연구 기능 / Research function | 주입한 보존성 물질의 질량이 흐름과 저장에 따라 이동하는 과정을 추적합니다. / Tracks injected conservative mass as it moves through flow and storage. |
| [수질 과정 모듈](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-wq) / [Water-quality process module](https://youngteckhur.github.io/KDRUM-Public/#cap-wq) | 비활성 · 재개발 대상 / Disabled · redevelopment | 질소·인·BOD 등 반응성 수질 과정은 현재 활성 계산·출력 기능과 구분합니다. / Separates historical reactive nutrient/BOD processes from currently active calculations and outputs. |
| [Estuary2DV 하구 연구모형](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-estuary) / [Estuary2DV estuary research model](https://youngteckhur.github.io/KDRUM-Public/#cap-estuary) | 실험 연구모형 / Experimental research model | 폭평균 종·연직 영역에서 하구 흐름과 염분 성층을 연구하는 별도 모형입니다. / A separate research model for width-averaged longitudinal–vertical estuary flow and salinity stratification. |

## 입력·실행·결과도구 / Input, execution & result tools

| 기능 | 현재 구현 | 핵심 역할 |
|---|---|---|
| [단일·병렬계산(OpenMP·MPI)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-parallel) / [Serial & parallel execution (OpenMP/MPI)](https://youngteckhur.github.io/KDRUM-Public/#cap-parallel) | 구현 · 성능 개선 / Implemented · performance refinement | 계산 작업을 병렬 배분하고 실행 경로별 결과 일관성과 성능을 비교합니다. / Distributes computational work and compares consistency and performance across execution paths. |
| [NetCDF 통합 결과 출력](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-netcdf) / [Integrated NetCDF output](https://youngteckhur.github.io/KDRUM-Public/#cap-netcdf) | 구현 완료 / Implemented | 수문·수리 결과를 변수·단위·좌표·시간 정보와 함께 NetCDF로 기록합니다. / Stores hydrologic/hydraulic outputs in NetCDF with variables, units, coordinates and time metadata. |
| [FloodViewer 결과 분석](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-viewer) / [FloodViewer result analysis](https://youngteckhur.github.io/KDRUM-Public/#cap-viewer) | 공개 준비 중 / Release candidate | 계산 결과의 지도와 시계열을 연결해 침수 전개·수심·유속을 읽습니다. / Links result maps and time series to examine inundation, depth and velocity. |
| [InputStudio 입력자료 작성·점검](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-inputstudio) / [InputStudio input authoring & checks](https://youngteckhur.github.io/KDRUM-Public/#cap-inputstudio) | 도구 개발 중 / Tool in development | 기존 InputStudio는 공간입력·프로젝트 작성과 실행 전 정합성 점검을 담당합니다. / The existing InputStudio focuses on spatial-input/project authoring and pre-run consistency. |
| [1D 하천수리 결과 분석 Viewer](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-river-viewer) / [1D river-hydraulics results viewer](https://youngteckhur.github.io/KDRUM-Public/#cap-river-viewer) | 별도 도구 개발 / Separate tool development | 하천망·종단면·횡단면·시계열을 연결하여 1D 수리 결과를 분석합니다. / Links network, longitudinal/cross-section and time-series views for 1D hydraulic result analysis. |

## 함께 읽기 / Related information

[이론·방법론](TECHNICAL_METHODS.md) · [상태와 적용 범위](DEVELOPMENT_STATUS.md) · [공식 다운로드 목록](https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list)

새 K-DRUM Studio는 기존 InputStudio의 단순 명칭 변경이 아니라 별도 통합 작업환경 개발입니다. 입력도구·Viewer의 개발/공개 상태와 수리엔진의 개발 완료를 혼동하지 않습니다.

New K-DRUM Studio is separate integrated-workflow development, not a renaming of InputStudio. GUI/public-release status is independent from hydraulic-engine completion.
