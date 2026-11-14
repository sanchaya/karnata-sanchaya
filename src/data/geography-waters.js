// Rivers, dams and lakes for the geography page. Every point is an approximate
// reference location (a dam wall, a confluence, a falls, a lake centre), not a
// surveyed coordinate or a river course, and every record is still awaiting
// review. Construction years appear only where a source states them.
const t=(en,kn)=>({en,kn})
const src=['geo-indiawris']
const dam=(id,coords,en,kn,river,riverKn,districts,districtsKn,year)=>({id:`water-${id}`,type:'dam',coords,name:t(en,kn),detail:t(`Dam and reservoir on the ${river}${year?`, completed ${year}`:''}.`,`${riverKn} ನದಿಯ ಅಣೆಕಟ್ಟು ಮತ್ತು ಜಲಾಶಯ${year?`; ${year}ರಲ್ಲಿ ಪೂರ್ಣ`:''}.`),districts:t(districts,districtsKn),locationPrecision:'approximate',review:{status:'needs-review'},sourceIds:['geo-indiawris','geo-wiki-karnataka-dams']})
const lake=(id,coords,en,kn,detail,detailKn,districts,districtsKn)=>({id:`water-${id}`,type:'lake',coords,name:t(en,kn),detail:t(detail,detailKn),districts:t(districts,districtsKn),locationPrecision:'approximate',review:{status:'needs-review'},sourceIds:src})
const river=(id,coords,en,kn,detail,detailKn,districts,districtsKn,type='river')=>({id:`water-${id}`,type,coords,name:t(en,kn),detail:t(detail,detailKn),districts:t(districts,districtsKn),locationPrecision:'approximate',review:{status:'needs-review'},sourceIds:src})

