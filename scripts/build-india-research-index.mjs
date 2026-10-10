import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const root=process.cwd()
const bharatPath=path.join(root,'data/imports/bharatrajya-discovery.json')
const inscriptionPath=path.join(root,'data/imports/whatisindia-inscriptions.json')
const outputPath=path.join(root,'src/data/india-research.generated.js')

const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8'))
const slug=value=>String(value||'record').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,86)
const hash=value=>crypto.createHash('sha256').update(String(value)).digest('hex').slice(0,12)
const finite=value=>Number.isFinite(Number(value))?Number(value):null
const recordId=(prefix,value,index)=>`${prefix}:${slug(value)}:${hash(`${value}|${index}`)}`
const indiaCoordinate=(lat,lng)=>Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=6&&lat<=38&&lng>=67&&lng<=98

if(!fs.existsSync(bharatPath)||!fs.existsSync(inscriptionPath)){
  throw new Error('Run npm run import:bharatrajya and npm run import:whatisindia before building the India research index.')
}

const bharat=readJson(bharatPath)
const whatisindia=readJson(inscriptionPath)
const raw=bharat.raw||{}
const indiaPolityNames=new Set((raw.territories||[]).filter(item=>String(item.districtCode||'').startsWith('IN-')).map(item=>item.kingdomName))
const records=[]
const push=record=>records.push({...record,reviewStatus:'needs-review'})

;(raw.kingdoms||[]).forEach((item,index)=>push({
  id:recordId('br:kingdom',item.name,index),provider:'BharatRajya',dataset:'history',kind:'kingdom',scope:indiaPolityNames.has(item.name)?'india':'subcontinent',
  title:item.name,summary:item.description||'',yearFrom:finite(item.startYear??item.founded),yearTo:finite(item.endYear??item.ended),
  place:item.capital||'',category:item.type||item.polityKind||'',color:item.color||null,sourceClaim:'',url:'',rawId:item.name,
}))

;(raw.events||[]).forEach((item,index)=>{const lat=finite(item.lat),lng=finite(item.lng);push({
  id:recordId('br:event',`${item.year}|${item.text}`,index),provider:'BharatRajya',dataset:'history',kind:'event',scope:indiaCoordinate(lat,lng)?'india':'subcontinent',
  title:item.text||'Historical event',summary:item.detail||item.outcome||'',yearFrom:finite(item.year),yearTo:finite(item.endYear??item.year),
  place:item.region||'',category:item.category||'',lat,lng,sourceClaim:item.source||'',url:item.wiki||'',rawId:null,
})})

;(raw.milestones||[]).forEach((item,index)=>{const lat=finite(item.lat),lng=finite(item.lng);push({
  id:recordId('br:milestone',`${item.year}|${item.text}`,index),provider:'BharatRajya',dataset:'history',kind:'milestone',scope:indiaCoordinate(lat,lng)?'india':'india-catalogue',
  title:item.text||'Historical milestone',summary:item.detail||'',yearFrom:finite(item.year),yearTo:finite(item.endYear??item.year),
  place:item.region||'',category:item.category||'',lat,lng,sourceClaim:item.source||'',url:item.wiki||'',rawId:null,
})})

;(raw.territories||[]).forEach((item,index)=>push({
  id:recordId('br:territory',`${item.districtCode}|${item.kingdomName}|${item.startYear}`,index),provider:'BharatRajya',dataset:'history',kind:'territory',
  scope:String(item.districtCode||'').startsWith('IN-')?'india':'subcontinent',title:item.kingdomName||'Territorial assignment',summary:'',
  yearFrom:finite(item.startYear),yearTo:finite(item.endYear),place:item.districtCode||'',districtCode:item.districtCode||'',category:'territorial assignment',sourceClaim:'',url:'',rawId:null,
}))

Object.entries(raw.dynasty_rulers||{}).forEach(([dynasty,rulers])=>(rulers||[]).forEach((item,index)=>push({
  id:recordId('br:ruler',`${dynasty}|${item.ruler}|${item.start}`,index),provider:'BharatRajya',dataset:'history',kind:'ruler',scope:indiaPolityNames.has(dynasty)?'india':'subcontinent',
  title:item.ruler||'Ruler',summary:item.note||'',yearFrom:finite(item.start),yearTo:finite(item.end),place:dynasty,category:item.title||'ruler',sourceClaim:'',url:'',rawId:null,
})))

