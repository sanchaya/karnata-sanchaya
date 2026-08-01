const n=(en,kn)=>({en,kn})
const d=(from,to=from,precision='circa')=>({from,to,era:'CE',precision})
const c=(sourceId,locator)=>({sourceId,locator})
const review={status:'needs-review',reviewer:null,updatedAt:'2026-08-01'}

export const communityPeopleSources=[
  {id:'src-karnataka-tourism-onake-obavva',type:'government-tourism',title:n('Chitradurga Fort: Onake Obavva and the fort-defence tradition','ಚಿತ್ರದುರ್ಗ ಕೋಟೆ: ಒನಕೆ ಓಬವ್ವ ಮತ್ತು ಕೋಟೆ ರಕ್ಷಣೆಯ ಪರಂಪರೆ'),authors:['Karnataka Tourism, Government of Karnataka'],year:2026,url:'https://karnatakatourism.org/en/attractions/chitradurga-fort',review:{...review,status:'reviewed'}},
  {id:'src-pib-kittur-chennamma-network',type:'government-biographical-essay',title:n('Rani Chennamma of Kitturu','ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ'),authors:['Press Information Bureau, Government of India'],year:2016,url:'https://www.pib.gov.in/newsite/printrelease.aspx?lang=2&reg=48&relid=148944',review:{...review,status:'reviewed'}},
  {id:'src-amrit-sangolli-rayanna',type:'government-biographical-record',title:n('Sangolli Rayanna — Unsung Heroes of India','ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ — ಭಾರತದ ಅನಾಮಧೇಯ ವೀರರು'),authors:['Azadi Ka Amrit Mahotsav, Ministry of Culture, Government of India'],year:2021,url:'https://amritmahotsav.nic.in/unsung-heroes-detail.htm?217=',review:{...review,status:'reviewed'}},
]

export const communityPeoplePolities=[
  {id:'external-polity-kittur',name:n('Kittur Desai state','ಕಿತ್ತೂರು ದೇಸಾಯಿ ಸಂಸ್ಥಾನ'),type:'regional-polity',citations:[c('src-pib-kittur-chennamma-network','Kittur polity and 1824 resistance context')],review},
]

export const communityPeoplePlaces=[
  {id:'place-kittur',name:n('Kittur','ಕಿತ್ತೂರು'),kind:'fort-settlement',location:{type:'Point',coordinates:[74.917,15.600],precision:'approximate'},citations:[c('src-pib-kittur-chennamma-network','Kittur conflict location; coordinate requires authority match')],review},
  {id:'place-nandagad',name:n('Nandagad','ನಂದಗಡ'),kind:'settlement',location:{type:'Point',coordinates:[74.590,15.775],precision:'approximate'},citations:[c('src-amrit-sangolli-rayanna','Nandagad operations and execution site; coordinate requires authority match')],review},
  {id:'place-basavakalyana-community',name:n('Basavakalyana','ಬಸವಕಲ್ಯಾಣ'),kind:'religious-literary-centre',location:{type:'Point',coordinates:[76.949,17.872],precision:'approximate'},citations:[c('src-sahitya-akademi-basaveshwara','Vachana movement and occupational community context')],review},
]

const person=(id,en,kn,roles,date,polityId,sourceId,locator,gender)=>({
  id:`person-${id}`,name:n(en,kn),roles,date,polityId,...(gender?{gender}:{}),citations:[c(sourceId,locator)],review:{...review}
})

export const communityPeople=[
  person('onake-obavva','Onake Obavva','ಒನಕೆ ಓಬವ್ವ',['community-hero','defender'],d(1779,1779,'circa'),'external-polity-chitradurga-nayaka','src-karnataka-tourism-onake-obavva','Named fort defender; exact event date and biographical chronology require specialist review','woman'),
  person('kittur-chennamma','Kittur Rani Chennamma','ಕಿತ್ತೂರು ರಾಣಿ ಚೆನ್ನಮ್ಮ',['queen','resistance-leader'],d(1778,1829,'range'),'external-polity-kittur','src-pib-kittur-chennamma-network','Queen of Kittur and leader of the 1824 armed resistance','woman'),
  person('sangolli-rayanna','Sangolli Rayanna','ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ',['community-leader','military-leader','resistance-fighter'],d(1798,1831,'range'),'external-polity-kittur','src-amrit-sangolli-rayanna','Kittur resistance organiser; operations and execution at Nandagad'),
  person('gurusiddappa-kittur','Gurusiddappa of Kittur','ಕಿತ್ತೂರಿನ ಗುರುಸಿದ್ದಪ್ಪ',['administrator','lieutenant','resistance-fighter'],d(1824,1824,'circa'),'external-polity-kittur','src-pib-kittur-chennamma-network','Named lieutenant in the Kittur resistance; full identity and chronology require review'),
  person('amatur-balappa','Amatur Balappa','ಅಮಟೂರು ಬಾಳಪ್ಪ',['soldier','lieutenant','resistance-fighter'],d(1824,1824,'circa'),'external-polity-kittur','src-pib-kittur-chennamma-network','Named Kittur lieutenant associated with the first battle; biography requires review'),
  person('madivala-machayya','Madivala Machayya','ಮಡಿವಾಳ ಮಾಚಯ್ಯ',['artisan','washerman','vachana-poet','religious-figure'],d(1160,1160,'circa'),'polity-kalyani-chalukya','src-sahitya-akademi-basaveshwara','Occupational Vachana participant; dates and individual corpus witnesses require review'),
  person('ambigara-chowdaiah','Ambigara Chowdaiah','ಅಂಬಿಗರ ಚೌಡಯ್ಯ',['boatman','vachana-poet','religious-figure'],d(1160,1160,'circa'),'polity-kalyani-chalukya','src-sahitya-akademi-basaveshwara','Occupational Vachana participant; dates and individual corpus witnesses require review'),
]

