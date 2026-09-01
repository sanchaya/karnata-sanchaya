const n=(en,kn)=>({en,kn})
const d=(from,to=from,precision='circa',era='CE')=>({from,to,era,precision})
const c=(sourceId,locator)=>({sourceId,locator})
const review={status:'needs-review',reviewer:null,updatedAt:'2026-07-30'}

export const v022Sources=[
  {id:'src-ei-vol-9-alupa-udiyavara',type:'epigraphic-edition',title:n('Epigraphia Indica, Vol. IX: archaic Kanarese inscriptions of the Alupas at Udiyavara','ಎಪಿಗ್ರಾಫಿಯಾ ಇಂಡಿಕಾ, ಸಂ. IX: ಉಡುಯಾವರದ ಆಳುಪರ ಪ್ರಾಚೀನ ಕನ್ನಡ ಶಾಸನಗಳು'),authors:['Archaeological Survey of India','H. Krishna Sastri'],year:1907,url:'https://onlinebooks.library.upenn.edu/webbin/serial?id=epigraphindica',review},
  {id:'src-karnataka-tourism-keladi',type:'government-web',title:n('Keladi: first capital of the Keladi Nayakas','ಕೆಳದಿ: ಕೆಳದಿ ನಾಯಕರ ಮೊದಲ ರಾಜಧಾನಿ'),authors:['Karnataka Tourism, Government of Karnataka'],year:null,url:'https://karnatakatourism.org/en/destinations/keladi',review},
  {id:'src-karnataka-gazetteer-chitradurga-1965',type:'government-gazetteer',title:n('Karnataka State Gazetteer: Chitradurga','ಕರ್ನಾಟಕ ರಾಜ್ಯ ಗೆಜೆಟಿಯರ್: ಚಿತ್ರದುರ್ಗ'),authors:['Government of Karnataka'],year:1965,url:'https://books.google.com/books?id=ybFBmS0g_NEC',review},
  {id:'src-cesck-vikramarjuna-vijaya',type:'scholarly-database',title:n('Vikramarjuna Vijaya: manuscripts and editions','ವಿಕ್ರಮಾರ್ಜುನ ವಿಜಯ: ಹಸ್ತಪ್ರತಿಗಳು ಮತ್ತು ಆವೃತ್ತಿಗಳು'),authors:['Centre of Excellence for Studies in Classical Kannada','Central Institute of Indian Languages'],year:null,url:'https://shastriyakannada.org/database/english/literature/VIKRAMARJUNAVIAJAYA%20HTML.htm',review},
  {id:'src-asi-ancient-india-4-brahmagiri',type:'archaeological-report',title:n('Ancient India No. 4: Brahmagiri and Chandravalli excavations','ಏನ್ಷಿಯಂಟ್ ಇಂಡಿಯಾ ಸಂ. 4: ಬ್ರಹ್ಮಗಿರಿ ಮತ್ತು ಚಂದ್ರವಳ್ಳಿ ಉತ್ಖನನಗಳು'),authors:['R. E. M. Wheeler','Archaeological Survey of India'],year:1948,url:'https://asi.nic.in/admin/publications/ancient-india/',scope:n('Excavation sequence and material culture; individual page and plate locators remain a reviewer task.','ಉತ್ಖನನ ಕ್ರಮ ಮತ್ತು ವಸ್ತು ಸಂಸ್ಕೃತಿ; ಪ್ರತ್ಯೇಕ ಪುಟ ಮತ್ತು ಫಲಕ ಸ್ಥಳಸೂಚಿಗಳು ಪರಿಶೀಲಕರ ಕಾರ್ಯವಾಗಿ ಉಳಿದಿವೆ.'),review},
  {id:'src-cesck-kavirajamarga',type:'scholarly-database',title:n('Kavirajamarga: work record and publishing history','ಕವಿರಾಜಮಾರ್ಗ: ಕೃತಿ ದಾಖಲೆ ಮತ್ತು ಪ್ರಕಟಣಾ ಇತಿಹಾಸ'),authors:['Centre of Excellence for Studies in Classical Kannada','Central Institute of Indian Languages'],year:null,url:'https://shastriyakannada.org/database/english/knowledgebase/KAVIRAJAMARGA%20HTML.htm',review},
  {id:'src-cesck-adipurana',type:'scholarly-database',title:n('Adipuranam: manuscripts and editions','ಆದಿಪುರಾಣಂ: ಹಸ್ತಪ್ರತಿಗಳು ಮತ್ತು ಆವೃತ್ತಿಗಳು'),authors:['Centre of Excellence for Studies in Classical Kannada','Central Institute of Indian Languages'],year:null,url:'https://shastriyakannada.org/database/english/literature/ADIPURANAM%20HTML.htm',review},
  {id:'src-cesck-vaddaradhane',type:'scholarly-database',title:n('Vaddaradhane: manuscripts and publishing history','ವಡ್ಡಾರಾಧನೆ: ಹಸ್ತಪ್ರತಿಗಳು ಮತ್ತು ಪ್ರಕಟಣಾ ಇತಿಹಾಸ'),authors:['Centre of Excellence for Studies in Classical Kannada','Central Institute of Indian Languages'],year:null,url:'https://shastriyakannada.org/database/english/literature/VADDARADHANE%20HTML.htm',review},
  {id:'src-routledge-gadayuddham',type:'critical-translation',title:n('Ranna: Gadayuddham — The Duel of the Maces','ರನ್ನ: ಗದಾಯುದ್ಧಂ — ದ ಡ್ಯುಯೆಲ್ ಆಫ್ ದ ಮೇಸಸ್'),authors:['R. V. S. Sundaram','Akkamahadevi','Sharon L. Sundaram'],year:2021,url:'https://www.routledge.com/Ranna-Gadyuddham-The-Duel-ofthe-Maces/Akkamahadevi-Sharon-Sundaram/p/book/9780367535940',review},
  {id:'src-v022-district-audit-provenance',type:'research-dataset',title:n('Atlas district heritage audit provenance, v0.22','ಭೂಪಟ ಜಿಲ್ಲಾ ಪರಂಪರೆ ಪರಿಶೀಲನಾ ಮೂಲದಾಖಲೆ, v0.22'),authors:['Karnataka Historical Atlas research team'],year:2026,url:'',scope:n('Internal intake packets derived from the existing district audit; each retains the audit candidate’s coordinate precision and external provenance.','ಈಗಿರುವ ಜಿಲ್ಲಾ ಪರಿಶೀಲನೆಯಿಂದ ಪಡೆದ ಆಂತರಿಕ ಸ್ವೀಕೃತಿ ಪ್ಯಾಕೆಟ್‌ಗಳು; ಪ್ರತಿಯೊಂದು ಪರಿಶೀಲನಾ ಅಭ್ಯರ್ಥಿಯ ನಿರ್ದೇಶಾಂಕ ನಿಖರತೆ ಮತ್ತು ಬಾಹ್ಯ ಮೂಲವನ್ನು ಉಳಿಸಿಕೊಂಡಿದೆ.'),review}
]