Object.entries(raw['district-events']||{}).forEach(([districtCode,items])=>(items||[]).forEach((item,index)=>push({
  id:recordId('br:district-event',`${districtCode}|${item.year}|${item.text}`,index),provider:'BharatRajya',dataset:'history',kind:'district-event',
  scope:String(districtCode).startsWith('IN-')?'india':'subcontinent',title:item.text||'District event',summary:item.detail||item.outcome||'',
  yearFrom:finite(item.year),yearTo:finite(item.endYear??item.year),place:districtCode,districtCode,category:item.kind||item.category||'event',sourceClaim:item.source||'',url:item.wiki||'',rawId:null,
})))

const monumentKingdoms=raw.monuments?.kingdoms||{}
Object.entries(monumentKingdoms).forEach(([kingdom,value])=>(value.items||[]).forEach((item,index)=>push({
  id:recordId('br:monument',`${kingdom}|${item.code}|${item.name}`,index),provider:'BharatRajya',dataset:'history',kind:'monument',
  scope:String(item.code||'').startsWith('IN-')?'india':'subcontinent',title:item.name||'Monument',summary:`${kingdom} · ${item.basis||'attribution under review'}`,
  yearFrom:null,yearTo:null,place:[item.district,item.state].filter(Boolean).join(', '),districtCode:item.code||'',category:item.type||'monument',sourceClaim:'',url:item.wiki||'',rawId:null,
})))

;(whatisindia.records||[]).forEach((item,index)=>push({
  id:item.ID||recordId('wii:inscription',item.Name,index),provider:'WhatIsIndia',dataset:'inscriptions',kind:item.Category||'inscription-lead',scope:'india',
  title:item.Name||item['Original page title']||'Inscription record',summary:item.Description||'',yearFrom:finite(item['Period from']),yearTo:finite(item['Period to']),
  place:item.Place||'',district:item.District||'',taluk:item.Taluk||'',category:item.Category||'',publication:item['Source publication']||'',
  volume:item.Volume||'',page:item.Page||'',number:item['Inscription number']||'',sourceClaim:'',url:item['Source URL']||'',rawId:item.ID||null,
  dateCertainty:item['Date certainty']||'unknown',locationPrecision:item['Location precision']||'unknown',
}))

const sources=(raw.sources||[]).map((item,index)=>({
  id:item.id||recordId('br:source',item.title,index),provider:'BharatRajya source catalogue',dataset:'sources',kind:item.type||'source',scope:'india-catalogue',
  title:item.title||'Source',summary:item.notes||item.coverage||'',yearFrom:finite(item.year),yearTo:null,place:item.coverage||'',category:item.type||'',
  publication:item.publisher||'',volume:item.volume||'',url:item.url||item.library?.flatMap(entry=>entry.links||[]).find(link=>link.url)?.url||'',reviewStatus:'needs-review',
}))

const index={
  meta:{
    schemaVersion:'india-research-index-1',generatedAt:new Date().toISOString().slice(0,10),hiddenDirectRoute:'#india-research',
    policy:'Discovery workspace. BharatRajya is not treated as a scholarly citation; every claim must be matched to and checked against its underlying source before publication.',
    bharatrajya:{retrievedAt:bharat.meta?.retrievedAt,counts:bharat.meta?.counts||{}},
    whatisindia:{retrievedAt:whatisindia.import_manifest?.retrieved_at,pagesCrawled:whatisindia.import_manifest?.pages_crawled||0,records:whatisindia.records?.length||0,failures:whatisindia.import_manifest?.failures?.length||0},
    recordCount:records.length,sourceCount:sources.length,
  },records,sources,
}

fs.writeFileSync(outputPath,`// Generated by scripts/build-india-research-index.mjs. Do not edit.\nexport const indiaResearchIndex=${JSON.stringify(index)}\n`)
console.log(`Wrote ${records.length.toLocaleString('en-IN')} research records and ${sources.length} source candidates to ${outputPath}.`)
