import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet'
import { atlasData } from './data/atlas'
import ProvenanceBadge from './ProvenanceBadge'
import { buildSourceTiers, recordAuthorityCited } from './data/source-provenance'

const text=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const other=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const placeById=new Map(atlasData.places.map(record=>[record.id,record]))
const entityById=new Map([...atlasData.polities,...atlasData.externalPolities].map(record=>[record.id,record]))
const sourceById=new Map(atlasData.sources.map(record=>[record.id,record]))
const sourceTiers=buildSourceTiers(atlasData)
const gateFields=['catalogue','image','metal','weight','findspot']
const completeStatuses=new Set(['verified','located','not-applicable'])
const gateComplete=gate=>completeStatuses.has(gate?.status)
const dateLabel=(date,locale)=>`${date.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${date.from}${date.to!==date.from?`-${date.to}`:''} ${date.era}`
const copy={
  kn:{eyebrow:'P2 · ನಾಣ್ಯ ಸಾಕ್ಷ್ಯ',title:'ನಾಣ್ಯ ಮತ್ತು ವಸ್ತುಸಾಕ್ಷ್ಯ ಅನ್ವೇಷಣೆ',intro:'ರಾಜ್ಯ, ಸ್ಥಳ, ಲೋಹ, ಚಿತ್ರ ಮತ್ತು ಪಟ್ಟಿ ಸಾಕ್ಷ್ಯಗಳ ಮೂಲಕ ನಾಣ್ಯ ದಾರಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ಪೂರ್ಣ ಕ್ಯಾಟಲಾಗ್ ಸಾಕ್ಷ್ಯವಿಲ್ಲದ ದಾಖಲೆಗಳು ಸಂಶೋಧನಾ ಅಭ್ಯರ್ಥಿಗಳಾಗಿಯೇ ಉಳಿಯುತ್ತವೆ.',search:'ನಾಣ್ಯ, ರಾಜ್ಯ, ಸ್ಥಳ ಅಥವಾ ಸಾಕ್ಷ್ಯ ಹುಡುಕಿ',all:'ಎಲ್ಲ',polity:'ರಾಜ್ಯ',material:'ಲೋಹ',gate:'ಸಾಕ್ಷ್ಯ ಹಂತ',review:'ಪರಿಶೀಲನೆ',records:'ದಾಖಲೆಗಳು',ready:'ಪೂರ್ಣ ಸಾಕ್ಷ್ಯ',blocked:'ಬಾಕಿ ಹಂತಗಳು',map:'ಪತ್ತೆಸ್ಥಳ ಭೂಪಟ',obverse:'ಮುಂಭಾಗ',reverse:'ಹಿಂಭಾಗ',findspot:'ಪತ್ತೆಸ್ಥಳ',certainty:'ನಿಶ್ಚಿತತೆ',image:'ಚಿತ್ರ',catalogue:'ಪಟ್ಟಿ',metal:'ಲೋಹ',weight:'ತೂಕ',diameter:'ವ್ಯಾಸ',source:'ಆಕರ',openEvidence:'ಸಾಕ್ಷ್ಯ ಕಾರ್ಯಕ್ಕೆ ತೆರಳಿ',noResults:'ಈ ಶೋಧಕಗಳಿಗೆ ನಾಣ್ಯ ದಾಖಲೆಗಳಿಲ್ಲ.',missing:'ಲಭ್ಯವಿಲ್ಲ',unresolved:'ನಿರ್ಧಾರವಾಗಿಲ್ಲ'},
  en:{eyebrow:'P2 · Coin evidence',title:'Coin and Material Evidence Explorer',intro:'Explore coin leads by polity, place, metal, image status and catalogue evidence. Records without complete catalogue evidence remain research candidates.',search:'Search coin, polity, place or evidence',all:'All',polity:'Polity',material:'Metal',gate:'Evidence gate',review:'Review',records:'records',ready:'complete evidence',blocked:'open gates',map:'Findspot map',obverse:'Obverse',reverse:'Reverse',findspot:'Findspot',certainty:'Certainty',image:'Image',catalogue:'Catalogue',metal:'Metal',weight:'Weight',diameter:'Diameter',source:'Source',openEvidence:'Open evidence workflow',noResults:'No coin records match these filters.',missing:'Missing',unresolved:'Unresolved'},
}

const normalizedCoins=atlasData.coinRecords.map(record=>{
  const place=placeById.get(record.placeId)
  const polity=entityById.get(record.polityId)
  const coords=place?.location?.coordinates
  const completed=gateFields.filter(field=>gateComplete(record.evidenceGates?.[field])).length
  return {...record,place,polity,coords:coords?[coords[1],coords[0]]:null,completed,total:gateFields.length,searchText:JSON.stringify(record).toLowerCase()}
})

