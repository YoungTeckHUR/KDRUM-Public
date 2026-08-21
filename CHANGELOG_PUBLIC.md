# K-DRUM Public Information Changelog

## 2026-08-22 — Light, image-led homepage experience

Rebuilt the English and Korean public homepage after reviewing the deployed page from a first-time user perspective. The redesign focuses on immediate comprehension, clear click affordances, visible download actions and concept imagery rather than a dark text-heavy catalogue.

Updated:

- changed the page-wide presentation to predominantly light surfaces with K-water blue reserved for primary actions and selected states
- retained the watershed hero image while adding a prominent MyWater free-download action and clearer secondary paths
- added a four-card **what users obtain** section for watershed runoff, river water level/discharge, flood inundation and water-balance reporting
- added a four-panel result-concept gallery for spatial maps, hydrographs/time series, water-balance summaries and one-dimensional river-hydraulics results
- explicitly labelled those result graphics as concept illustrations rather than numerical results from a specific basin
- added a capability-specific concept illustration, technical code and **View details / 상세 보기** action to all 46 interactive capability cards
- added concept illustrations to all seven program cards and six research/application cards while keeping those cards visibly static and non-clickable
- rebuilt navigation around capabilities, model workflow, result concepts, research, programs and free download
- rebuilt resource cards as clear links with visible action labels and strengthened the MyWater K-Series primary download card
- kept the mobile header non-sticky, retained two-column capability navigation and prevented horizontal overflow
- corrected the capability-dialog header and close-button contrast after direct mobile screenshot review
- added dedicated Chromium checks for light surfaces, concept-image coverage, click/static distinction, target sizes and dialog-header contrast
- replaced post-merge verification with an exact-commit EN/KO desktop/mobile test of the deployed light homepage

The public boundary remains unchanged: no production model source, restricted basin data, operational reservoir rules, unpublished numerical settings, private validation data or viewer binaries are published.

## 2026-08-22 — Homepage visual-system and responsive-layout review

Re-audited the rendered English and Korean homepage as a complete visual system on desktop and mobile, rather than relying only on functional smoke tests.

Updated:

- replaced the nearly uniform navy/cyan presentation with a restrained K-water-aligned palette using blue, teal, green, amber and violet accents to distinguish functional groups and public maturity states
- converted the eight capability-group controls from a horizontally scrolling strip into a four-column desktop and two-column mobile navigation grid
- replaced generic three-bar capability decorations with compact, capability-specific technical symbols and status-colored top rules
- strengthened section hierarchy through alternating surfaces, clearer separators, consistent spacing, and improved title/body contrast
- numbered the five model-workflow stages and simplified the mobile workflow presentation
- reorganized the seven analysis/support programs from an unbalanced 3+3+1 layout into a balanced 3+4 desktop composition, while retaining a single-column mobile reading order
- redesigned research cards and converted the desktop research history into a horizontal timeline
- elevated the MyWater K-Series area into a clear official distribution/download callout, with a shorter mobile summary and more prominent K-DRUM access button
- refined capability dialogs with a stronger header, numbered process steps, differentiated status/caution panels and improved mobile sizing
- removed the sticky mobile header to prevent content overlap and aligned the K-DRUM and K-water marks on one mobile hero row
- added a dedicated Chromium visual-design audit that captures full-page and section screenshots, checks color/layout hooks, verifies all 46 capability symbols, enforces the balanced program grid, and detects mobile overflow or excessive MyWater height
- expanded post-merge GitHub Pages verification to check the deployed English/Korean desktop and mobile visual system for the exact merge commit

No production source code, restricted model inputs, operational rules or unpublished numerical details were added.

## 2026-08-21 — Water-resources terminology, MyWater guidance and 1D results viewer

Refined the public homepage terminology and program inventory so that public-facing Korean wording follows commonly used water-resources and civil-engineering terminology rather than internal development shorthand.

Updated:

- standardized the primary Korean model description as **물리적 기반의 격자단위 분포형 강우유출모형**, consistent with the MyWater K-Series description
- replaced developer-oriented Korean wording such as 1D/2D, QA, report, tracer and patch with one-dimensional/two-dimensional, quality/verification, result reporting, material tracking and locally refined analysis wording where appropriate
- retained established product names such as FloodViewer, InputStudio and NetCDF without partial translation
- added the separately developed **1차원 하천수리 결과 뷰어** to the public program inventory and capability interface, while clearly stating that it is not yet published to the public GitHub repositories
- expanded the visible capability count from 45 repository-tracked items to **46 public-facing capabilities**, including the separate 1D results viewer
- strengthened the MyWater section to explain that K-DRUM is available through K-water's K-Series technical-software public-access program and may be downloaded/used free of charge subject to the current MyWater terms of use
- corrected the K-Series terms link to the current MyWater technical-software terms page
- removed DOM-observer-based copy synchronization from consideration; dynamic terminology updates are limited to the capability tab/card interaction path
- extended local and deployed Chromium QA to verify the 46-item inventory, the 1D viewer detail, MyWater/free-use guidance, canonical Korean model terminology, and preservation of product names

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