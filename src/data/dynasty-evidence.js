// Where each dynasty is actually attested in the atlas: its capital, dated inscriptions, monuments, coins and events.
// Dynasty maps are drawn from these points as soft washes. No district or state outline is treated as a border,
// because the kings never held those units and real frontiers were zones, not lines.
import { atlasData } from './atlas.js'
import { externalCapitalIds } from './external-capitals.js'

const CAMPAIGN = /battle|campaign|invasion|war|diplomatic|trade/
const lngLat = place => place?.location?.coordinates
let index

function build() {
  const places = new Map(atlasData.places.map(place => [place.id, place]))
  const polities = new Map([...atlasData.polities, ...atlasData.externalPolities].map(polity => [polity.id, polity]))
  const byPolity = new Map()
  const seen = new Set()
  const add = (polityId, coords, kind, tier, date, label) => {
    // Overseas embassies and trade contacts say nothing about where a dynasty held ground.
    if (!polityId || !coords || coords[1] < 5 || coords[1] > 35 || coords[0] < 68 || coords[0] > 90) return
    const key = `${polityId}|${kind}|${coords[0].toFixed(2)}|${coords[1].toFixed(2)}`
    if (seen.has(key)) return
    seen.add(key)
    if (!byPolity.has(polityId)) byPolity.set(polityId, [])
    byPolity.get(polityId).push({ lng: coords[0], lat: coords[1], kind, tier, from: date?.from ?? null, to: date?.to ?? null, label })
  }
  const at = placeId => lngLat(places.get(placeId))
  for (const polity of polities.values()) {
    const place = places.get(polity.capitalId || externalCapitalIds[polity.id])
    add(polity.id, lngLat(place) || polity.center, 'capital', 'capital', null, place?.name || polity.capital)
  }
  for (const item of atlasData.inscriptions) add(item.polityId, at(item.placeId), 'inscription', 'attested', item.date, item.name)
  for (const item of atlasData.coinRecords) add(item.polityId, at(item.placeId), 'coin', 'attested', item.date, item.name)
  for (const item of atlasData.culturalHeritage) for (const polityId of item.polityIds || []) for (const placeId of item.placeIds || []) add(polityId, at(placeId), 'monument', 'attested', item.date, item.name)
  for (const event of atlasData.events) for (const { polityId } of event.participants || []) add(polityId, event.location?.coordinates, 'event', CAMPAIGN.test(event.type) ? 'influence' : 'attested', event.date, event.name)
  index = byPolity
}

// Evidence points for a dynasty phase. With `year`, only points dated on or before it, so the wash grows as the evidence does;
// undated points always count. A polity that spans several phases (Mysore) only takes the points inside the phase.
export function evidenceFor(phase, year = Infinity) {
  if (!index) build()
  return (index.get(phase.polityId) || []).filter(point => (point.from == null || (point.from <= phase.to && (point.to ?? point.from) >= phase.from)) && (point.from == null || point.from <= year))
}

export const WASH_KM = { capital: 100, attested: 60, influence: 95 }
export const WASH_ALPHA = { capital: 0.36, attested: 0.24, influence: 0.1 }

export const KIND_LABEL = {
  en: { capital: 'Capital', inscription: 'Inscription', coin: 'Coin', monument: 'Monument', event: 'Event' },
  kn: { capital: 'ರಾಜಧಾನಿ', inscription: 'ಶಾಸನ', coin: 'ನಾಣ್ಯ', monument: 'ಸ್ಮಾರಕ', event: 'ಘಟನೆ' },
}

// Centre of a dynasty's evidence, for placing its name on the map.
export const centroid = points => points.length && [points.reduce((sum, point) => sum + point.lat, 0) / points.length, points.reduce((sum, point) => sum + point.lng, 0) / points.length]
