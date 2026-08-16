import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'
import { dictionaryMartyrCandidates } from '../src/data/dictionary-martyrs-karnataka.js'
import { freedomMovementEventLeads } from '../src/data/freedom-movement-event-leads.js'
import { validateAtlas } from '../src/data/validate.js'

test('source-backed person localities retain relationship, place and citation evidence',()=>{
  const placeIds=new Set(atlasData.places.map(place=>place.id))
  const people=atlasData.people.filter(person=>person.placeAssociations?.length)
  assert.ok(people.length>=11)
  for(const person of people){
    for(const association of person.placeAssociations){
      assert.ok(placeIds.has(association.placeId),`${person.id} has an unknown place`)
      assert.ok(association.kind)
      assert.ok(association.citations?.length)
    }
  }
  const hardekar=atlasData.people.find(person=>person.id==='person-hardekar-manjappa')
  assert.deepEqual(hardekar.placeAssociations.map(item=>item.placeId),['place-banavasi','place-davanagere-freedom'])
  assert.equal(validateAtlas(atlasData).filter(issue=>issue.severity==='error').length,0)
})
test('every Dictionary martyr event connection has a review-only atlas event projection',()=>{
  const sourceCandidates=dictionaryMartyrCandidates.filter(candidate=>candidate.relationship==='karnataka-event-connection')
  assert.equal(freedomMovementEventLeads.length,sourceCandidates.length)
  assert.equal(freedomMovementEventLeads.length,20)
  for(const event of freedomMovementEventLeads){
    assert.equal(event.review.status,'needs-review')
    assert.equal(event.researchOnly,true)
    assert.equal(event.researchInput.sourceCollection,'martyrCandidates')
    assert.equal(event.location.precision,'district-centre')
    assert.ok(event.candidateIds?.length===1)
    assert.ok(sourceCandidates.some(candidate=>candidate.id===event.candidateIds[0]))
    assert.ok(atlasData.events.some(record=>record.id===event.id))
    assert.ok(event.citations?.[0]?.locator.includes('printed p.'))
  }
})
