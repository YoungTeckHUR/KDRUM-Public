# K-DRUM 기능·입력·계산·출력 / Capabilities, inputs, methods and outputs

**검토일 / Reviewed: 2026-10-28**

1D 하천망 수리, 분기·합류, 2D 국부관성 범람과 양방향 1D–2D 연계는 **개발 완료** 기능입니다. Full SWE는 지원하는 격자·경계·연계 조건에 맞춰 사용하는 **개발 완료·선택 적용** 기능입니다. 기능 개선이나 새로운 유역 검증이 계속된다는 이유로 완료된 기능을 개발 중으로 되돌리지 않습니다.

**1D river-network hydraulics, junctions, 2D local-inertial inundation and two-way 1D–2D exchange are development-complete.** Full SWE is complete for supported configurations. Continued refinement and basin-specific evaluation do not change implementation completion into an unfinished capability.

구현 완료, 유역별 적용·관측 검증, 공식 배포는 별개의 정보입니다. 개발 완료는 모든 유역의 무조건적 정확도 인증이나 모든 공식 배포본에 포함되었다는 뜻이 아닙니다. 공식 설치파일·이용조건은 [MyWater K-Series](https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list)에서 확인합니다.

Implementation completion, application/observation-based validation and official distribution are distinct. Consult MyWater for actual package versions and terms; do not infer universal accuracy or distribution from implementation alone.

홈페이지는 기능별 개요를 먼저 보이고, 이론·입력·관계식·산출물·적용조건은 세부 내용을 펼쳐 확인하도록 구성합니다. / The website keeps overviews compact and reveals theory, inputs, representative equations, outputs and checks in expandable details.

## 강우 입력·품질관리 / Rainfall input & quality checks

### 공간 강우 입력 / Spatial rainfall forcing

**확립된 기능 / Established**

관측소 자료는 공간배분을 거쳐 격자 강우로, 레이더·격자 자료는 원자료와 계산격자의 위치 관계에 따라 입력됩니다. 강우 깊이와 강우강도를 구분하고 각 계산 구간의 강우량을 면적으로 환산하여 물수지 입력을 구성합니다. 같은 총강우량이어도 강우가 집중되는 위치가 달라지면 유출 도달시간과 첨두 반응이 달라집니다.

Station series require spatial mapping, whereas radar and gridded fields are connected through their spatial relationship to model cells. Rainfall depth is distinguished from intensity, and interval depths are multiplied by cell area to form water-balance inputs. Equal basin totals can produce different arrival times and peaks when rainfall concentration moves.

입력 / Inputs: 강우 시계열 또는 강우장, 관측 위치·좌표계, 계산격자, 시간 간격과 결측 표시. / Rainfall time series or fields, station positions and coordinate reference, model cells, timestamps and missing-data flags.

산출물 / Outputs: 격자별 강우 시계열, 유역·소유역 강우량과 누적 강우체적. / Cell rainfall series, basin/subbasin rainfall and accumulated rainfall volume.

적용 조건 / Check: 시간대, 누적구간의 시작·종료 기준, mm와 mm/h, 원자료와 계산격자의 유효 영역을 맞춥니다. / Align time zone, accumulation-window convention, mm versus mm/h and the valid spatial footprint.

대표 관계식 / Representative relationship:

`Vₚ = Σᵢ (Pᵢ / 1000) Aᵢ`

Pᵢ: 구간 강우량[mm], Aᵢ: 격자면적[m²], Vₚ: 강우체적[m³]. 강우량을 체적으로 바꾸는 집계식입니다. / Pᵢ: interval rainfall [mm]; Aᵢ: cell area [m²]; Vₚ: rainfall volume [m³]. This is the aggregation definition.

