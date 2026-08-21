# K-DRUM Public Development Status

**Status reviewed: 2026-08-21**

This file describes public-facing maturity only. It intentionally does not expose source code, internal solver settings, validation datasets, development branches, failure diagnostics, operational reservoir rules, or unpublished numerical implementation details.

The August 21, 2026 review confirms the public maturity boundary below. Ongoing internal development has **not** been used to promote a capability merely because code exists.

## Hydrology, forcing and state

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Grid-based distributed rainfall-runoff simulation | **ESTABLISHED** | Core historical K-DRUM capability supported by publications |
| Spatial rainfall forcing | **ESTABLISHED** | Used in published radar/grid-rainfall applications |
| Thiessen / IDW rainfall mapping | **IMPLEMENTED / QA** | Current station-to-grid rainfall paths |
| Elevation-corrected IDW and rainfall QC | **IMPLEMENTED / QA** | Current forcing-quality path; regression and input QA remain important |
| Rainfall completeness / missing-data summary | **IMPLEMENTED / QA** | Run-level forcing assessment connected to reporting |
| Green-Ampt infiltration | **ESTABLISHED** | Published K-DRUM infiltration formulation |
| Surface and subsurface runoff representation | **ESTABLISHED** | Historical model-family capability |
| Kinematic-wave hillslope routing | **ESTABLISHED** | Published K-DRUM routing basis |
| Continuous / long-term simulation | **ESTABLISHED** | Used in long-term watershed applications |
| Evapotranspiration and soil-water accounting | **ESTABLISHED** | Established continuous-hydrology process family |
| Snow accumulation and snowmelt | **ESTABLISHED** | Published long-term snow application |
| Warm-up / initial-state stabilization | **IMPLEMENTED / QA** | Integrated state-initialization workflow; basin-specific convergence quality must be reviewed |
| HotStart / state restart | **IMPLEMENTED / QA** | Restart/checkpoint functionality with consistency controls |
| D-layer / delayed baseflow-return development | **ACTIVE DEVELOPMENT** | Current long-term storage/baseflow extension |

## Terrain, routing and geometry

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Separate hillslope and river slope representations | **IMPLEMENTED / QA** | Hillslope and river flow paths use separate slope variables |
| Kinematic-wave river routing | **ESTABLISHED** | Historical K-DRUM channel-routing basis |
| River-to-deeper-storage infiltration/exchange | **ACTIVE DEVELOPMENT** | Current river/D-layer exchange path with storage limiting |
| High-resolution terrain and channel geometry | **ACTIVE DEVELOPMENT** | Current geometry-development track |
| Virtual channel-bed generation (ChannelBed) | **ACTIVE DEVELOPMENT** | Reusable terrain/channel-bed module under development |

## Water balance, calibration and reporting

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Basin water-balance audit | **IMPLEMENTED / QA** | Run-level flux/storage closure and diagnostic reporting |
| 1D-2D exchange water balance | **VALIDATED DEVELOPMENT** | Controlled validation of consistent domain exchange accounting |
| Unified run reporting | **IMPLEMENTED / QA** | Consolidated execution, state, diagnostic, balance and timing summary |
| Subbasin reporting | **IMPLEMENTED / QA** | Current successful-run output contract includes subbasin reporting |
| Output integrity / lifecycle checks | **IMPLEMENTED / QA** | Output creation, closure and result-contract checks |
| Target-point / target-grid optimization | **ACTIVE DEVELOPMENT** | Observation-based case comparison with multiple performance metrics |
| Subbasin / target-point calibration workflow | **ACTIVE DEVELOPMENT** | Reporting plus target optimization supports basin-by-basin calibration decisions; not universal automatic subbasin calibration |

## River hydraulics, structures and dams

| Capability / component | Public status | Public interpretation |
|---|---|---|
| 1D dynamic-wave river network | **ACTIVE DEVELOPMENT** | River-network hydraulic extension remains under integration, regression and QA |
| Branched / confluence river-network hydraulics | **ACTIVE DEVELOPMENT** | Network reliability and junction behavior remain active development topics |
| Hydraulic structures | **ACTIVE DEVELOPMENT** | Structure hydraulics and common interfaces remain under continuing integration |
| Dam / reservoir operation rules | **ACTIVE DEVELOPMENT** | Operation and release-component functionality under continuing development |
| Forecast / pre-release / downstream-control support | **ACTIVE DEVELOPMENT** | Forecast-aware decision-support development; not production certification |
| Multi-dam scenarios and reoperation | **ACTIVE DEVELOPMENT** | Scenario/network/reoperation development track |