const event=(id,name,date,coordinates,summary,participants,peopleIds,sourceId,locator,options={})=>({
  id:`event-${id}`,name,date,type:options.type||'political-development',location:{type:'Point',coordinates,precision:'approximate'},summary,participants,peopleIds,originPlaceId:options.originPlaceId||null,destinationPlaceId:options.destinationPlaceId||null,route:options.route||null,timelineRelevance:'karnataka-context',citations:[c(sourceId,locator)],review:{...review}
})

export const communityPeopleEvents=[
  event('onake-obavva-fort-defence',n('Onake Obavva and the defence of Chitradurga Fort','ಒನಕೆ ಓಬವ್ವ ಮತ್ತು ಚಿತ್ರದುರ್ಗ ಕೋಟೆಯ ರಕ್ಷಣೆ'),d(1779,1779,'circa'),[76.398,14.215],n('Public memory identifies Obavva, a resident outside the royal elite, with the defence of a narrow fort passage during an invading attack. The exact chronology remains under review.','ರಾಜವರ್ಗದ ಹೊರಗಿನ ನಿವಾಸಿಯಾಗಿದ್ದ ಓಬವ್ವರನ್ನು ದಾಳಿಯ ಸಂದರ್ಭದಲ್ಲಿ ಕೋಟೆಯ ಕಿರಿದಾದ ದಾರಿಯನ್ನು ರಕ್ಷಿಸಿದ ಸ್ಮೃತಿಯೊಂದಿಗೆ ಗುರುತಿಸಲಾಗುತ್ತದೆ. ನಿಖರ ಕಾಲಕ್ರಮ ಇನ್ನೂ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ.'),[{polityId:'external-polity-chitradurga-nayaka',role:'defender',outcome:'community-defence'},{polityId:'polity-mysore',role:'attacking-power',outcome:'fort-campaign'}],['person-onake-obavva'],'src-karnataka-tourism-onake-obavva','Onake Obavva Kindi and the fort-defence account',{type:'invasion',destinationPlaceId:'place-chitradurga-fort'}),
  event('kittur-resistance-1824',n('Kittur resistance and its non-royal leadership network','ಕಿತ್ತೂರು ಪ್ರತಿರೋಧ ಮತ್ತು ಅದರ ರಾಜವರ್ಗೇತರ ನಾಯಕತ್ವ ಜಾಲ'),d(1824,1831,'range'),[74.917,15.600],n('The Kittur struggle connected Rani Chennamma with lieutenants, soldiers and community-supported resistance led subsequently by Sangolli Rayanna. Individual campaigns remain separated as research tasks.','ಕಿತ್ತೂರು ಹೋರಾಟವು ರಾಣಿ ಚೆನ್ನಮ್ಮರನ್ನು ಸೇನಾಧಿಕಾರಿಗಳು, ಸೈನಿಕರು ಮತ್ತು ನಂತರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ ನೇತೃತ್ವದ ಜನಬೆಂಬಲಿತ ಪ್ರತಿರೋಧದೊಂದಿಗೆ ಜೋಡಿಸಿತು. ಪ್ರತ್ಯೇಕ ದಂಡಯಾತ್ರೆಗಳು ಸಂಶೋಧನಾ ಕಾರ್ಯಗಳಾಗಿ ಉಳಿದಿವೆ.'),[{polityId:'external-polity-kittur',role:'resistance-polity',outcome:'defeat-and-continuing-resistance'},{polityId:'external-polity-british-east-india-company',role:'colonial-attacker',outcome:'annexation'}],['person-kittur-chennamma','person-sangolli-rayanna','person-gurusiddappa-kittur','person-amatur-balappa'],'src-pib-kittur-chennamma-network','1824 battles, named lieutenants and subsequent resistance; pair with archival Company records',{type:'war',originPlaceId:'place-kittur',destinationPlaceId:'place-nandagad',route:{type:'LineString',coordinates:[[74.917,15.600],[74.590,15.775]],precision:'schematic'}}),
  event('kayaka-vachana-occupational-voices',n('Occupational communities in the Vachana movement','ವಚನ ಚಳವಳಿಯ ಕಾಯಕ ಸಮುದಾಯಗಳು'),d(1160,1160,'circa'),[76.949,17.872],n('Named participants from working occupations used Vachana expression to articulate devotion, dignity of labour and social criticism. Individual dates and textual witnesses remain review tasks.','ಕಾಯಕ ವೃತ್ತಿಗಳಿಂದ ಬಂದ ಹೆಸರಾಂತ ಭಾಗವಹಿಸುವವರು ಭಕ್ತಿ, ಶ್ರಮದ ಘನತೆ ಮತ್ತು ಸಾಮಾಜಿಕ ವಿಮರ್ಶೆಯನ್ನು ವಚನಗಳ ಮೂಲಕ ವ್ಯಕ್ತಪಡಿಸಿದರು. ವೈಯಕ್ತಿಕ ದಿನಾಂಕಗಳು ಮತ್ತು ಪಠ್ಯ ಸಾಕ್ಷ್ಯಗಳು ಇನ್ನೂ ಪರಿಶೀಲನಾ ಕಾರ್ಯಗಳಾಗಿವೆ.'),[{polityId:'polity-kalyani-chalukya',role:'historical-context',outcome:'social-religious-movement'}],['person-madivala-machayya','person-ambigara-chowdaiah'],'src-sahitya-akademi-basaveshwara','Madivala Machayya, Ambigara Chowdaiah and occupational participation in the movement',{type:'cultural-contact',destinationPlaceId:'place-basavakalyana-community'}),
]
