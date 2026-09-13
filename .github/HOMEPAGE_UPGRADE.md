# September 2026 public website upgrade

Review baseline: `1dad76207e5b3cf67c0c4e83b2904c2883441400`.

The English home, Korean home, visual guide and model FAQ now share a light
blue/white design, typography, spacing, navigation and image viewer. Static
HTML replaces the former chain of runtime DOM rewrites and style overrides.
The homepage introduces the model, searchable capabilities, result reading,
program roles, published research and official distribution in that order.

## Content and assets

- The 45 existing capability summaries, current-status descriptions and raw
  maturity values are retained in `docs/assets/site-content.json`. The separate
  unpublished 1D viewer remains a distinct 46th entry.
- Six technical diagram families are supplied as twelve Korean/English SVGs.
  They have transparent outer backgrounds, conceptual labels, readable text
  and explicit development boundaries. No plotted numeric validation results
  are invented.
- Three research explanations and six bilingual FAQs are grounded in the
  public sources listed in `docs/assets/site-editorial.json`. Historical
  publication results do not certify current development features.
- The 18 p18 images, PDF, MP4 and reference image retain their original paths
  and bytes. The video remains explicitly labeled as an AI concept visualization.
- The four existing canonical URLs and reciprocal English/Korean homepage
  hreflang cluster are retained. Sitemap dates reflect this content update.
- Old public assets remain available for existing asset links, but the four
  active pages load only `site.css` and `site.js` for the new interface.

## Editing and preview

Edit the shared content JSON, editorial JSON, SVGs, `docs/assets/site.css`,
`docs/assets/site.js` or `.github/scripts/build-site.cjs`, then regenerate:

```sh
node .github/scripts/build-site.cjs
node .github/scripts/site-static-audit.cjs
node .github/scripts/pages-preview.cjs
```

The preview is served at `http://127.0.0.1:8000/KDRUM-Public/`. `PORT` overrides
the local port. The generator uses Node built-ins; no build packages are needed.
Generated HTML is committed so GitHub Pages can serve it directly. CI checks
that regeneration produces no HTML diff.

## Verification

- Browser audit: English/Korean at 320, 390, 768 and 1440 px; all 46 expandable
  entries at mobile/desktop widths; eight category filters, search and empty
  state; section links, preserved legacy hashes and direct capability hashes.
- Accessibility checks: native keyboard details, dialog Escape and focus
  return, image magnification and panning, sampled text contrast of at least
  4.5:1, reduced-motion behavior and 200% CSS-zoom reflow. These checks are not
  a complete WCAG conformance certification or a native browser-zoom audit.
- With JavaScript disabled, both homes retain all 46 native details. The media
  gallery defaults to Korean and preserves original asset links.
- Media audit: 18 decoded images and enlargements in each language/viewport,
  PDF HTTP response/byte equality/link opening, actual MP4 decoding, playback,
  seeking and ending, byte-range responses and bilingual navigation.
- Existing SEO and public-content workflows validate metadata and original
  p18 checksums. No source-model repository, technical maturity document,
  private model input, or numerical implementation is changed.

Run browser checks with Playwright and Chromium installed; the media check
uses full Chrome for MP4 support. Set `BASE_URL` to the preview above and run
`site-audit.cjs` and `media-p18-audit.cjs` in `.github/scripts/`. Set `AUDIT_DIR`
outside the repository for local screenshots and JSON results. CI retains
the corresponding artifacts under each workflow run.

This is a review-only delivery. Merge, Pages deployment and any subsequent
Google crawling are separate steps. Search visibility or ranking is not
guaranteed by these changes.
