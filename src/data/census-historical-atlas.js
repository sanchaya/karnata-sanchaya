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
  P('mughal-deccan', 22, 'The Mughals in the Deccan', 1657, 1757, null, ['Aurangabad (Suba of Khujistabunyad); Sira, capital of the province formed in 1687'], '', ['Aurangzeb', 'Nizam-ul-Mulk Asaf Jah'], [], [], []),
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

// ---------------------------------------------------------------------------------------------------------------------------
// "The Antiquity of Karnataka", the article by Dr T. V. Venkatachala Shastri (translated by Dr K. Krishna Murthy) that the atlas reprints.
// Recorded as facts with the article's own citations; the Sanskrit phrases are short ancient quotations the article gives.
const ARTICLE = 'The Antiquity of Karnataka (T. V. Venkatachala Shastri, tr. K. Krishna Murthy), reprinted in the Census 2004 Historical Atlas of Karnataka, pp. 10-14'
const A = (id, from, to, kind, en, kn, detail, where) => ({ id, from, to, kind, title: { en, kn }, detail, where, citation: { sourceId: CENSUS_ATLAS_SOURCE_ID, locator: ARTICLE } })
export const NAME_ATTESTATIONS = [
  A('mahabharata-bhishmaparva', null, null, 'literary', 'Mahabharata, Bhishmaparva IX.59', 'ಮಹಾಭಾರತ, ಭೀಷ್ಮಪರ್ವ IX.59', 'The half-verse “Karnataka mahisaka vikalpa musakastatha” has the name, but the Poona critical edition shows it only as a variant reading in a footnote, so the article treats it as doubtful.', 'Sanskrit epic; date open'),
  A('mrichchhakatika', 400, 400, 'literary', 'Mrichchhakatika of Shudraka', 'ಶೂದ್ರಕನ ಮೃಚ್ಛಕಟಿಕ', 'Cited by the article as an early literary use of the name.', 'Sanskrit play, c. 400'),
  A('vishnudharmottara', 400, 500, 'literary', 'Vishnudharmottara Purana', 'ವಿಷ್ಣುಧರ್ಮೋತ್ತರ ಪುರಾಣ', 'Cited as an early literary use of the name.', 'Sanskrit, c. 400 to 500'),
  A('kadamba-santivarman', 450, 450, 'inscription', 'Inscription of the Kadamba king Santivarman', 'ಕದಂಬ ಶಾಂತಿವರ್ಮನ ಶಾಸನ', 'Called by the article perhaps the earliest inscriptional use: the phrase “Vaijayanti-tilaka-samasta-karnata-bhuvargabhartaram” (Epigraphia Carnatica VI.162), about 450.', 'Kadamba, Banavasi'),
  A('brihatsamhita', 550, 600, 'literary', 'Brihatsamhita of Varahamihira', 'ವರಾಹಮಿಹಿರನ ಬೃಹತ್ಸಂಹಿತೆ', 'Cited as an early literary use of the name.', 'Sanskrit, c. 6th century'),
  A('bhagavata-purana', 500, 600, 'literary', 'Bhagavata Purana', 'ಭಾಗವತ ಪುರಾಣ', 'Cited as an early literary use of the name.', 'Sanskrit, c. 6th century'),
  A('silappadikaram', 600, 600, 'literary', 'Silappadikaram', 'ಶಿಲಪ್ಪದಿಕಾರಂ', 'One of the older Tamil references to the name.', 'Tamil, c. 600'),
  A('ganga-bhuvikrama', 633, 633, 'copper-plate', 'Copper plate of the Ganga king Bhuvikrama', 'ಗಂಗ ಭೂವಿಕ್ರಮನ ತಾಮ್ರಶಾಸನ', 'Has “asya simah Karnataka pravaksyami” (Mysore Archaeological Report 1925).', 'Western Ganga, Talakad'),
  A('velvikudi', 770, 770, 'copper-plate', 'Velvikudi copper plate of the Pandya Sadaiyan Parantaka', 'ಪಾಂಡ್ಯ ಸಡೈಯನ್ ಪರಾಂತಕನ ವೇಳ್ವಿಕುಡಿ ತಾಮ್ರಶಾಸನ', 'The name appears in the Tamil form “Karunadagan”. Other Tamil inscriptions use Kannata, Kannataka and Kannadagarum.', 'Pandya, Tamil Nadu'),
  A('markandeya-purana', 700, 800, 'literary', 'Markandeya Purana', 'ಮಾರ್ಕಂಡೇಯ ಪುರಾಣ', 'Cited as a literary use of the name; it also uses the region name Kuntala.', 'Sanskrit, c. 8th century'),
  A('samangad-dantidurga', 753, 753, 'copper-plate', 'Samangad copper plate of the Rashtrakuta king Dantidurga', 'ರಾಷ್ಟ್ರಕೂಟ ದಂತಿದುರ್ಗನ ಸಾಮಂಗಡ ತಾಮ್ರಶಾಸನ', 'Has “Karnatakam balamacintyamajeyamanyaih”, the Karnataka army (Indian Antiquary XI, p. 111).', 'Rashtrakuta'),
  A('kuvalayamala', 779, 779, 'literary', 'Kuvalayamala-katha of Uddyotana Suri', 'ಉದ್ದ್ಯೋತನ ಸೂರಿಯ ಕುವಲಯಮಾಲಾ ಕಥಾ', 'A Prakrit work of 779 that uses the name.', 'Prakrit'),
  A('kavirajamarga', 850, 850, 'literary', 'Kavirajamarga', 'ಕವಿರಾಜಮಾರ್ಗ', 'Names the core places of the Kannada country: Kisuvolalu, Kopana-nagara, Puligere and Omkunda.', 'Kannada, c. 850'),
]

