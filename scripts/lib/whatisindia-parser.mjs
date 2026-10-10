import crypto from 'node:crypto'

const BLOCK_TAGS=/<\/?(?:address|article|aside|blockquote|br|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|table|tbody|td|tfoot|th|thead|tr|ul)[^>]*>/gi
const RECORD_MARKER=/(?:^|\n)\s*(?:(?:No|Nos)\.?\s*)?(\d{1,4}(?:\s*[-–]\s*\d{1,4})?)\s*(?:\(\s*)?Page\s+No\.?\s*(\d+(?:\s*[-–]\s*\d+)?)\s*\)?/gim
const NON_RECORD_SLUGS=/^(?:index|contents?|introduction|preface|foreword|plates?|images?|bibliography|appendix|additions?|corrections?|miscellaneous|inscriptions?)$/i
const ROOT_NAV_FILENAMES=new Set(['information.html','democracy.html','government.html','states.html','neighbors.html','religions.html','religion.html','organization.html','organizations.html','sanaatanadharma.html','sanaatanadharmaintro.html','scriptures.html','principles.html','karma.html','individual.html','society.html','aboutus.html','contactus.html','content.html','latest.html','editorials.html','questions.html','search.html','feedback.html','guestbook.html','copyright.html','hindsun.html','vkarma.html'])

const entityMap={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',ndash:'–',mdash:'—',lsquo:'‘',rsquo:'’',ldquo:'“',rdquo:'”'}
export function decodeEntities(value=''){
  return String(value).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi,(_,entity)=>{
    if(entity[0]==='#'){
      const hex=entity[1]?.toLowerCase()==='x',number=Number.parseInt(entity.slice(hex?2:1),hex?16:10)
      return Number.isFinite(number)?String.fromCodePoint(number):_
    }
    return entityMap[entity.toLowerCase()]??_
  })
}

export function htmlToText(html=''){
  return decodeEntities(String(html)
    .replace(/<!--[\s\S]*?-->/g,' ')
    .replace(/<(?:script|style|noscript|svg)[^>]*>[\s\S]*?<\/(?:script|style|noscript|svg)>/gi,' ')
    .replace(BLOCK_TAGS,'\n')
    .replace(/<[^>]+>/g,' '))
    .replace(/\r/g,'')
    .replace(/[\t\f\v ]+/g,' ')
    .replace(/ *\n */g,'\n')
    .replace(/\n{3,}/g,'\n\n')
    .trim()
}

export function extractLinks(html,baseUrl){
  const links=[]
  for(const match of String(html).matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)){
    try{
      let href=match[1].trim()
      // Old corpus pages repeat root-site navigation as broken relative links.
      // Other relative links are genuine volume/article navigation.
      if(!/^https?:\/\//i.test(href)&&!href.startsWith('/inscriptions/')&&ROOT_NAV_FILENAMES.has(href.toLowerCase().split('/').at(-1)))continue
      if(href.startsWith('inscriptions/'))href=`/${href}`
      const url=new URL(href,baseUrl);url.hash='';url.search=''
      if(url.protocol==='http:')url.protocol='https:'
      if(url.hostname==='whatisindia.com')url.hostname='www.whatisindia.com'
      if(url.hostname!=='www.whatisindia.com')continue
      if(url.pathname!=='/inscriptions.html'&&!url.pathname.startsWith('/inscriptions/'))continue
      if(!/\.(?:html?|shtml)$/i.test(url.pathname)&&!url.pathname.endsWith('/'))continue
      links.push(url.href)
    }catch{}
  }
  return [...new Set(links)]
}

export function extractTitle(html,url){
  const candidates=[]
  for(const match of String(html).matchAll(/<(h[1-4]|title)\b[^>]*>([\s\S]*?)<\/\1>/gi)){
    const text=htmlToText(match[2]).replace(/\s+/g,' ').trim()
    if(text&&text.length>3&&!/^(?:what is india|inscriptions|south indian inscriptions)$/i.test(text))candidates.push(text)
  }
  if(candidates.length)return candidates.sort((a,b)=>b.length-a.length)[0].slice(0,240)
  const slug=new URL(url).pathname.split('/').filter(Boolean).at(-1)?.replace(/\.(?:html?|shtml)$/i,'').replace(/[-_]+/g,' ')||'Unresolved inscription page'
  return slug.replace(/\b\w/g,char=>char.toUpperCase()).slice(0,240)
}

