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

test('the share URL writer merges rapid changes into one write and survives a refused write', async t => {
  const { createShareUrlWriter } = await import('../src/share-state.js')
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const calls = []
  const win = { location: { href: 'http://localhost/#atlas' }, history: { replaceState: (...args) => { calls.push(args[2]) } } }
  const write = createShareUrlWriter(250, win)
  for (let year = 100; year < 400; year += 1) write({ year })
  write({ map: { lat: 14.5, lng: 76.2, zoom: 7 } })
  t.mock.timers.tick(249)
  assert.equal(calls.length, 0, 'nothing is written while the movement continues')
  t.mock.timers.tick(2)
  assert.equal(calls.length, 1, 'one write for 300 changes')
  assert.match(calls[0], /year=399/)
  assert.match(calls[0], /lat=14\.5/)
  const refusing = { location: win.location, history: { replaceState: () => { throw new DOMException('too many calls', 'SecurityError') } } }
  const guarded = createShareUrlWriter(10, refusing)
  guarded({ year: 500 })
  assert.doesNotThrow(() => t.mock.timers.tick(20))
})