export const NAME_ETYMOLOGIES = [
  { id: 'black-soil', en: 'kar + nadu: a region of black soil', kn: 'ಕರ್ + ನಾಡು: ಕಪ್ಪು ಮಣ್ಣಿನ ನಾಡು', who: 'Gundert, Caldwell, R. Raghunatha Rao, L. D. Barnett, H. C. Raychaudhuri, B. M. Srikantaiah' },
  { id: 'big-land', en: 'karu + nadu: a big or extensive land', kn: 'ಕರು + ನಾಡು: ದೊಡ್ಡ ಅಥವಾ ವಿಸ್ತಾರ ನಾಡು', who: 'Govinda Pai, R. H. Deshpande, B. A. Saletore and others' },
  { id: 'high-land', en: 'karu = high: a mountainous table-land above the sea level', kn: 'ಕರು = ಎತ್ತರ: ಸಮುದ್ರಮಟ್ಟಕ್ಕಿಂತ ಎತ್ತರದ ಪರ್ವತ ಪ್ರಸ್ಥಭೂಮಿ', who: 'H. Narayana Rao' },
  { id: 'kanna-visaya', en: 'A small district called Kanna-visaya under the Satavahanas, in Andhra, as the source of the later name', kn: 'ಆಂಧ್ರದ ಶಾತವಾಹನರ ಕಾಲದ ಕನ್ನ-ವಿಷಯ ಎಂಬ ಸಣ್ಣ ಜಿಲ್ಲೆಯೇ ಮೂಲ', who: 'Venkataramanayya' },
  { id: 'article-view', en: 'The article’s own view: a region of the Chalukyas of Badami was first called Karnata, and Karnata is a Sanskritised form of Kannada (kar + nadu); the Sanskrit-grammar derivations of older works are rejected as fanciful', kn: 'ಲೇಖನದ ಅಭಿಪ್ರಾಯ: ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ಒಂದು ಪ್ರದೇಶಕ್ಕೆ ಮೊದಲು ಕರ್ಣಾಟ ಎಂದು ಹೆಸರಿದ್ದಿರಬಹುದು; ಕರ್ಣಾಟ ಕನ್ನಡದ ಸಂಸ್ಕೃತೀಕೃತ ರೂಪ', who: 'T. V. Venkatachala Shastri' },
]

