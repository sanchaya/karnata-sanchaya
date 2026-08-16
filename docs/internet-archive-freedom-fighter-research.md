# Internet Archive freedom-fighter research

## Finding

The ServantsOfKnowledge and JaiGyan collections can materially expand the Karnataka freedom-fighter corpus. A metadata pass on 15 August 2026 found 14 directly relevant Kannada-title records in ServantsOfKnowledge and 22 in JaiGyan. The collections overlap: the same Internet Archive identifier may belong to both, so identifiers—not collection names—must be used for deduplication.

The strongest first-wave items are:

| Internet Archive item | Research value | Review locator |
| --- | --- | --- |
| [Freedom Fighters of Haveri District](https://archive.org/details/kuh.805.bas.134991) | Biographical chapter, women, interviews, and a district list | Printed pp. 142–270 and appendix pp. 332–346 |
| [Role of Mandya District in the Freedom and Unification Movements](https://archive.org/details/kuh.818.kut.135112) | Shivapura, Quit India, Mysore Chalo, ordinary participants, activist appendix | Printed pp. 57–245 and appendix |
| [Freedom Movement and Kundaranadu](https://archive.org/details/kuh.1024.yel.141350) | Belagavi-region fighters, satyagrahi appendix, maps and photographs | Fighters chapter pp. 152–211 |
| [Freedom Movement in Karnataka](https://archive.org/details/karanatakadallis0000unse) | Statewide chronology and participant cross-checking | Item-level page review required |
| [Freedom War of Amara Sullia](https://archive.org/details/amarasulliadaswa0000nsde) | Early resistance in the Kodagu–Dakshina Kannada region | Item-level page review required |
| [Gandhi and Karnataka](https://archive.org/details/gandhi.gandhimathukarna0000sidd) | Visits, correspondence, photographs, and memories from 44 contributors | Separate contemporary documents from memoir testimony |

## Initial gap signals

- The Haveri scan begins its principal biographies with **Paramanna Sannappa Hosamani** (ಪರಮಣ್ಣ ಸಣ್ಣಪ್ಪ ಹೊಸಮನಿ), printed p. 142, and its appendix exposes many names not found by exact Kannada-string comparison in the repository corpus.
- The Mandya scan supplies page-level evidence associating the existing **H. K. Veerannagowda** record with Mandya. That association is now captured as `needs-review` with a printed locator.
- The Mandya text also names A. G. Bandigowda, N. D. Shankar, T. Mariyappa, Malavalli Veerappa, Mahabala Rao and H. Honnayya. These are discovery leads, not yet person records: initials, spelling and identity must be checked on the page image and against the appendix.
- The Haveri appendix OCR exposes names such as Venkatesh Gururaj Chavati, Shantaram Bhimaji Avaghan, Channabasappa Savaligeppa Turamari and Chidambar Lingo Mulagund. OCR corruption is visible in the table, so publication before image review would be unsafe.

## Repeatable workflow

1. Query the Internet Archive Advanced Search API for both `collection:ServantsOfKnowledge` and `collection:JaiGyan`, using Kannada and English movement terms.
2. Deduplicate results by Internet Archive `identifier`.
3. Open `_djvu.txt` or `_hocr.html` only to locate candidate pages and spellings.
4. Confirm the name, printed page, role, event, date and place against the scan image.
5. Reconcile historical place names with the current 31-district browse model; record the association kind (`birthplace`, `activity`, `arrest`, `imprisonment`, and so on).
6. Search the existing people corpus using Kannada and English variants before creating a stable ID.
7. Add the source in Admin, then add or update the person and citation in MariaDB. Keep the record `needs-review` until a second reviewer checks it.
8. Publish only through the approved MariaDB-to-static release workflow. OCR research files never become browser-only atlas data.

## Priority order

1. Resolve the 75 existing people without district associations against the six items above.
2. Review the Haveri and Mandya appendix lists line by line.
3. Search specifically for Chamarajanagar, Chikkamagaluru and Kalaburagi/Gulbarga, the three current empty districts.
4. Expand to district gazetteers, jail and pension registers, Karnataka Gandhi Smaraka Nidhi publications, newspapers and Itihasa Darshana.

## Data-quality rule

Internet Archive OCR is a discovery index, not the citation itself. Kannada OCR commonly drops vowel signs, punctuation and table columns. Every promoted claim needs the printed page locator and a human page-image check; independent archival or government corroboration remains the target for `reviewed` status.
