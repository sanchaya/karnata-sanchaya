import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { DYNASTY_PHASES, dynastyAreasForYear } from '../src/data/dynasty-areas.js'

const districts = JSON.parse(await readFile(new URL('../public/karnataka-districts.geojson', import.meta.url)))
const states = JSON.parse(await readFile(new URL('../public/south-asia-states.geojson', import.meta.url)))

test('every dynasty area unit exists in the district and state files and stays unverified', () => {
  const districtIds = new Set(districts.features.map(feature => feature.properties.id))
  const stateIds = new Set(states.features.map(feature => feature.properties.id))
  for (const phase of DYNASTY_PHASES) {
    assert.ok(phase.districts.every(id => districtIds.has(id)), `${phase.id} districts`)
    assert.ok(phase.reach.every(id => stateIds.has(id)), `${phase.id} reach`)
    assert.equal(phase.verification, 'unverified')
  }
})

test('a later dynasty wins an overlapping district and years outside every phase map nothing', () => {
  const { byDistrict } = dynastyAreasForYear(1100)
  assert.equal(byDistrict.get('audit-hassan').id, 'hoysala')
  assert.equal(byDistrict.get('audit-kalaburagi').id, 'kalyani-chalukya')
  assert.equal(dynastyAreasForYear(100).byDistrict.size, 0)
})

test('the atlas offers the dynasty areas layer, off by default', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(app, /dynastyAreas:false/)
  assert.match(app, /<DynastyAreasLayer /)
})