[K-DRUM: radar rainfall and GIS-based runoff (2012)](https://doi.org/10.1016/j.jher.2011.05.005)

### 강우 공간배분 (IDW) / Rainfall mapping (IDW)

**구현 완료 / Implemented**

가까운 관측소에 더 큰 가중치를 부여하고 가중치 합으로 정규화합니다. 관측소 위치와 격자가 일치하는 경우에는 거리 0의 특이 처리가 필요합니다. 결측 자료와 0 mm 관측은 다른 상태이므로 유효자료 선정 뒤에 공간배분해야 합니다. 현재 안내하는 관측소 강우배분 방식은 IDW입니다.

Nearby observations receive larger weights, normalized by the total weight. A coincident station requires explicit zero-distance handling. Missing observations are not zero rainfall, so valid-data selection precedes interpolation. IDW is the station-rainfall mapping method described here.

입력 / Inputs: 유효 관측소 강우, 관측소와 격자의 거리, 거리 가중 설정. / Valid station rainfall, station-to-cell distances and distance-weight settings.

산출물 / Outputs: 계산격자별 강우와 공간적인 강우 집중 분포. / Cell rainfall and the spatial pattern of rainfall concentration.

적용 조건 / Check: 관측소가 없는 지역의 분포는 관측망 배치에 민감합니다. 고도보정과 거리 가중 효과를 구분해 비교합니다. / Unsampled areas are sensitive to station layout. Evaluate elevation correction separately from distance weighting.

대표 관계식 / Representative relationship:

`P(x) = Σⱼ wⱼ Pⱼ / Σⱼ wⱼ,   wⱼ = dⱼ⁻ᵖ`

Pⱼ: 관측소 강우, dⱼ: 거리, p: 거리 가중 지수. 동일한 단위의 강우자료를 사용합니다. / Pⱼ: station rainfall; dⱼ: distance; p: weighting exponent. All rainfall values must use the same units.

[K-DRUM: radar rainfall and GIS-based runoff (2012)](https://doi.org/10.1016/j.jher.2011.05.005)

### 강우 고도보정·품질점검 (QC) / Elevation correction & rainfall quality checks

**구현 완료 / Implemented**

강우의 고도 의존성을 반영하는 보정은 공간 입력을 바꾸는 처리입니다. 음수값·결측·이상값과 시간축 오류를 찾는 품질점검은 원자료의 적합성을 판단하는 처리입니다. 두 단계를 분리하여 원자료, 보정 후 자료, 품질 표시를 비교하면 강우량 변화의 원인을 추적할 수 있습니다.

Elevation adjustment changes spatial forcing to represent an assumed elevation dependence. Quality checks identify missing, negative, suspicious or incorrectly timed observations. Keeping these operations separate makes changes traceable from source data to adjusted rainfall and quality flags.

입력 / Inputs: 관측소·격자 표고, 원강우, 결측·이상값 규칙, 고도보정 설정. / Station/cell elevations, source rainfall, missing/outlier rules and elevation-adjustment settings.

산출물 / Outputs: 보정된 강우 입력, 결측·이상 여부와 입력 품질 정보. / Adjusted rainfall and input-quality information, including missing or suspect values.

적용 조건 / Check: 고도보정으로 결측이 자동 해소되지는 않습니다. 적용 유역의 관측 특성과 보정 전후 유역 총량을 함께 확인합니다. / Elevation adjustment does not repair missing data automatically. Check local observations and basin totals before and after adjustment.

[K-DRUM: radar rainfall and GIS-based runoff (2012)](https://doi.org/10.1016/j.jher.2011.05.005)

### 강우자료 완전성 점검 / Rainfall data completeness check

**구현 완료 / Implemented**

기대되는 자료 시각과 실제 기록을 대조하여 누락 구간을 찾고 관측·예측 자료의 사용 범위를 정리합니다. 총자료 수가 충분해도 연속된 결측이나 특정 호우시각의 누락이 있으면 해당 사상의 해석에 영향을 줍니다. 자료 완전성 집계 자체는 강우를 보간하거나 미래 강우를 생성하지 않습니다.

Expected timestamps are compared with actual records to locate gaps and distinguish observation and forecast coverage. A high total record count can still hide a consecutive gap or missing storm peak. Completeness reporting neither interpolates missing rainfall nor generates forecasts.

입력 / Inputs: 모의 시작·종료 시각, 자료 종류, 시계열 간격과 유효 여부. / Simulation start/end times, record type, cadence and validity.

산출물 / Outputs: 자료 종류별 사용 구간, 누락 시간과 완전성 요약. / Coverage by data type, missing periods and completeness summaries.

적용 조건 / Check: 모의 종료시각 포함 여부와 중복시각 처리 기준을 동일하게 놓고 집계합니다. / Use consistent end-time inclusion and duplicate-record conventions.

대표 관계식 / Representative relationship:

`C = Nvalid / Nexpected × 100%`

C: 완전성의 설명 지표[%]. 실제 결과요약의 관측·예측 분류와 함께 읽습니다. / C: an illustrative completeness percentage, interpreted with the actual report categories.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### 입력자료 사전점검·정합성 / Input precheck & consistency

**구현 완료 / Implemented**

파일 판독 가능 여부와 물리적인 프로젝트 완성도를 구분합니다. 좌표계·격자 배치·식별자 연결·필수 자료·시간 범위를 서로 대조하고, 임시값이나 미연결 요소를 따로 식별합니다. 검사 통과는 실행 준비 상태를 뜻하며 모의 성능평가를 대신하지 않습니다. 입력 편집 화면과 검사 규칙은 사용하는 도구에 따라 달라질 수 있습니다.

Readable files are distinguished from a physically complete project. Checks reconcile coordinate systems, grid layouts, identifiers, mandatory inputs and temporal coverage, while retaining flags for provisional values and unconnected objects. Passing establishes readiness rather than predictive performance; editor interfaces and check coverage depend on the tool.

입력 / Inputs: 격자·하천망·단면·경계·구조물, 제어자료, 강우·기상 시계열. / Grid, river network, cross sections, boundaries, structures, controls and forcing series.

산출물 / Outputs: 수정이 필요한 오류·경고, 자료 연결 및 실행 준비상태. / Actionable errors/warnings, linkage checks and run readiness.

적용 조건 / Check: 경고를 무조건 무시하거나 누락 지형을 임의로 채우지 않고, 원자료를 확인한 뒤 다시 점검합니다. / Resolve warnings using source evidence rather than inventing missing geometry, then repeat the checks.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

## 유역 수문·연속모의 / Watershed hydrology & state

### Green-Ampt 침투 / Green-Ampt infiltration

**확립된 기능 / Established**

토양에 비교적 뚜렷한 습윤전선이 전진한다고 보고 중력과 흡인수두에 의한 침투능을 계산합니다. 누적침투량이 증가하면 흡인 효과의 상대적 비중이 줄어듭니다. 실제 침투량은 침투능뿐 아니라 공급된 물의 양으로 제한되며, 침투수는 토양 저장과 이후 층별 유출 계산으로 연결됩니다.

A distinct wetting front represents infiltration driven by gravity and suction. The relative suction contribution declines as cumulative infiltration increases. Actual infiltration is bounded by both capacity and available water; infiltrated water enters soil storage and subsequent layer-flow calculations.

입력 / Inputs: 투수계수, 습윤전선 흡인수두, 초기·포화 함수율, 강우와 지표 가용수. / Hydraulic conductivity, wetting-front suction, initial/saturated water content, rainfall and available surface water.

산출물 / Outputs: 구간 침투량·누적침투량, 지표 초과강우와 토양 저장 변화. / Interval/cumulative infiltration, surface excess and soil-storage change.

적용 조건 / Check: 서로 다른 단위의 투수계수와 시간간격을 섞지 않습니다. 포화·불포화 조건 및 불투수면 설정을 함께 확인합니다. / Keep conductivity and timestep units consistent and review saturation and impervious-area settings.

대표 관계식 / Representative relationship:

`f_c = Kₛ [1 + ψf (θₛ − θᵢ) / F]`

단순 담수조건 설명식: f_c·Kₛ [길이/시간], ψf·F [길이], θ [체적함수율]. 실제 계산은 가용수·초기조건을 함께 처리합니다. / Simplified ponded capacity: f_c and Kₛ [length/time]; ψf and F [length]; θ [volumetric water content]. Available water and initialization also enter the implementation.

[USACE HEC-HMS: Green and Ampt loss model](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/canopy-surface-infiltration-and-runoff-volume/infiltration/green-and-ampt-loss-model) · [K-DRUM: radar rainfall and GIS-based runoff (2012)](https://doi.org/10.1016/j.jher.2011.05.005)

### 지표·지표하 유출 / Surface & subsurface runoff

**확립된 기능 / Established**

단위 격자는 지표와 다층 저장으로 구성됩니다. 유입된 물은 층별 저장을 갱신하고, 층간 이동과 사면 방향의 흐름으로 분배됩니다. 빠른 지표 반응과 느린 토양·심부 저장 반응이 하천유입의 시간 차이를 만듭니다. 유출 생성량과 하류에서 관측하는 유량은 전달과정을 거친 서로 다른 양입니다.

A cell combines surface and layered storage. Incoming water updates each store and is partitioned into interlayer transfer and downslope flow. Fast surface and slower soil/deep-store responses produce different contributions to river inflow. Generated runoff differs from downstream discharge after routing.

입력 / Inputs: 침투·강우·융설수, A/B/C/D층 상태, 토양·토심·경사 및 유출 연결. / Infiltration, rainfall/melt, A/B/C/D states, soil properties/depth, slope and drainage connectivity.

산출물 / Outputs: 지표·지표하 유출, 층별 저장상태, 하천으로 전달되는 유입. / Surface/subsurface runoff, layer storage and contributions routed to rivers.

적용 조건 / Check: 층 사이 이동은 내부 교환이므로 유역 전체 유출에 중복 합산하지 않습니다. / Interlayer exchange is internal and must not be counted again as basin outflow.

대표 관계식 / Representative relationship:

`ΔSₖ = Iₖ − Oₖ − ETₖ`

같은 구간·체적 단위의 층별 보존식. Iₖ와 Oₖ에는 층간·측방 이동이 포함됩니다. / Layer budget using interval volumes; Iₖ and Oₖ include vertical and lateral transfers.

[K-DRUM: radar rainfall and GIS-based runoff (2012)](https://doi.org/10.1016/j.jher.2011.05.005)

### 연속·장기모의 / Continuous / long-term simulation

**확립된 기능 / Established**

강우사상 사이에도 증발산과 저장·유출을 계산하여 다음 사상의 선행조건을 갱신합니다. 계절별 적설·융설과 토양수분의 변화가 홍수기와 갈수기 반응에 함께 작용합니다. 초기조건의 영향이 큰 기간은 준비운전 또는 상태 재사용 범위를 명시하여 분석기간과 구분합니다.

Evapotranspiration, storage and drainage continue between storms, updating antecedent conditions for later events. Seasonal snow and soil-water changes influence both floods and low flows. Spin-up or reused initialization is identified separately where the initial state strongly affects the analysis period.

입력 / Inputs: 연속 강우·기상 자료, 초기 저장, 토양·식생 조건, 모의기간. / Continuous rainfall/meteorology, initial storage, soil/vegetation properties and simulation period.

산출물 / Outputs: 장기 유량·수문상태 시계열, 기간별 물수지와 저장 변화. / Long-term flow/state series, period balances and storage changes.

적용 조건 / Check: 여러 해의 증발산·물수지를 비교할 때 분석기간, 자료 결측, 초기·최종 저장을 통일합니다. / Compare multi-year evapotranspiration and balance using aligned periods, gap handling and storage endpoints.

대표 관계식 / Representative relationship:

`S(t + Δt) = S(t) + IΔt − OΔt`

저장상태를 다음 시점으로 전달하는 연속모의의 보존 개념입니다. / Conservation concept for carrying storage to the next computational time.

[K-DRUM: long-term snowmelt application (2013)](https://doi.org/10.12652/Ksce.2013.33.6.2237)

### 증발산·토양수분 / Evapotranspiration & soil water

**확립된 기능 / Established**

기준 증발산 수요를 식생과 뿌리 영역에 연결한 뒤 층별로 물을 배분·차감합니다. 뿌리 영역에 물이 부족하면 실제 증발산은 수요보다 작아지며 토양수분도 그만큼 감소합니다. 증발산은 수문 계산의 외부 손실항이고 토양층 사이의 재분배와 구분됩니다.

Evaporative demand is connected to vegetation and the root zone, then water is allocated and removed from eligible layers. Moisture shortage limits actual evapotranspiration below demand, with corresponding soil-water depletion. ET is an external water loss, distinct from redistribution between layers.

입력 / Inputs: 기상자료, 토지피복·계절별 LAI, 뿌리 깊이와 층별 수분상태. / Meteorology, land cover/seasonal LAI, root depth and layer water availability.

산출물 / Outputs: 실제 증발산, 층별 수분 감소와 연속모의 토양수분. / Actual ET, layer depletion and continuous soil-water states.

적용 조건 / Check: 기상 수요식과 실제 수분 제한을 구분합니다. 물이 없는 층에서 증발산을 무제한 차감하지 않는지 물수지로 확인합니다. / Distinguish the demand calculation from moisture limitation and check that extraction is consistent with layer water availability.

대표 관계식 / Representative relationship:

`0 ≤ ETₐ Δt ≤ min(ETd Δt, Wavailable)`

가용수 제한의 설명식. ETₐ: 실제 증발산률, ETd: 수요, Wavailable: 같은 면적 기준의 가용 수량. / Illustrative water-availability bound: ETₐ actual rate, ETd demand, Wavailable water on a consistent area basis.

[FAO-56: evaporative demand and crop evapotranspiration](https://www.fao.org/4/x0490e/x0490e06.htm) · [K-DRUM: long-term snowmelt application (2013)](https://doi.org/10.12652/Ksce.2013.33.6.2237)

### 적설·융설 / Snow accumulation & melt

**확립된 기능 / Established**

기온에 따라 강우와 강설을 구분하고 강설을 적설수량으로 저장합니다. 표고에 따른 기온 차이와 경사·방향·시간대 보정, 풍속과 강우 영향을 경험적 융설 계산에 반영합니다. 융설수는 적설 저장에서 차감되어 침투·유출에 공급됩니다. 이는 일사 에너지수지를 직접 푸는 적설모형이나 눈의 사면 이동 계산과 다릅니다.

Temperature partitions rain and snowfall, with snowfall retained as snow-water equivalent. Empirical melt incorporates elevation-adjusted temperature and terrain/time modifiers, as well as wind and rainfall effects. Melt is removed from snow storage and supplied to infiltration/runoff. This differs from a complete snow energy balance or downslope snow transport.

입력 / Inputs: 기온·표고·강우·풍속, 경사·D8 방향, 시간대와 적설수량. / Temperature/elevation, rainfall/wind, slope/D8 direction, time of day and snow-water equivalent.

산출물 / Outputs: 적설수량, 융설수 공급량과 계절별 유출 기여. / Snow-water equivalent, meltwater supply and seasonal runoff contribution.

적용 조건 / Check: 적설수량(mm 물깊이)과 적설심(cm 눈깊이)을 혼동하지 않습니다. 융설량은 가용 적설 저장을 넘을 수 없습니다. / Distinguish water-equivalent depth from physical snow depth; melt cannot exceed available snow storage.

대표 관계식 / Representative relationship:

`SWEⁿ⁺¹ = SWEⁿ + Psnow − M`

SWE·Psnow·M을 동일 구간의 물환산 깊이로 집계한 설명식이며, M의 실제 경험식과 구분합니다. / Interval water-equivalent snow budget; this expression is distinct from the empirical calculation of M.

[K-DRUM: long-term snowmelt application (2013)](https://doi.org/10.12652/Ksce.2013.33.6.2237)

### 워밍업·초기상태 안정화 / Warm-up & initial-state stabilization

**구현 완료 / Implemented**

초기상태를 바꾸며 모형을 반복하고 목표유량 오차와 상태 변화가 설정한 기준에 들어오는지 확인합니다. 매개변수의 최적 조합을 찾는 보정과 달리, 준비운전은 선택한 매개변수에서 시작 상태를 정하는 과정입니다. 재사용 가능한 수문상태가 있으면 일부 준비 계산을 줄일 수 있습니다.

Repeated calculations adjust initial states and assess target-flow error and state change against stopping conditions. Unlike parameter calibration, warm-up determines a starting state for the chosen parameters. A reusable hydrologic state may reduce repeated preparation.

입력 / Inputs: 초기 저장·유량, 목표지점 유량, 반복·종료 조건. / Initial storage/flow, target-site flow and iteration/stopping conditions.

산출물 / Outputs: 조정된 시작 상태, 반복 이력과 목표유량 오차. / Adjusted initial states, iteration history and target-flow residuals.

적용 조건 / Check: 목표유량, 관측 시점과 모의 시작시각의 의미를 맞추고, 준비기간 결과를 분석기간 통계와 구분합니다. / Align target-flow timing with initialization and separate warm-up outputs from analysis-period statistics.

대표 관계식 / Representative relationship:

`eQ = Qinitial − Qtarget`

eQ [m³/s]는 초기유량 차이의 예시입니다. 종료 판단에는 실제 설정의 절대·상대 기준을 사용합니다. / eQ [m³/s] illustrates initial-flow mismatch; use the configured absolute/relative stopping criteria.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### 상태 저장·재시작 (HotStart) / State save & restart (HotStart)

**구현 완료 / Implemented**

재시작은 저장 시점의 상태를 복원하여 이후 구간을 계산하는 기능입니다. 수문 준비상태만 재사용하는 캐시는 준비운전을 줄이지만 적설·댐·하천 등 모든 상태를 동일하게 이어받는 전체 재시작과 같지 않습니다. 복원 대상과 시작시각을 확인하고 불일치한 상태는 무리하게 혼용하지 않습니다.

Restart resumes from a saved state and time. A cache of hydrologic warm-up state can shorten initialization but is not equivalent to restoring every snow, reservoir and hydraulic variable. Check restored scope and time identity rather than combining incompatible states.

입력 / Inputs: 상태 파일, 격자·하천·시간 정보, 모형·상태 형식의 호환성. / Saved state, grid/network/time identity and model/state-format compatibility.

산출물 / Outputs: 복원된 모의상태, 재시작 실행과 연속 계산 비교 결과. / Restored states and resumed results that can be compared with an uninterrupted run.

적용 조건 / Check: 연속 실행과 재시작 실행을 같은 조건에서 비교하여 저장량·유량·시간축의 일치성을 확인합니다. / Compare uninterrupted and restarted runs under identical conditions for storage, discharge and time consistency.

대표 관계식 / Representative relationship:

`Xrestart(t₀) = Xsaved(t₀)`

X는 해당 형식이 저장·복원하는 상태 묶음입니다. 저장하지 않은 변수를 복원했다고 가정하지 않습니다. / X denotes the state covered by the selected format; variables outside that coverage are not implied to be restored.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### D층 지하수 저장·장기유출 / D-layer groundwater storage & long-term runoff

**구현 완료 / Implemented**

D층은 원래 다층 유출 구조에 포함된 저장층입니다. 현행 확장 경로는 저장량에 따른 지연 복귀와 선택적인 심부손실을 가용 저장량 이내로 계산하여 장기 저유량 반응을 표현합니다. 상부 토양·하천과의 교환은 내부 이동이며, 영역 밖 심부손실은 외부 손실로 따로 집계합니다. 공간적인 대수층 수두장을 푸는 지하수유동모형과는 해석 차원이 다릅니다.

The D layer already belongs to the multilayer runoff structure. Its extension calculates storage-dependent delayed return and optional deep loss within available water to represent long-term low flows. Transfers to upper soil or rivers are internal; deep loss beyond the domain is external. This is not a spatial aquifer-head solver.

입력 / Inputs: D층 저장, 상부층 유입, 지연 복귀·심부손실 설정, 하류 수위 조건. / D-layer storage, inflow from upper layers, delayed-return/deep-loss settings and downstream-stage conditions.

산출물 / Outputs: 심부 저장 변화, 지연 복귀량·기저유출 기여, 심부손실. / Deep-storage change, delayed return/baseflow contribution and deep loss.

적용 조건 / Check: 기존 D층을 새로 추가한 기능으로 설명하지 않습니다. 감수곡선과 장기 물수지를 함께 사용해 유역별 계수를 검토합니다. / Do not treat the D layer itself as newly introduced. Assess basin-specific response using recession curves and long-term balance.

대표 관계식 / Representative relationship:

`ΔSD = Recharge − Return − DeepLoss − LateralOut`

D층의 구간 체적 수지 설명식. 내부 복귀량을 유역 외부 유출과 중복 집계하지 않습니다. / Illustrative D-layer interval-volume balance; internal return must not be counted twice as external outflow.

[K-DRUM: long-term snowmelt application (2013)](https://doi.org/10.12652/Ksce.2013.33.6.2237)

## 유출전달·하천지형 / Routing & river terrain

### 사면·하도 경사 개별 적용 / Separate hillslope & channel slopes

**구현 완료 / Implemented**

격자 평균 지형경사를 하천 바닥 경사와 같은 값으로 사용하지 않고 각 계산 영역에 맞는 값을 전달합니다. 사면의 빠른 지표유출과 하도 전달시간은 서로 다른 기하·조도 조건을 가집니다. 경사 보완은 흐름방향의 연결성과 구분하여 확인하고, 수리해석의 수면경사와도 구분합니다.

Terrain slope is not automatically equated with river-bed slope: each calculation receives its appropriate gradient. Hillslope runoff and channel travel have different geometry and roughness. Slope treatment is checked separately from drainage connectivity and from the water-surface gradient used by hydraulic solvers.

입력 / Inputs: 사면 경사, 하도 종단경사, 흐름방향과 하도 길이. / Hillslope gradient, longitudinal channel slope, flow direction and reach length.

산출물 / Outputs: 영역별 경사 입력, 유출 속도와 하도 전달 반응. / Domain-specific slopes and corresponding routing responses.

적용 조건 / Check: 표고 차이/거리로 계산한 경사가 무차원인지, 각도·백분율인지 구분합니다. / Distinguish dimensionless elevation-drop/distance slope from degrees or percent slope.

대표 관계식 / Representative relationship:

`S = Δz / L`

Δz·L [m], S [m/m]. 사면과 하도에 각각 해당 기하를 사용합니다. / Δz and L [m]; S [m/m]. Use the geometry of the appropriate domain.

[USACE HEC-HMS: Kinematic-wave channel routing](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/channel-flow/kinematic-wave-channel-routing-model)

### 사면 운동파 추적 / Hillslope kinematic routing

**확립된 기능 / Established**

연속식과 흐름–저장 관계를 결합하여 상류·국소 유입과 하류 유출을 보존형으로 갱신합니다. 지배적인 중력과 마찰의 평형으로 유출량을 정하기 때문에 동역학파처럼 배수위 영향을 양방향 전파시키는 방식은 아닙니다. 고정된 흐름방향과 토양층 반응을 함께 사용하여 사면 기여를 하천까지 전달합니다.

Continuity and a storage–outflow relation update upstream/local inflow and downstream outflow conservatively. Discharge follows a gravity–friction balance rather than bidirectional backwater propagation as in dynamic-wave hydraulics. Prescribed drainage directions and soil-layer responses route hillslope contributions toward rivers.

입력 / Inputs: 사면 유출, 격자 연결, 경사·길이·조도와 저장상태. / Generated runoff, connectivity, slope, length, roughness and storage.

산출물 / Outputs: 격자별 사면 유출·저장과 하천 측방유입. / Cell hillslope outflow/storage and lateral river contributions.

적용 조건 / Check: 침투에 의해 정해진 유출 생성과 운동파 전달을 구분하고, 완만한 배수 영향 구간의 수리해석 필요성을 검토합니다. / Separate runoff generation from routing and assess whether backwater-affected areas require a hydraulic solver.

대표 관계식 / Representative relationship:

`∂A/∂t + ∂Q/∂x = ql,   Q = α Aᵐ`

운동파의 대표 연속식·폐합관계. A [m²], Q [m³/s], ql [m²/s]; α,m은 형상·조도 조건을 나타냅니다. / Representative continuity and closure: A [m²], Q [m³/s], ql [m²/s]; α,m represent geometry and roughness.

[USACE HEC-HMS: Kinematic-wave channel routing](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/channel-flow/kinematic-wave-channel-routing-model) · [K-DRUM: radar rainfall and GIS-based runoff (2012)](https://doi.org/10.1016/j.jher.2011.05.005)

### 하도 운동파 추적 / Channel kinematic routing

**확립된 기능 / Established**

하도 구간의 저장량 변화가 유입과 유출의 차이와 일치하도록 계산합니다. 사면유출과 상류 하도 유량을 받아 비선형 저장–유출 관계를 풀고 정해진 연결을 따라 전달합니다. 하도 운동파는 빠른 유량 추적에 적합하며, 실측 단면의 수위·배수위·역류는 별도의 1D 수리 계산 경로로 다룹니다.

Channel storage change balances the difference between incoming and outgoing flow. Hillslope and upstream contributions enter a nonlinear storage–outflow calculation and pass along prescribed connectivity. Kinematic routing supports efficient discharge propagation; measured-section stage, backwater and flow reversal belong to the separate 1D hydraulic path.

입력 / Inputs: 상류 유량·측방유입, 하도 폭·길이·경사·조도, 흐름방향. / Upstream/lateral inflows, channel width, length, slope, roughness and routing direction.

산출물 / Outputs: 하도 유량과 저장, 유역 출구·소유역 지점의 수문곡선. / Channel flow/storage and outlet or subbasin hydrographs.

적용 조건 / Check: 같은 유량에 서로 다른 수위가 가능한 배수 영향 구간은 단일 운동파 수위 관계로 설명하지 않습니다. / Do not use a single kinematic rating to explain backwater reaches where the same discharge can occur at different stages.

대표 관계식 / Representative relationship:

`Vⁿ⁺¹ − Vⁿ = Δt (Qup + Qlat − Qdown)`

구간 저장체적 V [m³], 유량 Q [m³/s]. 하류로 전달되는 물을 단계 간에 중복 소비하지 않습니다. / Reach volume V [m³], discharge Q [m³/s]. Transfers must not be consumed twice across routing stages.

[USACE HEC-HMS: Kinematic-wave channel routing](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/channel-flow/kinematic-wave-channel-routing-model) · [K-DRUM: radar rainfall and GIS-based runoff (2012)](https://doi.org/10.1016/j.jher.2011.05.005)

### 하천 침투·심부저장 연계 / River infiltration to deeper storage

**구현 완료 / Implemented**

하천 침투량은 침투가능량만으로 정하지 않고 공급 가능한 하천수와 수용층의 저장여유를 함께 제한합니다. 하천에서 빠진 물을 D층 증가량으로 대응시켜 내부 이동을 추적합니다. 외부 손실로 취급하는 경로와 내부 저장으로 전달하는 경로를 구분하면 장기유출의 감수·기저유출을 일관되게 해석할 수 있습니다.

Transfer is bounded by infiltration capacity, available channel water and receiving-store capacity. The removed river volume is matched to deep-storage gain, distinguishing internal exchange from externally lost water. This supports consistent interpretation of recession and baseflow.

입력 / Inputs: 하천 수량·하상 침투특성, D층 상태와 저장여유, 시간간격. / River water, bed infiltration properties, D-layer storage capacity and timestep.

산출물 / Outputs: 하천 침투량, D층 저장 증가와 교환 물수지. / River infiltration, D-layer storage gain and transfer balance.

적용 조건 / Check: 모의영역에 남아 있는 물과 영역 밖 손실을 구분하고, 내부 이동을 유역 전체 손실에 다시 더하지 않습니다. / Separate retained internal transfer from loss outside the domain to avoid double counting.

대표 관계식 / Representative relationship:

`Vexchange ≤ min(Vriver, Vinfiltration, Vcapacity)`

모두 같은 계산구간의 체적[m³]으로 비교한 제한 개념입니다. / All terms are interval volumes [m³]; this expresses the transfer bound.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### 수리해석 지형·하상 보완(ChannelBed) / Hydraulic terrain & channel-bed representation (ChannelBed)

**구현 · 조건부 적용 / Implemented · conditional use**

지표 DEM은 수면 아래 하상을 충분히 포함하지 않을 수 있습니다. 추가 단면의 상대 형상과 종단 하상고를 구분해 배치하고 주변 지형·제방과 정합시킵니다. 1D 단면 형상 보존과 2D 범람 지형의 연결은 서로 다른 작업이며, 누락된 수중 지형을 고해상도 DEM만으로 자동 복원했다고 보지 않습니다.

A surface DEM may lack submerged bathymetry. Relative cross-section shape is placed using longitudinal bed elevations and reconciled with banks and surrounding terrain. Preserving 1D section shape and connecting 2D terrain are different tasks; a finer DEM alone does not reconstruct missing underwater geometry.

입력 / Inputs: DEM, 하천 중심선, 실측·설계 횡단면, 하상고·좌우안 위치·표고 기준. / DEM, centerline, measured/design sections, bed elevations, bank positions and vertical datum.

산출물 / Outputs: 보완 하상·수리 입력 지형과 단면–DEM 정합 점검자료. / Supplemented hydraulic terrain and cross-section/DEM consistency information.

적용 조건 / Check: 수위·단면·DEM의 수직기준을 맞추고 실제 측량자료와 보완·가정 구간을 구분해 기록합니다. / Align vertical datums and distinguish measured from supplemented or assumed geometry.

대표 관계식 / Representative relationship:

`η = zbed + h`

η: 수면표고[m], zbed: 하상고[m], h: 수심[m]. 서로 다른 수직기준을 혼용하지 않습니다. / η water-surface elevation, zbed bed elevation and h depth [m] must share a datum.

[USACE: 1D unsteady-flow hydrodynamics](https://www.hec.usace.army.mil/confluence/rasdocs/ras1dtechref/6.5/theoretical-basis-for-one-dimensional-and-two-dimensional-hydrodynamic-calculations/1d-unsteady-flow-hydrodynamics)

## 물수지·보정·결과검증 / Water balance, calibration & result checks

### 유역 물수지 분석 / Basin water-balance analysis

**구현 완료 / Implemented**

각 계산과정의 체적을 같은 기간과 영역으로 집계하여 들어온 물의 행방을 설명합니다. 토양·적설·하천·저수지 등 저장 변화와 내부 이동을 함께 추적하고, 경계 밖 유출·손실만 전체 외부 항에 반영합니다. 잔차가 작다는 것은 물의 보존 일관성을 보여주며 수위·유량 예측 정확도와는 다른 평가입니다.

Process volumes are aggregated over a common period and domain to explain the fate of incoming water. Changes in soil, snow, channel and reservoir storage are tracked with internal transfers, while only boundary exits enter external losses. A small residual demonstrates accounting consistency, not observation-based predictive accuracy.

입력 / Inputs: 강우·외부유입·출구유출·증발산·심부손실, 초기·최종 저장. / Rainfall, external inflow, outlet flow, ET, deep loss and initial/final storage.

산출물 / Outputs: 체적·등가수심별 수지항, 잔차와 상대오차, 내부 이동 설명. / Balance terms in volume/equivalent depth, residuals, relative error and internal-transfer interpretation.

적용 조건 / Check: 유량은 시간 적분하고 수심은 면적을 곱합니다. 상대오차 분모와 수리·수문 저장 집계범위를 먼저 확인합니다. / Integrate flow over time and multiply depth by area; check the relative-error denominator and hydrologic/hydraulic storage domain.

대표 관계식 / Representative relationship:

`εV = Vin − Vout − Vloss − (Sfinal − Sinitial)`

모든 항 [m³]. 내부 교환은 전체 영역 합계에서 상쇄됩니다. / All terms [m³]; internal transfers cancel over the combined domain.

[Hodges (2019): conservative finite-volume Saint-Venant forms](https://hess.copernicus.org/articles/23/1281/2019/)

### 1D-2D 교환 물수지 / 1D-2D exchange water balance

**개발 완료 / Development complete**

1D에서 빠진 교환량은 2D 유입으로, 2D 복귀량은 1D 유입으로 반영합니다. 내부 반복에서 계산한 시험 교환과 최종 채택된 교환을 분리해 중복 집계를 막습니다. 양방향 누적 총량과 순교환량을 함께 보면 홍수 확산과 복귀를 구분할 수 있습니다. 교환량 보존은 기능의 핵심이며 전체 유역 물수지나 운동량 보존과 동일한 검사는 아닙니다.

Water leaving 1D enters 2D, and return flow leaving 2D enters 1D. Trial exchanges from internal iterations are separated from accepted transfers to avoid double counting. Gross directional totals and net transfer distinguish inundation from return. Exchange conservation is a core check, separate from whole-basin balance or momentum conservation.

입력 / Inputs: 확정된 계산구간의 교환유량·체적, 하천·범람원 저장, 교환 연결정보. / Accepted-interval exchange fluxes/volumes, domain storage and interface mapping.

산출물 / Outputs: 1D→2D·2D→1D 누적체적, 순교환량과 양 영역 교환 잔차. / Cumulative volumes in each direction, net exchange and inter-domain transfer residual.

적용 조건 / Check: 연계 시간구간과 부호·단위를 일치시키고, 한 영역의 수위 오차가 교환수지 오차와 같은 의미인지 구분합니다. / Match interval, sign and units; stage errors and exchange-balance errors are different quantities.

대표 관계식 / Representative relationship:

`ΔV₁D = −Vex,   ΔV₂D = +Vex;   ΔV₁D + ΔV₂D = 0`

1D→2D를 Vex>0으로 정의한 교환 보존식. 복귀 시 부호가 바뀝니다. / Positive Vex denotes 1D→2D; the signs reverse for return flow.

[Hodges (2019): conservative finite-volume Saint-Venant forms](https://hess.copernicus.org/articles/23/1281/2019/) · [Bates, Horritt & Fewtrell (2010): local-inertial formulation](https://doi.org/10.1016/j.jhydrol.2010.03.027)

### 통합 실행 결과요약 / Unified run summary

**구현 완료 / Implemented**

어떤 설정으로 어떤 기간을 계산했는지와 결과의 생성상태를 함께 기록합니다. 준비운전·본계산·출력 시간을 구분하면 실행시간 변동 원인을 찾을 수 있습니다. 경고·부분 결과·정상 완료 여부를 수문곡선 옆에서 확인하여 결과 파일이 있다는 사실만으로 전체 실행 성공을 판단하지 않도록 합니다.

Records the conditions and period that produced the outputs. Separating initialization, computation and output timing helps explain runtime changes. Warnings, partial results and completion state accompany the hydrographs rather than treating file existence as proof of complete execution.

입력 / Inputs: 실행 모드·버전, 모의기간, 자료점검·초기화·계산·출력 상태. / Run mode/version, period, input checks, initialization, solver and output status.

산출물 / Outputs: 실행 요약, 물수지·자료 품질·출력상태·시간 정보. / Run summaries combining balance, input quality, output state and timing.

적용 조건 / Check: 실제 총 소요시간과 반복·실패 시도가 포함된 개별 계산기 누적시간을 같은 지표로 비교하지 않습니다. / Do not equate end-to-end elapsed time with cumulative solver timings that may include repeated or rejected trials.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### 소유역 결과요약 / Subbasin result summary

**구현 완료 / Implemented**

개별 소유역의 국소 발생량과 상류를 포함한 누적 출구유량을 구분합니다. 영역별 면적 가중과 연결성을 적용하여 강우·유출 기여를 정리하면 전체 출구 결과만으로 놓치는 공간적인 차이를 찾을 수 있습니다. 다지점 보고 기능은 각 소유역의 매개변수를 동시에 자동 보정한다는 의미가 아닙니다.

Distinguishes locally generated contributions from outlet flow accumulated from upstream. Area weighting and connectivity support interpretation of rainfall and runoff across subbasins, revealing spatial differences hidden by the overall outlet. Multi-site reporting is not simultaneous automatic calibration of all subbasins.

입력 / Inputs: 소유역 구분·연결, 평가 지점, 강우·유출·저장 등 집계 결과. / Subbasin delineation/connectivity, target sites and rainfall/runoff/storage outputs.

산출물 / Outputs: 소유역별 요약, 목표지점 수문곡선과 기여량 비교. / Subbasin summaries, target-site hydrographs and contribution comparisons.

적용 조건 / Check: 관측소의 집수면적과 집계한 소유역 범위를 맞추고, 상류 누적량을 국소 발생량과 중복 합산하지 않습니다. / Match gauge drainage area with the aggregation domain and avoid double counting upstream totals as local contributions.

대표 관계식 / Representative relationship:

`P̄basin = Σᵢ Aᵢ Pᵢ / Σᵢ Aᵢ`

면적 가중 평균의 예시입니다. 유량 누적은 별도의 하천 연결관계를 따릅니다. / Example of area weighting; accumulated discharge follows network connectivity separately.

[K-DRUM: radar rainfall and GIS-based runoff (2012)](https://doi.org/10.1016/j.jher.2011.05.005)

### 목표지점 매개변수 보정·최적화 / Target-point parameter calibration & optimization

**구현 · 조건부 적용 / Implemented · conditional use**

격자탐색이나 일요인 변화로 후보 매개변수의 모의반응을 비교합니다. NSE·KGE·PBIAS·RMSE는 각각 변동 재현·상관 및 편향·총량 편향·오차 크기 등 다른 측면을 보여줍니다. 보정에 사용하지 않은 기간으로 확인하고 매개변수의 물리적 범위를 제한하여 한 사상에 과적합되는 것을 줄입니다.

Grid search or one-at-a-time changes compare parameter candidates. NSE, KGE, PBIAS and RMSE emphasize different aspects of variability, correlation/bias, volume bias and error magnitude. An independent period and physically plausible bounds help limit event-specific overfitting.

입력 / Inputs: 관측 유량·수위, 평가기간, 조정 매개변수 범위·조합, 목적지표. / Observed flow/stage, evaluation period, parameter ranges/combinations and objectives.

산출물 / Outputs: 후보 조합별 성능, 선택 매개변수와 관측·계산 비교. / Candidate performance, selected parameters and observation/simulation comparisons.

적용 조건 / Check: 단일 지표의 최대값만으로 첨두·도달시간·갈수량이 모두 개선됐다고 판단하지 않습니다. / A better single score does not imply improvement of peak, timing and low flow simultaneously.

대표 관계식 / Representative relationship:

`NSE = 1 − Σ(Qsim − Qobs)² / Σ(Qobs − Q̄obs)²`

NSE는 무차원이며 관측 분산이 0이면 정의되지 않습니다. 결측 제외와 시간 정렬을 먼저 수행합니다. / NSE is dimensionless and undefined for zero observed variance; align times and handle missing values first.

[Nash & Sutcliffe (1970): river-flow forecasting and model evaluation](https://www.sciencedirect.com/science/article/pii/0022169470902556)

### 소유역·목표지점 평가 및 보정 / Subbasin & target-site evaluation and calibration

**구현 · 조건부 적용 / Implemented · conditional use**

어느 소유역의 반응이 목표지점 차이에 기여하는지 먼저 검토하고 선택된 매개변수 조합을 평가합니다. 보정 후에는 다른 지점과 기간의 반응도 비교합니다. 하류 지점의 오차를 상류 특정 소유역의 매개변수만으로 단정하지 않으며, 매개변수 적용 영역과 실제 소유역 연결을 맞춥니다.

First assess which subbasin responses contribute to target-site differences, then evaluate selected parameter combinations. Recheck other sites and periods after calibration. Downstream mismatch cannot automatically be assigned to one upstream parameter; parameter application areas must match actual subbasin connectivity.

입력 / Inputs: 소유역·목표지점 연결, 관측자료, 후보 매개변수와 지역별 결과. / Subbasin/target-site mapping, observations, parameter candidates and spatial diagnostics.

산출물 / Outputs: 지점별 성능, 보정 전후의 지역 반응과 적용 매개변수 범위. / Site-wise performance, spatial response before/after calibration and parameter application scope.

적용 조건 / Check: 소유역 결과 보고, 선택 지점 보정, 모든 지점 동시 최적화는 서로 다른 기능입니다. / Subbasin reporting, selected-site calibration and simultaneous all-site optimization are different capabilities.

[Nash & Sutcliffe (1970): river-flow forecasting and model evaluation](https://www.sciencedirect.com/science/article/pii/0022169470902556)

### 출력 파일 무결성·생성상태 점검 / Output-file integrity & completion checks

**구현 완료 / Implemented**

파일의 존재만 확인하지 않고 필수 변수·차원·유효 값과 기록 범위를 검사합니다. 진행·중단된 계산의 부분 결과와 정상 종료 후 확정된 결과를 구분하여 후속 분석이 잘못된 기간을 읽지 않도록 합니다. 파일 무결성 점검은 관측자료에 대한 물리적 정확도 검증과 다른 목적입니다.

Tests required variables, dimensions, valid values and coverage rather than mere existence. Partial files from ongoing/interrupted runs are distinguished from finalized outputs so later analysis does not read an incorrect period. File integrity and physical validation against observations serve different purposes.

입력 / Inputs: 출력 파일·메타데이터, 요구 변수, 마지막 저장시각과 종료상태. / Output files/metadata, required variables, last stored timestamp and completion state.

산출물 / Outputs: 출력 준비상태, 누락·불완전 기록과 검토 가능한 결과기간. / Output readiness, missing/incomplete records and the available analysis period.

적용 조건 / Check: 마지막 기록시각, 단위·좌표·시간 기준, 비정상 값과 정상 마감 여부를 함께 확인합니다. / Inspect final timestamp, units, spatial/time reference, invalid values and finalization together.

[Unidata: NetCDF data model](https://docs.unidata.ucar.edu/netcdf-c/current/netcdf_data_model.html)

## 1D 하천수리·구조물·댐 / 1D river hydraulics, structures & dams

### 1D 하천망 수리 해석 / 1D river-network hydraulics

**개발 완료 / Development complete**

1D 하천수리 기능은 개발 완료되었습니다. 국부관성 경로와 이류 운동량을 포함하는 동역학파 경로를 선택 목적에 맞춰 구분합니다. 동역학파는 단면 수리량과 공유 경계의 보존형 플럭스를 하천망에 연결하며, 현재 음해 계산 경로는 후진 Euler·TR-BDF2와 비선형 반복을 사용합니다. 실측 단면의 상대 형상을 유지하면서 종단 하상고에 배치하므로 단순 직사각형 하도로 일괄 치환하는 방식과 다릅니다.

Development of the 1D hydraulic capability is complete. Local-inertial and dynamic-wave paths are distinguished by their treatment of advective momentum. The dynamic-wave network combines section metrics and conservative interface fluxes; its implicit path uses Backward Euler/TR-BDF2 and nonlinear iteration. Measured section shape is retained while being placed on longitudinal bed elevations rather than universally replaced by rectangles.

입력 / Inputs: 횡단면 X–Z, 종단 하상고·하천 연결, 조도, 상류·측방 유입과 하류 수위·구조물. / X–Z sections, longitudinal bed elevations/connectivity, roughness, upstream/lateral flows and downstream stage/structures.

산출물 / Outputs: 하천망 수위·유량·유속, 종단·횡단 수리상태와 저장량. / Network stage, discharge, velocity, section profiles and hydraulic storage.

적용 조건 / Check: 배수위·역류·급변류의 표현은 선택한 방정식과 경계조건에 달려 있습니다. 실제 유역 적용은 단면·표고 기준과 관측수위·유량으로 확인합니다. / Backwater, reversal and rapidly varying flow depend on selected equations/boundaries. Assess real-basin application using section/datum consistency and observed stage/flow.

대표 관계식 / Representative relationship:

`∂A/∂t + ∂Q/∂x = ql;   ∂Q/∂t + ∂(Q²/A + gI₁)/∂x = Sgeom − g A Sf + Slat`

A [m²], Q [m³/s], I₁: 단면 정수압 적분[m³], ql [m²/s]. 두 번째 식은 비등단면·마찰·측방항을 묶어 쓴 보존형 개요입니다. Sf는 무차원 마찰경사이며 Sgeom·Slat는 단위 길이당 운동량 소스입니다. / A [m²], Q [m³/s], I₁ hydrostatic section integral [m³], ql [m²/s]. Geometry, friction and lateral terms are grouped schematically. Sf is dimensionless friction slope; Sgeom and Slat are momentum sources per unit length.

[USACE: 1D unsteady-flow hydrodynamics](https://www.hec.usace.army.mil/confluence/rasdocs/ras1dtechref/6.5/theoretical-basis-for-one-dimensional-and-two-dimensional-hydrodynamic-calculations/1d-unsteady-flow-hydrodynamics) · [Hodges (2019): conservative finite-volume Saint-Venant forms](https://hess.copernicus.org/articles/23/1281/2019/)

### 하천 분기·합류 수리해석 / Branch & confluence hydraulics

**개발 완료 / Development complete**

접합부를 여러 하도 구간의 연결점으로 다루고 같은 경계의 유량을 일관된 방향으로 전달합니다. 접합부 저장을 사용하는 경우 유입과 유출의 차이는 수위·저장 변화에 반영됩니다. 동역학파 경로의 접합부 수리·운동량 처리는 단순한 유량 합산과 구분되며, 같은 유입이 하도와 접합부에 중복 들어가지 않도록 연결을 확인합니다.

A junction connects adjoining reaches with consistent interface-flow signs. Where junction storage is represented, inflow minus outflow changes storage and stage. Dynamic-wave junction hydraulics/momentum treatment is more than summing discharges, and forcing ownership must prevent the same inflow entering both a reach and its junction twice.

입력 / Inputs: 하천망 위상, 접합부 연결·기하, 연결 하도의 수위·유량과 외부 유입. / Network topology, junction connections/geometry, adjoining states and external inflow.

산출물 / Outputs: 접합부 수위·저장, 분기·합류 유량 및 연결 구간의 수리 반응. / Junction stage/storage, branch flows and connected-reach hydraulic response.

적용 조건 / Check: 접합부의 연결 방향·표고·저장 기하가 맞는지 확인하고, 역류가 가능한 조건에서는 부호를 포함해 비교합니다. / Check connectivity, elevation and storage geometry; include discharge signs when reversals are possible.

대표 관계식 / Representative relationship:

`dVj/dt = Σ Qin − Σ Qout + Qexternal`

Vj [m³], Q [m³/s]. 접합부 질량보존식이며 운동량 조건은 선택한 수리 경로가 추가로 처리합니다. / Vj [m³], Q [m³/s]. Junction mass balance; momentum conditions are handled by the selected hydraulic path.

[USACE: 1D unsteady-flow hydrodynamics](https://www.hec.usace.army.mil/confluence/rasdocs/ras1dtechref/6.5/theoretical-basis-for-one-dimensional-and-two-dimensional-hydrodynamic-calculations/1d-unsteady-flow-hydrodynamics) · [Hodges (2019): conservative finite-volume Saint-Venant forms](https://hess.copernicus.org/articles/23/1281/2019/)

### 수리구조물 / Hydraulic structures

**구현 완료 / Implemented**

마루를 넘는 월류와 개구부 통과 흐름은 서로 다른 지배조건을 사용합니다. 상하류 수두차와 잠수 여부, 개구 상태를 고려해 유량을 정하고 상류 손실·하류 유입으로 대응시킵니다. 구조물의 흐름 계산과 언제 얼마나 개방할지 정하는 운영규칙을 분리하면 수리조건과 정책조건의 영향을 구분할 수 있습니다.

Over-crest and through-opening flows use different hydraulic conditions. Head difference, submergence and opening determine discharge, matched as upstream removal and downstream supply. Separating hydraulics from operating rules distinguishes physical response from release policy.

입력 / Inputs: 구조물 위치·형상·마루고·개구, 상하류 수위와 방류 관계. / Structure location, geometry, crest/opening, upstream/downstream stage and discharge relationships.

산출물 / Outputs: 구조물 통과유량, 상하류 수위 반응과 수지항. / Structure discharge, upstream/downstream response and corresponding balance terms.

적용 조건 / Check: 마루고·저수위의 표고 기준과 자유/잠수 조건, 역방향 지원 범위를 실제 선택 방식에 맞춥니다. / Align crest/stage datum and check free/submerged flow and directional support for the selected structure law.

대표 관계식 / Representative relationship:

`Qweir ∝ L H³ᐟ²;   Qorifice ∝ Aopening √(2gΔH)`

월류와 개구부의 대표 수리 관계이며 실제 계수·잠수 보정·개구 규칙은 구조물 설정에 따릅니다. / Representative weir/orifice relations; coefficients, submergence corrections and opening rules follow structure configuration.

[USACE: hydraulic structures and flow equations](https://www.hec.usace.army.mil/confluence/rasdocs/ras1dtechref/6.5)

### 댐·저수지 운영 / Dam & reservoir operation

**구현 완료 / Implemented**

저수량을 유입과 방류로 갱신하고 H–V 관계를 통해 수위로 변환합니다. 운영 규칙은 목표수위·가용 방류능력·최소유량과 방류 증가·감소 한도를 고려합니다. 연계 계산에서는 같은 구간의 저수지 방류와 하류 하천의 유입을 일치시키며, 예측 운영·다수 댐 시나리오와는 역할을 구분합니다.

Storage is updated from inflow and release and converted to stage through the H–V relationship. Operating rules consider target stage, available capacity, minimum flow and release ramp limits. In coupled runs, reservoir release and downstream inflow must refer to the same interval; forecast operations and multi-dam scenarios are separate functions.

입력 / Inputs: 유입량, 초기 수위·저류량, H–V 관계, 방류능력·운영규칙·환경유량. / Inflow, initial stage/storage, H–V relationship, release capacity/rules and minimum flows.

산출물 / Outputs: 저수위·저류량·방류량 시계열, 제약 충족 여부와 하류 영향. / Stage, storage, release, constraint compliance and downstream effects.

적용 조건 / Check: 방류 변화율의 단위 (m³/s)/h와 계산시간을 맞추고, 운영 모의 결과를 실제 시설의 자동 제어 명령으로 사용하지 않습니다. / Align release-ramp units [(m³/s)/h] with timestep; simulated operations are not direct control commands to real infrastructure.

대표 관계식 / Representative relationship:

`dV/dt = Qin − Qrelease − Qloss,   H = H(V)`

V [m³], Q [m³/s], H [m]. 초기 수위와 초기 저장량의 대응이 물수지 기준이 됩니다. / V [m³], Q [m³/s], H [m]. Consistent initial stage/storage is required for the balance reference.

[USACE HEC-HMS: reservoir routing](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/reservoir-modeling/reservoir-modeling-concepts-and-equations)

### 예측 기반 사전방류·하류 제약 검토 / Forecast-based pre-release & downstream constraints

**구현 · 조건부 적용 / Implemented · conditional use**

현재 상태에서 예측기간의 유입을 적용하여 후보 방류안의 저수위·방류량·하류 영향을 계산합니다. 홍수조절 여유 확보와 하류 제약을 함께 검토하되 예측 강우·유입 오차도 시나리오 조건으로 다룹니다. 결정지원용 대안 검토이며, 예측이 정확하거나 후보안이 모든 조건에서 최적이라는 보장은 하지 않습니다.

Candidate release plans are simulated from the current state over the forecast horizon, comparing storage, releases and downstream impacts. Flood-control space and downstream constraints are assessed together, with forecast uncertainty treated as a scenario condition. This supports decisions rather than guaranteeing forecasts or universal optimality.

입력 / Inputs: 현재 저수상태, 예측 유입기간, 방류능력·목표수위, 하류 허용조건. / Current reservoir state, forecast horizon/inflow, release capacity/targets and downstream limits.

산출물 / Outputs: 사전방류 후보와 저수위·하류 유량 변화, 제약 평가. / Pre-release candidates, reservoir/downstream response and constraint evaluations.

적용 조건 / Check: 동일 초기상태·예측기간으로 대안을 비교하고 예측 수정 시 판단도 다시 수행합니다. / Compare alternatives from the same initial state/horizon and reassess when forecasts change.

[USACE HEC-HMS: reservoir routing](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/reservoir-modeling/reservoir-modeling-concepts-and-equations)

### 다수 댐 운영 시나리오 비교 / Multi-reservoir operating scenarios

**구현 · 조건부 적용 / Implemented · conditional use**

운영 대안별 저수지 상태와 방류를 계산하고 하류 도달시간과 중첩을 고려해 목표지점 반응을 평가합니다. 대안마다 동일 강우·초기조건을 유지해야 운영 변경의 효과를 분리할 수 있습니다. 시나리오 평가 결과는 원 모의의 정식 산출물과 구분하여 관리하며, 단일 댐 개선이 다른 지점의 악화로 이어지는지도 확인합니다.

For each operating alternative, reservoir states and releases are routed downstream, accounting for timing and superposition at target sites. Common rainfall and initial conditions isolate policy effects. Scenario evaluation is stored separately from baseline outputs, with attention to trade-offs between reservoirs and downstream locations.

입력 / Inputs: 댐 네트워크, 기준·대안 운영규칙, 초기 저장, 유입과 평가 지점. / Reservoir network, baseline/alternative rules, initial storage, inflow and target sites.

산출물 / Outputs: 대안별 방류·저수위·목표지점 유량, 제약 및 비교 지표. / Scenario releases, stages, target flows, constraints and comparison metrics.

적용 조건 / Check: 기준안과 시나리오의 파일·입력·평가기간을 구분하고 운영 대안이 원본 결과를 덮어쓰지 않도록 합니다. / Keep baseline/scenario inputs, files and periods distinct so alternatives do not overwrite source results.

[USACE HEC-HMS: reservoir routing](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/reservoir-modeling/reservoir-modeling-concepts-and-equations) · [USACE HEC-HMS: Kinematic-wave channel routing](https://www.hec.usace.army.mil/confluence/hmsdocs/hmstrm/channel-flow/kinematic-wave-channel-routing-model)

## 1D–2D 연계·홍수범람 / 1D–2D coupling & floodplain

### 양방향 1D-2D 연계 / Bidirectional 1D-2D coupling

**개발 완료 / Development complete**

양방향 연계 기능은 개발 완료되었습니다. 같은 교환경계에서 하천과 범람원 수위를 비교하고 교환체적을 1D와 2D에 반대 부호로 적용합니다. 결합 반복은 동일한 구간 시작상태에서 수행하며 확정된 교환만 채택합니다. 현행 동역학파–국부관성 경로와 단방향 후처리, 다른 계산기 조합은 구분해야 합니다.

Development of bidirectional coupling is complete. River and floodplain heads determine exchange at a common interface, with equal/opposite volume changes. Coupling trials restart from the same interval-start states, and only accepted exchange is committed. The current dynamic-wave/local-inertial route is distinguished from one-way postprocessing and other solver combinations.

입력 / Inputs: 1D 하천 수리상태, 2D 지형·수심, 제방·연결경계, 교환 시간구간. / 1D hydraulic state, 2D terrain/depth, banks/interface geometry and exchange interval.

산출물 / Outputs: 월류·복귀유량, 하천 수위 피드백, 범람 전개와 교환 물수지. / Overflow/return discharge, river-stage feedback, inundation development and exchange balance.

적용 조건 / Check: 연결 위치·제방고·단면·DEM 수직기준이 맞아야 합니다. 같은 물의 양이 교환되는 것과 두 영역의 운동량을 완전 보존하는 것은 다릅니다. / Match interface location, crest and section/DEM datums. Equal exchanged water volume does not imply complete coupled momentum conservation.

대표 관계식 / Representative relationship:

`Vex = ∫ Qex dt;   ΔVriver = −Vex;   ΔVflood = +Vex`

Qex [m³/s], Vex [m³]. 월류를 양, 복귀를 음으로 둔 예시입니다. / Qex [m³/s], Vex [m³]; positive for overflow and negative for return in this convention.

[Bates, Horritt & Fewtrell (2010): local-inertial formulation](https://doi.org/10.1016/j.jhydrol.2010.03.027) · [Hodges (2019): conservative finite-volume Saint-Venant forms](https://hess.copernicus.org/articles/23/1281/2019/)

### 2D 국부관성(Local Inertia) 범람 / 2D Local-Inertia floodplain analysis

**개발 완료 / Development complete**

2D 국부관성 범람 기능은 개발 완료되었습니다. 격자 경계에서 이전 단위폭 유량과 수면경사에 의한 가속을 반영하고 마찰을 반음해 방식으로 처리합니다. 경계 유량을 체적으로 바꾸어 격자 저장을 보존형으로 갱신하며 마른 영역으로의 확산을 추적합니다. 이류 운동량을 생략하므로 Full SWE와 같은 방정식은 아닙니다.

Development of 2D local-inertial flooding is complete. Face flow combines previous unit-width discharge with pressure-gradient acceleration and semi-implicit friction. Face fluxes update cell storage conservatively and track wetting fronts. Advective momentum is omitted, so this is not the same governing system as Full SWE.

입력 / Inputs: 수리 지형·격자, 조도, 초기 수심, 경계·교환유입·강우·배수. / Hydraulic terrain/grid, roughness, initial depth, boundary/exchange inflows, rainfall and drainage.

산출물 / Outputs: 수심·수면표고·유속, 침수영역과 시간 변화·최대값. / Depth, water-surface elevation, velocity, inundation evolution and maxima.

적용 조건 / Check: 유속과 급변류 영향이 큰 구간은 국부관성 가정의 적합성을 검토합니다. 최소수심·조도·시간간격에 대한 민감도와 물수지를 함께 봅니다. / Assess local-inertial assumptions where advection or rapid transitions matter, together with wet/dry, roughness, timestep sensitivity and balance.

대표 관계식 / Representative relationship:

`∂q/∂t + gh ∂η/∂x + g n² q|q|/h⁷ᐟ³ = 0`

한 방향 국부관성 설명식: q [m²/s], h·η [m], n: Manning 조도. 2D에서는 x·y 경계 흐름을 수심 연속식으로 연결합니다. / One-direction local-inertial form: q [m²/s], h and η [m], n Manning roughness. The 2D mass equation connects x/y face fluxes.

[Bates, Horritt & Fewtrell (2010): local-inertial formulation](https://doi.org/10.1016/j.jhydrol.2010.03.027)

### 2D 완전 천수방정식(Full SWE) / 2D full shallow-water equations (Full SWE)

**개발 완료 · 선택 적용 / Complete · selected configurations**

Full SWE 계산 경로는 질량과 두 수평방향 운동량을 보존형으로 갱신합니다. 현재 구현에는 HLL 계열 경계 플럭스와 공간·시간 정확도 선택, 지형·마찰·마름·젖음 처리가 포함됩니다. 기본 국부관성 범람과 별도의 선택 경로이므로 지원하는 전체영역·격자·경계·연계 조합을 맞추어 사용합니다. 이류를 포함한다고 모든 경우에 자동으로 더 정확해지는 것은 아닙니다.

The Full SWE path conservatively updates mass and both horizontal momentum components. Its implementation includes HLL-family fluxes, spatial/time-order options, terrain, friction and wet/dry treatment. It is a separate selectable path, requiring supported domain/grid/boundary/coupling combinations. Retaining advection does not automatically improve every application.

입력 / Inputs: 지원되는 수리격자·지형, 수심·두 방향 유량, 조도, 경계·소스. / Supported hydraulic grid/terrain, depth and directional discharge, roughness, boundaries and sources.

산출물 / Outputs: 수심·유속벡터·운동량 변화, 급격한 흐름 전이와 침수 결과. / Depth, velocity vectors, momentum response, flow transitions and inundation.

적용 조건 / Check: 작은 격자와 빠른 유속은 시간간격을 제한합니다. 국부관성 결과와 비교할 때 입력·경계·해상도를 동일하게 놓습니다. / Small cells and high velocities constrain the timestep. Compare against local inertia using matched inputs, boundaries and resolution.

대표 관계식 / Representative relationship:

`∂U/∂t + ∂F(U)/∂x + ∂G(U)/∂y = S;   U = (h, hu, hv)ᵀ`

h [m], u·v [m/s]. F·G는 질량·운동량 플럭스, S는 지형·마찰·외부 소스입니다. / h [m], u/v [m/s]; F/G are mass and momentum fluxes and S includes terrain, friction and external sources.

[Clawpack Riemann book: shallow-water equations](https://www.clawpack.org/riemann_book/html/Shallow_water.html) · [Hodges (2019): conservative finite-volume Saint-Venant forms](https://hess.copernicus.org/articles/23/1281/2019/)

### 다중해상도·관심영역(Patch) 2D / Multi-resolution & local-area (Patch) 2D

**구현 · 조건부 적용 / Implemented · conditional use**

원지형의 여러 셀을 배경 계산 셀로 묶고 관심영역은 더 세밀하게 유지합니다. 병합 셀에서는 저장량과 수면표고 관계를 이용하고, 서로 다른 크기의 셀 경계에서 같은 교환체적을 공유합니다. 입력자료보다 세밀한 지형을 새로 만들어내는 기능은 아니며, 국부관성·Full SWE의 지원 방식도 구분합니다.

Background cells aggregate source terrain while patches retain finer detail. Aggregated storage–elevation relationships and shared face volumes connect different cell sizes. This does not invent terrain detail beyond the source resolution, and support differs between local-inertial and Full SWE paths.

입력 / Inputs: 원지형 격자, 관심영역 지정·추천, 병합 규칙과 수리 연결. / Source terrain, selected/recommended patches, aggregation rules and hydraulic connectivity.

산출물 / Outputs: 다중해상도 수리격자, 관심영역 결과와 계산량·해상도 비교. / Multi-resolution mesh, patch results and cost/resolution comparisons.

적용 조건 / Check: 관심영역 경계의 저장·교환량 보존과 주요 지형 연결을 확인하고 원해상도 결과와 민감도를 비교합니다. / Check patch-interface conservation and terrain connectivity and compare sensitivity with source-resolution results.

대표 관계식 / Representative relationship:

`Vcell(η) = Σk max(η − zk, 0) Ak`

소격자의 표고 zk·면적 Ak로 구성하는 저장–수위 관계의 설명식입니다. / Illustrative storage–elevation relation constructed from subcell elevations zk and areas Ak.

[Hodges (2019): conservative finite-volume Saint-Venant forms](https://hess.copernicus.org/articles/23/1281/2019/)

### 2D 직접강우·배수·구조물·물질추적 / 2D rainfall, drainage, structures & material tracking

**구현 · 조건부 적용 / Implemented · conditional use**

직접강우와 배수는 수심 연속식의 유입·유출로, 구조물은 경계 유량조건으로 연결됩니다. 추적자 농도는 물과 함께 이동하는 질량으로 다루며, 입자는 계산된 속도장을 따라 위치를 갱신하는 별도 표현입니다. 구성요소가 존재하더라도 모든 수리계산기·격자·연계 조합에 동시에 적용되는 것은 아니므로 실제 지원 경로를 선택합니다.

Rainfall/drainage enter the water balance as sources/sinks and structures modify hydraulic fluxes. Tracer concentration represents transported mass, whereas particles follow computed velocities. Available components are not automatically supported in every solver/grid/coupling combination.

입력 / Inputs: 직접강우·배수조건, 구조물 형상·개구, 추적자 주입·입자 초기 위치. / Direct rainfall/drainage, structure geometry/opening, tracer injection and particle starting positions.

산출물 / Outputs: 강우·배수 반영 수심, 구조물 유량, 농도 분포와 입자 이동. / Source-adjusted depth, structure flow, concentration fields and particle trajectories.

적용 조건 / Check: 하천을 통한 유입과 같은 강우를 2D에 중복 투입하지 않습니다. 입자 개수·위치를 수질 반응농도로 해석하지 않습니다. / Avoid double counting water already entering via the river; particle positions/counts are not reactive water-quality concentrations.

대표 관계식 / Representative relationship:

`∂h/∂t + ∂qx/∂x + ∂qy/∂y = rain − drainage + sources`

h [m], q [m²/s], 우변 [m/s]로 환산한 수심 연속식입니다. / Depth h [m], unit-width q [m²/s], and source/sink rates [m/s].

[Clawpack Riemann book: shallow-water equations](https://www.clawpack.org/riemann_book/html/Shallow_water.html) · [Unidata: NetCDF data model](https://docs.unidata.ucar.edu/netcdf-c/current/netcdf_data_model.html)

## 연구·확장 기능 / Research & extensions

### 사면 유사·침식·퇴적 / Hillslope sediment, erosion & deposition

**연구 기능 / Research function**

사면에서 생성된 유사와 물의 운반능을 비교하여 이동·퇴적을 계산하는 연구 기능입니다. 강우유출량이 같아도 토양 침식특성과 경사에 따라 유사량은 달라집니다. 유출량을 바로 유사량으로 바꾸는 것이 아니며 입경·침식식 등 선택한 조건에 맞는 관측자료로 적용성을 평가해야 합니다.

This research function relates sediment supply to hydraulic transport capacity to calculate movement/deposition. Equal runoff need not imply equal sediment yield because soil and slope differ. Sediment is not a direct conversion of runoff; application requires data consistent with the selected erosion/particle assumptions.

입력 / Inputs: 토양 침식특성, 경사, 유출량·유속, 유사 공급·저장. / Soil erodibility, slope, runoff/velocity and sediment supply/storage.

산출물 / Outputs: 사면 유사 발생·이동·퇴적과 하천으로 전달되는 유사. / Hillslope sediment generation, transport, deposition and delivery to channels.

적용 조건 / Check: 유사 질량·농도·체적의 단위를 구분하고 관측 유사량을 이용해 물수지와 별도의 질량수지를 평가합니다. / Distinguish mass, concentration and volume units and evaluate sediment balance separately from water balance.

대표 관계식 / Representative relationship:

`ΔMs = Detachment + Min − Mout − Deposition`

유사 질량 보존의 개념식이며 특정 침식 경험식의 계수나 적용성을 대신하지 않습니다. / Conceptual sediment mass budget, not a substitute for an erosion law and its applicability.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### 하천 유사이송 / River sediment transport

**연구 기능 / Research function**

상류에서 들어온 유사와 사면 기여를 하천의 운반능과 비교하여 하류 이송과 퇴적에 배분합니다. 물의 이동과 유사의 공급제한은 다르므로 유량만 맞아도 유사 농도가 맞는 것은 아닙니다. 하상 형태변화의 상세 해석까지 가능한지는 해당 연구 경로의 상태변수와 출력 범위를 별도로 확인합니다.

Upstream and hillslope sediment inputs are compared with channel transport capacity to partition downstream transport and deposition. Sediment supply limitation differs from water transport, so accurate flow alone does not establish concentration accuracy. Detailed morphodynamic interpretation depends on the research path’s actual states and outputs.

입력 / Inputs: 상류·측방 유사 공급, 유량·단면·경사, 운반 특성과 저장량. / Upstream/lateral sediment supply, flow, section, slope and transport/storage properties.

산출물 / Outputs: 구간별 유사 이송·퇴적, 유출 유사량과 질량 변화. / Reach transport/deposition, sediment export and mass change.

적용 조건 / Check: 입경·단면·공급 유사량을 일치시켜 검토하고 유사이송 기능을 완전한 하상변동모형으로 확대 해석하지 않습니다. / Match grain-size, section and supply assumptions and do not equate transport functionality with a complete morphodynamic model.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### 보존성 물질·염료 추적 / Conservative material & dye tracking

**연구 기능 / Research function**

물에 포함된 질량을 유입·유출과 함께 갱신하고 가용 물의 체적으로 나누어 농도를 계산합니다. 농도 변화는 유입 질량뿐 아니라 희석·저장 변화에도 영향을 받습니다. 보존성 추적은 생화학적 반응이나 오염물질 분해를 자동 포함하지 않으므로 비활성 수질 과정 모듈과 구분합니다.

Solute mass is updated with inflow/outflow and divided by water volume to obtain concentration. Concentration reflects dilution and changing storage as well as mass loading. Conservative tracking does not automatically include biochemical reactions or degradation and is distinct from the disabled water-quality process module.

입력 / Inputs: 주입 위치·시각·질량, 하천 저장량·상하류 유량, 초기 농도. / Injection location/time/mass, river storage, connecting flow and initial concentration.

산출물 / Outputs: 농도 시계열, 질량 유출입과 잔존 질량. / Concentration series, transported mass and remaining mass.

적용 조건 / Check: 물의 양이 작아지는 구간에서 농도의 민감성을 확인하고 주입·유출·저장의 질량 합계를 대조합니다. / Inspect sensitivity at low water volume and reconcile injected, exported and stored mass.

대표 관계식 / Representative relationship:

`C = M/V;   ΔM = Min + Minjection − Mout`

M [kg], V [m³], C [kg/m³]의 보존성 혼합 설명식입니다. / Conservative mixing with M [kg], V [m³] and C [kg/m³].

[Clawpack Riemann book: shallow-water equations](https://www.clawpack.org/riemann_book/html/Shallow_water.html)

### 수질 과정 모듈 / Water-quality process module

**비활성 · 재개발 대상 / Disabled · redevelopment**

반응성 수질은 이송 외에 생성·소멸·반응속도와 외부 부하를 계산해야 합니다. 현재 활성 빌드에서는 해당 과정이 비활성 상태이므로 유사·보존성 추적자의 결과를 질소·인·BOD 결과로 안내하지 않습니다. 추후 재개발 시 반응식·단위·시간간격과 독립 수질자료에 대한 검증이 필요합니다.

Reactive quality requires sources, sinks, reaction kinetics and loading beyond transport. These processes are disabled in the current active build, so sediment or conservative-tracer results must not be presented as nitrogen, phosphorus or BOD outputs. Redevelopment needs consistent equations/units/timestep and independent water-quality validation.

입력 / Inputs: 재개발 시 필요한 수질 경계·반응계수·수온 등 자료와 과거 구현. / Historical implementations and, for redevelopment, water-quality boundaries, reaction parameters and temperature.

산출물 / Outputs: 현재 실행 가능한 반응성 수질 결과는 제공하지 않습니다. / No currently active reactive water-quality output is offered.

적용 조건 / Check: 코드의 보존 여부와 현재 계산 가능 여부를 구분하며, 수질 결과를 기대하는 사용자는 기능 활성 범위를 먼저 확인해야 합니다. / Distinguish retained historical code from active capability before expecting quality outputs.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### Estuary2DV 하구 연구모형 / Estuary2DV estuary research model

**실험 연구모형 / Experimental research model**

평면 x–y 범람과 달리 종·연직 x–z 단면에서 수직 방향 염분·흐름 차이를 다룹니다. 폭평균·정수압 가정과 해당 버전의 수송·혼합 표현을 사용하며 Core의 기본 1D·2D 홍수 기능과 구분됩니다. 염수 침입과 성층 해석에는 조위·염분·형상·혼합 자료가 필요합니다.

Unlike plan-view x–y inundation, this model examines vertical salinity/flow structure on an x–z section. Width-averaged/hydrostatic assumptions and version-specific transport/mixing make it distinct from the completed Core river/flood solvers. Salt intrusion and stratification require tidal, salinity, geometry and mixing information.

입력 / Inputs: 하구 종단·수심·수직층, 상류 유입, 조위·염분 경계와 초기 상태. / Estuary profile, depth/layers, upstream flow, tidal/salinity boundaries and initial state.

산출물 / Outputs: 실험적 종·연직 흐름·염분 분포와 성층 변화. / Experimental x–z flow/salinity fields and stratification changes.

적용 조건 / Check: 2DV를 일반적인 평면 2D 또는 완전 3D 모형으로 설명하지 않고, 별도 연구 검증범위를 표시합니다. / Do not describe 2DV as standard plan-view 2D or a full 3D model; retain its research validation scope.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

## 입력·실행·결과도구 / Input, execution & result tools

### 단일·병렬계산(OpenMP·MPI) / Serial & parallel execution (OpenMP/MPI)

**구현 · 성능 개선 / Implemented · performance refinement**

OpenMP는 공유메모리 스레드, MPI는 프로세스 간 분할을 사용합니다. 흐름방향의 선후관계나 하천망 연결 때문에 모든 작업을 독립적으로 나눌 수는 없습니다. 현재 점검한 소스 패키지는 OMP 중심이며, 과거 MPI 연구 성과와 실행파일별 지원 방식은 구분해야 합니다. 스레드를 늘릴 때는 계산 이득뿐 아니라 대기·동기화·입출력 비용도 평가합니다.

OpenMP uses shared-memory threads and MPI distributes work across processes. Routing dependencies and network connectivity limit independent work. The source package reviewed here is OMP-focused; historical MPI evidence is distinguished from support in a particular executable. More threads require evaluating synchronization, waiting and I/O costs as well as arithmetic gains.

입력 / Inputs: 유역 규모·흐름 연결, 실행파일 종류, CPU·메모리와 병렬 설정. / Domain size/connectivity, executable type, CPU/memory and parallel settings.

산출물 / Outputs: 계산시간·병렬 효율, 실행방식별 유량·저장·물수지 비교. / Timing, parallel efficiency and comparisons of flow, storage and balance between modes.

적용 조건 / Check: 동일 입력·컴퓨터·출력조건에서 시간과 결과를 비교합니다. 코어 수만으로 속도 향상 배수를 단정하지 않습니다. / Compare both outputs and timings using the same input, host and output configuration; core count alone does not determine speedup.

대표 관계식 / Representative relationship:

`Speedup = T₁/Tp;   Efficiency = T₁/(p Tp)`

T₁·Tp: 동일 작업의 경과시간, p: 병렬 작업자 수. 측정값이 있어야 계산할 수 있습니다. / T₁/Tp are elapsed times for the same workload and p is worker count; measurement is required.

[K-DRUM: MPI distributed rainfall–runoff (2011)](https://doi.org/10.1007/s12205-011-1194-9) · [OpenMP: specifications](https://www.openmp.org/specifications/)

### NetCDF 통합 결과 출력 / Integrated NetCDF output

**구현 완료 / Implemented**

차원은 배열의 축, 변수는 수심·유량 등의 값, 속성은 단위·좌표계·의미를 설명합니다. 같은 NetCDF 형식이어도 유역 격자와 범람 격자, 저장 간격과 시간 기준이 다를 수 있습니다. 진행 중 파일과 정상 마감 파일의 상태를 구분하고 분석 도구가 실제 축과 결측 표시를 읽도록 연결합니다.

Dimensions define axes, variables hold quantities such as depth/flow, and attributes explain units and meaning. A common format does not ensure matching watershed/flood grids, output intervals or time references. Ongoing and finalized files are distinguished, and viewers must interpret actual axes and missing-value markers.

입력 / Inputs: 계산된 격자·하천·범람 상태, 저장 변수·간격, 좌표·시간 기준. / Computed cell/river/flood states, selected variables/intervals and spatial/time reference.

산출물 / Outputs: 자기설명형 결과 파일, 시계열·공간분포와 분석도구 연결. / Self-describing result files for temporal/spatial analysis and viewer integration.

적용 조건 / Check: 파일 확장자만 보고 격자·시간이 같다고 가정하지 않고 차원·단위·결측값·최종 저장시각을 확인합니다. / Check dimensions, units, missing values and final timestamp rather than inferring alignment from the extension.

[Unidata: NetCDF data model](https://docs.unidata.ucar.edu/netcdf-c/current/netcdf_data_model.html)

### FloodViewer 결과 분석 / FloodViewer result analysis

**공개 준비 중 / Release candidate**

원자료의 변수와 시각을 읽어 지도에 표시하고 선택지점의 시간 변화를 연결합니다. 최대수심 지도와 특정 시각의 수심은 서로 다른 결과이며, 색상 범위와 결측·마른 영역 표시도 해석에 영향을 줍니다. Viewer는 모형을 대신 계산하는 프로그램이 아니며, 기존 FloodViewer와 신규 통합 Studio의 지원 범위는 사용 버전별로 구분합니다.

Maps display source variables at their actual times and link to selected-location series. Maximum depth differs from depth at one timestamp; color scale and missing/dry-cell handling affect interpretation. A viewer does not replace the solver, and standalone FloodViewer support differs from the new integrated Studio by version.

입력 / Inputs: 지원 결과파일, 공간좌표·시간축·변수, 관심지점·영역. / Supported results, coordinates, time axis, variables and selected points/areas.

산출물 / Outputs: 지도·시계열·최대값과 관심지점 변화 비교. / Maps, series, maxima and selected-location comparisons.

적용 조건 / Check: 자동 축 범위·범례·단위와 실제 원자료 값을 대조하고, 부분 결과 표시를 전체 모의 완료로 해석하지 않습니다. / Check axes, legend, units and source values; display of partial results does not establish full-run completion.

[Unidata: NetCDF data model](https://docs.unidata.ucar.edu/netcdf-c/current/netcdf_data_model.html)

### InputStudio 입력자료 작성·점검 / InputStudio input authoring & checks

**도구 개발 중 / Tool in development**

원자료로부터 유역·흐름방향·하천망·계산격자를 구축하고, 시계열과 수리조건을 프로젝트에 연결합니다. 작업공간 저장과 계산엔진 입력파일 생성을 구분하며 기준안과 시나리오를 분리해 관리합니다. 새 K-DRUM Studio는 프로젝트·제어·실행·분석을 통합하는 별도 개발 작업이며, 기존 InputStudio를 단순히 새 제품명으로 바꿔 부르지 않습니다.

Source data are used to build basin, flow-direction, river and computational-grid inputs, then connected to forcing and hydraulic settings. Workspace persistence is distinguished from engine-input generation, with baseline/scenario isolation. The new K-DRUM Studio is separate integrated project/control/run/analysis work, not merely a renamed InputStudio.

입력 / Inputs: DEM·토지피복·토양·토심, 강우·기상, 하천·단면·구조물·경계. / Terrain, land cover, soil/depth, forcing, rivers, sections, structures and boundaries.

산출물 / Outputs: 입력 프로젝트, 검사 결과와 엔진용 입력자료. / Authored projects, diagnostics and engine-compatible inputs.

적용 조건 / Check: 완성되지 않은 입력을 임의 값으로 채우지 않고, 저장과 입력 생성·실행이 같은 동작인지 구분합니다. / Do not fill incomplete inputs with invented values; distinguish saving, input generation and execution.

[K-DRUM: current capability status and scope](https://github.com/YoungTeckHUR/KDRUM-Public/blob/main/DEVELOPMENT_STATUS.md)

### 1D 하천수리 결과 분석 Viewer / 1D river-hydraulics results viewer

**별도 도구 개발 / Separate tool development**

동일한 하천 지점과 시각을 여러 보기에 연결하여 종단 수위 변화, 횡단면 침수와 시계열을 함께 읽습니다. 관측과 계산을 비교할 때에는 지점·시각·표고 기준을 맞춰야 합니다. 기존 전문 뷰어, C# 전환 후보와 Studio 통합 개발의 구현·검증 범위를 구분하고 서로 완전히 동일하다고 가정하지 않습니다.

A common location/time links profile, cross-section and series views. Observed/simulated comparisons require matching sites, times and elevation datums. The established specialist viewer, C# migration candidate and Studio integration have distinct implementation/testing scopes and must not be assumed fully equivalent.

입력 / Inputs: 1D 하천망·단면 결과, 수위·유량 시계열, 관측자료와 표시 설정. / 1D network/section results, stage/flow series, observations and display settings.

산출물 / Outputs: 종·횡단면 수위, 지점별 수문곡선과 연동 비교. / Longitudinal/cross-section levels, site hydrographs and synchronized comparisons.

적용 조건 / Check: 그래프가 보인다는 사실과 원본의 모든 편집·연동 기능이 보존됐다는 판단을 구분합니다. 화면 값은 계산 원자료와 대조합니다. / Visible plots do not prove preservation of every editing/synchronization feature; compare displayed values with producer data.

[Unidata: NetCDF data model](https://docs.unidata.ucar.edu/netcdf-c/current/netcdf_data_model.html) · [USACE: 1D unsteady-flow hydrodynamics](https://www.hec.usace.army.mil/confluence/rasdocs/ras1dtechref/6.5/theoretical-basis-for-one-dimensional-and-two-dimensional-hydrodynamic-calculations/1d-unsteady-flow-hydrodynamics)
