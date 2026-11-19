# Berunda, the portal's question-answering guide

Berunda answers visitors' questions about Karnataka's rulers, inscriptions, places and sources **only from the published atlas records**. It works on the live portal and on the GitHub Pages edition, because the browser always calls the live API (`VITE_COMMUNITY_API_URL`).

## How it works
1. The browser asks `POST /api/berunda/ask` with the question, the language and the last few turns.
2. The server loads the latest published dataset revision from MariaDB (`dataset_snapshots`) and keeps a search index in memory. The index is rebuilt only when a newer revision appears.
3. The server calls the Anthropic Messages API with two tools, `search_records` and `get_record`. The model may only state facts that tool results contain, cites record ids, and must say when a record is awaiting review.
4. The reply carries `answer` plus `sources` (only ids the tools really returned). The browser links each source to the matching portal page.

Code: `server/berunda.js` (index, search, limits, agent loop), the routes in `server/app.js`, `src/Berunda.jsx` and `src/BerundaArt.jsx` (widget and artwork).

## Modes (admin: Admin > Integrations > Berunda guide)
| Mode | What visitors get | Cost |
|---|---|---|
| Off | Berunda is hidden. | none |
| Records only (default) | The best-matching atlas records with their summaries, dates and review status. No model is called, so nothing can be invented. | none |
| AI answers | A model writes a short cited answer from the records. If the daily limit is reached or the model fails, the visitor automatically gets the records-only answer. | per question |

The mode, the daily AI limit and the per-visitor limit are stored in the `portal_settings` table (migration `015_portal_settings.sql`, applied by `npm run db:migrate`, which the container runs on start). Changes take effect within seconds and every change is written to the audit log. The panel also shows today's counts; they reset when the server restarts.

## Turning on AI answers
1. Set `ANTHROPIC_API_KEY` on the **server** (never in the browser build) and restart. Optional: `BERUNDA_MODEL` (default `claude-haiku-5-5`).
2. In the admin panel choose **AI answers**. The option stays disabled until the key exists; until then the portal keeps serving records-only answers.
3. Set a spend cap in the Anthropic console as well, and keep the daily limit modest at first.

`PUBLIC_MESSAGE_ALLOWED_ORIGINS` already lists the GitHub Pages origins; Berunda reuses that list for cross-origin access. The Pages build already points at `https://karnata.sanchaya.net` through `VITE_COMMUNITY_API_URL` in `.github/workflows/deploy.yml`.

## Safety and cost
- Questions are capped at 500 characters and the history at 6 turns.
- Per-visitor and daily limits are in memory, so a restart resets them (the limit values themselves are saved). Record searches have their own generous per-visitor limit.
- Answers are not stored. Nothing about accounts, contributions or review notes is in the index; it is built from the public dataset only.
- Watch the first weeks of real questions and fix the prompt in `systemPrompt()` where answers drift.

## Tablet and laptop widths, and Admin

Between 721 and about 1280 px the header used to be wider than the screen (the activity switch and utility links would not shrink), which pushed the Berunda launcher off the right edge. In `page-consistency.css` the activity switch now shrinks and scrolls inside itself, the utility links are hidden up to 1280 px, and the launcher and language button never shrink. The Admin workspace header now carries the launcher too, and its action buttons wrap instead of running off-screen. Berunda only appears when `/api/berunda/status` answers `enabled`, so it is absent in the static edition and in a local build with no API.
