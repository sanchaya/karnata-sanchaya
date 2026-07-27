const ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const COLLECTIONS = ['polities','externalPolities','events','culturalHeritage','reigns','territorialExtents','deepChronologies','heritageAudits','inscriptionAudits','people','places','inscriptions','works','sources','relationships','collaborations']
const HERITAGE_CATEGORIES = ['temple','coastal-temple','basadi','dargah','church','monastery','fort','palace-civic-architecture','colonial-architecture','archaeological-landscape','modern-heritage']

export function validateAtlas(data) {
  const issues = []
  const add = (severity, collection, id, path, message) => issues.push({ severity, collection, id, path, message })
  if (!data || typeof data !== 'object') return [{ severity:'error', collection:'dataset', id:'', path:'', message:'Dataset must be an object.' }]
  if (!data.meta?.schemaVersion) add('error','meta','meta','schemaVersion','A schema version is required.')

  const all = new Map()
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
        if (!record?.name?.kn?.trim()) add('warning',collection,id,'name.kn','Kannada name is missing.')
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
        if (record.doi!=null && typeof record.doi!=='string') add('error',collection,id,'doi','DOI must be text when supplied.')
        if (record.isbn!=null && typeof record.isbn!=='string') add('error',collection,id,'isbn','ISBN must be text when supplied.')
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
        if (!['architecture','visual-art','literature','performance','music','celebration','religious-tradition','craft'].includes(record.category)) add('error',collection,id,'category','Cultural category is invalid.')
        if (!['historic','continuing-practice','material-survival','revived','unknown'].includes(record.continuity)) add('error',collection,id,'continuity','Continuity status is invalid.')
        if (!Array.isArray(record.polityIds) || record.polityIds.length === 0) add('error',collection,id,'polityIds','At least one related polity is required.')
        if (!Array.isArray(record.placeIds) || record.placeIds.length === 0) add('error',collection,id,'placeIds','At least one mapped place is required.')
        if (!Array.isArray(record.peopleIds) || !Array.isArray(record.relatedWorkIds) || !Array.isArray(record.traditionTags)) add('error',collection,id,'relationships','People, works, and tradition tags must be arrays.')
        if (!record.description?.en?.trim()) add('warning',collection,id,'description.en','An English interpretation note is recommended.')
        if (!record.description?.kn?.trim()) add('warning',collection,id,'description.kn','A Kannada interpretation note is recommended.')
        if (!Array.isArray(record.citations) || record.citations.length === 0) add('warning',collection,id,'citations','Cultural records should cite at least one source.')
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
        }
      }
      if (collection === 'people') {
        if (!Array.isArray(record.roles) || record.roles.length===0) add('error',collection,id,'roles','People require at least one controlled role.')
        ;(record.roles||[]).forEach((role,index)=>{if(!['ruler','patron','poet','author','scholar','administrator','military-leader','diplomat','religious-figure'].includes(role))add('error',collection,id,`roles.${index}`,`Unsupported person role: ${role}`)})
        if (!record.polityId) add('warning',collection,id,'polityId','A related polity or historical context is recommended.')
        if (record.date?.precision==='unknown' && (record.date.from!=null||record.date.to!=null)) add('error',collection,id,'date','Unknown person dates must not carry numeric bounds.')
        if ((!Array.isArray(record.citations)||record.citations.length===0) && !['ruler','patron'].some(role=>record.roles?.includes(role))) add('warning',collection,id,'citations','Non-ruler person profiles should cite at least one biographical or work-level source.')
      }
      if (collection === 'inscriptions') {
        if (!record.placeId || !record.polityId) add('error',collection,id,'relationships','Inscriptions require a mapped place and related polity.')
        if (!record.districtAuditId) add('error',collection,id,'districtAuditId','Inscriptions require a district audit assignment.')
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
    ;(record.citations || []).forEach((item, index) => {
      if (!sourceIds.has(item.sourceId)) add('error',collection,id,`citations.${index}.sourceId`,`Unknown source: ${item.sourceId}`)
    })
    ;['protection','presentCondition'].forEach(field=>{const sourceId=record[field]?.sourceId;if(sourceId&&!sourceIds.has(sourceId))add('error',collection,id,`${field}.sourceId`,`Unknown source: ${sourceId}`)})
    const refs = ['capitalId','placeId','polityId','reignId','fromId','toId','originPlaceId','destinationPlaceId','districtAuditId']
    refs.forEach(field => { if (record[field] && !all.has(record[field])) add('error',collection,id,field,`Unknown related record: ${record[field]}`) })
    ;(record.participants || []).forEach((participant,index) => { if (!participant.polityId || !all.has(participant.polityId)) add('error',collection,id,`participants.${index}.polityId`,`Unknown event participant: ${participant.polityId || 'missing'}`) })
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
  }))
  return issues
}

export const hasValidationErrors = issues => issues.some(issue => issue.severity === 'error')
