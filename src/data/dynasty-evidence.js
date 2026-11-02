// Where each dynasty is actually attested in the atlas: its capital, dated inscriptions, monuments, coins and events.
// Dynasty maps are drawn from these points as soft washes. No district or state outline is treated as a border,
// because the kings never held those units and real frontiers were zones, not lines.
import { atlasData } from './atlas.js'
import { externalCapitalIds } from './external-capitals.js'

const CAMPAIGN = /battle|campaign|invasion|war|diplomatic|trade/
const lngLat = place => place?.location?.coordinates
let index

// Places where historians place a dynasty but the atlas holds no record yet. They are drawn as open rings, never as shading,
// so the map shows the gap and invites a contribution instead of claiming territory. Each needs a source before it becomes evidence.
const CENSUS = 'src-census-2004-historical-atlas-karnataka'
const L = (lng, lat, en, kn, source) => ({ lng, lat, kind: 'lead', tier: 'lead', from: null, to: null, label: { en, kn }, ...(source ? { source } : {}) })
const fromAtlas = locator => ({ sourceId: CENSUS, locator })
export const LEADS = {
  'external-polity-mughal-deccan': [L(76.95, 17.87, 'Kalyana (Basavakalyana), fort taken by Aurangzeb', 'ಕಲ್ಯಾಣ (ಬಸವಕಲ್ಯಾಣ), ಔರಂಗಜೇಬ ವಶಪಡಿಸಿಕೊಂಡ ಕೋಟೆ', fromAtlas('Map 22 write-up')), L(77.52, 17.91, 'Bidar, fort taken by Aurangzeb', 'ಬೀದರ್, ಔರಂಗಜೇಬ ವಶಪಡಿಸಿಕೊಂಡ ಕೋಟೆ', fromAtlas('Map 22 write-up')), L(75.71, 16.83, 'Bijapur, captured by Aurangzeb', 'ವಿಜಯಪುರ, ಔರಂಗಜೇಬನಿಂದ ವಶ', fromAtlas('Map 22 write-up')), L(77.36, 16.21, 'Raichur, captured by Aurangzeb', 'ರಾಯಚೂರು, ಔರಂಗಜೇಬನಿಂದ ವಶ', fromAtlas('Map 22 write-up')), L(76.9, 13.74, 'Sira, capital of the province formed in 1687', 'ಸಿರಾ, 1687ರಲ್ಲಿ ರಚಿಸಿದ ಪ್ರಾಂತ್ಯದ ರಾಜಧಾನಿ', fromAtlas('Map 22 write-up: Sira province of seven paraganas')), L(77.54, 13.29, 'Dodballapur, one of the seven paraganas of Sira', 'ದೊಡ್ಡಬಳ್ಳಾಪುರ, ಸಿರಾ ಪ್ರಾಂತ್ಯದ ಏಳು ಪರಗಣಗಳಲ್ಲಿ ಒಂದು', fromAtlas('Map 22 write-up')), L(77.8, 13.07, 'Hoskote, one of the seven paraganas of Sira', 'ಹೊಸಕೋಟೆ, ಸಿರಾ ಪ್ರಾಂತ್ಯದ ಏಳು ಪರಗಣಗಳಲ್ಲಿ ಒಂದು', fromAtlas('Map 22 write-up'))],
  'polity-western-ganga': [L(78.13, 13.14, 'Kolar (first Ganga capital)', 'ಕೋಲಾರ (ಗಂಗರ ಮೊದಲ ರಾಜಧಾನಿ)', fromAtlas('Map 7 and table: first capital Kolar'))],
  'polity-rashtrakuta': [L(77.51, 21.26, 'Elichpur (Achalapura), first Rashtrakuta capital', 'ಎಲಿಚಪುರ (ಅಚಲಪುರ), ರಾಷ್ಟ್ರಕೂಟರ ಮೊದಲ ರಾಜಧಾನಿ', fromAtlas('Map 9 and table: first capital Elichpur')), L(76.56, 18.41, 'Latur (Lattalur), original home', 'ಲಾತೂರು (ಲಟ್ಟಲೂರು), ಮೂಲ ನೆಲೆ', fromAtlas('Map 9 and table: original home Lattalur'))],
  'polity-kadamba': [L(74.59, 15.54, 'Halasi (provincial capital)', 'ಹಲಸಿ (ಪ್ರಾಂತೀಯ ರಾಜಧಾನಿ)', fromAtlas('Map 6 write-up: Halasi and Ucchangi were provincial capitals'))],
  'external-polity-bana': [L(77.68, 13.43, 'Nandi (Nandagiri)', 'ನಂದಿ (ನಂದಗಿರಿ)'), L(79.56, 13.64, 'Gudimallam', 'ಗುಡಿಮಲ್ಲಂ')],
  'external-polity-chengalva-kongalva': [L(76.29, 12.31, 'Hunsur', 'ಹುಣಸೂರು')],
  'external-polity-chutu': [L(75.28, 14.42, 'Malavalli (Chutu-Satakarni inscription)', 'ಮಲವಳ್ಳಿ (ಚುಟು-ಶಾತಕರ್ಣಿ ಶಾಸನ)')],
  'external-polity-nolamba': [L(76.4, 14.23, 'Chitradurga', 'ಚಿತ್ರದುರ್ಗ'), L(78.13, 13.14, 'Kolar', 'ಕೋಲಾರ'), L(77.26, 13.94, 'Madakasira', 'ಮಡಕಶಿರಾ')],
  'external-polity-santara': [L(75.36, 13.24, 'Kalasa', 'ಕಳಸ'), L(75.25, 13.42, 'Sringeri', 'ಶೃಂಗೇರಿ'), L(75.24, 13.69, 'Tirthahalli', 'ತೀರ್ಥಹಳ್ಳಿ')],
  'external-polity-shilahara': [L(74.64, 16.83, 'Miraj', 'ಮಿರಜ್'), L(74.18, 17.29, 'Karad', 'ಕರಾಡ'), L(74.5, 15.85, 'Belagavi', 'ಬೆಳಗಾವಿ')],
  'external-polity-hangal-kadamba': [L(75.01, 14.54, 'Banavasi', 'ಬನವಾಸಿ'), L(75.4, 14.79, 'Haveri', 'ಹಾವೇರಿ')],
  'external-polity-sinda': [L(75.95, 15.49, 'Kukanur', 'ಕುಕನೂರು'), L(75.7, 16.18, 'Bagalkote', 'ಬಾಗಲಕೋಟೆ'), L(76.15, 15.35, 'Koppal', 'ಕೊಪ್ಪಳ')],
  'external-polity-barid-shahi': [L(77.57, 17.92, 'Ashtur tombs, Bidar', 'ಅಷ್ಟೂರು ಸಮಾಧಿಗಳು, ಬೀದರ್'), L(77.2, 18.0, 'Bhalki', 'ಭಾಲ್ಕಿ'), L(76.95, 17.87, 'Basavakalyana', 'ಬಸವಕಲ್ಯಾಣ')],
  'external-polity-wodeyar-mysore': [L(76.68, 12.42, 'Srirangapatna', 'ಶ್ರೀರಂಗಪಟ್ಟಣ'), L(76.68, 12.12, 'Nanjangud', 'ನಂಜನಗೂಡು')],
  'external-polity-sode-nayaka': [L(74.85, 14.62, 'Sirsi', 'ಶಿರಸಿ'), L(74.71, 14.96, 'Yellapur', 'ಯಲ್ಲಾಪುರ')],
  'external-polity-haleri': [L(75.8, 12.2, 'Virajpet', 'ವಿರಾಜಪೇಟೆ'), L(75.8, 12.45, 'Haleri (Haleri palace area)', 'ಹಾಲೇರಿ')],
  'external-polity-savanur-nawab': [L(75.23, 14.93, 'Bankapura', 'ಬಂಕಾಪುರ'), L(75.14, 15.36, 'Hubballi', 'ಹುಬ್ಬಳ್ಳಿ')],
  'external-polity-surapura-nayaka': [L(76.52, 16.6, 'Hunsagi', 'ಹುಣಸಗಿ'), L(77.14, 16.77, 'Yadgir', 'ಯಾದಗಿರಿ')],
  'external-polity-chola': [L(76.94, 12.18, 'Talakadu (Rajarajapura)', 'ತಲಕಾಡು (ರಾಜರಾಜಪುರ)'), L(78.13, 13.14, 'Kolar', 'ಕೋಲಾರ'), L(78.39, 13.17, 'Mulbagal (Mulabagilu)', 'ಮುಳಬಾಗಿಲು'), L(77.68, 13.43, 'Nandi (Nandidurga)', 'ನಂದಿ (ನಂದಿದುರ್ಗ)')],
  'external-polity-maratha-confederacy': [L(74.5, 15.85, 'Belagavi', 'ಬೆಳಗಾವಿ'), L(75.0, 15.46, 'Dharwad', 'ಧಾರವಾಡ'), L(77.59, 12.97, 'Bengaluru (Shahaji’s jagir)', 'ಬೆಂಗಳೂರು (ಶಹಾಜಿಯ ಜಹಗೀರು)'), L(76.15, 15.35, 'Koppal', 'ಕೊಪ್ಪಳ'), L(75.13, 15.08, 'Gajendragad', 'ಗಜೇಂದ್ರಗಡ')],
}

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
  for (const [polityId, leads] of Object.entries(LEADS)) byPolity.set(polityId, [...(byPolity.get(polityId) || []), ...leads])
  index = byPolity
}

