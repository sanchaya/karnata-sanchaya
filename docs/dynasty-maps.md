# Dynasty maps, "Who ruled here?" and the evidence behind them

Updated: 2026-11-02

This describes how the atlas draws dynasties, why it no longer uses district or
state fills, where the data comes from, and what a maintainer must do after
changing it. Every dynasty phase, evidence point and lead is
`needs-review` / `unverified`; none is a surveyed frontier.

## Why there are no borders

Early versions coloured whole modern districts and states for each dynasty.
Historians and users rightly objected: medieval kings did not rule modern
districts, frontiers were zones, and several powers overlapped through
feudatories and tribute. Districts and states are therefore **not** used to
claim territory any more.

Instead each dynasty is drawn as a **soft, blurred wash around the evidence the
atlas holds for it**. Several dynasties may share an area; nobody "wins" an
overlap. Modern district outlines remain only as an optional reference layer
(unticked by default, labelled "reference only").

## Data

| File | Role |
|---|---|
| `src/data/dynasty-areas.js` | `DYNASTY_PHASES`: id, `polityId`, conventional `from`/`to`, colour, bilingual name and capital. No district or state units. `dynastyAreasForYear(year)` returns the phases active in a year. |
| `src/data/dynasty-evidence.js` | `evidenceFor(phase, year)`: the points that shade the map. `LEADS`, `WASH_KM`, `WASH_ALPHA`, `KIND_LABEL`, `centroid`. |
| `src/data/dynasty-inscriptions.js` | 32 Kalachuri, Seuna and Ratta inscription records, their findspot places and one source. |
| `src/data/events.js` (`externalPolities`, `externalPolityContext`) | Polity records for the Kannada-region dynasties added with the maps. |
| `src/data/external-capitals.js` | Capital places and the `externalCapitalIds` polity → place map. |

### Evidence points

`evidenceFor` builds an index once from `atlasData` and returns, for a phase:

- the polity's **capital** (`capital` tier);
- dated **inscriptions**, **coins** and **monuments** with a place (`attested`);
- **events** with the polity as a participant: battles, campaigns, invasions,
  wars, diplomacy and trade are `influence` (wider, fainter wash); other events
  are `attested`;
- hand-kept **leads** (`lead` tier, see below).

Rules that must hold (tests enforce the first three):

1. Every phase has at least a capital point, and every point lies in India
   (lat 5–35, lng 68–90). Overseas embassies and trade contacts are dropped.
2. With a year, only points dated on or before it count; undated points always
   count. A polity spanning phases (Mysore) keeps only points overlapping its
   own phase.
3. Phases carry no `districts` or `reach` fields.
4. Leads never count as evidence.

### Leads: the open rings

A **lead** is a place where historians place a dynasty but the atlas has no
record yet (for example Kolar for the Cholas, Belagavi for the Marathas). It is
drawn as an open dashed ring, never as shading, so the map shows the gap instead
of claiming ground. Hovering says "no record yet"; the popup links to
`#contribute`. Leads live in `LEADS` in `dynasty-evidence.js`, keyed by polity
id. Add a lead only with a place name and a reason a contributor can check;
promote it to evidence by adding a cited inscription, monument or event.

## Pages and controls

- **`#dynasties` (Explore → Dynasty map)**, `src/DynastyMapPage.jsx`. Three tabs:
  - *Dynasty map*: a year slider (100–1950) with milestone buttons, in the
    style of the home timeline; a rail of the dynasties **active that year**
    (plus "all dynasties this year"); the interactive map; the Help-wanted panel
    (`DynastyHelpWanted.jsx`); the assumptions panel
    (`DynastyAssumptions.jsx`); and a collapsed "Browse all dynasties" list
    (`DynastyGallery.jsx`).
  - *Maps by era*: eight small maps (400, 700, 1000, 1200, 1400, 1600, 1800,
    1900), `DynastyEras.jsx`.
  - *Download & share*: link, QR code, copy and download of the poster in Kannada
    and English. Posters are drawn on an off-screen canvas; the grid grows with
    the number of dynasties.
- **`#who-ruled` (Explore → Who ruled here?)**, `src/WhoRuledPage.jsx`. Pick a
  place (search, district or map click) and a radius (50–250 km) to list the
  dynasties with recorded evidence nearby, in time order, with the nearest
  records and distances; below it is a timeline of every dynasty. A record
  nearby is not proof of rule: the page says so.
