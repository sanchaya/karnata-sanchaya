import { useMemo, useState } from 'react'
import { AWARD_KINDS, AWARD_KIND_LABELS, sahityaAkademiAwards } from './data/sahitya-akademi-kannada'
import './authors.css'

const copy={
  kn:{
    title:'ಕನ್ನಡಕ್ಕೆ ಸಾಹಿತ್ಯ ಅಕಾಡೆಮಿ ಪ್ರಶಸ್ತಿಗಳು, ೧೯೫೫ರಿಂದ',
    intro:'ಮುಖ್ಯ ಪ್ರಶಸ್ತಿ, ಅನುವಾದ, ಭಾಷಾ ಸಮ್ಮಾನ್, ಬಾಲ ಸಾಹಿತ್ಯ ಮತ್ತು ಯುವ ಪುರಸ್ಕಾರ ಪಡೆದವರು ಮತ್ತು ಕೃತಿಗಳು. ಲೇಖಕರ ಕಾರ್ಡ್ ಇರುವವರ ಹೆಸರಿನಿಂದ ಅದಕ್ಕೆ ಹೋಗಬಹುದು.',
    all:'ಎಲ್ಲ',search:'ಹೆಸರು, ಕೃತಿ…',year:'ವರ್ಷ',kind:'ಪ್ರಶಸ್ತಿ',winner:'ಪ್ರಶಸ್ತಿ ವಿಜೇತರು',work:'ಕೃತಿ',fest:'ಸಾಹಿತ್ಯೋತ್ಸವದಲ್ಲಿ ಮಾತು',decade:'ದಶಕ',
    total:'ಪ್ರಶಸ್ತಿಗಳು',matched:'ಉತ್ಸವ ಹೊಂದಾಣಿಕೆ ಇರುವವರು',certain:'ಖಚಿತ',probable:'ಸಂಭವನೀಯ',before:'ಪ್ರಶಸ್ತಿಗೆ ಮೊದಲು',after:'ಪ್ರಶಸ್ತಿಯ ನಂತರ',near:'ಅದೇ ಅಥವಾ ಮುಂದಿನ ವರ್ಷ',writerCard:'ಲೇಖಕರ ಕಾರ್ಡ್',none:'ಯಾರೂ ಸಿಗಲಿಲ್ಲ.',
    note:'ಆಕರ: ಸಾಹಿತ್ಯ ಅಕಾಡೆಮಿಯ ಕನ್ನಡ ಪ್ರಶಸ್ತಿ ಪಟ್ಟಿ (ಮಾಲೀಕರು ಒದಗಿಸಿದ ಕಡತ). “ಸಾಹಿತ್ಯೋತ್ಸವದಲ್ಲಿ ಮಾತು” ಅದೇ ಕಡತದ ಸ್ವಂತ ವಿಶ್ಲೇಷಣೆ: ಹೆಸರಿನ ಮೂಲಕ ಐದು ಸಾಹಿತ್ಯೋತ್ಸವಗಳ ಭಾಷಣಕಾರರ ಪಟ್ಟಿಗೆ ಹೊಂದಿಸಲಾಗಿದೆ; ಸಂಕ್ಷೇಪಗಳು (BLF, BPF, KLF, Book Brahma, Mysuru) ಕಡತದಲ್ಲಿರುವಂತೆ, ವಿವರಣೆ ಇಲ್ಲ. ಪರಿಶೀಲನೆ ಬಾಕಿ. ಕನ್ನಡ ಪಠ್ಯ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಬಾಕಿ.',
  },
  en:{
    title:'Sahitya Akademi awards for Kannada, from 1955',
    intro:'Winners of the main award, translation, Bhasha Samman, children’s literature and young writers’ awards, with their works. A winner who has a writer card links to it.',
    all:'All',search:'Name or work…',year:'Year',kind:'Award',winner:'Winner',work:'Work',fest:'Spoke at a literature festival',decade:'Decade',
    total:'awards',matched:'winners matched to a festival',certain:'certain',probable:'probable',before:'before the award',after:'after the award',near:'in the award year or the next',writerCard:'Writer card',none:'Nobody matches this choice.',
    note:'Source: the Sahitya Akademi list of Kannada awards (a file supplied by the owner). “Spoke at a literature festival” is that file’s own analysis: winners matched by name to the speaker lists of five festivals; the codes (BLF, BPF, KLF, Book Brahma, Mysuru) are as in the file, with no expansion given. Not yet reviewed. The Kannada text needs a native proofread.',
  },
}
const text=(value,locale)=>value?.[locale]||value?.kn||value?.en||''

