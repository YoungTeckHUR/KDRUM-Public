# K-DRUM Public Development Status

**Status reviewed: 2026-08-21**

This file describes public-facing maturity only. It intentionally does not expose source code, internal solver settings, validation datasets, development branches, failure diagnostics, operational reservoir rules, or unpublished numerical implementation details.

The August 21, 2026 review confirms the public maturity boundary below. Ongoing internal development has **not** been used to promote a capability merely because code exists.

## Rainfall-runoff hydrology, forcing and model state

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Grid-unit distributed rainfall-runoff simulation | **ESTABLISHED** | Core historical K-DRUM capability supported by publications |
| Spatially distributed rainfall forcing | **ESTABLISHED** | Used in published radar/grid-rainfall applications |
| Thiessen / IDW rainfall distribution | **IMPLEMENTED / QA** | Current station-to-grid rainfall-distribution paths |
| Elevation-corrected IDW and rainfall-data quality checks | **IMPLEMENTED / QA** | Current rainfall-input quality path; regression and input verification remain important |
| Rainfall completeness / missing-data assessment | **IMPLEMENTED / QA** | Run-level rainfall-input assessment connected to reporting |
| Green-Ampt infiltration | **ESTABLISHED** | Published K-DRUM infiltration formulation |
| Surface and subsurface runoff representation | **ESTABLISHED** | Historical model-family capability |
| Kinematic-wave hillslope runoff routing | **ESTABLISHED** | Published K-DRUM routing basis |
| Continuous / long-term runoff simulation | **ESTABLISHED** | Used in long-term watershed applications |
| Evapotranspiration and soil-water accounting | **ESTABLISHED** | Established continuous-simulation process family |
| Snow accumulation and snowmelt | **ESTABLISHED** | Published long-term snow application |
| Warm-up / initial-state stabilization | **IMPLEMENTED / QA** | Integrated state-initialization workflow; basin-specific convergence quality must be reviewed |
| HotStart / state restart | **IMPLEMENTED / QA** | Restart/checkpoint functionality with consistency controls |
| Deeper-storage layer (D-layer) / delayed baseflow-return development | **ACTIVE DEVELOPMENT** | Current long-term storage/baseflow extension |

## Hillslope, channel routing and terrain/geometry

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Separate hillslope and channel slope representations | **IMPLEMENTED / QA** | Hillslope and river flow paths use separate slope variables |
| Kinematic-wave channel discharge routing | **ESTABLISHED** | Historical K-DRUM channel-routing basis |
| River infiltration / exchange with deeper storage | **ACTIVE DEVELOPMENT** | Current river/D-layer exchange path with available-storage limiting |
| High-resolution terrain and river geometry | **ACTIVE DEVELOPMENT** | Current hydraulic-geometry development track |
| Virtual channel-bed generation (ChannelBed) | **ACTIVE DEVELOPMENT** | Reusable terrain/channel-bed support tool under development |

## Water balance, parameter calibration and result reporting

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Basin water-balance assessment | **IMPLEMENTED / QA** | Run-level flux/storage closure and diagnostic reporting |
| One-dimensional/two-dimensional exchange water balance | **VALIDATED DEVELOPMENT** | Controlled validation of consistent domain-exchange accounting |
| Consolidated run-result reporting | **IMPLEMENTED / QA** | Consolidated execution, state, diagnostic, balance and timing summary |
| Subbasin result reporting | **IMPLEMENTED / QA** | Current successful-run output contract includes subbasin reporting |
| Result-output integrity checks | **IMPLEMENTED / QA** | Output creation, closure and result-contract checks |
| Target-point / target-grid parameter optimization | **ACTIVE DEVELOPMENT** | Observation-based case comparison with multiple performance metrics |
| Subbasin / target-point calibration-support workflow | **ACTIVE DEVELOPMENT** | Reporting plus target optimization supports basin-by-basin calibration decisions; not universal automatic subbasin calibration |

## River hydraulics, hydraulic structures and dam operation

