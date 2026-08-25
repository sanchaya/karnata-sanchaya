# Karnataka Historical Atlas — milestone status and roadmap

Updated: 2026-08-25

This is the durable project summary for the decisions and implementation work accumulated across the atlas build. It separates working software from research that still needs human evidence. A record being visible on a map or timeline does not mean that it is authority-confirmed.

## Current product shape

The portal is Kannada-first with English support and has two intentionally separate surfaces:

- **Public static atlas:** read-only Vite/GitHub Pages build with maps, timeline, relations, literature, epigraphy, heritage and district research views.
- **Live research service:** authenticated accounts, MariaDB dataset revisions, moderation, reviewer workflow and controlled static-release handoff.

The district-history explorer milestone is included in the current committed snapshot. The current release candidate also includes bounded map focus, permanent admin-save safeguards and cross-page contract tests.

The current committed snapshot also includes the P2/P3 evidence maturity slice: public coin, script and network exploration, reviewer notes and status history, a reviewer operations panel, a ready-for-promotion queue, regenerated open dataset packets and faster admin save checks for the larger corpus.

## Milestone assessment

| Milestone | Status | What exists | What remains |
| --- | --- | --- | --- |
| Atlas v0.2 — normalized data model, bilingual fields, stable IDs, date/geographic precision, citations and validation | **Achieved** | Linked collections, global IDs, bilingual records, validation script and schema documentation | Continue filling evidence; the schema is not the research itself |
| Atlas v0.3 — Kannada-first branding and static-first publishing | **Achieved** | Sanchaya styling, Kannada default, English switch, GitHub Pages build path | Keep release metadata and accessibility regression-tested |
| Atlas v0.4 — global relations explorer | **Achieved / partial data** | Eight-corridor relations matrix, map routes, territorial/contact distinction, historical map theme | Add primary-source records for China, north/south, western and Southeast Asian gaps |
| Atlas v0.5 — territorial reach and external connections | **Achieved / partial data** | India/world scopes, schematic extents, campaign reach and relation categories | Replace low-confidence prototypes with source-backed snapshots |
| Atlas v0.6 — reign snapshots and comparisons | **Achieved** | Badami Chalukya, Rashtrakuta, Hoysala, Vijayanagara and Mysore comparison presets | Expand accession, victory, invasion and capital-relocation evidence |
| Atlas v0.9 — art, culture, religion, celebrations, monuments and games/sports | **Achieved / partial data** | Cultural collection, monument categories, living traditions and games/sports layer | Add district-level records and citations systematically |
| Atlas v0.12 — district heritage audit | **Statewide inventory and connections delivered; verification incomplete** | 31 district audit coverage, map boundaries, public UNESCO/national/state/local/research filters, register IDs, 1,531 inventory leads and contextual history links across every district | Resolve authority, coordinates, licences, condition and managing authority before promotion |
| Atlas v0.15 — Literature and Epigraphy Explorer | **Software achieved; review incomplete** | Literature/epigraphy pages, maps, timeline links, Bengaluru exception and review-gated candidates | Complete the 24 literary packets and Sannati/Maski transcription and Kannada review |
| Atlas v0.19 — Evidence and Publication Readiness | **Workflow achieved; human work pending** | 19-candidate evidence queue, 144 evidence requests, translation-review gates, reviewer separation and publication checks | Complete independent reviews, exact corpus locators, field photographs and condition evidence |
| Atlas v0.20 — community staging and permanent administration | **Software achieved; live operations prepared** | MariaDB revisions, admin dashboard, progress stats, accounts, profiles, reviewer/contributor foundations, static export boundary, repeatable backup and approved-only static release scripts | Run the backup/restore drill on production MariaDB, appoint reviewers, test approvals and publish approved snapshots |
| Atlas v0.21 — India political-relations pass | **Schema and first matrix pass delivered; research incomplete** | First-class bilateral relation records with parties, relation type, dates, routes, battle locations, outcomes, people, treaty-document placeholders, citations and explicit needs-review status; Deccan–Tamil–Kakatiya–Bahmani, northern/eastern, Maratha, Nizam, British, French and Portuguese seed coverage is connected to `#relations` and admin | Resolve campaign-level sources, exact battle geography, treaty witnesses, commanders and outcomes; expand the remaining north/east/south and colonial relations |
| Atlas v0.22 — early Karnataka and regional-polity research wave | **Structured first pass delivered; human review open** | Pre-Kadamba archaeological and Mauryan epigraphic narrative; Alupa polity/inscription packet; Keladi–Ikkeri and Chitradurga governance modules; seven Kadamba/Ganga/Kalyani Chalukya reigns; citations for all previously uncited major rulers; four source-backed schematic territorial records; candidate packets for all 22 previously empty districts; five literary edition/manuscript witnesses | Resolve primary edition locators, individual reign dates, coastal inscriptions, district authority evidence and exact territorial reconstruction before promoting records |
| Atlas v0.23 — evidence promotion sprint | **Focused workflow delivered; human evidence open** | Seven-record promotion dashboard derived from the normalized evidence packets; seven-gate readiness, blockers and direct filtering into the permanent assignment board | Complete independent Kannada reviews, signed/authority coordinates, present-condition surveys and licensed photographs; promote only after every gate is independently verified |
| Atlas v0.25 — People, Culture and Public Life | **Discovery corpus and review workflow delivered; curation open** | 905 code-split Wikimedia candidates with stable IDs, bilingual labels where available, role/birthplace/date discovery fields, explicit evidence gates, searchable People Explorer, lazy directory, candidate map focus, prefilled community contribution handoff and permanent MariaDB baseline merge | Verify Kannada/Karnataka relevance and authority biographies; expand ministers through position-held sources and theatre through academy/archive records; promote balanced district-, gender- and era-based cohorts into curated people |
| Atlas v0.26 — Patrika Sanchaya periodicals layer | **Catalogue imported; item-level archival review open** | 3,715 Patrika Sanchaya newspaper/magazine rows, row-level source locators, 76 grouped publication-place map anchors, Admin `periodicals` collection, refresh script and Patrike Sanchaya/ServantsOfKnowledge attribution | Match titles and runs to scans, library/press catalogues and archive holdings; replace publication-place anchors with exact offices or digitised-item locations where evidence exists |
| Atlas v0.27 — statewide freedom-fighter district research | **First measured pass delivered; research open** | Reproducible 31-district audit, 255 candidates, 180 district-linked people, 28 represented districts, a public “District needed” queue for 75 unassigned names, Doddaballapur district correction, Ministry of Culture records for Raichur, Yadgir and Mandya, and a first ServantsOfKnowledge/JaiGyan OCR discovery pass | Fill Chamarajanagar, Chikkamagaluru and Kalaburagi; resolve 75 people without district links; review Haveri, Mandya and Kundaranadu appendix names; strengthen thin districts; independently review every person–district claim |
| Atlas v0.28 — P1/P2 model foundations and corpus maturity | **Schema, seed packets and public explorers delivered; review open** | Mature collections for genealogy assertions, coin records, manuscript witnesses, boundary evidence, inscription editions and script evolution; public coin and script explorers; genealogy/feudatory network panel; Hoysala/Mysore extension packets; open dataset packets; reviewer dashboard and ready-for-promotion queue | Replace leads with catalogue specimens, source locators, image/licence evidence, exact generations, administrative geography and independent reviews before promotion |
| Freedom Movement Explorer / `#freedom` | **Public explorer delivered; evidence review open** | All 626 freedom-fighter research records on a bilingual map and chronological timeline with district/action/review filters, shareable selections and contribution handoff; source-provenance tiers with an **authority-cited** badge (296 of 626 people carry at least one government/epigraphic/UNESCO citation) surfaced across the Freedom, People and Resources pages | Replace provisional district/city-centre markers with authority-confirmed event locations; verify printed pages, identities, event sequences and Kannada names; expand beyond martyr records into protests, organisations, newspapers and constitutional milestones |
| District Deep History / `#district-history` | **All districts seeded; research ongoing** | 31 district scope slots, 33 needs-review leads covering every district, map/filter/detail view, admin collection and validation | Replace intake leads with site-level prehistoric, settlement, foundation-stone and locality records |

