import { CENSUS_ATLAS_MAP_URL, CENSUS_ATLAS_PROFILES } from './data/census-historical-atlas'

const copy = {
  kn: { title: 'ಆಕರ ಪರಿಚಯ', source: 'ಭಾರತದ ಜನಗಣತಿ 2001: ಕರ್ನಾಟಕದ ಐತಿಹಾಸಿಕ ಭೂಪಟ ಸಂಗ್ರಹ (2004)', map: 'ನಕ್ಷೆ', period: 'ಆ ಆಕರದ ಅವಧಿ', ours: 'ನಮ್ಮ ಅವಧಿ', differs: 'ಭಿನ್ನ: ಪರಿಶೀಲಿಸಬೇಕು', same: 'ಹೊಂದುತ್ತದೆ', area: 'ಗರಿಷ್ಠ ವ್ಯಾಪ್ತಿ (ಅಂದಾಜು)', capitals: 'ರಾಜಧಾನಿ', origin: 'ಮೂಲ', rulers: 'ಪ್ರಮುಖ ದೊರೆಗಳು', languages: 'ಭಾಷೆಗಳು', works: 'ಕೃತಿಗಳು', monuments: 'ಸ್ಮಾರಕಗಳು', open: 'ಆಕರ ತೆರೆಯಿರಿ ↗', note: 'ದಿನಾಂಕ, ಹೆಸರು, ಸ್ಥಳ ಮತ್ತು ಅಂಕಿಗಳನ್ನು ಮಾತ್ರ ಇಲ್ಲಿ ದಾಖಲಿಸಲಾಗಿದೆ; ಪಠ್ಯ ಮತ್ತು ನಕ್ಷೆಗಳನ್ನು ನಕಲಿಸಿಲ್ಲ. ಆ ಪುಸ್ತಕದ ನಕ್ಷೆಗಳೂ ಅಂದಾಜು. ಪರಿಶೀಲನೆ ಬಾಕಿ.', unknown: 'ನಮೂದಿಸಿಲ್ಲ', km: 'ಚ.ಕಿ.ಮೀ.' },
  en: { title: 'Reference profile', source: 'Census of India 2001: A Historical Atlas of Karnataka (2004)', map: 'Map', period: 'Atlas period', ours: 'Our span', differs: 'differs: check', same: 'matches', area: 'Greatest extent (approx.)', capitals: 'Capital', origin: 'Origin', rulers: 'Important rulers', languages: 'Languages', works: 'Works', monuments: 'Monuments', open: 'Open the atlas ↗', note: 'Only dates, names, places and figures are recorded here; no text or map is copied. The book’s own maps are approximate. Awaiting review.', unknown: 'not given', km: 'sq km' },
}
const span = (from, to) => (from == null ? null : `${from < 0 ? `${-from} BCE` : from}–${to}`)

// What the government's Census atlas says about the chosen dynasty, set beside our own span so differences are visible for review.
export default function DynastyProfile({ phase, locale }) {
  const profile = CENSUS_ATLAS_PROFILES.find(item => item.phaseId === phase?.id)
  if (!profile) return null
  const t = copy[locale] || copy.kn
  const theirs = span(profile.period.from, profile.period.to)
  const matches = profile.period.from == null || (profile.period.from === phase.from && profile.period.to === phase.to)
  const rows = [
    [t.capitals, profile.capitals.join('; ')], [t.origin, profile.origin], [t.rulers, profile.rulers.join(', ')], [t.languages, profile.languages.join(', ')],
    [t.works, profile.works.join('; ')], [t.monuments, profile.monuments.join('; ')],
  ].filter(([, value]) => value)
  return <section className="dynasty-profile" aria-label={t.title}>
    <h3>{t.title}: {phase.name[locale]}</h3>
    <p className="dynasty-profile-source">{t.source} · {t.map} {profile.map}</p>
    <dl>
      <div><dt>{t.period}</dt><dd>{theirs || t.unknown} <small>· {t.ours} {phase.from}–{phase.to} · <b className={matches ? 'ok' : 'check'}>{matches ? t.same : t.differs}</b></small></dd></div>
      {profile.areaKm2 && <div><dt>{t.area}</dt><dd>{profile.areaKm2.toLocaleString('en-IN')} {t.km}</dd></div>}
      {rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
    <p className="dynasty-profile-note">{t.note} <a href={CENSUS_ATLAS_MAP_URL} target="_blank" rel="noreferrer">{t.open}</a></p>
  </section>
}
