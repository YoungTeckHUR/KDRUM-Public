# K-DRUM 구현 상태와 적용 범위 / Implementation and application scope

**검토일 / Reviewed: 2026-10-28**

1D 하천망 수리, 분기·합류, 2D 국부관성 범람과 양방향 1D–2D 연계는 **개발 완료** 기능입니다. Full SWE는 지원하는 격자·경계·연계 조건에 맞춰 사용하는 **개발 완료·선택 적용** 기능입니다. 기능 개선이나 새로운 유역 검증이 계속된다는 이유로 완료된 기능을 개발 중으로 되돌리지 않습니다.

**1D river-network hydraulics, junctions, 2D local-inertial inundation and two-way 1D–2D exchange are development-complete.** Full SWE is complete for supported configurations. Continued refinement and basin-specific evaluation do not change implementation completion into an unfinished capability.

구현 완료, 유역별 적용·관측 검증, 공식 배포는 별개의 정보입니다. 개발 완료는 모든 유역의 무조건적 정확도 인증이나 모든 공식 배포본에 포함되었다는 뜻이 아닙니다. 공식 설치파일·이용조건은 [MyWater K-Series](https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list)에서 확인합니다.

Implementation completion, application/observation-based validation and official distribution are distinct. Consult MyWater for actual package versions and terms; do not infer universal accuracy or distribution from implementation alone.

## 상태 표시 / Status labels

| 표시 / Label | 의미 / Meaning |
|---|---|
| 확립된 기능 / Established | 공개 연구와 사용 계보가 있는 기반 기능 / Established scientific and application foundation |
| 구현 완료 / Implemented | 현행 계산·입출력 경로에 구현 / Implemented in current calculation or data paths |
| 개발 완료 / Development complete | 개발자 완료 확인과 현행 구현을 대조한 완료 기능 / Completion confirmed by the model developer and checked against current implementation |
| 개발 완료 · 선택 적용 / Complete · selected configurations | 완료 기능이나 지원 구성 안에서 선택 / Complete within supported configurations |
| 구현 · 조건부 적용 / Implemented · conditional use | 지원 입력·모드 조합에 따라 적용 / Applied within supported input/mode combinations |
| 구현 · 성능 개선 / Implemented · performance refinement | 구현된 병렬계산 및 성능 개선 / Implemented parallel computing with ongoing performance refinement |
| 도구 개발 중 / Tool in development | 입력·통합 GUI 도구의 개발 / Authoring/integrated GUI development |
| 공개 준비 중 / Release candidate | 공개 준비 중인 별도 결과 도구 / Separate result tool preparing for release |
| 별도 도구 개발 / Separate tool development | 별도 개발 결과 도구 / Separately developed result tool |
| 연구 기능 / Research function | 연구 활용 범위를 구분한 기능 / Research-specific functionality |
| 실험 연구모형 / Experimental research model | 독립 실험 연구모형 / Separate experimental research model |
| 비활성 · 재개발 대상 / Disabled · redevelopment | 현행 활성 계산 대상 아님 / Not active in the current calculation build |

## 강우 입력·품질관리 / Rainfall input & quality checks

| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |
|---|---|---|
| [공간 강우 입력 / Spatial rainfall forcing](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-rain-spatial) | **확립된 기능 / Established** | 시간대, 누적구간의 시작·종료 기준, mm와 mm/h, 원자료와 계산격자의 유효 영역을 맞춥니다. / Align time zone, accumulation-window convention, mm versus mm/h and the valid spatial footprint. |
| [강우 공간배분 (IDW) / Rainfall mapping (IDW)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-rain-methods) | **구현 완료 / Implemented** | 관측소가 없는 지역의 분포는 관측망 배치에 민감합니다. 고도보정과 거리 가중 효과를 구분해 비교합니다. / Unsampled areas are sensitive to station layout. Evaluate elevation correction separately from distance weighting. |
| [강우 고도보정·품질점검 (QC) / Elevation correction & rainfall quality checks](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-rain-qc) | **구현 완료 / Implemented** | 고도보정으로 결측이 자동 해소되지는 않습니다. 적용 유역의 관측 특성과 보정 전후 유역 총량을 함께 확인합니다. / Elevation adjustment does not repair missing data automatically. Check local observations and basin totals before and after adjustment. |
| [강우자료 완전성 점검 / Rainfall data completeness check](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-rain-summary) | **구현 완료 / Implemented** | 모의 종료시각 포함 여부와 중복시각 처리 기준을 동일하게 놓고 집계합니다. / Use consistent end-time inclusion and duplicate-record conventions. |
| [입력자료 사전점검·정합성 / Input precheck & consistency](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-input-precheck) | **구현 완료 / Implemented** | 경고를 무조건 무시하거나 누락 지형을 임의로 채우지 않고, 원자료를 확인한 뒤 다시 점검합니다. / Resolve warnings using source evidence rather than inventing missing geometry, then repeat the checks. |

