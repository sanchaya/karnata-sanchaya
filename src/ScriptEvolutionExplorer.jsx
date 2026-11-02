import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Polygon, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { atlasData } from './data/atlas'
import './script-fonts.css'
import { ERA_FONTS, PRINT_FONTS } from './data/era-fonts'
import DynastyAreasControl from './DynastyAreasControl'
import { DYNASTY_PHASES } from './data/dynasty-areas'

const PRINT_PHASES=new Set(['script-modern-kannada-print-transition','script-mysore-wodeyar-print-standard-kannada'])
const specimensFor=record=>PRINT_PHASES.has(record.id)?PRINT_FONTS:(record.relatedPolityIds||[]).map(id=>ERA_FONTS[id]).filter(Boolean)

const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const other=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const entityById=new Map([...atlasData.polities,...atlasData.externalPolities].map(record=>[record.id,record]))
const inscriptionById=new Map(atlasData.inscriptions.map(record=>[record.id,record]))
const sourceById=new Map(atlasData.sources.map(record=>[record.id,record]))
const completeStatuses=new Set(['verified','located','not-applicable'])
const dateLabel=(date,locale)=>`${date.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${date.from}${date.to!==date.from?`-${date.to}`:''} ${date.era}`
const labelList=value=>Array.isArray(value)?value.join(', '):value||''
const copy={
  kn:{older:'ಹಳೆಯ ಯೋಜನಾತ್ಮಕ ಆಕೃತಿಗಳು',dynastyNote:'ಇಂದಿನ ಜಿಲ್ಲೆಗಳ ಆಕಾರದಲ್ಲಿ ಅಂದಾಜು ಪ್ರದೇಶ (ಪರಿಶೀಲನೆ ಬಾಕಿ).',mapTitle:'ಈ ಹಂತದ ರಾಜ್ಯಗಳು ಭೂಪಟದಲ್ಲಿ',mapScope:'ಭೂಪಟ ವ್ಯಾಪ್ತಿ',karnataka:'ಕರ್ನಾಟಕ',india:'ಭಾರತ',mapNote:'ಯೋಜನಾತ್ಮಕ ವ್ಯಾಪ್ತಿಗಳು (ಪರಿಶೀಲನೆ ಬಾಕಿ); ಈ ಹಂತದ ಲಿಪಿಯನ್ನು ಬಳಸಿದ ರಾಜ್ಯಗಳನ್ನು ತೋರಿಸುತ್ತದೆ. ಭಾರತದಾದ್ಯಂತ ಭಾಷಾ ಪ್ರದೇಶಗಳ ಆಕರಸಹಿತ ದಾಖಲೆ ಇನ್ನೂ ಇಲ್ಲ.',mapEmpty:'ಈ ಹಂತಕ್ಕೆ ವ್ಯಾಪ್ತಿ ಅಥವಾ ರಾಜಧಾನಿ ದಾಖಲಾಗಿಲ್ಲ.',ribbon:'ಕಾಲಕ್ರಮದಲ್ಲಿ ಲಿಪಿ',printWord:'ಮುದ್ರಣ',printLabel:'ಮುದ್ರಣ ಯುಗ',specimens:'ಈ ಕಾಲದ ಲಿಪಿಗಳಿಂದ ಪ್ರೇರಿತ ಫಾಂಟ್‌ಗಳು',specimenNote:'ಫಾಂಟ್ಸ್ ಸಂಚಯದ ಅಕ್ಷರ ಶೈಲಿಗಳು; ಇವು ಆಧುನಿಕ ಮನರಂಜನೆಗಳು, ಶಾಸನದ ನಕಲುಗಳಲ್ಲ.',specimenLink:'ಎಲ್ಲ ಫಾಂಟ್‌ಗಳನ್ನು ನೋಡಿ',eyebrow:'P2 · ಲಿಪಿ ಪರಿವರ್ತನೆ',title:'ಕನ್ನಡ ಲಿಪಿ ವಿಕಾಸ ಕಾಲರೇಖೆ',intro:'ಶಾಸನ ಮಾದರಿ, ರಾಜಕೀಯ ಸಂಬಂಧ ಮತ್ತು ಮುದ್ರಣ ಸಂಸ್ಕೃತಿಯ ಮೂಲಕ ಲಿಪಿಯ ಹಂತಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ಇವು ಅಧ್ಯಯನ ಬಿಂದುಗಳು; ಸಂಪೂರ್ಣ ಲಿಪಿಶಾಸ್ತ್ರ ಸಾಕ್ಷ್ಯ ಇನ್ನೂ ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ.',search:'ಲಿಪಿ, ಶಾಸನ, ರಾಜ್ಯ ಅಥವಾ ಆಕರ ಹುಡುಕಿ',all:'ಎಲ್ಲ',family:'ಲಿಪಿ ಕುಟುಂಬ',phase:'ಹಂತ',samples:'ಮಾದರಿ ಶಾಸನಗಳು',predecessors:'ಹಿಂದಿನ ಹಂತಗಳು',polities:'ಸಂಬಂಧಿತ ರಾಜ್ಯಗಳು',sources:'ಆಕರಗಳು',evidence:'ಸಾಕ್ಷ್ಯ ಸ್ಥಿತಿ',openEvidence:'ಸಾಕ್ಷ್ಯ ಕಾರ್ಯಕ್ಕೆ ತೆರಳಿ',openEpigraphy:'ಶಾಸನ ಅನ್ವೇಷಣೆ ತೆರೆಯಿರಿ',needsReview:'ಪರಿಶೀಲನೆ ಬಾಕಿ',noResults:'ಈ ಶೋಧಕಗಳಿಗೆ ಲಿಪಿ ದಾಖಲೆಗಳಿಲ್ಲ.',samplePending:'ಮಾದರಿ ಬಾಕಿ',timeline:'ಲಿಪಿ ಕಾಲರೇಖೆ',classification:'ಲಿಪಿಶಾಸ್ತ್ರ ವರ್ಗೀಕರಣ',morphology:'ಆಕಾರಶಾಸ್ತ್ರ ಹಂತ',dynasties:'ವಂಶ ಹಂತಗಳು',medium:'ಸಾಕ್ಷ್ಯ ಮಾಧ್ಯಮ',traits:'ದೃಶ್ಯ ಲಕ್ಷಣಗಳು',note:'ಆಕಾರ ಟಿಪ್ಪಣಿ'},
  en:{older:'Older schematic shapes',dynastyNote:'Approximate areas drawn on today’s district shapes (awaiting review).',mapTitle:'Kingdoms of this phase on the map',mapScope:'Map scope',karnataka:'Karnataka',india:'India',mapNote:'Schematic extents awaiting review, showing the polities that used this phase’s script. Sourced language regions for all of India are not yet in the atlas.',mapEmpty:'No extent or capital is recorded for this phase.',ribbon:'Script through the ages',printWord:'ಮುದ್ರಣ',printLabel:'Print era',specimens:'Fonts inspired by this era',specimenNote:'Typefaces from Fonts Sanchaya. These are modern interpretations, not facsimiles of inscriptions.',specimenLink:'See all fonts',eyebrow:'P2 · Script evolution',title:'Kannada Script Evolution Timeline',intro:'Explore script phases through inscription samples, polity context and print culture. These are study nodes, not complete palaeographic proof packets.',search:'Search script, inscription, polity or source',all:'All',family:'Script family',phase:'Phase',samples:'Sample inscriptions',predecessors:'Predecessor phases',polities:'Related polities',sources:'Sources',evidence:'Evidence state',openEvidence:'Open evidence workflow',openEpigraphy:'Open Epigraphy Explorer',needsReview:'Needs review',noResults:'No script records match these filters.',samplePending:'Sample pending',timeline:'Script timeline',classification:'Palaeographic classification',morphology:'Morphological stage',dynasties:'Dynastic stages',medium:'Evidence medium',traits:'Visual traits',note:'Morphology note'},
}


