import test from 'node:test'
import assert from 'node:assert/strict'
import { trails } from '../src/data/trails.js'
import { atlasData } from '../src/data/atlas.js'

const byCollection = new Map(
  Object.entries(atlasData)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, records]) => [key, new Map(records.map(record => [record.id, record]))]),
)

test('at least three curated trails are shipped', () => {
  assert.ok(trails.length >= 3, `expected >=3 trails, found ${trails.length}`)
})

test('every trail exposes id, slug, era, bilingual title/summary and a year range', () => {
  for (const trail of trails) {
    assert.match(trail.id, /^trail-[a-z0-9-]+$/, `${trail.id} needs a stable hyphenated id`)
    assert.match(trail.slug, /^[a-z0-9-]+$/, `${trail.id} needs a slug`)
    for (const field of ['title', 'summary'])
      for (const lang of ['kn', 'en'])
        assert.equal(typeof trail?.[field]?.[lang] === 'string' && trail[field][lang].length > 0, true, `${trail.id} ${field}.${lang} missing`)
    assert.ok(Number.isFinite(trail.yearRange?.from) && Number.isFinite(trail.yearRange?.to), `${trail.id} needs a numeric yearRange`)
    assert.ok(Array.isArray(trail.stops) && trail.stops.length >= 5, `${trail.id} needs at least 5 stops`)
  }
})

test('every trail stop resolves to a real record in the bundled atlas data', () => {
  for (const trail of trails) {
    for (const stop of trail.stops) {
      const collection = byCollection.get(stop?.kind)
      assert.ok(collection, `${trail.id} stop uses unknown collection '${stop?.kind}'`)
      assert.ok(collection.has(stop.recordId), `${trail.id} stop ${stop.kind}:${stop.recordId} must resolve to a bundled record`)
      assert.equal(typeof stop.narrative?.kn === 'string' && stop.narrative.kn.length > 0, true, `${trail.id} stop ${stop.recordId} needs Kannada narrative`)
      assert.equal(typeof stop.narrative?.en === 'string' && stop.narrative.en.length > 0, true, `${trail.id} stop ${stop.recordId} needs English narrative`)
    }
  }
})

test('each trail spans at least two atlas collections', () => {
  for (const trail of trails) {
    const collections = new Set(trail.stops.map(stop => stop.kind))
    assert.ok(collections.size >= 2, `${trail.id} must draw from at least 2 collections (found ${collections.size})`)
  }
})

test('trail slugs are unique', () => {
  const slugs = new Set(trails.map(trail => trail.slug))
  assert.equal(slugs.size, trails.length, 'trail slugs must be unique')
})

test('guided trails cover the previously missing Karnataka dynasties and governing powers', () => {
  const ids = new Set(trails.map(trail => trail.id))
  for (const id of [
    'trail-western-ganga',
    'trail-mauryan-karnataka',
    'trail-alupa-coast',
    'trail-chola-gangavadi',
    'trail-kampili-vijayanagara-threshold',
    'trail-bahmani-adil-shahi',
    'trail-keladi-ikkeri',
    'trail-chitradurga-nayakas',
  ]) assert.ok(ids.has(id), `${id} must remain available in the public trail explorer`)
})

test('new dynasty trails expose material, administrative and territorial evidence where records exist', () => {
  const stops = id => new Set(trails.find(trail => trail.id === id)?.stops.map(stop => stop.recordId))
  assert.ok(stops('trail-mauryan-karnataka').has('coin-maturity-maski-ashokan-punchmarked-context'))
  assert.ok(stops('trail-chola-gangavadi').has('external-governance-chola-gangavadi'))
  assert.ok(stops('trail-kampili-vijayanagara-threshold').has('inscription-karch-vadhy3-va-museum-erambarage-jinalaya'))
  for (const id of ['admin-bahmani-bidar-kalaburagi-zone','coin-bahmani-bidar-kalaburagi-mint-lead','boundary-evidence-bahmani-northern-karnataka-zone']) assert.ok(stops('trail-bahmani-adil-shahi').has(id), `${id} must remain in the Bahmani trail`)
  assert.ok(stops('trail-keladi-ikkeri').has('boundary-evidence-keladi-coastal-interior-admin-zone'))
  assert.ok(stops('trail-chitradurga-nayakas').has('feudatory-chitradurga-nayaka-vijayanagara-successor'))
})
