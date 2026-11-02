// Facts taken from "A Historical Atlas of Karnataka" (H. Shashidhar and N. Sreenivasa Murthy, Directorate of Census Operations Karnataka,
// Census of India 2001 data product 29-017-2001-Cen-Book, published 2004), read from the Internet Archive scan
// https://archive.org/details/62_36931_2001_his . The book is Government of India copyright: only dates, names, places and figures are
// recorded here, in our own wording, each with its map number. No text or map is reproduced. The atlas says its maps show each dynasty's
// greatest extent "marked approximately", and that its maps were drawn from published literature, not from surveys.
export const CENSUS_ATLAS_SOURCE_ID = 'src-census-2004-historical-atlas-karnataka'

export const censusAtlasSources = [{
  id: CENSUS_ATLAS_SOURCE_ID, type: 'government-publication',
  title: { en: 'A Historical Atlas of Karnataka (Census of India 2001, Directorate of Census Operations Karnataka, 2004)', kn: 'ಕರ್ನಾಟಕದ ಐತಿಹಾಸಿಕ ಭೂಪಟ ಸಂಗ್ರಹ (ಭಾರತದ ಜನಗಣತಿ 2001, ಜನಗಣತಿ ಕಾರ್ಯಾಚರಣೆಗಳ ನಿರ್ದೇಶನಾಲಯ, ಕರ್ನಾಟಕ, 2004)' },
  authors: ['H. Shashidhar', 'N. Sreenivasa Murthy'], year: 2004, publisher: 'Directorate of Census Operations, Karnataka',
  url: 'https://archive.org/details/62_36931_2001_his', provenanceRole: 'secondary-compilation',
  review: { status: 'needs-review', reviewer: null, updatedAt: '2026-11-02' },
}]

