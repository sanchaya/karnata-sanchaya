import { useEffect, useMemo, useState } from 'react'
import { buildBirdRounds, quizTitle, roundQuestion, SPECIES_TYPES } from './aata-bird'
import { useProgress } from './aata-storage'
import { ResultPanel, CorrectionLink } from './AataExtras'
import { JoinCallout } from './JoinPrompt'

const copy={
  kn:{intro:'ಫೋಟೋ ನೋಡಿ, ಸರಿಯಾದ ಕನ್ನಡ ಹೆಸರು ಆರಿಸಿ. ದಿನಕ್ಕೆ ಐದು ಪ್ರಶ್ನೆಗಳು.',all:'ಎಲ್ಲ',type:'ವಿಧ',loading:'ಚಿತ್ರಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ…',failed:'ಜೀವಿ ದತ್ತಾಂಶ ಲೋಡ್ ಆಗಲಿಲ್ಲ.',few:'ಈ ಭಾಷೆಯಲ್ಲಿ ಆಟಕ್ಕೆ ಸಾಕಷ್ಟು ಹೆಸರುಗಳಿಲ್ಲ.',photo:'ಚಿತ್ರ',more:'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',note:'ಕನ್ನಡ ಹೆಸರುಗಳು ಇನ್ನೂ ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ; ತಪ್ಪಿದ್ದರೆ ತಿಳಿಸಿ.'},
  en:{intro:'Look at the photo and pick the right name. Five questions a day.',all:'All',type:'Type',loading:'Loading photos…',failed:'The species data could not be loaded.',few:'Not enough names for this game in this language.',photo:'Photo',more:'Learn more',note:'Kannada names are still awaiting review; tell us if one looks wrong.'},
}

const TYPE_ORDER=['bird','mammal','reptile','amphibian','insect','plant']
const typeLabel=(group,locale)=>group?(SPECIES_TYPES[group][locale==='kn'?'kn':'en']):''
const initialType=()=>{try{const v=new URLSearchParams(window.location.search).get('quiz');return SPECIES_TYPES[v]?v:''}catch{return ''}}

// Name that species: a Commons photo and four names from the same group, five rounds a day. The reader can keep to one
// type (birds, plants...) and then every title and question says that word instead of "species".
export default function BirdQuiz({locale,t,date}){
  const c=copy[locale]||copy.kn
  const [data,setData]=useState(null),[failed,setFailed]=useState(false),[group,setGroup]=useState(initialType)
  useEffect(()=>{import('./species-data').then(setData).catch(()=>setFailed(true))},[])
  const available=useMemo(()=>data?TYPE_ORDER.filter(g=>{const r=buildBirdRounds(data.SPECIES,data.IMAGES,locale,date,5,g);return r.length>=3&&r.every(x=>x.options.length===4)}):[],[data,locale,date])
  if(failed)return <section className="aata-game-stage bird-game"><p className="aata-status">{c.failed}</p></section>
  if(!data)return <section className="aata-game-stage bird-game"><p className="aata-status">{c.loading}</p></section>
  const active=available.includes(group)?group:''
  return <>
    <nav className="bird-types" aria-label={c.type}><button type="button" className={!active?'active':''} aria-pressed={!active} onClick={()=>setGroup('')}>{c.all}</button>{available.map(g=><button type="button" key={g} className={active===g?'active':''} aria-pressed={active===g} onClick={()=>setGroup(g)}>{typeLabel(g,locale)}</button>)}</nav>
    <BirdGame key={active} data={data} group={active} locale={locale} t={t} date={date} c={c}/>
  </>
}

function BirdGame({data,group,locale,t,date,c}){
  const title=quizTitle(group,locale)
  const [state,setState]=useProgress(`atlas-aata-bird:${locale}:${date}${group?`:${group}`:''}`,{picks:[]}),[review,setReview]=useState(null)
  const rounds=useMemo(()=>buildBirdRounds(data.SPECIES,data.IMAGES,locale,date,5,group),[data,locale,date,group])
  if(!rounds.length)return <section className="aata-game-stage bird-game"><p className="aata-status">{c.few}</p></section>
  const total=rounds.length,picks=state.picks,done=picks.length>=total,index=Math.min(picks.length,total-1),round=rounds[index]
  const image=data.IMAGES[round.gbifKey],score=picks.filter((id,i)=>id===rounds[i]?.id).length
  const choose=id=>{if(review||done)return;setState({picks:[...picks,id]});setReview({correct:id===round.id})}
  return <section className="aata-game-stage bird-game">
    <header><div><p className="eyebrow">{t.daily}</p><h2>{title}</h2><p>{c.intro}</p></div><span className="aata-count">{Math.min(index+1,total)} / {total}</span></header>
    {(!done||review)&&<>
      <figure className="bird-photo"><img src={image.thumb} alt="" referrerPolicy="no-referrer"/><figcaption>{c.photo}: {image.author} · {image.license} · <a href={image.page} target="_blank" rel="noreferrer">Wikimedia Commons</a></figcaption></figure>
      <p className="bird-question">{roundQuestion(round.group,locale)}</p>
      <div className="who-options" role="group" aria-label={roundQuestion(round.group,locale)}>{round.options.map(option=><button key={option.id} type="button" disabled={Boolean(review)} className={review&&option.id===round.id?'right':''} onClick={()=>choose(option.id)}>{option.name}</button>)}</div>
    </>}
    {review&&<p className="aata-status" aria-live="polite">{review.correct?`${t.correct} +1`:`${t.answerWas}: ${round.answer}`} · <i>{round.scientificName}</i></p>}
    {review&&<div className="aata-actions"><button type="button" onClick={()=>setReview(null)}>{done?t.seeSummary:`${t.nextPlace} →`}</button><a href={`?species=${round.id}#species`}>{c.more} →</a><CorrectionLink t={t}/></div>}
    {done&&!review&&<div className="where-summary"><h3>{score} / {total}</h3><ol>{rounds.map((item,i)=><li key={item.id}><b>{item.answer}</b> <span>{picks[i]===item.id?'✓':'✗'}</span></li>)}</ol></div>}
    {done&&!review&&<JoinCallout locale={locale} text={locale==='kn'?'ಕನ್ನಡ ಹೆಸರು ತಪ್ಪಿದ್ದರೆ ನೀವೇ ತಿದ್ದಿ: ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ.':'Spot a wrong Kannada name? Open a free account and fix it.'}/>}
    <p className="aata-source-note">{c.note}</p>
    <ResultPanel game={group?`bird-${group}`:'bird'} date={date} done={done} won={score>=3} shareText={()=>`${t.title} · ${title} ${date}\n${rounds.map((r,i)=>picks[i]===r.id?'🟩':'🟥').join('')} ${score}/${total}\n${t.challenge}\n${window.location.href}`} t={t}/>
  </section>
}
