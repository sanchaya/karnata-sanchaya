import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { geographyNatureFacts, geographyNatureHighlights, geographyNatureRegions, geographyNatureSources, geographyNatureThemes, geographyProtectedAreas } from '../src/data/geography-nature.js'
import { appendPublicAttribution, PUBLIC_DATA_ATTRIBUTION, publicRecordAttribution } from '../src/data/public-attribution.js'

const appSource=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8')
const serverSource=await readFile(new URL('../server/app.js',import.meta.url),'utf8')
const exportSource=await readFile(new URL('../scripts/generate-open-datasets.mjs',import.meta.url),'utf8')
const resourcesSource=await readFile(new URL('../src/ResourcesCollaborations.jsx',import.meta.url),'utf8')
const seoSource=await readFile(new URL('../scripts/generate-seo.mjs',import.meta.url),'utf8')
const mainSource=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8')
const geographyStyles=await readFile(new URL('../src/geography-nature.css',import.meta.url),'utf8')
const geographyExplorer=await readFile(new URL('../src/GeographyNatureExplorer.jsx',import.meta.url),'utf8')

test('geography and nature page is bilingual, mapped and fully sourced',()=>{
  assert.ok(geographyNatureFacts.length>=4)
  assert.ok(geographyNatureRegions.length>=4)
  assert.ok(geographyNatureHighlights.length>=6)
  assert.ok(geographyNatureThemes.length>=3)
  assert.ok(geographyProtectedAreas.length>=20)
  const sourceIds=new Set(geographyNatureSources.map(source=>source.id))
  for(const record of [...geographyNatureFacts,...geographyNatureRegions,...geographyNatureHighlights,...geographyNatureThemes]){
    if(record.name)assert.ok(record.name.en&&record.name.kn,`${record.id} needs bilingual name`)
    for(const sourceId of record.sourceIds||[record.sourceId])assert.ok(sourceIds.has(sourceId),`${record.id||record.value} has unknown source ${sourceId}`)
  }
  for(const point of geographyNatureHighlights)assert.ok(point.coords.length===2&&point.coords.every(Number.isFinite),`${point.id} needs valid coordinates`)
  for(const area of geographyProtectedAreas){
    assert.ok(area.name.en&&area.name.kn,`${area.id} needs bilingual name`)
    assert.ok(area.coords.length===2&&area.coords.every(Number.isFinite),`${area.id} needs valid coordinates`)
    assert.equal(area.locationPrecision,'approximate')
    assert.equal(area.boundaryStatus,'authority-viewer')
    assert.ok(area.sourceIds.includes('geo-bhuvan-karnataka-forest'),`${area.id} needs the authority boundary viewer`)
    if(area.referenceBounds){
      assert.equal(area.referenceBounds.length,2,`${area.id} needs a south-west and north-east source extent`)
      assert.ok(area.referenceBounds.flat().every(Number.isFinite),`${area.id} has invalid source bounds`)
    }
    for(const sourceId of area.sourceIds)assert.ok(sourceIds.has(sourceId),`${area.id} has unknown source ${sourceId}`)
  }
  for(const type of ['ramsar-wetland','biosphere-reserve','reserved-forest'])assert.ok(geographyProtectedAreas.some(area=>area.type===type),`${type} layer is missing`)
  assert.match(appSource,/view==='geography'/)
  assert.match(appSource,/GeographyNatureExplorer/)
  for(const label of ['National parks','Tiger reserves','Wildlife sanctuaries','Bird sanctuaries'])assert.match(geographyExplorer,new RegExp(label))
  for(const label of ['Ramsar wetlands','Biosphere reserve','Reserved forest'])assert.match(geographyExplorer,new RegExp(label))
  for(const label of ['Modern','Terrain','Historical'])assert.match(geographyExplorer,new RegExp(label))
  assert.match(geographyExplorer,/not legal boundaries/)
  assert.match(geographyStyles,/\.nature-page header\{height:auto;min-height:0/)
  assert.match(geographyStyles,/\.nature-map\{position:relative;min-height:520px/)
  assert.match(geographyStyles,/\.nature-source-links a\{[^}]*overflow-wrap:anywhere/)
})

test('public data carries canonical attribution and live scraping controls',()=>{
  assert.equal(PUBLIC_DATA_ATTRIBUTION.canonicalUrl,'https://karnata.sanchaya.net')
  assert.equal(PUBLIC_DATA_ATTRIBUTION.originToken,'kha:karnata.sanchaya.net')
  assert.match(exportSource,/payloadSha256/)
  assert.match(exportSource,/PUBLIC_DATA_ATTRIBUTION/)
  assert.match(exportSource,/_attribution:publicRecordAttribution/)
  assert.match(resourcesSource,/PUBLIC_DATA_ATTRIBUTION/)
  assert.match(resourcesSource,/_attribution:publicRecordAttribution/)
  assert.match(mainSource,/appendPublicAttribution/)
  assert.match(serverSource,/rateLimit\('public-dataset'/)
  assert.match(serverSource,/X-Karnata-Origin/)
  assert.match(serverSource,/X-Karnata-Payload-SHA256/)
  assert.match(serverSource,/Cross-Origin-Resource-Policy/)
  for(const crawler of ['GPTBot','CCBot','ClaudeBot','Google-Extended','Bytespider'])assert.match(seoSource,new RegExp(crawler))
})

test('record and clipboard citations vary reproducibly while retaining the canonical source',()=>{
  const records=Array.from({length:20},(_,index)=>({id:`record-${index}`}))
  const citations=records.map(record=>publicRecordAttribution(record,'test'))
  assert.ok(new Set(citations.map(value=>value.replace(/kha:[a-z0-9]+/,'TOKEN'))).size>1)
  assert.equal(publicRecordAttribution(records[0],'test'),publicRecordAttribution(records[0],'test'))
  for(const citation of citations)assert.match(citation,/https:\/\/karnata\.sanchaya\.net/)
  assert.match(appendPublicAttribution('Selected historical text','page'),/^Selected historical text[\s\S]+karnata\.sanchaya\.net/)
})
