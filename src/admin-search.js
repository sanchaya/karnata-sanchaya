export const languageValue = (value, locale = 'en') => {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  return String(value[locale] || '').trim()
}

export const localizedRecordTitle = (record, locale = 'en') => {
  const alternateLocale = locale === 'kn' ? 'en' : 'kn'
  return languageValue(record.name, locale) || languageValue(record.title, locale) || languageValue(record.name, alternateLocale) || languageValue(record.title, alternateLocale)
}

export const alternateRecordTitle = (record, locale = 'en') => {
  const primary = localizedRecordTitle(record, locale)
  const alternateLocale = locale === 'kn' ? 'en' : 'kn'
  const alternate = languageValue(record.name, alternateLocale) || languageValue(record.title, alternateLocale)
  return alternate && alternate !== primary ? alternate : ''
}

const containsKannadaScript = value => /[ಀ-೿]/.test(value)

// True when name/title has English text but no distinct Kannada translation yet (empty, or the
// English string copied verbatim) -- the pattern bulk OCR importers leave behind.
export const missingKannadaTranslation = record => {
  const en = languageValue(record.name, 'en') || languageValue(record.title, 'en')
  if (!en) return false
  const kn = languageValue(record.name, 'kn') || languageValue(record.title, 'kn')
  return !((kn && kn !== en) || containsKannadaScript(kn))
}

const searchableText = value => {
  if (value == null) return ''
  if (Array.isArray(value)) return value.map(searchableText).join(' ')
  if (typeof value === 'object') return Object.values(value).map(searchableText).join(' ')
  return String(value)
}

export const normalizeAdminSearch = value => String(value || '').normalize('NFKC').toLocaleLowerCase()

export const recordMatchesAdminSearch = (record, query) => {
  const normalizedQuery = normalizeAdminSearch(query)
  return !normalizedQuery || normalizeAdminSearch(searchableText(record)).includes(normalizedQuery)
}
