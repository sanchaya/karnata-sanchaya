import { CANONICAL_ID_PATTERN, ENTITY_COLLECTIONS, ENTITY_RELATION_FIELDS, ENTITY_REQUIRED_METADATA, REVIEW_STATUSES, UNCERTAINTY_VALUES, bilingual, editorialStatus, emptyCanonicalDataset, stableId } from './model.js'

const clone=value=>JSON.parse(JSON.stringify(value))
const list=value=>Array.isArray(value)?value:value==null||value===''?[]:String(value).split(/[;,|]/).map(item=>item.trim()).filter(Boolean)
const valueOf=(raw,...keys)=>{for(const key of keys){if(raw[key]!=null&&raw[key]!=='')return raw[key]}return null}
const numberOrNull=value=>value==null||value===''?null:Number.isFinite(Number(value))?Number(value):null
const urlValid=value=>value==null||value===''||/^https?:\/\/[^\s]+$/i.test(value)

export function stageSourceRecords({corpus,source,records,importedAt=null}){
  if(!/^[A-Z][A-Z0-9-]{1,15}$/.test(corpus||''))throw new Error(`Invalid corpus namespace: ${corpus}`)
  if(!source?.publication)throw new Error('A source publication is required.')
  if(!Array.isArray(records))throw new Error('Importer input must contain a records array.')
  return records.map((raw,index)=>({
    id:stableId(corpus.toLowerCase(),valueOf(raw,'ID','id','Inscription number','inscription_number')||`row-${index+1}`),
    entity_type:'SourceRecord',corpus,fixture:Boolean(raw.fixture),
    source_record:{raw:clone(raw),input_row:index+1,imported_at:importedAt},
    source:{...clone(source),corpus},
  }))
}

