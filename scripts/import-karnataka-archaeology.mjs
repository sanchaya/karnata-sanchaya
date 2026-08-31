#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const output = new URL('../src/data/karnataka-archaeology.generated.js', import.meta.url)
const rows = Number(process.env.KARCH_ROWS || process.argv[2] || 200)
// Every item is re-sampled and re-matched against the current locatorTargets list on each
// run by default (see the "always re-sample" note in discover()) so that a newly added
// locator target retroactively applies to books already in the collection.
const textSampleRows = Number(process.env.KARCH_TEXT_SAMPLE_ROWS || 200)
const concurrency = Number(process.env.KARCH_CONCURRENCY || 6)
const localArchiveDir = process.env.KARCH_LOCAL_ARCHIVE_DIR || ''
const includeNetwork = process.env.KARCH_INCLUDE_NETWORK === '1' || !localArchiveDir
const collections = (process.env.KARCH_COLLECTIONS || 'KarnatakaArchaeology').split(',').map(value => value.trim()).filter(Boolean)

// Archive.org's search index can lag well behind an actual upload (observed: a live,
// fetchable item absent from advancedsearch/scrape results days after publication).
// Seed identifiers are unioned with search discovery so a newly flagged item is picked
// up immediately instead of waiting on indexing. Add an identifier here as soon as it
// is known, even before it appears in collection search results.
const seedIdentifiers = (process.env.KARCH_SEED_IDENTIFIERS || 'damh.coinsofhaiderali0000jrhe').split(',').map(value => value.trim()).filter(Boolean)

const n = (en, kn) => ({ en, kn })
const locatorTargets = [
  { id: 'archive-hint-haidar-tipu-coinage', label: n('Haidar Ali / Tipu Sultan coinage lead', 'ಹೈದರ್ ಅಲಿ / ಟಿಪ್ಪು ಸುಲ್ತಾನ್ ನಾಣ್ಯ ದಾರಿ'), terms: ['haidar', 'haider', 'tipu', 'tippu', 'pagoda', 'fanam', 'mysore', 'seringapatam', 'srirangapatna'], anchorTerms: ['haidar', 'haider', 'tipu', 'tippu'], targetRecordIds: ['coin-mysore-srirangapatna-tipu-lead', 'coin-haidar-ali-bahaduri-pagoda-lead', 'person-hyder-ali', 'person-tipu-sultan'] },
  { id: 'archive-hint-vijayanagara-studies', label: n('Vijayanagara Adhyayana research lead', 'ವಿಜಯನಗರ ಅಧ್ಯಯನ ಸಂಶೋಧನಾ ದಾರಿ'), terms: ['vijayanagara', 'vijayanagar', 'hampi', 'krishnadevaraya', 'harihara', 'bukka', 'ವಿಜಯನಗರ', 'ಹಂಪಿ'], anchorTerms: ['vijayanagara', 'vijayanagar', 'hampi', 'ವಿಜಯನಗರ', 'ಹಂಪಿ'], targetRecordIds: ['polity-vijayanagara', 'place-hampi', 'person-krishnadevaraya', 'culture-hampi-vittala-complex'] },
  { id: 'archive-hint-mysore-archaeology-department', label: n('Mysore Archaeological Department report lead', 'ಮೈಸೂರು ಪುರಾತತ್ವ ಇಲಾಖೆ ವರದಿ ದಾರಿ'), terms: ['mysore archaeological department', 'annual report', 'ಮೈಸೂರು ಪುರಾತತ್ವ'], anchorTerms: ['mysore archaeological department', 'ಮೈಸೂರು ಪುರಾತತ್ವ'], targetRecordIds: ['polity-mysore', 'place-mysuru'] },
  { id: 'archive-hint-epigraphia-carnatica-mandya', label: n('Epigraphia Carnatica Mysore/Mandya lead', 'ಎಪಿಗ್ರಾಫಿಯಾ ಕರ್ನಾಟಿಕಾ ಮೈಸೂರು/ಮಂಡ್ಯ ದಾರಿ'), terms: ['epigraphia carnatica', 'mandya', 'mysore district'], anchorTerms: ['epigraphia carnatica'], targetRecordIds: ['polity-hoysala', 'place-mysuru'] },
  { id: 'archive-hint-ballari-stone-age', label: n('Ballari stone-age lead', 'ಬಳ್ಳಾರಿ ಶಿಲಾಯುಗ ದಾರಿ'), terms: ['ballary', 'ballari', 'stone age', 'sanganakallu'], anchorTerms: ['ballary', 'ballari'], targetRecordIds: ['district-history-ballari-sanganakallu-kupgal-neolithic-complex', 'district-history-ballari-archaeological-landscape'] },
  { id: 'archive-hint-mysore-wodeyar-history', label: n('Wodeyars of Mysore dynastic-history lead', 'ಮೈಸೂರು ಒಡೆಯರ್ ವಂಶ ಚರಿತ್ರೆ ದಾರಿ'), terms: ['wodeyar', 'wadiyar', 'wadeyar', 'yaduraya', 'ಒಡೆಯರ್'], anchorTerms: ['wodeyar', 'wadiyar', 'wadeyar', 'ಒಡೆಯರ್'], targetRecordIds: ['polity-mysore', 'person-yaduraya', 'place-mysuru'] },
  { id: 'archive-hint-tipu-sultan-life', label: n('Tipu Sultan life and achievements lead', 'ಟಿಪ್ಪು ಸುಲ್ತಾನ್ ಜೀವನ ಮತ್ತು ಸಾಧನೆಗಳ ದಾರಿ'), terms: ['tipu sultan', 'tippu sultan', 'srirangapatna', 'seringapatam'], anchorTerms: ['tipu sultan', 'tippu sultan'], targetRecordIds: ['person-tipu-sultan', 'culture-srirangapatna-fort', 'polity-mysore'] },
]

