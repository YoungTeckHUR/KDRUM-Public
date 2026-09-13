# K-DRUM p18 public media inventory

Publication candidate: **2026-09-12 / p18**

This folder is the versioned home for the public presentation derivatives used by the K-DRUM GitHub Pages visual guide.

Included public assets:

- `K-DRUM_v3.x_p18.pdf` - presentation PDF
- `KDRUM_Nature_to_Digital_22s_web.mp4` - web-optimized 22-second overview video
- `07_Digital_Reference.png` - digital-interpretation reference image
- `manifest.json` - version and asset manifest

Feature-card images are stored separately under:

`docs/assets/presentation/2026-09-12-p18/`

The editable PPTX source is intentionally excluded from the public website repository. The overview video is an AI-generated concept visualization and must not be presented as a direct K-DRUM numerical simulation result.

## Package verification

The PDF, MP4 and reference PNG retain their supplied bytes from
`KDRUM_GitHub_Publication_Package_20260912.zip`. The original ZIP SHA-256 is
`09ebd3027d9d2141bcbfa276ee9a8df6494d88229390c4320369ba64092de330`.
The PDF contains 22 physical pages. The web MP4 is 22 seconds at 1280 × 720.

The 18 gallery JPEGs are corrected derivatives of physical PDF pages **4-21**,
in that order. The supplied JPEG package had a one-page offset: the first image
contained the contents page and the final Core Value slide was absent. The
corrected derivatives therefore do not retain the supplied JPEG bytes. The PDF,
MP4 and reference PNG have not been edited.

`manifest.json` records the source PDF checksum, one-based physical PDF page,
feature number, exact English slide heading, derivative checksum and rendering
settings. The PDF's visible footer numbering is offset from its physical page
position; feature 01 is physical PDF page 4, with footer `03 / 21`. Mapping uses
physical pages, not footer numbers.

| Feature | JPEG | Physical PDF page | Slide heading |
|---|---|---:|---|
| 01 | `01_model_overview.jpg` | 4 | MODEL OVERVIEW |
| 02 | `02_water_cycle.jpg` | 5 | WATERSHED WATER CYCLE |
| 03 | `03_spatial_heterogeneity.jpg` | 6 | SPATIAL DISTRIBUTED HYDROLOGY |
| 04 | `04_end_to_end_workflow.jpg` | 7 | END-TO-END WORKFLOW |
| 05 | `05_rainfall_input.jpg` | 8 | PRECIPITATION INPUT |
| 06 | `06_snow_processes.jpg` | 9 | SNOW ACCUMULATION & MELT |
| 07 | `07_continuous_hydrology.jpg` | 10 | CONTINUOUS HYDROLOGY |
| 08 | `08_initial_state_adjustment.jpg` | 11 | INITIAL STATE ADJUSTMENT |
| 09 | `09_hot_start.jpg` | 12 | HOT START & STATE INHERITANCE |
| 10 | `10_runoff_routing.jpg` | 13 | RUNOFF ROUTING |
| 11 | `11_subbasin_calibration.jpg` | 14 | SUB-BASIN ANALYSIS & CALIBRATION |
| 12 | `12_solver_hierarchy.jpg` | 15 | HYDRAULIC SOLVER HIERARCHY |
| 13 | `13_river_structures_operations.jpg` | 16 | RIVER NETWORK, STRUCTURES & RESERVOIR OPERATION |
| 14 | `14_flood_1d_2d.jpg` | 17 | 1D–2D COUPLING & MULTI-RESOLUTION FLOODING |
| 15 | `15_sediment_tracer_particles.jpg` | 18 | SEDIMENT, TRACER & PARTICLE TRACKING |
| 16 | `16_parallel_computing.jpg` | 19 | LARGE-SCALE & PARALLEL COMPUTING |
| 17 | `17_outputs_verification.jpg` | 20 | OUTPUT, VERIFICATION & MODEL PERFORMANCE |
| 18 | `18_core_value_integration.jpg` | 21 | K-DRUM CORE VALUE |

## Derivative rendering and mapping verification

Each whole PDF page is rasterized to **1600 × 900 RGB** without cropping, added
padding or content changes. The renderer is PyMuPDF 1.26.7, using a matrix of
`1600 / page.rect.width` by `900 / page.rect.height`, RGB color and no alpha.
Pillow 11.3.0 encodes JPEG with quality 90, subsampling 0, optimization disabled
and progressive encoding disabled. The source page size is 960 × 540 points.

The public-content audit enforces the original media and corrected derivative
checksums. The source-mapping audit separately checks the physical PDF page and
slide heading, rerenders all 18 pages and compares them with the gallery images.
This prevents a valid checksum from hiding an incorrect source-page selection.
It publishes labeled slide montages and machine-readable results as an Actions
artifact, allowing a reviewer to compare all 18 image contents with the table.

From the repository root, the same read-only source check runs with:

```sh
python -m pip install PyMuPDF==1.26.7 Pillow==11.3.0
node .github/scripts/p18-source-audit.cjs
```

`PYTHON` can select the Python executable and `AUDIT_DIR` can select the report
directory. The audit writes evidence only; it does not replace gallery assets.

The root-level PDF, MP4 and PNG have been moved here, with no duplicate root
copies retained. The gallery and enlarged view use the individual JPEGs listed
in `manifest.json`; no generated sprite is required.

## Browser verification

The p18 browser audit covers English and Korean at desktop, tablet and mobile widths:
home-page navigation, all 18 images and enlarged views, PDF response and link,
decoded MP4 playback, seeking and completion, language switching, and return
navigation. It runs in the homepage browser-smoke workflow and publishes its
screenshots and results as an Actions artifact.

The branch preview has been tested under the `/KDRUM-Public/` URL prefix in
Chrome and Edge. This is pre-merge verification. The live GitHub Pages media
URL requires a subsequent approved merge and Pages deployment; a passing branch
test does not claim that the public site has already been updated.
