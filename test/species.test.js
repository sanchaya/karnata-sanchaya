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

test('species quiz rounds are deterministic, have four distinct options and always a photo',async()=>{
  const { buildBirdRounds }=await import('../src/aata-bird.js')
  const { applyNameSources, applyReviewedNames, filterSpecies, migratoryByMonth, namingDrive }=await import('../src/species-normalize.js')
  const lists=JSON.parse(await readFile(new URL('../src/data/species/kn-name-sources.json',import.meta.url),'utf8')).sources
  const images=JSON.parse(await readFile(new URL('../src/data/species/species-images.json',import.meta.url),'utf8')).images
  const species=applyReviewedNames(applyNameSources(data.species,lists),{})
  for(const locale of ['kn','en']){
    const a=buildBirdRounds(species,images,locale,'2026-11-14'),b=buildBirdRounds(species,images,locale,'2026-11-14'),c=buildBirdRounds(species,images,locale,'2026-11-15')
    assert.equal(a.length,5)
    assert.deepEqual(a,b)
    assert.notDeepEqual(a.map(r=>r.id),c.map(r=>r.id))
    for(const round of a){
      assert.ok(images[round.gbifKey])
      assert.equal(round.options.length,4)
      assert.equal(new Set(round.options.map(o=>o.name)).size,4)
      assert.ok(round.options.some(o=>o.id===round.id&&o.name===round.answer))
    }
  }
  const months=migratoryByMonth(species)
  assert.equal(months.length,12)
  assert.ok(months[0]>0&&months[11]>0,'winter months should have visitors')
  assert.ok(months[0]>months[6],'more migrants in January than July')
  assert.ok(filterSpecies(species,{group:'bird',month:1}).every(s=>s.seasonality.migratory))
  assert.equal(namingDrive(species,images,'x').length,10)
  assert.ok(namingDrive(species,images,'x').every(id=>!species.find(s=>s.id===id).name.kn))
  const culture=JSON.parse(await readFile(new URL('../src/data/species/species-culture.json',import.meta.url),'utf8')).notes
  for(const note of Object.values(culture))assert.ok(note.en&&note.kn)
})

test('approved species contributions become live names and a leaderboard',async()=>{
  const { speciesCommunity }=await import('../server/species-community.js')
  const row=(target,kn,user,name,when)=>({target_record_id:target,proposed_record_json:JSON.stringify({id:target,name:{kn}}),decided_at:when,user_id:user,display_name:name,display_name_kn:''})
  const out=speciesCommunity([
    row('species-gbif-1','ನವಿಲು','u1','Asha','2026-01-02'),
    row('species-gbif-1','ಮಯೂರ','u2','Ravi','2026-02-01'),
    row('species-gbif-2','ಹುಲಿ','u1','Asha','2026-01-05'),
    row('species-gbif-3','Peacock','u1','Asha','2026-01-06'),
    row('not-a-species','ಹೆಸರು','u1','Asha','2026-01-07'),
  ])
  assert.deepEqual(out.names.map(n=>[n.gbifKey,n.kn]).sort(),[[1,'ಮಯೂರ'],[2,'ಹುಲಿ']],'the latest approved name wins; non-Kannada and unknown targets are ignored')
  assert.equal(out.leaders[0].name,'Asha')
  assert.equal(out.leaders[0].species,2)
  assert.ok(out.leaders.every(p=>!('id' in p)&&!('email' in p)))
  const app=await readFile(new URL('../server/app.js',import.meta.url),'utf8')
  assert.match(app,/\/api\/species\/community/)
  assert.match(app,/connect-src 'self' https:\/\/tile\.openstreetmap\.org https:\/\/api\.gbif\.org/)
})

test('globe helpers decode countries, project the sphere and build arcs',async()=>{
  const { decodeCountries, greatCircle, project, aggregateRoutes, KARNATAKA }=await import('../src/globe.js')
  const topo=JSON.parse(await readFile(new URL('../src/data/species/world-110m.json',import.meta.url),'utf8'))
  const countries=decodeCountries(topo)
  const india=countries.find(c=>c.id===356),russia=countries.find(c=>c.id===643)
  assert.ok(countries.length>150&&india.polygons.length>0)
  assert.ok(india.centroid[0]>70&&india.centroid[0]<90&&india.centroid[1]>15&&india.centroid[1]<30,'India centroid')
  assert.ok(russia.centroid[1]>50,'Russia centroid')
  const centre=project(KARNATAKA,KARNATAKA)
  assert.ok(Math.abs(centre.x)<1e-9&&Math.abs(centre.y)<1e-9&&centre.visible)
  assert.ok(!project([KARNATAKA[0]+180,-KARNATAKA[1]],KARNATAKA).visible,'the antipode is hidden')
  const arc=greatCircle([0,0],[90,0],10)
  assert.equal(arc.length,11);assert.ok(Math.abs(arc[5][0]-45)<1e-6&&Math.abs(arc[5][1])<1e-6)
  assert.deepEqual(aggregateRoutes([{gbifKey:1},{gbifKey:2}],{1:{countries:[{id:643},{id:496}]},2:{countries:[{id:643}]}}),[{id:643,weight:2},{id:496,weight:1}])
})
