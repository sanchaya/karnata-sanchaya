import test from 'node:test'
import assert from 'node:assert/strict'
import { buildSearchText, matchesSearch, transliterateKannada } from '../src/search-normalization.js'

test('Kannada names are searchable through loose Latin transliteration',()=>{
  assert.equal(transliterateKannada('ಹಲ್ಮಿಡಿ'),'halmidi')
  assert.equal(transliterateKannada('ಹಂಪಿ'),'hampi')
  assert.equal(transliterateKannada('ರಾಷ್ಟ್ರಕೂಟ'),'rashtrakuta')
  const text=buildSearchText({name:{kn:'ಐಹೊಳೆ',en:''},aliases:['Ayyavole']})
  assert.equal(matchesSearch(text,'aihole'),true)
  assert.equal(matchesSearch(text,'ಐಹೊಳೆ'),true)
})
