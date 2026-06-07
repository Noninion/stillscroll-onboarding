/* global process */

import http from 'node:http';

const PORT = Number(process.env.MOCK_WAITLIST_PORT ?? 8787);
const HOST = process.env.MOCK_WAITLIST_HOST ?? '127.0.0.1';

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function summarizeSubmission(payload) {
  const email = String(payload.email ?? '').trim().toLowerCase();
  return {
    email,
    emailDomain: email.split('@')[1] ?? '',
    name: payload.name ?? '',
    submittedAt: payload.submittedAt,
    answerKeys: Object.keys(payload).filter(
      (key) => !['email', 'name', 'submittedAt', 'attribution'].includes(key),
    ),
    attribution: payload.attribution ?? {},
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.url !== '/api/waitlist') {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const rawBody = await readBody(req);
    const payload = rawBody ? JSON.parse(rawBody) : {};
    const email = String(payload.email ?? '').trim();

    if (!email) {
      sendJson(res, 400, { error: 'Email is required' });
      return;
    }

    const summary = summarizeSubmission(payload);
    console.log('[mock-waitlist] received submission');
    console.log(JSON.stringify(summary, null, 2));

    sendJson(res, 200, {
      subscriber: {
        id: `mock_${Date.now()}`,
        email_address: email.toLowerCase(),
        first_name: payload.name ?? '',
        state: 'active',
        created_at: new Date().toISOString(),
        fields: {},
      },
      mock: true,
    });
  } catch (error) {
    console.error('[mock-waitlist] request failed', error);
    sendJson(res, 400, { error: 'Invalid JSON body' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[mock-waitlist] listening on http://${HOST}:${PORT}/api/waitlist`);
});
