import { useEffect, useState } from 'react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { loadDistricts } from './DynastyAreasLayer'
import { sendOutbound } from './visit-ping'
import { atlasData } from './data/atlas'
import { oldGames, bookFacts, bedaNames, gamePlaces } from './data/old-games'
import { folkCatalogueNames } from './data/folk-game-catalogues.generated'
import './recreation.css'

export const copy={
  kn:{eyebrow:'ಅನ್ವೇಷಣೆ · ಆಟ ಮತ್ತು ವಿನೋದ',title:'ಕರ್ನಾಟಕದ ಹಳೆಯ ಆಟಗಳು ಮತ್ತು ವಿನೋದ',intro:'ಆಸ್ಥಾನದ ಚದುರಂಗದಿಂದ ಹಳ್ಳಿಯ ಚಿನ್ನಿದಾಂಡುವರೆಗೆ, ಜಾತ್ರೆಯ ಸ್ಪರ್ಧೆಗಳಿಂದ ಇಂದಿನ ಮೈದಾನದವರೆಗೆ. ಇಲ್ಲಿರುವುದು ಸಂಶೋಧನೆಯ ಆರಂಭದ ಪಟ್ಟಿ: ಪ್ರತಿ ಸಾಲಿನಲ್ಲಿ ಆಕರವನ್ನು ಓದಲಾಗಿದೆಯೇ ಇಲ್ಲವೇ ಎಂದು ತೋರಿಸಿದ್ದೇವೆ.',
    tabs:{games:'ಆಟಗಳು',festivals:'ಜಾತ್ರೆ, ಹಬ್ಬ',modern:'ಇಂದಿನ ಮತ್ತು ಕ್ಲಬ್',map:'ನಕ್ಷೆ',names:'ಹೆಸರುಗಳು',books:'ಪುಸ್ತಕಗಳಿಂದ'},search:'ಹುಡುಕಿ: ಆಟದ ಹೆಸರು, ಊರು…',allChip:'ಎಲ್ಲಾ',showing:'ತೋರಿಸಲಾಗಿದೆ',of:'/',none:'ಯಾವುದೂ ಸಿಗಲಿಲ್ಲ',more:'ವಿವರ',factKinds:{people:'ವ್ಯಕ್ತಿಗಳು',heritage:'ಪರಂಪರೆ',history:'ಇತಿಹಾಸ',culture:'ಸಂಸ್ಕೃತಿ'},mapTitle:'ದಾಖಲಾದ ಸ್ಥಳಗಳು',mapNote:'ಬಣ್ಣದ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಒಂದು ಅಧ್ಯಯನ, ಜಾತ್ರೆ ಅಥವಾ ಸಂಗ್ರಹ ದಾಖಲಾಗಿದೆ. ಆ ಆಟ ಅಲ್ಲಿ ಮಾತ್ರ ಇತ್ತು ಎಂದಲ್ಲ.',pick:'ಒಂದು ಜಿಲ್ಲೆ ಆರಿಸಿ',catTitle:'ಜಿಲ್ಲಾ ಅಧ್ಯಯನಗಳಲ್ಲಿ ದಾಖಲಾದ ಆಟಗಳ ಹೆಸರುಗಳು',catNote:'ಅಧ್ಯಯನಗಳಲ್ಲಿ ಮುದ್ರಿತ ಹೆಸರುಗಳು; ಕೆಲವು ಕಾಗುಣಿತಗಳಲ್ಲಿ ತಪ್ಪುಗಳಿರಬಹುದು.',factsTitle:'ಪುಸ್ತಕಗಳಲ್ಲಿ ಹೆಸರಿಸಿದ ವ್ಯಕ್ತಿ, ಪರಂಪರೆ, ಇತಿಹಾಸ',groups:{'strength-outdoor':'ಹೊರಾಂಗಣ, ದೈಹಿಕ ಸಾಮರ್ಥ್ಯ','mind-indoor':'ಒಳಾಂಗಣ, ಬುದ್ಧಿ ಮತ್ತು ಸೂಕ್ಷ್ಮತೆ','festival-tradition':'ಹಬ್ಬ-ಹರಿದಿನ, ಸಂಪ್ರದಾಯ','animal-bird':'ಪ್ರಾಣಿ-ಪಕ್ಷಿ','fun-contests':'ಮೋಜಿನ ಸ್ಪರ್ಧೆಗಳು'},studies:{chitradurga:'ಚಿತ್ರದುರ್ಗ ಜಿಲ್ಲೆ (೨೦೧೭)',bidar:'ಬೀದರ ಜಿಲ್ಲೆ (೨೦೦೬, ೨೦೦೯)',beda:'ಬಳ್ಳಾರಿ ಬೇಡ ಸಮುದಾಯ (೨೦೦೪)'},
    status:{read:'ಆಕರ ಓದಲಾಗಿದೆ',lead:'ಸುಳಿವು · ಇನ್ನೂ ದೃಢಪಟ್ಟಿಲ್ಲ',oral:'ಮೌಖಿಕ ಪರಂಪರೆ · ಸಾಕ್ಷ್ಯ ಬೇಕು'},
    kinds:{club:'ವಸಾಹತು ಕಾಲದ ಕ್ಲಬ್ ಮತ್ತು ಆಮದು ಕ್ರೀಡೆಗಳು',fair:'ಜಾತ್ರೆ ಮತ್ತು ಹಬ್ಬ',board:'ಹಲಗೆ, ದಾಳ, ಎಲೆ ಆಟಗಳು',village:'ಹಳ್ಳಿ ಮತ್ತು ಮಕ್ಕಳ ಆಟಗಳು',strength:'ಶಕ್ತಿ ಮತ್ತು ಗ್ರಾಮೀಣ ಕ್ರೀಡೆ',field:'ಮೈದಾನದ ಆಟಗಳು'},
    eras:'ಯುಗದ ದಾಖಲೆಗಳು',erasNote:'ಅಟ್ಲಸ್‌ನಲ್ಲಿ ಈಗಾಗಲೇ ಇರುವ ಸಂಶೋಧನಾ ಸುಳಿವುಗಳು (ಪರಿಶೀಲನೆ ಬಾಕಿ).',few:'ಈ ವಿಭಾಗದಲ್ಲಿ ಇನ್ನೂ ಕಡಿಮೆ ದಾಖಲೆಗಳಿವೆ. ನೀವು ಸೇರಿಸಬಹುದು.',
    where:'ಎಲ್ಲಿ',when:'ಕಾಲ',source:'ಆಕರ',review:'ಕನ್ನಡ ಪಠ್ಯ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಬಾಕಿ.',
    playTitle:'ಈ ಆಟಗಳನ್ನು ಆಡಿ ನೋಡಿ',playText:'ಅಳಿಗುಳಿಮನೆ, ಆಡು-ಹುಲಿ, ಚೌಕಾಬಾರ, ನವಕಂಕರಿ ಮುಂತಾದ ಆಟಗಳನ್ನು ಮೈಸೂರಿನ ಟ್ರಿಟಾ ಇನ್ಫೋಟೈನ್‌ಮೆಂಟ್ ಎಲ್‌ಎಲ್‌ಪಿ ನಡೆಸುವ ‘ಟೊಳ್ಳುಗಟ್ಟಿ’ಯಲ್ಲಿ ಮೊಬೈಲ್ ಮತ್ತು ವೆಬ್‌ನಲ್ಲಿ ಆಡಬಹುದು. ಸ್ಥಳೀಯ ಉದ್ಯಮಕ್ಕೆ ನಮ್ಮ ಬೆಂಬಲದ ಸೂಚನೆ.',playButton:'ಟೊಳ್ಳುಗಟ್ಟಿಯಲ್ಲಿ ಆಡಿ',helpTitle:'ನಿಮ್ಮ ಊರಿನ ಆಟ ನಿಮಗೆ ಗೊತ್ತೇ?',help:'ಅಜ್ಜ-ಅಜ್ಜಿ ಹೇಳಿದ ಆಟ, ನಿಮ್ಮ ಹಳ್ಳಿಯ ಹೆಸರು, ನಿಯಮಗಳನ್ನು ಸೇರಿಸಿ. ಹೇಳಿದವರ ಒಪ್ಪಿಗೆ ಮತ್ತು ವಯಸ್ಸು ಕೇಳುತ್ತೇವೆ; ಪರಿಶೀಲನೆಯ ನಂತರವೇ ಪ್ರಕಟವಾಗುತ್ತದೆ.',add:'ಆಟವನ್ನು ಸೇರಿಸಿ',all:'ಎಲ್ಲಾ ಆಟಗಳ ಮೂಲ ಪಟ್ಟಿ'},
  en:{eyebrow:'Explore · Games and recreation',title:'Old games and recreation of Karnataka',intro:'From the court’s chess to the village’s chinni-daandu, from fair-day contests to today’s grounds. This is an early research list: every row says whether its source has actually been read.',
    tabs:{games:'Games',festivals:'Fairs & festivals',modern:'Modern & clubs',map:'Map',names:'Names',books:'From the books'},search:'Search: game, place…',allChip:'All',showing:'Showing',of:'of',none:'Nothing matches',more:'Details',factKinds:{people:'People',heritage:'Heritage',history:'History',culture:'Culture'},mapTitle:'Where it is recorded',mapNote:'Shaded districts have a study, fair or collection on record. It does not mean the game was played only there.',pick:'Pick a district',catTitle:'Game names recorded in the district studies',catNote:'Names as printed in the studies; a few spellings may contain slips.',factsTitle:'People, heritage and history named in the books',groups:{'strength-outdoor':'Outdoor, physical strength','mind-indoor':'Indoor, mind and skill','festival-tradition':'Festival and tradition','animal-bird':'Animal and bird','fun-contests':'Fun contests'},studies:{chitradurga:'Chitradurga district (2017)',bidar:'Bidar district (2006, 2009)',beda:'Ballari Beda community (2004)'},
    status:{read:'Source read',lead:'Lead · not yet verified',oral:'Oral tradition · testimony wanted'},
    kinds:{club:'Colonial clubs and imported sports',fair:'Fairs (jātre) and festivals',board:'Board, dice and card games',village:'Village and children’s games',strength:'Strength and rural sport',field:'Field and team sport'},
    eras:'Records by era',erasNote:'Research leads already in the atlas (review pending).',few:'Few records here so far. You can add one.',
    where:'Where',when:'When',source:'Source',review:'Kannada text awaits a native proofread.',
    playTitle:'Play these games',playText:'Ali Guli Mane, Aadu Huli, Chowka Bara, Navakankari and more can be played on mobile and web at TolluGatti, run by Trita Infotainment LLP in Mysuru. A small gesture of support for a local venture.',playButton:'Play on TolluGatti',helpTitle:'Do you know a game from your village?',help:'Add a game your grandparents played: its name in your village, the rules, where. We ask the person’s consent and age, and nothing appears until it is reviewed.',add:'Add a game',all:'Full working list'}
}
export const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const years=date=>date?`${date.precision==='circa'?'c. ':''}${date.from}${date.to&&date.to!==date.from?`–${date.to}`:''} ${date.era||'CE'}`:''
const cultural=atlasData.culturalHeritage||[]
const GAME_ERAS=cultural.filter(item=>item.category==='games-sports'&&!['culture-mysuru-dasara-equestrian','culture-colonial-bengaluru-sports','culture-modern-karnataka-indigenous-games'].includes(item.id))
const FESTIVAL_ERAS=cultural.filter(item=>['celebration','religious-tradition'].includes(item.category)||item.id==='culture-mysuru-dasara-equestrian')
const MODERN_ERAS=cultural.filter(item=>['culture-colonial-bengaluru-sports','culture-modern-karnataka-indigenous-games'].includes(item.id))

