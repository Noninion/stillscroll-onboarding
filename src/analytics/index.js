import { captureAttribution, getAttribution } from './attribution.js';
import { ANALYTICS_CONFIG, hasAnalyticsConfig } from './config.js';
import {
  initGoogleAnalytics,
  initMetaPixel,
  initMixpanel,
  initTikTokPixel,
  identifyMixpanelUser,
  sendToVendors,
} from './vendors.js';

let initialized = false;
let emailStartedTracked = false;
const recentEvents = new Map();

function runtimeMetadata() {
  if (typeof window === 'undefined') return {};

  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    user_agent: window.navigator.userAgent,
    site_domain: ANALYTICS_CONFIG.siteDomain,
  };
}

function cleanProperties(properties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null),
  );
}

function createEventId(eventName) {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${eventName}_${Date.now()}_${random}`;
}

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  captureAttribution();
  if (!hasAnalyticsConfig()) return;

  initMixpanel();
  initGoogleAnalytics();
  initMetaPixel();
  initTikTokPixel();
}

export function analyticsPayload(properties = {}) {
  return cleanProperties({
    ...getAttribution(),
    ...runtimeMetadata(),
    ...properties,
  });
}

export function trackEvent(eventName, properties = {}) {
  const payload = analyticsPayload({
    ...properties,
    event_id: createEventId(eventName),
    event_time: new Date().toISOString(),
    event_source: 'web',
  });
  const signature = JSON.stringify({
    eventName,
    step_key: payload.step_key,
    answer_field: payload.answer_field,
    answer_value: payload.answer_value,
  });
  const now = Date.now();
  const lastSentAt = recentEvents.get(signature) ?? 0;

  if (now - lastSentAt < 150) return;

  recentEvents.set(signature, now);
  sendToVendors(eventName, payload);
}

export function trackPageView() {
  trackEvent('page_view');
}

export function trackFunnelStarted(stepMeta) {
  trackEvent('funnel_started', stepProperties(stepMeta));
}

export function stepProperties(stepMeta) {
  if (!stepMeta) return {};
  return {
    step_key: stepMeta.key,
    step_title: stepMeta.title,
    step_index: stepMeta.index,
    step_number: stepMeta.index + 1,
    step_progress: stepMeta.progress,
  };
}

export function trackStepViewed(stepMeta) {
  trackEvent('step_viewed', stepProperties(stepMeta));
}

export function trackStepCompleted(stepMeta, extra = {}) {
  trackEvent('step_completed', {
    ...stepProperties(stepMeta),
    ...extra,
  });
}

export function trackNextButtonClicked(stepMeta, extra = {}) {
  trackEvent('next_button_clicked', {
    ...stepProperties(stepMeta),
    ...extra,
  });
}

export function trackAnswerUpdated({ field, value, previousValue, stepMeta }) {
  if (field === 'email' || field === 'waitlistSubmitted') return;

  trackEvent('answer_updated', {
    ...stepProperties(stepMeta),
    answer_field: field,
    answer_value: value,
    previous_answer_value: previousValue,
  });
}

export function trackEmailStarted(stepMeta) {
  if (emailStartedTracked) return;
  emailStartedTracked = true;
  trackEvent('email_started', stepProperties(stepMeta));
}

export function trackWaitlistSubmitted(payload) {
  trackEvent('waitlist_submitted', payload);
}

export function trackWaitlistSubmitFailed(payload) {
  trackEvent('waitlist_submit_failed', payload);
}

export function identifyLead({ email, name, properties = {} }) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail) return;

  identifyMixpanelUser(cleanEmail, {
    ...analyticsPayload(properties),
    email: cleanEmail,
    name: name?.trim() || undefined,
    $name: name?.trim() || undefined,
    lead_email_domain: cleanEmail.split('@')[1] ?? '',
    lead_identified_at: new Date().toISOString(),
  });
}
