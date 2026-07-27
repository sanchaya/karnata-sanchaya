import { atlasData } from '../src/data/atlas.js'
import { validateAtlas } from '../src/data/validate.js'

const issues = validateAtlas(atlasData)
const errors = issues.filter(issue => issue.severity === 'error')
const warnings = issues.filter(issue => issue.severity === 'warning')

for (const issue of issues) {
  console.log(`${issue.severity.toUpperCase()} ${issue.collection}/${issue.id || '-'} ${issue.path}: ${issue.message}`)
}
console.log(`Validated schema ${atlasData.meta.schemaVersion}: ${errors.length} errors, ${warnings.length} warnings.`)
if (errors.length) process.exitCode = 1

