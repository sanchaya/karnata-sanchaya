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
    assert.ok(inscription.geographicScope?.outsideKarnataka || districtAuditIds.has(inscription.districtAuditId), `${inscription.id} has an unknown district audit`)
    assert.ok(polityIds.has(inscription.polityId), `${inscription.id} has an unknown polity`)
    for (const citation of inscription.citations || []) assert.ok(sourceIds.has(citation.sourceId), `${inscription.id} has an unknown source`)
  }
  for (const audit of atlasData.inscriptionAudits) for (const id of audit.inscriptionIds) assert.ok(inscriptionIds.has(id), `${audit.id} has an unknown inscription`)
})

test('international inscription layer keeps geography, provenance and relation links explicit', () => {
  const external = atlasData.inscriptions.filter(record => record.geographicScope?.outsideKarnataka)
  assert.ok(external.length >= 8, 'the international inscription layer should retain a meaningful research set')
  assert.ok(external.some(record => record.geographicScope?.outsideIndia), 'at least one inscription should extend beyond India')
  const relations = new Set(atlasData.politicalRelations.map(record => record.id))
  for (const record of external) {
    assert.equal(record.review?.status, 'needs-review', `${record.id} must remain gated pending independent review`)
    assert.ok(record.geographicScope?.countryCode, `${record.id} needs a country code`)
    assert.ok(record.citations?.length, `${record.id} needs provenance citations`)
    for (const relationId of record.relationIds || []) assert.ok(relations.has(relationId), `${record.id} has an unknown relation`)
  }
})

