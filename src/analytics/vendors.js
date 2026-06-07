import { ANALYTICS_CONFIG } from './config.js';

const loadedScripts = new Set();
const pendingMixpanelEvents = [];
const DISTINCT_ID_KEY = 'stillscroll_mixpanel_distinct_id';

function loadScript(src, id) {
  if (typeof document === 'undefined') return Promise.resolve();
  if (loadedScripts.has(id) || document.getElementById(id)) return Promise.resolve();

  loadedScripts.add(id);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function debugLog(label, payload) {
  if (ANALYTICS_CONFIG.debug) {
    console.log(`[analytics] ${label}`, payload);
  }
}

function createId(prefix) {
  const random =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${random}`;
}

function getMixpanelDistinctId() {
  if (typeof window === 'undefined') return createId('anon');

  try {
    const existing = window.localStorage.getItem(DISTINCT_ID_KEY);
    if (existing) return existing;

    const next = createId('anon');
    window.localStorage.setItem(DISTINCT_ID_KEY, next);
    return next;
  } catch {
    return createId('anon');
  }
}

function mixpanelEventPayload(eventName, properties) {
  const eventId = properties.event_id ?? createId(eventName);

  return {
    event: eventName,
    properties: {
      ...properties,
      token: ANALYTICS_CONFIG.mixpanelToken,
      distinct_id: properties.distinct_id ?? getMixpanelDistinctId(),
      time: Math.floor(Date.now() / 1000),
      $insert_id: properties.$insert_id ?? eventId,
    },
  };
}

function encodeMixpanelData(payload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function sendDirectMixpanelTrack(eventName, properties) {
  if (!ANALYTICS_CONFIG.mixpanelToken || typeof fetch === 'undefined') return;

  const url = `${ANALYTICS_CONFIG.mixpanelApiHost.replace(/\/$/, '')}/track?verbose=1`;
  const payload = [mixpanelEventPayload(eventName, properties)];
  const body = `data=${encodeURIComponent(encodeMixpanelData(payload))}`;

  debugLog('mixpanel_direct_track_called', {
    eventName,
    url,
    host: ANALYTICS_CONFIG.mixpanelApiHost,
    tokenPresent: Boolean(ANALYTICS_CONFIG.mixpanelToken),
  });

  fetch(url, {
    method: 'POST',
    body: new Blob([body], { type: 'application/x-www-form-urlencoded' }),
    keepalive: true,
  })
    .then(async (response) => {
      const body = await response.text().catch(() => '');
      debugLog('mixpanel_direct_track_response', {
        eventName,
        status: response.status,
        body,
      });
    })
    .catch((error) => {
      debugLog('mixpanel_direct_track_failed', {
        eventName,
        message: error?.message ?? String(error),
      });
    });
}

export function initMixpanel() {
  const token = ANALYTICS_CONFIG.mixpanelToken;
  if (!token || typeof window === 'undefined') {
    debugLog('mixpanel_not_configured', {
      hasToken: Boolean(token),
    });
    return;
  }

  installMixpanelSnippet();

  window.mixpanel.init(token, {
    debug: ANALYTICS_CONFIG.debug,
    track_pageview: false,
    persistence: 'localStorage',
  });

  waitForMixpanelReady();
}

function installMixpanelSnippet() {
  if (!Array.isArray(window.mixpanel) && window.mixpanel?.track) return;

  const mixpanel = [];
  const methods =
    'disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user'.split(
      ' ',
    );

  function addQueuedMethod(target, methodName) {
    const parts = methodName.split('.');
    if (parts.length === 2) {
      target = target[parts[0]];
      methodName = parts[1];
    }

    target[methodName] = function queuedMethod(...args) {
      target.push([methodName, ...args]);
    };
  }

  window.mixpanel = mixpanel;
  mixpanel.people = mixpanel.people || [];
  mixpanel._i = [];
  mixpanel.init = function init(projectToken, config, name) {
    const instance = name ? (mixpanel[name] = []) : mixpanel;
    instance.people = instance.people || [];
    methods.forEach((methodName) => addQueuedMethod(instance, methodName));
    mixpanel._i.push([projectToken, config, name]);
  };
  mixpanel.__SV = 1.2;

  loadScript('https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js', 'mixpanel-sdk').catch(
    (error) => debugLog('mixpanel_load_failed', error),
  );
}

function waitForMixpanelReady() {
  let attempts = 0;
  const poll = window.setInterval(() => {
    attempts += 1;
    const ready = Boolean(window.mixpanel?.__loaded);

    if (ready) {
      window.clearInterval(poll);
      debugLog('mixpanel_ready', {
        pendingEvents: pendingMixpanelEvents.length,
      });
      pendingMixpanelEvents.splice(0).forEach(([eventName, properties]) => {
        window.mixpanel.track(eventName, properties);
      });
    }

    if (attempts >= 80) {
      window.clearInterval(poll);
      debugLog('mixpanel_ready_timeout', {
        mixpanelType: typeof window.mixpanel,
        isArray: Array.isArray(window.mixpanel),
        hasTrack: Boolean(window.mixpanel?.track),
        queuedCalls: Array.isArray(window.mixpanel) ? window.mixpanel.length : undefined,
      });
    }
  }, 250);
}

export function initGoogleAnalytics() {
  const measurementId = ANALYTICS_CONFIG.gaMeasurementId;
  if (!measurementId || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  loadScript(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
    'ga4-sdk',
  ).catch((error) => debugLog('ga4_load_failed', error));
}

export function initMetaPixel() {
  const pixelId = ANALYTICS_CONFIG.metaPixelId;
  if (!pixelId || typeof window === 'undefined') return;

  window.fbq =
    window.fbq ||
    function fbq() {
      window.fbq.queue = window.fbq.queue || [];
      window.fbq.queue.push(arguments);
    };
  window.fbq('init', pixelId);

  loadScript('https://connect.facebook.net/en_US/fbevents.js', 'meta-pixel-sdk').catch(
    (error) => debugLog('meta_load_failed', error),
  );
}

export function initTikTokPixel() {
  const pixelId = ANALYTICS_CONFIG.tiktokPixelId;
  if (!pixelId || typeof window === 'undefined') return;

  window.ttq =
    window.ttq ||
    {
      queue: [],
      load(id) {
        this.queue.push(['load', id]);
      },
      page() {
        this.queue.push(['page']);
      },
      track(...args) {
        this.queue.push(['track', ...args]);
      },
    };
  window.ttq.load(pixelId);

  loadScript('https://analytics.tiktok.com/i18n/pixel/events.js', 'tiktok-pixel-sdk').catch(
    (error) => debugLog('tiktok_load_failed', error),
  );
}

export function sendToVendors(eventName, properties = {}) {
  debugLog(eventName, properties);

  if (typeof window !== 'undefined') {
    if (window.mixpanel?.track) {
      const sdkReady = Boolean(window.mixpanel.__loaded);
      debugLog('mixpanel_track_called', {
        eventName,
        ready: sdkReady,
        isArray: Array.isArray(window.mixpanel),
      });
      window.mixpanel.track(eventName, properties);
      if (!sdkReady) {
        sendDirectMixpanelTrack(eventName, properties);
      }
    } else if (ANALYTICS_CONFIG.mixpanelToken) {
      debugLog('mixpanel_event_queued', {
        eventName,
        pendingEvents: pendingMixpanelEvents.length + 1,
      });
      pendingMixpanelEvents.push([eventName, properties]);
      sendDirectMixpanelTrack(eventName, properties);
    }

    window.gtag?.('event', eventName, properties);

    if (window.fbq) {
      const metaEventName = eventName === 'waitlist_submitted' ? 'Lead' : 'trackCustom';
      if (metaEventName === 'Lead') {
        window.fbq('track', 'Lead', properties);
      } else {
        window.fbq('trackCustom', eventName, properties);
      }
    }

    if (window.ttq) {
      const tikTokEventName = eventName === 'waitlist_submitted' ? 'SubmitForm' : eventName;
      window.ttq.track?.(tikTokEventName, properties);
    }
  }

  if (ANALYTICS_CONFIG.eventEndpoint) {
    const body = JSON.stringify({ event: eventName, properties });
    const url = ANALYTICS_CONFIG.eventEndpoint;

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch((error) => debugLog('event_endpoint_failed', error));
    }
  }
}
