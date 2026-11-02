import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, GeoJSON, MapContainer, TileLayer, Tooltip } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { languageRegionBounds, languageRegions } from './data/language-regions'
import DynastyAreasControl from './DynastyAreasControl'

const copy={
  kn:{title:'ಭಾಷೆ ಮತ್ತು ಲಿಪಿ ಕಾಲರೇಖೆ',badge:'ಪರಿಶೀಲನೆ ಆಗಿಲ್ಲ',warn:'ಈ ಭೂಪಟ ಸಂಶೋಧನಾ ಹಂತದಲ್ಲಿದೆ. ಚುಕ್ಕೆಗಳು ಅಟ್ಲಸ್‌ನ ಶಾಸನ ದಾಖಲೆಗಳಿರುವ ಸ್ಥಳಗಳು; ಛಾಯೆಯ ಪ್ರದೇಶಗಳು ಊಹೆ ಮಾತ್ರ, ಇಂದಿನ ರಾಜ್ಯಗಳನ್ನು ಆಧಾರವಾಗಿ ಬಳಸಲಾಗಿದೆ.',year:'ವರ್ಷ',active:'ಈ ವರ್ಷದ ಪ್ರದೇಶಗಳು',none:'ಈ ವರ್ಷಕ್ಕೆ ದಾಖಲೆ ಇಲ್ಲ.',sources:'ಆಕರ ಸುಳಿವುಗಳು',verify:'ಪರಿಶೀಲಿಸಬೇಕಾದ ಗ್ರಂಥಗಳು',lang:'ಭಾಷೆ',script:'ಲಿಪಿ',sites:'ಅಟ್ಲಸ್‌ನ ದೃಢ ಸ್ಥಳಗಳು',records:'ದಾಖಲೆಗಳು',places:'ಸ್ಥಳಗಳು',noSites:'ಅಟ್ಲಸ್‌ನಲ್ಲಿ ಇನ್ನೂ ಶಾಸನ ದಾಖಲೆ ಇಲ್ಲ; ಊಹೆಯ ಪ್ರದೇಶ ಮಾತ್ರ.',assumedUnits:'ಊಹೆಯ ಪ್ರದೇಶ (ಇಂದಿನ ರಾಜ್ಯಗಳು)',showAssumed:'ಊಹೆಯ ಪ್ರದೇಶಗಳನ್ನು ತೋರಿಸಿ',legendSite:'ದೃಢ ಸ್ಥಳ (ಅಟ್ಲಸ್ ದಾಖಲೆ)',legendArea:'ಊಹೆಯ ಪ್ರದೇಶ',note:'ಇತರ ಭಾಷೆಗಳು (ತುಳು ಮುಂತಾದವು) ಈ ಕಾಲಾವಧಿಯಲ್ಲಿ ಶಾಸನಗಳಲ್ಲಿ ದೃಢಪಟ್ಟಿಲ್ಲವಾದ್ದರಿಂದ ಇಲ್ಲಿ ತೋರಿಸಿಲ್ಲ. ಸಮುದ್ರವನ್ನು ಯಾವ ಭಾಷೆಗೂ ಹಂಚಿಲ್ಲ.'},
  en:{title:'Languages and scripts through time',badge:'Unverified',warn:'This map is a research draft. Dots are places with inscription records in the atlas; shaded areas are assumptions that use modern states as reference units. Sources are web leads still to be checked against the primary editions.',year:'Year',active:'Regions in this year',none:'No record for this year.',sources:'Source leads',verify:'To verify against',lang:'Language',script:'Script',sites:'Attested sites in the atlas',records:'records',places:'places',noSites:'No inscription record in the atlas yet; assumed area only.',assumedUnits:'Assumed area (modern states)',showAssumed:'Show assumed areas',legendSite:'Attested site (atlas record)',legendArea:'Assumed area',note:'Other languages (such as Tulu) are not shown because they are not attested in inscriptions in this period. No sea area is assigned to any language.'},
}
const yearLabel=value=>`${Math.abs(value)} ${value<0?'BCE':'CE'}`
const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const COLORS=['#9c3d32','#2c3e91','#28785b','#b06a1f','#79538f','#c0392b','#1a8a8a']
const placeById=new Map(atlasData.places.map(place=>[place.id,place]))
const inscriptionYear=record=>record.date.era==='BCE'?-record.date.from:record.date.from

// Atlas inscriptions that are the attested evidence for a region, grouped by find-spot.
function attestedSites(region){
  const rule=region.pins||{}
  const matches=atlasData.inscriptions.filter(record=>{
    if(rule.ids)return rule.ids.includes(record.id)
    if(rule.language){const year=inscriptionYear(record);return year>=region.date.from&&year<=region.date.to&&(record.languages||[]).some(value=>new RegExp(`\\b${rule.language}\\b`,'i').test(value))}
    return false
  })
  const bySite=new Map()
  for(const record of matches){
    const coordinates=placeById.get(record.placeId)?.location?.coordinates
    if(!coordinates)continue
    const key=coordinates.join(',')
    const site=bySite.get(key)||{point:[coordinates[1],coordinates[0]],records:[]}
    site.records.push(record)
    bySite.set(key,site)
  }
  return [...bySite.values()]
}

