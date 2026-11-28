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

## Next steps

- Link each writer to the matching person and work records already in the atlas (`atlasData.people`, `atlasData.works`) by id, and show their dynasty or era.
- Add places where they lived and worked (not only where they were born) from a printed biography.
- Read printed sources (Sahitya Akademi and Kannada Sahitya Parishat biographies) to confirm birthplaces and fill the works lists.
