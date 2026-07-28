import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData, collectionLabels } from '../src/data/atlas.js'
import { validateAtlas } from '../src/data/validate.js'

const sourceIds = new Set(atlasData.sources.map(source => source.id))
const placeById = new Map(atlasData.places.map(place => [place.id, place]))
const polityIds = new Set([...atlasData.polities, ...atlasData.externalPolities].map(polity => polity.id))
const personIds = new Set(atlasData.people.map(person => person.id))
const workIds = new Set(atlasData.works.map(work => work.id))
const inscriptionIds = new Set(atlasData.inscriptions.map(item => item.id))
const districtAuditIds = new Set(atlasData.inscriptionAudits.map(audit => audit.districtAuditId))
const pointIsValid = point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite)
const bilingual = value => Boolean(value?.en?.trim() && value?.kn?.trim())

test('the bundled dataset is a clean page-data release candidate', () => {
  assert.deepEqual(validateAtlas(atlasData), [])
  for (const collection of Object.keys(collectionLabels)) {
    assert.ok(Array.isArray(atlasData[collection]), `${collection} must remain an array`)
    const ids = new Set()
    for (const record of atlasData[collection]) {
      assert.match(record.id, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, `${collection} has an invalid stable ID`)
      assert.equal(ids.has(record.id), false, `${collection} contains duplicate ${record.id}`)
      ids.add(record.id)
      assert.ok(['draft', 'needs-review', 'reviewed', 'published'].includes(record.review?.status), `${collection}/${record.id} has no renderable review status`)
    }
  }
})

test('all map-facing records have safe coordinates and valid linked places', () => {
  for (const place of atlasData.places) {
    const [lng, lat] = place.location?.coordinates || []
    assert.equal(place.location?.type, 'Point', `${place.id} must be a point`)
    assert.ok(Number.isFinite(lng) && Number.isFinite(lat), `${place.id} has invalid map coordinates`)
  }
  for (const event of atlasData.events) {
    const [lng, lat] = event.location?.coordinates || []
    assert.ok(Number.isFinite(lng) && Number.isFinite(lat), `${event.id} has invalid event coordinates`)
    if (event.route) for (const point of event.route.coordinates) assert.ok(pointIsValid(point), `${event.id} has an invalid route point`)
  }
  for (const extent of atlasData.territorialExtents) {
    for (const point of extent.geometry.coordinates) assert.ok(pointIsValid(point), `${extent.id} has an invalid extent point`)
  }
  for (const inscription of atlasData.inscriptions) {
    const place = placeById.get(inscription.placeId)
    assert.ok(place, `${inscription.id} points to a missing place`)
    assert.ok(pointIsValid(place.location.coordinates.slice().reverse()), `${inscription.id} cannot be mapped`)
  }
  for (const record of atlasData.culturalHeritage) {
    for (const placeId of record.placeIds) assert.ok(placeById.has(placeId), `${record.id} points to a missing cultural place`)
  }
  for (const audit of atlasData.heritageAudits) for (const site of audit.prioritySites) {
    const point = site.verification?.coordinates
    if (point) assert.ok(Number.isFinite(point.latitude) && Number.isFinite(point.longitude), `${site.id} has invalid heritage coordinates`)
  }
  for (const record of atlasData.districtHistoryResearch) {
    if (record.location) assert.ok(pointIsValid(record.location.coordinates), `${record.id} has invalid district-history coordinates`)
  }
})

test('timeline and explorer cards have all fields used by their page renderers', () => {
  for (const collection of ['events', 'works', 'inscriptions', 'reigns', 'culturalHeritage']) {
    for (const record of atlasData[collection]) {
      assert.ok(bilingual(record.name), `${collection}/${record.id} needs a bilingual title`)
      assert.ok(record.date && ['BCE', 'CE'].includes(record.date.era), `${collection}/${record.id} needs an era`)
      assert.ok(Number.isFinite(record.date.from), `${collection}/${record.id} needs a timeline year`)
    }
  }
  for (const work of atlasData.works) {
    assert.ok(bilingual(work.creator), `${work.id} needs a bilingual creator`)
    assert.ok(Array.isArray(work.languages) && work.languages.length, `${work.id} needs a language list`)
    assert.ok(!('externalLinks' in work) || Array.isArray(work.externalLinks), `${work.id} externalLinks must be optional or an array`)
    assert.equal(work.reviewWorkflow.target, 'reviewed-literary-record', `${work.id} needs a literary workflow`)
  }
  for (const event of atlasData.events) {
    assert.ok(bilingual(event.summary), `${event.id} needs bilingual detail text`)
    assert.ok(Array.isArray(event.participants) && event.participants.length, `${event.id} needs participants`)
    assert.ok(Array.isArray(event.citations), `${event.id} needs citations for its detail card`)
  }
  for (const inscription of atlasData.inscriptions) {
    assert.ok(Array.isArray(inscription.languages) && inscription.languages.length, `${inscription.id} needs languages`)
    assert.ok(Array.isArray(inscription.scripts) && inscription.scripts.length, `${inscription.id} needs scripts`)
  }
})

test('cross-page links resolve before records reach maps, timelines or explorers', () => {
  for (const event of atlasData.events) {
    for (const participant of event.participants) assert.ok(polityIds.has(participant.polityId), `${event.id} has an unknown participant`)
    for (const id of [event.originPlaceId, event.destinationPlaceId].filter(Boolean)) assert.ok(placeById.has(id), `${event.id} has an unknown route place`)
    for (const citation of event.citations) assert.ok(sourceIds.has(citation.sourceId), `${event.id} has an unknown source`)
  }
  for (const work of atlasData.works) {
    assert.ok(polityIds.has(work.polityId), `${work.id} has an unknown polity`)
    for (const id of work.creatorIds || []) assert.ok(personIds.has(id), `${work.id} has an unknown creator`)
    for (const citation of work.citations || []) assert.ok(sourceIds.has(citation.sourceId), `${work.id} has an unknown source`)
  }
  for (const inscription of atlasData.inscriptions) {
    assert.ok(districtAuditIds.has(inscription.districtAuditId), `${inscription.id} has an unknown district audit`)
    assert.ok(polityIds.has(inscription.polityId), `${inscription.id} has an unknown polity`)
    for (const citation of inscription.citations || []) assert.ok(sourceIds.has(citation.sourceId), `${inscription.id} has an unknown source`)
  }
  for (const audit of atlasData.inscriptionAudits) for (const id of audit.inscriptionIds) assert.ok(inscriptionIds.has(id), `${audit.id} has an unknown inscription`)
})

test('P1 evidence candidates remain gated until every promotion field is verified', () => {
  const priority = atlasData.inscriptionAudits.flatMap(audit => audit.priorityCandidates || [])
  const sannati = priority.find(candidate => candidate.id === 'epigraphy-candidate-sannati-ashokan-edicts')
  const maski = priority.find(candidate => candidate.id === 'epigraphy-candidate-maski-minor-rock-edict')
  assert.equal(sannati?.promotionReview?.status, 'translation-review')
  assert.equal(maski?.promotionReview?.status, 'translation-review')
  for (const candidate of priority) {
    if (candidate.promotionReview?.status === 'promoted') {
      assert.equal(candidate.readiness, 'ready-for-promotion', `${candidate.id} cannot be promoted early`)
      for (const field of candidate.promotionReview.requiredEvidence) assert.equal(candidate.resolution?.[field]?.status, 'verified', `${candidate.id}/${field} is not verified`)
    }
  }
})
