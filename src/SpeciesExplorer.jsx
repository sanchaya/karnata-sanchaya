import { useEffect, useMemo, useState } from 'react'
import { COUNTS, CULTURE, FLYWAYS, GROUPS, IMAGES as images, SOURCES, SPECIES as BASE } from './species-data'
import MigrationGlobe, { countryName } from './MigrationGlobe'
import { aggregateRoutes } from './globe'
import { applyReviewedNames, filterSpecies, migratoryByMonth, namingDrive } from './species-normalize'
import SpeciesDetail from './SpeciesDetail'
import './species.css'

const PAGE=48
const SEASON={
  resident:['Resident','ವರ್ಷವಿಡೀ ಇರುವ'],
  'winter-visitor':['Winter visitor','ಚಳಿಗಾಲದ ವಲಸೆ ಹಕ್ಕಿ'],
  'summer-visitor':['Summer / monsoon visitor','ಬೇಸಿಗೆ / ಮಳೆಗಾಲದ ಅತಿಥಿ'],
  'passage-or-local-movement':['Passage or local movement','ಹಾದುಹೋಗುವ / ಸ್ಥಳೀಯ ಚಲನೆ'],
}
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_KN=['ಜ','ಫೆ','ಮಾ','ಏ','ಮೇ','ಜೂ','ಜು','ಆ','ಸೆ','ಅ','ನ','ದ']
const today=()=>new Date().toISOString().slice(0,10)
const migrants=migratoryByMonth(BASE)
const setParam=(key,value)=>{try{const url=new URL(window.location.href);if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);window.history.replaceState(null,'',url)}catch{}}