export const v022Places=[
  {id:'place-udupi',name:n('Udupi','ಉಡುಪಿ'),kind:'settlement',location:{type:'Point',coordinates:[74.7461,13.3322],precision:'approximate'},citations:[c('src-epigraphia-carnatica','South Kanara/Udupi district corpus context')],review},
  {id:'place-keladi',name:n('Keladi','ಕೆಳದಿ'),kind:'capital',location:{type:'Point',coordinates:[75.202,14.225],precision:'approximate'},citations:[c('src-gazetteer-karnataka-1983','Shivamogga district: Keladi as the first Nayaka capital')],review},
  {id:'place-ikkeri',name:n('Ikkeri','ಇಕ್ಕೇರಿ'),kind:'capital',location:{type:'Point',coordinates:[75.117,14.159],precision:'approximate'},citations:[c('src-gazetteer-karnataka-1983','Shivamogga district: Ikkeri capital and Aghoreshvara complex')],review}
]

export const v022Polities=[
  {id:'polity-alupa',name:n('Alupa polity of coastal Karnataka','ಕರಾವಳಿ ಕರ್ನಾಟಕದ ಆಳುಪ ರಾಜ್ಯ'),type:'kingdom',date:d(450,1400,'range'),capitalId:'place-mangaluru',color:'#287f77',description:n('A long-lived coastal lineage associated with Tuluva and Mangaluru–Udupi political landscapes. Dates and changing centres are deliberately broad until inscription-by-inscription review is complete.','ತುಳುನಾಡು ಮತ್ತು ಮಂಗಳೂರು–ಉಡುಪಿ ರಾಜಕೀಯ ಭೂದೃಶ್ಯಗಳೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ ದೀರ್ಘಕಾಲದ ಕರಾವಳಿ ವಂಶ. ಶಾಸನವಾರು ಪರಿಶೀಲನೆ ಮುಗಿಯುವವರೆಗೆ ದಿನಾಂಕ ಮತ್ತು ಬದಲಾಗುವ ಕೇಂದ್ರಗಳನ್ನು ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ವಿಶಾಲವಾಗಿ ಇಡಲಾಗಿದೆ.'),extent:{type:'Polygon',coordinates:[[74.55,12.55],[75.15,12.55],[75.2,13.8],[74.45,13.8]],precision:'schematic'},citations:[c('src-epigraphia-carnatica','South Kanara corpus: Alupa records; exact volumes and items queued')],review},
]
v022Polities[0].citations.unshift(c('src-ei-vol-9-alupa-udiyavara','Alupa ruler names and Udiyavara pillar-inscription context'))

export const v022ExternalPolities=[
  {id:'external-polity-keladi-nayaka',name:n('Keladi–Ikkeri Nayakas','ಕೆಳದಿ–ಇಕ್ಕೇರಿ ನಾಯಕರು'),type:'regional-polity',citations:[c('src-gazetteer-karnataka-1983','Shivamogga district history: Keladi and Ikkeri capitals')],review}
]

