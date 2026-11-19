import { safeStorage } from './safe-storage.js'
// Anonymous visit counting for the live portal (see server/visits.js). Off on the static edition, and whenever the browser
// sends Do Not Track or Global Privacy Control. A random id is kept in localStorage; no cookie, no personal data.
const KEY='karnataka-atlas-visitor'
const randomId=()=>globalThis.crypto?.randomUUID?.()||`${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`
// Needs storage that works: without it every page load would look like a new visitor, so nothing is counted.
const stored=(which,key)=>{let value=safeStorage.get(key,which);if(!value){value=randomId();if(!safeStorage.set(key,value,which))return null}return value}
export const trackingAllowed=()=>import.meta.env?.VITE_STATIC_DATASET!=='true'&&navigator?.doNotTrack!=='1'&&!navigator?.globalPrivacyControl
export function sendPing(view,kind){
  if(!trackingAllowed())return
  const v=stored('localStorage',KEY),s=stored('sessionStorage',`${KEY}:session`)
  if(!v||!s)return
  fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/visits/ping`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({v,s,view:String(view||'atlas').replace(/[^a-z0-9-]/gi,'').slice(0,40)||'atlas',kind}),keepalive:true}).catch(()=>{})
}

// Counts a click on a partner link (server/visits.js OUTBOUND_TARGETS). Counts only: no visitor id is sent.
export function sendOutbound(target,view){
  if(!trackingAllowed())return
  fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/visits/outbound`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({target,view:String(view||'recreation').replace(/[^a-z0-9-]/gi,'').slice(0,40)||'recreation'}),keepalive:true}).catch(()=>{})
}
