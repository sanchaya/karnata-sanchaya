# Atlas v0.2 data model

The normalized installation seed is defined in `src/data/atlas.js` and `server/seeds/`. On the live portal, the latest immutable `dataset_snapshots` revision in MariaDB is the authoritative instance of these linked collections. The application loads `/api/dataset` before page modules evaluate, so maps, timelines, search, statistics and Admin use the same revision. Repository JSON remains a seed and static-publication input; no research record is persisted in browser storage. Every record has a globally unique, stable, lowercase kebab-case ID.

`artifacts` records link a symbol, coin, inscription stone, sculpture, regalia or architectural fragment to a polity, place-context, bounded date, map point, citations and review state. Site-context points are discovery coordinates only; object-level catalogue and repository evidence is required before promotion.

| Collection | Purpose | Main links |
| --- | --- | --- |
| `polities` | Karnataka-rooted kingdoms and political entities | `capitalId` → place |
| `externalPolities` | External empires, alliances and constitutional successors | Event participants |
| `events` | Battles, campaigns, invasions, foundations and constitutional transitions | Participants, point/route, citations; review-only projections may retain `candidateIds` and `researchInput` |
| `people` | Rulers, authors, patrons and other people | `polityId` → polity; `districtAssociations` and `placeAssociations` retain separately cited geographic claims |
| `peopleCandidates` | Wikimedia and community discovery candidates awaiting biographical review | Wikidata ID, birthplace, roles, evidence gates, citations |
| `martyrCandidates` | Karnataka-linked names extracted from *Dictionary of Martyrs*, Volume 5, awaiting page-image and identity review | Stable volume/page/line ID, printed-page locator, relationship class, district text leads, archival reference, evidence gates |
| `places` | Named geographic locations | GeoJSON-style `location` |
| `inscriptions` | Epigraphic records or described clusters | `placeId`, `polityId` → `polities` or `externalPolities` |
| `works` | Literary and scholarly works | `polityId`, external links |
| `periodicals` | Patrika Sanchaya newspaper and magazine catalogue rows | source-row citation, publication place, publisher/editor, periodicity, language |
| `genealogicalRelations` | Review-gated family-tree assertions | `fromPersonId`, `toPersonId`, `polityId` |
| `boundaryEvidence` | Evidence packets behind territorial polygons and campaign-reach lines | `extentId`, `polityId` |
| `coinRecords` | Numismatic catalogue, image, metal, weight and findspot records | `polityId`, `placeId`, `findspot.placeId` |
| `manuscriptWitnesses` | Manuscript, print and digital-edition witnesses for literary works | `workId` |
| `inscriptionEditions` | Item-edition, transcription, translation and photograph review packets | `inscriptionId` |
| `sources` | Bibliographic evidence | Referenced by citations |
| `heritageAudits` | District heritage candidates and authority evidence | `prioritySites`, protection checks |
| `districtHistoryResearch` | District deep-history intake for prehistoric, settlement, foundation-stone and locality-history leads | `districtId`, `location`, `citations` |
| `relationships` | Explicit entity-to-entity assertions | `fromId`, `type`, `toId` |
| `politicalRelations` | Bilateral or coalition-level political relationships | `parties`, `relationKind`, `geography`, `eventIds`, `peopleIds`, `treatyDocuments`, `citations` |

## Research fields

