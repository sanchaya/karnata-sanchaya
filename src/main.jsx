import React from 'react'
import ReactDOM from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './styles.css'
import './map-labels.css'
import './record-details.css'
import './atlas-search.css'
import './inscription-audit.css'
import './community.css'
import './explorer.css'
import './global-relations.css'
import './resources.css'
import './evidence-workflow.css'
import './admin-readiness.css'
import './guided-tour.css'
import './tablet.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  }, { once: true })
}
