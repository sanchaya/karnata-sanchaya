import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMapEvents } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { currentStreak, emptyStats, recordResult } from './aata-stats'
import { buildWhereRounds, haversineKm, roundScore, whereShareText } from './aata-where'
import { today, useProgress } from './aata-storage'
import { DYNASTY_PHASES } from './data/dynasty-areas'
import { buildWhoRounds, whoPoints } from './aata-who'
import { buildScriptRounds, SCRIPT_STYLES } from './aata-script'
import './script-fonts.css'

const copyText=async text=>{try{await navigator.clipboard.writeText(text);return true}catch{return false}}

// Played / won / streak for one game, plus the share button. `weekly` games keep totals but no streak.
export function ResultPanel({game,date,done,won,shareText,weekly=false,t}){
  const [stats,setStats]=useProgress(`atlas-aata-stats:${game}`,emptyStats()),[copied,setCopied]=useState(false)
  useEffect(()=>{if(done)setStats(current=>recordResult(current,date,won,weekly?null:today()))},[done,won,date,weekly,setStats])
  const share=async()=>{setCopied(await copyText(shareText()));window.setTimeout(()=>setCopied(false),1800)}
  return <aside className="aata-result" aria-label={t.stats}>
    <dl><div><dt>{t.played}</dt><dd>{stats.played}</dd></div><div><dt>{t.wins}</dt><dd>{stats.won}</dd></div>{!weekly&&<><div><dt>{t.streak}</dt><dd>{currentStreak(stats,today())}</dd></div><div><dt>{t.best}</dt><dd>{stats.best}</dd></div></>}</dl>
    {done&&<button type="button" onClick={share}>{copied?t.shared:t.shareResult}</button>}
  </aside>
}

function Pin({onPick,disabled}){useMapEvents({click:event=>{if(!disabled)onPick([event.latlng.lat,event.latlng.lng])}});return null}

// Where is it?: five atlas places a day; drop a pin, score by distance, then see what happened there.
export function WhereIsIt({locale,t,date}){
  const rounds=buildWhereRounds(atlasData,locale,date),total=rounds.length
  const [guesses,setGuesses]=useProgress(`atlas-aata-where:${locale}:${date}`,[])
  const [pick,setPick]=useState(null),[review,setReview]=useState(false)
  const done=guesses.length>=total,index=review?guesses.length-1:Math.min(guesses.length,total-1),round=rounds[index]
  const kms=guesses.map((guess,i)=>haversineKm(guess,rounds[i].coords)),score=kms.reduce((sum,km)=>sum+roundScore(km),0)
  const confirm=()=>{if(!pick)return;setGuesses(current=>[...current,pick]);setPick(null);setReview(true)}
  const next=()=>setReview(false)
  const showAnswer=review||done
  const guess=showAnswer?guesses[index]:pick
  return <section className="aata-game-stage where-game">
    <header><div><p className="eyebrow">{t.daily}</p><h2>{t.where}</h2><p>{t.whereIntro}</p></div><span className="aata-count">{Math.min(index+1,total)} / {total}</span></header>
    <div className="where-clue"><strong>{round.name}</strong><span>{round.clue}</span></div>
    <div className="where-map"><MapContainer center={[14.7,76.2]} zoom={6.3} minZoom={5} zoomSnap={0.25} aria-label={t.where}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <Pin onPick={setPick} disabled={showAnswer}/>
      {guess&&<CircleMarker center={guess} radius={8} pathOptions={{color:'#fff',weight:2,fillColor:'#4361ee',fillOpacity:1}}><Tooltip>{t.yourPin}</Tooltip></CircleMarker>}
      {showAnswer&&<><CircleMarker center={round.coords} radius={9} pathOptions={{color:'#fff',weight:2,fillColor:'#2a9d5c',fillOpacity:1}}><Tooltip permanent>{round.name}</Tooltip></CircleMarker>{guess&&<Polyline positions={[guess,round.coords]} pathOptions={{color:'#2b2118',weight:2,dashArray:'5 5'}}/>}</>}
    </MapContainer></div>
    <div className="aata-actions">
      {!showAnswer&&<button type="button" onClick={confirm} disabled={!pick}>{pick?t.confirmPin:t.dropPin}</button>}
      {review&&!done&&<button type="button" onClick={next}>{t.nextPlace} →</button>}
      {review&&done&&<button type="button" onClick={next}>{t.seeSummary}</button>}
    </div>
    {showAnswer&&guesses[index]&&<p className="aata-status" aria-live="polite">{Math.round(kms[index])} km · {roundScore(kms[index])} / 1000 <small>{round.review&&round.review!=='reviewed'?`· ${t.needsReview}`:''}</small></p>}
    {showAnswer&&<CorrectionLink t={t}/>}
    {done&&!review&&<div className="where-summary"><h3>{score} / {total*1000}</h3><ol>{rounds.map((item,i)=><li key={item.id}><b>{item.name}</b> <span>{Math.round(kms[i])} km</span></li>)}</ol></div>}
    <ResultPanel game="where" date={date} done={done} won shareText={()=>whereShareText({title:`${t.title} · ${t.where}`,date,kms,url:`${t.challenge}\n${window.location.href}`})} t={t}/>
  </section>
}

