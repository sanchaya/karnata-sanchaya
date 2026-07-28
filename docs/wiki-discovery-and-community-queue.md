# Wiki discovery and community review queue

## Purpose

Wikipedia pages are used as discovery indexes, not as final authority. A lead is captured in the atlas with a stable ID, bilingual label, source URL, date precision, and an explicit `needs-review` status. It becomes public historical data only after the evidence gates are independently completed.

## Current capture batch

- [Inscription stones of Bengaluru category](https://en.wikipedia.org/wiki/Category:Inscription_stones_of_Bengaluru): 26 pages in the category; the overview is retained as context and 25 locality pages are queued as item-discovery candidates.
- [Inscription stones of Bengaluru](https://en.wikipedia.org/wiki/Inscription_stones_of_Bengaluru): type, locality, language/script, preservation and publication leads are retained; its maintenance warning means claims require source-level checking.
- [Kannada inscriptions](https://en.wikipedia.org/wiki/Kannada_inscriptions): early-language, dynastic, Jain, copper-plate and outside-Karnataka leads are retained. The first batch adds Tagarthi, Gunabhushitana, Brahmagiri/Isila, Tamatakallu, Chikkamagaluru, Belmannu and Tumbula candidates.
- Research wave 2 adds eight cross-border candidates: Gooty, Tirupati, Kadimetla, Amma II's copper plates, Karhad, Beed, Melpadi and Krishnampalle. They are grouped under a synthetic “Outside-Karnataka / cross-border leads” audit so they are not misassigned to a Karnataka district.
- The Begur locality page now has three separate corpus-located packets for the Nagatara Somanatha construction record, Nagatara hero stone and Tondabbe Sanyasana record. Their article coordinates are provisional and their editions still need authority confirmation.
- [Western Ganga dynasty](https://en.wikipedia.org/wiki/Western_Ganga_dynasty) and [Sripurusha](https://en.wikipedia.org/wiki/Sripurusha): ruler succession, capital changes, conflicts, patronage and *Gajasastra* leads are linked to the atlas timeline and people records.

## Review sequence

1. **Discovery triage** — confirm that the page points to a distinct item, locality or historical claim; merge duplicates without deleting the original source trail.
2. **Corpus match** — identify the printed edition, volume, item number, page/plate and repository or scan.
3. **Location match** — record an authority or signed field coordinate, current district, findspot/current-location relationship and map precision.
4. **Text packet** — capture the line-by-line reading, damage/restoration notation, transliteration where useful, and the cited translation.
5. **Kannada review** — an independent reviewer checks names, dates, technical terms, line alignment and semantic fidelity in Kannada and English.
6. **Condition and authority** — attach a dated item/site observation, reusable photographs, protection-register result and managing authority.
7. **Promotion** — only a reviewer who is not the contributor can mark every gate verified and promote the record.

## Proposed partner roles

The collaboration records marked `upcoming` are proposals, not confirmed partnerships:

- Karnataka Archaeology, Museums and Heritage: protection-register, authority and monument-coordinate matching.
- Kannada University, Hampi and university epigraphy departments: supervised student corpus work and bilingual translation review.
- Inscription Stones of Bengaluru and local documentation networks: locality photographs, KML/map corrections, aliases and rediscovery reports.

Evidence assignments are stored in the live MariaDB service through the authenticated workflow. Approved research accounts can assign, schedule and advance tasks; public and unapproved visitors receive a read-only view. The service records the updating account and audit event, while the static GitHub Pages edition continues to show the published dataset without live write access.
