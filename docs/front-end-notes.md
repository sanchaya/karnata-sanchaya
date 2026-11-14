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
  Support page (`#donate`, `src/Donate.jsx`) lists ways to help from `src/support-options.js` above the existing donation block
  (UPI, bank, online). **Add a new way to support there**: status `live` shows an "Open" link, status `soon` shows a "Coming
  soon" tag and a "Tell us you are interested" mail link. Do not mark something live before it works. Today the three `soon`
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

**Still missing, by design or lack of a source:** river courses and catchments, rainfall and soil maps, geology, caves,
mangrove and wetland extents beyond the four Ramsar sites, and statutory forest boundaries (the page links to Bhuvan). Each
needs a licensed or official dataset, not memory.
