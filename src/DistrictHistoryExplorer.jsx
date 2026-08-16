import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { districtHistoryCategories } from './data/research'
import { canonicalDistrictAssociation } from './data/district-normalization'
import ProvenanceBadge from './ProvenanceBadge'
import { buildSourceTiers, recordAuthorityCited } from './data/source-provenance'

const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const other=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const sourceById=new Map(atlasData.sources.map(source=>[source.id,source]))
const sourceTiers=buildSourceTiers(atlasData)
const entityById=new Map([
  ...atlasData.polities,
  ...atlasData.externalPolities,
  ...atlasData.places,
  ...atlasData.people,
  ...atlasData.events
].map(record=>[record.id,record]))
const categoryLabels={
  kn:{'prehistoric-landscape':'ಪೂರ್ವೈತಿಹಾಸಿಕ ಭೂದೃಶ್ಯ','settlement-origin':'ವಸತಿ ಮೂಲ','urban-foundation':'ನಗರ ಸ್ಥಾಪನೆ','foundation-stone':'ಸ್ಥಾಪನಾ ಶಿಲೆ','regional-memory':'ಪ್ರಾದೇಶಿಕ ಸ್ಮೃತಿ','district-scope':'ಜಿಲ್ಲಾ ಸಂಶೋಧನಾ ವ್ಯಾಪ್ತಿ'},
  en:{'prehistoric-landscape':'Prehistoric landscape','settlement-origin':'Settlement origins','urban-foundation':'Urban foundation','foundation-stone':'Foundation stones','regional-memory':'Regional memory','district-scope':'District research scope'}
}

function Viewport({selected}){
  const map=useMap()
  const points=selected?.location?.coordinates
  useEffect(()=>{if(points?.length===2){
    const latLng=[points[1],points[0]]
    map.setView(latLng,Math.max(map.getZoom(),8),{animate:true})
  }},[map,points])
  return null
}

function HistoricalConnections({record,locale}){
  const groups=[
    ['placeIds',locale==='kn'?'ಸ್ಥಳಗಳು':'Places'],
    ['polityIds',locale==='kn'?'ರಾಜ್ಯಗಳು ಮತ್ತು ಆಡಳಿತಗಳು':'Polities and governments'],
    ['peopleIds',locale==='kn'?'ವ್ಯಕ್ತಿಗಳು':'People'],
    ['eventIds',locale==='kn'?'ಘಟನೆಗಳು':'Events']
  ].map(([field,label])=>({label,records:(record[field]||[]).map(id=>entityById.get(id)).filter(Boolean)})).filter(group=>group.records.length)
  if(!groups.length&&!record.connectionNote)return null
  return <section className="district-history-connections"><h4>{locale==='kn'?'ಐತಿಹಾಸಿಕ ಸಂದರ್ಭದ ಸಂಪರ್ಕಗಳು':'Historical context links'}</h4>{groups.map(group=><div key={group.label}><b>{group.label}</b><p>{group.records.map(item=><span key={item.id}>{text(item.name||item.title,locale)}</span>)}</p></div>)}{record.connectionNote&&<small>{text(record.connectionNote,locale)}</small>}</section>
}

