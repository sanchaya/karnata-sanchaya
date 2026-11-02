import { useEffect, useMemo, useState } from 'react'
import { GeoJSON, Marker } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { dynastyAreasFor, dynastyAreasForYear } from './data/dynasty-areas'

const base = import.meta.env.BASE_URL
const ringsOf = geometry => (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates).flat()
const centerOf = features => {
  const points = features.flatMap(feature => ringsOf(feature.geometry).flat())
  if (!points.length) return null
  const lngs = points.map(point => point[0]), lats = points.map(point => point[1])
  return [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2]
}

// Loaded once and only when the layer is on; the states file is ~75KB and only needed for the wider reach.
let statesPromise
const loadStates = () => (statesPromise ||= fetch(`${base}south-asia-states.geojson`).then(response => response.json()).catch(() => null))

export const loadDistricts = () => (districtsPromise ||= fetch(`${base}karnataka-districts.geojson`).then(response => response.json()).catch(() => null))
let districtsPromise

// `phases` (an explicit list of dynasty phases) takes the place of the year when given.
export function useDynastyAreas(year, phases) {
  return useMemo(() => (phases ? dynastyAreasFor(phases) : dynastyAreasForYear(year)), [year, phases])
}

export default function DynastyAreasLayer({ year, locale, districtGeojson, phases, fontFor }) {
  const { active, byDistrict, byState } = useDynastyAreas(year, phases)
  const [states, setStates] = useState(null)
  useEffect(() => { let on = true; loadStates().then(data => on && setStates(data)); return () => { on = false } }, [])
  const signature = active.map(phase => phase.id).join('|')
  const labels = useMemo(() => active.map(phase => {
    const features = (districtGeojson?.features || []).filter(feature => byDistrict.get(feature.properties.id) === phase)
    const center = centerOf(features)
    return center && { phase, center }
  }).filter(Boolean), [active, byDistrict, districtGeojson])
  const reachStates = states && { ...states, features: states.features.filter(feature => byState.has(feature.properties.id) && feature.properties.id !== 'in-karnataka') }
  return <>
    {reachStates?.features.length > 0 && <GeoJSON interactive={false} key={`reach-${signature}`} data={reachStates} style={feature => ({ color: byState.get(feature.properties.id).color, weight: 1.2, dashArray: '5 4', fillColor: byState.get(feature.properties.id).color, fillOpacity: .14 })} />}
    {districtGeojson && <GeoJSON key={`areas-${signature}-${locale}`} data={districtGeojson} style={feature => {
      const phase = byDistrict.get(feature.properties.id)
      return phase ? { color: '#fff', weight: 1.4, fillColor: phase.color, fillOpacity: .62 } : { color: '#a9a39a', weight: 1, dashArray: '3 4', fillColor: '#ece6d6', fillOpacity: .35 }
    }} onEachFeature={(feature, layer) => {
      const phase = byDistrict.get(feature.properties.id)
      const name = feature.properties.districtName?.[locale] || feature.properties.district
      layer.bindTooltip(`${name} · ${phase ? phase.name[locale] : (locale === 'kn' ? 'ಈ ವರ್ಷ ಯಾವ ರಾಜವಂಶವೂ ದಾಖಲಾಗಿಲ್ಲ' : 'no dynasty mapped this year')}`, { sticky: true })
    }} />}
    {labels.map(({ phase, center }) => <Marker key={`${phase.id}-${signature}`} position={center} interactive={false} keyboard={false}
      icon={divIcon({ className: 'dynasty-area-label', html: `<span style="border-color:${phase.color}${fontFor?.(phase) ? `;font-family:${fontFor(phase).replaceAll('"', "'")}` : ''}">${phase.name[locale]}</span>`, iconSize: [0, 0] })} />)}
  </>
}

export function DynastyAreasLegend({ year, locale }) {
  const { active } = useDynastyAreas(year)
  const kn = locale === 'kn'
  return <div className="dynasty-legend">
    <b>{kn ? 'ರಾಜವಂಶ ಪ್ರದೇಶಗಳು (ಅಂದಾಜು)' : 'Dynasty areas (approximate)'}</b>
    {active.length ? active.map(phase => <span key={phase.id}><i style={{ background: phase.color }} />{phase.name[locale]} · {phase.from}–{phase.to}</span>) : <span>{kn ? 'ಈ ವರ್ಷಕ್ಕೆ ಪ್ರದೇಶ ಚಿತ್ರಣ ಇಲ್ಲ' : 'No mapped dynasty for this year'}</span>}
    <small>{kn ? 'ಇಂದಿನ ಜಿಲ್ಲೆ/ರಾಜ್ಯ ಘಟಕಗಳ ಆಧಾರದ ಅಂದಾಜು; ಪರಿಶೀಲನೆ ಬಾಕಿ. ಚುಕ್ಕೆ ಗಡಿ = ವಿಸ್ತೃತ ಪ್ರಭಾವ.' : 'Assumed from modern district/state units; awaiting review. Dashed = wider reach.'}</small>
  </div>
}
