import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import DynastyAreasLayer, { DynastyAreasLegend, loadDistricts } from './DynastyAreasLayer'

const copy = {
  kn: { label: 'ಐತಿಹಾಸಿಕ ರಾಜವಂಶ ಪ್ರದೇಶಗಳು (ಅಂದಾಜು)', year: 'ವರ್ಷ' },
  en: { label: 'Historical dynasty areas (approximate)', year: 'Year' },
}

// `phases` pins the layer to given dynasties (no year slider) instead of a chosen year.
// A map control that adds the dynasty-areas layer to any Leaflet map: a checkbox, and a year slider once it is on.
export default function DynastyAreasControl({ locale = 'kn', defaultYear = 1100, defaultOn = true, position = 'topright', phases, fontFor }) {
  const map = useMap()
  const t = copy[locale] || copy.kn
  const [on, setOn] = useState(defaultOn)
  const [year, setYear] = useState(defaultYear)
  const [districts, setDistricts] = useState(null)
  useEffect(() => setYear(defaultYear), [defaultYear])
  useEffect(() => { if (on && !districts) loadDistricts().then(setDistricts) }, [on, districts])
  const container = useMemo(() => L.DomUtil.create('div', 'leaflet-bar dynasty-map-control'), [])
  useEffect(() => {
    const control = L.control({ position })
    control.onAdd = () => { L.DomEvent.disableClickPropagation(container); L.DomEvent.disableScrollPropagation(container); return container }
    control.addTo(map)
    return () => { control.remove() }
  }, [map, container, position])
  return <>
    {createPortal(<>
      <label><input type="checkbox" checked={on} onChange={event => setOn(event.target.checked)} /> <span>{t.label}</span></label>
      {on && !phases && <>
        <label className="dynasty-map-control-year"><span>{t.year}: <b>{year}</b></span><input type="range" min="300" max="1947" step="1" value={year} onChange={event => setYear(Number(event.target.value))} /></label>
        <DynastyAreasLegend year={year} locale={locale} />
      </>}
    </>, container)}
    {on && districts && <DynastyAreasLayer year={year} locale={locale} districtGeojson={districts} phases={phases} fontFor={fontFor} />}
  </>
}
