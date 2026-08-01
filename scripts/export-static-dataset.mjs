#!/usr/bin/env node
import { mkdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { config } from '../server/config.js'
import { closeDatabase, pool } from '../server/db.js'
import { latestDataset } from '../server/dataset-store.js'
import { validateAtlas } from '../src/data/validate.js'

const output=path.join(config.rootDir,'public','data','published-atlas.json')
const temporary=`${output}.tmp`
try{
  const latest=await latestDataset(pool)
  if(!latest)throw new Error('MariaDB has no dataset revision to publish.')
  const errors=validateAtlas(latest.dataset).filter(issue=>issue.severity==='error')
  if(errors.length)throw new Error(`MariaDB revision ${latest.revision} has ${errors.length} validation error(s).`)
  const payload={...latest.dataset,meta:{...latest.dataset.meta,staticPublication:{sourceRevision:latest.revision,contentSha256:latest.contentSha256,exportedAt:new Date().toISOString()}}}
  await mkdir(path.dirname(output),{recursive:true})
  await writeFile(temporary,`${JSON.stringify(payload,null,2)}\n`)
  await rename(temporary,output)
  console.log(`Exported MariaDB dataset revision ${latest.revision} to public/data/published-atlas.json.`)
}finally{
  await closeDatabase()
}
