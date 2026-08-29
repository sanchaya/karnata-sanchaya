import test from 'node:test'
import assert from 'node:assert/strict'
import { checkTranslationGlossary, translationGlossary } from '../src/data/translation-glossary.js'
import { validateAtlas } from '../src/data/validate.js'
import { atlasData } from '../src/data/atlas.js'

test('every glossary entry has an English term, Kannada translation and note', () => {
  for (const entry of translationGlossary) {
    assert.ok(entry.id, 'glossary entry needs a stable id')
    assert.ok(entry.en?.trim(), `${entry.id} needs an English term`)
    assert.ok(entry.kn?.trim(), `${entry.id} needs a Kannada translation`)
    assert.ok(entry.note?.trim(), `${entry.id} needs a note explaining when it applies`)
  }
})

test('flags a "-lead" record whose Kannada text uses the metal (ಸೀಸ) instead of the clue sense (ದಾರಿ)', () => {
  const bad = { id: 'coin-example-lead', name: { en: 'Example coinage lead', kn: 'ಉದಾಹರಣೆ ನಾಣ್ಯ ಸೀಸ' } }
  const issues = checkTranslationGlossary(bad)
  assert.equal(issues.length, 1)
  assert.match(issues[0].message, /ದಾರಿ/)
})

test('does not flag a "-lead" record whose Kannada text correctly uses ದಾರಿ', () => {
  const good = { id: 'coin-example-lead', name: { en: 'Example coinage lead', kn: 'ಉದಾಹರಣೆ ನಾಣ್ಯ ದಾರಿ' } }
  assert.deepEqual(checkTranslationGlossary(good), [])
})

test('does not flag records whose id does not end in "-lead", even if the Kannada text contains ಸೀಸ', () => {
  const record = { id: 'coin-example-leaded-alloy', material: 'lead', name: { en: 'Leaded alloy coin', kn: 'ಸೀಸ ಮಿಶ್ರಲೋಹ ನಾಣ್ಯ' } }
  assert.deepEqual(checkTranslationGlossary(record), [])
})

test('the live dataset has no ಸೀಸ mistranslations on any "-lead" record', () => {
  const issues = validateAtlas(atlasData).filter(issue => issue.message.includes('(glossary:'))
  assert.deepEqual(issues, [], `unexpected glossary issues: ${JSON.stringify(issues)}`)
})
