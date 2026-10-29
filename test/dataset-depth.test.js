import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateDatasetDepth } from '../src/data/dataset-depth.js'

test('portal depth combines canonical records and discovery corpora without double-labeling revision rows', () => {
  const dataset={
    polities:[{}], relationships:[{}], sources:[{},{}],
    inscriptions:[{languages:['Kannada']},{languages:['Tamil'],karnatakaRelevance:{direct:true}},{languages:['Tamil'],karnatakaRelevance:{direct:false}}],
    templeInventoryLeads:[{}], heritageInventoryLeads:[{}],
    epigraphiaArchiveTexts:[{id:'archive-1',locatorCandidates:[{targetRecordIds:['person-1','polity-1']},{targetRecordIds:['person-1']}]}],
    inscriptionAudits:[{priorityCandidates:[{},{}]}], heritageAudits:[{prioritySites:[{}]}],
    peopleCandidateMeta:{candidateCount:3}, martyrCandidateMeta:{candidateCount:4},
  }
  assert.deepEqual(calculateDatasetDepth(dataset,{recordCount:5,failureCount:2,sourceCount:3}),{
    totalRecords:25, researchLeads:20, sources:5, relationships:3, inscriptions:3, karnatakaLinkedNonKannadaInscriptions:1,
  })
})