const event=(id,type,en,kn,date,coordinates,summary,participants,citations,extra={})=>({id:`event-${id}`,type,name:n(en,kn),date,location:coordinates?{type:'Point',coordinates,precision:'approximate'}:null,route:null,summary:n(summary.en,summary.kn),participants,consequences:n(extra.consequenceEn||'This record opens a linked research packet; it does not imply uninterrupted control. ',extra.consequenceKn||'ಈ ದಾಖಲೆ ಸಂಪರ್ಕಿತ ಸಂಶೋಧನಾ ಪ್ಯಾಕೆಟ್ ತೆರೆಯುತ್ತದೆ; ನಿರಂತರ ನಿಯಂತ್ರಣವನ್ನು ಸೂಚಿಸುವುದಿಲ್ಲ.'),citations,review:{...review},peopleIds:extra.peopleIds||[],...(extra.destinationPlaceId?{destinationPlaceId:extra.destinationPlaceId}:{})})

export const v022Events=[
  event('brahmagiri-chandravalli-archaeological-sequence','archaeological-phase','Brahmagiri–Chandravalli early-historic sequence','ಬ್ರಹ್ಮಗಿರಿ–ಚಂದ್ರವಳ್ಳಿ ಆರಂಭಿಕ ಐತಿಹಾಸಿಕ ಕ್ರಮ',d(300,100,'range','BCE'),[76.68,14.17],n('Excavated sequences connect megalithic, Mauryan and early-historic material worlds in interior Karnataka; the displayed span is an interpretive research lane.','ಉತ್ಖನನ ಕ್ರಮಗಳು ಒಳನಾಡು ಕರ್ನಾಟಕದ ಮಹಾಶಿಲಾಯುಗ, ಮೌರ್ಯ ಮತ್ತು ಆರಂಭಿಕ ಐತಿಹಾಸಿಕ ವಸ್ತುಲೋಕಗಳನ್ನು ಜೋಡಿಸುತ್ತವೆ; ತೋರಿಸಿರುವ ಅವಧಿ ವ್ಯಾಖ್ಯಾನಾತ್ಮಕ ಸಂಶೋಧನಾ ಹಾದಿಯಾಗಿದೆ.'),[{polityId:'external-polity-maurya',role:'historical-context',outcome:'inscriptional-and-material-context'}],[c('src-asi-ancient-india-4-brahmagiri','Brahmagiri and Chandravalli excavation report; phases and plates')]),
  event('ashokan-edicts-karnataka','inscription','Ashokan edict sites in Karnataka','ಕರ್ನಾಟಕದ ಅಶೋಕ ಶಾಸನ ತಾಣಗಳು',d(260,230,'circa','BCE'),[76.6,14.2],n('Minor Rock Edict sites at Brahmagiri and neighbouring localities anchor Karnataka within Mauryan communication geography; each stone still needs an item-level edition record.','ಬ್ರಹ್ಮಗಿರಿ ಮತ್ತು ಸಮೀಪದ ಸ್ಥಳಗಳ ಕಿರು ಶಿಲಾಶಾಸನಗಳು ಕರ್ನಾಟಕವನ್ನು ಮೌರ್ಯ ಸಂವಹನ ಭೂಗೋಳದಲ್ಲಿ ಸ್ಥಾಪಿಸುತ್ತವೆ; ಪ್ರತಿಯೊಂದು ಶಿಲೆಗೆ ಇನ್ನೂ ವಸ್ತುಮಟ್ಟದ ಆವೃತ್ತಿ ದಾಖಲೆ ಬೇಕು.'),[{polityId:'external-polity-maurya',role:'issuing-power',outcome:'epigraphic-network'}],[c('src-epigraphia-indica','Ashokan Minor Rock Edicts in Karnataka; volume, plate and line locators queued')],{peopleIds:['person-ashoka']}),
  event('alupa-coastal-polity-attested','political-development','Alupa rule attested in coastal Karnataka','ಕರಾವಳಿ ಕರ್ನಾಟಕದಲ್ಲಿ ಆಳುಪ ಆಳ್ವಿಕೆಯ ದಾಖಲೆ',d(650,900,'range'),[74.86,12.91],n('Inscriptional leads place Alupa rulers and grants within the coastal political landscape; this packet separates attested sites from a schematic dynastic span.','ಶಾಸನ ಸುಳಿವುಗಳು ಕರಾವಳಿ ರಾಜಕೀಯ ಭೂದೃಶ್ಯದಲ್ಲಿ ಆಳುಪ ಅರಸರು ಮತ್ತು ದಾನಗಳನ್ನು ಸ್ಥಾಪಿಸುತ್ತವೆ; ಈ ಪ್ಯಾಕೆಟ್ ದಾಖಲಾದ ತಾಣಗಳನ್ನು ಅಂದಾಜು ವಂಶಾವಧಿಯಿಂದ ಬೇರ್ಪಡಿಸುತ್ತದೆ.'),[{polityId:'polity-alupa',role:'coastal-polity',outcome:'inscriptional-attestation'}],[c('src-epigraphia-carnatica','South Kanara/Udupi Alupa inscription sequence; item locators pending')],{destinationPlaceId:'place-mangaluru'}),
  event('keladi-nayaka-governance','capital-relocation','Keladi–Ikkeri Nayaka governance and capital sequence','ಕೆಳದಿ–ಇಕ್ಕೇರಿ ನಾಯಕರ ಆಡಳಿತ ಮತ್ತು ರಾಜಧಾನಿ ಕ್ರಮ',d(1499,1763,'range'),[75.117,14.159],n('The regional state developed from Keladi and later Ikkeri, with changing centres and coastal-interior authority that require reign-level resolution.','ಪ್ರಾದೇಶಿಕ ರಾಜ್ಯವು ಕೆಳದಿ ಮತ್ತು ನಂತರ ಇಕ್ಕೇರಿಯಿಂದ ಬೆಳೆದು, ಬದಲಾಗುವ ಕೇಂದ್ರಗಳು ಹಾಗೂ ಕರಾವಳಿ–ಒಳನಾಡು ಅಧಿಕಾರವನ್ನು ಹೊಂದಿತ್ತು; ಇದಕ್ಕೆ ಆಳ್ವಿಕೆಮಟ್ಟದ ಪರಿಶೀಲನೆ ಬೇಕು.'),[{polityId:'external-polity-keladi-nayaka',role:'governing-polity',outcome:'regional-state'}],[c('src-gazetteer-karnataka-1983','Shivamogga district: Keladi and Ikkeri Nayaka history')],{destinationPlaceId:'place-ikkeri'}),
  event('chitradurga-nayaka-governance','political-development','Chitradurga Nayaka governance centred on the fort','ಕೋಟೆ ಕೇಂದ್ರಿತ ಚಿತ್ರದುರ್ಗ ನಾಯಕರ ಆಡಳಿತ',d(1588,1779,'range'),[76.398,14.2154],n('A fortified regional state developed around Chitradurga; rulers, subordinate territories and conflicts must be linked to dated inscriptions and records.','ಚಿತ್ರದುರ್ಗದ ಸುತ್ತ ಕೋಟೆಬದ್ಧ ಪ್ರಾದೇಶಿಕ ರಾಜ್ಯ ಬೆಳೆದಿತು; ಅರಸರು, ಅಧೀನ ಪ್ರದೇಶಗಳು ಮತ್ತು ಸಂಘರ್ಷಗಳನ್ನು ದಿನಾಂಕಿತ ಶಾಸನ ಮತ್ತು ದಾಖಲೆಗಳಿಗೆ ಜೋಡಿಸಬೇಕು.'),[{polityId:'external-polity-chitradurga-nayaka',role:'governing-polity',outcome:'regional-state'}],[c('src-karnataka-tourism-chitradurga','Fort and regional Nayaka context'),c('src-gazetteer-karnataka-1983','Chitradurga district historical chapter')],{destinationPlaceId:'place-chitradurga-fort'})
]
// Reuse the established public event vocabulary while preserving the more
// specific interpretation in each bilingual summary.
const eventTypeAliases={
  'event-brahmagiri-chandravalli-archaeological-sequence':'cultural-contact',
  'event-alupa-coastal-polity-attested':'regime-change',
  'event-chitradurga-nayaka-governance':'regime-change'
}
v022Events.forEach(item=>{item.type=eventTypeAliases[item.id]||item.type})
v022Events.find(item=>item.id==='event-alupa-coastal-polity-attested')?.citations.unshift(c('src-ei-vol-9-alupa-udiyavara','Alupa epigraphic attestations at Udiyavara'))

