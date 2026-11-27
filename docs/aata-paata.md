# ಆಟ–ಪಾಠ · Aata–Paata

`#aata-paata` is the atlas learning-and-play workspace. It is Kannada-first,
bilingual, static-build compatible and uses the existing research collections
rather than a second hand-maintained question bank.

## Included games

Seven games and a worksheet, eight tabs in all.

- **ಪದಯಾನ · Word Trail:** a daily word selected from names of polities, places,
  works, inscriptions and protected landscapes. It uses Unicode grapheme
  clusters so a Kannada orthographic unit occupies one tile.
- **ಕಾಲಚೌಕ · Time Grid:** a 4×4 logic grid whose four symbols are actual years
  attached to atlas events. The event names are shown after the grid so the
  number puzzle remains connected to historical context.
- **ಇತಿಹಾಸ ಪದಜಾಲ · History Crossword:** a weekly crossword assembled from the
  same word catalogue. Clues carry the record ID, type and route back to the
  relevant atlas section.

- **ಎಲ್ಲಿದೆ? · Where is it?:** five atlas places a day inside Karnataka
  (`buildWhereRounds` in `src/aata-where.js`). The player drops a pin on a map;
  the score is 1000 on the spot, falling in a straight line to 0 at 400 km. A
  place that was a capital or holds a catalogued inscription is clued by that
  fact. Every round ends by showing the true place, the distance and, for
  records still awaiting review, a note saying so. Records awaiting review are
  used on purpose; the games are meant to draw attention to them.

- **ನಾನು ಯಾರು? · Who am I?:** five dynasties a day from the 41 dynasty-map
  phases (`src/aata-who.js`). Up to four clues open one at a time (period,
  capital, an atlas record, first letter); a wrong option is struck out and the
  next clue opens. Right on clue 1 scores 4, on clue 4 scores 1.
- **ಲಿಪಿ ಪತ್ತೆದಾರ · Script Detective:** a Kannada word from the catalogue set in
  one era typeface (Kadamba, Ganga, Chalukya, Hoysala or modern); name the style
  (`src/aata-script.js`). The typefaces are modern recreations, so the game
  teaches the look of each style, not a reading of an inscription.
- **ಯಾವ ಜೀವಿ? · Name that species:** a Wikimedia Commons photo and four names from the same group, five species a day
  (`src/aata-bird.js`, `src/AataBird.jsx`). Names, photos and their credits come from the species data (see
  [species](species.md)); Kannada rounds use species-level names only, since a group name such as ಬೆಳ್ಳಕ್ಕಿ fits several
  species. The photo's author and licence are shown with every round. The species data loads only when this tab opens. A row of type buttons (all, bird, mammal, reptile, amphibian, insect, plant; only types with enough named photos) limits the day's five questions to one type. The title and question then use that word ("ಯಾವ ಹಕ್ಕಿ?", "ಇದು ಯಾವ ಸಸ್ಯ?", "Name that bird") instead of the generic "species"; the mixed mode asks "ಇದು ಯಾವ ಜೀವಿ?" only in the title and names each round's own type in the question. `?game=bird&quiz=plant` opens a type directly.
- **ತರಗತಿ ಕಾರ್ಯಪತ್ರ · Classroom worksheet:** a printable sheet of the day's
  places, dynasties and scripts with blanks for answers, and an answer key on its
  own page. Print rules in `aata-paata.css` hide the site chrome.

Every reveal has a "Spotted a mistake? Suggest a correction" link to
`#contribute`, and shared results end with a challenge line and the puzzle link,
which opens the same puzzle for the friend.

## Learning after the game

- Word Trail hints open in steps: the kind of record after two guesses, the
  clue after three, the first letter after five. A "Hint (n/3)" button opens
  the next step at any time (kind, then clue, then first letter); the count is
  saved per day and hints do not change the shared result. When the game ends the answer,
  its clue, a review note and a link to the atlas page are shown.
- Each game shows played, won, day streak and best streak
  (`src/aata-stats.js`, stored per game under `atlas-aata-stats:<game>`). Only a
  puzzle played on its own day moves the streak, so the archive cannot inflate
  it; the weekly crossword keeps totals only.
