// Item-level facts mined from the OCR text of books in the Internet Archive KarnatakaArchaeology
// collection (see scripts/import-karnataka-archaeology.mjs and src/data/karnataka-archaeology.generated.js
// for the underlying discovery leads). Each record here cites a specific catalogue number/page from a
// named volume rather than a bare OCR term match, but remains a review-gated lead: OCR quality on these
// scans is uneven and every entry still needs an independent page-image check before promotion.
const n = (en, kn) => ({ en, kn })
const d = (from, to, precision = 'range') => ({ from, to, era: 'CE', precision })
const c = (sourceId, locator) => ({ sourceId, locator })
const review = { status: 'needs-review', reviewer: null, updatedAt: '2026-08-29' }

// Source: "Inscriptions At Vijayanagara (Hampi)" - Inscriptions of Karnataka Vol. I,
// Vijayanagara Research Centre Series No. 8 (Directorate of Archaeology and Museums, Mysore, 1995),
// eds. Channabasappa S. Patil and Vinoda C. Patil.
const SRC_HAMPI_VOL1_SERIES8 = 'src-ia-karnataka-archaeology-damh-inscriptionsatvi0000chan-vol-i-ser-8'

export const karnatakaArchaeologyMiningInscriptions = [
  {
    id: 'inscription-karch-hampi-vol1-no113-kampiladeva-trikuta-lingas',
    name: n('Trikuta temple linga-installation inscription of Vira Kampiladeva', 'ತ್ರಿಕೂಟ ದೇವಾಲಯ ವೀರ ಕಂಪಿಲದೇವ ಲಿಂಗ ಸ್ಥಾಪನಾ ಶಾಸನ'),
    date: d(1300, 1399, 'century'),
    placeId: 'place-hampi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-vijayanagara',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as No. 113: a pillar inscription in the Trikuta temple recording that Vira Kampiladeva, son of Mummadi-Singeya-Nayaka and a devotee of Sangameshvaradeva, installed lingas in memory of his mother Mada-Nayakiti, his father Singeya-Nayaka and one Perumeya-Nayaka. Pre-dates Vijayanagara proper (Kampili chiefdom era); item number, exact findspot map-grid and page image still need independent verification.', 'ಸಂಖ್ಯೆ 113ರಂತೆ ಪಟ್ಟಿಗತ: ತ್ರಿಕೂಟ ದೇವಾಲಯದ ಒಂದು ಕಂಬ ಶಾಸನ, ಮುಮ್ಮಡಿ-ಸಿಂಗೆಯ-ನಾಯಕನ ಪುತ್ರ ಮತ್ತು ಸಂಗಮೇಶ್ವರದೇವನ ಭಕ್ತ ವೀರ ಕಂಪಿಲದೇವ, ತನ್ನ ತಾಯಿ ಮಡ-ನಾಯಕಿತಿ, ತಂದೆ ಸಿಂಗೆಯ-ನಾಯಕ ಮತ್ತು ಪೆರುಮೆಯ-ನಾಯಕನ ಸ್ಮರಣಾರ್ಥ ಲಿಂಗಗಳನ್ನು ಸ್ಥಾಪಿಸಿದನೆಂದು ದಾಖಲಿಸುತ್ತದೆ. ವಿಜಯನಗರಕ್ಕೂ ಮುಂಚಿನದು (ಕಂಪಿಲಿ ಪಾಳೆಯಗಾರಿಕೆ ಕಾಲ); ವಸ್ತು ಸಂಖ್ಯೆ, ನಿಖರ ಪತ್ತೆಸ್ಥಳ ನಕ್ಷೆ-ಚೌಕ ಮತ್ತು ಪುಟಚಿತ್ರ ಸ್ವತಂತ್ರ ಪರಿಶೀಲನೆ ಬೇಕು.'),
    citations: [c(SRC_HAMPI_VOL1_SERIES8, 'No. 113 (p. 33): pillar inscription at the Trikuta temple; also cross-referenced in ARIE 1934-35 No. B 353 and VPR 1983-84 No. 1')],
    review,
  },
  {
    id: 'inscription-karch-hampi-vol1-no267-virupaksha-iii-canal',
    name: n('Undated canal-construction inscription of Virupaksha III', 'ವಿರೂಪಾಕ್ಷ III ಕಾಲುವೆ ನಿರ್ಮಾಣ ಶಾಸನ (ದಿನಾಂಕವಿಲ್ಲ)'),
    date: d(1465, 1485, 'range'),
    placeId: 'place-hampi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-vijayanagara',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as No. 267, the editors note it is the only inscription in the volume referring to a king named Virupaksha; it records that Hegade Hitalabagila Basavanna-anna built a canal by royal order. Since two Vijayanagara kings bore this name (Virupaksha II, r. 1404-1406; Virupaksha III, r. 1465-1485), the editors attribute it to Virupaksha III on internal grounds, but the inscription itself carries no date.', 'ಸಂಖ್ಯೆ 267ರಂತೆ ಪಟ್ಟಿಗತ; ಸಂಪಾದಕರ ಪ್ರಕಾರ ಇದು ಈ ಸಂಪುಟದಲ್ಲಿ ವಿರೂಪಾಕ್ಷ ಎಂಬ ಅರಸನನ್ನು ಉಲ್ಲೇಖಿಸುವ ಏಕೈಕ ಶಾಸನ; ಹೆಗಡೆ ಹಿಟ್ಟಲಬಾಗಿಲ ಬಸವಣ್ಣ-ಅಣ್ಣ ರಾಜಾಜ್ಞೆಯಂತೆ ಕಾಲುವೆ ನಿರ್ಮಿಸಿದನೆಂದು ದಾಖಲಿಸುತ್ತದೆ. ಈ ಹೆಸರಿನ ಇಬ್ಬರು ವಿಜಯನಗರ ಅರಸರಿದ್ದುದರಿಂದ (ವಿರೂಪಾಕ್ಷ II, ಆ. 1404-1406; ವಿರೂಪಾಕ್ಷ III, ಆ. 1465-1485), ಸಂಪಾದಕರು ಆಂತರಿಕ ಆಧಾರದ ಮೇಲೆ ವಿರೂಪಾಕ್ಷ IIIಗೆ ಆರೋಪಿಸುತ್ತಾರೆ, ಆದರೆ ಶಾಸನದಲ್ಲಿಯೇ ದಿನಾಂಕವಿಲ್ಲ.'),
    citations: [c(SRC_HAMPI_VOL1_SERIES8, 'No. 267, discussed in the volume introduction (p. 22): undated, attributed to Virupaksha III on internal grounds only')],
    review,
  },
  {
    id: 'inscription-karch-hampi-vol1-no104-106-krishnadevaraya-coronation-debate',
    name: n('Krishnadevaraya coronation-date inscriptions (Nos. 104, 106, 70)', 'ಕೃಷ್ಣದೇವರಾಯ ಪಟ್ಟಾಭಿಷೇಕ ದಿನಾಂಕ ಶಾಸನಗಳು (ಸಂಖ್ಯೆ 104, 106, 70)'),
    date: d(1510, 1510, 'year'),
    placeId: 'place-hampi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-vijayanagara',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('A historiographically significant cluster the editors flag directly: the traditionally cited coronation date of Krishnadevaraya (8 August 1509, derived from the Vijayanagara Samrajyamu report of 1604) is contradicted by three inscriptions recording a donation to the god Virupaksha on the occasion of the king\'s coronation. Nos. 104 and 106 (Saka 1430, Magha su. 14 = 24 January 1510) and No. 70, discovered later at Singanayakanahalli (Saka 1431, same tithi), together suggest a coronation date of 24 January 1510 — a full inscriptional record the editors say "scholars have not taken seriously." Recorded here as an open historiographical question, not a settled date.', 'ಸಂಪಾದಕರೇ ನೇರವಾಗಿ ಗುರುತಿಸುವ ಇತಿಹಾಸಶಾಸ್ತ್ರೀಯವಾಗಿ ಮಹತ್ವದ ಗುಂಪು: ಕೃಷ್ಣದೇವರಾಯನ ಸಾಂಪ್ರದಾಯಿಕವಾಗಿ ಉಲ್ಲೇಖಿತ ಪಟ್ಟಾಭಿಷೇಕ ದಿನಾಂಕ (8 ಆಗಸ್ಟ್ 1509, 1604ರ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯಂ ವರದಿಯಿಂದ) ಮೂರು ಶಾಸನಗಳಿಂದ ವಿರೋಧಿಸಲ್ಪಟ್ಟಿದೆ, ಅವು ರಾಜನ ಪಟ್ಟಾಭಿಷೇಕ ಸಂದರ್ಭದಲ್ಲಿ ವಿರೂಪಾಕ್ಷ ದೇವರಿಗೆ ದಾನ ದಾಖಲಿಸುತ್ತವೆ. ಸಂಖ್ಯೆ 104 ಮತ್ತು 106 (ಶಕ 1430, ಮಾಘ ಶು. 14 = 24 ಜನವರಿ 1510) ಮತ್ತು ನಂತರ ಸಿಂಗನಾಯಕನಹಳ್ಳಿಯಲ್ಲಿ ಪತ್ತೆಯಾದ ಸಂಖ್ಯೆ 70 (ಶಕ 1431, ಅದೇ ತಿಥಿ) ಒಟ್ಟಾಗಿ 24 ಜನವರಿ 1510ರ ಪಟ್ಟಾಭಿಷೇಕ ದಿನಾಂಕವನ್ನು ಸೂಚಿಸುತ್ತವೆ — ಸಂಪಾದಕರ ಪ್ರಕಾರ "ವಿದ್ವಾಂಸರು ಗಂಭೀರವಾಗಿ ಪರಿಗಣಿಸಿಲ್ಲ." ಇಲ್ಲಿ ಒಂದು ಮುಕ್ತ ಇತಿಹಾಸಶಾಸ್ತ್ರೀಯ ಪ್ರಶ್ನೆಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ, ಇತ್ಯರ್ಥವಾದ ದಿನಾಂಕವಲ್ಲ.'),
    citations: [c(SRC_HAMPI_VOL1_SERIES8, 'Volume introduction (p. 23) discussing Nos. 104, 106 and 70 against the traditional 8 August 1509 coronation date from the Vijayanagara Samrajyamu (1604)')],
    review,
  },
  {
    id: 'inscription-karch-hampi-vol1-no188-achyutadevaraya-vitthaladeva-grant',
    name: n('Achyutadevaraya village grant to Vitthaladeva (1531)', 'ವಿಠ್ಠಲದೇವನಿಗೆ ಅಚ್ಯುತದೇವರಾಯನ ಗ್ರಾಮ ಅನುದಾನ ಶಾಸನ (1531)'),
    date: d(1531, 1531, 'year'),
    placeId: 'place-hampi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-vijayanagara',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as No. 188, on the south base of the central shrine of the Vitthala temple: dated Saka 1453, Khara, Jyeshtha su. 15 (30 May 1531, a Tuesday, though the editors note the weekday is not verifiable). Records a grant of a village by Achyutadevaraya for offerings to the god Vitthaladeva.', 'ಸಂಖ್ಯೆ 188ರಂತೆ ಪಟ್ಟಿಗತ, ವಿಠ್ಠಲ ದೇವಾಲಯದ ಗರ್ಭಗುಡಿಯ ದಕ್ಷಿಣ ಪೀಠದ ಮೇಲೆ: ಶಕ 1453, ಖರ, ಜ್ಯೇಷ್ಠ ಶು. 15 (30 ಮೇ 1531, ಮಂಗಳವಾರ, ಆದರೂ ಸಂಪಾದಕರ ಪ್ರಕಾರ ವಾರ ಪರಿಶೀಲನಾರ್ಹವಲ್ಲ) ದಿನಾಂಕಿತ. ಅಚ್ಯುತದೇವರಾಯ ವಿಠ್ಠಲದೇವ ದೇವರ ನೈವೇದ್ಯಕ್ಕಾಗಿ ಒಂದು ಗ್ರಾಮವನ್ನು ಅನುದಾನವಾಗಿ ನೀಡಿದನೆಂದು ದಾಖಲಿಸುತ್ತದೆ.'),
    citations: [c(SRC_HAMPI_VOL1_SERIES8, 'No. 188 (p. 54): also cross-referenced in ARE 1903-04 No. 3 of 1904, SII IX.ii No. 534, and Filliozat 1988 No. V')],
    review,
  },
  {
    id: 'inscription-karch-hampi-vol1-no189-190-achyutadevaraya-vitthalasvami-gifts',
    name: n('Achyutadevaraya-era treasury gifts to the Vitthala temple (1534, 1536)', 'ವಿಠ್ಠಲ ದೇವಾಲಯಕ್ಕೆ ಅಚ್ಯುತದೇವರಾಯ ಕಾಲದ ಖಜಾನೆ ಕಾಣಿಕೆಗಳು (1534, 1536)'),
    date: d(1534, 1536, 'range'),
    placeId: 'place-hampi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-vijayanagara',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Two related entries at the same shrine base: No. 189 (Saka 1456 = 10 December 1534) records a money gift to the Vittaleshvara temple treasury for daily offerings, made by Varadappa-Nayaka son of Tiruvengala-Nayaka for the merit of Achyutadevaraya and Chikkaraya. No. 190 (Saka 1458 = 31 May 1536) records a gift of 200 varahas to the same treasury by Hiriya-Tirumala-Nayaka for the same merit.', 'ಅದೇ ಗರ್ಭಗುಡಿ ಪೀಠದ ಎರಡು ಸಂಬಂಧಿತ ನಮೂದುಗಳು: ಸಂಖ್ಯೆ 189 (ಶಕ 1456 = 10 ಡಿಸೆಂಬರ್ 1534) ವಿಠ್ಠಲೇಶ್ವರ ದೇವಾಲಯದ ಖಜಾನೆಗೆ ದೈನಂದಿನ ನೈವೇದ್ಯಕ್ಕಾಗಿ ತಿರುವೆಂಗಳ-ನಾಯಕನ ಪುತ್ರ ವರದಪ್ಪ-ನಾಯಕನಿಂದ ಹಣ ಕಾಣಿಕೆಯನ್ನು, ಅಚ್ಯುತದೇವರಾಯ ಮತ್ತು ಚಿಕ್ಕರಾಯನ ಪುಣ್ಯಕ್ಕಾಗಿ ದಾಖಲಿಸುತ್ತದೆ. ಸಂಖ್ಯೆ 190 (ಶಕ 1458 = 31 ಮೇ 1536) ಅದೇ ಖಜಾನೆಗೆ ಹಿರಿಯ-ತಿರುಮಲ-ನಾಯಕನಿಂದ 200 ವರಹ ಕಾಣಿಕೆಯನ್ನು, ಅದೇ ಪುಣ್ಯಕ್ಕಾಗಿ ದಾಖಲಿಸುತ್ತದೆ.'),
    citations: [c(SRC_HAMPI_VOL1_SERIES8, 'No. 189 (p. 54, ARE 1903-04 No. 4 of 1904, SII IX.ii No. 570, Filliozat 1988 No. X) and No. 190 (ARE 1903-04 No. 5 of 1904, SII IX.ii No. 574, Filliozat 1988 No. XII)')],
    review,
  },
  {
    id: 'inscription-karch-hampi-vol1-no196-vyasatirtha-narasimha-installation',
    name: n('Vyasatirtha\'s installation of Yoga-Varada Narasimha in the Vitthala temple courtyard (1532)', 'ವಿಠ್ಠಲ ದೇವಾಲಯ ಅಂಗಳದಲ್ಲಿ ವ್ಯಾಸತೀರ್ಥರಿಂದ ಯೋಗ-ವರದ ನರಸಿಂಹ ಪ್ರತಿಷ್ಠಾಪನೆ (1532)'),
    date: d(1532, 1532, 'year'),
    placeId: 'place-hampi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-vijayanagara',
    languages: ['Sanskrit'],
    scripts: ['Nagari'],
    description: n('Catalogued as No. 196, on a stone pedestal behind the Vitthala temple\'s central shrine: a Sanskrit/Nagari record dated Saka 1454 (19 July 1532, though the editors flag the weekday as inconsistent) stating that the image of the god Yoga-Varada Narasimha was set up in the courtyard of the Vitthala temple by the Madhva teacher Vyasatirtha.', 'ಸಂಖ್ಯೆ 196ರಂತೆ ಪಟ್ಟಿಗತ, ವಿಠ್ಠಲ ದೇವಾಲಯದ ಗರ್ಭಗುಡಿಯ ಹಿಂದಿನ ಶಿಲಾ ಪೀಠದ ಮೇಲೆ: ಶಕ 1454 (19 ಜುಲೈ 1532, ಆದರೂ ಸಂಪಾದಕರು ವಾರದ ಅಸಂಗತತೆಯನ್ನು ಗುರುತಿಸುತ್ತಾರೆ) ದಿನಾಂಕಿತ ಸಂಸ್ಕೃತ/ನಾಗರಿ ದಾಖಲೆ, ಮಾಧ್ವ ಗುರು ವ್ಯಾಸತೀರ್ಥರಿಂದ ಯೋಗ-ವರದ ನರಸಿಂಹ ದೇವರ ವಿಗ್ರಹವನ್ನು ವಿಠ್ಠಲ ದೇವಾಲಯದ ಅಂಗಳದಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾಯಿತೆಂದು ಹೇಳುತ್ತದೆ.'),
    citations: [c(SRC_HAMPI_VOL1_SERIES8, 'No. 196 (p. 55-56): also cross-referenced in ARSIE 1922-23 No. 710 of 1922 and Filliozat 1988 No. VII')],
    review,
  },
  {
    id: 'inscription-karch-hampi-vol1-no197-krishnaraya-hundred-pillared-mandapa',
    name: n('Krishnadevaraya-era record in the hundred-pillared mandapa, Vitthala temple (1516-17)', 'ವಿಠ್ಠಲ ದೇವಾಲಯ ನೂರುಕಂಬಗಳ ಮಂಟಪದಲ್ಲಿ ಕೃಷ್ಣದೇವರಾಯ ಕಾಲದ ಶಾಸನ (1516-17)'),
    date: d(1516, 1517, 'range'),
    placeId: 'place-hampi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-vijayanagara',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as No. 197, on the north wall of the hundred-pillared mandapa of the Vitthala temple, attributed to "Vijayanagara; Krishnaraya-Maharaya" and dated Saka 1438, Dhatu (= 1516-17 CE). Full transaction text not yet transcribed from the OCR sample; requires page-image review to establish grant particulars.', 'ಸಂಖ್ಯೆ 197ರಂತೆ ಪಟ್ಟಿಗತ, ವಿಠ್ಠಲ ದೇವಾಲಯದ ನೂರುಕಂಬಗಳ ಮಂಟಪದ ಉತ್ತರ ಗೋಡೆಯ ಮೇಲೆ, "ವಿಜಯನಗರ; ಕೃಷ್ಣರಾಯ-ಮಹಾರಾಯ"ಗೆ ಆರೋಪಿತ ಮತ್ತು ಶಕ 1438, ಧಾತು (= 1516-17) ದಿನಾಂಕಿತ. OCR ಮಾದರಿಯಿಂದ ಪೂರ್ಣ ವ್ಯವಹಾರ ಪಠ್ಯ ಇನ್ನೂ ಲಿಪ್ಯಂತರಿಸಿಲ್ಲ; ಅನುದಾನ ವಿವರಗಳನ್ನು ನಿರ್ಧರಿಸಲು ಪುಟಚಿತ್ರ ಪರಿಶೀಲನೆ ಬೇಕು.'),
    citations: [c(SRC_HAMPI_VOL1_SERIES8, 'No. 197 (p. 56): item number and date only; full text pending page-image review')],
    review,
  },
  {
    id: 'inscription-karch-hampi-vol1-no338-krishnaraya-ramachandra-grant',
    name: n('Krishnadevaraya land grant to the Ramachandra (Hazara Rama) temple (1513)', 'ರಾಮಚಂದ್ರ (ಹಜಾರ ರಾಮ) ದೇವಾಲಯಕ್ಕೆ ಕೃಷ್ಣದೇವರಾಯನ ಭೂಮಿ ಅನುದಾನ ಶಾಸನ (1513)'),
    date: d(1513, 1513, 'year'),
    placeId: 'place-hampi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-vijayanagara',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as No. 338, on the south wall of the north-east mandapa of the Ramachandra (Hazara Rama) temple: dated Saka 1435, Srimukha, Chaitra su. 5 (12 March 1513), attributed to Krishnaraya. Records the king\'s grant of six villages (Volakote, Taliru, Yittage, Muddapura, Kutukanahalli and Jayanira across several simes) for the service of the god Ramachandra, for the merit of his father Narasana-Nayaka-Vodeya and mother Nagaji-amma.', 'ಸಂಖ್ಯೆ 338ರಂತೆ ಪಟ್ಟಿಗತ, ರಾಮಚಂದ್ರ (ಹಜಾರ ರಾಮ) ದೇವಾಲಯದ ಈಶಾನ್ಯ ಮಂಟಪದ ದಕ್ಷಿಣ ಗೋಡೆಯ ಮೇಲೆ: ಶಕ 1435, ಶ್ರೀಮುಖ, ಚೈತ್ರ ಶು. 5 (12 ಮಾರ್ಚ್ 1513) ದಿನಾಂಕಿತ, ಕೃಷ್ಣರಾಯನಿಗೆ ಆರೋಪಿತ. ರಾಮಚಂದ್ರ ದೇವರ ಸೇವೆಗಾಗಿ, ತಂದೆ ನರಸನ-ನಾಯಕ-ವೊಡೆಯ ಮತ್ತು ತಾಯಿ ನಾಗಜಿ-ಅಮ್ಮನ ಪುಣ್ಯಕ್ಕಾಗಿ, ರಾಜನು ಆರು ಗ್ರಾಮಗಳನ್ನು (ವೊಲಕೋಟೆ, ತಳಿರು, ಯಿತ್ತಗೆ, ಮುದ್ದಪುರ, ಕುತುಕನಹಳ್ಳಿ, ಜಯನಿರ) ಅನುದಾನವಾಗಿ ನೀಡಿದನೆಂದು ದಾಖಲಿಸುತ್ತದೆ.'),
    citations: [c(SRC_HAMPI_VOL1_SERIES8, 'No. 338 (p. 97): also cross-referenced in ARSIE 1889 No. 24, SII IV No. 253, and S. Rajasekhara 1992 No. 5')],
    review,
  },
]

// Source: "Inscriptions of Koppal District" - Inscriptions of Karnataka Vol. III,
// Vijayanagara Research Centre series (Directorate of Archaeology and Museums, Mysore, 1998),
// eds. Channabasappa S. Patil and Vinoda C. Patil.
const SRC_KOPPAL_VOL3 = 'src-ia-karnataka-archaeology-damh-inscriptionsofko0000chan-vol-iii'

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-koppal-vol3-no335-butuga-ii-land-restoration',
    name: n('Butuga II land-assessment restoration record at Kopana (939)', 'ಕೊಪಣದಲ್ಲಿ ಬೂತುಗ IIನ ಭೂಮಿ ಮೌಲ್ಯಮಾಪನ ಪುನಃಸ್ಥಾಪನಾ ಶಾಸನ (939)'),
    date: d(939, 939, 'year'),
    placeId: 'place-koppal',
    polityId: 'polity-western-ganga',
    districtAuditId: 'audit-koppal',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as No. 335, on a slab near the Gaddeppa-matha: dated in the reign of the Rashtrakuta overlord Akalavarsha Krishna III (Saka 8.., Vikari, Pausha punnami = 29 December 939), partly damaged. Records that the Ganga feudatory Butuga (Bituga) Permanadi, then governing Gangavadi-96000, Purigere-300 and Belvola-300 under Krishna III, restored the land assessment in Belvola-300, Masavadi-140, Kukkanir-30 and Kelavadi-300 with royal approval, on the occasion of his visit to the holy place of Kopana (Koppal).', 'ಸಂಖ್ಯೆ 335ರಂತೆ ಪಟ್ಟಿಗತ, ಗಡ್ಡೆಪ್ಪ-ಮಠದ ಬಳಿಯ ಶಿಲಾಫಲಕದ ಮೇಲೆ: ರಾಷ್ಟ್ರಕೂಟ ಅಧಿಪತಿ ಅಕಾಲವರ್ಷ ಕೃಷ್ಣ IIIನ ಆಳ್ವಿಕೆಯಲ್ಲಿ ದಿನಾಂಕಿತ (ಶಕ 8.., ವಿಕಾರಿ, ಪೌಷ ಹುಣ್ಣಿಮೆ = 29 ಡಿಸೆಂಬರ್ 939), ಭಾಗಶಃ ಹಾನಿಗೊಂಡಿದೆ. ಗಂಗ ಅಧೀನ ಬೂತುಗ (ಬಿಟುಗ) ಪೆರ್ಮಾನಡಿ, ಆಗ ಕೃಷ್ಣ IIIನ ಅಡಿಯಲ್ಲಿ ಗಂಗವಾಡಿ-96000, ಪುರಿಗೆರೆ-300 ಮತ್ತು ಬೆಳ್ವೊಲ-300 ಆಳುತ್ತಿದ್ದು, ಕೊಪಣ (ಕೊಪ್ಪಳ) ಪುಣ್ಯಕ್ಷೇತ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿದ ಸಂದರ್ಭದಲ್ಲಿ ರಾಜಾನುಮತಿಯೊಂದಿಗೆ ಬೆಳ್ವೊಲ-300, ಮಾಸವಾಡಿ-140, ಕುಕ್ಕನೂರು-30 ಮತ್ತು ಕೆಲವಾಡಿ-300ರಲ್ಲಿ ಭೂಮಿ ಮೌಲ್ಯಮಾಪನವನ್ನು ಪುನಃಸ್ಥಾಪಿಸಿದನೆಂದು ದಾಖಲಿಸುತ್ತದೆ.'),
    citations: [c(SRC_KOPPAL_VOL3, 'No. 335 (p. 100): also cross-referenced in ARIE 1955-56 No. B 209')],
    review,
  },
  {
    id: 'inscription-karch-koppal-vol3-no364-marasimha-ii-copper-plates',
    name: n('Marasimha II copper-plate grant of Addavurage (968)', 'ಮಾರಸಿಂಹ IIನ ಅಡ್ಡವೂರಗೆ ತಾಮ್ರಶಾಸನ ಅನುದಾನ (968)'),
    date: d(968, 968, 'year'),
    placeId: 'place-koppal',
    polityId: 'polity-western-ganga',
    districtAuditId: 'audit-koppal',
    languages: ['Sanskrit', 'Kannada'],
    scripts: ['Nagari', 'Kannada'],
    description: n('Catalogued as No. 364: a Sanskrit/Kannada/Nagari copper-plate charter (Saka 890, Vibhava, Uttarayana-samkranti = 968 CE), now held at the Kannada Research Institute, Karnatak University, Dharwad. Records that Kundanasami, elder sister of the Western Ganga king Marasimha II, gifted the village Addavurage in Dhavala-vishaya to the brahmana Kolaparya-bhatta; the king is described as ruling Ganga-kandarppadhavala-vishaya and Gangapadi-96000. The charter names the drafting officer (Gangappa) and engraver (Kannuga).', 'ಸಂಖ್ಯೆ 364ರಂತೆ ಪಟ್ಟಿಗತ: ಸಂಸ್ಕೃತ/ಕನ್ನಡ/ನಾಗರಿ ತಾಮ್ರಶಾಸನ (ಶಕ 890, ವಿಭವ, ಉತ್ತರಾಯಣ-ಸಂಕ್ರಾಂತಿ = 968), ಈಗ ಧಾರವಾಡದ ಕರ್ನಾಟಕ ವಿಶ್ವವಿದ್ಯಾಲಯದ ಕನ್ನಡ ಸಂಶೋಧನಾ ಸಂಸ್ಥೆಯಲ್ಲಿದೆ. ಪಶ್ಚಿಮ ಗಂಗ ಅರಸ ಮಾರಸಿಂಹ IIನ ಹಿರಿಯ ಸಹೋದರಿ ಕುಂದನಸ್ವಾಮಿ, ಧವಳ-ವಿಷಯದ ಅಡ್ಡವೂರಗೆ ಗ್ರಾಮವನ್ನು ಬ್ರಾಹ್ಮಣ ಕೋಲಪರ್ಯ-ಭಟ್ಟನಿಗೆ ದಾನ ಮಾಡಿದಳೆಂದು ದಾಖಲಿಸುತ್ತದೆ; ರಾಜನನ್ನು ಗಂಗ-ಕಂದರ್ಪ್ಪಧವಳ-ವಿಷಯ ಮತ್ತು ಗಂಗಪಾಡಿ-96000 ಆಳುವವನೆಂದು ವಿವರಿಸಲಾಗಿದೆ. ಶಾಸನ ಬರೆದ ಅಧಿಕಾರಿ (ಗಂಗಪ್ಪ) ಮತ್ತು ಕೆತ್ತಿದವನ (ಕಣ್ಣುಗ) ಹೆಸರುಗಳಿವೆ.'),
    citations: [c(SRC_KOPPAL_VOL3, 'No. 364: also cross-referenced in ARIE 1969-70 No. A 5 and K.V. Ramesh, Inscriptions of the Western Gangas (1984), pp. 494-513')],
    review,
  },
  {
    id: 'inscription-karch-koppal-vol3-no232-padmabbarasi-nisidhi',
    name: n('Nisidhi memorial of Queen Padmabbarasi at Kopana (973)', 'ಕೊಪಣದಲ್ಲಿ ರಾಣಿ ಪದ್ಮಬ್ಬರಸಿಯ ನಿಷಿಧಿ ಸ್ಮಾರಕ (973)'),
    date: d(973, 973, 'year'),
    placeId: 'place-koppal',
    polityId: 'polity-western-ganga',
    districtAuditId: 'audit-koppal',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as No. 232, a Jain nisidhi (memorial stone) inscription dated Saka 894, Srimukha, Pushya su. 5 (3 December 973 CE). Records that Padmabbarasi, queen of the Western Ganga king Ganga-Gangeya Permanadi Butuga (Butuga II), came to Kupana (Koppal), undertook diksha (Jain monastic initiation) and died on the recorded date -- part of a cluster of nisidhi memorials at the same site attesting to Koppal as a significant Jain centre under Ganga patronage.', 'ಸಂಖ್ಯೆ 232ರಂತೆ ಪಟ್ಟಿಗತ, ಶಕ 894, ಶ್ರೀಮುಖ, ಪುಷ್ಯ ಶು. 5 (3 ಡಿಸೆಂಬರ್ 973) ದಿನಾಂಕಿತ ಜೈನ ನಿಷಿಧಿ (ಸ್ಮಾರಕ ಶಿಲೆ) ಶಾಸನ. ಪಶ್ಚಿಮ ಗಂಗ ಅರಸ ಗಂಗ-ಗಂಗೇಯ ಪೆರ್ಮಾನಡಿ ಬೂತುಗ (ಬೂತುಗ II)ನ ರಾಣಿ ಪದ್ಮಬ್ಬರಸಿ ಕುಪಣ (ಕೊಪ್ಪಳ)ಕ್ಕೆ ಬಂದು ದೀಕ್ಷೆ ಪಡೆದು ಈ ದಿನಾಂಕದಂದು ಮರಣ ಹೊಂದಿದಳೆಂದು ದಾಖಲಿಸುತ್ತದೆ -- ಗಂಗ ಪೋಷಣೆಯಡಿ ಕೊಪ್ಪಳ ಒಂದು ಮಹತ್ವದ ಜೈನ ಕೇಂದ್ರವಾಗಿತ್ತೆಂದು ಸಾಕ್ಷಿಯಾಗುವ ಅದೇ ತಾಣದ ನಿಷಿಧಿ ಸ್ಮಾರಕಗಳ ಸಮೂಹದ ಭಾಗ.'),
    citations: [c(SRC_KOPPAL_VOL3, 'No. 232: cross-referenced in KS (Koppal Shasanagalu?) Nos. 40, 42')],
    review,
  },
  {
    id: 'inscription-karch-koppal-vol3-no338-itagi-mahadeva-foundation',
    name: n('Itagi Mahadeva temple foundation inscription of Mahadeva Dandanayaka (1112)', 'ಇಟಗಿ ಮಹಾದೇವ ದೇವಾಲಯ ಸ್ಥಾಪನಾ ಶಾಸನ, ಮಹಾದೇವ ದಂಡನಾಯಕ (1112)'),
    date: d(1112, 1112, 'year'),
    placeId: 'place-itagi-mahadeva',
    polityId: 'polity-kalyani-chalukya',
    districtAuditId: 'audit-koppal',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as No. 338, on a slab in the Sarasvati-matha south of the Mahadeva temple: dated Chalukya-Vikrama year 37 (7 September 1112 CE, Saturday), in the reign of Kalyani Chalukya Vikramaditya VI. Gives the Chalukya genealogy and that of Mahapradhana Dandanayaka Mahadeva, whose birthplace was the agrahara Ittage (Itagi). Records that Mahadeva built the Mahadeva temple -- called "devalaya-chakravarti" (emperor among temples) -- along with a Murti-Narayana temple for his father, a Chandalesvara temple for his mother Chandrikadevi, a Bhairava temple as his tutelary shrine, a Sarasvati matha, and the Devi-gere tank, with a royal grant of Bennekallu village to the temple.', 'ಸಂಖ್ಯೆ 338ರಂತೆ ಪಟ್ಟಿಗತ, ಮಹಾದೇವ ದೇವಾಲಯದ ದಕ್ಷಿಣಕ್ಕಿರುವ ಸರಸ್ವತಿ-ಮಠದ ಶಿಲಾಫಲಕದ ಮೇಲೆ: ಚಾಲುಕ್ಯ-ವಿಕ್ರಮ ವರ್ಷ 37 (7 ಸೆಪ್ಟೆಂಬರ್ 1112, ಶನಿವಾರ) ದಿನಾಂಕಿತ, ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯ ವಿಕ್ರಮಾದಿತ್ಯ VIನ ಆಳ್ವಿಕೆಯಲ್ಲಿ. ಚಾಲುಕ್ಯ ವಂಶಾವಳಿ ಮತ್ತು ಮಹಾಪ್ರಧಾನ ದಂಡನಾಯಕ ಮಹಾದೇವನ ವಂಶಾವಳಿಯನ್ನು ನೀಡುತ್ತದೆ, ಇವನ ಜನ್ಮಸ್ಥಳ ಇಟ್ಟಗೆ (ಇಟಗಿ) ಅಗ್ರಹಾರ. ಮಹಾದೇವ "ದೇವಾಲಯ-ಚಕ್ರವರ್ತಿ" ಎಂದು ಕರೆಯಲ್ಪಡುವ ಮಹಾದೇವ ದೇವಾಲಯವನ್ನು, ಜೊತೆಗೆ ತಂದೆಗಾಗಿ ಮೂರ್ತಿ-ನಾರಾಯಣ ದೇವಾಲಯ, ತಾಯಿ ಚಂದ್ರಿಕಾದೇವಿಗಾಗಿ ಚಂದಲೇಶ್ವರ ದೇವಾಲಯ, ತನ್ನ ಇಷ್ಟದೇವತೆಗಾಗಿ ಭೈರವ ದೇವಾಲಯ, ಸರಸ್ವತಿ ಮಠ ಮತ್ತು ದೇವಿ-ಗೆರೆ ಕೆರೆಯನ್ನು ನಿರ್ಮಿಸಿದನೆಂದು, ರಾಜನು ಬೆನ್ನೆಕಲ್ಲು ಗ್ರಾಮವನ್ನು ದೇವಾಲಯಕ್ಕೆ ಅನುದಾನ ನೀಡಿದನೆಂದೂ ದಾಖಲಿಸುತ್ತದೆ.'),
    citations: [c(SRC_KOPPAL_VOL3, 'No. 338 (p. 101): also published in Epigraphia Indica Vol. XIII, pp. 36-58')],
    review,
  },
  {
    id: 'inscription-karch-koppal-vol3-no340-itagi-portrait-sculptures',
    name: n('Itagi Mahadeva temple portrait-gallery genealogical labels (12th century)', 'ಇಟಗಿ ಮಹಾದೇವ ದೇವಾಲಯ ಭಾವಚಿತ್ರ ಶಿಲ್ಪ ವಂಶಾವಳಿ ಲೇಖಗಳು (12ನೇ ಶತಮಾನ)'),
    date: d(1100, 1199, 'century'),
    placeId: 'place-itagi-mahadeva',
    polityId: 'polity-kalyani-chalukya',
    districtAuditId: 'audit-koppal',
    languages: ['Sanskrit', 'Kannada'],
    scripts: ['Nagari', 'Kannada'],
    description: n('Catalogued as No. 340, below the portrait sculptures in the central ceiling of the Mahadeva temple\'s mahamandapa: a Sanskrit/Kannada label inscription naming the family of the temple\'s founder, Dandanayaka Mahadeva -- his father\'s younger brother Kolimayya-Nayaka, father\'s elder brother Dechimayya-Nayaka, great-grandfather Demayya-Nayaka, grandfather Vasudevayya-Nayaka and father Naranayya-Nayaka -- providing a rare labelled portrait gallery tied directly to the temple\'s foundation inscription (No. 338).', 'ಸಂಖ್ಯೆ 340ರಂತೆ ಪಟ್ಟಿಗತ, ಮಹಾದೇವ ದೇವಾಲಯದ ಮಹಾಮಂಟಪದ ಮಧ್ಯ ಚಾವಣಿಯಲ್ಲಿನ ಭಾವಚಿತ್ರ ಶಿಲ್ಪಗಳ ಕೆಳಗೆ: ದೇವಾಲಯ ಸ್ಥಾಪಕ ದಂಡನಾಯಕ ಮಹಾದೇವನ ಕುಟುಂಬವನ್ನು ಹೆಸರಿಸುವ ಸಂಸ್ಕೃತ/ಕನ್ನಡ ಲೇಖ ಶಾಸನ -- ತಂದೆಯ ಕಿರಿಯ ಸಹೋದರ ಕೋಳಿಮಯ್ಯ-ನಾಯಕ, ತಂದೆಯ ಹಿರಿಯ ಸಹೋದರ ದೇಚಿಮಯ್ಯ-ನಾಯಕ, ಮುತ್ತಜ್ಜ ದೇಮಯ್ಯ-ನಾಯಕ, ಅಜ್ಜ ವಾಸುದೇವಯ್ಯ-ನಾಯಕ ಮತ್ತು ತಂದೆ ನಾರಣಯ್ಯ-ನಾಯಕ -- ದೇವಾಲಯದ ಸ್ಥಾಪನಾ ಶಾಸನದೊಂದಿಗೆ (ಸಂಖ್ಯೆ 338) ನೇರವಾಗಿ ಸಂಬಂಧಿಸಿದ ಅಪರೂಪದ ಹೆಸರಿಸಿದ ಭಾವಚಿತ್ರ ಗ್ಯಾಲರಿಯನ್ನು ಒದಗಿಸುತ್ತದೆ.'),
    citations: [c(SRC_KOPPAL_VOL3, 'No. 340: also published in C.S. Patil (1987) "Portrait Sculptures in Mahadeva Temple at Ittagi" and Shrinivas Ritti (1990), Indian History and Epigraphy: Dr. G.S. Gai Felicitation Volume, p. 187')],
    review,
  },
)

