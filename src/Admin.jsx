import { useEffect, useMemo, useRef, useState } from 'react'
import { atlasData, collectionLabels } from './data/atlas'
import { hasValidationErrors, validateAtlas } from './data/validate'
import { translationGlossary } from './data/translation-glossary'
import { alternateRecordTitle, localizedRecordTitle, missingKannadaTranslation, recordMatchesAdminSearch } from './admin-search'
import { formatValidationIssues, prepareDatasetSave } from './admin-persistence'
import GuidedTour from './GuidedTour'

const collections = Object.keys(collectionLabels)
const collectionPrefix = { polities:'polity', externalPolities:'external-polity', externalGovernancePhases:'external-governance', events:'event', culturalHeritage:'culture', periodicals:'periodical', epigraphiaArchiveTexts:'archive-epigraphia', artifacts:'artifact', templeInventoryLeads:'temple-inventory', heritageInventoryLeads:'heritage-inventory', reigns:'reign', territorialExtents:'extent', deepChronologies:'chronology', heritageAudits:'audit', districtHistoryResearch:'district-history', inscriptionAudits:'inscription-audit', people:'person', peopleCandidates:'person-candidate-q', martyrCandidates:'martyr-candidate-v5-p', places:'place', inscriptions:'inscription', works:'work', sources:'src', relationships:'rel', politicalRelations:'political-relation', collaborations:'collaboration' }
const clone = value => JSON.parse(JSON.stringify(value))
const today = () => new Date().toISOString().slice(0,10)
const collectSourceUses = (value, sourceId, path='record', output=[]) => {
  if (Array.isArray(value)) value.forEach((item,index)=>collectSourceUses(item,sourceId,`${path}[${index}]`,output))
  else if (value && typeof value === 'object') {
    if (value.sourceId===sourceId) output.push({path,locator:value.locator||value.page||value.note||''})
    Object.entries(value).forEach(([key,item])=>{if(key!=='sourceId')collectSourceUses(item,sourceId,`${path}.${key}`,output)})
  }
  return output
}

