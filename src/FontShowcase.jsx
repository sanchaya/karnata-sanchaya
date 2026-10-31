import { useState } from 'react'
import { atlasData } from './data/atlas'
import { ERA_FONTS, PRINT_FONTS } from './data/era-fonts'
import './script-fonts.css'
import './font-showcase.css'

const copy={
  kn:{eyebrow:'ಸಂಶೋಧನೆ · ಫಾಂಟ್ಸ್',title:'ಕನ್ನಡ ಲಿಪಿಗಳು: ರಾಜವಂಶಗಳ ಮೂಲಕ',intro:'ಕರ್ನಾಟಕದ ರಾಜವಂಶಗಳ ಕಾಲದ ಮತ್ತು ಮುದ್ರಣ ಯುಗದ ಲಿಪಿಗಳಿಂದ ಪ್ರೇರಿತವಾದ ಫಾಂಟ್‌ಗಳು. ನಿಮ್ಮದೇ ಪಠ್ಯ ಟೈಪ್ ಮಾಡಿ ನೋಡಿ.',dynasties:'ರಾಜವಂಶಗಳು',print:'ಮುದ್ರಣ ಯುಗ',label:'ನಿಮ್ಮ ಪಠ್ಯ',size:'ಗಾತ್ರ',reset:'ಮೊದಲಿನಂತೆ',sample:'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ',note:'ಇವು ಆಧುನಿಕ ವ್ಯಾಖ್ಯಾನಗಳು, ಶಾಸನದ ನಕಲುಗಳಲ್ಲ. ಇಲ್ಲಿರುವ ಪ್ರತಿಗಳು ಕನ್ನಡ ಮತ್ತು ಮೂಲ ಲ್ಯಾಟಿನ್ ಅಕ್ಷರಗಳಿಗೆ ಮಾತ್ರ ಸೀಮಿತ; ಪೂರ್ಣ ಫಾಂಟ್‌ಗಳಿಗೆ ಫಾಂಟ್ಸ್ ಸಂಚಯ ನೋಡಿ.',more:'ಫಾಂಟ್ಸ್ ಸಂಚಯದಲ್ಲಿ ತೆರೆಯಿರಿ',phase:'ಲಿಪಿ ವಿಕಾಸದಲ್ಲಿ ನೋಡಿ',credit:'ವಿನ್ಯಾಸ'},
  en:{eyebrow:'Research · Fonts',title:'Kannada scripts through the dynasties',intro:'Typefaces inspired by the scripts of Karnataka’s dynasties and the print era. Type your own text to try them.',dynasties:'Dynasties',print:'Print era',label:'Your text',size:'Size',reset:'Reset',sample:'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ',note:'These are modern interpretations, not facsimiles of inscriptions. The copies here are limited to Kannada and basic Latin; see Fonts Sanchaya for the full fonts.',more:'Open in Fonts Sanchaya',phase:'See in Script evolution',credit:'Design'},
}
const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const entityById=new Map(atlasData.polities.map(record=>[record.id,record]))

export default function FontShowcase({locale='kn',onOpenScripts}){
  const t=copy[locale]||copy.kn
  const [sample,setSample]=useState('')
  const [size,setSize]=useState(40)
  const shown=sample||t.sample
  const dynasties=Object.entries(ERA_FONTS).map(([id,font])=>({id,font,date:entityById.get(id)?.date})).sort((a,b)=>(a.date?.from??0)-(b.date?.from??0))
  const specimen=(font,key,dates)=><article key={key} className="font-card">
    <div className="font-card-head"><div><h4>{text(font.name,locale)}</h4><small>{dates||text(font.note,locale)}</small></div></div>
    <p className="font-card-sample" lang="kn" style={{fontFamily:`"${font.family}",serif`,fontSize:`${size}px`}}>{shown}</p>
    <p className="font-card-meta"><span>{font.family}</span>{font.credit&&<span>{t.credit}: {font.credit}</span>}</p>
  </article>
  return <main className="font-page portal-page" id="fonts">
    <section className="font-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div><a href="https://fonts.sanchaya.net/kingdom-showcase" target="_blank" rel="noreferrer">{t.more} ↗</a></section>
    <section className="font-controls" aria-label={t.label}>
      <label><span>{t.label}</span><input value={sample} onChange={event=>setSample(event.target.value)} placeholder={t.sample} maxLength={80} lang="kn"/></label>
      <label><span>{t.size} · {size}px</span><input type="range" min="20" max="88" value={size} onChange={event=>setSize(Number(event.target.value))}/></label>
      <button type="button" onClick={()=>{setSample('');setSize(40)}}>{t.reset}</button>
    </section>
    <section className="font-group"><h3>{t.dynasties}</h3><div className="font-grid">{dynasties.map(({id,font,date})=>specimen({...font,note:font.note},id,`${text(font.note,locale)}${date?` · ${date.from}–${date.to} CE`:''}`))}</div></section>
    <section className="font-group"><h3>{t.print}</h3><div className="font-grid">{PRINT_FONTS.map(font=>specimen(font,font.family))}</div></section>
    <p className="font-note">{t.note}{onOpenScripts&&<> <a href="#scripts">{t.phase} →</a></>}</p>
  </main>
}