// Evidence points for a dynasty phase. With `year`, only points dated on or before it, so the wash grows as the evidence does;
// undated points always count. A polity that spans several phases (Mysore) only takes the points inside the phase.
export function evidenceFor(phase, year = Infinity) {
  if (!index) build()
  return (index.get(phase.polityId) || []).filter(point => (point.from == null || (point.from <= phase.to && (point.to ?? point.from) >= phase.from)) && (point.from == null || point.from <= year))
}

export const WASH_KM = { capital: 100, attested: 60, influence: 95, lead: 45 }
export const WASH_ALPHA = { capital: 0.36, attested: 0.24, influence: 0.1, lead: 0 }

export const KIND_LABEL = {
  en: { capital: 'Capital', inscription: 'Inscription', coin: 'Coin', monument: 'Monument', event: 'Event', lead: 'Help document this' },
  kn: { capital: 'ರಾಜಧಾನಿ', inscription: 'ಶಾಸನ', coin: 'ನಾಣ್ಯ', monument: 'ಸ್ಮಾರಕ', event: 'ಘಟನೆ', lead: 'ದಾಖಲಿಸಲು ಸಹಕರಿಸಿ' },
}

// Centre of a dynasty's evidence, for placing its name on the map.
export const centroid = points => points.length && [points.reduce((sum, point) => sum + point.lat, 0) / points.length, points.reduce((sum, point) => sum + point.lng, 0) / points.length]
