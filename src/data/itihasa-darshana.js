const name = (en, kn) => ({ en, kn })
const review = () => ({ status: 'reviewed', reviewer: 'atlas-source-screening', updatedAt: '2026-07-28' })

// Lightweight signals recorded after opening each item's _djvu.txt. These are
// discovery pointers for the next article-level review, not quotations or
// claims that have been promoted into the atlas.
const ocrSignals = {
  'kia.itihasadarshanas0000drsu': { kannada: 51, inscriptions: 445, literature: 40 },
  'bmshri.itihasadarshanav0000drsu': { kannada: 86, inscriptions: 268, literature: 26 },
  'kia.itihasadarsanasa0000drmgsamputa-25': { kannada: 65, inscriptions: 338, literature: 66 },
  'kia.itihasadarsanasa0000drmgsamputa-30': { kannada: 107, inscriptions: 358, literature: 38 },
  'kia.itihasadarshansa0000drsu1993samput8': { kannada: 48, inscriptions: 162, literature: 15 },
  'bmshri.itihasadarsanasa0000drmgsamputa-23': { kannada: 114, inscriptions: 407, literature: 57 },
  'kia.itihasadarshanas0000mgnasmput-13': { kannada: 96, inscriptions: 188, literature: 25 },
  'kia.itihasadarshanas0000mgnasmput-15': { kannada: 78, inscriptions: 120, literature: 39 },
  'kia.itihasadarshanav0000drde32': { kannada: 95, inscriptions: 215, literature: 19 },
  'kia.itihasadarshanav0000drde_d0t6': { kannada: 103, inscriptions: 235, literature: 36 },
  'kia.itihasadarshanav0000drmg': { kannada: 131, inscriptions: 153, literature: 21 },
  'kia.itihasadarshansa0000drsu1986snk1': { kannada: 49, inscriptions: 447, literature: 42 },
  'kia.itihasadrashanas0000drsu': { kannada: 65, inscriptions: 158, literature: 25 },
  'kia.itihasadarshanas0000mgnasmput-12': { kannada: 57, inscriptions: 218, literature: 27 },
  'bmshri.itihasadarshanav0000drmg': { kannada: 96, inscriptions: 306, literature: 68 },
  'kia.itihasadarshanav0000raja': { kannada: 94, inscriptions: 73, literature: 35 },
  'kia.itihasadarshanav0000drde_u3h1': { kannada: 94, inscriptions: 510, literature: 46 },
  'kia.itihasadarshanas0000drsu1994samput9': { kannada: 67, inscriptions: 277, literature: 14 },
  'kia.itihasadarsanasa0000drmgsamputa-24': { kannada: 79, inscriptions: 162, literature: 23 },
  'kia.itihasadarshanas0000drsu1991smput6': { kannada: 42, inscriptions: 373, literature: 11 },
  'kia.itihasadarsanasa0000mgnasmput-20': { kannada: 76, inscriptions: 185, literature: 31 },
  'kia.itihasadarsanasa0000mgnasmput-17': { kannada: 102, inscriptions: 180, literature: 21 },
  'kia.itihasadarshanav0000drde_y9v6': { kannada: 89, inscriptions: 397, literature: 18 },
  'kia.itihasadarsanasa0000mgnasmput-19': { kannada: 101, inscriptions: 303, literature: 15 },
  'kia.itihasadarsanasa0000mgnasmput-18': { kannada: 78, inscriptions: 134, literature: 19 },
  'kia.itihasadarshanas0000mgnasmput-14': { kannada: 58, inscriptions: 434, literature: 20 },
  'kia.itihasadarsanasa0000drmgsamputa-28': { kannada: 70, inscriptions: 283, literature: 18 },
  'kia.itihasadarsanasa0000mgnasmput-16': { kannada: 69, inscriptions: 475, literature: 84 },
  'kia.itihasadarshanav0000drde': { kannada: 84, inscriptions: 285, literature: 17 },
  'kia.itihasadarshanas0000drsusmput-11': { kannada: 98, inscriptions: 130, literature: 14 },
  'kia.itihasadarshanav0000drpv': { kannada: 132, inscriptions: 426, literature: 31 },
  'kia.itihasadarshanas0000drsu1989samput4': { kannada: 53, inscriptions: 324, literature: 27 },
  'kia.itihasadarshanas0000drsu1990smput5': { kannada: 83, inscriptions: 306, literature: 44 },
  'kia.itihasadarshanav0000drde_x7s2': { kannada: 104, inscriptions: 57, literature: 33 },
  'kia.itihasadarshansa0000drsu1987samut2': { kannada: 56, inscriptions: 134, literature: 34 },
  'itihasadarshanav0000drde': { kannada: 107, inscriptions: 337, literature: 64 },
  'kia.itihasadarshanas0000drsu1995smput10': { kannada: 74, inscriptions: 142, literature: 35 },
}

