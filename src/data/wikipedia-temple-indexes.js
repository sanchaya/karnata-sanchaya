const name = (en, kn) => ({ en, kn })
const review = { status: 'needs-review', reviewer: null, updatedAt: '2026-07-30' }

export const wikipediaTempleIndexSources = [
  ['src-wikipedia-vijayanagara-temples-karnataka','List of Vijayanagara era temples in Karnataka','ಕರ್ನಾಟಕದ ವಿಜಯನಗರ ಕಾಲದ ದೇವಾಲಯಗಳ ಪಟ್ಟಿ','https://en.wikipedia.org/wiki/List_of_Vijayanagara_era_temples_in_Karnataka'],
  ['src-wikipedia-hoysala-temples','List of Hoysala temples','ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳ ಪಟ್ಟಿ','https://en.wikipedia.org/wiki/List_of_Hoysala_temples'],
  ['src-wikipedia-western-chalukya-temples','Western Chalukya temples','ಪಶ್ಚಿಮ ಚಾಲುಕ್ಯ ದೇವಾಲಯಗಳು','https://en.wikipedia.org/wiki/Western_Chalukya_temples'],
  ['src-wikipedia-badami-chalukya-architecture','Badami Chalukya architecture','ಬಾದಾಮಿ ಚಾಲುಕ್ಯ ವಾಸ್ತುಶಿಲ್ಪ','https://en.wikipedia.org/wiki/Badami_Chalukya_architecture'],
  ['src-wikipedia-kadamba-architecture','Kadamba architecture','ಕದಂಬ ವಾಸ್ತುಶಿಲ್ಪ','https://en.wikipedia.org/wiki/Kadamba_architecture'],
  ['src-wikipedia-temples-karnataka','Temples of Karnataka','ಕರ್ನಾಟಕದ ದೇವಾಲಯಗಳು','https://en.wikipedia.org/wiki/Temples_of_Karnataka'],
].map(([id,en,kn,url])=>({
  id,type:'discovery-index',title:name(en,kn),authors:['Wikipedia contributors'],year:null,url,
  scope:name('Discovery index only. Individual dates, patrons, coordinates, protection status and present condition must be checked against authority records and item-level scholarship before promotion.','ಅನ್ವೇಷಣಾ ಸೂಚಿ ಮಾತ್ರ. ಪ್ರತಿ ದಾಖಲೆಯ ದಿನಾಂಕ, ಆಶ್ರಯದಾತ, ನಿರ್ದೇಶಾಂಕ, ಸಂರಕ್ಷಣಾ ಸ್ಥಿತಿ ಮತ್ತು ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿಯನ್ನು ಉತ್ತೇಜಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ದಾಖಲೆ ಮತ್ತು ವಸ್ತುಮಟ್ಟದ ಸಂಶೋಧನೆಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.'),review,
}))

const sourceId='src-wikipedia-vijayanagara-temples-karnataka'
const templeTradition=title=>/jain|basadi/i.test(title)?'Jaina':/rama|kanakachalapathi|ranganatha/i.test(title)?'Vaishnava':'Shaiva'
const candidates = [
  ['someshwara-kolar','Someshwara Temple — Kolar','ಕೋಲಾರದ ಸೋಮೇಶ್ವರ ದೇವಾಲಯ','Kolar','ಕೋಲಾರ',1300,1399,'century'],
  ['vidyashankara-sringeri','Vidyashankara Temple — Sringeri','ಶೃಂಗೇರಿಯ ವಿದ್ಯಾಶಂಕರ ದೇವಾಲಯ','Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು',1500,1599,'century'],
  ['ganagitti-hampi','Ganagitti Jain Temple — Hampi','ಹಂಪಿಯ ಗಾಣಗಿತ್ತಿ ಜೈನ ದೇವಾಲಯ','Vijayanagara','ವಿಜಯನಗರ',1385,1385,'year'],
  ['hazara-rama-hampi','Hazara Rama Temple — Hampi','ಹಂಪಿಯ ಹಜಾರ ರಾಮ ದೇವಾಲಯ','Vijayanagara','ವಿಜಯನಗರ',1406,1542,'range'],
  ['gavi-gangadhareshwara-bengaluru','Gavi Gangadhareshwara Temple — Bengaluru','ಬೆಂಗಳೂರಿನ ಗವಿ ಗಂಗಾಧರೇಶ್ವರ ದೇವಾಲಯ','Bengaluru Urban','ಬೆಂಗಳೂರು ನಗರ',1500,1599,'century'],
  ['aghoreshwara-ikkeri','Aghoreshwara Temple — Ikkeri','ಇಕ್ಕೇರಿಯ ಅಘೋರೇಶ್ವರ ದೇವಾಲಯ','Shivamogga','ಶಿವಮೊಗ್ಗ',1566,1570,'range'],
  ['rameshwara-keladi','Rameshwara Temple — Keladi','ಕೆಳದಿಯ ರಾಮೇಶ್ವರ ದೇವಾಲಯ','Shivamogga','ಶಿವಮೊಗ್ಗ',1499,1530,'range'],
  ['bhoga-nandishwara-nandi','Bhoga Nandishwara Temple additions — Nandi','ನಂದಿಯ ಭೋಗ ನಂದೀಶ್ವರ ದೇವಾಲಯದ ಸೇರ್ಪಡೆಗಳು','Chikkaballapura','ಚಿಕ್ಕಬಳ್ಳಾಪುರ',1400,1499,'century'],
  ['kanakachalapathi-kanakagiri','Kanakachalapathi Temple — Kanakagiri','ಕನಕಗಿರಿಯ ಕನಕಾಚಲಪತಿ ದೇವಾಲಯ','Koppal','ಕೊಪ್ಪಳ',1509,1529,'range'],
  ['ranganatha-magadi','Ranganatha Temple gateway — Magadi','ಮಾಗಡಿಯ ರಂಗನಾಥ ದೇವಾಲಯದ ಗೋಪುರ','Ramanagara','ರಾಮನಗರ',1524,1524,'circa'],
  ['chaturmukha-basadi-karkala','Chaturmukha Basadi — Karkala','ಕಾರ್ಕಳದ ಚತುರ್ಮುಖ ಬಸದಿ','Udupi','ಉಡುಪಿ',1586,1587,'range'],
  ['parshwanatha-basadi-gerusoppa','Parshwanatha Basadi — Gerusoppa','ಗೇರುಸೊಪ್ಪದ ಪಾರ್ಶ್ವನಾಥ ಬಸದಿ','Uttara Kannada','ಉತ್ತರ ಕನ್ನಡ',1581,1581,'year'],
]

