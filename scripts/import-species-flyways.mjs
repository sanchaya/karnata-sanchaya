#!/usr/bin/env node
// For each migratory bird, finds the countries outside India where the eBird Observation Dataset (via GBIF) records it in
// its other season: May-Aug for winter visitors and passage migrants (where they spend the northern summer), Nov-Feb
// for summer visitors. This shows where birds are seen, not satellite-tracked routes. Writes
// src/data/species/species-flyways.json. Run: node scripts/import-species-flyways.mjs
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const cacheDir=path.join(root,'output/species-cache'),outFile=path.join(root,'src/data/species/species-flyways.json')
const UA='KarnatakaHistoricalAtlas/0.30 (https://karnata.sanchaya.net)',EBIRD='4fa7b334-ce0d-4e88-aaae-2e0c138d049e'
const sleep=ms=>new Promise(r=>setTimeout(r,ms))
const getJson=async url=>{
  const file=path.join(cacheDir,'fly-'+createHash('sha1').update(url).digest('hex'))
  try{return JSON.parse(await readFile(file,'utf8'))}catch{}
  for(let i=0;i<4;i++){const r=await fetch(url,{headers:{'User-Agent':UA}});if(r.ok){const j=await r.json();await writeFile(file,JSON.stringify(j));return j}if(r.status<500&&r.status!==429)throw new Error(`${r.status} ${url}`);await sleep(2000*(i+1))}
  throw new Error(`gave up on ${url}`)
}
await mkdir(cacheDir,{recursive:true})
const {species}=JSON.parse(await readFile(path.join(root,'src/data/species/karnataka-species.json'),'utf8'))
const iso2ToNumeric=new Map((await getJson('https://api.gbif.org/v1/enumeration/country')).map(c=>[c.iso2,Number(c.isoNumerical)]))
// Territories with no outline of their own on the globe are counted with their country.
const ALIAS=new Map([[312,250],[744,578]])   // Guadeloupe -> France, Svalbard and Jan Mayen -> Norway
const flyways={}
const birds=species.filter(s=>s.group==='bird'&&s.seasonality?.migratory===true)
let next=0
await Promise.all(Array.from({length:5},async()=>{while(next<birds.length){
  const s=birds[next++],summer=s.seasonality.pattern==='summer-visitor'
  const months=(summer?[11,12,1,2]:[5,6,7,8]).map(m=>`month=${m}`).join('&')
  try{
    const data=await getJson(`https://api.gbif.org/v1/occurrence/search?datasetKey=${EBIRD}&speciesKey=${s.gbifKey}&${months}&limit=0&facet=country&facetLimit=15`)
    const counts=(data.facets?.[0]?.counts||[]).filter(c=>c.name!=='IN'&&iso2ToNumeric.has(c.name))
    const total=counts.reduce((a,c)=>a+c.count,0)
    const countries=[...counts.filter(c=>c.count>=3&&c.count/total>=.03).reduce((m,c)=>{const id=ALIAS.get(iso2ToNumeric.get(c.name))??iso2ToNumeric.get(c.name);const e=m.get(id)||{id,n:0,share:0};e.n+=c.count;e.share=Math.round((e.share+c.count/total)*100)/100;return m.set(id,e)},new Map()).values()].sort((a,b)=>b.n-a.n).slice(0,6)
    // Indian states in the same months (Himalayan and northern breeders), merged case-insensitively, Karnataka left out.
    const stateData=await getJson(`https://api.gbif.org/v1/occurrence/search?datasetKey=${EBIRD}&speciesKey=${s.gbifKey}&country=IN&${months}&limit=0&facet=stateProvince&facetLimit=30`)
    const merged=new Map()
    for(const c of stateData.facets?.[0]?.counts||[]){const name=c.name.trim().toLowerCase().replace(/\b\w/g,l=>l.toUpperCase()).replace(/ And /g,' and ');if(!name||name==='Karnataka'||name.length>40)continue;merged.set(name,(merged.get(name)||0)+c.count)}
    const stateTotal=[...merged.values()].reduce((a,b)=>a+b,0)
    const states=[...merged].filter(([,n])=>n>=3&&n/Math.max(stateTotal+total,1)>=.05).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([name,n])=>({name,n,share:Math.round(n/Math.max(stateTotal+total,1)*100)/100}))
    if(countries.length||states.length)flyways[s.gbifKey]={season:summer?'winter-range':'summer-range',countries,states}
  }catch(error){console.warn('skip',s.gbifKey,error.message)}
}}))
await writeFile(outFile,JSON.stringify({generatedAt:new Date().toISOString().slice(0,10),note:'Countries outside India where eBird records each migratory bird in its other season (via GBIF). Sightings, not tracked routes.',flyways})+'\n')
console.log('migratory birds',birds.length,'with countries',Object.keys(flyways).length)
