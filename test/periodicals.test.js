import test from 'node:test'
import assert from 'node:assert/strict'
import { inferGender, splitPeople, pressPeople, genderStats, placeGroups } from '../src/periodicals.js'
import { patrikaPeriodicals } from '../src/data/patrika-sanchaya.generated.js'

test('gender is a name-based reading with an honest unknown and organisation bucket', () => {
  assert.equal(inferGender('ಶ್ರೀಮತಿ ಶಶಿಕಲಾ ಎನ್ ತೋಟಾಪುರ'), 'woman')
  assert.equal(inferGender('ಲಕ್ಷ್ಮಮ್ಮ'), 'woman')
  assert.equal(inferGender('ಎಂ ಜೆ ರಾಜಶೇಖರ್ ಶೆಟ್ಟಿ'), 'man')
  assert.equal(inferGender('ಸಮತಾ ಪಬ್ಲಿಕೇಷನ್ಸ್'), 'organisation')
  assert.equal(inferGender('ಹರ್ಮನ್ ಮೋಗ್ಲಿಂಗ್'), 'unknown')
  assert.equal(inferGender(''), 'unknown')
})
test('joint editors are split and counted separately', () => {
  assert.deepEqual(splitPeople('ಎ ಬಿ ಸಿ / ಡಿ ಇ ಎಫ್'), ['ಎ ಬಿ ಸಿ', 'ಡಿ ಇ ಎಫ್'])
})
test('statistics add up to the people in the catalogue', () => {
  const people = pressPeople(patrikaPeriodicals)
  const stats = genderStats(patrikaPeriodicals)
  const sum = o => Object.values(o).reduce((a, b) => a + b, 0)
  assert.equal(sum(stats.editors), people.filter(p => p.editorCount).length)
  assert.equal(sum(stats.publishers), people.filter(p => p.publisherCount).length)
  const mapped = placeGroups(patrikaPeriodicals).reduce((n, g) => n + g.items.length, 0)
  assert.equal(mapped, patrikaPeriodicals.filter(p => p.location).length)
})
