import { createHash, randomUUID } from 'node:crypto'
import { atlasData } from '../src/data/atlas.js'
import peopleCandidateCorpus from './seeds/wikimedia-people-candidates.json' with { type:'json' }

const clone=value=>JSON.parse(JSON.stringify(value))
export const datasetContent=value=>`${JSON.stringify(value,null,2)}\n`

export function repositoryDataset(){
  return {
    ...clone(atlasData),
    peopleCandidateMeta:clone(peopleCandidateCorpus.meta),
    peopleCandidates:clone(peopleCandidateCorpus.records),
  }
}

export function mergeRepositorySeed(current){
  const baseline=repositoryDataset()
  if(!current)return {dataset:baseline,added:baseline.peopleCandidates.length,changed:true}
  const dataset=clone(current)
  let added=0
  for(const collection of ['sources','peopleCandidates']){
    const records=Array.isArray(dataset[collection])?dataset[collection]:[]
    const ids=new Set(records.map(record=>record?.id).filter(Boolean))
    for(const record of baseline[collection])if(record?.id&&!ids.has(record.id)){records.push(clone(record));ids.add(record.id);added+=1}
    dataset[collection]=records
  }
  if(!dataset.peopleCandidateMeta||dataset.peopleCandidateMeta.candidateCount!==baseline.peopleCandidateMeta.candidateCount)dataset.peopleCandidateMeta=clone(baseline.peopleCandidateMeta)
  dataset.meta={...(dataset.meta||{}),schemaVersion:baseline.meta.schemaVersion}
  const changed=added>0||JSON.stringify(dataset.peopleCandidateMeta)!==JSON.stringify(current.peopleCandidateMeta)||dataset.meta.schemaVersion!==current.meta?.schemaVersion
  return {dataset,added,changed}
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
