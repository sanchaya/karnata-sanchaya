import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'
import { inscriptionsForMap } from '../src/map-record-visibility.js'

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

test('public inscription map visibility does not depend on review approval', () => {
  const pending = { id: 'pending', year: 450, polityId: 'polity-kadamba', review: { status: 'needs-review' } }
  const visible = inscriptionsForMap([pending], { year: 1973, showAll: true })
  assert.deepEqual(visible, [pending])
  assert.deepEqual(inscriptionsForMap([pending], { year: 1973, showAll: false, activePolityIds: new Set() }), [])
  const publicRecords = inscriptionsForMap(atlasData.inscriptions, { year: 1973, showAll: true })
  assert.equal(publicRecords.length, atlasData.inscriptions.length)
  assert.ok(publicRecords.some(record => record.review?.status === 'needs-review'))
})
