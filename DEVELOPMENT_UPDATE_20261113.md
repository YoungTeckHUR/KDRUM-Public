# K-DRUM 최신 개발·검증 현황 / Development and validation update

**기준일 / As of: 2026-11-13 (KST)**

이 문서는 개발 저장소의 **반영된 소스**, **특정 조건의 시험 결과**, **공식 배포**를 구분한 공개 요약입니다. 모든 유역에 대한 정확도 검증, MyWater 공식 설치본의 최신 기능 포함, 사용자 환경에서의 Viewer 동작을 의미하지 않습니다. 수치·입력·사내 운영정보의 상세 기록은 공개하지 않습니다.

This is a public-level summary of **implemented source**, **condition-specific test evidence** and **official distribution**, which are distinct. It does not certify accuracy for all basins, inclusion in the MyWater installer or Viewer behavior on every user machine. Private inputs and operational diagnostics are not distributed here.

## 2026년 11월 주요 변경 / November development snapshot

| 구성요소 / Component | 구현·검증 확인 / Evidence reviewed | 공개 안내 / Public interpretation |
|---|---|---|
| **Core v3.0.5.18 (2026-11-12)** | 섬진강 335시간 연속 실행에서 운동파 유역 유출, 선택 1D 하천수리, 토양·하천수온 및 보존성 물질의 결합 실행을 확인. 지원 상태의 분할 재시작과 연속 실행 결과 일치도 비교. / A 335-hour Seomjin run exercised watershed routing, selected 1D hydraulics, soil/river temperature and conservative transport; supported restart cases were compared with uninterrupted execution. | **실행 완료와 물수지·관측 정확도는 별개.** 운영 보고서에는 물수지 경고(2.416%)가 남아 있으며 정확도 검증 완료로 표시하지 않음. / The operational report retained a **2.416% water-balance warning**; completion is not accuracy certification. |
| **계산 성능 / Performance** | 동일 Razer 환경의 4개 성능 코어·6시간 통제 비교에서 v3.0.5.17 대비 총 경과시간 중앙값 **30.7% 감소**를 기록. / A controlled six-hour, four-core Razer comparison recorded a **30.7% lower median elapsed time** against v3.0.5.17. | 특정 입력·장비·기능 조합의 기록이며 전체 유역·계산 방식의 일반적 속도향상 비율이 아님. / A case-specific comparison, not a general speed claim. |
| **토양온도·하천수온 / Soil and river temperature** | A/B/C/D 토양 열계산과 수문·1D 하천 열수송 기능이 Core 정본에 포함. 기상 민감도, 결합운영 및 재시작 관련 시험자료 확인. / Soil-layer heat and coupled hydrologic/1D river heat transport are present in canonical Core, with forcing-response, coupled-operation and restart evidence. | 관측 지온·수온과의 장기 정확도, Viewer 온도표시와 MyWater 포함 여부는 별도 확인. 직접 복사·결빙 과정은 현재 범위 밖. / Observed accuracy, Viewer rendering and official package inclusion are separate; direct radiation and freezing processes are excluded. |
| **보존성 Dye / Conservative tracer** | 선택한 하천망·결합 실행에서 보존성 추적물질 수송과 재시작 시험 확인. / Conservative river transport and restart tested in a selected coupled configuration. | 반응성 수질·토양/사면 전 구간 물질이동 또는 완전한 하상변동모형의 완료를 뜻하지 않으며 연구 기능으로 구분. / Does not imply complete reactive water quality, soil/slope transport or sediment morphodynamics; marked research scope. |
| **1D 하천 Viewer v3.5.2 / 1D river viewer** | 2026-11-10 정본에 공간지도·VWorld 관련 개선 및 Windows 포터블 배포 구성이 반영. / Canonical source includes spatial/VWorld improvements and Windows portable packaging. | 개발 완료·정식 배포 예정. 사용자 PC에서 모든 배경지도·측량 결과 호환성이 검증되었다는 뜻은 아님. / Development-complete, official distribution planned; user-environment compatibility remains to be checked. |
| **2D FloodViewer rc2.21** | 2026-11-10 정본에 지도 관련 개선과 Windows 패키징 후보 반영. / Basemap refinements and Windows packaging candidate in canonical source. | 공개 준비 중. 실제 위성·Hybrid 지도 표시와 사용자 환경 검증은 별개. / Release candidate; live satellite/hybrid map delivery remains environment-dependent. |
| **K-DRUM Studio P11.10.11-dev** | 프로젝트·실행 연결과 공간정보 범례, 실측단면–DEM 비교, 지도 캐시 처리 개선에 대한 자동검사·Windows 후보 빌드 확인. / Integrated workflow plus legend, surveyed-section/DEM comparison and map-cache improvements have candidate QA/build evidence. | **Draft PR 상태, 정본 미병합, 정식 배포 아님.** 기존 InputStudio와 혼동하지 않음. / **Draft, unmerged and unreleased**; not interchangeable with legacy InputStudio. |
| **Estuary2DV v0.1.1** | 2026-11-10 연구 소스 정본에 종단–연직 계산기 개선 반영. / Longitudinal–vertical research source promoted. | 실험 연구모형. 전체 실행파일 패키지 등록·사용자 실유역 정확도 확인과 구분. / Experimental research model; binary registration and user-basin accuracy are separate. |

## 기능 간 연결 / Connection among capabilities

유역 전 격자에서 기본 운동파 유출과 토양 열상태를 계산하고, 선택한 1D 하천수리 구간에서는 물과 함께 전달되는 현열·보존성 물질을 별도 보존항으로 다룹니다. 이는 **물리적 연결 구조에 대한 설명**이며, 모든 1D/2D 수리·구조물 조합의 동일한 검증 수준을 뜻하지 않습니다.

Watershed-scale kinematic routing and soil heat states provide inputs to selected 1D river hydraulic/transport sections. Heat and conservative mass are carried with water using their own budgets. This describes the intended coupling, not equal validation for every 1D/2D solver or structure configuration.

## 향후 확인 / Remaining checks

- 실제 관측 지온·수온·유량·수위 및 물수지 경고 원인에 대한 유역별 검증 / Basin-specific observation comparison and investigation of the reported balance warning
- Studio 후보의 정본 승격 여부 및 사용자 PC의 배경지도·뷰어·실행자료 호환성 / Studio promotion and live Viewer/Studio compatibility on user machines
- 보존성 물질 외 유사·사면 물질이동과 비활성 수질기능의 개발 범위 재평가 / Separate qualification of sediment, soil/slope constituents and inactive water-quality functionality
- 개발·시험용 v3.x와 **MyWater 공식 배포본**의 차이 유지 / Keep the development v3.x line separate from **official MyWater distribution**

**공식 배포 확인 / Official downloads:** [MyWater K-Series](https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list)  
**관련 문서 / Related documents:** [기능 및 적용 범위 / Capability scope](DEVELOPMENT_STATUS.md) · [수온 시험 / Thermal trials](THERMAL_VALIDATION.md) · [모형 소개 / Model card](MODEL_CARD.md)
