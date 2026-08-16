import { readFileSync, writeFileSync } from 'node:fs'

const MASTER_CSV = process.argv[2] ?? '/Users/omshivaprakash/Downloads/Karnataka_Freedom_Fighters_MASTER_LIST.csv'
const SOURCES_CSV = process.argv[3] ?? '/Users/omshivaprakash/Downloads/Karnataka_Freedom_Fighters_SOURCES_Bibliography.csv'
const OUT_JS = process.argv[4] ?? new URL('../src/data/freedom-fighters.js', import.meta.url).pathname

const KANNADA_RE = /[\u0C80-\u0CFF\u0CE0-\u0CEF\u0CD6]+(?:\s+[\u0C80-\u0CFF\u0CE0-\u0CEF\u0CD6]+)*/g
const REVIEW = { status: 'needs-review', reviewer: null, updatedAt: '2026-08-01' }

// Evidence discovered outside the original CSV. Keep these overrides in the
// importer so regenerating freedom-fighters.js does not discard reviewed
// research work. Each association remains needs-review until a human checks
// the cited printed page image rather than relying on OCR alone.
const DISTRICT_ASSOCIATION_OVERRIDES = {
  84: [{
    districtId: 'audit-mandya',
    kind: 'activity',
    sourceId: 'src-ia-mandya-freedom-unification-2017',
    locator: 'Printed p. 42; named among Mandya district leaders in the responsible-government movement (scan/OCR discovery; page-image check required)',
  }],
}

