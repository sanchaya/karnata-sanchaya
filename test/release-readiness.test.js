import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { bengaluruKmlCandidates } from '../src/data/bengaluru-kml.js'
import { communityPeople, communityPeopleEvents } from '../src/data/community-people.js'

const appSource = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
const indexSource = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8')
const serviceWorkerSource = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8')
const explorerSource = await readFile(new URL('../src/LiteratureEpigraphyExplorer.jsx', import.meta.url), 'utf8')
const relationsSource = await readFile(new URL('../src/GlobalRelationsExplorer.jsx', import.meta.url), 'utf8')
const districtHistorySource = await readFile(new URL('../src/DistrictHistoryExplorer.jsx', import.meta.url), 'utf8')
const peopleSource = await readFile(new URL('../src/PeopleExplorer.jsx', import.meta.url), 'utf8')
const freedomSource = await readFile(new URL('../src/FreedomMovementExplorer.jsx', import.meta.url), 'utf8')
const communityPeopleSource = await readFile(new URL('../src/data/community-people.js', import.meta.url), 'utf8')
const evidenceSource = await readFile(new URL('../src/EvidenceWorkflow.jsx', import.meta.url), 'utf8')
const adminSource = await readFile(new URL('../src/Admin.jsx', import.meta.url), 'utf8')
const tourSource = await readFile(new URL('../src/GuidedTour.jsx', import.meta.url), 'utf8')
const stylesSource = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8')
const relationsStylesSource = await readFile(new URL('../src/global-relations.css', import.meta.url), 'utf8')
const explorerStylesSource = await readFile(new URL('../src/explorer.css', import.meta.url), 'utf8')
const peopleStylesSource = await readFile(new URL('../src/people.css', import.meta.url), 'utf8')
const freedomStylesSource = await readFile(new URL('../src/freedom-movement.css', import.meta.url), 'utf8')
const tabletStylesSource = await readFile(new URL('../src/tablet.css', import.meta.url), 'utf8')