export const v022Inscriptions=[
  {id:'inscription-alupa-belmannu-copper-plates',name:n('Belmannu Alupa copper-plate packet','ಬೆಳ್ಮಣ್ಣು ಆಳುಪ ತಾಮ್ರಪಟ ಪ್ಯಾಕೆಟ್'),date:d(750,850,'range'),placeId:'place-udupi',polityId:'polity-alupa',languages:['Sanskrit','Kannada'],scripts:['Southern Brahmi / early Kannada'],description:n('A coastal Alupa grant lead retained as a packet until its ruler, regnal date, plates, edition, transcription and findspot are matched.','ಅರಸ, ಆಳ್ವಿಕೆ ವರ್ಷ, ಫಲಕಗಳು, ಆವೃತ್ತಿ, ಲಿಪ್ಯಂತರ ಮತ್ತು ಪತ್ತೆಸ್ಥಳವನ್ನು ಹೊಂದಿಸುವವರೆಗೆ ಕರಾವಳಿ ಆಳುಪ ದಾನಶಾಸನದ ಸುಳಿವನ್ನು ಪ್ಯಾಕೆಟ್ ಆಗಿ ಉಳಿಸಲಾಗಿದೆ.'),citations:[c('src-epigraphia-carnatica','South Kanara/Udupi corpus: locate Belmannu copper-plate item and pages')],review:{...review}}
]
v022Inscriptions.forEach(item=>{item.districtAuditId='audit-udupi'})
Object.assign(v022Inscriptions[0],{
  id:'inscription-alupa-udiyavara-pillars',
  name:n('Udiyavara Alupa pillar-inscription packet','ಉಡುಯಾವರ ಆಳುಪ ಸ್ತಂಭಶಾಸನ ಪ್ಯಾಕೆಟ್'),
  description:n('An item-level packet for the archaic Kannada Alupa pillar inscriptions reported at Udiyavara; line readings, rulers, dates, find context and present custody remain review gates.','ಉಡುಯಾವರದಲ್ಲಿ ವರದಿಯಾದ ಆಳುಪರ ಪ್ರಾಚೀನ ಕನ್ನಡ ಸ್ತಂಭಶಾಸನಗಳ ವಸ್ತುಮಟ್ಟದ ಪ್ಯಾಕೆಟ್; ಸಾಲುಪಾಠ, ಅರಸರು, ದಿನಾಂಕ, ಪತ್ತೆಸಂದರ್ಭ ಮತ್ತು ಪ್ರಸ್ತುತ ಪಾಲನೆ ಇನ್ನೂ ಪರಿಶೀಲನಾ ಹಂತಗಳಾಗಿವೆ.'),
  citations:[c('src-ei-vol-9-alupa-udiyavara','Vol. IX, article on the archaic Kanarese Alupa pillar inscriptions at Udiyavara; match inscription numbers, pages and plates')]
})

