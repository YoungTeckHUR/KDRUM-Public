# Capability references — second set

This set complements the twelve reference illustrations published in the first set. It adds six independent educational illustrations and eight bilingual SVG schematics (sixteen SVG files). These are concept visuals, not measured data, model outputs, exact study sites, or software screenshots.

The artwork was created for the website with built-in image generation. The vector diagrams are generated deterministically from editable source and use Korean or English text according to the page language. No numerical performance claims, operating rules, private inputs, or model source code are included.

## Coverage

The bilingual homepage now provides an inline reference for 26 capabilities, related-figure links for 15 more, and the existing hydrology-gallery links for four. The disabled water-quality module retains its availability explanation. All 46 capability identities, descriptions and development states remain unchanged.

| Capability | Presentation | Reference |
| --- | --- | --- |
| Spatial rainfall forcing (`rain-spatial`) | inline | rainfall-input |
| Thiessen & IDW rainfall mapping (`rain-methods`) | linked | rain-spatial |
| Elevation-corrected IDW & rainfall QC (`rain-qc`) | linked | rain-spatial, input-precheck |
| Rainfall completeness assessment (`rain-summary`) | inline | rainfall-coverage |
| Input precheck & consistency (`input-precheck`) | inline | input-readiness |
| Green-Ampt infiltration (`ga`) | existing gallery | concept-ga |
| Surface & subsurface runoff (`runoff`) | existing gallery | concept-runoff |
| Continuous / long-term simulation (`continuous`) | inline | continuous-water-storage |
| Evapotranspiration & soil water (`et`) | existing gallery | concept-et |
| Snow accumulation & melt (`snow`) | inline | snow-storage-melt |
| Warm-up & initial-state stabilization (`warmup`) | inline | initial-state-warmup |
| HotStart & state restart (`hotstart`) | inline | state-continuity |
| D-layer & delayed baseflow return (`dlayer`) | existing gallery | concept-dlayer |
| Separate hillslope & channel slopes (`slope-separate`) | inline | hillslope-channel |
| Hillslope kinematic routing (`kw-hill`) | linked | slope-separate |
| Channel kinematic routing (`kw-river`) | linked | slope-separate |
| River infiltration to deeper storage (`river-infil`) | inline | riverbed-deep-storage |
| High-resolution terrain & ChannelBed (`channelbed`) | inline | channel-geometry |
| Basin water-balance audit (`wb`) | inline | watershed-water-balance |
| 1D-2D exchange water balance (`wb-1d2d`) | linked | coupling |
| Unified run reporting (`run-report`) | linked | output-integrity |
| Subbasin reporting (`subbasin-report`) | inline | subbasin-assessment |
| Target-point calibration & optimization (`optimization`) | inline | calibration-evaluation |
| Subbasin / target-point calibration workflow (`subcal`) | linked | subbasin-report, optimization |
| Output integrity & lifecycle (`output-integrity`) | inline | result-lifecycle |
| 1D dynamic-wave river network (`dwnet`) | inline | connected-river-network |
| Branch & confluence hydraulics (`junction`) | linked | dwnet |
| Hydraulic structures (`structures`) | inline | hydraulic-structure-flows |
| Dam / reservoir operation (`dam-operation`) | inline | river-reservoir |
| Forecast, pre-release & downstream control (`dam-forecast`) | inline | reservoir-scenario-assessment |
| Multi-dam scenarios & reoperation (`dam-scenario`) | linked | dam-forecast |
| Bidirectional 1D-2D coupling (`coupling`) | inline | river-floodplain |
| 2D Local-Inertia floodplain (`local-inertia`) | inline | floodplain-grid-concept |
| Full shallow-water equations (`fullswe`) | linked | local-inertia |
| Multi-resolution / patch 2D (`multires`) | inline | nested-grid-patch |
| 2D rainfall, drainage, structures & tracer (`flood-extras`) | linked | local-inertia, dye |
| Hillslope sediment / erosion-deposition (`sed-hill`) | inline | sediment-transport |
| River sediment transport (`sed-river`) | linked | sed-hill |
| Dye / conservative tracer (`dye`) | inline | conservative-tracer |
| Water-quality process module (`wq`) | disabled | availability text retained |
| ST, OpenMP & MPI execution (`parallel`) | inline | parallel-computation |
| NetCDF integrated output (`netcdf`) | linked | @program-workflow |
| FloodViewer (`viewer`) | linked | @program-workflow |
| InputStudio (`inputstudio`) | linked | @program-workflow |
| Estuary2DV (`estuary`) | inline | estuary-vertical-section |
| 1D River Hydraulics Results Viewer (`river-viewer`) | inline | river-result-views |

## Production and review

- Six WebP files preserve their 1672 × 941 dimensions. Each has a 450 KB maximum and an exact SHA-256 digest in the public-content audit.
- The eight vector concepts cover input readiness, rainfall completeness, warm-up, water balance, calibration, output lifecycle, local grid patches, and 1D result views.
- Shared images open through the existing accessible enlargement dialog. Source links remain usable with JavaScript disabled.
- Rebuild with the existing site generator; it also regenerates the bilingual SVGs. The caption mapping and explicit coverage checks prevent unassigned or ambiguous references.
- Browser checks cover all 184 bilingual desktop/mobile capability cases, shared-image links and focus restoration. SVG checks inspect text boundaries and panel padding in both languages.
- Original reference images, the five hydrology-gallery images, p18 media and accepted homepage layout are retained.