// phaseId matches DYNASTY_PHASES. `period` is the span the atlas prints for its map; `areaKm2` its approximate greatest extent;
// `map` its map number. Lists are short facts the atlas gives for the dynasty.
const P = (phaseId, map, name, from, to, areaKm2, capitals, origin, rulers, languages, works, monuments) => ({ phaseId, map, name, period: { from, to }, areaKm2, capitals, origin, rulers, languages, works, monuments })
export const CENSUS_ATLAS_PROFILES = [
  P('kadamba', 6, 'The Kadambas of Banavasi', 325, 540, 81152, ['Banavasi (Uttara Kannada)'], 'Talagunda (Shivamogga district)', ['Mayura Sharma', 'Kakustha Varma'], ['Sanskrit', 'Kannada'], ['Talagunda inscription', 'Halmidi inscription, named the first Kannada record'], ['Madhukeshwara and Pranaveshwara temples at Talagunda', 'Jain basadi at Halasi']),
  P('western-ganga', 7, 'The Gangas of Talakad', 325, 1004, 182266, ['Talakad (Mysuru district)'], 'Claimed descent from Ayodhya; first capital Kolar', ['Avinita', 'Durvinita', 'Sripurusha'], ['Sanskrit', 'Kannada'], ['Chamundaraya Purana', 'Chandombudhi (Nagavarma)', 'Shabdavatara (Pujyapada)'], ['Gomateshwara at Shravanabelagola', 'Arkeshwara and Pataleshwara temples', 'Jain basadi at Kambadahalli']),
  P('badami-chalukya', 8, 'The Chalukyas of Badami', 500, 757, 801957, ['Badami (Bagalkote district)'], 'Claimed descent from Ayodhya', ['Mangalesha', 'Pulakeshi II', 'Vikramaditya I', 'Vijayaditya'], ['Sanskrit', 'Kannada'], ['Aihole inscription (Ravikirti)', 'Kaumudimahotsava (Vijaya Bhattarika)'], ['Cave temples at Badami', 'Durga temple at Aihole', 'Virupaksha and Mallikarjuna temples at Pattadakal']),
  P('rashtrakuta', 9, 'The Rashtrakutas of Malkhed', 757, 973, 899248, ['Malkhed (Kalaburagi district)'], 'First capital Elichpur (Achalapura); original home Lattalur (Latur)', ['Krishna I', 'Dhruva', 'Govinda III', 'Amoghavarsha I'], ['Sanskrit', 'Kannada'], ['Kavirajamarga (Amoghavarsha Nrupatunga)', 'Adipurana (Pampa)', 'Shantipurana (Ponna)', 'Vaddaradhane (Shivakotyacharya)'], ['Kailasa temple at Ellora', 'Trimurti sculpture at Elephanta', 'Jain basadi at Pattadakal']),
  P('kalyani-chalukya', 10, 'The Chalukyas of Kalyan', 973, 1189, 842472, ['Kalyan, now Basavakalyana (Bidar district)'], 'Badami (Bagalkote district)', ['Taila', 'Someshwara I', 'Someshwara III', 'Vikramaditya VI'], ['Sanskrit', 'Kannada'], ['Gadayuddha and Ajitapurana (Ranna)', 'Mitakshara (Vijnaneshwara)', 'Vachana literature (Basavanna and others)'], ['Kashi Vishweshwara and Brahma Jinalaya at Lakkundi', 'Trikuteshwara and Saraswati temples at Gadag', 'Mahadeva temple at Itagi']),
  P('kalachuri', 10, 'The Kalachuri interregnum (map 10)', 1167, 1184, 842472, ['Kalyan'], '', ['Bijjala'], [], [], []),
  P('chola-gangavadi', 11, 'The Cholas of Thanjavur', 985, 1122, 337831, ['Thanjavur (Tamil Nadu); in Karnataka only southern Gangavadi'], 'First capital Uraiyur (Tamil Nadu)', ['Rajaraja I', 'Rajadhiraja', 'Kulothunga I'], ['Sanskrit', 'Tamil'], ['Kalingattuparani (Jayagondar)', 'Kamba Ramayana', 'Periyapuranam (Sekkilar)'], ['Brihadeshwara temple at Thanjavur', 'Gangaikonda Cholapuram']),
  P('seuna', 12, 'The Seunas or Yadavas of Devagiri', 1198, 1312, 476212, ['Devagiri (Daulatabad, Maharashtra)'], 'Said to be originally from Karnataka', ['Bhillama V', 'Singhana II'], ['Sanskrit', 'Kannada', 'Marathi'], ['Sangeeta Ratnakara (Sharangadeva)', 'Chaturvarga Chintamani (Hemadri)'], ['Temples at Sangamner']),
  P('hoysala', 13, 'The Hoysalas of Dorasamudra', 1000, 1346, 287214, ['Dorasamudra, now Halebidu (Hassan district)'], 'Sosevuru (Shashakapura), now Angadi in Chikkamagaluru district', ['Vishnuvardhana', 'Ballala II', 'Ballala III'], ['Sanskrit', 'Kannada'], ['Yashodhara Charite (Janna)', 'Harishchandra Kavya (Raghavanka)', 'Girija Kalyana (Harihara)'], ['Hoysaleshwara temple at Halebidu', 'Channakeshava temple at Belur', 'Keshava temple at Somanathapura']),
  P('vijayanagara', 14, 'The Vijayanagara Empire', 1336, 1565, 494396, ['Vijayanagara, now Hampi (Ballari district)'], 'Origin theories differ (Warangal or Dorasamudra)', ['Bukka I', 'Devaraya II', 'Krishnadevaraya'], ['Sanskrit', 'Kannada', 'Telugu'], ['Gadugina Bharata (Kumaravyasa)', 'Amuktamalyada (Krishnadevaraya)', 'Dasa literature (Kanakadasa, Purandaradasa)'], ['Virupaksha temple at Hampi', 'Vidyashankara temple at Sringeri']),
  P('bahmani', 15, 'The Bahmani Kingdom', 1347, 1527, 552180, ['Gulbarga, later Bidar'], 'Delhi', ['Muhammad Shah I', 'Feroze Shah', 'Muhammad Shah II'], ['Persian', 'Urdu'], ['Dakhni literature'], ['Fort and Jama Masjid at Gulbarga', 'Sola Khamba Masjid and Mahmud Gawan Madrasa at Bidar']),
  P('adil-shahi', 16, 'The Adil Shahis of Bijapur', 1489, 1686, 294213, ['Bijapur'], 'Middle East', ['Yusuf Adil Khan', 'Ibrahim Adil Shah II'], ['Persian', 'Urdu', 'Kannada'], ['Kitab-e-Navras (Ibrahim II)', 'Tazkirat-ul-Muluk (Shirazi)'], ['Gol Gumbaz', 'Ibrahim Rauza', 'Jama Masjid, Bijapur']),
  P('barid-shahi', 17, 'The Barid Shahis of Bidar', 1487, 1619, 25900, ['Bidar'], 'North India', ['Amir Qasim Barid', 'Amir Ali Barid'], ['Persian', 'Urdu', 'Kannada'], [], ['Barid Shahi tombs outside Bidar']),
  P('nadaprabhu', 18, 'The Nadaprabhus of Yelahanka', 1420, 1728, 11154, ['Yelahanka'], 'Yelamanjiuttur (Kolar district); began as subordinates of Vijayanagara', ['Kempananje Gowda', 'Kempe Gowda I', 'Kempe Gowda II'], ['Kannada'], [], ['Basava and Someshwara temples', 'Gavi Gangadhareshwara temple, Bengaluru', 'Rameshwara temple at Magadi', 'Veerabhadra temple at Savanadurga']),
  P('keladi-nayaka', 19, 'The Nayakas of Keladi', 1500, 1763, 60300, ['Keladi, Ikkeri and Bidanur (Shivamogga district)'], 'Hallibayalu (Shivamogga district); began as subordinates of Vijayanagara', ['Shivappa Nayaka', 'Rani Channammaji'], ['Sanskrit', 'Kannada'], ['Shivatattva Ratnakara (Basappa Nayaka)'], ['Rameshwara temple at Keladi']),
  P('wodeyar-mysore', 20, 'The Odeyars of Mysore', 1399, 1761, 100254, ['Mysuru and Srirangapatna'], 'Claimed descent from Dwaraka', ['Raja Odeyar I', 'Ranadheera Kanteerava', 'Chikkadevaraja'], ['Kannada'], [], []),
  P('maratha-karnataka', 21, 'The Marathas', 1637, 1687, 107478, ['Raigad (Maharashtra)'], 'Maharashtra; Shahaji Bhosle was at Bangalore', ['Shivaji', 'Shahaji', 'Ekoji'], ['Marathi', 'Kannada'], [], []),
  P('chitradurga-nayaka', 23, 'The Nayakas of Chitradurga', 1568, 1799, 12645, ['Chitradurga'], 'Andhra Pradesh', ['Madakari Nayaka', 'Obbanna Nayaka'], ['Kannada', 'Telugu'], [], ['Chitradurga fort', 'Ranganatha temple at Hampanur']),
  P('mysore-sultanate', 24, 'The rule of Haidar Ali and Tipu Sultan', 1761, 1799, 267751, ['Srirangapatna'], 'Devanahalli (Bengaluru Rural district)', ['Haidar Ali', 'Tipu Sultan'], ['Persian', 'Urdu', 'Kannada'], [], ['Palace, fort and Darya Daulat at Srirangapatna', 'Lalbagh, Bengaluru']),
  P('kittur', 28, 'The Desais of Kittur', null, null, 2051, ['Kittur (Belagavi district)'], 'Kittur', ['Rani Chennamma', 'Sangolli Rayanna'], ['Kannada'], [], ['Fort at Kittur']),
  P('mysore-princely', 31, 'Again the Odeyars of Mysore', 1881, 1947, 77942, ['Mysuru'], '', ['Chamarajendra Odeyar', 'Krishnarajendra Odeyar IV', 'Jayachamaraja Odeyar'], ['Kannada', 'English'], [], []),
]

