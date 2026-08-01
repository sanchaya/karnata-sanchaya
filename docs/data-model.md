# Atlas v0.2 data model

The normalized installation seed is defined in `src/data/atlas.js` and `server/seeds/`. On the live portal, the latest immutable `dataset_snapshots` revision in MariaDB is the authoritative instance of these linked collections. The application loads `/api/dataset` before page modules evaluate, so maps, timelines, search, statistics and Admin use the same revision. Repository JSON remains a seed and static-publication input; no research record is persisted in browser storage. Every record has a globally unique, stable, lowercase kebab-case ID.

| Collection | Purpose | Main links |
| --- | --- | --- |
| `polities` | Karnataka-rooted kingdoms and political entities | `capitalId` → place |
| `externalPolities` | External empires, alliances and constitutional successors | Event participants |
| `events` | Battles, campaigns, invasions, foundations and constitutional transitions | Participants, point/route, citations |
| `people` | Rulers, authors, patrons and other people | `polityId` → polity |
| `peopleCandidates` | Wikimedia and community discovery candidates awaiting biographical review | Wikidata ID, birthplace, roles, evidence gates, citations |
| `places` | Named geographic locations | GeoJSON-style `location` |
| `inscriptions` | Epigraphic records or described clusters | `placeId`, `polityId` |
| `works` | Literary and scholarly works | `polityId`, external links |
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
- People candidates remain `needs-review` and `publicationReady: false`. They use eight evidence gates and are promoted by creating or updating a curated `people` record after independent review; discovery status is never changed to simulate publication.
- Relationships are records because an assertion can have its own date, citations, and review state.
- Political relations are deliberately separate from generated relationships. Each record names two or more parties, distinguishes war/invasion/campaign/trade/diplomacy/travel-and-knowledge/treaty/alliance/tribute/suzerainty/administrative or constitutional integration, carries a dated route and battle-location set, records an outcome, and links people, underlying events and documentary witnesses. Seed records remain `needs-review` until the relationship is independently resolved.
- Events carry bilingual narratives, participants with roles and outcomes, an approximate point, an optional schematic campaign route, consequences, citations, and review state.
- District deep-history records use `recordKind` (`district-scope` or `candidate`), an explicit category, bilingual description and research note, optional GeoJSON point precision, provenance citations and a `needs-review` gate. The public `#district-history` explorer renders all 31 district scope slots and marks indicative locality leads with amber dashed markers; it does not promote the contributor-supplied Bengaluru infographic to an authority source.

## Validation and publication

Run `npm run validate:data` before building. Validation checks collection structure, globally unique stable IDs, bilingual names, date order and precision, point coordinates, review states, citations, and entity references. Errors fail the command; missing Kannada labels are warnings.

The live administrator workspace stores complete, validated dataset revisions in MariaDB, with a revision number, content hash, actor and audit-log entry. It does not use browser local storage for edits. Imported JSON remains staged until an administrator explicitly saves it as a new server revision. Exported JSON is a review/handoff artifact, not automatically public data; the approved static release is still generated deliberately for GitHub Pages.

The live authenticated administrator service uses the same JSON contract for permanent full-dataset revisions. Concurrent saves use revision checks and return a conflict instead of silently overwriting another administrator's work. Keep the static repository dataset as the reviewed publication snapshot.

## Literature and epigraphy explorer fields

Atlas v0.15.2 treats public records and district research candidates as different evidence states. A candidate is not rendered as a mapped inscription until its place, date and item-level edition have been reviewed.

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
