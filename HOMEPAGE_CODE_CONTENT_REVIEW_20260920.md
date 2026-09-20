# Homepage capability and diagram review — 2026-09-20

All 46 feature entries were compared with implementation paths, the public capability atlas and the preserved p18 introduction materials. This is an explanation-scope review, not a numerical validation campaign or a maturity upgrade. No model code, private source, operating rule or numerical setting is published here.

Eleven descriptions were clarified. Snow, D-layer and multi-resolution schematics were revised in Korean and English. Six original presentation topics have adjacent clarification notes; the video, PDF and all 18 introduction images remain unchanged.

| Feature | Review outcome |
| --- | --- |
| Spatial rainfall forcing | Existing wording retained within its stated development/research boundary. |
| Thiessen & IDW rainfall mapping | Existing wording retained within its stated development/research boundary. |
| Elevation-corrected IDW & rainfall QC | Existing wording retained within its stated development/research boundary. |
| Rainfall completeness assessment | Existing wording retained within its stated development/research boundary. |
| Input precheck & consistency | Existing wording retained within its stated development/research boundary. |
| Green-Ampt infiltration | Existing wording retained within its stated development/research boundary. |
| Surface & subsurface runoff | Existing wording retained within its stated development/research boundary. |
| Continuous / long-term simulation | Existing wording retained within its stated development/research boundary. |
| Evapotranspiration & soil water | Clarified implementation scope; see the bilingual feature description. |
| Snow accumulation & melt | Clarified implementation scope; see the bilingual feature description. |
| Warm-up & initial-state stabilization | Existing wording retained within its stated development/research boundary. |
| HotStart & state restart | Clarified implementation scope; see the bilingual feature description. |
| D-layer & delayed baseflow return | Clarified implementation scope; see the bilingual feature description. |
| Separate hillslope & channel slopes | Existing wording retained within its stated development/research boundary. |
| Hillslope kinematic routing | Existing wording retained within its stated development/research boundary. |
| Channel kinematic routing | Existing wording retained within its stated development/research boundary. |
| River infiltration to deeper storage | Existing wording retained within its stated development/research boundary. |
| High-resolution terrain & ChannelBed | Existing wording retained within its stated development/research boundary. |
| Basin water-balance audit | Existing wording retained within its stated development/research boundary. |
| 1D-2D exchange water balance | Clarified implementation scope; see the bilingual feature description. |
| Unified run reporting | Existing wording retained within its stated development/research boundary. |
| Subbasin reporting | Existing wording retained within its stated development/research boundary. |
| Target-point calibration & optimization | Existing wording retained within its stated development/research boundary. |
| Subbasin / target-point calibration workflow | Existing wording retained within its stated development/research boundary. |
| Output integrity & lifecycle | Existing wording retained within its stated development/research boundary. |
| 1D dynamic-wave river network | Existing wording retained within its stated development/research boundary. |
| Branch & confluence hydraulics | Existing wording retained within its stated development/research boundary. |
| Hydraulic structures | Existing wording retained within its stated development/research boundary. |
| Dam / reservoir operation | Existing wording retained within its stated development/research boundary. |
| Forecast, pre-release & downstream control | Existing wording retained within its stated development/research boundary. |
| Multi-dam scenarios & reoperation | Clarified implementation scope; see the bilingual feature description. |
| Bidirectional 1D-2D coupling | Clarified implementation scope; see the bilingual feature description. |
| 2D Local-Inertia floodplain | Existing wording retained within its stated development/research boundary. |
| Full shallow-water equations | Existing wording retained within its stated development/research boundary. |
| Multi-resolution / patch 2D | Clarified implementation scope; see the bilingual feature description. |
| 2D rainfall, drainage, structures & tracer | Existing wording retained within its stated development/research boundary. |
| Hillslope sediment / erosion-deposition | Existing wording retained within its stated development/research boundary. |
| River sediment transport | Existing wording retained within its stated development/research boundary. |
| Dye / conservative tracer | Existing wording retained within its stated development/research boundary. |
| Water-quality process module | Existing wording retained within its stated development/research boundary. |
| ST, OpenMP & MPI execution | Existing wording retained within its stated development/research boundary. |
| NetCDF integrated output | Clarified implementation scope; see the bilingual feature description. |
| FloodViewer | Clarified implementation scope; see the bilingual feature description. |
| InputStudio | Existing wording retained within its stated development/research boundary. |
| Estuary2DV | Clarified implementation scope; see the bilingual feature description. |
| 1D River Hydraulics Results Viewer | Existing wording retained within its stated development/research boundary. |

Key distinctions: empirical melt-factor correction versus direct radiation or snow transport; delayed D-layer return versus optional loss; source-resolution patches versus invented finer terrain; one-way versus two-way coupling; saved-state coverage; original versus alternative scenario outputs; separate file time axes; plan-view versus x-z analysis.

The original p18 presentation remains an introduction archive. Read its six scope notes in [the visual guide](docs/media.html#review-notes). Existing maturity dates in DEVELOPMENT_STATUS.md remain unchanged.

Verification: bilingual content contract, complete feature display and SVG geometry checks, original media preservation, and public-content safety are required for this change. Numerical engines and desktop viewers were not executed in this review.