const link = (linkKind, labelEn, labelKn, targetCollection, targetRecordIds, confidence, reasonEn, reasonKn) => ({
  linkKind,
  label: name(labelEn, labelKn),
  targetCollection,
  targetRecordIds,
  confidence,
  status: 'needs-article-page-review',
  reason: name(reasonEn, reasonKn),
  requiredReview: [
    'articleTitle',
    'printedPage',
    'sourceQuotationOrSummary',
    'targetRecordConfirmation',
  ],
})

const inscriptionTargets = [
  'edition-inscription-halmidi-review-packet',
  'edition-inscription-talagunda',
  'edition-inscription-begur',
  'edition-inscription-atakur',
  'edition-inscription-lakkundi',
  'edition-inscription-belur-foundation',
  'edition-inscription-hampi-cluster',
  'edition-inscription-shravanabelagola-cluster',
]
const scriptTargets = [
  'script-southern-brahmi-kadamba-transition',
  'script-old-kannada-epigraphic-phase',
  'script-early-kannada-verse-transition',
  'script-medieval-kannada-temple-epigraphy',
  'script-vijayanagara-kannada-nagari-mixed-phase',
  'script-modern-kannada-print-transition',
]
const literatureTargets = [
  'work-kavirajamarga',
  'work-vikramarjuna-vijaya',
  'work-adipurana',
  'work-gadayuddha',
  'work-kumaravyasa-bharata',
  'work-torave-ramayana',
  'work-vaddaradhane',
]
const manuscriptTargets = [
  'manuscript-kavirajamarga-sanchaya-witness-lead',
  'manuscript-vikramarjuna-vijaya-sanchaya-witness-lead',
  'manuscript-adipurana-printed-edition-lead',
  'manuscript-vaddaradhane-palm-leaf-witness-lead',
  'manuscript-kumaravyasa-bharata-sanchaya-witness-lead',
  'manuscript-torave-ramayana-sanchaya-witness-lead',
]
const freedomTargets = ['src-ff-31']
const karnatakaParampareEventTargets = [
  'event-nanyadeva-founds-simraungarh',
  'event-eastern-chalukya-vengi-foundation',
  'event-goa-kadamba-gopakapattana',
  'event-sevuna-devagiri-independent-power',
  'event-rashtrakuta-western-central-india-reach',
]
const karnatakaParampareHeritageTargets = [
  'culture-simraungarh-karnata-fortress-city',
  'culture-gopakapattana-goa-kadamba-port',
  'culture-devagiri-sevuna-capital-fort',
]
const specialSourceLinks = {
  'kia.itihasadarshanas0000drsu1989samput4': [
    link(
      'freedom-movement-article-lead',
      'Women freedom fighters article lead',
      'ಮಹಿಳಾ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರ ಲೇಖನ ದಾರಿ',
      'freedom-fighter-sources',
      freedomTargets,
      'medium',
      'Existing freedom-fighter research notes identify this volume as a likely article source; exact article/page evidence is still required.',
      'ಈ ಸಂಪುಟವನ್ನು ಸಾಧ್ಯ ಲೇಖನ ಆಕರವೆಂದು ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರ ಸಂಶೋಧನಾ ಟಿಪ್ಪಣಿಗಳು ಗುರುತಿಸುತ್ತವೆ; ನಿಖರ ಲೇಖನ/ಪುಟ ಸಾಕ್ಷ್ಯ ಇನ್ನೂ ಬೇಕಾಗಿದೆ.',
    ),
  ],
  'kia.itihasadarsanasa0000drmgsamputa-25': [
    link(
      'freedom-movement-biography-lead',
      'Yashodharamma Dasappa biography lead',
      'ಯಶೋಧರಮ್ಮ ದಾಸಪ್ಪ ಜೀವನಚರಿತ್ರೆ ದಾರಿ',
      'freedom-fighter-sources',
      freedomTargets,
      'medium',
      'Existing freedom-fighter research notes identify this volume as a likely biography source; exact article/page evidence is still required.',
      'ಈ ಸಂಪುಟವನ್ನು ಸಾಧ್ಯ ಜೀವನಚರಿತ್ರೆ ಆಕರವೆಂದು ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರ ಸಂಶೋಧನಾ ಟಿಪ್ಪಣಿಗಳು ಗುರುತಿಸುತ್ತವೆ; ನಿಖರ ಲೇಖನ/ಪುಟ ಸಾಕ್ಷ್ಯ ಇನ್ನೂ ಬೇಕಾಗಿದೆ.',
    ),
  ],
  'sanchaya.karnatakaparampa0000_v1': [
    link(
      'karnataka-parampare-transregional-rule-lead',
      'Karnataka Parampare transregional rule leads',
      'ಕರ್ನಾಟಕ ಪರಂಪರೆ ಅಂತರಪ್ರಾದೇಶಿಕ ಆಳ್ವಿಕೆ ದಾರಿಗಳು',
      'events',
      karnatakaParampareEventTargets,
      'low',
      'User-supplied Karnataka Parampare volume is queued as a discovery source for outside-Karnataka rule and dynasty-branch packets; exact article and page locators are still required.',
      'ಬಳಕೆದಾರರು ನೀಡಿದ ಕರ್ನಾಟಕ ಪರಂಪರೆ ಸಂಪುಟವನ್ನು ಕರ್ನಾಟಕದಾಚೆಯ ಆಳ್ವಿಕೆ ಮತ್ತು ವಂಶ-ಶಾಖೆ ಕಡತಗಳ ಅನ್ವೇಷಣಾ ಆಕರವಾಗಿ ಸರದಿಗೆ ಸೇರಿಸಲಾಗಿದೆ; ನಿಖರ ಲೇಖನ ಮತ್ತು ಪುಟ ಸ್ಥಾನಸೂಚಿಗಳು ಇನ್ನೂ ಬೇಕಾಗಿವೆ.',
    ),
  ],
  'sanchaya.karnatakaparampa0000_v2': [
    link(
      'karnataka-parampare-heritage-lead',
      'Karnataka Parampare heritage and material-culture leads',
      'ಕರ್ನಾಟಕ ಪರಂಪರೆ ಪರಂಪರೆ-ವಸ್ತುಸಂಸ್ಕೃತಿ ದಾರಿಗಳು',
      'culturalHeritage',
      karnatakaParampareHeritageTargets,
      'low',
      'User-supplied Karnataka Parampare volume is queued for fortress, port-capital and material-culture review leads; cite only after the printed article/page is identified.',
      'ಬಳಕೆದಾರರು ನೀಡಿದ ಕರ್ನಾಟಕ ಪರಂಪರೆ ಸಂಪುಟವನ್ನು ಕೋಟೆ, ಬಂದರು-ರಾಜಧಾನಿ ಮತ್ತು ವಸ್ತುಸಂಸ್ಕೃತಿ ಪರಿಶೀಲನಾ ದಾರಿಗಳಿಗೆ ಸರದಿಗೆ ಸೇರಿಸಲಾಗಿದೆ; ಮುದ್ರಿತ ಲೇಖನ/ಪುಟ ಗುರುತಿಸಿದ ನಂತರ ಮಾತ್ರ ಉಲ್ಲೇಖಿಸಿ.',
    ),
  ],
}

