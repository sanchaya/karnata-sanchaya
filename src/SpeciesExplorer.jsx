import { useMemo, useState } from 'react'
import data from './data/species/karnataka-species.json'
import reviewed from './data/species/kn-names-reviewed.json'
import nameLists from './data/species/kn-name-sources.json'
import { applyNameSources, applyReviewedNames, filterSpecies } from './species-normalize'
import './species.css'

const species=applyReviewedNames(applyNameSources(data.species,nameLists.sources),reviewed)
const PAGE=48
const SEASON={
  resident:['Resident','ವರ್ಷವಿಡೀ ಇರುವ'],
  'winter-visitor':['Winter visitor','ಚಳಿಗಾಲದ ವಲಸೆ ಹಕ್ಕಿ'],
  'summer-visitor':['Summer / monsoon visitor','ಬೇಸಿಗೆ / ಮಳೆಗಾಲದ ಅತಿಥಿ'],
  'passage-or-local-movement':['Passage or local movement','ಹಾದುಹೋಗುವ / ಸ್ಥಳೀಯ ಚಲನೆ'],
}
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_KN=['ಜ','ಫೆ','ಮಾ','ಏ','ಮೇ','ಜೂ','ಜು','ಆ','ಸೆ','ಅ','ನ','ದ']
const suggestUrl=(item,kn)=>`?${new URLSearchParams({contributeTarget:item.id,contributeType:'species',contributeName:`${item.scientificName} · ${item.name.en||''}`,contributeAction:'correction'})}#contribute`

