import test from 'node:test'
import assert from 'node:assert/strict'
import { canonicalDistrictAssociation, canonicalDistrictId } from '../src/data/district-normalization.js'
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
