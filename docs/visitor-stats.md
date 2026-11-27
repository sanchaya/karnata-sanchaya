# Visitor statistics (administrators only)

The live portal counts visitors without cookies, IP addresses or accounts. Nothing is shown to readers; administrators see
a card at the top of **Admin > Overview** (live now, visitors today, total visitors, total page views, last 14 days), or can
call `GET /api/administration/visitors?days=30` while signed in as an administrator.

## How it works

- `src/visit-ping.js` creates a random id in the browser (`localStorage`) and a per-tab session id (`sessionStorage`). On
  every page change the app sends `POST /api/visits/ping` (`kind: view`), and once a minute while the tab is visible a
  heartbeat (`kind: beat`).
- `server/visits.js`: the server stores only an HMAC of the id (`DOCUMENT_ENCRYPTION_KEY` is the secret; without it a
  random per-process secret is used, so hashes then change on restart). It keeps no IP, no user agent and no link to an
  account. Bots and obvious monitors are ignored by user agent, and the endpoint is rate-limited (240 a minute per IP).
- **Live now** = sessions with a heartbeat in the last 2 minutes, held in memory in the running server process. It is
  per process (a restart clears it; two instances behind a balancer would each count their own) and not stored.
- **Totals and days** live in MariaDB: `site_visitors` (one row per hashed visitor, with first/last seen and counts) and
  `site_visitor_days` (one row per visitor per UTC day). Total visitors = rows in `site_visitors`. A "visit" is a new
  session; a "view" is a page change.
- Not collected: the static GitHub Pages edition (no server), and anyone whose browser sends Do Not Track or Global
  Privacy Control. Clearing site data creates a new visitor, so "total visitors" counts browsers, not people.

## Deploying

Run `npm run db:migrate` (adds migration `016_site_visits.sql`) and redeploy. The ping uses the same origin, so the
existing CSP `connect-src 'self'` covers it. Cloudflare may cache nothing here: the endpoint is a POST.

`site_visitor_days` grows by one row per visitor per day. If it gets large, delete old days; the totals in
`site_visitors` are unaffected:

```sql
DELETE FROM site_visitor_days WHERE day < DATE_SUB(UTC_DATE(), INTERVAL 400 DAY);
```

## Privacy note

Add one sentence to the public privacy text before turning this on in production: the portal counts anonymous visits
(a random browser id, hashed on the server) to understand usage, and honours Do Not Track.

## Clicks to partner sites

Pages that link to a partner's site (the Recreation page and the Aata-Paata page link to TolluGatti, a Mysuru platform that recreates these games online) count each click, tagged `recreation` or `aata-paata`, with `sendOutbound` (`src/visit-ping.js`). The server (`POST /api/visits/outbound`, table `outbound_clicks`, migration 017) stores only the day, the partner and the page the link was on: no visitor id, no IP address, no user agent. It is off on the static edition and when the browser sends Do Not Track or Global Privacy Control, and bots are ignored. The administrator visitor panel shows the 14-day total per partner. Only partners listed in `OUTBOUND_TARGETS` (`server/visits.js`) can be counted. The outbound link also carries `utm_source=karnata.sanchaya.net`, so the partner can see arrivals from us in their own analytics. Counts are clicks on our link, not visits to their site. Run `npm run db:migrate` after deploying.

The TolluGatti mark on the Recreation and Aata-Paata pages (`public/partners/tollugatti.png`, 128 px, taken from their site icon) is their trademark. Keep it only while TolluGatti agrees; ask them to confirm in writing and record the reply here.
