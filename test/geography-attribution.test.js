import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { geographyNatureFacts, geographyNatureHighlights, geographyNatureRegions, geographyNatureSources, geographyNatureThemes } from '../src/data/geography-nature.js'
import { appendPublicAttribution, PUBLIC_DATA_ATTRIBUTION, publicRecordAttribution } from '../src/data/public-attribution.js'

const appSource=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8')
const serverSource=await readFile(new URL('../server/app.js',import.meta.url),'utf8')
const exportSource=await readFile(new URL('../scripts/generate-open-datasets.mjs',import.meta.url),'utf8')
const resourcesSource=await readFile(new URL('../src/ResourcesCollaborations.jsx',import.meta.url),'utf8')
const seoSource=await readFile(new URL('../scripts/generate-seo.mjs',import.meta.url),'utf8')
const mainSource=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8')

test('geography and nature page is bilingual, mapped and fully sourced',()=>{
  assert.ok(geographyNatureFacts.length>=4)
  assert.ok(geographyNatureRegions.length>=4)
  assert.ok(geographyNatureHighlights.length>=6)
  assert.ok(geographyNatureThemes.length>=3)
  const sourceIds=new Set(geographyNatureSources.map(source=>source.id))
  for(const record of [...geographyNatureFacts,...geographyNatureRegions,...geographyNatureHighlights,...geographyNatureThemes]){
    if(record.name)assert.ok(record.name.en&&record.name.kn,`${record.id} needs bilingual name`)
    for(const sourceId of record.sourceIds||[record.sourceId])assert.ok(sourceIds.has(sourceId),`${record.id||record.value} has unknown source ${sourceId}`)
  }
  for(const point of geographyNatureHighlights)assert.ok(point.coords.length===2&&point.coords.every(Number.isFinite),`${point.id} needs valid coordinates`)
  assert.match(appSource,/view==='geography'/)
  assert.match(appSource,/GeographyNatureExplorer/)
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
