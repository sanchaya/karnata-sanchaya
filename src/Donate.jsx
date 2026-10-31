import { DonateSection } from './About'
import './donate.css'

const copy={
  kn:{eyebrow:'ಸಹಯೋಗ · ದೇಣಿಗೆ',title:'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟವನ್ನು ಬೆಂಬಲಿಸಿ',intro:'ಈ ಅಟ್ಲಸ್ ಸ್ವಯಂಸೇವಕರ ಶ್ರಮದಿಂದ ಬೆಳೆಯುತ್ತಿದೆ. ದೇಣಿಗೆಗಳು ದತ್ತಾಂಶ ಪರಿಶೀಲನೆ, ಆಕರಗಳ ಡಿಜಿಟೈಸೇಶನ್ ಮತ್ತು ಸರ್ವರ್ ವೆಚ್ಚಕ್ಕೆ ನೆರವಾಗುತ್ತವೆ.',other:'ದೇಣಿಗೆ ಬದಲು ಕೊಡುಗೆ ನೀಡಲು ಬಯಸುವಿರಾ?',contribute:'ದಾಖಲೆ ಸೇರಿಸಿ ಅಥವಾ ತಿದ್ದಿ →',teaser:'ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಲಾಗದಿದ್ದರೂ, ದೇಣಿಗೆಯ ಮೂಲಕ ನೆರವಾಗಬಹುದು.',teaserLink:'ದೇಣಿಗೆ ಆಯ್ಕೆಗಳು →'},
  en:{eyebrow:'Contribute · Donate',title:'Support the Karnataka Historical Atlas',intro:'This atlas grows through volunteer effort. Donations help with record review, digitising sources and server costs.',other:'Would you rather contribute records?',contribute:'Add or correct a record →',teaser:'If you cannot add records, a donation also helps.',teaserLink:'See donation options →'},
}

export default function Donate({locale='kn'}){
  const t=copy[locale]||copy.kn
  return <main className="donate-page portal-page" id="donate">
    <section className="donate-hero"><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></section>
    <DonateSection locale={locale}/>
    <p className="donate-alt">{t.other} <a href="#contribute">{t.contribute}</a></p>
  </main>
}

export function DonateTeaser({locale='kn'}){
  const t=copy[locale]||copy.kn
  return <p className="donate-teaser">{t.teaser} <a href="#donate">{t.teaserLink}</a></p>
}
