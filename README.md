# Karnataka Historical Atlas

A Kannada-first, bilingual digital atlas for exploring Karnataka through maps,
timelines, polities, people, inscriptions, literature, heritage, districts and
global relations.

The project has two publication surfaces:

- **GitHub Pages:** a read-only static release with no server dependency.
- **Live portal:** the same public application plus MariaDB-backed accounts,
  contributions, review, administration and immutable dataset revisions.

Research leads remain visibly `needs-review`. OCR matches, approximate map
points and reconstructed boundaries are not presented as verified evidence.

## Current release

Atlas v0.30 currently reports **45,301 records**, **38,257 research leads**,
**798 sources** and **2,787 relationships/pointers**. The Epigraphia archive
layer contains 279 EC/EI text records and 811 deduplicated review pointers to
48 existing atlas entities. Public, Admin and static-export statistics use the
same calculation.

See [milestone status and roadmap](docs/roadmap-status.md) for detailed coverage
and open research work.

## Local development

```bash
npm install
npm run dev
```

Validate data, run tests and build the static portal:

```bash
npm run check
```

The production bundle is written to `dist/`. It is installable as a PWA and
caches the application shell, boundaries and previously visited tiles; it does
not bulk-download a world map tile archive.

## Live MariaDB portal

Copy `.env.example` to `.env`, configure MariaDB, then run:

```bash
npm run db:migrate
npm run db:sync-dataset
npm run db:sync-research-discovery
npm run build
npm start
```

`db:sync-dataset` creates a permanent revision from repository seed records
without deleting server-only edits. `db:sync-research-discovery` updates the
separate India-wide discovery queue while preserving Admin review metadata.
The browser is never the source of truth for research data or drafts.

For routine Linux/systemd deployment use `scripts/update-live.sh`. Coolify users
must run both sync commands inside the newly deployed application container.
See [live deployment](docs/live-deployment.md) and
[data import and deployment](docs/data-import-and-deployment.md).

## Static GitHub Pages release

Pushes to `main` build the committed repository dataset with the GitHub Actions
Pages workflow. A reviewed MariaDB revision can be deliberately exported with:

```bash
npm run publish:static
```

Commit the generated publication artifacts before the Pages build. Live Admin
edits do not appear on GitHub Pages until this approved export occurs.

## Data and research workflow

- Model and collections: [data model](docs/data-model.md)
- EC/EI canonical ingestion: [canonical epigraphy](docs/canonical-epigraphy.md)
- Repeatable imports and citations: [research intake](docs/research-intake.md)
- Contributor and reviewer use: [user guide](docs/user-guide.md)
- Evidence and governance: [community governance](docs/community-governance.md)
- P2/P3 review packets: [corpus maturity](docs/p2-p3-corpus-maturity.md)

Administrators edit permanent records in `#admin`; contributors submit cited
proposals through `#contribute`; reviewers work in `#reviews` and `#evidence`.
The public `#research-tasks` board keeps unresolved work visible without
promoting it prematurely.

## Verification before release

```bash
npm run validate:data
node --test
npm run build
```

Add a regression test for every new page, map layer, timeline category or
cross-collection relationship. The public dataset must exclude private reviewer
notes, institution IDs, unapproved drafts and moderation data.

## Licence and scholarly policy

This repository includes software, structured research leads and links to
third-party sources. Source rights and image licences remain item-specific.
Discovery portals and OCR are pointers only; publication claims should cite
primary editions, institutional registers, authority records or independently
reviewed field documentation with page/item locators.
