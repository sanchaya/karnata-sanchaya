import { atlasData } from '../src/data/atlas.js'

const overrides={
  'candidate-ballari-1':'Bellary Fort','candidate-ballari-2':'Allipuram Jail Ballari','candidate-belagavi-1':'Belagavi Fort',
  'candidate-chikkamagaluru-2':'Ballalarayana Durga','candidate-davanagere-2':'Santhebennur Pushkarni',
  'candidate-dharwad-2':'Dharwad Fort','candidate-gadag-2':'Nargund Fort','candidate-hassan-1':'Shettihalli Rosary Church',
  'candidate-haveri-2':'Galageshwara Temple Galaganatha','candidate-kalaburagi-1':'Khwaja Banda Nawaz Dargah Kalaburagi',
  'candidate-kolar-2':'Kolaramma Temple','candidate-mandya-2':"Colonel Bailey's Dungeon Srirangapatna",
  'candidate-ramanagara-1':'Magadi Fort Ramanagara','candidate-ramanagara-2':'Janapada Loka Ramanagara',
  'candidate-udupi-2':'Chaturmukha Basadi Karkala','candidate-uttara-kannada-2':'Mirjan Fort',
  'candidate-yadgir-2':'Sufi Sarmast Dargah Sagar Shahapur Yadgir'
}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms))
const sites=atlasData.heritageAudits.flatMap(audit=>audit.prioritySites.filter(site=>!site.verification.coordinates).map(site=>({district:audit.district.en,id:site.id,name:site.name.en})))
const results=[]
for(const site of sites){
  const url=new URL('https://nominatim.openstreetmap.org/search')
  Object.entries({q:`${overrides[site.id]||site.name}, Karnataka, India`,format:'jsonv2',limit:'5',addressdetails:'1'}).forEach(([key,value])=>url.searchParams.set(key,value))
  const response=await fetch(url,{headers:{'User-Agent':'KarnatakaHistoricalAtlas/0.13 heritage-location-audit'}})
  const body=response.ok?await response.json():[]
  results.push({...site,matches:body.map(row=>({displayName:row.display_name,latitude:Number(row.lat),longitude:Number(row.lon),osmType:row.osm_type,osmId:row.osm_id,type:row.type,category:row.category}))})
  await pause(1100)
}
console.log(JSON.stringify(results,null,2))
