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
  appendUniqueById(atlasData.sources, [bengaluruFreedomFighterDisplaySource])
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
}