- Bilingual strings use `{ "en": "…", "kn": "…" }`.
- Dates use `from`, `to`, `era`, and an explicit `precision`: `year`, `circa`, `range`, `century`, or `unknown`.
- Geometry follows GeoJSON coordinate order (`[longitude, latitude]`) and declares precision such as `approximate` or `schematic`.
- Citations point to stable source IDs and may include a page, inscription number, folio, URL fragment, or other locator.
- Review metadata records `status`, `reviewer`, and `updatedAt`. Status progresses through `draft`, `needs-review`, `reviewed`, and `published`.
- Every formal `inscriptions` record must carry a valid `polityId`. The linked polity is the record's historical attribution and must resolve to a bilingual kingdom or governing empire; the application exposes it in inscription details, district lists, search results, timeline cards and map popups. `npm run validate:data` fails when the link is missing or points to an unknown entity, and the page-data regression suite protects the same contract.
- People candidates remain `needs-review` and `publicationReady: false`. They use eight evidence gates and are promoted by creating or updating a curated `people` record after independent review; discovery status is never changed to simulate publication.
- Curated people may use `placeAssociations`, each containing a stable `placeId`, a controlled relationship description such as `birthplace`, `activity`, `arrest`, `imprisonment`, `martyrdom`, `resistance`, or `memorial`, and its own citations. A district association is not evidence for a village: district-centre markers remain provisional until a source names and locates the settlement.
- Relationships are records because an assertion can have its own date, citations, and review state.
- Political relations are deliberately separate from generated relationships. Each record names two or more parties, distinguishes war/invasion/campaign/trade/diplomacy/travel-and-knowledge/treaty/alliance/tribute/suzerainty/administrative or constitutional integration, carries a dated route and battle-location set, records an outcome, and links people, underlying events and documentary witnesses. Seed records remain `needs-review` until the relationship is independently resolved.
- Events carry bilingual narratives, participants with roles and outcomes, an approximate point, an optional schematic campaign route, consequences, citations, and review state.
- The 20 Dictionary of Martyrs `karnataka-event-connection` packets also generate review-only event projections for the main atlas. They preserve the complete extracted year/action/place input in `researchInput`, link back through `candidateIds`, use district/city-centre coordinates, and remain dashed `needs-review` records. Reviewers must verify the printed page, identity, exact locality and event sequence before replacing a projection with a promoted event.
- District deep-history records use `recordKind` (`district-scope` or `candidate`), an explicit category, bilingual description and research note, optional GeoJSON point precision, provenance citations and a `needs-review` gate. The public `#district-history` explorer renders all 31 district scope slots and marks indicative locality leads with amber dashed markers; it does not promote the contributor-supplied Bengaluru infographic to an authority source.

## Validation and publication

Run `npm run validate:data` before building. Validation checks collection structure, globally unique stable IDs, bilingual names, date order and precision, point coordinates, review states, citations, and entity references. Errors fail the command; missing Kannada labels are warnings.

The live administrator workspace stores complete, validated dataset revisions in MariaDB, with a revision number, content hash, actor and audit-log entry. It does not use browser local storage for edits. Imported JSON remains staged until an administrator explicitly saves it as a new server revision. Exported JSON is a review/handoff artifact, not automatically public data; the approved static release is still generated deliberately for GitHub Pages.

The live authenticated administrator service uses the same JSON contract for permanent full-dataset revisions. Concurrent saves use revision checks and return a conflict instead of silently overwriting another administrator's work. Keep the static repository dataset as the reviewed publication snapshot.

## MariaDB research indexes

Migration `007_research_feature_indexes.sql` prepares the live database for the next mature research features without changing the public static-site policy. `dataset_snapshots` remains the authoritative immutable record. During `npm run db:sync-dataset`, the server also refreshes derived indexes for:

- cross-collection records such as polities, people, places, inscriptions, works, artifacts, territorial extents, relationships and political relations;
- entity links such as capital, place, polity, participant, party, creator and relationship edges;
- evidence gates from inscription resolution packets, literary review workflows and promotion reviews.

These tables support future MariaDB-backed search, graph exploration, assignment queues and reviewer dashboards. They are derived from the latest reviewed dataset revision and can be rebuilt; they must not be treated as separate public data exports.

Atlas v0.27 adds the first mature P1 model foundations. Genealogy records explicitly separate derived succession-family assertions from final family-tree evidence. Coin records require catalogue, image, metal, weight and findspot gates. Manuscript witnesses carry repository, shelfmark, edition-comparison and licence gates. Boundary evidence records explain why a map polygon is still schematic. Inscription edition packets keep item edition, transcription, translation, photograph and authority-coordinate review separate.

Atlas v0.28 starts the P2 corpus expansion. The seed batch adds Kadamba and Western Ganga genealogy assertions, Vijayanagara and Badami Chalukya coinage leads, Adipurana/Gadayuddha/Vaddaradhane manuscript witness packets, Western Ganga and Rashtrakuta boundary evidence, and item-level edition packets for Alupa Udiyavara, Lobu Tua/Barus and Polonnaruwa Ayyavole inscriptions. These records improve exploration coverage but remain `needs-review` until item editions, images, translations, authority coordinates and catalogue specimens are independently verified.

