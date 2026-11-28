import test from 'node:test'
import assert from 'node:assert/strict'
import { AUTHOR_ROLES, kannadaAuthors } from '../src/data/kannada-authors.js'

test('Kannada authors: every writer has a sourced birthplace, works and both languages',()=>{
  const ids=new Set()
  for(const a of kannadaAuthors){
    assert.ok(!ids.has(a.id),`duplicate ${a.id}`);ids.add(a.id)
    assert.ok(['female','male'].includes(a.gender),a.id)
    assert.ok(a.name.en&&a.name.kn,`${a.id} needs both names`)
    assert.ok(a.role.length&&a.role.every(r=>AUTHOR_ROLES[r]),`${a.id} role`)
    assert.ok(a.works.length>0&&a.works.every(w=>w.en),`${a.id} needs named works`)
    assert.ok(a.evidence.length>0&&a.evidence.every(e=>e.title&&e.locator&&e.status==='read'),`${a.id} evidence`)
    const b=a.birth
    assert.ok(b.place.en&&b.place.kn&&b.district.en&&b.district.kn,`${a.id} birthplace names`)
    assert.ok(['place','district','disputed'].includes(b.precision),a.id)
    assert.ok(b.lat>8&&b.lat<20&&b.lng>72&&b.lng<80,`${a.id} point outside the expected area`)
    if(b.precision!=='place')assert.ok(b.doubt?.en&&b.doubt?.kn,`${a.id}: a district or disputed birthplace needs a note in both languages`)
    if(a.born&&a.died)assert.ok(a.died>=a.born,`${a.id} dates`)
    assert.doesNotMatch(JSON.stringify(a),/OCR|scann?ing/i,a.id)
    if(a.q)assert.match(a.q,/^Q\d+$/)
  }
})

test('Kannada authors: women and men are both well represented and the page is wired in',async()=>{
  const women=kannadaAuthors.filter(a=>a.gender==='female').length
  assert.ok(women>=10&&kannadaAuthors.length-women>=20)
  const { readFile } = await import('node:fs/promises')
  const app=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8')
  assert.match(app,/authors:'research'/);assert.match(app,/<AuthorsPage locale=\{locale\}\/>/)
  assert.match(app,/\['authors',locale==='kn'/)
})