const reign=(id,en,kn,polityId,rulerIds,capitalIds,from,to,sourceId,locator)=>({id:`reign-${id}`,name:n(en,kn),periodType:'reign',polityId,rulerIds,capitalIds,date:d(from,to,'circa'),description:n('A reign-level comparison anchor linking accession, political centres, inscriptions and territorial evidence.','ಅಧಿಕಾರಾರೋಹಣ, ರಾಜಕೀಯ ಕೇಂದ್ರಗಳು, ಶಾಸನಗಳು ಮತ್ತು ಭೂವ್ಯಾಪ್ತಿ ಸಾಕ್ಷ್ಯವನ್ನು ಜೋಡಿಸುವ ಆಳ್ವಿಕೆಮಟ್ಟದ ಹೋಲಿಕೆ ಸೂಚಕ.'),citations:[c(sourceId,locator)],review:{...review}})
export const v022Reigns=[
  reign('mayurasharma-kadamba','Reign of Mayurasharma, c. 345–365','ಮಯೂರಶರ್ಮನ ಆಳ್ವಿಕೆ, ಸು. 345–365','polity-kadamba',['person-mayurasharma'],['place-banavasi'],345,365,'src-asi-classical-age','Kadamba foundation and Mayurasharma chronology; verify against Talagunda edition'),
  reign('kakusthavarma-kadamba','Reign of Kakusthavarma, c. 435–455','ಕಾಕುಸ್ಥವರ್ಮನ ಆಳ್ವಿಕೆ, ಸು. 435–455','polity-kadamba',['person-kakusthavarma'],['place-banavasi'],435,455,'src-epigraphia-carnatica','Talagunda genealogy and Kakusthavarma context'),
  reign('durvinita-western-ganga','Reign of Durvinita, c. 529–579','ದುರ್ವಿನೀತನ ಆಳ್ವಿಕೆ, ಸು. 529–579','polity-western-ganga',['person-durvinita'],['place-talakad'],529,579,'src-asi-classical-age','Western Ganga chronology and Durvinita; inscription-level review pending'),
  reign('sripurusha-western-ganga','Reign of Sripurusha, c. 726–788','ಶ್ರೀಪುರುಷನ ಆಳ್ವಿಕೆ, ಸು. 726–788','polity-western-ganga',['person-sripurusha'],['place-talakad'],726,788,'src-epigraphia-carnatica','Western Ganga records of Sripurusha; item locators pending'),
  reign('tailapa-ii-kalyani-chalukya','Reign of Tailapa II, c. 973–997','ಎರಡನೇ ತೈಲಪನ ಆಳ್ವಿಕೆ, ಸು. 973–997','polity-kalyani-chalukya',['person-tailapa-ii'],['place-kalyani'],973,997,'src-asi-early-history','Later Chalukya restoration under Tailapa II'),
  reign('someshvara-i-kalyani-chalukya','Reign of Someshvara I, c. 1042–1068','ಮೊದಲ ಸೋಮೇಶ್ವರನ ಆಳ್ವಿಕೆ, ಸು. 1042–1068','polity-kalyani-chalukya',['person-someshvara-i'],['place-kalyani'],1042,1068,'src-asi-early-history','Kalyani Chalukya political chronology'),
  reign('vikramaditya-vi-kalyani-chalukya','Reign of Vikramaditya VI, 1076–1126','ಆರನೇ ವಿಕ್ರಮಾದಿತ್ಯನ ಆಳ್ವಿಕೆ, 1076–1126','polity-kalyani-chalukya',['person-vikramaditya-vi'],['place-kalyani'],1076,1126,'src-karnataka-tourism-lakkundi','Kalyani Chalukya period and Lakkundi context; reign dates require inscriptional locator')
]

