# K-DRUM Capabilities

This page summarizes the public-facing K-DRUM capability families. The more detailed feature-by-feature inventory is maintained in [CAPABILITY_ATLAS.md](CAPABILITY_ATLAS.md), and maturity labels are maintained in [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md).

The public description deliberately separates **established**, **implemented/QA**, **active-development**, **validated-development**, **research**, and **disabled/redevelopment** functions. The existence of a calculation path does not by itself mean universal production readiness.

## 1. Rainfall, forcing and input QA

K-DRUM supports spatial rainfall forcing and maintains multiple station-to-grid rainfall paths. Current input development also includes:

- Thiessen and IDW rainfall mapping
- elevation-corrected IDW
- rainfall quality-control checks
- observed / predicted / missing rainfall summaries
- input precheck and project-level consistency assessment

## 2. Continuous hydrology and model state

Established distributed-hydrology foundations include:

- Green-Ampt infiltration
- surface and subsurface runoff
- kinematic-wave hillslope routing
- continuous / long-term simulation
- evapotranspiration and soil-water accounting
- snow accumulation and snowmelt

Current state-management and long-term extensions also include:

- warm-up / initial-state stabilization and target-flow diagnostics
- HotStart / restart and checkpoint continuity
- D-layer / delayed baseflow-return development

## 3. Terrain, slopes, channel representation and routing

Publicly describable capabilities include:

- separate hillslope and river hydraulic slope representations
- established kinematic-wave channel routing
- river-to-deeper-storage infiltration/exchange development
- cross-section and river-geometry preparation
- high-resolution terrain processing and ChannelBed development

## 4. Water balance, calibration support and reporting

Current Core QA and analysis development includes:

- basin water-balance auditing
- 1D-2D exchange water-balance accounting
- consolidated run reporting
- subbasin reporting
- output-integrity and lifecycle checks
- target-grid / target-site calibration and optimization metrics
- combined subbasin-diagnosis and target-point calibration workflows

The optimization path supports observation-based case comparison and multiple performance measures. Public wording does **not** describe this as universal automatic calibration of every subbasin.

## 5. River hydraulics, structures and dam operation

Current hydraulic development includes:

- cross-section-based 1D dynamic-wave river hydraulics
- branched and confluence river-network hydraulics
- hydraulic structures
- reservoir/dam-operation rules and release-component handling
- forecast/pre-release and downstream-control development
- multi-dam scenario evaluation and reoperation studies

Operational reservoir rules, restricted data and actual operating decisions are not published by this repository.

## 6. Floodplain and 1D-2D hydraulics

Current development includes:

- bidirectional 1D-2D river/floodplain exchange
- 2D Local-Inertia floodplain calculation
- Full shallow-water-equation option
- multi-resolution / patch-based 2D domains
- direct rainfall, drainage and hydraulic-structure interaction
- 2D particle / tracer-oriented analysis support

The 1D-2D exchange path has a **validated-development** boundary from controlled testing; this is not universal basin certification.

## 7. Sediment, tracer and water-quality research functions

The current code base retains research calculation paths for:

- hillslope sediment generation / erosion-deposition
- river sediment transport / capacity and deposition
- river dye / conservative-tracer transport

These are presented as **research functions** pending dedicated public validation documentation.

Historical/research water-quality process code also exists, but it is explicitly disabled/excluded from the current active build. It is therefore shown only as a **redevelopment candidate**, not as a current production capability.

## 8. Performance, output exchange and user tools

The wider K-DRUM environment includes:

- single-thread, OpenMP and MPI execution tracks
- NetCDF-based integrated output
- InputStudio project authoring and input QA
- FloodViewer spatial/time-series result analysis
- Estuary2DV as a separate experimental x-z estuary/salinity research prototype

MPI has a public K-DRUM research lineage, while current ST/OMP/MPI consistency and runtime modernization remain active QA topics.

## Public interpretation boundary

For detailed status and interpretation, use:

- [Capability Atlas](CAPABILITY_ATLAS.md)
- [Development Status](DEVELOPMENT_STATUS.md)
- [Model Card](MODEL_CARD.md)
- [Publications and Research](PUBLICATIONS.md)

This repository does not publish production source code, restricted basin inputs, unpublished numerical tuning, operational reservoir rules, private validation datasets, or internal development identifiers.