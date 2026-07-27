import { heritageVerification } from './heritage-verification.js'
import { heritagePageVerification } from './heritage-page-verification.js'
import { heritageGeocodeVerification } from './heritage-geocode-verification.js'
import { heritageDirectVerification } from './heritage-direct-verification.js'
import { commonsPhotoLicenses, heritageEvidenceUpdates } from './heritage-evidence-updates.js'

const n=(en,kn)=>({en,kn})
const review={status:'needs-review',reviewer:null,updatedAt:'2026-07-26'}
const categories=['temple','coastal-temple','basadi','dargah','church','monastery','fort','palace-civic-architecture','colonial-architecture','archaeological-landscape','modern-heritage']
const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const uniqueByUrl=items=>[...new Map(items.map(item=>[item.url||item.sourceUrl||JSON.stringify(item),item])).values()]
const mergeVerification=(id,base)=>{
  const update=heritageEvidenceUpdates[id]||{}
  const license=commonsPhotoLicenses[id]
  const rawPhotos=update.photographs||base.photographs||[]
  const photographs=rawPhotos.map(photo=>license?.status==='verified-on-commons'?{...photo,url:photo.url,sourceUrl:license.canonicalUrl||photo.sourceUrl,licenseStatus:license.licenseShortName,licenseUrl:license.licenseUrl,credit:license.artist,attributionRequired:license.attributionRequired,licenseCheckedAt:license.checkedAt}:photo)
  const merged={...base,...update,externalIds:{...(base.externalIds||{}),...(update.externalIds||{})},coordinates:update.coordinates||base.coordinates,constructionPhases:update.constructionPhases||base.constructionPhases,protectionStatus:update.protectionStatus||base.protectionStatus,managingAuthorities:update.managingAuthorities||base.managingAuthorities,administrativeAreas:update.administrativeAreas||base.administrativeAreas,photographs,siteCitations:uniqueByUrl([...(base.siteCitations||[]),...(update.siteCitations||[])])}
  const licensed=photographs.length>0&&photographs.every(photo=>photo.licenseStatus&& !photo.licenseStatus.startsWith('verify-')&&!photo.licenseStatus.startsWith('pending-'))
  const generatedChecks={photoLicence:{status:photographs.length?licensed?'verified':'pending':'not-provided',checkedAt:licensed?'2026-07-26':null},protectionRegister:{status:merged.protectionStatus.length?'matched':'not-found-in-linked-registers',checkedAt:'2026-07-26'},managingAuthority:{status:merged.managingAuthorities.length?'identified':'unresolved',checkedAt:merged.managingAuthorities.length?'2026-07-26':null}}
  merged.verificationChecks={...generatedChecks,...(update.verificationChecks||{})}
  const fullyVerified=Boolean(merged.coordinates&&merged.siteCitations.length&&merged.verificationChecks.photoLicence.status==='verified'&&merged.verificationChecks.protectionRegister.status==='matched'&&merged.verificationChecks.managingAuthority.status==='identified')
  merged.verificationStatus=fullyVerified?'verified':merged.verificationStatus==='research-pending'?'identified':merged.verificationStatus
  merged.lastVerified='2026-07-26'
  return merged
}

