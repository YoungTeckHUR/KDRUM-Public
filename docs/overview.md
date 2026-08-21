# K-DRUM Overview

**K-DRUM: K-water Grid-based Distributed Rainfall rUnoff Model**

K-DRUM began as a physically based, grid-unit distributed rainfall-runoff model and has an established research record in Korean and international watershed applications.

The current development direction broadens the model from watershed rainfall-runoff simulation toward integrated river hydraulics and flood-inundation analysis.

## Conceptual development layers

1. **Watershed rainfall-runoff hydrology**
   - spatial rainfall
   - infiltration
   - soil-water processes
   - evapotranspiration
   - snow accumulation and snowmelt
   - surface/subsurface runoff

2. **Runoff and channel routing**
   - kinematic-wave hillslope runoff routing
   - kinematic-wave channel discharge routing
   - dynamic-wave river-network development

3. **River hydraulics and flood-inundation interaction**
   - cross-section-based one-dimensional river hydraulics
   - bidirectional river-floodplain exchange
   - two-dimensional flood-inundation analysis
   - hydraulic structures
   - dam / reservoir operation scenarios

4. **High-resolution terrain and river geometry**
   - terrain
   - river alignment
   - cross sections
   - channel-bed generation

5. **Input preparation, result output and analysis programs**
   - InputStudio
   - NetCDF-centered result output
   - FloodViewer
   - separate 1D River Hydraulics Results Viewer (under development; not yet published to the public GitHub repositories)
   - automated verification / regression checks

6. **Research extensions**
   - sediment transport
   - dye / conservative material tracking
   - longitudinal-vertical estuary hydrodynamics
   - salinity transport

The public repository intentionally describes these layers without disclosing the production implementation.

Historical publications used several expanded English forms for the K-DRUM acronym. The current public site uses **K-water Grid-based Distributed Rainfall rUnoff Model** as the canonical expansion while preserving historical publication wording in citations.
