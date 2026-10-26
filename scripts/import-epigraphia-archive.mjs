#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const output = new URL('../src/data/epigraphia-archive.generated.js', import.meta.url)
const rows = Number(process.env.EPIGRAPHIA_ARCHIVE_ROWS || process.argv[2] || 640)
const textSampleRows = Number(process.env.EPIGRAPHIA_ARCHIVE_TEXT_SAMPLE_ROWS || 80)
const concurrency = Number(process.env.EPIGRAPHIA_ARCHIVE_CONCURRENCY || 8)
const localArchiveDir = process.env.EPIGRAPHIA_LOCAL_ARCHIVE_DIR || ''
const includeNetwork = process.env.EPIGRAPHIA_ARCHIVE_INCLUDE_NETWORK === '1' || !localArchiveDir
const collections = (process.env.EPIGRAPHIA_ARCHIVE_COLLECTIONS || 'JaiGyan,ServantsOfKnowledge').split(',').map(value => value.trim()).filter(Boolean)
const seedIdentifiers = ['iisb.epigraphiacarnat0000unse.vol.7','isb.epicraphiacarnat0000unse.vol.8','isb.epigraphiacarnat00000une.vol.3','isb.epigraphiacarnat0000unse.vol.10','isb.epigraphiacarnat0000unse.vol.11','isb.epigraphiacarnat0000unse.vol.12','isb.epigraphiacarnat0000unse.vol.5','isb.epigraphiacarnat0000unse.vol.7','isb.epigraphiacarnat0000unse.volu.24','isb.epigraphiacarnat0000unse_g7l3.volu.25','isb.epigraphiakarnat0000unse.vol.4','isb.epigraphiyakarna000000unse.vol.9']
const epigraphyPattern = /(epigraph(?:ia|y|ical|s)?|inscriptions?|shasana(?:galu|gala)?|sasana(?:galu|gala)?|archaeological survey of mysore|mysore archaeological department|directorate of archaeology.*karnataka|copper plate inscription)/i
const excludePattern = /(epigenetic|epigenetics|epigram|epigrams|hesperidin|prostate|tomato|epigraphia birmanica)/i
const karnatakaTitlePattern = /(carnatica|karnataka|kannada|kanarese|mysore|coorg|ballari|bellary|koppal|vijayanagara|hampi|dharwad|dharwar|kalaburagi|gulbarga|raichur|chitradurga|shimoga|shivamogga|hassan|tumkur|kolar|kadamba|chalukya|rashtrakuta|hoysala|ganga|ratta|adilshahi|savadatti|suttur)/i
const signalTerms = ['kannada', 'kanarese', 'carnatica', 'mysore', 'coorg', 'kolar', 'hassan', 'tumkur', 'shimoga', 'dharwar', 'belgaum', 'ballari', 'bellary', 'koppal', 'raichur', 'gulbarga', 'kalaburagi', 'bijapur', 'vijayapura', 'hampi', 'chalukya', 'kadamba', 'ganga', 'rashtrakuta', 'hoysala', 'vijayanagara', 'alupa', 'ratta', 'adil shahi', 'keladi', 'ikkeri', 'wodeyar']
const n = (en, kn) => ({ en, kn })
const locatorTargets = [
  { id: 'archive-hint-talagunda-kadamba', label: n('Talagunda / Kadamba genealogy lead', 'ತಾಳಗುಂದ / ಕದಂಬ ವಂಶಾವಳಿ ದಾರಿ'), terms: ['talagunda', 'kadamba', 'kakusthavarma', 'mayurasharma'], anchorTerms: ['talagunda', 'kakusthavarma', 'mayurasharma'], targetRecordIds: ['inscription-talagunda', 'edition-inscription-talagunda', 'script-southern-brahmi-kadamba-transition'] },
  { id: 'archive-hint-halmidi-old-kannada', label: n('Halmidi / early Kannada lead', 'ಹಲ್ಮಿಡಿ / ಆರಂಭಿಕ ಕನ್ನಡ ದಾರಿ'), terms: ['halmidi', 'kadamba', 'kannada'], anchorTerms: ['halmidi'], targetRecordIds: ['inscription-halmidi', 'edition-inscription-halmidi-review-packet', 'script-old-kannada-epigraphic-phase'] },
  { id: 'archive-hint-shravanabelagola-ganga', label: n('Shravanabelagola / Western Ganga lead', 'ಶ್ರವಣಬೆಳಗೊಳ / ಪಶ್ಚಿಮ ಗಂಗ ದಾರಿ'), terms: ['shravanabelagola', 'sravana belgola', 'ganga', 'chamundaraya'], anchorTerms: ['shravanabelagola', 'sravana belgola', 'chamundaraya'], targetRecordIds: ['inscription-shravanabelagola', 'edition-inscription-shravanabelagola-cluster', 'edition-inscription-tyagada-brahmadeva'] },
  { id: 'archive-hint-begur-bengaluru', label: n('Begur / Bengaluru place-name lead', 'ಬೇಗೂರು / ಬೆಂಗಳೂರು ಸ್ಥಳನಾಮ ದಾರಿ'), terms: ['begur', 'bengaluru', 'bangalore'], anchorTerms: ['begur', 'bengaluru', 'bangalore'], targetRecordIds: ['inscription-begur', 'edition-inscription-begur', 'script-early-kannada-verse-transition'] },
  { id: 'archive-hint-atakur-rashtrakuta', label: n('Atakur / Rashtrakuta hero-stone lead', 'ಆತಕೂರು / ರಾಷ್ಟ್ರಕೂಟ ವೀರಗಲ್ಲು ದಾರಿ'), terms: ['atakur', 'atakuru', 'rashtrakuta', 'krishna iii'], anchorTerms: ['atakur', 'atakuru'], targetRecordIds: ['inscription-atakur', 'edition-inscription-atakur', 'script-early-kannada-verse-transition'] },
  { id: 'archive-hint-lakkundi-chalukya', label: n('Lakkundi / Kalyani Chalukya lead', 'ಲಕ್ಕುಂಡಿ / ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯ ದಾರಿ'), terms: ['lakkundi', 'chalukya', 'kalyani'], anchorTerms: ['lakkundi', 'kalyani'], targetRecordIds: ['inscription-lakkundi', 'edition-inscription-lakkundi', 'script-medieval-kannada-temple-epigraphy'] },
  { id: 'archive-hint-belur-hoysala', label: n('Belur / Hoysala temple epigraphy lead', 'ಬೇಲೂರು / ಹೊಯ್ಸಳ ದೇವಾಲಯ ಶಾಸನ ದಾರಿ'), terms: ['belur', 'hoysala', 'vishnuvardhana'], anchorTerms: ['belur', 'vishnuvardhana'], targetRecordIds: ['inscription-belur-foundation', 'edition-inscription-belur-foundation', 'script-medieval-kannada-temple-epigraphy'] },
  { id: 'archive-hint-hampi-vijayanagara', label: n('Hampi / Vijayanagara inscription lead', 'ಹಂಪಿ / ವಿಜಯನಗರ ಶಾಸನ ದಾರಿ'), terms: ['hampi', 'vijayanagara', 'vijayanagar', 'krishnadevaraya'], anchorTerms: ['hampi', 'krishnadevaraya'], targetRecordIds: ['inscription-hampi', 'edition-inscription-hampi-cluster', 'edition-inscription-hampi-krishna-temple', 'script-vijayanagara-kannada-nagari-mixed-phase'] },
  { id: 'archive-hint-doddahundi-nishidhi', label: n('Doddahundi / nishidhi lead', 'ದೊಡ್ಡಹುಂಡಿ / ನಿಷಿಧಿ ದಾರಿ'), terms: ['doddahundi', 'nishidhi', 'ganga'], anchorTerms: ['doddahundi', 'nishidhi'], targetRecordIds: ['inscription-doddahundi-nishidhi', 'edition-inscription-doddahundi-nishidhi'] },
  { id: 'archive-hint-muktesvara-attiraja', label: n('Muktesvara / Attiraja construction lead', 'ಮುಕ್ತೇಶ್ವರ / ಅತ್ತಿರಾಜ ನಿರ್ಮಾಣ ದಾರಿ'), terms: ['muktesvara', 'mukteshvara', 'attiraja', 'chaudayyadanapura'], anchorTerms: ['muktesvara', 'mukteshvara', 'attiraja', 'chaudayyadanapura'], targetRecordIds: ['inscription-muktesvara-attiraja-construction', 'edition-inscription-muktesvara-attiraja-review-packet', 'script-medieval-kannada-temple-epigraphy'] },
  { id: 'archive-hint-badami-chalukya-rulers', label: n('Badami Chalukya rulers and capitals lead', 'ಬಾದಾಮಿ ಚಾಳುಕ್ಯ ಅರಸರು ಮತ್ತು ರಾಜಧಾನಿಗಳ ದಾರಿ'), terms: ['badami', 'vatapi', 'pulakesi', 'pulakeshin', 'mangalesha', 'vikramaditya', 'aihole', 'pattadakal'], anchorTerms: ['badami', 'vatapi', 'pulakesi', 'pulakeshin'], targetRecordIds: ['polity-badami-chalukya', 'place-badami', 'person-pulakeshin-ii'] },
  { id: 'archive-hint-kalyani-chalukya-rulers', label: n('Kalyani Chalukya rulers and inscriptions lead', 'ಕಲ್ಯಾಣಿ ಚಾಳುಕ್ಯ ಅರಸರು ಮತ್ತು ಶಾಸನಗಳ ದಾರಿ'), terms: ['kalyani chalukya', 'chalukyas of kalyana', 'vikramaditya vi', 'someshvara', 'basavakalyan'], anchorTerms: ['kalyani chalukya', 'chalukyas of kalyana', 'basavakalyan'], targetRecordIds: ['polity-kalyani-chalukya', 'place-basavakalyana-community'] },
  { id: 'archive-hint-rashtrakuta-rulers', label: n('Rashtrakuta rulers and Manyakheta lead', 'ರಾಷ್ಟ್ರಕೂಟ ಅರಸರು ಮತ್ತು ಮಾನ್ಯಖೇಟ ದಾರಿ'), terms: ['rashtrakuta', 'amoghavarsha', 'govinda iii', 'krishna iii', 'manyakheta', 'malkhed'], anchorTerms: ['rashtrakuta', 'amoghavarsha', 'manyakheta', 'malkhed'], targetRecordIds: ['polity-rashtrakuta', 'person-amoghavarsha-i', 'place-manyakheta'] },
  { id: 'archive-hint-western-ganga-rulers', label: n('Western Ganga rulers and Talakad lead', 'ಪಶ್ಚಿಮ ಗಂಗ ಅರಸರು ಮತ್ತು ತಲಕಾಡು ದಾರಿ'), terms: ['western ganga', 'durvinita', 'sripurusha', 'shivamara', 'talakad'], anchorTerms: ['western ganga', 'durvinita', 'sripurusha', 'talakad'], targetRecordIds: ['polity-western-ganga', 'person-sripurusha', 'place-talakad'] },
  { id: 'archive-hint-alupa-coastal-rulers', label: n('Alupa rulers and coastal Karnataka lead', 'ಆಳ್ವ ಅರಸರು ಮತ್ತು ಕರಾವಳಿ ಕರ್ನಾಟಕ ದಾರಿ'), terms: ['alupa', 'alva', 'udayavara', 'mangaluru', 'mangalore'], anchorTerms: ['alupa', 'udayavara'], targetRecordIds: ['polity-alupa', 'place-mangaluru'] },
  { id: 'archive-hint-ratta-savadatti', label: n('Ratta rulers of Savadatti lead', 'ಸವದತ್ತಿಯ ರಟ್ಟ ಅರಸರ ದಾರಿ'), terms: ['ratta', 'rattas', 'savadatti', 'saundatti'], anchorTerms: ['ratta', 'rattas', 'savadatti', 'saundatti'], targetRecordIds: ['audit-belagavi'] },
  { id: 'archive-hint-adil-shahi-rulers', label: n('Adil Shahi rulers and Vijayapura inscriptions lead', 'ಆದಿಲ್ ಶಾಹಿ ಅರಸರು ಮತ್ತು ವಿಜಯಪುರ ಶಾಸನಗಳ ದಾರಿ'), terms: ['adil shahi', 'adillshahi', 'ibrahim adil', 'ali adil', 'bijapur', 'vijayapura'], anchorTerms: ['adil shahi', 'adillshahi', 'ibrahim adil', 'ali adil'], targetRecordIds: ['external-polity-adil-shahi', 'place-vijayapura'] },
  { id: 'archive-hint-keladi-ikkeri-rulers', label: n('Keladi–Ikkeri rulers lead', 'ಕೆಳದಿ–ಇಕ್ಕೇರಿ ಅರಸರ ದಾರಿ'), terms: ['keladi', 'ikkeri', 'shivappa nayaka', 'keladi chennamma'], anchorTerms: ['keladi', 'ikkeri'], targetRecordIds: ['external-polity-keladi-nayaka', 'place-keladi', 'place-ikkeri', 'event-keladi-nayaka-governance'] },
  { id: 'archive-hint-chitradurga-nayaka-rulers', label: n('Chitradurga Nayaka rulers lead', 'ಚಿತ್ರದುರ್ಗ ನಾಯಕ ಅರಸರ ದಾರಿ'), terms: ['chitradurga nayaka', 'madakari nayaka', 'palegar of chitradurga'], anchorTerms: ['chitradurga nayaka', 'madakari nayaka'], targetRecordIds: ['polity-chitradurga-nayaka', 'place-chitradurga'] },
  { id: 'archive-hint-mysore-wodeyar-rulers', label: n('Mysore Wodeyar rulers and inscriptions lead', 'ಮೈಸೂರು ಒಡೆಯರು ಮತ್ತು ಶಾಸನಗಳ ದಾರಿ'), terms: ['wodeyar', 'wadiyar', 'kanthirava', 'chikka devaraja', 'srirangapatna', 'seringapatam'], anchorTerms: ['wodeyar', 'wadiyar', 'kanthirava', 'chikka devaraja'], targetRecordIds: ['polity-mysore', 'place-mysuru', 'place-srirangapatna'] },
]
const locatorTargetReplacements = {
  'polity-ratta-saundatti': ['audit-belagavi'],
  'place-saundatti': [],
  'polity-bijapur-sultanate': ['external-polity-adil-shahi'],
  'polity-keladi': ['external-polity-keladi-nayaka'],
  'person-shivappa-nayaka': ['place-keladi'],
  'person-keladi-chennamma': ['place-ikkeri', 'event-keladi-nayaka-governance'],
}
const normalizeLocatorTargets = record => ({ ...record, locatorCandidates: (record.locatorCandidates || []).map(candidate => ({ ...candidate, targetRecordIds: [...new Set(candidate.targetRecordIds.flatMap(id => locatorTargetReplacements[id] ?? [id]))] })) })

