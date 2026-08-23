import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshResearchIndexes } from '../server/dataset-store.js'

test('MariaDB research indexes are rebuilt from the reviewed dataset snapshot', async () => {
  const calls = []
  const db = { query: async (sql, args = []) => { calls.push({ sql, args }); return [] } }
  const result = await refreshResearchIndexes(db, {
    meta: { schemaVersion: '0.27.0' },
    polities: [{
      id: 'polity-test',
      name: { en: 'Test Polity', kn: 'ಪರೀಕ್ಷಾ ರಾಜ್ಯ' },
      type: 'kingdom',
      date: { from: 900, to: 950, precision: 'range' },
      capitalId: 'place-test',
      review: { status: 'needs-review' },
      citations: [{ sourceId: 'src-test', locator: 'p. 1' }],
    }],
    places: [{
      id: 'place-test',
      name: { en: 'Test Place', kn: 'ಪರೀಕ್ಷಾ ಸ್ಥಳ' },
      kind: 'capital',
      geographicScope: { countryCode: 'IN', outsideKarnataka: true },
      review: { status: 'needs-review' },
    }],
    inscriptions: [{
      id: 'inscription-test',
      title: { en: 'Test Inscription', kn: 'ಪರೀಕ್ಷಾ ಶಾಸನ' },
      polityId: 'polity-test',
      placeId: 'place-test',
      resolution: {
        transcription: { status: 'unresolved', sourceId: 'src-test', locator: 'line 1' },
      },
      review: { status: 'needs-review' },
    }],
  })

  assert.equal(result.records, 3)
  assert.equal(result.links, 3)
  assert.equal(result.gates, 1)
  assert.equal(calls.filter(call => call.sql.startsWith('DELETE FROM')).length, 3)
  assert.ok(calls.some(call => call.sql.includes('INSERT INTO research_record_index') && call.args[0] === 'place-test' && call.args[10] === 1))
  assert.ok(calls.some(call => call.sql.includes('INSERT INTO research_entity_links') && call.args[2] === 'capital' && call.args[3] === 'place-test'))
  assert.ok(calls.some(call => call.sql.includes('INSERT INTO research_evidence_gates') && call.args[2] === 'transcription' && call.args[3] === 'unresolved'))
})