const review = { status: 'needs-review', reviewer: null, updatedAt: new Date().toISOString().slice(0, 10) }
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90)
const normaliseArray = value => Array.isArray(value) ? value : value ? [value] : []
const archiveUrl = identifier => `https://archive.org/details/${identifier}`
const fileUrl = (identifier, name) => `https://archive.org/download/${identifier}/${encodeURIComponent(name)}`
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const termCount = (text, term) => (text.match(new RegExp(/[a-z0-9]/i.test(term[0]) ? `\\b${escapeRegex(term)}\\b` : escapeRegex(term), 'gi')) || []).length
const documentKindFor = title => {
  if (/coin/i.test(title)) return 'coin-catalogue'
  if (/epigraphia|inscription/i.test(title)) return 'epigraphy-corpus'
  if (/annual report/i.test(title)) return 'archaeology-report'
  if (/stone age|neolithic|prehistor/i.test(title)) return 'archaeology-report'
  if (/adhyayana|adhyay|journal|studies/i.test(title)) return 'research-journal'
  return 'archaeology-report'
}
const locatorCandidates = text => {
  const lines = text.split(/\r?\n/)
  return locatorTargets.map(target => {
    const matchedTerms = target.terms.map(term => ({ term, count: termCount(text, term) })).filter(item => item.count > 0)
    const matchCount = matchedTerms.reduce((sum, item) => sum + item.count, 0)
    const anchorCount = target.anchorTerms.reduce((sum, term) => sum + termCount(text, term), 0)
    if (!matchCount || !anchorCount) return null
    const firstLineIndex = lines.findIndex(line => target.terms.some(term => termCount(line, term) > 0))
    return {
      id: target.id,
      label: target.label,
      targetRecordIds: target.targetRecordIds,
      matchedTerms: matchedTerms.sort((a, b) => b.count - a.count).map(item => item.term),
      matchCount,
      firstOcrLine: firstLineIndex >= 0 ? firstLineIndex + 1 : null,
      status: 'needs-page-image-review',
      reviewNote: n('OCR term match only; verify against the printed page and item locator before using as evidence.', 'OCR ಪದ ಹೊಂದಾಣಿಕೆ ಮಾತ್ರ; ಸಾಕ್ಷ್ಯವಾಗಿ ಬಳಸುವ ಮೊದಲು ಮುದ್ರಿತ ಪುಟ ಮತ್ತು ಕಡತ ಸ್ಥಾನಸೂಚಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.'),
    }
  }).filter(Boolean).sort((a, b) => b.matchCount - a.matchCount).slice(0, 6)
}

async function fetchJson(url, attempts = 3) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'karnata-sanchaya-archaeology-import/0.1' }, signal: AbortSignal.timeout(20000) })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
      return await response.json()
    } catch (error) {
      lastError = error
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, 500 * attempt))
    }
  }
  throw lastError
}

