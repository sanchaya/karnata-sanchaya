#!/usr/bin/env node
// Builds src/data/species/karnataka-species.json from open sources:
//   GBIF      species list for Karnataka (eBird observation dataset for birds, all
//             human observations for other groups), counts, taxonomy, English and
//             Kannada vernacular names, and the month profile used to infer seasonality
//   Wikidata  Kannada and English labels (CC0)
// Kannada names found here are only candidates: every record stays needs-review and the
// site collects corrections from readers. Usage: node scripts/import-species.mjs [--quick]
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { classifySeasonality, isKannada, normalizeKannada, normalizeEnglish, pickEnglishName } from '../src/species-normalize.js'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const outFile=path.join(root,'src/data/species/karnataka-species.json')
const cacheDir=path.join(root,'output/species-cache')
const quick=process.argv.includes('--quick')
const UA='KarnatakaHistoricalAtlas/0.30 (https://karnata.sanchaya.net)'
const EBIRD='4fa7b334-ce0d-4e88-aaae-2e0c138d049e'
const gbif='https://api.gbif.org/v1'
const base='country=IN&stateProvince=Karnataka&basisOfRecord=HUMAN_OBSERVATION'
// group, GBIF classKeys, how many top species (by observation count) to keep
const GROUPS=[
  {id:'bird',kn:'ಪಕ್ಷಿ',en:'Birds',classes:[212],cap:quick?40:1500,dataset:EBIRD},
  {id:'mammal',kn:'ಸಸ್ತನಿ',en:'Mammals',classes:[359],cap:quick?15:400},
  {id:'reptile',kn:'ಸರೀಸೃಪ',en:'Reptiles',classes:[11592253,11569602],cap:quick?15:400},
  {id:'amphibian',kn:'ಉಭಯಚರ',en:'Amphibians',classes:[131],cap:quick?15:300},
  {id:'insect',kn:'ಕೀಟ',en:'Insects (butterflies and dragonflies)',classes:[216],orders:[797,789],cap:quick?15:500},
  {id:'plant',kn:'ಸಸ್ಯ',en:'Plants',classes:[220,196,194,7228684],cap:quick?20:1200},
]
const sleep=ms=>new Promise(r=>setTimeout(r,ms))
async function getJson(url,options={}){
  // POST bodies (Wikidata batches) end identically, so they are keyed by a hash of the whole request.
  const key=options.body?createHash('sha1').update(url+options.body).digest('hex'):Buffer.from(url).toString('base64url').slice(-120)
  const file=path.join(cacheDir,key)
  try{return JSON.parse(await readFile(file,'utf8'))}catch{}
  for(let attempt=0;attempt<4;attempt++){
    const res=await fetch(url,{headers:{'User-Agent':UA,Accept:'application/json'},...options})
    if(res.ok){const json=await res.json();await writeFile(file,JSON.stringify(json));return json}
    if(res.status<500&&res.status!==429)throw new Error(`${res.status} ${url}`)
    await sleep(1500*(attempt+1))
  }
  throw new Error(`gave up on ${url}`)
}
async function pool(items,size,fn){const out=[];let i=0;await Promise.all(Array.from({length:size},async()=>{while(i<items.length){const n=i++;out[n]=await fn(items[n],n)}}));return out}

await mkdir(cacheDir,{recursive:true})
await mkdir(path.dirname(outFile),{recursive:true})

// 1. species keys per group
const found=new Map()
for(const group of GROUPS){
  const filters=[base,group.dataset&&`datasetKey=${group.dataset}`,...(group.orders||[]).map(o=>`orderKey=${o}`)].filter(Boolean)
  const perOrder=group.orders?group.orders.map(o=>[`orderKey=${o}`]):[[]]
  for(const classKey of group.classes)for(const extra of perOrder){
    const query=[base,group.dataset&&`datasetKey=${group.dataset}`,`classKey=${classKey}`,...extra].filter(Boolean).join('&')
    const data=await getJson(`${gbif}/occurrence/search?${query}&limit=0&facet=speciesKey&facetLimit=${group.cap}`)
    for(const {name,count} of data.facets?.[0]?.counts||[])if(!found.has(name)||found.get(name).count<count)found.set(name,{key:name,count,group:group.id})
    console.log(group.id,classKey,extra.join('')||'','→',data.facets?.[0]?.counts?.length||0)
  }
  // keep only the top `cap` per group
  const mine=[...found.values()].filter(s=>s.group===group.id).sort((a,b)=>b.count-a.count)
  for(const s of mine.slice(group.cap))found.delete(s.key)
}
const species=[...found.values()]
console.log('species to describe:',species.length)