const placeById=new Map(atlasData.places.map(record=>[record.id,record]))
const polityDate=id=>entityById.get(id)?.date
const KARNATAKA_BOUNDS=[[11.4,73.8],[18.6,78.7]]
const INDIA_BOUNDS=[[7,68],[29,92]]
const dynastyFont=phase=>ERA_FONTS[phase.polityId]?`"${ERA_FONTS[phase.polityId].family}",serif`:undefined
const fontStyle=polityId=>ERA_FONTS[polityId]?{fontFamily:`"${ERA_FONTS[polityId].family}",serif`}:undefined
// Dated schematic extents of the phase's polities; polities without a drawn extent fall back to their capital.
function phaseMapShapes(record){
  const from=record.date.from,to=record.date.to
  const ids=new Set(record.relatedPolityIds||[])
  const extents=atlasData.territorialExtents.filter(extent=>extent.geometry?.coordinates?.length&&extent.polityIds?.some(id=>ids.has(id))&&extent.date.from<=to&&extent.date.to>=from)
  const drawn=new Set(extents.flatMap(extent=>extent.polityIds))
  const capitals=[...ids].filter(id=>!drawn.has(id)).map(id=>{const polity=entityById.get(id);const coords=placeById.get(polity?.capitalId)?.location?.coordinates;return coords?{id,polity,point:[coords[1],coords[0]]}:null}).filter(Boolean)
  return {extents,capitals}
}
function FitScope({scope,shapes}){
  const map=useMap()
  useEffect(()=>{map.fitBounds(scope==='india'?INDIA_BOUNDS:KARNATAKA_BOUNDS,{padding:[8,8]})},[map,scope,shapes])
  return null
}
function ScriptMap({record,locale,t}){
  const [scope,setScope]=useState('karnataka')
  const [older,setOlder]=useState(false)
  const shapes=useMemo(()=>phaseMapShapes(record),[record])
  // Dynasties of this phase drawn on today's district shapes; phases with no mapped dynasty fall back to the older shapes.
  const phases=useMemo(()=>{const ids=new Set(record.relatedPolityIds||[]);return DYNASTY_PHASES.filter(phase=>ids.has(phase.polityId)&&phase.from<=record.date.to&&phase.to>=record.date.from)},[record])
  const hasDynasties=phases.length>0
  const showOlder=older||!hasDynasties
  const polityLabel=id=>text(entityById.get(id)?.name,locale)
  return <section className="script-map" aria-label={t.mapTitle}>
    <div className="script-map-head"><h4>{t.mapTitle}</h4><div role="group" aria-label={t.mapScope}>{[['karnataka',t.karnataka],['india',t.india]].map(([key,label])=><button key={key} type="button" className={scope===key?'active':''} aria-pressed={scope===key} onClick={()=>setScope(key)}>{label}</button>)}{hasDynasties&&<button type="button" className={older?'active':''} aria-pressed={older} onClick={()=>setOlder(value=>!value)}>{t.older}</button>}</div></div>
    <div className="script-map-frame"><MapContainer bounds={KARNATAKA_BOUNDS} minZoom={3} zoomSnap={0.25} scrollWheelZoom={false}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <FitScope scope={scope} shapes={shapes}/>
      <DynastyAreasControl locale={locale} phases={hasDynasties?phases:undefined} fontFor={dynastyFont} defaultYear={record.date.era==='BCE'?300:Math.max(300,Math.round((record.date.from+record.date.to)/2))}/>
      {showOlder&&shapes.extents.map((extent,index)=>{const polityId=extent.polityIds[0];const firstOfPolity=shapes.extents.findIndex(item=>item.polityIds[0]===polityId)===index;const color=entityById.get(polityId)?.color||'#9c3d32';return <Polygon key={extent.id} positions={extent.geometry.coordinates.map(([lng,lat])=>[lat,lng])} pathOptions={{color,fillColor:color,fillOpacity:.14,weight:2,dashArray:extent.classification==='core-administered'?null:'5 4'}}>{firstOfPolity&&!hasDynasties&&<Tooltip permanent direction="center" className="script-map-label"><span style={fontStyle(polityId)}>{polityLabel(polityId)}</span></Tooltip>}</Polygon>})}
      {(showOlder||!hasDynasties)&&shapes.capitals.map(item=><CircleMarker key={item.id} center={item.point} radius={7} pathOptions={{color:item.polity.color||'#9c3d32',fillColor:'#fff',fillOpacity:.9,weight:3}}><Tooltip permanent direction="right" className="script-map-label"><span style={fontStyle(item.id)}>{polityLabel(item.id)}</span></Tooltip></CircleMarker>)}
    </MapContainer></div>
    <p className="script-map-note">{hasDynasties?t.dynastyNote:t.mapNote}{!shapes.extents.length&&!shapes.capitals.length&&!hasDynasties?` ${t.mapEmpty}`:''}</p>
  </section>
}
// Eras in time order, each named in its own typeface; choosing one opens the first script phase that involves it.
function ScriptRibbon({records,selected,onSelect,locale,t}){
  const eras=Object.keys(ERA_FONTS).map(id=>({id,font:ERA_FONTS[id],date:polityDate(id)})).filter(item=>item.date).sort((a,b)=>a.date.from-b.date.from)
  return <nav className="script-ribbon" aria-label={t.ribbon}><span className="script-ribbon-label">{t.ribbon}</span><ol>{eras.map(item=>{const target=records.find(record=>record.relatedPolityIds?.includes(item.id));const here=selected?.relatedPolityIds?.includes(item.id);return <li key={item.id}><button type="button" className={here?'active':''} aria-current={here?'true':undefined} disabled={!target} onClick={()=>target&&onSelect(target.id)}><span style={{fontFamily:`"${item.font.family}",serif`}} lang="kn">{text(item.font.name,'kn')}</span><small>{text(item.font.name,locale)} · {item.date.from}–{item.date.to}</small></button></li>})}<li><button type="button" className={PRINT_PHASES.has(selected?.id)?'active':''} onClick={()=>onSelect('script-modern-kannada-print-transition')}><span style={{fontFamily:'"Karnata F Kittel",serif'}} lang="kn">{t.printWord}</span><small>{t.printLabel} · 1830–1950</small></button></li></ol></nav>
}