// Provisional Kannada renderings for rows where the source CSV carries no Kannada script.
// Machine-generated transliterations for review; every record ships with review.status
// 'needs-review' so reviewers must verify these renderings before publication.
const PERSON_KN = {
  3: 'ರಾಣಿ ಅಬ್ಬಕ್ಕ ಚೌಟ',
  4: 'ಗಂಗಾಧರ ರಾವ್ ದೇಶಪಾಂಡೆ',
  5: 'ಆಲೂರು ವೆಂಕಟರಾವ್',
  6: 'ಕಡಿದಾಳ್ ಮಂಜಪ್ಪ',
  7: 'ಎಸ್. ನಿಜಲಿಂಗಪ್ಪ',
  8: 'ನಿಟ್ಟೂರು ಶ್ರೀನಿವಾಸರಾವ್',
  9: 'ಹೆಚ್. ಎಸ್. ದೊರೆಸ್ವಾಮಿ',
  11: 'ಯಶೋಧರಾ ದಾಸಪ್ಪ',
  13: 'ಅಮ್ಮೆಂಬಳ ಬಾಲಪ್ಪ',
  14: 'ದಯಾನಂದ ಎಸ್. ನಾಡಕರ್ಣಿ',
  15: 'ಹಲಗಲಿ ಬೇಡರು',
  16: 'ಆರ್. ಆರ್. ದಿವಾಕರ',
  17: 'ಕೆ. ಚೆಂಗಲರಾಯ ರೆಡ್ಡಿ',
  18: 'ದ. ರಾ. ಬೇಂದ್ರೆ',
  19: 'ಕೆ. ಶಿವರಾಮ ಕಾರಂತ',
  20: 'ಎನ್. ಎಸ್. ಹಾರ್ದಿಕರ್',
  21: 'ಕಾರ್ನಾಡ್ ಸದಾಶಿವ ರಾವ್',
  22: 'ಎ. ಬಿ. ಶೆಟ್ಟಿ',
  23: 'ಸ್ವಾಮಿ ರಾಮಾನಂದ ತೀರ್ಥ',
  24: 'ಬಿ. ಶಂಭು ಶೆಟ್ಟಿ',
  26: 'ನಾಗಮ್ಮ ವೀರಣ್ಣಗೌಡ ಪಾಟೀಲ',
  27: 'ಬಳ್ಳಾರಿ ಸಿದ್ಧಮ್ಮ',
  28: 'ಕೃಷ್ಣಾಬಾಯಿ ಪಂಜೇಕರ',
  29: 'ಸಿದ್ದವನಹಳ್ಳಿ ಕೃಷ್ಣಶರ್ಮ',
  30: 'ಹೆಚ್. ವಿ. ನಾಗಭೂಷಣ ರಾವ್',
  31: 'ಆರ್. ನಾರಾಯಣಪ್ಪ',
  32: 'ಶಂಕರನಾರಾಯಣ ರಾವ್',
  33: 'ಗುಡ್ಲೆಪ್ಪ ಹಳ್ಳಿಕೇರಿ',
  34: 'ಅನ್ನದಾನಯ್ಯ ಪುರಾಣಿಕ',
  35: 'ತಿಮ್ಮಪ್ಪ ರುದ್ರಪ್ಪ ನೇಸ್ವಿ',
  36: 'ಹರಿವಿಷ್ಣು ಕಾಮತ್',
  37: 'ಶ್ರೀಮುಷ್ಣಂ ಶ್ರೀನಿವಾಸಮೂರ್ತಿ',
  38: 'ಕುಡುಪಿ ವಾಸುದೇವ ಶೆಣೈ',
  39: 'ವಿ.ಎನ್. ಓಕಿ',
  40: 'ಕೆ.ಜಿ. ಗೋಖಲೆ',
  41: 'ಆರ್.ಎಸ್. ಹುಕ್ಕೇರಿಕರ',
  42: 'ಸುಗಂಧಿ ಮುರಿಗಪ್ಪ ಸಿದ್ದಪ್ಪ',
  43: 'ಟಿ. ಸುಬ್ರಹ್ಮಣ್ಯಂ',
  44: 'ನಾರಾಯಣ ಎಸ್. ರಾಜಪುರೋಹಿತ',
  45: 'ಜಿ.ಆರ್. ಪಾಂಡೇಶ್ವರ',
  46: 'ಗಲಗನಾಥ',
  47: 'ಶಾಂತಕವಿ',
  48: 'ಸುಬೋಧ ರಾಮರಾವ್',
  49: 'ಗೋವಿಂದರಾವ್ ಯಳಗಿ',
  50: 'ಅಣ್ಣಾಚಾರ್ಯ ಹೊಸಕೇರಿ',
  51: 'ಶ್ರೀನಿವಾಸರಾವ್ ಕೌಜಲಗಿ',
  52: 'ಹನುಮಂತರಾವ್ ದೇಶಪಾಂಡೆ',
  53: 'ದತ್ತೋಪಂತ ಮಜಲಿ',
  54: 'ಕೃಷ್ಣರಾವ್ ಕರಗುಪ್ಪಿ',
  55: 'ನಾರಾಯಣರಾವ್ ಜೋಶಿ',
  56: 'ಹನುಮಂತರಾವ್ ಕೌಜಲಗಿ',
  57: 'ರಾಮಕೃಷ್ಣ ಕಾರಂತ',
  58: 'ರಂಗರಾವ್ ತಿಲಗುಲ್',
  59: 'ವಾಸುದೇವ ರಾವ್ ಕೊಲ್ಲಾಳಿ',
  60: 'ಜಯರಾವ್ ನರಗುಂದ',
  61: 'ಅನಂತರಾವ್ ಜಲಿಹಾಳ',
  62: 'ಮಾಧವರಾವ್ ಕಬ್ಬೂರ',
  63: 'ಡಿ.ಕೆ. ಭಾರದ್ವಾಜ್',
  64: 'ಹಿರಿಯಡ್ಕ ರಾಮರಾವ್ ಮಲ್ಯ',
  65: 'ಹನುಮಂತರಾವ್ ಮೊಹರೆ',
  66: 'ಚೌಡ ನಾಯಕ',
  67: 'ತಿಮ್ಮಪ್ಪ ನಾಯಕ',
  68: 'ಕೆ. ವಾಸುದೇವಾಚಾರ್ಯ',
  69: 'ಬಿ. ವೆಂಕಟಾಚಾರ್ಯ',
  70: 'ಎಂ.ಪಿ. ನಾಡಕರ್ಣಿ',
  71: 'ದ.ಪಾ. ಕಾರಂಕರ',
  72: 'ರಾಮರಾವ್ ಹುಕ್ಕೇರಿಕರ',
  73: 'ಶ್ರೀನಿವಾಸ ಮಲ್ಯ',
  74: 'ವೀರಣ್ಣ ಗೌಡ ಪಾಟೀಲ',
  75: 'ತಿಪ್ಪಯ್ಯ ಮಾಸ್ಟರ್',
  76: 'ಬೆಟಗೇರಿ ಕೃಷ್ಣಶರ್ಮ',
  77: 'ಎಸ್.ಎನ್. ಹೊಳ್ಳ',
  78: 'ಬಾಲಚಂದ್ರ ಘಾಣೇಕರ',
  79: 'ತಿರುಮಲೆ ರಾಜಮ್ಮ',
  80: 'ಶ್ರೀಧರ ಕಾಣೋಲ್ಕರ',
  82: 'ಬುರ್ಲಿ ಬಿಂದುಮಾಧವ',
  83: 'ಮುದುವಿಡು ಕೃಷ್ಣರಾವ್',
  84: 'ಹೆಚ್.ಕೆ. ವೀರಣ್ಣಗೌಡ',
  85: 'ಬಿ.ಎನ್. ಗುಪ್ತ',
  86: 'ಅಗರಂ ರಂಗಯ್ಯ',
  87: 'ಪಿ.ಆರ್. ರಾಮಯ್ಯ',
  88: 'ಎಲ್.ಎಸ್. ಪಾಟೀಲ',
  89: 'ಶ್ರೀನಿವಾಸರಾವ್ ಮಂಗಳವೇದೆ',
  90: 'ರಾಮರಾಯ ಮಲ್ಯ',
  91: 'ನರಸಿಂಹ ಶಾನಭಾಗ',
  92: 'ಟಿ.ಬಿ. ಕೇಶವರಾವ್',
  94: 'ಗಣೇಶ ಯಾಜಿ',
  95: 'ಗೋಪಾಲ ದೇಶಪಾಂಡೆ',
  96: 'ತಿ.ತಾ. ಶರ್ಮ',
  97: 'ವಿ.ಬಿ. ಪುರಾಣಿಕ',
  98: 'ಸಾಳಿ ರಾಮಚಂದ್ರರಾಯ',
  99: 'ಭೀಮರಾವ್ ಬಾಲಾಜಿ ಪೊತ್ದಾರ',
  100: 'ತಿಪ್ಪಣ್ಣ ಶಾಸ್ತ್ರಿ ಕಳ್ಳಿ',
  101: 'ಎಸ್.ವಿ. ಕೃಷ್ಣಮೂರ್ತಿ ರಾವ್',
  102: 'ವಾಮನ ಶ್ರೀನಿವಾಸ ಕುಡ್ವ',
  103: 'ಎ.ಎನ್. ಸೂರ್ಯನಾರಾಯಣ ರಾವ್',
  104: 'ಎಸ್.ಕೆ. ಕರೀಂ ಖಾನ್',
  105: 'ಹೆಚ್. ನರಸಿಂಹಯ್ಯ',
  106: 'ರಾಮಚಂದ್ರ ಮುಕುಂದ ಪ್ರಭು',
  107: 'ಎಸ್.ಆರ್. ಹಾಲ್ದಿಪುರ',
  108: 'ಅರವಿಂದರಾವ್ ಕುಲಕರ್ಣಿ',
  109: 'ಆಲೂರು ರಂಗರಾಮಯ್ಯ',
  110: 'ವಿ.ಬಿ. ನಾಯಕ',
  111: 'ಎಂ. ರಾಮಮೂರ್ತಿ',
  112: 'ಬಿ. ಪುಟ್ಟಸ್ವಾಮಿ',
  113: 'ಮಂಜಯ್ಯ ಶೆರೇಗಾರ',
  114: 'ಎ.ಎನ್. ಕೃಷ್ಣರಾವ್',
  115: 'ಆನಂದಣ್ಣಪ್ಪ ಜ್ಞಾನಪ್ಪ ದೊಡ್ಡಮತಿ',
  116: 'ವಿ.ಆರ್. ಹುಯಿಲಗೋಳ',
  117: 'ವಿ.ವಿ. ಪಾಟೀಲ',
  118: 'ಭೀಮರಾವ್ ಚಿಟಗೋಪ್ಕರ',
  119: 'ಶ್ರೀಪಾದರಾವ್ ಕರಗುರ್ದಿ',
  120: 'ಪಿ.ಸಿ. ಜಕಾತಿ',
  121: 'ಮಹಾದೇವ ಮೈಲಾರ',
  122: 'ನಾರಾಯಣರಾವ್ (ಮಿರ್ಜಿ) ಶರ್ಮ',
  123: 'ದಿವಾನಸಾಹೇಬ ಜನವೇಕರ',
  124: 'ಖಲೀಲುಲ್ಲಾ ಜನವೇಕರ',
  125: 'ರಘುಪತಿ ಪಿ. ಶೆಣ್ವಿ',
  126: 'ಕಡುಬೆಟ್ಟು ಶ್ರೀನಿವಾಸ ಪೈ',
  127: 'ಕೆ.ಸಿ. ನಾರಾಯಣಪ್ಪ',
  128: 'ತಾಳಚೇರಿಕರ ರಂಗರಾವ್',
  129: 'ತಾಯಮ್ಮ ವೀರಣ್ಣಗೌಡ',
  130: 'ಮಹಾದೇವಿತಾಯಿ ದೊಡ್ಮನೆ',
  131: 'ಗೌರಮ್ಮ ವೆಂಕಟರಾಮಯ್ಯ',
  132: 'ಬೊಮ್ಮಕ್ಕ',
  133: 'ವಿಶಾಲಾಕ್ಷಮ್ಮ',
  134: 'ಮಹಾದೇವಿ ತಾಯಿ ಹೆಗ್ಗಡೆ',
  135: 'ತಾಂಡೂರು ಸುನಂದಮ್ಮ',
  136: 'ಲೀಲಾವತಿ ಮಾಗಡಿ',
  137: 'ಶಕುಂತಲಾ ಕುರ್ತಕೋಟಿ',
  144: 'ಎಂ. ವಿ. ಕೃಷ್ಣಪ್ಪ',
  145: 'ದೊಡ್ಡಮನೆ ಮಹಾದೇವಿ ಹೆಗ್ಗಡೆ',
  161: 'ಸಣ್ಣಪ್ಪ ಪರಮೇಶ್ವರ ಗಾಂವಕರ',
  165: 'ಟಿ. ಆರ್. ರೇವಣ್ಣ',
  166: 'ಟಿ. ಎಂ. ಮಹಂತಯ್ಯ',
  167: 'ಎಸ್. ವಿ. ಆಚಾರ್',
  168: 'ಟಿ. ಅನಂತರಾಮಶೆಟ್ಟಿ',
  169: 'ಚೆಂಗಲ್ವರಾಯ ಮೋದಲಿಯಾರ್',
  170: 'ಬಿ. ಸಿ. ನಂಜುಂಡಯ್ಯ',
  171: 'ಎಂ. ನೀಲಕಂಠರಾಯರು',
  172: 'ಎ. ಎಸ್. ನಂದೀಶ್',
  173: 'ಕೆ. ಎಲ್. ನರಸಿಂಹಯ್ಯ',
  174: 'ಕೆ. ಆರ್. ನರಸಿಂಹಯ್ಯಂಗಾರ್',
  175: 'ಅಪ್ಪಜಪ್ಪ',
  176: 'ಕೆ. ಸಿ. ಬಸವರಾಜು',
  177: 'ಜಿ. ಆರ್. ಚಂಗಳರಾಧ್ಯರು',
  178: 'ಚನ್ನಪ್ಪ',
  179: 'ಟಿ. ಎನ್. ಚನ್ನಪ್ಪ',
  180: 'ಜಯದೇವಯ್ಯ',
  181: 'ಟಿ. ಎ. ಮುದ್ದಪ್ಪ',
  182: 'ಒಬ್ಬಾಳಯ್ಯ',
  183: 'ಕೆ. ವಿ. ಪರಮಶಿವ',
  184: 'ಟಿ. ಆರ್. ಪುಟ್ಟಯ್ಯ',
  185: 'ಎ. ಸಿ. ಪುಟ್ಟಣ್ಣ',
  186: 'ಪುಟ್ಟಸ್ವಾಮಯ್ಯ',
  187: 'ಬಿ. ರಾಜಪ್ಪ',
  188: 'ಟಿ. ಕೆ. ರಾಮಚಂದ್ರಯ್ಯ',
  189: 'ಜಿ. ರಾಮರಾವ್',
  190: 'ಎಂ. ವಿ. ರಾಮರಾವ್',
  191: 'ಬಸವರಾಧ್ಯ',
  192: 'ಟಿ. ಆರ್. ಚನ್ನಪ್ಪ',
  193: 'ಮಂತ್ರಿ ಚನ್ನಿಗರಾಮಯ್ಯ',
  194: 'ಮಾಳಿ ಮರಿಯಪ್ಪ',
  195: 'ಖಾದ್ರಿ',
  196: 'ಗೂಳಪ್ಪ',
  197: 'ಪಿ. ರಾಮರಾವ್',
  198: 'ಗೋವಿಂದಪ್ಪ',
  199: 'ಕೆಂಚಪ್ಪ',
  200: 'ಜಿ. ಹೆಚ್. ಆರ್. ದೇವರು',
  201: 'ಗಂಗಾಧರಪ್ಪನವರು',
  202: 'ಜಿ. ಹೆಚ್. ಗೋಪಾಲಯ್ಯ',
  203: 'ಸಿ. ಎಸ್. ನಾರಾಯಣರಾವ್',
  204: 'ಎಂ. ಎಸ್. ಹನುಮಂತರಾವ್',
  205: 'ಸಿ. ಆರ್. ಆದಿನಾರಾಯಣರಾವ್',
  206: 'ಎಸ್. ಅನಂತರಾಮ ಅಯ್ಯಂಗಾರ್',
  207: 'ಟಿ. ಸುಬ್ರಹ್ಮಣ್ಯಂ',
  208: 'ಅನಿವಾಲದ ನಂಜಪ್ಪ',
  209: 'ಎಸ್. ಆರ್. ಮಲ್ಲಪ್ಪ',
  210: 'ಕರಿಯಪ್ಪ',
  211: 'ಜಿ. ತಮ್ಮಣ್ಣ',
  212: 'ಬಂಟ್ವಾಳ ವೈಕುಂಠ ಬಾಳಿಗ',
  213: 'ದತ್ತಾತ್ರೇಯ ವೆಂಕಟೇಶ ಬೆಳವಿ',
  214: 'ರಾಣಿ ಲೀಲಾ ರಾಮ್ಕುಮಾರ್ ಭಾರ್ಗವ',
  215: 'ಕೆ. ಟಿ. ಭಾಷ್ಯಂ',
  216: 'ಎಂ. ಎಸ್. ಗುರುಪದಸ್ವಾಮಿ',
  217: 'ವಿ. ಎಸ್. ಕೃಷ್ಣ ಅಯ್ಯರ್',
  218: 'ಕುಟ್ಟೂರು ಮಲ್ಲಪ್ಪ',
  219: 'ಗುಂಡುಗುಟ್ಟಿ ಎಂ. ಮಂಜನಾಥಯ್ಯ',
  220: 'ರಾವ್ ಬಹಾದ್ದೂರ್ ಅರ್ಕೋಟ್ ಸಭಾಪತಿ ಮುದಲಿಯಾರ',
  221: 'ಎಸ್. ಎಸ್. ಸೆಟ್ಲೂರ್',
  222: 'ಟಿ. ಆರ್. ಶಾಮಣ್ಣ',
  223: 'ಖಾದಿ ಶಂಕರಪ್ಪ',
  224: 'ಗೋವಿಂದಭಾಯಿ ಶ್ರಾಫ್',
  225: 'ಪಂಡ್ಯಾಂಡ ಇ. ಬೆಳ್ಳಿಯಪ್ಪ',
  226: 'ದಿನಕರ ದೇಸಾಯಿ',
  227: 'ಸಿ. ಎಂ. ಪೂಣಚ್ಚ',
  228: 'ಎಂ. ಎನ್. ಜೋಯಿಸ್',
  229: 'ತಗಡೂರು ರಾಮಚಂದ್ರ ರಾವ್',
  230: 'ಬಿ. ಎಂ. ಇದಿನಬ್ಬ',
  231: 'ಗೊರೂರು ರಾಮಸ್ವಾಮಿ ಅಯ್ಯಂಗಾರ್',
  232: 'ಉಳ್ಳಾಲ ಶ್ರೀನಿವಾಸ ಮಲ್ಯ',
  233: 'ಮದಕರಿ ನಾಯಕ',
  234: 'ಭೀಮಣ್ಣ ನಾಯಕ',
  235: 'ಚೆನ್ನಪ್ಪ ನಾಯಕ',
  236: 'ತಿಮ್ಮಣ್ಣ ನಾಯಕ',
  237: 'ಕಲ್ಲೂರು ಸುಬ್ಬರಾವ್',
  238: 'ಕೊಲ್ಲೂರು ಲಕ್ಷ್ಮೀನಾರಾಯಣ',
  239: 'ಹನುಮಪ್ಪ',
  240: 'ನಂಜುಂಡಪ್ಪ',
  241: 'ರಂಗಪ್ಪ',
  242: 'ಸಿದ್ದಪ್ಪ',
  243: 'ವೆಂಕಟಪ್ಪ',
  244: 'ಬಸವರಾಜ',
  245: 'ಕೃಷ್ಣಯ್ಯ',
  246: 'ಶಿವಪ್ಪ',
  247: 'ಸುಬ್ಬರಾಯಪ್ಪ',
  248: 'ಕೆಳದಿ ಚೆನ್ನಮ್ಮ',
  251: 'ಪಂಡಿತಾ ರಮಾಬಾಯಿ ಸರಸ್ವತಿ',
  252: 'ಕುದ್ಮುಲ್ ರಂಗ ರಾವ್',
  253: 'ಕೈಲಾಶ್ ರಾಧಾಬಾಯಿ ಸುಬ್ಬರಾಯನ್',
  254: 'ವಿಠ್ಠಲ ರಾಂಜಿ ಶಿಂಧೆ',
  255: 'ಎಂ. ವೆಂಕಟಕೃಷ್ಣಯ್ಯ',
}

