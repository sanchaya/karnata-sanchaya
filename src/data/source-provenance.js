export const PROVENANCE_ORDER=['authority','scholarly','encyclopedic','media','community','reference']
export const provenanceLabels={
  authority:{en:'Authority / government source',kn:'ಪ್ರಾಧಿಕಾರ / ಸರ್ಕಾರಿ ಆಕರ',short:{en:'Authority source',kn:'ಪ್ರಾಧಿಕಾರದ ಆಕರ'}},
  scholarly:{en:'Scholarly / published research',kn:'ವಿದ್ವಾಂಸರ / ಪ್ರಕಟಿತ ಸಂಶೋಧನೆ',short:{en:'Scholarly research',kn:'ವಿದ್ವಾಂಸರ ಸಂಶೋಧನೆ'}},
  encyclopedic:{en:'Wikipedia / encyclopedic reference',kn:'ವಿಕಿಪೀಡಿಯ / ವಿಶ್ವಕೋಶ',short:{en:'Wikipedia / encyclopedic',kn:'ವಿಕಿಪೀಡಿಯ / ವಿಶ್ವಕೋಶ'}},
  media:{en:'News / media report',kn:'ಸುದ್ದಿ / ಮಾಧ್ಯಮ ವರದಿ',short:{en:'News / media',kn:'ಸುದ್ದಿ / ಮಾಧ್ಯಮ'}},
  community:{en:'Community / contributor-supplied',kn:'ಸಮುದಾಯ / ಕೊಡುಗೆದಾರ ಒದಗಿಸಿದ',short:{en:'Contributor-supplied',kn:'ಕೊಡುಗೆದಾರ ಒದಗಿಸಿದ'}},
  reference:{en:'Reference / catalogue',kn:'ಉಲ್ಲೇಖ / ಪಟ್ಟಿ',short:{en:'Reference / catalogue',kn:'ಉಲ್ಲೇಖ / ಪಟ್ಟಿ'}},
}
const AUTHORITY_DOMAIN=/\.gov\.in$|\.nic\.in$|\.unesco\.org$|karnatakatourism\.org$|nationalarchives\.nic\.in$|asi\.gov/
const ENCYCLOPEDIC_HOST=/wikipedia\.org$|wikidata\.org$|commons\.wikimedia\.org$/
const ENCYCLOPEDIC_TYPE=/^(wikipedia|wikidata|linked-open-data|encyclop)/i
const MEDIA_TYPE=/^(news|newspaper|journalistic|news-|memorial-news|district-history-feature)/i
const COMMUNITY_TYPE=/^(contributor|community|kml|user-|discovery-lead)/i
const AUTHORITY_TYPE=/^(government|official|epigraph|archaeological|heritage|protection|legislation|translated-primary)/i
const SCHOLARLY_TYPE=/^(book|article|journal|research|scholarly|doctoral|conference|museum|digitised-research|gazetteer|dataset|catalogue|field-guide|archive-|digital-corpus|periodical|reference|transcription-)/i

export const sourceTier=source=>{
  if(!source)return 'reference'
  let host=String(source.url||'')
  if(host.includes('//'))host=host.split('//')[1].split('/')[0]
  if(host&&AUTHORITY_DOMAIN.test(host))return 'authority'
  const type=String(source.type||'')
  if(COMMUNITY_TYPE.test(type))return 'community'
  if(host&&ENCYCLOPEDIC_HOST.test(host))return 'encyclopedic'
  if(ENCYCLOPEDIC_TYPE.test(type))return 'encyclopedic'
  if(MEDIA_TYPE.test(type))return 'media'
  if(AUTHORITY_TYPE.test(type))return 'authority'
  if(SCHOLARLY_TYPE.test(type))return 'scholarly'
  return 'reference'
}
export const buildSourceTiers=atlasData=>new Map(atlasData.sources.map(source=>[source.id,sourceTier(source)]))
export const recordAuthorityCited=(record,tiers)=>Array.from(new Set((record.citations||[]).map(citation=>citation.sourceId))).some(id=>tiers.get(id)==='authority')
export const provenanceTierLabel=(tier,locale,short=false)=>{const entry=provenanceLabels[tier]||provenanceLabels.reference;const value=short?entry.short[locale]:entry[locale];return value}