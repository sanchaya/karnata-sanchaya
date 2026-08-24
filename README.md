# Karnataka Kingdoms — Digital Historical Atlas

A Kannada-first React/Vite atlas for exploring Karnataka's history through a time-aware map, inscriptions, literature and heritage. The public GitHub Pages edition stays static; the optional live service adds moderated community contributions backed by MariaDB.

## Features

- Timeline slider from 300 BCE–1956 CE; provisional BCE inscription candidates stay in a clearly labelled research state and use distinct amber dashed map markers where provisional coordinates exist
- Overlapping kingdoms for the selected year
- Approximate historical extents on a Leaflet map
- Inscription markers with language and script metadata
- Every formal inscription is linked to its associated kingdom or governing empire; that attribution is visible in map popups, timeline cards, search results and district inscription lists, while unresolved candidates remain visibly needs-review
- Kingdom details, rulers and sample literary works
- Sanchaya integration points
- Responsive static build suitable for GitHub Pages
- Stable linked IDs, bilingual fields, citations, date/geographic precision and review states
- Researcher workspace for search, add/edit, validation and JSON import/export
- Kannada-first interface with persistent Kannada/English switching and bilingual entity labels
- Event-driven chronology through 1956 with battles, campaigns, invasions, accessions and democratic reorganisation
- District deep-history explorer with 31 district research scopes for prehistoric places, settlement origins, foundation stones and locality histories; indicative leads remain visibly needs-review
- Karnataka and Wider India map scopes with selectable campaign routes and event narratives
- Sanchaya-branded light interface using the visual tokens and official mark from fonts.sanchaya.net
- Sanchaya-approved accounts for students, researchers, teachers, historians and the public
- Optional encrypted institution-ID verification and a verified badge
- Cited change proposals, independent review, karma points and bilingual contribution certificates
- MariaDB audit trail with an approved-only, privacy-safe static release export
- Search-engine metadata, bilingual structured dataset markup, crawler rules and deployment-aware sitemap generation
- Atlas-level and source-level citations with plain-text, BibTeX, RIS and JSON exports
- Evidence Workflow reviewer dashboard with independent reviewer fields, status history and a ready-for-promotion queue for the current P1/P2 packets
- Dedicated coin, genealogy, boundary-evidence, manuscript witness and inscription-edition seed collections, all review-gated and linked into the public research graph
- Public script evolution explorer for Kannada script phases, sample inscriptions, predecessor links and evidence-workflow handoff

> The included boundaries and records are prototype data, not scholarly editions. Replace them with reviewed GeoJSON and cited research data before publication.

## Run locally

```bash
npm install
npm run dev
```

This runs the static atlas. It deliberately shows the contribution service as offline unless the API and MariaDB are also running.

## Install and offline use

The production build is installable as a browser app. After opening the deployed portal once while online, use the browser’s **Install app** / **Add to Home Screen** action. The service worker keeps the application shell, Karnataka district boundaries and map tiles that have already been visited in local cache, so records and boundaries remain usable during a connectivity interruption. A complete offline world tile archive is intentionally not bundled; a future full offline map package should use a licensed, self-hosted tile source rather than bulk-downloading public OpenStreetMap tiles.

## Run the live community portal

Copy `.env.example` to `.env`, configure a local MariaDB database, then run:

```bash
npm run db:migrate
npm run db:sync-dataset
npm run dev:api
npm run dev
```

The Vite server proxies `/api` to port 8787. For an all-in-one production-shaped setup, configure `.env` and use `docker compose up -d --build`. See [live deployment](docs/live-deployment.md) and [community governance](docs/community-governance.md).

For a cloned Linux deployment behind an existing Nginx instance, use the guarded systemd/TLS installer: [Linux + Nginx installation](docs/linux-nginx-install.md) and `scripts/install-linux-nginx.sh`. For later releases, run `scripts/update-live.sh` on the server to fetch, validate, migrate and restart the existing deployment without replacing its secrets or Nginx/TLS configuration.