// Provisional Kannada renderings for bibliography titles that carry no Kannada script.
const SOURCE_KN = {
  '2': 'ಕರ್ನಾಟಕದ ಸಂಕ್ಷಿಪ್ತ ಇತಿಹಾಸ',
  '3': 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಗೆಜೆಟಿಯರ್',
  '6': 'ಚಿತ್ರಮಯ ಭಾರತ: ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದ ಇತಿಹಾಸ ಮತ್ತು ಗಾಂಧೀಜಿ',
  '7': 'ಹೈದರಾಬಾದ್ ವಿಮೋಚನಾ ಹೋರಾಟದ ಕಥೆ',
  '9': 'ನನ್ನ ಜೀವನ ಸ್ಮೃತಿಗಳು',
  '10': 'ಕರ್ನಾಟಕ ಗಾಥಾ ವೈಭವ',
  '11': 'ಸತ್ಯಾಗ್ರಹ: ಸತ್ಯದ ಶಕ್ತಿ',
  '12': 'ಗಾಂಧೀಯವರೊಂದಿಗೆ ನನ್ನ ಭೇಟಿ',
  '13': 'ಗಾಂಧೀಜಿಯವರ ಒಳನೋಟಗಳು',
  '14': 'ಸತ್ಯಾಗ್ರಹದ ಕಥೆ',
  '15': 'ಸಂಯುಕ್ತ ಕರ್ನಾಟಕ',
  '16': 'ಒಳಗಿನ ಕೋಣೆಗಳು, ಹೊರಗಿನ ಜಾಗಗಳು: ನೆನಪುಗಳು',
  '17': 'ಭಾರತೀಯ ಮಹಿಳೆಯರ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟ',
  '18': 'ಭಾರತೀಯ ಮಹಿಳೆಯರ ಜಾಗೃತಿ',
  '19': 'ಕರ್ನಾಟಕದ ಇತಿಹಾಸ',
  '20': 'ರಾಜಮನೆತನದ ಮೈಸೂರಿನ ವೈಭವ',
  '21': 'ಕರ್ನಾಟಕದಲ್ಲಿ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟ: ಮಹಿಳಾ ಹೋರಾಟಗಾರರ ಪಾತ್ರ',
  '22': 'ಕರ್ನಾಟಕದಲ್ಲಿ ಭಾರತೀಯ ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿಯಲ್ಲಿ ಮಹಿಳೆಯರ ಪಾತ್ರ',
  '23': 'ಅಂಕೋಲಾ ತಾಲೂಕಿನ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರ ಚಳವಳಿಗಳು',
  '24': 'ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದಲ್ಲಿ ಬಳ್ಳಾರಿ ಸಿದ್ಧಮ್ಮನ ಪಾತ್ರ',
  '25': 'ಕರ್ನಾಟಕ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದಲ್ಲಿ ಬೆಳಗಾವಿ ಕಾಂಗ್ರೆಸ್ ಅಧಿವೇಶನ',
  '26': 'ಆಲೂರು ವೆಂಕಟ ರಾವ್',
  '27': 'ಮಹಿಳಾ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರ ಪಾತ್ರ',
  '28': 'ಕರ್ನಾಟಕದ ಮಹಿಳಾ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರ ಪಾತ್ರ',
  '29': 'ಕಾಮತರ ಪಾಟ್ಪುರಿ — ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರು',
  '31': 'ಇತಿಹಾಸ ದರ್ಶನ',
  '32': 'ಡಿಜಿಟಲ್ ಜಿಲ್ಲಾ ಭಂಡಾರ',
  '33': 'ಪರಿಶಿಷ್ಟ I: 75 ಜಿಲ್ಲೆಗಳಿಗೆ ಅನುಗುಣವಾದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರ ಪಟ್ಟಿ',
  '34': 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ದಾಖಲಾಗಾರ',
  '35': 'ಕಾಮತ್ ಸಂಶೋಧನಾ ದತ್ತಾಂಶ',
  '36': 'ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರ ಪಿಂಚಣಿ/ಮಾನ್ಯತಾ ದಾಖಲೆಗಳು',
  '37': 'ಡೆಕ್ಕನ್ ಹೆರಾಲ್ಡ್',
  '38': 'ದ ನ್ಯೂಸ್ ಮಿನಿಟ್',
  '39': 'ದ ಬೆಟರ್ ಇಂಡಿಯಾ / ಇನುತ್',
  '41': 'ವರ್ಗ: ಕರ್ನಾಟಕದ ಭಾರತೀಯ ಸ್ವಾತಂತ್ರ್ಯ ಕಾರ್ಯಕರ್ತರು',
  '42': 'ವಿಭಜನೆಯಾಗದ ಚಿತ್ರದುರ್ಗ ಜಿಲ್ಲೆಯ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರು',
  '43': 'ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿಯ ಇತಿಹಾಸ',
  '44': 'ಯುಗಯುಗಗಳಲ್ಲಿ ಕರ್ನಾಟಕ',
  '45': 'ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದಲ್ಲಿ ಕರ್ನಾಟಕದ ಚಿತ್ರದುರ್ಗ',
  '46': 'ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದಲ್ಲಿ ಕರ್ನಾಟಕದ ಪಾತ್ರ',
  '47': 'ಕರ್ನಾಟಕದಲ್ಲಿ ಮರೆತುಹೋದ ಭಾರತೀಯ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದ ಘಟನೆಗಳು',
  '48': 'ಮೈಸೂರು ಗೆಜೆಟಿಯರ್',
  '49': 'ಮೈಸೂರು ಜಿಲ್ಲಾ ಗೆಜೆಟಿಯರ್ಗಳು',
  '50': 'ಕರ್ನಾಟಕ ಇತಿಹಾಸದ ಆಕರಗಳು',
  '51': 'ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರು',
  '52': 'ವರ್ಗ: ಕರ್ನಾಟಕದ ಕಾರ್ಯಕರ್ತರು',
}

