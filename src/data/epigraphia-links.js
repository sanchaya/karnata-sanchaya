export function epigraphiaPointers(records = []) {
  const seen = new Set()
  const pointers = []
  for (const sourceRecord of records) {
    for (const candidate of sourceRecord.locatorCandidates || []) {
      for (const targetId of candidate.targetRecordIds || []) {
        const key = `${sourceRecord.id}:${targetId}`
        if (seen.has(key)) continue
        seen.add(key)
        pointers.push({ sourceRecord, candidate, targetId })
      }
    }
  }
  return pointers
}

export function epigraphiaRecordsForTargets(records = [], targetIds = []) {
  const targets = new Set(targetIds.filter(Boolean))
  if (!targets.size) return []
  const grouped = new Map()
  for (const pointer of epigraphiaPointers(records)) {
    if (!targets.has(pointer.targetId)) continue
    const match = grouped.get(pointer.sourceRecord.id) || { ...pointer.sourceRecord, matchedPointers: [] }
    match.matchedPointers.push(pointer)
    grouped.set(pointer.sourceRecord.id, match)
  }
  return [...grouped.values()]
}

export const countEpigraphiaPointers = records => epigraphiaPointers(records).length
