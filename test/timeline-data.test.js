import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'

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