export const KIND_COLOR={study:'#4361ee',fair:'#a43f67',craft:'#b9801a',club:'#28785b'}
export function GamesMap({t,locale,compact=false,places=gamePlaces}){
  const [districts,setDistricts]=useState(null),[pick,setPick]=useState('')
  useEffect(()=>{let live=true;loadDistricts().then(data=>{if(live)setDistricts(data)});return()=>{live=false}},[])
  const byDistrict=new Map(places.map(place=>[place.district,place]))
  const chosen=byDistrict.get(pick)
  const style=feature=>{const has=byDistrict.has(feature.properties.district);return {color:has?'#3f37c9':'#9aa0b4',weight:feature.properties.district===pick?3:1,fillColor:has?'#4361ee':'#e8eaf2',fillOpacity:has?.35:.15}}
  const onEach=(feature,layer)=>{const name=feature.properties.districtName?.[locale]||feature.properties.district;layer.bindTooltip(name);layer.on('click',()=>byDistrict.has(feature.properties.district)&&setPick(feature.properties.district))}
  return <section className={`recreation-map${compact?' compact':''}`}>{compact?null:<h2>{t.mapTitle}</h2>}<p className="recreation-note">{t.mapNote}</p>
    <div className="recreation-map-box"><MapContainer bounds={[[11.5,74],[18.5,78.6]]} scrollWheelZoom={false} zoomSnap={0.25} style={{height:'100%',width:'100%'}}><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>{districts&&<GeoJSON key={pick} data={districts} style={style} onEachFeature={onEach}/>}</MapContainer></div>
    <div className="recreation-map-list" aria-live="polite">{chosen?<><h3>{(districts?.features.find(f=>f.properties.district===pick)?.properties.districtName?.[locale])||pick}</h3><ul>{chosen.items.map(item=><li key={item.title}><i style={{background:KIND_COLOR[item.kind]}}/>{item.title}<small> · {item.src}</small></li>)}</ul></>:<p>{t.pick}</p>}</div></section>
}

