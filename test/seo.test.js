import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { buildSite, escapeHtml, slugify, speciesSlugs, verificationTags } from '../scripts/prerender-pages.mjs'
import { seoPages } from '../src/seo-pages.js'

const template=`<!doctype html><html lang="kn"><head>
<meta charset="UTF-8" />
<meta name="description" content="old" />
<meta property="og:title" content="old" />
<meta property="og:description" content="old" />
<meta property="og:image" content="./og-image.png" />
<meta name="twitter:title" content="old" />
<meta name="twitter:description" content="old" />
<script type="application/ld+json">{"@graph":[{"@id":"./#website","url":"./"}]}</script>
<title>old</title>
<script data-cfasync="false" src="./early-dataset.js"></script>
<script data-cfasync="false" type="module" crossorigin src="./assets/index-x.js"></script>
</head><body><div id="root"><main class="app-loading"><div>wait</div></main></div></body></html>`
const species=[
  {gbifKey:1,id:'species-gbif-1',scientificName:'Pavo cristatus',group:'bird',family:'Phasianidae',name:{en:'Indian Peafowl',kn:'ನವಿಲು'},seasonality:{pattern:'resident',months:[1,2,3,4,5,6,7,8,9,10,11,12],migratory:false},wikidataId:'Q1'},
  {gbifKey:2,id:'species-gbif-2',scientificName:'Pavo cristatus',group:'bird',family:'Phasianidae',name:{en:'Duplicate',kn:''}},
  {gbifKey:3,id:'species-gbif-3',scientificName:'Ficus <b>religiosa',group:'plant',family:'Moraceae',name:{en:'Sacred fig',kn:''}},
]
const site='https://example.org/'
const result=buildSite({template,species,images:{1:{thumb:'https://upload.wikimedia.org/x.jpg',author:'A "B"',license:'CC BY 4.0',page:'https://commons.wikimedia.org/wiki/File:x.jpg'}},site,date:'2026-11-14'})
const byPath=new Map(result.pages.map(p=>[p.path,p.html]))

test('slugs are unique, lowercase and URL safe',()=>{
  assert.equal(slugify('Ficus <b>religiosa'),'ficus-b-religiosa')
  const slugs=speciesSlugs(species)
  assert.equal(new Set(slugs.values()).size,3)
  assert.equal(slugs.get(1),'pavo-cristatus-1');assert.equal(slugs.get(2),'pavo-cristatus-2')
})

test('every page has its own title, description and canonical URL on the main site',()=>{
  const page=byPath.get('species/ficus-b-religiosa/')
  assert.match(page,/<link rel="canonical" href="https:\/\/example\.org\/species\/ficus-b-religiosa\/" \/>/)
  assert.doesNotMatch(page,/<title>old<\/title>/)
  assert.match(page,/<title>Sacred fig \(Ficus &lt;b&gt;religiosa\)/)
  assert.doesNotMatch(page,/<b>religiosa/,'names are escaped')
  assert.match(byPath.get('')??'',/<link rel="canonical" href="https:\/\/example\.org\/" \/>/)
  assert.match(byPath.get(''),/"url":"https:\/\/example\.org\/"/,'the home JSON-LD gets absolute URLs')
  for(const [path,html] of byPath)assert.equal((html.match(/rel="canonical"/g)||[]).length,1,path)
})

test('landing pages load the app through the boot script, before any other script',()=>{
  const page=byPath.get('species/pavo-cristatus-1/')
  assert.ok(page.indexOf('/route-boot.js')<page.indexOf('early-dataset.js'))
  assert.match(page,/data-view="species" data-query="species=species-gbif-1"/)
  assert.match(page,/src="\/assets\/index-x\.js"/,'assets become absolute below the root')
  assert.ok(page.includes('class="seo-static"')&&page.indexOf('class="app-loading"')<page.indexOf('class="seo-static"'))
  assert.doesNotMatch(byPath.get(''),/route-boot/,'the home page needs no boot script')
})

