import test from 'node:test'
import assert from 'node:assert/strict'
import { atlasData, collectionLabels } from '../src/data/atlas.js'
import { validateAtlas } from '../src/data/validate.js'
import peopleCandidateCorpus from '../server/seeds/wikimedia-people-candidates.json' with { type:'json' }

const sourceIds = new Set(atlasData.sources.map(source => source.id))
const knownIds = new Set(Object.values(atlasData).flatMap(collection => Array.isArray(collection) ? collection.map(record => record?.id).filter(Boolean) : []))
const placeById = new Map(atlasData.places.map(place => [place.id, place]))
const polityIds = new Set([...atlasData.polities, ...atlasData.externalPolities].map(polity => polity.id))
const personIds = new Set(atlasData.people.map(person => person.id))
const workIds = new Set(atlasData.works.map(work => work.id))
const inscriptionIds = new Set(atlasData.inscriptions.map(item => item.id))
const districtAuditIds = new Set(atlasData.inscriptionAudits.map(audit => audit.districtAuditId))
const pointIsValid = point => Array.isArray(point) && point.length === 2 && point.every(Number.isFinite)
const bilingual = value => Boolean(value?.en?.trim() && value?.kn?.trim())

test('v0.25 Wikimedia people corpus is complete, stable and review-gated', () => {
  const candidates=peopleCandidateCorpus.records
  assert.equal(peopleCandidateCorpus.meta.candidateCount,905)
  assert.equal(atlasData.peopleCandidateMeta?.candidateCount, peopleCandidateCorpus.meta.candidateCount)
  assert.equal(candidates.length,905)
  assert.equal(new Set(candidates.map(item=>item.id)).size,905)
  assert.equal(new Set(candidates.map(item=>item.externalIds.wikidata)).size,905)
  assert.ok(candidates.every(item=>item.review.status==='needs-review'))
  assert.ok(candidates.every(item=>item.discovery.publicationReady===false))
  assert.ok(candidates.every(item=>item.reviewWorkflow.target==='curated-person-record'))
  const counts=Object.fromEntries(['actor','author','film-director','screenwriter','poet','artist','theatre-director','minister'].map(role=>[role,candidates.filter(item=>item.roles.includes(role)).length]))
  assert.deepEqual(counts,{actor:522,author:239,'film-director':168,screenwriter:105,poet:104,artist:14,'theatre-director':3,minister:2})
  const errors=validateAtlas({...atlasData,peopleCandidateMeta:peopleCandidateCorpus.meta,peopleCandidates:candidates}).filter(issue=>issue.severity==='error')
  assert.deepEqual(errors,[])
})

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

test('local Epigraphia Carnatica text cache is indexed as review-only citations', () => {
  assert.ok(atlasData.epigraphiaArchiveTexts.length >= 12)
  const volumes = new Set(atlasData.epigraphiaArchiveTexts.map(record => record.volume))
  for (const volume of ['3', '4', '5', '7', '8', '9', '10', '11', '12', '24', '25']) assert.ok(volumes.has(volume), `EC volume ${volume} must remain indexed`)
  for (const record of atlasData.epigraphiaArchiveTexts) {
    assert.equal(record.series, 'Epigraphia Carnatica')
    assert.equal(record.review.status, 'needs-review')
    assert.ok(record.itemUrl.startsWith('https://archive.org/details/'), `${record.id} needs a stable item URL`)
    assert.ok(record.textFile.url.startsWith('https://archive.org/download/'), `${record.id} needs a TXT derivative URL`)
    assert.equal(record.textFile.localCache, true, `${record.id} should identify the local cache source`)
    assert.ok(sourceIds.has(record.citation.sourceId), `${record.id} has an unknown citation source`)
    assert.ok(record.citation.locator.includes('OCR discovery only'), `${record.id} must not imply OCR is final evidence`)
    assert.ok(Object.values(record.ocrSignals || {}).some(count => count > 0), `${record.id} should retain OCR discovery signals`)
    for (const hint of record.locatorCandidates || []) {
      assert.equal(hint.status, 'needs-page-image-review')
      assert.ok(hint.id.startsWith('archive-hint-'))
      assert.ok(hint.matchCount > 0)
      assert.ok(hint.matchedTerms.length > 0)
      assert.ok(hint.reviewNote.en.includes('OCR term match only'))
      for (const targetId of hint.targetRecordIds) assert.ok(knownIds.has(targetId), `${record.id} has unknown OCR locator target ${targetId}`)
    }
  }
})

