# Karnataka freedom fighters — district coverage audit

## Executive Summary

- **28 of 31 current Karnataka districts have at least one mapped freedom-fighter candidate.** The remaining districts are Chamarajanagar, Chikkamagaluru, Kalaburagi.
- **285 of 357 people (79.8%) have an explicit district association.** 72 records still need birthplace, activity, arrest, imprisonment, residence or memorial evidence.
- **No person record is independently reviewed yet.** Public records therefore remain visibly `needs-review`; a source-backed candidate count is not a completeness claim.
- **The audit is reproducible.** Run `npm run audit:freedom-fighters` after every import or MariaDB/static release update.

## District coverage

| District | Candidates | Reviewed | Sources | Status |
| --- | ---: | ---: | ---: | --- |
| Bagalkote / ಬಾಗಲಕೋಟೆ | 3 | 0 | 3 | seeded |
| Ballari / ಬಳ್ಳಾರಿ | 2 | 0 | 3 | thin |
| Belagavi / ಬೆಳಗಾವಿ | 19 | 0 | 9 | seeded |
| Bengaluru Rural / ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ | 1 | 0 | 1 | thin |
| Bengaluru Urban / ಬೆಂಗಳೂರು ನಗರ | 121 | 0 | 17 | seeded |
| Bidar / ಬೀದರ್ | 1 | 0 | 1 | thin |
| Chamarajanagar / ಚಾಮರಾಜನಗರ | 0 | 0 | 0 | empty |
| Chikkaballapur / ಚಿಕ್ಕಬಳ್ಳಾಪುರ | 2 | 0 | 4 | thin |
| Chikkamagaluru / ಚಿಕ್ಕಮಗಳೂರು | 0 | 0 | 0 | empty |
| Chitradurga / ಚಿತ್ರದುರ್ಗ | 16 | 0 | 2 | seeded |
| Dakshina Kannada / ದಕ್ಷಿಣ ಕನ್ನಡ | 18 | 0 | 10 | seeded |
| Davanagere / ದಾವಣಗೆರೆ | 1 | 0 | 1 | thin |
| Dharwad / ಧಾರವಾಡ | 15 | 0 | 9 | seeded |
| Gadag / ಗದಗ | 2 | 0 | 2 | thin |
| Hassan / ಹಾಸನ | 2 | 0 | 2 | thin |
| Haveri / ಹಾವೇರಿ | 4 | 0 | 7 | seeded |
| Kalaburagi / ಕಲಬುರಗಿ | 0 | 0 | 0 | empty |
| Kodagu / ಕೊಡಗು | 5 | 0 | 3 | seeded |
| Kolar / ಕೋಲಾರ | 3 | 0 | 4 | seeded |
| Koppal / ಕೊಪ್ಪಳ | 1 | 0 | 1 | thin |
| Mandya / ಮಂಡ್ಯ | 3 | 0 | 4 | seeded |
| Mysuru / ಮೈಸೂರು | 7 | 0 | 4 | seeded |
| Raichur / ರಾಯಚೂರು | 1 | 0 | 1 | thin |
| Ramanagara / ರಾಮನಗರ | 2 | 0 | 3 | thin |
| Shivamogga / ಶಿವಮೊಗ್ಗ | 3 | 0 | 4 | seeded |
| Tumakuru / ತುಮಕೂರು | 47 | 0 | 1 | seeded |
| Udupi / ಉಡುಪಿ | 3 | 0 | 3 | seeded |
| Uttara Kannada / ಉತ್ತರ ಕನ್ನಡ | 16 | 0 | 11 | seeded |
| Vijayanagara / ವಿಜಯನಗರ | 1 | 0 | 2 | thin |
| Vijayapura / ವಿಜಯಪುರ | 6 | 0 | 4 | seeded |
| Yadgir / ಯಾದಗಿರಿ | 1 | 0 | 1 | thin |

## Recommended next research waves

1. Resolve the empty districts first: Chamarajanagar, Chikkamagaluru, Kalaburagi.
2. Strengthen thin districts (one or two candidates): Ballari, Bengaluru Rural, Bidar, Chikkaballapur, Davanagere, Gadag, Hassan, Koppal, Raichur, Ramanagara, Vijayanagara, Yadgir.
3. Reconcile the 72 existing people without a district association against district gazetteers, prison registers, pension/Tamra Patra files, court records and contemporary newspapers.
4. Independently review each Kannada name, person identity, association kind, date and item-level locator before promotion.

## First-wave authority evidence

