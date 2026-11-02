import { useEffect, useMemo, useState } from 'react'
import { DYNASTY_PHASES } from './data/dynasty-areas'
import { loadDistricts } from './DynastyAreasLayer'

const LNG0 = 74, LAT1 = 18.6, K = 60, COS = 0.966
const ring = points => `M${points.map(([lng, lat]) => `${((lng - LNG0) * K * COS).toFixed(1)} ${((LAT1 - lat) * K).toFixed(1)}`).join('L')}Z`
const pathOf = geometry => (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates).flat().map(ring).join('')

// Every dynasty at a glance: a small district-shaped map each, named in its own era typeface where Fonts Sanchaya has one.
export default function DynastyGallery({ locale, fontFor, isActive, onSelect, canSelect }) {
  const [districts, setDistricts] = useState(null)
  useEffect(() => { let on = true; loadDistricts().then(data => on && setDistricts(data)); return () => { on = false } }, [])
  const shapes = useMemo(() => (districts?.features || []).map(feature => ({ id: feature.properties.id, d: pathOf(feature.geometry) })), [districts])
  const kn = locale === 'kn'
  return <section className="dynasty-gallery" aria-label={kn ? 'ಎಲ್ಲ ರಾಜವಂಶಗಳು' : 'All dynasties'}>
    <h3>{kn ? 'ಎಲ್ಲ ರಾಜವಂಶಗಳು ಮತ್ತು ಅವುಗಳ ಪ್ರದೇಶ (ಅಂದಾಜು)' : 'All dynasties and their areas (approximate)'}</h3>
    <ol>{DYNASTY_PHASES.map(phase => {
      const own = new Set(phase.districts)
      return <li key={phase.id}><button type="button" className={isActive(phase) ? 'active' : ''} disabled={!canSelect(phase)} onClick={() => onSelect(phase)}>
        <svg viewBox="0 0 280 420" role="img" aria-label={phase.name[locale]}>{shapes.map(shape => <path key={shape.id} d={shape.d} fill={own.has(shape.id) ? phase.color : '#ece6d6'} fillOpacity={own.has(shape.id) ? .8 : .6} stroke="#fff" strokeWidth="1" />)}</svg>
        <strong style={fontFor(phase) ? { fontFamily: fontFor(phase) } : undefined}>{phase.name[locale]}</strong>
        <small>{phase.from}–{phase.to}</small>
      </button></li>
    })}</ol>
  </section>
}
