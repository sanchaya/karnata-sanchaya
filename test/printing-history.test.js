import test from 'node:test'
import assert from 'node:assert/strict'
import { PRINTING_KINDS, printingHistory } from '../src/data/printing-history.js'

test('printing history: every entry is bilingual, dated, sourced and honest about its status',()=>{
  const ids=new Set()
  for(const item of printingHistory){
    assert.ok(!ids.has(item.id),`duplicate id ${item.id}`);ids.add(item.id)
    assert.ok(Number.isInteger(item.year),item.id)
    assert.ok(PRINTING_KINDS.includes(item.kind),item.id)
    for(const field of [item.name,item.place,item.note])assert.ok(field.en&&field.kn,`${item.id} needs English and Kannada`)
    assert.ok(['read','lead'].includes(item.status),item.id)
    assert.ok(item.evidence.length>0,`${item.id} cites nothing`)
    for(const e of item.evidence)assert.ok(e.title&&e.locator&&['read','lead'].includes(e.status),`${item.id} evidence`)
    if(item.status==='read')assert.ok(item.evidence.some(e=>e.status==='read'),`${item.id} is marked read but no cited page was read`)
    if(item.doubt)assert.ok(item.doubt.en&&item.doubt.kn,`${item.id} doubt needs both languages`)
    assert.doesNotMatch(JSON.stringify(item),/OCR|scann?ing/i,`${item.id}: reader-facing text must not mention OCR or scanning`)
  }
})

test('printing history: the Press page shows it and the catalogue agrees on the first newspaper',async()=>{
  const { atlasData } = await import('../src/data/atlas.js')
  const first=atlasData.periodicals.filter(p=>Number.isFinite(p.date?.from)).sort((a,b)=>a.date.from-b.date.from)[0]
  assert.equal(first.date.from,1843)
  assert.equal(printingHistory.find(i=>i.id==='mangalur-samachara-1843').year,1843)
  const { readFile } = await import('node:fs/promises')
  const press=await readFile(new URL('../src/PressExplorer.jsx',import.meta.url),'utf8')
  assert.match(press,/<PrintingHistory /)
})
