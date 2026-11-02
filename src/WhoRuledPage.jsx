import { useEffect, useMemo, useState } from 'react'
import { Circle, CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from 'react-leaflet'
import { DYNASTY_PHASES } from './data/dynasty-areas'
import { KIND_LABEL, evidenceFor } from './data/dynasty-evidence'
import { atlasData } from './data/atlas'
import { loadDistricts } from './DynastyAreasLayer'
import './script-fonts.css'

const FROM = 100, TO = 1950, TICKS = [200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800]
const copy = {
  kn: {
    eyebrow: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ', title: 'ಇಲ್ಲಿ ಯಾರು ಆಳಿದರು?',
    intro: 'ಒಂದು ಸ್ಥಳವನ್ನು ಆರಿಸಿ: ಅಲ್ಲಿ ಯಾವ ರಾಜವಂಶಗಳ ಆಧಾರಗಳು (ರಾಜಧಾನಿ, ಶಾಸನ, ಸ್ಮಾರಕ, ನಾಣ್ಯ, ಘಟನೆ) ಹತ್ತಿರದಲ್ಲಿವೆ ಎಂದು ಕಾಲಕ್ರಮದಲ್ಲಿ ತೋರಿಸುತ್ತೇವೆ. ಇದು ಗಡಿ ಅಲ್ಲ; ಹತ್ತಿರದ ದಾಖಲೆಗಳು ಮಾತ್ರ.',
    place: 'ಸ್ಥಳ ಹುಡುಕಿ', placeHint: 'ಉದಾ: ಹಂಪಿ', district: 'ಜಿಲ್ಲೆ', anyDistrict: '— ಜಿಲ್ಲೆ ಆರಿಸಿ —', radius: 'ಹತ್ತಿರ (ಕಿ.ಮೀ.)', clickMap: 'ಅಥವಾ ನಕ್ಷೆಯ ಮೇಲೆ ಒತ್ತಿ',
    none: 'ಈ ಸ್ಥಳದ ಹತ್ತಿರ ಯಾವ ರಾಜವಂಶದ ದಾಖಲೆಯೂ ಇಲ್ಲ. ತ್ರಿಜ್ಯ ಹೆಚ್ಚಿಸಿ ಅಥವಾ ದಾಖಲೆ ಸೇರಿಸಲು ಸಹಕರಿಸಿ.',
    pickFirst: 'ಸ್ಥಳ ಆರಿಸಿದಾಗ ಅಲ್ಲಿ ದಾಖಲೆ ಇರುವ ರಾಜವಂಶಗಳು ಕೆಳಗಿನ ಕಾಲರೇಖೆಯಲ್ಲಿ ಗಾಢವಾಗಿ ಕಾಣುತ್ತವೆ.',
    results: 'ಈ ಸ್ಥಳದ ಹತ್ತಿರ ದಾಖಲೆ ಇರುವ ರಾಜವಂಶಗಳು', timeline: 'ಎಲ್ಲ ರಾಜವಂಶಗಳ ಕಾಲರೇಖೆ', away: 'ಕಿ.ಮೀ.', records: 'ದಾಖಲೆಗಳು', thin: 'ಆಧಾರ ಕಡಿಮೆ',
    note: 'ಅಂದಾಜು; ಪರಿಶೀಲನೆ ಬಾಕಿ. ದಾಖಲೆ ಇದ್ದ ಮಾತ್ರಕ್ಕೆ ಆ ರಾಜವಂಶ ಅಲ್ಲಿ ಆಳಿತು ಎಂದಲ್ಲ; ಅಲ್ಲಿ ಅದರ ಪ್ರಭಾವ ಅಥವಾ ಸಂಪರ್ಕ ದಾಖಲಾಗಿದೆ ಎಂದರ್ಥ.',
    seeMap: 'ರಾಜವಂಶ ಭೂಪಟದಲ್ಲಿ ನೋಡಿ', contribute: 'ಸಹಕರಿಸಿ →',
  },
  en: {
    eyebrow: 'Karnataka Historical Atlas', title: 'Who ruled here?',
    intro: 'Pick a place to see, in time order, which dynasties have recorded evidence nearby (capitals, inscriptions, monuments, coins, events). This is not a border: only nearby records.',
    place: 'Find a place', placeHint: 'e.g. Hampi', district: 'District', anyDistrict: '— choose a district —', radius: 'Nearby (km)', clickMap: 'or click the map',
    none: 'No dynasty has a record near this place. Widen the radius or help add records.',
    pickFirst: 'Once you pick a place, the dynasties with records near it show darker on the timeline below.',
    results: 'Dynasties with records near this place', timeline: 'Timeline of all dynasties', away: 'km', records: 'records', thin: 'thin evidence',
    note: 'Approximate; awaiting review. A record nearby does not prove the dynasty ruled the place; it shows its influence or contact was recorded there.',
    seeMap: 'See on the dynasty map', contribute: 'Contribute →',
  },
}

const km = (a, b) => {
  const rad = Math.PI / 180, dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2
  return 12742 * Math.asin(Math.sqrt(h))
}
const bboxCentre = geometry => {
  const points = (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates).flat(2)
  const lngs = points.map(point => point[0]), lats = points.map(point => point[1])
  return { lng: (Math.min(...lngs) + Math.max(...lngs)) / 2, lat: (Math.min(...lats) + Math.max(...lats)) / 2 }
}
const pct = year => `${((Math.min(Math.max(year, FROM), TO) - FROM) / (TO - FROM)) * 100}%`

function ClickToPick({ onPick }) {
  useMapEvents({ click: event => onPick({ lat: event.latlng.lat, lng: event.latlng.lng }) })
  return null
}

export default function WhoRuledPage({ locale = 'kn' }) {
  const t = copy[locale] || copy.kn
  const nameOf = name => name?.[locale] || name?.en || name?.kn || ''
  const places = useMemo(() => atlasData.places.filter(place => place.location?.coordinates && place.location.coordinates[1] > 11 && place.location.coordinates[1] < 19.6 && place.location.coordinates[0] > 74 && place.location.coordinates[0] < 78.7), [])
  const hampi = atlasData.places.find(place => place.id === 'place-hampi')
  const [spot, setSpot] = useState(hampi ? { lat: hampi.location.coordinates[1], lng: hampi.location.coordinates[0], label: nameOf(hampi.name) } : null)
  const [radius, setRadius] = useState(100)
  const [districts, setDistricts] = useState([])
  const [query, setQuery] = useState('')
  useEffect(() => { loadDistricts().then(data => setDistricts((data?.features || []).map(feature => ({ id: feature.properties.id, name: feature.properties.districtName?.[locale] || feature.properties.district, ...bboxCentre(feature.geometry) })).sort((a, b) => a.name.localeCompare(b.name)))) }, [locale])

  const rows = useMemo(() => DYNASTY_PHASES.map(phase => {
    const points = evidenceFor(phase)
    const near = spot ? points.map(point => ({ ...point, distance: km(spot, point) })).filter(point => point.distance <= radius).sort((a, b) => a.distance - b.distance) : []
    return { phase, points, near }
  }), [spot, radius])
  const matches = rows.filter(row => row.near.length).sort((a, b) => a.phase.from - b.phase.from)

  const chooseName = value => {
    setQuery(value)
    const place = places.find(item => nameOf(item.name) === value || item.name?.en === value || item.name?.kn === value)
    if (place) setSpot({ lat: place.location.coordinates[1], lng: place.location.coordinates[0], label: nameOf(place.name) })
  }

  return <main className="portal-page who-ruled-page" id="who-ruled">
    <section className="script-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div></section>
    <div className="who-controls">
      <label>{t.place}<input list="who-places" value={query} placeholder={t.placeHint} onChange={event => chooseName(event.target.value)} /></label>
      <datalist id="who-places">{places.map(place => <option key={place.id} value={nameOf(place.name)} />)}</datalist>
      <label>{t.district}<select value="" onChange={event => { const item = districts.find(entry => entry.id === event.target.value); if (item) { setSpot({ lat: item.lat, lng: item.lng, label: item.name }); setQuery('') } }}>
        <option value="">{t.anyDistrict}</option>{districts.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label>{t.radius}<select value={radius} onChange={event => setRadius(Number(event.target.value))}>{[50, 100, 150, 250].map(value => <option key={value} value={value}>{value}</option>)}</select></label>
    </div>
    <div className="who-layout">
      <section className="who-map" aria-label={t.clickMap}>
        <MapContainer bounds={[[9.5, 73.5], [19.5, 80.5]]} minZoom={5} scrollWheelZoom={false}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickToPick onPick={point => { setSpot({ ...point, label: '' }); setQuery('') }} />
          {spot && <>
            <Circle center={[spot.lat, spot.lng]} radius={radius * 1000} pathOptions={{ color: '#3a4cc0', weight: 1.5, dashArray: '5 4', fillOpacity: .04 }} interactive={false} />
            <Marker position={[spot.lat, spot.lng]} />
            {matches.flatMap(({ phase, near }) => near.map((point, index) => <CircleMarker key={`${phase.id}-${index}`} center={[point.lat, point.lng]} radius={point.kind === 'capital' ? 6 : 4} pathOptions={{ color: '#fff', weight: 1, fillColor: phase.color, fillOpacity: 1 }}>
              <Tooltip>{nameOf(phase.name)} · {KIND_LABEL[locale][point.kind]}{point.label ? ` · ${nameOf(point.label)}` : ''}</Tooltip></CircleMarker>))}
          </>}
        </MapContainer>
        <p>{t.clickMap}. {spot?.label && <b>{spot.label}</b>}</p>
      </section>
      <section className="who-results" aria-live="polite">
        <h3>{t.results}</h3>
        {!spot && <p>{t.pickFirst}</p>}
        {spot && !matches.length && <p>{t.none}</p>}
        <ol>{matches.map(({ phase, near, points }) => <li key={phase.id} style={{ borderLeftColor: phase.color }}>
          <strong>{nameOf(phase.name)}</strong> <small>{phase.from}–{phase.to}{points.length < 3 ? ` · ${t.thin}` : ''}</small>
          <ul>{near.slice(0, 4).map((point, index) => point.kind === 'lead' ? <li key={index} className="who-lead">{KIND_LABEL[locale].lead} · {nameOf(point.label)} <a href="#contribute">{t.contribute}</a></li> : <li key={index}>{KIND_LABEL[locale][point.kind]}{point.label ? ` · ${nameOf(point.label)}` : ''}{point.from ? ` · ${point.from}` : ''} <small>{Math.round(point.distance)} {t.away}</small></li>)}</ul>
          {near.length > 4 && <small>+{near.length - 4} {t.records}</small>}
        </li>)}</ol>
        <p className="who-note">{t.note}</p>
      </section>
    </div>
    <section className="who-timeline" aria-label={t.timeline}>
      <h3>{t.timeline}</h3>
      <div className="who-axis" aria-hidden="true"><span /><div>{TICKS.map(year => <b key={year} style={{ left: pct(year) }}>{year}</b>)}</div></div>
      <ol>{[...rows].sort((a, b) => a.phase.from - b.phase.from).map(({ phase, near }) => <li key={phase.id} className={spot ? (near.length ? 'hit' : 'miss') : ''}>
        <span className="who-name">{nameOf(phase.name)}</span>
        <span className="who-track"><i style={{ left: pct(phase.from), width: `calc(${pct(phase.to)} - ${pct(phase.from)})`, background: phase.color }} title={`${phase.from}–${phase.to}`} /></span>
      </li>)}</ol>
      <a href="#dynasties" className="who-link">{t.seeMap}</a>
    </section>
  </main>
}
