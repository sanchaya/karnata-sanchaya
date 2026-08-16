const name = (en, kn) => ({ en, kn })
const citation = (locator) => ({ sourceId: 'src-bengaluru-freedom-fighters-display-photo', locator })
const review = { status: 'needs-review', reviewer: null, updatedAt: '2026-08-16' }

export const bengaluruFreedomFighterDisplaySource = {
  id: 'src-bengaluru-freedom-fighters-display-photo',
  type: 'contributor-supplied-photograph',
  title: name('“Freedom Fighters of Bangalore” photographed display', '“ಫ್ರೀಡಂ ಫೈಟರ್ಸ್ ಆಫ್ ಬೆಂಗಳೂರು” ಛಾಯಾಚಿತ್ರಿತ ಪ್ರದರ್ಶನ'),
  authors: ['Unknown display compiler', 'Project contributor (photograph)'],
  year: null,
  url: '',
  scope: name(
    'A contributor-supplied photograph of a display headed “Freedom Fighters of Bangalore”. The display transcribes 119 entries (117 unique names) but does not identify its compiler, venue, date or underlying register. It is used only as a discovery and memorial-listing source; every identity, spelling, life date and Bengaluru association requires independent archival verification.',
    '“ಫ್ರೀಡಂ ಫೈಟರ್ಸ್ ಆಫ್ ಬೆಂಗಳೂರು” ಎಂಬ ಶೀರ್ಷಿಕೆಯ ಪ್ರದರ್ಶನದ ಕೊಡುಗೆದಾರರು ಒದಗಿಸಿದ ಛಾಯಾಚಿತ್ರ. ಪ್ರದರ್ಶನದಲ್ಲಿ 119 ನಮೂದುಗಳು (117 ವಿಶಿಷ್ಟ ಹೆಸರುಗಳು) ಇವೆ; ಆದರೆ ಸಂಕಲನಕಾರ, ಸ್ಥಳ, ದಿನಾಂಕ ಅಥವಾ ಮೂಲ ನೋಂದಣಿಯನ್ನು ಸೂಚಿಸಿಲ್ಲ. ಇದನ್ನು ಅನ್ವೇಷಣೆ ಮತ್ತು ಸ್ಮಾರಕ-ಪಟ್ಟಿ ಆಕರವಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗಿದೆ; ಪ್ರತಿಯೊಂದು ಗುರುತು, ಕಾಗುಣಿತ, ಜೀವನ ದಿನಾಂಕ ಮತ್ತು ಬೆಂಗಳೂರು ಸಂಬಂಧಕ್ಕೆ ಸ್ವತಂತ್ರ ಆರ್ಕೈವ್ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'
  ),
  evidence: {
    originalFileName: 'IMG_7670.jpg',
    suppliedAt: '2026-08-16',
    transcriptionMethod: 'Manual reading from the contributor-supplied photograph; ambiguous spellings retained as printed.',
    issuer: 'unresolved',
    venue: 'unresolved',
    photographedAt: 'unresolved',
  },
  review,
}

