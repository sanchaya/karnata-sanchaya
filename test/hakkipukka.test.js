import test from 'node:test'
import assert from 'node:assert/strict'
import { englishName, parsePosts } from '../scripts/import-hakkipukka-names.mjs'
import { applyNameSources } from '../src/species-normalize.js'

test('hakkipukka English names come from the link text or the address, never from page text', () => {
  assert.equal(englishName('ಹಳದಿ ಗುಪ್ಪಿ | Yellow bittern','https://hakkipukka.com/x/'),'Yellow bittern')
  assert.equal(englishName('ಗೋವಕ್ಕಿ','https://hakkipukka.com/cattle-egret/'),'Cattle Egret')
  assert.equal(englishName('ಬಿಳಿ ಕೊಕ್ಕರೆ','https://hakkipukka.com/%e0%b2%ac%e0%b2%bf%e0%b2%b3%e0%b2%bf-%e0%b2%95%e0%b3%8a%e0%b2%95%e0%b3%8d%e0%b2%95%e0%b2%b0%e0%b3%86-european-white-stork/'),'European White Stork')
  assert.equal(englishName('ಕರಿ ಗುಪ್ಪಿ','https://hakkipukka.com/%e0%b2%95%e0%b2%b0%e0%b2%bf-%e0%b2%97%e0%b3%81%e0%b2%aa%e0%b3%8d%e0%b2%aa%e0%b2%bf/'),'')
})
test('menu, category and page links are skipped', () => {
  const html='<a href="https://hakkipukka.com/category/x/">ಪಕ್ಷಿ ವರ್ಗ</a><a href="https://hakkipukka.com/little-egret/">ಸಣ್ಣ ಬೆಳ್ಳಕ್ಕಿ</a><a href="https://hakkipukka.com/didyouknow/">ನಿಮಗಿದು ಗೊತ್ತೇ</a>'
  assert.deepEqual(parsePosts(html).map(p=>p.kn),['ಸಣ್ಣ ಬೆಳ್ಳಕ್ಕಿ'])
})
test('a species-scope name matches the exact English name only', () => {
  const lists=[{id:'hakkipukka',scope:'species',entries:[{kn:'ಸಣ್ಣ ಬೆಳ್ಳಕ್ಕಿ',english:'Little Egret'}]}]
  const [hit,miss]=applyNameSources([{name:{en:'Little Egret'}},{name:{en:'Great Egret'}}],lists)
  assert.equal(hit.name.kn,'ಸಣ್ಣ ಬೆಳ್ಳಕ್ಕಿ');assert.equal(miss.name.kn,undefined)
})

test('a list on hold is stored but not applied', () => {
  const lists=[{id:'hakkipukka',scope:'species',hold:true,entries:[{kn:'ಸಣ್ಣ ಬೆಳ್ಳಕ್ಕಿ',english:'Little Egret'}]}]
  assert.equal(applyNameSources([{name:{en:'Little Egret'}}],lists)[0].name.kn,undefined)
})
