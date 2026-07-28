const isFinitePoint = point => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1])

export const isKarnatakaPoint = point => isFinitePoint(point) && point[0] >= 11 && point[0] <= 19 && point[1] >= 73.5 && point[1] <= 78.5
export const isIndiaPoint = point => isFinitePoint(point) && point[0] >= 5 && point[0] <= 38 && point[1] >= 67 && point[1] <= 98

export function mapZoomForPoint(point) {
  if (!isFinitePoint(point)) return 3.75
  const [lat, lng] = point
  if (isKarnatakaPoint(point)) return 8.5
  if (isIndiaPoint(point)) return 5.5
  return 3.75
}

export function mapZoomForPositions(points) {
  const valid = (points || []).filter(isFinitePoint)
  return valid.length ? Math.min(...valid.map(mapZoomForPoint)) : 3.75
}
