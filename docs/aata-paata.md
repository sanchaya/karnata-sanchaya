# ಆಟ–ಪಾಠ · Aata–Paata

`#aata-paata` is the atlas learning-and-play workspace. It is Kannada-first,
bilingual, static-build compatible and uses the existing research collections
rather than a second hand-maintained question bank.

## Included games

- **ಪದಯಾನ · Word Trail:** a daily word selected from names of polities, places,
  works, inscriptions and protected landscapes. It uses Unicode grapheme
  clusters so a Kannada orthographic unit occupies one tile.
- **ಕಾಲಚೌಕ · Time Grid:** a 4×4 logic grid whose four symbols are actual years
  attached to atlas events. The event names are shown after the grid so the
  number puzzle remains connected to historical context.
- **ಇತಿಹಾಸ ಪದಜಾಲ · History Crossword:** a weekly crossword assembled from the
  same word catalogue. Clues carry the record ID, type and route back to the
  relevant atlas section.

These are original implementations of familiar public-domain game mechanics.
No third-party game code, puzzle content, name or branding is bundled.

## Data and provenance

Game terms are built at runtime by `buildWordCatalog()` in
`src/aata-paata.js`. The source collections are:

- `atlasData.polities`
- `atlasData.places`
- `atlasData.works`
- `atlasData.inscriptions`
- `geographyProtectedAreas`
- `geographyNatureHighlights`

The time grid uses `atlasData.events`. A game never promotes or alters a
research record. Correcting an atlas name, date or relationship changes future
puzzles automatically after the normal validation and publication workflow.

Do not add a historical statement only to make a puzzle easier. Add or correct
the canonical research record with its citation first. The game may then use
that record.

## Adding future game material

1. Add the source-backed record through the normal dataset or MariaDB review
   workflow.
2. Ensure the record has a bilingual `name`, stable `id` and the expected date
   or location metadata.
3. If it belongs to a new collection, add one explicit adapter in
   `buildWordCatalog()` with a route and a clue that does not reveal the answer.
4. Add a regression test in `test/aata-paata.test.js`.
5. Run `npm run check`.

Avoid manually copying lists into the game. This keeps spellings, review
status and future research corrections aligned with the atlas.

## Storage and static deployment

Word-game progress is stored in `localStorage` under an
`atlas-aata-word:*` key. It is recreational state only—not research data—and
the games still work if storage is unavailable. No account, API or MariaDB
connection is required. Vite includes the page in both GitHub Pages and live
portal builds.

## Accessibility

- Every game works with native buttons, inputs and keyboard focus.
- Word feedback includes symbols and text, not colour alone.
- Status changes use an `aria-live` region.
- Kannada length and crossword placement use `Intl.Segmenter` grapheme
  clusters with a standards-based fallback.
- Mobile layouts stack controls and clues without hiding puzzle content.
