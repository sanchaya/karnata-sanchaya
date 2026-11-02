import { useEffect, useMemo, useState } from 'react'
import { DYNASTY_PHASES } from './data/dynasty-areas'
import { ERA_FONTS } from './data/era-fonts'
import { loadDistricts } from './DynastyAreasLayer'

const LNG0 = 74, LAT1 = 18.6, K = 60, COS = 0.966
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

// Every dynasty at a glance: a district-shaped map each, named in its own era typeface where Fonts Sanchaya has one.
export default function DynastyGallery({ locale, selectedId, onSelect }) {
  const [districts, setDistricts] = useState(null)
  useEffect(() => { let on = true; loadDistricts().then(data => on && setDistricts(data)); return () => { on = false } }, [])
  const shapes = useMemo(() => (districts?.features || []).map(feature => ({ id: feature.properties.id, d: pathOf(feature.geometry) })), [districts])
  return <ol className="dynasty-gallery">{DYNASTY_PHASES.map(phase => {
    const own = new Set(phase.districts)
    return <li key={phase.id}><button type="button" aria-pressed={selectedId === phase.id} className={selectedId === phase.id ? 'active' : ''} onClick={() => onSelect?.(phase)}>
      <svg viewBox="0 0 280 420" role="img" aria-label={phase.name[locale]}>{shapes.map(shape => <path key={shape.id} d={shape.d} fill={own.has(shape.id) ? phase.color : '#ece6d6'} fillOpacity={own.has(shape.id) ? .8 : .6} stroke="#fff" strokeWidth="1" />)}</svg>
      {nameLines(phase, locale).map((line, index) => <strong key={index} lang={line.latin ? 'en' : 'kn'} className={line.latin ? 'latin' : ''} style={line.family ? { fontFamily: `"${line.family}",serif` } : undefined}>{line.text}</strong>)}
      <small>{phase.from}–{phase.to}</small>
    </button></li>
  })}</ol>
}