test('Itihasa Darshana volumes expose review-gated atlas link groups', () => {
  const volumes = atlasData.sources.filter(source => source.collectionKey === 'itihasa-darshana')
  const linkedVolumes = volumes.filter(source => source.contentReview?.atlasLinks?.length)
  assert.ok(volumes.length >= 37)
  assert.ok(linkedVolumes.length >= 30)
  assert.ok(linkedVolumes.reduce((sum, source) => sum + source.contentReview.atlasLinks.length, 0) >= 50)
  assert.ok(linkedVolumes.some(source => source.contentReview.atlasLinks.some(link => link.targetCollection === 'inscriptionEditions')))
  assert.ok(linkedVolumes.some(source => source.contentReview.atlasLinks.some(link => link.targetCollection === 'works')))
  for (const source of linkedVolumes) {
    for (const link of source.contentReview.atlasLinks) {
      assert.equal(link.status, 'needs-article-page-review')
      assert.ok(['high', 'medium', 'low'].includes(link.confidence))
      assert.ok(link.reason.en.length > 20)
      assert.ok(link.requiredReview.includes('printedPage'))
      for (const targetId of link.targetRecordIds) assert.ok(knownIds.has(targetId), `${source.id} has unknown Itihasa link target ${targetId}`)
    }
  }
})