const blankRecord = collection => collection === 'relationships'
  ? { id:'rel-', fromId:'', type:'associated-with', toId:'', date:{from:null,to:null,era:'CE',precision:'unknown'}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'politicalRelations'
    ? { id:'political-relation-', name:{en:'',kn:''}, relationKind:'war', parties:[], date:{from:null,to:null,era:'CE',precision:'range'}, geography:{region:'',corridor:'',control:'contested',route:{type:'LineString',coordinates:[],precision:'schematic'}}, eventIds:[], peopleIds:[], treatyDocuments:[], reviewChecklist:[], outcome:{en:'',kn:''}, evidenceLevel:'inferred', citations:[], review:{status:'needs-review',reviewer:null,updatedAt:today()} }
  : collection === 'externalGovernancePhases'
    ? { id:'external-governance-', name:{en:'',kn:''}, type:'external-governance', governanceKind:'external-administering-power', governingPolityId:'', governanceType:'direct-administration', date:{from:null,to:null,era:'CE',precision:'range'}, capitalName:{en:'',kn:''}, color:'#596780', geography:{scope:{en:'',kn:''},geometry:{type:'Polygon',coordinates:[],precision:'schematic'},confidence:'low'}, description:{en:'',kn:''}, interpretation:{en:'',kn:''}, relatedEventIds:[], relatedRelationIds:[], relatedExtentIds:[], citations:[], review:{status:'needs-review',reviewer:null,updatedAt:today()} }
  : collection === 'territorialExtents'
    ? { id:'extent-', name:{en:'',kn:''}, classification:'core-administered', controlLevel:'direct', duration:'sustained', confidence:'low', snapshotKind:'prototype', snapshotYear:null, reignId:null, date:{from:null,to:null,era:'CE',precision:'unknown'}, polityIds:[], relatedEventIds:[], geometry:{type:'Polygon',coordinates:[],precision:'schematic'}, description:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'reigns'
    ? { id:'reign-', name:{en:'',kn:''}, periodType:'reign', polityId:'', rulerIds:[], capitalIds:[], date:{from:null,to:null,era:'CE',precision:'range'}, description:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'culturalHeritage'
    ? { id:'culture-', name:{en:'',kn:''}, category:'architecture', date:{from:null,to:null,era:'CE',precision:'unknown'}, polityIds:[], placeIds:[], peopleIds:[], relatedWorkIds:[], traditionTags:[], continuity:'unknown', description:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'heritageInventoryLeads'
    ? { id:'heritage-inventory-', name:{en:'',kn:''}, translationStatus:'pending', recordKind:'inventory-lead', category:'monument', district:{en:'',kn:''}, locationLabel:'', date:null, coordinates:null, registryId:'', protectionLevel:'research-lead', description:{en:'',kn:''}, citations:[], review:{status:'needs-review',reviewer:null,updatedAt:today()} }
  : collection === 'deepChronologies'
    ? { id:'chronology-', name:{en:'',kn:''}, date:{from:null,to:null,era:'BCE',precision:'range'}, chronologyKind:'historiographic-periodization', geographicScope:{en:'',kn:''}, evidenceBasis:'secondary-synthesis', confidence:'provisional', description:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'heritageAudits'
    ? { id:'audit-', name:{en:'',kn:''}, district:{en:'',kn:''}, region:'', auditStatus:'seeded', categoryCoverage:{temple:'unassessed','coastal-temple':'unassessed',basadi:'unassessed',dargah:'unassessed',church:'unassessed',monastery:'unassessed',fort:'unassessed','palace-civic-architecture':'unassessed','colonial-architecture':'unassessed','archaeological-landscape':'unassessed','modern-heritage':'unassessed'}, prioritySites:[], methodologyNote:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'districtHistoryResearch'
    ? { id:'district-history-', name:{en:'',kn:''}, recordKind:'candidate', districtId:'', district:{en:'',kn:''}, category:'settlement-origin', date:{from:null,to:null,era:'CE',precision:'unknown'}, location:null, description:{en:'',kn:''}, researchNote:{en:'',kn:''}, evidenceBasis:'research-intake', citations:[], review:{status:'needs-review',reviewer:null,updatedAt:today()} }
  : collection === 'sources'
    ? { id:'src-', type:'book', title:{en:'',kn:''}, authors:[], publisher:'', year:null, doi:'', isbn:'', url:'', alternateUrls:[], archiveIdentifier:'', scope:{en:'',kn:''}, review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'collaborations'
    ? { id:'collaboration-', name:{en:'',kn:''}, entityKind:'organization', stage:'upcoming', collaborationType:'research', url:'', contribution:{en:'',kn:''}, contactPath:'#community', review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'peopleCandidates'
    ? { id:'person-candidate-q', name:{en:'',kn:''}, aliases:{en:[],kn:[]}, roles:['author'], occupations:[], date:{from:null,to:null,era:'CE',precision:'unknown'}, birthplace:{wikidataId:'',name:{en:'',kn:''},location:null}, externalIds:{wikidata:''}, externalLinks:[], image:null, discovery:{method:'community-intake',scope:'Karnataka/Kannada connection requires review',retrievedAt:today(),publicationReady:false}, citations:[], reviewWorkflow:{target:'curated-person-record',status:'candidate-intake',evidence:{identity:{status:'unresolved'},karnatakaConnection:{status:'unresolved'},bilingualName:{status:'unresolved'},lifeDates:{status:'unresolved'},roles:{status:'unresolved'},contributions:{status:'unresolved'},authorityCitations:{status:'unresolved'},imageLicense:{status:'not-available'}}}, review:{status:'needs-review',reviewer:null,updatedAt:today()} }
    : collection === 'martyrCandidates'
      ? { id:'martyr-candidate-v5-p', name:{en:'',kn:''}, aliases:{en:[],kn:[]}, roles:['freedom-fighter'], candidateKind:'dictionary-martyr', relationship:'karnataka-origin-or-residence', districtText:[], sourceEntry:{printedPageFrom:null,printedPageTo:null,sourceLine:null,archivalReference:''}, date:{from:null,to:null,era:'CE',precision:'unknown'}, citations:[{sourceId:'src-india-culture-dictionary-martyrs-v5',locator:''}], discovery:{method:'manual-volume-5-intake',scope:'Verify against the printed page and archival reference.',retrievedAt:today(),publicationReady:false}, reviewWorkflow:{target:'curated-person-record',status:'candidate-intake',evidence:{identity:{status:'unresolved'},karnatakaConnection:{status:'unresolved'},bilingualName:{status:'unresolved'},district:{status:'unresolved'},lifeDates:{status:'unresolved'},roles:{status:'provisional'},contributions:{status:'unresolved'},authorityCitations:{status:'located'}}}, review:{status:'needs-review',reviewer:null,updatedAt:today()} }
      : { id:`${collectionPrefix[collection]}-`, name:{en:'',kn:''}, date:{from:null,to:null,era:'CE',precision:'unknown'}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }

function recordTitle(record, collection = '', locale = 'en') {
  const localizedTitle = localizedRecordTitle(record, locale)
  if (localizedTitle) return localizedTitle
  if (record.fromId != null || record.toId != null) return `${record.fromId || 'Relationship'} → ${record.toId || '…'}`
  return record.id || `Untitled ${collectionPrefix[collection] || 'record'}`
}

const reviewedStatuses = new Set(['reviewed','published','verified','authority-confirmed','fully-verified'])
const recordProgress = record => {
  const status=record?.review?.status||record?.verification?.verificationStatus||record?.auditStatus||record?.status||'draft'
  return reviewedStatuses.has(status)?'verified':'pending'
}

const adminText = {
  kn:{workspace:`ಸ್ಥಿರ ಸಂಶೋಧನಾ ಕಾರ್ಯಕ್ಷೇತ್ರ · Atlas v${atlasData.meta.schemaVersion}`,title:'ದತ್ತಾಂಶ ಸಂಪಾದಕ',subtitle:'MariaDBಯಲ್ಲಿ ಶಾಶ್ವತ ಆವೃತ್ತಿಗಳು ಮತ್ತು ಪರಿಶೀಲನಾ ಹಸ್ತಾಂತರ',back:'← ಸಾರ್ವಜನಿಕ ಭೂಪಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',profile:'ನನ್ನ ಪ್ರೊಫೈಲ್',warning:'ಉಳಿಸುವ ಪ್ರತಿಯೊಂದು ಆವೃತ್ತಿಯೂ MariaDBಯಲ್ಲಿ ಶಾಶ್ವತವಾಗಿ ಸಂಗ್ರಹವಾಗುತ್ತದೆ. ಈ ಪುಟವು ಬ್ರೌಸರ್ ಕರಡು ಅಥವಾ localStorage ಬಳಸುವುದಿಲ್ಲ; ಸಾರ್ವಜನಿಕ GitHub Pages ಆವೃತ್ತಿಗೆ ಪ್ರಕಟಿಸುವ ಮೊದಲು ನಿರ್ವಾಹಕರು ಆವೃತ್ತಿಯನ್ನು ಪರಿಶೀಲಿಸಬೇಕು.',resourcesManagement:'ಆಕರಗಳು ಮತ್ತು ಸಹಯೋಗ ನಿರ್ವಹಣೆ',errors:'ದೋಷಗಳು',warnings:'ಎಚ್ಚರಿಕೆಗಳು',import:'JSON ಆಮದು',export:'JSON ರಫ್ತು',reset:'ಸರ್ವರ್ ಆವೃತ್ತಿ ಮರುಲೋಡ್',search:'ಎಲ್ಲ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಹುಡುಕಿ',searchPlaceholder:'ಹೆಸರು, ID, ಸ್ಥಿತಿ…',records:'ದಾಖಲೆಗಳು',new:'+ ಹೊಸ ದಾಖಲೆ',newSource:'+ ಹೊಸ ಆಕರ',edit:'ದಾಖಲೆ ತಿದ್ದುಪಡಿ',create:'ದಾಖಲೆ ರಚಿಸಿ',delete:'ಅಳಿಸಿ',save:'MariaDB ಆವೃತ್ತಿ ಉಳಿಸಿ',stableId:'ಸ್ಥಿರ ID / Stable ID',englishName:'ಇಂಗ್ಲಿಷ್ ಹೆಸರು / English name',kannadaName:'ಕನ್ನಡ ಹೆಸರು / Kannada name',start:'ಆರಂಭ ವರ್ಷ / Start year',end:'ಅಂತ್ಯ ವರ್ಷ / End year',datePrecision:'ದಿನಾಂಕ ನಿಖರತೆ / Date precision',reviewStatus:'ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ / Review status',reviewer:'ಪರಿಶೀಲಕರು / Reviewer',json:'ಸಂಪೂರ್ಣ ದಾಖಲೆ JSON',validation:'ಈ ದಾಖಲೆಯ ಪರಿಶೀಲನೆ',noMatches:'ಈ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದುವ ದಾಖಲೆಗಳು ಇಲ್ಲ.',collections:{polities:'ರಾಜ್ಯಗಳು',people:'ವ್ಯಕ್ತಿಗಳು',places:'ಸ್ಥಳಗಳು',inscriptions:'ಶಾಸನಗಳು',works:'ಸಾಹಿತ್ಯ ಕೃತಿಗಳು',sources:'ಆಕರಗಳು',relationships:'ಸಂಬಂಧಗಳು'}},
  en:{workspace:`Permanent research workspace · Atlas v${atlasData.meta.schemaVersion}`,title:'Dataset editor',subtitle:'Versioned MariaDB records for review and publication handoff',back:'← Return to public atlas',profile:'My profile',warning:'Every save creates a permanent MariaDB dataset revision. This page does not use browser drafts or localStorage; administrators review a revision before publishing the static GitHub Pages release.',resourcesManagement:'Resources & collaborations management',errors:'errors',warnings:'warnings',import:'Import JSON',export:'Export JSON',reset:'Reload server version',search:'Search all fields',searchPlaceholder:'Name, ID, status…',records:'records',new:'+ New record',newSource:'+ Add reference',edit:'Edit record',create:'Create record',delete:'Delete',save:'Save MariaDB revision',stableId:'Stable ID',englishName:'English name',kannadaName:'Kannada name',start:'Start year',end:'End year',datePrecision:'Date precision',reviewStatus:'Review status',reviewer:'Reviewer',json:'Complete record JSON',validation:'Validation for this record',sourceUsage:'Citation usage',sourceUsageNote:'Every linked record and locator is listed here. Select a record to edit its citation or add a new source.',noSourceUsage:'This source is not linked from another record yet.',noMatches:'No records match this search.',collections:collectionLabels}
}
Object.assign(adminText.kn.collections,{externalPolities:'ಬಾಹ್ಯ ರಾಜ್ಯಗಳು',events:'ಐತಿಹಾಸಿಕ ಘಟನೆಗಳು',culturalHeritage:'ಸ್ಮಾರಕಗಳು, ಕಲೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ',artifacts:'ರಾಜಚಿಹ್ನೆಗಳು ಮತ್ತು ವಸ್ತುಗಳು',reigns:'ಆಳ್ವಿಕೆ ಮತ್ತು ರಾಜಕೀಯ ಅವಧಿಗಳು',territorialExtents:'ಭೂಪ್ರದೇಶ ಸಾಕ್ಷ್ಯ',deepChronologies:'ಪ್ರಾಚೀನ ಕಾಲಕ್ರಮಗಳು',heritageAudits:'ಜಿಲ್ಲಾ ಪರಂಪರೆ ಪರಿಶೀಲನೆಗಳು'})
adminText.kn.collections.periodicals='ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಮಾಸಿಕೆಗಳು'
adminText.kn.collections.externalGovernancePhases='ಬಾಹ್ಯ ಆಡಳಿತ ಹಂತಗಳು'
adminText.kn.collections.districtHistoryResearch='ಜಿಲ್ಲಾ ಸಮಗ್ರ ಇತಿಹಾಸ ಸಂಶೋಧನೆ'
adminText.kn.collections.templeInventoryLeads='ದೇವಾಲಯ ಪಟ್ಟಿ ಸುಳಿವುಗಳು'
adminText.kn.collections.heritageInventoryLeads='ಪರಂಪರೆ ಸಮಗ್ರ ಪಟ್ಟಿ ಸುಳಿವುಗಳು'
adminText.kn.collections.inscriptionAudits='ಜಿಲ್ಲಾ ಶಾಸನ ಪರಿಶೀಲನೆಗಳು'
adminText.kn.collections.politicalRelations='ದ್ವಿಪಕ್ಷೀಯ ರಾಜಕೀಯ ಸಂಬಂಧಗಳು'
adminText.kn.collections.collaborations='ಸಹಯೋಗಗಳು'
adminText.kn.collections.peopleCandidates='ವ್ಯಕ್ತಿಗಳ ಪರಿಶೀಲನಾ ಅಭ್ಯರ್ಥಿಗಳು'
adminText.kn.collections.martyrCandidates='ಹುತಾತ್ಮರ ನಿಘಂಟು ಪರಿಶೀಲನಾ ಅಭ್ಯರ್ಥಿಗಳು'
Object.assign(adminText.kn,{progressTitle:'ದತ್ತಾಂಶ ಪ್ರಗತಿ ವರದಿ',progressIntro:'ಪರಿಶೀಲಿಸಿದ, ಬಾಕಿ ಮತ್ತು ದೋಷಗಳ ಸಂಕ್ಷಿಪ್ತ ಚಿತ್ರಣ',dataPoints:'ಒಟ್ಟು ದತ್ತಾಂಶ ಬಿಂದುಗಳು',verified:'ಪರಿಶೀಲಿಸಿದ / ಪ್ರಕಟಿತ',pending:'ಪರಿಶೀಲನೆ ಬಾಕಿ',validationErrors:'ದತ್ತಾಂಶ ದೋಷಗಳು',coverage:'ವ್ಯಾಪ್ತಿ',collectionProgress:'ಸಂಗ್ರಹವಾರು ಪ್ರಗತಿ'})
Object.assign(adminText.en,{progressTitle:'Dataset progress report',progressIntro:'A live summary of reviewed, pending and invalid records',dataPoints:'Total data points',verified:'Reviewed / published',pending:'Pending review',validationErrors:'Validation errors',coverage:'Coverage',collectionProgress:'Collection progress'})
Object.assign(adminText.kn,{sourceUsage:'ಉಲ್ಲೇಖ ಬಳಕೆ',sourceUsageNote:'ಈ ಆಕರವನ್ನು ಬಳಸುವ ದಾಖಲೆಗಳು ಮತ್ತು ಸ್ಥಾನಸೂಚಿಗಳನ್ನು ಇಲ್ಲಿ ನೋಡಿ. ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಉಲ್ಲೇಖ ತಿದ್ದುಪಡಿ ಮಾಡಿ ಅಥವಾ ಹೊಸ ಆಕರ ಸೇರಿಸಿ.',noSourceUsage:'ಈ ಆಕರವನ್ನು ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆ ಜೋಡಿಸಿಲ್ಲ.'})
Object.assign(adminText.kn,{sourceReviewTitle:'ಆಕರ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',citedSources:'ಉಲ್ಲೇಖಿತ ಆಕರಗಳು',unlinkedSources:'ಜೋಡಿಸದ ಆಕರಗಳು',pendingSources:'ಪರಿಶೀಲನೆ ಬಾಕಿ',sourceLinks:'ಬಳಕೆಗಳು',openSource:'ಆಕರ ತೆರೆಯಿರಿ',englishScope:'ಆಕರದ ಇಂಗ್ಲಿಷ್ ವ್ಯಾಪ್ತಿ',kannadaScope:'ಆಕರದ ಕನ್ನಡ ವ್ಯಾಪ್ತಿ',archiveId:'ಆರ್ಕೈವ್ ಗುರುತು',alternateUrls:'ಪರ್ಯಾಯ URLಗಳು (ಪ್ರತಿ ಸಾಲಿಗೆ ಒಂದು)'})
Object.assign(adminText.en,{sourceReviewTitle:'Reference review register',citedSources:'Cited sources',unlinkedSources:'Unlinked sources',pendingSources:'Awaiting review',sourceLinks:'uses',openSource:'Open source',englishScope:'English evidence scope',kannadaScope:'Kannada evidence scope',archiveId:'Archive identifier',alternateUrls:'Alternate URLs (one per line)'})
Object.assign(adminText.kn,{translationIssuesTitle:'ಅನುವಾದ ಸಂಗತತೆ',translationIssuesIntro:'ಗ್ಲಾಸರಿಯ ವಿರುದ್ಧ ಸ್ವಯಂಚಾಲಿತ ಪರಿಶೀಲನೆ ಹಿಡಿದ ದಾಖಲೆಗಳು',translationIssuesNone:'ಯಾವುದೇ ಗ್ಲಾಸರಿ ಸಂಗತತೆ ಸಮಸ್ಯೆ ಪತ್ತೆಯಾಗಿಲ್ಲ.',fixRecord:'ತಿದ್ದುಪಡಿ ಮಾಡಿ →',glossaryTitle:'ಇಂಗ್ಲಿಷ್ → ಕನ್ನಡ ಗ್ಲಾಸರಿ',glossaryIntro:'ಪದೇಪದೇ ಬಳಸುವ ಪದಗಳಿಗೆ ಪ್ರಮಾಣಿತ ಅನುವಾದ; ಹೊಸ ದ್ವಿಭಾಷಾ ಪಠ್ಯ ಬರೆಯುವಾಗ ಸಂಗತತೆಗಾಗಿ ಬಳಸಿ.',glossaryTerm:'ಇಂಗ್ಲಿಷ್ ಪದ',glossaryKn:'ಪ್ರಮಾಣಿತ ಕನ್ನಡ',glossaryNote:'ಟಿಪ್ಪಣಿ',missingKannadaTitle:'ಕನ್ನಡ ಅನುವಾದ ಬಾಕಿ',missingKannadaIntro:`ಹೆಸರು/ಶೀರ್ಷಿಕೆಗೆ ಕನ್ನಡ ಪಠ್ಯ ಇಲ್ಲ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನ ನಕಲು ಮಾತ್ರ ಇರುವ ದಾಖಲೆಗಳು (ಹೆಚ್ಚಾಗಿ OCR ಆಮದು ಸಂಗ್ರಹಗಳಿಂದ) — ಸರಿಪಡಿಸುವವರೆಗೆ ಪಟ್ಟಿಯಲ್ಲಿ ಇಂಗ್ಲಿಷ್ ಬದಲಿ ಪಠ್ಯವಾಗಿ ಕಾಣಿಸುತ್ತದೆ.`,missingKannadaNone:'ಎಲ್ಲ ಹೆಸರು/ಶೀರ್ಷಿಕೆಗಳಿಗೆ ಕನ್ನಡ ಅನುವಾದ ಇದೆ.',kannadaMissingTag:'(ಕನ್ನಡ ಇಲ್ಲ — ಇಂಗ್ಲಿಷ್ ತೋರಿಸಲಾಗಿದೆ)'})
Object.assign(adminText.en,{translationIssuesTitle:'Translation consistency',translationIssuesIntro:'Records flagged by an automated check against the glossary below',translationIssuesNone:'No glossary consistency issues detected.',fixRecord:'Fix →',glossaryTitle:'English → Kannada glossary',glossaryIntro:'Standard translations for recurring terms; consult this when writing new bilingual content to stay consistent.',glossaryTerm:'English term',glossaryKn:'Standard Kannada',glossaryNote:'Note',missingKannadaTitle:'Missing Kannada translations',missingKannadaIntro:'Records whose name/title has no Kannada text yet, or just a copy of the English text (mostly from bulk OCR import collections) — English is shown as a fallback in the list until these are fixed.',missingKannadaNone:'Every name/title has a Kannada translation.',kannadaMissingTag:'(no Kannada yet — showing English)'})
Object.assign(adminText.kn,{releaseTitle:'ಲೈವ್ ಸಮುದಾಯ ಹಸ್ತಾಂತರ',releaseIntro:'ಮಾರಿಯಾDB ಕಾರ್ಯಕ್ಷೇತ್ರ ಮತ್ತು ಕೊನೆಯ ಸ್ಥಿರ ಪ್ರಕಟಣೆಯ ಸ್ಥಿತಿ',pendingAccounts:'ಅನುಮೋದನೆ ಬಾಕಿ ಖಾತೆಗಳು',submittedContributions:'ವಿಮರ್ಶೆ ಬಾಕಿ ಕೊಡುಗೆಗಳು',pendingVerifications:'ID ಪರಿಶೀಲನೆ ಬಾಕಿ',appointedReviewers:'ನೇಮಕಗೊಂಡ ಪರಿಶೀಲಕರು',latestRevision:'ಕೊನೆಯ MariaDB ಆವೃತ್ತಿ',lastPublished:'ಕೊನೆಯ ಸ್ಥಿರ ಪ್ರಕಟಣೆ',notPublished:'ಇನ್ನೂ ಸ್ಥಿರ ಪ್ರಕಟಣೆ ಇಲ್ಲ'})
Object.assign(adminText.en,{releaseTitle:'Live community handoff',releaseIntro:'MariaDB workspace and latest static-publication status',pendingAccounts:'Accounts awaiting approval',submittedContributions:'Contributions awaiting review',pendingVerifications:'ID verifications pending',appointedReviewers:'Appointed reviewers',latestRevision:'Latest MariaDB revision',lastPublished:'Latest static publication',notPublished:'No static publication yet'})

const adminTourSteps=(locale='kn')=>[
  {target:'.admin-header',title:{kn:'ನಿರ್ವಾಹಕ ಕಾರ್ಯಕ್ಷೇತ್ರ · ಸ್ಥಿರ ಡೇಟಾ ನಿರ್ವಹಣೆ',en:'Admin workspace · manage the permanent dataset'},body:{kn:'ನಿಮ್ಮ ಭಾಷೆ, ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಭೂಪಟಕ್ಕೆ ಹಿಂತಿರುಗುವ ಆಯ್ಕೆಗಳು ಇಲ್ಲಿ ಇವೆ.',en:'Use the header to switch language, open your profile or return to the public atlas.'}},
  {target:'.admin-progress',title:{kn:'ಪ್ರಗತಿ ವರದಿ · ವ್ಯಾಪ್ತಿ ಮತ್ತು ಸ್ಥಿತಿಗಳು',en:'Progress report · coverage and status'},body:{kn:'ಒಟ್ಟು ದತ್ತಾಂಶ ಬಿಂದುಗಳು, ಪರಿಶೀಲಿತ ಮತ್ತು ಬಾಕಿ ದಾಖಲೆಗಳು ಹಾಗೂ ಸಂಗ್ರಹವಾರು ವ್ಯಾಪ್ತಿಯನ್ನು ಇಲ್ಲಿ ನೋಡಿ.',en:'See total data points, reviewed and pending records, validation errors and collection coverage.'}},
  {target:'.admin-release-readiness,.admin-progress',title:{kn:'ಪ್ರಕಟಣೆ ಸಿದ್ಧತೆ · live handoff',en:'Release readiness · live handoff'},body:{kn:'MariaDB ಕಾರ್ಯಕ್ಷೇತ್ರದಿಂದ ಸ್ಥಿರ ಸಾರ್ವಜನಿಕ ಪ್ರಕಟಣೆಗೆ ಹೋಗುವ ಮೊದಲು ಬಾಕಿ ಖಾತೆಗಳು, ಕೊಡುಗೆಗಳು ಮತ್ತು ಪರಿಶೀಲನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',en:'Review pending accounts, contributions and verification gates before handing a MariaDB revision to the static public release.'}},
  {target:'.admin-nav',title:{kn:'ಸಂಗ್ರಹಗಳು · ಒಂದು ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ',en:'Collections · choose a dataset'},body:{kn:'ರಾಜ್ಯಗಳು, ವ್ಯಕ್ತಿಗಳು, ಘಟನೆಗಳು, ಶಾಸನಗಳು, ಸಾಹಿತ್ಯ, ಸಂಬಂಧಗಳು ಮತ್ತು ಪರಿಶೀಲನಾ ಸಂಗ್ರಹಗಳ ನಡುವೆ ಬದಲಿಸಿ.',en:'Switch between polities, people, events, inscriptions, literature, relations and evidence collections.'}},
  {target:'.record-list',title:{kn:'ದಾಖಲೆ ಪಟ್ಟಿ · ಹುಡುಕಿ ಮತ್ತು ಆಯ್ಕೆಮಾಡಿ',en:'Record list · search and select'},body:{kn:'ID, ಹೆಸರು ಅಥವಾ ಸ್ಥಿತಿಯಿಂದ ಹುಡುಕಿ. ಸ್ಥಿರ ID ಬದಲಾಗದಂತೆ ದಾಖಲೆ ಆಯ್ಕೆಮಾಡಿ.',en:'Search by ID, name or status, then select a record while preserving its stable identifier.'}},
  {target:'.record-editor',title:{kn:'ದಾಖಲೆ ಸಂಪಾದಕ · ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಉಳಿಸಿ',en:'Record editor · validate and save'},body:{kn:'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಕ್ಷೇತ್ರಗಳು, ದಿನಾಂಕ, ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ, ಸಂಬಂಧಗಳು ಮತ್ತು ಉಲ್ಲೇಖಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ. ಉಳಿಸುವ ಮೊದಲು validation ಸಂದೇಶಗಳನ್ನು ಪರಿಹರಿಸಿ.',en:'Edit bilingual fields, dates, review status, relationships and citations. Resolve validation messages before saving a permanent MariaDB revision.'}},
  {target:'.admin-toolbar',title:{kn:'ಆಮದು ಮತ್ತು ರಫ್ತು · ನಿರ್ವಾಹಕರಿಗೆ ಮಾತ್ರ',en:'Import and export · administrator-only tools'},body:{kn:'JSON ಆಮದು, ರಫ್ತು ಮತ್ತು ಸರ್ವರ್ ಆವೃತ್ತಿ ಮರುಲೋಡ್ ಕಾರ್ಯಗಳು ಇಲ್ಲಿ ಇವೆ. ಸಾರ್ವಜನಿಕ ಬಳಕೆದಾರರಿಗೆ ಇವು ಕಾಣಿಸುವುದಿಲ್ಲ.',en:'JSON import, export and server-version reload controls are kept here for administrators and are not exposed in the public portal.'}},
]

export default function Admin({ onClose, locale='kn', onLocaleChange }) {
  const t=adminText[locale]
  const [data,setData] = useState(()=>clone(atlasData))
  const [revision,setRevision] = useState(0)
  const [connection,setConnection] = useState('loading')
  const [readiness,setReadiness] = useState(null)
  const [saving,setSaving] = useState(false)
  const [collection,setCollection] = useState('polities')
  const [query,setQuery] = useState('')
  const [selectedId,setSelectedId] = useState(data.polities[0]?.id || '')
  const [draft,setDraft] = useState(() => clone(data.polities[0] || blankRecord('polities')))
  const [jsonText,setJsonText] = useState(() => JSON.stringify(data.polities[0] || blankRecord('polities'),null,2))
  const [notice,setNotice] = useState('')
  const fileRef = useRef()
  useEffect(()=>{
    let active=true
    fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/administration/dataset`,{credentials:'include'})
      .then(async response=>{const body=await response.json().catch(()=>({}));if(response.status===404&&body.revision===0)return {dataset:null,revision:0};if(!response.ok)throw new Error(body.error||`Server request failed (${response.status})`);return body})
      .then(body=>{if(!active)return;const dataset=body.dataset;if(!dataset)throw new Error('No permanent MariaDB dataset revision is available.');setData(dataset);setRevision(Number(body.revision||0));setCollection('polities');const first=dataset.polities?.[0];setSelectedId(first?.id||'');setEditor(first||blankRecord('polities'));setConnection('ready');setNotice(`Loaded permanent MariaDB revision ${body.revision||0}.`)})
      .catch(error=>{if(active){setConnection('error');setNotice(error.message)}})
    return()=>{active=false}
  },[])
  useEffect(()=>{if(connection!=='ready')return;let active=true;fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/administration/release-readiness`,{credentials:'include'}).then(response=>response.ok?response.json():Promise.reject(new Error('Unable to load release-readiness status.'))).then(value=>{if(active)setReadiness(value)}).catch(()=>{if(active)setReadiness(null)});return()=>{active=false}},[connection])
  const issues = useMemo(()=>validateAtlas(data),[data])
  const translationIssues = useMemo(()=>issues.filter(issue=>issue.message.includes('(glossary:')),[issues])
  const missingKannadaIssues = useMemo(()=>issues.filter(issue=>issue.message.includes('(missing-kn)')),[issues])
  const filtered = useMemo(() => {
    return (data[collection] || []).filter(record => recordMatchesAdminSearch(record,query))
  },[data,collection,query])
  const sourceUsageById = useMemo(()=>new Map((data.sources||[]).map(source=>[source.id,Object.entries(data).flatMap(([key,records])=>Array.isArray(records)?records.filter(record=>record?.id!==source.id).flatMap(record=>collectSourceUses(record,source.id).map(use=>({collection:key,id:record.id,...use}))):[])])),[data])
  const sourceReviewSummary = useMemo(()=>{const records=data.sources||[];const cited=records.filter(source=>(sourceUsageById.get(source.id)||[]).length>0).length;const pending=records.filter(source=>recordProgress(source)==='pending').length;return {total:records.length,cited,pending,unlinked:records.length-cited}},[data.sources,sourceUsageById])
  const selectedSourceUses = useMemo(()=>collection==='sources'&&selectedId ? Object.entries(data).flatMap(([key,records])=>Array.isArray(records)?records.filter(record=>record?.id!==selectedId).flatMap(record=>collectSourceUses(record,selectedId).map(use=>({collection:key,id:record.id,title:record.name?.en||record.title?.en||record.id,...use}))):[]) : [],[data,collection,selectedId])
  const recordIssues = useMemo(()=>{
    const candidate=clone(data); const list=candidate[collection] || []; const index=list.findIndex(record=>record.id===selectedId)
    if(index>=0) list[index]=draft; else list.push(draft)
    const issues=validateAtlas(candidate).filter(issue=>issue.id===(draft.id || 'row-1') || (!draft.id && issue.collection===collection))
    if(selectedId && draft.id !== selectedId) issues.unshift({severity:'error',collection,id:draft.id||selectedId,path:'id',message:`Stable ID “${selectedId}” cannot be changed because other records reference it.`})
    return issues
  },[data,collection,selectedId,draft])
  const progress = useMemo(()=>{
    const rows=collections.map(key=>{const records=Array.isArray(data[key])?data[key]:[];const verified=records.filter(record=>recordProgress(record)==='verified').length;return {key,total:records.length,verified,pending:records.length-verified}})
    const total=rows.reduce((sum,row)=>sum+row.total,0);const verified=rows.reduce((sum,row)=>sum+row.verified,0)
    return {rows,total,verified,pending:total-verified,percent:total?Math.round(verified/total*100):0}
  },[data])
  const setEditor = record => { const next=clone(record); setDraft(next); setJsonText(JSON.stringify(next,null,2)) }

  const selectCollection = next => {
    setCollection(next)
    const first = data[next]?.[0]
    setSelectedId(first?.id || '')
    setEditor(first || blankRecord(next))
  }
  const selectRecord = record => { setSelectedId(record.id); setEditor(record); setNotice('') }
  const update = (path,value) => setDraft(current => {
    const next = clone(current); let node = next
    path.slice(0,-1).forEach(key => { node[key] ||= {}; node=node[key] })
    node[path.at(-1)] = value
    setJsonText(JSON.stringify(next,null,2))
    return next
  })
  const persistDataset = async (next, successMessage='Permanent revision saved.') => {
    if (saving || connection==='error') return false
    setSaving(true);setNotice('Saving permanent MariaDB revision…')
    try {
      const response=await fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/administration/dataset`,{method:'PUT',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({dataset:next,baseRevision:revision})})
      const body=await response.json().catch(()=>({}));if(!response.ok){const details=Array.isArray(body.issues)&&body.issues.length?` ${formatValidationIssues(body.issues)}`:'';throw new Error(`${body.error||`Server request failed (${response.status})`}${details}`)}
      setData(next);setRevision(Number(body.revision||revision+1));setNotice(`${successMessage} Revision ${body.revision}.`);return true
    } catch(error) { setNotice(error.message);return false } finally { setSaving(false) }
  }
  const save = async () => {
    const prepared=prepareDatasetSave({data,collection,selectedId,draft,updatedAt:today()})
    if(prepared.error){setNotice(prepared.error);return}
    const errors=validateAtlas(prepared.next).filter(issue=>issue.severity==='error')
    if(errors.length){setNotice(`Save blocked by ${errors.length} validation error(s). ${formatValidationIssues(errors)}`);return}
    const didSave=await persistDataset(prepared.next);if(didSave)setSelectedId(prepared.saved.id)
  }
  const create = () => { setSelectedId(''); setEditor(blankRecord(collection)); setNotice('New unsaved record.') }
  const remove = async () => {
    if (!selectedId || !window.confirm(`Delete ${selectedId} from the permanent dataset? This creates a new server revision.`)) return
    const next={...data,[collection]:data[collection].filter(record=>record.id!==selectedId)}
    const didSave=await persistDataset(next,'Record deleted in permanent revision');if(didSave){const first=next[collection][0];setSelectedId(first?.id||'');setEditor(first||blankRecord(collection))}
  }
  const reset = async () => {
    setNotice('Reloading permanent server version…')
    try { const response=await fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/administration/dataset`,{credentials:'include'});const body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.error||`Server request failed (${response.status})`);if(!body.dataset)throw new Error('No permanent server revision exists yet.');setData(body.dataset);setRevision(Number(body.revision||0));setCollection('polities');const first=body.dataset.polities?.[0];setSelectedId(first?.id||'');setEditor(first||blankRecord('polities'));setNotice(`Loaded permanent revision ${body.revision}.`) } catch(error) { setNotice(error.message) }
  }
  const exportData = () => {
    const output={...data,meta:{...data.meta,exportedAt:new Date().toISOString()}}
    const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)],{type:'application/json'})); const a=document.createElement('a'); a.href=url; a.download=`karnataka-atlas-${today()}.json`; a.click(); URL.revokeObjectURL(url)
  }
  const importData = event => {
    const file=event.target.files?.[0]; if (!file) return
    const reader=new FileReader(); reader.onload=()=>{ try { const next=JSON.parse(reader.result); const nextIssues=validateAtlas(next); if (hasValidationErrors(nextIssues) && !window.confirm(`This file has ${nextIssues.filter(i=>i.severity==='error').length} errors. Import into the editor anyway and save it as a server revision?`)) return; setData(next); setCollection('polities'); const first=next.polities?.[0]; setSelectedId(first?.id||''); setEditor(first||blankRecord('polities')); setNotice(`Imported ${file.name}. Review it, then save a permanent MariaDB revision.`) } catch { setNotice('Import failed: the file is not valid JSON.') } }; reader.readAsText(file); event.target.value=''
  }

  return <div className="admin-shell" lang={locale}>
    <header className="admin-header"><div className="sanchaya-product-brand"><a className="sanchaya-mark" href="#atlas" aria-label={t.back} onClick={event=>{event.preventDefault();onClose()}}><img src={`${import.meta.env.BASE_URL}sanchaya-logo.png`} alt="Sanchaya"/></a><div><p className="eyebrow">{t.workspace}</p><h1>{t.title}</h1><p className="admin-subtitle">{t.subtitle}</p></div></div><div className="admin-header-actions"><button className="secondary language-switch" onClick={onLocaleChange}>{locale==='kn'?'English':'ಕನ್ನಡ'}</button><button className="secondary" onClick={()=>{window.location.hash='profile'}}>{t.profile}</button><button className="secondary" onClick={onClose}>{t.back}</button></div></header>
    <div className="admin-warning"><strong>{locale==='kn'?'ಸ್ಥಿರ-ಮೊದಲ ವಿನ್ಯಾಸ:':'Static-first:'}</strong> {t.warning}</div>
    <div className="admin-toolbar">
      <div className="health"><strong>{issues.filter(i=>i.severity==='error').length}</strong> {t.errors} <strong>{issues.filter(i=>i.severity==='warning').length}</strong> {t.warnings} · <span className={`dataset-connection ${connection}`}>{connection==='ready'?`MariaDB · revision ${revision}`:connection==='loading'?'Connecting to MariaDB…':'MariaDB unavailable'}</span></div>
      <div className="admin-resource-shortcuts"><span>{t.resourcesManagement}</span><button className={collection==='sources'?'active':''} onClick={()=>selectCollection('sources')}>{t.collections.sources} · {data.sources.length}</button><button className={collection==='collaborations'?'active':''} onClick={()=>selectCollection('collaborations')}>{t.collections.collaborations} · {data.collaborations.length}</button></div>
      <button onClick={()=>fileRef.current.click()}>{t.import}</button><input ref={fileRef} hidden type="file" accept="application/json,.json" onChange={importData}/><button onClick={exportData}>{t.export}</button><button className="danger-link" onClick={reset}>{t.reset}</button>
    </div>
    <GuidedTour tourKey="admin" locale={locale} steps={adminTourSteps(locale)}/>
    <section className="admin-progress" aria-labelledby="admin-progress-title">
      <div className="admin-progress-head"><div><p className="eyebrow">{t.progressTitle}</p><h2 id="admin-progress-title">{t.progressIntro}</h2></div><strong>{progress.percent}% {t.coverage}</strong></div>
      <div className="admin-stat-grid"><article><b>{progress.total}</b><span>{t.dataPoints}</span></article><article className="verified"><b>{progress.verified}</b><span>{t.verified}</span></article><article className="pending"><b>{progress.pending}</b><span>{t.pending}</span></article><article className={issues.some(issue=>issue.severity==='error')?'invalid':''}><b>{issues.filter(issue=>issue.severity==='error').length}</b><span>{t.validationErrors}</span></article></div>
      <div className="admin-progress-table"><div className="admin-progress-table-title">{t.collectionProgress}</div>{progress.rows.map(row=><div className="admin-progress-row" key={row.key}><span>{t.collections[row.key]||row.key}</span><div className="admin-progress-bar"><i style={{width:`${row.total?Math.round(row.verified/row.total*100):0}%`}}></i></div><b>{row.verified}/{row.total}</b><small>{row.total?Math.round(row.verified/row.total*100):0}%</small></div>)}</div>
    </section>
    <section className="admin-translation-glossary" aria-labelledby="admin-translation-title">
      <div><p className="eyebrow">{t.translationIssuesTitle}</p><h2 id="admin-translation-title">{t.translationIssuesIntro}</h2></div>
      {translationIssues.length
        ? <ul className="admin-translation-issue-list">{translationIssues.map((issue,index)=><li key={`${issue.collection}-${issue.id}-${index}`}><span><strong>{t.collections[issue.collection]||issue.collection}</strong> · <code>{issue.id}</code></span><small>{issue.message}</small><button type="button" onClick={()=>{const record=(data[issue.collection]||[]).find(item=>item.id===issue.id);if(record){selectCollection(issue.collection);selectRecord(record)}}}>{t.fixRecord}</button></li>)}</ul>
        : <p className="admin-translation-none">{t.translationIssuesNone}</p>}
      <div className="admin-missing-kannada"><p className="eyebrow">{t.missingKannadaTitle}</p><h3>{t.missingKannadaIntro}</h3></div>
      {missingKannadaIssues.length
        ? <details className="admin-translation-issue-details" open={missingKannadaIssues.length<=8}>
            <summary>{missingKannadaIssues.length} {t.records}</summary>
            <ul className="admin-translation-issue-list">{missingKannadaIssues.map((issue,index)=><li key={`${issue.collection}-${issue.id}-${index}`}><span><strong>{t.collections[issue.collection]||issue.collection}</strong> · <code>{issue.id}</code></span><small>{issue.message}</small><button type="button" onClick={()=>{const record=(data[issue.collection]||[]).find(item=>item.id===issue.id);if(record){selectCollection(issue.collection);selectRecord(record)}}}>{t.fixRecord}</button></li>)}</ul>
          </details>
        : <p className="admin-translation-none">{t.missingKannadaNone}</p>}
      <details className="admin-glossary-reference">
        <summary>{t.glossaryTitle}</summary>
        <p className="admin-glossary-intro">{t.glossaryIntro}</p>
        <table className="admin-glossary-table"><thead><tr><th>{t.glossaryTerm}</th><th>{t.glossaryKn}</th><th>{t.glossaryNote}</th></tr></thead><tbody>{translationGlossary.map(entry=><tr key={entry.id}><td>{entry.en}</td><td lang="kn">{entry.kn}{entry.altKn?.length?<small> ({entry.altKn.join(', ')})</small>:null}</td><td>{entry.note}</td></tr>)}</tbody></table>
      </details>
    </section>
    {readiness&&<section className="admin-release-readiness" aria-labelledby="admin-release-title"><div><p className="eyebrow">{t.releaseTitle}</p><h2 id="admin-release-title">{t.releaseIntro}</h2></div><div className="admin-readiness-grid"><span><b>{readiness.community.pendingAccounts}</b>{t.pendingAccounts}</span><span><b>{readiness.community.submittedContributions}</b>{t.submittedContributions}</span><span><b>{readiness.community.pendingVerifications}</b>{t.pendingVerifications}</span><span><b>{readiness.community.appointedReviewers}</b>{t.appointedReviewers}</span><span><b>{readiness.dataset.revision}</b>{t.latestRevision}</span><span><b>{readiness.published.publishedAt?new Date(readiness.published.publishedAt).toLocaleDateString(locale==='kn'?'kn-IN':'en-IN'):t.notPublished}</b>{t.lastPublished}</span></div></section>}
    <main className="admin-main">
      <aside className="admin-nav">
        <label className="search" lang={locale}>{t.search}<input lang={locale} value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.searchPlaceholder}/></label>
        <nav>{collections.map(key=><button key={key} className={key===collection?'active':''} onClick={()=>selectCollection(key)}><span>{t.collections[key]}</span><b>{data[key]?.length || 0}</b></button>)}</nav>
      </aside>
      <section className="record-list">
        <div className="list-head"><div><p className="eyebrow">{t.collections[collection]}</p><strong>{filtered.length} {t.records}</strong></div><button className="primary" onClick={create}>{collection==='sources'?t.newSource:t.new}</button></div>
        {collection==='sources'&&<section className="admin-source-summary" aria-label={t.sourceReviewTitle}><h3>{t.sourceReviewTitle}</h3><div><span><b>{sourceReviewSummary.total}</b>{t.records}</span><span><b>{sourceReviewSummary.cited}</b>{t.citedSources}</span><span><b>{sourceReviewSummary.pending}</b>{t.pendingSources}</span><span><b>{sourceReviewSummary.unlinked}</b>{t.unlinkedSources}</span></div></section>}
        {filtered.map(record=>{
          const secondaryTitle=alternateRecordTitle(record,locale)
          const showKannadaFallback=!secondaryTitle && locale!=='kn' && missingKannadaTranslation(record)
          return <button key={record.id} className={record.id===selectedId?'active':''} onClick={()=>selectRecord(record)}><strong className="admin-record-title" lang={locale}>{recordTitle(record,collection,locale)}</strong><span className="admin-record-meta">{secondaryTitle&&<span className="admin-record-secondary" lang={locale==='kn'?'en':'kn'}>{secondaryTitle}</span>}{showKannadaFallback&&<span className="admin-record-secondary admin-record-secondary-fallback" lang="en">{recordTitle(record,collection,'en')} <em>{t.kannadaMissingTag}</em></span>}<code>{record.id}</code></span>{collection==='sources'&&<small className="source-use-count">{(sourceUsageById.get(record.id)||[]).length} {t.sourceLinks}{record.url?' · ↗':''}</small>}<em className={`status ${record.review?.status}`}>{record.review?.status || 'invalid'}</em></button>
        })}
        {!filtered.length&&<p className="empty">{t.noMatches}</p>}
      </section>
      <section className="record-editor">
        <div className="editor-head"><div><p className="eyebrow">{selectedId?t.edit:t.create}</p><h2>{recordTitle(draft,collection,locale)}</h2>{locale==='kn'&&(draft.name?.en||draft.title?.en)&&<p className="entity-secondary">{draft.name?.en||draft.title?.en}</p>}</div>{selectedId&&<button className="danger-link" onClick={remove}>{t.delete}</button>}</div>
        <div className="form-grid">
          <label className="wide">{t.stableId}<input value={draft.id||''} readOnly={Boolean(selectedId)} onChange={e=>update(['id'],e.target.value)} placeholder={`${collectionPrefix[collection]}-unique-name`}/><small>{selectedId?'Stable IDs cannot be changed after creation because other records reference them.':'Lowercase kebab-case; never reuse a published ID.'}</small></label>
          {collection==='relationships' ? <>
            <label>From ID <input value={draft.fromId||''} onChange={e=>update(['fromId'],e.target.value)}/></label><label>Relationship type <input value={draft.type||''} onChange={e=>update(['type'],e.target.value)}/></label><label className="wide">To ID <input value={draft.toId||''} onChange={e=>update(['toId'],e.target.value)}/></label>
          </> : collection==='politicalRelations' ? <>
            <label>Relation kind / ಸಂಬಂಧದ ಪ್ರಕಾರ<select value={draft.relationKind||'war'} onChange={e=>update(['relationKind'],e.target.value)}>{['war','invasion','campaign','trade','diplomacy','travel-knowledge','treaty','alliance','tribute','suzerainty','administrative-integration','constitutional-integration'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>Evidence level / ಸಾಕ್ಷ್ಯ ಮಟ್ಟ<select value={draft.evidenceLevel||'inferred'} onChange={e=>update(['evidenceLevel'],e.target.value)}>{['attested','inferred','contested'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">Party IDs / ಪಕ್ಷಗಳ IDಗಳು<input value={(draft.parties||[]).map(party=>party.polityId).join(', ')} onChange={e=>update(['parties'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean).map(polityId=>({polityId,role:'party'})))} placeholder="polity-mysore, external-polity-british-india"/></label>
            <label className="wide">Event IDs / ಘಟನೆಗಳ IDಗಳು<input value={(draft.eventIds||[]).join(', ')} onChange={e=>update(['eventIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))}/></label>
            <label className="wide">People / rulers IDs<input value={(draft.peopleIds||[]).join(', ')} onChange={e=>update(['peopleIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))}/></label>
            <label className="wide">Outcome / ಫಲಿತಾಂಶ<textarea rows="3" value={draft.outcome?.en||''} onChange={e=>update(['outcome','en'],e.target.value)}/></label><label className="wide">ಫಲಿತಾಂಶ / Kannada outcome<textarea lang="kn" rows="3" value={draft.outcome?.kn||''} onChange={e=>update(['outcome','kn'],e.target.value)}/></label>
          </> : collection==='sources' ? <>
            <label>English title <input value={draft.title?.en||''} onChange={e=>update(['title','en'],e.target.value)}/></label><label>Kannada title <input lang="kn" value={draft.title?.kn||''} onChange={e=>update(['title','kn'],e.target.value)}/></label><label className="wide">Authors / organizations<input value={(draft.authors||[]).join('; ')} onChange={e=>update(['authors'],e.target.value.split(';').map(value=>value.trim()).filter(Boolean))} placeholder="Author One; Institution Two"/></label><label>Source type <input value={draft.type||''} onChange={e=>update(['type'],e.target.value)}/></label><label>Publication year <input type="number" value={draft.year??''} onChange={e=>update(['year'],e.target.value===''?null:Number(e.target.value))}/></label><label className="wide">Publisher / repository<input value={draft.publisher||''} onChange={e=>update(['publisher'],e.target.value)}/></label><label>DOI<input value={draft.doi||''} onChange={e=>update(['doi'],e.target.value)}/></label><label>ISBN<input value={draft.isbn||''} onChange={e=>update(['isbn'],e.target.value)}/></label><label className="wide">URL <input type="url" value={draft.url||''} onChange={e=>update(['url'],e.target.value)}/>{draft.url&&<a className="admin-source-open" href={draft.url} target="_blank" rel="noreferrer">{t.openSource} ↗</a>}</label><label className="wide">{t.englishScope}<textarea rows="3" value={draft.scope?.en||''} onChange={e=>update(['scope','en'],e.target.value)}/></label><label className="wide">{t.kannadaScope}<textarea lang="kn" rows="3" value={draft.scope?.kn||''} onChange={e=>update(['scope','kn'],e.target.value)}/></label><label>{t.archiveId}<input value={draft.archiveIdentifier||''} onChange={e=>update(['archiveIdentifier'],e.target.value)}/></label><label className="wide">{t.alternateUrls}<textarea rows="3" value={(draft.alternateUrls||[]).join('\n')} onChange={e=>update(['alternateUrls'],e.target.value.split('\n').map(value=>value.trim()).filter(Boolean))}/></label>
          </> : collection==='peopleCandidates' ? <>
            <label>{t.englishName}<input value={draft.name?.en||''} onChange={e=>update(['name','en'],e.target.value)}/></label><label>{t.kannadaName}<input lang="kn" value={draft.name?.kn||''} onChange={e=>update(['name','kn'],e.target.value)}/></label>
            <label>Wikidata ID<input value={draft.externalIds?.wikidata||''} onChange={e=>update(['externalIds','wikidata'],e.target.value)} placeholder="Q12345"/></label><label>Roles / ಪಾತ್ರಗಳು<input value={(draft.roles||[]).join(', ')} onChange={e=>update(['roles'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="author, poet"/></label>
            <label>Birthplace Wikidata ID<input value={draft.birthplace?.wikidataId||''} onChange={e=>update(['birthplace','wikidataId'],e.target.value)} placeholder="Q1355"/></label><label>Birthplace / ಜನ್ಮಸ್ಥಳ<input value={draft.birthplace?.name?.en||''} onChange={e=>update(['birthplace','name','en'],e.target.value)}/></label><label>ಜನ್ಮಸ್ಥಳ ಕನ್ನಡ<input lang="kn" value={draft.birthplace?.name?.kn||''} onChange={e=>update(['birthplace','name','kn'],e.target.value)}/></label>
            <label className="wide">Review guidance / ಪರಿಶೀಲನಾ ಸೂಚನೆ<textarea rows="3" value={draft.discovery?.scope||''} onChange={e=>update(['discovery','scope'],e.target.value)}/></label>
          </> : collection==='martyrCandidates' ? <>
            <label>{t.englishName}<input value={draft.name?.en||''} onChange={e=>update(['name','en'],e.target.value)}/></label><label>{t.kannadaName}<input lang="kn" value={draft.name?.kn||''} onChange={e=>update(['name','kn'],e.target.value)}/></label>
            <label>Karnataka relationship<select value={draft.relationship||'karnataka-origin-or-residence'} onChange={e=>update(['relationship'],e.target.value)}><option value="karnataka-origin-or-residence">origin or residence</option><option value="karnataka-event-connection">event connection</option></select></label>
            <label>Printed page<input type="number" value={draft.sourceEntry?.printedPageFrom??''} onChange={e=>update(['sourceEntry','printedPageFrom'],e.target.value===''?null:Number(e.target.value))}/></label>
            <label>OCR source line<input type="number" value={draft.sourceEntry?.sourceLine??''} onChange={e=>update(['sourceEntry','sourceLine'],e.target.value===''?null:Number(e.target.value))}/></label>
            <label className="wide">District/place text leads<input value={(draft.districtText||[]).join(', ')} onChange={e=>update(['districtText'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))}/></label>
            <label className="wide">Archival reference<textarea rows="3" value={draft.sourceEntry?.archivalReference||''} onChange={e=>update(['sourceEntry','archivalReference'],e.target.value)}/></label>
            <label className="wide">Item-level citation locator<textarea rows="3" value={draft.citations?.[0]?.locator||''} onChange={e=>update(['citations','0','locator'],e.target.value)}/></label>
            <label className="wide">Review guidance / ಪರಿಶೀಲನಾ ಸೂಚನೆ<textarea rows="3" value={draft.discovery?.scope||''} onChange={e=>update(['discovery','scope'],e.target.value)}/></label>
          </> : collection==='districtHistoryResearch' ? <>
            <label>Record kind / ದಾಖಲೆ ಪ್ರಕಾರ<select value={draft.recordKind||'candidate'} onChange={e=>update(['recordKind'],e.target.value)}><option value="candidate">candidate</option><option value="district-scope">district-scope</option></select></label><label>Category / ವರ್ಗ<select value={draft.category||'settlement-origin'} onChange={e=>update(['category'],e.target.value)}>{['prehistoric-landscape','settlement-origin','urban-foundation','foundation-stone','regional-memory','district-scope'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">District audit ID / ಜಿಲ್ಲಾ ಪರಿಶೀಲನೆ ID<input value={draft.districtId||''} onChange={e=>update(['districtId'],e.target.value)} placeholder="audit-kolar"/></label>
            <label>{t.englishName}<input value={draft.name?.en||''} onChange={e=>update(['name','en'],e.target.value)}/></label><label>{t.kannadaName}<input lang="kn" value={draft.name?.kn||''} onChange={e=>update(['name','kn'],e.target.value)}/></label>
            <label className="wide">Evidence basis / ಸಾಕ್ಷ್ಯ ಆಧಾರ<select value={draft.evidenceBasis||'research-intake'} onChange={e=>update(['evidenceBasis'],e.target.value)}>{['research-intake','contributor-discovery-lead','district-research-scope','archaeological-report','gazetteer','field-record'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">English description<textarea rows="3" value={draft.description?.en||''} onChange={e=>update(['description','en'],e.target.value)}/></label><label className="wide">ಕನ್ನಡ ವಿವರಣೆ<textarea lang="kn" rows="3" value={draft.description?.kn||''} onChange={e=>update(['description','kn'],e.target.value)}/></label>
            <label className="wide">Research note / ಸಂಶೋಧನಾ ಟಿಪ್ಪಣಿ<textarea rows="3" value={draft.researchNote?.en||''} onChange={e=>update(['researchNote','en'],e.target.value)}/></label>
          </> : collection==='collaborations' ? <>
            <label>{t.englishName}<input value={draft.name?.en||''} onChange={e=>update(['name','en'],e.target.value)}/></label><label>{t.kannadaName}<input lang="kn" value={draft.name?.kn||''} onChange={e=>update(['name','kn'],e.target.value)}/></label>
            <label>Entity / ಸಹಯೋಗಿ ಪ್ರಕಾರ<select value={draft.entityKind||'organization'} onChange={e=>update(['entityKind'],e.target.value)}>{['organization','university','individual'].map(value=><option key={value}>{value}</option>)}</select></label><label>Stage / ಹಂತ<select value={draft.stage||'upcoming'} onChange={e=>update(['stage'],e.target.value)}>{['steward','open','upcoming','active','complete'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">Collaboration type / ಸಹಯೋಗದ ಪ್ರಕಾರ<input value={draft.collaborationType||''} onChange={e=>update(['collaborationType'],e.target.value)}/></label><label className="wide">Public URL<input type="url" value={draft.url||''} onChange={e=>update(['url'],e.target.value)}/></label>
            <label className="wide">English scope / contribution<textarea rows="4" value={draft.contribution?.en||''} onChange={e=>update(['contribution','en'],e.target.value)}/></label><label className="wide">ಕನ್ನಡ ವ್ಯಾಪ್ತಿ / ಕೊಡುಗೆ<textarea lang="kn" rows="4" value={draft.contribution?.kn||''} onChange={e=>update(['contribution','kn'],e.target.value)}/></label>
          </> : <>
            <label>{t.englishName}<input value={draft.name?.en||''} onChange={e=>update(['name','en'],e.target.value)}/></label><label>{t.kannadaName}<input lang="kn" value={draft.name?.kn||''} onChange={e=>update(['name','kn'],e.target.value)}/></label>
          </>}
          {collection==='territorialExtents'&&<>
            <label>ವರ್ಗ / Classification<select value={draft.classification||'core-administered'} onChange={e=>update(['classification'],e.target.value)}>{['core-administered','tributary-influence','contested-zone','temporary-occupation','campaign-reach'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ನಿಯಂತ್ರಣ / Control<select value={draft.controlLevel||'direct'} onChange={e=>update(['controlLevel'],e.target.value)}>{['direct','indirect','disputed','temporary','none'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ಅವಧಿ / Duration<select value={draft.duration||'sustained'} onChange={e=>update(['duration'],e.target.value)}>{['sustained','multi-generational','intermittent','brief','episodic'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ವಿಶ್ವಾಸ / Confidence<select value={draft.confidence||'low'} onChange={e=>update(['confidence'],e.target.value)}>{['low','medium','high'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">ಸಂಬಂಧಿತ ರಾಜ್ಯ IDಗಳು / Polity IDs<input value={(draft.polityIds||[]).join(', ')} onChange={e=>update(['polityIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="polity-vijayanagara, external-polity-bahmani"/></label>
            <label>Snapshot ಪ್ರಕಾರ / Kind<select value={draft.snapshotKind||'prototype'} onChange={e=>update(['snapshotKind'],e.target.value)}>{['prototype','reign','regency','political-phase'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>Snapshot ವರ್ಷ / Year<input type="number" value={draft.snapshotYear??''} onChange={e=>update(['snapshotYear'],e.target.value===''?null:Number(e.target.value))}/></label>
            <label className="wide">ಆಳ್ವಿಕೆ ಅವಧಿ ID / Reign or period ID<input value={draft.reignId||''} onChange={e=>update(['reignId'],e.target.value||null)} placeholder="reign-krishnadevaraya-vijayanagara"/></label>
          </>}
          {collection==='reigns'&&<>
            <label>ಅವಧಿ ಪ್ರಕಾರ / Period type<select value={draft.periodType||'reign'} onChange={e=>update(['periodType'],e.target.value)}>{['reign','regency','political-phase'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ರಾಜ್ಯ ID / Polity ID<input value={draft.polityId||''} onChange={e=>update(['polityId'],e.target.value)} placeholder="polity-vijayanagara"/></label>
            <label className="wide">ಆಳ್ವಿಕರ IDಗಳು / Ruler IDs<input value={(draft.rulerIds||[]).join(', ')} onChange={e=>update(['rulerIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="person-krishnadevaraya"/></label>
            <label className="wide">ರಾಜಧಾನಿ IDಗಳು / Capital IDs<input value={(draft.capitalIds||[]).join(', ')} onChange={e=>update(['capitalIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="place-hampi"/></label>
          </>}
          {collection==='culturalHeritage'&&<>
            <label>ವರ್ಗ / Category<select value={draft.category||'architecture'} onChange={e=>update(['category'],e.target.value)}>{['architecture','visual-art','literature','performance','music','celebration','religious-tradition','craft'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ನಿರಂತರತೆ / Continuity<select value={draft.continuity||'unknown'} onChange={e=>update(['continuity'],e.target.value)}>{['historic','continuing-practice','material-survival','revived','unknown'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">ರಾಜ್ಯ IDಗಳು / Polity IDs<input value={(draft.polityIds||[]).join(', ')} onChange={e=>update(['polityIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="polity-hoysala"/></label>
            <label className="wide">ಸ್ಥಳ IDಗಳು / Place IDs<input value={(draft.placeIds||[]).join(', ')} onChange={e=>update(['placeIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="place-belur"/></label>
            <label className="wide">ವ್ಯಕ್ತಿ IDಗಳು / People IDs<input value={(draft.peopleIds||[]).join(', ')} onChange={e=>update(['peopleIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="person-vishnuvardhana"/></label>
            <label className="wide">ಪರಂಪರೆ tags / Tradition tags<input value={(draft.traditionTags||[]).join(', ')} onChange={e=>update(['traditionTags'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="Shaiva, sculpture, ritual"/></label>
          </>}
          {draft.date&&<><label>{t.start}<input type="number" value={draft.date.from??''} onChange={e=>update(['date','from'],e.target.value===''?null:Number(e.target.value))}/></label><label>{t.end}<input type="number" value={draft.date.to??''} onChange={e=>update(['date','to'],e.target.value===''?null:Number(e.target.value))}/></label><label>{t.datePrecision}<select value={draft.date.precision} onChange={e=>update(['date','precision'],e.target.value)}>{['unknown','year','circa','range','century'].map(x=><option key={x}>{x}</option>)}</select></label></>}
          <label>{t.reviewStatus}<select value={draft.review?.status||'draft'} onChange={e=>update(['review','status'],e.target.value)}>{['draft','needs-review','reviewed','published'].map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="wide">{t.reviewer}<input value={draft.review?.reviewer||''} onChange={e=>update(['review','reviewer'],e.target.value||null)} placeholder="Name or stable researcher ID"/></label>
          <label className="wide">{t.json}<textarea rows="14" value={jsonText} onChange={e=>{const value=e.target.value;setJsonText(value);try{setDraft(JSON.parse(value));setNotice('')}catch{setNotice('JSON editor has a syntax error.')}}}/><small>Advanced fields include geometry, citations, external links, descriptions, and entity references.</small></label>
        </div>
        {collection==='sources'&&<section className="admin-source-usage" aria-labelledby="source-usage-title"><h3 id="source-usage-title">{t.sourceUsage}</h3><p>{t.sourceUsageNote}</p>{selectedSourceUses.length?<ul>{selectedSourceUses.map((use,index)=><li key={`${use.collection}-${use.id}-${index}`}><button type="button" onClick={()=>{const record=(data[use.collection]||[]).find(item=>item.id===use.id);if(record){selectCollection(use.collection);selectRecord(record)}}}>{t.collections[use.collection]||use.collection} · {use.title}</button><code>{use.locator||use.path}</code>{use.locator&&<small>{use.path}</small>}</li>)}</ul>:<small>{t.noSourceUsage}</small>}</section>}
        {recordIssues.length>0&&<div className="issue-box"><h3>{t.validation}</h3>{recordIssues.map((issue,index)=><p key={`${issue.path}-${index}`} className={issue.severity}><strong>{issue.severity}</strong> {issue.path}: {issue.message}</p>)}</div>}
        <div className="editor-actions"><button className="primary" onClick={save} disabled={saving||connection!=='ready'}>{saving?'Saving…':t.save}</button><span>{notice}</span></div>
      </section>
    </main>
  </div>
}