export default function SahityaAwards({locale='kn',onShowWriter}){
  const t=copy[locale]||copy.kn,kn=locale==='kn'
  const [kind,setKind]=useState('all'),[query,setQuery]=useState(''),[decade,setDecade]=useState('all'),[onlyFest,setOnlyFest]=useState(false)
  const decades=useMemo(()=>[...new Set(sahityaAkademiAwards.map(a=>Math.floor(a.year/10)*10))].sort(),[])
  const rows=useMemo(()=>{
    const needle=query.trim().toLowerCase()
    return sahityaAkademiAwards.filter(a=>(kind==='all'||a.award===kind)&&(decade==='all'||Math.floor(a.year/10)*10===Number(decade))&&(!onlyFest||a.festivals)&&(!needle||`${a.winner} ${a.work}`.toLowerCase().includes(needle))).sort((a,b)=>b.year-a.year||a.winner.localeCompare(b.winner))
  },[kind,query,decade,onlyFest])
  const matched=new Set(sahityaAkademiAwards.filter(a=>a.festivals).map(a=>a.winner)).size
  return <section className="awards-section" aria-labelledby="awards-title">
    <h3 id="awards-title">{t.title}</h3><p>{t.intro}</p>
    <div className="authors-stats awards-stats"><span><b>{sahityaAkademiAwards.length}</b>{t.total}</span>{AWARD_KINDS.map(k=><span key={k}><b>{sahityaAkademiAwards.filter(a=>a.award===k).length}</b>{text(AWARD_KIND_LABELS[k],locale).split(' (')[0]}</span>)}<span><b>{matched}</b>{t.matched}</span></div>
    <div className="authors-filters">
      <div className="authors-chips" role="group" aria-label={t.kind}>{['all',...AWARD_KINDS].map(k=><button key={k} type="button" className={kind===k?'on':''} aria-pressed={kind===k} onClick={()=>setKind(k)}>{k==='all'?t.all:text(AWARD_KIND_LABELS[k],locale).split(' (')[0]}</button>)}</div>
      <label>{t.decade} <select value={decade} onChange={e=>setDecade(e.target.value)}><option value="all">{t.all}</option>{decades.map(d=><option key={d} value={d}>{d}s</option>)}</select></label>
      <label><input type="checkbox" checked={onlyFest} onChange={e=>setOnlyFest(e.target.checked)}/> {t.fest}</label>
      <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>
    </div>
    <div className="awards-table-wrap"><table className="awards-table"><thead><tr><th>{t.year}</th><th>{t.kind}</th><th>{t.winner}</th><th>{t.work}</th><th>{t.fest}</th></tr></thead>
      <tbody>{rows.length===0&&<tr><td colSpan="5" className="authors-empty">{t.none}</td></tr>}{rows.map(a=><tr key={a.id}>
        <td>{a.year}</td><td><span className={`award-kind k-${a.award.split(' ')[0].toLowerCase()}`}>{text(AWARD_KIND_LABELS[a.award],locale).split(' (')[0]}</span></td>
        <td><b>{a.winner}</b>{a.authorId&&<> <button type="button" className="award-writer" onClick={()=>onShowWriter?.(a.authorId)}>{t.writerCard} →</button></>}</td>
        <td>{a.work}</td>
        <td>{a.festivals?<span className="award-fest"><b>{a.festivals.list}</b> <i className={a.festivals.confidence}>{t[a.festivals.confidence]||a.festivals.confidence}</i><small>{[a.festivals.before&&t.before,a.festivals.after&&t.after,a.festivals.sameOrNextYear&&t.near].filter(Boolean).join(' · ')}</small></span>:'—'}</td>
      </tr>)}</tbody></table></div>
    <p className="press-note">{t.note}</p>
  </section>
}