export const EARLY_EXTENT = {
  core: { en: 'Records of the 5th to 9th century suggest the ancient province of Karnataka was the present North Kanara, Dharwad, Bijapur, Raichur and Gulbarga districts; its bounds later reached from the Kaveri to the Godavari.', kn: '5ರಿಂದ 9ನೇ ಶತಮಾನದ ದಾಖಲೆಗಳ ಪ್ರಕಾರ ಪ್ರಾಚೀನ ಕರ್ನಾಟಕ ಪ್ರಾಂತ್ಯ ಇಂದಿನ ಉತ್ತರ ಕನ್ನಡ, ಧಾರವಾಡ, ವಿಜಯಪುರ, ರಾಯಚೂರು ಮತ್ತು ಕಲಬುರಗಿ ಜಿಲ್ಲೆಗಳು; ನಂತರ ಅದರ ವ್ಯಾಪ್ತಿ ಕಾವೇರಿಯಿಂದ ಗೋದಾವರಿಯವರೆಗೆ ಹಬ್ಬಿತು.' },
  regionNames: [{ name: 'Kuntala', en: 'Mostly the Kannada-speaking country; included Kurugodu (Ballari), Gangavadi, Nargund, Torgal (Kolhapur), Terdal (Sangli) and Kubattur' }, { name: 'Vanavasi (Banavasi, Vaijayantipura)', en: 'The Banavasi region of North Kanara' }, { name: 'Mahisamandala', en: 'The Mysore region' }],
  kavirajamargaCore: ['Kisuvolalu', 'Kopana-nagara (Koppal)', 'Puligere', 'Omkunda'],
}

