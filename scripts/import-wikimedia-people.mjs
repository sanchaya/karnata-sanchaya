#!/usr/bin/env node
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const outputPath=path.join(root,'server/seeds/wikimedia-people-candidates.json')
const endpoint='https://query.wikidata.org/sparql'
const entityApi='https://www.wikidata.org/w/api.php'
const userAgent='KarnatakaHistoricalAtlas/0.25 (https://karnata.sanchaya.net)'
const reviewedAt=new Date().toISOString().slice(0,10)
const occupations={
  Q33999:{role:'actor',en:'actor',kn:'ನಟ / ನಟಿ'},
  Q36180:{role:'author',en:'writer',kn:'ಲೇಖಕ / ಲೇಖಕಿ'},
  Q2526255:{role:'film-director',en:'film director',kn:'ಚಲನಚಿತ್ರ ನಿರ್ದೇಶಕ / ನಿರ್ದೇಶಕಿ'},
  Q28389:{role:'screenwriter',en:'screenwriter',kn:'ಚಿತ್ರಕಥೆಗಾರ / ಚಿತ್ರಕಥೆಗಾರ್ತಿ'},
  Q49757:{role:'poet',en:'poet',kn:'ಕವಿ'},
  Q483501:{role:'artist',en:'artist',kn:'ಕಲಾವಿದ / ಕಲಾವಿದೆ'},
  Q3387717:{role:'theatre-director',en:'theatre director',kn:'ರಂಗ ನಿರ್ದೇಶಕ / ನಿರ್ದೇಶಕಿ'},
  Q83307:{role:'minister',en:'minister',kn:'ಸಚಿವ / ಸಚಿವೆ'},
}
const occupationIds=Object.keys(occupations)
const query=`SELECT DISTINCT ?person ?occupation ?birthplace ?birthDate ?deathDate ?coordinates ?image WHERE {
  VALUES ?occupation { ${occupationIds.map(id=>`wd:${id}`).join(' ')} }
  ?person wdt:P31 wd:Q5;
          wdt:P106 ?occupation;
          wdt:P19 ?birthplace.
  ?birthplace wdt:P131* wd:Q1185.
  OPTIONAL { ?person wdt:P569 ?birthDate. }
  OPTIONAL { ?person wdt:P570 ?deathDate. }
  OPTIONAL { ?birthplace wdt:P625 ?coordinates. }
  OPTIONAL { ?person wdt:P18 ?image. }
}`

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))
const qid=value=>value?.split('/').pop()
const parsePoint=value=>{const match=/Point\(([-\d.]+) ([-\d.]+)\)/.exec(value||'');return match?[Number(match[1]),Number(match[2])]:null}
const year=value=>{if(!value)return null;const match=/^([+-]?\d{4,})-/.exec(value);return match?Math.abs(Number(match[1])):null}
const era=value=>String(value||'').startsWith('-')?'BCE':'CE'
const imageUrl=value=>value?`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(decodeURIComponent(value.split('/').pop()))}`:null
const fetchJson=async(url,options={})=>{for(let attempt=1;attempt<=4;attempt+=1){const response=await fetch(url,{...options,headers:{'User-Agent':userAgent,...options.headers}});if(response.ok)return response.json();if(attempt===4)throw new Error(`${response.status} ${response.statusText}: ${url}`);await sleep(attempt*1500)}throw new Error('unreachable')}
const batches=(items,size)=>Array.from({length:Math.ceil(items.length/size)},(_,index)=>items.slice(index*size,(index+1)*size))

const sparql=await fetchJson(`${endpoint}?format=json&query=${encodeURIComponent(query)}`,{headers:{Accept:'application/sparql-results+json'}})
const rows=sparql.results.bindings
const ids=[...new Set(rows.flatMap(row=>[qid(row.person?.value),qid(row.birthplace?.value)]).filter(Boolean))]
const entities={}
for(const batch of batches(ids,50)){
  const params=new URLSearchParams({action:'wbgetentities',ids:batch.join('|'),props:'labels|aliases|sitelinks',languages:'en|kn',languagefallback:'1',format:'json',origin:'*'})
  const result=await fetchJson(`${entityApi}?${params}`)
  Object.assign(entities,result.entities||{})
  await sleep(120)
}

const grouped=new Map()
for(const row of rows){
  const id=qid(row.person.value),occupationId=qid(row.occupation.value),birthplaceId=qid(row.birthplace.value)
  const current=grouped.get(id)||{id,occupationIds:new Set(),birthplaceId,birthDate:row.birthDate?.value||null,deathDate:row.deathDate?.value||null,coordinates:parsePoint(row.coordinates?.value),image:row.image?.value||null}
  current.occupationIds.add(occupationId)
  current.birthDate ||= row.birthDate?.value||null
  current.deathDate ||= row.deathDate?.value||null
  current.coordinates ||= parsePoint(row.coordinates?.value)
  current.image ||= row.image?.value||null
  grouped.set(id,current)
}