const atlasLinksFor = id => {
  const signals = ocrSignals[id] || {}
  const links = []
  if ((signals.inscriptions || 0) >= 250) {
    links.push(link(
      'inscription-edition-review-lead',
      'Inscription edition review leads',
      'ಶಾಸನ ಆವೃತ್ತಿ ಪರಿಶೀಲನಾ ದಾರಿಗಳು',
      'inscriptionEditions',
      inscriptionTargets,
      signals.inscriptions >= 400 ? 'high' : 'medium',
      'High inscription OCR signal; use this volume to search for exact printed article, page and item locators for current inscription-edition packets.',
      'ಶಾಸನ OCR ಸೂಚನೆ ಹೆಚ್ಚಿನದು; ಪ್ರಸ್ತುತ ಶಾಸನ ಆವೃತ್ತಿ ಕಡತಗಳಿಗೆ ನಿಖರ ಮುದ್ರಿತ ಲೇಖನ, ಪುಟ ಮತ್ತು ವಸ್ತು ಸ್ಥಾನಸೂಚಿಗಳನ್ನು ಹುಡುಕಲು ಈ ಸಂಪುಟ ಬಳಸಿ.',
    ))
  }
  if ((signals.kannada || 0) >= 70 && (signals.inscriptions || 0) >= 120) {
    links.push(link(
      'script-evolution-review-lead',
      'Kannada script-evolution review leads',
      'ಕನ್ನಡ ಲಿಪಿ-ವಿಕಾಸ ಪರಿಶೀಲನಾ ದಾರಿಗಳು',
      'scriptEvolution',
      scriptTargets,
      signals.inscriptions >= 300 ? 'medium' : 'low',
      'Kannada plus inscription OCR signals make this volume useful for palaeography/script-phase article review.',
      'ಕನ್ನಡ ಮತ್ತು ಶಾಸನ OCR ಸೂಚನೆಗಳಿಂದ ಈ ಸಂಪುಟವು ಲಿಪಿಶಾಸ್ತ್ರ/ಲಿಪಿ ಹಂತಗಳ ಲೇಖನ ಪರಿಶೀಲನೆಗೆ ಉಪಯುಕ್ತವಾಗಿದೆ.',
    ))
  }
  if ((signals.literature || 0) >= 45) {
    links.push(link(
      'literature-review-lead',
      'Kannada literature review leads',
      'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಪರಿಶೀಲನಾ ದಾರಿಗಳು',
      'works',
      literatureTargets,
      signals.literature >= 60 ? 'high' : 'medium',
      'Literature OCR signal is strong enough to route this volume to work-date, author and court-context review packets.',
      'ಸಾಹಿತ್ಯ OCR ಸೂಚನೆ ಬಲವಾಗಿರುವುದರಿಂದ ಈ ಸಂಪುಟವನ್ನು ಕೃತಿ ದಿನಾಂಕ, ಕರ್ತೃ ಮತ್ತು ಆಸ್ಥಾನ ಸಂದರ್ಭ ಪರಿಶೀಲನಾ ಕಡತಗಳಿಗೆ ಜೋಡಿಸಲಾಗಿದೆ.',
    ))
    links.push(link(
      'manuscript-witness-review-lead',
      'Manuscript and edition witness leads',
      'ಹಸ್ತಪ್ರತಿ ಮತ್ತು ಆವೃತ್ತಿ ಸಾಕ್ಷ್ಯ ದಾರಿಗಳು',
      'manuscriptWitnesses',
      manuscriptTargets,
      'medium',
      'Literature-heavy volumes can help identify edition/source discussions for the current manuscript witness queue.',
      'ಸಾಹಿತ್ಯ-ಭಾರಿತ ಸಂಪುಟಗಳು ಪ್ರಸ್ತುತ ಹಸ್ತಪ್ರತಿ ಸಾಕ್ಷ್ಯ ಸರದಿಗೆ ಆವೃತ್ತಿ/ಆಕರ ಚರ್ಚೆಗಳನ್ನು ಗುರುತಿಸಲು ಸಹಾಯ ಮಾಡಬಹುದು.',
    ))
  }
  return [...links, ...(specialSourceLinks[id] || [])]
}