const scriptRecords=atlasData.scriptEvolution.map(record=>{
  const sampleInscriptions=(record.sampleInscriptionIds||[]).map(id=>inscriptionById.get(id)).filter(Boolean)
  const relatedPolities=(record.relatedPolityIds||[]).map(id=>entityById.get(id)).filter(Boolean)
  const predecessors=(record.predecessorIds||[]).map(id=>atlasData.scriptEvolution.find(item=>item.id===id)).filter(Boolean)
  const citations=(record.citations||[]).map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  const evidenceScore=[
    sampleInscriptions.length>0,
    predecessors.length>0||!record.predecessorIds?.length,
    relatedPolities.length>0,
    citations.length>0,
    record.review?.status==='reviewed'||record.review?.status==='published',
  ].filter(Boolean).length
  return {...record,sampleInscriptions,relatedPolities,predecessors,citations,evidenceScore,totalEvidence:5,searchText:JSON.stringify(record).toLowerCase()}
}).sort((a,b)=>a.date.from-b.date.from)

export default function ScriptEvolutionExplorer({locale='kn',initialSelectedId=null}){
  const t=copy[locale]
  const [query,setQuery]=useState('')
  const [family,setFamily]=useState('all')
  const [selectedId,setSelectedId]=useState(initialSelectedId||scriptRecords[0]?.id)
  useEffect(()=>{if(initialSelectedId)setSelectedId(initialSelectedId)},[initialSelectedId])
  const families=[...new Set(scriptRecords.map(item=>item.scriptFamily))].sort()
  const filtered=useMemo(()=>scriptRecords.filter(item=>{
    const needle=query.trim().toLowerCase()
    return (!needle||item.searchText.includes(needle)||text(item.name,locale).toLowerCase().includes(needle)||item.scriptFamily.toLowerCase().includes(needle)||item.sampleInscriptions.some(record=>text(record.name,locale).toLowerCase().includes(needle))||item.relatedPolities.some(record=>text(record.name,locale).toLowerCase().includes(needle)))&&(family==='all'||item.scriptFamily===family)
  }),[query,family,locale])
  const selected=filtered.find(item=>item.id===selectedId)||filtered[0]||null
  const unresolvedSamples=scriptRecords.filter(item=>item.sampleInscriptions.length===0).length
  return <main className="script-page portal-page" id="scripts"><section className="script-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div><div className="script-stats"><span><b>{scriptRecords.length}</b>{t.phase}</span><span><b>{scriptRecords.reduce((sum,item)=>sum+item.sampleInscriptions.length,0)}</b>{t.samples}</span><span><b>{unresolvedSamples}</b>{t.samplePending}</span></div></section><section className="script-workspace"><aside className="script-sidebar"><label><span>{t.search}</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.search}/></label><label><span>{t.family}</span><select value={family} onChange={event=>setFamily(event.target.value)}><option value="all">{t.all}</option>{families.map(value=><option key={value}>{value}</option>)}</select></label><div className="script-timeline" aria-label={t.timeline}>{filtered.map(item=><button key={item.id} className={selected?.id===item.id?'active':''} onClick={()=>setSelectedId(item.id)}><i style={{height:`${Math.max(18,item.evidenceScore*13)}px`}}></i><span>{dateLabel(item.date,locale)}</span><strong>{text(item.name,locale)}</strong><small>{item.morphologicalStage||item.scriptFamily} · {item.review?.status||'needs-review'}</small></button>)}{!filtered.length&&<p>{t.noResults}</p>}</div></aside><section className="script-detail"><ScriptRibbon records={scriptRecords} selected={selected} onSelect={setSelectedId} locale={locale} t={t}/>{selected?<><div className="script-detail-head"><div><small>{dateLabel(selected.date,locale)} · {selected.scriptFamily}</small><h3>{text(selected.name,locale)}</h3>{other(selected.name,locale)&&<p className="entity-secondary">{other(selected.name,locale)}</p>}</div><meter min="0" max={selected.totalEvidence} value={selected.evidenceScore}></meter></div><p>{text(selected.description,locale)}</p><section className="script-classification"><h4>{t.classification}</h4><dl>{selected.morphologicalStage&&<div><dt>{t.morphology}</dt><dd>{selected.morphologicalStage}</dd></div>}{selected.dynasticClassification?.length&&<div><dt>{t.dynasties}</dt><dd>{labelList(selected.dynasticClassification)}</dd></div>}{selected.evidenceMedium?.length&&<div><dt>{t.medium}</dt><dd>{labelList(selected.evidenceMedium)}</dd></div>}{selected.visualTraits?.length&&<div><dt>{t.traits}</dt><dd>{labelList(selected.visualTraits)}</dd></div>}{selected.morphologyNote&&<div><dt>{t.note}</dt><dd>{text(selected.morphologyNote,locale)}</dd></div>}</dl></section><ScriptMap record={selected} locale={locale} t={t}/>{specimensFor(selected).length>0&&<section className="script-specimens" aria-label={t.specimens}><div className="script-specimens-head"><h4>{t.specimens}</h4><a href="https://fonts.sanchaya.net/kingdom-showcase" target="_blank" rel="noreferrer">{t.specimenLink} ↗</a></div><p>{t.specimenNote}</p><div className="script-specimen-grid">{specimensFor(selected).map(font=><article key={font.family} className="script-specimen"><small>{text(font.note,locale)}</small><span className="script-specimen-word" lang="kn" style={{fontFamily:`"${font.family}",serif`}}>{text(font.name,'kn')}</span><span className="script-specimen-line" lang="kn" style={{fontFamily:`"${font.family}",serif`}}>ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ</span><b>{text(font.name,locale)}{font.credit?` · ${font.credit}`:''}</b></article>)}</div></section>}<div className="script-link-grid"><section><h4>{t.samples}</h4>{selected.sampleInscriptions.length?selected.sampleInscriptions.map(item=><a key={item.id} href="#epigraphy"><strong>{text(item.name,locale)}</strong><span>{item.languages?.join(', ')} · {item.scripts?.join(', ')}</span></a>):<p>{t.samplePending}</p>}</section><section><h4>{t.polities}</h4>{selected.relatedPolities.map(item=><article key={item.id}><strong>{text(item.name,locale)}</strong><span>{other(item.name,locale)}</span></article>)}</section><section><h4>{t.predecessors}</h4>{selected.predecessors.length?selected.predecessors.map(item=><button key={item.id} onClick={()=>setSelectedId(item.id)}>{text(item.name,locale)}</button>):<p>{locale==='kn'?'ಆರಂಭಿಕ ಹಂತ':'Initial phase'}</p>}</section><section><h4>{t.sources}</h4>{selected.citations.map(item=><p key={item.sourceId}><a href={item.source.url||'#research'} target={item.source.url?'_blank':undefined} rel="noreferrer">{text(item.source.title,locale)}</a><span>{item.locator}</span></p>)}</section></div><div className="script-evidence-strip"><span>{t.evidence}</span>{[selected.sampleInscriptions.length>0,selected.relatedPolities.length>0,selected.citations.length>0,completeStatuses.has(selected.review?.status)].map((complete,index)=><i key={index} className={complete?'complete':'open'}></i>)}<b>{selected.review?.status==='needs-review'?t.needsReview:selected.review?.status}</b></div><div className="script-actions"><a href="#evidence">{t.openEvidence}</a><a href="#epigraphy">{t.openEpigraphy}</a></div><code>{selected.id}</code></>:<p>{t.noResults}</p>}</section></section></main>
}
