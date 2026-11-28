import { useEffect, useMemo, useState } from 'react'
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { loadDistricts } from './DynastyAreasLayer'
import './climate.css'

const BASE=import.meta.env.BASE_URL
const NORMAL=[1991,2020]
const SEASONS=['sw','ne','pre','win']
const copy={
  kn:{
    eyebrow:'ಭೂಮಿ ಮತ್ತು ಹವಾಮಾನ',title:'ಕರ್ನಾಟಕದ ಮಳೆ ಮತ್ತು ತಾಪಮಾನ, ಜಿಲ್ಲೆವಾರು, ೧೯೮೧ರಿಂದ',
    intro:'ವರ್ಷ ಮತ್ತು ಜಿಲ್ಲೆ ಆರಿಸಿ: ಆ ವರ್ಷ ಮಳೆ ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಎಷ್ಟು ಹೆಚ್ಚು ಅಥವಾ ಕಡಿಮೆ ಇತ್ತು. ಬೆಳೆ ಮತ್ತು ಮಳೆಯ ಹೋಲಿಕೆಗೆ ಇದು ಮೊದಲ ಹೆಜ್ಜೆ; ಬೆಳೆ ವಿವರಗಳು ಆಕರ ಕಡತಗಳು ಸಿಕ್ಕಂತೆ ಬರುತ್ತವೆ.',
    district:'ಜಿಲ್ಲೆ',all:'ಕರ್ನಾಟಕ (ಜಿಲ್ಲೆಗಳ ಸರಾಸರಿ)',year:'ವರ್ಷ',measure:'ನಕ್ಷೆಯಲ್ಲಿ',annual:'ವರ್ಷದ ಮಳೆ',sw:'ನೈಋತ್ಯ ಮಾನ್ಸೂನ್ (ಜೂನ್–ಸೆಪ್ಟೆಂಬರ್)',ne:'ಈಶಾನ್ಯ ಮಾನ್ಸೂನ್ (ಅಕ್ಟೋಬರ್–ಡಿಸೆಂಬರ್)',pre:'ಮಾನ್ಸೂನ್ ಪೂರ್ವ (ಮಾರ್ಚ್–ಮೇ)',win:'ಚಳಿಗಾಲ (ಜನವರಿ–ಫೆಬ್ರವರಿ)',
    rain:'ಮಳೆ',normal:'ಸಾಮಾನ್ಯ',departure:'ಸಾಮಾನ್ಯಕ್ಕಿಂತ',mm:'ಮಿ.ಮೀ.',tmax:'ಗರಿಷ್ಠ ತಾಪಮಾನ (ವರ್ಷದ ಸರಾಸರಿ)',tmin:'ಕನಿಷ್ಠ ತಾಪಮಾನ (ವರ್ಷದ ಸರಾಸರಿ)',vs:'ಸಾಮಾನ್ಯಕ್ಕಿಂತ',
    cat:{excess:'ಹೆಚ್ಚು',normal:'ಸಾಮಾನ್ಯ',deficient:'ಕಡಿಮೆ',large:'ತೀರಾ ಕಡಿಮೆ'},
    legend:'ನಕ್ಷೆಯ ಬಣ್ಣ: ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಕಡಿಮೆ = ಕಂದು, ಹೆಚ್ಚು = ನೀಲಿ',chart:'ಜಿಲ್ಲೆಯ ವರ್ಷದ ಮಳೆ, ೧೯೮೧–',loading:'ಹವಾಮಾನ ದತ್ತಾಂಶ ಲೋಡ್ ಆಗುತ್ತಿದೆ…',failed:'ಹವಾಮಾನ ದತ್ತಾಂಶ ಲೋಡ್ ಆಗಲಿಲ್ಲ.',
    caveat:'ಇವು ಮಳೆ ಮಾಪಕಗಳ ದಾಖಲೆ ಅಲ್ಲ. ನಾಸಾ ಪವರ್ ಎಂಬ ಮಾದರಿ ಉತ್ಪನ್ನದ ಮೌಲ್ಯಗಳು, ಪ್ರತಿ ಜಿಲ್ಲೆಯ ಮಧ್ಯದ ಒಂದು ಬಿಂದುವಿಗೆ ಸುಮಾರು ೦.೫ ಡಿಗ್ರಿ (೫೦ ಕಿ.ಮೀ.) ಜಾಲದಲ್ಲಿ. ಪಶ್ಚಿಮ ಘಟ್ಟದ ಬಳಿಯ ಜಿಲ್ಲೆಗಳು (ಉದಾ. ಮೈಸೂರು, ಚಾಮರಾಜನಗರ) ಹೆಚ್ಚು ತೇವವಾಗಿ ಕಾಣಬಹುದು. ಸ್ಥಳೀಯ ಅಥವಾ ಕೃಷಿ ನಿರ್ಧಾರಕ್ಕೆ ಬಳಸಬೇಡಿ; ಅದಕ್ಕೆ ಭಾರತೀಯ ಹವಾಮಾನ ಇಲಾಖೆ ಮತ್ತು ಕೆ.ಎಸ್.ಎನ್.ಡಿ.ಎಂ.ಸಿ ದಾಖಲೆ ನೋಡಿ. ಪರಿಶೀಲನೆ ಬಾಕಿ. ಕನ್ನಡ ಪಠ್ಯ ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ ಬಾಕಿ.',
    source:'ಆಕರ: ನಾಸಾ ಪವರ್ (power.larc.nasa.gov)',normalNote:'ಸಾಮಾನ್ಯ = ೧೯೯೧–೨೦೨೦ರ ಸರಾಸರಿ. ವರ್ಗ (ಹೆಚ್ಚು, ಸಾಮಾನ್ಯ, ಕಡಿಮೆ, ತೀರಾ ಕಡಿಮೆ) ಭಾರತೀಯ ಹವಾಮಾನ ಇಲಾಖೆಯ ಶೇಕಡಾ ಮಿತಿಗಳನ್ನು ಬಳಸುತ್ತದೆ.',
  },
  en:{
    eyebrow:'Land and climate',title:'Karnataka rainfall and temperature by district, from 1981',
    intro:'Pick a year and a district to see how far the rain was above or below normal. This is the first step towards setting crops beside rain; crop figures follow as the source files arrive.',
    district:'District',all:'Karnataka (average of districts)',year:'Year',measure:'On the map',annual:'Yearly rain',sw:'South-west monsoon (June–September)',ne:'North-east monsoon (October–December)',pre:'Pre-monsoon (March–May)',win:'Winter (January–February)',
    rain:'Rain',normal:'Normal',departure:'Against normal',mm:'mm',tmax:'Highest temperature (yearly mean)',tmin:'Lowest temperature (yearly mean)',vs:'against normal',
    cat:{excess:'Excess',normal:'Normal',deficient:'Deficient',large:'Large deficient'},
    legend:'Map colour: below normal = brown, above normal = blue',chart:'Yearly rain for the district, 1981–',loading:'Loading climate data…',failed:'The climate data could not be loaded.',
    caveat:'These are not rain-gauge records. They are values from NASA POWER, a modelled product, for one point at the centre of each district on a grid about 0.5 degrees (50 km) wide. Districts near the Western Ghats (for example Mysuru and Chamarajanagar) can read wetter than they are. Do not use them for local or farming decisions; for those use India Meteorological Department and KSNDMC records. Not yet reviewed. The Kannada text needs a native proofread.',
    source:'Source: NASA POWER (power.larc.nasa.gov)',normalNote:'Normal = the 1991–2020 average. The classes (excess, normal, deficient, large deficient) use the India Meteorological Department’s percentage limits.',
  },
}
// IMD classes for departure from normal: excess +20% or more, normal -19 to +19, deficient -20 to -59, large deficient -60 or less.
const category=pct=>pct>=20?'excess':pct>-20?'normal':pct>-60?'deficient':'large'
const CAT_COLOR={excess:'#2b6cb0',normal:'#a8c8a0',deficient:'#d9a441',large:'#a8501e'}
const colorOf=pct=>{if(!Number.isFinite(pct))return '#ddd';return pct>=40?'#1f4e8c':pct>=20?'#4b8bd0':pct>-20?'#b9d6a8':pct>-40?'#e0b25a':pct>-60?'#c97f2a':'#8e3d12'}
const num=(n,locale)=>Number.isFinite(n)?Math.round(n).toLocaleString(locale==='kn'?'kn-IN':'en-IN'):'—'
const avg=(rows,key)=>rows.reduce((sum,row)=>sum+row[key],0)/rows.length

