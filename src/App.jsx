import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { divIcon } from 'leaflet'
import { CircleMarker, GeoJSON, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { atlasData } from './data/atlas'
import { patrikaMapSites } from './data/patrika-sanchaya.generated.js'
import { getInitialLocale, messages, setStoredLocale } from './i18n'
import SourceLink from './SourceLink'
import ProvenanceBadge from './ProvenanceBadge'
import { buildSourceTiers, recordAuthorityCited } from './data/source-provenance'
import GuidedTour from './GuidedTour'
import { isIndiaPoint, isKarnatakaPoint, mapZoomForPoint, mapZoomForPositions } from './map-focus'
import { readAtlasUrlState, updateAtlasUrlState } from './share-state'
import { inscriptionsForMap } from './map-record-visibility'
import { eventsForPrimaryAtlas, inscriptionsForPrimaryAtlas } from './timeline-record-visibility'
import { isTempleRecord, objectIcon, objectKindFor, timelineCategoryForCulture } from './object-icons'

const Admin=lazy(()=>import('./Admin'))
const Community=lazy(()=>import('./Community'))
const LiteratureEpigraphyExplorer=lazy(()=>import('./LiteratureEpigraphyExplorer'))
const GlobalRelationsExplorer=lazy(()=>import('./GlobalRelationsExplorer'))
const ResourcesCollaborations=lazy(()=>import('./ResourcesCollaborations'))
const EvidenceWorkflow=lazy(()=>import('./EvidenceWorkflow'))
const DistrictHistoryExplorer=lazy(()=>import('./DistrictHistoryExplorer'))
const PeopleExplorer=lazy(()=>import('./PeopleExplorer'))
const FreedomMovementExplorer=lazy(()=>import('./FreedomMovementExplorer'))
const About=lazy(()=>import('./About'))
const TrailExplorer=lazy(()=>import('./TrailExplorer'))
const PortalFallback=()=> <main className="portal-page" aria-busy="true"><p>…</p></main>
const socialLinks=[
  ['YouTube',import.meta.env.VITE_SOCIAL_YOUTUBE_URL],
  ['Instagram',import.meta.env.VITE_SOCIAL_INSTAGRAM_URL],
  ['Facebook',import.meta.env.VITE_SOCIAL_FACEBOOK_URL],
  ['X',import.meta.env.VITE_SOCIAL_X_URL],
  ['LinkedIn',import.meta.env.VITE_SOCIAL_LINKEDIN_URL],
].filter(([,url])=>url)

function PwaControls({locale,t}){
  const [installPrompt,setInstallPrompt]=useState(null)
  const [offline,setOffline]=useState(()=>typeof navigator!=='undefined'&&!navigator.onLine)
  const [offlineReady,setOfflineReady]=useState(false)
  useEffect(()=>{
    const onBeforeInstall=event=>{event.preventDefault();setInstallPrompt(event)}
    const onOnline=()=>setOffline(false)
    const onOffline=()=>setOffline(true)
    window.addEventListener('beforeinstallprompt',onBeforeInstall)
    window.addEventListener('online',onOnline)
    window.addEventListener('offline',onOffline)
    if ('serviceWorker' in navigator) navigator.serviceWorker.ready.then(()=>setOfflineReady(true)).catch(()=>{})
    return()=>{window.removeEventListener('beforeinstallprompt',onBeforeInstall);window.removeEventListener('online',onOnline);window.removeEventListener('offline',onOffline)}
  },[])
  const install=async()=>{if(!installPrompt)return;await installPrompt.prompt();setInstallPrompt(null)}
  return <div className="pwa-controls">{offline&&<span className="pwa-status offline" role="status">{t.offlineMode}</span>}{!offline&&offlineReady&&<span className="pwa-status" role="status">{t.offlineReady}</span>}{installPrompt&&<button className="pwa-install" onClick={install}>{t.installApp}</button>}</div>
}

const MIN_YEAR=-300
const MAX_YEAR=1973
const placeById=new Map(atlasData.places.map(place=>[place.id,place]))
const primaryPolityIds=new Set(atlasData.polities.map(polity=>polity.id))
const entityById=new Map([...atlasData.polities,...atlasData.externalPolities].map(entity=>[entity.id,entity]))
const personById=new Map(atlasData.people.map(person=>[person.id,person]))
const candidateById=new Map([...(atlasData.peopleCandidates||[]),...(atlasData.martyrCandidates||[])].map(person=>[person.id,person]))
const sourceById=new Map(atlasData.sources.map(source=>[source.id,source]))
const sourceTiers=buildSourceTiers(atlasData)
const reignById=new Map(atlasData.reigns.map(period=>[period.id,period]))
const primary=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const secondary=(value,locale)=>value?.[locale==='kn'?'en':'kn']||''
const chronologicalYear=date=>date?.era==='BCE'?-Number(date.from):Number(date?.from)
const normalizeTimelineYear=value=>value===0?1:value
const timelineYearLabel=(year,locale)=>`${Math.abs(year)} ${year<0?(locale==='kn'?'ಕ್ರಿ.ಪೂ.':'BCE'):(locale==='kn'?'ಕ್ರಿ.ಶ.':'CE')}`
const eventColors={battle:'#a83e32',war:'#a83e32',invasion:'#703e82',campaign:'#bf742f','diplomatic-mission':'#4361ee','trade-contact':'#16867a','cultural-contact':'#8b5aa5',inscription:'#9a6b24','kingdom-foundation':'#26735f','regime-change':'#5b647a','capital-relocation':'#16867a',accession:'#2c6390','constitutional-transition':'#2c6390','state-reorganisation':'#2c6390'}
const connectionColors={trade:'#16867a','trade-diplomacy':'#257d9a',diplomacy:'#4361ee','knowledge-diplomacy':'#8b5aa5',military:'#a83e32',other:'#6a7180'}
const connectionCategory=event=>{const kind=event.reach?.relationKind;if(['merchant-guild-presence','overseas-commerce'].includes(kind))return'trade';if(kind==='diplomacy-and-commerce')return'trade-diplomacy';if(kind==='diplomacy')return'diplomacy';if(kind==='diplomatic-visit-and-travel-account')return'knowledge-diplomacy';if(['battle','war','invasion','campaign'].includes(event.type))return'military';return'other'}
const connectionDash={trade:'4 7','trade-diplomacy':'9 5',diplomacy:'3 6','knowledge-diplomacy':'11 5 2 5',military:'8 7',other:'6 6'}
const eventYearLabel=(event,locale)=>`${event.date.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${event.year}`
const evidenceDateLabel=(date,locale)=>date.precision==='century'?`${date.from}${locale==='kn'?'ನೇ ಶತಮಾನ':'th century'} ${date.era}`:`${date.from}${date.to!==date.from?`–${date.to}`:''} ${date.era}`
const cultureColors={architecture:'#7a4aa5','visual-art':'#c05c78',literature:'#355fa8',performance:'#dc7a28',music:'#16867a',celebration:'#d09222','religious-tradition':'#9a4f35',craft:'#537a42','games-sports':'#1c8b8b'}
const personRoleColors={queen:'#a43d72',patron:'#a43d72','community-hero':'#a83e32',defender:'#a83e32','resistance-leader':'#a83e32','resistance-fighter':'#a83e32','community-leader':'#b06a1f',artisan:'#537a42',washerman:'#537a42',boatman:'#16867a','vachana-poet':'#8b5aa5','religious-figure':'#8b5aa5',explorer:'#16867a',traveller:'#16867a',scholar:'#355fa8',administrator:'#657084','military-leader':'#703e82',soldier:'#703e82',lieutenant:'#703e82',ruler:'#315f91','foreign-monarch':'#315f91'}
const personRoleLabels={queen:{en:'Queen',kn:'ರಾಣಿ'},patron:{en:'Patron',kn:'ಆಶ್ರಯದಾತೆ'},'community-hero':{en:'Community hero',kn:'ಜನಸಮುದಾಯದ ವೀರ ವ್ಯಕ್ತಿ'},defender:{en:'Defender',kn:'ರಕ್ಷಕಿ'},'resistance-leader':{en:'Resistance leader',kn:'ಪ್ರತಿರೋಧ ನಾಯಕಿ'},'resistance-fighter':{en:'Resistance fighter',kn:'ಪ್ರತಿರೋಧ ಹೋರಾಟಗಾರ'},'community-leader':{en:'Community leader',kn:'ಜನನಾಯಕ'},artisan:{en:'Artisan',kn:'ಕಾಯಕಜೀವಿ'},washerman:{en:'Washerman',kn:'ಮಡಿವಾಳ'},boatman:{en:'Boatman',kn:'ಅಂಬಿಗ'},'vachana-poet':{en:'Vachana poet',kn:'ವಚನಕಾರ'},'religious-figure':{en:'Religious figure',kn:'ಧಾರ್ಮಿಕ ವ್ಯಕ್ತಿ'},explorer:{en:'Explorer / traveller',kn:'ಅನ್ವೇಷಕ / ಪ್ರವಾಸಿಗ'},traveller:{en:'Traveller',kn:'ಪ್ರವಾಸಿಗ'},scholar:{en:'Scholar',kn:'ವಿದ್ವಾಂಸ'},administrator:{en:'Administrator',kn:'ಆಡಳಿತಗಾರ'},'military-leader':{en:'Military leader',kn:'ಸೇನಾನಾಯಕ'},soldier:{en:'Soldier',kn:'ಸೈನಿಕ'},lieutenant:{en:'Lieutenant',kn:'ಸೇನಾಧಿಕಾರಿ'},ruler:{en:'Ruler',kn:'ಅರಸು'},'foreign-monarch':{en:'Foreign monarch',kn:'ವಿದೇಶಿ ರಾಜ'}}
const personRoleLabel=(role,locale)=>personRoleLabels[role]?.[locale]||role.replaceAll('-',' ')
const personColorFor=person=>(person.roles||[]).map(role=>personRoleColors[role]).find(Boolean)||'#b26a22'
const reviewedStatuses=new Set(['reviewed','verified','published'])
const needsHumanReview=value=>!reviewedStatuses.has(typeof value==='string'?value:value?.status)
const categoryMarkerIcon=(record,{pending=false,selected=false,color='#5361c9'}={})=>{const kind=objectKindFor(record);const size=selected?34:28;return divIcon({className:'atlas-object-marker-shell',html:`<span class="atlas-object-marker ${kind}${pending?' pending':''}${selected?' selected':''}" style="--marker-color:${color}" aria-hidden="true"><b>${objectIcon(kind)}</b></span>`,iconSize:[size,size],iconAnchor:[size/2,size/2],popupAnchor:[0,-size/2]})}
const reviewClusterIcon=count=>divIcon({className:'review-cluster-shell',html:`<span class="review-cluster-marker" aria-hidden="true"><b>${count}</b></span>`,iconSize:[34,34],iconAnchor:[17,17],popupAnchor:[0,-17]})
const territoryColors={'core-administered':'#4361ee','tributary-influence':'#7357a6','contested-zone':'#d28b27','temporary-occupation':'#bd4a45','campaign-reach':'#2e7d70'}
const territoryStyles={
  'core-administered':{fillOpacity:.18,weight:1.5,dashArray:null},
  'tributary-influence':{fillOpacity:.1,weight:2,dashArray:'10 7'},
  'contested-zone':{fillOpacity:.2,weight:2.5,dashArray:'5 5'},
  'temporary-occupation':{fillOpacity:.16,weight:2,dashArray:'3 6'},
  'campaign-reach':{fillOpacity:0,weight:3,dashArray:'9 7'}
}
const comparisonPresets=[
  {key:'badamiComparison',from:618,to:655},
  {key:'rashtrakutaComparison',from:753,to:850},
  {key:'hoysalaComparison',from:1187,to:1311},
  {key:'talikotaComparison',from:1520,to:1570},
  {key:'mysoreComparison',from:1787,to:1800}
]
const seoPages={
  atlas:{kn:['ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಕಾಲರೇಖೆ, ರಾಜ್ಯಗಳು, ರಾಜರು, ಯುದ್ಧಗಳು, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ವಿಸ್ತರಣೆಯ ಕನ್ನಡ-ಪ್ರಥಮ ಸಂಶೋಧನಾ ಭೂಪಟ.'],en:['Karnataka Historical Atlas','Explore Karnataka kingdoms, rulers, wars, culture and territorial change through a citation-led historical timeline and map.']},
  relations:{kn:['ಜಾಗತಿಕ ಸಂಬಂಧಗಳು · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಕರ್ನಾಟಕದ ರಾಜಕೀಯ, ವ್ಯಾಪಾರ, ರಾಜತಾಂತ್ರಿಕ ಮತ್ತು ಜ್ಞಾನ ಸಂಬಂಧಗಳನ್ನು ಭಾರತ ಮತ್ತು ವಿಶ್ವದೊಂದಿಗೆ ಅನ್ವೇಷಿಸಿ.'],en:['Global Relations · Karnataka Historical Atlas','Explore Karnataka’s political, commercial, diplomatic and knowledge connections across India and the world.']},
  literature:{kn:['ಕನ್ನಡ ಸಾಹಿತ್ಯ ಅನ್ವೇಷಣೆ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಕನ್ನಡ ಲೇಖಕರು, ಕವಿಗಳು, ಕೃತಿಗಳು, ಆಸ್ಥಾನಗಳು ಮತ್ತು ಅವುಗಳ ಕಾಲರೇಖೆಗಳನ್ನು ಸಂಶೋಧಿಸಿ.'],en:['Kannada Literature Explorer · Karnataka Historical Atlas','Research Kannada authors, poets, works, courts and their historical timelines.']},
  epigraphy:{kn:['ಕರ್ನಾಟಕ ಶಾಸನ ಅನ್ವೇಷಣೆ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಕರ್ನಾಟಕದ ಶಾಸನಗಳು, ಲಿಪಿಗಳು, ಭಾಷೆಗಳು, ಪಠ್ಯಗಳು, ಅನುವಾದ ಮತ್ತು ಪರಿಶೀಲನಾ ಸ್ಥಿತಿಯನ್ನು ಅನ್ವೇಷಿಸಿ.'],en:['Karnataka Epigraphy Explorer · Karnataka Historical Atlas','Explore Karnataka inscriptions, scripts, languages, editions, translations and review status.']},
  people:{kn:['ವ್ಯಕ್ತಿಗಳ ಅನ್ವೇಷಣೆ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಅರಸರು, ರಾಣಿಯರು, ಕವಿಗಳು, ವಿದ್ವಾಂಸರು, ಯೋಧರು, ಕಾಯಕಜೀವಿಗಳು ಮತ್ತು ಜನಸಮುದಾಯದ ಪ್ರಮುಖ ವ್ಯಕ್ತಿಗಳನ್ನು ಕಾಲ ಮತ್ತು ಸ್ಥಳದೊಂದಿಗೆ ಅನ್ವೇಷಿಸಿ.'],en:['People Explorer · Karnataka Historical Atlas','Explore rulers, queens, poets, scholars, soldiers, working people and community figures through time and place.']},
  freedom:{kn:['ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರು, ಘಟನೆಗಳು, ಬಂಧನ, ಸೆರೆವಾಸ, ಪ್ರತಿರೋಧ, ಹುತಾತ್ಮತೆ ಮತ್ತು ಜಿಲ್ಲಾವಾರು ಸಾಕ್ಷ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.'],en:["Karnataka's Freedom Movement · Karnataka Historical Atlas",'Explore Karnataka freedom fighters, events, arrests, imprisonment, resistance, martyrdom and district evidence.']},
  districts:{kn:['ಜಿಲ್ಲಾ ಪರಂಪರೆ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಕರ್ನಾಟಕದ ಜಿಲ್ಲಾವಾರು ದೇವಾಲಯ, ಬಸದಿ, ದರ್ಗಾ, ಚರ್ಚ್, ಮಠ, ಕೋಟೆ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪದ ದಾಖಲೆಗಳು.'],en:['District Heritage · Karnataka Historical Atlas','District-level records of Karnataka temples, basadis, dargahs, churches, monasteries, forts and architecture.']},
  'district-history':{kn:['ಜಿಲ್ಲಾ ಸಮಗ್ರ ಇತಿಹಾಸ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಪೂರ್ವೈತಿಹಾಸಿಕ ತಾಣಗಳು, ವಸತಿ ಮೂಲಗಳು, ಸ್ಥಾಪನಾ ಶಿಲೆಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಇತಿಹಾಸದ ಸಂಶೋಧನಾ ಅಭ್ಯರ್ಥಿಗಳು.'],en:['District Deep History · Karnataka Historical Atlas','Research leads for prehistoric places, settlement origins, foundation stones and locality histories across Karnataka.']},
  inscriptions:{kn:['ಜಿಲ್ಲಾ ಶಾಸನ ಪರಿಶೀಲನೆ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಜಿಲ್ಲಾವಾರು ಶಾಸನ ಅಭ್ಯರ್ಥಿಗಳು, ಸಂಪುಟ ಸ್ಥಾನಸೂಚಿಗಳು ಮತ್ತು ಸಾಕ್ಷ್ಯ ಪರಿಶೀಲನಾ ಪ್ರಗತಿ.'],en:['District Inscription Audits · Karnataka Historical Atlas','District inscription candidates, corpus locators and evidence-verification progress.']},
  research:{kn:['ಆಕರಗಳು ಮತ್ತು ಸಹಯೋಗಗಳು · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಆಕರ ಪಟ್ಟಿ, BibTeX ಮತ್ತು RIS ಉಲ್ಲೇಖ ಸಾಧನಗಳು, ಸಂಶೋಧನಾ ವಿಧಾನ ಮತ್ತು ಸಹಯೋಗ ಅವಕಾಶಗಳು.'],en:['Resources and Collaborations · Karnataka Historical Atlas','Reference catalogue, BibTeX and RIS citation tools, research method and collaboration opportunities.']},
  community:{kn:['ಕೊಡುಗೆ ನೀಡಿ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಉಲ್ಲೇಖಗಳೊಂದಿಗೆ ಐತಿಹಾಸಿಕ ಜ್ಞಾನ, ತಿದ್ದುಪಡಿ ಮತ್ತು ಅನುವಾದಗಳನ್ನು ಸಮುದಾಯ ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ.'],en:['Contribute · Karnataka Historical Atlas','Submit cited historical knowledge, corrections and translations for moderated community review.']},
  profile:{kn:['ನನ್ನ ಪ್ರೊಫೈಲ್ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ನಿಮ್ಮ ಸಂಶೋಧನಾ ಗುರುತು, ಸಂಸ್ಥೆ, ಕೊಡುಗೆಗಳು ಮತ್ತು ಪರಿಶೀಲನಾ ಪ್ರಮಾಣಪತ್ರವನ್ನು ನಿರ್ವಹಿಸಿ.'],en:['My profile · Karnataka Historical Atlas','Manage your research identity, affiliation, contributions and certificates.']},
  evidence:{kn:['ಮಾನವ ಸಾಕ್ಷ್ಯ ಕಾರ್ಯವಿಧಾನ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಶಾಸನ ಅಭ್ಯರ್ಥಿಗಳ ಕ್ಷೇತ್ರಕಾರ್ಯ, ಪಠ್ಯ ಪರಿಶೀಲನೆ, ಅನುವಾದ ವಿಮರ್ಶೆ ಮತ್ತು ಪ್ರಕಟಣೆ ಸಿದ್ಧತೆಯ ಕಾರ್ಯಪಟ್ಟಿ.'],en:['Human Evidence Workflow · Karnataka Historical Atlas','Track fieldwork, transcription, translation review and publication readiness for inscription candidates.']},
  about:{kn:['ನಮ್ಮ ಬಗ್ಗೆ · ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ','ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟದ ಉದ್ದೇಶ, ಸಂಶೋಧನಾ ವಿಧಾನ, ಕನ್ನಡ-ಪ್ರಥಮ ವಿನ್ಯಾಸ ಮತ್ತು ಸಮುದಾಯ ಸಹಯೋಗವನ್ನು ತಿಳಿಯಿರಿ.'],en:['About · Karnataka Historical Atlas','Learn about the atlas purpose, research method, Kannada-first design and community collaboration.']},
}

const tourStep=(target,kn,en)=>({target,title:{kn,en},body:{kn:kn.replace(/^[^·]+·\s*/,''),en}})
const guidedTourSteps=(view,locale,loggedIn=false)=>{
  const steps={
    atlas:[
      tourStep('#primary-navigation','ಮುಖ್ಯ ವಿಭಾಗಗಳು · ಪುಟಗಳನ್ನು ಬದಲಿಸಿ','Use the main navigation to move between the atlas, relations, literature, epigraphy and research workspaces.'),
      tourStep('.sidebar','ಹುಡುಕಾಟ ಮತ್ತು ನಕ್ಷೆ ಪದರಗಳು · ದಾಖಲೆ, ಜಿಲ್ಲೆ ಅಥವಾ ರಾಜ್ಯವನ್ನು ಹುಡುಕಿ','Search records and switch the visible map layers, review marks and heritage filters.'),
      tourStep('.map-stage','ಸಂವಾದಾತ್ಮಕ ಭೂಪಟ · ಗುರುತನ್ನು ಆಯ್ಕೆಮಾಡಿ','Select a marker, route or territory to open its historical detail without leaving the map.'),
      tourStep('.timeline-panel','ಕಾಲರೇಖೆ · ವರ್ಷ ಬದಲಿಸಿ','Move through the timeline, compare periods and use the BCE range for early research leads.'),
      tourStep('.event-rail','ಘಟನೆಗಳ ಸರಣಿ · ಕಥೆಯನ್ನು ತೆರೆಯಿರಿ','Filter wars, relations, people, literature, inscriptions and culture, then select a story.'),
    ],
    relations:[
      tourStep('.relations-matrix','ಸಂಬಂಧಗಳ ಮ್ಯಾಟ್ರಿಕ್ಸ್ · ದಿಕ್ಕುಗಳ ವ್ಯಾಪ್ತಿ ನೋಡಿ','Start with the north, south, east, west, China and wider India coverage matrix.'),
      tourStep('.relations-filters','ಹುಡುಕಾಟ ಮತ್ತು ಶೋಧಕಗಳು · ಸಂಬಂಧವನ್ನು ಕಿರಿದುಗೊಳಿಸಿ','Filter by corridor, relation type, territorial control, polity and century.'),
      tourStep('.relations-map','ಸಂಬಂಧಗಳ ಭೂಪಟ · ಮಾರ್ಗ ಅಥವಾ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ','Click a route, battle location or territory. Dashed marks identify records awaiting review.'),
      tourStep('.relations-detail','ಸಾಕ್ಷ್ಯ ವಿವರ · ಜನರು ಮತ್ತು ಆಕರಗಳನ್ನು ಓದಿ','The detail panel connects each relation to people, outcomes and record-level citations.'),
    ],
    literature:[
      tourStep('.explorer-map','ಸಾಹಿತ್ಯ ಭೂಪಟ · ಆಸ್ಥಾನಗಳನ್ನು ನೋಡಿ','Works are anchored to associated court capitals and can be opened directly from the map.'),
      tourStep('.explorer-toolbar','ಸಾಹಿತ್ಯ ಶೋಧಕಗಳು · ಕೃತಿ ಅಥವಾ ಲೇಖಕರನ್ನು ಹುಡುಕಿ','Search by title, author, century, polity, language and review status.'),
      tourStep('.explorer-grid','ಕೃತಿ ಪಟ್ಟಿ · ಪರಿಶೀಲನಾ ಪ್ರಗತಿ ನೋಡಿ','Open a work card to read its date, creator, sources and evidence gates.'),
      tourStep('.explorer-layout','ಕೃತಿ ವಿವರ · ಸಂಶೋಧನಾ ಸಾಕ್ಷ್ಯ ಪರಿಶೀಲಿಸಿ','Open a work card to reveal its detail panel, related works, citations and review workflow.'),
    ],
    epigraphy:[
      tourStep('.explorer-focus','ಬೆಂಗಳೂರು ಮತ್ತು ಕರ್ನಾಟಕ · ವಿಶೇಷ ಸಂಗ್ರಹ ಆಯ್ಕೆಮಾಡಿ','Switch between all Karnataka inscriptions, Bengaluru city records and hero-stone collections.'),
      tourStep('.explorer-map','ಶಾಸನ ಭೂಪಟ · ಗುರುತನ್ನು ಆಯ್ಕೆಮಾಡಿ','Solid markers are mapped records; dashed markers remain visible as research candidates.'),
      tourStep('.explorer-toolbar','ಶಾಸನ ಶೋಧಕಗಳು · ವರ್ಗ ಮತ್ತು ಸ್ಥಿತಿ ನೋಡಿ','Filter by district, script, language, classification, evidence type and review state.'),
      tourStep('.explorer-grid','ಶಾಸನ ಪಟ್ಟಿ · ದಾಖಲೆ ತೆರೆಯಿರಿ','Use the lazy-loaded list to explore corpus locators, coordinates and candidate records.'),
      tourStep('.explorer-layout','ಶಾಸನ ವಿವರ · ಪಠ್ಯ ಮತ್ತು ಅನುವಾದ ಪರಿಶೀಲಿಸಿ','Open a record card to reveal editions, transcription, translation, condition, protection and citations.'),
    ],
    freedom:[
      tourStep('.freedom-filters','ಹುಡುಕಾಟ ಮತ್ತು ಶೋಧಕಗಳು · ವ್ಯಕ್ತಿ, ಜಿಲ್ಲೆ ಅಥವಾ ಘಟನೆ ಆಯ್ಕೆಮಾಡಿ','Search and filter freedom-movement records by person, district, action and review state.'),
      tourStep('.freedom-map','ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಭೂಪಟ · ಸ್ಥಳ ಸುಳಿವನ್ನು ಆಯ್ಕೆಮಾಡಿ','Select a map point to connect a freedom fighter, event window and source locator.'),
      tourStep('.freedom-list','ಹೋರಾಟಗಾರರ ಪಟ್ಟಿ · ಪರಿಶೀಲನಾ ದಾಖಲೆಯನ್ನು ತೆರೆಯಿರಿ','Browse all freedom fighters and open a record to inspect its source, review state and evidence still required; arrow keys also traverse the list.'),
    ],
    people:[
      tourStep('.people-filters','ವ್ಯಕ್ತಿ ಶೋಧಕಗಳು · ಹೆಸರು, ಪಾತ್ರ ಮತ್ತು ಕಾಲ ಆಯ್ಕೆಮಾಡಿ','Search by bilingual name and filter people by role, polity, century, district, gender record and review status.'),
      tourStep('.people-map','ವ್ಯಕ್ತಿಗಳ ಭೂಪಟ · ಸಂಬಂಧಿತ ಸ್ಥಳ ನೋಡಿ','Select a person marker to connect the profile with an associated event, work, court or historical relation.'),
      tourStep('.people-directory','ವ್ಯಕ್ತಿಗಳ ಪಟ್ಟಿ · ಎಲ್ಲ ಸಾಮಾಜಿಕ ಪಾತ್ರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ','Browse rulers and queens alongside poets, soldiers, artisans, travellers and community figures.'),
      tourStep('.people-timeline','ವ್ಯಕ್ತಿಗಳ ಕಾಲರೇಖೆ · ಕೀಲಿಮಣೆ ಅಥವಾ ಕ್ಲಿಕ್ ಬಳಸಿ','Use arrow keys or click a dated profile to traverse people across historical periods.'),
    ],
    districts:[
      tourStep('.audit-map','ಜಿಲ್ಲಾ ಪರಂಪರೆ ಭೂಪಟ · ತಾಣಗಳನ್ನು ನೋಡಿ','Explore district boundaries and mapped temples, basadis, forts, churches, dargahs and other heritage.'),
      tourStep('.audit-filters','ಪರಂಪರೆ ಶೋಧಕಗಳು · ವರ್ಗ ಮತ್ತು ಪ್ರಾಧಿಕಾರ ಆಯ್ಕೆಮಾಡಿ','Filter sites by heritage category, UNESCO, ASI, State Archaeology or research status.'),
      tourStep('.audit-grid','ಜಿಲ್ಲಾ ದಾಖಲೆಗಳು · ಸಾಕ್ಷ್ಯ ತೆರೆಯಿರಿ','Open a district card and expand a site to review coordinates, phases, authority, condition and photographs.'),
    ],
    'district-history':[
      tourStep('.district-history-filters','ಜಿಲ್ಲಾ ಇತಿಹಾಸ ಶೋಧಕಗಳು · ಸುಳಿವು ಹುಡುಕಿ','Search locality histories and filter prehistoric, settlement, foundation-stone and memory leads.'),
      tourStep('.district-history-map-wrap','ಜಿಲ್ಲಾ ಇತಿಹಾಸ ಭೂಪಟ · ಸಂಶೋಧನಾ ಸುಳಿವು ತೆರೆಯಿರಿ','Orange dashed markers are research leads and are deliberately marked as needing review.'),
      tourStep('.district-history-detail','ಸಂಶೋಧನಾ ವಿವರ · ಆಕರದ ಸ್ಥಿತಿ ಓದಿ','Review the note, evidence basis and citations before treating a lead as established history.'),
      tourStep('.district-history-list','ಜಿಲ್ಲಾ ಪಟ್ಟಿ · ಎಲ್ಲ ಅಭ್ಯರ್ಥಿಗಳನ್ನು ನೋಡಿ','Use the card list when a marker is crowded or when you want to compare districts.'),
    ],
    inscriptions:[
      tourStep('.audit-map-inscriptions','ಶಾಸನ ಭೂಪಟ · ಜಿಲ್ಲಾವಾರು ಗುರುತುಗಳನ್ನು ನೋಡಿ','The map separates mapped inscriptions from dashed candidates awaiting human review.'),
      tourStep('.inscription-audit-filters','ಜಿಲ್ಲಾ ಶೋಧಕಗಳು · ಪರಿಶೀಲನಾ ಪಾಸ್ ಆಯ್ಕೆಮಾಡಿ','Switch between seeded, candidate-identified and unassessed district batches.'),
      tourStep('.inscription-audit-grid','ಜಿಲ್ಲಾ ಶಾಸನ ಪಟ್ಟಿ · ಅಭ್ಯರ್ಥಿ ವಿವರ ತೆರೆಯಿರಿ','Open a district record to follow its corpus references, notes and candidate locations.'),
    ],
    trails:[
      tourStep('.trail-grid','ಕಥಾಮಾರ್ಗಗಳು · ನಿರೂಪಣೆ ಆರಿಸಿ','Choose a curation-backed trail that walks Karnataka\u2019s history step by step.'),
      tourStep('.trail-progress','ಹಂತಗಳ ಪ್ರಗತಿ · ಕಥೆಯಲ್ಲಿ ಚಲಿಸಿ','Jump between stops or read forward; every stop is rooted in the evidence ledger.'),
      tourStep('.trail-narrative','ನಿರೂಪಣೆ ಮತ್ತು ಸಾಕ್ಷ್ಯ · ಆಕರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ','Read the narrative, then open the citations and provenance behind each stop.'),
    ],
    evidence:[
      tourStep('.evidence-procedure','ಪರಿಶೀಲನಾ ವಿಧಾನ · ಕೆಲಸದ ಕ್ರಮ ತಿಳಿಯಿರಿ','Follow the evidence gates from assignment to transcription, translation, review and publication.'),
      tourStep('.evidence-promotion-sprint','v0.23 ಪ್ರಚಾರ ಹಂತ · ಏಳು ಆದ್ಯತೆಯ ದಾಖಲೆಗಳನ್ನು ನೋಡಿ','Compare all seven publication gates for the records closest to promotion, then open only their outstanding tasks.'),
      tourStep('.evidence-toolbar','ಕಾರ್ಯ ಶೋಧಕಗಳು · ನಿಮ್ಮ ಪಾಸ್ ಆಯ್ಕೆಮಾಡಿ','Filter the queue by domain, field, state and priority.'),
      tourStep('.evidence-board','ಪರಿಶೀಲನಾ ಫಲಕ · ಬಾಕಿ ಕೆಲಸ ನಿರ್ವಹಿಸಿ','Each column is a human-review state. Load more items as you work through the queue.'),
    ],
    research:[
      tourStep('.resources-hero','ಆಕರಗಳು ಮತ್ತು ಸಹಯೋಗ · ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ','Switch between the reference catalogue, collaborations and research method.'),
      tourStep('.reference-tools','ಆಕರ ಶೋಧಕಗಳು · ಮೂಲ ಹುಡುಕಿ','Search by title, author, institution, type or review status.'),
      tourStep('.reference-list','ಉಲ್ಲೇಖಿಸಬಹುದಾದ ಮೂಲಗಳು · citation tools ಬಳಸಿ','Open a source and copy a citation or download BibTeX, RIS or CSL-JSON.'),
      tourStep('.resource-tabs','ಸಹಯೋಗ ಸ್ಥಳ · ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ','Use the Collaborations tab to browse acknowledged stewards and open opportunities; proposals are handled through the community workflow.'),
    ],
    community:[
      tourStep('.community-hero','ಸಮುದಾಯ ಪ್ರವೇಶ · ನೋಂದಣಿ ಅಥವಾ ಲಾಗಿನ್ ಮಾಡಿ','Create a research identity with your affiliation and profession, or sign in to continue.'),
      ...(loggedIn?[tourStep('.community-user','ನಿಮ್ಮ ಗುರುತು · karma ಮತ್ತು ಸ್ಥಿತಿ ನೋಡಿ','Your account status, affiliation, reviewer role and karma are shown here.')]:[]),
      ...(loggedIn?[tourStep('.community-workspace-tabs','ಕಾರ್ಯಸ್ಥಳ ಟ್ಯಾಬ್‌ಗಳು · ಕೊಡುಗೆ ಅಥವಾ ವಿಮರ್ಶೆ ಆಯ್ಕೆಮಾಡಿ','Approved contributors can submit records; reviewers see translation and evidence queues.')]:[]),
      ...(loggedIn?[tourStep('.community-workspace-tabs','ಕೊಡುಗೆ ಕಾರ್ಯಸ್ಥಳ · citation ಜೊತೆಗೆ ಸಲ್ಲಿಸಿ','Choose the workspace tab to add a proposed record, upload verification when needed and follow your contribution status.')]:[]),
    ],
    profile:[
      tourStep('.community-user','ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ · ಗುರುತು ಮತ್ತು karma ನೋಡಿ','Review your approved status, affiliation, roles and accumulated karma.'),
      tourStep('.profile-tabs','ಪ್ರೊಫೈಲ್ ಟ್ಯಾಬ್‌ಗಳು · ಮಾಹಿತಿ ನಿರ್ವಹಿಸಿ','Use overview, edit profile and activity tabs to keep your research identity current.'),
      tourStep('.profile-summary','ಸಾರಾಂಶ · ಪರಿಶೀಲಿತ ಮಾಹಿತಿಯನ್ನು ನೋಡಿ','Your public research identity is shown here after sign-in.'),
      tourStep('.profile-workspace','ಚಟುವಟಿಕೆ · ಕೊಡುಗೆಗಳ ಪ್ರಗತಿ ಅನುಸರಿಸಿ','Open the activity tab to track submitted corrections, reviews, points and certificates.'),
    ],
    about:[
      tourStep('.about-hero','ನಮ್ಮ ಬಗ್ಗೆ · ವೇದಿಕೆಯ ಉದ್ದೇಶ ತಿಳಿಯಿರಿ','Understand the atlas purpose, Kannada-first approach and public research model.'),
      tourStep('.about-grid','ವಿಧಾನ ಮತ್ತು ನಿರ್ವಹಣೆ · ಸಂಶೋಧನಾ ಕ್ರಮ ನೋಡಿ','Review the evidence method, language policy, stewardship and collaboration model.'),
      tourStep('.about-actions','ಮುಂದಿನ ಹೆಜ್ಜೆ · ಕೊಡುಗೆ ಅಥವಾ ಸಂಶೋಧನೆಗೆ ಹೋಗಿ','Open contribution, resources or the evidence workflow directly from this page.'),
    ],
  }
  return steps[view] || steps.atlas
}

const primaryKingdoms=atlasData.polities.map(polity=>({
  ...polity,start:polity.date.from,end:polity.date.to,
  capitalName:placeById.get(polity.capitalId)?.name||{en:'Unknown',kn:''},
  polygon:polity.extent.coordinates.map(([lng,lat])=>[lat,lng]),
  rulers:atlasData.people.filter(person=>person.polityId===polity.id&&person.roles.includes('ruler')),
  rulerNames:atlasData.people.filter(person=>person.polityId===polity.id).map(person=>person.name),
  literature:atlasData.works.filter(work=>work.polityId===polity.id)
}))
const externallyGovernedPhases=atlasData.externalGovernancePhases.map(phase=>({
  ...phase,start:phase.date.from,end:phase.date.to,capitalId:null,
  polygon:phase.geography.geometry.coordinates.map(([lng,lat])=>[lat,lng]),
  extent:phase.geography.geometry,
  rulers:atlasData.people.filter(person=>person.polityId===phase.governingPolityId&&person.roles.includes('ruler')),
  rulerNames:atlasData.people.filter(person=>person.polityId===phase.governingPolityId).map(person=>person.name),literature:[],
}))
const kingdoms=[...primaryKingdoms,...externallyGovernedPhases]
const inscriptions=atlasData.inscriptions.map(item=>{const place=placeById.get(item.placeId);const [lng,lat]=place?.location.coordinates||[0,0];return {...item,year:item.date.from,placeName:place?.name||{en:'Unknown',kn:''},polity:entityById.get(item.polityId),coords:[lat,lng],source:sourceById.get(item.citations?.[0]?.sourceId)}})
const primaryAtlasInscriptions=inscriptionsForPrimaryAtlas(inscriptions)
const inscriptionById=new Map(inscriptions.map(item=>[item.id,item]))
const inscriptionCandidates=atlasData.inscriptionAudits.flatMap(audit=>(audit.priorityCandidates||[]).map(candidate=>({...candidate,district:audit.district,auditId:audit.id})))
const bceResearchStories=inscriptionCandidates.filter(candidate=>candidate.date?.era==='BCE'&&Number.isFinite(candidate.date.from)).map(candidate=>{const latitude=candidate.resolution?.coordinates?.latitude;const longitude=candidate.resolution?.coordinates?.longitude;return {...candidate,year:chronologicalYear(candidate.date),storyKind:'research-candidate',storyCategory:'inscriptions',storyLabel:candidate.district,publicationState:'research-candidate',coords:Number.isFinite(latitude)&&Number.isFinite(longitude)?[latitude,longitude]:null}})
const mappedResearchCandidates=inscriptionCandidates.filter(candidate=>Number.isFinite(candidate.resolution?.coordinates?.latitude)&&Number.isFinite(candidate.resolution?.coordinates?.longitude)).map(candidate=>({...candidate,coords:[candidate.resolution.coordinates.latitude,candidate.resolution.coordinates.longitude],startYear:candidate.date.era==='BCE'?-candidate.date.from:candidate.date.from,endYear:candidate.date.era==='BCE'?-candidate.date.to:candidate.date.to}))
const events=atlasData.events.map(event=>{const coords=[event.location.coordinates[1],event.location.coordinates[0]];const routePositions=event.route?.coordinates.map(([lng,lat])=>[lat,lng])||[];const placePosition=id=>{const [lng,lat]=placeById.get(id)?.location?.coordinates||[];return Number.isFinite(lat)&&Number.isFinite(lng)?[lat,lng]:null};const originPosition=placePosition(event.originPlaceId);const destinationPosition=placePosition(event.destinationPlaceId)||coords;const connectionPositions=event.reach?(routePositions.length?routePositions:[originPosition,destinationPosition].filter(Boolean)):routePositions;return {...event,year:event.date.from,coords,routePositions,connectionPositions,connectionCategory:connectionCategory(event),originPosition,destinationPosition}}).sort((a,b)=>a.year-b.year)
const primaryAtlasEvents=eventsForPrimaryAtlas(events,primaryPolityIds)
const territorialExtents=atlasData.territorialExtents.map(extent=>({...extent,positions:extent.geometry.coordinates.map(([lng,lat])=>[lat,lng])}))
const culturalRecords=atlasData.culturalHeritage.map(item=>{const place=placeById.get(item.placeIds[0]);const [lng,lat]=place?.location.coordinates||[0,0];return {...item,coords:[lat,lng],placeNames:item.placeIds.map(id=>placeById.get(id)?.name).filter(Boolean)}})
const periodicalMapRecords=patrikaMapSites.map(site=>({
  ...site,
  coords:[site.coordinates[1],site.coordinates[0]],
  year:site.yearFrom,
  date:Number.isFinite(site.yearFrom)?{from:site.yearFrom,to:site.yearFrom,era:'CE',precision:'year'}:{from:null,to:null,era:'CE',precision:'unknown'},
  storyKind:'periodical',
  storyCategory:'periodicals',
  storyLabel:site.place,
}))
const artifactMapRecords=atlasData.artifacts.map(record=>({
  ...record,
  coords:[record.location.coordinates[1],record.location.coordinates[0]],
  year:record.date.from,
  storyKind:'artifact',
  storyCategory:'artifacts',
  storyLabel:record.artifactKind,
}))
const contributionContextFor=person=>({
  events:events.filter(record=>(record.peopleIds||[]).includes(person.id)),
  works:atlasData.works.filter(record=>(record.creatorIds||[]).includes(person.id)),
  culture:culturalRecords.filter(record=>(record.peopleIds||[]).includes(person.id)),
  reigns:atlasData.reigns.filter(record=>(record.rulerIds||[]).includes(person.id)),
  relations:atlasData.politicalRelations.filter(record=>(record.peopleIds||[]).includes(person.id)),
})
const successionRelationships=atlasData.relationships.filter(record=>record.type==='succeeded-by')
const successionEdgesForPolity=polityId=>successionRelationships
  .filter(record=>record.polityId===polityId||personById.get(record.fromId)?.polityId===polityId||personById.get(record.toId)?.polityId===polityId)
  .sort((a,b)=>(a.date?.from??0)-(b.date?.from??0))
const successionEdgesForPerson=personId=>successionRelationships
  .filter(record=>record.fromId===personId||record.toId===personId)
  .sort((a,b)=>(a.date?.from??0)-(b.date?.from??0))
const feudatoryRelationsForPolity=polityId=>(atlasData.feudatoryRelations||[])
  .filter(record=>record.overlordPolityId===polityId||record.subordinatePolityId===polityId)
  .sort((a,b)=>(a.date?.from??0)-(b.date?.from??0))
const administrativeDivisionsForPolity=polityId=>(atlasData.administrativeDivisions||[])
  .filter(record=>record.polityId===polityId)
  .sort((a,b)=>(a.date?.from??0)-(b.date?.from??0))
const scriptsForPolity=polityId=>(atlasData.scriptEvolution||[])
  .filter(record=>(record.relatedPolityIds||[]).includes(polityId))
  .sort((a,b)=>(a.date?.from??0)-(b.date?.from??0))
const personStories=atlasData.people.map(person=>{
  const contributions=contributionContextFor(person)
  const preferredAnchors=contributions.reigns.length?contributions.reigns.map(record=>record.date):contributions.events.length?contributions.events.map(record=>record.date):contributions.works.length?contributions.works.map(record=>record.date):contributions.culture.length?contributions.culture.map(record=>record.date):contributions.relations.map(record=>record.date)
  const anchorDates=preferredAnchors.filter(record=>Number.isFinite(record?.from)).sort((a,b)=>chronologicalYear(a)-chronologicalYear(b))
  const anchorDate=anchorDates[0]
  const anchorYear=anchorDate?chronologicalYear(anchorDate):null
  if(!anchorDate)return null
  const polity=entityById.get(person.polityId)
  const place=placeById.get(polity?.capitalId)
  const relatedPosition=contributions.events.map(record=>record.coords).find(point=>Array.isArray(point)&&Number.isFinite(point[0])&&Number.isFinite(point[1]))||contributions.relations.map(record=>{
    const geography=record.geography||{}
    const party=record.parties?.find(item=>item.polityId===person.polityId)
    const point=party?.role?.includes('origin')?geography.origin?.coordinates:geography.destination?.coordinates
    return point||geography.destination?.coordinates||geography.origin?.coordinates
  }).find(point=>Array.isArray(point)&&Number.isFinite(point[0])&&Number.isFinite(point[1]))
  const [lng,lat]=relatedPosition||place?.location?.coordinates||[]
  return {...person,person,contributions,year:anchorYear,date:{from:anchorDate.from,to:anchorDate.to??anchorDate.from,era:anchorDate.era||'CE',precision:anchorDate.precision||'circa'},storyKind:'person',storyCategory:'people',storyLabel:person.roles,coords:Number.isFinite(lat)&&Number.isFinite(lng)?[lat,lng]:null,contributionCount:Object.values(contributions).reduce((total,records)=>total+records.length,0)}
}).filter(Boolean)
const districtHistoryStories=atlasData.districtHistoryResearch.filter(record=>record.recordKind==='candidate'&&Number.isFinite(record.date?.from)).map(record=>({
  ...record,year:record.date.from,storyKind:'research-candidate',storyCategory:'history',storyLabel:record.district,publicationState:'research-candidate',coords:record.location?.coordinates?[record.location.coordinates[1],record.location.coordinates[0]]:null
}))
const warEventTypes=new Set(['battle','war','invasion','campaign'])
const politicalEventTypes=new Set(['kingdom-foundation','regime-change','capital-relocation','accession','constitutional-transition','state-reorganisation'])
const timelineStories=[
  ...primaryAtlasEvents.map(record=>({...record,storyKind:'event',storyCategory:record.researchInput?.sourceCollection==='martyrCandidates'?'freedom':record.reach?'connections':warEventTypes.has(record.type)?'wars':politicalEventTypes.has(record.type)?'political':'history',storyLabel:null})),
  ...atlasData.works.map(record=>{const polity=entityById.get(record.polityId);const place=placeById.get(polity?.capitalId);const [lng,lat]=place?.location?.coordinates||[];return {...record,year:record.date.from,storyKind:'literature',storyCategory:'literature',storyLabel:record.creator,coords:Number.isFinite(lat)&&Number.isFinite(lng)?[lat,lng]:null}}),
  ...primaryAtlasInscriptions.map(record=>({...record,storyKind:'inscription',storyCategory:'inscriptions',storyLabel:record.placeName,storyPolityName:record.polity?.name||entityById.get(record.polityId)?.name||null})),
  ...atlasData.reigns.map(record=>{const capital=placeById.get(record.capitalIds?.[0]);const [lng,lat]=capital?.location?.coordinates||[];return {...record,year:record.date.from,storyKind:'reign',storyCategory:'reigns',storyLabel:capital?.name||null,coords:Number.isFinite(lat)&&Number.isFinite(lng)?[lat,lng]:null}}),
  ...territorialExtents.filter(record=>record.snapshotKind!=='prototype').map(record=>{const positions=record.geometry.coordinates.map(([lng,lat])=>[lat,lng]);return {...record,positions,year:record.snapshotYear||record.date.from,storyKind:'territory',storyCategory:'territory',storyLabel:entityById.get(record.polityIds?.[0])?.name||null}}),
  ...externallyGovernedPhases.map(record=>({...record,year:record.date.from,storyKind:'governance',storyCategory:'political',storyLabel:record.capitalName,coords:record.polygon[0]})),
  ...culturalRecords.map(record=>({...record,year:record.date.from,storyKind:'culture',storyCategory:timelineCategoryForCulture(record),storyLabel:record.placeNames[0]||null})),
  ...periodicalMapRecords.filter(record=>Number.isFinite(record.year)),
  ...artifactMapRecords.filter(record=>Number.isFinite(record.year)),
  ...personStories,
  ...districtHistoryStories,
  ...bceResearchStories,
].sort((a,b)=>a.year-b.year)
const firstTimelineStory=timelineStories.find(story=>story.coords)||timelineStories[0]
const heritageAuthorityTags=site=>{
  const verification=site.verification||{}
  const identity=JSON.stringify({externalIds:verification.externalIds,protectionStatus:verification.protectionStatus,managingAuthorities:verification.managingAuthorities}).toLowerCase()
  const tags=[]
  if(verification.externalIds?.unesco||identity.includes('unesco'))tags.push('unesco')
  if(verification.externalIds?.asiRegister||identity.includes('archaeological survey')||identity.includes('asi protected')||identity.includes('asi —'))tags.push('asi')
  if(verification.externalIds?.stateHeritage||identity.includes('state archaeology')||identity.includes('government of karnataka'))tags.push('state')
  return tags.length?tags:['research']
}
const heritageCandidates=atlasData.heritageAudits.flatMap(audit=>audit.prioritySites.filter(site=>site.verification.coordinates).map(site=>{const creationPhase=[...(site.verification.constructionPhases||[])].filter(phase=>phase.date?.era==='CE'&&Number.isFinite(phase.date.from)).sort((a,b)=>a.date.from-b.date.from)[0]||null;return {...site,district:audit.district,auditId:audit.id,coords:[site.verification.coordinates.latitude,site.verification.coordinates.longitude],creationPhase,startYear:creationPhase?.date.from??null,authorityTags:heritageAuthorityTags(site)}}))
const reviewBounds=date=>date&&Number.isFinite(date.from)?{startYear:chronologicalYear(date),endYear:date.era==='BCE'?-Number(date.to??date.from):Number(date.to??date.from)}:{startYear:null,endYear:null}
const sourceContextFor=record=>{const citation=record.citations?.[0];const source=citation&&sourceById.get(citation.sourceId);return {sourceTitle:source?.title||null,sourceUrl:source?.url||null,sourceLocator:citation?.locator||''}}
const publicReviewCandidates=[
  ...mappedResearchCandidates.map(item=>({...item,...sourceContextFor(item),recordKind:'inscription-candidate',reviewStatus:item.review?.status||'needs-review',description:item.researchNote,placeLabel:item.place})),
  ...districtHistoryStories.filter(item=>item.coords&&needsHumanReview(item.review)).map(item=>({...item,...reviewBounds(item.date),...sourceContextFor(item),recordKind:'district-history',reviewStatus:item.review.status,placeLabel:item.district})),
  ...heritageCandidates.filter(item=>item.verification.verificationStatus!=='verified').map(item=>({...item,startYear:item.startYear,endYear:item.startYear,...(item.verification.siteCitations?.[0]?{sourceTitle:{en:item.verification.siteCitations[0].title,kn:item.verification.siteCitations[0].title},sourceUrl:item.verification.siteCitations[0].url,sourceLocator:''}:{}),recordKind:item.category||'heritage',reviewStatus:item.verification.verificationStatus,description:item.verification.verificationNote,placeLabel:item.district})),
  ...culturalRecords.filter(item=>needsHumanReview(item.review)).map(item=>({...item,...reviewBounds(item.date),...sourceContextFor(item),recordKind:isTempleRecord(item)?'temple':item.category,reviewStatus:item.review.status,placeLabel:item.placeNames[0]})),
  ...primaryAtlasEvents.filter(item=>needsHumanReview(item.review)).map(item=>({...item,...reviewBounds(item.date),...sourceContextFor(item),recordKind:item.type,reviewStatus:item.review.status,description:item.summary,placeLabel:null})),
]
const publicDataDepth=(()=>{
  const historicalCollections=['events','people','works','inscriptions','culturalHeritage','periodicals','artifacts','reigns','territorialExtents','politicalRelations','externalGovernancePhases','districtHistoryResearch']
  const historicalRecords=historicalCollections.reduce((total,key)=>total+atlasData[key].length,0)
  const inscriptionLeads=atlasData.inscriptionAudits.reduce((total,audit)=>total+(audit.priorityCandidates?.length||0),0)
  const heritageSites=atlasData.heritageAudits.reduce((total,audit)=>total+(audit.prioritySites?.length||0),0)
  const researchLeads=atlasData.templeInventoryLeads.length+atlasData.heritageInventoryLeads.length+inscriptionLeads+heritageSites
  return {totalRecords:historicalRecords+researchLeads,researchLeads,sources:atlasData.sources.length,relationships:atlasData.relationships.length}
})()
const heritageStatusColors={verified:'#17835f','partially-verified':'#4361ee',identified:'#d08024','research-pending':'#8b8b98'}
const isCultureActive=(item,year)=>year>=item.date.from&&(year<=item.date.to||['continuing-practice','material-survival'].includes(item.continuity))
const territoriesForYear=year=>{
  const active=territorialExtents.filter(item=>year>=item.date.from&&year<=item.date.to)
  const specificCorePolities=new Set(active.filter(item=>item.classification==='core-administered'&&item.snapshotKind!=='prototype').flatMap(item=>item.polityIds))
  return active.filter(item=>item.snapshotKind!=='prototype'||!item.polityIds.some(polityId=>specificCorePolities.has(polityId)))
}

function MapViewport({scope,selectedEvent,selectedTerritory,selectedCulture,selectedWorkPosition,selectedPersonPosition,selectedInscription,selectedSearchPlace,comparisonPositions,preserveInitialMapView=false}){
  const map=useMap()
  const preserveInitialView=useRef(preserveInitialMapView)
  useEffect(()=>{
    if(preserveInitialView.current){preserveInitialView.current=false;return}
    const focusPosition=position=>{
      if(!position)return
      const targetZoom=mapZoomForPoint(position)
      const visible=map.getBounds().contains(position)
      if(!visible||map.getZoom()<targetZoom)map.setView(position,Math.max(map.getZoom(),targetZoom),{animate:true})
    }
    const eventPositions=selectedEvent?.connectionPositions?.length?selectedEvent.connectionPositions:(selectedEvent?.coords?[selectedEvent.coords]:[])
    const hasSelection=Boolean(selectedEvent||selectedTerritory||selectedCulture||selectedWorkPosition||selectedPersonPosition||selectedInscription||selectedSearchPlace||comparisonPositions?.length)
    if(eventPositions.length>1){
      const alreadyVisible=eventPositions.every(position=>map.getBounds().contains(position))
      if(!alreadyVisible)map.fitBounds(eventPositions,{padding:[45,45],maxZoom:mapZoomForPositions(eventPositions)})
    }else if(eventPositions.length===1&&!map.getBounds().contains(eventPositions[0])){
      map.panTo(eventPositions[0],{animate:true})
    }
    else if(selectedTerritory?.positions.length) map.fitBounds(selectedTerritory.positions,{padding:[45,45],maxZoom:mapZoomForPositions(selectedTerritory.positions)})
    else if(selectedCulture?.coords) focusPosition(selectedCulture.coords)
    else if(selectedWorkPosition) focusPosition(selectedWorkPosition)
    else if(selectedPersonPosition) focusPosition(selectedPersonPosition)
    else if(selectedInscription?.coords) focusPosition(selectedInscription.coords)
    else if(selectedSearchPlace?.coords&&selectedSearchPlace.overview) map.setView([14.7,76.2],6.35,{animate:true})
    else if(selectedSearchPlace?.coords) focusPosition(selectedSearchPlace.coords)
    else if(comparisonPositions?.length) map.fitBounds(comparisonPositions,{padding:[45,45],maxZoom:6})
    // A record with incomplete coordinates must never reset a user's map to a
    // world view. Keep the current view until a researcher supplies a location.
    else if(!hasSelection&&scope==='world') map.setView([25,48],2.25)
    else if(!hasSelection) map.setView(scope==='india'?[20.2,78.4]:[14.7,76.2],scope==='india'?4.35:6.35)
  },[map,scope,selectedEvent,selectedTerritory,selectedCulture,selectedWorkPosition,selectedPersonPosition,selectedInscription,selectedSearchPlace,comparisonPositions])
  return null
}

function MapShareSync({onMapMove}){
  const map=useMap()
  useEffect(()=>{
    const sync=()=>{
      const center=map.getCenter()
      onMapMove({lat:center.lat,lng:center.lng,zoom:map.getZoom()})
    }
    map.on('moveend',sync)
    map.on('zoomend',sync)
    return()=>{map.off('moveend',sync);map.off('zoomend',sync)}
  },[map,onMapMove])
  return null
}

function MapResizeOnMode({active}){
  const map=useMap()
  useEffect(()=>{
    const timers=[0,120,320].map(delay=>window.setTimeout(()=>map.invalidateSize({pan:false}),delay))
    return()=>timers.forEach(timer=>window.clearTimeout(timer))
  },[map,active])
  return null
}

const featureCenter=feature=>{
  const points=[]
  const collect=value=>{if(Array.isArray(value)&&value.length>=2&&Number.isFinite(value[0])&&Number.isFinite(value[1]))points.push(value);else if(Array.isArray(value))value.forEach(collect)}
  collect(feature.geometry?.coordinates)
  if(!points.length)return null
  const lngs=points.map(point=>point[0]),lats=points.map(point=>point[1])
  return [(Math.min(...lats)+Math.max(...lats))/2,(Math.min(...lngs)+Math.max(...lngs))/2]
}

function LocalizedMapLabels({locale,capitalIds,districtGeojson,showDistricts,suppressLabels=false}){
  const map=useMap()
  const [zoom,setZoom]=useState(map.getZoom())
  useEffect(()=>{const update=()=>setZoom(map.getZoom());map.on('zoomend',update);return()=>map.off('zoomend',update)},[map])
  if(locale!=='kn'||suppressLabels)return null
  const capitalSet=new Set(capitalIds)
  const placeLabels=atlasData.places.filter(place=>{
    if(place.kind!=='settlement'||!place.name?.kn)return false
    const [lng,lat]=place.location?.coordinates||[]
    const inKarnataka=lat>=11&&lat<=19&&lng>=73.5&&lng<=78.5
    // Keep the map readable while travelling through the timeline. Capital
    // labels remain useful at normal zoom; locality labels appear only when
    // the user is deliberately close to the map.
    return inKarnataka&&(capitalSet.has(place.id)||zoom>=9)
  })
  const districtLabels=showDistricts&&zoom>=8.5?(districtGeojson?.features||[]).map(feature=>({id:feature.properties.id,name:feature.properties.districtName?.kn,center:featureCenter(feature)})).filter(item=>item.name&&item.center):[]
  // Labels are hover-only so they never sit over inscription, heritage or
  // event markers while a researcher is traversing the map. The capital dot
  // remains as a quiet orientation cue; the name appears on hover.
  return <>{placeLabels.map(place=>{const [lng,lat]=place.location.coordinates;const isCapital=capitalSet.has(place.id);return <CircleMarker key={`label-${place.id}`} center={[lat,lng]} radius={isCapital?4:2} pathOptions={isCapital?{color:'#4361ee',fillColor:'#fff',opacity:1,fillOpacity:1,weight:2}:{opacity:0,fillOpacity:0}}><Tooltip direction="right" offset={[5,0]} className={`map-name-label ${isCapital?'capital':''}`}>{place.name.kn}</Tooltip></CircleMarker>})}{districtLabels.map(district=><CircleMarker key={`district-label-${district.id}`} center={district.center} radius={2} pathOptions={{opacity:0,fillOpacity:0}}><Tooltip direction="center" className="map-name-label district">{district.name}</Tooltip></CircleMarker>)}</>
}

function GlobalSearch({locale,t,query,setQuery,filters,setFilters,results,onSelect}){
  const update=(key,value)=>setFilters(current=>({...current,[key]:value}))
  return <section className="global-search"><label><span>{t.searchAtlas}</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.searchAtlasPlaceholder}/></label><details><summary>{t.researchFilters}</summary><div className="global-search-filters"><select aria-label={t.recordType} value={filters.kind} onChange={event=>update('kind',event.target.value)}><option value="all">{t.allRecordTypes}</option>{Object.entries(t.searchKinds).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><select aria-label={t.century} value={filters.century} onChange={event=>update('century',event.target.value)}><option value="all">{t.allCenturies}</option>{Array.from({length:17},(_,index)=>index+4).map(value=><option key={value} value={value}>{value}{locale==='kn'?'ನೇ ಶತಮಾನ':'th century'}</option>)}</select><select aria-label={t.associatedKingdom} value={filters.polity} onChange={event=>update('polity',event.target.value)}><option value="all">{t.allKingdoms}</option>{atlasData.polities.map(polity=><option key={polity.id} value={polity.id}>{primary(polity.name,locale)}</option>)}</select><select aria-label={t.language} value={filters.language} onChange={event=>update('language',event.target.value)}><option value="all">{t.allLanguages}</option>{['Kannada','Sanskrit','Prakrit','Telugu','Persian','Arabic'].map(value=><option key={value}>{value}</option>)}</select><select aria-label={t.script} value={filters.script} onChange={event=>update('script',event.target.value)}><option value="all">{t.allScripts}</option>{['Old Kannada','Early Kannada','Kannada','Southern Brahmi','Nagari','Telugu'].map(value=><option key={value}>{value}</option>)}</select><select aria-label={t.allDistricts} value={filters.district} onChange={event=>update('district',event.target.value)}><option value="all">{t.allDistricts}</option>{atlasData.heritageAudits.map(audit=><option key={audit.id} value={audit.id}>{primary(audit.district,locale)}</option>)}</select><select aria-label={t.reviewStatus} value={filters.review} onChange={event=>update('review',event.target.value)}><option value="all">{t.allReviewStatuses}</option>{['draft','needs-review','reviewed','published','verified','partially-verified','identified','research-pending'].map(value=><option key={value}>{value}</option>)}</select><button onClick={()=>setFilters({kind:'all',century:'all',polity:'all',language:'all',script:'all',district:'all',review:'all'})}>{t.clearFilters}</button></div></details>{(query.trim()||Object.values(filters).some(value=>value!=='all'))&&<div className="global-search-results"><small>{results.length} {t.searchResults}</small>{results.map(result=><button key={`${result.kind}-${result.id}`} onClick={()=>onSelect(result)}><span>{t.searchKinds[result.kind]}</span><strong>{primary(result.name,locale)}</strong><small>{secondary(result.name,locale)}{result.year?` · ${result.year} ${t.ce}`:''}{result.kind==='inscription'&&result.polityName?` · ${t.associatedKingdom}: ${primary(result.polityName,locale)}`:''}</small></button>)}{results.length===0&&<p>{t.noSearchResults}</p>}</div>}</section>
}

function Timeline({year,setYear,compareYear,setCompareYear,onPreset,t,locale}){
  const milestones=[-269,1,345,543,753,973,1088,1336,1443,1520,1565,1770,1787,1799,1947,1956,1973]
  const comparing=compareYear!=null
  return <section className={`timeline-panel ${comparing?'compare':''}`}><div className="timeline-head"><span>{comparing?t.yearA:t.historicalYear}</span><strong>{timelineYearLabel(year,locale)}</strong><button className="compare-toggle" onClick={()=>setCompareYear(comparing?null:normalizeTimelineYear(Math.min(MAX_YEAR,year+50)))}>{comparing?t.closeComparison:t.compareYears}</button></div><input aria-label={comparing?t.yearA:t.historicalYear} type="range" min={MIN_YEAR} max={MAX_YEAR} value={year} onChange={e=>setYear(normalizeTimelineYear(Number(e.target.value)))}/>{comparing&&<div className="compare-row"><div className="timeline-head"><span>{t.yearB}</span><strong>{timelineYearLabel(compareYear,locale)}</strong></div><input aria-label={t.yearB} type="range" min={MIN_YEAR} max={MAX_YEAR} value={compareYear} onChange={e=>setCompareYear(normalizeTimelineYear(Number(e.target.value)))}/><div className="preset-list" aria-label={t.comparisonStories}>{comparisonPresets.map(preset=><button className="comparison-preset" key={preset.key} onClick={()=>onPreset(preset)}>{t[preset.key]}</button>)}</div></div>}{!comparing&&<div className="ticks">{milestones.map(y=><button key={y} onClick={()=>setYear(y)} className={Math.abs(year-y)<20?'active':''}>{timelineYearLabel(y,locale)}</button>)}</div>}</section>
}

function EventRail({locale,t,year,stories,selectedId,onSelect,onCategoryChange}){
  const [category,setCategory]=useState('all')
  const [query,setQuery]=useState('')
  const timelineCategories=['all','wars','freedom','political','connections','people','literature','periodicals','artifacts','inscriptions','temples','monuments','reigns','territory','culture']
  const chooseCategory=value=>{setCategory(value);onCategoryChange?.(value)}
  const needle=query.trim().toLowerCase()
  const visibleStories=stories.filter(story=>(category==='all'||story.storyCategory===category)&&(!needle||JSON.stringify(story).toLowerCase().includes(needle)))
  const selectedIndex=visibleStories.findIndex(story=>story.id===selectedId)
  const moveSelection=event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)||!visibleStories.length)return;event.preventDefault();const current=selectedIndex<0?0:selectedIndex;const next=event.key==='Home'?0:event.key==='End'?visibleStories.length-1:Math.max(0,Math.min(visibleStories.length-1,current+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)));onSelect(visibleStories[next])}
  useEffect(()=>{const handler=event=>{if(!event.target.closest?.('.event-rail')||['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName))return;moveSelection(event)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[selectedIndex,visibleStories])
  const colorFor=story=>story.storyKind==='research-candidate'?'#b06a1f':story.storyKind==='event'?(story.reach?connectionColors[story.connectionCategory]:eventColors[story.type]||'#785f45'):story.storyKind==='literature'?cultureColors.literature:story.storyKind==='periodical'?'#5f6796':story.storyKind==='artifact'?'#8b5aa5':story.storyKind==='person'?'#b26a22':story.storyKind==='inscription'?'#9a6b24':story.storyKind==='reign'?'#315f91':story.storyKind==='territory'?territoryColors[story.classification]:story.storyCategory==='temples'?'#a65f24':cultureColors[story.category]||'#8b5aa5'
  const labelFor=story=>story.storyKind==='research-candidate'?t.researchCandidate:story.storyKind==='event'?(story.reach?t.connectionTypes[story.connectionCategory]:t.timelineCategories[story.storyCategory]):story.storyKind==='person'?`${t.timelineCategories.people} · ${story.contributionCount}`:story.storyKind==='inscription'?`${t.timelineCategories.inscriptions} · ${primary(story.storyPolityName,locale)}`:t.timelineCategories[story.storyCategory]||t.timelineCategories.history
  return <section className="event-rail"><div className="event-rail-title"><strong>{t.timelineStories}</strong><label><span>{t.searchTimeline}</span><input aria-label={t.searchTimeline} value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.searchTimelinePlaceholder}/></label></div><select className="timeline-category-select" aria-label={t.timelineCategoryLabel} value={category} onChange={event=>chooseCategory(event.target.value)}>{timelineCategories.map(value=><option key={value} value={value}>{t.timelineCategories[value]}</option>)}</select><div className="timeline-filters">{timelineCategories.map(value=><button key={value} className={category===value?'active':''} onClick={()=>chooseCategory(value)}><span aria-hidden="true">{value==='all'?'':objectIcon(value==='temples'?'temple':value==='monuments'?'monument':value==='wars'?'war':value==='freedom'?'person':value==='connections'?'connection':value==='inscriptions'?'inscription':value==='people'?'person':value==='reigns'?'reign':value==='territory'?'territory':value==='periodicals'?'literature':value==='artifacts'?'artifact':value)}</span>{t.timelineCategories[value]}</button>)}</div><div className="event-track">{visibleStories.map(story=>{const kind=objectKindFor(story);const storyDate=story.date||{};const periodText=story.storyKind==='reign'&&storyDate.to!=null?`${timelineYearLabel(storyDate.from,locale)}–${timelineYearLabel(storyDate.to,locale)}`:`${storyDate.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${timelineYearLabel(story.year,locale)}`;return <button key={`${story.storyKind}-${story.id}`} data-story-category={story.storyCategory} className={`${story.storyKind} ${story.reach?'connection-event':''} ${selectedId===story.id?'selected':''} ${Math.abs(story.year-year)<=18?'near':''}`} onClick={()=>onSelect(story)} style={{'--event-color':colorFor(story)}}><i aria-hidden="true"><span>{objectIcon(kind)}</span></i><span>{periodText}</span><strong>{primary(story.name,locale)}</strong><em>{labelFor(story)}</em></button>})}{visibleStories.length===0&&<p className="timeline-empty">{t.noTimelineStories}</p>}</div></section>
}

function BceResearchContext({locale,t,year,onOpenEpigraphy}){
  const candidates=bceResearchStories.filter(item=>year>=-item.date.from&&year<=-item.date.to)
  return <aside className="detail-panel bce-research-context"><div className="detail-accent"></div><div className="review-badge needs-review">{t.researchCandidate}</div><p className="eyebrow">{timelineYearLabel(year,locale)}</p><h2>{t.bceResearchTitle}</h2><p>{t.noPublishedPolity}</p><p className="bce-safety-note">{t.bceResearchNote}</p>{candidates.length>0&&<div className="bce-candidate-list">{candidates.map(item=><article key={item.id}><strong>{primary(item.name,locale)}</strong><span>{Math.abs(item.date.from)}–{Math.abs(item.date.to)} {t.bce}</span><small>{primary(item.district,locale)} · {item.promotionReview.completedEvidence.length}/{item.promotionReview.requiredEvidence.length}</small></article>)}</div>}<button className="return-detail" onClick={onOpenEpigraphy}>{t.openEpigraphy}</button></aside>
}

function EventDetail({event,locale,t,onClose}){
  const citations=(event.citations||[]).map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  const destination=placeById.get(event.destinationPlaceId)
  const linkedPeople=(event.peopleIds||[]).map(id=>personById.get(id)).filter(Boolean)
  const linkedCandidates=(event.candidateIds||[]).map(id=>candidateById.get(id)).filter(Boolean)
  return <aside className="detail-panel event-detail"><div className="detail-accent" style={{background:eventColors[event.type]||'#785f45'}}></div><div className={`review-badge ${event.review?.status||'needs-review'}`}>{event.review?.status||'needs-review'}</div>{recordAuthorityCited(event,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}<p className="eyebrow">{eventYearLabel(event,locale)} {t.ce} · {event.type}</p><h2>{primary(event.name,locale)}</h2><p className="entity-secondary">{secondary(event.name,locale)}</p><p>{primary(event.summary,locale)}</p>{locale==='kn'&&event.summary?.en&&<p className="english-support" lang="en">{event.summary.en}</p>}{event.reach&&<div className="reach-card"><strong>{t.overseasConnection}</strong><span>{t[event.reach.direction]||event.reach.direction} · {t.reachRelations?.[event.reach.relationKind]||event.reach.relationKind}</span>{destination&&<span>{t.destination}: {primary(destination.name,locale)}</span>}<span>{t.modernCountries}: {(event.reach.modernCountries||[]).join(', ')||'—'}</span><span>{t.territorialControl}: {event.reach.territorialControl?t.yes:t.no}</span><p>{primary(event.reach.note,locale)}</p></div>}{linkedPeople.length>0&&<><h3>{t.people}</h3><div className="participant-list">{linkedPeople.map(person=><div key={person.id}><strong>{primary(person.name,locale)}</strong><span>{secondary(person.name,locale)}</span></div>)}</div></>}{linkedCandidates.length>0&&<><h3>{locale==='kn'?'ಸಂಪರ್ಕಿತ ಪರಿಶೀಲನಾ ಅಭ್ಯರ್ಥಿಗಳು':'Linked review candidates'}</h3><div className="participant-list">{linkedCandidates.map(person=><div key={person.id}><strong>{primary(person.name,locale)}</strong><span>{person.sourceEntry?.printedPageFrom?`Dictionary of Martyrs · p. ${person.sourceEntry.printedPageFrom}`:person.id}</span></div>)}</div></>}<h3>{t.participants}</h3><div className="participant-list">{(event.participants||[]).map((participant,index)=>{const entity=entityById.get(participant.polityId);return <div key={`${participant.polityId}-${index}`}><strong>{primary(entity?.name,locale)||participant.polityId}</strong><span>{participant.role} · {participant.outcome}</span></div>})}</div><h3>{t.sources}</h3><div className="citations">{citations.map(item=><p key={item.sourceId}><a href={item.source.url} target="_blank" rel="noreferrer"><strong>{primary(item.source.title,locale)}</strong></a><ProvenanceBadge tier={sourceTiers.get(item.sourceId)} locale={locale} short/><span>{item.locator}</span></p>)}</div><button className="return-detail" onClick={onClose}>{t.returnKingdom}</button></aside>
}

function TerritoryDetail({territory,locale,t,onClose}){
  const citations=territory.citations.map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  const relatedPolities=territory.polityIds.map(id=>entityById.get(id)).filter(Boolean)
  const period=reignById.get(territory.reignId)
  return <aside className="detail-panel territory-detail"><div className="detail-accent" style={{background:territoryColors[territory.classification]}}></div><div className={`review-badge ${territory.review.status}`}>{territory.review.status}</div>{recordAuthorityCited(territory,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}<p className="eyebrow">{territory.date.from}–{territory.date.to} {t.ce} · {t.territoryClasses[territory.classification]}</p><h2>{primary(territory.name,locale)}</h2><p className="entity-secondary">{secondary(territory.name,locale)}</p><p>{primary(territory.description,locale)}</p>{locale==='kn'&&<p className="english-support" lang="en">{territory.description.en}</p>}{period&&<div className="reach-card"><strong>{t.researchPeriod}</strong><span>{primary(period.name,locale)}</span><span>{secondary(period.name,locale)}</span></div>}<div className="territory-metrics"><span><b>{t.controlLevel}</b>{t.controlValues[territory.controlLevel]}</span><span><b>{t.duration}</b>{t.durationValues[territory.duration]}</span><span><b>{t.confidence}</b>{t.confidenceValues[territory.confidence]}</span><span><b>{t.geographicPrecision}</b>{territory.geometry.precision}</span></div><h3>{t.participants}</h3><div className="participant-list">{relatedPolities.map(polity=><div key={polity.id}><strong>{primary(polity.name,locale)}</strong><span>{secondary(polity.name,locale)}</span></div>)}</div><h3>{t.sources}</h3><div className="citations">{citations.map(item=><p key={item.sourceId}><a href={item.source.url||undefined} target={item.source.url?'_blank':undefined} rel={item.source.url?'noreferrer':undefined}><strong>{primary(item.source.title,locale)}</strong></a><ProvenanceBadge tier={sourceTiers.get(item.sourceId)} locale={locale} short/><span>{item.locator}</span></p>)}</div><button className="return-detail" onClick={onClose}>{t.returnKingdom}</button></aside>
}

function CultureDetail({item,locale,t,onClose}){
  const citations=item.citations.map(citationItem=>({...citationItem,source:sourceById.get(citationItem.sourceId)})).filter(citationItem=>citationItem.source)
  const relatedPolities=item.polityIds.map(id=>entityById.get(id)).filter(Boolean)
  const relatedPeople=item.peopleIds.map(id=>personById.get(id)).filter(Boolean)
  return <aside className="detail-panel culture-detail"><div className="detail-accent" style={{background:cultureColors[item.category]}}></div><div className={`review-badge ${item.review.status}`}>{item.review.status}</div>{recordAuthorityCited(item,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}<p className="eyebrow">{item.date.from}{item.date.to!==item.date.from?`–${item.date.to}`:''} {t.ce} · {t.cultureCategories[item.category]}</p><h2>{primary(item.name,locale)}</h2><p className="entity-secondary">{secondary(item.name,locale)}</p><p>{primary(item.description,locale)}</p>{locale==='kn'&&<p className="english-support" lang="en">{item.description.en}</p>}<div className="culture-meta"><span><b>{t.continuity}</b>{t.continuityValues[item.continuity]}</span><span><b>{t.culturalPlace}</b>{item.placeNames.map(value=>primary(value,locale)).join(', ')}</span></div><div className="culture-tags">{item.traditionTags.map(tag=><span key={tag}>{tag}</span>)}</div><h3>{t.participants}</h3><div className="participant-list">{relatedPolities.map(polity=><div key={polity.id}><strong>{primary(polity.name,locale)}</strong><span>{secondary(polity.name,locale)}</span></div>)}{relatedPeople.map(person=><div key={person.id}><strong>{primary(person.name,locale)}</strong><span>{secondary(person.name,locale)}</span></div>)}</div><h3>{t.sources}</h3><div className="citations">{citations.map((citationItem,index)=><p key={`${citationItem.sourceId}-${index}`}><a href={citationItem.source.url||undefined} target={citationItem.source.url?'_blank':undefined} rel={citationItem.source.url?'noreferrer':undefined}><strong>{primary(citationItem.source.title,locale)}</strong></a><ProvenanceBadge tier={sourceTiers.get(citationItem.sourceId)} locale={locale} short/><span>{citationItem.locator}</span></p>)}</div><button className="return-detail" onClick={onClose}>{t.returnKingdom}</button></aside>
}

function WorkDetail({work,locale,t,onClose}){
  const citations=(work.citations||[]).map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  const polity=entityById.get(work.polityId)
  const creators=(work.creatorIds||[]).map(id=>personById.get(id)).filter(Boolean)
  return <aside className="detail-panel record-detail work-detail"><div className="detail-accent literary-accent"></div><div className={`review-badge ${work.review.status}`}>{work.review.status}</div>{recordAuthorityCited(work,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}<p className="eyebrow">{t.literaryWork} · {work.date.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}{work.date.from} {t.ce}</p><h2>{primary(work.name,locale)}</h2><p className="entity-secondary">{secondary(work.name,locale)}</p>{work.description?.[locale]&&<p>{primary(work.description,locale)}</p>}{locale==='kn'&&work.description?.en&&<p className="english-support" lang="en">{work.description.en}</p>}<dl><div><dt>{t.creator}</dt><dd><strong>{primary(work.creator,locale)}</strong><small>{secondary(work.creator,locale)}</small></dd></div><div><dt>{t.language}</dt><dd>{work.languages.join(', ')}</dd></div><div><dt>{t.datePrecision}</dt><dd>{work.date.precision}</dd></div><div><dt>{t.associatedKingdom}</dt><dd><strong>{primary(polity?.name,locale)}</strong><small>{secondary(polity?.name,locale)}</small></dd></div><div><dt>{t.stableId}</dt><dd>{work.id}</dd></div></dl>{creators.length>0&&<><h3>{t.people}</h3><div className="participant-list">{creators.map(person=><div key={person.id}><strong>{primary(person.name,locale)}</strong><span>{secondary(person.name,locale)} · {person.roles.join(', ')}</span></div>)}</div></>}<h3>{t.sources}</h3>{citations.length?<div className="citations">{citations.map((item,index)=><p key={`${item.sourceId}-${index}`}><a href={item.source.url||undefined} target={item.source.url?'_blank':undefined} rel={item.source.url?'noreferrer':undefined}><strong>{primary(item.source.title,locale)}</strong></a><ProvenanceBadge tier={sourceTiers.get(item.sourceId)} locale={locale} short/><span>{item.locator}</span></p>)}</div>:<p className="muted">{t.noSources}</p>}{work.externalLinks?.length>0&&<><h3>{t.externalResources}</h3><div className="record-links">{work.externalLinks.map(link=><a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div></>}<button className="return-detail" onClick={onClose}>{t.returnKingdom}</button></aside>
}

function PersonDetail({person,locale,t,onClose,onChooseRecord}){
  const context=contributionContextFor(person)
  const polity=entityById.get(person.polityId)
  const directCitations=(person.citations||[]).map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  const successionEdges=successionEdgesForPerson(person.id)
  const contributionGroups=[
    ['events',t.historicalEvents,context.events],
    ['reigns',t.reignsAndPeriods,context.reigns],
    ['works',t.literaryWorks,context.works],
    ['culture',t.cultureAndMonuments,context.culture],
  ].filter(([, ,records])=>records.length)
  const evidenceCount=contributionGroups.reduce((total,[,,records])=>total+records.length,0)
  return <aside className="detail-panel person-detail"><div className="detail-accent person-accent"></div><div className={`review-badge ${person.review.status}`}>{person.review.status}</div>{recordAuthorityCited(person,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}<p className="eyebrow">{t.personProfile} · {person.roles.map(role=>t.personRoleLabels[role]||role).join(' · ')}</p><h2>{primary(person.name,locale)}</h2><p className="entity-secondary">{secondary(person.name,locale)}</p><p className="person-evidence-note">{t.personEvidenceIntro}</p><div className="person-summary"><span><b>{evidenceCount}</b>{t.linkedContributions}</span><span><b>{contributionGroups.length}</b>{t.contributionTypes}</span></div><dl><div><dt>{t.associatedKingdom}</dt><dd><strong>{primary(polity?.name,locale)}</strong><small>{secondary(polity?.name,locale)}</small></dd></div><div><dt>{t.roles}</dt><dd>{person.roles.map(role=>t.personRoleLabels[role]||role).join(', ')}</dd></div><div><dt>{t.stableId}</dt><dd>{person.id}</dd></div></dl>{successionEdges.length>0&&<SuccessionNetwork edges={successionEdges} locale={locale} selectedPersonId={person.id} onChoosePerson={target=>onChooseRecord('person',target)}/>} {contributionGroups.map(([kind,label,records])=><section className="person-contribution-group" key={kind}><h3>{label}</h3><div className="person-contribution-list">{records.map(record=><button type="button" key={record.id} onClick={()=>onChooseRecord(kind,record)}><span>{record.date?.from??record.year} {t.ce}</span><strong>{primary(record.name,locale)}</strong><small>{secondary(record.name,locale)}</small></button>)}</div></section>)}{contributionGroups.length===0&&<p className="muted">{t.noLinkedContributions}</p>}<h3>{t.personSources}</h3>{directCitations.length?<div className="citations">{directCitations.map((item,index)=><p key={`${item.sourceId}-${index}`}><a href={item.source.url||undefined} target={item.source.url?'_blank':undefined} rel={item.source.url?'noreferrer':undefined}><strong>{primary(item.source.title,locale)}</strong></a><ProvenanceBadge tier={sourceTiers.get(item.sourceId)} locale={locale} short/><span>{item.locator}</span></p>)}</div>:<p className="muted">{t.inheritedEvidenceNote}</p>}<button className="return-detail" onClick={onClose}>{t.returnKingdom}</button></aside>
}

function InscriptionDetail({item,locale,t,onClose}){
  const citations=(item.citations||[]).map(citationItem=>({...citationItem,source:sourceById.get(citationItem.sourceId)})).filter(citationItem=>citationItem.source)
  const polity=entityById.get(item.polityId)
  const place=placeById.get(item.placeId)
  const displayedDate=`${item.date.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${item.date.from}${item.date.to!==item.date.from?`–${item.date.to}`:''}`
  return <aside className="detail-panel record-detail inscription-detail"><div className="detail-accent inscription-accent"></div><div className={`review-badge ${item.review.status}`}>{item.review.status}</div>{recordAuthorityCited(item,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}<p className="eyebrow">{t.inscription} · {displayedDate} {t.ce}</p><h2>{primary(item.name,locale)}</h2><p className="entity-secondary">{secondary(item.name,locale)}</p><p>{primary(item.description,locale)}</p>{locale==='kn'&&item.description?.en&&<p className="english-support" lang="en">{item.description.en}</p>}<dl><div><dt>{t.mappedPlace}</dt><dd><strong>{primary(place?.name,locale)}</strong><small>{secondary(place?.name,locale)}</small></dd></div><div><dt>{t.coordinates}</dt><dd>{place?.location?.coordinates?.slice().reverse().map(value=>value.toFixed(6)).join(', ')}</dd></div><div><dt>{t.language}</dt><dd>{item.languages.join(', ')}</dd></div><div><dt>{t.script}</dt><dd>{item.scripts.join(', ')}</dd></div><div><dt>{t.datePrecision}</dt><dd>{item.date.precision}</dd></div><div><dt>{t.associatedKingdom}</dt><dd><strong>{primary(polity?.name,locale)}</strong><small>{secondary(polity?.name,locale)}</small></dd></div><div><dt>{t.geographicPrecision}</dt><dd>{place?.location?.precision||'unknown'}</dd></div>{item.itemEdition&&<div><dt>{t.itemEdition}</dt><dd><strong>{item.itemEdition.primary.locator}</strong>{item.itemEdition.alternateLocators?.length>0&&<small>{item.itemEdition.alternateLocators.join(' · ')}</small>}</dd></div>}{item.protection&&<div><dt>{t.protectionStatus}</dt><dd><strong>{primary(item.protection.designation,locale)}</strong><small>{primary(item.protection.authority,locale)}</small></dd></div>}{item.presentCondition&&<div><dt>{t.presentCondition}</dt><dd><strong>{t.inscriptionConditionLabels[item.presentCondition.status]||item.presentCondition.status}</strong><small>{primary(item.presentCondition.description,locale)}</small></dd></div>}<div><dt>{t.stableId}</dt><dd>{item.id}</dd></div></dl><h3>{t.sources}</h3>{citations.length?<div className="citations">{citations.map((citationItem,index)=><p key={`${citationItem.sourceId}-${index}`}><a href={citationItem.source.url||undefined} target={citationItem.source.url?'_blank':undefined} rel={citationItem.source.url?'noreferrer':undefined}><strong>{primary(citationItem.source.title,locale)}</strong></a><ProvenanceBadge tier={sourceTiers.get(citationItem.sourceId)} locale={locale} short/><span>{citationItem.locator}</span></p>)}</div>:<p className="muted">{t.noSources}</p>}<button className="return-detail" onClick={onClose}>{t.returnKingdom}</button></aside>
}

function LiteratureShowcase({works,year,locale,t,onChooseWork,usesNearest}){
  return <section className="literature-showcase"><div className="literature-heading"><h3>{t.literaryTimeline}</h3><span>{year} {t.ce}</span></div><p>{usesNearest?t.nearestLiteraryMilestones:t.activeLiteraryMilestones}</p><div className="literary-work-list">{works.map(work=><article key={work.id} className={Math.abs(work.date.from-year)<=35?'near-year':''}><button onClick={()=>onChooseWork(work)}><span>{work.date.precision==='circa'?(locale==='kn'?'ಸು.':'c.') : ''} {work.date.from}</span><strong>{primary(work.name,locale)}</strong><small>{secondary(work.name,locale)}</small><b>{primary(work.creator,locale)}</b><em>{primary(work.creatorRole,locale)} · {work.languages.join(', ')}</em></button>{work.externalLinks?.[0]?.url&&<a href={work.externalLinks[0].url} target="_blank" rel="noreferrer">{t.openSanchaya}</a>}</article>)}</div></section>
}

function InscriptionShowcase({items,year,locale,t,onChooseInscription}){
  return <section className="inscription-showcase"><div className="literature-heading"><h3>{t.inscriptionTimeline}</h3><span>{items.length}</span></div><p>{t.activeInscriptionMilestones}</p><div className="inscription-record-list">{items.map(item=><button key={item.id} className={Math.abs(item.year-year)<=35?'near-year':''} onClick={()=>onChooseInscription(item)}><span>{item.date.precision==='circa'?(locale==='kn'?'ಸು.':'c.') : ''} {item.year}</span><strong>{primary(item.name,locale)}</strong><small>{primary(item.placeName,locale)} · {item.languages.join(', ')}</small></button>)}</div></section>
}

function SuccessionNetwork({edges,locale,selectedPersonId,onChoosePerson}){
  const title=locale==='kn'?'ಆಳ್ವಿಕೆ ಅನುಕ್ರಮ':'Succession network'
  const note=locale==='kn'?'ಆಳ್ವಿಕೆ ಅವಧಿಗಳಿಂದ ಪಡೆದ ಪರಿಶೀಲನೆ-ಬಾಕಿ ಸಂಬಂಧಗಳು; ಕುಟುಂಬ ವಂಶವೃಕ್ಷ ಎಂದು ಓದಬೇಡಿ.':'Derived from reign periods and still needs review; this is not yet a family tree.'
  const yearLabel=edge=>Number.isFinite(edge.date?.from)?`${edge.date.from} ${edge.date?.era||'CE'}`:(locale==='kn'?'ದಿನಾಂಕ ಬಾಕಿ':'date pending')
  return <section className="succession-network"><h3>{title}</h3><p>{note}</p><div>{edges.map(edge=>{const from=personById.get(edge.fromId),to=personById.get(edge.toId);return <article key={edge.id} className={edge.fromId===selectedPersonId||edge.toId===selectedPersonId?'selected':''}><button type="button" onClick={()=>from&&onChoosePerson(from)} disabled={!from} className={edge.fromId===selectedPersonId?'active':''}><strong>{primary(from?.name,locale)||edge.fromId}</strong><small>{secondary(from?.name,locale)}</small></button><span aria-hidden="true">→</span><button type="button" onClick={()=>to&&onChoosePerson(to)} disabled={!to} className={edge.toId===selectedPersonId?'active':''}><strong>{primary(to?.name,locale)||edge.toId}</strong><small>{secondary(to?.name,locale)}</small></button><em>{yearLabel(edge)} · {edge.review?.status||'needs-review'}</em></article>})}</div></section>
}

function FeudatoryHierarchy({items,polityId,locale}){
  if(!items.length)return null
  const title=locale==='kn'?'ಸಾಮಂತ / ಅಧೀನ ಸಂಬಂಧಗಳು':'Samanta and feudatory hierarchy'
  const note=locale==='kn'?'ಇವು ಸಂಶೋಧನಾ ಕಡತಗಳು; ನಿಖರ ಶಾಸನ ಮತ್ತು ವಂಶಾವಳಿ ಸಾಕ್ಷ್ಯ ಪರಿಶೀಲನೆಯ ನಂತರ ಮಾತ್ರ ಉನ್ನತಿಗೊಳ್ಳುತ್ತವೆ.':'Research packets only; promotion requires inscription and genealogy evidence.'
  return <section className="research-foundation-panel"><h3>{title}</h3><p>{note}</p>{items.map(item=>{const isOverlord=item.overlordPolityId===polityId,other=entityById.get(isOverlord?item.subordinatePolityId:item.overlordPolityId),places=(item.placeIds||[]).map(id=>placeById.get(id)).filter(Boolean);return <article key={item.id}><header><strong>{primary(item.name,locale)}</strong><span>{item.confidence} · {item.review?.status}</span></header><p>{primary(item.description,locale)}</p><dl><div><dt>{isOverlord?(locale==='kn'?'ಅಧೀನ ಘಟಕ':'Subordinate'):(locale==='kn'?'ಅಧಿಪತಿ':'Overlord')}</dt><dd>{primary(other?.name,locale)||item.subordinatePolityId}</dd></div><div><dt>{locale==='kn'?'ಅವಧಿ':'Period'}</dt><dd>{evidenceDateLabel(item.date,locale)}</dd></div><div><dt>{locale==='kn'?'ಸ್ಥಳಗಳು':'Places'}</dt><dd>{places.map(place=>primary(place.name,locale)).join(', ')||'—'}</dd></div></dl></article>})}</section>
}

function AdministrativeGeography({items,locale}){
  if(!items.length)return null
  return <section className="research-foundation-panel"><h3>{locale==='kn'?'ಪ್ರಾಂತ / ಆಡಳಿತ ಭೂಗೋಳ':'Province and administrative geography'}</h3><p>{locale==='kn'?'ಈ ಗಡಿಗಳು ತಾತ್ಕಾಲಿಕ ಅಧ್ಯಯನ ವ್ಯಾಪ್ತಿಗಳು; ಜಿಲ್ಲೆ ಅಥವಾ ಗ್ರಾಮಮಟ್ಟದ ಅಂತಿಮ ಗಡಿಗಳಲ್ಲ.':'These are provisional study envelopes, not final district or village-level borders.'}</p>{items.map(item=>{const places=(item.placeIds||[]).map(id=>placeById.get(id)).filter(Boolean);return <article key={item.id}><header><strong>{primary(item.name,locale)}</strong><span>{item.geometry?.precision} · {item.review?.status}</span></header><p>{primary(item.description,locale)}</p><dl><div><dt>{locale==='kn'?'ಪ್ರಕಾರ':'Kind'}</dt><dd>{item.divisionKind.replaceAll('-',' ')}</dd></div><div><dt>{locale==='kn'?'ಅವಧಿ':'Period'}</dt><dd>{evidenceDateLabel(item.date,locale)}</dd></div><div><dt>{locale==='kn'?'ಕೇಂದ್ರಗಳು':'Anchors'}</dt><dd>{places.map(place=>primary(place.name,locale)).join(', ')||'—'}</dd></div></dl></article>})}</section>
}

function ScriptTimeline({items,locale}){
  if(!items.length)return null
  return <section className="research-foundation-panel"><h3>{locale==='kn'?'ಲಿಪಿ ವಿಕಾಸ ಕಾಲರೇಖೆ':'Script evolution timeline'}</h3><p>{locale==='kn'?'ಶಾಸನ ಮಾದರಿ ಮತ್ತು ಆಕರ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ಬೆಳೆಸಬೇಕಾದ ಲಿಪಿ-ಇತಿಹಾಸ ಪದರ.':'A script-history layer to mature through inscription samples and source review.'}</p>{items.map(item=>{const samples=(item.sampleInscriptionIds||[]).map(id=>atlasData.inscriptions.find(record=>record.id===id)).filter(Boolean);return <article key={item.id}><header><strong>{primary(item.name,locale)}</strong><span>{item.review?.status}</span></header><p>{primary(item.description,locale)}</p><dl><div><dt>{locale==='kn'?'ಲಿಪಿ ಕುಟುಂಬ':'Script family'}</dt><dd>{item.scriptFamily}</dd></div><div><dt>{locale==='kn'?'ಅವಧಿ':'Period'}</dt><dd>{evidenceDateLabel(item.date,locale)}</dd></div><div><dt>{locale==='kn'?'ಮಾದರಿ ಶಾಸನಗಳು':'Sample inscriptions'}</dt><dd>{samples.map(record=>primary(record.name,locale)).join(', ')||'—'}</dd></div></dl></article>})}</section>
}

function KingdomDetail({chosen,locale,t,year,literatureWorks,inscriptionRecords,usesNearestLiterature,onChooseWork,onChooseInscription,onChoosePerson}){
  const citations=chosen.citations.map(item=>({...item,source:sourceById.get(item.sourceId)})).filter(item=>item.source)
  const polityId=chosen.governingPolityId||chosen.id
  const successionEdges=successionEdgesForPolity(polityId)
  const feudatories=feudatoryRelationsForPolity(polityId)
  const divisions=administrativeDivisionsForPolity(polityId)
  const scripts=scriptsForPolity(polityId)
  return <aside className="detail-panel"><div className="detail-accent" style={{background:chosen.color}}></div><div className={`review-badge ${chosen.review.status}`}>{chosen.review.status}</div>{recordAuthorityCited(chosen,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}<p className="eyebrow">{chosen.start}–{chosen.end} {t.ce} · {locale==='kn'?t.yearPrecision:chosen.date.precision}</p><h2>{primary(chosen.name,locale)}</h2><p className="entity-secondary">{secondary(chosen.name,locale)}</p><p>{primary(chosen.description,locale)}</p>{locale==='kn'&&chosen.description.kn&&<p className="english-support" lang="en">{chosen.description.en}</p>}{chosen.interpretation&&<p className="governance-interpretation"><strong>{locale==='kn'?'ವ್ಯಾಪ್ತಿಯ ಸೂಚನೆ':'Scope note'}:</strong> {primary(chosen.interpretation,locale)}</p>}<dl><div><dt>{t.stableId}</dt><dd>{chosen.id}</dd></div><div><dt>{t.capital}</dt><dd><strong>{primary(chosen.capitalName,locale)}</strong><small>{secondary(chosen.capitalName,locale)}</small></dd></div><div><dt>{t.boundaryPrecision}</dt><dd>{chosen.extent.precision}</dd></div>{chosen.governanceType&&<div><dt>{locale==='kn'?'ಆಡಳಿತದ ಸ್ವರೂಪ':'Governance type'}</dt><dd>{chosen.governanceType.replaceAll('-',' ')}</dd></div>}</dl><h3>{t.rulers}</h3><div className="participant-list ruler-links">{chosen.rulers.map(person=><button type="button" key={person.id} onClick={()=>onChoosePerson(person)}><strong>{primary(person.name,locale)}</strong><span>{secondary(person.name,locale)}</span></button>)}</div>{successionEdges.length>0&&<SuccessionNetwork edges={successionEdges} locale={locale} onChoosePerson={onChoosePerson}/>}<FeudatoryHierarchy items={feudatories} polityId={polityId} locale={locale}/><AdministrativeGeography items={divisions} locale={locale}/><ScriptTimeline items={scripts} locale={locale}/><LiteratureShowcase works={literatureWorks} year={year} locale={locale} t={t} onChooseWork={onChooseWork} usesNearest={usesNearestLiterature}/><InscriptionShowcase items={inscriptionRecords} year={year} locale={locale} t={t} onChooseInscription={onChooseInscription}/><h3>{t.sources}</h3>{citations.length?<div className="citations">{citations.map(item=><p key={item.sourceId}><strong>{primary(item.source.title,locale)}</strong><ProvenanceBadge tier={sourceTiers.get(item.sourceId)} locale={locale} short/><span>{secondary(item.source.title,locale)} · {item.locator}</span></p>)}</div>:<p className="muted">{t.noSources}</p>}</aside>
}

function EvidenceChecks({verification,t}){
  const checks=verification.verificationChecks
  if(!checks)return null
  return <div className="evidence-checks" aria-label={t.verificationChecks}><strong>{t.verificationChecks}</strong>{[['photoLicence',t.photoLicenceCheck],['protectionRegister',t.protectionRegisterCheck],['managingAuthority',t.managerCheck],['currentCondition',t.conditionCheck]].map(([key,label])=><span key={key} className={checks[key]?.status||'not-provided'}><i>{checks[key]?.status==='verified'||checks[key]?.status==='matched'||checks[key]?.status==='identified'?'✓':'!'}</i>{label}: {t.checkStatusLabels[checks[key]?.status]||checks[key]?.status}</span>)}</div>
}

function AuditMapViewport({points}){
  const map=useMap(),pointKey=points.map(point=>point.join(',')).join('|')
  useEffect(()=>{if(points.length>1)map.fitBounds(points,{padding:[24,24],maxZoom:8});else if(points[0])map.setView(points[0],7)},[map,pointKey])
  return null
}

function AuditMap({kind,locale,t,districtGeojson,heritageSites=[],inscriptions=[],candidates=[]}){
  const isDistricts=kind==='districts'
  const markers=useMemo(()=>isDistricts?heritageSites.map(site=>{const point=site.verification?.coordinates;return point&&Number.isFinite(point.latitude)&&Number.isFinite(point.longitude)?{id:site.id,coords:[point.latitude,point.longitude],name:site.name,context:site.district,kind:'heritage',status:site.verification.verificationStatus,category:site.category}:null}).filter(Boolean):[...inscriptions.map(item=>{const place=placeById.get(item.placeId),[lng,lat]=place?.location?.coordinates||[];return Number.isFinite(lat)&&Number.isFinite(lng)?{id:item.id,coords:[lat,lng],name:item.name,context:place?.name,kind:'inscription',status:item.review?.status,year:item.date?.from}:null}),...candidates.map(item=>{const point=item.resolution?.coordinates||item.coordinates;return point&&Number.isFinite(point.latitude)&&Number.isFinite(point.longitude)?{id:item.id,coords:[point.latitude,point.longitude],name:item.name,context:item.place,kind:'candidate',status:item.review?.status||'needs-review',year:item.date?.from}:null}).filter(Boolean)],[isDistricts,heritageSites,inscriptions,candidates])
  const title=isDistricts?(locale==='kn'?'ಜಿಲ್ಲಾ ಪರಂಪರೆ ಸ್ಥಳ ನಕ್ಷೆ':'District heritage sites map'):(locale==='kn'?'ಜಿಲ್ಲಾವಾರು ಶಾಸನ ನಕ್ಷೆ':'District inscription map')
  const note=isDistricts?(locale==='kn'?'ಪರಿಶೀಲನಾ ಅಭ್ಯರ್ಥಿಗಳ ಸ್ಥಳಗಳನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ಹೋಲಿಸಿ; ಸ್ಥಿತಿ ಮತ್ತು ಆಕರವನ್ನು ಕೆಳಗಿನ ಪಟ್ಟಿಯಲ್ಲಿ ತೆರೆಯಿರಿ.':'Compare mapped heritage candidates; open the status and sources in the list below.'):(locale==='kn'?'ನಕ್ಷೆಯ ಗುರುತುಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಸಂಬಂಧಿತ ಜಿಲ್ಲೆ ಮತ್ತು ಶಾಸನ候 ಅಭ್ಯರ್ಥಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.':'Use the markers to compare mapped inscriptions and candidate locations by district.')
  return <section className={`audit-map audit-map-${kind}`} aria-label={title}><div className="audit-map-heading"><div><p className="eyebrow">{locale==='kn'?'ನಕ್ಷೆ ವೀಕ್ಷಣೆ':'Map view'}</p><h3>{title}</h3><p>{note}</p></div><span>{markers.length} {locale==='kn'?'ಸ್ಥಳಗಳು':'locations'}</span></div><MapContainer center={[15.3,75.7]} zoom={6} minZoom={5} scrollWheelZoom={false}><AuditMapViewport points={markers.map(marker=>marker.coords)}/><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{isDistricts&&districtGeojson&&<GeoJSON interactive={false} data={districtGeojson} style={{color:'#8790b5',weight:1,fillColor:'#e8ebff',fillOpacity:.12,dashArray:'4 5'}}/>}{markers.map(marker=>{const pending=!reviewedStatuses.has(marker.status);return <CircleMarker key={marker.id} center={marker.coords} radius={marker.kind==='candidate'?5:4} pathOptions={{color:pending?'#b06a1f':'#3f37c9',fillColor:pending?'#fff0c9':'#5361c9',fillOpacity:pending?.55:.9,weight:pending?3:1.5,dashArray:pending?'3 4':null}}><Popup><strong>{primary(marker.name,locale)}</strong><br/><small>{primary(marker.context,locale)}{marker.year?` · ${marker.year} ${locale==='kn'?'ಕ್ರಿ.ಶ.':'CE'}`:''}</small><br/><span>{pending?t.pendingHumanReview:marker.kind==='heritage'?t.verificationLabels[marker.status]||marker.status:marker.kind==='candidate'?(locale==='kn'?'ಸಂಶೋಧನಾ ಅಭ್ಯರ್ಥಿ':'Research candidate'):(locale==='kn'?'ನಕ್ಷೆಗೊಳಿಸಿದ ಶಾಸನ':'Mapped inscription')}</span></Popup></CircleMarker>})}</MapContainer><div className="audit-map-legend"><span><i className="audit-map-dot mapped"></i>{isDistricts?(locale==='kn'?'ಪರಂಪರೆ ಅಭ್ಯರ್ಥಿ':'Heritage candidate'):(locale==='kn'?'ನಕ್ಷೆಗೊಳಿಸಿದ ಶಾಸನ':'Mapped inscription')}</span><span><i className="audit-map-dot candidate"></i>{t.pendingHumanReview}</span>{isDistricts&&<span><i className="audit-map-boundary"></i>{locale==='kn'?'ಜಿಲ್ಲಾ ಗಡಿ':'District boundary'}</span>}</div></section>
}

function DistrictAuditSection({locale,t,districtGeojson}){
  const categories=Object.keys(atlasData.heritageAudits[0]?.categoryCoverage||{})
  const [category,setCategory]=useState('all')
  const [authority,setAuthority]=useState('all')
  const [auditQuery,setAuditQuery]=useState('')
  const filtered=atlasData.heritageAudits.filter(audit=>{
    const haystack=`${audit.district.en} ${audit.district.kn} ${audit.prioritySites.flatMap(site=>[site.name.en,site.name.kn]).join(' ')}`.toLowerCase()
    const authorityMatch=authority==='all'||audit.prioritySites.some(site=>heritageAuthorityTags(site).includes(authority))
    return haystack.includes(auditQuery.toLowerCase())&&authorityMatch&&(category==='all'||audit.categoryCoverage[category]!=='unassessed')
  })
  const allSites=atlasData.heritageAudits.flatMap(audit=>audit.prioritySites)
  const resolved=allSites.filter(site=>site.verification.verificationStatus!=='research-pending').length
  return <section className="district-audit" id="district-audit"><div className="audit-head"><div><p className="eyebrow">{t.seeded} · 31 · {resolved}/{allSites.length} {t.candidatesResolved}</p><h2>{t.districtAuditTitle}</h2><p>{t.districtAuditIntro}</p></div><label><span>{t.searchDistricts}</span><input value={auditQuery} onChange={event=>setAuditQuery(event.target.value)} placeholder={t.searchDistricts}/></label></div><AuditMap kind="districts" locale={locale} t={t} districtGeojson={districtGeojson} heritageSites={allSites}/><div className="audit-filters"><button className={category==='all'?'active':''} onClick={()=>setCategory('all')}>{t.allCategories}</button>{categories.map(value=><button key={value} className={category===value?'active':''} onClick={()=>setCategory(value)}>{t.heritageCategoryLabels[value]}</button>)}<select aria-label={t.heritageAuthorityFilter} value={authority} onChange={event=>setAuthority(event.target.value)}>{Object.entries(t.heritageAuthorityLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div><p className="audit-count"><strong>{filtered.length}</strong> {t.districtsShown}</p><div className="audit-grid">{filtered.map(audit=><article key={audit.id}><div className="audit-card-head"><div><h3>{primary(audit.district,locale)}</h3><p>{secondary(audit.district,locale)}</p></div><span>{audit.region}</span></div><div className="coverage-strip">{categories.map(value=><i key={value} className={audit.categoryCoverage[value]} title={`${t.heritageCategoryLabels[value]}: ${t[audit.categoryCoverage[value]]||audit.categoryCoverage[value]}`}></i>)}</div><div className="audit-sites">{audit.prioritySites.filter(site=>(category==='all'||site.category===category)&&(authority==='all'||heritageAuthorityTags(site).includes(authority))).map(site=>{const verification=site.verification;const photo=verification.photographs[0];const authorityLabels=heritageAuthorityTags(site).map(tag=>t.heritageAuthorityLabels[tag]).join(' · ');return <details key={site.id} className={`heritage-site ${verification.verificationStatus}`}><summary><span>{t.heritageCategoryLabels[site.category]}</span><strong>{primary(site.name,locale)}</strong><small>{secondary(site.name,locale)} · {t.verificationLabels[verification.verificationStatus]} · {authorityLabels}</small></summary><div className="site-evidence">{photo&&<figure><img loading="lazy" src={photo.url} alt={primary(site.name,locale)}/><figcaption><a href={photo.sourceUrl} target="_blank" rel="noreferrer">{t.photoSource}</a> · {photo.credit} · {photo.licenseStatus}</figcaption></figure>}<EvidenceChecks verification={verification} t={t}/><p><b>{t.heritageAuthorityFilter}</b> {authorityLabels}</p>{verification.coordinates&&<p><b>{t.coordinates}</b>{verification.coordinates.latitude.toFixed(5)}, {verification.coordinates.longitude.toFixed(5)} · {verification.coordinates.precision}</p>}{verification.constructionPhases.map((phase,index)=><p key={index}><b>{t.constructionPhase}</b>{primary(phase.name,locale)} · {evidenceDateLabel(phase.date,locale)}</p>)}<p><b>{t.protectionStatus}</b>{verification.protectionStatus.length?verification.protectionStatus.map(item=>primary(item.designation,locale)).join(', '):t.researchPending}</p><p><b>{t.managingAuthority}</b>{verification.managingAuthorities.length?verification.managingAuthorities.map(item=>primary(item.name,locale)).join(', '):t.researchPending}</p><div className="site-citations">{verification.siteCitations.map((citation,index)=><a key={index} href={citation.url} target="_blank" rel="noreferrer">{citation.title} ↗</a>)}</div><small>{primary(verification.verificationNote,locale)}</small></div></details>})}</div><p className="audit-note">{primary(audit.methodologyNote,locale)}</p></article>)}</div></section>
}

const heritageDistrictAliases={Bagalakote:'Bagalkote',Ballary:'Ballari',Bellary:'Ballari',Bangalore:'Bengaluru Urban','Bangalore Urban':'Bengaluru Urban',Bangaluru:'Bengaluru Urban','Bangalore rural':'Bengaluru Rural','Bangalore Rural':'Bengaluru Rural',Belgaum:'Belagavi',Bijapur:'Vijayapura',Chikkamagalur:'Chikkamagaluru',Chikmagalur:'Chikkamagaluru','Coorg (Kodagu)':'Kodagu','Coorg-Kodagu':'Kodagu',Davangere:'Davanagere',Gulbarga:'Kalaburagi',Mysore:'Mysuru','ಮೈಸೂರು':'Mysuru',Ramnagar:'Ramanagara',Ramnagara:'Ramanagara',Shimoga:'Shivamogga',Tumkur:'Tumakuru'}
const canonicalHeritageDistrict=value=>heritageDistrictAliases[value]||value

function HeritageInventorySection({locale,t}){
  const [query,setQuery]=useState('')
  const [limit,setLimit]=useState(24)
  const [protection,setProtection]=useState('all')
  const [district,setDistrict]=useState('all')
  const needle=query.trim().toLowerCase()
  const auditedDistricts=new Map(atlasData.heritageAudits.map(item=>[canonicalHeritageDistrict(item.district.en),item.district]))
  const districtKeys=[...new Set(atlasData.heritageInventoryLeads.map(item=>canonicalHeritageDistrict(item.district.en)))].sort((a,b)=>primary(auditedDistricts.get(a)||{en:a,kn:a},locale).localeCompare(primary(auditedDistricts.get(b)||{en:b,kn:b},locale)))
  const matches=atlasData.heritageInventoryLeads.filter(item=>(!needle||JSON.stringify(item).toLowerCase().includes(needle))&&(protection==='all'||item.protectionLevel===protection)&&(district==='all'||canonicalHeritageDistrict(item.district.en)===district))
  const sources=new Map(atlasData.heritageInventoryLeads.map(item=>[item.sourceId,item.sourceUrl]))
  const resetLimit=()=>setLimit(24)
  return <section className="heritage-inventory-section"><div className="heritage-inventory-head"><div><p className="eyebrow">{locale==='kn'?'ಸಂಶೋಧನಾ ಸಮಗ್ರ ಪಟ್ಟಿ · ಪರಿಶೀಲನೆ ಬಾಕಿ':'Research inventory · needs review'}</p><h2>{locale==='kn'?'ದೇವಾಲಯ, ಕೋಟೆ ಮತ್ತು ಸ್ಮಾರಕ ಅನ್ವೇಷಣಾ ಪಟ್ಟಿ':'Temple, fort and monument discovery inventory'}</h2><p>{locale==='kn'?'ಆಕರ ಪಟ್ಟಿಗಳಿಂದ ಆಮದು ಮಾಡಿದ ಅಭ್ಯರ್ಥಿಗಳು. ಪ್ರಾಧಿಕಾರದ ಪಟ್ಟಿ, ನಿರ್ದೇಶಾಂಕ, ಕಾಲ–ವಂಶ ಸಂಬಂಧ ಮತ್ತು ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯೊಂದಿಗೆ ಹೊಂದಿದ ನಂತರವೇ ಪರಿಶೀಲಿತ ತಾಣವಾಗಿ ಉತ್ತೇಜಿಸಲಾಗುತ್ತದೆ.':'Candidates imported from attributed discovery and authority lists. A record is promoted as verified only after its authority register, coordinates, chronology, attribution and present condition are reconciled.'}</p></div><label><span>{t.searchDistricts}</span><input value={query} onChange={event=>{setQuery(event.target.value);resetLimit()}} placeholder={locale==='kn'?'ಜಿಲ್ಲೆ, ತಾಣ, ವರ್ಗ…':'District, site, category…'}/></label></div><div className="heritage-inventory-filters"><label><span>{t.heritageInventoryProtection}</span><select value={protection} onChange={event=>{setProtection(event.target.value);resetLimit()}}>{Object.entries(t.heritageInventoryProtectionLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label><span>{t.heritageInventoryDistrict}</span><select value={district} onChange={event=>{setDistrict(event.target.value);resetLimit()}}><option value="all">{t.allDistricts}</option>{districtKeys.map(value=>{const item=auditedDistricts.get(value)||{en:value,kn:value};return <option key={value} value={value}>{primary(item,locale)}</option>})}</select></label></div><div className="heritage-inventory-stats"><span><b>{matches.length}</b>{locale==='kn'?'ಹೊಂದುವ ಅಭ್ಯರ್ಥಿಗಳು':'matching candidates'}</span><span><b>{atlasData.heritageInventoryLeads.length}</b>{locale==='kn'?'ಒಟ್ಟು ಆಮದು':'total imported'}</span><span><b>{sources.size}</b>{locale==='kn'?'ಮೂಲ ಪಟ್ಟಿಗಳು':'source lists'}</span></div><details className="heritage-inventory-sources"><summary>{locale==='kn'?'ಆಕರ ಪಟ್ಟಿಗಳನ್ನು ನೋಡಿ':'View source indexes'}</summary><div>{[...sources].map(([sourceId,url])=><a key={sourceId} href={url} target="_blank" rel="noreferrer">{sourceId.replace('src-wikipedia-heritage-','').replaceAll('-',' ')} ↗</a>)}</div></details><div className="heritage-inventory-preview">{matches.slice(0,limit).map(item=>{const protectionLabel=t.heritageInventoryProtectionLabels[item.protectionLevel]||item.protectionLevel;return <article key={item.id}><span>{item.category} · {primary(item.district,locale)}</span><strong>{primary(item.name,locale)}</strong><small>{item.locationLabel||t.researchPending}</small><b className={`heritage-protection-badge ${item.protectionLevel}`}>{protectionLabel}</b>{item.registryId&&<small>{t.heritageRegistryId}: {item.registryId}</small>}{item.designationStatus==='unverified'&&<em>{t.heritageDesignationUnverified}</em>}<em>{t.pendingHumanReview}</em></article>})}</div>{limit<matches.length&&<button className="inventory-load-more" onClick={()=>setLimit(value=>value+24)}>{locale==='kn'?`ಇನ್ನೂ 24 ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಿ · ${matches.length-limit} ಬಾಕಿ`:`Show 24 more · ${matches.length-limit} remaining`}</button>}</section>
}

function ReviewCandidatePopup({item,locale,t,compact=false}){
  return <div className={`review-candidate-popup ${compact?'compact':''}`}><strong>{primary(item.name,locale)}</strong>{!compact&&secondary(item.name,locale)&&<><br/><span>{secondary(item.name,locale)}</span></>}<br/><b>{t.reviewCandidateCategory}:</b> {t.reviewCategoryLabels[item.recordKind]||item.recordKind}{!compact&&<>{item.startYear!=null&&<><br/>{timelineYearLabel(item.startYear,locale)}{item.endYear!=null&&item.endYear!==item.startYear?`–${timelineYearLabel(item.endYear,locale)}`:''}</>}{item.placeLabel&&<><br/>{primary(item.placeLabel,locale)}</>}<br/><small>{primary(item.description,locale)||t.publicReviewNote}</small>{item.sourceTitle&&<><br/>{item.sourceUrl?<SourceLink href={item.sourceUrl} label={primary(item.sourceTitle,locale)} locale={locale}/>:primary(item.sourceTitle,locale)}{item.sourceLocator&&<><br/><small>{item.sourceLocator}</small></>}{recordAuthorityCited(item,sourceTiers)&&<ProvenanceBadge tier="authority" locale={locale} short/>}</>}</>}<br/><a href="#community">{t.contributeReview} →</a></div>
}

function PublicDataDepth({t}){
  return <details className="public-data-depth"><summary><span>{t.dataDepth}</span><b>{publicDataDepth.totalRecords.toLocaleString('en-IN')}</b></summary><div className="public-data-depth-panel" aria-label={t.dataDepth}><span><b>{publicDataDepth.totalRecords.toLocaleString('en-IN')}</b> {t.publicRecords}</span><span><b>{publicDataDepth.researchLeads.toLocaleString('en-IN')}</b> {t.publicResearchLeads}</span><span><b>{publicDataDepth.sources.toLocaleString('en-IN')}</b> {t.publicSources}</span><span><b>{publicDataDepth.relationships.toLocaleString('en-IN')}</b> {t.publicRelationships}</span></div></details>
}

function InscriptionAuditSection({locale,t,onChooseInscription,districtGeojson}){
  const [status,setStatus]=useState('all')
  const [auditQuery,setAuditQuery]=useState('')
  const seeded=atlasData.inscriptionAudits.filter(audit=>audit.inscriptionIds.length>0).length
  const candidateDistricts=atlasData.inscriptionAudits.filter(audit=>audit.priorityCandidates.length>0).length
  const candidateCount=atlasData.inscriptionAudits.reduce((total,audit)=>total+audit.priorityCandidates.length,0)
  const needle=auditQuery.toLowerCase()
  const records=atlasData.inscriptionAudits.filter(audit=>(status==='all'||audit.auditStatus===status)&&`${audit.district.en} ${audit.district.kn} ${audit.inscriptionIds.map(id=>primary(inscriptionById.get(id)?.name,locale)).join(' ')} ${audit.priorityCandidates.flatMap(item=>[item.name.en,item.name.kn,item.place.en,item.place.kn]).join(' ')}`.toLowerCase().includes(needle))
  const dateLabel=date=>date.precision==='unknown'?(locale==='kn'?'ದಿನಾಂಕ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ':'Date under review'):`${date.precision==='circa'?(locale==='kn'?'ಸು. ':'c. '):''}${date.from}${date.to!==date.from?`–${date.to}`:''} ${date.era==='BCE'?(locale==='kn'?'ಕ್ರಿ.ಪೂ.':'BCE'):(locale==='kn'?'ಕ್ರಿ.ಶ.':'CE')}`
  return <section className="inscription-audit" id="inscription-audit">
    <div className="inscription-audit-head"><div><p className="eyebrow">{seeded}/31 {t.districtsSeeded} · {candidateDistricts} {t.candidateIdentified} · {candidateCount} {t.priorityCandidates}</p><h2>{t.inscriptionAuditTitle}</h2><p>{t.inscriptionAuditIntro}</p></div><label><span>{t.searchDistricts}</span><input value={auditQuery} onChange={event=>setAuditQuery(event.target.value)} placeholder={t.searchDistricts}/></label></div><AuditMap kind="inscriptions" locale={locale} t={t} districtGeojson={districtGeojson} inscriptions={records.flatMap(audit=>audit.inscriptionIds.map(id=>inscriptionById.get(id)).filter(Boolean))} candidates={records.flatMap(audit=>audit.priorityCandidates)}/>
    <div className="inscription-audit-filters"><button className={status==='all'?'active':''} onClick={()=>setStatus('all')}>{t.allDistricts}</button><button className={status==='seeded'?'active':''} onClick={()=>setStatus('seeded')}>{t.seeded}</button><button className={status==='candidate-identified'?'active':''} onClick={()=>setStatus('candidate-identified')}>{t.candidateIdentified}</button><button className={status==='unassessed'?'active':''} onClick={()=>setStatus('unassessed')}>{t.unassessed}</button></div>
    <div className="inscription-audit-grid">{records.map(audit=><article key={audit.id} className={audit.auditStatus}>
      <div><h3>{primary(audit.district,locale)}</h3><small>{secondary(audit.district,locale)}</small></div>
      <span>{audit.inscriptionIds.length?`${audit.inscriptionIds.length} ${t.inscriptions}`:`${audit.priorityCandidates.length} ${t.priorityCandidates}`}</span>
      {audit.reviewPass&&<div className="inscription-review-pass"><b>{locale==='kn'?'ಜಿಲ್ಲಾ ಪರಿಶೀಲನಾ ಪಾಸ್':'District review pass'}</b><strong>{primary(audit.reviewPass.focus,locale)}</strong><small>{audit.reviewPass.status} · {audit.reviewPass.checkedAt}</small><em>{primary(audit.reviewPass.next,locale)}</em></div>}
      {audit.inscriptionIds.length>0&&<div className="inscription-audit-records">{audit.inscriptionIds.map(id=>{const item=inscriptionById.get(id);const polity=item?.polity||entityById.get(item?.polityId);return item&&<button key={id} onClick={()=>onChooseInscription(item)}><b>{item.year}</b><strong>{primary(item.name,locale)}</strong><small>{primary(polity?.name,locale)} · {item.languages.join(', ')} · {item.scripts.join(', ')}</small></button>})}</div>}
      {audit.priorityCandidates.length>0&&<div className="inscription-candidate-records">{audit.priorityCandidates.map(item=>{const citation=item.citations[0];const source=sourceById.get(citation.sourceId);return <details key={item.id}><summary><b>{dateLabel(item.date)}</b><strong>{primary(item.name,locale)}</strong><small>{primary(item.place,locale)} · {t.corpusLocated}</small></summary><div><p>{primary(item.researchNote,locale)}</p>{source?.url&&<SourceLink href={source.url} label={t.openCandidateSource} locale={locale}/>}<small>{citation.locator}</small><code>{item.id}</code></div></details>})}</div>}
      {!audit.inscriptionIds.length&&!audit.priorityCandidates.length&&<p>{t.inscriptionResearchGap}</p>}
      <p className="inscription-audit-note">{primary(audit.methodologyNote,locale)}</p>
    </article>)}</div>
  </section>
}

export default function App(){
  const publicViews=['atlas','relations','people','freedom','literature','epigraphy','districts','district-history','inscriptions','trails','evidence','research','community','profile','about']
  const normalizeView=hash=>hash==='history'?'district-history':hash
  const initialHash=normalizeView(window.location.hash.slice(1))
  const [initialShareState]=useState(()=>readAtlasUrlState(window.location.search))
  const [admin,setAdmin]=useState(()=>window.location.hash.slice(1)==='admin')
  const [view,setView]=useState(()=>publicViews.includes(initialHash)?initialHash:'atlas')
  const [locale,setLocale]=useState(getInitialLocale)
  const [year,setYear]=useState(()=>initialShareState.year??firstTimelineStory?.year??MIN_YEAR)
  const [atlasMapView]=useState(()=>initialShareState.map||{lat:14.7,lng:76.2,zoom:6.35})
  const [mapZoom,setMapZoom]=useState(()=>initialShareState.map?.zoom||6.35)
  const [mapLegendOpen,setMapLegendOpen]=useState(()=>typeof window==='undefined'||!window.matchMedia('(max-width: 1366px), (any-pointer: coarse)').matches)
  const [reviewOptionsOpen,setReviewOptionsOpen]=useState(false)
  const [compareYear,setCompareYear]=useState(null)
  const [selected,setSelected]=useState(null)
  const [selectedEvent,setSelectedEvent]=useState(null)
  const [selectedTerritory,setSelectedTerritory]=useState(null)
  const [selectedCulture,setSelectedCulture]=useState(null)
  const [selectedPerson,setSelectedPerson]=useState(null)
  const [selectedWork,setSelectedWork]=useState(null)
  const [selectedInscription,setSelectedInscription]=useState(null)
  const [selectedPeriodicalSite,setSelectedPeriodicalSite]=useState(null)
  const [selectedSearchPlace,setSelectedSearchPlace]=useState(()=>initialShareState.year==null&&!initialShareState.map&&firstTimelineStory?.coords?{coords:firstTimelineStory.coords,reviewCandidateId:firstTimelineStory.id,overview:true}:null)
  const [scope,setScope]=useState('karnataka')
  const [layers,setLayers]=useState({boundaries:true,territorialReach:true,districts:true,heritageSites:true,culture:true,periodicals:true,artifacts:true,temples:true,inscriptions:true,researchCandidates:true,events:true,people:true,modern:true})
  const [query,setQuery]=useState('')
  const [searchFilters,setSearchFilters]=useState({kind:'all',century:'all',polity:'all',language:'all',script:'all',district:'all',review:'all'})
  const [districtGeojson,setDistrictGeojson]=useState(null)
  const [selectedDistrict,setSelectedDistrict]=useState('all')
  const [heritageCategory,setHeritageCategory]=useState('all')
  const [heritageAuthority,setHeritageAuthority]=useState('all')
  const [showAllHeritage,setShowAllHeritage]=useState(false)
  const [showAllInscriptions,setShowAllInscriptions]=useState(false)
  const [showAllReviewCandidates,setShowAllReviewCandidates]=useState(false)
  const [mapTheme,setMapTheme]=useState(()=>localStorage.getItem('karnataka-atlas-map-theme')||'modern')
  const [mapOnlyMode,setMapOnlyMode]=useState(false)
  const [communityUser,setCommunityUser]=useState(null)
  const [mobileNavOpen,setMobileNavOpen]=useState(false)
  useEffect(()=>{document.documentElement.lang=locale},[locale])
  useEffect(()=>{localStorage.setItem('karnataka-atlas-map-theme',mapTheme)},[mapTheme])
  useEffect(()=>{
    if(!mapOnlyMode)return
    const step=event=>{
      if(['INPUT','SELECT','TEXTAREA'].includes(event.target?.tagName))return
      const delta=event.key==='ArrowLeft'?-10:event.key==='ArrowRight'?10:event.key==='ArrowDown'?-1:event.key==='ArrowUp'?1:0
      if(!delta)return
      event.preventDefault()
      setYear(value=>Math.max(MIN_YEAR,Math.min(MAX_YEAR,value+delta)))
      clearRecordDetails()
    }
    window.addEventListener('keydown',step)
    return()=>window.removeEventListener('keydown',step)
  },[mapOnlyMode])
  const lastShareYear=useRef(year)
  const replaceShareUrl=state=>{const next=updateAtlasUrlState(state);window.history.replaceState(null,'',`${next.pathname}${next.search}${next.hash}`)}
  useEffect(()=>{if(lastShareYear.current===year)return;lastShareYear.current=year;if(view==='atlas')replaceShareUrl({year})},[year,view])
  // Hydrate the parent auth state once from the live session. Do not clear a
  // successful login because a transient API request fails during navigation;
  // that used to make the epigraphy explorer hide Bengaluru after login.
  useEffect(()=>{let active=true;fetch(`${import.meta.env.VITE_COMMUNITY_API_URL||''}/api/auth/me`,{credentials:'include'}).then(response=>response.ok?response.json():null).then(data=>{if(active&&data?.user)setCommunityUser(data.user)}).catch(()=>{});return()=>{active=false}},[])
  useEffect(()=>{const syncHash=()=>{const rawHash=window.location.hash.slice(1);const hash=normalizeView(rawHash);setAdmin(rawHash==='admin');if(rawHash==='history')window.history.replaceState(null,'','#district-history');if(publicViews.includes(hash))setView(hash);else if(hash!=='admin')setView('atlas')};if(window.location.hash.slice(1)==='history')window.history.replaceState(null,'','#district-history');window.addEventListener('hashchange',syncHash);return()=>window.removeEventListener('hashchange',syncHash)},[])
  useEffect(()=>{setMobileNavOpen(false)},[view])
  useEffect(()=>{const [title,description]=seoPages[view]?.[locale]||seoPages.atlas[locale];document.documentElement.lang=locale;document.title=title;const descriptionMeta=document.querySelector('meta[name="description"]');if(descriptionMeta)descriptionMeta.setAttribute('content',description);const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.setAttribute('content',title);const ogDescription=document.querySelector('meta[property="og:description"]');if(ogDescription)ogDescription.setAttribute('content',description);let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical)}canonical.href=`${window.location.origin}${window.location.pathname}`},[view,locale])
  const t=messages[locale]
  useEffect(()=>{let active=true;fetch(`${import.meta.env.BASE_URL}karnataka-districts.geojson`).then(response=>response.json()).then(data=>{if(active)setDistrictGeojson(data)}).catch(()=>{if(active)setDistrictGeojson(null)});return()=>{active=false}},[])
  const searchIndex=useMemo(()=>[
    ...kingdoms.map(record=>({kind:'polity',id:record.id,name:record.name,year:record.date.from,polityId:record.governingPolityId||record.id,review:record.review?.status,record})),
    ...atlasData.people.map(record=>({kind:'person',id:record.id,name:record.name,year:record.date?.from,polityId:record.polityId,review:record.review?.status,record})),
    ...atlasData.works.map(record=>({kind:'work',id:record.id,name:record.name,year:record.date.from,polityId:record.polityId,languages:record.languages,review:record.review?.status,record})),
    ...primaryAtlasInscriptions.map(record=>({kind:'inscription',id:record.id,name:record.name,year:record.year,polityId:record.polityId,polityName:record.polity?.name||entityById.get(record.polityId)?.name||null,districtId:record.districtAuditId,languages:record.languages,scripts:record.scripts,review:record.review?.status,coords:record.coords,record})),
    ...primaryAtlasEvents.map(record=>({kind:'event',id:record.id,name:record.name,year:record.year,polityIds:record.participants.map(participant=>participant.polityId),review:record.review?.status,coords:record.coords,record})),
    ...culturalRecords.map(record=>({kind:'culture',id:record.id,name:record.name,year:record.date.from,polityIds:record.polityIds,review:record.review?.status,coords:record.coords,record})),
    ...artifactMapRecords.map(record=>({kind:'artifact',id:record.id,name:record.name,year:record.date.from,polityId:record.polityId,review:record.review?.status,coords:record.coords,record})),
    ...atlasData.places.map(record=>({kind:'place',id:record.id,name:record.name,year:null,review:record.review?.status,coords:[record.location.coordinates[1],record.location.coordinates[0]],record})),
    ...heritageCandidates.map(record=>({kind:'heritage',id:record.id,name:record.name,year:record.startYear,districtId:record.auditId,review:record.verification.verificationStatus,coords:record.coords,record})),
    ...atlasData.districtHistoryResearch.map(record=>({kind:'districtHistory',id:record.id,name:record.name,year:record.date?.from,districtId:record.districtId,review:record.review?.status,coords:record.location?.coordinates?[record.location.coordinates[1],record.location.coordinates[0]]:null,record})),
  ].map(item=>({...item,searchText:JSON.stringify(item.record).toLowerCase()})),[])
  const searchResults=useMemo(()=>{const needle=query.trim().toLowerCase();return searchIndex.filter(item=>{
    const century=item.year?Math.floor((item.year-1)/100)+1:null
    return (!needle||item.searchText.includes(needle))&&(searchFilters.kind==='all'||item.kind===searchFilters.kind)&&(searchFilters.century==='all'||century===Number(searchFilters.century))&&(searchFilters.polity==='all'||item.polityId===searchFilters.polity||item.polityIds?.includes(searchFilters.polity))&&(searchFilters.language==='all'||item.languages?.includes(searchFilters.language))&&(searchFilters.script==='all'||item.scripts?.includes(searchFilters.script))&&(searchFilters.district==='all'||item.districtId===searchFilters.district)&&(searchFilters.review==='all'||item.review===searchFilters.review)
  }).slice(0,20)},[query,searchFilters,searchIndex])
  const active=useMemo(()=>kingdoms.filter(k=>year>=k.start&&year<=k.end),[year])
  const activeCapitalIds=useMemo(()=>active.map(polity=>polity.capitalId),[active])
  const visible=active
  const overlapNames=active.length>1?active.map(polity=>primary(polity.name,locale)).join(' · '):''
  const chosen=visible.find(k=>k.id===selected)||visible[0]||active[0]||null
  const activeLiterature=useMemo(()=>atlasData.works.filter(work=>active.some(polity=>polity.id===work.polityId)&&Math.abs(work.date.from-year)<=125).sort((a,b)=>Math.abs(a.date.from-year)-Math.abs(b.date.from-year)).slice(0,6),[active,year])
  const literatureWorks=useMemo(()=>activeLiterature.length?activeLiterature:[...atlasData.works].sort((a,b)=>Math.abs(a.date.from-year)-Math.abs(b.date.from-year)).slice(0,4),[activeLiterature,year])
  const activeInscriptions=inscriptionsForMap(primaryAtlasInscriptions,{year,showAll:showAllInscriptions,activePolityIds:new Set(active.flatMap(k=>[k.id,k.governingPolityId].filter(Boolean)))})
  const visibleResearchCandidates=mappedResearchCandidates.filter(item=>year>=item.startYear&&year<=item.endYear)
  const inscriptionRecords=useMemo(()=>[...activeInscriptions].sort((a,b)=>Math.abs(a.year-year)-Math.abs(b.year-year)).slice(0,6),[activeInscriptions,year])
  const activeTerritories=useMemo(()=>territoriesForYear(year),[year])
  const coreTerritories=activeTerritories.filter(item=>item.classification==='core-administered'&&item.polityIds.some(id=>visible.some(polity=>polity.id===id)))
  const highlightedKingdom=chosen
  const highlightedPolityIds=new Set([highlightedKingdom?.id,highlightedKingdom?.governingPolityId].filter(Boolean))
  const highlightedCoreTerritories=coreTerritories.filter(item=>item.polityIds.some(id=>highlightedPolityIds.has(id)))
  const reachTerritories=activeTerritories.filter(item=>item.classification!=='core-administered')
  const highlightedReachTerritories=reachTerritories.filter(item=>item.polityIds.some(id=>highlightedPolityIds.has(id)))
  const comparisonTerritories=useMemo(()=>compareYear==null?[]:territoriesForYear(compareYear),[compareYear])
  const activeTerritoryIds=new Set(activeTerritories.map(item=>item.id))
  const comparisonChanges=comparisonTerritories.filter(item=>!activeTerritoryIds.has(item.id))
  const unchangedTerritoryCount=comparisonTerritories.length-comparisonChanges.length
  const comparisonPositions=useMemo(()=>compareYear==null?[]:[...activeTerritories,...comparisonTerritories].flatMap(item=>item.positions),[activeTerritories,comparisonTerritories,compareYear])
  const activeCulture=culturalRecords.filter(item=>isCultureActive(item,year))
  const activeMapCulture=activeCulture.filter(item=>isTempleRecord(item)?layers.temples:layers.culture)
  const activePeriodicalSites=periodicalMapRecords.filter(site=>site.year==null||site.year<=year)
  const activeArtifacts=artifactMapRecords.filter(item=>item.date.from<=year&&year<=item.date.to)
  const heritageFilterPool=heritageCandidates.filter(site=>(selectedDistrict==='all'||site.auditId===selectedDistrict)&&(heritageCategory==='all'||site.category===heritageCategory)&&(heritageAuthority==='all'||site.authorityTags.includes(heritageAuthority)))
  const visibleHeritage=showAllHeritage?heritageFilterPool:heritageFilterPool.filter(site=>site.startYear!=null&&site.startYear<=year)
  const futureHeritage=heritageFilterPool.filter(site=>site.startYear!=null&&site.startYear>year)
  const undatedHeritage=heritageFilterPool.filter(site=>site.startYear==null)
  const nearbyEvents=primaryAtlasEvents.filter(event=>Math.abs(event.year-year)<=18&&(scope==='world'||(scope==='india'&&event.coords[0]>=5&&event.coords[0]<=38&&event.coords[1]>=67&&event.coords[1]<=98)||(scope==='karnataka'&&event.coords[0]>=10&&event.coords[0]<=19.5&&event.coords[1]>=73&&event.coords[1]<=81)))
  const nearbyConnections=nearbyEvents.filter(event=>event.reach&&event.connectionPositions.length>1)
  const selectedWorkPosition=selectedWork?timelineStories.find(story=>story.storyKind==='literature'&&story.id===selectedWork.id)?.coords:null
  const selectedPersonPosition=selectedPerson?personStories.find(story=>story.id===selectedPerson.id)?.coords:null
  const activePeople=personStories.filter(person=>person.coords&&Math.abs(person.year-year)<=18)
  const alreadyMappedReviewIds=new Set([...activeInscriptions,...activeMapCulture,...activeArtifacts,...visibleHeritage,...nearbyEvents].map(item=>item.id))
  const reviewCandidateInScope=item=>scope==='world'||(scope==='india'&&isIndiaPoint(item.coords))||(scope==='karnataka'&&isKarnatakaPoint(item.coords))
  const visiblePublicReviewCandidates=publicReviewCandidates.filter(item=>!alreadyMappedReviewIds.has(item.id)&&reviewCandidateInScope(item)&&(showAllReviewCandidates||item.startYear!=null&&year>=item.startYear&&year<=(item.endYear??item.startYear)))
  const reviewGridSize=scope==='world'?(mapZoom>=6 ? 1.5 : 6):scope==='india'?(mapZoom>=7 ? .6 : 2.5):(mapZoom>=10 ? .08 : mapZoom>=8 ? .25 : mapZoom>=6 ? .75 : 1.5)
  const reviewCandidateGroups=[...visiblePublicReviewCandidates.reduce((groups,item)=>{const key=`${Math.round(item.coords[0]/reviewGridSize)}:${Math.round(item.coords[1]/reviewGridSize)}`;const group=groups.get(key)||[];group.push(item);groups.set(key,group);return groups},new Map()).entries()].map(([key,items])=>({key,items,coords:[items.reduce((sum,item)=>sum+item.coords[0],0)/items.length,items.reduce((sum,item)=>sum+item.coords[1],0)/items.length]}))
  const changeLocale=()=>setLocale(current=>{const next=current==='kn'?'en':'kn';setStoredLocale(next);return next})
  const handleAuthenticated=user=>{setCommunityUser(user);window.location.hash=user.roles?.includes('administrator')?'admin':'profile'}
  const handleLoggedOut=()=>setCommunityUser(null)
  const clearRecordDetails=()=>{setSelectedPerson(null);setSelectedWork(null);setSelectedInscription(null);setSelectedPeriodicalSite(null);setSelectedSearchPlace(null)}
  const enableMapLayer=key=>setLayers(value=>value[key]?value:{...value,[key]:true})
  const coordinateTimelineCategory=category=>{const layerByCategory={wars:'events',freedom:'events',political:'events',connections:'events',people:'people',inscriptions:'inscriptions',temples:'temples',monuments:'culture',culture:'culture',literature:'periodicals',periodicals:'periodicals',artifacts:'artifacts',reigns:'boundaries',territory:'territorialReach'};const layer=layerByCategory[category];if(layer)enableMapLayer(layer)}
  const chooseEvent=event=>{enableMapLayer('events');setSelectedEvent(event);setSelectedTerritory(null);setSelectedCulture(null);clearRecordDetails();const hasRoute=event.connectionPositions?.length>1;const isKarnataka=isKarnatakaPoint(event.coords);const isIndia=isIndiaPoint(event.coords);if(hasRoute&&event.reach?.scale==='overseas')setScope('world');else if(hasRoute&&isIndia&&!isKarnataka)setScope('india');else if(isKarnataka&&scope==='world')setScope('karnataka')}
  const chooseTerritory=territory=>{enableMapLayer(territory.classification==='core-administered'?'boundaries':'territorialReach');setSelectedTerritory(territory);setSelectedEvent(null);setSelectedCulture(null);clearRecordDetails();if(territory.classification!=='core-administered')setScope('india')}
  const chooseCulture=item=>{enableMapLayer(isTempleRecord(item)?'temples':'culture');setSelectedCulture(item);setSelectedEvent(null);setSelectedTerritory(null);clearRecordDetails();if(item.coords[0]>19.5||item.coords[1]<73||item.coords[1]>81)setScope('india')}
  const chooseWork=work=>{setYear(work.date.from);setSelected(work.polityId);setSelectedWork(work);setSelectedPerson(null);setSelectedInscription(null);setSelectedSearchPlace(null);setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null)}
  const chooseInscription=item=>{enableMapLayer('inscriptions');setYear(item.year);setSelected(item.polityId);setSelectedInscription(item);setSelectedPerson(null);setSelectedWork(null);setSelectedSearchPlace(null);setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null)}
  const choosePerson=(person,anchorYear=null)=>{const story=personStories.find(item=>item.id===person.id);const targetYear=Number.isFinite(anchorYear)?anchorYear:story?.year;if(Number.isFinite(targetYear))setYear(targetYear);if(person.polityId)setSelected(person.polityId);setSelectedPerson(person);setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);setSelectedWork(null);setSelectedInscription(null);setSelectedSearchPlace(null)}
  const choosePersonRecord=(kind,record)=>{if(kind==='person')return choosePerson(record);if(kind==='events')return chooseEvent(record);if(kind==='works')return chooseWork(record);if(kind==='culture')return chooseCulture(record);const ruler=(record.rulerIds||[]).map(id=>personById.get(id)).find(Boolean);if(ruler)return choosePerson(ruler,record.date.from)}
  const chooseTimelineStory=story=>{setYear(story.year);if(story.storyKind==='research-candidate'){enableMapLayer('researchCandidates');clearRecordDetails();if(story.coords)setSelectedSearchPlace({coords:story.coords,reviewCandidateId:story.id});setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);return}if(story.storyKind==='periodical'){enableMapLayer('periodicals');clearRecordDetails();setSelectedPeriodicalSite(story);setSelectedSearchPlace({coords:story.coords,periodicalSiteId:story.id});return}if(story.storyKind==='artifact'){enableMapLayer('artifacts');clearRecordDetails();setSelectedSearchPlace({coords:story.coords,artifactId:story.id});setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);return}if(story.storyKind==='event')return chooseEvent(story);if(story.storyKind==='literature')return chooseWork(story);if(story.storyKind==='person')return choosePerson(story.person);if(story.storyKind==='inscription')return chooseInscription(story);if(story.storyKind==='territory')return chooseTerritory(story);if(story.storyKind==='governance'){enableMapLayer('boundaries');setSelected(story.id);setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);clearRecordDetails();setScope('karnataka');return}if(story.storyKind==='reign'){enableMapLayer('boundaries');const ruler=(story.rulerIds||[]).map(id=>personById.get(id)).find(Boolean);if(ruler)return choosePerson(ruler,story.year);setSelected(story.polityId);clearRecordDetails();setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);return}return chooseCulture(story)}
  const chooseSearchResult=result=>{
    if(result.kind==='work')return chooseWork(result.record)
    if(result.kind==='inscription')return chooseInscription(result.record)
    if(result.kind==='event'){setYear(result.year);return chooseEvent(result.record)}
    if(result.kind==='culture'){setYear(result.year);return chooseCulture(result.record)}
    setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);setSelectedPerson(null);setSelectedWork(null);setSelectedInscription(null)
    if(result.kind==='polity'){const polity=kingdoms.find(item=>item.id===result.id);setSelected(result.id);if(polity&&(year<polity.start||year>polity.end))setYear(polity.start);const place=placeById.get(polity?.capitalId);if(place)setSelectedSearchPlace({coords:[place.location.coordinates[1],place.location.coordinates[0]]});return}
    if(result.kind==='person')return choosePerson(result.record)
    if(result.kind==='artifact'){enableMapLayer('artifacts');setYear(result.year);setSelected(result.polityId);setSelectedSearchPlace({coords:result.coords,artifactId:result.id});return}
    if(result.year)setYear(Math.max(MIN_YEAR,Math.min(MAX_YEAR,result.year)))
    if(result.coords){setSelectedSearchPlace({coords:result.coords});if(result.coords[0]>19.5||result.coords[1]<73||result.coords[1]>81)setScope('india')}
  }
  const returnToStateView=()=>{setScope('karnataka');setCompareYear(null);setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);clearRecordDetails()}
  const closeAdmin=()=>{window.location.hash='atlas';window.location.reload()}
  const navigateView=next=>{setView(next);window.location.hash=next;window.scrollTo({top:0,behavior:'smooth'})}
  const primaryNavItems=[['atlas',t.atlas],['trails',locale==='kn'?'ಕಥಾಮಾರ್ಗ':'Trails'],['relations',locale==='kn'?'ಜಾಗತಿಕ ಸಂಬಂಧಗಳು':'Global relations'],['people',locale==='kn'?'ವ್ಯಕ್ತಿಗಳು':'People'],['freedom',locale==='kn'?'ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ':'Freedom movement'],['literature',locale==='kn'?'ಸಾಹಿತ್ಯ':'Literature'],['epigraphy',locale==='kn'?'ಶಾಸನ ಅನ್ವೇಷಣೆ':'Epigraphy'],['districts',t.districtHeritagePage],['district-history',locale==='kn'?'ಜಿಲ್ಲಾ ಸಮಗ್ರ ಇತಿಹಾಸ':'District deep history'],['inscriptions',locale==='kn'?'ಜಿಲ್ಲಾ ಶಾಸನ':'District inscriptions']]
  const utilityNavItems=[['about',locale==='kn'?'ನಮ್ಮ ಬಗ್ಗೆ':'About'],['research',locale==='kn'?'ಆಕರಗಳು ಮತ್ತು ಸಹಯೋಗ':'Resources & collaboration'],['evidence',locale==='kn'?'ಸಾಕ್ಷ್ಯ ಕಾರ್ಯವಿಧಾನ':'Evidence workflow'],['community',locale==='kn'?'ಕೊಡುಗೆ ನೀಡಿ':'Contribute'],...(communityUser?[['profile',locale==='kn'?'ನನ್ನ ಪ್ರೊಫೈಲ್':'My profile']]:[])]
  const navLink=([key,label],className='')=><a key={key} className={`${className} ${view===key?'active':''}`.trim()} aria-current={view===key?'page':undefined} href={`#${key}`} onClick={event=>{setMobileNavOpen(false);if(key===view){event.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}}}>{label}</a>
  if(admin)return <Suspense fallback={<PortalFallback/>}><Admin onClose={closeAdmin} locale={locale} onLocaleChange={changeLocale}/></Suspense>

  return <div className={`app-shell ${view==='atlas'&&mapOnlyMode?'map-only-atlas':''}`} lang={locale}>
    <header><div className="sanchaya-product-brand"><a className="sanchaya-mark" href="#atlas" aria-label={t.appTitle}><img src={`${import.meta.env.BASE_URL}sanchaya-logo.png`} alt="Sanchaya"/></a><div><p className="eyebrow">{t.digitalAtlas}</p><h1>{t.appTitle}</h1><p className="header-secondary">{t.appSubtitle}</p></div></div><div className="header-actions"><nav className="header-utility-nav" aria-label={locale==='kn'?'ಉಪಯುಕ್ತ ಕೊಂಡಿಗಳು':'Utility links'}>{utilityNavItems.map(item=>navLink(item))}</nav><PwaControls locale={locale} t={t}/><button className="mobile-nav-toggle" aria-expanded={mobileNavOpen} aria-controls="primary-navigation" aria-label={mobileNavOpen?(locale==='kn'?'ಮೆನು ಮುಚ್ಚಿ':'Close menu'):(locale==='kn'?'ಮೆನು ತೆರೆಯಿರಿ':'Open menu')} onClick={()=>setMobileNavOpen(open=>!open)}><span aria-hidden="true">☰</span></button><button className="language-switch" aria-label={t.languageLabel} onClick={changeLocale}>{t.switchLanguage}</button></div></header>
    <nav id="primary-navigation" className={`portal-nav ${mobileNavOpen?'open':''}`} aria-label={t.primaryNavigation}>{primaryNavItems.map(item=>navLink(item))}{utilityNavItems.map(item=>navLink(item,'nav-utility-link'))}<PublicDataDepth t={t}/></nav>
    {view==='atlas'&&<main id="atlas" className={mapOnlyMode?'atlas-map-only-main':''}>
      <aside className="sidebar"><GlobalSearch locale={locale} t={t} query={query} setQuery={setQuery} filters={searchFilters} setFilters={setSearchFilters} results={searchResults} onSelect={chooseSearchResult}/><div className="scope-switch"><span>{t.mapScope}</span><div><button className={scope==='karnataka'?'active':''} onClick={()=>{setScope('karnataka');setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);clearRecordDetails()}}>{t.karnatakaView}</button><button className={scope==='india'?'active':''} onClick={()=>{setScope('india');clearRecordDetails()}}>{t.indiaView}</button><button className={scope==='world'?'active':''} onClick={()=>{setScope('world');clearRecordDetails()}}>{t.worldView}</button></div></div><div className="section-title"><span>{t.kingdomsIn} {timelineYearLabel(year,locale)}</span><b>{visible.length}</b></div>{overlapNames&&<div className="kingdom-overlap-note"><strong>{t.overlappingKingdoms}</strong><span>{overlapNames}</span></div>}<div className="kingdom-list">{visible.map(k=><button className={highlightedKingdom?.id===k.id?'selected':''} key={k.id} onClick={()=>{setSelected(k.id);setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);clearRecordDetails()}}><i style={{background:k.color}}></i><span><strong>{primary(k.name,locale)}</strong><small>{secondary(k.name,locale)} · {k.start}–{k.end}</small></span></button>)}{!visible.length&&<p className="empty">{t.noKingdom}</p>}</div><div className="layers"><div className="section-title"><span>{t.mapLayers}</span></div>{Object.entries({boundaries:t.boundaries,territorialReach:t.territorialReach,districts:t.districtBoundaries,heritageSites:t.heritageCandidates,culture:t.culturalHeritage,temples:t.searchKinds.templeSites,artifacts:t.timelineCategories.artifacts,inscriptions:`${t.inscriptions} · ${activeInscriptions.length}`,researchCandidates:`${t.mapResearchCandidates} · ${visiblePublicReviewCandidates.length}`,events:t.events,people:`${t.people} · ${activePeople.length}`,modern:t.modernMap}).map(([key,label])=><label className={key==='people'?'people-map-toggle':''} key={key}><input type="checkbox" checked={layers[key]} onChange={()=>setLayers(value=>({...value,[key]:!value[key]}))}/><span>{label}</span></label>)}</div><details className="sidebar-object-icon-key"><summary>{locale==='kn'?'ನಕ್ಷೆ ಗುರುತುಗಳ ಸೂಚಿ':'Map icon key'}</summary><div><span><i className="legend-object-icon temple">{objectIcon('temple')}</i>{t.timelineCategories.temples}</span><span><i className="legend-object-icon inscription">{objectIcon('inscription')}</i>{t.timelineCategories.inscriptions}</span><span><i className="legend-object-icon artifact">{objectIcon('artifact')}</i>{t.timelineCategories.artifacts}</span><span><i className="legend-object-icon event">{objectIcon('war')}</i>{t.timelineCategories.wars}</span><span><i className="legend-object-icon culture">{objectIcon('monument')}</i>{t.timelineCategories.monuments}</span></div></details>{(layers.heritageSites||layers.districts)&&<div className="heritage-map-filters"><strong>{t.mapHeritageFilters}</strong><select aria-label={t.allDistricts} value={selectedDistrict} onChange={event=>setSelectedDistrict(event.target.value)}><option value="all">{t.allDistricts}</option>{atlasData.heritageAudits.map(audit=><option key={audit.id} value={audit.id}>{primary(audit.district,locale)}</option>)}</select><select aria-label={t.allHeritageCategories} value={heritageCategory} onChange={event=>setHeritageCategory(event.target.value)}><option value="all">{t.allHeritageCategories}</option>{Object.keys(t.heritageCategoryLabels).map(value=><option key={value} value={value}>{t.heritageCategoryLabels[value]}</option>)}</select><select aria-label={t.heritageAuthorityFilter} value={heritageAuthority} onChange={event=>setHeritageAuthority(event.target.value)}>{Object.entries(t.heritageAuthorityLabels).map(([value,label])=> <option key={value} value={value}>{label}</option>)}</select><label className="heritage-show-all"><input type="checkbox" checked={showAllHeritage} onChange={event=>setShowAllHeritage(event.target.checked)}/><span>{t.showAllHeritage}</span></label><small><b>{visibleHeritage.length}</b> {showAllHeritage?t.allHeritageShown:t.visibleThisYear} · <b>{futureHeritage.length}</b> {t.appearLater} · <b>{undatedHeritage.length}</b> {t.awaitingDate}</small></div>}</aside>
      <section className={`map-stage theme-${mapTheme} ${compareYear!=null?'compare-mode':''}`}>
        <button className="map-only-toggle" aria-pressed={mapOnlyMode} onClick={()=>setMapOnlyMode(value=>!value)}>{mapOnlyMode?t.exitMapOnly:t.enterMapOnly}</button>
        {mapOnlyMode&&<div className="map-only-controls"><div><strong>{timelineYearLabel(year,locale)}</strong><span>{t.mapOnlyHint}</span></div><div className="map-only-scope" role="group" aria-label={t.mapScope}><button className={scope==='karnataka'?'active':''} onClick={()=>setScope('karnataka')}>{t.karnatakaView}</button><button className={scope==='india'?'active':''} onClick={()=>setScope('india')}>{t.indiaView}</button><button className={scope==='world'?'active':''} onClick={()=>setScope('world')}>{t.worldView}</button></div><details><summary>{t.mapOnlyLayers}</summary><div>{[['boundaries',t.boundaries],['territorialReach',t.territorialReach],['events',t.events],['people',t.people],['inscriptions',t.inscriptions],['temples',t.searchKinds.templeSites],['culture',t.culturalHeritage],['artifacts',t.timelineCategories.artifacts],['researchCandidates',t.mapResearchCandidates]].map(([key,label])=><label key={key}><input type="checkbox" checked={layers[key]} onChange={()=>setLayers(value=>({...value,[key]:!value[key]}))}/><span>{label}</span></label>)}</div></details></div>}
        {(layers.inscriptions||layers.researchCandidates)&&<div className={`public-map-notice ${reviewOptionsOpen?'mobile-open':''}`}><button className="mobile-overlay-toggle" aria-expanded={reviewOptionsOpen} onClick={()=>{setReviewOptionsOpen(open=>!open);setMapLegendOpen(false)}}>{t.reviewMapOptions}</button><div className="public-map-notice-content">{layers.inscriptions&&<label><input type="checkbox" checked={showAllInscriptions} onChange={event=>setShowAllInscriptions(event.target.checked)}/><span>{t.showAllInscriptions}</span></label>}{layers.researchCandidates&&<label><input type="checkbox" checked={showAllReviewCandidates} onChange={event=>setShowAllReviewCandidates(event.target.checked)}/><span>{t.showAllReviewCandidates}</span></label>}<small>{t.publicReviewNote}</small></div></div>}
        <MapContainer center={[atlasMapView.lat,atlasMapView.lng]} zoom={atlasMapView.zoom} minZoom={3} scrollWheelZoom>
          <MapViewport scope={scope} selectedEvent={selectedEvent} selectedTerritory={selectedTerritory} selectedCulture={selectedCulture} selectedWorkPosition={selectedWorkPosition} selectedPersonPosition={selectedPersonPosition} selectedInscription={selectedInscription} selectedSearchPlace={selectedSearchPlace} comparisonPositions={comparisonPositions} preserveInitialMapView={Boolean(initialShareState.map)}/>
          <MapResizeOnMode active={mapOnlyMode}/>
          <MapShareSync onMapMove={position=>{setMapZoom(position.zoom);if(view==='atlas')replaceShareUrl({map:position})}}/>
          {layers.modern&&<TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>}
          <LocalizedMapLabels locale={locale} capitalIds={activeCapitalIds} districtGeojson={districtGeojson} showDistricts={layers.districts} suppressLabels={Boolean(selectedEvent||selectedTerritory||selectedCulture||selectedPerson||selectedWork||selectedInscription||selectedSearchPlace)}/>
          {layers.districts&&districtGeojson&&<GeoJSON interactive={false} key={`${locale}-${selectedDistrict}-${districtGeojson.features.length}`} data={districtGeojson} style={feature=>({color:selectedDistrict===feature.properties.id?'#3f37c9':'#68738b',weight:selectedDistrict===feature.properties.id?3:1.2,fillColor:'#4361ee',fillOpacity:selectedDistrict===feature.properties.id ? .12 : .025,dashArray:selectedDistrict===feature.properties.id?null:'5 4'})}/>}
          {layers.boundaries&&highlightedKingdom?.type==='external-governance'&&<Polygon key={highlightedKingdom.id} positions={highlightedKingdom.polygon} pathOptions={{className:'kingdom-boundary selected-kingdom-boundary',color:highlightedKingdom.color,fillColor:highlightedKingdom.color,fillOpacity:.3,weight:3,dashArray:'8 6'}} eventHandlers={{click:()=>{setSelected(highlightedKingdom.id);setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);clearRecordDetails()}}}></Polygon>}
          {layers.boundaries&&highlightedCoreTerritories.map(territory=>{const polity=territory.polityIds.map(id=>entityById.get(id)).find(item=>highlightedPolityIds.has(item?.id))||entityById.get(territory.polityIds[0]);const color=polity?.color||territoryColors['core-administered'];return <Polygon key={territory.id} positions={territory.positions} pathOptions={{className:'kingdom-boundary selected-kingdom-boundary',color,fillColor:color,fillOpacity:selectedTerritory?.id===territory.id ? .38 : .22,weight:selectedTerritory?.id===territory.id ? 3 : 2}} eventHandlers={{click:()=>chooseTerritory(territory)}}></Polygon>})}
          {layers.territorialReach&&highlightedReachTerritories.map(territory=>{const style=territoryStyles[territory.classification];const color=territoryColors[territory.classification];const props={color,fillColor:color,fillOpacity:style.fillOpacity,weight:selectedTerritory?.id===territory.id?4:style.weight,dashArray:style.dashArray};return territory.geometry.type==='LineString'?<Polyline key={territory.id} positions={territory.positions} pathOptions={props} eventHandlers={{click:()=>chooseTerritory(territory)}}></Polyline>:<Polygon key={territory.id} positions={territory.positions} pathOptions={props} eventHandlers={{click:()=>chooseTerritory(territory)}}></Polygon>})}
          {compareYear!=null&&comparisonChanges.map(territory=>{const props={color:'#009a9d',fillColor:'#009a9d',fillOpacity:territory.geometry.type==='Polygon'?.08:0,weight:selectedTerritory?.id===territory.id?5:3,dashArray:'7 5'};return territory.geometry.type==='LineString'?<Polyline key={`compare-${territory.id}`} positions={territory.positions} pathOptions={props} eventHandlers={{click:()=>chooseTerritory(territory)}}></Polyline>:<Polygon key={`compare-${territory.id}`} positions={territory.positions} pathOptions={props} eventHandlers={{click:()=>chooseTerritory(territory)}}></Polygon>})}
          {layers.inscriptions&&activeInscriptions.map(item=>{const pending=needsHumanReview(item.review?.status);const polity=item.polity||entityById.get(item.polityId);return <Marker key={item.id} position={item.coords} icon={categoryMarkerIcon({...item,kind:'inscription'},{pending,selected:selectedInscription?.id===item.id,color:'#9a6b24'})} zIndexOffset={selectedInscription?.id===item.id?500:100} eventHandlers={{click:()=>chooseInscription(item)}}><Popup><strong>{primary(item.name,locale)}</strong><br/><span>{primary(item.placeName,locale)}</span><br/><span>{t.associatedKingdom}: {primary(polity?.name,locale)}</span><br/><small>{pending?t.pendingHumanReview:item.review?.status}</small></Popup></Marker>})}
          {layers.researchCandidates&&reviewCandidateGroups.map(group=>group.items.length===1?(()=>{const item=group.items[0];const kind=objectKindFor({...item,kind:item.recordKind,storyKind:item.recordKind});const selectedCandidate=selectedSearchPlace?.reviewCandidateId===item.id;return <Marker key={`research-${item.id}`} position={item.coords} icon={categoryMarkerIcon({...item,kind,storyKind:item.recordKind},{pending:true,selected:selectedCandidate,color:'#b06a1f'})} zIndexOffset={selectedCandidate?500:40}><Popup><ReviewCandidatePopup item={item} locale={locale} t={t}/></Popup></Marker>})():<Marker key={`research-cluster-${group.key}`} position={group.coords} icon={reviewClusterIcon(group.items.length)} zIndexOffset={35}><Popup maxWidth={330}><div className="review-cluster-popup"><strong>{group.items.length} {t.pendingReviewRecords}</strong><small>{t.zoomForIndividualMarkers}</small><div>{group.items.slice(0,12).map(item=><ReviewCandidatePopup key={item.id} item={item} locale={locale} t={t} compact/>)}</div>{group.items.length>12&&<em>+ {group.items.length-12} {t.moreRecords}</em>}</div></Popup></Marker>)}
          {layers.periodicals&&activePeriodicalSites.map(site=>{const selected=selectedPeriodicalSite?.id===site.id;return <Marker key={`periodical-${site.id}`} position={site.coords} icon={categoryMarkerIcon({...site,kind:'literature'},{pending:true,selected,color:'#5f6796'})} zIndexOffset={selected?560:210} eventHandlers={{click:()=>{setSelectedPeriodicalSite(site);setSelectedSearchPlace({coords:site.coords,periodicalSiteId:site.id})}}}><Popup><strong>{primary(site.name,locale)}</strong><br/><span>{primary(site.place,locale)}</span><br/><small>{site.periodicalIds.length.toLocaleString('en-IN')} {locale==='kn'?'ಪತ್ರಿಕೆ/ಮಾಸಿಕೆ ದಾಖಲೆಗಳು':'newspaper and magazine records'}</small><br/>{site.yearFrom?`${site.yearFrom}–${site.yearTo||site.yearFrom} ${t.ce}`:(locale==='kn'?'ದಿನಾಂಕ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ':'Dates under review')}<br/><small>{t.pendingHumanReview} · Patrika Sanchaya</small></Popup></Marker>})}
          {layers.artifacts&&activeArtifacts.map(item=>{const selected=selectedSearchPlace?.artifactId===item.id;const polity=entityById.get(item.polityId);return <Marker key={`artifact-${item.id}`} position={item.coords} icon={categoryMarkerIcon({...item,kind:'artifact'},{pending:true,selected,color:polity?.color||'#8b5aa5'})} zIndexOffset={selected?570:230} eventHandlers={{click:()=>setSelectedSearchPlace({coords:item.coords,artifactId:item.id})}}><Popup><strong>{primary(item.name,locale)}</strong><br/><span>{t.timelineCategories.artifacts} · {primary(polity?.name,locale)}</span><br/><small>{evidenceDateLabel(item.date,locale)}</small><br/>{primary(item.description,locale)}<br/><small>{t.pendingHumanReview} · {item.location.precision}</small></Popup></Marker>})}
          {activeMapCulture.map(item=>{const pending=needsHumanReview(item.review?.status);const color=isTempleRecord(item)?'#a65f24':cultureColors[item.category];return <Marker key={item.id} position={item.coords} icon={categoryMarkerIcon(item,{pending,selected:selectedCulture?.id===item.id,color})} zIndexOffset={selectedCulture?.id===item.id?500:200} eventHandlers={{click:()=>chooseCulture(item)}}><Popup><strong>{primary(item.name,locale)}</strong><br/>{isTempleRecord(item)?t.timelineCategories.temples:t.cultureCategories[item.category]} · {item.date.from} {t.ce}<br/>{primary(item.description,locale)}<br/><small>{pending?t.pendingHumanReview:item.review?.status}</small></Popup></Marker>})}
          {layers.people&&activePeople.map(person=>{const pending=needsHumanReview(person.review?.status);const selectedPersonMarker=selectedPerson?.id===person.id;const color=personColorFor(person);return <Marker key={`person-${person.id}`} position={person.coords} icon={categoryMarkerIcon({...person,kind:'person'},{pending,selected:selectedPersonMarker,color})} zIndexOffset={selectedPersonMarker?650:320} eventHandlers={{click:()=>choosePerson(person)}}><Popup><strong>{primary(person.name,locale)}</strong><br/><span>{secondary(person.name,locale)}</span><br/><small>{person.roles?.map(role=>personRoleLabel(role,locale)).join(' · ')} · {timelineYearLabel(person.year,locale)}</small><br/><small>{pending?t.pendingHumanReview:person.review?.status}</small>{person.citations?.[0]&&<><br/><SourceLink href={sourceById.get(person.citations[0].sourceId)?.url} label={t.openSource} locale={locale}/></>}</Popup></Marker>})}
          {selectedWork&&selectedWorkPosition&&<CircleMarker center={selectedWorkPosition} radius={10} pathOptions={{color:'#fff',fillColor:cultureColors.literature,fillOpacity:1,weight:3}}><Tooltip permanent direction="top">{t.associatedCourt}: {primary(selectedWork.name,locale)}</Tooltip></CircleMarker>}
          {selectedPerson&&selectedPersonPosition&&<CircleMarker center={selectedPersonPosition} radius={10} pathOptions={{color:'#fff',fillColor:'#b26a22',fillOpacity:1,weight:3}}/>}
          {layers.heritageSites&&visibleHeritage.map(site=>{const pending=site.verification.verificationStatus!=='verified';return <Marker key={`heritage-${site.id}`} position={site.coords} icon={categoryMarkerIcon({...site,kind:'heritage'},{pending,color:heritageStatusColors[site.verification.verificationStatus]})} zIndexOffset={50}><Popup><strong>{primary(site.name,locale)}</strong><br/><span>{secondary(site.name,locale)}</span><br/>{primary(site.district,locale)} · {t.verificationLabels[site.verification.verificationStatus]}<br/><small>{pending?t.pendingHumanReview:site.authorityTags.map(tag=>t.heritageAuthorityLabels[tag]).join(' · ')}</small><br/>{site.verification.protectionStatus[0]&&<>{primary(site.verification.protectionStatus[0].designation,locale)}<br/></>}{site.creationPhase&&<>{t.timelineAppearance}: {evidenceDateLabel(site.creationPhase.date,locale)}<br/>{primary(site.creationPhase.name,locale)}<br/></>}{t.coordinates}: {site.coords[0].toFixed(5)}, {site.coords[1].toFixed(5)}{site.verification.siteCitations[0]&&<><br/><SourceLink href={site.verification.siteCitations[0].url} label={t.openSource} locale={locale}/></>}</Popup></Marker>})}
          {layers.events&&nearbyConnections.map(event=><Polyline key={`connection-${event.id}`} positions={event.connectionPositions} pathOptions={{color:connectionColors[event.connectionCategory],weight:selectedEvent?.id===event.id?5:3,opacity:selectedEvent?.id===event.id?1:.72,dashArray:connectionDash[event.connectionCategory]}} eventHandlers={{click:()=>chooseEvent(event)}}></Polyline>)}
          {layers.events&&nearbyEvents.map(event=>{const pending=!['reviewed','verified','published'].includes(event.review?.status);return <Marker key={event.id} position={event.coords} icon={categoryMarkerIcon({...event,storyKind:'event'},{pending,selected:selectedEvent?.id===event.id,color:eventColors[event.type]||'#785f45'})} zIndexOffset={selectedEvent?.id===event.id?500:150} eventHandlers={{click:()=>chooseEvent(event)}}/>})}
          {layers.events&&selectedEvent&&!selectedEvent.reach&&selectedEvent.routePositions.length>0&&<Polyline positions={selectedEvent.routePositions} pathOptions={{color:eventColors[selectedEvent.type]||'#785f45',weight:3,dashArray:'8 7'}}/>}
        </MapContainer>
        <div className="map-theme-control" role="group" aria-label={t.mapTheme} title={t.mapThemeNote}><span>{t.mapTheme}</span><div><button className={mapTheme==='modern'?'active':''} aria-pressed={mapTheme==='modern'} onClick={()=>setMapTheme('modern')}>{t.modernTheme}</button><button className={mapTheme==='historical'?'active':''} aria-pressed={mapTheme==='historical'} onClick={()=>setMapTheme('historical')}>{t.historicalTheme}</button></div></div>
        <div className={`map-legend ${mapLegendOpen?'mobile-open':'is-minimized'}`}>
          <button className="map-legend-toggle mobile-overlay-toggle" aria-expanded={mapLegendOpen} aria-label={mapLegendOpen?t.minimizeMapLegend:t.showMapLegend} onClick={()=>{setMapLegendOpen(open=>!open);setReviewOptionsOpen(false)}}>
            {mapLegendOpen?t.minimizeMapLegend:t.showMapLegend}
          </button>
          <div className="map-legend-content">{compareYear!=null?<div className="comparison-legend"><span><i className="territory-symbol core"></i>{year}: {t.beforeLayer}</span><span><i className="territory-symbol comparison"></i>{compareYear}: {t.afterLayer}</span><span>{t.unchangedEvidence}: {unchangedTerritoryCount}</span><small>{t.comparisonHelp}</small></div>:<><span><i className="territory-symbol core"></i>{t.territoryClasses['core-administered']}</span>{layers.districts&&<><span><i className="district-symbol"></i>{t.districtBoundaries}</span><a href="https://mapservice.gov.in/mapserviceserv176/rest/services/BharatMapService_Karnataka/Admin_Boundary_District/MapServer" target="_blank" rel="noreferrer">{t.districtBoundarySource} ↗</a></>}{layers.heritageSites&&<><span><i className="dot heritage-dot"></i>{t.heritageCandidates} · {visibleHeritage.length}</span><div className="heritage-authority-legend"><b>{t.heritageAuthorityFilter}</b>{['unesco','asi','state','research'].map(tag=><span key={tag}>{t.heritageAuthorityLabels[tag]}</span>)}</div></>}{layers.territorialReach&&<><span><i className="territory-symbol influence"></i>{t.territoryClasses['tributary-influence']}</span><span><i className="territory-symbol contested"></i>{t.territoryClasses['contested-zone']}</span><span><i className="territory-symbol temporary"></i>{t.territoryClasses['temporary-occupation']}</span></>}<span><i className="dot event-dot"></i>{t.events}</span>{(layers.events||layers.researchCandidates||layers.inscriptions||layers.culture||layers.temples||layers.heritageSites)&&<span><i className="research-ring"></i>{t.pendingHumanReview}</span>}{layers.events&&<div className="connection-legend"><b>{t.historicalConnections}</b>{Object.entries(connectionColors).filter(([key])=>key!=='military'&&key!=='other').map(([key,color])=><span key={key}><i className="connection-line" style={{'--connection-color':color}}></i>{t.connectionTypes[key]}</span>)}</div>}{layers.culture&&<span><i className="dot culture-dot"></i>{t.culturalHeritage} · {activeMapCulture.filter(item=>!isTempleRecord(item)).length}</span>}{layers.temples&&<span><i className="dot culture-dot"></i>{t.searchKinds.templeSites} · {activeMapCulture.filter(isTempleRecord).length}</span>}{layers.territorialReach&&highlightedReachTerritories.length>0&&<div className="active-territories"><b>{t.activeTerritorialEvidence}</b>{highlightedReachTerritories.map(territory=><button key={territory.id} className={selectedTerritory?.id===territory.id?'active':''} onClick={()=>chooseTerritory(territory)}><i style={{background:territoryColors[territory.classification]}}></i>{primary(territory.name,locale)}</button>)}</div>}</>}</div>
        </div>
        <EventRail locale={locale} t={t} year={year} stories={timelineStories} selectedId={selectedEvent?.id||selectedTerritory?.id||selectedPerson?.id||selectedWork?.id||selectedInscription?.id||selectedCulture?.id||selectedPeriodicalSite?.id||selectedSearchPlace?.reviewCandidateId||selectedSearchPlace?.periodicalSiteId||selectedSearchPlace?.artifactId} onSelect={chooseTimelineStory} onCategoryChange={coordinateTimelineCategory}/>
        <Timeline year={year} setYear={value=>{setYear(value);clearRecordDetails();if(selectedEvent&&Math.abs(selectedEvent.year-value)>18)setSelectedEvent(null);if(selectedTerritory&&(value<selectedTerritory.date.from||value>selectedTerritory.date.to))setSelectedTerritory(null);if(selectedCulture&&!isCultureActive(selectedCulture,value))setSelectedCulture(null)}} compareYear={compareYear} setCompareYear={setCompareYear} onPreset={preset=>{setYear(preset.from);setCompareYear(preset.to);setScope('india');setSelectedEvent(null);setSelectedTerritory(null);setSelectedCulture(null);clearRecordDetails()}} t={t} locale={locale}/>
      </section>
      {selectedEvent?<EventDetail event={selectedEvent} locale={locale} t={t} onClose={returnToStateView}/>:selectedTerritory?<TerritoryDetail territory={selectedTerritory} locale={locale} t={t} onClose={returnToStateView}/>:selectedCulture?<CultureDetail item={selectedCulture} locale={locale} t={t} onClose={returnToStateView}/>:selectedPerson?<PersonDetail person={selectedPerson} locale={locale} t={t} onClose={returnToStateView} onChooseRecord={choosePersonRecord}/>:selectedInscription?<InscriptionDetail item={selectedInscription} locale={locale} t={t} onClose={returnToStateView}/>:selectedWork?<WorkDetail work={selectedWork} locale={locale} t={t} onClose={returnToStateView}/>:chosen?<KingdomDetail chosen={chosen} locale={locale} t={t} year={year} literatureWorks={literatureWorks} inscriptionRecords={inscriptionRecords} usesNearestLiterature={!activeLiterature.length} onChooseWork={chooseWork} onChooseInscription={chooseInscription} onChoosePerson={choosePerson}/>:<BceResearchContext locale={locale} t={t} year={year} onOpenEpigraphy={()=>navigateView('epigraphy')}/>}
    </main>}
    {view==='research'&&<Suspense fallback={<PortalFallback/>}><ResourcesCollaborations locale={locale} methodCards={t.cards}/></Suspense>}
    {view==='relations'&&<Suspense fallback={<PortalFallback/>}><GlobalRelationsExplorer locale={locale} mapTheme={mapTheme} setMapTheme={setMapTheme} onOpenAtlas={item=>{if(item.kind==='event'){const event=events.find(record=>record.id===item.id);if(event)chooseEvent(event)}else{const territory=territorialExtents.find(record=>record.id===item.id);if(territory)chooseTerritory(territory)}navigateView('atlas')}}/></Suspense>}
    {view==='inscriptions'&&<div className="portal-page" id="inscriptions"><InscriptionAuditSection locale={locale} t={t} districtGeojson={districtGeojson} onChooseInscription={item=>{chooseInscription(item);navigateView('atlas')}}/></div>}
    {view==='districts'&&<div className="portal-page" id="districts"><DistrictAuditSection locale={locale} t={t} districtGeojson={districtGeojson}/><HeritageInventorySection locale={locale} t={t}/></div>}
    {view==='district-history'&&<Suspense fallback={<PortalFallback/>}><DistrictHistoryExplorer locale={locale} districtGeojson={districtGeojson} mapTheme={mapTheme} setMapTheme={setMapTheme}/></Suspense>}
    {view==='people'&&<Suspense fallback={<PortalFallback/>}><PeopleExplorer locale={locale} districtGeojson={districtGeojson} mapTheme={mapTheme} setMapTheme={setMapTheme} onOpenAtlas={person=>{choosePerson(person);navigateView('atlas')}}/></Suspense>}
    {view==='freedom'&&<Suspense fallback={<PortalFallback/>}><FreedomMovementExplorer locale={locale} districtGeojson={districtGeojson} mapTheme={mapTheme} setMapTheme={setMapTheme}/></Suspense>}
    {view==='literature'&&<Suspense fallback={<PortalFallback/>}><LiteratureEpigraphyExplorer kind="literature" locale={locale} mapTheme={mapTheme} onOpenAtlas={item=>{chooseWork(item);navigateView('atlas')}}/></Suspense>}
    {view==='epigraphy'&&<Suspense fallback={<PortalFallback/>}><LiteratureEpigraphyExplorer kind="epigraphy" locale={locale} mapTheme={mapTheme} isCommunityMember={Boolean(communityUser)} onOpenAtlas={item=>{chooseInscription(inscriptionById.get(item.id)||item);navigateView('atlas')}}/></Suspense>}
    {view==='trails'&&<Suspense fallback={<PortalFallback/>}><TrailExplorer locale={locale}/></Suspense>}
    {view==='evidence'&&<Suspense fallback={<PortalFallback/>}><EvidenceWorkflow locale={locale} communityUser={communityUser}/></Suspense>}
    {view==='community'&&<Suspense fallback={<PortalFallback/>}><Community locale={locale} onAuthenticated={handleAuthenticated} onLogout={handleLoggedOut}/></Suspense>}
    {view==='profile'&&<Suspense fallback={<PortalFallback/>}><Community locale={locale} profileOnly onAuthenticated={handleAuthenticated} onLogout={handleLoggedOut}/></Suspense>}
    {view==='about'&&<Suspense fallback={<PortalFallback/>}><About locale={locale}/></Suspense>}
    <GuidedTour tourKey={view} locale={locale} steps={guidedTourSteps(view,locale,Boolean(communityUser))}/>
    <footer><span className="footer-brand"><img src={`${import.meta.env.BASE_URL}sanchaya-logo.png`} alt=""/>{atlasData.meta.title.kn} · Karnataka Historical Atlas · v{atlasData.meta.schemaVersion}</span><span className="footer-partners"><a href="#about"><span className="partner-icon"><img src={`${import.meta.env.BASE_URL}sanchaya-logo.png`} alt=""/></span>{locale==='kn'?'ನಮ್ಮ ಬಗ್ಗೆ':'About'}</a>{socialLinks.length>0&&<><i aria-hidden="true">·</i><span className="footer-social"><small>{locale==='kn'?'ನವೀಕರಣಗಳನ್ನು ಅನುಸರಿಸಿ':'Follow project updates'}</small>{socialLinks.map(([label,url])=><a href={url} target="_blank" rel="noreferrer" key={label}>{label} ↗</a>)}</span></>}</span></footer>
  </div>
}