function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += ch
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field); field = ''
    } else if (ch === '\n') {
      row.push(field); rows.push(row); row = []; field = ''
    } else if (ch === '\r') {
      // skip
    } else field += ch
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  const header = rows[0].map(h => h.replace(/^\uFEFF/, ''))
  return rows.slice(1).filter(r => r.some(c => c.trim() !== '')).map(r => {
    const obj = {}
    header.forEach((h, i) => { obj[h] = (r[i] ?? '').trim() })
    return obj
  })
}

const firstKannada = (...parts) => {
  for (const part of parts) {
    const m = (part || '').match(KANNADA_RE)
    if (m) return m[0].trim()
  }
  return ''
}

const stripKannada = (text) => {
  let s = text.replace(KANNADA_RE, '')
  s = s.replace(/^\s*[（(]+\s*/, '')
  s = s.replace(/\s*[)）]+\s*$/, '')
  s = s.replace(/[()（）]/g, '')
  s = s.replace(/\s{2,}/g, ' ').trim()
  return s.replace(/^[^\w]+/, '').trim()
}

const extractUrl = (...parts) => {
  for (const part of parts) {
    const m = (part || '').match(/https?:\/\/[^\s;,)]+/)
    if (m) return m[0]
  }
  return ''
}

const parseYear = (value) => {
  const m = String(value || '').match(/\b(1[89]\d{2}|20[0-2]\d)\b/)
  return m ? parseInt(m[0], 10) : null
}