const volume = (id, label, titleKn, year = null) => {
  const slug = id.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
  const base = `https://archive.org/details/${id}`
  const text = `https://archive.org/stream/${id}/${id}_djvu.txt`
  const hocr = `https://archive.org/download/${id}/${id}_hocr.html`
  return {
    id: `src-itihasa-darshana-${slug}`,
    type: 'digitised-research-volume',
    title: name(`Itihasa Darshana, ${label}`, titleKn),
    authors: ['Karnataka Itihasa Academy'],
    publisher: 'Karnataka Itihasa Academy',
    year,
    url: base,
    collectionKey: 'itihasa-darshana',
    repository: {
      platform: 'Internet Archive',
      collectionId: 'ServantsOfKnowledge',
      identifier: id,
      fullTextUrl: text,
      hocrUrl: hocr,
    },
    contentReview: {
      status: 'screened',
      textFile: `${id}_djvu.txt`,
      hocrFile: `${id}_hocr.html`,
      accessedAt: '2026-07-28',
      pass: 'full-text-and-hocr-opened',
      ocrSignals: ocrSignals[id] || null,
      atlasLinks: atlasLinksFor(id),
      note: name(
        'Full-text OCR and HOCR were opened for catalogue and subject screening. Use the page image and printed locator for every quotation, transcription or translation; OCR is a discovery aid, not a substitute for the volume.',
        'ಸೂಚಿ ಮತ್ತು ವಿಷಯ ಪರಿಶೀಲನೆಗಾಗಿ ಸಂಪೂರ್ಣ OCR ಮತ್ತು HOCR ತೆರೆಯಲಾಗಿದೆ. ಪ್ರತಿಯೊಂದು ಉಲ್ಲೇಖ, ಲಿಪ್ಯಂತರ ಅಥವಾ ಅನುವಾದಕ್ಕೆ ಪುಟದ ಚಿತ್ರ ಮತ್ತು ಮುದ್ರಿತ ಸ್ಥಾನಸೂಚಿಯನ್ನು ಬಳಸಿ; OCR ಸಂಪುಟಕ್ಕೆ ಪರ್ಯಾಯವಲ್ಲ, ಶೋಧನಾ ಸಹಾಯಕ ಮಾತ್ರ.',
      ),
    },
    usageNote: name(
      'Cite the printed volume and Karnataka Itihasa Academy as publisher; use the Internet Archive item URL as the stable digital access point and add the printed page/article locator.',
      'ಮುದ್ರಿತ ಸಂಪುಟ ಮತ್ತು ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಅಕಾದೆಮಿಯನ್ನು ಪ್ರಕಾಶಕರಾಗಿ ಉಲ್ಲೇಖಿಸಿ; ಸ್ಥಿರ ಡಿಜಿಟಲ್ ಪ್ರವೇಶಕ್ಕಾಗಿ ಇಂಟರ್ನೆಟ್ ಆರ್ಕೈವ್ ದಾಖಲೆ ಕೊಂಡಿಯನ್ನು ಬಳಸಿ ಮತ್ತು ಮುದ್ರಿತ ಪುಟ/ಲೇಖನ ಸ್ಥಾನಸೂಚಿ ಸೇರಿಸಿ.',
    ),
    review: review(),
  }
}

