// Logic for the Migration page: which birds, from which countries, and what text goes on the globe.
export const birdName=(bird,locale)=>(locale==='kn'?bird.name.kn||bird.name.en:bird.name.en||bird.name.kn)||bird.scientificName

// Migratory birds that have at least one origin country or Indian state in the flyway data.
export const migrants=(species,flyways)=>species.filter(s=>s.group==='bird'&&s.seasonality?.migratory===true&&flyways[s.gbifKey]?.countries?.length)

export function filterMigrants(birds,{month=0,pattern='',query='',country=0,flyways}){
  const q=(query||'').normalize('NFC').trim().toLowerCase()
  return birds.filter(b=>(!month||b.seasonality.months.includes(month))
    &&(!pattern||b.seasonality.pattern===pattern)
    &&(!country||flyways[b.gbifKey].countries.some(c=>c.id===country))
    &&(!q||[b.name.en,b.name.kn,b.scientificName,b.family,...(b.knCandidates||[]).map(c=>c.value)].some(v=>(v||'').toLowerCase().includes(q))))
}

// Arcs for the globe: how many of these birds have each country as an origin.
export function originCounts(birds,flyways){
  const counts=new Map()
  for(const b of birds)for(const c of flyways[b.gbifKey].countries)counts.set(c.id,(counts.get(c.id)||0)+1)
  return [...counts].map(([id,weight])=>({id,weight})).sort((a,b)=>b.weight-a.weight)
}

// What to write beside each country on the globe.
//  - a bird is selected: its name at each of its origin countries
//  - a country is selected: the names of its birds (up to `max`), one per line
//  - otherwise: the country name and how many birds come from it
export function globeLabels({birds,flyways,selectedBird,selectedCountry,locale,nameOfCountry,max=8}){
  const labels={}
  if(selectedBird){
    for(const c of flyways[selectedBird.gbifKey].countries)labels[c.id]=[birdName(selectedBird,locale),nameOfCountry(c.id)]
    return labels
  }
  const byCountry=new Map()
  for(const b of birds)for(const c of flyways[b.gbifKey].countries){if(!byCountry.has(c.id))byCountry.set(c.id,[]);byCountry.get(c.id).push(b)}
  for(const [id,list] of byCountry){
    if(id===selectedCountry){
      const names=list.slice(0,max).map(b=>birdName(b,locale))
      labels[id]=[`${nameOfCountry(id)} · ${list.length}`,...names,...(list.length>max?[`+${list.length-max}`]:[])]
    }else labels[id]=`${nameOfCountry(id)} · ${list.length}`
  }
  return labels
}
