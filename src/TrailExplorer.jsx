import { useState } from 'react'
import { atlasData } from './data/atlas'
import { trails } from './data/trails'
import { buildSourceTiers, recordAuthorityCited } from './data/source-provenance'
import ProvenanceBadge from './ProvenanceBadge'

const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const sourceById=new Map(atlasData.sources.map(record=>[record.id,record]))
const sourceTiers=buildSourceTiers(atlasData)
const recordByCollection=new Map()
for(const [key,records] of Object.entries(atlasData))if(Array.isArray(records))recordByCollection.set(key,new Map(records.map(record=>[record.id,record])))
const DEEP_LINKS={
  events:'#atlas',places:'#atlas',people:'#people',works:'#literature',inscriptions:'#epigraphy',
  culturalHeritage:'#districts',districtHistoryResearch:'#district-history',relationships:'#relations',politicalRelations:'#relations',
}
const ERA_LABELS={classical:{kn:'ಪ್ರಾಚೀನ ಯುಗ',en:'Classical era'},medieval:{kn:'ಮಧ್ಯಯುಗ',en:'Medieval era'},modern:{kn:'ಆಧುನಿಕ ಯುಗ',en:'Modern era'}}
const dateLabel=(date,locale)=>{
  if(!date)return ''
  if(!date.from&&!date.to)return ''
  if(date.precision==='unknown')return ''
  const era=date.era==='BCE'?(locale==='kn'?'ಕ್ರಿ.ಪೂ.':'BCE'):date.era==='CE'?(locale==='kn'?'ಕ್ರಿ.ಶ.':'CE'):''
  const circa=locale==='kn'?'ಸು. ':'c. '
  return `${(date.precision==='circa'&&date.from)?circa:''}${date.from}${date.to&&date.to!==date.from?`–${date.to}`:''} ${era}`.trim()
}

const REVIEW_STATUS_LABELS={reviewed:{kn:'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',en:'Reviewed'},published:{kn:'ಪ್ರಕಟಿತ',en:'Published'},'needs-review':{kn:'ಪರಿಶೀಲನೆ ಬಾಕಿ',en:'Needs review'},draft:{kn:'ಕರಡು',en:'Draft'}}
const DATE_PRECISION_LABELS={year:{kn:'ನಿರ್ದಿಷ್ಟ ವರ್ಷ',en:'Specific year'},circa:{kn:'ಸುಮಾರು',en:'Circa'},range:{kn:'ಕಾಲಶ್ರೇಣಿ',en:'Date range'},century:{kn:'ಶತಮಾನ',en:'Century'},unknown:{kn:'ಸ್ಥಾಪಿಸಲಾಗಿಲ್ಲ',en:'Not established'}}
const LOCATION_PRECISION_LABELS={approximate:{kn:'ಸ್ಥೂಲ',en:'Approximate'},schematic:{kn:'ಯೋಜನಾತ್ಮಕ',en:'Schematic'},site:{kn:'ನಿರ್ದಿಷ್ಟ ಸ್ಥಳ',en:'Specific site'},'site-context':{kn:'ಸ್ಥಳ ಸಂದರ್ಭ',en:'Site context'},'district-centroid':{kn:'ಜಿಲ್ಲಾ ಕೇಂದ್ರಬಿಂದು',en:'District centroid'},'district-centre':{kn:'ಜಿಲ್ಲಾ ಕೇಂದ್ರ',en:'District centre'},'publication-place-anchor':{kn:'ಪ್ರಕಟಣಾ-ಸ್ಥಳ ಆಧಾರ',en:'Publication-place anchor'}}

