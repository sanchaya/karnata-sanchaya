import { useState } from 'react'
import { atlasData } from './data/atlas'
import { oldGames } from './data/old-games'
import './recreation.css'

const copy={
  kn:{eyebrow:'ಅನ್ವೇಷಣೆ · ಆಟ ಮತ್ತು ವಿನೋದ',title:'ಕರ್ನಾಟಕದ ಹಳೆಯ ಆಟಗಳು ಮತ್ತು ವಿನೋದ',intro:'ಆಸ್ಥಾನದ ಚದುರಂಗದಿಂದ ಹಳ್ಳಿಯ ಚಿನ್ನಿದಾಂಡುವರೆಗೆ, ಜಾತ್ರೆಯ ಸ್ಪರ್ಧೆಗಳಿಂದ ಇಂದಿನ ಮೈದಾನದವರೆಗೆ. ಇಲ್ಲಿರುವುದು ಸಂಶೋಧನೆಯ ಆರಂಭದ ಪಟ್ಟಿ: ಪ್ರತಿ ಸಾಲಿನಲ್ಲಿ ಆಕರವನ್ನು ಓದಲಾಗಿದೆಯೇ ಇಲ್ಲವೇ ಎಂದು ತೋರಿಸಿದ್ದೇವೆ.',
    tabs:{games:'ಆಟಗಳು',festivals:'ಹಬ್ಬ ಮತ್ತು ಪ್ರದರ್ಶನ',modern:'ಇಂದಿನ ವಿನೋದ'},
    status:{read:'ಆಕರ ಓದಲಾಗಿದೆ',lead:'ಸುಳಿವು · ಇನ್ನೂ ದೃಢಪಟ್ಟಿಲ್ಲ',oral:'ಮೌಖಿಕ ಪರಂಪರೆ · ಸಾಕ್ಷ್ಯ ಬೇಕು'},
    kinds:{board:'ಹಲಗೆ, ದಾಳ, ಎಲೆ ಆಟಗಳು',village:'ಹಳ್ಳಿ ಮತ್ತು ಮಕ್ಕಳ ಆಟಗಳು',strength:'ಶಕ್ತಿ ಮತ್ತು ಗ್ರಾಮೀಣ ಕ್ರೀಡೆ',field:'ಮೈದಾನದ ಆಟಗಳು'},
    eras:'ಯುಗದ ದಾಖಲೆಗಳು',erasNote:'ಅಟ್ಲಸ್‌ನಲ್ಲಿ ಈಗಾಗಲೇ ಇರುವ ಸಂಶೋಧನಾ ಸುಳಿವುಗಳು (ಪರಿಶೀಲನೆ ಬಾಕಿ).',few:'ಈ ವಿಭಾಗದಲ್ಲಿ ಇನ್ನೂ ಕಡಿಮೆ ದಾಖಲೆಗಳಿವೆ. ನೀವು ಸೇರಿಸಬಹುದು.',
    where:'ಎಲ್ಲಿ',when:'ಕಾಲ',source:'ಆಕರ',review:'ಕನ್ನಡ ಪಠ್ಯ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಬಾಕಿ.',
    helpTitle:'ನಿಮ್ಮ ಊರಿನ ಆಟ ನಿಮಗೆ ಗೊತ್ತೇ?',help:'ಅಜ್ಜ-ಅಜ್ಜಿ ಹೇಳಿದ ಆಟ, ನಿಮ್ಮ ಹಳ್ಳಿಯ ಹೆಸರು, ನಿಯಮಗಳನ್ನು ಸೇರಿಸಿ. ಹೇಳಿದವರ ಒಪ್ಪಿಗೆ ಮತ್ತು ವಯಸ್ಸು ಕೇಳುತ್ತೇವೆ; ಪರಿಶೀಲನೆಯ ನಂತರವೇ ಪ್ರಕಟವಾಗುತ್ತದೆ.',add:'ಆಟವನ್ನು ಸೇರಿಸಿ',all:'ಎಲ್ಲಾ ಆಟಗಳ ಮೂಲ ಪಟ್ಟಿ'},
  en:{eyebrow:'Explore · Games and recreation',title:'Old games and recreation of Karnataka',intro:'From the court’s chess to the village’s chinni-daandu, from fair-day contests to today’s grounds. This is an early research list: every row says whether its source has actually been read.',
    tabs:{games:'Games',festivals:'Festivals and performance',modern:'Modern leisure'},
    status:{read:'Source read',lead:'Lead · not yet verified',oral:'Oral tradition · testimony wanted'},
    kinds:{board:'Board, dice and card games',village:'Village and children’s games',strength:'Strength and rural sport',field:'Field and team sport'},
    eras:'Records by era',erasNote:'Research leads already in the atlas (review pending).',few:'Few records here so far. You can add one.',
    where:'Where',when:'When',source:'Source',review:'Kannada text awaits a native proofread.',
    helpTitle:'Do you know a game from your village?',help:'Add a game your grandparents played: its name in your village, the rules, where. We ask the person’s consent and age, and nothing appears until it is reviewed.',add:'Add a game',all:'Full working list'}
}
const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const years=date=>date?`${date.precision==='circa'?'c. ':''}${date.from}${date.to&&date.to!==date.from?`–${date.to}`:''} ${date.era||'CE'}`:''
const cultural=atlasData.culturalHeritage||[]
const GAME_ERAS=cultural.filter(item=>item.category==='games-sports'&&!['culture-mysuru-dasara-equestrian','culture-colonial-bengaluru-sports','culture-modern-karnataka-indigenous-games'].includes(item.id))
const FESTIVAL_ERAS=cultural.filter(item=>['celebration','religious-tradition'].includes(item.category)||item.id==='culture-mysuru-dasara-equestrian')
const MODERN_ERAS=cultural.filter(item=>['culture-colonial-bengaluru-sports','culture-modern-karnataka-indigenous-games'].includes(item.id))

