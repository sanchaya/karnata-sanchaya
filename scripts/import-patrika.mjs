import fs from 'node:fs'
import path from 'node:path'

const input = process.argv[2] || 'src/data/imports/Patrika Sanchaya - Kannada.csv'
const output = process.argv[3] || 'src/data/patrika-sanchaya.generated.js'

const parseCsv = text => {
  const rows = []
  let row = [], cell = '', quoted = false
  const pushCell = () => { row.push(cell); cell = '' }
  const pushRow = () => { if (row.length || cell) { pushCell(); rows.push(row); row = [] } }
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { cell += '"'; index += 1 }
      else if (char === '"') quoted = false
      else cell += char
    } else if (char === '"') quoted = true
    else if (char === ',') pushCell()
    else if (char === '\n') pushRow()
    else if (char !== '\r') cell += char
  }
  pushRow()
  return rows
}

const clean = value => String(value || '').trim()
const slug = value => clean(value).normalize('NFKC').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown'
const firstYear = value => {
  const match = clean(value).match(/(?:^|[^0-9])(1[0-9]{3}|20[0-9]{2})(?:[^0-9]|$)/)
  return match ? Number(match[1]) : null
}
const firstPlace = value => clean(value).split(/[\/,;]/)[0].trim()
const n = (en, kn = en) => ({ en, kn })

// Coordinates are intentionally publication-place anchors, not item-level claims.
// Every anchor remains needs-review until a researcher resolves its exact office/archive.
const anchors = {
  'ಬೆಂಗಳೂರು':[12.9716,77.5946], 'ಬೆಂಗಳೂರುಗ್ರಾಮೀಣ':[13.2257,77.7069], 'ಮಂಗಳೂರು':[12.9141,74.8560], 'ಮೈಸೂರು':[12.2958,76.6394],
  'ಶಿವಮೊಗ್ಗ':[13.9299,75.5681], 'ಉಡುಪಿ':[13.3409,74.7421], 'ಧಾರವಾಡ':[15.4589,75.0078], 'ದಕ್ಷಿಣಕನ್ನಡ':[12.8438,75.2479],
  'ಬೆಳಗಾವಿ':[15.8497,74.4977], 'ಹುಬ್ಬಳ್ಳಿ':[15.3647,75.1240], 'ವಿಜಯಪುರ':[16.8302,75.7100], 'ಕಲಬುರ್ಗಿ':[17.3297,76.8343],
  'ಚಿಕ್ಕಮಗಳೂರು':[13.3161,75.7720], 'ಮಂಡ್ಯ':[12.5218,76.8951], 'ಸಾಗರ':[14.1649,75.0294], 'ತುಮಕೂರು':[13.3379,77.1173],
  'ದಾವಣಗೆರೆ':[14.4644,75.9218], 'ಬಾಗಲಕೋಟೆ':[16.1691,75.6615], 'ಬೀದರ್':[17.9104,77.5199], 'ಹಾಸನ':[13.0033,76.1004],
  'ಕೋಲಾರ':[13.1367,78.1292], 'ಗದಗ':[15.4166,75.6296], 'ಚಿತ್ರದುರ್ಗ':[14.2276,76.3980], 'ಮಡಿಕೇರಿ':[12.4244,75.7382],
  'ಶಿರಸಿ':[14.6198,74.8354], 'ರಾಯಚೂರು':[16.2120,77.3439], 'ಪುತ್ತೂರು':[12.7598,75.2017], 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ':[13.4355,77.7315],
  'ತೀರ್ಥಹಳ್ಳಿ':[13.6880,75.2453], 'ದೊಡ್ಡಬಳ್ಳಾಪುರ':[13.2946,77.5377], 'ರಾಮನಗರ':[12.7150,77.2815], 'ಹಾವೇರಿ':[14.7951,75.3991],
  'ಭದ್ರಾವತಿ':[13.8485,75.7050], 'ಹೊನ್ನಾವರ':[14.2800,74.4440], 'ದೇವನಹಳ್ಳಿ':[13.2422,77.7137], 'ಕುಮಟಾ':[14.4285,74.4180],
  'ಸಿದ್ಧಾಪುರ':[14.4780,74.9850], 'ಕೊಪ್ಪಳ':[15.3470,76.1540], 'ಚಾಮರಾಜನಗರ':[11.9261,76.9437], 'ಕಾರ್ಕಳ':[13.2143,74.9951],
  'ಕಡೂರು':[13.5527,76.0117], 'ಹಂಪಿ':[15.3350,76.4754], 'ಗಂಗಾವತಿ':[15.4317,76.5293], 'ಬಂಟ್ವಾಳ':[12.8900,75.0350],
  'ಬಳ್ಳಾರಿ':[15.1394,76.9214], 'ಕಾಸರಗೋಡು':[12.4996,74.9869], 'ತರಿಕೆರೆ':[13.7093,75.8110], 'ನಂಜನಗೂಡು':[12.1197,76.6800],
  'ಕೊಪ್ಪ':[13.5358,75.3630], 'ಕುಂದಾಪುರ':[13.6293,74.6900], 'ಹೊಸಪೇಟೆ':[15.2695,76.3871], 'ಜಮಖಂಡಿ':[16.5040,75.2910],
  'ಕೊಳ್ಳೆಗಾಲ':[12.1547,77.1117], 'ಅಂಕೋಲ':[14.6605,74.3047], 'ಚನ್ನಪಟ್ಟಣ':[12.6518,77.2067], 'ಹೊಸಕೋಟೆ':[13.0707,77.7981],
  'ಸೊರಬ':[14.3810,75.0910], 'ಬೆಳ್ತಂಗಡಿ':[13.9830,75.3030], 'ಅನೇಕಲ್':[12.7116,77.6950], 'ಕನಕಪುರ':[12.5460,77.4220],
  'ತಿಪಟೂರು':[13.2563,76.4770], 'ಶಿಕಾರಿಪುರ':[14.2700,75.3550], 'ಕಾರವಾರ':[14.8190,74.1410], 'ಸುರತ್ಕಲ್':[13.0100,74.7950],
  'ಮೂಡಬಿದ್ರೆ':[13.0685,74.9950], 'ಶೃಂಗೇರಿ':[13.4244,75.2520], 'ಶ್ರೀರಂಗಪಟ್ಟಣ':[12.4220,76.6840], 'ಯಾದಗಿರಿ':[16.7700,77.1370],
  'ಮಣಿಪಾಲ':[13.3525,74.7920], 'ಹರಿಹರ':[14.5120,75.8070], 'ಗೋಕರ್ಣ':[14.5479,74.3188], 'ರಾಣೆಬೆನ್ನೂರು':[14.6223,75.6297],
  'ಮಾಗಡಿ':[12.9570,77.2260], 'ಮೂಡಿಗೆರೆ':[13.1320,75.5760], 'ಚಿಂತಾಮಣಿ':[13.4000,78.0500], 'ಮಹದೇಶ್ವರಬೆಟ್ಟ':[12.0160,77.5140]
}

