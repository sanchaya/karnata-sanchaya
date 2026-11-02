const isFinitePoint = point => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1])

export const isKarnatakaPoint = point => isFinitePoint(point) && point[0] >= 11 && point[0] <= 19 && point[1] >= 73.5 && point[1] <= 78.5
export const isIndiaPoint = point => isFinitePoint(point) && point[0] >= 5 && point[0] <= 38 && point[1] >= 67 && point[1] <= 98

const scopeViews = {
  karnataka: { center: [14.7, 76.2], zoom: 6.35 },
  india: { center: [20.2, 78.4], zoom: 4.35 },
  world: { center: [20, 35], zoom: 2.25 },
}

export const mapViewForScope = scope => scopeViews[scope] || scopeViews.karnataka

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

// Fitting a view to every point lets one overseas or mis-geocoded coordinate zoom the map out to the whole world.
// When any point lies in India, fit to those only; the others keep their markers but do not drive the zoom.
export function regionalPoints(points) {
  const valid = (points || []).filter(isFinitePoint)
  const inIndia = valid.filter(isIndiaPoint)
  return inIndia.length ? inIndia : valid
}