## Floodplain and coupled hydraulics

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Bidirectional 1D-2D coupling | **VALIDATED DEVELOPMENT** | Demonstrated in controlled development validation; not a production certification |
| 2D Local-Inertia flood-inundation path | **ACTIVE DEVELOPMENT** | Main efficient floodplain development capability under verification |
| Full shallow-water-equation option | **ACTIVE DEVELOPMENT** | Specialized solver path; not the default public production claim |
| Multi-resolution / patch-based 2D domains | **ACTIVE DEVELOPMENT** | Focused high-resolution hydraulic-domain development |
| 2D rainfall / drainage / structure interaction | **ACTIVE DEVELOPMENT** | Integrated floodplain extensions with component-specific validation boundaries |
| 2D particle / tracer-oriented support | **ACTIVE DEVELOPMENT** | Flow-field interpretation and transport-oriented development |

## Sediment, tracer and water-quality research

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Hillslope sediment / erosion-deposition | **RESEARCH FUNCTION** | Calculation path exists; dedicated public validation documentation is still required |
| River sediment transport / deposition | **RESEARCH FUNCTION** | Calculation path exists; application boundary must be reviewed explicitly |
| River dye / conservative tracer | **RESEARCH FUNCTION** | Research transport path exists outside warm-up |
| Historical water-quality process code | **DISABLED / REDEVELOPMENT CANDIDATE** | Retained research/legacy code is excluded from the current active build and is not a current production capability |

## Runtime, outputs and user tools

| Capability / component | Public status | Public interpretation |
|---|---|---|
| MPI-based parallel computation | **ESTABLISHED** | Published K-DRUM research lineage |
| Current ST / OpenMP / MPI runtime consistency | **ACTIVE MODERNIZATION / QA** | Current parallel execution and consistency remain active QA topics |
| NetCDF integrated output | **ACTIVE DEVELOPMENT** | Current output modernization and viewer integration |
| K-DRUM InputStudio | **ACTIVE DEVELOPMENT** | Canonical project authoring and QA environment |
| K-DRUM FloodViewer | **RELEASE CANDIDATE** | Viewer is in release-candidate development rather than a final 1.0 public release |
| K-DRUM Estuary2DV | **EXPERIMENTAL** | Independent x-z estuary/salinity research prototype |

## Current Core baseline

Current K-DRUM Core development is in the **v3.x** line. Patch-level internal identifiers may change more frequently than this public page and are intentionally not published here.

The public status of the 1D river-network track remains **ACTIVE DEVELOPMENT** while numerical reliability, network coupling, production integration and regression evidence continue to be strengthened. Internal implementation progress does not by itself change the public maturity label.

## 1D-2D validation boundary

Controlled development validation in August 2026 demonstrated active two-way exchange between the 1D river and 2D floodplain and internally consistent exchange accounting in the tested configuration.

This statement means:

- bidirectional exchange was physically active in the tested development case;
- it does **not** mean that every watershed configuration is certified;
- broader basin-scale water-balance auditing remains a separate validation topic;
- production status will be updated only after the relevant regression and acceptance criteria are completed.

## Research-function interpretation

The capability atlas now makes older/research functions visible without overstating their readiness. In particular:

- sediment and dye/tracer paths are shown as **RESEARCH FUNCTION**;
- water-quality process code is shown as **DISABLED / REDEVELOPMENT CANDIDATE** because it is not active in the current production build;
- optimization and dam-operation functionality is described without exposing unpublished objective details, restricted data or operational rules.

## What is intentionally not public

This repository does not publish:

- Fortran/Python production source code
- internal Git branches or commit hashes
- solver relaxation, recovery, or convergence-tuning details
- unpublished optimization objective functions
- operational reservoir rules or sensitive operation data
- model failure codes and diagnostic logs
- internal validation datasets
- proprietary or restricted basin inputs
- unpublished numerical implementation details