const review = { status: 'needs-review', reviewer: null, updatedAt: '2026-10-25' }
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90)
const normaliseArray = value => Array.isArray(value) ? value : value ? [value] : []
const archiveUrl = identifier => `https://archive.org/details/${identifier}`
const fileUrl = (identifier, name) => `https://archive.org/download/${identifier}/${encodeURIComponent(name)}`
const preferredTextFile = metadata => {
  const files = (metadata.files || []).filter(file => file.name?.endsWith('.txt') && ['DjVuTXT', 'Text', 'Plain Text'].includes(file.format || 'DjVuTXT'))
  return files.find(file => /_djvu\.txt$/i.test(file.name)) || files[0] || null
}
const signalCounts = text => {
  const lower = text.toLowerCase()
  return Object.fromEntries(signalTerms.map(term => [term, (lower.match(new RegExp(`\\b${term}\\b`, 'g')) || []).length]).filter(([, count]) => count > 0))
}
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const termCount = (text, term) => (text.match(new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi')) || []).length
const administrativeAliases = new Map(Object.entries({
  'taluk:bagevadi': ['Basavana Bagewadi', 'karnataka', 'approximate'],
  'taluk:bellary': ['Ballari', 'karnataka', 'approximate'],
  'taluk:bowringpet': ['Bangarpet', 'karnataka', 'approximate'],
  'taluk:chikballapur': ['Chikkaballapur', 'karnataka', 'approximate'],
  'taluk:cincoli': ['Chincholi', 'karnataka', 'approximate'],
  'taluk:hagaribomanahalli': ['Hagaribommanahalli', 'karnataka', 'exact'],
  'taluk:hubli': ['Hubballi', 'karnataka', 'approximate'],
  'taluk:kumata': ['Kumta', 'karnataka', 'approximate'],
  'taluk:lingasuguru': ['Lingsugur', 'karnataka', 'approximate'],
  'taluk:miidgere': ['Mudigere', 'karnataka', 'approximate'],
  'taluk:mundaragi': ['Mundargi', 'karnataka', 'approximate'],
  'taluk:pavugada': ['Pavagada', 'karnataka', 'approximate'],
  'taluk:shiggavi': ['Shiggaon', 'karnataka', 'approximate'],
  'taluk:shiratti': ['Shirahatti', 'karnataka', 'approximate'],
  'taluk:somavarapet': ['Somwarpet', 'karnataka', 'approximate'],
  'taluk:yalan­duru': ['Yelandur', 'karnataka', 'approximate'],
  'taluk:yalanduru': ['Yelandur', 'karnataka', 'approximate'],
  'taluk:yalburga': ['Yelburga', 'karnataka', 'approximate'],
  'village:sravanabejgola': ['Shravanabelagola', 'karnataka', 'approximate'],
  'district:bellary': ['Ballari', 'karnataka', 'approximate'],
  'district:chithradurga': ['Chitradurga', 'karnataka', 'approximate'],
  'district:gulabarga': ['Kalaburagi', 'karnataka', 'approximate'],
  'district:gulbarga': ['Kalaburagi', 'karnataka', 'approximate'],
  'district:kadur': ['Chikkamagaluru', 'karnataka', 'approximate'],
  'district:mysore': ['Mysuru', 'karnataka', 'approximate'],
  'district:shimoga': ['Shivamogga', 'karnataka', 'approximate'],
  'district:tumkur': ['Tumakuru', 'karnataka', 'approximate'],
}).map(([key, [normalizedName, scope, certainty]]) => [key.replace(/[^a-z:]/g, ''), { normalizedName, scope, certainty }]))
const karnatakaTaluks = new Set('afzalpur alur bagalkot bagepalli bankapur ballari byadgi challakere chikkaballapur chintamani chitapur dharwad gadag gubbi gundlupet hagaribommanahalli hangal haveri hirekerur honnali honnavar hosapete hubballi hungund kalghatagi kolar kumta kundgol lingsugur mandya mudigere mulbagal mundargi nagamangala nargund navalgund pavagada ranebennur ron sedam shiggaon shirahatti somwarpet srinivaspur yelandur yelburga'.split(' '))
const karnatakaDistricts = new Set('bagalkot ballari belagavi bengaluru bengalururural bidar chamarajanagara chikkaballapur chikkamagaluru chitradurga dakshinakannada davanagere dharwad gadag hassan haveri kalaburagi kodagu kolar koppal mandya mysuru raichur ramanagara shivamogga tumakuru udupi uttarakannada vijayapura yadgir'.split(' '))
const karnatakaRegions = new Set('channarayapattana chikkodi huligi kalaburagi kurugodu shahapura teerthahalli'.split(' '))
const outsideKarnatakaTaluks = new Set('adoni bhimavaram chidambaram chingleput dabhoi elaru eluru gudiyattam hindupur junnar kakinada kumool madakasira nandigama narasaradopeta narasaraopeta palnad palnadu proddutur srivaikuntam tanuku tenali tiruchchendur'.split(' '))
const ocrNoise = /(?:\b(?:another|brahmanical|district|indian|neolithic|one|same)\b|\b(?:the|this)$|^[a-z]\.?\s*[a-z]?\.?$)/i
const administrativeKey = (level, name) => `${level}:${slug(name)}`
const normalizeAdministrativeMention = mention => {
  const alias = administrativeAliases.get(administrativeKey(mention.level, mention.name))
  const normalizedName = alias?.normalizedName || mention.name
  const normalizedSlug = slug(normalizedName)
  const scope = alias?.scope || (mention.level === 'district' && karnatakaDistricts.has(normalizedSlug) ? 'karnataka' : mention.level === 'region' && karnatakaRegions.has(normalizedSlug) ? 'karnataka' : mention.level === 'taluk' && karnatakaTaluks.has(normalizedSlug) ? 'karnataka' : mention.level === 'taluk' && outsideKarnatakaTaluks.has(normalizedSlug) ? 'outside-karnataka' : ocrNoise.test(mention.name) ? 'ocr-noise' : 'unresolved')
  const resolutionStatus = scope === 'karnataka' ? 'normalized-candidate' : scope === 'outside-karnataka' ? 'outside-project-scope' : scope === 'ocr-noise' ? 'rejected-ocr-noise' : 'needs-place-review'
  return { ...mention, normalizedName, scope, resolutionStatus, certainty: alias?.certainty || 'unknown', status: resolutionStatus === 'rejected-ocr-noise' ? 'rejected' : 'needs-review' }
}
const administrativeCoverage = (title, text) => {
  const mentions = []
  const add = (name, level, basis) => {
    const cleaned = String(name).replace(/\s+/g, ' ').replace(/^[^A-Za-z]+|[^A-Za-z.' -]+$/g, '').trim()
    if (cleaned.length < 3 || cleaned.length > 60 || /^(?:the|this|ancient|modern|karnataka|mysore archaeological)$/i.test(cleaned)) return
    const key = `${level}:${cleaned.toLowerCase()}`
    if (!mentions.some(item => item.key === key)) mentions.push({ key, name: cleaned, level, basis, status: 'needs-review' })
  }
  const titlePatterns = [
    [/^Epigraphia Carnatica\s+Inscriptions? In (.+?) District\b/i, 'district'],
    [/^Inscriptions? (?:In|Of) (?:The )?(.+?) District\b/i, 'district'],
    [/^Karnataka Shasanagalu.*?([A-Za-z]+) Jilleya\b/i, 'district'],
    [/^(.+?)\s+(?:talukina|thalukina|talokina|tallokina)\b/i, 'taluk'],
    [/^(.+?)\s+(?:jilleya|district)\b/i, 'district'],
    [/^(.+?)\s+(?:parisarada|pradeshada|pradeshadallina)\b/i, 'region'],
  ]
  for (const [pattern, level] of titlePatterns) {
    const match = title.match(pattern)
    if (match) { add(match[1], level, 'catalogue-title'); break }
  }
  for (const line of text.split(/\r?\n/).slice(0, 20000)) {
    const match = line.match(/\b([A-Z][A-Za-z.'-]+(?:\s+[A-Z][A-Za-z.'-]+){0,3})\s+(village|taluk|district)\b/)
    if (match) add(match[1], match[2].toLowerCase(), 'ocr-text')
    if (mentions.length >= 40) break
  }
  return mentions.map(({ key, ...mention }) => normalizeAdministrativeMention(mention))
}
const locatorCandidates = (text, title = '') => {
  const lines = text.split(/\r?\n/)
  const searchable = `${title}\n${text}`
  return locatorTargets.map(target => {
    const matchedTerms = target.terms.map(term => ({ term, count: termCount(searchable, term) })).filter(item => item.count > 0)
    const matchCount = matchedTerms.reduce((sum, item) => sum + item.count, 0)
    const anchorCount = target.anchorTerms.reduce((sum, term) => sum + termCount(searchable, term), 0)
    if (!matchCount || !anchorCount) return null
    const firstLineIndex = lines.findIndex(line => target.terms.some(term => new RegExp(`\\b${escapeRegex(term)}\\b`, 'i').test(line)))
    const titleMatch = target.terms.some(term => termCount(title, term) > 0)
    return {
      id: target.id,
      label: target.label,
      targetRecordIds: target.targetRecordIds,
      matchedTerms: matchedTerms.sort((a, b) => b.count - a.count).map(item => item.term),
      matchCount,
      matchBasis: titleMatch ? 'catalogue-title-and-ocr' : 'ocr',
      firstOcrLine: firstLineIndex >= 0 ? firstLineIndex + 1 : null,
      status: 'needs-page-image-review',
      reviewNote: n('OCR term match only; verify printed page, inscription number and image witness before using as evidence.', 'OCR ಪದ ಹೊಂದಾಣಿಕೆ ಮಾತ್ರ; ಸಾಕ್ಷ್ಯವಾಗಿ ಬಳಸುವ ಮೊದಲು ಮುದ್ರಿತ ಪುಟ, ಶಾಸನ ಸಂಖ್ಯೆ ಮತ್ತು ಚಿತ್ರ ಸಾಕ್ಷ್ಯವನ್ನು ಪರಿಶೀಲಿಸಿ.'),
    }
  }).filter(Boolean).sort((a, b) => b.matchCount - a.matchCount || String(a.firstOcrLine || '').localeCompare(String(b.firstOcrLine || ''))).slice(0, 8)
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'karnata-sanchaya-epigraphia-import/0.1' }, signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`)
  return response.json()
}

async function loadPreviousRecords() {
  if (!existsSync(output)) return []
  const previous = await import(`${output.href}?t=${Date.now()}`)
  return (previous.epigraphiaArchiveTexts || []).map(record => ({
    ...record,
    administrativeCoverage: [
      ...administrativeCoverage(record.title || '', ''),
      ...(record.administrativeCoverage || []).filter(mention => mention.basis === 'ocr-text').map(normalizeAdministrativeMention),
    ].filter((mention, index, all) => all.findIndex(item => administrativeKey(item.level, item.normalizedName) === administrativeKey(mention.level, mention.normalizedName)) === index),
  }))
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
  if (/south[- ]indian inscriptions/i.test(title)) return 'South Indian Inscriptions'
  if (/archaeological survey of mysore|mysore archaeological department|directorate of archaeology.*karnataka/i.test(title)) return 'Mysore/Karnataka Archaeology Reports'
  if (/shasana|sasana|inscriptions? of|inscriptions? in|copper plate inscription/i.test(title)) return 'Karnataka State and District Inscription Corpora'
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
  const previousRecords = await loadPreviousRecords()
  const collectionQuery = collections.map(collection => `collection:${collection}`).join(' OR ')
  const query = `(${collectionQuery}) AND (title:epig* OR title:inscription* OR title:shasana* OR title:sasana* OR title:\"archaeological survey of mysore\" OR title:\"mysore archaeological department\" OR title:\"directorate of archaeology\" OR title:\"copper plate inscription\")`
  const params = new URLSearchParams({
    q: query,
    rows: String(rows),
    page: '1',
    output: 'json',
    sort: 'downloads desc',
  })
  for (const field of ['identifier', 'title', 'creator', 'date', 'year', 'collection', 'subject', 'downloads']) params.append('fl[]', field)
  const data = await fetchJson(`https://archive.org/advancedsearch.php?${params}`)
  const discoveredCandidates = data.response?.docs || []
  const candidates = [...new Map([...discoveredCandidates, ...seedIdentifiers.map(identifier => ({ identifier, title: identifier, collection: ['local-cache'] }))].map(candidate => [candidate.identifier, candidate])).values()]
    .filter(item => epigraphyPattern.test(`${item.title || ''} ${normaliseArray(item.subject).join(' ')}`) && !excludePattern.test(item.title || ''))
    .sort((a, b) => Number(normaliseArray(b.collection).includes('ServantsOfKnowledge')) - Number(normaliseArray(a.collection).includes('ServantsOfKnowledge')) || Number(karnatakaTitlePattern.test(b.title || '')) - Number(karnatakaTitlePattern.test(a.title || '')) || (Number(b.downloads) || 0) - (Number(a.downloads) || 0))
  const records = []
  const metadataRows = await mapLimit(candidates, concurrency, async candidate => {
    try {
      return { candidate, metadata: await fetchJson(`https://archive.org/metadata/${candidate.identifier}`) }
    } catch (error) {
      return { candidate, error: error.message }
    }
  })
  const textRows = metadataRows.filter(item => item.metadata)
  const sampledTexts = new Map(await mapLimit(textRows.slice(0, textSampleRows), concurrency, async ({ candidate, metadata }) => {
    const textFile = preferredTextFile(metadata)
    if (!textFile) return [candidate.identifier, '']
    const text = await fetch(fileUrl(candidate.identifier, textFile.name), { signal: AbortSignal.timeout(10000) }).then(response => response.ok ? response.text() : '').catch(error => { console.warn(`OCR text fetch failed for ${candidate.identifier} (continuing without a sample): ${error.message}`); return '' })
    return [candidate.identifier, text]
  }))
  for (let index = 0; index < textRows.length; index += 1) {
    const { candidate, metadata } = textRows[index]
    const title = metadata.metadata?.title || candidate.title || candidate.identifier
    if (!epigraphyPattern.test(title) || excludePattern.test(title)) continue
    const textFile = preferredTextFile(metadata)
    if (!textFile) continue
    const shouldSampleText = textSampleRows > 0 && index < textSampleRows
    const text = shouldSampleText ? sampledTexts.get(candidate.identifier) || '' : ''
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
      administrativeCoverage: administrativeCoverage(title, text),
      locatorCandidates: locatorCandidates(text, title),
      citation: {
        sourceId: `src-ia-epigraphy-${slug(candidate.identifier)}`,
        locator: `${candidate.identifier}/${textFile.name}; OCR discovery only, verify against page image before citation`,
      },
      review,
    })
  }
  return [...new Map([...previousRecords, ...localRecords, ...records].map(record => [record.archiveIdentifier, record])).values()]
    .sort((a, b) => a.series.localeCompare(b.series) || String(a.volume || '').localeCompare(String(b.volume || '')) || a.title.localeCompare(b.title))
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
      administrativeCoverage: administrativeCoverage(title, text),
      locatorCandidates: locatorCandidates(text, title),
      citation: {
        sourceId: `src-ia-epigraphy-${slug(identifier)}`,
        locator: `${identifier}/${textName}; local OCR cache indexed; OCR discovery only, verify against page image before citation`,
      },
      review,
    })
  }
  return records
}

