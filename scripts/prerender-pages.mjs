#!/usr/bin/env node
// Turns the built single-page app into crawlable pages: one landing page per section (/species/, /geography/ ...), one page
// per species (/species/<scientific-name>/), and a sitemap. Each page is the app's own index.html with its own title,
// description, canonical URL, Open Graph tags and structured data, plus a plain-HTML summary inside #root that the app
// replaces once it loads. /route-boot.js then moves a landing URL to "/#<page>" so the app opens that page.
//
// Canonical URLs always point at the main site (CANONICAL_SITE_URL, default https://karnata.sanchaya.net/). The static
// GitHub Pages mirror (VITE_STATIC_DATASET=true) gets the same canonicals, so it never competes with the main site, and no sitemap.
// Run after `vite build`: node scripts/prerender-pages.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seoPages, pageTitle } from '../src/seo-pages.js'
import { applyNameSources, applyReviewedNames, monthRange } from '../src/species-normalize.js'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const SEASON={resident:'resident all year','winter-visitor':'a winter visitor','summer-visitor':'a summer or monsoon visitor','passage-or-local-movement':'a passage migrant or local mover'}
// Pages that need an account are not landing pages.
const PRIVATE=new Set(['profile','reviews','operations','evidence','research-tasks'])
const GROUP_EN={bird:'bird',mammal:'mammal',reptile:'reptile',amphibian:'amphibian',insect:'insect',plant:'plant'}

export const escapeHtml=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
export const slugify=value=>String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')
const trim=(text,max)=>text.length<=max?text:`${text.slice(0,max-1).replace(/\s+\S*$/,'')}…`

// One URL slug per species: the scientific name, with the GBIF key added when two species share a slug.
export function speciesSlugs(species){
  const counts=new Map()
  for(const s of species){const slug=slugify(s.scientificName);counts.set(slug,(counts.get(slug)||0)+1)}
  return new Map(species.map(s=>{const slug=slugify(s.scientificName);return [s.gbifKey,counts.get(slug)>1?`${slug}-${s.gbifKey}`:slug]}))
}

