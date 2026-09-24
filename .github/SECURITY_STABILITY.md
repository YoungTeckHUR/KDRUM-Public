# Public website security and stability

Scope: KDRUM-Public only. The numerical-model source and other repositories are not changed.

- The public rainfall presentation is IDW-only. Thiessen is not a missing feature to restore. Historical review notes and original p18 binaries remain archival; active HTML, maintained diagrams and CI must not require Thiessen.
- All four generated pages use a meta Content Security Policy. Scripts are limited to this origin and the fixed GoatCounter script URL; inline scripts/event handlers, plugins, forms and base-URL overrides are blocked. Inline styles remain allowed because the existing image zoom and page styles use them.
- GitHub Pages response headers are not controlled by this repository. Meta CSP does not implement frame-ancestors, HSTS, X-Frame-Options or nosniff. No claim of those additional headers is made. Existing host HTTPS/HSTS is unchanged.
- GoatCounter v5 uses the vendor-published SHA-384 SRI value and anonymous CORS. Changing its bytes will block loading. Source: https://www.goatcounter.com/help/countjs-versions
- Analytics runs only on youngteckhur.github.io, with the fixed kdrum-public endpoint. Local previews do not send analytics. The unused GA4 implementation has been removed; enabling another provider requires an explicit policy and privacy review.
- Page queries, fragments, search input and referrers are excluded from the analytics payload. The external service still receives network metadata. The footer links to the provider's privacy explanation and offers a browser-local opt-out. Do Not Track and Global Privacy Control override opt-in. Storage access failures disable analytics. A late script load rechecks the choice before counting.
- GitHub Actions use full commit SHAs. Node audit dependencies use package-lock.json and npm ci --ignore-scripts. Playwright 1.55.1 fixes GHSA-7mvr-c777-76hp affecting the previous 1.55.0 browser installer. Version bumps remain reviewed changes, with monthly Dependabot proposals.
- Read-only checkouts do not retain Git credentials. The legacy materialization workflow keeps write access only for its specified media branch. Jobs have 30-minute limits; live readiness requests have network timeouts.
- Security regression checks cover CSP enforcement in an actual browser, blocked optional analytics, opt-out/DNT/GPC/storage failure and delayed-load behavior. Existing full feature, diagram, media, SEO, checksum and layout checks remain enabled.

Repository branch protection, account two-factor authentication and administrative bypass rules were not changed. Merge/deployment approval remains separate from this PR.
