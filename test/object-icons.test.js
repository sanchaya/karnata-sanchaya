import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'
import { isTempleRecord, objectIcon, objectKindFor, timelineCategoryForCulture } from '../src/object-icons.js'

test('temples are separated from other cultural and architectural records', () => {
  const temple=atlasData.culturalHeritage.find(item=>item.id==='culture-belur-channakeshava-1117')
  const palace=atlasData.culturalHeritage.find(item=>item.id==='culture-hampi-lotus-mahal')
  assert.equal(isTempleRecord(temple),true)
  assert.equal(timelineCategoryForCulture(temple),'temples')
  assert.equal(isTempleRecord(palace),false)
  assert.equal(timelineCategoryForCulture(palace),'monuments')
})

test('map object categories have distinct stable symbols', () => {
  const kinds=['temple','inscription','war','connection','literature','person','monument','culture']
  assert.equal(new Set(kinds.map(objectIcon)).size,kinds.length)
  assert.equal(objectKindFor({name:{en:'Mahadeva Temple'},category:'architecture'}),'temple')
  assert.equal(objectKindFor({storyKind:'inscription'}),'inscription')
  assert.equal(objectKindFor({storyKind:'event',type:'battle'}),'war')
})

test('bulk heritage indexes remain attributed review candidates', () => {
  assert.ok(atlasData.heritageInventoryLeads.length>=1500)
  assert.ok(atlasData.heritageInventoryLeads.every(item=>item.review?.status==='needs-review'))
  assert.ok(atlasData.heritageInventoryLeads.every(item=>item.sourceId&&item.sourceUrl))
  assert.ok(atlasData.heritageInventoryLeads.some(item=>item.sourceId==='src-wikipedia-heritage-chola-bengaluru'))
  assert.ok(atlasData.heritageInventoryLeads.some(item=>item.protectionLevel==='national'))
  assert.ok(atlasData.heritageInventoryLeads.some(item=>item.protectionLevel==='state'))
})
