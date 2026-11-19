import { useMemo, useState } from 'react'
import MigrationGlobe, { countryCentroid, countryName } from './MigrationGlobe'
import { FLYWAYS, IMAGES, SPECIES } from './species-data'
import { birdName, filterMigrants, globeLabels, migrants, originCounts } from './migration'
import { monthRange } from './species-normalize'
import './species.css'
import './migration.css'

const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_KN=['ಜ','ಫೆ','ಮಾ','ಏ','ಮೇ','ಜೂ','ಜು','ಆ','ಸೆ','ಅ','ನ','ದ']
const PATTERNS={'winter-visitor':['Winter visitors','ಚಳಿಗಾಲದ ವಲಸೆ ಹಕ್ಕಿಗಳು'],'summer-visitor':['Summer / monsoon visitors','ಬೇಸಿಗೆ / ಮಳೆಗಾಲದ ಅತಿಥಿಗಳು'],'passage-or-local-movement':['Passage migrants','ಹಾದುಹೋಗುವ ವಲಸೆ ಹಕ್ಕಿಗಳು']}
const ALL=migrants(SPECIES,FLYWAYS)
const PAGE=40

export default function MigrationExplorer({locale}){
  const kn=locale==='kn'
  const [month,setMonth]=useState(new Date().getMonth()+1),[pattern,setPattern]=useState(''),[query,setQuery]=useState(''),[country,setCountry]=useState(0),[selectedId,setSelectedId]=useState(''),[focus,setFocus]=useState(null),[shown,setShown]=useState(PAGE)
  const pool=useMemo(()=>filterMigrants(ALL,{month,pattern,query,flyways:FLYWAYS}),[month,pattern,query])
  const list=useMemo(()=>country?filterMigrants(pool,{country,flyways:FLYWAYS}):pool,[pool,country])
  const selected=selectedId?ALL.find(b=>b.id===selectedId):null
  const routes=useMemo(()=>selected?FLYWAYS[selected.gbifKey].countries.map(c=>({id:c.id,weight:c.n})):originCounts(pool,FLYWAYS),[selected,pool])
  const labels=useMemo(()=>globeLabels({birds:pool,flyways:FLYWAYS,selectedBird:selected,selectedCountry:country,locale,nameOfCountry:countryName}),[pool,selected,country,locale])
  const origins=useMemo(()=>originCounts(pool,FLYWAYS),[pool])
  const names=kn?MONTHS_KN:MONTHS
  const pickCountry=id=>{setCountry(id);setSelectedId('');setShown(PAGE);const c=id&&countryCentroid(id);if(c)setFocus([c[0],c[1]])}
  const pickBird=bird=>{
    if(selectedId===bird.id){setSelectedId('');return}
    setSelectedId(bird.id)
    const c=countryCentroid(FLYWAYS[bird.gbifKey].countries[0].id)
    if(c)setFocus([(c[0]+76)/2,(c[1]+15)/2])
  }
  const reset=fn=>value=>{fn(value);setCountry(0);setSelectedId('');setShown(PAGE)}
  const flyway=selected&&FLYWAYS[selected.gbifKey]
  const fromText=b=>[...FLYWAYS[b.gbifKey].countries.slice(0,3).map(c=>countryName(c.id)),...(FLYWAYS[b.gbifKey].states||[]).slice(0,2).map(s=>s.name)].join(', ')
  return <main className="species-page migration-page portal-page" id="migration">
    <header className="species-hero explore-hero"><div><p className="eyebrow">{kn?'ಪಕ್ಷಿ ವಲಸೆ':'Bird migration'}</p><h2>{kn?'ವಲಸೆ ಹಕ್ಕಿಗಳು ಎಲ್ಲಿಂದ ಬರುತ್ತವೆ?':'Where do Karnataka’s migratory birds come from?'}</h2>
      <p>{kn?'ಭೂಗೋಳವನ್ನು ತಿರುಗಿಸಿ. ದೇಶವನ್ನು ಒತ್ತಿದರೆ ಅಲ್ಲಿಂದ ಬರುವ ಹಕ್ಕಿಗಳ ಹೆಸರು ಭೂಗೋಳದ ಮೇಲೆ ಕಾಣುತ್ತದೆ; ಹಕ್ಕಿಯನ್ನು ಆರಿಸಿದರೆ ಅದರ ಮಾರ್ಗ ಮತ್ತು ಹೆಸರು ತೋರುತ್ತದೆ. ಇವು ಇಬರ್ಡ್‌ನಲ್ಲಿ ಕಂಡ ದಾಖಲೆಗಳು, ಉಪಗ್ರಹ ಮಾರ್ಗಗಳಲ್ಲ.':'Turn the globe. Tap a country to see the names of the birds that come from there, or pick a bird to see its route and name on the globe. These are eBird sightings, not tracked routes.'}</p></div></header>
    <div className="species-tools migration-tools">
      <label>{kn?'ತಿಂಗಳು':'Month'} <select value={month} onChange={event=>reset(setMonth)(Number(event.target.value))}><option value={0}>{kn?'ಎಲ್ಲ ತಿಂಗಳು':'Any month'}</option>{MONTHS.map((m,i)=><option key={m} value={i+1}>{kn?MONTHS_KN[i]:m}</option>)}</select></label>
      <button type="button" className="species-now" onClick={()=>reset(setMonth)(new Date().getMonth()+1)}>{kn?'ಈಗ ಇರುವ ಹಕ್ಕಿಗಳು':'Here now'}</button>
      <select value={pattern} onChange={event=>reset(setPattern)(event.target.value)} aria-label={kn?'ವಿಧ':'Type'}><option value="">{kn?'ಎಲ್ಲ ವಿಧ':'All types'}</option>{Object.entries(PATTERNS).map(([id,l])=><option key={id} value={id}>{l[kn?1:0]}</option>)}</select>
      <input type="search" value={query} onChange={event=>reset(setQuery)(event.target.value)} placeholder={kn?'ಹಕ್ಕಿಯ ಹೆಸರು ಹುಡುಕಿ':'Search a bird'} aria-label={kn?'ಹುಡುಕಿ':'Search'}/>
      {country>0&&<button type="button" className="species-chip" onClick={()=>pickCountry(0)}>{kn?'ಎಲ್ಲಿಂದ':'From'}: {countryName(country)} ×</button>}
      {selected&&<button type="button" className="species-chip" onClick={()=>setSelectedId('')}>{birdName(selected,locale)} ×</button>}
    </div>
    <div className="migration-layout">
      <section className="migration-globe-panel" aria-label={kn?'ವಲಸೆ ಭೂಗೋಳ':'Migration globe'}>
        <MigrationGlobe locale={locale} routes={routes} labels={labels} selected={country} onPickCountry={pickCountry} focus={focus} karnatakaLabel={kn?'ಕರ್ನಾಟಕ':'Karnataka'} maxSize={700}/>
        <p className="species-map-note">{kn?`${pool.length.toLocaleString('en-IN')} ವಲಸೆ ಹಕ್ಕಿಗಳು${month?` (${names[month-1]} ತಿಂಗಳಲ್ಲಿ ಕರ್ನಾಟಕದಲ್ಲಿ ಕಂಡವು)`:''}. ದೇಶದ ಚುಕ್ಕಿಯನ್ನು ಒತ್ತಿ.`:`${pool.length.toLocaleString('en-IN')} migratory birds${month?` seen in Karnataka in ${names[month-1]}`:''}. Tap a country’s dot.`}</p>
        <ol className="migration-origins">{origins.slice(0,12).map(o=><li key={o.id}><button type="button" className={country===o.id?'active':''} aria-pressed={country===o.id} onClick={()=>pickCountry(country===o.id?0:o.id)}>{countryName(o.id)} <b>{o.weight}</b></button></li>)}</ol>
      </section>
      <section className="migration-list" aria-label={kn?'ಹಕ್ಕಿಗಳು':'Birds'}>
        {selected&&<article className="migration-detail"><h3 lang="kn">{birdName(selected,locale)}</h3><p className="species-sci"><i>{selected.scientificName}</i>{selected.family&&` · ${selected.family}`}</p>
          <div className="species-route-line"><div><small>{kn?(flyway.season==='summer-range'?'ಉತ್ತರದ ಬೇಸಿಗೆಯಲ್ಲಿ ಕಾಣುವ ಸ್ಥಳ':'ಚಳಿಗಾಲದ ತಿಂಗಳುಗಳಲ್ಲಿ ಕಾಣುವ ಸ್ಥಳ'):(flyway.season==='summer-range'?'Seen in the northern summer in':'Seen in the winter months in')}</small><b>{[...flyway.countries.map(c=>`${countryName(c.id)} (${Math.round(c.share*100)}%)`),...(flyway.states||[]).map(s=>`${s.name} (${kn?'ಭಾರತ':'India'})`)].join(', ')}</b></div><span aria-hidden="true">→</span><div><small>{kn?'ಕರ್ನಾಟಕದಲ್ಲಿ ಕಾಣುವ ತಿಂಗಳುಗಳು':'Seen in Karnataka in'}</small><b>{monthRange(selected.seasonality.months,names)}</b></div></div>
          <p className="species-links"><a href={`?species=${selected.id}#species`}>{kn?'ವಿವರ, ಫೋಟೋ ಮತ್ತು ನಕ್ಷೆ':'Details, photo and map'} →</a></p></article>}
        <p className="species-count" aria-live="polite">{list.length.toLocaleString('en-IN')} {kn?'ಹಕ್ಕಿಗಳು':'birds'}{country?` · ${countryName(country)}`:''}</p>
        <ul className="migration-birds">{list.slice(0,shown).map(b=>{const img=IMAGES[b.gbifKey];return <li key={b.id}><button type="button" className={selectedId===b.id?'active':''} aria-pressed={selectedId===b.id} onClick={()=>pickBird(b)}>
          {img?<img src={img.thumb} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"/>:<span className="migration-noimg" aria-hidden="true">🐦</span>}
          <span><strong lang="kn">{birdName(b,locale)}</strong><small>{b.name.en&&locale==='kn'?`${b.name.en} · `:''}<i>{b.scientificName}</i></small><small>{kn?'ಎಲ್ಲಿಂದ':'From'}: {fromText(b)} · {monthRange(b.seasonality.months,names)}</small></span></button></li>})}</ul>
        {list.length>shown&&<button type="button" className="species-more" onClick={()=>setShown(n=>n+PAGE)}>{kn?'ಇನ್ನಷ್ಟು ತೋರಿಸಿ':'Show more'}</button>}
        {list.length===0&&<p className="species-note">{kn?'ಈ ಆಯ್ಕೆಗೆ ಯಾವುದೇ ಹಕ್ಕಿ ಇಲ್ಲ. ತಿಂಗಳು ಅಥವಾ ವಿಧವನ್ನು ಬದಲಿಸಿ.':'No birds match. Try another month or type.'}</p>}
      </section>
    </div>
    <p className="species-note">{kn?'ಮೂಲ: ಇಬರ್ಡ್ ವೀಕ್ಷಣೆಗಳು (GBIF ಮೂಲಕ). “ಎಲ್ಲಿಂದ” ಎಂದರೆ ಆ ಹಕ್ಕಿ ಬೇರೆ ಋತುವಿನಲ್ಲಿ ಕಂಡ ದೇಶಗಳು, ನಿಖರ ಮೂಲಸ್ಥಳವಲ್ಲ. ಪಕ್ಷಿ ತಜ್ಞರ ಪರಿಶೀಲನೆ ಬೇಕು.':'Source: eBird sightings via GBIF. “From” means the countries where the bird is seen in the other season, not an exact origin. Needs an ornithologist’s review.'} <a href="#species">{kn?'ಎಲ್ಲ ಪ್ರಭೇದಗಳು →':'All species →'}</a></p>
  </main>
}
