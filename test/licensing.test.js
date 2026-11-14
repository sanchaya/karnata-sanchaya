import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { DATA_AREAS, DATA_WANTED } from '../src/data/data-wanted.js'
import { seoPages } from '../src/seo-pages.js'

const read=file=>readFile(new URL(`../${file}`,import.meta.url),'utf8')

test('the licensing document states the non-commercial terms and covers every kind of data',async()=>{
  const doc=await read('LICENSING.md')
  assert.match(doc,/Non-commercial use only/);assert.match(doc,/may not sell it|You may not sell/);assert.match(doc,/info@sanchifoundation\.org/)
  assert.match(doc,/PolyForm Noncommercial License 1\.0\.0/);assert.match(doc,/CC BY-NC-SA 4\.0/)
  for(const topic of ['Natural Earth','OpenStreetMap','ODbL','GBIF','eBird','Wikidata','Wikimedia Commons','Internet Archive','BharatRajya','Dictionary of Martyrs','NDSAP','Fonts Sanchaya','react-leaflet','jquery.ime','Historical Atlas of Karnataka','Open items','Data we still need','Trademarks'])
    assert.ok(doc.includes(topic),`LICENSING.md should cover ${topic}`)
  assert.match(doc,/does not take away[\s>]+rights you already have/,'the carve-out for third-party sources')
  assert.match(doc,/docs\/data-wanted\.md/)
})

test('the licence texts are in the repository and the metadata points to them',async()=>{
  assert.match(await read('LICENSES/PolyForm-Noncommercial-1.0.0.md'),/PolyForm Noncommercial License 1\.0\.0/)
  assert.match(await read('LICENSES/CC-BY-NC-SA-4.0.txt'),/Attribution-NonCommercial-ShareAlike 4\.0 International/)
  assert.equal(JSON.parse(await read('package.json')).license,'SEE LICENSE IN LICENSING.md')
  const readme=await read('README.md')
  assert.match(readme,/non-commercial use only/i);assert.match(readme,/LICENSING\.md/);assert.match(readme,/docs\/data-wanted\.md/)
})

test('production dependency licences listed in LICENSING.md match the installed packages',async()=>{
  const doc=await read('LICENSING.md'),pkg=JSON.parse(await read('package.json'))
  for(const name of Object.keys(pkg.dependencies)){
    const meta=JSON.parse(await read(`node_modules/${name}/package.json`)),licence=typeof meta.license==='string'?meta.license:JSON.stringify(meta.license)
    const mentioned=doc.includes(name.replace('@vitejs/','').replace('plugin-react','@vitejs/plugin-react'))||doc.includes(name)
    assert.ok(mentioned,`${name} should be listed`)
    if(['react-leaflet','jquery.ime','mariadb','leaflet'].includes(name))assert.ok(doc.includes(licence.replace(/[()]/g,'').replace(' OR ',' OR ').split(' ')[0])||doc.toLowerCase().includes(licence.toLowerCase().split('-')[0]),`${name} licence ${licence} should be shown`)
  }
})

