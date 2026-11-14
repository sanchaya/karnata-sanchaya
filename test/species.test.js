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
  const world=JSON.parse(await readFile(new URL('../src/data/species/world-countries.json',import.meta.url),'utf8'))
  const countries=decodeCountries(world)
  const india=countries.find(c=>c.id===356),russia=countries.find(c=>c.id===643)
  assert.ok(countries.length>200&&india.polygons.length>0)
  assert.ok(india.centroid[0]>70&&india.centroid[0]<90&&india.centroid[1]>15&&india.centroid[1]<30,'India centroid')
  assert.ok(russia.centroid[1]>50,'Russia centroid')
  const centre=project(KARNATAKA,KARNATAKA)
  assert.ok(Math.abs(centre.x)<1e-9&&Math.abs(centre.y)<1e-9&&centre.visible)
  assert.ok(!project([KARNATAKA[0]+180,-KARNATAKA[1]],KARNATAKA).visible,'the antipode is hidden')
  const arc=greatCircle([0,0],[90,0],10)
  assert.equal(arc.length,11);assert.ok(Math.abs(arc[5][0]-45)<1e-6&&Math.abs(arc[5][1])<1e-6)
  assert.deepEqual(aggregateRoutes([{gbifKey:1},{gbifKey:2}],{1:{countries:[{id:643},{id:496}]},2:{countries:[{id:643}]}}),[{id:643,weight:2},{id:496,weight:1}])
})

test("the globe draws India as on the official map of India",async()=>{
  const { decodeCountries }=await import('../src/globe.js')
  const world=JSON.parse(await readFile(new URL('../src/data/species/world-countries.json',import.meta.url),'utf8'))
  const india=decodeCountries(world).find(c=>c.id===356)
  const inside=(ring,[x,y])=>{let c=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c}
  const covers=pt=>india.polygons.some(poly=>inside(poly[0],pt)&&!poly.slice(1).some(h=>inside(h,pt)))
  for(const [name,pt] of [['Srinagar (Jammu and Kashmir)',[74.8,34.1]],['Leh (Ladakh)',[77.6,34.2]],['Gilgit (Gilgit-Baltistan, J&K)',[74.3,35.9]],['Muzaffarabad (Pakistan-administered J&K)',[73.5,34.4]],['Aksai Chin (Ladakh)',[79.1,35.0]],['Skardu (Gilgit-Baltistan, Ladakh)',[75.6,35.3]],['Bengaluru',[77.6,12.97]],['Port Blair',[92.7,11.7]]])
    assert.ok(covers(pt),`${name} should be inside India`)
  assert.ok(!covers([73.0,33.7]),'Islamabad is not in India')
  const maxLat=Math.max(...india.polygons.flatMap(p=>p[0].map(c=>c[1])))
  assert.ok(maxLat>36.9,'India reaches the northern tip of Gilgit-Baltistan')
})

test('visit tracking hashes ids, ignores bots and bad pings, and counts live sessions',async()=>{
  const { isBot, LiveSessions, parsePing, visitorHash }=await import('../server/visits.js')
  const id='0f8fad5b-d9cb-469f-a165-70867728950e'
  assert.equal(visitorHash('k',id),visitorHash('k',id))
  assert.notEqual(visitorHash('k',id),visitorHash('other',id))
  assert.equal(visitorHash('k',id).length,32);assert.ok(!visitorHash('k',id).includes('0f8fad5b'))
  assert.ok(isBot('Googlebot/2.1')&&isBot('')&&!isBot('Mozilla/5.0 (Macintosh) Safari/605'))
  assert.deepEqual(parsePing({v:id,s:id,view:'species',kind:'view'}),{v:id,s:id,view:'species',kind:'view'})
  for(const bad of [null,{},{v:'x',s:id,view:'a',kind:'view'},{v:id,s:id,view:'A B',kind:'view'},{v:id,s:id,view:'a',kind:'hack'}])assert.equal(parsePing(bad),null)
  const live=new LiveSessions(120000),t0=1000000
  assert.equal(live.touch('s1','v1','species',t0),true)
  assert.equal(live.touch('s1','v1','species',t0+60000),false)
  assert.equal(live.touch('s2','v1','atlas',t0+60000),true)
  assert.deepEqual(live.snapshot(t0+60000),{sessions:2,visitors:1,byView:{species:1,atlas:1}})
  assert.equal(live.snapshot(t0+400000).sessions,0)
  assert.equal(live.touch('s1','v1','species',t0+400000),true,'a session silent for over 2 minutes starts a new visit')
  const migration=await readFile(new URL('../server/migrations/016_site_visits.sql',import.meta.url),'utf8')
  assert.match(migration,/site_visitors/);assert.doesNotMatch(migration,/^\s*(ip|ip_address|user_agent)\s/im,'no IP or user-agent column')
})

