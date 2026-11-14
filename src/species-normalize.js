// Pure helpers used by scripts/import-species.mjs and the species page.
const KANNADA=/[ಀ-೿]/
export const isKannada=value=>KANNADA.test(value||'')
// NFC, collapse whitespace, drop bracketed notes and a trailing full stop.
export const normalizeKannada=value=>String(value||'').normalize('NFC').replace(/[\(\[（].*?[\)\]）]/g,'').replace(/[​⁠﻿]/g,'').replace(/\s+/g,' ').replace(/[.。]+$/,'').trim()
// Title-style bird/animal names: "indian peafowl" -> "Indian Peafowl" is not forced; only tidy spacing and case-folded duplicates.
export const normalizeEnglish=value=>String(value||'').normalize('NFC').replace(/\s+/g,' ').trim()
const isNeutral=name=>/^[A-Za-z][A-Za-z' \-]+$/.test(name)
// Prefer a Wikidata label (curated, one per taxon), else the shortest plain GBIF name.
export function pickEnglishName(gbifNames,wikidataNames){
  const wd=(wikidataNames||[]).map(normalizeEnglish).filter(isNeutral)
  if(wd[0])return wd[0]
  const plain=(gbifNames||[]).map(normalizeEnglish).filter(isNeutral)
  const counts=new Map();for(const n of plain){const k=n.toLowerCase();counts.set(k,(counts.get(k)||0)+1)}
  return plain.sort((a,b)=>(counts.get(b.toLowerCase())-counts.get(a.toLowerCase()))||a.length-b.length)[0]||''
}
// months: 12 observation counts, January first. Inferred from eBird effort-biased
// counts, so it is a hint for readers, never an authority on migration.
export function classifySeasonality(months){
  const total=months.reduce((a,b)=>a+b,0)
  if(total<20)return {pattern:'unknown',migratory:null,months:[],basis:'too few observations'}
  const present=months.map((c,i)=>c/total>=.02?i+1:0).filter(Boolean)
  const within=allowed=>present.every(m=>allowed.includes(m))
  let pattern='resident'
  if(present.length<=9){
    if(within([10,11,12,1,2,3,4]))pattern='winter-visitor'
    else if(within([3,4,5,6,7,8,9]))pattern='summer-visitor'
    else pattern='passage-or-local-movement'
  }
  return {pattern,migratory:pattern!=='resident',months:present,basis:'inferred from eBird month counts'}
}

// reviewed: {"<gbifKey>":{"kn":"ಹೆಸರು","note":"source or reviewer"}} — names accepted from reader suggestions.
// A reviewed name replaces the imported one and is shown as reviewed.
export const applyReviewedNames=(species,reviewed={})=>species.map(item=>{
  const r=reviewed[item.gbifKey]
  const kn=normalizeKannada(r?.kn)
  return kn&&isKannada(kn)?{...item,name:{...item.name,kn},knReviewed:true,knNote:r.note||''}:item
})
export const filterSpecies=(species,{group,query,seasonality,needsKannada,month,family,ids,origin,flyways})=>{
  const q=(query||'').normalize('NFC').trim().toLowerCase()
  return species.filter(s=>(!group||s.group===group)
    &&(!seasonality||(seasonality==='migratory'?s.seasonality?.migratory===true:s.seasonality?.pattern===seasonality))
    &&(!month||(s.seasonality?.migratory===true&&s.seasonality.months.includes(month)))
    &&(!family||s.family===family)
    &&(!origin||(flyways?.[s.gbifKey]?.countries||[]).some(c=>c.id===origin))
    &&(!ids||ids.includes(s.id))
    &&(!needsKannada||!s.name.kn||(!s.knReviewed&&!s.knCandidates?.length))
    &&(!q||[s.name.en,s.name.kn,s.scientificName,s.family,...(s.knCandidates||[]).map(c=>c.value)].some(v=>(v||'').toLowerCase().includes(q))))
}

// Group words from curated name lists ("Kite", "Hornbills") -> a comparable key.
const groupKey=word=>String(word||'').toLowerCase().replace(/-/g,' ').replace(/\s+/g,' ').trim().replace(/(ches|shes|sses)$/,m=>m.slice(0,-2)).replace(/(?<!s)s$/,'')
const lastWord=name=>groupKey(String(name||'').split(/[\s-]+/).pop())
const addCandidate=(candidates,value,source,extra)=>{
  const found=candidates.find(c=>c.value===value)
  if(found){if(!found.sources.includes(source))found.sources.push(source)}
  else candidates.push({value,sources:[source],...extra})
}
// lists: kn-name-sources.json "sources". A list with scope "group" (English group word, no scientific name) names every
// species of that group and is marked scope "group"; a list with no English words only corroborates a name that already
// exists. Species-specific candidates stay first.
export function applyNameSources(species,lists=[]){
  return species.map(item=>{
    const candidates=(item.knCandidates||[]).map(c=>({...c,sources:[...c.sources]}))
    const english=String(item.name.en||'').toLowerCase().replace(/-/g,' ')
    for(const list of lists)for(const e of list.entries){
      const kn=normalizeKannada(e.kn)
      if(!kn||!isKannada(kn))continue
      if(!e.english){if(candidates.some(c=>c.value===kn))addCandidate(candidates,kn,list.id);continue}
      const key=groupKey(e.english),multi=key.includes(' ')
      if(multi?english.includes(key):lastWord(item.name.en)===key)addCandidate(candidates,kn,list.id,{scope:list.scope||'group',group:e.english})
    }
    candidates.sort((a,b)=>(a.scope==='group')-(b.scope==='group')||b.sources.length-a.sources.length)
    const top=candidates[0]
    const name=item.name.kn||!top?item.name:{...item.name,kn:top.value}
    return {...item,knCandidates:candidates,name,knScope:name.kn&&candidates.find(c=>c.value===name.kn)?.scope==='group'&&!(item.knCandidates||[]).some(c=>c.value===name.kn)?'group':undefined}
  })
}

// Number of migratory birds recorded in each month (index 0 = January), for the migration calendar.
export const migratoryByMonth=species=>Array.from({length:12},(_,i)=>species.filter(s=>s.seasonality?.migratory===true&&s.seasonality.months.includes(i+1)).length)
// Species still without any Kannada name, photo first, in a fixed order per seed, for the "name ten species" drive.
export const namingDrive=(species,images,seed,count=10)=>{
  const rank=id=>{let h=2166136261;for(const ch of `${seed}:${id}`){h^=ch.codePointAt(0);h=Math.imul(h,16777619)}return h>>>0}
  return species.filter(s=>!s.name.kn).sort((a,b)=>(!!images[b.gbifKey]-!!images[a.gbifKey])||rank(a.id)-rank(b.id)).slice(0,count).map(s=>s.id)
}

// [10,11,12,1,2,3] -> "Oct–Mar"; wraps over the new year; gaps are listed as separate ranges ("Mar–Apr, Sep–Oct").
export function monthRange(months,names){
  const set=new Set(months)
  if(!set.size)return ''
  if(set.size===12)return `${names[0]}–${names[11]}`
  const runs=[]
  const next=m=>m===12?1:m+1
  for(let m=1;m<=12;m++)if(set.has(m)&&!set.has(m===1?12:m-1)){let end=m,len=1;while(len<12&&set.has(next(end))){end=next(end);len++}runs.push([m,end])}
  return runs.map(([a,b])=>a===b?names[a-1]:`${names[a-1]}–${names[b-1]}`).join(', ')
}
