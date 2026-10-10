import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { indiaResearchIndex } from '../src/data/india-research.generated.js'

test('hidden India research index retains both complete discovery imports',()=>{
  assert.equal(indiaResearchIndex.meta.bharatrajya.counts.kingdoms,461)
  assert.equal(indiaResearchIndex.meta.bharatrajya.counts.territories,17755)
  assert.equal(indiaResearchIndex.meta.whatisindia.pagesCrawled,9939)
  assert.equal(indiaResearchIndex.meta.whatisindia.records,9283)
  assert.equal(indiaResearchIndex.records.filter(record=>record.dataset==='inscriptions').length,9283)
  assert.ok(indiaResearchIndex.records.some(record=>record.kind==='kingdom'))
  assert.ok(indiaResearchIndex.records.some(record=>record.kind==='territory'))
  assert.ok(indiaResearchIndex.records.some(record=>record.kind==='ruler'))
  assert.ok(indiaResearchIndex.records.some(record=>record.kind==='monument'))
})

test('BharatRajya discoveries remain review candidates rather than citations',()=>{
  const records=indiaResearchIndex.records.filter(record=>record.provider==='BharatRajya')
  assert.ok(records.length>0)
  assert.ok(records.every(record=>record.reviewStatus==='needs-review'))
  assert.match(indiaResearchIndex.meta.policy,/not treated as a scholarly citation/)
})

test('India research route is direct-only and absent from navigation',()=>{
  const app=fs.readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8')
  assert.match(app,/publicViews=\[[^\]]*'india-research'/)
  assert.match(app,/view==='india-research'/)
  assert.doesNotMatch(app,/primaryNavItems=\[[^\]]*india-research/)
  assert.doesNotMatch(app,/utilityNavItems=\[[^\]]*india-research/)
})