export const deepChronologies=[
  {
    id:'chronology-bharatrajya-vedic-age',
    name:n('The Vedic Age — source chronology','ವೈದಿಕ ಯುಗ — ಆಕರ ಕಾಲಕ್ರಮ'),
    date:{from:1500,to:600,era:'BCE',precision:'range'},
    chronologyKind:'historiographic-periodization',
    geographicScope:n('Indian subcontinent; region-level browsing source, not a territorial claim for Karnataka','ಭಾರತೀಯ ಉಪಖಂಡ; ಪ್ರದೇಶಮಟ್ಟದ ವೀಕ್ಷಣಾ ಆಕರ, ಕರ್ನಾಟಕದ ಭೂಪ್ರದೇಶದ ಹಕ್ಕುಸ್ಥಾಪನೆ ಅಲ್ಲ'),
    evidenceBasis:'secondary-synthesis',
    confidence:'interpretive',
    description:n('BharatRajya follows Volume I of R. C. Majumdar’s History and Culture of the Indian People for this 1500–600 BCE band. It is retained as a separate attributed chronology because Vedic textual periods, archaeological phases, and traditional chronologies do not map onto one another exactly.','ಭಾರತರಾಜ್ಯವು ಕ್ರಿ.ಪೂ. 1500–600ರ ಈ ಅವಧಿಗೆ ಆರ್. ಸಿ. ಮಜುಂದಾರ್ ಅವರ History and Culture of the Indian People ಕೃತಿಯ ಮೊದಲ ಸಂಪುಟವನ್ನು ಅನುಸರಿಸುತ್ತದೆ. ವೈದಿಕ ಪಠ್ಯಕಾಲ, ಪುರಾತತ್ತ್ವ ಹಂತ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಕಾಲಕ್ರಮಗಳು ಒಂದಕ್ಕೊಂದು ನಿಖರವಾಗಿ ಹೊಂದುವುದಿಲ್ಲವಾದ್ದರಿಂದ ಇದನ್ನು ಪ್ರತ್ಯೇಕ, ಆಕರಸಹಿತ ಕಾಲಕ್ರಮವಾಗಿ ಉಳಿಸಲಾಗಿದೆ.'),
    citations:[
      {sourceId:'src-bharatrajya-methodology',locator:'Historical eras table: The Vedic Age, 1500 BCE–600 BCE, region detail, Vol. 1'},
      {sourceId:'src-majumdar-vedic-age',locator:'Volume I periodization; consult individual chapters before creating event or territory records'},
      {sourceId:'src-vedic-heritage-portal',locator:'Textual and oral Vedic heritage discovery portal; not a territorial chronology'}
    ],
    review:{...review}
  }
]

