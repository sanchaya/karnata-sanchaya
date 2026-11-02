import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { DYNASTY_PHASES, dynastyAreasForYear } from '../src/data/dynasty-areas.js'
import { evidenceFor } from '../src/data/dynasty-evidence.js'


test('dynasty phases carry no district or state units and stay unverified', () => {
  for (const phase of DYNASTY_PHASES) {
    assert.equal(phase.districts, undefined, `${phase.id} must not claim district units`)
    assert.equal(phase.reach, undefined, `${phase.id} must not claim state units`)
    assert.equal(phase.verification, 'unverified')
  }
})

test('every dynasty has recorded evidence points, starting with its capital', () => {
  for (const phase of DYNASTY_PHASES) {
    const points = evidenceFor(phase)
    assert.ok(points.length >= 1, `${phase.id} has no evidence points`)
    assert.ok(points.some(point => point.kind === 'capital'), `${phase.id} has no capital`)
    assert.ok(points.every(point => point.lat > 5 && point.lat < 35 && point.lng > 68 && point.lng < 90), `${phase.id} has a point outside India (lat/lng order?)`)
  }
})

test('Cholas and Marathas show open leads that are never counted as evidence', () => {
  for (const id of ['chola-gangavadi', 'maratha-karnataka']) {
    const points = evidenceFor(DYNASTY_PHASES.find(phase => phase.id === id))
    assert.ok(points.some(point => point.kind === 'lead' && point.tier === 'lead'), `${id} has no leads`)
    assert.ok(points.some(point => point.kind === 'capital'), `${id} has no capital`)
  }
})

test('evidence grows with the year and a dynasty keeps only its own phase', () => {
  const vijayanagara = DYNASTY_PHASES.find(phase => phase.id === 'vijayanagara')
  assert.ok(evidenceFor(vijayanagara, 1400).length < evidenceFor(vijayanagara).length)
  const sultanate = DYNASTY_PHASES.find(phase => phase.id === 'mysore-sultanate')
  assert.ok(evidenceFor(sultanate).every(point => point.from == null || (point.to ?? point.from) >= sultanate.from))
  assert.equal(dynastyAreasForYear(100).active.some(phase => phase.id === 'kadamba'), false)
  assert.ok(dynastyAreasForYear(1100).active.some(phase => phase.id === 'hoysala'))
})

test('the atlas offers the dynasty areas layer, off by default', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(app, /dynastyAreas:true/)
  assert.match(app, /<DynastyAreasLayer /)
})

test('the dynasty layer offers a way to bring the older schematic boundaries back', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(app, /key==='dynastyAreas'&&layers\.dynastyAreas&&<label className="map-layer-suboption"/)
})

test('the map toolbar has a visible dynasty areas button', async () => {
  const app = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(app, /className="map-only-style-toggle dynasty-toggle" aria-pressed=\{layers\.dynastyAreas\}/)
})

test('phone layout gives the atlas toolbar, key and floating buttons separate places', async () => {
  const css = await readFile(new URL('../src/mobile-atlas.css', import.meta.url), 'utf8')
  const main = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8')
  assert.match(main, /mobile-atlas\.css/)
  assert.match(css, /\.map-legend \{ top: 58px/)
  assert.match(css, /guided-tour-launcher \{[^}]*right: 12px/)
})

test('the shareable dynasty map page is routed and ships its QR code', () => {
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(app, /view==='dynasties'&&/)
  assert.ok(existsSync(new URL('../public/karnata-qr.svg', import.meta.url)))
})
