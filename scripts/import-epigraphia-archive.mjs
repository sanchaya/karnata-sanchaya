#!/usr/bin/env node
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const output = new URL('../src/data/epigraphia-archive.generated.js', import.meta.url)
const rows = Number(process.env.EPIGRAPHIA_ARCHIVE_ROWS || process.argv[2] || 640)
const textSampleRows = Number(process.env.EPIGRAPHIA_ARCHIVE_TEXT_SAMPLE_ROWS || 80)
const concurrency = Number(process.env.EPIGRAPHIA_ARCHIVE_CONCURRENCY || 8)
const localArchiveDir = process.env.EPIGRAPHIA_LOCAL_ARCHIVE_DIR || ''
const includeNetwork = process.env.EPIGRAPHIA_ARCHIVE_INCLUDE_NETWORK === '1' || !localArchiveDir
const collections = (process.env.EPIGRAPHIA_ARCHIVE_COLLECTIONS || 'JaiGyan,ServantsOfKnowledge').split(',').map(value => value.trim()).filter(Boolean)
const epigraphyPattern = /(epigraphia|epigraphy|epigraphical|epigraphs|inscription|inscriptions)/i
const excludePattern = /(epigenetic|epigenetics|epigram|epigrams|hesperidin|prostate|tomato)/i
const signalTerms = ['kannada', 'kanarese', 'carnatica', 'mysore', 'kolar', 'hassan', 'tumkur', 'shimoga', 'dharwar', 'belgaum', 'bijapur', 'hampi', 'chalukya', 'kadamba', 'ganga', 'rashtrakuta', 'hoysala', 'vijayanagara']

const n = (en, kn) => ({ en, kn })
const review = { status: 'needs-review', reviewer: null, updatedAt: '2026-08-24' }
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90)
const normaliseArray = value => Array.isArray(value) ? value : value ? [value] : []
const archiveUrl = identifier => `https://archive.org/details/${identifier}`
const fileUrl = (identifier, name) => `https://archive.org/download/${identifier}/${encodeURIComponent(name)}`
const signalCounts = text => {
  const lower = text.toLowerCase()
  return Object.fromEntries(signalTerms.map(term => [term, (lower.match(new RegExp(`\\b${term}\\b`, 'g')) || []).length]).filter(([, count]) => count > 0))
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'karnata-sanchaya-epigraphia-import/0.1' } })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
  return response.json()
}

async function mapLimit(items, limit, worker) {
  const results = []
  let index = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index
      index += 1
      results[current] = await worker(items[current], current)
    }
  })
  await Promise.all(runners)
  return results
}

function seriesFor(title) {
  if (/carnatica/i.test(title)) return 'Epigraphia Carnatica'
  if (/indica/i.test(title)) return 'Epigraphia Indica'
  if (/south[- ]indian epigraphy/i.test(title)) return 'Annual Report on South Indian Epigraphy'
  if (/annual report.*indian epigraphy/i.test(title)) return 'Annual Report on Indian Epigraphy'
  return 'Epigraphy corpus'
}

function volumeFor(title) {
  const match = title.match(/\b(?:vol(?:ume)?|volu)\.?\s*[- ]?([ivxlcdm]+|\d{1,3})\b/i)
  return match?.[1]?.toUpperCase() || null
}

