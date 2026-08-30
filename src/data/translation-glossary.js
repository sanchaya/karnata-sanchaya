// A shared EN -> KN reference dictionary for terms that recur across many bilingual {en, kn}
// fields in this dataset. Entries exist for two purposes:
//   1. Reference for anyone writing new bilingual content, so the same English term is not
//      translated differently by different contributors/passes.
//   2. Automated consistency checking (only where a specific wrong translation is known and can
//      be flagged safely without false positives -- see `appliesToId`/`forbiddenKn` below).
//
// This was added after a live example surfaced: "coinage lead" (an unverified research clue)
// was found mistranslated elsewhere as if "lead" meant the metal (ಸೀಸ) rather than a clue/pointer
// (ದಾರಿ). The dataset's own `-lead` id suffix convention (used on every "coinage-lead",
// "...-inscription-lead" style record) makes that specific case checkable with no ambiguity.
export const translationGlossary = [
  {
    id: 'evidence-lead',
    en: '"lead" as in an unverified research clue/pointer (e.g. "coinage lead")',
    kn: 'ದಾರಿ',
    altKn: ['ಸುಳಿವು'],
    note: 'Applies to the "-lead" id suffix convention used throughout coinRecords/inscriptions/etc. for hedged discovery leads. Never ಸೀಸ (the metal) -- that is a literal mistranslation of the wrong sense of "lead".',
    appliesToId: /-lead$/,
    forbiddenKn: [/ಸೀಸ/],
  },
  { id: 'discovery-lead', en: '"discovery lead" (a source not yet verified against the primary item)', kn: 'ಅನ್ವೇಷಣಾ ಸುಳಿವು', altKn: ['ಸಂಶೋಧನಾ ದಾರಿ'], note: 'Standard phrase for source.type: "discovery-lead" records.' },
  { id: 'coin', en: 'coin / coinage', kn: 'ನಾಣ್ಯ', note: 'Standard term across coinRecords.' },
  { id: 'copper-plate', en: 'copper plate / copper-plate grant', kn: 'ತಾಮ್ರಶಾಸನ', altKn: ['ತಾಮ್ರಫಲಕ'], note: 'Both forms are in active use; either is acceptable, prefer ತಾಮ್ರಶಾಸನ for the grant/edict itself and ತಾಮ್ರಫಲಕ when describing the physical plate object.' },
  { id: 'inscription', en: 'inscription', kn: 'ಶಾಸನ', note: 'Standard term for a stone or copper inscription.' },
  { id: 'grant', en: 'grant (formal land/revenue grant)', kn: 'ಅನುದಾನ', note: 'Use for administrative/land grants; see "donation" for religious gifts.' },
  { id: 'donation', en: 'donation / religious gift', kn: 'ದಾನ', note: 'Use for religious/temple gifts, as distinct from ಅನುದಾನ (formal administrative grants).' },
  { id: 'temple', en: 'temple', kn: 'ದೇವಾಲಯ', note: 'Standard term. ಬಸದಿ is not a synonym -- reserve it specifically for Jain basadis.' },
  { id: 'findspot', en: 'findspot', kn: 'ಪತ್ತೆಸ್ಥಳ', note: 'Location where an inscription/artifact/coin was found, as distinct from its current repository.' },
  { id: 'source', en: 'source (a work/publication)', kn: 'ಆಕರ', note: 'The cited work itself, as distinct from ಉಲ್ಲೇಖ (the citation/locator pointing into it).' },
  { id: 'citation', en: 'citation / reference locator', kn: 'ಉಲ್ಲೇಖ', note: 'The pointer into a source (page, item number, line); see ಆಕರ for the source itself.' },
  { id: 'dynasty', en: 'dynasty', kn: 'ವಂಶ', note: 'Standard term for a ruling family/lineage.' },
  { id: 'kingdom-polity', en: 'kingdom / polity', kn: 'ರಾಜ್ಯ', note: 'Standard term for a polity record.' },
  { id: 'verify-before-promotion', en: '"verify against X before promotion" (evidence hedge)', kn: 'ಪ್ರಚಾರಕ್ಕೂ ಮೊದಲು ... ಪರಿಶೀಲಿಸಿ', note: 'Standard closing hedge on discovery-lead source records.' },
]

const isBilingualPair = value => value && typeof value === 'object' && typeof value.en === 'string' && typeof value.kn === 'string'

// Generically walks a record for every {en, kn} shaped sub-object, mirroring the same walk
// pattern collectSourceUses() in Admin.jsx uses to find sourceId references -- so new bilingual
// fields are picked up automatically without needing to hardcode field names here.
function collectBilingualPairs(value, path = 'record', output = []) {
  if (Array.isArray(value)) value.forEach((item, index) => collectBilingualPairs(item, `${path}[${index}]`, output))
  else if (value && typeof value === 'object') {
    if (isBilingualPair(value)) output.push({ path, en: value.en, kn: value.kn })
    Object.entries(value).forEach(([key, item]) => { if (key !== 'en' && key !== 'kn') collectBilingualPairs(item, `${path}.${key}`, output) })
  }
  return output
}

// Checks one record against every glossary rule that has an automated check (appliesToId +
// forbiddenKn). Returns a flat list of {path, message} issues; empty when nothing is flagged.
// Deliberately conservative: only glossary entries with an unambiguous, id-scoped trigger get an
// automated check, to avoid false-positives from legitimate synonym variation in free text.
export function checkTranslationGlossary(record) {
  const checkableRules = translationGlossary.filter(rule => rule.appliesToId && rule.forbiddenKn?.length)
  if (!checkableRules.length || !record?.id) return []
  const applicable = checkableRules.filter(rule => rule.appliesToId.test(record.id))
  if (!applicable.length) return []
  const pairs = collectBilingualPairs(record)
  const issues = []
  for (const rule of applicable) {
    for (const pair of pairs) {
      const hit = rule.forbiddenKn.find(pattern => pattern.test(pair.kn))
      if (hit) issues.push({ path: pair.path, message: `Kannada text matches ${hit} but the English term "${rule.en}" should translate as "${rule.kn}" (glossary: ${rule.id}). ${rule.note}` })
    }
  }
  return issues
}

const containsKannadaScript = value => /[ಀ-೿]/.test(value)

// Flags a record's title/name when the Kannada side is empty or is just the English text copied
// verbatim -- the pattern bulk OCR importers (Epigraphia Archive, Karnataka Archaeology) leave
// behind because they only have an English archive-item title to work with. Scoped to name/title
// only (not every bilingual pair) so short, legitimately-identical fields like page locators don't
// false-positive.
export function checkMissingKannadaTranslation(record) {
  if (!record?.id) return []
  const issues = []
  for (const field of ['name', 'title']) {
    const pair = record[field]
    if (!pair || typeof pair !== 'object') continue
    const en = String(pair.en || '').trim()
    const kn = String(pair.kn || '').trim()
    if (!en) continue
    const looksTranslated = (kn && kn !== en) || containsKannadaScript(kn)
    if (!looksTranslated) issues.push({ path: field, message: `No Kannada translation yet for "${field}" (missing-kn) -- Kannada text is empty or identical to the English text. English is shown as a fallback until this is translated.` })
  }
  return issues
}
