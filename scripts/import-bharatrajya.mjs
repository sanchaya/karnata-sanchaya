import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const base='https://www.bharatrajya.com/data'
const output=path.resolve(process.cwd(),'data/imports/bharatrajya-discovery.json')
const moduleOutput=path.resolve(process.cwd(),'src/data/bharatrajya-karnataka.generated.js')
const retrievedAt=new Date().toISOString().slice(0,10)
const datasets=['kingdoms','territories','events','sources','milestones','monuments','dynasty_rulers','district-events']
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
const slug=value=>normalize(value).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90).replace(/-$/,'')
const shortHash=value=>crypto.createHash('sha256').update(String(value)).digest('hex').slice(0,14)
const bilingual=en=>({en:String(en||''),kn:''})
const review={status:'needs-review',reviewer:null,updatedAt:retrievedAt}

async function getJson(name,extension='json'){
  const url=`${base}/${name}.${extension}`,response=await fetch(url,{headers:{'user-agent':'KarnatakaHistoricalAtlasResearchImporter/1.0 (+https://try.karnata.sanchaya.net/)'}})
  if(!response.ok)throw new Error(`${url}: ${response.status} ${response.statusText}`)
  return response.json()
}

const entries=Object.fromEntries(await Promise.all(datasets.map(async name=>[name,await getJson(name)])))
const districts=await getJson('districts','geojson')
const karnatakaFeatures=districts.features.filter(feature=>normalize(feature.properties?.NAME_1)==='karnataka')
const karnatakaCodes=new Set(karnatakaFeatures.map(feature=>feature.properties.code))
const districtNames=karnatakaFeatures.map(feature=>feature.properties.NAME_2).filter(Boolean)

function geometryCenter(geometry){
  const points=[];const walk=value=>{if(Array.isArray(value)&&value.length===2&&value.every(Number.isFinite))points.push(value);else if(Array.isArray(value))value.forEach(walk)};walk(geometry?.coordinates)
  if(!points.length)return null
  const lngs=points.map(point=>point[0]),lats=points.map(point=>point[1]);return[(Math.min(...lngs)+Math.max(...lngs))/2,(Math.min(...lats)+Math.max(...lats))/2]
}
const districtCenters=new Map(karnatakaFeatures.map(feature=>[feature.properties.code,geometryCenter(feature.geometry)]))

const localPolityTerms=['kadamba','western ganga','ganga dynasty','badami chalukya','chalukyas of badami','kalyani chalukya','western chalukya','rashtrakuta','hoysala','vijayanagara','mysore','wadiyar','wodeyar','hyder ali','tipu sultan','bahmani','bijapur','adil shahi','keladi','ikkeri','chitradurga nayaka','alupa','banavasi','gangavadi','karnata','karnataka','kannada','raichur doab']
const localNameTerms=[...new Set([...localPolityTerms,...districtNames.map(normalize)])]
const containsLocalTerm=value=>{const haystack=normalize(value);return localNameTerms.some(term=>term&&haystack.includes(term))}
const inKarnataka=record=>Number.isFinite(record?.lat)&&Number.isFinite(record?.lng)&&record.lat>=11.4&&record.lat<=18.6&&record.lng>=74&&record.lng<=78.7

const globalEvents=entries.events.filter(record=>inKarnataka(record)||containsLocalTerm([record.text,record.belligerents,record.commanders,record.outcome].join(' ')))
const milestoneEvents=entries.milestones.filter(record=>containsLocalTerm([record.text,record.detail,record.region].join(' '))&&(Number.isFinite(record.lat)&&Number.isFinite(record.lng)))
const districtEvents=Object.entries(entries['district-events']).filter(([code])=>karnatakaCodes.has(code)).flatMap(([code,records])=>records.map(record=>({...record,districtCode:code,districtCenter:districtCenters.get(code)})))

const eventType=record=>{
  const value=normalize(record.category||record.kind)
  if(/war|battle|siege|revolt|rebellion/.test(value))return'war'
  if(/polit/.test(value))return'political'
  if(/birth|death|person/.test(value))return'people'
  return'historical-event'
}
const eventName=record=>String(record.text||record.detail||'Historical research candidate').split(':')[0].trim().slice(0,220)
const toEvent=(record,scope,index)=>{
  const coordinates=record.districtCenter||(Number.isFinite(record.lng)&&Number.isFinite(record.lat)?[record.lng,record.lat]:null)
  if(!coordinates)return null
  const year=Number(record.year),endYear=Number.isFinite(Number(record.endYear))?Number(record.endYear):year
  return {
    id:`event-br-${slug(eventName(record))||'candidate'}-${shortHash(`${scope}|${year}|${record.text}|${index}`)}`,
    type:eventType(record),name:bilingual(eventName(record)),date:{from:year,to:endYear,era:year<0?'BCE':'CE',precision:'year'},
    location:{type:'Point',coordinates,precision:'approximate'},route:null,
    summary:bilingual(record.detail||record.text),participants:[],peopleIds:[],citations:[],review,
    recordKind:'candidate',evidenceBasis:'discovery-lead',
    discovery:{provider:'BharatRajya',retrievedAt,originalSource:record.source||null,wiki:record.wiki||null,districtCode:record.districtCode||null,raw:record},
  }
}
const publicEvents=[...globalEvents.map((record,index)=>toEvent(record,'event',index)),...milestoneEvents.map((record,index)=>toEvent(record,'milestone',index)),...districtEvents.map((record,index)=>toEvent(record,'district',index))].filter(Boolean)
const uniqueEvents=[...new Map(publicEvents.map(record=>[[record.date.from,normalize(record.name.en),record.location.coordinates.map(value=>value.toFixed(3)).join(',')].join('|'),record])).values()]

const karnatakaTerritories=entries.territories.filter(record=>karnatakaCodes.has(record.districtCode))
const karnatakaPolityNames=new Set(karnatakaTerritories.map(record=>record.kingdomName))
const peopleCandidates=Object.entries(entries.dynasty_rulers).filter(([polity])=>karnatakaPolityNames.has(polity)||containsLocalTerm(polity)).flatMap(([polity,rulers])=>rulers.map((record,index)=>({
  id:`person-br-${slug(record.ruler)||'candidate'}-${shortHash(`${polity}|${record.ruler}|${record.start}|${index}`)}`,name:bilingual(record.ruler),roles:['ruler'],polityName:polity,
  date:{from:Number.isFinite(Number(record.start))?Number(record.start):null,to:Number.isFinite(Number(record.end))?Number(record.end):null,era:'CE',precision:'range'},
  description:bilingual(record.note||''),citations:[],review,recordKind:'candidate',evidenceBasis:'discovery-lead',discovery:{provider:'BharatRajya',retrievedAt,raw:record},
})))

const sourceCandidates=entries.sources.map(record=>({
  id:`src-br-${slug(record.id||record.title)||shortHash(JSON.stringify(record))}`,type:record.type||'research-reference',title:bilingual(record.title),authors:record.author?[record.author]:[],publisher:record.publisher||null,year:Number.isFinite(Number(record.year))?Number(record.year):null,url:record.url||record.library?.flatMap(item=>item.links||[]).find(link=>link.url)?.url||'',scope:bilingual(record.coverage||record.notes||''),review,
}))

const payload={meta:{schemaVersion:'bharatrajya-discovery-1',retrievedAt,discoveryOnly:true,publicPolicy:'Only Karnataka/Kannada-connected candidates are projected into the public generated module. BharatRajya is never used as the final citation; underlying sources require item-level verification.',counts:{...Object.fromEntries(datasets.map(name=>[name,Array.isArray(entries[name])?entries[name].length:Object.keys(entries[name]).length])),karnatakaDistricts:karnatakaCodes.size,karnatakaTerritories:karnatakaTerritories.length,publicEvents:uniqueEvents.length,peopleCandidates:peopleCandidates.length}},districts:karnatakaFeatures.map(feature=>feature.properties),raw:entries}
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,`${JSON.stringify(payload,null,2)}\n`)
fs.writeFileSync(moduleOutput,`// Generated by scripts/import-bharatrajya.mjs. Discovery candidates only; do not edit.\nexport const bharatrajyaImportMeta=${JSON.stringify(payload.meta,null,2)}\nexport const bharatrajyaKarnatakaEvents=${JSON.stringify(uniqueEvents,null,2)}\nexport const bharatrajyaKarnatakaPeopleCandidates=${JSON.stringify(peopleCandidates,null,2)}\nexport const bharatrajyaReferenceCandidates=${JSON.stringify(sourceCandidates,null,2)}\nexport const bharatrajyaKarnatakaTerritoryLeads=${JSON.stringify(karnatakaTerritories,null,2)}\n`)
console.log(`Imported ${uniqueEvents.length} Karnataka/Kannada public event candidates, ${peopleCandidates.length} people candidates, ${karnatakaTerritories.length} district-territory leads, and ${sourceCandidates.length} underlying reference candidates.`)