export default function ClimatePage({locale='kn'}){
  const t=copy[locale]||copy.kn
  const [data,setData]=useState(null),[failed,setFailed]=useState(false),[geo,setGeo]=useState(null)
  const [district,setDistrict]=useState('all'),[year,setYear]=useState(null),[measure,setMeasure]=useState('year')
  useEffect(()=>{fetch(`${BASE}data/climate/karnataka-districts.json`).then(r=>r.ok?r.json():Promise.reject(new Error(String(r.status)))).then(d=>{setData(d);setYear(d.meta.end)}).catch(()=>setFailed(true));loadDistricts().then(setGeo).catch(()=>{})},[])
  const model=useMemo(()=>{
    if(!data)return null
    const byId=new Map()
    for(const d of data.districts){
      const normalRows=d.years.filter(r=>r.y>=NORMAL[0]&&r.y<=NORMAL[1])
      const normal=Object.fromEntries(['year','sw','ne','pre','win','tmax','tmin'].map(k=>[k,avg(normalRows,k)]))
      byId.set(d.name,{...d,normal,rows:new Map(d.years.map(r=>[r.y,r]))})
    }
    // Karnataka = the plain average of the districts, year by year; the normal is taken from that average the same way.
    const years=data.districts[0].years.map(r=>r.y)
    const stateRows=years.map(y=>{const rows=data.districts.map(d=>d.years.find(q=>q.y===y)).filter(Boolean);return {y,...Object.fromEntries(['year','sw','ne','pre','win','tmax','tmin'].map(k=>[k,avg(rows,k)]))}}).filter(r=>Number.isFinite(r.year))
    const stateNormalRows=stateRows.filter(r=>r.y>=NORMAL[0]&&r.y<=NORMAL[1])
    const state={name:'all',years:stateRows,rows:new Map(stateRows.map(r=>[r.y,r])),normal:Object.fromEntries(['year','sw','ne','pre','win','tmax','tmin'].map(k=>[k,avg(stateNormalRows,k)]))}
    return {byId,state,list:[...byId.values()].sort((a,b)=>a.name.localeCompare(b.name))}
  },[data])
  if(failed)return <main className="portal-page climate-page"><p>{t.failed}</p></main>
  if(!model||year==null)return <main className="portal-page climate-page"><p>{t.loading}</p></main>
  const selected=district==='all'?model.state:model.byId.get(district)
  const row=selected.rows.get(year)
  const dep=(value,normal)=>normal?((value-normal)/normal)*100:NaN
  const first=data.meta.start,last=data.meta.end
  const maxRain=Math.max(...selected.years.map(r=>r.year))
  const mapKey=measure
  const style=feature=>{const d=model.byId.get(feature.properties.district);const r=d?.rows.get(year);const pct=r?dep(r[mapKey],d.normal[mapKey]):NaN;const on=district===feature.properties.district;return {fillColor:colorOf(pct),fillOpacity:.85,color:on?'#1a1a2e':'#fff',weight:on?3:1}}
  const onEach=(feature,layer)=>{const d=model.byId.get(feature.properties.district);const r=d?.rows.get(year);const pct=r?dep(r[mapKey],d.normal[mapKey]):NaN;layer.bindTooltip(`${feature.properties.district}: ${num(r?.[mapKey],locale)} ${t.mm}${Number.isFinite(pct)?` (${pct>0?'+':''}${Math.round(pct)}%)`:''}`,{sticky:true});layer.on('click',()=>setDistrict(feature.properties.district))}
  const barW=100/selected.years.length
  return <main className="portal-page climate-page" id="climate">
    <section className="climate-hero explore-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div></section>
    <section className="climate-controls">
      <label>{t.district} <select value={district} onChange={e=>setDistrict(e.target.value)}><option value="all">{t.all}</option>{model.list.map(d=><option key={d.name} value={d.name}>{d.name}</option>)}</select></label>
      <label className="climate-year">{t.year} <b>{year}</b> <input type="range" min={first} max={last} value={year} onChange={e=>setYear(Number(e.target.value))} aria-label={t.year}/></label>
      <label>{t.measure} <select value={measure} onChange={e=>setMeasure(e.target.value)}>{['year',...SEASONS].map(k=><option key={k} value={k}>{k==='year'?t.annual:t[k]}</option>)}</select></label>
    </section>
    <section className="climate-layout">
      <div className="climate-map"><MapContainer center={[14.8,76.2]} zoom={7} scrollWheelZoom={false} style={{height:'100%',minHeight:380}}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {geo&&<GeoJSON key={`${year}-${mapKey}-${district}`} data={geo} style={style} onEachFeature={onEach}/>}
      </MapContainer><div className="climate-legend"><span style={{background:'#8e3d12'}}/><span style={{background:'#c97f2a'}}/><span style={{background:'#e0b25a'}}/><span style={{background:'#b9d6a8'}}/><span style={{background:'#4b8bd0'}}/><span style={{background:'#1f4e8c'}}/><small>{t.legend}</small></div></div>
      <div className="climate-side">
        <h3>{district==='all'?t.all:district} · {year}</h3>
        <div className="climate-seasons">{['year',...SEASONS].map(k=>{const pct=dep(row[k],selected.normal[k]);const c=category(pct);return <article key={k} className={k==='year'?'big':''}><strong>{k==='year'?t.annual:t[k]}</strong><b>{num(row[k],locale)} <small>{t.mm}</small></b><span>{t.normal}: {num(selected.normal[k],locale)} {t.mm}</span><i style={{background:CAT_COLOR[c]}}>{pct>0?'+':''}{Math.round(pct)}% · {t.cat[c]}</i></article>})}</div>
        <p className="climate-temps"><b>{t.tmax}:</b> {row.tmax.toFixed(1)}°C ({row.tmax-selected.normal.tmax>=0?'+':''}{(row.tmax-selected.normal.tmax).toFixed(1)}° {t.vs}) · <b>{t.tmin}:</b> {row.tmin.toFixed(1)}°C ({row.tmin-selected.normal.tmin>=0?'+':''}{(row.tmin-selected.normal.tmin).toFixed(1)}° {t.vs})</p>
        <div className="climate-chart" role="img" aria-label={`${t.chart}${last}`}><strong>{t.chart}{last}</strong>
          <svg viewBox="0 0 100 44" preserveAspectRatio="none"><line x1="0" x2="100" y1={40-(selected.normal.year/maxRain)*36} y2={40-(selected.normal.year/maxRain)*36} stroke="#1a1a2e" strokeDasharray="1.5 1" strokeWidth=".3"/>{selected.years.map((r,i)=><rect key={r.y} x={i*barW+barW*.1} width={barW*.8} y={40-(r.year/maxRain)*36} height={(r.year/maxRain)*36} fill={r.y===year?'#1a1a2e':CAT_COLOR[category(dep(r.year,selected.normal.year))]} onClick={()=>setYear(r.y)}><title>{r.y}: {num(r.year,locale)} {t.mm}</title></rect>)}</svg>
          <small>{first} … {last} · {t.normal} ({NORMAL[0]}–{NORMAL[1]}): {num(selected.normal.year,locale)} {t.mm}</small></div>
      </div>
    </section>
    <p className="press-note climate-note">{t.normalNote}</p>
    <p className="press-note climate-note">{t.caveat}</p>
    <p className="press-note climate-note">{t.source} · {data.meta.apiVersion||''} · {data.meta.generated}. {data.meta.citation}</p>
  </main>
}
