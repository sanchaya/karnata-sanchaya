# Karnataka Historical Atlas — milestone status and roadmap

Updated: 2026-07-28

This is the durable project summary for the decisions and implementation work accumulated across the atlas build. It separates working software from research that still needs human evidence. A record being visible on a map or timeline does not mean that it is authority-confirmed.

## Current product shape

The portal is Kannada-first with English support and has two intentionally separate surfaces:

- **Public static atlas:** read-only Vite/GitHub Pages build with maps, timeline, relations, literature, epigraphy, heritage and district research views.
- **Live research service:** authenticated accounts, MariaDB dataset revisions, moderation, reviewer workflow and controlled static-release handoff.

The district-history explorer milestone is included in the current committed snapshot.

## Milestone assessment

| Milestone | Status | What exists | What remains |
| --- | --- | --- | --- |
| Atlas v0.2 — normalized data model, bilingual fields, stable IDs, date/geographic precision, citations and validation | **Achieved** | Linked collections, global IDs, bilingual records, validation script and schema documentation | Continue filling evidence; the schema is not the research itself |
| Atlas v0.3 — Kannada-first branding and static-first publishing | **Achieved** | Sanchaya styling, Kannada default, English switch, GitHub Pages build path | Keep release metadata and accessibility regression-tested |
| Atlas v0.4 — global relations explorer | **Achieved / partial data** | Eight-corridor relations matrix, map routes, territorial/contact distinction, historical map theme | Add primary-source records for China, north/south, western and Southeast Asian gaps |
| Atlas v0.5 — territorial reach and external connections | **Achieved / partial data** | India/world scopes, schematic extents, campaign reach and relation categories | Replace low-confidence prototypes with source-backed snapshots |
| Atlas v0.6 — reign snapshots and comparisons | **Achieved** | Badami Chalukya, Rashtrakuta, Hoysala, Vijayanagara and Mysore comparison presets | Expand accession, victory, invasion and capital-relocation evidence |
| Atlas v0.9 — art, culture, religion, celebrations, monuments and games/sports | **Achieved / partial data** | Cultural collection, monument categories, living traditions and games/sports layer | Add district-level records and citations systematically |
| Atlas v0.12 — district heritage audit | **Seeded, not complete** | 31 district audit coverage, map boundaries, authority labels and UNESCO/ASI/state/research filters | Resolve authority, coordinates, licences, condition and managing authority before promotion |
| Atlas v0.15 — Literature and Epigraphy Explorer | **Software achieved; review incomplete** | Literature/epigraphy pages, maps, timeline links, Bengaluru exception and review-gated candidates | Complete the 24 literary packets and Sannati/Maski transcription and Kannada review |
| Atlas v0.19 — Evidence and Publication Readiness | **Workflow achieved; human work pending** | 19-candidate evidence queue, 144 evidence requests, translation-review gates, reviewer separation and publication checks | Complete independent reviews, exact corpus locators, field photographs and condition evidence |
| Atlas v0.20 — community staging and permanent administration | **Software achieved; live operations pending** | MariaDB revisions, admin dashboard, progress stats, accounts, profiles, reviewer/contributor foundations and static export boundary | Configure production MariaDB, appoint reviewers, test approvals and publish approved snapshots |
| District Deep History / `#district-history` | **Initial expansion delivered, research ongoing** | 31 district scope slots, 11 needs-review leads across Bengaluru and the first priority districts, map/filter/detail view, admin collection and validation | Replace intake leads with site-level prehistoric, settlement, foundation-stone and locality records |

## Current data coverage snapshot

The bundled snapshot currently contains approximately:

- 8 Karnataka polities, 27 external polities, 55 events and 75 people;
- 18 inscriptions, 25 literary works, 43 cultural records and 17 reign/period records;
- 149 sources, 512 relationships and 12 collaboration records;
- 32 heritage audit records and 32 inscription-audit records, with review gates still open;
- 36 district deep-history records: 31 district scopes plus 5 research leads.

Most historical entities remain `needs-review` by design. The reviewed counts in the admin dashboard measure workflow state, not completeness of Karnataka history.

## Immediate priority order

