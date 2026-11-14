import { useCallback, useEffect, useRef, useState } from 'react'
import { idsVisited, readSeen, unseenItems, WHATS_NEW, writeSeen } from './whats-new'
import './whats-new.css'

// One shared "seen" list in localStorage; the header button and the menu badges stay in step through a window event.
export function useWhatsNew(view){
  const [seen,setSeen]=useState(readSeen)
  useEffect(()=>{const sync=()=>setSeen(readSeen());window.addEventListener('whatsnew-change',sync);window.addEventListener('storage',sync);return()=>{window.removeEventListener('whatsnew-change',sync);window.removeEventListener('storage',sync)}},[])
  const markSeen=useCallback(ids=>{if(!ids.length)return;writeSeen([...readSeen(),...ids]);window.dispatchEvent(new Event('whatsnew-change'))},[])
  useEffect(()=>{const ids=idsVisited(view,window.location.search).filter(id=>!readSeen().includes(id));if(ids.length)markSeen(ids)},[view,markSeen])
  const unseen=unseenItems(seen)
  return {unseen,newViews:new Set(unseen.map(item=>item.view)),markSeen}
}

export default function WhatsNew({locale,state}){
  const kn=locale==='kn',[open,setOpen]=useState(false),box=useRef(null)
  useEffect(()=>{if(!open)return;const out=event=>{if(!box.current?.contains(event.target))setOpen(false)},esc=event=>event.key==='Escape'&&setOpen(false);document.addEventListener('pointerdown',out);document.addEventListener('keydown',esc);return()=>{document.removeEventListener('pointerdown',out);document.removeEventListener('keydown',esc)}},[open])
  const count=state.unseen.length
  return <div className="whats-new" ref={box}>
    <button type="button" className={count?'has-new':''} aria-expanded={open} aria-haspopup="dialog" onClick={()=>setOpen(value=>!value)}><span aria-hidden="true">✨</span> {kn?'ಹೊಸದೇನು':'What’s new'}{count>0&&<b aria-label={kn?`${count} ಹೊಸ ವಿಷಯಗಳು`:`${count} new`}>{count}</b>}</button>
    {open&&<div className="whats-new-panel" role="dialog" aria-label={kn?'ಹೊಸದೇನು':'What’s new'}>
      <header><strong>{kn?'ಹೊಸದಾಗಿ ಸೇರಿದ್ದು':'Recently added'}</strong>{count>0&&<button type="button" onClick={()=>state.markSeen(WHATS_NEW.map(item=>item.id))}>{kn?'ಎಲ್ಲವನ್ನೂ ನೋಡಿದ್ದೇನೆ':'Mark all as seen'}</button>}</header>
      <ul>{WHATS_NEW.map(item=>{const isNew=state.unseen.includes(item)
        return <li key={item.id} className={isNew?'new':''}><h4>{item[locale]?.[0]||item.en[0]}{isNew&&<em>{kn?'ಹೊಸದು':'New'}</em>}</h4><p>{item[locale]?.[1]||item.en[1]}</p><a href={item.href} onClick={()=>{state.markSeen([item.id]);setOpen(false)}}>{kn?'ನೋಡಿ':'Try it'} →</a></li>})}</ul>
    </div>}
  </div>
}
