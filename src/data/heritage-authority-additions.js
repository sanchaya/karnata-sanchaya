// Authority-led additions kept separate from the district seed list so that
// stable IDs and the original audit ordering are preserved as the inventory grows.

const n = (en, kn) => ({ en, kn })
const date = (from, to = from, precision = from === to ? 'year' : 'range', era = 'CE') => ({ from, to, era, precision })
const citation = (title, url, kind = 'official-web') => ({ title, url, kind, accessedAt: '2026-07-27' })
const authority = (name, role, sourceUrl) => ({ name: n(name[0], name[1]), role, sourceUrl })
const protection = (designation, sourceUrl, authorityName = ['Archaeological Survey of India', 'ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ']) => ({
  designation: n(designation[0], designation[1]),
  authority: n(authorityName[0], authorityName[1]),
  sourceUrl,
})

const baseVerification = ({
  verificationStatus = 'identified',
  externalIds = {},
  coordinates,
  constructionPhases,
  protectionStatus = [],
  managingAuthorities = [],
  siteCitations,
  verificationNote,
  protectionCheck = protectionStatus.length ? 'matched' : 'not-found-in-linked-registers',
  authorityCheck = managingAuthorities.length ? 'identified' : 'unresolved',
}) => ({
  verificationStatus,
  externalIds,
  coordinates,
  constructionPhases,
  protectionStatus,
  managingAuthorities,
  administrativeAreas: [],
  photographs: [],
  siteCitations,
  verificationNote: n(verificationNote[0], verificationNote[1]),
  verificationChecks: {
    photoLicence: { status: 'not-provided', checkedAt: null },
    protectionRegister: { status: protectionCheck, checkedAt: protectionCheck === 'matched' ? '2026-07-27' : null },
    managingAuthority: { status: authorityCheck, checkedAt: authorityCheck === 'identified' ? '2026-07-27' : null },
  },
  lastVerified: '2026-07-27',
})

const UNESCO_PATTADAKAL = 'https://whc.unesco.org/en/list/239/'
const UNESCO_PATTADAKAL_MAP = 'https://whc.unesco.org/en/tentativelists/5972/'
const UNESCO_HAMPI = 'https://whc.unesco.org/en/list/241'
const UNESCO_HOYSALA = 'https://whc.unesco.org/en/list/1670/'
const UNESCO_HOYSALA_MAP = 'https://whc.unesco.org/en/list/1670/maps/'
const ASI_CENTRAL_LIST = 'https://asi.nic.in/pdf/CPM_List.pdf'
const KARNATAKA_TOURISM_BANAVASI = 'https://karnatakatourism.org/en/destinations/banavasi'
const KARNATAKA_TOURISM_SHIVAMOGGA = 'https://old.karnatakatourism.org/tour-item/shivamogga/'
const CAG_KANAGANAHALLI = 'https://saiindia.gov.in/uploads/download_audit_report/2022/Final%20Eng%20PCMA%2010%20of%202022-062f0dc86c9e595.49471731.pdf'
const SANNATI_PHOTO = 'https://commons.wikimedia.org/wiki/File:3rd_century_BCE_to_7th_century_CE_Sannathi_Sannati_Sonti_ancient_city_archaeological_site,_Karnataka_India_-_97.jpg'

