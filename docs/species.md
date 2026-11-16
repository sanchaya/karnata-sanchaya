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

- **Hakkipukka** (hakkipukka.com, `node scripts/import-hakkipukka-names.mjs`): about 250 species-level Kannada names with English names taken from each post's link text or web address, and a link back. It reads the site's category pages at one request a second and keeps no text or photos. A name is applied only when the English name matches a species exactly (161 species matched, 43 of them newly named at the last run). **On hold:** the source carries `hold: true` in `kn-name-sources.json`, so `applyNameSources` skips it and none of these names or links appear publicly. Delete that flag once the owners agree to publication and a link to their portal. The site states no licence; see `LICENSING.md`.

Name order on a card: reviewed name, then species-level candidates by number of sources, then group names. At the last
run 754 of 2,556 species have a Kannada name suggestion, 230 of them group names.

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

## Photos

`node scripts/import-species-images.mjs` takes each species' Wikidata image (P18), reads its licence and author from the
Wikimedia Commons API and writes `src/data/species/species-images.json`. Only **CC0, public domain, CC BY and CC BY-SA**
files are kept (`isOpenLicense` in `src/species-images.js` refuses NonCommercial, NoDerivs, GFDL-only, fair-use and
unknown terms). The page hot-links the 480px Commons thumbnail (the CSP already allows `https:` images) and always
prints the author, the licence (linked) and a link to the Commons file page; do not remove that caption, since CC BY
and CC BY-SA require attribution. Species without a free photo show none. Photos come in a second step after the
species import: run `import-species.mjs`, then `import-species-names.mjs`, then `import-species-images.mjs`, then
`node scripts/generate-open-datasets.mjs`.

Bug fixed on the way: the importer's response cache keyed POST requests on the last 120 characters, so every Wikidata
batch returned the first batch's answer; it now hashes the whole request. That raised Wikidata matches from 198 to
2,506 species and Kannada candidates from 227 to 524 before the curated lists.

At the last run 2,276 of 2,556 species have a free photo (25 files were rejected for their licence).

## Features on the page

- **Migration calendar:** a bar chart of migratory birds recorded in each month (`migratoryByMonth`); tap a month, or
  "Visiting now", to filter the list. Inferred from eBird month counts; needs an ornithologist's review.
- **Migration globe:** `src/MigrationGlobe.jsx` draws an orthographic globe on a canvas (drag or arrow keys to turn it,
  no library; outlines are in `src/data/species/world-countries.json`).
  `scripts/import-species-flyways.mjs` records, for each migratory bird, the countries outside India where eBird records
  it in its other season (May–Aug for winter visitors and passage birds, Nov–Feb for summer visitors), keeping up to six
  countries with at least 3% of those records, into `species-flyways.json`. The page globe follows the current filters;
  the species view shows one bird. **These are sightings, not tracked routes**, and country names are in English only.
- **Species view:** the photo's large version, all Kannada candidates with their sources, the monthly pattern, a map of
  up to 300 recent Karnataka records fetched live from GBIF (`api.gbif.org`; the live server's CSP `connect-src` allows
  it), a copyable link (`?species=ID#species`), and links to GBIF, Wikidata, IUCN (search, link out only) and Xeno-canto
  recordings for birds.
