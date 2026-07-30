import test from 'node:test'
import assert from 'node:assert/strict'
import { readAtlasUrlState, updateAtlasUrlState } from '../src/share-state.js'

test('atlas share state reads a year and map position from query parameters', () => {
  assert.deepEqual(readAtlasUrlState('?year=1117&lat=13.165&lng=75.86&zoom=10.5'), {
    year: 1117,
    map: { lat: 13.165, lng: 75.86, zoom: 10.5 },
  })
})

test('missing share parameters do not invent year one or a map position', () => {
  assert.deepEqual(readAtlasUrlState(''), { year: null, map: null })
})

test('atlas share state normalizes year zero and rejects unsafe coordinates', () => {
  assert.deepEqual(readAtlasUrlState('?year=0&lat=999&lng=75.86'), { year: 1, map: null })
  assert.equal(readAtlasUrlState('?year=-4000').year, null)
})

test('atlas share state serializes stable, copyable URL parameters', () => {
  const url = updateAtlasUrlState({ year: 740, map: { lat: 15.335001, lng: 76.475399, zoom: 9.876 } }, 'https://atlas.example/?ref=source#atlas')
  assert.equal(url.toString(), 'https://atlas.example/?ref=source&year=740&lat=15.335&lng=76.4754&zoom=9.88#atlas')
})
