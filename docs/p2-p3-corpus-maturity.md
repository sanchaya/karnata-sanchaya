# P2/P3 corpus maturity workflow

Updated: 2026-08-25

This runbook covers the collections that moved from “missing” to “structured but not yet mature”: genealogy, coins, boundary evidence, inscription editions and manuscript/Sanchaya witnesses. These records make the atlas explorable now, but they are still research packets. Do not promote them until the evidence gates are complete and an independent reviewer has recorded the decision.

## Current implemented surface

- `#relations` shows genealogy and feudatory edges in the network graph.
- `#coins` shows coinage leads with map, search, polity and evidence-gate filters.
- `#scripts` shows script-evolution phases with sample inscriptions, predecessor links, polity context and evidence handoff.
- `#epigraphy` includes the inscription-edition review queue with locator-review next actions, linked script-phase context, and sprint filters for script-support/high-priority packets.
- `#evidence` includes P2 material streams, reviewer fields, saved status history, reviewer dashboard and the ready-for-promotion queue.
- Static open dataset packets are regenerated during `npm run build`; public packets strip private workflow and moderation fields.

## Current corpus depth

| Collection | Current count | Status |
| --- | ---: | --- |
| `genealogicalRelations` | 7 | Derived or secondary assertions; not final family-tree proof |
| `coinRecords` | 6 | Catalogue/image/metal/weight/findspot gates open |
| `manuscriptWitnesses` | 7 | Repository leads located for some works; shelfmark, licence and edition comparison mostly open |
| `boundaryEvidence` | 7 | Schematic evidence packets, not research-grade boundary corpus |
| `inscriptionEditions` | 20 | Item-edition queue started; locator-review metadata added; transcription, translation, photographs and coordinates mostly open |
| `epigraphiaArchiveTexts` | 12 | Local Epigraphia Carnatica TXT cache indexed as OCR discovery citations; page-image review still required |
| `scriptEvolution` | 6 | Public explorer now covers early, medieval, Vijayanagara and print phases; all still review-gated |
| Research-volume source links | 33 linked volumes / 65 link groups | Itihasa Darshana plus Karnataka Parampare source leads now route to inscription, script, literature, manuscript, freedom-movement, outside-Karnataka rule, ports, coinage and heritage review targets; Parampare links include OCR/page locator hints but still require page-image review |

## Promotion rule

A record can move beyond `needs-review` only when all of the following are true:

1. The source is an authority source, primary edition, specialist catalogue or reviewed scholarly source.
2. The citation includes a stable item/page/plate/catalogue locator.
3. The date, person identity, polity link and place link are independently checked.
4. Kannada and English interpretation are reviewed by someone other than the contributor.
5. Image, licence, present condition and repository/custody fields are complete where relevant.
6. `npm run validate:data` and `npm run check` pass after the update.
7. The change is saved as a permanent MariaDB revision before a static publication build.

## Work queues

### Coin maturity

Goal: convert coinage leads into catalogue-backed coin records.

Minimum evidence per coin:

- catalogue source, volume, item number and plate or figure;
- polity attribution and date range;
- metal, denomination, weight and diameter when available;
- mint or findspot, with certainty level;
- licensed image or a documented image restriction;
- bilingual obverse and reverse notes.

Current first targets:

| Record | Next action |
| --- | --- |
| `coin-hoysala-belur-numismatic-lead` | Find catalogue specimen and plate for Hoysala coinage associated with the Belur/Halebidu zone. |
| `coin-mysore-srirangapatna-tipu-lead` | Match Tipu-period Srirangapatna specimens to catalogue, metal, denomination and image rights. |
| `coin-vijayanagara-hampi-gold-coinage-lead` | Attach item-level catalogue specimens and licensed images. |

### Genealogy and network maturity

Goal: replace long derived graph bridges with source-backed relationship packets.

Minimum evidence per relation:

- exact relation type: parent-child, sibling, spouse, adoption, dynastic claim or succession-family assertion;
- source locator for the genealogy statement;
- person identity aliases and date compatibility;
- explanation of whether the relation is direct proof, secondary synthesis or derived from reign order;
- independent review before changing `evidenceLevel` to `primary` or confidence to `high`.

Current first targets:

| Record | Next action |
| --- | --- |
| `genealogy-vishnuvardhana-ballala-ii-hoysala-line` | Split the long bridge into individual generations after locating Hoysala genealogy evidence. |
| `genealogy-yaduraya-krishnaraja-iii-mysore-line` | Replace the long Wadiyar bridge with source-verified generations. |
| `genealogy-durvinita-sripurusha-dynastic-line` | Resolve the intervening Western Ganga lineage from inscriptions or specialist chronology. |

### Boundary evidence maturity

Goal: replace schematic comparison envelopes with defensible historical geography.

Minimum evidence per boundary packet:

- territorial extent ID and polity ID;
- distinction between direct rule, temporary occupation, contested zone, tribute or campaign reach;
- source map comparison where available;
- inscription clusters and administrative-unit evidence;
- explicit blocking evidence list until the geometry is ready.

Current first targets:

