import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'
import { eventsForPrimaryAtlas } from '../src/timeline-record-visibility.js'

const byId=(collection,id)=>atlasData[collection].find(record=>record.id===id)

test('Bidar Ashtoor source packet preserves provenance and review gates',()=>{
  const source=byId('sources','src-bksp-shikshana-chintaka-ashtoor-2021')
  assert.equal(source?.year,2021)
  assert.match(source?.url||'',/archive\.org\/details\/bksp\.shikshanachintak0000vidy/)

  const person=byId('people','person-basavaraj-g-patil-ashtoor')
  assert.equal(person?.review?.status,'needs-review')
  assert.ok(person?.citations?.some(item=>item.sourceId===source.id))
  assert.ok(person?.placeAssociations?.some(item=>item.placeId==='place-ashtoor-bidar'))

  const founding=byId('events','event-karnataka-vidyalaya-bidar-founded-1941')
  assert.equal(founding?.date?.from,1941)
  assert.equal(founding?.destinationPlaceId,'place-karnataka-college-bidar')
  assert.ok(eventsForPrimaryAtlas(atlasData.events,new Set(atlasData.polities.map(record=>record.id))).some(record=>record.id===founding.id))

  const ashtoor=byId('districtHistoryResearch','district-history-bidar-ashtoor-shared-sacred-landscape')
  assert.equal(ashtoor?.districtId,'audit-bidar')
  assert.equal(ashtoor?.review?.status,'needs-review')
  assert.equal(ashtoor?.location?.precision,'approximate')
  assert.ok(ashtoor?.citations?.some(item=>item.sourceId===source.id))
})

test('Bidar source packet connects people, places, events and district history',()=>{
  const expected=[
    ['places','place-ashtoor-bidar'],
    ['places','place-bvb-college-bidar'],
    ['places','place-karnataka-college-bidar'],
    ['people','person-vidyavathi-ballur'],
    ['culturalHeritage','culture-ashtoor-shared-devotional-landscape'],
    ['districtHistoryResearch','district-history-bidar-karnataka-vidyalaya-1941'],
    ['districtHistoryResearch','district-history-bidar-bvb-college-community-programmes'],
  ]
  expected.forEach(([collection,id])=>assert.ok(byId(collection,id),`${collection}.${id} should exist`))
})
