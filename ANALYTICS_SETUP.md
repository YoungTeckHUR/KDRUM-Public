# K-DRUM Visitor Analytics Setup

K-DRUM public visitor analytics is currently enabled with **GoatCounter**.

- Public site: `https://youngteckhur.github.io/KDRUM-Public/`
- Analytics endpoint: `https://kdrum-public.goatcounter.com/count`
- No secret key is stored in the repository.
- Do Not Track is respected by default.

The analytics layer is additive. It does not replace homepage copy, capability descriptions, visual assets, layout, SEO metadata, or download links.

## Active collection

The current public layer can record:

- page views
- capability-detail opens using the existing capability ID/group/status
- MyWater download-link clicks
- Visual Guide / PDF / video opens
- Korean / English language switches

No capability text is changed for tracking.

## Configuration

The active configuration is in `docs/assets/analytics-config.js`:

- `enabled: true`
- `provider: 'goatcounter'`
- `goatCounterEndpoint: 'https://kdrum-public.goatcounter.com/count'`

To stop analytics without changing the homepage, set `enabled: false`.

## Optional alternative — Google Analytics 4

If a future approved migration to GA4 is required:

1. Create or select a GA4 web data stream for the public K-DRUM site.
2. Copy the Measurement ID in the form `G-XXXXXXXXXX`.
3. Change `docs/assets/analytics-config.js` to:
   - `enabled: true`
   - `provider: 'ga4'`
   - `ga4MeasurementId: 'G-...'`

## Privacy and operating boundary

- Do Not Track is respected by default.
- The analytics configuration contains no secret keys.
- Analytics activation should remain consistent with the applicable K-water/public-site privacy policy.
- Individual visitor identity is not displayed by the K-DRUM website.

## Verification after deployment

1. complete GoatCounter email verification;
2. open English and Korean homepages;
3. open several capability details;
4. open the Visual Guide;
5. optionally click the MyWater link;
6. confirm the GoatCounter dashboard receives page/event data;
7. confirm existing homepage CI and live Pages verification remain green.
