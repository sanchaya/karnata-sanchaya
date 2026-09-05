import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { atlasData, collectionLabels } from '../src/data/atlas.js'
import { publicDataset, repositoryDataset } from '../server/dataset-store.js'

const root=path.resolve(import.meta.dirname,'..')

test('private Nakshe importer creates team-verified records without publishing its payload',t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-nakshe-'))
  t.after(()=>fs.rmSync(directory,{recursive:true,force:true}))
  const input=path.join(directory,'sites.csv')
  const output=path.join(directory,'sites.json')
  fs.writeFileSync(input,[
    'id,name_en,name_kn,type,category,latitude,longitude,village,district,taluk,conservation_status,status,period_from_century,period_to_century,undated,period_raw,reference',
    'prov-demo,Demo stone,ಮಾದರಿ ಕಲ್ಲು,Inscription,sites,12.97,77.59,Bengaluru,Bengaluru (Urban),Bengaluru,Original,Live/Intact,10,10,,,{}',
  ].join('\n'))
  const result=spawnSync(process.execPath,['scripts/import-nakshe-sites.mjs',input,output],{cwd:root,encoding:'utf8'})
  assert.equal(result.status,0,result.stderr)
  const payload=JSON.parse(fs.readFileSync(output,'utf8'))
  assert.equal(payload.meta.recordCount,1)
  assert.equal(payload.records[0].id,'nakshe-site-demo')
  assert.equal(payload.records[0].review.status,'published')
  assert.equal(payload.records[0].review.reviewer,'Inscription Stones Of Bengaluru')
  assert.equal(payload.records[0].verification.status,'verified-by-source-team')
})

test('Nakshe records are an optional MariaDB/Admin collection and absent from public UI code',()=>{
  const privateDataset=repositoryDataset()
  assert.ok(Array.isArray(privateDataset.naksheSites))
  assert.deepEqual(publicDataset({...privateDataset,naksheSites:[{id:'nakshe-site-secret'}]}).naksheSites,[])
  assert.equal(atlasData.naksheSites.length,0)
  assert.equal(collectionLabels.naksheSites,'Private Nakshe site records')
  const source=atlasData.sources.find(item=>item.id==='src-nakshe-inscription-stones-bengaluru')
  assert.equal(source.review.status,'reviewed')
  const explorer=fs.readFileSync(path.join(root,'src/LiteratureEpigraphyExplorer.jsx'),'utf8')
  assert.doesNotMatch(explorer,/nakshe-sites\.generated|Nakshe site survey|naksheSites/)
})

test('static Admin is disabled and private source paths are ignored',()=>{
  const app=fs.readFileSync(path.join(root,'src/App.jsx'),'utf8')
  const ignore=fs.readFileSync(path.join(root,'.gitignore'),'utf8')
  assert.match(app,/VITE_STATIC_DATASET==='true'/)
  assert.match(app,/roles\?\.includes\('administrator'\)/)
  assert.match(ignore,/nakshe-mythicsociety-sites\.csv/)
  assert.match(ignore,/private-seeds/)
})
