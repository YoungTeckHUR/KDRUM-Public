# K-DRUM Public Information Changelog

## 2026-08-21 — Comprehensive capability atlas redesign

Rebuilt the public homepage capability presentation after reviewing the current K-DRUM Core, public documentation and development history for functionality that was missing from the earlier four-feature summary.

Updated:

- replaced the narrow homepage feature summary with a bilingual **45-item capability atlas** organized into eight functional groups
- restored public-safe coverage of water-balance auditing, consolidated/subbasin reporting, warm-up, HotStart, continuous simulation, rainfall quality assessment, separate hillslope/channel slopes, river infiltration/deeper-storage exchange, target-point calibration/optimization, dam operation, sediment and dye/tracer functions
- separated established, implemented/QA, active-development, validated-development, research, release-candidate, experimental and disabled/redevelopment maturity states
- identified historical water-quality process code as **disabled / redevelopment candidate**, rather than presenting it as an active model capability
- added feature-specific explanatory compositions instead of reusing one generic popup: water-balance flux/storage, warm-up state loop, rainfall-QC pipeline, slope profile, river-infiltration section, calibration metrics, reservoir-operation concept, 1D-2D exchange, sediment transport, tracer concentration and parallel-domain views
- expanded `CAPABILITIES.md` and `DEVELOPMENT_STATUS.md` to use the same capability structure and conservative public interpretation boundary
- expanded rendered Chromium QA to traverse all eight capability groups, count the full 45-item inventory and interact with representative hydrology, QA, hydraulic, operation and transport functions on desktop/mobile
- updated live GitHub Pages verification to check the deployed capability atlas rather than the retired four-card feature interaction

Public-boundary safeguards remain unchanged: no production source, restricted inputs, operational reservoir rules, unpublished numerical tuning or internal development identifiers are published.

## 2026-08-21 — Homepage brand balance and rendered-browser QA

Refined the public K-DRUM symbol presentation after reviewing rendered English/Korean desktop and mobile pages in Chromium.

Updated:

- switched navigation and hero marks to the canonical reviewed branding assets
- reduced the oversized white plate around the hero symbol while enlarging the internal grid/river artwork within the frame
- preserved the full approved symbol artwork rather than modifying the source image
- added rendered Chromium checks for English/Korean desktop and mobile pages, popup opening, console errors, horizontal overflow and brand dimensions
- fixed a Korean technical-popup DOM timing error exposed by the real browser test
- removed a duplicated public-status badge row found during screenshot review

## 2026-08-21 — Bilingual homepage runtime and public-status review

Reviewed and repaired the public GitHub Pages presentation without publishing production source code or private engineering details.

Updated:

- connected the Korean homepage to the existing facts-first technical popup chain
- unified the Korean feature-card interaction so the earlier three-card popup path no longer overrides the common runtime
- added facts-first technical interaction to the English homepage
- reviewed public maturity labels as of 2026-08-21 without promoting ongoing development beyond supported public evidence
- refreshed homepage sitemap dates
- added an automated homepage runtime audit for local script wiring, bilingual explainer coverage, public-status date, and sitemap synchronization

Public maturity remains conservative:

- 1D dynamic-wave river-network hydraulics: **ACTIVE DEVELOPMENT**
- bidirectional 1D-2D coupling: **VALIDATED DEVELOPMENT**
- FloodViewer: **RELEASE CANDIDATE**
- Estuary2DV: **EXPERIMENTAL**

## 2026-08 — Initial public-information baseline

Created the public-information structure for K-DRUM without publishing production source code.

Publicly documented:

- established distributed rainfall-runoff background
- historical kinematic-wave and Green-Ampt basis
- MPI parallelization research lineage
- long-term hydrology and snow applications
- current 1D dynamic-wave development
- bidirectional 1D-2D coupling as validated development
- 2D flood-inundation development
- high-resolution ChannelBed development
- InputStudio active development
- FloodViewer release-candidate status
- Estuary2DV experimental status
- selected 2010-2026 public references

Not published:

- production source code
- internal validation datasets
- development branches/commit identifiers
- failure diagnostics
- sensitive operation data
- unpublished solver/optimization implementation details