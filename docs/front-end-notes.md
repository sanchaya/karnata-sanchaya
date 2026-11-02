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