export const bengaluruFreedomFighterResearchSources = [
  {
    id:'src-india-culture-dictionary-martyrs-v5', type:'government-reference-book',
    title:name('Dictionary of Martyrs: India’s Freedom Struggle, Volume 5','ಹುತಾತ್ಮರ ನಿಘಂಟು: ಭಾರತದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟ, ಸಂಪುಟ 5'),
    authors:['Indian Council of Historical Research','Ministry of Culture, Government of India'], year:2018,
    url:'https://www.indiaculture.gov.in/sites/default/files/pdf/Martyrs_Vol_5_06_03_2019.pdf',
    publisher:'Ministry of Culture, Government of India and Indian Council of Historical Research',
    isbn:'978-81-938176-1-2',
    archiveIdentifier:'dictionary-of-martyrs-of-indias-freedom-struggle-5-vols',
    alternateUrls:[
      'https://archive.org/details/dictionary-of-martyrs-of-indias-freedom-struggle-5-vols/Volume%205%20Andhra%20Pradesh%2C%20Telangana%2C%20Karnataka%2C%20Tamil%20Nadu%20and%20Kerala%201857-1947/',
      'https://archive.org/download/dictionary-of-martyrs-of-indias-freedom-struggle-5-vols/Volume%205%20Andhra%20Pradesh%2C%20Telangana%2C%20Karnataka%2C%20Tamil%20Nadu%20and%20Kerala%201857-1947_djvu.txt',
    ],
    scope:name('Government reference entries for martyrs from Andhra Pradesh, Telangana, Karnataka, Tamil Nadu and Kerala. Person-level locators are retained and should still be checked against the archival references cited by the dictionary.','ಆಂಧ್ರ ಪ್ರದೇಶ, ತೆಲಂಗಾಣ, ಕರ್ನಾಟಕ, ತಮಿಳುನಾಡು ಮತ್ತು ಕೇರಳದ ಹುತಾತ್ಮರ ಸರ್ಕಾರಿ ಉಲ್ಲೇಖ ಕೃತಿ. ವ್ಯಕ್ತಿ-ಮಟ್ಟದ ಸ್ಥಾನಸೂಚಿಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ; ನಿಘಂಟು ನೀಡಿದ ಆರ್ಕೈವ್ ಉಲ್ಲೇಖಗಳೊಂದಿಗೆ ಇನ್ನೂ ಪರಿಶೀಲಿಸಬೇಕು.'),
    review:{...review},
  },
  {
    id:'src-amrit-kc-reddy', type:'government-biography',
    title:name('K. C. Reddy — Digital District Repository','ಕೆ. ಸಿ. ರೆಡ್ಡಿ — ಡಿಜಿಟಲ್ ಜಿಲ್ಲಾ ಸಂಗ್ರಹ'),
    authors:['Ministry of Culture, Government of India'], year:2022,
    url:'https://cmsadmin.amritmahotsav.nic.in/district-reopsitory-detail.htm?9799=',
    scope:name('Biographical account of Kyasamballi Chengalaraya Reddy, his Mysore Congress work, responsible-government politics and service as the first Chief Minister of Mysore State.','ಕ್ಯಾಸಂಬಳ್ಳಿ ಚೆಂಗಲರಾಯ ರೆಡ್ಡಿಯ ಜೀವನ, ಮೈಸೂರು ಕಾಂಗ್ರೆಸ್ ಕಾರ್ಯ, ಜವಾಬ್ದಾರಿ ಸರ್ಕಾರದ ರಾಜಕೀಯ ಮತ್ತು ಮೈಸೂರು ರಾಜ್ಯದ ಮೊದಲ ಮುಖ್ಯಮಂತ್ರಿಯಾಗಿ ಸಲ್ಲಿಸಿದ ಸೇವೆಯ ಜೀವನಚರಿತ್ರೆ.'),
    review:{...review},
  },
  {
    id:'src-constitution-india-kengal-hanumanthaiah', type:'constitutional-biography',
    title:name('Kengal Hanumanthaiah — Constitution of India member biography','ಕೆಂಗಲ್ ಹನುಮಂತಯ್ಯ — ಭಾರತದ ಸಂವಿಧಾನ ಸದಸ್ಯರ ಜೀವನಚರಿತ್ರೆ'),
    authors:['Centre for Law and Policy Research'], year:null,
    url:'https://www.constitutionofindia.net/members/kengal-hanumanthaiah/',
    scope:name('Constituent Assembly biography with references to Karnataka Legislature and Karnataka Information Department biographies.','ಕರ್ನಾಟಕ ವಿಧಾನಮಂಡಲ ಮತ್ತು ಕರ್ನಾಟಕ ವಾರ್ತಾ ಇಲಾಖೆಯ ಜೀವನಚರಿತ್ರೆಗಳನ್ನು ಉಲ್ಲೇಖಿಸುವ ಸಂವಿಧಾನ ಸಭಾ ಸದಸ್ಯರ ಪರಿಚಯ.'),
    review:{...review},
  },
  {
    id:'src-tni-h-sreenivasaiah-2017', type:'news-obituary',
    title:name('Sreenivasaiah, Gandhian and freedom fighter, dies at 92','ಗಾಂಧಿವಾದಿ ಮತ್ತು ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರ ಶ್ರೀನಿವಾಸಯ್ಯ ನಿಧನ'),
    authors:['The New Indian Express'], year:2017,
    url:'https://www.newindianexpress.com/bengaluru/2017/Apr/07/sreenivasaiah-gandhian--freedom-fighter-dies-at-92-1590897.html',
    scope:name('Family-attributed obituary recording participation in the freedom movement, imprisonment in 1942 and 1947, underground publications and later journalism and social service.','ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿಯ ಭಾಗವಹಿಸುವಿಕೆ, 1942 ಮತ್ತು 1947ರ ಕಾರಾಗೃಹವಾಸ, ಭೂಗತ ಪ್ರಕಟಣೆಗಳು ಹಾಗೂ ನಂತರದ ಪತ್ರಿಕೋದ್ಯಮ ಮತ್ತು ಸಮಾಜಸೇವೆಯನ್ನು ಕುಟುಂಬದ ಹೇಳಿಕೆಯೊಂದಿಗೆ ದಾಖಲಿಸುವ ಶ್ರದ್ಧಾಂಜಲಿ.'),
    review:{...review},
  },
  {
    id:'src-toi-vs-krishna-iyer-2011', type:'news-obituary',
    title:name('V. S. Krishna Iyer passes away at 90','ವಿ. ಎಸ್. ಕೃಷ್ಣ ಅಯ್ಯರ್ ನಿಧನ'),
    authors:['The Times of India'], year:2011,
    url:'https://timesofindia.indiatimes.com/city/bengaluru/v-s-krishna-iyer-passes-way-at-90/articleshow/9366285.cms',
    scope:name('Obituary identifying Krishna Iyer as a veteran freedom fighter, Bengaluru mayor, minister and Member of Parliament.','ಕೃಷ್ಣ ಅಯ್ಯರ್ ಅವರನ್ನು ಹಿರಿಯ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರ, ಬೆಂಗಳೂರು ಮೇಯರ್, ಸಚಿವ ಮತ್ತು ಸಂಸದರೆಂದು ಗುರುತಿಸುವ ಶ್ರದ್ಧಾಂಜಲಿ.'),
    review:{...review},
  },
  {
    id:'src-indian-express-bengaluru-freedom-memory-2024', type:'news-history',
    title:name('Where to find memories of India’s freedom struggle in Bengaluru','ಬೆಂಗಳೂರಿನಲ್ಲಿ ಭಾರತದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದ ನೆನಪುಗಳ ತಾಣಗಳು'),
    authors:['The Indian Express','Suresh Moona'], year:2024,
    url:'https://indianexpress.com/article/cities/bangalore/know-your-city-memories-india-freedom-struggle-bengaluru-9583753/',
    scope:name('Public-history account of Bengaluru protest sites and memorials, including Gundappa and Prahlad Shetty. Use as a discovery/corroboration source pending memorial inscriptions and gazetteer locators.','ಗುಂಡಪ್ಪ ಮತ್ತು ಪ್ರಹ್ಲಾದ ಶೆಟ್ಟಿ ಸೇರಿದಂತೆ ಬೆಂಗಳೂರು ಪ್ರತಿಭಟನಾ ತಾಣಗಳು ಮತ್ತು ಸ್ಮಾರಕಗಳ ಸಾರ್ವಜನಿಕ ಇತಿಹಾಸ. ಸ್ಮಾರಕ ಶಾಸನ ಮತ್ತು ಗೆಜೆಟಿಯರ್ ಸ್ಥಾನಸೂಚಿ ಸಿಗುವವರೆಗೆ ಅನ್ವೇಷಣೆ/ಪೂರಕ ಆಕರವಾಗಿ ಬಳಸಿ.'),
    review:{...review},
  },
  {
    id:'src-bangalore-first-bengaluru-1942-martyrs', type:'news-archive',
    title:name('Bengaluru 1942 police-firing martyrs — Karnataka Gazetteer summary','ಬೆಂಗಳೂರು 1942 ಪೊಲೀಸ್ ಗುಂಡಿನ ದಾಳಿಯ ಹುತಾತ್ಮರು — ಕರ್ನಾಟಕ ಗೆಜೆಟಿಯರ್ ಸಾರಾಂಶ'),
    authors:['Deccan Herald archive','Bangalore First'], year:2014,
    url:'https://www.bangalorefirst.in/?m=201408',
    scope:name('Secondary account explicitly attributing ten 1942 deaths to the Karnataka State Gazetteer and naming Thippaiah, Appaiah, Srinivasan, Narayanachar/Narayana Das, Subbasing Ramasingh, Ponnuswamy and Thimmanna Das. Printed gazetteer pages remain required.','1942ರ ಹತ್ತು ಸಾವುಗಳನ್ನು ಕರ್ನಾಟಕ ರಾಜ್ಯ ಗೆಜೆಟಿಯರ್‌ಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಸೇರಿಸಿ ತಿಪ್ಪಯ್ಯ, ಅಪ್ಪಯ್ಯ, ಶ್ರೀನಿವಾಸನ್, ನಾರಾಯಣಾಚಾರ್/ನಾರಾಯಣ ದಾಸ್, ಸುಬ್ಬಸಿಂಗ್ ರಾಮಸಿಂಗ್, ಪೊನ್ನುಸ್ವಾಮಿ ಮತ್ತು ತಿಮ್ಮಣ್ಣ ದಾಸ್ ಹೆಸರುಗಳನ್ನು ನೀಡುವ ದ್ವಿತೀಯ ಆಕರ. ಮುದ್ರಿತ ಗೆಜೆಟಿಯರ್ ಪುಟಗಳು ಇನ್ನೂ ಅಗತ್ಯ.'),
    review:{...review},
  },
  {
    id:'src-bangalore-first-mysore-bank-martyrs', type:'memorial-news-report',
    title:name('Mysore Bank Circle freedom-martyrs memorial','ಮೈಸೂರು ಬ್ಯಾಂಕ್ ವೃತ್ತದ ಸ್ವಾತಂತ್ರ್ಯ ಹುತಾತ್ಮರ ಸ್ಮಾರಕ'),
    authors:['The Times of India archive','Bangalore First','S. K. Aruni','H. S. Doreswamy'], year:2014,
    url:'https://www.bangalorefirst.in/?p=12669',
    scope:name('Report describing the memorial plaque, naming its four commemorated people and recording historian and participant testimony about the 16–18 August 1942 police actions. The plaque and archival police/prison files remain the preferred item-level evidence.','ಸ್ಮಾರಕ ಫಲಕ, ಅದರಲ್ಲಿ ಸ್ಮರಿಸಿದ ನಾಲ್ವರು ಮತ್ತು 16–18 ಆಗಸ್ಟ್ 1942ರ ಪೊಲೀಸ್ ಕ್ರಮಗಳ ಕುರಿತು ಇತಿಹಾಸಕಾರ ಹಾಗೂ ಭಾಗವಹಿಸಿದವರ ಸಾಕ್ಷ್ಯವನ್ನು ದಾಖಲಿಸುವ ವರದಿ. ಫಲಕ ಮತ್ತು ಆರ್ಕೈವ್ ಪೊಲೀಸ್/ಕಾರಾಗೃಹ ಕಡತಗಳು ಆದ್ಯತೆಯ ವಸ್ತು-ಮಟ್ಟದ ಸಾಕ್ಷ್ಯವಾಗಿವೆ.'),
    review:{...review},
  },
]

const entry = (slug, en, kn, position, options = {}) => ({ slug, name: name(en, kn), position, ...options })

