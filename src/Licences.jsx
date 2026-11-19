import { useMemo, useState } from 'react'
import { COMMERCIAL_LABELS, LICENCE_AREAS, LICENCES } from './data/licences'
import './licences.css'

const GITHUB='https://github.com/sanchaya/karnata-sanchaya/blob/main'
const USED={data:{en:'Copied or derived',kn:'ನಕಲು ಅಥವಾ ಉತ್ಪನ್ನ'},pointer:{en:'Link or citation only',kn:'ಕೊಂಡಿ ಅಥವಾ ಉಲ್ಲೇಖ ಮಾತ್ರ'},display:{en:'Shown with credit',kn:'ಶ್ರೇಯದೊಂದಿಗೆ ತೋರಿಸಲಾಗಿದೆ'}}

export default function Licences({locale}){
  const kn=locale==='kn',l=kn?'kn':'en'
  const [area,setArea]=useState(''),[commercial,setCommercial]=useState(''),[query,setQuery]=useState('')
  const q=query.normalize('NFC').trim().toLowerCase()
  const list=useMemo(()=>LICENCES.filter(item=>(!area||item.area===area)&&(!commercial||item.commercial===commercial)&&(!q||[item.title.en,item.title.kn,item.licence,item.source,item.where].some(v=>(v||'').toLowerCase().includes(q)))),[area,commercial,q])
  return <main className="licences-page portal-page" id="licenses">
    <header className="licences-hero explore-hero"><div><p className="eyebrow">{kn?'ಸಹಯೋಗ · ಪರವಾನಗಿ':'Contribute · Licences'}</p><h2>{kn?'ಪರವಾನಗಿ ಮತ್ತು ದತ್ತಾಂಶ ಮೂಲಗಳು':'Licences and data sources'}</h2>
      <p>{kn?'ಈ ಅಟ್ಲಸ್‌ನಲ್ಲಿರುವ ಪ್ರತಿ ರೀತಿಯ ದತ್ತಾಂಶ ಎಲ್ಲಿಂದ ಬಂತು, ಯಾವ ಪರವಾನಗಿ ಅಡಿ ಇದೆ ಮತ್ತು ನೀವು ಏನು ಮಾಡಬೇಕು ಎಂದು ಇಲ್ಲಿ ನೋಡಿ.':'See where each kind of data in this atlas came from, under what licence, and what you must do when you reuse it.'}</p></div></header>
    <aside className="licences-notice" role="note"><strong>{kn?'ವಾಣಿಜ್ಯೇತರ ಬಳಕೆಗೆ ಮಾತ್ರ':'Non-commercial use only'}</strong>
      <p>{kn?'ಈ ಯೋಜನೆ ಸಂಚಯ (ಸಂಚಿ ಫೌಂಡೇಶನ್‌ನ ಭಾಗ) ನ ಲಾಭರಹಿತ ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಸಂಶೋಧನಾ ಯೋಜನೆ. ಯೋಜನೆ ಸ್ವತಃ ರಚಿಸಿದ್ದನ್ನು ಅಧ್ಯಯನ, ಬೋಧನೆ, ಸಂಶೋಧನೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ಬಳಕೆಗೆ ಶ್ರೇಯದೊಂದಿಗೆ ನೀಡಲಾಗಿದೆ; ಲಿಖಿತ ಅನುಮತಿ ಇಲ್ಲದೆ ವಾಣಿಜ್ಯ ಬಳಕೆ ಮಾಡುವಂತಿಲ್ಲ. ಮೂರನೇ ವ್ಯಕ್ತಿಯ ದತ್ತಾಂಶ ತನ್ನದೇ ಪರವಾನಗಿ ಉಳಿಸಿಕೊಂಡಿದೆ; ಅದರಲ್ಲಿ ಕೆಲವು ವಾಣಿಜ್ಯ ಬಳಕೆಗೂ ಅವಕಾಶ ನೀಡುತ್ತವೆ, ಆದ್ದರಿಂದ ಪ್ರತಿ ದಾಖಲೆಯ ಪರವಾನಗಿ ಪಾಲಿಸಿ.':'This is a non-profit educational and research project of Sanchaya (part of Sanchi Foundation). What the project created is offered for study, teaching, research, journalism and personal use with attribution. It may not be used commercially without written permission. Third-party data keeps its own licence, and some of it allows commercial use on its own, so follow each item’s licence.'} <a href={`mailto:info@sanchifoundation.org?subject=${encodeURIComponent('Permission request')}`}>info@sanchifoundation.org</a></p></aside>
    <div className="licences-tools"><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={kn?'ಹುಡುಕಿ (ಉದಾ. OpenStreetMap, CC BY)':'Search (for example OpenStreetMap, CC BY)'} aria-label={kn?'ಹುಡುಕಿ':'Search'}/>
      <select value={commercial} onChange={event=>setCommercial(event.target.value)} aria-label={kn?'ವಾಣಿಜ್ಯ ಬಳಕೆ':'Commercial use'}><option value="">{kn?'ವಾಣಿಜ್ಯ ಬಳಕೆ: ಎಲ್ಲ':'Commercial use: any'}</option>{Object.entries(COMMERCIAL_LABELS).map(([id,label])=><option key={id} value={id}>{label[l]}</option>)}</select></div>
    <div className="licences-filter" role="group" aria-label={kn?'ವಿಭಾಗ':'Area'}><button type="button" className={!area?'active':''} aria-pressed={!area} onClick={()=>setArea('')}>{kn?'ಎಲ್ಲ':'All'} <small>{LICENCES.length}</small></button>{LICENCE_AREAS.map(([id,label])=><button type="button" key={id} className={area===id?'active':''} aria-pressed={area===id} onClick={()=>setArea(id)}>{label[l]} <small>{LICENCES.filter(i=>i.area===id).length}</small></button>)}</div>
    <p className="licences-count" aria-live="polite">{list.length} {kn?'ಪ್ರಕಾರಗಳು':'kinds of data'}</p>
    <ul className="licences-list">{list.map(item=><li key={item.id} id={`licence-${item.id}`} className={`c-${item.commercial}`}>
      <div className="licences-head"><h3>{item.title[l]}</h3><span className={`licences-badge c-${item.commercial}`}>{COMMERCIAL_LABELS[item.commercial][l]}</span></div>
      <p className="licences-licence"><b>{kn?'ಪರವಾನಗಿ':'Licence'}:</b> {item.licence}</p>
      <p><b>{kn?'ಮೂಲ':'Source'}:</b> {item.source} · <span className="licences-used">{USED[item.used][l]}</span></p>
      <p><b>{kn?'ನೀವು ಮಾಡಬೇಕಾದದ್ದು':'What you must do'}:</b> {item.obligation[l]}</p>
      <p className="licences-where"><code>{item.where}</code> · <a href={`${GITHUB}/LICENSING.md`} target="_blank" rel="noreferrer">LICENSING.md §{item.ref} ↗</a></p></li>)}</ul>
    {list.length===0&&<p className="licences-count">{kn?'ಹೊಂದುವ ಯಾವುದೂ ಇಲ್ಲ.':'Nothing matches.'}</p>}
    <section className="licences-more"><h3>{kn?'ಹೇಗೆ ಉಲ್ಲೇಖಿಸುವುದು':'How to cite'}</h3><p><code>Karnataka Historical Atlas (Sanchaya, Sanchi Foundation). &lt;record or page title&gt;. https://karnata.sanchaya.net/&lt;page&gt;. Accessed &lt;date&gt;.</code> {kn?'“ಪರಿಶೀಲನೆ ಬಾಕಿ” ಎಂದು ಗುರುತಿಸಿದ ದಾಖಲೆಗಳು ಸಂಶೋಧನಾ ಸುಳಿವುಗಳು; ಅವುಗಳ ಮೂಲ ಆಕರಗಳನ್ನು ಉಲ್ಲೇಖಿಸಿ. ಛಾಯಾಚಿತ್ರಕ್ಕೆ ಚಿತ್ರದ ಕೆಳಗಿನ ಶ್ರೇಯ ಮತ್ತು ಪರವಾನಗಿ ನೀಡಿ.':'Records marked “needs review” are research leads; cite their underlying sources. For a photograph, give the credit and licence shown under it.'}</p>
      <h3>{kn?'ಸರಿಪಡಿಸಲು ಅಥವಾ ತೆಗೆಯಲು':'Corrections and removal'}</h3><p>{kn?'ಹಕ್ಕುದಾರರಾಗಿದ್ದು ಏನಾದರೂ ಸರಿಪಡಿಸಲು, ಶ್ರೇಯ ನೀಡಲು ಅಥವಾ ತೆಗೆಯಲು ಬಯಸಿದರೆ ದಾಖಲೆ ಅಥವಾ ಪುಟದ URL ಸಹಿತ ಬರೆಯಿರಿ:':'If you are a rights holder and want something corrected, credited or removed, write with the record or page URL:'} <a href="mailto:info@sanchifoundation.org">info@sanchifoundation.org</a></p>
      <h3>{kn?'ಪೂರ್ಣ ಪಠ್ಯ':'Full texts'}</h3><p><a href={`${GITHUB}/LICENSING.md`} target="_blank" rel="noreferrer">LICENSING.md ↗</a> · <a href={`${GITHUB}/LICENSES/PolyForm-Noncommercial-1.0.0.md`} target="_blank" rel="noreferrer">PolyForm Noncommercial 1.0.0 ↗</a> · <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0 ↗</a> · <a href="#data-wanted">{kn?'ನಮಗೆ ಬೇಕಾದ ದತ್ತಾಂಶ':'Data we are looking for'}</a></p>
      <p className="licences-disclaimer">{kn?'ಇದು ಕಾನೂನು ಸಲಹೆಯಲ್ಲ. ದತ್ತಾಂಶವನ್ನು ಇದ್ದಂತೆ, ಸಂಶೋಧನಾ ಸಾಮಗ್ರಿಯಾಗಿ ನೀಡಲಾಗಿದೆ; ಗಡಿಗಳು ಪ್ರದರ್ಶನಕ್ಕೆ ಮಾತ್ರ, ಕಾನೂನು ಬಳಕೆಗೆ ಅಲ್ಲ.':'This is not legal advice. The data is provided as is, as research material; boundaries are for display, not legal use.'}</p></section>
  </main>
}