export const CorrectionLink=({t})=><a className="aata-correct-link" href="#contribute">{t.spotMistake} →</a>

// Who am I?: a dynasty described by up to four clues. A wrong answer is struck out and the next clue opens.
export function WhoAmI({locale,t,date}){
  const rounds=buildWhoRounds(DYNASTY_PHASES,atlasData,locale,date),total=rounds.length
  const [state,setState]=useProgress(`atlas-aata-who:${locale}:${date}`,{points:[],wrong:[]}),[review,setReview]=useState(null)
  const done=state.points.length>=total,index=review?state.points.length-1:Math.min(state.points.length,total-1),round=rounds[index],score=state.points.reduce((sum,value)=>sum+value,0)
  const shown=review?round.clues.length:Math.min(round.clues.length,state.wrong.length+1)
  const choose=id=>{
    if(review||done)return
    if(id===round.id){const points=whoPoints(state.wrong.length+1);setState({points:[...state.points,points],wrong:[]});setReview({correct:true,points});return}
    const wrong=[...state.wrong,id]
    if(wrong.length>=round.clues.length){setState({points:[...state.points,0],wrong:[]});setReview({correct:false,points:0})}else setState({...state,wrong})
  }
  const next=()=>setReview(null)
  return <section className="aata-game-stage who-game">
    <header><div><p className="eyebrow">{t.daily}</p><h2>{t.who}</h2><p>{t.whoIntro}</p></div><span className="aata-count">{Math.min(index+1,total)} / {total}</span></header>
    {!done||review?<><ol className="who-clues">{round.clues.slice(0,shown).map((clue,i)=><li key={i}>{clue}</li>)}</ol>
      <div className="who-options" role="group" aria-label={t.who}>{round.options.map(option=><button key={option.id} type="button" disabled={Boolean(review)||state.wrong.includes(option.id)} className={review&&option.id===round.id?'right':''} onClick={()=>choose(option.id)}>{option.name}</button>)}</div></>:null}
    {review&&<p className="aata-status" aria-live="polite">{review.correct?`${t.correct} +${review.points}`:`${t.answerWas}: ${round.name}`}</p>}
    {review&&<div className="aata-actions"><button type="button" onClick={next}>{done?t.seeSummary:`${t.nextPlace} →`}</button><a href="#dynasties">{t.learnMore} →</a><CorrectionLink t={t}/></div>}
    {done&&!review&&<div className="where-summary"><h3>{score} / {total*4}</h3><ol>{rounds.map((item,i)=><li key={item.id}><b>{item.name}</b> <span>+{state.points[i]}</span></li>)}</ol></div>}
    <ResultPanel game="who" date={date} done={done} won shareText={()=>`${t.title} · ${t.who} ${date}\n${state.points.map(points=>points>=3?'🟩':points>=1?'🟨':'🟥').join('')} ${score}/${total*4}\n${t.challenge}\n${window.location.href}`} t={t}/>
  </section>
}

