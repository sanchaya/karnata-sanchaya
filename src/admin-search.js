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
