import { validateAtlas } from '../src/data/validate.js'
import { repositoryDataset } from '../server/dataset-store.js'

const dataset=repositoryDataset()
const issues = validateAtlas(dataset)
const errors = issues.filter(issue => issue.severity === 'error')
const warnings = issues.filter(issue => issue.severity === 'warning')

for (const issue of issues) {
  console.log(`${issue.severity.toUpperCase()} ${issue.collection}/${issue.id || '-'} ${issue.path}: ${issue.message}`)
}
console.log(`Validated schema ${dataset.meta.schemaVersion} with ${dataset.peopleCandidates.length} Wikimedia candidates, ${dataset.martyrCandidates.length} Dictionary of Martyrs candidates and ${dataset.naksheSites.length} private Nakshe site records: ${errors.length} errors, ${warnings.length} warnings.`)
if (errors.length) process.exitCode = 1
