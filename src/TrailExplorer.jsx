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

function recordName(record,locale){
  return text(record?.name||record?.title,locale)||record?.id
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
      {citations.length>0&&<section className="trail-stop-sources"><strong>{locale==='kn'?'ಆಕರಗಳು':'Sources'}</strong>{citations.map((citation,index)=>{const source=sourceById.get(citation.sourceId);return <span className="explorer-citation" key={`${citation.sourceId}-${index}`}>{source?.url?<a href={source.url} target="_blank" rel="noreferrer">{text(source.title,locale)||citation.sourceId} ↗</a>:<strong>{text(source?.title,locale)||citation.sourceId}</strong>}<ProvenanceBadge tier={sourceTiers.get(citation.sourceId)} locale={locale} short/>{citation.locator&&<small>{citation.locator}</small>}</span>})}</section>}
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