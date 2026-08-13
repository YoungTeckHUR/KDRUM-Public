# K-DRUM

**K-DRUM is K-water's physically based, grid-based distributed hydrologic model for rainfall-runoff simulation and integrated watershed analysis.**

K-DRUM은 K-water에서 개발해 온 물리적 기반의 격자형 분포형 강우-유출 모형입니다. 이 저장소는 K-DRUM의 공개 기술정보, 개발 상태, 연구 문헌과 비민감 정보를 제공하기 위한 공개 기술정보 저장소입니다.

> **Public technical-information repository only.**  
> This repository is not a substitute for K-water's official institutional information. K-water/MyWater should be treated as the authoritative source for institutional and official product information.  
> Production source code, validation datasets, internal diagnostics, operational data, and unpublished implementation details are not distributed here.

## Background

K-DRUM has been developed and applied since the late 2000s for distributed hydrologic analysis. Published research has described applications including radar-rainfall flood simulation, kinematic-wave routing, Green-Ampt infiltration, MPI parallelization, long-term runoff and snow processes, drought analysis, and surface-water/groundwater coupling.

K-DRUM is also listed in K-water's MyWater **K-Series** technical software family as a physically based, grid-scale distributed model for rainfall-runoff analysis.

## Current development direction

The current K-DRUM development program is extending the original distributed rainfall-runoff framework toward a more integrated hydrologic and hydraulic modeling system.

Current development areas include:

- distributed rainfall-runoff and physical hydrology
- kinematic-wave routing
- 1D dynamic-wave river-network hydraulics
- branched and merged river networks
- bidirectional 1D-2D hydraulic coupling
- 2D flood-inundation analysis
- hydraulic structures and reservoir-operation scenarios
- high-resolution terrain, river alignment, and virtual channel-bed processing
- NetCDF-based integrated outputs
- parallel computation
- project authoring through **K-DRUM InputStudio**
- result visualization through **K-DRUM FloodViewer**
- experimental estuary and salinity research through **K-DRUM Estuary2DV**

These functions are at different stages of maturity. See [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) before interpreting a development function as production-ready.

## Model family

### K-DRUM Core
The hydrologic and hydraulic simulation engine. Current development is in the **v3.x** line.

### K-DRUM InputStudio
An object-centered project and input authoring environment under active development. It manages model objects, geometry, time series, scenarios, quality checks, and generation of engine-compatible inputs.

### K-DRUM FloodViewer
A visualization environment under release-candidate development for spatial and time-varying hydrologic and hydraulic results.

### K-DRUM ChannelBed
A development module for high-resolution river geometry and virtual channel-bed generation, designed so that the calculation core can be reused by K-DRUM and external authoring workflows.

### K-DRUM Estuary2DV
An **experimental** longitudinal-vertical (x-z) estuary hydrodynamics and salinity prototype. It is being verified independently before future coupling with K-DRUM river hydraulics and hydraulic-structure operation.

## Public status vocabulary

This repository uses four maturity labels:

- **ESTABLISHED** — supported by the historical K-DRUM model family and published applications.
- **VALIDATED DEVELOPMENT** — demonstrated in controlled development/regression testing, but not equivalent to a production certification.
- **ACTIVE DEVELOPMENT** — implemented or actively being integrated, with verification still in progress.
- **EXPERIMENTAL** — research prototype or exploratory capability.

## Public references

A selected public bibliography is maintained in [PUBLICATIONS.md](PUBLICATIONS.md).

Important historical references include research on:

- GIS/radar-rainfall distributed flood simulation
- MPI-based parallelization
- long-term snowmelt and runoff
- drought analysis
- surface-water/groundwater coupling
- recent wildfire and extreme-rainfall runoff analysis

## Official context

K-DRUM is included in the K-water MyWater **K-Series** technical software listing.

Official K-Series listing:  
https://www.water.or.kr/kor/menu/sub.do?menuId=15_126_127

## Naming note

Earlier publications have used more than one expanded English form for the K-DRUM acronym. This repository therefore uses **K-DRUM** as the canonical model name and avoids defining a new expanded form unless an authoritative institutional naming decision is made.

---

**Canonical model name:** K-DRUM  
**Development status:** Active development  
**Public information baseline:** August 2026