const districtSeeds=[
  ['Bagalkote','ಬಾಗಲಕೋಟೆ','north',['Pattadakal temples|ಪಟ್ಟದಕಲ್ಲಿನ ದೇವಾಲಯಗಳು|fort','Badami fort precinct|ಬಾದಾಮಿ ಕೋಟೆ ಪರಿಸರ|fort']],
  ['Ballari','ಬಳ್ಳಾರಿ','central',['Ballari Fort|ಬಳ್ಳಾರಿ ಕೋಟೆ|fort','Allipura colonial prison|ಅಲ್ಲಿಪುರ ವಸಾಹತು ಕಾಲದ ಕಾರಾಗೃಹ|colonial-architecture']],
  ['Belagavi','ಬೆಳಗಾವಿ','north',['Belagavi Fort|ಬೆಳಗಾವಿ ಕೋಟೆ|fort','Kamal Basadi|ಕಮಲ ಬಸದಿ|basadi']],
  ['Bengaluru Rural','ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ','south',['Devanahalli Fort|ದೇವನಹಳ್ಳಿ ಕೋಟೆ|fort','Ghati heritage landscape|ಘಾಟಿ ಪರಂಪರೆ ಭೂದೃಶ್ಯ|modern-heritage']],
  ['Bengaluru Urban','ಬೆಂಗಳೂರು ನಗರ','south',['St Mary’s Basilica|ಸೇಂಟ್ ಮೇರಿಸ್ ಬೆಸಿಲಿಕಾ|church','Attara Kacheri|ಅಠಾರ ಕಚೇರಿ|colonial-architecture','Vidhana Soudha|ವಿಧಾನಸೌಧ|modern-heritage']],
  ['Bidar','ಬೀದರ್','north',['Bidar Fort|ಬೀದರ್ ಕೋಟೆ|fort','Gurudwara Nanak Jhira precinct|ಗುರುದ್ವಾರ ನಾನಕ್ ಝೀರಾ ಪರಿಸರ|modern-heritage']],
  ['Chamarajanagar','ಚಾಮರಾಜನಗರ','south',['Biligiriranga temple landscape|ಬಿಳಿಗಿರಿರಂಗ ದೇವಾಲಯ ಭೂದೃಶ್ಯ|temple','Chamarajeshwara Temple|ಚಾಮರಾಜೇಶ್ವರ ದೇವಾಲಯ|temple']],
  ['Chikkaballapur','ಚಿಕ್ಕಬಳ್ಳಾಪುರ','south',['Nandi hill fort|ನಂದಿಬೆಟ್ಟ ಕೋಟೆ|fort','Bhoga Nandeeshwara Temple|ಭೋಗ ನಂದೀಶ್ವರ ದೇವಾಲಯ|temple']],
  ['Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು','malenadu',['Sringeri Sharada Peetha|ಶೃಂಗೇರಿ ಶಾರದಾ ಪೀಠ|monastery','Ballalarayana Durga|ಬಲ್ಲಾಳರಾಯನ ದುರ್ಗ|fort']],
  ['Chitradurga','ಚಿತ್ರದುರ್ಗ','central',['Chitradurga Fort|ಚಿತ್ರದುರ್ಗ ಕೋಟೆ|fort','Chandravalli heritage landscape|ಚಂದ್ರವಳ್ಳಿ ಪರಂಪರೆ ಭೂದೃಶ್ಯ|archaeological-landscape']],
  ['Dakshina Kannada','ದಕ್ಷಿಣ ಕನ್ನಡ','coast',['Mangaladevi Temple|ಮಂಗಳಾದೇವಿ ದೇವಾಲಯ|coastal-temple','Saavira Kambada Basadi|ಸಾವಿರ ಕಂಬದ ಬಸದಿ|basadi','St Aloysius Chapel|ಸೇಂಟ್ ಅಲೋಶಿಯಸ್ ಚಾಪೆಲ್|church']],
  ['Davanagere','ದಾವಣಗೆರೆ','central',['Harihareshwara Temple precinct|ಹರಿಹರೇಶ್ವರ ದೇವಾಲಯ ಪರಿಸರ|temple','Santhebennur pushkarni|ಸಂತೆಬೆನ್ನೂರು ಪುಷ್ಕರಣಿ|palace-civic-architecture']],
  ['Dharwad','ಧಾರವಾಡ','north',['Karnatak College heritage campus|ಕರ್ನಾಟಕ ಕಾಲೇಜು ಪರಂಪರೆ ಆವರಣ|colonial-architecture','Dharwad Fort remains|ಧಾರವಾಡ ಕೋಟೆ ಅವಶೇಷಗಳು|fort']],
  ['Gadag','ಗದಗ','north',['Lakkundi temple and basadi landscape|ಲಕ್ಕುಂಡಿ ದೇವಾಲಯ ಮತ್ತು ಬಸದಿ ಭೂದೃಶ್ಯ|basadi','Nargund Fort|ನರಗುಂದ ಕೋಟೆ|fort']],
  ['Hassan','ಹಾಸನ','malenadu',['Shettihalli Rosary Church|ಶೆಟ್ಟಿಹಳ್ಳಿ ರೋಸರಿ ಚರ್ಚ್|church','Manjarabad Fort|ಮಂಜರಾಬಾದ್ ಕೋಟೆ|fort']],
  ['Haveri','ಹಾವೇರಿ','north',['Bankapura Fort|ಬಂಕಾಪುರ ಕೋಟೆ|fort','Galageshwara temple landscape|ಗಳಗೇಶ್ವರ ದೇವಾಲಯ ಭೂದೃಶ್ಯ|temple']],
  ['Kalaburagi','ಕಲಬುರಗಿ','north',['Khwaja Bande Nawaz Dargah|ಖ್ವಾಜಾ ಬಂದೆ ನವಾಜ್ ದರ್ಗಾ|dargah','Malkhed Fort and basadi|ಮಳಖೇಡ ಕೋಟೆ ಮತ್ತು ಬಸದಿ|fort']],
  ['Kodagu','ಕೊಡಗು','malenadu',['Namdroling Monastery|ನಾಮ್‌ದ್ರೋಲಿಂಗ್ ಮಠ|monastery','Madikeri Fort|ಮಡಿಕೇರಿ ಕೋಟೆ|fort']],
  ['Kolar','ಕೋಲಾರ','south',['Avani temple landscape|ಅವನಿ ದೇವಾಲಯ ಭೂದೃಶ್ಯ|temple','Kolaramma Temple|ಕೋಲಾರಮ್ಮ ದೇವಾಲಯ|temple']],
  ['Koppal','ಕೊಪ್ಪಳ','central',['Anegundi fort landscape|ಆನೆಗುಂದಿ ಕೋಟೆ ಭೂದೃಶ್ಯ|fort','Itagi Mahadeva Temple|ಇಟಗಿ ಮಹಾದೇವ ದೇವಾಲಯ|temple']],
  ['Mandya','ಮಂಡ್ಯ','south',['Srirangapatna Fort|ಶ್ರೀರಂಗಪಟ್ಟಣ ಕೋಟೆ|fort','Colonel Bailey’s Dungeon|ಕರ್ನಲ್ ಬೇಲಿ ಸೆರೆಮನೆ|colonial-architecture']],
  ['Mysuru','ಮೈಸೂರು','south',['St Philomena’s Cathedral|ಸೇಂಟ್ ಫಿಲೋಮಿನಾ ಕ್ಯಾಥೆಡ್ರಲ್|church','Mysore Palace|ಮೈಸೂರು ಅರಮನೆ|palace-civic-architecture']],
  ['Raichur','ರಾಯಚೂರು','north',['Raichur Fort|ರಾಯಚೂರು ಕೋಟೆ|fort','Mudgal Fort|ಮುದಗಲ್ ಕೋಟೆ|fort']],
  ['Ramanagara','ರಾಮನಗರ','south',['Magadi Fort remains|ಮಾಗಡಿ ಕೋಟೆ ಅವಶೇಷಗಳು|fort','Janapada Loka|ಜಾನಪದ ಲೋಕ|modern-heritage']],
  ['Shivamogga','ಶಿವಮೊಗ್ಗ','malenadu',['Kavaledurga Fort|ಕವಲೇದುರ್ಗ ಕೋಟೆ|fort','Keladi heritage precinct|ಕೆಳದಿ ಪರಂಪರೆ ಪರಿಸರ|palace-civic-architecture']],
  ['Tumakuru','ತುಮಕೂರು','south',['Madhugiri Fort|ಮಧುಗಿರಿ ಕೋಟೆ|fort','Siddaganga Matha|ಸಿದ್ಧಗಂಗಾ ಮಠ|monastery']],
  ['Udupi','ಉಡುಪಿ','coast',['Udupi Krishna Matha|ಉಡುಪಿ ಕೃಷ್ಣ ಮಠ|coastal-temple','Karkala Chaturmukha Basadi|ಕಾರ್ಕಳ ಚತುರ್ಮುಖ ಬಸದಿ|basadi','Barkur fort and church landscape|ಬಾರ್ಕೂರು ಕೋಟೆ ಮತ್ತು ಚರ್ಚ್ ಭೂದೃಶ್ಯ|church']],
  ['Uttara Kannada','ಉತ್ತರ ಕನ್ನಡ','coast',['Gokarna temple landscape|ಗೋಕರ್ಣ ದೇವಾಲಯ ಭೂದೃಶ್ಯ|coastal-temple','Mirjan Fort|ಮಿರ್ಜಾನ್ ಕೋಟೆ|fort','Mundgod Tibetan monasteries|ಮುಂಡಗೋಡ ಟಿಬೆಟಿಯನ್ ಮಠಗಳು|monastery']],
  ['Vijayapura','ವಿಜಯಪುರ','north',['Gol Gumbaz precinct|ಗೋಳಗುಮ್ಮಟ ಪರಿಸರ|palace-civic-architecture','Ibrahim Rauza|ಇಬ್ರಾಹಿಂ ರೌಜಾ|palace-civic-architecture','Vijayapura Fort walls|ವಿಜಯಪುರ ಕೋಟೆ ಗೋಡೆಗಳು|fort']],
  ['Vijayanagara','ವಿಜಯನಗರ','central',['Hampi fortified landscape|ಹಂಪಿಯ ಕೋಟೆಬದ್ಧ ಭೂದೃಶ್ಯ|fort','Lotus Mahal and royal centre|ಕಮಲ ಮಹಲ್ ಮತ್ತು ರಾಜಕೇಂದ್ರ|palace-civic-architecture']],
  ['Yadgir','ಯಾದಗಿರಿ','north',['Yadgir Fort|ಯಾದಗಿರಿ ಕೋಟೆ|fort','Sufi Sarmast Dargah, Sagar|ಸೂಫಿ ಸರಮಸ್ತ ದರ್ಗಾ, ಸಾಗರ|dargah']]
]

