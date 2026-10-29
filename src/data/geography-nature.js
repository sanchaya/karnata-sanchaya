const text=(en,kn)=>({en,kn})

export const geographyNatureSources=[
  {id:'geo-napcc-karnataka',title:text('Karnataka state profile · National Climate Action dashboard','ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪರಿಚಯ · ರಾಷ್ಟ್ರೀಯ ಹವಾಮಾನ ಕ್ರಿಯಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'),url:'https://napccindia.moef.gov.in/sapcc/state/karnataka',publisher:'Ministry of Environment, Forest and Climate Change'},
  {id:'geo-ksdma-profile',title:text('Karnataka geography and disaster-management profile','ಕರ್ನಾಟಕ ಭೂಗೋಳ ಮತ್ತು ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಪರಿಚಯ'),url:'https://revenue.karnataka.gov.in/uploads/media_to_upload1712739726.pdf',publisher:'Government of Karnataka'},
  {id:'geo-sujala-lri',title:text('Land Resources Information portal','ಭೂ ಸಂಪನ್ಮೂಲ ಮಾಹಿತಿ ಪೋರ್ಟಲ್'),url:'https://www.sujala3lri.karnataka.gov.in/',publisher:'Watershed Development Department, Government of Karnataka'},
  {id:'geo-moef-biodiversity',title:text('Karnataka State Action Plan on Climate Change · biodiversity chapters','ಕರ್ನಾಟಕ ರಾಜ್ಯ ಹವಾಮಾನ ಬದಲಾವಣೆ ಕ್ರಿಯಾ ಯೋಜನೆ · ಜೀವವೈವಿಧ್ಯ ಅಧ್ಯಾಯಗಳು'),url:'https://moef.gov.in/uploads/2017/08/Karnataka.pdf',publisher:'Government of Karnataka / MoEFCC'},
  {id:'geo-unesco-western-ghats',title:text('Western Ghats World Heritage property','ಪಶ್ಚಿಮ ಘಟ್ಟ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣ'),url:'https://whc.unesco.org/en/list/1342/',publisher:'UNESCO World Heritage Centre'},
]

export const geographyNatureFacts=[
  {value:'191,791 km²',label:text('Geographical area','ಭೌಗೋಳಿಕ ವಿಸ್ತೀರ್ಣ'),sourceId:'geo-napcc-karnataka'},
  {value:'31',label:text('Districts','ಜಿಲ್ಲೆಗಳು'),sourceId:'geo-napcc-karnataka'},
  {value:'4',label:text('Broad physiographic regions','ವಿಶಾಲ ಭೌಗೋಳಿಕ ಪ್ರದೇಶಗಳು'),sourceId:'geo-ksdma-profile'},
  {value:'3',label:text('Broad climate settings','ವಿಶಾಲ ಹವಾಮಾನ ವಲಯಗಳು'),sourceId:'geo-napcc-karnataka'},
]

export const geographyNatureRegions=[
  {id:'coast',name:text('Coastal Karnataka','ಕರಾವಳಿ ಕರ್ನಾಟಕ'),summary:text('A narrow Arabian Sea plain with estuaries, beaches, laterite, mangroves, fishing settlements and very high monsoon rainfall.','ಅರಬ್ಬಿ ಸಮುದ್ರದ ಕಿರಿದಾದ ಬಯಲು; ನದಿಮುಖಗಳು, ಕಡಲತೀರಗಳು, ಜಂಬಿಟ್ಟಿಗೆ, ಕಾಂಡ್ಲಾವನಗಳು, ಮೀನುಗಾರರ ವಸತಿಗಳು ಮತ್ತು ಅಧಿಕ ಮುಂಗಾರು ಮಳೆ ಇದರ ಲಕ್ಷಣಗಳು.'),sourceIds:['geo-ksdma-profile','geo-moef-biodiversity']},
  {id:'malnad',name:text('Malnad and the Western Ghats','ಮಲೆನಾಡು ಮತ್ತು ಪಶ್ಚಿಮ ಘಟ್ಟ'),summary:text('Mountain forests, shola-grassland mosaics and headwaters that shape the monsoon, river systems and exceptional endemism.','ಪರ್ವತ ಅರಣ್ಯಗಳು, ಶೋಲಾ–ಹುಲ್ಲುಗಾವಲು ಜೋಡಣೆ ಮತ್ತು ನದಿಮೂಲಗಳು ಮುಂಗಾರು, ನದೀ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಅಪಾರ ಸ್ಥಳೀಯ ಜೀವವೈವಿಧ್ಯವನ್ನು ರೂಪಿಸುತ್ತವೆ.'),sourceIds:['geo-unesco-western-ghats','geo-moef-biodiversity']},
  {id:'north-interior',name:text('Northern interior plateau','ಉತ್ತರ ಒಳನಾಡು ಪ್ರಸ್ಥಭೂಮಿ'),summary:text('A warmer, drier Deccan landscape of black and red soils, scrub, grassland and the Krishna–Bhima river systems.','ಕಪ್ಪು ಮತ್ತು ಕೆಂಪು ಮಣ್ಣು, ಪೊದೆಕಾಡು, ಹುಲ್ಲುಗಾವಲು ಹಾಗೂ ಕೃಷ್ಣಾ–ಭೀಮಾ ನದೀ ವ್ಯವಸ್ಥೆಗಳಿರುವ ಉಷ್ಣ ಮತ್ತು ಒಣ ದಖನ್ ಭೂದೃಶ್ಯ.'),sourceIds:['geo-ksdma-profile','geo-sujala-lri']},
  {id:'south-interior',name:text('Southern interior plateau','ದಕ್ಷಿಣ ಒಳನಾಡು ಪ್ರಸ್ಥಭೂಮಿ'),summary:text('Undulating plateau, rocky hills, tanks and the Kaveri system support dry forests, farming landscapes and expanding cities.','ಏರಿಳಿತದ ಪ್ರಸ್ಥಭೂಮಿ, ಕಲ್ಲುಬೆಟ್ಟಗಳು, ಕೆರೆಗಳು ಮತ್ತು ಕಾವೇರಿ ವ್ಯವಸ್ಥೆ ಒಣ ಅರಣ್ಯ, ಕೃಷಿ ಭೂದೃಶ್ಯ ಮತ್ತು ಬೆಳೆಯುತ್ತಿರುವ ನಗರಗಳನ್ನು ಪೋಷಿಸುತ್ತವೆ.'),sourceIds:['geo-ksdma-profile','geo-sujala-lri']},
]

