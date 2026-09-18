# K-DRUM Visitor Analytics Setup

This repository keeps visitor analytics **disabled by default**. The public website remains unchanged until an approved analytics provider is explicitly enabled in `docs/assets/analytics-config.js`.

## Why this is additive

The analytics layer does not replace homepage copy, the 46 capability descriptions, visual assets, layout, SEO metadata, or download links. Existing content remains the source of truth.

The existing `docs/assets/site.js` only loads two local analytics files. With `enabled: false`, no external analytics script is requested and no visitor data is transmitted.

## Supported providers

### Option A — Google Analytics 4

1. Create or select a GA4 web data stream for:
   `https://youngteckhur.github.io/KDRUM-Public/`
2. Copy the Measurement ID in the form `G-XXXXXXXXXX`.
3. Edit only `docs/assets/analytics-config.js`:
   - `enabled: true`
   - `provider: 'ga4'`
   - `ga4MeasurementId: 'G-...'`

### Option B — GoatCounter

1. Create a GoatCounter site for the public K-DRUM website.
2. Copy its endpoint in the form:
   `https://YOURCODE.goatcounter.com/count`
3. Edit only `docs/assets/analytics-config.js`:
   - `enabled: true`
   - `provider: 'goatcounter'`
   - `goatCounterEndpoint: 'https://YOURCODE.goatcounter.com/count'`

## Events prepared for future collection

When analytics is enabled, the optional layer can record:

- page views
- capability detail opens using the existing capability ID/group/status
- MyWater download-link clicks
- Visual Guide / PDF / video opens
- Korean / English language switches

No capability text is changed for tracking.

## Privacy and operating boundary

- Do Not Track is respected by default.
- The analytics configuration contains no secret keys.
- Provider activation should follow the applicable K-water/public-site privacy policy.
- If analytics must be stopped, set `enabled: false`; the homepage continues to work normally.

## Verification after activation

After an approved provider is configured:

1. open English and Korean homepages;
2. open several capability details;
3. open the Visual Guide;
4. click the MyWater link;
5. confirm the provider dashboard receives page/event data;
6. confirm existing homepage CI and live Pages verification remain green.
