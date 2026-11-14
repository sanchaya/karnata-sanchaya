// Approved Kannada species names and the species leaderboard, built from approved `species` contributions.
// A contribution targets a record id such as "species-gbif-2474942" and carries the name in record.name.kn.
const KANNADA=/[ಀ-೿]/
const TARGET=/^species-gbif-(\d+)$/
const safeJson=value=>{try{return typeof value==='string'?JSON.parse(value):value}catch{return null}}

export function speciesCommunity(rows){
  const names=new Map(),people=new Map()
  for(const row of [...rows].sort((a,b)=>new Date(a.decided_at)-new Date(b.decided_at))){
    const match=TARGET.exec(row.target_record_id||'')
    const kn=String(safeJson(row.proposed_record_json)?.name?.kn||'').normalize('NFC').replace(/\s+/g,' ').trim()
    if(!match||!kn||kn.length>120||!KANNADA.test(kn))continue
    names.set(match[1],{gbifKey:Number(match[1]),kn,by:row.display_name,byKn:row.display_name_kn||'',decidedAt:row.decided_at})
    const person=people.get(row.user_id)||{name:row.display_name,nameKn:row.display_name_kn||'',accepted:0,species:new Set()}
    person.accepted++;person.species.add(match[1]);people.set(row.user_id,person)
  }
  return {
    names:[...names.values()],
    leaders:[...people.values()].map(p=>({name:p.name,nameKn:p.nameKn,accepted:p.accepted,species:p.species.size})).sort((a,b)=>b.species-a.species||b.accepted-a.accepted||a.name.localeCompare(b.name)).slice(0,20),
  }
}
