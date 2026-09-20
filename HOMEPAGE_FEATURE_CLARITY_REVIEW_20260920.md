# Homepage feature clarity review — 2026-09-20

## Problem and changes

The previous feature pages reused 10 groups of primary illustrations across 24 capabilities. The 45 primary placements contained only 31 distinct images. Summary, use guidance and technical paragraphs also repeated definitions rather than adding useful information.

- Individually revised the Korean and English decision guidance and technical explanations for all 46 capabilities.
- Folded four repetitive hydrology notes into their technical descriptions while retaining their distinct information.
- Removed automatic promotion of related illustrations into primary images. Shared concepts remain available as explicit reference links.
- Added five purpose-specific bilingual SVGs: Thiessen/IDW, exchange-volume accounting, NetCDF file comparison, FloodViewer analysis views and InputStudio preparation.
- Removed secondary process-family figure repetitions from capability details. Overview material remains available through the model navigation.
- The result is 35 primary placements containing 35 distinct illustrations per language; 10 other capabilities use related-reference links, and the disabled water-quality entry has no active-result illustration.
- Added a build-time content-hash check that rejects identical primary assets even if their filenames differ.
- Existing capability identity, maturity labels, navigation, original PDF, video and presentation images remain unchanged.

## Image decisions

| Previous reuse group | Current treatment |
| --- | --- |
| Spatial rainfall / Thiessen–IDW / elevation QC | Spatial overview kept once; distinct method comparison added; QC links to context |
| Slopes / hillslope routing / channel routing | Domain illustration kept with slopes; routing pages describe different inputs and domains and link to context |
| 1D–2D coupling / exchange balance | Physical exchange illustration and signed-volume accounting schematic separated |
| Run report / output integrity | Lifecycle illustration kept once; report page focuses on comparing run conditions |
| Subbasin reporting / calibration workflow | Spatial reporting illustration kept once; workflow explains diagnosis, case comparison and reassessment |
| River network / junctions | Network illustration kept once; junction page focuses on adjoining-reach continuity |
| Forecast operation / reservoir scenarios | Shared concept kept once; scenario page focuses on comparison conditions and alternatives |
| Local Inertia / Full SWE / flood extras | Floodplain overview kept once; solver scope and additional forcing/transport roles explained separately |
| Hillslope sediment / river sediment | Source-to-transport concept kept once; channel entry distinguishes incoming supply and reach transport |
| NetCDF / FloodViewer / InputStudio | Three different diagrams for file axes, spatial/time analysis and input preparation |

## Verification and visual review

- Static build, local links, bilingual content and original capability labels checked.
- Feature audit: 46 capabilities × 2 languages × desktop/mobile = 184 checks.
- Navigation audit: Korean/English at 1440, 768, 390 and 320 pixels; menu, search, language context, image enlargement, focus and static fallback checked.
- SVG layout audit expanded from 20 to 30 bilingual renders, including text bounds and panel padding.
- Direct visual inspection: all 46 Korean desktop cards and all 46 English mobile cards; new figures also inspected at full size. Representative Korean mobile and full-page navigation captures reviewed.
- The Thiessen comparison's station layout was adjusted during visual review so the depicted selected station is also the nearest one.
- Original PDF, video and 18 presentation images compared byte-for-byte with the preceding version.

These are website and explanatory-content checks. They do not constitute new hydrologic/hydraulic validation, a numerical-engine run, or a new desktop-tool release. The separately requested presentation-file revision and numerical execution validation remain separate follow-up work.

## Continuation

Keep shared overview illustrations as references, not automatic primary-image fallbacks. Review whether each paragraph adds a new decision, mechanism or interpretation check. Exact sentence checks alone cannot detect semantic repetition. Review new images at their actual display sizes and retain existing media access.