export const wikipediaTempleInventoryLeads = candidates.map(([slug,en,kn,districtEn,districtKn,from,to,precision],index)=>({
  id:`temple-inventory-wikipedia-vijayanagara-${slug}`,name:name(en,kn),deity:en.split(' — ')[0],locationLabel:en.split(' — ')[1]||districtEn,district:name(districtEn,districtKn),taluk:name('Research pending','ಸಂಶೋಧನೆ ಬಾಕಿ'),tradition:templeTradition(en),
  date:{from,to,era:'CE',precision},polityIds:['polity-vijayanagara'],sourceDataset:'Wikipedia Vijayanagara-era temple discovery index',
  description:name('District-level discovery candidate. Coordinates, construction phase, patron, protection status and present condition are not yet authority-confirmed.','ಜಿಲ್ಲಾಮಟ್ಟದ ಅನ್ವೇಷಣಾ ಅಭ್ಯರ್ಥಿ. ನಿರ್ದೇಶಾಂಕ, ನಿರ್ಮಾಣ ಹಂತ, ಆಶ್ರಯದಾತ, ಸಂರಕ್ಷಣಾ ಸ್ಥಿತಿ ಮತ್ತು ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿ ಇನ್ನೂ ಅಧಿಕೃತವಾಗಿ ದೃಢಪಟ್ಟಿಲ್ಲ.'),
  citations:[{sourceId,locator:`Table row ${index+1}; discovery lead only`}],review,
}))

