# Berunda, the portal's question-answering guide

Berunda answers visitors' questions about Karnataka's rulers, inscriptions, places and sources **only from the published atlas records**. It works on the live portal and on the GitHub Pages edition, because the browser always calls the live API (`VITE_COMMUNITY_API_URL`).

## How it works
1. The browser asks `POST /api/berunda/ask` with the question, the language and the last few turns.
2. The server loads the latest published dataset revision from MariaDB (`dataset_snapshots`) and keeps a search index in memory. The index is rebuilt only when a newer revision appears.
3. The server calls the Anthropic Messages API with two tools, `search_records` and `get_record`. The model may only state facts that tool results contain, cites record ids, and must say when a record is awaiting review.
4. The reply carries `answer` plus `sources` (only ids the tools really returned). The browser links each source to the matching portal page.

Code: `server/berunda.js` (index, search, limits, agent loop), the routes in `server/app.js`, `src/Berunda.jsx` and `src/BerundaArt.jsx` (widget and artwork).

## Turn it on
Set these on the **server** (never in the browser build) and restart:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Required. Without it `/api/berunda/status` reports `enabled:false` and the widget stays hidden everywhere. |
| `BERUNDA_MODEL` | Optional. Defaults to `claude-haiku-5-5`; use a larger model for richer answers at higher cost. |
| `BERUNDA_DAILY_LIMIT` | Optional. Questions per day for the whole service (default 300). |
| `BERUNDA_PER_VISITOR_LIMIT` | Optional. Questions per visitor per 10 minutes (default 12). |

`PUBLIC_MESSAGE_ALLOWED_ORIGINS` already lists the GitHub Pages origins; Berunda reuses that list for cross-origin access. The Pages build already points at `https://karnata.sanchaya.net` through `VITE_COMMUNITY_API_URL` in `.github/workflows/deploy.yml`.

## Safety and cost
- Questions are capped at 500 characters and the history at 6 turns.
- Limits are in memory, so a restart resets them. Add a cap in the Anthropic console too.
- Answers are not stored. Nothing about accounts, contributions or review notes is in the index; it is built from the public dataset only.
- Watch the first weeks of real questions and fix the prompt in `systemPrompt()` where answers drift.