export function classifyPublication(url,title=''){
  const path=new URL(url).pathname.toLowerCase(),combined=`${path} ${title}`
  let publication='WhatIsIndia inscription page',volume=null
  if(/annual[_ -]?reports?|annualreports/.test(combined))publication='Annual Reports on Indian Epigraphy'
  else if(/epigraph(?:ia|ica)[_ -]?indica/.test(combined))publication='Epigraphia Indica'
  else if(/south[_ -]?indian[_ -]?inscriptions/.test(combined))publication='South Indian Inscriptions'
  else if(/corpus[_ -]?inscriptionum[_ -]?indicarum|corpusinscriptionumindicarum/.test(combined))publication='Corpus Inscriptionum Indicarum'
  else if(/mysore.{0,20}archaeolog/.test(combined))publication='Mysore Archaeological Reports'
  const match=combined.match(/(?:volume|vol)[_ /.-]*(\d+[a-z]?)(?:[_ /.-]*(\d{4})[-_](\d{2,4}))?/i)
  if(match)volume=match[2]?`${match[1]} (${match[2]}–${match[3].length===2?match[2].slice(0,2)+match[3]:match[3]})`:match[1]
  return {publication,volume}
}

function normalizeRangeEnd(start,end){
  if(!end)return start
  const startText=String(start),endText=String(end)
  if(endText.length>=startText.length)return Number(endText)
  return Number(`${startText.slice(0,startText.length-endText.length)}${endText}`)
}

export function extractDate(text=''){
  const exact=String(text).match(/\b(?:A\.?\s*D\.?|C\.?\s*E\.?)\s*(\d{2,4})(?:\s*[-–]\s*(\d{1,4}))?/i)
  if(exact){const from=Number(exact[1]),candidate=normalizeRangeEnd(exact[1],exact[2]),to=candidate<from?from:candidate;return {from,to,certainty:exact[2]?'approximate':'exact'}}
  const bce=String(text).match(/\b(\d{2,4})(?:\s*[-–]\s*(\d{1,4}))?\s*(?:B\.?\s*C\.?\s*E?\.?)\b/i)
  if(bce){const high=Number(bce[1]),low=normalizeRangeEnd(bce[1],bce[2]);return {from:-Math.max(high,low),to:-Math.min(high,low),certainty:bce[2]?'approximate':'exact'}}
  const century=String(text).match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+century\s+(A\.?\s*D\.?|C\.?\s*E\.?|B\.?\s*C\.?\s*E?\.?)?/i)
  if(century){const number=Number(century[1]),isBce=/B/i.test(century[2]||'');return isBce?{from:-number*100,to:-(number-1)*100-1,certainty:'approximate'}:{from:(number-1)*100+1,to:number*100,certainty:'approximate'}}
  return {from:null,to:null,certainty:'unknown'}
}