function ldBlock(data){return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>`}

// Replace the head metadata and the loading content of the built index.html for one page.
export function renderPage(template,page,ctx){
  const {site,verification=''}=ctx
  const url=`${site}${page.path}`
  const set=(html,pattern,replacement)=>pattern.test(html)?html.replace(pattern,replacement):html
  let html=template
  html=set(html,/<title>[\s\S]*?<\/title>/,`<title>${escapeHtml(page.title)}</title>`)
  html=set(html,/<meta name="description" content="[^"]*"\s*\/?>/,`<meta name="description" content="${escapeHtml(page.description)}" />`)
  for(const [attr,key,value] of [['property','og:title',page.title],['property','og:description',page.ogDescription||page.description],['name','twitter:title',page.title],['name','twitter:description',page.ogDescription||page.description]])
    html=set(html,new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`),`<meta ${attr}="${key}" content="${escapeHtml(value)}" />`)
  html=set(html,/<meta property="og:image" content="[^"]*"\s*\/?>/,`<meta property="og:image" content="${escapeHtml(page.image||`${site}og-image.png`)}" />\n    <meta property="og:url" content="${escapeHtml(url)}" />`)
  html=set(html,/<meta name="twitter:image" content="[^"]*"\s*\/?>/,`<meta name="twitter:image" content="${escapeHtml(page.image||`${site}og-image.png`)}" />`)
  html=html.replace('<meta charset="UTF-8" />',`<meta charset="UTF-8" />\n    <link rel="canonical" href="${escapeHtml(url)}" />${verification}`)
  if(page.path==='')html=html.replace(/"(@id|url)":"\.\//g,`"$1":"${site}`)   // the home page's JSON-LD uses relative ids
  if(page.ld)html=html.replace('</head>',`    ${ldBlock(page.ld)}\n  </head>`)
  if(page.path!==''){
    html=html.replace(/(src|href)="\.\//g,'$1="/')                              // pages live below the root: make assets absolute
    // The boot script must run before every other script (early-dataset.js loads data by relative path).
    const boot=`<script src="/route-boot.js" data-view="${escapeHtml(page.view)}"${page.query?` data-query="${escapeHtml(page.query)}"`:''}></script>\n    `
    html=/<script data-cfasync/.test(html)?html.replace(/<script data-cfasync/,`${boot}<script data-cfasync`):html.replace(/<script[^>]*type="module"/,m=>`${boot}${m}`)
  }
  html=html.replace(/(<div id="root">[\s\S]*?<\/main>)/,`$1\n${page.body}`)
  return html
}

const navLinks=(site,pages)=>`<nav aria-label="Sections"><ul>${pages.map(p=>`<li><a href="/${p.path}">${escapeHtml(p.kn)} · ${escapeHtml(p.en)}</a></li>`).join('')}</ul></nav>`

export function buildSite({template,species,images={},site,date,verification='',sitemap=true}){
  const slugs=speciesSlugs(species)
  const sections=Object.keys(seoPages).filter(view=>view!=='atlas'&&!PRIVATE.has(view)).map(view=>({view,path:`${view}/`,kn:seoPages[view].kn[0].split(' · ')[0],en:seoPages[view].en[0].split(' · ')[0]}))
  const out=[],urls=[{loc:site,priority:'1.0',changefreq:'weekly'}]
  const bread=(items)=>({'@type':'BreadcrumbList',itemListElement:items.map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:`${site}${path}`}))})
  out.push({path:'',html:renderPage(template,{path:'',title:pageTitle('atlas'),description:seoPages.atlas.kn[1]+' '+seoPages.atlas.en[1],body:'',view:'atlas'},{site,verification})})
  for(const s of sections){
    const meta=seoPages[s.view],top=s.view==='species'?species.filter(x=>x.name.en||x.name.kn).slice(0,300):[]
    const body=`<article class="seo-static" lang="kn"><h1>${escapeHtml(meta.kn[0])}</h1><p>${escapeHtml(meta.kn[1])}</p><p lang="en">${escapeHtml(meta.en[1])}</p><p><a href="/#${s.view}">Open the interactive page · ಸಂವಾದಾತ್ಮಕ ಪುಟ ತೆರೆಯಿರಿ</a></p>${top.length?`<h2>Most recorded species · ಹೆಚ್ಚು ದಾಖಲಾದ ಪ್ರಭೇದಗಳು</h2><ul>${top.map(x=>`<li><a href="/species/${slugs.get(x.gbifKey)}/">${escapeHtml([x.name.kn,x.name.en].filter(Boolean).join(' · '))} (<i>${escapeHtml(x.scientificName)}</i>)</a></li>`).join('')}</ul>`:''}${navLinks(site,sections)}</article>`
    out.push({path:s.path,html:renderPage(template,{path:s.path,view:s.view,title:pageTitle(s.view),description:`${meta.kn[1]} ${meta.en[1]}`,ogDescription:meta.en[1],body,
      ld:{'@context':'https://schema.org','@graph':[{'@type':'WebPage','@id':`${site}${s.path}#page`,url:`${site}${s.path}`,name:meta.en[0],description:meta.en[1],inLanguage:['kn','en'],isPartOf:{'@id':`${site}#website`}},bread([['Karnataka Historical Atlas',''],[s.en,s.path]])]}},{site,verification})})
    urls.push({loc:`${site}${s.path}`,priority:s.view==='species'||s.view==='aata-paata'||s.view==='geography'?'0.8':'0.6',changefreq:'monthly'})
  }
  for(const x of species){
    const slug=slugs.get(x.gbifKey),p=`species/${slug}/`,img=images[x.gbifKey]
    const en=x.name.en||x.scientificName,kn=x.name.kn
    const months=x.seasonality&&x.seasonality.pattern!=='unknown'?monthRange(x.seasonality.months,MONTHS):''
    const season=x.seasonality&&SEASON[x.seasonality.pattern]?`In Karnataka it is ${SEASON[x.seasonality.pattern]}${months?` (recorded ${months})`:''}.`:''
    const knNote=kn?`Kannada name: ${kn}${x.knReviewed?'':' (suggested; awaiting review)'}.`:'No Kannada name has been confirmed yet.'
    const description=trim(`${[kn,en].filter(Boolean).join(' · ')} (${x.scientificName}) — a ${GROUP_EN[x.group]||'species'} recorded in Karnataka${x.family?`, family ${x.family}`:''}. ${season} ${knNote}`,300)
    const title=`${en||kn} (${x.scientificName})${en&&kn?` · ${kn}`:''} · Karnataka biodiversity`
    const body=`<article class="seo-static" lang="kn"><h1>${escapeHtml(kn||en)}</h1><p lang="en">${escapeHtml(en)} · <i>${escapeHtml(x.scientificName)}</i>${x.family?` · ${escapeHtml(x.family)}`:''}</p>${img?`<figure><img src="${escapeHtml(img.thumb)}" alt="${escapeHtml(en)}" width="480" loading="lazy" /><figcaption>Photo: ${escapeHtml(img.author)} · ${escapeHtml(img.license)} · <a href="${escapeHtml(img.page)}">Wikimedia Commons</a></figcaption></figure>`:''}<p lang="en">${escapeHtml(`${season} ${knNote}`.trim())}</p><p><a href="/?species=${encodeURIComponent(x.id)}#species">Open in the atlas: map of records, names and sources · ಅಟ್ಲಸ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ</a></p><p><a href="/species/">All species · ಎಲ್ಲ ಪ್ರಭೇದಗಳು</a></p></article>`
    out.push({path:p,html:renderPage(template,{path:p,view:'species',query:`species=${x.id}`,title,description,ogDescription:description,image:img?.thumb,body,
      ld:{'@context':'https://schema.org','@graph':[{'@type':'Taxon','@id':`${site}${p}#taxon`,name:x.scientificName,alternateName:[en,kn].filter(Boolean),taxonRank:'species',...(x.family?{parentTaxon:{'@type':'Taxon',name:x.family,taxonRank:'family'}}:{}),...(img?{image:img.thumb}:{}),sameAs:[`https://www.gbif.org/species/${x.gbifKey}`,...(x.wikidataId?[`https://www.wikidata.org/wiki/${x.wikidataId}`]:[])]},bread([['Karnataka Historical Atlas',''],['Species','species/'],[en,p]])]}},{site,verification})})
    urls.push({loc:`${site}${p}`,priority:'0.4',changefreq:'yearly'})
  }
  const xml=sitemap?`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${escapeHtml(u.loc)}</loc><lastmod>${date}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`:null
  return {pages:out,sitemap:xml,urlCount:urls.length}
}

