import { useEffect, useMemo, useRef, useState } from 'react'
import { CircleMarker, GeoJSON, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { canonicalDistrictAssociation } from './data/district-normalization'
import SourceLink from './SourceLink'

const primary=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const secondary=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const reviewedStatuses=new Set(['reviewed','verified','published'])
const validPoint=point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite)
const yearLabel=(date,locale)=>`${date?.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${date?.from}${date?.to!==date?.from?`–${date?.to}`:''} ${date?.era==='BCE'?(locale==='kn'?'ಕ್ರಿ.ಪೂ.':'BCE'):(locale==='kn'?'ಕ್ರಿ.ಶ.':'CE')}`

const copy={
  kn:{
    eyebrow:'ಸಂಶೋಧನಾ ಅನ್ವೇಷಣೆ',title:'ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ',intro:'ಹೋರಾಟಗಾರರು, ಬಂಧನ, ಸೆರೆವಾಸ, ಚಳವಳಿ, ಸಶಸ್ತ್ರ ಪ್ರತಿರೋಧ ಮತ್ತು ಹುತಾತ್ಮತೆಯ ಸ್ಥಳ–ಕಾಲ ಸಾಕ್ಷ್ಯಗಳನ್ನು ಒಂದೇ ಭೂಪಟ ಮತ್ತು ಕಾಲರೇಖೆಯಲ್ಲಿ ಅನ್ವೇಷಿಸಿ.',records:'ದಾಖಲೆಗಳು',districts:'ಜಿಲ್ಲಾ ಸಂಬಂಧಗಳು',reviewed:'ಪರಿಶೀಲಿತ',pending:'ಪರಿಶೀಲನೆ ಬಾಕಿ',search:'ಹೆಸರು, ಸ್ಥಳ ಅಥವಾ ಆಕರ ಹುಡುಕಿ',allDistricts:'ಎಲ್ಲ ಜಿಲ್ಲೆಗಳು',allActions:'ಎಲ್ಲ ಘಟನೆಗಳು',allReviews:'ಎಲ್ಲ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿಗಳು',clear:'ಶೋಧಕ ತೆರವು',mapTitle:'ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಭೂಪಟ',mapNote:'ತುಂಡು-ಗೆರೆ ಗುರುತುಗಳು ಜಿಲ್ಲಾ/ನಗರ ಕೇಂದ್ರದ ತಾತ್ಕಾಲಿಕ ಸ್ಥಳಸೂಚಿಗಳು; ಅವು ನಿಖರ ಘಟನಾ ಸ್ಥಳವಲ್ಲ.',modern:'ಆಧುನಿಕ',historical:'ಪಾರಂಪರಿಕ',timeline:'ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಕಾಲರೇಖೆ',results:'ಫಲಿತಾಂಶಗಳು',sourceLead:'ಆಕರ ಆಧಾರಿತ ಸಂಶೋಧನಾ ಸುಳಿವು',places:'ಸ್ಥಳ ಸುಳಿವುಗಳು',actions:'ಘಟನೆ ಸುಳಿವುಗಳು',source:'ಆಕರ ಮತ್ತು ಸ್ಥಾನಸೂಚಿ',evidence:'ಪರಿಶೀಲಿಸಬೇಕಾದ ಸಾಕ್ಷ್ಯ',openPerson:'ವ್ಯಕ್ತಿ ಪರಿಶೀಲನಾ ದಾಖಲೆ',openAtlas:'ಮುಖ್ಯ ಭೂಪಟದಲ್ಲಿ ತೆರೆಯಿರಿ',contribute:'ಆಕರದೊಂದಿಗೆ ಕೊಡುಗೆ ನೀಡಿ',empty:'ಈ ಶೋಧಕಗಳಿಗೆ ಹೊಂದುವ ದಾಖಲೆಗಳಿಲ್ಲ.',selected:'ಆಯ್ದ ದಾಖಲೆ',all:'ಎಲ್ಲ ದಾಖಲೆಗಳನ್ನು ನೋಡಿ',provisional:'ತಾತ್ಕಾಲಿಕ ಜಿಲ್ಲಾ/ನಗರ ಕೇಂದ್ರ',pageReview:'ಮುದ್ರಿತ ಪುಟ, ವ್ಯಕ್ತಿಯ ಗುರುತು, ನಿಖರ ಸ್ಥಳ ಮತ್ತು ಘಟನೆಗಳ ಕ್ರಮವನ್ನು ಮಾನವ ಪರಿಶೀಲನೆ ಮಾಡಬೇಕು.',actionLabels:{'imprisonment-or-detention':'ಸೆರೆವಾಸ ಅಥವಾ ಬಂಧನ','arrest-or-capture':'ಬಂಧನ ಅಥವಾ ವಶಪಡಿಸಿಕೆ','death-or-martyrdom':'ಮರಣ ಅಥವಾ ಹುತಾತ್ಮತೆ','movement-or-resistance':'ಚಳವಳಿ ಅಥವಾ ಪ್ರತಿರೋಧ','armed-action':'ಸಶಸ್ತ್ರ ಹೋರಾಟ'}
  },
  en:{
    eyebrow:'Research explorer',title:"Karnataka's Freedom Movement",intro:'Explore people, arrests, imprisonment, movements, armed resistance and martyrdom through a connected map and timeline.',records:'records',districts:'district associations',reviewed:'reviewed',pending:'awaiting review',search:'Search name, place or source',allDistricts:'All districts',allActions:'All event types',allReviews:'All review states',clear:'Clear filters',mapTitle:'Freedom movement map',mapNote:'Dashed markers are provisional district/city-centre leads, not exact event locations.',modern:'Modern',historical:'Historical paper',timeline:'Freedom movement timeline',results:'results',sourceLead:'Source-backed research lead',places:'Place leads',actions:'Event leads',source:'Source and locator',evidence:'Evidence still required',openPerson:'Open person review record',openAtlas:'Open in main atlas',contribute:'Contribute cited evidence',empty:'No records match these filters.',selected:'Selected record',all:'Show all records',provisional:'Provisional district/city centre',pageReview:'A human reviewer must verify the printed page, identity, exact locality and event sequence.',actionLabels:{'imprisonment-or-detention':'Imprisonment or detention','arrest-or-capture':'Arrest or capture','death-or-martyrdom':'Death or martyrdom','movement-or-resistance':'Movement or resistance','armed-action':'Armed action'}
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
  const candidateById=useMemo(()=>new Map((atlasData.martyrCandidates||[]).map(candidate=>[candidate.id,candidate])),[])
  const districtById=useMemo(()=>new Map((districtGeojson?.features||[]).map(feature=>[feature.properties.id,feature])),[districtGeojson])
  const records=useMemo(()=>atlasData.events.filter(event=>event.researchInput?.sourceCollection==='martyrCandidates').map(event=>{
    const candidate=candidateById.get(event.candidateIds?.[0])
    const districtAssociations=[...new Map((candidate?.districtText||event.researchInput.placeLeads||[]).map(value=>{const association=canonicalDistrictAssociation(value,{districtById,locale});return[association.districtId,association]})).values()]
    return {...event,candidate,districtAssociations,point:[event.location.coordinates[1],event.location.coordinates[0]],actions:event.researchInput.actions||[],years:event.researchInput.years||[]}
  }).sort((a,b)=>a.date.from-b.date.from),[candidateById,districtById,locale])
  const initialId=initialParams.get('freedomEvent')
  const [selectedId,setSelectedId]=useState(()=>records.some(record=>record.id===initialId)?initialId:null)
  const [query,setQuery]=useState('')
  const [district,setDistrict]=useState(()=>initialParams.get('freedomDistrict')||'all')
  const [action,setAction]=useState('all')
  const [review,setReview]=useState('all')
  const timelineRef=useRef(null)
  const districts=useMemo(()=>[...new Map(records.flatMap(record=>record.districtAssociations.map(item=>[item.districtId,item.name]))).entries()].sort((a,b)=>String(a[1]).localeCompare(String(b[1]),locale)),[records,locale])
  const actions=useMemo(()=>[...new Set(records.flatMap(record=>record.actions))].sort(),[records])
  const reviews=useMemo(()=>[...new Set(records.map(record=>record.review?.status).filter(Boolean))].sort(),[records])
  const filtered=useMemo(()=>{const needle=query.trim().toLowerCase();return records.filter(record=>{
    const searchText=`${primary(record.name,'kn')} ${primary(record.name,'en')} ${primary(record.candidate?.name,'kn')} ${primary(record.candidate?.name,'en')} ${(record.researchInput.placeLeads||[]).join(' ')} ${record.researchInput.archivalReference||''}`.toLowerCase()
    return (!needle||searchText.includes(needle))&&(district==='all'||record.districtAssociations.some(item=>item.districtId===district))&&(action==='all'||record.actions.includes(action))&&(review==='all'||record.review?.status===review)
  })},[records,query,district,action,review])
  const selected=records.find(record=>record.id===selectedId)||null
  const choose=record=>{setSelectedId(record.id);const url=new URL(window.location.href);url.searchParams.delete('person');url.searchParams.set('freedomEvent',record.id);history.replaceState(null,'',`${url.pathname}${url.search}#freedom`)}
  const chooseDistrict=value=>{setDistrict(value);const url=new URL(window.location.href);if(value==='all')url.searchParams.delete('freedomDistrict');else url.searchParams.set('freedomDistrict',value);history.replaceState(null,'',`${url.pathname}${url.search}#freedom`)}
  const clearSelection=()=>{setSelectedId(null);const url=new URL(window.location.href);url.searchParams.delete('freedomEvent');history.replaceState(null,'',`${url.pathname}${url.search}#freedom`)}
  const clearFilters=()=>{setQuery('');chooseDistrict('all');setAction('all');setReview('all')}
  const personHref=record=>{const url=new URL(window.location.href);url.searchParams.delete('freedomEvent');url.searchParams.set('person',record.candidate.id);url.hash='people';return `${url.pathname}${url.search}${url.hash}`}
  const atlasHref=record=>{const url=new URL(window.location.href);url.searchParams.delete('freedomEvent');url.searchParams.delete('person');url.searchParams.set('year',record.date.from);url.searchParams.set('lat',record.point[0].toFixed(5));url.searchParams.set('lng',record.point[1].toFixed(5));url.searchParams.set('zoom','9');url.hash='atlas';return `${url.pathname}${url.search}${url.hash}`}
  const contributeHref=record=>{const url=new URL(window.location.href);url.searchParams.delete('freedomEvent');url.searchParams.set('contributeTarget',record.candidate.id);url.searchParams.set('contributeType','martyrCandidate');url.searchParams.set('contributeName',primary(record.candidate.name,locale));url.hash='community';return `${url.pathname}${url.search}${url.hash}`}
  const onTimelineKeyDown=event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;const buttons=[...timelineRef.current.querySelectorAll('button')];const index=buttons.indexOf(event.target);if(index<0)return;event.preventDefault();const delta=['ArrowLeft','ArrowUp'].includes(event.key)?-1:1;buttons[(index+delta+buttons.length)%buttons.length]?.focus()}
  const verified=records.filter(record=>reviewedStatuses.has(record.review?.status)).length
  return <main className="portal-page freedom-page" id="freedom">
    <section className="freedom-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div><div className="freedom-stats"><span><b>{records.length}</b>{t.records}</span><span><b>{districts.length}</b>{t.districts}</span><span><b>{verified}</b>{t.reviewed}</span><span><b>{records.length-verified}</b>{t.pending}</span></div></section>
    <section className="freedom-filters" aria-label={t.title}><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.search} aria-label={t.search}/><select value={district} onChange={event=>chooseDistrict(event.target.value)} aria-label={t.allDistricts}><option value="all">{t.allDistricts}</option>{districts.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select><select value={action} onChange={event=>setAction(event.target.value)} aria-label={t.allActions}><option value="all">{t.allActions}</option>{actions.map(value=><option key={value} value={value}>{t.actionLabels[value]||value.replaceAll('-',' ')}</option>)}</select><select value={review} onChange={event=>setReview(event.target.value)} aria-label={t.allReviews}><option value="all">{t.allReviews}</option>{reviews.map(value=><option key={value}>{value}</option>)}</select><button type="button" onClick={clearFilters}>{t.clear}</button></section>
    <section className="freedom-workspace">
      <section className={`freedom-map theme-${mapTheme}`}>
        <div className="freedom-map-heading"><div><strong>{t.mapTitle}</strong><small>{t.mapNote}</small></div><div><button className={mapTheme==='modern'?'active':''} onClick={()=>setMapTheme('modern')}>{t.modern}</button><button className={mapTheme==='historical'?'active':''} onClick={()=>setMapTheme('historical')}>{t.historical}</button></div></div>
        <MapContainer center={[14.7,76.2]} zoom={6} minZoom={3} scrollWheelZoom>
          <FreedomMapViewport points={filtered.map(record=>record.point)} selectedPoint={selected?.point}/>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {districtGeojson&&<GeoJSON key={`${locale}-${district}`} data={districtGeojson} interactive={false} style={feature=>({color:district===feature.properties.id?'#9c3d32':'#68738b',weight:district===feature.properties.id?3:1,fillColor:'#9c3d32',fillOpacity:district===feature.properties.id ? .12 : .025,dashArray:district===feature.properties.id?null:'5 4'})}/>}
          {filtered.map(record=><CircleMarker key={record.id} center={record.point} radius={selected?.id===record.id?10:7} pathOptions={{color:'#9c3d32',fillColor:reviewedStatuses.has(record.review?.status)?'#9c3d32':'#fff7e7',fillOpacity:.95,weight:selected?.id===record.id?4:2,dashArray:reviewedStatuses.has(record.review?.status)?null:'4 3'}} eventHandlers={{click:()=>choose(record)}}><Popup><strong>{primary(record.candidate?.name,locale)||primary(record.name,locale)}</strong><br/><span>{record.districtAssociations.map(item=>item.name).join(' · ')}</span><br/><small>{yearLabel(record.date,locale)} · {record.review?.status}</small><br/><button type="button" onClick={()=>choose(record)}>{t.selected}</button></Popup></CircleMarker>)}
        </MapContainer>
        <div className="freedom-map-legend"><span><i></i>{t.provisional}</span><small>{filtered.length} {t.results}</small></div>
      </section>
      <section className="freedom-list"><div><strong>{filtered.length} {t.results}</strong>{selected&&<button type="button" onClick={clearSelection}>{t.all}</button>}</div>{filtered.map(record=><button type="button" className={selected?.id===record.id?'selected':''} key={record.id} onClick={()=>choose(record)}><time>{yearLabel(record.date,locale)}</time><strong>{primary(record.candidate?.name,locale)||primary(record.name,locale)}</strong><span>{record.districtAssociations.map(item=>item.name).join(' · ')}</span><small>{record.actions.map(value=>t.actionLabels[value]||value.replaceAll('-',' ')).join(' · ')}</small><mark className={record.review?.status}>{record.review?.status}</mark></button>)}{!filtered.length&&<p>{t.empty}</p>}</section>
      {selected&&<aside className="freedom-detail"><button type="button" className="freedom-close" onClick={clearSelection} aria-label={t.all}>×</button><p className="eyebrow">{t.sourceLead}</p><h3>{primary(selected.candidate?.name,locale)}</h3><p className="entity-secondary">{secondary(selected.candidate?.name,locale)}</p><span className={`review-badge ${selected.review?.status}`}>{selected.review?.status}</span><p>{primary(selected.summary,locale)}</p><dl><div><dt>{t.places}</dt><dd>{selected.researchInput.placeLeads.join(' · ')}</dd></div><div><dt>{t.actions}</dt><dd>{selected.actions.map(value=>t.actionLabels[value]||value.replaceAll('-',' ')).join(' · ')}</dd></div><div><dt>{t.source}</dt><dd>{selected.citations.map((citation,index)=>{const source=sourceById.get(citation.sourceId);return <span key={`${citation.sourceId}-${index}`}>{source?.url?<SourceLink href={source.url} label={primary(source.title,locale)||citation.sourceId} locale={locale}/>:primary(source?.title,locale)||citation.sourceId}<small>{citation.locator}</small></span>})}</dd></div></dl><div className="freedom-review-note"><strong>{t.evidence}</strong><p>{t.pageReview}</p></div><div className="freedom-detail-actions"><a href={personHref(selected)}>{t.openPerson}</a><a href={atlasHref(selected)}>{t.openAtlas}</a><a className="primary" href={contributeHref(selected)}>{t.contribute}</a></div></aside>}
    </section>
    <section className="freedom-timeline"><div><strong>{t.timeline}</strong><small>{filtered.length} {t.records}</small></div><div ref={timelineRef} onKeyDown={onTimelineKeyDown}>{filtered.map(record=><button type="button" key={record.id} className={selected?.id===record.id?'selected':''} onClick={()=>choose(record)}><time>{yearLabel(record.date,locale)}</time><strong>{primary(record.candidate?.name,locale)}</strong><small>{record.districtAssociations.map(item=>item.name).join(' · ')}</small></button>)}</div></section>
  </main>
}
