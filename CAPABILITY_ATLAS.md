# K-DRUM Public Capability Reference

**Reviewed: 2026-08-21**

K-DRUM은 K-water가 개발한 **물리적 기반의 격자단위 분포형 강우유출모형**입니다. 이 문서는 공개 가능한 K-DRUM 기능을 수자원·토목 분야에서 일반적으로 사용하는 용어를 중심으로 정리합니다. 코드가 존재한다는 사실만으로 실무 적용성이 확정된 것으로 보지 않으며, 각 기능의 개발·검증 상태는 [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md)와 함께 해석해야 합니다.

The public website currently presents **45 repository-tracked capabilities** in eight groups. A separate **1D River Hydraulics Results Viewer** also exists in development, but it is not yet published to the public GitHub repositories and is therefore listed separately rather than counted among the 45 repository-tracked items.

## Public status vocabulary

- **ESTABLISHED** — supported by the historical/public K-DRUM model lineage and/or published applications.
- **IMPLEMENTED / QA** — implemented in the current Core and subject to verification, reporting, or regression checks.
- **ACTIVE DEVELOPMENT** — integrated development capability whose scope, robustness, or workflow is still being strengthened.
- **VALIDATED DEVELOPMENT** — demonstrated in controlled development validation without claiming universal certification.
- **RESEARCH FUNCTION** — available for research use; application boundaries require explicit review.
- **RELEASE CANDIDATE** — near-release application component, not yet represented as a final public release.
- **EXPERIMENTAL** — independent research prototype or exploratory extension.
- **DISABLED / REDEVELOPMENT CANDIDATE** — historical/research code exists but the current active build does not present it as an active capability.

## 1. 강우자료·입력자료 품질관리

| 기능 | 공개 상태 | 설명 |
|---|---|---|
| 공간분포 강우 입력자료 | **ESTABLISHED** | 관측소·레이더·격자 강우를 계산 격자에 공간적으로 적용 |
| 티센망·역거리가중(IDW) 강우 공간분포 | **IMPLEMENTED / QA** | 강우관측소 자료의 격자단위 공간분포 산정 |
| 고도보정 IDW·강우자료 품질검사 | **IMPLEMENTED / QA** | 고도보정과 강우자료 품질검사를 결합한 입력자료 처리 |
| 강우자료 완전성·결측 평가 | **IMPLEMENTED / QA** | 관측·예측·결측 자료의 구성과 누락 상태를 결과보고에서 확인 |
| 입력자료 사전검사·정합성 점검 | **ACTIVE DEVELOPMENT** | 공간·시간·연결성·입력범위 오류를 모의 전에 점검 |

## 2. 유역 수문·연속모의

| 기능 | 공개 상태 | 설명 |
|---|---|---|
| Green-Ampt 침투 | **ESTABLISHED** | 강우의 토양침투와 초과강우 산정 |
| 지표·지표하 유출 | **ESTABLISHED** | 토양층 저장과 지표 및 지표하 유출 계산 |
| 연속유출·장기모의 | **ESTABLISHED** | 사상 사이의 상태를 연속하여 계절·장기 유출과 물수지를 계산 |
| 증발산·토양수분 | **ESTABLISHED** | 증발산과 토양수분 저장을 연속 물수지에 반영 |
| 적설·융설 | **ESTABLISHED** | 적설저장과 융설을 장기 유역수문 상태에 반영 |
| 워밍업·초기상태 안정화 | **IMPLEMENTED / QA** | 초기 토양·유출 상태와 목표지점 유량의 수렴상태를 진단 |
| HotStart(상태 재시작) | **IMPLEMENTED / QA** | 저장된 상태를 이용한 계산 재시작 및 연속모의 지원 |
| 심부저류층(D층)·지연 기저유출 | **ACTIVE DEVELOPMENT** | 심부저류, 지연복류 및 손실을 이용한 장기 저유량·기저유출 표현 |

## 3. 사면·하도·지형

