import { writeFileSync } from 'node:fs'
import { atlasData } from '../src/data/atlas.js'

const args = process.argv.slice(2)
const jsonMode = args.includes('--json')
const markdownIndex = args.indexOf('--markdown')
const markdownPath = markdownIndex >= 0 ? args[markdownIndex + 1] : null
const districtRecords = atlasData.heritageAudits
  .filter(record => record.id !== 'audit-cross-border-kannada')
  .sort((a, b) => a.district.en.localeCompare(b.district.en))
const districtIds = new Set(districtRecords.map(record => record.id))
const freedomFighters = atlasData.people.filter(person => person.roles?.includes('freedom-fighter'))

const rows = districtRecords.map(district => {
  const people = freedomFighters.filter(person => person.districtAssociations?.some(item => item.districtId === district.id))
  const reviewed = people.filter(person => ['reviewed', 'published'].includes(person.review?.status))
  const sourceIds = new Set(people.flatMap(person => [
    ...(person.citations || []).map(citation => citation.sourceId),
    ...(person.districtAssociations || [])
      .filter(item => item.districtId === district.id)
      .flatMap(item => (item.citations || []).map(citation => citation.sourceId)),
  ]))
  const coverageStatus = people.length === 0 ? 'empty' : people.length <= 2 ? 'thin' : 'seeded'
  return {
    districtId: district.id,
    district: district.district,
    captured: people.length,
    reviewed: reviewed.length,
    sources: sourceIds.size,
    coverageStatus,
  }
})

const linked = freedomFighters.filter(person => person.districtAssociations?.length)
const unlinked = freedomFighters.filter(person => !person.districtAssociations?.length)
const invalidAssociations = freedomFighters.flatMap(person => (person.districtAssociations || [])
  .filter(item => !districtIds.has(item.districtId))
  .map(item => ({ personId: person.id, districtId: item.districtId })))
const missingAssociationCitations = freedomFighters.flatMap(person => (person.districtAssociations || [])
  .filter(item => !(item.citations || []).length)
  .map(item => ({ personId: person.id, districtId: item.districtId })))

const summary = {
  generatedAt: new Date().toISOString(),
  districts: rows.length,
  districtsWithCandidates: rows.filter(row => row.captured > 0).length,
  emptyDistricts: rows.filter(row => row.coverageStatus === 'empty').map(row => row.district.en),
  thinDistricts: rows.filter(row => row.coverageStatus === 'thin').map(row => row.district.en),
  freedomFighters: freedomFighters.length,
  districtLinkedPeople: linked.length,
  unlinkedPeople: unlinked.length,
  linkedPercent: Number((linked.length / freedomFighters.length * 100).toFixed(1)),
  independentlyReviewedPeople: freedomFighters.filter(person => ['reviewed', 'published'].includes(person.review?.status)).length,
  invalidAssociations,
  missingAssociationCitations,
}

const payload = { summary, districts: rows }

const markdown = `# Karnataka freedom fighters — district coverage audit

## Executive Summary

- **${summary.districtsWithCandidates} of ${summary.districts} current Karnataka districts have at least one mapped freedom-fighter candidate.** The remaining districts are ${summary.emptyDistricts.join(', ') || 'none'}.
- **${summary.districtLinkedPeople} of ${summary.freedomFighters} people (${summary.linkedPercent}%) have an explicit district association.** ${summary.unlinkedPeople} records still need birthplace, activity, arrest, imprisonment, residence or memorial evidence.
- **No person record is independently reviewed yet.** Public records therefore remain visibly \`needs-review\`; a source-backed candidate count is not a completeness claim.
- **The audit is reproducible.** Run \`npm run audit:freedom-fighters\` after every import or MariaDB/static release update.

## District coverage

| District | Candidates | Reviewed | Sources | Status |
| --- | ---: | ---: | ---: | --- |
${rows.map(row => `| ${row.district.en} / ${row.district.kn} | ${row.captured} | ${row.reviewed} | ${row.sources} | ${row.coverageStatus} |`).join('\n')}

## Recommended next research waves

1. Resolve the empty districts first: ${summary.emptyDistricts.join(', ') || 'none'}.
2. Strengthen thin districts (one or two candidates): ${summary.thinDistricts.join(', ') || 'none'}.
3. Reconcile the ${summary.unlinkedPeople} existing people without a district association against district gazetteers, prison registers, pension/Tamra Patra files, court records and contemporary newspapers.
4. Independently review each Kannada name, person identity, association kind, date and item-level locator before promotion.

## First-wave authority evidence

- [D. Pampanna Neravi — Raichur](https://cmsadmin.amritmahotsav.nic.in/district-reopsitory-detail.htm?6697=), Ministry of Culture Digital District Repository.
- [Raja Venkatappa Nayaka — Yadgir](https://amritmahotsav.nic.in/district-reopsitory-detail.htm?6690=), Ministry of Culture Digital District Repository.
- [Shivapura Satyagraha — Mandya](https://amritmahotsav.nic.in/district-reopsitory-detail.htm?1921=), Ministry of Culture Digital District Repository.
- [H. B. Lakshmegowda — Mandya imprisonment evidence](https://cmsadmin.amritmahotsav.nic.in/district-reopsitory-detail.htm?22965=), Ministry of Culture Digital District Repository.

These official pages establish a credible intake basis; they do not replace independent checking of names, dates, archival locators and Kannada descriptions.

## Research rules

- Treat a person–district link as a separate claim. Use one of: \`birthplace\`, \`home\`, \`activity\`, \`arrest\`, \`imprisonment\`, \`martyrdom\`, \`residence\`, or \`memorial\` (combined values are allowed only when the source proves each part).
- Preserve historical place names in the citation locator, but map them to the current 31-district structure for browsing.
- Prefer official recognition files, jail/court records, government district repositories, Karnataka State Archives and district gazetteers. Academic histories can corroborate; news and Wikipedia remain discovery leads unless independently supported.
- Do not mark a district “complete” from a short list. Completion requires a documented search of government recognition rolls, district/taluk histories, archives, women’s participation, princely-state and Hyderabad-liberation records, and community nominations.

## Caveats and assumptions

Counts represent person–district associations, not unique biographies originating in each district. A person may legitimately appear in several districts. Current district boundaries differ from colonial and princely-state geographies. Source-level review status does not make every claim in a person record independently reviewed.
`

if (markdownPath) {
  writeFileSync(markdownPath, markdown)
  console.log(`Wrote ${markdownPath}`)
} else if (jsonMode) {
  console.log(JSON.stringify(payload, null, 2))
} else {
  console.log(`Freedom fighters: ${summary.freedomFighters}`)
  console.log(`District linked: ${summary.districtLinkedPeople} (${summary.linkedPercent}%)`)
  console.log(`Districts represented: ${summary.districtsWithCandidates}/${summary.districts}`)
  console.log(`Empty districts: ${summary.emptyDistricts.join(', ') || 'none'}`)
  console.table(rows.map(row => ({ district: row.district.en, candidates: row.captured, reviewed: row.reviewed, sources: row.sources, status: row.coverageStatus })))
  if (invalidAssociations.length || missingAssociationCitations.length) process.exitCode = 1
}