// Source: "Supplementary Inscriptions in the Mysore and Mandya Districts" - Epigraphia Carnatica
// Vol. XIV (Mysore Archaeological Survey, 1943), published by Dr. M.H. Krishna. These are copper-plate
// royal grants: the opening Sanskrit invocation and dynastic genealogy are legible in the OCR sample,
// but the specific grant terms (village boundaries, donee, purpose) further down each dense Sanskrit
// plate text are not yet reliably transcribed and need a qualified reviewer, not just an item-level
// identification.
const SRC_EC_VOL14 = 'src-ia-karnataka-archaeology-damh-epigraphiacarnat0000unse-v14'

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-ec14-no126-immadi-devaraya-kadasir-plates',
    name: n('Kadasir copper-plate grant of Immadi Devaraya (1447)', 'ಇಮ್ಮಡಿ ದೇವರಾಯನ ಕಡಸೂರು ತಾಮ್ರಶಾಸನ (1447)'),
    date: d(1447, 1447, 'year'),
    placeId: 'place-mysuru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-mysuru',
    languages: ['Sanskrit'],
    scripts: ['Nagari'],
    description: n('Catalogued as No. 126: a Nagari-script copper-plate grant dated Saka 1369 (1447 CE), in the possession of the archaka Gundayya of the same temple. The opening Sanskrit invocation and dynastic genealogy (Sangama - Bukka - Harihareshvara - Pratapadevaraya) are legible in the OCR sample and confirm this as a Vijayanagara Sangama-dynasty grant issued in the name of Immadi Devaraya; the specific village, boundaries and donee named later in the plate text require a qualified Sanskrit/epigraphy reviewer to transcribe reliably from the scan.', 'ಸಂಖ್ಯೆ 126ರಂತೆ ಪಟ್ಟಿಗತ: ಶಕ 1369 (1447) ದಿನಾಂಕಿತ ನಾಗರಿ-ಲಿಪಿಯ ತಾಮ್ರಶಾಸನ, ಅದೇ ದೇವಾಲಯದ ಅರ್ಚಕ ಗುಂಡಯ್ಯನ ಬಳಿ ಇದೆ. ಆರಂಭಿಕ ಸಂಸ್ಕೃತ ಮಂಗಳಾಚರಣೆ ಮತ್ತು ವಂಶಾವಳಿ (ಸಂಗಮ - ಬುಕ್ಕ - ಹರಿಹರೇಶ್ವರ - ಪ್ರತಾಪದೇವರಾಯ) OCR ಮಾದರಿಯಲ್ಲಿ ಓದಬಲ್ಲಂತಿದ್ದು ಇದು ಇಮ್ಮಡಿ ದೇವರಾಯನ ಹೆಸರಿನಲ್ಲಿ ನೀಡಲಾದ ವಿಜಯನಗರ ಸಂಗಮ ವಂಶದ ಅನುದಾನವೆಂದು ಖಚಿತಪಡಿಸುತ್ತದೆ; ಫಲಕ ಪಠ್ಯದ ನಂತರದ ಭಾಗದಲ್ಲಿನ ನಿರ್ದಿಷ್ಟ ಗ್ರಾಮ, ಎಲ್ಲೆಗಳು ಮತ್ತು ದಾನಿತನನ್ನು ವಿಶ್ವಾಸಾರ್ಹವಾಗಿ ಲಿಪ್ಯಂತರಿಸಲು ಅರ್ಹ ಸಂಸ್ಕೃತ/ಶಾಸನಶಾಸ್ತ್ರ ಪರಿಶೀಲಕರು ಬೇಕು.'),
    citations: [c(SRC_EC_VOL14, 'No. 126 (p. 24): item identification and genealogical opening only; full grant terms pending transcription review')],
    review,
  },
  {
    id: 'inscription-karch-ec14-no128-harihara-triyambakapura-plates',
    name: n('Triyambakapura copper-plate grant of Harihara (1510)', 'ಹರಿಹರನ ತ್ರಿಯಂಬಕಪುರ ತಾಮ್ರಶಾಸನ (1510)'),
    date: d(1510, 1510, 'year'),
    placeId: 'place-mysuru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-mysuru',
    languages: ['Sanskrit'],
    scripts: ['Nagari'],
    description: n('Catalogued as No. 128: a 3-plate Nagari-script grant dated Saka 1432 (1510 CE), in the possession of the same archaka Gundayya as No. 126. Item identification, plate count and date are confirmed from the OCR sample; specific grant terms require translation review.', 'ಸಂಖ್ಯೆ 128ರಂತೆ ಪಟ್ಟಿಗತ: ಶಕ 1432 (1510) ದಿನಾಂಕಿತ 3-ಫಲಕಗಳ ನಾಗರಿ-ಲಿಪಿಯ ಅನುದಾನ, ಸಂಖ್ಯೆ 126ರಂತೆ ಅದೇ ಅರ್ಚಕ ಗುಂಡಯ್ಯನ ಬಳಿ. ವಸ್ತು ಗುರುತು, ಫಲಕ ಸಂಖ್ಯೆ ಮತ್ತು ದಿನಾಂಕ OCR ಮಾದರಿಯಿಂದ ಖಚಿತಪಡಿಸಲಾಗಿದೆ; ನಿರ್ದಿಷ್ಟ ಅನುದಾನ ಷರತ್ತುಗಳಿಗೆ ಅನುವಾದ ಪರಿಶೀಲನೆ ಬೇಕು.'),
    citations: [c(SRC_EC_VOL14, 'No. 128 (p. 25): item identification only; full grant terms pending transcription review')],
    review,
  },
  {
    id: 'inscription-karch-ec14-no129-krishnaraya-kedihalli-plates',
    name: n('Kedihalli copper-plate grant of Krishnadevaraya (1526)', 'ಕೃಷ್ಣದೇವರಾಯನ ಕೆಡಿಹಳ್ಳಿ ತಾಮ್ರಶಾಸನ (1526)'),
    date: d(1526, 1526, 'year'),
    placeId: 'place-mysuru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-mysuru',
    languages: ['Sanskrit'],
    scripts: ['Nagari'],
    description: n('Catalogued as No. 129: a 3-plate Nagari-script grant dated Saka 1448 (1526 CE), attributed to "Krishnaraya" and in the possession of the same archaka Gundayya. The date falls within Krishnadevaraya\'s reign (1509-1529), making this plausibly one of his grants, though independent confirmation against the full plate text (not yet transcribed from OCR) is needed before treating the attribution as settled.', 'ಸಂಖ್ಯೆ 129ರಂತೆ ಪಟ್ಟಿಗತ: ಶಕ 1448 (1526) ದಿನಾಂಕಿತ 3-ಫಲಕಗಳ ನಾಗರಿ-ಲಿಪಿಯ ಅನುದಾನ, "ಕೃಷ್ಣರಾಯ"ಗೆ ಆರೋಪಿತ, ಅದೇ ಅರ್ಚಕ ಗುಂಡಯ್ಯನ ಬಳಿ. ದಿನಾಂಕ ಕೃಷ್ಣದೇವರಾಯನ ಆಳ್ವಿಕೆಯೊಳಗೆ (1509-1529) ಬರುತ್ತದೆ, ಇದು ಸಂಭವನೀಯವಾಗಿ ಅವನ ಅನುದಾನಗಳಲ್ಲಿ ಒಂದಾಗಿರಬಹುದು, ಆದರೂ ಪೂರ್ಣ ಫಲಕ ಪಠ್ಯದ (OCRನಿಂದ ಇನ್ನೂ ಲಿಪ್ಯಂತರಿಸಿಲ್ಲ) ವಿರುದ್ಧ ಸ್ವತಂತ್ರ ದೃಢೀಕರಣ ಬೇಕು.'),
    citations: [c(SRC_EC_VOL14, 'No. 129 (p. 27): item identification only; attribution to Krishnadevaraya plausible from regnal dates but not independently confirmed')],
    review,
  },
  {
    id: 'inscription-karch-ec14-no155-chamaraja-wodeyar-honnalagere-plates',
    name: n('Honnalagere copper-plate grant of Chamaraja Wodeyar (1622)', 'ಚಾಮರಾಜ ಒಡೆಯರ್ ಹೊನ್ನಲಗೆರೆ ತಾಮ್ರಶಾಸನ (1622)'),
    date: d(1622, 1622, 'year'),
    placeId: 'place-mysuru',
    polityId: 'polity-mysore',
    districtAuditId: 'audit-mysuru',
    languages: ['Sanskrit'],
    scripts: ['Nagari'],
    description: n('Catalogued as No. 155: a 3-plate Nagara-script grant dated Saka 1544 (1622 CE), by a Mysore Wodeyar king recorded as "Chamaraja Vadeyar," in the possession of Pandit Anandalvar at Bangalore. Which of the several Chamaraja Wodeyars held the throne in 1622 (early Mysore Kingdom, pre-Srirangapatna-capital period) is not yet cross-checked against the reign chronology in this atlas; item identification and date are confirmed, full grant terms are not.', 'ಸಂಖ್ಯೆ 155ರಂತೆ ಪಟ್ಟಿಗತ: ಶಕ 1544 (1622) ದಿನಾಂಕಿತ 3-ಫಲಕಗಳ ನಾಗರ-ಲಿಪಿಯ ಅನುದಾನ, "ಚಾಮರಾಜ ವಡೆಯರ್" ಎಂದು ದಾಖಲಾದ ಮೈಸೂರು ಒಡೆಯರ್ ಅರಸನಿಂದ, ಬೆಂಗಳೂರಿನ ಪಂಡಿತ ಆನಂದಾಳ್ವಾರ್ ಬಳಿ ಇದೆ. 1622ರಲ್ಲಿ (ಶ್ರೀರಂಗಪಟ್ಟಣ-ರಾಜಧಾನಿಗೂ ಮೊದಲಿನ ಆರಂಭಿಕ ಮೈಸೂರು ರಾಜ್ಯ) ಸಿಂಹಾಸನದಲ್ಲಿದ್ದ ಹಲವಾರು ಚಾಮರಾಜ ಒಡೆಯರ್‌ಗಳಲ್ಲಿ ಯಾರೆಂಬುದನ್ನು ಈ ಭೂಪಟದ ಆಳ್ವಿಕೆ ಕಾಲಾನುಕ್ರಮದೊಂದಿಗೆ ಇನ್ನೂ ಪರಿಶೀಲಿಸಿಲ್ಲ; ವಸ್ತು ಗುರುತು ಮತ್ತು ದಿನಾಂಕ ಖಚಿತವಾಗಿದೆ, ಪೂರ್ಣ ಅನುದಾನ ಷರತ್ತುಗಳಲ್ಲ.'),
    citations: [c(SRC_EC_VOL14, 'No. 155 (p. 88): item identification only; specific Chamaraja Wodeyar not yet cross-checked')],
    review,
  },
  {
    id: 'inscription-karch-ec14-no115-chikkadevaraja-devanagara-plates',
    name: n('Devanagara Agrahara copper-plate grant of Chikkadevaraja Wodeyar (1673)', 'ಚಿಕ್ಕದೇವರಾಜ ಒಡೆಯರ್ ದೇವನಗರ ಅಗ್ರಹಾರ ತಾಮ್ರಶಾಸನ (1673)'),
    date: d(1673, 1673, 'year'),
    placeId: 'place-mysuru',
    polityId: 'polity-mysore',
    districtAuditId: 'audit-mysuru',
    languages: ['Sanskrit', 'Kannada'],
    scripts: ['Nagari', 'Kannada'],
    description: n('Catalogued as No. 115: a 10-plate grant (Varaha seal) dated Saka 1595 (1673 CE), in the possession of Gundalapandit Lakshmanacharyar, establishing the Devanagara agrahara under Chikkadevaraja Wodeyar (r. 1673-1704). The opening Sanskrit invocation traces a full mythic-to-historical Yadu-lineage genealogy of the Mysore Wodeyars down through Bettada Chamaraja to the grant; specific village boundaries and the agrahara\'s Brahmin-settlement terms further in the plate text still require translation review.', 'ಸಂಖ್ಯೆ 115ರಂತೆ ಪಟ್ಟಿಗತ: ಶಕ 1595 (1673) ದಿನಾಂಕಿತ 10-ಫಲಕಗಳ ಅನುದಾನ (ವರಾಹ ಮುದ್ರೆ), ಗುಂಡಲಪಂಡಿತ ಲಕ್ಷ್ಮಣಾಚಾರ್ಯರ ಬಳಿ ಇದೆ, ಚಿಕ್ಕದೇವರಾಜ ಒಡೆಯರ್ (ಆ. 1673-1704) ಕಾಲದಲ್ಲಿ ದೇವನಗರ ಅಗ್ರಹಾರವನ್ನು ಸ್ಥಾಪಿಸುತ್ತದೆ. ಆರಂಭಿಕ ಸಂಸ್ಕೃತ ಮಂಗಳಾಚರಣೆ ಮೈಸೂರು ಒಡೆಯರ್‌ಗಳ ಪೌರಾಣಿಕ-ಚಾರಿತ್ರಿಕ ಯದು-ವಂಶಾವಳಿಯನ್ನು ಬೆಟ್ಟದ ಚಾಮರಾಜನಿಂದ ಈ ಅನುದಾನದವರೆಗೆ ಗುರುತಿಸುತ್ತದೆ; ಫಲಕ ಪಠ್ಯದ ಮುಂದಿನ ಭಾಗದಲ್ಲಿನ ನಿರ್ದಿಷ್ಟ ಗ್ರಾಮ ಎಲ್ಲೆಗಳು ಮತ್ತು ಅಗ್ರಹಾರದ ಬ್ರಾಹ್ಮಣ-ವಸತಿ ಷರತ್ತುಗಳಿಗೆ ಇನ್ನೂ ಅನುವಾದ ಪರಿಶೀಲನೆ ಬೇಕು.'),
    citations: [c(SRC_EC_VOL14, 'No. 115 (p. 103): item identification and dynastic genealogy confirmed; full grant terms pending transcription review')],
    review,
  },
)

// Source: "Vijayanagara Inscriptions" Volume II (Directorate of Archaeology and Museums, 1986),
// eds. D.R. Bhat (organised by district and taluk, catalogue numbers prefixed "KN").
const SRC_VIJAYANAGARA_INSC_VOL2 = 'src-ia-karnataka-archaeology-damh-vijayanagarainsc0000drbr-vol-ii'

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-vinsc2-kn428-ambale-narasimha-spurious',
    name: n('Ambale Narasimha grant record flagged as likely spurious (KN 428)', 'ಅಂಬಲೆ ನರಸಿಂಹ ಅನುದಾನ ದಾಖಲೆ, ಕೃತಕವೆಂದು ಗುರುತಿಸಲಾಗಿದೆ (KN 428)'),
    date: d(1404, 1584, 'range'),
    placeId: 'place-chikkamagaluru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-chikkamagaluru',
    languages: ['Sanskrit'],
    scripts: ['Nagari'],
    description: n('Catalogued as KN 428 (Ambale, Chikkamagalur taluk; two copper plates in the possession of Gopalakrishna-bhatta): records that an Aravidu king Ranga-bhupala installed his son Narasimha on the throne, who then visited Belur and made grants there. The editors flag this as most likely a spurious record: the given date (Saka 1327 = 1404 CE) is far too early for any known Aravidu ruler of this name, and no son of Sriranga I named Narasimha is otherwise attested; the editors suggest the intended date may be Saka 1506 (1584 CE) or Saka 1527 (1527... recte c. 1605), but Sriranga I is independently known to have had no issue at all. Recorded here as a documented case of a doubtful/forged inscription, not a verified royal act.', 'KN 428ರಂತೆ ಪಟ್ಟಿಗತ (ಅಂಬಲೆ, ಚಿಕ್ಕಮಗಳೂರು ತಾಲ್ಲೂಕು; ಗೋಪಾಲಕೃಷ್ಣ-ಭಟ್ಟರ ಬಳಿ ಎರಡು ತಾಮ್ರಫಲಕಗಳು): ಅರವಿಡು ಅರಸ ರಂಗ-ಭೂಪಾಲ ತನ್ನ ಮಗ ನರಸಿಂಹನನ್ನು ಸಿಂಹಾಸನದಲ್ಲಿ ಕೂರಿಸಿದನೆಂದೂ, ಅವನು ಬೇಲೂರಿಗೆ ಭೇಟಿ ನೀಡಿ ಅಲ್ಲಿ ಅನುದಾನ ನೀಡಿದನೆಂದೂ ದಾಖಲಿಸುತ್ತದೆ. ಸಂಪಾದಕರು ಇದನ್ನು ಬಹುಶಃ ಕೃತಕ ದಾಖಲೆಯೆಂದು ಗುರುತಿಸುತ್ತಾರೆ: ನೀಡಲಾದ ದಿನಾಂಕ (ಶಕ 1327 = 1404) ಈ ಹೆಸರಿನ ಯಾವುದೇ ತಿಳಿದ ಅರವಿಡು ಅರಸನಿಗೆ ಬಹಳ ಮುಂಚಿನದು, ಮತ್ತು ಶ್ರೀರಂಗ Iಗೆ ನರಸಿಂಹ ಎಂಬ ಮಗ ಇದ್ದುದು ಬೇರೆಲ್ಲಿಯೂ ದೃಢಪಟ್ಟಿಲ್ಲ; ಸಂಪಾದಕರು ಉದ್ದೇಶಿತ ದಿನಾಂಕ ಶಕ 1506 (1584) ಅಥವಾ ಶಕ 1527 ಆಗಿರಬಹುದೆಂದು ಸೂಚಿಸುತ್ತಾರೆ, ಆದರೆ ಶ್ರೀರಂಗ Iಗೆ ಮಕ್ಕಳೇ ಇರಲಿಲ್ಲವೆಂದು ಸ್ವತಂತ್ರವಾಗಿ ತಿಳಿದಿದೆ. ಇಲ್ಲಿ ಒಂದು ದಾಖಲಿತ ಸಂಶಯಾಸ್ಪದ/ಕೃತಕ ಶಾಸನ ಪ್ರಕರಣವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ, ಪರಿಶೀಲಿತ ರಾಜಕೀಯ ಕಾರ್ಯವಲ್ಲ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL2, 'KN 428 (Ambale, Chikkamagalur taluk; MAR 1930 No. 4): editors\' own dating analysis concludes the record is most likely spurious')],
    review,
  },
  {
    id: 'inscription-karch-vinsc2-kn432-achyutadevaraya-khandya-grant',
    name: n('Achyutadevaraya land grant at Khandya, ruling "from Hampe Hastinavati" (1539)', 'ಖಂಡ್ಯದಲ್ಲಿ ಅಚ್ಯುತದೇವರಾಯನ ಭೂಮಿ ಅನುದಾನ, "ಹಂಪೆ ಹಸ್ತಿನಾವತಿ"ಯಿಂದ ಆಳ್ವಿಕೆ (1539)'),
    date: d(1539, 1539, 'year'),
    placeId: 'place-chikkamagaluru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-chikkamagaluru',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as KN 432 (on a stone south of the main entrance in the Markandeshvara temple prakara, Khandya): dated Saka 1461, Vilambi, Phalguna su. 14 (3 January 1539, Friday), attributed to Tuluva Achyutadevaraya, styled as "ruling from Hampe Hastinavati" (Hampi). Records a grant of two villages, Hunasevalli and Kategara, yielding 280 and 450 khandugas of rice respectively, to the gods Janardana and Markandeshvara of Khandya, assigned as an amara-magani to Raghupatiraja-vodeya son of Mallaraja-vodeya.', 'KN 432ರಂತೆ ಪಟ್ಟಿಗತ (ಖಂಡ್ಯದ ಮಾರ್ಕಂಡೇಶ್ವರ ದೇವಾಲಯ ಪ್ರಾಕಾರದ ಮುಖ್ಯ ಪ್ರವೇಶದ ದಕ್ಷಿಣಕ್ಕಿರುವ ಶಿಲೆಯ ಮೇಲೆ): ಶಕ 1461, ವಿಲಂಬಿ, ಫಾಲ್ಗುಣ ಶು. 14 (3 ಜನವರಿ 1539, ಶುಕ್ರವಾರ) ದಿನಾಂಕಿತ, ತುಳುವ ಅಚ್ಯುತದೇವರಾಯನಿಗೆ ಆರೋಪಿತ, "ಹಂಪೆ ಹಸ್ತಿನಾವತಿ" (ಹಂಪಿ) ಯಿಂದ ಆಳ್ವಿಕೆ ನಡೆಸುತ್ತಿರುವನೆಂದು ವಿವರಿಸಲಾಗಿದೆ. ಖಂಡ್ಯದ ಜನಾರ್ದನ ಮತ್ತು ಮಾರ್ಕಂಡೇಶ್ವರ ದೇವರುಗಳಿಗೆ, ಕ್ರಮವಾಗಿ 280 ಮತ್ತು 450 ಖಂಡುಗ ಅಕ್ಕಿ ಇಳುವರಿಯ ಹುಣಸೆವಳ್ಳಿ ಮತ್ತು ಕಟೆಗಾರ ಎಂಬ ಎರಡು ಗ್ರಾಮಗಳ ಅನುದಾನವನ್ನು, ಮಲ್ಲರಾಜ-ವೊಡೆಯನ ಮಗ ರಘುಪತಿರಾಜ-ವೊಡೆಯನಿಗೆ ಅಮರ-ಮಾಗಣಿಯಾಗಿ ನೀಡಿದ್ದನ್ನು ದಾಖಲಿಸುತ್ತದೆ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL2, 'KN 432 (Khandya, EC VI Cm.80)')],
    review,
  },
  {
    id: 'inscription-karch-vinsc2-kn433-venkatapati-khandya-grant',
    name: n('Aravidu Venkatapati grant at Khandya, still styled "from Hampe Hastinavati" (1587)', 'ಖಂಡ್ಯದಲ್ಲಿ ಅರವಿಡು ವೆಂಕಟಪತಿಯ ಅನುದಾನ, ಇನ್ನೂ "ಹಂಪೆ ಹಸ್ತಿನಾವತಿ"ಯಿಂದ ಎಂದು ವಿವರಿಸಲಾಗಿದೆ (1587)'),
    date: d(1587, 1587, 'year'),
    placeId: 'place-chikkamagaluru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-chikkamagaluru',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as KN 433, on another stone at the same Khandya site: dated Saka 1509, Sarvajitu, Bhadrapada su. 15, a recorded lunar eclipse (6 September 1587), attributed to Aravidu Venkatapati (I), still styled "ruling from Hampe Hastinavati" -- notable since this is more than two decades after the 1565 Battle of Talikota, showing the Aravidu successor state continuing to claim Hampi/Vijayanagara association in its formal royal style. Records a grant of 200 varahas from temple revenues of Janardana, Markandeshvara and Narasimha of Khandya for the talavarike (watch/guard duty), by Krishnappa-nayaka son of Venkatappa and grandson of Erakrishnappa-nayaka.', 'KN 433ರಂತೆ ಪಟ್ಟಿಗತ, ಅದೇ ಖಂಡ್ಯ ತಾಣದ ಇನ್ನೊಂದು ಶಿಲೆಯ ಮೇಲೆ: ಶಕ 1509, ಸರ್ವಜಿತು, ಭಾದ್ರಪದ ಶು. 15, ದಾಖಲಾದ ಚಂದ್ರಗ್ರಹಣ (6 ಸೆಪ್ಟೆಂಬರ್ 1587) ದಿನಾಂಕಿತ, ಅರವಿಡು ವೆಂಕಟಪತಿ (I)ಗೆ ಆರೋಪಿತ, ಇನ್ನೂ "ಹಂಪೆ ಹಸ್ತಿನಾವತಿಯಿಂದ ಆಳ್ವಿಕೆ" ಎಂದು ವಿವರಿಸಲಾಗಿದೆ -- 1565ರ ತಾಳಿಕೋಟೆ ಕದನದ ಎರಡು ದಶಕಗಳಿಗಿಂತ ಹೆಚ್ಚು ನಂತರವೂ ಅರವಿಡು ಉತ್ತರಾಧಿಕಾರಿ ರಾಜ್ಯ ತನ್ನ ಔಪಚಾರಿಕ ರಾಜ ಬಿರುದಿನಲ್ಲಿ ಹಂಪಿ/ವಿಜಯನಗರ ಸಂಬಂಧವನ್ನು ಮುಂದುವರಿಸಿದ್ದನ್ನು ತೋರಿಸುತ್ತದೆ ಎಂಬ ಕಾರಣಕ್ಕೆ ಗಮನಾರ್ಹ. ಖಂಡ್ಯದ ಜನಾರ್ದನ, ಮಾರ್ಕಂಡೇಶ್ವರ ಮತ್ತು ನರಸಿಂಹ ದೇವಾಲಯ ಆದಾಯದಿಂದ ತಳವಾರಿಕೆಗಾಗಿ (ಕಾವಲು ಕರ್ತವ್ಯ) 200 ವರಹ ಅನುದಾನವನ್ನು, ವೆಂಕಟಪ್ಪನ ಮಗ ಮತ್ತು ಎರಕೃಷ್ಣಪ್ಪ-ನಾಯಕನ ಮೊಮ್ಮಗ ಕೃಷ್ಣಪ್ಪ-ನಾಯಕನಿಂದ ನೀಡಲಾಗಿದೆ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL2, 'KN 433 (Khandya, EC VI Cm.79)')],
    review,
  },
  {
    id: 'inscription-karch-vinsc2-kn431-srirangaraya-iii-kalasapura-grant',
    name: n('Aravidu Srirangaraya III grant at Kalasapura (1663)', 'ಅರವಿಡು ಶ್ರೀರಂಗರಾಯ IIIನ ಕಳಸಾಪುರ ಅನುದಾನ (1663)'),
    date: d(1663, 1663, 'year'),
    placeId: 'place-chikkamagaluru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-chikkamagaluru',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as KN 431, on a stone at Kalasapura: dated Saka 1585, Sobhakrit, Ashvija (September-October 1663 CE), attributed to Aravidu Srirangaraya III -- among the last titular Vijayanagara emperors, nearly a century after Talikota. Records a grant of the village Kalasahalli in Kalasapura-sthala, for the car-festival services of the god Chellanarayana of Kalasapura, made by Ramanarajayadeva-maharaja after petitioning the king. A rare dated attestation of the reduced, still-functioning Aravidu court this late in its history.', 'KN 431ರಂತೆ ಪಟ್ಟಿಗತ, ಕಳಸಾಪುರದ ಒಂದು ಶಿಲೆಯ ಮೇಲೆ: ಶಕ 1585, ಶೋಭಕೃತ್, ಆಶ್ವಿಜ (ಸೆಪ್ಟೆಂಬರ್-ಅಕ್ಟೋಬರ್ 1663) ದಿನಾಂಕಿತ, ಅರವಿಡು ಶ್ರೀರಂಗರಾಯ IIIಗೆ ಆರೋಪಿತ -- ತಾಳಿಕೋಟೆಯ ಸುಮಾರು ಒಂದು ಶತಮಾನದ ನಂತರವೂ, ಕೊನೆಯ ಬಿರುದಿನ ವಿಜಯನಗರ ಚಕ್ರವರ್ತಿಗಳಲ್ಲಿ ಒಬ್ಬ. ಕಳಸಾಪುರ-ಸ್ಥಳದ ಕಳಸಹಳ್ಳಿ ಗ್ರಾಮದ ಅನುದಾನವನ್ನು, ಕಳಸಾಪುರದ ಚೆಲ್ಲನಾರಾಯಣ ದೇವರ ರಥೋತ್ಸವ ಸೇವೆಗಳಿಗಾಗಿ, ರಾಜನಿಗೆ ಮನವಿ ಸಲ್ಲಿಸಿದ ನಂತರ ರಾಮನರಾಜಯದೇವ-ಮಹಾರಾಜನಿಂದ ನೀಡಲಾಗಿದೆ. ಈ ತಡವಾದ ಹಂತದಲ್ಲಿ ಇನ್ನೂ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದ್ದ ಸಂಕುಚಿತ ಅರವಿಡು ಆಸ್ಥಾನದ ಅಪರೂಪದ ದಿನಾಂಕಿತ ಸಾಕ್ಷ್ಯ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL2, 'KN 431 (Kalasapura, EC VI Cm.153)')],
    review,
  },
)

