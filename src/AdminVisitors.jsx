import { useEffect, useState } from 'react'
import './admin-visitors.css'

// Administrators only: who is on the site now and how many people have visited. Anonymous counts; see docs/visitor-stats.md.
export default function AdminVisitors({locale}){
  const kn=locale==='kn',[data,setData]=useState(null),[error,setError]=useState(false)
  useEffect(()=>{
    let live=true
    const load=()=>fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/administration/visitors?days=14`,{credentials:'include'}).then(r=>r.ok?r.json():Promise.reject(new Error(String(r.status)))).then(body=>live&&(setData(body),setError(false))).catch(()=>live&&setError(true))
    load();const timer=window.setInterval(load,30000)
    return()=>{live=false;window.clearInterval(timer)}
  },[])
  if(error&&!data)return <section className="admin-visitors"><p>{kn?'ಭೇಟಿ ಅಂಕಿಅಂಶ ಲೋಡ್ ಆಗಲಿಲ್ಲ (ಮೈಗ್ರೇಷನ್ 016 ಚಲಾಯಿಸಿದ್ದೀರಾ?).':'Visitor stats could not be loaded (has migration 016 been run?).'}</p></section>
  if(!data)return null
  const today=data.daily[0]&&data.daily[0].day===new Date().toISOString().slice(0,10)?data.daily[0]:{visitors:0,views:0,sessions:0}
  const top=Object.entries(data.live.byView).sort((a,b)=>b[1]-a[1]).slice(0,6)
  const fmt=n=>Number(n).toLocaleString('en-IN')
  return <section className="admin-visitors" aria-label={kn?'ಭೇಟಿ ಅಂಕಿಅಂಶ':'Visitor statistics'}>
    <div><p className="eyebrow">{kn?'ಭೇಟಿ ಅಂಕಿಅಂಶ (ಅನಾಮಧೇಯ)':'Visitor statistics (anonymous)'}</p>
      <dl><div><dt>{kn?'ಈಗ ಇರುವವರು':'Live now'}</dt><dd>{fmt(data.live.visitors)}</dd></div><div><dt>{kn?'ಇಂದಿನ ಭೇಟಿದಾರರು':'Visitors today'}</dt><dd>{fmt(today.visitors)}</dd></div><div><dt>{kn?'ಒಟ್ಟು ಭೇಟಿದಾರರು':'Total visitors'}</dt><dd>{fmt(data.total.visitors)}</dd></div><div><dt>{kn?'ಒಟ್ಟು ಪುಟ ವೀಕ್ಷಣೆ':'Total page views'}</dt><dd>{fmt(data.total.views)}</dd></div></dl>
      {top.length>0&&<p className="admin-visitors-live">{kn?'ಈಗ ನೋಡುತ್ತಿರುವ ಪುಟಗಳು':'Live on'}: {top.map(([view,n])=>`${view} (${n})`).join(' · ')}</p>}</div>
    <table><thead><tr><th>{kn?'ದಿನ (UTC)':'Day (UTC)'}</th><th>{kn?'ಭೇಟಿದಾರರು':'Visitors'}</th><th>{kn?'ಭೇಟಿಗಳು':'Visits'}</th><th>{kn?'ವೀಕ್ಷಣೆ':'Views'}</th></tr></thead><tbody>{data.daily.map(row=><tr key={row.day}><td>{row.day}</td><td>{fmt(row.visitors)}</td><td>{fmt(row.sessions)}</td><td>{fmt(row.views)}</td></tr>)}</tbody></table>
    <small>{kn?'ಕುಕಿ, ಐಪಿ ವಿಳಾಸ ಅಥವಾ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಇಲ್ಲ. “ಈಗ ಇರುವವರು” = ಕಳೆದ 2 ನಿಮಿಷಗಳಲ್ಲಿ ಸಕ್ರಿಯ.':'No cookies, IP addresses or personal data. “Live now” = active in the last 2 minutes.'}</small>
  </section>
}
