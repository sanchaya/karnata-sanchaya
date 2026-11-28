# Kannada poets and writers (`#authors`)

A Research page (`src/AuthorsPage.jsx`, data `src/data/kannada-authors.js`, test `test/kannada-authors.test.js`) lists 39 Kannada writers, **11 women and 28 men**, from Pampa and the vachana poets to Banu Mushtaq. Each card has the writer's roles, years, **birthplace**, the **works** named on the cited pages, a map pin, and the sources. Women writers have a purple band and pin and a one-click "Women" filter; there is also a period filter (before or after 1800) and a search over names, works and places.

## Sources and honesty

- Birthplace, dates, gender and the map point come from **Wikidata** (the item id is on the record when known) and from the **English Wikipedia** pages named in each card's "Sources" box; those pages were opened. Works are those the pages name, not full bibliographies. Nothing here is from a printed book yet; everything is `needs-review`.
- `birth.precision` says how far to trust the pin: `place` (a town or village point), `district` (the centre of the district because only the district was given, or a point for the birthplace was not found: Akka Mahadevi, Kuvempu, Karanth, Bhyrappa, Lankesh, Devanur Mahadeva, Narasimhaswamy, Chittal) and `disputed` (writers disagree: Pampa, Ranna, Purandara Dasa). Every non-`place` record carries a written doubt in both languages.
- Dates before the modern period are traditional estimates. Allama Prabhu has no dates (sorted as twelfth century).
- Some writers were born outside today's Karnataka (Girish Karnad at Matheran, Sara Aboobacker at Kasaragod, Govinda Pai at Manjeshwar) and are shown where they were born.
- Kannada work titles are drafts of the usual titles; a few works have English titles only. **The Kannada needs a native proofread.**

## It is a start, not a canon

The list is what could be sourced so far. Women are fewer than men because fewer had a usable source found, not because fewer wrote. Not yet in: Helavanakatte Giriyamma (an early woman writer; no birthplace found), Anupama Niranjana (birthplace unclear in the data), Nuggehalli Pankaja, Aryamba Pattabhi, Prathibha Nandakumar, Janna, Harihara, Raghavanka, Kumaravyasa, Sarvajna, Siddalingaiah, Beechi and many more. Add one by appending a record to `kannadaAuthors` with evidence from a page that was opened; `npm test` checks that each record has a birthplace, works, sources, both languages, a point inside the expected area, and a note when the place is uncertain.

## Links to the atlas's people and works

Nine writers are tied to the atlas's own records by id (`personId`, and `workId` on each work that is the same work): Pampa, Ranna, Basavanna, Allama Prabhu, Akka Mahadevi, Kanaka Dasa, D. V. Gundappa, D. R. Bendre and K. Shivaram Karanth, with nine works (Adipurana, Vikramarjuna Vijaya, Gadayuddha, Ajitapurana, and the vachana, Mohana Tarangini and Mankuthimmana Kagga records). The links work in every direction, and `test/kannada-authors.test.js` checks that each id exists and that the two records look like the same person or work:

- **Writer card:** "Open the person record" (`?person=<id>#people`) and each linked work title (`?work=<id>#literature`). The Literature page now opens the work when it gets `?work=`.
- **People profile:** a link back to the writer's card (`?writer=<id>#authors`), and a **gender** from Wikidata for these people (curated people had none). It is labelled "Per Wikidata; not reviewed" and also turns the Kannada role word into ಲೇಖಕಿ for women.
- **Literature work panel:** "Birthplace and other works →" under the creator.
- **Date mismatches are shown on the card.** The atlas dates Basavanna from 1105, Wikipedia and Wikidata say 1131; the card says so and asks for a check. Allama Prabhu has no dates on this page, so none is compared.
- **Other poets already in the atlas people list** (Ponna, Chavundaraya, Harihara, Keshiraja, Lakshmisha, Kumaravyasa, Kumara Valmiki, Durgasimha, Shivakotiacharya and others, 16 in all) are listed under the cards with links to their person records, until their birthplaces are sourced.
- Query parameters `writer` and `work` belong to the Authors and Literature pages and are cleared when the reader leaves (`PAGE_PARAMS` in `src/App.jsx`).

## Sahitya Akademi awards tab

The Authors page has a second tab, **Sahitya Akademi awards** (`src/SahityaAwards.jsx`, data `src/data/sahitya-akademi-kannada.js`, test `test/sahitya-akademi.test.js`): the 133 Kannada awards from 1955 to 2025 in a table that can be filtered by award (main award 69, translation 31, Bhasha Samman 8, Bala Sahitya Puraskar 13, Yuva Puraskar 12), by decade and by name or work. A winner who has a writer card links to it, and that card carries a "Sahitya Akademi" line with the year and work (19 writers).

- **Source:** a CSV supplied by the owner, kept at `src/data/imports/sahitya-akademi-kannada.csv`; `node scripts/import-sahitya-akademi.mjs` turns it into `src/data/sahitya-akademi-kannada.generated.js` (never edit that by hand). Replace the CSV and rerun to update.
- **Festival column:** the file records whether each winner was matched, by name, to the speaker lists of five literature festivals (BLF, BPF, KLF, Book Brahma, Mysuru), with a confidence (certain or probable) and flags for before the award, after it, and the award year or the next. It is the file's own analysis, shown as such, and 23 winners carry a match. The codes are shown exactly as in the file; they are not expanded because the file does not say what they stand for.
- **Links to writers are made by hand** (`AUTHOR_OF` in the data file) only where the person is clearly the same one; the test checks that each link names a real card. Winners without a card (most of the 133) show no link yet.
- **Not in the data:** the file has no gender, birthplace or ids, so none is added here. Spelling varies in the file (Kirthinath and Kirtinath Kurtakoti are one person) and is kept as given.
- **Owner to confirm:** where the list was compiled from, that the festival analysis may be published, and what the festival codes stand for (see `LICENSING.md` 3.15).

## Next steps

- Add the other atlas poets above to the writer list once a birthplace is sourced, and link them the same way (add them to `LINKS` in `src/data/kannada-authors.js`).
- Link the remaining works the page names (Kanaka Dasa's other works, Kuvempu, Karanth's novels and others) to atlas work records, or add atlas work records for them.
- Add places where they lived and worked (not only where they were born) from a printed biography.
- Read printed sources (Sahitya Akademi and Kannada Sahitya Parishat biographies) to confirm birthplaces and fill the works lists.
