/* global console, process, URL */

const siteDomain = process.env.VITE_PUBLIC_SITE_DOMAIN || process.env.PUBLIC_SITE_DOMAIN;

if (!siteDomain) {
  console.error('Set VITE_PUBLIC_SITE_DOMAIN first, for example:');
  console.error('VITE_PUBLIC_SITE_DOMAIN=your-domain.com npm run ads:tiktok-url');
  process.exit(1);
}

const normalizedDomain = siteDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
const url = new URL(`https://${normalizedDomain}`);

url.searchParams.set('utm_source', 'tiktok');
url.searchParams.set('utm_medium', 'paid_social');
url.searchParams.set('utm_campaign', '__CAMPAIGN_NAME__');
url.searchParams.set('utm_id', '__CAMPAIGN_ID__');
url.searchParams.set('utm_content', '__CID_NAME__');
url.searchParams.set('utm_term', '__AID_NAME__');
url.searchParams.set('utm_placement', '__PLACEMENT__');

console.log(url.toString());