// ---------------------------------------------------------------------------------------------------------------------------
// Administrative history after the fall of Tipu Sultan, from the atlas's maps 22 to 34. Each snapshot carries its map number.
const S = (id, from, to, map, en, kn, facts, units = [], extra = {}) => ({ id, from, to, map, title: { en, kn }, facts, units, citation: { sourceId: CENSUS_ATLAS_SOURCE_ID, locator: `Map ${map} and its write-up` }, ...extra })
export const ADMIN_SNAPSHOTS = [
  S('mughal-deccan', 1657, 1757, 22, 'The Mughals in the Deccan', 'ದಖ್ಖನ್‌ನಲ್ಲಿ ಮೊಘಲರು', [
    'In 1657 Shah Jahan made his son Aurangzeb administrator of the Deccan. Aurangzeb took the forts of Kalyana and Bidar, then Bijapur, Golconda, Raichur, Bellary, Shimoga and Dharwad.',
    'In 1687 he formed a province with Sira as capital and seven paraganas: Basavapatna, Budihal, Sira, Penugonda, Dodballapur, Hoskote and Kolar.',
    'In the 18th century Nizam-ul-Mulk Asaf Jah organised the south into six subas.',
  ], [
    { name: 'Suba of Khujistabunyad (Aurangabad)', detail: '12 sarkars, 138 mahals' }, { name: 'Suba of Muhammadabad (Bidar, parts of Maharashtra and Andhra Pradesh)', detail: '7 sarkars, 76 paraganas' },
    { name: 'Suba of Khandesh (parts of Gujarat, Madhya Pradesh and Maharashtra)', detail: '4 sarkars, 134 paraganas' }, { name: 'Suba of Berar (parts of Madhya Pradesh and Maharashtra)', detail: '22 sarkars, 22 paraganas' },
    { name: 'Suba of Darul Zafar (Bijapur and parts of Maharashtra, Andhra Pradesh and Tamil Nadu)', detail: '18 sarkars, 281 paraganas' }, { name: 'Suba of Farkhundabunyad (Hyderabad, parts of Karnataka, Tamil Nadu and Orissa)', detail: '42 sarkars, 405 paraganas' },
  ]),
  S('after-tipu-1799', 1799, 1799, 25, 'After the fall of Tipu Sultan', 'ಟಿಪ್ಪು ಪತನದ ನಂತರ', [
    'His territory was partitioned. The Nizam received Ananthapur, Cuddapah and Kurnool; the British kept the coastal districts including Kanara and put Mummadi Krishnaraja Odeyar on the Mysore throne, with Divan Purnaiah governing.',
    'In 1803 Holalkere, Mayakonda and Harihar went to Mysore in exchange for parts of Punganur, Waynad and Yelusavirasime.',
    'Bidar, Gulbarga and Raichur went to the Nizam. Bijapur, Belgaum and Dharwad went to the Marathas and into the Bombay Presidency in 1818. Kanara and Bellary were in the Madras Presidency; North Kanara moved to Bombay in 1862. Coorg became a commissioner’s province in 1834.',
  ], [{ name: 'Mysore kingdom', detail: 'Shimoga, Davanagere, Chamarajanagar, Chikmagalur, Mandya, Mysore, Bangalore, Bangalore Rural, Kolar, Tumkur, Hassan, Chitradurga (as now named)' }, { name: 'Nizam’s dominions', detail: 'Raichur, Bidar, Gulbarga' }, { name: 'Bombay Presidency', detail: 'Bijapur, Belgaum, Dharwad; North Kanara from 1862' }, { name: 'Madras Presidency', detail: 'South Kanara, Bellary' }, { name: 'Coorg', detail: 'Commissioner’s province, directly under the British' }]),
  S('mysore-odeyars-1800', 1800, 1831, 26, 'Mysore under Krishnaraja Odeyar III', 'ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ III ಅವರ ಮೈಸೂರು', [
    'The capital moved from Srirangapatna to Mysuru. Divan Purnaiah served 1799 to 1811, then Rama Rao; Purnaiah received Yelandur as a jagir in 1807.',
    'The kingdom (about 77,942 sq km) was divided into faujdaris with 101 taluks.',
  ], [{ name: 'Bangalore and Madhugiri', detail: '27 taluks' }, { name: 'Chitaldrug', detail: '13 taluks' }, { name: 'Ashtagram', detail: '25 taluks' }, { name: 'Manjarabad', detail: '11 taluks' }, { name: 'Nagar', detail: '25 taluks' }]),
  S('british-mysore', 1831, 1881, 29, 'British Commission rule in Mysore', 'ಮೈಸೂರಿನಲ್ಲಿ ಬ್ರಿಟಿಷ್ ಕಮೀಷನರ್ ಆಡಳಿತ', [
    'From 1831 Mysore was under British Commissioners and the capital moved to Bangalore. Sir Mark Cubbon (1834 to 1861) divided it into four regions: Bangalore, Chitaldroog, Ashtagram and Nagar.',
    'A proclamation of 25 November 1840 set out eight districts with 85 taluks. Lewin Bowring (from 1861) organised three divisions and began municipal administration at Bangalore, Shimoga and Mysore.',
    'Chamarajendra Odeyar regained power on 25 March 1881.',
  ], [{ name: 'Bangalore', detail: '13 taluks' }, { name: 'Kolar', detail: '11 taluks' }, { name: 'Tumkur', detail: '9 taluks' }, { name: 'Mysore', detail: '13 taluks' }, { name: 'Hassan', detail: '11 taluks' }, { name: 'Shimoga', detail: '10 taluks' }, { name: 'Kadur', detail: '8 taluks' }, { name: 'Chitaldroog', detail: '10 taluks' }]),
  S('admin-1857', 1857, 1857, 30, 'The administrative divisions of 1857', '1857ರ ಆಡಳಿತ ವಿಭಾಗಗಳು', [
    'The British classed southern India as British territories, Hindu and other territories (princely Mysore, Southern Maratha and Satara jagirs, Travancore) and Muslim territories (the Nizam’s Hyderabad). Karnataka lay in four of these.',
  ], [{ name: 'Mysore state', detail: 'Nagar, Astagram, Chitaldroog, Bangalore' }, { name: 'Hyderabad, the Nizam’s dominions', detail: 'Bidar, Gulbarga' }, { name: 'Bombay and Madras Presidencies', detail: 'Coorg, South Kanara, North Kanara, Dharwar, Belgaum, Sholapur, Moodgal, Bellary, Raichur' }, { name: 'Southern Maratha and Satara jagirs', detail: 'Parts of Kolhapur, Miraj, Mudhol, Ramdurg, Jamkhandi' }]),
  S('mysore-restored', 1881, 1947, 31, 'Mysore restored to the Odeyars', 'ಒಡೆಯರಿಗೆ ಮೈಸೂರು ಮರಳಿದ್ದು', [
    'The Rendition of 25 March 1881 returned Mysore to Chamarajendra Odeyar, with Rangacharlu as Divan. The eight districts (69 taluks) became six districts with 60 taluks in 1882, and eight again with 66 taluks in 1886; three sub-divisions (Sagar, Closepet, Chikballapur) were added in 1891.',
    'Krishnaraja Odeyar IV was invested with full powers by Lord Curzon in 1902; Jayachamaraja Odeyar ruled 1940 to 1947. Responsible government began in October 1947, with the Maharaja as Rajpramukh until November 1956.',
    'The topographical survey of the state began in April 1886 at one inch to a mile; railways reached Mysuru (1882), Nanjangud and Kolar Gold Fields (1891) and Shimoga (1899).',
  ]),
  S('kannada-1912', 1912, 1912, 32, 'Twenty administrative units of the Kannada-speaking people, 1912', '1912ರಲ್ಲಿ ಕನ್ನಡಿಗರ ಇಪ್ಪತ್ತು ಆಡಳಿತ ಘಟಕಗಳು', [
    'As other provinces were formed on linguistic lines in 1912, the demand grew for one Kannada province. At the time the Kannada-speaking people lived in twenty administrative units.',
  ], [
    { name: 'Princely state of Mysore', detail: 'Bangalore, Mysore, Mandya, Kolar, Tumkur, Hassan, Kadur, Chitradurga, Shimoga' }, { name: 'Madras Presidency', detail: 'Nilgiris, Dakshina Kannada, Bellary; taluks of Kollegal, Krishnagiri, Hosur, Madakasira' },
    { name: 'Bombay Presidency', detail: 'Uttara Kannada, Belgaum, Dharwad, Bijapur; taluks near Solapur' }, { name: 'Coorg (Kodagu)', detail: '' }, { name: 'Hyderabad state', detail: 'Gulbarga, Bidar, Raichur' },
    { name: 'Kolhapur, Sangli, Miraj, Junior Miraj, Kurundwad senior and junior, Jamkhandi, Mudhol, Jat, Akkalkot, Aundh (Gunadal), Ramdurg, Sandur, Savanur', detail: 'Thirteen smaller states' }, { name: 'Cantonments of Bellary, Belgaum and Bangalore', detail: 'Under the British' },
  ]),
  S('reorganisation-1956', 1953, 1956, 33, 'Unification and reorganisation of Mysore state, 1956', '1956ರ ಮೈಸೂರು ರಾಜ್ಯ ಪುನರ್‌ರಚನೆ', [
    'Alur Venkatarao founded the Karnataka Ekikarana Sabha in 1916; the Karnataka Pradesh Congress Committee was created in 1921; the Belgaum Congress session and the first unification conference were in 1924 with Sir Siddappa Kambli presiding. In 1947 Karnataka was still under five administrations: Mysore, Kodagu, Hyderabad, Bombay and Madras.',
    'The States Reorganisation Commission was formed in 1953. Under the Andhra State Act 1953 Adoni and Alur taluks went to Kurnool and Rayadurga to Anantapur, and the rest of Bellary joined Mysore. In 1956 Bellary, Belgaum, Bidar, Bijapur, Kodagu, Dharwad, Gulbarga, Uttara Kannada, Raichur and Dakshina Kannada and Kollegal taluk joined; the new state had 19 districts.',
    'Taken away in 1956: Chandgad (Belgaum); Kasaragod and the Amindivi Islands (Dakshina Kannada); Tandur and Kodangal (Gulbarga); Alampur and Gadwal (Raichur); Narayankhed, Udgir, Nilanga, Ahmedapur, Zahirabad and Nyalkal circle (Bidar). Mysore district gained Kollegal from Coimbatore.',
  ]),
  S('new-districts', 1973, 1998, 34, 'Karnataka and its new districts, 1973 to 1998', '1973ರಿಂದ 1998ರ ವರೆಗೆ ಕರ್ನಾಟಕ ಮತ್ತು ಹೊಸ ಜಿಲ್ಲೆಗಳು', [
    'On 1 November 1973 the state of Mysore was renamed Karnataka, on a resolution moved by Chief Minister D. Devaraj Urs and passed unanimously.',
    'A new district, Bangalore Rural, was created on 21 July 1986 (Notification RD 35 LRD 86), leaving Bangalore with three taluks (Anekal, Bangalore North, Bangalore South); districts rose from 19 to 20.',
    'On 2 August 1997 (Notification RD 42 LRD 87 Part III) seven more were created, making 27; 28 villages of Karkal taluk moved to Mangalore taluk on 25 March 1998.',
  ], [{ name: 'Chamarajanagar', detail: 'from Mysore' }, { name: 'Davanagere', detail: 'from Chitradurga, Bellary and Shimoga' }, { name: 'Bagalkot', detail: 'from Bijapur' }, { name: 'Gadag and Haveri', detail: 'from Dharwad' }, { name: 'Udupi', detail: 'from Dakshina Kannada' }, { name: 'Koppal', detail: 'from Raichur' }]),
]

