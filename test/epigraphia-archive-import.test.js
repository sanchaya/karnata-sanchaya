import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'
import { epigraphiaArchiveSources, epigraphiaArchiveTexts } from '../src/data/epigraphia-archive.generated.js'

test('Epigraphia archive catalogue exposes item-level sources and Karnataka corpus families', () => {
  assert.equal(epigraphiaArchiveSources.length, epigraphiaArchiveTexts.length)
  assert.ok(epigraphiaArchiveTexts.length > 12)
  const sourceIds = new Set(atlasData.sources.map(record => record.id))
  for (const record of epigraphiaArchiveTexts) {
    assert.ok(sourceIds.has(record.citation.sourceId), `${record.id} must resolve its item source`)
    assert.match(record.itemUrl, /^https:\/\/archive\.org\/details\//)
    assert.equal(record.review.status, 'needs-review')
  }
  const series = new Set(epigraphiaArchiveTexts.map(record => record.series))
  assert.ok(series.has('Epigraphia Carnatica'))
  assert.ok(series.has('Epigraphia Indica'))
  assert.ok(series.has('Karnataka State and District Inscription Corpora'))
  assert.ok(epigraphiaArchiveTexts.some(record => record.locatorCandidates?.some(candidate => candidate.id === 'archive-hint-rashtrakuta-rulers')))
  assert.ok(epigraphiaArchiveTexts.some(record => record.locatorCandidates?.some(candidate => candidate.id === 'archive-hint-adil-shahi-rulers')))
  assert.ok(epigraphiaArchiveTexts.some(record => record.administrativeCoverage?.some(mention => mention.level === 'taluk')))
  assert.ok(epigraphiaArchiveTexts.some(record => record.administrativeCoverage?.some(mention => mention.level === 'village')))
  const administrativeMentions = epigraphiaArchiveTexts.flatMap(record => record.administrativeCoverage || [])
  assert.ok(administrativeMentions.every(mention => mention.normalizedName && mention.scope && mention.resolutionStatus && mention.certainty))
  assert.ok(administrativeMentions.some(mention => mention.scope === 'karnataka' && mention.resolutionStatus === 'normalized-candidate'))
  assert.ok(administrativeMentions.some(mention => mention.scope === 'outside-karnataka' && mention.resolutionStatus === 'outside-project-scope'))
  assert.ok(administrativeMentions.some(mention => mention.scope === 'ocr-noise' && mention.status === 'rejected'))
  assert.ok(administrativeMentions.filter(mention => mention.basis === 'catalogue-title').every(mention => !/^Inscriptions|^Epigraphia Carnatica|^Karnataka Shasanagalu/i.test(mention.name)))
})
