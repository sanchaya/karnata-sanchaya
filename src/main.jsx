import React from 'react'
import ReactDOM from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import './map-labels.css'
import './record-details.css'
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
import { hydrateAtlasData } from './data/runtime'
import { appendPublicAttribution } from './data/public-attribution'

const root=ReactDOM.createRoot(document.getElementById('root'))

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
