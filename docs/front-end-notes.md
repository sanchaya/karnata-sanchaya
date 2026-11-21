# Front-end layout notes

Updated: 2026-11-02

Practical rules learned while reworking page layouts. Check them before restyling a page.

## Page titles and heroes

- `src/page-consistency.css` gives the menu pages one title style: a full-width hero whose
  left edge follows `--page-col`, with the same h2 and eyebrow sizes. It forces
  `display:block` on the listed hero selectors (`body :is(...)`, specificity (0,2,1)).
  A page whose hero needs columns (About) must out-rank it, for example
  `body main.about-page>.about-hero{display:grid}`, which is (0,2,2).
- **Do not use `<header>` for a page hero or a panel heading.** A global rule gives every
  `header` a fixed height (the site header is 94px), so the text overflowed and overlapped
  the next block on `#research-tasks`, `#evidence` and inside panels. Use `<section>`, or set
  `height:auto;min-height:0` as `research-layout.css` does for the evidence page.

## Page-specific layout files

- `src/research-layout.css`: `#research` (one summary line, one toolbar, folded notes, a
  paged list of compact rows), `#research-tasks` (unclipped hero, wrapped category chips,
  place names instead of IDs) and `#evidence` (Show all on the coin and boundary lists,
  a work queue that collapses empty columns).
- `src/about.css`: the About hero (text left, Sanchaya and Sanchi right) and the donate card
  (intro and QR left, payment details right); the same card is reused on `#donate`.
- `src/geography-nature.css`: the geography statistics are a compact strip so the map is not
  pushed down the page.
- `src/karnataka-history.css`: the name and administration page.
- `src/dynasty-areas.css`: the dynasty control and legend. The legend's explanatory note is
  folded behind an "About this layer" link and the list is height-capped so it never covers
  the map.

## Tabs, search and accessibility

- Tabs use `role="tablist"`/`tab`/`tabpanel` with the `hidden` attribute on inactive panels.
  A Leaflet map inside a hidden panel must call `invalidateSize()` when its tab shows
  (`InvalidateOnShow` in `DynastyMapPage.jsx` and `WhoRuledPage.jsx`).
- `src/SearchBox.jsx` is the shared search field: a visible, keyboard-operable combobox
  (arrow keys, Enter, Escape) with a listbox of suggestions. Use it instead of a bare
  `<datalist>`.
- Controls are at least 44px tall, text is at least 12px, and focus has a visible outline.

## Printing

`community.css` hides everything except the certificates when printing
(`body>*{visibility:hidden}`). Pages that should print opt back in with a rule such as
`.dynasty-map-page,.dynasty-map-page *{visibility:visible}` inside `@media print`
(`scripts.css`, `karnataka-history.css`).

## Maps

The dynasty areas control (`DynastyAreasControl`) belongs only on maps whose records carry a
dynasty and a date; `test/dynasty-areas.test.js` lists where. See
[dynasty maps](dynasty-maps.md).

## Keeping the page alive under fast input

- **Never call `history.replaceState` on every input event.** Browsers rate-limit it (Safari throws a
  `SecurityError` after about 100 calls in 30 seconds), and an uncaught error in an effect unmounts the
  whole React app, which is a blank page. The home timeline and map movement used to do exactly that when
  dragged quickly. `createShareUrlWriter` in `src/share-state.js` merges rapid changes, writes once the movement
  pauses (250 ms) and swallows a refused write; `test/share-state.test.js` covers it.
- `src/ErrorBoundary.jsx` wraps the app in `main.jsx`: if a screen ever throws while rendering, the visitor
  gets a bilingual message and a Reload button instead of a blank page.


## Map fitting never zooms out to the world

Selecting an event, territory, comparison or freedom-movement record fits the map to its coordinates. One overseas or
mis-geocoded point used to pull the view out to the whole world. `regionalPoints` in `src/map-focus.js` keeps only the
points inside India when there are any, and the atlas viewport (`MapViewport` in `App.jsx`) and the freedom explorer
fit to those. The other points keep their markers; if every point is outside India the view still fits all of them.

## Sideways-scrolling menus show a fade

The activity bar's page list, the mobile menu and the section tab rows scroll sideways when they do not fit, with no
visible sign. `src/scroll-hint.js` (started from `main.jsx`) sets `data-scroll-left` / `data-scroll-right` on each
such menu while items are hidden on that side, and `src/scroll-hint.css` fades that edge. It also scrolls the open
page's entry into view once per page. To cover another menu, add its selector to `MENUS` in the script and to the
`:is(...)` lists in the stylesheet.

## Rivers, dams and lakes

