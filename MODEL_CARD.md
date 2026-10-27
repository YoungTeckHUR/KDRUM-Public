# K-DRUM Model Card — Current technical summary

**검토일 / Reviewed: 2026-10-28**

1D 하천망 수리, 분기·합류, 2D 국부관성 범람과 양방향 1D–2D 연계는 **개발 완료** 기능입니다. Full SWE는 지원하는 격자·경계·연계 조건에 맞춰 사용하는 **개발 완료·선택 적용** 기능입니다. 기능 개선이나 새로운 유역 검증이 계속된다는 이유로 완료된 기능을 개발 중으로 되돌리지 않습니다.

**1D river-network hydraulics, junctions, 2D local-inertial inundation and two-way 1D–2D exchange are development-complete.** Full SWE is complete for supported configurations. Continued refinement and basin-specific evaluation do not change implementation completion into an unfinished capability.

구현 완료, 유역별 적용·관측 검증, 공식 배포는 별개의 정보입니다. 개발 완료는 모든 유역의 무조건적 정확도 인증이나 모든 공식 배포본에 포함되었다는 뜻이 아닙니다. 공식 설치파일·이용조건은 [MyWater K-Series](https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list)에서 확인합니다.

Implementation completion, application/observation-based validation and official distribution are distinct. Consult MyWater for actual package versions and terms; do not infer universal accuracy or distribution from implementation alone.

## Identity / 모형 구성

K-DRUM: **K-water Distributed Rainfall-runoff Model**. 물리적 기반의 격자단위 분포형 강우유출을 하천망 수리 및 범람원 해석으로 연결합니다. / A physically based grid-distributed rainfall–runoff model connected to river-network and floodplain hydraulics.

## Main methods / 주요 방법론

Grid rainfall (station IDW and gridded/radar inputs), Green–Ampt infiltration, A/B/C/D storage and runoff, moisture-limited ET, snow accumulation/melt and kinematic routing form the hydrological foundation. Current 1D hydraulics distinguishes local-inertial and dynamic-wave paths. The dynamic-wave path uses conservative finite-volume fluxes, cross-section geometry and implicit Backward Euler/TR-BDF2 with nonlinear iteration. 2D local inertia uses previous face flow, surface-gradient forcing and semi-implicit friction; Full SWE includes advective momentum for supported configurations. Shared accepted exchange volumes connect river and floodplain balances.

## Data and results / 자료와 결과

Terrain, land cover, soil/depth, forcing and initial states define the hydrological project. Sections, boundaries, roughness, structures and exchange geometry define hydraulic applications. Outputs include discharge, stage, water storage, water-balance residuals, depth/velocity/inundation and NetCDF/time-series datasets. Coordinate, timestamp, domain and unit consistency are required when comparing products.

## Tools and research / 도구·연구 구분

Existing InputStudio prepares model inputs; new K-DRUM Studio is separate integrated project/control/run/analysis development. FloodViewer and 1D Viewer have their own release readiness. Sediment/tracer functions remain research-specific, water-quality processes are disabled/redevelopment, and Estuary2DV is an independent experimental x-z model.

## Distribution / 배포

This public repository shares technical descriptions, not production source or executables. Use [MyWater K-Series](https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list) and its [terms](https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127). See [current capability scope](DEVELOPMENT_STATUS.md), [methods](TECHNICAL_METHODS.md) and [research references](PUBLICATIONS.md).