- A finished game can be shared as text. Word Trail shares the coloured grid
  without letters, Where is it? shares the score and a coloured square per round.

## Archive and Kannada typing

The archive control opens any daily puzzle from the launch date and moves
through weekly crosswords in seven-day steps. The selected game and date are
kept in the URL as `game` and `puzzle`, so an archived puzzle can be shared.
Played word guesses, time-grid cells, crossword answers, map pins, dynasty answers and script answers are stored under
date/week-specific `atlas-aata-*` local-storage keys.

Kannada answer fields include an optional phonetic IME toggle. The integration
bundles jQuery 3.7 and the dual-licensed Wikimedia `jquery.ime` framework; the
small `kn-atlas-transliteration` rule registered by this project is MIT-licensed
and limited to game input. Direct Kannada keyboard input continues to work when
the IME is enabled or disabled. No CDN or external runtime request is used.

On narrow screens, the game selector uses two roomy columns with the crossword
on its own row, archive actions wrap into two touch-friendly columns, the IME
control moves below the answer field and crossword clues use a bounded,
scrollable single-column list. The floating page-guide launcher is hidden on
this page at phone widths so it cannot cover game inputs or action buttons.

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
- `geographyWaterFeatures` (dams, lakes, rivers; `src/data/geography-waters.js`)

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

Game progress is stored in date/week-specific `localStorage` keys. It is
recreational state only—not research data—and the games still work if storage
is unavailable. No account, API or MariaDB connection is required. Vite
includes the page in both GitHub Pages and live portal builds.

## Accessibility

- Every game works with native buttons, inputs and keyboard focus.
- Word feedback includes symbols and text, not colour alone.
- Status changes use an `aria-live` region.
- Kannada length and crossword placement use `Intl.Segmenter` grapheme
  clusters with a standards-based fallback.
- Mobile layouts stack controls and clues without hiding puzzle content.

## Board games (Aadu-Huli, Ali Guli Mane, Chowka-bara)

Three playable traditional board games sit beside the daily games, played against the computer (`src/AataBoard.jsx`, rules in `src/aata-board.js`, tested in `test/aata-paata.test.js`). They are not daily puzzles, so the archive date picker is hidden for them; each can be embedded with `?game=huli`, `?game=mane` or `?game=chowka`.

- **Aadu-Huli (goats and tigers):** 5×5 points with the usual diagonals, four tigers (computer), twenty goats (you). Goats are placed one at a time, then moved; tigers step or jump a goat. Goats win by leaving the tigers no move; tigers win by capturing five goats. The computer takes a capture when it has one, otherwise the step that keeps the most moves open.
- **Ali Guli Mane:** two rows of seven pits, four seeds each, sowing and capture. After the last seed, a non-empty next pit is lifted and sowing continues; an empty one wins the pit after it. The game ends when a side has no seeds to play; each side keeps its own remaining seeds. The computer picks the move with the best seed difference one move ahead.
- **Chowka-bara:** 5×5 board, four pawns each, you at the bottom and the computer at the top. Four cowrie shells: mouths up is the move, none up is eight; four and eight give another throw. A pawn runs the 16 outer squares, then the 8 inner squares, and needs an exact throw to reach the centre. Landing on a lone or stacked opponent on a non-✕ square sends it to the start and earns another throw; ✕ squares (corners, edge centres and the centre) are safe. Simplifications: no "first capture needed to enter the inner ring" rule and no blocking by paired pawns. The computer prefers finishing, then capturing, then safe squares. Pagade (the dice version) is not built separately.
- **Rules are the commonly played versions.** No Karnataka rulebook has been read yet (the atlas entries on these games are a Wikipedia page and a lead), so the page says rules vary by village and links to Old games and recreation. Replace with a sourced rule set when one is found. The Kannada text on the page needs a native proofread.
- **Not built yet:** more than two players, Pagade, Chenne-mane variants, Nine Men's Morris, Phañjikā.

## TolluGatti block

A "Play these games" block linking to TolluGatti (a Mysuru venture that hosts these old games online) sits under the games on the Aata-Paata page, as it does on Old games and recreation. It is one component (`src/PlayBanner.jsx`) used by both pages, is hidden in embedded mode, and counts clicks anonymously per page (`docs/visitor-stats.md`).
