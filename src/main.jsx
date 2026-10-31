import React from 'react'
import ReactDOM from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import './map-labels.css'
import './record-details.css'
import './record-inspector.css'
import './atlas-search.css'
import './inscription-audit.css'
import './community.css'
import './community-guide.css'
import './explorer.css'
import './global-relations.css'
import './people.css'
import './freedom-movement.css'
import './trails.css'
import './resources.css'
import './evidence-workflow.css'
import './coins.css'
import './scripts.css'
import './admin-readiness.css'
import './guided-tour.css'
import './tablet.css'
import './nav-activity.css'
import './about.css'
import './district-workspace.css'
import './a11y.css'
import './wide-screens.css'
import './berunda.css'
import { hydrateAtlasData } from './data/runtime'
import { appendPublicAttribution } from './data/public-attribution'

const root=ReactDOM.createRoot(document.getElementById('root'))

// A tab still running an older build asks for chunks a newer deploy removed. Reload once to pick up the new build;
// the sessionStorage stamp stops a reload loop if the failure is something else (offline, blocked).
function reloadForNewBuild(){
  try{
    const last=Number(sessionStorage.getItem('chunk-reload-at')||0)
    if(Date.now()-last<30000)return false
    sessionStorage.setItem('chunk-reload-at',String(Date.now()))
  }catch{ /* storage blocked: reload once anyway */ }
  window.location.reload()
  return true
}
window.addEventListener('vite:preloadError',event=>{if(reloadForNewBuild())event.preventDefault()})
window.addEventListener('unhandledrejection',event=>{
  const message=String(event.reason?.message||event.reason||'')
  if(/dynamically imported module|Importing a module script failed|Failed to load module script/i.test(message)&&reloadForNewBuild())event.preventDefault()
})

document.addEventListener('copy',event=>{
  if(event.target?.closest?.('input, textarea, [contenteditable="true"]')||!event.clipboardData)return
  const selected=window.getSelection()?.toString().trim()
  if(!selected)return
  event.preventDefault()
  event.clipboardData.setData('text/plain',appendPublicAttribution(selected,`${location.pathname}${location.hash}`))
})

async function start(){
  try{
    await hydrateAtlasData()
    const {default:App}=await import('./App')
    root.render(<React.StrictMode><App /></React.StrictMode>)
  }catch(error){
    if(/dynamically imported module|Importing a module script failed|Failed to load module script/i.test(String(error?.message))&&reloadForNewBuild())return
    root.render(<main className="portal-page"><section className="about-hero"><p className="eyebrow">Karnataka Historical Atlas</p><h2>ಲೈವ್ ದತ್ತಾಂಶ ಲಭ್ಯವಿಲ್ಲ · Live dataset unavailable</h2><p>MariaDBಯಲ್ಲಿರುವ ಪ್ರಕಟಿತ ದತ್ತಾಂಶವನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.</p><p>The portal could not load its MariaDB dataset. Please try again shortly.</p><button type="button" onClick={()=>window.location.reload()}>ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ · Retry</button><small>{error.message}</small></section></main>)
  }
}

start()

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const buildVersion=import.meta.env.VITE_BUILD_SHA||'local-build'
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js?v=${encodeURIComponent(buildVersion)}`).catch(() => {})
  }, { once: true })
}
