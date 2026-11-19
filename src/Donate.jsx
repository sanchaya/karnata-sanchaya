import { DonateSection } from './About'
import { SUPPORT_OPTIONS } from './support-options'
import './donate.css'

const copy={
  kn:{eyebrow:'ಸಹಯೋಗ · ದೇಣಿಗೆ',title:'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟವನ್ನು ಬೆಂಬಲಿಸಿ',intro:'ಈ ಅಟ್ಲಸ್ ಸ್ವಯಂಸೇವಕರ ಶ್ರಮದಿಂದ ಬೆಳೆಯುತ್ತಿದೆ. ದೇಣಿಗೆಗಳು ದತ್ತಾಂಶ ಪರಿಶೀಲನೆ, ಆಕರಗಳ ಡಿಜಿಟೈಸೇಶನ್ ಮತ್ತು ಸರ್ವರ್ ವೆಚ್ಚಕ್ಕೆ ನೆರವಾಗುತ್ತವೆ.',other:'ದೇಣಿಗೆ ಬದಲು ಕೊಡುಗೆ ನೀಡಲು ಬಯಸುವಿರಾ?',contribute:'ದಾಖಲೆ ಸೇರಿಸಿ ಅಥವಾ ತಿದ್ದಿ →',teaser:'ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಲಾಗದಿದ್ದರೂ, ದೇಣಿಗೆಯ ಮೂಲಕ ನೆರವಾಗಬಹುದು.',teaserLink:'ದೇಣಿಗೆ ಆಯ್ಕೆಗಳು →'},
  en:{eyebrow:'Contribute · Donate',title:'Support the Karnataka Historical Atlas',intro:'This atlas grows through volunteer effort. Donations help with record review, digitising sources and server costs.',other:'Would you rather contribute records?',contribute:'Add or correct a record →',teaser:'If you cannot add records, a donation also helps.',teaserLink:'See donation options →'},
}

export default function Donate({locale='kn'}){
  const t=copy[locale]||copy.kn,soon=SUPPORT_OPTIONS.filter(o=>o.status==='soon')
  return <main className="donate-page portal-page" id="donate">
    <section className="donate-hero explore-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div></section>
    <div id="donate-methods"><DonateSection locale={locale}/></div>
    <section className="support-options" aria-label={locale==='kn'?'ಬೇರೆ ರೀತಿಯಲ್ಲಿ ಬೆಂಬಲಿಸಿ':'Other ways to help'}><h3>{locale==='kn'?'ಹಣವಿಲ್ಲದೆಯೂ ಬೆಂಬಲಿಸಬಹುದು':'You can also help without money'}</h3><ul>{SUPPORT_OPTIONS.filter(o=>o.status==='live'&&o.id!=='donate').map(o=>{const [title,body]=o[locale]||o.en;return <li key={o.id}><span aria-hidden="true">{o.icon}</span><div><h4><a href={o.href} onClick={o.scrollTo?event=>{event.preventDefault();document.getElementById(o.scrollTo)?.scrollIntoView({behavior:'smooth',block:'start'})}:undefined}>{title} →</a></h4><p>{body}</p></div></li>})}</ul>
    {soon.length>0&&<p className="support-soon">{locale==='kn'?'ಶೀಘ್ರದಲ್ಲೇ: ':'Coming soon: '}{soon.map(o=>(o[locale]||o.en)[0]).join(' · ')}. <a href={`mailto:info@sanchifoundation.org?subject=${encodeURIComponent(locale==='kn'?'ಬೆಂಬಲ ಆಸಕ್ತಿ':'Interested in supporting')}`}>{locale==='kn'?'ಆಸಕ್ತಿ ತಿಳಿಸಿ':'Tell us you are interested'}</a></p>}</section>
    <p className="donate-alt">{t.other} <a href="#contribute">{t.contribute}</a></p>
  </main>
}

export function DonateTeaser({locale='kn'}){
  const t=copy[locale]||copy.kn
  return <p className="donate-teaser">{t.teaser} <a href="#donate">{t.teaserLink}</a></p>
}
