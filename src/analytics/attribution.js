const STORAGE_KEY = 'stillscroll_attribution_v1';

const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'fbclid',
  'ttclid',
  'gclid',
];

function readStoredAttribution() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeStoredAttribution(value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage can fail in private browsing; attribution should never block UX.
  }
}

function currentUrlMetadata() {
  if (typeof window === 'undefined') return {};

  return {
    landing_url: window.location.href,
    landing_path: window.location.pathname,
    referrer: document.referrer || '',
  };
}

export function captureAttribution() {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const current = {};

  TRACKED_PARAMS.forEach((name) => {
    const value = params.get(name);
    if (value) current[name] = value;
  });

  const stored = readStoredAttribution();
  const next = {
    ...stored,
    ...currentUrlMetadata(),
    ...current,
    first_seen_at: stored.first_seen_at ?? new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
  };

  writeStoredAttribution(next);
  return next;
}

export function getAttribution() {
  return {
    ...readStoredAttribution(),
    ...currentUrlMetadata(),
  };
}