const heritagePages = [
  ['chola-bengaluru','List of Chola temples in Bengaluru','ಬೆಂಗಳೂರಿನ ಚೋಳ ದೇವಾಲಯಗಳ ಪಟ್ಟಿ','https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bengaluru'],
  ['vijayanagara-karnataka','List of Vijayanagara era temples in Karnataka','ಕರ್ನಾಟಕದ ವಿಜಯನಗರ ಕಾಲದ ದೇವಾಲಯಗಳ ಪಟ್ಟಿ','https://en.wikipedia.org/wiki/List_of_Vijayanagara_era_temples_in_Karnataka'],
  ['hoysala','List of Hoysala temples','ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳ ಪಟ್ಟಿ','https://en.wikipedia.org/wiki/List_of_Hoysala_temples'],
  ['western-chalukya','Western Chalukya temples','ಪಶ್ಚಿಮ ಚಾಲುಕ್ಯ ದೇವಾಲಯಗಳು','https://en.wikipedia.org/wiki/Western_Chalukya_temples'],
  ['mysore-buildings','Religious buildings and structures of the Kingdom of Mysore','ಮೈಸೂರು ಸಂಸ್ಥಾನದ ಧಾರ್ಮಿಕ ಕಟ್ಟಡಗಳು ಮತ್ತು ಇತರ ರಚನೆಗಳು','https://en.wikipedia.org/wiki/List_of_religious_buildings_and_structures_of_the_Kingdom_of_Mysore'],
  ['state-i','State Protected Monuments in Karnataka — Part I','ಕರ್ನಾಟಕ ರಾಜ್ಯ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕಗಳು — ಭಾಗ I','https://en.wikipedia.org/wiki/List_of_State_Protected_Monuments_in_Karnataka'],
  ['state-ii','State Protected Monuments in Karnataka — Part II','ಕರ್ನಾಟಕ ರಾಜ್ಯ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕಗಳು — ಭಾಗ II','https://en.wikipedia.org/wiki/List_of_State_Protected_Monuments_in_Karnataka_Part_II'],
  ['national-bangalore','National Monuments — Bengaluru Circle','ರಾಷ್ಟ್ರೀಯ ಮಹತ್ವದ ಸ್ಮಾರಕಗಳು — ಬೆಂಗಳೂರು ವಲಯ','https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_Bangalore_circle'],
  ['national-belgaum','National Monuments — Belagavi district','ರಾಷ್ಟ್ರೀಯ ಮಹತ್ವದ ಸ್ಮಾರಕಗಳು — ಬೆಳಗಾವಿ ಜಿಲ್ಲೆ','https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_Belgaum_district'],
  ['national-bidar','National Monuments — Bidar district','ರಾಷ್ಟ್ರೀಯ ಮಹತ್ವದ ಸ್ಮಾರಕಗಳು — ಬೀದರ್ ಜಿಲ್ಲೆ','https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_Bidar_district'],
  ['national-bagalkot-bijapur','National Monuments — Bagalkot and Vijayapura','ರಾಷ್ಟ್ರೀಯ ಮಹತ್ವದ ಸ್ಮಾರಕಗಳು — ಬಾಗಲಕೋಟೆ ಮತ್ತು ವಿಜಯಪುರ','https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_Bagalkot_and_Bijapur_district,_Karnataka'],
  ['national-dharwad','National Monuments — Dharwad district','ರಾಷ್ಟ್ರೀಯ ಮಹತ್ವದ ಸ್ಮಾರಕಗಳು — ಧಾರವಾಡ ಜಿಲ್ಲೆ','https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_Dharwad_district'],
  ['national-gulbarga','National Monuments — Kalaburagi district','ರಾಷ್ಟ್ರೀಯ ಮಹತ್ವದ ಸ್ಮಾರಕಗಳು — ಕಲಬುರಗಿ ಜಿಲ್ಲೆ','https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_Gulbarga_district'],
  ['national-north-kanara','National Monuments — Uttara Kannada district','ರಾಷ್ಟ್ರೀಯ ಮಹತ್ವದ ಸ್ಮಾರಕಗಳು — ಉತ್ತರ ಕನ್ನಡ ಜಿಲ್ಲೆ','https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_North_Kanara_district'],
  ['national-raichur','National Monuments — Raichur district','ರಾಷ್ಟ್ರೀಯ ಮಹತ್ವದ ಸ್ಮಾರಕಗಳು — ರಾಯಚೂರು ಜಿಲ್ಲೆ','https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_Raichur_district'],
]

export const wikipediaHeritageSources = heritagePages.map(([key,en,kn,url])=>({
  id:`src-wikipedia-heritage-${key}`,type:'discovery-index',title:name(en,kn),authors:['Wikipedia contributors'],year:null,url,
  scope:name('Bulk list used for candidate discovery and register reconciliation. Wikipedia is not treated as the final authority; each record remains needs-review until matched to the responsible protection register and item-level evidence.','ಅಭ್ಯರ್ಥಿ ಅನ್ವೇಷಣೆ ಮತ್ತು ಸಂರಕ್ಷಣಾ ಪಟ್ಟಿಗಳ ಹೊಂದಾಣಿಕೆಗೆ ಬಳಸಿದ ದೊಡ್ಡ ಪಟ್ಟಿ. ವಿಕಿಪೀಡಿಯವನ್ನು ಅಂತಿಮ ಪ್ರಾಧಿಕಾರವೆಂದು ಪರಿಗಣಿಸಲಾಗುವುದಿಲ್ಲ; ಹೊಣೆಗಾರ ಸಂರಕ್ಷಣಾ ಪಟ್ಟಿ ಮತ್ತು ವಸ್ತುಮಟ್ಟದ ಸಾಕ್ಷ್ಯದೊಂದಿಗೆ ಹೊಂದುವವರೆಗೆ ಪ್ರತಿ ದಾಖಲೆ ಪರಿಶೀಲನೆ ಬಾಕಿಯೇ ಇರುತ್ತದೆ.'),review,
}))

export const wikipediaHeritageInventoryLeads = wikipediaHeritageInventory
import wikipediaHeritageInventory from './wikipedia-heritage-inventory.json' with { type: 'json' }
