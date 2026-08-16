import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { atlasData } from '../src/data/atlas.js'

const peopleExplorerSource = await readFile(new URL('../src/PeopleExplorer.jsx', import.meta.url), 'utf8')

const districts = atlasData.heritageAudits.filter(record => record.id !== 'audit-cross-border-kannada')
const districtIds = new Set(districts.map(record => record.id))
const sourceIds = new Set(atlasData.sources.map(source => source.id))
const fighters = atlasData.people.filter(person => person.roles?.includes('freedom-fighter'))

test('freedom-fighter research uses all current district IDs without orphan claims', () => {
  assert.equal(districts.length, 31)
  for (const person of fighters) {
    assert.ok(person.citations?.length, `${person.id} needs a person-level source`)
    for (const association of person.districtAssociations || []) {
      assert.ok(districtIds.has(association.districtId), `${person.id} has unknown district ${association.districtId}`)
      assert.ok(association.kind?.trim(), `${person.id}/${association.districtId} needs an association kind`)
      assert.ok(association.citations?.length, `${person.id}/${association.districtId} needs an item-level citation`)
      for (const citation of association.citations) assert.ok(sourceIds.has(citation.sourceId), `${person.id}/${association.districtId} has unknown source ${citation.sourceId}`)
    }
  }
})

test('the first statewide pass preserves its measured gaps instead of implying completion', () => {
  const covered = new Set(fighters.flatMap(person => (person.districtAssociations || []).map(item => item.districtId)))
  assert.ok(covered.size >= 28, 'at least 28 current districts should have a cited candidate after the first pass')
  assert.deepEqual(
    districts.filter(record => !covered.has(record.id)).map(record => record.district.en).sort(),
    ['Chamarajanagar', 'Chikkamagaluru', 'Kalaburagi'],
    'unresolved districts must remain an explicit research queue',
  )
  assert.equal(atlasData.people.find(person => person.id === 'person-ff-127')?.districtAssociations?.[0]?.districtId, 'audit-bengaluru-rural')
})

test('new district candidates retain government repository evidence and review gates', () => {
  for (const id of ['person-d-pampanna-neravi', 'person-raja-venkatappa-nayaka', 'person-t-siddalingaiah-shivapura', 'person-hb-lakshmegowda']) {
    const person = atlasData.people.find(record => record.id === id)
    assert.ok(person, `${id} must remain in the curated research set`)
    assert.equal(person.review.status, 'needs-review')
    assert.ok(person.districtAssociations.length)
    assert.ok(person.citations.every(citation => sourceIds.has(citation.sourceId)))
  }
})

test('Internet Archive discovery evidence remains review-gated and page-located', () => {
  const source = atlasData.sources.find(record => record.id === 'src-ia-mandya-freedom-unification-2017')
  const person = fighters.find(record => record.id === 'person-ff-84')
  assert.ok(source)
  assert.equal(source.review.status, 'needs-review')
  assert.equal(source.repository.identifier, 'kuh.818.kut.135112')
  const association = person?.districtAssociations?.find(item => item.districtId === 'audit-mandya')
  assert.ok(association)
  assert.match(association.citations[0].locator, /Printed p\. 42/)
  assert.match(association.citations[0].locator, /page-image check required/)
})

test('the public freedom-fighter view exposes people whose district evidence is missing', () => {
  const unassigned = fighters.filter(person => !(person.districtAssociations || []).length)
  assert.equal(unassigned.length, 75)
  assert.match(peopleExplorerSource, /districtEvidenceMissing:explicitDistricts\.length===0/)
  assert.match(peopleExplorerSource, /district==='district-needed'\?person\.districtEvidenceMissing/)
  assert.match(peopleExplorerSource, /className="people-gap-tag"/)
  assert.match(peopleExplorerSource, /districtNeeded:'ಜಿಲ್ಲೆ ಗುರುತಿಸಬೇಕಿದೆ'/)
})