export const geographyWaterFeatures=[
  dam('krs',[12.42,76.57],'Krishnarajasagara (KRS) Dam','ಕೃಷ್ಣರಾಜಸಾಗರ (ಕೆಆರ್‌ಎಸ್) ಅಣೆಕಟ್ಟು','Kaveri','ಕಾವೇರಿ','Mandya','ಮಂಡ್ಯ',1932),
  dam('kabini',[11.99,76.35],'Kabini Dam','ಕಬಿನಿ ಅಣೆಕಟ್ಟು','Kabini','ಕಬಿನಿ','Mysuru','ಮೈಸೂರು'),
  dam('harangi',[12.5,75.91],'Harangi Dam','ಹಾರಂಗಿ ಅಣೆಕಟ್ಟು','Harangi','ಹಾರಂಗಿ','Kodagu','ಕೊಡಗು'),
  dam('hemavathi',[12.77,76.07],'Hemavathi Dam','ಹೇಮಾವತಿ ಅಣೆಕಟ್ಟು','Hemavathi','ಹೇಮಾವತಿ','Hassan','ಹಾಸನ'),
  dam('tungabhadra',[15.27,76.33],'Tungabhadra Dam','ತುಂಗಭದ್ರಾ ಅಣೆಕಟ್ಟು','Tungabhadra','ತುಂಗಭದ್ರಾ','Vijayanagara and Koppal','ವಿಜಯನಗರ ಮತ್ತು ಕೊಪ್ಪಳ',1953),
  dam('almatti',[16.33,75.89],'Almatti Dam','ಆಲಮಟ್ಟಿ ಅಣೆಕಟ್ಟು','Krishna','ಕೃಷ್ಣಾ','Vijayapura and Bagalkot','ವಿಜಯಪುರ ಮತ್ತು ಬಾಗಲಕೋಟೆ',2005),
  dam('narayanpur',[16.19,76.36],'Narayanpur Dam (Basavasagar)','ನಾರಾಯಣಪುರ ಅಣೆಕಟ್ಟು (ಬಸವಸಾಗರ)','Krishna','ಕೃಷ್ಣಾ','Yadgir','ಯಾದಗಿರಿ'),
  dam('linganamakki',[14.18,74.84],'Linganamakki Dam','ಲಿಂಗನಮಕ್ಕಿ ಅಣೆಕಟ್ಟು','Sharavathi','ಶರಾವತಿ','Shivamogga','ಶಿವಮೊಗ್ಗ',1964),
  dam('bhadra',[13.7,75.63],'Bhadra Dam','ಭದ್ರಾ ಅಣೆಕಟ್ಟು','Bhadra','ಭದ್ರಾ','Shivamogga','ಶಿವಮೊಗ್ಗ'),
  dam('vani-vilasa',[13.75,76.65],'Vani Vilasa Sagara (Marikanive)','ವಾಣಿವಿಲಾಸ ಸಾಗರ (ಮಾರಿಕಣಿವೆ)','Vedavathi','ವೇದಾವತಿ','Chitradurga','ಚಿತ್ರದುರ್ಗ',1907),
  dam('tippagondanahalli',[12.98,77.3],'Tippagondanahalli (Chamarajsagar) Reservoir','ತಿಪ್ಪಗೊಂಡನಹಳ್ಳಿ (ಚಾಮರಾಜಸಾಗರ) ಜಲಾಶಯ','Arkavathi','ಅರ್ಕಾವತಿ','Bengaluru Rural and Ramanagara','ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ಮತ್ತು ರಾಮನಗರ'),
  lake('hesaraghatta',[13.14,77.49],'Hesaraghatta Lake','ಹೆಸರಘಟ್ಟ ಕೆರೆ','A reservoir on the Arkavathi built to supply Bengaluru.','ಬೆಂಗಳೂರಿಗೆ ನೀರು ಒದಗಿಸಲು ಅರ್ಕಾವತಿಗೆ ಕಟ್ಟಿದ ಜಲಾಶಯ.','Bengaluru Urban','ಬೆಂಗಳೂರು ನಗರ'),
  lake('ulsoor',[12.98,77.62],'Ulsoor (Halasuru) Lake','ಹಲಸೂರು ಕೆರೆ','One of Bengaluru’s old city tanks, part of the tank-and-valley water system of the plateau.','ಬೆಂಗಳೂರಿನ ಹಳೆಯ ನಗರ ಕೆರೆಗಳಲ್ಲಿ ಒಂದು; ಪ್ರಸ್ಥಭೂಮಿಯ ಕೆರೆ–ಕಣಿವೆ ಜಲವ್ಯವಸ್ಥೆಯ ಭಾಗ.','Bengaluru Urban','ಬೆಂಗಳೂರು ನಗರ'),
  lake('sankey',[13.01,77.57],'Sankey Tank','ಸ್ಯಾಂಕಿ ಕೆರೆ','An urban tank in north Bengaluru.','ಉತ್ತರ ಬೆಂಗಳೂರಿನ ನಗರ ಕೆರೆ.','Bengaluru Urban','ಬೆಂಗಳೂರು ನಗರ'),
  lake('kukkarahalli',[12.31,76.63],'Kukkarahalli Lake','ಕುಕ್ಕರಹಳ್ಳಿ ಕೆರೆ','A lake in Mysuru beside the university campus.','ಮೈಸೂರು ವಿಶ್ವವಿದ್ಯಾನಿಲಯದ ಆವರಣದ ಬಳಿಯ ಕೆರೆ.','Mysuru','ಮೈಸೂರು'),
  lake('kamalapura',[15.33,76.46],'Kamalapura Tank (Hampi)','ಕಮಲಾಪುರ ಕೆರೆ (ಹಂಪಿ)','A tank beside the Vijayanagara capital, part of the city’s water system.','ವಿಜಯನಗರ ರಾಜಧಾನಿಯ ಬಳಿಯ ಕೆರೆ; ನಗರದ ಜಲವ್ಯವಸ್ಥೆಯ ಭಾಗ.','Vijayanagara','ವಿಜಯನಗರ'),
  lake('dorasamudra',[13.21,75.99],'Dorasamudra (Dwarasamudra) Lake, Halebidu','ದೋರಸಮುದ್ರ (ದ್ವಾರಸಮುದ್ರ) ಕೆರೆ, ಹಳೇಬೀಡು','The tank beside the Hoysala capital Dorasamudra.','ಹೊಯ್ಸಳರ ರಾಜಧಾನಿ ದೋರಸಮುದ್ರದ ಬಳಿಯ ಕೆರೆ.','Hassan','ಹಾಸನ'),
  river('jog',[14.23,74.81],'Jog Falls (Sharavathi)','ಜೋಗ ಜಲಪಾತ (ಶರಾವತಿ)','The Sharavathi drops over the Ghats before reaching the Arabian Sea.','ಶರಾವತಿ ನದಿ ಘಟ್ಟದಿಂದ ಧುಮುಕಿ ಅರಬ್ಬಿ ಸಮುದ್ರ ಸೇರುತ್ತದೆ.','Shivamogga and Uttara Kannada','ಶಿವಮೊಗ್ಗ ಮತ್ತು ಉತ್ತರ ಕನ್ನಡ','waterfall'),
  river('shivanasamudra',[12.29,77.17],'Shivanasamudra Falls (Kaveri)','ಶಿವನಸಮುದ್ರ ಜಲಪಾತ (ಕಾವೇರಿ)','The Kaveri splits into the Gaganachukki and Bharachukki falls.','ಕಾವೇರಿ ಗಗನಚುಕ್ಕಿ ಮತ್ತು ಭರಚುಕ್ಕಿ ಜಲಪಾತಗಳಾಗಿ ಧುಮುಕುತ್ತದೆ.','Chamarajanagar and Mandya','ಚಾಮರಾಜನಗರ ಮತ್ತು ಮಂಡ್ಯ','waterfall'),
  river('gokak',[16.19,74.78],'Gokak Falls (Ghataprabha)','ಗೋಕಾಕ ಜಲಪಾತ (ಘಟಪ್ರಭಾ)','The Ghataprabha falls over a rocky gorge near Gokak.','ಗೋಕಾಕ ಬಳಿ ಘಟಪ್ರಭಾ ನದಿ ಕಲ್ಲಿನ ಕಣಿವೆಗೆ ಧುಮುಕುತ್ತದೆ.','Belagavi','ಬೆಳಗಾವಿ','waterfall'),
  river('tirumakudalu',[12.21,76.9],'Tirumakudalu, confluence of Kaveri and Kabini','ತಿರುಮಕೂಡಲು, ಕಾವೇರಿ–ಕಬಿನಿ ಸಂಗಮ','A river confluence and pilgrimage site near T. Narasipura.','ಟಿ. ನರಸೀಪುರ ಬಳಿಯ ನದಿ ಸಂಗಮ ಮತ್ತು ಯಾತ್ರಾ ಸ್ಥಳ.','Mysuru','ಮೈಸೂರು'),
  river('koodli',[13.93,75.53],'Koodli, where the Tunga and Bhadra meet','ಕೂಡಲಿ, ತುಂಗಾ–ಭದ್ರಾ ಸಂಗಮ','The two rivers join to form the Tungabhadra.','ಎರಡು ನದಿಗಳು ಸೇರಿ ತುಂಗಭದ್ರಾ ಆಗುತ್ತವೆ.','Shivamogga','ಶಿವಮೊಗ್ಗ'),
  river('ganagapur',[17.33,76.97],'Ganagapur, on the Bhima','ಗಾಣಗಾಪುರ, ಭೀಮಾ ನದಿ','A pilgrimage town on the Bhima in the north-eastern plateau.','ಈಶಾನ್ಯ ಪ್ರಸ್ಥಭೂಮಿಯ ಭೀಮಾ ನದಿ ತೀರದ ಯಾತ್ರಾ ಪಟ್ಟಣ.','Kalaburagi','ಕಲಬುರಗಿ'),
]

export const geographyWaterSources=[
  {id:'geo-indiawris',title:t('India-WRIS · India Water Resources Information System','ಇಂಡಿಯಾ-ಡಬ್ಲ್ಯೂಆರ್‌ಐಎಸ್ · ಭಾರತ ಜಲಸಂಪನ್ಮೂಲ ಮಾಹಿತಿ ವ್ಯವಸ್ಥೆ'),url:'https://indiawris.gov.in/',publisher:'Ministry of Jal Shakti / ISRO'},
  {id:'geo-wiki-karnataka-dams',title:t('List of dams and reservoirs in Karnataka','ಕರ್ನಾಟಕದ ಅಣೆಕಟ್ಟು ಮತ್ತು ಜಲಾಶಯಗಳ ಪಟ್ಟಿ'),url:'https://en.wikipedia.org/wiki/List_of_dams_and_reservoirs_in_Karnataka',publisher:'Wikipedia (a pointer to the underlying sources, not an authority)'},
]