function Catalogues({t}){
  const chit=folkCatalogueNames.chitradurga,groupLabel=t.groups
  return <section className="recreation-group"><h2>{t.catTitle}</h2><p className="recreation-note">{t.catNote}</p>
    <details className="recreation-cat"><summary>{t.studies.chitradurga} · {Object.values(chit).reduce((n,list)=>n+list.length,0)}</summary>{Object.entries(chit).map(([group,list])=><div key={group}><h3>{groupLabel[group]}</h3><p className="recreation-chips">{list.map(item=><span key={group+item.n+item.name}>{item.name}</span>)}</p></div>)}</details>
    <details className="recreation-cat"><summary>{t.studies.bidar} · {folkCatalogueNames.bidar.length}</summary><p className="recreation-chips">{folkCatalogueNames.bidar.map(name=><span key={name}>{name}</span>)}</p></details>
    <details className="recreation-cat"><summary>{t.studies.beda} · {bedaNames.length}</summary><p className="recreation-chips">{bedaNames.map(name=><span key={name}>{name}</span>)}</p></details>
  </section>
}

const STATUSES=['read','lead','oral']
const searchable=game=>[game.name.en,game.name.kn,game.places?.en,game.places?.kn,game.note?.en].join(' ').toLowerCase()

export function Row({game,t,locale}){
  return <details className={`rec-row status-${game.status}`}><summary><span className="rec-name">{text(game.name,locale)}</span><span className="rec-badge">{t.status[game.status]}</span><span className="rec-place">{text(game.places,locale)}</span></summary>
    <div className="rec-body"><p>{text(game.note,locale)}</p><dl><div><dt>{t.when}</dt><dd>{text(game.period,locale)}</dd></div><div><dt>{t.where}</dt><dd>{text(game.places,locale)}</dd></div></dl>
      {game.evidence.length>0&&<><h4>{t.source}</h4><ul>{game.evidence.map(item=><li key={item.title}>{item.title}<small> · {item.locator}</small></li>)}</ul></>}</div></details>
}