// What the atlas says about its own method, quoted in meaning for the assumptions panel.
export const CENSUS_ATLAS_METHOD = {
  en: 'The Census 2004 Historical Atlas of Karnataka itself marks each dynasty’s greatest extent only “approximately”, draws it from published literature rather than surveys, and notes that different parts of Karnataka were ruled by different dynasties at the same time.',
  kn: 'ಜನಗಣತಿ 2004ರ ಕರ್ನಾಟಕದ ಐತಿಹಾಸಿಕ ಭೂಪಟ ಸಂಗ್ರಹವೇ ಪ್ರತಿ ರಾಜವಂಶದ ಗರಿಷ್ಠ ವ್ಯಾಪ್ತಿಯನ್ನು “ಅಂದಾಜಾಗಿ” ಮಾತ್ರ ಗುರುತಿಸುತ್ತದೆ, ಸಮೀಕ್ಷೆಯಿಂದಲ್ಲ ಪ್ರಕಟಿತ ಸಾಹಿತ್ಯದಿಂದ ಬರೆಯುತ್ತದೆ, ಮತ್ತು ಒಂದೇ ಕಾಲದಲ್ಲಿ ಕರ್ನಾಟಕದ ಬೇರೆ ಬೇರೆ ಭಾಗಗಳನ್ನು ಬೇರೆ ಬೇರೆ ರಾಜವಂಶಗಳು ಆಳಿದ್ದವು ಎಂದು ಹೇಳುತ್ತದೆ.',
}
export const CENSUS_ATLAS_MAP_URL = 'https://archive.org/details/62_36931_2001_his'
