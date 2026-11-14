import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { applyReviewedNames, classifySeasonality, filterSpecies, isKannada, normalizeKannada, pickEnglishName } from '../src/species-normalize.js'

const data=JSON.parse(await readFile(new URL('../src/data/species/karnataka-species.json',import.meta.url),'utf8'))
const flat=n=>Array(12).fill(n)

test('Kannada names are normalised and non-Kannada text is rejected',()=>{
  assert.equal(normalizeKannada('  ನವಿಲು  (ಪಕ್ಷಿ).'),'ನವಿಲು')
  assert.equal(normalizeKannada('ನ​ವಿಲು'),'ನವಿಲು')
  assert.ok(isKannada('ಹುಲಿ'))
  assert.ok(!isKannada('Peafowl'))
})

test('English name prefers a clean Wikidata label, then the commonest GBIF name',()=>{
  assert.equal(pickEnglishName(['x1'],['Indian Peafowl']),'Indian Peafowl')
  assert.equal(pickEnglishName(['Blue Peafowl','Indian Peafowl','Indian Peafowl'],[]),'Indian Peafowl')
})

test('seasonality separates residents, winter visitors and summer visitors',()=>{
  assert.equal(classifySeasonality(flat(100)).pattern,'resident')
  assert.equal(classifySeasonality([200,150,80,10,0,0,0,0,0,40,150,220]).pattern,'winter-visitor')
  assert.equal(classifySeasonality([0,0,0,60,120,200,200,150,60,0,0,0]).pattern,'summer-visitor')
  assert.equal(classifySeasonality([0,0,0,0,0,0,0,0,0,0,0,3]).pattern,'unknown')
  assert.equal(classifySeasonality(flat(100)).migratory,false)
})

test('reviewed names override imports and the filters work',()=>{
  const list=[{gbifKey:1,name:{en:'A',kn:'ಹಳೆಯ'},knCandidates:[{value:'ಹಳೆಯ',sources:['GBIF']}],group:'bird',scientificName:'Aus bus'},{gbifKey:2,name:{en:'B',kn:''},knCandidates:[],group:'plant',scientificName:'Cus dus'}]
  const merged=applyReviewedNames(list,{1:{kn:'ಹೊಸ',note:'x'},2:{kn:'English'}})
  assert.equal(merged[0].name.kn,'ಹೊಸ');assert.ok(merged[0].knReviewed)
  assert.equal(merged[1].name.kn,'')
  assert.deepEqual(filterSpecies(merged,{needsKannada:true}).map(s=>s.gbifKey),[2])
  assert.deepEqual(filterSpecies(merged,{query:'cus'}).map(s=>s.gbifKey),[2])
})

test('the imported dataset is unique, sourced and every Kannada name is Kannada script',()=>{
  assert.ok(data.species.length>=40)
  assert.equal(new Set(data.species.map(s=>s.gbifKey)).size,data.species.length)
  assert.ok(data.sources.length>=2)
  const groups=new Set(data.groups.map(g=>g.id))
  for(const s of data.species){
    assert.ok(groups.has(s.group),s.id)
    assert.ok(s.scientificName,s.id)
    assert.equal(s.review.status,'needs-review')
    if(s.name.kn)assert.ok(isKannada(s.name.kn),`${s.id} Kannada name`)
    for(const c of s.knCandidates)assert.ok(isKannada(c.value)&&c.sources.length,`${s.id} candidate`)
    if(s.group!=='bird')assert.equal(s.seasonality,undefined)
  }
  assert.ok(data.species.some(s=>s.seasonality?.migratory===true),'migratory birds expected')
})

test('curated name lists add group names, corroborate existing names and keep specific names first',async()=>{
  const { applyNameSources }=await import('../src/species-normalize.js')
  const lists=JSON.parse(await readFile(new URL('../src/data/species/kn-name-sources.json',import.meta.url),'utf8')).sources
  assert.ok(lists.every(l=>l.entries.length>0&&l.url))
  const kite={gbifKey:1,name:{en:'Black Kite',kn:''},knCandidates:[],group:'bird',scientificName:'Milvus migrans'}
  const myna={gbifKey:2,name:{en:'Jungle Myna',kn:'ಗೊರವಂಕ'},knCandidates:[{value:'ಗೊರವಂಕ',sources:['GBIF']}],group:'bird',scientificName:'Acridotheres fuscus'}
  const fly={gbifKey:3,name:{en:'Asian Paradise-Flycatcher',kn:''},knCandidates:[],group:'bird',scientificName:'Terpsiphone paradisi'}
  const [k,m,f]=applyNameSources([kite,myna,fly],lists)
  assert.equal(k.name.kn,'ಹದ್ದು');assert.equal(k.knScope,'group')
  assert.ok(m.knCandidates[0].sources.length>1,'same name in a second list is corroboration')
  assert.equal(m.knScope,undefined)
  assert.ok(f.knCandidates.some(c=>c.value==='ರಾಜ ಹಕ್ಕಿ'))
  assert.equal(applyNameSources([{...kite,group:'plant',name:{en:'Teak',kn:''}}],lists)[0].name.kn,'')
})

test('species stats file matches the data',async()=>{
  const meta=JSON.parse(await readFile(new URL('../src/data/species/species-meta.json',import.meta.url),'utf8'))
  assert.equal(meta.speciesCount,data.species.length)
})

test('only openly licensed species photos are accepted',async()=>{
  const { isOpenLicense, cleanCredit }=await import('../src/species-images.js')
  for(const ok of ['CC BY-SA 4.0','CC BY 2.0','CC0','Public domain','CC BY-SA 3.0','PD-self'])assert.ok(isOpenLicense(ok),ok)
  for(const bad of ['CC BY-NC 2.0','CC BY-ND 4.0','CC BY-NC-SA 3.0','GFDL','Fair use','','All rights reserved'])assert.ok(!isOpenLicense(bad),bad)
  assert.ok(!isOpenLicense('CC BY 4.0','true'))
  assert.equal(cleanCredit('<a href="x">Jane &amp; Co</a>'),'Jane & Co')
})

test('every species photo is openly licensed, credited and linked to its Commons page',async()=>{
  const { isOpenLicense }=await import('../src/species-images.js')
  const { images }=JSON.parse(await readFile(new URL('../src/data/species/species-images.json',import.meta.url),'utf8'))
  const keys=new Set(data.species.map(s=>String(s.gbifKey)))
  assert.ok(Object.keys(images).length>50)
  for(const [key,image] of Object.entries(images)){
    assert.ok(keys.has(key),`${key} is not a known species`)
    assert.ok(isOpenLicense(image.license),`${key} licence ${image.license}`)
    assert.match(image.thumb,/^https:\/\/(upload|thumb)\.wikimedia\.org\//)
    assert.match(image.page,/^https:\/\/commons\.wikimedia\.org\//)
    assert.ok(image.author,`${key} needs an author`)
  }
})
