const templeNamePattern = /temple|devalaya|mandir|jinalaya|basadi|keshava|channakeshava|madhukeshwara|bhutanatha|ranganathaswamy|virupaksha|vittala|krishna|durga|meguti|mahadeva|narasimha|ದೇವಾಲಯ|ಮಂದಿರ|ಬಸದಿ|ಜಿನಾಲಯ/i
const nonTempleArchitecturePattern = /stepwell|masjid|madrasa|mahal|stables|fort|gumbaz|rauza|palace|garden|civic|mausoleum|church|cathedral|dargah|monastery|cave|ಗುಹೆ|ಕೋಟೆ|ಅರಮನೆ|ಬಾವಿ|ಚರ್ಚ್|ಮಸೀದಿ|ದರ್ಗಾ/i

export const isTempleRecord = item => Boolean(
  item?.templeSite === true ||
  item?.sourceLayer?.includes('temple') ||
  item?.traditionTags?.some(tag => /temple|basadi|jinalaya/i.test(tag)) ||
  templeNamePattern.test(item?.name?.en || '') ||
  templeNamePattern.test(item?.name?.kn || '') ||
  (item?.category === 'architecture' && !nonTempleArchitecturePattern.test(item?.name?.en || ''))
)

export const timelineCategoryForCulture = item => isTempleRecord(item)
  ? 'temples'
  : item?.category === 'architecture'
    ? 'monuments'
    : 'culture'

const heritageKinds = {
  fort: 'fort', palace: 'palace', 'palace-civic-architecture': 'palace', museum: 'museum',
  archive: 'archive', library: 'library', 'historic-park': 'park', 'historic-market': 'market',
  'railway-heritage': 'railway', 'engineering-heritage': 'industry', 'industrial-heritage': 'industry',
  'maritime-heritage': 'maritime', 'educational-heritage': 'institution', 'scientific-heritage': 'institution',
  'cultural-venue': 'culture', 'memorial-heritage': 'memorial', 'historic-urban-precinct': 'monument',
}

export const heritageKindForCategory = category => heritageKinds[category] || null

export const objectKindFor = item => {
  if (!item) return 'heritage'
  if (item.storyKind === 'inscription' || item.kind === 'inscription' || item.evidenceKind === 'inscription') return 'inscription'
  if (item.storyKind === 'literature' || item.kind === 'work' || item.category === 'literature') return 'literature'
  if (item.storyKind === 'person' || item.kind === 'person') return 'person'
  if (item.storyKind === 'external-kingdom') return 'territory'
  if (item.storyKind === 'territory') return 'territory'
  if (item.storyKind === 'reign') return 'reign'
  if (item.storyKind === 'artifact' || item.kind === 'artifact' || item.artifactKind) return 'artifact'
  if (heritageKindForCategory(item.category)) return heritageKindForCategory(item.category)
  if (isTempleRecord(item) || /temple|basadi/i.test(item.category || '')) return 'temple'
  if (['battle', 'war', 'invasion', 'campaign'].includes(item.type)) return 'war'
  if (item.reach || ['trade-contact', 'diplomatic-mission', 'cultural-contact'].includes(item.type)) return 'connection'
  if (item.storyKind === 'event' || item.location?.type === 'Point') return 'event'
  if (item.category === 'games-sports') return 'sport'
  if (['celebration', 'performance', 'music'].includes(item.category)) return 'celebration'
  if (item.category === 'religious-tradition') return 'religion'
  if (item.category === 'architecture' || item.kind === 'heritage') return 'monument'
  return 'culture'
}

export const objectIcon = kind => ({
  temple: '🛕', inscription: '▤', war: '⚔', connection: '↔', event: '◆', literature: '▥',
  person: '♟', territory: '▱', reign: '♛', monument: '▦', celebration: '✦', religion: '◉',
  sport: '●', artifact: '◈', culture: '✧', heritage: '◇', fort: '♜', palace: '♛', museum: '🏛',
  archive: '▤', library: '▥', park: '♣', market: '◫', railway: '◆', industry: '⚙', maritime: '⚓',
  institution: '⌂', memorial: '✦',
}[kind] || '◇')

export const objectLabelKey = kind => ({
  temple: 'temples', inscription: 'inscriptions', war: 'wars', connection: 'connections', event: 'political',
  literature: 'literature', person: 'people', territory: 'territory', reign: 'reigns', artifact: 'artifacts', monument: 'monuments',
  celebration: 'culture', religion: 'culture', sport: 'culture', culture: 'culture', heritage: 'monuments',
  fort: 'monuments', palace: 'monuments', museum: 'heritage', archive: 'heritage', library: 'heritage', park: 'heritage',
  market: 'heritage', railway: 'heritage', industry: 'heritage', maritime: 'heritage', institution: 'heritage', memorial: 'heritage',
}[kind] || 'culture')
