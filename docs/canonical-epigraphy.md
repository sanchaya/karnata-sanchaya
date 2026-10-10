# Canonical epigraphy model and EC/EI ingestion

Updated: 10 October 2026

## Purpose and compatibility

The canonical layer is additive. The public timeline, map, district audits, literature records and existing research queues retain their established collections while they are progressively reconciled. `atlasData.canonical` is the durable scholarly representation for new corpus ingestion. The Epigraphy Explorer projects canonical inscriptions into its existing card/detail contract, so the current visual design and URLs remain stable.

The model audit found reusable legacy fields for bilingual names and descriptions, dates, GeoJSON points, citations, review states, places, polities, rulers, inscriptions, works, sources and relationships. Those values remain intact. The gaps addressed here are immutable source rows, explicit normalization boundaries, namespaced corpus IDs, field-level uncertainty, item-level provenance and build-derived indexes/GeoJSON.

## Entity model

`src/data/canonical/model.js` defines `Site`, `Place`, `Inscription`, `Dynasty`, `Kingdom`, `Ruler`, `Deity`, `Monument`, `LiteraryWork`, `Author`, `Source`, and `SourceRecord`. Rulers link to dynasties; dynasties can link to kingdoms; inscriptions link to sites/places, rulers, dynasties and deities; works can link to authors, periods, rulers, dynasties and Sanchaya URLs.

Every imported record separates:

1. `source_record`: untouched input plus row/import metadata.
2. `normalized_metadata`: searchable, bilingual, typed values.
3. `derived_relationships`: explicit edges with uncertainty.
4. `editorial_status`: review status, reviewers, date/location certainty and update state.

Uncertainty is `exact`, `approximate`, `inferred`, `disputed`, or `unknown`. IDs are namespaced (`ec:…`, `ei:…`, `site:…`, `place:…`, `dynasty:…`, `ruler:…`). Aliases remain on the normalized entity; original spellings always remain in `source_record.raw`.

## Archaeological and provenance fields

The importer accepts the existing headings directly: `ID`, `GPS/location`, `Category`, `District`, `Taluk`, `Condition`, `Deity`, `Deity form`, `Dynasty (multiple)`, `Language (multiple)`, `Century`, `Period from`, `Period to`, `Within project area`, `Name`, `Description`, `Images`, and `Sources`. It also accepts scripts, rulers and aliases/historical names. Multiple values may be arrays or semicolon/comma/pipe-separated text.

Provenance fields are source publication, volume, page, inscription number, source URL, scan URL, editor, publication year, reviewed by, review status, location precision, date certainty and last updated.

## Pipeline and generated data

`src/data/canonical/pipeline.js` implements staging, normalization, validation, canonical import, indexes and GeoJSON. Run the complete EC/EI fixture demonstration with:

```bash
npm run canonical:build
npm run canonical:validate
```

It generates:

- `src/data/canonical/ec-ei-canonical.generated.js`
- `public/data/canonical/entities.json`
- `public/data/canonical/index.json`
- `public/data/canonical/inscriptions.geojson`

GeoJSON is regenerated from canonical inscriptions; it is not hand-maintained. Fixture records are excluded from public GeoJSON.

## Importing EC or EI

Use a UTF-8 JSON envelope:

```json
{
  "corpus": "EC",
  "source": {
    "id": "ec:source:volume-01",
    "publication": "Epigraphia Carnatica",
    "volume": "I",
    "editor": "…",
    "publication_year": 1886,
    "url": "https://…"
  },
  "records": [{ "ID": "…", "Name": "…" }]
}
```

Then run:

```bash
npm run import:ec -- path/to/ec-volume.json
# or
npm run import:ei -- path/to/ei-volume.json
npm run validate:data
npm run build
```

The samples in `fixtures/canonical/` are synthetic, conspicuously labelled `DEMO`, and are not historical claims.

## Adding another source

Create an adapter that maps source headings into the accepted headings and calls `stageSourceRecords`. Extra columns remain in `source_record.raw`; never discard them. ASI, Annual Reports on Indian Epigraphy, Mysore Archaeological Reports, Gazetteers, museum catalogues and other corpora can share the pipeline without losing their vocabulary.

- Prefer the printed item identifier, volume, page and inscription number.
- Keep publication and scan URLs separate.
- Preserve historical place names as aliases.
- Use `unknown`, never a guess.
- Mark inferred matches as `inferred` pending review.
- Do not mark a record publication-ready before item, place and citation review.

## Importing the WhatIsIndia inscriptions catalogue

