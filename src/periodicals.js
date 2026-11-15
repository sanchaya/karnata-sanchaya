// Newspaper and magazine people. The catalogue has no gender field, so gender is only a
// rough reading of the Kannada name and is always shown as "inferred, not reviewed".
// shortcut: name-based rules, replace by a reviewed `gender` column in the CSV when one exists.
const SPLIT=/\s*[\/,;&]\s*|\s+ಮತ್ತು\s+/
const ORG=/(ಕಾರ್ಯಾಲಯ|ಪ್ರಕಟಣಾಲಯ|ಫೆಡರೇಷನ್|ಸಮಾಜ|ಪ್ರಿಂಟರ್ಸ್|ಪೀಠ|ಮಂದಿರ|ಸಂಘ|ಸಂಸ್ಥೆ|ಪ್ರಕಾಶನ|ಪ್ರಕಾಶಕರು|ಪಬ್ಲಿಕೇ|ಟ್ರಸ್ಟ್|ಸಮಿತಿ|ವಿಶ್ವವಿದ್ಯಾ|ವಿದ್ಯಾಲಯ|ಕಾಲೇಜು|ಮಂಡಳಿ|ಮಂಡಲ|ಅಕಾಡೆಮಿ|ಪ್ರೆಸ್|ಮುದ್ರಣ|ಇಲಾಖೆ|ನಿರ್ದೇಶ|ಮಿಷನ್|ಇನ್ಸ್ಟಿಟ್ಯೂಟ್|ಇನ್ಸ್‌ಟಿಟ್ಯೂಟ್|ಪರಿಷತ್|ಸೊಸೈಟಿ|ಬ್ಯಾಂಕ್|ಲಿಮಿಟೆಡ್|ಕಂಪನಿ|ಕಂಪೆನಿ|ಫೌಂಡೇಶನ್|ಕೇಂದ್ರ|ಸಭಾ|ವೇದಿಕೆ|ಬಳಗ|ಮಹಾಮಂಡಲ|ಸರ್ಕಾರ|ನಿಗಮ|ಪ್ರತಿಷ್ಠಾನ|ಸಹಕಾರ|ಸಂಪಾದಕ ಮಂಡಳಿ|ಶಾಲೆ|ಮಠ|ಆಶ್ರಮ|Press|Trust|Ltd|Society|Publications?)/i
const TITLE_WOMAN=/^(ಶ್ರೀಮತಿ|ಕುಮಾರಿ|ಸೌ|ಸೌಭಾಗ್ಯವತಿ)$/
const TITLE_MAN=/^(ಶ್ರೀ|ಶ್ರೀಯುತ|ಶ್ರೀಯುತರು)$/
const TITLE_NEUTRAL=/^(ಡಾ|ಪ್ರೊ|ಪ್ರೊಫೆಸರ್|ಡಾಕ್ಟರ್|ಶ್ರೀ|ಶ್ರೀಮತಿ|ಕುಮಾರಿ|ಸೌ|ಶ್ರೀಯುತ|ಬಿ|ರಾವ್ಬಹದ್ದೂರ್)$/
const WOMAN_END=/(ಮ್ಮ|ಮ್ಮಾ|ಕ್ಕ|ಕ್ಕಾ|ದೇವಿ|ಬಾಯಿ|ಲತಾ|ಲತೆ|ವತಿ|ಮತಿ|ರಾಣಿ|ಕುಮಾರಿ|ಗೌರಿ|ಲಕ್ಷ್ಮೀ|ಲಕ್ಷ್ಮಿ|ಸರಸ್ವತಿ|ಪಾರ್ವತಿ|ಭಾರತಿ|ಜ್ಯೋತಿ|ಶೋಭಾ|ಸುಮಾ|ಸುಧಾ|ರೇಖಾ|ಮಾಲಾ|ಮಾಲಿನಿ|ಉಷಾ|ಆಶಾ|ಪ್ರಭಾ|ವಿದ್ಯಾ|ಸೀತಾ|ರಾಧಾ|ಶಾರದಾ|ಸಾವಿತ್ರಿ|ಇಂದಿರಾ|ಕಮಲಾ|ಕಮಲ|ವಿಮಲಾ|ವಿಮಲ|ಶಾಂತಾ|ಕಲ್ಪನಾ|ಸಂಧ್ಯಾ|ನಳಿನಿ|ಮಂಜುಳಾ|ಅನಸೂಯ|ಸುನಂದ|ಸುನಂದಾ|ಗಾಯತ್ರಿ|ಸುಮತಿ|ಅನ್ನಪೂರ್ಣ|ಯಶೋದ|ಯಶೋದಾ|ಜಯಂತಿ|ಪೂರ್ಣಿಮಾ|ವಸಂತಿ|ಸುಜಾತ|ಸುಜಾತಾ|ಪುಷ್ಪ|ಪುಷ್ಪಾ|ಹೇಮಾ|ತಾರಾ|ಮೀರಾ|ಲೀಲಾ|ಶ್ವೇತಾ|ಸುಮನ|ಶೈಲಜಾ|ಗೀತಾ|ಗೀತ|ಸುಶೀಲಾ|ಸುಶೀಲ|ಭಾರತೀ|ವಾಣಿ|ವಾಣೀ|ಪ್ರಿಯಾ|ರತ್ನಾ|ನಿರ್ಮಲಾ|ನಿರ್ಮಲ|ಸರೋಜಾ|ಸರೋಜ|ಸುಲೋಚನಾ|ಪದ್ಮಾ|ಪದ್ಮಾವತಿ|ಅರುಂಧತಿ|ಅಮೃತಾ|ವೀಣಾ|ವೀಣೆ|ರೂಪಾ)$/
const MAN_END=/(ರಾವ್|ರಾವ|ಯ್ಯ|ಯ್ಯಾ|ಪ್ಪ|ಪ್ಪಾ|ಸ್ವಾಮಿ|ಸ್ವಾಮಿಗಳು|ರಾಜ|ರಾಜು|ಕುಮಾರ್|ಕುಮಾರ|ನಾಥ|ಗೌಡ|ಗೌಡರು|ಭಟ್ಟ|ಭಟ್|ಆಚಾರ್ಯ|ಆಚಾರ್|ಶರ್ಮಾ|ಶರ್ಮ|ಹೆಗಡೆ|ನಾಯಕ|ನಾಯ್ಕ|ಪಂಡಿತ|ಅಯ್ಯರ್|ಮೂರ್ತಿ|ಶಂಕರ|ಕೃಷ್ಣ|ರಾಮ|ಶಿವ|ವಿಠ್ಠಲ|ಸಿಂಗ್|ಖಾನ್|ಸಾಬ್|ಸಾಹೇಬ್|ಸಾಹೇಬರು|ಪ್ರಭಾಕರ್|ಮಾಸ್ತರ್|ದಾಸ|ದಾಸರು|ನಂದ|ಚಂದ್ರ|ಇಂದ್ರ|ಲಿಂಗ|ಧರ|ಸಿಂಹ|ದೇವ|ಅಪ್ಪ|ಣ್ಣ|ಣ್ಣಾ|ಸೇನ್|ಬಾಬು|ಪ್ರಸಾದ್|ಪ್ರಸಾದ|ಶೆಟ್ಟಿ|ಪಾಟೀಲ|ಪಾಟೀಲ್|ದೇಸಾಯಿ|ಕುಲಕರ್ಣಿ|ಜೋಶಿ|ಜೋಷಿ|ರೆಡ್ಡಿ|ಶೇಖರ್|ಶೇಖರ|ಮೋಹನ್|ಮೋಹನ|ರಮೇಶ್|ಸುರೇಶ್|ಮಹೇಶ್|ನಾಗರಾಜ|ಬಸವರಾಜ|ವೆಂಕಟೇಶ್|ಉಮೇಶ್|ಗಣೇಶ್|ಗಣೇಶ|ದಿನೇಶ್|ಸತೀಶ್|ಸತೀಶ|ಹರೀಶ್|ಹರೀಶ|ಶಾಸ್ತ್ರಿ|ಕಾಮತ್|ಪ್ರಭು|ಗೋಪಾಲ|ಈಶ್ವರ|ಪಾಂಡೆ|ಗಿರಿ|ರಂಗ|ಕಂಠ|ಯ್ಯಂಗಾರ್|ಂಗಾರ್)$/
const MAN_START=/^(ವೆಂಕಟ|ಶ್ರೀನಿವಾಸ|ನಾರಾಯಣ|ಗಣೇಶ|ಮಹಾದೇವ|ಬಸವ|ಸಿದ್ದ|ಸಿದ್ಧ|ಹನುಮ|ರಂಗ|ಕೃಷ್ಣ|ರಾಮ|ಶಿವ|ಅನಂತ|ವಾಮನ|ಕೇಶವ|ಮಾಧವ|ಗೋಪಾಲ|ಸುಬ್ಬ|ತಿಮ್ಮ|ಮಲ್ಲ|ಈಶ್ವರ|ಹರಿ|ರವಿ|ಅರುಣ|ಅಶೋಕ|ವಿಜಯ|ಸಂತೋಷ|ಪ್ರಕಾಶ|ಸುರೇಶ|ರಮೇಶ|ಮಹೇಶ|ದಿನೇಶ|ಗಣಪತಿ|ಮೊಹಮ್ಮದ್|ಮಹಮ್ಮದ್|ಅಬ್ದುಲ್|ಶ್ರೀಕಂಠ|ವಿರೂಪಾಕ್ಷ)/
const person=name=>{
  const tokens=name.replace(/[.()]/g,' ').split(/\s+/).filter(Boolean)
  const title=tokens.find(token=>TITLE_WOMAN.test(token)||TITLE_MAN.test(token))
  const given=tokens.filter(token=>!TITLE_NEUTRAL.test(token)&&[...token].length>2)
  return {title,given}
}
export function inferGender(name){
  const text=String(name||'').trim()
  if(!text)return 'unknown'
  if(ORG.test(text))return 'organisation'
  const {title,given}=person(text)
  if(title&&TITLE_WOMAN.test(title))return 'woman'
  if(title&&TITLE_MAN.test(title))return 'man'
  if(!given.length)return 'unknown'
  if(WOMAN_END.test(given[0]))return 'woman'
  if(given.some(token=>MAN_END.test(token))||MAN_START.test(given[0]))return 'man'
  return 'unknown'
}
export const splitPeople=value=>String(value||'').split(SPLIT).map(part=>part.trim()).filter(part=>[...part].length>1)
const norm=name=>name.replace(/[.\s]+/g,' ').trim()
const decade=year=>Number.isFinite(year)?Math.floor(year/10)*10:null

