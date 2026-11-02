// Approximate dynasty areas drawn on modern district and state units, in the style of printed dynasty maps.
// Units are assumed, not surveyed: a district or state is coloured when most of it is believed to lie in the
// dynasty's core (`districts`) or wider reach (`reach`). Every phase is unverified until a reviewer checks it.
const D = ids => ids.split(' ').map(id => `audit-${id}`)

const NORTH = 'bidar kalaburagi yadgir raichur koppal ballari vijayanagara'
const WEST = 'belagavi bagalkote vijayapura dharwad gadag haveri uttara-kannada'
const MALNAD = 'shivamogga chikkamagaluru kodagu dakshina-kannada udupi'
const OLD_MYSORE = 'mysuru chamarajanagar mandya hassan tumakuru chitradurga davanagere bengaluru-urban bengaluru-rural ramanagara kolar chikkaballapur'

export const DYNASTY_PHASES = [
  { id: 'kadamba', polityId: 'polity-kadamba', from: 345, to: 540, color: '#4aa36c', name: { en: 'Kadambas of Banavasi', kn: 'ಬನವಾಸಿಯ ಕದಂಬರು' }, capital: { en: 'Banavasi', kn: 'ಬನವಾಸಿ' },
    districts: D('uttara-kannada shivamogga haveri dharwad belagavi udupi dakshina-kannada chikkamagaluru gadag davanagere'), reach: ['in-goa'] },
  { id: 'western-ganga', polityId: 'polity-western-ganga', from: 350, to: 1000, color: '#8e6bb8', name: { en: 'Western Gangas', kn: 'ಪಶ್ಚಿಮ ಗಂಗರು' }, capital: { en: 'Talakadu', kn: 'ತಲಕಾಡು' },
    districts: D('mysuru chamarajanagar mandya hassan tumakuru bengaluru-urban bengaluru-rural ramanagara kolar chikkaballapur kodagu'), reach: ['in-tamil-nadu'] },
  { id: 'badami-chalukya', polityId: 'polity-badami-chalukya', from: 543, to: 757, color: '#e0a526', name: { en: 'Badami Chalukyas', kn: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು' }, capital: { en: 'Badami', kn: 'ಬಾದಾಮಿ' },
    districts: D(`${WEST} koppal raichur ballari vijayanagara kalaburagi yadgir davanagere chitradurga shivamogga`), reach: ['in-maharashtra', 'in-telangana', 'in-andhra-pradesh'] },
  { id: 'rashtrakuta', polityId: 'polity-rashtrakuta', from: 753, to: 973, color: '#d1573f', name: { en: 'Rashtrakutas', kn: 'ರಾಷ್ಟ್ರಕೂಟರು' }, capital: { en: 'Manyakheta', kn: 'ಮಾನ್ಯಖೇಟ' },
    districts: D(`${NORTH} ${WEST} davanagere chitradurga shivamogga tumakuru`), reach: ['in-maharashtra', 'in-telangana'] },
  { id: 'kalyani-chalukya', polityId: 'polity-kalyani-chalukya', from: 973, to: 1189, color: '#e08a2b', name: { en: 'Kalyani Chalukyas', kn: 'ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯರು' }, capital: { en: 'Kalyani', kn: 'ಕಲ್ಯಾಣ' },
    districts: D(`${NORTH} ${WEST} davanagere chitradurga shivamogga`), reach: ['in-maharashtra', 'in-telangana', 'in-andhra-pradesh'] },
  { id: 'hoysala', polityId: 'polity-hoysala', from: 1000, to: 1346, color: '#2f8fb8', name: { en: 'Hoysalas', kn: 'ಹೊಯ್ಸಳರು' }, capital: { en: 'Halebidu', kn: 'ದ್ವಾರಸಮುದ್ರ' },
    districts: D('hassan chikkamagaluru shivamogga mysuru mandya chamarajanagar tumakuru chitradurga davanagere kodagu bengaluru-urban bengaluru-rural ramanagara kolar chikkaballapur haveri'), reach: ['in-tamil-nadu'] },
  { id: 'bahmani', polityId: 'external-polity-bahmani', from: 1347, to: 1527, color: '#6f7f45', name: { en: 'Bahmani Sultanate', kn: 'ಬಹಮನಿ ಸುಲ್ತಾನರು' }, capital: { en: 'Bidar', kn: 'ಬೀದರ್' },
    districts: D('bidar kalaburagi yadgir raichur vijayapura'), reach: ['in-telangana', 'in-maharashtra'] },
  { id: 'vijayanagara', polityId: 'polity-vijayanagara', from: 1336, to: 1646, color: '#c2478f', name: { en: 'Vijayanagara Empire', kn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ' }, capital: { en: 'Hampi', kn: 'ಹಂಪಿ' },
    districts: D(`${OLD_MYSORE} ${MALNAD} koppal ballari vijayanagara gadag haveri dharwad uttara-kannada belagavi`), reach: ['in-andhra-pradesh', 'in-tamil-nadu'] },
  { id: 'adil-shahi', polityId: 'external-polity-adil-shahi', from: 1528, to: 1686, color: '#9a6b3d', name: { en: 'Adil Shahis of Bijapur', kn: 'ಆದಿಲ್‌ಶಾಹಿಗಳು' }, capital: { en: 'Bijapur', kn: 'ವಿಜಯಪುರ' },
    districts: D('vijayapura bagalkote kalaburagi yadgir raichur belagavi dharwad gadag koppal'), reach: ['in-maharashtra', 'in-goa'] },
  { id: 'mysore-sultanate', polityId: 'polity-mysore', from: 1761, to: 1799, color: '#b8332f', name: { en: 'Mysore under Hyder Ali and Tipu', kn: 'ಹೈದರ್ ಆಲಿ ಮತ್ತು ಟಿಪ್ಪುವಿನ ಮೈಸೂರು' }, capital: { en: 'Srirangapatna', kn: 'ಶ್ರೀರಂಗಪಟ್ಟಣ' },
    districts: D(`${OLD_MYSORE} ${MALNAD} ballari vijayanagara koppal gadag dharwad haveri uttara-kannada`), reach: ['in-kerala', 'in-tamil-nadu'] },
  { id: 'mysore-princely', polityId: 'polity-mysore', from: 1800, to: 1947, color: '#3f6bd1', name: { en: 'Princely State of Mysore', kn: 'ಮೈಸೂರು ಸಂಸ್ಥಾನ' }, capital: { en: 'Mysuru', kn: 'ಮೈಸೂರು' },
    districts: D('mysuru chamarajanagar mandya hassan tumakuru chitradurga davanagere shivamogga chikkamagaluru bengaluru-urban bengaluru-rural ramanagara kolar chikkaballapur'), reach: [] },
].map(phase => ({ ...phase, review: { status: 'needs-review' }, verification: 'unverified' }))

// One ruler per district for a year: the latest-starting dynasty whose core includes it wins.
export const dynastyAreasForYear = year => dynastyAreasFor(DYNASTY_PHASES.filter(phase => year >= phase.from && year <= phase.to))

export function dynastyAreasFor(active) {
  const byDistrict = new Map()
  for (const phase of [...active].sort((a, b) => a.from - b.from)) for (const id of phase.districts) byDistrict.set(id, phase)
  const byState = new Map()
  for (const phase of [...active].sort((a, b) => a.from - b.from)) for (const id of phase.reach) byState.set(id, phase)
  return { active, byDistrict, byState }
}