export const v022GovernancePhases=[
  {id:'external-governance-keladi-ikkeri-nayaka',name:n('Keladi–Ikkeri Nayaka regional governance','ಕೆಳದಿ–ಇಕ್ಕೇರಿ ನಾಯಕರ ಪ್ರಾದೇಶಿಕ ಆಡಳಿತ'),type:'external-governance',governanceKind:'regional-successor-state',governingPolityId:'external-polity-keladi-nayaka',governanceType:'regional-direct-administration',date:d(1499,1763,'range'),capitalName:n('Keladi, later Ikkeri','ಕೆಳದಿ, ನಂತರ ಇಕ್ಕೇರಿ'),color:'#6b7845',geography:{scope:n('Malnad and changing coastal–interior domains','ಮಲೆನಾಡು ಮತ್ತು ಬದಲಾಗುವ ಕರಾವಳಿ–ಒಳನಾಡು ಪ್ರದೇಶಗಳು'),geometry:{type:'Polygon',coordinates:[[74.45,13.2],[75.8,13.2],[75.9,14.7],[74.4,14.7]],precision:'schematic'},confidence:'low'},description:n('A governance study area, not a fixed frontier; capital moves, provincial authority and coastal control require dated source layers.','ಇದು ಸ್ಥಿರ ಗಡಿಯಲ್ಲ, ಆಡಳಿತ ಅಧ್ಯಯನ ವಲಯ; ರಾಜಧಾನಿ ಬದಲಾವಣೆ, ಪ್ರಾಂತೀಯ ಅಧಿಕಾರ ಮತ್ತು ಕರಾವಳಿ ನಿಯಂತ್ರಣಕ್ಕೆ ದಿನಾಂಕಿತ ಆಕರ ಪದರಗಳು ಬೇಕು.'),relatedEventIds:['event-keladi-nayaka-governance'],relatedRelationIds:[],relatedExtentIds:[],interpretation:n('Shown as a Karnataka regional state rather than an external empire.','ಬಾಹ್ಯ ಸಾಮ್ರಾಜ್ಯದ ಬದಲು ಕರ್ನಾಟಕದ ಪ್ರಾದೇಶಿಕ ರಾಜ್ಯವಾಗಿ ತೋರಿಸಲಾಗಿದೆ.'),citations:[c('src-gazetteer-karnataka-1983','Shivamogga district: Keladi–Ikkeri political history')],review:{...review}},
  {id:'external-governance-chitradurga-nayaka',name:n('Chitradurga Nayaka regional governance','ಚಿತ್ರದುರ್ಗ ನಾಯಕರ ಪ್ರಾದೇಶಿಕ ಆಡಳಿತ'),type:'external-governance',governanceKind:'regional-successor-state',governingPolityId:'external-polity-chitradurga-nayaka',governanceType:'fort-centred-regional-administration',date:d(1588,1779,'range'),capitalName:n('Chitradurga','ಚಿತ್ರದುರ್ಗ'),color:'#a06735',geography:{scope:n('Fort-centred domains in central Karnataka','ಮಧ್ಯ ಕರ್ನಾಟಕದ ಕೋಟೆ ಕೇಂದ್ರಿತ ಪ್ರದೇಶಗಳು'),geometry:{type:'Polygon',coordinates:[[75.6,13.6],[77.1,13.6],[77.2,15.1],[75.5,15.1]],precision:'schematic'},confidence:'low'},description:n('A provisional governance envelope for the Nayaka state; village-level authority and changing dependencies remain to be reconstructed.','ನಾಯಕ ರಾಜ್ಯದ ತಾತ್ಕಾಲಿಕ ಆಡಳಿತ ವ್ಯಾಪ್ತಿ; ಗ್ರಾಮಮಟ್ಟದ ಅಧಿಕಾರ ಮತ್ತು ಬದಲಾಗುವ ಅಧೀನತೆಯನ್ನು ಇನ್ನೂ ಪುನರ್-ರಚಿಸಬೇಕು.'),relatedEventIds:['event-chitradurga-nayaka-governance'],relatedRelationIds:[],relatedExtentIds:[],interpretation:n('The polygon is a research envelope and must not be read as a surveyed boundary.','ಬಹುಭುಜವು ಸಂಶೋಧನಾ ವ್ಯಾಪ್ತಿ; ಸಮೀಕ್ಷಿತ ಗಡಿಯಾಗಿ ಓದಬಾರದು.'),citations:[c('src-karnataka-tourism-chitradurga','Chitradurga Fort and Nayaka context'),c('src-gazetteer-karnataka-1983','Chitradurga district historical chapter')],review:{...review}}
]
v022GovernancePhases.forEach(item=>{item.governanceType='direct-administration'})
v022GovernancePhases[0].citations.push(c('src-karnataka-tourism-keladi','Keladi as the first capital; Ikkeri sequence remains gazetteer-led'))
v022GovernancePhases[1].citations.push(c('src-karnataka-gazetteer-chitradurga-1965','Chapter II: History; Nayaka/Paleyagar governance and fort-centred political context'))

