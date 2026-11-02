// Dynasty phases drawn as evidence-based washes (see dynasty-evidence.js), not as district or state fills.
// Dates are conventional spans; every phase stays unverified until a reviewer checks it.
export const DYNASTY_PHASES = [
  { id: 'chutu', polityId: 'external-polity-chutu', from: 100, to: 345, color: '#7a9a4a', name: { en: 'Chutu dynasty of Banavasi', kn: 'ಬನವಾಸಿಯ ಚುಟು ವಂಶ' }, capital: { en: 'Banavasi', kn: 'ಬನವಾಸಿ' } },
  { id: 'kadamba', polityId: 'polity-kadamba', from: 345, to: 540, color: '#4aa36c', name: { en: 'Kadambas of Banavasi', kn: 'ಬನವಾಸಿಯ ಕದಂಬರು' }, capital: { en: 'Banavasi', kn: 'ಬನವಾಸಿ' } },
  { id: 'western-ganga', polityId: 'polity-western-ganga', from: 350, to: 1000, color: '#8e6bb8', name: { en: 'Western Gangas', kn: 'ಪಶ್ಚಿಮ ಗಂಗರು' }, capital: { en: 'Talakadu', kn: 'ತಲಕಾಡು' } },
  { id: 'alupa', polityId: 'polity-alupa', from: 450, to: 1400, color: '#3f8f9a', name: { en: 'Alupas of Mangaluru', kn: 'ಮಂಗಳೂರಿನ ಆಳುಪರು' }, capital: { en: 'Mangaluru', kn: 'ಮಂಗಳೂರು' } },
  { id: 'sendraka', polityId: 'external-polity-sendraka', from: 450, to: 700, color: '#7f9a5f', name: { en: 'Sendrakas of Nagarkhanda', kn: 'ನಾಗರಖಂಡದ ಸೇಂದ್ರಕರು' }, capital: { en: 'Banavasi province (approximate seat)', kn: 'ಬನವಾಸಿ ಪ್ರಾಂತ್ಯ (ಅಂದಾಜು ಕೇಂದ್ರ)' } },
  { id: 'badami-chalukya', polityId: 'polity-badami-chalukya', from: 543, to: 757, color: '#e0a526', name: { en: 'Badami Chalukyas', kn: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯರು' }, capital: { en: 'Badami', kn: 'ಬಾದಾಮಿ' } },
  { id: 'nolamba', polityId: 'external-polity-nolamba', from: 750, to: 1050, color: '#6f8f7f', name: { en: 'Nolambas of Nolambavadi', kn: 'ನೊಳಂಬವಾಡಿಯ ನೊಳಂಬರು' }, capital: { en: 'Hemavati', kn: 'ಹೆಮ್ಮಾವತಿ' } },
  { id: 'rashtrakuta', polityId: 'polity-rashtrakuta', from: 753, to: 973, color: '#d1573f', name: { en: 'Rashtrakutas', kn: 'ರಾಷ್ಟ್ರಕೂಟರು' }, capital: { en: 'Manyakheta', kn: 'ಮಾನ್ಯಖೇಟ' } },
  { id: 'santara', polityId: 'external-polity-santara', from: 800, to: 1200, color: '#8a7a4f', name: { en: 'Santaras of Hombuchcha', kn: 'ಹೊಂಬುಚ್ಚದ ಸಾಂತರರು' }, capital: { en: 'Hombuchcha', kn: 'ಹೊಂಬುಚ್ಚ' } },
  { id: 'bana', polityId: 'external-polity-bana', from: 800, to: 1000, color: '#6f5f9a', name: { en: 'Banas of Kolar', kn: 'ಕೋಲಾರದ ಬಾಣರು' }, capital: { en: 'Kolar (one of several capitals)', kn: 'ಕೋಲಾರ (ಹಲವು ರಾಜಧಾನಿಗಳಲ್ಲಿ ಒಂದು)' } },
  { id: 'ratta', polityId: 'external-polity-ratta', from: 875, to: 1250, color: '#a2664a', name: { en: 'Rattas of Saundatti', kn: 'ಸೌಂದತ್ತಿಯ ರಟ್ಟರು' }, capital: { en: 'Saundatti', kn: 'ಸೌಂದತ್ತಿ' } },
  { id: 'shilahara', polityId: 'external-polity-shilahara', from: 940, to: 1215, color: '#5b8a72', name: { en: 'Shilaharas of Kolhapur', kn: 'ಕೊಲ್ಹಾಪುರದ ಶಿಲಾಹಾರರು' }, capital: { en: 'Kolhapur', kn: 'ಕೊಲ್ಹಾಪುರ' } },
  { id: 'goa-kadamba', polityId: 'external-polity-goa-kadamba', from: 966, to: 1340, color: '#5aa05f', name: { en: 'Kadambas of Goa', kn: 'ಗೋವಾದ ಕದಂಬರು' }, capital: { en: 'Gopakapattana', kn: 'ಗೋಪಕಪಟ್ಟಣ' } },
  { id: 'kalyani-chalukya', polityId: 'polity-kalyani-chalukya', from: 973, to: 1189, color: '#e08a2b', name: { en: 'Kalyani Chalukyas', kn: 'ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯರು' }, capital: { en: 'Kalyani', kn: 'ಕಲ್ಯಾಣ' } },
  { id: 'hangal-kadamba', polityId: 'external-polity-hangal-kadamba', from: 980, to: 1250, color: '#5f9a7a', name: { en: 'Kadambas of Hangal', kn: 'ಹಾನಗಲ್ ಕದಂಬರು' }, capital: { en: 'Hangal', kn: 'ಹಾನಗಲ್' } },
  { id: 'hoysala', polityId: 'polity-hoysala', from: 1000, to: 1346, color: '#2f8fb8', name: { en: 'Hoysalas', kn: 'ಹೊಯ್ಸಳರು' }, capital: { en: 'Halebidu', kn: 'ದ್ವಾರಸಮುದ್ರ' } },
  { id: 'sinda', polityId: 'external-polity-sinda', from: 1000, to: 1300, color: '#9a5f7a', name: { en: 'Sindas of Yelburga', kn: 'ಯಲಬುರ್ಗಾ ಸಿಂದರು' }, capital: { en: 'Erambarage (Yelburga)', kn: 'ಎರಂಬರಗೆ (ಯಲಬುರ್ಗಾ)' } },
  { id: 'chengalva-kongalva', polityId: 'external-polity-chengalva-kongalva', from: 1000, to: 1400, color: '#5f8f8a', name: { en: 'Chengalvas and Kongalvas', kn: 'ಚಂಗಾಳ್ವರು ಮತ್ತು ಕೊಂಗಾಳ್ವರು' }, capital: { en: 'Periyapatna area (approximate seat)', kn: 'ಪಿರಿಯಾಪಟ್ಟಣ ಪ್ರದೇಶ (ಅಂದಾಜು ಕೇಂದ್ರ)' } },
  { id: 'chola-gangavadi', polityId: 'external-polity-chola', from: 1004, to: 1116, color: '#a64231', name: { en: 'Cholas in Gangavadi', kn: 'ಗಂಗವಾಡಿಯಲ್ಲಿ ಚೋಳರು' }, capital: { en: 'Thanjavur', kn: 'ತಂಜಾವೂರು' } },
  { id: 'gutta', polityId: 'external-polity-gutta', from: 1100, to: 1200, color: '#9a7f3f', name: { en: 'Guttas of Guttavolal', kn: 'ಗುತ್ತವೊಳಲಿನ ಗುತ್ತರು' }, capital: { en: 'Guttavolal (Guttal)', kn: 'ಗುತ್ತವೊಳಲು (ಗುತ್ತಲ)' } },
  { id: 'kalachuri', polityId: 'external-polity-kalachuri-kalyani', from: 1156, to: 1184, color: '#8a4f7d', name: { en: 'Kalachuris of Kalyani', kn: 'ಕಲ್ಯಾಣದ ಕಳಚುರಿಗಳು' }, capital: { en: 'Kalyani', kn: 'ಕಲ್ಯಾಣ' } },
  { id: 'seuna', polityId: 'external-polity-seuna', from: 1187, to: 1317, color: '#b5832e', name: { en: 'Seuna (Yadavas of Devagiri)', kn: 'ಸೇವುಣರು (ದೇವಗಿರಿಯ ಯಾದವರು)' }, capital: { en: 'Devagiri', kn: 'ದೇವಗಿರಿ' } },
  { id: 'kampili', polityId: 'polity-kampili', from: 1280, to: 1327, color: '#b0507a', name: { en: 'Kampili kingdom', kn: 'ಕಂಪಿಲ ರಾಜ್ಯ' }, capital: { en: 'Kummata', kn: 'ಕುಮ್ಮಟ' } },
  { id: 'vijayanagara', polityId: 'polity-vijayanagara', from: 1336, to: 1646, color: '#c2478f', name: { en: 'Karnataka (Vijayanagara) Empire', kn: 'ಕರ್ನಾಟಕ(ವಿಜಯನಗರ) ಸಾಮ್ರಾಜ್ಯ' }, capital: { en: 'Hampi', kn: 'ಹಂಪಿ' } },
  { id: 'bahmani', polityId: 'external-polity-bahmani', from: 1347, to: 1527, color: '#6f7f45', name: { en: 'Bahmani Sultanate', kn: 'ಬಹಮನಿ ಸುಲ್ತಾನರು' }, capital: { en: 'Bidar', kn: 'ಬೀದರ್' } },
  { id: 'wodeyar-mysore', polityId: 'external-polity-wodeyar-mysore', from: 1399, to: 1761, color: '#4a6fb0', name: { en: 'Wodeyars of Mysore (before 1761)', kn: 'ಮೈಸೂರು ಒಡೆಯರು (೧೭೬೧ಕ್ಕೆ ಮೊದಲು)' }, capital: { en: 'Mysuru', kn: 'ಮೈಸೂರು' } },
  { id: 'nadaprabhu', polityId: 'external-polity-nadaprabhu', from: 1420, to: 1728, color: '#a85d7a', name: { en: 'Nadaprabhus of Yelahanka', kn: 'ಯಲಹಂಕದ ನಾಡಪ್ರಭುಗಳು' }, capital: { en: 'Yelahanka', kn: 'ಯಲಹಂಕ' } },
  { id: 'barid-shahi', polityId: 'external-polity-barid-shahi', from: 1489, to: 1619, color: '#5f7f9a', name: { en: 'Barid Shahis of Bidar', kn: 'ಬೀದರ್‌ನ ಬರೀದ್‌ಶಾಹಿಗಳು' }, capital: { en: 'Bidar', kn: 'ಬೀದರ್' } },
  { id: 'keladi-nayaka', polityId: 'external-polity-keladi-nayaka', from: 1499, to: 1763, color: '#9a6a3a', name: { en: 'Keladi–Ikkeri Nayakas', kn: 'ಕೆಳದಿ–ಇಕ್ಕೇರಿ ನಾಯಕರು' }, capital: { en: 'Keladi', kn: 'ಕೆಳದಿ' } },
  { id: 'sode-nayaka', polityId: 'external-polity-sode-nayaka', from: 1500, to: 1764, color: '#8f6f4a', name: { en: 'Sode (Sonda) Nayakas', kn: 'ಸೋದೆ (ಸೊಂದಾ) ನಾಯಕರು' }, capital: { en: 'Sonda', kn: 'ಸೋದೆ' } },
  { id: 'adil-shahi', polityId: 'external-polity-adil-shahi', from: 1528, to: 1686, color: '#9a6b3d', name: { en: 'Adil Shahis of Bijapur', kn: 'ಆದಿಲ್‌ಶಾಹಿಗಳು' }, capital: { en: 'Bijapur', kn: 'ವಿಜಯಪುರ' } },
  { id: 'kittur', polityId: 'external-polity-kittur', from: 1585, to: 1824, color: '#a3405f', name: { en: 'Kittur Samsthana', kn: 'ಕಿತ್ತೂರು ಸಂಸ್ಥಾನ' }, capital: { en: 'Kittur', kn: 'ಕಿತ್ತೂರು' } },
  { id: 'chitradurga-nayaka', polityId: 'external-polity-chitradurga-nayaka', from: 1588, to: 1779, color: '#a06735', name: { en: 'Nayakas of Chitradurga', kn: 'ಚಿತ್ರದುರ್ಗದ ನಾಯಕರು' }, capital: { en: 'Chitradurga', kn: 'ಚಿತ್ರದುರ್ಗ' } },
  { id: 'haleri', polityId: 'external-polity-haleri', from: 1633, to: 1834, color: '#4f8a6a', name: { en: 'Haleri rajas of Kodagu', kn: 'ಕೊಡಗಿನ ಹಾಲೇರಿ ರಾಜರು' }, capital: { en: 'Madikeri', kn: 'ಮಡಿಕೇರಿ' } },
  { id: 'savanur-nawab', polityId: 'external-polity-savanur-nawab', from: 1672, to: 1948, color: '#7a6a9a', name: { en: 'Nawabs of Savanur', kn: 'ಸವಣೂರು ನವಾಬರು' }, capital: { en: 'Savanur', kn: 'ಸವಣೂರು' } },
  { id: 'maratha-karnataka', polityId: 'external-polity-maratha-confederacy', from: 1676, to: 1818, color: '#b06a32', name: { en: 'Marathas in Karnataka', kn: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಮರಾಠರು' }, capital: { en: 'Pune', kn: 'ಪುಣೆ' } },
  { id: 'surapura-nayaka', polityId: 'external-polity-surapura-nayaka', from: 1700, to: 1858, color: '#9a7a4f', name: { en: 'Surapura (Shorapur) Nayakas', kn: 'ಸುರಪುರ (ಶೋರಾಪುರ) ನಾಯಕರು' }, capital: { en: 'Shorapur', kn: 'ಶೋರಾಪುರ' } },
  { id: 'hyderabad-state', polityId: 'external-polity-hyderabad-state', from: 1724, to: 1948, color: '#557b68', name: { en: 'Hyderabad State (Nizam)', kn: 'ಹೈದರಾಬಾದ್ ಸಂಸ್ಥಾನ (ನಿಜಾಮ)' }, capital: { en: 'Hyderabad', kn: 'ಹೈದರಾಬಾದ್' } },
  { id: 'mysore-sultanate', polityId: 'polity-mysore', from: 1761, to: 1799, color: '#b8332f', name: { en: 'Mysore under Hyder Ali and Tipu', kn: 'ಹೈದರ್ ಆಲಿ ಮತ್ತು ಟಿಪ್ಪುವಿನ ಮೈಸೂರು' }, capital: { en: 'Srirangapatna', kn: 'ಶ್ರೀರಂಗಪಟ್ಟಣ' } },
  { id: 'mysore-princely', polityId: 'polity-mysore', from: 1800, to: 1947, color: '#3f6bd1', name: { en: 'Princely State of Mysore', kn: 'ಮೈಸೂರು ಸಂಸ್ಥಾನ' }, capital: { en: 'Mysuru', kn: 'ಮೈಸೂರು' } },
].map(phase => ({ ...phase, review: { status: 'needs-review' }, verification: 'unverified' }))

// A dynasty is on the year layer while the year falls inside its span.
export const dynastyAreasForYear = year => dynastyAreasFor(DYNASTY_PHASES.filter(phase => year >= phase.from && year <= phase.to))

export const dynastyAreasFor = active => ({ active: [...active].sort((a, b) => a.from - b.from) })
