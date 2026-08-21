# K-DRUM Public Capability Atlas

**Reviewed: 2026-08-21**

This atlas is a public-safe map of K-DRUM capabilities and development tracks. It is intentionally broader than the former homepage feature list, but it does not equate code presence with production readiness. Public maturity must be read together with `DEVELOPMENT_STATUS.md`.

## Status vocabulary

- **ESTABLISHED** — supported by the historical/public K-DRUM model lineage and/or published applications.
- **IMPLEMENTED / QA** — implemented in the current Core and exposed to regression, reporting, or operational QA, but not promoted as a universally validated production capability.
- **ACTIVE DEVELOPMENT** — integrated development capability whose scope, robustness, or workflow is still being strengthened.
- **VALIDATED DEVELOPMENT** — demonstrated in controlled development validation, without claiming universal certification.
- **RESEARCH FUNCTION** — available for research or legacy/research use; application boundaries require explicit review.
- **RELEASE CANDIDATE** — near-release application component, not yet represented as a final public release.
- **EXPERIMENTAL** — independent research prototype or exploratory extension.
- **DISABLED / REDEVELOPMENT CANDIDATE** — historical/research code exists but the current production build does not present it as an active capability.

## 1. Rainfall, forcing and input QA

| Capability | Public status | Public interpretation |
|---|---|---|
| Spatial rainfall forcing | **ESTABLISHED** | Spatial rainfall is a core input concept supported by public K-DRUM applications. |
| Thiessen / IDW rainfall mapping | **IMPLEMENTED / QA** | Multiple station-to-grid rainfall mapping paths are maintained. |
| Elevation-corrected IDW and rainfall QC | **IMPLEMENTED / QA** | Elevation correction and quality-control checks are part of the current rainfall-input path. |
| Rainfall completeness / observed-predicted-missing summary | **IMPLEMENTED / QA** | Run-level rainfall input assessment is available for reporting and QA. |
| Input precheck and project-level consistency assessment | **ACTIVE DEVELOPMENT** | Input consistency checks are being consolidated across the current Core and authoring tools. |

## 2. Continuous hydrology and model state

| Capability | Public status | Public interpretation |
|---|---|---|
| Green-Ampt infiltration | **ESTABLISHED** | Historical K-DRUM infiltration formulation. |
| Surface and subsurface runoff | **ESTABLISHED** | Core distributed hydrologic response. |
| Kinematic-wave hillslope routing | **ESTABLISHED** | Historical distributed routing basis. |
| Continuous / long-term simulation | **ESTABLISHED** | Long-term watershed simulation is part of the published K-DRUM lineage. |
| Evapotranspiration and soil-water accounting | **ESTABLISHED** | Continuous water balance includes evapotranspiration-related processes. |
| Snow accumulation and snowmelt | **ESTABLISHED** | Supported by published long-term snow applications. |
| Warm-up / initial-state stabilization | **IMPLEMENTED / QA** | Warm-up state handling and target-flow diagnostics are integrated; convergence quality must be reviewed per basin. |
| HotStart / state restart and checkpoint continuity | **IMPLEMENTED / QA** | Restart/state continuity is integrated with explicit read/write and consistency controls. |
| D-layer / delayed baseflow-return development | **ACTIVE DEVELOPMENT** | Current groundwater-layer and delayed-return development extends long-term storage and baseflow representation. |

## 3. Terrain, slopes, channel representation and routing

| Capability | Public status | Public interpretation |
|---|---|---|
| Separate hillslope and river hydraulic slopes | **IMPLEMENTED / QA** | Hillslope and river flow paths use separate slope representations rather than forcing one common slope. |
| Kinematic-wave channel routing | **ESTABLISHED** | Historical K-DRUM river-routing basis. |
| River-to-subsurface infiltration / exchange | **ACTIVE DEVELOPMENT** | River-water loss toward the deeper storage path is represented with available storage limiting the exchange. |
| Cross-section and river geometry preparation | **ACTIVE DEVELOPMENT** | Geometry workflow supports current 1D hydraulic development. |
| High-resolution terrain and ChannelBed | **ACTIVE DEVELOPMENT** | ChannelBed supports terrain/bed supplementation where surface DEMs are insufficient. |

## 4. Water balance, calibration support and reporting

