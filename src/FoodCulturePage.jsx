import { useState } from 'react'
import { foodEntries, foodPlaces } from './data/food-culture'
import { copy, text, Row, Toolbar, GamesMap } from './RecreationPage'
import './recreation.css'

const own={
  kn:{eyebrow:'ಅನ್ವೇಷಣೆ · ಆಹಾರ ಸಂಸ್ಕೃತಿ',title:'ಕರ್ನಾಟಕದ ಆಹಾರ ಸಂಸ್ಕೃತಿ',intro:'ಹನ್ನೆರಡನೇ ಶತಮಾನದ ಕಲ್ಯಾಣದ ಅಡುಗೆ ಪಾಠದಿಂದ ಇಂದಿನ ರಾಗಿ ಮುದ್ದೆ, ಜಾತ್ರೆಯ ಊಟ ಮತ್ತು ಕಾಡಿನ ಆಹಾರದವರೆಗೆ. ಸಂಶೋಧನೆಯ ಆರಂಭದ ಪಟ್ಟಿ: ಪ್ರತಿ ಸಾಲಿನಲ್ಲಿ ಆಕರವನ್ನು ಓದಲಾಗಿದೆಯೇ ಇಲ್ಲವೇ ಎಂದು ತೋರಿಸಿದ್ದೇವೆ.',
    tabs:{recipe:'ಹಳೆಯ ಅಡುಗೆ',staple:'ದಿನನಿತ್ಯದ ಊಟ',ritual:'ಹಬ್ಬ ಮತ್ತು ಆಚರಣೆ',forest:'ಕಾಡು ಮತ್ತು ಸಮುದಾಯ',map:'ನಕ್ಷೆ',pointer:'ಓದಬೇಕಾದವು'},
    add:'ನಿಮ್ಮ ಊರಿನ ಅಡುಗೆ ಸೇರಿಸಿ',search:'ಹುಡುಕಿ: ಅಡುಗೆ, ಊರು…',helpNote:'ಸೂಚನೆ: ಹಳ್ಳಿಯ ಅಡುಗೆ ಮತ್ತು ಹಬ್ಬದ ಊಟದ ಮಾಹಿತಿಗೆ ಮೌಖಿಕ ಆಕರ (ಹೇಳಿದವರ ಒಪ್ಪಿಗೆ ಮತ್ತು ವಯಸ್ಸಿನೊಂದಿಗೆ) ಸೇರಿಸಬಹುದು.'},
  en:{eyebrow:'Explore · Food culture',title:'Food culture of Karnataka',intro:'From a twelfth-century cookery text written at Kalyani to today’s ragi mudde, fair-day meals and forest foods. This is an early research list: every row says whether its source has actually been read.',
    tabs:{recipe:'Old recipes',staple:'Daily food',ritual:'Festival and ritual',forest:'Forest and community',map:'Map',pointer:'To read next'},
    add:'Add a food from your place',search:'Search: dish, place…',helpNote:'Tip: village recipes and festival meals can be added with an oral-testimony source (with the teller’s consent and age).'}
}
export default function FoodCulturePage({locale='kn'}){
  const t={...(copy[locale]||copy.kn),...(own[locale]||own.kn)},[tab,setTab]=useState('recipe'),[query,setQuery]=useState(''),[status,setStatus]=useState('all')
  const q=query.trim().toLowerCase()
  const pool=foodEntries.filter(entry=>entry.kind===tab)
  const list=pool.filter(entry=>(status==='all'||entry.status===status)&&(!q||[entry.name.en,entry.name.kn,entry.places.en,entry.note.en].join(' ').toLowerCase().includes(q)))
  const counts=Object.fromEntries(Object.keys(own.en.tabs).filter(key=>key!=='map').map(key=>[key,foodEntries.filter(entry=>entry.kind===key).length]))
  const go=key=>{setTab(key);setQuery('');setStatus('all')}
  const contribute=`${window.location.pathname}?contributeType=culturalHeritage&contributeAction=create#contribute`
  return <main className="portal-page recreation-page" id="food">
    <section className="recreation-hero explore-hero"><div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p>{locale==='kn'&&<small>{t.review}</small>}</div><a className="recreation-button" href={contribute}>{t.add}</a></section>
    <nav className="recreation-tabs" role="tablist" aria-label={t.title}>{Object.entries(t.tabs).map(([key,label])=><button key={key} type="button" role="tab" aria-selected={tab===key} className={tab===key?'active':''} onClick={()=>go(key)}>{label}{counts[key]!==undefined&&<b>{counts[key]}</b>}</button>)}</nav>
    {tab==='map'?<GamesMap t={t} locale={locale} places={foodPlaces}/>:<>
      <Toolbar t={t} query={query} setQuery={setQuery} status={status} setStatus={setStatus} kinds={null} kind="all" setKind={()=>{}} shown={list.length} total={pool.length}/>
      {list.length?<div className="rec-list">{list.map(entry=><Row key={entry.id} game={entry} t={t} locale={locale}/>)}</div>:<p className="recreation-note">{t.none}</p>}
      <p className="recreation-note">{t.helpNote}</p>
    </>}
  </main>
}
