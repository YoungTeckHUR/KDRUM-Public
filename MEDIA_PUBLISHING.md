# K-DRUM public media workflow

This document defines the public-media publication pattern for K-DRUM.

## Current publication candidate

- Version: `p18-20260912`
- Source date: 2026-09-12
- Working branch: `media/p18-20260912`
- Website page: `docs/media.html`
- Manifest: `docs/media/2026-09-12-p18/manifest.json`

## Public files for this version

```text
docs/
├─ media.html
├─ assets/
│  └─ presentation/
│     └─ 2026-09-12-p18/
│        ├─ 01_model_overview.jpg
│        ├─ 02_water_cycle.jpg
│        ├─ 03_spatial_heterogeneity.jpg
│        ├─ 04_end_to_end_workflow.jpg
│        ├─ 05_rainfall_input.jpg
│        ├─ 06_snow_processes.jpg
│        ├─ 07_continuous_hydrology.jpg
│        ├─ 08_initial_state_adjustment.jpg
│        ├─ 09_hot_start.jpg
│        ├─ 10_runoff_routing.jpg
│        ├─ 11_subbasin_calibration.jpg
│        ├─ 12_solver_hierarchy.jpg
│        ├─ 13_river_structures_operations.jpg
│        ├─ 14_flood_1d_2d.jpg
│        ├─ 15_sediment_tracer_particles.jpg
│        ├─ 16_parallel_computing.jpg
│        ├─ 17_outputs_verification.jpg
│        └─ 18_core_value_integration.jpg
└─ media/
   └─ 2026-09-12-p18/
      ├─ K-DRUM_v3.x_p18.pdf
      ├─ KDRUM_Nature_to_Digital_22s_web.mp4
      ├─ 07_Digital_Reference.png
      └─ manifest.json
```

The editable PPTX is intentionally not part of the public website package. Keep editable source presentations in a controlled working repository or local project archive, and publish PDF/image/video derivatives here after review.

## Capability wording policy

The visual gallery must not erase the distinction between:

1. established K-DRUM Core capabilities,
2. linked/extended K-Series functions, and
3. functions that are still in development, verification, or research.

Examples that should retain a development/research qualifier where appropriate include advanced 1D-2D coupling, dam-break/EAP extensions, groundwater linkage details, and density/stratification-oriented estuary extensions.

The overview video is an AI-generated concept visualization for model introduction. It must not be described as a direct K-DRUM numerical simulation result.

## Future versions

Do not overwrite a published media folder. Add a new dated version, for example:

```text
docs/assets/presentation/2026-10-xx-p19/
docs/media/2026-10-xx-p19/
```

Then update `docs/media.html` and the version manifest after review. This keeps earlier public descriptions traceable through Git history.

## Final publication checklist

- [ ] All 18 feature images are present and readable.
- [ ] Web MP4 plays in Chrome/Edge/Safari-compatible HTML5 playback.
- [ ] Presentation PDF opens from the media page.
- [ ] AI concept-video disclaimer is visible.
- [ ] No editable PPTX is exposed in the public website package.
- [ ] Feature wording is consistent with `CAPABILITIES.md` and `DEVELOPMENT_STATUS.md`.
- [ ] Add a `Visual Guide` / `시각자료` link to the English and Korean home-page navigation after assets are confirmed.
- [ ] Verify the GitHub Pages deployment before merging to `main`.
