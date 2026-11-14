import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMapEvents } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { currentStreak, emptyStats, recordResult } from './aata-stats'
import { buildWhereRounds, haversineKm, roundScore, whereShareText } from './aata-where'
import { today, useProgress } from './aata-storage'

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
    {done&&!review&&<div className="where-summary"><h3>{score} / {total*1000}</h3><ol>{rounds.map((item,i)=><li key={item.id}><b>{item.name}</b> <span>{Math.round(kms[i])} km</span></li>)}</ol></div>}
    <ResultPanel game="where" date={date} done={done} won shareText={()=>whereShareText({title:`${t.title} · ${t.where}`,date,kms,url:window.location.href})} t={t}/>
  </section>
}
