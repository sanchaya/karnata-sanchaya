const YEAR_MIN = -300
const YEAR_MAX = 1956

const numberParam = (params, key, min, max) => {
  const value = Number(params.get(key))
  return Number.isFinite(value) && value >= min && value <= max ? value : null
}

export const readAtlasUrlState = (search = '') => {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`)
  const rawYear = numberParam(params, 'year', YEAR_MIN, YEAR_MAX)
  const year = rawYear === 0 ? 1 : rawYear == null ? null : Math.round(rawYear)
  const lat = numberParam(params, 'lat', -90, 90)
  const lng = numberParam(params, 'lng', -180, 180)
  const zoom = numberParam(params, 'zoom', 2, 18)
  return {
    year,
    map: lat == null || lng == null ? null : { lat, lng, zoom: zoom ?? 6.35 },
  }
}

const rounded = (value, places) => Number(value.toFixed(places))

export const updateAtlasUrlState = (state, href = '') => {
  const url = new URL(href || (typeof window !== 'undefined' ? window.location.href : 'http://localhost/'))
  const params = url.searchParams
  if (Number.isFinite(state.year)) params.set('year', String(Math.round(state.year)))
  if (state.map && Number.isFinite(state.map.lat) && Number.isFinite(state.map.lng)) {
    params.set('lat', String(rounded(state.map.lat, 5)))
    params.set('lng', String(rounded(state.map.lng, 5)))
    if (Number.isFinite(state.map.zoom)) params.set('zoom', String(rounded(state.map.zoom, 2)))
  }
  url.search = params.toString()
  return url
}

export const atlasYearBounds = { min: YEAR_MIN, max: YEAR_MAX }