test("what's new items are bilingual, unique and tracked per page",async()=>{
  const { WHATS_NEW, unseenItems, idsVisited }=await import('../src/whats-new.js')
  assert.equal(new Set(WHATS_NEW.map(i=>i.id)).size,WHATS_NEW.length)
  for(const item of WHATS_NEW){assert.ok(item.kn[0]&&item.kn[1]&&item.en[0]&&item.en[1]&&item.view&&item.href,item.id)}
  assert.equal(unseenItems([]).length,WHATS_NEW.length)
  assert.equal(unseenItems(WHATS_NEW.map(i=>i.id)).length,0)
  assert.ok(idsVisited('species').includes('species-page')&&!idsVisited('aata-paata','').includes('bird-quiz'))
  assert.ok(idsVisited('aata-paata','?game=bird&puzzle=2026-11-14').includes('bird-quiz'))
})

test('month ranges read naturally and the origin filter finds birds seen in a country',async()=>{
  const { filterSpecies, monthRange }=await import('../src/species-normalize.js')
  const names=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  assert.equal(monthRange([10,11,12,1,2,3],names),'Oct–Mar')
  assert.equal(monthRange([3,4,9,10],names),'Mar–Apr, Sep–Oct')
  assert.equal(monthRange([5],names),'May')
  assert.equal(monthRange([],names),'')
  const fly={1:{countries:[{id:643}]},2:{countries:[{id:496}]}}
  const list=[{gbifKey:1,id:'a',name:{},group:'bird'},{gbifKey:2,id:'b',name:{},group:'bird'}]
  assert.deepEqual(filterSpecies(list,{origin:643,flyways:fly}).map(s=>s.id),['a'])
  const flyways=JSON.parse(await readFile(new URL('../src/data/species/species-flyways.json',import.meta.url),'utf8')).flyways
  for(const entry of Object.values(flyways)){assert.ok(Array.isArray(entry.countries)&&Array.isArray(entry.states));assert.ok(!entry.states.some(s=>s.name==='Karnataka'))}
})

test('migration page logic: filters, origin counts and globe labels',async()=>{
  const { birdName, filterMigrants, globeLabels, migrants, originCounts }=await import('../src/migration.js')
  const flyways={1:{countries:[{id:643},{id:496}]},2:{countries:[{id:643}]},3:{countries:[]}}
  const mk=(gbifKey,en,kn,months,pattern='winter-visitor',group='bird',migratory=true)=>({gbifKey,group,name:{en,kn},scientificName:`Sp ${gbifKey}`,seasonality:{migratory,months,pattern}})
  const all=[mk(1,'Pintail','ಬಾತು',[11,12,1]),mk(2,'Warbler','',[10,11],'passage-or-local-movement'),mk(3,'NoData','',[1]),mk(4,'Resident','',[1],'resident','bird',false),mk(5,'Tree','',[1],'winter-visitor','plant')]
  const birds=migrants(all,flyways)
  assert.deepEqual(birds.map(b=>b.gbifKey),[1,2])
  assert.deepEqual(filterMigrants(birds,{month:12,flyways}).map(b=>b.gbifKey),[1])
  assert.deepEqual(filterMigrants(birds,{pattern:'passage-or-local-movement',flyways}).map(b=>b.gbifKey),[2])
  assert.deepEqual(filterMigrants(birds,{country:496,flyways}).map(b=>b.gbifKey),[1])
  assert.deepEqual(filterMigrants(birds,{query:'ಬಾತು',flyways}).map(b=>b.gbifKey),[1])
  assert.deepEqual(originCounts(birds,flyways),[{id:643,weight:2},{id:496,weight:1}])
  const name=id=>({643:'Russia',496:'Mongolia'}[id])
  assert.equal(birdName(birds[1],'kn'),'Warbler');assert.equal(birdName(birds[0],'kn'),'ಬಾತು');assert.equal(birdName(birds[0],'en'),'Pintail')
  assert.deepEqual(globeLabels({birds,flyways,locale:'en',nameOfCountry:name}),{643:'Russia · 2',496:'Mongolia · 1'})
  assert.deepEqual(globeLabels({birds,flyways,locale:'en',nameOfCountry:name,selectedCountry:643})[643],['Russia · 2','Pintail','Warbler'])
  assert.deepEqual(globeLabels({birds,flyways,locale:'en',nameOfCountry:name,selectedBird:birds[0]}),{643:['Pintail','Russia'],496:['Pintail','Mongolia']})
  const real=JSON.parse(await readFile(new URL('../src/data/species/species-flyways.json',import.meta.url),'utf8')).flyways
  assert.ok(migrants(data.species,real).length>150,'most migratory birds have an origin')
})

