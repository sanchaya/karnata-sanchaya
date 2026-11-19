import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { genderStats, placeGroups, pressPeople } from './periodicals'
import './press.css'

const GENDERS=[['woman','ಮಹಿಳೆ','Women','#a43d72'],['man','ಪುರುಷ','Men','#2f5f9e'],['unknown','ಗುರುತಿಸಲಾಗಿಲ್ಲ','Not told by the name','#9a8f80'],['organisation','ಸಂಸ್ಥೆ','Organisations','#6b7a3a']]
const ALL=atlasData.periodicals
const years=ALL.map(p=>p.date?.from).filter(Number.isFinite)
const MIN=Math.min(...years),MAX=Math.max(...years)

function Bars({data,kn,title}){
  const total=Object.values(data).reduce((a,b)=>a+b,0)||1
  return <div className="press-bars"><strong>{title}</strong><div className="press-bar" role="img" aria-label={GENDERS.map(([k,a,b])=>`${kn?a:b} ${data[k]}`).join(', ')}>{GENDERS.map(([k,,,c])=><i key={k} style={{width:`${data[k]/total*100}%`,background:c}}/>)}</div><ul>{GENDERS.map(([k,a,b,c])=><li key={k}><i style={{background:c}}/>{kn?a:b} <b>{data[k]}</b> <small>({Math.round(data[k]/total*100)}%)</small></li>)}</ul></div>
}

export function PressPeople({locale,limit=24,showLink=true}){
  const kn=locale==='kn'
  const [gender,setGender]=useState('all'),[role,setRole]=useState('all'),[q,setQ]=useState(''),[more,setMore]=useState(limit)
  const people=useMemo(()=>pressPeople(ALL).filter(p=>p.gender!=='organisation').sort((a,b)=>b.editorCount+b.publisherCount-a.editorCount-a.publisherCount||a.name.localeCompare(b.name,'kn')),[])
  const list=people.filter(p=>(gender==='all'||p.gender===gender)&&(role==='all'||(role==='editor'?p.editorCount:p.publisherCount))&&(!q||p.name.includes(q.trim())))
  return <section className="press-people" aria-labelledby="press-people-title">
    <h3 id="press-people-title">{kn?'ಪತ್ರಿಕೆಗಳ ಸಂಪಾದಕರು ಮತ್ತು ಪ್ರಕಾಶಕರು':'Newspaper and magazine editors and publishers'}</h3>
    <p className="press-note">{kn?'ಪತ್ರಿಕಾ ಸಂಚಯ ಪಟ್ಟಿಯಿಂದ. ಲಿಂಗವು ಪಟ್ಟಿಯಲ್ಲಿ ಇಲ್ಲ; ಹೆಸರಿನಿಂದ ಅಂದಾಜಿಸಿದ್ದು, ಪರಿಶೀಲನೆ ಆಗಿಲ್ಲ.':'From the Patrika Sanchaya catalogue. The catalogue has no gender field; gender is a guess from the name and is not reviewed.'} {showLink&&<a href="#press">{kn?'ಪತ್ರಿಕೆಗಳ ನಕ್ಷೆ ತೆರೆಯಿರಿ →':'Open the press map →'}</a>}</p>
    <div className="press-filters"><input type="search" value={q} onChange={e=>{setQ(e.target.value);setMore(limit)}} placeholder={kn?'ಹೆಸರು ಹುಡುಕಿ':'Search a name'} aria-label={kn?'ಹೆಸರು ಹುಡುಕಿ':'Search a name'}/>
      <select value={role} onChange={e=>setRole(e.target.value)} aria-label={kn?'ಪಾತ್ರ':'Role'}><option value="all">{kn?'ಸಂಪಾದಕ ಮತ್ತು ಪ್ರಕಾಶಕ':'Editors and publishers'}</option><option value="editor">{kn?'ಸಂಪಾದಕರು':'Editors'}</option><option value="publisher">{kn?'ಪ್ರಕಾಶಕರು':'Publishers'}</option></select>
      <select value={gender} onChange={e=>setGender(e.target.value)} aria-label={kn?'ಲಿಂಗ (ಅಂದಾಜು)':'Gender (inferred)'}><option value="all">{kn?'ಎಲ್ಲರೂ':'Everyone'}</option>{GENDERS.filter(g=>g[0]!=='organisation').map(([k,a,b])=><option key={k} value={k}>{kn?a:b}</option>)}</select></div>
    <p className="press-count">{list.length} {kn?'ವ್ಯಕ್ತಿಗಳು':'people'}</p>
    <ul className="press-list">{list.slice(0,more).map(p=>{const first=[...p.editor,...p.publisher][0];return <li key={p.name}><strong>{p.name}</strong><span className={`press-tag g-${p.gender}`}>{kn?GENDERS.find(g=>g[0]===p.gender)[1]:GENDERS.find(g=>g[0]===p.gender)[2]}</span><small>{p.editorCount?`${kn?'ಸಂಪಾದಕ':'Editor'} ×${p.editorCount}`:''}{p.editorCount&&p.publisherCount?' · ':''}{p.publisherCount?`${kn?'ಪ್ರಕಾಶಕ':'Publisher'} ×${p.publisherCount}`:''}{p.years.length?` · ${Math.min(...p.years)}${Math.max(...p.years)!==Math.min(...p.years)?`–${Math.max(...p.years)}`:''}`:''}</small><small>{first?.name?.[locale]||first?.name?.kn}{first?.publicationPlace?` · ${first.publicationPlace[locale]||first.publicationPlace.kn}`:''}</small></li>})}</ul>
    {more<list.length&&<button type="button" className="press-more" onClick={()=>setMore(m=>m+limit*2)}>{kn?'ಇನ್ನಷ್ಟು ತೋರಿಸಿ':'Show more'}</button>}
  </section>
}

