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
- **Name styling:** on the page, map labels and the dynasty list use only the modern Kannada text (plus the English name on the English site). The old-script (era font) rendering of Kadamba, Western Ganga, Badami Chalukya and Hoysala names appears only on the generated poster, which can carry Kannada, the era typeface and English together (`nameLines(phase, locale, withEraFont)` in `DynastyGallery.jsx`).
- **`#who-ruled` (Explore → Who ruled here?)**, `src/WhoRuledPage.jsx`. Two tabs:
  *Place lookup* and *Timeline of all dynasties*. In the lookup, find a place with
  the visible search box (`src/SearchBox.jsx`, a keyboard-operable combobox that
  also finds districts), the district list or a map click, and set a radius
  (50–250 km). The map zooms to the place; a compact timeline directly under the
  map shows only the dynasties with records nearby (a dot per dated record), and
  the list beside it gives the nearest records and distances. The second tab
  holds the timeline of every dynasty, dimming those with nothing nearby.
  `#dynasties` has the same search box to find a dynasty by name. A record
  nearby is not proof of rule: the page says so.
- **Other maps** use `DynastyAreasControl.jsx` / `DynastyAreasLayer.jsx` only where
  the page holds dynasty and date information: scripts (pinned to the record's
  own dynasties), coins and literature/epigraphy (both start with the layer
  off). It is deliberately **not** on the freedom, relations, people, district
  history, India languages or India research maps, where it would only add
  clutter; `test/dynasty-areas.test.js` enforces the list. The main atlas uses the layer with its own
  toolbar button. The control takes `phases` (pin dynasties), `evidenceYear`
  and `labels`.
- **Printing:** `@media print` in `src/scripts.css` hides navigation and the
  interactive map and prints the thumbnails, era maps and assumptions. It
  overrides the certificate-only print rule in `community.css` for these pages.

### Help wanted

The Help-wanted panel and the "Help wanted" badge on the year rail list
dynasties with fewer than four records, with a link to `#contribute`. The panel
also lists dynasties **not yet on the map** (currently the Qutb Shahis and the
Nizam's northern Karnataka). Those are names only: no dates or places are claimed
until someone brings a source. A dynasty needs at least a capital before it can
be added as a phase.

The Sendrakas of Nagarkhanda, the Banas of Kolar, the Guttas of Guttavolal and
the Chengalvas and Kongalvas are on the map with **rough seats and spans**
(their capital names say "approximate"): published sources confirm that they
existed and roughly where (the Banas at Kolar and Gudimallam; the Sendrakas in
the Nagarkhanda/Banavasi province; the Chengalvas and Kongalvas as Malnad chiefs
under the Hoysalas), but there is no dedicated reference page for the Guttas, and
no dates were checked against a printed source. Treat all four as prompts for
contributors, not findings.

## What the maps assume (shown to users)

Covered: shading around recorded capitals, inscriptions, monuments, coins and
events; records up to the chosen year; conventional dynasty spans; overlaps.
Not covered: borders or surveyed frontiers; dynasties with few records (shown
by capital only, "thin evidence"); some inscriptions placed at the taluk town
instead of the village; dynasties not yet added; everything awaits review.

## Reference: the Census 2004 Historical Atlas of Karnataka

`src/data/census-historical-atlas.js` records facts from *A Historical Atlas of
Karnataka* (H. Shashidhar and N. Sreenivasa Murthy, Directorate of Census
Operations Karnataka, Census of India 2001, published 2004), read from the
Internet Archive item <https://archive.org/details/62_36931_2001_his> (OCR text
`census_his_djvu.txt`, 181 KB). The book is Government of India copyright, so
**only dates, names, places and figures** are kept, in our own wording, each
with its map number; no text, map or table is reproduced, and the raw OCR is not
stored in the repository. It is registered as source
`src-census-2004-historical-atlas-karnataka` (a secondary compilation, `needs-review`).

What it adds:

- **Profiles** (`CENSUS_ATLAS_PROFILES`, 21 entries): the book's period, approximate
  greatest extent in sq km, capital(s), origin, important rulers, languages, major
  works and monuments. The dynasty page shows the profile for the dynasty you pick
  (`DynastyProfile.jsx`) and flags where the book's period differs from our span,
  so spans can be reviewed rather than silently changed. Differences found: Kadamba
  (325 vs 345), Western Ganga (325–1004 vs 350–1000), Badami Chalukya (500 vs 543),
  Rashtrakuta (757 vs 753), Kalachuri (1167 vs 1156), Chola in Gangavadi (985–1122 vs
  1004–1116), Seuna (1198–1312 vs 1187–1317), Vijayanagara (1336–1565 vs 1336–1646,
  the book stops at Talikota), Adil Shahi (1489 vs 1528), Barid Shahi (1487 vs 1489),
  Keladi (1500 vs 1499), Chitradurga (1568–1799 vs 1588–1779), Marathas (1637–1687 vs
  1676–1818) and the later Mysore Odeyars (1881 vs 1800). Our spans are unchanged.
- **A new dynasty:** the Nadaprabhus of Yelahanka (1420–1728, capital Yelahanka).
- **Sourced leads:** open rings with a citation, for places the book names but that
  we have no record for: Kolar (first Ganga capital), Elichpur and Latur (the
  Rashtrakuta first capital and original home) and Halasi (a Kadamba provincial
  capital). A lead carries `source: { sourceId, locator }` and its popup shows it.
- **Method support:** the book says its maps mark each dynasty's greatest extent only
  approximately, are drawn from published literature rather than surveys, and show
  that different parts of Karnataka were ruled by different dynasties at the same
  time. The assumptions panel quotes this in meaning, because it is the same stance
  as our soft, overlapping washes.

Not yet used: the book's maps 25–34 on the later administrative divisions (1799,
1831–1881, 1857, 1912, 1956, 1986–1997), its "Antiquity of Karnataka" article (earliest
attestations of the name Karnataka, for example the Kadamba Santivarman inscription
of about 450 and the Samangad plates of 753), and the Mughals in the Deccan
(1657–1757). They are good next candidates for `administrativeDivisions` and for
dated inscription records. The profile text is English only; Kannada labels around it
need native proofreading.

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
