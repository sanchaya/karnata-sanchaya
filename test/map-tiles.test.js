import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('the main atlas uses the supported OpenStreetMap tile endpoint', async () => {
  const source = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert.match(source, /https:\/\/tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/)
  assert.doesNotMatch(source, /layers\.modern&&<TileLayer[^\n]+https:\/\/\{s\}\.tile\.openstreetmap\.org/)
})
