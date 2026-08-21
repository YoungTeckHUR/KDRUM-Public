# K-DRUM

**K-water Grid-based Distributed Rainfall rUnoff Model**

K-DRUM is K-water's physically based, grid-based distributed rainfall-runoff model. It has an established public research record and is currently maintained in a **v3.x** development line that extends rainfall-runoff simulation toward one-dimensional river hydraulics, river-floodplain interaction, two-dimensional flood-inundation analysis, project authoring, and result visualization.

K-DRUM은 K-water가 개발해 온 **물리적 기반의 격자단위 분포형 강우유출모형**입니다. 공개 연구성과와 확립된 강우유출 해석기능을 기반으로, 현행 v3.x 체계에서는 1차원 하천수리해석, 하천-홍수터 연계, 2차원 홍수범람해석, 입력자료 작성과 결과분석 기능을 함께 확장하고 있습니다.

- Public website: https://youngteckhur.github.io/KDRUM-Public/
- Korean page: https://youngteckhur.github.io/KDRUM-Public/ko/

## What K-DRUM is

K-DRUM represents watershed rainfall-runoff response on computational grid cells. Its established hydrologic foundation includes spatial rainfall, Green-Ampt infiltration, surface and subsurface runoff, evapotranspiration-related water balance, snow processes, and kinematic-wave runoff routing.

The model family has been applied in public research to flood runoff with radar/grid rainfall, parallel computation, long-term runoff and snowmelt, drought and water-balance analysis, surface-water/groundwater coupling, and wildfire/extreme-rainfall runoff studies.

## Established foundation

Public K-DRUM research supports the following high-level capabilities:

- physically based, grid-based distributed rainfall-runoff simulation
- spatial rainfall forcing, including radar/grid rainfall applications
- Green-Ampt infiltration
- surface and subsurface runoff representation
- kinematic-wave runoff routing
- long-term runoff and evapotranspiration-related water balance
- snow accumulation and snowmelt applications
- MPI-based parallel-computation lineage

## Current v3.x analysis and support programs

The current generation builds on the established rainfall-runoff core and organizes K-DRUM as a connected analysis environment:

- **K-DRUM Core** — distributed rainfall-runoff, river-hydraulic and flood-inundation simulation engine
- **K-DRUM InputStudio** — project configuration, time series, terrain, river geometry, hydraulic structures, scenarios, consistency checks, and engine-input generation
- **K-DRUM FloodViewer** — integrated map and time-series analysis of hydrologic and hydraulic simulation results
- **1D River Hydraulics Results Viewer** — separate viewer for longitudinal/cross-section results and water-level/discharge time series; under development and **not yet published to the public GitHub repositories**
- **K-DRUM ChannelBed** — reusable high-resolution terrain, river-geometry, and virtual channel-bed processing
- **K-DRUM Estuary2DV** — independent longitudinal-vertical estuary hydrodynamics and salinity research model

Current hydraulic extensions include cross-section-based one-dimensional dynamic-wave river-network analysis, branch/confluence hydraulics, bidirectional one-dimensional/two-dimensional river-floodplain exchange, two-dimensional flood-inundation analysis, hydraulic structures, and reservoir-operation scenarios. These components have different validation levels; see [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) for the public maturity boundary.

## Publicly documented application themes

The selected public record includes:

- flood-runoff simulation using spatial and radar rainfall
- parallel computation for distributed rainfall-runoff modeling
- long-term runoff, snow accumulation, and snowmelt
- drought and watershed water-balance analysis
- surface-water/groundwater model coupling
- wildfire and extreme-rainfall runoff response

See [PUBLICATIONS.md](PUBLICATIONS.md) for the selected bibliography.

## How to interpret this repository

This repository is a **public technical-information repository**, not a distribution of the production source code.

The homepage presents K-DRUM's established rainfall-runoff foundation, current hydraulic development, analysis/support programs, and public research evidence. Detailed readiness claims are kept separately in:

- [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md)
- [CAPABILITIES.md](CAPABILITIES.md)
- [CAPABILITY_ATLAS.md](CAPABILITY_ATLAS.md)
- [MODEL_CARD.md](MODEL_CARD.md)
- [ROADMAP.md](ROADMAP.md)

Production source code, restricted model inputs, internal validation datasets, sensitive operational data, private diagnostics, and unpublished implementation details are not published here.

## Visual-material rule

Public images are limited to reviewed K-DRUM materials, independently created neutral technical diagrams, verified QR codes, and appropriately sourced official institutional assets. AI-generated or look-alike K-DRUM, K-water, or MyWater brand symbols are not used.

## MyWater K-Series public access

K-DRUM is listed in K-water's MyWater **K-Series** technical-software program. MyWater describes K-Series as K-water technical know-how implemented as a strategic software package for integrated water-management analysis and control. MyWater also states that K-Series software made available on the website may be used free of charge by individuals outside K-water subject to the published terms of use.

K-DRUM은 **K-water 기술 SW 대국민 개방정책에 따라 MyWater 물정보포털 K-Series에서 무료로 내려받아 사용할 수 있습니다.** 다만 실제 다운로드 버전과 사용조건은 MyWater에 게시된 최신 K-Series 안내 및 이용약관을 확인해야 합니다.

- MyWater K-Series: https://www.water.or.kr/kor/board/index.do?bid=BD_00026&menuId=15_126_128&mode=list
- K-Series technical-software terms: https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127
- K-water Research Institute: https://www.kwater.or.kr/kiwe/main.do

## Naming note

The current canonical expansion used by this public site is **K-water Grid-based Distributed Rainfall rUnoff Model**. Historical publications used several expanded English forms of the acronym; original publication titles and source wording are preserved rather than rewritten.

---

**Canonical model name:** K-DRUM  
**Current public baseline:** v3.x / August 2026
