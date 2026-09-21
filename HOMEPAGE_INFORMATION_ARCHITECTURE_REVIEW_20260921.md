# K-DRUM Homepage Information Architecture Review — 2026-09-21

## Purpose

This review restructures the public K-DRUM homepage around visitor questions and analysis workflows without changing the numerical maturity of any capability or expanding the public-source boundary.

## Primary homepage entry points

1. Watershed hydrology — spatial rainfall, infiltration, soil water, runoff generation and routing
2. Continuous hydrology and water balance — storage continuity, evapotranspiration, snow, deep storage and basin accounting
3. River hydraulics and flooding — 1D river hydraulics, structures, 1D–2D exchange and 2D floodplain analysis
4. Input and result workflow — InputStudio, execution/output formats and result viewers

## Detailed capability organization

The detailed capability inventory remains available under eight technical areas:

- rainfall input and QA
- watershed hydrology and state
- routing and river terrain
- water balance, calibration and result QA
- 1D river hydraulics, structures and dams
- 1D–2D coupling and floodplain
- research and extensions
- input, runtime and result tools

Research and experimental functions are intentionally separated from established Core hydrology. Estuary2DV is presented in the research/extension context.

## Explanation changes

- Basin water balance is described as a complete accounting of rainfall, evapotranspiration, runoff, storage change and internal transfers, not only a residual number.
- InputStudio is described as the project-authoring and pre-run consistency environment linking domain, spatial data, time series, river geometry, structures, boundaries and scenarios to engine inputs.
- FloodViewer is described as a result-analysis environment connecting maps and time series for inundation location, onset, maximum depth, velocity and selected-location changes.
- Public feature names place the Korean/general concept before specialist abbreviations where practical.
- User-facing maturity badges are simplified while the underlying public status codes remain unchanged.

## Numerical-method content

The existing numerical guide is retained. It distinguishes equation approximation level from numerical discretization and covers kinematic, diffusion/local-inertia and full dynamic/SWE concepts, finite-volume/finite-difference ideas, explicit/implicit time treatment, Courant considerations, boundaries, wet/dry handling and conservation checks.

## Validation boundary

This change is an information-architecture and explanatory-content review. It does not constitute:

- new numerical-engine validation
- a maturity promotion
- universal basin certification
- publication of production source code, restricted basin inputs, operational rules, private validation data or unpublished numerical settings

The public maturity boundary was re-reviewed on 2026-09-21 and remains conservative unless supported by separate validation evidence.