// Row and column locators follow the photographed display from top-left to bottom-right.
// Repeated printed entries are retained as multiple positions on one unique person lead.
export const bengaluruFreedomFighterDisplayEntries = [
  entry('vs-narayan-rao','V. S. Narayan Rao','ವಿ. ಎಸ್. ನಾರಾಯಣ ರಾವ್',['r1c1']),
  entry('yashodhara-dasappa','Yashodhara Dasappa','ಯಶೋಧರ ದಾಸಪ್ಪ',['r1c2']),
  entry('nittoor-srinivasa-rao','Nittoor Srinivasa Rao','ನಿಟ್ಟೂರು ಶ್ರೀನಿವಾಸ ರಾವ್',['r1c3']),
  entry('hc-dasappa','H. C. Dasappa','ಹೆಚ್. ಸಿ. ದಾಸಪ್ಪ',['r1c4']),
  entry('hs-doreswamy','Dr. H. S. Doreswamy','ಡಾ. ಹೆಚ್. ಎಸ್. ದೊರೆಸ್ವಾಮಿ',['r1c5']),
  entry('kt-bhashyam','K. T. Bhashyam','ಕೆ. ಟಿ. ಭಾಷ್ಯಂ',['r1c6']),
  entry('hosur-narasimhaiah','Hosur Narasimhaiah','ಹೊಸೂರು ನರಸಿಂಹಯ್ಯ',['r2c1']),
  entry('srimushnam-srinivasa-murthy','Srimushnam Srinivasa Murthy','ಶ್ರೀಮುಷ್ಣಂ ಶ್ರೀನಿವಾಸ ಮೂರ್ತಿ',['r2c2']),
  entry('pm-rama-sharma','P. M. Rama Sharma','ಪಿ. ಎಂ. ರಾಮ ಶರ್ಮ',['r2c3']),
  entry('k-shamanna','K. Shamanna','ಕೆ. ಶಾಮಣ್ಣ',['r2c4']),
  entry('av-ramachha-rao','A. V. Ramachha Rao','ಎ. ವಿ. ರಾಮಚ್ಛ ರಾವ್',['r2c5'],{ transcriptionNote:'The surname/element “Ramachha” is retained exactly as it appears in the photograph; identity and spelling need review.' }),
  entry('tr-shamanna','T. R. Shamanna','ಟಿ. ಆರ್. ಶಾಮಣ್ಣ',['r3c1']),
  entry('ibrahim-khan','Ibrahim Khan','ಇಬ್ರಾಹಿಂ ಖಾನ್',['r3c2']),
  entry('kv-vasanth','K. V. Vasanth','ಕೆ. ವಿ. ವಸಂತ್',['r3c3']),
  entry('tt-sharma','T. T. Sharma','ಟಿ. ಟಿ. ಶರ್ಮ',['r3c4']),
  entry('pr-ramaiya','P. R. Ramaiya','ಪಿ. ಆರ್. ರಾಮಯ್ಯ',['r3c5']),
  entry('ahobal-keshav','Ahobal Keshav','ಅಹೋಬಲ ಕೇಶವ',['r3c6']),
  entry('v-venkatappa','V. Venkatappa','ವಿ. ವೆಂಕಟಪ್ಪ',['r3c7']),
  entry('vs-sanjeeva-rao','V. S. Sanjeeva Rao','ವಿ. ಎಸ್. ಸಂಜೀವ ರಾವ್',['r4c1']),
  entry('hs-seetharam','H. S. Seetharam','ಹೆಚ್. ಎಸ್. ಸೀತಾರಾಮ್',['r4c2']),
  entry('kengal-hanumanthiah','Kengal Hanumanthiah','ಕೆಂಗಲ್ ಹನುಮಂತಯ್ಯ',['r4c3']),
  entry('belur-srinivasa-iyengar','Belur Srinivasa Iyengar','ಬೇಲೂರು ಶ್ರೀನಿವಾಸ ಅಯ್ಯಂಗಾರ್',['r4c4']),
  entry('s-nijalingappa','S. Nijalingappa','ಎಸ್. ನಿಜಲಿಂಗಪ್ಪ',['r4c5']),
  entry('vs-krishna-iyer','V. S. Krishna Iyer','ವಿ. ಎಸ್. ಕೃಷ್ಣ ಅಯ್ಯರ್',['r4c6']),
  entry('thippiah','Thippiah','ತಿಪ್ಪಯ್ಯ',['r5c1']),
  entry('parthasarayana-pandith','Dr. Parthasarayana Pandith','ಡಾ. ಪಾರ್ಥಸಾರಾಯಣ ಪಂಡಿತ್',['r5c2']),
  entry('kc-reddy','K. C. Reddy','ಕೆ. ಸಿ. ರೆಡ್ಡಿ',['r5c3']),
  entry('snm-razvi','S. N. M. Razvi','ಎಸ್. ಎನ್. ಎಂ. ರಜ್ವಿ',['r5c4']),
  entry('t-sunandamma','T. Sunandamma','ಟಿ. ಸುನಂದಮ್ಮ',['r5c5']),
  entry('srs-raghavan','S. R. S. Raghavan','ಎಸ್. ಆರ್. ಎಸ್. ರಾಘವನ್',['r5c6']),
  entry('s-venkatapathaiah','S. Venkatapathaiah','ಎಸ್. ವೆಂಕಟಪತಯ್ಯ',['r6c1']),
  entry('v-varadarajulu','V. Varadarajulu','ವಿ. ವರದರಾಜುಲು',['r6c2']),
  entry('bnm-palanivelswamy','B. N. M. Palanivelswamy','ಬಿ. ಎನ್. ಎಂ. ಪಳನಿವೇಲಸ್ವಾಮಿ',['r6c3']),
  entry('p-muragesha-pillay','P. Muragesha Pillay','ಪಿ. ಮುರುಗೇಶ ಪಿಳ್ಳೈ',['r6c4']),
  entry('narayanaswamy-pillay','Narayanaswamy Pillay','ನಾರಾಯಣಸ್ವಾಮಿ ಪಿಳ್ಳೈ',['r6c5']),
  entry('h-sreenivasaiah','H. Sreenivasaiah','ಹೆಚ್. ಶ್ರೀನಿವಾಸಯ್ಯ',['r7c1']),
  entry('nd-shankar','N. D. Shankar','ಎನ್. ಡಿ. ಶಂಕರ್',['r7c2']),
  entry('tm-jagannathan-pillay','T. M. Jagannathan Pillay','ಟಿ. ಎಂ. ಜಗನ್ನಾಥನ್ ಪಿಳ್ಳೈ',['r7c3']),
  entry('v-venkateshaiah','V. Venkateshaiah','ವಿ. ವೆಂಕಟೇಶಯ್ಯ',['r7c4']),
  entry('masilamani-achary','Masilamani Achary','ಮಾಸಿಲಾಮಣಿ ಆಚಾರಿ',['r7c5']),
  entry('h-battan-lal','H. Battan Lal','ಹೆಚ್. ಬಟ್ಟನ್ ಲಾಲ್',['r7c6']),
  entry('kk-krishnaswamy','K. K. Krishnaswamy','ಕೆ. ಕೆ. ಕೃಷ್ಣಸ್ವಾಮಿ',['r8c1']),
  entry('y-ramiah','Y. Ramiah','ವೈ. ರಾಮಯ್ಯ',['r8c2']),
  entry('m-mailvelo','M. Mailvelo','ಎಂ. ಮೈಲ್ವೆಲೊ',['r8c3'],{ transcriptionNote:'The element “Mailvelo” is retained exactly as printed; spelling needs review.' }),
  entry('j-bhima-rao','J. Bhima Rao','ಜೆ. ಭೀಮ ರಾವ್',['r8c4']),
  entry('t-rajagopal','T. Rajagopal','ಟಿ. ರಾಜಗೋಪಾಲ್',['r8c5']),
  entry('munigowdappa','Munigowdappa','ಮುನಿಗೌಡಪ್ಪ',['r8c6']),
  entry('n-gundappa','N. Gundappa','ಎನ್. ಗುಂಡಪ್ಪ',['r8c7']),
  entry('p-sunder-raj','P. Sunder Raj','ಪಿ. ಸುಂದರ್ ರಾಜ್',['r9c1']),
  entry('g-swaminatha-achary','G. Swaminatha Achary','ಜಿ. ಸ್ವಾಮಿನಾಥ ಆಚಾರಿ',['r9c2']),
  entry('m-krishnaswamy','M. Krishnaswamy','ಎಂ. ಕೃಷ್ಣಸ್ವಾಮಿ',['r9c3']),
  entry('a-rajagopal','A. Rajagopal','ಎ. ರಾಜಗೋಪಾಲ್',['r9c4']),
  entry('sg-shrikanth','S. G. Shrikanth','ಎಸ್. ಜಿ. ಶ್ರೀಕಾಂತ್',['r9c5']),
  entry('v-maniswamy-gounder','V. Maniswamy Gounder','ವಿ. ಮಣಿಸ್ವಾಮಿ ಗೌಂಡರ್',['r10c1']),
  entry('kc-venkatadri','K. C. Venkatadri','ಕೆ. ಸಿ. ವೆಂಕಟಾದ್ರಿ',['r10c2']),
  entry('l-ganapathi-chettiyar','L. Ganapathi Chettiyar','ಎಲ್. ಗಣಪತಿ ಚೆಟ್ಟಿಯಾರ್',['r10c3']),
  entry('narayanaswamy','Narayanaswamy','ನಾರಾಯಣಸ್ವಾಮಿ',['r10c4','r11c4']),
  entry('muthu','Muthu','ಮುತ್ತು',['r10c5']),
  entry('arsappa-chettiyar','Arsappa Chettiyar','ಅರಸಪ್ಪ ಚೆಟ್ಟಿಯಾರ್',['r10c6']),
  entry('s-ganapathy','S. Ganapathy','ಎಸ್. ಗಣಪತಿ',['r11c1']),
  entry('mahadevi-tai','Mahadevi Tai','ಮಹಾದೇವಿ ತಾಯಿ',['r11c2']),
  entry('muthu-naidu','Muthu Naidu','ಮುತ್ತು ನಾಯ್ಡು',['r11c3']),
  entry('subbukrishnan','Subbukrishnan','ಸುಬ್ಬುಕೃಷ್ಣನ್',['r11c5']),
  entry('doraiswamy-chetti','Doraiswamy Chetti','ದೊರೆಸ್ವಾಮಿ ಚೆಟ್ಟಿ',['r11c6']),
  entry('b-kamakshamma','B. Kamakshamma','ಬಿ. ಕಾಮಾಕ್ಷಮ್ಮ',['r11c7'],{ gender:'woman' }),
  entry('mr-sheshadri','M. R. Sheshadri','ಎಂ. ಆರ್. ಶೇಷಾದ್ರಿ',['r12c1']),
  entry('dr-sugavaneswaran','D. R. Sugavaneswaran','ಡಿ. ಆರ್. ಸುಗವನೇಶ್ವರನ್',['r12c2','r12c5']),
  entry('chayapathi-naidu','Chayapathi Naidu','ಚಾಯಪತಿ ನಾಯ್ಡು',['r12c3']),
  entry('a-armugam','A. Armugam','ಎ. ಆರುಮುಗಂ',['r12c4']),
  entry('av-govindaraj-mudaliar','A. V. Govindaraj Mudaliar','ಎ. ವಿ. ಗೋವಿಂದರಾಜ್ ಮುದಲಿಯಾರ್',['r12c6']),
  entry('jm-kuppuswamy-mudaliar','J. M. Kuppuswamy Mudaliar','ಜೆ. ಎಂ. ಕುಪ್ಪುಸ್ವಾಮಿ ಮುದಲಿಯಾರ್',['r13c1']),
  entry('kothaval-muniswamy-naidu','Kothaval Muniswamy Naidu','ಕೊತ್ತವಾಲ್ ಮುನಿಸ್ವಾಮಿ ನಾಯ್ಡು',['r13c2']),
  entry('vellore-shanmugam','Vellore Shanmugam','ವೆಲ್ಲೂರು ಷಣ್ಮುಗಂ',['r13c3']),
  entry('k-krishnappa','K. Krishnappa','ಕೆ. ಕೃಷ್ಣಪ್ಪ',['r13c4']),
  entry('am-kuppuswamy-mudaliar','A. M. Kuppuswamy Mudaliar','ಎ. ಎಂ. ಕುಪ್ಪುಸ್ವಾಮಿ ಮುದಲಿಯಾರ್',['r13c5']),
  entry('tc-raj','T. C. Raj','ಟಿ. ಸಿ. ರಾಜ್',['r14c1']),
  entry('p-ramakrishna','P. Ramakrishna','ಪಿ. ರಾಮಕೃಷ್ಣ',['r14c2']),
  entry('c-chandriah-setty','C. Chandriah Setty','ಸಿ. ಚಂದ್ರಯ್ಯ ಶೆಟ್ಟಿ',['r14c3']),
  entry('b-kutti-achary','B. Kutti Achary','ಬಿ. ಕುಟ್ಟಿ ಆಚಾರಿ',['r14c4']),
  entry('kutti-chetti','Kutti Chetti','ಕುಟ್ಟಿ ಚೆಟ್ಟಿ',['r14c5']),
  entry('r-narayanaswamy','R. Narayanaswamy','ಆರ್. ನಾರಾಯಣಸ್ವಾಮಿ',['r14c6']),
  entry('m-govindaraj-setty','M. Govindaraj Setty','ಎಂ. ಗೋವಿಂದರಾಜ್ ಶೆಟ್ಟಿ',['r14c7']),
  entry('c-kuppuswamy-mudaliar','C. Kuppuswamy Mudaliar','ಸಿ. ಕುಪ್ಪುಸ್ವಾಮಿ ಮುದಲಿಯಾರ್',['r15c1']),
  entry('viswantha-setty','Viswantha Setty','ವಿಶ್ವನಾಥ ಶೆಟ್ಟಿ',['r15c2']),
  entry('narayana-rao','Narayana Rao','ನಾರಾಯಣ ರಾವ್',['r15c3']),
  entry('bs-ramaswamy-iyengar','B. S. Ramaswamy Iyengar','ಬಿ. ಎಸ್. ರಾಮಸ್ವಾಮಿ ಅಯ್ಯಂಗಾರ್',['r15c4']),
  entry('ks-sanjiva-rao','K. S. Sanjiva Rao','ಕೆ. ಎಸ್. ಸಂಜೀವ ರಾವ್',['r15c5']),
  entry('sk-venkataranga-iyengar','S. K. Venkataranga Iyengar','ಎಸ್. ಕೆ. ವೆಂಕಟರಂಗ ಅಯ್ಯಂಗಾರ್',['r15c6']),
  entry('veeragowda-vakkulinga','Veeragowda Vakkulinga','ವೀರೇಗೌಡ ಒಕ್ಕಲಿಗ',['r16c1']),
  entry('pamadi-subbarama-shetti','Pamadi Subbarama Shetti','ಪಾಮಾಡಿ ಸುಬ್ಬರಾಮ ಶೆಟ್ಟಿ',['r16c2']),
  entry('hs-ganeshrao','H. S. Ganeshrao','ಹೆಚ್. ಎಸ್. ಗಣೇಶ್ ರಾವ್',['r16c3']),
  entry('hv-subramanyam','H. V. Subramanyam','ಹೆಚ್. ವಿ. ಸುಬ್ರಹ್ಮಣ್ಯಂ',['r16c4']),
  entry('hanif-advocate','Hanif','ಹನೀಫ್',['r16c5'],{ displayQualifier:'Advocate' }),
  entry('bl-bairna','B. L. Bairna','ಬಿ. ಎಲ್. ಬೈರ್ನಾ',['r16c6'],{ displayQualifier:'landlord', transcriptionNote:'The surname “Bairna” is retained exactly as printed; spelling needs review.' }),
  entry('wh-hanumantha-rao','W. H. Hanumantha Rao','ಡಬ್ಲ್ಯು. ಹೆಚ್. ಹನುಮಂತ ರಾವ್',['r17c1']),
  entry('ac-ramachandra-rao','A. C. Ramachandra Rao','ಎ. ಸಿ. ರಾಮಚಂದ್ರ ರಾವ್',['r17c2']),
  entry('hajee-usman-sait','Hajee Usman Sait','ಹಾಜಿ ಉಸ್ಮಾನ್ ಸೇಟ್',['r17c3']),
  entry('cb-rama-rao','C. B. Rama Rao','ಸಿ. ಬಿ. ರಾಮ ರಾವ್',['r17c4']),
  entry('k-sampathgiri-rao','K. Sampathgiri Rao','ಕೆ. ಸಂಪತ್ಗಿರಿ ರಾವ್',['r17c5']),
  entry('bl-annapurnamma','B. L. Annapurnamma','ಬಿ. ಎಲ್. ಅನ್ನಪೂರ್ಣಮ್ಮ',['r17c6'],{ gender:'woman' }),
  entry('shankar-narayan-rao','Shankar Narayan Rao','ಶಂಕರ ನಾರಾಯಣ ರಾವ್',['r18c1']),
  entry('r-narayanappa','R. Narayanappa','ಆರ್. ನಾರಾಯಣಪ್ಪ',['r18c2']),
  entry('patel-rama-reddy','Patel Rama Reddy','ಪಟೇಲ್ ರಾಮ ರೆಡ್ಡಿ',['r18c3']),
  entry('mir-obeidullah','Mir Obeidullah','ಮೀರ್ ಒಬೇದುಲ್ಲಾ',['r18c4']),
  entry('abdul-razak','Abdul Razak','ಅಬ್ದುಲ್ ರಜಾಕ್',['r18c5'],{ deathYear:1921 }),
  entry('chinnakannu','Chinnakannu','ಚಿನ್ನಕಣ್ಣು',['r18c6'],{ deathYear:1942 }),
  entry('appayya','Appayya','ಅಪ್ಪಯ್ಯ',['r19c1'],{ deathYear:1942 }),
  entry('annapayya','Annapayya','ಅನ್ನಪಯ್ಯ',['r19c2'],{ deathYear:1937 }),
  entry('gundappa-1937','Gundappa','ಗುಂಡಪ್ಪ',['r19c3'],{ deathYear:1937 }),
  entry('dastagir-sab','Dastagir Sab','ದಸ್ತಗೀರ್ ಸಾಬ್',['r19c4']),
  entry('ponnaswami','Ponnaswami','ಪೊನ್ನಸ್ವಾಮಿ',['r19c5'],{ deathYear:1942 }),
  entry('prahalada-setty','Prahalada Setty','ಪ್ರಹ್ಲಾದ ಶೆಟ್ಟಿ',['r19c6'],{ deathYear:1942 }),
  entry('srinivas-1942','Srinivas','ಶ್ರೀನಿವಾಸ್',['r20c1'],{ deathYear:1942 }),
  entry('thippaiah-1942','Thippaiah','ತಿಪ್ಪಯ್ಯ',['r20c2'],{ deathYear:1942 }),
  entry('subhasing-ramsing','Subhasing Ramsing','ಸುಭಾಸಿಂಗ್ ರಾಮ್ಸಿಂಗ್',['r20c3'],{ deathYear:1942 }),
  entry('thimmanna-das','Thimmanna Das','ತಿಮ್ಮಣ್ಣ ದಾಸ್',['r20c4'],{ deathYear:1942 }),
  entry('tippayya-1942','Tippayya','ತಿಪ್ಪಯ್ಯ',['r20c5'],{ deathYear:1942 }),
]