export function normalizeStagedRecord(staged){
  const raw=staged.source_record.raw,corpus=staged.corpus.toLowerCase(),recordSlug=staged.id.split(':').slice(1).join('-')
  const lat=numberOrNull(valueOf(raw,'Latitude','latitude','GPS latitude')),lng=numberOrNull(valueOf(raw,'Longitude','longitude','GPS longitude'))
  const gps=valueOf(raw,'GPS/location','GPS','location'),pair=typeof gps==='string'?gps.match(/(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)/):null
  const latitude=lat??numberOrNull(pair?.[1]),longitude=lng??numberOrNull(pair?.[2])
  const district=valueOf(raw,'District','district'),taluk=valueOf(raw,'Taluk','taluk'),name=valueOf(raw,'Name','name')||`Fixture ${staged.corpus} record ${recordSlug}`
  const placeId=stableId('place',district||'unknown',taluk||'unknown',valueOf(raw,'Place','place','Village','village')||name)
  const siteId=stableId('site',district||'unknown',name)
  const inscriptionId=stableId(corpus,'inscription',valueOf(raw,'ID','id','Inscription number','inscription_number')||recordSlug)
  const dynastyNames=list(valueOf(raw,'Dynasty (multiple)','Dynasty','dynasties')),rulerNames=list(valueOf(raw,'Ruler (multiple)','Ruler','rulers')),kingdomNames=list(valueOf(raw,'Kingdom (multiple)','Kingdom','kingdoms'))
  const dynastyIds=dynastyNames.map(item=>stableId('dynasty',item)),rulerIds=rulerNames.map(item=>stableId('ruler',item))
  const kingdomIds=kingdomNames.map(item=>stableId('kingdom',item))
  const deityName=valueOf(raw,'Deity','deity'),deityIds=deityName?[stableId('deity',deityName)]:[]
  const from=numberOrNull(valueOf(raw,'Period from','period_from','Date from')),to=numberOrNull(valueOf(raw,'Period to','period_to','Date to'))
  const location=Number.isFinite(latitude)&&Number.isFinite(longitude)?{type:'Point',coordinates:[longitude,latitude],precision:valueOf(raw,'Location precision','location_precision')||'unknown'}:null
  const normalized_metadata={
    name:bilingual(name),aliases:list(valueOf(raw,'Aliases','aliases','Historical names')),
    category:valueOf(raw,'Category','category')||'inscription',description:bilingual(valueOf(raw,'Description','description')),
    site_id:siteId,place_id:placeId,district:bilingual(district),taluk:bilingual(taluk),location,
    condition:valueOf(raw,'Condition','condition')||'unknown',deity_ids:deityIds,deity_form:valueOf(raw,'Deity form','deity_form'),
    dynasty_ids:dynastyIds,kingdom_ids:kingdomIds,ruler_ids:rulerIds,languages:list(valueOf(raw,'Language (multiple)','Language','languages')),
    scripts:list(valueOf(raw,'Script (multiple)','Script','scripts')),century:valueOf(raw,'Century','century'),
    date:{from,to,certainty:valueOf(raw,'Date certainty','date_certainty')||'unknown'},religion:valueOf(raw,'Religion','religion'),
    within_project_area:valueOf(raw,'Within project area','within_project_area'),images:list(valueOf(raw,'Images','images')),
  }
  const sourcePublication=valueOf(raw,'Source publication','source_publication')||staged.source.publication
  const sourceId=valueOf(raw,'Source ID','source_id')||(sourcePublication===staged.source.publication&&staged.source.id?staged.source.id:stableId(corpus,'source',sourcePublication))
  const provenance={
    source_id:sourceId,source_publication:sourcePublication,
    volume:valueOf(raw,'Volume','volume')||staged.source.volume||null,page:valueOf(raw,'Page','page'),
    inscription_number:valueOf(raw,'Inscription number','inscription_number','ID','id'),source_url:valueOf(raw,'Source URL','source_url')||staged.source.url||null,
    scan_url:valueOf(raw,'Scan URL','scan_url'),editor:valueOf(raw,'Editor','editor')||staged.source.editor||null,
    publication_year:numberOrNull(valueOf(raw,'Publication year','publication_year')||staged.source.publication_year),
  }
  const status=editorialStatus({review_status:valueOf(raw,'Review status','review_status')||'needs-review',reviewed_by:list(valueOf(raw,'Reviewed by','reviewed_by')),location_precision:location?.precision||'unknown',date_certainty:normalized_metadata.date.certainty,last_updated:valueOf(raw,'Last updated','last_updated')})
  const derived_relationships=[
    {from_id:inscriptionId,type:'located-at-site',to_id:siteId,certainty:location?'approximate':'unknown'},
    {from_id:inscriptionId,type:'located-in-place',to_id:placeId,certainty:location?'approximate':'unknown'},
    ...dynastyIds.map(to_id=>({from_id:inscriptionId,type:'associated-with-dynasty',to_id,certainty:'inferred'})),
    ...rulerIds.map(to_id=>({from_id:inscriptionId,type:'associated-with-ruler',to_id,certainty:'inferred'})),
    ...deityIds.map(to_id=>({from_id:inscriptionId,type:'mentions-deity',to_id,certainty:'inferred'})),
  ]
  return {...staged,normalized_metadata,derived_relationships,editorial_status:status,provenance,canonical_id:inscriptionId}
}

const canonicalEntity=(id,type,metadata,sourceRecord,extra={})=>({id,entity_type:type,source_record_ids:[sourceRecord.id],normalized_metadata:metadata,derived_relationships:[],editorial_status:clone(sourceRecord.editorial_status),...extra})
const pushUnique=(array,item)=>{const found=array.find(value=>value.id===item.id);if(!found)array.push(item);return found||item}