See the maintained [milestone status and roadmap](docs/roadmap-status.md) for the implementation history, current coverage and prioritized next work.

The statewide freedom-fighter research pass is tracked in the [31-district coverage audit](docs/freedom-fighter-district-audit.md). Run `npm run audit:freedom-fighters` after changing people, district associations, citations or review status. The audit deliberately distinguishes captured candidates from independently reviewed records and keeps empty districts visible as research work rather than implying completeness.

The [Internet Archive freedom-fighter research note](docs/internet-archive-freedom-fighter-research.md) records the first ServantsOfKnowledge/JaiGyan scan, six high-value source items and the page-image verification procedure. Internet Archive OCR is used only to find candidate pages; names and claims enter MariaDB through Admin with printed locators and remain `needs-review` until checked.

For repeatable research intake, citation management, MariaDB synchronization, social-update links and offline/PWA operation, follow [Research intake and update procedure](docs/research-intake.md).

For the current P2/P3 corpus maturity work, use [P2/P3 corpus maturity workflow](docs/p2-p3-corpus-maturity.md). It explains how to complete coin records, genealogy assertions, boundary evidence, inscription editions and manuscript/Sanchaya witnesses without promoting leads prematurely.

For the complete CSV/import, migration, server-update and static-publication runbook, see [Data import and deployment](docs/data-import-and-deployment.md).

## Build

```bash
npm run build
```

Validate the research data and build together:

```bash
npm run check
```

The deployable static site is generated in `dist/`.

`npm run check` also runs the reusable page-data regression suite in `test/page-data-contract.test.js`. It checks every collection for stable IDs and review states, verifies map coordinates and timeline fields, confirms explorer cards have their required bilingual/optional fields, and resolves cross-page links for events, works, inscriptions, places, people, sources and audits. Run only that suite while developing a data feature with:

```bash
node --test test/page-data-contract.test.js
```

Add a focused regression case whenever a new page, map layer, timeline story or cross-collection relationship is introduced.

Atlas v0.25 adds 905 Wikimedia people discovery candidates without treating them as verified biographies. Open `#people` → **Wikimedia review candidates** to search and submit cited corrections. `npm run db:sync-dataset` imports the reviewed repository seed into a permanent MariaDB dataset revision; the live portal and Admin both read that revision through the server API. See [`docs/v025-people-culture-public-life.md`](docs/v025-people-culture-public-life.md).

## Dataset source of truth

The live server treats the latest `dataset_snapshots` revision in MariaDB as the source of truth for every public page and the Admin editor. The browser never stores historical records, drafts, evidence assignments or candidate edits. Browser storage is limited to interface preferences such as language, map style and whether a guided tour was already shown. The service worker may retain a read-only copy of the last successfully loaded dataset for offline viewing; it cannot edit or publish it.

Repository JSON is an installation seed, not the live data store. Deployment runs `db:migrate` followed by `db:sync-dataset`, and administrators create subsequent immutable MariaDB revisions. `npm run publish:static` exports the latest validated MariaDB revision to `public/data/published-atlas.json` before building the read-only GitHub Pages publication; the static site is not a second editing system.

Open `#district-history` (ಜಿಲ್ಲಾ ಸಮಗ್ರ ಇತಿಹಾಸ / District deep history) to browse the district intake layer. The older `#history` link remains a compatibility alias. Amber dashed markers are research leads, not verified sites. Researchers can edit the normalized `districtHistoryResearch` collection from the authenticated `#admin` workspace and save a permanent MariaDB revision before preparing a static release.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Push to `main`; the included workflow deploys the site.

The Vite `base` is set to `./`, allowing deployment from a repository subpath.

The GitHub Pages workflow supplies `PUBLIC_SITE_URL` and generates an absolute sitemap automatically. For another production host, build with `PUBLIC_SITE_URL=https://your-atlas.example/ npm run build`. Local builds deliberately omit a domain-specific sitemap so a development address cannot become the public canonical URL.

