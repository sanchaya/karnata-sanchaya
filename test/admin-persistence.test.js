import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData, collectionLabels } from '../src/data/atlas.js'
import { validateAtlas } from '../src/data/validate.js'
import { prepareDatasetSave } from '../src/admin-persistence.js'
import { mergeRepositorySeed } from '../server/dataset-store.js'

const clone = value => JSON.parse(JSON.stringify(value))

test('admin save round-trips every existing record in every collection', () => {
  let working = clone(atlasData)
  const updatedAt = '2026-07-28'

  for (const collection of Object.keys(collectionLabels)) {
    for (const original of atlasData[collection]) {
      const draft = clone(working[collection].find(record => record.id === original.id))
      const result = prepareDatasetSave({ data: working, collection, selectedId: original.id, draft, updatedAt })
      assert.ok(!result.error, `${collection}/${original.id}: ${result.error || 'unexpected save error'}`)
      working = result.next
    }
  }

  const errors = validateAtlas(working).filter(issue => issue.severity === 'error')
  assert.deepEqual(errors, [])
  for (const collection of Object.keys(collectionLabels)) {
    assert.equal(working[collection].length, atlasData[collection].length, `${collection} record count changed`)
    for (const original of atlasData[collection]) {
      const saved = working[collection].find(record => record.id === original.id)
      assert.deepEqual({ ...saved, review: undefined }, { ...original, review: undefined })
      assert.equal(saved.review.updatedAt, updatedAt)
    }
  }
})

test('existing stable IDs cannot be changed through the admin save path', () => {
  const original = atlasData.polities[0]
  const result = prepareDatasetSave({
    data: atlasData,
    collection: 'polities',
    selectedId: original.id,
    draft: { ...clone(original), id: `${original.id}-renamed` },
    updatedAt: '2026-07-28',
  })
  assert.match(result.error, /Stable ID/)
  assert.equal(result.next, undefined)
})

test('new records require a unique stable ID and preserve the complete record', () => {
  const draft = { id: 'polity-test-record', name: { en: 'Test record', kn: 'ಪರೀಕ್ಷಾ ದಾಖಲೆ' }, review: { status: 'draft' } }
  const result = prepareDatasetSave({ data: atlasData, collection: 'polities', draft, updatedAt: '2026-07-28' })
  assert.ok(!result.error)
  assert.equal(result.next.polities.at(-1).name.kn, 'ಪರೀಕ್ಷಾ ದಾಖಲೆ')
})

test('server-side repository sync adds people candidates without overwriting MariaDB edits', () => {
  const server=clone(atlasData)
  server.people[0].name.en='Server edit'
  server.peopleCandidates=[]
  server.peopleCandidateMeta=null
  server.meta.schemaVersion='0.24.0'
  const result=mergeRepositorySeed(server)
  assert.equal(result.dataset.people[0].name.en,'Server edit')
  assert.equal(result.dataset.peopleCandidates.length,905)
  assert.equal(result.dataset.meta.schemaVersion,'0.26.0')
  assert.equal(result.dataset.peopleCandidateMeta.candidateCount,905)
})
