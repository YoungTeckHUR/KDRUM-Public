# K-DRUM Capabilities

This page summarizes the public-facing K-DRUM capability families. The detailed inventory is maintained in [CAPABILITY_ATLAS.md](CAPABILITY_ATLAS.md), and maturity labels are maintained in [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md).

K-DRUM은 K-water가 개발한 **물리적 기반의 격자단위 분포형 강우유출모형**입니다. 이 문서는 강우유출, 하천수리, 홍수범람, 물수지, 매개변수 보정, 유사·물질추적 및 지원 프로그램을 수자원·토목 분야에서 일반적으로 사용하는 용어를 중심으로 정리합니다.

The public description deliberately separates established, implemented/verified, active-development, validated-development, research, and disabled/redevelopment functions. The existence of a calculation path does not by itself mean universal production readiness.

## 1. Rainfall input and quality control

- spatially distributed rainfall input
- Thiessen-polygon and inverse-distance-weighted (IDW) rainfall distribution
- elevation-corrected IDW rainfall distribution
- rainfall-data quality checks
- rainfall completeness / missing-data assessment
- input-data precheck and project-level consistency assessment

## 2. Watershed hydrology and continuous state

Established distributed rainfall-runoff foundations include:

- Green-Ampt infiltration
- surface and subsurface runoff
- kinematic-wave hillslope runoff routing
- continuous / long-term runoff simulation
- evapotranspiration and soil-water accounting
- snow accumulation and snowmelt

Current state-management and long-term extensions include:

- warm-up / initial-state stabilization and target-flow diagnostics
- HotStart / state restart and checkpoint continuity
- deeper-storage-layer (D-layer) / delayed baseflow-return development

Snowmelt includes empirical slope, D8-direction and time-of-day adjustment of the melt factor; it does not directly solve radiation energy balance or slope snow transport. HotStart state coverage depends on the selected calculation path. D-layer delayed return feeds an upper soil-layer pathway, while deep loss requires its separate option.

## 3. Routing and river terrain

Publicly describable capabilities include:

- separate hillslope and channel slope representations
- established kinematic-wave channel discharge routing
- river infiltration / exchange with deeper storage
- cross-section and river-geometry preparation
- high-resolution terrain processing and ChannelBed development

## 4. Water balance, calibration and result QA

Current Core verification and analysis development includes:

- basin water-balance assessment
- one-dimensional/two-dimensional exchange water balance
- consolidated run-result reporting
- subbasin result reporting
- result-output integrity checks
- target-point parameter calibration / optimization metrics
- combined subbasin diagnosis and target-point calibration support

Basin water balance is treated as a system-level accounting function, not only as a single closure number: rainfall, evapotranspiration, runoff, storage changes and internal transfers must be interpreted over consistent periods and units.

The optimization path supports observation-based case comparison and multiple performance measures. Public wording does **not** describe this as universal automatic parameter calibration of every subbasin.

## 5. One-dimensional river hydraulics, structures and dam operation

Current hydraulic development includes:

- cross-section-based one-dimensional dynamic-wave river-network analysis
- branch / confluence river hydraulics
- hydraulic structures
- dam / reservoir operation rules and release-component handling
- forecast, pre-release and downstream-control development
- multi-dam operation-scenario evaluation and reoperation studies

Operational reservoir rules, restricted data and actual operating decisions are not published by this repository.

## 6. One-dimensional/two-dimensional coupling and floodplain analysis

Current development includes:

- bidirectional river-floodplain exchange between one-dimensional and two-dimensional domains
- two-dimensional Local Inertia flood-inundation calculation
- full shallow-water-equation option
- multi-resolution / locally refined two-dimensional domains
- direct rainfall, drainage and hydraulic-structure interaction
- two-dimensional particle / material-tracking analysis support

The one-dimensional/two-dimensional exchange path has a **validated-development** boundary from controlled testing; this is not universal basin certification.

One-way transfer, diagnostic and two-way feedback paths must be distinguished for each run. Multi-resolution patches retain source-terrain resolution against a grouped, coarser background; they do not create finer terrain information than the input.

## 7. Research and extension functions

The current code base retains research calculation paths for:

- hillslope sediment generation, erosion and deposition
- river sediment transport and deposition
- river dye / conservative material tracking

These are presented as research functions pending dedicated public validation documentation.

Historical/research water-quality process code also exists, but it is explicitly disabled/excluded from the current active build. It is therefore shown only as a redevelopment candidate, not as a current production capability.

Estuary2DV is also placed in this research/extension context: it is a separate experimental longitudinal–vertical estuary hydrodynamics/salinity model, not a standard K-DRUM Core production function.

## 8. Input, runtime and result tools

The wider K-DRUM environment includes:

- serial, OpenMP and MPI execution tracks
- NetCDF-based integrated result output
- InputStudio project authoring and input-data checks
- FloodViewer map/time-series result analysis
- **1D River Hydraulics Results Viewer** — a separate program for longitudinal/cross-section results and water-level/discharge time series; under development and **not yet published to the public GitHub repositories**

MPI has a public K-DRUM research lineage, while current serial/OpenMP/MPI consistency and runtime modernization remain active verification topics.

Watershed-grid and flood output files may have different meshes and timestamps. FloodViewer reads plan-view results; the experimental width-averaged, hydrostatic Estuary2DV x-z model has a separate result and viewer contract.

## MyWater K-Series public access

MyWater lists K-DRUM in K-water's K-Series technical-software program as a physically based, grid-unit distributed model for rainfall-runoff analysis. MyWater also states that K-Series software made available on the website may be used free of charge by individuals outside K-water subject to the published terms of use.

K-DRUM은 **K-water 기술 SW 대국민 개방정책에 따라 MyWater 물정보포털 K-Series에서 무료로 내려받아 사용할 수 있습니다.** 다운로드 버전과 사용조건은 MyWater에 게시된 최신 안내 및 이용약관을 확인해야 합니다.

- MyWater K-Series: https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list
- K-Series technical-software terms: https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127

## Public interpretation boundary

For detailed status and interpretation, use:

- [Capability Atlas](CAPABILITY_ATLAS.md)
- [Development Status](DEVELOPMENT_STATUS.md)
- [Model Card](MODEL_CARD.md)
- [Publications and Research](PUBLICATIONS.md)

This repository does not publish production source code, restricted basin inputs, unpublished numerical tuning, operational reservoir rules, private validation datasets, or internal development identifiers.
