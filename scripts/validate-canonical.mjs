import { canonicalData } from '../src/data/canonical/ec-ei-canonical.generated.js'
import { validateCanonicalDataset } from '../src/data/canonical/pipeline.js'

const issues=validateCanonicalDataset(canonicalData),errors=issues.filter(issue=>issue.severity==='error')
for(const issue of issues)console.log(`${issue.severity.toUpperCase()} ${issue.collection}.${issue.id} ${issue.path}: ${issue.message}`)
console.log(`Canonical validation: ${errors.length} error(s), ${issues.length-errors.length} warning(s).`)
if(errors.length)process.exit(1)
