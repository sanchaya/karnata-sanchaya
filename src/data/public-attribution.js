export const PUBLIC_DATA_ATTRIBUTION={
  name:'Karnataka Historical Atlas',
  canonicalUrl:'https://karnata.sanchaya.net',
  credit:'Karnataka Historical Atlas · Sanchaya',
  originToken:'kha:karnata.sanchaya.net',
  notice:'Retain this attribution and the cited record-level sources when reusing public data.',
}

const hash=value=>{let result=2166136261;for(const character of String(value))result=Math.imul(result^character.charCodeAt(0),16777619);return(result>>>0).toString(36).padStart(7,'0')}
const citations=[
  token=>`Source: Karnataka Historical Atlas · ${PUBLIC_DATA_ATTRIBUTION.canonicalUrl} · ${token}`,
  token=>`Karnata Sanchaya record ${token} | ${PUBLIC_DATA_ATTRIBUTION.canonicalUrl}`,
  token=>`ಆಕರ: ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ · ${PUBLIC_DATA_ATTRIBUTION.canonicalUrl} · ${token}`,
  token=>`[${token}] Karnataka Historical Atlas — ${PUBLIC_DATA_ATTRIBUTION.canonicalUrl}`,
]

export const publicRecordAttribution=(record,context='record')=>{
  const identity=record?.id||record?.sourceId||record?.slug||record?.name?.en||record?.title?.en||JSON.stringify(record).slice(0,240)
  const digest=hash(`${context}|${identity}`), token=`kha:${digest}`
  return citations[Number.parseInt(digest,36)%citations.length](token)
}

export const appendPublicAttribution=(text,context='copy')=>`${text}\n\n${publicRecordAttribution({id:text},context)}`