WhatIsIndia is used as a discovery and online-access layer, not as a replacement for the printed Archaeological Survey of India editions. The importer preserves the linked underlying publication (for example *South Indian Inscriptions*, *Epigraphia Indica*, *Annual Reports on Indian Epigraphy*, or *Corpus Inscriptionum Indicarum*), volume, printed page, inscription number, source URL, original page text excerpt, and the portal discovery URL.

Run a complete same-host crawl with:

```bash
npm run import:whatisindia
npm run canonical:build
npm run canonical:validate
```

For a bounded audit run, use `npm run import:whatisindia -- --max-pages 50`. Use `--refresh` to bypass the rebuildable cache in `var/import-cache/whatisindia/`, `--numbered-only` to exclude unresolved article-page leads, or `--output path/to/file.json` to retain a separate research batch. The committed default output is `data/imports/whatisindia-inscriptions.json`; when present, the static canonical build includes it automatically.

The complete 9 October 2026 crawl visited 9,939 source pages and retained 9,283 records: 2,402 item-numbered inscriptions and 6,881 unresolved corpus-page leads. The manifest also retains 152 broken or forbidden source links so that an incomplete upstream page is never silently represented as a successful extraction. The full collection is available in the direct-only India research index. The normal public canonical bundle includes only item-numbered records carrying explicit Kannada/Karnataka place, district, language or title evidence; unresolved page leads and full source excerpts remain in research storage. This keeps the public story in scope and prevents the full discovery corpus from blocking initial page load. Use `node scripts/build-canonical.mjs --all-discovery` only for a deliberate offline research build.

## BharatRajya discovery import and the hidden India index

BharatRajya is a discovery feed, not a citable scholarly authority. Run:

```bash
npm run import:bharatrajya
npm run research:index
```

The first command preserves the eight exposed structured collections in `data/imports/bharatrajya-discovery.json` and generates a deliberately narrow Kannada/Karnataka review projection in `src/data/bharatrajya-karnataka.generated.js`. That review projection is not injected into the normal public timeline. The second command combines the full BharatRajya discovery bundle and the full WhatIsIndia inscription import into the build-time research index at `src/data/india-research.generated.js`.

The direct route `#india-research` is intentionally absent from public navigation. It provides a searchable, lazy-listed workspace for India-wide and wider subcontinent discovery records without changing the normal Karnataka scope. Its records remain `needs-review`. A BharatRajya `source` string is displayed only as an **imported source claim**; it must be resolved to the named book, article, inscription edition, official register or other underlying source before the record can be promoted. The 47 underlying reference candidates are shown separately for that matching work.

`npm run build` regenerates the compact research index from the committed import snapshots. It does not access the network. Refreshing either upstream source is a deliberate research operation and must be followed by validation and a reviewed commit.

Numbered entries are split at printed `No./Nos. … (Page No …)` locators. Article pages where individual item boundaries cannot be safely inferred are retained as `corpus-page-lead` records. All imported entries begin as `needs-review`, with unknown locations left unplotted until an authority-confirmed coordinate is supplied. Printed place spellings remain in `source_record.raw`; normalization never silently rewrites them.

Before promotion, a reviewer must compare the online transcription against the cited printed page, resolve grouped inscription numbers, confirm the modern district/taluk and coordinates, identify language/script/dynasty only from evidence, and add a scan URL where available. The crawler cache is ignored by Git; the normalized import file and generated static canonical files are versioned.

## Validation and provenance policy

Validation catches invalid coordinates, reversed dates, broken references, duplicate publication/volume/number locators, missing provenance, malformed URLs, invalid namespaced IDs and invalid editorial states. The main Atlas validator invokes canonical validation; `npm test` contains pipeline regressions.

Structural validity is not historical verification. Original values are never silently corrected. Normalization and relationships remain distinguishable from source text, transcription and translation. Every published claim should have an item-level locator. Discovery portals are leads, not substitutes for scholarly editions or authority records. Conflicts retain both source records and use `disputed`.

## Static and MariaDB operation

GitHub Pages consumes the generated module and `/data/canonical/` artifacts without a server. The live service stores the same canonical object in each immutable dataset revision. Repository sync adds missing canonical entities/provenance while retaining MariaDB reviewer edits.

## Remaining research reconciliation

The schema is ready, but the existing legacy corpus is not automatically relabelled as EC/EI. That requires item-by-item locators and must not be inferred from series-level citations. Kingdom and literary relationship collections are intentionally empty in the demo because no historical values were fabricated.