- [D. Pampanna Neravi — Raichur](https://cmsadmin.amritmahotsav.nic.in/district-reopsitory-detail.htm?6697=), Ministry of Culture Digital District Repository.
- [Raja Venkatappa Nayaka — Yadgir](https://amritmahotsav.nic.in/district-reopsitory-detail.htm?6690=), Ministry of Culture Digital District Repository.
- [Shivapura Satyagraha — Mandya](https://amritmahotsav.nic.in/district-reopsitory-detail.htm?1921=), Ministry of Culture Digital District Repository.
- [H. B. Lakshmegowda — Mandya imprisonment evidence](https://cmsadmin.amritmahotsav.nic.in/district-reopsitory-detail.htm?22965=), Ministry of Culture Digital District Repository.

These official pages establish a credible intake basis; they do not replace independent checking of names, dates, archival locators and Kannada descriptions.

### Bengaluru Dictionary of Martyrs pass

The full OCR text of *Dictionary of Martyrs: India’s Freedom Struggle, Volume 5* (first edition 2018, ISBN 978-81-938176-1-2) was checked through the Internet Archive text derivative while retaining the Ministry of Culture/ICHR edition as the canonical source. Exact Bengaluru entries now provide printed-page locators for Abdul Razak, Annayyappa, Appayya, Chinnakannu, Dastagir Sab, Gundappa, Ponnaswami, Prahalladha Setty, Shrinivas, Subhasing Ramsing, Thimmanna Das, Thippaiah and Tippayya.

The pass intentionally preserves conflicts. In particular, the dictionary says Prahalladha Setty died in police firing on 16 August 1942, while reported H. S. Doreswamy testimony says he died after incarceration. Reviewers must resolve this using the memorial, prison register and the dictionary’s PMRA/PMLC references before promotion.

Administrators can open **Admin → Sources / ಆಕರಗಳು** to see the complete reference register, citation-use counts, pending/unlinked totals and every linked record locator. **Add reference / ಹೊಸ ಆಕರ** creates a source inside the current dataset; **Save MariaDB revision** makes it permanent. No research citation is stored only in the browser.

On the live server, `scripts/update-live.sh` runs `db:sync-dataset`. The synchronizer adds new repository records and now also merges missing evidence fields, citation locators, aliases and district-association citations into existing MariaDB records. It never replaces an existing reviewer-edited scalar value; the resulting changes are written as a new auditable dataset revision.

### Volume 5 statewide extraction

The complete Volume 5 OCR derivative was parsed entry-by-entry after removing repeating page headers. Searching both the modern state name and historical/current place forms produced a reproducible inventory of **269 Karnataka-linked names**: **249** entries provisionally classified as Karnataka origin/residence leads and **20** as Karnataka event-connection leads. Run:

```bash
npm run extract:martyrs-karnataka -- /path/to/Volume-5_djvu.txt src/data/dictionary-martyrs-karnataka.json
npm run validate:data
npm run db:sync-dataset
```

The generated `martyrCandidates` collection stores names, printed pages, OCR source lines, place-name leads and the archival abbreviations printed in the entry. It deliberately excludes the full dictionary prose. Every candidate remains `needs-review`; the parser does not infer Kannada spellings, merge identities, assign current districts or claim that a person is publication-ready. Reviewers can work through **Admin → Dictionary martyr candidates** and add new references under **Admin → Sources**. Saving creates a permanent MariaDB revision.

The 20 `karnataka-event-connection` records also retain provisional activity years and controlled action leads—imprisonment/detention, arrest/capture, death/martyrdom, movement/resistance or armed action. People Explorer highlights this group in a dedicated horizontal historical-connections strip and includes dated leads on its timeline. These ranges describe the cited historical connection, not the person’s lifespan, and remain visibly review-gated.

## Research rules

- Treat a person–district link as a separate claim. Use one of: `birthplace`, `home`, `activity`, `arrest`, `imprisonment`, `martyrdom`, `residence`, or `memorial` (combined values are allowed only when the source proves each part).
- Preserve historical place names in the citation locator, but map them to the current 31-district structure for browsing.
- Prefer official recognition files, jail/court records, government district repositories, Karnataka State Archives and district gazetteers. Academic histories can corroborate; news and Wikipedia remain discovery leads unless independently supported.
- Do not mark a district “complete” from a short list. Completion requires a documented search of government recognition rolls, district/taluk histories, archives, women’s participation, princely-state and Hyderabad-liberation records, and community nominations.

## Caveats and assumptions

Counts represent person–district associations, not unique biographies originating in each district. A person may legitimately appear in several districts. Current district boundaries differ from colonial and princely-state geographies. Source-level review status does not make every claim in a person record independently reviewed.
