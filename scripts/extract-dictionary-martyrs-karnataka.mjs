#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'

const input=process.argv[2]
const output=process.argv[3]
if(!input){
  console.error('Usage: npm run extract:martyrs-karnataka -- /path/to/Volume-5_djvu.txt [output.json]')
  process.exit(1)
}

const lines=readFileSync(resolve(input),'utf8').split(/\r?\n/)
const entries=[]
let page=null
let current=null

const pageNumber=line=>{
  const dictionary=line.match(/^\s*(\d+)\s+Dictionary of Martyrs/i)
  if(dictionary)return Number(dictionary[1])
  if(/^\s*Andhra Pradesh, Telangana, Karnataka/i.test(line)){
    const suffix=line.match(/([\d\s]+)\s*$/)?.[1]?.replace(/\s/g,'')
    if(suffix&&Number(suffix)<400)return Number(suffix)
  }
  return null
}
const entryHead=line=>{
  const match=line.trim().match(/^([A-Z][A-Za-zÀ-ž0-9.'’()\- ]{1,118}):(?:\s|$)/)
  if(!match)return null
  const candidate=match[1].replace(/\s+/g,' ').trim()
  if(/^(Andhra Pradesh|Karnataka|Tamil Nadu|Kerala|Source|Sources|Note|Notes|References|Bibliography)$/i.test(candidate))return null
  return candidate
}
const finish=()=>{if(current){current.text=current.lines.join(' ').replace(/\s+/g,' ').trim();delete current.lines;entries.push(current)}}

for(let index=0;index<lines.length;index+=1){
  const detectedPage=pageNumber(lines[index])
  const runningHeader=/^\s*(?:\d+\s+)?Dictionary of Martyrs|^\s*Andhra Pradesh, Telangana, Karnataka/i.test(lines[index])
  if(detectedPage!=null)page=detectedPage
  if(runningHeader)continue
  const name=entryHead(lines[index])
  if(name){finish();current={name,startLine:index+1,printedPageFrom:page,printedPageTo:page,lines:[lines[index].trim()]}}
  else if(current){current.lines.push(lines[index].trim());if(page!=null)current.printedPageTo=page}
}
finish()

const districtNames=['Bagalakot','Bagalkot','Ballari','Bellary','Belgaum','Belagavi','Bangalore','Bengaluru','Bidar','Bijapur','Chikkaballapur','Chitradurga','Dakshina Kannada','Davanagere','Dharwad','Gadag','Gulbarga','Kalaburagi','Haveri','Kodagu','Coorg','Kolar','Koppal','Mandya','Mangalore','Mangaluru','Mysore','Mysuru','Raichur','Shimoga','Shivamogga','Tumkur','Tumakuru','Udupi','Uttara Kannada','North Kanara','South Kanara','Vijayapura','Yadgir']
const detectedDistricts=text=>[
  ...districtNames.filter(name=>new RegExp(`\\b${name.replaceAll(' ','\\s+')}\\b`,'i').test(text)),
  ...(/(?:\\bHassan\\b\\s+(?:district|distt?\\.?|taluk)|(?:district|distt?\\.?)\\s+\\bHassan\\b)/i.test(text)?['Hassan']:[]),
].filter((value,index,array)=>array.findIndex(other=>other.toLowerCase()===value.toLowerCase())===index)
const placeAlternation=['Karnataka','Mysore State',...districtNames].sort((a,b)=>b.length-a.length).map(value=>value.replaceAll(' ','\\s+')).join('|')
const placePattern=new RegExp(`\\b(?:${placeAlternation})\\b`,'i')
const directPatterns=[
  new RegExp(`\\b(?:born|resident|inhabitant|native|belonged|belonging|hailed|hailing)\\b[\\s\\S]{0,360}\\b(?:${placeAlternation})\\b`,'i'),
  new RegExp(`\\b(?:${placeAlternation})\\b[\\s\\S]{0,360}\\b(?:born|resident|inhabitant|native|belonged|belonging|hailed|hailing)\\b`,'i'),
]
const eventPattern=new RegExp(`\\b(?:movement|firing|uprising|struggle|agitation|arrested|imprisoned|detained|jailed|killed|died|executed|hanged|shot)\\b[\\s\\S]{0,420}\\b(?:${placeAlternation})\\b|\\b(?:${placeAlternation})\\b[\\s\\S]{0,420}\\b(?:movement|firing|uprising|struggle|agitation|arrested|imprisoned|detained|jailed|killed|died|executed|hanged|shot)\\b`,'i')
const archivalReference=text=>{
  const matches=[...text.matchAll(/\[([^\]]{2,300})\]/g)]
  return matches.at(-1)?.[1]?.replace(/\s+/g,' ').trim()||''
}
const historicalConnection=text=>{
  const narrative=text.split('[')[0]
  const years=[...new Set([...narrative.matchAll(/\b(18\d{2}|19[0-4]\d)\b/g)].map(match=>Number(match[1])))].sort((a,b)=>a-b)
  const actions=[]
  if(/\b(?:imprisoned|detained|jailed|prison|jail)\b/i.test(narrative))actions.push('imprisonment-or-detention')
  if(/\b(?:arrested|captured)\b/i.test(narrative))actions.push('arrest-or-capture')
  if(/\b(?:shot|firing|killed|died|executed|hanged)\b/i.test(narrative))actions.push('death-or-martyrdom')
  if(/\b(?:movement|rebellion|revolt|uprising|agitation|satyagraha|struggle)\b/i.test(narrative))actions.push('movement-or-resistance')
  if(/\b(?:battle|armed confrontation|attack)\b/i.test(narrative))actions.push('armed-action')
  return {years,actions}
}
const records=entries.filter(entry=>entry.printedPageFrom!=null&&!/^(?:Books|Official Papers|Primary Sources|Secondary Sources|Bibliography)/i.test(entry.name)&&placePattern.test(entry.text)).map(entry=>{
  const firstPart=entry.text.slice(0,700)
  const relationship=directPatterns.some(pattern=>pattern.test(firstPart))?'karnataka-origin-or-residence':eventPattern.test(entry.text)?'karnataka-event-connection':'incidental-karnataka-mention'
  const districts=detectedDistricts(entry.text)
  return {
    name:entry.name,
    relationship,
    printedPageFrom:entry.printedPageFrom,
    printedPageTo:entry.printedPageTo,
    sourceLine:entry.startLine,
    districtText:districts,
    archivalReference:archivalReference(entry.text),
    ...(relationship==='karnataka-event-connection'?{historicalConnection:historicalConnection(entry.text)}:{}),
  }
})

const result={
  meta:{
    sourceFile:basename(input),
    extractedAt:new Date().toISOString().slice(0,10),
    sourceTitle:'Dictionary of Martyrs: India’s Freedom Struggle, Volume 5',
    sourceId:'src-india-culture-dictionary-martyrs-v5',
    method:'Rule-based OCR entry extraction using Karnataka and historical/current place forms; every name, page, place and relationship remains needs-review against the page image.',
    entryCount:records.length,
    counts:Object.fromEntries(['karnataka-origin-or-residence','karnataka-event-connection','incidental-karnataka-mention'].map(kind=>[kind,records.filter(record=>record.relationship===kind).length])),
  },
  records,
}

const serialized=`${JSON.stringify(result,null,2)}\n`
if(output){writeFileSync(resolve(output),serialized);console.log(`Wrote ${records.length} Karnataka-linked entries to ${resolve(output)}.`)}
else process.stdout.write(serialized)