| Record | Next action |
| --- | --- |
| `boundary-evidence-hoysala-vishnuvardhana-1117` | Attach inscription clusters and compare Belur/Halebidu-centred source maps. |
| `boundary-evidence-hoysala-ballala-ii-1187` | Resolve regional campaigns and inscription distribution before widening confidence. |
| `boundary-evidence-mysore-tipu-sultan-1787` | Add treaty boundary and wartime frontier evidence; keep diplomatic links separate from territory. |

### Inscription edition maturity

Goal: turn inscription clusters and candidate packets into item-level editions.

The local Epigraphia Carnatica TXT cache is indexed in `epigraphiaArchiveTexts`. These records are citation targets and OCR discovery signals only. They can help find likely volume/item/page leads, but they cannot close an evidence gate until a reviewer checks the printed page image and records an item-level locator.

Itihasa Darshana volumes now carry `contentReview.atlasLinks` on the source records. These links connect volume-level OCR signals to existing atlas targets such as inscription-edition packets, script-evolution phases, Kannada literary works, manuscript witnesses and selected freedom-movement source leads. Karnataka Parampare volumes 1 and 2 have completed a first metadata/OCR locator screening pass: they now carry article or plate leads for Rashtrakutas, Goa Kadambas, Devagiri Yadavas, Vijayanagara origins, coastal ports/Goa, Vijayanagara coin plates and later heritage records. They are routing aids only: reviewers must identify the article title, printed page, quotation or summary, and target-record fit before using either series as a record citation.

The Evidence Workflow includes a `sourceLinks` stream for these discovery links. It currently creates assignable tasks for Epigraphia OCR locator hints and research-volume article/page review groups, so reviewers can close the gap between a volume-level discovery signal and a record-level citation.

Minimum evidence per edition:

- edition series, volume, item number and page/line locator;
- original text or line-aligned transcription;
- translation witness and independent Kannada review;
- authority coordinate or documented unresolved coordinate;
- present condition, managing authority and dated licensed photographs.

Current first targets:

| Record | Next action |
| --- | --- |
| `edition-inscription-muktesvara-attiraja-review-packet` | Attach reviewed transcription, translation and image set to the located S.I.I. XVIII no. 112 record. |
| `edition-inscription-shravanabelagola-cluster` | Split the cluster into item-level records before promotion. |
| `edition-inscription-belur-foundation` | Match Belur foundation records to exact corpus items and photographs. |

### Manuscript and Sanchaya maturity

Goal: connect Kannada works to reliable manuscript, print or digital witnesses.

Minimum evidence per witness:

- repository or digital project record;
- shelfmark or explicit “not applicable” reason;
- edition comparison status;
- public access and licence status;
- work ID, language, script and completeness;
- citation locator for the witness or catalogue.

Current first targets:

| Record | Next action |
| --- | --- |
| `manuscript-kumaravyasa-bharata-sanchaya-witness-lead` | Attach exact Sanchaya/project URL, source edition and licence status. |
| `manuscript-torave-ramayana-sanchaya-witness-lead` | Locate source text, edition comparison and digital witness terms. |
| `manuscript-vaddaradhane-palm-leaf-witness-lead` | Resolve repository shelfmarks and compare the 1434 witness to edited text. |

### Script evolution maturity

Goal: turn the initial script timeline into a reviewed palaeographic evidence layer.

Minimum evidence per phase:

- sample inscription IDs with item-level editions;
- predecessor and successor relationships;
- related polities and date range;
- script-family label checked against specialist terminology;
- citations with plate, page or line locators;
- note explaining whether the phase is inscriptional, manuscript, print or mixed evidence.

Current first targets:

| Record | Next action |
| --- | --- |
| `script-southern-brahmi-kadamba-transition` | Attach item-level Talagunda and Halmidi edition locators and palaeographic references. |
| `script-old-kannada-epigraphic-phase` | Add more sample inscriptions beyond Halmidi and Shravanabelagola, with exact corpus locators. |
| `script-early-kannada-verse-transition` | Resolve Kappe Arabhatta, Begur and Atakur locators against printed editions, line numbers and image witnesses. |
| `script-medieval-kannada-temple-epigraphy` | Attach Lakkundi, Belur and Muktesvara editions, translations, plate/page references and monument links. |
| `script-vijayanagara-kannada-nagari-mixed-phase` | Split Hampi/Vijayanagara witnesses by script, language and medium once item-level corpus records are available. |
| `script-modern-kannada-print-transition` | Connect manuscript, print and Patrika Sanchaya witnesses with source runs and licence notes. |

## Reviewer operations

Use `#evidence` for day-to-day work:

1. Filter by domain: coinage, genealogy, boundaries, manuscripts, scripts or epigraphy.
2. Assign the evidence task to a researcher.
3. Add a due date and move the task to `Awaiting review` only after the required material is attached.
4. Enter an independent reviewer before marking a task complete.
5. Use reviewer notes for unresolved caveats, not private information.
6. Use the ready-for-promotion queue to inspect packets close to completion.

The reviewer dashboard is operational reporting, not publication authority. A task marked complete says the task was handled; the record remains `needs-review` until the evidence packet itself is reviewed and promoted in a permanent dataset revision.