test('Karnataka Parampare volumes are queued as review-gated source links', () => {
  const volumes = atlasData.sources.filter(source => source.collectionKey === 'karnataka-parampare')
  assert.equal(volumes.length, 2)
  assert.ok(volumes.every(source => source.url.startsWith('https://archive.org/details/sanchaya.karnatakaparampa0000_')))
  assert.ok(volumes.every(source => source.review.status === 'needs-review'))
  assert.ok(volumes.every(source => source.contentReview?.status === 'screened'))
  assert.ok(volumes.every(source => source.contentReview?.pass === 'metadata-and-ocr-locator-screening'))
  assert.ok(volumes.every(source => Object.values(source.contentReview?.ocrSignals || {}).some(count => count > 0)))
  assert.ok(volumes.every(source => source.contentReview?.atlasLinks?.length >= 4))
  for (const source of volumes) {
    for (const link of source.contentReview.atlasLinks) {
      assert.equal(link.status, 'needs-article-page-review')
      assert.ok(['medium', 'low'].includes(link.confidence))
      assert.ok(link.requiredReview.includes('printedPage'))
      assert.ok(link.locatorHints?.length >= 1)
      for (const hint of link.locatorHints) {
        assert.equal(hint.status, 'needs-page-image-review')
        assert.ok(hint.printedLocator.length > 8)
        assert.ok(hint.ocrLocator.length > 8)
        assert.ok(hint.note.en.length > 20)
      }
      for (const targetId of link.targetRecordIds) assert.ok(knownIds.has(targetId), `${source.id} has unknown Karnataka Parampare link target ${targetId}`)
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
    const polity = [...atlasData.polities, ...atlasData.externalPolities].find(item => item.id === inscription.polityId)
    assert.ok(bilingual(polity?.name), `${inscription.id} must expose a bilingual associated kingdom`)
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
  assert.equal(atlasData.meta.schemaVersion, '0.28.1')
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

test('Patrika Sanchaya periodicals retain row citations and grouped map anchors', () => {
  assert.equal(atlasData.periodicals.length, 3715)
  assert.ok(atlasData.periodicals.every(item => item.review.status === 'needs-review'))
  assert.ok(atlasData.periodicals.every(item => item.citations?.[0]?.sourceId === 'src-patrika-sanchaya-kannada'))
  assert.ok(atlasData.periodicalMapSites.length >= 70)
  assert.ok(atlasData.periodicalMapSites.every(site => site.periodicalIds.length > 0 && site.review.status === 'needs-review'))
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

test('reign records produce review-gated succession network edges', () => {
  const succession = atlasData.relationships.filter(item => item.type === 'succeeded-by')
  assert.ok(succession.length >= 10, 'ruler succession should be visible as first-class relationship records')
  for (const edge of succession) {
    assert.ok(personIds.has(edge.fromId), `${edge.id} has an unknown predecessor`)
    assert.ok(personIds.has(edge.toId), `${edge.id} has an unknown successor`)
    assert.ok(polityIds.has(edge.polityId), `${edge.id} has an unknown polity`)
    assert.equal(edge.review?.status, 'needs-review', `${edge.id} must stay review-gated until succession evidence is checked`)
    assert.ok(edge.derivedFrom?.every(id => atlasData.reigns.some(reign => reign.id === id)), `${edge.id} must retain the source reign records`)
  }
})

test('missing-feature foundations are linked, bilingual and review-gated', () => {
  assert.ok(atlasData.feudatoryRelations.length >= 5)
  assert.ok(atlasData.administrativeDivisions.length >= 3)
  assert.ok(atlasData.scriptEvolution.length >= 6)
  assert.ok(atlasData.openDatasetCatalogue.length >= 1)
  for (const relation of atlasData.feudatoryRelations) {
    assert.ok(bilingual(relation.name), `${relation.id} needs a bilingual name`)
    assert.ok(polityIds.has(relation.overlordPolityId), `${relation.id} has an unknown overlord`)
    assert.ok(polityIds.has(relation.subordinatePolityId), `${relation.id} has an unknown subordinate`)
    assert.equal(relation.review.status, 'needs-review', `${relation.id} should remain review-gated`)
    assert.ok(relation.citations.every(citation => sourceIds.has(citation.sourceId)), `${relation.id} has an unknown source`)
  }
  for (const division of atlasData.administrativeDivisions) {
    assert.ok(polityIds.has(division.polityId), `${division.id} has an unknown polity`)
    assert.equal(division.geometry.precision, 'schematic', `${division.id} should not imply final boundaries`)
    assert.ok(division.geometry.coordinates.every(pointIsValid), `${division.id} has invalid geometry`)
    for (const placeId of division.placeIds) assert.ok(placeById.has(placeId), `${division.id} has an unknown place`)
  }
  for (const script of atlasData.scriptEvolution) {
    assert.ok(bilingual(script.name), `${script.id} needs a bilingual name`)
    for (const polityId of script.relatedPolityIds) assert.ok(polityIds.has(polityId), `${script.id} has an unknown polity`)
    for (const inscriptionId of script.sampleInscriptionIds) assert.ok(inscriptionIds.has(inscriptionId), `${script.id} has an unknown sample inscription`)
    assert.equal(script.review.status, 'needs-review', `${script.id} should remain review-gated`)
  }
  for (const id of ['script-early-kannada-verse-transition', 'script-medieval-kannada-temple-epigraphy', 'script-vijayanagara-kannada-nagari-mixed-phase']) {
    assert.ok(atlasData.scriptEvolution.some(item => item.id === id), `${id} must remain in the script evolution queue`)
    assert.ok(atlasData.relationships.some(relation => relation.fromId === id), `${id} must remain linked into the research graph`)
  }
  assert.deepEqual(atlasData.scriptEvolution.find(item => item.id === 'script-modern-kannada-print-transition')?.predecessorIds, ['script-vijayanagara-kannada-nagari-mixed-phase'])
  assert.ok(atlasData.relationships.some(item => item.type === 'feudatory-overlord'))
  assert.ok(atlasData.relationships.some(item => item.type === 'administrative-division-of'))
  assert.ok(atlasData.relationships.some(item => item.type === 'script-sample-inscription'))
  const summary=atlasData.openDatasetCatalogue.find(item=>item.id==='dataset-public-atlas-summary')
  assert.ok(summary.includedCollections.includes('feudatoryRelations'))
  assert.ok(summary.path.endsWith('.json'))
  for (const id of ['dataset-p1-model-foundations','dataset-p2-corpus-expansion','dataset-p3-publication-review-workflow']) {
    const packet=atlasData.openDatasetCatalogue.find(item=>item.id===id)
    assert.ok(packet, `${id} must be available as a focused public export packet`)
    assert.equal(packet.access, 'static-json')
    assert.ok(packet.includedCollections.length >= 4, `${id} should include useful review collections`)
    assert.ok(packet.excludedFields.some(field=>field.includes('private')||field.includes('unapproved')), `${id} must declare privacy exclusions`)
  }
})

test('Karnata-origin Nepal reach is mapped without claiming Karnataka territorial rule', () => {
  const simraungarh=placeById.get('place-simraungarh')
  const karnataTirhut=atlasData.externalPolities.find(item=>item.id==='external-polity-karnata-tirhut')
  const nanyadeva=atlasData.people.find(item=>item.id==='person-nanyadeva')
  const foundation=atlasData.events.find(item=>item.id==='event-nanyadeva-founds-simraungarh')
  const contested=atlasData.events.find(item=>item.id==='event-nanyadeva-nepal-valley-claim')
  const fortress=atlasData.culturalHeritage.find(item=>item.id==='culture-simraungarh-karnata-fortress-city')
  assert.ok(simraungarh?.geographicScope?.outsideKarnataka, 'Simraungarh must be treated as outside Karnataka')
  assert.ok(simraungarh?.geographicScope?.outsideIndia, 'Simraungarh must be treated as outside India')
  assert.equal(karnataTirhut?.capitalId, 'place-simraungarh')
  assert.equal(nanyadeva?.polityId, 'external-polity-karnata-tirhut')
  assert.equal(foundation?.destinationPlaceId, 'place-simraungarh')
  assert.equal(foundation?.reach?.territorialControl, true)
  assert.equal(foundation?.review.status, 'needs-review')
  assert.equal(contested?.destinationPlaceId, 'place-bhaktapur-nepal')
  assert.equal(contested?.reach?.evidenceLevel, 'contested')
  assert.equal(contested?.reach?.territorialControl, false)
  assert.ok(fortress?.placeIds.includes('place-simraungarh'))
  assert.ok(atlasData.administrativeDivisions.some(item=>item.id==='admin-tirhut-simraungarh-karnata-zone'&&item.geometry.precision==='schematic'))
})

test('outside-Karnataka Kannada and Karnata rule layer has explorable regional coverage', () => {
  for (const id of ['external-polity-karnata-tirhut','external-polity-eastern-chalukya-vengi','external-polity-goa-kadamba','external-polity-sevuna-devagiri']) {
    const polity=atlasData.externalPolities.find(item=>item.id===id)
    assert.ok(polity, `${id} should exist as an external polity`)
    assert.equal(polity.review.status, 'needs-review', `${id} should remain review-gated`)
    assert.ok(placeById.has(polity.capitalId), `${id} should point to a mapped capital`)
  }
  for (const id of ['event-eastern-chalukya-vengi-foundation','event-goa-kadamba-gopakapattana','event-sevuna-devagiri-independent-power','event-vijayanagara-southern-deccan-tamil-country','event-rashtrakuta-western-central-india-reach','event-kalyani-chalukya-vikramaditya-vi-empire-reach']) {
    const event=atlasData.events.find(item=>item.id===id)
    assert.ok(event, `${id} should exist as a mapped reach event`)
    assert.equal(event.reach?.territorialControl, true, `${id} should be marked as territorial-control evidence`)
    assert.ok(['attested','contested'].includes(event.reach?.evidenceLevel), `${id} should expose evidence level`)
    assert.ok(event.route?.coordinates.length >= 2, `${id} should have a route for the explorer`)
    assert.equal(event.review.status, 'needs-review', `${id} should stay review-gated`)
  }
  for (const id of ['place-vengi','place-gopakapattana','place-devagiri']) {
    const place=placeById.get(id)
    assert.ok(place?.geographicScope?.outsideKarnataka, `${id} should be outside Karnataka`)
    assert.ok(pointIsValid(place.location.coordinates), `${id} should be mappable`)
  }
  const publicSummary=atlasData.openDatasetCatalogue.find(item=>item.id==='dataset-public-atlas-summary')
  assert.ok(publicSummary.includedCollections.includes('externalPolities'))
  assert.ok(publicSummary.includedCollections.includes('culturalHeritage'))
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

test('P2 corpus expansion seeds are explicit, linked and review-gated', () => {
  assert.ok(atlasData.genealogicalRelations.length >= 7)
  assert.ok(atlasData.coinRecords.length >= 6)
  assert.ok(atlasData.manuscriptWitnesses.length >= 7)
  assert.ok(atlasData.boundaryEvidence.length >= 7)
  assert.ok(atlasData.inscriptionEditions.length >= 20)
  for (const item of atlasData.genealogicalRelations) {
    assert.ok(personIds.has(item.fromPersonId), `${item.id} has an unknown source person`)
    assert.ok(personIds.has(item.toPersonId), `${item.id} has an unknown target person`)
    assert.equal(item.review.status, 'needs-review')
    assert.ok(['primary', 'secondary', 'derived', 'contested'].includes(item.evidenceLevel))
    assert.ok(/review|proof|evidence/i.test(item.derivation.en), `${item.id} must explain whether it is final family-tree evidence`)
  }
  for (const item of atlasData.coinRecords) {
    assert.ok(polityIds.has(item.polityId), `${item.id} has an unknown polity`)
    assert.ok(placeById.has(item.placeId), `${item.id} has an unknown place`)
    assert.equal(item.review.status, 'needs-review')
    assert.ok(item.image.status, `${item.id} needs image status`)
    assert.ok(['catalogue', 'image', 'metal', 'weight', 'findspot'].every(field => item.evidenceGates[field]), `${item.id} needs coin evidence gates`)
  }
  for (const item of atlasData.manuscriptWitnesses) {
    assert.ok(workIds.has(item.workId), `${item.id} has an unknown work`)
    assert.equal(item.review.status, 'needs-review')
    assert.ok(['repositoryRecord', 'shelfmark', 'editionComparison', 'license'].every(field => item.evidenceGates[field]), `${item.id} needs manuscript evidence gates`)
  }
  for (const item of atlasData.boundaryEvidence) {
    assert.ok(atlasData.territorialExtents.some(extent => extent.id === item.extentId), `${item.id} has an unknown extent`)
    assert.equal(item.review.status, 'needs-review')
    assert.ok(item.blockingEvidence.length, `${item.id} must retain unresolved boundary work`)
  }
  for (const item of atlasData.inscriptionEditions) {
    assert.ok(inscriptionIds.has(item.inscriptionId), `${item.id} has an unknown inscription`)
    assert.equal(item.review.status, 'needs-review')
    assert.ok(['itemEdition', 'transcription', 'translation', 'photographs', 'authorityCoordinate'].every(field => item.evidenceGates[field]), `${item.id} needs edition evidence gates`)
    assert.ok(['open', 'in-progress', 'blocked', 'complete'].includes(item.locatorReview?.status), `${item.id} needs locator-review status`)
    assert.ok(['high', 'normal', 'low'].includes(item.locatorReview?.priority), `${item.id} needs locator-review priority`)
    assert.ok(item.locatorReview?.requiredLocators?.length >= 4, `${item.id} needs required locator fields`)
    assert.ok(bilingual(item.locatorReview?.nextAction), `${item.id} needs a bilingual locator-review next action`)
    for (const scriptPhaseId of item.locatorReview?.scriptPhaseIds || []) assert.ok(atlasData.scriptEvolution.some(script => script.id === scriptPhaseId), `${item.id} has an unknown script phase link`)
  }
  const barusEdition=atlasData.inscriptionEditions.find(item=>item.id==='edition-inscription-lobu-tua-barus')
  assert.equal(barusEdition?.itemEdition.number, '13')
  assert.equal(barusEdition?.itemEdition.status, 'located')
  assert.equal(atlasData.manuscriptWitnesses.find(item=>item.id==='manuscript-vaddaradhane-palm-leaf-witness-lead')?.date.from, 1434)
  assert.equal(atlasData.boundaryEvidence.find(item=>item.id==='boundary-evidence-rashtrakuta-kannauj-campaign-circa-800')?.evidenceKind, 'campaign-route')
  for (const id of ['genealogy-vishnuvardhana-ballala-ii-hoysala-line','genealogy-yaduraya-krishnaraja-iii-mysore-line','coin-hoysala-belur-numismatic-lead','coin-mysore-srirangapatna-tipu-lead','manuscript-kumaravyasa-bharata-sanchaya-witness-lead','manuscript-torave-ramayana-sanchaya-witness-lead','boundary-evidence-hoysala-vishnuvardhana-1117','boundary-evidence-mysore-tipu-sultan-1787','edition-inscription-shravanabelagola-cluster','edition-inscription-muktesvara-attiraja-review-packet']) {
    assert.ok(atlasData.relationships.some(relation=>relation.fromId===id||relation.sourceRecordId===id), `${id} must be linked into the public research graph`)
  }
  for (const id of ['edition-inscription-talagunda','edition-inscription-atakur','edition-inscription-belur-foundation','edition-inscription-takuapa-tamil-guild']) {
    const edition=atlasData.inscriptionEditions.find(item=>item.id===id)
    assert.equal(edition?.review.status, 'needs-review')
    assert.equal(edition?.itemEdition.status, 'provisional')
  }
  for (const id of ['edition-inscription-halmidi-review-packet','edition-inscription-kappe-arabhatta','edition-inscription-begur','edition-inscription-atakur','edition-inscription-lakkundi','edition-inscription-belur-foundation','edition-inscription-hampi-cluster','edition-inscription-hampi-krishna-temple','edition-inscription-muktesvara-attiraja-review-packet']) {
    const edition=atlasData.inscriptionEditions.find(item=>item.id===id)
    assert.equal(edition?.locatorReview.priority, 'high', `${id} must stay prioritized for the script-evolution maturity path`)
    assert.ok(edition?.locatorReview.scriptPhaseIds.length > 0, `${id} must remain linked to a script phase`)
  }
})
