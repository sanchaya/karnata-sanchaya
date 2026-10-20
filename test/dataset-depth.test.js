import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateDatasetDepth } from '../src/data/dataset-depth.js'

test('portal depth combines canonical records and discovery corpora without double-labeling revision rows', () => {
  const dataset={
    polities:[{}], relationships:[{}], sources:[{},{}],
    templeInventoryLeads:[{}], heritageInventoryLeads:[{}],
    inscriptionAudits:[{priorityCandidates:[{},{}]}], heritageAudits:[{prioritySites:[{}]}],
    peopleCandidateMeta:{candidateCount:3}, martyrCandidateMeta:{candidateCount:4},
  }
  assert.deepEqual(calculateDatasetDepth(dataset,{recordCount:5,failureCount:2,sourceCount:3}),{
    totalRecords:21, researchLeads:19, sources:5, relationships:1,
  })
})