## Community workflow

Open **ಕೊಡುಗೆ ನೀಡಿ / Contribute**. Registration captures profession and institutional affiliation. Sanchaya approves accounts; contributors then save and submit cited proposals. Appointed reviewers approve or request changes, and approved work receives auditable karma points. Institution IDs are optional, encrypted, access-restricted, and excluded from public exports.

The live application and GitHub Pages have intentionally different responsibilities:

- MariaDB live portal: accounts, private verification, proposals, reviews, points and certificates.
- GitHub Pages: a read-only release built from the reviewed dataset and `public/data/approved-community.json`.

## Local researcher workspace

Run the live service and sign in as an approved administrator, then open `#admin`. The workspace:

- loads the latest permanent MariaDB dataset revision;
- searches every field across each record collection;
- offers common fields plus a complete JSON editor for geometry, citations and relationships;
- reports dataset and per-record validation problems;
- imports JSON into the editor and saves complete, versioned revisions to MariaDB;
- exports the current revision as a review artifact.

The live `#admin` workspace requires an approved administrator session and stores every saved full-dataset revision in MariaDB. It does not use browser-local drafts. JSON import is staged in the editor until an administrator explicitly saves a new server revision; JSON export remains a portable review artifact. To publish, review the permanent revision, run `npm run check`, and deliberately generate the approved static release.

The admin workspace remains available only by opening `#admin` directly for maintainers. It is not linked from the public navigation and is protected by the live administrator role; the static GitHub Pages build remains read-only.

Use the **Resources & collaborations management** shortcuts in the admin toolbar to maintain source metadata and collaboration records. Source fields include authors/organizations, publisher or repository, DOI, ISBN, URL and review state; collaboration records include entity type, public stage, scope and bilingual descriptions. Export and review the complete JSON before publishing.

Open `#evidence` to operate the current evidence board. The board now includes reviewer assignments, review notes, saved status history, a reviewer operations summary and a ready-for-promotion queue. A completed assignment is still only a workflow signal; publication requires an independently reviewed evidence packet, validation, a permanent MariaDB revision and a deliberate static release.

## Research citations

Open `#research` and choose **Reference catalogue**. Researchers can copy the recommended atlas citation, download atlas BibTeX or RIS, export the filtered source catalogue as JSON, and open the citation menu on any source for item-level BibTeX, RIS or plain-text citation. Citation quality improves as DOI, publisher and authorship metadata is completed in the admin workspace.

Atlas v0.26 adds the Patrika Sanchaya periodicals layer: 3,715 Kannada newspaper and magazine catalogue rows remain available to Admin as `periodicals` records, with 76 grouped publication-place anchors on the atlas map and needs-review markers. Refresh the source with `npm run import:patrika`, then validate and synchronize MariaDB. The catalogue is credited to Patrike Sanchaya and Srinivas Havanur; future digitisation additions can be coordinated with ServantsOfKnowledge.

Kingdom periods are shown as bounded reign cards on the timeline; when more than one polity is active at the selected year, the sidebar identifies the overlap. `artifacts` is the review-marked collection for dynastic symbols, coins, inscription stones, sculpture, regalia and architectural fragments. These objects appear in the dedicated timeline category and map layer with site-context coordinates until an object-level catalogue, repository and photograph are confirmed in Admin.

Atlas v0.28.2 expands the P2/P3 maturity layer with Hoysala and Mysore genealogy bridges, Belur and Srirangapatna coinage leads, Kumaravyasa Bharata and Torave Ramayana Sanchaya witness leads, Hoysala and Mysore boundary-evidence packets, and Shravanabelagola/Muktesvara inscription-edition packets. The `#scripts` explorer makes the script-evolution records publicly navigable. These are discovery and review packets, not publication-ready claims.

## Data structure

Normalized prototype content is in `src/data/atlas.js`, validation rules are in `src/data/validate.js`, and the field contract is documented in `docs/data-model.md`.