export function Toolbar({t,query,setQuery,status,setStatus,kinds,kind,setKind,shown,total}){
  return <div className="rec-toolbar"><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.search} aria-label={t.search}/>
    <div className="rec-chips" role="group" aria-label="status">{['all',...STATUSES].map(key=><button key={key} type="button" className={status===key?'on':''} aria-pressed={status===key} onClick={()=>setStatus(key)}>{key==='all'?t.allChip:t.status[key].split('·')[0].trim()}</button>)}</div>
    {kinds&&<div className="rec-chips" role="group" aria-label="kind">{['all',...kinds].map(key=><button key={key} type="button" className={kind===key?'on':''} aria-pressed={kind===key} onClick={()=>setKind(key)}>{key==='all'?t.allChip:t.kinds[key]}</button>)}</div>}
    <span className="rec-count">{t.showing} {shown} {t.of} {total}</span></div>
}

export function EraRecords({t,locale,eras}){
  if(!eras.length)return null
  return <details className="rec-eras"><summary>{t.eras} · {eras.length}</summary><p className="recreation-note">{t.erasNote}</p><ul className="recreation-eras">{eras.map(item=><li key={item.id}><strong>{text(item.name,locale)}</strong><span>{years(item.date)}</span><p>{text(item.description,locale)||text(item.summary,locale)}</p></li>)}</ul></details>
}

