import { createHash, randomUUID } from 'node:crypto'
import { atlasData } from '../src/data/atlas.js'
import peopleCandidateCorpus from './seeds/wikimedia-people-candidates.json' with { type:'json' }

const clone=value=>JSON.parse(JSON.stringify(value))
export const datasetContent=value=>`${JSON.stringify(value,null,2)}\n`
const DATA_COLLECTIONS=['polities','externalPolities','externalGovernancePhases','events','culturalHeritage','periodicals','artifacts','templeInventoryLeads','heritageInventoryLeads','reigns','territorialExtents','deepChronologies','heritageAudits','districtHistoryResearch','inscriptionAudits','people','peopleCandidates','martyrCandidates','places','inscriptions','works','sources','relationships','politicalRelations','collaborations']
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
    peopleCandidateMeta:clone(peopleCandidateCorpus.meta),
    peopleCandidates:clone(peopleCandidateCorpus.records),
  })
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