export function importCanonical(stagedRecords,{generatedAt=null}={}){
  const dataset=emptyCanonicalDataset();dataset.generated_at=generatedAt
  for(const staged of stagedRecords.map(normalizeStagedRecord)){
    const m=staged.normalized_metadata,e=dataset.entities
    const sourceId=staged.provenance.source_id
    pushUnique(e.sources,canonicalEntity(sourceId,'Source',{name:bilingual(staged.provenance.source_publication),publication:staged.provenance.source_publication,url:staged.provenance.source_url,editor:staged.provenance.editor,publication_year:staged.provenance.publication_year},staged))
    pushUnique(e.places,canonicalEntity(m.place_id,'Place',{name:bilingual(staged.source_record.raw.Place||staged.source_record.raw.place||staged.source_record.raw.Name),aliases:m.aliases,district:m.district,taluk:m.taluk,location:m.location},staged))
    pushUnique(e.sites,canonicalEntity(m.site_id,'Site',{name:m.name,aliases:m.aliases,place_id:m.place_id,district:m.district,taluk:m.taluk,location:m.location,within_project_area:m.within_project_area},staged))
    for(const id of m.kingdom_ids)pushUnique(e.kingdoms,canonicalEntity(id,'Kingdom',{name:bilingual(id.split(':').at(-1).replaceAll('-',' ')),aliases:[]},staged))
    for(const id of m.dynasty_ids)pushUnique(e.dynasties,canonicalEntity(id,'Dynasty',{name:bilingual(id.split(':').at(-1).replaceAll('-',' ')),aliases:[],kingdom_ids:m.kingdom_ids},staged,{derived_relationships:m.kingdom_ids.map(to_id=>({from_id:id,type:'dynasty-of-kingdom',to_id,certainty:'inferred'}))}))
    for(const id of m.ruler_ids)pushUnique(e.rulers,canonicalEntity(id,'Ruler',{name:bilingual(id.split(':').at(-1).replaceAll('-',' ')),aliases:[],dynasty_ids:m.dynasty_ids},staged,{derived_relationships:m.dynasty_ids.map(to_id=>({from_id:id,type:'ruler-of-dynasty',to_id,certainty:'inferred'}))}))
    for(const id of m.deity_ids)pushUnique(e.deities,canonicalEntity(id,'Deity',{name:bilingual(id.split(':').at(-1).replaceAll('-',' ')),form:m.deity_form,religion:m.religion},staged))
    e.source_records.push({...staged,id:staged.id,entity_type:'SourceRecord'})
    e.inscriptions.push(canonicalEntity(staged.canonical_id,'Inscription',m,staged,{provenance:staged.provenance,derived_relationships:staged.derived_relationships,transcription:staged.source_record.raw.Transcription||null,translation:staged.source_record.raw.Translation||null,fixture:staged.fixture}))
  }
  dataset.indexes=buildCanonicalIndexes(dataset)
  return dataset
}

export function buildCanonicalIndexes(dataset){
  const indexes={inscriptions_by_dynasty:{},inscriptions_by_ruler:{},inscriptions_by_place:{},inscriptions_by_source:{}}
  const add=(index,key,id)=>{if(!key)return;(index[key]??=[]).push(id)}
  for(const item of dataset.entities.inscriptions||[]){const m=item.normalized_metadata||{};(m.dynasty_ids||[]).forEach(id=>add(indexes.inscriptions_by_dynasty,id,item.id));(m.ruler_ids||[]).forEach(id=>add(indexes.inscriptions_by_ruler,id,item.id));add(indexes.inscriptions_by_place,m.place_id,item.id);(item.source_record_ids||[]).forEach(id=>add(indexes.inscriptions_by_source,id,item.id))}
  return indexes
}

export function canonicalGeoJSON(dataset,{includeFixtures=false}={}){
  const features=(dataset.entities.inscriptions||[]).filter(item=>(includeFixtures||!item.fixture)&&item.normalized_metadata?.location).map(item=>({type:'Feature',id:item.id,geometry:clone(item.normalized_metadata.location),properties:{id:item.id,name:item.normalized_metadata.name,review_status:item.editorial_status.review_status,dynasty_ids:item.normalized_metadata.dynasty_ids,source_record_ids:item.source_record_ids}}))
  return {type:'FeatureCollection',features}
}

