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

All three media files and all 18 feature-card JPEGs match the supplied
`KDRUM_GitHub_Publication_Package_20260912.zip` byte for byte. The original ZIP
SHA-256 is `09ebd3027d9d2141bcbfa276ee9a8df6494d88229390c4320369ba64092de330`.
The PDF contains 22 pages; the feature gallery contains 18 separate 1600 × 900
images. The web MP4 is 22 seconds at 1280 × 720. Exact asset checksums are enforced
by the public-content audit.

The root-level PDF, MP4 and PNG have been moved here, with no duplicate root
copies retained. The gallery and enlarged view use the individual JPEGs listed
in `manifest.json`; no generated sprite is required.

## Browser verification

The p18 browser audit covers English and Korean at desktop and mobile widths:
home-page navigation, all 18 images and enlarged views, PDF response and link,
decoded MP4 playback, seeking and completion, language switching, and return
navigation. It runs in the homepage browser-smoke workflow and publishes its
screenshots and results as an Actions artifact.

The branch preview has been tested under the `/KDRUM-Public/` URL prefix in
Chrome and Edge. This is pre-merge verification. The live GitHub Pages media
URL requires a subsequent approved merge and Pages deployment; a passing branch
test does not claim that the public site has already been updated.