export default function SpeciesExplorer({locale}){
  const kn=locale==='kn'
  const [group,setGroup]=useState('bird'),[query,setQuery]=useState(''),[season,setSeason]=useState(''),[needs,setNeeds]=useState(false),[shown,setShown]=useState(PAGE)
  const [month,setMonth]=useState(0),[family,setFamily]=useState(''),[drive,setDrive]=useState(null),[origin,setOrigin]=useState(0)
  const [openId,setOpenId]=useState(()=>{try{return new URLSearchParams(window.location.search).get('species')||''}catch{return ''}})
  const [community,setCommunity]=useState(null)
  // Names approved by reviewers on the live portal (MariaDB) replace the static ones; the static edition has no API.
  useEffect(()=>{if(import.meta.env.VITE_STATIC_DATASET==='true')return;fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/species/community`).then(r=>r.ok?r.json():null).then(setCommunity).catch(()=>{})},[])
  const species=useMemo(()=>community?.names?.length?applyReviewedNames(BASE,Object.fromEntries(community.names.map(n=>[n.gbifKey,{kn:n.kn,note:n.by}]))):BASE,[community])
  const opened=openId?species.find(s=>s.id===openId):null
  const list=useMemo(()=>filterSpecies(species,{group:drive?'':group,query,seasonality:group==='bird'?season:'',needsKannada:needs,month:group==='bird'?month:0,family,ids:drive,origin:group==='bird'?origin:0,flyways:FLYWAYS}),[group,query,season,needs,month,family,drive,origin])
  const named=useMemo(()=>({done:species.filter(s=>s.group===group&&s.name.kn).length,all:species.filter(s=>s.group===group).length}),[group])
  // The country list ignores the origin filter itself, so another country can be picked without clearing it first.
  const routeBase=useMemo(()=>group==='bird'&&!drive?filterSpecies(species,{group:'bird',query,seasonality:season,needsKannada:needs,month,family}):[],[species,group,drive,query,season,needs,month,family])
  const routes=useMemo(()=>aggregateRoutes(routeBase,FLYWAYS),[routeBase])
  const reset=fn=>value=>{fn(value);setShown(PAGE)}
  const open=id=>{setOpenId(id);setParam('species',id)}
  const close=()=>{setOpenId('');setParam('species','')}
  useEffect(()=>()=>setParam('species',''),[])
  const nowMonth=new Date().getMonth()+1
  const topMonth=Math.max(...migrants,1)
  return <main className="species-page portal-page" id="species">
    <header className="species-hero"><p className="eyebrow">{kn?'ಪಕ್ಷಿ · ಪ್ರಾಣಿ · ಸಸ್ಯ':'Birds · animals · plants'}</p><h2>{kn?'ಕರ್ನಾಟಕದ ಜೀವವೈವಿಧ್ಯ':'Karnataka’s wildlife and plants'}</h2>
      <p>{kn?`ಮುಕ್ತ ದತ್ತಾಂಶದಿಂದ (GBIF, ಇಬರ್ಡ್, ವಿಕಿಡೇಟಾ) ಸಂಗ್ರಹಿಸಿದ ${species.length.toLocaleString('en-IN')} ಪ್ರಭೇದಗಳು. ಕನ್ನಡ ಹೆಸರುಗಳು ಇನ್ನೂ ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ. ತಪ್ಪಿದ್ದರೆ ಅಥವಾ ಹೆಸರಿಲ್ಲದಿದ್ದರೆ ನೀವೇ ಸೂಚಿಸಿ.`:`${species.length.toLocaleString('en-IN')} species gathered from open data (GBIF, eBird, Wikidata). Kannada names are still awaiting review. Fix a wrong name or add a missing one.`} <a className="species-play" href="?game=bird#aata-paata">{kn?'ಆಟ: ಯಾವ ಜೀವಿ? →':'Play: Name that species →'}</a></p></header>
    <div className="species-groups" role="group" aria-label={kn?'ಗುಂಪು':'Group'}>{GROUPS.map(g=><button type="button" key={g.id} className={!drive&&group===g.id?'active':''} aria-pressed={!drive&&group===g.id} onClick={()=>{setDrive(null);setGroup(g.id);setSeason('');setMonth(0);setFamily('');setOrigin(0);setShown(PAGE)}}>{kn?g.kn:g.en} <small>{COUNTS[g.id]?.toLocaleString('en-IN')}</small></button>)}</div>

    {group==='bird'&&!drive&&<section className="species-calendar" aria-label={kn?'ವಲಸೆ ಕ್ಯಾಲೆಂಡರ್':'Migration calendar'}>
      <div><strong>{kn?'ವಲಸೆ ಹಕ್ಕಿಗಳ ಕ್ಯಾಲೆಂಡರ್':'Migratory-bird calendar'}</strong><small>{kn?'ಪ್ರತಿ ತಿಂಗಳು ದಾಖಲಾದ ವಲಸೆ ಹಕ್ಕಿಗಳು (ಇಬರ್ಡ್ ತಿಂಗಳ ದಾಖಲೆಗಳಿಂದ ಊಹಿಸಿದ್ದು). ತಿಂಗಳನ್ನು ಒತ್ತಿ.':'Migratory birds recorded each month (inferred from eBird month counts). Tap a month.'}</small></div>
      <div className="species-bars" role="group">{migrants.map((n,i)=><button type="button" key={i} className={month===i+1?'active':''} aria-pressed={month===i+1} onClick={()=>reset(setMonth)(month===i+1?0:i+1)} title={`${n}`}><i style={{height:`${Math.max(6,Math.round(n/topMonth*54))}px`}}></i><span>{(kn?MONTHS_KN:MONTHS)[i]}</span><b>{n}</b></button>)}</div>
      <button type="button" className="species-now" onClick={()=>reset(setMonth)(nowMonth)}>{kn?'ಈಗ ಬಂದಿರುವ ವಲಸೆ ಹಕ್ಕಿಗಳು':'Visiting now'}</button>
    </section>}

    {routes.length>0&&<section className="species-globe-section" aria-label={kn?'ವಲಸೆ ಭೂಗೋಳ':'Migration globe'}><div><strong>{kn?'ವಲಸೆ ಭೂಗೋಳ':'Migration globe'}</strong><small>{kn?'ಈಗ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಹಕ್ಕಿಗಳು ಬೇರೆ ಋತುವಿನಲ್ಲಿ ಎಲ್ಲಿ ಕಾಣುತ್ತವೆ. ತಿಂಗಳು ಅಥವಾ ಋತು ಆರಿಸಿದರೆ ಭೂಗೋಳ ಬದಲಾಗುತ್ತದೆ. ಎಳೆದು ತಿರುಗಿಸಿ.':'Where the birds in the list are seen in their other season. Pick a month or season and the globe changes. Drag to turn it.'}</small><ol>{routes.slice(0,8).map(r=><li key={r.id}><button type="button" className={origin===r.id?'active':''} aria-pressed={origin===r.id} onClick={()=>reset(setOrigin)(origin===r.id?0:r.id)}>{countryName(r.id)} <b>{r.weight}</b></button></li>)}</ol><small>{kn?'ದೇಶವನ್ನು ಒತ್ತಿದರೆ ಅಲ್ಲಿಂದ ಬರುವ ಹಕ್ಕಿಗಳು ಪಟ್ಟಿಯಲ್ಲಿ ಬರುತ್ತವೆ; ಸಂಖ್ಯೆ = ಅಲ್ಲಿ ಕಾಣುವ ಪ್ರಭೇದಗಳು. ಇವು ಕಂಡ ದಾಖಲೆಗಳು (ಇಬರ್ಡ್), ಉಪಗ್ರಹ ಮಾರ್ಗವಲ್ಲ.':'Tap a country to list the birds seen there; the number is how many listed species are seen there. These are eBird sightings, not tracked routes.'}</small></div><MigrationGlobe locale={locale} routes={routes}/></section>}

    <section className="species-drive" aria-label={kn?'ಹೆಸರಿಡುವ ಅಭಿಯಾನ':'Naming drive'}>
      <div><strong>{kn?'ಕನ್ನಡ ಹೆಸರು ಅಭಿಯಾನ':'Kannada name drive'}</strong><progress value={named.done} max={named.all||1}></progress><small>{kn?`${(GROUPS.find(g=>g.id===group)?.kn||'')}: ${named.done.toLocaleString('en-IN')} / ${named.all.toLocaleString('en-IN')} ಪ್ರಭೇದಗಳಿಗೆ ಹೆಸರಿನ ಸಲಹೆ ಇದೆ (ಪರಿಶೀಲನೆ ಬಾಕಿ).`:`${GROUPS.find(g=>g.id===group)?.en||''}: ${named.done.toLocaleString('en-IN')} of ${named.all.toLocaleString('en-IN')} species have a suggested name (awaiting review).`}</small></div>
      {drive?<button type="button" onClick={()=>{setDrive(null);setShown(PAGE)}}>{kn?'ಅಭಿಯಾನ ಮುಗಿಸಿ':'End the drive'}</button>:<button type="button" className="species-now" onClick={()=>{setDrive(namingDrive(species,images,today()));setShown(PAGE)}}>{kn?'ಹತ್ತು ಜೀವಿಗಳಿಗೆ ಹೆಸರಿಡಿ':'Name ten species'}</button>}
    </section>

    {community?.leaders?.length>0&&<section className="species-leaders" aria-label={kn?'ಹೆಸರು ಕೊಡುಗೆದಾರರು':'Name contributors'}><strong>{kn?'ಕನ್ನಡ ಹೆಸರು ಕೊಡುಗೆದಾರರು':'Kannada name contributors'}</strong><ol>{community.leaders.slice(0,10).map(p=><li key={p.name}><span>{kn&&p.nameKn?p.nameKn:p.name}</span><b>{p.species.toLocaleString('en-IN')}</b><small>{kn?'ಪ್ರಭೇದ':'species'}</small></li>)}</ol><small>{kn?'ಪರಿಶೀಲಕರು ಅನುಮೋದಿಸಿದ ಹೆಸರುಗಳು ಮಾತ್ರ.':'Only names approved by a reviewer count.'}</small></section>}
    <div className="species-tools">
      <input type="search" value={query} onChange={event=>reset(setQuery)(event.target.value)} placeholder={kn?'ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ವೈಜ್ಞಾನಿಕ ಹೆಸರು ಹುಡುಕಿ':'Search Kannada, English or scientific name'} aria-label={kn?'ಹುಡುಕಿ':'Search'}/>
      {group==='bird'&&!drive&&<select value={season} onChange={event=>reset(setSeason)(event.target.value)} aria-label={kn?'ಋತು':'Season'}><option value="">{kn?'ಎಲ್ಲ ಹಕ್ಕಿಗಳು':'All birds'}</option><option value="migratory">{kn?'ವಲಸೆ ಹಕ್ಕಿಗಳು':'Migratory birds'}</option>{Object.entries(SEASON).map(([id,label])=><option key={id} value={id}>{label[kn?1:0]}</option>)}</select>}
      <label className="species-check"><input type="checkbox" checked={needs} onChange={event=>reset(setNeeds)(event.target.checked)}/> {kn?'ಕನ್ನಡ ಹೆಸರು ಬೇಕಾದವು':'Needs a Kannada name'}</label>
      {family&&<button type="button" className="species-chip" onClick={()=>reset(setFamily)('')}>{family} ×</button>}
      {origin>0&&group==='bird'&&<button type="button" className="species-chip" onClick={()=>reset(setOrigin)(0)}>{kn?'ಎಲ್ಲಿಂದ':'From'}: {countryName(origin)} ×</button>}
      {month>0&&group==='bird'&&<button type="button" className="species-chip" onClick={()=>reset(setMonth)(0)}>{kn?'ತಿಂಗಳು':'Month'}: {(kn?MONTHS_KN:MONTHS)[month-1]} ×</button>}
    </div>
    <p className="species-count" aria-live="polite">{drive?(kn?'ಈ ಹತ್ತು ಜೀವಿಗಳಿಗೆ ಕನ್ನಡ ಹೆಸರು ಬೇಕು. ತಿಳಿದಿದ್ದರೆ ಸೂಚಿಸಿ. ':'These ten have no Kannada name yet. Suggest one if you know it. '):''}{list.length.toLocaleString('en-IN')} {kn?'ಪ್ರಭೇದಗಳು':'species'}</p>
    <ul className="species-grid">{list.slice(0,shown).map(item=>{const img=images[item.gbifKey],note=CULTURE[item.scientificName];return <li key={item.id} className="species-card">
      {img&&<figure className="species-photo"><button type="button" onClick={()=>open(item.id)} aria-label={`${kn?'ವಿವರ':'Details'}: ${item.name.en||item.scientificName}`}><img src={img.thumb} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"/></button><figcaption>{kn?'ಚಿತ್ರ':'Photo'}: {img.author} · {img.licenseUrl?<a href={img.licenseUrl} target="_blank" rel="noreferrer">{img.license}</a>:img.license} · <a href={img.page} target="_blank" rel="noreferrer">Wikimedia Commons</a></figcaption></figure>}
      <h3 lang="kn">{item.name.kn||<span className="species-missing">{kn?'ಕನ್ನಡ ಹೆಸರು ಬೇಕು':'Kannada name needed'}</span>}{item.knScope==='group'&&!item.knReviewed&&<small className="species-group-name">{kn?' · ಗುಂಪಿನ ಹೆಸರು':' · group name'}</small>}</h3>
      <p className="species-en">{item.name.en||'—'}</p><p className="species-sci"><i>{item.scientificName}</i>{item.family&&<> · <button type="button" className="species-family" onClick={()=>reset(setFamily)(item.family)} title={kn?'ಈ ಕುಟುಂಬದ ಜೀವಿಗಳನ್ನು ತೋರಿಸಿ':'Show this family'}>{item.family}</button></>}</p>
      {note&&<p className="species-culture">★ {note[kn?'kn':'en']}</p>}
      {item.seasonality&&item.seasonality.pattern!=='unknown'&&<div className={`species-season ${item.seasonality.pattern}`} title={kn?'eBird ತಿಂಗಳ ದಾಖಲೆಗಳಿಂದ ಊಹಿಸಿದ್ದು; ಅಧಿಕೃತವಲ್ಲ':'Inferred from eBird month counts; not authoritative'}><b>{SEASON[item.seasonality.pattern][kn?1:0]}</b><span aria-hidden="true">{MONTHS.map((m,i)=><i key={m} className={item.seasonality.months.includes(i+1)?'on':''}>{(kn?MONTHS_KN:MONTHS)[i]}</i>)}</span></div>}
      {item.knCandidates?.length>1&&!item.knReviewed&&<p className="species-other">{kn?'ಇತರ ಸಲಹೆಗಳು':'Also suggested'}: {item.knCandidates.filter(c=>c.value!==item.name.kn).map(c=>c.value).join(', ')}</p>}
      <p className="species-status">{item.knReviewed?(kn?'ಕನ್ನಡ ಹೆಸರು ಪರಿಶೀಲಿತ':'Kannada name reviewed'):item.name.kn?(kn?`ಕನ್ನಡ ಹೆಸರು ಪರಿಶೀಲನೆ ಬಾಕಿ · ${item.knCandidates[0]?.sources.join(' + ')}`:`Kannada name awaiting review · ${item.knCandidates[0]?.sources.join(' + ')}`):''}</p>
      <p className="species-links"><button type="button" onClick={()=>open(item.id)}>{kn?'ವಿವರ ಮತ್ತು ನಕ್ಷೆ':'Details and map'} →</button><a href={`?${new URLSearchParams({contributeTarget:item.id,contributeType:'species',contributeName:`${item.scientificName} · ${item.name.en||''}`,contributeAction:'correction'})}#contribute`}>{item.name.kn?(kn?'ಹೆಸರು ತಿದ್ದಿ':'Correct the name'):(kn?'ಕನ್ನಡ ಹೆಸರು ಸೂಚಿಸಿ':'Suggest a Kannada name')}</a></p>
    </li>})}</ul>
    {list.length>shown&&<button type="button" className="species-more" onClick={()=>setShown(n=>n+PAGE)}>{kn?'ಇನ್ನಷ್ಟು ತೋರಿಸಿ':'Show more'}</button>}
    <p className="species-note">{kn?'ಪ್ರಭೇದಗಳ ಪಟ್ಟಿ ಕರ್ನಾಟಕದಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ದಾಖಲಾದವು (ಸಂಪೂರ್ಣ ಪಟ್ಟಿಯಲ್ಲ). ವಲಸೆ ವಿವರ ಇಬರ್ಡ್ ತಿಂಗಳ ದಾಖಲೆಗಳಿಂದ ಊಹಿಸಲಾಗಿದೆ; ಪಕ್ಷಿ ತಜ್ಞರ ಪರಿಶೀಲನೆ ಬೇಕು. ಚಿತ್ರಗಳು ವಿಕಿಮೀಡಿಯಾ ಕಾಮನ್ಸ್‌ನ ಮುಕ್ತ ಪರವಾನಗಿಯವು (CC0, ಸಾರ್ವಜನಿಕ ವಲಯ, CC BY, CC BY-SA); ಪ್ರತಿ ಚಿತ್ರದ ಕೆಳಗೆ ಛಾಯಾಗ್ರಾಹಕ ಮತ್ತು ಪರವಾನಗಿ ನೀಡಲಾಗಿದೆ.':'The list holds the most-recorded species in Karnataka, not a complete checklist. Migration patterns are inferred from eBird month counts and need an ornithologist’s review. Photos are from Wikimedia Commons under open licences (CC0, public domain, CC BY, CC BY-SA); each shows its author and licence.'} {SOURCES.map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.id==='gbif'?'GBIF':'Wikidata'} ↗</a>)}</p>
    {opened&&<SpeciesDetail item={opened} locale={locale} onClose={close}/>}
  </main>
}