export const heritageAuthorityAdditions = [
  {
    districtId: 'audit-bagalkote',
    id: 'candidate-bagalkote-unesco-virupaksha-pattadakal',
    name: n('Virupaksha Temple, Pattadakal', 'ಪಟ್ಟದಕಲ್ಲಿನ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'partially-verified',
      externalIds: { unesco: '239', unescoComponent: 'Virupaksha Temple', asiRegister: 'Karnataka central protected list' },
      coordinates: { latitude: 15.9491667, longitude: 75.8158333, precision: 'site', coordinateSource: UNESCO_PATTADAKAL_MAP },
      constructionPhases: [{ name: n('Virupaksha Temple commissioned by Queen Lokamahadevi after the Chalukya victory in the south', 'ದಕ್ಷಿಣದ ಚಾಲುಕ್ಯ ವಿಜಯದ ನಂತರ ರಾಣಿ ಲೋಕಮಹಾದೇವಿಯಿಂದ ನಿರ್ಮಿಸಲಾದ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ'), date: date(740, 740, 'circa') }],
      protectionStatus: [protection(['UNESCO World Heritage property and centrally protected monument', 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣ ಮತ್ತು ಕೇಂದ್ರ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕ'], UNESCO_PATTADAKAL)],
      managingAuthorities: [authority(['Archaeological Survey of India — Dharwad Circle', 'ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ — ಧಾರವಾಡ ವೃತ್ತ'], 'statutory-protection', ASI_CENTRAL_LIST)],
      siteCitations: [citation('UNESCO — Group of Monuments at Pattadakal', UNESCO_PATTADAKAL, 'unesco-world-heritage'), citation('UNESCO tentative-list component coordinates', UNESCO_PATTADAKAL_MAP, 'unesco-geospatial-reference'), citation('ASI — Centrally Protected Monuments/Sites, Karnataka', ASI_CENTRAL_LIST, 'official-protection-register')],
      verificationNote: ['UNESCO identifies Virupaksha as the outstanding Pattadakal monument and dates it to about 740 CE. The point is transcribed from the UNESCO component-coordinate table; a dated Commons field photograph and monument-register number are still required before full verification.', 'ಯುನೆಸ್ಕೋವು ವಿರೂಪಾಕ್ಷವನ್ನು ಪಟ್ಟದಕಲ್ಲಿನ ಪ್ರಮುಖ ಸ್ಮಾರಕವೆಂದು ಗುರುತಿಸಿ ಸುಮಾರು ಕ್ರಿ.ಶ. 740ಕ್ಕೆ ದಿನಾಂಕಿಸುತ್ತದೆ. ಬಿಂದುವನ್ನು ಯುನೆಸ್ಕೋ ಘಟಕ-ನಿರ್ದೇಶಾಂಕ ಪಟ್ಟಿಯಿಂದ ದಾಖಲಿಸಲಾಗಿದೆ; ಸಂಪೂರ್ಣ ಪರಿಶೀಲನೆಗೆ ದಿನಾಂಕಿತ ಕಾಮನ್ಸ್ ಕ್ಷೇತ್ರ ಛಾಯಾಚಿತ್ರ ಮತ್ತು ಸ್ಮಾರಕ-ನೋಂದಣಿ ಸಂಖ್ಯೆ ಇನ್ನೂ ಅಗತ್ಯ.'],
    }),
  },
  {
    districtId: 'audit-bagalkote',
    id: 'candidate-bagalkote-unesco-mallikarjuna-pattadakal',
    name: n('Mallikarjuna Temple, Pattadakal', 'ಪಟ್ಟದಕಲ್ಲಿನ ಮಲ್ಲಿಕಾರ್ಜುನ ದೇವಾಲಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'partially-verified',
      externalIds: { unesco: '239', unescoComponent: 'Mallikarjuna Temple', asiRegister: 'Karnataka central protected list' },
      coordinates: { latitude: 15.9494444, longitude: 75.8158333, precision: 'site', coordinateSource: UNESCO_PATTADAKAL_MAP },
      constructionPhases: [{ name: n('Eighth-century Chalukya temple in the Pattadakal ensemble', 'ಪಟ್ಟದಕಲ್ಲು ಸಮುಚ್ಚಯದ ಎಂಟನೇ ಶತಮಾನದ ಚಾಲುಕ್ಯ ದೇವಾಲಯ'), date: date(740, 760, 'range') }],
      protectionStatus: [protection(['UNESCO World Heritage property and centrally protected monument', 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣ ಮತ್ತು ಕೇಂದ್ರ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕ'], UNESCO_PATTADAKAL)],
      managingAuthorities: [authority(['Archaeological Survey of India — Dharwad Circle', 'ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ — ಧಾರವಾಡ ವೃತ್ತ'], 'statutory-protection', ASI_CENTRAL_LIST)],
      siteCitations: [citation('UNESCO — Group of Monuments at Pattadakal', UNESCO_PATTADAKAL, 'unesco-world-heritage'), citation('UNESCO tentative-list component coordinates', UNESCO_PATTADAKAL_MAP, 'unesco-geospatial-reference'), citation('ASI — Centrally Protected Monuments/Sites, Karnataka', ASI_CENTRAL_LIST, 'official-protection-register')],
      verificationNote: ['Mallikarjuna is one of the named temples in UNESCO’s Pattadakal ensemble. Its point is taken from the UNESCO component-coordinate table; the individual ASI register entry, reusable photograph and current condition report remain to be captured.', 'ಮಲ್ಲಿಕಾರ್ಜುನವು ಯುನೆಸ್ಕೋ ಪಟ್ಟದಕಲ್ಲು ಸಮುಚ್ಚಯದಲ್ಲಿನ ಹೆಸರಿಸಲಾದ ದೇವಾಲಯಗಳಲ್ಲಿ ಒಂದು. ಇದರ ಬಿಂದುವನ್ನು ಯುನೆಸ್ಕೋ ಘಟಕ-ನಿರ್ದೇಶಾಂಕ ಪಟ್ಟಿಯಿಂದ ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ; ಪ್ರತ್ಯೇಕ ASI ನೋಂದಣಿ ದಾಖಲೆ, ಮರುಬಳಕೆ ಯೋಗ್ಯ ಚಿತ್ರ ಮತ್ತು ಇಂದಿನ ಸ್ಥಿತಿ ವರದಿ ಇನ್ನೂ ಬೇಕಾಗಿದೆ.'],
    }),
  },
  {
    districtId: 'audit-vijayanagara',
    id: 'candidate-vijayanagara-unesco-virupaksha-hampi',
    name: n('Virupaksha Temple, Hampi', 'ಹಂಪಿಯ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'partially-verified',
      externalIds: { unesco: '241', unescoComponent: 'Virupaksha Temple' },
      coordinates: { latitude: 15.3350000, longitude: 76.4600000, precision: 'site', coordinateSource: UNESCO_HAMPI },
      constructionPhases: [{ name: n('Temple known before the Vijayanagara foundation, with major Vijayanagara additions', 'ವಿಜಯನಗರ ಸ್ಥಾಪನೆಗೂ ಮುನ್ನದ ದೇವಾಲಯ; ವಿಜಯನಗರ ಕಾಲದ ಪ್ರಮುಖ ವಿಸ್ತರಣೆಗಳು'), date: date(1000, 1565, 'range') }],
      protectionStatus: [protection(['UNESCO World Heritage property under the AMASR legal framework', 'AMASR ಕಾನೂನು ಚೌಕಟ್ಟಿನಡಿ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣ'], UNESCO_HAMPI)],
      managingAuthorities: [authority(['Archaeological Survey of India — Hampi site office / Hampi World Heritage Area Management Authority', 'ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ — ಹಂಪಿ ತಾಣ ಕಚೇರಿ / ಹಂಪಿ ವಿಶ್ವ ಪರಂಪರೆ ಪ್ರದೇಶ ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ'], 'site-and-landscape-management', UNESCO_HAMPI)],
      siteCitations: [citation('UNESCO — Group of Monuments at Hampi', UNESCO_HAMPI, 'unesco-world-heritage')],
      verificationNote: ['UNESCO describes the Virupaksha temple as a continuously worshipped component of the Hampi property and notes an earlier origin with later additions. The map point is a site reference; item-level protection boundary, licensed field images and present condition are still pending.', 'ಯುನೆಸ್ಕೋವು ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯವನ್ನು ಹಂಪಿ ತಾಣದ ನಿರಂತರ ಪೂಜೆಯಲ್ಲಿರುವ ಘಟಕವೆಂದು ವಿವರಿಸಿ, ಹಿಂದಿನ ಮೂಲ ಮತ್ತು ನಂತರದ ವಿಸ್ತರಣೆಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ. ನಕ್ಷೆಯ ಬಿಂದು ತಾಣ-ಉಲ್ಲೇಖವಾಗಿದೆ; ಸ್ಮಾರಕಮಟ್ಟದ ರಕ್ಷಣಾ ಗಡಿ, ಪರವಾನಗಿ ಹೊಂದಿದ ಕ್ಷೇತ್ರ ಚಿತ್ರಗಳು ಮತ್ತು ಇಂದಿನ ಸ್ಥಿತಿ ಇನ್ನೂ ಬಾಕಿಯಿವೆ.'],
    }),
  },
  {
    districtId: 'audit-vijayanagara',
    id: 'candidate-vijayanagara-unesco-vittala-hampi',
    name: n('Vittala Temple Complex, Hampi', 'ಹಂಪಿಯ ವಿಠ್ಠಲ ದೇವಾಲಯ ಸಮುಚ್ಚಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'partially-verified',
      externalIds: { unesco: '241', unescoComponent: 'Vittala Temple Complex' },
      coordinates: { latitude: 15.3350000, longitude: 76.4754000, precision: 'site', coordinateSource: UNESCO_HAMPI },
      constructionPhases: [{ name: n('Fifteenth–sixteenth-century Vijayanagara temple complex', 'ಹದಿನೈದನೇ–ಹದಿನಾರನೇ ಶತಮಾನದ ವಿಜಯನಗರ ದೇವಾಲಯ ಸಮುಚ್ಚಯ'), date: date(1400, 1565, 'range') }],
      protectionStatus: [protection(['UNESCO World Heritage property under the AMASR legal framework', 'AMASR ಕಾನೂನು ಚೌಕಟ್ಟಿನಡಿ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣ'], UNESCO_HAMPI)],
      managingAuthorities: [authority(['Archaeological Survey of India — Hampi site office / Hampi World Heritage Area Management Authority', 'ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ — ಹಂಪಿ ತಾಣ ಕಚೇರಿ / ಹಂಪಿ ವಿಶ್ವ ಪರಂಪರೆ ಪ್ರದೇಶ ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ'], 'site-and-landscape-management', UNESCO_HAMPI)],
      siteCitations: [citation('UNESCO — Group of Monuments at Hampi', UNESCO_HAMPI, 'unesco-world-heritage')],
      verificationNote: ['UNESCO highlights the Vitthala complex as the culmination of Vijayanagara temple architecture. The point is a monument-level map reference; a current licensed photo set and component register match remain pending.', 'ಯುನೆಸ್ಕೋವು ವಿಠ್ಠಲ ಸಮುಚ್ಚಯವನ್ನು ವಿಜಯನಗರ ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪದ ಪರಿಪೂರ್ಣ ಹಂತವೆಂದು ಗುರುತಿಸುತ್ತದೆ. ಬಿಂದು ಸ್ಮಾರಕಮಟ್ಟದ ನಕ್ಷೆ ಉಲ್ಲೇಖವಾಗಿದೆ; ಇಂದಿನ ಪರವಾನಗಿ ಹೊಂದಿದ ಚಿತ್ರಸಮೂಹ ಮತ್ತು ಘಟಕ ನೋಂದಣಿ ಹೊಂದಿಕೆ ಇನ್ನೂ ಬಾಕಿಯಿದೆ.'],
    }),
  },
  {
    districtId: 'audit-hassan',
    id: 'candidate-hassan-unesco-chennakeshava-belur',
    name: n('Channakeshava Temple, Belur', 'ಬೇಲೂರಿನ ಚನ್ನಕೇಶವ ದೇವಾಲಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'partially-verified',
      externalIds: { unesco: '1670', unescoComponent: '1670-001' },
      coordinates: { latitude: 13.1628472, longitude: 75.8604056, precision: 'site', coordinateSource: UNESCO_HOYSALA_MAP },
      constructionPhases: [{ name: n('Foundation and continuing worship from 1117 CE', 'ಕ್ರಿ.ಶ. 1117ರಿಂದ ಪ್ರತಿಷ್ಠಾಪನೆ ಮತ್ತು ನಿರಂತರ ಪೂಜೆ'), date: date(1117) }],
      protectionStatus: [protection(['UNESCO Sacred Ensembles of the Hoysalas; protected monument under AMASR', 'ಯುನೆಸ್ಕೋ ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮುಚ್ಚಯಗಳು; AMASR ಅಡಿಯಲ್ಲಿ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕ'], UNESCO_HOYSALA)],
      managingAuthorities: [authority(['Archaeological Survey of India with the Sacred Ensembles of the Hoysalas Apex Committee', 'ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮುಚ್ಚಯಗಳ ಅಪೆಕ್ಸ್ ಸಮಿತಿಯೊಂದಿಗೆ ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ'], 'serial-property-management', UNESCO_HOYSALA)],
      siteCitations: [citation('UNESCO — Sacred Ensembles of the Hoysalas', UNESCO_HOYSALA, 'unesco-world-heritage'), citation('UNESCO — component map and coordinates', UNESCO_HOYSALA_MAP, 'unesco-geospatial-reference')],
      verificationNote: ['UNESCO’s serial-property record supplies the component ID, central coordinate, protection and management framework. A dated item-specific photograph and present-condition note remain required for full verification.', 'ಯುನೆಸ್ಕೋ ಸರಣಿ-ತಾಣ ದಾಖಲೆಯು ಘಟಕ ID, ಕೇಂದ್ರ ನಿರ್ದೇಶಾಂಕ, ರಕ್ಷಣಾ ಮತ್ತು ನಿರ್ವಹಣಾ ಚೌಕಟ್ಟನ್ನು ಒದಗಿಸುತ್ತದೆ. ಸಂಪೂರ್ಣ ಪರಿಶೀಲನೆಗೆ ದಿನಾಂಕಿತ ಸ್ಮಾರಕ-ನಿರ್ದಿಷ್ಟ ಛಾಯಾಚಿತ್ರ ಮತ್ತು ಇಂದಿನ ಸ್ಥಿತಿ ಟಿಪ್ಪಣಿ ಇನ್ನೂ ಅಗತ್ಯ.'],
    }),
  },
  {
    districtId: 'audit-hassan',
    id: 'candidate-hassan-unesco-hoysalesvara-halebidu',
    name: n('Hoysalesvara Temple, Halebidu', 'ಹಳೇಬೀಡಿನ ಹೊಯ್ಸಳೇಶ್ವರ ದೇವಾಲಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'partially-verified',
      externalIds: { unesco: '1670', unescoComponent: '1670-002' },
      coordinates: { latitude: 13.2124528, longitude: 75.9940722, precision: 'site', coordinateSource: UNESCO_HOYSALA_MAP },
      constructionPhases: [{ name: n('Twelfth-century Hoysala temple complex', 'ಹನ್ನೆರಡನೇ ಶತಮಾನದ ಹೊಯ್ಸಳ ದೇವಾಲಯ ಸಮುಚ್ಚಯ'), date: date(1121, 1200, 'range') }],
      protectionStatus: [protection(['UNESCO Sacred Ensembles of the Hoysalas; protected monument under AMASR', 'ಯುನೆಸ್ಕೋ ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮುಚ್ಚಯಗಳು; AMASR ಅಡಿಯಲ್ಲಿ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕ'], UNESCO_HOYSALA)],
      managingAuthorities: [authority(['Archaeological Survey of India with the Sacred Ensembles of the Hoysalas Apex Committee', 'ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮುಚ್ಚಯಗಳ ಅಪೆಕ್ಸ್ ಸಮಿತಿಯೊಂದಿಗೆ ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ'], 'serial-property-management', UNESCO_HOYSALA)],
      siteCitations: [citation('UNESCO — Sacred Ensembles of the Hoysalas', UNESCO_HOYSALA, 'unesco-world-heritage'), citation('UNESCO — component map and coordinates', UNESCO_HOYSALA_MAP, 'unesco-geospatial-reference')],
      verificationNote: ['UNESCO’s component map provides the central point and identifies Hoysalesvara as one of the three inscribed Hoysala ensembles. Current field condition, a reusable photograph and item-level protection record still require local verification.', 'ಯುನೆಸ್ಕೋ ಘಟಕ ನಕ್ಷೆಯು ಕೇಂದ್ರ ಬಿಂದು ಒದಗಿಸಿ ಹೊಯ್ಸಳೇಶ್ವರವನ್ನು ಮೂರು ವಿಶ್ವ ಪರಂಪರೆ ಹೊಯ್ಸಳ ಸಮುಚ್ಚಯಗಳಲ್ಲಿ ಒಂದೆಂದು ಗುರುತಿಸುತ್ತದೆ. ಇಂದಿನ ಕ್ಷೇತ್ರ ಸ್ಥಿತಿ, ಮರುಬಳಕೆ ಯೋಗ್ಯ ಚಿತ್ರ ಮತ್ತು ಸ್ಮಾರಕಮಟ್ಟದ ರಕ್ಷಣಾ ದಾಖಲೆಗಳಿಗೆ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಇನ್ನೂ ಬೇಕಾಗಿದೆ.'],
    }),
  },
  {
    districtId: 'audit-mysuru',
    id: 'candidate-mysuru-unesco-keshava-somanathapura',
    name: n('Keshava Temple, Somanathapura', 'ಸೋಮನಾಥಪುರದ ಕೇಶವ ದೇವಾಲಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'partially-verified',
      externalIds: { unesco: '1670', unescoComponent: '1670-003' },
      coordinates: { latitude: 12.2759694, longitude: 76.8817917, precision: 'site', coordinateSource: UNESCO_HOYSALA_MAP },
      constructionPhases: [{ name: n('Keshava temple completed in 1268 CE under the Hoysala period', 'ಹೊಯ್ಸಳ ಕಾಲದಲ್ಲಿ ಕ್ರಿ.ಶ. 1268ರಲ್ಲಿ ಪೂರ್ಣಗೊಂಡ ಕೇಶವ ದೇವಾಲಯ'), date: date(1268) }],
      protectionStatus: [protection(['UNESCO Sacred Ensembles of the Hoysalas; protected monument under AMASR', 'ಯುನೆಸ್ಕೋ ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮುಚ್ಚಯಗಳು; AMASR ಅಡಿಯಲ್ಲಿ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕ'], UNESCO_HOYSALA)],
      managingAuthorities: [authority(['Archaeological Survey of India with the Sacred Ensembles of the Hoysalas Apex Committee', 'ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮುಚ್ಚಯಗಳ ಅಪೆಕ್ಸ್ ಸಮಿತಿಯೊಂದಿಗೆ ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ'], 'serial-property-management', UNESCO_HOYSALA)],
      siteCitations: [citation('UNESCO — Sacred Ensembles of the Hoysalas', UNESCO_HOYSALA, 'unesco-world-heritage'), citation('UNESCO — component map and coordinates', UNESCO_HOYSALA_MAP, 'unesco-geospatial-reference')],
      verificationNote: ['UNESCO identifies Keshava Temple as the Mysuru component of the 2023 serial World Heritage property and provides its central coordinate. A dated field-condition record and reusable photograph remain to be added.', 'ಯುನೆಸ್ಕೋವು ಕೇಶವ ದೇವಾಲಯವನ್ನು 2023ರ ಸರಣಿ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣದ ಮೈಸೂರು ಘಟಕವೆಂದು ಗುರುತಿಸಿ ಕೇಂದ್ರ ನಿರ್ದೇಶಾಂಕ ನೀಡುತ್ತದೆ. ದಿನಾಂಕಿತ ಕ್ಷೇತ್ರ-ಸ್ಥಿತಿ ದಾಖಲೆ ಮತ್ತು ಮರುಬಳಕೆ ಯೋಗ್ಯ ಚಿತ್ರ ಇನ್ನೂ ಸೇರಿಸಬೇಕಿದೆ.'],
    }),
  },
  {
    districtId: 'audit-kalaburagi',
    id: 'candidate-kalaburagi-asi-kanaganahalli-sannati',
    name: n('Kanaganahalli–Sannati Buddhist archaeological complex', 'ಕನಗನಹಳ್ಳಿ–ಸನ್ನತಿ ಬೌದ್ಧ ಪುರಾತತ್ತ್ವ ಸಮುಚ್ಚಯ'),
    category: 'archaeological-landscape',
    verification: baseVerification({
      verificationStatus: 'partially-verified',
      externalIds: { asiRegister: 'Kanaganahalli excavated site; notified 2003', commonsPhoto: SANNATI_PHOTO },
      coordinates: { latitude: 16.835889, longitude: 76.933806, precision: 'site', coordinateSource: SANNATI_PHOTO },
      constructionPhases: [{ name: n('Early historic Buddhist occupation and later archaeological phases', 'ಆರಂಭಿಕ ಐತಿಹಾಸಿಕ ಬೌದ್ಧ ವಾಸಸ್ಥಾನ ಮತ್ತು ನಂತರದ ಪುರಾತತ್ತ್ವ ಹಂತಗಳು'), date: date(1, 700, 'range') }],
      protectionStatus: [protection(['ASI-protected excavated archaeological site, notified 2003', '2003ರಲ್ಲಿ ಅಧಿಸೂಚಿತ ASI ಸಂರಕ್ಷಿತ ಉತ್ಖನನ ಪುರಾತತ್ತ್ವ ತಾಣ'], ASI_CENTRAL_LIST)],
      managingAuthorities: [authority(['Archaeological Survey of India — Dharwad Circle', 'ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ — ಧಾರವಾಡ ವೃತ್ತ'], 'statutory-protection', ASI_CENTRAL_LIST)],
      siteCitations: [citation('ASI — Centrally Protected Monuments/Sites, Karnataka', ASI_CENTRAL_LIST, 'official-protection-register'), citation('CAG conservation follow-up: Kanaganahalli', CAG_KANAGANAHALLI, 'official-condition-audit'), citation('Dated geotagged Sannati site photograph', SANNATI_PHOTO, 'dated-field-photograph')],
      verificationNote: ['The ASI identity and 2003 notification are carried over from the linked condition audit, while the coordinate is an EXIF field-photo point rather than an authority-issued boundary. The record is map-visible but remains review-gated until the protected boundary, site condition and licensed image set are independently checked.', 'ASI ಗುರುತು ಮತ್ತು 2003ರ ಅಧಿಸೂಚನೆಯನ್ನು ಸಂಪರ್ಕಿತ ಸ್ಥಿತಿ ಲೆಕ್ಕಪರಿಶೋಧನೆಯಿಂದ ತೆಗೆದುಕೊಳ್ಳಲಾಗಿದೆ; ನಿರ್ದೇಶಾಂಕವು ಪ್ರಾಧಿಕಾರ ನೀಡಿದ ಗಡಿಯಲ್ಲ, EXIF ಕ್ಷೇತ್ರ-ಚಿತ್ರದ ಬಿಂದುವಾಗಿದೆ. ಸಂರಕ್ಷಿತ ಗಡಿ, ತಾಣದ ಸ್ಥಿತಿ ಮತ್ತು ಪರವಾನಗಿ ಹೊಂದಿದ ಚಿತ್ರಸಮೂಹವನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸುವವರೆಗೆ ದಾಖಲೆ ನಕ್ಷೆಯಲ್ಲಿ ಕಾಣಿಸಿದರೂ ಪರಿಶೀಲನೆ-ತಡೆಗೊಳಿಸಲಾಗಿದೆ.'],
    }),
  },
  {
    districtId: 'audit-uttara-kannada',
    id: 'candidate-uttara-kannada-madhukeshwara-banavasi',
    name: n('Madhukeshwara Temple, Banavasi', 'ಬನವಾಸಿಯ ಮಧುಕೇಶ್ವರ ದೇವಾಲಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'identified',
      externalIds: { stateHeritage: 'Banavasi historic capital' },
      coordinates: { latitude: 14.5406000, longitude: 74.8674000, precision: 'approximate-site', coordinateSource: KARNATAKA_TOURISM_BANAVASI },
      constructionPhases: [{ name: n('Early Chalukyan fabric and later temple layers; state tourism describes the surviving temple as ninth century', 'ಆರಂಭಿಕ ಚಾಲುಕ್ಯ ವಾಸ್ತುಪದರಗಳು ಮತ್ತು ನಂತರದ ದೇವಾಲಯ ಪದರಗಳು; ರಾಜ್ಯ ಪ್ರವಾಸೋದ್ಯಮವು ಉಳಿದ ದೇವಾಲಯವನ್ನು ಒಂಬತ್ತನೇ ಶತಮಾನವೆಂದು ವಿವರಿಸುತ್ತದೆ'), date: date(800, 1000, 'range') }],
      siteCitations: [citation('Karnataka Tourism — Banavasi', KARNATAKA_TOURISM_BANAVASI, 'official-tourism-page')],
      verificationNote: ['Banavasi is an important Kadamba capital and the state tourism page identifies Madhukeshwara as its central early-Chalukyan temple. The point is an approximate site reference; protection register, managing authority, dated condition and a reusable field photograph remain to be verified.', 'ಬನವಾಸಿ ಪ್ರಮುಖ ಕದಂಬ ರಾಜಧಾನಿಯಾಗಿದ್ದು, ರಾಜ್ಯ ಪ್ರವಾಸೋದ್ಯಮ ಪುಟವು ಮಧುಕೇಶ್ವರವನ್ನು ಅದರ ಕೇಂದ್ರ ಆರಂಭಿಕ ಚಾಲುಕ್ಯ ದೇವಾಲಯವೆಂದು ಗುರುತಿಸುತ್ತದೆ. ಬಿಂದು ಅಂದಾಜು ತಾಣ ಉಲ್ಲೇಖವಾಗಿದೆ; ರಕ್ಷಣಾ ನೋಂದಣಿ, ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ, ದಿನಾಂಕಿತ ಸ್ಥಿತಿ ಮತ್ತು ಮರುಬಳಕೆ ಯೋಗ್ಯ ಕ್ಷೇತ್ರ ಚಿತ್ರ ಇನ್ನೂ ಪರಿಶೀಲಿಸಬೇಕಿದೆ.'],
    }),
  },
  {
    districtId: 'audit-shivamogga',
    id: 'candidate-shivamogga-pranaveshvara-talagunda',
    name: n('Pranaveshvara Temple, Talagunda', 'ತಾಳಗುಂದದ ಪ್ರಾಣವೇಶ್ವರ ದೇವಾಲಯ'),
    category: 'temple',
    verification: baseVerification({
      verificationStatus: 'identified',
      externalIds: { stateHeritage: 'Talagunda ancient temple and inscription landscape' },
      coordinates: { latitude: 14.4200000, longitude: 75.2600000, precision: 'settlement-reference', coordinateSource: KARNATAKA_TOURISM_SHIVAMOGGA },
      constructionPhases: [{ name: n('Early Kadamba-period temple and inscription landscape', 'ಆರಂಭಿಕ ಕದಂಬ ಕಾಲದ ದೇವಾಲಯ ಮತ್ತು ಶಾಸನ ಭೂದೃಶ್ಯ'), date: date(450, 550, 'range') }],
      siteCitations: [citation('Karnataka Tourism — Shivamogga/Talagunda discovery lead', KARNATAKA_TOURISM_SHIVAMOGGA, 'official-tourism-page')],
      verificationNote: ['The state tourism discovery page identifies Talagunda’s ancient temple and inscription setting. This is a settlement-level map point, not a surveyed monument centroid; ASI or State Archaeology protection, present authority, field condition and a licensed photograph remain open research tasks.', 'ರಾಜ್ಯ ಪ್ರವಾಸೋದ್ಯಮದ ಪರಿಚಯ ಪುಟವು ತಾಳಗುಂದದ ಪ್ರಾಚೀನ ದೇವಾಲಯ ಮತ್ತು ಶಾಸನ ಸಂದರ್ಭವನ್ನು ಗುರುತಿಸುತ್ತದೆ. ಇದು ಸಮೀಕ್ಷಿತ ಸ್ಮಾರಕ ಕೇಂದ್ರಬಿಂದುವಲ್ಲ, ವಸತಿ-ಮಟ್ಟದ ನಕ್ಷೆ ಬಿಂದು; ASI ಅಥವಾ ರಾಜ್ಯ ಪುರಾತತ್ವ ರಕ್ಷಣೆ, ಪ್ರಸ್ತುತ ಪ್ರಾಧಿಕಾರ, ಕ್ಷೇತ್ರ ಸ್ಥಿತಿ ಮತ್ತು ಪರವಾನಗಿ ಚಿತ್ರ ಇನ್ನೂ ಸಂಶೋಧನಾ ಬಾಕಿಗಳಾಗಿವೆ.'],
    }),
  },
]

