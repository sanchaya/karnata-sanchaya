const n=(en,kn)=>({en,kn})
const date=(from,precision='year')=>({from,to:from,era:'CE',precision})
const wiki=(title,url)=>({title,url,kind:'reference-page',accessedAt:'2026-07-26'})
const photo=(url,sourceUrl,credit='Wikimedia Commons contributor')=>({url,sourceUrl,credit,licenseStatus:'verify-on-commons-file-page'})

export const heritageDirectVerification={
  'candidate-chikkamagaluru-2':{
    verificationStatus:'identified',externalIds:{},coordinates:null,constructionPhases:[],protectionStatus:[],managingAuthorities:[],administrativeAreas:[],photographs:[],
    siteCitations:[{title:'Karnataka Tourism — Chikkamagaluru trails',url:'https://karnatakatourism.org/en/experiences/top-places-to-see-in-chikkamagalur',kind:'official-tourism-page',accessedAt:'2026-07-26'}],
    verificationNote:n('Ballalarayana Durga is confirmed in the official state tourism discovery source. Monument coordinates, phases, protection and management still require primary-record verification.','ಬಲ್ಲಾಳರಾಯನ ದುರ್ಗವನ್ನು ರಾಜ್ಯದ ಅಧಿಕೃತ ಪ್ರವಾಸೋದ್ಯಮ ಪರಿಚಯ ಆಕರದಲ್ಲಿ ದೃಢಪಡಿಸಲಾಗಿದೆ. ಸ್ಮಾರಕದ ನಿರ್ದೇಶಾಂಕ, ನಿರ್ಮಾಣ ಹಂತ, ರಕ್ಷಣಾ ಸ್ಥಿತಿ ಮತ್ತು ನಿರ್ವಹಣೆಯನ್ನು ಪ್ರಾಥಮಿಕ ದಾಖಲೆಗಳಿಂದ ಇನ್ನೂ ಪರಿಶೀಲಿಸಬೇಕು.'),lastVerified:'2026-07-26'
  },
  'candidate-koppal-2':{
    verificationStatus:'partially-verified',externalIds:{wikipedia:'Mahadeva_Temple,_Itagi'},coordinates:{latitude:15.49,longitude:75.995,precision:'site'},
    constructionPhases:[],
    protectionStatus:[{designation:n('Centrally protected monument (Mahadeva Temple, Itagi)','ಕೇಂದ್ರ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕ (ಇಟಗಿ ಮಹಾದೇವ ದೇವಾಲಯ)'),authority:n('Archaeological Survey of India / National Monuments Authority','ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ / ರಾಷ್ಟ್ರೀಯ ಸ್ಮಾರಕ ಪ್ರಾಧಿಕಾರ'),sourceUrl:'https://nma.gov.in/showfile.php?lang=1&level=1&lid=1998&ls_id=1612&nma_type=0'}],
    managingAuthorities:[{name:n('Archaeological Survey of India — Bengaluru Circle','ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ — ಬೆಂಗಳೂರು ವೃತ್ತ'),role:'statutory-protection',sourceUrl:'https://nma.gov.in/showfile.php?lang=1&level=1&lid=1998&ls_id=1612&nma_type=0'}],administrativeAreas:[],
    photographs:[photo('https://upload.wikimedia.org/wikipedia/commons/f/f2/Rear_view_showing_lateral_entrances_of_the_Mahadeva_Temple_at_Itagi_in_the_Koppal_district.JPG','https://commons.wikimedia.org/wiki/File:Rear_view_showing_lateral_entrances_of_the_Mahadeva_Temple_at_Itagi_in_the_Koppal_district.JPG')],
    siteCitations:[wiki('Mahadeva Temple, Itagi — reference and coordinates','https://en.wikipedia.org/wiki/Mahadeva_Temple,_Itagi'),{title:'National Monuments Authority — Mahadeva Temple, Itagi',url:'https://nma.gov.in/showfile.php?lang=1&level=1&lid=1998&ls_id=1612&nma_type=0',kind:'official-protection-record',accessedAt:'2026-07-26'}],
    verificationNote:n('The site identity, point and central protection record are linked. Construction phases and the Commons file licence need a second evidence pass.','ಸ್ಥಳದ ಗುರುತು, ಬಿಂದು ಮತ್ತು ಕೇಂದ್ರ ರಕ್ಷಣಾ ದಾಖಲೆಗಳನ್ನು ಜೋಡಿಸಲಾಗಿದೆ. ನಿರ್ಮಾಣ ಹಂತಗಳು ಮತ್ತು ಕಾಮನ್ಸ್ ಚಿತ್ರದ ಪರವಾನಗಿಗೆ ಎರಡನೇ ಸಾಕ್ಷ್ಯ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'),lastVerified:'2026-07-26'
  },
  'candidate-mandya-1':{
    verificationStatus:'partially-verified',externalIds:{wikipedia:'Tipu_Sultan_Fort'},coordinates:{latitude:12.425,longitude:76.676,precision:'site'},
    constructionPhases:[{name:n('Initial fort attributed to Timmanna Nayaka','ತಿಮ್ಮಣ್ಣ ನಾಯಕನಿಗೆ ಸೇರಿಸಲಾದ ಆರಂಭಿಕ ಕೋಟೆ'),date:date(1454)},{name:n('Hyder Ali and Tipu Sultan modifications and late-18th-century fortification','ಹೈದರ್ ಅಲಿ ಮತ್ತು ಟಿಪ್ಪು ಸುಲ್ತಾನರ ಬದಲಾವಣೆ ಹಾಗೂ 18ನೇ ಶತಮಾನದ ಅಂತ್ಯದ ಕೋಟೆಬಲಪಡಿಕೆ'),date:{from:1761,to:1799,era:'CE',precision:'range'}}],
    protectionStatus:[{designation:n('Protected fort components recorded under ASI Bengaluru Circle','ASI ಬೆಂಗಳೂರು ವೃತ್ತದಡಿ ದಾಖಲಾದ ಸಂರಕ್ಷಿತ ಕೋಟೆ ಭಾಗಗಳು'),authority:n('Archaeological Survey of India','ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ'),sourceUrl:'https://tourism.gov.in/sites/default/files/2019-10/usq%204580%20for%2022072019.pdf'}],
    managingAuthorities:[{name:n('Archaeological Survey of India — Bengaluru Circle','ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ — ಬೆಂಗಳೂರು ವೃತ್ತ'),role:'protected-components',sourceUrl:'https://tourism.gov.in/sites/default/files/2019-10/usq%204580%20for%2022072019.pdf'}],administrativeAreas:[],
    photographs:[photo('https://upload.wikimedia.org/wikipedia/commons/e/e3/Srirangapatnam_Fort_5.JPG','https://commons.wikimedia.org/wiki/File:Srirangapatnam_Fort_5.JPG')],
    siteCitations:[wiki('Tipu Sultan Fort — reference, phases and coordinates','https://en.wikipedia.org/wiki/Tipu_Sultan_Fort'),{title:'Karnataka Tourism — Srirangapatna',url:'https://karnatakatourism.org/en/destinations/srirangapatna',kind:'official-tourism-page',accessedAt:'2026-07-26'},{title:'Government of India — ASI Bengaluru Circle protected monuments list',url:'https://tourism.gov.in/sites/default/files/2019-10/usq%204580%20for%2022072019.pdf',kind:'official-protection-list',accessedAt:'2026-07-26'}],
    verificationNote:n('The mapped point and phase summary identify the fort precinct. The protection statement intentionally applies only to components named in the ASI list.','ನಕ್ಷೆಯ ಬಿಂದು ಮತ್ತು ಹಂತಗಳ ಸಾರಾಂಶವು ಕೋಟೆ ಪರಿಸರವನ್ನು ಗುರುತಿಸುತ್ತದೆ. ರಕ್ಷಣಾ ಹೇಳಿಕೆಯು ASI ಪಟ್ಟಿಯಲ್ಲಿ ಹೆಸರಿಸಲಾದ ಭಾಗಗಳಿಗೆ ಮಾತ್ರ ಅನ್ವಯಿಸುತ್ತದೆ.'),lastVerified:'2026-07-26'
  },
  'candidate-mandya-2':{
    verificationStatus:'identified',externalIds:{wikipedia:'Colonel_Bailey%27s_Dungeon'},coordinates:null,constructionPhases:[],
    protectionStatus:[{designation:n('Centrally protected monument','ಕೇಂದ್ರ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕ'),authority:n('Archaeological Survey of India','ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ'),sourceUrl:'https://tourism.gov.in/sites/default/files/2019-10/usq%204580%20for%2022072019.pdf'}],
    managingAuthorities:[{name:n('Archaeological Survey of India — Bengaluru Circle','ಭಾರತೀಯ ಪುರಾತತ್ವ ಸರ್ವೇಕ್ಷಣ — ಬೆಂಗಳೂರು ವೃತ್ತ'),role:'statutory-protection',sourceUrl:'https://tourism.gov.in/sites/default/files/2019-10/usq%204580%20for%2022072019.pdf'}],administrativeAreas:[],
    photographs:[photo('https://upload.wikimedia.org/wikipedia/commons/e/ec/Colonel_Bailey%27s_Dungeon_-_Ground_View.jpg','https://commons.wikimedia.org/wiki/File:Colonel_Bailey%27s_Dungeon_-_Ground_View.jpg')],
    siteCitations:[wiki("Colonel Bailey's Dungeon — reference",'https://en.wikipedia.org/wiki/Colonel_Bailey%27s_Dungeon'),{title:'Karnataka Tourism — Srirangapatna',url:'https://karnatakatourism.org/en/destinations/srirangapatna',kind:'official-tourism-page',accessedAt:'2026-07-26'},{title:'Government of India — ASI Bengaluru Circle protected monuments list',url:'https://tourism.gov.in/sites/default/files/2019-10/usq%204580%20for%2022072019.pdf',kind:'official-protection-list',accessedAt:'2026-07-26'}],
    verificationNote:n('Identity, photograph and protection are linked. A monument-specific coordinate remains pending rather than borrowing the general fort point.','ಗುರುತು, ಚಿತ್ರ ಮತ್ತು ರಕ್ಷಣಾ ದಾಖಲೆಯನ್ನು ಜೋಡಿಸಲಾಗಿದೆ. ಸಾಮಾನ್ಯ ಕೋಟೆ ಬಿಂದುವನ್ನು ಬಳಸದೆ ಸ್ಮಾರಕ-ನಿರ್ದಿಷ್ಟ ನಿರ್ದೇಶಾಂಕವನ್ನು ಬಾಕಿ ಇಡಲಾಗಿದೆ.'),lastVerified:'2026-07-26'
  },
  'candidate-mysuru-1':{
    verificationStatus:'partially-verified',externalIds:{wikipedia:'St._Philomena%27s_Cathedral,_Mysore'},coordinates:{latitude:12.32113889,longitude:76.65827778,precision:'site'},constructionPhases:[],protectionStatus:[],
    managingAuthorities:[{name:n("St Philomena's Cathedral, Mysuru",'ಸೇಂಟ್ ಫಿಲೋಮಿನಾ ಕ್ಯಾಥೆಡ್ರಲ್, ಮೈಸೂರು'),role:'site-history-publisher',sourceUrl:'https://mysorestphilomenachurch.com/history/'}],administrativeAreas:[],
    photographs:[photo('https://upload.wikimedia.org/wikipedia/commons/d/d4/India_-_St._Philomena%27s_Church_02.jpg','https://commons.wikimedia.org/wiki/File:India_-_St._Philomena%27s_Church_02.jpg')],
    siteCitations:[wiki("St Philomena's Cathedral — reference and coordinates",'https://en.wikipedia.org/wiki/St._Philomena%27s_Cathedral,_Mysore'),{title:'Mysuru district — St Philomena’s Church',url:'https://mysore.nic.in/en/tourist-place/st-philomenas-church/',kind:'district-government-page',accessedAt:'2026-07-26'},{title:'Cathedral official history',url:'https://mysorestphilomenachurch.com/history/',kind:'managing-site-page',accessedAt:'2026-07-26'}],
    verificationNote:n('The site point, image, district-government record and cathedral history page are linked. Formal protection status remains unverified.','ಸ್ಥಳದ ಬಿಂದು, ಚಿತ್ರ, ಜಿಲ್ಲಾ ಸರ್ಕಾರಿ ದಾಖಲೆ ಮತ್ತು ಕ್ಯಾಥೆಡ್ರಲ್ ಇತಿಹಾಸ ಪುಟವನ್ನು ಜೋಡಿಸಲಾಗಿದೆ. ಅಧಿಕೃತ ರಕ್ಷಣಾ ಸ್ಥಿತಿ ಇನ್ನೂ ಪರಿಶೀಲನೆಯಾಗಿಲ್ಲ.'),lastVerified:'2026-07-26'
  },
  'candidate-raichur-2':{
    verificationStatus:'partially-verified',externalIds:{wikipedia:'Mudgal'},coordinates:{latitude:16.02,longitude:76.43,precision:'settlement'},constructionPhases:[],protectionStatus:[],managingAuthorities:[],administrativeAreas:[],
    photographs:[photo('https://upload.wikimedia.org/wikipedia/commons/4/4b/Mudgal_fort_3.jpg','https://commons.wikimedia.org/wiki/File:Mudgal_fort_3.jpg')],siteCitations:[wiki('Mudgal — settlement reference and fort photograph','https://en.wikipedia.org/wiki/Mudgal')],
    verificationNote:n('The coordinate is explicitly a settlement-level point, not a surveyed fort centroid. Monument phases, protection and authority remain pending.','ಈ ನಿರ್ದೇಶಾಂಕವು ವಸತಿ-ಮಟ್ಟದ ಬಿಂದು; ಸಮೀಕ್ಷಿತ ಕೋಟೆಯ ಕೇಂದ್ರಬಿಂದು ಅಲ್ಲ. ಸ್ಮಾರಕದ ಹಂತಗಳು, ರಕ್ಷಣೆ ಮತ್ತು ಪ್ರಾಧಿಕಾರ ಇನ್ನೂ ಬಾಕಿಯಿವೆ.'),lastVerified:'2026-07-26'
  },
  'candidate-udupi-2':{
    verificationStatus:'identified',externalIds:{wikipedia:'Chaturmukha_Basadi'},coordinates:null,constructionPhases:[],protectionStatus:[],managingAuthorities:[],administrativeAreas:[],photographs:[],siteCitations:[wiki('Chaturmukha Basadi — disambiguation lead','https://en.wikipedia.org/wiki/Chaturmukha_Basadi')],
    verificationNote:n('The Karkala monument lead is retained, but a stronger site-specific authority is required before adding coordinates, dates or protection claims.','ಕಾರ್ಕಳದ ಸ್ಮಾರಕ ಸುಳಿವನ್ನು ಉಳಿಸಲಾಗಿದೆ; ನಿರ್ದೇಶಾಂಕ, ದಿನಾಂಕ ಅಥವಾ ರಕ್ಷಣಾ ಹೇಳಿಕೆ ಸೇರಿಸುವ ಮೊದಲು ಬಲವಾದ ಸ್ಥಳ-ನಿರ್ದಿಷ್ಟ ಅಧಿಕೃತ ಆಕರ ಅಗತ್ಯ.'),lastVerified:'2026-07-26'
  },
  'candidate-uttara-kannada-1':{
    verificationStatus:'partially-verified',externalIds:{wikipedia:'Mahabaleshwar_Temple,_Gokarna'},coordinates:{latitude:14.54333333,longitude:74.31638889,precision:'site'},
    constructionPhases:[{name:n('Mahabaleshwar Temple tradition/reference date','ಮಹಾಬಲೇಶ್ವರ ದೇವಾಲಯದ ಪರಂಪರೆ/ಉಲ್ಲೇಖ ದಿನಾಂಕ'),date:date(4,'century')}],protectionStatus:[],managingAuthorities:[],administrativeAreas:[],
    photographs:[photo('https://upload.wikimedia.org/wikipedia/commons/6/66/Main_entry_to_the_Mahabaleshwar_Temple_at_Gokaran.jpg','https://commons.wikimedia.org/wiki/File:Main_entry_to_the_Mahabaleshwar_Temple_at_Gokaran.jpg')],siteCitations:[wiki('Mahabaleshwar Temple, Gokarna — reference and coordinates','https://en.wikipedia.org/wiki/Mahabaleshwar_Temple,_Gokarna')],
    verificationNote:n('This point represents Mahabaleshwar Temple within the wider Gokarna temple landscape. The 4th-century attribution is retained as a reference claim, not a complete fabric chronology.','ಈ ಬಿಂದು ವಿಶಾಲ ಗೋಕರ್ಣ ದೇವಾಲಯ ಭೂದೃಶ್ಯದಲ್ಲಿನ ಮಹಾಬಲೇಶ್ವರ ದೇವಾಲಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ. 4ನೇ ಶತಮಾನದ ಉಲ್ಲೇಖವನ್ನು ಸಂಪೂರ್ಣ ವಾಸ್ತುಕಾಲಕ್ರಮವಲ್ಲದೆ ಆಕರದ ಹೇಳಿಕೆಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.'),lastVerified:'2026-07-26'
  }
}
