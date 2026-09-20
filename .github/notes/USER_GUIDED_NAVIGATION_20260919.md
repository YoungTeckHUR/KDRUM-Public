# User-guided homepage review — 2026-09-19/20

The approved design replaces the long homepage with a short introduction, five top-level destinations, eight capability groups, and one selected feature. On mobile the contents collapse. Technical descriptions remain available in a disclosure.

All 46 features were individually reviewed against the existing public capability content. Every feature has bilingual guidance for purpose/expected insight, interpretation checks and image reading, plus related features. Existing feature names, technical descriptions, steps and availability remain unchanged. The authoritative review matrix is `capability-guidance.cjs`, keyed by every existing feature ID.

45 features have one primary concept illustration; the disabled water-quality module deliberately has none. Shared figures identify their limited scope. Concept illustrations are explicitly distinguished from actual outputs and software screenshots. Four retained hydrology illustrations have Korean labels, disclosed in English captions. No synthetic performance results or unsupported capabilities were added. The 16 bilingual SVGs use language-appropriate font sizes to avoid text crossing panel boundaries.

Key distinctions clarified: rainfall coverage versus filling missing data; infiltration/runoff versus routing; warm-up versus checkpoint restart; basin water balance versus coupling conservation versus fit metrics; conservative transport versus inactive reactive water quality; input preparation versus output viewing; Local Inertia versus Full SWE; development/research paths versus established Core functions.

The browser audits now test the approved navigation contract instead of the superseded all-feature card grid. Coverage includes exact preservation of all original feature descriptions and statuses, bilingual guidance, all primary/supplementary image links, all 46 sidebar selections, related links, deep links, history, language switching, keyboard/disclosures, search/IME, clipboard fallback, image dialog focus/zoom/Escape, no-JavaScript access, FAQ, contrast, responsive text and page bounds. The existing media/PDF/video audit remains a separate gate.

Local results: navigation 8 language/width combinations; readability 16 combinations; feature-by-feature detail checks 184 cases; all 16 rendered SVG label/panel checks; original capability contract, static and public-content audits passed. Local serverless Chromium cannot open the PDF viewer; full media validation remains required in CI with regular Chrome. Generated HTML and SVG output must remain deterministic.

Scope excludes unrelated QR/version-banner/private-site work. Public deployment follows the normal pull request and required checks.
