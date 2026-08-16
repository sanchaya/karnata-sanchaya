export const EPIGRAPHY_COLLECTIONS=[
  { sourceId:'src-ia-sok-epigraphy-collection', },
  { sourceId:'src-ia-jaigyan-epigraphy-collection', },
]

export const EPIGRAPHY_VOLUMES=[
  {
    sourceId:'src-ia-sok-ec-vol4',
    series:'Epigraphia Carnatica',
    volume:'IV',
    coverage:{
      en:'Chamarajanagar district items (e.g. Punisaraja record, EC IV Chamarajanagar 83)',
      kn:'ಚಾಮರಾಜನಗರ ಜಿಲ್ಲೆಯ ದಾಖಲೆಗಳು (ಉದಾ. ಪುಣಿಸರಾಜ ದಾಖಲೆ, EC IV ಚಾಮರಾಜನಗರ 83)',
    },
    verifyNote:{
      en:'Volume registered for digitised access; each item needs page-image verification before transcription and publication.',
      kn:'ಡಿಜಿಟಲ್ ಪ್ರವೇಶಕ್ಕಾಗಿ ಸಂಪುಟವನ್ನು ನೋಂದಾಯಿಸಲಾಗಿದೆ; ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯೂ ಪ್ರತಿಚಿತ್ರದ ಪರಿಶೀಲನೆಯ ನಂತರವೇ ಪ್ರತಿಲೇಖನ ಮತ್ತು ಪ್ರಕಟಣೆಗೆ ಅರ್ಹ.',
    },
  },
  {
    sourceId:'src-ia-sok-ec-vol10',
    series:'Epigraphia Carnatica',
    volume:'X',
    coverage:{
      en:'Kolar district items (e.g. Bowringpet taluk 12, Ramasagara Venkataramana temple)',
      kn:'ಕೋಲಾರ ಜಿಲ್ಲೆಯ ದಾಖಲೆಗಳು (ಉದಾ. ಬೌರಿಂಗ್‌ಪೇಟೆ ತಾಲೂಕು 12, ರಾಮಸಾಗರ ವೆಂಕಟರಮಣ ದೇವಾಲಯ)',
    },
    verifyNote:{
      en:'Volume registered for digitised access; each item needs page-image verification before transcription and publication.',
      kn:'ಡಿಜಿಟಲ್ ಪ್ರವೇಶಕ್ಕಾಗಿ ಸಂಪುಟವನ್ನು ನೋಂದಾಯಿಸಲಾಗಿದೆ; ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯೂ ಪ್ರತಿಚಿತ್ರದ ಪರಿಶೀಲನೆಯ ನಂತರವೇ ಪ್ರತಿಲೇಖನ ಮತ್ತು ಪ್ರಕಟಣೆಗೆ ಅರ್ಹ.',
    },
  },
  {
    sourceId:'src-ia-sok-ec-vol12',
    series:'Epigraphia Carnatica',
    volume:'XII',
    coverage:{
      en:'Tumakuru district and taluk items',
      kn:'ತುಮಕೂರು ಜಿಲ್ಲೆ ಮತ್ತು ತಾಲೂಕು ದಾಖಲೆಗಳು',
    },
    verifyNote:{
      en:'Volume registered for digitised access; individual item and page need review before promotion.',
      kn:'ಡಿಜಿಟಲ್ ಪ್ರವೇಶಕ್ಕಾಗಿ ಸಂಪುಟವನ್ನು ನೋಂದಾಯಿಸಲಾಗಿದೆ; ಪ್ರಚಾರಕ್ಕೂ ಮೊದಲು ಪ್ರತ್ಯೇಕ ದಾಖಲೆ ಮತ್ತು ಪುಟ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.',
    },
  },
  {
    sourceId:'src-ia-sok-ec-vol16',
    series:'Epigraphia Carnatica',
    volume:'XVI',
    coverage:{
      en:'Supplementary Tumakuru district items',
      kn:'ತುಮಕೂರು ಜಿಲ್ಲೆಯ ಪೂರಕ ದಾಖಲೆಗಳು',
    },
    verifyNote:{
      en:'Volume registered for digitised access; individual item and page need review before promotion.',
      kn:'ಡಿಜಿಟಲ್ ಪ್ರವೇಶಕ್ಕಾಗಿ ಸಂಪುಟವನ್ನು ನೋಂದಾಯಿಸಲಾಗಿದೆ; ಪ್ರಚಾರಕ್ಕೂ ಮೊದಲು ಪ್ರತ್ಯೇಕ ದಾಖಲೆ ಮತ್ತು ಪುಟ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.',
    },
  },
]

export const epigraphyCollectionSourceIds=EPIGRAPHY_COLLECTIONS.map(item=>item.sourceId)
export const epigraphyVolumeSourceIds=EPIGRAPHY_VOLUMES.map(item=>item.sourceId)