const rulerSourceByPolity={
  'polity-kadamba':['src-epigraphia-carnatica','Talagunda inscription and Kadamba genealogy'],
  'polity-western-ganga':['src-epigraphia-carnatica','Western Ganga inscription corpus; ruler-specific item locator queued'],
  'polity-badami-chalukya':['src-maharashtra-gazetteer-chalukyas','Early Chalukya ruler sequence and political history'],
  'polity-rashtrakuta':['src-asi-rashtrakutas','Rashtrakuta ruler chronology and political history'],
  'polity-kalyani-chalukya':['src-asi-early-history','Later Chalukya ruler chronology; inscription-level locator queued'],
  'polity-hoysala':['src-unesco-hoysala-dossier','Hoysala ruler, capital and patronage context'],
  'polity-vijayanagara':['src-unesco-hampi','Vijayanagara ruler and capital history'],
  'polity-mysore':['src-asi-mysore-city','Mysore ruler and capital chronology']
}

const witnessUpdates={
  'work-kavirajamarga':{sourceId:'src-cesck-kavirajamarga',locator:'Publishing history: K. B. Pathak (1898), K. Krishnamurthy (1983), M. V. Seetharamaiah (1994)',witness:'Published editions from 1898 onward; manuscript repository still unresolved'},
  'work-vikramarjuna-vijaya':{sourceId:'src-cesck-adipurana',locator:'Pampa work-and-edition context; locate the separate Vikramarjuna Vijaya catalogue entry',witness:'Pampa edition context located; exact Vikramarjuna Vijaya witness remains provisional'},
  'work-adipurana':{sourceId:'src-cesck-adipurana',locator:'Palm-leaf and paper manuscripts; first publication 1900 by S. G. Narasimhachar; later editions listed',witness:'Palm-leaf and paper manuscripts; 1900 Government Oriental Library edition'},
  'work-gadayuddha':{sourceId:'src-routledge-gadayuddham',locator:'2021 critical English translation; editors identify Kannada textual witnesses consulted',witness:'Routledge 2021 edited translation and textual witness discussion'},
  'work-vaddaradhane':{sourceId:'src-cesck-vaddaradhane',locator:'Seven palm-leaf manuscripts; 1434 witness; complete text edited by D. L. Narasimhachar, 1949',witness:'Seven palm-leaf manuscripts including a 1434 witness; 1949 complete edition'}
}
witnessUpdates['work-vikramarjuna-vijaya']={sourceId:'src-cesck-vikramarjuna-vijaya',locator:'Palm-leaf and paper manuscripts; B. L. Rice, Bibliotheca Carnatica first publication, 1902; later editions listed',witness:'Palm-leaf and paper manuscripts; 1902 Bibliotheca Carnatica edition by B. L. Rice'}

const territorialReplacements={
  'extent-kadamba-core-prototype':['src-karnataka-tourism-banavasi','Banavasi capital and Kadamba heartland; envelope is still schematic'],
  'extent-western-ganga-core-prototype':['src-epigraphia-carnatica','Western Ganga inscription distribution and Talakad-centred core; district reconstruction pending'],
  'extent-hoysala-ballala-ii-1187':['src-unesco-hoysala-dossier','Nomination dossier: largest extent under Ballala II and royal centres'],
  'extent-vijayanagara-krishnadevaraya-core-1520':['src-unesco-hampi','Hampi dossier: imperial apogee under Krishnadevaraya; polygon remains interpretive']
}