export function validateCanonicalDataset(dataset){
  const issues=[],add=(severity,collection,id,path,message)=>issues.push({severity,collection,id,path,message})
  if(!dataset?.entities)return [{severity:'error',collection:'canonical',id:'',path:'entities',message:'Canonical entities are required.'}]
  const all=new Map(),idsByCollection={}
  for(const [type,key] of Object.entries(ENTITY_COLLECTIONS)){
    const records=dataset.entities[key];idsByCollection[key]=new Set((records||[]).map(record=>record?.id).filter(Boolean))
    if(!Array.isArray(records)){add('error',key,'',key,'Canonical collection must be an array.');continue}
    for(const record of records){
      if(!CANONICAL_ID_PATTERN.test(record.id||''))add('error',key,record.id||'', 'id','Canonical ID must be namespaced.')
      if(all.has(record.id))add('error',key,record.id,'id',`Duplicate canonical ID; already used in ${all.get(record.id)}.`);else all.set(record.id,key)
      if(record.entity_type!==type)add('error',key,record.id,'entity_type',`Expected ${type}.`)
      for(const field of ENTITY_REQUIRED_METADATA[type]||[])if(record.normalized_metadata?.[field]==null||record.normalized_metadata?.[field]==='')add('error',key,record.id,`normalized_metadata.${field}`,`Required ${type} metadata is missing.`)
      if(!REVIEW_STATUSES.includes(record.editorial_status?.review_status))add('error',key,record.id,'editorial_status.review_status','Review status is invalid.')
      if(!UNCERTAINTY_VALUES.includes(record.editorial_status?.location_precision))add('error',key,record.id,'editorial_status.location_precision','Location precision is invalid.')
      if(!UNCERTAINTY_VALUES.includes(record.editorial_status?.date_certainty))add('error',key,record.id,'editorial_status.date_certainty','Date certainty is invalid.')
      const point=record.normalized_metadata?.location?.coordinates
      if(point&&(!Array.isArray(point)||point.length!==2||!point.every(Number.isFinite)||point[0]<-180||point[0]>180||point[1]<-90||point[1]>90))add('error',key,record.id,'normalized_metadata.location','Invalid coordinates.')
      const date=record.normalized_metadata?.date
      if(date?.from!=null&&date?.to!=null&&Number(date.from)>Number(date.to))add('error',key,record.id,'normalized_metadata.date','Impossible date range.')
    }
  }
  for(const [collection,fields] of Object.entries(ENTITY_RELATION_FIELDS))for(const record of dataset.entities[collection]||[])for(const [field,targetCollection] of Object.entries(fields)){
    const values=Array.isArray(record.normalized_metadata?.[field])?record.normalized_metadata[field]:[record.normalized_metadata?.[field]].filter(Boolean)
    values.forEach((id,index)=>{if(!idsByCollection[targetCollection]?.has(id))add('error',collection,record.id,`normalized_metadata.${field}.${index}`,`Unknown ${targetCollection} reference: ${id}`)})
  }
  for(const work of dataset.entities.literary_works||[]){
    const url=work.normalized_metadata?.sanchaya_url
    if(url&&!urlValid(url))add('error','literary_works',work.id,'normalized_metadata.sanchaya_url','Malformed Sanchaya URL.')
    if(work.normalized_metadata?.period&&typeof work.normalized_metadata.period!=='object')add('error','literary_works',work.id,'normalized_metadata.period','Literary work period must be structured.')
  }
  const known=id=>!id||all.has(id)
  for(const key of Object.values(ENTITY_COLLECTIONS))for(const record of dataset.entities[key]||[])for(const rel of record.derived_relationships||[]){
    if(!UNCERTAINTY_VALUES.includes(rel.certainty))add('error',key,record.id,'derived_relationships.certainty',`Invalid relationship certainty: ${rel.certainty}`)
    if(!known(rel.from_id)||!known(rel.to_id))add('error',key,record.id,'derived_relationships',`Broken relationship: ${rel.from_id} -> ${rel.to_id}`)
  }
  for(const item of dataset.entities.inscriptions||[]){
    const m=item.normalized_metadata||{}
    if(!item.provenance?.source_publication||!item.provenance?.source_id)add('error','inscriptions',item.id,'provenance','Missing provenance.')
    for(const field of ['source_url','scan_url'])if(!urlValid(item.provenance?.[field]))add('error','inscriptions',item.id,`provenance.${field}`,'Malformed URL.')
    ;[m.site_id,m.place_id,...(m.dynasty_ids||[]),...(m.ruler_ids||[]),...(m.deity_ids||[])].forEach((id,index)=>{if(!known(id))add('error','inscriptions',item.id,`relationships.${index}`,`Broken relationship: ${id}`)})
  }
  const seen=new Map()
  for(const item of dataset.entities.inscriptions||[]){const p=item.provenance||{},key=[p.source_publication,p.volume,p.inscription_number].join('|').toLowerCase();if(p.inscription_number&&seen.has(key))add('error','inscriptions',item.id,'provenance.inscription_number',`Duplicate inscription locator with ${seen.get(key)}.`);else if(p.inscription_number)seen.set(key,item.id)}
  return issues
}
