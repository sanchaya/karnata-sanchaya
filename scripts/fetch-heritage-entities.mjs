const entities={
  'candidate-bagalkote-1':'Q817250','candidate-bagalkote-2':'Q131303115','candidate-belagavi-1':'Q97097588','candidate-belagavi-2':'Q97096042','candidate-bengaluru-rural-1':'Q5266481','candidate-bengaluru-rural-2':'Q5555922','candidate-bengaluru-urban-2':'Q104755615','candidate-bengaluru-urban-3':'Q283257','candidate-chikkaballapur-2':'Q17049788','candidate-chikkamagaluru-1':'Q7586433','candidate-chitradurga-1':'Q5102308','candidate-dakshina-kannada-1':'Q6748666','candidate-dakshina-kannada-2':'Q7395749','candidate-davanagere-2':'Q111079699','candidate-hassan-2':'Q24951959','candidate-kalaburagi-2':'Q131299041','candidate-kodagu-1':'Q3335448','candidate-kodagu-2':'Q6727744','candidate-mysuru-2':'Q456575','candidate-raichur-1':'Q15271340','candidate-ramanagara-2':'Q6150767','candidate-shivamogga-1':'Q6379055','candidate-tumakuru-1':'Q97441101','candidate-tumakuru-2':'Q7508029','candidate-udupi-1':'Q2044395','candidate-vijayapura-2':'Q66363313','candidate-vijayapura-3':'Q4907175','candidate-vijayanagara-1':'Q26732','candidate-yadgir-1':'Q106670062'
}
const api='https://www.wikidata.org/w/api.php'
const request=async params=>{
  const url=new URL(api);Object.entries({...params,action:'wbgetentities',format:'json'}).forEach(([key,value])=>url.searchParams.set(key,value))
  const response=await fetch(url,{headers:{'User-Agent':'KarnatakaHistoricalAtlas/0.11 research metadata discovery'}})
  if(!response.ok)throw new Error(`Wikidata HTTP ${response.status}`)
  return response.json()
}
const raw=await request({ids:Object.values(entities).join('|'),props:'labels|descriptions|claims',languages:'en|kn'})
const referenced=new Set()
for(const entity of Object.values(raw.entities||{}))for(const property of ['P1435','P137','P127','P131'])for(const claim of entity.claims?.[property]||[]){const id=claim.mainsnak?.datavalue?.value?.id;if(id)referenced.add(id)}
const referencedData=referenced.size?await request({ids:[...referenced].join('|'),props:'labels|descriptions',languages:'en|kn'}):{entities:{}}
const label=id=>{const item=referencedData.entities?.[id];return {id,en:item?.labels?.en?.value||id,kn:item?.labels?.kn?.value||''}}
const values=(entity,property)=>(entity.claims?.[property]||[]).map(claim=>claim.mainsnak?.datavalue?.value).filter(Boolean)
const records=Object.entries(entities).map(([candidateId,qid])=>{
  const entity=raw.entities[qid]
  const coordinate=values(entity,'P625')[0]
  const image=values(entity,'P18')[0]
  const inception=values(entity,'P571')[0]
  const websites=values(entity,'P856')
  return {candidateId,qid,label:{en:entity.labels?.en?.value||'',kn:entity.labels?.kn?.value||''},description:{en:entity.descriptions?.en?.value||'',kn:entity.descriptions?.kn?.value||''},coordinates:coordinate?{latitude:coordinate.latitude,longitude:coordinate.longitude,precision:coordinate.precision}:null,construction:inception?{time:inception.time,precision:inception.precision}:null,protection:values(entity,'P1435').map(item=>label(item.id)),managingAuthorities:[...values(entity,'P137'),...values(entity,'P127')].map(item=>label(item.id)),administrativeAreas:values(entity,'P131').map(item=>label(item.id)),photo:image?{url:`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(image)}?width=900`,fileName:image,sourceUrl:`https://commons.wikimedia.org/wiki/File:${encodeURIComponent(image.replace(/ /g,'_'))}`,licenseStatus:'verify-on-commons-file-page'}:null,officialWebsites:websites,citations:[{title:'Wikidata structured monument record',url:`https://www.wikidata.org/wiki/${qid}`,locator:'Coordinates, image, inception, designation and authority statements; verify referenced claims and Commons licence'}]}
})
console.log(JSON.stringify(records,null,2))