## Current data coverage snapshot

The bundled snapshot currently contains approximately:

- 9 Karnataka polities, 53 external polities with 53 map-ready capital/context-centre links, 106 events, 463 curated people, a 905-record lazy Wikimedia people-review candidate corpus and 28 bilateral political relations;
- 33 inscriptions, 25 literary works, 63 cultural records and 24 reign/period records;
- 325 sources, 1,639 generated relationships, 139 places and 13 collaboration records;
- 3,715 Patrika Sanchaya periodicals and 76 grouped publication-place anchors, all visibly `needs-review`;
- 23 genealogy assertions (Hoysala, Wadiyar and Western Ganga long bridges now split into individual-generation links), 10 coin records, 12 manuscript witnesses, 9 boundary-evidence packets, 25 inscription-edition packets and 12 script-evolution records, all review-gated;
- 12 local Epigraphia Carnatica Archive TXT records indexed as OCR discovery citations, with page-image review still required;
- 33 Itihasa Darshana/Karnataka Parampare research volumes linked to 65 atlas review-lead groups across inscriptions, scripts, literature, manuscripts, freedom-movement, outside-Karnataka rule, ports, coinage and heritage source review; Karnataka Parampare leads now include OCR/page locator hints, with article/page review still required;
- First source-volume extraction sprint adds review-gated records for Barkur, Ankola, Honnavar and Bhatkal port leads; Achyuta Devaraya and Chamarasa leads; Barkur/Badami inscription leads; Barkur, Badami, west-coast ports and Goa-transition events; and a Krishnadevaraya/Achyuta Devaraya coin-plate packet;
- Second source-volume extraction sprint registers all 12 offline Epigraphia Carnatica folder names as Internet Archive identifiers and adds Parampare image/caption leads for Achyutaraya-period Hampi, Daria Daulat Bagh, Srirangapatna Gumbaz, Chitradurga Fort and Mysuru Palace;
- Third source-volume extraction sprint adds Karnataka Parampare Volume 1 article leads for Rashtrakuta political history, Goa Kadambas and Devagiri Yadavas, plus a Western Ganga gold-coin image-plate packet;
- Fourth maturity sprint completes the first full paleographic classification: Ashokan/Satavahana Brahmi root evidence, Kadamba/Proto-Kannada, Badami Chalukya, Rashtrakuta, Kalyani Chalukya-Hoysala, Vijayanagara-Nayaka/Telugu-Kannada divergence and Mysore/modern print Kannada, with all records still review-gated;
- Fifth source-volume extraction sprint converts Parampare Volume 1 Halmidi/Talagunda plate leads and Parampare Volume 2 Vijayanagara/Karnata comparison leads into map/timeline-visible records, and adds Itihasa Darshana literature-heavy manuscript witness review packets for Pampa, Kumaravyasa and Torave streams;
- 32 heritage audit records and 32 inscription-audit records, with review gates still open;
- 1,531 heritage inventory leads with explicit protection/register levels. Twenty-five newly covered Mysuru buildings remain unverified discovery leads rather than claimed protected monuments;
- 65 district deep-history records: 31 district scopes plus 34 research leads. The 22 districts that previously had no candidate now each have one explicit intake packet; Maski and Brahmagiri add source-backed Ashokan-script district packets, and all remain `needs-review` until site-level authority evidence is collected.

