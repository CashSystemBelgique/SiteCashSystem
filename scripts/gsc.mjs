// Google Search Console CLI for cashsystem.be
//
// First run: opens a browser for OAuth consent (you must do this once).
// Token is then cached in token.json — subsequent runs are fully unattended.
//
// Usage examples:
//   node scripts/gsc.mjs --type query --days 28 --country BEL
//   node scripts/gsc.mjs --type page --days 90
//   node scripts/gsc.mjs --type indexstatus --url https://www.cashsystem.be/monnayeur-fastfood/
//   node scripts/gsc.mjs --type sitemaps
//
// Output: JSON to stdout (pipe to a file or read directly).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { google } from 'googleapis';
import { createServer } from 'node:http';
import { URL } from 'node:url';
import open from 'node:child_process';

const CREDENTIALS_PATH = new URL('../credentials.json', import.meta.url);
const TOKEN_PATH = new URL('../token.json', import.meta.url);
const SITE_URL = 'sc-domain:cashsystem.be'; // adjust to 'https://www.cashsystem.be/' if URL-prefix property
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

// ---------- CLI parsing ----------
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) {
      const key = cur.slice(2);
      const next = arr[i + 1];
      const val = (next && !next.startsWith('--')) ? next : true;
      acc.push([key, val]);
    }
    return acc;
  }, [])
);
const TYPE = args.type || 'query';
const DAYS = parseInt(args.days || '28', 10);
const COUNTRY = (args.country === 'all' || args.country === true) ? null : (args.country || 'BEL');
const URL_FILTER = args.url || null;
const SITE = args.site || SITE_URL;
const LIMIT = parseInt(args.limit || '500', 10);

// ---------- Auth ----------
async function loadCredentials() {
  if (!existsSync(CREDENTIALS_PATH)) {
    throw new Error(`credentials.json missing. Place your OAuth client JSON at ${CREDENTIALS_PATH.pathname.slice(1)}`);
  }
  const raw = await readFile(CREDENTIALS_PATH, 'utf8');
  const json = JSON.parse(raw);
  return json.installed || json.web;
}

function makeOAuthClient(creds) {
  return new google.auth.OAuth2(creds.client_id, creds.client_secret, 'http://127.0.0.1:53682/oauth2callback');
}

async function loadToken() {
  if (!existsSync(TOKEN_PATH)) return null;
  const raw = await readFile(TOKEN_PATH, 'utf8');
  return JSON.parse(raw);
}

async function saveToken(token) {
  await writeFile(TOKEN_PATH, JSON.stringify(token, null, 2), 'utf8');
}

async function authorizeFirstTime(oauth) {
  const authUrl = oauth.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent', response_type: 'code' });
  console.error('\n[gsc] First-time OAuth setup. Open this URL in your browser to consent:\n');
  console.error('  ' + authUrl);
  console.error('\n[gsc] Waiting for callback on http://127.0.0.1:53682 ...\n');

  // Best-effort auto-open (Windows). Use shell:true with quoted URL so cmd doesn't truncate at &.
  try {
    open.spawn(`cmd /c start "" "${authUrl}"`, { shell: true, detached: true, stdio: 'ignore' }).unref();
  } catch { /* ignore */ }

  return new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const u = new URL(req.url, 'http://127.0.0.1:53682');
        if (u.pathname !== '/oauth2callback') {
          res.writeHead(404); res.end('Not found'); return;
        }
        const code = u.searchParams.get('code');
        const error = u.searchParams.get('error');
        if (error) {
          res.writeHead(400); res.end(`Error: ${error}`);
          server.close(); reject(new Error(error)); return;
        }
        if (!code) {
          res.writeHead(400); res.end('Missing code'); server.close();
          reject(new Error('Missing code')); return;
        }
        const { tokens } = await oauth.getToken(code);
        oauth.setCredentials(tokens);
        await saveToken(tokens);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>OK</h1><p>Authentication successful. You can close this tab.</p>');
        server.close();
        console.error('[gsc] Token saved to token.json. Future runs will be silent.');
        resolve();
      } catch (err) {
        try { res.writeHead(500); res.end(String(err)); } catch {}
        server.close(); reject(err);
      }
    });
    server.listen(53682, '127.0.0.1');
  });
}

async function getAuthClient() {
  const creds = await loadCredentials();
  const oauth = makeOAuthClient(creds);
  const token = await loadToken();
  if (token) {
    oauth.setCredentials(token);
    return oauth;
  }
  await authorizeFirstTime(oauth);
  return oauth;
}

// ---------- Queries ----------
function dateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

async function querySearchAnalytics(searchconsole, dim) {
  const filters = [];
  if (COUNTRY) filters.push({ dimension: 'country', operator: 'equals', expression: COUNTRY });
  const body = {
    startDate: dateNDaysAgo(DAYS),
    endDate: dateNDaysAgo(1),
    dimensions: [dim],
    rowLimit: LIMIT,
    dimensionFilterGroups: filters.length ? [{ filters }] : undefined,
  };
  const res = await searchconsole.searchanalytics.query({ siteUrl: SITE, requestBody: body });
  return res.data;
}

async function getSitemaps(searchconsole) {
  const res = await searchconsole.sitemaps.list({ siteUrl: SITE });
  return res.data;
}

async function getIndexStatus(searchconsole, urlInspectionUrl) {
  // url_inspection lives on a different sub-API
  const inspect = google.searchconsole({ version: 'v1', auth: searchconsole._options.auth });
  const res = await inspect.urlInspection.index.inspect({
    requestBody: { siteUrl: SITE, inspectionUrl: urlInspectionUrl },
  });
  return res.data;
}

// ---------- Main ----------
(async () => {
  const auth = await getAuthClient();
  const searchconsole = google.webmasters({ version: 'v3', auth });

  let result;
  switch (TYPE) {
    case 'query':
      result = await querySearchAnalytics(searchconsole, 'query');
      break;
    case 'page':
      result = await querySearchAnalytics(searchconsole, 'page');
      break;
    case 'country':
      result = await querySearchAnalytics(searchconsole, 'country');
      break;
    case 'device':
      result = await querySearchAnalytics(searchconsole, 'device');
      break;
    case 'date':
      result = await querySearchAnalytics(searchconsole, 'date');
      break;
    case 'sitemaps':
      result = await getSitemaps(searchconsole);
      break;
    case 'indexstatus': {
      if (!URL_FILTER) throw new Error('--url required for indexstatus');
      result = await getIndexStatus(searchconsole, URL_FILTER);
      break;
    }
    default:
      throw new Error(`Unknown --type ${TYPE}`);
  }

  console.log(JSON.stringify(result, null, 2));
})().catch(err => {
  console.error('[gsc] Error:', err.message);
  if (err.errors) console.error(err.errors);
  process.exit(1);
});
