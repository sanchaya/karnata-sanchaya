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

test('Kannada authors: links point at real atlas people and works that are the same ones',async()=>{
  const { atlasData } = await import('../src/data/atlas.js')
  const { authorByPersonId, writerGender } = await import('../src/data/kannada-authors.js')
  const norm=value=>String(value||'').toLowerCase().replace(/[^a-z]/g,'')
  const linked=kannadaAuthors.filter(a=>a.personId)
  assert.ok(linked.length>=9)
  for(const a of linked){
    const person=atlasData.people.find(p=>p.id===a.personId)
    assert.ok(person,`${a.id}: no atlas person ${a.personId}`)
    // the two records must share a name token, so a wrong id cannot slip through
    const tokens=norm(a.name.en).match(/.{4}/g)||[]
    assert.ok(tokens.some(token=>norm(person.name.en).includes(token)),`${a.id} and ${person.id} do not look like the same person`)
    for(const w of a.works.filter(x=>x.workId)){
      const work=atlasData.works.find(x=>x.id===w.workId)
      assert.ok(work,`${a.id}: no atlas work ${w.workId}`)
      const same=norm(work.name.en).slice(0,6)
      assert.ok(norm(w.en).includes(same)||norm(work.creatorDisplay).includes(norm(a.name.en).slice(0,5))||work.creatorIds?.includes(a.personId),`${a.id}: ${w.en} is not ${work.name.en}`)
    }
  }
  assert.equal(writerGender('person-akka-mahadevi'),'woman')
  assert.equal(writerGender('person-pampa'),'man')
  assert.equal(writerGender('person-unknown'),null)
  assert.equal(authorByPersonId['person-basavanna'].works.some(w=>w.workId==='work-basavanna-vachanas'),true)
})