## 유역 수문·연속모의 / Watershed hydrology & state

| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |
|---|---|---|
| [Green-Ampt 침투 / Green-Ampt infiltration](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-ga) | **확립된 기능 / Established** | 서로 다른 단위의 투수계수와 시간간격을 섞지 않습니다. 포화·불포화 조건 및 불투수면 설정을 함께 확인합니다. / Keep conductivity and timestep units consistent and review saturation and impervious-area settings. |
| [지표·지표하 유출 / Surface & subsurface runoff](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-runoff) | **확립된 기능 / Established** | 층 사이 이동은 내부 교환이므로 유역 전체 유출에 중복 합산하지 않습니다. / Interlayer exchange is internal and must not be counted again as basin outflow. |
| [연속·장기모의 / Continuous / long-term simulation](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-continuous) | **확립된 기능 / Established** | 여러 해의 증발산·물수지를 비교할 때 분석기간, 자료 결측, 초기·최종 저장을 통일합니다. / Compare multi-year evapotranspiration and balance using aligned periods, gap handling and storage endpoints. |
| [증발산·토양수분 / Evapotranspiration & soil water](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-et) | **확립된 기능 / Established** | 기상 수요식과 실제 수분 제한을 구분합니다. 물이 없는 층에서 증발산을 무제한 차감하지 않는지 물수지로 확인합니다. / Distinguish the demand calculation from moisture limitation and check that extraction is consistent with layer water availability. |
| [적설·융설 / Snow accumulation & melt](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-snow) | **확립된 기능 / Established** | 적설수량(mm 물깊이)과 적설심(cm 눈깊이)을 혼동하지 않습니다. 융설량은 가용 적설 저장을 넘을 수 없습니다. / Distinguish water-equivalent depth from physical snow depth; melt cannot exceed available snow storage. |
| [워밍업·초기상태 안정화 / Warm-up & initial-state stabilization](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-warmup) | **구현 완료 / Implemented** | 목표유량, 관측 시점과 모의 시작시각의 의미를 맞추고, 준비기간 결과를 분석기간 통계와 구분합니다. / Align target-flow timing with initialization and separate warm-up outputs from analysis-period statistics. |
| [상태 저장·재시작 (HotStart) / State save & restart (HotStart)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-hotstart) | **구현 완료 / Implemented** | 연속 실행과 재시작 실행을 같은 조건에서 비교하여 저장량·유량·시간축의 일치성을 확인합니다. / Compare uninterrupted and restarted runs under identical conditions for storage, discharge and time consistency. |
| [D층 지하수 저장·장기유출 / D-layer groundwater storage & long-term runoff](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dlayer) | **구현 완료 / Implemented** | 기존 D층을 새로 추가한 기능으로 설명하지 않습니다. 감수곡선과 장기 물수지를 함께 사용해 유역별 계수를 검토합니다. / Do not treat the D layer itself as newly introduced. Assess basin-specific response using recession curves and long-term balance. |

## 유출전달·하천지형 / Routing & river terrain

| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |
|---|---|---|
| [사면·하도 경사 개별 적용 / Separate hillslope & channel slopes](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-slope-separate) | **구현 완료 / Implemented** | 표고 차이/거리로 계산한 경사가 무차원인지, 각도·백분율인지 구분합니다. / Distinguish dimensionless elevation-drop/distance slope from degrees or percent slope. |
| [사면 운동파 추적 / Hillslope kinematic routing](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-kw-hill) | **확립된 기능 / Established** | 침투에 의해 정해진 유출 생성과 운동파 전달을 구분하고, 완만한 배수 영향 구간의 수리해석 필요성을 검토합니다. / Separate runoff generation from routing and assess whether backwater-affected areas require a hydraulic solver. |
| [하도 운동파 추적 / Channel kinematic routing](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-kw-river) | **확립된 기능 / Established** | 같은 유량에 서로 다른 수위가 가능한 배수 영향 구간은 단일 운동파 수위 관계로 설명하지 않습니다. / Do not use a single kinematic rating to explain backwater reaches where the same discharge can occur at different stages. |
| [하천 침투·심부저장 연계 / River infiltration to deeper storage](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-river-infil) | **구현 완료 / Implemented** | 모의영역에 남아 있는 물과 영역 밖 손실을 구분하고, 내부 이동을 유역 전체 손실에 다시 더하지 않습니다. / Separate retained internal transfer from loss outside the domain to avoid double counting. |
| [수리해석 지형·하상 보완(ChannelBed) / Hydraulic terrain & channel-bed representation (ChannelBed)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-channelbed) | **구현 · 조건부 적용 / Implemented · conditional use** | 수위·단면·DEM의 수직기준을 맞추고 실제 측량자료와 보완·가정 구간을 구분해 기록합니다. / Align vertical datums and distinguish measured from supplemented or assumed geometry. |