// Loads the previously generated output (if any) so a re-run can fall back to a prior
// capture instead of silently dropping an identifier on a transient fetch failure, and
// so already-sampled OCR locator signals survive even if this run's sample budget
// (KARCH_TEXT_SAMPLE_ROWS) doesn't reach that identifier again.
async function loadPrevious() {
  const recordsByIdentifier = new Map()
  const sourcesById = new Map()
  if (!existsSync(output)) return { recordsByIdentifier, sourcesById }
  const previous = await import(`${output.href}?t=${Date.now()}`)
  for (const record of previous.karnatakaArchaeologyTexts || []) if (record.archiveIdentifier) recordsByIdentifier.set(record.archiveIdentifier, record)
  for (const source of previous.karnatakaArchaeologySources || []) sourcesById.set(source.id, source)
  return { recordsByIdentifier, sourcesById }
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

async function discoverIdentifiers() {
  const found = new Set(seedIdentifiers)
  const collectionQuery = collections.map(collection => `collection:${collection}`).join(' OR ')
  const params = new URLSearchParams({ q: `(${collectionQuery})`, rows: String(rows), page: '1', output: 'json' })
  params.append('fl[]', 'identifier')
  try {
    const data = await fetchJson(`https://archive.org/advancedsearch.php?${params}`)
    for (const doc of data.response?.docs || []) if (doc.identifier) found.add(doc.identifier)
  } catch (error) {
    console.warn(`Collection search failed (continuing with seed identifiers only): ${error.message}`)
  }
  return [...found]
}

async function discover() {
  const localRecords = localArchiveDir ? await discoverLocal(localArchiveDir) : []
  if (!includeNetwork) return { records: localRecords, sources: [] }
  const { recordsByIdentifier: previousByIdentifier, sourcesById: previousSourcesById } = await loadPrevious()
  const discovered = await discoverIdentifiers()
  // Union with previously-captured identifiers so an item that drops out of this run's
  // search/seed results (e.g. transient indexing gaps) is never silently forgotten.
  const identifiers = [...new Set([...discovered, ...previousByIdentifier.keys()])]
  const metadataRows = await mapLimit(identifiers, concurrency, async identifier => {
    try {
      return { identifier, metadata: await fetchJson(`https://archive.org/metadata/${identifier}`) }
    } catch (error) {
      return { identifier, error: error.message }
    }
  })
  const records = []
  const sources = []
  let carriedOver = 0
  let sampledCount = 0
  for (const { identifier, metadata, error } of metadataRows) {
    const previousRecord = previousByIdentifier.get(identifier)
    if (!metadata?.metadata) {
      if (previousRecord) {
        records.push(previousRecord)
        const previousSource = previousSourcesById.get(previousRecord.citation?.sourceId)
        if (previousSource) sources.push(previousSource)
        carriedOver += 1
        console.warn(`Carried over previously-captured record for ${identifier} (fresh fetch failed: ${error})`)
      } else {
        console.warn(`Skipping ${identifier}: metadata fetch failed and no previous capture exists (${error})`)
      }
      continue
    }
    const title = metadata.metadata.title || identifier
    const textFiles = (metadata.files || []).filter(file => file.name?.endsWith('.txt') && ['DjVuTXT', 'Text', 'Plain Text'].includes(file.format || 'DjVuTXT'))
    if (!textFiles.length) {
      if (previousRecord) { records.push(previousRecord); const previousSource = previousSourcesById.get(previousRecord.citation?.sourceId); if (previousSource) sources.push(previousSource); carriedOver += 1 }
      continue
    }
    const textFile = textFiles.find(file => /_djvu\.txt$/i.test(file.name)) || textFiles[0]
    // Always re-sample within budget (never skip because a prior run already sampled it):
    // locatorTargets evolves over time, and a book sampled before a new target was added
    // must still be re-matched against the current target list, not frozen at its old result.
    const shouldSampleText = textSampleRows > 0 && sampledCount < textSampleRows
    if (shouldSampleText) sampledCount += 1
    const previouslySampled = previousRecord?.ocrSignalStatus === 'sampled' && previousRecord.locatorCandidates
    let locatorResult
    let ocrSignalStatus
    if (shouldSampleText) {
      const text = await fetch(fileUrl(identifier, textFile.name), { headers: { 'User-Agent': 'karnata-sanchaya-archaeology-import/0.1' }, signal: AbortSignal.timeout(20000) }).then(response => response.ok ? response.text() : '').catch(fetchError => { console.warn(`OCR text fetch failed for ${identifier} (continuing without a sample): ${fetchError.message}`); return '' })
      if (text) {
        locatorResult = locatorCandidates(text)
        ocrSignalStatus = 'sampled'
      } else if (previouslySampled) {
        // This run's text fetch failed transiently; fall back to the last successful sample
        // rather than regressing a previously-populated locator-candidate list to empty.
        locatorResult = previousRecord.locatorCandidates
        ocrSignalStatus = previousRecord.ocrSignalStatus
      } else {
        locatorResult = []
        ocrSignalStatus = 'not-sampled'
      }
    } else if (previouslySampled) {
      locatorResult = previousRecord.locatorCandidates
      ocrSignalStatus = previousRecord.ocrSignalStatus
    } else {
      locatorResult = []
      ocrSignalStatus = 'not-sampled'
    }
    const documentKind = documentKindFor(title)
    const creators = normaliseArray(metadata.metadata.creator).map(String)
    const year = Number(metadata.metadata.year || String(metadata.metadata.date || '').slice(0, 4)) || null
    const itemUrl = archiveUrl(identifier)
    const sourceId = `src-ia-karnataka-archaeology-${slug(identifier)}`
    sources.push({
      id: sourceId,
      type: 'digitised-archive-item',
      title: n(title, title),
      authors: creators.length ? creators : ['Unknown / uncredited'],
      year,
      url: itemUrl,
      scope: n(
        `Digitised item from the Karnataka Archaeology collection on the Internet Archive (${documentKind.replace(/-/g, ' ')}). Full-text OCR is available for term-level discovery; verify against the page image before citing specific facts.`,
        `ಇಂಟರ್ನೆಟ್ ಆರ್ಕೈವ್‌ನ ಕರ್ನಾಟಕ ಆರ್ಕಿಯಾಲಜಿ ಸಂಗ್ರಹದ ಡಿಜಿಟಲೀಕರಿಸಿದ ಕಡತ (${documentKind.replace(/-/g, ' ')}). ಪದ-ಮಟ್ಟದ ಅನ್ವೇಷಣೆಗೆ ಪೂರ್ಣಪಠ್ಯ OCR ಲಭ್ಯವಿದೆ; ನಿರ್ದಿಷ್ಟ ಸಂಗತಿಗಳನ್ನು ಉಲ್ಲೇಖಿಸುವ ಮೊದಲು ಪುಟದ ಚಿತ್ರದೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ.`,
      ),
      review,
    })
    records.push({
      id: `archive-karch-${slug(identifier)}`,
      name: n(title, title),
      archiveIdentifier: identifier,
      title,
      creators,
      year,
      documentKind,
      sourceCollections: normaliseArray(metadata.metadata.collection).filter(value => collections.includes(value) || value === 'ServantsOfKnowledge' || value === 'JaiGyan'),
      itemUrl,
      textFile: { name: textFile.name, url: fileUrl(identifier, textFile.name), format: textFile.format || 'DjVuTXT', size: Number(textFile.size) || null },
      ocrSignalStatus,
      locatorCandidates: locatorResult,
      citation: { sourceId, locator: `${identifier}/${textFile.name}; OCR discovery only, verify against page image before citation` },
      review,
    })
  }
  if (carriedOver) console.log(`Carried over ${carriedOver} previously-captured record(s) that could not be freshly refreshed this run.`)
  return { records: [...localRecords, ...records].sort((a, b) => a.title.localeCompare(b.title)), sources }
}

async function discoverLocal(rootDir) {
  const children = await readdir(rootDir, { withFileTypes: true })
  const folders = children.filter(item => item.isDirectory()).map(item => path.join(rootDir, item.name))
  const records = []
  for (const folder of folders) {
    const files = await readdir(folder)
    const textName = files.find(name => name.endsWith('_djvu.txt')) || files.find(name => name.endsWith('.txt'))
    if (!textName) continue
    const identifier = path.basename(folder)
    const title = identifier
    const text = await readFile(path.join(folder, textName), 'utf8')
    const info = await stat(path.join(folder, textName))
    const sourceId = `src-ia-karnataka-archaeology-${slug(identifier)}`
    records.push({
      id: `archive-karch-local-${slug(identifier)}`,
      name: n(title, title),
      archiveIdentifier: identifier,
      title,
      creators: [],
      year: null,
      documentKind: documentKindFor(title),
      sourceCollections: ['local-cache'],
      itemUrl: archiveUrl(identifier),
      textFile: { name: textName, url: fileUrl(identifier, textName), format: 'DjVuTXT', size: info.size, localCache: true },
      ocrSignalStatus: 'local-sampled',
      locatorCandidates: locatorCandidates(text),
      citation: { sourceId, locator: `${identifier}/${textName}; local OCR cache indexed; OCR discovery only, verify against page image before citation` },
      review,
    })
  }
  return records
}

const { records, sources } = await discover()
const generated = `// Generated by scripts/import-karnataka-archaeology.mjs from Internet Archive metadata and OCR text derivatives.
// Re-run this script to pick up newly uploaded items in the KarnatakaArchaeology collection; because
// Archive.org's search index can lag behind a real upload by days, add a brand-new item's identifier to
// KARCH_SEED_IDENTIFIERS immediately rather than waiting for it to appear in collection search.
// OCR signals are discovery aids only; promoted facts must cite the printed page and page image.
export const karnatakaArchaeologyTexts = ${JSON.stringify(records, null, 2)}
export const karnatakaArchaeologySources = ${JSON.stringify(sources, null, 2)}
`
await writeFile(output, generated)
console.log(`Generated ${records.length} Karnataka Archaeology text records and ${sources.length} citeable sources in ${output.pathname}`)
