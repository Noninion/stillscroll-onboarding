/**
 * Waitlist API — submit a user's details for the early-bird waitlist.
 *
 * ─────────────────────────────────────────────────────
 *  TO WIRE UP A REAL BACKEND:
 *  Replace the stub below with a fetch() to your endpoint.
 *
 *  Examples:
 *    — REST API:   set VITE_WAITLIST_ENDPOINT=/api/waitlist
 *    — Mailchimp:  subscribe via their Audiences API
 *    — ConvertKit: create subscriber via /v3/subscribers
 *    — Loops.so:   POST https://app.loops.so/api/v1/contacts/create
 * ─────────────────────────────────────────────────────
 *
 * @typedef {{ name: string, email: string, goals: string[],
 *             currentHours: number, targetHours: number }} WaitlistPayload
 *
 * @param {WaitlistPayload} data
 * @returns {Promise<void>}  Resolves on success, throws on failure.
 */
function debugLog(label, payload) {
  if (import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_DEBUG === 'true') {
    console.log(`[waitlist] ${label}`, payload);
  }
}

export async function submitToWaitlist(data) {
  const endpoint =
    import.meta.env.VITE_WAITLIST_ENDPOINT ||
    (import.meta.env.PROD ? '/api/waitlist' : '');

  if (endpoint) {
    debugLog('submit_start', {
      endpoint,
      hasEmail: Boolean(data?.email),
      emailDomain: data?.email?.split('@')[1]?.toLowerCase() ?? '',
      envEndpointConfigured: Boolean(import.meta.env.VITE_WAITLIST_ENDPOINT),
      prod: import.meta.env.PROD,
    });

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    debugLog('submit_response', {
      endpoint,
      status: res.status,
      ok: res.ok,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      debugLog('submit_failed', {
        endpoint,
        status: res.status,
        body,
      });
      throw new Error(body || `Server error ${res.status}`);
    }

    debugLog('submit_success', { endpoint });
    return;
  }

  debugLog('submit_stub_used', {
    reason: 'No waitlist endpoint configured',
    prod: import.meta.env.PROD,
  });

  // ── Stub: simulates ~1 second of network latency ─────────────────────────
  await new Promise((resolve) => setTimeout(resolve, 1050));

  // To test error-handling UI, uncomment:
  // throw new Error('Stub: forced error');

  if (import.meta.env.DEV) {
    console.log('[waitlist] submitted:', data);
  }
}
