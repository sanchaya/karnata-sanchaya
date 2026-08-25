import { useEffect, useMemo, useState } from 'react'
import { atlasData } from './data/atlas'

const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const other=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const entityById=new Map([...atlasData.polities,...atlasData.externalPolities].map(record=>[record.id,record]))
const inscriptionById=new Map(atlasData.inscriptions.map(record=>[record.id,record]))
const sourceById=new Map(atlasData.sources.map(record=>[record.id,record]))
const completeStatuses=new Set(['verified','located','not-applicable'])
const dateLabel=(date,locale)=>`${date.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${date.from}${date.to!==date.from?`-${date.to}`:''} ${date.era}`
const labelList=value=>Array.isArray(value)?value.join(', '):value||''
const copy={
  kn:{eyebrow:'P2 · ಲಿಪಿ ಪರಿವರ್ತನೆ',title:'ಕನ್ನಡ ಲಿಪಿ ವಿಕಾಸ ಕಾಲರೇಖೆ',intro:'ಶಾಸನ ಮಾದರಿ, ರಾಜಕೀಯ ಸಂಬಂಧ ಮತ್ತು ಮುದ್ರಣ ಸಂಸ್ಕೃತಿಯ ಮೂಲಕ ಲಿಪಿಯ ಹಂತಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ಇವು ಅಧ್ಯಯನ ಬಿಂದುಗಳು; ಸಂಪೂರ್ಣ ಲಿಪಿಶಾಸ್ತ್ರ ಸಾಕ್ಷ್ಯ ಇನ್ನೂ ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ.',search:'ಲಿಪಿ, ಶಾಸನ, ರಾಜ್ಯ ಅಥವಾ ಆಕರ ಹುಡುಕಿ',all:'ಎಲ್ಲ',family:'ಲಿಪಿ ಕುಟುಂಬ',phase:'ಹಂತ',samples:'ಮಾದರಿ ಶಾಸನಗಳು',predecessors:'ಹಿಂದಿನ ಹಂತಗಳು',polities:'ಸಂಬಂಧಿತ ರಾಜ್ಯಗಳು',sources:'ಆಕರಗಳು',evidence:'ಸಾಕ್ಷ್ಯ ಸ್ಥಿತಿ',openEvidence:'ಸಾಕ್ಷ್ಯ ಕಾರ್ಯಕ್ಕೆ ತೆರಳಿ',openEpigraphy:'ಶಾಸನ ಅನ್ವೇಷಣೆ ತೆರೆಯಿರಿ',needsReview:'ಪರಿಶೀಲನೆ ಬಾಕಿ',noResults:'ಈ ಶೋಧಕಗಳಿಗೆ ಲಿಪಿ ದಾಖಲೆಗಳಿಲ್ಲ.',samplePending:'ಮಾದರಿ ಬಾಕಿ',timeline:'ಲಿಪಿ ಕಾಲರೇಖೆ',classification:'ಲಿಪಿಶಾಸ್ತ್ರ ವರ್ಗೀಕರಣ',morphology:'ಆಕಾರಶಾಸ್ತ್ರ ಹಂತ',dynasties:'ವಂಶ ಹಂತಗಳು',medium:'ಸಾಕ್ಷ್ಯ ಮಾಧ್ಯಮ',traits:'ದೃಶ್ಯ ಲಕ್ಷಣಗಳು',note:'ಆಕಾರ ಟಿಪ್ಪಣಿ'},
  en:{eyebrow:'P2 · Script evolution',title:'Kannada Script Evolution Timeline',intro:'Explore script phases through inscription samples, polity context and print culture. These are study nodes, not complete palaeographic proof packets.',search:'Search script, inscription, polity or source',all:'All',family:'Script family',phase:'Phase',samples:'Sample inscriptions',predecessors:'Predecessor phases',polities:'Related polities',sources:'Sources',evidence:'Evidence state',openEvidence:'Open evidence workflow',openEpigraphy:'Open Epigraphy Explorer',needsReview:'Needs review',noResults:'No script records match these filters.',samplePending:'Sample pending',timeline:'Script timeline',classification:'Palaeographic classification',morphology:'Morphological stage',dynasties:'Dynastic stages',medium:'Evidence medium',traits:'Visual traits',note:'Morphology note'},
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
  return <main className="script-page portal-page" id="scripts"><section className="script-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div><div className="script-stats"><span><b>{scriptRecords.length}</b>{t.phase}</span><span><b>{scriptRecords.reduce((sum,item)=>sum+item.sampleInscriptions.length,0)}</b>{t.samples}</span><span><b>{unresolvedSamples}</b>{t.samplePending}</span></div></section><section className="script-workspace"><aside className="script-sidebar"><label><span>{t.search}</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.search}/></label><label><span>{t.family}</span><select value={family} onChange={event=>setFamily(event.target.value)}><option value="all">{t.all}</option>{families.map(value=><option key={value}>{value}</option>)}</select></label><div className="script-timeline" aria-label={t.timeline}>{filtered.map(item=><button key={item.id} className={selected?.id===item.id?'active':''} onClick={()=>setSelectedId(item.id)}><i style={{height:`${Math.max(18,item.evidenceScore*13)}px`}}></i><span>{dateLabel(item.date,locale)}</span><strong>{text(item.name,locale)}</strong><small>{item.morphologicalStage||item.scriptFamily} · {item.review?.status||'needs-review'}</small></button>)}{!filtered.length&&<p>{t.noResults}</p>}</div></aside><section className="script-detail">{selected?<><div className="script-detail-head"><div><small>{dateLabel(selected.date,locale)} · {selected.scriptFamily}</small><h3>{text(selected.name,locale)}</h3>{other(selected.name,locale)&&<p className="entity-secondary">{other(selected.name,locale)}</p>}</div><meter min="0" max={selected.totalEvidence} value={selected.evidenceScore}></meter></div><p>{text(selected.description,locale)}</p><section className="script-classification"><h4>{t.classification}</h4><dl>{selected.morphologicalStage&&<div><dt>{t.morphology}</dt><dd>{selected.morphologicalStage}</dd></div>}{selected.dynasticClassification?.length&&<div><dt>{t.dynasties}</dt><dd>{labelList(selected.dynasticClassification)}</dd></div>}{selected.evidenceMedium?.length&&<div><dt>{t.medium}</dt><dd>{labelList(selected.evidenceMedium)}</dd></div>}{selected.visualTraits?.length&&<div><dt>{t.traits}</dt><dd>{labelList(selected.visualTraits)}</dd></div>}{selected.morphologyNote&&<div><dt>{t.note}</dt><dd>{text(selected.morphologyNote,locale)}</dd></div>}</dl></section><div className="script-link-grid"><section><h4>{t.samples}</h4>{selected.sampleInscriptions.length?selected.sampleInscriptions.map(item=><a key={item.id} href="#epigraphy"><strong>{text(item.name,locale)}</strong><span>{item.languages?.join(', ')} · {item.scripts?.join(', ')}</span></a>):<p>{t.samplePending}</p>}</section><section><h4>{t.polities}</h4>{selected.relatedPolities.map(item=><article key={item.id}><strong>{text(item.name,locale)}</strong><span>{other(item.name,locale)}</span></article>)}</section><section><h4>{t.predecessors}</h4>{selected.predecessors.length?selected.predecessors.map(item=><button key={item.id} onClick={()=>setSelectedId(item.id)}>{text(item.name,locale)}</button>):<p>{locale==='kn'?'ಆರಂಭಿಕ ಹಂತ':'Initial phase'}</p>}</section><section><h4>{t.sources}</h4>{selected.citations.map(item=><p key={item.sourceId}><a href={item.source.url||'#research'} target={item.source.url?'_blank':undefined} rel="noreferrer">{text(item.source.title,locale)}</a><span>{item.locator}</span></p>)}</section></div><div className="script-evidence-strip"><span>{t.evidence}</span>{[selected.sampleInscriptions.length>0,selected.relatedPolities.length>0,selected.citations.length>0,completeStatuses.has(selected.review?.status)].map((complete,index)=><i key={index} className={complete?'complete':'open'}></i>)}<b>{selected.review?.status==='needs-review'?t.needsReview:selected.review?.status}</b></div><div className="script-actions"><a href="#evidence">{t.openEvidence}</a><a href="#epigraphy">{t.openEpigraphy}</a></div><code>{selected.id}</code></>:<p>{t.noResults}</p>}</section></section></main>
}
