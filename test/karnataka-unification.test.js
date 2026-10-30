import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { atlasData } from '../src/data/atlas.js'

test('Karnataka unification timeline connects movement, people and constitutional formation',()=>{
  const events=atlasData.events.filter(item=>item.timelineCategory==='unification')
  assert.ok(events.length>=7)
  assert.ok(events.some(item=>item.id==='event-unification-ekikarana-sabha-1916'&&item.peopleIds.includes('person-ff-5')))
  const formation=events.find(item=>item.id==='event-unified-mysore-state')
  assert.equal(formation.review.status,'reviewed')
  assert.ok(formation.citations.some(item=>item.sourceId==='src-unification-states-reorganisation-india-code'&&item.locator.includes('Section 7')))
})

test('pre-1956 administrative fragments remain explicitly schematic',()=>{
  const phases=atlasData.externalGovernancePhases.filter(item=>item.timelineCategory==='unification')
  assert.equal(phases.length,5)
  assert.deepEqual(new Set(phases.map(item=>item.geography.geometry.precision)),new Set(['schematic']))
  assert.ok(phases.every(item=>item.geography.confidence==='low'&&item.interpretation.en.includes('not a surveyed legal boundary')))
  assert.ok(phases.some(item=>item.id.endsWith('bombay-regions')))
  assert.ok(phases.some(item=>item.id.endsWith('madras-regions')))
  assert.ok(phases.some(item=>item.id.endsWith('hyderabad-regions')))
  assert.ok(phases.some(item=>item.id.endsWith('coorg')))
})

test('the atlas exposes a bilingual unification timeline category',async()=>{
  const [app,i18n]=await Promise.all([readFile(new URL('../src/App.jsx',import.meta.url),'utf8'),readFile(new URL('../src/i18n.js',import.meta.url),'utf8')])
  assert.match(app,/\['all','wars','freedom','unification'/)
  assert.match(app,/record\.timelineCategory==='unification'\?'unification'/)
  assert.match(i18n,/unification:'ಕರ್ನಾಟಕ ಏಕೀಕರಣ'/)
  assert.match(i18n,/unification:'Karnataka unification'/)
})
