/* global process */

const KIT_SUBSCRIBERS_URL = 'https://api.kit.com/v4/subscribers';

function compactJson(value) {
  if (!value || Object.keys(value).length === 0) return undefined;
  return JSON.stringify(value);
}

function getKitConfig() {
  return {
    apiKey: process.env.KIT_API_KEY,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey } = getKitConfig();
  if (!apiKey) {
    return res.status(500).json({
      error: 'Kit waitlist integration is not configured',
    });
  }

  const {
    name = '',
    email = '',
    attribution = {},
    submittedAt,
    ...answers
  } = req.body ?? {};
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanName = String(name).trim();

  if (!cleanEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const fields = {
    source: 'stillscroll_waitlist',
    submitted_at: submittedAt ?? new Date().toISOString(),
    landing_url: attribution.landing_url,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    ttclid: attribution.ttclid,
    fbclid: attribution.fbclid,
    stillscroll_answers: compactJson(answers),
    stillscroll_attribution: compactJson(attribution),
  };
  const kitPayload = {
    email_address: cleanEmail,
    first_name: cleanName || undefined,
    fields: Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    ),
  };

  const response = await fetch(KIT_SUBSCRIBERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
    },
    body: JSON.stringify(kitPayload),
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    return res.status(response.status).json({
      error: 'Kit subscribe request failed',
      details: body,
    });
  }

  return res.status(200).json(body);
}
