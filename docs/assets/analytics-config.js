/* K-DRUM visitor analytics configuration.
 * Safe default: analytics is disabled until an approved provider is configured.
 * This file contains no secrets.
 */
window.KDRUM_ANALYTICS = Object.freeze({
  enabled: false,
  provider: 'none', // 'ga4' or 'goatcounter'
  ga4MeasurementId: '',
  goatCounterEndpoint: '',
  respectDoNotTrack: true,
  trackCapabilityOpen: true,
  trackMyWaterClick: true,
  trackMediaOpen: true,
  trackLanguageSwitch: true
});
