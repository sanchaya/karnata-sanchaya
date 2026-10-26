import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'
import { bidarBkspSources } from '../src/data/bidar-bksp.generated.js'
import { eventsForPrimaryAtlas } from '../src/timeline-record-visibility.js'

const byId=(collection,id)=>atlasData[collection].find(record=>record.id===id)

test('BKSP importer preserves all eleven ServantsOfKnowledge books as review sources',()=>{
  assert.equal(bidarBkspSources.length,11)
  assert.equal(new Set(bidarBkspSources.map(source=>source.repository.identifier)).size,11)
  bidarBkspSources.forEach(source=>{
    assert.equal(source.repository.collectionId,'ServantsOfKnowledge')
    assert.match(source.ocrUrl,/archive\.org\/download\/bksp\./)
    assert.equal(source.contentReview.status,'ocr-screened')
    assert.equal(source.review.status,'needs-review')
    assert.ok(byId('sources',source.id),`${source.id} should be integrated`)
  })
})

test('BKSP research packet connects Bidar places, people, events and district history',()=>{
  const ids=[
    ['places','place-bhalki-bidar'],['places','place-kamalnagar-bidar'],['places','place-gorata-bidar'],
    ['people','person-channabasava-pattadevaru'],['people','person-chabhi-somashetty'],['people','person-gurubasava-devaru'],
    ['people','person-guramma-siddareddy'],['people','person-virupakshayya-mathapati-gorata'],['people','person-poornima-g'],
    ['people','person-vn-patil-bidar'],['people','person-bheemanna-khandre'],['people','person-shivaswamy-cheenakeri'],
    ['districtHistoryResearch','district-history-bidar-gorata-memory'],['districtHistoryResearch','district-history-bidar-bksp-cultural-biographies'],
  ]
  ids.forEach(([collection,id])=>assert.ok(byId(collection,id),`${collection}.${id} should exist`))
  const visible=new Set(eventsForPrimaryAtlas(atlasData.events,new Set(atlasData.polities.map(record=>record.id))).map(record=>record.id))
  assert.ok(visible.has('event-gorata-liberation-memory-1948'))
  assert.ok(visible.has('event-bidar-kannada-sahitya-sammelana-2006'))
})
