import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { extractInscriptionRecords, extractLinks, unresolvedPageLead } from './lib/whatisindia-parser.mjs'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const argv=process.argv.slice(2)
const option=name=>{const index=argv.indexOf(name);return index>=0?argv[index+1]:null}
const seed=option('--seed')||'https://www.whatisindia.com/inscriptions.html'
const output=path.resolve(process.cwd(),option('--output')||'data/imports/whatisindia-inscriptions.json')
const cacheDirectory=path.resolve(process.cwd(),option('--cache')||'var/import-cache/whatisindia')
const maxPages=option('--max-pages')?Number(option('--max-pages')):Number.POSITIVE_INFINITY
const delayMs=option('--delay-ms')?Number(option('--delay-ms')):75
const refresh=argv.includes('--refresh')
const includePageLeads=!argv.includes('--numbered-only')
const retrievedAt=option('--retrieved-at')||new Date().toISOString().slice(0,10)
const sleep=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds))
const hash=value=>crypto.createHash('sha256').update(String(value)).digest('hex')

if(!Number.isFinite(maxPages)&&maxPages!==Number.POSITIVE_INFINITY)throw new Error('--max-pages must be a positive number.')
fs.mkdirSync(cacheDirectory,{recursive:true})

async function fetchPage(url){
  const cacheFile=path.join(cacheDirectory,`${hash(url)}.html`)
  if(!refresh&&fs.existsSync(cacheFile))return fs.readFileSync(cacheFile,'utf8')
  let error
  for(let attempt=1;attempt<=3;attempt++){
    try{
      const response=await fetch(url,{headers:{'user-agent':'KarnatakaHistoricalAtlasResearchImporter/1.0 (+https://try.karnata.sanchaya.net/)'}})
      if(!response.ok)throw new Error(`${response.status} ${response.statusText}`)
      const html=await response.text();fs.writeFileSync(cacheFile,html);return html
    }catch(caught){error=caught;if(attempt<3)await sleep(400*attempt)}
  }
  throw error
}

const queue=[seed],queued=new Set(queue),visited=new Set(),failures=[],records=[],sourcePages=[]
while(queue.length&&visited.size<maxPages){
  const url=queue.shift();if(visited.has(url))continue
  try{
    const html=await fetchPage(url);visited.add(url)
    const parsed=extractInscriptionRecords({html,url,retrievedAt})
    records.push(...parsed.records)
    const lead=includePageLeads?unresolvedPageLead({html,url,retrievedAt}):null
    if(lead)records.push(lead)
    sourcePages.push({url,title:parsed.title,publication:parsed.source.publication,volume:parsed.source.volume,numbered_records:parsed.records.length,page_level_lead:Boolean(lead)})
    for(const link of extractLinks(html,url))if(!queued.has(link)){queued.add(link);queue.push(link)}
    if(visited.size%50===0)console.log(`Crawled ${visited.size} pages; found ${records.length} inscription records/leads; ${queue.length} queued.`)
    if(delayMs>0)await sleep(delayMs)
  }catch(error){visited.add(url);failures.push({url,error:error.message});console.warn(`Skipped ${url}: ${error.message}`)}
}

const uniqueById=[...new Map(records.map(record=>[record.ID,record])).values()]
const quality=record=>[record.Category==='inscription'?100:0,record.District?20:0,record.Place?10:0,record['Period from']!=null?5:0,record['Source excerpt']?.length||0].reduce((sum,value)=>sum+value,0)
const locatorGroups=new Map(),unlocated=[]
for(const record of uniqueById){
  const number=record['Inscription number']
  if(!number){unlocated.push(record);continue}
  const key=[record['Source publication'],record.Volume,number].map(value=>String(value||'').toLowerCase()).join('|')
  const group=locatorGroups.get(key)||[];group.push(record);locatorGroups.set(key,group)
}
const uniqueRecords=[...unlocated]
for(const group of locatorGroups.values()){
  group.sort((left,right)=>quality(right)-quality(left));const winner=group[0]
  if(group.length>1){
    winner['Alternate source URLs']=[...new Set(group.map(record=>record['Source URL']).filter(Boolean))]
    winner['Duplicate source records']=group.slice(1).map(record=>({ID:record.ID,Name:record.Name,Page:record.Page,'Source URL':record['Source URL'],'Source excerpt':record['Source excerpt']}))
  }
  uniqueRecords.push(winner)
}
const payload={
  corpus:'WII',
  fixture:false,
  source:{id:'wii:source:discovery-index',publication:'WhatIsIndia inscriptions portal',url:seed},
  import_manifest:{seed,retrieved_at:retrievedAt,pages_crawled:visited.size,pages_discovered:queued.size,records:uniqueRecords.length,failures,complete:queue.length===0},
  source_pages:sourcePages,
  records:uniqueRecords,
}
fs.mkdirSync(path.dirname(output),{recursive:true})
fs.writeFileSync(output,`${JSON.stringify(payload,null,2)}\n`)
console.log(`Wrote ${uniqueRecords.length} records/leads from ${visited.size} pages to ${output}.`)
if(queue.length)console.log(`${queue.length} discovered pages were not crawled because --max-pages was reached.`)
if(failures.length)console.log(`${failures.length} page(s) failed; rerun the importer to retry cached/missing pages.`)
