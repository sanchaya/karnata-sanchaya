import { heritageVerification } from './heritage-verification.js'
import { heritagePageVerification } from './heritage-page-verification.js'
import { heritageGeocodeVerification } from './heritage-geocode-verification.js'
import { heritageDirectVerification } from './heritage-direct-verification.js'
import { commonsPhotoLicenses, heritageEvidenceUpdates } from './heritage-evidence-updates.js'
import { heritageEvidencePassUpdates } from './heritage-evidence-pass.js'
import { heritageAuthorityAdditions } from './heritage-authority-additions.js'

const n=(en,kn)=>({en,kn})
const review={status:'needs-review',reviewer:null,updatedAt:'2026-07-26'}
const categories=['temple','coastal-temple','basadi','dargah','church','monastery','fort','palace-civic-architecture','colonial-architecture','archaeological-landscape','modern-heritage']
const slug=value=>value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const uniqueByUrl=items=>[...new Map(items.map(item=>[item.url||item.sourceUrl||JSON.stringify(item),item])).values()]
const mergeVerification=(id,base)=>{
  const update={...(heritageEvidenceUpdates[id]||{}),...(heritageEvidencePassUpdates[id]||{})}
  const license=commonsPhotoLicenses[id]
  const rawPhotos=update.photographs||base.photographs||[]
  const photographs=rawPhotos.map(photo=>license?.status==='verified-on-commons'?{...photo,url:photo.url,sourceUrl:license.canonicalUrl||photo.sourceUrl,licenseStatus:license.licenseShortName,licenseUrl:license.licenseUrl,credit:`${license.artist}${photo.capturedAt?` · ${photo.capturedAt}`:''}`,attributionRequired:license.attributionRequired,licenseCheckedAt:license.checkedAt}:photo)
  const merged={...base,...update,externalIds:{...(base.externalIds||{}),...(update.externalIds||{})},coordinates:update.coordinates||base.coordinates,constructionPhases:update.constructionPhases||base.constructionPhases,protectionStatus:update.protectionStatus||base.protectionStatus,managingAuthorities:update.managingAuthorities||base.managingAuthorities,administrativeAreas:update.administrativeAreas||base.administrativeAreas,photographs,siteCitations:uniqueByUrl([...(base.siteCitations||[]),...(update.siteCitations||[])])}
  const licensed=photographs.length>0&&photographs.every(photo=>photo.licenseStatus&& !photo.licenseStatus.startsWith('verify-')&&!photo.licenseStatus.startsWith('pending-'))
  const generatedChecks={photoLicence:{status:photographs.length?licensed?'verified':'pending':'not-provided',checkedAt:licensed?'2026-07-26':null},protectionRegister:{status:merged.protectionStatus.length?'matched':'not-found-in-linked-registers',checkedAt:'2026-07-26'},managingAuthority:{status:merged.managingAuthorities.length?'identified':'unresolved',checkedAt:merged.managingAuthorities.length?'2026-07-26':null},currentCondition:{status:merged.presentConditionEvidence?(merged.presentConditionEvidence.status==='authority-confirmed'?'verified':'pending'):'not-provided',checkedAt:merged.presentConditionEvidence?.observedAt||null}}
  merged.verificationChecks={...generatedChecks,...(update.verificationChecks||{})}
  const conditionReady=merged.presentConditionEvidence?.status==='authority-confirmed'
  const fullyVerified=Boolean(conditionReady&&merged.coordinates&&merged.siteCitations.length&&merged.verificationChecks.photoLicence.status==='verified'&&merged.verificationChecks.protectionRegister.status==='matched'&&merged.verificationChecks.managingAuthority.status==='identified')
  const incompleteStatus=merged.verificationStatus==='research-pending'
    ?'identified'
    :merged.verificationStatus==='verified'
      ?'partially-verified'
      :merged.verificationStatus
  merged.verificationStatus=fullyVerified?'verified':incompleteStatus
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
    description:n('This 1500–600 BCE band follows Volume I of R. C. Majumdar’s History and Culture of the Indian People. It is retained as a separate attributed chronology because Vedic textual periods, archaeological phases, and traditional chronologies do not map onto one another exactly.','ಈ ಕ್ರಿ.ಪೂ. 1500–600ರ ಅವಧಿಯು ಆರ್. ಸಿ. ಮಜುಂದಾರ್ ಅವರ History and Culture of the Indian People ಕೃತಿಯ ಮೊದಲ ಸಂಪುಟವನ್ನು ಅನುಸರಿಸುತ್ತದೆ. ವೈದಿಕ ಪಠ್ಯಕಾಲ, ಪುರಾತತ್ತ್ವ ಹಂತ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಕಾಲಕ್ರಮಗಳು ಒಂದಕ್ಕೊಂದು ನಿಖರವಾಗಿ ಹೊಂದುವುದಿಲ್ಲವಾದ್ದರಿಂದ ಇದನ್ನು ಪ್ರತ್ಯೇಕ, ಆಕರಸಹಿತ ಕಾಲಕ್ರಮವಾಗಿ ಉಳಿಸಲಾಗಿದೆ.'),
    citations:[
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

// District deep-history intake is deliberately separate from the authority-
// verified heritage audit. It provides a stable place for locality origins,
// prehistoric landscapes and foundation-stone leads without presenting an
// indicative claim as established history. Every starter record is therefore
// review-gated and carries an explicit evidence basis.
export const districtHistoryCategories=['prehistoric-landscape','settlement-origin','urban-foundation','foundation-stone','regional-memory','district-scope']

const historyScopeNote=n(
  'Scope placeholder: collect prehistoric sites, settlement histories, foundation stones, locality names and district gazetteer evidence here. No historical claim is made until a researcher adds item-level sources.',
  'ವ್ಯಾಪ್ತಿ ಸೂಚಕ: ಪೂರ್ವೈತಿಹಾಸಿಕ ತಾಣಗಳು, ವಸತಿ ಇತಿಹಾಸ, ಸ್ಥಾಪನಾ ಶಿಲೆಗಳು, ಸ್ಥಳನಾಮ ಇತಿಹಾಸ ಮತ್ತು ಜಿಲ್ಲಾ ಗೆಜೆಟಿಯರ್ ಸಾಕ್ಷ್ಯವನ್ನು ಇಲ್ಲಿ ಸಂಗ್ರಹಿಸಬೇಕು. ವಸ್ತುಮಟ್ಟದ ಆಕರ ಸೇರುವವರೆಗೆ ಯಾವುದೇ ಐತಿಹಾಸಿಕ ಹಕ್ಕುಸ್ಥಾಪನೆ ಇಲ್ಲ.'
)

const districtHistoryScopes=districtSeeds.map(([districtEn,districtKn,region])=>({
  id:`district-history-scope-${slug(districtEn)}`,
  name:n(`${districtEn} deep-history research scope`,`${districtKn} ಸಮಗ್ರ ಇತಿಹಾಸ ಸಂಶೋಧನಾ ವ್ಯಾಪ್ತಿ`),
  recordKind:'district-scope',
  districtId:`audit-${slug(districtEn)}`,
  district:n(districtEn,districtKn),
  region,
  category:'district-scope',
  date:{from:null,to:null,era:'CE',precision:'unknown'},
  location:null,
  description:historyScopeNote,
  researchNote:historyScopeNote,
  evidenceBasis:'research-intake',
  review:{...review},
  citations:[]
}))

const districtHistoryCandidates=[
  {
    id:'district-history-bengaluru-pete-foundation',recordKind:'candidate',districtId:'audit-bengaluru-urban',district:n('Bengaluru Urban','ಬೆಂಗಳೂರು ನಗರ'),
    name:n('Bengaluru Pete / Kempegowda fort-town foundation lead','ಬೆಂಗಳೂರು ಪೇಟೆ / ಕೆಂಪೇಗೌಡ ಕೋಟೆ-ಪಟ್ಟಣದ ಸ್ಥಾಪನಾ ಸುಳಿವು'),category:'urban-foundation',
    date:{from:1537,to:1537,era:'CE',precision:'year'},location:{type:'Point',coordinates:[77.5946,12.9716],precision:'approximate'},
    description:n('A discovery lead for the commonly cited 1537 foundation of the Pete and fort-town. The date, extent and surviving material evidence require item-level verification before publication as a foundation record.','ಪೇಟೆ ಮತ್ತು ಕೋಟೆ-ಪಟ್ಟಣದ ಸಾಮಾನ್ಯವಾಗಿ ಉಲ್ಲೇಖಿಸುವ 1537ರ ಸ್ಥಾಪನೆಗೆ ಸಂಬಂಧಿಸಿದ ಅನ್ವೇಷಣಾ ಸುಳಿವು. ಸ್ಥಾಪನಾ ದಾಖಲೆಯಾಗಿ ಪ್ರಕಟಿಸುವ ಮೊದಲು ದಿನಾಂಕ, ವ್ಯಾಪ್ತಿ ಮತ್ತು ಉಳಿದಿರುವ ಭೌತಿಕ ಸಾಕ್ಷ್ಯಕ್ಕೆ ವಸ್ತುಮಟ್ಟದ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'),
    researchNote:n('Starter lead derived from the project-supplied Bengaluru locality-age infographic; treat as indicative, not an authority-confirmed date.','ಯೋಜನೆಗೆ ಒದಗಿಸಿದ ಬೆಂಗಳೂರು ಸ್ಥಳೀಯ ವಯಸ್ಸಿನ ಇನ್ಫೋಗ್ರಾಫಿಕ್‌ನಿಂದ ಪಡೆದ ಆರಂಭಿಕ ಸುಳಿವು; ಇದನ್ನು ಸೂಚಕವೆಂದು ಮಾತ್ರ ಪರಿಗಣಿಸಿ, ಅಧಿಕಾರ-ದೃಢೀಕೃತ ದಿನಾಂಕವೆಂದು ಪರಿಗಣಿಸಬೇಡಿ.'),
    evidenceBasis:'contributor-discovery-lead',citations:[{sourceId:'src-user-infographic-bengaluru-age',locator:'Bengaluru in Numbers (2026) infographic; claim requires primary and archival verification'}],review:{...review}
  },
  {
    id:'district-history-yelahanka-pre-1537',recordKind:'candidate',districtId:'audit-bengaluru-urban',district:n('Bengaluru Urban','ಬೆಂಗಳೂರು ನಗರ'),
    name:n('Yelahanka pre-1537 settlement lead','ಯಲಹಂಕ ಪೂರ್ವ-1537 ವಸತಿ ಸುಳಿವು'),category:'settlement-origin',
    date:{from:1536,to:1536,era:'CE',precision:'circa'},location:{type:'Point',coordinates:[77.5963,13.1007],precision:'approximate'},
    description:n('A locality-history lead for an earlier settlement horizon around Yelahanka. The “pre-1537” label is retained as a research question rather than a verified founding date.','ಯಲಹಂಕ ಸುತ್ತಲಿನ ಹಿಂದಿನ ವಸತಿ ಹಂತಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಸ್ಥಳೀಯ ಇತಿಹಾಸದ ಸುಳಿವು. “ಪೂರ್ವ-1537” ಎಂಬ ಗುರುತನ್ನು ಪರಿಶೀಲನಾ ಪ್ರಶ್ನೆಯಾಗಿ ಮಾತ್ರ ಉಳಿಸಲಾಗಿದೆ; ದೃಢೀಕೃತ ಸ್ಥಾಪನಾ ದಿನಾಂಕವಲ್ಲ.'),
    researchNote:n('Compare district gazetteers, inscriptions, revenue records and archaeological reports before assigning a date or continuity claim.','ದಿನಾಂಕ ಅಥವಾ ನಿರಂತರತೆಯ ಹಕ್ಕು ನೀಡುವ ಮೊದಲು ಜಿಲ್ಲಾ ಗೆಜೆಟಿಯರ್, ಶಾಸನ, ಆದಾಯ ದಾಖಲೆ ಮತ್ತು ಪುರಾತತ್ತ್ವ ವರದಿಗಳನ್ನು ಹೋಲಿಸಿ ಪರಿಶೀಲಿಸಬೇಕು.'),
    evidenceBasis:'contributor-discovery-lead',citations:[{sourceId:'src-user-infographic-bengaluru-age',locator:'Yelahanka marked “pre-1537”; discovery lead only'}],review:{...review}
  },
  {
    id:'district-history-hoskote-seventeenth-century',recordKind:'candidate',districtId:'audit-bengaluru-urban',district:n('Bengaluru Urban','ಬೆಂಗಳೂರು ನಗರ'),
    name:n('Hoskote seventeenth-century locality lead','ಹೊಸಕೋಟೆ ಹದಿನೇಳನೇ ಶತಮಾನದ ಸ್ಥಳೀಯ ಇತಿಹಾಸದ ಸುಳಿವು'),category:'settlement-origin',
    date:{from:1600,to:1699,era:'CE',precision:'century'},location:{type:'Point',coordinates:[77.7728,13.0707],precision:'approximate'},
    description:n('A research lead for Hoskote’s early-modern locality history. The century band is an intake estimate and should be replaced with a dated record or left undated after review.','ಹೊಸಕೋಟೆಯ ಆಧುನಿಕ-ಪೂರ್ವ ಸ್ಥಳೀಯ ಇತಿಹಾಸಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಸಂಶೋಧನಾ ಸುಳಿವು. ಶತಮಾನ ವ್ಯಾಪ್ತಿ ಸ್ವೀಕೃತಿ ಅಂದಾಜು ಮಾತ್ರ; ಪರಿಶೀಲನೆಯ ನಂತರ ದಿನಾಂಕಿತ ದಾಖಲೆಗಳಿಂದ ಬದಲಿಸಬೇಕು ಅಥವಾ ದಿನಾಂಕವಿಲ್ಲದೆ ಉಳಿಸಬೇಕು.'),
    researchNote:n('Locate district gazetteer entries, fort or temple records, inscriptions and early colonial surveys.','ಜಿಲ್ಲಾ ಗೆಜೆಟಿಯರ್ ದಾಖಲಾತಿ, ಕೋಟೆ ಅಥವಾ ದೇವಾಲಯ ದಾಖಲೆ, ಶಾಸನ ಮತ್ತು ಆರಂಭಿಕ ವಸಾಹತು ಸಮೀಕ್ಷೆಗಳನ್ನು ಹುಡುಕಿ.'),
    evidenceBasis:'contributor-discovery-lead',citations:[{sourceId:'src-user-infographic-bengaluru-age',locator:'Hoskote marked as seventeenth century; discovery lead only'}],review:{...review}
  },
  {
    id:'district-history-kolar-prehistoric-landscape',recordKind:'candidate',districtId:'audit-kolar',district:n('Kolar','ಕೋಲಾರ'),
    name:n('Kolar prehistoric-landscape research lead','ಕೋಲಾರ ಪೂರ್ವೈತಿಹಾಸಿಕ ಭೂದೃಶ್ಯ ಸಂಶೋಧನಾ ಸುಳಿವು'),category:'prehistoric-landscape',
    date:{from:null,to:null,era:'BCE',precision:'unknown'},location:{type:'Point',coordinates:[78.1294,13.1358],precision:'district-centroid'},
    description:n('A district-level intake record for prehistoric places and early settlement evidence. It intentionally carries no date or site attribution until archaeological and gazetteer sources are reconciled.','ಪೂರ್ವೈತಿಹಾಸಿಕ ತಾಣಗಳು ಮತ್ತು ಆರಂಭಿಕ ವಸತಿ ಸಾಕ್ಷ್ಯಕ್ಕಾಗಿ ಜಿಲ್ಲಾ ಮಟ್ಟದ ಸ್ವೀಕೃತಿ ದಾಖಲೆ. ಪುರಾತತ್ತ್ವ ಮತ್ತು ಗೆಜೆಟಿಯರ್ ಆಕರಗಳನ್ನು ಹೊಂದಿಸುವವರೆಗೆ ಇದರಲ್ಲಿ ದಿನಾಂಕ ಅಥವಾ ನಿರ್ದಿಷ್ಟ ತಾಣದ ಹಕ್ಕು ಇಲ್ಲ.'),
    researchNote:n('Add site-level candidates only with an archaeological report, protected-site register, excavation record or published district study.','ಪುರಾತತ್ತ್ವ ವರದಿ, ಸಂರಕ್ಷಿತ ತಾಣ ನೋಂದಣಿ, ಉತ್ಖನನ ದಾಖಲೆ ಅಥವಾ ಪ್ರಕಟಿತ ಜಿಲ್ಲಾ ಅಧ್ಯಯನವಿದ್ದಾಗ ಮಾತ್ರ ತಾಣಮಟ್ಟದ ಅಭ್ಯರ್ಥಿಗಳನ್ನು ಸೇರಿಸಿ.'),
    evidenceBasis:'district-research-scope',citations:[{sourceId:'src-gazetteer-karnataka-1983',locator:'Kolar district chapter: identify and verify prehistoric and early-settlement references'}],review:{...review}
  },
  {
    id:'district-history-kolar-kuvalala-western-ganga-capital',recordKind:'candidate',districtId:'audit-kolar',district:n('Kolar','ಕೋಲಾರ'),
    name:n('Kolar (Kuvalala/Kolahalapura) as the founding Western Ganga capital','ಕೋಲಾರ (ಕುವಲಾಲ/ಕೋಲಾಹಲಪುರ) ಪಶ್ಚಿಮ ಗಂಗ ಸ್ಥಾಪಕ ರಾಜಧಾನಿ'),category:'urban-foundation',
    date:{from:350,to:370,era:'CE',precision:'circa'},location:{type:'Point',coordinates:[78.1298,13.1367],precision:'approximate'},
    description:n('Ancient inscriptions name Kolar Kuvalala, Kolala or Kolahalapura; the Western Ganga dynasty\'s founder Konganivarman Madhava (person-kongunivarma in this atlas) is said to have built it as his capital c. 350 CE, and later Ganga rulers carried the title Kuvalala-puravareshvara ("lord of Kuvalala/Kolar"). This is a settlement/dynastic-origin lead, not a claim about any single excavated monument.','ಪ್ರಾಚೀನ ಶಾಸನಗಳು ಕೋಲಾರವನ್ನು ಕುವಲಾಲ, ಕೋಲಾಲ ಅಥವಾ ಕೋಲಾಹಲಪುರ ಎಂದು ಹೆಸರಿಸುತ್ತವೆ; ಪಶ್ಚಿಮ ಗಂಗ ವಂಶದ ಸ್ಥಾಪಕ ಕೊಂಗಣಿವರ್ಮ ಮಾಧವ (ಈ ಭೂಪಟದಲ್ಲಿ person-kongunivarma) ಇದನ್ನು ಸು. ಕ್ರಿ.ಶ. 350ರಲ್ಲಿ ತನ್ನ ರಾಜಧಾನಿಯಾಗಿ ಕಟ್ಟಿದನೆಂದು ಹೇಳಲಾಗುತ್ತದೆ, ನಂತರದ ಗಂಗ ಅರಸರು ಕುವಲಾಲ-ಪುರವರೇಶ್ವರ ("ಕುವಲಾಲ/ಕೋಲಾರದ ಒಡೆಯ") ಬಿರುದನ್ನು ಹೊಂದಿದ್ದರು. ಇದು ವಸತಿ/ವಂಶ-ಮೂಲ ದಾರಿ, ಯಾವುದೇ ಒಂದು ಉತ್ಖನನ ಸ್ಮಾರಕದ ಹಕ್ಕಲ್ಲ.'),
    researchNote:n('Resolve the exact inscriptional locator for the Kuvalala-puravareshvara title and the earliest dated Ganga-era reference to Kolar before promoting beyond this settlement-origin lead; keep separate from the later Kolar Gold Fields mining-archaeology lead (Chigaragunta radiocarbon evidence).','ಈ ವಸತಿ-ಮೂಲ ದಾರಿಯನ್ನು ಉತ್ತೇಜಿಸುವ ಮೊದಲು ಕುವಲಾಲ-ಪುರವರೇಶ್ವರ ಬಿರುದಿನ ನಿಖರ ಶಾಸನ ಸ್ಥಾನಸೂಚಿ ಮತ್ತು ಕೋಲಾರದ ಆರಂಭಿಕ ದಿನಾಂಕಿತ ಗಂಗ-ಕಾಲದ ಉಲ್ಲೇಖವನ್ನು ನಿರ್ಧರಿಸಿ; ನಂತರದ ಕೋಲಾರ ಚಿನ್ನದ ಗಣಿ ಗಣಿಗಾರಿಕೆ-ಪುರಾತತ್ತ್ವ ದಾರಿಯಿಂದ (ಚಿಗರಗುಂಟ ರೇಡಿಯೊಕಾರ್ಬನ್ ಸಾಕ್ಷ್ಯ) ಪ್ರತ್ಯೇಕವಾಗಿ ಇರಿಸಿ.'),
    evidenceBasis:'gazetteer',citations:[{sourceId:'src-wikipedia-kolar-karnataka',locator:'Kolar named Kuvalala/Kolala/Kolahalapura in ancient inscriptions; founded by Konganivarman Madhava c. 350 CE as Western Ganga capital; title Kuvalala-puravareshvara'},{sourceId:'src-gazetteer-karnataka-1983',locator:'Kolar district chapter: Western Ganga dynastic-capital context'}],review:{...review}
  },
  {
    id:'district-history-tumakuru-foundation-stones',recordKind:'candidate',districtId:'audit-tumakuru',district:n('Tumakuru','ತುಮಕೂರು'),
    name:n('Tumakuru foundation-stone and locality-history intake','ತುಮಕೂರು ಸ್ಥಾಪನಾ ಶಿಲೆ ಮತ್ತು ಸ್ಥಳೀಯ ಇತಿಹಾಸ ಸ್ವೀಕೃತಿ'),category:'foundation-stone',
    date:{from:null,to:null,era:'CE',precision:'unknown'},location:{type:'Point',coordinates:[77.1010,13.3379],precision:'district-centroid'},
    description:n('An intake record for foundation stones, civic markers and locality-name histories across Tumakuru district. No individual stone is asserted yet.','ತುಮಕೂರು ಜಿಲ್ಲೆಯ ಸ್ಥಾಪನಾ ಶಿಲೆ, ನಾಗರಿಕ ಗುರುತು ಮತ್ತು ಸ್ಥಳನಾಮ ಇತಿಹಾಸಕ್ಕಾಗಿ ಸ್ವೀಕೃತಿ ದಾಖಲೆ. ಪ್ರಸ್ತುತ ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಶಿಲೆಯನ್ನು ಹಕ್ಕುಸ್ಥಾಪಿಸಲಾಗಿಲ್ಲ.'),
    researchNote:n('Capture inscription text, date, exact location, custodian, photograph rights and a district or institutional source for each future item. The Kaidala Chennakeshava/Gangadhareshwara foundation inscription is now split into its own record below.','ಪ್ರತಿ ಭವಿಷ್ಯದ ವಸ್ತುವಿಗೆ ಶಾಸನ ಪಠ್ಯ, ದಿನಾಂಕ, ನಿಖರ ಸ್ಥಳ, ಪಾಲಕ, ಛಾಯಾಚಿತ್ರ ಹಕ್ಕು ಮತ್ತು ಜಿಲ್ಲಾ ಅಥವಾ ಸಂಸ್ಥೆಯ ಆಕರವನ್ನು ದಾಖಲಿಸಿ. ಕೈದಾಳ ಚೆನ್ನಕೇಶವ/ಗಂಗಾಧರೇಶ್ವರ ಸ್ಥಾಪನಾ ಶಾಸನವನ್ನು ಈಗ ಕೆಳಗಿನ ಪ್ರತ್ಯೇಕ ದಾಖಲೆಗೆ ವಿಭಜಿಸಲಾಗಿದೆ.'),
    evidenceBasis:'district-research-scope',citations:[{sourceId:'src-gazetteer-karnataka-1983',locator:'Tumakuru district chapter: foundation stones and civic history to be located'}],review:{...review}
  },
  {
    id:'district-history-tumakuru-kaidala-chennakeshava-foundation',recordKind:'candidate',districtId:'audit-tumakuru',district:n('Tumakuru','ತುಮಕೂರು'),
    name:n('Kaidala Chennakeshava/Gangadhareshwara foundation inscription','ಕೈದಾಳ ಚೆನ್ನಕೇಶವ/ಗಂಗಾಧರೇಶ್ವರ ಸ್ಥಾಪನಾ ಶಾಸನ'),category:'foundation-stone',
    date:{from:1150,to:1151,era:'CE',precision:'circa'},location:{type:'Point',coordinates:[77.1010,13.3379],precision:'approximate'},
    description:n('Two Hale (Old) Kannada stone inscriptions at Kaidala village record that the local chief Samanta/Gule Bachi, a subordinate of the Hoysala king Narasimha I (person-narasimha-i in this atlas), built the Chennakeshava and Gangadhareshwara temples there in 1150-1151 CE, along with a temple to Narayana. Coordinates are an approximation near Tumkur town (Kaidala lies a few km away); the village\'s own surveyed coordinates are not yet located.','ಕೈದಾಳ ಗ್ರಾಮದಲ್ಲಿನ ಎರಡು ಹಳೆಗನ್ನಡ ಶಿಲಾಶಾಸನಗಳು ಸ್ಥಳೀಯ ಮುಖಂಡ ಸಾಮಂತ/ಗುಳೆ ಬಚ್ಚಿ, ಹೊಯ್ಸಳ ಅರಸ ನರಸಿಂಹ Iನ (ಈ ಭೂಪಟದಲ್ಲಿ person-narasimha-i) ಅಧೀನ, 1150-1151ರಲ್ಲಿ ಅಲ್ಲಿ ಚೆನ್ನಕೇಶವ ಮತ್ತು ಗಂಗಾಧರೇಶ್ವರ ದೇವಾಲಯಗಳನ್ನು, ನಾರಾಯಣ ದೇವಾಲಯದೊಂದಿಗೆ, ಕಟ್ಟಿಸಿದನೆಂದು ದಾಖಲಿಸುತ್ತವೆ. ನಿರ್ದೇಶಾಂಕಗಳು ತುಮಕೂರು ಪಟ್ಟಣದ ಬಳಿಯ ಅಂದಾಜು (ಕೈದಾಳ ಕೆಲವು ಕಿ.ಮೀ ದೂರದಲ್ಲಿದೆ); ಗ್ರಾಮದ ಸ್ವಂತ ಸಮೀಕ್ಷಿತ ನಿರ್ದೇಶಾಂಕಗಳು ಇನ್ನೂ ಪತ್ತೆಯಾಗಿಲ್ಲ.'),
    researchNote:n('Resolve the exact inscription text, Epigraphia Carnatica (Tumkur district) item number and surveyed village coordinates before promoting beyond this foundation-stone lead.','ಈ ಸ್ಥಾಪನಾ-ಶಿಲೆ ದಾರಿಯನ್ನು ಮೀರಿ ಉತ್ತೇಜಿಸುವ ಮೊದಲು ನಿಖರ ಶಾಸನ ಪಠ್ಯ, ಎಪಿಗ್ರಾಫಿಯಾ ಕರ್ನಾಟಿಕಾ (ತುಮಕೂರು ಜಿಲ್ಲೆ) ವಸ್ತು ಸಂಖ್ಯೆ ಮತ್ತು ಸಮೀಕ್ಷಿತ ಗ್ರಾಮ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ನಿರ್ಧರಿಸಿ.'),
    evidenceBasis:'gazetteer',citations:[{sourceId:'src-wikipedia-kaidala-chennakeshava',locator:'Chennakeshava temple built 1150-1151 CE by Samanta Bachi, subordinate of Hoysala king Narasimha I; two Hale Kannada inscriptions at the Gangadhareshwara temple'},{sourceId:'src-gazetteer-karnataka-1983',locator:'Tumakuru district chapter: foundation-stone and locality-history context'}],review:{...review}
  },
  {
    id:'district-history-chikkamagaluru-prehistoric-landscape',recordKind:'candidate',districtId:'audit-chikkamagaluru',district:n('Chikkamagaluru','ಚಿಕ್ಕಮಗಳೂರು'),name:n('Chikkamagaluru early-settlement and prehistoric landscape intake','ಚಿಕ್ಕಮಗಳೂರು ಆರಂಭಿಕ ವಸತಿ ಮತ್ತು ಪೂರ್ವೈತಿಹಾಸಿಕ ಭೂದೃಶ್ಯ ಸ್ವೀಕೃತಿ'),category:'prehistoric-landscape',date:{from:null,to:null,era:'BCE',precision:'unknown'},location:{type:'Point',coordinates:[75.7754,13.3153],precision:'district-centroid'},description:n('A research intake for upland settlement, megalithic and prehistoric landscape evidence in Chikkamagaluru district; no site-level claim is made.','ಚಿಕ್ಕಮಗಳೂರು ಜಿಲ್ಲೆಯ ಮೇಲ್ದಂಡೆ ವಸತಿ, ಮಹಾಶಿಲಾ ಮತ್ತು ಪೂರ್ವೈತಿಹಾಸಿಕ ಭೂದೃಶ್ಯ ಸಾಕ್ಷ್ಯಕ್ಕಾಗಿ ಸಂಶೋಧನಾ ಸ್ವೀಕೃತಿ; ತಾಣಮಟ್ಟದ ಹಕ್ಕು ಇಲ್ಲ.'),researchNote:n('Start with district gazetteers, archaeological survey reports and protected-site lists; record each site separately when its coordinates and phase are known.','ಜಿಲ್ಲಾ ಗೆಜೆಟಿಯರ್, ಪುರಾತತ್ತ್ವ ಸಮೀಕ್ಷಾ ವರದಿ ಮತ್ತು ಸಂರಕ್ಷಿತ ತಾಣ ಪಟ್ಟಿಗಳಿಂದ ಪ್ರಾರಂಭಿಸಿ; ನಿರ್ದೇಶಾಂಕ ಮತ್ತು ಹಂತ ತಿಳಿದಾಗ ಪ್ರತಿ ತಾಣವನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ದಾಖಲಿಸಿ.'),evidenceBasis:'district-research-scope',citations:[{sourceId:'src-gazetteer-karnataka-1983',locator:'Chikkamagaluru district chapter: prehistoric and early-settlement references to locate'}],review:{...review}
  },
  {
    id:'district-history-ballari-archaeological-landscape',recordKind:'candidate',districtId:'audit-ballari',district:n('Ballari','ಬಳ್ಳಾರಿ'),name:n('Ballari prehistoric and early iron-age landscape intake','ಬಳ್ಳಾರಿ ಪೂರ್ವೈತಿಹಾಸಿಕ ಮತ್ತು ಆರಂಭಿಕ ಕಬ್ಬಿಣಯುಗದ ಭೂದೃಶ್ಯ ಸ್ವೀಕೃತಿ'),category:'prehistoric-landscape',date:{from:null,to:null,era:'BCE',precision:'unknown'},location:{type:'Point',coordinates:[76.9214,15.1394],precision:'district-centroid'},description:n('A district research lead for prehistoric habitation, working landscapes and early iron-age material. It is not a dated claim about any one site.','ಪೂರ್ವೈತಿಹಾಸಿಕ ವಾಸಸ್ಥಳ, ಕೆಲಸದ ಭೂದೃಶ್ಯ ಮತ್ತು ಆರಂಭಿಕ ಕಬ್ಬಿಣಯುಗದ ವಸ್ತುಸಾಕ್ಷ್ಯಕ್ಕಾಗಿ ಜಿಲ್ಲಾ ಸಂಶೋಧನಾ ಸುಳಿವು. ಇದು ಯಾವುದೇ ಒಂದು ತಾಣದ ದಿನಾಂಕಿತ ಹಕ್ಕಲ್ಲ.'),researchNote:n('Site-level evidence for the Sanganakallu-Kupgal complex is now split into its own record below; reconcile the remaining district territory against excavation reports, museum catalogues and the district gazetteer before adding further site names or dates.','ಸಂಗನಕಲ್ಲು-ಕುಪ್ಗಲ್ ಸಂಕೀರ್ಣದ ತಾಣ-ಮಟ್ಟದ ಸಾಕ್ಷ್ಯವನ್ನು ಈಗ ಕೆಳಗಿನ ಪ್ರತ್ಯೇಕ ದಾಖಲೆಗೆ ವಿಭಜಿಸಲಾಗಿದೆ; ಮತ್ತಷ್ಟು ತಾಣ ಹೆಸರು ಅಥವಾ ದಿನಾಂಕ ಸೇರಿಸುವ ಮೊದಲು ಉಳಿದ ಜಿಲ್ಲಾ ಪ್ರದೇಶವನ್ನು ಉತ್ಖನನ ವರದಿ, ಸಂಗ್ರಹಾಲಯ ಪಟ್ಟಿಗಳು ಮತ್ತು ಜಿಲ್ಲಾ ಗೆಜೆಟಿಯರ್ ಜೊತೆ ಹೊಂದಿಸಿ.'),evidenceBasis:'district-research-scope',citations:[{sourceId:'src-gazetteer-karnataka-1983',locator:'Ballari district chapter: prehistoric and early iron-age references to locate'}],review:{...review}
  },
  {
    id:'district-history-ballari-sanganakallu-kupgal-neolithic-complex',recordKind:'candidate',districtId:'audit-ballari',district:n('Ballari','ಬಳ್ಳಾರಿ'),name:n('Sanganakallu-Kupgal Neolithic and Mesolithic complex','ಸಂಗನಕಲ್ಲು-ಕುಪ್ಗಲ್ ನವಶಿಲಾಯುಗ ಮತ್ತು ಮಧ್ಯಶಿಲಾಯುಗ ಸಂಕೀರ್ಣ'),category:'prehistoric-landscape',date:{from:1900,to:1200,era:'BCE',precision:'range'},location:{type:'Point',coordinates:[76.9703,15.1847],precision:'approximate'},description:n('A cluster of Mesolithic, Neolithic and Megalithic-period localities about 6 km north-east of Ballari town, including hill settlements, ashmounds, a stone-axe production centre and the associated Kupgal petroglyphs. Excavated and studied since the 19th century; among the most important South Indian Neolithic sites. Coordinates are an approximate site-complex centre, not a surveyed single-monument point.','ಬಳ್ಳಾರಿ ಪಟ್ಟಣದಿಂದ ಸು. 6 ಕಿ.ಮೀ ಈಶಾನ್ಯದಲ್ಲಿರುವ ಮಧ್ಯಶಿಲಾಯುಗ, ನವಶಿಲಾಯುಗ ಮತ್ತು ಮಹಾಶಿಲಾಯುಗ ಕಾಲದ ತಾಣಗಳ ಸಮೂಹ, ಬೆಟ್ಟದ ವಸತಿಗಳು, ಬೂದಿದಿಬ್ಬಗಳು, ಶಿಲಾ-ಕೊಡಲಿ ಉತ್ಪಾದನಾ ಕೇಂದ್ರ ಮತ್ತು ಸಂಬಂಧಿತ ಕುಪ್ಗಲ್ ಶಿಲಾಚಿತ್ರಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. 19ನೇ ಶತಮಾನದಿಂದ ಉತ್ಖನನ ಮತ್ತು ಅಧ್ಯಯನ ನಡೆದಿದೆ; ದಕ್ಷಿಣ ಭಾರತದ ಪ್ರಮುಖ ನವಶಿಲಾಯುಗ ತಾಣಗಳಲ್ಲಿ ಒಂದು. ನಿರ್ದೇಶಾಂಕಗಳು ಒಂದು ಅಂದಾಜು ತಾಣ-ಸಂಕೀರ್ಣ ಕೇಂದ್ರ, ಸಮೀಕ್ಷಿತ ಏಕ-ಸ್ಮಾರಕ ಬಿಂದುವಲ್ಲ.'),researchNote:n('Resolve individual excavated localities (hill settlements, ashmound trenches, petroglyph panels) into separate site records with surveyed coordinates, protection status and managing-authority evidence before promotion.','ಪ್ರತ್ಯೇಕ ಉತ್ಖನನ ತಾಣಗಳನ್ನು (ಬೆಟ್ಟದ ವಸತಿ, ಬೂದಿದಿಬ್ಬ ಕಂದಕ, ಶಿಲಾಚಿತ್ರ ಫಲಕ) ಸಮೀಕ್ಷಿತ ನಿರ್ದೇಶಾಂಕ, ಸಂರಕ್ಷಣಾ ಸ್ಥಿತಿ ಮತ್ತು ಪಾಲಕ-ಪ್ರಾಧಿಕಾರ ಸಾಕ್ಷ್ಯದೊಂದಿಗೆ ಉತ್ತೇಜನಕ್ಕೂ ಮೊದಲು ಪ್ರತ್ಯೇಕ ತಾಣ ದಾಖಲೆಗಳಾಗಿ ಪರಿಹರಿಸಿ.'),evidenceBasis:'archaeological-report',citations:[{sourceId:'src-sciencedirect-sanganakallu-kupgal',locator:'Lithic technology and social transformations in the South Indian Neolithic: the evidence from Sanganakallu-Kupgal; ashmound phase from c. 1900 BCE, peak production 1400-1200 BCE'},{sourceId:'src-wikipedia-sanganakallu',locator:'Site location, extent and excavation history; discovery-lead pending independent field verification'}],review:{...review}
  },
  {
    id:'district-history-raichur-settlement-landscape',recordKind:'candidate',districtId:'audit-raichur',district:n('Raichur','ರಾಯಚೂರು'),name:n('Raichur early-settlement and riverine landscape intake','ರಾಯಚೂರು ಆರಂಭಿಕ ವಸತಿ ಮತ್ತು ನದೀ ಭೂದೃಶ್ಯ ಸ್ವೀಕೃತಿ'),category:'settlement-origin',date:{from:null,to:null,era:'BCE',precision:'unknown'},location:{type:'Point',coordinates:[77.3463,16.2120],precision:'district-centroid'},description:n('An intake lead for settlement continuity around the Krishna–Tungabhadra corridor; individual sites and periods remain unresolved.','ಕೃಷ್ಣಾ–ತುಂಗಭದ್ರಾ ದಂಡೆಯ ವಸತಿ ನಿರಂತರತೆಯ ಸಂಶೋಧನಾ ಸ್ವೀಕೃತಿ; ವೈಯಕ್ತಿಕ ತಾಣ ಮತ್ತು ಅವಧಿಗಳು ಇನ್ನೂ ಬಗೆಹರಿದಿಲ್ಲ.'),researchNote:n('Separate Maski and other inscription evidence from broader settlement claims; use archaeological and gazetteer locators for each item.','ಮಸ್ಕಿ ಮತ್ತು ಇತರ ಶಾಸನ ಸಾಕ್ಷ್ಯವನ್ನು ವ್ಯಾಪಕ ವಸತಿ ಹಕ್ಕುಗಳಿಂದ ಪ್ರತ್ಯೇಕಿಸಿ; ಪ್ರತಿ ವಸ್ತುವಿಗೆ ಪುರಾತತ್ತ್ವ ಮತ್ತು ಗೆಜೆಟಿಯರ್ ಸ್ಥಾನಸೂಚಿ ಬಳಸಿ.'),evidenceBasis:'district-research-scope',citations:[{sourceId:'src-gazetteer-karnataka-1983',locator:'Raichur district chapter: riverine settlement and early sites to locate'}],review:{...review}
  },
  {
    id:'district-history-dharwad-fort-locality',recordKind:'candidate',districtId:'audit-dharwad',district:n('Dharwad','ಧಾರವಾಡ'),name:n('Dharwad fort and locality-history intake','ಧಾರವಾಡ ಕೋಟೆ ಮತ್ತು ಸ್ಥಳೀಯ ಇತಿಹಾಸ ಸ್ವೀಕೃತಿ'),category:'regional-memory',date:{from:null,to:null,era:'CE',precision:'unknown'},location:{type:'Point',coordinates:[75.1240,15.4589],precision:'district-centroid'},description:n('A research intake for fort remains, town-name history, regional memory and later colonial civic layers in Dharwad district.','ಧಾರವಾಡ ಜಿಲ್ಲೆಯ ಕೋಟೆ ಅವಶೇಷ, ಪಟ್ಟಣದ ಸ್ಥಳನಾಮ ಇತಿಹಾಸ, ಪ್ರಾದೇಶಿಕ ಸ್ಮೃತಿ ಮತ್ತು ನಂತರದ ವಸಾಹತು ನಾಗರಿಕ ಪದರಗಳ ಸಂಶೋಧನಾ ಸ್ವೀಕೃತಿ.'),researchNote:n('Capture a separate record for each fort, civic building or memory source with a dated publication or field photograph.','ಪ್ರತಿ ಕೋಟೆ, ನಾಗರಿಕ ಕಟ್ಟಡ ಅಥವಾ ಸ್ಮೃತಿ ಆಕರಕ್ಕೆ ದಿನಾಂಕಿತ ಪ್ರಕಟಣೆ ಅಥವಾ ಕ್ಷೇತ್ರ ಛಾಯಾಚಿತ್ರದೊಂದಿಗೆ ಪ್ರತ್ಯೇಕ ದಾಖಲೆ ರಚಿಸಿ.'),evidenceBasis:'district-research-scope',citations:[{sourceId:'src-gazetteer-karnataka-1983',locator:'Dharwad district chapter: fort, town and civic-history references to locate'}],review:{...review}
  },
  {
    id:'district-history-haveri-temple-settlement',recordKind:'candidate',districtId:'audit-haveri',district:n('Haveri','ಹಾವೇರಿ'),name:n('Haveri temple-settlement and inscription landscape intake','ಹಾವೇರಿ ದೇವಾಲಯ-ವಸತಿ ಮತ್ತು ಶಾಸನ ಭೂದೃಶ್ಯ ಸ್ವೀಕೃತಿ'),category:'settlement-origin',date:{from:null,to:null,era:'CE',precision:'unknown'},location:{type:'Point',coordinates:[75.4049,14.7951],precision:'district-centroid'},description:n('A research intake linking temple settlements, inscription contexts and regional routes in Haveri district without asserting a single origin date. The Siddheshwara temple item-level lead is now split into its own record below.','ಹಾವೇರಿ ಜಿಲ್ಲೆಯ ದೇವಾಲಯ ವಸತಿ, ಶಾಸನ ಸಂದರ್ಭ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಮಾರ್ಗಗಳನ್ನು ಸಂಪರ್ಕಿಸುವ ಸಂಶೋಧನಾ ಸ್ವೀಕೃತಿ; ಒಂದೇ ಮೂಲ ದಿನಾಂಕವನ್ನು ಹಕ್ಕುಸ್ಥಾಪಿಸುವುದಿಲ್ಲ. ಸಿದ್ಧೇಶ್ವರ ದೇವಾಲಯ ವಸ್ತು-ಮಟ್ಟದ ದಾರಿಯನ್ನು ಈಗ ಕೆಳಗಿನ ಪ್ರತ್ಯೇಕ ದಾಖಲೆಗೆ ವಿಭಜಿಸಲಾಗಿದೆ.'),researchNote:n('Prioritise item-level temple and inscription records, then map the settlement context separately.','ಮೊದಲು ವಸ್ತುಮಟ್ಟದ ದೇವಾಲಯ ಮತ್ತು ಶಾಸನ ದಾಖಲೆಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡಿ; ನಂತರ ವಸತಿ ಸಂದರ್ಭವನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ನಕ್ಷೆಗೊಳಿಸಿ.'),evidenceBasis:'district-research-scope',citations:[{sourceId:'src-gazetteer-karnataka-1983',locator:'Haveri district chapter: temple settlements and inscription references to locate'}],review:{...review}
  },
  {
    id:'district-history-haveri-siddheshwara-temple',recordKind:'candidate',districtId:'audit-haveri',district:n('Haveri','ಹಾವೇರಿ'),
    name:n('Siddheshwara Temple, Haveri: Western Chalukya inscription site','ಹಾವೇರಿ ಸಿದ್ಧೇಶ್ವರ ದೇವಾಲಯ: ಪಶ್ಚಿಮ ಚಾಲುಕ್ಯ ಶಾಸನ ತಾಣ'),category:'settlement-origin',
    date:{from:1087,to:1108,era:'CE',precision:'range'},location:{type:'Point',coordinates:[75.41083,14.79056],precision:'approximate'},
    description:n('The soapstone Siddheshwara temple at Haveri, an ornate Western Chalukya construction with an 11th-century core and 12th-century additions, unusually facing west. An Old Kannada grant inscription on an interior beam is dated 1087 CE and a stone inscription outside is dated 1108 CE; a further inscription dates to 1109 CE. Coordinates follow the Wikipedia infobox and are not independently field-verified.','ಹಾವೇರಿಯ ಸಿದ್ಧೇಶ್ವರ ದೇವಾಲಯ, 11ನೇ ಶತಮಾನದ ಮೂಲ ಮತ್ತು 12ನೇ ಶತಮಾನದ ಸೇರ್ಪಡೆಗಳೊಂದಿಗೆ ಅಲಂಕೃತ ಪಶ್ಚಿಮ ಚಾಲುಕ್ಯ ನಿರ್ಮಾಣ, ಅಸಾಮಾನ್ಯವಾಗಿ ಪಶ್ಚಿಮಾಭಿಮುಖ. ಒಳಗಿನ ತೊಲೆಯ ಮೇಲಿನ ಹಳೆಗನ್ನಡ ದಾನ ಶಾಸನ 1087ರ ದಿನಾಂಕ, ಹೊರಗಿನ ಶಿಲಾಶಾಸನ 1108ರ ದಿನಾಂಕ ಹೊಂದಿದೆ; ಮತ್ತೊಂದು ಶಾಸನ 1109ರ ದಿನಾಂಕ ಹೊಂದಿದೆ. ನಿರ್ದೇಶಾಂಕಗಳು ವಿಕಿಪೀಡಿಯ ಮಾಹಿತಿ ಪೆಟ್ಟಿಗೆಯನ್ನು ಅನುಸರಿಸುತ್ತವೆ ಮತ್ತು ಸ್ವತಂತ್ರವಾಗಿ ಕ್ಷೇತ್ರ-ಪರಿಶೀಲಿಸಿಲ್ಲ.'),
    researchNote:n('Resolve the exact Epigraphia Carnatica/Indica item numbers for the 1087 and 1108 CE inscriptions, ASI protection/monument number, and field-verified coordinates before promoting beyond this settlement-origin lead.','1087 ಮತ್ತು 1108ರ ಶಾಸನಗಳ ನಿಖರ ಎಪಿಗ್ರಾಫಿಯಾ ಕರ್ನಾಟಿಕಾ/ಇಂಡಿಕಾ ವಸ್ತು ಸಂಖ್ಯೆಗಳು, ASI ಸಂರಕ್ಷಣಾ/ಸ್ಮಾರಕ ಸಂಖ್ಯೆ, ಮತ್ತು ಕ್ಷೇತ್ರ-ಪರಿಶೀಲಿತ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಈ ವಸತಿ-ಮೂಲ ದಾರಿಯನ್ನು ಮೀರಿ ಉತ್ತೇಜಿಸುವ ಮೊದಲು ನಿರ್ಧರಿಸಿ.'),
    evidenceBasis:'gazetteer',citations:[{sourceId:'src-wikipedia-siddhesvara-temple-haveri',locator:'Siddheshwara temple, Haveri: 1087 CE beam inscription, 1108 CE stone inscription, Western Chalukya architecture'},{sourceId:'src-gazetteer-karnataka-1983',locator:'Haveri district chapter: temple-settlement context'}],review:{...review}
  },
  {
    id:'district-history-davanagere-settlement-foundations',recordKind:'candidate',districtId:'audit-davanagere',district:n('Davanagere','ದಾವಣಗೆರೆ'),name:n('Davanagere settlement, market and foundation-marker intake','ದಾವಣಗೆರೆ ವಸತಿ, ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಸ್ಥಾಪನಾ ಗುರುತು ಸ್ವೀಕೃತಿ'),category:'urban-foundation',date:{from:null,to:null,era:'CE',precision:'unknown'},location:{type:'Point',coordinates:[75.9218,14.4644],precision:'district-centroid'},description:n('An intake record for town formation, market history, civic foundations and nearby temple settlements in Davanagere district. The Harihareshwara temple item-level lead is now split into its own record below.','ದಾವಣಗೆರೆ ಜಿಲ್ಲೆಯ ಪಟ್ಟಣ ರೂಪುಗೊಳ್ಳುವಿಕೆ, ಮಾರುಕಟ್ಟೆ ಇತಿಹಾಸ, ನಾಗರಿಕ ಸ್ಥಾಪನೆ ಮತ್ತು ಸಮೀಪದ ದೇವಾಲಯ ವಸತಿಗಳ ಸ್ವೀಕೃತಿ ದಾಖಲೆ. ಹರಿಹರೇಶ್ವರ ದೇವಾಲಯ ವಸ್ತು-ಮಟ್ಟದ ದಾರಿಯನ್ನು ಈಗ ಕೆಳಗಿನ ಪ್ರತ್ಯೇಕ ದಾಖಲೆಗೆ ವಿಭಜಿಸಲಾಗಿದೆ.'),researchNote:n('Separate modern civic foundation stones from medieval temple or inscription evidence, with custodians and photographs recorded for each.','ಆಧುನಿಕ ನಾಗರಿಕ ಸ್ಥಾಪನಾ ಶಿಲೆಗಳನ್ನು ಮಧ್ಯಯುಗದ ದೇವಾಲಯ ಅಥವಾ ಶಾಸನ ಸಾಕ್ಷ್ಯದಿಂದ ಪ್ರತ್ಯೇಕಿಸಿ; ಪ್ರತಿ ವಸ್ತುವಿಗೆ ಪಾಲಕ ಮತ್ತು ಛಾಯಾಚಿತ್ರ ದಾಖಲಿಸಿ.'),evidenceBasis:'district-research-scope',citations:[{sourceId:'src-gazetteer-karnataka-1983',locator:'Davanagere district chapter: settlement, market and civic-history references to locate'}],review:{...review}
  },
  {
    id:'district-history-davanagere-harihareshwara-temple',recordKind:'candidate',districtId:'audit-davanagere',district:n('Davanagere','ದಾವಣಗೆರೆ'),
    name:n('Harihareshwara Temple, Harihar: Hoysala foundation','ಹರಿಹರ ಹರಿಹರೇಶ್ವರ ದೇವಾಲಯ: ಹೊಯ್ಸಳ ಸ್ಥಾಪನೆ'),category:'urban-foundation',
    date:{from:1223,to:1268,era:'CE',precision:'range'},location:{type:'Point',coordinates:[75.80194,14.51167],precision:'approximate'},
    description:n('The Harihareshwara temple at Harihar, dedicated to a fused Shiva-Vishnu form, was built c. 1223-1224 CE by Polalva, a commander/minister of the Hoysala king Vira Narasimha II (person-narasimha-ii in this atlas); Soma, a commander under Narasimha III, made additions in 1268 CE. A smaller temple on the site is said to date to the 5th century. The town of Harihar takes its name from the temple deity. Coordinates follow the Wikipedia infobox and are not independently field-verified.','ಶಿವ-ವಿಷ್ಣು ಸಂಯೋಜಿತ ರೂಪಕ್ಕೆ ಸಮರ್ಪಿತವಾದ ಹರಿಹರದ ಹರಿಹರೇಶ್ವರ ದೇವಾಲಯವನ್ನು ಹೊಯ್ಸಳ ಅರಸ ವೀರ ನರಸಿಂಹ IIನ (ಈ ಭೂಪಟದಲ್ಲಿ person-narasimha-ii) ಸೇನಾಪತಿ/ಮಂತ್ರಿ ಪೊಲಾಳ್ವ ಸು. 1223-1224ರಲ್ಲಿ ಕಟ್ಟಿಸಿದನು; ನರಸಿಂಹ IIIನ ಸೇನಾಪತಿ ಸೋಮ 1268ರಲ್ಲಿ ಸೇರ್ಪಡೆಗಳನ್ನು ಮಾಡಿದನು. ತಾಣದಲ್ಲಿ ಒಂದು ಸಣ್ಣ ದೇವಾಲಯ 5ನೇ ಶತಮಾನದ್ದೆಂದು ಹೇಳಲಾಗುತ್ತದೆ. ಹರಿಹರ ಪಟ್ಟಣಕ್ಕೆ ದೇವಾಲಯದ ದೇವರ ಹೆಸರೇ ಇಡಲಾಗಿದೆ. ನಿರ್ದೇಶಾಂಕಗಳು ವಿಕಿಪೀಡಿಯ ಮಾಹಿತಿ ಪೆಟ್ಟಿಗೆಯನ್ನು ಅನುಸರಿಸುತ್ತವೆ ಮತ್ತು ಸ್ವತಂತ್ರವಾಗಿ ಕ್ಷೇತ್ರ-ಪರಿಶೀಲಿಸಿಲ್ಲ.'),
    researchNote:n('Resolve the exact Epigraphia Carnatica item number for the temple\'s foundation and 1268 CE addition inscriptions, ASI protection/monument number, and confirm the claimed 5th-century predecessor temple against an archaeological source before promoting beyond this urban-foundation lead.','ದೇವಾಲಯದ ಸ್ಥಾಪನಾ ಮತ್ತು 1268ರ ಸೇರ್ಪಡೆ ಶಾಸನಗಳ ನಿಖರ ಎಪಿಗ್ರಾಫಿಯಾ ಕರ್ನಾಟಿಕಾ ವಸ್ತು ಸಂಖ್ಯೆ, ASI ಸಂರಕ್ಷಣಾ/ಸ್ಮಾರಕ ಸಂಖ್ಯೆಯನ್ನು ನಿರ್ಧರಿಸಿ, ಮತ್ತು ಈ ನಗರ-ಸ್ಥಾಪನಾ ದಾರಿಯನ್ನು ಮೀರಿ ಉತ್ತೇಜಿಸುವ ಮೊದಲು 5ನೇ ಶತಮಾನದ ಪೂರ್ವಸೂರಿ ದೇವಾಲಯದ ಹಕ್ಕನ್ನು ಪುರಾತತ್ತ್ವ ಆಕರದ ವಿರುದ್ಧ ದೃಢಪಡಿಸಿ.'),
    evidenceBasis:'gazetteer',citations:[{sourceId:'src-wikipedia-harihareshwara-temple',locator:'Harihareshwara temple, Harihar: built c. 1223-1224 CE by Polalva under Vira Narasimha II; 1268 CE additions by Soma under Narasimha III'},{sourceId:'src-gazetteer-karnataka-1983',locator:'Davanagere district chapter: urban-foundation and temple context'}],review:{...review}
  }
]

export const districtHistoryResearch=[...districtHistoryScopes,...districtHistoryCandidates]

// Append authority-led UNESCO/ASI and state-heritage components without
// renumbering the original district seed candidates. These records deliberately
// remain review-gated until photographs, present condition and item-level
// protection evidence are completed.
heritageAuthorityAdditions.forEach(addition=>{
  const audit=heritageAudits.find(item=>item.id===addition.districtId)
  if(!audit||audit.prioritySites.some(site=>site.id===addition.id))return
  const verification=mergeVerification(addition.id,addition.verification)
  audit.prioritySites.push({id:addition.id,name:addition.name,category:addition.category,status:verification.verificationStatus,verification})
  audit.categoryCoverage[addition.category]=audit.categoryCoverage[addition.category]==='unassessed'?'seeded':audit.categoryCoverage[addition.category]
})
