import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { mergeRepositorySeed, repositoryDataset } from '../server/dataset-store.js'

const root=new URL('../',import.meta.url)
const source=async path=>readFile(new URL(path,root),'utf8')

test('the complete installation seed includes all Wikimedia review candidates',()=>{
  const dataset=repositoryDataset()
  assert.equal(dataset.peopleCandidates.length,905)
  assert.equal(dataset.peopleCandidateMeta.candidateCount,905)
})

test('server-side seed synchronization preserves existing MariaDB records',()=>{
  const dataset=repositoryDataset()
  dataset.people[0].name.en='MariaDB edit'
  dataset.peopleCandidates=[]
  const merged=mergeRepositorySeed(dataset)
  assert.equal(merged.dataset.people[0].name.en,'MariaDB edit')
  assert.equal(merged.dataset.peopleCandidates.length,905)
})

test('live application hydrates before App evaluates and public API reads MariaDB',async()=>{
  const [main,runtime,server]=await Promise.all([source('src/main.jsx'),source('src/data/runtime.js'),source('server/app.js')])
  assert.match(main,/await hydrateAtlasData\(\)[\s\S]*await import\('\.\/App'\)/)
  assert.match(runtime,/fetch\(`\$\{API_BASE\}\/api\/dataset`/)
  assert.match(server,/app\.get\('\/api\/dataset'[\s\S]*latestDataset\(pool\)/)
})

test('research records and assignments have no browser persistence path',async()=>{
  const [admin,evidence,people]=await Promise.all([source('src/Admin.jsx'),source('src/EvidenceWorkflow.jsx'),source('src/PeopleExplorer.jsx')])
  for(const [name,value] of Object.entries({admin,evidence,people})){
    assert.doesNotMatch(value,/localStorage\.|sessionStorage\.|indexedDB\s*\(/,`${name} must not persist research data in the browser`)
  }
  assert.match(people,/atlasData\.peopleCandidates/)
  assert.doesNotMatch(people,/wikimedia-people-candidates\.json/)
})

test('live install and update scripts synchronize the MariaDB dataset',async()=>{
  const [install,update]=await Promise.all([source('scripts/install-linux-nginx.sh'),source('scripts/update-live.sh')])
  assert.match(install,/run db:sync-dataset/)
  assert.match(update,/run db:sync-dataset/)
})