// Source: "Vijayanagara Inscriptions" Volume III (Directorate of Archaeology and Museums, 1990),
// eds. D.R. Bhat (KN 1226 onward; district/taluk organisation).
const SRC_VIJAYANAGARA_INSC_VOL3 = 'src-ia-karnataka-archaeology-damh-vijayanagarainsc0000drbr-vol-iii'

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-vinsc3-kn1514-vira-narasimha-kaigonahalli-doubtful',
    name: n('Kaigonahalli grant of Vira Narasimha with a doubted date (KN 1514)', 'ಕೈಗೊನಹಳ್ಳಿ ವೀರ ನರಸಿಂಹ ಅನುದಾನ, ಸಂಶಯಾಸ್ಪದ ದಿನಾಂಕ (KN 1514)'),
    date: d(1462, 1463, 'range'),
    placeId: 'place-mandya',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-mandya',
    languages: ['Sanskrit'],
    scripts: ['Nagari'],
    description: n('Catalogued as KN 1514 (Kaigonahalli, Mandya district; a copper plate in the possession of a village resident): attributed to Tuluva Vira Narasimha, registers a gift of the village Kaigondapalli alias Vira Narasimhapura in Sindhughatta-sime of Hoysala-desa, on the king\'s performing saptasagaradana before the god Siva at Srisaila. The editors flag the Saka date (working out to 1462 or 1463 CE depending on reading) as too early for any Tuluva ruler and note the eulogy is the one usually associated with Krishnadevaraya, concluding "the genuineness of the record is not beyond doubt."', 'KN 1514ರಂತೆ ಪಟ್ಟಿಗತ (ಕೈಗೊನಹಳ್ಳಿ, ಮಂಡ್ಯ ಜಿಲ್ಲೆ; ಗ್ರಾಮಸ್ಥರೊಬ್ಬರ ಬಳಿ ತಾಮ್ರಫಲಕ): ತುಳುವ ವೀರ ನರಸಿಂಹನಿಗೆ ಆರೋಪಿತ, ಹೊಯ್ಸಳ-ದೇಶದ ಸಿಂಧುಘಟ್ಟ-ಸೀಮೆಯ ಕೈಗೊಂಡಪಳ್ಳಿ ಅಲಿಯಾಸ್ ವೀರ ನರಸಿಂಹಪುರ ಗ್ರಾಮದ ದಾನವನ್ನು, ರಾಜನು ಶ್ರೀಶೈಲದಲ್ಲಿ ಶಿವನ ಮುಂದೆ ಸಪ್ತಸಾಗರದಾನ ಮಾಡಿದ ಸಂದರ್ಭದಲ್ಲಿ ದಾಖಲಿಸುತ್ತದೆ. ಸಂಪಾದಕರು ಶಕ ದಿನಾಂಕವನ್ನು (ಓದಿಗೆ ಅನುಗುಣವಾಗಿ 1462 ಅಥವಾ 1463) ಯಾವುದೇ ತುಳುವ ಅರಸನಿಗೆ ಬಹಳ ಮುಂಚಿನದೆಂದು ಗುರುತಿಸುತ್ತಾರೆ ಮತ್ತು ಮಂಗಳಾಚರಣೆ ಸಾಮಾನ್ಯವಾಗಿ ಕೃಷ್ಣದೇವರಾಯನೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ್ದೆಂದು ಗಮನಿಸುತ್ತಾ "ದಾಖಲೆಯ ನಿಜಾಂಶ ಸಂಶಯಾತೀತವಲ್ಲ" ಎಂದು ತೀರ್ಮಾನಿಸುತ್ತಾರೆ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL3, 'KN 1514 (Kaigonahalli, Mandya District; EC VI Rev.1977 Kr.71, EC XIV 1st edn. Kr.99): editors question the record\'s genuineness')],
    review,
  },
  {
    id: 'inscription-karch-vinsc3-kn1515-melukote-chelapilaraya-grant',
    name: n('Mayilanahalli grant to the god Chelapilaraya of Melukote (c. 1534)', 'ಮೈಲನಹಳ್ಳಿ ಅನುದಾನ, ಮೇಲುಕೋಟೆಯ ಚೆಲಪಿಲರಾಯ ದೇವರಿಗೆ (ಸು. 1534)'),
    date: d(1534, 1534, 'circa'),
    placeId: 'place-mandya',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-mandya',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as KN 1515 (Mayilanahalli, Krishnarajapet taluk, Mandya district): a Saka date read as probably corresponding to 15 April 1534 CE. Registers a gift of the village Mayilanahalli and its hamlets, belonging to Tanjavur Vrindavana, to the god Chelapilaraya of Melugote (Melukote, the Cheluvanarayana Swamy temple), made by Nanjaraja of Abbaganjuru Naligachari; the scribe was Chaluva Ramanuja of Sinda-grama. The editors tentatively assign it to Achyutaraya on the strength of a mentioned subordinate, Ramabhatta, known to have served under him in this region.', 'KN 1515ರಂತೆ ಪಟ್ಟಿಗತ (ಮೈಲನಹಳ್ಳಿ, ಕೃಷ್ಣರಾಜಪೇಟೆ ತಾಲ್ಲೂಕು, ಮಂಡ್ಯ ಜಿಲ್ಲೆ): ಶಕ ದಿನಾಂಕ ಬಹುಶಃ 15 ಏಪ್ರಿಲ್ 1534ಕ್ಕೆ ಅನುಗುಣ. ತಂಜಾವೂರು ವೃಂದಾವನಕ್ಕೆ ಸೇರಿದ ಮೈಲನಹಳ್ಳಿ ಗ್ರಾಮ ಮತ್ತು ಅದರ ಉಪಗ್ರಾಮಗಳ ದಾನವನ್ನು, ಮೇಲುಗೋಟೆಯ (ಮೇಲುಕೋಟೆ, ಚೆಲುವನಾರಾಯಣಸ್ವಾಮಿ ದೇವಾಲಯ) ಚೆಲಪಿಲರಾಯ ದೇವರಿಗೆ, ಅಬ್ಬಗಂಜೂರು ನಳಿಗಾಚಾರಿಯ ನಂಜರಾಜನಿಂದ ನೀಡಲಾಗಿದ್ದನ್ನು ದಾಖಲಿಸುತ್ತದೆ; ಬರೆದವನು ಸಿಂಡಗ್ರಾಮದ ಚಲುವ ರಾಮಾನುಜ. ಈ ಪ್ರದೇಶದಲ್ಲಿ ಸೇವೆ ಸಲ್ಲಿಸಿದ್ದ ಅಧೀನ ಅಧಿಕಾರಿ ರಾಮಭಟ್ಟನ ಉಲ್ಲೇಖದ ಆಧಾರದ ಮೇಲೆ ಸಂಪಾದಕರು ಇದನ್ನು ಅಚ್ಯುತರಾಯನಿಗೆ ತಾತ್ಕಾಲಿಕವಾಗಿ ಆರೋಪಿಸುತ್ತಾರೆ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL3, 'KN 1515 (Mayilanahalli, Mandya District; EC VI Rev.1977 Kr.93, MAR 1927 No. 116)')],
    review,
  },
  {
    id: 'inscription-karch-vinsc3-kn1516-sadasivaraya-bachahalli-grant',
    name: n('Sadasivaraya-era land grant at Sante Bachahalli (1553)', 'ಸಂತೆ ಬಚ್ಚಹಳ್ಳಿ ಸದಾಶಿವರಾಯ ಕಾಲದ ಭೂಮಿ ಅನುದಾನ (1553)'),
    date: d(1553, 1553, 'year'),
    placeId: 'place-mandya',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-mandya',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as KN 1516, on a stone before the Virabhadra temple at Sante Bachahalli (Krishnarajapet taluk, Mandya district): dated Saka 1475, Pramadicha, Ashadha su. 10, Wednesday (21 June 1553 CE), attributed to Tuluva Sadasivaraya. Registers a gift of two deserted villages (Kesavinakatte and Halasinahalli) plus tank-irrigated and dry lands, a garden and a house, to Honnahalage Linganna, the sthanika (temple functionary) of the Virabhadra temple, granted by Rangappa acting for mahamandaleshvara Aubhalarajayya-chola-maha-arasu for the merit of Chennarajayya, for hereditary enjoyment (kanyachi).', 'KN 1516ರಂತೆ ಪಟ್ಟಿಗತ, ಸಂತೆ ಬಚ್ಚಹಳ್ಳಿಯ (ಕೃಷ್ಣರಾಜಪೇಟೆ ತಾಲ್ಲೂಕು, ಮಂಡ್ಯ ಜಿಲ್ಲೆ) ವೀರಭದ್ರ ದೇವಾಲಯದ ಮುಂದಿನ ಶಿಲೆಯ ಮೇಲೆ: ಶಕ 1475, ಪ್ರಮಾದೀಚ, ಆಷಾಢ ಶು. 10, ಬುಧವಾರ (21 ಜೂನ್ 1553) ದಿನಾಂಕಿತ, ತುಳುವ ಸದಾಶಿವರಾಯನಿಗೆ ಆರೋಪಿತ. ಎರಡು ನಿರ್ಜನ ಗ್ರಾಮಗಳ (ಕೇಶವಿನಕಟ್ಟೆ ಮತ್ತು ಹಳಸಿನಹಳ್ಳಿ) ಜೊತೆಗೆ ಕೆರೆ-ನೀರಾವರಿ ಮತ್ತು ಒಣಭೂಮಿ, ತೋಟ ಮತ್ತು ಮನೆಯ ದಾನವನ್ನು, ವೀರಭದ್ರ ದೇವಾಲಯದ ಸ್ಥಾನಿಕ ಹೊನ್ನಹಳಗೆ ಲಿಂಗಣ್ಣನಿಗೆ, ಚೆನ್ನರಾಜಯ್ಯನ ಪುಣ್ಯಕ್ಕಾಗಿ ಮಹಾಮಂಡಲೇಶ್ವರ ಔಭಳರಾಜಯ್ಯ-ಚೋಳ-ಮಹಾ-ಅರಸನ ಪರವಾಗಿ ರಂಗಪ್ಪನಿಂದ, ಕಣ್ಯಾಚಿ (ವಂಶಪಾರಂಪರ್ಯ ಅನುಭೋಗ)ಕ್ಕಾಗಿ ನೀಡಲಾಗಿದ್ದನ್ನು ದಾಖಲಿಸುತ್ತದೆ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL3, 'KN 1516 (Sante Bachahalli, Mandya District; EC VI Rev.1977 Kr.64, EC IV 1st edn. Kr.65)')],
    review,
  },
  {
    id: 'inscription-karch-vinsc3-kn1280-sadasiva-tippenahalli-date-mismatch',
    name: n('Tippenahalli record attributed to Sadasivaraya with a rejected date (KN 1280)', 'ತಿಪ್ಪೇನಹಳ್ಳಿ ದಾಖಲೆ ಸದಾಶಿವರಾಯನಿಗೆ ಆರೋಪಿತ, ದಿನಾಂಕ ತಿರಸ್ಕೃತ (KN 1280)'),
    date: d(1511, 1511, 'year'),
    placeId: 'place-kolar',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-kolar',
    languages: ['Telugu'],
    scripts: ['Telugu'],
    description: n('Catalogued as KN 1280, on a slab near the north gateway of Tippenahalli (Kolar district): the surviving date reads Saka 1433, Sravana su. 13, Wednesday (6 August 1511 CE), but the editors state plainly this is "too early a date for Sadasiva" (whose reign began in 1542) and conclude "the Saka year cited is therefore wrong." The damaged text mentions mahamandaleshvara Ramarajayya and the village Tippepalli; further details are lost. Recorded as an example of a mis-dated or miscopied inscription rather than a reliable Sadasivaraya-period record.', 'KN 1280ರಂತೆ ಪಟ್ಟಿಗತ, ತಿಪ್ಪೇನಹಳ್ಳಿಯ (ಕೋಲಾರ ಜಿಲ್ಲೆ) ಉತ್ತರ ಹೆಬ್ಬಾಗಿಲ ಬಳಿಯ ಶಿಲಾಫಲಕದ ಮೇಲೆ: ಉಳಿದಿರುವ ದಿನಾಂಕ ಶಕ 1433, ಶ್ರಾವಣ ಶು. 13, ಬುಧವಾರ (6 ಆಗಸ್ಟ್ 1511) ಎಂದು ಓದುತ್ತದೆ, ಆದರೆ ಸಂಪಾದಕರು ಸ್ಪಷ್ಟವಾಗಿ ಇದು "ಸದಾಶಿವನಿಗೆ (ಆಳ್ವಿಕೆ 1542ರಲ್ಲಿ ಆರಂಭ) ಬಹಳ ಮುಂಚಿನ ದಿನಾಂಕ" ಎಂದೂ "ಉಲ್ಲೇಖಿಸಿದ ಶಕ ವರ್ಷ ಆದ್ದರಿಂದ ತಪ್ಪು" ಎಂದೂ ತೀರ್ಮಾನಿಸುತ್ತಾರೆ. ಹಾನಿಗೊಂಡ ಪಠ್ಯ ಮಹಾಮಂಡಲೇಶ್ವರ ರಾಮರಾಜಯ್ಯ ಮತ್ತು ತಿಪ್ಪೆಪಳ್ಳಿ ಗ್ರಾಮವನ್ನು ಉಲ್ಲೇಖಿಸುತ್ತದೆ; ಹೆಚ್ಚಿನ ವಿವರಗಳು ನಷ್ಟವಾಗಿವೆ. ವಿಶ್ವಾಸಾರ್ಹ ಸದಾಶಿವರಾಯ-ಕಾಲದ ದಾಖಲೆಗಿಂತ ತಪ್ಪು-ದಿನಾಂಕಿತ ಅಥವಾ ತಪ್ಪಾಗಿ ನಕಲಿಸಿದ ಶಾಸನದ ಉದಾಹರಣೆಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL3, 'KN 1280 (Tippenahalli, Kolar District; EC X Ct.12): editors reject the cited Saka year as erroneous')],
    review,
  },
  {
    id: 'inscription-karch-vinsc3-kn1629-krishnadevaraya-aladiru-grant',
    name: n('Krishnadevaraya-era grant of Aladiru village (1528)', 'ಆಲದೂರು ಗ್ರಾಮದ ಕೃಷ್ಣದೇವರಾಯ ಕಾಲದ ಅನುದಾನ (1528)'),
    date: d(1528, 1528, 'year'),
    placeId: 'place-mysuru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-chamarajanagar',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Catalogued as KN 1629, on a stone to the south of the village entrance at Aladiru (Chamarajanagara taluk, Mysore district): dated Saka 1450, Sarvadhari, Chaitra ba. 7 (11 April 1528 CE), attributed to Tuluva Krishnadevaraya. This worn inscription states that, under the king\'s orders, Devarasayya made a grant of the village Aludiru (in Tayuru-sthala) for the king\'s merit; the donee\'s name is lost, though he probably belonged to the Kausika-gotra.', 'KN 1629ರಂತೆ ಪಟ್ಟಿಗತ, ಆಲದೂರಿನ (ಚಾಮರಾಜನಗರ ತಾಲ್ಲೂಕು, ಮೈಸೂರು ಜಿಲ್ಲೆ) ಗ್ರಾಮ ಪ್ರವೇಶದ ದಕ್ಷಿಣಕ್ಕಿರುವ ಶಿಲೆಯ ಮೇಲೆ: ಶಕ 1450, ಸರ್ವಧಾರಿ, ಚೈತ್ರ ಬ. 7 (11 ಏಪ್ರಿಲ್ 1528) ದಿನಾಂಕಿತ, ತುಳುವ ಕೃಷ್ಣದೇವರಾಯನಿಗೆ ಆರೋಪಿತ. ಈ ಸವೆದ ಶಾಸನ ರಾಜನ ಆಜ್ಞೆಯಂತೆ ದೇವರಸಯ್ಯ ರಾಜನ ಪುಣ್ಯಕ್ಕಾಗಿ ಆಲದೂರು (ತಾಯೂರು-ಸ್ಥಳದಲ್ಲಿ) ಗ್ರಾಮದ ಅನುದಾನ ನೀಡಿದನೆಂದು ಹೇಳುತ್ತದೆ; ದಾನಿತನ ಹೆಸರು ನಷ್ಟವಾಗಿದೆ, ಆದರೂ ಬಹುಶಃ ಕೌಶಿಕ-ಗೋತ್ರದವನಾಗಿದ್ದ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL3, 'KN 1629 (Aladiru, Mysore District, Chamarajanagara taluk; EC IV Rev.1975 Ch.111, EC IV 1st edn. Ch.15)')],
    review,
  },
)

// Source: "Vijayanagara Inscriptions" Volume IV (Directorate of Archaeology and Museums, 1996),
// eds. D.R. Bhat -- catalogue numbers prefixed "AP". Unlike Volumes II and III, this volume covers
// Anantapur and Chittoor districts of present-day Andhra Pradesh (Vijayanagara territory outside
// modern Karnataka), so its records are marked outsideKarnataka rather than assigned a district audit.
const SRC_VIJAYANAGARA_INSC_VOL4 = 'src-ia-karnataka-archaeology-damh-vijayanagarainsc0000drbr-vol-iv'
const andhraScope = n => ({ region: 'Rayalaseema, Andhra Pradesh', countryCode: 'IN', countryName: n('India', 'ಭಾರತ'), outsideKarnataka: true, outsideIndia: false })

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-vinsc4-ap209-439-sambati-tipparaju-forgery',
    name: n('Sambati Tipparaju dyagara records identified as forgeries (AP 209, 439)', 'ಸಂಬತಿ ತಿಪ್ಪರಾಜು ದ್ಯಾಗಾರ ದಾಖಲೆಗಳು ಕೃತಕವೆಂದು ಗುರುತಿಸಲಾಗಿದೆ (AP 209, 439)'),
    date: d(1187, 1187, 'circa'),
    placeId: 'place-anantapur',
    polityId: 'polity-vijayanagara',
    districtAuditId: null,
    geographicScope: andhraScope(n),
    languages: ['unresolved'],
    scripts: ['unresolved'],
    description: n('Catalogued as AP 209 and AP 439, both from Anantapur district: two copper-plate records dealing with the appointment of dyagars (village accountants) of villages founded by named individuals, both referring to a chief Sambati Tipparaju and bearing the identical date Saka 1109, Ashvija su. 10. The volume\'s editors state plainly: "Apparently, the date is wrong and both of them are clear forgeries." Recorded as a documented case study in the volume\'s own critical apparatus for detecting forged Vijayanagara-era land grants, not as evidence of Sambati Tipparaju\'s actual historical activity.', 'AP 209 ಮತ್ತು AP 439ರಂತೆ ಪಟ್ಟಿಗತ, ಎರಡೂ ಅನಂತಪುರ ಜಿಲ್ಲೆಯಿಂದ: ಹೆಸರಿಸಿದ ವ್ಯಕ್ತಿಗಳು ಸ್ಥಾಪಿಸಿದ ಗ್ರಾಮಗಳ ದ್ಯಾಗಾರ (ಗ್ರಾಮ ಲೆಕ್ಕಿಗ) ನೇಮಕವನ್ನು ಕುರಿತ ಎರಡು ತಾಮ್ರಶಾಸನಗಳು, ಎರಡೂ ಮುಖ್ಯ ಸಂಬತಿ ತಿಪ್ಪರಾಜುವನ್ನು ಉಲ್ಲೇಖಿಸುತ್ತ ಒಂದೇ ದಿನಾಂಕ ಶಕ 1109, ಆಶ್ವಿಜ ಶು. 10 ಹೊಂದಿವೆ. ಸಂಪುಟದ ಸಂಪಾದಕರು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳುತ್ತಾರೆ: "ಸ್ಪಷ್ಟವಾಗಿ, ದಿನಾಂಕ ತಪ್ಪು ಮತ್ತು ಇವೆರಡೂ ಸ್ಪಷ್ಟ ಕೃತಕ ದಾಖಲೆಗಳು." ಸಂಬತಿ ತಿಪ್ಪರಾಜುವಿನ ನಿಜವಾದ ಚಾರಿತ್ರಿಕ ಚಟುವಟಿಕೆಯ ಸಾಕ್ಷ್ಯವಾಗಿ ಅಲ್ಲ, ಬದಲಿಗೆ ಕೃತಕ ವಿಜಯನಗರ-ಕಾಲದ ಭೂಮಿ ಅನುದಾನಗಳನ್ನು ಪತ್ತೆಹಚ್ಚುವ ಸಂಪುಟದ ಸ್ವಂತ ವಿಮರ್ಶಾತ್ಮಕ ವಿಧಾನದ ದಾಖಲಿತ ನಿದರ್ಶನವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL4, 'AP 209 and AP 439 (Anantapur district), discussed in the volume\'s Political History introduction (p. xxvii): editors explicitly call both "clear forgeries"')],
    review,
  },
  {
    id: 'inscription-karch-vinsc4-ap420-421-saluva-timma-tadapatri',
    name: n('Saluva Timmayya\'s Tadapatri temple construction records (1509)', 'ಸಾಳುವ ತಿಮ್ಮಯ್ಯನ ತಾಡಪತ್ರಿ ದೇವಾಲಯ ನಿರ್ಮಾಣ ದಾಖಲೆಗಳು (1509)'),
    date: d(1509, 1509, 'year'),
    placeId: 'place-tadipatri',
    polityId: 'polity-vijayanagara',
    districtAuditId: null,
    geographicScope: andhraScope(n),
    languages: ['unresolved'],
    scripts: ['unresolved'],
    description: n('Catalogued as AP 420 and AP 421, two Tadapatri epigraphs dated 1509 CE (February and May respectively) naming mahapradhana Saluva Timmayya (Saluva Timma). AP 421 states that he built a bhoga-mantapa, tower and enclosure wall for the Ramesvara temple at Tadapatri and granted a village to the deity. The volume\'s editors connect this minister to the Vijayanagara succession-crisis story recorded by the Portuguese chronicler Fernao Nunes: ordered by the regent to blind Krishnadevaraya\'s young nephew (Vira Narasimha\'s son) to remove a rival claimant, Timma is said to have instead blinded a she-goat and presented it as false proof of compliance. The inscriptions independently corroborate Timma\'s historical position and activity at Tadapatri in this period, though not the anecdote itself.', 'AP 420 ಮತ್ತು AP 421ರಂತೆ ಪಟ್ಟಿಗತ, 1509 (ಫೆಬ್ರವರಿ ಮತ್ತು ಮೇ) ದಿನಾಂಕಿತ ಎರಡು ತಾಡಪತ್ರಿ ಶಾಸನಗಳು, ಮಹಾಪ್ರಧಾನ ಸಾಳುವ ತಿಮ್ಮಯ್ಯ (ಸಾಳುವ ತಿಮ್ಮ)ನನ್ನು ಹೆಸರಿಸುತ್ತವೆ. AP 421ರ ಪ್ರಕಾರ ಅವನು ತಾಡಪತ್ರಿಯ ರಾಮೇಶ್ವರ ದೇವಾಲಯಕ್ಕೆ ಭೋಗ-ಮಂಟಪ, ಗೋಪುರ ಮತ್ತು ಆವರಣ ಗೋಡೆಯನ್ನು ಕಟ್ಟಿಸಿ ದೇವರಿಗೆ ಒಂದು ಗ್ರಾಮವನ್ನು ಅನುದಾನ ನೀಡಿದನು. ಪೋರ್ಚುಗೀಸ್ ಚರಿತ್ರಕಾರ ಫೆರ್ನಾವೊ ನೂನಿಸ್ ದಾಖಲಿಸಿದ ವಿಜಯನಗರ ಉತ್ತರಾಧಿಕಾರ-ಬಿಕ್ಕಟ್ಟಿನ ಕಥೆಯೊಂದಿಗೆ ಸಂಪುಟದ ಸಂಪಾದಕರು ಈ ಮಂತ್ರಿಯನ್ನು ಜೋಡಿಸುತ್ತಾರೆ: ಸ್ಪರ್ಧಿ ಹಕ್ಕುದಾರನನ್ನು ತೆಗೆದುಹಾಕಲು ಕೃಷ್ಣದೇವರಾಯನ ಎಳೆಯ ಸೋದರಳಿಯ (ವೀರ ನರಸಿಂಹನ ಮಗ)ನನ್ನು ಕುರುಡುಗೊಳಿಸಲು ರಾಜಪ್ರತಿನಿಧಿಯಿಂದ ಆಜ್ಞಾಪಿತನಾದ ತಿಮ್ಮ, ಬದಲಿಗೆ ಒಂದು ಹೆಣ್ಣು ಮೇಕೆಯನ್ನು ಕುರುಡುಗೊಳಿಸಿ ಸುಳ್ಳು ಸಾಕ್ಷ್ಯವಾಗಿ ತೋರಿಸಿದನೆಂದು ಹೇಳಲಾಗುತ್ತದೆ. ಶಾಸನಗಳು ಈ ಅವಧಿಯಲ್ಲಿ ತಾಡಪತ್ರಿಯಲ್ಲಿ ತಿಮ್ಮನ ಚಾರಿತ್ರಿಕ ಸ್ಥಾನ ಮತ್ತು ಚಟುವಟಿಕೆಯನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ದೃಢಪಡಿಸುತ್ತವೆ, ಆದರೆ ಕಥೆಯನ್ನಲ್ಲ.'),
    citations: [c(SRC_VIJAYANAGARA_INSC_VOL4, 'AP 420 and AP 421 (Tadapatri, Anantapur district), discussed in the volume\'s Political History introduction (p. xxxv), cross-referenced with C.P. Brown\'s translation of the Nunes chronicle')],
    review,
  },
)

// Source: "Annual Report of the Mysore Archaeological Department for the Year 1931"
// (Mysore Archaeological Survey, 1935) -- Part II monument studies.
const SRC_MAD_AR_1931 = 'src-ia-karnataka-archaeology-damh-annualreportofmy0000unse1931'

export const karnatakaArchaeologyMiningCulturalHeritage = [
  {
    id: 'culture-karch-amritesvara-temple-amritapura',
    name: n('Amriteshvara Temple, Amritapura', 'ಅಮೃತಾಪುರದ ಅಮೃತೇಶ್ವರ ದೇವಾಲಯ'),
    category: 'architecture',
    date: d(1196, 1196, 'year'),
    polityIds: ['polity-hoysala'],
    placeIds: ['place-amritapura-amritesvara'],
    peopleIds: [],
    relatedWorkIds: [],
    traditionTags: ['Shaiva', 'Hoysala', 'ekakuta', 'temple'],
    continuity: 'material-survival',
    description: n('A well-preserved single-shrine (ekakuta) Hoysala temple at Amritapura (Tarikere taluk, Chikkamagaluru district), studied in detail by the Mysore Archaeological Department across 28 headings covering its plan, sculpture and inscriptions. Of about ten inscriptions in the temple and its compound, the oldest -- on a slab set up southeast of the temple -- claims to be composed by the celebrated Kannada poet Janna and was set up in 1196 CE when the temple was consecrated. The temple was built by the Hoysala officer (dandanayaka) Amriteshvara in the reign of Ballala II; the report\'s architectural analysis suggests the core shrine, sukhanasi and navaranga date to 1196, with the mukhamantapa added around 1206. Further grants to the temple are recorded in 1206, 1210 and, under the Vijayanagara rulers, in 1547 CE.', 'ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆಯ ತರೀಕೆರೆ ತಾಲ್ಲೂಕಿನ ಅಮೃತಾಪುರದ ಒಂದು ಸುಸ್ಥಿತಿಯ ಏಕಕೂಟ ಹೊಯ್ಸಳ ದೇವಾಲಯ, ಮೈಸೂರು ಪುರಾತತ್ವ ಇಲಾಖೆಯಿಂದ 28 ಶೀರ್ಷಿಕೆಗಳಡಿ ವಿವರವಾಗಿ ಅಧ್ಯಯನ ಮಾಡಲಾಗಿದೆ, ಅದರ ಯೋಜನೆ, ಶಿಲ್ಪ ಮತ್ತು ಶಾಸನಗಳನ್ನು ಒಳಗೊಂಡಂತೆ. ದೇವಾಲಯ ಮತ್ತು ಅದರ ಆವರಣದಲ್ಲಿನ ಸುಮಾರು ಹತ್ತು ಶಾಸನಗಳಲ್ಲಿ, ದೇವಾಲಯದ ಆಗ್ನೇಯಕ್ಕಿರುವ ಶಿಲಾಫಲಕದ ಮೇಲಿನ ಅತ್ಯಂತ ಹಳೆಯದು ಪ್ರಸಿದ್ಧ ಕನ್ನಡ ಕವಿ ಜನ್ನನ ರಚನೆಯೆಂದು ಹೇಳಿಕೊಳ್ಳುತ್ತದೆ ಮತ್ತು ದೇವಾಲಯ ಪ್ರತಿಷ್ಠಾಪನೆಯಾದ 1196ರಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾಯಿತು. ದೇವಾಲಯವನ್ನು ಬಲ್ಲಾಳ IIನ ಆಳ್ವಿಕೆಯಲ್ಲಿ ಹೊಯ್ಸಳ ಅಧಿಕಾರಿ (ದಂಡನಾಯಕ) ಅಮೃತೇಶ್ವರ ಕಟ್ಟಿಸಿದನು; ವರದಿಯ ವಾಸ್ತುಶಿಲ್ಪ ವಿಶ್ಲೇಷಣೆಯ ಪ್ರಕಾರ ಮುಖ್ಯ ಗರ್ಭಗುಡಿ, ಸುಖನಾಸಿ ಮತ್ತು ನವರಂಗ 1196ರದ್ದು, ಮುಖಮಂಟಪ ಸುಮಾರು 1206ರಲ್ಲಿ ಸೇರಿಸಲಾಯಿತು. ದೇವಾಲಯಕ್ಕೆ ಹೆಚ್ಚಿನ ಅನುದಾನಗಳು 1206, 1210 ಮತ್ತು ವಿಜಯನಗರ ಅರಸರ ಕಾಲದಲ್ಲಿ 1547ರಲ್ಲಿ ದಾಖಲಾಗಿವೆ.'),
    citations: [c(SRC_MAD_AR_1931, 'Part II, "Amritapura -- Amritesvara Temple, History" (pp. 11 ff.): full 28-heading architectural and epigraphical study')],
    review,
  },
  {
    id: 'culture-karch-lakshminarasimha-temple-bhadravati',
    name: n('Lakshminarasimha Temple, Bhadravati', 'ಭದ್ರಾವತಿಯ ಲಕ್ಷ್ಮೀನರಸಿಂಹ ದೇವಾಲಯ'),
    category: 'architecture',
    date: d(1225, 1275, 'range'),
    polityIds: ['polity-hoysala'],
    placeIds: ['place-bhadravati-lakshminarasimha'],
    peopleIds: [],
    relatedWorkIds: [],
    traditionTags: ['Vaishnava', 'Hoysala', 'trikutachala', 'temple', 'unfinished'],
    continuity: 'material-survival',
    description: n('A trikutachala (three-shrined) Hoysala temple at Bhadravati (historically Benkipura), on the north bank of the Bhadra river, with three towered garbhagrihas and sukhanasis opening into a common navaranga, raised on an elephant-supported star-shaped platform. The Mysore Archaeological Department report dates construction to about the middle of the 13th century CE, probably under Someshvara or Narasimha III, but notes the temple was clearly left unfinished: the basement mouldings are roughly shaped and unsculptured, and most wall-sculpture panels on the south cell were never carved. Two inscriptions survive: a six-line Hoysala-period record on the navaranga\'s eastern beam recording a late-Hoysala gift, and a separate Vijayanagara-period inscription outside the temple\'s north-east wall.', 'ಭದ್ರಾ ನದಿಯ ಉತ್ತರ ದಡದಲ್ಲಿರುವ ಭದ್ರಾವತಿಯ (ಚಾರಿತ್ರಿಕವಾಗಿ ಬೆಂಕಿಪುರ) ಒಂದು ತ್ರಿಕೂಟಾಚಲ (ಮೂರು-ಗುಡಿಗಳ) ಹೊಯ್ಸಳ ದೇವಾಲಯ, ಮೂರು ಗೋಪುರಯುಕ್ತ ಗರ್ಭಗುಡಿ ಮತ್ತು ಸುಖನಾಸಿಗಳು ಸಾಮಾನ್ಯ ನವರಂಗಕ್ಕೆ ತೆರೆದುಕೊಳ್ಳುತ್ತವೆ, ಆನೆ-ಆಧಾರಿತ ನಕ್ಷತ್ರಾಕಾರದ ಪೀಠದ ಮೇಲೆ ಎತ್ತರಿಸಲಾಗಿದೆ. ಮೈಸೂರು ಪುರಾತತ್ವ ಇಲಾಖೆಯ ವರದಿ ನಿರ್ಮಾಣವನ್ನು 13ನೇ ಶತಮಾನದ ಮಧ್ಯಭಾಗಕ್ಕೆ, ಬಹುಶಃ ಸೋಮೇಶ್ವರ ಅಥವಾ ನರಸಿಂಹ IIIನ ಕಾಲಕ್ಕೆ ದಿನಾಂಕಿಸುತ್ತದೆ, ಆದರೆ ದೇವಾಲಯ ಸ್ಪಷ್ಟವಾಗಿ ಅಪೂರ್ಣವಾಗಿ ಬಿಡಲಾಗಿತ್ತೆಂದು ಗಮನಿಸುತ್ತದೆ: ಪೀಠದ ಅಚ್ಚುಗಳು ಒರಟಾಗಿ ರೂಪುಗೊಂಡು ಕೆತ್ತದೆ ಬಿಡಲಾಗಿದ್ದು, ದಕ್ಷಿಣ ಗುಡಿಯ ಹೆಚ್ಚಿನ ಗೋಡೆ-ಶಿಲ್ಪ ಫಲಕಗಳನ್ನು ಎಂದೂ ಕೆತ್ತಲಾಗಿಲ್ಲ. ಎರಡು ಶಾಸನಗಳು ಉಳಿದಿವೆ: ನವರಂಗದ ಪೂರ್ವ ತೊಲೆಯ ಮೇಲಿನ ಆರು-ಸಾಲಿನ ಹೊಯ್ಸಳ-ಕಾಲದ ದಾಖಲೆ ತಡವಾದ-ಹೊಯ್ಸಳ ಕಾಣಿಕೆಯನ್ನು ದಾಖಲಿಸುತ್ತದೆ, ಮತ್ತು ದೇವಾಲಯದ ಈಶಾನ್ಯ ಗೋಡೆಯ ಹೊರಗಿನ ಪ್ರತ್ಯೇಕ ವಿಜಯನಗರ-ಕಾಲದ ಶಾಸನ.'),
    citations: [c(SRC_MAD_AR_1931, 'Part II, "Bhadravati -- Lakshminarasimha Temple, Situation/History/General Description" (pp. 1-3)')],
    review,
  },
]

