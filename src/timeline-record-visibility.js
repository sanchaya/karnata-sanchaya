const hasKannadaLanguage = record => (record.languages || []).some(language => /kannada/i.test(language))

// The specialist epigraphy and relations explorers retain the full research
// corpus. The primary atlas timeline is narrower: an inscription belongs there
// only when it is in Karnataka, is in Kannada, or carries an explicit direct
// Karnataka relevance marker.
export const isPrimaryAtlasInscription = record => (
  record.geographicScope?.outsideKarnataka !== true
  || hasKannadaLanguage(record)
  || record.karnatakaRelevance === true
  || record.karnatakaRelevance?.direct === true
)

export const inscriptionsForPrimaryAtlas = records => records.filter(isPrimaryAtlasInscription)

export const isPrimaryAtlasEvent = (record, primaryPolityIds) => (
  record.timelineRelevance === 'karnataka-context'
  || (record.participants || []).some(participant => primaryPolityIds.has(participant.polityId))
)

export const eventsForPrimaryAtlas = (records, primaryPolityIds) => records.filter(record => isPrimaryAtlasEvent(record, primaryPolityIds))
