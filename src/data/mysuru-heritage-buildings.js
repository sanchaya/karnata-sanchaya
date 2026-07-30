const n=(en,kn)=>({en,kn})
const review={status:'needs-review',reviewer:null,updatedAt:'2026-07-30'}

export const mysuruHeritageBuildingSources=[{
  id:'src-wikipedia-mysuru-heritage-buildings',type:'discovery-list',
  title:n('List of Heritage Buildings in Mysore','ಮೈಸೂರಿನ ಪರಂಪರೆ ಕಟ್ಟಡಗಳ ಪಟ್ಟಿ'),
  authors:['Wikipedia contributors'],year:null,
  url:'https://en.wikipedia.org/wiki/List_of_Heritage_Buildings_in_Mysore',
  scope:n('Discovery list only. Dates, legal designation, coordinates, ownership and condition require authority-level verification.','ಅನ್ವೇಷಣಾ ಪಟ್ಟಿ ಮಾತ್ರ. ದಿನಾಂಕ, ಕಾನೂನು ಮಾನ್ಯತೆ, ನಿರ್ದೇಶಾಂಕ, ಮಾಲೀಕತ್ವ ಮತ್ತು ಸ್ಥಿತಿಗೆ ಪ್ರಾಧಿಕಾರಮಟ್ಟದ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'),review
}]

const rows=[
  ['chittaranjan-palace','Chittaranjan Palace','ಚಿತ್ತರಂಜನ್ ಅರಮನೆ',1916,'palace-civic-architecture'],
  ['hardwick-high-school','Hardwick High School','ಹಾರ್ಡ್‌ವಿಕ್ ಪ್ರೌಢಶಾಲೆ',1840,'colonial-architecture'],
  ['maharajas-college','Maharaja’s College','ಮಹಾರಾಜ ಕಾಲೇಜು',1851,'colonial-architecture'],
  ['marimallappas-high-school','Marimallappa’s High School','ಮರಿಮಲ್ಲಪ್ಪ ಪ್ರೌಢಶಾಲೆ',1876,'colonial-architecture'],
  ['sadvidya-educational-institute','Sadvidya Educational Institute','ಸದ್ವಿದ್ಯಾ ಶಿಕ್ಷಣ ಸಂಸ್ಥೆ',1854,'colonial-architecture'],
  ['oriental-research-institute','Oriental Research Institute','ಪ್ರಾಚ್ಯವಿದ್ಯಾ ಸಂಶೋಧನಾ ಸಂಸ್ಥೆ',1887,'colonial-architecture'],
  ['crawford-hall','Crawford Hall','ಕ್ರಾಫರ್ಡ್ ಭವನ',1915,'colonial-architecture'],
  ['maharanis-college','Maharani’s College','ಮಹಾರಾಣಿ ಕಾಲೇಜು',1917,'colonial-architecture'],
  ['chamarajendra-technical-institute','Chamarajendra Technical Institute','ಚಾಮರಾಜೇಂದ್ರ ತಾಂತ್ರಿಕ ಸಂಸ್ಥೆ',1917,'colonial-architecture'],
  ['mysore-medical-college','Mysore Medical College','ಮೈಸೂರು ವೈದ್ಯಕೀಯ ಕಾಲೇಜು',1924,'colonial-architecture'],
  ['chamarajendra-ursu-boarding-school','Sri Chamarajendra Ursu Boarding School','ಶ್ರೀ ಚಾಮರಾಜೇಂದ್ರ ಅರಸು ಬೋರ್ಡಿಂಗ್ ಶಾಲೆ',null,'colonial-architecture'],
  ['yuvarajas-college','Yuvaraja’s College','ಯುವರಾಜ ಕಾಲೇಜು',1927,'colonial-architecture'],
  ['banumaiah-postgraduate-college','D. Banumaiah’s Post-Graduation College','ಡಿ. ಬಾನುಮಯ್ಯ ಸ್ನಾತಕೋತ್ತರ ಕಾಲೇಜು',1940,'colonial-architecture'],
  ['banumaiah-commerce-arts-college','D. Banumaiah’s College of Commerce and Arts','ಡಿ. ಬಾನುಮಯ್ಯ ವಾಣಿಜ್ಯ ಮತ್ತು ಕಲಾ ಕಾಲೇಜು',1940,'colonial-architecture'],
  ['deputy-commissioners-office','Deputy Commissioner’s Office','ಜಿಲ್ಲಾಧಿಕಾರಿ ಕಚೇರಿ',1840,'colonial-architecture'],
  ['public-offices','Public Offices','ಸಾರ್ವಜನಿಕ ಕಚೇರಿಗಳು',1895,'colonial-architecture'],
  ['law-court-buildings','Law Court Buildings','ನ್ಯಾಯಾಲಯ ಕಟ್ಟಡಗಳು',1899,'colonial-architecture'],
  ['mysuru-railway-station','Mysuru Railway Station','ಮೈಸೂರು ರೈಲು ನಿಲ್ದಾಣ',1870,'colonial-architecture'],
  ['lansdowne-building','Lansdowne Building','ಲ್ಯಾನ್ಸ್‌ಡೌನ್ ಕಟ್ಟಡ',1879,'colonial-architecture'],
  ['mysuru-town-hall','Mysuru Town Hall','ಮೈಸೂರು ಪುರಭವನ',1884,'colonial-architecture'],
  ['devaraja-market','Devaraja Market','ದೇವರಾಜ ಮಾರುಕಟ್ಟೆ',1886,'colonial-architecture'],
  ['cheluvamba-hospital','Cheluvamba Hospital','ಚೆಲುವಾಂಬ ಆಸ್ಪತ್ರೆ',1889,'colonial-architecture'],
  ['krishnarajendra-hospital','Krishnarajendra Hospital','ಕೃಷ್ಣರಾಜೇಂದ್ರ ಆಸ್ಪತ್ರೆ',1918,'colonial-architecture'],
  ['parakala-mutt','Parakala Mutt','ಪರಕಾಲ ಮಠ',1810,'monastery'],
  ['masjid-e-azam','Masjid-e-Azam','ಮಸೀದಿ-ಎ-ಆಝಂ',1925,'dargah']
]

