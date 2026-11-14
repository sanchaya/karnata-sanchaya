#!/usr/bin/env node
// Finds an openly licensed photo for each species and writes src/data/species/species-images.json
// (keyed by GBIF species key). Photo = the species' Wikidata image (P18); its licence and author come from
// Wikimedia Commons. Only CC0, public domain, CC BY and CC BY-SA files are kept; anything else is skipped.
// The page hot-links the Commons thumbnail and always shows author, licence and a link to the file page.
// Run: node scripts/import-species-images.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cleanCredit, isOpenLicense } from '../src/species-images.js'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const speciesFile=path.join(root,'src/data/species/karnataka-species.json')
const outFile=path.join(root,'src/data/species/species-images.json')
const cacheDir=path.join(root,'output/species-cache')
const UA='KarnatakaHistoricalAtlas/0.30 (https://karnata.sanchaya.net)'
const sleep=ms=>new Promise(r=>setTimeout(r,ms))
async function getJson(url,options={}){
  const file=path.join(cacheDir,'img-'+createHash('sha1').update(url+(options.body||'')).digest('hex'))
  try{return JSON.parse(await readFile(file,'utf8'))}catch{}
  for(let attempt=0;attempt<4;attempt++){
    const res=await fetch(url,{headers:{'User-Agent':UA,Accept:'application/json'},...options})
    if(res.ok){const json=await res.json();await writeFile(file,JSON.stringify(json));return json}
    if(res.status<500&&res.status!==429)throw new Error(`${res.status} ${url}`)
    await sleep(2000*(attempt+1))
  }
  throw new Error(`gave up on ${url}`)
}
await mkdir(cacheDir,{recursive:true})
const {species}=JSON.parse(await readFile(speciesFile,'utf8'))
const withWd=species.filter(s=>s.wikidataId)

// 1. Wikidata image file names
const fileOf=new Map()
for(let i=0;i<withWd.length;i+=150){
  const batch=withWd.slice(i,i+150)
  const query=`SELECT ?item ?img WHERE { VALUES ?item { ${batch.map(s=>`wd:${s.wikidataId}`).join(' ')} } ?item wdt:P18 ?img }`
  const data=await getJson('https://query.wikidata.org/sparql?format=json',{method:'POST',headers:{'User-Agent':UA,Accept:'application/sparql-results+json','Content-Type':'application/x-www-form-urlencoded'},body:`query=${encodeURIComponent(query)}`})
  for(const b of data.results.bindings){
    const id=b.item.value.split('/').pop()
    if(!fileOf.has(id))fileOf.set(id,decodeURIComponent(b.img.value.split('/').pop()).replaceAll('_',' '))
  }
  await sleep(400)
}
console.log('species with a Wikidata image:',fileOf.size,'of',withWd.length)

// 2. Commons licence and author
const titles=[...new Set(fileOf.values())]
const info=new Map()
for(let i=0;i<titles.length;i+=40){
  const url=new URL('https://commons.wikimedia.org/w/api.php')
  Object.entries({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'480',titles:titles.slice(i,i+40).map(t=>`File:${t}`).join('|'),origin:'*'}).forEach(([k,v])=>url.searchParams.set(k,v))
  const body=await getJson(url.toString())
  for(const page of Object.values(body.query?.pages||{}))if(page.imageinfo?.[0])info.set(page.title.replace(/^File:/,''),page.imageinfo[0])
  await sleep(300)
}

// 3. keep open licences only
const images={};let rejected=0
for(const s of withWd){
  const file=fileOf.get(s.wikidataId);const ii=file&&info.get(file)
  if(!ii||!ii.thumburl)continue
  const meta=ii.extmetadata||{}
  const license=cleanCredit(meta.LicenseShortName?.value)
  if(!isOpenLicense(license,meta.NonFree?.value)){rejected++;continue}
  images[s.gbifKey]={file,thumb:ii.thumburl.split('?')[0],page:ii.descriptionurl,license,licenseUrl:meta.LicenseUrl?.value||'',author:cleanCredit(meta.Artist?.value).slice(0,140)||'Unknown author'}
}
await writeFile(outFile,JSON.stringify({generatedAt:new Date().toISOString().slice(0,10),source:'Wikimedia Commons via Wikidata P18',images})+'\n')
console.log('kept',Object.keys(images).length,'rejected for licence',rejected)
