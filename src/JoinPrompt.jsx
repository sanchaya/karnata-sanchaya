import { useEffect, useState } from 'react'
import { joinUrl, shouldShowJoin } from './join-prompt'
import { safeStorage, session } from './safe-storage'
import './join-prompt.css'

const STATIC=import.meta.env.VITE_STATIC_DATASET==='true'
const DISMISS='karnataka-atlas-join-dismissed',VIEWS='karnataka-atlas-join-views'
let signedInPromise
// true / false once known; null while loading or when there is no account server (the static edition).
export function useSignedIn(){
  const [value,setValue]=useState(null)
  useEffect(()=>{
    if(STATIC)return
    signedInPromise??=fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/auth/me`,{credentials:'include'}).then(r=>r.ok?r.json():null).then(b=>Boolean(b?.user)).catch(()=>null)
    let live=true;signedInPromise.then(v=>live&&setValue(v));return()=>{live=false}
  },[])
  return value
}

// A slim strip at the bottom of the page.
export function JoinBanner({locale,view}){
  const kn=locale==='kn',signedIn=useSignedIn()
  const [views,setViews]=useState(()=>Number(session.get(VIEWS))||0),[dismissed,setDismissed]=useState(()=>safeStorage.get(DISMISS))
  useEffect(()=>{const next=(Number(session.get(VIEWS))||0)+1;session.set(VIEWS,next);setViews(next)},[view])
  if(!shouldShowJoin({views,dismissedAt:dismissed,signedIn,view}))return null
  const dismiss=()=>{const now=Date.now();safeStorage.set(DISMISS,now);setDismissed(String(now))}
  return <aside className="join-banner" role="complementary" aria-label={kn?'ಪೋರ್ಟಲ್‌ಗೆ ಸೇರಿ':'Join the portal'}>
    <p><strong>{kn?'ಕನ್ನಡ ಹೆಸರು ಗೊತ್ತೇ? ತಪ್ಪು ಕಂಡಿತೇ?':'Know a Kannada name? Spot a mistake?'}</strong> {kn?'ಉಚಿತವಾಗಿ ಸೇರಿ: ತಿದ್ದುಪಡಿ ಮತ್ತು ಹೆಸರು ಸೂಚಿಸಿ, ಕೊಡುಗೆದಾರರ ಪಟ್ಟಿಯಲ್ಲಿ ಸ್ಥಾನ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ.':'Join free to suggest corrections and names, get on the contributors’ board and earn a certificate.'}</p>
    <div><a className="join-go" href={joinUrl(STATIC)}>{kn?'ಸೇರಿ':'Sign up'}</a><button type="button" onClick={dismiss}>{kn?'ಈಗ ಬೇಡ':'Not now'}</button></div>
  </aside>
}

// An inline line where signing up actually helps (suggesting names, after a game). Nothing for members.
export function JoinCallout({locale,text}){
  const kn=locale==='kn',signedIn=useSignedIn()
  if(signedIn===true)return null
  return <p className="join-callout">{text||(kn?'ಕನ್ನಡ ಹೆಸರು ಸೂಚಿಸಲು ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ.':'Open a free account to suggest Kannada names.')} <a href={joinUrl(STATIC)}>{kn?'ಸೇರಿ →':'Sign up →'}</a></p>
}
