import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { canonicalDistrictAssociation, canonicalDistrictId, canonicalDistrictName } from '../src/data/district-normalization.js'
import { atlasData } from '../src/data/atlas.js'
import inventory from '../src/data/dictionary-martyrs-karnataka.json' with { type:'json' }

test('historical and spelling variants resolve to one current district ID',()=>{
  const groups=[
    [['Bagalakot','Bagalkot','Bagalkote'],'audit-bagalkote'],
    [['Bellary','Ballari'],'audit-ballari'],
    [['Belgaum','Belagavi'],'audit-belagavi'],
    [['Bangalore','Bengaluru','Bangalore Urban'],'audit-bengaluru-urban'],
    [['Bijapur','Vijayapura'],'audit-vijayapura'],
    [['Gulbarga','Kalaburagi'],'audit-kalaburagi'],
    [['Mysore','Mysuru'],'audit-mysuru'],
    [['Shimoga','Shivamogga'],'audit-shivamogga'],
    [['Tumkur','Tumakuru'],'audit-tumakuru'],
    [['Mangalore','Mangaluru','South Kanara'],'audit-dakshina-kannada'],
    [['North Kanara','Uttara Kannada'],'audit-uttara-kannada'],
  ]
  for(const [aliases,id] of groups)assert.deepEqual([...new Set(aliases.map(canonicalDistrictId))],[id])
})

test('every district label extracted from Volume 5 has a canonical district',()=>{
  const labels=[...new Set(inventory.records.flatMap(record=>record.districtText))]
  assert.ok(labels.length)
  assert.deepEqual(labels.filter(label=>!canonicalDistrictId(label)),[])
  const associations=labels.map(value=>canonicalDistrictAssociation(value))
  assert.equal(associations.filter(item=>item.districtId==='audit-bagalkote').length,2)
  assert.ok(associations.every(item=>item.canonical))
})

test('district display names use canonical Kannada without rewriting source metadata',()=>{
  assert.equal(canonicalDistrictName('Bangalore Urban','kn'),'ಬೆಂಗಳೂರು ನಗರ')
  assert.equal(canonicalDistrictName({en:'Chikkaballapura',kn:'Chikkaballapura'},'kn'),'ಚಿಕ್ಕಬಳ್ಳಾಪುರ')
  assert.equal(canonicalDistrictName('District pending','kn'),'ಜಿಲ್ಲೆ ನಿರ್ಧಾರ ಬಾಕಿ')
  assert.equal(canonicalDistrictName('Maharashtra','kn'),'ಮಹಾರಾಷ್ಟ್ರ')

  const knownDistricts=atlasData.heritageInventoryLeads
    .map(item=>item.district)
    .filter(item=>canonicalDistrictId(item))
  assert.ok(knownDistricts.length>800)
  assert.ok(knownDistricts.every(item=>/[\u0c80-\u0cff]/.test(canonicalDistrictName(item,'kn'))))
})

test('district-aware pages share the canonical display-name resolver',async()=>{
  const files=['LiteratureEpigraphyExplorer.jsx','DistrictHistoryExplorer.jsx','CommunityResearchTasks.jsx','GuidedContributionForm.jsx','contribution-places.js']
  for(const file of files){
    const source=await readFile(new URL(`../src/${file}`,import.meta.url),'utf8')
    assert.match(source,/canonicalDistrictName/,`${file} must use canonical district labels`)
  }
})
