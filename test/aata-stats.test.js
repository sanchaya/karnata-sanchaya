import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'
import { currentStreak, emptyStats, recordResult, wordShareText } from '../src/aata-stats.js'
import { buildWhereRounds, haversineKm, roundScore, whereShareText } from '../src/aata-where.js'

test('a streak grows on consecutive days played on the day, and ends after a miss',()=>{
  let stats=recordResult(emptyStats(),'2026-11-13',true,'2026-11-13')
  stats=recordResult(stats,'2026-11-14',true,'2026-11-14')
  assert.equal(stats.streak,2);assert.equal(stats.best,2)
  assert.equal(currentStreak(stats,'2026-11-15'),2)
  assert.equal(currentStreak(stats,'2026-11-16'),0)
  stats=recordResult(stats,'2026-11-16',false,'2026-11-16')
  assert.equal(stats.streak,0);assert.equal(stats.best,2)
})

test('archive play and repeats do not move the streak or the totals twice',()=>{
  const first=recordResult(emptyStats(),'2026-11-13',true,'2026-11-14')
  assert.equal(first.streak,0);assert.equal(first.played,1)
  assert.deepEqual(recordResult(first,'2026-11-13',false,'2026-11-14'),first)
})

test('word share text carries no answer letters',()=>{
  const text=wordShareText({title:'Word',date:'2026-11-13',rows:[[{letter:'ಅ',status:'correct'},{letter:'ಬ',status:'absent'}]],url:'u'})
  assert.equal(text,'Word 2026-11-13 1\n🟩⬛\nu')
})

test('where rounds are stable per seed, inside Karnataka and carry a clue',()=>{
  const rounds=buildWhereRounds(atlasData,'en','2026-11-13')
  assert.equal(rounds.length,5)
  assert.deepEqual(rounds,buildWhereRounds(atlasData,'en','2026-11-13'))
  assert.ok(rounds.every(round=>round.clue&&round.coords[0]>=11&&round.coords[0]<=19))
  assert.notDeepEqual(rounds.map(round=>round.id),buildWhereRounds(atlasData,'en','2026-11-14').map(round=>round.id))
})

test('distance scoring is 1000 on the spot and 0 beyond 400 km',()=>{
  assert.equal(roundScore(0),1000);assert.equal(roundScore(200),500);assert.equal(roundScore(900),0)
  assert.ok(Math.abs(haversineKm([12.97,77.59],[15.34,75.14])-373)<5)
  assert.equal(whereShareText({title:'T',date:'d',kms:[0,50,300],url:'u'}),'T d 2125/3000\n🟩🟨🟥\nu')
})

test('who-am-I rounds are stable, include the answer once among six options, and clues grow more specific',async()=>{
  const { buildWhoRounds, whoClues, whoPoints } = await import('../src/aata-who.js')
  const { DYNASTY_PHASES } = await import('../src/data/dynasty-areas.js')
  const rounds=buildWhoRounds(DYNASTY_PHASES,atlasData,'en','2026-11-13')
  assert.equal(rounds.length,5)
  assert.deepEqual(rounds,buildWhoRounds(DYNASTY_PHASES,atlasData,'en','2026-11-13'))
  for(const round of rounds){assert.equal(round.options.length,6);assert.equal(round.options.filter(option=>option.id===round.id).length,1);assert.equal(round.clues.length,4)}
  assert.match(whoClues(DYNASTY_PHASES.find(phase=>phase.id==='kadamba'),atlasData,'en')[1],/Banavasi/)
  assert.deepEqual([1,2,3,4,5].map(whoPoints),[4,3,2,1,0])
})

test('script rounds use only Kannada words and a known style',async()=>{
  const { buildScriptRounds, SCRIPT_STYLES } = await import('../src/aata-script.js')
  const { buildWordCatalog } = await import('../src/aata-paata.js')
  const { geographyNatureHighlights, geographyProtectedAreas } = await import('../src/data/geography-nature.js')
  const catalog=buildWordCatalog(atlasData,{highlights:geographyNatureHighlights,protectedAreas:geographyProtectedAreas},'kn')
  const rounds=buildScriptRounds(catalog,'2026-11-13')
  assert.ok(rounds.length>=3)
  assert.ok(rounds.every(round=>/^[ಀ-೿]+$/u.test(round.word)&&SCRIPT_STYLES.some(style=>style.id===round.style.id)))
  assert.deepEqual(rounds,buildScriptRounds(catalog,'2026-11-13'))
})
