import { CENSUS_ATLAS_METHOD, CENSUS_ATLAS_MAP_URL } from './data/census-historical-atlas'

const copy = {
  kn: {
    title: 'ಈ ನಕ್ಷೆಗಳು ಯಾವ ಊಹೆಗಳ ಮೇಲೆ ನಿಂತಿವೆ',
    covers: 'ಏನು ಒಳಗೊಂಡಿದೆ',
    misses: 'ಏನು ಇಲ್ಲ',
    coversList: [
      'ಮೃದು ಛಾಯೆ = ಅಟ್ಲಸ್‌ನಲ್ಲಿ ಆ ರಾಜವಂಶಕ್ಕೆ ದಾಖಲಾದ ರಾಜಧಾನಿ, ಶಾಸನ, ಸ್ಮಾರಕ, ನಾಣ್ಯ ಮತ್ತು ಘಟನೆಗಳ ಸುತ್ತಲಿನ ಅಂದಾಜು ಪ್ರಭಾವ. ಇದು ಗಡಿ ಅಲ್ಲ.',
      'ದಾಖಲೆಗಳು ಆಯ್ದ ವರ್ಷದವರೆಗೆ ಮಾತ್ರ ಲೆಕ್ಕಕ್ಕೆ ಬರುತ್ತವೆ; ದಿನಾಂಕವಿಲ್ಲದ ದಾಖಲೆ ಯಾವಾಗಲೂ ಲೆಕ್ಕಕ್ಕೆ ಬರುತ್ತದೆ.',
      'ರಾಜವಂಶದ ವರ್ಷಗಳು ಸಾಂಪ್ರದಾಯಿಕ ಅವಧಿ. ಹಲವು ರಾಜವಂಶಗಳು ಒಂದೇ ಪ್ರದೇಶದಲ್ಲಿ ಒಟ್ಟಿಗೆ ಕಾಣಬಹುದು (ಸಾಮಂತರು, ಪ್ರತಿಸ್ಪರ್ಧಿಗಳು); ಯಾರೂ “ಗೆಲ್ಲುವುದಿಲ್ಲ”.',
      'ಯುದ್ಧ-ಸೇನಾಯಾತ್ರೆಯ ಸ್ಥಳಗಳು ಮಸುಕಾದ ಹಾಗೂ ಅಗಲ ಛಾಯೆ; ವಿದೇಶಗಳಲ್ಲಿನ ದೂತಾವಾಸ-ವ್ಯಾಪಾರ ಘಟನೆಗಳನ್ನು ಸೇರಿಸಿಲ್ಲ.',
    ],
    missesList: [
      'ಯಾವುದೇ ಜಿಲ್ಲೆ-ರಾಜ್ಯದ ಗಡಿ ಅಥವಾ ಸಮೀಕ್ಷಿತ ಹದ್ದುಬಸ್ತಿಲ್ಲ. ಇಂದಿನ ಜಿಲ್ಲೆಗಳ ರೇಖೆ ಉಲ್ಲೇಖಕ್ಕೆ ಮಾತ್ರ.',
      'ದಾಖಲೆ ಕಡಿಮೆ ಇರುವ ರಾಜವಂಶಗಳಿಗೆ ರಾಜಧಾನಿ ಮಾತ್ರ ತೋರಿಸಲಾಗಿದೆ (“ಆಧಾರ ಕಡಿಮೆ”). ತೆರೆದ ಉಂಗುರ = ಇತಿಹಾಸಕಾರರು ಸೂಚಿಸುವ ಆದರೆ ಅಟ್ಲಸ್‌ನಲ್ಲಿ ಇನ್ನೂ ದಾಖಲೆ ಇಲ್ಲದ ಸ್ಥಳ.',
      'ಕೆಲವು ಶಾಸನಗಳ ಸ್ಥಳ ಗ್ರಾಮದ ಬದಲು ತಾಲ್ಲೂಕು ಕೇಂದ್ರದ ಅಂದಾಜು.',
      'ಸೇಂದ್ರಕರು, ಬಾಣರು, ಗುತ್ತರು, ಚಂಗಾಳ್ವ-ಕೊಂಗಾಳ್ವರಿಗೆ ಕೇಂದ್ರ ಮತ್ತು ಅವಧಿ ಅಂದಾಜು ಮಾತ್ರ. ಇನ್ನೂ ಸೇರದ ರಾಜವಂಶಗಳಿವೆ (ಉದಾ: ಕುತುಬ್‌ಶಾಹಿಗಳು). ಎಲ್ಲವೂ ಪರಿಶೀಲನೆ ಬಾಕಿ.',
    ],
    cta: 'ತಪ್ಪು ಅಥವಾ ಕೊರತೆ ಕಂಡರೆ ಆಕರ ಸಹಿತ ಸೇರಿಸಲು ಸಹಕರಿಸಿ',
    link: 'ಸಹಕರಿಸಿ →',
  },
  en: {
    title: 'What these maps assume',
    covers: 'What is covered',
    misses: 'What is not',
    coversList: [
      'Soft shading = estimated influence around the capital, inscriptions, monuments, coins and events the atlas records for that dynasty. It is not a border.',
      'Records count only up to the chosen year; an undated record always counts.',
      'Dynasty dates are conventional spans. Several dynasties can share an area (feudatories, rivals); nobody “wins” an overlap.',
      'Campaign and battle sites get a fainter, wider wash; overseas embassies and trade contacts are left out.',
    ],
    missesList: [
      'No district or state borders and no surveyed frontiers. Modern district outlines are for reference only.',
      'Dynasties with few records show a capital only (“thin evidence”). An open ring marks a place historians suggest but the atlas has no record for yet.',
      'Some inscriptions are placed at the taluk town, not the village.',
      'For the Sendrakas, Banas, Guttas, Chengalvas and Kongalvas the seat and span are rough estimates. Some dynasties are not added yet (for example the Qutb Shahis). Everything is awaiting review.',
    ],
    cta: 'Spot a mistake or a gap? Help add it with a source',
    link: 'Contribute →',
  },
}

export default function DynastyAssumptions({ locale }) {
  const t = copy[locale] || copy.kn
  return <section className="dynasty-assumptions" aria-label={t.title}>
    <h3>{t.title}</h3>
    <div>
      <div><h4>{t.covers}</h4><ul>{t.coversList.map(line => <li key={line}>{line}</li>)}</ul></div>
      <div><h4>{t.misses}</h4><ul>{t.missesList.map(line => <li key={line}>{line}</li>)}</ul></div>
    </div>
    <p className="dynasty-assumptions-source">{CENSUS_ATLAS_METHOD[locale] || CENSUS_ATLAS_METHOD.kn} <a href={CENSUS_ATLAS_MAP_URL} target="_blank" rel="noreferrer">↗</a></p>
    <p>{t.cta} <a href="#contribute">{t.link}</a></p>
  </section>
}