export const geographyNatureHighlights=[
  {id:'western-ghats',category:'forest',coords:[13.25,75.25],name:text('Western Ghats forests','ಪಶ್ಚಿಮ ಘಟ್ಟದ ಅರಣ್ಯಗಳು'),detail:text('Evergreen, moist-deciduous and shola habitats form part of a globally important biodiversity hotspot.','ನಿತ್ಯಹರಿದ್ವರ್ಣ, ತೇವ ಪರ್ಣಪಾತಿ ಮತ್ತು ಶೋಲಾ ವಾಸಸ್ಥಾನಗಳು ಜಾಗತಿಕ ಮಹತ್ವದ ಜೀವವೈವಿಧ್ಯ ತಾಣದ ಭಾಗವಾಗಿವೆ.'),sourceIds:['geo-unesco-western-ghats','geo-moef-biodiversity']},
  {id:'netrani-coast',category:'coast',coords:[14.02,74.32],name:text('Netrani and the coastal sea','ನೇತ್ರಾಣಿ ಮತ್ತು ಕರಾವಳಿ ಸಮುದ್ರ'),detail:text('Karnataka’s coast includes mangroves, estuaries and the coral-reef ecosystem around Netrani Island.','ಕರ್ನಾಟಕದ ಕರಾವಳಿಯಲ್ಲಿ ಕಾಂಡ್ಲಾವನಗಳು, ನದಿಮುಖಗಳು ಮತ್ತು ನೇತ್ರಾಣಿ ದ್ವೀಪದ ಸುತ್ತಲಿನ ಹವಳದ ದಿಬ್ಬದ ಪರಿಸರ ವ್ಯವಸ್ಥೆ ಇದೆ.'),sourceIds:['geo-moef-biodiversity']},
  {id:'agumbe-rain',category:'climate',coords:[13.50,75.09],name:text('Agumbe monsoon landscape','ಆಗುಂಬೆ ಮುಂಗಾರು ಭೂದೃಶ್ಯ'),detail:text('The windward Ghats receive extremely heavy monsoon rainfall, contrasting sharply with the eastern interior.','ಗಾಳಿಮುಖ ಪಶ್ಚಿಮ ಘಟ್ಟದಲ್ಲಿ ಅತ್ಯಧಿಕ ಮುಂಗಾರು ಮಳೆಯಾಗುತ್ತದೆ; ಇದು ಪೂರ್ವ ಒಳನಾಡಿನ ಒಣ ಹವಾಮಾನಕ್ಕೆ ತೀವ್ರ ವ್ಯತ್ಯಾಸವಾಗಿದೆ.'),sourceIds:['geo-ksdma-profile']},
  {id:'talacauvery',category:'water',coords:[12.39,75.52],name:text('Kaveri headwaters','ಕಾವೇರಿ ನದಿಮೂಲ'),detail:text('Western-Ghat headwaters connect forest, farming, settlement and sacred geographies across southern Karnataka.','ಪಶ್ಚಿಮ ಘಟ್ಟದ ನದಿಮೂಲಗಳು ದಕ್ಷಿಣ ಕರ್ನಾಟಕದ ಅರಣ್ಯ, ಕೃಷಿ, ವಸತಿ ಮತ್ತು ಪವಿತ್ರ ಭೂಗೋಳಗಳನ್ನು ಜೋಡಿಸುತ್ತವೆ.'),sourceIds:['geo-sujala-lri']},
  {id:'tungabhadra',category:'water',coords:[15.34,76.46],name:text('Tungabhadra landscape','ತುಂಗಭದ್ರಾ ಭೂದೃಶ್ಯ'),detail:text('The river corridor links plateau ecology, irrigation, settlements and historic landscapes including Hampi.','ಈ ನದೀ ದಾರಿ ಪ್ರಸ್ಥಭೂಮಿ ಪರಿಸರ, ನೀರಾವರಿ, ವಸತಿಗಳು ಮತ್ತು ಹಂಪಿ ಸೇರಿದಂತೆ ಐತಿಹಾಸಿಕ ಭೂದೃಶ್ಯಗಳನ್ನು ಜೋಡಿಸುತ್ತದೆ.'),sourceIds:['geo-sujala-lri']},
  {id:'eastern-plains',category:'flora',coords:[14.23,76.40],name:text('Dry eastern plains','ಒಣ ಪೂರ್ವ ಬಯಲು'),detail:text('Thorn scrub, dry forest and rocky grasslands support distinctive plants and wildlife adapted to lower rainfall.','ಮುಳ್ಳು ಪೊದೆಕಾಡು, ಒಣ ಅರಣ್ಯ ಮತ್ತು ಕಲ್ಲು ಹುಲ್ಲುಗಾವಲುಗಳು ಕಡಿಮೆ ಮಳೆಗೆ ಹೊಂದಿಕೊಂಡ ವಿಶಿಷ್ಟ ಸಸ್ಯ ಮತ್ತು ವನ್ಯಜೀವಿಗಳನ್ನು ಪೋಷಿಸುತ್ತವೆ.'),sourceIds:['geo-moef-biodiversity']},
]