function PlayBanner({t}){
  return <section className="recreation-play"><img className="recreation-play-logo" src={`${import.meta.env.BASE_URL}partners/tollugatti.png`} alt="TolluGatti" width="48" height="48" loading="lazy"/><div><strong>{t.playTitle}</strong><p>{t.playText}</p></div><a className="recreation-button" href="https://www.tollugatti.com/games?utm_source=karnata.sanchaya.net&utm_medium=referral&utm_campaign=old-games" target="_blank" rel="noopener" onClick={()=>sendOutbound('tollugatti','recreation')}>{t.playButton} ↗</a></section>
}

export default function RecreationPage({locale='kn'}){
  const t=copy[locale]||copy.kn,[tab,setTab]=useState('games'),[query,setQuery]=useState(''),[status,setStatus]=useState('all'),[kind,setKind]=useState('all'),[factKind,setFactKind]=useState('all')
  const tabGroups={games:g=>!['field','fair','club'].includes(g.kind),festivals:g=>g.kind==='fair',modern:g=>['field','club'].includes(g.kind)}
  const pool=tabGroups[tab]?oldGames.filter(tabGroups[tab]):[]
  const q=query.trim().toLowerCase()
  const list=pool.filter(g=>(status==='all'||g.status===status)&&(kind==='all'||g.kind===kind)&&(!q||searchable(g).includes(q)))
  const gameKinds=['board','village','strength']
  const eras=tab==='games'?GAME_ERAS:tab==='festivals'?FESTIVAL_ERAS:tab==='modern'?MODERN_ERAS:[]
  const contribute=`${window.location.pathname}?contributeType=culturalHeritage&contributeAction=create#contribute`
  const go=key=>{setTab(key);setQuery('');setStatus('all');setKind('all')}
  const counts={games:oldGames.filter(tabGroups.games).length,festivals:oldGames.filter(tabGroups.festivals).length,modern:oldGames.filter(tabGroups.modern).length,books:bookFacts.length}
  const facts=bookFacts.filter(fact=>factKind==='all'||fact.kind===factKind)
  return <main className="portal-page recreation-page" id="recreation">
    <section className="recreation-hero explore-hero"><div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p>{locale==='kn'&&<small>{t.review}</small>}</div><a className="recreation-button" href={contribute}>{t.add}</a></section>
    <nav className="recreation-tabs" role="tablist" aria-label={t.title}>{Object.entries(t.tabs).map(([key,label])=><button key={key} type="button" role="tab" aria-selected={tab===key} className={tab===key?'active':''} onClick={()=>go(key)}>{label}{counts[key]!==undefined&&<b>{counts[key]}</b>}</button>)}</nav>
    {tabGroups[tab]&&<>
      {tab==='games'&&<PlayBanner t={t}/>}
      {tab==='games'&&<details className="rec-mapbox" open><summary>{t.mapTitle}</summary><GamesMap t={t} locale={locale} compact/></details>}
      <Toolbar t={t} query={query} setQuery={setQuery} status={status} setStatus={setStatus} kinds={tab==='games'?gameKinds:null} kind={kind} setKind={setKind} shown={list.length} total={pool.length}/>
      {list.length?<div className="rec-list">{list.map(game=><Row key={game.id} game={game} t={t} locale={locale}/>)}</div>:<p className="recreation-note">{t.none}</p>}
      <EraRecords t={t} locale={locale} eras={eras}/>
    </>}
    {tab==='map'&&<GamesMap t={t} locale={locale}/>}
    {tab==='names'&&<Catalogues t={t}/>}
    {tab==='books'&&<section className="recreation-group"><h2>{t.factsTitle}</h2><div className="rec-chips" role="group">{['all',...Object.keys(t.factKinds)].map(key=><button key={key} type="button" className={factKind===key?'on':''} aria-pressed={factKind===key} onClick={()=>setFactKind(key)}>{key==='all'?t.allChip:t.factKinds[key]}</button>)}</div><ul className="recreation-eras">{facts.map(fact=><li key={fact.title.en}><strong>{text(fact.title,locale)}</strong><span>{t.factKinds[fact.kind]}</span><p>{text(fact.note,locale)}</p><small>{fact.src}</small></li>)}</ul></section>}
    <p className="recreation-foot"><a href="https://github.com/sanchaya/karnata-sanchaya/blob/main/docs/games-of-karnataka.md" target="_blank" rel="noopener">{locale==='kn'?'ಎಲ್ಲಾ ಆಟಗಳ ಮೂಲ ಪಟ್ಟಿ':'Full working list'}</a></p>
  </main>
}