const clean=value=>String(value||'').replace(/[{}]/g,'').trim()
const citationKey=source=>clean(source.id).replace(/^src-/,'').replace(/[^a-z0-9]+/gi,'_')
const sourceBibtex=source=>`@misc{${citationKey(source)},\n  author = {${clean((source.authors||[]).join(' and '))}},\n  title = {${clean(source.title.en)}},${source.year?`\n  year = {${source.year}},`:''}${source.publisher?`\n  publisher = {${clean(source.publisher)}},`:''}${source.doi?`\n  doi = {${clean(source.doi)}},`:''}${source.url?`\n  url = {${source.url}},`:''}\n  note = {Karnataka Historical Atlas source ID: ${source.id}}\n}`
const sourceRis=source=>['TY  - GEN',...(source.authors||[]).map(author=>`AU  - ${author}`),`TI  - ${source.title.en}`,source.year?`PY  - ${source.year}`:null,source.publisher?`PB  - ${source.publisher}`:null,source.doi?`DO  - ${source.doi}`:null,source.url?`UR  - ${source.url}`:null,`N1  - Karnataka Historical Atlas source ID: ${source.id}`,'ER  -'].filter(Boolean).join('\n')
const sourceCsl=source=>({id:source.id,type:source.type?.includes('volume')||source.type==='book'?'book':'document',title:source.title.en,author:(source.authors||[]).map(literal=>({literal})),publisher:source.publisher||undefined,issued:source.year?{'date-parts':[[source.year]]}:undefined,URL:source.url||undefined,note:`Karnataka Historical Atlas source ID: ${source.id}`})
const downloadText=(value,filename,type='text/plain')=>{const url=URL.createObjectURL(new Blob([value],{type}));const link=document.createElement('a');link.href=url;link.download=filename;link.click();URL.revokeObjectURL(url)}
const citationEligible=source=>!source.provenanceRole||source.provenanceRole!=='discovery-only'
const trailSources=trail=>{const byId=new Map();for(const stop of trail.stops){const record=recordByCollection.get(stop.kind)?.get(stop.recordId);for(const citation of record?.citations||[]){if(!byId.has(citation.sourceId)&&sourceById.has(citation.sourceId))byId.set(citation.sourceId,sourceById.get(citation.sourceId))}}return [...byId.values()]}
const exportTrail=(trail,format)=>{const eligible=trailSources(trail).filter(citationEligible);const value=format==='csl'?JSON.stringify(eligible.map(sourceCsl),null,2):eligible.map(source=>format==='bib'?sourceBibtex(source):sourceRis(source)).join('\n\n');return downloadText(value,`karnataka-trail-${trail.slug}.${format==='csl'?'json':format}`,format==='csl'?'application/json':'text/plain')}

function recordName(record,locale){
  return text(record?.name||record?.title,locale)||record?.id
}

function EvidenceLedger({record,locale}){
  const ledgerT={
    title:locale==='kn'?'ಸಾಕ್ಷ್ಯ ದಾಖಲೆ':'Evidence ledger',
    review:locale==='kn'?'ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ':'Review status',
    date:locale==='kn'?'ದಿನಾಂಕದ ನಿಖರತೆ':'Date precision',
    location:locale==='kn'?'ಸ್ಥಳದ ನಿಖರತೆ':'Location precision',
    blocking:locale==='kn'?'ಪರಿಶೀಲನೆ ಬಾಕಿ ಉಳಿದಿರುವ ಸಾಕ್ಷ್ಯ':'Evidence awaiting review',
    sources:locale==='kn'?'ಸಂಪೂರ್ಣ ಆಕರ ಪಟ್ಟಿ':'Full source list',
    locator:locale==='kn'?'ಮುದ್ರಿತ ಸ್ಥಾನಸೂಚಿ':'Printed locator',
  }
  if(!record)return null
  const reviewStatus=record.review?.status
  const datePrecision=record.date?.precision
  const locationPrecision=record.location?.precision||record.coordinates?.precision
  const blocking=(record.reviewWorkflow?.blockingEvidence||[]).map(field=>({field,note:record.reviewWorkflow?.evidence?.[field]?.note}))
  const citations=record.citations||[]
  return <details className="trail-ledger">
    <summary><span className="trail-ledger-title">{ledgerT.title}</span></summary>
    <dl className="trail-ledger-grid">
      {reviewStatus&&<div><dt>{ledgerT.review}</dt><dd><span className={`trail-ledger-badge ${reviewStatus}`}>{REVIEW_STATUS_LABELS[reviewStatus]?text(REVIEW_STATUS_LABELS[reviewStatus],locale):reviewStatus}</span></dd></div>}
      {datePrecision&&<div><dt>{ledgerT.date}</dt><dd>{DATE_PRECISION_LABELS[datePrecision]?text(DATE_PRECISION_LABELS[datePrecision],locale):datePrecision}</dd></div>}
      {locationPrecision&&<div><dt>{ledgerT.location}</dt><dd>{LOCATION_PRECISION_LABELS[locationPrecision]?text(LOCATION_PRECISION_LABELS[locationPrecision],locale):locationPrecision}</dd></div>}
    </dl>
    {blocking.length>0&&<section className="trail-ledger-blocking"><strong>{ledgerT.blocking}</strong>{blocking.map(item=><p key={item.field}>{item.note?text(item.note,locale):item.field.replace(/[A-Z]/g,' $&').toLowerCase()}</p>)}</section>}
    <section className="trail-ledger-sources"><strong>{ledgerT.sources}</strong>{citations.map((citation,index)=>{const source=sourceById.get(citation.sourceId);return <span className="explorer-citation" key={`${citation.sourceId}-${index}`}>{source?.url?<a href={source.url} target="_blank" rel="noreferrer">{text(source.title,locale)||citation.sourceId} ↗</a>:<strong>{text(source?.title,locale)||citation.sourceId}</strong>}<ProvenanceBadge tier={sourceTiers.get(citation.sourceId)} locale={locale} short/>{citation.locator&&<code className="trail-locator">{citation.locator}</code>}</span>})}</section>
  </details>
}

