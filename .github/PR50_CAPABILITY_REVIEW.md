# PR #50 — 46개 기능 상세 전수 검토

비교 기준: `c25b87bb01ef9db861a744c635dfffc56aadef3a`. 검토일: 2026-09-13.
요청: [개별 기능 의미 일치 검토](https://github.com/YoungTeckHUR/KDRUM-Public/pull/50#issuecomment-5650324677).

## 범위와 근거

- [CAPABILITY_ATLAS](../CAPABILITY_ATLAS.md)의 8개 기능군·45개 항목 및 별도 1D 뷰어, [DEVELOPMENT_STATUS](../DEVELOPMENT_STATUS.md)의 2026-08-21 상태 정의를 기준으로 Codex가 한영 문장을 각각 대조했습니다. 공개 문서에 없는 수치기법·실증 성능을 추가하지 않았습니다.
- 아래 PASS는 공개 문서에 대한 Codex의 내용 대조와 브라우저 검사 결과입니다. 사람의 기술 검토 승인이나 수치모의 검증을 대신하지 않습니다. main 병합은 보류합니다.
- 46개 이름·요약·분류·상태값을 기준 커밋과 비교하여 동일함을 확인했습니다. 각 항목의 상태 설명 92개는 기존 의미를 유지하며 대상 기능을 명시했습니다.
- 개별 기술 개요 92개(46 × 한영)를 추가하여 기존 기능군 공통 개요 주입 92곳을 교체했습니다. 기능 상세 생성은 더 이상 domain 개요·도식으로 fallback하지 않습니다. 홈의 전체 모형 소개에는 공통 개요가 유지됩니다.
- 입력→처리→결과의 의미가 맞지 않던 8개 항목을 보완했습니다: `rain-summary`, `warmup`, `slope-separate`, `wb`, `wb-1d2d`, `junction`, `coupling`, `wq`. 수질 비활성 항목에는 현재 계산·출력이 제공되지 않음을 명시했습니다.
- 기능 상세의 요약·개요·상태 문장을 문장 단위로 비교한 결과, 서로 다른 항목 간 완전히 동일한 문장 반복은 한영 모두 0건입니다. 의도적 공통 요소는 UI 제목, 상태 badge, 자료 링크이며 개별 기술 설명과 구분됩니다. 부분 어구·전문용어의 재사용은 중복 문장으로 집계하지 않습니다.

## 도식 분류

전용 도식 **0개 항목**, 범위를 명시한 기능군 도식 **4개 항목**, 도식 생략 **42개 항목**입니다. 기존 42개 항목의 자동 도식 중 38개(한영 렌더링 76곳)를 제거했습니다. 없는 도식의 빈 프레임은 렌더링하지 않습니다.

| 항목 | 도식 | 적합 범위 |
|---|---|---|
| rain-spatial | rainfall-grid | 기능군 개념도: 관측자료에서 격자 강우 입력까지의 연결을 설명합니다. Thiessen·IDW 구현·QA 표시는 공간배분 경로에 해당합니다. |
| rain-methods | rainfall-grid | 기능군 개념도: 가운데 Thiessen·IDW 단계가 관측소-격자 배분에 해당하며, 좌우 영역은 입력과 산출 격자 강우입니다. |
| wb | read-results | 기능군 개념도: 오른쪽 물수지 구성 항목이 유역 폐합오차 평가를 설명합니다. 왼쪽 수문곡선은 별도의 관측 비교 예시이며 실제 결과가 아닙니다. |
| coupling | river-floodplain | 기능군 개념도: 하천–범람원 경계의 화살표는 월류와 복귀유량의 두 방향을 나타냅니다. 통제된 개발검증 범위의 교환 개념이며 실제 유역 결과가 아닙니다. |

## 46개 QA 표

각 PASS는 한글·영문 양쪽에 적용됩니다. 입력·처리·결과 열에는 실제 한국어 표시문구를 함께 기록했습니다. 원문 전체는 [site-content.json](../docs/assets/site-content.json)의 동일 id에 있습니다. 기술개요 열은 개별 개요의 첫 문장입니다.

| id | 기능명 (KO / EN) | 요약 | 입력·상태 | 처리·계산 | 결과·활용 | 기술 개요 | 개발·공개 상태 | 도식 | 결과·수정내역 |
|---|---|---|---|---|---|---|---|---|---|
| rain-spatial | PASS · 공간 강우 입력 / Spatial rainfall forcing | PASS · 기존 의미 유지 | PASS · 강우 시계열 | PASS · 공간 배분 | PASS · 격자 강우 | PASS · K-DRUM의 공간 강우 입력은 관측소 시계열 또는 레이더·격자 강우장을 계산격자의 강우로 연결합니다. | PASS · ESTABLISHED 유지 | PASS · 기능군 / rainfall-grid | PASS · 개별 개요·상태 설명 |
| rain-methods | PASS · Thiessen·IDW 강우배분 / Thiessen & IDW rainfall mapping | PASS · 기존 의미 유지 | PASS · 관측소 | PASS · Thiessen / IDW | PASS · 격자별 값 | PASS · Thiessen과 IDW는 강우관측소 자료를 계산격자에 배분하는 서로 다른 경로입니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 기능군 / rainfall-grid | PASS · 개별 개요·상태 설명 |
| rain-qc | PASS · 고도보정 IDW·강우 QC / Elevation-corrected IDW & rainfall QC | PASS · 기존 의미 유지 | PASS · 원강우 | PASS · 고도보정·QC | PASS · 검사된 강우 | PASS · 고도보정 IDW는 강우 공간배분에 고도보정과 자료 품질검사를 결합한 입력 처리 경로입니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| rain-summary | PASS · 강우 완전성 평가 / Rainfall completeness assessment | PASS · 기존 의미 유지 | PASS · 관측·예측·결측 기간 | PASS · 유형별 시간수 집계 | PASS · 강우자료 구성·누락 요약 | PASS · 강우 완전성 평가는 실행에 연결된 강우자료의 관측·예측·결측 기간을 집계합니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명, 3단계 교정 |
| input-precheck | PASS · 입력 사전점검·정합성 / Input precheck & consistency | PASS · 기존 의미 유지 | PASS · 입력자료 | PASS · 정합성 검사 | PASS · 실행 가능성 | PASS · 입력 사전점검은 모의 전에 입력자료의 공간·시간 범위, 연결성과 값의 범위를 검사하는 개발기능입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| ga | PASS · Green-Ampt 침투 / Green-Ampt infiltration | PASS · 기존 의미 유지 | PASS · 강우 | PASS · 습윤전선·침투 | PASS · 초과강우 | PASS · K-DRUM은 Green-Ampt 침투과정으로 강우의 토양 유입과 초과강우를 구분합니다. | PASS · ESTABLISHED 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| runoff | PASS · 지표·지표하 유출 / Surface & subsurface runoff | PASS · 기존 의미 유지 | PASS · 토양저류 | PASS · 지표/지표하 | PASS · 하천유입 | PASS · 지표·지표하 유출 과정은 격자 내 토양층 저장과 물의 유출 경로를 연결합니다. | PASS · ESTABLISHED 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| continuous | PASS · 연속·장기모의 / Continuous / long-term simulation | PASS · 기존 의미 유지 | PASS · 이전 상태 | PASS · 시간연속 계산 | PASS · 다음 상태 | PASS · 연속·장기모의는 개별 강우사상 사이에도 이전 계산의 저장상태를 다음 시점으로 이어갑니다. | PASS · ESTABLISHED 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| et | PASS · 증발산·토양수분 / Evapotranspiration & soil water | PASS · 기존 의미 유지 | PASS · 기상·토양 | PASS · ET 배분 | PASS · 저장량 변화 | PASS · 증발산 계산은 기상·토양 조건에 따른 증발산 수요를 토양층 저장과 뿌리분포에 연결합니다. | PASS · ESTABLISHED 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| snow | PASS · 적설·융설 / Snow accumulation & melt | PASS · 기존 의미 유지 | PASS · 강설·기온 | PASS · 적설저장/융설 | PASS · 유출기여 | PASS · 적설·융설 과정은 강설과 기온을 적설저장의 축적 및 융설에 연결합니다. | PASS · ESTABLISHED 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| warmup | PASS · 워밍업·초기상태 안정화 / Warm-up & initial-state stabilization | PASS · 기존 의미 유지 | PASS · 초기 토양·유출 상태와 목표유량 | PASS · 워밍업 반복·상태 조정 | PASS · 초기상태 안정화·목표오차 진단 | PASS · 워밍업은 초기 토양·유출 상태를 반복 조정하고 목표지점 유량과의 오차를 진단하는 초기화 과정입니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명, 3단계 교정 |
| hotstart | PASS · HotStart·상태 재시작 / HotStart & state restart | PASS · 기존 의미 유지 | PASS · 상태 저장 | PASS · 재시작 | PASS · 연속 계산 | PASS · HotStart는 체크포인트에 저장된 모형 상태를 읽어 계산을 재개하는 상태관리 기능입니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| dlayer | PASS · D층·지연 기저유출 / D-layer & delayed baseflow return | PASS · 기존 의미 유지 | PASS · 심부 저장 | PASS · 지연복류/손실 | PASS · 기저유출 | PASS · D층 확장은 심부 저장층의 수위와 저장량을 지연복류 및 손실에 연결합니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| slope-separate | PASS · 사면·하도 경사 개별 적용 / Separate hillslope & channel slopes | PASS · 기존 의미 유지 | PASS · 사면경사·하도경사 | PASS · 경로별 경사 적용 | PASS · 사면·하도 유출 전달 | PASS · K-DRUM은 사면 유출 경로와 하도 흐름 경로에 서로 다른 경사 변수를 적용합니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명, 3단계 교정 |
| kw-hill | PASS · 사면 운동파 추적 / Hillslope kinematic routing | PASS · 기존 의미 유지 | PASS · 초과유출 | PASS · 사면 운동파 | PASS · 하류 전달 | PASS · 사면 운동파 추적은 격자 사면에서 생성된 유출이 하류 격자로 이동하는 과정을 계산합니다. | PASS · ESTABLISHED 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| kw-river | PASS · 하도 운동파 추적 / Channel kinematic routing | PASS · 기존 의미 유지 | PASS · 측방유입 | PASS · 하도 추적 | PASS · 하류 유량 | PASS · 하도 운동파 추적은 측방유입을 포함해 하도에 집수된 유량을 하류로 전달합니다. | PASS · ESTABLISHED 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| river-infil | PASS · 하천 침투·심부저장 연계 / River infiltration to deeper storage | PASS · 기존 의미 유지 | PASS · 하천수 | PASS · 침투가능량·저장한계 | PASS · D층 저장 | PASS · 하천 침투 연계는 하천수가 D층으로 이동할 수 있는 양을 계산하는 개발기능입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| channelbed | PASS · 고해상도 지형·ChannelBed / High-resolution terrain & ChannelBed | PASS · 기존 의미 유지 | PASS · DEM·중심선 | PASS · 하상 보완 | PASS · 수리 지형 | PASS · ChannelBed는 DEM과 하천 중심선 등을 바탕으로 부족한 하상·저수로 형상을 보완하는 지형 지원도구입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| wb | PASS · 유역 물수지 평가 / Basin water-balance audit | PASS · 기존 의미 유지 | PASS · 강우·유입·증발산·유출·저장량 | PASS · 공통 범위 물수지 집계 | PASS · 폐합오차·내부 유량 평가 | PASS · 유역 물수지 평가는 같은 집계 범위의 강우·유입, 증발산·유출과 저장량 변화를 연결하여 폐합오차를 산정합니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 기능군 / read-results | PASS · 개별 개요·상태 설명, 3단계 교정 |
| wb-1d2d | PASS · 1D-2D 교환 물수지 / 1D-2D exchange water balance | PASS · 기존 의미 유지 | PASS · 영역 간 동일 교환유량 | PASS · 양 영역에 반대 부호로 반영 | PASS · 교환량 일관성 평가 | PASS · 1D-2D 교환 물수지는 동일한 교환유량을 하천과 범람원에 반대 부호로 반영하는 영역 간 회계를 평가합니다. | PASS · VALIDATED DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명, 3단계 교정 |
| run-report | PASS · 통합 실행 리포트 / Unified run reporting | PASS · 기존 의미 유지 | PASS · 실행정보 | PASS · 진단·물수지 | PASS · 최종 요약 | PASS · 통합 실행 리포트는 입력조건, 실행모드, 초기상태와 계산 과정의 진단을 하나의 요약에 모읍니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| subbasin-report | PASS · 소유역 리포팅 / Subbasin reporting | PASS · 기존 의미 유지 | PASS · 전체 유역 | PASS · 소유역 분해 | PASS · 지점·소유역 비교 | PASS · 소유역 리포팅은 전체 유역의 강우·유출·상태 결과를 소유역 단위로 구분하여 제공합니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| optimization | PASS · 목표지점 보정·최적화 / Target-point calibration & optimization | PASS · 기존 의미 유지 | PASS · 관측유량·범위 | PASS · 케이스 반복 | PASS · NSE·KGE·PBIAS 등 | PASS · 목표지점 보정은 관측유량과 매개변수 범위를 바탕으로 여러 계산 케이스를 비교합니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| subcal | PASS · 소유역·목표지점 평가/보정 지원 / Subbasin / target-point calibration workflow | PASS · 기존 의미 유지 | PASS · 소유역 진단 | PASS · 목표지점 보정 | PASS · 재검증 | PASS · 소유역·목표지점 보정 지원은 소유역 리포트의 진단과 목표지점 최적화 결과를 연결합니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| output-integrity | PASS · 출력 무결성·라이프사이클 / Output integrity & lifecycle | PASS · 기존 의미 유지 | PASS · 계산결과 | PASS · 무결성 점검 | PASS · 후처리 가능 | PASS · 출력 무결성 검사는 파일 생성과 종료, 정의된 결과 요건 및 실행 오류상태를 다룹니다. | PASS · IMPLEMENTED / QA 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| dwnet | PASS · 1D 동역학파 하천망 / 1D dynamic-wave river network | PASS · 기존 의미 유지 | PASS · 하천망·단면 | PASS · 동역학파 | PASS · Q·WL | PASS · 1D 동역학파 하천망 해석은 하천망과 횡단면 자료를 이용하여 수위와 유량을 계산하는 수리 확장입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| junction | PASS · 분기·합류 수리 / Branch & confluence hydraulics | PASS · 기존 의미 유지 | PASS · 분기·합류 연결과 구간 수리상태 | PASS · 연속방정식·수리조건 연계 | PASS · 연결 구간의 수위·유량 계산 | PASS · 분기·합류 수리는 지류와 본류가 만나는 하천망 연결점의 흐름을 다룹니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명, 3단계 교정 |
| structures | PASS · 수리구조물 / Hydraulic structures | PASS · 기존 의미 유지 | PASS · 수위·제원 | PASS · 구조물 유량 | PASS · 상·하류 반영 | PASS · 수리구조물 연계는 수위와 구조물 제원을 이용해 게이트·월류 등의 유량을 계산하는 개발기능입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| dam-operation | PASS · 댐·저수지 운영 / Dam / reservoir operation | PASS · 기존 의미 유지 | PASS · 유입·수위 | PASS · 운영규칙 | PASS · 방류·저류 | PASS · 댐·저수지 운영 계산은 유입과 수위를 운영규칙 및 방류제약에 연결하여 방류와 저류를 구성합니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| dam-forecast | PASS · 예측·사전방류·하류제어 / Forecast, pre-release & downstream control | PASS · 기존 의미 유지 | PASS · 예측유입 | PASS · 사전방류 판단 | PASS · 하류 영향 | PASS · 예측 운영지원은 예측 유입과 하류 제약조건을 함께 반영하여 사전방류와 하류영향을 평가하는 개발기능입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| dam-scenario | PASS · 다중댐·시나리오·재운영 / Multi-dam scenarios & reoperation | PASS · 기존 의미 유지 | PASS · 댐망 | PASS · 시나리오 비교 | PASS · 운영대안 평가 | PASS · 다중댐 시나리오 평가는 댐망 유입과 운영 대안을 목적지표에 따라 비교합니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| coupling | PASS · 양방향 1D-2D 연계 / Bidirectional 1D-2D coupling | PASS · 기존 의미 유지 | PASS · 1D 하천·2D 범람원 상태 | PASS · 동일 경계의 월류·복귀유량 계산 | PASS · 두 영역의 양방향 교환 반영 | PASS · 양방향 1D-2D 연계는 동일한 하천–범람원 경계에서 월류와 복귀유량을 계산합니다. | PASS · VALIDATED DEVELOPMENT 유지 | PASS · 기능군 / river-floodplain | PASS · 개별 개요·상태 설명, 3단계 교정 |
| local-inertia | PASS · 2D Local-Inertia 범람 / 2D Local-Inertia floodplain | PASS · 기존 의미 유지 | PASS · DEM·경계 | PASS · 2D 계산 | PASS · 침수심·유속 | PASS · Local Inertia 경로는 지형과 경계조건을 바탕으로 격자별 수심과 단위폭 유량을 계산하는 2D 수리 개발기능입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| fullswe | PASS · Full SWE 해석 / Full shallow-water equations | PASS · 기존 의미 유지 | PASS · 고해상도 영역 | PASS · Full SWE | PASS · 유속·수면 | PASS · Full SWE는 급변류 등 운동량을 더 완전하게 표현할 필요가 있는 구간을 위한 2D 개발 옵션입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| multires | PASS · 다중해상도·Patch 2D / Multi-resolution / patch 2D | PASS · 기존 의미 유지 | PASS · 기본격자 | PASS · 고해상도 Patch | PASS · 결과 통합 | PASS · 다중해상도 2D 해석은 기본격자와 관심구간의 고해상도 Patch를 함께 구성합니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| flood-extras | PASS · 2D 강우·배수·구조물·Tracer / 2D rainfall, drainage, structures & tracer | PASS · 기존 의미 유지 | PASS · 외력·구조물 | PASS · 2D 상호작용 | PASS · 분석 레이어 | PASS · 2D 확장은 범람원 흐름에 직접강우·배수·구조물 작용과 입자·물질추적을 결합합니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| sed-hill | PASS · 사면 유사·침식/퇴적 / Hillslope sediment / erosion-deposition | PASS · 기존 의미 유지 | PASS · 침식원 | PASS · 운반능 | PASS · 유사유출 | PASS · 사면 유사 연구기능은 경사·유속·토양조건을 침식원과 운반능에 연결하여 침식·운반·퇴적을 계산합니다. | PASS · RESEARCH FUNCTION 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| sed-river | PASS · 하천 유사이송 / River sediment transport | PASS · 기존 의미 유지 | PASS · 상류 유사 | PASS · 하도 운반능 | PASS · 이송·퇴적 | PASS · 하천 유사이송은 유입 유사와 하도 경사·유량·횡단면에 따른 운반능을 이용하는 연구기능입니다. | PASS · RESEARCH FUNCTION 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| dye | PASS · 염료·보존성 추적자 / Dye / conservative tracer | PASS · 기존 의미 유지 | PASS · 추적자 주입 | PASS · 질량이송 | PASS · 농도곡선 | PASS · 보존성 추적자는 주입질량, 하천 구간의 저장량과 상·하류 유량을 이용하여 농도와 질량의 이동을 계산합니다. | PASS · RESEARCH FUNCTION 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| wq | PASS · 수질 과정 모듈 / Water-quality process module | PASS · 기존 의미 유지 | PASS · 질소·인·BOD 등 과거 수질코드 | PASS · 현재 활성 빌드에서 비활성 | PASS · 현재 수질 계산·출력 기능으로 제공되지 않음 | PASS · 수질 과정 모듈은 질소·인·BOD 등 과거 수질계산 코드의 존속 상태를 설명하는 항목입니다. | PASS · DISABLED / REDEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명, 3단계 교정 |
| parallel | PASS · ST·OpenMP·MPI 병렬계산 / ST, OpenMP & MPI execution | PASS · 기존 의미 유지 | PASS · 동일 입력 | PASS · ST/OMP/MPI | PASS · 결과 정합성 | PASS · K-DRUM의 실행 체계는 단일 실행과 OpenMP 공유메모리, MPI 분산메모리 경로를 포함합니다. | PASS · ESTABLISHED / MODERNIZING 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| netcdf | PASS · NetCDF 통합출력 / NetCDF integrated output | PASS · 기존 의미 유지 | PASS · 계산상태 | PASS · NetCDF | PASS · 분석도구 | PASS · NetCDF 통합출력은 수문·수리 계산상태를 공통 시간·좌표·변수 구조의 결과자료로 구성합니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| viewer | PASS · FloodViewer / FloodViewer | PASS · 기존 의미 유지 | PASS · NetCDF | PASS · 지도·시계열 | PASS · 비교·분석 | PASS · FloodViewer는 NetCDF 결과를 지도와 시계열로 구성하여 공간분포·침수심·유속 등을 분석하는 프로그램입니다. | PASS · RELEASE CANDIDATE 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| inputstudio | PASS · InputStudio / InputStudio | PASS · 기존 의미 유지 | PASS · 원자료 | PASS · 프로젝트 편집·QA | PASS · 엔진 입력 | PASS · InputStudio는 지형·강우·하천·횡단면·구조물·모의조건을 프로젝트 단위로 작성하고 검사하는 개발도구입니다. | PASS · ACTIVE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| estuary | PASS · Estuary2DV / Estuary2DV | PASS · 기존 의미 유지 | PASS · 상류·조위 | PASS · x-z 수동역학 | PASS · 염분·성층 | PASS · Estuary2DV는 상류와 조위 조건을 이용해 하구의 종·연직 방향 수동역학과 염분거동을 연구하는 별도 모형입니다. | PASS · EXPERIMENTAL 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |
| river-viewer | PASS · 1차원 하천수리 결과 뷰어 / 1D River Hydraulics Results Viewer | PASS · 기존 의미 유지 | PASS · 1D 계산 결과 | PASS · 단면·시계열 분석 | PASS · 결과 분석 | PASS · 1차원 하천수리 결과 뷰어는 1D 계산 결과의 종단면·횡단면과 수위·유량 시계열을 조회·분석하는 별도 프로그램입니다. | PASS · SEPARATE DEVELOPMENT 유지 | PASS · 생략 | PASS · 개별 개요·상태 설명 |

## 대표 수정 전후

이전 개요는 같은 기능군의 모든 항목에 반복되던 설명입니다. 아래 이후 열은 바뀐 개요의 핵심을 발췌했습니다.

| 기능 | 수정 전 | 수정 후 |
|---|---|---|
| HotStart·상태 재시작 | 격자 저장 갱신·강우·침투·증발산·유출 공통 개요 + grid-water-cycle | HotStart는 체크포인트에 저장된 모형 상태를 읽어 계산을 재개하는 상태관리 기능입니다. 도식 생략. |
| 적설·융설 | 격자 물순환 공통 개요 + grid-water-cycle | 적설·융설 과정은 강설과 기온을 적설저장의 축적 및 융설에 연결합니다. 도식 생략. |
| 증발산·토양수분 | 격자 물순환 공통 개요 + grid-water-cycle | 증발산 계산은 기상·토양 조건에 따른 증발산 수요를 토양층 저장과 뿌리분포에 연결합니다. 도식 생략. |
| Green-Ampt 침투 | 격자 물순환 공통 개요 + grid-water-cycle | K-DRUM은 Green-Ampt 침투과정으로 강우의 토양 유입과 초과강우를 구분합니다. 도식 생략. |
| 워밍업·초기상태 안정화 | 격자 물순환 공통 개요 + grid-water-cycle | 워밍업은 초기 토양·유출 상태를 반복 조정하고 목표지점 유량과의 오차를 진단하는 초기화 과정입니다. 도식 생략. |
| 1D 동역학파 하천망 | 하천 단면·연결·경계의 공통 개요 + 범람원 교환도 | 1D 동역학파 하천망 해석은 하천망과 횡단면 자료를 이용하여 수위와 유량을 계산하는 수리 확장입니다. 도식 생략. |
| 2D Local-Inertia 범람 | 하천–범람원 교환 평가 공통 개요 + 교환도 | Local Inertia 경로는 지형과 경계조건을 바탕으로 격자별 수심과 단위폭 유량을 계산하는 2D 수리 개발기능입니다. 도식 생략. |
| 댐·저수지 운영 | 하천 수리 공통 개요 + 범람원 교환도 | 댐·저수지 운영 계산은 유입과 수위를 운영규칙 및 방류제약에 연결하여 방류와 저류를 구성합니다. 도식 생략. |
| 사면 유사·침식/퇴적 | 물·물질 수송과 비활성 수질의 공통 경계 설명 | 사면 유사 연구기능은 경사·유속·토양조건을 침식원과 운반능에 연결하여 침식·운반·퇴적을 계산합니다. 도식 생략. |
| 염료·보존성 추적자 | 물·물질 수송과 비활성 수질의 공통 경계 설명 | 보존성 추적자는 주입질량, 하천 구간의 저장량과 상·하류 유량을 이용하여 농도와 질량의 이동을 계산합니다. 도식 생략. |
| NetCDF 통합출력 | 입력 작성·계산·출력·분석 공통 개요 + 프로그램 관계도 | NetCDF 통합출력은 수문·수리 계산상태를 공통 시간·좌표·변수 구조의 결과자료로 구성합니다. 도식 생략. |
| InputStudio | 프로그램 공통 개요 + 프로그램 관계도 | InputStudio는 지형·강우·하천·횡단면·구조물·모의조건을 프로젝트 단위로 작성하고 검사하는 개발도구입니다. 도식 생략. |
| FloodViewer | 프로그램 공통 개요 + 프로그램 관계도 | FloodViewer는 NetCDF 결과를 지도와 시계열로 구성하여 공간분포·침수심·유속 등을 분석하는 프로그램입니다. 도식 생략. |

HotStart 영문 개요 전체:

> HotStart is a state-management function that reads model states saved at a checkpoint and resumes computation. Consistency controls connect the saved state and restart conditions so that subsequent simulation continues from the earlier calculation state. Its scope is state storage, restoration and restart, distinct from iterative initial-state stabilization through warm-up.

## 실제 렌더링과 재현

- Chrome headless에서 46개 × 한영 × 390/1440px = **184회** 상세를 직접 펼쳐 제목·요약·입력·처리·결과·개요·상태·도식을 대조했습니다. 각 행의 화면 잘림, 가로 넘침 및 해당 도식의 확대·닫기·캡션도 검사했습니다.
- 184개 전체 상세 캡처를 생성했습니다. 기본 검사 viewport 높이는 1000px이며, 긴 상세 캡처 시에만 높이를 카드 높이 + 240px까지 늘려 sticky navigation이 제목을 가리는 캡처 현상을 방지합니다. 페이지 내용을 숨기거나 CSS를 교체하지 않습니다.
- Codex는 데스크톱 한영 92개 캡처의 contact sheet를 모두 시각 대조했습니다. 필수 대표 13개 항목은 아래 파일명으로 390/1440px 한영 캡처가 모두 제공됩니다.
- 기존 홈페이지 회귀: 한영 × 320/390/768/1440px, 검색·분야 필터·46개 열기/닫기·키보드·확대·앵커·canonical·대비·200% reflow PASS. JavaScript 비활성 한영 및 FAQ 검사 PASS.
- 새 내용 계약은 개별 필드 누락/빈 값, 중복 개요, 잘못된 도식 연결을 거부합니다. 5개 오류 주입 대조 검사를 통과했고, 정적 감사는 기능 상세의 공통 domain fallback도 차단합니다. 의미의 정확성은 자동 검사와 별도로 위 공개 근거에 대조했습니다.

CI의 **Homepage browser smoke** artifact에서 `capability-details/results.json`과 `capability-details/{ko|en}-{390|1440}-{id}.png`를 확인할 수 있습니다. 필수 대표 id: `hotstart`, `snow`, `et`, `ga`, `warmup`, `dwnet`, `local-inertia`, `dam-operation`, `sed-hill`, `dye`, `netcdf`, `inputstudio`, `viewer`.

재현 명령(서버와 Playwright 설치 후):

```sh
node .github/scripts/capability-contract.cjs
node .github/scripts/build-site.cjs
node .github/scripts/site-static-audit.cjs
BASE_URL=http://127.0.0.1:8000/KDRUM-Public node .github/scripts/capability-detail-audit.cjs
BASE_URL=http://127.0.0.1:8000/KDRUM-Public node .github/scripts/site-audit.cjs
```

## 보존 범위

이번 후속 변경에서 p18 JPEG·PDF·MP4·대표 PNG, media 데이터, CSS·브라우저 runtime, SEO 메타데이터, 연구사례·FAQ 및 기술 상태 근거 문서는 변경하지 않았습니다. 기존 p18 4–21쪽 매핑, 16:9 비율과 노트북 타이포그래피 보완은 유지됩니다. PR #50은 Draft이며 실제 Pages 배포와는 구분됩니다.
