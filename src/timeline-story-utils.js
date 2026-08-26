const textValue = value => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value.en || value.kn || ''
}

const chronologicalYearForStory = story => {
  if (Number.isFinite(story?.year)) return story.year
  const date = story?.date || {}
  if (!Number.isFinite(date.from)) return Number.POSITIVE_INFINITY
  return date.era === 'BCE' ? -date.from : date.from
}

const roundedPointKey = coords => {
  if (!Array.isArray(coords) || !Number.isFinite(coords[0]) || !Number.isFinite(coords[1])) return ''
  return coords.map(value => (Math.round(value * 100) / 100).toFixed(2)).join(',')
}

const placeKeyForStory = story => {
  if (story.placeId) return story.placeId
  if (story.destinationPlaceId) return story.destinationPlaceId
  if (Array.isArray(story.placeIds) && story.placeIds.length) return story.placeIds.slice().sort().join('+')
  return roundedPointKey(story.coords)
}

const compactableStory = story =>
  story?.storyKind === 'inscription' ||
  story?.storyCategory === 'inscriptions' ||
  (story?.storyKind === 'event' && story?.type === 'inscription') ||
  (story?.storyKind === 'research-candidate' && story?.storyCategory === 'inscriptions')

const timelineSortRank = story => {
  const ranks = {
    event: 10,
    inscription: 20,
    'research-candidate': 30,
    reign: 40,
    territory: 50,
    governance: 60,
    'external-kingdom': 70,
    literature: 80,
    culture: 90,
    periodical: 100,
    artifact: 110,
    person: 120,
  }
  return ranks[story?.storyKind] || 200
}

const primaryRank = story => {
  if (story?.storyKind === 'inscription') return 0
  if (story?.storyKind === 'event' && story?.type === 'inscription') return 1
  if (story?.storyKind === 'research-candidate') return 2
  return 3
}

export const sortTimelineStories = stories =>
  stories.slice().sort((a, b) =>
    chronologicalYearForStory(a) - chronologicalYearForStory(b) ||
    (a.date?.to ?? a.year ?? 0) - (b.date?.to ?? b.year ?? 0) ||
    timelineSortRank(a) - timelineSortRank(b) ||
    textValue(a.name).localeCompare(textValue(b.name)),
  )

export const compactTimelineStories = stories => {
  const groups = new Map()
  const compacted = []

  for (const story of sortTimelineStories(stories)) {
    const placeKey = placeKeyForStory(story)
    const year = chronologicalYearForStory(story)
    const key = compactableStory(story) && placeKey && Number.isFinite(year)
      ? `compact:${Math.round(year)}:${placeKey}`
      : `single:${story.storyKind}:${story.id}`

    const existing = groups.get(key)
    if (!existing) {
      const group = [story]
      groups.set(key, group)
      compacted.push(group)
    } else {
      existing.push(story)
    }
  }

  return compacted.map(group => {
    const ordered = group.slice().sort((a, b) =>
      primaryRank(a) - primaryRank(b) ||
      timelineSortRank(a) - timelineSortRank(b) ||
      textValue(a.name).length - textValue(b.name).length ||
      textValue(a.name).localeCompare(textValue(b.name)),
    )
    const primary = ordered[0]
    if (ordered.length === 1) return primary
    return {
      ...primary,
      timelineCardId: `group-${ordered.map(item => `${item.storyKind}-${item.id}`).join('__')}`,
      timelineGroupCount: ordered.length,
      timelineGroupItems: ordered,
      timelineGroupIds: ordered.map(item => item.id),
      timelineGroupKinds: Array.from(new Set(ordered.map(item => item.storyKind))),
    }
  })
}
