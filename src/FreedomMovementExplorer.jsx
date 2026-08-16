import { useEffect, useMemo, useRef, useState } from 'react'
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { canonicalDistrictAssociation } from './data/district-normalization'
import SourceLink from './SourceLink'

const primary=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const secondary=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const reviewedStatuses=new Set(['reviewed','verified','published'])
const validPoint=point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite)
const yearLabel=(date,locale,undated)=>Number.isFinite(date?.from)?`${date?.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${date?.from}${date?.to&&date?.to!==date?.from?`–${date?.to}`:''} ${date?.era==='BCE'?(locale==='kn'?'ಕ್ರಿ.ಪೂ.':'BCE'):(locale==='kn'?'ಕ್ರಿ.ಶ.':'CE')}`:undated
const geometryCenter=geometry=>{const points=[];const visit=value=>{if(Array.isArray(value)&&value.length===2&&value.every(Number.isFinite))points.push(value);else if(Array.isArray(value))value.forEach(visit)};visit(geometry?.coordinates);if(!points.length)return null;const lngs=points.map(point=>point[0]),lats=points.map(point=>point[1]);return[(Math.min(...lats)+Math.max(...lats))/2,(Math.min(...lngs)+Math.max(...lngs))/2]}
const provisionalDistrictPoint=(feature,id)=>{const center=geometryCenter(feature?.geometry);if(!center)return null;const hash=[...String(id)].reduce((value,char)=>(value*31+char.charCodeAt(0))>>>0,2166136261);const angle=(hash%360)*Math.PI/180;const radius=.025+((hash>>>8)%8)*.012;return[center[0]+Math.sin(angle)*radius,center[1]+Math.cos(angle)*radius]}

