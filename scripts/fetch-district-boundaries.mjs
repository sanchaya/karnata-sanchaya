import { heritageAudits } from '../src/data/research.js'
import { writeFile } from 'node:fs/promises'

const overrides={
  'Bagalkote':'Bagalkot district','Ballari':'Ballari district','Belagavi':'Belagavi district',
  'Bengaluru Rural':'Bangalore Rural district','Bengaluru Urban':'Bangalore Urban district',
  'Chamarajanagar':'Chamarajanagar district','Chikkaballapur':'Chikkaballapur district',
  'Chikkamagaluru':'Chikkamagaluru district','Dakshina Kannada':'Dakshina Kannada district',
  'Davanagere':'Davanagere district','Kalaburagi':'Kalaburagi district','Kodagu':'Kodagu district',
  'Shivamogga':'Shimoga district','Tumakuru':'Tumkur district','Uttara Kannada':'Uttara Kannada district',
  'Vijayapura':'Bijapur district, Karnataka','Vijayanagara':'Vijayanagara district, Karnataka'
}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms))
const features=[]
for(const audit of heritageAudits){
  const district=audit.district.en
  const query=overrides[district]||`${district} district, Karnataka`
  const url=new URL('https://nominatim.openstreetmap.org/search')
  Object.entries({q:query,format:'jsonv2',limit:'10',polygon_geojson:'1',addressdetails:'1',countrycodes:'in'}).forEach(([key,value])=>url.searchParams.set(key,value))
  let rows=[]
  for(let attempt=0;attempt<4;attempt++){
    const response=await fetch(url,{headers:{'User-Agent':'KarnatakaHistoricalAtlas/0.13 district-boundary-static-export'}})
    if(response.ok){rows=await response.json();break}
    if(response.status!==429)throw new Error(`${district}: HTTP ${response.status}`)
    await pause(2500*(attempt+1))
  }
  const polygon=row=>['Polygon','MultiPolygon'].includes(row.geojson?.type)
  const match=rows.find(row=>polygon(row)&&row.class==='boundary'&&String(row.display_name).toLowerCase().includes('karnataka'))||rows.find(polygon)
  if(!match){console.error(`No geometry: ${district}`);await pause(1100);continue}
  features.push({type:'Feature',properties:{id:audit.id,district,auditName:audit.name,source:'OpenStreetMap / Nominatim',osmType:match.osm_type,osmId:match.osm_id,displayName:match.display_name},geometry:match.geojson})
  console.error(`Resolved ${district}: ${match.osm_type}/${match.osm_id}`)
  await pause(1450)
}
const collection={type:'FeatureCollection',metadata:{title:'Karnataka district boundaries for atlas navigation',source:'OpenStreetMap contributors',sourceUrl:'https://www.openstreetmap.org/copyright',license:'ODbL 1.0',retrievedAt:'2026-07-26',precision:'administrative-boundary; not for legal use'},features}
if(process.argv[2]){await writeFile(process.argv[2],`${JSON.stringify(collection)}\n`);console.error(`Wrote ${features.length} boundaries to ${process.argv[2]}`)}else console.log(JSON.stringify(collection,null,2))