`src/data/geography-waters.js` holds dams and reservoirs, lakes and tanks, and river landmarks (falls and
confluences) shown on the `#geography` map under their own filters. Each is an approximate reference point, not a river
course or a surveyed dam wall, and carries `review.status: needs-review`. Only the dams with a stated source year show
one. They also feed the Word Trail catalogue. Six more wildlife sanctuaries were added to `geographyProtectedAreas`.
River courses, catchment areas and reservoir capacities are not yet modelled; add them from India-WRIS with citations.

## Top menu: Nature, one Project & contribute menu, footer status

The top row has six menus: Explore, Nature, Research, India research, District Atlas and **Project & contribute**.

- **Nature** (ಪ್ರಕೃತಿ, `natureNavItems` in `src/App.jsx`): Geography and nature, Birds, animals and plants, Migratory birds. Explore
  keeps the history and people pages. A green accent, and a small dot on a top menu while one of its pages is unseen
  (`src/whats-new.js`; the secondary bar shows the word "New").
- **Project & contribute** (ಯೋಜನೆ ಮತ್ತು ಸಹಯೋಗ, `communityNavItems`) replaces the old Project and Contribute menus. One entry each:
  About & contact, Contribute, Support & donate, Research tasks, Resources, Evidence, plus My profile, Review queue and the
  administration pages for people with those roles. Nothing is listed twice: About and Contact are one item with a two-tab strip
  (`.about-contact-tabs`) above both pages; `#contact` still works, the footer links About and Support, and the floating Contact
  button is unchanged. The About page no longer embeds the donation block, only a link to the Support page.
- **Support.** The header's only utility link is "♥ Support" (`headerUtilityItems`), and the footer has "♥ Support the atlas". The
  Support page (`#donate`, `src/Donate.jsx`) opens with the donation block (QR/UPI, online button, receipt note; bank details are
  collapsed under "Pay by bank transfer") and lists the other ways to help from `src/support-options.js` beneath it as a compact row. **Add a new way to support there**: status `live` shows a titled link, status `soon` is named in one "Coming soon" line with a single
  "Tell us you are interested" mail link. Do not mark something live before it works. Today the three `soon`
  options (sponsor a topic, monthly supporters, grants and CSR) are plans, not features.
- **Offline ready / Install app** (`PwaControls`) moved from the header to the footer. Keep new header controls to what a visitor
  needs on every page; the header row is tight (an extra control once pushed Berunda out of view).

## Geography page: landforms, grouped filters and search

