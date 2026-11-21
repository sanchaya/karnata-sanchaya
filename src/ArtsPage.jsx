import { useState } from 'react'
import { copy, Row, Toolbar, searchable } from './RecreationPage'
import { oldGames } from './data/old-games'

const words={
  kn:{eyebrow:'ಅನುಭವ · ಕಲೆ',title:'ಕರ್ನಾಟಕದ ಜನಪದ ಕಲೆಗಳು',intro:'ಕಂಸಾಳೆ, ಗೊರವರ ಕುಣಿತ, ವೀರಗಾಸೆ, ತಮಟೆ, ಗೊಂಬೆಯಾಟ ಮುಂತಾದ ಪ್ರದರ್ಶನ ಕಲೆಗಳು. ಪ್ರತಿ ಸಾಲಿನಲ್ಲಿ ಆಕರವನ್ನು ಓದಲಾಗಿದೆಯೇ ಎಂದು ತೋರಿಸಿದ್ದೇವೆ. ಇದು ಆರಂಭ: ಜಾನಪದ ಕರಕುಶಲ, ಸಂಗೀತ ಮತ್ತು ನೃತ್ಯ ಆಕರ ಸಿಕ್ಕಂತೆ ಇಲ್ಲಿಗೆ ಸೇರುತ್ತವೆ.',add:'ಒಂದು ಕಲೆಯನ್ನು ಸೇರಿಸಿ'},
  en:{eyebrow:'Experience · Arts',title:'Folk arts of Karnataka',intro:'Performing arts such as kamsale, gorava kunita, veeragase, tamate and puppet shows. Every row says whether its source has actually been read. This is a start: crafts, music and dance will join as sources are read.',add:'Add an art'}
}
export default function ArtsPage({locale='kn'}){
  const base=copy[locale]||copy.kn,t={...base,search:locale==='kn'?'ಹುಡುಕಿ: ಕಲೆಯ ಹೆಸರು, ಊರು…':'Search: art, place…'},w=words[locale]||words.kn,[query,setQuery]=useState(''),[status,setStatus]=useState('all')
  const pool=oldGames.filter(g=>g.kind==='perform'),q=query.trim().toLowerCase()
  const list=pool.filter(g=>(status==='all'||g.status===status)&&(!q||searchable(g).includes(q)))
  const contribute=`${window.location.pathname}?contributeType=culturalHeritage&contributeAction=create#contribute`
  return <main className="portal-page recreation-page" id="kale">
    <section className="recreation-hero explore-hero"><div><p className="eyebrow">{w.eyebrow}</p><h1>{w.title}</h1><p>{w.intro}</p>{locale==='kn'&&<small>{t.review}</small>}</div><a className="recreation-button" href={contribute}>{w.add}</a></section>
    <Toolbar t={t} query={query} setQuery={setQuery} status={status} setStatus={setStatus} kinds={null} kind="all" setKind={()=>{}} shown={list.length} total={pool.length}/>
    {list.length?<div className="rec-list">{list.map(game=><Row key={game.id} game={game} t={t} locale={locale}/>)}</div>:<p className="recreation-note">{t.none}</p>}
  </main>
}