const DISTRICTS = {
  'Bagalkot': 'audit-bagalkote',
  'Belagavi': 'audit-belagavi',
  'Bellary': 'audit-ballari',
  'Bengaluru': 'audit-bengaluru-urban',
  'Bidar': 'audit-bidar',
  'Chikkaballapur': 'audit-chikkaballapur',
  'Chitradurga': 'audit-chitradurga',
  'Dakshina Kannada': 'audit-dakshina-kannada',
  'Dharwad': 'audit-dharwad',
  'Gadag': 'audit-gadag',
  'Hassan': 'audit-hassan',
  'Haveri': 'audit-haveri',
  'Jamkhandi': 'audit-bagalkote',
  'Kodagu': 'audit-kodagu',
  'Kolar': 'audit-kolar',
  'Koppal': 'audit-koppal',
  'Mysuru': 'audit-mysuru',
  'Ramanagara': 'audit-ramanagara',
  'Shivamogga': 'audit-shivamogga',
  'Tumkur': 'audit-tumakuru',
  'Udupi': 'audit-udupi',
  'Uttara Kannada': 'audit-uttara-kannada',
  'Vijayanagara': 'audit-vijayanagara',
  'Vijayapura': 'audit-vijayapura',
}

function districtIdsFor(raw) {
  if (!raw || raw === '-' || !raw.trim()) return []
  if (/Doddaballapur/i.test(raw)) return ['audit-bengaluru-rural']
  const segment = raw.split(';')[0]
  const tokens = segment.split('/').map(t => t.trim().split('(')[0].trim())
  return [...new Set(tokens.map(t => DISTRICTS[t]).filter(Boolean))]
}

