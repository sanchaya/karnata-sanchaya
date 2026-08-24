import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { mergeRepositorySeed, normalizeDatasetCollections, repositoryDataset } from '../server/dataset-store.js'

const root=new URL('../',import.meta.url)
const source=async path=>readFile(new URL(path,root),'utf8')

test('the complete installation seed includes all Wikimedia review candidates',()=>{
  const dataset=repositoryDataset()
  assert.equal(dataset.peopleCandidates.length,905)
  assert.equal(dataset.peopleCandidateMeta.candidateCount,905)
  assert.equal(dataset.martyrCandidates.length,269)
  assert.equal(dataset.martyrCandidateMeta.candidateCount,269)
})

test('server-side seed synchronization preserves existing MariaDB records',()=>{
  const dataset=repositoryDataset()
  dataset.people[0].name.en='MariaDB edit'
  dataset.peopleCandidates=[]
  dataset.martyrCandidates=[]
  const merged=mergeRepositorySeed(dataset)
  assert.equal(merged.dataset.people[0].name.en,'MariaDB edit')
  assert.equal(merged.dataset.peopleCandidates.length,905)
  assert.equal(merged.dataset.martyrCandidates.length,269)
})

test('legacy MariaDB snapshots receive every current collection as an array',()=>{
  const legacy={meta:{schemaVersion:'0.20.0'},sources:{one:{id:'src-legacy'}},politicalRelations:null}
  const normalized=normalizeDatasetCollections(legacy)
  assert.ok(Array.isArray(normalized.externalGovernancePhases))
  assert.ok(Array.isArray(normalized.templeInventoryLeads))
  assert.ok(Array.isArray(normalized.heritageInventoryLeads))
  assert.ok(Array.isArray(normalized.districtHistoryResearch))
  assert.ok(Array.isArray(normalized.politicalRelations))
  assert.ok(Array.isArray(normalized.martyrCandidates))
  assert.deepEqual(normalized.sources,[{id:'src-legacy'}])
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
  assert.match(people,/atlasData\.martyrCandidates/)
  assert.doesNotMatch(people,/wikimedia-people-candidates\.json/)
  assert.match(admin,/sourceReviewTitle:'Reference review register'/)
  assert.match(admin,/collection==='sources'\?t\.newSource:t\.new/)
  assert.match(admin,/Save MariaDB revision/)
})

test('evidence assignments retain reviewer metadata and status history in MariaDB',async()=>{
  const [server,migration]=await Promise.all([source('server/app.js'),source('server/migrations/008_evidence_review_maturity.sql')])
  assert.match(migration,/ADD COLUMN reviewer VARCHAR\(255\)/)
  assert.match(migration,/CREATE TABLE IF NOT EXISTS evidence_assignment_history/)
  assert.match(migration,/FOREIGN KEY \(task_id\) REFERENCES evidence_assignments\(task_id\)/)
  assert.match(server,/SELECT task_id,status,assignee,reviewer,due_date,review_note/)
  assert.match(server,/INSERT INTO evidence_assignment_history/)
  assert.match(server,/A named independent reviewer is required/)
  assert.match(server,/The assignee and independent reviewer must be different/)
})

test('live install and update scripts synchronize the MariaDB dataset',async()=>{
  const [install,update]=await Promise.all([source('scripts/install-linux-nginx.sh'),source('scripts/update-live.sh')])
  assert.match(install,/run db:sync-dataset/)
  assert.match(update,/run db:sync-dataset/)
})