async function discover() {
  const localRecords = localArchiveDir ? await discoverLocal(localArchiveDir) : []
  if (!includeNetwork) return localRecords
  const collectionQuery = collections.map(collection => `collection:${collection}`).join(' OR ')
  const query = `(${collectionQuery}) AND (title:epig* OR title:inscription*)`
  const params = new URLSearchParams({
    q: query,
    rows: String(rows),
    page: '1',
    output: 'json',
    sort: 'downloads desc',
  })
  for (const field of ['identifier', 'title', 'creator', 'date', 'year', 'collection']) params.append('fl[]', field)
  const data = await fetchJson(`https://archive.org/advancedsearch.php?${params}`)
  const candidates = (data.response?.docs || []).filter(item => epigraphyPattern.test(item.title || '') && !excludePattern.test(item.title || ''))
  const records = []
  const metadataRows = await mapLimit(candidates, concurrency, async candidate => {
    try {
      return { candidate, metadata: await fetchJson(`https://archive.org/metadata/${candidate.identifier}`) }
    } catch (error) {
      return { candidate, error: error.message }
    }
  })
  const textRows = metadataRows.filter(item => item.metadata)
  for (let index = 0; index < textRows.length; index += 1) {
    const { candidate, metadata } = textRows[index]
    const title = metadata.metadata?.title || candidate.title || candidate.identifier
    if (!epigraphyPattern.test(title) || excludePattern.test(title)) continue
    const textFiles = (metadata.files || []).filter(file => file.name?.endsWith('.txt') && ['DjVuTXT', 'Text', 'Plain Text'].includes(file.format || 'DjVuTXT'))
    if (!textFiles.length) continue
    const textFile = textFiles.find(file => /_djvu\.txt$/i.test(file.name)) || textFiles[0]
    const shouldSampleText = textSampleRows > 0 && index < textSampleRows
    const text = shouldSampleText ? await fetch(fileUrl(candidate.identifier, textFile.name)).then(response => response.ok ? response.text() : '') : ''
    const ocrSignals = signalCounts(text)
    const sourceCollections = normaliseArray(metadata.metadata?.collection || candidate.collection).filter(value => collections.includes(value))
    records.push({
      id: `archive-epigraphia-${slug(candidate.identifier)}`,
      name: n(title, title),
      archiveIdentifier: candidate.identifier,
      title,
      creators: normaliseArray(metadata.metadata?.creator || candidate.creator).map(String),
      year: Number(metadata.metadata?.year || candidate.year || String(metadata.metadata?.date || '').slice(0, 4)) || null,
      series: seriesFor(title),
      volume: volumeFor(title),
      sourceCollections,
      itemUrl: archiveUrl(candidate.identifier),
      textFile: {
        name: textFile.name,
        url: fileUrl(candidate.identifier, textFile.name),
        format: textFile.format || 'DjVuTXT',
        size: Number(textFile.size) || null,
      },
      ocrSignals,
      ocrSignalStatus: shouldSampleText ? 'sampled' : 'not-sampled',
      citation: {
        sourceId: sourceCollections.includes('ServantsOfKnowledge') ? 'src-ia-sok-epigraphy-collection' : 'src-ia-jaigyan-epigraphy-collection',
        locator: `${candidate.identifier}/${textFile.name}; OCR discovery only, verify against page image before citation`,
      },
      review,
    })
  }
  return [...localRecords, ...records].sort((a, b) => a.series.localeCompare(b.series) || String(a.volume || '').localeCompare(String(b.volume || '')) || a.title.localeCompare(b.title))
}

async function discoverLocal(rootDir) {
  const children = await readdir(rootDir, { withFileTypes: true })
  const folders = children.filter(item => item.isDirectory()).map(item => path.join(rootDir, item.name))
  const records = []
  for (const folder of folders) {
    const files = await readdir(folder)
    const textName = files.find(name => name.endsWith('_djvu.txt')) || files.find(name => name.endsWith('.txt'))
    if (!textName) continue
    const fullPath = path.join(folder, textName)
    const identifier = path.basename(folder)
    const title = `Epigraphia Carnatica ${volumeFor(identifier) ? `Volume ${volumeFor(identifier)}` : identifier}`
    const text = await readFile(fullPath, 'utf8')
    const info = await stat(fullPath)
    records.push({
      id: `archive-epigraphia-local-${slug(identifier)}`,
      name: n(title, title),
      archiveIdentifier: identifier,
      title,
      creators: ['Mysore Archaeological Department', 'B. Lewis Rice et al.'],
      year: null,
      series: 'Epigraphia Carnatica',
      volume: volumeFor(identifier),
      sourceCollections: ['local-cache'],
      itemUrl: archiveUrl(identifier),
      textFile: {
        name: textName,
        url: fileUrl(identifier, textName),
        format: 'DjVuTXT',
        size: info.size,
        localCache: true,
      },
      ocrSignals: signalCounts(text),
      ocrSignalStatus: 'local-sampled',
      citation: {
        sourceId: 'src-ia-jaigyan-epigraphy-collection',
        locator: `${identifier}/${textName}; local OCR cache indexed; OCR discovery only, verify against page image before citation`,
      },
      review,
    })
  }
  return records
}

const records = await discover()
const generated = `// Generated by scripts/import-epigraphia-archive.mjs from Internet Archive metadata and OCR text derivatives.
// OCR signals are discovery aids only; promoted records must cite printed pages and page images.
export const epigraphiaArchiveTexts = ${JSON.stringify(records, null, 2)}
`
await writeFile(output, generated)
console.log(`Generated ${records.length} Epigraphia Archive text records in ${output.pathname}`)
