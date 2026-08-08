const name=(en,kn)=>({en,kn})
const review=status=>({status,reviewer:null,updatedAt:'2026-07-27'})

export const collaborations=[
  {
    id:'collaboration-patrika-sanchaya',name:name('Patrike Sanchaya','ಪತ್ರಿಕೆ ಸಂಚಯ'),entityKind:'organization',stage:'complete',
    collaborationType:'periodical-catalogue-and-digitisation',url:'https://patrike.sanchaya.net',
    contribution:name('Contributed the Kannada newspaper and magazine catalogue used for the Atlas periodicals layer. Future additions will be coordinated with ServantsOfKnowledge as additional newspapers and magazines are digitised.','ಅಟ್ಲಾಸ್ ಪತ್ರಿಕೆಗಳ ಪದರಕ್ಕೆ ಬಳಸಿದ ಕನ್ನಡ ಪತ್ರಿಕೆ ಮತ್ತು ಮಾಸಿಕೆಗಳ ಪಟ್ಟಿಯನ್ನು ಕೊಡುಗೆಯಾಗಿ ನೀಡಿದೆ. ಹೆಚ್ಚುವರಿ ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಮಾಸಿಕೆಗಳನ್ನು ಡಿಜಿಟಲೀಕರಿಸಿದಂತೆ ಸರ್ವೆಂಟ್ಸ್ ಆಫ್ ನಾಲೆಜ್ ಸಹಯೋಗದಲ್ಲಿ ಮುಂದಿನ ಸೇರ್ಪಡೆಗಳನ್ನು ಸಂಯೋಜಿಸಲಾಗುತ್ತದೆ.'),
    contactPath:'#research',review:review('published'),
  },
  {
    id:'collaboration-shashidhara-hg-hoysala-temples',name:name('Shashidhara HG — Hoysala temple documentation','ಶಶಿಧರ HG — ಹೊಯ್ಸಳ ದೇವಾಲಯ ದಾಖಲೀಕರಣ'),entityKind:'individual',stage:'complete',
    collaborationType:'heritage-dataset-contribution',url:'https://thesouthfirst.com/featured/preserving-history-bengaluru-man-documents-over-1500-hoysala-temples/',
    contribution:name('Credited contributor of the Offbeat Hoysala Temples KML research layer. The atlas preserves his dataset attribution and newspaper evidence while keeping each placemark as needs-review until temple identity, construction phase, protection status, managing authority, condition and item-level citations are independently resolved.','ಆಫ್‌ಬೀಟ್ ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳ KML ಸಂಶೋಧನಾ ಪದರದ ಕೊಡುಗೆದಾರರಿಗೆ ಕೃತಜ್ಞತೆ. ದೇವಾಲಯದ ಗುರುತು, ನಿರ್ಮಾಣ ಹಂತ, ರಕ್ಷಣಾ ಸ್ಥಿತಿ, ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ, ಸ್ಥಿತಿ ಮತ್ತು ವಸ್ತುಮಟ್ಟದ ಆಕರಗಳನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಹರಿಸುವವರೆಗೆ ಪ್ರತಿಯೊಂದು ಸ್ಥಳಚಿಹ್ನೆಯನ್ನು needs-review ಆಗಿಯೇ ಇಟ್ಟು, ಅವರ ಡೇಟಾಸೆಟ್ ಮತ್ತು ಪತ್ರಿಕಾ ಸಾಕ್ಷ್ಯವನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ.'),
    contactPath:'#research',review:review('published'),
  },
  {
    id:'collaboration-karnataka-itihasa-academy',name:name('Karnataka Itihasa Academy','ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಅಕಾದೆಮಿ'),entityKind:'organization',stage:'complete',
    collaborationType:'research-publication-and-digitisation',url:'https://karnatakaitihasaacademy.org/',
    contribution:name('Publisher and scholarly steward of the Itihasa Darshana research-paper volumes. The volumes are treated as citable printed sources; Internet Archive scans provide digital access and OCR discovery.','ಇತಿಹಾಸ ದರ್ಶನ ಸಂಶೋಧನಾ-ಪ್ರಬಂಧ ಸಂಪುಟಗಳ ಪ್ರಕಾಶಕ ಮತ್ತು ವಿದ್ವತ್ ಪಾಲಕ. ಸಂಪುಟಗಳನ್ನು ಉಲ್ಲೇಖಿಸಬಹುದಾದ ಮುದ್ರಿತ ಆಕರಗಳಾಗಿ ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ; ಇಂಟರ್ನೆಟ್ ಆರ್ಕೈವ್ ಸ್ಕ್ಯಾನ್‌ಗಳು ಡಿಜಿಟಲ್ ಪ್ರವೇಶ ಮತ್ತು OCR ಶೋಧನಾ ಸಹಾಯ ಒದಗಿಸುತ್ತವೆ.'),
    contactPath:'#research',review:review('published'),
  },
  {
    id:'collaboration-servants-of-knowledge-itihasa-darshana',name:name('ServantsOfKnowledge','ಸರ್ವೆಂಟ್ಸ್ ಆಫ್ ನಾಲೆಜ್'),entityKind:'organization',stage:'complete',
    collaborationType:'digitisation-and-public-access',url:'https://archive.org/details/ServantsOfKnowledge',
    contribution:name('Digitisation and public-access host for the Itihasa Darshana scans, including full-text OCR and HOCR files. The scan is cited as the digital host, not as a replacement for the printed volume or page locator.','ಇತಿಹಾಸ ದರ್ಶನ ಸ್ಕ್ಯಾನ್‌ಗಳ ಡಿಜಿಟಲೀಕರಣ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಪ್ರವೇಶ ಆತಿಥೇಯ; ಸಂಪೂರ್ಣ OCR ಮತ್ತು HOCR ಕಡತಗಳೂ ಲಭ್ಯ. ಸ್ಕ್ಯಾನ್ ಅನ್ನು ಮುದ್ರಿತ ಸಂಪುಟ ಅಥವಾ ಪುಟ ಸ್ಥಾನಸೂಚಿಗೆ ಪರ್ಯಾಯವಾಗಿ ಅಲ್ಲ, ಡಿಜಿಟಲ್ ಆತಿಥೇಯವಾಗಿ ಉಲ್ಲೇಖಿಸಬೇಕು.'),
    contactPath:'#research',review:review('published'),
  },
  {
    id:'collaboration-bharatrajya-research-resource',name:name('BharatRajya research resource','ಭಾರತರಾಜ್ಯ ಸಂಶೋಧನಾ ಸಂಪನ್ಮೂಲ'),entityKind:'organization',stage:'complete',
    collaborationType:'research-discovery-resource',url:'https://www.bharatrajya.com/',
    contribution:name('Acknowledged as a secondary discovery resource that helped identify neighbouring-state and timeline leads. Its summaries are not used as final citations; underlying primary, official or scholarly records must be located and independently verified.','ನೆರೆರಾಜ್ಯ ಮತ್ತು ಕಾಲರೇಖಾ ಸಂಶೋಧನಾ ದಾರಿಗಳನ್ನು ಗುರುತಿಸಲು ನೆರವಾದ ದ್ವಿತೀಯ ಶೋಧನಾ ಸಂಪನ್ಮೂಲವಾಗಿ ಕೃತಜ್ಞತೆ. ಇದರ ಸಾರಾಂಶಗಳನ್ನು ಅಂತಿಮ ಉಲ್ಲೇಖಗಳಾಗಿ ಬಳಸುವುದಿಲ್ಲ; ಮೂಲ ಪ್ರಾಥಮಿಕ, ಅಧಿಕೃತ ಅಥವಾ ವಿದ್ವತ್ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಬೇಕು.'),
    contactPath:'#research',review:review('published'),
  },
  {
    id:'collaboration-sanchaya-steward',name:name('Sanchaya','ಸಂಚಯ'),entityKind:'organization',stage:'steward',
    collaborationType:'platform-stewardship',url:'https://sanchaya.org/',
    contribution:name('Product stewardship, Kannada-first digital knowledge practice and community coordination.','ಉತ್ಪನ್ನದ ಮಾರ್ಗದರ್ಶನ, ಕನ್ನಡ-ಪ್ರಥಮ ಡಿಜಿಟಲ್ ಜ್ಞಾನ ಪದ್ಧತಿ ಮತ್ತು ಸಮುದಾಯ ಸಂಯೋಜನೆ.'),
    contactPath:'#community',review:review('published'),
  },
  {
    id:'collaboration-sanchi-foundation-steward',name:name('Sanchi Foundation','ಸಂಚಿ ಫೌಂಡೇಶನ್'),entityKind:'organization',stage:'steward',
    collaborationType:'institutional-stewardship',url:'https://sanchifoundation.org/',
    contribution:name('Institutional support for open knowledge, research partnerships and long-term public value.','ಮುಕ್ತ ಜ್ಞಾನ, ಸಂಶೋಧನಾ ಸಹಭಾಗಿತ್ವ ಮತ್ತು ದೀರ್ಘಕಾಲೀನ ಸಾರ್ವಜನಿಕ ಮೌಲ್ಯಕ್ಕೆ ಸಾಂಸ್ಥಿಕ ಬೆಂಬಲ.'),
    contactPath:'#community',review:review('published'),
  },
  {
    id:'collaboration-open-university-research',name:name('University research partnership','ವಿಶ್ವವಿದ್ಯಾಲಯ ಸಂಶೋಧನಾ ಸಹಯೋಗ'),entityKind:'university',stage:'open',
    collaborationType:'research-and-curriculum',
    contribution:name('District research, supervised student projects, corpus review, translations and curriculum use.','ಜಿಲ್ಲಾ ಸಂಶೋಧನೆ, ಮಾರ್ಗದರ್ಶಿತ ವಿದ್ಯಾರ್ಥಿ ಯೋಜನೆಗಳು, ಶಾಸನಸಂಪುಟ ಪರಿಶೀಲನೆ, ಅನುವಾದ ಮತ್ತು ಪಠ್ಯಕ್ರಮ ಬಳಕೆ.'),
    contactPath:'#community',review:review('published'),
  },
  {
    id:'collaboration-open-archives-museums',name:name('Archives, libraries and museums','ದಾಖಲೆಭಂಡಾರ, ಗ್ರಂಥಾಲಯ ಮತ್ತು ವಸ್ತುಸಂಗ್ರಹಾಲಯ'),entityKind:'organization',stage:'open',
    collaborationType:'collections-and-authority-data',
    contribution:name('Catalogue matching, protection registers, object histories, digitisation and reusable media permissions.','ಪಟ್ಟಿ ಹೊಂದಾಣಿಕೆ, ಸಂರಕ್ಷಣಾ ನೋಂದಣಿ, ವಸ್ತು ಇತಿಹಾಸ, ಡಿಜಿಟಲೀಕರಣ ಮತ್ತು ಮರುಬಳಕೆಯ ಮಾಧ್ಯಮ ಅನುಮತಿ.'),
    contactPath:'#community',review:review('published'),
  },
  {
    id:'collaboration-open-field-documentation',name:name('District field-documentation network','ಜಿಲ್ಲಾ ಕ್ಷೇತ್ರ-ದಾಖಲೀಕರಣ ಜಾಲ'),entityKind:'individual',stage:'open',
    collaborationType:'field-documentation',
    contribution:name('Dated photographs, coordinates, present-condition observations and local oral-history leads.','ದಿನಾಂಕಿತ ಛಾಯಾಚಿತ್ರ, ನಿರ್ದೇಶಾಂಕ, ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ ಅವಲೋಕನ ಮತ್ತು ಸ್ಥಳೀಯ ಮೌಖಿಕ ಇತಿಹಾಸದ ಸುಳಿವುಗಳು.'),
    contactPath:'#community',review:review('published'),
  },
  {
    id:'collaboration-open-scholarly-review',name:name('Independent scholarly review','ಸ್ವತಂತ್ರ ವಿದ್ವತ್ ಪರಿಶೀಲನೆ'),entityKind:'individual',stage:'open',
    collaborationType:'epigraphy-literature-translation',
    contribution:name('Item-level editions, transcription review, Kannada/English translation approval and historical interpretation.','ದಾಖಲೆಮಟ್ಟದ ಆವೃತ್ತಿ, ಲಿಪ್ಯಂತರ ಪರಿಶೀಲನೆ, ಕನ್ನಡ/ಇಂಗ್ಲಿಷ್ ಅನುವಾದ ಅನುಮೋದನೆ ಮತ್ತು ಐತಿಹಾಸಿಕ ವ್ಯಾಖ್ಯಾನ.'),
    contactPath:'#community',review:review('published'),
  },
  {
    id:'collaboration-prospective-state-archaeology',name:name('Prospective partner: Karnataka Archaeology, Museums and Heritage','ಸಂಭಾವ್ಯ ಸಹಭಾಗಿ: ಕರ್ನಾಟಕ ಪುರಾತತ್ವ, ವಸ್ತುಸಂಗ್ರಹಾಲಯಗಳು ಮತ್ತು ಪರಂಪರೆ'),entityKind:'organization',stage:'upcoming',
    collaborationType:'authority-register-and-field-verification',
    contribution:name('Confirm protected-register identities, managing authorities, monument coordinates and current condition for records sourced from public discovery pages. This is a proposed outreach role, not a confirmed partnership.','ಸಾರ್ವಜನಿಕ ಹುಡುಕಾಟ ಪುಟಗಳಿಂದ ಬಂದ ದಾಖಲೆಗಳಿಗೆ ಸಂರಕ್ಷಣಾ ನೋಂದಣಿ ಗುರುತು, ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ, ಸ್ಮಾರಕ ನಿರ್ದೇಶಾಂಕ ಮತ್ತು ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯನ್ನು ದೃಢೀಕರಿಸುವುದು. ಇದು ಪ್ರಸ್ತಾವಿತ ಸಂಪರ್ಕ ಪಾತ್ರ; ದೃಢಪಟ್ಟ ಸಹಭಾಗಿತ್ವವಲ್ಲ.'),
    contactPath:'#community',review:review('needs-review'),
  },
  {
    id:'collaboration-prospective-kannada-university',name:name('Prospective partner: Kannada University, Hampi and epigraphy departments','ಸಂಭಾವ್ಯ ಸಹಭಾಗಿ: ಕನ್ನಡ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಹಂಪಿ ಮತ್ತು ಶಾಸನ ಅಧ್ಯಯನ ವಿಭಾಗಗಳು'),entityKind:'university',stage:'upcoming',
    collaborationType:'student-corpus-and-translation-review',
    contribution:name('Supervise student teams to resolve wiki-derived candidates into corpus numbers, line transcriptions and independently reviewed Kannada translations. This is a proposed outreach role, not a confirmed partnership.','ವಿಕಿ-ಆಧಾರಿತ ಅಭ್ಯರ್ಥಿಗಳನ್ನು ಶಾಸನಸಂಪುಟ ಸಂಖ್ಯೆ, ಸಾಲು-ಸಾಲಿನ ಪಾಠ ಮತ್ತು ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಿದ ಕನ್ನಡ ಅನುವಾದಗಳಾಗಿ ರೂಪಿಸಲು ವಿದ್ಯಾರ್ಥಿ ತಂಡಗಳಿಗೆ ಮಾರ್ಗದರ್ಶನ. ಇದು ಪ್ರಸ್ತಾವಿತ ಸಂಪರ್ಕ ಪಾತ್ರ; ದೃಢಪಟ್ಟ ಸಹಭಾಗಿತ್ವವಲ್ಲ.'),
    contactPath:'#community',review:review('needs-review'),
  },
  {
    id:'collaboration-prospective-bengaluru-inscription-network',name:name('Prospective partner: Inscription Stones of Bengaluru and local documentation networks','ಸಂಭಾವ್ಯ ಸಹಭಾಗಿ: ಬೆಂಗಳೂರಿನ ಶಾಸನ ಕಲ್ಲುಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ದಾಖಲೀಕರಣ ಜಾಲಗಳು'),entityKind:'organization',stage:'upcoming',
    collaborationType:'community-geospatial-and-photography-review',url:'https://inscription-stones.mapunitygroups.com/',
    contribution:name('Coordinate locality-by-locality photographs, KML/map corrections, aliases, rediscoveries and permission-aware media contributions for the 25 Bengaluru wiki locality candidates. This is a proposed outreach role, not a confirmed partnership.','ಬೆಂಗಳೂರು ವಿಕಿ ಸ್ಥಳೀಯ 25 ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ಸ್ಥಳೀಯತೆಗನುಗುಣ ಛಾಯಾಚಿತ್ರ, KML/ನಕ್ಷೆ ತಿದ್ದುಪಡಿ, ಪರ್ಯಾಯ ಹೆಸರು, ಮರುಪತ್ತೆ ಮತ್ತು ಅನುಮತಿ-ಸಮ್ಮತ ಮಾಧ್ಯಮ ಕೊಡುಗೆಗಳನ್ನು ಸಂಯೋಜಿಸುವುದು. ಇದು ಪ್ರಸ್ತಾವಿತ ಸಂಪರ್ಕ ಪಾತ್ರ; ದೃಢಪಟ್ಟ ಸಹಭಾಗಿತ್ವವಲ್ಲ.'),
    contactPath:'#community',review:review('needs-review'),
  },
]
