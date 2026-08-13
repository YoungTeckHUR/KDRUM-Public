# K-DRUM Capabilities

This page separates established model-family capabilities from functions that are still in development.

## Established hydrologic capabilities

Published K-DRUM research supports the following high-level descriptions:

- physically based grid-distributed rainfall-runoff modeling
- spatially distributed rainfall forcing, including radar/grid rainfall applications
- surface and subsurface runoff analysis
- kinematic-wave routing for overland/channel flow
- Green-Ampt infiltration
- long-term runoff simulation
- evapotranspiration-related water-balance processes
- snow accumulation and snowmelt extensions
- basin-scale hydrologic analysis
- MPI-based parallelization for large-domain computation

## Hydraulic development

Current development extends K-DRUM toward integrated watershed hydraulics:

- cross-section-based 1D dynamic-wave river hydraulics
- river networks with branching and confluence topology
- bidirectional river-floodplain exchange
- 2D flood-inundation computation
- levee/barrier and hydraulic-domain representation
- hydraulic structures
- reservoir/dam-operation scenarios
- coupled hydraulic water-balance diagnostics
- multi-resolution terrain and hydraulic grids

These features are under active validation. Refer to [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) for maturity labels.

## High-resolution terrain and channel geometry

Current research/development includes:

- high-resolution DEM use
- river centerline and hydraulic-axis consistency
- cross-section preparation
- virtual channel-bed generation for reaches with insufficient bed-survey information
- separation of reusable ChannelBed calculation logic from K-DRUM-specific adapters
- preparation of geometry for 1D and 2D hydraulic simulation

## Data and output modernization

Current development includes:

- NetCDF-based integrated outputs
- standardized result exchange between the engine and viewer
- project-level metadata and QA
- reduced dependence on file-by-file manual editing

## InputStudio

K-DRUM InputStudio is being developed around a canonical project representation rather than treating every legacy engine file as an independent user-editing surface.

Publicly describable goals/functions include:

- project configuration
- rainfall and meteorological time series
- river reaches and cross sections
- hydraulic structures
- 1D-2D interfaces
- spatial/2D domains
- scenario authoring
- topology and consistency checks
- generation of engine-compatible K-DRUM inputs

## FloodViewer

K-DRUM FloodViewer is intended to provide integrated visualization of hydrologic and hydraulic results.

Its current public maturity is **release candidate**.

## Estuary2DV

K-DRUM Estuary2DV is an independent longitudinal-vertical (x-z) research prototype for:

- estuarine hydrodynamics
- salinity transport
- tidal boundary interaction
- future exchange with river hydraulics and hydraulic-structure operation

It remains **experimental** and should not be described as a production K-DRUM function.