export const heritageAuditCategories=categories

export const heritageAudits=districtSeeds.map(([districtEn,districtKn,region,siteRows])=>{
  const prioritySites=siteRows.map((row,index)=>{const [en,kn,category]=row.split('|');const id=`candidate-${slug(districtEn)}-${index+1}`;const base=heritageVerification[id]||heritagePageVerification[id]||heritageGeocodeVerification[id]||heritageDirectVerification[id]||{verificationStatus:'research-pending',externalIds:{},coordinates:null,constructionPhases:[],protectionStatus:[],managingAuthorities:[],administrativeAreas:[],photographs:[],siteCitations:[],verificationNote:n('Candidate is inventoried; monument-level identity and evidence fields remain to be resolved.','ಅಭ್ಯರ್ಥಿಯ ಪಟ್ಟಿ ಸಿದ್ಧವಾಗಿದೆ; ಸ್ಮಾರಕಮಟ್ಟದ ಗುರುತು ಮತ್ತು ಸಾಕ್ಷ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಇನ್ನೂ ಹೊಂದಿಸಬೇಕಾಗಿದೆ.'),lastVerified:null};const verification=mergeVerification(id,base);return {id,name:n(en,kn),category,status:verification.verificationStatus,verification}})
  const seeded=new Set(prioritySites.map(site=>site.category))
  return {
    id:`audit-${slug(districtEn)}`,
    name:n(`${districtEn} district heritage audit`,`${districtKn} ಜಿಲ್ಲಾ ಪರಂಪರೆ ಪರಿಶೀಲನೆ`),
    district:n(districtEn,districtKn),
    region,
    auditStatus:'seeded',
    categoryCoverage:Object.fromEntries(categories.map(category=>[category,seeded.has(category)?'seeded':'unassessed'])),
    prioritySites,
    methodologyNote:n('Candidate-led first pass. “Unassessed” means research is pending; it does not mean the category is absent from the district.','ಅಭ್ಯರ್ಥಿ-ಆಧಾರಿತ ಮೊದಲ ಹಂತ. “ಪರಿಶೀಲಿಸಿಲ್ಲ” ಎಂದರೆ ಸಂಶೋಧನೆ ಬಾಕಿಯಿದೆ; ಆ ವರ್ಗ ಜಿಲ್ಲೆಯಲ್ಲಿ ಇಲ್ಲ ಎಂಬ ಅರ್ಥವಲ್ಲ.'),
    citations:[{sourceId:'src-karnataka-tourism-heritage',locator:'Statewide heritage discovery index; verify every candidate with district gazetteers, protection lists, field records, and community sources'}],
    review:{...review}
  }
})
