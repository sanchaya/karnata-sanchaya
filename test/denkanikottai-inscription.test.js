import test from 'node:test'
import assert from 'node:assert/strict'
import { foreignInscriptions, foreignInscriptionPlaces } from '../src/data/foreign-inscriptions.js'
import { isPrimaryAtlasInscription } from '../src/timeline-record-visibility.js'

test('Denkanikottai Kannada inscription maps its inferred polity separately from source facts', () => {
  const record = foreignInscriptions.find(item => item.id === 'inscription-denkanikottai-kannada-land-grant')
  const place = foreignInscriptionPlaces.find(item => item.id === record.placeId)

  assert.deepEqual(place.location.coordinates, [77.79861, 12.51611])
  assert.equal(place.location.precision, 'approximate')
  assert.deepEqual(record.languages, ['Kannada'])
  assert.equal(record.polityId, 'polity-vijayanagara')
  assert.equal(record.polityAttribution.certainty, 'inferred')
  assert.equal(record.condition, 'incomplete')
  assert.equal(record.review.status, 'needs-review')
  assert.equal(isPrimaryAtlasInscription(record), true)
  assert.ok(record.citations.some(item => item.locator.includes('no. 214')))
})
