const name=(kn,en)=>({kn,en})
const narrative=(kind,recordId,kn,en)=>({kind,recordId,narrative:name(kn,en)})

export const trails=[
  {
    id:'trail-kadamba-rashtrakuta',
    slug:'kadamba-rashtrakuta',
    era:'classical',
    yearRange:{from:345,to:973,era:'CE'},
    title:name('ಪ್ರಾಚೀನ ಕರ್ನಾಟಕ: ಬನವಾಸಿಯಿಂದ ಮಾನ್ಯಖೇಟದವರೆಗೆ','Early Karnataka: Banavasi to Manyakheta'),
    summary:name(
      'ಕದಂಬರ ಅಧಿಕಾರದಿಂದ ರಾಷ್ಟ್ರಕೂಟರ ಸಾಮ್ರಾಜ್ಯದವರೆಗಿನ ಆರು ಶತಮಾನಗಳ ಕಥೆ — ಕನ್ನಡ ಭಾಷೆಯ ಮೊದಲ ದಾಖಲೆ, ಶಾಸನ ಪರಂಪರೆ, ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಸಾಹಿತ್ಯದ ಅಡಿಪಾಯ.',
      'Six hundred years from Kadamba rule to the Rashtrakuta empire: the first records of Kannada, the inscription tradition, architecture and the foundations of literature.'
    ),
    stops:[
      narrative('events','event-kadamba-power-emerges','ಸು. 345ರಲ್ಲಿ ಬನವಾಸಿ ಕದಂಬರ ಕೇಂದ್ರವಾಗಿ ಮೇಲೆದ್ದಿತು. ದಕ್ಷಿಣ ಭಾರತದ ಮೊದಲ ಸ್ಥಳೀಯ ಸಾಮ್ರಾಜ್ಯವೆಂದೇ ಪರಿಗಣಿತವಾದ ಕದಂಬ ವಂಶದ ಆರಂಭ ಇದು.','Around 345 CE Banavasi rose as the centre of Kadamba power, considered the first indigenous kingdom of southern India.'),
      narrative('inscriptions','inscription-talagunda','ತಾಳಗುಂದ ಶಾಸನವು (ಸು. 455) ಕದಂಬ ಸಂಸ್ಥಾಪಕ ಮಯೂರಶರ್ಮನ ಕಥೆಯನ್ನು ದಾಖಲಿಸುತ್ತದೆ. ಇದು ಕನ್ನಡ ಶಾಸನ ಪರಂಪರೆಗೆ ಪೀಠಿಕೆಯಾಗುತ್ತದೆ.','The Talagunda inscription (c. 455) records the foundation story of Mayurasharma and the Kadambas — the opening of the Kannada inscription tradition.'),
      narrative('people','person-mayurasharma','ವಿದ್ವಾಂಸನಾಗಿದ್ದ ಮಯೂರಶರ್ಮನೇ ಕದಂಬ ವಂಶದ ಸ್ಥಾಪಕ. ಶಾಸನಗಳು ಆತನ ಸಾಹಸವನ್ನು ಸಂಸ್ಕೃತ ಮತ್ತು ಕನ್ನಡ ಎರಡರಲ್ಲೂ ಹೇಳುತ್ತವೆ.','Mayurasharma, himself a scholar, founded the Kadamba lineage; inscriptions tell his story in Sanskrit and early Kannada.'),
      narrative('inscriptions','inscription-halmidi','ಹಲ್ಮಿಡಿ ಶಾಸನ (ಸು. 450) ಕನ್ನಡ ಭಾಷೆಯ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಪುರಾವೆ. ಒಂದು ಸಾಹಿತ್ಯಿಕ ಘಟನೆಯಲ್ಲ, ಭಾಷೆಯ ಅಸ್ತಿತ್ವದ ದಾಖಲೆ.','The Halmidi inscription (c. 450) is the earliest known record of the Kannada language — proof of existence, not just a literary milestone.'),
      narrative('places','place-banavasi','ಬನವಾಸಿ ಕದಂಬರ ರಾಜಧಾನಿ. ಶಾಸನಗಳಲ್ಲಿ ಕನ್ನಡ ಜನರ ಸ್ಮರಣೆಯ ತಾಣ ಎಂದೇ ಇದನ್ನು ಕಾಣುತ್ತೇವೆ. ನಗರದ ಇತಿಹಾಸ ಭೂಪಟದ ಮೇಲೆ ಸ್ಪಷ್ಟವಾಗಿ ನೋಡಬಹುದು.','Banavasi was the Kadamba capital, praised in inscriptions as the seat of the Kannada people. Its history is visible on the atlas map.'),
      narrative('events','event-rashtrakuta-rise','ಕದಂಬರ ನಂತರದ ಶತಮಾನಗಳಲ್ಲಿ ಅಧಿಕಾರ ಬದಲಾದವು. ರಾಷ್ಟ್ರಕೂಟರು ಮೇಲೆದ್ದು ಸುಮಾರು ಮೂರು ಶತಮಾನಗಳ ಕಾಲ ದಖನ್ ಪ್ರಾಬಲ್ಯ ಹೊಂದಿದರು.','Power shifted in the centuries after the Kadambas; the Rashtrakutas rose to dominate the Deccan for nearly three centuries.'),
      narrative('culturalHeritage','culture-ellora-kailasa-rashtrakuta','ರಾಷ್ಟ್ರಕೂಟರ ಶಕ್ತಿಯ ಪ್ರತೀಕ ಎಲ್ಲೋರದ ಕೈಲಾಸ ದೇವಾಲಯ (ಸು. 756–773). ಒಂದೇ ಬಂಡೆಯ ಮೇಲೆ ಕಡೆದ ಈ ವಾಸ್ತು ಎಂಜಿನಿಯರಿಂಗ್ ಅದ್ಭುತ.','The Kailasa Temple at Ellora (c. 756–773) is the symbol of Rashtrakuta power — a single-rock excavation and an engineering marvel.'),
      narrative('works','work-kavirajamarga','ಸು. 850ರ ಕವಿರಾಜಮಾರ್ಗ ಕನ್ನಡದ ಅತ್ಯಂತ ಪ್ರಾಚೀನ ಸಾಹಿತ್ಯ ಗ್ರಂಥ. ರಾಷ್ಟ್ರಕೂಟ ಆಸ್ಥಾನದಲ್ಲಿ ಕನ್ನಡ ಸಾಹಿತ್ಯ ಪರಂಪರೆ ಬೇರೂರಿದ್ದಕ್ಕೆ ಈ ಗ್ರಂಥವೇ ಸಾಕ್ಷಿ.','Kavirajamarga (c. 850) is the earliest work of Kannada literature, proof that Kannada literary culture had taken root under the Rashtrakuta court.'),
      narrative('events','event-manyakheta-imperial-centre','ಮಾನ್ಯಖೇಟ ರಾಷ್ಟ್ರಕೂಟರ ಸಾಮ್ರಾಜ್ಯದ ಕೇಂದ್ರವಾದಾಗ ಕರ್ನಾಟಕ ದೂರದ ಗಡಿಗಳಿಗೆ ವಿಸ್ತರಿಸಿದ ಸಾಮ್ರಾಜ್ಯದ ಹೃದಯವಾಗಿತ್ತು.','When Manyakheta became the Rashtrakuta imperial centre, Karnataka stood at the heart of an empire that reached distant frontiers.'),
      narrative('works','work-vikramarjuna-vijaya','ಸು. 941ರ ವಿಕ್ರಮಾರ್ಜುನ ವಿಜಯದಲ್ಲಿ ಪಂಪನು ಮಹಾಭಾರತವನ್ನು ಕನ್ನಡಕ್ಕೆ ಅಳವಡಿಸಿದ. ರಾಷ್ಟ್ರಕೂಟ ಯುಗವನ್ನು ಹಾರಿಸಿ ನಡೆದ ಪಂಪನೇ ಪ್ರಪ್ರಥಮ ಮಹಾಕವಿ.','Pampa rendered the Mahabharata in Kannada in Vikramarjuna Vijaya (c. 941); Pampa is celebrated as the first great poet, crowning the Rashtrakuta age.'),
    ],
  },
  {
    id:'trail-hoysala-sovereignty',
    slug:'hoysala-sovereignty',
    era:'medieval',
    yearRange:{from:1116,to:1300,era:'CE'},
    title:name('ಹೊಯ್ಸಳರ ಸಾರ್ವಭೌಮತ್ವ','Hoysala Sovereignty'),
    summary:name(
      'ಸ್ಥಳೀಯ ಶಕ್ತಿಯ ಗೆಲುವು — ಹೊಯ್ಸಳರು ಹೇಗೆ ಏರಿದರು, ಬೇಲೂರು-ಹಳೇಬೀಡನ್ನು ರಾಜಕೇಂದ್ರಗಳಾಗಿ ಕಟ್ಟಿದರು, ಮತ್ತು ದಕ್ಷಿಣ ಭಾರತದ ಸ್ಮಾರಕ ವಾಸ್ತುಶಿಲ್ಪದ ಒಂದು ಉತ್ತುಂಗವನ್ನು ಆಳಿದರು.',
      'The triumph of regional power: how the Hoysalas rose, built Belur and Halebidu as royal centres, and ruled a peak of southern Indian monumental architecture.'
    ),
    stops:[
      narrative('events','event-hoysala-sovereignty','ಹೊಯ್ಸಳ ಸಾರ್ವಭೌಮತ್ವ 12ನೇ ಶತಮಾನದ ಆರಂಭದಲ್ಲಿ ಸ್ಥಾಪಿತವಾಯಿತು — ಚೋಳರ ಒತ್ತಡದ ನಡುವೆಯೇ ದಕ್ಷಿಣ ಕರ್ನಾಟಕದಲ್ಲಿ ಸ್ಥಳೀಯ ಆಳ್ವಿಕೆ ಮೇಲೆದ್ದುದು ಇದು.','Hoysala sovereignty was established in the early 12th century — local rule rising in southern Karnataka amid Chola pressure.'),
      narrative('events','event-hoysala-belur-halebidu-centres','ಬೇಲೂರು ಮತ್ತು ಹಳೇಬೀಡು ಹೊಯ್ಸಳರ ರಾಜಕೇಂದ್ರಗಳಾದವು. ಎರಡೂ ನಗರಗಳಲ್ಲಿ ಉಳಿದ ದೇವಾಲಯ ಸಂಕೀರ್ಣಗಳು ಆ ರಾಜ್ಯದ ವೈಭವವನ್ನು ಇಂದಿಗೂ ಹೇಳುತ್ತವೆ.','Belur and Halebidu became Hoysala royal centres; the temple complexes that survive tell the glory of that state today.'),
      narrative('culturalHeritage','culture-kml-hoysala-beluru-chennakeshava','ಬೇಲೂರಿನ ಶ್ರೀ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ ಹೊಯ್ಸಳ ವಾಸ್ತು ಕಲೆಯ ಉತ್ಕೃಷ್ಟ ಉದಾಹರಣೆ. ತಾಣ ಸಂಶೋಧನಾ ಸುಳಿವಾಗಿ ದಾಖಲಾಗಿದ್ದು, ಆಕರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಉತ್ತೇಜಿಸಬಹುದು.','Belur’s Chennakeshava Temple is the finest expression of Hoysala architectural art; recorded as a heritage research lead awaiting source-confirmed promotion.'),
      narrative('culturalHeritage','culture-kml-hoysala-halebeedu','ಹಳೇಬೀಡಿನ ಭವ್ಯ ದೇವಾಲಯ ಸಂಕೀರ್ಣ ಹೊಯ್ಸಳ ವಾಸ್ತುಶಿಲ್ಪದ ಪರಾಕಾಷ್ಠೆ. ಈ ವಿಶ್ವಪ್ರಸಿದ್ಧ ತಾಣದ ಬಗ್ಗೆ ವಿವರ ನೋಡಲು ಭೂಪಟ ಅನ್ವೇಷಣೆ ಸಹಾಯಕ.','The grandeur of Halebidu is the apex of Hoysala architecture; explore the atlas for detail on this celebrated site.'),
      narrative('culturalHeritage','culture-somanathapura-keshava-1268','ಸು. 1268ರ ಸೋಮನಾಥಪುರದ ಕೇಶವ ದೇವಾಲಯ ಹೊಯ್ಸಳ ಕಲೆಯ ಕೊನೆಯ ಹೊಳಪು. ಸಂಸ್ಕೃತ, ಕನ್ನಡ ಎರಡರಲ್ಲೂ ಶಿಲ್ಪ ಮತ್ತು ಶಾಸನ ಸಂಪ್ರದಾಯವನ್ನು ಮುನ್ನೆಲೆಗೆ ತರುತ್ತದೆ.','The Keshava Temple at Somanathapura (c. 1268) is the late brilliance of Hoysala art, drawing together sculpture and inscription tradition in both languages.'),
    ],
  },
  {
    id:'trail-sharana-vachana',
    slug:'sharana-vachana',
    era:'medieval',
    yearRange:{from:1105,to:1200,era:'CE'},
    title:name('ಶರಣರ ಚಳವಳಿ: ವಚನ ಸಾಹಿತ್ಯದ ಹುಟ್ಟು','The Sharana Movement: Birth of the Vachanas'),
    summary:name(
      '12ನೇ ಶತಮಾನದಲ್ಲಿ ಕಲ್ಯಾಣದ ಕೇಂದ್ರದಿಂದ ಹುಟ್ಟಿದ ಶರಣರ ಚಳವಳಿ — ಕಾಯಕ, ಜಾತ್ಯತೀತ ಸಮಾನತೆ ಮತ್ತು ವಚನ ಭಕ್ತಿ ಪರಂಪರೆ. ಬಸವಣ್ಣ, ಅಲ್ಲಮ ಪ್ರಭು ಮತ್ತು ಅಕ್ಕ ಮಹಾದೇವಿಯರ ಧ್ವನಿಗಳು.',
      'The 12th-century Sharana movement centred at Kalyana — a stream of kayaka, caste-defying equality and vachana devotion, voiced by Basavanna, Allama Prabhu and Akka Mahadevi.'
    ),
    stops:[
      narrative('people','person-basavanna','ಬಸವಣ್ಣ (ಸು. 1105–1167) ಕಲ್ಯಾಣದಲ್ಲಿ ಶರಣರ ಚಳವಳಿಯ ಮುಖ್ಯ ಚಾಲಕಶಕ್ತಿ. ಅವರ ವಚನಗಳು ಸಾಮಾಜಿಕ ಸುಧಾರಣೆಯ ಹರಿಕಾರರಾಗಿ ಅವರ ಸ್ಥಾನವನ್ನು ಸ್ಥಾಪಿಸುತ್ತವೆ.','Basavanna (c. 1105–1167) was the driving force of the Sharana movement at Kalyana; his vachanas placed a social revolution at its core.'),
      narrative('events','event-kayaka-vachana-occupational-voices','ಈ ಘಟನೆಯು ಕೆಲಸ-ಕಸುಬಿನ ದನಿಗಳನ್ನು ವಚನ ಚಳವಳಿಯೊಳಗೆ ತರುತ್ತದೆ — ಕಾಯಕದ ಗೌರವವೇ ಚಳವಳಿಯ ಹೃದಯ.','This event carries the voices of working communities into the vachana movement — dignity of kayaka (work) at the movement’s heart.'),
      narrative('places','place-kalyani','ಕಲ್ಯಾಣ (ಬಸವಕಲ್ಯಾಣ) 12ನೇ ಶತಮಾನದ ಉತ್ತರ ಕರ್ನಾಟಕದ ಕೇಂದ್ರ. ಶರಣರ ಚಳವಳಿಯ ಅನುಭವ ಮಂಟಪ ಈ ನಗರದೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದೆ.','Kalyani (Basavakalyana) was the northern Karnataka centre where the Anubhava Mantapa of the Sharana movement is associated with the city.'),
      narrative('people','person-allama-prabhu','ಅಲ್ಲಮ ಪ್ರಭು (ಸು. 1100–1170) ಶೂನ್ಯ ಸಂಪಾದನೆಯ ಪ್ರವಾದಿ. ಅನುಭವ ಮಂಟಪದ ಕೇಂದ್ರ ವ್ಯಕ್ತಿಯಾಗಿ ಶರಣರ ಚಳವಳಿಯನ್ನು ನಡೆಸಿದರು.','Allama Prabhu (c. 1100–1170), prophet of the void, led the Anubhava Mantapa as its central presence guiding the gathered sharanas.'),
      narrative('works','work-basavanna-vachanas','ಬಸವಣ್ಣನ ವಚನಗಳು (ಸು. 1160) ಕನ್ನಡ ಭಕ್ತಿ ಸಾಹಿತ್ಯದ ತಳಹದಿ. ಪ್ರಾಮಾಣಿಕತೆ, ಸಮಾನತೆ ಮತ್ತು ಕಾಯಕ ಕುರಿತ ವಚನಗಳು ಇಂದಿಗೂ ಪ್ರಸ್ತುತ.','The Basavanna vachanas (c. 1160) are the foundation of Kannada devotional literature — verses on honesty, equality and kayaka that still speak today.'),
      narrative('works','work-allama-prabhu-vachanas','ಅಲ್ಲಮ ಪ್ರಭುವಿನ ವಚನಗಳು (ಸು. 1160) ನೆಟ್ಟಿಗರ ಗಂಪನ ಸಾರ — ವಿಚಾರ ಮತ್ತು ಭಕ್ತಿಯ ನಿಗೂಢ ಸಮ್ಮಿಳನ.','Allama Prabhu’s vachanas (c. 1160) condense a mystic blend of thought and devotion — Nettigara Gumpa’s essence.'),
      narrative('people','person-akka-mahadevi','ಅಕ್ಕ ಮಹಾದೇವಿ (ಸು. 1130–1160) ಬಂಧಗಳಿಂದ ಹೊರಬಂದ ಮಹಿಳಾ ಶರಣೆ. ಅವರ ವಚನಗಳು ಒಂಟಿಯಾಗಿ ನಡೆಯುವ ಪಥವನ್ನು ವರ್ಣಿಸುತ್ತವೆ.','Akka Mahadevi (c. 1130–1160) was the woman sharana who renounced all bonds; her vachanas describe the path of walking alone.'),
      narrative('works','work-akka-mahadevi-vachanas','ಅಕ್ಕ ಮಹಾದೇವಿಯ ವಚನಗಳು (ಸು. 1160) ಸಹಜ ಶರಣೆ ಎಂಬ ಹೆಸರಲ್ಲಿ ಭಕ್ತಿ ಮತ್ತು ವಿರಹವನ್ನು ಕನ್ನಡಕ್ಕೆ ಬರೆದವು.','Akka Mahadevi’s vachanas (c. 1160) wrote devotion and longing into Kannada under the name Sahaja Sharanē.'),
    ],
  },
  {
    id:'trail-vijayanagara',
    slug:'vijayanagara-hampi',
    era:'medieval',
    yearRange:{from:1336,to:1565,era:'CE'},
    title:name('ವಿಜಯನಗರ: ಹಂಪಿಯ ಸಾಮ್ರಾಜ್ಯ','Vijayanagara: The Empire of Hampi'),
    summary:name(
      '1936ರ ಸ್ಥಾಪನೆಯಿಂದ 1565ರ ತಾಳಿಕೋಟೆ ನಂತರದ ಪತನದವರೆಗೆ — ಹರಿಹರ-ಬುಕ್ಕರ ದಂಪತಿಯಿಂದ ಕೃಷ್ಣದೇವರಾಯನ ಆಳ್ವಿಕೆ, ವಿದೇಶಿ ರಾಯಭಾರಿಗಳು ಮತ್ತು ಹಂಪಿಯ ಸ್ಮಾರಕ ಭೂದೃಶ್ಯ.',
      'From its 1336 founding to the fall after Talikota in 1565 — the brothers Harihara and Bukka, the reign of Krishnadevaraya, foreign ambassadors and the monumental landscape of Hampi.'
    ),
    stops:[
      narrative('events','event-vijayanagara-foundation','ಸು. 1336ರಲ್ಲಿ ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕ ವಿಜಯನಗರದ ಸ್ಥಾಪನೆ ಮಾಡಿದರು. ತುಂಗಭದ್ರೆಯ ದಡದಲ್ಲಿ ಹುಟ್ಟಿದ ಈ ನಗರ ದಕ್ಷಿಣ ಭಾರತದ ಬೃಹತ್ ಸಾಮ್ರಾಜ್ಯವಾಯಿತು.','Around 1336 Harihara and Bukka founded Vijayanagara on the Tungabhadra banks — a city that grew into southern India’s greatest empire.'),
      narrative('people','person-harihara-i','ಹರಿಹರ I (ಹಕ್ಕ ಬುಕ್ಕರಲ್ಲಿ ಒಬ್ಬ) ಸ್ಥಾಪಕ ಸಹೋದರರಲ್ಲಿ ಮೊದಲಿಗ. ಅವರಿಂದ ಆರಂಭವಾದ ಸಂಗಮ ವಂಶ ಶತಮಾನಗಳ ಕಾಲ ಆಳಿತು.','Harihara I, one of the founding Hakka–Bukka brothers, opened the Sangama lineage that ruled for centuries.'),
      narrative('places','place-hampi','ಹಂಪಿ ವಿಜಯನಗರದ ರಾಜಧಾನಿ ಮತ್ತು ಪವಿತ್ರ ಕೇಂದ್ರ. ಸ್ಮಾರಕಗಳ ಈ ಭೂದೃಶ್ಯವನ್ನು ಭೂಪಟದ ಮೇಲೆ ಸ್ಪಷ್ಟವಾಗಿ ಗುರುತಿಸಬಹುದು.','Hampi was Vijayanagara’s capital and sacred centre — a monumental landscape you can trace on the atlas map.'),
      narrative('events','event-domingo-paes-vijayanagara','ಪೋರ್ಚುಗೀಸ್ ಪ್ರಯಾಣಿಕ ಡೊಮಿಂಗೊ ಪೇಸ್ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಸಂದರ್ಶಿಸಿ ವಿಜಯನಗರ ಮತ್ತು ಅದರ ಆಸ್ಥಾನದ ಕಣ್ಣುಕಟ್ಟುವ ಚಿತ್ರಣ ಬಿಟ್ಟರು.','The Portuguese traveller Domingo Paes visited the empire and left one of the finest eyewitness portraits of Vijayanagara and its court.'),
      narrative('events','event-abdur-razzaq-vijayanagara','ಟಿಮುರಿಡ್ ರಾಯಭಾರಿ ಅಬ್ದುಲ್ ರಜಾಕ್ ಹಂಪಿಯ ಐಶ್ವರ್ಯವನ್ನು ಕಣ್ಣಾರೆ ಕಂಡು ದಾಖಲಿಸಿದ. ಈ ಘಟನೆ ವಿಜಯನಗರದ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಬಗೆಗೂ ಸಾಕ್ಷಿಯಾಗುತ್ತದೆ.','The Timurid ambassador Abd al-Razzaq recorded the wealth of Hampi at first hand — witness to Vijayanagara’s international reach.'),
      narrative('events','event-vijayanagara-china-porcelain-trade','ಚೀನಾದ ಜಿಂಗ್ದೆಝೆನ್ ಪಿಂಗಾಣಿ ಹಂಪಿಗೆ ಬಂದ ಸಾಕ್ಷ್ಯ ಸಮುದ್ರ ವಾಣಿಜ್ಯ ಜಾಲದ ಅಂಚು. ಪೂರ್ವ ಮತ್ತು ದಕ್ಷಿಣ ಭಾರತದ ನಡುವಿನ ವ್ಯಾಪಾರ ಕೊಂಡಿ.','Chinese (Jingdezhen) porcelain reached Hampi along the maritime trade web — evidence of the commerce binding east and southern India.'),
      narrative('culturalHeritage','culture-hampi-mahanavami-dasara','ಮಹಾನವಮಿ-ದಸರಾ ವಿಜಯನಗರದ ಅರಮನೆಯ ಆಚರಣೆ. ಈ ಸಾಂಸ್ಕೃತಿಕ ದಾಖಲೆ ಹಂಪಿಯ ರಾಜಕೀಯ-ಧಾರ್ಮಿಕ ಪರಂಪರೆಯನ್ನು ತೋರಿಸುತ್ತದೆ.','Mahanavami and royal Dasara were Vijayanagara’s courtly festivals; this cultural record shows Hampi’s political and religious heritage.'),
      narrative('culturalHeritage','culture-hampi-vittala-complex','ವಿಟ್ಠಲ ದೇವಾಲಯ ಸಂಕೀರ್ಣ ಹಂಪಿಯ ವಾಸ್ತು ಪರಾಕಾಷ್ಠೆ — ರಥ, ಕಲ್ಲಿನ ಚಕ್ರ ಮತ್ತು ಸಂಗೀತ ಕಂಬಗಳಿಗೆ ಪ್ರಸಿದ್ಧ.','The Vittala Temple Complex is the architectural zenith of Hampi — famed for its stone chariot, wheels and musical pillars.'),
      narrative('culturalHeritage','culture-hampi-virupaksha-living-centre','ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ ಹಂಪಿಯಲ್ಲಿ ಇಂದಿಗೂ ಜೀವಂತ ಆರಾಧನಾ ಕೇಂದ್ರ. ಸ್ಮಾರಕವಾಗಿ ಮಾತ್ರವಲ್ಲ, ನಿರಂತರ ಭಕ್ತಿ ಸಂಪ್ರದಾಯವಾಗಿ.','The Virupaksha Temple remains a living centre of worship at Hampi — not just a monument but an unbroken tradition of devotion.'),
      narrative('people','person-krishnadevaraya','ಕೃಷ್ಣದೇವರಾಯ ವಿಜಯನಗರದ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ಚಕ್ರವರ್ತಿ (ಸು. 1509–1529). ಅವರ ಆಳ್ವಿಕೆಯಲ್ಲಿ ಸಾಮ್ರಾಜ್ಯ ಉತ್ತುಂಗಕ್ಕೆ ಏರಿತು.','Krishnadevaraya (r. c. 1509–1529) was Vijayanagara’s most celebrated emperor, under whom the empire reached its zenith.'),
      narrative('people','person-rama-raya','ಅಲಿಯ ರಾಮರಾಯ ತಾಳಿಕೋಟೆ ಯುದ್ಧದ ನಿರ್ಣಾಯಕ (ಮತ್ತು ವಿವಾದಿತ) ಗುರುತು. 1565ರಲ್ಲಿ ದಕ್ಷಿಣ ಸುಲ್ತಾನರ ಒಕ್ಕೂಟದ ವಿರುದ್ಧದ ಸೋಲು ಸಾಮ್ರಾಜ್ಯದ ಪತನಕ್ಕೆ ದಾರಿ ಮಾಡಿತು.','Aliya Rama Raya was the decisive (and contested) figure at Talikota — the 1565 defeat to the southern sultans’ league opened the empire’s fall.'),
      narrative('events','event-talikota','1565ರ ತಾಳಿಕೋಟೆ ಯುದ್ಧದಲ್ಲಿ ವಿಜಯನಗರ ದಕ್ಷಿಣ ಸುಲ್ತಾನರ ಒಕ್ಕೂಟಕ್ಕೆ ಸೋತಿತು. ಹಂಪಿ ಲೂಟಿಗೊಳಗಾದಾದ ಬಳಿಕ ಸಾಮ್ರಾಜ್ಯ ಕುಗ್ಗಿ ಹಲವು ದಶಕಗಳಲ್ಲಿ ಮರೆಯಾಯಿತು.','At Talikota in 1565 Vijayanagara fell to the league of southern sultans; after Hampi’s sack the empire shrank and faded over decades.'),
    ],
  },
  {
    id:'trail-freedom-movement',
    slug:'freedom-movement',
    era:'modern',
    yearRange:{from:1824,to:1947,era:'CE'},
    title:name('ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟ: ಕರ್ನಾಟಕದ ದನಿ','The Freedom Struggle: Karnataka’s Voice'),
    summary:name(
      'ಕಿತ್ತೂರಿನಿಂದ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣದವರೆಗೆ, ಸ್ಥಳೀಯ ಪ್ರತಿಭಟನೆಯಿಂದ ರಾಷ್ಟ್ರೀಯ ಚಳವಳಿಯವರೆಗೆ — ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದ ವ್ಯಕ್ತಿಗಳು ಮತ್ತು ಘಟನೆಗಳು.',
      'From Kittur to Sangolli Rayanna, from local resistance to the national movement — the people and events of Karnataka’s freedom struggle.'
    ),
    stops:[
      narrative('people','person-kittur-chennamma','1824ರಲ್ಲಿ ಬ್ರಿಟಿಷ್ ಆಕ್ರಮಣವನ್ನು ಎದುರಿಸಿದ ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ, ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದ ಮೊದಲ ಧ್ವನಿಗಳಲ್ಲಿ ಒಬ್ಬರು.','In 1824 Kittur Rani Chennamma defied the British — one of the earliest voices of resistance against colonial rule.'),
      narrative('events','event-kittur-resistance-1824','1824ರ ಕಿತ್ತೂರು ಪ್ರತಿರೋಧವು ರಾಜವರ್ಗದೊಳಗಿನ ಬಂಡಾಯವಲ್ಲ, ಅದಕ್ಕೂ ಮೀರಿದ ನಾಯಕತ್ವ ಜಾಲ. ಈ ಘಟನೆಯ ಪರಿಣಾಮ ರಾಣಿ ಚೆನ್ನಮ್ಮ ಮತ್ತು ರಾಯಣ್ಣರ ಹೋರಾಟಗಳನ್ನು ಜೋಡಿಸುತ್ತದೆ.','The Kittur resistance of 1824 was more than a royal revolt — a network of leadership beyond the ruling house, linking Chennamma and Rayanna’s later struggles.'),
      narrative('people','person-sangolli-rayanna','ಕಿತ್ತೂರಿನ ನಂತರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ ಸಶಸ್ತ್ರ ಪ್ರತಿಭಟನೆ ಮುಂದುವರಿಸಿದರು. ಅವರ ಹೋರಾಟ ಜನಪದ ಗೀತೆಗಳಲ್ಲಿ ಇಂದಿಗೂ ಜೀವಂತ.','After Kittur, Sangolli Rayanna continued armed resistance; his struggle lives on in folk songs today.'),
      narrative('people','person-gurusiddappa-kittur','ಕಿತ್ತೂರಿನ ಗುರುಸಿದ್ದಪ್ಪ ಪ್ರತಿರೋಧದ ಜಾಲದ ಪ್ರಮುಖ ಸಂಪರ್ಕ. ವ್ಯಕ್ತಿ-ಮಟ್ಟದ ದಾಖಲೆಗಳು ಸ್ಥಳೀಯ ಹೋರಾಟ ಪರಂಪರೆಯ ಆಳವನ್ನು ತೋರಿಸುತ್ತವೆ.','Gurusiddappa of Kittur was a key node in the resistance network; person-level records show how deep the local struggle ran.'),
      narrative('people','person-umabai-kundapur','ಉಮಾಬಾಯಿ ಕುಂದಾಪುರ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದಲ್ಲಿ ಮಹಿಳಾ ಕ್ರಿಯಾಶೀಲರ ನಿದರ್ಶನ. ಕರಾವಳಿ ಕರ್ನಾಟಕದಿಂದ ರಾಷ್ಟ್ರೀಯ ಚಳವಳಿಗೆ ಕೊಡುಗೆ.','Umabai Kundapur represents women’s activism in the struggle — a coastal Karnataka contribution to the national movement.'),
      narrative('events','event-independence','1947ರಲ್ಲಿ ಭಾರತ ಸ್ವಾತಂತ್ರ್ಯ ಪಡೆಯಿತು. ಈ ಘಟನೆಯು ಎಲ್ಲ ಹೋರಾಟದ ಪಥಗಳ ಏಕೀಕೃತ ಗುರಿಯಾಗಿತ್ತು.','In 1947 India gained independence — the shared goal that united every path of struggle.'),
    ],
  },
]