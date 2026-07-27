import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { config } from './config.js'
import { closeDatabase, pool } from './db.js'

const migrationDir=path.join(config.rootDir,'server','migrations')
await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(80) PRIMARY KEY, applied_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci')
const applied=new Set((await pool.query('SELECT version FROM schema_migrations')).map(row=>row.version))
for(const file of (await readdir(migrationDir)).filter(name=>name.endsWith('.sql')).sort()){
  if(applied.has(file))continue
  const sql=await readFile(path.join(migrationDir,file),'utf8')
  const connection=await pool.getConnection()
  try{await connection.beginTransaction();for(const statement of sql.split(/;\s*(?:\r?\n|$)/).map(value=>value.trim()).filter(Boolean))await connection.query(statement);await connection.query('INSERT INTO schema_migrations (version) VALUES (?)',[file]);await connection.commit();console.log(`Applied ${file}`)}
  catch(error){await connection.rollback();throw error}
  finally{connection.release()}
}
await closeDatabase()

