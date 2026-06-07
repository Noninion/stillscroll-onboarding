# Stillscroll Onboarding

Vite/React onboarding funnel for the Stillscroll waitlist.

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open:

```txt
http://localhost:5173/
```

## Test Waitlist Submission Locally

Use the mock waitlist server when you want to test the browser submission flow without sending a real subscriber to Kit/ConvertKit.

In terminal 1:

```bash
npm run dev:mock-waitlist
```

This starts:

```txt
http://127.0.0.1:8787/api/waitlist
```

In terminal 2, start Vite:

```bash
npm run dev
```

Submit the funnel email form. You should see:

- a `POST` request to `http://localhost:5173/api/waitlist` in browser Network tools
- `[waitlist] submit_success` in the browser console when debug logging is enabled
- `[mock-waitlist] received submission` in terminal 1

Optional: choose a different mock port:

```bash
MOCK_WAITLIST_PORT=8790 npm run dev:mock-waitlist
MOCK_WAITLIST_TARGET=http://127.0.0.1:8790 npm run dev
```

## Production Waitlist

Vercel uses:

```txt
api/waitlist.js
```

Required Vercel environment variable:

```txt
KIT_API_KEY=your_kit_v4_api_key
```

In production, the frontend defaults to:

```txt
/api/waitlist
```

So `VITE_WAITLIST_ENDPOINT` is optional for production.

## Checks

```bash
npm run lint
npm run build
```
