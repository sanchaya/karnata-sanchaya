# Birds, animals and plants (`#species`)

An open-data species list for Karnataka with Kannada names collected from readers.
Data file: `src/data/species/karnataka-species.json` (about 1 MB, loaded only with the page).

## Where the data comes from

`node scripts/import-species.mjs` (use `--quick` for a small test run) builds the file. It caches API answers in
`output/species-cache/` (git-ignored), so a re-run only fetches what is new.

| Source | Used for | Licence |
|---|---|---|
| GBIF occurrence search, Karnataka, human observations | which species occur, how often, taxonomy, English and Kannada vernacular names | per dataset |
| eBird Observation Dataset on GBIF | the bird list and the month profile used for migration | CC BY 4.0 |
| Wikidata | English and Kannada labels, links | CC0 |

It keeps the most-recorded species per group (birds 552, mammals 90, reptiles 126, amphibians 88, butterflies and
dragonflies 500, plants 1,200 at the last run), so it is **not a complete checklist**. Species with no recorded
observations are absent. Fishes returned no human observations and are left out.

## Normalising names

`src/species-normalize.js`: Kannada names are NFC-normalised, stripped of zero-width characters and bracketed notes,
and kept only if they contain Kannada script. The same name from GBIF and Wikidata is merged into one candidate that
lists both sources; the candidate with most sources becomes `name.kn`. The English name prefers a clean Wikidata
label, then the most common plain GBIF name. Every record stays `needs-review`: the imported Kannada names are uneven
(some are wrong or are the fruit rather than the tree), so the page labels them as awaiting review and shows other
suggestions.

## Migratory birds

`seasonality` is inferred from eBird month counts: a month counts if it holds at least 2% of records. Present in 10+
months is *resident*; confined to Oct–Apr is *winter visitor*; confined to Mar–Sep is *summer / monsoon visitor*;
anything else with 9 or fewer months is *passage or local movement*; under 20 records is *unknown*. eBird counts follow
observer effort, so this is a hint, not an authority, and **needs an ornithologist's review**. The page filters by
these patterns, including "Migratory birds".

## Crowdsourcing Kannada names

Each card links to the guided contribution form (`#contribute`) with the species pre-selected (record type
*species*, action *correction*). The existing flow applies: account, draft, citation with a locator (a dictionary
or field-guide page), reviewer approval. A maintainer then adds the accepted name to
`src/data/species/kn-names-reviewed.json`:

```json
{ "2474942": { "kn": "ನವಿಲು", "note": "Kannada field guide, p. 41; accepted by reviewer" } }
```

Keys are GBIF species keys. A reviewed name replaces the imported one and the card says "Kannada name reviewed".
The "Needs a Kannada name" filter lists species that have no name or suggestion.

## Curated Kannada name lists

`node scripts/import-species-names.mjs` reads two published pages and writes `src/data/species/kn-name-sources.json`
(names, English group words and source links only, none of the pages' text):

- **Vismaya Jagattu** (blog, 2013): 80 Kannada names against English *group* words (Kite, Hornbill, Kingfisher…) with no
  scientific names. `applyNameSources` in `src/species-normalize.js` gives such a name to every species of that group
  (single words match the last word of the English name, so "Kite" matches "Black Kite"; phrases match anywhere).
  These are marked `scope: group` and the card says "group name". A few entries the page pairs with the wrong group,
  and ones that are not bird names, are skipped by hand in the script.
- **Early Bird** (Kutuhali column): 15 species-level Kannada names with no English or scientific names. They are not
  matched to species by guesswork; they only add a second source to a name that another source already gave.

Name order on a card: reviewed name, then species-level candidates by number of sources, then group names. This took
Kannada coverage from 227 to 463 of 2,556 species (236 of them group names); 43 names have two sources.

## Statistics

`src/data/species/species-meta.json` (written by the importer) holds the species and source counts. They feed
`calculateDatasetDepth` in `src/data/dataset-depth.js`, which drives the header counter, and the public open-data
packets. After changing species data run `node scripts/generate-open-datasets.mjs` (also part of `npm run build`) and commit
`public/data/open/*.json`.

## Server side

Species are a static file in the application bundle, not a MariaDB collection, so **there is no schema migration and
no `db:sync-dataset` for the species data itself**. Deploy as usual (`scripts/update-live.sh`, or redeploy the Coolify
container). `contributions.record_type` is a plain `VARCHAR(80)`, so the new record type `species` needs no migration;
the live server only needs the new `server/app.js` (a `species-` ID prefix). Run `npm run db:sync-dataset` only if you
also changed seed records in the main dataset. Reviewers see species suggestions in the normal review queue and apply
an accepted name by editing `kn-names-reviewed.json`, then redeploy. Purge the Cloudflare cache for `/` and `/sw.js`
so browsers pick up the new bundle.
