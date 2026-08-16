import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { atlasData, collectionLabels } from '../src/data/atlas.js'

const peopleExplorerSource=await readFile(new URL('../src/PeopleExplorer.jsx',import.meta.url),'utf8')

test('Volume 5 Karnataka extraction is complete, stable and review-gated',()=>{
  const records=atlasData.martyrCandidates
  assert.equal(records.length,269)
  assert.equal(new Set(records.map(record=>record.id)).size,269)
  assert.equal(records.filter(record=>record.relationship==='karnataka-origin-or-residence').length,249)
  assert.equal(records.filter(record=>record.relationship==='karnataka-event-connection').length,20)
  assert.ok(records.every(record=>record.review.status==='needs-review'))
  assert.ok(records.every(record=>record.discovery.publicationReady===false))
  assert.ok(records.every(record=>record.citations[0].sourceId==='src-india-culture-dictionary-martyrs-v5'))
  assert.ok(records.every(record=>record.citations[0].locator.includes('printed p.')))
  assert.ok(records.every(record=>!('text' in record)&&!('connectionStatement' in record)))
  const eventConnections=records.filter(record=>record.relationship==='karnataka-event-connection')
  assert.ok(eventConnections.every(record=>record.historicalConnection.years.length&&record.historicalConnection.actions.length&&record.historicalConnection.placeLeads.length))
  assert.ok(eventConnections.every(record=>record.dateInterpretation==='historical-connection-window-not-life-dates'))
})

test('known Karnataka entries retain printed and archival locators',()=>{
  const abdulRazak=atlasData.martyrCandidates.find(record=>record.name.en==='Abdul Razak')
  const annayyappa=atlasData.martyrCandidates.find(record=>record.name.en==='Annayyappa')
  assert.equal(abdulRazak.sourceEntry.printedPageFrom,2)
  assert.equal(abdulRazak.sourceEntry.archivalReference,'SSS, II, p. 31')
  assert.deepEqual(annayyappa.districtText,['Bangalore','Mysore'])
  assert.match(annayyappa.sourceEntry.archivalReference,/KSAB/)
})

test('dictionary candidates are visible to public review and permanent admin editing',()=>{
  assert.equal(collectionLabels.martyrCandidates,'Dictionary martyr candidates')
  assert.match(peopleExplorerSource,/atlasData\.martyrCandidates/)
  assert.match(peopleExplorerSource,/candidateKind==='dictionary-martyr'/)
  assert.match(peopleExplorerSource,/martyrCandidateMeta\?\.candidateCount/)
  assert.match(peopleExplorerSource,/people-event-connections/)
})
