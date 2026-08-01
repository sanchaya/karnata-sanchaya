import { atlasData } from '../src/data/atlas.js'
import { validateAtlas } from '../src/data/validate.js'
import peopleCandidateCorpus from '../server/seeds/wikimedia-people-candidates.json' with { type:'json' }

const dataset={...atlasData,peopleCandidateMeta:peopleCandidateCorpus.meta,peopleCandidates:peopleCandidateCorpus.records}
const issues = validateAtlas(dataset)
const errors = issues.filter(issue => issue.severity === 'error')
const warnings = issues.filter(issue => issue.severity === 'warning')

for (const issue of issues) {
  console.log(`${issue.severity.toUpperCase()} ${issue.collection}/${issue.id || '-'} ${issue.path}: ${issue.message}`)
}
console.log(`Validated schema ${atlasData.meta.schemaVersion} with ${peopleCandidateCorpus.records.length} people candidates: ${errors.length} errors, ${warnings.length} warnings.`)
if (errors.length) process.exitCode = 1
