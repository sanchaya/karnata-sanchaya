// Pulls monthly rainfall and temperature for the centre of each Karnataka district from NASA POWER (https://power.larc.nasa.gov)
// and writes seasonal and annual totals to public/data/climate/karnataka-districts.json.
// NASA POWER is a modelled product (about 0.5 degree cells), not a rain-gauge record. Run: node scripts/import-nasa-power.mjs
import { readFile, mkdir, writeFile } from 'node:fs/promises'

const START = 1981, END = Number(process.env.POWER_END_YEAR || new Date().getFullYear() - 1)
const geo = JSON.parse(await readFile(new URL('../public/karnataka-districts.geojson', import.meta.url), 'utf8'))
const ring = coords => coords[0]
// Area-weighted centroid of the largest polygon: the centre of the district, not the mean of its border points.
function centroid(geometry) {
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  let best = null
  for (const poly of polys) {
    const pts = ring(poly); let a = 0, cx = 0, cy = 0
    for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1], f = x1 * y2 - x2 * y1; a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f }
    a /= 2; if (!best || Math.abs(a) > Math.abs(best.a)) best = { a, lng: cx / (6 * a), lat: cy / (6 * a) }
  }
  return best
}
const SEASONS = { pre: [3, 4, 5], sw: [6, 7, 8, 9], ne: [10, 11, 12], win: [1, 2] } // pre-monsoon, south-west monsoon, north-east monsoon, winter (IMD seasons)
const daysIn = (year, month) => new Date(year, month, 0).getDate()
const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d
let apiVersion = null
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchPoint(lat, lng) {
  const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=PRECTOTCORR,T2M_MAX,T2M_MIN&community=AG&longitude=${lng.toFixed(3)}&latitude=${lat.toFixed(3)}&start=${START}&end=${END}&format=JSON`
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'karnataka-atlas-import (non-commercial)' } })
      if (res.ok) { const json = await res.json(); apiVersion ||= json.header?.api?.version || null; return json.properties.parameter }
      if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}`)
    } catch (error) { if (attempt === 4) throw error }
    await sleep(4000 * attempt)
  }
  throw new Error('NASA POWER did not answer')
}

const districts = []
for (const feature of geo.features) {
  const { lat, lng } = centroid(feature.geometry)
  const p = await fetchPoint(lat, lng)
  const years = []
  for (let y = START; y <= END; y++) {
    const key = m => `${y}${String(m).padStart(2, '0')}`
    const rain = s => round(SEASONS[s].reduce((sum, m) => sum + Math.max(0, p.PRECTOTCORR[key(m)]) * daysIn(y, m), 0), 0)
    const mean = (name, months) => round(months.reduce((sum, m) => sum + p[name][key(m)], 0) / months.length)
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const row = { y, pre: rain('pre'), sw: rain('sw'), ne: rain('ne'), win: rain('win') }
    row.year = row.pre + row.sw + row.ne + row.win
    row.tmax = mean('T2M_MAX', all); row.tmin = mean('T2M_MIN', all)
    row.tmaxPre = mean('T2M_MAX', SEASONS.pre)
    if ([row.pre, row.sw, row.ne, row.win, row.tmax, row.tmin].some(v => !Number.isFinite(v) || v < -50)) continue // POWER marks gaps as -999
    years.push(row)
  }
  districts.push({ id: feature.properties.id, name: feature.properties.district, lat: round(lat, 3), lng: round(lng, 3), years })
  console.log(feature.properties.district, years.length, 'years')
  await sleep(1200)
}
const out = {
  meta: { source: 'NASA POWER (Prediction Of Worldwide Energy Resources), monthly point data, community AG', url: 'https://power.larc.nasa.gov', parameters: 'PRECTOTCORR (rain, mm/day, turned into mm per month), T2M_MAX, T2M_MIN (degrees C)', start: START, end: END, normal: [1991, 2020], note: 'Modelled values for a point at the centre of each district on a coarse grid (about 0.5 degrees). Not rain-gauge records; do not use for local or farm-level decisions.', seasons: { pre: 'March to May', sw: 'June to September (south-west monsoon)', ne: 'October to December (north-east monsoon)', win: 'January to February' }, generated: new Date().toISOString().slice(0, 10), apiVersion, citation: 'These data were obtained from the NASA Langley Research Center (LaRC) POWER Project funded through the NASA Earth Science/Applied Science Program.' },
  districts,
}
await mkdir(new URL('../public/data/climate/', import.meta.url), { recursive: true })
await writeFile(new URL('../public/data/climate/karnataka-districts.json', import.meta.url), JSON.stringify(out))
console.log('written', districts.length, 'districts')
