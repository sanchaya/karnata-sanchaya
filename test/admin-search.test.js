import test from 'node:test'
import assert from 'node:assert/strict'
import { alternateRecordTitle, localizedRecordTitle, recordMatchesAdminSearch } from '../src/admin-search.js'

test('admin record titles keep Kannada first and fall back to an available English name', () => {
  const bilingual={id:'person-one',name:{kn:'ಕುವೆಂಪು',en:'Kuvempu'}}
  const englishOnly={id:'person-two',name:{kn:'',en:'English-only researcher'}}
  assert.equal(localizedRecordTitle(bilingual,'kn'),'ಕುವೆಂಪು')
  assert.equal(alternateRecordTitle(bilingual,'kn'),'Kuvempu')
  assert.equal(localizedRecordTitle(englishOnly,'kn'),'English-only researcher')
  assert.equal(alternateRecordTitle(englishOnly,'kn'),'')
})

test('admin all-field search matches nested Kannada, English, IDs and review metadata', () => {
  const record={id:'person-kavirajamarga',name:{kn:'ಕವಿರಾಜಮಾರ್ಗ',en:'Kavirajamarga'},roles:['ಲೇಖಕ'],review:{status:'needs-review'}}
  assert.equal(recordMatchesAdminSearch(record,'ಕವಿರಾಜ'),true)
  assert.equal(recordMatchesAdminSearch(record,'KAVIRAJAMARGA'),true)
  assert.equal(recordMatchesAdminSearch(record,'person-kavirajamarga'),true)
  assert.equal(recordMatchesAdminSearch(record,'needs-review'),true)
  assert.equal(recordMatchesAdminSearch(record,'ಹೊಯ್ಸಳ'),false)
})
