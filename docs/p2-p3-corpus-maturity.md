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
| `genealogicalRelations` | 23 | Derived or secondary assertions; the Hoysala, Wadiyar and Western Ganga long bridges are now split into individual-generation links (still needs-review), plus the Vengi and Tuluva-line proof packets — none are final family-tree proof |
| `coinRecords` | 10 | Catalogue/image/metal/weight/findspot gates open; new Maski Ashokan-context and Hoysala catalogue proof packets keep images, weights and findspots unresolved until reviewed |
| `manuscriptWitnesses` | 12 | Repository leads located for some works; new Kavirajamarga Parampare, Shabdamanidarpana/Sanchaya and Itihasa Darshana literature-heavy witness leads keep shelfmark, licence and edition comparison mostly open |
| `boundaryEvidence` | 9 | Schematic evidence packets, including new Chalukya inscription-cluster and Keladi coastal-interior administrative packets; the three Hoysala/Tipu first-target packets now have sourced inscription, campaign and treaty evidence for some gates, each still blocked on a reign-specific source map; not research-grade boundary corpus |
| `inscriptionEditions` | 28 | Item-edition queue started; locator-review metadata added; three new item-level Shravanabelagola packets and a located Belur (Bl. 68) and Muktesvara (S.I.I. XVIII No. 112) record; transcription, translation, photographs and coordinates mostly open |
| `epigraphiaArchiveTexts` | 12 | Local Epigraphia Carnatica TXT cache indexed as OCR discovery citations; page-image review still required |
| `scriptEvolution` | 12 | Public explorer now covers Ashokan/Satavahana Brahmi, Kadamba/Proto-Kannada, Badami Chalukya, Rashtrakuta, Kalyani Chalukya-Hoysala, Vijayanagara-Nayaka/Telugu-Kannada divergence and modern print phases; all still review-gated |
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

A first specialist-catalogue pass (Numista for Hoysala; CoinIndia/Sanjeev Kumar galleries for Tipu Sultan and Vijayanagara) has resolved dynasty/type-level metal, weight and diameter for all three first targets and added KM/Mitchiner catalogue-number citations. None are specimen-matched to a findspot or independently reviewed, so all three remain `needs-review` with the image gate still open.

Current first targets:

| Record | Next action |
| --- | --- |
| `coin-hoysala-belur-numismatic-lead` | Dynasty-wide catalogue now located (gold fanam, copper kasu, silver tara/Veera Ballala III); still need a specimen matched to Belur specifically, a licensed image and independent review. |
| `coin-mysore-srirangapatna-tipu-lead` | Patan-mint gold pagoda specimens now located with weight/diameter and KM numbers (AH1198 RY1, AH1200 RY4, AM1221/KM129); still need a licensed photograph and independent Kannada/Persian review. |
| `coin-vijayanagara-hampi-gold-coinage-lead` | Type-level gold pagoda/varaha data now located (~3.38 g, 11-12 mm, Mitchiner numbers); still need a Hampi-mint-matched specimen, licensed image and independent review. |

### Genealogy and network maturity

Goal: replace long derived graph bridges with source-backed relationship packets.

Minimum evidence per relation:

- exact relation type: parent-child, sibling, spouse, adoption, dynastic claim or succession-family assertion;
- source locator for the genealogy statement;
- person identity aliases and date compatibility;
- explanation of whether the relation is direct proof, secondary synthesis or derived from reign order;
- independent review before changing `evidenceLevel` to `primary` or confidence to `high`.

A first pass has split all three long bridges into individual-generation links, adding new person records (Narasimha I for Hoysala; seven Wadiyar rulers between Chikka Devaraja and Krishnaraja Wadiyar III) and citing each generation to a specific secondary source. None are promoted — every new link stays `needs-review` pending independent review of the underlying inscriptions/primary genealogies.