- **Family filter:** click a family name on a card.
- **Culture notes:** `species-culture.json` ties some species to the atlas (state bird and animal, the boar emblem of the
  Chalukyas and Vijayanagara, Tipu Sultan's tiger). Marked needs-review.
- **Name drive:** a progress bar per group and "Name ten species", which lists ten species with no Kannada name,
  photos first, in a fixed order per day.
- **Game:** "Name that species" in Aata-Paata (`?game=bird`), see [Aata-Paata](aata-paata.md).

## Contributor leaderboard and live names (live portal)

The live portal has MariaDB, so species names do not wait for a redeploy:

1. A signed-in, approved member opens **Suggest a Kannada name** (the guided form opens with record type *species* and
   asks for the Kannada name, a rationale and a citation with a locator).
2. A reviewer approves it in the normal review queue (the contributor earns karma as for any approved contribution).
3. `GET /api/species/community` (public, rate-limited, cached 60 s; `server/species-community.js`) returns the approved
   names (the latest approved name per species wins; only Kannada script, at most 120 characters) and a leaderboard of
   up to 20 approved members by number of species named. It exposes display names only, as the existing community
   leaderboard does, never ids or emails.
4. The species page overlays those names on the static ones and marks them *reviewed*, and shows the top ten contributors.
   The static GitHub Pages edition has no API, so it shows neither.
5. To carry accepted names into the static edition, run `npm run species:export-names` on the live server (it needs the
   database `.env`). It merges approved names into `src/data/species/kn-names-reviewed.json`; review the diff, commit and
   deploy.

No schema migration is involved: it reads the existing `contributions` and `users` tables.

Readers are pointed to these features by the **What's new** button in the header and "New" badges on menu items (`src/whats-new.js`; add new entries at the top, newest first). An item is marked seen when the reader opens it or visits its page, and the list is kept in `localStorage`.

## From where to where

For each migratory bird the species view shows **From → To**: the countries (up to four) and Indian states (up to three,
for birds that breed in the Himalaya or the north, such as Uttarakhand, Himachal Pradesh, Jammu and Kashmir, Ladakh)
where eBird records it in its other season, and the months it is seen in Karnataka (for example "Oct–Mar").
`import-species-flyways.mjs` gathers the countries and states (Karnataka excluded; states merged case-insensitively).
On the page, the globe's country buttons list the birds seen in a country ("From: Russia"). The origin is where the bird is
*seen* in the other season, not an exact breeding site or a tracked route, and passage migrants can be seen in several
places. Re-run the flyway import after changing the species list, then `node scripts/generate-open-datasets.mjs`.

## Migration page

`#migration` (Explore > Migratory birds, `src/MigrationExplorer.jsx`, logic in `src/migration.js`) is a large globe with the
birds beside it. Pick a month (it starts on the current one, "Here now"), a type (winter visitors, summer visitors, passage
migrants) or search a bird. **Tap a country's dot** and the names of the birds from there are written on the globe next to it
(up to eight, then "+N"); **pick a bird** and its routes are drawn and its name appears at each origin country, with a card
giving where it is seen in the other season and the months it is in Karnataka. The list shows photo, Kannada and English
names, origins and months. Data: `species-flyways.json` (see "From where to where"); sightings, not tracked routes.

## Inviting readers to sign up

`src/JoinPrompt.jsx` and `src/join-prompt.js`: a slim, dismissible strip at the bottom of the page ("Know a Kannada name? Spot a
mistake? Join free ...") appears after a reader has opened three pages in a session. It never shows to signed-in members,
not on account pages (contribute, profile, reviews ...), and not for 30 days after "Not now". Inline lines ("Open a free
account to suggest Kannada names") sit in the species name drive and at the end of a Name-that-species round. On the static
mirror the link goes to the main site's `#contribute`. It promises only what exists: suggesting corrections and names,
the contributors' board and certificates, and approval by a moderator. Sign-up clicks show up as visits to `contribute`
in the visitor statistics.

## The map of India on the globes

The globe's outlines (`src/data/species/world-countries.json`, 352 KB) are built by `scripts/build-world-outline.py` from Natural
Earth's 10 m country boundaries **drawn from India's point of view** (`ne_10m_admin_0_countries_ind`, public domain). India is
shown with all of Jammu and Kashmir, including Gilgit-Baltistan, and Ladakh, including Aksai Chin, as on the official map of
India; Pakistan and China are drawn to match, so the lines do not overlap. A test (`test/species.test.js`) checks that Srinagar,
Leh, Gilgit, Muzaffarabad, Skardu and Aksai Chin fall inside India's outline. Rings are simplified for a small globe (finer
around India and its neighbours). To rebuild: download the GeoJSON named in the script's header and run it. Guadeloupe and
Svalbard have no outline of their own and are counted with France and Norway in the flyway data.

The OpenStreetMap tile maps elsewhere (species records map, the geography page) draw borders as OpenStreetMap does, which is
not the official map of India. Replacing those with an India-official overlay or tile source is a separate change.

### Official boundary on the tile maps

`src/IndiaBoundary.jsx` puts India's official outer boundary on the Leaflet maps that can zoom out to Kashmir (the atlas map,
global relations, dynasty maps, India research, language timeline, people, freedom movement, script evolution and district
history). It loads `public/india-official-boundary.geojson` (48 KB, built by `scripts/build-india-boundary.py`, which needs
shapely: `pip install shapely`). The file has an `outline` (India's official boundary as lines) and a `claimed` area (what the
official map includes beyond the standard Natural Earth line: Pakistan-administered Kashmir, Gilgit-Baltistan, Aksai Chin),
filled with the tile map's land colour so OpenStreetMap's own border lines do not show through; place names inside that patch
are therefore hidden. The layer sits in its own pane above the tiles and below markers, and adds the attribution "India's
boundary as on the official map of India (Natural Earth)". Maps limited to Karnataka are unchanged, since Kashmir cannot be
reached on them. Add `<IndiaBoundary/>` inside any new `MapContainer` that can show the north of India.
