export const CANONICAL_SCHEMA_VERSION='1.0.0'

export const ENTITY_COLLECTIONS={
  Site:'sites',Place:'places',Inscription:'inscriptions',Dynasty:'dynasties',Kingdom:'kingdoms',
  Ruler:'rulers',Deity:'deities',Monument:'monuments',LiteraryWork:'literary_works',
  Author:'authors',Source:'sources',SourceRecord:'source_records',
}

export const ENTITY_RELATION_FIELDS={
  sites:{place_id:'places'},
  inscriptions:{site_id:'sites',place_id:'places',dynasty_ids:'dynasties',ruler_ids:'rulers',deity_ids:'deities'},
  dynasties:{kingdom_ids:'kingdoms'},
  rulers:{dynasty_ids:'dynasties'},
  monuments:{site_id:'sites',place_id:'places',dynasty_ids:'dynasties',deity_ids:'deities'},
  literary_works:{author_ids:'authors',ruler_ids:'rulers',dynasty_ids:'dynasties'},
}

export const ENTITY_REQUIRED_METADATA={
  Site:['name','place_id'],Place:['name'],Inscription:['name','site_id','place_id'],Dynasty:['name'],Kingdom:['name'],
  Ruler:['name'],Deity:['name'],Monument:['name','site_id'],LiteraryWork:['name'],Author:['name'],Source:['name','publication'],SourceRecord:[],
}

export const UNCERTAINTY_VALUES=['exact','approximate','inferred','disputed','unknown']
export const REVIEW_STATUSES=['draft','needs-review','reviewed','published','rejected']
export const CANONICAL_ID_PATTERN=/^[a-z][a-z0-9]*(?::[a-z0-9][a-z0-9-]*)+$/

export const emptyCanonicalDataset=()=>({
  schema_version:CANONICAL_SCHEMA_VERSION,
  generated_at:null,
  entities:Object.fromEntries(Object.values(ENTITY_COLLECTIONS).map(key=>[key,[]])),
  indexes:{inscriptions_by_dynasty:{},inscriptions_by_ruler:{},inscriptions_by_place:{},inscriptions_by_source:{}},
})

export const slug=value=>String(value??'').normalize('NFKD').toLowerCase().trim()
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'unknown'

export const stableId=(namespace,...parts)=>`${namespace}:${parts.map(slug).filter(Boolean).join(':')}`

export const editorialStatus=(input={})=>({
  review_status:input.review_status||'needs-review',
  reviewed_by:Array.isArray(input.reviewed_by)?input.reviewed_by:[],
  location_precision:input.location_precision||'unknown',
  date_certainty:input.date_certainty||'unknown',
  last_updated:input.last_updated||null,
  publication_ready:input.publication_ready===true,
})

export const bilingual=(value,fallback='')=>{
  if(value&&typeof value==='object')return {en:value.en||fallback,kn:value.kn||''}
  return {en:String(value||fallback),kn:''}
}