export default function CoinExplorer({locale='kn'}){
  const t=copy[locale]
  const [query,setQuery]=useState('')
  const [polity,setPolity]=useState('all')
  const [material,setMaterial]=useState('all')
  const [gate,setGate]=useState('all')
  const [review,setReview]=useState('all')
  const [selectedId,setSelectedId]=useState(normalizedCoins[0]?.id)
  const materials=[...new Set(normalizedCoins.map(item=>item.material||'unresolved'))].sort()
  const polities=[...new Map(normalizedCoins.map(item=>[item.polityId,item.polity]).filter(([,value])=>value)).values()]
  const filtered=useMemo(()=>normalizedCoins.filter(item=>{
    const needle=query.trim().toLowerCase()
    return (!needle||item.searchText.includes(needle)||text(item.name,locale).toLowerCase().includes(needle)||text(item.polity?.name,locale).toLowerCase().includes(needle)||text(item.place?.name,locale).toLowerCase().includes(needle))&&(polity==='all'||item.polityId===polity)&&(material==='all'||(item.material||'unresolved')===material)&&(gate==='all'||!gateComplete(item.evidenceGates?.[gate]))&&(review==='all'||item.review?.status===review)
  }),[query,polity,material,gate,review,locale])
  const selected=filtered.find(item=>item.id===selectedId)||filtered[0]||null
  const ready=normalizedCoins.filter(item=>item.completed===item.total).length
  const openGates=normalizedCoins.reduce((sum,item)=>sum+(item.total-item.completed),0)
  const citations=(selected?.citations||[]).map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  return <main className="coin-page portal-page" id="coins"><section className="coin-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div><div className="coin-stats"><span><b>{normalizedCoins.length}</b>{t.records}</span><span><b>{ready}</b>{t.ready}</span><span><b>{openGates}</b>{t.blocked}</span></div></section><section className="coin-workspace"><aside className="coin-filters"><label><span>{t.search}</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.search}/></label><div><label><span>{t.polity}</span><select value={polity} onChange={event=>setPolity(event.target.value)}><option value="all">{t.all}</option>{polities.map(item=><option key={item.id} value={item.id}>{text(item.name,locale)}</option>)}</select></label><label><span>{t.material}</span><select value={material} onChange={event=>setMaterial(event.target.value)}><option value="all">{t.all}</option>{materials.map(value=><option key={value} value={value}>{value==='unresolved'?t.unresolved:value}</option>)}</select></label><label><span>{t.gate}</span><select value={gate} onChange={event=>setGate(event.target.value)}><option value="all">{t.all}</option>{gateFields.map(value=><option key={value} value={value}>{t[value]}</option>)}</select></label><label><span>{t.review}</span><select value={review} onChange={event=>setReview(event.target.value)}><option value="all">{t.all}</option>{[...new Set(normalizedCoins.map(item=>item.review?.status||'needs-review'))].map(value=><option key={value} value={value}>{value}</option>)}</select></label></div><div className="coin-list">{filtered.map(item=><button key={item.id} className={selected?.id===item.id?'active':''} onClick={()=>setSelectedId(item.id)} style={{'--coin-color':item.polity?.color||'#9a6b24'}}><span>{dateLabel(item.date,locale)}</span><strong>{text(item.name,locale)}</strong><small>{text(item.polity?.name,locale)} · {text(item.place?.name,locale)}</small><meter min="0" max={item.total} value={item.completed}></meter></button>)}{!filtered.length&&<p>{t.noResults}</p>}</div></aside><section className="coin-map"><MapContainer center={[15.6,76.6]} zoom={5} minZoom={3} scrollWheelZoom><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{filtered.filter(item=>item.coords).map(item=><CircleMarker key={item.id} center={item.coords} radius={selected?.id===item.id?10:7} pathOptions={{color:item.completed===item.total?'#2f7d58':'#b06a1f',fillColor:item.polity?.color||'#9a6b24',fillOpacity:.86,weight:selected?.id===item.id?4:2,dashArray:item.completed===item.total?null:'3 5'}} eventHandlers={{click:()=>setSelectedId(item.id)}}><Tooltip>{text(item.name,locale)} · {item.completed}/{item.total}</Tooltip></CircleMarker>)}</MapContainer><div className="coin-map-label">{t.map}</div></section><aside className="coin-detail">{selected?<><small>{text(selected.polity?.name,locale)} · {dateLabel(selected.date,locale)}</small><h3>{text(selected.name,locale)}</h3>{other(selected.name,locale)&&<p className="entity-secondary">{other(selected.name,locale)}</p>}<dl className="coin-material-table"><div><dt>{t.material}</dt><dd>{selected.material==='unresolved'?t.unresolved:selected.material}</dd></div><div><dt>{t.weight}</dt><dd>{selected.weightGrams?`${selected.weightGrams} g`:t.missing}</dd></div><div><dt>{t.diameter}</dt><dd>{selected.diameterMm?`${selected.diameterMm} mm`:t.missing}</dd></div><div><dt>{t.image}</dt><dd>{selected.image?.status||t.missing}</dd></div></dl><section><h4>{t.obverse}</h4><p>{text(selected.obverse,locale)}</p><h4>{t.reverse}</h4><p>{text(selected.reverse,locale)}</p></section><section className="coin-gates">{gateFields.map(field=><div key={field} className={gateComplete(selected.evidenceGates?.[field])?'complete':'open'}><span>{t[field]}</span><b>{selected.evidenceGates?.[field]?.status||'unresolved'}</b></div>)}</section><section className="coin-findspot"><b>{t.findspot}</b><span>{text(selected.place?.name,locale)} · {t.certainty}: {selected.findspot?.certainty}</span></section><section className="coin-citations">{citations.map((item,index)=><p key={`${item.sourceId}-${index}`}><a href={item.source.url} target="_blank" rel="noreferrer">{text(item.source.title,locale)}</a><span>{item.locator}</span>{recordAuthorityCited(selected,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}</p>)}</section><a className="coin-open-evidence" href="#evidence">{t.openEvidence}</a><code>{selected.id}</code></>:<p>{t.noResults}</p>}</aside></section></main>
}