const headers = ['serial','title','startYear','publicationPlace','publisher','editor','periodicity','language','havanurNotes','kpaNotes']
const rows = parseCsv(fs.readFileSync(input, 'utf8'))
const [header, ...body] = rows
const index = new Map(header.map((value, position) => [clean(value), position]))
const read = (row, key) => clean(row[index.get({serial:'ಕ್ರ. ಸಂ',title:'ಪತ್ರಿಕೆಯ ಹೆಸರು',startYear:'ಪ್ರಾರಂಭದ ವರ್ಷ',publicationPlace:'ಪ್ರಕಟಿಸಿದಸ್ಥಳ',publisher:'ಪ್ರಕಾಶಕರು',editor:'ಸ್ಥಾಪಕ ಸಂಪಾದಕ/ಸಂಪಾದಕ',periodicity:'ಆವರ್ತಕತೆ',language:'ಭಾಷೆ',havanurNotes:'ಹಾವನೂರು ಶ್ರೀನಿವಾಸ್',kpaNotes:'ಕೆಪಿಎ'}[key])])
const sourceId = 'src-patrika-sanchaya-kannada'
const records = body.filter(row => row.some(Boolean)).map((row, position) => {
  const serial = read(row, 'serial') || String(position + 1)
  const title = read(row, 'title') || `Untitled periodical ${serial}`
  const year = firstYear(read(row, 'startYear'))
  const place = firstPlace(read(row, 'publicationPlace'))
  const anchor = anchors[place.replace(/^\u200c/, '')]
  const date = year ? { from: year, to: year, era: 'CE', precision: 'year' } : { from: null, to: null, era: 'CE', precision: 'unknown' }
  return {
    id: `periodical-patrika-${slug(serial)}`,
    name: n(title, title),
    recordKind: 'newspaper-or-magazine',
    date,
    publicationPlace: n(place || 'Not recorded', place || 'ದಾಖಲಾಗಿಲ್ಲ'),
    publisher: read(row, 'publisher'),
    editor: read(row, 'editor'),
    periodicity: read(row, 'periodicity'),
    language: read(row, 'language') || 'ಕನ್ನಡ',
    contributorNotes: { havanurSrinivas: read(row, 'havanurNotes'), kpa: read(row, 'kpaNotes') },
    sourceDataset: 'Patrika Sanchaya - Kannada.csv',
    sourceRow: Number(serial) || position + 1,
    sourceContributor: 'Srinivas Havanur / Patrika Sanchaya',
    location: anchor ? { type: 'Point', coordinates: [anchor[1], anchor[0]], precision: 'publication-place-anchor' } : null,
    review: { status: 'needs-review', reviewer: null, updatedAt: '2026-08-08' },
    citations: [{ sourceId, locator: `CSV row ${Number(serial) || position + 1}; Patrika Sanchaya catalogue fields` }]
  }
})

const grouped = new Map()
for (const record of records) {
  if (!record.location) continue
  const key = record.publicationPlace.en
  const group = grouped.get(key) || { place:key, coordinates:record.location.coordinates, periodicalIds:[], years:[] }
  group.periodicalIds.push(record.id)
  if (record.date.from != null) group.years.push(record.date.from)
  grouped.set(key, group)
}
const mapSites = [...grouped.values()].map((group, index) => ({
  id: `periodical-place-${slug(group.place)}-${index + 1}`,
  name: n(`${group.place} periodical archive`, `${group.place} ಪತ್ರಿಕಾ ಸಂಗ್ರಹ`),
  place: n(group.place, group.place),
  coordinates: group.coordinates,
  periodicalIds: group.periodicalIds,
  yearFrom: group.years.length ? Math.min(...group.years) : null,
  yearTo: group.years.length ? Math.max(...group.years) : null,
  review: { status:'needs-review', reviewer:null, updatedAt:'2026-08-08' },
  citation: { sourceId, locator: `${group.periodicalIds.length} catalogue rows for ${group.place}` }
}))

const outputText = `// Generated by scripts/import-patrika.mjs from the attributed Patrika Sanchaya CSV.\nexport const patrikaPeriodicals = ${JSON.stringify(records, null, 2)}\nexport const patrikaMapSites = ${JSON.stringify(mapSites, null, 2)}\n`
fs.mkdirSync(path.dirname(output), { recursive:true })
fs.writeFileSync(output, outputText)
console.log(`Imported ${records.length} periodicals and ${mapSites.length} publication-place map sites.`)