// Source: "Vijayanagara Adhyayana" (Vijayanagara Studies), Volume 1 -- papers presented at the
// Hampi Utsava 1995 conference (Directorate of Archaeology and Museums, Mysore, 1996), eds.
// D.V. Devaraj and Channabasappa S. Patil. A Kannada-language research journal/conference-
// proceedings series (22 volumes, 1996-2020) rather than a primary-source catalogue; each article
// is a scholarly paper, so records here summarize an author's stated argument/finding rather than
// transcribing a catalogue entry, and are correspondingly hedged.
const SRC_VADHY_VOL1 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadha0000-1-dvde'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-hemakuta-badami-chalukya-temple',
  name: n('Badami Chalukya-period temple, Hemakuta Hill, Hampi', 'ಹಂಪೆಯ ಹೇಮಕೂಟ ಬೆಟ್ಟದ ಬಾದಾಮಿ ಚಾಲುಕ್ಯ-ಕಾಲದ ದೇವಾಲಯ'),
  category: 'architecture',
  date: d(700, 725, 'circa'),
  polityIds: ['polity-badami-chalukya'],
  placeIds: ['place-hampi-hemakuta'],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['Badami-Chalukya', 'pre-Vijayanagara', 'Hemakuta', 'sandstone', 'earliest-structure'],
  continuity: 'material-survival',
  description: n('In a paper presented at the Hampi Utsava 1995 conference, the scholar Devarakonda Reddy argues that one of the temples on Hemakuta Hill, Hampi, differs structurally from its neighbours and should be dated to the Badami Chalukya period, c. early 8th century CE -- centuries earlier than the 1100-1300 CE range usually assigned to the "pre-Vijayanagara" Hemakuta temples as a group. The argument rests on the building material (sandstone rather than the harder slab-stone typical of later Hampi construction) and comparative mouldings/profile details (adhishthana, kapota, sukanasi treatment) matched against dated Badami Chalukya architecture elsewhere. If correct, this identifies the oldest surviving built structure yet proposed at the Hampi site, predating the Vijayanagara empire\'s founding by roughly six centuries. The same paper traces Hampi\'s sacred-site history through inscriptions independent of this specific temple: as Pampatirtha in a 681 CE record, a Nolamba chief Udayaditya\'s visit recorded in an 1018 CE Bagali inscription, and an 1199 CE inscription naming numerous temples at the site along with a garrison stationed on Matanga Hill for its protection.', 'ಹಂಪಿ ಉತ್ಸವ 1995 ಸಮ್ಮೇಳನದಲ್ಲಿ ಮಂಡಿಸಿದ ಪ್ರಬಂಧವೊಂದರಲ್ಲಿ, ವಿದ್ವಾಂಸ ದೇವರಕೊಂಡಾರೆಡ್ಡಿ ಹಂಪೆಯ ಹೇಮಕೂಟ ಬೆಟ್ಟದ ಒಂದು ದೇವಾಲಯ ಅದರ ನೆರೆಹೊರೆಯ ದೇವಾಲಯಗಳಿಗಿಂತ ರಚನಾತ್ಮಕವಾಗಿ ಭಿನ್ನವಾಗಿದ್ದು ಬಾದಾಮಿ ಚಾಲುಕ್ಯ ಕಾಲಕ್ಕೆ, ಅಂದರೆ ಸು. 8ನೇ ಶತಮಾನದ ಆರಂಭಕ್ಕೆ ಸೇರಿಸಬೇಕೆಂದು ವಾದಿಸುತ್ತಾರೆ -- "ವಿಜಯನಗರ-ಪೂರ್ವ" ಹೇಮಕೂಟ ದೇವಾಲಯಗಳಿಗೆ ಸಾಮಾನ್ಯವಾಗಿ ನೀಡಲಾಗುವ 1100-1300 ವ್ಯಾಪ್ತಿಗಿಂತ ಶತಮಾನಗಳ ಮುಂಚಿನದು. ಈ ವಾದ ಕಟ್ಟಡ ಸಾಮಗ್ರಿಯ (ನಂತರದ ಹಂಪೆ ನಿರ್ಮಾಣದ ವಿಶಿಷ್ಟ ಗಟ್ಟಿ ಚಪ್ಪಡಿಗಲ್ಲಿಗಿಂತ ಮರಳುಗಲ್ಲು) ಮತ್ತು ತುಲನಾತ್ಮಕ ಅಚ್ಚು/ಪ್ರೊಫೈಲ್ ವಿವರಗಳ (ಅಧಿಷ್ಠಾನ, ಕಪೋತ, ಸುಖನಾಸಿ ನಿರ್ವಹಣೆ) ಆಧಾರದ ಮೇಲಿದ್ದು, ಇತರೆಡೆ ದಿನಾಂಕಿತ ಬಾದಾಮಿ ಚಾಲುಕ್ಯ ವಾಸ್ತುಶಿಲ್ಪದೊಂದಿಗೆ ಹೋಲಿಸಲಾಗಿದೆ. ಸರಿಯಾಗಿದ್ದರೆ, ಇದು ಹಂಪೆ ತಾಣದಲ್ಲಿ ಇದುವರೆಗೆ ಸೂಚಿಸಲಾದ ಅತ್ಯಂತ ಹಳೆಯ ಉಳಿದಿರುವ ನಿರ್ಮಿತ ರಚನೆಯನ್ನು ಗುರುತಿಸುತ್ತದೆ, ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಸ್ಥಾಪನೆಗಿಂತ ಸುಮಾರು ಆರು ಶತಮಾನಗಳ ಮುಂಚಿನದು. ಅದೇ ಪ್ರಬಂಧ ಈ ನಿರ್ದಿಷ್ಟ ದೇವಾಲಯದಿಂದ ಸ್ವತಂತ್ರವಾಗಿ ಹಂಪೆಯ ಪುಣ್ಯಕ್ಷೇತ್ರ ಇತಿಹಾಸವನ್ನು ಶಾಸನಗಳ ಮೂಲಕ ಪತ್ತೆ ಮಾಡುತ್ತದೆ: 681ರ ದಾಖಲೆಯಲ್ಲಿ ಪಂಪಾತೀರ್ಥವಾಗಿ, 1018ರ ಬಾಗಳಿ ಶಾಸನದಲ್ಲಿ ದಾಖಲಾದ ನೊಳಂಬ ಮುಖಂಡ ಉದಯಾದಿತ್ಯನ ಭೇಟಿಯಾಗಿ, ಮತ್ತು 1199ರ ಶಾಸನವು ತಾಣದಲ್ಲಿ ಹಲವು ದೇವಾಲಯಗಳನ್ನು ಹೆಸರಿಸುತ್ತಾ ಅದರ ರಕ್ಷಣೆಗಾಗಿ ಮತಂಗ ಬೆಟ್ಟದ ಮೇಲೆ ನಿಯೋಜಿತ ಸೈನ್ಯದ ಉಲ್ಲೇಖವನ್ನೂ ನೀಡುತ್ತದೆ.'),
  citations: [c(SRC_VADHY_VOL1, 'Devarakonda Reddy, "ಹಂಪೆಯಲ್ಲಿ ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ಕಾಲದ ದೇವಾಲಯ" (A Badami Chalukya-period temple at Hampi), pp. 37-40: architectural dating argument and epigraphic history of Pampatirtha/Hampi')],
  review,
})

// Source: "Vijayanagara Adhyayana" Volume 2 (Directorate of Archaeology and Museums, Mysore, 1997).
const SRC_VADHY_VOL2 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadha0000-2mlsh'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-anegondi-copper-plate-kumbara-purana',
  name: n('Anegondi copper-plate "potter-guild" origin narrative (c. 13th century)', 'ಆನೆಗುಂದಿ ತಾಮ್ರಪಟ "ಕುಂಬಾರ-ಗುಂಪು" ಮೂಲ ಕಥನ (ಸು. 13ನೇ ಶತಮಾನ)'),
  category: 'literature',
  date: d(1200, 1299, 'century'),
  polityIds: ['polity-vijayanagara'],
  placeIds: ['place-anegundi'],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['Kumbara', 'guild-charter', 'mythological-verse', 'pre-Vijayanagara', 'caste-origin-narrative'],
  continuity: 'historic',
  description: n('In a paper re-examining a copper-plate inscription from Anegondi (first published by C.S. Patil in the 1987-88 Vijayanagara Research Progress report), the epigraphist Srinivas V. Padigar argues this is not a conventional administrative record at all but a "samaya shasana" (guild charter) composed as two short Kannada mythological verse-narratives, "Vivaha Purana" and "Amrita Mathana Purana." Probably 13th-century CE (pre-dating Vijayanagara\'s own 1336 founding), the text traces the Kumbara (potter) community\'s origin to a mythic ancestor, Girirāja (Parvati\'s father), who fashioned the vessels for Shiva and Parvati\'s wedding and later helped fashion the vessel used in the gods\' churning of the ocean for amrita -- receiving in return the community\'s guild insignia, its "thirty-six vessels" and eighteen town/lineage divisions. Padigar shows the text is textually near-identical, phrase for phrase, to a stone inscription of similar date found at Sholapur, indicating both derive from a shared archetype text that circulated within the potter community as a charter of guild status and mythological legitimacy, rather than a unique royal or local record.', 'ಆನೆಗುಂದಿಯ ಒಂದು ತಾಮ್ರಶಾಸನವನ್ನು (ಮೊದಲು 1987-88ರ ವಿಜಯನಗರ ಸಂಶೋಧನ ಪ್ರಗತಿ ವರದಿಯಲ್ಲಿ ಸಿ.ಎಸ್. ಪಾಟೀಲರಿಂದ ಪ್ರಕಟಿತ) ಮರುಪರಿಶೀಲಿಸುವ ಪ್ರಬಂಧದಲ್ಲಿ, ಶಾಸನಶಾಸ್ತ್ರಜ್ಞ ಶ್ರೀನಿವಾಸ ವಿ. ಪಾಡಿಗಾರ ಇದು ಸಾಂಪ್ರದಾಯಿಕ ಆಡಳಿತ ದಾಖಲೆಯೇ ಅಲ್ಲವೆಂದೂ, ಬದಲಿಗೆ ಎರಡು ಸಣ್ಣ ಕನ್ನಡ ಪೌರಾಣಿಕ ಪದ್ಯ-ಕಥನಗಳಾದ "ವಿವಾಹ ಪುರಾಣ" ಮತ್ತು "ಅಮೃತ ಮಥನ ಪುರಾಣ"ವಾಗಿ ರಚಿತ "ಸಮಯ ಶಾಸನ" (ಗುಂಪು ಪ್ರಮಾಣಪತ್ರ) ಎಂದೂ ವಾದಿಸುತ್ತಾರೆ. ಬಹುಶಃ 13ನೇ ಶತಮಾನದ್ದು (ವಿಜಯನಗರದ ಸ್ವಂತ 1336ರ ಸ್ಥಾಪನೆಗಿಂತ ಮುಂಚಿನದು), ಈ ಪಠ್ಯ ಕುಂಬಾರ ಗುಂಪಿನ ಮೂಲವನ್ನು ಪೌರಾಣಿಕ ಪೂರ್ವಜ ಗಿರಿರಾಜ (ಪಾರ್ವತಿಯ ತಂದೆ)ನೊಂದಿಗೆ ಪತ್ತೆ ಮಾಡುತ್ತದೆ, ಅವನು ಶಿವ-ಪಾರ್ವತಿಯ ವಿವಾಹಕ್ಕೆ ಪಾತ್ರೆಗಳನ್ನು ಮಾಡಿ, ನಂತರ ದೇವತೆಗಳ ಅಮೃತಕ್ಕಾಗಿ ಸಮುದ್ರ ಮಥನದಲ್ಲಿ ಬಳಸಿದ ಪಾತ್ರೆಯನ್ನೂ ಮಾಡಿಕೊಟ್ಟನೆಂದೂ -- ಪ್ರತಿಫಲವಾಗಿ ಗುಂಪಿನ ಚಿಹ್ನೆಗಳು, ಅದರ "ಮೂವತ್ತಾರು ಪಾತ್ರೆಗಳು" ಮತ್ತು ಹದಿನೆಂಟು ಪಟ್ಟಣ/ವಂಶ ವಿಭಾಗಗಳನ್ನು ಪಡೆದನೆಂದೂ ಹೇಳುತ್ತದೆ. ಇದೇ ಕಾಲದ ಸೋಲ್ಲಾಪುರದಲ್ಲಿ ದೊರೆತ ಶಿಲಾಶಾಸನದೊಂದಿಗೆ ಪಠ್ಯ ಪದಶಃ ಬಹುತೇಕ ಒಂದೇ ಆಗಿದೆ ಎಂದು ಪಾಡಿಗಾರ ತೋರಿಸುತ್ತಾರೆ, ಇದು ಎರಡೂ ಒಂದೇ ಮೂಲ ಪಠ್ಯದಿಂದ ಬಂದಿರುವುದನ್ನು ಸೂಚಿಸುತ್ತದೆ, ಇದು ಕುಂಬಾರ ಸಮುದಾಯದೊಳಗೆ ಗುಂಪು ಸ್ಥಾನಮಾನ ಮತ್ತು ಪೌರಾಣಿಕ ಸಿಂಧುತ್ವದ ಪ್ರಮಾಣಪತ್ರವಾಗಿ ಚಲಾವಣೆಯಲ್ಲಿತ್ತು, ಒಂದು ವಿಶಿಷ್ಟ ರಾಜ ಅಥವಾ ಸ್ಥಳೀಯ ದಾಖಲೆಯಾಗಿ ಅಲ್ಲ.'),
  citations: [c(SRC_VADHY_VOL2, 'Srinivas V. Padigar, "ಆನೆಗೊಂದಿ ತಾಮ್ರಪಟ ಶಾಸನ: ಒಂದು ಮರುನೋಟ" (The Anegondi copper-plate inscription: a re-examination), pp. 57-59, comparing the text against a Sholapur stone inscription published by Shrinivas Ritti')],
  review,
})

// Source: "Annual Report of the Mysore Archaeological Department for the Year 1941" (1942) --
// Part I Epigraphy section, summarising ~60 inscriptions collected that year.
const SRC_MAD_AR_1941 = 'src-ia-karnataka-archaeology-damh-annualreportmyso0000unse1941'

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-mad1941-kondrahalli-kongani-muttarasar-plate',
    name: n('Kondrahalli copper-plate grant of the Ganga king Kongani Muttarasar', 'ಕೊಂಡ್ರಹಳ್ಳಿ ತಾಮ್ರಶಾಸನ, ಗಂಗ ಅರಸ ಕೊಂಗಣಿ ಮುತ್ತರಸರ್'),
    date: d(700, 800, 'century'),
    placeId: 'place-bengaluru',
    polityId: 'polity-western-ganga',
    districtAuditId: 'audit-bengaluru-rural',
    languages: ['Sanskrit', 'Kannada'],
    scripts: ['Nagari', 'Kannada'],
    description: n('One of about 60 inscriptions collected by the Mysore Archaeological Department in 1941 (4 copper plates, the rest stone). This copper-plate record, from Kondrahalli (Hoskote taluk), was issued in the 39th regnal year of the Western Ganga king Kongani Muttarasar -- the report suggests this may be another name of Sripurusha -- and records the grant of the village Saliggame to a Brahmana named Bhutasarma. If the Sripurusha identification holds, a 39th regnal year would place the grant late in his long reign (c. 726-788 CE).', 'ಮೈಸೂರು ಪುರಾತತ್ವ ಇಲಾಖೆಯಿಂದ 1941ರಲ್ಲಿ ಸಂಗ್ರಹಿಸಿದ ಸುಮಾರು 60 ಶಾಸನಗಳಲ್ಲಿ (4 ತಾಮ್ರಫಲಕ, ಉಳಿದವು ಶಿಲಾಶಾಸನ) ಒಂದು. ಈ ತಾಮ್ರಶಾಸನ, ಕೊಂಡ್ರಹಳ್ಳಿಯಿಂದ (ಹೊಸಕೋಟೆ ತಾಲ್ಲೂಕು), ಪಶ್ಚಿಮ ಗಂಗ ಅರಸ ಕೊಂಗಣಿ ಮುತ್ತರಸರ್‌ನ 39ನೇ ಆಳ್ವಿಕೆ ವರ್ಷದಲ್ಲಿ ನೀಡಲಾಗಿತ್ತು -- ವರದಿಯ ಪ್ರಕಾರ ಇದು ಶ್ರೀಪುರುಷನ ಇನ್ನೊಂದು ಹೆಸರಾಗಿರಬಹುದು -- ಮತ್ತು ಬ್ರಾಹ್ಮಣ ಭೂತಶರ್ಮನಿಗೆ ಸಾಲಿಗ್ಗಾಮೆ ಗ್ರಾಮದ ದಾನವನ್ನು ದಾಖಲಿಸುತ್ತದೆ. ಶ್ರೀಪುರುಷ ಗುರುತು ಸರಿಯಾಗಿದ್ದರೆ, 39ನೇ ಆಳ್ವಿಕೆ ವರ್ಷ ಅವನ ದೀರ್ಘ ಆಳ್ವಿಕೆಯ (ಸು. 726-788) ಕೊನೆಯ ಭಾಗದಲ್ಲಿ ಈ ಅನುದಾನವನ್ನು ಇರಿಸುತ್ತದೆ.'),
    citations: [c(SRC_MAD_AR_1941, 'Part I, Epigraphy section (p. 4): copper-plate grant from Kondrahalli, Hoskote Taluk, edited in Part VI under R. Rama Rao')],
    review,
  },
  {
    id: 'inscription-karch-mad1941-vadanagal-bhupati-vodeyar-plate',
    name: n('Vadanagal copper-plate grant of Prince Bhupati Vodeyar under Harihara II', 'ವಡನಾಗಲ್ ತಾಮ್ರಶಾಸನ, ಹರಿಹರ IIನ ಕಾಲದ ರಾಜಕುಮಾರ ಭೂಪತಿ ವೊಡೆಯರ್ ಅನುದಾನ'),
    date: d(1377, 1406, 'range'),
    placeId: 'place-tumakuru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-tumakuru',
    languages: ['Sanskrit', 'Kannada'],
    scripts: ['Nagari', 'Kannada'],
    description: n('A copper-plate record from Vadanagal (Pavagada taluk) recording the creation of an agrahara named Bukkarayapura by Bommana, under orders of Prince Bhupati Vodeyar, son of Bukka II and styled heir-apparent (bhavinam sarvabhaumam), issued during the reign of Vijayanagara king Harihara II. The report notes the historical irony: Bhupati, though a son of Bukka II (eldest son of Harihara I) and a titled heir-apparent, did not succeed his grandfather Harihara I on the throne -- his uncle Devaraya I acceded in 1406, and Bhupati Vodeyar remained only a governor under him until about 1420.', 'ವಡನಾಗಲ್‌ನ (ಪಾವಗಡ ತಾಲ್ಲೂಕು) ಒಂದು ತಾಮ್ರಶಾಸನ, ಬುಕ್ಕ IIನ ಮಗ ಮತ್ತು ಯುವರಾಜ (ಭಾವಿನಂ ಸರ್ವಭೌಮಂ) ಎಂದು ಬಿರುದಾಂಕಿತ ರಾಜಕುಮಾರ ಭೂಪತಿ ವೊಡೆಯರ್‌ನ ಆಜ್ಞೆಯಂತೆ ಬೊಮ್ಮಣ್ಣನಿಂದ ಬುಕ್ಕರಾಯಪುರ ಎಂಬ ಅಗ್ರಹಾರದ ಸ್ಥಾಪನೆಯನ್ನು, ವಿಜಯನಗರ ಅರಸ ಹರಿಹರ IIನ ಆಳ್ವಿಕೆಯಲ್ಲಿ ದಾಖಲಿಸುತ್ತದೆ. ವರದಿ ಚಾರಿತ್ರಿಕ ವ್ಯಂಗ್ಯವನ್ನು ಗಮನಿಸುತ್ತದೆ: ಭೂಪತಿ, ಬುಕ್ಕ IIನ (ಹರಿಹರ Iನ ಹಿರಿಯ ಮಗ) ಮಗ ಮತ್ತು ಬಿರುದಾಂಕಿತ ಯುವರಾಜನಾಗಿದ್ದರೂ, ತನ್ನ ಅಜ್ಜ ಹರಿಹರ Iನ ಸಿಂಹಾಸನವನ್ನು ಉತ್ತರಾಧಿಕಾರಿಯಾಗಲಿಲ್ಲ -- ಅವನ ಚಿಕ್ಕಪ್ಪ ದೇವರಾಯ I 1406ರಲ್ಲಿ ಪಟ್ಟವೇರಿದನು, ಮತ್ತು ಭೂಪತಿ ವೊಡೆಯರ್ ಸುಮಾರು 1420ರವರೆಗೆ ಅವನ ಅಡಿಯಲ್ಲಿ ಕೇವಲ ಗವರ್ನರ್ ಆಗಿ ಉಳಿದನು.'),
    citations: [c(SRC_MAD_AR_1941, 'Part I, Epigraphy section (pp. 4-5): copper-plate grant from Vadanagal, Pavagada Taluk')],
    review,
  },
  {
    id: 'inscription-karch-mad1941-jangamarahalli-chalukya-ganga-pallava-conflict',
    name: n('Jangamarahalli stone record naming Chalukya Vikramaditya and Ganga king Konguni Arasar against the Pallavas', 'ಜಂಗಮರಹಳ್ಳಿ ಶಿಲಾಶಾಸನ, ಪಲ್ಲವರ ವಿರುದ್ಧ ಚಾಲುಕ್ಯ ವಿಕ್ರಮಾದಿತ್ಯ ಮತ್ತು ಗಂಗ ಅರಸ ಕೊಂಗುಣಿ ಅರಸರ್'),
    date: d(650, 750, 'century'),
    placeId: 'place-tumakuru',
    polityId: 'polity-western-ganga',
    districtAuditId: 'audit-tumakuru',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('A stone record from Jangamarahalli (Pavagada taluk), one of about six stone epigraphs described in the 1941 report, naming both a Chalukya king Vikramaditya and the Ganga king Konguni Arasar as jointly engaged in a fight against the Pallavas (referred to as Kaduvetti). A rare single record independently attesting the Badami Chalukya-Western Ganga alliance pattern against Pallava power; the specific Vikramaditya (I, II or the Ganga-side Konguni ruler) is not yet resolved from this summary and needs the full edited text (Part VI of the report) for identification.', 'ಜಂಗಮರಹಳ್ಳಿಯ (ಪಾವಗಡ ತಾಲ್ಲೂಕು) ಒಂದು ಶಿಲಾಶಾಸನ, 1941ರ ವರದಿಯಲ್ಲಿ ವಿವರಿಸಿದ ಸುಮಾರು ಆರು ಶಿಲಾಶಾಸನಗಳಲ್ಲಿ ಒಂದು, ಚಾಲುಕ್ಯ ಅರಸ ವಿಕ್ರಮಾದಿತ್ಯ ಮತ್ತು ಗಂಗ ಅರಸ ಕೊಂಗುಣಿ ಅರಸರ್ ಇಬ್ಬರನ್ನೂ ಪಲ್ಲವರ (ಕದುವೆಟ್ಟಿ ಎಂದು ಉಲ್ಲೇಖಿತ) ವಿರುದ್ಧ ಜಂಟಿಯಾಗಿ ಹೋರಾಡಿದವರೆಂದು ಹೆಸರಿಸುತ್ತದೆ. ಪಲ್ಲವ ಶಕ್ತಿಯ ವಿರುದ್ಧ ಬಾದಾಮಿ ಚಾಲುಕ್ಯ-ಪಶ್ಚಿಮ ಗಂಗ ಮೈತ್ರಿ ಮಾದರಿಯನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ದೃಢಪಡಿಸುವ ಅಪರೂಪದ ಏಕ ದಾಖಲೆ; ಈ ಸಾರಾಂಶದಿಂದ ನಿರ್ದಿಷ್ಟ ವಿಕ್ರಮಾದಿತ್ಯ (I, II ಅಥವಾ ಗಂಗ-ಕಡೆಯ ಕೊಂಗುಣಿ ಅರಸ) ಇನ್ನೂ ನಿರ್ಧಾರವಾಗಿಲ್ಲ ಮತ್ತು ಗುರುತಿಸಲು ಪೂರ್ಣ ಸಂಪಾದಿತ ಪಠ್ಯ (ವರದಿಯ ಭಾಗ VI) ಬೇಕು.'),
    citations: [c(SRC_MAD_AR_1941, 'Part I, Epigraphy section (p. 5): stone record from Jangamarahalli, Pavagada Taluk')],
    review,
  },
  {
    id: 'inscription-karch-mad1941-bechirak-devalapura-sadasiva-muslim-official',
    name: n('Bechirak Devalapura grant under Sadasivaraya, made through a Muslim official (1557)', 'ಬೆಚಿರಕ ದೇವಾಲಪುರ ಅನುದಾನ, ಸದಾಶಿವರಾಯನ ಕಾಲದಲ್ಲಿ ಮುಸ್ಲಿಂ ಅಧಿಕಾರಿಯ ಮೂಲಕ (1557)'),
    date: d(1557, 1557, 'year'),
    placeId: 'place-kolar',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-kolar',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('A stone record from Bechirak Devalapura (Kolar taluk), dated Saka 1479 (1557 CE), in the reign of Vijayanagara king Sadasivaraya. Records a grant for the temple of Markandeshvara made by Sitapaka Maluka Vodeyar (tentatively identified by the report as Malik Sitab Khan), agent of Dilavarkhan -- both apparently Muslim officials operating within the Vijayanagara administrative structure. A notable data point for the religiously mixed personnel of the mid-16th century Vijayanagara state apparatus, even in routine temple-grant administration.', 'ಬೆಚಿರಕ ದೇವಾಲಪುರದ (ಕೋಲಾರ ತಾಲ್ಲೂಕು) ಒಂದು ಶಿಲಾಶಾಸನ, ಶಕ 1479 (1557) ದಿನಾಂಕಿತ, ವಿಜಯನಗರ ಅರಸ ಸದಾಶಿವರಾಯನ ಆಳ್ವಿಕೆಯಲ್ಲಿ. ಮಾರ್ಕಂಡೇಶ್ವರ ದೇವಾಲಯಕ್ಕೆ ಸೀತಾಪಕ ಮಲುಕ ವೊಡೆಯರ್‌ನಿಂದ (ವರದಿ ತಾತ್ಕಾಲಿಕವಾಗಿ ಮಲಿಕ್ ಸಿತಾಬ್ ಖಾನ್ ಎಂದು ಗುರುತಿಸುತ್ತದೆ) ನೀಡಿದ ಅನುದಾನವನ್ನು ದಾಖಲಿಸುತ್ತದೆ, ದಿಲಾವರ್‌ಖಾನ್‌ನ ಏಜೆಂಟ್ -- ಇಬ್ಬರೂ ವಿಜಯನಗರ ಆಡಳಿತ ರಚನೆಯೊಳಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದ್ದ ಮುಸ್ಲಿಂ ಅಧಿಕಾರಿಗಳಂತೆ ಕಾಣುತ್ತಾರೆ. 16ನೇ ಶತಮಾನದ ಮಧ್ಯದ ವಿಜಯನಗರ ರಾಜ್ಯ ವ್ಯವಸ್ಥೆಯ ಧಾರ್ಮಿಕವಾಗಿ ಮಿಶ್ರಿತ ಸಿಬ್ಬಂದಿಗೆ, ಸಾಮಾನ್ಯ ದೇವಾಲಯ-ಅನುದಾನ ಆಡಳಿತದಲ್ಲೂ, ಗಮನಾರ್ಹ ಸಾಕ್ಷ್ಯ ಬಿಂದು.'),
    citations: [c(SRC_MAD_AR_1941, 'Part I, Epigraphy section (p. 5): stone record from Bechirak Devalapura, Kolar Taluk')],
    review,
  },
  {
    id: 'inscription-karch-mad1941-belur-surendratirtha-matha-grant',
    name: n('Belur grant for the maintenance of guru Surendratirtha\'s matha (c. 1398)', 'ಬೇಲೂರು ಅನುದಾನ, ಗುರು ಸುರೇಂದ್ರತೀರ್ಥರ ಮಠ ನಿರ್ವಹಣೆಗಾಗಿ (ಸು. 1398)'),
    date: d(1398, 1398, 'circa'),
    placeId: 'place-belur',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-hassan',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('A Belur stone record recording a gift of lands to guru Surendratirtha-sripada of Belur for worship of the god Rama and maintenance of his matha, granted by Gundappa-dannayaka under the direction of Teppada Naganna Vodeyar, a subordinate of Vijayanagara king Harihara II. Dated to the cyclic year Bahudhanya, probably corresponding to 1398 CE. The report cross-checks this against the Madhva-sect succession list of the Sri Raghavendraswami Matha at Nanjangud, where a Surendratirtha appears as guru of Vijayendratirtha and a contemporary of Vyasatirtha (who flourished under Krishnadevaraya, 1509-1529) -- concluding this earlier, 1398-dated Surendratirtha must belong to a different lineage of the same name.', 'ಬೇಲೂರಿನ ಒಂದು ಶಿಲಾಶಾಸನ, ರಾಮ ದೇವರ ಪೂಜೆ ಮತ್ತು ಗುರು ಸುರೇಂದ್ರತೀರ್ಥ-ಶ್ರೀಪಾದರ ಮಠ ನಿರ್ವಹಣೆಗಾಗಿ ಭೂಮಿ ದಾನವನ್ನು, ವಿಜಯನಗರ ಅರಸ ಹರಿಹರ IIನ ಅಧೀನ ತೆಪ್ಪದ ನಾಗಣ್ಣ ವೊಡೆಯರ್‌ನ ನಿರ್ದೇಶನದಂತೆ ಗುಂಡಪ್ಪ-ದಂಡನಾಯಕನಿಂದ ನೀಡಲಾಗಿದ್ದನ್ನು ದಾಖಲಿಸುತ್ತದೆ. ಬಹುಧಾನ್ಯ ಚಕ್ರೀಯ ವರ್ಷ, ಬಹುಶಃ 1398ಕ್ಕೆ ಅನುಗುಣ. ವರದಿ ಇದನ್ನು ನಂಜನಗೂಡಿನ ಶ್ರೀ ರಾಘವೇಂದ್ರಸ್ವಾಮಿ ಮಠದ ಮಾಧ್ವ-ಪಂಥದ ಉತ್ತರಾಧಿಕಾರ ಪಟ್ಟಿಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸುತ್ತದೆ, ಅಲ್ಲಿ ಒಬ್ಬ ಸುರೇಂದ್ರತೀರ್ಥ ವಿಜಯೇಂದ್ರತೀರ್ಥರ ಗುರುವಾಗಿ ಮತ್ತು ವ್ಯಾಸತೀರ್ಥರ (ಕೃಷ್ಣದೇವರಾಯನ ಕಾಲದಲ್ಲಿ, 1509-1529, ಪ್ರವರ್ಧಮಾನ) ಸಮಕಾಲೀನರಾಗಿ ಕಾಣಿಸುತ್ತಾರೆ -- ಈ ಮುಂಚಿನ, 1398-ದಿನಾಂಕಿತ ಸುರೇಂದ್ರತೀರ್ಥರು ಅದೇ ಹೆಸರಿನ ಬೇರೆ ಪರಂಪರೆಗೆ ಸೇರಿರಬೇಕೆಂದು ತೀರ್ಮಾನಿಸುತ್ತದೆ.'),
    citations: [c(SRC_MAD_AR_1941, 'Part I, Epigraphy section (pp. 5-6): stone record from Belur, cross-checked against the Raghavendraswami Matha succession list')],
    review,
  },
)