const POLITY_BY_ROW = {
  3: 'external-polity-ullal-chowta',
  23: 'external-polity-hyderabad-state',
  224: 'external-polity-hyderabad-state',
  233: 'external-polity-chitradurga-nayaka',
  234: 'external-polity-chitradurga-nayaka',
  235: 'external-polity-chitradurga-nayaka',
  236: 'external-polity-chitradurga-nayaka',
  248: 'external-polity-keladi-nayaka',
}
const DEFAULT_POLITY = 'external-polity-british-india'

const SKIP_ROWS = new Set([1, 2, 10, 12, 25, 81, 93, 157, 249, 250])
const WOMEN_ROWS = new Set([3, 11, 26, 27, 28, 79, 129, 130, 131, 132, 133, 134, 135, 136, 137, 145, 148, 152, 214, 251, 253])
const WOMAN_SUFFIX_RE = /(amma|bai|avva|tayi|akka|devi)$/i

const ROLES_ADD = [
  [/\bqueen\b/i, 'queen'],
  [/\bruler\b|\bking\b/i, 'ruler'],
  [/\bmilitary|commander|warrior|captain\b/i, 'military-leader'],
  [/\blieutenant\b/i, 'lieutenant'],
  [/\bdefender|defended|defence\b/i, 'defender'],
  [/\bresistance|anti-british|rebellion|uprising|revolt|satyagraha\b/i, 'resistance-fighter'],
  [/\borginis|organiz|seva dal|coordinated|mobilised|mobilized|led the/i, 'organiser'],
  [/social reformer|reformer|untouchability|harijan|depressed classes/i, 'social-reformer'],
  [/\bjournalist|newspaper|periodical|editor\b|ran the/i, 'journalist'],
  [/\bwriter\b|\bauthor\b|memoir|poetry/i, 'author'],
  [/\bpoet\b/i, 'poet'],
  [/\blawyer|barrister|advocate|jurist|judge\b|legal/i, 'administrator'],
  [/\bminister|chief minister|mla\b|mp\b|legislative|legislator|politician\b/i, 'minister'],
  [/\brevolutionary\b/i, 'resistance-fighter'],
  [/\bpeasant|agrarian|farmer|agriculturist\b/i, 'community-leader'],
  [/\bphysicist|scholar|educationist|educator|professor|university|rationalist\b/i, 'scholar'],
  [/\bsocial worker\b/i, 'social-reformer'],
]

function inferRoles(row) {
  const haystack = `${row['Name']} ${row['Known Detail / Note']}`
  if (row['Name'].toLowerCase().includes('halagali bedas')) return ['community-hero', 'resistance-fighter']
  const roles = ['freedom-fighter']
  for (const [re, role] of ROLES_ADD) {
    if (!roles.includes(role) && re.test(haystack)) roles.push(role)
  }
  return roles
}

function parseDate(note) {
  const unknown = { from: null, to: null, era: 'CE', precision: 'unknown' }
  if (!note) return unknown
  let m = note.match(/^(\d{4})\s*[–-]\s*(\d{4})\b/)
  if (m) return { from: parseInt(m[1], 10), to: parseInt(m[2], 10), era: 'CE', precision: 'range' }
  m = note.match(/(\d{4})\s*[–-]\s*(\d{4})\b/)
  if (m) return { from: parseInt(m[1], 10), to: parseInt(m[2], 10), era: 'CE', precision: 'range' }
  m = note.match(/\bb\.?\s*c?\.?\s*(\d{4})\b/)
  if (m) return { from: parseInt(m[1], 10), to: parseInt(m[1], 10), era: 'CE', precision: 'circa' }
  m = note.match(/\bd\.\s*(?:[A-Za-z]+\.?\s*)?(\d{4})\b/)
  if (m) return { from: parseInt(m[1], 10), to: parseInt(m[1], 10), era: 'CE', precision: 'circa' }
  m = note.match(/(\d{4})-(\d{2})\b/)
  if (m) return { from: parseInt(m[1], 10), to: parseInt(`${m[1].slice(0, 2)}${m[2]}`, 10), era: 'CE', precision: 'range' }
  const years = [...note.matchAll(/\b(1\d{3}|20\d{2})\b/g)].map(x => parseInt(x[0], 10))
  const distinct = [...new Set(years)]
  if (distinct.length >= 2) return { from: distinct[0], to: distinct[1], era: 'CE', precision: 'range' }
  if (distinct.length === 1) return { from: distinct[0], to: distinct[0], era: 'CE', precision: 'circa' }
  return unknown
}

function mapSources(sourceCell) {
  const ids = []
  const segments = String(sourceCell || '').split(';').flatMap(s => s.split('/')).map(s => s.trim()).filter(Boolean)
  for (const seg of segments) {
    const lower = seg.toLowerCase()
    let sourceId = null
    if (lower.includes('kannada wikipedia')) sourceId = 'src-ff-30'
    else if (lower.includes('english wikipedia')) sourceId = 'src-ff-41'
    else if (lower.includes('wikipedia')) sourceId = 'src-ff-wikipedia-en'
    else if (lower.includes('wikidata')) sourceId = 'src-ff-wikidata'
    else if (lower.includes('deccan herald')) sourceId = 'src-ff-37'
    else if (lower.includes('better india') || lower.includes('inuth')) sourceId = 'src-ff-39'
    else if (lower.includes('news minute')) sourceId = 'src-ff-38'
    else if (lower.includes('news karnataka')) sourceId = 'src-ff-news-karnataka'
    else if (lower.includes('the wire')) sourceId = 'src-ff-the-wire'
    else if (lower.includes('veethi')) sourceId = 'src-ff-veethi'
    else if (lower.includes('livehistoryindia')) sourceId = 'src-ff-livehistoryindia'
    else if (lower.includes('grokipedia')) sourceId = 'src-ff-grokipedia'
    else if (lower.includes('metrosaga')) sourceId = 'src-ff-metrosaga'
    else if (lower.includes('daijiworld')) sourceId = 'src-ff-daijiworld'
    else if (lower.includes('examarly')) sourceId = 'src-ff-examarly'
    else if (lower.includes('oliveboard')) sourceId = 'src-ff-oliveboard'
    else if (lower.includes('testbook')) sourceId = 'src-ff-testbook'
    else if (lower.includes('indian culture')) sourceId = 'src-ff-32'
    else if (lower.includes('rjhss')) sourceId = 'src-ff-21'
    else if (lower.includes('jetir')) sourceId = 'src-ff-22'
    else if (lower.includes('kamat research')) sourceId = 'src-ff-35'
    else if (lower.includes('kamat')) sourceId = 'src-ff-29'
    else if (lower.includes('nirmala sitharaman')) sourceId = 'src-ff-x-nirmala'
    else if (lower.includes('itihasa academy')) sourceId = 'src-ff-31'
    else if (lower.includes('sobagu') || lower.includes('tumkurinfo')) sourceId = 'src-ff-40'
    else if (lower.includes('ijcrt')) sourceId = 'src-ff-42'
    else if (lower.includes('siri-sampada')) sourceId = 'src-ff-51'
    else if (lower.includes('regional histories')) sourceId = 'src-ff-regional-histories'
    else if (lower.includes('vsk telangana')) sourceId = 'src-ff-vsk-telangana'
    if (sourceId && !ids.some(i => i.sourceId === sourceId)) ids.push({ sourceId, locator: seg })
  }
  return ids
}

