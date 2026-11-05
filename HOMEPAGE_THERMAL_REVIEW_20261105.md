# Homepage thermal addition — 2026-11-05

## Approved outcome

Add a compact bilingual home introduction and direct link, a 47th capability for coupled soil and river temperature, one process illustration per language, two recorded endpoint charts per language, and implementation/application/distribution distinctions. User approved this proposal and publication in the current session.

## Changes and rationale

| Source / artifact | Change and reason |
|---|---|
| navigation-layout.cjs, thermal-feature.cjs | Home entry; dedicated conceptual figure and trial-result figures inside the new capability. |
| capability-review.json, site-content.json, feature-depth.json, capability-identity.json | A/B/C/D soil and 1D river heat, initial-state generation/reuse, NetCDF output, supported scope and explicit release status. |
| theory-current.json, current-content.cjs | Thermal theory chapter and a status for implemented functionality awaiting official distribution. |
| build-thermal-figures.py, diagrams/thermal | Reproducible editable concept SVGs and endpoint charts from recorded values. No fabricated time series. Optional THERMAL_FONT_PATH selects a local Korean font; THERMAL_PREVIEW_DIR writes optional PNG previews. |
| THERMAL_VALIDATION.md | Public methods, exact plotted values, forcing/window/statistic definitions, evidence scope and outstanding validation. |
| Guidance, use cases, reference mapping | Search, related capabilities and explicit illustration coverage for the added entry. |
| Existing static and browser audits | Extend existing 46-entry coverage to 47, seven detailed theory chapters, and thermal feature checks. Preserve all previous identity, lifecycle and content assertions. |
| Generated HTML, capability atlas, technical/status documents, README, search metadata | Keep bilingual rendered and reusable descriptions aligned. Review/upgrade date is 2026-11-05. |

## Evidence

Reviewed the current thermal handoff updated 2026-11-05 and the engine candidate metadata. Optional thermal implementation remains in an open draft engine candidate. This public homepage update is not an engine merge or an installer release.

Recorded Seomjin baseline/warm trials supply the charts: 12 h on 29 July 2020, post-initial air temperature and dewpoint +15°C, first record preserved. One soil cell yields A/B/C/D differences 5.6757965, 1.3896446, 0.2219543 and 0.000816345°C. One river cell yields 0.4426861°C; the arithmetic mean of 548 wet river cells yields 2.9064604°C. The point and spatial mean are labeled distinctly. These baseline/warm outputs were unchanged in the later snow aggregation correction rerun.

## Validation and remaining issues

Local deterministic site/document generation, current-content checks, capability contract including negative controls, static routes/assets, media consistency and whitespace checks passed. All six thermal SVGs were generated; Korean charts and bilingual process illustrations were visually inspected. Local Chromium launch is blocked by the execution environment's socket restrictions; browser/layout verification runs in repository CI before publication.

Remaining scientific work: observed temperature accuracy, long seasonal response, full-basin multi-rank parity, longer basin restarts and actual Viewer temperature rendering. Direct radiation, evaporation/sublimation latent heat, riverbed conduction and freezing/ice are outside the current implementation. Sunshine trials do not demonstrate direct radiative heating.

## Handoff / next action

Before publication, inspect the latest PR head and all repository checks. Resolve any failures, merge the approved homepage change, then verify Pages deployment and actual bilingual thermal copy/assets. After publication the live entry is /ko/#cap-temperature (English: /#cap-temperature). Official installer feature scope remains governed by MyWater.

## First browser check and correction

The initial English desktop home exceeded the existing compact-height limit after adding longer copy and a third action. Shortened the home copy and retained two actions (overview and temperature), preserving the existing height requirement. The navigation still provides resources/download access. Browser checks are rerun on the corrected head.
