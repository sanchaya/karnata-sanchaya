import fs from 'node:fs'
import path from 'node:path'

const input = process.argv[2] || process.env.NAKSHE_SITES_CSV_FILE
const output = process.argv[3] || process.env.NAKSHE_SITES_SEED_FILE || 'var/private-seeds/nakshe-sites.json'
if (!input) throw new Error('Pass the private source CSV path, or set NAKSHE_SITES_CSV_FILE.')

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

const clean = value => String(value ?? '').trim()
const n = (en, kn) => ({ en, kn })
const sourceId = 'src-nakshe-inscription-stones-bengaluru'
const reviewedAt = '2026-09-05'
const typeLabels = {
  Inscription: n('Inscription record', 'ಶಾಸನ ದಾಖಲೆ'),
  Herostone: n('Hero-stone record', 'ವೀರಗಲ್ಲು ದಾಖಲೆ'),
  Temple: n('Temple record', 'ದೇವಾಲಯ ದಾಖಲೆ'),
  'Herostone+Inscription': n('Hero-stone and inscription record', 'ವೀರಗಲ್ಲು ಮತ್ತು ಶಾಸನ ದಾಖಲೆ'),
}
const classificationByType = {
  Inscription: ['inscription'],
  Herostone: ['hero-stone'],
  Temple: ['temple-record'],
  'Herostone+Inscription': ['hero-stone', 'inscription'],
}
const districtMap = {
  'Bengaluru (Urban)': ['audit-bengaluru-urban', n('Bengaluru Urban', 'ಬೆಂಗಳೂರು ನಗರ')],
  'Bengaluru (Rural)': ['audit-bengaluru-rural', n('Bengaluru Rural', 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ')],
  Ramanagara: ['audit-ramanagara', n('Ramanagara', 'ರಾಮನಗರ')],
  Mandya: ['audit-mandya', n('Mandya', 'ಮಂಡ್ಯ')],
  Chikkamagaluru: ['audit-chikkamagaluru', n('Chikkamagaluru', 'ಚಿಕ್ಕಮಗಳೂರು')],
  Chikkaballapura: ['audit-chikkaballapur', n('Chikkaballapur', 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ')],
}
const statusMap = {
  'Live/Intact': 'intact-reported',
  lost: 'lost-reported',
  risk: 'at-risk-reported',
  'Unknown/To verify': 'unknown',
}
const centuryDate = (fromValue, toValue, undated) => {
  const fromCentury = Number.parseInt(clean(fromValue), 10)
  const toCentury = Number.parseInt(clean(toValue), 10)
  if (!Number.isFinite(fromCentury) && !Number.isFinite(toCentury)) return { from:null, to:null, era:'CE', precision:'unknown', undated:Boolean(clean(undated)) }
  const first = Number.isFinite(fromCentury) ? fromCentury : toCentury
  const last = Number.isFinite(toCentury) ? toCentury : first
  return { from:(first - 1) * 100 + 1, to:last * 100, era:'CE', precision:first === last ? 'century' : 'range' }
}

const rows = parseCsv(fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, ''))
const [header, ...body] = rows
const positions = new Map(header.map((value, index) => [clean(value), index]))
const read = (row, field) => clean(row[positions.get(field)])

const records = body.filter(row => row.some(value => clean(value))).map((row, index) => {
  const sourceRecordId = read(row, 'id') || `row-${index + 2}`
  const stableSuffix = sourceRecordId.replace(/^prov-/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const type = read(row, 'type') || 'Inscription'
  const label = typeLabels[type] || n('Site candidate', 'ತಾಣ ಅಭ್ಯರ್ಥಿ')
  const nameEn = read(row, 'name_en') || `${label.en} ${sourceRecordId}`
  const nameKn = read(row, 'name_kn') || `${label.kn} ${sourceRecordId}`
  const latitude = Number(read(row, 'latitude'))
  const longitude = Number(read(row, 'longitude'))
  const sourceDistrict = read(row, 'district')
  const [districtAuditId = null, district = n(sourceDistrict || 'District not recorded', sourceDistrict || 'ಜಿಲ್ಲೆ ದಾಖಲಾಗಿಲ್ಲ')] = districtMap[sourceDistrict] || []
  const village = read(row, 'village')
  const taluk = read(row, 'taluk')
  const placeEn = village || taluk || sourceDistrict || 'Place not recorded'
  const placeKn = read(row, 'name_kn') ? placeEn : (taluk || sourceDistrict || 'ಸ್ಥಳ ದಾಖಲಾಗಿಲ್ಲ')
  const reference = read(row, 'reference')
  const ecMatch = reference.match(/'vol':\s*([0-9]+).*?'taluq':\s*'([^']+)'.*?'num':\s*'([^']+)'/)
  const sourceRow = index + 2
  return {
    id: `nakshe-site-${stableSuffix}`,
    name: n(nameEn, nameKn),
    recordKind: 'geospatial-site-record',
    siteType: type,
    category: read(row, 'category') || 'sites',
    classifications: classificationByType[type] || ['site'],
    place: n(placeEn, placeKn),
    village: village || null,
    taluk: taluk || null,
    district,
    districtAuditId,
    date: centuryDate(read(row, 'period_from_century'), read(row, 'period_to_century'), read(row, 'undated')),
    languages: [],
    scripts: [],
    coordinates: { latitude, longitude, precision:'contributor-supplied-point' },
    location: { type:'Point', coordinates:[longitude, latitude], precision:'contributor-supplied-point' },
    evidenceKind: 'mapped',
    readiness: 'live',
    publicationStatus: 'live',
    sourceObservation: {
      conservationStatus: read(row, 'conservation_status') || null,
      status: statusMap[read(row, 'status')] || 'unknown',
      statusRaw: read(row, 'status') || null,
      periodRaw: read(row, 'period_raw') || null,
      referenceRaw: reference || null,
    },
    researchNote: n(
      'Verified by the Inscription Stones Of Bengaluru team and available to administrators for continuing corrections, citations and condition updates.',
      'Inscription Stones Of Bengaluru ತಂಡದಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ; ಮುಂದಿನ ತಿದ್ದುಪಡಿ, ಉಲ್ಲೇಖ ಮತ್ತು ಸ್ಥಿತಿ ನವೀಕರಣಗಳಿಗಾಗಿ ನಿರ್ವಾಹಕರಿಗೆ ಲಭ್ಯ.'
    ),
    sourceDataset: path.basename(input),
    sourceRecordId,
    sourceRow,
    sourceContributor: 'Inscription Stones Of Bengaluru',
    citations: [
      { sourceId, locator:`CSV row ${sourceRow}; source record ${sourceRecordId}` },
      ...(ecMatch ? [{ sourceId:'src-epigraphia-carnatica', locator:`EC vol. ${ecMatch[1]}, ${ecMatch[2]} ${ecMatch[3]} (source-provided locator; verify against the printed volume)` }] : []),
    ],
    verification: { status:'verified-by-source-team', verifiedBy:'Inscription Stones Of Bengaluru', updatedAt:reviewedAt },
    review: { status:'published', reviewer:'Inscription Stones Of Bengaluru', updatedAt:reviewedAt },
  }
})

const seen = new Set()
for (const record of records) {
  if (seen.has(record.id)) throw new Error(`Duplicate generated ID: ${record.id}`)
  seen.add(record.id)
  const [longitude, latitude] = record.location.coordinates
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) throw new Error(`Invalid coordinates for ${record.id}`)
}

const typeCounts = Object.fromEntries([...new Set(records.map(record => record.siteType))].sort().map(type => [type, records.filter(record => record.siteType === type).length]))
const districtCounts = Object.fromEntries([...new Set(records.map(record => record.district.en))].sort().map(district => [district, records.filter(record => record.district.en === district).length]))
const meta = { sourceId, sourceDataset:path.basename(input), recordCount:records.length, typeCounts, districtCounts, generatedAt:reviewedAt }
const outputText = `${JSON.stringify({ meta, records }, null, 2)}\n`
fs.mkdirSync(path.dirname(output), { recursive:true })
fs.writeFileSync(output, outputText)
console.log(`Imported ${records.length} team-verified private site records from ${path.basename(input)}.`)