// Source: "Archaeological Survey of Mysore Annual Report for the Year 1943" (1946).
const SRC_MAD_AR_1943 = 'src-ia-karnataka-archaeology-damh-archaeologicalsu0000unse-j9t4'

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-mad1943-kasipura-ravivarma-kadamba-plate',
    name: n('Kashipura copper-plate grant of the Kadamba king Ravivarma (c. 500 CE)', 'ಕಾಶಿಪುರ ತಾಮ್ರಶಾಸನ, ಕದಂಬ ಅರಸ ರವಿವರ್ಮ (ಸು. 500)'),
    date: d(490, 510, 'circa'),
    placeId: 'place-davanagere',
    polityId: 'polity-kadamba',
    districtAuditId: 'audit-davanagere',
    languages: ['Sanskrit'],
    scripts: ['Kannada'],
    description: n('A three-plate copper grant (lion seal, 7x2 inches) found in the possession of Ankalappala Mahadevappa at Kashipura, Mayakonda hobli, Davanagere taluk -- the report identifies it as the earliest copper-plate grant collected that year, belonging to the Kadamba king Ravivarma (Ravimaharaja), c. 500 CE. The Sanskrit text (in Kannada script) invokes the Kadambas\' self-description as an ashvamedha-purified lineage of the Manavya gotra and Haritiputras, devoted to Svami Mahasena (Kartikeya) and the Matrigana; it records land grants in the villages Durmmaya, Anegallu and others to a Brahmana of the Atreya gotra devoted to Trilochanasvamin (Shiva), with the customary curse-verses against violators of the grant.', 'ಸಿಂಹ ಮುದ್ರೆಯ ಮೂರು-ಫಲಕಗಳ ತಾಮ್ರಶಾಸನ (7x2 ಇಂಚು), ದಾವಣಗೆರೆ ತಾಲ್ಲೂಕಿನ ಮಾಯಕೊಂಡ ಹೋಬಳಿಯ ಕಾಶಿಪುರದಲ್ಲಿ ಅಂಕಳಪ್ಪಳ ಮಹಾದೇವಪ್ಪನ ಬಳಿ ಪತ್ತೆಯಾಗಿತ್ತು -- ವರದಿ ಇದನ್ನು ಆ ವರ್ಷ ಸಂಗ್ರಹಿಸಿದ ಅತ್ಯಂತ ಹಳೆಯ ತಾಮ್ರಶಾಸನ ಎಂದು ಗುರುತಿಸುತ್ತದೆ, ಕದಂಬ ಅರಸ ರವಿವರ್ಮ (ರವಿಮಹಾರಾಜ)ನದ್ದು, ಸು. 500. ಸಂಸ್ಕೃತ ಪಠ್ಯ (ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ) ಕದಂಬರನ್ನು ಮಾನವ್ಯ ಗೋತ್ರ ಮತ್ತು ಹಾರೀತಿಪುತ್ರರ, ಸ್ವಾಮಿ ಮಹಾಸೇನ (ಕಾರ್ತಿಕೇಯ) ಮತ್ತು ಮಾತೃಗಣಕ್ಕೆ ಸಮರ್ಪಿತ, ಅಶ್ವಮೇಧ-ಪವಿತ್ರೀಕೃತ ವಂಶವೆಂದು ವರ್ಣಿಸುತ್ತದೆ; ದುರ್ಮ್ಮಾಯ, ಅನೆಗಲ್ಲು ಮತ್ತು ಇತರ ಗ್ರಾಮಗಳ ಭೂಮಿ ದಾನವನ್ನು ತ್ರಿಲೋಚನಸ್ವಾಮಿ (ಶಿವ)ಗೆ ಸಮರ್ಪಿತ ಆತ್ರೇಯ ಗೋತ್ರದ ಬ್ರಾಹ್ಮಣನಿಗೆ, ಅನುದಾನ ಉಲ್ಲಂಘಿಸುವವರ ವಿರುದ್ಧ ವಾಡಿಕೆಯ ಶಾಪ-ಶ್ಲೋಕಗಳೊಂದಿಗೆ ದಾಖಲಿಸುತ್ತದೆ.'),
    citations: [c(SRC_MAD_AR_1943, 'Part I Epigraphy summary (p. 2) and Part VI Inscriptions No. 1, Chitaldrug District, Davangere Taluk (Plate VII.1): full Sanskrit/Kannada-script text transcribed')],
    review,
  },
  {
    id: 'inscription-karch-mad1943-yellambalasi-sripurusha-viragal',
    name: n('Ganga hero-stone (viragal) of Sripurusha\'s time at Yellambalasi', 'ಎಲ್ಲಂಬಲಸಿಯ ಶ್ರೀಪುರುಷನ ಕಾಲದ ಗಂಗ ವೀರಗಲ್ಲು'),
    date: d(726, 788, 'range'),
    placeId: 'place-chikkamagaluru',
    polityId: 'polity-western-ganga',
    districtAuditId: 'audit-chikkamagaluru',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('Listed among the important lithic records collected in 1943: a Western Ganga hero-stone (viragal, commemorating a warrior\'s death in battle) from Yellambalasi, Kadur taluk, dated to the time of the Ganga king Sripurusha (r. c. 726-788 CE). The summary confirms the record\'s existence, date-attribution and monument type; the commemorated warrior\'s name and the battle context are not given in this summary and require the full edited text.', '1943ರಲ್ಲಿ ಸಂಗ್ರಹಿಸಿದ ಪ್ರಮುಖ ಶಿಲಾಶಾಸನಗಳಲ್ಲಿ ಪಟ್ಟಿಗತ: ಕದೂರು ತಾಲ್ಲೂಕಿನ ಎಲ್ಲಂಬಲಸಿಯ ಒಂದು ಪಶ್ಚಿಮ ಗಂಗ ವೀರಗಲ್ಲು (ಯುದ್ಧದಲ್ಲಿ ವೀರ ಮರಣವನ್ನು ಸ್ಮರಿಸುವ ಶಿಲೆ), ಗಂಗ ಅರಸ ಶ್ರೀಪುರುಷನ (ಆ. ಸು. 726-788) ಕಾಲಕ್ಕೆ ದಿನಾಂಕಿತ. ಸಾರಾಂಶ ದಾಖಲೆಯ ಅಸ್ತಿತ್ವ, ದಿನಾಂಕ-ಆರೋಪಣೆ ಮತ್ತು ಸ್ಮಾರಕ ಬಗೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ; ಸ್ಮರಿಸಲಾದ ವೀರನ ಹೆಸರು ಮತ್ತು ಯುದ್ಧ ಸಂದರ್ಭ ಈ ಸಾರಾಂಶದಲ್ಲಿ ನೀಡಿಲ್ಲ ಮತ್ತು ಪೂರ್ಣ ಸಂಪಾದಿತ ಪಠ್ಯ ಬೇಕು.'),
    citations: [c(SRC_MAD_AR_1943, 'Part I, Epigraphy summary (p. 3), item 1: "A Ganga viragal of the time of Sripurusha at Yellambalasi, Kadur taluk"')],
    review,
  },
  {
    id: 'inscription-karch-mad1943-panditarahalli-vinayaditya-hoysala',
    name: n('Vinayaditya Hoysala inscription at Panditarahalli, an early Hoysala history source', 'ಪಂಡಿತರಹಳ್ಳಿ ವಿನಯಾದಿತ್ಯ ಹೊಯ್ಸಳ ಶಾಸನ, ಆರಂಭಿಕ ಹೊಯ್ಸಳ ಇತಿಹಾಸದ ಆಕರ'),
    date: d(1047, 1098, 'range'),
    placeId: 'place-chikkamagaluru',
    polityId: 'polity-hoysala',
    districtAuditId: 'audit-chikkamagaluru',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('An inscription of the early Hoysala ruler Vinayaditya (r. c. 1047-1098 CE, among the first Hoysala chiefs to expand beyond the dynasty\'s original hill-territory) found at Panditarahalli, listed among the important 1943 finds and explicitly flagged by the department as "useful for the study of early Hoysala history" -- a period for which inscriptional evidence is comparatively sparse next to the later, better-documented reigns of Vishnuvardhana and Ballala II.', 'ಆರಂಭಿಕ ಹೊಯ್ಸಳ ಅರಸ ವಿನಯಾದಿತ್ಯನ (ಆ. ಸು. 1047-1098, ವಂಶದ ಮೂಲ ಬೆಟ್ಟ-ಪ್ರದೇಶವನ್ನು ಮೀರಿ ವಿಸ್ತರಿಸಿದ ಮೊದಲ ಹೊಯ್ಸಳ ಮುಖಂಡರಲ್ಲಿ ಒಬ್ಬ) ಒಂದು ಶಾಸನ, ಪಂಡಿತರಹಳ್ಳಿಯಲ್ಲಿ ಪತ್ತೆಯಾಗಿತ್ತು, 1943ರ ಪ್ರಮುಖ ಶೋಧನೆಗಳಲ್ಲಿ ಪಟ್ಟಿಗತ ಮತ್ತು ಇಲಾಖೆಯಿಂದ ಸ್ಪಷ್ಟವಾಗಿ "ಆರಂಭಿಕ ಹೊಯ್ಸಳ ಇತಿಹಾಸ ಅಧ್ಯಯನಕ್ಕೆ ಉಪಯುಕ್ತ" ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ -- ನಂತರದ, ಚೆನ್ನಾಗಿ ದಾಖಲಾದ ವಿಷ್ಣುವರ್ಧನ ಮತ್ತು ಬಲ್ಲಾಳ IIನ ಆಳ್ವಿಕೆಗಳಿಗೆ ಹೋಲಿಸಿದರೆ ಶಾಸನ ಸಾಕ್ಷ್ಯ ತುಲನಾತ್ಮಕವಾಗಿ ವಿರಳವಾಗಿರುವ ಅವಧಿ.'),
    citations: [c(SRC_MAD_AR_1943, 'Part I, Epigraphy summary (p. 3), item 2: "An inscription of Vinayaditya Hoysala at Panditarahalli...useful for the study of early Hoysala history"')],
    review,
  },
  {
    id: 'inscription-karch-mad1943-hiremagalur-janamejaya-pillar-brahmi',
    name: n('Janamejaya pillar at Hiremagalur with previously unnoticed Brahmi and Kannada inscriptions', 'ಹಿರೇಮಗಳೂರಿನ ಜನಮೇಜಯ ಸ್ತಂಭ, ಈ ಮೊದಲು ಗಮನಿಸದ ಬ್ರಾಹ್ಮಿ ಮತ್ತು ಕನ್ನಡ ಶಾಸನಗಳೊಂದಿಗೆ'),
    date: d(1, 500, 'range'),
    placeId: 'place-chikkamagaluru',
    polityId: 'polity-kadamba',
    districtAuditId: 'audit-chikkamagaluru',
    languages: ['unresolved'],
    scripts: ['Brahmi', 'Kannada'],
    description: n('The so-called "Janamejaya pillar" at Hiremagalur, Chikmagalur taluk (Kadur district in the 1943 administrative division), reported as bearing Brahmi and Kannada inscriptions "which had not been noticed up to now" -- flagged by the department as under active study at the time of the report. A Brahmi-script inscription at a site otherwise associated with early historic and Kadamba-period Karnataka would be a significant paleographic data point; the specific readings were not yet published in this report and the outcome of the department\'s study has not been traced.', 'ಹಿರೇಮಗಳೂರಿನ (1943ರ ಆಡಳಿತ ವಿಭಾಗದಲ್ಲಿ ಕದೂರು ಜಿಲ್ಲೆ) ಚಿಕ್ಕಮಗಳೂರು ತಾಲ್ಲೂಕಿನ "ಜನಮೇಜಯ ಸ್ತಂಭ" ಎಂದು ಕರೆಯಲ್ಪಡುವ ಸ್ತಂಭ, "ಇದುವರೆಗೆ ಗಮನಿಸದ" ಬ್ರಾಹ್ಮಿ ಮತ್ತು ಕನ್ನಡ ಶಾಸನಗಳನ್ನು ಹೊಂದಿದೆಯೆಂದು ವರದಿಯಾಗಿದೆ -- ವರದಿಯ ಸಮಯದಲ್ಲಿ ಸಕ್ರಿಯ ಅಧ್ಯಯನದಲ್ಲಿದೆಯೆಂದು ಇಲಾಖೆ ಗುರುತಿಸುತ್ತದೆ. ಇತರೆಡೆ ಆರಂಭಿಕ ಚಾರಿತ್ರಿಕ ಮತ್ತು ಕದಂಬ-ಕಾಲದ ಕರ್ನಾಟಕದೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ ತಾಣದಲ್ಲಿ ಬ್ರಾಹ್ಮಿ-ಲಿಪಿಯ ಶಾಸನ ಮಹತ್ವದ ಲಿಪಿಶಾಸ್ತ್ರೀಯ ಸಾಕ್ಷ್ಯ ಬಿಂದುವಾಗಬಹುದು; ನಿರ್ದಿಷ್ಟ ಓದುಗಳನ್ನು ಈ ವರದಿಯಲ್ಲಿ ಇನ್ನೂ ಪ್ರಕಟಿಸಿಲ್ಲ ಮತ್ತು ಇಲಾಖೆಯ ಅಧ್ಯಯನದ ಫಲಿತಾಂಶವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗಿಲ್ಲ.'),
    citations: [c(SRC_MAD_AR_1943, 'Part I, Epigraphy summary (p. 3), item 3: Janamejaya pillar, Hiremagalur, Chikmagalur taluk, Kadur district -- "records are being studied"')],
    review,
  },
)

// Source: "Annual Report of the Mysore Archaeological Department for the Year 1945" (1946).
const SRC_MAD_AR_1945 = 'src-ia-karnataka-archaeology-damh-annualreportofmy0000unse-1945'

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-mad1945-sibi-harihararayapura-plate',
    name: n('Sibi renamed Harihararayapura by grant of Harihara II (1403)', 'ಹರಿಹರ IIನ ಅನುದಾನದಿಂದ ಸಿಬಿ ಹರಿಹರರಾಯಪುರ ಎಂದು ಮರುನಾಮಕರಣ (1403)'),
    date: d(1403, 1403, 'year'),
    placeId: 'place-tumakuru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-tumakuru',
    languages: ['Sanskrit', 'Kannada'],
    scripts: ['Nagari', 'Kannada'],
    description: n('Catalogued as inscription No. Sira 95, a copper-plate grant concerning Sibi (about 16 miles north of Tumkur), issued by Harihararaya (Harihara II), son of Bukka, dated 1403 CE. Records that the town, originally named Sibir, was converted into an agrahara and renamed Harihararayapura by the minister Krugappadeva; the grant endowed roughly 80 gifts to local Brahmans in the name of a temple of Ishvara called Chandramauli. Notably, at the time of this grant the well-known Narasimha temple at the same site does not appear to have existed yet, since the grant makes no mention of it.', 'ಸಿರ 95 ಸಂಖ್ಯೆಯ ಶಾಸನವಾಗಿ ಪಟ್ಟಿಗತ, ಸಿಬಿಗೆ (ತುಮಕೂರಿನ ಸುಮಾರು 16 ಮೈಲಿ ಉತ್ತರಕ್ಕೆ) ಸಂಬಂಧಿಸಿದ ತಾಮ್ರಶಾಸನ, ಬುಕ್ಕನ ಮಗ ಹರಿಹರರಾಯ (ಹರಿಹರ II)ನಿಂದ ನೀಡಲ್ಪಟ್ಟಿದ್ದು, 1403 ದಿನಾಂಕಿತ. ಮೂಲತಃ ಸಿಬಿರ್ ಎಂದು ಹೆಸರಿಸಲಾದ ಪಟ್ಟಣವನ್ನು ಅಗ್ರಹಾರವಾಗಿ ಪರಿವರ್ತಿಸಿ ಮಂತ್ರಿ ಕ್ರುಗಪ್ಪದೇವನಿಂದ ಹರಿಹರರಾಯಪುರ ಎಂದು ಮರುನಾಮಕರಣ ಮಾಡಲಾಯಿತೆಂದು ದಾಖಲಿಸುತ್ತದೆ; ಅನುದಾನ ಚಂದ್ರಮೌಳಿ ಎಂಬ ಈಶ್ವರ ದೇವಾಲಯದ ಹೆಸರಿನಲ್ಲಿ ಸ್ಥಳೀಯ ಬ್ರಾಹ್ಮಣರಿಗೆ ಸುಮಾರು 80 ಕಾಣಿಕೆಗಳನ್ನು ನೀಡಿತು. ಗಮನಾರ್ಹವಾಗಿ, ಈ ಅನುದಾನದ ಸಮಯದಲ್ಲಿ ಅದೇ ತಾಣದ ಪ್ರಸಿದ್ಧ ನರಸಿಂಹ ದೇವಾಲಯ ಇನ್ನೂ ಅಸ್ತಿತ್ವದಲ್ಲಿ ಇರಲಿಲ್ಲವೆಂದು ತೋರುತ್ತದೆ, ಏಕೆಂದರೆ ಅನುದಾನ ಅದನ್ನು ಉಲ್ಲೇಖಿಸುವುದಿಲ್ಲ.'),
    citations: [c(SRC_MAD_AR_1945, 'Inscription No. Sira 95 (p. 59), discussed under "Sibi -- Situation and antiquity"')],
    review,
  },
  {
    id: 'inscription-karch-mad1945-venkatapati-raya-plates',
    name: n('Venkatapati Raya copper plates of the 16th century', 'ವೆಂಕಟಪತಿ ರಾಯನ 16ನೇ ಶತಮಾನದ ತಾಮ್ರಶಾಸನಗಳು'),
    date: d(1585, 1614, 'range'),
    placeId: 'place-mysuru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-mysuru',
    languages: ['unresolved'],
    scripts: ['unresolved'],
    description: n('Among about 60 inscriptions and old documents collected and studied by the department in 1945: a set of copper plates issued during the reign of the Aravidu Vijayanagara king Venkatapati Raya (16th century CE), which the report states "throws valuable light on the history of the period." The department also received, in the same year, about 34 sannads (grant deeds, mostly 18th-19th century) from the Sringeri Mutt and several from the Nallur mosque near Chennagiri referencing grants by both Bijapur Sultans and Mysore kings -- evidence of continuous, religiously mixed royal patronage documentation spanning the Vijayanagara-to-Mysore-Kingdom transition.', '1945ರಲ್ಲಿ ಇಲಾಖೆ ಸಂಗ್ರಹಿಸಿ ಅಧ್ಯಯನ ಮಾಡಿದ ಸುಮಾರು 60 ಶಾಸನಗಳು ಮತ್ತು ಹಳೆಯ ದಾಖಲೆಗಳಲ್ಲಿ: ಅರವಿಡು ವಿಜಯನಗರ ಅರಸ ವೆಂಕಟಪತಿ ರಾಯನ (16ನೇ ಶತಮಾನ) ಆಳ್ವಿಕೆಯಲ್ಲಿ ನೀಡಲಾದ ತಾಮ್ರಫಲಕಗಳ ಒಂದು ಸೆಟ್, ವರದಿ ಇದನ್ನು "ಆ ಅವಧಿಯ ಇತಿಹಾಸಕ್ಕೆ ಮೌಲ್ಯಯುತ ಬೆಳಕು ಚೆಲ್ಲುತ್ತದೆ" ಎಂದು ಹೇಳುತ್ತದೆ. ಅದೇ ವರ್ಷ ಇಲಾಖೆ ಶೃಂಗೇರಿ ಮಠದಿಂದ ಸುಮಾರು 34 ಸನದುಗಳನ್ನೂ (ಹೆಚ್ಚಾಗಿ 18-19ನೇ ಶತಮಾನ), ಚೆನ್ನಗಿರಿ ಬಳಿಯ ನಲ್ಲೂರು ಮಸೀದಿಯಿಂದ ಬಿಜಾಪುರ ಸುಲ್ತಾನರು ಮತ್ತು ಮೈಸೂರು ಅರಸರಿಬ್ಬರ ಅನುದಾನಗಳನ್ನು ಉಲ್ಲೇಖಿಸುವ ಹಲವನ್ನೂ ಪಡೆಯಿತು -- ವಿಜಯನಗರದಿಂದ ಮೈಸೂರು ಸಂಸ್ಥಾನಕ್ಕೆ ಪರಿವರ್ತನೆಯ ಅವಧಿಯುದ್ದಕ್ಕೂ ನಿರಂತರ, ಧಾರ್ಮಿಕವಾಗಿ ಮಿಶ್ರಿತ ರಾಜ ಪೋಷಣಾ ದಾಖಲಾತಿಯ ಸಾಕ್ಷ್ಯ.'),
    citations: [c(SRC_MAD_AR_1945, 'Part I, Epigraphy summary (p. 2): Venkatapati Raya copper plates, Sringeri Mutt sannads, and Nallur mosque grant deeds')],
    review,
  },
  {
    id: 'inscription-karch-mad1945-tirumalaraya-renukacharya-plates',
    name: n('Tirumalaraya copper-plate grant possibly marking his coronation date (1571)', 'ತಿರುಮಲರಾಯನ ಪಟ್ಟಾಭಿಷೇಕ ದಿನಾಂಕವಾಗಿರಬಹುದಾದ ತಾಮ್ರಶಾಸನ (1571)'),
    date: d(1571, 1571, 'year'),
    placeId: 'place-tumakuru',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-tumakuru',
    languages: ['Sanskrit'],
    scripts: ['Nagari'],
    description: n('A 5-plate Sanskrit copper-plate grant (each plate 9.75 x 7.25 inches, Nagari script except the king\'s Kannada-script signature "Sri Virupaksha"), sent to the department by Renukacharya of Bangalore for deciphering. Issued by the Aravidu king Tirumalaraya (Tirumala Deva Raya) at the request of Karehalli Bairegauda and Krishnappa Nayaka, dated Saka 1493, Karttika su. 12 (1571 CE) -- the same date as a companion grant, "Tumkur No. 1," to different donees. The department\'s note explicitly raises the possibility that this shared date marks Tirumalaraya\'s coronation, though the record itself does not say so; Tirumalaraya is independently known to have acceded after May 1570, while Sadasiva Raya was reportedly still living.', '5-ಫಲಕಗಳ ಸಂಸ್ಕೃತ ತಾಮ್ರಶಾಸನ (ಪ್ರತಿ ಫಲಕ 9.75 x 7.25 ಇಂಚು, ರಾಜನ ಕನ್ನಡ-ಲಿಪಿಯ ಸಹಿ "ಶ್ರೀ ವಿರೂಪಾಕ್ಷ" ಹೊರತುಪಡಿಸಿ ನಾಗರಿ ಲಿಪಿಯಲ್ಲಿ), ಬೆಂಗಳೂರಿನ ರೇಣುಕಾಚಾರ್ಯರಿಂದ ಲಿಪ್ಯಂತರಕ್ಕಾಗಿ ಇಲಾಖೆಗೆ ಕಳುಹಿಸಲ್ಪಟ್ಟಿತು. ಅರವಿಡು ಅರಸ ತಿರುಮಲರಾಯ (ತಿರುಮಲ ದೇವರಾಯ)ನಿಂದ ಕರೆಹಳ್ಳಿ ಬೈರೇಗೌಡ ಮತ್ತು ಕೃಷ್ಣಪ್ಪ ನಾಯಕರ ಮನವಿಯಂತೆ ನೀಡಲ್ಪಟ್ಟಿದ್ದು, ಶಕ 1493, ಕಾರ್ತಿಕ ಶು. 12 (1571) ದಿನಾಂಕಿತ -- ಬೇರೆ ದಾನಿತರಿಗೆ ನೀಡಲಾದ ಸಹವರ್ತಿ ಅನುದಾನ "ತುಮಕೂರು ಸಂಖ್ಯೆ 1"ರ ಅದೇ ದಿನಾಂಕ. ಇಲಾಖೆಯ ಟಿಪ್ಪಣಿ ಈ ಹಂಚಿದ ದಿನಾಂಕ ತಿರುಮಲರಾಯನ ಪಟ್ಟಾಭಿಷೇಕವನ್ನು ಸೂಚಿಸಬಹುದೆಂಬ ಸಾಧ್ಯತೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಎತ್ತುತ್ತದೆ, ಆದರೂ ದಾಖಲೆ ಸ್ವತಃ ಹಾಗೆ ಹೇಳುವುದಿಲ್ಲ; ತಿರುಮಲರಾಯ 1570 ಮೇ ನಂತರ ಪಟ್ಟವೇರಿದನೆಂದು ಸ್ವತಂತ್ರವಾಗಿ ತಿಳಿದಿದೆ, ಆ ವೇಳೆಗೆ ಸದಾಶಿವರಾಯ ಇನ್ನೂ ಜೀವಂತವಿದ್ದನೆಂದು ವರದಿಯಾಗಿದೆ.'),
    citations: [c(SRC_MAD_AR_1945, 'Part VI record (pp. 106-107), sent by Mr. Renukacharya of Bangalore; cross-referenced against companion grant "Tumkur No. 1 (H.C. XII)"')],
    review,
  },
)

// Source: "History of the Wodeyars of Mysore (1610-1748)" by [author initials indistinct in OCR]
// (1996), a scholarly monograph rather than a primary-source catalogue.
const SRC_WODEYAR_HISTORY = 'src-ia-karnataka-archaeology-damh-historyofwodeyar0000asat'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-tradition-of-alamelamma',
  name: n('The tradition of Alamelamma\'s curse', 'ಅಲಮೇಲಮ್ಮನ ಶಾಪದ ಸಂಪ್ರದಾಯ'),
  category: 'religious-tradition',
  date: d(1610, 1610, 'circa'),
  polityIds: ['polity-mysore'],
  placeIds: ['place-talakad'],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['Dasara', 'royal-legend', 'curse-tradition', 'Talakad'],
  continuity: 'continuing-practice',
  description: n('A widely-held Mysore royal-family tradition, given a dedicated chapter in this monograph: on Raja Wodeyar\'s capture of Srirangapatna (1610), Alamelamma -- wife of the deposed Vijayanagara viceroy Tirumala -- fled with palace jewels to Talakad. When Raja Wodeyar\'s agents demanded the goddess Ranganayaki\'s jewels back by threat of force, she is said to have drowned herself in the Kaveri whirl at Malangi, pronouncing a three-part curse: that Talakad be buried in sand, that Malangi become a whirlpool, and that the Mysore kings be denied male heirs. Raja Wodeyar had a golden image of Alamelamma made and propitiated with expiatory rites, a special Dasara worship maintained ever since. The book notes the tradition is uncorroborated by any contemporary evidence, but observes that Mysore succession did in fact become erratic after Raja Wodeyar\'s death (his first three sons predeceased him; the line required repeated adoption from collateral branches thereafter) -- which sustained the legend\'s popular currency into the present.', 'ಈ ಗ್ರಂಥದಲ್ಲಿ ಪ್ರತ್ಯೇಕ ಅಧ್ಯಾಯವಾಗಿ ನೀಡಲಾದ, ಮೈಸೂರು ರಾಜಮನೆತನದಲ್ಲಿ ವ್ಯಾಪಕವಾಗಿ ಹರಡಿರುವ ಸಂಪ್ರದಾಯ: ರಾಜ ಒಡೆಯರ್ ಶ್ರೀರಂಗಪಟ್ಟಣವನ್ನು ವಶಪಡಿಸಿಕೊಂಡಾಗ (1610), ಪದಚ್ಯುತ ವಿಜಯನಗರ ಪ್ರಾಂತಾಧಿಪತಿ ತಿರುಮಲನ ಪತ್ನಿ ಅಲಮೇಲಮ್ಮ ಅರಮನೆಯ ಆಭರಣಗಳೊಂದಿಗೆ ತಳಕಾಡಿಗೆ ಓಡಿಹೋದಳು. ರಾಜ ಒಡೆಯರ್‌ನ ಪ್ರತಿನಿಧಿಗಳು ಬಲಪ್ರಯೋಗದ ಬೆದರಿಕೆಯೊಂದಿಗೆ ರಂಗನಾಯಕಿ ದೇವಿಯ ಆಭರಣಗಳನ್ನು ಹಿಂತಿರುಗಿಸಲು ಒತ್ತಾಯಿಸಿದಾಗ, ಅವಳು ಮಳಂಗಿಯ ಕಾವೇರಿ ಸುಳಿಯಲ್ಲಿ ಮುಳುಗಿ ಆತ್ಮಹತ್ಯೆ ಮಾಡಿಕೊಂಡಳೆಂದೂ, ಮೂರು-ಭಾಗದ ಶಾಪವನ್ನು ನುಡಿದಳೆಂದೂ ಹೇಳಲಾಗುತ್ತದೆ: ತಳಕಾಡು ಮರಳಿನಡಿ ಹೂಳಲಿ, ಮಳಂಗಿ ಸುಳಿಯಾಗಲಿ, ಮೈಸೂರು ಅರಸರಿಗೆ ಗಂಡು ಮಕ್ಕಳಿಲ್ಲದಿರಲಿ. ರಾಜ ಒಡೆಯರ್ ಅಲಮೇಲಮ್ಮನ ಚಿನ್ನದ ವಿಗ್ರಹ ಮಾಡಿಸಿ ಪ್ರಾಯಶ್ಚಿತ್ತ ವಿಧಿಗಳಿಂದ ಶಾಂತಗೊಳಿಸಿದನು, ಅಂದಿನಿಂದ ವಿಶೇಷ ದಸರಾ ಪೂಜೆ ಮುಂದುವರಿದಿದೆ. ಈ ಸಂಪ್ರದಾಯಕ್ಕೆ ಯಾವುದೇ ಸಮಕಾಲೀನ ಸಾಕ್ಷ್ಯದ ದೃಢೀಕರಣವಿಲ್ಲವೆಂದು ಗ್ರಂಥ ಗಮನಿಸುತ್ತದೆ, ಆದರೆ ರಾಜ ಒಡೆಯರ್‌ನ ಮರಣದ ನಂತರ ಮೈಸೂರು ಉತ್ತರಾಧಿಕಾರ ನಿಜವಾಗಿಯೂ ಅನಿಯಮಿತವಾಯಿತೆಂದು (ಅವನ ಮೊದಲ ಮೂವರು ಪುತ್ರರು ಅವನಿಗಿಂತ ಮೊದಲೇ ಮರಣಹೊಂದಿದರು; ನಂತರ ಪಾರ್ಶ್ವ ಶಾಖೆಗಳಿಂದ ಪದೇಪದೇ ದತ್ತು ಬೇಕಾಯಿತು) ಗಮನಿಸುತ್ತದೆ -- ಇದು ಈ ದಂತಕಥೆಯ ಜನಪ್ರಿಯ ಪ್ರಚಲಿತತೆಯನ್ನು ಇಂದಿಗೂ ಉಳಿಸಿಕೊಂಡಿದೆ.'),
  citations: [c(SRC_WODEYAR_HISTORY, '"The Tradition of Alamelamma" chapter (pp. 201-202): full narrative and the curse verse as rendered in the book, cited to the Mysore Palace Records')],
  review,
})

