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
export async function submitToWaitlist(data) {
  const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT;

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(body || `Server error ${res.status}`);
    }

    return;
  }

  // ── Stub: simulates ~1 second of network latency ─────────────────────────
  await new Promise((resolve) => setTimeout(resolve, 1050));

  // To test error-handling UI, uncomment:
  // throw new Error('Stub: forced error');

  if (import.meta.env.DEV) {
    console.log('[waitlist] submitted:', data);
  }
}
