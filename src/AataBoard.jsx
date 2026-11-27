import { useEffect, useState } from 'react'
import { GRID, applyHuli, applyMane, goatMoves, huliWinner, maneMoves, maneReply, maneWinner, neighbours, newHuli, newMane, tigerReply } from './aata-board'

const copy={
  kn:{
    huli:'ಆಡು-ಹುಲಿ ಆಟ',huliIntro:'ನೀವು ಆಡುಗಳು. ಇಪ್ಪತ್ತು ಆಡುಗಳನ್ನು ಒಂದೊಂದಾಗಿ ಇಡಿ, ನಂತರ ಸರಿಸಿ. ನಾಲ್ಕು ಹುಲಿಗಳನ್ನು (ಕಂಪ್ಯೂಟರ್) ಚಲಿಸಲಾಗದಂತೆ ಮಾಡಿ ಗೆಲ್ಲಿರಿ; ಹುಲಿಗಳು ಐದು ಆಡುಗಳನ್ನು ಹಾರಿ ಹಿಡಿದರೆ ಅವು ಗೆಲ್ಲುತ್ತವೆ.',
    mane:'ಅಳಿ ಗುಳಿ ಮಣೆ',maneIntro:'ಏಳು ಗುಳಿಗಳ ಎರಡು ಸಾಲು, ಪ್ರತಿ ಗುಳಿಯಲ್ಲಿ ನಾಲ್ಕು ಕಾಳು. ನಿಮ್ಮ (ಕೆಳಗಿನ) ಸಾಲಿನ ಒಂದು ಗುಳಿ ಆರಿಸಿ; ಕಾಳುಗಳನ್ನು ಒಂದೊಂದಾಗಿ ಬಲಕ್ಕೆ ಹಂಚಿ. ಕೊನೆಯ ಕಾಳಿನ ಮುಂದಿನ ಗುಳಿಯಲ್ಲಿ ಕಾಳಿದ್ದರೆ ಅದನ್ನೆತ್ತಿ ಹಂಚುತ್ತಾ ಮುಂದುವರಿಯಿರಿ; ಖಾಲಿ ಇದ್ದರೆ ಅದರ ಮುಂದಿನ ಗುಳಿಯ ಕಾಳುಗಳನ್ನು ಗೆದ್ದುಕೊಳ್ಳಿ. ಹೆಚ್ಚು ಕಾಳು ಗೆದ್ದವರು ಜಯಿಸುತ್ತಾರೆ.',
    rules:'ಇಲ್ಲಿ ಆಡುವ ನಿಯಮಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಆಡುವ ರೂಪ; ಊರಿನಿಂದ ಊರಿಗೆ ನಿಯಮ ಬದಲಾಗುತ್ತದೆ. ಆಟದ ಇತಿಹಾಸದ ಆಕರ “ಹಳೆಯ ಆಟ, ವಿನೋದ” ಪುಟದಲ್ಲಿದೆ.',more:'ಈ ಆಟದ ಬಗ್ಗೆ',
    placeLeft:'ಇಡಬೇಕಾದ ಆಡುಗಳು',lost:'ಹುಲಿ ಹಿಡಿದ ಆಡುಗಳು',pickGoat:'ಸರಿಸಲು ಒಂದು ಆಡನ್ನು ಆರಿಸಿ',pickTarget:'ಈಗ ಖಾಲಿ ಪಕ್ಕದ ಬಿಂದು ಆರಿಸಿ',place:'ಖಾಲಿ ಬಿಂದುವಿನಲ್ಲಿ ಆಡನ್ನು ಇಡಿ',
    goatsWin:'ಆಡುಗಳು ಗೆದ್ದವು: ಹುಲಿಗಳು ಚಲಿಸಲಾರವು!',tigersWin:'ಹುಲಿಗಳು ಗೆದ್ದವು.',again:'ಮತ್ತೆ ಆಡಿ',thinking:'ಹುಲಿಗಳ ಸರದಿ…',
    you:'ನೀವು',computer:'ಕಂಪ್ಯೂಟರ್',yourTurn:'ನಿಮ್ಮ ಸರದಿ',wait:'ಕಂಪ್ಯೂಟರ್ ಆಡುತ್ತಿದೆ…',youWin:'ನೀವು ಗೆದ್ದಿರಿ!',youLose:'ಈ ಬಾರಿ ಕಂಪ್ಯೂಟರ್ ಗೆದ್ದಿತು.',tie:'ಸಮ.',won:'ಗೆದ್ದ ಕಾಳು',
  },
  en:{
    huli:'Aadu-Huli (goats and tigers)',huliIntro:'You play the goats. Place twenty goats one at a time, then move them. Trap the four tigers (the computer) so they cannot move to win; the tigers win by jumping five goats.',
    mane:'Ali Guli Mane',maneIntro:'Two rows of seven pits, four seeds in each. Pick a pit in your (bottom) row and sow its seeds one by one to the right. If the pit after the last seed has seeds, lift them and keep sowing; if it is empty, win the seeds in the pit after it. Whoever wins more seeds wins.',
    rules:'These are the commonly played rules; they change from village to village. The sources for the games’ history are on the Old games and recreation page.',more:'About this game',
    placeLeft:'Goats to place',lost:'Goats captured',pickGoat:'Pick a goat to move',pickTarget:'Now pick an empty point next to it',place:'Place a goat on an empty point',
    goatsWin:'The goats win: the tigers cannot move!',tigersWin:'The tigers win.',again:'Play again',thinking:'Tigers’ turn…',
    you:'You',computer:'Computer',yourTurn:'Your turn',wait:'The computer is playing…',youWin:'You win!',youLose:'The computer won this time.',tie:'A tie.',won:'Seeds won',
  },
}

