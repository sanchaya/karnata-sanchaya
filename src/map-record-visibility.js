// Review status must not silently remove research records from the public map.
// Pending records remain visible and are marked by the map with a dashed style.
export const inscriptionsForMap = (records, { year, showAll = true, activePolityIds = new Set() } = {}) => {
  if (showAll) return records
  return records.filter(item => Math.abs(item.year - year) <= 250 && (activePolityIds.has(item.polityId) || year >= item.year))
}
