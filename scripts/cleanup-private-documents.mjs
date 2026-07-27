import path from 'node:path'
import { unlink } from 'node:fs/promises'
import { config } from '../server/config.js'
import { closeDatabase, pool } from '../server/db.js'

const rows=await pool.query("SELECT id,document_storage_key FROM verification_requests WHERE delete_after IS NOT NULL AND delete_after<=UTC_TIMESTAMP(3) AND document_storage_key<>''")
for(const row of rows){await unlink(path.join(config.uploadDir,row.document_storage_key)).catch(error=>{if(error.code!=='ENOENT')throw error});await pool.query("UPDATE verification_requests SET document_storage_key='',document_sha256='' WHERE id=?",[row.id])}
console.log(`Removed ${rows.length} expired private verification document(s).`)
await closeDatabase()