const label=(entity,language)=>entity?.labels?.[language]?.value||''
const aliases=(entity,language)=>[...new Set((entity?.aliases?.[language]||[]).map(item=>item.value))]
const records=[...grouped.values()].map(item=>{
  const entity=entities[item.id]||{},birthplace=entities[item.birthplaceId]||{}
  const en=label(entity,'en')||item.id,kn=label(entity,'kn')
  const birthYear=year(item.birthDate),deathYear=year(item.deathDate),dateEra=era(item.birthDate||item.deathDate)
  const deathEra=era(item.deathDate||item.birthDate)
  const consistentDeath=deathYear&&birthYear&&deathEra===dateEra&&(dateEra==='BCE'?deathYear<=birthYear:deathYear>=birthYear)?deathYear:null
  const roles=[...item.occupationIds].map(id=>occupations[id]?.role).filter(Boolean).sort()
  const requiredEvidence=['identity','karnatakaConnection','bilingualName','lifeDates','roles','contributions','authorityCitations','imageLicense']
  const evidence={
    identity:{status:'located',source:'Wikidata item'},
    karnatakaConnection:{status:'provisional',source:'Wikidata birthplace and administrative hierarchy'},
    bilingualName:{status:kn?'located':'unresolved'},
    lifeDates:{status:birthYear&&(!deathYear||consistentDeath)?'located':birthYear?'provisional':'unresolved'},
    roles:{status:'provisional',source:'Wikidata occupation statements'},
    contributions:{status:'unresolved'},authorityCitations:{status:'unresolved'},imageLicense:{status:item.image?'unresolved':'not-available'},
  }
  const wikipediaTitle=entity.sitelinks?.enwiki?.title
  return {
    id:`person-candidate-${item.id.toLowerCase()}`,
    name:{en,kn},aliases:{en:aliases(entity,'en'),kn:aliases(entity,'kn')},roles,
    occupations:[...item.occupationIds].sort().map(id=>({wikidataId:id,name:{en:occupations[id]?.en||id,kn:occupations[id]?.kn||''}})),
    date:{from:birthYear,to:consistentDeath||birthYear,era:dateEra,precision:birthYear?(consistentDeath?'range':'year'):'unknown'},
    birthplace:{wikidataId:item.birthplaceId,name:{en:label(birthplace,'en')||item.birthplaceId,kn:label(birthplace,'kn')},location:item.coordinates?{type:'Point',coordinates:item.coordinates,precision:'settlement-centre'}:null},
    externalIds:{wikidata:item.id},externalLinks:[{label:'Wikidata',url:`https://www.wikidata.org/wiki/${item.id}`},...(wikipediaTitle?[{label:'Wikipedia',url:`https://en.wikipedia.org/wiki/${encodeURIComponent(wikipediaTitle.replaceAll(' ','_'))}`}]:[])],
    image:item.image?{url:imageUrl(item.image),repository:'Wikimedia Commons',licenseStatus:'needs-review'}:null,
    discovery:{method:'occupation-and-birthplace-query',scope:'birthplace within present-day Karnataka administrative hierarchy',retrievedAt:reviewedAt,publicationReady:false,...(deathYear&&!consistentDeath?{dateClaimConflict:{birth:item.birthDate,death:item.deathDate}}:{})},
    citations:[{sourceId:'src-wikidata-people-candidate-audit',locator:`${item.id}; birthplace ${item.birthplaceId}; occupations ${[...item.occupationIds].sort().join(', ')}`}],
    reviewWorkflow:{target:'curated-person-record',status:'candidate-intake',evidence},
    review:{status:'needs-review',reviewer:null,updatedAt:reviewedAt},
  }
}).sort((a,b)=>a.name.en.localeCompare(b.name.en,'en'))

const payload={meta:{schemaVersion:'atlas-people-candidates-0.25',title:'Wikimedia people discovery candidates born in present-day Karnataka',generatedAt:new Date().toISOString(),queryEndpoint:endpoint,query,methodology:'Direct Wikidata occupation matches with a recorded birthplace whose P131 hierarchy reaches Karnataka (Q1185). This is a discovery corpus, not verified biography or proof of Kannada contribution.',candidateCount:records.length,occupationIds,reviewContract:{target:'curated-person-record',requiredEvidence:['identity','karnatakaConnection','bilingualName','lifeDates','roles','contributions','authorityCitations','imageLicense'],independentReview:{reviewerRequired:true,conflictOfInterestRule:'reviewer-must-not-be-the-contributor'},crowdsourcing:{public:true,acceptedContributions:['bilingual-name','identity-match','life-dates','district-connection','profession-and-role','works-and-credits','office-terms','authority-citations','image-license']}}},records}
await writeFile(outputPath,`${JSON.stringify(payload,null,2)}\n`)
console.log(`Wrote ${records.length} review candidates to ${path.relative(root,outputPath)}`)
if(records.length!==905)console.warn(`Expected the audited 905-candidate snapshot; received ${records.length}. Review Wikidata changes before committing.`)
