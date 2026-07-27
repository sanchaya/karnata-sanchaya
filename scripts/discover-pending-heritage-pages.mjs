import { heritageAudits } from '../src/data/research.js'

const overrides={
  'candidate-ballari-1':'Bellary Fort','candidate-ballari-2':'Allipur Central Jail','candidate-bengaluru-urban-1':"St. Mary's Basilica Bangalore",'candidate-bidar-2':'Gurudwara Nanak Jhira Sahib','candidate-chamarajanagar-1':'Biligiriranga Hills Temple','candidate-chamarajanagar-2':'Chamarajeshwara Temple','candidate-chikkaballapur-1':'Nandi Hills fort Karnataka','candidate-chikkamagaluru-2':'Ballalarayana Durga fort','candidate-chitradurga-2':'Chandravalli archaeological site','candidate-dakshina-kannada-3':'St Aloysius Chapel Mangalore','candidate-davanagere-1':'Harihareshwara Temple Harihar','candidate-dharwad-1':'Karnatak Arts College Dharwad','candidate-gadag-1':'Lakkundi temples','candidate-haveri-2':'Galageshwara Temple','candidate-kalaburagi-1':'Khwaja Banda Nawaz Dargah','candidate-kolar-1':'Avani temple Karnataka','candidate-koppal-1':'Anegundi fort','candidate-mandya-1':'Srirangapatna Fort','candidate-mandya-2':"Colonel Bailey's Dungeon",'candidate-mysuru-1':"St. Philomena's Cathedral Mysore",'candidate-udupi-2':'Chaturmukha Basadi Karkala','candidate-udupi-3':'Barkur fort','candidate-uttara-kannada-1':'Mahabaleshwar Temple Gokarna','candidate-uttara-kannada-3':'Mundgod Tibetan colony','candidate-vijayapura-1':'Gol Gumbaz','candidate-vijayanagara-2':'Lotus Mahal Hampi','candidate-yadgir-2':'Sufi dargah Yadgir'
}
const candidates=heritageAudits.flatMap(audit=>audit.prioritySites.filter(site=>site.verification.verificationStatus==='research-pending').map(site=>({district:audit.district.en,id:site.id,name:site.name.en,query:overrides[site.id]||site.name.en})))
const pause=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds))
const results=[]
for(const candidate of candidates){
  const url=new URL('https://en.wikipedia.org/w/api.php')
  Object.entries({action:'query',format:'json',generator:'search',gsrsearch:`${candidate.query} Karnataka`,gsrnamespace:'0',gsrlimit:'3',prop:'coordinates|pageimages|info|extracts',inprop:'url',piprop:'original',exintro:'1',explaintext:'1',exsentences:'2',origin:'*'}).forEach(([key,value])=>url.searchParams.set(key,value))
  let body=null;let failure=''
  for(let attempt=0;attempt<2&&!body;attempt++)try{const response=await fetch(url,{headers:{'User-Agent':'KarnatakaHistoricalAtlas/0.11 heritage research'}});if(!response.ok)throw new Error(`HTTP ${response.status}`);body=await response.json()}catch(error){failure=error.message;await pause(1200*(attempt+1))}
  const matches=Object.values(body?.query?.pages||{}).sort((a,b)=>(a.index||99)-(b.index||99)).map(page=>({title:page.title,url:page.fullurl||`https://en.wikipedia.org/?curid=${page.pageid}`,coordinates:page.coordinates?.[0]?{latitude:page.coordinates[0].lat,longitude:page.coordinates[0].lon}:null,imageUrl:page.original?.source||null,extract:page.extract||''}))
  results.push({...candidate,matches,...(body?{}:{error:failure})})
  await pause(400)
}
console.log(JSON.stringify(results,null,2))
