#!/usr/bin/env node
// Adds Kannada bird names from hakkipukka.com to src/data/species/kn-name-sources.json.
// Only the Kannada name, the English name (from the post's link text or web address) and a link back are kept; none of the
// site's text or photos. Polite: one request a second, all category pages (about 85, a couple of minutes). The site's owners were
// asked for permission; keep the source link visible. The source is written with `hold: true` (not shown publicly) until the owners agree; delete that flag to publish. Run: node scripts/import-hakkipukka-names.mjs
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeKannada, isKannada } from '../src/species-normalize.js'

const file=path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),'src/data/species/kn-name-sources.json')
const UA='KarnatakaHistoricalAtlas/0.30 (https://karnata.sanchaya.net; info@sanchifoundation.org)'
const SITE='https://hakkipukka.com'
const wait=ms=>new Promise(r=>setTimeout(r,ms))
const get=async url=>{await wait(1000);const r=await fetch(url,{headers:{'User-Agent':UA}});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.text()}
const decode=s=>s.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&amp;/g,'&').replace(/&nbsp;/g,' ')

// English name: the part after " | " in the link text, else the trailing Latin words of the post's web address.
export function englishName(text,href){
  const piped=text.split('|')[1]?.trim()
  if(piped&&/^[A-Za-z][A-Za-z' .\-]*$/.test(piped))return piped
  const slug=decodeURIComponent(new URL(href).pathname).replace(/^\/|\/$/g,'').replace(/﻿/g,'')
  const words=slug.split('-');const tail=[]
  for(let i=words.length-1;i>=0&&/^[a-z']+$/i.test(words[i]);i--)tail.unshift(words[i])
  return tail.join(' ').replace(/\b\w/g,c=>c.toUpperCase())
}
// Post links on one category page: [{kn,english,url}] (menu, category and page links are skipped).
export function parsePosts(html){
  const out=[]
  for(const m of html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([^<]{3,90})<\/a>/g)){
    const href=m[1],text=decode(m[2]).replace(/﻿/g,'').trim()
    if(!href.startsWith(SITE+'/')||/\/(category|tag|author|wp-)/.test(href)||href==SITE+'/'||href.endsWith('/didyouknow/'))continue
    const kn=normalizeKannada(text.split('|')[0])
    if(!isKannada(kn))continue
    const english=englishName(text,href)
    if(english&&english.length>2)out.push({kn,english,url:href})
  }
  return out
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  const sitemap=await get(`${SITE}/wp-sitemap-taxonomies-category-1.xml`)
  const orders=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1])
  const seen=new Map()
  for(const url of orders){for(const e of parsePosts(await get(url)))if(!seen.has(e.url))seen.set(e.url,e);console.log(url,seen.size)}
  const data=JSON.parse(await readFile(file,'utf8'))
  data.sources=data.sources.filter(s=>s.id!=='hakkipukka')
  data.sources.push({id:'hakkipukka',title:'ಹಕ್ಕಿಪುಕ್ಕ · Hakkipukka (Kannada bird names)',url:SITE+'/',scope:'species',hold:true,entries:[...seen.values()].sort((a,b)=>a.english.localeCompare(b.english))})
  data.generatedAt=new Date().toISOString().slice(0,10)
  await writeFile(file,JSON.stringify(data,null,1)+'\n')
  console.log('hakkipukka',seen.size)
}
