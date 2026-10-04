# Canonical epigraphy model and EC/EI ingestion

Updated: 4 October 2026

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

## Validation and provenance policy

Validation catches invalid coordinates, reversed dates, broken references, duplicate publication/volume/number locators, missing provenance, malformed URLs, invalid namespaced IDs and invalid editorial states. The main Atlas validator invokes canonical validation; `npm test` contains pipeline regressions.

Structural validity is not historical verification. Original values are never silently corrected. Normalization and relationships remain distinguishable from source text, transcription and translation. Every published claim should have an item-level locator. Discovery portals are leads, not substitutes for scholarly editions or authority records. Conflicts retain both source records and use `disputed`.

## Static and MariaDB operation

GitHub Pages consumes the generated module and `/data/canonical/` artifacts without a server. The live service stores the same canonical object in each immutable dataset revision. Repository sync adds missing canonical entities/provenance while retaining MariaDB reviewer edits.

## Remaining research reconciliation

The schema is ready, but the existing legacy corpus is not automatically relabelled as EC/EI. That requires item-by-item locators and must not be inferred from series-level citations. Kingdom and literary relationship collections are intentionally empty in the demo because no historical values were fabricated.
