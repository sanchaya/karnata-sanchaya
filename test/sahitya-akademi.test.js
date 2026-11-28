import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { AWARD_KINDS, awardsByAuthorId, sahityaAkademiAwards } from '../src/data/sahitya-akademi-kannada.js'
import { kannadaAuthors } from '../src/data/kannada-authors.js'

test('Sahitya Akademi awards: every row is complete and the file was read in full',async()=>{
  const csv=await readFile(new URL('../src/data/imports/sahitya-akademi-kannada.csv',import.meta.url),'utf8')
  assert.equal(sahityaAkademiAwards.length,csv.split('\n').filter(l=>l.trim()).length-1,'one record per data row of the CSV')
  const ids=new Set()
  for(const a of sahityaAkademiAwards){
    assert.ok(!ids.has(a.id));ids.add(a.id)
    assert.ok(a.winner&&a.work&&AWARD_KINDS.includes(a.award),`${a.id}: ${a.winner} / ${a.award}`)
    assert.ok(a.year>=1955&&a.year<=2025,`${a.id} year`)
    if(a.festivals){assert.ok(['certain','probable'].includes(a.festivals.confidence)&&a.festivals.list,`${a.id} festival match`);assert.equal(typeof a.festivals.before,'boolean')}
  }
  // Kuvempu received the first main award in 1955; the main award is given once a year, with no missing early years in the file.
  const first=sahityaAkademiAwards.filter(a=>a.award==='Main award').sort((x,y)=>x.year-y.year)[0]
  assert.equal(first.winner,'Kuvempu');assert.equal(first.year,1955)
  assert.equal(sahityaAkademiAwards.filter(a=>a.festivals).length>=20,true)
})

test('Sahitya Akademi awards: winners link to real writer cards, and the page shows them',async()=>{
  const authorIds=new Set(kannadaAuthors.map(a=>a.id))
  for(const id of Object.keys(awardsByAuthorId))assert.ok(authorIds.has(id),`no writer card ${id}`)
  assert.ok(Object.keys(awardsByAuthorId).length>=15)
  // a linked winner must be the same person: the card's name shares a word with the winner's name
  for(const a of sahityaAkademiAwards.filter(x=>x.authorId)){
    const card=kannadaAuthors.find(w=>w.id===a.authorId).name.en.toLowerCase().replace(/[^a-z ]/g,' ').split(/\s+/).filter(w=>w.length>3)
    assert.ok(card.some(word=>a.winner.toLowerCase().includes(word)),`${a.winner} does not look like ${a.authorId}`)
  }
  const page=await readFile(new URL('../src/AuthorsPage.jsx',import.meta.url),'utf8')
  assert.match(page,/<SahityaAwards /);assert.match(page,/awardsByAuthorId/)
  const { LICENCES }=await import('../src/data/licences.js')
  assert.equal(LICENCES.find(i=>i.id==='sahitya-akademi').commercial,'check')
})