export const verificationTags=env=>[['google-site-verification',env.GOOGLE_SITE_VERIFICATION],['msvalidate.01',env.BING_SITE_VERIFICATION],['yandex-verification',env.YANDEX_SITE_VERIFICATION],['naver-site-verification',env.NAVER_SITE_VERIFICATION]]
  .filter(([,value])=>value&&/^[\w-]{8,}$/.test(value)).map(([name,value])=>`\n    <meta name="${name}" content="${escapeHtml(value)}" />`).join('')

if(process.argv[1]===fileURLToPath(import.meta.url)){
  const dist=path.join(root,'dist'),site=(process.env.CANONICAL_SITE_URL||'https://karnata.sanchaya.net/').replace(/\/?$/,'/')
  const mirror=process.env.VITE_STATIC_DATASET==='true'
  const read=async file=>JSON.parse(await readFile(path.join(root,'src/data/species',file),'utf8'))
  const [data,lists,reviewed,images]=await Promise.all([read('karnataka-species.json'),read('kn-name-sources.json'),read('kn-names-reviewed.json'),read('species-images.json')])
  const species=applyReviewedNames(applyNameSources(data.species,lists.sources),reviewed)
  const template=await readFile(path.join(dist,'index.html'),'utf8')
  const result=buildSite({template,species,images:images.images,site,date:new Date().toISOString().slice(0,10),verification:verificationTags(process.env),sitemap:!mirror})
  for(const page of result.pages){
    const file=page.path?path.join(dist,page.path,'index.html'):path.join(dist,'index.html')
    await mkdir(path.dirname(file),{recursive:true});await writeFile(file,page.html)
  }
  if(result.sitemap)await writeFile(path.join(dist,'sitemap.xml'),result.sitemap)
  console.log(`Prerendered ${result.pages.length} pages${result.sitemap?` and a sitemap of ${result.urlCount} URLs`:' (mirror build: no sitemap)'} for ${site}`)
}
