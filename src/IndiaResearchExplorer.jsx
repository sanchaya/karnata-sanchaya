import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { indiaResearchIndex } from './data/india-research.generated.js'
import './india-research.css'

const PAGE_SIZE=80
const kindColors={event:'#a83e32','district-event':'#9b4b36',milestone:'#4361ee',kingdom:'#26735f',ruler:'#79538f',territory:'#c27b25',monument:'#80572f',inscription:'#9a6b24','corpus-page-lead':'#657084'}
const yearLabel=value=>value==null?'':`${Math.abs(value)} ${value<0?'BCE':'CE'}`
const safeText=value=>String(value||'')

export default function IndiaResearchExplorer({locale='en'}){
  const kn=locale==='kn'
  const [dataset,setDataset]=useState('history')
  const [scope,setScope]=useState('india')
  const [kind,setKind]=useState('all')
  const [query,setQuery]=useState('')
  const [year,setYear]=useState('')
  const [limit,setLimit]=useState(PAGE_SIZE)
  const [selected,setSelected]=useState(null)
  const records=dataset==='sources'?indiaResearchIndex.sources:indiaResearchIndex.records.filter(record=>record.dataset===dataset)
  const kinds=useMemo(()=>[...new Set(records.map(record=>record.kind).filter(Boolean))].sort(),[records])
  const filtered=useMemo(()=>{
    const needle=query.trim().toLowerCase(),selectedYear=year===''?null:Number(year)
    return records.filter(record=>{
      if(scope==='india'&&record.scope==='subcontinent')return false
      if(kind!=='all'&&record.kind!==kind)return false
      if(selectedYear!=null&&(record.yearFrom==null||selectedYear<record.yearFrom||selectedYear>(record.yearTo??record.yearFrom)))return false
      if(!needle)return true
      return [record.title,record.summary,record.place,record.district,record.taluk,record.publication,record.volume,record.number,record.category,record.sourceClaim].some(value=>safeText(value).toLowerCase().includes(needle))
    })
  },[records,scope,kind,query,year])
  const mapped=useMemo(()=>filtered.filter(record=>Number.isFinite(record.lat)&&Number.isFinite(record.lng)).slice(0,700),[filtered])
  const chooseDataset=value=>{setDataset(value);setKind('all');setLimit(PAGE_SIZE);setSelected(null)}
  const counts=indiaResearchIndex.meta
  return <main className="india-research-page">
    <section className="india-research-hero">
      <div><p className="eyebrow">{kn?'ನೇರ ಕೊಂಡಿ ಮೂಲಕ ಮಾತ್ರ · ಸಂಶೋಧನಾ ಕಾರ್ಯಸ್ಥಳ':'Direct-link only · research workspace'}</p><h2>{kn?'ಭಾರತ ಇತಿಹಾಸ ಅನ್ವೇಷಣಾ ಸೂಚಿ':'India Historical Discovery Index'}</h2><p>{kn?'ಈ ಪುಟವು ಸಾಮಾನ್ಯ ನಾವಿಗೇಶನ್‌ನಲ್ಲಿ ಕಾಣಿಸುವುದಿಲ್ಲ. ಭಾರತರಾಜ್ಯ ಮತ್ತು WhatIsIndiaಯಿಂದ ಆಮದು ಮಾಡಿದ ಭಾರತವ್ಯಾಪಿ ಸುಳಿವುಗಳನ್ನು ಪರಿಶೀಲನೆಗಾಗಿ ಒಟ್ಟುಗೂಡಿಸುತ್ತದೆ; ಇವು ಪ್ರಕಟಿತ ಅಥವಾ ಸ್ವತಂತ್ರವಾಗಿ ದೃಢೀಕರಿಸಿದ ಹೇಳಿಕೆಗಳಲ್ಲ.':'This unlinked workspace brings together India-wide discovery leads imported from BharatRajya and WhatIsIndia. These are not published or independently verified historical claims.'}</p></div>
      <aside><strong>{kn?'ಸಾಕ್ಷ್ಯ ನೀತಿ':'Evidence policy'}</strong><p>{kn?'ಭಾರತರಾಜ್ಯವನ್ನು ವಿದ್ವತ್ ಉಲ್ಲೇಖವಾಗಿ ಬಳಸಲಾಗುವುದಿಲ್ಲ. ಪ್ರತಿಯೊಂದು ಹೇಳಿಕೆಯನ್ನು ಅದರ ಮೂಲ ಆಕರದೊಂದಿಗೆ ವಸ್ತುಮಟ್ಟದಲ್ಲಿ ಹೊಂದಿಸಿ ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ಸಾರ್ವಜನಿಕ ಪ್ರಕಟಣೆಗೆ ಏರಿಸಬೇಕು.':'BharatRajya is not a scholarly citation. Every claim must be matched to its underlying source and reviewed at item level before public promotion.'}</p></aside>
    </section>
    <section className="india-research-stats" aria-label={kn?'ಆಮದು ಅಂಕಿಅಂಶಗಳು':'Import statistics'}>
      <span><b>{counts.bharatrajya.counts.kingdoms?.toLocaleString('en-IN')}</b>{kn?'ರಾಜ್ಯ/ರಾಜವಂಶ ದಾಖಲೆಗಳು':'polity records'}</span>
      <span><b>{counts.bharatrajya.counts.territories?.toLocaleString('en-IN')}</b>{kn?'ಜಿಲ್ಲಾ-ಕಾಲ ಪ್ರದೇಶ ದಾಖಲೆಗಳು':'district-period territories'}</span>
      <span><b>{counts.bharatrajya.counts.events?.toLocaleString('en-IN')}</b>{kn?'ಐತಿಹಾಸಿಕ ಘಟನೆಗಳು':'historical events'}</span>
      <span><b>{counts.whatisindia.records?.toLocaleString('en-IN')}</b>{kn?'ಶಾಸನ ದಾಖಲೆ/ಸುಳಿವುಗಳು':'inscription records/leads'}</span>
      <span><b>{counts.whatisindia.pagesCrawled?.toLocaleString('en-IN')}</b>{kn?'ಪರಿಶೀಲಿಸಿದ ಮೂಲ ಪುಟಗಳು':'source pages crawled'}</span>
    </section>
    <nav className="india-research-tabs" aria-label={kn?'ದತ್ತಾಂಶ ವಿಭಾಗಗಳು':'Dataset sections'}>
      <button className={dataset==='history'?'active':''} onClick={()=>chooseDataset('history')}>{kn?'ಭಾರತ ಇತಿಹಾಸ ದತ್ತಾಂಶ':'India history data'}</button>
      <button className={dataset==='inscriptions'?'active':''} onClick={()=>chooseDataset('inscriptions')}>{kn?'ಭಾರತ ಶಾಸನ ಸೂಚಿ':'India inscription index'}</button>
      <button className={dataset==='sources'?'active':''} onClick={()=>chooseDataset('sources')}>{kn?'ಮೂಲ ಆಕರ ಅಭ್ಯರ್ಥಿಗಳು':'Underlying source candidates'}</button>
    </nav>
    <section className="india-research-controls">
      <label><span>{kn?'ಹುಡುಕಿ':'Search all fields'}</span><input value={query} onChange={event=>{setQuery(event.target.value);setLimit(PAGE_SIZE)}} placeholder={kn?'ಸ್ಥಳ, ರಾಜವಂಶ, ಶಾಸನ, ಘಟನೆ…':'Place, dynasty, inscription, event…'}/></label>
      <label><span>{kn?'ದಾಖಲೆ ವಿಧ':'Record type'}</span><select value={kind} onChange={event=>{setKind(event.target.value);setLimit(PAGE_SIZE)}}><option value="all">{kn?'ಎಲ್ಲ ವಿಧಗಳು':'All types'}</option>{kinds.map(value=><option value={value} key={value}>{value}</option>)}</select></label>
      <label><span>{kn?'ವರ್ಷ (ಐಚ್ಛಿಕ)':'Year (optional)'}</span><input type="number" value={year} onChange={event=>{setYear(event.target.value);setLimit(PAGE_SIZE)}} placeholder="e.g. 1346"/></label>
      <label><span>{kn?'ವ್ಯಾಪ್ತಿ':'Scope'}</span><select value={scope} onChange={event=>{setScope(event.target.value);setLimit(PAGE_SIZE)}}><option value="india">{kn?'ಭಾರತ ಸಂಬಂಧಿತ':'India-related'}</option><option value="subcontinent">{kn?'ಪೂರ್ಣ ಆಮದು ಸಂಗ್ರಹ':'Full imported subcontinent set'}</option></select></label>
    </section>
    {dataset==='history'&&<section className="india-research-map-wrap">
      <div className="india-research-map-heading"><strong>{kn?'ಸ್ಥಳ ನಿರ್ದಿಷ್ಟ ಘಟನೆಗಳು':'Location-specific records'}</strong><small>{mapped.length.toLocaleString('en-IN')} / {filtered.length.toLocaleString('en-IN')} · {kn?'ಒಮ್ಮೆ ಗರಿಷ್ಠ 700 ಗುರುತುಗಳು':'maximum 700 markers at once'}</small></div>
      <MapContainer center={[22.5,79]} zoom={4.35} minZoom={3} maxZoom={13} scrollWheelZoom>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {mapped.map(record=><CircleMarker key={record.id} center={[record.lat,record.lng]} radius={selected?.id===record.id?8:5} pathOptions={{color:'#fff',weight:1.5,fillColor:kindColors[record.kind]||'#657084',fillOpacity:.9}} eventHandlers={{click:()=>setSelected(record)}}><Popup><strong>{record.title}</strong><br/><small>{record.kind} · {yearLabel(record.yearFrom)}</small>{record.summary&&<><br/><span>{record.summary.slice(0,360)}</span></>}</Popup></CircleMarker>)}
      </MapContainer>
    </section>}
    <section className="india-research-results">
      <header><div><strong>{filtered.length.toLocaleString('en-IN')}</strong> {kn?'ದಾಖಲೆಗಳು ಹೊಂದಿಕೆಯಾಗಿವೆ':'matching records'}</div><small>{kn?'ಎಲ್ಲಾ ದಾಖಲೆಗಳು ಮಾನವ ಪರಿಶೀಲನೆಗಾಗಿ ಕಾಯುತ್ತಿವೆ':'All records await human review'}</small></header>
      <div className="india-research-grid">{filtered.slice(0,limit).map(record=><article key={record.id} className={selected?.id===record.id?'selected':''}>
        <div className="india-research-record-meta"><span>{record.kind}</span><em>{record.reviewStatus}</em></div>
        <h3>{record.title}</h3>
        <p className="india-research-locator">{[record.place,record.district,record.taluk,record.publication&&`${record.publication}${record.volume?` · Vol. ${record.volume}`:''}`,record.number&&`No. ${record.number}`,record.page&&`p. ${record.page}`].filter(Boolean).join(' · ')}</p>
        {(record.yearFrom!=null||record.yearTo!=null)&&<time>{yearLabel(record.yearFrom)}{record.yearTo!=null&&record.yearTo!==record.yearFrom?` – ${yearLabel(record.yearTo)}`:''}</time>}
        {record.summary&&<p>{record.summary.slice(0,720)}</p>}
        {record.sourceClaim&&<div className="india-research-source-claim"><b>{kn?'ಆಮದು ಮಾಡಿದ ಮೂಲ ಸೂಚನೆ — ಪರಿಶೀಲಿಸಬೇಕು':'Imported source claim — verify'}</b><span>{record.sourceClaim}</span></div>}
        <footer><code>{record.id}</code>{record.url&&<a href={record.url} target="_blank" rel="noreferrer">{kn?'ಮೂಲ ಪುಟ ತೆರೆಯಿರಿ ↗':'Open source page ↗'}</a>}</footer>
      </article>)}</div>
      {limit<filtered.length&&<button className="india-research-more" onClick={()=>setLimit(value=>value+PAGE_SIZE)}>{kn?'ಇನ್ನಷ್ಟು 80 ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಿ':'Show 80 more records'}</button>}
    </section>
    <section className="india-research-audit-note"><strong>{kn?'ಆಮದು ಸ್ಥಿತಿ':'Import status'}</strong><span>BharatRajya: {counts.bharatrajya.retrievedAt} · WhatIsIndia: {counts.whatisindia.retrievedAt} · {counts.whatisindia.failures} {kn?'ಮೂಲ ಪುಟ ದೋಷಗಳು ಪ್ರತ್ಯೇಕವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ':'source-page failures retained in the import manifest'}.</span></section>
  </main>
}