const records = (await discover()).map(normalizeLocatorTargets)
const generated = `// Generated by scripts/import-epigraphia-archive.mjs from Internet Archive metadata and OCR text derivatives.
// OCR signals are discovery aids only; promoted records must cite printed pages and page images.
export const epigraphiaArchiveTexts = ${JSON.stringify(records, null, 2)}
export const epigraphiaArchiveSources = ${JSON.stringify(records.map(record => ({
  id: record.citation.sourceId,
  type: 'digitised-epigraphical-volume',
  title: record.name,
  authors: record.creators.length ? record.creators : ['Unknown / uncredited'],
  year: record.year,
  url: record.itemUrl,
  repository: { platform: 'Internet Archive', identifier: record.archiveIdentifier, fullTextUrl: record.textFile.url },
  series: record.series,
  volume: record.volume,
  scope: n('Digitised epigraphical source indexed for OCR-assisted discovery. Verify the printed page image, inscription number and reading before citing a historical claim.', 'ಐತಿಹಾಸಿಕ ಹಕ್ಕುವಾದವನ್ನು ಉಲ್ಲೇಖಿಸುವ ಮೊದಲು ಮುದ್ರಿತ ಪುಟಚಿತ್ರ, ಶಾಸನ ಸಂಖ್ಯೆ ಮತ್ತು ಪಾಠವನ್ನು ಪರಿಶೀಲಿಸಬೇಕಾದ OCR-ಸಹಾಯಿತ ಅನ್ವೇಷಣಾ ಆಕರ.'),
  review,
})), null, 2)}
`
await writeFile(output, generated)
console.log(`Generated ${records.length} Epigraphia Archive text records in ${output.pathname}`)
