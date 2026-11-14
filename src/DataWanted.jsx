import { useMemo, useState } from 'react'
import { DATA_AREAS, DATA_WANTED } from './data/data-wanted'
import './data-wanted.css'

const STATIC=import.meta.env.VITE_STATIC_DATASET==='true'
const SITE='https://karnata.sanchaya.net/'
const LICENCE_URL='https://github.com/sanchaya/karnata-sanchaya/blob/main/LICENSING.md'
const MAIL='info@sanchifoundation.org'
// "I know a source" opens the contribution form for a new source (an account is needed; the static mirror links to the main site).
const contributeUrl=title=>`${STATIC?SITE:''}?${new URLSearchParams({contributeType:'source',contributeAction:'create',contributeName:title})}#contribute`

export default function DataWanted({locale}){
  const kn=locale==='kn',l=kn?'kn':'en'
  const [area,setArea]=useState('')
  const list=useMemo(()=>DATA_WANTED.filter(item=>!area||item.area===area),[area])
  return <main className="data-wanted-page portal-page" id="data-wanted">
    <header className="data-wanted-hero"><p className="eyebrow">{kn?'ಸಹಯೋಗ · ದತ್ತಾಂಶ':'Contribute · Data'}</p><h2>{kn?'ನಮಗೆ ಬೇಕಾದ ದತ್ತಾಂಶ':'Data we are looking for'}</h2>
      <p>{kn?'ಈ ಅಟ್ಲಸ್ ತನ್ನ ಆಕರಗಳಷ್ಟೇ ಉತ್ತಮ. ಕೆಳಗಿನ ದತ್ತಾಂಶ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ ಎಂದು ನಿಮಗೆ ಗೊತ್ತಿದ್ದರೆ ತಿಳಿಸಿ: ಇಲಾಖೆ, ವಿಶ್ವವಿದ್ಯಾಲಯ, ವಸ್ತುಸಂಗ್ರಹಾಲಯ, ಸಂಶೋಧಕರು ಅಥವಾ ಹವ್ಯಾಸಿಗಳು.':'The atlas is only as good as its sources. If you know where any of the data below can be found, tell us: a department, a university, a museum, a researcher or a hobbyist.'}</p></header>
    <aside className="data-wanted-rules" aria-label={kn?'ನಾವು ಬಳಸಬಹುದಾದದ್ದು':'What we can use'}>
      <strong>{kn?'ನಾವು ಏನನ್ನು ಬಳಸಬಹುದು?':'What can we use?'}</strong>
      <p>{kn?'ಸಾರ್ವಜನಿಕ ವಲಯದ, ಮುಕ್ತ ಪರವಾನಗಿಯ (CC0, CC BY, ODbL, NDSAP ಅಥವಾ GODL-India) ಅಥವಾ ಮಾಲೀಕರು ವಾಣಿಜ್ಯೇತರ ಹಂಚಿಕೆಗೆ ಲಿಖಿತ ಅನುಮತಿ ನೀಡಿದ ದತ್ತಾಂಶ. ಈ ಯೋಜನೆ ವಾಣಿಜ್ಯೇತರ. ಹಂಚಿಕೊಳ್ಳುವ ಹಕ್ಕಿಲ್ಲದ್ದನ್ನು ಕಳುಹಿಸಬೇಡಿ; ಪರವಾನಗಿ ಮತ್ತು ಮೂಲವನ್ನು ತಿಳಿಸಿ.':'Data that is public domain, openly licensed (CC0, CC BY, ODbL, NDSAP or GODL-India), or whose owner agrees in writing to non-commercial sharing. This project is non-commercial. Please do not send anything you have no right to share, and tell us the licence and where it came from.'} <a href={LICENCE_URL} target="_blank" rel="noreferrer">{kn?'ಪರವಾನಗಿ ವಿವರ ↗':'Licensing details ↗'}</a></p>
    </aside>
    <div className="data-wanted-filter" role="group" aria-label={kn?'ವಿಭಾಗ':'Area'}><button type="button" className={!area?'active':''} aria-pressed={!area} onClick={()=>setArea('')}>{kn?'ಎಲ್ಲ':'All'} <small>{DATA_WANTED.length}</small></button>{DATA_AREAS.map(([id,label])=><button type="button" key={id} className={area===id?'active':''} aria-pressed={area===id} onClick={()=>setArea(id)}>{label[l]} <small>{DATA_WANTED.filter(i=>i.area===id).length}</small></button>)}</div>
    <ul className="data-wanted-list">{list.map(item=><li key={item.id} id={`wanted-${item.id}`} className={item.priority}>
      <details><summary><span><strong>{item.title[l]}</strong>{item.priority==='high'&&<em>{kn?'ತುರ್ತು':'High priority'}</em>}</span><small>{item.why[l]}</small></summary>
        <div><h4>{kn?'ನಮಗೆ ಏನು ಬೇಕು':'What would help'}</h4><p>{item.need[l]}</p><h4>{kn?'ಇದು ಯಾರ ಬಳಿ ಇರಬಹುದು':'Who might hold it'}</h4><p>{item.holders}</p>
          <p className="data-wanted-actions"><a className="data-wanted-go" href={contributeUrl(item.title.en)}>{kn?'ನನಗೆ ಮೂಲ ಗೊತ್ತು →':'I know a source →'}</a><a href={`mailto:${MAIL}?subject=${encodeURIComponent(`Data source: ${item.title.en}`)}`}>{kn?'ಇಮೇಲ್ ಮಾಡಿ':'Email us instead'}</a></p></div></details></li>)}</ul>
    <p className="data-wanted-note">{kn?'ಒಂದು ಮೂಲವನ್ನು ಪರಿಶೀಲಕರು ಪರಿಶೀಲಿಸಿ, ಪರವಾನಗಿ ಖಚಿತಪಡಿಸಿದ ನಂತರವೇ ಬಳಸುತ್ತೇವೆ ಮತ್ತು ನಿಮಗೆ ಶ್ರೇಯ ನೀಡುತ್ತೇವೆ.':'A source is used only after a reviewer has checked it and confirmed the licence; we will credit you.'}</p>
  </main>
}
