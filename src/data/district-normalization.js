const normalize=value=>String(value||'').normalize('NFKD').toLowerCase().replace(/\b(?:district|distt?|zilla|jille)\b/g,'').replace(/[^a-z0-9\u0c80-\u0cff]+/g,' ').trim()

const aliases={
  'audit-bagalkote':['Bagalkote','Bagalkot','Bagalakot','ಬಾಗಲಕೋಟೆ'],
  'audit-ballari':['Ballari','Bellary','ಬಳ್ಳಾರಿ'],
  'audit-belagavi':['Belagavi','Belgaum','ಬೆಳಗಾವಿ'],
  'audit-bengaluru-rural':['Bengaluru Rural','Bangalore Rural','ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ'],
  'audit-bengaluru-urban':['Bengaluru Urban','Bangalore Urban','Bengaluru','Bangalore','ಬೆಂಗಳೂರು ನಗರ','ಬೆಂಗಳೂರು'],
  'audit-bidar':['Bidar','ಬೀದರ್'],
  'audit-chamarajanagar':['Chamarajanagar','Chamarajanagara','ಚಾಮರಾಜನಗರ'],
  'audit-chikkaballapur':['Chikkaballapur','Chikballapur','ಚಿಕ್ಕಬಳ್ಳಾಪುರ'],
  'audit-chikkamagaluru':['Chikkamagaluru','Chikmagalur','Chikkamagalur','ಚಿಕ್ಕಮಗಳೂರು'],
  'audit-chitradurga':['Chitradurga','ಚಿತ್ರದುರ್ಗ'],
  'audit-dakshina-kannada':['Dakshina Kannada','South Kanara','Mangalore','Mangaluru','ದಕ್ಷಿಣ ಕನ್ನಡ','ಮಂಗಳೂರು'],
  'audit-davanagere':['Davanagere','Davangere','ದಾವಣಗೆರೆ'],
  'audit-dharwad':['Dharwad','Dharwar','ಧಾರವಾಡ'],
  'audit-gadag':['Gadag','ಗದಗ'],
  'audit-hassan':['Hassan','Hasan','ಹಾಸನ'],
  'audit-haveri':['Haveri','ಹಾವೇರಿ'],
  'audit-kalaburagi':['Kalaburagi','Gulbarga','ಕಲಬುರಗಿ'],
  'audit-kodagu':['Kodagu','Coorg','ಕೊಡಗು'],
  'audit-kolar':['Kolar','ಕೋಲಾರ'],
  'audit-koppal':['Koppal','Kopal','ಕೊಪ್ಪಳ'],
  'audit-mandya':['Mandya','ಮಂಡ್ಯ'],
  'audit-mysuru':['Mysuru','Mysore','ಮೈಸೂರು'],
  'audit-raichur':['Raichur','ರಾಯಚೂರು'],
  'audit-ramanagara':['Ramanagara','Ramanagaram','ರಾಮನಗರ'],
  'audit-shivamogga':['Shivamogga','Shimoga','ಶಿವಮೊಗ್ಗ'],
  'audit-tumakuru':['Tumakuru','Tumkur','ತುಮಕೂರು'],
  'audit-udupi':['Udupi','ಉಡುಪಿ'],
  'audit-uttara-kannada':['Uttara Kannada','North Kanara','Karwar','ಉತ್ತರ ಕನ್ನಡ','ಕಾರವಾರ'],
  'audit-vijayapura':['Vijayapura','Bijapur','ವಿಜಯಪುರ','ಬಿಜಾಪುರ'],
  'audit-vijayanagara':['Vijayanagara','Vijaynagar','ವಿಜಯನಗರ'],
  'audit-yadgir':['Yadgir','Yadgiri','ಯಾದಗಿರಿ'],
}

const aliasToId=new Map(Object.entries(aliases).flatMap(([id,values])=>values.map(value=>[normalize(value),id])))
const canonicalNames=new Map(Object.entries(aliases).map(([id,values])=>[id,{en:values.find(value=>/^[\x00-\x7F]+$/.test(value))||values[0],kn:values.find(value=>/[\u0c80-\u0cff]/.test(value))||''}]))

export const canonicalDistrictId=value=>aliasToId.get(normalize(value))||null

export function canonicalDistrictAssociation(value,{districtById,locale='kn'}={}){
  const districtId=canonicalDistrictId(value)
  if(!districtId)return {districtId:`dictionary-lead-${normalize(value).replaceAll(' ','-')}`,kind:'dictionary-text-lead',name:String(value),sourceLabel:String(value),canonical:false}
  const feature=districtById?.get(districtId)
  const bilingual=feature?.properties?.districtName||canonicalNames.get(districtId)
  return {
    districtId,
    kind:'dictionary-text-lead',
    name:bilingual?.[locale]||bilingual?.en||String(value),
    sourceLabel:String(value),
    canonical:true,
  }
}

export const canonicalDistrictAliases=aliases
