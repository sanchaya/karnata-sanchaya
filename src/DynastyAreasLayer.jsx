import { useEffect, useMemo, useState } from 'react'
import { Circle, CircleMarker, GeoJSON, Marker, Pane, Popup, Tooltip } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { dynastyAreasFor, dynastyAreasForYear } from './data/dynasty-areas'
import { KIND_LABEL, WASH_ALPHA, WASH_KM, centroid, evidenceFor } from './data/dynasty-evidence'

const base = import.meta.env.BASE_URL
// Loaded once and only when the layer is on; the states file is ~75KB and only needed for the wider reach.
let statesPromise
export const loadStates = () => (statesPromise ||= fetch(`${base}south-asia-states.geojson`).then(response => response.json()).catch(() => null))

export const loadDistricts = () => (districtsPromise ||= fetch(`${base}karnataka-districts.geojson`).then(response => response.json()).catch(() => null))
let districtsPromise

// `phases` (an explicit list of dynasty phases) takes the place of the year when given.
export function useDynastyAreas(year, phases) {
  return useMemo(() => (phases ? dynastyAreasFor(phases) : dynastyAreasForYear(year)), [year, phases])
}

const copy = {
  kn: { thin: 'ಆಧಾರ ಕಡಿಮೆ', lead: 'ದಾಖಲೆ ಇನ್ನೂ ಇಲ್ಲ', leadNote: 'ಇತಿಹಾಸಕಾರರು ಈ ರಾಜವಂಶವನ್ನು ಇಲ್ಲಿ ಗುರುತಿಸುತ್ತಾರೆ; ಅಟ್ಲಸ್‌ನಲ್ಲಿ ಇನ್ನೂ ದಾಖಲೆ ಇಲ್ಲ. ಆಕರ ಸಹಿತ ದಾಖಲೆ ಸೇರಿಸಲು ಸಹಕರಿಸಿ.', contribute: 'ಸಹಕರಿಸಿ →', legend: 'ರಾಜವಂಶ ಪ್ರದೇಶಗಳು (ಅಂದಾಜು)', none: 'ಈ ವರ್ಷಕ್ಕೆ ಪ್ರದೇಶ ಚಿತ್ರಣ ಇಲ್ಲ', note: 'ಮೃದು ಛಾಯೆ = ಅಟ್ಲಸ್‌ನಲ್ಲಿ ದಾಖಲಾದ ರಾಜಧಾನಿ, ಶಾಸನ, ಸ್ಮಾರಕ, ನಾಣ್ಯ ಮತ್ತು ಘಟನೆಗಳ ಸುತ್ತಲಿನ ಅಂದಾಜು ಪ್ರಭಾವ. ಇದು ಗಡಿ ಅಲ್ಲ; ಪರಿಶೀಲನೆ ಬಾಕಿ. ತೆರೆದ ಉಂಗುರ = ಇನ್ನೂ ದಾಖಲೆ ಇಲ್ಲದ ಸ್ಥಳ; ದಾಖಲಿಸಲು ಸಹಕರಿಸಿ.' },
  en: { thin: 'thin evidence', lead: 'no record yet', leadNote: 'Historians place this dynasty here, but the atlas has no record yet. Help add one with a source.', contribute: 'Contribute →', legend: 'Dynasty areas (approximate)', none: 'No mapped dynasty for this year', note: 'Soft shading = estimated influence around capitals, inscriptions, monuments, coins and events recorded in the atlas. Not borders; awaiting review. Open rings = places with no record yet: help us document them.' },
}

// Each dynasty is drawn as overlapping soft washes around its recorded evidence, never as district or state fills: the kings did
// not rule modern units and their frontiers were zones. Several dynasties can share an area. `districtGeojson` (reference outlines only) is optional.
export default function DynastyAreasLayer({ year, locale, districtGeojson, phases, fontFor }) {
  const { active } = useDynastyAreas(year, phases)
  const t = copy[locale] || copy.kn
  const shown = useMemo(() => active.map(phase => ({ phase, points: evidenceFor(phase, phases ? Infinity : year) })).filter(item => item.points.length), [active, phases, year])
  return <>
    {districtGeojson && <GeoJSON interactive={false} data={districtGeojson} style={{ color: '#8f877a', weight: .8, dashArray: '2 4', fill: false }} />}
    <Pane name="dynasty-wash" style={{ zIndex: 330 }} className="dynasty-wash-pane">
      {shown.flatMap(({ phase, points }) => points.filter(point => point.kind !== 'lead').map((point, index) => <Circle key={`${phase.id}-${index}`} center={[point.lat, point.lng]} radius={WASH_KM[point.tier] * 1000} interactive={false} pathOptions={{ stroke: false, fillColor: phase.color, fillOpacity: WASH_ALPHA[point.tier] }} />))}
    </Pane>
    {shown.flatMap(({ phase, points }) => points.map((point, index) => point.kind === 'lead'
      ? <CircleMarker key={`dot-${phase.id}-${index}`} center={[point.lat, point.lng]} radius={8} pathOptions={{ color: phase.color, weight: 2.5, dashArray: '3 3', fillColor: '#fff', fillOpacity: .9 }}>
        <Tooltip>{phase.name[locale]} · {point.label[locale]} · {t.lead}</Tooltip>
        <Popup><b>{point.label[locale]}</b><br />{t.leadNote}<br /><a href="#contribute">{t.contribute}</a></Popup>
      </CircleMarker>
      : <CircleMarker key={`dot-${phase.id}-${index}`} center={[point.lat, point.lng]} radius={point.kind === 'capital' ? 5 : 3} pathOptions={{ color: '#fff', weight: 1, fillColor: phase.color, fillOpacity: 1 }}>
        <Tooltip>{phase.name[locale]} · {KIND_LABEL[locale]?.[point.kind] || point.kind}{point.label ? ` · ${point.label[locale] || point.label.en || ''}` : ''}{point.from ? ` · ${point.from}` : ''}</Tooltip>
      </CircleMarker>))}
    {shown.map(({ phase, points }) => {
      const core = points.filter(point => point.tier !== 'influence' && point.tier !== 'lead')
      const center = centroid(core.length ? core : points)
      return center && <Marker key={`label-${phase.id}`} position={center} interactive={false} keyboard={false}
        icon={divIcon({ className: 'dynasty-area-label', html: `<span style="border-color:${phase.color}${fontFor?.(phase) ? `;font-family:${fontFor(phase).replaceAll('"', "'")}` : ''}">${fontFor && locale === 'en' ? `${phase.name.kn}<small>${phase.name.en}</small>` : phase.name[locale]}${points.filter(point => point.kind !== 'lead').length < 3 ? `<small>${t.thin}</small>` : ''}</span>` })} />
    })}
  </>
}

export function DynastyAreasLegend({ year, locale }) {
  const { active } = useDynastyAreas(year)
  const t = copy[locale] || copy.kn
  return <div className="dynasty-legend">
    <b>{t.legend}</b>
    {active.length ? active.map(phase => <span key={phase.id}><i style={{ background: phase.color }} />{phase.name[locale]} · {phase.from}–{phase.to}</span>) : <span>{t.none}</span>}
    <small>{t.note}</small>
  </div>
}
