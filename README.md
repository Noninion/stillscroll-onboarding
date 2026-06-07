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

## TikTok Ads

Set the production domain in Vercel:

```txt
VITE_PUBLIC_SITE_DOMAIN=your-production-domain.com
VITE_TIKTOK_PIXEL_ID=D8INNQJC77UFV4UICA50
```

Generate the TikTok destination URL:

```bash
VITE_PUBLIC_SITE_DOMAIN=your-production-domain.com npm run ads:tiktok-url
```

Use the printed URL as the TikTok ad destination. It includes:

```txt
utm_source=tiktok
utm_medium=paid_social
utm_campaign=__CAMPAIGN_NAME__
utm_id=__CAMPAIGN_ID__
utm_content=__CID_NAME__
utm_term=__AID_NAME__
utm_placement=__PLACEMENT__
```

The app captures these params automatically for Mixpanel, Kit waitlist payloads, and conversion metadata.

Funnel events are sent to TikTok as:

```txt
step_viewed -> ViewContent
next_button_clicked -> ClickButton
waitlist_submitted -> Lead, Subscribe, CompleteRegistration
```

These events include:

```txt
content_id
content_type=product
content_name
currency=USD
event_id=<event_id>
```

After a successful waitlist submit, the app calls `ttq.identify` with SHA-256 hashed:

```txt
email
external_id
```

The Next button is sent to TikTok as:

```txt
ClickButton
```

with step-specific `content_id`, `content_name`, `content_type`, `value`, `currency`, and `event_id`.

## Checks

```bash
npm run lint
npm run build
```