export default function RecreationPage({locale='kn'}){
  const t=copy[locale]||copy.kn,[tab,setTab]=useState('games')
  const games=oldGames.filter(game=>tab==='games'?game.kind!=='field':tab==='modern'&&game.kind==='field')
  const kinds=[...new Set(games.map(game=>game.kind))]
  const eras=tab==='games'?GAME_ERAS:tab==='festivals'?FESTIVAL_ERAS:MODERN_ERAS
  const contribute=`${window.location.pathname}?contributeType=culturalHeritage&contributeAction=create#contribute`
  return <main className="portal-page recreation-page" id="recreation">
    <section className="recreation-hero"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p>{locale==='kn'&&<small>{t.review}</small>}</section>
    <nav className="recreation-tabs" role="tablist" aria-label={t.title}>{Object.entries(t.tabs).map(([key,label])=><button key={key} type="button" role="tab" aria-selected={tab===key} className={tab===key?'active':''} onClick={()=>setTab(key)}>{label}</button>)}</nav>
    {kinds.map(kind=><section key={kind} className="recreation-group"><h2>{t.kinds[kind]}</h2><div className="recreation-grid">{games.filter(game=>game.kind===kind).map(game=><article key={game.id} className={`recreation-card status-${game.status}`}>
      <h3>{text(game.name,locale)}</h3><p className="recreation-status">{t.status[game.status]}</p><p>{text(game.note,locale)}</p>
      <dl><div><dt>{t.when}</dt><dd>{text(game.period,locale)}</dd></div><div><dt>{t.where}</dt><dd>{text(game.places,locale)}</dd></div></dl>
      {game.evidence.length>0&&<details><summary>{t.source}</summary><ul>{game.evidence.map(item=><li key={item.title}>{item.title}<small> · {item.locator}</small></li>)}</ul></details>}
    </article>)}</div></section>)}
    <section className="recreation-group"><h2>{t.eras}</h2><p className="recreation-note">{t.erasNote}</p>
      {eras.length?<ul className="recreation-eras">{eras.map(item=><li key={item.id}><strong>{text(item.name,locale)}</strong><span>{years(item.date)}</span><p>{text(item.description,locale)||text(item.summary,locale)}</p></li>)}</ul>:<p>{t.few}</p>}
    </section>
    <section className="recreation-help"><h2>{t.helpTitle}</h2><p>{t.help}</p><a className="recreation-button" href={contribute}>{t.add}</a> <a href="https://github.com/sanchaya/karnata-sanchaya/blob/main/docs/games-of-karnataka.md" target="_blank" rel="noopener">{t.all}</a></section>
  </main>
}