test('species pages carry Taxon structured data, the photo credit and the Kannada name status',()=>{
  const html=byPath.get('species/pavo-cristatus-1/')
  const ld=JSON.parse(/<script type="application\/ld\+json">(\{"@context"[^<]*)<\/script>/.exec(html)[1])
  const taxon=ld['@graph'].find(x=>x['@type']==='Taxon')
  assert.equal(taxon.name,'Pavo cristatus');assert.deepEqual(taxon.alternateName,['Indian Peafowl','ನವಿಲು'])
  assert.ok(ld['@graph'].some(x=>x['@type']==='BreadcrumbList'))
  assert.match(html,/CC BY 4\.0/);assert.match(html,/awaiting review/)
  assert.match(html,/og:image" content="https:\/\/upload\.wikimedia\.org\/x\.jpg"/)
})

test('the sitemap lists the home page, public sections and species, and nothing private',()=>{
  const locs=[...result.sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])
  assert.equal(locs.length,result.urlCount)
  assert.equal(new Set(locs).size,locs.length,'no duplicate URLs')
  assert.ok(locs.includes('https://example.org/')&&locs.includes('https://example.org/species/')&&locs.includes('https://example.org/species/pavo-cristatus-1/'))
  for(const hidden of ['profile','reviews','operations','evidence','research-tasks','atlas'])assert.ok(!locs.some(l=>l===`https://example.org/${hidden}/`),hidden)
  assert.ok(Object.keys(seoPages).filter(v=>!['profile','reviews','operations','evidence','research-tasks','atlas'].includes(v)).every(v=>locs.includes(`https://example.org/${v}/`)))
  assert.equal(buildSite({template,species,site,date:'2026-11-14',sitemap:false}).sitemap,null)
})

test('verification tags are only added for plausible tokens and are escaped',()=>{
  assert.equal(verificationTags({}),'')
  assert.match(verificationTags({GOOGLE_SITE_VERIFICATION:'abc_DEF-123456'}),/name="google-site-verification" content="abc_DEF-123456"/)
  assert.equal(verificationTags({BING_SITE_VERIFICATION:'"><script>'}),'')
  assert.equal(escapeHtml('<a href="x">&'),'&lt;a href=&quot;x&quot;&gt;&amp;')
})

test('robots, boot script, preview image and the IndexNow key file are in place',async()=>{
  const robots=await readFile(new URL('../public/robots.txt',import.meta.url),'utf8')
  assert.match(robots,/User-agent: \*\nAllow: \//)
  assert.doesNotMatch(robots,/User-agent: \*\s*\nDisallow: \//)
  const boot=await readFile(new URL('../public/route-boot.js',import.meta.url),'utf8')
  assert.match(boot,/replaceState/)
  const files=await readdir(new URL('../public/',import.meta.url))
  assert.ok(files.includes('og-image.png'))
  const keyFile=files.find(f=>/^[0-9a-f]{32}\.txt$/.test(f))
  assert.ok(keyFile,'IndexNow key file')
  assert.equal(await readFile(new URL(`../public/${keyFile}`,import.meta.url),'utf8'),keyFile.replace('.txt',''))
  const server=await readFile(new URL('../server/app.js',import.meta.url),'utf8')
  assert.match(server,/req\.path==='\/'\?200:404/,'unknown paths are 404, not soft 404s')
})

test('every public page has search metadata, so a new page cannot ship unindexed',async()=>{
  const { readFile } = await import('node:fs/promises')
  const app=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8')
  const views=app.match(/const publicViews=\[([^\]]*)\]/)[1].match(/'[^']+'/g).map(v=>v.slice(1,-1))
  const missing=views.filter(v=>!seoPages[v])
  assert.deepEqual(missing,[],`add these to src/seo-pages.js (and docs/seo.md): ${missing}`)
  const titles=Object.values(seoPages).map(p=>p.en[0])
  assert.equal(new Set(titles).size,titles.length,'page titles must be unique')
  for(const [view,page] of Object.entries(seoPages))assert.ok(page.kn[1].length>30&&page.en[1].length>30,`${view} needs real descriptions`)
})

test('every query parameter the app reads is owned by a page, so it is cleared when the reader leaves',async()=>{
  const { readFile, readdir } = await import('node:fs/promises')
  const app=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8')
  const owned=Object.keys(eval('('+app.match(/const PAGE_PARAMS=(\{[^\n]*\})/)[1]+')'))
  const shared=new Set(['year','zoom','lat','lng','record','resetToken'])
  const files=(await readdir(new URL('../src/',import.meta.url))).filter(f=>/\.jsx?$/.test(f))
  for(const f of files){
    const text=await readFile(new URL(`../src/${f}`,import.meta.url),'utf8')
    for(const m of text.matchAll(/(?:searchParams|params|URLSearchParams\([^)]*\))\.get\('([A-Za-z]+)'\)/g))
      assert.ok(owned.includes(m[1])||shared.has(m[1]),`${f} reads ?${m[1]}: add it to PAGE_PARAMS in App.jsx (or to the shared list here)`)
  }
})
