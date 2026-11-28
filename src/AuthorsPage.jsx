import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { AUTHOR_ROLES, kannadaAuthors } from './data/kannada-authors'
import './authors.css'

const copy={
  kn:{
    eyebrow:'ಸಾಹಿತ್ಯ',title:'ಕನ್ನಡದ ಕವಿ–ಲೇಖಕರು: ಅವರ ಕೃತಿ ಮತ್ತು ಜನ್ಮಸ್ಥಳ',
    intro:'ಕನ್ನಡದ ಕವಿ, ಕವಯಿತ್ರಿ, ಲೇಖಕ, ಲೇಖಕಿಯರು, ಅವರ ಪ್ರಮುಖ ಕೃತಿಗಳು ಮತ್ತು ಹುಟ್ಟಿದ ಊರುಗಳು. ಮಹಿಳಾ ಬರಹಗಾರರು ನೇರಳೆ ಬಣ್ಣದಲ್ಲಿ ಎದ್ದು ಕಾಣುತ್ತಾರೆ.',
    all:'ಎಲ್ಲರೂ',women:'ಮಹಿಳೆಯರು',men:'ಪುರುಷರು',eraAll:'ಎಲ್ಲ ಕಾಲ',medieval:'೧೯ನೇ ಶತಮಾನದ ಮೊದಲು',modern:'ಆಧುನಿಕ',search:'ಹೆಸರು, ಕೃತಿ, ಊರು…',
    works:'ಕೃತಿಗಳು',born:'ಜನ್ಮಸ್ಥಳ',lived:'ಕಾಲ',showMap:'ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಿ',sources:'ಆಕರ',authors:'ಲೇಖಕರು',womenCount:'ಮಹಿಳೆಯರು',menCount:'ಪುರುಷರು',
    precision:{place:'ಊರು',district:'ಜಿಲ್ಲೆಯ ಕೇಂದ್ರ',disputed:'ವಿವಾದ ಅಥವಾ ಅನಿಶ್ಚಿತ'},
    legend:'ನೇರಳೆ ವೃತ್ತ = ಮಹಿಳೆ; ನೀಲಿ ವೃತ್ತ = ಪುರುಷ; ಹಾಲೋ = ಜಿಲ್ಲೆ ಅಥವಾ ಅನಿಶ್ಚಿತ ಸ್ಥಳ.',
    none:'ಈ ಆಯ್ಕೆಗೆ ಯಾರೂ ಸಿಗಲಿಲ್ಲ.',
    note:'ಇದು ಪ್ರಾರಂಭಿಕ ಆಯ್ದ ಪಟ್ಟಿ, ಎಲ್ಲರ ಪಟ್ಟಿ ಅಲ್ಲ; ಮಹಿಳೆಯರ ಸಂಖ್ಯೆ ಕಡಿಮೆ ಇರುವುದು ಲೇಖಕಿಯರ ಕೊರತೆಯಿಂದಲ್ಲ, ಆಕರಗಳು ಸಿಕ್ಕ ಹೆಸರುಗಳಷ್ಟೇ ಇಲ್ಲಿವೆ. ಕೃತಿಗಳು ಆಕರ ಪುಟಗಳಲ್ಲಿ ಹೆಸರಿಸಿದವು, ಪೂರ್ಣ ಪಟ್ಟಿ ಅಲ್ಲ. ವಿಕಿಪೀಡಿಯಾ ಮತ್ತು ವಿಕಿಡೇಟಾ ಆಧಾರ; ಪರಿಶೀಲನೆ ಬಾಕಿ. ಕನ್ನಡ ಪಠ್ಯ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಬಾಕಿ.',
    add:'ಬಿಟ್ಟುಹೋದ ಲೇಖಕರನ್ನು ಸೂಚಿಸಿ',
  },
  en:{
    eyebrow:'Literature',title:'Kannada poets and writers: their works and birthplaces',
    intro:'Kannada poets and writers, men and women, with their best-known works and where they were born. Women writers are highlighted in purple.',
    all:'Everyone',women:'Women',men:'Men',eraAll:'All periods',medieval:'Before the 19th century',modern:'Modern',search:'Name, work, place…',
    works:'Works',born:'Born',lived:'Lived',showMap:'Show on map',sources:'Sources',authors:'writers',womenCount:'women',menCount:'men',
    precision:{place:'Town or village',district:'Centre of the district',disputed:'Disputed or uncertain'},
    legend:'Purple circle = woman; blue circle = man; a halo = district centre or an uncertain place.',
    none:'Nobody matches this choice.',
    note:'This is a first, selected list, not a complete one. Women are fewer here because the list holds the names with a source found so far, not because there are fewer women writers. Works are those named on the cited pages, not full bibliographies. Based on Wikipedia and Wikidata and not yet reviewed. The Kannada text needs a native proofread.',
    add:'Suggest a writer we missed',
  },
}
const text=(value,locale)=>value?.[locale]||value?.kn||value?.en||''
const years=(a)=>a.born||a.died?`${a.born||'?'}–${a.died||''}`:''
const COLOR={female:'#a43d72',male:'#2f5f9e'}