test('public navigation keeps the complete release route set and admin private', () => {
  const expectedRoutes = ['atlas', 'relations', 'people', 'freedom', 'literature', 'epigraphy', 'districts', 'district-history', 'inscriptions', 'evidence', 'research', 'community', 'profile', 'about']
  const routeBlock = appSource.match(/const publicViews=\[(.*?)\]/s)?.[1] || ''
  for (const route of expectedRoutes) assert.match(routeBlock, new RegExp(`['"]${route}['"]`), `${route} must remain a public route`)
  assert.doesNotMatch(routeBlock, /['"]admin['"]/, 'admin must never be part of public navigation')
  assert.match(appSource, /hash==='history'\?'district-history':hash/, 'legacy history links must resolve to district history')
})

test('navigation separates historical exploration from project utilities', () => {
  assert.match(appSource, /const primaryNavItems=/, 'historical exploration routes must remain grouped together')
  assert.match(appSource, /const utilityNavItems=/, 'about, research and contribution routes must share a utility group')
  assert.match(appSource, /className="header-utility-nav"/, 'utility routes must be available in the desktop header')
  assert.match(appSource, /className="nav-utility-link"|navLink\(item,'nav-utility-link'\)/, 'utility routes must remain available in the responsive menu')
  const publicHeader = appSource.slice(appSource.indexOf('<header><div className="sanchaya-product-brand"'), appSource.indexOf('<nav id="primary-navigation"'))
  assert.doesNotMatch(publicHeader, /href="https:\/\/sanchaya\.org"/, 'the public header must link to the internal About page instead of leaving the atlas')
})

test('public navigation reports the depth of the published research dataset', () => {
  assert.match(appSource, /const publicDataDepth=/, 'public dataset counts must be derived from the bundled release data')
  assert.match(appSource, /className="public-data-depth"/, 'dataset depth must remain visible in the top navigation')
  for (const metric of ['totalRecords','researchLeads','sources','relationships']) assert.match(appSource,new RegExp(`publicDataDepth\\.${metric}`),`${metric} must be presented publicly`)
})

test('mobile and bilingual navigation expose accessible controls', () => {
  assert.match(appSource, /aria-expanded=\{mobileNavOpen\}/, 'mobile menu state must be exposed to assistive technology')
  assert.match(appSource, /aria-controls="primary-navigation"/, 'mobile menu must identify its controlled navigation')
  assert.match(appSource, /aria-label=\{t\.primaryNavigation\}/, 'primary navigation must have an accessible name')
  assert.match(appSource, /aria-label=\{t\.languageLabel\}/, 'language switch must have an accessible name')
  assert.match(indexSource, /React\.StrictMode/, 'release builds must keep strict-mode diagnostics enabled')
})

test('tablet layouts preserve maps, readable cards and non-obstructing controls', () => {
  assert.match(indexSource, /import '\.\/tablet\.css'/, 'tablet overrides must load after the component styles')
  assert.match(stylesSource, /@media\(max-width:1366px\), \(any-pointer:coarse\)[\s\S]*\.mobile-overlay-toggle\{display:flex/, 'tablet maps must use compact overlay controls at tablet widths and on touch-first devices')
  assert.match(tabletStylesSource, /@media \(max-width: 1366px\), \(any-pointer: coarse\)/, 'large landscape tablets must receive compact overlay controls')
  for (const source of [explorerSource,relationsSource,districtHistorySource]) assert.match(source,/map-overlay-disclosure-toggle/, 'each tablet map explorer must expose a collapsible legend')
  assert.match(tabletStylesSource, /\.explorer-grid \{ grid-template-columns: repeat\(2/, 'tablet literature and epigraphy cards must use two readable columns')
  assert.match(tabletStylesSource, /\.relations-detail \{ position: static/, 'tablet relation details must not cover the map')
  assert.match(tabletStylesSource, /\.evidence-procedure ol \{ grid-template-columns: repeat\(2/, 'tablet evidence steps must avoid a needlessly long single column')
  assert.match(tabletStylesSource, /pointer: coarse/, 'touch-first tablets need larger interaction targets')
  assert.match(peopleStylesSource, /@media\(max-width:1180px\)/, 'the People Explorer must adapt its map, directory and profile at tablet widths')
  assert.match(explorerStylesSource, /\.explorer-map-heading\{left:52px;right:auto;width:fit-content;max-width:360px/, 'literature and epigraphy map headings must stay compact and clear Leaflet zoom controls')
  assert.match(stylesSource, /\.district-history-map-wrap \.map-theme-control\{left:52px\}/, 'district history map style controls must clear Leaflet zoom controls')
})

test('mobile timeline categories and kingdom boundaries remain unambiguous', () => {
  assert.match(appSource, /className="timeline-category-select"/, 'mobile timeline must expose a touch-native category selector')
  assert.match(appSource, /aria-label=\{t\.timelineCategoryLabel\}/, 'the mobile timeline selector must have a bilingual accessible name')
  assert.match(appSource, /data-story-category=\{story\.storyCategory\}/, 'filtered timeline cards must expose their category for regression checks')
  assert.match(appSource, /const highlightedKingdom=chosen/, 'one active kingdom must drive the boundary highlight')
  assert.match(appSource, /const highlightedCoreTerritories=coreTerritories\.filter/, 'core boundaries must be restricted to the chosen kingdom')
  assert.match(appSource, /const highlightedReachTerritories=reachTerritories\.filter/, 'territorial reach must be restricted to the chosen kingdom')
  assert.match(appSource, /highlightedKingdom\?\.type==='external-governance'/, 'external governance boundaries must render only when chosen')
  assert.doesNotMatch(appSource, /layers\.boundaries&&coreTerritories\.map/, 'the map must not render every active kingdom boundary together')
  assert.doesNotMatch(appSource, /layers\.territorialReach&&reachTerritories\.map/, 'the map must not render every active kingdom reach overlay together')
})

test('timeline categories coordinate with their required map layers', () => {
  assert.match(appSource, /onCategoryChange\?\.\(value\)/, 'category changes must notify the atlas map')
  assert.match(appSource, /inscriptions:'inscriptions'/, 'the inscription category must enable its map layer')
  assert.match(appSource, /onCategoryChange=\{coordinateTimelineCategory\}/, 'the timeline rail must be connected to map-layer coordination')
  assert.match(appSource, /chooseInscription=item=>\{enableMapLayer\('inscriptions'\)/, 'opening an inscription must recover a disabled inscription layer')
  assert.match(appSource, /story\.storyKind==='research-candidate'\)\{enableMapLayer\('researchCandidates'\)/, 'opening a review candidate must recover its public map layer')
  assert.match(appSource, /if\(story\.coords\)setSelectedSearchPlace\(\{coords:story\.coords,reviewCandidateId:story\.id\}\)/, 'opening a review candidate must focus and highlight its mapped location')
})

test('people and keyboard timeline traversal stay connected to map selection', () => {
  assert.match(appSource, /relations:atlasData\.politicalRelations\.filter/, 'people must inherit bilateral relation context')
  assert.match(appSource, /layers\.people&&activePeople\.map/, 'people with mapped context must be individually clickable on the atlas')
  assert.match(appSource, /people-map-toggle/, 'the people layer must be independently toggleable')
  assert.match(appSource, /events:t\.events,people:`\$\{t\.people\} · \$\{activePeople\.length\}`/, 'the people control must live with the other map-layer controls')
  assert.doesNotMatch(stylesSource, /\.people-map-toggle\{position:absolute/, 'the people control must not cover the map')
  assert.match(appSource, /ArrowLeft.*ArrowRight.*ArrowUp.*ArrowDown/, 'the atlas timeline must support keyboard traversal')
  assert.match(relationsSource, /closest\?\.\('\.relations-timeline'\)/, 'relations timeline keyboard handling must be scoped to its controls')
})

test('the public history graph includes cited non-royal and occupational people', () => {
  for (const id of ['person-onake-obavva','person-sangolli-rayanna','person-gurusiddappa-kittur','person-amatur-balappa','person-madivala-machayya','person-ambigara-chowdaiah']) {
    const person=communityPeople.find(record=>record.id===id)
    assert.ok(person,`${id} must remain in the community-people packet`)
    assert.ok(person.citations.length,`${id} must retain a direct source`)
    assert.equal(person.review.status,'needs-review',`${id} must remain visibly review-pending`)
    assert.ok(communityPeopleEvents.some(event=>event.peopleIds.includes(id)),`${id} must be connected to a dated map event`)
  }
  assert.match(appSource,/personRoleColors/, 'community roles need visually distinct map markers')
  assert.match(appSource,/personRoleLabel/, 'community roles need bilingual map labels')
})

test('the People Explorer exposes the complete linked research workflow', () => {
  assert.match(appSource,/const PeopleExplorer=lazy/, 'the public people page must remain code-split')
  assert.match(appSource,/\['people',locale==='kn'\?'ವ್ಯಕ್ತಿಗಳು':'People'\]/, 'people must remain visible in primary navigation')
  assert.match(peopleSource,/atlasData\.people\.map/, 'the directory must derive from the normalized people collection')
  for (const filter of ['role','polity','century','district','gender','review']) assert.match(peopleSource,new RegExp(`\\[${filter},set${filter[0].toUpperCase()+filter.slice(1)}\\]`),`${filter} filter must remain available`)
  for (const collection of ['events','works','culture','reigns','relations','inscriptions']) assert.match(peopleSource,new RegExp(`${collection}:`),`${collection} must remain linked to person profiles`)
  assert.match(peopleSource,/PeopleMapViewport/, 'the people map must synchronize with selection')
  assert.match(peopleSource,/ArrowLeft.*ArrowRight.*ArrowUp.*ArrowDown/, 'the people timeline must support keyboard traversal')
  assert.match(peopleSource,/searchParams\.set\('person'/, 'individual profiles must be shareable through the URL')
})

test('freedom fighters remain discoverable by cited district associations', () => {
  assert.match(peopleSource,/focus==='freedom'/, 'people must expose a dedicated freedom-fighter view')
  assert.match(peopleSource,/person\.districtIds\.includes\(district\)/, 'district filtering must include every researched activity district, not only the map anchor')
  assert.match(peopleSource,/people-district-coverage/, 'the starter district coverage must remain visible and selectable')
  assert.match(peopleSource,/freedomResearchCount/, 'the people view must disclose the freedom-movement corpus size')
  assert.match(peopleSource,/This is not a final count of verified, distinct people/, 'the corpus count must not imply that research leads are verified unique people')
  for (const id of ['kittur-chennamma','sangolli-rayanna','umabai-kundapur','kamaladevi-chattopadhyay','hardekar-manjappa']) assert.match(communityPeopleSource,new RegExp(`person\\('${id}'`),`${id} must remain in the starter set`)
  assert.match(communityPeopleSource,/districtAssociations/, 'freedom-fighter district links must remain explicit research data')
  assert.match(communityPeopleSource,/src-amrit-umabai-kundapur/, 'new district records must retain government biographical citations')
})

test('freedom movement has a dedicated map, timeline and evidence handoff', () => {
  assert.match(appSource,/const FreedomMovementExplorer=lazy/, 'the freedom explorer must remain code-split')
  assert.match(appSource,/\['freedom',locale==='kn'\?'ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ':'Freedom movement'\]/, 'freedom movement must be visible in primary navigation')
  assert.match(freedomSource,/researchInput\?\.sourceCollection==='martyrCandidates'/, 'the page must reuse permanent event projections')
  assert.match(freedomSource,/className="freedom-map/, 'the page must expose a dedicated map')
  assert.match(freedomSource,/className="freedom-list"/, 'the page must expose a chronological records list')
  assert.match(freedomSource,/contributeType','martyrCandidate'/, 'review leads must hand off to the moderated contribution workflow')
  assert.match(freedomSource,/location.*district\/city-centre|district\/city-centre leads/, 'provisional map locations must be explained')
  assert.match(freedomSource,/initialParams\.get\('freedomDistrict'\)/, 'district-level freedom views must be shareable')
  assert.match(peopleSource,/href="#freedom"/, 'the People Explorer must link its historical connections to the dedicated page')
  assert.match(districtHistorySource,/className="district-history-freedom"/, 'district history must expose district-specific freedom records')
  assert.match(districtHistorySource,/freedomDistrict=/, 'district coverage must open the matching freedom explorer filter')
  assert.match(freedomSource,/freedomPeopleCount/, 'the freedom explorer must disclose the size of its wider people research corpus')
  assert.match(freedomSource,/t\.people/, 'the people count must have a visible bilingual label')
  assert.match(freedomStylesSource,/\.app-shell main\.freedom-page\{display:block;height:auto/, 'the explorer must not inherit the atlas fixed three-column main layout')
})

test('selected timeline stories retain readable text contrast', () => {
  assert.match(stylesSource,/\.event-track button\.selected\{background:#eef2ff;color:var\(--sanchaya-ink\);border-color:var\(--sanchaya-blue\)\}/, 'selected timeline cards need a light, high-contrast surface')
  assert.match(stylesSource,/\.event-track button\.selected span,\.event-track button\.selected strong\{color:var\(--sanchaya-ink\)\}/, 'selected timeline titles must not inherit unreadable white text')
  assert.match(stylesSource,/\.event-track button\.selected em\{color:var\(--sanchaya-blue\)\}/, 'selected timeline metadata must remain legible')
})

test('the static release is installable and keeps map context available offline', () => {
  assert.match(indexSource, /serviceWorker\.register/, 'production builds must register the offline service worker')
  assert.match(serviceWorkerSource, /karnataka-districts\.geojson/, 'district boundaries must be cached with the app shell')
  assert.match(serviceWorkerSource, /tile\.openstreetmap\.org/, 'visited map tiles must be cached for offline reuse')
  assert.match(serviceWorkerSource, /caches\.match\('\.\/index\.html'\)/, 'offline navigation must fall back to the cached app shell')
})

test('map and timeline safety guards remain wired into the public app', () => {
  assert.match(appSource, /mapZoomForPositions/, 'candidate selections must use bounded map focus')
  assert.match(appSource, /routePositions\.length>0/, 'empty routes must not render map polylines')
  assert.match(appSource, /externalLinks\?\.\[0\]\?\.url/, 'optional external links must not break timeline cards')
  const labelSource = appSource.slice(appSource.indexOf('function LocalizedMapLabels'), appSource.indexOf('function GlobalSearch'))
  assert.doesNotMatch(labelSource, /<Tooltip permanent/, 'city and district labels must not remain permanently over map candidates')
})

test('public map exposes review-pending information across mapped categories', () => {
  assert.match(appSource, /const publicReviewCandidates=\[/, 'the public review layer must aggregate mapped research records')
  for (const collection of ['mappedResearchCandidates','districtHistoryStories','heritageCandidates','culturalRecords','primaryAtlasEvents']) {
    assert.match(appSource, new RegExp(`\\.\\.\\.${collection}`), `${collection} must feed the public review layer`)
  }
  assert.match(appSource, /showAllReviewCandidates,setShowAllReviewCandidates\]=useState\(false\)/, 'pending information must start timeline-filtered instead of flooding the opening map')
  assert.match(appSource, /checked=\{showAllReviewCandidates\}/, 'the complete public review layer must remain available through an explicit control')
  assert.match(appSource, /href="#community"/, 'review candidates must link to the contribution workflow')
  assert.match(appSource, /pending:true/, 'review candidates must retain a visibly pending marker style')
  assert.match(appSource, /className="mobile-overlay-toggle"/, 'dense map overlays must expose compact mobile toggles')
  assert.match(appSource, /aria-expanded=\{mapLegendOpen\}/, 'the mobile map legend must expose its open state')
  assert.match(appSource, /aria-expanded=\{reviewOptionsOpen\}/, 'the mobile review options must expose their open state')
})

test('Atlas v0.23 exposes a focused seven-record promotion sprint without bypassing review', () => {
  assert.match(evidenceSource,/const p1PromotionCandidates=candidates\.filter/, 'the promotion sprint must derive records from the durable evidence candidates')
  assert.match(evidenceSource,/review\.requiredEvidence\.map/, 'every promotion card must show the complete seven-gate checklist')
  assert.match(evidenceSource,/review\.blockingEvidence\.length/, 'the card must report the current blocking-task count')
  assert.match(evidenceSource,/focusPromotionPacket/, 'researchers must be able to narrow the permanent task board to one promotion packet')
  assert.doesNotMatch(evidenceSource,/status=['"]promoted['"]/, 'the workflow UI must not promote a record merely by completing an assignment')
})

test('the first atlas view starts at the earliest story and reveals objects progressively', () => {
  assert.match(appSource,/initialShareState\.year\?\?firstTimelineStory\?\.year\?\?MIN_YEAR/, 'a shared year may override the earliest mapped-story opening state')
  assert.match(appSource,/reviewCandidateId:firstTimelineStory\.id,overview:true/, 'the earliest mapped record must be selected without abandoning the Karnataka overview')
  assert.match(appSource,/selected,setSelected\]=useState\(null\)/, 'the opening map must not preselect a later kingdom')
  assert.match(appSource,/showAllInscriptions,setShowAllInscriptions\]=useState\(false\)/, 'the opening map must timeline-filter inscriptions')
  assert.doesNotMatch(appSource,/const isCultureActive=\(item,year\)=>item\.timelineIndependent/, 'timeline-independent research layers must not flood the initial map')
})

test('Bengaluru epigraphy access hydrates from the live session without a public restriction banner', () => {
  assert.match(appSource, /fetch\(`\$\{import\.meta\.env\.VITE_COMMUNITY_API_URL\|\|''\}\/api\/auth\/me`/, 'the app must restore a live session after refresh')
  assert.match(appSource, /isCommunityMember=\{Boolean\(communityUser\)\}/, 'the authenticated parent state must reach the epigraphy explorer')
  assert.match(appSource, /onLogout=\{handleLoggedOut\}/, 'logout must revoke the parent epigraphy access state')
  assert.match(explorerSource, /import\('\.\/data\/bengaluru-kml\.js'\)/, 'the authenticated explorer must load the supplied Bengaluru KML candidate set')
  assert.match(explorerSource, /bengaluruAllowed&&placeFocus\.startsWith\('bengaluru'\)/, 'Bengaluru candidates must remain scoped to the authenticated city views')
  assert.doesNotMatch(explorerSource, /\{t\.bengaluruLoginRequired\}/, 'the public explorer must not disclose a login-only Bengaluru collection')
  assert.doesNotMatch(explorerSource, /city-access-gate/, 'the public explorer must not render a Bengaluru access gate')
})

test('Bengaluru explorer keeps the full KML inventory available without rendering every card at once', () => {
  assert.match(explorerSource, /visibleCount/, 'the explorer must cap the initial card batch')
  assert.match(explorerSource, /displayedRecords=filtered\.slice\(0,visibleCount\)/, 'cards must render from the visible slice')
  assert.match(explorerSource, /IntersectionObserver/, 'the explorer must load another batch as the list approaches the viewport')
  assert.match(explorerSource, /Load more records|ಇನ್ನಷ್ಟು ದಾಖಲೆಗಳನ್ನು ತೋರಿಸಿ/, 'a keyboard-accessible load-more fallback must remain available')
  assert.match(explorerSource, /classificationOptions/, 'Bengaluru classification filters must remain discoverable')
  assert.ok(bengaluruKmlCandidates.length > 1000, 'the full supplied KML inventory must remain bundled for the authenticated explorer')
  for (const candidate of bengaluruKmlCandidates.slice(0, 10)) {
    assert.match(candidate.id, /^bengaluru-kml-/)
    assert.ok(Number.isFinite(candidate.coordinates?.latitude) && Number.isFinite(candidate.coordinates?.longitude), `${candidate.id} must retain coordinates`)
    assert.equal(candidate.review?.status, 'needs-review', `${candidate.id} must remain a research candidate`)
    assert.ok(candidate.citations?.length, `${candidate.id} must retain its KML source locator`)
  }
})

test('relations explorer includes first-class bilateral political records and battle locations', () => {
  assert.match(relationsSource, /atlasData\.politicalRelations/, 'the relations page must consume the bilateral relation collection')
  assert.match(relationsSource, /politicalRelationRecords/, 'bilateral records must be normalized for filters and the map')
  assert.match(relationsSource, /battleLocations/, 'battle locations must be retained in map positions')
})

test('relations map separates polity identity, relationship type and review status', () => {
  assert.match(relationsSource,/const routeColorFor=item=>primaryPolityId\(item\)\?colorForPolity/, 'route colour must identify the participating polity')
  assert.match(relationsSource,/const relationDashes=\{trade:/, 'relationship types must use stable, distinct route patterns')
  assert.match(relationsSource,/color:routeColorFor\(item\)[\s\S]*dashArray:relationDashes\[item\.category\]/, 'pending review must not replace the route identity colour')
  assert.match(relationsSource,/relations-polity-legend/, 'the map legend must explain polity colours')
  assert.match(relationsSource,/relations-type-legend/, 'the map legend must explain relationship styles')
})

test('relations layout keeps the map and timeline usable on narrow screens', () => {
  assert.match(relationsSource,/className="relations-timeline"/, 'relations needs an in-map timeline for direct traversal')
  assert.match(relationsSource,/const \[open,setOpen\]=useState\(\(\)=>typeof window==='undefined'\|\|window\.innerWidth>820\)/, 'the review matrix should collapse on narrow screens')
  assert.match(relationsSource,/timelineStories=filtered\.slice\(\)\.sort/, 'the in-map timeline must follow the active filtered relation set')
  assert.match(relationsStylesSource,/\.relations-map\{height:68svh;min-height:480px\}/, 'mobile relations maps need enough height for map exploration')
  assert.match(relationsStylesSource,/\.relations-timeline\{position:absolute/, 'the timeline must stay attached to the map instead of pushing the matrix below the page')
  assert.match(relationsSource,/--timeline-color':colors\[item\.category\]/, 'timeline cards must carry the relationship colour')
  assert.match(relationsStylesSource,/\.relations-timeline button\{position:relative;border-top:3px solid var\(--timeline-color/, 'timeline cards must expose their relationship colour')
  assert.match(relationsStylesSource,/grid-template-columns:minmax\(230px,250px\) minmax\(560px,1fr\) minmax\(250px,280px\)/, 'wide layouts should reserve more space for the map')
  assert.match(relationsStylesSource,/\.relations-filters\{display:block;grid-column:2;grid-row:1/, 'wide layouts should keep filters in a stable side rail')
  assert.match(relationsStylesSource,/\.relations-list\{display:grid;grid-column:auto;grid-row:auto/, 'wide layouts should keep the relation list visible inside the side rail')
  assert.match(relationsStylesSource,/\.relations-map \.relations-legend\{top:12px;bottom:auto/, 'the map key must stay clear of the bottom timeline')
  assert.match(relationsSource,/const visibleRelations=isolateSelection&&selected\?\[selected\]:filtered/, 'selecting a relation must isolate its map paths')
  assert.match(relationsSource,/className="relations-clear-selection"/, 'the map needs a clear-selection control to restore all paths')
  assert.match(relationsStylesSource,/\.relations-clear-selection\{position:absolute;z-index:1200;left:52px/, 'clear selection must sit beside the Leaflet zoom controls')
  assert.match(relationsStylesSource,/\.relations-map \.map-theme-control\{top:54px;left:52px\}/, 'mobile map controls must stack instead of overlap')
  assert.match(relationsStylesSource,/\.relations-filters \.relations-clear-selection\{position:static/, 'clear selection should live below the filter controls')
  assert.match(relationsStylesSource,/\.relations-filters \.map-theme-control\{position:static/, 'relations map style control should live outside the map')
})

test('guided tours cover public pages and the private admin workspace', () => {
  assert.match(appSource, /<GuidedTour tourKey=\{view\}/, 'public routes must render the reusable tour')
  for (const route of ['atlas', 'relations', 'literature', 'epigraphy', 'districts', 'district-history', 'inscriptions', 'evidence', 'research', 'community', 'profile', 'about']) {
    const key = route.includes('-') ? `['"]${route}['"]` : route
    assert.match(appSource, new RegExp(`${key}:\\[`), `${route} must have page-specific tour steps`)
  }
  assert.match(adminSource, /<GuidedTour tourKey="admin"/, 'admin must have its own workflow tour')
  assert.match(tourSource, /role="dialog"/, 'tour instructions must be exposed as a dialog')
  assert.match(tourSource, /aria-modal="false"/, 'tour guidance must not present itself as a blocking modal')
  assert.match(tourSource, /karnataka-atlas-tour:welcome-v1/, 'the automatic tour offer must be shared across the whole application')
  assert.doesNotMatch(tourSource, /scrollIntoView/, 'the tour must not move the page away from what the user is exploring')
  assert.doesNotMatch(tourSource, /guided-tour-backdrop/, 'the tour must not dim or block the application')
  assert.match(tourSource, /ArrowRight|ArrowLeft|Escape/, 'tour must support keyboard navigation')
})
