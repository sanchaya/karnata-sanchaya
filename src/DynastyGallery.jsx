import { useEffect, useMemo, useState } from 'react'
import { DYNASTY_PHASES } from './data/dynasty-areas'
import { ERA_FONTS } from './data/era-fonts'
import { loadDistricts, loadStates } from './DynastyAreasLayer'
import { WASH_ALPHA, WASH_KM, evidenceFor } from './data/dynasty-evidence'

// Karnataka plus the neighbouring states a dynasty may have held: lng 73.5-81, lat 8-21.
const LNG0 = 73.5, LAT1 = 21, K = 48, COS = 0.966
export const VIEW = { w: 348, h: 624 }
const ring = points => `M${points.map(([lng, lat]) => `${((lng - LNG0) * K * COS).toFixed(1)} ${((LAT1 - lat) * K).toFixed(1)}`).join('L')}Z`
export const pathOf = geometry => (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates).flat().map(ring).join('')

// The era typeface only draws Kannada, so an English page keeps the Kannada name in it and adds the English name beneath.
export const eraFamily = phase => ERA_FONTS[phase.polityId]?.family
// Name lines, in order: Kannada, the same name in the era typeface (where Fonts Sanchaya has one), then English on the English site.
export const nameLines = (phase, locale) => [
  { text: phase.name.kn, family: null },
  ...(eraFamily(phase) ? [{ text: phase.name.kn, family: eraFamily(phase) }] : []),
  ...(locale === 'en' ? [{ text: phase.name.en, family: null, latin: true }] : []),
]

// Evidence washes in thumbnail/poster coordinates (the same projection as the paths): one soft disc per recorded point.
export const washOf = (phase, year = Infinity) => evidenceFor(phase, year).map(point => ({
  x: (point.lng - LNG0) * K * COS, y: (LAT1 - point.lat) * K, r: (WASH_KM[point.tier] / 111) * K, alpha: WASH_ALPHA[point.tier], capital: point.kind === 'capital', lead: point.kind === 'lead',
}))

// The dynasty picker: a thumbnail per dynasty (soft washes around its recorded evidence on a plain Karnataka outline), named in its era typeface where there is one.
export default function DynastyGallery({ locale, selectedId, onSelect }) {
  const [districts, setDistricts] = useState(null)
  const [states, setStates] = useState(null)
  useEffect(() => { let on = true; loadDistricts().then(data => on && setDistricts(data)); loadStates().then(data => on && setStates(data)); return () => { on = false } }, [])
  const shapes = useMemo(() => (districts?.features || []).map(feature => ({ id: feature.properties.id, d: pathOf(feature.geometry) })), [districts])
  return <ol className="dynasty-gallery">{DYNASTY_PHASES.map(phase => {
    const wash = washOf(phase)
    return <li key={phase.id}><button type="button" aria-pressed={selectedId === phase.id} className={selectedId === phase.id ? 'active' : ''} onClick={() => onSelect?.(phase)}>
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label={phase.name[locale]}>
        <defs><radialGradient id={`wash-${phase.id}`}><stop offset="0" stopColor={phase.color} stopOpacity="1" /><stop offset="1" stopColor={phase.color} stopOpacity="0" /></radialGradient></defs>
        {(states?.features || []).map(feature => <path key={feature.properties.id} d={pathOf(feature.geometry)} fill="#f6f2e6" stroke="#ddd6c4" strokeWidth="1" />)}
        {shapes.map(shape => <path key={shape.id} d={shape.d} fill="#e6dfcc" stroke="#e6dfcc" strokeWidth=".6" />)}
        {wash.filter(disc => !disc.lead).map((disc, index) => <circle key={index} cx={disc.x} cy={disc.y} r={disc.r} fill={`url(#wash-${phase.id})`} fillOpacity={Math.min(1, disc.alpha * 3)} />)}
        {wash.map((disc, index) => <circle key={`d${index}`} cx={disc.x} cy={disc.y} r={disc.capital ? 11 : 6} fill={disc.lead ? '#fff' : phase.color} stroke={disc.lead ? phase.color : '#fff'} strokeWidth="3" strokeDasharray={disc.lead ? '4 3' : undefined} />)}
      </svg>
      <span>{nameLines(phase, locale).map((line, index) => <strong key={index} lang={line.latin ? 'en' : 'kn'} className={line.latin ? 'latin' : ''} style={line.family ? { fontFamily: `"${line.family}",serif` } : undefined}>{line.text}</strong>)}<small>{phase.from}–{phase.to}</small></span>
    </button></li>
  })}</ol>
}
