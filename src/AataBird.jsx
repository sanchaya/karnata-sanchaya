import { useEffect, useMemo, useState } from 'react'
import { buildBirdRounds } from './aata-bird'
import { useProgress } from './aata-storage'
import { ResultPanel, CorrectionLink } from './AataExtras'

const copy={
  kn:{title:'ಯಾವ ಜೀವಿ?',intro:'ಫೋಟೋ ನೋಡಿ, ಸರಿಯಾದ ಕನ್ನಡ ಹೆಸರು ಆರಿಸಿ. ದಿನಕ್ಕೆ ಐದು ಜೀವಿಗಳು.',loading:'ಚಿತ್ರಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ…',failed:'ಜೀವಿ ದತ್ತಾಂಶ ಲೋಡ್ ಆಗಲಿಲ್ಲ.',few:'ಈ ಭಾಷೆಯಲ್ಲಿ ಆಟಕ್ಕೆ ಸಾಕಷ್ಟು ಹೆಸರುಗಳಿಲ್ಲ.',photo:'ಚಿತ್ರ',more:'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',note:'ಕನ್ನಡ ಹೆಸರುಗಳು ಇನ್ನೂ ಪರಿಶೀಲನೆಗೆ ಬಾಕಿ; ತಪ್ಪಿದ್ದರೆ ತಿಳಿಸಿ.'},
  en:{title:'Name that species',intro:'Look at the photo and pick the right name. Five species a day.',loading:'Loading photos…',failed:'The species data could not be loaded.',few:'Not enough names for this game in this language.',photo:'Photo',more:'Learn more',note:'Kannada names are still awaiting review; tell us if one looks wrong.'},
}

// Name that species: a Commons photo and four names from the same group, five rounds a day.
export default function BirdQuiz({locale,t,date}){
  const c=copy[locale]||copy.kn
  const [data,setData]=useState(null),[failed,setFailed]=useState(false)
  const [state,setState]=useProgress(`atlas-aata-bird:${locale}:${date}`,{picks:[]}),[review,setReview]=useState(null)
  useEffect(()=>{import('./species-data').then(setData).catch(()=>setFailed(true))},[])
  const rounds=useMemo(()=>data?buildBirdRounds(data.SPECIES,data.IMAGES,locale,date):[],[data,locale,date])
  if(failed)return <section className="aata-game-stage bird-game"><p className="aata-status">{c.failed}</p></section>
  if(!data)return <section className="aata-game-stage bird-game"><p className="aata-status">{c.loading}</p></section>
  if(!rounds.length)return <section className="aata-game-stage bird-game"><p className="aata-status">{c.few}</p></section>
  const total=rounds.length,picks=state.picks,done=picks.length>=total,index=Math.min(picks.length,total-1),round=rounds[index]
  const image=data.IMAGES[round.gbifKey],score=picks.filter((id,i)=>id===rounds[i]?.id).length
  const choose=id=>{if(review||done)return;setState({picks:[...picks,id]});setReview({correct:id===round.id})}
  return <section className="aata-game-stage bird-game">
    <header><div><p className="eyebrow">{t.daily}</p><h2>{c.title}</h2><p>{c.intro}</p></div><span className="aata-count">{Math.min(index+1,total)} / {total}</span></header>
    {(!done||review)&&<>
      <figure className="bird-photo"><img src={image.thumb} alt="" referrerPolicy="no-referrer"/><figcaption>{c.photo}: {image.author} · {image.license} · <a href={image.page} target="_blank" rel="noreferrer">Wikimedia Commons</a></figcaption></figure>
      <div className="who-options" role="group" aria-label={c.title}>{round.options.map(option=><button key={option.id} type="button" disabled={Boolean(review)} className={review&&option.id===round.id?'right':''} onClick={()=>choose(option.id)}>{option.name}</button>)}</div>
    </>}
    {review&&<p className="aata-status" aria-live="polite">{review.correct?`${t.correct} +1`:`${t.answerWas}: ${round.answer}`} · <i>{round.scientificName}</i></p>}
    {review&&<div className="aata-actions"><button type="button" onClick={()=>setReview(null)}>{done?t.seeSummary:`${t.nextPlace} →`}</button><a href={`?species=${round.id}#species`}>{c.more} →</a><CorrectionLink t={t}/></div>}
    {done&&!review&&<div className="where-summary"><h3>{score} / {total}</h3><ol>{rounds.map((item,i)=><li key={item.id}><b>{item.answer}</b> <span>{picks[i]===item.id?'✓':'✗'}</span></li>)}</ol></div>}
    <p className="aata-source-note">{c.note}</p>
    <ResultPanel game="bird" date={date} done={done} won={score>=3} shareText={()=>`${t.title} · ${c.title} ${date}\n${rounds.map((r,i)=>picks[i]===r.id?'🟩':'🟥').join('')} ${score}/${total}\n${t.challenge}\n${window.location.href}`} t={t}/>
  </section>
}
