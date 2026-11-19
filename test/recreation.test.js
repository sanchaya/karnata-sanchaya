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