| 기능 | 공개 상태 | 설명 |
|---|---|---|
| 사면·하도 경사 개별 적용 | **IMPLEMENTED / QA** | 사면 유출과 하도 흐름에 서로 다른 경사값을 적용 |
| 사면 운동파 유출추적 | **ESTABLISHED** | 격자 사면에서 발생한 유출을 운동파 방법으로 하류에 전달 |
| 하도 운동파 유량추적 | **ESTABLISHED** | 하도 길이·폭·경사·조도를 이용한 하천 유량추적 |
| 하천 침투·심부저류층 연계 | **ACTIVE DEVELOPMENT** | 하천수의 심부저류층 이동량을 침투가능량과 저장여유를 고려해 산정 |
| 고해상도 지형·ChannelBed | **ACTIVE DEVELOPMENT** | DEM만으로 부족한 하상·저수로 형상을 보완하여 수리해석용 지형자료를 작성 |

## 4. 물수지·매개변수 보정·결과보고

| 기능 | 공개 상태 | 설명 |
|---|---|---|
| 유역 물수지 평가 | **IMPLEMENTED / QA** | 강우·증발산·유출·저장량 변화 및 내부 유량을 종합하여 물수지 폐합오차를 평가 |
| 1차원–2차원 교환 물수지 | **VALIDATED DEVELOPMENT** | 하천과 홍수터 사이의 동일 교환유량을 양 영역에 반대 부호로 반영하여 질량보존을 점검 |
| 통합 실행결과 보고 | **IMPLEMENTED / QA** | 입력조건, 실행모드, 초기상태, 물수지, 경고 및 계산시간을 통합 보고 |
| 소유역별 결과보고 | **IMPLEMENTED / QA** | 전체 유역 결과를 소유역 단위로 분리하여 비교·검토 |
| 목표지점 매개변수 보정·최적화 | **ACTIVE DEVELOPMENT** | 관측유량과 여러 매개변수 조합을 NSE, KGE, PBIAS, RMSE 등으로 비교 |
| 소유역·목표지점 평가 및 보정 지원 | **ACTIVE DEVELOPMENT** | 소유역 결과보고와 목표지점 최적화를 결합한 유역별 보정 의사결정 지원; 모든 소유역의 자동 보정을 의미하지 않음 |
| 결과출력 무결성 점검 | **IMPLEMENTED / QA** | 출력파일 생성·종료·결과계약 및 후처리 가능 여부를 실행과정에서 점검 |

## 5. 하천수리·수리구조물·댐 운영

| 기능 | 공개 상태 | 설명 |
|---|---|---|
| 1차원 동역학파 하천망 해석 | **ACTIVE DEVELOPMENT** | 횡단면 기반 수위·유량과 하천망 흐름을 동역학파로 해석 |
| 분기·합류부 하천수리 | **ACTIVE DEVELOPMENT** | 하천망 연결부에서 연속방정식과 수리조건을 일관되게 처리 |
| 수리구조물 | **ACTIVE DEVELOPMENT** | 게이트·월류 등 수리구조물의 유량을 하천 및 2차원 해석과 연계 |
| 댐·저수지 운영 | **ACTIVE DEVELOPMENT** | 수위, 방류제약, 환경유량, 방류변화율 등을 고려한 운영규칙 및 방류계산 |
| 예측·사전방류·하류제어 | **ACTIVE DEVELOPMENT** | 예측유입과 하류 제약조건을 고려한 사전방류 및 하류영향 검토 |
| 다중댐 운영 시나리오·재운영 | **ACTIVE DEVELOPMENT** | 댐군 운영 시나리오와 목적지표를 비교하여 재운영 대안을 평가 |

실제 댐 운영규칙, 제한자료 및 운영 의사결정 정보는 이 공개 저장소에 게시하지 않습니다.

## 6. 1차원–2차원 연계·홍수범람