export function extractPlace(text=''){
  const normalized=String(text).replace(/\n/g,' ').replace(/\s+/g,' ')
  const full=normalized.match(/\b([A-Z][A-Z .'-]{2,80}?)\s*,?\s+([A-Z][A-Z .'-]{2,60}?)\s+TALU[QK]\s*,?\s+([A-Z][A-Z .'-]{2,60}?)\s+DISTRICT\b/)
  if(full)return {place:full[1].trim(),taluk:full[2].trim(),district:full[3].trim()}
  const district=normalized.match(/\b([A-Z][A-Z .'-]{2,60}?)\s+DISTRICT\b/)
  return {place:null,taluk:null,district:district?.[1]?.trim()||null}
}

const safeName=value=>String(value||'').replace(/\s+/g,' ').trim().slice(0,240)
const shortHash=value=>crypto.createHash('sha256').update(String(value)).digest('hex').slice(0,16)

function recordName(segment,number,title,place){
  const lines=segment.split('\n').map(line=>line.trim()).filter(line=>line.length>2)
  const descriptive=lines.find(line=>!/^(?:No|Nos)?\.?\s*\d|^\(?Page\s+No/i.test(line)&&line.length>8&&line.length<180)
  if(place.place)return safeName(`${place.place} inscription ${number}`)
  return safeName(descriptive||`${title} — inscription ${number}`)
}

export function extractInscriptionRecords({html,url,retrievedAt=null}){
  const text=htmlToText(html),title=extractTitle(html,url),source=classifyPublication(url,title),matches=[...text.matchAll(RECORD_MARKER)],records=[]
  let activeGroup=null
  for(let index=0;index<matches.length;index++){
    const current=matches[index],next=matches[index+1],segment=text.slice(current.index,next?.index??text.length).trim()
    if(segment.length<60)continue
    const inscriptionNumber=current[1].replace(/\s+/g,''),page=current[2].replace(/\s+/g,''),place=extractPlace(segment),date=extractDate(segment)
    const range=inscriptionNumber.split(/[-–]/).map(Number)
    if(range.length===2&&range.every(Number.isFinite))activeGroup={from:Math.min(...range),to:Math.max(...range),place:{...place}}
    else if(range.length===1&&activeGroup&&range[0]>=activeGroup.from&&range[0]<=activeGroup.to){
      place.place||=activeGroup.place.place;place.taluk||=activeGroup.place.taluk;place.district||=activeGroup.place.district
    }else activeGroup=null
    const locator=`${inscriptionNumber}-p${page}`
    records.push({
      ID:`wii-${shortHash(`${url}#${locator}`)}`,
      Name:recordName(segment,inscriptionNumber,title,place),
      Category:'inscription',
      Place:place.place,
      Taluk:place.taluk,
      District:place.district,
      'Period from':date.from,
      'Period to':date.to,
      'Date certainty':date.certainty,
      'Location precision':'unknown',
      'Review status':'needs-review',
      Description:safeName(segment.slice(0,900)),
      'Source excerpt':segment.slice(0,3000),
      'Source publication':source.publication,
      'Source ID':`wii:source:${shortHash(source.publication)}`,
      Volume:source.volume,
      Page:page,
      'Inscription number':inscriptionNumber,
      'Source URL':url,
      'Discovery source':'WhatIsIndia inscriptions portal',
      'Discovery URL':'https://www.whatisindia.com/inscriptions.html',
      'Original page title':title,
      'Last updated':retrievedAt,
    })
  }
  const slug=new URL(url).pathname.split('/').filter(Boolean).at(-1)?.replace(/\.(?:html?|shtml)$/i,'')||''
  const leadLabel=`${slug} ${title}`
  return {title,source,text,records,isUnresolvedLead:records.length===0&&!NON_RECORD_SLUGS.test(slug)&&text.length>350&&/inscription|epigraph|copper.?plate|stone.?record|grant|edict|charter/i.test(leadLabel)}
}

export function unresolvedPageLead({html,url,retrievedAt=null}){
  const parsed=extractInscriptionRecords({html,url,retrievedAt})
  if(!parsed.isUnresolvedLead)return null
  const place=extractPlace(parsed.text),date=extractDate(parsed.text)
  return {
    ID:`wii-page-${shortHash(url)}`,
    Name:safeName(parsed.title),
    Category:'corpus-page-lead',
    Place:place.place,Taluk:place.taluk,District:place.district,
    'Period from':date.from,'Period to':date.to,'Date certainty':date.certainty,
    'Location precision':'unknown','Review status':'needs-review',
    Description:safeName(parsed.text.slice(0,900)),'Source excerpt':parsed.text.slice(0,3000),
    'Source publication':parsed.source.publication,'Source ID':`wii:source:${shortHash(parsed.source.publication)}`,
    Volume:parsed.source.volume,'Source URL':url,'Discovery source':'WhatIsIndia inscriptions portal',
    'Discovery URL':'https://www.whatisindia.com/inscriptions.html','Original page title':parsed.title,
    'Extraction note':'Page-level epigraphic lead; individual inscription boundaries and printed locators require human review.',
    'Last updated':retrievedAt,
  }
}
