import { useEffect, useRef, useState } from 'react'
import { attachKannadaIme } from './kannada-ime'

export default function KannadaImeInput({locale,value,onValue,disabled=false}){
  const ref=useRef(null),controller=useRef(null)
  const [enabled,setEnabled]=useState(locale==='kn'),[ready,setReady]=useState(false)
  useEffect(()=>{
    if(locale!=='kn'||!ref.current)return undefined
    let active=true
    attachKannadaIme(ref.current).then(next=>{if(!active){next.destroy();return}controller.current=next;setReady(true);if(!enabled)next.disable()}).catch(()=>setReady(false))
    return()=>{active=false;controller.current?.destroy();controller.current=null}
  },[locale])
  useEffect(()=>{if(!controller.current)return;enabled?controller.current.enable():controller.current.disable()},[enabled])
  return <span className="kannada-ime-input"><input ref={ref} lang={locale} value={value} disabled={disabled} onInput={event=>onValue(event.currentTarget.value)} onChange={event=>onValue(event.currentTarget.value)} autoComplete="off"/>{locale==='kn'&&<button type="button" className={enabled?'active':''} disabled={!ready} aria-pressed={enabled} onClick={()=>setEnabled(current=>!current)} title="Kannada phonetic transliteration">{enabled?'ಕನ್ನಡ IME ✓':'ಕನ್ನಡ IME'}</button>}</span>
}
