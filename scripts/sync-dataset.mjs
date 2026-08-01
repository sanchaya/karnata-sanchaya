#!/usr/bin/env node
import { closeDatabase, transaction } from '../server/db.js'
import { insertDatasetRevision, latestDataset, mergeRepositorySeed } from '../server/dataset-store.js'
import { validateAtlas } from '../src/data/validate.js'
import { randomUUID } from 'node:crypto'

try{
  const result=await transaction(async db=>{
    const latest=await latestDataset(db,{lock:true})
    const merged=mergeRepositorySeed(latest?.dataset||null)
    if(!merged.changed)return {changed:false,revision:latest.revision,added:0}
    const errors=validateAtlas(merged.dataset).filter(issue=>issue.severity==='error')
    if(errors.length)throw new Error(`Repository dataset seed has ${errors.length} validation error(s): ${errors.slice(0,5).map(issue=>`${issue.collection}.${issue.id}: ${issue.message}`).join(' · ')}`)
    const saved=await insertDatasetRevision(db,merged.dataset,{revision:(latest?.revision||0)+1})
    await db.query('INSERT INTO audit_log (id,actor_user_id,action,entity_type,entity_id,metadata_json) VALUES (?,NULL,?,?,?,?)',[randomUUID(),'dataset.seed-synchronized','dataset',saved.id,JSON.stringify({revision:saved.revision,contentSha256:saved.contentSha256,added:merged.added})])
    return {changed:true,revision:saved.revision,added:merged.added}
  })
  console.log(result.changed?`Created MariaDB dataset revision ${result.revision}; added ${result.added} repository seed records.`:`MariaDB dataset revision ${result.revision} already contains the repository seed.`)
}finally{
  await closeDatabase()
}
