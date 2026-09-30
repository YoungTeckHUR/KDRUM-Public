# K-DRUM Homepage GitHub Update Review — 2026-10-01

## Purpose

This review checks the public K-DRUM website against the current integrated Core, InputStudio and sample-basin development state. It updates public descriptions without exposing production source code, private basin inputs, internal solver tuning, development-only diagnostics or restricted operating information.

## Reflected in the public website

### 1. InputStudio spatial-input construction

The public InputStudio description now covers the integrated spatial-input workflow from source-data checks and DEM preprocessing through watershed hydrology, stream-network construction, the K-DRUM calculation grid, and land-cover/soil/depth preparation.

Accepted spatial outputs are treated as authoritative project inputs only after their lineage and consistency are verified. The public copy does not imply that every independent processing function has a final GUI surface.

### 2. Guided real-basin project authoring

InputStudio now distinguishes engine-input syntax/readability from actual project-build completeness. Provisional stations, structures, cross sections or other placeholders are not described as completed physical basin data merely because they can be parsed.

The public description also distinguishes workspace saving from materializing K-DRUM engine inputs and keeps Base/scenario authoring separated.

### 3. One-dimensional river hydraulics and measured cross sections

The current public wording clarifies the measured-section geometry contract:

- measured X-Z data retain their relative cross-section shape;
- longitudinal hydraulic bed elevation controls vertical placement at each hydraulic cell;
- this is different from arbitrarily smoothing, narrowing or reshaping measured sections.

The public page continues to describe one-dimensional dynamic-wave river-network hydraulics as active development.

### 4. Bidirectional one-dimensional/two-dimensional coupling

The current Core development path includes bidirectional dynamic-wave 1D–local-inertial 2D exchange. Controlled development validation has demonstrated actual exchange in both directions and consistent transfer accounting.

The public maturity label remains **VALIDATED DEVELOPMENT**. This does not claim universal basin certification, full-period completion for every configuration, or observation-based inundation accuracy.

## Intentionally not promoted as current public capability

At the review date, newer expert hydraulic Review diagnostics and the new Studio-native unified Result & Review viewer remain separate open/draft development work. They are therefore not presented as completed current capabilities on the public homepage.

The existing FloodViewer and separate 1D river-hydraulics viewer descriptions remain in place until the newer Studio integration reaches an accepted main-line boundary.

## Public inventory decision

The public capability inventory remains at **46 items**. The October update improves the description of existing capabilities rather than creating new cards for implementation refinements.

## Status decision

No maturity level was promoted by this review:

- 1D dynamic-wave river-network hydraulics — **ACTIVE DEVELOPMENT**
- InputStudio — **ACTIVE DEVELOPMENT**
- bidirectional 1D–2D coupling — **VALIDATED DEVELOPMENT**
- FloodViewer — **RELEASE CANDIDATE**

The public baseline remains **v3.x** so the website can describe the current development/test line without implying that rapidly changing internal patch identifiers are identical to the separately governed MyWater distribution.
