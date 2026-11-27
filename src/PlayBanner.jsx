import { sendOutbound } from './visit-ping'
import './recreation.css'

const copy={
  kn:{playTitle:'ಈ ಆಟಗಳನ್ನು ಆಡಿ ನೋಡಿ',playText:'ಅಳಿಗುಳಿಮನೆ, ಆಡು-ಹುಲಿ, ಚೌಕಾಬಾರ, ನವಕಂಕರಿ ಮುಂತಾದ ಆಟಗಳನ್ನು ಮೈಸೂರಿನ ಟ್ರಿಟಾ ಇನ್ಫೋಟೈನ್‌ಮೆಂಟ್ ಎಲ್‌ಎಲ್‌ಪಿ ನಡೆಸುವ ‘ಟೊಳ್ಳುಗಟ್ಟಿ’ಯಲ್ಲಿ ಮೊಬೈಲ್ ಮತ್ತು ವೆಬ್‌ನಲ್ಲಿ ಆಡಬಹುದು. ಸ್ಥಳೀಯ ಉದ್ಯಮಕ್ಕೆ ನಮ್ಮ ಬೆಂಬಲದ ಸೂಚನೆ.',playButton:'ಟೊಳ್ಳುಗಟ್ಟಿಯಲ್ಲಿ ಆಡಿ'},
  en:{playTitle:'Play these games',playText:'Ali Guli Mane, Aadu Huli, Chowka Bara, Navakankari and more can be played on mobile and web at TolluGatti, run by Trita Infotainment LLP in Mysuru. A small gesture of support for a local venture.',playButton:'Play on TolluGatti'},
}

// Link to the old games on TolluGatti (a Mysuru venture); the click is counted anonymously, with the page it came from.
export default function PlayBanner({locale='kn',source}){
  const t=copy[locale]||copy.kn
  return <section className="recreation-play"><img className="recreation-play-logo" src={`${import.meta.env.BASE_URL}partners/tollugatti.png`} alt="TolluGatti" width="48" height="48" loading="lazy"/><div><strong>{t.playTitle}</strong><p>{t.playText}</p></div><a className="recreation-button" href={`https://www.tollugatti.com/games?utm_source=karnata.sanchaya.net&utm_medium=referral&utm_campaign=${source==='aata-paata'?'aata-paata':'old-games'}`} target="_blank" rel="noopener" onClick={()=>sendOutbound('tollugatti',source)}>{t.playButton} ↗</a></section>
}