export default function PressExplorer({locale}){
  const kn=locale==='kn'
  const [from,setFrom]=useState(MIN),[to,setTo]=useState(MAX),[gender,setGender]=useState('all')
  const inRange=useMemo(()=>ALL.filter(p=>{const y=p.date?.from;return (!Number.isFinite(y)||(y>=from&&y<=to))}),[from,to])
  const stats=useMemo(()=>genderStats(inRange),[inRange])
  const groups=useMemo(()=>placeGroups(inRange),[inRange])
  const noLocation=inRange.filter(p=>!p.location).length
  const decades=Object.keys(stats.byDecade).map(Number).sort((a,b)=>a-b)
  const pickYear=(setter,v)=>setter(Number(v))
  return <main className="portal-page press-page" id="press">
    <section className="press-hero explore-hero"><div><p className="eyebrow">{kn?'ಪತ್ರಿಕಾ ಸಂಚಯ':'Patrika Sanchaya'}</p><h2>{kn?'ಪತ್ರಿಕೆಗಳು ಮತ್ತು ನಿಯತಕಾಲಿಕೆಗಳು':'Newspapers and magazines'}</h2>
      <p>{kn?'ಕನ್ನಡ ಪತ್ರಿಕೆಗಳು ಎಲ್ಲಿ ಪ್ರಕಟವಾದವು, ಯಾರು ಸಂಪಾದಿಸಿದರು ಮತ್ತು ಪ್ರಕಟಿಸಿದರು. ಸ್ಥಳಗಳು ಪ್ರಕಟಣಾ ಊರಿನ ಅಂದಾಜು ಗುರುತುಗಳು (ಪರಿಶೀಲನೆ ಬಾಕಿ).':'Where Kannada newspapers and magazines were published, and who edited and published them. Places are approximate anchors for the town or district of publication (needs review).'}</p></div>
      <div className="press-stats"><span><b>{inRange.length}</b>{kn?'ಪತ್ರಿಕೆಗಳು':'titles'}</span><span><b>{groups.length}</b>{kn?'ಪ್ರಕಟಣಾ ಸ್ಥಳಗಳು':'places'}</span><span><b>{stats.editors.woman}</b>{kn?'ಮಹಿಳಾ ಸಂಪಾದಕರು (ಅಂದಾಜು)':'women editors (inferred)'}</span><span><b>{stats.publishers.woman}</b>{kn?'ಮಹಿಳಾ ಪ್ರಕಾಶಕರು (ಅಂದಾಜು)':'women publishers (inferred)'}</span></div></section>
    <section className="press-filters"><label>{kn?'ವರ್ಷ':'From'} <input type="number" min={MIN} max={to} value={from} onChange={e=>pickYear(setFrom,e.target.value)}/></label><label>{kn?'ವರೆಗೆ':'to'} <input type="number" min={from} max={MAX} value={to} onChange={e=>pickYear(setTo,e.target.value)}/></label>
      <input type="range" min={MIN} max={MAX} value={to} onChange={e=>setTo(Math.max(from,Number(e.target.value)))} aria-label={kn?'ವರ್ಷದ ಮಿತಿ':'Last year'}/>
      <button type="button" onClick={()=>{setFrom(MIN);setTo(MAX)}}>{kn?'ಎಲ್ಲ ವರ್ಷ':'All years'}</button></section>
    <section className="press-layout"><div className="press-map"><MapContainer center={[14.8,76.2]} zoom={7} scrollWheelZoom={false} style={{height:'100%',minHeight:420}}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {groups.map(g=>{const w=g.items.filter(splitWomen).length;const r=n=>3+Math.min(Math.sqrt(n)*1.8,22);const pop=<Popup><strong>{g.place?.[locale]||g.place?.kn}</strong><br/>{g.items.length} {kn?'ಪತ್ರಿಕೆಗಳು':'titles'}{w?` · ${w} ${kn?'ಮಹಿಳಾ ಸಂಪಾದಕರೊಂದಿಗೆ (ಅಂದಾಜು)':'with a woman editor (inferred)'}`:''}<ul className="press-pop">{g.items.slice(0,8).map(i=><li key={i.id}>{i.name[locale]||i.name.kn} {Number.isFinite(i.date?.from)?`(${i.date.from})`:''}</li>)}</ul>{g.items.length>8&&<small>+{g.items.length-8}</small>}</Popup>;return <span key={g.key}><CircleMarker center={g.coords} radius={r(g.items.length)} pathOptions={{color:'#2f5f9e',weight:1,fillColor:'#2f5f9e',fillOpacity:.35}}>{pop}</CircleMarker>{w>0&&<CircleMarker center={g.coords} radius={r(w)} pathOptions={{color:'#7a2f4d',weight:1,fillColor:'#a43d72',fillOpacity:.8}}>{pop}</CircleMarker>}</span>})}
    </MapContainer><small className="press-note">{kn?'ನೀಲಿ ವೃತ್ತ = ಪತ್ರಿಕೆಗಳ ಸಂಖ್ಯೆ; ಒಳಗಿನ ನೇರಳೆ ವೃತ್ತ = ಮಹಿಳಾ ಸಂಪಾದಕರಿರುವ ಪತ್ರಿಕೆಗಳು (ಅಂದಾಜು).':'Blue circle = number of titles; magenta circle inside = titles with a woman editor (inferred).'} {noLocation>0&&`${noLocation} ${kn?'ಪತ್ರಿಕೆಗಳಿಗೆ ಸ್ಥಳ ಇಲ್ಲ.':'titles have no place yet.'}`}</small></div>
      <aside className="press-side"><Bars data={stats.editors} kn={kn} title={kn?'ಸಂಪಾದಕರು (ವ್ಯಕ್ತಿಗಳು)':'Editors (people)'}/><Bars data={stats.publishers} kn={kn} title={kn?'ಪ್ರಕಾಶಕರು (ವ್ಯಕ್ತಿ/ಸಂಸ್ಥೆ)':'Publishers (people and bodies)'}/>
        {decades.length>0&&<div className="press-decades"><strong>{kn?'ದಶಕವಾರು ಸಂಪಾದಕತ್ವ':'Editorships by decade'}</strong><ul>{decades.filter(d=>stats.byDecade[d].woman).map(d=><li key={d}>{d}s <b>{stats.byDecade[d].woman}</b> {kn?'ಮಹಿಳೆ':'women'} / {stats.byDecade[d].man} {kn?'ಪುರುಷ':'men'}</li>)}</ul><small>{kn?'ಮಹಿಳಾ ಸಂಪಾದಕರಿರುವ ದಶಕಗಳು ಮಾತ್ರ.':'Only decades with a woman editor are listed.'}</small></div>}
        <p className="press-note">{kn?'ಅಂದಾಜು: ಪಟ್ಟಿಯಲ್ಲಿ ಲಿಂಗ ಇಲ್ಲ. ಹೆಸರಿನಿಂದ ಊಹಿಸಲಾಗಿದೆ; ಸಾಕಷ್ಟು ಹೆಸರುಗಳು "ಗುರುತಿಸಲಾಗಿಲ್ಲ". ತಪ್ಪುಗಳನ್ನು ತಿದ್ದಲು ಸಹಾಯ ಮಾಡಿ.':'The catalogue has no gender field, so these are guesses from names; many names stay “not told”. Please help correct them.'} <a href="#contribute">{kn?'ತಿದ್ದುಪಡಿ ಸೂಚಿಸಿ':'Suggest a correction'}</a></p></aside></section>
    <PressPeople locale={locale} showLink={false}/>
  </main>
}
function splitWomen(item){return pressPeople([item]).some(p=>p.editor.length&&p.gender==='woman')}
