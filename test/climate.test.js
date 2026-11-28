import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const climate=JSON.parse(await readFile(new URL('../public/data/climate/karnataka-districts.json',import.meta.url),'utf8'))
const districts=JSON.parse(await readFile(new URL('../public/karnataka-districts.geojson',import.meta.url),'utf8')).features.map(f=>f.properties.district)

test('climate data: every district has a complete, plausible yearly series and a credited source',()=>{
  assert.equal(climate.districts.length,31)
  assert.deepEqual(climate.districts.map(d=>d.name).sort(),[...districts].sort(),'the climate districts match the boundary file')
  assert.match(climate.meta.citation,/POWER Project/);assert.ok(climate.meta.apiVersion&&climate.meta.generated&&climate.meta.note)
  for(const d of climate.districts){
    assert.ok(d.lat>11&&d.lat<19&&d.lng>74&&d.lng<79,`${d.name} point`)
    assert.equal(d.years.length,climate.meta.end-climate.meta.start+1,`${d.name} has a gap`)
    d.years.forEach((r,i)=>{
      assert.equal(r.y,climate.meta.start+i)
      assert.equal(r.year,r.pre+r.sw+r.ne+r.win,`${d.name} ${r.y} seasons add up to the year`)
      assert.ok(r.year>=0&&r.year<8000,`${d.name} ${r.y} rain ${r.year}`)
      assert.ok(r.tmax>r.tmin&&r.tmax>20&&r.tmax<45&&r.tmin>5&&r.tmin<30,`${d.name} ${r.y} temperatures`)
    })
  }
  // The coast is far wetter than the dry interior, and the south-west monsoon is the main season in the Ghats.
  const normal=name=>{const rows=climate.districts.find(d=>d.name===name).years.filter(r=>r.y>=1991&&r.y<=2020);return rows.reduce((s,r)=>s+r.year,0)/rows.length}
  assert.ok(normal('Dakshina Kannada')>2500&&normal('Dakshina Kannada')>normal('Ballari')*4)
})

test('climate page: wired in, with the caveat and the licence entry',async()=>{
  const app=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8')
  assert.match(app,/climate:'nature'/);assert.match(app,/<ClimatePage locale=\{locale\}\/>/);assert.match(app,/\['climate',locale==='kn'/)
  const page=await readFile(new URL('../src/ClimatePage.jsx',import.meta.url),'utf8')
  assert.match(page,/not rain-gauge records/);assert.match(page,/NORMAL=\[1991,2020\]/)
  const { LICENCES }=await import('../src/data/licences.js')
  assert.equal(LICENCES.find(i=>i.id==='nasa-power').used,'data')
})