`src/data/geography-landforms.js` adds 26 places the page lacked: eleven peaks and hills with heights where well known
(Mullayanagiri 1,930 m is the highest), three rock landmarks (Savandurga, Yana, Hampi boulders, Shravanabelagola's twin hills),
four hill stations, Abbey Falls and seven coastal sites (Murudeshwar, Gokarna, Malpe, St Mary's Island, Maravanthe, Karwar,
Panambur). Jog, Shivanasamudra and Gokak are now their own `waterfall` type instead of "river". Like the water features, every
point is an approximate reference location awaiting review, with sources that are pointers (Wikipedia, Karnataka Tourism).
Heights and coordinates were written from general knowledge and need checking against Survey of India or a gazetteer.

`GeographyNatureExplorer.jsx` now builds one list (`ALL`) from the highlights, protected areas, water features and landforms.
Filters are five groups (mountains and hills, water, coast and islands, forests and protected areas, climate and plains) with
sub-filters and counts; a search box matches English and Kannada names; the list beside the map selects a place, flies the map
to it and opens a detail card (type, height or area, districts, review note, sources). Clicking a marker does the same.
The landforms also feed the Word Trail catalogue and the dataset counts.

### River courses, rock, caves, estuaries, rainfall and soil

- **River courses.** `public/karnataka-rivers.geojson` (42 KB, 36 rivers) is drawn as lines on the map, coloured by basin (Krishna,
  Kaveri, Godavari/Manjira, Pennar and Palar, west-flowing), with a "Show river courses" switch and a hover tooltip. The data is from
  **OpenStreetMap (© OpenStreetMap contributors, ODbL)**, so the file is a derived database that stays under the ODbL and the map
  names that licence. Rebuild it with `scripts/build-karnataka-rivers.py` (needs shapely; the Overpass query is in
  `scripts/data/karnataka-rivers.overpass`): it merges each river's segments by name, clips them to Karnataka plus a 0.25 degree
  margin, simplifies them and adds the draft Kannada name and basin. Lines are simplified, not survey-grade, and some rivers (Swarna and
  smaller streams) are missing or short. Natural Earth was checked first and only has seven rivers here.
- **Rock and mines.** Eleven `geology` points tie the stone to the history: Hoysala chloritic schist (Halebidu), Chalukya sandstone
  (Pattadakal, Aihole), Lakkundi schist, Deccan basalt (Vijayapura), Bidar laterite, Shahabad limestone, Chitradurga granite,
  and the Kolar, Hutti, Sandur and Kudremukh mines. Source pointers: Wikipedia, Karnataka Tourism, Geological Survey of India.
- **Caves.** Three rock-cut `cave` sites (Badami, Aihole, Gavi Gangadhareshwara). Karnataka's natural limestone caves are not
  mapped.
- **Estuaries.** Three `estuary` points (Sharavathi at Honnavar, Netravati–Gurupura at Mangaluru, Kali at Karwar). Mangrove extents
  are not mapped; the Aghanashini estuary is one of the Ramsar sites already shown.
- **Rainfall, soil and rock** appear on each of the four region cards as broad bands (`facts` in `geographyNatureRegions`), not as
  maps: coast above about 3,000 mm, Malnad 3,000 mm and more on the windward Ghats, the north-interior 500–750 mm, the
  south-interior 700–900 mm; laterite, red, black (regur) and coastal alluvial soils; and the main rocks. These are textbook
  bands to be checked against IMD and the Karnataka soil survey before they are cited. A "Rivers and basins" card describes the basins.
- All new point features are approximate reference locations marked `needs-review`; coordinates were written from general
  knowledge and need checking.

**Still not covered, because it needs an official or licensed dataset:** statutory reserved-forest and protected-area boundaries
(Karnataka Forest Department / Bhuvan; the page links out, and OpenStreetMap's version is neither official nor complete),
rainfall and soil as mapped layers (IMD, NBSS&LUP), geological maps (GSI), catchment polygons (HydroSHEDS or India-WRIS),
agro-climatic zones as polygons, natural cave systems and mangrove extents. If you can supply or license one of these, it can be
added the same way as the rivers.

## Licensing and the Data wanted page

- **Licensing.** `LICENSING.md` (repository root, linked from the README and from the footer's "Non-commercial use only · Licence"
  link) states that the project is non-commercial and lists every kind of data with its source, licence and obligations, the
  dependency licences, how to cite, and the open items for the owner. The project's own terms are PolyForm Noncommercial 1.0.0 for
  software and CC BY-NC-SA 4.0 for original data and text (full texts in `LICENSES/`); third-party data keeps its own licence. When you
  add a data source, add it to `LICENSING.md` §3 in the same change (`test/licensing.test.js` checks the main topics and that the
  production dependencies are listed). The ownership and licence gaps we could not settle from the repository are in §9; they need
  the owner's decision and legal review.
- **Data wanted** (`#data-wanted`, Project & contribute > Data wanted; `src/DataWanted.jsx`, list in `src/data/data-wanted.js`,
  mirrored in `docs/data-wanted.md`, kept in step by a test). Each item shows what we need and who might hold it, with an "I know a
  source" button that opens the existing contribution form for a new source (an account is needed; the static mirror links to the main
  site) and an email link. To close an item, record the source in `LICENSING.md` §3 and delete it from both lists.

## Never touch localStorage or sessionStorage directly

Some browsers (in-app browsers such as WhatsApp's and Instagram's, strict privacy modes, blocked cookies) **throw a `SecurityError`
when the `localStorage` or `sessionStorage` property is merely read**, so a helper that takes the storage object as an argument
fails before its own `try`. That crashed every page with "Something went wrong" (the language and map-theme settings, then the
sign-up banner and visit counter). Use `safeStorage` / `session` from `src/safe-storage.js`, which read the property inside the try and
give `null` / `false` when storage is unavailable. `test/species.test.js` simulates blocked storage and scans `src/` for storage
use outside a `try`. The error screen now shows a short technical detail to make future crashes diagnosable.

## Licences & sources page

`#licenses` (Project & contribute > Licences & sources; `src/Licences.jsx`, list in `src/data/licences.js`) shows every kind of data and
software with its source, licence, how it is used (copied, pointer or display), what a reader must do, where it lives in the
repository and a badge for commercial use: **non-commercial only** (the project's own terms), **allowed under the source's own
licence** (public domain, CC0, CC BY, ODbL...), **check the item** (per-item or unconfirmed) or **all rights reserved**. It opens
with the non-commercial notice, and the footer's "Non-commercial use only · Licence" link goes to it. `ref` in each entry is the
section of `LICENSING.md`; a test fails if a section is missing. When you add a data source, add it to `LICENSING.md` §3, to
`licences.js`, and (if it is something we are still looking for) remove it from `data-wanted.js`. Items marked "check the item" are
the open items for the owner; change them only when the licence is confirmed.

## Language switch must not shift the page

Switching Kannada/English changes text widths. `page-consistency.css` clips horizontal overflow on `html` and `body`, keeps the language button a fixed minimum width and stops the header actions from wrapping or growing on phones.

## Press coverage

The About page lists news coverage of the atlas ("In the media") from `src/data/press-coverage.js`: headline, outlet, date and link only. Add new items at the top of that file.

## Marking new pages and features as new

Every new page or reader-facing feature gets an entry at the top of `WHATS_NEW` in `src/whats-new.js` in the same change (`view` is the page hash, `date` the day it shipped). A first-time visitor has an empty seen-list, so every entry shows as new: the "What's new" count in the header and a dot on that page's menu item. An entry stops counting once the reader opens its page (or the `param` the entry names) or taps it. `test/species.test.js` checks the entries are well formed; it cannot tell that you forgot one, so check the list when you add a page.

## Page heroes

Every Explore page, and Fonts, Species, Migration, Data wanted, Licences, Contact and Donate, carries `explore-hero` on its hero section (`src/explore-hero.css`): a full-width gradient band with the eyebrow, title and one-line purpose in one `<div>`, plus any stats beside it. The older section pages (Literature, Coins, Scripts, Nature, India research, Evidence, Research tasks, Resources) use their own hero classes that were measured to match; About keeps its richer hero with the stewards panel. New pages should use `explore-hero` and wrap the text in one `<div>`.

## Experience menu

Aata-Paata (games), Old games and recreation, Folk arts (`kale`, the arts page; crafts, music and dance can become tabs there when sources are read), Food culture and Trails live under a top-level **Experience** menu next to Explore, as Nature was split out before. The group is `experienceNavItems` in `src/App.jsx`, with `ACTIVITY_OF` entries of `'experience'` and an accent colour in `src/nav-activity.css`. Define any value a nav list uses before the list (`kn` is only defined further down; use `locale==='kn'`). The tests read source text and cannot catch such an error, so open the page in a browser after editing the menu.

## Hero alignment

Every `.explore-hero` band is full width and its text starts at the shared page column, `--page-col` from `src/page-consistency.css` (the 1180px column, 130px from the edge on a 1440px screen), so the heading sits at the same place on every page. `src/explore-hero.css` used a fixed 55px inset before, which put the text at the screen's left edge on pages such as Food, Recreation, Press, Species and Relations. Use `var(--page-col)` for any new full-width band rather than a fixed inset.

A page whose first child is an `.explore-hero` gets `padding-top:0` (`main:has(>.explore-hero:first-child)`), so the band sits flush under the second-level nav instead of leaving the page's own 18 to 48px top padding as a white gap. Put the hero first in the page for this to apply.

Stats in a hero: put them in a second child of the `.explore-hero` (class ending `-stats`, like Press) and they sit beside the text. `page-consistency.css` sets `display:block` on several heroes with a more specific selector, which used to push the stats onto a second row (Freedom, People); `explore-hero.css` now restores the grid with `body .app-shell .explore-hero`. On a phone the stats go below and wrap. Freedom went from 193px to 146px tall and People from 221px to 149px.

Geography, Literature and Epigraphy heroes now carry the `explore-hero` class too, so they sit flush under the nav with stats beside the text. The flush-top rule covers `section.portal-page` as well as `main`. Geography's source-linked facts are a compact wrapping row (`.nature-facts`, max 600px).

Hero audit (all public views): Coins, Scripts and the five India research pages now use `explore-hero` too (stats beside the text; on India research the evidence-policy note moved to a slim line under the hero). Evidence, Research (resources) and Research tasks keep their own hero markup, but the flush-top rule (`:has(>.evidence-hero …)`) removes the 34 to 48px gap. About and Contact keep a 50px offset because their About/Contact tab row sits above the hero. Re-run the audit after adding a page: the hero should be the first child of the page and the gap under the second-level nav should be 0.

## Atlas left bar follows the clicked event

Clicking a timeline card for an event now selects the polity named in its first `participants[].polityId`, so the left-hand kingdom list highlights that dynasty (for example Badami Chalukya for the Pulakeshin I card). Before, the list fell back to its first entry (Western Ganga). Events with no polity participant leave the selection as it was.

The atlas right-hand record panel is now 290–330px wide (was 360–400px) so the map gets the room; set in the `.app-shell main` grid in `src/styles.css`.

## Compare two years (hidden)

The atlas "Compare two years" button is hidden because it is little used. The feature is intact: set `SHOW_YEAR_COMPARE=true` above `Timeline` in `src/App.jsx` to show it again. Its pieces are `compareYear` state, `comparisonTerritories`/`comparisonChanges`, the `comparison-legend` and `comparisonPresets`, so it can be reused on another page.

## Timeline cards: category under the year

Each timeline story card shows year, then its category (with a "+N" count for grouped cards), then the title; the colour bar spans all three lines. Research-candidate cards show no category line ("research candidate, not yet published") to save space; the card's colour and the map layer already mark them.
