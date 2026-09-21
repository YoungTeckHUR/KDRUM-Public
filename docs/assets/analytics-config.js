/* K-DRUM visitor analytics configuration.
 * GoatCounter is enabled for the public K-DRUM website.
 * This file contains no secrets or visitor-identifying credentials.
 */
window.KDRUM_ANALYTICS = Object.freeze({
  enabled: true,
  provider: 'goatcounter', // 'ga4' or 'goatcounter'
  ga4MeasurementId: '',
  goatCounterEndpoint: 'https://kdrum-public.goatcounter.com/count',
  respectDoNotTrack: true,
  trackCapabilityOpen: true,
  trackMyWaterClick: true,
  trackMediaOpen: true,
  trackLanguageSwitch: true
});
