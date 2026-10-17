# Research intake and update procedure

The repository is the installation seed; MariaDB is the live source of truth. Do not edit the live dataset through browser storage or by directly changing a generated static file.

## Add a new research source

1. Add a source object to the smallest appropriate module under `src/data/` (use a stable `src-...` ID, bilingual title, author or organisation, URL/DOI/ISBN, publication year, scope note and `review.status`).
2. Keep discovery portals, blogs and unsourced lists as `needs-review`; do not present them as authority evidence.
3. Add item/page/section locators to each record citation. A URL alone is not an item-level citation.
4. Link the source from the relevant person, event, work, inscription, heritage or district record.
5. Run `npm run validate:data`, `node --test` and `npm run build`.

## Sync to the live server

After the change is committed and deployed:

```bash
npm run db:migrate
npm run db:sync-dataset
npm run db:sync-research-discovery
```

The sync creates a new immutable MariaDB revision, preserves existing records, normalizes older snapshots whose collection keys are missing or stored as object maps, and refuses invalid seed data. Use `scripts/update-live.sh` for the guarded pull/install/migrate/sync/restart sequence.

The separate discovery sync loads the complete India-wide BharatRajya and
WhatIsIndia discovery corpus, source candidates and unresolved source-page
failures into the administrator-only review queue. It refreshes preserved
source payloads without replacing Admin review notes, citations, decisions or
canonical-target links.

## Use the Admin citation workflow

Open `#admin` as an approved administrator and choose **Sources / ಆಕರಗಳು**. The editor supports DOI, ISBN, publisher/repository, URL, bilingual title, review state and the complete JSON fields. Selecting a source now shows every record and locator that cites it; choose a linked record to edit its citation, or create a new source and save a permanent MariaDB revision.

For a public release, review the revision, run `npm run publish:static`, and deploy the generated static build. JSON export/import is an administrator tool only.

## Guided community contribution

Approved contributors use `#community`; they do not edit JSON or canonical
records directly. The four-step Kannada-first form collects the record type,
place/date context, type-specific fields, rationale and structured citations.
For new records the server assigns the provisional stable ID. For corrections
and new evidence, Atlas detail panels pass the selected record ID and name into
the form. Known canonical places can be selected by Kannada or English name;
the form then fills the available district, taluk, coordinate and location precision. Taluk is only inferred when an existing structured research record safely matches the selected canonical place; otherwise it remains open for the contributor rather than being guessed.
The research-task panel exposes evidence gaps across inscriptions, literature,
district history, people, heritage/temples, political relations, coins/scripts
and territorial evidence as small tasks.

Saving creates a MariaDB draft. The contributor deliberately submits that
draft, and an independent reviewer approves, rejects or requests changes before
anything can enter a published dataset revision. Every submitted citation must
have an HTTP(S) URL, title and item-level locator such as a page, inscription
number or catalogue record. A requested change can be edited and resubmitted;
each save creates a new contribution version. Persistent notifications tell the
contributor when a review decision is recorded.

Administrators can create bilingual campaigns for a classroom, district audit
or institutional research sprint and retain record-type/district scope in MariaDB. Contributors join an active campaign and may
associate their drafts with it. Researchers with existing tabular or map work
can stage CSV/KML batches privately in MariaDB; reviewer approval does not
automatically publish or merge those rows. Photographs are not part of this
contribution form yet; introduce them only with an explicit licence, consent,
retention and moderation policy.

## Social update links

Set only the handles that actually exist in the live/static build environment. Blank values remain hidden:

```dotenv
VITE_SOCIAL_YOUTUBE_URL=https://www.youtube.com/@your-handle
VITE_SOCIAL_INSTAGRAM_URL=https://www.instagram.com/your-handle/
VITE_SOCIAL_FACEBOOK_URL=https://www.facebook.com/your-page
VITE_SOCIAL_X_URL=https://x.com/your-handle
VITE_SOCIAL_LINKEDIN_URL=https://www.linkedin.com/company/your-page/
```

Links appear unobtrusively in the footer on every page with a Kannada/English follow-updates label. Never add placeholder or guessed handles.

## Patrika Sanchaya periodicals intake

The repository includes the attributed `Patrika Sanchaya - Kannada.csv` catalogue under `src/data/imports/`. It is imported into the MariaDB seed as 3,715 `periodicals` records. Each record preserves the catalogue serial, Kannada title, start-year value, publication place, publisher, editor, periodicity, language and Havanur/KPA notes, with a stable ID and a row-level citation to `src-patrika-sanchaya-kannada`.

When a refreshed CSV is supplied, run:

```sh
node scripts/import-patrika.mjs
npm run validate:data
npm run db:sync-dataset
```

The import also creates grouped publication-place anchors for the public map. These are deliberately marked `needs-review` and `publication-place-anchor`; they are discovery locations, not claims about an item’s exact office or archive. Resolve exact holdings and scans in Admin by editing the periodical record and adding a catalogue/scan citation. Credit for the catalogue is recorded under Patrike Sanchaya, with future digitisation additions attributed to ServantsOfKnowledge.

## Offline/PWA operation

The public build is installable through **Install app / Add to Home Screen**. After one online visit, the service worker caches the application shell, the published dataset, district boundaries and any map tiles already viewed. Offline mode is read-only: MariaDB edits and reviewer submissions require connectivity and remain server-side. A complete global tile archive is intentionally not bundled; use a licensed self-hosted tile package if full offline geography is required.

## Museums, archives, libraries and curiosity heritage

Add an institution or built-heritage candidate to the appropriate district packet in `src/data/cultural-institutions.js`. Keep its object category explicit (`museum`, `archive`, `library`, `palace`, `fort`, `historic-park`, `historic-market`, `railway-heritage`, `engineering-heritage`, `industrial-heritage`, `maritime-heritage`, `educational-heritage`, `scientific-heritage`, `cultural-venue`, `memorial-heritage` or `historic-urban-precinct`), provide bilingual names, and cite the responsible government, institutional or statutory source. Preserve establishment, renaming, adaptive-reuse and technological history only when the cited source states it; do not turn an undated historical association into a synthetic date range. A locality-derived map point must use `approximate`; only an authority-published or surveyed point may be promoted to site-level precision. Do not infer legal protection from inclusion in a tourism page or directory. Photographs, current access, managing authority, collection scope and dated present condition remain separate review gates.
