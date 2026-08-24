import { Fragment, useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Polygon, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { atlasData } from './data/atlas'
import ProvenanceBadge from './ProvenanceBadge'
import { buildSourceTiers, recordAuthorityCited } from './data/source-provenance'

const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const other=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const placeById=new Map(atlasData.places.map(record=>[record.id,record]))
const entityById=new Map([...atlasData.polities,...atlasData.externalPolities].map(record=>[record.id,record]))
const personById=new Map(atlasData.people.map(record=>[record.id,record]))
const sourceById=new Map(atlasData.sources.map(record=>[record.id,record]))
const sourceTiers=buildSourceTiers(atlasData)
const localPolityIds=new Set(atlasData.polities.map(record=>record.id))
const warTypes=new Set(['battle','war','invasion','campaign'])
const countryNames={AF:'Afghanistan',CN:'China',EG:'Egypt',FR:'France',ID:'Indonesia',IN:'India',IQ:'Iraq',IR:'Iran',LK:'Sri Lanka',MY:'Malaysia',NP:'Nepal',OM:'Oman',PT:'Portugal',SG:'Singapore',TH:'Thailand',TR:'Türkiye'}
const colors={trade:'#16867a',diplomacy:'#4361ee',travel:'#8b5aa5',war:'#a83e32',political:'#657084',territory:'#c47b22'}
const relationDashes={trade:'13 6',diplomacy:'4 7',travel:'1 8',war:null,political:'8 4 2 4',territory:null}
const generatedPolityColors=new Map()
const colorForPolity=id=>{
  const supplied=entityById.get(id)?.color
  if(supplied)return supplied
  if(!generatedPolityColors.has(id)){
    const hue=[...id].reduce((sum,char)=>(sum*31+char.charCodeAt(0))%360,0)
    generatedPolityColors.set(id,`hsl(${hue} 52% 40%)`)
  }
  return generatedPolityColors.get(id)
}
const primaryPolityId=item=>item.polityIds[0]||item.displayPolityIds?.[0]
const routeColorFor=item=>primaryPolityId(item)?colorForPolity(primaryPolityId(item)):colors[item.category]
const copy={
  kn:{title:'ಜಾಗತಿಕ ಸಂಬಂಧಗಳ ಅನ್ವೇಷಣೆ',subtitle:'ದಿಕ್ಕುಗಳು · ಐತಿಹಾಸಿಕ ಮಾರ್ಗಗಳು · ಭೂಪ್ರದೇಶ ನಿಯಂತ್ರಣ',intro:'ವ್ಯಾಪಾರ, ರಾಯಭಾರ, ಪ್ರವಾಸ, ಯುದ್ಧ ಮತ್ತು ವಿದೇಶಿ ಆಳ್ವಿಕೆಯ ಸಾಕ್ಷ್ಯವನ್ನು ಒಂದೇ ಭೂಪಟದಲ್ಲಿ ಹೋಲಿಸಿ. ಮಾರ್ಗವು ಸಂಪರ್ಕವನ್ನು ಸೂಚಿಸುತ್ತದೆ; ಬಣ್ಣ ತುಂಬಿದ ಪ್ರದೇಶ ಮಾತ್ರ ಭೂಪ್ರದೇಶದ ಸಾಕ್ಷ್ಯ.',search:'ದೇಶ, ವ್ಯಕ್ತಿ, ರಾಜ್ಯ ಅಥವಾ ಘಟನೆಯನ್ನು ಹುಡುಕಿ',all:'ಎಲ್ಲ',north:'ಉತ್ತರ',south:'ದಕ್ಷಿಣ',east:'ಪೂರ್ವ',west:'ಪಶ್ಚಿಮ',subcontinent:'ದಖ್ಖನ್ · ಇತರೆ ಉಪಖಂಡ',focus:'ಕೇಂದ್ರಬಿಂದು',allGlobal:'ಎಲ್ಲ ಜಾಗತಿಕ ಸಂಬಂಧಗಳು',karnataRule:'ಕನ್ನಡ / ಕರ್ಣಾಟ ಆಳ್ವಿಕೆ ಹೊರಪ್ರದೇಶದಲ್ಲಿ',otherContacts:'ಇತರೆ ಸಂಪರ್ಕಗಳು',direction:'ಸರಳ ದಿಕ್ಕು',corridor:'ಐತಿಹಾಸಿಕ ಮಾರ್ಗ',relation:'ಸಂಬಂಧ',control:'ಆಳ್ವಿಕೆ / ಸಂಪರ್ಕ',polity:'ಕರ್ನಾಟಕ ರಾಜ್ಯ',century:'ಶತಮಾನ',contact:'ಸಂಪರ್ಕ ಮಾತ್ರ',territorial:'ಭೂಪ್ರದೇಶ ಸಾಕ್ಷ್ಯ',trade:'ವ್ಯಾಪಾರ',diplomacy:'ರಾಯಭಾರ',travel:'ಪ್ರವಾಸ · ಜ್ಞಾನ',war:'ಯುದ್ಧ · ಆಕ್ರಮಣ',political:'ರಾಜಕೀಯ ಪರಿವರ್ತನೆ',territory:'ಭೂಆಳ್ವಿಕೆ',results:'ದಾಖಲೆಗಳು',openAtlas:'ಮುಖ್ಯ ಕಾಲರೇಖೆಯಲ್ಲಿ ತೆರೆಯಿರಿ',sources:'ಆಕರಗಳು',countries:'ಇಂದಿನ ದೇಶಗಳು',noControl:'ಭೂಆಳ್ವಿಕೆ ಇಲ್ಲ',hasControl:'ಭೂಪ್ರದೇಶ ನಿಯಂತ್ರಣದ ಸಾಕ್ಷ್ಯ',mapKey:'ಭೂಪಟ ಸಂಕೇತ',routes:'ಸಂಪರ್ಕ / ಯುದ್ಧ ಮಾರ್ಗ',areas:'ನಿಯಂತ್ರಿತ ಅಥವಾ ವಿವಾದಿತ ಪ್ರದೇಶ',pendingMark:'ತುಂಡು-ಗೆರೆ · ಪರಿಶೀಲನೆ ಬಾಕಿ',noResults:'ಈ ಶೋಧಕಗಳಿಗೆ ದಾಖಲೆಗಳಿಲ್ಲ.',allCenturies:'ಎಲ್ಲ ಶತಮಾನಗಳು',allPolities:'ಎಲ್ಲ ರಾಜ್ಯಗಳು',evidence:'ಸಾಕ್ಷ್ಯ ಸ್ಥಿತಿ',timeline:'ಕಾಲರೇಖೆ',mapTheme:'ಭೂಪಟ ಶೈಲಿ',modernTheme:'ಆಧುನಿಕ',historicalTheme:'ಐತಿಹಾಸಿಕ ಕಾಗದ',mapThemeNote:'ಇದು ದೃಶ್ಯ ಶೈಲಿ ಮಾತ್ರ; ಐತಿಹಾಸಿಕ ದತ್ತಾಂಶ ಮತ್ತು ಗಡಿಗಳು ಬದಲಾಗುವುದಿಲ್ಲ.',matrixTitle:'ಸಂಬಂಧ ಮತ್ತು ಮಾರ್ಗಗಳ ಪರಿಶೀಲನಾ ಮ್ಯಾಟ್ರಿಕ್ಸ್',matrixIntro:'ಸಂಖ್ಯೆಯಿರುವ ಕೋಶವು ದಾಖಲೆಗಳನ್ನು ಶೋಧಿಸುತ್ತದೆ; 0 ಇರುವ ಕೋಶವು ಹೊಸ ಸಾಕ್ಷ್ಯ ಹುಡುಕಬೇಕಾದ ಸಂಶೋಧನಾ ಅಂತರ.',coverageGap:'ಸಂಶೋಧನಾ ಅಂತರ',corridors:{'deccan-central':'ದಖ್ಖನ್ · ಮಧ್ಯ ಭಾರತ','north-land':'ಉತ್ತರ ಭಾರತದ ಭೂಮಾರ್ಗ','south-peninsular':'ದಕ್ಷಿಣ ಪರ್ಯಾಯ ದ್ವೀಪ','northwest-gulf':'ವಾಯವ್ಯ · ಪರ್ಷಿಯನ್ ಕೊಲ್ಲಿ','southwest-ocean':'ನೈಋತ್ಯ · ಹಿಂದೂ ಮಹಾಸಾಗರ','southeast-asia':'ಆಗ್ನೇಯ ಏಷ್ಯಾ ಸಮುದ್ರಮಾರ್ಗ','northeast-china':'ಈಶಾನ್ಯ · ಚೀನಾ ಜ್ಞಾನಮಾರ್ಗ','europe-global':'ಯುರೋಪ್ · ಜಾಗತಿಕ ಸಮುದ್ರಮಾರ್ಗ'}},
  en:{title:'Global Relations Explorer',subtitle:'Directions · historical corridors · territorial control',intro:'Compare trade, diplomacy, travel, war and evidence of foreign rule on one map. A route indicates contact; only a filled area represents territorial evidence.',search:'Search country, person, polity or event',all:'All',north:'North',south:'South',east:'East',west:'West',subcontinent:'Deccan · other subcontinent',focus:'Focus',allGlobal:'All global relations',karnataRule:'Kannada / Karnata rule outside Karnataka',otherContacts:'Other contacts',direction:'Simple direction',corridor:'Historical corridor',relation:'Relationship',control:'Rule / contact',polity:'Karnataka polity',century:'Century',contact:'Contact only',territorial:'Territorial evidence',trade:'Trade',diplomacy:'Diplomacy',travel:'Travel · knowledge',war:'War · invasion',political:'Political transition',territory:'Territorial rule',results:'records',openAtlas:'Open in main timeline',sources:'Sources',countries:'Present-day countries',noControl:'No territorial rule',hasControl:'Territorial-control evidence',mapKey:'Map key',routes:'Contact / war route',areas:'Controlled or contested area',pendingMark:'Dashed · pending review',noResults:'No records match these filters.',allCenturies:'All centuries',allPolities:'All polities',evidence:'Evidence status',timeline:'Timeline',mapTheme:'Map style',modernTheme:'Modern',historicalTheme:'Historical parchment',mapThemeNote:'Visual style only; historical data and boundaries remain unchanged.',matrixTitle:'Relations and corridor review matrix',matrixIntro:'A numbered cell filters matching records; a 0 marks a research gap where new evidence should be sought.',coverageGap:'Research gap',corridors:{'deccan-central':'Deccan · central India','north-land':'North-India land corridor','south-peninsular':'Southern peninsula','northwest-gulf':'Northwest · Persian Gulf','southwest-ocean':'Southwest · Indian Ocean','southeast-asia':'Southeast-Asia maritime','northeast-china':'Northeast · China knowledge','europe-global':'Europe · global maritime'}}
}
Object.assign(copy.en,{networkTitle:'Genealogy and feudatory network',networkIntro:'Review-gated family, succession and samanta links. Derived edges are shown as research leads, not final family-tree proof.',networkKind:'Network kind',allNetworks:'All networks',genealogy:'Genealogy',feudatory:'Feudatory / samanta',evidenceLevel:'Evidence level',derivedEdge:'Derived edge',sourceBacked:'Source-backed edge'})
Object.assign(copy.kn,{networkTitle:'ವಂಶಾವಳಿ ಮತ್ತು ಸಾಮಂತ ಜಾಲ',networkIntro:'ಪರಿಶೀಲನೆ-ಬಾಕಿ ಕುಟುಂಬ, ಉತ್ತರಾಧಿಕಾರ ಮತ್ತು ಸಾಮಂತ ಸಂಬಂಧಗಳು. ರೂಪಿತ ಅಂಚುಗಳನ್ನು ಅಂತಿಮ ಕುಟುಂಬವೃಕ್ಷ ಸಾಕ್ಷ್ಯವಲ್ಲ, ಸಂಶೋಧನಾ ದಾರಿಗಳಾಗಿ ತೋರಿಸಲಾಗಿದೆ.',networkKind:'ಜಾಲದ ಸ್ವರೂಪ',allNetworks:'ಎಲ್ಲ ಜಾಲಗಳು',genealogy:'ವಂಶಾವಳಿ',feudatory:'ಸಾಮಂತ / ಅಧೀನ',evidenceLevel:'ಸಾಕ್ಷ್ಯ ಮಟ್ಟ',derivedEdge:'ರೂಪಿತ ಅಂಚು',sourceBacked:'ಆಕರಾಧಾರಿತ ಅಂಚು'})


const relationCategory=event=>{
  if(['trade'].includes(event.relationKind))return'trade'
  if(event.relationKind==='travel-knowledge')return'travel'
  if(['diplomacy','treaty','alliance'].includes(event.relationKind))return'diplomacy'
  if(['tribute','suzerainty','administrative-integration','constitutional-integration'].includes(event.relationKind))return'political'
  if(['merchant-guild-presence','overseas-commerce'].includes(event.reach?.relationKind))return'trade'
  if(event.reach?.relationKind==='diplomatic-visit-and-travel-account')return'travel'
  if(event.reach?.relationKind?.includes('diplomacy')||event.type==='diplomatic-mission')return'diplomacy'
  if(warTypes.has(event.type))return'war'
  return'political'
}
const isKarnataReach=item=>{
  const relationKind=item.record?.reach?.relationKind||item.record?.relationKind||''
  if(['political-diaspora-foundation','dynasty-branch-foundation','dynasty-branch-rule','contested-kannada-origin-rule','empire-rule-beyond-karnataka'].includes(relationKind))return true
  const ids=item.displayPolityIds||[]
  return ids.some(id=>['external-polity-karnata-tirhut','external-polity-eastern-chalukya-vengi','external-polity-goa-kadamba','external-polity-sevuna-devagiri'].includes(id))
}
const regionFor=event=>{
  if(event.geography?.region)return event.geography.region
  const codes=event.reach?.modernCountries||[]
  if(codes.some(code=>['CN','ID','MY','SG','TH'].includes(code)))return'east'
  if(codes.includes('LK'))return'south'
  if(codes.length)return'west'
  const externalIds=(event.participants||[]).map(item=>item.polityId)
  if(externalIds.some(id=>['external-polity-harsha','external-polity-delhi-sultanate'].includes(id)))return'north'
  if(externalIds.some(id=>['external-polity-pallava','external-polity-chola'].includes(id)))return'south'
  const latitudes=[...(event.route?.coordinates||[]).map(([,lat])=>lat),event.location?.coordinates?.[1]].filter(Number.isFinite)
  if(latitudes.some(lat=>lat>=15))return'north'
  if(latitudes.some(lat=>lat<=12))return'south'
  return'subcontinent'
}
const corridorFor=event=>{
  if(event.geography?.corridor)return event.geography.corridor
  const codes=event.reach?.modernCountries||[]
  if(codes.includes('CN'))return'northeast-china'
  if(codes.some(code=>['ID','MY','SG','TH'].includes(code)))return'southeast-asia'
  if(codes.some(code=>['IR','IQ','TR','AF'].includes(code)))return'northwest-gulf'
  if(codes.some(code=>['OM','EG'].includes(code)))return'southwest-ocean'
  if(codes.some(code=>['PT','FR'].includes(code)))return'europe-global'
  const region=regionFor(event)
  if(region==='north')return'north-land'
  if(region==='south')return'south-peninsular'
  return'deccan-central'
}
const positionsForEvent=event=>{
  if(event.geography?.route?.coordinates?.length)return [...event.geography.route.coordinates.map(([lng,lat])=>[lat,lng]),...(event.geography.battleLocations||[]).map(point=>[point.coordinates[1],point.coordinates[0]])]
  if(event.route?.coordinates?.length)return event.route.coordinates.map(([lng,lat])=>[lat,lng])
  const point=id=>{const [lng,lat]=placeById.get(id)?.location?.coordinates||[];return Number.isFinite(lat)&&Number.isFinite(lng)?[lat,lng]:null}
  const positions=[point(event.originPlaceId),point(event.destinationPlaceId)].filter(Boolean)
  if(positions.length)return positions
  const [lng,lat]=event.location?.coordinates||[]
  return Number.isFinite(lat)&&Number.isFinite(lng)?[[lat,lng]]:[]
}

const eventRecords=atlasData.events.filter(event=>event.reach||event.participants?.some(item=>item.polityId.startsWith('external-polity-'))||event.route?.coordinates?.some(([,lat])=>lat>=20||lat<=12)).map(event=>({
  id:event.id,kind:'event',record:event,name:event.name,date:event.date,year:event.date.from,category:relationCategory(event),region:regionFor(event),corridor:corridorFor(event),controlKind:'contact',reviewStatus:event.review?.status||'needs-review',positions:positionsForEvent(event),polityIds:event.participants.map(item=>item.polityId).filter(id=>localPolityIds.has(id)),displayPolityIds:event.participants.map(item=>item.polityId),countries:(event.reach?.modernCountries||[]).map(code=>countryNames[code]||code),searchText:JSON.stringify(event).toLowerCase()
}))
const territoryRecords=atlasData.territorialExtents.filter(record=>record.polityIds.some(id=>id.startsWith('external-polity-'))).map(record=>({
  id:record.id,kind:'territory',record,name:record.name,date:record.date,year:record.date.from,category:'territory',region:record.polityIds.some(id=>['external-polity-pallava','external-polity-chola'].includes(id))?'south':'subcontinent',corridor:record.polityIds.some(id=>['external-polity-pallava','external-polity-chola'].includes(id))?'south-peninsular':'deccan-central',controlKind:'territorial',reviewStatus:record.review?.status||'needs-review',positions:record.geometry.coordinates.map(([lng,lat])=>[lat,lng]),polityIds:record.polityIds.filter(id=>localPolityIds.has(id)),displayPolityIds:record.polityIds,countries:[],searchText:JSON.stringify(record).toLowerCase()
}))
const politicalRelationRecords=atlasData.politicalRelations.map(record=>({
  id:record.id,kind:'relation',record,name:record.name,date:record.date,year:record.date.from,category:relationCategory(record),region:regionFor(record),corridor:corridorFor(record),controlKind:['suzerainty','administrative-integration','constitutional-integration'].includes(record.relationKind)?'territorial':'contact',reviewStatus:record.review?.status||'needs-review',positions:positionsForEvent(record),polityIds:(record.parties||[]).map(item=>item.polityId).filter(id=>localPolityIds.has(id)),displayPolityIds:(record.parties||[]).map(item=>item.polityId),countries:[],searchText:JSON.stringify(record).toLowerCase()
}))
const records=[...eventRecords,...territoryRecords,...politicalRelationRecords].sort((a,b)=>a.year-b.year)
const corridorKeys=['deccan-central','north-land','south-peninsular','northwest-gulf','southwest-ocean','southeast-asia','northeast-china','europe-global']
const matrixCategories=['trade','diplomacy','travel','war','political','territory']
const networkEdges=[
  ...atlasData.genealogicalRelations.map(record=>({id:record.id,kind:'genealogy',record,name:record.name,from:personById.get(record.fromPersonId),to:personById.get(record.toPersonId),polity:entityById.get(record.polityId),evidenceLevel:record.evidenceLevel,confidence:record.confidence,reviewStatus:record.review?.status||'needs-review'})),
  ...atlasData.feudatoryRelations.map(record=>({id:record.id,kind:'feudatory',record,name:record.name,from:entityById.get(record.subordinatePolityId),to:entityById.get(record.overlordPolityId),polity:entityById.get(record.overlordPolityId),evidenceLevel:record.relationshipKind||'samanta',confidence:record.confidence||'needs-review',reviewStatus:record.review?.status||'needs-review'})),
].filter(edge=>edge.from&&edge.to)

function RelationsMatrix({locale,t,onSelect}){
  const matrix=corridorKeys.map(corridor=>({corridor,cells:Object.fromEntries(matrixCategories.map(category=>[category,records.filter(item=>item.corridor===corridor&&item.category===category).length]))}))
  const [open,setOpen]=useState(()=>typeof window==='undefined'||window.innerWidth>820)
  return <details className="relations-matrix" open={open} onToggle={event=>setOpen(event.currentTarget.open)}><summary><span><b>{t.matrixTitle}</b><small>{t.matrixIntro}</small></span></summary><div className="matrix-scroll"><table><thead><tr><th>{t.corridor}</th>{matrixCategories.map(category=><th key={category}>{t[category]}</th>)}</tr></thead><tbody>{matrix.map(row=><tr key={row.corridor}><th>{t.corridors[row.corridor]}</th>{matrixCategories.map(category=>{const count=row.cells[category];return <td key={category}><button className={count?'covered':'gap'} title={count?`${count} ${t.results}`:t.coverageGap} onClick={()=>onSelect(row.corridor,category)}><b>{count}</b><span>{count?t.results:t.coverageGap}</span></button></td>})}</tr>)}</tbody></table></div></details>
}

function GenealogyNetwork({locale,t}){
  const [kind,setKind]=useState('all')
  const visible=networkEdges.filter(edge=>kind==='all'||edge.kind===kind)
  const grouped=visible.reduce((groups,edge)=>{const key=edge.polity?.id||'other';const group=groups.get(key)||{polity:edge.polity,edges:[]};group.edges.push(edge);groups.set(key,group);return groups},new Map())
  return <section className="relations-network-panel"><header><div><h3>{t.networkTitle}</h3><p>{t.networkIntro}</p></div><label><span>{t.networkKind}</span><select value={kind} onChange={event=>setKind(event.target.value)}><option value="all">{t.allNetworks}</option><option value="genealogy">{t.genealogy}</option><option value="feudatory">{t.feudatory}</option></select></label></header><div>{[...grouped.values()].map(group=><article key={group.polity?.id||'other'}><strong>{text(group.polity?.name,locale)||t.all}</strong>{group.edges.map(edge=>{const source=edge.record.citations?.[0]&&sourceById.get(edge.record.citations[0].sourceId);return <div className={edge.evidenceLevel==='derived'?'derived':'source-backed'} key={edge.id}><span>{text(edge.from.name,locale)}</span><i aria-hidden="true">→</i><span>{text(edge.to.name,locale)}</span><small>{edge.kind==='genealogy'?t.genealogy:t.feudatory} · {t.evidenceLevel}: {edge.evidenceLevel} · {edge.reviewStatus}</small>{source&&<em>{text(source.title,locale)}</em>}</div>})}</article>)}</div></section>
}

function RelationViewport({selected}){
  const map=useMap()
  useEffect(()=>{if(selected?.positions.length>1)map.fitBounds(selected.positions,{padding:[40,40],maxZoom:6});else if(selected?.positions[0])map.setView(selected.positions[0],5)},[map,selected])
  return null
}

export default function GlobalRelationsExplorer({locale='kn',mapTheme='modern',setMapTheme,onOpenAtlas}){
  const t=copy[locale]
  const [query,setQuery]=useState('')
  const [region,setRegion]=useState('all')
  const [corridor,setCorridor]=useState('all')
  const [category,setCategory]=useState('all')
  const [control,setControl]=useState('all')
  const [focus,setFocus]=useState('karnata-rule')
  const [polity,setPolity]=useState('all')
  const [century,setCentury]=useState('all')
  const [selectedId,setSelectedId]=useState('event-domingo-paes-vijayanagara')
  const [isolateSelection,setIsolateSelection]=useState(false)
  const [legendOpen,setLegendOpen]=useState(false)
  const filtered=useMemo(()=>records.filter(item=>{
    const needle=query.trim().toLowerCase()
    const itemCentury=Math.floor((item.year-1)/100)+1
    return (!needle||item.searchText.includes(needle)||item.countries.join(' ').toLowerCase().includes(needle))&&(focus==='all'||(focus==='karnata-rule'?isKarnataReach(item):!isKarnataReach(item)))&&(region==='all'||item.region===region)&&(corridor==='all'||item.corridor===corridor)&&(category==='all'||item.category===category)&&(control==='all'||item.controlKind===control)&&(polity==='all'||item.polityIds.includes(polity))&&(century==='all'||itemCentury===Number(century))
  }),[query,focus,region,corridor,category,control,polity,century])
  useEffect(()=>{if(filtered.length&&!filtered.some(item=>item.id===selectedId))setSelectedId(filtered[0].id)},[filtered,selectedId])
  const selected=filtered.find(item=>item.id===selectedId)||filtered[0]||null
  const selectItem=id=>{setSelectedId(id);setIsolateSelection(true)}
  const legendPolities=[...new Set(filtered.map(primaryPolityId).filter(Boolean))].map(id=>entityById.get(id)).filter(Boolean)
  const citations=(selected?.record.citations||[]).map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  const relatedEntities=(selected?.record.polityIds||selected?.record.participants?.map(item=>item.polityId)||selected?.record.parties?.map(item=>item.polityId)||[]).map(id=>entityById.get(id)).filter(Boolean)
  const selectMatrix=(nextCorridor,nextCategory)=>{setFocus('all');setRegion('all');setCorridor(nextCorridor);setCategory(nextCategory);setControl('all');setPolity('all');setCentury('all');setQuery('')}
  const timelineStories=filtered.slice().sort((a,b)=>a.year-b.year)
  useEffect(()=>{const handler=event=>{if(!event.target.closest?.('.relations-timeline'))return;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)||!timelineStories.length)return;event.preventDefault();const current=Math.max(0,timelineStories.findIndex(item=>item.id===selectedId));const index=event.key==='Home'?0:event.key==='End'?timelineStories.length-1:Math.max(0,Math.min(timelineStories.length-1,current+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)));selectItem(timelineStories[index].id)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[timelineStories,selectedId])
  const visibleRelations=isolateSelection&&selected?[selected]:filtered
  return <main className="relations-page" id="relations"><section className="relations-intro"><p className="eyebrow">{t.subtitle}</p><h2>{t.title}</h2><p>{t.intro}</p><RelationsMatrix locale={locale} t={t} onSelect={selectMatrix}/><GenealogyNetwork locale={locale} t={t}/></section><section className="relations-workspace"><aside className="relations-filters"><label className="relations-search"><span>{t.search}</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.search}/></label><div className="relations-filter-grid"><label><span>{t.focus}</span><select value={focus} onChange={event=>setFocus(event.target.value)}><option value="karnata-rule">{t.karnataRule}</option><option value="all">{t.allGlobal}</option><option value="other">{t.otherContacts}</option></select></label><label><span>{t.direction}</span><select value={region} onChange={event=>setRegion(event.target.value)}><option value="all">{t.all}</option><option value="north">{t.north}</option><option value="south">{t.south}</option><option value="east">{t.east}</option><option value="west">{t.west}</option><option value="subcontinent">{t.subcontinent}</option></select></label><label><span>{t.corridor}</span><select value={corridor} onChange={event=>setCorridor(event.target.value)}><option value="all">{t.all}</option>{corridorKeys.map(value=><option key={value} value={value}>{t.corridors[value]}</option>)}</select></label><label><span>{t.relation}</span><select value={category} onChange={event=>setCategory(event.target.value)}><option value="all">{t.all}</option>{matrixCategories.map(value=><option key={value} value={value}>{t[value]}</option>)}</select></label><label><span>{t.control}</span><select value={control} onChange={event=>setControl(event.target.value)}><option value="all">{t.all}</option><option value="contact">{t.contact}</option><option value="territorial">{t.territorial}</option></select></label><label><span>{t.polity}</span><select value={polity} onChange={event=>setPolity(event.target.value)}><option value="all">{t.allPolities}</option>{atlasData.polities.map(item=><option key={item.id} value={item.id}>{text(item.name,locale)}</option>)}</select></label><label><span>{t.century}</span><select value={century} onChange={event=>setCentury(event.target.value)}><option value="all">{t.allCenturies}</option>{Array.from({length:17},(_,index)=>index+4).map(value=><option value={value} key={value}>{value}{locale==='kn'?'ನೇ':'th'}</option>)}</select></label></div><button className="relations-clear-selection" onClick={()=>setIsolateSelection(false)}>{isolateSelection?(locale==='kn'?'ಆಯ್ಕೆ ತೆರವುಗೊಳಿಸಿ':'Clear selection'):(locale==='kn'?'ಎಲ್ಲ ಮಾರ್ಗಗಳನ್ನು ತೋರಿಸಿ':'Show all paths')}</button><div className="map-theme-control" role="group" aria-label={t.mapTheme} title={t.mapThemeNote}><span>{t.mapTheme}</span><div><button className={mapTheme==='modern'?'active':''} aria-pressed={mapTheme==='modern'} onClick={()=>setMapTheme?.('modern')}>{t.modernTheme}</button><button className={mapTheme==='historical'?'active':''} aria-pressed={mapTheme==='historical'} onClick={()=>setMapTheme?.('historical')}>{t.historicalTheme}</button></div></div><p className="relations-count"><b>{filtered.length}</b> {t.results}</p><div className="relations-list">{filtered.map(item=>{const pending=!['reviewed','verified','published'].includes(item.reviewStatus);return <button key={item.id} className={`${selected?.id===item.id?'active':''} ${pending?'pending':''}`} onClick={()=>selectItem(item.id)} style={{'--relation-color':colors[item.category],'--polity-color':routeColorFor(item)}}><i></i><span>{item.year}{item.date.to!==item.date.from?`–${item.date.to}`:''}</span><strong>{text(item.name,locale)}</strong><small>{t[item.category]} · {text(entityById.get(primaryPolityId(item))?.name,locale)||t[item.controlKind]} · {t[item.controlKind]} · {item.reviewStatus}</small></button>})}{!filtered.length&&<p>{t.noResults}</p>}</div></aside><section className={`relations-map theme-${mapTheme}`}><MapContainer center={[22,55]} zoom={3} minZoom={2} scrollWheelZoom><RelationViewport selected={selected}/><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{visibleRelations.map(item=>{const pending=!['reviewed','verified','published'].includes(item.reviewStatus);return item.kind==='territory'?<Polygon key={item.id} positions={item.positions} pathOptions={{color:routeColorFor(item),fillColor:routeColorFor(item),fillOpacity:selected?.id===item.id ? .3 : .16,weight:selected?.id===item.id?3:2,dashArray:relationDashes[item.category],className:pending?'relation-shape-pending':''}} eventHandlers={{click:()=>selectItem(item.id)}}><Tooltip sticky>{text(item.name,locale)} · {item.reviewStatus}</Tooltip></Polygon>:<Fragment key={item.id}>{item.positions.length>1&&<Polyline positions={item.positions} pathOptions={{color:routeColorFor(item),weight:selected?.id===item.id?5:3,opacity:selected?.id===item.id?1:pending?.55:.72,dashArray:relationDashes[item.category],lineCap:'round',className:pending?'relation-path-pending':''}} eventHandlers={{click:()=>selectItem(item.id)}}/>}{item.positions.map((position,index)=><CircleMarker key={`${item.id}-${index}`} center={position} radius={selected?.id===item.id?7:4} pathOptions={{color:pending?'#b06a1f':'#fff',fillColor:routeColorFor(item),fillOpacity:pending?.72:1,weight:pending?3:2,dashArray:pending?'2 4':null}} eventHandlers={{click:()=>selectItem(item.id)}}><Tooltip>{text(item.name,locale)} · {item.reviewStatus}</Tooltip></CircleMarker>)}</Fragment>})}</MapContainer><div className={`relations-legend map-overlay-disclosure ${legendOpen?'open':''}`}><button className="map-overlay-disclosure-toggle" aria-expanded={legendOpen} onClick={()=>setLegendOpen(open=>!open)}>{t.mapKey}</button><div className="map-overlay-disclosure-content"><strong>{locale==='kn'?'ಮಾರ್ಗದ ಬಣ್ಣ = ಕರ್ನಾಟಕದ ರಾಜ್ಯ':'Route colour = Karnataka polity'}</strong><div className="relations-polity-legend">{legendPolities.map(polity=><span key={polity.id}><i className="polity-key" style={{'--polity-color':colorForPolity(polity.id)}}></i>{text(polity.name,locale)}</span>)}</div><strong>{locale==='kn'?'ಗೆರೆ ಶೈಲಿ = ಸಂಬಂಧದ ಸ್ವರೂಪ':'Line style = relationship type'}</strong><div className="relations-type-legend">{['trade','diplomacy','travel','war','political'].map(value=><span key={value}><i className={`relation-style-key ${value}`}></i>{t[value]}</span>)}</div><span><i className="area-key"></i>{t.areas}</span><span><i className="pending-key"></i>{t.pendingMark}</span></div></div><div className="relations-timeline" aria-label={t.timeline}><header><strong>{t.timeline}</strong><span>{timelineStories.length} {t.results}</span></header><div>{timelineStories.map(item=><button key={`timeline-${item.id}`} className={selected?.id===item.id?'active':''} onClick={()=>selectItem(item.id)} style={{'--timeline-color':colors[item.category],'--timeline-polity-color':routeColorFor(item)}}><i className="timeline-category-key" aria-hidden="true"></i><span>{item.year}</span><strong>{text(item.name,locale)}</strong></button>)}</div></div></section><aside className="relations-detail">{selected?<><div className="relation-status" style={{background:colors[selected.category]}}>{t[selected.category]}</div><p className="eyebrow">{selected.year}{selected.date.to!==selected.date.from?`–${selected.date.to}`:''} CE · {t.corridors[selected.corridor]}</p><h2>{text(selected.name,locale)}</h2><p className="entity-secondary">{other(selected.name,locale)}</p><p>{text(selected.record.summary||selected.record.description,locale)}</p><div className={`relation-review ${selected.reviewStatus}`}>{t.evidence}: {selected.reviewStatus}</div>{recordAuthorityCited(selected.record,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}{selected.record.reach&&<div className="relation-evidence"><b>{selected.record.reach.territorialControl?t.hasControl:t.noControl}</b><span>{t.evidence}: {selected.record.reach.evidenceLevel}</span><span>{t.countries}: {selected.countries.join(', ')||'—'}</span><p>{text(selected.record.reach.note,locale)}</p></div>}{selected.kind==='territory'&&<div className="relation-evidence territorial"><b>{t.hasControl}</b><span>{selected.record.classification} · {selected.record.controlLevel}</span><p>{text(selected.record.description,locale)}</p></div>}<div className="relation-entities">{relatedEntities.map(item=><span key={item.id}>{text(item.name,locale)}</span>)}</div><h3>{t.sources}</h3><div className="citations">{citations.map((item,index)=><p key={`${item.sourceId}-${index}`}><a href={item.source.url} target="_blank" rel="noreferrer"><strong>{text(item.source.title,locale)}</strong></a><ProvenanceBadge tier={sourceTiers.get(item.sourceId)} locale={locale} short/><span>{item.locator}</span></p>)}</div><button className="relations-open-atlas" onClick={()=>onOpenAtlas?.(selected)}>{t.openAtlas}</button></>:<p>{t.noResults}</p>}</aside></section></main>
}