function mapSourceType(type) {
  const t = String(type || '')
  if (/category \(wiki\)/.test(t)) return 'wikipedia'
  if (/gazetteer/i.test(t)) return 'government-gazetteer'
  if (/journal/i.test(t)) return 'journal-article'
  if (/newspaper|news/i.test(t)) return 'news'
  if (/government digital archive|government archive/i.test(t)) return 'government-archive'
  if (/government administrative record/i.test(t)) return 'government-record'
  if (/government/i.test(t)) return 'government-document'
  if (/book|autobiography|memoir/i.test(t)) return 'book'
  if (/blog|online encyclopedia|online database/i.test(t)) return 'web'
  return 'web'
}

function parseAuthors(authors) {
  return String(authors || '').split(';').map(a => a.trim()).filter(Boolean)
}

function buildSources(rows) {
  return rows.map(row => ({
    id: `src-ff-${row['No']}`,
    type: mapSourceType(row['Type']),
    title: { en: stripKannada(row['Title']) || row['Title'], kn: firstKannada(row['Title']) || SOURCE_KN[String(row['No'])] || '' },
    authors: parseAuthors(row['Author/Editor']),
    year: parseYear(row['Year']),
    url: extractUrl(row['Publisher/Source'], row['Notes']),
    scope: { en: row['Notes'], kn: '' },
    review: { ...REVIEW },
  }))
}

const EXTRA_SOURCES = [
  ['src-ff-wikipedia-en', 'Wikipedia', 'ವಿಕಿಪೀಡಿಯ', 'web', 'General English Wikipedia articles on Karnataka freedom fighters; item-level citation review pending.', ['Wikipedia contributors']],
  ['src-ff-wikidata', 'Wikidata', 'ವಿಕಿಡೇಟಾ', 'linked-open-data', 'Identity and occupation statements; requires independent biographical source confirmation.', ['Wikidata contributors']],
  ['src-ff-the-wire', 'The Wire', 'ದ ವೈರ್', 'news', 'Feature article on H. V. Kamath.', ['The Wire staff']],
  ['src-ff-veethi', 'Veethi', 'ವೀಥಿ', 'web', 'Professional biography profile.', ['Veethi contributors']],
  ['src-ff-livehistoryindia', 'Live History India', 'ಲೈವ್ ಹಿಸ್ಟರಿ ಇಂಡಿಯಾ', 'web', 'Historical feature profile.', ['Live History India editors']],
  ['src-ff-grokipedia', 'Grokipedia', 'ಗ್ರೋಕಿಪೀಡಿಯಾ', 'web', 'Crowd-maintained encyclopedia profile; low editorial authority.', ['Grokipedia contributors']],
  ['src-ff-metrosaga', 'MetroSaga', 'ಮೆಟ್ರೋಸಾಗಾ', 'web', 'Biographical blog profile.', ['MetroSaga editorial staff']],
  ['src-ff-daijiworld', 'Daijiworld', 'ದೈಜಿವರ್ಲ್ಡ್', 'news', 'Regional news feature.', ['Daijiworld News Network']],
  ['src-ff-examarly', 'Examarly', 'ಎಕ್ಸಾಮರ್ಲಿ', 'web', 'Biographical study note.', ['Examarly editors']],
  ['src-ff-oliveboard', 'Oliveboard', 'ಆಲಿವ್ಬೋರ್ಡ್', 'web', 'Biographical study note.', ['Oliveboard Editorial Team']],
  ['src-ff-testbook', 'Testbook', 'ಟೆಸ್ಟ್ಬುಕ್', 'web', 'Biographical study note.', ['Testbook Editorial Team']],
  ['src-ff-news-karnataka', 'News Karnataka', 'ನ್ಯೂಸ್ ಕರ್ನಾಟಕ', 'news', 'Regional news feature.', ['News Karnataka staff']],
  ['src-ff-regional-histories', 'Regional histories', 'ಪ್ರಾದೇಶಿಕ ಇತಿಹಾಸಗಳು', 'web', 'Compiled regional history sources; item-level citation review pending.', ['Karnataka Historical Atlas research team']],
  ['src-ff-x-nirmala', "X / Nirmala Sitharaman Office", 'ಎಕ್ಸ್ / ನಿರ್ಮಲಾ ಸೀತಾರಾಮನ್ ಕಚೇರಿ', 'news', 'Official social-media mention listing notable Karnataka freedom fighters.', ['Office of Nirmala Sitharaman']],
  ['src-ff-vsk-telangana', 'VSK Telangana archives', 'ವಿಎಸ್ಕೆ ತೆಲಂಗಾಣ ಆರ್ಕೈವ್', 'web', 'Archival republication; verify against primary sources.', ['VSK Telangana archives']],
]