karnatakaArchaeologyMiningInscriptions.push(
  {
    id: 'inscription-karch-vadhy2-yellampalli-harihara-ii-compensation',
    name: n('Yellampalli inscription: compensation for a royal officer\'s death (1383)', 'ಯಳ್ಳಂಪಳ್ಳಿ ಶಾಸನ: ರಾಜಕಾರ್ಯದಲ್ಲಿ ಮೃತ ಅಧಿಕಾರಿಗೆ ಪರಿಹಾರ (1383)'),
    date: d(1383, 1383, 'year'),
    placeId: 'place-udupi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-udupi',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('A 29-line Kannada inscription found near the Vishnumurti temple at Yellampalli (now part of Neelavara village, Udupi taluk), dated Saka 1305, Rudhirodgari samvatsara (1383 CE), reign of Vijayanagara king Harihara II. Records that when Jakkanna Odeya was governing Barkur province under Harihara II\'s order, a revenue officer named Anna Nidambur died while engaged in royal service; the inscription documents compensation granted to his son Shiva Nidambur -- 1157 katti-gadyanas assigned tax-free from the revenues of Yellampalli, Pejamangur and the harivari of Kutupadi -- witnessed by Mallappa Odeya of Honnavar under orders of the dandanayaka of Mudde. A companion inscription of 1399 records a similar death-in-service compensation, suggesting the Nidambur family regularly served as karttale (local enforcers) supporting Vijayanagara\'s provincial governors on the coast. The record also references the village\'s "uru-hattu-praje" (a ten-member village assembly) and its tax allocation, including funds set aside for "uru upachara" (village-assembly expenses).', 'ಯಳ್ಳಂಪಳ್ಳಿಯ (ಈಗ ಉಡುಪಿ ತಾಲ್ಲೂಕಿನ ನೀಲಾವರ ಗ್ರಾಮದ ಭಾಗ) ವಿಷ್ಣುಮೂರ್ತಿ ದೇವಸ್ಥಾನದ ಬಳಿ ಪತ್ತೆಯಾದ 29-ಸಾಲಿನ ಕನ್ನಡ ಶಾಸನ, ಶಕ 1305, ರುಧಿರೋದ್ಗಾರಿ ಸಂವತ್ಸರ (1383) ದಿನಾಂಕಿತ, ವಿಜಯನಗರ ಅರಸ ಹರಿಹರ IIನ ಆಳ್ವಿಕೆ. ಹರಿಹರ IIನ ಆಜ್ಞೆಯಂತೆ ಜಕ್ಕಣ್ಣ ಒಡೆಯ ಬಾರಕೂರು ಪ್ರಾಂತ ಆಳುತ್ತಿದ್ದಾಗ, ಆದಾಯ ಅಧಿಕಾರಿ ಅಣ್ಣ ನಿಡಂಬೂರ ರಾಜಕಾರ್ಯದಲ್ಲಿ ನಿರತನಾಗಿದ್ದಾಗ ಮರಣ ಹೊಂದಿದನೆಂದೂ, ಅವನ ಮಗ ಶಿವ ನಿಡಂಬೂರನಿಗೆ ಪರಿಹಾರ ನೀಡಲಾಯಿತೆಂದೂ ದಾಖಲಿಸುತ್ತದೆ -- ಯಳ್ಳಂಪಳ್ಳಿ, ಪೆಜಮಂಗೂರು ಮತ್ತು ಕುತುಪಾಡಿಯ ಹರವರಿಯ ಆದಾಯದಿಂದ ತೆರಿಗೆ-ಮುಕ್ತವಾಗಿ ನಿಗದಿಪಡಿಸಿದ 1157 ಕಟ್ಟಿ-ಗದ್ಯಾಣಗಳು -- ಮುದ್ದೆಯ ದಂಡನಾಯಕನ ಆಜ್ಞೆಯಂತೆ ಹೊನ್ನಾವರದ ಮಲ್ಲಪ್ಪ ಒಡೆಯನ ಸಾಕ್ಷ್ಯದೊಂದಿಗೆ. 1399ರ ಸಹವರ್ತಿ ಶಾಸನ ಇದೇ ರೀತಿಯ ಸೇವಾ-ಮರಣ ಪರಿಹಾರವನ್ನು ದಾಖಲಿಸುತ್ತದೆ, ಇದು ನಿಡಂಬೂರ ಕುಟುಂಬ ಕರಾವಳಿಯಲ್ಲಿ ವಿಜಯನಗರದ ಪ್ರಾಂತೀಯ ಗವರ್ನರ್‌ಗಳನ್ನು ಬೆಂಬಲಿಸುವ ಕಟ್ಟಳೆಯವರಾಗಿ (ಸ್ಥಳೀಯ ಜಾರಿ ಅಧಿಕಾರಿ) ನಿಯಮಿತವಾಗಿ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಿದ್ದರೆಂದು ಸೂಚಿಸುತ್ತದೆ. ದಾಖಲೆ ಗ್ರಾಮದ "ಊರು-ಹತ್ತು ಪ್ರಜೆ" (ಹತ್ತು-ಸದಸ್ಯ ಗ್ರಾಮ ಸಭೆ) ಮತ್ತು ಅದರ ತೆರಿಗೆ ಹಂಚಿಕೆಯನ್ನೂ ಉಲ್ಲೇಖಿಸುತ್ತದೆ, "ಊರ ಉಪಚಾರ"ಕ್ಕಾಗಿ (ಗ್ರಾಮಸಭಾ ವೆಚ್ಚ) ಎತ್ತಿಟ್ಟ ನಿಧಿ ಸೇರಿ.'),
    citations: [c(SRC_VADHY_VOL2, 'B. Vasanta Shetty, "ದಕ್ಷಿಣ ಕನ್ನಡದಲ್ಲಿ ಇತ್ತೀಚೆಗೆ ದೊರೆತ ಮೂರು ವಿಜಯನಗರ ಶಾಸನಗಳು" (Three recently found Vijayanagara inscriptions in Dakshina Kannada), pp. 70-71')],
    review,
  },
  {
    id: 'inscription-karch-vadhy2-ajri-janani-privileges',
    name: n('Ajri inscription: privileges of the "janani" landholding officials (1428)', 'ಅಜ್ರಿ ಶಾಸನ: "ಜನನಿ" ಭೂಒಡೆತನ ಅಧಿಕಾರಿಗಳ ಸವಲತ್ತುಗಳು (1428)'),
    date: d(1428, 1428, 'year'),
    placeId: 'place-udupi',
    polityId: 'polity-vijayanagara',
    districtAuditId: 'audit-udupi',
    languages: ['Kannada'],
    scripts: ['Kannada'],
    description: n('A 29-line Kannada inscription found at Tenku Bayalu, Ajri village (Kundapura taluk), dated Saka 1349, Vartamana Parabhava samvatsara (1428 CE), reign of Vijayanagara king Devaraya II, when Mahamantri Narasimhadeva Odeya administered Barkur province and Achappa held charge of the Ajri (Ajire)-Mungina Nadu locality. The inscription records that Ajri had six landholding officials known as "janani," naming three principal ones -- Tannu Heggade, Beera Heggade and Chonu Heggade -- who jointly set out a katta (rule/regulation) exempting the localities of Tenku Bayalu, Holetalamane, Todu and Ambalagere from tax collection and from entry by soldiers (bantaru) or officials. The record shows these janani held a recognized, land-based standing in Barkur-province village administration -- attested elsewhere (a Herange inscription) receiving ceremonial payment when summoned -- serving as witnesses and administrators in land allocation, sale and mortgage matters.', 'ಅಜ್ರಿ ಗ್ರಾಮದ (ಕುಂದಾಪುರ ತಾಲ್ಲೂಕು) ತೆಂಕು ಬಯಲಿನಲ್ಲಿ ಪತ್ತೆಯಾದ 29-ಸಾಲಿನ ಕನ್ನಡ ಶಾಸನ, ಶಕ 1349, ವರ್ತಮಾನ ಪರಾಭವ ಸಂವತ್ಸರ (1428) ದಿನಾಂಕಿತ, ವಿಜಯನಗರ ಅರಸ ದೇವರಾಯ IIನ ಆಳ್ವಿಕೆ, ಆಗ ಮಹಾಮಂತ್ರಿ ನರಸಿಂಹದೇವ ಒಡೆಯ ಬಾರಕೂರು ಪ್ರಾಂತ ಆಳುತ್ತಿದ್ದು, ಅಚಪ್ಪ ಅಜ್ರಿ (ಅಜಿರೆ)-ಮುಂಗಿನ ನಾಡಿನ ಉಸ್ತುವಾರಿ ಹೊಂದಿದ್ದ. ಶಾಸನ ಅಜ್ರಿಯಲ್ಲಿ ಆರು "ಜನನಿ" ಎಂಬ ಭೂಒಡೆತನ ಅಧಿಕಾರಿಗಳಿದ್ದರೆಂದೂ, ಅವರಲ್ಲಿ ಮೂವರು ಮುಖ್ಯರಾದ ತನ್ನು ಹೆಗ್ಗಡೆ, ಬೀರ ಹೆಗ್ಗಡೆ ಮತ್ತು ಚೋಣು ಹೆಗ್ಗಡೆ ಜಂಟಿಯಾಗಿ ತೆಂಕು ಬಯಲು, ಹೊಳೆತಳಮನೆ, ತೋಡು ಮತ್ತು ಅಂಬಲಗೆರೆ ಪ್ರದೇಶಗಳನ್ನು ತೆರಿಗೆ ವಸೂಲಿ ಮತ್ತು ಸೈನಿಕರ (ಬಂಟರು) ಅಥವಾ ಅಧಿಕಾರಿಗಳ ಪ್ರವೇಶದಿಂದ ವಿನಾಯಿತಿಗೊಳಿಸುವ ಕಟ್ಟನ್ನು (ನಿಯಮ) ಸ್ಥಾಪಿಸಿದರೆಂದೂ ದಾಖಲಿಸುತ್ತದೆ. ಈ ಜನನಿಗಳು ಬಾರಕೂರು ಪ್ರಾಂತದ ಗ್ರಾಮಾಡಳಿತದಲ್ಲಿ ಗುರುತಿಸಲ್ಪಟ್ಟ, ಭೂ-ಆಧಾರಿತ ಸ್ಥಾನಮಾನ ಹೊಂದಿದ್ದರೆಂದು ದಾಖಲೆ ತೋರಿಸುತ್ತದೆ -- ಬೇರೆಡೆ (ಹೆರಂಜೆ ಶಾಸನ) ಕರೆಸಿದಾಗ ಗೌರವ ಸಂದಾಯ ಪಡೆಯುತ್ತಿದ್ದರೆಂದು ದೃಢಪಟ್ಟಿದೆ -- ಭೂಮಿ ಹಂಚಿಕೆ, ಮಾರಾಟ ಮತ್ತು ಅಡವು ವಿಷಯಗಳಲ್ಲಿ ಸಾಕ್ಷಿಗಳಾಗಿ ಮತ್ತು ಆಡಳಿತಗಾರರಾಗಿ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಿದ್ದರು.'),
    citations: [c(SRC_VADHY_VOL2, 'B. Vasanta Shetty, "ದಕ್ಷಿಣ ಕನ್ನಡದಲ್ಲಿ ಇತ್ತೀಚೆಗೆ ದೊರೆತ ಮೂರು ವಿಜಯನಗರ ಶಾಸನಗಳು" (Three recently found Vijayanagara inscriptions in Dakshina Kannada), pp. 71-72')],
    review,
  },
)

// Source: "Vijayanagara Adhyayana" Volume 3 (Directorate of Archaeology and Museums, Mysore, 1998).
const SRC_VADHY_VOL3 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadha0000mlsh'

// Kampili was the immediate political predecessor of Vijayanagara: a Tungabhadra-doab chiefdom
// whose ruler Kampilaraya, based at Kummatadurga (just 12 km from Hampi), fought and finally fell
// to Delhi Sultanate forces c. 1327 CE -- only nine years before the Vijayanagara empire rose at
// Hampi itself. Not previously present anywhere in this atlas.
export const karnatakaArchaeologyMiningPolities = [
  {
    id: 'polity-kampili',
    name: n('Kampili chiefdom', 'ಕಂಪಿಲಿ ಸಂಸ್ಥಾನ'),
    type: 'kingdom',
    date: { from: 1280, to: 1327, era: 'CE', precision: 'range' },
    capitalId: 'place-kummata',
    color: '#7a5230',
    description: n('A Tungabhadra-doab chiefdom centred on the twin fortresses of Hanamsagar/Doravadi (under founder Mummadi Singa, r. c. 1280-1287) and later Kummatadurga and Hosamaledurga (under his son Kampilaraya). Kampilaraya repelled three separate Delhi Sultanate expeditions before a large invasion force finally besieged Kummatadurga for months in 1327 CE; he died fighting outside its walls rather than surrender. Kummatadurga lies barely 12 km from Hampi, and the Vijayanagara empire rose there just nine years later, in 1336 -- making Kampili its immediate and closest political predecessor in the same landscape.', 'ಸ್ಥಾಪಕ ಮುಮ್ಮಡಿ ಸಿಂಗ (ಆ. ಸು. 1280-1287) ಕಾಲದಲ್ಲಿ ಹನಮಸಾಗರ/ದೊರವಡಿ ಅವಳಿ ಕೋಟೆಗಳ, ಮತ್ತು ನಂತರ ಅವನ ಮಗ ಕಂಪಿಲರಾಯನ ಕಾಲದಲ್ಲಿ ಕುಮ್ಮಟದುರ್ಗ ಮತ್ತು ಹೊಸಮಲೆದುರ್ಗದ ಸುತ್ತ ಕೇಂದ್ರಿತವಾದ ತುಂಗಭದ್ರಾ ದ್ವಿಪ್ರದೇಶದ ಸಂಸ್ಥಾನ. ಕಂಪಿಲರಾಯ ಮೂರು ಪ್ರತ್ಯೇಕ ದಿಲ್ಲಿ ಸುಲ್ತಾನೀ ದಂಡಯಾತ್ರೆಗಳನ್ನು ಹಿಮ್ಮೆಟ್ಟಿಸಿದನು, ಕೊನೆಗೆ 1327ರಲ್ಲಿ ಒಂದು ದೊಡ್ಡ ಆಕ್ರಮಣ ಪಡೆ ಕುಮ್ಮಟದುರ್ಗವನ್ನು ತಿಂಗಳುಗಟ್ಟಲೆ ಮುತ್ತಿದಾಗ, ಶರಣಾಗುವ ಬದಲು ಕೋಟೆಯ ಹೊರಗೆ ಹೋರಾಡುತ್ತಾ ವೀರಮರಣ ಹೊಂದಿದನು. ಕುಮ್ಮಟದುರ್ಗ ಹಂಪೆಯಿಂದ ಕೇವಲ 12 ಕಿ.ಮೀ. ದೂರದಲ್ಲಿದ್ದು, ಕೇವಲ ಒಂಬತ್ತು ವರ್ಷಗಳ ನಂತರ, 1336ರಲ್ಲಿ, ಅದೇ ಭೂಪ್ರದೇಶದಲ್ಲಿ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಉದಯಿಸಿತು -- ಕಂಪಿಲಿಯನ್ನು ಅದರ ಅತ್ಯಂತ ಸಮೀಪದ ರಾಜಕೀಯ ಪೂರ್ವಗಾಮಿಯನ್ನಾಗಿ ಮಾಡುತ್ತದೆ.'),
    extent: { type: 'Polygon', coordinates: [[76.1, 15.6], [76.7, 15.6], [76.7, 15.1], [76.1, 15.1], [76.1, 15.6]], precision: 'schematic' },
    citations: [c(SRC_VADHY_VOL3, 'Channabasappa S. Patil, "ಮುಮ್ಮಡಿ ಸಿಂಗನ ಮೇಲೆ ಮತ್ತಷ್ಟು ಬೆಳಕು" (More light on Mummadi Singa), pp. 93-95: political-history summary drawing on the author\'s earlier published research')],
    review,
  },
]

karnatakaArchaeologyMiningInscriptions.push({
  id: 'inscription-karch-vadhy3-va-museum-erambarage-jinalaya',
  name: n('Victoria & Albert Museum Parshvanatha pedestal inscription: Mummadi Singa and the Erambarage Jinalaya (c. late 13th century)', 'ವಿಕ್ಟೋರಿಯಾ ಮತ್ತು ಆಲ್ಬರ್ಟ್ ಮ್ಯೂಸಿಯಂ ಪಾರ್ಶ್ವನಾಥ ಪೀಠ ಶಾಸನ: ಮುಮ್ಮಡಿ ಸಿಂಗ ಮತ್ತು ಎರಂಬರಗೆ ಜಿನಾಲಯ (ಸು. 13ನೇ ಶತಮಾನದ ಅಂತ್ಯ)'),
  date: d(1275, 1300, 'range'),
  placeId: 'place-koppal',
  polityId: 'polity-kampili',
  districtAuditId: 'audit-koppal',
  languages: ['Kannada'],
  scripts: ['Kannada'],
  description: n('An undated Kannada inscription on the pedestal of a Parshvanatha sculpture, noticed by the epigraphist Channabasappa S. Patil during a 1995 visit to the Victoria and Albert Museum, London -- letter forms place it in the late 13th century CE. It records that the Jain dharma/community at Erambarage (identified with present-day Yalburga, Koppal district) was disrupted by "the persecution of Mummadi Singa" (mummudi singana badheyinda), after which the Acharya Balendu Maladhari intervened; the shrine was subsequently rebuilt when Mallisetti, son of Ketisetti of Mindaguddi, had the image of Parshvadeva made for the renovated Jinalaya at Erambarage. Patil identifies this Mummadi Singa with the Kampili chiefdom\'s founder (r. c. 1280-1287, attested at Kummata by a Lakshmeshwar inscription of 1287), making this the only known record of friction between the Kampili chiefs and a local Jain community -- notable since Kampilaraya\'s dynasty is otherwise remembered, via other inscriptions and the Panchala-Ganga Chennarama\'s Samgatya poem, as reasserting control over Kummata\'s Jain population after displacing them.', 'ಶಾಸನಶಾಸ್ತ್ರಜ್ಞ ಚನ್ನಬಸಪ್ಪ ಎಸ್. ಪಾಟೀಲ 1995ರಲ್ಲಿ ಲಂಡನ್‌ನ ವಿಕ್ಟೋರಿಯಾ ಮತ್ತು ಆಲ್ಬರ್ಟ್ ಮ್ಯೂಸಿಯಂಗೆ ಭೇಟಿ ನೀಡಿದಾಗ ಗಮನಿಸಿದ, ಪಾರ್ಶ್ವನಾಥ ಶಿಲ್ಪದ ಪೀಠದ ಮೇಲಿನ ದಿನಾಂಕವಿಲ್ಲದ ಕನ್ನಡ ಶಾಸನ -- ಅಕ್ಷರ ಆಕಾರಗಳು ಇದನ್ನು 13ನೇ ಶತಮಾನದ ಅಂತ್ಯಕ್ಕೆ ಇರಿಸುತ್ತವೆ. ಎರಂಬರಗೆಯ (ಈಗಿನ ಕೊಪ್ಪಳ ಜಿಲ್ಲೆಯ ಯಲಬುರ್ಗ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ) ಜೈನ ಧರ್ಮ/ಸಮುದಾಯ "ಮುಮ್ಮಡಿ ಸಿಂಗನ ಬಾಧೆಯಿಂದ" ಅಸ್ತವ್ಯಸ್ತಗೊಂಡಿತೆಂದೂ, ನಂತರ ಆಚಾರ್ಯ ಬಾಳೇಂದು ಮಲಧಾರಿ ಮಧ್ಯಪ್ರವೇಶಿಸಿದನೆಂದೂ ದಾಖಲಿಸುತ್ತದೆ; ಮಿಂಡಗುದಲಿಯ ಕೇತಿಸೆಟ್ಟಿಯ ಮಗ ಮಲ್ಲಿಸೆಟ್ಟಿ ಎರಂಬರಗೆಯ ನವೀಕರಿಸಿದ ಜಿನಾಲಯಕ್ಕೆ ಪಾರ್ಶ್ವದೇವರ ವಿಗ್ರಹವನ್ನು ಮಾಡಿಸಿದಾಗ ದೇವಾಲಯ ನಂತರ ಪುನರ್ನಿರ್ಮಾಣಗೊಂಡಿತು. ಪಾಟೀಲ ಈ ಮುಮ್ಮಡಿ ಸಿಂಗನನ್ನು ಕಂಪಿಲಿ ಸಂಸ್ಥಾನದ ಸ್ಥಾಪಕ (ಆ. ಸು. 1280-1287, 1287ರ ಲಕ್ಷ್ಮೇಶ್ವರ ಶಾಸನದಿಂದ ಕುಮ್ಮಟದಲ್ಲಿ ದೃಢಪಟ್ಟ) ಎಂದು ಗುರುತಿಸುತ್ತಾರೆ, ಇದು ಕಂಪಿಲಿ ಮುಖಂಡರು ಮತ್ತು ಸ್ಥಳೀಯ ಜೈನ ಸಮುದಾಯದ ನಡುವಿನ ಘರ್ಷಣೆಯ ಏಕೈಕ ತಿಳಿದ ದಾಖಲೆಯಾಗಿಸುತ್ತದೆ -- ಇತರೆಡೆ, ಬೇರೆ ಶಾಸನಗಳು ಮತ್ತು ಪಾಂಚಾಳ ಗಂಗನ ಚೆನ್ನರಾಮನ ಸಾಂಗತ್ಯ ಕಾವ್ಯದ ಮೂಲಕ, ಕಂಪಿಲರಾಯನ ವಂಶ ಕುಮ್ಮಟದ ಜೈನ ಜನಸಂಖ್ಯೆಯನ್ನು ಸ್ಥಳಾಂತರಿಸಿದ ನಂತರ ಮತ್ತೆ ನಿಯಂತ್ರಣ ಸ್ಥಾಪಿಸಿದಂತೆ ಸ್ಮರಿಸಲ್ಪಡುತ್ತಾರೆ ಎಂಬ ಕಾರಣಕ್ಕೆ ಗಮನಾರ್ಹ.'),
  citations: [c(SRC_VADHY_VOL3, 'Channabasappa S. Patil, "ಮುಮ್ಮಡಿ ಸಿಂಗನ ಮೇಲೆ ಮತ್ತಷ್ಟು ಬೆಳಕು" (More light on Mummadi Singa), pp. 93-95: inscription noticed at the Victoria & Albert Museum, London, 1995; full Kannada text transcribed')],
  review,
})

// Source: "Vijayanagara Adhyayana" Volume 4 (Directorate of Archaeology and Museums, Mysore, 1999).
const SRC_VADHY_VOL4 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadha0000-4mvkr'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-vitthala-temple-sangama-era-dating',
  name: n('Case for a Sangama-era (pre-Krishnadevaraya) core at the Vitthala Temple, Hampi', 'ಹಂಪಿಯ ವಿಠ್ಠಲ ದೇವಾಲಯದ ಮೂಲ ರಚನೆ ಸಂಗಮ-ಕಾಲದ್ದೆಂಬ ವಾದ (ಕೃಷ್ಣದೇವರಾಯನಿಗಿಂತ ಮುಂಚಿನದು)'),
  category: 'architecture',
  date: d(1336, 1485, 'range'),
  polityIds: ['polity-vijayanagara'],
  placeIds: ['place-hampi-vittala'],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['Vaishnava', 'Sangama-dynasty', 'dating-debate', 'Vitthala', 'stone-chariot'],
  continuity: 'material-survival',
  description: n('Against the popular belief that Krishnadevaraya built Hampi\'s celebrated Vitthala Temple after bringing the deity\'s image from Pandharpur, the scholar Sharanabasappa Kolkar argues from multiple independent sources that the temple\'s core structure -- garbhagriha, sukhanasi, circumambulatory path, a sixteen-pillar ranga-mantapa and the famous 56-pillar maharanga-mantapa -- was already standing under the earlier Sangama dynasty (1336-1485). The case rests on Talapakkam Annamacharya\'s (1408-1503) kirtana describing Vitthala and Rukmini settling on the Tungabhadra bank; Haribhatta\'s "Uttara Narasimha Puranam," which places the temple in the 14th century and credits Proluganti Tippanna, an officer of Praudhadevaraya (r. 1426-1446), with building its bhoga-mantapa; and a 1408 CE Sirali inscription recording a gift made "in the presence of Vitthala on the Tungabhadra bank" -- there being no other riverside Vitthala shrine it could refer to. On this reading, Krishnadevaraya\'s own inscriptions credit him only with the hundred-pillared mandapa, with his queens responsible for the gopuras, and the "Krishnadevaraya built it" tradition reflects the Vaishnava resurgence of his reign being retrospectively credited with a temple that already existed -- notwithstanding that Sangama kings were themselves largely Shaiva, though not exclusively (Bukkaraya\'s Shravanabelagola record and his daughter-in-law Gangadevi\'s Madhura Vijayam both attest Vaishnava activity under the dynasty).', 'ಕೃಷ್ಣದೇವರಾಯ ಪಂಢರಾಪುರದಿಂದ ದೇವರ ವಿಗ್ರಹ ತಂದು ಹಂಪಿಯ ಪ್ರಸಿದ್ಧ ವಿಠ್ಠಲ ದೇವಾಲಯ ಕಟ್ಟಿಸಿದನೆಂಬ ಜನಪ್ರಿಯ ನಂಬಿಕೆಗೆ ವಿರುದ್ಧವಾಗಿ, ವಿದ್ವಾಂಸ ಶರಣಬಸಪ್ಪ ಕೋಲ್ಕಾರ ಹಲವು ಸ್ವತಂತ್ರ ಆಕರಗಳಿಂದ ದೇವಾಲಯದ ಮೂಲ ರಚನೆ -- ಗರ್ಭಗೃಹ, ಸುಖನಾಸಿ, ಪ್ರದಕ್ಷಿಣಾಪಥ, ಹದಿನಾರು-ಕಂಬದ ರಂಗಮಂಟಪ ಮತ್ತು ಪ್ರಸಿದ್ಧ 56-ಕಂಬದ ಮಹಾರಂಗಮಂಟಪ -- ಈಗಾಗಲೇ ಹಿಂದಿನ ಸಂಗಮ ವಂಶದ (1336-1485) ಕಾಲದಲ್ಲಿ ನಿಂತಿತ್ತೆಂದು ವಾದಿಸುತ್ತಾರೆ. ಈ ವಾದ ತಾಳಪಕ್ಕಂ ಅಣ್ಣಮಾಚಾರ್ಯರ (1408-1503) ಕೀರ್ತನೆ, ವಿಠ್ಠಲ ಮತ್ತು ರುಕ್ಮಿಣಿ ತುಂಗಭದ್ರಾ ದಡದಲ್ಲಿ ನೆಲೆನಿಂತರೆಂದು ವರ್ಣಿಸುತ್ತದೆ; ಹರಿಭಟ್ಟನ "ಉತ್ತರ ನರಸಿಂಹ ಪುರಾಣಂ," ಇದು ದೇವಾಲಯವನ್ನು 14ನೇ ಶತಮಾನಕ್ಕೆ ಇರಿಸಿ ಪ್ರೌಢದೇವರಾಯನ (ಆ. 1426-1446) ಅಧಿಕಾರಿ ಪ್ರೊಳುಗಂಟಿ ತಿಪ್ಪಣ್ಣನಿಗೆ ಭೋಗಮಂಟಪ ನಿರ್ಮಾಣದ ಶ್ರೇಯ ನೀಡುತ್ತದೆ; ಮತ್ತು ಶಕ 1408ರ ಶಿರಾಲಿ ಶಾಸನ, "ತುಂಗಭದ್ರಾ ದಡದ ವಿಠ್ಠಲನ ಸನ್ನಿಧಿಯಲ್ಲಿ" ಮಾಡಿದ ದಾನವನ್ನು ದಾಖಲಿಸುತ್ತದೆ -- ಇದು ಸೂಚಿಸಬಹುದಾದ ಬೇರೆ ಯಾವುದೇ ನದೀತೀರದ ವಿಠ್ಠಲ ದೇವಾಲಯವಿಲ್ಲ. ಈ ವಾಚನದಂತೆ, ಕೃಷ್ಣದೇವರಾಯನ ಸ್ವಂತ ಶಾಸನಗಳು ಅವನಿಗೆ ಕೇವಲ ನೂರುಕಂಬಗಳ ಮಂಟಪದ ಶ್ರೇಯವನ್ನು ಮಾತ್ರ ನೀಡುತ್ತವೆ, ಗೋಪುರಗಳ ಶ್ರೇಯ ಅವನ ರಾಣಿಯರಿಗೆ ಸಲ್ಲುತ್ತದೆ, ಮತ್ತು "ಕೃಷ್ಣದೇವರಾಯ ಕಟ್ಟಿಸಿದ" ಎಂಬ ಸಂಪ್ರದಾಯ ಅವನ ಕಾಲದ ವೈಷ್ಣವ ಪುನರುತ್ಥಾನ ಈಗಾಗಲೇ ಇದ್ದ ದೇವಾಲಯಕ್ಕೆ ಹಿಂದಿನಿಂದ ಶ್ರೇಯ ನೀಡಿದ್ದನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತದೆ -- ಸಂಗಮ ಅರಸರು ಬಹುತೇಕ ಶೈವರಾಗಿದ್ದರೂ, ಪ್ರತ್ಯೇಕವಾಗಿ ಅಲ್ಲ (ಬುಕ್ಕರಾಯನ ಶ್ರವಣಬೆಳಗೊಳ ದಾಖಲೆ ಮತ್ತು ಅವನ ಸೊಸೆ ಗಂಗಾದೇವಿಯ ಮಧುರಾ ವಿಜಯಂ ಎರಡೂ ವಂಶದಡಿ ವೈಷ್ಣವ ಚಟುವಟಿಕೆಯನ್ನು ದೃಢಪಡಿಸುತ್ತವೆ).'),
  citations: [c(SRC_VADHY_VOL4, 'Sharanabasappa Kolkar, "ಹಂಪಿಯ ವಿಠ್ಠಲ ದೇವಾಲಯ: ನಿರ್ಮಾಣ ಕಾಲ ಮತ್ತು ಸಂದ ದಾನಗಳು" (The Vitthala Temple, Hampi: construction date and grants made to it), pp. 27-28')],
  review,
})

