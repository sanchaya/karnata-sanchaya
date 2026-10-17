import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData } from '../src/data/atlas.js'

const sites=atlasData.heritageAudits.flatMap(audit=>audit.prioritySites.map(site=>({...site,district:audit.district.en})))

test('district heritage covers institutions, parks and curiosity categories',()=>{
  for(const category of ['museum','archive','library','palace','fort','historic-park','historic-market','railway-heritage','engineering-heritage','industrial-heritage','maritime-heritage','educational-heritage','scientific-heritage','cultural-venue','memorial-heritage','historic-urban-precinct']){
    assert.ok(sites.some(site=>site.category===category),`missing ${category} heritage category`)
  }
})

test('historic parks retain their authority history without overstating map precision',()=>{
  const parks=sites.filter(site=>site.id.startsWith('candidate-park-'))
  assert.equal(parks.length,4)
  for(const park of parks){
    assert.equal(park.category,'historic-park')
    assert.equal(park.verification.coordinates.precision,'approximate')
    assert.ok(park.verification.siteCitations[0]?.url)
    assert.match(park.verification.verificationNote.en,/history|established|former|garden|landscape/i)
  }
})

test('cultural institution map points retain provenance and review gates',()=>{
  const additions=sites.filter(site=>site.id.startsWith('candidate-institution-'))
  assert.equal(additions.length,25)
  for(const site of additions){
    assert.equal(site.verification.verificationStatus,'identified')
    assert.equal(site.verification.coordinates.precision,'approximate')
    assert.ok(site.verification.siteCitations[0]?.url)
    assert.ok(site.verification.verificationNote.en.length>40)
    assert.ok(site.verification.verificationChecks.currentCondition.status!=='verified')
  }
})

test('curiosity records remain sourced and review-gated',()=>{
  const records=sites.filter(site=>site.id.startsWith('candidate-curiosity-'))
  assert.equal(records.length,10)
  for(const record of records){
    assert.equal(record.verification.verificationStatus,'identified')
    assert.equal(record.verification.coordinates.precision,'approximate')
    assert.ok(record.verification.siteCitations[0]?.url)
    assert.ok(record.verification.verificationNote.en.length>80)
  }
})

test('new authority sources remain available to admin and repository sync',()=>{
  const ids=new Set(atlasData.sources.map(source=>source.id))
  for(const id of ['src-ministry-culture-india-museum-directory','src-cag-asi-site-museums-karnataka','src-karnataka-state-archives-rules','src-karnataka-public-libraries-act','src-bengaluru-urban-cubbon-park','src-karnataka-tourism-lalbagh','src-bengaluru-urban-freedom-park','src-karnataka-tourism-brindavan-gardens','src-karnataka-tourism-mysuru-rail-museum','src-karnataka-tourism-mysuru-destination','src-karnataka-tourism-chitradurga','src-karnataka-tourism-gokak-falls','src-karnataka-tourism-surathkal-lighthouse','src-iisc-history','src-university-mysore-history','src-university-mysore-library','src-karnataka-tourism-rangayana','src-karnataka-tourism-national-military-memorial','src-mysuru-district-urban-history']){
    assert.ok(ids.has(id),`missing ${id}`)
  }
})