| Original bridge | What replaced it | Next action |
| --- | --- | --- |
| `genealogy-vishnuvardhana-ballala-ii-hoysala-line` | Two `parent-child` links via a new `person-narasimha-i` (Vishnuvardhana → Narasimha I → Ballala II), cited to the Yalladahalli record of c. 1145. | Independent review of the inscription text; the succession is described as contested (Ballala II is said to have deposed his father). |
| `genealogy-yaduraya-krishnaraja-iii-mysore-line` | A shortened, still-`derived` bridge (Yaduraya → Chikka Devaraja, 1399-1673) plus eight source-cited links (Chikka Devaraja → Kanthirava Narasaraja II → Dodda Krishnaraja I → [adoption] Chamaraja Wodeyar VII → [sibling] Krishnaraja Wadiyar II → Nanjaraja Wodeyar → [sibling] Chamaraja Wodeyar VIII → [sibling] Chamaraja Wodeyar IX → Krishnaraja Wadiyar III). | The pre-1673 span still passes through several early collateral successions (nephews, cousins, a direct-line break) that need ruler-by-ruler primary-source review. |
| `genealogy-durvinita-sripurusha-dynastic-line` | Six `succession-family-assertion` links across the full regnal sequence (Durvinita → Mushkara → Polavira → Srivikrama → Bhuvikrama → Shivamara I → Sripurusha). Kept as succession assertions rather than `parent-child` because competing Western Ganga chronologies disagree on exact family relations. | Resolve each link against Epigraphia Carnatica copper-plate genealogies rather than the discovery-lead Wikipedia list currently cited. |

### Boundary evidence maturity

Goal: replace schematic comparison envelopes with defensible historical geography.

Minimum evidence per boundary packet:

- territorial extent ID and polity ID;
- distinction between direct rule, temporary occupation, contested zone, tribute or campaign reach;
- source map comparison where available;
- inscription clusters and administrative-unit evidence;
- explicit blocking evidence list until the geometry is ready.

A first sourcing pass has closed several of the requiredEvidence gates below with real citations (a specific dated inscription, campaign lists, treaty text). Each record still keeps at least one blocking gate — a reign/year-specific source map has not been found for any of the three, so `geometryStatus` stays `schematic` and `review.status` stays `needs-review` for all.

Current first targets:

| Record | What's now located | Still blocking |
| --- | --- | --- |
| `boundary-evidence-hoysala-vishnuvardhana-1117` | Inscription-cluster evidence: the Belur Chennakeshava temple inscription of 1117 records Vishnuvardhana's victory over the Cholas at Talakad, the conquest this extent centres on. | A reign-specific source map (only a whole-dynasty "greatest extent" composite has been found). |
| `boundary-evidence-hoysala-ballala-ii-1187` | Regional-campaign evidence: wars against the Yadavas of Devagiri, Southern Kalachuris, Pandyas of Madurai and Western Chalukyas, and a move to full independence dated 1187-1193 depending on source. | Dated inscription clusters specific to this reign, and a reign-specific source map. |
| `boundary-evidence-mysore-tipu-sultan-1787` | Treaty-boundary evidence (the 1784 Treaty of Mangalore's status-quo-ante restoration) and wartime-frontier evidence (the April 1787 Treaty of Gajendragad fixing the Tungabhadra river as the Maratha-Mysore boundary after Tipu ceded Badami). | A dated, specialist source map specific to 1787. |

### Inscription edition maturity

Goal: turn inscription clusters and candidate packets into item-level editions.

The local Epigraphia Carnatica TXT cache is indexed in `epigraphiaArchiveTexts`. These records are citation targets and OCR discovery signals only. They can help find likely volume/item/page leads, but they cannot close an evidence gate until a reviewer checks the printed page image and records an item-level locator.

Itihasa Darshana volumes now carry `contentReview.atlasLinks` on the source records. These links connect volume-level OCR signals to existing atlas targets such as inscription-edition packets, script-evolution phases, Kannada literary works, manuscript witnesses and selected freedom-movement source leads. Karnataka Parampare volumes 1 and 2 have completed a first metadata/OCR locator screening pass: they now carry article or plate leads for Rashtrakutas, Goa Kadambas, Devagiri Yadavas, Vijayanagara origins, coastal ports/Goa, Vijayanagara coin plates and later heritage records. They are routing aids only: reviewers must identify the article title, printed page, quotation or summary, and target-record fit before using either series as a record citation.

The Evidence Workflow includes a `sourceLinks` stream for these discovery links. It currently creates assignable tasks for Epigraphia OCR locator hints and research-volume article/page review groups, so reviewers can close the gap between a volume-level discovery signal and a record-level citation.

The first source-volume extraction sprint converts the strongest Karnataka Parampare and offline Archive identifier leads into normal atlas candidate records. This batch adds four place leads, two people leads, four event leads, two inscription leads, three inscription-edition packets and one coin-plate packet. The offline folder names are treated as Internet Archive identifiers in source records, but the extracted records remain `needs-review` until the page image, printed locator and item-level citation are confirmed.

The second extraction sprint registers all 12 offline Epigraphia Carnatica folder names as Internet Archive identifiers and adds five Parampare image/caption leads for Achyutaraya-period Hampi, Daria Daulat Bagh, Srirangapatna Gumbaz, Chitradurga Fort and Mysuru Palace. These enrich exploration and reviewer triage without replacing existing authority-backed heritage records.

The third extraction sprint adds Volume 1 article-review event leads for Rashtrakuta political history, Goa Kadambas and Devagiri Yadavas, plus a Western Ganga gold-coin image-plate packet. These records make the topics visible in timeline/search while preserving the next action: locate page image, printed article range and item-level evidence.

The fourth maturity sprint expands the palaeography layer into a full chronological and morphological classification. It adds Maski and Brahmagiri Ashokan Brahmi inscription packets, a Satavahana context polity, Badami Chalukya and Rashtrakuta sub-stages, Kalyani Chalukya-Hoysala ornate Middle Kannada, Vijayanagara-Nayaka standardisation, Telugu-Kannada differentiation, palm-leaf influence and modern print-standard Kannada. The same sprint adds new review-gated coin, genealogy, samanta, boundary, district-history, manuscript and source-volume routing records.

The fifth extraction sprint finishes the current bounded source-volume pass by promoting the strongest remaining volume-level leads into review-gated atlas records. Karnataka Parampare Volume 1 now has map/timeline-visible Halmidi-Talagunda plate and inscription-edition review packets, Karnataka Parampare Volume 2 has a Vijayanagara/Karnata comparison event lead, and Itihasa Darshana literature-heavy volumes now seed manuscript-witness review packets for Vikramarjuna Vijaya, Kumaravyasa Bharata and Torave Ramayana. These records are intentionally not treated as verified witnesses until page images, article titles, printed locators and claim-level summaries are entered.

Minimum evidence per edition:

- edition series, volume, item number and page/line locator;
- original text or line-aligned transcription;
- translation witness and independent Kannada review;
- authority coordinate or documented unresolved coordinate;
- present condition, managing authority and dated licensed photographs.

A first pass located real item-level Epigraphia Carnatica / South Indian Inscriptions numbers via the digitized volumes on the Internet Archive. All records stay `needs-review`: locating an item number only advances the `itemEdition`/text-witness `originalStatus` gate, not transcription, translation, photographs or independent review.

Current first targets:

| Record | What's now located | Next action |
| --- | --- | --- |
| `edition-inscription-muktesvara-attiraja-review-packet` | The digitized S.I.I. XVIII No. 112 text is confirmed and names Attiraja (son of Dasa and Chaudabbarasi, Jatachola/Jomma lineage), matching the record's subject. | Check the printed plate, complete a line-aligned transcription and translation, and attach dated licensed photographs. |
| `edition-inscription-shravanabelagola-cluster` | Split into three item-level packets sourced from the digitized EC Vol. II text: `edition-inscription-shravanabelagola-gommateshwara-chavundaraya` (Nos. 175/176/179, trilingual Gommateshwara commissioning inscription), `edition-inscription-shravanabelagola-gangaraja-basti` (No. 70, Ganga-Raja's 1138 basti for his mother Pochawa) and `edition-inscription-shravanabelagola-panditarya-epitaph` (No. 254, the 1398 Panditarya epitaph). The umbrella cluster record stays as an index for the ~500-item corpus. | Continue identifying further Shravanabelagola items from EC Vol. II and splitting them out; check printed plates and complete transcription/translation for the three new items. |
| `edition-inscription-belur-foundation` | Matched to Epigraphia Carnatica Vol. V Part 1 (Hassan district) item **Bl. 68**, which records Vishnuvardhana's 1117 consecration of the Vijayanarayana/Chennakeshava temple and names queen Santala Devi. `itemEdition.status` moved from `provisional` to `located`. | Check the printed plate, complete transcription/translation and attach dated licensed photographs before promotion. |

### Manuscript and Sanchaya maturity

Goal: connect Kannada works to reliable manuscript, print or digital witnesses.

Minimum evidence per witness:

- repository or digital project record;
- shelfmark or explicit “not applicable” reason;
- edition comparison status;
- public access and licence status;
- work ID, language, script and completeness;
- citation locator for the witness or catalogue.

The original "Sanchaya" repository claim for the two digital-witness leads could not be verified (sanchaya.org blocks automated access), so both were re-pointed at real, freely downloadable digitized editions found on the Internet Archive instead.

Current first targets:

| Record | What's now located | Still open |
| --- | --- | --- |
| `manuscript-kumaravyasa-bharata-sanchaya-witness-lead` | The Kuvempu/Masti Venkatesha Iyengar Government-of-Mysore critical edition (676 pp., freely downloadable) plus the Murty Classical Library of India scholarly bilingual translation (Harvard University Press) as an edition-comparison witness. `editionComparison` moved to `located`; `access.status` moved to `public`. | Formal copyright/licence status of the Mysore-era edition is not independently confirmed (`license` stays `provisional`); independent scholarly review still required. |
| `manuscript-torave-ramayana-sanchaya-witness-lead` | A 1977 Kannada Sahitya Parishat print edition, Volume 2, freely downloadable on the Internet Archive. `editionComparison` moved to `located`; `access.status` moved to `public`; `completeness` set to `fragmentary` since only Volume 2 has been found so far. | Locate Volume 1; confirm licence status; independent scholarly review. |
| `manuscript-vaddaradhane-palm-leaf-witness-lead` | Nothing new — the cited CESCK catalogue URL (cesck.uni-mysore.ac.in) no longer resolves (checked 2026-08-25), so `repositoryRecord` was downgraded from `located` to `provisional` and `access.status` to `unresolved` rather than left pointing at a dead link. | Re-locate a working CESCK (or successor) manuscript catalogue before the shelfmark for the 1434 witness can be resolved. |

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
| `script-ashokan-satavahana-brahmi-root` | Verify Maski and Brahmagiri item editions, exact coordinates and specialist palaeographic references; keep this as root-script comparison, not a Kannada-script claim. |
| `script-southern-brahmi-kadamba-transition` | Attach item-level Talagunda and Halmidi edition locators and palaeographic references for Kadamba/Proto-Kannada divergence. |
| `script-badami-chalukya-rounded-transition` | Resolve Aihole and Kappe Arabhatta page/plate/line locators and compare rounded letterforms, matras and vattakshara structures. |
| `script-rashtrakuta-uniform-old-kannada` | Resolve Atakur and Begur locators and verify wider, more uniform Old Kannada letter bodies and emerging talekattu evidence. |
| `script-kalyani-chalukya-hoysala-ornate-middle-kannada` | Attach Lakkundi, Belur and Muktesvara editions, translations, plate/page references and monument links for circular forms, loops and talekattu. |
| `script-vijayanagara-nayaka-standardising-kannada` | Split Vijayanagara and successor Nayaka witnesses by script, language and medium; document Telugu-Kannada divergence only from item-level records. |
| `script-mysore-wodeyar-print-standard-kannada` | Connect Mysore, Mangaluru/Basel Mission, Bangalore print and Patrika Sanchaya witnesses with source runs, type specimens and licence notes. |

## Reviewer operations

Use `#evidence` for day-to-day work:

1. Filter by domain: coinage, genealogy, boundaries, manuscripts, scripts or epigraphy.
2. Assign the evidence task to a researcher.
3. Add a due date and move the task to `Awaiting review` only after the required material is attached.
4. Enter an independent reviewer before marking a task complete.
5. Use reviewer notes for unresolved caveats, not private information.
6. Use the ready-for-promotion queue to inspect packets close to completion.

The reviewer dashboard is operational reporting, not publication authority. A task marked complete says the task was handled; the record remains `needs-review` until the evidence packet itself is reviewed and promoted in a permanent dataset revision.
