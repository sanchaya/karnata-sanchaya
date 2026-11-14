import { useEffect, useRef, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet'
import { CULTURE, FLYWAYS, IMAGES } from './species-data'
import MigrationGlobe, { countryName } from './MigrationGlobe'

const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_KN=['ಜ','ಫೆ','ಮಾ','ಏ','ಮೇ','ಜೂ','ಜು','ಆ','ಸೆ','ಅ','ನ','ದ']
const SEASON={resident:['Resident','ವರ್ಷವಿಡೀ ಇರುವ'],'winter-visitor':['Winter visitor','ಚಳಿಗಾಲದ ವಲಸೆ ಹಕ್ಕಿ'],'summer-visitor':['Summer / monsoon visitor','ಬೇಸಿಗೆ / ಮಳೆಗಾಲದ ಅತಿಥಿ'],'passage-or-local-movement':['Passage or local movement','ಹಾದುಹೋಗುವ / ಸ್ಥಳೀಯ ಚಲನೆ']}
const gbifRecords=key=>`https://api.gbif.org/v1/occurrence/search?speciesKey=${key}&country=IN&stateProvince=Karnataka&hasCoordinate=true&hasGeospatialIssue=false&basisOfRecord=HUMAN_OBSERVATION&limit=300`

export default function SpeciesDetail({item,locale,onClose}){
  const kn=locale==='kn',image=IMAGES[item.gbifKey],note=CULTURE[item.scientificName]
  const [points,setPoints]=useState(null),[copied,setCopied]=useState(false),closeRef=useRef(null)
  useEffect(()=>{closeRef.current?.focus();const onKey=event=>event.key==='Escape'&&onClose();window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[onClose])
  useEffect(()=>{
    let live=true;setPoints(null)
    fetch(gbifRecords(item.gbifKey)).then(r=>r.ok?r.json():Promise.reject(new Error(String(r.status)))).then(body=>{
      if(!live)return
      const seen=new Map()
      for(const o of body.results||[]){if(Number.isFinite(o.decimalLatitude)&&Number.isFinite(o.decimalLongitude))seen.set(`${o.decimalLatitude.toFixed(2)},${o.decimalLongitude.toFixed(2)}`,[o.decimalLatitude,o.decimalLongitude])}
      setPoints({list:[...seen.values()],total:body.count||0})
    }).catch(()=>live&&setPoints({error:true}))
    return()=>{live=false}
  },[item.gbifKey])
  const link=()=>{const url=new URL(window.location.href);url.searchParams.set('species',item.id);url.hash='species';return url.toString()}
  const copy=async()=>{try{await navigator.clipboard.writeText(link());setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{window.prompt(kn?'ಲಿಂಕ್ ನಕಲಿಸಿ':'Copy this link',link())}}
  const season=item.seasonality&&item.seasonality.pattern!=='unknown'?item.seasonality:null
  return <div className="species-backdrop" onClick={event=>event.target===event.currentTarget&&onClose()}>
    <article className="species-detail" role="dialog" aria-modal="true" aria-label={item.name.en||item.scientificName}>
      <button ref={closeRef} type="button" className="species-close" onClick={onClose} aria-label={kn?'ಮುಚ್ಚಿ':'Close'}>×</button>
      {image&&<figure className="species-photo"><img src={image.thumb} alt={item.name.en||item.scientificName} referrerPolicy="no-referrer"/><figcaption>{kn?'ಚಿತ್ರ':'Photo'}: {image.author} · {image.licenseUrl?<a href={image.licenseUrl} target="_blank" rel="noreferrer">{image.license}</a>:image.license} · <a href={image.page} target="_blank" rel="noreferrer">Wikimedia Commons</a></figcaption></figure>}
      <h3 lang="kn">{item.name.kn||(kn?'ಕನ್ನಡ ಹೆಸರು ಬೇಕು':'Kannada name needed')}{item.knScope==='group'&&!item.knReviewed&&<small className="species-group-name">{kn?' · ಗುಂಪಿನ ಹೆಸರು':' · group name'}</small>}</h3>
      <p className="species-en">{item.name.en||'—'}</p><p className="species-sci"><i>{item.scientificName}</i>{item.family&&<> · {item.family}</>}{item.order&&<> · {item.order}</>}</p>
      {note&&<p className="species-culture">{note[kn?'kn':'en']} <a href={`#${note.route}`} onClick={onClose}>{kn?'ಅಟ್ಲಸ್‌ನಲ್ಲಿ ನೋಡಿ':'See in the atlas'} →</a> <small>{kn?'(ಪರಿಶೀಲನೆ ಬಾಕಿ)':'(needs review)'}</small></p>}
      {item.knCandidates?.length>0&&<ul className="species-candidates">{item.knCandidates.map(c=><li key={c.value} lang="kn"><b>{c.value}</b> <small lang={kn?'kn':'en'}>{c.scope==='group'?(kn?'ಗುಂಪಿನ ಹೆಸರು · ':'group name · '):''}{c.sources.join(' + ')}</small></li>)}</ul>}
      {season&&<div className={`species-season ${season.pattern}`}><b>{SEASON[season.pattern][kn?1:0]}</b><span aria-hidden="true">{MONTHS.map((m,i)=><i key={m} className={season.months.includes(i+1)?'on':''}>{(kn?MONTHS_KN:MONTHS)[i]}</i>)}</span><small>{kn?'eBird ತಿಂಗಳ ದಾಖಲೆಗಳಿಂದ ಊಹಿಸಿದ್ದು':'Inferred from eBird month counts'}</small></div>}
      {FLYWAYS[item.gbifKey]&&<><h4>{kn?'ವಲಸೆ ಭೂಗೋಳ':'Migration globe'}</h4><MigrationGlobe locale={locale} routes={FLYWAYS[item.gbifKey].countries.map(c=>({id:c.id,weight:c.n}))} label={`${item.name.en||item.scientificName}: ${kn?'ವಲಸೆ ಭೂಗೋಳ':'migration globe'}`}/><p className="species-map-note">{kn?(FLYWAYS[item.gbifKey].season==='summer-range'?'ಉತ್ತರದ ಬೇಸಿಗೆಯಲ್ಲಿ (ಮೇ–ಆಗಸ್ಟ್) ಇಬರ್ಡ್‌ನಲ್ಲಿ ಇದು ದಾಖಲಾದ ದೇಶಗಳು: ':'ಚಳಿಗಾಲದ ತಿಂಗಳುಗಳಲ್ಲಿ (ನವೆಂಬರ್–ಫೆಬ್ರವರಿ) ದಾಖಲಾದ ದೇಶಗಳು: '):(FLYWAYS[item.gbifKey].season==='summer-range'?'Countries where eBird records it in the northern summer (May–Aug): ':'Countries where eBird records it in the winter months (Nov–Feb): ')}{FLYWAYS[item.gbifKey].countries.map(c=>`${countryName(c.id)} (${Math.round(c.share*100)}%)`).join(', ')}. {kn?'ಇವು ಕಂಡ ದಾಖಲೆಗಳು, ಉಪಗ್ರಹ ಮಾರ್ಗವಲ್ಲ.':'These are sightings, not tracked routes.'}</p></>}
      <h4>{kn?'ಕರ್ನಾಟಕದಲ್ಲಿ ದಾಖಲಾದ ಸ್ಥಳಗಳು':'Where it has been recorded in Karnataka'}</h4>
      <div className="species-map">{points?.error?<p className="species-map-note">{kn?'ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗಲಿಲ್ಲ.':'Records could not be loaded.'}</p>:!points?<p className="species-map-note">{kn?'ಲೋಡ್ ಆಗುತ್ತಿದೆ…':'Loading…'}</p>:<MapContainer bounds={[[11.4,73.8],[18.6,78.7]]} boundsOptions={{padding:[4,4]}} scrollWheelZoom={false} minZoom={5}><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>{points.list.map(([lat,lng])=><CircleMarker key={`${lat},${lng}`} center={[lat,lng]} radius={5} pathOptions={{color:'#fff',weight:1.5,fillColor:'#167f9b',fillOpacity:.85}}><Tooltip>{lat.toFixed(2)}, {lng.toFixed(2)}</Tooltip></CircleMarker>)}</MapContainer>}</div>
      {points?.list&&<p className="species-map-note">{kn?`ಇತ್ತೀಚಿನ ${points.list.length.toLocaleString('en-IN')} ಸ್ಥಳಗಳು (ಒಟ್ಟು ${points.total.toLocaleString('en-IN')} ದಾಖಲೆಗಳು). ಸ್ಥಳಗಳು ಅಂದಾಜು; ದಾಖಲೆ: GBIF.`:`The latest ${points.list.length.toLocaleString('en-IN')} places of ${points.total.toLocaleString('en-IN')} records. Positions are approximate. Records: GBIF.`}</p>}
      <p className="species-links"><button type="button" onClick={copy}>{copied?(kn?'ನಕಲಿಸಲಾಗಿದೆ ✓':'Copied ✓'):(kn?'ಲಿಂಕ್ ನಕಲಿಸಿ':'Copy link')}</button><a href={`https://www.gbif.org/species/${item.gbifKey}`} target="_blank" rel="noreferrer">GBIF ↗</a>{item.wikidataId&&<a href={`https://www.wikidata.org/wiki/${item.wikidataId}`} target="_blank" rel="noreferrer">Wikidata ↗</a>}<a href={`https://www.iucnredlist.org/search?query=${encodeURIComponent(item.scientificName)}&searchType=species`} target="_blank" rel="noreferrer">{kn?'IUCN ಸ್ಥಿತಿ':'IUCN status'} ↗</a>{item.group==='bird'&&<a href={`https://xeno-canto.org/explore?query=${encodeURIComponent(item.scientificName)}`} target="_blank" rel="noreferrer">{kn?'ಧ್ವನಿ (Xeno-canto)':'Calls (Xeno-canto)'} ↗</a>}<a href={`?${new URLSearchParams({contributeTarget:item.id,contributeType:'species',contributeName:`${item.scientificName} · ${item.name.en||''}`,contributeAction:'correction'})}#contribute`}>{item.name.kn?(kn?'ಹೆಸರು ತಿದ್ದಿ':'Correct the name'):(kn?'ಕನ್ನಡ ಹೆಸರು ಸೂಚಿಸಿ':'Suggest a Kannada name')} →</a></p>
    </article>
  </div>
}
