const byId=(records=[])=>new Map(records.map(record=>[record.id,record]))
const label=record=>record?.normalized_metadata?.name||{en:record?.id||'',kn:''}

export function canonicalExplorerRecords(canonical){
  if(!canonical?.entities)return []
  const e=canonical.entities,sites=byId(e.sites),places=byId(e.places),dynasties=byId(e.dynasties),rulers=byId(e.rulers),deities=byId(e.deities),sources=byId(e.sources),sourceRecords=byId(e.source_records),works=byId(e.literary_works)
  return (e.inscriptions||[]).map(item=>{
    const m=item.normalized_metadata||{},point=m.location?.coordinates,date=m.date||{}
    const relatedWorks=(item.derived_relationships||[]).filter(rel=>rel.type==='related-literary-work').map(rel=>works.get(rel.to_id)).filter(Boolean)
    const source=item.provenance?.source_id?sources.get(item.provenance.source_id):null,sourceRecord=(item.source_record_ids||[]).map(id=>sourceRecords.get(id)).find(Boolean)
    const transcription=item.transcription,translation=item.translation,coordinates=Array.isArray(point)?{latitude:point[1],longitude:point[0],precision:m.location.precision}:null
    return {
      id:item.id,name:m.name,description:m.description,date:{from:date.from,to:date.to,era:'CE',precision:date.certainty==='exact'?'year':date.certainty==='approximate'?'circa':date.from==null?'unknown':'range'},
      languages:m.languages||[],scripts:m.scripts||[],district:m.district,taluk:m.taluk,condition:m.condition,deityIds:m.deity_ids||[],religion:m.religion,
      dynastyIds:m.dynasty_ids||[],rulerIds:m.ruler_ids||[],sourceRecordIds:item.source_record_ids||[],siteId:m.site_id,placeId:m.place_id,
      place:m.name,coordinates,coords:Array.isArray(point)?[point[1],point[0]]:null,evidenceKind:'canonical',fixture:Boolean(item.fixture),review:{status:item.editorial_status?.review_status||'needs-review'},
      citations:[...(item.provenance?.source_id?[{sourceId:item.provenance.source_id,locator:[item.provenance.volume,item.provenance.inscription_number,item.provenance.page].filter(Boolean).join(' · ')}]:[]),...(item.provenance?.scan_url?[{sourceId:`${item.id}:scan`,locator:'Source scan'}]:[])],
      itemEdition:{primary:{series:item.provenance?.source_publication||'',volume:item.provenance?.volume||'',number:item.provenance?.inscription_number||'',locator:[item.provenance?.volume,item.provenance?.page].filter(Boolean).join(' · ')||'Unresolved'},alternateLocators:[]},
      presentCondition:{status:m.condition,description:{en:m.condition||'unknown',kn:''},sourceId:item.provenance?.source_id},
      resolution:{transcription:{status:transcription?'located':'unresolved',sourceId:transcription?item.provenance?.source_id:null,description:transcription?{en:transcription,kn:''}:null},translation:{status:translation?'located':'unresolved',sourceId:translation?item.provenance?.source_id:null,description:translation?{en:translation,kn:''}:null},coordinates:{status:coordinates?'provisional':'unresolved',sourceId:coordinates?item.provenance?.source_id:null,...coordinates}},
      researchNote:{en:`${item.fixture?'DEMONSTRATION FIXTURE — NOT RESEARCH DATA. ':''}Original/source metadata: ${JSON.stringify(sourceRecord?.source_record?.raw||{})}. Associated dynasties: ${(m.dynasty_ids||[]).join(', ')||'unresolved'}. Associated rulers: ${(m.ruler_ids||[]).join(', ')||'unresolved'}. Related literary works: ${relatedWorks.map(work=>work.id).join(', ')||'none linked'}.`,kn:item.fixture?'ಇದು ಪ್ರದರ್ಶನ ಪರೀಕ್ಷಾ ದಾಖಲೆ ಮಾತ್ರ; ಐತಿಹಾಸಿಕ ಸಂಶೋಧನಾ ದತ್ತಾಂಶವಲ್ಲ. ಮೂಲ ಮೌಲ್ಯಗಳನ್ನು source record ನಲ್ಲಿ ಬದಲಾಯಿಸದೆ ಉಳಿಸಲಾಗಿದೆ.':'ಮೂಲ ಮೌಲ್ಯಗಳನ್ನು source record ನಲ್ಲಿ ಬದಲಾಯಿಸದೆ ಉಳಿಸಲಾಗಿದೆ.'},
      canonical:{item,site:sites.get(m.site_id),place:places.get(m.place_id),dynasties:(m.dynasty_ids||[]).map(id=>dynasties.get(id)).filter(Boolean),rulers:(m.ruler_ids||[]).map(id=>rulers.get(id)).filter(Boolean),deities:(m.deity_ids||[]).map(id=>deities.get(id)).filter(Boolean),sourceRecords:(item.source_record_ids||[]).map(id=>sourceRecords.get(id)).filter(Boolean),source,sourceRecord,relatedWorks},
    }
  })
}

export const canonicalLabel=label