| 기능 | 공개 상태 | 설명 |
|---|---|---|
| 1차원–2차원 양방향 연계 | **VALIDATED DEVELOPMENT** | 하천과 홍수터 사이의 월류 및 복귀유량을 양방향으로 계산 |
| Local Inertia 근사 2차원 홍수범람해석 | **ACTIVE DEVELOPMENT** | 효율적인 2차원 홍수범람 계산을 위한 주 개발경로 |
| 완전 천수방정식(Full SWE) 해석 | **ACTIVE DEVELOPMENT** | 급변류 등 운동량항을 보다 완전하게 고려해야 하는 구간의 특수 해석경로 |
| 다중해상도·국부 고해상도 2차원 해석 | **ACTIVE DEVELOPMENT** | 관심구간을 더 세밀한 계산격자로 구성하여 국부 해상도를 향상 |
| 2차원 직접강우·배수·수리구조물·물질추적 | **ACTIVE DEVELOPMENT** | 직접강우, 배수, 구조물 및 물질추적 기능을 홍수범람해석과 연계 |

## 7. 유사·물질추적·수질

| 기능 | 공개 상태 | 설명 |
|---|---|---|
| 사면 유사·침식·퇴적 | **RESEARCH FUNCTION** | 사면 경사·유속·토양조건에 따른 침식, 운반 및 퇴적 계산 |
| 하천 유사이송·퇴적 | **RESEARCH FUNCTION** | 하도 경사·유량·횡단면과 유사 운반능을 고려한 이송·퇴적 계산 |
| 염료·보존성 물질추적 | **RESEARCH FUNCTION** | 하천구간 저장량, 유량 및 주입질량을 이용한 농도·질량 이동 추적 |
| 수질해석 모듈 | **DISABLED / REDEVELOPMENT CANDIDATE** | 질소·인·BOD 등 기존 수질계산 코드는 남아 있으나 현재 활성 빌드에서는 비활성 |

## 8. 병렬계산·결과출력·지원도구

| 기능 | 공개 상태 | 설명 |
|---|---|---|
| 단일 실행·OpenMP·MPI 병렬계산 | **ESTABLISHED / MODERNIZING** | 단일 실행, 공유메모리 및 분산메모리 실행경로의 결과정합성과 병렬효율을 검증 |
| NetCDF 통합 결과출력 | **ACTIVE DEVELOPMENT** | 수문·수리 결과를 공통 시간·좌표·변수 구조로 저장하여 결과분석 프로그램에 전달 |
| FloodViewer | **RELEASE CANDIDATE** | 공간분포·시계열·침수심·유속 등 수문·수리 계산결과를 통합 분석 |
| InputStudio | **ACTIVE DEVELOPMENT** | 지형, 강우, 하천, 횡단면, 수리구조물과 모의조건을 프로젝트 단위로 작성·점검 |
| Estuary2DV | **EXPERIMENTAL** | 하구 종·연직 2차원 수동역학과 염분거동 해석을 위한 별도 연구용 모형 |

### 별도 개발 중인 결과분석 프로그램

- **1차원 하천수리 결과 뷰어** — 하천 종단·횡단면, 수위·유량 시계열 등 1차원 하천수리 계산결과를 조회·분석하는 별도 프로그램입니다. 현재 개발 중이며 **공개 GitHub 저장소에는 아직 등록하지 않았습니다.**

## MyWater K-Series

MyWater는 K-DRUM을 강우 유출해석을 위한 K-Series 기술 SW로 소개하고 있으며, K-water가 웹사이트에서 제공하는 K-Series 소프트웨어는 게시된 이용약관에 따라 외부 사용자도 무료로 이용할 수 있다고 안내합니다.

K-DRUM은 **MyWater 물정보포털 K-Series에서 무료로 내려받아 사용할 수 있으며**, 다운로드 버전과 사용조건은 MyWater에 게시된 최신 안내와 이용약관을 확인해야 합니다.

- MyWater K-Series: https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list
- K-Series 기술 SW 이용안내: https://www.water.or.kr/kor/menu/sub.do?menuId=15_126

## Public boundary

This repository does not publish production source code, restricted basin inputs, operational reservoir rules, private validation datasets, internal development identifiers, or unpublished numerical implementation details.
