import { useMemo, useState } from 'react'
import { MapContainer, Polygon, TileLayer, Tooltip } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { languageRegionBounds, languageRegions } from './data/language-regions'

const copy={
  kn:{title:'ಭಾಷೆ ಮತ್ತು ಲಿಪಿ ಕಾಲರೇಖೆ',badge:'ಪರಿಶೀಲನೆ ಆಗಿಲ್ಲ',warn:'ಈ ಭೂಪಟ ಸಂಶೋಧನಾ ಹಂತದಲ್ಲಿದೆ. ಆಕೃತಿಗಳು ಯೋಜನಾತ್ಮಕ, ಗಡಿಗಳಲ್ಲ; ಆಕರಗಳು ಮೂಲ ಗ್ರಂಥಗಳಿಂದ ಇನ್ನೂ ಪರಿಶೀಲನೆ ಬಾಕಿ.',year:'ವರ್ಷ',active:'ಈ ವರ್ಷದ ಪ್ರದೇಶಗಳು',none:'ಈ ವರ್ಷಕ್ಕೆ ದಾಖಲೆ ಇಲ್ಲ.',evidence:'ಸಾಕ್ಷ್ಯ',sources:'ಆಕರ ಸುಳಿವುಗಳು',verify:'ಪರಿಶೀಲಿಸಬೇಕಾದ ಗ್ರಂಥಗಳು',atlas:'ಅಟ್ಲಸ್‌ನ ಶಾಸನ ದಾಖಲೆಗಳು',lang:'ಭಾಷೆ',script:'ಲಿಪಿ',attested:'ಶಾಸನಗಳಲ್ಲಿ ದೃಢ',note:'ಇತರ ಭಾಷೆಗಳು (ತುಳು ಮುಂತಾದವು) ಈ ಕಾಲಾವಧಿಯಲ್ಲಿ ಶಾಸನಗಳಲ್ಲಿ ದೃಢಪಟ್ಟಿಲ್ಲವಾದ್ದರಿಂದ ಇಲ್ಲಿ ತೋರಿಸಿಲ್ಲ.'},
  en:{title:'Languages and scripts through time',badge:'Unverified',warn:'This map is a research draft. Shapes are schematic, not borders, and sources are web leads still to be checked against the primary editions.',year:'Year',active:'Regions in this year',none:'No record for this year.',evidence:'Evidence',sources:'Source leads',verify:'To verify against',atlas:'Atlas inscription records',lang:'Language',script:'Script',attested:'Attested in inscriptions',note:'Other languages (such as Tulu) are not shown because they are not attested in inscriptions in this period.'},
}
const yearLabel=value=>`${Math.abs(value)} ${value<0?'BCE':'CE'}`
const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const inscriptionById=new Map(atlasData.inscriptions.map(record=>[record.id,record]))
const COLORS=['#9c3d32','#2c3e91','#28785b','#b06a1f','#79538f','#c0392b','#1a8a8a']

export default function LanguageTimeline({locale='en'}){
  const t=copy[locale]||copy.en
  const [year,setYear]=useState(-250)
  const active=useMemo(()=>languageRegions.filter(record=>year>=record.date.from&&year<=record.date.to),[year])
  return <section className="language-timeline" aria-label={t.title}>
    <div className="language-timeline-head"><h3>{t.title}</h3><span className="language-badge">{t.badge}</span></div>
    <p className="language-warning" role="note">{t.warn}</p>
    <label className="language-slider"><span>{t.year} · <b>{yearLabel(year)}</b></span><input type="range" min={languageRegionBounds[0]} max={languageRegionBounds[1]} step="10" value={year} onChange={event=>setYear(Number(event.target.value))}/></label>
    <div className="language-layout">
      <div className="language-map"><MapContainer bounds={[[6,66],[37,98]]} minZoom={3} zoomSnap={0.25} scrollWheelZoom={false}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {active.map(record=>{const color=COLORS[languageRegions.indexOf(record)%COLORS.length];return <Polygon key={record.id} positions={record.geometry.map(([lng,lat])=>[lat,lng])} pathOptions={{color,fillColor:color,fillOpacity:.18,weight:2,dashArray:'6 4'}}><Tooltip sticky>{text(record.name,locale)} · {t.badge}</Tooltip></Polygon>})}
      </MapContainer></div>
      <div className="language-list"><h4>{t.active} · {yearLabel(year)}</h4>
        {!active.length&&<p>{t.none}</p>}
        {active.map(record=><article key={record.id}><h5>{text(record.name,locale)} <span className="language-badge">{t.badge}</span></h5>
          <dl><div><dt>{t.lang}</dt><dd>{record.language}</dd></div><div><dt>{t.script}</dt><dd>{record.script}</dd></div></dl>
          <p>{text(record.evidence,locale)}</p>
          {record.atlasInscriptionIds.length>0&&<p className="language-atlas"><b>{t.atlas}:</b> {record.atlasInscriptionIds.map(id=>text(inscriptionById.get(id)?.name,locale)||id).join(', ')}</p>}
          <p className="language-sources"><b>{t.sources}:</b> {record.citations.map(citation=><a key={citation.url} href={citation.url} target="_blank" rel="noreferrer">{citation.title} ↗</a>)}</p>
          <p className="language-verify"><b>{t.verify}:</b> {record.verifyWith.join('; ')}</p>
        </article>)}
      </div>
    </div>
    <p className="language-note">{t.note}</p>
  </section>
}
