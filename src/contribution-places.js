import { atlasData } from './data/atlas'

const translated=(value,locale)=>typeof value==='string'?value:value?.[locale]||value?.kn||value?.en||''
const bilingual=value=>typeof value==='string'?{en:value,kn:value}:value
const normalized=value=>translated(value,'en').trim().toLocaleLowerCase()
const places=atlasData.places||[]
const placesByName=new Map()
for(const place of places)for(const value of [place.name?.en,place.name?.kn])if(value){const key=String(value).trim().toLocaleLowerCase();placesByName.set(key,[...(placesByName.get(key)||[]),place])}

const districtByAuditId=new Map((atlasData.heritageAudits||[]).map(audit=>[audit.id,audit.district]))
const districtByPlaceId=new Map(),talukByPlaceId=new Map()
for(const collection of ['inscriptions','culturalHeritage','heritageInventoryLeads','templeInventoryLeads','districtHistoryResearch'])for(const record of atlasData[collection]||[]){
  const district=record.district||districtByAuditId.get(record.districtAuditId),taluk=record.taluk
  const ids=[record.placeId,...(record.placeIds||[])].filter(Boolean)
  if(!ids.length){
    const label=String(record.locationLabel||record.placeName||'').trim().toLocaleLowerCase()
    for(const place of placesByName.get(label)||[])if(!district||!districtByPlaceId.has(place.id)||normalized(district)===normalized(districtByPlaceId.get(place.id)))ids.push(place.id)
  }
  for(const placeId of ids){if(district&&!districtByPlaceId.has(placeId))districtByPlaceId.set(placeId,district);if(taluk&&!talukByPlaceId.has(placeId))talukByPlaceId.set(placeId,taluk)}
}

export const contributionDistricts=(atlasData.heritageAudits||[]).filter(audit=>audit.region!=='cross-border').map(audit=>({id:audit.id,name:audit.district})).sort((a,b)=>translated(a.name,'en').localeCompare(translated(b.name,'en')))
export const contributionPlaces=places.map(place=>({id:place.id,name:place.name,district:bilingual(districtByPlaceId.get(place.id)),taluk:bilingual(talukByPlaceId.get(place.id)),latitude:place.location?.coordinates?.[1],longitude:place.location?.coordinates?.[0],precision:place.location?.precision||'unknown'})).sort((a,b)=>translated(a.name,'en').localeCompare(translated(b.name,'en')))
export const contributionPlaceLabel=(place,locale)=>locale==='kn'&&place.name?.kn?`${place.name.kn} · ${place.name.en}`:place.name?.en||place.id
export const contributionDistrictLabel=(district,locale)=>locale==='kn'&&district.name?.kn?`${district.name.kn} · ${district.name.en}`:district.name?.en||district.id
export const matchContributionPlace=value=>{const needle=String(value||'').trim().toLocaleLowerCase();return needle?contributionPlaces.find(place=>[place.id,translated(place.name,'en'),translated(place.name,'kn'),contributionPlaceLabel(place,'en'),contributionPlaceLabel(place,'kn')].some(candidate=>String(candidate||'').toLocaleLowerCase()===needle)):null}
