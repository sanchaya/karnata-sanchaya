// Anonymous visit counting for the live portal (see server/visits.js). Off on the static edition, and whenever the browser
// sends Do Not Track or Global Privacy Control. A random id is kept in localStorage; no cookie, no personal data.
const KEY='karnataka-atlas-visitor'
const randomId=()=>globalThis.crypto?.randomUUID?.()||`${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`
const stored=(storage,key)=>{try{let value=storage.getItem(key);if(!value){value=randomId();storage.setItem(key,value)}return value}catch{return null}}
export const trackingAllowed=()=>import.meta.env.VITE_STATIC_DATASET!=='true'&&navigator.doNotTrack!=='1'&&!navigator.globalPrivacyControl
export function sendPing(view,kind){
  if(!trackingAllowed())return
  const v=stored(localStorage,KEY),s=stored(sessionStorage,`${KEY}:session`)
  if(!v||!s)return
  fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/visits/ping`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({v,s,view:String(view||'atlas').replace(/[^a-z0-9-]/gi,'').slice(0,40)||'atlas',kind}),keepalive:true}).catch(()=>{})
}
