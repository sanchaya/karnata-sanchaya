import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { bengaluruKmlCandidates } from '../src/data/bengaluru-kml.js'

const appSource = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8')
const indexSource = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8')
const serviceWorkerSource = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8')
const explorerSource = await readFile(new URL('../src/LiteratureEpigraphyExplorer.jsx', import.meta.url), 'utf8')
const relationsSource = await readFile(new URL('../src/GlobalRelationsExplorer.jsx', import.meta.url), 'utf8')
const adminSource = await readFile(new URL('../src/Admin.jsx', import.meta.url), 'utf8')
const tourSource = await readFile(new URL('../src/GuidedTour.jsx', import.meta.url), 'utf8')

test('public navigation keeps the complete release route set and admin private', () => {
  const expectedRoutes = ['atlas', 'relations', 'literature', 'epigraphy', 'districts', 'district-history', 'inscriptions', 'evidence', 'research', 'community', 'profile', 'about']
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
  assert.match(appSource, /useState\(true\).*showAllReviewCandidates|showAllReviewCandidates.*useState\(true\)/s, 'pending information must be visible by default')
  assert.match(appSource, /href="#community"/, 'review candidates must link to the contribution workflow')
  assert.match(appSource, /pending:true/, 'review candidates must retain a visibly pending marker style')
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
