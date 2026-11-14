import { stableNumber } from './aata-paata.js'

// Five species a day, each shown as a photo with four named options from the same group.
// Kannada rounds use species-level names only for the answer: a group name such as "ಬೆಳ್ಳಕ್ಕಿ" fits several species.
export function buildBirdRounds(species,images,locale='kn',seed='today',count=5){
  const nameOf=s=>locale==='kn'?s.name.kn:s.name.en
  const usable=species.filter(s=>images[s.gbifKey]&&nameOf(s))
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