// 2. taxonomy and vernacular names from GBIF
const described=await pool(species,6,async s=>{
  try{
    const [info,vern]=await Promise.all([getJson(`${gbif}/species/${s.key}`),getJson(`${gbif}/species/${s.key}/vernacularNames?limit=200`)])
    if(info.rank!=='SPECIES'||info.taxonomicStatus==='SYNONYM')return null
    const names=vern.results||[]
    return {...s,scientificName:info.canonicalName||info.scientificName,family:info.family||'',order:info.order||'',class:info.class||'',
      englishCandidates:names.filter(n=>n.language==='eng').map(n=>({value:n.vernacularName,source:n.source||'GBIF'})),
      knGbif:names.filter(n=>n.language==='kan').map(n=>({value:n.vernacularName,source:n.source||'GBIF'}))}
  }catch(error){console.warn('skip',s.key,error.message);return null}
})
const rows=described.filter(Boolean)

// 3. seasonality for birds from eBird month counts
await pool(rows.filter(r=>r.group==='bird'),6,async r=>{
  try{
    const data=await getJson(`${gbif}/occurrence/search?${base}&datasetKey=${EBIRD}&speciesKey=${r.key}&limit=0&facet=month&facetLimit=12`)
    const months=Array(12).fill(0)
    for(const {name,count} of data.facets?.[0]?.counts||[])months[Number(name)-1]=count
    r.seasonality=classifySeasonality(months)
  }catch(error){console.warn('no seasonality',r.key,error.message)}
})

// 4. Wikidata labels (CC0), in batches of 80 scientific names
const wikidata=new Map()
const names=[...new Set(rows.map(r=>r.scientificName))]
for(let i=0;i<names.length;i+=80){
  const batch=names.slice(i,i+80)
  const query=`SELECT ?name ?item ?kn ?en WHERE { VALUES ?name { ${batch.map(n=>JSON.stringify(n)).join(' ')} } ?item wdt:P225 ?name. FILTER(STRSTARTS(STR(?item),"http://www.wikidata.org/entity/Q")) OPTIONAL{?item rdfs:label ?kn FILTER(lang(?kn)="kn")} OPTIONAL{?item rdfs:label ?en FILTER(lang(?en)="en")} }`
  try{
    const data=await getJson('https://query.wikidata.org/sparql?format=json',{method:'POST',headers:{'User-Agent':UA,Accept:'application/sparql-results+json','Content-Type':'application/x-www-form-urlencoded'},body:`query=${encodeURIComponent(query)}`})
    for(const b of data.results.bindings){
      const entry=wikidata.get(b.name.value)||{id:'',kn:new Set(),en:new Set()}
      entry.id=b.item.value.split('/').pop()
      if(b.kn)entry.kn.add(b.kn.value)
      if(b.en)entry.en.add(b.en.value)
      wikidata.set(b.name.value,entry)
    }
  }catch(error){console.warn('wikidata batch failed',i,error.message)}
  await sleep(500)
}

// 5. normalize and merge
const date=new Date().toISOString().slice(0,10)
const out=rows.map(r=>{
  const wd=wikidata.get(r.scientificName)
  const knCandidates=new Map()
  const addKn=(value,source)=>{const v=normalizeKannada(value);if(!v||!isKannada(v))return;const e=knCandidates.get(v)||{value:v,sources:[]};if(!e.sources.includes(source))e.sources.push(source);knCandidates.set(v,e)}
  r.knGbif.forEach(n=>addKn(n.value,'GBIF'))
  wd?.kn.forEach(n=>addKn(n,'Wikidata'))
  const english=pickEnglishName(r.englishCandidates.map(n=>n.value),[...(wd?.en||[])].filter(n=>n.toLowerCase()!==r.scientificName.toLowerCase()))
  const kn=[...knCandidates.values()].sort((a,b)=>b.sources.length-a.sources.length)
  const group=GROUPS.find(g=>g.id===r.group)
  return {id:`species-gbif-${r.key}`,gbifKey:Number(r.key),wikidataId:wd?.id||'',scientificName:r.scientificName,group:r.group,family:r.family,order:r.order,
    name:{en:english,kn:kn[0]?.value||''},knCandidates:kn,observations:r.count,
    ...(r.seasonality?{seasonality:r.seasonality}:{}),
    review:{status:'needs-review',note:'Names and seasonality are imported or inferred; confirm before treating as fact.'}}
}).sort((a,b)=>a.group.localeCompare(b.group)||b.observations-a.observations)

const counts=Object.fromEntries(GROUPS.map(g=>[g.id,out.filter(r=>r.group===g.id).length]))
await writeFile(outFile,JSON.stringify({generatedAt:date,groups:GROUPS.map(({id,kn,en})=>({id,kn,en})),sources:[
  {id:'gbif',title:'GBIF occurrence search, Karnataka, human observations; eBird Observation Dataset for birds (CC BY 4.0)',url:'https://www.gbif.org/dataset/4fa7b334-ce0d-4e88-aaae-2e0c138d049e'},
  {id:'wikidata',title:'Wikidata taxon labels (CC0)',url:'https://www.wikidata.org/'}],counts,species:out},null,0)+'\n')
await writeFile(path.join(path.dirname(outFile),'species-meta.json'),JSON.stringify({speciesCount:out.length,sourceCount:5},null,1)+'\n') // GBIF, Wikidata, the 2 curated name lists, Wikimedia Commons photos
console.log(counts,'with Kannada candidate:',out.filter(r=>r.name.kn).length,'of',out.length)
