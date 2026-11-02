import { useEffect, useMemo, useState } from 'react'
import { dynastyAreasForYear } from './data/dynasty-areas'
import { VIEW, pathOf, washOf } from './DynastyGallery'
import { loadDistricts, loadStates } from './DynastyAreasLayer'

export const ERAS = [400, 700, 1000, 1200, 1400, 1600, 1800, 1900]
const copy = { kn: { title: 'ಯುಗಗಳ ಪ್ರಕಾರ ನಕ್ಷೆಗಳು', intro: 'ಆಯ್ದ ವರ್ಷಗಳಲ್ಲಿ ಆ ಕಾಲದ ರಾಜವಂಶಗಳ ದಾಖಲಾದ ಪ್ರಭಾವ. ಗಡಿಗಳಲ್ಲ; ಪರಿಶೀಲನೆ ಬಾಕಿ.', year: 'ಕ್ರಿ.ಶ.' }, en: { title: 'Maps by era', intro: 'Recorded influence of the dynasties active in selected years. Not borders; awaiting review.', year: 'CE' } }

// One small map per era: every dynasty active in that year, shaded around the evidence dated up to it.
export default function DynastyEras({ locale }) {
  const t = copy[locale] || copy.kn
  const [districts, setDistricts] = useState(null)
  const [states, setStates] = useState(null)
  useEffect(() => { let on = true; loadDistricts().then(data => on && setDistricts(data)); loadStates().then(data => on && setStates(data)); return () => { on = false } }, [])
  const shapes = useMemo(() => (districts?.features || []).map(feature => ({ id: feature.properties.id, d: pathOf(feature.geometry) })), [districts])
  const stateShapes = useMemo(() => (states?.features || []).map(feature => ({ id: feature.properties.id, d: pathOf(feature.geometry) })), [states])
  return <section className="dynasty-eras" aria-label={t.title}>
    <h3>{t.title}</h3><p>{t.intro}</p>
    <ol>{ERAS.map(year => {
      const { active } = dynastyAreasForYear(year)
      return <li key={year}>
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label={`${t.year} ${year}`}>
          <defs>{active.map(phase => <radialGradient key={phase.id} id={`era${year}-${phase.id}`}><stop offset="0" stopColor={phase.color} stopOpacity="1" /><stop offset="1" stopColor={phase.color} stopOpacity="0" /></radialGradient>)}</defs>
          {stateShapes.map(shape => <path key={shape.id} d={shape.d} fill="#f6f2e6" stroke="#ddd6c4" strokeWidth="1" />)}
          {shapes.map(shape => <path key={shape.id} d={shape.d} fill="#e6dfcc" stroke="#e6dfcc" strokeWidth=".6" />)}
          {active.flatMap(phase => washOf(phase, year).filter(disc => !disc.lead).map((disc, index) => <circle key={`${phase.id}${index}`} cx={disc.x} cy={disc.y} r={disc.r} fill={`url(#era${year}-${phase.id})`} fillOpacity={Math.min(1, disc.alpha * 3)} />))}
          {active.flatMap(phase => washOf(phase, year).filter(disc => disc.capital).map((disc, index) => <circle key={`c${phase.id}${index}`} cx={disc.x} cy={disc.y} r="9" fill={phase.color} stroke="#fff" strokeWidth="3" />))}
          {active.flatMap(phase => washOf(phase, year).filter(disc => disc.lead).map((disc, index) => <circle key={`l${phase.id}${index}`} cx={disc.x} cy={disc.y} r="8" fill="#fff" stroke={phase.color} strokeWidth="3" strokeDasharray="4 3" />))}
        </svg>
        <b>{t.year} {year}</b>
        <span>{active.map(phase => <i key={phase.id} style={{ '--c': phase.color }}>{phase.name[locale]}</i>)}</span>
      </li>
    })}</ol>
  </section>
}
