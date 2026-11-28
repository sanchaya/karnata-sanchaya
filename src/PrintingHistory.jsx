import { useState } from 'react'
import { PRINTING_KINDS, printingHistory } from './data/printing-history'
import './press.css'

const copy={
  kn:{
    title:'ಮುದ್ರಣ ಮತ್ತು ಮುದ್ರಣಾಲಯಗಳ ಇತಿಹಾಸ',
    intro:'ಕನ್ನಡ ಮುದ್ರಣ ಹೇಗೆ ಆರಂಭವಾಯಿತು: ಮೊದಲ ಅಚ್ಚುಗಳು, ಮಿಷನ್ ಮುದ್ರಣಾಲಯಗಳು, ಮೊದಲ ಪತ್ರಿಕೆ, ಮತ್ತು ಮೈಸೂರಿನ ಮುದ್ರಣಾಲಯಗಳು. ಪ್ರತಿ ಸಾಲಿನ ಕೆಳಗೆ ಆಕರ ಮತ್ತು ಆಕರಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸಗಳಿವೆ; ವರ್ಷಗಳು “ವರದಿಯಂತೆ”.',
    kinds:{all:'ಎಲ್ಲ',press:'ಮುದ್ರಣಾಲಯ',paper:'ಪತ್ರಿಕೆ',book:'ಪುಸ್ತಕ',type:'ಅಚ್ಚು ಮತ್ತು ತಂತ್ರ'},
    status:{read:'ಆಕರ ಓದಲಾಗಿದೆ',lead:'ಸುಳಿವು · ಇನ್ನೂ ದೃಢಪಟ್ಟಿಲ್ಲ'},
    sources:'ಆಕರ ಮತ್ತು ಸಂದೇಹ',doubt:'ಭಿನ್ನ ಮಾಹಿತಿ',earliest:'ಪತ್ರಿಕಾ ಸಂಚಯ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಅತ್ಯಂತ ಹಳೆಯ ಶೀರ್ಷಿಕೆಗಳು',earliestNote:'ಈ ಅಟ್ಲಸ್‌ನ ಪತ್ರಿಕೆಗಳ ಪಟ್ಟಿಯಿಂದ, ೧೮೯೩ರವರೆಗೆ.',
    note:'ಹೆಚ್ಚಿನ ಆಕರಗಳು ಎರಡನೇ ಕೈ (ವಿಶ್ವಕೋಶ ಮತ್ತು ಒಂದು ಸುದ್ದಿ ಲೇಖನ). ಮೂಲ ಮುದ್ರಣ ಇತಿಹಾಸ ಗ್ರಂಥಗಳನ್ನು ಓದಿ ಪರಿಶೀಲಿಸಬೇಕು. ಕನ್ನಡ ಪಠ್ಯ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಬಾಕಿ.',
    help:'ಮುದ್ರಣ ಇತಿಹಾಸದ ಆಕರ ಗೊತ್ತೇ? ಕೊಡುಗೆ ನೀಡಿ',
  },
  en:{
    title:'History of printing and printing presses',
    intro:'How Kannada printing began: the first type, the mission presses, the first newspaper, and the presses of Mysore. Each row has its sources and where they disagree; years are “as reported”.',
    kinds:{all:'All',press:'Presses',paper:'Newspapers',book:'Books',type:'Type and technique'},
    status:{read:'Source read',lead:'Lead · not yet verified'},
    sources:'Sources and doubts',doubt:'Where sources differ',earliest:'The earliest titles in the Patrika Sanchaya catalogue',earliestNote:'From this atlas’s periodicals list, up to 1893.',
    note:'Most sources are second-hand (an encyclopedia and a news feature). They need checking against the printing histories themselves. The Kannada text needs a native proofread.',
    help:'Know a source on printing history? Contribute',
  },
}
const text=(value,locale)=>value?.[locale]||value?.kn||value?.en||''

export default function PrintingHistory({locale='kn',periodicals=[]}){
  const t=copy[locale]||copy.kn,[kind,setKind]=useState('all')
  const rows=printingHistory.filter(item=>kind==='all'||item.kind===kind).sort((a,b)=>a.year-b.year)
  const earliest=periodicals.filter(p=>Number.isFinite(p.date?.from)&&p.date.from<=1893).sort((a,b)=>a.date.from-b.date.from)
  return <section className="printing-history" id="printing-history" aria-labelledby="printing-title">
    <h3 id="printing-title">{t.title}</h3>
    <p>{t.intro}</p>
    <div className="rec-chips" role="group" aria-label={t.title}>{['all',...PRINTING_KINDS].map(key=><button key={key} type="button" className={kind===key?'on':''} aria-pressed={kind===key} onClick={()=>setKind(key)}>{t.kinds[key]}</button>)}</div>
    <ol className="printing-list">{rows.map(item=><li key={item.id} className={`printing-row ${item.status}`}>
      <span className="printing-year">{item.year}</span>
      <div><strong>{text(item.name,locale)}</strong> <span className={`printing-status ${item.status}`}>{t.status[item.status]}</span>
        <small className="printing-place">{text(item.place,locale)} · {t.kinds[item.kind]}</small>
        <p>{text(item.note,locale)}</p>
        {item.doubt&&<p className="printing-doubt"><b>{t.doubt}:</b> {text(item.doubt,locale)}</p>}
        <details><summary>{t.sources}</summary><ul>{item.evidence.map((e,i)=><li key={i}>{e.title} · <em>{e.locator}</em> · {t.status[e.status]||e.status}</li>)}</ul></details></div></li>)}</ol>
    {earliest.length>0&&<div className="printing-earliest"><strong>{t.earliest}</strong> <small>{t.earliestNote}</small>
      <ul>{earliest.map(p=><li key={p.id}><b>{p.date.from}</b> {p.name?.kn||p.name?.en} <small>{text(p.publicationPlace,locale)}</small></li>)}</ul></div>}
    <p className="press-note">{t.note} <a href="#contribute">{t.help} →</a></p>
  </section>
}
