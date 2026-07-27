import { atlasData } from '../src/data/atlas.js'

const photos=atlasData.heritageAudits.flatMap(audit=>audit.prioritySites.flatMap(site=>site.verification.photographs.map(photo=>({id:site.id,photo}))))
const titleFor=photo=>{
  if(photo.fileName)return `File:${photo.fileName}`
  const match=decodeURIComponent(photo.sourceUrl||'').match(/(?:File:|File\/)([^?#]+)/)
  if(match)return `File:${match[1].replaceAll('_',' ')}`
  const uploadName=decodeURIComponent(String(photo.url||'').split('?')[0].split('/').at(-1)||'')
  return uploadName?`File:${uploadName.replaceAll('_',' ')}`:null
}
const titles=[...new Set(photos.map(({photo})=>titleFor(photo)).filter(Boolean))]
const byTitle=new Map()
for(let index=0;index<titles.length;index+=25){
  const url=new URL('https://commons.wikimedia.org/w/api.php')
  Object.entries({action:'query',format:'json',prop:'imageinfo',iiprop:'url|extmetadata',titles:titles.slice(index,index+25).join('|'),origin:'*'}).forEach(([key,value])=>url.searchParams.set(key,value))
  const response=await fetch(url,{headers:{'User-Agent':'KarnatakaHistoricalAtlas/0.13 Commons-license-audit'}})
  if(!response.ok)throw new Error(`Commons HTTP ${response.status}`)
  const body=await response.json()
  for(const page of Object.values(body.query?.pages||{}))byTitle.set(page.title,page)
}
const clean=value=>String(value||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim()
const results={}
for(const {id,photo} of photos){
  const title=titleFor(photo);const page=byTitle.get(title);const info=page?.imageinfo?.[0];const meta=info?.extmetadata||{}
  if(!info){results[id]={status:'unresolved',title};continue}
  results[id]={status:'verified-on-commons',title:page.title,canonicalUrl:info.descriptionurl,imageUrl:info.thumburl||info.url,licenseShortName:clean(meta.LicenseShortName?.value),licenseUrl:meta.LicenseUrl?.value||'',artist:clean(meta.Artist?.value)||clean(meta.Credit?.value)||'Wikimedia Commons contributor',attributionRequired:meta.AttributionRequired?.value!=='false',usageTerms:clean(meta.UsageTerms?.value),checkedAt:'2026-07-26'}
}
console.log(JSON.stringify(results,null,2))
