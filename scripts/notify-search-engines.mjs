// Ping IndexNow with all URLs from sitemap.xml
// Used by both Netlify build plugin (onSuccess) and manual `npm run notify`
import { readFile } from 'node:fs/promises';

const KEY = '056cd9541c4b45c922e2dc0383de7477';
const HOST = 'www.cashsystem.be';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = new URL('../sitemap.xml', import.meta.url);

async function extractUrls() {
  const xml = await readFile(SITEMAP_PATH, 'utf8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map(m => m[1].trim());
}

async function pingIndexNow(urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  return { status: res.status, ok: res.ok, statusText: res.statusText };
}

export async function notifySearchEngines() {
  const urls = await extractUrls();
  if (urls.length === 0) {
    console.log('[indexnow] No URLs found in sitemap, skipping.');
    return { skipped: true };
  }
  const result = await pingIndexNow(urls);
  console.log(`[indexnow] Pinged ${urls.length} URLs -> HTTP ${result.status} ${result.statusText}`);
  return result;
}

// Allow direct execution: `node scripts/notify-search-engines.mjs`
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('notify-search-engines.mjs')) {
  notifySearchEngines().catch(err => {
    console.error('[indexnow] Error:', err);
    process.exit(1);
  });
}
