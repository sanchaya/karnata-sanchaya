#!/usr/bin/env node
// Reads Kannada bird names from two published pages and writes src/data/species/kn-name-sources.json.
// Only names, English group words and source links are kept, not the pages' text.
//   Vismaya Jagattu  Kannada name + transliteration + Hindi name + English group word (no scientific names)
//   Early Bird       Kannada names of the birds in its Kutuhali magazine column (no English names)
// Run: node scripts/import-species-names.mjs
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeKannada, isKannada } from '../src/species-normalize.js'

const out=path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),'src/data/species/kn-name-sources.json')
const UA='KarnatakaHistoricalAtlas/0.30 (https://karnata.sanchaya.net)'
const VISMAYA='https://vismayajagattu.wordpress.com/2013/02/10/%E0%B2%B5%E0%B2%BF%E0%B2%B8%E0%B3%8D%E0%B2%AE%E0%B2%AF-%E0%B2%9C%E0%B2%97%E0%B2%A4%E0%B3%8D%E0%B2%A4%E0%B3%81-%E0%B3%A7-%E0%B2%AA%E0%B2%95%E0%B3%8D%E0%B2%B7%E0%B2%BF-%E0%B2%AA%E0%B3%8D%E0%B2%B0/'
const EARLY='https://www.early-bird.in/%E0%B2%AA%E0%B2%95%E0%B3%8D%E0%B2%B7%E0%B2%BF-%E0%B2%AA%E0%B3%8D%E0%B2%B0%E0%B2%AA%E0%B2%82%E0%B2%9A/'
const decode=s=>s.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').replace(/&#8211;/g,'–')
const lines=html=>decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/g,'').replace(/<[^>]+>/g,'\n')).split('\n').map(l=>l.replace(/\s+/g,' ').trim()).filter(Boolean)
const get=async url=>{const r=await fetch(url,{headers:{'User-Agent':UA}});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.text()}
const DEVANAGARI=/[ऀ-ॿ]/, LATIN_ONLY=/^[A-Za-z][A-Za-z' \-]*$/

// Names that are not bird names for one group (checked by hand against the page).
const SKIP_ENGLISH=new Set(['bustard quails','hen','water cock'])
// Spelling fixes for English words on the page.
const FIX_ENGLISH={'indina robin':'Indian robin','oyster cacther':'Oyster catcher','king fisher':'Kingfisher','maina':'Myna','peacock':'Peafowl','tailor bird':'Tailorbird','boobies bird':'Boobies'}
// Kannada names the page puts against a group that does not match it (checked by hand).
const SKIP_PAIRS=new Set(['ಗಿಡುಗ|oriole','ಬಾತು ಕೋಳಿ|wagtail'])
const tidy=english=>{const raw=english.replace(/\s+/g,' ').trim();return FIX_ENGLISH[raw.toLowerCase()]||raw.replace(/\s+birds?$/i,'')}

export function parseVismaya(text){
  const entries=[];let pending=[]
  const start=text.findIndex(l=>l.startsWith('ಅಂಬರ ಕಿಚುಗ'))
  for(const line of text.slice(Math.max(start,0))){
    if(isKannada(line)){
      for(const part of line.split(',')){
        const name=normalizeKannada(part.replace(/\(.*$/,'').replace(/[–-]\s*$/,''))
        const translit=(part.match(/\(([^)]*)\)/)||[])[1]?.trim()||''
        if(name&&isKannada(name))pending.push({kn:name,translit})
      }
    }else if(DEVANAGARI.test(line)){/* Hindi name, not used */}
    else if(LATIN_ONLY.test(line)&&pending.length){
      const english=tidy(line)
      if(!SKIP_ENGLISH.has(english.toLowerCase()))for(const p of pending)if(!SKIP_PAIRS.has(`${p.kn}|${english.split(' ')[0].toLowerCase()}`)&&!entries.some(e=>e.kn===p.kn&&e.english.toLowerCase()===english.toLowerCase()))entries.push({...p,english})
      pending=[]
      if(english==='Bunting')break
    }
  }
  return entries
}
// The column's article titles are the lines between the two marker sentences. A name split over two
// lines by the page's markup (for example "ಕಾಜಾ" then "ಣ") is joined when the second part is 1-2 characters.
export function parseEarlyBird(text){
  const from=text.findIndex(l=>l.includes('ಕೆಳಕಂಡಂತಿವೆ')),to=text.findIndex(l=>l.startsWith('ಇದೊಂದು ಉಚಿತ'))
  const names=[]
  for(const line of text.slice(from+1,to>from?to:undefined)){
    if(line.length<=2&&names.length)names[names.length-1]+=line;else names.push(line)
  }
  return [...new Set(names.map(normalizeKannada))].filter(isKannada).map(kn=>({kn,english:''}))
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  const [vismaya,early]=await Promise.all([get(VISMAYA),get(EARLY)])
  const sources=[
    {id:'vismaya-jagattu',title:'ವಿಸ್ಮಯ ಜಗತ್ತು – ೧ – ಪಕ್ಷಿ ಪ್ರಪಂಚ (Vismaya Jagattu blog, 2013)',url:VISMAYA,scope:'group',entries:parseVismaya(lines(vismaya))},
    {id:'early-bird',title:'ಪಕ್ಷಿ ಪ್ರಪಂಚ · Early Bird (Kutuhali column “ಹಕ್ಕಿಯ ಗೂಡು”)',url:EARLY,scope:'species',entries:parseEarlyBird(lines(early))},
  ]
  await writeFile(out,JSON.stringify({generatedAt:new Date().toISOString().slice(0,10),sources},null,1)+'\n')
  for(const s of sources)console.log(s.id,s.entries.length)
}