export const geographyNatureThemes=[
  {id:'flora',name:text('Flora','ಸಸ್ಯಸಂಪತ್ತು'),summary:text('Sandalwood, rosewood, teak, evergreen forests, sholas, mangroves, dry thorn scrub and locally endemic plants reflect Karnataka’s steep rainfall and elevation gradients.','ಶ್ರೀಗಂಧ, ಬೀಟೆ, ಸಾಗುವಾನಿ, ನಿತ್ಯಹರಿದ್ವರ್ಣ ಕಾಡು, ಶೋಲಾ, ಕಾಂಡ್ಲಾವನ, ಒಣ ಮುಳ್ಳುಕಾಡು ಮತ್ತು ಸ್ಥಳೀಯ ಸಸ್ಯಗಳು ಕರ್ನಾಟಕದ ಮಳೆ–ಎತ್ತರದ ತೀವ್ರ ವ್ಯತ್ಯಾಸವನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತವೆ.'),sourceIds:['geo-moef-biodiversity']},
  {id:'fauna',name:text('Fauna','ಪ್ರಾಣಿಸಂಪತ್ತು'),summary:text('Elephants, tigers, gaur, lion-tailed macaques, hornbills, amphibians, reptiles and river fishes inhabit landscapes ranging from rainforest to dry scrub.','ಆನೆ, ಹುಲಿ, ಕಾಡೆಮ್ಮೆ, ಸಿಂಗಳೀಕ, ಮಂಗಟ್ಟೆ, ಉಭಯಚರ, ಸರೀಸೃಪ ಮತ್ತು ನದಿಮೀನುಗಳು ಮಳೆಕಾಡಿನಿಂದ ಒಣ ಪೊದೆಕಾಡಿನವರೆಗಿನ ಭೂದೃಶ್ಯಗಳಲ್ಲಿ ವಾಸಿಸುತ್ತವೆ.'),sourceIds:['geo-unesco-western-ghats','geo-moef-biodiversity']},
  {id:'people',name:text('People and landscapes','ಜನರು ಮತ್ತು ಭೂದೃಶ್ಯ'),summary:text('Sacred groves, tanks, grazing grounds, farms, fisheries and forest livelihoods show that Karnataka’s natural and cultural histories are inseparable.','ದೇವರಕಾಡು, ಕೆರೆ, ಗೋಮಾಳ, ಕೃಷಿಭೂಮಿ, ಮೀನುಗಾರಿಕೆ ಮತ್ತು ಅರಣ್ಯ ಜೀವನೋಪಾಯಗಳು ಕರ್ನಾಟಕದ ನೈಸರ್ಗಿಕ ಹಾಗೂ ಸಾಂಸ್ಕೃತಿಕ ಇತಿಹಾಸಗಳನ್ನು ಬೇರ್ಪಡಿಸಲಾಗುವುದಿಲ್ಲವೆಂದು ತೋರಿಸುತ್ತವೆ.'),sourceIds:['geo-sujala-lri','geo-moef-biodiversity']},
]