export default function SpeciesExplorer({locale}){
  const kn=locale==='kn'
  const [group,setGroup]=useState('bird'),[query,setQuery]=useState(''),[season,setSeason]=useState(''),[needs,setNeeds]=useState(false),[shown,setShown]=useState(PAGE)
  const list=useMemo(()=>filterSpecies(species,{group,query,seasonality:group==='bird'?season:'',needsKannada:needs}),[group,query,season,needs])
  const withKn=species.filter(s=>s.name.kn).length
  const reset=fn=>value=>{fn(value);setShown(PAGE)}
  return <main className="species-page portal-page" id="species">
    <header className="species-hero"><p className="eyebrow">{kn?'ಪಕ್ಷಿ · ಪ್ರಾಣಿ · ಸಸ್ಯ':'Birds · animals · plants'}</p><h2>{kn?'ಕರ್ನಾಟಕದ ಜೀವವೈವಿಧ್ಯ':'Karnataka’s wildlife and plants'}</h2>
      <p>{kn?`ಮುಕ್ತ ದತ್ತಾಂಶದಿಂದ (GBIF, ಇಬರ್ಡ್, ವಿಕಿಡೇಟಾ) ಸಂಗ್ರಹಿಸಿದ ${species.length.toLocaleString('en-IN')} ಪ್ರಭೇದಗಳು. ${withKn.toLocaleString('en-IN')} ಕ್ಕೆ ಕನ್ನಡ ಹೆಸರಿನ ಸಲಹೆ ಇದೆ; ಅವು ಇನ್ನೂ ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ. ತಪ್ಪಿದ್ದರೆ ಅಥವಾ ಹೆಸರಿಲ್ಲದಿದ್ದರೆ ನೀವೇ ಸೂಚಿಸಿ.`:`${species.length.toLocaleString('en-IN')} species gathered from open data (GBIF, eBird, Wikidata). ${withKn.toLocaleString('en-IN')} have a Kannada name suggestion, all still awaiting review. Fix a wrong name or add a missing one.`}</p></header>
    <div className="species-groups" role="group" aria-label={kn?'ಗುಂಪು':'Group'}>{data.groups.map(g=><button type="button" key={g.id} className={group===g.id?'active':''} aria-pressed={group===g.id} onClick={()=>{setGroup(g.id);setSeason('');setShown(PAGE)}}>{kn?g.kn:g.en} <small>{data.counts[g.id]?.toLocaleString('en-IN')}</small></button>)}</div>
    <div className="species-tools">
      <input type="search" value={query} onChange={event=>reset(setQuery)(event.target.value)} placeholder={kn?'ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ವೈಜ್ಞಾನಿಕ ಹೆಸರು ಹುಡುಕಿ':'Search Kannada, English or scientific name'} aria-label={kn?'ಹುಡುಕಿ':'Search'}/>
      {group==='bird'&&<select value={season} onChange={event=>reset(setSeason)(event.target.value)} aria-label={kn?'ಋತು':'Season'}><option value="">{kn?'ಎಲ್ಲ ಹಕ್ಕಿಗಳು':'All birds'}</option><option value="migratory">{kn?'ವಲಸೆ ಹಕ್ಕಿಗಳು':'Migratory birds'}</option>{Object.entries(SEASON).map(([id,label])=><option key={id} value={id}>{label[kn?1:0]}</option>)}</select>}
      <label className="species-check"><input type="checkbox" checked={needs} onChange={event=>reset(setNeeds)(event.target.checked)}/> {kn?'ಕನ್ನಡ ಹೆಸರು ಬೇಕಾದವು':'Needs a Kannada name'}</label>
    </div>
    <p className="species-count" aria-live="polite">{list.length.toLocaleString('en-IN')} {kn?'ಪ್ರಭೇದಗಳು':'species'}</p>
    <ul className="species-grid">{list.slice(0,shown).map(item=><li key={item.id} className="species-card">
      <h3 lang="kn">{item.name.kn||<span className="species-missing">{kn?'ಕನ್ನಡ ಹೆಸರು ಬೇಕು':'Kannada name needed'}</span>}{item.knScope==='group'&&!item.knReviewed&&<small className="species-group-name">{kn?' · ಗುಂಪಿನ ಹೆಸರು':' · group name'}</small>}</h3>
      <p className="species-en">{item.name.en||'—'}</p><p className="species-sci"><i>{item.scientificName}</i>{item.family&&<> · {item.family}</>}</p>
      {item.seasonality&&item.seasonality.pattern!=='unknown'&&<div className={`species-season ${item.seasonality.pattern}`} title={kn?'eBird ತಿಂಗಳ ದಾಖಲೆಗಳಿಂದ ಊಹಿಸಿದ್ದು; ಅಧಿಕೃತವಲ್ಲ':'Inferred from eBird month counts; not authoritative'}><b>{SEASON[item.seasonality.pattern][kn?1:0]}</b><span aria-hidden="true">{MONTHS.map((m,i)=><i key={m} className={item.seasonality.months.includes(i+1)?'on':''}>{(kn?MONTHS_KN:MONTHS)[i]}</i>)}</span></div>}
      {item.knCandidates?.length>1&&!item.knReviewed&&<p className="species-other">{kn?'ಇತರ ಸಲಹೆಗಳು':'Also suggested'}: {item.knCandidates.filter(c=>c.value!==item.name.kn).map(c=>c.value).join(', ')}</p>}
      <p className="species-status">{item.knReviewed?(kn?'ಕನ್ನಡ ಹೆಸರು ಪರಿಶೀಲಿತ':'Kannada name reviewed'):item.name.kn?(kn?`ಕನ್ನಡ ಹೆಸರು ಪರಿಶೀಲನೆ ಬಾಕಿ · ${item.knCandidates[0]?.sources.join(' + ')}`:`Kannada name awaiting review · ${item.knCandidates[0]?.sources.join(' + ')}`):''}</p>
      <p className="species-links"><a href={suggestUrl(item,kn)}>{item.name.kn?(kn?'ಹೆಸರು ತಿದ್ದಿ':'Correct the name'):(kn?'ಕನ್ನಡ ಹೆಸರು ಸೂಚಿಸಿ':'Suggest a Kannada name')} →</a><a href={`https://www.gbif.org/species/${item.gbifKey}`} target="_blank" rel="noreferrer">GBIF ↗</a>{item.wikidataId&&<a href={`https://www.wikidata.org/wiki/${item.wikidataId}`} target="_blank" rel="noreferrer">Wikidata ↗</a>}</p>
    </li>)}</ul>
    {list.length>shown&&<button type="button" className="species-more" onClick={()=>setShown(n=>n+PAGE)}>{kn?'ಇನ್ನಷ್ಟು ತೋರಿಸಿ':'Show more'}</button>}
    <p className="species-note">{kn?'ಪ್ರಭೇದಗಳ ಪಟ್ಟಿ ಕರ್ನಾಟಕದಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ದಾಖಲಾದವು (ಸಂಪೂರ್ಣ ಪಟ್ಟಿಯಲ್ಲ). ವಲಸೆ ವಿವರ ಇಬರ್ಡ್ ತಿಂಗಳ ದಾಖಲೆಗಳಿಂದ ಊಹಿಸಲಾಗಿದೆ; ಪಕ್ಷಿ ತಜ್ಞರ ಪರಿಶೀಲನೆ ಬೇಕು.':'The list holds the most-recorded species in Karnataka, not a complete checklist. Migration patterns are inferred from eBird month counts and need an ornithologist’s review.'} {data.sources.map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.id==='gbif'?'GBIF':'Wikidata'} ↗</a>)}</p>
  </main>
}