// One entry per distinct person or organisation, with the periodicals they edited / published.
export function pressPeople(periodicals){
  const map=new Map()
  const add=(raw,role,item)=>{for(const part of splitPeople(raw)){const key=norm(part);if(!map.has(key))map.set(key,{name:key,gender:inferGender(key),editor:[],publisher:[]});map.get(key)[role].push(item)}}
  for(const item of periodicals){add(item.editor,'editor',item);add(item.publisher,'publisher',item)}
  return [...map.values()].map(entry=>({...entry,editorCount:entry.editor.length,publisherCount:entry.publisher.length,years:[...entry.editor,...entry.publisher].map(i=>i.date?.from).filter(Number.isFinite)}))
}
const blank=()=>({man:0,woman:0,unknown:0,organisation:0})
export function genderStats(periodicals){
  const people=pressPeople(periodicals)
  const out={editors:blank(),publishers:blank(),editorCredits:blank(),publisherCredits:blank(),byDecade:{}}
  for(const entry of people){
    if(entry.editor.length){out.editors[entry.gender]++;out.editorCredits[entry.gender]+=entry.editor.length}
    if(entry.publisher.length){out.publishers[entry.gender]++;out.publisherCredits[entry.gender]+=entry.publisher.length}
    for(const item of entry.editor){const d=decade(item.date?.from);if(d===null)continue;out.byDecade[d]??=blank();out.byDecade[d][entry.gender]++}
  }
  return out
}
// Map sites: group by publication place from the periodicals themselves so filters apply.
export function placeGroups(periodicals){
  const map=new Map()
  for(const item of periodicals){
    const c=item.location?.coordinates;if(!c)continue
    const key=c.join(',')
    if(!map.has(key))map.set(key,{key,coords:[c[1],c[0]],place:item.publicationPlace,items:[]})
    map.get(key).items.push(item)
  }
  return [...map.values()]
}
