#!/usr/bin/env node
import { closeDatabase, transaction } from '../server/db.js'
import { insertDatasetRevision, latestDataset, mergeRepositorySeed, refreshResearchIndexes } from '../server/dataset-store.js'
import { validateAtlas } from '../src/data/validate.js'
import { randomUUID } from 'node:crypto'

try{
  const result=await transaction(async db=>{
    const latest=await latestDataset(db,{lock:true})
    const merged=mergeRepositorySeed(latest?.dataset||null)
    if(!merged.changed){
      const indexes=await refreshResearchIndexes(db,latest.dataset)
      return {changed:false,revision:latest.revision,added:0,updated:0,indexes}
    }
    const errors=validateAtlas(merged.dataset).filter(issue=>issue.severity==='error')
    if(errors.length)throw new Error(`Repository dataset seed has ${errors.length} validation error(s): ${errors.slice(0,5).map(issue=>`${issue.collection}.${issue.id}: ${issue.message}`).join(' · ')}`)
    const saved=await insertDatasetRevision(db,merged.dataset,{revision:(latest?.revision||0)+1})
    const indexes=await refreshResearchIndexes(db,merged.dataset)
    await db.query('INSERT INTO audit_log (id,actor_user_id,action,entity_type,entity_id,metadata_json) VALUES (?,NULL,?,?,?,?)',[randomUUID(),'dataset.seed-synchronized','dataset',saved.id,JSON.stringify({revision:saved.revision,contentSha256:saved.contentSha256,added:merged.added,updated:merged.updated})])
    return {changed:true,revision:saved.revision,added:merged.added,updated:merged.updated,indexes}
  })
  const indexSummary=`Refreshed ${result.indexes.records} research index records, ${result.indexes.links} links and ${result.indexes.gates} evidence gates.`
  console.log(result.changed?`Created MariaDB dataset revision ${result.revision}; added ${result.added} and enriched ${result.updated} repository seed records. ${indexSummary}`:`MariaDB dataset revision ${result.revision} already contains the repository seed. ${indexSummary}`)
}catch(error){
  if(error.code==='ECONNRESET'||error.errno===1153){
    console.error(`db:sync-dataset failed writing the dataset to MariaDB (${error.code||error.errno}).`)
    console.error(`This almost always means the server's max_allowed_packet is smaller than the ~10MB dataset payload.`)
    console.error(`Check it with: mysql -u root -p -e "SHOW VARIABLES LIKE 'max_allowed_packet';"`)
    console.error(`See "Setting max_allowed_packet" in docs/live-deployment.md for how to raise it, then re-run: npm run db:sync-dataset`)
    process.exitCode=1
  } else {
    throw error
  }
}finally{
  await closeDatabase()
}