The literature collection contains 25 linked works, but the 24-packet review pass is not complete. Twelve manuscript, print or digital-edition witness leads now cover priority literary streams; their remaining attribution, dating, bilingual interpretation and independent-review gates stay open. The relationship graph has 1,639 records, including clearly labeled district/heritage context links. Xuanzang, Barus and Polonnaruwa strengthen the China, Southeast Asia and Sri Lanka corridors; Malaysia and Singapore remain explicitly unresolved research leads pending item-level Karnataka evidence.

The freedom-fighter corpus now has a reproducible statewide audit. It contains 255 candidates; 180 (70.6%) have at least one explicit current-district association, and 28 of 31 districts are represented. Chamarajanagar, Chikkamagaluru and Kalaburagi remain explicit empty research queues rather than being populated with unsupported names. The first Internet Archive pass identified six high-value books and theses and attached printed-page Mandya evidence to H. K. Veerannagowda; see [`docs/internet-archive-freedom-fighter-research.md`](internet-archive-freedom-fighter-research.md). Rerun `npm run audit:freedom-fighters` after each research/import pass.

Most historical entities remain `needs-review` by design. The reviewed counts in the admin dashboard measure workflow state, not completeness of Karnataka history.

## Immediate priority order

### P0 — stabilize and publish the current milestone

