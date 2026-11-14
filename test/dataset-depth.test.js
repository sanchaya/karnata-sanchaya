import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateDatasetDepth } from '../src/data/dataset-depth.js'
import { languageRegions, languageRegionSourceCount } from '../src/data/language-regions.js'
import speciesMeta from '../src/data/species/species-meta.json' with { type: 'json' }
import { geographyWaterFeatures, geographyWaterSources } from '../src/data/geography-waters.js'
import { geographyLandforms, geographyLandformSources } from '../src/data/geography-landforms.js'
import { geographyNatureHighlights, geographyNatureSources, geographyProtectedAreas } from '../src/data/geography-nature.js'

test('portal depth combines canonical records and discovery corpora without double-labeling revision rows', () => {
  const dataset={
    polities:[{}], relationships:[{}], sources:[{},{}],
    inscriptions:[{languages:['Kannada']},{languages:['Tamil'],karnatakaRelevance:{direct:true}},{languages:['Tamil'],karnatakaRelevance:{direct:false}}],
    templeInventoryLeads:[{}], heritageInventoryLeads:[{}],
    epigraphiaArchiveTexts:[{id:'archive-1',locatorCandidates:[{targetRecordIds:['person-1','polity-1']},{targetRecordIds:['person-1']}]}],
    inscriptionAudits:[{priorityCandidates:[{},{}]}], heritageAudits:[{prioritySites:[{}]}],
    peopleCandidateMeta:{candidateCount:3}, martyrCandidateMeta:{candidateCount:4},
  }
  const geographyRecords=geographyNatureHighlights.length+geographyProtectedAreas.length+geographyWaterFeatures.length+geographyLandforms.length+speciesMeta.speciesCount
  assert.deepEqual(calculateDatasetDepth(dataset,{recordCount:5,failureCount:2,sourceCount:3}),{
    totalRecords:25+geographyRecords+languageRegions.length, researchLeads:20, geographyRecords, languageRegions:languageRegions.length, sources:5+geographyNatureSources.length+geographyWaterSources.length+geographyLandformSources.length+speciesMeta.sourceCount+languageRegionSourceCount, relationships:3, inscriptions:3, karnatakaLinkedNonKannadaInscriptions:1,
  })
})