test('Hoysala KML and CSV layers preserve contributor provenance without guessed coordinates', () => {
  const kmlTemples = atlasData.culturalHeritage.filter(record => record.sourceLayer === 'offbeat-hoysala-temples')
  assert.equal(kmlTemples.length, 12, 'the supplied KML should retain all twelve placemarks')
  assert.ok(atlasData.templeInventoryLeads.length >= 60, 'the supplied CSV should retain its locality inventory')
  assert.ok(atlasData.templeInventoryLeads.every(record => record.review?.status === 'needs-review'), 'CSV leads remain pending review')
  assert.ok(atlasData.templeInventoryLeads.every(record => (record.citations || []).length > 0), 'CSV rows retain source-row citations')
  assert.ok(kmlTemples.every(record => record.placeIds.length === 1 && record.sourceLayer === 'offbeat-hoysala-temples'), 'KML temples retain exact imported place links')
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

test('Atlas v0.21 bilateral political relations retain parties, routes and review gates', () => {
  assert.ok(atlasData.politicalRelations.length >= 15)
  for (const relation of atlasData.politicalRelations) {
    assert.ok(relation.parties.length >= 2, `${relation.id} needs at least two parties`)
    assert.ok(relation.parties.every(party => polityIds.has(party.polityId)), `${relation.id} has an unknown party`)
    assert.ok(['war','invasion','campaign','trade','diplomacy','travel-knowledge','treaty','alliance','tribute','suzerainty','administrative-integration','constitutional-integration'].includes(relation.relationKind), `${relation.id} has an unsupported relation kind`)
    assert.equal(relation.geography.route.type, 'LineString')
    assert.ok(relation.geography.route.coordinates.length >= 2, `${relation.id} needs a route`)
    assert.ok(relation.eventIds.every(id => atlasData.events.some(event => event.id === id)), `${relation.id} has an unknown event link`)
    assert.ok(relation.peopleIds.every(id => personIds.has(id)), `${relation.id} has an unknown person link`)
    assert.equal(relation.review.status, 'needs-review', `${relation.id} must remain visibly unresolved until review`)
  }
})

test('Atlas v0.22 research wave keeps expanded coverage linked and review-gated', () => {
  assert.equal(atlasData.meta.schemaVersion, '0.22.0')
  assert.ok(atlasData.polities.some(item => item.id === 'polity-alupa'))
  assert.ok(atlasData.externalGovernancePhases.some(item => item.id === 'external-governance-keladi-ikkeri-nayaka'))
  assert.ok(atlasData.externalGovernancePhases.some(item => item.id === 'external-governance-chitradurga-nayaka'))
  for (const id of ['reign-mayurasharma-kadamba','reign-durvinita-western-ganga','reign-vikramaditya-vi-kalyani-chalukya']) {
    assert.equal(atlasData.reigns.find(item => item.id === id)?.review.status, 'needs-review')
  }
  assert.equal(atlasData.people.filter(item => !(item.citations || []).length).length, 0)
  assert.equal(atlasData.districtHistoryResearch.filter(item => item.recordKind === 'candidate').length, 33)
  for (const id of ['extent-kadamba-core-prototype','extent-western-ganga-core-prototype','extent-hoysala-ballala-ii-1187','extent-vijayanagara-krishnadevaraya-core-1520']) {
    const extent = atlasData.territorialExtents.find(item => item.id === id)
    assert.equal(extent?.confidence, 'medium')
    assert.ok(extent?.citations.some(item => item.sourceId !== 'src-prototype-boundaries'))
    assert.equal(extent?.geometry.precision, 'schematic')
  }
  for (const id of ['work-kavirajamarga','work-vikramarjuna-vijaya','work-adipurana','work-gadayuddha','work-vaddaradhane']) {
    const work = atlasData.works.find(item => item.id === id)
    assert.equal(work?.reviewWorkflow.evidence.editionWitness.status, 'located')
    assert.equal(work?.review.status, 'needs-review')
  }
})

test('statewide heritage pass distinguishes authority registers from discovery leads', () => {
  const protectionLevels=new Set(['unesco','national','state','local','institutional','research-lead','unknown'])
  const mysuru=atlasData.heritageInventoryLeads.filter(item=>item.sourceId==='src-wikipedia-mysuru-heritage-buildings')
  assert.equal(mysuru.length,25,'all previously missing Mysuru-list buildings should be retained')
  assert.ok(mysuru.every(item=>item.protectionLevel==='research-lead'&&item.designationStatus==='unverified'),'Mysuru discovery records must not imply legal protection')
  for(const item of atlasData.heritageInventoryLeads){
    assert.ok(protectionLevels.has(item.protectionLevel),`${item.id} has an unsupported protection level`)
    if(['national','state'].includes(item.protectionLevel))assert.ok(item.registryId?.trim(),`${item.id} needs an authority register ID`)
  }
})

test('every district-history research packet exposes safe contextual graph links', () => {
  const linkedDistricts=new Set(atlasData.districtHistoryResearch.filter(item=>['placeIds','polityIds','peopleIds','eventIds'].some(field=>item[field]?.length)).map(item=>item.districtId))
  assert.equal(linkedDistricts.size,31)
  for(const item of atlasData.districtHistoryResearch){
    for(const id of item.placeIds||[])assert.ok(placeById.has(id),`${item.id} has an unknown place context`)
    for(const id of item.polityIds||[])assert.ok(polityIds.has(id),`${item.id} has an unknown polity context`)
    for(const id of item.peopleIds||[])assert.ok(personIds.has(id),`${item.id} has an unknown person context`)
    for(const id of item.eventIds||[])assert.ok(atlasData.events.some(event=>event.id===id),`${item.id} has an unknown event context`)
  }
  assert.ok(atlasData.relationships.some(item=>item.type==='district-history-polity-context'))
  assert.ok(atlasData.relationships.some(item=>item.type==='heritage-place-context'))
})

test('international research additions keep attested links separate from unresolved corridors', () => {
  const xuanzang=atlasData.politicalRelations.find(record=>record.id==='political-relation-xuanzang-chalukya-travel-account')
  const barus=atlasData.inscriptions.find(record=>record.id==='inscription-lobu-tua-barus')
  const polonnaruwa=atlasData.inscriptions.find(record=>record.id==='inscription-polonnaruwa-ayyavole')
  const malaysia=atlasData.politicalRelations.find(record=>record.id==='political-relation-old-kedah-maritime-research')
  const singapore=atlasData.politicalRelations.find(record=>record.id==='political-relation-temasek-south-india-research')
  assert.equal(xuanzang?.relationKind,'travel-knowledge')
  assert.equal(xuanzang?.evidenceLevel,'attested')
  assert.equal(barus?.date.from,1088)
  assert.ok(barus?.citations.some(citation=>citation.sourceId==='src-iseas-barus-inscriptions'))
  assert.ok(polonnaruwa?.citations.some(citation=>citation.sourceId==='src-pathmanathan-kingdom-jaffna'))
  assert.equal(malaysia?.evidenceLevel,'inferred')
  assert.equal(singapore?.evidenceLevel,'inferred')
})