| Capability | Public status | Public interpretation |
|---|---|---|
| Basin water-balance audit | **IMPLEMENTED / QA** | Run-level precipitation, evapotranspiration, outlet flow, storage and internal-flux accounting is integrated. |
| 1D-2D exchange water balance | **VALIDATED DEVELOPMENT** | Controlled development tests have checked consistent exchange accounting between domains. |
| Unified run reporting | **IMPLEMENTED / QA** | A consolidated run report summarizes inputs, state, calculation mode, diagnostics and results. |
| Subbasin reporting | **IMPLEMENTED / QA** | Subbasin-level reporting is part of the current successful-run output contract. |
| Output integrity / lifecycle checks | **IMPLEMENTED / QA** | Output creation, closure and integrity are actively checked in the current execution lifecycle. |
| Target-site / target-grid optimization and calibration metrics | **ACTIVE DEVELOPMENT** | Observation-based case comparison supports NSE, KGE, PBIAS, RMSE, MAE, correlation, peak error and timing metrics. |
| Subbasin / target-point evaluation and calibration workflow | **ACTIVE DEVELOPMENT** | Subbasin reporting and target-point optimization support a basin-by-basin calibration workflow; this is not described as universal automatic subbasin parameter calibration. |

## 5. River hydraulics, structures and dam operation

| Capability | Public status | Public interpretation |
|---|---|---|
| Cross-section-based 1D dynamic-wave river hydraulics | **ACTIVE DEVELOPMENT** | Current DWNET development extends K-DRUM beyond historical kinematic routing. |
| Branched / confluence river-network hydraulics | **ACTIVE DEVELOPMENT** | Junction and network reliability remain active development topics. |
| Hydraulic structures | **ACTIVE DEVELOPMENT** | Structure hydraulics and common structure input/output paths are being integrated across 1D/2D development. |
| Dam / reservoir operation rules | **ACTIVE DEVELOPMENT** | Operation controls include release constraints and water-level-based operation concepts. |
| Forecast, pre-release and downstream-control support | **ACTIVE DEVELOPMENT** | Forecast-aware operation and downstream safety/control workflows are under active development. |
| Multi-dam / scenario evaluation and reoperation | **ACTIVE DEVELOPMENT** | Network/scenario/reoperation logic is a dedicated development track and must not be interpreted as publication of operational rules. |

## 6. Floodplain and 1D-2D hydraulics

| Capability | Public status | Public interpretation |
|---|---|---|
| Bidirectional 1D-2D coupling | **VALIDATED DEVELOPMENT** | Two-way river/floodplain exchange has been demonstrated in controlled development validation. |
| 2D Local-Inertia floodplain calculation | **ACTIVE DEVELOPMENT** | Main efficient floodplain-development path. |
| Full shallow-water-equation option | **ACTIVE DEVELOPMENT** | Specialized path for cases requiring fuller momentum representation. |
| Multi-resolution / patch-based 2D domains | **ACTIVE DEVELOPMENT** | Nested or focused high-resolution hydraulic domains are under development. |
| 2D rainfall, drainage and structure interaction | **ACTIVE DEVELOPMENT** | Direct rainfall, drainage and hydraulic structures are part of the integrated flood-development track. |
| 2D particle / tracer visualization support | **ACTIVE DEVELOPMENT** | Flow-field interpretation includes particle/tracer-oriented development. |

## 7. Sediment, tracer and water-quality research functions

| Capability | Public status | Public interpretation |
|---|---|---|
| Hillslope sediment generation / erosion-deposition | **RESEARCH FUNCTION** | Sediment calculations exist on the hillslope path and should be treated as research functionality pending dedicated public validation documentation. |
| River sediment transport / capacity and deposition | **RESEARCH FUNCTION** | River sediment transport logic exists and should be used within an explicitly reviewed research scope. |
| River dye / conservative tracer transport | **RESEARCH FUNCTION** | A river dye/tracer transport path exists outside warm-up and tracks concentration/mass through river segments. |
| Water-quality process code | **DISABLED / REDEVELOPMENT CANDIDATE** | Historical/research water-quality code is retained but is explicitly excluded from the current active build; it must not be presented as a current production capability. |

## 8. Performance, data exchange and user tools

| Capability | Public status | Public interpretation |
|---|---|---|
| Single-thread / OpenMP / MPI execution tracks | **ESTABLISHED / ACTIVE MODERNIZATION** | MPI has a public research lineage; current ST/OMP/MPI consistency and runtime modernization remain active QA topics. |
| NetCDF integrated output | **ACTIVE DEVELOPMENT** | Common spatial/temporal output exchange for analysis tools. |
| FloodViewer | **RELEASE CANDIDATE** | Integrated spatial/time-series result analysis application. |
| InputStudio | **ACTIVE DEVELOPMENT** | Project authoring, consistency checking and engine-input generation environment. |
| Estuary2DV | **EXPERIMENTAL** | Separate x-z estuary/salinity research prototype rather than a current production Core function. |

## Public interpretation boundary

This atlas deliberately separates **existence**, **integration**, **validation**, and **release maturity**. In particular:

- development modules are not automatically production-ready;
- dam-operation descriptions do not publish real operating rules or sensitive operation data;
- optimization descriptions do not publish unpublished objective formulations or calibration datasets;
- sediment, dye and disabled water-quality paths require separate validation/application review;
- current 1D/2D hydraulic development remains subject to regression and water-balance acceptance criteria.