// Source: "Vijayanagara Adhyayana" Volume 5 (Directorate of Archaeology and Museums, Mysore, 2000).
const SRC_VADHY_VOL5 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadhysamputa-5-0000prom'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-hampi-second-elephant-enclosure-excavation',
  name: n('Excavated second elephant enclosure near the Lotus Mahal, Hampi', 'ಹಂಪಿಯ ಕಮಲ ಮಹಲ್ ಬಳಿಯ ಉತ್ಖನನಗೊಂಡ ಎರಡನೇ ಆನೆ ಆವರಣ'),
  category: 'architecture',
  date: d(1400, 1565, 'range'),
  polityIds: ['polity-vijayanagara'],
  placeIds: ['place-hampi'],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['elephant-stable', 'excavation', 'faunal-remains', 'royal-city-infrastructure'],
  continuity: 'material-survival',
  description: n('T.M. Manjunathayya\'s paper argues the well-known "Elephant Stables" monument at Vijayanagara has room for only eleven elephants -- too few for the empire\'s much larger elephant corps -- and that a second, larger enclosure must have existed for ordinary (non-royal-family) elephants. He identifies this with a 168 x 105 metre walled enclosure between the Lotus Mahal (Kamal Mahal) and the Ramachandra Temple, behind the present tourist canteen, excavated by the Directorate of Archaeology and Museums. The excavation uncovered an elephant skeleton buried in a corner (apparently because the dead animal could not be moved out), partial remains of 28 human skeletons, a doorway, stone feeding troughs (1.5m wide, 6m long, too small for human habitation), a water channel and storage trough bearing a Ganesha sculpture, and a stone lamp-post flanked by carved elephants. A layer of black ash across the site is interpreted as burnt fodder and dung from the time of Vijayanagara\'s fall in 1565. A stone inscription found within the enclosure -- undated beyond a cyclic year (Shubhakritu, Chaitra shuddha 7) -- records a grant by one Konamarasa to the "Narasimha deity near the elephant stable," funded from Vijayanagara city\'s talavarike (watch-duty) tax revenue.', 'ಟಿ.ಎಂ. ಮಂಜುನಾಥಯ್ಯನ ಪ್ರಬಂಧ ವಿಜಯನಗರದ ಪ್ರಸಿದ್ಧ "ಆನೆ ಸಾಲೆ" ಸ್ಮಾರಕದಲ್ಲಿ ಕೇವಲ ಹನ್ನೊಂದು ಆನೆಗಳಿಗೆ ಮಾತ್ರ ಸ್ಥಳಾವಕಾಶವಿದೆ ಎಂದೂ -- ಸಾಮ್ರಾಜ್ಯದ ಬಹಳ ದೊಡ್ಡ ಆನೆ ಪಡೆಗೆ ಇದು ಸಾಕಾಗುವುದಿಲ್ಲ ಎಂದೂ -- ಸಾಮಾನ್ಯ (ರಾಜಪರಿವಾರೇತರ) ಆನೆಗಳಿಗಾಗಿ ಎರಡನೇ, ದೊಡ್ಡ ಆವರಣ ಇದ್ದಿರಬೇಕೆಂದೂ ವಾದಿಸುತ್ತಾರೆ. ಇದನ್ನು ಅವರು ಕಮಲ ಮಹಲ್ ಮತ್ತು ರಾಮಚಂದ್ರ ದೇವಾಲಯದ ನಡುವಿನ, ಈಗಿನ ಪ್ರವಾಸಿ ಕ್ಯಾಂಟೀನ್ ಹಿಂದಿನ 168 x 105 ಮೀಟರ್ ಗೋಡೆಯ ಆವರಣದೊಂದಿಗೆ ಗುರುತಿಸುತ್ತಾರೆ, ಪ್ರಾಚ್ಯವಸ್ತು ಮತ್ತು ಸಂಗ್ರಹಾಲಯಗಳ ನಿರ್ದೇಶನಾಲಯದಿಂದ ಉತ್ಖನನಗೊಂಡಿದೆ. ಉತ್ಖನನ ಆವರಣದ ಮೂಲೆಯಲ್ಲಿ ಹೂತಿದ್ದ ಆನೆಯ ಅಸ್ಥಿಪಂಜರವನ್ನು (ಸತ್ತ ಪ್ರಾಣಿಯನ್ನು ಹೊರಗೆ ಸಾಗಿಸಲಾಗದ ಕಾರಣ ಎಂದು ತೋರುತ್ತದೆ), 28 ಮಾನವ ಅಸ್ಥಿಪಂಜರಗಳ ಭಾಗಗಳನ್ನು, ಬಾಗಿಲನ್ನು, ಶಿಲಾ ಗೋದಲಿಗಳನ್ನು (1.5 ಮೀ ಅಗಲ, 6 ಮೀ ಉದ್ದ, ಮಾನವ ವಾಸಕ್ಕೆ ತೀರಾ ಚಿಕ್ಕದು), ಗಣೇಶ ಶಿಲ್ಪವಿರುವ ನೀರಿನ ಕಾಲುವೆ ಮತ್ತು ಸಂಗ್ರಹಣಾ ತೊಟ್ಟಿಯನ್ನು, ಮತ್ತು ಆನೆಗಳ ಕೆತ್ತನೆಯುಳ್ಳ ಕಲ್ಲಿನ ದೀಪಸ್ತಂಭವನ್ನು ಬಯಲಿಗೆ ತಂದಿತು. ತಾಣದಾದ್ಯಂತ ಇರುವ ಕಪ್ಪು ಬೂದಿಯ ಪದರವನ್ನು 1565ರ ವಿಜಯನಗರದ ಪತನ ಕಾಲದ ಸುಟ್ಟ ಮೇವು ಮತ್ತು ಸಗಣಿ ಎಂದು ಅರ್ಥೈಸಲಾಗಿದೆ. ಆವರಣದೊಳಗೆ ಪತ್ತೆಯಾದ ಶಿಲಾಶಾಸನ -- ಚಕ್ರೀಯ ವರ್ಷಕ್ಕಿಂತ (ಶುಭಕೃತು, ಚೈತ್ರ ಶುದ್ಧ 7) ಹೆಚ್ಚಿಗೆ ದಿನಾಂಕವಿಲ್ಲ -- ಕೋನಮರಸ ಎಂಬಾತ "ಆನೆ ಸಾಲೆಯ ಬಳಿಯ ನರಸಿಂಹ ದೇವರಿಗೆ" ವಿಜಯನಗರ ಪಟ್ಟಣದ ತಳವಾರಿಕೆ (ಕಾವಲು ಕರ್ತವ್ಯ) ತೆರಿಗೆ ಆದಾಯದಿಂದ ಅನುದಾನ ನೀಡಿದ್ದನ್ನು ದಾಖಲಿಸುತ್ತದೆ.'),
  citations: [c(SRC_VADHY_VOL5, 'T.M. Manjunathayya, "ವಿಜಯನಗರ ಪಟ್ಟಣದಲ್ಲಿಯ ಆನೆಯ ಸಾಲೆ" (The elephant stable at Vijayanagara city), pp. 31-36: excavation report and inscription text')],
  review,
})

// Source: "Vijayanagara Adhyayana" Volume 6 (Directorate of Archaeology and Museums, Mysore, 2001).
const SRC_VADHY_VOL6 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadha0000mvkr'

export const karnatakaArchaeologyMiningCoinRecords = [
  {
    id: 'coin-krishnadevaraya-saraswati-copper-lead',
    name: n('Krishnadevaraya "Saraswati-only" copper coin (unpublished, 20th recorded type)', 'ಕೃಷ್ಣದೇವರಾಯನ "ಕೇವಲ ಸರಸ್ವತಿ" ತಾಮ್ರ ನಾಣ್ಯ ದಾರಿ (ಅಪ್ರಕಟಿತ, 20ನೇ ದಾಖಲಿತ ನಮೂನೆ)'),
    coinKind: 'dynastic-coinage-lead',
    polityId: 'polity-vijayanagara',
    placeId: 'place-hampi',
    date: d(1509, 1529, 'range'),
    material: 'copper',
    weightGrams: 3.15,
    diameterMm: 12,
    obverse: n('Published from a private collection by the numismatist N. Havalayya as an unrecorded type, absent from every major published Vijayanagara coin catalogue to date (Narasimhamurthy 1991/1997, Ganesh & Girijapati 1998, Ramesan, Shankaranarayana 1997). Circular, 1.2 cm diameter, 1 mm thick, 3.150 g. Obverse shows a crowned goddess seated behind/with a peacock, her left hand slightly raised holding an indistinct object; no veena or book is shown. Havalayya identifies her as Saraswati on the strength of the peacock, her vahana, even though her standard attributes (veena, book) -- well attested on other Vijayanagara-period Saraswati sculptures -- are pointedly omitted here.', 'ಖಾಸಗಿ ಸಂಗ್ರಹದಿಂದ ನಾಣ್ಯಶಾಸ್ತ್ರಜ್ಞ ಎನ್. ಹವಳಯ್ಯರಿಂದ ಅಪ್ರಕಟಿತ ನಮೂನೆಯಾಗಿ ಪ್ರಕಟಿತ, ಇದುವರೆಗಿನ ಯಾವುದೇ ಪ್ರಮುಖ ಪ್ರಕಟಿತ ವಿಜಯನಗರ ನಾಣ್ಯ ಪಟ್ಟಿಯಲ್ಲಿ (ನರಸಿಂಹಮೂರ್ತಿ 1991/1997, ಗಣೇಶ & ಗಿರಿಜಾಪತಿ 1998, ರಮೇಶನ್, ಶಂಕರನಾರಾಯಣ 1997) ಇಲ್ಲ. ವರ್ತುಲಾಕಾರ, 1.2 ಸೆಂ.ಮೀ ವ್ಯಾಸ, 1 ಮಿ.ಮೀ ದಪ್ಪ, 3.150 ಗ್ರಾಂ. ಮುಮ್ಮುಖದಲ್ಲಿ ಕಿರೀಟಧಾರಿ ದೇವತೆ ನವಿಲಿನ ಹಿಂಬದಿಯಲ್ಲಿ/ಜೊತೆ ಕುಳಿತಿದ್ದು, ಎಡಗೈ ಸ್ವಲ್ಪ ಮೇಲೆತ್ತಿ ಅಸ್ಪಷ್ಟ ವಸ್ತುವನ್ನು ಹಿಡಿದಿದೆ; ವೀಣೆ ಅಥವಾ ಪುಸ್ತಕ ಇಲ್ಲ. ಹವಳಯ್ಯ ಈಕೆಯನ್ನು ನವಿಲಿನ (ಆಕೆಯ ವಾಹನ) ಆಧಾರದ ಮೇಲೆ ಸರಸ್ವತಿಯೆಂದು ಗುರುತಿಸುತ್ತಾರೆ, ಇತರ ವಿಜಯನಗರ-ಕಾಲದ ಸರಸ್ವತಿ ಶಿಲ್ಪಗಳಲ್ಲಿ ಚೆನ್ನಾಗಿ ದೃಢಪಟ್ಟ ಆಕೆಯ ಪ್ರಮಾಣಿತ ಚಿಹ್ನೆಗಳನ್ನು (ವೀಣೆ, ಪುಸ್ತಕ) ಇಲ್ಲಿ ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಬಿಟ್ಟಿದ್ದರೂ.'),
    reverse: n('Three-line Nagari-script legend: "Pratapa / Krishna / Raya." The author situates this within a broader Vijayanagara numismatic tradition of paired-deity coinage (Shiva-Parvati, Lakshmi-Narayana, Lakshmi-Narasimha, Rama-Sita, Venkateshwara-Sridevi-Bhudevi, Brahma-Saraswati) inaugurated by Harihara II, whose own gold half-varaha shows Brahma and Saraswati together with a matching three-line "Pratapa Harihara" legend. Krishnadevaraya\'s coinage, by contrast, frequently depicts only one deity from such a pair (as on his separately known Balakrishna, Venkateshwara-only, and lotus-seated-Lakshmi-only types) -- so this coin\'s Saraswati-without-Brahma design is read as consistent with that personal preference rather than as evidence Brahma held reduced religious status. Before this find, 19 gold/silver/copper types were catalogued for Krishnadevaraya; this is recorded as the 20th, with the author noting many more likely remain undocumented.', 'ಮೂರು-ಸಾಲಿನ ನಾಗರಿ-ಲಿಪಿಯ ಲೇಖ: "ಪ್ರತಾಪ / ಕೃಷ್ಣ / ರಾಯ." ಲೇಖಕರು ಇದನ್ನು ಹರಿಹರ IIನಿಂದ ಪ್ರಾರಂಭಿಸಲಾದ ವಿಶಾಲ ವಿಜಯನಗರ ನಾಣ್ಯಶಾಸ್ತ್ರ ಪರಂಪರೆಯೊಳಗೆ ಇರಿಸುತ್ತಾರೆ -- ಜೋಡಿ-ದೇವತಾ ನಾಣ್ಯಗಳ (ಶಿವ-ಪಾರ್ವತಿ, ಲಕ್ಷ್ಮೀ-ನಾರಾಯಣ, ಲಕ್ಷ್ಮೀ-ನರಸಿಂಹ, ರಾಮ-ಸೀತೆ, ವೆಂಕಟೇಶ್ವರ-ಶ್ರೀದೇವಿ-ಭೂದೇವಿ, ಬ್ರಹ್ಮ-ಸರಸ್ವತಿ), ಹರಿಹರ IIನ ಸ್ವಂತ ಚಿನ್ನದ ಅರ್ಧ ವರಾಹ ಬ್ರಹ್ಮ ಮತ್ತು ಸರಸ್ವತಿಯನ್ನು ಒಟ್ಟಿಗೆ, ಹೊಂದಾಣಿಕೆಯ ಮೂರು-ಸಾಲಿನ "ಪ್ರತಾಪ ಹರಿಹರ" ಲೇಖದೊಂದಿಗೆ ತೋರಿಸುತ್ತದೆ. ಇದಕ್ಕೆ ವ್ಯತಿರಿಕ್ತವಾಗಿ, ಕೃಷ್ಣದೇವರಾಯನ ನಾಣ್ಯಗಳು ಇಂತಹ ಜೋಡಿಯಿಂದ ಆಗಾಗ್ಗೆ ಒಂದೇ ದೇವತೆಯನ್ನು ತೋರಿಸುತ್ತವೆ (ಪ್ರತ್ಯೇಕವಾಗಿ ತಿಳಿದ ಬಾಲಕೃಷ್ಣ, ಕೇವಲ-ವೆಂಕಟೇಶ್ವರ, ಮತ್ತು ಕಮಲದ ಮೇಲೆ ಕುಳಿತ ಕೇವಲ-ಲಕ್ಷ್ಮೀ ನಮೂನೆಗಳಂತೆ) -- ಆದ್ದರಿಂದ ಈ ನಾಣ್ಯದ ಬ್ರಹ್ಮನಿಲ್ಲದ ಸರಸ್ವತಿ ವಿನ್ಯಾಸವನ್ನು ಆ ವೈಯಕ್ತಿಕ ಆದ್ಯತೆಗೆ ಅನುಗುಣವಾಗಿ ಓದಲಾಗುತ್ತದೆ, ಬ್ರಹ್ಮನ ಕಡಿಮೆ ಧಾರ್ಮಿಕ ಸ್ಥಾನಮಾನದ ಸಾಕ್ಷ್ಯವಾಗಿ ಅಲ್ಲ. ಈ ಶೋಧನೆಗೂ ಮೊದಲು, ಕೃಷ್ಣದೇವರಾಯನಿಗೆ 19 ಚಿನ್ನ/ಬೆಳ್ಳಿ/ತಾಮ್ರ ನಮೂನೆಗಳು ಪಟ್ಟಿಗತವಾಗಿದ್ದವು; ಇದನ್ನು 20ನೇ ಎಂದು ದಾಖಲಿಸಲಾಗಿದೆ, ಇನ್ನೂ ಹಲವು ದಾಖಲಾಗದೆ ಉಳಿದಿರಬಹುದೆಂದು ಲೇಖಕರು ಗಮನಿಸುತ್ತಾರೆ.'),
    findspot: { placeId: 'place-hampi', certainty: 'unknown' },
    image: { status: 'missing', license: null, url: null },
    evidenceGates: { catalogue: { status: 'located' }, image: { status: 'unresolved' }, metal: { status: 'located' }, weight: { status: 'located' }, findspot: { status: 'unresolved' } },
    citations: [c(SRC_VADHY_VOL6, 'N. Havalayya, "ಕೃಷ್ಣದೇವರಾಯನ ಸರಸ್ವತಿ ನಮೂನೆಯ ಅಪ್ರಕಟಿತ ನಾಣ್ಯ" (An unpublished Saraswati-type coin of Krishnadevaraya), pp. 18-20: private-collection specimen with full physical description and Nagari legend transcription')],
    review,
  },
]

// Source: "Vijayanagara Adhyayana" Volume 7 (Directorate of Archaeology and Museums, Mysore, 2003).
const SRC_VADHY_VOL7 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadhysam-7-0000krra'

export const karnatakaArchaeologyMiningEvents = [
  {
    id: 'event-karch-harihara-bukka-kampili-service-and-vijayanagara-founding',
    type: 'kingdom-foundation',
    name: n('Two traditions of Harihara and Bukka\'s service under Kampili before founding Vijayanagara', 'ವಿಜಯನಗರ ಸ್ಥಾಪನೆಗೂ ಮೊದಲು ಕಂಪಿಲಿ ಸೇವೆಯಲ್ಲಿ ಹರಿಹರ-ಬುಕ್ಕರ ಎರಡು ಸಂಪ್ರದಾಯಗಳು'),
    date: d(1327, 1336, 'range'),
    year: 1336,
    location: { type: 'Point', coordinates: [76.46, 15.335], precision: 'approximate' },
    summary: n('Dr. C. Mahadeva\'s paper surveys two competing traditions -- one Kannada, one Telugu -- about what Harihara I and Bukka I, Vijayanagara\'s founders, were doing immediately before 1336. The Kannada tradition, drawn from the "Kumararamana Sangatya" folk epic, holds they held responsible office under Kampiladeva of Kummata/Anegundi (some accounts call them his relatives), fled Anegundi when the Delhi Sultanate\'s forces attacked, and afterward served Hoysala Ballala III; Ibn Battuta and Barani report that after Kummata\'s fall Kampila\'s kinsmen were taken captive to Delhi and later sent back to govern the province. The Telugu tradition instead holds Harihara and Bukka were officers of the Kakatiya king Prataparudra of Warangal, entered Kampila\'s service only after Warangal fell, were captured when Kummata fell in turn, converted to Islam in Delhi, and were sent back by the Sultan to administer the Kampili/Anegundi province -- from which they broke away to found independent Vijayanagara. The paper also gives Kampili\'s territorial extent (parts of present-day Dharwad, Haveri, Gadag, Chitradurga, Ballari, Koppal and Raichur districts) and notes an inscription of Bukka I at Edatore, near Pampapura, naming Bhavasangama -- Kampiladeva\'s son-in-law and Kumararama\'s brother-in-law -- as active in the same landscape.', 'ಡಾ. ಸಿ. ಮಹದೇವರ ಪ್ರಬಂಧ ವಿಜಯನಗರ ಸ್ಥಾಪಕರಾದ ಹರಿಹರ I ಮತ್ತು ಬುಕ್ಕ I 1336ಕ್ಕಿಂತ ಮುಂಚೆ ಏನು ಮಾಡುತ್ತಿದ್ದರೆಂಬುದರ ಬಗ್ಗೆ ಎರಡು ಸ್ಪರ್ಧಾತ್ಮಕ ಸಂಪ್ರದಾಯಗಳನ್ನು -- ಒಂದು ಕನ್ನಡ, ಒಂದು ತೆಲುಗು -- ಸಮೀಕ್ಷಿಸುತ್ತದೆ. "ಕುಮಾರರಾಮನ ಸಾಂಗತ್ಯ" ಜನಪದ ಕಾವ್ಯದಿಂದ ಪಡೆದ ಕನ್ನಡ ಸಂಪ್ರದಾಯ, ಅವರು ಕುಮ್ಮಟ/ಆನೆಗುಂದಿಯ ಕಂಪಿಲದೇವನ ಅಡಿಯಲ್ಲಿ ಜವಾಬ್ದಾರಿಯುತ ಹುದ್ದೆ ಹೊಂದಿದ್ದರೆಂದೂ (ಕೆಲವು ವೃತ್ತಾಂತಗಳು ಅವರನ್ನು ಅವನ ಬಂಧುಗಳೆಂದು ಕರೆಯುತ್ತವೆ), ದೆಹಲಿ ಸುಲ್ತಾನೀ ಪಡೆ ಆಕ್ರಮಣ ಮಾಡಿದಾಗ ಆನೆಗುಂದಿಯಿಂದ ಪರಾರಿಯಾದರೆಂದೂ, ನಂತರ ಹೊಯ್ಸಳ ಮೂರನೇ ಬಲ್ಲಾಳನ ಸೇವೆಗೆ ಸೇರಿದರೆಂದೂ ಹೇಳುತ್ತದೆ; ಇಬ್ನ್ ಬತೂತ ಮತ್ತು ಬರನಿ ಕುಮ್ಮಟದ ಪತನದ ನಂತರ ಕಂಪಿಲನ ಬಂಧುಗಳನ್ನು ದೆಹಲಿಗೆ ಸೆರೆಯಾಳುಗಳಾಗಿ ಒಯ್ಯಲಾಯಿತೆಂದೂ, ನಂತರ ಪ್ರಾಂತ ಆಳಲು ಹಿಂತಿರುಗಿಸಲಾಯಿತೆಂದೂ ವರದಿ ಮಾಡುತ್ತಾರೆ. ಬದಲಿಗೆ ತೆಲುಗು ಸಂಪ್ರದಾಯ ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕ ವಾರಂಗಲ್ಲಿನ ಕಾಕತೀಯ ಅರಸ ಪ್ರತಾಪರುದ್ರನ ಅಧಿಕಾರಿಗಳಾಗಿದ್ದರೆಂದೂ, ವಾರಂಗಲ್ ಪತನದ ನಂತರವಷ್ಟೇ ಕಂಪಿಲನ ಸೇವೆಗೆ ಸೇರಿದರೆಂದೂ, ಕುಮ್ಮಟ ಸಹ ಪತನವಾದಾಗ ಸೆರೆಯಾಳಾಗಿ, ದೆಹಲಿಯಲ್ಲಿ ಇಸ್ಲಾಂಗೆ ಮತಾಂತರಗೊಂಡು, ಕಂಪಿಲಿ/ಆನೆಗುಂದಿ ಪ್ರಾಂತ ಆಳಲು ಸುಲ್ತಾನನಿಂದ ಹಿಂತಿರುಗಿ ಕಳುಹಿಸಲ್ಪಟ್ಟರೆಂದೂ -- ಅಲ್ಲಿಂದ ಸ್ವತಂತ್ರ ವಿಜಯನಗರ ಸ್ಥಾಪಿಸಲು ಬೇರ್ಪಟ್ಟರೆಂದೂ ಹೇಳುತ್ತದೆ. ಪ್ರಬಂಧ ಕಂಪಿಲಿಯ ಭೂಪ್ರದೇಶ ವ್ಯಾಪ್ತಿಯನ್ನೂ (ಈಗಿನ ಧಾರವಾಡ, ಹಾವೇರಿ, ಗದಗ, ಚಿತ್ರದುರ್ಗ, ಬಳ್ಳಾರಿ, ಕೊಪ್ಪಳ ಮತ್ತು ರಾಯಚೂರು ಜಿಲ್ಲೆಗಳ ಭಾಗಗಳು) ನೀಡುತ್ತದೆ ಮತ್ತು ಪಂಪಾಪುರದ ಬಳಿಯ ಎಡತೊರೆಯಲ್ಲಿನ ಬುಕ್ಕ Iನ ಶಾಸನವನ್ನು ಗಮನಿಸುತ್ತದೆ, ಇದು ಭಾವಸಂಗಮನನ್ನು -- ಕಂಪಿಲದೇವನ ಅಳಿಯ ಮತ್ತು ಕುಮಾರರಾಮನ ಭಾವ -- ಅದೇ ಭೂಪ್ರದೇಶದಲ್ಲಿ ಸಕ್ರಿಯನಾಗಿದ್ದನೆಂದು ಹೆಸರಿಸುತ್ತದೆ.'),
    participants: [
      { polityId: 'polity-kampili', role: 'predecessor-polity', outcome: 'conquered-1327' },
      { polityId: 'polity-vijayanagara', role: 'founding-polity', outcome: 'established-1336' },
    ],
    peopleIds: ['person-harihara-i', 'person-bukka-i'],
    originPlaceId: 'place-kummata',
    destinationPlaceId: 'place-hampi',
    citations: [c(SRC_VADHY_VOL7, 'Dr. C. Mahadeva, "ವಿಜಯನಗರ ಮತ್ತು ಕುಮಾರರಾಮ" (Vijayanagara and Kumara Rama), pp. 68-69: survey of Kannada (Kumararamana Sangatya) and Telugu source traditions, with citations to Ibn Battuta and Barani')],
    review,
  },
]

// Source: "Vijayanagara Adhyayana" Volume 8 (Directorate of Archaeology and Museums, Mysore, 2003).
const SRC_VADHY_VOL8 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadhysamputa-8-0000drrg'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-harihara-i-residence-silamandapa-excavation',
  name: n('ASI excavation identifying Harihara I\'s residence near the Silamandapa, Hampi', 'ಎ.ಎಸ್.ಐ ಉತ್ಖನನ, ಹಂಪೆಯ ಶಿಲಾಮಂಟಪದ ಬಳಿ ಹರಿಹರ Iನ ನಿವಾಸ ಗುರುತಿಸುವಿಕೆ'),
  category: 'architecture',
  date: d(1336, 1404, 'range'),
  polityIds: ['polity-vijayanagara'],
  placeIds: ['place-hampi'],
  peopleIds: ['person-harihara-i', 'person-krishnadevaraya'],
  relatedWorkIds: [],
  traditionTags: ['excavation', 'royal-residence', 'Mint-area', 'Silamandapa', 'palace-complex'],
  continuity: 'material-survival',
  description: n('T.M. Keshava (Archaeological Survey of India, Bangalore Circle) reports nearly two decades of excavation identifying, west-northwest of the Hazara Ramachandra temple in the so-called "Mint" area, a structure that two inscriptions found at an adjoining Silamandapa site identify as the residence of Vira Harihara -- Vijayanagara\'s first ruler. Before this, scholars had believed the empire\'s early structural activity was confined to Anegundi alone. The earlier of the two inscriptions, by one Tippa Vodeya, records installing an image of Bhuvaneshwari "near the house (maneya) of Sri Vira Harihara Raya" -- the modest word maneya suggesting an austere early dwelling, with Tippa Vodeya likely a servant attached to it. The later inscription, from Krishnadevaraya\'s reign, shows the same site had by then grown into a "Hiriya Aramane" (senior/elder palace, implying a companion "Kiriya Aramane" existed too); it records that Timmoja, son of Pampoja -- the Hiriya Aramane\'s architect -- built a Silamandapa there in 1528 CE, and names a "Naga Bana," a series of naga (serpent) stones installed over time before the mandapa housing Bhuvaneshwari, evidently propitiated by people seeking the blessing of children (excavations in 1995-96 recovered many such naga stones and a fairly well-preserved Bhuvaneshwari image in front of the mandapa). Excavations from 1994-95 to 1996-97 uncovered a large, repeatedly enlarged palace complex north-northwest of the Silamandapa within its own high enclosure walls -- guarded entrances, zigzag passages, a water system, a royal court, residential quarters, a garden, a kitchen, rectangular halls and a toilet. A third related inscription, found at Anegundi itself, separately names a "Tippannavodeyara Aramane" (Tippanna Vodeya\'s palace).', 'ಟಿ.ಎಂ. ಕೇಶವ (ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣಾ ಇಲಾಖೆ, ಬೆಂಗಳೂರು ವಲಯ) ಸುಮಾರು ಎರಡು ದಶಕಗಳ ಉತ್ಖನನವನ್ನು ವರದಿ ಮಾಡುತ್ತಾರೆ, ಹಜಾರ ರಾಮಚಂದ್ರ ದೇವಾಲಯದ ವಾಯುವ್ಯಕ್ಕೆ "ಮಿಂಟ್" ಎಂದು ಕರೆಯಲಾಗುವ ಪ್ರದೇಶದಲ್ಲಿ, ಪಕ್ಕದ ಶಿಲಾಮಂಟಪ ತಾಣದಲ್ಲಿ ಪತ್ತೆಯಾದ ಎರಡು ಶಾಸನಗಳು ವೀರ ಹರಿಹರ -- ವಿಜಯನಗರದ ಮೊದಲ ಅರಸ -- ನ ನಿವಾಸವೆಂದು ಗುರುತಿಸುವ ರಚನೆಯನ್ನು ಗುರುತಿಸಲಾಗಿದೆ. ಇದಕ್ಕೂ ಮೊದಲು, ಸಾಮ್ರಾಜ್ಯದ ಆರಂಭಿಕ ರಚನಾತ್ಮಕ ಚಟುವಟಿಕೆ ಆನೆಗುಂದಿಗೆ ಮಾತ್ರ ಸೀಮಿತವಾಗಿತ್ತೆಂದು ವಿದ್ವಾಂಸರು ನಂಬಿದ್ದರು. ಎರಡು ಶಾಸನಗಳಲ್ಲಿ ಮುಂಚಿನದು, ತಿಪ್ಪ ವೊಡೆಯ ಎಂಬಾತನಿಂದ, "ಶ್ರೀ ವೀರ ಹರಿಹರ ರಾಯನ ಮನೆಯ" ಬಳಿ ಭುವನೇಶ್ವರಿ ವಿಗ್ರಹ ಸ್ಥಾಪನೆಯನ್ನು ದಾಖಲಿಸುತ್ತದೆ -- ಸಾಧಾರಣ ಪದ "ಮನೆಯ" ಆರಂಭಿಕ ಸರಳ ವಸತಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ, ತಿಪ್ಪ ವೊಡೆಯ ಬಹುಶಃ ಅದಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಸೇವಕ. ನಂತರದ ಶಾಸನ, ಕೃಷ್ಣದೇವರಾಯನ ಆಳ್ವಿಕೆಯದ್ದು, ಅದೇ ತಾಣ ಆ ವೇಳೆಗೆ "ಹಿರಿಯ ಅರಮನೆ" ಆಗಿ ಬೆಳೆದಿತ್ತೆಂದು ತೋರಿಸುತ್ತದೆ (ಇದು ಜೊತೆಗಿನ "ಕಿರಿಯ ಅರಮನೆ" ಇತ್ತೆಂದೂ ಸೂಚಿಸುತ್ತದೆ); ಹಿರಿಯ ಅರಮನೆಯ ವಾಸ್ತುಶಿಲ್ಪಿ ಪೊಂಪೊಜನ ಮಗ ತಿಂಮೊಜ 1528ರಲ್ಲಿ ಅಲ್ಲಿ ಶಿಲಾಮಂಟಪ ಕಟ್ಟಿಸಿದನೆಂದು ದಾಖಲಿಸುತ್ತದೆ, ಮತ್ತು "ನಾಗ ಬನ"ವನ್ನು ಹೆಸರಿಸುತ್ತದೆ, ಇದು ಭುವನೇಶ್ವರಿಯನ್ನು ಹೊಂದಿರುವ ಮಂಟಪದ ಮುಂದೆ ಕಾಲಕ್ರಮದಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ನಾಗ ಶಿಲೆಗಳ ಸರಣಿ, ಸ್ಪಷ್ಟವಾಗಿ ಮಕ್ಕಳ ಆಶೀರ್ವಾದ ಬಯಸುವ ಜನರಿಂದ ಪೂಜಿಸಲ್ಪಡುತ್ತಿತ್ತು (1995-96ರ ಉತ್ಖನನಗಳು ಅಂತಹ ಹಲವು ನಾಗ ಶಿಲೆಗಳನ್ನೂ ಮಂಟಪದ ಮುಂದೆ ಸಾಕಷ್ಟು ಚೆನ್ನಾಗಿ ಸಂರಕ್ಷಿತ ಭುವನೇಶ್ವರಿ ವಿಗ್ರಹವನ್ನೂ ಪತ್ತೆಮಾಡಿದವು). 1994-95ರಿಂದ 1996-97ರವರೆಗಿನ ಉತ್ಖನನಗಳು ಶಿಲಾಮಂಟಪದ ಉತ್ತರ-ವಾಯುವ್ಯಕ್ಕೆ ತನ್ನದೇ ಎತ್ತರದ ಆವರಣ ಗೋಡೆಗಳೊಳಗೆ ಪದೇಪದೇ ವಿಸ್ತರಿಸಲಾದ ದೊಡ್ಡ ಅರಮನೆ ಸಂಕೀರ್ಣವನ್ನು ಬಯಲಿಗೆ ತಂದವು -- ಕಾವಲು ಪ್ರವೇಶದ್ವಾರಗಳು, ಜಿಗ್-ಜಾಗ್ ಹಾದಿಗಳು, ನೀರಿನ ವ್ಯವಸ್ಥೆ, ರಾಜ ಆಸ್ಥಾನ, ವಸತಿ ಕೊಠಡಿಗಳು, ಉದ್ಯಾನ, ಅಡುಗೆಮನೆ, ಆಯತಾಕಾರದ ಸಭಾಂಗಣಗಳು ಮತ್ತು ಶೌಚಾಲಯ. ಸಂಬಂಧಿತ ಮೂರನೇ ಶಾಸನ, ಆನೆಗುಂದಿಯಲ್ಲೇ ಪತ್ತೆಯಾಗಿದ್ದು, ಪ್ರತ್ಯೇಕವಾಗಿ "ತಿಪ್ಪಣ್ಣವೊಡೆಯರ ಅರಮನೆ"ಯನ್ನು ಹೆಸರಿಸುತ್ತದೆ.'),
  citations: [c(SRC_VADHY_VOL8, 'T.M. Keshava, "Recent Excavations in the Mint Area," pp. 42-43: ASI Bangalore Circle excavation report (1994-95 to 1996-97), with transcribed inscription texts')],
  review,
})