test('the species quiz names the kind of species instead of saying "species"',async()=>{
  const { buildBirdRounds, quizTitle, roundQuestion, SPECIES_TYPES }=await import('../src/aata-bird.js')
  const { applyNameSources, applyReviewedNames }=await import('../src/species-normalize.js')
  assert.equal(quizTitle('bird','kn'),'ಯಾವ ಹಕ್ಕಿ?');assert.equal(quizTitle('plant','kn'),'ಯಾವ ಸಸ್ಯ?');assert.equal(quizTitle('mammal','kn'),'ಯಾವ ಪ್ರಾಣಿ?')
  assert.equal(quizTitle('bird','en'),'Name that bird');assert.equal(quizTitle('','en'),'Name that species');assert.equal(quizTitle('','kn'),'ಯಾವ ಜೀವಿ?')
  assert.equal(roundQuestion('reptile','kn'),'ಇದು ಯಾವ ಸರೀಸೃಪ?');assert.equal(roundQuestion('insect','en'),'Which insect is this?')
  for(const g of Object.keys(SPECIES_TYPES)){assert.ok(!quizTitle(g,'kn').includes('ಜೀವಿ')&&!quizTitle(g,'en').includes('species'),g)}
  const lists=JSON.parse(await readFile(new URL('../src/data/species/kn-name-sources.json',import.meta.url),'utf8')).sources
  const images=JSON.parse(await readFile(new URL('../src/data/species/species-images.json',import.meta.url),'utf8')).images
  const species=applyReviewedNames(applyNameSources(data.species,lists),{})
  for(const group of ['bird','plant']){
    const rounds=buildBirdRounds(species,images,'en','2026-11-14',5,group)
    assert.ok(rounds.length>=3&&rounds.every(r=>r.group===group&&r.options.length===4),group)
  }
  assert.ok(new Set(buildBirdRounds(species,images,'en','2026-11-14',40).map(r=>r.group)).size>1,'mixed rounds span types')
})

test('the sign-up invitation waits, respects members and snoozes',async()=>{
  const { shouldShowJoin, joinUrl, JOIN_MIN_VIEWS }=await import('../src/join-prompt.js')
  const base={views:JOIN_MIN_VIEWS,dismissedAt:null,signedIn:false,view:'species',now:1e12}
  assert.equal(shouldShowJoin(base),true)
  assert.equal(shouldShowJoin({...base,views:JOIN_MIN_VIEWS-1}),false,'not before the reader has looked around')
  assert.equal(shouldShowJoin({...base,signedIn:true}),false,'never to members')
  assert.equal(shouldShowJoin({...base,signedIn:null}),true,'unknown (static edition) still invites')
  for(const view of ['contribute','profile','reviews','evidence'])assert.equal(shouldShowJoin({...base,view}),false,view)
  assert.equal(shouldShowJoin({...base,dismissedAt:base.now-86400000*5}),false,'snoozed after "Not now"')
  assert.equal(shouldShowJoin({...base,dismissedAt:base.now-86400000*31}),true,'invites again after 30 days')
  assert.equal(joinUrl(false),'#contribute');assert.equal(joinUrl(true),'https://karnata.sanchaya.net/#contribute')
})

test('the Leaflet maps that can zoom out to Kashmir carry the official India boundary layer',async()=>{
  const data=JSON.parse(await readFile(new URL('../public/india-official-boundary.geojson',import.meta.url),'utf8'))
  const claimed=data.features.find(f=>f.properties.kind==='claimed'),outline=data.features.find(f=>f.properties.kind==='outline')
  assert.ok(claimed&&outline)
  const lats=g=>JSON.stringify(g.coordinates).match(/-?\d+\.\d+/g).map(Number)
  const flat=JSON.stringify(claimed.geometry.coordinates).replace(/[\[\]]/g,'').split(',').map(Number)
  const xs=flat.filter((_,i)=>i%2===0),ys=flat.filter((_,i)=>i%2===1)
  assert.ok(Math.min(...xs)<73&&Math.max(...xs)>80&&Math.max(...ys)>37,'the claimed area spans Pakistan-administered Kashmir, Gilgit-Baltistan and Aksai Chin')
  assert.ok(lats(outline.geometry).length>200)
  for(const file of ['App','GlobalRelationsExplorer','DynastyMapPage','FreedomMovementExplorer','IndiaResearchExplorer','LanguageTimeline','PeopleExplorer','ScriptEvolutionExplorer','DistrictHistoryExplorer']){
    const source=await readFile(new URL(`../src/${file}.jsx`,import.meta.url),'utf8')
    assert.match(source,/import IndiaBoundary from '\.\/IndiaBoundary'/,file)
    assert.match(source,/<IndiaBoundary\/>/,file)
  }
})