test('the Data wanted list is bilingual, in step with docs/data-wanted.md and wired into the portal',async()=>{
  const doc=await read('docs/data-wanted.md'),areas=new Set(DATA_AREAS.map(([id])=>id))
  assert.ok(DATA_WANTED.length>=15);assert.equal(new Set(DATA_WANTED.map(i=>i.id)).size,DATA_WANTED.length)
  for(const item of DATA_WANTED){
    assert.ok(areas.has(item.area)&&['high','normal'].includes(item.priority),item.id)
    for(const key of ['title','why','need'])assert.ok(item[key].kn&&item[key].en,`${item.id} ${key}`)
    assert.ok(item.holders,item.id);assert.ok(doc.includes(`**${item.id}**`),`docs/data-wanted.md is missing ${item.id}`)
  }
  const listed=[...doc.matchAll(/^- \*\*([a-z-]+)\*\*/gm)].map(m=>m[1])
  assert.deepEqual([...listed].sort(),DATA_WANTED.map(i=>i.id).sort(),'the doc and the portal list the same items')
  const app=await read('src/App.jsx')
  assert.match(app,/const DataWanted=lazy/);assert.match(app,/view==='data-wanted'/)
  assert.equal((app.match(/\['data-wanted'/g)||[]).length,1,'one menu entry')
  assert.match(app,/'data-wanted':'community'/);assert.ok(seoPages['data-wanted'])
  const page=await read('src/DataWanted.jsx')
  assert.match(page,/contributeType:'source',contributeAction:'create'/,'"I know a source" opens the new-source form')
  assert.match(page,/mailto:/);assert.match(page,/LICENSING\.md/)
  assert.match(app,/Non-commercial use only · Licence/,'the footer shows the non-commercial notice')
})

test('the Licences page lists every kind of data, in step with LICENSING.md, and is wired into the portal',async()=>{
  const { LICENCES, LICENCE_AREAS, COMMERCIAL_LABELS }=await import('../src/data/licences.js')
  const doc=await read('LICENSING.md'),areas=new Set(LICENCE_AREAS.map(([id])=>id))
  assert.ok(LICENCES.length>=25);assert.equal(new Set(LICENCES.map(i=>i.id)).size,LICENCES.length)
  for(const item of LICENCES){
    assert.ok(areas.has(item.area)&&COMMERCIAL_LABELS[item.commercial]&&['data','pointer','display'].includes(item.used),item.id)
    assert.ok(item.title.en&&item.title.kn&&item.obligation.en&&item.obligation.kn&&item.licence&&item.source&&item.where,`${item.id} needs every field`)
    assert.match(doc,/^/m);assert.ok(/^\d+$/.test(item.ref)?doc.includes(`## ${item.ref}. `):doc.includes(`### ${item.ref} `),`${item.id}: LICENSING.md has no section ${item.ref}`)
  }
  for(const area of areas)assert.ok(LICENCES.some(i=>i.area===area),`${area} has no entries`)
  // The project's own terms are non-commercial; open-licence sources are allowed under their own terms.
  assert.equal(LICENCES.find(i=>i.id==='software').commercial,'no');assert.equal(LICENCES.find(i=>i.id==='original-data').commercial,'no')
  assert.equal(LICENCES.find(i=>i.id==='rivers').commercial,'source');assert.match(LICENCES.find(i=>i.id==='rivers').licence,/ODbL/)
  assert.equal(LICENCES.find(i=>i.id==='logos').commercial,'reserved')
  for(const id of ['wikidata-people','natural-earth','gbif-ebird','commons-photos'])assert.equal(LICENCES.find(i=>i.id===id).commercial,'source',id)
  for(const id of ['fonts','states','bengaluru-kml','census-atlas'])assert.equal(LICENCES.find(i=>i.id===id).commercial,'check',`${id} stays "check" until confirmed`)
  const app=await read('src/App.jsx')
  assert.match(app,/const Licences=lazy/);assert.match(app,/view==='licenses'/);assert.match(app,/licenses:'community'/)
  assert.equal((app.match(/\['licenses'/g)||[]).length,1,'one menu entry')
  assert.match(app,/<a href="#licenses">\{locale==='kn'\?'ವಾಣಿಜ್ಯೇತರ ಬಳಕೆಗೆ ಮಾತ್ರ · ಪರವಾನಗಿ':'Non-commercial use only · Licence'\}<\/a>/,'the footer opens the portal page')
  const { seoPages }=await import('../src/seo-pages.js');assert.ok(seoPages.licenses)
  const page=await read('src/Licences.jsx')
  assert.match(page,/Non-commercial use only/);assert.match(page,/info@sanchifoundation\.org/);assert.match(page,/LICENSING\.md/)
})
