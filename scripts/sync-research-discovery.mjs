#!/usr/bin/env node
import { createHash, randomUUID } from 'node:crypto'
import { closeDatabase, transaction } from '../server/db.js'
import { indiaResearchIndex } from '../src/data/india-research.generated.js'

const syncToken=randomUUID()
const retrievedAtByProvider={
  BharatRajya:indiaResearchIndex.meta.bharatrajya.retrievedAt,
  'BharatRajya source catalogue':indiaResearchIndex.meta.bharatrajya.retrievedAt,
  WhatIsIndia:indiaResearchIndex.meta.whatisindia.retrievedAt,
}
const records=[...indiaResearchIndex.records,...indiaResearchIndex.sources,...indiaResearchIndex.failures]
const rows=records.map(record=>{
  const sourcePayload=JSON.stringify(record)
  return [record.id,record.provider,record.dataset,record.kind,record.scope||'india',record.title||record.id,record.url||null,createHash('sha256').update(sourcePayload).digest('hex'),sourcePayload,'needs-review','repository',syncToken,retrievedAtByProvider[record.provider]||null]
})
const batchSize=200

try{
  const result=await transaction(async db=>{
    for(let offset=0;offset<rows.length;offset+=batchSize){
      const batch=rows.slice(offset,offset+batchSize)
      const placeholders=batch.map(()=>'(?,?,?,?,?,?,?,?,?,?,?,?,?)').join(',')
      await db.query(`INSERT INTO research_discovery_records (record_id,provider,dataset_name,record_kind,scope_name,title,source_url,source_hash,source_payload_json,review_status,managed_by,sync_token,source_updated_at) VALUES ${placeholders} ON DUPLICATE KEY UPDATE provider=IF(managed_by='repository',VALUES(provider),provider),dataset_name=IF(managed_by='repository',VALUES(dataset_name),dataset_name),record_kind=IF(managed_by='repository',VALUES(record_kind),record_kind),scope_name=IF(managed_by='repository',VALUES(scope_name),scope_name),title=IF(managed_by='repository',VALUES(title),title),source_url=IF(managed_by='repository',VALUES(source_url),source_url),source_hash=IF(managed_by='repository',VALUES(source_hash),source_hash),source_payload_json=IF(managed_by='repository',VALUES(source_payload_json),source_payload_json),sync_token=IF(managed_by='repository',VALUES(sync_token),sync_token),source_updated_at=IF(managed_by='repository',VALUES(source_updated_at),source_updated_at)`,batch.flat())
    }
    const removed=await db.query("DELETE FROM research_discovery_records WHERE managed_by='repository' AND (sync_token IS NULL OR sync_token<>?)",[syncToken])
    await db.query('INSERT INTO audit_log (id,actor_user_id,action,entity_type,entity_id,metadata_json) VALUES (?,NULL,?,?,?,?)',[randomUUID(),'research-discovery.synchronized','research-discovery',syncToken,JSON.stringify({records:rows.length,removed:Number(removed.affectedRows||0),sources:indiaResearchIndex.sources.length,failures:indiaResearchIndex.failures.length})])
    return {records:rows.length,removed:Number(removed.affectedRows||0)}
  })
  console.log(`Synchronized ${result.records.toLocaleString('en-IN')} permanent discovery records; removed ${result.removed} stale repository record(s).`)
}finally{
  await closeDatabase()
}