const copy={
  kn:{
    eyebrow:'ಸಂಶೋಧನಾ ಅನ್ವೇಷಣೆ',title:'ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ',intro:'ಹೋರಾಟಗಾರರು, ಬಂಧನ, ಸೆರೆವಾಸ, ಚಳವಳಿ, ಸಶಸ್ತ್ರ ಪ್ರತಿರೋಧ ಮತ್ತು ಹುತಾತ್ಮತೆಯ ಸ್ಥಳ–ಕಾಲ ಸಾಕ್ಷ್ಯಗಳನ್ನು ಒಂದೇ ನಕ್ಷೆ ಮತ್ತು ಪಟ್ಟಿಯಲ್ಲಿ ಅನ್ವೇಷಿಸಿ.',people:'ವ್ಯಕ್ತಿ ಸಂಶೋಧನಾ ದಾಖಲೆಗಳು',records:'ದಾಖಲೀಕೃತ ಘಟನೆಗಳು',districts:'ಜಿಲ್ಲಾ ಸಂಬಂಧಗಳು',reviewed:'ಪರಿಶೀಲಿತ',pending:'ಪರಿಶೀಲನೆ ಬಾಕಿ',undated:'ಕಾಲ ದಾಖಲಾಗಿಲ್ಲ',search:'ಹೆಸರು, ಸ್ಥಳ ಅಥವಾ ಆಕರ ಹುಡುಕಿ',allDistricts:'ಎಲ್ಲ ಜಿಲ್ಲೆಗಳು',allActions:'ಎಲ್ಲ ಘಟನೆಗಳು',allReviews:'ಎಲ್ಲ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿಗಳು',clear:'ಶೋಧಕ ತೆರವು',mapTitle:'ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಭೂಪಟ',mapNote:'ಘನ ಗುರುತುಗಳು ದಾಖಲಾದ ಸ್ಥಳಗಳು; ತುಂಡು-ಗೆರೆಗಳು ಜಿಲ್ಲಾ/ನಗರ ಕೇಂದ್ರದ ತಾತ್ಕಾಲಿಕ ಸ್ಥಳಸೂಚಿಗಳು, ನಿಖರ ಘಟನಾ ಸ್ಥಳವಲ್ಲ.',modern:'ಆಧುನಿಕ',historical:'ಪಾರಂಪರಿಕ',results:'ಫಲಿತಾಂಶಗಳು',sourceLead:'ಆಕರ ಆಧಾರಿತ ಸಂಶೋಧನಾ ದಾಖಲೆ',places:'ಸ್ಥಳ ಸುಳಿವುಗಳು',actions:'ಘಟನೆ ಸುಳಿವುಗಳು',source:'ಆಕರ ಮತ್ತು ಸ್ಥಾನಸೂಚಿ',evidence:'ಪರಿಶೀಲಿಸಬೇಕಾದ ಸಾಕ್ಷ್ಯ',openPerson:'ವ್ಯಕ್ತಿ ಪರಿಶೀಲನಾ ದಾಖಲೆ',openAtlas:'ಮುಖ್ಯ ಭೂಪಟದಲ್ಲಿ ತೆರೆಯಿರಿ',contribute:'ಆಕರದೊಂದಿಗೆ ಕೊಡುಗೆ ನೀಡಿ',empty:'ಈ ಶೋಧಕಗಳಿಗೆ ಹೊಂದುವ ದಾಖಲೆಗಳಿಲ್ಲ.',selected:'ಆಯ್ದ ದಾಖಲೆ',all:'ಎಲ್ಲ ದಾಖಲೆಗಳನ್ನು ನೋಡಿ',provisional:'ತಾತ್ಕಾಲಿಕ ಜಿಲ್ಲಾ/ನಗರ ಕೇಂದ್ರ',documented:'ದಾಖಲಾದ ಸ್ಥಳದ ಗುರುತು',pageReview:'ಮುದ್ರಿತ ಪುಟ, ವ್ಯಕ್ತಿಯ ಗುರುತು, ನಿಖರ ಸ್ಥಳ ಮತ್ತು ಘಟನೆಗಳ ಕ್ರಮವನ್ನು ಮಾನವ ಪರಿಶೀಲನೆ ಮಾಡಬೇಕು.',actionLabels:{'imprisonment-or-detention':'ಸೆರೆವಾಸ ಅಥವಾ ಬಂಧನ','arrest-or-capture':'ಬಂಧನ ಅಥವಾ ವಶಪಡಿಸಿಕೆ','death-or-martyrdom':'ಮರಣ ಅಥವಾ ಹುತಾತ್ಮತೆ','movement-or-resistance':'ಚಳವಳಿ ಅಥವಾ ಪ್ರತಿರೋಧ','armed-action':'ಸಶಸ್ತ್ರ ಹೋರಾಟ'}
  },
  en:{
    eyebrow:'Research explorer',title:"Karnataka's Freedom Movement",intro:'Explore people, arrests, imprisonment, movements, armed resistance and martyrdom through a connected map and records list.',people:'person research records',records:'documented events',districts:'district associations',reviewed:'reviewed',pending:'awaiting review',undated:'date not recorded',search:'Search name, place or source',allDistricts:'All districts',allActions:'All event types',allReviews:'All review states',clear:'Clear filters',mapTitle:'Freedom movement map',mapNote:'Solid markers are documented locations; dashed markers are provisional district/city-centre leads, not exact event locations.',modern:'Modern',historical:'Historical paper',results:'results',sourceLead:'Source-backed research record',places:'Place leads',actions:'Event leads',source:'Source and locator',evidence:'Evidence still required',openPerson:'Open person review record',openAtlas:'Open in main atlas',contribute:'Contribute cited evidence',empty:'No records match these filters.',selected:'Selected record',all:'Show all records',provisional:'Provisional district/city centre',documented:'Documented location lead',pageReview:'A human reviewer must verify the printed page, identity, exact locality and event sequence.',actionLabels:{'imprisonment-or-detention':'Imprisonment or detention','arrest-or-capture':'Arrest or capture','death-or-martyrdom':'Death or martyrdom','movement-or-resistance':'Movement or resistance','armed-action':'Armed action'}
  },
}

function FreedomMapViewport({points,selectedPoint}){
  const map=useMap()
  useEffect(()=>{
    if(validPoint(selectedPoint)){map.flyTo(selectedPoint,9,{duration:.5});return}
    if(!points.length)return
    if(points.length===1){map.setView(points[0],8);return}
    map.fitBounds(points,{padding:[28,28],maxZoom:7})
  },[map,points,selectedPoint])
  return null
}