1. **Complete in code:** district-history route, layout, data collection, validation, bounded map focus and permanent admin-save safeguards are committed.
2. **Complete locally:** `npm run check` passes (zero validation errors/warnings, all tests passing, production build successful).
3. **Repository action remaining:** enable GitHub Pages → **GitHub Actions** in repository settings; the workflow is present and the build passes, but deployment depends on that repository setting.
4. **Operator verification remaining:** hard-refresh `#atlas`, `#district-history`, `#districts`, `#inscriptions`, `#literature` and `#epigraphy` on desktop and mobile. The release-readiness tests now protect the route aliases and accessibility wiring in CI.

### P1 — finish the evidence work already promised

1. Use the v0.23 promotion dashboard to resolve Sannati’s independent Kannada translation review and authority/signed-survey coordinate.
2. Resolve Maski’s independent Kannada review, authority/signed-survey coordinate and dated whole-site condition evidence. Its transcription is already verified.
3. Complete the five item-level candidates already closest to promotion; promote only records with exact coordinates, item-level edition, protection status, managing authority, present condition and dated licensed photographs.
4. Continue the remaining 19 inscription candidates through the human evidence queue rather than treating metadata or OCR as final evidence.
5. Complete the first district heritage batch: Kolar, Tumakuru, Chikkamagaluru, Ballari, Raichur, Dharwad, Haveri and Davanagere.

### P2 — expand the research graph

1. Complete the P2/P3 maturity queues in [`docs/p2-p3-corpus-maturity.md`](p2-p3-corpus-maturity.md): coin catalogue specimens, genealogy proof packets, boundary evidence, inscription editions and manuscript/Sanchaya witnesses.
2. Turn the 31 district-history scope slots into source-backed candidate records, starting with prehistoric and early-settlement evidence, foundation stones and locality-name histories.
3. Complete the 24 literary review packets and add authors, poets, manuscripts, scholars and inscriptions as linked records.
4. Continue the Atlas v0.21 political-relations pass: resolve the first bilateral records, then fill the north/east/south/deccan and colonial gaps with primary or authority-level citations.
5. Add exact campaign routes, battle locations, treaty documents, commanders and outcomes; keep inferred or contested records visibly `needs-review`.
6. Connect rulers, people, wars, capitals, literature, inscriptions, monuments and external relations into one dated timeline without collapsing contact into territorial rule.

### P3 — operate the research community safely

1. Configure and test the live MariaDB deployment, run `scripts/backup-live.sh`, and complete a restore drill before inviting contributors.
2. Appoint qualified reviewers and test contributor registration, affiliation verification, Kannada translation review, karma and certificates.
3. Keep JSON import/export restricted to administrators and generate the public site only from an approved static snapshot.
4. Add citation pages and researcher-friendly CSL-JSON/BibTeX/RIS outputs only where the account and admin policy permits them. Use `scripts/publish-static.sh` for the approved-only export, validation and build handoff.

### P4 — release quality

- Current regression coverage includes permanent admin saves across every collection, timeline/map safety checks for local events with incomplete route evidence, public route aliases and basic mobile/bilingual navigation accessibility wiring.
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
- P2/P3 corpus maturity workflow: [`docs/p2-p3-corpus-maturity.md`](p2-p3-corpus-maturity.md)
- P1 human evidence queue: [`docs/p1-evidence-queue.md`](p1-evidence-queue.md)
- v0.23 promotion sprint: [`docs/v023-evidence-promotion.md`](v023-evidence-promotion.md)
- Eight-district heritage batch: [`docs/p1-district-batch.md`](p1-district-batch.md)
- P3 community operations and release handoff: [`docs/community-operations.md`](community-operations.md)
- Community governance: [`docs/community-governance.md`](community-governance.md)
- Live deployment: [`docs/live-deployment.md`](live-deployment.md)
- Linux/Nginx deployment: [`docs/linux-nginx-install.md`](linux-nginx-install.md)
- Wiki discovery queue: [`docs/wiki-discovery-and-community-queue.md`](wiki-discovery-and-community-queue.md)
- Overseas connections audit: [`docs/overseas-connections-audit.md`](overseas-connections-audit.md)
- India political-relations review queue: [`docs/political-relations-review-queue.md`](political-relations-review-queue.md)