// Script detective: a Kannada word set in one era typeface; which style is it?
export function ScriptDetective({locale,t,date,catalogKn}){
  const rounds=buildScriptRounds(catalogKn,date),total=rounds.length
  const [answers,setAnswers]=useProgress(`atlas-aata-script:${date}`,[]),[review,setReview]=useState(false)
  const done=answers.length>=total,index=review?answers.length-1:Math.min(answers.length,total-1),round=rounds[index]
  const right=answers.filter((id,i)=>id===rounds[i]?.style.id).length
  const choose=id=>{if(review||done)return;setAnswers(current=>[...current,id]);setReview(true)}
  return <section className="aata-game-stage script-game">
    <header><div><p className="eyebrow">{t.daily}</p><h2>{t.script}</h2><p>{t.scriptIntro}</p></div><span className="aata-count">{Math.min(index+1,total)} / {total}</span></header>
    <p className="script-word" style={{fontFamily:`"${round.style.family}", serif`}} lang="kn">{round.word}</p>
    <div className="who-options" role="group" aria-label={t.script}>{SCRIPT_STYLES.map(style=><button key={style.id} type="button" disabled={review||done} className={review&&style.id===round.style.id?'right':review&&answers[index]===style.id?'wrong':''} onClick={()=>choose(style.id)}>{style.name[locale]}</button>)}</div>
    {review&&<p className="aata-status" aria-live="polite">{answers[index]===round.style.id?t.correct:t.tryAgain} {round.style.name[locale]} · {round.style.note[locale]}</p>}
    {review&&<div className="aata-actions"><button type="button" onClick={()=>setReview(false)}>{done?t.seeSummary:`${t.nextPlace} →`}</button><a href="#scripts">{t.learnMore} →</a></div>}
    {done&&!review&&<div className="where-summary"><h3>{right} / {total}</h3><p>{t.scriptNote}</p></div>}
    <ResultPanel game="script" date={date} done={done} won shareText={()=>`${t.title} · ${t.script} ${date}\n${answers.map((id,i)=>id===rounds[i].style.id?'🟩':'🟥').join('')} ${right}/${total}\n${t.challenge}\n${window.location.href}`} t={t}/>
  </section>
}

// A printable sheet of the day's places, dynasties and scripts, with the answers on a second page, for a classroom.
export function Worksheet({locale,t,date,catalogKn}){
  const where=buildWhereRounds(atlasData,locale,date),who=buildWhoRounds(DYNASTY_PHASES,atlasData,locale,date),script=buildScriptRounds(catalogKn,date)
  return <section className="aata-game-stage aata-worksheet">
    <header className="aata-worksheet-head"><div><p className="eyebrow">{t.daily}</p><h2>{t.worksheet}</h2><p>{t.worksheetIntro}</p></div><button type="button" className="aata-print" onClick={()=>window.print()}>{t.print}</button></header>
    <h3>{t.name}: ________________ {t.date}: {date}</h3>
    <h3>1. {t.where}</h3><ol>{where.map(item=><li key={item.id}><b>{item.name}</b> — {item.clue}<br/>{t.district}: ________________</li>)}</ol>
    <h3>2. {t.who}</h3><ol>{who.map(item=><li key={item.id}>{item.clues.slice(0,3).join(' · ')}<br/>{t.answerWas}: ________________</li>)}</ol>
    <h3>3. {t.script}</h3><ol>{script.map(item=><li key={item.id}><span className="script-word-small" style={{fontFamily:`"${item.style.family}", serif`}} lang="kn">{item.word}</span> {t.styleBlank}: ________________</li>)}</ol>
    <div className="aata-worksheet-key"><h3>{t.answerKey}</h3>
      <p><b>1.</b> {where.map(item=>`${item.name} (${item.coords.map(value=>value.toFixed(2)).join(', ')})`).join(' · ')}</p>
      <p><b>2.</b> {who.map(item=>item.name).join(' · ')}</p>
      <p><b>3.</b> {script.map(item=>`${item.word}: ${item.style.name[locale]}`).join(' · ')}</p></div>
    <p className="aata-worksheet-foot">{t.title} · {window.location.origin}{window.location.pathname}#aata-paata</p>
  </section>
}
