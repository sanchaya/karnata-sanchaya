// Pure helpers for the species photo importer and the page.
export const cleanCredit=value=>String(value||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#039;|&#39;/g,"'").replace(/\s+/g,' ').trim()
// Accept CC0, public domain, CC BY and CC BY-SA only. NonCommercial, NoDerivs, GFDL-only, fair-use and unknown terms are refused.
export function isOpenLicense(shortName,nonFree){
  const name=String(shortName||'').trim()
  if(!name||String(nonFree||'').toLowerCase()==='true')return false
  if(/(^|[\s-])(nc|nd)([\s-]|$)/i.test(name))return false
  return /^(cc0|public domain|pd\b|cc[ -]by([ -]sa)?\b)/i.test(name)
}
