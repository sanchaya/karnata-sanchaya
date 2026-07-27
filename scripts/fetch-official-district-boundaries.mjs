import { writeFile } from 'node:fs/promises'
import { heritageAudits } from '../src/data/research.js'

const endpoint='https://mapservice.gov.in/mapserviceserv176/rest/services/BharatMapService_Karnataka/Admin_Boundary_District/MapServer/1/query'
const url=new URL(endpoint)
Object.entries({where:'1=1',outFields:'dtname,Dist_LGD,OBJECTID',returnGeometry:'true',outSR:'4326',maxAllowableOffset:'0.002',geometryPrecision:'5',f:'geojson'}).forEach(([key,value])=>url.searchParams.set(key,value))
const response=await fetch(url,{headers:{'User-Agent':'KarnatakaHistoricalAtlas/0.13 official-district-boundary-export'}})
if(!response.ok)throw new Error(`BharatMaps HTTP ${response.status}`)
const source=await response.json()
const aliases={Bagalkote:'Bagalkote',Ballari:'Ballari',Belagavi:'Belagavi','Bengaluru Rural':'Bengaluru Rural','Bengaluru Urban':'Bangalore',Chamarajanagar:'Chamarajanagara',Chikkaballapur:'Chikkaballapura',Vijayanagara:'Vijayanagar'}
const byName=new Map(source.features.map(feature=>[feature.properties.dtname,feature]))
const features=heritageAudits.map(audit=>{
  const district=audit.district.en
  const sourceFeature=byName.get(aliases[district]||district)
  if(!sourceFeature)throw new Error(`Missing official boundary: ${district}`)
  return {type:'Feature',properties:{id:audit.id,district,districtName:audit.district,lgdCode:sourceFeature.properties.Dist_LGD,sourceObjectId:sourceFeature.properties.OBJECTID},geometry:sourceFeature.geometry}
})
const collection={type:'FeatureCollection',metadata:{title:'Karnataka district boundaries for atlas navigation',source:'BharatMaps / National Informatics Centre, Government of India',sourceUrl:'https://mapservice.gov.in/mapserviceserv176/rest/services/BharatMapService_Karnataka/Admin_Boundary_District/MapServer',catalogUrl:'https://karnataka.data.gov.in/catalog/admin-boundaries',policy:'National Data Sharing and Accessibility Policy (NDSAP)',retrievedAt:'2026-07-26',precision:'simplified administrative display boundary; not for legal use'},features}
const destination=process.argv[2]||'public/karnataka-districts.geojson'
await writeFile(destination,`${JSON.stringify(collection)}\n`)
console.log(`Wrote ${features.length} official district polygons to ${destination}`)
