import { heritageAudits } from '../src/data/research.js'

const overrides={
  'candidate-bagalkote-1':'Pattadakal Group of Monuments',
  'candidate-bagalkote-2':'Badami Fort',
  'candidate-ballari-2':'Allipur Central Jail',
  'candidate-bengaluru-rural-2':'Ghati Subramanya Temple',
  'candidate-chamarajanagar-1':'Biligiriranga Hills Temple',
  'candidate-chikkaballapur-1':'Nandi Hills India',
  'candidate-chikkamagaluru-1':'Sringeri Sharada Peetham',
  'candidate-chitradurga-2':'Chandravalli archaeological site',
  'candidate-dakshina-kannada-2':'Saavira Kambada Basadi',
  'candidate-davanagere-2':'Santhebennur Pushkarini',
  'candidate-dharwad-1':'Karnatak Arts College',
  'candidate-gadag-1':'Lakkundi',
  'candidate-haveri-2':'Galageshwara Temple',
  'candidate-kalaburagi-1':'Khwaja Banda Nawaz Dargah',
  'candidate-kalaburagi-2':'Malkhed Fort',
  'candidate-kolar-1':'Avani Karnataka',
  'candidate-koppal-1':'Anegundi',
  'candidate-mandya-1':'Srirangapatna Fort',
  'candidate-mandya-2':'Colonel Bailey Dungeon',
  'candidate-ramanagara-2':'Janapada Loka',
  'candidate-shivamogga-2':'Keladi Karnataka',
  'candidate-udupi-1':'Udupi Sri Krishna Matha',
  'candidate-udupi-3':'Barkur Karnataka',
  'candidate-uttara-kannada-3':'Mundgod Tibetan Colony',
  'candidate-vijayapura-3':'Bijapur Fort',
  'candidate-vijayanagara-1':'Group of Monuments at Hampi',
  'candidate-vijayanagara-2':'Lotus Mahal Hampi',
  'candidate-yadgir-2':'Yadgir Sufi dargah'
}

const candidates=heritageAudits.flatMap(audit=>audit.prioritySites.map(site=>({district:audit.district.en,id:site.id,name:site.name.en,query:overrides[site.id]||site.name.en})))
const api='https://www.wikidata.org/w/api.php'
const results=[]
const pause=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds))
for(const candidate of candidates){
  const url=new URL(api)
  Object.entries({action:'wbsearchentities',search:candidate.query,language:'en',format:'json',limit:'3'}).forEach(([key,value])=>url.searchParams.set(key,value))
  let body=null; let failure=''
  for(let attempt=0;attempt<3&&!body;attempt++){
    try{
      const response=await fetch(url,{headers:{'User-Agent':'KarnatakaHistoricalAtlas/0.11 research metadata discovery'}})
      const text=await response.text()
      if(!response.ok) throw new Error(`HTTP ${response.status}`)
      body=JSON.parse(text)
    }catch(error){failure=error.message;await pause(1500*(attempt+1))}
  }
  results.push({...candidate,matches:(body?.search||[]).map(item=>({id:item.id,label:item.label,description:item.description||''})),...(body?{}:{error:failure})})
  await pause(450)
}
console.log(JSON.stringify(results,null,2))