// The uprisings the atlas maps in map 27, 1800 to 1858.
const U = (year, who, where, en) => ({ year, who, where, en })
export const UPRISINGS = [
  U('1800', 'Dhondiya Wagh', 'Bidanur, Shikarpur; Jamalabad, Sonda, Savanur, Ranebennur, Hangal, Dambal, Munoli, Harapanahalli', 'Rose in June 1800 in the Malenadu after serving in several armies, and captured forts and towns across Karnataka.'),
  U('1800s', 'Zamindar Virappa', 'Koppal and Bahadur Banda', 'Took the forts of Koppal and Bahadur Banda and the country around.'),
  U('1820', 'Shivalingayya Deshmukh', 'Suliyally (Bidar)', 'Revolted against the Nizam, who was supporting the British.'),
  U('1820s', 'Diwakar Dikshit, Ravji Raste, Balaji Deshpande, Settyappa Tukkalli', 'Sindgi (Bijapur)', 'A revolt against the British.'),
  U('1824', 'Rani Chennamma', 'Kittur (Belagavi)', 'Fought the British over the adoption of Shivalingappa, killed the collector Thackeray, and was taken captive after Chaplin’s siege in December 1824; she died in prison at Bailhongal in 1829.'),
  U('1829–1831', 'Sangolli Rayanna', 'Kittur, Nandgad', 'Rose for the Kittur family from 1829 and was hanged at Nandgad in 1831.'),
  U('1830–1833', 'Budibasappa', 'Nagar (Shivamogga); Honnali, Kalladurga, Kamanadurga, Chandragutti', 'A rising against Mysore rule that took forts in the region in 1833.'),
  U('1835–1837', 'Swamy Aparampara and Kalyanaswamy', 'Kodagu; Bellare, Sullya, Puttur, Bantval, Mangalore', 'The Kodagu uprising, which spread into Dakshina Kannada.'),
  U('1841', 'Narasappa Petkar', 'Badami', 'Led a revolt while serving the Nayaka of Surapur.'),
  U('1852', 'Lingappa', 'Bidar', 'Revolted against the Nizam and the British.'),
  U('1857–1858', 'Venkatappa Nayaka of Surapur, Bhaskarrao Bhave of Nargund, Bedas of Halagali, Mundargi Bhimarao and the Desais of Hammige, Dambal, Soratur and Govanakoppa', 'Surapur, Nargund, Halagali (Mudhol), Dharwad district', 'Rebelled against the British in 1857 and 1858.'),
]
