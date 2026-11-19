import test from 'node:test'
import assert from 'node:assert/strict'
import { oldGames, GAME_KINDS, GAME_STATUS } from '../src/data/old-games.js'

test('old-games leads are well formed and never claim a source that was not read',()=>{
  assert.equal(new Set(oldGames.map(g=>g.id)).size,oldGames.length,'ids are unique')
  for(const g of oldGames){
    assert.ok(g.name.en&&g.name.kn&&g.note.en&&g.note.kn,`${g.id} needs both languages`)
    assert.ok(GAME_KINDS.includes(g.kind)&&GAME_STATUS.includes(g.status),`${g.id} kind and status`)
    if(g.status==='read')assert.ok(g.evidence.some(e=>e.status==='read'),`${g.id} is marked read but cites nothing read`)
    if(g.status==='oral')assert.equal(g.evidence.length,0,`${g.id} is oral: no printed source yet`)
  }
})

test('outbound partner clicks are counted anonymously and only for listed partners',async()=>{
  const { parseOutbound, OUTBOUND_TARGETS }=await import('../server/visits.js')
  assert.deepEqual(parseOutbound({target:'tollugatti',view:'recreation'}),{target:'tollugatti',view:'recreation'})
  assert.equal(parseOutbound({target:'unknown-site',view:'recreation'}),null)
  assert.equal(parseOutbound({target:'tollugatti',view:'Bad View!'}),null)
  assert.equal(parseOutbound(null),null)
  assert.ok(OUTBOUND_TARGETS.includes('tollugatti'))
  const { readFile }=await import('node:fs/promises')
  const migration=await readFile(new URL('../server/migrations/017_outbound_clicks.sql',import.meta.url),'utf8')
  assert.ok(!/visitor_hash/.test(migration),'outbound counts keep no visitor id')
})

test('food culture entries are well formed and never claim a source that was not read',async()=>{
  const { foodEntries, foodPlaces, FOOD_KINDS }=await import('../src/data/food-culture.js')
  assert.equal(new Set(foodEntries.map(e=>e.id)).size,foodEntries.length)
  for(const e of foodEntries){
    assert.ok(e.name.en&&e.name.kn&&e.note.en&&e.note.kn,`${e.id} needs both languages`)
    assert.ok(FOOD_KINDS.includes(e.kind),e.id)
    if(e.status==='read')assert.ok(e.evidence.some(x=>x.status==='read'),`${e.id} is marked read but cites nothing read`)
    assert.ok(!/OCR/.test(JSON.stringify(e)),`${e.id} must not mention OCR to readers`)
  }
  assert.ok(foodPlaces.every(p=>p.items.length))
})

test('each district appears once in the map lists, so no row overwrites another',async()=>{
  const { gamePlaces }=await import('../src/data/old-games.js')
  const { foodPlaces }=await import('../src/data/food-culture.js')
  for(const list of [gamePlaces,foodPlaces]){const names=list.map(p=>p.district);assert.equal(new Set(names).size,names.length,names.join(','))}
})
