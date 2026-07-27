import { Fragment, useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Polygon, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { atlasData } from './data/atlas'

const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const other=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const placeById=new Map(atlasData.places.map(record=>[record.id,record]))
const entityById=new Map([...atlasData.polities,...atlasData.externalPolities].map(record=>[record.id,record]))
const sourceById=new Map(atlasData.sources.map(record=>[record.id,record]))
const localPolityIds=new Set(atlasData.polities.map(record=>record.id))
const warTypes=new Set(['battle','war','invasion','campaign'])
const countryNames={AF:'Afghanistan',CN:'China',EG:'Egypt',FR:'France',ID:'Indonesia',IQ:'Iraq',IR:'Iran',OM:'Oman',PT:'Portugal',TR:'Türkiye'}
const colors={trade:'#16867a',diplomacy:'#4361ee',travel:'#8b5aa5',war:'#a83e32',political:'#657084',territory:'#c47b22'}
const copy={
  kn:{title:'ಜಾಗತಿಕ ಸಂಬಂಧಗಳ ಅನ್ವೇಷಣೆ',subtitle:'ಉತ್ತರ · ದಕ್ಷಿಣ · ಪೂರ್ವ · ಪಶ್ಚಿಮ ಸಂಪರ್ಕಗಳು ಮತ್ತು ಭೂಪ್ರದೇಶ ನಿಯಂತ್ರಣ',intro:'ವ್ಯಾಪಾರ, ರಾಯಭಾರ, ಪ್ರವಾಸ, ಯುದ್ಧ ಮತ್ತು ವಿದೇಶಿ ಆಳ್ವಿಕೆಯ ಸಾಕ್ಷ್ಯವನ್ನು ಒಂದೇ ಭೂಪಟದಲ್ಲಿ ಹೋಲಿಸಿ. ಮಾರ್ಗವು ಸಂಪರ್ಕವನ್ನು ಸೂಚಿಸುತ್ತದೆ; ಬಣ್ಣ ತುಂಬಿದ ಪ್ರದೇಶ ಮಾತ್ರ ಭೂಪ್ರದೇಶದ ಸಾಕ್ಷ್ಯ.',search:'ದೇಶ, ವ್ಯಕ್ತಿ, ರಾಜ್ಯ ಅಥವಾ ಘಟನೆಯನ್ನು ಹುಡುಕಿ',all:'ಎಲ್ಲ',north:'ಉತ್ತರ',south:'ದಕ್ಷಿಣ',east:'ಪೂರ್ವ',west:'ಪಶ್ಚಿಮ',subcontinent:'ದಖ್ಖನ್ · ಇತರೆ ಉಪಖಂಡ',direction:'ದಿಕ್ಕು',relation:'ಸಂಬಂಧ',control:'ಆಳ್ವಿಕೆ / ಸಂಪರ್ಕ',polity:'ಕರ್ನಾಟಕ ರಾಜ್ಯ',century:'ಶತಮಾನ',contact:'ಸಂಪರ್ಕ ಮಾತ್ರ',territorial:'ಭೂಪ್ರದೇಶ ಸಾಕ್ಷ್ಯ',trade:'ವ್ಯಾಪಾರ',diplomacy:'ರಾಯಭಾರ',travel:'ಪ್ರವಾಸ · ಜ್ಞಾನ',war:'ಯುದ್ಧ · ಆಕ್ರಮಣ',political:'ರಾಜಕೀಯ ಪರಿವರ್ತನೆ',territory:'ಭೂಆಳ್ವಿಕೆ',results:'ದಾಖಲೆಗಳು',openAtlas:'ಮುಖ್ಯ ಕಾಲರೇಖೆಯಲ್ಲಿ ತೆರೆಯಿರಿ',sources:'ಆಕರಗಳು',countries:'ಇಂದಿನ ದೇಶಗಳು',noControl:'ಭೂಆಳ್ವಿಕೆ ಇಲ್ಲ',hasControl:'ಭೂಪ್ರದೇಶ ನಿಯಂತ್ರಣದ ಸಾಕ್ಷ್ಯ',mapKey:'ಭೂಪಟ ಸಂಕೇತ',routes:'ಸಂಪರ್ಕ / ಯುದ್ಧ ಮಾರ್ಗ',areas:'ನಿಯಂತ್ರಿತ ಅಥವಾ ವಿವಾದಿತ ಪ್ರದೇಶ',noResults:'ಈ ಶೋಧಕಗಳಿಗೆ ದಾಖಲೆಗಳಿಲ್ಲ.',allCenturies:'ಎಲ್ಲ ಶತಮಾನಗಳು',allPolities:'ಎಲ್ಲ ರಾಜ್ಯಗಳು',evidence:'ಸಾಕ್ಷ್ಯ ಸ್ಥಿತಿ',mapTheme:'ಭೂಪಟ ಶೈಲಿ',modernTheme:'ಆಧುನಿಕ',historicalTheme:'ಐತಿಹಾಸಿಕ ಕಾಗದ',mapThemeNote:'ಇದು ದೃಶ್ಯ ಶೈಲಿ ಮಾತ್ರ; ಐತಿಹಾಸಿಕ ದತ್ತಾಂಶ ಮತ್ತು ಗಡಿಗಳು ಬದಲಾಗುವುದಿಲ್ಲ.'},
  en:{title:'Global Relations Explorer',subtitle:'North · south · east · west contacts and territorial control',intro:'Compare trade, diplomacy, travel, war and evidence of foreign rule on one map. A route indicates contact; only a filled area represents territorial evidence.',search:'Search country, person, polity or event',all:'All',north:'North',south:'South',east:'East',west:'West',subcontinent:'Deccan · other subcontinent',direction:'Direction',relation:'Relationship',control:'Rule / contact',polity:'Karnataka polity',century:'Century',contact:'Contact only',territorial:'Territorial evidence',trade:'Trade',diplomacy:'Diplomacy',travel:'Travel · knowledge',war:'War · invasion',political:'Political transition',territory:'Territorial rule',results:'records',openAtlas:'Open in main timeline',sources:'Sources',countries:'Present-day countries',noControl:'No territorial rule',hasControl:'Territorial-control evidence',mapKey:'Map key',routes:'Contact / war route',areas:'Controlled or contested area',noResults:'No records match these filters.',allCenturies:'All centuries',allPolities:'All polities',evidence:'Evidence status',mapTheme:'Map style',modernTheme:'Modern',historicalTheme:'Historical parchment',mapThemeNote:'Visual style only; historical data and boundaries remain unchanged.'}
}

const relationCategory=event=>{
  if(['merchant-guild-presence','overseas-commerce'].includes(event.reach?.relationKind))return'trade'
  if(event.reach?.relationKind==='diplomatic-visit-and-travel-account')return'travel'
  if(event.reach?.relationKind?.includes('diplomacy')||event.type==='diplomatic-mission')return'diplomacy'
  if(warTypes.has(event.type))return'war'
  return'political'
}
const regionFor=event=>{
  const codes=event.reach?.modernCountries||[]
  if(codes.some(code=>['CN','ID'].includes(code)))return'east'
  if(codes.length)return'west'
  const externalIds=(event.participants||[]).map(item=>item.polityId)
  if(externalIds.some(id=>['external-polity-harsha','external-polity-delhi-sultanate'].includes(id)))return'north'
  if(externalIds.some(id=>['external-polity-pallava','external-polity-chola'].includes(id)))return'south'
  const latitudes=(event.route?.coordinates||[]).map(([,lat])=>lat)
  if(latitudes.some(lat=>lat>=20))return'north'
  if(latitudes.some(lat=>lat<=12))return'south'
  return'subcontinent'
}
const positionsForEvent=event=>{
  if(event.route?.coordinates?.length)return event.route.coordinates.map(([lng,lat])=>[lat,lng])
  const point=id=>{const [lng,lat]=placeById.get(id)?.location?.coordinates||[];return Number.isFinite(lat)&&Number.isFinite(lng)?[lat,lng]:null}
  const positions=[point(event.originPlaceId),point(event.destinationPlaceId)].filter(Boolean)
  if(positions.length)return positions
  const [lng,lat]=event.location?.coordinates||[]
  return Number.isFinite(lat)&&Number.isFinite(lng)?[[lat,lng]]:[]
}

const eventRecords=atlasData.events.filter(event=>event.reach||event.participants?.some(item=>item.polityId.startsWith('external-polity-'))||event.route?.coordinates?.some(([,lat])=>lat>=20||lat<=12)).map(event=>({
  id:event.id,kind:'event',record:event,name:event.name,date:event.date,year:event.date.from,category:relationCategory(event),region:regionFor(event),controlKind:'contact',positions:positionsForEvent(event),polityIds:event.participants.map(item=>item.polityId).filter(id=>localPolityIds.has(id)),countries:(event.reach?.modernCountries||[]).map(code=>countryNames[code]||code),searchText:JSON.stringify(event).toLowerCase()
}))
const territoryRecords=atlasData.territorialExtents.filter(record=>record.polityIds.some(id=>id.startsWith('external-polity-'))).map(record=>({
  id:record.id,kind:'territory',record,name:record.name,date:record.date,year:record.date.from,category:'territory',region:record.polityIds.some(id=>['external-polity-pallava','external-polity-chola'].includes(id))?'south':'subcontinent',controlKind:'territorial',positions:record.geometry.coordinates.map(([lng,lat])=>[lat,lng]),polityIds:record.polityIds.filter(id=>localPolityIds.has(id)),countries:[],searchText:JSON.stringify(record).toLowerCase()
}))
const records=[...eventRecords,...territoryRecords].sort((a,b)=>a.year-b.year)

function RelationViewport({selected}){
  const map=useMap()
  useEffect(()=>{if(selected?.positions.length>1)map.fitBounds(selected.positions,{padding:[40,40],maxZoom:6});else if(selected?.positions[0])map.setView(selected.positions[0],5)},[map,selected])
  return null
}

export default function GlobalRelationsExplorer({locale='kn',mapTheme='modern',setMapTheme,onOpenAtlas}){
  const t=copy[locale]
  const [query,setQuery]=useState('')
  const [region,setRegion]=useState('all')
  const [category,setCategory]=useState('all')
  const [control,setControl]=useState('all')
  const [polity,setPolity]=useState('all')
  const [century,setCentury]=useState('all')
  const [selectedId,setSelectedId]=useState('event-domingo-paes-vijayanagara')
  const filtered=useMemo(()=>records.filter(item=>{
    const needle=query.trim().toLowerCase()
    const itemCentury=Math.floor((item.year-1)/100)+1
    return (!needle||item.searchText.includes(needle)||item.countries.join(' ').toLowerCase().includes(needle))&&(region==='all'||item.region===region)&&(category==='all'||item.category===category)&&(control==='all'||item.controlKind===control)&&(polity==='all'||item.polityIds.includes(polity))&&(century==='all'||itemCentury===Number(century))
  }),[query,region,category,control,polity,century])
  useEffect(()=>{if(filtered.length&&!filtered.some(item=>item.id===selectedId))setSelectedId(filtered[0].id)},[filtered,selectedId])
  const selected=filtered.find(item=>item.id===selectedId)||filtered[0]||null
  const citations=(selected?.record.citations||[]).map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  const relatedEntities=(selected?.record.polityIds||selected?.record.participants?.map(item=>item.polityId)||[]).map(id=>entityById.get(id)).filter(Boolean)
  return <main className="relations-page" id="relations"><section className="relations-intro"><p className="eyebrow">{t.subtitle}</p><h2>{t.title}</h2><p>{t.intro}</p></section><section className="relations-workspace"><aside className="relations-filters"><label className="relations-search"><span>{t.search}</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.search}/></label><div className="relations-filter-grid"><label><span>{t.direction}</span><select value={region} onChange={event=>setRegion(event.target.value)}><option value="all">{t.all}</option><option value="north">{t.north}</option><option value="south">{t.south}</option><option value="east">{t.east}</option><option value="west">{t.west}</option><option value="subcontinent">{t.subcontinent}</option></select></label><label><span>{t.relation}</span><select value={category} onChange={event=>setCategory(event.target.value)}><option value="all">{t.all}</option>{['trade','diplomacy','travel','war','political','territory'].map(value=><option key={value} value={value}>{t[value]}</option>)}</select></label><label><span>{t.control}</span><select value={control} onChange={event=>setControl(event.target.value)}><option value="all">{t.all}</option><option value="contact">{t.contact}</option><option value="territorial">{t.territorial}</option></select></label><label><span>{t.polity}</span><select value={polity} onChange={event=>setPolity(event.target.value)}><option value="all">{t.allPolities}</option>{atlasData.polities.map(item=><option key={item.id} value={item.id}>{text(item.name,locale)}</option>)}</select></label><label><span>{t.century}</span><select value={century} onChange={event=>setCentury(event.target.value)}><option value="all">{t.allCenturies}</option>{Array.from({length:17},(_,index)=>index+4).map(value=><option value={value} key={value}>{value}{locale==='kn'?'ನೇ':'th'}</option>)}</select></label></div><p className="relations-count"><b>{filtered.length}</b> {t.results}</p><div className="relations-list">{filtered.map(item=><button key={item.id} className={selected?.id===item.id?'active':''} onClick={()=>setSelectedId(item.id)} style={{'--relation-color':colors[item.category]}}><i></i><span>{item.year}{item.date.to!==item.date.from?`–${item.date.to}`:''}</span><strong>{text(item.name,locale)}</strong><small>{t[item.category]} · {t[item.controlKind]}</small></button>)}{!filtered.length&&<p>{t.noResults}</p>}</div></aside><section className={`relations-map theme-${mapTheme}`}><MapContainer center={[22,55]} zoom={3} minZoom={2} scrollWheelZoom><RelationViewport selected={selected}/><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{filtered.map(item=>item.kind==='territory'?<Polygon key={item.id} positions={item.positions} pathOptions={{color:colors.territory,fillColor:colors.territory,fillOpacity:selected?.id===item.id ? .3 : .16,weight:selected?.id===item.id?3:2}} eventHandlers={{click:()=>setSelectedId(item.id)}}><Tooltip sticky>{text(item.name,locale)}</Tooltip></Polygon>:<Fragment key={item.id}>{item.positions.length>1&&<Polyline positions={item.positions} pathOptions={{color:colors[item.category],weight:selected?.id===item.id?5:3,opacity:selected?.id===item.id?1:.65,dashArray:item.category==='war'?null:'8 6'}} eventHandlers={{click:()=>setSelectedId(item.id)}}/>}{item.positions.map((position,index)=><CircleMarker key={`${item.id}-${index}`} center={position} radius={selected?.id===item.id?7:4} pathOptions={{color:'#fff',fillColor:colors[item.category],fillOpacity:1,weight:2}} eventHandlers={{click:()=>setSelectedId(item.id)}}><Tooltip>{text(item.name,locale)}</Tooltip></CircleMarker>)}</Fragment>)}</MapContainer><div className="map-theme-control" role="group" aria-label={t.mapTheme} title={t.mapThemeNote}><span>{t.mapTheme}</span><div><button className={mapTheme==='modern'?'active':''} aria-pressed={mapTheme==='modern'} onClick={()=>setMapTheme?.('modern')}>{t.modernTheme}</button><button className={mapTheme==='historical'?'active':''} aria-pressed={mapTheme==='historical'} onClick={()=>setMapTheme?.('historical')}>{t.historicalTheme}</button></div></div><div className="relations-legend"><strong>{t.mapKey}</strong><span><i className="route-key"></i>{t.routes}</span><span><i className="area-key"></i>{t.areas}</span></div></section><aside className="relations-detail">{selected?<><div className="relation-status" style={{background:colors[selected.category]}}>{t[selected.category]}</div><p className="eyebrow">{selected.year}{selected.date.to!==selected.date.from?`–${selected.date.to}`:''} CE · {t[selected.region]}</p><h2>{text(selected.name,locale)}</h2><p className="entity-secondary">{other(selected.name,locale)}</p><p>{text(selected.record.summary||selected.record.description,locale)}</p>{selected.record.reach&&<div className="relation-evidence"><b>{selected.record.reach.territorialControl?t.hasControl:t.noControl}</b><span>{t.evidence}: {selected.record.reach.evidenceLevel}</span><span>{t.countries}: {selected.countries.join(', ')||'—'}</span><p>{text(selected.record.reach.note,locale)}</p></div>}{selected.kind==='territory'&&<div className="relation-evidence territorial"><b>{t.hasControl}</b><span>{selected.record.classification} · {selected.record.controlLevel}</span><p>{text(selected.record.description,locale)}</p></div>}<div className="relation-entities">{relatedEntities.map(item=><span key={item.id}>{text(item.name,locale)}</span>)}</div><h3>{t.sources}</h3><div className="citations">{citations.map((item,index)=><p key={`${item.sourceId}-${index}`}><a href={item.source.url} target="_blank" rel="noreferrer"><strong>{text(item.source.title,locale)}</strong></a><span>{item.locator}</span></p>)}</div><button className="relations-open-atlas" onClick={()=>onOpenAtlas?.(selected)}>{t.openAtlas}</button></>:<p>{t.noResults}</p>}</aside></section></main>
}