function StopEvidence({stop,locale}){
  const record=recordByCollection.get(stop.kind)?.get(stop.recordId)
  const deepLink=DEEP_LINKS[stop.kind]
  const citations=(record?.citations||[]).slice(0,3)
  const authorityCited=recordAuthorityCited(record,sourceTiers)
  return <article className="trail-stop-evidence">
    {authorityCited&&<ProvenanceBadge tier="authority" locale={locale} short/>}
    <div>
      <h4>{recordName(record,locale)}</h4>
      {record?.date&&<small>{dateLabel(record.date,locale)}</small>}
      <p>{text(record?.summary||record?.description,locale)||''}</p>
      {citations.length>0&&<section className="trail-stop-sources"><strong>{locale==='kn'?'ಆಕರಗಳು':'Sources'}</strong>{citations.map((citation,index)=>{const source=sourceById.get(citation.sourceId);return <span className="explorer-citation" key={`${citation.sourceId}-${index}`}>{source?.url?<a href={source.url} target="_blank" rel="noreferrer">{text(source.title,locale)||citation.sourceId} ↗</a>:<strong>{text(source?.title,locale)||citation.sourceId}</strong>}<ProvenanceBadge tier={sourceTiers.get(citation.sourceId)} locale={locale} short/>{citation.locator&&<code className="trail-locator">{citation.locator}</code>}</span>})}</section>}
      <EvidenceLedger record={record} locale={locale}/>
      {deepLink&&<a className="trail-deep-link" href={deepLink}>{locale==='kn'?'ಅನ್ವೇಷಣೆಯಲ್ಲಿ ಮುಂದುವರಿಸಿ':'Open in explorer'} ↗</a>}
    </div>
  </article>
}

