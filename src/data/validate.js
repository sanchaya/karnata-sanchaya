import { checkTranslationGlossary, checkMissingKannadaTranslation } from './translation-glossary.js'

const ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const COLLECTIONS = ['polities','externalPolities','externalGovernancePhases','events','culturalHeritage','periodicals','epigraphiaArchiveTexts','karnatakaArchaeologyTexts','artifacts','feudatoryRelations','genealogicalRelations','administrativeDivisions','boundaryEvidence','coinRecords','manuscriptWitnesses','inscriptionEditions','scriptEvolution','openDatasetCatalogue','templeInventoryLeads','heritageInventoryLeads','naksheSites','reigns','territorialExtents','deepChronologies','heritageAudits','districtHistoryResearch','inscriptionAudits','people','peopleCandidates','martyrCandidates','places','inscriptions','works','sources','relationships','politicalRelations','collaborations']
const PERSON_ROLES=['ruler','queen','foreign-monarch','patron','poet','author','vachana-poet','scholar','administrator','military-leader','diplomat','religious-figure','explorer','traveller','community-hero','community-leader','defender','resistance-leader','resistance-fighter','freedom-fighter','organiser','social-reformer','cultural-organiser','journalist','lieutenant','soldier','artisan','washerman','boatman','actor','film-director','screenwriter','artist','theatre-director','minister']
const PEOPLE_CANDIDATE_EVIDENCE=['identity','karnatakaConnection','bilingualName','lifeDates','roles','contributions','authorityCitations','imageLicense']
const HERITAGE_CATEGORIES = ['temple','coastal-temple','basadi','dargah','church','monastery','fort','palace-civic-architecture','colonial-architecture','archaeological-landscape','modern-heritage']
const DISTRICT_HISTORY_CATEGORIES = ['prehistoric-landscape','settlement-origin','urban-foundation','foundation-stone','regional-memory','district-scope']