export const mysuruHeritageBuildingLeads=rows.map(([slug,en,kn,year,category],index)=>({
  id:`heritage-inventory-mysuru-city-${slug}`,name:n(en,kn),translationStatus:'translated',
  recordKind:'inventory-lead',category,district:n('Mysuru','ಮೈಸೂರು'),locationLabel:'Mysuru city',
  date:year?{from:year,to:year,era:'CE',precision:'year'}:null,periodLabel:'Pre-Independence Mysuru',coordinates:null,
  registryId:`MYS-HB-${String(index+1).padStart(2,'0')}`,protectionLevel:'research-lead',
  heritageScope:'local-city-list',designationStatus:'unverified',
  placeIds:['place-mysuru'],polityIds:['polity-mysore'],peopleIds:[],eventIds:[],
  connectionNote:n('Linked to Mysuru city and the Mysore polity as historical context only; patron, architect, legal designation and institutional history require building-specific sources.','ಮೈಸೂರು ನಗರ ಮತ್ತು ಮೈಸೂರು ರಾಜ್ಯಕ್ಕೆ ಐತಿಹಾಸಿಕ ಸಂದರ್ಭವಾಗಿ ಮಾತ್ರ ಜೋಡಿಸಲಾಗಿದೆ; ಆಶ್ರಯದಾತ, ವಾಸ್ತುಶಿಲ್ಪಿ, ಕಾನೂನು ಮಾನ್ಯತೆ ಮತ್ತು ಸಂಸ್ಥೆಯ ಇತಿಹಾಸಕ್ಕೆ ಕಟ್ಟಡ-ನಿರ್ದಿಷ್ಟ ಆಕರಗಳು ಬೇಕು.'),
  sourceId:'src-wikipedia-mysuru-heritage-buildings',sourceUrl:'https://en.wikipedia.org/wiki/List_of_Heritage_Buildings_in_Mysore',sourceTable:1,sourceRow:index+1,
  description:n('Imported as a local heritage discovery record. Inclusion in this list is not proof of national or state protection.','ಸ್ಥಳೀಯ ಪರಂಪರೆ ಅನ್ವೇಷಣಾ ದಾಖಲೆಯಾಗಿ ಆಮದು ಮಾಡಲಾಗಿದೆ. ಈ ಪಟ್ಟಿಯಲ್ಲಿರುವುದೇ ರಾಷ್ಟ್ರೀಯ ಅಥವಾ ರಾಜ್ಯ ರಕ್ಷಣೆಯ ಸಾಕ್ಷ್ಯವಲ್ಲ.'),
  citations:[{sourceId:'src-wikipedia-mysuru-heritage-buildings',locator:`Pre-Independence edifices table; imported missing record ${index+1}`}],review:{...review}
}))