export default function LanguageTimeline({locale='en'}){
  const t=copy[locale]||copy.en
  const [year,setYear]=useState(-250)
  const [showAssumed,setShowAssumed]=useState(true)
  const [units,setUnits]=useState(null)
  useEffect(()=>{
    let alive=true
    fetch(`${import.meta.env.BASE_URL}south-asia-states.geojson`).then(response=>response.json()).then(data=>{if(alive)setUnits(data)}).catch(()=>{})
    return ()=>{alive=false}
  },[])
  const sitesByRegion=useMemo(()=>new Map(languageRegions.map(region=>[region.id,attestedSites(region)])),[])
  const active=useMemo(()=>languageRegions.filter(record=>year>=record.date.from&&year<=record.date.to),[year])
  const unitById=useMemo(()=>new Map((units?.features||[]).map(feature=>[feature.properties.id,feature])),[units])
  const activeKey=active.map(record=>record.id).join('|')
  return <section className="language-timeline" aria-label={t.title}>
    <div className="language-timeline-head"><h3>{t.title}</h3><span className="language-badge">{t.badge}</span></div>
    <p className="language-warning" role="note">{t.warn}</p>
    <div className="language-controls">
      <label className="language-slider"><span>{t.year} · <b>{yearLabel(year)}</b></span><input type="range" min={languageRegionBounds[0]} max={languageRegionBounds[1]} step="10" value={year} onChange={event=>setYear(Number(event.target.value))}/></label>
      <label className="language-toggle"><input type="checkbox" checked={showAssumed} onChange={event=>setShowAssumed(event.target.checked)}/> {t.showAssumed}</label>
    </div>
    <div className="language-layout">
      <div className="language-map"><MapContainer bounds={[[6,66],[37,98]]} minZoom={3} zoomSnap={0.25} scrollWheelZoom={false}><DynastyAreasControl locale={locale} defaultYear={1100} />
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {units&&<GeoJSON key="context" data={units} interactive={false} style={{color:'#8a93a8',weight:.6,fillOpacity:0}}/>}
        {showAssumed&&units&&active.map(region=>{const color=COLORS[languageRegions.indexOf(region)%COLORS.length];const features=region.units.map(id=>unitById.get(id)).filter(Boolean);return features.length?<GeoJSON key={`${region.id}-${activeKey}`} data={{type:'FeatureCollection',features}} interactive={false} style={{color,weight:1.5,dashArray:'5 4',fillColor:color,fillOpacity:.2}}/>:null})}
        {active.flatMap(region=>{const color=COLORS[languageRegions.indexOf(region)%COLORS.length];return sitesByRegion.get(region.id).map(site=><CircleMarker key={`${region.id}-${site.point.join(',')}`} center={site.point} radius={6} pathOptions={{color:'#fff',weight:2,fillColor:color,fillOpacity:1}}><Tooltip>{text(region.name,locale)} · {site.records.map(record=>text(record.name,locale)).slice(0,3).join('; ')}{site.records.length>3?` +${site.records.length-3}`:''}</Tooltip></CircleMarker>)})}
      </MapContainer></div>
      <div className="language-list"><h4>{t.active} · {yearLabel(year)}</h4>
        <p className="language-legend"><span><i className="dot"></i>{t.legendSite}</span><span><i className="area"></i>{t.legendArea}</span></p>
        {!active.length&&<p>{t.none}</p>}
        {active.map(record=>{const sites=sitesByRegion.get(record.id);const unitNames=[...new Set(record.units.map(id=>unitById.get(id)?.properties.name?.replace(/ \(former FATA\)/,'')).filter(Boolean))];return <article key={record.id}><h5>{text(record.name,locale)} <span className="language-badge">{t.badge}</span></h5>
          <dl><div><dt>{t.lang}</dt><dd>{record.language}</dd></div><div><dt>{t.script}</dt><dd>{record.script}</dd></div></dl>
          <p>{text(record.evidence,locale)}</p>
          <p className="language-atlas"><b>{t.sites}:</b> {sites.length?`${sites.reduce((total,site)=>total+site.records.length,0)} ${t.records} · ${sites.length} ${t.places}: ${sites.flatMap(site=>site.records).slice(0,4).map(item=>text(item.name,locale)).join('; ')}${sites.flatMap(site=>site.records).length>4?'…':''}`:t.noSites}</p>
          {unitNames.length>0&&<p className="language-atlas"><b>{t.assumedUnits}:</b> {unitNames.join(', ')}</p>}
          <p className="language-sources"><b>{t.sources}:</b> {record.citations.map(citation=><a key={citation.url} href={citation.url} target="_blank" rel="noreferrer">{citation.title} ↗</a>)}</p>
          <p className="language-verify"><b>{t.verify}:</b> {record.verifyWith.join('; ')}</p>
        </article>})}
      </div>
    </div>
    <p className="language-note">{t.note}</p>
  </section>
}