export function validateAtlas(data) {
  const issues = []
  const add = (severity, collection, id, path, message) => issues.push({ severity, collection, id, path, message })
  if (!data || typeof data !== 'object') return [{ severity:'error', collection:'dataset', id:'', path:'', message:'Dataset must be an object.' }]
  if (!data.meta?.schemaVersion) add('error','meta','meta','schemaVersion','A schema version is required.')

  const all = new Map()
  const knownIds=new Set(COLLECTIONS.flatMap(collection=>Array.isArray(data[collection])?data[collection].map(record=>record?.id).filter(Boolean):[]))
  COLLECTIONS.forEach(collection => {
    if (!Array.isArray(data[collection])) return add('error',collection,'',collection,'Collection must be an array.')
    data[collection].forEach((record, index) => {
      const id = record?.id || `row-${index + 1}`
      if (!record?.id) add('error',collection,id,'id','Stable ID is required.')
      else if (!ID_PATTERN.test(record.id)) add('error',collection,id,'id','ID must be lowercase kebab-case.')
      else if (all.has(record.id)) add('error',collection,id,'id',`Duplicate ID; already used in ${all.get(record.id)}.`)
      else all.set(record.id, collection)
      if (collection !== 'relationships' && collection !== 'sources') {
        if (!record?.name?.en?.trim()) add('error',collection,id,'name.en','English name is required.')
        if (!['peopleCandidates','martyrCandidates'].includes(collection)&&!record?.name?.kn?.trim()) add('warning',collection,id,'name.kn','Kannada name is missing.')
      }
      if (!record?.review?.status || !['draft','needs-review','reviewed','published'].includes(record.review.status)) add('error',collection,id,'review.status','Review status is missing or invalid.')
      if (record?.date) {
        if (!['year','circa','range','century','unknown'].includes(record.date.precision)) add('error',collection,id,'date.precision','Date precision is invalid.')
        if (record.date.from != null && record.date.to != null && (record.date.era==='BCE'?Number(record.date.from)<Number(record.date.to):Number(record.date.from)>Number(record.date.to))) add('error',collection,id,'date','Date range is not chronological for its era.')
      }
      if (record?.location?.type === 'Point') {
        const [lng,lat] = record.location.coordinates || []
        if (!Number.isFinite(lng) || !Number.isFinite(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) add('error',collection,id,'location.coordinates','Point coordinates must be valid [longitude, latitude].')
      }
      if (collection === 'events') {
        if (!['battle','war','invasion','campaign','diplomatic-mission','trade-contact','cultural-contact','inscription','kingdom-foundation','regime-change','capital-relocation','accession','constitutional-transition','state-reorganisation'].includes(record.type)) add('error',collection,id,'type','Event type is invalid.')
        if (!Array.isArray(record.participants) || record.participants.length === 0) add('error',collection,id,'participants','At least one event participant is required.')
        if (record.route && (record.route.type !== 'LineString' || !Array.isArray(record.route.coordinates) || record.route.coordinates.length < 2)) add('error',collection,id,'route','A campaign route must be a GeoJSON LineString with at least two points.')
        if (record.reach) {
          if (!['regional','transregional','overseas'].includes(record.reach.scale)) add('error',collection,id,'reach.scale','Reach scale must be regional, transregional, or overseas.')
          if (!['outbound','inbound','bidirectional'].includes(record.reach.direction)) add('error',collection,id,'reach.direction','Reach direction is invalid.')
          if (!record.reach.relationKind?.trim()) add('error',collection,id,'reach.relationKind','A relationship kind is required for cross-border reach.')
          if (!['attested','inferred','contested'].includes(record.reach.evidenceLevel)) add('error',collection,id,'reach.evidenceLevel','Evidence level is invalid.')
          if (typeof record.reach.territorialControl !== 'boolean') add('error',collection,id,'reach.territorialControl','Territorial control must be explicitly true or false.')
          if (record.reach.scale === 'overseas' && (!Array.isArray(record.reach.modernCountries) || record.reach.modernCountries.length === 0)) add('error',collection,id,'reach.modernCountries','Overseas records require at least one modern ISO country code.')
          ;(record.reach.modernCountries || []).forEach((code,index) => { if (!/^[A-Z]{2}$/.test(code)) add('error',collection,id,`reach.modernCountries.${index}`,'Country codes must use two uppercase ISO letters.') })
          if (!record.reach.note?.en?.trim()) add('warning',collection,id,'reach.note.en','An evidence/interpretation note is recommended.')
          if (!record.reach.note?.kn?.trim()) add('warning',collection,id,'reach.note.kn','A Kannada evidence/interpretation note is recommended.')
        }
      }
      if (collection === 'politicalRelations') {
        const relationKinds=['war','invasion','campaign','trade','diplomacy','travel-knowledge','treaty','alliance','tribute','suzerainty','administrative-integration','constitutional-integration']
        if (!relationKinds.includes(record.relationKind)) add('error',collection,id,'relationKind','Bilateral relation kind is invalid.')
        if (!Array.isArray(record.parties) || record.parties.length < 2) add('error',collection,id,'parties','A bilateral relation requires at least two parties.')
        ;(record.parties || []).forEach((party,index)=>{if(!party.polityId||!party.role)add('error',collection,id,`parties.${index}`,'Every party requires a polity ID and role.')})
        if (!record.geography?.region?.trim() || !record.geography?.corridor?.trim()) add('error',collection,id,'geography','Relations require a region and historical corridor.')
        const route=record.geography?.route
        if (!route || route.type!=='LineString' || !Array.isArray(route.coordinates) || route.coordinates.length<2) add('error',collection,id,'geography.route','Relations require a mapped campaign/contact route with at least two coordinates.')
        ;(route?.coordinates || []).forEach((point,index)=>{const [lng,lat]=point||[];if(!Number.isFinite(lng)||!Number.isFinite(lat)||lng < -180||lng > 180||lat < -90||lat > 90)add('error',collection,id,`geography.route.coordinates.${index}`,'Route coordinates must be valid [longitude, latitude] pairs.')})
        ;(record.geography?.battleLocations || []).forEach((location,index)=>{const [lng,lat]=location.coordinates||[];if(!location.label?.trim()||!Number.isFinite(lng)||!Number.isFinite(lat)||lng < -180||lng > 180||lat < -90||lat > 90)add('error',collection,id,`geography.battleLocations.${index}`,'Battle locations require a label and valid longitude/latitude coordinates.')})
        if (!['attested','inferred','contested'].includes(record.evidenceLevel)) add('error',collection,id,'evidenceLevel','Relation evidence level is invalid.')
        if (!Array.isArray(record.peopleIds) || !Array.isArray(record.eventIds) || !Array.isArray(record.treatyDocuments)) add('error',collection,id,'links','Relations require people, event and treaty-document arrays.')
        if (!Array.isArray(record.reviewChecklist) || record.reviewChecklist.length < 6) add('error',collection,id,'reviewChecklist','Relations require six explicit evidence-review checklist items.')
        ;(record.reviewChecklist || []).forEach((item,index)=>{if(!item.field||!['unresolved','located','verified','not-applicable'].includes(item.status))add('error',collection,id,`reviewChecklist.${index}`,'Review checklist items require a field and supported status.')})
        ;(record.treatyDocuments || []).forEach((document,index)=>{if(!document.title?.en?.trim()||!document.title?.kn?.trim()||!document.sourceId||!document.locator)add('error',collection,id,`treatyDocuments.${index}`,'Treaty documents require bilingual title, source and locator.')})
        if (!record.outcome?.en?.trim() || !record.outcome?.kn?.trim()) add('warning',collection,id,'outcome','A bilingual outcome statement is recommended.')
      }
      if (collection === 'externalGovernancePhases') {
        const governanceKinds=['temporary-occupation','direct-administration','imperial-province','mixed-administration-and-tribute','direct-colonial-administration','paramountcy']
        if (!governanceKinds.includes(record.governanceType)) add('error',collection,id,'governanceType','External governance type is invalid.')
        if (!record.governingPolityId) add('error',collection,id,'governingPolityId','A governing external polity is required.')
        if (!record.date || record.date.from == null || record.date.to == null) add('error',collection,id,'date','A bounded governance date range is required.')
        const geometry=record.geography?.geometry
        if (geometry?.type!=='Polygon'||!Array.isArray(geometry.coordinates)||geometry.coordinates.length<3) add('error',collection,id,'geography.geometry','A schematic governance polygon with at least three points is required.')
        ;(geometry?.coordinates||[]).forEach((point,index)=>{const [lng,lat]=point||[];if(!Number.isFinite(lng)||!Number.isFinite(lat)||lng < -180||lng > 180||lat < -90||lat > 90)add('error',collection,id,`geography.geometry.coordinates.${index}`,'Governance geometry requires valid longitude/latitude pairs.')})
        if (!record.description?.en?.trim()||!record.description?.kn?.trim()||!record.interpretation?.en?.trim()||!record.interpretation?.kn?.trim()) add('error',collection,id,'description','Governance phases require bilingual description and interpretation fields.')
        if (!Array.isArray(record.citations)||record.citations.length===0) add('error',collection,id,'citations','Governance phases require citations.')
      }
      if (collection === 'collaborations') {
        if (!['organization','university','individual'].includes(record.entityKind)) add('error',collection,id,'entityKind','Collaboration entity kind is invalid.')
        if (!['steward','open','upcoming','active','complete'].includes(record.stage)) add('error',collection,id,'stage','Collaboration stage is invalid.')
        if (!record.collaborationType?.trim()) add('error',collection,id,'collaborationType','A collaboration type is required.')
        if (!record.contribution?.en?.trim() || !record.contribution?.kn?.trim()) add('error',collection,id,'contribution','A bilingual contribution or opportunity statement is required.')
        if (record.url && !/^https:\/\//.test(record.url)) add('error',collection,id,'url','Public collaboration URLs must use HTTPS.')
      }
      if (collection === 'sources') {
        if (!record.title?.en?.trim()) add('error',collection,id,'title.en','An English source title is required for citation export.')
        if (!record.title?.kn?.trim()) add('warning',collection,id,'title.kn','A Kannada source title is recommended.')
        if (!record.type?.trim()) add('error',collection,id,'type','A source type is required.')
        if (!Array.isArray(record.authors) || record.authors.length===0) add('error',collection,id,'authors','At least one author, editor, organization or repository is required.')
        if (record.year!=null && (!Number.isInteger(record.year)||record.year<0)) add('error',collection,id,'year','Source year must be a positive whole year or null.')
        if (record.url && !/^https:\/\//.test(record.url)) add('error',collection,id,'url','Public source URLs must use HTTPS.')
        if (record.alternateUrls!=null && (!Array.isArray(record.alternateUrls) || record.alternateUrls.some(url=>!/^https:\/\//.test(url)))) add('error',collection,id,'alternateUrls','Alternate source URLs must be an array of HTTPS URLs.')
        if (record.doi!=null && typeof record.doi!=='string') add('error',collection,id,'doi','DOI must be text when supplied.')
        if (record.isbn!=null && typeof record.isbn!=='string') add('error',collection,id,'isbn','ISBN must be text when supplied.')
        ;(record.contentReview?.atlasLinks || []).forEach((link,index)=>{
          if (!link.linkKind?.trim()) add('error',collection,id,`contentReview.atlasLinks.${index}.linkKind`,'Itihasa Darshana atlas links require a link kind.')
          if (!link.label?.en?.trim() || !link.label?.kn?.trim()) add('error',collection,id,`contentReview.atlasLinks.${index}.label`,'Itihasa Darshana atlas links require bilingual labels.')
          if (!['high','medium','low'].includes(link.confidence)) add('error',collection,id,`contentReview.atlasLinks.${index}.confidence`,'Atlas link confidence must be high, medium or low.')
          if (link.status !== 'needs-article-page-review') add('error',collection,id,`contentReview.atlasLinks.${index}.status`,'Itihasa Darshana links must remain needs-article-page-review until exact page locators are verified.')
          if (!Array.isArray(link.requiredReview) || link.requiredReview.length < 4) add('error',collection,id,`contentReview.atlasLinks.${index}.requiredReview`,'Atlas links require explicit article/page review gates.')
          if (!Array.isArray(link.targetRecordIds) || link.targetRecordIds.length === 0) add('error',collection,id,`contentReview.atlasLinks.${index}.targetRecordIds`,'Atlas links require target records.')
          ;(link.targetRecordIds || []).forEach((targetId,targetIndex)=>{if(!knownIds.has(targetId))add('error',collection,id,`contentReview.atlasLinks.${index}.targetRecordIds.${targetIndex}`,`Unknown Itihasa Darshana link target: ${targetId}`)})
        })
      }
      if (collection === 'reigns') {
        if (!['reign','regency','political-phase'].includes(record.periodType)) add('error',collection,id,'periodType','Period type must be reign, regency, or political-phase.')
        if (!record.polityId) add('error',collection,id,'polityId','A related polity is required.')
        if (!Array.isArray(record.rulerIds)) add('error',collection,id,'rulerIds','Ruler IDs must be an array; political phases may use an empty array.')
        if (record.periodType !== 'political-phase' && record.rulerIds?.length === 0) add('error',collection,id,'rulerIds','Reigns and regencies require at least one ruler.')
        if (!Array.isArray(record.capitalIds)) add('error',collection,id,'capitalIds','Capital IDs must be an array.')
        if (!record.date || record.date.from == null || record.date.to == null) add('error',collection,id,'date','A bounded date range is required for comparison periods.')
        if (!Array.isArray(record.citations) || record.citations.length === 0) add('warning',collection,id,'citations','Reign and political-period records should cite at least one source.')
      }
      if (collection === 'culturalHeritage') {
        if (!['architecture','visual-art','literature','performance','music','celebration','religious-tradition','craft','games-sports'].includes(record.category)) add('error',collection,id,'category','Cultural category is invalid.')
        if (!['historic','continuing-practice','material-survival','revived','unknown'].includes(record.continuity)) add('error',collection,id,'continuity','Continuity status is invalid.')
        if (!Array.isArray(record.polityIds) || record.polityIds.length === 0) add('error',collection,id,'polityIds','At least one related polity is required.')
        if (!Array.isArray(record.placeIds) || record.placeIds.length === 0) add('error',collection,id,'placeIds','At least one mapped place is required.')
        if (!Array.isArray(record.peopleIds) || !Array.isArray(record.relatedWorkIds) || !Array.isArray(record.traditionTags)) add('error',collection,id,'relationships','People, works, and tradition tags must be arrays.')
        if (!record.description?.en?.trim()) add('warning',collection,id,'description.en','An English interpretation note is recommended.')
        if (!record.description?.kn?.trim()) add('warning',collection,id,'description.kn','A Kannada interpretation note is recommended.')
        if (!Array.isArray(record.citations) || record.citations.length === 0) add('warning',collection,id,'citations','Cultural records should cite at least one source.')
      }
      if (collection === 'artifacts') {
        if (!['dynastic-symbol','inscription-stone','sculpture','architectural-fragment','coinage','regalia','manuscript','seal'].includes(record.artifactKind)) add('error',collection,id,'artifactKind','Artifact kind is invalid.')
        if (!record.polityId) add('error',collection,id,'polityId','A related polity is required.')
        if (!record.placeId) add('error',collection,id,'placeId','A mapped historical place is required.')
        if (!record.date || record.date.from == null || record.date.to == null) add('error',collection,id,'date','An artifact date range is required.')
        const point=record.location
        if (point?.type !== 'Point' || !Array.isArray(point.coordinates) || point.coordinates.length !== 2) add('error',collection,id,'location','An artifact requires a mapped Point context.')
        if (!Array.isArray(record.citations) || record.citations.length === 0) add('warning',collection,id,'citations','Artifacts should cite a source or catalogue lead.')
      }
      if (collection === 'feudatoryRelations') {
        if (!['suzerainty','feudatory','regional-chiefship','feudatory-to-independent-transition','successor-feudatory'].includes(record.relationKind)) add('error',collection,id,'relationKind','Feudatory relation kind is invalid.')
        if (!record.overlordPolityId || !knownIds.has(record.overlordPolityId)) add('error',collection,id,'overlordPolityId','A valid overlord polity is required.')
        if (!record.subordinatePolityId || !knownIds.has(record.subordinatePolityId)) add('error',collection,id,'subordinatePolityId','A valid subordinate polity is required.')
        if (!['low','medium','high'].includes(record.confidence)) add('error',collection,id,'confidence','Confidence must be low, medium or high.')
        if (!record.description?.en?.trim() || !record.description?.kn?.trim()) add('error',collection,id,'description','Feudatory packets require a bilingual interpretation note.')
        if (!Array.isArray(record.placeIds)) add('error',collection,id,'placeIds','Feudatory place links must be an array.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Feudatory packets require at least one source lead.')
        if (record.review?.status !== 'needs-review') add('warning',collection,id,'review.status','Feudatory hierarchy packets should remain needs-review until item-level proof is reviewed.')
      }
      if (collection === 'administrativeDivisions') {
        if (!['province','mandala','nadu','contested-province','administrative-zone'].includes(record.divisionKind)) add('error',collection,id,'divisionKind','Administrative division kind is invalid.')
        if (!record.polityId || !knownIds.has(record.polityId)) add('error',collection,id,'polityId','A valid governing polity is required.')
        const geometry=record.geometry
        if (!geometry || geometry.type!=='Polygon' || !Array.isArray(geometry.coordinates) || geometry.coordinates.length<3) add('error',collection,id,'geometry','Administrative geography requires a schematic polygon with at least three points.')
        ;(geometry?.coordinates||[]).forEach((point,index)=>{const [lng,lat]=point||[];if(!Number.isFinite(lng)||!Number.isFinite(lat)||lng < -180||lng > 180||lat < -90||lat > 90)add('error',collection,id,`geometry.coordinates.${index}`,'Administrative coordinates must be valid [longitude, latitude] pairs.')})
        if (!['schematic','approximate','site-derived','unknown'].includes(geometry?.precision)) add('error',collection,id,'geometry.precision','Administrative geometry precision is invalid.')
        if (!Array.isArray(record.placeIds)) add('error',collection,id,'placeIds','Administrative place links must be an array.')
        if (!record.description?.en?.trim() || !record.description?.kn?.trim()) add('error',collection,id,'description','Administrative packets require a bilingual scope note.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Administrative packets require at least one source lead.')
      }
      if (collection === 'genealogicalRelations') {
        if (!['parent-child','sibling','spouse','adoption','dynastic-claim','succession-family-assertion'].includes(record.relationKind)) add('error',collection,id,'relationKind','Genealogy relation kind is invalid.')
        if (!record.fromPersonId || !knownIds.has(record.fromPersonId)) add('error',collection,id,'fromPersonId','A valid source person is required.')
        if (!record.toPersonId || !knownIds.has(record.toPersonId)) add('error',collection,id,'toPersonId','A valid target person is required.')
        if (record.fromPersonId === record.toPersonId) add('error',collection,id,'toPersonId','A genealogy assertion cannot point to the same person.')
        if (!record.polityId || !knownIds.has(record.polityId)) add('error',collection,id,'polityId','A valid dynasty or polity context is required.')
        if (!['primary','secondary','derived','contested'].includes(record.evidenceLevel)) add('error',collection,id,'evidenceLevel','Genealogy evidence level is invalid.')
        if (!['low','medium','high'].includes(record.confidence)) add('error',collection,id,'confidence','Genealogy confidence must be low, medium or high.')
        if (!record.derivation?.en?.trim() || !record.derivation?.kn?.trim()) add('error',collection,id,'derivation','Genealogy assertions require a bilingual derivation note.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Genealogy assertions require at least one source or derivation lead.')
      }
      if (collection === 'boundaryEvidence') {
        if (!record.extentId || !knownIds.has(record.extentId)) add('error',collection,id,'extentId','Boundary evidence requires a valid territorial extent.')
        if (!record.polityId || !knownIds.has(record.polityId)) add('error',collection,id,'polityId','Boundary evidence requires a valid polity.')
        if (!['source-map','inscription-cluster','administrative-unit','campaign-route','schematic-synthesis'].includes(record.evidenceKind)) add('error',collection,id,'evidenceKind','Boundary evidence kind is invalid.')
        if (!['low','medium','high'].includes(record.confidence)) add('error',collection,id,'confidence','Boundary evidence confidence must be low, medium or high.')
        if (!['exact','approximate','schematic','unresolved'].includes(record.geometryStatus)) add('error',collection,id,'geometryStatus','Boundary geometry status is invalid.')
        if (!Array.isArray(record.requiredEvidence) || record.requiredEvidence.length===0) add('error',collection,id,'requiredEvidence','Boundary evidence needs required evidence gates.')
        if (!Array.isArray(record.completedEvidence) || !Array.isArray(record.blockingEvidence)) add('error',collection,id,'evidenceLists','Boundary completed and blocking evidence must be arrays.')
        if (record.blockingEvidence.some(field=>!record.requiredEvidence.includes(field))) add('error',collection,id,'blockingEvidence','Boundary blockers must come from required evidence.')
        if (!record.methodology?.en?.trim() || !record.methodology?.kn?.trim()) add('error',collection,id,'methodology','Boundary evidence requires a bilingual methodology note.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Boundary evidence requires citations.')
      }
      if (collection === 'coinRecords') {
        if (!['dynastic-coinage-lead','catalogued-coin','hoard-record','mint-record','contested-origin-coinage-lead'].includes(record.coinKind)) add('error',collection,id,'coinKind','Coin record kind is invalid.')
        if (!record.polityId || !knownIds.has(record.polityId)) add('error',collection,id,'polityId','Coin records require a valid polity.')
        if (!record.placeId || !knownIds.has(record.placeId)) add('error',collection,id,'placeId','Coin records require a valid findspot or regional context place.')
        if (record.weightGrams != null && (!Number.isFinite(record.weightGrams) || record.weightGrams <= 0)) add('error',collection,id,'weightGrams','Coin weight must be a positive number when supplied.')
        if (record.diameterMm != null && (!Number.isFinite(record.diameterMm) || record.diameterMm <= 0)) add('error',collection,id,'diameterMm','Coin diameter must be a positive number when supplied.')
        if (!record.obverse?.en?.trim() || !record.obverse?.kn?.trim() || !record.reverse?.en?.trim() || !record.reverse?.kn?.trim()) add('error',collection,id,'obverse/reverse','Coin records require bilingual obverse and reverse notes.')
        if (!record.findspot?.placeId || !knownIds.has(record.findspot.placeId) || !['exact','site','regional-context','unknown'].includes(record.findspot.certainty)) add('error',collection,id,'findspot','Coin findspot context is missing or invalid.')
        if (!record.image?.status || !['available','missing','restricted','unlicensed'].includes(record.image.status)) add('error',collection,id,'image.status','Coin image status is invalid.')
        if (!record.evidenceGates || ['catalogue','image','metal','weight','findspot'].some(field=>!['verified','located','provisional','unresolved','not-applicable'].includes(record.evidenceGates[field]?.status))) add('error',collection,id,'evidenceGates','Coin records require catalogue, image, metal, weight and findspot evidence gates.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Coin records require citations.')
      }
      if (collection === 'manuscriptWitnesses') {
        if (!record.workId || !knownIds.has(record.workId)) add('error',collection,id,'workId','Manuscript witnesses require a valid work.')
        if (!['physical-manuscript','printed-edition','digital-edition-lead','catalogue-entry'].includes(record.witnessKind)) add('error',collection,id,'witnessKind','Manuscript witness kind is invalid.')
        if (!record.repository?.en?.trim() || !record.repository?.kn?.trim()) add('error',collection,id,'repository','Manuscript witnesses require a bilingual repository label.')
        if (!record.language?.trim() || !record.script?.trim()) add('error',collection,id,'language/script','Manuscript witnesses require language and script.')
        if (!['complete','fragmentary','excerpt','unknown'].includes(record.completeness)) add('error',collection,id,'completeness','Manuscript completeness is invalid.')
        if (!['linked-lead','public','restricted','unresolved'].includes(record.access?.status)) add('error',collection,id,'access.status','Manuscript access status is invalid.')
        if (record.access?.url && !/^https:\/\//.test(record.access.url)) add('error',collection,id,'access.url','Manuscript access URL must use HTTPS.')
        if (!record.evidenceGates || ['repositoryRecord','shelfmark','editionComparison','license'].some(field=>!['verified','located','provisional','unresolved','not-applicable'].includes(record.evidenceGates[field]?.status))) add('error',collection,id,'evidenceGates','Manuscript witnesses require repository, shelfmark, edition-comparison and license gates.')
      }
      if (collection === 'inscriptionEditions') {
        if (!record.inscriptionId || !knownIds.has(record.inscriptionId)) add('error',collection,id,'inscriptionId','Inscription editions require a valid inscription.')
        if (!['item-edition-review','published-edition','translation-review','photograph-set'].includes(record.editionKind)) add('error',collection,id,'editionKind','Inscription edition kind is invalid.')
        if (!record.language?.trim() || !record.script?.trim()) add('error',collection,id,'language/script','Inscription editions require language and script.')
        if (!record.itemEdition?.series?.trim() || !['verified','located','provisional','unresolved'].includes(record.itemEdition.status)) add('error',collection,id,'itemEdition','Inscription editions require an edition series and status.')
        if (!['not-started','aligned','partial','unresolved'].includes(record.textWitness?.lineAlignment)) add('error',collection,id,'textWitness.lineAlignment','Edition line alignment status is invalid.')
        if (!['available','missing','restricted','unlicensed'].includes(record.photographSet?.status) || !Number.isInteger(record.photographSet.itemCount) || record.photographSet.itemCount < 0) add('error',collection,id,'photographSet','Photograph set status and count are required.')
        if (!record.evidenceGates || ['itemEdition','transcription','translation','photographs','authorityCoordinate'].some(field=>!['verified','located','provisional','unresolved','not-applicable'].includes(record.evidenceGates[field]?.status))) add('error',collection,id,'evidenceGates','Inscription editions require item, text, translation, photograph and coordinate gates.')
        if (!record.locatorReview || !['open','in-progress','blocked','complete'].includes(record.locatorReview.status) || !['high','normal','low'].includes(record.locatorReview.priority)) add('error',collection,id,'locatorReview','Inscription editions require locator-review status and priority.')
        if (!Array.isArray(record.locatorReview?.requiredLocators) || record.locatorReview.requiredLocators.length < 4) add('error',collection,id,'locatorReview.requiredLocators','Locator review requires the source fields still needed for promotion.')
        if (!record.locatorReview?.nextAction?.en?.trim() || !record.locatorReview?.nextAction?.kn?.trim()) add('error',collection,id,'locatorReview.nextAction','Locator review requires a bilingual next action.')
        ;(record.locatorReview?.scriptPhaseIds || []).forEach((scriptPhaseId,index)=>{if(!knownIds.has(scriptPhaseId))add('error',collection,id,`locatorReview.scriptPhaseIds.${index}`,`Unknown script phase: ${scriptPhaseId}`)})
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Inscription editions require citations.')
      }
      if (collection === 'scriptEvolution') {
        if (!record.scriptFamily?.trim()) add('error',collection,id,'scriptFamily','A script family label is required.')
        if (!Array.isArray(record.predecessorIds) || !Array.isArray(record.sampleInscriptionIds) || !Array.isArray(record.relatedPolityIds)) add('error',collection,id,'links','Script records require predecessor, sample inscription and polity arrays.')
        ;(record.predecessorIds||[]).forEach((predecessorId,index)=>{if(!knownIds.has(predecessorId))add('error',collection,id,`predecessorIds.${index}`,`Unknown predecessor script: ${predecessorId}`)})
        ;(record.sampleInscriptionIds||[]).forEach((inscriptionId,index)=>{if(!knownIds.has(inscriptionId))add('error',collection,id,`sampleInscriptionIds.${index}`,`Unknown sample inscription: ${inscriptionId}`)})
        ;(record.relatedPolityIds||[]).forEach((polityId,index)=>{if(!knownIds.has(polityId))add('error',collection,id,`relatedPolityIds.${index}`,`Unknown related polity: ${polityId}`)})
        if (!record.description?.en?.trim() || !record.description?.kn?.trim()) add('error',collection,id,'description','Script records require a bilingual interpretation note.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Script records require at least one source lead.')
      }
      if (collection === 'epigraphiaArchiveTexts') {
        if (!record.archiveIdentifier?.trim()) add('error',collection,id,'archiveIdentifier','Archive text records require an Internet Archive identifier.')
        if (!record.itemUrl?.startsWith('https://archive.org/details/')) add('error',collection,id,'itemUrl','Archive text records require a stable Archive.org item URL.')
        if (!record.textFile?.url?.startsWith('https://archive.org/download/') || !record.textFile?.name?.endsWith('.txt')) add('error',collection,id,'textFile','Archive text records require a TXT derivative URL.')
        if (!['Epigraphia Carnatica','Epigraphia Indica','Annual Report on South Indian Epigraphy','Annual Report on Indian Epigraphy','Epigraphy corpus'].includes(record.series)) add('error',collection,id,'series','Archive text record series is invalid.')
        if (!record.citation?.sourceId || !knownIds.has(record.citation.sourceId) || !record.citation.locator?.includes('OCR discovery only')) add('error',collection,id,'citation','Archive text records require a review-safe OCR citation.')
        ;(record.locatorCandidates || []).forEach((candidate,index)=>{
          if (!candidate.id?.startsWith('archive-hint-')) add('error',collection,id,`locatorCandidates.${index}.id`,'Archive locator hints require a stable archive-hint ID.')
          if (!candidate.label?.en?.trim() || !candidate.label?.kn?.trim()) add('error',collection,id,`locatorCandidates.${index}.label`,'Archive locator hints require bilingual labels.')
          if (!Number.isInteger(candidate.matchCount) || candidate.matchCount < 1) add('error',collection,id,`locatorCandidates.${index}.matchCount`,'Archive locator hints require a positive OCR match count.')
          if (candidate.firstOcrLine != null && (!Number.isInteger(candidate.firstOcrLine) || candidate.firstOcrLine < 1)) add('error',collection,id,`locatorCandidates.${index}.firstOcrLine`,'Archive locator hints require a positive OCR line number when present.')
          if (candidate.status !== 'needs-page-image-review') add('error',collection,id,`locatorCandidates.${index}.status`,'Archive locator hints must remain needs-page-image-review.')
          if (!Array.isArray(candidate.matchedTerms) || candidate.matchedTerms.length === 0) add('error',collection,id,`locatorCandidates.${index}.matchedTerms`,'Archive locator hints require matched OCR terms.')
          if (!Array.isArray(candidate.targetRecordIds) || candidate.targetRecordIds.length === 0) add('error',collection,id,`locatorCandidates.${index}.targetRecordIds`,'Archive locator hints require target records.')
          ;(candidate.targetRecordIds || []).forEach((targetId,targetIndex)=>{if(!knownIds.has(targetId))add('error',collection,id,`locatorCandidates.${index}.targetRecordIds.${targetIndex}`,`Unknown Archive locator target: ${targetId}`)})
        })
        if (record.review?.status !== 'needs-review') add('error',collection,id,'review.status','Archive OCR records must remain needs-review until page-image review.')
      }
      if (collection === 'karnatakaArchaeologyTexts') {
        if (!record.archiveIdentifier?.trim()) add('error',collection,id,'archiveIdentifier','Archive text records require an Internet Archive identifier.')
        if (!record.itemUrl?.startsWith('https://archive.org/details/')) add('error',collection,id,'itemUrl','Archive text records require a stable Archive.org item URL.')
        if (!record.textFile?.url?.startsWith('https://archive.org/download/') || !record.textFile?.name?.endsWith('.txt')) add('error',collection,id,'textFile','Archive text records require a TXT derivative URL.')
        if (!['coin-catalogue','epigraphy-corpus','archaeology-report','research-journal'].includes(record.documentKind)) add('error',collection,id,'documentKind','Archive text record document kind is invalid.')
        if (!record.citation?.sourceId || !knownIds.has(record.citation.sourceId) || !record.citation.locator?.includes('OCR discovery only')) add('error',collection,id,'citation','Archive text records require a review-safe OCR citation.')
        ;(record.locatorCandidates || []).forEach((candidate,index)=>{
          if (!candidate.id?.startsWith('archive-hint-')) add('error',collection,id,`locatorCandidates.${index}.id`,'Archive locator hints require a stable archive-hint ID.')
          if (!candidate.label?.en?.trim() || !candidate.label?.kn?.trim()) add('error',collection,id,`locatorCandidates.${index}.label`,'Archive locator hints require bilingual labels.')
          if (!Number.isInteger(candidate.matchCount) || candidate.matchCount < 1) add('error',collection,id,`locatorCandidates.${index}.matchCount`,'Archive locator hints require a positive OCR match count.')
          if (candidate.firstOcrLine != null && (!Number.isInteger(candidate.firstOcrLine) || candidate.firstOcrLine < 1)) add('error',collection,id,`locatorCandidates.${index}.firstOcrLine`,'Archive locator hints require a positive OCR line number when present.')
          if (candidate.status !== 'needs-page-image-review') add('error',collection,id,`locatorCandidates.${index}.status`,'Archive locator hints must remain needs-page-image-review.')
          if (!Array.isArray(candidate.matchedTerms) || candidate.matchedTerms.length === 0) add('error',collection,id,`locatorCandidates.${index}.matchedTerms`,'Archive locator hints require matched OCR terms.')
          if (!Array.isArray(candidate.targetRecordIds) || candidate.targetRecordIds.length === 0) add('error',collection,id,`locatorCandidates.${index}.targetRecordIds`,'Archive locator hints require target records.')
          ;(candidate.targetRecordIds || []).forEach((targetId,targetIndex)=>{if(!knownIds.has(targetId))add('error',collection,id,`locatorCandidates.${index}.targetRecordIds.${targetIndex}`,`Unknown Archive locator target: ${targetId}`)})
        })
        if (record.review?.status !== 'needs-review') add('error',collection,id,'review.status','Archive OCR records must remain needs-review until page-image review.')
      }
      if (collection === 'openDatasetCatalogue') {
        if (!['public-summary','restricted-research','citation-export'].includes(record.datasetKind)) add('error',collection,id,'datasetKind','Dataset kind is invalid.')
        if (!['static-json','citation-file','restricted'].includes(record.access)) add('error',collection,id,'access','Dataset access type is invalid.')
        if (!record.path?.trim() || record.path.startsWith('/')) add('error',collection,id,'path','Public dataset paths must be relative.')
        if (!Array.isArray(record.includedCollections) || record.includedCollections.length===0) add('error',collection,id,'includedCollections','Dataset catalogue records require included collections.')
        ;(record.includedCollections||[]).forEach((collectionName,index)=>{if(!COLLECTIONS.includes(collectionName))add('error',collection,id,`includedCollections.${index}`,`Unknown export collection: ${collectionName}`)})
        if (!Array.isArray(record.excludedFields)) add('error',collection,id,'excludedFields','Excluded fields must be explicit.')
        if (!record.description?.en?.trim() || !record.description?.kn?.trim()) add('error',collection,id,'description','Dataset catalogue records require a bilingual access note.')
      }
      if (collection === 'templeInventoryLeads') {
        if (!record.deity?.trim() || !record.locationLabel?.trim()) add('error',collection,id,'deity/locationLabel','Inventory leads require deity and locality fields.')
        if (!record.district?.en?.trim() || !record.district?.kn?.trim() || !record.taluk?.en?.trim() || !record.taluk?.kn?.trim()) add('error',collection,id,'district/taluk','Inventory leads require bilingual district and taluk labels.')
        if (!['Shaiva','Vaishnava','Jaina'].includes(record.tradition)) add('error',collection,id,'tradition','Inventory tradition must be Shaiva, Vaishnava or Jaina.')
        if (!record.sourceDataset?.trim()) add('error',collection,id,'sourceDataset','Inventory leads require the contributing dataset name.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Inventory leads require a source-row citation.')
      }
      if (collection === 'works') {
        if (!record.creator?.en?.trim() || !record.creator?.kn?.trim()) add('error',collection,id,'creator','Works require a bilingual creator or attributed-author display.')
        if (!Array.isArray(record.languages) || record.languages.length===0) add('warning',collection,id,'languages','At least one work language is recommended.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('warning',collection,id,'citations','Literary works should cite at least one source.')
        ;(record.creatorIds||[]).forEach((creatorId,index)=>{if(!all.has(creatorId))add('error',collection,id,`creatorIds.${index}`,`Unknown creator: ${creatorId}`)})
        if (record.manuscriptWitnesses && !Array.isArray(record.manuscriptWitnesses)) add('error',collection,id,'manuscriptWitnesses','Manuscript and edition witnesses must be an array.')
        if (record.genre != null && typeof record.genre !== 'string') add('error',collection,id,'genre','Literary genre must be text when supplied.')
        const workflow=record.reviewWorkflow
        if (!workflow || workflow.target!=='reviewed-literary-record') add('error',collection,id,'reviewWorkflow','Works require a literary evidence-review workflow.')
        else {
          const expected=['creatorIdentity','workDate','courtContext','bilingualDescription','itemCitation','editionWitness']
          if (!['evidence-capture','independent-review','ready-for-publication'].includes(workflow.status)) add('error',collection,id,'reviewWorkflow.status','Literary review workflow status is invalid.')
          if (!Array.isArray(workflow.requiredEvidence)||expected.some(field=>!workflow.requiredEvidence.includes(field))) add('error',collection,id,'reviewWorkflow.requiredEvidence','Literary review workflow must include all six evidence gates.')
          if (!Array.isArray(workflow.completedEvidence)||!Array.isArray(workflow.blockingEvidence)) add('error',collection,id,'reviewWorkflow.evidenceLists','Completed and blocking evidence must be arrays.')
          expected.forEach(field=>{if(!['verified','located','provisional','unresolved'].includes(workflow.evidence?.[field]?.status))add('error',collection,id,`reviewWorkflow.evidence.${field}`,'Literary evidence status is invalid.')})
          ;(workflow.blockingEvidence||[]).forEach((field,index)=>{if(!expected.includes(field))add('error',collection,id,`reviewWorkflow.blockingEvidence.${index}`,'Unknown literary evidence gate.');else if(workflow.evidence?.[field]?.status==='verified')add('error',collection,id,`reviewWorkflow.blockingEvidence.${index}`,'Verified literary evidence cannot remain blocking.')})
          expected.forEach(field=>{if(workflow.evidence?.[field]?.status!=='verified'&&!workflow.blockingEvidence.includes(field))add('error',collection,id,`reviewWorkflow.blockingEvidence.${field}`,'Every literary evidence gate that is not independently verified must remain blocking.')})
          if(!Array.isArray(workflow.evidenceRequests)||workflow.evidenceRequests.length!==workflow.blockingEvidence.length||workflow.evidenceRequests.some(request=>!workflow.blockingEvidence.includes(request.field)||!request.submissionType||!Array.isArray(request.requiredFields)||!request.requiredFields.length||!request.instruction?.en||!request.instruction?.kn))add('error',collection,id,'reviewWorkflow.evidenceRequests','Every literary blocker requires a bilingual structured evidence request.')
          if(workflow.independentReview?.reviewerRequired!==true||workflow.independentReview?.conflictOfInterestRule!=='reviewer-must-not-be-the-contributor'||!['sourceMatch','identityAndAttribution','dateAndContext','bilingualFidelity','citationCompleteness','reviewerAttestation'].every(check=>workflow.independentReview?.requiredChecks?.includes(check)))add('error',collection,id,'reviewWorkflow.independentReview','Literary packets require independent review, conflict-of-interest separation and every scholarly check.')
        }
      }
      if (collection === 'people') {
        if (!Array.isArray(record.roles) || record.roles.length===0) add('error',collection,id,'roles','People require at least one controlled role.')
        ;(record.roles||[]).forEach((role,index)=>{if(!PERSON_ROLES.includes(role))add('error',collection,id,`roles.${index}`,`Unsupported person role: ${role}`)})
        if (record.gender && !['woman','man','nonbinary','other','unknown'].includes(record.gender)) add('error',collection,id,'gender',`Unsupported gender value: ${record.gender}`)
        ;(record.districtAssociations||[]).forEach((association,index)=>{
          if (!association.districtId) add('error',collection,id,`districtAssociations.${index}.districtId`,'District associations require a stable district ID.')
          if (!association.kind) add('error',collection,id,`districtAssociations.${index}.kind`,'District associations require a relationship kind.')
          if (!Array.isArray(association.citations)||association.citations.length===0) add('warning',collection,id,`districtAssociations.${index}.citations`,'District associations should cite their biographical or event evidence.')
        })
        ;(record.placeAssociations||[]).forEach((association,index)=>{
          if (!association.placeId || !knownIds.has(association.placeId)) add('error',collection,id,`placeAssociations.${index}.placeId`,`Unknown associated place: ${association.placeId||'missing'}`)
          if (!association.kind) add('error',collection,id,`placeAssociations.${index}.kind`,'Place associations require a relationship kind.')
          if (!Array.isArray(association.citations)||association.citations.length===0) add('error',collection,id,`placeAssociations.${index}.citations`,'Place associations require item-level biographical or event evidence.')
        })
        if (!record.polityId) add('warning',collection,id,'polityId','A related polity or historical context is recommended.')
        if (record.date?.precision==='unknown' && (record.date.from!=null||record.date.to!=null)) add('error',collection,id,'date','Unknown person dates must not carry numeric bounds.')
        if ((!Array.isArray(record.citations)||record.citations.length===0) && !['ruler','patron'].some(role=>record.roles?.includes(role))) add('warning',collection,id,'citations','Non-ruler person profiles should cite at least one biographical or work-level source.')
      }
      if (collection === 'peopleCandidates') {
        if (!/^person-candidate-q\d+$/.test(record.id)) add('error',collection,id,'id','Wikimedia person candidates require a stable person-candidate-q… ID.')
        if (!/^Q\d+$/.test(record.externalIds?.wikidata||'')) add('error',collection,id,'externalIds.wikidata','A Wikidata Q identifier is required.')
        if (!Array.isArray(record.roles)||record.roles.length===0) add('error',collection,id,'roles','Candidate people require at least one discovery role.')
        ;(record.roles||[]).forEach((role,index)=>{if(!PERSON_ROLES.includes(role))add('error',collection,id,`roles.${index}`,`Unsupported candidate role: ${role}`)})
        if (!record.birthplace?.wikidataId || !record.birthplace?.name?.en?.trim()) add('error',collection,id,'birthplace','Candidate intake requires its Wikidata birthplace identity and English label.')
        const point=record.birthplace?.location?.coordinates
        if(point&&(!Array.isArray(point)||point.length!==2||!point.every(Number.isFinite)||point[0] < -180||point[0] > 180||point[1] < -90||point[1] > 90))add('error',collection,id,'birthplace.location','Candidate birthplace coordinates must be valid [longitude, latitude].')
        if(record.discovery?.publicationReady!==false)add('error',collection,id,'discovery.publicationReady','Wikimedia discovery candidates cannot be publication-ready before independent review.')
        if(record.reviewWorkflow?.target!=='curated-person-record'||record.reviewWorkflow?.status!=='candidate-intake')add('error',collection,id,'reviewWorkflow','Candidate people must remain in the curated-person intake workflow.')
        PEOPLE_CANDIDATE_EVIDENCE.forEach(field=>{if(!['verified','located','provisional','unresolved','not-available'].includes(record.reviewWorkflow?.evidence?.[field]?.status))add('error',collection,id,`reviewWorkflow.evidence.${field}`,'Every candidate evidence gate requires a supported status.')})
        if(record.review?.status!=='needs-review')add('warning',collection,id,'review.status','Promote an independently verified candidate into the curated people collection instead of changing its intake status.')
      }
      if (collection === 'martyrCandidates') {
        if (!/^martyr-candidate-v5-p\d+-[a-z0-9-]+-l\d+$/.test(record.id)) add('error',collection,id,'id','Dictionary candidates require a stable volume, page, name and OCR-line ID.')
        if (record.candidateKind!=='dictionary-martyr') add('error',collection,id,'candidateKind','Dictionary candidates require the dictionary-martyr kind.')
        if (!['karnataka-origin-or-residence','karnataka-event-connection'].includes(record.relationship)) add('error',collection,id,'relationship','A supported Karnataka relationship classification is required.')
        if (!Array.isArray(record.roles)||!record.roles.includes('freedom-fighter')) add('error',collection,id,'roles','Dictionary martyr candidates require the freedom-fighter review role.')
        if (!Number.isInteger(record.sourceEntry?.printedPageFrom)||!Number.isInteger(record.sourceEntry?.sourceLine)) add('error',collection,id,'sourceEntry','Printed page and OCR source line locators are required.')
        if (!Array.isArray(record.citations)||record.citations.length!==1||record.citations[0]?.sourceId!=='src-india-culture-dictionary-martyrs-v5'||!record.citations[0]?.locator?.includes('printed p.')) add('error',collection,id,'citations','The item-level dictionary citation and printed-page locator are required.')
        if (record.relationship==='karnataka-event-connection'&&(!Array.isArray(record.historicalConnection?.years)||!record.historicalConnection.years.length||!Array.isArray(record.historicalConnection?.actions)||!record.historicalConnection.actions.length||!Array.isArray(record.historicalConnection?.placeLeads)||!record.historicalConnection.placeLeads.length)) add('error',collection,id,'historicalConnection','Event connections require provisional years, action types and Karnataka place leads.')
        if (record.dateInterpretation==='historical-connection-window-not-life-dates'&&record.date?.precision==='unknown') add('error',collection,id,'date','Historical connection windows require a provisional date or range.')
        if (record.discovery?.publicationReady!==false) add('error',collection,id,'discovery.publicationReady','OCR candidates cannot be publication-ready before page-image and identity review.')
        if (record.reviewWorkflow?.target!=='curated-person-record'||record.reviewWorkflow?.status!=='candidate-intake') add('error',collection,id,'reviewWorkflow','Dictionary candidates must remain in curated-person intake.')
        if (record.review?.status!=='needs-review') add('warning',collection,id,'review.status','Promote an independently verified candidate into curated people instead of changing intake status.')
      }
      if (collection === 'inscriptions') {
        if (!record.placeId || !record.polityId) add('error',collection,id,'relationships','Inscriptions require a mapped place and related polity.')
        const isExternal = record.geographicScope?.outsideKarnataka === true
        if (!record.districtAuditId && !isExternal) add('error',collection,id,'districtAuditId','Karnataka inscriptions require a district audit assignment.')
        if (isExternal && (!record.geographicScope?.region?.trim() || !/^[A-Z]{2}$/.test(record.geographicScope?.countryCode || '') || !record.geographicScope?.countryName?.en?.trim() || !record.geographicScope?.countryName?.kn?.trim())) add('error',collection,id,'geographicScope','Outside-Karnataka inscriptions require a bilingual region, country code and country name.')
        if (!Array.isArray(record.languages) || record.languages.length===0) add('error',collection,id,'languages','At least one inscription language is required.')
        if (!Array.isArray(record.scripts) || record.scripts.length===0) add('error',collection,id,'scripts','At least one inscription script is required.')
        if (!record.description?.en?.trim() || !record.description?.kn?.trim()) add('warning',collection,id,'description','A bilingual inscription note is recommended.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('warning',collection,id,'citations','Inscriptions should cite at least one epigraphical source.')
        if (record.editionText) {
          if (record.editionText.original != null && typeof record.editionText.original !== 'string') add('error',collection,id,'editionText.original','Original inscription text must be text.')
          if (record.editionText.transliteration != null && typeof record.editionText.transliteration !== 'string') add('error',collection,id,'editionText.transliteration','Transliteration must be text.')
          if (record.editionText.translation && typeof record.editionText.translation !== 'object') add('error',collection,id,'editionText.translation','Translations must use bilingual fields.')
        }
        if (record.promotionStatus === 'promoted') {
          const mappedPlace=(data.places||[]).find(place=>place.id===record.placeId)
          if (!record.promotedFromCandidateId) add('error',collection,id,'promotedFromCandidateId','Promoted inscriptions must retain the originating candidate ID.')
          if (!record.itemEdition?.primary?.series || !record.itemEdition?.primary?.volume || !record.itemEdition?.primary?.number || !record.itemEdition?.primary?.locator) add('error',collection,id,'itemEdition.primary','Promoted inscriptions require an item-level series, volume, number and locator.')
          if (mappedPlace?.location?.precision !== 'site' || !Array.isArray(mappedPlace?.citations) || mappedPlace.citations.length===0) add('error',collection,id,'placeId','Promoted inscriptions require a cited monument/site coordinate, not an approximate settlement point.')
          if (!['centrally-protected','state-protected','locally-protected','unprotected','protection-unresolved'].includes(record.protection?.status) || !record.protection?.designation?.en?.trim() || !record.protection?.designation?.kn?.trim() || !record.protection?.authority?.en?.trim() || !record.protection?.authority?.kn?.trim() || !record.protection?.sourceId) add('error',collection,id,'protection','Promoted inscriptions require bilingual protection status, authority and source.')
          if (!['incomplete-sheltered','good-sheltered','very-good-sheltered','intact-in-situ','worn-in-situ','condition-unresolved'].includes(record.presentCondition?.status) || !record.presentCondition?.description?.en?.trim() || !record.presentCondition?.description?.kn?.trim() || !record.presentCondition?.sourceId) add('error',collection,id,'presentCondition','Promoted inscriptions require a sourced, bilingual present-condition statement.')
          if (!['in-situ','relocated-within-site','relocated-to-repository','findspot-only'].includes(record.findspotRelation)) add('error',collection,id,'findspotRelation','Promoted inscriptions require an explicit findspot/current-location relationship.')
          if ((record.citations||[]).length<2) add('error',collection,id,'citations','Promoted inscriptions require at least two citations covering the item and its mapped/protection evidence.')
        }
      }
      if (collection === 'inscriptionAudits') {
        if (!['unassessed','candidate-identified','seeded','reviewed'].includes(record.auditStatus)) add('error',collection,id,'auditStatus','District inscription audit status is invalid.')
        if (!record.districtAuditId) add('error',collection,id,'districtAuditId','A related district heritage audit is required.')
        if (!Array.isArray(record.inscriptionIds)) add('error',collection,id,'inscriptionIds','Inscription IDs must be an array.')
        if (!Array.isArray(record.priorityCandidates)) add('error',collection,id,'priorityCandidates','Priority inscription candidates must be an array.')
        ;(record.priorityCandidates||[]).forEach((candidate,index)=>{
          if(!candidate.id||!candidate.name?.en?.trim()||!candidate.name?.kn?.trim())add('error',collection,id,`priorityCandidates.${index}`,'Each candidate requires a stable ID and bilingual name.')
          if(!candidate.place?.en?.trim()||!candidate.place?.kn?.trim())add('error',collection,id,`priorityCandidates.${index}.place`,'Each candidate requires a bilingual place label.')
          if(!['corpus-located','item-located','ready-for-promotion'].includes(candidate.readiness))add('error',collection,id,`priorityCandidates.${index}.readiness`,'Candidate readiness is invalid.')
          if(!candidate.date||!['BCE','CE'].includes(candidate.date.era)||!['year','circa','range','century','unknown'].includes(candidate.date.precision))add('error',collection,id,`priorityCandidates.${index}.date`,'Candidate date and era must be explicit, including unknown precision.')
          if(candidate.date?.from!=null&&candidate.date?.to!=null&&(candidate.date.era==='BCE'?Number(candidate.date.from)<Number(candidate.date.to):Number(candidate.date.from)>Number(candidate.date.to)))add('error',collection,id,`priorityCandidates.${index}.date`,'Candidate date range is not chronological for its era.')
          if(!Array.isArray(candidate.languages)||!Array.isArray(candidate.scripts))add('error',collection,id,`priorityCandidates.${index}.languageScript`,'Candidate languages and scripts must be arrays; unresolved values use empty arrays.')
          if(!Array.isArray(candidate.citations)||candidate.citations.length===0)add('error',collection,id,`priorityCandidates.${index}.citations`,'A source-located candidate requires at least one citation.')
          if(!candidate.researchNote?.en?.trim()||!candidate.researchNote?.kn?.trim())add('warning',collection,id,`priorityCandidates.${index}.researchNote`,'A bilingual unresolved-evidence note is recommended.')
          const resolution=candidate.resolution
          const evidenceStatuses=['verified','located','provisional','unresolved','not-applicable']
          const evidenceFields=['corpus','itemEdition','coordinates','transcription','translation','presentCondition','authority','photographs']
          if(!resolution||typeof resolution!=='object')add('error',collection,id,`priorityCandidates.${index}.resolution`,'Candidates require an explicit evidence-resolution checklist.')
          evidenceFields.forEach(field=>{
            const evidence=resolution?.[field]
            if(!evidenceStatuses.includes(evidence?.status))add('error',collection,id,`priorityCandidates.${index}.resolution.${field}.status`,'Evidence status is missing or invalid.')
            if(evidence&& !['unresolved','not-applicable'].includes(evidence.status)&&!evidence.sourceId)add('error',collection,id,`priorityCandidates.${index}.resolution.${field}.sourceId`,'Resolved or provisional evidence requires a source.')
          })
          if(['located','verified'].includes(resolution?.itemEdition?.status)&&(!resolution.itemEdition.series||!resolution.itemEdition.volume||!resolution.itemEdition.number||!resolution.itemEdition.locator))add('error',collection,id,`priorityCandidates.${index}.resolution.itemEdition`,'Located editions require series, volume, item number and locator.')
          if(['provisional','verified'].includes(resolution?.coordinates?.status)){
            const latitude=resolution.coordinates.latitude,longitude=resolution.coordinates.longitude
            if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||longitude < -180||longitude > 180||latitude < -90||latitude > 90)add('error',collection,id,`priorityCandidates.${index}.resolution.coordinates`,'Provisional and verified coordinates must be valid latitude/longitude values.')
            if(!['site','monument','settlement','approximate'].includes(resolution.coordinates.precision))add('error',collection,id,`priorityCandidates.${index}.resolution.coordinates.precision`,'Coordinate precision is missing or invalid.')
            const authorityMatch=resolution.coordinates.authorityMatch
            if(authorityMatch&&(!['identity-matched','boundary-matched','authority-issued'].includes(authorityMatch.status)||!authorityMatch.authorityId||!authorityMatch.sourceId||!authorityMatch.method))add('error',collection,id,`priorityCandidates.${index}.resolution.coordinates.authorityMatch`,'Coordinate authority matches require status, authority ID, source and method.')
          }
          if(resolution?.transcription?.status==='verified'&&(!Array.isArray(resolution.transcription.sections)||resolution.transcription.sections.length===0||resolution.transcription.sections.some(section=>!section.label||!Array.isArray(section.lines)||section.lines.length===0)))add('error',collection,id,`priorityCandidates.${index}.resolution.transcription`,'Verified transcriptions require labelled line arrays.')
          if(['located','verified'].includes(resolution?.translation?.status)&&resolution.translation.sections&&(!resolution.translation.languageReviews?.en||!resolution.translation.languageReviews?.kn||resolution.translation.sections.some(section=>!section.label||!Array.isArray(section.en)||!Array.isArray(section.kn)||section.en.length===0||section.en.length!==section.kn.length)))add('error',collection,id,`priorityCandidates.${index}.resolution.translation`,'Captured bilingual translations require labelled, non-empty, one-to-one English/Kannada sections and language review states.')
          if(resolution?.presentCondition?.status==='verified'&&(!resolution.presentCondition.description?.en?.trim()||!resolution.presentCondition.description?.kn?.trim()||!resolution.presentCondition.observedAt))add('error',collection,id,`priorityCandidates.${index}.resolution.presentCondition`,'Verified condition evidence requires a dated bilingual statement.')
          if(resolution?.authority?.status==='verified'&&(!resolution.authority.authority?.en?.trim()||!resolution.authority.authority?.kn?.trim()||!resolution.authority.designation?.en?.trim()||!resolution.authority.designation?.kn?.trim()))add('error',collection,id,`priorityCandidates.${index}.resolution.authority`,'Verified authority evidence requires bilingual authority and designation fields.')
          if(resolution?.photographs?.status==='verified'&&(!Array.isArray(resolution.photographs.items)||resolution.photographs.items.length===0||resolution.photographs.items.some(photo=>!photo.sourceId||!photo.capturedAt||!photo.creator||!photo.license||!photo.pageUrl||!photo.depicts?.en?.trim()||!photo.depicts?.kn?.trim())))add('error',collection,id,`priorityCandidates.${index}.resolution.photographs`,'Verified photographs require source, date, creator, licence, page URL and bilingual subject description.')
          if(candidate.readiness==='item-located'&&resolution?.itemEdition?.status!=='verified')add('error',collection,id,`priorityCandidates.${index}.readiness`,'Item-located candidates require a verified item edition.')
          if(candidate.readiness==='ready-for-promotion'&&['itemEdition','coordinates','transcription','translation','presentCondition','authority','photographs'].some(field=>resolution?.[field]?.status!=='verified'))add('error',collection,id,`priorityCandidates.${index}.readiness`,'Promotion-ready candidates require every item-level evidence check to be verified.')
          if(candidate.promotionReview){
            const workflow=candidate.promotionReview
            if(workflow.target!=='public-inscription'||!['evidence-capture','translation-review','ready-for-promotion','promoted'].includes(workflow.status))add('error',collection,id,`priorityCandidates.${index}.promotionReview.status`,'Promotion workflows require a supported target and state.')
            if(!Array.isArray(workflow.requiredEvidence)||!['itemEdition','coordinates','transcription','translation','presentCondition','authority','photographs'].every(field=>workflow.requiredEvidence.includes(field)))add('error',collection,id,`priorityCandidates.${index}.promotionReview.requiredEvidence`,'Promotion workflows must retain every item-level evidence gate.')
            if(!Array.isArray(workflow.blockingEvidence)||workflow.blockingEvidence.some(field=>!workflow.requiredEvidence.includes(field))||workflow.blockingEvidence.some(field=>resolution?.[field]?.status==='verified'))add('error',collection,id,`priorityCandidates.${index}.promotionReview.blockingEvidence`,'Blocking evidence must list every required field that is not yet verified.')
            if(!Array.isArray(workflow.evidenceRequests)||workflow.evidenceRequests.length!==workflow.blockingEvidence.length||workflow.evidenceRequests.some(request=>!workflow.blockingEvidence.includes(request.field)||!request.submissionType||!Array.isArray(request.requiredFields)||!request.requiredFields.length||!request.instruction?.en||!request.instruction?.kn))add('error',collection,id,`priorityCandidates.${index}.promotionReview.evidenceRequests`,'Every blocker requires a bilingual structured evidence request.')
            if(workflow.translation?.languageCode!=='kn'||workflow.translation?.independentReviewerRequired!==true||!Array.isArray(workflow.translation?.requiredChecks)||!['sourceMatch','semanticFidelity','namesAndDates','historicalTerminology','lineCompleteness','reviewerAttestation'].every(check=>workflow.translation.requiredChecks.includes(check)))add('error',collection,id,`priorityCandidates.${index}.promotionReview.translation`,'Kannada promotion review requires independent approval and every scholarly check.')
            const packet=workflow.translation?.reviewPacket
            if(packet?.status==='ready-for-independent-review'&&(!packet.sourceId||!packet.locator||packet.sectionCount<1||packet.sourceLineCount<1||packet.sourceLineCount!==packet.kannadaLineCount||packet.lineAlignment!=='aligned'))add('error',collection,id,`priorityCandidates.${index}.promotionReview.translation.reviewPacket`,'Ready translation-review packets require a source locator and aligned, non-empty English/Kannada lines.')
            if(workflow.status==='promoted'&&candidate.readiness!=='ready-for-promotion')add('error',collection,id,`priorityCandidates.${index}.promotionReview.status`,'A candidate cannot be marked promoted before every evidence gate passes.')
          }
        })
        if (!record.methodologyNote?.en?.trim() || !record.methodologyNote?.kn?.trim()) add('warning',collection,id,'methodologyNote','A bilingual district epigraphy note is recommended.')
      }
      if (collection === 'territorialExtents') {
        if (!['core-administered','tributary-influence','contested-zone','temporary-occupation','campaign-reach'].includes(record.classification)) add('error',collection,id,'classification','Territorial classification is invalid.')
        if (!['direct','indirect','disputed','temporary','none'].includes(record.controlLevel)) add('error',collection,id,'controlLevel','Control level is invalid.')
        if (!['sustained','multi-generational','intermittent','brief','episodic'].includes(record.duration)) add('error',collection,id,'duration','Duration is invalid.')
        if (!['low','medium','high'].includes(record.confidence)) add('error',collection,id,'confidence','Confidence is invalid.')
        if (!Array.isArray(record.polityIds) || record.polityIds.length === 0) add('error',collection,id,'polityIds','At least one related polity is required.')
        if (record.snapshotKind != null && !['prototype','reign','regency','political-phase'].includes(record.snapshotKind)) add('error',collection,id,'snapshotKind','Snapshot kind is invalid.')
        if (record.snapshotYear != null && (!Number.isInteger(record.snapshotYear) || record.snapshotYear < record.date?.from || record.snapshotYear > record.date?.to)) add('error',collection,id,'snapshotYear','Snapshot year must be a whole year within the record date range.')
        if (['reign','regency','political-phase'].includes(record.snapshotKind) && !record.reignId) add('error',collection,id,'reignId','A dated reign or political-period snapshot requires a reign ID.')
        if (!record.geometry || !['Polygon','LineString'].includes(record.geometry.type)) add('error',collection,id,'geometry.type','Geometry must be a Polygon or LineString.')
        else {
          const minimum=record.geometry.type==='Polygon'?3:2
          if (!Array.isArray(record.geometry.coordinates) || record.geometry.coordinates.length<minimum) add('error',collection,id,'geometry.coordinates',`${record.geometry.type} requires at least ${minimum} coordinate pairs.`)
          ;(record.geometry.coordinates || []).forEach((point,index)=>{const [lng,lat]=point||[];if(!Number.isFinite(lng)||!Number.isFinite(lat)||lng < -180||lng > 180||lat < -90||lat > 90)add('error',collection,id,`geometry.coordinates.${index}`,'Coordinates must be valid [longitude, latitude] pairs.')})
          if (!['exact','approximate','schematic','unknown'].includes(record.geometry.precision)) add('error',collection,id,'geometry.precision','Geometry precision is invalid.')
        }
        if (!record.description?.en?.trim()) add('warning',collection,id,'description.en','An English interpretation note is recommended.')
        if (!record.description?.kn?.trim()) add('warning',collection,id,'description.kn','A Kannada interpretation note is recommended.')
        if (!Array.isArray(record.citations) || record.citations.length === 0) add('warning',collection,id,'citations','Territorial evidence should cite at least one source.')
      }
      if (collection === 'deepChronologies') {
        if (record.date?.era!=='BCE') add('error',collection,id,'date.era','Deep-history chronology records in this lane must explicitly use BCE.')
        if (!['historiographic-periodization','textual-tradition','archaeological-phase','traditional-chronology'].includes(record.chronologyKind)) add('error',collection,id,'chronologyKind','Chronology kind is invalid.')
        if (!['primary-text','secondary-synthesis','archaeological-synthesis','traditional-calculation'].includes(record.evidenceBasis)) add('error',collection,id,'evidenceBasis','Evidence basis is invalid.')
        if (!['interpretive','contested','provisional'].includes(record.confidence)) add('error',collection,id,'confidence','Deep-history confidence must be interpretive, contested, or provisional.')
        if (!record.geographicScope?.en?.trim() || !record.geographicScope?.kn?.trim()) add('error',collection,id,'geographicScope','Bilingual geographic scope is required.')
        if (!Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Deep-history chronology requires named sources.')
      }
      if (collection === 'districtHistoryResearch') {
        if (!record.district?.en?.trim() || !record.district?.kn?.trim()) add('error',collection,id,'district','Bilingual district name is required.')
        if (!DISTRICT_HISTORY_CATEGORIES.includes(record.category)) add('error',collection,id,'category','District deep-history category is invalid.')
        if (!['district-scope','candidate'].includes(record.recordKind)) add('error',collection,id,'recordKind','Record kind must be district-scope or candidate.')
        if (!['research-intake','contributor-discovery-lead','district-research-scope','archaeological-report','gazetteer','field-record'].includes(record.evidenceBasis)) add('error',collection,id,'evidenceBasis','Evidence basis is invalid.')
        if (!record.description?.en?.trim() || !record.description?.kn?.trim()) add('warning',collection,id,'description','Bilingual research description is recommended.')
        if (!record.researchNote?.en?.trim() || !record.researchNote?.kn?.trim()) add('warning',collection,id,'researchNote','A bilingual research note is recommended.')
        if (record.recordKind==='candidate' && (!Array.isArray(record.citations) || record.citations.length===0)) add('error',collection,id,'citations','Candidate records require at least one provenance or research citation.')
        const point=record.location
        if (point && point.type!=='Point') add('error',collection,id,'location.type','District history locations must be GeoJSON Points.')
        if (point) {
          const [lng,lat]=point.coordinates||[]
          if (!Number.isFinite(lng)||!Number.isFinite(lat)||lng < -180||lng > 180||lat < -90||lat > 90) add('error',collection,id,'location.coordinates','Location must be a valid [longitude, latitude] pair.')
          if (!['exact','approximate','district-centroid','unknown'].includes(point.precision)) add('error',collection,id,'location.precision','Location precision is invalid.')
        }
        if (record.review?.status!=='needs-review' && record.recordKind==='candidate' && record.evidenceBasis==='contributor-discovery-lead') add('warning',collection,id,'review.status','Discovery leads should remain needs-review until independently verified.')
      }
      if (collection === 'heritageInventoryLeads') {
        const protectionLevels=['unesco','national','state','local','institutional','research-lead','unknown']
        if (!record.name?.en?.trim() || !record.name?.kn?.trim()) add('error',collection,id,'name','Bilingual heritage name is required.')
        if (!record.district?.en?.trim() || !record.district?.kn?.trim()) add('error',collection,id,'district','Bilingual district name is required.')
        if (record.recordKind!=='inventory-lead') add('error',collection,id,'recordKind','Heritage inventory records must remain inventory leads until promoted through authority review.')
        if (!record.category?.trim()) add('error',collection,id,'category','Heritage category is required.')
        if (!protectionLevels.includes(record.protectionLevel)) add('error',collection,id,'protectionLevel','Protection level is missing or invalid.')
        if (['national','state'].includes(record.protectionLevel) && !record.registryId?.trim()) add('error',collection,id,'registryId','National and state register records require an authority registry ID.')
        if (!record.sourceId || !record.sourceUrl || !Array.isArray(record.citations) || record.citations.length===0) add('error',collection,id,'citations','Heritage inventory leads require a source ID, source URL and citation locator.')
        if (record.coordinates) {
          const {latitude,longitude}=record.coordinates
          if (!Number.isFinite(latitude)||!Number.isFinite(longitude)||longitude < -180||longitude > 180||latitude < -90||latitude > 90) add('error',collection,id,'coordinates','Coordinates must be valid longitude/latitude values.')
        }
        ;['placeIds','polityIds','peopleIds','eventIds'].forEach(field=>{if(record[field]!=null&&!Array.isArray(record[field]))add('error',collection,id,field,`${field} must be an array.`)})
        if (record.designationStatus==='unverified' && record.protectionLevel!=='research-lead') add('warning',collection,id,'protectionLevel','An unverified designation should remain a research lead.')
      }
      if (collection === 'heritageAudits') {
        if (!record.district?.en?.trim() || !record.district?.kn?.trim()) add('error',collection,id,'district','Bilingual district name is required.')
        if (!['seeded','in-progress','reviewed'].includes(record.auditStatus)) add('error',collection,id,'auditStatus','Audit status is invalid.')
        HERITAGE_CATEGORIES.forEach(category=>{if(!['unassessed','seeded','reviewed','gap-confirmed'].includes(record.categoryCoverage?.[category]))add('error',collection,id,`categoryCoverage.${category}`,'Every audit category needs an explicit coverage status.')})
        if (!Array.isArray(record.prioritySites)) add('error',collection,id,'prioritySites','Priority sites must be an array.')
        ;(record.prioritySites||[]).forEach((site,index)=>{
          if(!site.id||!site.name?.en?.trim()||!site.name?.kn?.trim())add('error',collection,id,`prioritySites.${index}`,'Each candidate needs a stable local ID and bilingual name.')
          if(!HERITAGE_CATEGORIES.includes(site.category))add('error',collection,id,`prioritySites.${index}.category`,'Candidate heritage category is invalid.')
          if(!['research-pending','identified','partially-verified','verified'].includes(site.verification?.verificationStatus))add('error',collection,id,`prioritySites.${index}.verificationStatus`,'Verification state is missing or invalid.')
          const point=site.verification?.coordinates
          if(point&&(!Number.isFinite(point.longitude)||!Number.isFinite(point.latitude)||point.longitude < -180||point.longitude > 180||point.latitude < -90||point.latitude > 90))add('error',collection,id,`prioritySites.${index}.coordinates`,'Verified coordinates must be valid longitude/latitude.')
          if(!Array.isArray(site.verification?.constructionPhases)||!Array.isArray(site.verification?.protectionStatus)||!Array.isArray(site.verification?.managingAuthorities)||!Array.isArray(site.verification?.photographs)||!Array.isArray(site.verification?.siteCitations))add('error',collection,id,`prioritySites.${index}.verification`,'Verification evidence fields must be arrays.')
          ;(site.verification?.photographs||[]).forEach((photo,photoIndex)=>{if(!photo.url||!photo.sourceUrl||!photo.licenseStatus)add('error',collection,id,`prioritySites.${index}.photographs.${photoIndex}`,'Photographs require image URL, source page and licence status.')})
          ;(site.verification?.siteCitations||[]).forEach((citation,citationIndex)=>{if(!citation.title||!citation.url)add('error',collection,id,`prioritySites.${index}.siteCitations.${citationIndex}`,'Site citations require a title and URL.')})
          if(['partially-verified','verified'].includes(site.verification?.verificationStatus)&&(!point||(site.verification.siteCitations||[]).length===0))add('error',collection,id,`prioritySites.${index}.verification`,'Verified records require coordinates and a site-specific citation.')
          const checks=site.verification?.verificationChecks
          if(!checks?.photoLicence?.status||!checks?.protectionRegister?.status||!checks?.managingAuthority?.status)add('error',collection,id,`prioritySites.${index}.verificationChecks`,'Photo licence, protection-register and managing-authority checks must be explicit.')
          if(site.verification?.verificationStatus==='verified'&&(checks.photoLicence.status!=='verified'||checks.protectionRegister.status!=='matched'||checks.managingAuthority.status!=='identified'))add('error',collection,id,`prioritySites.${index}.verificationStatus`,'Fully verified records require completed photo, protection-register and managing-authority checks.')
        })
        if (!record.methodologyNote?.en?.trim() || !record.methodologyNote?.kn?.trim()) add('warning',collection,id,'methodologyNote','A bilingual audit-method note is recommended.')
      }
    })
  })

  const sourceIds = new Set((data.sources || []).map(source => source.id))
  COLLECTIONS.forEach(collection => (data[collection] || []).forEach(record => {
    const id = record.id || ''
    checkTranslationGlossary(record).forEach(issue => add('warning',collection,id,issue.path,issue.message))
    checkMissingKannadaTranslation(record).forEach(issue => add('warning',collection,id,issue.path,issue.message))
    ;(record.citations || []).forEach((item, index) => {
      if (!sourceIds.has(item.sourceId)) add('error',collection,id,`citations.${index}.sourceId`,`Unknown source: ${item.sourceId}`)
    })
    ;['protection','presentCondition'].forEach(field=>{const sourceId=record[field]?.sourceId;if(sourceId&&!sourceIds.has(sourceId))add('error',collection,id,`${field}.sourceId`,`Unknown source: ${sourceId}`)})
    const refs = ['capitalId','placeId','polityId','reignId','fromId','toId','originPlaceId','destinationPlaceId','districtAuditId','districtId']
    refs.forEach(field => { if (record[field] && !all.has(record[field])) add('error',collection,id,field,`Unknown related record: ${record[field]}`) })
    ;(record.participants || []).forEach((participant,index) => { if (!participant.polityId || !all.has(participant.polityId)) add('error',collection,id,`participants.${index}.polityId`,`Unknown event participant: ${participant.polityId || 'missing'}`) })
    ;(record.parties || []).forEach((party,index) => { if (!party.polityId || !all.has(party.polityId)) add('error',collection,id,`parties.${index}.polityId`,`Unknown bilateral-relation party: ${party.polityId || 'missing'}`) })
    ;(record.eventIds || []).forEach((eventId,index) => { if (!all.has(eventId)) add('error',collection,id,`eventIds.${index}`,`Unknown related event: ${eventId}`) })
    ;(record.treatyDocuments || []).forEach((document,index) => { if (document.sourceId && !sourceIds.has(document.sourceId)) add('error',collection,id,`treatyDocuments.${index}.sourceId`,`Unknown treaty source: ${document.sourceId}`) })
    ;(record.peopleIds || []).forEach((personId,index) => { if (!all.has(personId)) add('error',collection,id,`peopleIds.${index}`,`Unknown person: ${personId}`) })
    ;(record.rulerIds || []).forEach((personId,index) => { if (!all.has(personId)) add('error',collection,id,`rulerIds.${index}`,`Unknown ruler: ${personId}`) })
    ;(record.capitalIds || []).forEach((placeId,index) => { if (!all.has(placeId)) add('error',collection,id,`capitalIds.${index}`,`Unknown capital: ${placeId}`) })
    ;(record.placeIds || []).forEach((placeId,index) => { if (!all.has(placeId)) add('error',collection,id,`placeIds.${index}`,`Unknown place: ${placeId}`) })
    ;(record.relatedWorkIds || []).forEach((workId,index) => { if (!all.has(workId)) add('error',collection,id,`relatedWorkIds.${index}`,`Unknown work: ${workId}`) })
    ;(record.inscriptionIds || []).forEach((inscriptionId,index) => { if (!all.has(inscriptionId)) add('error',collection,id,`inscriptionIds.${index}`,`Unknown inscription: ${inscriptionId}`) })
    ;(record.priorityCandidates || []).forEach((candidate,candidateIndex) => {
      ;(candidate.citations||[]).forEach((item,index) => { if (!sourceIds.has(item.sourceId)) add('error',collection,id,`priorityCandidates.${candidateIndex}.citations.${index}.sourceId`,`Unknown source: ${item.sourceId}`) })
      Object.entries(candidate.resolution||{}).forEach(([field,evidence])=>{
        if(evidence?.sourceId&&!sourceIds.has(evidence.sourceId))add('error',collection,id,`priorityCandidates.${candidateIndex}.resolution.${field}.sourceId`,`Unknown source: ${evidence.sourceId}`)
        if(evidence?.authorityMatch?.sourceId&&!sourceIds.has(evidence.authorityMatch.sourceId))add('error',collection,id,`priorityCandidates.${candidateIndex}.resolution.${field}.authorityMatch.sourceId`,`Unknown source: ${evidence.authorityMatch.sourceId}`)
        ;(evidence?.alternateSources||[]).forEach((item,itemIndex)=>{if(!item.sourceId||!sourceIds.has(item.sourceId))add('error',collection,id,`priorityCandidates.${candidateIndex}.resolution.${field}.alternateSources.${itemIndex}.sourceId`,`Unknown alternate source: ${item.sourceId||'missing'}`)})
        ;(evidence?.items||[]).forEach((item,itemIndex)=>{if(item.sourceId&&!sourceIds.has(item.sourceId))add('error',collection,id,`priorityCandidates.${candidateIndex}.resolution.${field}.items.${itemIndex}.sourceId`,`Unknown source: ${item.sourceId}`)})
      })
    })
    ;(record.polityIds || []).forEach((polityId,index) => { if (!all.has(polityId)) add('error',collection,id,`polityIds.${index}`,`Unknown polity: ${polityId}`) })
    ;(record.relatedEventIds || []).forEach((eventId,index) => { if (!all.has(eventId)) add('error',collection,id,`relatedEventIds.${index}`,`Unknown event: ${eventId}`) })
    ;(record.relationIds || []).forEach((relationId,index) => { if (!all.has(relationId)) add('error',collection,id,`relationIds.${index}`,`Unknown related political relation: ${relationId}`) })
  }))
  return issues
}

export const hasValidationErrors = issues => issues.some(issue => issue.severity === 'error')