function buildPeople(rows) {
  const people = []
  const unmapped = new Set()
  const noCitation = []
  for (const row of rows) {
    const no = parseInt(row['No'], 10)
    if (SKIP_ROWS.has(no)) continue
    const nameEn = row['Name']
    const kn = firstKannada(row['Name'], row['Known Detail / Note'], row['Source(s)']) || PERSON_KN[no] || ''
    const citations = mapSources(row['Source(s)'])
    if (!citations.length) noCitation.push({ no, name: nameEn, sources: row['Source(s)'] })
    for (const c of citations) {
      const seg = c.locator.toLowerCase()
      if (!/wikipedia|wikidata|deccan|better india|inuth|news|wire|veethi|livehistory|grokipedia|metrosaga|daijiworld|examarly|oliveboard|testbook|indian culture|rjhss|jetir|kamat|nirmala|itihasa|sobagu|tumkurinfo|ijcrt|siri|regional|vsk|history/i.test(seg)) unmapped.add(c.locator)
    }
    const districtIds = districtIdsFor(row['District/Place'])
    const districtAssociations = districtIds.map(districtId => ({
      districtId,
      kind: 'activity',
      citations: [{ sourceId: citations[0]?.sourceId || 'src-ff-wikipedia-en', locator: row['District/Place'] }],
    }))
    for (const association of DISTRICT_ASSOCIATION_OVERRIDES[no] || []) {
      if (districtAssociations.some(item => item.districtId === association.districtId && item.kind === association.kind)) continue
      districtAssociations.push({
        districtId: association.districtId,
        kind: association.kind,
        citations: [{ sourceId: association.sourceId, locator: association.locator }],
      })
      if (!citations.some(item => item.sourceId === association.sourceId)) citations.push({ sourceId: association.sourceId, locator: association.locator })
    }
    const isWoman = WOMEN_ROWS.has(no) || WOMAN_SUFFIX_RE.test(nameEn) || /^rani\b|^pandita\b/i.test(nameEn)
    const person = {
      id: `person-ff-${no}`,
      name: { en: nameEn, kn },
      roles: inferRoles(row),
      date: parseDate(row['Known Detail / Note']),
      polityId: POLITY_BY_ROW[no] || DEFAULT_POLITY,
      ...(isWoman ? { gender: 'woman' } : {}),
      ...(districtAssociations.length ? { districtAssociations } : {}),
      citations: citations.length ? citations.map(c => ({ sourceId: c.sourceId, locator: c.locator })) : [{ sourceId: 'src-ff-wikipedia-en', locator: row['Source(s)'] || 'Name-only entry; source pending review' }],
      review: { ...REVIEW },
    }
    people.push(person)
  }
  return { people, unmapped, noCitation }
}

const masterRows = parseCSV(readFileSync(MASTER_CSV, 'utf-8'))
const sourceRows = parseCSV(readFileSync(SOURCES_CSV, 'utf-8'))

const bibliographySources = buildSources(sourceRows)
const { people, unmapped, noCitation } = buildPeople(masterRows)

const freedomFighterPolities = [
  { id: 'external-polity-ullal-chowta', name: { en: 'Chowta dynasty of Ullal', kn: 'ಉಳ್ಳಾಲದ ಚೌಟ ವಂಶ' }, type: 'regional-polity', citations: [{ sourceId: 'src-ff-wikipedia-en', locator: 'Rani Abbakka and the Chowta rulers of Ullal; verify chronology against primary records' }], review: { ...REVIEW } },
  { id: 'external-polity-keladi-nayaka', name: { en: 'Keladi Nayaka kingdom', kn: 'ಕೆಳದಿ ನಾಯಕ ಸಂಸ್ಥಾನ' }, type: 'regional-polity', citations: [{ sourceId: 'src-ff-41', locator: 'Keladi Chennamma entry; verify regnal dates against contemporary records' }], review: { ...REVIEW } },
]

const q = (value) => JSON.stringify(value)
const sourcesBody = [
  ...bibliographySources.map(s => `  {id:'${s.id}',type:'${s.type}',title:n(${q(s.title.en)},${q(s.title.kn)}),authors:${q(s.authors)},year:${s.year ?? 'null'},url:${q(s.url)},scope:n(${q(s.scope.en)},''),review:{...review}}`),
  ...EXTRA_SOURCES.map(s => `  {id:'${s[0]}',type:'${s[3]}',title:n(${q(s[1])},${q(s[2])}),authors:${q(s[5])},year:null,url:'',scope:n(${q(s[4])},''),review:{...review}}`),
].join(',\n')
const politiesBody = freedomFighterPolities.map(p => `  {id:'${p.id}',name:n(${q(p.name.en)},${q(p.name.kn)}),type:'regional-polity',citations:[c('${p.citations[0].sourceId}',${q(p.citations[0].locator)})],review:{...review}}`).join(',\n')
const peopleBody = people.map(p => {
  const parts = [`id:'${p.id}'`, `name:n(${q(p.name.en)},${q(p.name.kn)})`, `roles:${q(p.roles)}`, `date:${q(p.date)}`, `polityId:'${p.polityId}'`]
  if (p.gender) parts.push(`gender:'${p.gender}'`)
  if (p.districtAssociations) {
    parts.push(`districtAssociations:[${p.districtAssociations.map(d => `{districtId:'${d.districtId}',kind:'${d.kind}',citations:[c('${d.citations[0].sourceId}',${q(d.citations[0].locator)})]}`).join(',')}]`)
  }
  parts.push(`citations:[${p.citations.map(x => `c('${x.sourceId}',${q(x.locator)})`).join(',')}]`)
  parts.push('review:{...review}')
  return `  {${parts.join(',')}}`
}).join(',\n')

const lines = [
  '// Generated by scripts/import-freedom-fighters.mjs — do not edit by hand.',
  'const n=(en,kn)=>({en,kn})',
  'const c=(sourceId,locator)=>({sourceId,locator})',
  'const review={status:\'needs-review\',reviewer:null,updatedAt:\'2026-08-01\'}',
  '',
  'export const freedomFighterSources=[',
  sourcesBody,
  ']',
  '',
  'export const freedomFighterPolities=[',
  politiesBody,
  ']',
  '',
  'export const freedomFighterPeople=[',
  peopleBody,
  ']',
  '',
]
writeFileSync(OUT_JS, lines.join('\n'))

console.log(`Master rows: ${masterRows.length}, source rows: ${sourceRows.length}`)
console.log(`People emitted: ${people.length} (skipped ${masterRows.length - people.length})`)
console.log(`Bibliography sources: ${bibliographySources.length}, extra sources: ${EXTRA_SOURCES.length}`)
if (noCitation.length) console.log(`Rows with no mapped source (fallback citation used): ${noCitation.map(x => x.no).join(', ')}`)
if (unmapped.size) console.log(`Unmapped source segments:\n  ${[...unmapped].join('\n  ')}`)
console.log(`Wrote ${OUT_JS}`)
