import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { atlasData } from '../src/data/atlas.js'
import { geographyNatureHighlights, geographyProtectedAreas } from '../src/data/geography-nature.js'
import { AATA_ARCHIVE_START, archiveDateValid, archiveWeekKey, buildCrossword, buildWordCatalog, buildYearPuzzle, graphemes, scoreGuess, shiftArchiveDate } from '../src/aata-paata.js'

const geography={highlights:geographyNatureHighlights,protectedAreas:geographyProtectedAreas}
const appSource=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8')
const pageSource=await readFile(new URL('../src/AataPaata.jsx',import.meta.url),'utf8')

test('Kannada words are measured as grapheme clusters rather than code points',()=>{
  assert.deepEqual(graphemes('ಕದಂಬ','kn'),['ಕ','ದಂ','ಬ'])
})

test('word scoring handles repeated letters without over-counting',()=>{
  assert.deepEqual(scoreGuess('ABBEY','ALLEY','en').map(item=>item.status),['correct','absent','absent','correct','correct'])
})

test('word catalog is derived from bilingual atlas and geography records',()=>{
  for(const locale of ['kn','en']){
    const catalog=buildWordCatalog(atlasData,geography,locale)
    assert.ok(catalog.length>100,`${locale} should expose a useful source-backed word pool`)
    assert.ok(catalog.some(item=>item.id==='polity-kadamba'))
    assert.ok(catalog.every(item=>item.id&&item.hint&&item.route))
  }
})

test('time grid uses four real event years and a valid 4x4 solution',()=>{
  const puzzle=buildYearPuzzle(atlasData.events,'kn','fixture')
  assert.equal(new Set(puzzle.years).size,4)
  const expected=[...puzzle.years].sort((a,b)=>a-b)
  for(let row=0;row<4;row+=1)assert.deepEqual(puzzle.solution.slice(row*4,row*4+4).sort((a,b)=>a-b),expected)
  for(let col=0;col<4;col+=1)assert.deepEqual([0,1,2,3].map(row=>puzzle.solution[row*4+col]).sort((a,b)=>a-b),expected)
  assert.ok(puzzle.facts.every(fact=>atlasData.events.some(event=>event.id===fact.id)))
})

test('crossword builds intersecting clues from atlas records',()=>{
  const catalog=buildWordCatalog(atlasData,geography,'kn')
  const puzzle=buildCrossword(catalog,'kn','fixture')
  assert.ok(puzzle.entries.length>=4)
  assert.ok(puzzle.entries.some(entry=>entry.direction==='across'))
  assert.ok(puzzle.entries.some(entry=>entry.direction==='down'))
  assert.ok(puzzle.entries.every(entry=>catalog.some(item=>item.id===entry.id)))
})

test('Aata-Paata is a bilingual lazy public route with no external product branding',()=>{
  assert.match(appSource,/const AataPaata=lazy/)
  assert.match(appSource,/'aata-paata'/)
  assert.match(appSource,/view==='aata-paata'/)
  assert.match(pageSource,/ಆಟ–ಪಾಠ/)
  assert.match(pageSource,/Aata–Paata/)
  assert.doesNotMatch(pageSource,/sampada/i)
})

test('game archive dates, weeks and shareable parameters stay deterministic',()=>{
  assert.equal(AATA_ARCHIVE_START,'2026-11-13')
  assert.equal(shiftArchiveDate('2026-11-13',1),'2026-11-14')
  assert.equal(shiftArchiveDate('2026-11-13',-1),'2026-11-12')
  assert.equal(archiveWeekKey('2026-11-13'),'2026-46')
  assert.equal(archiveDateValid('2026-11-13','2026-11-20'),true)
  assert.equal(archiveDateValid('2026-11-12','2026-11-20'),false)
  assert.match(pageSource,/searchParams\.set\('puzzle',date\)/)
  assert.match(pageSource,/atlas-aata-crossword:/)
})

test('Kannada game answers use the locally bundled jquery IME integration',async()=>{
  const inputSource=await readFile(new URL('../src/KannadaImeInput.jsx',import.meta.url),'utf8')
  const imeSource=await readFile(new URL('../src/kannada-ime.js',import.meta.url),'utf8')
  const layoutSource=await readFile(new URL('../src/aata-paata-layout.css',import.meta.url),'utf8')
  assert.match(pageSource,/KannadaImeInput/)
  assert.match(imeSource,/import\('jquery\.ime'\)/)
  assert.match(imeSource,/kn-atlas-transliteration/)
  assert.match(inputSource,/aria-pressed=\{enabled\}/)
  assert.match(layoutSource,/@media \(max-width: 560px\)/)
  assert.match(layoutSource,/\.kannada-ime-input \{\s*grid-template-columns: 1fr/)
  assert.match(layoutSource,/\.aata-game-tabs \{\s*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/)
})