### P0 — stabilize and publish the current milestone

1. Commit the district-history route, layout fix, data collection, validation and documentation.
2. Run `npm run check` and retain the resulting static snapshot as the next release candidate.
3. Enable GitHub Pages → **GitHub Actions** in repository settings; the code build passes, but the Pages workflow cannot deploy until the repository Pages site is enabled.
4. Verify `#atlas`, `#district-history`, `#districts`, `#inscriptions`, `#literature` and `#epigraphy` after a hard refresh on desktop and mobile.

### P1 — finish the evidence work already promised

1. Resolve Sannati’s independent Kannada translation review.
2. Resolve Maski transcription, translation and present-condition evidence.
3. Complete the five item-level candidates already closest to promotion; promote only records with exact coordinates, item-level edition, protection status, managing authority, present condition and dated licensed photographs.
4. Continue the remaining 19 inscription candidates through the human evidence queue rather than treating metadata or OCR as final evidence.
5. Complete the first district heritage batch: Kolar, Tumakuru, Chikkamagaluru, Ballari, Raichur, Dharwad, Haveri and Davanagere.

### P2 — expand the research graph

1. Turn the 31 district-history scope slots into source-backed candidate records, starting with prehistoric and early-settlement evidence, foundation stones and locality-name histories.
2. Complete the 24 literary review packets and add authors, poets, manuscripts, scholars and inscriptions as linked records.
3. Fill the relations matrix: China and northeast knowledge routes first, then north/south/east/west, western Indian Ocean and Southeast Asia, followed by Portugal, Britain and France.
4. Connect rulers, people, wars, capitals, literature, inscriptions, monuments and external relations into one dated timeline without collapsing contact into territorial rule.

### P3 — operate the research community safely

1. Configure and test the live MariaDB deployment, backups and revision conflict handling.
2. Appoint qualified reviewers and test contributor registration, affiliation verification, Kannada translation review, karma and certificates.
3. Keep JSON import/export restricted to administrators and generate the public site only from an approved static snapshot.
4. Add citation pages and researcher-friendly CSL-JSON/BibTeX/RIS outputs only where the account and admin policy permits them.

### P4 — release quality

- Run keyboard, screen-reader, contrast and mobile checks on every page.
- Reduce large JavaScript chunks and keep Bengaluru KML loading lazy.
- Add regression tests for route aliases, map selection, timeline filtering, bilingual labels and static export privacy.
- Maintain a source register distinguishing primary/authority sources, secondary scholarship and discovery leads.

## Evidence policy

The supplied Bengaluru infographic and portals such as BharatRajya can be used to discover questions, but they are not authority citations. Final records should cite the underlying primary or institutional source (for example ASI registers, UNESCO records, Epigraphia Indica, Epigraphia Carnatica, gazetteers, archival editions or reviewed field documentation). Every provisional record must remain visibly `needs-review` until its evidence gates are complete.

## Working procedure for every new record

1. Create a stable ID and bilingual name.
2. Record the narrowest defensible date and geographic precision.
3. Attach the source and an item/page/record locator.
4. Mark the evidence and review status explicitly.
5. Add map/timeline links only when the coordinate and date semantics are clear.
6. Have an independent reviewer approve the Kannada/English interpretation and evidence before promotion.
7. Save the permanent MariaDB revision, run validation, then deliberately include it in the static release.

## Source of truth

- Data model and evidence contract: [`docs/data-model.md`](data-model.md)
- P1 human evidence queue: [`docs/p1-evidence-queue.md`](p1-evidence-queue.md)
- P3 community operations and release handoff: [`docs/community-operations.md`](community-operations.md)
- Community governance: [`docs/community-governance.md`](community-governance.md)
- Live deployment: [`docs/live-deployment.md`](live-deployment.md)
- Linux/Nginx deployment: [`docs/linux-nginx-install.md`](linux-nginx-install.md)
- Wiki discovery queue: [`docs/wiki-discovery-and-community-queue.md`](wiki-discovery-and-community-queue.md)
- Overseas connections audit: [`docs/overseas-connections-audit.md`](overseas-connections-audit.md)
