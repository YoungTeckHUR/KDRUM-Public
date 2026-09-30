# K-DRUM Public Roadmap

This is a high-level public roadmap. It intentionally excludes internal schedules, unpublished algorithms, sensitive operational logic, and repository-specific implementation details.

## Near-term development priorities

1. **Hydraulic reliability**
   - strengthen 1D dynamic-wave river-network regression
   - expand branch/confluence network testing
   - consolidate cross-section, river-axis and longitudinal bed-elevation consistency while preserving measured-section shape

2. **1D-2D integration**
   - continue bidirectional coupling validation for the current dynamic-wave 1D–local-inertial 2D path
   - verify floodplain return flow and exchange water balance
   - broaden full-period and observation-based validation across multiple development configurations

3. **2D flood analysis**
   - improve domain, barrier, structure, and multi-resolution handling
   - maintain separate specialized Full-SWE capability for cases that require it

4. **Water-balance and QA**
   - strengthen basin-scale accounting
   - maintain explicit water-balance QA and acceptance criteria
   - improve automated build/regression evidence

5. **High-resolution geometry**
   - develop reusable channel-bed and virtual-channel geometry workflows
   - maintain alignment among high-resolution terrain, river axes, cross sections, and hydraulic domains

6. **User environment**
   - continue K-DRUM InputStudio spatial-input construction, guided authoring and precheck development
   - continue K-DRUM FloodViewer release-candidate validation
   - improve interoperable NetCDF-centered output

## Research track

### Estuary and salinity
K-DRUM Estuary2DV will remain an independently verifiable research prototype until its numerical tests are sufficiently mature for controlled coupling with river hydraulics and structure operation.

## Public-release principle

A feature may exist in source code before it is described as an established public capability.

Public status is promoted only when the development team determines that the corresponding validation evidence is sufficient.