export default function DistrictHistoryExplorer({locale='kn',districtGeojson,mapTheme='modern',setMapTheme}){
  const [category,setCategory]=useState('all')
  const [query,setQuery]=useState('')
  const [selectedId,setSelectedId]=useState(null)
  const [legendOpen,setLegendOpen]=useState(false)
  const labels=categoryLabels[locale]
  const districtHistoryResearch=atlasData.districtHistoryResearch
  const freedomCandidatesById=useMemo(()=>new Map((atlasData.martyrCandidates||[]).map(candidate=>[candidate.id,candidate])),[])
  const freedomDistrictCoverage=useMemo(()=>{
    const coverage=new Map()
    for(const event of atlasData.events.filter(record=>record.researchInput?.sourceCollection==='martyrCandidates')){
      const candidate=freedomCandidatesById.get(event.candidateIds?.[0])
      const eventDistricts=new Map((candidate?.districtText||event.researchInput.placeLeads||[]).map(value=>{const association=canonicalDistrictAssociation(value,{locale});return[association.districtId,association]}))
      for(const association of eventDistricts.values()){
        const current=coverage.get(association.districtId)||{id:association.districtId,name:association.name,count:0}
        current.count+=1
        coverage.set(current.id,current)
      }
    }
    return [...coverage.values()].sort((a,b)=>b.count-a.count||String(a.name).localeCompare(String(b.name),locale))
  },[freedomCandidatesById,locale])
  const filtered=useMemo(()=>districtHistoryResearch.filter(record=>{
    const needle=query.trim().toLowerCase()
    return (category==='all'||record.category===category)&&(!needle||JSON.stringify(record).toLowerCase().includes(needle))
  }),[category,query])
  const selected=filtered.find(record=>record.id===selectedId)||districtHistoryResearch.find(record=>record.id===selectedId)||null
  const candidates=filtered.filter(record=>record.recordKind==='candidate'&&record.location?.coordinates)
  const scopes=filtered.filter(record=>record.recordKind==='district-scope')
  const pending=filtered.filter(record=>record.review?.status==='needs-review').length
  const center=[14.8,76.2]
  return <main className={`district-history-page theme-${mapTheme}`} id="district-history">
    <section className="district-history-intro"><p className="eyebrow">{locale==='kn'?'31 ಜಿಲ್ಲೆಗಳು · ಸ್ಥಳೀಯ ಇತಿಹಾಸ · ಸಂಶೋಧನಾ ಸ್ವೀಕೃತಿ':'31 districts · locality histories · research intake'}</p><h2>{locale==='kn'?'ಜಿಲ್ಲಾ ಸಮಗ್ರ ಇತಿಹಾಸ':'District deep history explorer'}</h2><p>{locale==='kn'?'ಬೆಂಗಳೂರು ಸ್ಥಳೀಯ ಇತಿಹಾಸದಂತೆ ಪ್ರತಿಯೊಂದು ಜಿಲ್ಲೆಯ ಪೂರ್ವೈತಿಹಾಸಿಕ ತಾಣಗಳು, ವಸತಿ ಮೂಲಗಳು, ಸ್ಥಾಪನಾ ಶಿಲೆಗಳು ಮತ್ತು ಸ್ಮೃತಿ-ದಾಖಲೆಗಳನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಲಾಗುತ್ತದೆ. ಆರಂಭಿಕ ದಾಖಲಾತಿಗಳು ಪರಿಶೀಲನೆ ಬಾಕಿ ಸುಳಿವುಗಳು; ಅವು ದೃಢೀಕೃತ ಇತಿಹಾಸವೆಂದು ತೋರಿಸಲ್ಪಡುವುದಿಲ್ಲ.':'Like the Bengaluru locality-history example, this intake layer collects prehistoric places, settlement origins, foundation stones and regional memories for every district. Starter records are visibly marked as research leads and are not presented as verified history.'}</p><div className="district-history-stats"><span><b>{scopes.length}</b>{locale==='kn'?'ಜಿಲ್ಲಾ ವ್ಯಾಪ್ತಿಗಳು':'district scopes'}</span><span><b>{candidates.length}</b>{locale==='kn'?'ನಕ್ಷೆಗೊಳಿಸಿದ ಸುಳಿವುಗಳು':'mapped leads'}</span><span><b>{pending}</b>{locale==='kn'?'ಪರಿಶೀಲನೆ ಬಾಕಿ':'needs review'}</span></div></section>
    <section className="district-history-workspace">
      <aside className="district-history-filters"><label><span>{locale==='kn'?'ಜಿಲ್ಲೆ, ಸ್ಥಳ ಅಥವಾ ಸುಳಿವು ಹುಡುಕಿ':'Search district, place or lead'}</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={locale==='kn'?'ಕೋಲಾರ, ಪೇಟೆ, ಪೂರ್ವೈತಿಹಾಸಿಕ…':'Kolar, Pete, prehistoric…'}/></label><div className="district-history-filter-row"><button className={category==='all'?'active':''} onClick={()=>setCategory('all')}>{locale==='kn'?'ಎಲ್ಲ':'All'}</button>{districtHistoryCategories.map(value=><button key={value} className={category===value?'active':''} onClick={()=>setCategory(value)}>{labels[value]}</button>)}</div><p><b>{filtered.length}</b> {locale==='kn'?'ದಾಖಲೆಗಳು':'records'} · {locale==='kn'?'ಎಲ್ಲವೂ ಸಂಶೋಧನಾ ಹಂತದಲ್ಲಿವೆ':'all are research-stage records'}</p></aside>
      <section className="district-history-map-wrap"><MapContainer center={center} zoom={6.2} minZoom={4} scrollWheelZoom><Viewport selected={selected}/><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{districtGeojson&&<GeoJSON data={districtGeojson} interactive={false} style={{color:'#68738b',weight:1,fillColor:'#4361ee',fillOpacity:.025,dashArray:'5 4'}}/>}{candidates.map(record=>{const [lng,lat]=record.location.coordinates;const active=selected?.id===record.id;return <CircleMarker key={record.id} center={[lat,lng]} radius={active?10:7} pathOptions={{color:'#b06a1f',fillColor:'#fff7e7',fillOpacity:.9,weight:3,dashArray:'3 4'}} eventHandlers={{click:()=>setSelectedId(record.id)}}><Popup><strong>{text(record.name,locale)}</strong><br/><small>{text(record.district,locale)} · {labels[record.category]}</small><br/><span>{locale==='kn'?'ಪರಿಶೀಲನೆ ಬಾಕಿ':'Needs review'}</span></Popup></CircleMarker>})}</MapContainer><div className="map-theme-control" role="group" aria-label={locale==='kn'?'ಭೂಪಟ ಶೈಲಿ':'Map style'}><span>{locale==='kn'?'ಭೂಪಟ ಶೈಲಿ':'Map style'}</span><div><button className={mapTheme==='modern'?'active':''} onClick={()=>setMapTheme?.('modern')}>{locale==='kn'?'ಆಧುನಿಕ':'Modern'}</button><button className={mapTheme==='historical'?'active':''} onClick={()=>setMapTheme?.('historical')}>{locale==='kn'?'ಐತಿಹಾಸಿಕ ಕಾಗದ':'Historical parchment'}</button></div></div><div className={`district-history-map-legend map-overlay-disclosure ${legendOpen?'open':''}`}><button className="map-overlay-disclosure-toggle" aria-expanded={legendOpen} onClick={()=>setLegendOpen(open=>!open)}>{locale==='kn'?'ಸೂಚಿ':'Legend'}</button><div className="map-overlay-disclosure-content"><span><i></i>{locale==='kn'?'ಪರಿಶೀಲನೆ ಬಾಕಿ ಸುಳಿವು':'Pending research lead'}</span><small>{locale==='kn'?'ಗಡಿಗಳು ಸಂದರ್ಭಕ್ಕಾಗಿ ಮಾತ್ರ':'Boundaries are contextual only'}</small></div></div></section>
      <aside className="district-history-detail">{selected?<><div className="review-badge needs-review">{locale==='kn'?'ಪರಿಶೀಲನೆ ಬಾಕಿ':'Needs review'}</div>{recordAuthorityCited(selected,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}<p className="eyebrow">{labels[selected.category]} · {selected.district?.[locale]}</p><h3>{text(selected.name,locale)}</h3><p className="entity-secondary">{other(selected.name,locale)}</p><p>{text(selected.description,locale)}</p><p className="district-history-note">{text(selected.researchNote,locale)}</p><HistoricalConnections record={selected} locale={locale}/><h4>{locale==='kn'?'ಆಕರದ ಸ್ಥಿತಿ':'Evidence basis'}</h4><p>{selected.evidenceBasis} · {locale==='kn'?'ಸ್ವತಂತ್ರ ಪರಿಶೀಲನೆ ಅಗತ್ಯ':'independent verification required'}</p>{selected.citations?.map((citation,index)=>{const source=sourceById.get(citation.sourceId);return <p className="district-history-citation" key={`${citation.sourceId}-${index}`}>{source?.url?<a href={source.url} target="_blank" rel="noreferrer">{text(source.title,locale)} ↗</a>:text(source?.title,locale)||citation.sourceId}<ProvenanceBadge tier={sourceTiers.get(citation.sourceId)} locale={locale} short/><br/><small>{citation.locator}</small></p>})}<button className="return-detail" onClick={()=>setSelectedId(null)}>{locale==='kn'?'ಆಯ್ಕೆ ತೆರವುಗೊಳಿಸಿ':'Clear selection'}</button></>:<><p className="eyebrow">{locale==='kn'?'ಸಂಶೋಧನಾ ಸೂಚನೆ':'Research intake'}</p><h3>{locale==='kn'?'ಒಂದು ಸುಳಿವನ್ನು ಆಯ್ಕೆಮಾಡಿ':'Select a research lead'}</h3><p>{locale==='kn'?'ನಕ್ಷೆಯ ಕಿತ್ತಳೆ ತುಂಡು-ಗೆರೆ ಗುರುತುಗಳು ಅಥವಾ ಕೆಳಗಿನ ಪಟ್ಟಿಯ ಅಭ್ಯರ್ಥಿಗಳನ್ನು ತೆರೆಯಿರಿ.':'Open an amber dashed marker or a candidate below.'}</p></>}</aside>
    </section>
    <section className="district-history-freedom"><div><p className="eyebrow">{locale==='kn'?'ಜಿಲ್ಲಾವಾರು ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ':'Freedom movement by district'}</p><h3>{locale==='kn'?'ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಸಾಕ್ಷ್ಯ ಸುಳಿವುಗಳು':'Freedom-movement evidence leads'}</h3><p>{locale==='kn'?'ಪ್ರತಿ ಸಂಖ್ಯೆಯು ಪರಿಶೀಲನೆ ಬಾಕಿಯಿರುವ ಘಟನೆ–ವ್ಯಕ್ತಿ ಸಂಪರ್ಕವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಪ್ರತ್ಯೇಕ ಭೂಪಟ ಮತ್ತು ಕಾಲರೇಖೆಯಲ್ಲಿ ನೋಡಿ.':'Each count represents an event–person connection awaiting review. Choose a district to open it in the dedicated map and timeline.'}</p></div><div>{freedomDistrictCoverage.map(item=><a key={item.id} href={`?freedomDistrict=${encodeURIComponent(item.id)}#freedom`}><span>{item.name}</span><b>{item.count}</b></a>)}</div></section>
    <section className="district-history-list"><div><p className="eyebrow">{locale==='kn'?'ಜಿಲ್ಲಾ ವ್ಯಾಪ್ತಿ':'District coverage'}</p><h3>{locale==='kn'?'ಪ್ರತಿ ಜಿಲ್ಲೆಗೆ ಸಂಶೋಧನಾ ಜಾಗ':'A research slot for every district'}</h3></div><div className="district-history-cards">{filtered.map(record=><button key={record.id} className={`${record.recordKind} ${selected?.id===record.id?'active':''}`} onClick={()=>setSelectedId(record.id)}><span>{labels[record.category]}</span><strong>{text(record.name,locale)}</strong><small>{text(record.district,locale)} · {record.review?.status}</small></button>)}</div></section>
  </main>
}