Atlas v0.28.1 deepens the inscription review queue with provisional edition packets for Talagunda, Gudnapur, Kappe Arabhatta, Begur, Atakur, Tyagada Brahmadeva, Lakkundi, Belur, Hampi Krishna Temple, Chandravalli, Doddahundi and Takuapa. These packets intentionally capture the next editorial work to do: resolve the exact corpus locator, line transcription, translation witness, photograph/licence status and authority coordinate before promotion.

Atlas v0.28.2 adds the next P2/P3 maturity slice. Hoysala and Mysore genealogy bridge records make the network explorer traversable while explicitly labeling the claims as derived. Belur and Srirangapatna coinage leads add numismatic work packets without asserting catalogue-level maturity. Kumaravyasa Bharata and Torave Ramayana now have Sanchaya digital-witness leads. Hoysala Vishnuvardhana and Mysore Tipu Sultan boundary packets record why the map geometry remains schematic. Shravanabelagola and Muktesvara edition packets expand the inscription queue while retaining item-edition, transcription, translation, photograph and authority-coordinate gates. The public `#scripts` explorer exposes `scriptEvolution` as a review-gated timeline with sample inscriptions, predecessor links, polity context and evidence handoff.

## Literature and epigraphy explorer fields

Atlas v0.15.2 treats public records and district research candidates as different evidence states. A candidate is not rendered as a mapped inscription until its place, date and item-level edition have been reviewed.

The distinction is important for attribution: the 29 formal inscription records have kingdom links and may be shown as mapped records, subject to their individual review status. The 62 district `priorityCandidates` are research leads, not formal inscriptions; they remain needs-review and are not assigned a kingdom merely from a nearby place or a speculative dynasty. During evidence capture, reviewers should add the polity link only when the corpus, date, findspot or governing context supports it, then promote the lead into `inscriptions` through the normal validation and MariaDB revision workflow.

Every inscription candidate carries a `resolution` checklist with independent claims for `corpus`, `itemEdition`, `coordinates`, `transcription`, `translation`, `presentCondition`, `authority`, and `photographs`. Each claim is explicitly `verified`, `located`, `provisional`, `unresolved`, or `not-applicable` and resolved claims retain their source ID and locator. This prevents a reliable corpus reference from being mistaken for proof of a current site coordinate, condition, or managing authority.

Coordinates may include an `authorityMatch` explaining whether the number is authority-issued, boundary-matched, or only identity-matched to a named protected monument. Dated photographs retain creator, capture date, licence, source page and bilingual subject description. A geotagged photograph is evidence for the camera position, not automatically an official monument coordinate.

Captured transcriptions use labelled line arrays. Bilingual translations carry separate English and Kannada review states so a source-published English rendering and a new Kannada research draft cannot be presented as having the same editorial authority.

The five item-located promotion records (Hirehadagalli, Kodaganur, Punisaraja, Yusuf Adil Jami Mosque and Shahapur Fort) also carry a `promotionReview` packet. It records the complete seven-field publication gate and a separate Kannada approval state. These packets are deliberately `evidence-capture`, not `promoted`, until direct text capture, site evidence and independent translation review are complete.

Every literary work now carries a `reviewWorkflow` with six evidence gates: creator identity, work date, court context, bilingual description, item-level citation, and edition/manuscript witness. A `located` gate means usable evidence has been found; only an independent reviewer may change it to `verified`. All 24 current works therefore remain in the review queue and expose their unresolved gates without implying scholarly approval.

Atlas v0.19.2 turns those gates into 144 assignable `evidenceRequest` tasks. Every request declares its submission type, minimum fields and Kannada/English instruction. The packet also requires an independent reviewer, separates reviewer and contributor identities, and records source match, attribution, dating/context, bilingual fidelity, citation completeness and reviewer attestation before promotion.

The relations explorer derives an eight-corridor research matrix from reviewed and provisional event records: Deccan/central India, north-India land, southern peninsula, northwest/Persian Gulf, southwest/Indian Ocean, Southeast-Asia maritime, northeast/China knowledge, and Europe/global maritime. It crosses those corridors with trade, diplomacy, travel/knowledge, war, political transition and territorial rule. A zero is explicitly a research gap, not evidence that no connection existed; provisional records remain visually distinct and retain their review state in exports.