// Source: "Vijayanagara Adhyayana" Volume 9 (Directorate of Archaeology and Museums, Mysore, 2004).
const SRC_VADHY_VOL9 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadhy0000krra'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-vijayanagara-muslim-community',
  name: n('Muslim community and Kattige Ahmad Khan\'s endowment at Vijayanagara city', 'ವಿಜಯನಗರ ಪಟ್ಟಣದ ಮುಸ್ಲಿಂ ಸಮುದಾಯ ಮತ್ತು ಕಟ್ಟಿಗೆ ಅಹ್ಮದ್ ಖಾನ್‌ನ ದತ್ತಿ'),
  category: 'religious-tradition',
  date: d(1336, 1565, 'range'),
  polityIds: ['polity-vijayanagara'],
  placeIds: ['place-hampi'],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['Islam', 'religious-plurality', 'military-officer', 'dharmashala', 'coexistence'],
  continuity: 'material-survival',
  description: n('B. Abdul Mannan\'s paper documents a Muslim quarter, tombs and mosques on the eastern side of Vijayanagara city -- attested both by foreign travellers\' accounts and by the Department\'s own progress reports (1979-83, 1983-84, 1984-87), including large tombs at Kaddirampura and within the inner fort. Vijayanagara armies employed Muslim soldiers and officers; the paper\'s clearest documented case is Kattige Ahmad Khan, a military officer who built a dharmashala (rest-house) and a well "for the merit of Devaraya" (dedicated for the king\'s benefit) with the intention it endure achandrarkasthayi ("as long as the sun and moon") -- both structures, along with Ahmad Khan\'s own tomb, are still preserved. The paper places the region\'s Islamic presence earlier still through the Kumararamana Sangatya folk epic, which recounts (as legend, not verified history) that the Delhi Sultanate governor Bahauddin Gushtasp ("Badur Khan"), exiled by Muhammad bin Tughlaq, took refuge at Kampiladeva\'s court -- with the Sultan\'s daughter Babbami\'s romantic interest in Kumara Rama later drawn into the narrative explaining the Sultanate\'s repeated campaigns against Kummata.', 'ಬಿ. ಅಬ್ದುಲ್ ಮನ್ನಾನ್‌ರ ಪ್ರಬಂಧ ವಿಜಯನಗರ ಪಟ್ಟಣದ ಪೂರ್ವ ಭಾಗದಲ್ಲಿ ಮುಸ್ಲಿಂ ವಸತಿ ಪ್ರದೇಶ, ಗೋರಿಗಳು ಮತ್ತು ಮಸೀದಿಗಳನ್ನು ದಾಖಲಿಸುತ್ತದೆ -- ವಿದೇಶಿ ಪ್ರವಾಸಿಗರ ಬರಹಗಳಿಂದ ಮತ್ತು ಇಲಾಖೆಯ ಸ್ವಂತ ಪ್ರಗತಿ ವರದಿಗಳಿಂದ (೧೯೭೯-೮೩, ೧೯೮೩-೮೪, ೧೯೮೪-೮೭) ದೃಢಪಟ್ಟಿದೆ, ಕಡ್ಡೇ ರಾಮಪುರ ಮತ್ತು ಒಳಕೋಟೆಯೊಳಗಿನ ದೊಡ್ಡ ಗೋರಿಗಳು ಸೇರಿ. ವಿಜಯನಗರ ಸೈನ್ಯಗಳು ಮುಸ್ಲಿಂ ಸೈನಿಕರು ಮತ್ತು ಅಧಿಕಾರಿಗಳನ್ನು ಬಳಸಿಕೊಂಡವು; ಪ್ರಬಂಧದ ಅತ್ಯಂತ ಸ್ಪಷ್ಟ ದಾಖಲಿತ ಪ್ರಕರಣ ಕಟ್ಟಿಗೆ ಅಹ್ಮದ್ ಖಾನ್, ಒಬ್ಬ ಸೈನ್ಯಾಧಿಕಾರಿ, "ದೇವರಾಯರಿಗೆ ಧರ್ಮವಾಗಬೇಕೆಂದು" (ರಾಜನ ಪುಣ್ಯಕ್ಕಾಗಿ ಸಮರ್ಪಿತ) ಧರ್ಮಶಾಲೆ ಮತ್ತು ಬಾವಿಯನ್ನು ಆಚಂದ್ರಾರ್ಕಸ್ಥಾಯಿ ("ಸೂರ್ಯ-ಚಂದ್ರರಿರುವ ತನಕ") ಇರುವ ಉದ್ದೇಶದಿಂದ ಕಟ್ಟಿಸಿದನು -- ಎರಡೂ ರಚನೆಗಳು, ಅಹ್ಮದ್ ಖಾನ್‌ನ ಸ್ವಂತ ಸಮಾಧಿಯೊಂದಿಗೆ, ಇಂದಿಗೂ ಸಂರಕ್ಷಿತವಾಗಿವೆ. ಪ್ರಬಂಧ ಈ ಪ್ರದೇಶದ ಇಸ್ಲಾಮಿಕ್ ಉಪಸ್ಥಿತಿಯನ್ನು ಇನ್ನೂ ಹಿಂದಕ್ಕೆ, ಕುಮಾರರಾಮನ ಸಾಂಗತ್ಯ ಜನಪದ ಕಾವ್ಯದ ಮೂಲಕ ಇರಿಸುತ್ತದೆ, ಇದು (ದಂತಕಥೆಯಾಗಿ, ಪರಿಶೀಲಿತ ಇತಿಹಾಸವಾಗಿ ಅಲ್ಲ) ಮುಹಮ್ಮದ್ ಬಿನ್ ತುಘಲಕ್‌ನಿಂದ ಗಡಿಪಾರುಗೊಂಡ ದೆಹಲಿ ಸುಲ್ತಾನೀ ಗವರ್ನರ್ ಬಹಾಉದ್ದೀನ್ ಗುಸ್ತಾಸ್ಪ್ ("ಬಾದುರ್ ಖಾನ್") ಕಂಪಿಲದೇವನ ಆಸ್ಥಾನದಲ್ಲಿ ಆಶ್ರಯ ಪಡೆದನೆಂದು ಹೇಳುತ್ತದೆ -- ಸುಲ್ತಾನನ ಮಗಳು ಬಾಬ್ಬಮಿಯ ಕುಮಾರರಾಮನ ಮೇಲಿನ ಪ್ರಣಯಾಸಕ್ತಿ ನಂತರ ಕುಮ್ಮಟದ ವಿರುದ್ಧ ಸುಲ್ತಾನೀ ಪದೇಪದೇ ದಂಡಯಾತ್ರೆಗಳನ್ನು ವಿವರಿಸುವ ಕಥನದೊಳಗೆ ಎಳೆಯಲ್ಪಟ್ಟಿದೆ.'),
  citations: [c(SRC_VADHY_VOL9, 'B. Abdul Mannan, "ವಿಜಯನಗರ ಪಟ್ಟಣದಲ್ಲಿ ಮುಸ್ಲಿಂ ಧರ್ಮ" (Islam in Vijayanagara city), pp. 110-114, citing Department progress reports (VPR 1979-83, 1983-84, 1984-87) and the Kumararamana Sangatya')],
  review,
})

// Source: "Vijayanagara Adhyayana" Volume 10 (Directorate of Archaeology and Museums, Mysore, 2005).
const SRC_VADHY_VOL10 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadhy0000drrg'

karnatakaArchaeologyMiningEvents.push({
  id: 'event-karch-harihara-i-vidyaranya-1336-foundation-charter',
  type: 'kingdom-foundation',
  name: n('1336 CE copper-plate charter of Harihara I naming Vidyaranya and dating Vijayanagara\'s founding', 'ವಿದ್ಯಾರಣ್ಯರನ್ನು ಹೆಸರಿಸಿ ವಿಜಯನಗರ ಸ್ಥಾಪನೆ ದಿನಾಂಕಿಸುವ ಹರಿಹರ Iನ 1336ರ ತಾಮ್ರಶಾಸನ ಪ್ರಮಾಣಪತ್ರ'),
  date: d(1336, 1336, 'year'),
  year: 1336,
  location: { type: 'Point', coordinates: [76.46, 15.335], precision: 'approximate' },
  summary: n('D.V. Parameshivamurti publishes a previously unrecorded 126-line Sanskrit/Nandinagari copper-plate charter of Harihara I -- one of three copper plates a priestly family (Dattatreya Shivarama Purohit) at Halkavatagi village, Lingasugur taluk, had preserved and worshipped for generations. The charter opens with the Sangama genealogy (Sangama\'s five sons Harihara, Kampa, Bukka, Mada and Muddha) and then narrates the empire\'s founding legend in full: Harihara, ruling from Kunjarakonapura (Anegundi), crosses the Tungabhadra on a hunt and is astonished to see a hare turn on and confront his fierce hunting dog; near the Virupaksha-Pampadevi shrine he meets the sage Vidyaranya in penance, who explains the land\'s sanctity and instructs him to found a city named "Vidya" there, as beautiful as Alakanagara and walled with nine gates like Dwaraka. The charter dates this precisely by a Sanskrit chronogram to Shalivahana Shaka 1258, Dhatr samvatsara, Vaishakha 7 -- 18 April 1336 CE -- on which date, before Virupaksha-Pampadevi, Harihara founded the Hariharapura agrahara and granted land in Kopanachala-sime (Hastinavati kingdom) to two Brahmins, Tippa Bhatta (Kaushika gotra) and Aragamallappa (Bharadvaja gotra). The author frames the find explicitly against the live scholarly dispute over whether any reliable evidence documents Vijayanagara\'s founding and Vidyaranya\'s role in it, several extant sources having been judged artificial or unreliable -- while noting this record too requires the same page-image and provenance scrutiny given its family-preserved, previously unpublished transmission.', 'ಡಿ.ವಿ. ಪರಮಶಿವಮೂರ್ತಿ ಈ ಮೊದಲು ದಾಖಲಾಗದ 126-ಸಾಲಿನ ಸಂಸ್ಕೃತ/ನಂದಿನಾಗರಿ ತಾಮ್ರಶಾಸನ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಪ್ರಕಟಿಸುತ್ತಾರೆ, ಹರಿಹರ Iನದ್ದು -- ಲಿಂಗಸುಗೂರು ತಾಲ್ಲೂಕಿನ ಹಾಲ್ಕಾವಟಗಿ ಗ್ರಾಮದ ಪುರೋಹಿತ ಕುಟುಂಬ (ದತ್ತಾತ್ರೇಯ ಶಿವರಾಮ ಪುರೋಹಿತ) ತಲೆಮಾರುಗಳಿಂದ ಸಂರಕ್ಷಿಸಿ ಪೂಜಿಸಿದ ಮೂರು ತಾಮ್ರಫಲಕಗಳಲ್ಲಿ ಒಂದು. ಪ್ರಮಾಣಪತ್ರ ಸಂಗಮ ವಂಶಾವಳಿಯಿಂದ (ಸಂಗಮನ ಐವರು ಪುತ್ರರು ಹರಿಹರ, ಕಂಪ, ಬುಕ್ಕ, ಮಾದ ಮತ್ತು ಮುದ್ದ) ಆರಂಭಗೊಂಡು ಸಾಮ್ರಾಜ್ಯದ ಸ್ಥಾಪನಾ ದಂತಕಥೆಯನ್ನು ಪೂರ್ಣವಾಗಿ ನಿರೂಪಿಸುತ್ತದೆ: ಕುಂಜರಕೋಣಪುರ (ಆನೆಗುಂದಿ)ದಿಂದ ಆಳುತ್ತಿದ್ದ ಹರಿಹರ, ಬೇಟೆಗೆ ತುಂಗಭದ್ರಾ ದಾಟಿ, ಮೊಲವೊಂದು ತನ್ನ ಉಗ್ರ ಬೇಟೆನಾಯಿಯನ್ನು ಎದುರಿಸುವುದನ್ನು ಕಂಡು ಆಶ್ಚರ್ಯಪಡುತ್ತಾನೆ; ವಿರೂಪಾಕ್ಷ-ಪಂಪಾದೇವಿ ಗುಡಿಯ ಬಳಿ ತಪಸ್ಸಿನಲ್ಲಿದ್ದ ಋಷಿ ವಿದ್ಯಾರಣ್ಯರನ್ನು ಭೇಟಿಯಾಗುತ್ತಾನೆ, ಅವರು ಭೂಮಿಯ ಪಾವಿತ್ರ್ಯವನ್ನು ವಿವರಿಸಿ ಅಲ್ಲಿ "ವಿದ್ಯಾ" ಎಂಬ ನಗರವನ್ನು, ಅಲಕಾನಗರದಷ್ಟು ಸುಂದರವಾಗಿ, ದ್ವಾರಕೆಯಂತೆ ಒಂಬತ್ತು ಬಾಗಿಲುಗಳ ಕೋಟೆಯೊಂದಿಗೆ ಸ್ಥಾಪಿಸಲು ಆಜ್ಞಾಪಿಸುತ್ತಾರೆ. ಪ್ರಮಾಣಪತ್ರ ಇದನ್ನು ಸಂಸ್ಕೃತ ಕಾಲಸೂಚಕ ಪದ್ಯದ ಮೂಲಕ ನಿಖರವಾಗಿ ಶಾಲಿವಾಹನ ಶಕ 1258, ಧಾತೃ ಸಂವತ್ಸರ, ವೈಶಾಖ 7 -- 18 ಏಪ್ರಿಲ್ 1336 -- ಎಂದು ದಿನಾಂಕಿಸುತ್ತದೆ, ಈ ದಿನಾಂಕದಂದು, ವಿರೂಪಾಕ್ಷ-ಪಂಪಾದೇವಿಯ ಮುಂದೆ, ಹರಿಹರ ಹರಿಹರಪುರ ಅಗ್ರಹಾರವನ್ನು ಸ್ಥಾಪಿಸಿ ಕೊಪಣಾಚಲ-ಸೀಮೆಯಲ್ಲಿ (ಹಸ್ತಿನಾವತಿ ರಾಜ್ಯ) ಇಬ್ಬರು ಬ್ರಾಹ್ಮಣರಿಗೆ, ತಿಪ್ಪ ಭಟ್ಟ (ಕೌಶಿಕ ಗೋತ್ರ) ಮತ್ತು ಅರಗಮಲ್ಲಪ್ಪ (ಭಾರದ್ವಾಜ ಗೋತ್ರ), ಭೂಮಿ ದಾನ ನೀಡಿದನೆಂದು ದಾಖಲಿಸುತ್ತದೆ. ಲೇಖಕರು ಈ ಶೋಧನೆಯನ್ನು ವಿಜಯನಗರ ಸ್ಥಾಪನೆ ಮತ್ತು ಅದರಲ್ಲಿ ವಿದ್ಯಾರಣ್ಯರ ಪಾತ್ರವನ್ನು ಯಾವುದೇ ವಿಶ್ವಾಸಾರ್ಹ ಸಾಕ್ಷ್ಯ ದಾಖಲಿಸುತ್ತದೆಯೇ ಎಂಬ ಜೀವಂತ ವಿದ್ವತ್ ವಿವಾದದ ವಿರುದ್ಧ ಸ್ಪಷ್ಟವಾಗಿ ಇರಿಸುತ್ತಾರೆ, ಹಲವು ಈಗಿರುವ ಆಕರಗಳನ್ನು ಕೃತಕ ಅಥವಾ ಅವಿಶ್ವಾಸಾರ್ಹವೆಂದು ತೀರ್ಮಾನಿಸಲಾಗಿದೆ -- ಈ ದಾಖಲೆಗೂ, ಕುಟುಂಬ-ಸಂರಕ್ಷಿತ, ಈ ಮೊದಲು ಅಪ್ರಕಟಿತ ಪ್ರಸರಣದ ಕಾರಣ, ಅದೇ ಪುಟಚಿತ್ರ ಮತ್ತು ಮೂಲ ಪರಿಶೀಲನೆ ಬೇಕೆಂದು ಗಮನಿಸುತ್ತಾ.'),
  participants: [
    { polityId: 'polity-vijayanagara', role: 'founding-polity', outcome: 'established-1336-04-18' },
  ],
  peopleIds: ['person-harihara-i'],
  originPlaceId: 'place-anegundi',
  destinationPlaceId: 'place-hampi',
  citations: [c(SRC_VADHY_VOL10, 'D.V. Parameshivamurti, "ಒಂದನೇ ಹರಿಹರ ಮತ್ತು ವಿದ್ಯಾರಣ್ಯರ ತಾಮ್ರಶಾಸನ" (The copper-plate charter of Harihara I and Vidyaranya), pp. 16-29: full 126-line text with chronogram date, from a family-preserved, previously unpublished plate at Halkavatagi')],
  review,
})

// Source: "Vijayanagara Adhyayana" Volume 11 (Directorate of Archaeology and Museums, Mysore, 2006).
const SRC_VADHY_VOL11 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadhy0000unse'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-vijayanagara-wrestling-muslim-soldiers',
  name: n('Wrestling (kusti/mallakalaga) inscriptions and Muslim soldiers at Vijayanagara', 'ವಿಜಯನಗರದ ಕುಸ್ತಿ (ಮಲ್ಲಕಾಳಗ) ಶಾಸನಗಳು ಮತ್ತು ಮುಸ್ಲಿಂ ಯೋಧರು'),
  category: 'games-sports',
  date: d(1406, 1446, 'range'),
  polityIds: ['polity-vijayanagara'],
  placeIds: ['place-hampi'],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['wrestling', 'kusti', 'mallakalaga', 'Muslim-soldiers', 'garadi', 'syncretic-tradition'],
  continuity: 'continuing-practice',
  description: n('Zainulla Ballari\'s paper examines two rare Hampi-area inscriptions documenting wrestling (variously kusti, mallakalaga, bahuyuddha, garadi vidye), a sport foreign travellers (Abdul Razzaq, Nuniz, Paes, Barbosa) describe witnessing and Kannada poets (Kumaravyasa, Ratnakaravarni, Shadaksharadeva, Nanjunda) depict in verse, with wrestling reliefs carved on the Hazara Rama, Vitthala, Achyutadevaraya and Virupaksha temples. The first inscription (1441 CE) records a Muslim wrestler -- his title transcribed by earlier editors as the uncertain "Miripaluvana" -- purchasing and donating a house to one Malukhana; comparing other Kannada-ized Perso-Arabic terms in Vijayanagara inscriptions (Ahamudakhana/Ahmad Khan, Masuji/Masjid, Kabirurauta/Kabir Rahut, Gummatha/Gumbaz), the author resolves the title as "Mir Pahilvan" (master wrestler), settling the earlier editorial doubt. The second (1439 CE) names Kattige Ahmad Khan, bodyguard to Devaraya II, whose "dharmasale" is architecturally identifiable as a mosque; citing Channabasappa S. Patil and Vasundhara Filliozat, the paper adds that Ahmad Khan separately built an annachatra (charitable food-hall) for the king\'s merit, both structures and his tomb still standing. The paper situates both records against Devaraya II\'s well-attested military reform recruiting some 10,000 Muslim cavalry (a 1430 CE Srirangapatna inscription) and safeguarding Muslim worship in the city, and against the living garadi (traditional gymnasium) tradition of Hoskote taluk, where Anjaneya, Kumara Rama and Maulali (Hazrat Ali, revered by Muslims as a symbol of strength) are worshipped together as garadi deities by Hindu and Muslim wrestlers without distinction.', 'ಜೈನುಲ್ಲಾ ಬಳ್ಳಾರಿಯ ಪ್ರಬಂಧ ಹಂಪಿ ಪ್ರದೇಶದ ಎರಡು ಅಪರೂಪದ ಶಾಸನಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ, ಕುಸ್ತಿಯನ್ನು (ಮಲ್ಲಕಾಳಗ, ಬಾಹುಯುದ್ಧ, ಗರಡಿ ವಿದ್ಯೆ ಎಂದೂ ಕರೆಯಲಾಗುತ್ತದೆ) ದಾಖಲಿಸುತ್ತವೆ, ವಿದೇಶಿ ಪ್ರವಾಸಿಗರು (ಅಬ್ದುಲ್ ರಜಾಕ್, ನ್ಯೂನಿಜ್, ಪಯಸ್, ಬಾರ್ಬೋಸಾ) ಕಣ್ಣಾರೆ ಕಂಡುದ್ದನ್ನು ವಿವರಿಸಿದ್ದಾರೆ ಮತ್ತು ಕನ್ನಡ ಕವಿಗಳು (ಕುಮಾರವ್ಯಾಸ, ರತ್ನಾಕರವರ್ಣಿ, ಷಡಕ್ಷರದೇವ, ನಂಜುಂಡ) ಪದ್ಯದಲ್ಲಿ ಚಿತ್ರಿಸಿದ್ದಾರೆ, ಹಜಾರ ರಾಮ, ವಿಠ್ಠಲ, ಅಚ್ಯುತದೇವರಾಯ ಮತ್ತು ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯಗಳಲ್ಲಿ ಕುಸ್ತಿ ಉಬ್ಬುಶಿಲ್ಪಗಳಿವೆ. ಮೊದಲ ಶಾಸನ (1441) ಮುಸ್ಲಿಂ ಕುಸ್ತಿಪಟುವನ್ನು ದಾಖಲಿಸುತ್ತದೆ -- ಅವನ ಬಿರುದನ್ನು ಹಿಂದಿನ ಸಂಪಾದಕರು ಅನಿಶ್ಚಿತ "ಮಿರಿಪಾಲುವಾನ" ಎಂದು ಲಿಪ್ಯಂತರಿಸಿದ್ದರು -- ಮಲುಖಾನನಿಗೆ ಮನೆಯನ್ನು ಖರೀದಿಸಿ ದಾನ ಮಾಡಿದ್ದನ್ನು; ವಿಜಯನಗರ ಶಾಸನಗಳಲ್ಲಿನ ಇತರ ಕನ್ನಡೀಕರಿಸಿದ ಪರ್ಷಿಯನ್-ಅರೇಬಿಕ್ ಪದಗಳನ್ನು (ಅಹಮುದಖಾನ/ಅಹಮದ್ ಖಾನ್, ಮಸೂಜಿ/ಮಸೀದಿ, ಕಬಿರುರಾವುತ/ಕಬೀರ್ ರಾಹುತ್, ಗುಮ್ಮಥ/ಗುಂಬಜ್) ಹೋಲಿಸಿ, ಲೇಖಕರು ಬಿರುದನ್ನು "ಮೀರ್ ಪೈಲ್ವಾನ್" (ಪ್ರವೀಣ ಕುಸ್ತಿಪಟು) ಎಂದು ಪರಿಹರಿಸುತ್ತಾರೆ, ಹಿಂದಿನ ಸಂಪಾದಕೀಯ ಸಂದೇಹವನ್ನು ಬಗೆಹರಿಸುತ್ತಾ. ಎರಡನೇ ಶಾಸನ (1439) ಇಮ್ಮಡಿ ದೇವರಾಯನ ಅಂಗರಕ್ಷಕ ಕಟ್ಟಿಗೆ ಅಹಮದ್ ಖಾನ್‌ನನ್ನು ಹೆಸರಿಸುತ್ತದೆ, ಅವನ "ಧರ್ಮಸಾಲೆ" ವಾಸ್ತು ಲಕ್ಷಣಗಳಿಂದ ಮಸೀದಿಯೆಂದು ಗುರುತಿಸಬಹುದು; ಚನ್ನಬಸಪ್ಪ ಎಸ್. ಪಾಟೀಲ ಮತ್ತು ವಸುಂಧರಾ ಫಿಲಿಯೋಜಾರನ್ನು ಉಲ್ಲೇಖಿಸಿ, ಪ್ರಬಂಧ ಅಹಮದ್ ಖಾನ್ ಪ್ರತ್ಯೇಕವಾಗಿ ರಾಜನ ಪುಣ್ಯಕ್ಕಾಗಿ ಅನ್ನಛತ್ರವನ್ನೂ ಕಟ್ಟಿಸಿದನೆಂದು ಸೇರಿಸುತ್ತದೆ, ಎರಡೂ ರಚನೆಗಳು ಮತ್ತು ಅವನ ಸಮಾಧಿ ಇಂದಿಗೂ ನಿಂತಿವೆ. ಪ್ರಬಂಧ ಎರಡೂ ದಾಖಲೆಗಳನ್ನು ಇಮ್ಮಡಿ ದೇವರಾಯನ ಸುಪ್ರಸಿದ್ಧ ಸೈನ್ಯ ಸುಧಾರಣೆಯೊಂದಿಗೆ (ಸುಮಾರು 10,000 ಮುಸ್ಲಿಂ ಅಶ್ವದಳ ನೇಮಕ, 1430ರ ಶ್ರೀರಂಗಪಟ್ಟಣ ಶಾಸನ) ಮತ್ತು ಪಟ್ಟಣದಲ್ಲಿ ಮುಸ್ಲಿಂ ಪೂಜಾ ಸಂರಕ್ಷಣೆಯೊಂದಿಗೆ ಇರಿಸುತ್ತದೆ, ಮತ್ತು ಹೊಸಕೋಟೆ ತಾಲ್ಲೂಕಿನ ಜೀವಂತ ಗರಡಿ (ಸಾಂಪ್ರದಾಯಿಕ ವ್ಯಾಯಾಮಶಾಲೆ) ಪರಂಪರೆಯೊಂದಿಗೆ, ಅಲ್ಲಿ ಆಂಜನೇಯ, ಕುಮಾರರಾಮ ಮತ್ತು ಮೌಲಾಲಿ (ಹಜ್ರತ್ ಅಲಿ, ಮುಸ್ಲಿಮರಿಂದ ಶಕ್ತಿಯ ಸಂಕೇತವೆಂದು ಪೂಜಿತ) ಹಿಂದೂ ಮತ್ತು ಮುಸ್ಲಿಂ ಕುಸ್ತಿಪಟುಗಳಿಂದ ಭೇದವಿಲ್ಲದೆ ಗರಡಿ ದೈವಗಳಾಗಿ ಒಟ್ಟಿಗೆ ಪೂಜಿಸಲ್ಪಡುತ್ತಾರೆ.'),
  citations: [c(SRC_VADHY_VOL11, 'Zainulla Ballari, "ವಿಜಯನಗರದ ಕುಸ್ತಿಯ ಬಗ್ಗೆ ಎರಡು ಶಾಸನಗಳು" (Two inscriptions about wrestling in Vijayanagara), pp. 89-98')],
  review,
})

// Source: "Vijayanagara Adhyayana" Volume 12 (Directorate of Archaeology and Museums, Mysore, 2007).
const SRC_VADHY_VOL12 = 'src-ia-karnataka-archaeology-asi-ka-vijayanagaraadhysamputa-12-0000drrg'

karnatakaArchaeologyMiningCulturalHeritage.push({
  id: 'culture-karch-rooka-generic-money-term',
  name: n('"Rooka/rokka" as generic Kannada word for cash, not a distinct Vijayanagara coin', '"ರೂಕ/ರೊಕ್ಕ" ಸಾಮಾನ್ಯ ಕನ್ನಡ ನಗದು ಪದ, ವಿಶಿಷ್ಟ ವಿಜಯನಗರ ನಾಣ್ಯವಲ್ಲ'),
  category: 'literature',
  date: d(1513, 1563, 'range'),
  polityIds: ['polity-vijayanagara'],
  placeIds: ['place-hampi'],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['numismatic-terminology', 'Kannada-epigraphic-vocabulary', 'coinage', 'living-usage'],
  continuity: 'continuing-practice',
  description: n('C. Mahadeva\'s paper responds to numismatist A.V. Narasimhamurthy\'s treatment of "rooka" as a distinct Deccan-Andhra silver coin (attested there from the 8th century CE, per Nellore inscriptions and a 1276 CE Sevuna Ramachandra grant at Pandharpur) whose presence and exact value in Karnataka Narasimhamurthy left uncertain. Reviewing a run of dated Kannada Vijayanagara inscriptions -- Muddalapura (1513), Melukote (1530), the Vitthala temple at Hampi (1534, 1536, 1563), an unnamed 1545 record, Pura (1547), Ravihalu (1544), Nakkarahalu (1562) and Krishnadevaraya\'s Udayagiri record -- Mahadeva shows "rokka"/"roka" appears there generically alongside actual denominations (gadyana, varaha) to mean "cash payment" broadly, not one specific coin. He connects this to the ordinary Kannada dictionary sense of rokka/rokka (cash, money; compare Hindi rok, Marathi rokh, Tamil/Malayalam/Tulu/Telugu rokkam) and to its continued colloquial use in North Karnataka today for money of any kind, paper or metal, and in personal names such as Rokkappa/Rokkappa Shetty among the (Telugu-home-language) Arya Vaishya community.', 'ಸಿ. ಮಹದೇವರ ಪ್ರಬಂಧ ನಾಣ್ಯಶಾಸ್ತ್ರಜ್ಞ ಎ.ವಿ. ನರಸಿಂಹಮೂರ್ತಿಯವರ "ರೂಕ"ವನ್ನು ಪ್ರತ್ಯೇಕ ದಖ್ಖನ್-ಆಂಧ್ರ ಬೆಳ್ಳಿ ನಾಣ್ಯವೆಂದು (8ನೇ ಶತಮಾನದಿಂದ ಅಲ್ಲಿ ದೃಢಪಟ್ಟ, ನೆಲ್ಲೂರು ಶಾಸನಗಳು ಮತ್ತು ಪಂಢರಾಪುರದ 1276ರ ಸೇವುಣ ರಾಮಚಂದ್ರ ಅನುದಾನದ ಪ್ರಕಾರ) ಪರಿಗಣಿಸಿದ್ದಕ್ಕೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತದೆ, ಇದರ ಕರ್ನಾಟಕದಲ್ಲಿ ಇರುವಿಕೆ ಮತ್ತು ನಿಖರ ಮೌಲ್ಯವನ್ನು ನರಸಿಂಹಮೂರ್ತಿ ಅನಿಶ್ಚಿತವಾಗಿ ಬಿಟ್ಟಿದ್ದರು. ದಿನಾಂಕಿತ ಕನ್ನಡ ವಿಜಯನಗರ ಶಾಸನಗಳ ಸರಣಿಯನ್ನು ಪರಿಶೀಲಿಸಿ -- ಮುದ್ದಲಾಪುರ (1513), ಮೇಲುಕೋಟೆ (1530), ಹಂಪೆಯ ವಿಠ್ಠಲ ದೇವಾಲಯ (1534, 1536, 1563), ಹೆಸರಿಲ್ಲದ 1545ರ ದಾಖಲೆ, ಪುರ (1547), ರಾವಿಹಾಳು (1544), ನಕ್ಕರಹಾಳು (1562) ಮತ್ತು ಕೃಷ್ಣದೇವರಾಯನ ಉದಯಗಿರಿ ದಾಖಲೆ -- ಮಹದೇವ "ರೊಕ್ಕ"/"ರೊಕ" ಅಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ನಿಜವಾದ ಮೌಲ್ಯಗಳ (ಗದ್ಯಾಣ, ವರಾಹ) ಜೊತೆಗೆ "ನಗದು ಪಾವತಿ" ಎಂಬ ವಿಶಾಲ ಅರ್ಥದಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆಂದೂ, ಒಂದು ನಿರ್ದಿಷ್ಟ ನಾಣ್ಯವಲ್ಲವೆಂದೂ ತೋರಿಸುತ್ತಾರೆ. ಇದನ್ನು ಅವರು ಸಾಮಾನ್ಯ ಕನ್ನಡ ನಿಘಂಟಿನ ರೊಕ್ಕ/ರೊಕ (ನಗದು, ಹಣ; ಹಿಂದಿ ರೋಕ್, ಮರಾಠಿ ರೋಖ್, ತಮಿಳು/ಮಲೆಯಾಳ/ತುಳು/ತೆಲುಗು ರೊಕ್ಕಂ ಹೋಲಿಸಿ) ಅರ್ಥದೊಂದಿಗೆ, ಮತ್ತು ಇಂದಿಗೂ ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ ಯಾವುದೇ ಬಗೆಯ ಹಣಕ್ಕೆ (ಕಾಗದ ಅಥವಾ ಲೋಹ) ಬಳಸುವ ಆಡುಮಾತಿನ ಬಳಕೆಯೊಂದಿಗೆ, ಮತ್ತು (ತೆಲುಗು-ಮನೆಮಾತಿನ) ಆರ್ಯ ವೈಶ್ಯ ಸಮುದಾಯದ ರೊಕ್ಕಪ್ಪ/ರೊಕ್ಕಪ್ಪ ಶೆಟ್ಟಿಯಂತಹ ವ್ಯಕ್ತಿನಾಮಗಳೊಂದಿಗೆ ಜೋಡಿಸುತ್ತಾರೆ.'),
  citations: [c(SRC_VADHY_VOL12, 'Dr. C. Mahadeva, "ರೂಕ ನಾಣ್ಯ - ಒಂದು ಪರಿಶೀಲನೆ" (The rooka coin: an examination), pp. 196-201, responding to A.V. Narasimhamurthy\'s "The Coins and Currency Systems of Karnataka"')],
  review,
})
