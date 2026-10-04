import test from 'node:test'
import assert from 'node:assert/strict'
import { canonicalGeoJSON, importCanonical, stageSourceRecords, validateCanonicalDataset } from '../src/data/canonical/pipeline.js'

const source={id:'ec:source:test',publication:'Epigraphia Carnatica',url:'https://example.org/ec'}
const record={ID:'TEST-1',Name:'Pipeline test','District':'Test district','Taluk':'Test taluk','GPS/location':'12.5, 77.5','Dynasty (multiple)':'Test dynasty','Language (multiple)':'Kannada; Sanskrit','Period from':900,'Period to':950,'Date certainty':'approximate','Location precision':'exact','Inscription number':'1','Source URL':'https://example.org/scan','Review status':'draft',fixture:true}

test('staging preserves original values and canonical import creates namespaced entities',()=>{
  const staged=stageSourceRecords({corpus:'EC',source,records:[record]})
  assert.deepEqual(staged[0].source_record.raw,record)
  const dataset=importCanonical(staged)
  assert.match(dataset.entities.inscriptions[0].id,/^ec:/)
  assert.equal(dataset.entities.inscriptions[0].normalized_metadata.languages.length,2)
  assert.equal(validateCanonicalDataset(dataset).filter(issue=>issue.severity==='error').length,0)
})

test('GeoJSON is derived and fixture records stay out of public output',()=>{
  const dataset=importCanonical(stageSourceRecords({corpus:'EC',source,records:[record]}))
  assert.equal(canonicalGeoJSON(dataset).features.length,0)
  assert.equal(canonicalGeoJSON(dataset,{includeFixtures:true}).features[0].geometry.coordinates[0],77.5)
})

test('validation catches coordinates, dates, provenance, URLs and relationships',()=>{
  const dataset=importCanonical(stageSourceRecords({corpus:'EC',source,records:[record]}))
  const item=dataset.entities.inscriptions[0]
  item.normalized_metadata.location.coordinates=[999,999]
  item.normalized_metadata.date={from:1000,to:900,certainty:'exact'}
  item.normalized_metadata.dynasty_ids=['dynasty:missing']
  item.provenance.source_publication=''
  item.provenance.source_url='bad url'
  const messages=validateCanonicalDataset(dataset).map(issue=>issue.message)
  assert.ok(messages.some(value=>value.includes('Invalid coordinates')))
  assert.ok(messages.some(value=>value.includes('Impossible date range')))
  assert.ok(messages.some(value=>value.includes('Broken relationship')))
  assert.ok(messages.some(value=>value.includes('Missing provenance')))
  assert.ok(messages.some(value=>value.includes('Malformed URL')))
})

test('validation catches duplicate corpus locators',()=>{
  const dataset=importCanonical(stageSourceRecords({corpus:'EC',source,records:[record,{...record,ID:'TEST-2'}]}))
  assert.ok(validateCanonicalDataset(dataset).some(issue=>issue.message.includes('Duplicate inscription locator')))
})
