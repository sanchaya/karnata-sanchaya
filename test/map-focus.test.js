import test from 'node:test'
import assert from 'node:assert/strict'
import { mapViewForScope, mapZoomForPoint, mapZoomForPositions } from '../src/map-focus.js'

test('map focus uses a detailed zoom for Karnataka candidates', () => {
  assert.equal(mapZoomForPoint([12.97, 77.59]), 8.5)
  assert.equal(mapZoomForPoint([15.92, 75.68]), 8.5)
})

test('map focus uses bounded India and overseas zoom levels', () => {
  assert.equal(mapZoomForPoint([12.84, 79.7]), 5.5)
  assert.equal(mapZoomForPoint([31.23, 121.47]), 3.75)
  assert.equal(mapZoomForPositions([[12.97, 77.59], [12.84, 79.7]]), 5.5)
})

test('scope controls expose distinct Karnataka, India and world views', () => {
  assert.deepEqual(mapViewForScope('karnataka'), { center: [14.7, 76.2], zoom: 6.35 })
  assert.deepEqual(mapViewForScope('india'), { center: [20.2, 78.4], zoom: 4.35 })
  assert.deepEqual(mapViewForScope('world'), { center: [20, 35], zoom: 2.25 })
})
