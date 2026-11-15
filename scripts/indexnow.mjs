#!/usr/bin/env node
// Tells Bing, Yandex, Naver, Seznam and Yep (everyone that supports IndexNow) which URLs changed, so they re-crawl soon.
// Google does not use IndexNow; submit the sitemap in Search Console instead (see docs/seo.md).
//
// Run AFTER the site is deployed (the key file must be reachable), and only when you mean to contact those services:
//   node scripts/indexnow.mjs --yes                 submit every URL in the live sitemap
//   node scripts/indexnow.mjs --yes --only-root     submit just the home page
// Without --yes it prints what it would send and stops.
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const site=(process.env.CANONICAL_SITE_URL||'https://karnata.sanchaya.net/').replace(/\/?$/,'/')
const key=(await readdir(path.join(root,'public'))).map(f=>/^([0-9a-f]{32})\.txt$/.exec(f)?.[1]).find(Boolean)
if(!key){console.error('No IndexNow key file (public/<32 hex characters>.txt).');process.exit(1)}
const live=await fetch(`${site}sitemap.xml`).then(r=>r.ok?r.text():'').catch(()=>'')
const sitemap=live.includes('<loc>')?live:await readFile(path.join(root,'dist/sitemap.xml'),'utf8')   // before the first deploy, use the local build
let urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])
if(process.argv.includes('--only-root'))urls=[site]
console.log(`${urls.length} URL(s) for ${new URL(site).host}, key file ${site}${key}.txt`)
if(!process.argv.includes('--yes')){console.log('Dry run. Add --yes to submit to api.indexnow.org.');process.exit(0)}
// Same submission to any participating endpoint; if one refuses, try the next (a 403 from one network path is not final).
const ENDPOINTS=['https://api.indexnow.org/indexnow','https://www.bing.com/indexnow','https://yandex.com/indexnow']
for(let i=0;i<urls.length;i+=1000){
  const body=JSON.stringify({host:new URL(site).host,key,keyLocation:`${site}${key}.txt`,urlList:urls.slice(i,i+1000)})
  for(const endpoint of ENDPOINTS){
    const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body}).catch(error=>({status:`error ${error.message}`,text:async()=>''}))
    const note=(await res.text().catch(()=>'')).slice(0,200)
    console.log(`batch ${i/1000+1} via ${new URL(endpoint).host}: HTTP ${res.status}${note?` ${note}`:''}`)
    if(res.status===200||res.status===202)break
  }
}
