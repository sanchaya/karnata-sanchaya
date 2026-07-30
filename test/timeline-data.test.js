import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'
import { inscriptionsForMap } from '../src/map-record-visibility.js'
import { eventsForPrimaryAtlas, inscriptionsForPrimaryAtlas } from '../src/timeline-record-visibility.js'

test('every historical event has the fields required by the timeline and map detail', () => {
  for (const event of atlasData.events) {
    assert.ok(event.id, 'event ID is required')
    assert.ok(event.name?.en && event.name?.kn, `${event.id} needs bilingual name`)
    assert.ok(event.date && Number.isFinite(event.date.from), `${event.id} needs a dated timeline position`)
    assert.equal(event.location?.type, 'Point', `${event.id} needs a point location`)
    assert.equal(event.location?.coordinates?.length, 2, `${event.id} needs map coordinates`)
    assert.ok(Array.isArray(event.participants), `${event.id} needs participant data`)
    assert.ok(Array.isArray(event.citations), `${event.id} needs citation data`)
    assert.ok(event.summary?.en && event.summary?.kn, `${event.id} needs bilingual summary text`)
  }
})

test('Vatapi capture and restoration remain local timeline map events', () => {
  const capture = atlasData.events.find(event => event.id === 'event-vatapi-captured')
  const restoration = atlasData.events.find(event => event.id === 'event-vatapi-sovereignty-restored')
  assert.deepEqual(capture.location.coordinates, [75.68, 15.92])
  assert.deepEqual(restoration.location.coordinates, [75.68, 15.92])
  assert.equal(capture.route, null)
  assert.equal(restoration.route, null)
})

test('literary timeline cards tolerate works without external links', () => {
  const work = atlasData.works.find(item => item.id === 'work-gajasastra')
  assert.ok(work)
  assert.equal(work.externalLinks, undefined)
})

test('Karnataka naming is represented as a dated modern state milestone', () => {
  const naming = atlasData.events.find(event => event.id === 'event-karnataka-name-adopted')
  assert.ok(naming)
  assert.equal(naming.date.from, 1973)
  assert.equal(naming.type, 'state-reorganisation')
  assert.ok(naming.citations.some(citation => citation.sourceId === 'src-mysore-state-alteration-name-act-1973'))
})

test('Chola administration in Karnataka has a dated relation and territorial record', () => {
  const relation=atlasData.politicalRelations.find(item=>item.id==='political-relation-chola-gangavadi-administration')
  const extent=atlasData.territorialExtents.find(item=>item.id==='extent-chola-gangavadi-control-1004-1116')
  assert.deepEqual([relation.date.from,relation.date.to],[1004,1116])
  assert.ok(relation.parties.some(party=>party.polityId==='external-polity-chola'))
  assert.equal(extent.geometry.type,'Polygon')
})

test('external governance phases distinguish administration from foreign relations', () => {
  assert.ok(atlasData.externalGovernancePhases.length >= 9)
  const ids=new Set(atlasData.externalGovernancePhases.map(record=>record.id))
  assert.ok(ids.has('external-governance-chola-gangavadi'))
  assert.ok(ids.has('external-governance-bahmani-northern-karnataka'))
  assert.ok(ids.has('external-governance-adil-shahi-bijapur'))
  assert.ok(ids.has('external-governance-mughal-bijapur-province'))
  assert.ok(ids.has('external-governance-hyderabad-kalyana-karnataka'))
  assert.ok(ids.has('external-governance-british-mysore-commission'))
  assert.ok(atlasData.externalGovernancePhases.every(record=>record.review.status==='needs-review'))
  assert.ok(atlasData.externalGovernancePhases.every(record=>record.citations.length>0))
  assert.ok(!atlasData.externalGovernancePhases.some(record=>record.governingPolityId==='external-polity-kingdom-france'))
  assert.ok(!atlasData.externalGovernancePhases.some(record=>record.governingPolityId==='external-polity-portuguese-india'))
})

test('public inscription map visibility does not depend on review approval', () => {
  const pending = { id: 'pending', year: 450, polityId: 'polity-kadamba', review: { status: 'needs-review' } }
  const visible = inscriptionsForMap([pending], { year: 1973, showAll: true })
  assert.deepEqual(visible, [pending])
  assert.deepEqual(inscriptionsForMap([pending], { year: 1973, showAll: false, activePolityIds: new Set() }), [])
  const publicRecords = inscriptionsForMap(atlasData.inscriptions, { year: 1973, showAll: true })
  assert.equal(publicRecords.length, atlasData.inscriptions.length)
  assert.ok(publicRecords.some(record => record.review?.status === 'needs-review'))
})

test('primary atlas excludes unrelated external inscriptions without deleting them from research data', () => {
  const primary = inscriptionsForPrimaryAtlas(atlasData.inscriptions)
  const external = atlasData.inscriptions.filter(record => record.geographicScope?.outsideKarnataka === true)
  const unrelatedExternal = external.filter(record => !(record.languages || []).some(language => /kannada/i.test(language)) && record.karnatakaRelevance !== true && record.karnatakaRelevance?.direct !== true)
  assert.ok(external.length > 0, 'specialist research corpus should retain external inscriptions')
  assert.ok(unrelatedExternal.every(record => !primary.includes(record)), 'unrelated external records must not enter the Karnataka timeline')
  assert.ok(primary.some(record => record.id === 'inscription-halmidi'))
})

test('primary atlas event timeline requires a Karnataka polity or explicit Karnataka context', () => {
  const primaryPolities = new Set(atlasData.polities.map(polity => polity.id))
  const primary = eventsForPrimaryAtlas(atlasData.events, primaryPolities)
  assert.ok(primary.some(record => record.id === 'event-bahmani-foundation'))
  assert.ok(primary.some(record => record.id === 'event-independence'))
  assert.ok(!primary.some(record => record.id === 'event-madurai-thanjavur-invasion-lead'))
})