export default function FreedomMovementExplorer({locale='kn',districtGeojson,mapTheme,setMapTheme}){
  const t=copy[locale]
  const initialParams=new URLSearchParams(window.location.search)
  const sourceById=useMemo(()=>new Map(atlasData.sources.map(source=>[source.id,source])),[])
  const placeById=useMemo(()=>new Map(atlasData.places.map(place=>[place.id,place])),[atlasData.places])
  const candidateById=useMemo(()=>new Map((atlasData.martyrCandidates||[]).map(candidate=>[candidate.id,candidate])),[])
  const districtById=useMemo(()=>new Map((districtGeojson?.features||[]).map(feature=>[feature.properties.id,feature])),[districtGeojson])
  const people=useMemo(()=>{
    const eventByCandidate=new Map()
    atlasData.events.filter(event=>event.researchInput?.sourceCollection==='martyrCandidates').forEach(event=>(event.candidateIds||[]).forEach(id=>{if(!eventByCandidate.has(id))eventByCandidate.set(id,event)}))
    const byId=new Map()
    atlasData.people.filter(person=>person.roles?.includes('freedom-fighter')).forEach(person=>byId.set(person.id,person))
    ;(atlasData.martyrCandidates||[]).filter(person=>person.roles?.includes('freedom-fighter')).forEach(person=>{if(!byId.has(person.id))byId.set(person.id,person)})
    return [...byId.values()].map(person=>{
      const isCandidate=(person.reviewWorkflow||person.candidateKind)!==undefined
      const event=eventByCandidate.get(person.id)
      const explicitDistricts=(person.districtAssociations||[]).map(association=>({districtId:association.districtId,name:primary(districtById.get(association.districtId)?.properties?.districtName,locale)||association.districtId,kind:association.kind,citations:association.citations}))
      const textDistricts=[...new Map((Array.isArray(person.districtText)?person.districtText:person.districtText?[person.districtText]:[]).map(value=>{const association=canonicalDistrictAssociation(value,{districtById,locale});return[association.districtId,association]})).values()]
      const districtAssociations=explicitDistricts.length?explicitDistricts:textDistricts
      let point=null,precision=null
      if(event?.location?.coordinates){point=[event.location.coordinates[1],event.location.coordinates[0]];precision=event.location.precision||'documented'}
      const placePoint=(person.placeAssociations||[]).map(association=>{const coordinates=placeById.get(association.placeId)?.location?.coordinates;return validPoint(coordinates)?[coordinates[1],coordinates[0]]:null}).find(Boolean)
      if(!point&&placePoint){point=placePoint;precision='place-association'}
      const featured=districtAssociations.length&&districtById.get(districtAssociations[0].districtId)
      if(!point&&featured){point=provisionalDistrictPoint(featured,person.id);precision='provisional-district-centre'}
      const actions=[...new Set([...(event?.researchInput?.actions||[]),...(person.historicalConnection?.actions||[])])]
      const years=event?.researchInput?.years||[]
      const timelineDate=event?.date||person.date||(years.length?{from:Math.min(...years),to:Math.max(...years),era:'CE',precision:'range'}:null)
      const review=person.review||event?.review||{status:isCandidate?'needs-review':null}
      return {...person,isCandidate,event,districtAssociations,point,precision,actions,years,timelineDate,timelineYear:Number.isFinite(timelineDate?.from)?timelineDate.from:null,review}
    })
  },[placeById,candidateById,districtById,locale])
  const events=useMemo(()=>new Set(atlasData.events.filter(event=>event.researchInput?.sourceCollection==='martyrCandidates').map(event=>event.id)),[])
  const initialId=initialParams.get('freedomEvent')
  const [selectedId,setSelectedId]=useState(()=>people.some(person=>person.id===initialId)?initialId:null)
  const [query,setQuery]=useState('')
  const [district,setDistrict]=useState(()=>initialParams.get('freedomDistrict')||'all')
  const [action,setAction]=useState('all')
  const [review,setReview]=useState('all')
  const listRef=useRef(null)
  const districts=useMemo(()=>[...new Map(people.flatMap(person=>person.districtAssociations.map(item=>[item.districtId,item.name]))).entries()].sort((a,b)=>String(a[1]).localeCompare(String(b[1]),locale)),[people,locale])
  const actions=useMemo(()=>[...new Set(people.flatMap(person=>person.actions))].sort(),[people])
  const reviews=useMemo(()=>[...new Set(people.map(person=>person.review?.status).filter(Boolean))].sort(),[people])
  const filtered=useMemo(()=>{const needle=query.trim().toLowerCase();return people.filter(person=>{
    const searchText=`${primary(person.name,'kn')} ${primary(person.name,'en')} ${(person.aliases||[]).map(alias=>`${primary(alias,'kn')||''} ${primary(alias,'en')||''}`).join(' ')} ${person.districtAssociations.map(item=>item.name).join(' ')} ${(person.placeAssociations||[]).map(item=>primary(placeById.get(item.placeId)?.name,locale)||'').join(' ')} ${primary(person.event?.summary,'kn')} ${primary(person.event?.summary,'en')} ${person.event?.researchInput?.archivalReference||''} ${(person.citations||[]).map(citation=>citation.locator).join(' ')}`.toLowerCase()
    return (!needle||searchText.includes(needle))&&(district==='all'||person.districtAssociations.some(item=>item.districtId===district))&&(action==='all'||person.actions.includes(action))&&(review==='all'||person.review?.status===review)
  }).sort((a,b)=>(a.timelineYear??Infinity)-(b.timelineYear??Infinity))},[people,query,district,action,review,placeById,locale])
  const selected=people.find(person=>person.id===selectedId)||null
  const choose=person=>{setSelectedId(person.id);const url=new URL(window.location.href);url.searchParams.delete('person');url.searchParams.set('freedomEvent',person.id);history.replaceState(null,'',`${url.pathname}${url.search}#freedom`)}
  const chooseDistrict=value=>{setDistrict(value);const url=new URL(window.location.href);if(value==='all')url.searchParams.delete('freedomDistrict');else url.searchParams.set('freedomDistrict',value);history.replaceState(null,'',`${url.pathname}${url.search}#freedom`)}
  const clearSelection=()=>{setSelectedId(null);const url=new URL(window.location.href);url.searchParams.delete('freedomEvent');history.replaceState(null,'',`${url.pathname}${url.search}#freedom`)}
  const clearFilters=()=>{setQuery('');chooseDistrict('all');setAction('all');setReview('all')}
  const personHref=person=>{const url=new URL(window.location.href);url.searchParams.delete('freedomEvent');url.searchParams.set('person',person.id);url.hash='people';return `${url.pathname}${url.search}${url.hash}`}
  const atlasHref=person=>{const url=new URL(window.location.href);url.searchParams.delete('freedomEvent');url.searchParams.delete('person');if(Number.isFinite(person.timelineYear))url.searchParams.set('year',person.timelineYear);url.searchParams.set('lat',person.point[0].toFixed(5));url.searchParams.set('lng',person.point[1].toFixed(5));url.searchParams.set('zoom','9');url.hash='atlas';return `${url.pathname}${url.search}${url.hash}`}
  const contributeHref=person=>{const url=new URL(window.location.href);url.searchParams.delete('freedomEvent');url.searchParams.set('contributeTarget',person.id);url.searchParams.set('contributeType','martyrCandidate');url.searchParams.set('contributeName',primary(person.name,locale)||primary(person.event?.name,locale)||'');url.hash='community';return `${url.pathname}${url.search}${url.hash}`}
  const onListKeyDown=event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;const buttons=[...listRef.current.querySelectorAll('button')];const index=buttons.indexOf(event.target);if(index<0)return;event.preventDefault();const delta=['ArrowLeft','ArrowUp'].includes(event.key)?-1:1;buttons[(index+delta+buttons.length)%buttons.length]?.focus()}
  const mapped=filtered.filter(person=>validPoint(person.point))
  const freedomPeopleCount=people.length
  const verified=people.filter(person=>reviewedStatuses.has(person.review?.status)).length
  const selectedCitations=(selected?.citations?.length?selected.citations:(selected?.event?.citations||[]))
  const selectedPlaces=selected?[...selected.districtAssociations.map(item=>item.name),...(selected.placeAssociations||[]).map(item=>primary(placeById.get(item.placeId)?.name,locale)||item.placeId)]:[]
  return <main className="portal-page freedom-page" id="freedom">
    <section className="freedom-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div><div className="freedom-stats"><span className="freedom-people-stat"><b>{freedomPeopleCount}</b>{t.people}</span><span><b>{events.size}</b>{t.records}</span><span><b>{districts.length}</b>{t.districts}</span><span><b>{verified}</b>{t.reviewed}</span><span><b>{freedomPeopleCount-verified}</b>{t.pending}</span></div></section>
    <section className="freedom-filters" aria-label={t.title}><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.search} aria-label={t.search}/><select value={district} onChange={event=>chooseDistrict(event.target.value)} aria-label={t.allDistricts}><option value="all">{t.allDistricts}</option>{districts.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select><select value={action} onChange={event=>setAction(event.target.value)} aria-label={t.allActions}><option value="all">{t.allActions}</option>{actions.map(value=><option key={value} value={value}>{t.actionLabels[value]||value.replaceAll('-',' ')}</option>)}</select><select value={review} onChange={event=>setReview(event.target.value)} aria-label={t.allReviews}><option value="all">{t.allReviews}</option>{reviews.map(value=><option key={value}>{value}</option>)}</select><button type="button" onClick={clearFilters}>{t.clear}</button></section>
    <section className="freedom-workspace">
      <section className={`freedom-map theme-${mapTheme}`}>
        <div className="freedom-map-heading"><div><strong>{t.mapTitle}</strong><small>{t.mapNote}</small></div><div><button className={mapTheme==='modern'?'active':''} onClick={()=>setMapTheme('modern')}>{t.modern}</button><button className={mapTheme==='historical'?'active':''} onClick={()=>setMapTheme('historical')}>{t.historical}</button></div></div>
        <MapContainer center={[14.7,76.2]} zoom={6} minZoom={3} scrollWheelZoom>
          <FreedomMapViewport points={mapped.map(person=>person.point)} selectedPoint={selected?.point}/>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {districtGeojson&&<GeoJSON key={`${locale}-${district}`} data={districtGeojson} interactive={false} style={feature=>({color:district===feature.properties.id?'#9c3d32':'#68738b',weight:district===feature.properties.id?3:1,fillColor:'#9c3d32',fillOpacity:district===feature.properties.id ? .12 : .025,dashArray:district===feature.properties.id?null:'5 4'})}/>}
          {mapped.map(person=><CircleMarker key={person.id} center={person.point} radius={selected?.id===person.id?10:7} pathOptions={{color:'#9c3d32',fillColor:reviewedStatuses.has(person.review?.status)?'#9c3d32':'#fff7e7',fillOpacity:.95,weight:selected?.id===person.id?4:2,dashArray:reviewedStatuses.has(person.review?.status)||person.precision==='documented'?null:'4 3'}} eventHandlers={{click:()=>choose(person)}}><Popup><strong>{primary(person.name,locale)}</strong><br/><span>{person.districtAssociations.map(item=>item.name).join(' · ')}</span><br/><small>{yearLabel(person.timelineDate,locale,t.undated)} · {person.review?.status||t.provisional}</small><br/><button type="button" onClick={()=>choose(person)}>{t.selected}</button></Popup></CircleMarker>)}
        </MapContainer>
        <div className="freedom-map-legend"><span><i className="solid"></i>{t.documented}</span><span><i></i>{t.provisional}</span><small>{filtered.length} {t.results}</small></div>
      </section>
      <section className="freedom-list" ref={listRef} onKeyDown={onListKeyDown}><div><strong>{filtered.length} {t.results}</strong>{selected&&<button type="button" onClick={clearSelection}>{t.all}</button>}</div>{filtered.map(person=><button type="button" className={selected?.id===person.id?'selected':''} key={person.id} onClick={()=>choose(person)}><time>{yearLabel(person.timelineDate,locale,t.undated)}</time><strong>{primary(person.name,locale)}</strong><span>{person.districtAssociations.map(item=>item.name).join(' · ')||t.provisional}</span><small>{person.actions.map(value=>t.actionLabels[value]||value.replaceAll('-',' ')).join(' · ')}</small><mark className={person.review?.status||'needs-review'}>{person.review?.status||t.provisional}</mark></button>)}{!filtered.length&&<p>{t.empty}</p>}</section>
      {selected&&<aside className="freedom-detail"><button type="button" className="freedom-close" onClick={clearSelection} aria-label={t.all}>×</button><p className="eyebrow">{t.sourceLead}</p><h3>{primary(selected.name,locale)}</h3><p className="entity-secondary">{secondary(selected.name,locale)}</p><span className={`review-badge ${selected.review?.status||'needs-review'}`}>{selected.review?.status||t.provisional}</span>{(primary(selected.summary,locale)||primary(selected.event?.summary,locale))&&<p>{primary(selected.summary,locale)||primary(selected.event?.summary,locale)}</p>}<dl><div><dt>{t.places}</dt><dd>{selectedPlaces.length?selectedPlaces.join(' · '):'—'}</dd></div><div><dt>{t.actions}</dt><dd>{selected.actions.length?selected.actions.map(value=>t.actionLabels[value]||value.replaceAll('-',' ')).join(' · '):'—'}</dd></div><div><dt>{t.source}</dt><dd>{selectedCitations.length?selectedCitations.map((citation,index)=>{const source=sourceById.get(citation.sourceId);return <span key={`${citation.sourceId}-${index}`}>{source?.url?<SourceLink href={source.url} label={primary(source.title,locale)||citation.sourceId} locale={locale}/>:primary(source?.title,locale)||citation.sourceId}<small>{citation.locator}</small></span>}):'—'}</dd></div></dl><div className="freedom-review-note"><strong>{t.evidence}</strong><p>{t.pageReview}</p></div><div className="freedom-detail-actions"><a href={personHref(selected)}>{t.openPerson}</a><a href={atlasHref(selected)}>{t.openAtlas}</a>{selected.isCandidate&&<a className="primary" href={contributeHref(selected)}>{t.contribute}</a>}</div></aside>}
    </section>
  </main>
}