export const itihasaDarshanaSources = [
  volume('kia.itihasadarshanas0000drsu', 'Volume 1, Issue 1', 'ಇತಿಹಾಸ ದರ್ಶನ - ಸಂಪುಟ ೧/ಸಂಚಿಕೆ ೧'),
  volume('bmshri.itihasadarshanav0000drsu', 'Volume 7 (1992)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 7/1992', 1992),
  volume('kia.itihasadarsanasa0000drmgsamputa-25', 'Volume 25', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 25'),
  volume('kia.itihasadarsanasa0000drmgsamputa-30', 'Volume 30', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 30'),
  volume('kia.itihasadarshansa0000drsu1993samput8', 'Volume 8 (1993)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೮', 1993),
  volume('bmshri.itihasadarsanasa0000drmgsamputa-23', 'Volume 23', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 23'),
  volume('kia.itihasadarshanas0000mgnasmput-13', 'Volume 13', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೩'),
  volume('kia.itihasadarshanas0000mgnasmput-15', 'Volume 15', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೫'),
  volume('kia.itihasadarshanav0000drde32', 'Volume 32 (2017)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 32/2017', 2017),
  volume('kia.itihasadarshanav0000drde_d0t6', 'Volume 34 (2019)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 34/2019', 2019),
  volume('kia.itihasadarshanav0000drmg', 'Volume 26 (2011)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 26/2011', 2011),
  volume('kia.itihasadarshansa0000drsu1986snk1', 'Volume 1, Issue 1 (1986)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧ ಸಂಚಿಕೆ ೧', 1986),
  volume('kia.itihasadrashanas0000drsu', 'Volume 3', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೩'),
  volume('kia.itihasadarshanas0000mgnasmput-12', 'Volume 12', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೨'),
  volume('bmshri.itihasadarshanav0000drmg', 'Volume 21 (2006)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 21', 2006),
  volume('kia.itihasadarshanav0000raja', 'Volume 37 (2022)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 37/2022', 2022),
  volume('kia.itihasadarshanav0000drde_u3h1', 'Volume 33 (2018)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 33/2018', 2018),
  volume('kia.itihasadarshanas0000drsu1994samput9', 'Volume 9 (1994)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೯', 1994),
  volume('kia.itihasadarsanasa0000drmgsamputa-24', 'Volume 24', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 24'),
  volume('kia.itihasadarshanas0000drsu1991smput6', 'Volume 6 (1991)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೬', 1991),
  volume('kia.itihasadarsanasa0000mgnasmput-20', 'Volume 20', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೨೦'),
  volume('kia.itihasadarsanasa0000mgnasmput-17', 'Volume 17', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೭'),
  volume('kia.itihasadarshanav0000drde_y9v6', 'Volume 36 (2021)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 36/2021', 2021),
  volume('kia.itihasadarsanasa0000mgnasmput-19', 'Volume 19', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೯'),
  volume('kia.itihasadarsanasa0000mgnasmput-18', 'Volume 18', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೮'),
  volume('kia.itihasadarshanas0000mgnasmput-14', 'Volume 14', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೪'),
  volume('kia.itihasadarsanasa0000drmgsamputa-28', 'Volume 28', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 28'),
  volume('kia.itihasadarsanasa0000mgnasmput-16', 'Volume 16', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೬'),
  volume('kia.itihasadarshanav0000drde', 'Volume 30 (2015)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 30/2015', 2015),
  volume('kia.itihasadarshanas0000drsusmput-11', 'Volume 11', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೧'),
  volume('kia.itihasadarshanav0000drpv', 'Volume 27 (2012)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 27/2012', 2012),
  volume('kia.itihasadarshanas0000drsu1989samput4', 'Volume 4 (1989)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೪', 1989),
  volume('kia.itihasadarshanas0000drsu1990smput5', 'Volume 5 (1990)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೫', 1990),
  volume('kia.itihasadarshanav0000drde_x7s2', 'Volume 35 (2020)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 35/2020', 2020),
  volume('kia.itihasadarshansa0000drsu1987samut2', 'Volume 2 (1987)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೨, ಸಂಚಿಕೆ ೧', 1987),
  volume('itihasadarshanav0000drde', 'Volume 31 (2016)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ 31/2016', 2016),
  volume('kia.itihasadarshanas0000drsu1995smput10', 'Volume 10 (1995)', 'ಇತಿಹಾಸ ದರ್ಶನ, ಸಂಪುಟ ೧೦', 1995),
]

const parampareVolume = (id, label, titleKn) => {
  const base = `https://archive.org/details/${id}`
  return {
    id: `src-karnataka-parampare-${id.replace(/^sanchaya\.karnatakaparampa0000_/, '')}`,
    type: 'digitised-research-volume',
    title: name(`Karnataka Parampare, ${label}`, titleKn),
    authors: ['Sanchaya contributors'],
    publisher: 'Sanchaya',
    year: null,
    url: base,
    collectionKey: 'karnataka-parampare',
    repository: {
      platform: 'Internet Archive',
      identifier: id,
      fullTextUrl: `https://archive.org/stream/${id}/${id}_djvu.txt`,
      hocrUrl: `https://archive.org/download/${id}/${id}_hocr.html`,
    },
    contentReview: {
      status: 'queued',
      textFile: `${id}_djvu.txt`,
      hocrFile: `${id}_hocr.html`,
      accessedAt: '2026-08-25',
      pass: 'source-registered-awaiting-full-text-screening',
      ocrSignals: null,
      atlasLinks: atlasLinksFor(id),
      note: name(
        'Registered from the user-supplied Internet Archive item. Reviewers must open OCR, HOCR and page images, then record article title, printed page and target-record fit before promoting citations.',
        'ಬಳಕೆದಾರರು ನೀಡಿದ ಇಂಟರ್ನೆಟ್ ಆರ್ಕೈವ್ ದಾಖಲೆಯಿಂದ ನೋಂದಾಯಿಸಲಾಗಿದೆ. citation ಉತ್ತೇಜಿಸುವ ಮೊದಲು ಪರಿಶೀಲಕರು OCR, HOCR ಮತ್ತು ಪುಟ ಚಿತ್ರಗಳನ್ನು ತೆರೆಯಬೇಕು; ಲೇಖನ ಶೀರ್ಷಿಕೆ, ಮುದ್ರಿತ ಪುಟ ಮತ್ತು ಗುರಿ-ದಾಖಲೆ ಹೊಂದಾಣಿಕೆಯನ್ನು ದಾಖಲಿಸಬೇಕು.',
      ),
    },
    usageNote: name(
      'Use as a discovery route until the exact article/page locator is captured; do not treat the volume-level link as final evidence.',
      'ನಿಖರ ಲೇಖನ/ಪುಟ ಸ್ಥಾನಸೂಚಿ ಹಿಡಿಯುವವರೆಗೆ ಇದನ್ನು ಅನ್ವೇಷಣಾ ದಾರಿಯಾಗಿ ಮಾತ್ರ ಬಳಸಿ; ಸಂಪುಟ-ಮಟ್ಟದ ಕೊಂಡಿಯನ್ನು ಅಂತಿಮ ಸಾಕ್ಷ್ಯವೆಂದು ಪರಿಗಣಿಸಬೇಡಿ.',
    ),
    review: { status: 'needs-review', reviewer: null, updatedAt: '2026-08-25' },
  }
}

export const karnatakaParampareSources = [
  parampareVolume('sanchaya.karnatakaparampa0000_v1', 'Volume 1', 'ಕರ್ನಾಟಕ ಪರಂಪರೆ, ಸಂಪುಟ ೧'),
  parampareVolume('sanchaya.karnatakaparampa0000_v2', 'Volume 2', 'ಕರ್ನಾಟಕ ಪರಂಪರೆ, ಸಂಪುಟ ೨'),
]
