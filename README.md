# K-DRUM

**Full name: K-water Grid-based Distributed Rainfall rUnoff Model**

**K-DRUM is K-water's physically based, grid-based distributed hydrologic model for rainfall-runoff simulation and integrated watershed analysis.**

K-DRUM은 K-water에서 개발해 온 물리적 기반의 격자형 분포형 강우-유출 모형입니다. 이 저장소는 K-DRUM의 공개 기술정보, 개발 상태, 연구 문헌과 비민감 정보를 제공하기 위한 공개 기술정보 저장소입니다.

Public website: https://youngteckhur.github.io/KDRUM-Public/

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

This repository uses public maturity labels to distinguish established capability from work that remains under development:

- **ESTABLISHED** — supported by the historical K-DRUM model family and published applications.
- **VALIDATED DEVELOPMENT** — demonstrated in controlled development/regression testing, but not equivalent to a production certification.
- **ACTIVE DEVELOPMENT** — implemented or actively being integrated, with verification still in progress.
- **RELEASE CANDIDATE** — nearing a release target but still undergoing acceptance testing.
- **EXPERIMENTAL** — research prototype or exploratory capability.

## Publication safety

Public information is governed by [PUBLICATION_POLICY.md](PUBLICATION_POLICY.md). The public repository is intentionally **not** a mirror of private development repositories. A GitHub Actions safety audit checks public changes for blocked engineering file types and common leakage patterns before they are accepted as clean public information.

Visual assets follow the same rule: only verified K-DRUM screenshots, independently created non-brand diagrams, QR codes that point to verified official URLs, and officially supplied institutional CI assets may be published. AI-generated or look-alike K-DRUM/K-water/MyWater brand symbols are not used.

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

This public site uses **K-water Grid-based Distributed Rainfall rUnoff Model** as the current canonical expansion of **K-DRUM**. Historical publications used several expanded English forms; their original titles and wording are preserved in the bibliography rather than silently rewritten.

---

**Canonical model name:** K-DRUM  
**Canonical expansion:** K-water Grid-based Distributed Rainfall rUnoff Model  
**Development status:** Active development  
**Public information baseline:** August 2026