const existingPersonIds = {
  'yashodhara-dasappa':'person-ff-11',
  'nittoor-srinivasa-rao':'person-ff-8',
  'hs-doreswamy':'person-ff-9',
  'kt-bhashyam':'person-ff-215',
  'hosur-narasimhaiah':'person-ff-138',
  'srimushnam-srinivasa-murthy':'person-ff-37',
  'tr-shamanna':'person-ff-222',
  'tt-sharma':'person-ff-96',
  'pr-ramaiya':'person-ff-87',
  's-nijalingappa':'person-ff-7',
  'vs-krishna-iyer':'person-ff-217',
  't-sunandamma':'person-ff-135',
  'mahadevi-tai':'person-ff-145',
  'shankar-narayan-rao':'person-ff-32',
  'r-narayanappa':'person-ff-31',
}

const displayLocator = (record) => `Photographed display, ${record.position.join(' and ')}${record.deathYear ? `; printed “d. ${record.deathYear}”` : ''}`

export function applyBengaluruFreedomFighterDisplay(atlasData, appendUniqueById) {
  appendUniqueById(atlasData.sources, [bengaluruFreedomFighterDisplaySource, ...bengaluruFreedomFighterResearchSources])
  const newPeople = []

  for (const record of bengaluruFreedomFighterDisplayEntries) {
    const sourceCitation = citation(displayLocator(record))
    const existingId = existingPersonIds[record.slug]
    const person = existingId ? atlasData.people.find(item => item.id === existingId) : null
    if (person) {
      person.citations = [...(person.citations || [])]
      if (!person.citations.some(item => item.sourceId === sourceCitation.sourceId && item.locator === sourceCitation.locator)) person.citations.push(sourceCitation)
      person.districtAssociations = [...(person.districtAssociations || [])]
      if (!person.districtAssociations.some(item => item.districtId === 'audit-bengaluru-urban' && item.kind === 'memorial' && item.citations?.some(cite => cite.sourceId === sourceCitation.sourceId))) {
        person.districtAssociations.push({ districtId:'audit-bengaluru-urban', kind:'memorial', citations:[sourceCitation] })
      }
      continue
    }

    newPeople.push({
      id: `person-bengaluru-ff-${record.slug}`,
      name: record.name,
      roles: ['freedom-fighter'],
      gender: record.gender || 'unknown',
      date: { from:null, to:null, era:'CE', precision:'unknown' },
      deathYear: record.deathYear || null,
      polityId: 'external-polity-british-india',
      displayQualifier: record.displayQualifier || null,
      sourceTranscription: {
        printedName: record.name.en,
        positions: record.position,
        note: record.transcriptionNote || null,
      },
      districtAssociations: [{ districtId:'audit-bengaluru-urban', kind:'memorial', citations:[sourceCitation] }],
      citations: [sourceCitation],
      researchNote: name(
        'Candidate transcribed from the photographed Bengaluru display. Identity, spelling, life dates, participation and the display’s geographic scope must be checked against an archival or government record before promotion.',
        'ಛಾಯಾಚಿತ್ರಿತ ಬೆಂಗಳೂರು ಪ್ರದರ್ಶನದಿಂದ ಲಿಪ್ಯಂತರಿಸಿದ ಅಭ್ಯರ್ಥಿ. ಉತ್ತೇಜನಕ್ಕೂ ಮೊದಲು ಗುರುತು, ಕಾಗುಣಿತ, ಜೀವನ ದಿನಾಂಕ, ಹೋರಾಟದ ಪಾತ್ರ ಮತ್ತು ಪ್ರದರ್ಶನದ ಭೌಗೋಳಿಕ ವ್ಯಾಪ್ತಿಯನ್ನು ಆರ್ಕೈವ್ ಅಥವಾ ಸರ್ಕಾರಿ ದಾಖಲೆಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.'
      ),
      review: { ...review },
    })
  }

  appendUniqueById(atlasData.people, newPeople)

  const personFor = slug => atlasData.people.find(item => item.id === (existingPersonIds[slug] || `person-bengaluru-ff-${slug}`))
  const addPersonCitation = (person, sourceId, locator) => {
    if (!person) return
    person.citations = [...(person.citations || [])]
    if (!person.citations.some(item => item.sourceId === sourceId && item.locator === locator)) person.citations.push({ sourceId, locator })
  }
  const addDistrictAssociation = (person, districtId, kind, sourceId, locator) => {
    if (!person) return
    person.districtAssociations = [...(person.districtAssociations || [])]
    if (!person.districtAssociations.some(item => item.districtId === districtId && item.kind === kind && item.citations?.some(cite => cite.sourceId === sourceId))) {
      person.districtAssociations.push({ districtId, kind, citations:[{ sourceId, locator }] })
    }
  }
  const enrich = (slug, fields, sourceId, locator, associations = []) => {
    const person = personFor(slug)
    if (!person) return
    Object.assign(person, fields)
    addPersonCitation(person, sourceId, locator)
    associations.forEach(association => addDistrictAssociation(person, association.districtId, association.kind, sourceId, association.locator || locator))
  }

  enrich('kc-reddy', {
    name:name('Kyasamballi Chengalaraya Reddy (K. C. Reddy)','ಕ್ಯಾಸಂಬಳ್ಳಿ ಚೆಂಗಲರಾಯ ರೆಡ್ಡಿ (ಕೆ. ಸಿ. ರೆಡ್ಡಿ)'),
    roles:['freedom-fighter','administrator','minister'], gender:'man',
    date:{from:1902,to:1976,era:'CE',precision:'range'}, deathYear:1976,
    researchNote:name('Government biography identifies Reddy’s early freedom movement, Mysore Congress and responsible-government work. The photographed-display match is exact by initials and Bengaluru political context.','ಸರ್ಕಾರಿ ಜೀವನಚರಿತ್ರೆ ರೆಡ್ಡಿಯವರ ಆರಂಭಿಕ ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ, ಮೈಸೂರು ಕಾಂಗ್ರೆಸ್ ಮತ್ತು ಜವಾಬ್ದಾರಿ ಸರ್ಕಾರದ ಕಾರ್ಯವನ್ನು ಗುರುತಿಸುತ್ತದೆ. ಛಾಯಾಚಿತ್ರಿತ ಪಟ್ಟಿಯ ಹೊಂದಾಣಿಕೆ ಮೊದಲಕ್ಷರಗಳು ಮತ್ತು ಬೆಂಗಳೂರು ರಾಜಕೀಯ ಸಂದರ್ಭದಿಂದ ನಿಖರವಾಗಿದೆ.'),
  }, 'src-amrit-kc-reddy', 'Government biography; born 4 May 1902, died 27 February 1976', [
    {districtId:'audit-kolar',kind:'birthplace',locator:'Kyasamballi, Kolar district'},
    {districtId:'audit-bengaluru-urban',kind:'activity',locator:'Mysore State government and responsible-government political activity'},
  ])

  enrich('kengal-hanumanthiah', {
    name:name('Kengal Hanumanthaiah','ಕೆಂಗಲ್ ಹನುಮಂತಯ್ಯ'),
    roles:['freedom-fighter','administrator','minister'], gender:'man',
    date:{from:1908,to:1980,era:'CE',precision:'range'}, deathYear:1980,
    researchNote:name('Constituent Assembly biography and its cited Karnataka institutional biographies establish Hanumanthaiah’s identity and public career; item-level imprisonment evidence remains to be added.','ಸಂವಿಧಾನ ಸಭಾ ಪರಿಚಯ ಮತ್ತು ಅದರಲ್ಲಿ ಉಲ್ಲೇಖಿಸಿದ ಕರ್ನಾಟಕದ ಸಂಸ್ಥಾತ್ಮಕ ಜೀವನಚರಿತ್ರೆಗಳು ಹನುಮಂತಯ್ಯನವರ ಗುರುತು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಜೀವನವನ್ನು ಸ್ಥಾಪಿಸುತ್ತವೆ; ಕಾರಾಗೃಹವಾಸದ ವಸ್ತು-ಮಟ್ಟದ ಸಾಕ್ಷ್ಯ ಇನ್ನೂ ಸೇರಬೇಕು.'),
  }, 'src-constitution-india-kengal-hanumanthaiah', 'Member biography and bibliography', [
    {districtId:'audit-ramanagara',kind:'birthplace',locator:'Lakkappanahalli/Kengal regional association; exact historical boundary needs review'},
    {districtId:'audit-bengaluru-urban',kind:'activity',locator:'Constituent, legislative and ministerial career centred in Bengaluru'},
  ])

  enrich('h-sreenivasaiah', {
    roles:['freedom-fighter','journalist','author','social-reformer'], gender:'man', deathYear:2017,
    researchNote:name('Family-attributed obituary records imprisonment in 1942 and 1947, underground freedom-movement publications, journalism and social service. Birth year remains approximate and is not asserted here.','ಕುಟುಂಬದ ಹೇಳಿಕೆಯ ಶ್ರದ್ಧಾಂಜಲಿ 1942 ಮತ್ತು 1947ರ ಕಾರಾಗೃಹವಾಸ, ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿಯ ಭೂಗತ ಪ್ರಕಟಣೆಗಳು, ಪತ್ರಿಕೋದ್ಯಮ ಮತ್ತು ಸಮಾಜಸೇವೆಯನ್ನು ದಾಖಲಿಸುತ್ತದೆ. ಜನ್ಮವರ್ಷ ಅಂದಾಜಾಗಿರುವುದರಿಂದ ಇಲ್ಲಿ ಖಚಿತಪಡಿಸಿಲ್ಲ.'),
  }, 'src-tni-h-sreenivasaiah-2017', 'Obituary, 7 April 2017; imprisonment in 1942 and 1947', [
    {districtId:'audit-bengaluru-urban',kind:'activity',locator:'Bengaluru freedom-movement publications and public-history work'},
    {districtId:'audit-bengaluru-urban',kind:'imprisonment',locator:'Imprisoned in 1942 and 1947; prison and file locators remain unresolved'},
  ])

  enrich('vs-krishna-iyer', {}, 'src-toi-vs-krishna-iyer-2011', 'Obituary: veteran freedom fighter, Bengaluru mayor, minister and MP')

  enrich('chinnakannu', {
    gender:'man', occupation:name('Labourer','ಕಾರ್ಮಿಕ'),
    researchNote:name('The Government of India dictionary identifies Chinnakannu as Bengaluru-born, a labour participant in the 1942 Quit India movement, and records that his body was recovered in the V.O.P. Factory compound. The dictionary’s underlying archival abbreviation SSS, II still needs expansion and checking.','ಭಾರತ ಸರ್ಕಾರದ ನಿಘಂಟು ಚಿನ್ನಕಣ್ಣುವನ್ನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಜನಿಸಿದ ಕಾರ್ಮಿಕ, 1942ರ ಭಾರತ ಬಿಟ್ಟು ತೊಲಗಿ ಚಳವಳಿಯ ಭಾಗವಹಿಸಿದವರು ಎಂದು ಗುರುತಿಸಿ, ಅವರ ಶವ ವಿ.ಒ.ಪಿ. ಕಾರ್ಖಾನೆ ಆವರಣದಲ್ಲಿ ದೊರೆತುದನ್ನು ದಾಖಲಿಸುತ್ತದೆ. ನಿಘಂಟಿನ ಮೂಲ ಆರ್ಕೈವ್ ಸಂಕ್ಷೇಪ SSS, II ಅನ್ನು ಇನ್ನೂ ವಿಸ್ತರಿಸಿ ಪರಿಶೀಲಿಸಬೇಕು.'),
  }, 'src-india-culture-dictionary-martyrs-v5', 'Entry “Chinnakannu”, printed p. 39; archival reference SSS, II', [
    {districtId:'audit-bengaluru-urban',kind:'birthplace',locator:'Born in Bangalore'},
    {districtId:'audit-bengaluru-urban',kind:'activity',locator:'Quit India labour strike and public meetings, 1942'},
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator:'Body recovered in V.O.P. Factory Compound, Bangalore, 1942'},
  ])

  enrich('appayya', {
    gender:'man', ageAtDeath:16, martyrdomDate:'1942-08-17',
    researchNote:name('The Government of India dictionary records Appayya as a Bengaluru teenager who joined railway-station picketing on 17 August 1942 and was killed after police firing. The Karnataka Gazetteer summary independently lists an Appaiah, aged 16, among the city’s 1942 martyrs.','ಭಾರತ ಸರ್ಕಾರದ ನಿಘಂಟು ಅಪ್ಪಯ್ಯನನ್ನು 17 ಆಗಸ್ಟ್ 1942ರಂದು ರೈಲು ನಿಲ್ದಾಣದ ಪಿಕೆಟಿಂಗ್‌ನಲ್ಲಿ ಪಾಲ್ಗೊಂಡು ಪೊಲೀಸ್ ಗುಂಡಿನ ದಾಳಿಯಲ್ಲಿ ಮೃತಪಟ್ಟ ಬೆಂಗಳೂರು ಕಿಶೋರ ಎಂದು ದಾಖಲಿಸುತ್ತದೆ. ಕರ್ನಾಟಕ ಗೆಜೆಟಿಯರ್ ಸಾರಾಂಶವೂ 16 ವರ್ಷದ ಅಪ್ಪಯ್ಯನನ್ನು ನಗರದ 1942ರ ಹುತಾತ್ಮರಲ್ಲಿ ಪಟ್ಟಿ ಮಾಡುತ್ತದೆ.'),
  }, 'src-india-culture-dictionary-martyrs-v5', 'Entry “Appayya”, printed p. 15; railway-station picketing, 17 August 1942; KQIC p. 52', [
    {districtId:'audit-bengaluru-urban',kind:'activity',locator:'Railway-station picketing, 17 August 1942'},
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator:'Killed following police firing during Quit India picketing'},
  ])

  for (const [slug, ageAtDeath, locator, aliases] of [
    ['thippaiah-1942',null,'Named among those killed in the 1942 City Post Office/Balepet/Cottonpet police firings',['Tippaiah']],
    ['ponnaswami',16,'Named among those killed in the 1942 City Post Office/Balepet/Cottonpet police firings',['Ponnuswamy','Ponnaswamy']],
    ['subhasing-ramsing',25,'Named among those killed in the 1942 City Post Office/Balepet/Cottonpet police firings',['Subbasing Ramasingh','Subash Singh Ram Singh']],
    ['thimmanna-das',null,'Killed in a separate 1942 firing near Mysore Bank Square',[]],
  ]) enrich(slug, { ageAtDeath:ageAtDeath || undefined, aliases }, 'src-bangalore-first-bengaluru-1942-martyrs', locator, [
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator},
  ])

  for (const slug of ['thippaiah-1942','ponnaswami','subhasing-ramsing']) {
    const person=personFor(slug)
    if(person)person.martyrdomDate='1942-08-17'
  }
  const thimmanna=personFor('thimmanna-das')
  if(thimmanna)thimmanna.martyrdomDate='1942-08-16'
  for (const slug of ['appayya','thippaiah-1942','ponnaswami','subhasing-ramsing','thimmanna-das']) {
    addPersonCitation(personFor(slug),'src-bangalore-first-mysore-bank-martyrs','Historian S. K. Aruni chronology of Bengaluru police actions, 16–18 August 1942')
  }

  enrich('abdul-razak', {
    gender:'man', martyrdomDate:'1921-11-18', deathYear:1921,
    researchNote:name('The Government of India dictionary records Abdul Razak as Bengaluru-born and killed after police firing on the 18 November 1921 Cantonment protest connected with the Prince of Wales visit. Its cited SSS volume and page remain the next archival check.','ಭಾರತ ಸರ್ಕಾರದ ನಿಘಂಟು ಅಬ್ದುಲ್ ರಜಾಕ್ ಅವರನ್ನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಜನಿಸಿದವರು ಮತ್ತು ವೇಲ್ಸ್ ರಾಜಕುಮಾರನ ಭೇಟಿಗೆ ಸಂಬಂಧಿಸಿದ 18 ನವೆಂಬರ್ 1921ರ ಕಂಟೋನ್ಮೆಂಟ್ ಪ್ರತಿಭಟನೆಯಲ್ಲಿ ಪೊಲೀಸ್ ಗುಂಡಿನ ದಾಳಿಯ ನಂತರ ಮೃತಪಟ್ಟವರು ಎಂದು ದಾಖಲಿಸುತ್ತದೆ. ಅದು ಉಲ್ಲೇಖಿಸಿದ SSS ಸಂಪುಟ ಮತ್ತು ಪುಟ ಮುಂದಿನ ಆರ್ಕೈವ್ ಪರಿಶೀಲನೆಯಾಗಿದೆ.'),
  }, 'src-india-culture-dictionary-martyrs-v5', 'Entry “Abdul Razak”, printed pp. 2–3; SSS II, p. 31', [
    {districtId:'audit-bengaluru-urban',kind:'birthplace',locator:'Born in Bangalore'},
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator:'Cantonment protest police firing, 18 November 1921'},
  ])

  enrich('dastagir-sab', {
    gender:'man', martyrdomDate:'1921-11-18', deathYear:1921,
    researchNote:name('The Government of India dictionary records Dastagir Sab as Bengaluru-born and killed after police firing on the Cantonment protest of 18 November 1921. The abbreviated SSS reference needs resolution against the underlying source series.','ಭಾರತ ಸರ್ಕಾರದ ನಿಘಂಟು ದಸ್ತಗೀರ್ ಸಾಬ್ ಅವರನ್ನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಜನಿಸಿದವರು ಮತ್ತು 18 ನವೆಂಬರ್ 1921ರ ಕಂಟೋನ್ಮೆಂಟ್ ಪ್ರತಿಭಟನೆಯಲ್ಲಿ ಪೊಲೀಸ್ ಗುಂಡಿನ ದಾಳಿಯ ನಂತರ ಮೃತಪಟ್ಟವರು ಎಂದು ದಾಖಲಿಸುತ್ತದೆ. ಸಂಕ್ಷಿಪ್ತ SSS ಉಲ್ಲೇಖವನ್ನು ಮೂಲ ಆಕರ ಸರಣಿಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.'),
  }, 'src-india-culture-dictionary-martyrs-v5', 'Entry “Dastagir Sab”, printed pp. 44–45; SSS reference', [
    {districtId:'audit-bengaluru-urban',kind:'birthplace',locator:'Born in Bangalore'},
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator:'Cantonment protest police firing, 18 November 1921'},
  ])

  enrich('annapayya', {
    name:name('Annayyappa (display: Annapayya)','ಅನ್ನಯ್ಯಪ್ಪ (ಪ್ರದರ್ಶನದಲ್ಲಿ: ಅನ್ನಪಯ್ಯ)'), aliases:['Annapayya'], gender:'man', martyrdomDate:'1937-10-25', deathYear:1937,
    researchNote:name('The photographed “Annapayya, d. 1937” is a strong but still reviewable spelling match to the dictionary’s Annayyappa, killed in the 25 October 1937 Mysore Bank-area police firing. The Secret Files and Mysore political-history references cited by the dictionary should confirm the identity.','ಛಾಯಾಚಿತ್ರಿತ “ಅನ್ನಪಯ್ಯ, ಮೃ. 1937” ಹೆಸರು, 25 ಅಕ್ಟೋಬರ್ 1937ರ ಮೈಸೂರು ಬ್ಯಾಂಕ್ ಪ್ರದೇಶದ ಪೊಲೀಸ್ ಗುಂಡಿನ ದಾಳಿಯಲ್ಲಿ ಮೃತಪಟ್ಟ ನಿಘಂಟಿನ ಅನ್ನಯ್ಯಪ್ಪನೊಂದಿಗೆ ಬಲವಾದರೂ ಇನ್ನೂ ಪರಿಶೀಲಿಸಬೇಕಾದ ಕಾಗುಣಿತ ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ. ನಿಘಂಟು ಉಲ್ಲೇಖಿಸಿದ ಸೀಕ್ರೆಟ್ ಫೈಲ್ಸ್ ಮತ್ತು ಮೈಸೂರು ರಾಜಕೀಯ ಇತಿಹಾಸ ಆಕರಗಳು ಗುರುತನ್ನು ದೃಢಪಡಿಸಬೇಕು.'),
  }, 'src-india-culture-dictionary-martyrs-v5', 'Entry “Annayyappa”, printed pp. 13–14; S-36 Secret Files, Special Branch Abstract 44/37', [
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator:'Mysore Bank-area police firing, 25 October 1937'},
  ])

  enrich('srinivas-1942', {
    gender:'man', ageAtDeath:16, martyrdomDate:'1942-08-17', deathYear:1942,
    researchNote:name('The Government of India dictionary records Shrinivas as a 16-year-old Bengaluru resident killed by police while participating in railway stoppages during the Quit India movement. The photographed display spells the name Srinivas.','ಭಾರತ ಸರ್ಕಾರದ ನಿಘಂಟು ಶ್ರೀನಿವಾಸರನ್ನು ಭಾರತ ಬಿಟ್ಟು ತೊಲಗಿ ಚಳವಳಿಯಲ್ಲಿ ರೈಲು ತಡೆಗಳಲ್ಲಿ ಪಾಲ್ಗೊಂಡಾಗ ಪೊಲೀಸ್ ಗುಂಡಿನ ದಾಳಿಯಲ್ಲಿ ಮೃತಪಟ್ಟ 16 ವರ್ಷದ ಬೆಂಗಳೂರು ನಿವಾಸಿ ಎಂದು ದಾಖಲಿಸುತ್ತದೆ. ಛಾಯಾಚಿತ್ರಿತ ಪ್ರದರ್ಶನದಲ್ಲಿ ಹೆಸರನ್ನು Srinivas ಎಂದು ಬರೆಯಲಾಗಿದೆ.'),
  }, 'src-india-culture-dictionary-martyrs-v5', 'Entry “Shrinivas”, printed p. 220; KQIC p. 52', [
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator:'Railway-stoppage police firing, 17 August 1942'},
  ])

  for (const [slug, locator, note] of [
    ['ponnaswami','Entry “Ponnaswami”, printed p. 191; KQIC p. 52','Age 16; railway picketing; killed 17 August 1942'],
    ['subhasing-ramsing','Entry “Subhasing Ramsing”, printed p. 223; KQIC p. 52','Age 25; railway picketing; killed 17 August 1942'],
    ['thimmanna-das','Entry “Thimmanna Das”, printed pp. 235–236; PMRA and PMLC','Born at Nagarathpet; killed at Mysore Bank Circle on 16 August 1942'],
    ['thippaiah-1942','Entry “Thippaiah”, printed p. 236; PMRA and PMLC','Born in Bangalore; killed in a city procession firing on 17 August 1942'],
  ]) {
    addPersonCitation(personFor(slug),'src-india-culture-dictionary-martyrs-v5',`${locator}; ${note}`)
  }
  enrich('tippayya-1942', {
    gender:'man', ageAtDeath:15, martyrdomDate:'1942-08-17', deathYear:1942,
    researchNote:name('The Government of India dictionary treats Tippayya as a separate 15-year-old Bengaluru resident killed during railway-stoppage picketing on 17 August 1942. This should not be silently merged with the separately listed Thippaiah.','ಭಾರತ ಸರ್ಕಾರದ ನಿಘಂಟು ತಿಪ್ಪಯ್ಯನನ್ನು 17 ಆಗಸ್ಟ್ 1942ರ ರೈಲು ತಡೆ ಪಿಕೆಟಿಂಗ್‌ನಲ್ಲಿ ಮೃತಪಟ್ಟ 15 ವರ್ಷದ ಪ್ರತ್ಯೇಕ ಬೆಂಗಳೂರು ನಿವಾಸಿಯಾಗಿ ದಾಖಲಿಸುತ್ತದೆ. ಪ್ರತ್ಯೇಕವಾಗಿ ಪಟ್ಟಿ ಮಾಡಿದ Thippaiah ಅವರೊಂದಿಗೆ ಇದನ್ನು ಮೌನವಾಗಿ ವಿಲೀನಗೊಳಿಸಬಾರದು.'),
  }, 'src-india-culture-dictionary-martyrs-v5', 'Entry “Tippayya”, printed p. 238; KQIC p. 52', [
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator:'Railway-stoppage police firing, 17 August 1942'},
  ])

  enrich('gundappa-1937', {
    aliases:['Gundappa of Cubbonpet'],
    researchNote:name('A public-history account identifies a Gundappa, possibly of Cubbonpet, as killed in the 1937 Banappa Park firing. The photographed display independently gives “Gundappa, d. 1937”; the tentative identity still requires the memorial inscription or gazetteer page.','ಸಾರ್ವಜನಿಕ ಇತಿಹಾಸದ ವರದಿ 1937ರ ಬಾಣಪ್ಪ ಪಾರ್ಕ್ ಗುಂಡಿನ ದಾಳಿಯಲ್ಲಿ ಮೃತಪಟ್ಟ, ಬಹುಶಃ ಕಬ್ಬನ್‌ಪೇಟೆಯ ಗುಂಡಪ್ಪನನ್ನು ಗುರುತಿಸುತ್ತದೆ. ಛಾಯಾಚಿತ್ರಿತ ಪ್ರದರ್ಶನವೂ “ಗುಂಡಪ್ಪ, ಮೃ. 1937” ಎಂದು ನೀಡುತ್ತದೆ; ತಾತ್ಕಾಲಿಕ ಗುರುತಿಗೆ ಸ್ಮಾರಕ ಶಾಸನ ಅಥವಾ ಗೆಜೆಟಿಯರ್ ಪುಟ ಇನ್ನೂ ಅಗತ್ಯ.'),
  }, 'src-indian-express-bengaluru-freedom-memory-2024', 'Banappa Park firing; residence stated as possible Cubbonpet', [
    {districtId:'audit-bengaluru-urban',kind:'martyrdom',locator:'Banappa Park firing, 1937; exact identity remains provisional'},
  ])
  addPersonCitation(personFor('gundappa-1937'),'src-india-culture-dictionary-martyrs-v5','Entry “Gundappa”, printed pp. 63–64; killed near Mysore Bank on 25 October 1937; S-36 Secret Files, Special Branch Abstract 44/37')

  enrich('prahalada-setty', {
    aliases:['Prahlad Shetty'],
    researchNote:name('The Government of India dictionary says Prahalladha Setty died in police firing on 16 August 1942, while reported H. S. Doreswamy testimony says he died after incarceration in Central Jail. This material conflict is intentionally retained for reviewer resolution against the memorial, prison register, PMRA and PMLC.','ಭಾರತ ಸರ್ಕಾರದ ನಿಘಂಟು ಪ್ರಹ್ಲಾದ ಶೆಟ್ಟಿ 16 ಆಗಸ್ಟ್ 1942ರ ಪೊಲೀಸ್ ಗುಂಡಿನ ದಾಳಿಯಲ್ಲಿ ಮೃತಪಟ್ಟರು ಎಂದು ಹೇಳುತ್ತದೆ; ಹೆಚ್. ಎಸ್. ದೊರೆಸ್ವಾಮಿಯವರ ವರದಿಯಾದ ಸಾಕ್ಷ್ಯ ಅವರು ಕೇಂದ್ರ ಕಾರಾಗೃಹದಲ್ಲಿ ಸೆರೆವಾಸದ ನಂತರ ಮೃತಪಟ್ಟರು ಎಂದು ಹೇಳುತ್ತದೆ. ಸ್ಮಾರಕ, ಕಾರಾಗೃಹ ನೋಂದಣಿ, PMRA ಮತ್ತು PMLC ಆಧಾರಗಳಿಂದ ಪರಿಶೀಲಕರು ಬಗೆಹರಿಸುವಂತೆ ಈ ಮೂಲಭೂತ ವಿರೋಧವನ್ನು ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಉಳಿಸಲಾಗಿದೆ.'),
  }, 'src-indian-express-bengaluru-freedom-memory-2024', 'Bengaluru memorial; circumstances of death explicitly unresolved')
  addPersonCitation(personFor('prahalada-setty'),'src-india-culture-dictionary-martyrs-v5','Entry “Prahalladha Setty”, printed p. 194; dictionary says death in police firing on 16 August 1942; PMRA and PMLC')
  addPersonCitation(personFor('prahalada-setty'),'src-bangalore-first-mysore-bank-martyrs','Named on memorial plaque; H. S. Doreswamy testimony reports incarceration and death in Central Jail')
  addDistrictAssociation(personFor('prahalada-setty'),'audit-bengaluru-urban','imprisonment','src-bangalore-first-mysore-bank-martyrs','Central Jail, Bengaluru; prison register locator unresolved')
  addDistrictAssociation(personFor('prahalada-setty'),'audit-bengaluru-urban','martyrdom','src-bangalore-first-mysore-bank-martyrs','Memorialised at Mysore Bank Circle; exact date and circumstances require review')
}
