# Karnataka Kingdoms — Digital Historical Atlas

A Kannada-first React/Vite atlas for exploring Karnataka's history through a time-aware map, inscriptions, literature and heritage. The public GitHub Pages edition stays static; the optional live service adds moderated community contributions backed by MariaDB.

## Features

- Timeline slider from 300 BCE–1956 CE; provisional BCE inscription candidates stay in a clearly labelled research state and use distinct amber dashed map markers where provisional coordinates exist
- Overlapping kingdoms for the selected year
- Approximate historical extents on a Leaflet map
- Inscription markers with language and script metadata
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
npm run dev:api
npm run dev
```

The Vite server proxies `/api` to port 8787. For an all-in-one production-shaped setup, configure `.env` and use `docker compose up -d --build`. See [live deployment](docs/live-deployment.md) and [community governance](docs/community-governance.md).

For a cloned Linux deployment behind an existing Nginx instance, use the guarded systemd/TLS installer: [Linux + Nginx installation](docs/linux-nginx-install.md) and `scripts/install-linux-nginx.sh`. For later releases, run `scripts/update-live.sh` on the server to fetch, validate, migrate and restart the existing deployment without replacing its secrets or Nginx/TLS configuration.

See the maintained [milestone status and roadmap](docs/roadmap-status.md) for the implementation history, current coverage and prioritized next work.

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

## Research citations

Open `#research` and choose **Reference catalogue**. Researchers can copy the recommended atlas citation, download atlas BibTeX or RIS, export the filtered source catalogue as JSON, and open the citation menu on any source for item-level BibTeX, RIS or plain-text citation. Citation quality improves as DOI, publisher and authorship metadata is completed in the admin workspace.

## Data structure

Normalized prototype content is in `src/data/atlas.js`, validation rules are in `src/data/validate.js`, and the field contract is documented in `docs/data-model.md`.
