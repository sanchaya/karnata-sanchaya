#!/usr/bin/env node
// Writes approved Kannada species names from MariaDB into src/data/species/kn-names-reviewed.json, so the static
// GitHub Pages edition shows them too. Run on the live server (or with its .env), review the diff, commit, deploy.
// Names already in the file that are not in the database are kept (they may have been added by hand).
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { closeDatabase, pool } from '../server/db.js'
import { speciesCommunity } from '../server/species-community.js'

const file=path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),'src/data/species/kn-names-reviewed.json')
try{
  const rows=await pool.query(`SELECT c.target_record_id,c.proposed_record_json,c.decided_at,u.id user_id,u.display_name,u.display_name_kn FROM contributions c JOIN users u ON u.id=c.contributor_id WHERE c.record_type='species' AND c.status='approved' AND u.account_status='approved' ORDER BY c.decided_at ASC`)
  const current=JSON.parse(await readFile(file,'utf8'))
  let added=0,changed=0
  for(const name of speciesCommunity(rows).names){
    const before=current[name.gbifKey]
    if(!before)added++;else if(before.kn!==name.kn)changed++
    current[name.gbifKey]={kn:name.kn,note:`Reader suggestion approved by a reviewer; suggested by ${name.by}`}
  }
  await writeFile(file,JSON.stringify(current,null,1)+'\n')
  console.log(`Species names: ${added} added, ${changed} changed, ${Object.keys(current).length} in total.`)
}finally{await closeDatabase()}