- **Other maps** use `DynastyAreasControl.jsx` / `DynastyAreasLayer.jsx` (scripts,
  coins, relations, people, freedom, district history, literature/epigraphy,
  India languages and research). The main atlas uses the layer with its own
  toolbar button. The control takes `phases` (pin dynasties), `evidenceYear`
  and `labels`.
- **Printing:** `@media print` in `src/scripts.css` hides navigation and the
  interactive map and prints the thumbnails, era maps and assumptions. It
  overrides the certificate-only print rule in `community.css` for these pages.

### Help wanted

The Help-wanted panel and the "Help wanted" badge on the year rail list
dynasties with fewer than four records, with a link to `#contribute`. The panel
also lists dynasties **not yet on the map** (Sendrakas, Banas, Guttas,
Chengalvas and Kongalvas, the Qutb Shahis and the Nizam's northern Karnataka).
Those are names only: no dates or places are claimed until someone brings a
source. A dynasty needs at least a capital before it can be added as a phase.

## What the maps assume (shown to users)

Covered: shading around recorded capitals, inscriptions, monuments, coins and
events; records up to the chosen year; conventional dynasty spans; overlaps.
Not covered: borders or surveyed frontiers; dynasties with few records (shown
by capital only, "thin evidence"); some inscriptions placed at the taluk town
instead of the village; dynasties not yet added; everything awaits review.

## Adding or changing a dynasty

1. Add the polity (`externalPolities` list and `externalPolityContext` in
   `events.js`, or an internal polity in `atlas.js`) and its capital place and
   `externalCapitalIds` entry in `external-capitals.js`.
2. Add a phase to `DYNASTY_PHASES` (keep the list in start-year order).
3. Add cited inscriptions, monuments or events so it has evidence beyond the
   capital; add `LEADS` for places with no record yet.
4. If it has an era typeface, `eraFamily` reads it from `src/data/era-fonts.js`.
5. `node --test test/dynasty-areas.test.js`, then look at `#dynasties` and
   `#who-ruled`.

## The Kalachuri, Seuna and Ratta inscriptions

`dynasty-inscriptions.js` was generated once from the canonical South Indian
Inscriptions volume XX summaries (Bombay-Karnatak) already imported into the
atlas, and is committed as data. Only the ruler named in each record's own
heading decides the polity (Bijjala → Kalachuri, Singhana → Seuna, Kartavirya →
Ratta). Findspots are the village where its geocoded point matched the printed
taluk and district; otherwise the taluk town (`precision: taluk-town`). Undated
records are placed in the named king's reign; two Seuna records print years
(1123, 1124) that do not fit the king and are placed in his reign with a note.
One record with no village or taluk was skipped. Kannada village names are
transliterations and need a native reader. The printed edition must be checked
before any record leaves `needs-review`.

## Deployment notes

- No database migration is involved. The live portal reads its dataset from the
  MariaDB snapshot, so run `npm run db:sync-dataset` after deploying: the new
  polities, places and inscriptions are added by id. Until then the live dynasty
  pages show the new dynasties without evidence points. The static edition needs
  `npm run publish:static` (or a Pages rebuild).
- `db:sync-dataset` is additive: it **does not overwrite fields of records that
  already exist**. Renaming an existing polity (the Vijayanagara polity is now
  "Karnataka (Vijayanagara) Empire" / ಕರ್ನಾಟಕ(ವಿಜಯನಗರ) ಸಾಮ್ರಾಜ್ಯ) therefore
  reaches the dynasty pages and the static edition, but the live record keeps its
  old name until it is edited in Admin or by a one-off script.
- The portal statistics (the compact total in the navigation) count
  `externalPolities`, `places`, `inscriptions` and other collections, so they
  move only after the sync.

## Loading time (live edition)

`public/early-dataset.js`, injected into the HTML head by `vite.config.js`,
starts the `/api/dataset` request before the application bundle runs;
`src/data/runtime.js` uses that request when present. It is skipped for static
and custom-API builds. `/api/dataset` is sent with `Cache-Control: no-cache`
(ETag revalidation) instead of `no-store`. `import('./App')` must stay after
`hydrateAtlasData()` because `App.jsx` reads `atlasData` at module level.
The static edition still embeds the dataset in the main bundle.

## Tests

`test/dynasty-areas.test.js` covers: no district or state units on phases;
every phase has a capital and in-India points; evidence grows with the year and
a multi-phase polity keeps only its own phase; Cholas and Marathas have leads
that are never evidence; the atlas layer, toolbar button and route exist; the
QR file exists.