function Huli({locale}){
  const c=copy[locale]||copy.kn
  const [state,setState]=useState(newHuli),[picked,setPicked]=useState(null)
  const winner=huliWinner(state),yourTurn=state.turn==='G'&&!winner
  useEffect(()=>{
    if(state.turn!=='T'||winner)return
    const id=setTimeout(()=>{const move=tigerReply(state);if(move)setState(current=>applyHuli(current,move))},600)
    return()=>clearTimeout(id)
  },[state,winner])
  const targets=picked==null?[]:neighbours(picked%GRID,Math.floor(picked/GRID)).map(([x,y])=>y*GRID+x).filter(i=>!state.board[i])
  const click=i=>{
    if(!yourTurn)return
    if(state.toPlace>0){if(!state.board[i])setState(applyHuli(state,{place:i}));return}
    if(state.board[i]==='G'){setPicked(i);return}
    if(picked!=null&&targets.includes(i)){setState(applyHuli(state,{from:picked,to:i}));setPicked(null)}
  }
  const lines=[]
  for(let k=0;k<GRID;k++){lines.push([0,k,4,k],[k,0,k,4])}
  lines.push([0,0,4,4],[0,4,4,0],[2,0,4,2],[4,2,2,4],[2,4,0,2],[0,2,2,0])
  const status=winner?(winner==='G'?c.goatsWin:c.tigersWin):!yourTurn?c.thinking:picked!=null?c.pickTarget:state.toPlace>0?c.place:c.pickGoat
  return <div className="board-game">
    <p className="board-stats"><span>{c.placeLeft}: <b>{state.toPlace}</b></span><span>{c.lost}: <b>{state.captured}</b> / 5</span></p>
    <svg className="huli-board" viewBox="-0.4 -0.4 4.8 4.8" role="group" aria-label={c.huli}>
      {lines.map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]}/>)}
      {state.board.map((cell,i)=>{const x=i%GRID,y=Math.floor(i/GRID);return <g key={i} className={`huli-point ${cell} ${picked===i?'picked':''} ${targets.includes(i)?'target':''}`} onClick={()=>click(i)} role="button" tabIndex={0} aria-label={cell==='T'?'tiger':cell==='G'?'goat':'empty'} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();click(i)}}}>
        <circle cx={x} cy={y} r="0.34" className="hit"/>{cell&&<text x={x} y={y+0.17} textAnchor="middle">{cell==='T'?'🐅':'🐐'}</text>}</g>})}
    </svg>
    <p className="aata-status" aria-live="polite">{status}</p>
    {winner&&<div className="aata-actions"><button type="button" onClick={()=>{setState(newHuli());setPicked(null)}}>{c.again}</button></div>}
  </div>
}

function Mane({locale}){
  const c=copy[locale]||copy.kn
  const [state,setState]=useState(newMane)
  const winner=maneWinner(state),yourTurn=state.turn===0&&!winner
  useEffect(()=>{
    if(state.turn!==1||winner)return
    const id=setTimeout(()=>{const move=maneReply(state);if(move!=null)setState(current=>applyMane(current,move))},700)
    return()=>clearTimeout(id)
  },[state,winner])
  const mine=maneMoves({...state,turn:0})
  const top=[13,12,11,10,9,8,7],bottom=[0,1,2,3,4,5,6]
  const pit=(i,playable)=><button key={i} type="button" className={`mane-pit ${playable&&mine.includes(i)?'playable':''}`} disabled={!playable||!mine.includes(i)||!yourTurn} onClick={()=>setState(applyMane(state,i))} aria-label={`${state.pits[i]}`}>
    <span>{state.pits[i]}</span><i aria-hidden="true">{'●'.repeat(Math.min(state.pits[i],8))}</i></button>
  const status=winner!=null?(winner===0?c.youWin:winner===1?c.youLose:c.tie):yourTurn?c.yourTurn:c.wait
  return <div className="board-game">
    <p className="board-stats"><span>{c.computer} · {c.won}: <b>{state.store[1]}</b></span><span>{c.you} · {c.won}: <b>{state.store[0]}</b></span></p>
    <div className="mane-board"><div className="mane-row">{top.map(i=>pit(i,false))}</div><div className="mane-row">{bottom.map(i=>pit(i,true))}</div></div>
    <p className="aata-status" aria-live="polite">{status}</p>
    {winner!=null&&<div className="aata-actions"><button type="button" onClick={()=>setState(newMane())}>{c.again}</button></div>}
  </div>
}

export default function BoardGames({locale='kn',game}){
  const c=copy[locale]||copy.kn,isHuli=game==='huli'
  return <section className="aata-game-stage board-games"><header><div><p className="eyebrow">{locale==='kn'?'ಜನಪದ ಹಲಗೆ ಆಟ':'Traditional board game'}</p><h2>{isHuli?c.huli:c.mane}</h2><p>{isHuli?c.huliIntro:c.maneIntro}</p></div></header>
    {isHuli?<Huli locale={locale}/>:<Mane locale={locale}/>}
    <p className="board-rules">{c.rules} <a href="#recreation">{c.more} →</a></p></section>
}