## 물수지·보정·결과검증 / Water balance, calibration & result checks

| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |
|---|---|---|
| [유역 물수지 분석 / Basin water-balance analysis](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-wb) | **구현 완료 / Implemented** | 유량은 시간 적분하고 수심은 면적을 곱합니다. 상대오차 분모와 수리·수문 저장 집계범위를 먼저 확인합니다. / Integrate flow over time and multiply depth by area; check the relative-error denominator and hydrologic/hydraulic storage domain. |
| [1D-2D 교환 물수지 / 1D-2D exchange water balance](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-wb-1d2d) | **개발 완료 / Development complete** | 연계 시간구간과 부호·단위를 일치시키고, 한 영역의 수위 오차가 교환수지 오차와 같은 의미인지 구분합니다. / Match interval, sign and units; stage errors and exchange-balance errors are different quantities. |
| [통합 실행 결과요약 / Unified run summary](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-run-report) | **구현 완료 / Implemented** | 실제 총 소요시간과 반복·실패 시도가 포함된 개별 계산기 누적시간을 같은 지표로 비교하지 않습니다. / Do not equate end-to-end elapsed time with cumulative solver timings that may include repeated or rejected trials. |
| [소유역 결과요약 / Subbasin result summary](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-subbasin-report) | **구현 완료 / Implemented** | 관측소의 집수면적과 집계한 소유역 범위를 맞추고, 상류 누적량을 국소 발생량과 중복 합산하지 않습니다. / Match gauge drainage area with the aggregation domain and avoid double counting upstream totals as local contributions. |
| [목표지점 매개변수 보정·최적화 / Target-point parameter calibration & optimization](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-optimization) | **구현 · 조건부 적용 / Implemented · conditional use** | 단일 지표의 최대값만으로 첨두·도달시간·갈수량이 모두 개선됐다고 판단하지 않습니다. / A better single score does not imply improvement of peak, timing and low flow simultaneously. |
| [소유역·목표지점 평가 및 보정 / Subbasin & target-site evaluation and calibration](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-subcal) | **구현 · 조건부 적용 / Implemented · conditional use** | 소유역 결과 보고, 선택 지점 보정, 모든 지점 동시 최적화는 서로 다른 기능입니다. / Subbasin reporting, selected-site calibration and simultaneous all-site optimization are different capabilities. |
| [출력 파일 무결성·생성상태 점검 / Output-file integrity & completion checks](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-output-integrity) | **구현 완료 / Implemented** | 마지막 기록시각, 단위·좌표·시간 기준, 비정상 값과 정상 마감 여부를 함께 확인합니다. / Inspect final timestamp, units, spatial/time reference, invalid values and finalization together. |

## 1D 하천수리·구조물·댐 / 1D river hydraulics, structures & dams

| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |
|---|---|---|
| [1D 하천망 수리 해석 / 1D river-network hydraulics](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dwnet) | **개발 완료 / Development complete** | 배수위·역류·급변류의 표현은 선택한 방정식과 경계조건에 달려 있습니다. 실제 유역 적용은 단면·표고 기준과 관측수위·유량으로 확인합니다. / Backwater, reversal and rapidly varying flow depend on selected equations/boundaries. Assess real-basin application using section/datum consistency and observed stage/flow. |
| [하천 분기·합류 수리해석 / Branch & confluence hydraulics](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-junction) | **개발 완료 / Development complete** | 접합부의 연결 방향·표고·저장 기하가 맞는지 확인하고, 역류가 가능한 조건에서는 부호를 포함해 비교합니다. / Check connectivity, elevation and storage geometry; include discharge signs when reversals are possible. |
| [수리구조물 / Hydraulic structures](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-structures) | **구현 완료 / Implemented** | 마루고·저수위의 표고 기준과 자유/잠수 조건, 역방향 지원 범위를 실제 선택 방식에 맞춥니다. / Align crest/stage datum and check free/submerged flow and directional support for the selected structure law. |
| [댐·저수지 운영 / Dam & reservoir operation](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dam-operation) | **구현 완료 / Implemented** | 방류 변화율의 단위 (m³/s)/h와 계산시간을 맞추고, 운영 모의 결과를 실제 시설의 자동 제어 명령으로 사용하지 않습니다. / Align release-ramp units [(m³/s)/h] with timestep; simulated operations are not direct control commands to real infrastructure. |
| [예측 기반 사전방류·하류 제약 검토 / Forecast-based pre-release & downstream constraints](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dam-forecast) | **구현 · 조건부 적용 / Implemented · conditional use** | 동일 초기상태·예측기간으로 대안을 비교하고 예측 수정 시 판단도 다시 수행합니다. / Compare alternatives from the same initial state/horizon and reassess when forecasts change. |
| [다수 댐 운영 시나리오 비교 / Multi-reservoir operating scenarios](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dam-scenario) | **구현 · 조건부 적용 / Implemented · conditional use** | 기준안과 시나리오의 파일·입력·평가기간을 구분하고 운영 대안이 원본 결과를 덮어쓰지 않도록 합니다. / Keep baseline/scenario inputs, files and periods distinct so alternatives do not overwrite source results. |

## 1D–2D 연계·홍수범람 / 1D–2D coupling & floodplain

| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |
|---|---|---|
| [양방향 1D-2D 연계 / Bidirectional 1D-2D coupling](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-coupling) | **개발 완료 / Development complete** | 연결 위치·제방고·단면·DEM 수직기준이 맞아야 합니다. 같은 물의 양이 교환되는 것과 두 영역의 운동량을 완전 보존하는 것은 다릅니다. / Match interface location, crest and section/DEM datums. Equal exchanged water volume does not imply complete coupled momentum conservation. |
| [2D 국부관성(Local Inertia) 범람 / 2D Local-Inertia floodplain analysis](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-local-inertia) | **개발 완료 / Development complete** | 유속과 급변류 영향이 큰 구간은 국부관성 가정의 적합성을 검토합니다. 최소수심·조도·시간간격에 대한 민감도와 물수지를 함께 봅니다. / Assess local-inertial assumptions where advection or rapid transitions matter, together with wet/dry, roughness, timestep sensitivity and balance. |
| [2D 완전 천수방정식(Full SWE) / 2D full shallow-water equations (Full SWE)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-fullswe) | **개발 완료 · 선택 적용 / Complete · selected configurations** | 작은 격자와 빠른 유속은 시간간격을 제한합니다. 국부관성 결과와 비교할 때 입력·경계·해상도를 동일하게 놓습니다. / Small cells and high velocities constrain the timestep. Compare against local inertia using matched inputs, boundaries and resolution. |
| [다중해상도·관심영역(Patch) 2D / Multi-resolution & local-area (Patch) 2D](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-multires) | **구현 · 조건부 적용 / Implemented · conditional use** | 관심영역 경계의 저장·교환량 보존과 주요 지형 연결을 확인하고 원해상도 결과와 민감도를 비교합니다. / Check patch-interface conservation and terrain connectivity and compare sensitivity with source-resolution results. |
| [2D 직접강우·배수·구조물·물질추적 / 2D rainfall, drainage, structures & material tracking](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-flood-extras) | **구현 · 조건부 적용 / Implemented · conditional use** | 하천을 통한 유입과 같은 강우를 2D에 중복 투입하지 않습니다. 입자 개수·위치를 수질 반응농도로 해석하지 않습니다. / Avoid double counting water already entering via the river; particle positions/counts are not reactive water-quality concentrations. |

## 연구·확장 기능 / Research & extensions

| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |
|---|---|---|
| [사면 유사·침식·퇴적 / Hillslope sediment, erosion & deposition](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-sed-hill) | **연구 기능 / Research function** | 유사 질량·농도·체적의 단위를 구분하고 관측 유사량을 이용해 물수지와 별도의 질량수지를 평가합니다. / Distinguish mass, concentration and volume units and evaluate sediment balance separately from water balance. |
| [하천 유사이송 / River sediment transport](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-sed-river) | **연구 기능 / Research function** | 입경·단면·공급 유사량을 일치시켜 검토하고 유사이송 기능을 완전한 하상변동모형으로 확대 해석하지 않습니다. / Match grain-size, section and supply assumptions and do not equate transport functionality with a complete morphodynamic model. |
| [보존성 물질·염료 추적 / Conservative material & dye tracking](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-dye) | **연구 기능 / Research function** | 물의 양이 작아지는 구간에서 농도의 민감성을 확인하고 주입·유출·저장의 질량 합계를 대조합니다. / Inspect sensitivity at low water volume and reconcile injected, exported and stored mass. |
| [수질 과정 모듈 / Water-quality process module](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-wq) | **비활성 · 재개발 대상 / Disabled · redevelopment** | 코드의 보존 여부와 현재 계산 가능 여부를 구분하며, 수질 결과를 기대하는 사용자는 기능 활성 범위를 먼저 확인해야 합니다. / Distinguish retained historical code from active capability before expecting quality outputs. |
| [Estuary2DV 하구 연구모형 / Estuary2DV estuary research model](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-estuary) | **실험 연구모형 / Experimental research model** | 2DV를 일반적인 평면 2D 또는 완전 3D 모형으로 설명하지 않고, 별도 연구 검증범위를 표시합니다. / Do not describe 2DV as standard plan-view 2D or a full 3D model; retain its research validation scope. |

## 입력·실행·결과도구 / Input, execution & result tools

| 기능 / Capability | 구현 / Implementation | 실제 활용·적용 조건 / Application |
|---|---|---|
| [단일·병렬계산(OpenMP·MPI) / Serial & parallel execution (OpenMP/MPI)](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-parallel) | **구현 · 성능 개선 / Implemented · performance refinement** | 동일 입력·컴퓨터·출력조건에서 시간과 결과를 비교합니다. 코어 수만으로 속도 향상 배수를 단정하지 않습니다. / Compare both outputs and timings using the same input, host and output configuration; core count alone does not determine speedup. |
| [NetCDF 통합 결과 출력 / Integrated NetCDF output](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-netcdf) | **구현 완료 / Implemented** | 파일 확장자만 보고 격자·시간이 같다고 가정하지 않고 차원·단위·결측값·최종 저장시각을 확인합니다. / Check dimensions, units, missing values and final timestamp rather than inferring alignment from the extension. |
| [FloodViewer 결과 분석 / FloodViewer result analysis](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-viewer) | **공개 준비 중 / Release candidate** | 자동 축 범위·범례·단위와 실제 원자료 값을 대조하고, 부분 결과 표시를 전체 모의 완료로 해석하지 않습니다. / Check axes, legend, units and source values; display of partial results does not establish full-run completion. |
| [InputStudio 입력자료 작성·점검 / InputStudio input authoring & checks](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-inputstudio) | **도구 개발 중 / Tool in development** | 완성되지 않은 입력을 임의 값으로 채우지 않고, 저장과 입력 생성·실행이 같은 동작인지 구분합니다. / Do not fill incomplete inputs with invented values; distinguish saving, input generation and execution. |
| [1D 하천수리 결과 분석 Viewer / 1D river-hydraulics results viewer](https://youngteckhur.github.io/KDRUM-Public/ko/#cap-river-viewer) | **별도 도구 개발 / Separate tool development** | 그래프가 보인다는 사실과 원본의 모든 편집·연동 기능이 보존됐다는 판단을 구분합니다. 화면 값은 계산 원자료와 대조합니다. / Visible plots do not prove preservation of every editing/synchronization feature; compare displayed values with producer data. |

## 검토 근거와 경계 / Review basis

이번 표는 모델 개발자의 1D·2D 완료 확인, 현행 계산 경로·빌드 연결, 기능별 입출력 설명과 기존 공개 연구를 대조해 정리했습니다. 별도 모형 재컴파일이나 수치실험을 수행한 결과표가 아닙니다. 코드의 과거 주석·오래된 문서 날짜나 미병합 제안만으로 현재 상태를 결정하지 않았습니다. 공개 문구에는 비공개 소스·실유역 입력·내부 매개변수·운영자료를 옮기지 않았습니다.

The review combines the model developer’s completion confirmation with current build/call-path evidence, capability input/output descriptions and public research. It is not a newly executed numerical validation campaign. Historical comments and open proposals are not treated as authoritative current availability.

현재 참고자료: [방법론](TECHNICAL_METHODS.md) · [기능 개요](CAPABILITIES.md) · [공개 연구](PUBLICATIONS.md).
