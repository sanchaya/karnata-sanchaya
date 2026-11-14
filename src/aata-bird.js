import { stableNumber } from './aata-paata.js'

// Five species a day, each shown as a photo with four named options from the same group.
// Kannada rounds use species-level names only for the answer: a group name such as "ಬೆಳ್ಳಕ್ಕಿ" fits several species.
// The word for the kind of living thing, so the game never says "species" when it means a bird or a plant.
export const SPECIES_TYPES={bird:{kn:'ಹಕ್ಕಿ',en:'bird'},mammal:{kn:'ಪ್ರಾಣಿ',en:'mammal'},reptile:{kn:'ಸರೀಸೃಪ',en:'reptile'},amphibian:{kn:'ಉಭಯಚರ',en:'amphibian'},insect:{kn:'ಕೀಟ',en:'insect'},plant:{kn:'ಸಸ್ಯ',en:'plant'}}
export const quizTitle=(group,locale)=>{const w=SPECIES_TYPES[group];return w?(locale==='kn'?`ಯಾವ ${w.kn}?`:`Name that ${w.en}`):(locale==='kn'?'ಯಾವ ಜೀವಿ?':'Name that species')}
export const roundQuestion=(group,locale)=>{const w=SPECIES_TYPES[group];return w?(locale==='kn'?`ಇದು ಯಾವ ${w.kn}?`:`Which ${w.en} is this?`):(locale==='kn'?'ಇದು ಯಾವ ಜೀವಿ?':'Which species is this?')}

// `group` ('' for all types) limits the rounds to one kind of species.
export function buildBirdRounds(species,images,locale='kn',seed='today',count=5,group=''){
  const nameOf=s=>locale==='kn'?s.name.kn:s.name.en
  const usable=species.filter(s=>images[s.gbifKey]&&nameOf(s)&&(!group||s.group===group))
  const answers=usable.filter(s=>locale!=='kn'||(s.knScope!=='group'))
  const byHash=(items,key)=>[...items].sort((a,b)=>stableNumber(`${seed}:${key}:${a.id}`)-stableNumber(`${seed}:${key}:${b.id}`))
  const picked=[],used=new Set()
  for(const s of byHash(answers,'pick')){
    if(picked.length>=count)break
    const name=nameOf(s)
    if(used.has(name))continue
    used.add(name);picked.push(s)
  }
  return picked.map(answer=>{
    const taken=new Set([nameOf(answer)])
    const others=[]
    for(const s of byHash(usable.filter(o=>o.id!==answer.id&&o.group===answer.group),`opt:${answer.id}`)){
      if(others.length>=3)break
      if(taken.has(nameOf(s)))continue
      taken.add(nameOf(s));others.push(s)
    }
    return {id:answer.id,gbifKey:answer.gbifKey,answer:nameOf(answer),scientificName:answer.scientificName,group:answer.group,
      options:byHash([answer,...others],`order:${answer.id}`).map(s=>({id:s.id,name:nameOf(s)}))}
  })
}