| Capability / component | Public status | Public interpretation |
|---|---|---|
| One-dimensional dynamic-wave river network | **ACTIVE DEVELOPMENT** | River-network hydraulic extension remains under integration, regression and verification |
| Branch / confluence river-network hydraulics | **ACTIVE DEVELOPMENT** | Network reliability and junction behavior remain active development topics |
| Hydraulic structures | **ACTIVE DEVELOPMENT** | Structure hydraulics and common interfaces remain under continuing integration |
| Dam / reservoir operation rules | **ACTIVE DEVELOPMENT** | Operation and release-component functionality under continuing development |
| Forecast / pre-release / downstream-control support | **ACTIVE DEVELOPMENT** | Forecast-aware decision-support development; not production certification |
| Multi-dam operation scenarios and reoperation | **ACTIVE DEVELOPMENT** | Scenario/network/reoperation development track |

## River-floodplain coupling and flood-inundation hydraulics

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Bidirectional one-dimensional/two-dimensional river-floodplain coupling | **VALIDATED DEVELOPMENT** | Demonstrated in controlled development validation; not a production certification |
| Two-dimensional Local Inertia flood-inundation path | **ACTIVE DEVELOPMENT** | Main efficient floodplain development capability under verification |
| Full shallow-water-equation option | **ACTIVE DEVELOPMENT** | Specialized solver path; not the default public production claim |
| Multi-resolution / locally refined two-dimensional domains | **ACTIVE DEVELOPMENT** | Focused high-resolution hydraulic-domain development |
| Two-dimensional rainfall / drainage / hydraulic-structure interaction | **ACTIVE DEVELOPMENT** | Integrated floodplain extensions with component-specific validation boundaries |
| Two-dimensional particle / material-tracking support | **ACTIVE DEVELOPMENT** | Flow-field interpretation and transport-oriented development |

## Sediment, material tracking and water-quality research

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Hillslope sediment / erosion-deposition | **RESEARCH FUNCTION** | Calculation path exists; dedicated public validation documentation is still required |
| River sediment transport / deposition | **RESEARCH FUNCTION** | Calculation path exists; application boundary must be reviewed explicitly |
| River dye / conservative material tracking | **RESEARCH FUNCTION** | Research transport path exists outside warm-up |
| Historical water-quality process code | **DISABLED / REDEVELOPMENT CANDIDATE** | Retained research/legacy code is excluded from the current active build and is not a current production capability |

## Parallel computation, result output and support programs

| Capability / component | Public status | Public interpretation |
|---|---|---|
| MPI-based parallel computation | **ESTABLISHED** | Published K-DRUM research lineage |
| Current serial / OpenMP / MPI result consistency | **ACTIVE MODERNIZATION / QA** | Current parallel execution and consistency remain active verification topics |
| NetCDF integrated result output | **ACTIVE DEVELOPMENT** | Current output modernization and viewer integration |
| K-DRUM InputStudio | **ACTIVE DEVELOPMENT** | Canonical project authoring and input-data verification environment |
| K-DRUM FloodViewer | **RELEASE CANDIDATE** | Viewer is in release-candidate development rather than a final 1.0 public release |
| 1D River Hydraulics Results Viewer | **SEPARATE DEVELOPMENT / NOT YET PUBLIC ON GITHUB** | Separate viewer for longitudinal/cross-section results and water-level/discharge time series; development exists outside the current public GitHub repositories |
| K-DRUM Estuary2DV | **EXPERIMENTAL** | Independent longitudinal-vertical estuary hydrodynamics/salinity research model |

## Current Core baseline

Current K-DRUM Core development is in the **v3.x** line. Patch-level internal identifiers may change more frequently than this public page and are intentionally not published here.

The public status of the one-dimensional river-network track remains **ACTIVE DEVELOPMENT** while numerical reliability, network coupling, production integration and regression evidence continue to be strengthened. Internal implementation progress does not by itself change the public maturity label.

## One-dimensional/two-dimensional validation boundary

Controlled development validation in August 2026 demonstrated active two-way exchange between the one-dimensional river and two-dimensional floodplain and internally consistent exchange accounting in the tested configuration.

This statement means:

- bidirectional exchange was physically active in the tested development case;
- it does **not** mean that every watershed configuration is certified;
- broader basin-scale water-balance auditing remains a separate validation topic;
- production status will be updated only after the relevant regression and acceptance criteria are completed.

## Research-function interpretation

The public capability documentation makes older/research functions visible without overstating their readiness. In particular:

- sediment and dye/material-tracking paths are shown as **RESEARCH FUNCTION**;
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
