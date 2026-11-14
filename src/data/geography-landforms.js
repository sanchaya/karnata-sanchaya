// Mountains and hills, hill stations, rock landmarks, waterfalls and coastal sites for the geography page. Like the water
// features, every point is an approximate reference location (a summit, a town centre, a beach) awaiting review; heights
// are in metres and appear only for the well-known peaks.
const t=(en,kn)=>({en,kn})
const SRC=['geo-wiki-karnataka-physiography','geo-karnataka-tourism']
const f=(type,id,coords,en,kn,detail,detailKn,districts,districtsKn,elevationM)=>({id:`land-${id}`,type,coords,name:t(en,kn),detail:t(detail,detailKn),districts:t(districts,districtsKn),...(elevationM?{elevationM}:{}),locationPrecision:'approximate',review:{status:'needs-review'},sourceIds:SRC})

export const geographyLandforms=[
  f('mountain','mullayanagiri',[13.3919,75.7219],'Mullayanagiri','ಮುಳ್ಳಯ್ಯನಗಿರಿ','The highest peak in Karnataka, in the Baba Budan hills.','ಕರ್ನಾಟಕದ ಅತಿ ಎತ್ತರದ ಶಿಖರ; ಬಾಬಾ ಬುಡನ್ ಗಿರಿಶ್ರೇಣಿಯಲ್ಲಿದೆ.','Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು',1930),
  f('mountain','baba-budangiri',[13.4,75.75],'Baba Budangiri','ಬಾಬಾ ಬುಡನ್‌ಗಿರಿ','The hill range around Mullayanagiri, known for coffee estates and shrines.','ಮುಳ್ಳಯ್ಯನಗಿರಿಯ ಸುತ್ತಲಿನ ಗಿರಿಶ್ರೇಣಿ; ಕಾಫಿ ತೋಟ ಮತ್ತು ಪುಣ್ಯಸ್ಥಳಗಳಿಗೆ ಪ್ರಸಿದ್ಧ.','Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು',1895),
  f('mountain','kudremukh',[13.128,75.253],'Kudremukh','ಕುದುರೆಮುಖ','A horse-faced Western Ghats peak inside Kudremukh National Park.','ಕುದುರೆ ಮುಖದಂತಹ ಪಶ್ಚಿಮ ಘಟ್ಟದ ಶಿಖರ; ಕುದುರೆಮುಖ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನದೊಳಗಿದೆ.','Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು',1894),
  f('mountain','tadiandamol',[12.2058,75.6603],'Tadiandamol','ತಡಿಯಂಡಮೋಳ್','The highest peak in Kodagu.','ಕೊಡಗಿನ ಅತಿ ಎತ್ತರದ ಶಿಖರ.','Kodagu','ಕೊಡಗು',1748),
  f('mountain','kumara-parvatha',[12.6683,75.6833],'Kumara Parvatha (Pushpagiri range)','ಕುಮಾರ ಪರ್ವತ (ಪುಷ್ಪಗಿರಿ ಶ್ರೇಣಿ)','A high, much-trekked peak of the Pushpagiri range on the Kodagu–Dakshina Kannada border.','ಕೊಡಗು–ದಕ್ಷಿಣ ಕನ್ನಡ ಗಡಿಯ ಪುಷ್ಪಗಿರಿ ಶ್ರೇಣಿಯ ಎತ್ತರದ ಚಾರಣ ಶಿಖರ.','Kodagu and Dakshina Kannada','ಕೊಡಗು ಮತ್ತು ದಕ್ಷಿಣ ಕನ್ನಡ',1712),
  f('mountain','brahmagiri',[11.9833,75.9833],'Brahmagiri (Kodagu)','ಬ್ರಹ್ಮಗಿರಿ (ಕೊಡಗು)','A forested ridge on the Kerala border; the Lakshmana Tirtha river rises in these hills.','ಕೇರಳ ಗಡಿಯ ಅರಣ್ಯ ಶಿಖರ; ಲಕ್ಷ್ಮಣ ತೀರ್ಥ ನದಿ ಈ ಬೆಟ್ಟಗಳಲ್ಲಿ ಹುಟ್ಟುತ್ತದೆ.','Kodagu','ಕೊಡಗು',1608),
  f('mountain','kodachadri',[13.8628,74.8189],'Kodachadri','ಕೊಡಚಾದ್ರಿ','A forested peak above the Sharavathi valley, linked with the Mookambika tradition.','ಶರಾವತಿ ಕಣಿವೆಯ ಮೇಲಿನ ಅರಣ್ಯ ಶಿಖರ; ಮೂಕಾಂಬಿಕಾ ಸಂಪ್ರದಾಯದೊಂದಿಗೆ ಸಂಬಂಧ.','Shivamogga','ಶಿವಮೊಗ್ಗ',1343),
  f('mountain','skandagiri',[13.4161,77.6806],'Skandagiri (Kalavara Durga)','ಸ್ಕಂದಗಿರಿ (ಕಳವಾರ ದುರ್ಗ)','A hill-fort peak on the plateau, a popular sunrise trek.','ಪ್ರಸ್ಥಭೂಮಿಯ ಕೋಟೆ ಬೆಟ್ಟ; ಸೂರ್ಯೋದಯ ಚಾರಣಕ್ಕೆ ಪ್ರಸಿದ್ಧ.','Chikkaballapur','ಚಿಕ್ಕಬಳ್ಳಾಪುರ',1450),
  f('mountain','nandi-hills',[13.3702,77.6835],'Nandi Hills','ನಂದಿ ಬೆಟ್ಟ','A fortified hill, a summer retreat of Mysore rulers and the British.','ಕೋಟೆಯಿರುವ ಬೆಟ್ಟ; ಮೈಸೂರು ದೊರೆಗಳ ಮತ್ತು ಬ್ರಿಟಿಷರ ಬೇಸಿಗೆ ವಿಶ್ರಾಂತಿ ತಾಣ.','Chikkaballapur','ಚಿಕ್ಕಬಳ್ಳಾಪುರ',1478),
  f('mountain','chamundi-hills',[12.2724,76.6701],'Chamundi Hills','ಚಾಮುಂಡಿ ಬೆಟ್ಟ','The hill above Mysuru with the Chamundeshwari temple.','ಚಾಮುಂಡೇಶ್ವರಿ ದೇವಾಲಯವಿರುವ ಮೈಸೂರಿನ ಬೆಟ್ಟ.','Mysuru','ಮೈಸೂರು',1065),
  f('mountain','biligiri-ranga-hills',[11.9783,77.1344],'Biligiri Ranga Hills','ಬಿಳಿಗಿರಿ ರಂಗನ ಬೆಟ್ಟ','Hills where the Western and Eastern Ghats are said to meet.','ಪಶ್ಚಿಮ ಮತ್ತು ಪೂರ್ವ ಘಟ್ಟಗಳು ಸೇರುತ್ತವೆ ಎನ್ನಲಾಗುವ ಬೆಟ್ಟಗಳು.','Chamarajanagar','ಚಾಮರಾಜನಗರ'),
  f('landmark','savandurga',[12.9226,77.2929],'Savandurga','ಸಾವನದುರ್ಗ','A massive granite monolith hill with a fort, often described as among the largest in Asia.','ಕೋಟೆಯಿರುವ ದೊಡ್ಡ ಗ್ರಾನೈಟ್ ಏಕಶಿಲಾ ಬೆಟ್ಟ; ಏಷ್ಯಾದ ದೊಡ್ಡವುಗಳಲ್ಲಿ ಒಂದು ಎಂದು ಹೇಳಲಾಗುತ್ತದೆ.','Ramanagara','ರಾಮನಗರ',1226),
  f('landmark','yana',[14.5878,74.5556],'Yana rocks','ಯಾಣ ಬಂಡೆಗಳು','Tall black crystalline limestone outcrops in the Western Ghats forest, with a cave temple.','ಪಶ್ಚಿಮ ಘಟ್ಟದ ಕಾಡಿನಲ್ಲಿರುವ ಎತ್ತರದ ಕಪ್ಪು ಸುಣ್ಣಕಲ್ಲಿನ ಬಂಡೆಗಳು; ಗುಹಾ ದೇವಾಲಯವಿದೆ.','Uttara Kannada','ಉತ್ತರ ಕನ್ನಡ'),
  f('landmark','hampi-boulders',[15.335,76.46],'Hampi boulder landscape','ಹಂಪಿಯ ಬಂಡೆಗಳ ಭೂದೃಶ್ಯ','Granite boulder hills that shaped the site of the Vijayanagara capital.','ವಿಜಯನಗರ ರಾಜಧಾನಿಯ ಸ್ಥಳವನ್ನು ರೂಪಿಸಿದ ಗ್ರಾನೈಟ್ ಬಂಡೆ ಬೆಟ್ಟಗಳು.','Vijayanagara','ವಿಜಯನಗರ'),
  f('landmark','shravanabelagola',[12.8597,76.4846],'Vindhyagiri and Chandragiri, Shravanabelagola','ವಿಂಧ್ಯಗಿರಿ ಮತ್ತು ಚಂದ್ರಗಿರಿ, ಶ್ರವಣಬೆಳಗೊಳ','Twin granite hills with Jain monuments, where land and history meet.','ಜೈನ ಸ್ಮಾರಕಗಳಿರುವ ಜೋಡಿ ಗ್ರಾನೈಟ್ ಬೆಟ್ಟಗಳು; ಭೂಮಿ ಮತ್ತು ಇತಿಹಾಸ ಇಲ್ಲಿ ಸೇರುತ್ತವೆ.','Hassan','ಹಾಸನ'),
  f('hill-station','madikeri',[12.4244,75.7382],'Madikeri (Coorg)','ಮಡಿಕೇರಿ (ಕೊಡಗು)','The hill town of Kodagu, in coffee and spice country.','ಕಾಫಿ ಮತ್ತು ಸಾಂಬಾರ ಬೆಳೆಯ ನಾಡಿನಲ್ಲಿರುವ ಕೊಡಗಿನ ಗಿರಿ ಪಟ್ಟಣ.','Kodagu','ಕೊಡಗು'),
  f('hill-station','chikkamagaluru',[13.3161,75.772],'Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು','The coffee town below the Baba Budan hills.','ಬಾಬಾ ಬುಡನ್ ಗಿರಿಗಳ ಕೆಳಗಿನ ಕಾಫಿ ಪಟ್ಟಣ.','Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು'),
  f('hill-station','kemmangundi',[13.55,75.75],'Kemmangundi','ಕೆಮ್ಮಣ್ಣುಗುಂಡಿ','A Baba Budan hill station with shola forest and viewpoints.','ಶೋಲಾ ಅರಣ್ಯ ಮತ್ತು ವೀಕ್ಷಣಾ ಸ್ಥಳಗಳಿರುವ ಬಾಬಾ ಬುಡನ್ ಗಿರಿಧಾಮ.','Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು'),
  f('hill-station','sakleshpur',[12.94,75.78],'Sakleshpur','ಸಕಲೇಶಪುರ','A Western Ghats foothill town of coffee, pepper and cardamom.','ಕಾಫಿ, ಕಾಳುಮೆಣಸು ಮತ್ತು ಏಲಕ್ಕಿ ಬೆಳೆಯುವ ಪಶ್ಚಿಮ ಘಟ್ಟದ ಬುಡದ ಪಟ್ಟಣ.','Hassan','ಹಾಸನ'),
  f('waterfall','abbey',[12.4547,75.7164],'Abbey Falls','ಅಬ್ಬಿ ಜಲಪಾತ','A waterfall through coffee estates near Madikeri.','ಮಡಿಕೇರಿ ಬಳಿ ಕಾಫಿ ತೋಟಗಳ ಮೂಲಕ ಧುಮುಕುವ ಜಲಪಾತ.','Kodagu','ಕೊಡಗು'),
  f('coast-site','murudeshwar',[14.0944,74.485],'Murudeshwar','ಮುರುಡೇಶ್ವರ','A temple headland on the Arabian Sea.','ಅರಬ್ಬಿ ಸಮುದ್ರದ ಮೇಲಿನ ದೇವಾಲಯದ ಮುನ್ನೆಲೆ.','Uttara Kannada','ಉತ್ತರ ಕನ್ನಡ'),
  f('coast-site','gokarna',[14.5479,74.3188],'Gokarna beaches','ಗೋಕರ್ಣ ಕಡಲತೀರಗಳು','A temple town with a string of crescent beaches.','ಅರ್ಧಚಂದ್ರಾಕಾರದ ಕಡಲತೀರಗಳ ಸಾಲಿರುವ ದೇವಾಲಯ ಪಟ್ಟಣ.','Uttara Kannada','ಉತ್ತರ ಕನ್ನಡ'),
  f('coast-site','malpe',[13.3558,74.7014],'Malpe beach and port','ಮಲ್ಪೆ ಕಡಲತೀರ ಮತ್ತು ಬಂದರು','A fishing harbour and beach, gateway to St Mary’s Island.','ಮೀನುಗಾರಿಕಾ ಬಂದರು ಮತ್ತು ಕಡಲತೀರ; ಸೇಂಟ್ ಮೇರಿಸ್ ದ್ವೀಪಕ್ಕೆ ಹೆಬ್ಬಾಗಿಲು.','Udupi','ಉಡುಪಿ'),
  f('coast-site','st-marys-island',[13.379,74.67],'St Mary’s Island','ಸೇಂಟ್ ಮೇರಿಸ್ ದ್ವೀಪ','A small island of columnar basalt off the Udupi coast.','ಉಡುಪಿ ಕರಾವಳಿಯ ಬಳಿಯ ಸ್ತಂಭಾಕಾರದ ಬಸಾಲ್ಟ್ ಶಿಲೆಗಳ ಪುಟ್ಟ ದ್ವೀಪ.','Udupi','ಉಡುಪಿ'),
  f('coast-site','maravanthe',[13.705,74.635],'Maravanthe','ಮರವಂತೆ','A road between the Arabian Sea and the Suparnika river.','ಅರಬ್ಬಿ ಸಮುದ್ರ ಮತ್ತು ಸೌಪರ್ಣಿಕಾ ನದಿಯ ನಡುವಿನ ರಸ್ತೆ.','Udupi','ಉಡುಪಿ'),
  f('coast-site','karwar',[14.8,74.13],'Karwar and Devbagh','ಕಾರವಾರ ಮತ್ತು ದೇವಬಾಗ','A port town on the Kali estuary, with offshore islands.','ಕಾಳಿ ನದಿಮುಖದ ಬಂದರು ಪಟ್ಟಣ; ಸಮುದ್ರದಲ್ಲಿ ದ್ವೀಪಗಳಿವೆ.','Uttara Kannada','ಉತ್ತರ ಕನ್ನಡ'),
  f('coast-site','panambur',[12.94,74.81],'Panambur and Tannirbhavi','ಪಣಂಬೂರು ಮತ್ತು ತಣ್ಣೀರುಬಾವಿ','Mangaluru’s beaches beside the New Mangalore Port.','ನವ ಮಂಗಳೂರು ಬಂದರಿನ ಬಳಿಯ ಮಂಗಳೂರಿನ ಕಡಲತೀರಗಳು.','Dakshina Kannada','ದಕ್ಷಿಣ ಕನ್ನಡ'),
]

export const geographyLandformSources=[
  {id:'geo-wiki-karnataka-physiography',title:t('Geography of Karnataka','ಕರ್ನಾಟಕದ ಭೂಗೋಳ'),url:'https://en.wikipedia.org/wiki/Geography_of_Karnataka',publisher:'Wikipedia (a pointer to the underlying sources, not an authority)'},
  {id:'geo-karnataka-tourism',title:t('Karnataka Tourism','ಕರ್ನಾಟಕ ಪ್ರವಾಸೋದ್ಯಮ'),url:'https://www.karnatakatourism.org/',publisher:'Department of Tourism, Government of Karnataka'},
]
