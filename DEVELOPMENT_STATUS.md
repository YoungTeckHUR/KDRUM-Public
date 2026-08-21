# K-DRUM Public Development Status

**Status reviewed: 2026-08-21**

This file describes public-facing maturity only. It intentionally does not expose source code, internal solver settings, validation datasets, development branches, failure diagnostics, or unpublished numerical implementation details.

The August 21, 2026 review confirms the current public maturity boundary below. Ongoing internal development has **not** been used to promote any capability beyond the validation level supported for public description.

| Capability / component | Public status | Public interpretation |
|---|---|---|
| Grid-based distributed rainfall-runoff simulation | **ESTABLISHED** | Core historical K-DRUM capability supported by publications |
| Spatial rainfall forcing | **ESTABLISHED** | Used in published radar/grid-rainfall applications |
| Surface and subsurface runoff representation | **ESTABLISHED** | Historical model-family capability |
| Kinematic-wave routing | **ESTABLISHED** | Published K-DRUM routing basis |
| Green-Ampt infiltration | **ESTABLISHED** | Published K-DRUM infiltration formulation |
| Long-term hydrology / evapotranspiration | **ESTABLISHED** | Used in long-term watershed applications |
| Snow accumulation and snowmelt | **ESTABLISHED** | Published long-term snow application |
| MPI-based parallel computation | **ESTABLISHED** | Published and retained as a development direction |
| 1D dynamic-wave river network | **ACTIVE DEVELOPMENT** | River-network hydraulic extension remains under integration, regression and QA |
| Branched/merged river-network hydraulics | **ACTIVE DEVELOPMENT** | Network reliability and junction behavior remain active development topics |
| Bidirectional 1D-2D coupling | **VALIDATED DEVELOPMENT** | Demonstrated in controlled development validation; not a production certification |
| 2D flood-inundation solver | **ACTIVE DEVELOPMENT** | Integrated development capability under verification |
| Full shallow-water-equation option | **ACTIVE DEVELOPMENT** | Specialized solver path; not the default public production claim |
| Hydraulic structures / dam-operation extensions | **ACTIVE DEVELOPMENT** | Scenario and operation functionality under continuing development |
| NetCDF integrated output | **ACTIVE DEVELOPMENT** | Current output modernization and viewer integration |
| High-resolution terrain and channel geometry | **ACTIVE DEVELOPMENT** | Current geometry-development track |
| Virtual channel-bed generation (ChannelBed) | **ACTIVE DEVELOPMENT** | Reusable module/tool under development |
| K-DRUM InputStudio | **ACTIVE DEVELOPMENT** | Canonical project authoring and QA environment |
| K-DRUM FloodViewer | **RELEASE CANDIDATE** | Viewer is in release-candidate development rather than a final 1.0 public release |
| K-DRUM Estuary2DV | **EXPERIMENTAL** | Independent verification prototype for future estuary/salinity coupling |

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
