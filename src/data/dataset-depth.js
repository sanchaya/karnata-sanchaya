import { indiaResearchMeta } from './india-research-meta.generated.js'

export const datasetDepthCollections = ['polities','externalPolities','places','events','people','works','inscriptions','culturalHeritage','periodicals','periodicalMapSites','artifacts','reigns','territorialExtents','politicalRelations','relationships','externalGovernancePhases','districtHistoryResearch','feudatoryRelations','genealogicalRelations','administrativeDivisions','boundaryEvidence','coinRecords','manuscriptWitnesses','inscriptionEditions','scriptEvolution','collaborations']

const length = value => Array.isArray(value) ? value.length : 0

export function calculateDatasetDepth(dataset, discoveryMeta = indiaResearchMeta) {
  const historicalRecords=datasetDepthCollections.reduce((total,key)=>total+length(dataset[key]),0)
  const inscriptionLeads=(dataset.inscriptionAudits||[]).reduce((total,audit)=>total+length(audit.priorityCandidates),0)
  const heritageSites=(dataset.heritageAudits||[]).reduce((total,audit)=>total+length(audit.prioritySites),0)
  const researchLeads=length(dataset.templeInventoryLeads)+length(dataset.heritageInventoryLeads)+inscriptionLeads+heritageSites+(dataset.peopleCandidateMeta?.candidateCount||length(dataset.peopleCandidates))+(dataset.martyrCandidateMeta?.candidateCount||length(dataset.martyrCandidates))+(discoveryMeta.recordCount||0)+(discoveryMeta.failureCount||0)
  const relationships=length(dataset.relationships)+length(dataset.politicalRelations)+length(dataset.feudatoryRelations)+length(dataset.genealogicalRelations)
  return {totalRecords:historicalRecords+researchLeads,researchLeads,sources:length(dataset.sources)+(discoveryMeta.sourceCount||0),relationships}
}