Atlas v0.21 adds a first bilateral political-relations pass to that matrix. The initial 15 records cover the Harsha frontier, Rashtrakuta–Pratihara–Pala Kannauj contest, Chola Gangavadi administration, Kakatiya and Delhi campaigns, Bahmani/Vijayanagara/Adil Shahi Deccan conflicts, Gajapati and Portuguese connections, Maratha and Hyderabad frontiers, British paramountcy, French diplomacy and Mysore’s constitutional integration. These are structured research queues, not claims that every route or outcome is settled.

The live MariaDB service stores collaboration proposals separately from the static `collaborations` catalogue. Approved contributors submit a bilingual scope and institutional contact; appointed reviewers can approve, request changes, or decline it. An approval remains a staging decision and does not automatically publish a collaboration to the GitHub Pages dataset.

Each unresolved inscription gate also emits a structured `evidenceRequest`. These specify the submission type, bilingual field instruction and minimum required fields for authority coordinates, corpus editions, line transcription, independent Kannada review, dated condition surveys, protection-register matches and reusable photo sets. The Evidence Workflow exposes the complete 19-candidate worklist as a human-readable, paginated task board for field teams and reviewers. Raw dataset and worklist JSON remain confined to the administrator workspace and backend handoff process. A dated `verificationTrail` records authoritative searches that did not yield sufficient evidence, preventing repeated searches from being mistaken for verification.

Evidence assignments are live workflow records, not dataset edits. They may store assignee, independent reviewer, due date, review note and status history in MariaDB. A task can be complete while the underlying historical record remains `needs-review`; promotion still requires validated source fields, independent review and a deliberate dataset revision.

The public timeline is a cross-domain index over events, people, works, inscriptions, reigns, territorial snapshots, and cultural records. Selecting a timeline item delegates to its existing evidence/detail view rather than duplicating records.

BCE dates are converted to negative internal timeline values for sorting and controls, while labels always render an explicit BCE/CE era and omit year zero. Source-located BCE candidates may appear as research-only timeline items. When a provisional coordinate exists it may also appear on the opt-in research-candidate layer as an amber dashed marker with its precision and review status; it must never use the solid verified-site symbol until every required evidence gate is verified.

Kannada translation contributions use aligned English/Kannada line arrays. Approval requires an appointed reviewer other than the contributor to confirm the cited source, semantic fidelity, names and dates, historical terminology, line completeness and a full-review attestation. MariaDB stores that structured assessment with the review. The static export repeats the public review scope and refuses to publish an approved translation that lacks the complete assessment.

Candidate readiness is intentionally strict:

- `corpus-located` means the research trail is known, but an individual inscription edition has not passed item-level review;
- `item-located` requires a verified series, volume, item number and locator;
- `ready-for-promotion` requires verified item edition, coordinates, transcription, independently approved translation, dated present condition, protection/managing authority and dated licensed photographs.

Provisional coordinates are displayed in the research checklist but are not copied into the candidate's publishable map coordinate. Survey sets must first be split into individual records.

Literary works may additionally carry:

- `creatorIds` linking to people records;
- `genre` and `manuscriptWitnesses` for structured discovery;
- bilingual descriptions, court/polity association and external digital editions.

Inscriptions may additionally carry:

- `editionText.original`, `editionText.transliteration`, and bilingual `editionText.translation`;
- `itemEdition.primary` with series, volume, number and precise locator;
- findspot, protection, managing-authority and present-condition evidence;
- `promotionStatus` and `promotedFromCandidateId` preserving the research trail.

The explorer submits these fields as moderated proposals. They enter the public dataset only after reviewer approval, validation and the static release process.

## Export access policy

Public atlas pages do not expose JSON dataset, worklist, CSL-JSON or relations-matrix exports. They retain human-readable citations and BibTeX/RIS citation tools for ordinary readers. The local `#admin` workspace is the controlled surface for MariaDB-backed dataset import/export and static handoff files; the server still enforces administrator/exporter permissions independently of the public UI.
