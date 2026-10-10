import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyPublication, extractDate, extractInscriptionRecords, extractLinks, unresolvedPageLead } from '../scripts/lib/whatisindia-parser.mjs'
import { importCanonical, stageSourceRecords, validateCanonicalDataset } from '../src/data/canonical/pipeline.js'

const numberedHtml=`<!doctype html><html><head><title>South Indian Inscriptions Volume 20</title></head><body>
<a href="https://www.whatisindia.com/inscriptions/south_indian_inscriptions/volume_20/another.html">Next</a><a href="https://example.org/elsewhere">External</a>
<a href="Information.html">Broken root navigation</a><a href="relative-record.html">Relative corpus record</a>
<h1>BOMBAY - KARNATAKA INSCRIPTIONS</h1>
<p>No.283 (Page No 322)</p><p>(B.K.No.49 of 1938-39)</p>
<p>ALGUR JAMKHANDI TALUK, BIJAPUR DISTRICT</p><p>A.D.1017-18</p>
<p>This inscription records a grant. The source spelling is preserved.</p>
<p>No.284 (Page No 324)</p><p>HULI RAMDURG TALUK, BELGAUM DISTRICT</p>
<p>11th century A.D.</p><p>This is another sufficiently long inscription description for splitting.</p>
</body></html>`

test('WhatIsIndia parser extracts numbered records, locations, dates and underlying publication',()=>{
  const url='https://www.whatisindia.com/inscriptions/south_indian_inscriptions/volume_20/miscellaneous.html'
  const parsed=extractInscriptionRecords({html:numberedHtml,url,retrievedAt:'2026-10-09'})
  assert.equal(parsed.records.length,2)
  assert.equal(parsed.records[0]['Source publication'],'South Indian Inscriptions')
  assert.equal(parsed.records[0].Volume,'20')
  assert.equal(parsed.records[0]['Inscription number'],'283')
  assert.equal(parsed.records[0].District,'BIJAPUR')
  assert.equal(parsed.records[0]['Period from'],1017)
  assert.equal(parsed.records[0]['Period to'],1018)
  assert.equal(parsed.records[0]['Review status'],'needs-review')
  assert.equal(extractLinks(numberedHtml,url)[0],'https://www.whatisindia.com/inscriptions/south_indian_inscriptions/volume_20/another.html')
  assert.ok(extractLinks(numberedHtml,url).some(link=>link.endsWith('/volume_20/relative-record.html')))
  assert.ok(!extractLinks(numberedHtml,url).some(link=>link.endsWith('/volume_20/Information.html')))
})

test('page-level articles remain explicit unresolved leads instead of fabricated item records',()=>{
  const html='<html><head><title>An Unnumbered Copper-plate Inscription</title></head><body><h1>An Unnumbered Copper-plate Inscription</h1><p>'+('The inscription requires edition-level review. '.repeat(20))+'</p></body></html>'
  const lead=unresolvedPageLead({html,url:'https://www.whatisindia.com/inscriptions/epigraphica_indica/vol8_1905-1906/kielhorn21.html',retrievedAt:'2026-10-09'})
  assert.ok(lead)
  assert.equal(lead.Category,'corpus-page-lead')
  assert.equal(lead['Review status'],'needs-review')
  assert.match(lead['Extraction note'],/human review/)
})

test('date and publication helpers preserve uncertainty',()=>{
  assert.deepEqual(extractDate('This belongs to the 4th century B.C.'),{from:-400,to:-301,certainty:'approximate'})
  assert.equal(classifyPublication('https://www.whatisindia.com/inscriptions/epigraphica_indica/vol8_1905-1906/item.html').publication,'Epigraphia Indica')
})

test('per-record printed publication becomes canonical provenance',()=>{
  const records=extractInscriptionRecords({html:numberedHtml,url:'https://www.whatisindia.com/inscriptions/south_indian_inscriptions/volume_20/miscellaneous.html'}).records
  const staged=stageSourceRecords({corpus:'WII',source:{id:'wii:source:index',publication:'WhatIsIndia inscriptions portal',url:'https://www.whatisindia.com/inscriptions.html'},records})
  const dataset=importCanonical(staged)
  assert.equal(dataset.entities.inscriptions[0].provenance.source_publication,'South Indian Inscriptions')
  assert.equal(dataset.entities.inscriptions[0].provenance.volume,'20')
  assert.equal(validateCanonicalDataset(dataset).filter(issue=>issue.severity==='error').length,0)
})
