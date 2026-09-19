# Capability discovery and sharing — 2026-09-19

Baseline: `6531b06180fc39fed6a55a22a9ee139de1463bbf` (accepted PR #59 readability polish).

## Reason and scope

The initial forcing-category filter could hide matching features elsewhere when a first-time visitor searched. Capability names were searchable only in the currently displayed language, re-entering an unchanged feature fragment did not reliably reopen a hidden/closed card, and language switches lost the current feature. One English related-concept link still had Korean UI text.

## Changes

- Preserve the default five forcing cards and all accepted layout/images.
- A typed query searches all categories; selecting a category afterwards refines the results. Explain this behavior next to the existing search field.
- Index existing Korean and English capability names plus local explanations; normalize case, whitespace and hyphens and support multiple query terms. Do not add scientific claims or synonyms from unverified sources.
- Add category counts and one reset/show-all control.
- Add stable feature-link copying inside existing detail resource links, with an honest address-bar fallback when clipboard access is denied.
- Preserve current feature/section context across Korean/English navigation; restore same-fragment feature entry after filtering or closing.
- Translate the English related-concept action label.

## Preservation and verification

All 46 names, descriptions, inputs/computation/output steps, supplementary notes, maturity and availability text remain unchanged in site-content.json. Original images/PDF/video/QR, analytics configuration, FAQ, media page, and main-page sections outside the capabilities section remain unchanged. Core model code is outside scope.

The build preparation asserts unchanged protected content/assets and deterministic output. Existing readability CI calls the navigation regression audit after its own checks, avoiding an additional permanent workflow. New tests cover six widths in both languages, global/bilingual/multi-term search, category refinement, reset, input-method composition, safe text input, same-hash restoration, granted/denied clipboard behavior, language continuity, and no-JS access. Existing 184 capability checks remain active.

## Status and rollback

Implementation is prepared on a review branch. Merge only after final review-branch tests pass, then verify live deployment. Revert this change through a new commit/PR to restore the accepted baseline; do not reset history. This maintenance note is not published on the homepage.