export default function TrailExplorer({locale='kn'}){
  const [selectedId,setSelectedId]=useState(null)
  const [stopIndex,setStopIndex]=useState(0)
  const selected=trails.find(trail=>trail.id===selectedId)||null
  const t={
    trailList:locale==='kn'?'ಕಥಾಮಾರ್ಗಗಳು':'Guided trails',
    trailIntro:locale==='kn'?'ಕರ್ನಾಟಕದ ಇತಿಹಾಸವನ್ನು ಹಂತ ಹಂತವಾಗಿ ರೂಪಿಸುವ ನಿರೂಪಣೆ — ಪ್ರತಿ ಹಂತದ ಹಿಂದೆ ಪರಿಶೀಲಿತ ದತ್ತಾಂಶ.':'Curation-backed narratives that walk Karnataka\'s history step by step — every stop rooted in the evidence ledger.',
    stop:locale==='kn'?'ಹಂತ':'Stop',
    of:locale==='kn'?'ನಲ್ಲಿ':'of',
    back:locale==='kn'?'ಎಲ್ಲ ಕಥಾಮಾರ್ಗಗಳು':'All trails',
    previous:locale==='kn'?'ಹಿಂದಿನ ಹಂತ':'Previous',
    next:locale==='kn'?'ಮುಂದಿನ ಹಂತ':'Next',
    complete:locale==='kn'?'ಪೂರ್ಣ':'Complete',
    selectTrail:locale==='kn'?'ಒಂದು ಕಥಾಮಾರ್ಗವನ್ನು ಆರಿಸಿ':'Choose a trail',
    citeTrail:locale==='kn'?'ಕಥಾಮಾರ್ಗ ಆಕರಗಳನ್ನು ರಫ್ತು ಮಾಡಿ':'Export trail sources',
    exportBibtex:locale==='kn'?'BibTeX':'BibTeX',
    exportRis:locale==='kn'?'RIS':'RIS',
    exportCsl:locale==='kn'?'CSL-JSON':'CSL-JSON',
  }
  if(selected){
    const stop=selected.stops[stopIndex]
    const record=recordByCollection.get(stop.kind)?.get(stop.recordId)
    const step=stopIndex+1
    return <main className="portal-page trail-page" id="trails">
      <section className="about-hero"><p className="eyebrow">{t.trailList}</p><h2>{text(selected.title,locale)}</h2><p className="entity-secondary">{selected.title[locale==='kn'?'en':'kn']}</p><p>{text(selected.summary,locale)}</p></section>
      <button className="trail-back" onClick={()=>setSelectedId(null)}>← {t.back}</button>
      <nav className="trail-progress" aria-label={locale==='kn'?'ಪ್ರಗತಿ':'Progress'}>
        {selected.stops.map((item,step)=>(
          <button key={`${item.kind}-${item.recordId}`} className={`${step===stopIndex?'active':''}${step<stopIndex?'done':''}`} aria-label={`${locale==='kn'?'ಹಂತ':'Step'} ${step+1}`} onClick={()=>setStopIndex(step)}>
            <span>{step+1}</span>
          </button>
        ))}
        <b>{t.stop} {step} {t.of} {selected.stops.length}</b>
      </nav>
      <section className="trail-narrative">
        <div className="trail-narrative-head"><span className="trail-era">{text(ERA_LABELS[selected.era],locale)} · {dateLabel(selected.yearRange)}</span><h3>{recordName(record,locale)}</h3></div>
        <p>{text(stop.narrative,locale)}</p>
        <StopEvidence stop={stop} locale={locale}/>
        <div className="trail-cite-actions"><span>{t.citeTrail}</span><button className="trail-step-button" onClick={()=>exportTrail(selected,'bib')}>{t.exportBibtex}</button><button className="trail-step-button" onClick={()=>exportTrail(selected,'ris')}>{t.exportRis}</button><button className="trail-step-button" onClick={()=>exportTrail(selected,'csl')}>{t.exportCsl}</button></div>
        <div className="trail-step-actions">
          <button className="trail-step-button" disabled={stopIndex===0} onClick={()=>setStopIndex(stopIndex-1)}>{t.previous}</button>
          {stopIndex<selected.stops.length-1?<button className="trail-step-button primary" onClick={()=>setStopIndex(stopIndex+1)}>{t.next}</button>:<span className="trail-complete">{t.complete} ✓</span>}
        </div>
      </section>
    </main>
  }
  return <main className="portal-page trail-page" id="trails">
    <section className="about-hero"><p className="eyebrow">{t.trailList}</p><h2>{locale==='kn'?'ಕಥೆಯ ರೂಪದಲ್ಲಿ ಕರ್ನಾಟಕ':'Karnataka as story'}</h2><p>{t.trailIntro}</p></section>
    <section className="trail-grid">
      {trails.map(trail=>{
        const collections=new Set(trail.stops.map(stop=>stop.kind))
        return           <button key={trail.id} className="trail-card" onClick={()=>{setStopIndex(0);setSelectedId(trail.id)}}>
          <span className="trail-era">{text(ERA_LABELS[trail.era],locale)} · {dateLabel(trail.yearRange)}</span>
          <h3>{text(trail.title,locale)}</h3>
          <p className="entity-secondary">{trail.title[locale==='kn'?'en':'kn']}</p>
          <p>{text(trail.summary,locale)}</p>
          <small>{locale==='kn'?`${trail.stops.length} ಹಂತಗಳು · ${collections.size} ದತ್ತಾಂಶ ವಿಭಾಗಗಳು`:`${trail.stops.length} stops · ${collections.size} collections`}</small>
        </button>
      })}
    </section>
  </main>
}