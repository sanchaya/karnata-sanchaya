import { useMemo } from 'react'
import { DYNASTY_PHASES } from './data/dynasty-areas'
import { evidenceFor } from './data/dynasty-evidence'

// Dynasties the atlas has not added yet. Names only: no dates or places are claimed until a contributor brings a source.
const WANTED = [
  { en: 'Sendrakas', kn: 'ಸೇಂದ್ರಕರು', why: { en: 'Early rulers in the Banavasi and Chikkamagaluru country, known from copper plates.', kn: 'ಬನವಾಸಿ-ಚಿಕ್ಕಮಗಳೂರು ಪ್ರದೇಶದ ಆರಂಭಿಕ ಅರಸರು; ತಾಮ್ರಶಾಸನಗಳಿಂದ ತಿಳಿದುಬರುತ್ತಾರೆ.' } },
  { en: 'Banas of Kolar', kn: 'ಕೋಲಾರದ ಬಾಣರು', why: { en: 'Chiefs of the Kolar and Nandi region under the Pallavas and Gangas.', kn: 'ಪಲ್ಲವ-ಗಂಗರ ಅಧೀನದಲ್ಲಿ ಕೋಲಾರ-ನಂದಿ ಪ್ರದೇಶದ ಅರಸರು.' } },
  { en: 'Guttas of Guttavolal', kn: 'ಗುತ್ತವೊಳಲಿನ ಗುತ್ತರು', why: { en: 'A Kannada chiefly line around Guttal in Haveri district.', kn: 'ಹಾವೇರಿ ಜಿಲ್ಲೆಯ ಗುತ್ತಲ ಸುತ್ತಲಿನ ಕನ್ನಡ ಅರಸು ಮನೆತನ.' } },
  { en: 'Chengalvas and Kongalvas', kn: 'ಚಂಗಾಳ್ವರು ಮತ್ತು ಕೊಂಗಾಳ್ವರು', why: { en: 'Hoysala-era chiefs of the Hunsur and Kodagu-Hassan hills.', kn: 'ಹೊಯ್ಸಳರ ಕಾಲದ ಹುಣಸೂರು ಮತ್ತು ಕೊಡಗು-ಹಾಸನ ಬೆಟ್ಟಗಳ ಅರಸರು.' } },
  { en: 'Qutb Shahis and the Nizam’s northern Karnataka', kn: 'ಕುತುಬ್‌ಶಾಹಿಗಳು ಮತ್ತು ನಿಜಾಮರ ಉತ್ತರ ಕರ್ನಾಟಕ', why: { en: 'Eastern edges of the Deccan sultanates; the Raichur doab and Kalyana Karnataka.', kn: 'ದಖ್ಖನ್ ಸುಲ್ತಾನರ ಪೂರ್ವ ಅಂಚು; ರಾಯಚೂರು ದೋಆಬ್ ಮತ್ತು ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ.' } },
]
const copy = {
  kn: { title: 'ನಿಮ್ಮ ಸಹಕಾರ ಬೇಕು', intro: 'ಈ ರಾಜವಂಶಗಳಿಗೆ ಅಟ್ಲಸ್‌ನಲ್ಲಿ ಕಡಿಮೆ ದಾಖಲೆ ಇದೆ. ಒಂದು ಶಾಸನ, ಸ್ಮಾರಕ ಅಥವಾ ಆಕರ ಸೇರಿಸಿದರೆ ನಕ್ಷೆಯಲ್ಲಿ ಅವರ ಛಾಯೆ ಬೆಳೆಯುತ್ತದೆ.', records: 'ದಾಖಲೆಗಳು', leads: 'ಸುಳಿವುಗಳು', add: 'ದಾಖಲೆ ಸೇರಿಸಿ →', wanted: 'ಇನ್ನೂ ನಕ್ಷೆಯಲ್ಲಿ ಇಲ್ಲದ ರಾಜವಂಶಗಳು', wantedHint: 'ಆಕರ ಸಹಿತ ವಿವರ ತಂದರೆ ಇವರನ್ನು ಸೇರಿಸುತ್ತೇವೆ.', wantedAdd: 'ಆಕರ ಸೇರಿಸಿ →' },
  en: { title: 'Help wanted', intro: 'These dynasties have few records in the atlas. One inscription, monument or source from you makes their shading grow on the map.', records: 'records', leads: 'leads', add: 'Add a record →', wanted: 'Dynasties not on the map yet', wantedHint: 'Bring a source and we add them.', wantedAdd: 'Add a source →' },
}

export default function DynastyHelpWanted({ locale }) {
  const t = copy[locale] || copy.kn
  const rows = useMemo(() => DYNASTY_PHASES.map(phase => {
    const points = evidenceFor(phase)
    return { phase, records: points.filter(point => point.kind !== 'lead').length, leads: points.filter(point => point.kind === 'lead').length }
  }).filter(row => row.records < 4).sort((a, b) => a.records - b.records || b.leads - a.leads), [])
  return <section className="dynasty-help" aria-label={t.title}>
    <h3>{t.title}</h3><p>{t.intro}</p>
    <ul>{rows.map(({ phase, records, leads }) => <li key={phase.id} style={{ '--c': phase.color }}>
      <strong>{phase.name[locale]}</strong><small>{phase.from}–{phase.to} · {records} {t.records}{leads ? ` · ${leads} ${t.leads}` : ''}</small>
      <a href="#contribute">{t.add}</a></li>)}</ul>
    <h4>{t.wanted}</h4><p>{t.wantedHint}</p>
    <ul className="dynasty-wanted">{WANTED.map(item => <li key={item.en}><strong>{item[locale]}</strong><small>{item.why[locale]}</small><a href="#contribute">{t.wantedAdd}</a></li>)}</ul>
  </section>
}
