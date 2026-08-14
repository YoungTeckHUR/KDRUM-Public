# K-DRUM

**K-water Grid-based Distributed Rainfall rUnoff Model**

K-DRUM is K-water's physically based, grid-distributed hydrologic model for rainfall-runoff simulation. It has an established public research record and is currently maintained in a **v3.x** development line that extends the hydrologic core toward integrated river hydraulics, floodplain interaction, flood-inundation analysis, project authoring, and result visualization.

K-DRUM은 K-water가 개발해 온 물리적 기반의 격자형 분포형 강우-유출 모형입니다. 확립된 수문 핵심기능과 공개 연구성과를 기반으로, 현행 v3.x 체계에서는 하천 수리, 하천–범람원 연계, 범람해석, 입력자료 편집과 결과 시각화를 통합하는 방향으로 확장되고 있습니다.

- Public website: https://youngteckhur.github.io/KDRUM-Public/
- Korean page: https://youngteckhur.github.io/KDRUM-Public/ko/

## What K-DRUM is

K-DRUM represents watershed response on a spatial grid. Its established hydrologic foundation includes distributed rainfall-runoff processes, Green-Ampt infiltration, surface and subsurface runoff, evapotranspiration-related water balance, and kinematic-wave routing.

The model family has been applied in public research to flood simulation with radar/grid rainfall, parallel computation, long-term runoff and snowmelt, drought and water-balance analysis, surface-water/groundwater coupling, and recent wildfire/extreme-rainfall runoff studies.

## Established foundation

Public K-DRUM research supports the following high-level capabilities:

- physically based, grid-distributed rainfall-runoff simulation
- spatial rainfall forcing, including radar/grid rainfall applications
- Green-Ampt infiltration
- surface and subsurface runoff representation
- kinematic-wave flow routing
- long-term runoff and evapotranspiration-related water balance
- snow accumulation and snowmelt applications
- MPI-based parallel-computation lineage

## Current v3.x platform

The current generation builds on the established hydrologic core and organizes K-DRUM as a connected modeling platform:

- **K-DRUM Core** — distributed hydrology and current hydrologic-hydraulic simulation engine
- **K-DRUM InputStudio** — project configuration, time series, geometry, scenarios, consistency checks, and engine-input generation
- **K-DRUM FloodViewer** — integrated visualization of spatial and time-varying simulation results
- **K-DRUM ChannelBed** — reusable high-resolution terrain, river-geometry, and virtual channel-bed processing
- **K-DRUM Estuary2DV** — independent estuary hydrodynamics and salinity research prototype

Current hydraulic extensions include 1D dynamic-wave river-network hydraulics, branched and merged networks, bidirectional 1D-2D river-floodplain exchange, 2D flood-inundation analysis, hydraulic structures, and reservoir-operation scenarios. These components have different validation levels; see [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) for the public maturity boundary.

## Publicly documented application themes

The selected public record includes:

- flood simulation using spatial and radar rainfall
- parallel computation for distributed rainfall-runoff modeling
- long-term runoff, snow accumulation, and snowmelt
- drought and watershed water-balance analysis
- surface-water/groundwater model coupling
- wildfire and extreme-rainfall runoff response

See [PUBLICATIONS.md](PUBLICATIONS.md) for the selected bibliography.

## How to interpret this repository

This repository is a **public technical-information repository**, not a distribution of the production source code.

The homepage presents K-DRUM's established foundation, technical relevance, current platform, and public research evidence. Detailed readiness claims are kept separately in:

- [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md)
- [CAPABILITIES.md](CAPABILITIES.md)
- [MODEL_CARD.md](MODEL_CARD.md)
- [ROADMAP.md](ROADMAP.md)

Production source code, restricted model inputs, internal validation datasets, sensitive operational data, private diagnostics, and unpublished implementation details are not published here.

## Visual-material rule

Public images are limited to reviewed K-DRUM materials, independently created neutral technical diagrams, verified QR codes, and appropriately sourced official institutional assets. AI-generated or look-alike K-DRUM, K-water, or MyWater brand symbols are not used.

## Official context

K-DRUM is included in K-water's MyWater **K-Series** technical-software context.

- K-water MyWater K-Series: https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127
- K-water Research Institute: https://www.kwater.or.kr/kiwe/main.do

## Naming note

The current canonical expansion used by this public site is **K-water Grid-based Distributed Rainfall rUnoff Model**. Historical publications used several expanded English forms of the acronym; original publication titles and source wording are preserved rather than rewritten.

---

**Canonical model name:** K-DRUM  
**Current public baseline:** v3.x / August 2026
