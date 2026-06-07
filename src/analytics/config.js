export const ANALYTICS_CONFIG = {
  debug: import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
  mixpanelToken: import.meta.env.VITE_MIXPANEL_TOKEN ?? '',
  mixpanelApiHost: import.meta.env.VITE_MIXPANEL_API_HOST ?? 'https://api.mixpanel.com',
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID ?? '',
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID ?? '',
  tiktokPixelId: import.meta.env.VITE_TIKTOK_PIXEL_ID ?? '',
  eventEndpoint: import.meta.env.VITE_ANALYTICS_EVENT_ENDPOINT ?? '',
};

export function hasAnalyticsConfig() {
  return Boolean(
    ANALYTICS_CONFIG.mixpanelToken ||
      ANALYTICS_CONFIG.gaMeasurementId ||
      ANALYTICS_CONFIG.metaPixelId ||
      ANALYTICS_CONFIG.tiktokPixelId ||
      ANALYTICS_CONFIG.eventEndpoint,
  );
}