function Focus({target}){
  const map=useMap()
  if(target)map.flyTo([target.birth.lat,target.birth.lng],Math.max(map.getZoom(),8),{duration:.6})
  return null
}

export default function AuthorsPage({locale='kn'}){
  const t=copy[locale]||copy.kn,kn=locale==='kn'
  const [gender,setGender]=useState('all'),[era,setEra]=useState('all'),[query,setQuery]=useState(''),[focusId,setFocusId]=useState(null)
  const rows=useMemo(()=>{
    const needle=query.trim().toLowerCase()
    return kannadaAuthors.filter(a=>(gender==='all'||a.gender===(gender==='women'?'female':'male'))
      &&(era==='all'||(era==='medieval'?(a.born||0)<1800:(a.born||0)>=1800))
      &&(!needle||JSON.stringify([a.name,a.birth.place,a.birth.district,a.works]).toLowerCase().includes(needle)))
      .sort((a,b)=>(a.born??a.sortYear??0)-(b.born??b.sortYear??0))
  },[gender,era,query])
  const focus=rows.find(a=>a.id===focusId)||null
  const womenN=kannadaAuthors.filter(a=>a.gender==='female').length,menN=kannadaAuthors.length-womenN
  return <main className="portal-page authors-page" id="authors">
    <section className="authors-hero explore-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div>
      <div className="authors-stats"><span><b>{kannadaAuthors.length}</b>{t.authors}</span><span className="w"><b>{womenN}</b>{t.womenCount}</span><span><b>{menN}</b>{t.menCount}</span></div></section>
    <section className="authors-filters">
      <div className="authors-chips" role="group" aria-label={t.all}>{[['all',t.all],['women',t.women],['men',t.men]].map(([key,label])=><button key={key} type="button" className={`${gender===key?'on':''} ${key==='women'?'women':''}`} aria-pressed={gender===key} onClick={()=>setGender(key)}>{label}{key==='women'&&' ♀'}</button>)}</div>
      <div className="authors-chips" role="group" aria-label={t.eraAll}>{[['all',t.eraAll],['medieval',t.medieval],['modern',t.modern]].map(([key,label])=><button key={key} type="button" className={era===key?'on':''} aria-pressed={era===key} onClick={()=>setEra(key)}>{label}</button>)}</div>
      <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>
    </section>
    <section className="authors-layout">
      <div className="authors-map"><MapContainer center={[14.8,76.2]} zoom={7} scrollWheelZoom={false} style={{height:'100%',minHeight:420}}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <Focus target={focus}/>
        {rows.map(a=>{const uncertain=a.birth.precision!=='place';const sel=a.id===focusId;return <CircleMarker key={a.id} center={[a.birth.lat,a.birth.lng]} radius={sel?11:a.gender==='female'?8:6} pathOptions={{color:uncertain?'#c98f1a':'#fff',weight:uncertain?3:1.5,fillColor:COLOR[a.gender],fillOpacity:.9}} eventHandlers={{click:()=>setFocusId(a.id)}}>
          <Popup><strong>{text(a.name,locale)}</strong><br/>{text(a.birth.place,locale)}<br/><small>{a.works.slice(0,3).map(x=>(kn?x.kn:null)||x.en).join(' · ')}</small></Popup></CircleMarker>})}
      </MapContainer><small className="press-note">{t.legend}</small></div>
      <ol className="authors-list">{rows.length===0&&<li className="authors-empty">{t.none}</li>}{rows.map(a=><li key={a.id} className={`author-card ${a.gender} ${a.id===focusId?'focus':''}`}>
        <div className="author-head"><strong>{text(a.name,locale)}</strong>{kn&&<span className="author-en">{a.name.en}</span>}<span className={`author-gender ${a.gender}`}>{a.gender==='female'?(kn?'ಮಹಿಳೆ ♀':'Woman ♀'):(kn?'ಪುರುಷ':'Man')}</span></div>
        <p className="author-meta">{a.role.map(r=>text(AUTHOR_ROLES[r],locale)).join(' · ')}{years(a)&&` · ${years(a)}`}</p>
        <p className="author-born"><b>{t.born}:</b> {text(a.birth.place,locale)}, {text(a.birth.district,locale)} <span className={`author-prec ${a.birth.precision}`}>{t.precision[a.birth.precision]}</span></p>
        {a.birth.doubt&&<p className="author-doubt">{text(a.birth.doubt,locale)}</p>}
        <p className="author-works"><b>{t.works}:</b> {a.works.map((x,i)=><span key={i}>{(kn&&x.kn)||x.en}{x.year?` (${x.year})`:''}{i<a.works.length-1?' · ':''}</span>)}</p>
        {a.note&&<p className="author-note">{text(a.note,locale)}</p>}
        <div className="author-actions"><button type="button" onClick={()=>setFocusId(a.id)}>📍 {t.showMap}</button>
          <details><summary>{t.sources}</summary><ul>{a.evidence.map((e,i)=><li key={i}>{e.title} · <em>{e.locator}</em></li>)}</ul></details></div>
      </li>)}</ol>
    </section>
    <p className="press-note authors-foot">{t.note} <a href="#contribute">{t.add} →</a></p>
  </main>
}