export function applyResearchWaveV022(atlasData,appendUniqueById){
  appendUniqueById(atlasData.sources,v022Sources)
  appendUniqueById(atlasData.places,v022Places)
  appendUniqueById(atlasData.polities,v022Polities)
  appendUniqueById(atlasData.externalPolities,v022ExternalPolities)
  appendUniqueById(atlasData.events,v022Events)
  appendUniqueById(atlasData.inscriptions,v022Inscriptions)
  appendUniqueById(atlasData.reigns,v022Reigns)
  appendUniqueById(atlasData.externalGovernancePhases,v022GovernancePhases)

  atlasData.people.forEach(person=>{
    if((person.citations||[]).length) return
    const source=rulerSourceByPolity[person.polityId]
    if(source) person.citations=[c(source[0],source[1])]
  })

  Object.entries(territorialReplacements).forEach(([id,[sourceId,locator]])=>{
    const extent=atlasData.territorialExtents.find(item=>item.id===id)
    if(!extent)return
    extent.confidence='medium'
    extent.snapshotKind='prototype'
    extent.citations=[c(sourceId,locator),c('src-prototype-boundaries','Geometry retained as a visibly schematic comparison envelope')]
    extent.description=n(`${extent.description.en} The historical scope is now source-backed, while the drawn perimeter remains explicitly schematic.`,`${extent.description.kn} ಐತಿಹಾಸಿಕ ವ್ಯಾಪ್ತಿಗೆ ಈಗ ಆಕರದ ಬೆಂಬಲವಿದೆ; ಚಿತ್ರಿತ ಪರಿಧಿ ಇನ್ನೂ ಸ್ಪಷ್ಟವಾಗಿ ಅಂದಾಜಿನದ್ದಾಗಿದೆ.`)
  })

  Object.entries(witnessUpdates).forEach(([id,witness])=>{
    const work=atlasData.works.find(item=>item.id===id)
    if(!work?.reviewWorkflow)return
    if(!(work.citations||[]).some(item=>item.sourceId===witness.sourceId))work.citations.push(c(witness.sourceId,witness.locator))
    work.editionWitnesses=[{type:'edition-or-manuscript-witness',description:n(witness.witness,witness.witness),sourceId:witness.sourceId,locator:witness.locator,status:'located'}]
    work.reviewWorkflow.evidence.itemCitation={status:'located',note:n('An item-level scholarly record or published edition locator is attached; reviewer verification remains required.','ಕೃತಿ-ಮಟ್ಟದ ಸಂಶೋಧನಾ ದಾಖಲೆ ಅಥವಾ ಪ್ರಕಟಿತ ಆವೃತ್ತಿ ಸ್ಥಳಸೂಚಿ ಜೋಡಿಸಲಾಗಿದೆ; ಪರಿಶೀಲಕರ ದೃಢೀಕರಣ ಇನ್ನೂ ಅಗತ್ಯ.')}
    work.reviewWorkflow.evidence.editionWitness={status:'located',note:n(witness.witness,witness.witness)}
    work.reviewWorkflow.completedEvidence=[...new Set([...(work.reviewWorkflow.completedEvidence||[]),'itemCitation','editionWitness'])]
    // “Located” improves the packet but does not satisfy publication review.
    // Retain both blockers and their structured evidence requests until an
    // independent reviewer changes the gate itself to verified.
  })

  const covered=new Set(atlasData.districtHistoryResearch.filter(item=>item.recordKind==='candidate').map(item=>item.districtId))
  const packets=atlasData.heritageAudits.filter(audit=>audit.id!=='audit-cross-border-kannada'&&!covered.has(audit.id)).map(audit=>{
    const site=audit.prioritySites.find(item=>item.verification?.coordinates)||audit.prioritySites[0]
    const point=site?.verification?.coordinates
    return {id:`district-history-v022-${audit.id.replace('audit-','')}`,recordKind:'candidate',districtId:audit.id,district:audit.district,name:n(`${site?.name?.en||audit.district.en} district-history packet`,`${site?.name?.kn||audit.district.kn} ಜಿಲ್ಲಾ ಇತಿಹಾಸ ಪ್ಯಾಕೆಟ್`),category:site?.category==='fort'?'regional-memory':site?.category==='palace-civic-architecture'?'urban-foundation':'settlement-origin',date:site?.verification?.constructionPhases?.[0]?.date||d(null,null,'unknown'),location:point?{type:'Point',coordinates:[point.longitude,point.latitude],precision:point.precision==='point'||point.precision==='site'?'approximate':'approximate'}:null,description:n(`Candidate packet linking ${site?.name?.en||'the district priority site'} to settlement, governance, inscription and material-history questions.`,`ವಸತಿ, ಆಡಳಿತ, ಶಾಸನ ಮತ್ತು ವಸ್ತು ಇತಿಹಾಸದ ಪ್ರಶ್ನೆಗಳಿಗೆ ${site?.name?.kn||'ಜಿಲ್ಲಾ ಆದ್ಯತಾ ತಾಣ'}ವನ್ನು ಜೋಡಿಸುವ ಅಭ್ಯರ್ಥಿ ಪ್ಯಾಕೆಟ್.`),researchNote:n('Retains the existing audit provenance. Promote only after an authority record, dated evidence, present condition and site-level citation are matched.','ಈಗಿರುವ ಪರಿಶೀಲನಾ ಮೂಲವನ್ನು ಉಳಿಸಲಾಗಿದೆ. ಪ್ರಾಧಿಕಾರ ದಾಖಲೆ, ದಿನಾಂಕಿತ ಸಾಕ್ಷ್ಯ, ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ ಮತ್ತು ತಾಣಮಟ್ಟದ ಉಲ್ಲೇಖ ಹೊಂದಿಸಿದ ನಂತರ ಮಾತ್ರ ಉತ್ತೇಜಿಸಿ.'),evidenceBasis:'district-research-scope',citations:[c('src-v022-district-audit-provenance',`${audit.id} / ${site?.id||'priority site'}; see embedded audit citations and coordinate source`)],review:{...review}}
  })
  appendUniqueById(atlasData.districtHistoryResearch,packets)
}
