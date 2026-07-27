import { createHash, randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { config } from '../server/config.js'
import { closeDatabase, pool, transaction } from '../server/db.js'
import { translationApprovalIssues } from '../server/review-policy.js'

const publisher=process.env.SNAPSHOT_PUBLISHER_ID
if(!publisher)throw new Error('SNAPSHOT_PUBLISHER_ID must identify the administrator publishing this release.')
const rows=await pool.query(`SELECT c.id,c.action,c.record_type,c.target_record_id,c.title,c.proposed_record_json,c.citations_json,c.decided_at,u.display_name,u.display_name_kn,u.verified_badge,r.language_code,r.review_scope,r.assessment_json,r.public_comment,ru.display_name reviewer_name,ru.display_name_kn reviewer_name_kn,ru.verified_badge reviewer_verified FROM contributions c JOIN users u ON u.id=c.contributor_id JOIN contribution_reviews r ON r.contribution_id=c.id AND r.decision='approve' JOIN users ru ON ru.id=r.reviewer_id WHERE c.status='approved' ORDER BY c.decided_at,c.id`)
const safe=value=>typeof value==='string'?JSON.parse(value):value
for(const row of rows){
  const issues=translationApprovalIssues({decision:'approve',contribution:{action:row.action,record:safe(row.proposed_record_json)},assessment:safe(row.assessment_json)||{}})
  if(issues.length)throw new Error(`Approved translation ${row.id} is not safe to publish: ${issues.join(' ')}`)
}
const payload={schemaVersion:'1.1.0',generatedAt:new Date().toISOString(),publicationPolicy:'reviewed-approved-only',contributions:rows.map(row=>({id:row.id,action:row.action,recordType:row.record_type,targetRecordId:row.target_record_id,title:row.title,record:safe(row.proposed_record_json),citations:safe(row.citations_json),approvedAt:row.decided_at,contributor:{name:row.display_name,nameKn:row.display_name_kn,verified:Boolean(row.verified_badge)},review:{scope:row.review_scope,languageCode:row.language_code,assessment:safe(row.assessment_json),publicComment:row.public_comment,reviewer:{name:row.reviewer_name,nameKn:row.reviewer_name_kn,verified:Boolean(row.reviewer_verified)}}}))}
const content=`${JSON.stringify(payload,null,2)}\n`,hash=createHash('sha256').update(content).digest('hex')
const output=path.join(config.rootDir,'public','data','approved-community.json')
await mkdir(path.dirname(output),{recursive:true});await writeFile(output,content,{mode:0o644})
await transaction(async db=>{let snapshotId=(await db.query('SELECT id FROM published_snapshots WHERE content_sha256=? LIMIT 1',[hash]))[0]?.id;if(!snapshotId){snapshotId=randomUUID();await db.query('INSERT INTO published_snapshots (id,schema_version,content_sha256,export_path,contribution_count,published_by) VALUES (?,?,?,?,?,?)',[snapshotId,payload.schemaVersion,hash,'public/data/approved-community.json',rows.length,publisher])}await db.query('UPDATE contributions SET approved_snapshot_id=COALESCE(approved_snapshot_id,?) WHERE status=\'approved\'',[snapshotId])})
console.log(`Exported ${rows.length} approved contributions (${hash.slice(0,12)}).`)
await closeDatabase()
