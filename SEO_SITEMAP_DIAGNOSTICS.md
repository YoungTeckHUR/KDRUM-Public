# Sitemap and SEO diagnosis — 2026-09-12

Scope: KDRUM-Public GitHub Pages metadata only. Baseline: `345bf11` (PR #47).
No technical content, feature maturity statements, scripts, styles or media changed.

## Public response evidence before this PR

Observed at 2026-09-12 10:54 UTC from the client network. These are public HTTP
checks, not Googlebot fetch logs or proof of Search Console processing.

| URL under https://youngteckhur.github.io/KDRUM-Public/ | HTTP | Content-Type | Redirect |
| --- | --- | --- | --- |
| sitemap.xml | 200 | application/xml | none |
| / (property home) | 200 | text/html; charset=utf-8 | none |
| ko/ | 200 | text/html; charset=utf-8 | none |
| media.html | 200 | text/html; charset=utf-8 | none |
| seo-kdrum.html | 200 | text/html; charset=utf-8 | none |

- XML parses successfully with the sitemap and XHTML namespaces.
- UTF-8 decodes strictly; no BOM; XML declaration specifies version 1.0 / UTF-8.
- Four unique absolute HTTPS URLs retain the case-sensitive `/KDRUM-Public/`
  project base path; all four are public, with no query or fragment.
- All lastmod values have valid YYYY-MM-DD syntax. Home dates were stale
  (`2026-08-21`) relative to the September 12 homepage changes; this PR corrects them.
- gzip response: 356 bytes transferred, 1,523 bytes after decompression.
  Identity response with `Cache-Control: no-cache`: 1,523 bytes, no Content-Encoding.
  Both decoded bodies have SHA-256
  `e907325d1b81a4d2fbe798bb0e347f4f576a876ec1408a6a253022e0519020e6`.
- Headers: `Cache-Control: max-age=600`, `Vary: Accept-Encoding`, matching
  weak/strong ETag value `6aa52a68-5f3`, Last-Modified September 12 10:33:12 GMT.
  Cache HIT and fresh MISS returned identical content. Repository content matches
  the public response after normalizing checkout line endings.
- No reproduced XML, compression, redirect, base-path or stale-body fault.
  Sitemap structure is retained; rewriting valid XML is not an established fix.

## Search Console interpretation

The preceding authenticated inspection found the English home indexed, with a
successful smartphone Googlebot fetch and matching declared/selected canonical.
The other three URLs had indexing requests accepted. Sitemap resubmission was
accepted but its final status remained “Couldn't fetch”, discovered pages 0.
This PR does not claim those remote statuses have changed.

The precise sitemap fetch failure remains unproven: Search Console did not expose
a detailed response/error and these client checks cannot reproduce Google's network
path. The earlier host-root robots.txt 404 is not evidence of a crawl block; the
already indexed home and successful Googlebot fetch argue against a blanket block.
Google reads robots.txt at the host root, not the project subdirectory, and treats
404 as no robots restrictions. No robots or host-root repository change is proposed.

## Metadata changes

| Page | Canonical | hreflang |
| --- | --- | --- |
| English home | Existing self-canonical retained | en / ko / x-default retained |
| Korean home | Self-canonical added | Matching reciprocal en / ko / x-default added |
| Visual Guide | Self-canonical added, without UI language query | None: one bilingual interactive page |
| SEO landing | Existing self-canonical retained | Removed nonreciprocal mapping to English home |

The two homepages cover corresponding model/features/research/platform resources.
The SEO landing is a separate summary, not the English home's translated counterpart.
No alternate URLs are invented for the Visual Guide's client-side language state.

## Validation and review

- SEO CI validates XML, encoding, unique public URL coverage, local file existence,
  lastmod dates, exactly one self-canonical per page, indexability metadata and
  reciprocal language clusters in HTML and sitemap.
- Removed the old runtime audit's fixed sitemap date requirement: technical status
  review dates and page modification dates have different meanings. Its technical
  status check remains unchanged.
- Local comparison against baseline confirms all four HTML bodies, scripts and
  styles are unchanged. Existing runtime and public-content checks also run.
- Consult the PR checks for the authoritative remote CI result at its head SHA.

Leave this PR unmerged for GPT review. A PR branch does not update production Pages.
The existing sitemap is technically suitable for submission; repeated submission
now is unnecessary. After approved merge and Pages deployment, verify HTTP 200,
new dates and canonical tags, then resubmit once if the error persists. Recheck the
sitemap after 24–48 hours and indexing after 3–7 days. These are suggested review
intervals, not processing guarantees. Acceptance does not guarantee indexing or rank.

References:
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec
