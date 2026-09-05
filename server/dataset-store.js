import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { atlasData } from '../src/data/atlas.js'
import peopleCandidateCorpus from './seeds/wikimedia-people-candidates.json' with { type:'json' }

const clone=value=>JSON.parse(JSON.stringify(value))
const moduleDirectory=path.dirname(fileURLToPath(import.meta.url))
const privateNaksheSeedFile=process.env.NAKSHE_SITES_SEED_FILE||path.resolve(moduleDirectory,'../var/private-seeds/nakshe-sites.json')
const privateNaksheSites=()=>{
  if(!fs.existsSync(privateNaksheSeedFile))return []
  const payload=JSON.parse(fs.readFileSync(privateNaksheSeedFile,'utf8'))
  if(!Array.isArray(payload?.records))throw new Error(`Private Nakshe seed must contain a records array: ${privateNaksheSeedFile}`)
  return payload.records
}
export const datasetContent=value=>`${JSON.stringify(value,null,2)}\n`
const DATA_COLLECTIONS=['polities','externalPolities','externalGovernancePhases','events','culturalHeritage','periodicals','epigraphiaArchiveTexts','artifacts','feudatoryRelations','genealogicalRelations','administrativeDivisions','boundaryEvidence','coinRecords','manuscriptWitnesses','inscriptionEditions','scriptEvolution','openDatasetCatalogue','templeInventoryLeads','heritageInventoryLeads','naksheSites','reigns','territorialExtents','deepChronologies','heritageAudits','districtHistoryResearch','inscriptionAudits','people','peopleCandidates','martyrCandidates','places','inscriptions','works','sources','relationships','politicalRelations','collaborations']
const ADDITIVE_ARRAY_FIELDS=new Set(['citations','alternateUrls','aliases','roles'])

// Repository research passes may add evidence to records that already exist in
// MariaDB. Add missing fields and provenance without replacing reviewer-edited
// scalar values. District associations are merged by claim identity so a new
// citation does not create a duplicate district tag.
function mergeRepositoryAdditions(current,seed,key=''){
  if(Array.isArray(current)&&Array.isArray(seed)){
    if(key==='districtAssociations'){
      let changed=false
      for(const candidate of seed){
        const match=current.find(item=>item?.districtId===candidate?.districtId&&item?.kind===candidate?.kind)
        if(match)changed=mergeRepositoryAdditions(match,candidate,key)||changed
        else{current.push(clone(candidate));changed=true}
      }
      return changed
    }
    if(!ADDITIVE_ARRAY_FIELDS.has(key))return false
    let changed=false
    for(const candidate of seed){
      const signature=JSON.stringify(candidate)
      if(!current.some(item=>JSON.stringify(item)===signature)){current.push(clone(candidate));changed=true}
    }
    return changed
  }
  if(!current||typeof current!=='object'||Array.isArray(current)||!seed||typeof seed!=='object'||Array.isArray(seed))return false
  let changed=false
  for(const [childKey,value] of Object.entries(seed)){
    if(current[childKey]===undefined||current[childKey]===null){current[childKey]=clone(value);changed=true;continue}
    changed=mergeRepositoryAdditions(current[childKey],value,childKey)||changed
  }
  return changed
}

// Older MariaDB snapshots can predate collections introduced in later milestones.
// Normalize those keys before validation so a deploy upgrades the revision instead
// of failing with “Collection must be an array”.
export function normalizeDatasetCollections(value){
  const dataset=clone(value||{})
  for(const collection of DATA_COLLECTIONS){
    const current=dataset[collection]
    if(Array.isArray(current))continue
    dataset[collection]=current&&typeof current==='object'?Object.values(current).filter(record=>record&&typeof record==='object'):[]
  }
  return dataset
}

export function repositoryDataset(){
  return normalizeDatasetCollections({
    ...clone(atlasData),
    naksheSites:clone(privateNaksheSites()),
    peopleCandidateMeta:clone(peopleCandidateCorpus.meta),
    peopleCandidates:clone(peopleCandidateCorpus.records),
  })
}

// Collections listed here contain partner-supplied working data whose record
// payloads must never cross the authenticated administration boundary.
export function publicDataset(dataset){
  const value=normalizeDatasetCollections(dataset)
  value.naksheSites=[]
  return value
}

export function mergeRepositorySeed(current){
  const baseline=repositoryDataset()
  if(!current)return {dataset:baseline,added:baseline.peopleCandidates.length,changed:true}
  const dataset=normalizeDatasetCollections(current)
  let added=0
  let updated=0
  for(const [collection, seedRecords] of Object.entries(baseline)){
    if(!Array.isArray(seedRecords))continue
    const existing=dataset[collection]
    const records=Array.isArray(existing)?existing:existing!=null&&typeof existing==='object'?Object.values(existing).filter(record=>record&&typeof record==='object'):null
    if(records==null){
      dataset[collection]=clone(seedRecords)
      added+=seedRecords.length
      continue
    }
    if(!Array.isArray(dataset[collection]))dataset[collection]=records
    const byId=new Map(records.map(record=>[record?.id,record]).filter(([id])=>Boolean(id)))
    for(const record of seedRecords)if(record?.id){const existingRecord=byId.get(record.id);if(!existingRecord){records.push(clone(record));byId.set(record.id,record);added+=1}else if(mergeRepositoryAdditions(existingRecord,record))updated+=1}
  }
  if(!dataset.peopleCandidateMeta||dataset.peopleCandidateMeta.candidateCount!==baseline.peopleCandidateMeta.candidateCount)dataset.peopleCandidateMeta=clone(baseline.peopleCandidateMeta)
  dataset.meta={...(dataset.meta||{}),schemaVersion:baseline.meta.schemaVersion}
  const changed=added>0||updated>0||JSON.stringify(dataset.peopleCandidateMeta)!==JSON.stringify(current.peopleCandidateMeta)||dataset.meta.schemaVersion!==current.meta?.schemaVersion
  return {dataset,added,updated,changed}
}

export async function latestDataset(db,{lock=false}={}){
  const suffix=lock?' FOR UPDATE':''
  const rows=await db.query(`SELECT revision,schema_version,content_sha256,dataset_json,updated_by,created_at FROM dataset_snapshots ORDER BY revision DESC LIMIT 1${suffix}`)
  if(!rows.length)return null
  const row=rows[0]
  const dataset=typeof row.dataset_json==='string'?JSON.parse(row.dataset_json):row.dataset_json
  return {revision:Number(row.revision),schemaVersion:row.schema_version,contentSha256:row.content_sha256,dataset,updatedBy:row.updated_by,updatedAt:row.created_at}
}

export async function insertDatasetRevision(db,dataset,{revision,updatedBy=null}={}){
  const content=datasetContent(dataset)
  const contentSha256=createHash('sha256').update(content).digest('hex')
  const id=randomUUID()
  await db.query('INSERT INTO dataset_snapshots (id,schema_version,revision,content_sha256,dataset_json,updated_by) VALUES (?,?,?,?,?,?)',[id,dataset.meta?.schemaVersion||'unknown',revision,contentSha256,content,updatedBy])
  return {id,revision,contentSha256}
}

const INDEXED_COLLECTIONS=['polities','externalPolities','events','people','places','inscriptions','works','artifacts','feudatoryRelations','genealogicalRelations','administrativeDivisions','boundaryEvidence','coinRecords','manuscriptWitnesses','inscriptionEditions','scriptEvolution','epigraphiaArchiveTexts','territorialExtents','relationships','politicalRelations','collaborations','heritageAudits','districtHistoryResearch','inscriptionAudits','templeInventoryLeads','heritageInventoryLeads','naksheSites']
const titleOf=value=>typeof value==='string'?{en:value,kn:null}:{en:value?.en||value?.kn||'Untitled record',kn:value?.kn||null}
const dateOf=record=>record.date||record.period||record.activePeriod||record.temporalCoverage||{}
const countryOf=record=>record.geographicScope?.countryCode||record.location?.countryCode||null
const reviewStatusOf=record=>record.review?.status||record.reviewStatus||record.status||record.promotionStatus||'needs-review'
const citationCountOf=record=>Array.isArray(record.citations)?record.citations.length:0
const pushLink=(links,record,collection,linkType,target)=>{
  if(!target)return
  links.push([record.id,collection,linkType,target,null,reviewStatusOf(record),citationCountOf(record)])
}

function evidenceGateEntries(record,collection){
  const gates=[]
  const collect=(key,value)=>{
    if(!value||typeof value!=='object')return
    const status=typeof value==='string'?value:value.status||value.state||value.reviewStatus
    if(!status)return
    gates.push([record.id,collection,key,status,value.sourceId||value.source?.sourceId||null,value.locator||value.source?.locator||null])
  }
  for(const [key,value] of Object.entries(record.evidenceGates||record.resolution||{}))collect(key,value)
  for(const [key,value] of Object.entries(record.reviewWorkflow||{}))collect(key,value)
  for(const [key,value] of Object.entries(record.promotionReview||{}))collect(key,value)
  return gates
}

function linkEntries(record,collection){
  const links=[]
  pushLink(links,record,collection,'capital',record.capitalId)
  pushLink(links,record,collection,'place',record.placeId)
  pushLink(links,record,collection,'polity',record.polityId)
  pushLink(links,record,collection,'from-person',record.fromPersonId)
  pushLink(links,record,collection,'to-person',record.toPersonId)
  pushLink(links,record,collection,'work',record.workId)
  pushLink(links,record,collection,'inscription',record.inscriptionId)
  pushLink(links,record,collection,'extent',record.extentId)
  pushLink(links,record,collection,'findspot',record.findspot?.placeId)
  for(const id of record.creatorIds||[])pushLink(links,record,collection,'creator',id)
  for(const id of record.peopleIds||[])pushLink(links,record,collection,'person',id)
  for(const id of record.eventIds||[])pushLink(links,record,collection,'event',id)
  for(const item of record.participants||[])pushLink(links,record,collection,'participant',item.id||item.entityId)
  for(const item of record.parties||[])pushLink(links,record,collection,'party',item.id||item.entityId)
  for(const item of record.placeAssociations||[])pushLink(links,record,collection,item.kind||'place-association',item.placeId)
  if(record.fromId&&record.toId){pushLink(links,record,collection,'from',record.fromId);pushLink(links,record,collection,record.type||'relationship',record.toId)}
  return links
}

export async function refreshResearchIndexes(db,dataset){
  const schemaVersion=dataset.meta?.schemaVersion||'unknown'
  const records=[]
  const links=[]
  const gates=[]
  for(const collection of INDEXED_COLLECTIONS){
    for(const record of dataset[collection]||[]){
      if(!record?.id)continue
      const title=titleOf(record.name||record.title||record.label)
      const date=dateOf(record)
      records.push([record.id,collection,record.type||record.kind||record.category||null,title.en,title.kn,date.from??null,date.to??null,date.precision||null,reviewStatusOf(record),countryOf(record),record.geographicScope?.outsideKarnataka?1:0,schemaVersion,JSON.stringify(record)])
      links.push(...linkEntries(record,collection))
      gates.push(...evidenceGateEntries(record,collection))
    }
  }
  await db.query('DELETE FROM research_evidence_gates')
  await db.query('DELETE FROM research_entity_links')
  await db.query('DELETE FROM research_record_index')
  for(const record of records)await db.query('INSERT INTO research_record_index (record_id,collection_name,record_type,title_en,title_kn,date_from,date_to,date_precision,review_status,country_code,outside_karnataka,schema_version,payload_json) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',record)
  for(const link of links)await db.query('INSERT INTO research_entity_links (source_record_id,source_collection,link_type,target_record_id,target_collection,review_status,citation_count) VALUES (?,?,?,?,?,?,?)',link)
  for(const gate of gates)await db.query('INSERT INTO research_evidence_gates (record_id,collection_name,gate_key,gate_status,source_id,locator) VALUES (?,?,?,?,?,?)',gate)
  return {records:records.length,links:links.length,gates:gates.length}
}
