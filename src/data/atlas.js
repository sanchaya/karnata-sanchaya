import { events, eventSources, externalPolities } from './events.js'
import { deepChronologies, districtHistoryResearch, heritageAudits } from './research.js'
import { additionalInscriptions, additionalWorks, districtInscriptionReviewPasses, inscriptionDistrictAssignments, inscriptionPlaces, literaryPeople, literatureEpigraphySources, priorityInscriptionCandidates } from './literature-inscriptions.js'
import { collaborations } from './collaborations.js'
import { politicalRelations, politicalRelationPeople, politicalRelationPolities, foreignPoliticalRelations } from './political-relations.js'
import { communityPeople, communityPeopleEvents, communityPeoplePlaces, communityPeoplePolities, communityPeopleSources } from './community-people.js'
import { foreignInscriptionSources, foreignInscriptionPlaces, foreignInscriptionPolities, foreignInscriptionPeople, foreignInscriptions } from './foreign-inscriptions.js'
import { offbeatHoysalaSources, offbeatHoysalaPlaces, offbeatHoysalaTemples } from './offbeat-hoysala-temples.js'
import { hoysalaTempleInventorySources, hoysalaTempleInventoryLeads } from './hoysala-temple-inventory.js'
import { wikipediaHeritageInventoryLeads, wikipediaHeritageSources, wikipediaTempleIndexSources, wikipediaTempleInventoryLeads } from './wikipedia-temple-indexes.js'
import { externalGovernancePhases } from './external-governance.js'
import { applyResearchWaveV022 } from './research-wave-v022.js'
import { mysuruHeritageBuildingLeads, mysuruHeritageBuildingSources } from './mysuru-heritage-buildings.js'
import { applyDistrictHeritageConnections } from './district-heritage-connections.js'
import { freedomFighterPeople, freedomFighterPolities, freedomFighterSources } from './freedom-fighters.js'
import { freedomMovementResearchSources } from './freedom-movement-research.js'
import { patrikaPeriodicals, patrikaMapSites } from './patrika-sanchaya.generated.js'
import { kingdomArtifacts } from './kingdom-artifacts.js'

const review = (status = 'draft') => ({ status, reviewer: null, updatedAt: '2026-07-26' })
const name = (en, kn) => ({ en, kn })
const dateRange = (from, to, precision = 'year') => ({ from, to, era: 'CE', precision })
const citation = (sourceId, locator = '') => ({ sourceId, locator })
const appendUniqueById = (target, items) => {
  const seen = new Set(target.map(item => item?.id).filter(Boolean))
  items.forEach(item => {
    if (!item?.id || seen.has(item.id)) return
    target.push(item)
    seen.add(item.id)
  })
}

export const atlasData = {
  meta: {
    schemaVersion: '0.26.0',
    title: name('Karnataka Historical Atlas', 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ'),
    exportedAt: null,
  },
  sources: [
    { id:'src-wikidata-people-candidate-audit', type:'linked-open-data-discovery', title:name('Wikidata people born in present-day Karnataka — Atlas v0.25 candidate audit','ಇಂದಿನ ಕರ್ನಾಟಕದಲ್ಲಿ ಜನಿಸಿದ ವ್ಯಕ್ತಿಗಳ ವಿಕಿಡೇಟಾ — Atlas v0.25 ಅಭ್ಯರ್ಥಿ ಪರಿಶೀಲನೆ'), authors:['Wikidata contributors','Karnataka Historical Atlas research team'], year:2026, url:'https://query.wikidata.org/', scope:name('Discovery-only identity, occupation and birthplace statements. Every biography, Karnataka/Kannada connection, contribution, image licence and bilingual name requires independent source review before promotion.','ಗುರುತು, ವೃತ್ತಿ ಮತ್ತು ಜನ್ಮಸ್ಥಳದ ಅನ್ವೇಷಣಾ ಸುಳಿವುಗಳು ಮಾತ್ರ. ಉತ್ತೇಜನಕ್ಕೂ ಮೊದಲು ಪ್ರತಿಯೊಂದು ಜೀವನಚರಿತ್ರೆ, ಕರ್ನಾಟಕ/ಕನ್ನಡ ಸಂಬಂಧ, ಕೊಡುಗೆ, ಚಿತ್ರದ ಪರವಾನಗಿ ಮತ್ತು ದ್ವಿಭಾಷಾ ಹೆಸರಿಗೆ ಸ್ವತಂತ್ರ ಆಕರ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'), review:review('reviewed') },
    { id: 'src-epigraphia-indica', type: 'series', title: name('Epigraphia Indica', 'ಎಪಿಗ್ರಾಫಿಯಾ ಇಂಡಿಕಾ'), authors: ['Archaeological Survey of India and predecessor survey institutions'], year: 1892, url: 'https://onlinebooks.library.upenn.edu/webbin/serial?id=epigraphindica', scope: name('Inscription series to be searched for item-level editions, facsimiles, transliterations and translations; volume and page locators are required before promotion.', 'ವಸ್ತುಮಟ್ಟದ ಆವೃತ್ತಿ, ಪ್ರತಿಚಿತ್ರ, ಲಿಪ್ಯಂತರ ಮತ್ತು ಅನುವಾದಗಳಿಗಾಗಿ ಹುಡುಕಬೇಕಾದ ಶಾಸನ ಸರಣಿ; ಉತ್ತೇಜನಕ್ಕೂ ಮೊದಲು ಸಂಪುಟ ಮತ್ತು ಪುಟ ಸ್ಥಾನಸೂಚಿ ಅಗತ್ಯ.'), review: review('reviewed') },
    { id: 'src-maharashtra-gazetteer-maratha-period', type: 'government-gazetteer', title: name('Sangli Gazetteer: Maratha period and Nargund operations', 'ಸಾಂಗ್ಲಿ ಗೆಜೆಟಿಯರ್: ಮರಾಠ ಕಾಲ ಮತ್ತು ನರಗುಂದ ಕಾರ್ಯಾಚರಣೆಗಳು'), authors: ['Gazetteers Department, Government of Maharashtra'], year: null, url: 'https://gazetteers.maharashtra.gov.in/cultural.maharashtra.gov.in/english/gazetteer/SANGLI/his_maratha%20period.html', review: review('needs-review') },
    { id: 'src-dharwar-district-gazetteer', type: 'government-gazetteer', title: name('Dharwar District Gazetteer: siege and frontier history', 'ಧಾರವಾಡ ಜಿಲ್ಲಾ ಗೆಜೆಟಿಯರ್: ಮುತ್ತಿಗೆ ಮತ್ತು ಗಡಿ ಇತಿಹಾಸ'), authors: ['Government of Bombay'], year: 1884, url: 'https://dspace.gipe.ac.in/xmlui/bitstream/handle/10973/26031/GIPE-076537.pdf?isAllowed=y&sequence=3', review: review('needs-review') },
    { id: 'src-majumdar-vedic-age', type: 'book', title: name('The History and Culture of the Indian People, Vol. I: The Vedic Age', 'ದಿ ಹಿಸ್ಟರಿ ಅಂಡ್ ಕಲ್ಚರ್ ಆಫ್ ದ ಇಂಡಿಯನ್ ಪೀಪಲ್, ಸಂಪುಟ I: ದಿ ವೈದಿಕ ಏಜ್'), authors: ['R. C. Majumdar (ed.)'], year: 1951, url: 'https://archive.org/details/the-history-and-culture-of-the-indian-people-11-vol.-set-by-r.-c.-majumdar-j.-n.', review: review('needs-review') },
    { id: 'src-vedic-heritage-portal', type: 'government-portal', title: name('Vedic Heritage Portal', 'ವೈದಿಕ ಪರಂಪರೆ ಪೋರ್ಟಲ್'), authors: ['Indira Gandhi National Centre for the Arts, Ministry of Culture'], year: null, url: 'https://vedicheritage.gov.in/', review: review('reviewed') },
    { id: 'src-karnataka-tourism-heritage', type: 'government-web', title: name('Karnataka heritage sites index', 'ಕರ್ನಾಟಕ ಪರಂಪರೆ ತಾಣಗಳ ಸೂಚಿ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/en/destinations/heritage-sites/?type%5B%5D=experience', review: review('reviewed') },
    { id: 'src-user-infographic-bengaluru-age', type: 'discovery-lead', title: name('Bengaluru in Numbers (2026) locality-age infographic — contributor-supplied discovery lead', 'ಬೆಂಗಳೂರು ಇನ್ ನಂಬರ್ಸ್ (2026) ಸ್ಥಳೀಯ ವಯಸ್ಸಿನ ಇನ್ಫೋಗ್ರಾಫಿಕ್ — ಕೊಡುಗೆದಾರ ಒದಗಿಸಿದ ಅನ್ವೇಷಣಾ ಸುಳಿವು'), authors: ['Project contributor'], year: 2026, url: '', scope: name('Not an authority source. Used only to queue locality-history questions for independent archival and archaeological verification.', 'ಇದು ಅಧಿಕಾರಿಕ ಆಕರವಲ್ಲ. ಸ್ವತಂತ್ರ ಆರ್ಕೈವ್ ಮತ್ತು ಪುರಾತತ್ತ್ವ ಪರಿಶೀಲನೆಗಾಗಿ ಸ್ಥಳೀಯ ಇತಿಹಾಸದ ಪ್ರಶ್ನೆಗಳನ್ನು ಸರದಿಗೆ ಸೇರಿಸಲು ಮಾತ್ರ ಬಳಕೆ.'), review: review('needs-review') },
    { id: 'src-gazetteer-karnataka-1983', type: 'book', title: name('Karnataka State Gazetteer', 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಗೆಜೆಟಿಯರ್'), authors: ['Government of Karnataka'], year: 1983, url: '', review: review('needs-review') },
    { id: 'src-epigraphia-carnatica', type: 'series', title: name('Epigraphia Carnatica', 'ಎಪಿಗ್ರಾಫಿಯಾ ಕರ್ನಾಟಕ'), authors: ['B. Lewis Rice et al.'], year: 1886, url: '', review: review('needs-review') },
    { id: 'src-prototype-boundaries', type: 'dataset', title: name('Atlas prototype reconstructed boundaries', 'ಭೂಪಟದ ಪ್ರಾಯೋಗಿಕ ಪುನರ್-ರಚಿತ ಗಡಿಗಳು'), authors: ['Karnataka Historical Atlas contributors'], year: 2026, url: '', review: review('draft') },
    { id: 'src-cambridge-raichur-1520', type: 'article', title: name('Firearms, Diplomacy, and the Battle for Raichur, 1520', 'ಬಂದೂಕುಗಳು, ರಾಜತಾಂತ್ರಿಕತೆ ಮತ್ತು ರಾಯಚೂರು ಯುದ್ಧ, 1520'), authors: ['Richard M. Eaton'], year: 2009, url: 'https://www.cambridge.org/core/journals/modern-asian-studies/article/abs/kiss-my-foot-said-the-king-firearms-diplomacy-and-the-battle-for-raichur-1520/C1119D2078354BEEC93D5F35517A700F', review: review('needs-review') },
    { id: 'src-inflibnet-cholas', type: 'learning-resource', title: name('The Cholas: political and administrative history', 'ಚೋಳರು: ರಾಜಕೀಯ ಮತ್ತು ಆಡಳಿತ ಇತಿಹಾಸ'), authors: ['INFLIBNET Centre'], year: null, url: 'https://ebooks.inflibnet.ac.in/icp01/chapter/the-cholas/', review: review('needs-review') },
    { id: 'src-cambridge-vijayanagara-conclusion', type: 'book-chapter', title: name('Vijayanagara: Conclusion', 'ವಿಜಯನಗರ: ಸಮಾರೋಪ'), authors: ['Burton Stein'], year: 1990, url: 'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/0B0B4FD770121EB8C053C6CAC9348F56/9781139055611c6_p140-146_CBO.pdf/conclusion.pdf', review: review('needs-review') },
    { id: 'src-unesco-hampi', type: 'heritage-record', title: name('Group of Monuments at Hampi', 'ಹಂಪಿಯ ಸ್ಮಾರಕಗಳ ಸಮೂಹ'), authors: ['UNESCO World Heritage Centre'], year: null, url: 'https://whc.unesco.org/en/list/241', review: review('reviewed') },
    { id: 'src-cambridge-deccan-courts', type: 'book-excerpt', title: name('The Courts of the Deccan Sultanates', 'ದಖ್ಖನ್ ಸುಲ್ತಾನರ ಆಸ್ಥಾನಗಳು'), authors: ['Emma J. Flatt'], year: 2019, url: 'https://assets.cambridge.org/97811084/81939/excerpt/9781108481939_excerpt.pdf', review: review('needs-review') },
    { id: 'src-maharashtra-gazetteer-chalukyas', type: 'gazetteer', title: name('Early Chalukyas of Vatapi', 'ವಾತಾಪಿಯ ಆರಂಭಿಕ ಚಾಲುಕ್ಯರು'), authors: ['Gazetteers Department, Government of Maharashtra'], year: null, url: 'https://gazetteers.maharashtra.gov.in/cultural.maharashtra.gov.in/english/gazetteer/RATNAGIRI/his_chalukyas.html', review: review('reviewed') },
    { id: 'src-asi-rashtrakutas', type: 'book', title: name('History of the Rashtrakutas', 'ರಾಷ್ಟ್ರಕೂಟರ ಇತಿಹಾಸ'), authors: ['Archaeological Survey of India, Central Archaeological Library'], year: null, url: 'https://ignca.gov.in/Asi_data/73908.pdf', review: review('needs-review') },
    { id: 'src-unesco-hoysala-dossier', type: 'heritage-nomination', title: name('Sacred Ensembles of the Hoysalas: Nomination Dossier', 'ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮುಚ್ಚಯಗಳು: ನಾಮನಿರ್ದೇಶನ ದಾಖಲೆ'), authors: ['Government of India', 'UNESCO World Heritage Centre'], year: 2022, url: 'https://whc.unesco.org/document/192643', review: review('reviewed') },
    { id: 'src-unesco-srirangapatna', type: 'heritage-record', title: name('Monuments of Srirangapatna Island Town', 'ಶ್ರೀರಂಗಪಟ್ಟಣ ದ್ವೀಪನಗರದ ಸ್ಮಾರಕಗಳು'), authors: ['UNESCO World Heritage Centre'], year: 2014, url: 'https://whc.unesco.org/en/tentativelists/5895/', review: review('reviewed') },
    { id: 'src-asi-mysore-city', type: 'gazetteer', title: name('Mysore City', 'ಮೈಸೂರು ನಗರ'), authors: ['Archaeological Survey of India, Central Archaeological Library'], year: null, url: 'https://ignca.gov.in/Asi_data/4974.pdf', review: review('needs-review') },
    { id: 'src-unesco-pattadakal', type: 'heritage-record', title: name('Group of Monuments at Pattadakal', 'ಪಟ್ಟದಕಲ್ಲಿನ ಸ್ಮಾರಕಗಳ ಸಮೂಹ'), authors: ['UNESCO World Heritage Centre'], year: null, url: 'https://whc.unesco.org/en/list/239/', review: review('reviewed') },
    { id: 'src-unesco-aihole-badami-pattadakal-tentative', type: 'heritage-geospatial-reference', title: name('Evolution of Temple Architecture: Aihole–Badami–Pattadakal', 'ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪದ ವಿಕಾಸ: ಐಹೊಳೆ–ಬಾದಾಮಿ–ಪಟ್ಟದಕಲ್ಲು'), authors: ['UNESCO World Heritage Centre'], year: 2015, url: 'https://whc.unesco.org/en/tentativelists/5972/', review: review('reviewed') },
    { id: 'src-unesco-hoysala-component-maps', type: 'heritage-geospatial-reference', title: name('Sacred Ensembles of the Hoysalas — component maps', 'ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮುಚ್ಚಯಗಳು — ಘಟಕ ನಕ್ಷೆಗಳು'), authors: ['UNESCO World Heritage Centre'], year: 2023, url: 'https://whc.unesco.org/en/list/1670/maps/', review: review('reviewed') },
    { id: 'src-asi-central-protected-monuments-karnataka-pdf', type: 'official-protection-register', title: name('Centrally Protected Monuments/Sites: Karnataka entries', 'ಕೇಂದ್ರ ಸಂರಕ್ಷಿತ ಸ್ಮಾರಕಗಳು/ತಾಣಗಳು: ಕರ್ನಾಟಕ ದಾಖಲೆಗಳು'), authors: ['Archaeological Survey of India'], year: 2025, url: 'https://asi.nic.in/pdf/CPM_List.pdf', review: review('reviewed') },
    { id: 'src-karnataka-tourism-talagunda', type: 'government-web', title: name('Talagunda and Shivamogga heritage discovery lead', 'ತಾಳಗುಂದ ಮತ್ತು ಶಿವಮೊಗ್ಗ ಪರಂಪರೆ ಪರಿಚಯ ಆಕರ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://old.karnatakatourism.org/tour-item/shivamogga/', review: review('needs-review') },
    { id: 'src-unesco-ellora', type: 'heritage-record', title: name('Ellora Caves', 'ಎಲ್ಲೋರ ಗುಹೆಗಳು'), authors: ['UNESCO World Heritage Centre'], year: null, url: 'https://whc.unesco.org/en/list/243/', review: review('reviewed') },
    { id: 'src-unesco-hampi-periodic-report', type: 'heritage-report', title: name('Periodic Report: Group of Monuments at Hampi', 'ಆವರ್ತಕ ವರದಿ: ಹಂಪಿಯ ಸ್ಮಾರಕಗಳ ಸಮೂಹ'), authors: ['UNESCO World Heritage Centre', 'Archaeological Survey of India'], year: 2003, url: 'https://whc.unesco.org/document/162842', review: review('reviewed') },
    { id: 'src-karnataka-tourism-dasara', type: 'government-web', title: name('Mysuru Dasara Festival – Nada Habba', 'ಮೈಸೂರು ದಸರಾ ಹಬ್ಬ – ನಾಡಹಬ್ಬ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/kn/events/mysuru-dasara-festival', review: review('reviewed') },
    { id: 'src-karnataka-tourism-banavasi', type: 'government-web', title: name('Banavasi: Karnataka’s timeless capital', 'ಬನವಾಸಿ: ಕರ್ನಾಟಕದ ಚಿರಂತನ ರಾಜಧಾನಿ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/en/destinations/banavasi', review: review('reviewed') },
    { id: 'src-karnataka-tourism-badami', type: 'government-web', title: name('Badami: the cradle of rock-cut grandeur', 'ಬಾದಾಮಿ: ಶಿಲಾ-ಕೊರೆತ ವೈಭವದ ತೊಟ್ಟಿಲು'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/en/destinations/badami', review: review('reviewed') },
    { id: 'src-karnataka-tourism-aihole', type: 'government-web', title: name('Aihole: ancient temples and architectural birthplace', 'ಐಹೊಳೆ: ಪ್ರಾಚೀನ ದೇವಾಲಯಗಳು ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪದ ಜನ್ಮಸ್ಥಳ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/kn/destinations/aihole', review: review('reviewed') },
    { id: 'src-karnataka-tourism-lakkundi', type: 'government-web', title: name('Lakkundi heritage revival', 'ಲಕ್ಕುಂಡಿ ಪರಂಪರೆ ಪುನರುಜ್ಜೀವನ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: 2026, url: 'https://karnatakatourism.org/en/news/lakkundi-heritage-revival', review: review('reviewed') },
    { id: 'src-karnataka-tourism-koppal', type: 'government-web', title: name('Koppal district heritage', 'ಕೊಪ್ಪಳ ಜಿಲ್ಲೆಯ ಪರಂಪರೆ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://old.karnatakatourism.org/tour-item/koppal/', review: review('reviewed') },
    { id: 'src-karnataka-tourism-srirangapatna-plan', type: 'government-report', title: name('Destination Development: Srirangapatna Town', 'ಪ್ರವಾಸಿ ತಾಣ ಅಭಿವೃದ್ಧಿ: ಶ್ರೀರಂಗಪಟ್ಟಣ ಪಟ್ಟಣ'), authors: ['Government of Karnataka', 'KTVG Initiative'], year: null, url: 'https://karnatakatourism.org/department/wp-content/uploads/2020/06/Destination-Development-Srirangapatna-Town-Mandya.pdf', review: review('reviewed') },
    { id: 'src-karnataka-tourism-daria-daulat', type: 'government-web', title: name("Tipu Sultan's Summer Palace", 'ಟಿಪ್ಪು ಸುಲ್ತಾನರ ಬೇಸಿಗೆ ಅರಮನೆ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://old.karnatakatourism.org/tour-item/tipu-sultans-summer-palace', review: review('reviewed') },
    { id: 'src-karnataka-tourism-mysuru-palace', type: 'government-web', title: name('Mysuru Palace', 'ಮೈಸೂರು ಅರಮನೆ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://old.karnatakatourism.org/tour-item/mysuru-palace/', review: review('reviewed') },
    { id: 'src-karnataka-tourism-kalaburagi', type: 'government-web', title: name('Kalaburagi heritage and Jama Masjid', 'ಕಲಬುರಗಿ ಪರಂಪರೆ ಮತ್ತು ಜಾಮಾ ಮಸೀದಿ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/en/destinations/kalaburagi/', review: review('reviewed') },
    { id: 'src-karnataka-tourism-bidar-madrasa', type: 'government-web', title: name('Mahmud Gawan Madrasa, Bidar', 'ಮಹಮೂದ್ ಗವಾನ್ ಮದರಸಾ, ಬೀದರ್'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/en/attractions/mohamud-gawan-madrasa-bidar', review: review('reviewed') },
    { id: 'src-karnataka-tourism-vijayapura', type: 'government-web', title: name('Vijayapura: Gol Gumbaz heritage', 'ವಿಜಯಪುರ: ಗೋಲ್ ಗುಂಬಜ್ ಪರಂಪರೆ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/en/destinations/vijayapura', review: review('reviewed') },
    { id: 'src-karnataka-tourism-chitradurga', type: 'government-web', title: name('Chitradurga Fort', 'ಚಿತ್ರದುರ್ಗ ಕೋಟೆ'), authors: ['Karnataka Tourism, Government of Karnataka'], year: null, url: 'https://karnatakatourism.org/en/attractions/chitradurga-fort', review: review('reviewed') },
    ...eventSources,
  ],
  periodicals: patrikaPeriodicals,
  periodicalMapSites: patrikaMapSites,
  artifacts: kingdomArtifacts,
  collaborations,
  districtHistoryResearch,
  externalPolities,
  events,
  places: [
    ['banavasi','Banavasi','ಬನವಾಸಿ',14.54,75.01],['talakad','Talakad','ತಲಕಾಡು',12.19,77.03],['badami','Vatapi (Badami)','ವಾತಾಪಿ (ಬಾದಾಮಿ)',15.92,75.68],
    ['manyakheta','Manyakheta','ಮಾನ್ಯಖೇಟ',17.17,77.29],['kalyani','Kalyani','ಕಲ್ಯಾಣಿ',17.86,76.95],['belur','Velapura (Belur)','ವೇಲಾಪುರ (ಬೇಲೂರು)',13.16,75.87],['halebidu','Dwarasamudra (Halebidu)','ದ್ವಾರಸಮುದ್ರ (ಹಳೇಬೀಡು)',13.22,75.99],
    ['hampi','Vijayanagara (Hampi)','ವಿಜಯನಗರ (ಹಂಪಿ)',15.34,76.46],['mysuru','Mysuru','ಮೈಸೂರು',12.31,76.65],['pattadakal','Pattadakal','ಪಟ್ಟದಕಲ್ಲು',15.95,75.82],['ellora','Ellora','ಎಲ್ಲೋರ',20.03,75.18],['somanathapura','Somanathapura','ಸೋಮನಾಥಪುರ',12.28,76.88],['talagunda','Talagunda','ತಾಳಗುಂದ',14.42,75.25],
    ['halmidi','Halmidi','ಹಲ್ಮಿಡಿ',13.18,75.86],['aihole','Aihole','ಐಹೊಳೆ',16.02,75.88],['shravanabelagola','Shravanabelagola','ಶ್ರವಣಬೆಳಗೊಳ',12.86,76.49],
    ['srirangapatna','Srirangapatna','ಶ್ರೀರಂಗಪಟ್ಟಣ',12.42,76.66],['mangaluru','Mangaluru','ಮಂಗಳೂರು',12.91,74.86],['bengaluru','Bengaluru','ಬೆಂಗಳೂರು',12.97,77.59],['penukonda','Penukonda','ಪೆನುಕೊಂಡ',14.08,77.59],['goa','Goa, Portuguese India','ಗೋವಾ, ಪೋರ್ಚುಗೀಸ್ ಭಾರತ',15.49,73.82,'historical-port'],['herat','Herat','ಹೆರಾತ್',34.35,62.20],['cairo','Cairo','ಕೈರೋ',30.04,31.24],['shiraz','Shiraz','ಶಿರಾಜ್',29.59,52.58],['istanbul','Istanbul','ಇಸ್ತಾಂಬುಲ್',41.01,28.98],['versailles','Versailles','ವರ್ಸೈಲ್ಸ್',48.80,2.13],['lobu-tua','Lobu Tua near Barus, Sumatra','ಸುಮಾತ್ರಾದ ಬರೂಸ್ ಸಮೀಪದ ಲೋಬು ತುವಾ',2.02,98.38,'historical-site'],
    ['badami-caves','Badami Cave Temples','ಬಾದಾಮಿ ಗುಹಾ ದೇವಾಲಯಗಳು',15.9187,75.6760,'monument'],['badami-bhutanatha','Bhutanatha Temple Group','ಭೂತನಾಥ ದೇವಾಲಯ ಸಮೂಹ',15.9157,75.6844,'monument'],
    ['aihole-durga','Durga Temple, Aihole','ಐಹೊಳೆಯ ದುರ್ಗಾ ದೇವಾಲಯ',16.0206,75.8814,'monument'],['aihole-meguti','Meguti Jain Temple','ಮೇಗುತಿ ಜೈನ ದೇವಾಲಯ',16.0225,75.8861,'monument'],
    ['lakkundi-kashivishveshvara','Kashivishveshvara Temple, Lakkundi','ಲಕ್ಕುಂಡಿಯ ಕಾಶಿವಿಶ್ವೇಶ್ವರ ದೇವಾಲಯ',15.3897,75.7187,'monument'],['lakkundi-brahma-jinalaya','Brahma Jinalaya, Lakkundi','ಲಕ್ಕುಂಡಿಯ ಬ್ರಹ್ಮ ಜಿನಾಲಯ',15.3906,75.7165,'monument'],['lakkundi-stepwell','Musukina Bavi, Lakkundi','ಲಕ್ಕುಂಡಿಯ ಮುಸುಕಿನ ಬಾವಿ',15.3916,75.7169,'monument'],['itagi-mahadeva','Mahadeva Temple, Itagi','ಇಟಗಿಯ ಮಹಾದೇವ ದೇವಾಲಯ',15.1078,75.9468,'monument'],
    ['hampi-vittala','Vittala Temple Complex','ವಿಠ್ಠಲ ದೇವಾಲಯ ಸಮುಚ್ಚಯ',15.3350,76.4754,'monument'],['hampi-lotus-mahal','Lotus Mahal','ಕಮಲ ಮಹಲ್',15.3188,76.4696,'monument'],['hampi-elephant-stables','Elephant Stables','ಆನೆ ಸಾಲುಮಂಟಪ',15.3173,76.4704,'monument'],['hampi-krishna-temple','Krishna Temple Complex','ಕೃಷ್ಣ ದೇವಾಲಯ ಸಮುಚ್ಚಯ',15.3262,76.4585,'monument'],
    ['srirangapatna-ranganathaswamy','Ranganathaswamy Temple','ರಂಗನಾಥಸ್ವಾಮಿ ದೇವಾಲಯ',12.4258,76.6792,'monument'],['srirangapatna-fort','Srirangapatna Fort','ಶ್ರೀರಂಗಪಟ್ಟಣ ಕೋಟೆ',12.4267,76.6799,'monument'],['daria-daulat','Daria Daulat Bagh','ದರಿಯಾ ದೌಲತ್ ಬಾಗ್',12.4237,76.6937,'monument'],['gumbaz-srirangapatna','Gumbaz, Srirangapatna','ಶ್ರೀರಂಗಪಟ್ಟಣದ ಗುಂಬಜ್',12.4102,76.7131,'monument'],['mysuru-palace','Mysuru Palace','ಮೈಸೂರು ಅರಮನೆ',12.3052,76.6552,'monument'],
    ['kalaburagi-jama-masjid','Jama Masjid, Kalaburagi','ಕಲಬುರಗಿಯ ಜಾಮಾ ಮಸೀದಿ',17.3381,76.8211,'monument'],['bidar-mahmud-gawan','Mahmud Gawan Madrasa','ಮಹಮೂದ್ ಗವಾನ್ ಮದರಸಾ',17.9140,77.5203,'monument'],['gol-gumbaz','Gol Gumbaz','ಗೋಲ್ ಗುಂಬಜ್',16.8305,75.7360,'monument'],['ibrahim-rauza','Ibrahim Rauza','ಇಬ್ರಾಹಿಂ ರೌಜಾ',16.8335,75.7178,'monument'],['chitradurga-fort','Chitradurga Fort','ಚಿತ್ರದುರ್ಗ ಕೋಟೆ',14.2154,76.3980,'monument']
  ].map(([id,en,kn,lat,lng,kind='settlement']) => ({ id:`place-${id}`, name:name(en,kn), kind, location:{ type:'Point', coordinates:[lng,lat], precision:'approximate' }, citations:[], review:review('needs-review') })),
  polities: [
    ['kadamba','Kadamba','ಕದಂಬ',345,540,'place-banavasi','#8d4d2f','An early indigenous dynasty of Karnataka, associated with Banavasi and the development of Kannada administration.',[[15.9,73.8],[16.1,75.4],[15,76.2],[13.7,75.8],[13.1,74.4],[14.2,73.7]]],
    ['western-ganga','Western Ganga','ಪಶ್ಚಿಮ ಗಂಗ',350,1000,'place-talakad','#34715c','A long-lived southern Karnataka dynasty whose inscriptions and Jain patronage shaped the region.',[[13.7,75.7],[14.2,77.2],[13.4,78],[11.5,77.8],[11.2,75.9],[12.5,75.2]]],
    ['badami-chalukya','Badami Chalukya','ಬಾದಾಮಿ ಚಾಲುಕ್ಯ',543,757,'place-badami','#b97823','A Deccan imperial power known for Aihole, Badami and Pattadakal, and for major developments in temple architecture.',[[17.7,74],[18,77.3],[16.2,78.7],[13.8,77.3],[13.8,74.5],[15.4,73.6]]],
    ['rashtrakuta','Rashtrakuta','ರಾಷ್ಟ್ರಕೂಟ',753,982,'place-manyakheta','#6d4c8d','A major imperial dynasty whose courts supported Sanskrit, Kannada and Jain literary cultures.',[[19,73.5],[20.1,77.5],[18.4,80.1],[14.1,79],[12.9,76.1],[15,73.3]]],
    ['kalyani-chalukya','Kalyani Chalukya','ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯ',973,1189,'place-kalyani','#315f91','A western Deccan dynasty associated with temple building, administration and flourishing Kannada literature.',[[19.2,74],[19.5,78.1],[17,79],[13.3,77.5],[13.7,74.5],[16,73.8]]],
    ['hoysala','Hoysala','ಹೊಯ್ಸಳ',1000,1346,'place-halebidu','#9e334b','A southern Karnataka power remembered for monumental temple architecture and rich Kannada literary patronage.',[[14.6,74.8],[15.1,77.2],[13.6,78.2],[11.3,77.4],[11.4,75.1],[13,74.5]]],
    ['vijayanagara','Vijayanagara','ವಿಜಯನಗರ',1336,1646,'place-hampi','#b1452d','A powerful South Indian empire centred at Hampi, with extensive political, architectural and literary influence.',[[17.7,74.2],[18,78.5],[15.2,79.2],[11.1,78.4],[10.8,75.4],[13.8,73.8]]],
    ['mysore','Kingdom of Mysore','ಮೈಸೂರು ಸಂಸ್ಥಾನ',1399,1947,'place-mysuru','#4e6f9e','A major early-modern and modern state ruled by the Wadiyars, with the Hyder Ali–Tipu Sultan interlude.',[[14,75],[14.2,77.3],[12.9,78.2],[11.4,77.5],[11.3,75.7],[12.4,74.8]]]
  ].map(([id,en,kn,from,to,capitalId,color,summary,polygon]) => ({
    id:`polity-${id}`, name:name(en,kn), type:'kingdom', date:dateRange(from,to), capitalId, color,
    description:{ en:summary, kn:'' }, extent:{ type:'Polygon', coordinates:polygon.map(([lat,lng])=>[lng,lat]), precision:'schematic' },
    citations:[citation('src-prototype-boundaries','Prototype synthesis')], review:review('needs-review')
  })),
  people: [
    ['mayurasharma','Mayurasharma','ಮಯೂರಶರ್ಮ','polity-kadamba'],['kangavarma','Kangavarma','ಕಂಗವರ್ಮ','polity-kadamba'],['kakusthavarma','Kakusthavarma','ಕಾಕುಸ್ಥವರ್ಮ','polity-kadamba'],
    ['kongunivarma','Kongunivarma','ಕೊಂಗಣಿವರ್ಮ','polity-western-ganga'],['durvinita','Durvinita','ದುರ್ವಿನೀತ','polity-western-ganga'],['rachamalla-iv','Rachamalla IV','ರಾಚಮಲ್ಲ IV','polity-western-ganga'],
    ['pulakeshin-i','Pulakeshin I','ಪುಲಕೇಶಿ I','polity-badami-chalukya'],['kirtivarman-i','Kirtivarman I','ಕೀರ್ತಿವರ್ಮ I','polity-badami-chalukya'],['pulakeshin-ii','Pulakeshin II','ಪುಲಕೇಶಿ II','polity-badami-chalukya'],['vikramaditya-i','Vikramaditya I','ವಿಕ್ರಮಾದಿತ್ಯ I','polity-badami-chalukya'],['vikramaditya-ii','Vikramaditya II','ಎರಡನೇ ವಿಕ್ರಮಾದಿತ್ಯ','polity-badami-chalukya'],['lokamahadevi','Queen Lokamahadevi','ರಾಣಿ ಲೋಕಮಹಾದೇವಿ','polity-badami-chalukya','patron'],
    ['dantidurga','Dantidurga','ದಂತಿದುರ್ಗ','polity-rashtrakuta'],['krishna-i','Krishna I','ಕೃಷ್ಣ I','polity-rashtrakuta'],['govinda-iii','Govinda III','ಮೂರನೇ ಗೋವಿಂದ','polity-rashtrakuta'],['amoghavarsha-i','Amoghavarsha I','ಅಮೋಘವರ್ಷ I','polity-rashtrakuta'],['krishna-iii','Krishna III','ಕೃಷ್ಣ III','polity-rashtrakuta'],
    ['tailapa-ii','Tailapa II','ತೈಲಪ II','polity-kalyani-chalukya'],['satyashraya','Satyashraya','ಸತ್ಯಾಶ್ರಯ','polity-kalyani-chalukya'],['someshvara-i','Someshvara I','ಸೋಮೇಶ್ವರ I','polity-kalyani-chalukya'],['vikramaditya-vi','Vikramaditya VI','ವಿಕ್ರಮಾದಿತ್ಯ VI','polity-kalyani-chalukya'],
    ['vishnuvardhana','Vishnuvardhana','ವಿಷ್ಣುವರ್ಧನ','polity-hoysala'],['ballala-ii','Ballala II','ಬಲ್ಲಾಳ II','polity-hoysala'],['narasimha-iii','Narasimha III','ನರಸಿಂಹ III','polity-hoysala'],['ballala-iii','Ballala III','ಬಲ್ಲಾಳ III','polity-hoysala'],
    ['harihara-i','Harihara I','ಹರಿಹರ I','polity-vijayanagara'],['bukka-i','Bukka Raya I','ಬುಕ್ಕರಾಯ I','polity-vijayanagara'],['devaraya-ii','Devaraya II','ದೇವರಾಯ II','polity-vijayanagara'],['krishnadevaraya','Krishnadevaraya','ಕೃಷ್ಣದೇವರಾಯ','polity-vijayanagara'],['rama-raya','Aliya Rama Raya','ಅಳಿಯ ರಾಮರಾಯ','polity-vijayanagara'],
    ['yaduraya','Yaduraya','ಯದುರಾಯ','polity-mysore'],['chikka-devaraja','Chikka Devaraja Wadiyar','ಚಿಕ್ಕ ದೇವರಾಜ ಒಡೆಯರ್','polity-mysore'],['hyder-ali','Hyder Ali','ಹೈದರ್ ಅಲಿ','polity-mysore'],['tipu-sultan','Tipu Sultan','ಟಿಪ್ಪು ಸುಲ್ತಾನ್','polity-mysore'],['krishnaraja-iii','Krishnaraja Wadiyar III','ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ III','polity-mysore'],['jayachamarajendra','Jayachamarajendra Wadiyar','ಜಯಚಾಮರಾಜೇಂದ್ರ ಒಡೆಯರ್','polity-mysore']
  ].map(([id,en,kn,polityId,role='ruler'])=>({ id:`person-${id}`, name:name(en,kn), roles:[role], ...(id==='lokamahadevi'?{gender:'woman'}:{}), date:{ from:null,to:null,era:'CE',precision:'unknown' }, citations:[], review:review('needs-review'), polityId })),
  peopleCandidateMeta: null,
  peopleCandidates: [],
  inscriptions: [
    ['talagunda','Talagunda pillar inscription','ತಾಳಗುಂದ ಸ್ತಂಭ ಶಾಸನ',455,'place-talagunda','polity-kadamba','Sanskrit','Southern Brahmi','Important source for the Kadamba origin tradition.'],
    ['halmidi','Halmidi inscription','ಹಲ್ಮಿಡಿ ಶಾಸನ',450,'place-halmidi','polity-kadamba','Kannada','Early Kannada','Among the earliest substantial Kannada inscriptions.'],
    ['aihole','Aihole inscription','ಐಹೊಳೆ ಶಾಸನ',634,'place-aihole','polity-badami-chalukya','Sanskrit','Southern Brahmi','Ravikirti’s prasasti of Pulakeshin II.'],
    ['shravanabelagola','Shravanabelagola inscription cluster','ಶ್ರವಣಬೆಳಗೊಳ ಶಾಸನ ಸಮೂಹ',981,'place-shravanabelagola','polity-western-ganga','Kannada / Sanskrit','Old Kannada','Records connected with Chamundaraya and the Gommateshwara monument.'],
    ['hampi','Hampi inscriptions','ಹಂಪಿ ಶಾಸನಗಳು',1520,'place-hampi','polity-vijayanagara','Kannada / Telugu / Sanskrit','Kannada / Telugu / Nagari','Representative record cluster of the imperial capital.']
  ].map(([id,en,kn,year,placeId,polityId,language,script,note])=>({ id:`inscription-${id}`, name:name(en,kn), date:dateRange(year,year,'circa'), placeId, polityId, languages:language.split(' / '), scripts:script.split(' / '), description:{en:note,kn:''}, citations:[citation('src-epigraphia-carnatica')], review:review('needs-review') })),
  works: [
    ['kavirajamarga','Kavirajamarga','ಕವಿರಾಜಮಾರ್ಗ','Srivijaya / Amoghavarsha I','ಶ್ರೀವಿಜಯ / ಅಮೋಘವರ್ಷ I',850,'polity-rashtrakuta'],['vikramarjuna-vijaya','Vikramarjuna Vijaya','ವಿಕ್ರಮಾರ್ಜುನ ವಿಜಯ','Pampa','ಪಂಪ',941,'polity-rashtrakuta','person-pampa'],['adipurana','Adipurana','ಆದಿಪುರಾಣ','Pampa','ಪಂಪ',941,'polity-rashtrakuta','person-pampa'],
    ['gadayuddha','Gadayuddha','ಗದಾಯುದ್ಧ','Ranna','ರನ್ನ',982,'polity-kalyani-chalukya','person-ranna'],['vikramankadeva-charita','Vikramankadeva Charita','ವಿಕ್ರಮಾಂಕದೇವ ಚರಿತ','Bilhana','ಬಿಲ್ಹಣ',1085,'polity-kalyani-chalukya'],
    ['yashodhara-charite','Yashodhara Charite','ಯಶೋಧರ ಚರಿತೆ','Janna','ಜನ್ನ',1209,'polity-hoysala'],['harishchandra-kavya','Harishchandra Kavya','ಹರಿಶ್ಚಂದ್ರ ಕಾವ್ಯ','Raghavanka','ರಾಘವಾಂಕ',1225,'polity-hoysala'],
    ['kumaravyasa-bharata','Kumaravyasa Bharata','ಕುಮಾರವ್ಯಾಸ ಭಾರತ','Kumaravyasa','ಕುಮಾರವ್ಯಾಸ',1430,'polity-vijayanagara'],['torave-ramayana','Torave Ramayana','ತೊರವೆ ರಾಮಾಯಣ','Kumara Valmiki','ಕುಮಾರ ವಾಲ್ಮೀಕಿ',1500,'polity-vijayanagara']
  ].map(([id,en,kn,creatorEn,creatorKn,year,polityId,creatorId])=>({ id:`work-${id}`, name:name(en,kn), creator:name(creatorEn,creatorKn), creatorIds:creatorId?[creatorId]:[], creatorDisplay:creatorEn, creatorRole:name('Poet / author','ಕವಿ / ಲೇಖಕ'), date:dateRange(year,year,'circa'), languages:['Kannada'], polityId, externalLinks:[{label:'Sanchaya',url:'https://sanchaya.org'}], citations:[], review:review('needs-review') })),
  culturalHeritage: [],
  templeInventoryLeads: [],
  heritageInventoryLeads: [],
  reigns: [],
  territorialExtents: [],
  deepChronologies,
  heritageAudits,
  relationships: [],
  politicalRelations: [],
  externalGovernancePhases,
}

appendUniqueById(atlasData.sources, literatureEpigraphySources)
appendUniqueById(atlasData.people, literaryPeople)
appendUniqueById(atlasData.places, inscriptionPlaces)
appendUniqueById(atlasData.works, additionalWorks)
appendUniqueById(atlasData.externalPolities, politicalRelationPolities)
appendUniqueById(atlasData.people, politicalRelationPeople)
appendUniqueById(atlasData.sources, communityPeopleSources)
appendUniqueById(atlasData.externalPolities, communityPeoplePolities)
appendUniqueById(atlasData.places, communityPeoplePlaces)
appendUniqueById(atlasData.people, communityPeople)
appendUniqueById(atlasData.events, communityPeopleEvents)
appendUniqueById(atlasData.sources, freedomFighterSources)
appendUniqueById(atlasData.sources, freedomMovementResearchSources)
appendUniqueById(atlasData.sources, [{
  id:'src-patrika-sanchaya-kannada',
  type:'periodical-catalogue',
  title:name('Patrika Sanchaya — Kannada newspapers and magazines catalogue','ಪತ್ರಿಕಾ ಸಂಚಯ — ಕನ್ನಡ ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಮಾಸಿಕೆಗಳ ಪಟ್ಟಿ'),
  authors:['Patrike Sanchaya','Srinivas Havanur'],
  publisher:'Sanchaya',
  year:2026,
  url:'https://patrike.sanchaya.net',
  scope:name('Catalogue contribution documenting historic and contemporary Kannada newspapers and magazines. The imported rows retain Patrika Sanchaya’s serial, publication place, publisher, editor, periodicity and contributor-note fields. Exact title history, archive holdings and publication runs remain needs-review until matched to scans or authoritative catalogues.','ಐತಿಹಾಸಿಕ ಮತ್ತು ಸಮಕಾಲೀನ ಕನ್ನಡ ಪತ್ರಿಕೆಗಳು ಹಾಗೂ ಮಾಸಿಕೆಗಳನ್ನು ದಾಖಲಿಸುವ ಪಟ್ಟಿ ಕೊಡುಗೆ. ಆಮದು ಮಾಡಿದ ಸಾಲುಗಳಲ್ಲಿ ಪತ್ರಿಕಾ ಸಂಚಯದ ಕ್ರಮ ಸಂಖ್ಯೆ, ಪ್ರಕಟಣಾ ಸ್ಥಳ, ಪ್ರಕಾಶಕ, ಸಂಪಾದಕ, ಆವರ್ತಕತೆ ಮತ್ತು ಕೊಡುಗೆದಾರರ ಟಿಪ್ಪಣಿ ಕ್ಷೇತ್ರಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ. ನಿಖರ ಶೀರ್ಷಿಕೆ ಇತಿಹಾಸ, ಆರ್ಕೈವ್ ಲಭ್ಯತೆ ಮತ್ತು ಪ್ರಕಟಣಾ ಅವಧಿಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಅಥವಾ ಅಧಿಕೃತ ಪಟ್ಟಿಗಳೊಂದಿಗೆ ಹೊಂದಿಸುವವರೆಗೆ needs-review ಆಗಿವೆ.'),
  review:review('needs-review')
}])
appendUniqueById(atlasData.externalPolities, freedomFighterPolities)
appendUniqueById(atlasData.people, freedomFighterPeople)
// Keep named foreign hosts and eyewitnesses attached to the same dated events
// that already document their Karnataka connection; this makes them discoverable
// without implying a stronger political relationship than the cited record supports.
for (const [eventId, peopleIds] of [['event-tipu-france-embassy',['person-louis-xvi']],['event-tipu-napoleon-contact',['person-napoleon-bonaparte']],['event-domingo-paes-vijayanagara',['person-domingo-paes']]]) {
  const event=atlasData.events.find(record=>record.id===eventId)
  if(event)event.peopleIds=[...new Set([...(event.peopleIds||[]),...peopleIds])]
}
appendUniqueById(atlasData.politicalRelations, politicalRelations)
appendUniqueById(atlasData.politicalRelations, foreignPoliticalRelations)
appendUniqueById(atlasData.sources, foreignInscriptionSources)
appendUniqueById(atlasData.places, foreignInscriptionPlaces)
appendUniqueById(atlasData.externalPolities, foreignInscriptionPolities)
appendUniqueById(atlasData.people, foreignInscriptionPeople)
appendUniqueById(atlasData.inscriptions, foreignInscriptions)
appendUniqueById(atlasData.sources, offbeatHoysalaSources)
appendUniqueById(atlasData.sources, hoysalaTempleInventorySources)
appendUniqueById(atlasData.sources, wikipediaTempleIndexSources)
appendUniqueById(atlasData.sources, wikipediaHeritageSources)
appendUniqueById(atlasData.places, offbeatHoysalaPlaces)
appendUniqueById(atlasData.templeInventoryLeads, hoysalaTempleInventoryLeads)
appendUniqueById(atlasData.templeInventoryLeads, wikipediaTempleInventoryLeads)
appendUniqueById(atlasData.heritageInventoryLeads, wikipediaHeritageInventoryLeads)
appendUniqueById(atlasData.sources, mysuruHeritageBuildingSources)
appendUniqueById(atlasData.heritageInventoryLeads, mysuruHeritageBuildingLeads)
const lobuTuaPlace = atlasData.places.find(item => item.id === 'place-lobu-tua')
if (lobuTuaPlace && !lobuTuaPlace.geographicScope) lobuTuaPlace.geographicScope = { region: 'international', countryCode: 'ID', countryName: name('Indonesia', 'ಇಂಡೋನೇಷ್ಯಾ'), outsideKarnataka: true, outsideIndia: true }

// Western Ganga succession leads from the Sripurusha and dynasty overview pages.
// These are intentionally needs-review until each ruler/date is checked against
// inscriptional editions and specialist historical studies.
const westernGangaPeople = [
  // Keep the pre-existing founder ID so event-person links remain stable.
  ['kongunivarma','Kongunivarman','ಕೊಂಗಣಿವರ್ಮ',350,370],
  ['adhava','Adhava','ಅಧವ',370,390],
  ['harivarman','Harivarman','ಹರಿವರ್ಮ',390,410],
  ['vishmagoppa','Vishmagoppa','ವಿಷ್ಣುಗೋಪ',410,430],
  ['madhava-ii','Madhava II','ಮಾಧವ II',430,469],
  ['avinita','Avinita','ಅವಿನೀತ',469,529],
  ['durvinita','Durvinita','ದುರ್ವಿನೀತ',529,579],
  ['mushkara','Mushkara','ಮುಷ್ಕರ',579,604],
  ['polavira','Polavira','ಪೋಲವೀರ',604,629],
  ['srivikrama','Srivikrama','ಶ್ರೀವಿಕ್ರಮ',629,654],
  ['bhuvikrama','Bhuvikrama','ಭುವಿಕ್ರಮ',654,679],
  ['shivamara-i','Shivamara I','ಶಿವಮಾರ I',679,726],
  ['sripurusha','Sripurusha','ಶ್ರೀಪುರುಷ',726,788],
  ['shivamara-ii','Shivamara II','ಶಿವಮಾರ II',788,816],
  ['rachamalla-i','Rachamalla I','ರಾಚಮಲ್ಲ I',816,843],
  ['ereganga-neetimarga','Ereganga Neetimarga','ಎರೆಗಂಗ ನೀತಿಮಾರ್ಗ',843,870],
  ['rachamalla-ii','Rachamalla II','ರಾಚಮಲ್ಲ II',870,907],
  ['ereganga-neetimarga-ii','Ereganga Neetimarga II','ಎರೆಗಂಗ ನೀತಿಮಾರ್ಗ II',907,921],
  ['narasimha-ganga','Narasimha','ನರಸಿಂಹ',921,933],
  ['rachamalla-iii','Rachamalla III','ರಾಚಮಲ್ಲ III',933,938],
  ['butuga-ii','Butuga II','ಬುಟುಗ II',938,961],
  ['marulaganga-neetimarga','Marulaganga Neetimarga','ಮರುಳಗಂಗ ನೀತಿಮಾರ್ಗ',961,963],
  ['marasimha-ii','Marasimha II Satyavakya','ಮಾರಸಿಂಹ II ಸತ್ಯವಾಕ್ಯ',963,975],
  ['rachamalla-iv','Rachamalla IV Satyavakya','ರಾಚಮಲ್ಲ IV ಸತ್ಯವಾಕ್ಯ',975,986],
  ['rachamalla-v','Rachamalla V / Rakkasaganga','ರಾಚಮಲ್ಲ V / ರಕ್ಕಸಗಂಗ',986,999],
  ['neetimarga-permanadi','Neetimarga Permanadi','ನೀತಿಮಾರ್ಗ ಪೆರ್ಮನಾಡಿ',999,999],
].map(([id,en,kn,from,to])=>({
  id:`person-${id}`, name:name(en,kn), roles:['ruler'], polityId:'polity-western-ganga',
  date:dateRange(from,to,from===to?'year':'range'),
  citations:[citation('src-wikipedia-sripurusha','Western Ganga succession list; discovery lead only')],
  review:review('needs-review'),
}))
westernGangaPeople.forEach(person=>{
  const existing=atlasData.people.find(item=>item.id===person.id)
  if(existing) Object.assign(existing,person)
  else atlasData.people.push(person)
})
appendUniqueById(atlasData.works, [{
  id:'work-gajasastra', name:name('Gajasastra','ಗಜಶಾಸ್ತ್ರ'), creator:name('Sripurusha','ಶ್ರೀಪುರುಷ'), creatorIds:['person-sripurusha'],
  creatorRole:name('Scholar-king','ವಿದ್ವಾನ್ ರಾಜ'), date:dateRange(760,760,'circa'), languages:['Sanskrit'], polityId:'polity-western-ganga',
  description:name('Sanskrit treatise attributed to Sripurusha; an article-derived lead requiring attribution and edition review.','ಶ್ರೀಪುರುಷರಿಗೆ ಸಲ್ಲಿಸಲಾದ ಸಂಸ್ಕೃತ ಗ್ರಂಥ; ಕರ್ತೃತ್ವ ಮತ್ತು ಆವೃತ್ತಿ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿರುವ ಲೇಖನ ಆಧಾರಿತ ಸಂಶೋಧನಾ ದಾರಿ.'),
  citations:[citation('src-wikipedia-sripurusha','Literature and legacy; verify attribution against a critical edition')],
  review:review('needs-review'),
}])
appendUniqueById(atlasData.inscriptions, additionalInscriptions)
atlasData.inscriptions.forEach(record=>{record.districtAuditId=inscriptionDistrictAssignments[record.id]||null})
// Cross-border Kannada inscription leads are kept in a synthetic research audit
// so they enter the same evidence workflow without being misassigned to a
// Karnataka district. They are not claims of territorial control.
appendUniqueById(atlasData.heritageAudits, [{
  id:'audit-cross-border-kannada', name:name('Outside-Karnataka Kannada inscription audit','ಕರ್ನಾಟಕದ ಹೊರಗಿನ ಕನ್ನಡ ಶಾಸನ ಪರಿಶೀಲನೆ'),
  district:name('Outside Karnataka / cross-border leads','ಕರ್ನಾಟಕದ ಹೊರಗೆ / ಗಡಿ-ದಾಟಿದ ದಾರಿಗಳು'), region:'cross-border', auditStatus:'in-progress',
  categoryCoverage:{temple:'unassessed','coastal-temple':'unassessed',basadi:'unassessed',dargah:'unassessed',church:'unassessed',monastery:'unassessed',fort:'unassessed','palace-civic-architecture':'unassessed','colonial-architecture':'unassessed','archaeological-landscape':'unassessed','modern-heritage':'unassessed'}, prioritySites:[],
  methodologyNote:name('Discovery leads for Kannada records outside Karnataka. Resolve the item, findspot, repository, political context and present authority separately; do not infer territory from an inscription alone.','ಕರ್ನಾಟಕದ ಹೊರಗಿನ ಕನ್ನಡ ದಾಖಲೆಗಳ ಹುಡುಕಾಟದ ದಾರಿಗಳು. ದಾಖಲೆ, ಪತ್ತೆಸ್ಥಳ, ಸಂಗ್ರಹಸ್ಥಳ, ರಾಜಕೀಯ ಸಂದರ್ಭ ಮತ್ತು ಪ್ರಸ್ತುತ ಪ್ರಾಧಿಕಾರವನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ನಿರ್ಧರಿಸಿ; ಶಾಸನದ ಆಧಾರದಿಂದ ಮಾತ್ರ ಭೂಆಳ್ವಿಕೆಯನ್ನು ಊಹಿಸಬಾರದು.'),
  citations:[citation('src-wikipedia-kannada-inscriptions','Sections on Kannada inscriptions found in Andhra Pradesh, Maharashtra and Tamil Nadu')], review:review('needs-review'),
}])
atlasData.inscriptionAudits=atlasData.heritageAudits.map(audit=>{
  const inscriptionIds=atlasData.inscriptions.filter(record=>record.districtAuditId===audit.id).map(record=>record.id)
  const priorityCandidates=priorityInscriptionCandidates[audit.id]||[]
  const auditStatus=inscriptionIds.length?'seeded':priorityCandidates.length?'candidate-identified':'unassessed'
  const candidateCitations=priorityCandidates.flatMap(item=>item.citations)
  return {id:`inscription-${audit.id}`,name:name(`${audit.district.en} inscription audit`,`${audit.district.kn} ಶಾಸನ ಪರಿಶೀಲನೆ`),district:audit.district,districtAuditId:audit.id,auditStatus,inscriptionIds,priorityCandidates,reviewPass:districtInscriptionReviewPasses[audit.id]||null,methodologyNote:name(inscriptionIds.length?'Seed records are mapped, but each transcription, date and findspot still requires item-level verification.':priorityCandidates.length?'One or more source-located priority candidates are queued; they are not treated as verified inscription records until item-level evidence and coordinates are resolved.':'No inscription has yet been seeded for this district; this is a research gap, not evidence of absence.',inscriptionIds.length?'ಆರಂಭಿಕ ದಾಖಲೆಗಳನ್ನು ನಕ್ಷೆಗೊಳಿಸಲಾಗಿದೆ; ಆದರೆ ಪ್ರತಿಯೊಂದು ಪಾಠ, ದಿನಾಂಕ ಮತ್ತು ಪತ್ತೆಸ್ಥಳವನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಪರಿಶೀಲಿಸಬೇಕು.':priorityCandidates.length?'ಒಂದು ಅಥವಾ ಹೆಚ್ಚು ಆಕರ-ಗುರುತಿಸಿದ ಆದ್ಯತಾ ಅಭ್ಯರ್ಥಿಗಳು ಸರದಿಯಲ್ಲಿವೆ; ಪ್ರತ್ಯೇಕ ಸಾಕ್ಷ್ಯ ಮತ್ತು ನಿರ್ದೇಶಾಂಕಗಳು ನಿರ್ಧಾರವಾಗುವವರೆಗೆ ಅವನ್ನು ಪರಿಶೀಲಿತ ಶಾಸನ ದಾಖಲೆಗಳೆಂದು ಪರಿಗಣಿಸುವುದಿಲ್ಲ.':'ಈ ಜಿಲ್ಲೆಗೆ ಇನ್ನೂ ಶಾಸನವನ್ನು ಸೇರಿಸಿಲ್ಲ; ಇದು ಸಂಶೋಧನಾ ಕೊರತೆ, ಶಾಸನಗಳ ಅನುಪಸ್ಥಿತಿಯ ಸಾಕ್ಷ್ಯವಲ್ಲ.'),citations:inscriptionIds.length?[citation('src-ignca-epigraphia-indica-index','District audit starting point; verify against the relevant corpus volume')]:candidateCitations,review:review(auditStatus==='unassessed'?'draft':'needs-review')}
})

const literaryEvidenceTemplates={
  creatorIdentity:{submissionType:'creator-authority',requiredFields:['creatorName','authorityId','biographicalSource','sourceLocator'],instruction:name('Match the attributed creator to an authority record and a citable biographical or literary-history source.','ಹೆಸರಿಸಲಾದ ಕರ್ತೃವನ್ನು ಪ್ರಾಧಿಕೃತ ದಾಖಲೆಗೆ ಮತ್ತು ಉಲ್ಲೇಖಿಸಬಹುದಾದ ಜೀವನಚರಿತ್ರೆ ಅಥವಾ ಸಾಹಿತ್ಯ ಇತಿಹಾಸದ ಆಕರಕ್ಕೆ ಹೊಂದಿಸಿ.')},
  workDate:{submissionType:'work-date',requiredFields:['dateFrom','dateTo','era','precision','sourceLocator','datingRationale'],instruction:name('Verify the work date or range against an item-level edition, catalogue or specialist study and record the dating rationale.','ಕೃತಿಯ ದಿನಾಂಕ ಅಥವಾ ಅವಧಿಯನ್ನು ಕೃತಿ-ಮಟ್ಟದ ಆವೃತ್ತಿ, ಸೂಚಿ ಅಥವಾ ತಜ್ಞ ಅಧ್ಯಯನದೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ ದಿನಾಂಕದ ಆಧಾರವನ್ನು ದಾಖಲಿಸಿ.')},
  courtContext:{submissionType:'court-context',requiredFields:['polityId','courtOrPatron','relationshipType','sourceLocator'],instruction:name('Verify whether the polity link represents patronage, court presence, composition context or later association.','ರಾಜ್ಯದ ಸಂಪರ್ಕವು ಆಶ್ರಯ, ಆಸ್ಥಾನ ಹಾಜರಾತಿ, ರಚನಾ ಸಂದರ್ಭ ಅಥವಾ ನಂತರದ ಸಂಬಂಧವೇ ಎಂಬುದನ್ನು ಪರಿಶೀಲಿಸಿ.')},
  bilingualDescription:{submissionType:'bilingual-description-review',requiredFields:['descriptionEn','descriptionKn','terminologyNotes','reviewerAttestation'],instruction:name('Review the Kannada and English descriptions for equivalent scope, names, genre terms and historical interpretation.','ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ವಿವರಣೆಗಳಲ್ಲಿ ಸಮಾನ ವ್ಯಾಪ್ತಿ, ಹೆಸರುಗಳು, ಪ್ರಕಾರ ಪದಗಳು ಮತ್ತು ಐತಿಹಾಸಿಕ ವ್ಯಾಖ್ಯಾನವನ್ನು ಪರಿಶೀಲಿಸಿ.')},
  itemCitation:{submissionType:'item-citation',requiredFields:['sourceId','editionTitle','volumeOrCatalogue','pageOrItem','sourceUrl'],instruction:name('Replace survey-level references with an item-specific edition, catalogue entry or dependable scholarly record.','ಸಾಮಾನ್ಯ ಸಮೀಕ್ಷಾ ಉಲ್ಲೇಖದ ಬದಲು ಕೃತಿ-ನಿರ್ದಿಷ್ಟ ಆವೃತ್ತಿ, ಸೂಚಿ ದಾಖಲೆ ಅಥವಾ ವಿಶ್ವಾಸಾರ್ಹ ಸಂಶೋಧನಾ ದಾಖಲೆಯನ್ನು ನೀಡಿ.')},
  editionWitness:{submissionType:'edition-witness',requiredFields:['witnessType','repositoryOrPublisher','shelfmarkOrEdition','year','sourceUrl'],instruction:name('Identify at least one manuscript, critical edition, first edition or dependable digital witness for the work.','ಕೃತಿಗೆ ಕನಿಷ್ಠ ಒಂದು ಹಸ್ತಪ್ರತಿ, ವಿಮರ್ಶಾತ್ಮಕ ಆವೃತ್ತಿ, ಮೊದಲ ಆವೃತ್ತಿ ಅಥವಾ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯವನ್ನು ಗುರುತಿಸಿ.')},
}

atlasData.works.forEach(work => {
  if (!work.citations?.length) work.citations=[citation('src-asi-kannada-literature-survey','Work and literary-period survey; item-level citation review pending')]
  const gates={
    creatorIdentity:{status:work.creatorIds?.length?'located':'provisional',note:name(work.creatorIds?.length?'Creator profile is linked; authority identity still requires reviewer confirmation.':'Attributed creator is recorded, but no authority-linked person profile is attached.','ಕರ್ತೃ ಪ್ರೊಫೈಲ್ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ; ಪ್ರಾಧಿಕೃತ ಗುರುತನ್ನು ಪರಿಶೀಲಕರು ಇನ್ನೂ ದೃಢಪಡಿಸಬೇಕು.','ಕರ್ತೃ ಹೆಸರು ದಾಖಲಾಗಿದೆ; ಆದರೆ ಪ್ರಾಧಿಕೃತ ವ್ಯಕ್ತಿ ಪ್ರೊಫೈಲ್ ಸಂಪರ್ಕಿಸಿಲ್ಲ.')},
    workDate:{status:work.date?.precision==='year'?'located':'provisional',note:name('The displayed date must be checked against a work-level edition or catalogue.','ತೋರಿಸಿರುವ ದಿನಾಂಕವನ್ನು ಕೃತಿ-ಮಟ್ಟದ ಆವೃತ್ತಿ ಅಥವಾ ಸೂಚಿಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.')},
    courtContext:{status:work.polityId?'located':'unresolved',note:name('Court or polity context is linked for review.','ಆಸ್ಥಾನ ಅಥವಾ ರಾಜ್ಯದ ಸಂದರ್ಭವನ್ನು ಪರಿಶೀಲನೆಗಾಗಿ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ.')},
    bilingualDescription:{status:work.description?.en&&work.description?.kn?'located':'unresolved',note:name('A bilingual scholarly description is required.','ದ್ವಿಭಾಷಾ ಸಂಶೋಧನಾ ವಿವರಣೆ ಅಗತ್ಯವಾಗಿದೆ.')},
    itemCitation:{status:(work.citations||[]).some(item=>item.locator&&!/pending|survey/i.test(item.locator))?'located':'provisional',note:name('Replace survey-level references with an item-level edition or catalogue locator.','ಸಾಮಾನ್ಯ ಸಮೀಕ್ಷಾ ಆಕರದ ಬದಲು ಕೃತಿ-ಮಟ್ಟದ ಆವೃತ್ತಿ ಅಥವಾ ಸೂಚಿ ಸ್ಥಳಸೂಚಿಯನ್ನು ಸೇರಿಸಬೇಕು.')},
    editionWitness:{status:work.manuscriptWitnesses?.length?'located':'unresolved',note:name('Record a manuscript, critical edition, or dependable digital witness.','ಹಸ್ತಪ್ರತಿ, ವಿಮರ್ಶಾತ್ಮಕ ಆವೃತ್ತಿ ಅಥವಾ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯವನ್ನು ದಾಖಲಿಸಬೇಕು.')},
  }
  const requiredEvidence=Object.keys(gates)
  const completedEvidence=requiredEvidence.filter(field=>['located','verified'].includes(gates[field].status))
  const blockingEvidence=requiredEvidence.filter(field=>gates[field].status!=='verified')
  work.reviewWorkflow={target:'reviewed-literary-record',status:'evidence-capture',requiredEvidence,completedEvidence,blockingEvidence,evidence:gates,evidenceRequests:blockingEvidence.map(field=>({field,currentStatus:gates[field].status,...literaryEvidenceTemplates[field]})),independentReview:{status:'not-ready',reviewerRequired:true,conflictOfInterestRule:'reviewer-must-not-be-the-contributor',requiredChecks:['sourceMatch','identityAndAttribution','dateAndContext','bilingualFidelity','citationCompleteness','reviewerAttestation'],reviewer:null,reviewedAt:null,decision:null},note:name('This work remains in the 24-item literature review queue until an independent reviewer confirms every evidence gate.','ಸ್ವತಂತ್ರ ಪರಿಶೀಲಕರು ಎಲ್ಲ ಸಾಕ್ಷ್ಯ ಹಂತಗಳನ್ನು ದೃಢಪಡಿಸುವವರೆಗೆ ಈ ಕೃತಿ 24-ದಾಖಲೆಗಳ ಸಾಹಿತ್ಯ ಪರಿಶೀಲನಾ ಸರದಿಯಲ್ಲೇ ಇರುತ್ತದೆ.')}
})

const polityDescriptionsKn = {
  'polity-kadamba':'ಬನವಾಸಿಯನ್ನು ಕೇಂದ್ರವಾಗಿಸಿಕೊಂಡ ಕರ್ನಾಟಕದ ಆರಂಭಿಕ ಸ್ಥಳೀಯ ರಾಜವಂಶಗಳಲ್ಲಿ ಒಂದು; ಕನ್ನಡ ಆಡಳಿತದ ಬೆಳವಣಿಗೆಯೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದೆ.',
  'polity-western-ganga':'ದಕ್ಷಿಣ ಕರ್ನಾಟಕದಲ್ಲಿ ದೀರ್ಘಕಾಲ ಆಳಿದ ರಾಜವಂಶ; ಅದರ ಶಾಸನಗಳು ಮತ್ತು ಜೈನ ಧರ್ಮದ ಆಶ್ರಯವು ಪ್ರದೇಶದ ಸಂಸ್ಕೃತಿಯನ್ನು ರೂಪಿಸಿವೆ.',
  'polity-badami-chalukya':'ಐಹೊಳೆ, ಬಾದಾಮಿ ಮತ್ತು ಪಟ್ಟದಕಲ್ಲಿಗೆ ಹೆಸರಾಗಿರುವ ದಖ್ಖನ್‌ನ ಸಾಮ್ರಾಜ್ಯಶಕ್ತಿ; ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪದ ಮಹತ್ವದ ಬೆಳವಣಿಗೆಗೆ ಕಾರಣವಾಯಿತು.',
  'polity-rashtrakuta':'ಸಂಸ್ಕೃತ, ಕನ್ನಡ ಮತ್ತು ಜೈನ ಸಾಹಿತ್ಯ ಸಂಸ್ಕೃತಿಗಳಿಗೆ ಆಶ್ರಯ ನೀಡಿದ ಅರಮನೆಗಳನ್ನು ಹೊಂದಿದ್ದ ಪ್ರಮುಖ ಸಾಮ್ರಾಜ್ಯಶಾಹಿ ರಾಜವಂಶ.',
  'polity-kalyani-chalukya':'ದೇವಾಲಯ ನಿರ್ಮಾಣ, ಆಡಳಿತ ಮತ್ತು ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಸಮೃದ್ಧಿಯೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ ಪಶ್ಚಿಮ ದಖ್ಖನ್‌ನ ರಾಜವಂಶ.',
  'polity-hoysala':'ಭವ್ಯ ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಸಮೃದ್ಧ ಕನ್ನಡ ಸಾಹಿತ್ಯದ ಆಶ್ರಯಕ್ಕಾಗಿ ಸ್ಮರಣೀಯವಾದ ದಕ್ಷಿಣ ಕರ್ನಾಟಕದ ರಾಜಶಕ್ತಿ.',
  'polity-vijayanagara':'ಹಂಪಿಯನ್ನು ಕೇಂದ್ರವಾಗಿಸಿಕೊಂಡ ಪ್ರಬಲ ದಕ್ಷಿಣ ಭಾರತೀಯ ಸಾಮ್ರಾಜ್ಯ; ರಾಜಕೀಯ, ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಸಾಹಿತ್ಯದ ಮೇಲೆ ವ್ಯಾಪಕ ಪ್ರಭಾವ ಬೀರಿತು.',
  'polity-mysore':'ಒಡೆಯರ್‌ಗಳು ಆಳಿದ ಪ್ರಮುಖ ಆಧುನಿಕಪೂರ್ವ ಮತ್ತು ಆಧುನಿಕ ರಾಜ್ಯ; ಮಧ್ಯದಲ್ಲಿ ಹೈದರ್ ಅಲಿ–ಟಿಪ್ಪು ಸುಲ್ತಾನ್ ಆಡಳಿತವಿತ್ತು.'
}
const inscriptionDescriptionsKn = {
  'inscription-talagunda':'ಕದಂಬರ ಮೂಲ ಪರಂಪರೆಗೆ ಪ್ರಮುಖ ಆಕರ.', 'inscription-halmidi':'ಕನ್ನಡದ ಆರಂಭಿಕ ವಿಸ್ತೃತ ಶಾಸನಗಳಲ್ಲಿ ಒಂದು.',
  'inscription-aihole':'ಎರಡನೇ ಪುಲಕೇಶಿಯ ಕುರಿತು ರವಿಕೀರ್ತಿಯ ಪ್ರಶಸ್ತಿ.', 'inscription-shravanabelagola':'ಚಾವುಂಡರಾಯ ಮತ್ತು ಗೊಮ್ಮಟೇಶ್ವರ ಮೂರ್ತಿಗೆ ಸಂಬಂಧಿಸಿದ ದಾಖಲೆಗಳು.',
  'inscription-hampi':'ಸಾಮ್ರಾಜ್ಯದ ರಾಜಧಾನಿಯ ಪ್ರತಿನಿಧಿ ಶಾಸನ ಸಮೂಹ.'
}
atlasData.polities.forEach(record=>{record.description.kn=polityDescriptionsKn[record.id]||''})
atlasData.inscriptions.forEach(record=>{if(inscriptionDescriptionsKn[record.id])record.description.kn=inscriptionDescriptionsKn[record.id]})

atlasData.culturalHeritage = [
  {
    id:'culture-pattadakal-sacred-architecture',name:name('Pattadakal synthesis of sacred architecture','ಪಟ್ಟದಕಲ್ಲಿನ ಪವಿತ್ರ ವಾಸ್ತುಶಿಲ್ಪ ಸಂಯೋಜನೆ'),category:'architecture',date:dateRange(650,750,'range'),polityIds:['polity-badami-chalukya'],placeIds:['place-pattadakal'],peopleIds:[],relatedWorkIds:[],traditionTags:['Hindu','Jain','Nagara','Dravida'],continuity:'material-survival',
    description:name('Nine Hindu temples and a Jain sanctuary demonstrate the Chalukya synthesis of northern and southern architectural forms.','ಒಂಬತ್ತು ಹಿಂದೂ ದೇವಾಲಯಗಳು ಮತ್ತು ಒಂದು ಜೈನ ಬಸದಿಯು ಉತ್ತರ–ದಕ್ಷಿಣ ವಾಸ್ತುಶೈಲಿಗಳ ಚಾಲುಕ್ಯ ಸಂಯೋಜನೆಯನ್ನು ತೋರಿಸುತ್ತವೆ.'),citations:[citation('src-unesco-pattadakal','7th–8th century Chalukya art; nine Hindu temples and a Jain sanctuary')],review:review('reviewed')
  },
  {
    id:'culture-virupaksha-temple-victory-740',name:name('Virupaksha Temple as a victory monument, c. 740','ವಿಜಯ ಸ್ಮಾರಕವಾಗಿ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ, ಸು. 740'),category:'visual-art',date:dateRange(740,740,'circa'),polityIds:['polity-badami-chalukya'],placeIds:['place-pattadakal'],peopleIds:['person-lokamahadevi','person-vikramaditya-ii'],relatedWorkIds:[],traditionTags:['Shaiva','royal-patronage','victory-commemoration'],continuity:'material-survival',
    description:name('Queen Lokamahadevi commissioned the temple to commemorate her husband’s victory over southern rulers, joining political memory with sacred art.','ದಕ್ಷಿಣದ ಅರಸರ ಮೇಲಿನ ತನ್ನ ಪತಿಯ ವಿಜಯವನ್ನು ಸ್ಮರಿಸಲು ರಾಣಿ ಲೋಕಮಹಾದೇವಿ ಈ ದೇವಾಲಯವನ್ನು ನಿರ್ಮಿಸಿದಳು; ಇಲ್ಲಿ ರಾಜಕೀಯ ಸ್ಮೃತಿ ಮತ್ತು ಪವಿತ್ರ ಕಲೆ ಒಂದಾಗಿವೆ.'),citations:[citation('src-unesco-pattadakal','Virupaksha Temple built c. 740 by Queen Lokamahadevi to commemorate victory')],review:review('reviewed')
  },
  {
    id:'culture-ellora-kailasa-rashtrakuta',name:name('Kailasa Temple at Ellora','ಎಲ್ಲೋರದ ಕೈಲಾಸ ದೇವಾಲಯ'),category:'architecture',date:dateRange(756,773,'circa'),polityIds:['polity-rashtrakuta'],placeIds:['place-ellora'],peopleIds:['person-krishna-i'],relatedWorkIds:[],traditionTags:['Shaiva','rock-cut-architecture','sculpture'],continuity:'material-survival',
    description:name('The monolithic Kailasa complex combines an exceptional rock-cut engineering achievement with an extensive Shaiva sculptural programme.','ಏಕಶಿಲಾ ಕೈಲಾಸ ಸಮುಚ್ಚಯವು ಅಸಾಧಾರಣ ಶಿಲಾ-ಕೊರೆತ ತಾಂತ್ರಿಕ ಸಾಧನೆ ಮತ್ತು ವ್ಯಾಪಕ ಶೈವ ಶಿಲ್ಪ ಕಾರ್ಯಕ್ರಮವನ್ನು ಒಟ್ಟುಗೂಡಿಸುತ್ತದೆ.'),citations:[citation('src-unesco-ellora','Kailasa Temple, Cave 16; rock-cut and sculptural achievement'),citation('src-asi-rashtrakutas','Attribution to Krishna I')],review:review('needs-review')
  },
  {
    id:'culture-kavirajamarga-courtly-literature',name:name('Kavirajamarga and Kannada courtly literature','ಕವಿರಾಜಮಾರ್ಗ ಮತ್ತು ಕನ್ನಡ ಆಸ್ಥಾನ ಸಾಹಿತ್ಯ'),category:'literature',date:dateRange(850,850,'circa'),polityIds:['polity-rashtrakuta'],placeIds:['place-manyakheta'],peopleIds:['person-amoghavarsha-i'],relatedWorkIds:['work-kavirajamarga'],traditionTags:['Kannada','poetics','courtly-culture'],continuity:'historic',
    description:name('Kavirajamarga represents the Rashtrakuta court’s role in shaping an early Kannada literary and critical tradition.','ಆರಂಭಿಕ ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಕಾವ್ಯಮೀಮಾಂಸೆಯ ಪರಂಪರೆಯನ್ನು ರೂಪಿಸುವಲ್ಲಿ ರಾಷ್ಟ್ರಕೂಟ ಆಸ್ಥಾನದ ಪಾತ್ರವನ್ನು ಕವಿರಾಜಮಾರ್ಗ ಪ್ರತಿನಿಧಿಸುತ್ತದೆ.'),citations:[citation('src-asi-rashtrakutas','Amoghavarsha and the literary culture of his court')],review:review('needs-review')
  },
  {
    id:'culture-gommateshwara-shravanabelagola-981',name:name('Gommateshwara monument at Shravanabelagola, c. 981','ಶ್ರವಣಬೆಳಗೊಳದ ಗೊಮ್ಮಟೇಶ್ವರ ಸ್ಮಾರಕ, ಸು. 981'),category:'religious-tradition',date:dateRange(981,981,'circa'),polityIds:['polity-western-ganga'],placeIds:['place-shravanabelagola'],peopleIds:[],relatedWorkIds:[],traditionTags:['Jain','monumental-sculpture','patronage'],continuity:'continuing-practice',
    description:name('The monumental Bahubali image and its inscriptions connect Western Ganga patronage, Jain devotion, and Kannada–Sanskrit epigraphic culture.','ಬೃಹತ್ ಬಾಹುಬಲಿ ಮೂರ್ತಿ ಮತ್ತು ಅದರ ಶಾಸನಗಳು ಪಶ್ಚಿಮ ಗಂಗರ ಆಶ್ರಯ, ಜೈನ ಭಕ್ತಿ ಮತ್ತು ಕನ್ನಡ–ಸಂಸ್ಕೃತ ಶಾಸನ ಸಂಸ್ಕೃತಿಯನ್ನು ಜೋಡಿಸುತ್ತವೆ.'),citations:[citation('src-epigraphia-carnatica','Shravanabelagola inscription cluster and Chamundaraya context')],review:review('needs-review')
  },
  {
    id:'culture-belur-channakeshava-1117',name:name('Channakeshava Temple: sculpture, ritual, and living tradition','ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ: ಶಿಲ್ಪ, ಆಚರಣೆ ಮತ್ತು ಜೀವಂತ ಪರಂಪರೆ'),category:'architecture',date:dateRange(1117,1117,'year'),polityIds:['polity-hoysala'],placeIds:['place-belur'],peopleIds:['person-vishnuvardhana'],relatedWorkIds:[],traditionTags:['Vaishnava','sculpture','ritual','artists-signatures'],continuity:'continuing-practice',
    description:name('Belur combines stellate architecture, narrative sculpture, documented artistic agency, and continuity of worship and festivals since 1117.','ಬೇಲೂರಿನಲ್ಲಿ ನಕ್ಷತ್ರಾಕಾರದ ವಾಸ್ತು, ಕಥನ ಶಿಲ್ಪ, ಕಲಾವಿದರ ದಾಖಲಾದ ಸ್ವಾಯತ್ತತೆ ಮತ್ತು 1117ರಿಂದ ಮುಂದುವರಿದ ಪೂಜೆ–ಹಬ್ಬಗಳ ನಿರಂತರತೆ ಒಂದಾಗಿವೆ.'),citations:[citation('src-unesco-hoysala-dossier','Belur artistic programme, artists’ signatures, worship and festival continuity'),citation('src-unesco-hoysala-dossier','Vishnuvardhana and the royal centre at Belur')],review:review('reviewed')
  },
  {
    id:'culture-halebidu-hoysaleshvara',name:name('Hoysaleshvara sculptural narratives at Halebidu','ಹಳೇಬೀಡಿನ ಹೊಯ್ಸಳೇಶ್ವರ ಶಿಲ್ಪ ಕಥನಗಳು'),category:'visual-art',date:dateRange(1121,1150,'circa'),polityIds:['polity-hoysala'],placeIds:['place-halebidu'],peopleIds:['person-vishnuvardhana'],relatedWorkIds:[],traditionTags:['Shaiva','epic-narrative','stone-carving'],continuity:'material-survival',
    description:name('Dense sculptural bands and epic narratives turn circumambulation into a visual and religious experience; regular worship has not continued.','ದಟ್ಟ ಶಿಲ್ಪಪಟ್ಟಿಗಳು ಮತ್ತು ಮಹಾಕಾವ್ಯ ಕಥನಗಳು ಪ್ರದಕ್ಷಿಣೆಯನ್ನು ದೃಶ್ಯ–ಧಾರ್ಮಿಕ ಅನುಭವವಾಗಿಸುತ್ತವೆ; ನಿಯಮಿತ ಪೂಜೆ ಮುಂದುವರಿದಿಲ್ಲ.'),citations:[citation('src-unesco-hoysala-dossier','Hoysaleshvara sculpture and narrative programme; worship discontinued')],review:review('reviewed')
  },
  {
    id:'culture-somanathapura-keshava-1268',name:name('Keshava Temple at Somanathapura','ಸೋಮನಾಥಪುರದ ಕೇಶವ ದೇವಾಲಯ'),category:'architecture',date:dateRange(1268,1268,'year'),polityIds:['polity-hoysala'],placeIds:['place-somanathapura'],peopleIds:[],relatedWorkIds:[],traditionTags:['Vaishnava','trikuta','sculpture'],continuity:'material-survival',
    description:name('The complete trikuta composition represents a mature phase of Hoysala sacred architecture and sculptural design.','ಸಂಪೂರ್ಣ ತ್ರಿಕೂಟ ವಿನ್ಯಾಸವು ಹೊಯ್ಸಳ ಪವಿತ್ರ ವಾಸ್ತು ಮತ್ತು ಶಿಲ್ಪ ವಿನ್ಯಾಸದ ಪರಿಪಕ್ವ ಹಂತವನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ.'),citations:[citation('src-unesco-hoysala-dossier','Keshava Temple as a complete mature Hoysala composition')],review:review('reviewed')
  },
  {
    id:'culture-hampi-mahanavami-dasara',name:name('Mahanavami and royal Dasara at Vijayanagara','ವಿಜಯನಗರದ ಮಹಾನವಮಿ ಮತ್ತು ರಾಜ ದಸರಾ'),category:'celebration',date:dateRange(1336,1565,'range'),polityIds:['polity-vijayanagara'],placeIds:['place-hampi'],peopleIds:[],relatedWorkIds:[],traditionTags:['Mahanavami','Dasara','royal-ceremony','military-review'],continuity:'historic',
    description:name('The royal centre and Mahanavami platform hosted major Dasara ceremonies and annual military reviews, linking celebration with imperial display.','ರಾಜಕೇಂದ್ರ ಮತ್ತು ಮಹಾನವಮಿ ದಿಬ್ಬವು ಪ್ರಮುಖ ದಸರಾ ಆಚರಣೆಗಳು ಮತ್ತು ವಾರ್ಷಿಕ ಸೈನ್ಯ ಪರಾಮರ್ಶೆಗೆ ವೇದಿಕೆಯಾಗಿದ್ದು, ಹಬ್ಬವನ್ನು ಸಾಮ್ರಾಜ್ಯ ಪ್ರದರ್ಶನದೊಂದಿಗೆ ಜೋಡಿಸಿತು.'),citations:[citation('src-unesco-hampi-periodic-report','Dusshera and annual review of the army held in the royal centre')],review:review('reviewed')
  },
  {
    id:'culture-hampi-virupaksha-living-centre',name:name('Virupaksha Temple as a living religious centre','ಜೀವಂತ ಧಾರ್ಮಿಕ ಕೇಂದ್ರವಾಗಿ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ'),category:'religious-tradition',date:dateRange(1336,1565,'range'),polityIds:['polity-vijayanagara'],placeIds:['place-hampi'],peopleIds:[],relatedWorkIds:[],traditionTags:['Shaiva','temple-ritual','sacred-centre'],continuity:'continuing-practice',
    description:name('Within Hampi’s sacred landscape, Virupaksha Temple remained a pivotal centre of religious activity beyond the imperial period.','ಹಂಪಿಯ ಪವಿತ್ರ ಭೂದೃಶ್ಯದಲ್ಲಿ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯವು ಸಾಮ್ರಾಜ್ಯ ಕಾಲದ ನಂತರವೂ ಧಾರ್ಮಿಕ ಚಟುವಟಿಕೆಗಳ ಪ್ರಮುಖ ಕೇಂದ್ರವಾಗಿ ಉಳಿಯಿತು.'),citations:[citation('src-unesco-hampi-periodic-report','Virupaksha Temple as the pivotal centre of religious activities')],review:review('reviewed')
  },
  {
    id:'culture-mysuru-dasara-continuing',name:name('Mysuru Dasara: royal celebration and Nada Habba','ಮೈಸೂರು ದಸರಾ: ರಾಜೋತ್ಸವ ಮತ್ತು ನಾಡಹಬ್ಬ'),category:'celebration',date:dateRange(1610,1610,'circa'),polityIds:['polity-mysore'],placeIds:['place-mysuru'],peopleIds:[],relatedWorkIds:[],traditionTags:['Navaratri','Vijayadashami','Chamundeshwari','procession','music','dance'],continuity:'continuing-practice',
    description:name('A royal celebration developed into Karnataka’s continuing ten-day Nada Habba, combining devotion, procession, music, dance, craft, and public spectacle.','ರಾಜೋತ್ಸವವಾಗಿ ಬೆಳೆದ ಈ ಹಬ್ಬವು ಭಕ್ತಿ, ಮೆರವಣಿಗೆ, ಸಂಗೀತ, ನೃತ್ಯ, ಕರಕುಶಲ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಪ್ರದರ್ಶನಗಳನ್ನು ಒಳಗೊಂಡ ಕರ್ನಾಟಕದ ಹತ್ತು ದಿನಗಳ ಜೀವಂತ ನಾಡಹಬ್ಬವಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-dasara','Ten-day festival, Chamundeshwari worship, procession, music and cultural performances')],review:review('reviewed')
  },
  {
    id:'culture-banavasi-madhukeshwara',name:name('Madhukeshwara Temple at Banavasi','ಬನವಾಸಿಯ ಮಧುಕೇಶ್ವರ ದೇವಾಲಯ'),category:'architecture',date:dateRange(800,1200,'range'),polityIds:['polity-kadamba','polity-kalyani-chalukya'],placeIds:['place-banavasi'],peopleIds:[],relatedWorkIds:[],traditionTags:['Shaiva','temple','layered-monument','Kadamba-capital'],continuity:'continuing-practice',
    description:name('The temple anchors the sacred landscape of the former Kadamba capital, while its surviving fabric records substantial later architectural layers; attribution therefore remains deliberately broad.','ಹಳೆಯ ಕದಂಬ ರಾಜಧಾನಿಯ ಪವಿತ್ರ ಭೂದೃಶ್ಯಕ್ಕೆ ಈ ದೇವಾಲಯ ಕೇಂದ್ರವಾಗಿದೆ; ಉಳಿದಿರುವ ಕಟ್ಟಡದಲ್ಲಿ ನಂತರದ ಕಾಲದ ಪ್ರಮುಖ ವಾಸ್ತು ಪದರಗಳೂ ಇರುವುದರಿಂದ ಇದರ ಕಾಲ–ವಂಶ ಸಂಬಂಧವನ್ನು ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ವಿಶಾಲವಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-banavasi','Madhukeshwara Temple at the centre of Banavasi; present structure described as early Chalukyan')],review:review('needs-review')
  },
  {
    id:'culture-badami-cave-temples',name:name('Badami Cave Temples','ಬಾದಾಮಿ ಗುಹಾ ದೇವಾಲಯಗಳು'),category:'architecture',date:dateRange(550,750,'range'),polityIds:['polity-badami-chalukya'],placeIds:['place-badami-caves'],peopleIds:[],relatedWorkIds:[],traditionTags:['Shaiva','Vaishnava','Jain','rock-cut-architecture','sculpture'],continuity:'material-survival',
    description:name('Four rock-cut caves preserve Hindu and Jain sacred architecture, sculpted programmes, and experiments central to the Early Chalukya artistic landscape.','ನಾಲ್ಕು ಶಿಲಾ-ಕೊರೆತ ಗುಹೆಗಳು ಹಿಂದೂ ಮತ್ತು ಜೈನ ಪವಿತ್ರ ವಾಸ್ತು, ಶಿಲ್ಪ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಆರಂಭಿಕ ಚಾಲುಕ್ಯ ಕಲಾಭೂದೃಶ್ಯದ ಪ್ರಯೋಗಗಳನ್ನು ಉಳಿಸಿಕೊಂಡಿವೆ.'),citations:[citation('src-karnataka-tourism-badami','Four Hindu and Jain caves carved between the sixth and eighth centuries')],review:review('reviewed')
  },
  {
    id:'culture-badami-bhutanatha-temples',name:name('Bhutanatha Temple Group at Badami','ಬಾದಾಮಿಯ ಭೂತನಾಥ ದೇವಾಲಯ ಸಮೂಹ'),category:'architecture',date:dateRange(650,1100,'range'),polityIds:['polity-badami-chalukya','polity-kalyani-chalukya'],placeIds:['place-badami-bhutanatha'],peopleIds:[],relatedWorkIds:[],traditionTags:['Shaiva','sandstone','lakeside-temples','layered-monument'],continuity:'material-survival',
    description:name('The lakeside sandstone shrines record several centuries of temple building around Agastya Lake, rather than a single construction moment.','ಅಗಸ್ತ್ಯ ಸರೋವರದ ತೀರದ ಮರಳುಗಲ್ಲಿನ ದೇವಾಲಯಗಳು ಒಂದೇ ನಿರ್ಮಾಣ ಕ್ಷಣವನ್ನಲ್ಲ, ಹಲವು ಶತಮಾನಗಳ ದೇವಾಲಯ ನಿರ್ಮಾಣವನ್ನು ದಾಖಲಿಸುತ್ತವೆ.'),citations:[citation('src-karnataka-tourism-badami','Bhutanatha lakeside sandstone temple group'),citation('src-karnataka-tourism-aihole','Regional Chalukya heritage circuit')],review:review('needs-review')
  },
  {
    id:'culture-aihole-durga-temple',name:name('Durga Temple at Aihole','ಐಹೊಳೆಯ ದುರ್ಗಾ ದೇವಾಲಯ'),category:'architecture',date:dateRange(600,800,'circa'),polityIds:['polity-badami-chalukya'],placeIds:['place-aihole-durga'],peopleIds:[],relatedWorkIds:[],traditionTags:['Hindu','apsidal-plan','circumambulatory-passage','sandstone'],continuity:'material-survival',
    description:name('Its apsidal plan, elevated platform, and encircling gallery make the Durga Temple a prominent experiment in the Aihole architectural landscape.','ಅರ್ಧವೃತ್ತಾಕಾರದ ವಿನ್ಯಾಸ, ಎತ್ತರದ ಜಗತಿ ಮತ್ತು ಸುತ್ತುವರಿದ ಪ್ರದಕ್ಷಿಣಾ ಮಾರ್ಗವು ದುರ್ಗಾ ದೇವಾಲಯವನ್ನು ಐಹೊಳೆ ವಾಸ್ತುಭೂದೃಶ್ಯದ ಪ್ರಮುಖ ಪ್ರಯೋಗವಾಗಿಸುತ್ತದೆ.'),citations:[citation('src-karnataka-tourism-aihole','Distinctive apsidal plan and wider Aihole temple landscape')],review:review('needs-review')
  },
  {
    id:'culture-aihole-meguti-jain-temple',name:name('Meguti Jain Temple at Aihole','ಐಹೊಳೆಯ ಮೇಗುತಿ ಜೈನ ದೇವಾಲಯ'),category:'architecture',date:dateRange(634,634,'year'),polityIds:['polity-badami-chalukya'],placeIds:['place-aihole-meguti'],peopleIds:['person-pulakeshin-ii'],relatedWorkIds:[],traditionTags:['Jain','structural-temple','inscription','Ravikirti'],continuity:'material-survival',
    description:name('The hilltop Jain temple is inseparable from Ravikirti’s dated Aihole inscription and offers a securely anchored monument within the Chalukya landscape.','ಬೆಟ್ಟದ ಮೇಲಿನ ಈ ಜೈನ ದೇವಾಲಯವು ರವಿಕೀರ್ತಿಯ ದಿನಾಂಕಿತ ಐಹೊಳೆ ಶಾಸನದೊಂದಿಗೆ ಅವಿಭಾಜ್ಯವಾಗಿದ್ದು, ಚಾಲುಕ್ಯ ಭೂದೃಶ್ಯದಲ್ಲಿ ಕಾಲನಿರ್ಣಯಗೊಂಡ ಸ್ಮಾರಕವಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-aihole','Meguti Jain Temple among the principal Aihole monuments'),citation('src-epigraphia-carnatica','Aihole inscription, 634 CE')],review:review('needs-review')
  },
  {
    id:'culture-lakkundi-kashivishveshvara',name:name('Kashivishveshvara Temple at Lakkundi','ಲಕ್ಕುಂಡಿಯ ಕಾಶಿವಿಶ್ವೇಶ್ವರ ದೇವಾಲಯ'),category:'architecture',date:dateRange(1000,1100,'century'),polityIds:['polity-kalyani-chalukya'],placeIds:['place-lakkundi-kashivishveshvara'],peopleIds:[],relatedWorkIds:[],traditionTags:['Shaiva','Kalyani-Chalukya','soapstone','ornament'],continuity:'material-survival',
    description:name('A principal monument in Lakkundi’s dense temple landscape, representing the refined stone architecture associated with the Kalyani Chalukya period.','ಲಕ್ಕುಂಡಿಯ ದಟ್ಟ ದೇವಾಲಯ ಭೂದೃಶ್ಯದ ಪ್ರಮುಖ ಸ್ಮಾರಕವಾದ ಇದು ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯ ಕಾಲದ ಪರಿಷ್ಕೃತ ಶಿಲಾವಾಸ್ತುವನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ.'),citations:[citation('src-karnataka-tourism-lakkundi','Lakkundi as a major Kalyani Chalukya temple and stepwell centre')],review:review('needs-review')
  },
  {
    id:'culture-lakkundi-brahma-jinalaya',name:name('Brahma Jinalaya at Lakkundi','ಲಕ್ಕುಂಡಿಯ ಬ್ರಹ್ಮ ಜಿನಾಲಯ'),category:'architecture',date:dateRange(1000,1100,'century'),polityIds:['polity-kalyani-chalukya'],placeIds:['place-lakkundi-brahma-jinalaya'],peopleIds:[],relatedWorkIds:[],traditionTags:['Jain','basadi','Kalyani-Chalukya','religious-pluralism'],continuity:'material-survival',
    description:name('The Jain basadi is mapped alongside Shaiva monuments to preserve evidence of the religious plurality of medieval Lakkundi.','ಮಧ್ಯಕಾಲೀನ ಲಕ್ಕುಂಡಿಯ ಧಾರ್ಮಿಕ ಬಹುತ್ವದ ಸಾಕ್ಷ್ಯವನ್ನು ಉಳಿಸಲು ಈ ಜೈನ ಬಸದಿಯನ್ನು ಶೈವ ಸ್ಮಾರಕಗಳೊಂದಿಗೆ ಭೂಪಟದಲ್ಲಿ ಗುರುತಿಸಲಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-lakkundi','Jainism and Hinduism flourished together at Lakkundi')],review:review('needs-review')
  },
  {
    id:'culture-lakkundi-musukina-bavi',name:name('Musukina Bavi stepwell at Lakkundi','ಲಕ್ಕುಂಡಿಯ ಮುಸುಕಿನ ಬಾವಿ'),category:'architecture',date:dateRange(1000,1200,'range'),polityIds:['polity-kalyani-chalukya'],placeIds:['place-lakkundi-stepwell'],peopleIds:[],relatedWorkIds:[],traditionTags:['stepwell','water-architecture','civic-architecture','stone-carving'],continuity:'material-survival',
    description:name('Lakkundi’s stepped wells extend the atlas beyond temples by documenting civic water architecture and sculpted niches within the settlement.','ಲಕ್ಕುಂಡಿಯ ಮೆಟ್ಟಿಲು ಬಾವಿಗಳು ದೇವಾಲಯಗಳಾಚೆಗೆ ಪಟ್ಟಣದ ನಾಗರಿಕ ಜಲವಾಸ್ತು ಮತ್ತು ಕೆತ್ತನೆಯ ಗೂಡುಗಳನ್ನು ದಾಖಲಿಸುತ್ತವೆ.'),citations:[citation('src-karnataka-tourism-lakkundi','Lakkundi remembered for an extensive network of stepwells')],review:review('needs-review')
  },
  {
    id:'culture-itagi-mahadeva-1112',name:name('Mahadeva Temple at Itagi, 1112','ಇಟಗಿಯ ಮಹಾದೇವ ದೇವಾಲಯ, 1112'),category:'architecture',date:dateRange(1112,1112,'year'),polityIds:['polity-kalyani-chalukya'],placeIds:['place-itagi-mahadeva'],peopleIds:['person-vikramaditya-vi'],relatedWorkIds:[],traditionTags:['Shaiva','Kalyani-Chalukya','ornate-pillars','royal-commander'],continuity:'material-survival',
    description:name('Built by a commander under Vikramaditya VI, the temple provides a dated reference point for mature Kalyani Chalukya architecture.','ಆರನೇ ವಿಕ್ರಮಾದಿತ್ಯನ ಸೇನಾಧಿಕಾರಿಯೊಬ್ಬ ನಿರ್ಮಿಸಿದ ಈ ದೇವಾಲಯವು ಪರಿಪಕ್ವ ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯ ವಾಸ್ತುಶೈಲಿಗೆ ದಿನಾಂಕಿತ ಉದಾಹರಣೆಯಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-koppal','Mahadeva Temple built in 1112 by a commander of Vikramaditya VI')],review:review('reviewed')
  },
  {
    id:'culture-kalaburagi-jama-masjid-1367',name:name('Jama Masjid within Kalaburagi Fort, 1367','ಕಲಬುರಗಿ ಕೋಟೆಯ ಜಾಮಾ ಮಸೀದಿ, 1367'),category:'architecture',date:dateRange(1367,1367,'year'),polityIds:['external-polity-bahmani'],placeIds:['place-kalaburagi-jama-masjid'],peopleIds:[],relatedWorkIds:[],traditionTags:['Islamic','mosque','fort-complex','domes','arches'],continuity:'continuing-practice',
    description:name('The fortress mosque marks Kalaburagi’s role as a Bahmani capital and broadens the atlas to the Deccan’s congregational and domed architecture.','ಕೋಟೆಯೊಳಗಿನ ಈ ಮಸೀದಿ ಬಹಮನಿ ರಾಜಧಾನಿಯಾಗಿ ಕಲಬುರಗಿಯ ಪಾತ್ರವನ್ನು ಗುರುತಿಸಿ, ದಖ್ಖನ್‌ನ ಸಾಮೂಹಿಕ ಪ್ರಾರ್ಥನಾ ಮತ್ತು ಗುಮ್ಮಟ ವಾಸ್ತುವನ್ನು ಭೂಪಟಕ್ಕೆ ಸೇರಿಸುತ್ತದೆ.'),citations:[citation('src-karnataka-tourism-kalaburagi','Jama Masjid completed in 1367 within the fort complex')],review:review('reviewed')
  },
  {
    id:'culture-bidar-mahmud-gawan-madrasa-1472',name:name('Mahmud Gawan Madrasa at Bidar, 1472','ಬೀದರ್‌ನ ಮಹಮೂದ್ ಗವಾನ್ ಮದರಸಾ, 1472'),category:'architecture',date:dateRange(1472,1472,'year'),polityIds:['external-polity-bahmani'],placeIds:['place-bidar-mahmud-gawan'],peopleIds:[],relatedWorkIds:[],traditionTags:['Islamic','madrasa','education','Persianate','tilework'],continuity:'material-survival',
    description:name('The three-storeyed college joined teaching rooms, residential quarters, a mosque, library, minarets, and coloured tile decoration in a major Deccan centre of learning.','ಮೂರು ಮಹಡಿಗಳ ಈ ವಿದ್ಯಾಕೇಂದ್ರವು ಪಾಠಶಾಲೆಗಳು, ವಸತಿ, ಮಸೀದಿ, ಗ್ರಂಥಾಲಯ, ಮಿನಾರಗಳು ಮತ್ತು ಬಣ್ಣದ ಹಂಚಿನ ಅಲಂಕಾರವನ್ನು ದಖ್ಖನ್‌ನ ಪ್ರಮುಖ ಜ್ಞಾನಕೇಂದ್ರದಲ್ಲಿ ಒಟ್ಟುಗೂಡಿಸಿತು.'),citations:[citation('src-karnataka-tourism-bidar-madrasa','Built by Mahmud Gawan in 1472; college, library, mosque, minarets and tilework')],review:review('reviewed')
  },
  {
    id:'culture-hampi-vittala-complex',name:name('Vittala Temple Complex at Hampi','ಹಂಪಿಯ ವಿಠ್ಠಲ ದೇವಾಲಯ ಸಮುಚ್ಚಯ'),category:'architecture',date:dateRange(1400,1565,'range'),polityIds:['polity-vijayanagara'],placeIds:['place-hampi-vittala'],peopleIds:[],relatedWorkIds:[],traditionTags:['Vaishnava','mandapa','stone-chariot','urban-sacred-complex'],continuity:'material-survival',
    description:name('The large sacred complex, its pillared halls, processional setting, and celebrated stone chariot form one of Hampi’s principal architectural ensembles.','ವಿಶಾಲ ಪವಿತ್ರ ಸಮುಚ್ಚಯ, ಕಂಬದ ಮಂಟಪಗಳು, ಉತ್ಸವ ಮಾರ್ಗದ ಪರಿಸರ ಮತ್ತು ಪ್ರಸಿದ್ಧ ಕಲ್ಲಿನ ರಥವು ಹಂಪಿಯ ಪ್ರಮುಖ ವಾಸ್ತು ಸಮೂಹಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ.'),citations:[citation('src-unesco-hampi','Vitthala complex highlighted among Hampi’s more than 1,600 remains')],review:review('reviewed')
  },
  {
    id:'culture-hampi-krishna-temple-complex',name:name('Krishna Temple Complex at Hampi','ಹಂಪಿಯ ಕೃಷ್ಣ ದೇವಾಲಯ ಸಮುಚ್ಚಯ'),category:'architecture',date:dateRange(1513,1529,'circa'),polityIds:['polity-vijayanagara'],placeIds:['place-hampi-krishna-temple'],peopleIds:['person-krishnadevaraya'],relatedWorkIds:[],traditionTags:['Vaishnava','temple','bazaar','urbanism'],continuity:'material-survival',
    description:name('The temple and its associated bazaar are mapped together as evidence of the close relationship between sacred architecture and urban commerce at the imperial capital.','ದೇವಾಲಯ ಮತ್ತು ಅದರ ಬಜಾರ್ ಅನ್ನು ಸಾಮ್ರಾಜ್ಯ ರಾಜಧಾನಿಯ ಪವಿತ್ರ ವಾಸ್ತು ಮತ್ತು ನಗರ ವಾಣಿಜ್ಯದ ನಿಕಟ ಸಂಬಂಧದ ಸಾಕ್ಷ್ಯವಾಗಿ ಒಟ್ಟಿಗೆ ಗುರುತಿಸಲಾಗಿದೆ.'),citations:[citation('src-unesco-hampi','Krishna temple complex and suburban temple-bazaar systems highlighted')],review:review('needs-review')
  },
  {
    id:'culture-hampi-lotus-mahal',name:name('Lotus Mahal in Hampi’s royal centre','ಹಂಪಿಯ ರಾಜಕೇಂದ್ರದ ಕಮಲ ಮಹಲ್'),category:'architecture',date:dateRange(1400,1565,'range'),polityIds:['polity-vijayanagara'],placeIds:['place-hampi-lotus-mahal'],peopleIds:[],relatedWorkIds:[],traditionTags:['courtly-architecture','royal-centre','arched-pavilion','water-and-garden-setting'],continuity:'material-survival',
    description:name('This pavilion represents the courtly and residential architecture of Hampi’s royal zone, balancing the atlas’s stronger coverage of sacred buildings.','ಈ ಮಂಟಪವು ಹಂಪಿಯ ರಾಜವಲಯದ ಆಸ್ಥಾನ ಮತ್ತು ವಸತಿ ವಾಸ್ತುವನ್ನು ಪ್ರತಿನಿಧಿಸಿ, ಭೂಪಟದಲ್ಲಿನ ಪವಿತ್ರ ಕಟ್ಟಡಗಳ ಹೆಚ್ಚಿನ ವ್ಯಾಪ್ತಿಗೆ ಸಮತೋಲನ ನೀಡುತ್ತದೆ.'),citations:[citation('src-unesco-hampi','Lotus Mahal complex highlighted within Hampi’s royal and urban remains')],review:review('reviewed')
  },
  {
    id:'culture-hampi-elephant-stables',name:name('Elephant Stables at Hampi','ಹಂಪಿಯ ಆನೆ ಸಾಲುಮಂಟಪ'),category:'architecture',date:dateRange(1400,1565,'range'),polityIds:['polity-vijayanagara'],placeIds:['place-hampi-elephant-stables'],peopleIds:[],relatedWorkIds:[],traditionTags:['courtly-architecture','animal-stables','domes','royal-centre'],continuity:'material-survival',
    description:name('The long domed stable range records the logistical and ceremonial infrastructure of the imperial court rather than a sacred function.','ಉದ್ದನೆಯ ಗುಮ್ಮಟ ಸಾಲುಮಂಟಪವು ಪವಿತ್ರ ಕಾರ್ಯಕ್ಕಿಂತ ಸಾಮ್ರಾಜ್ಯ ಆಸ್ಥಾನದ ಸಾಗಣೆ ಮತ್ತು ಸಮಾರಂಭದ ಮೂಲಸೌಕರ್ಯವನ್ನು ದಾಖಲಿಸುತ್ತದೆ.'),citations:[citation('src-unesco-hampi','Stables and royal infrastructure included within Hampi’s surviving remains')],review:review('needs-review')
  },
  {
    id:'culture-chitradurga-fort',name:name('Chitradurga Fort and water-defence system','ಚಿತ್ರದುರ್ಗ ಕೋಟೆ ಮತ್ತು ಜಲ–ರಕ್ಷಣಾ ವ್ಯವಸ್ಥೆ'),category:'architecture',date:dateRange(1568,1779,'range'),polityIds:['external-polity-chitradurga-nayaka','polity-mysore'],placeIds:['place-chitradurga-fort'],peopleIds:[],relatedWorkIds:[],traditionTags:['fort','military-architecture','water-harvesting','Nayaka','living-memory'],continuity:'material-survival',
    description:name('Seven concentric fortifications, gateways, reservoirs, temples, and passages show how architecture, rocky terrain, and water management formed a defensive system.','ಏಳು ಸುತ್ತಿನ ಕೋಟೆಗೋಡೆಗಳು, ಬಾಗಿಲುಗಳು, ಜಲಾಶಯಗಳು, ದೇವಾಲಯಗಳು ಮತ್ತು ದಾರಿಗಳು ವಾಸ್ತು, ಕಲ್ಲಿನ ಭೂದೃಶ್ಯ ಮತ್ತು ಜಲನಿರ್ವಹಣೆ ಹೇಗೆ ರಕ್ಷಣಾ ವ್ಯವಸ್ಥೆಯಾದವು ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತವೆ.'),citations:[citation('src-karnataka-tourism-chitradurga','Nayaka-period expansion, concentric walls, gateways, temples and water systems')],review:review('reviewed')
  },
  {
    id:'culture-gol-gumbaz-vijayapura',name:name('Gol Gumbaz at Vijayapura','ವಿಜಯಪುರದ ಗೋಲ್ ಗುಂಬಜ್'),category:'architecture',date:dateRange(1626,1656,'circa'),polityIds:['external-polity-adil-shahi'],placeIds:['place-gol-gumbaz'],peopleIds:[],relatedWorkIds:[],traditionTags:['Islamic','mausoleum','dome','acoustics','Adil-Shahi'],continuity:'material-survival',
    description:name('The monumental mausoleum of Muhammad Adil Shah is marked for its vast unsupported dome and whispering gallery, central to Vijayapura’s architectural identity.','ಮುಹಮ್ಮದ್ ಆದಿಲ್ ಶಾಹನ ಭವ್ಯ ಸಮಾಧಿಯನ್ನು ಅದರ ವಿಶಾಲ ಆಧಾರರಹಿತ ಗುಮ್ಮಟ ಮತ್ತು ಪಿಸುಮಾತಿನ ಗ್ಯಾಲರಿಗಾಗಿ ಗುರುತಿಸಲಾಗಿದೆ; ಇದು ವಿಜಯಪುರದ ವಾಸ್ತು ಗುರುತಿನ ಕೇಂದ್ರವಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-vijayapura','Gol Gumbaz as Muhammad Adil Shah’s mausoleum, with large dome and whispering gallery')],review:review('needs-review')
  },
  {
    id:'culture-ibrahim-rauza-vijayapura',name:name('Ibrahim Rauza at Vijayapura','ವಿಜಯಪುರದ ಇಬ್ರಾಹಿಂ ರೌಜಾ'),category:'architecture',date:dateRange(1600,1627,'circa'),polityIds:['external-polity-adil-shahi'],placeIds:['place-ibrahim-rauza'],peopleIds:[],relatedWorkIds:[],traditionTags:['Islamic','mausoleum','mosque','garden','Adil-Shahi'],continuity:'material-survival',
    description:name('A mosque and tomb stand on a shared platform within a garden enclosure, forming one of Vijayapura’s most carefully proportioned funerary ensembles.','ಉದ್ಯಾನ ಆವರಣದಲ್ಲಿ ಒಂದೇ ಜಗತಿಯ ಮೇಲೆ ಮಸೀದಿ ಮತ್ತು ಸಮಾಧಿ ನಿಂತಿದ್ದು, ವಿಜಯಪುರದ ಸಮತೋಲನಯುತ ಸ್ಮಾರಕ ಸಮೂಹಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-vijayapura','Mosque and tomb on a common platform within a garden enclosure')],review:review('needs-review')
  },
  {
    id:'culture-srirangapatna-ranganathaswamy',name:name('Ranganathaswamy Temple at Srirangapatna','ಶ್ರೀರಂಗಪಟ್ಟಣದ ರಂಗನಾಥಸ್ವಾಮಿ ದೇವಾಲಯ'),category:'architecture',date:dateRange(900,1800,'range'),polityIds:['polity-western-ganga','polity-hoysala','polity-mysore'],placeIds:['place-srirangapatna-ranganathaswamy'],peopleIds:[],relatedWorkIds:[],traditionTags:['Vaishnava','temple','island-town','layered-monument'],continuity:'continuing-practice',
    description:name('The living temple records the island town’s long occupation through accumulated architectural layers; the broad date range avoids assigning the whole monument to one dynasty.','ಜೀವಂತ ದೇವಾಲಯವು ಹಲವು ವಾಸ್ತು ಪದರಗಳ ಮೂಲಕ ದ್ವೀಪನಗರದ ದೀರ್ಘ ವಾಸವನ್ನು ದಾಖಲಿಸುತ್ತದೆ; ಸಂಪೂರ್ಣ ಸ್ಮಾರಕವನ್ನು ಒಂದೇ ವಂಶಕ್ಕೆ ಸೇರಿಸದಂತೆ ವಿಶಾಲ ಕಾಲವ್ಯಾಪ್ತಿಯನ್ನು ಬಳಸಲಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-srirangapatna-plan','Protected Ranganatha Svami Temple within a continuously occupied island town')],review:review('needs-review')
  },
  {
    id:'culture-srirangapatna-fort',name:name('Srirangapatna island fortifications','ಶ್ರೀರಂಗಪಟ್ಟಣದ ದ್ವೀಪ ಕೋಟೆಗೋಡೆಗಳು'),category:'architecture',date:dateRange(1450,1799,'range'),polityIds:['polity-mysore'],placeIds:['place-srirangapatna-fort'],peopleIds:['person-hyder-ali','person-tipu-sultan'],relatedWorkIds:[],traditionTags:['fort','military-architecture','island-town','siege-landscape'],continuity:'material-survival',
    description:name('Fort walls, gates, moat, breach, dungeons, and the island setting together preserve the military landscape of Mysore’s capital and the 1799 siege.','ಕೋಟೆಗೋಡೆಗಳು, ಬಾಗಿಲುಗಳು, ಕಂದಕ, ಗೋಡೆಭೇದಿತ ಸ್ಥಳ, ಬಂಧೀಖಾನೆಗಳು ಮತ್ತು ದ್ವೀಪ ಪರಿಸರವು ಮೈಸೂರು ರಾಜಧಾನಿ ಹಾಗೂ 1799ರ ಮುತ್ತಿಗೆಯ ಸೈನಿಕ ಭೂದೃಶ್ಯವನ್ನು ಉಳಿಸಿವೆ.'),citations:[citation('src-karnataka-tourism-srirangapatna-plan','Protected fort walls, breach, dungeons, palace remains, fort and moat')],review:review('reviewed')
  },
  {
    id:'culture-daria-daulat-bagh',name:name('Daria Daulat Bagh at Srirangapatna','ಶ್ರೀರಂಗಪಟ್ಟಣದ ದರಿಯಾ ದೌಲತ್ ಬಾಗ್'),category:'architecture',date:dateRange(1778,1784,'range'),polityIds:['polity-mysore'],placeIds:['place-daria-daulat'],peopleIds:['person-hyder-ali','person-tipu-sultan'],relatedWorkIds:[],traditionTags:['palace','garden','painting','Tipu-Sultan','wood-and-plaster'],continuity:'material-survival',
    description:name('The garden palace combines timber, masonry, plaster, floral decoration, and historical paintings that connect architecture with Mysore’s political memory.','ಉದ್ಯಾನ ಅರಮನೆಯ ಮರ, ಕಲ್ಲು, ಗಾರೆ, ಹೂವಿನ ಅಲಂಕಾರ ಮತ್ತು ಐತಿಹಾಸಿಕ ಚಿತ್ರಗಳು ವಾಸ್ತುವನ್ನು ಮೈಸೂರಿನ ರಾಜಕೀಯ ಸ್ಮೃತಿಯೊಂದಿಗೆ ಜೋಡಿಸುತ್ತವೆ.'),citations:[citation('src-karnataka-tourism-daria-daulat','Construction begun by Hyder Ali and completed by Tipu Sultan, 1778–1784; decorated interiors')],review:review('reviewed')
  },
  {
    id:'culture-srirangapatna-gumbaz',name:name('Gumbaz at Srirangapatna','ಶ್ರೀರಂಗಪಟ್ಟಣದ ಗುಂಬಜ್'),category:'architecture',date:dateRange(1780,1800,'circa'),polityIds:['polity-mysore'],placeIds:['place-gumbaz-srirangapatna'],peopleIds:['person-hyder-ali','person-tipu-sultan'],relatedWorkIds:[],traditionTags:['Islamic','mausoleum','garden','Mysore'],continuity:'continuing-practice',
    description:name('The domed mausoleum and garden form part of the island town’s funerary and commemorative landscape associated with Hyder Ali and Tipu Sultan.','ಗುಮ್ಮಟ ಸಮಾಧಿ ಮತ್ತು ಉದ್ಯಾನವು ಹೈದರ್ ಅಲಿ ಹಾಗೂ ಟಿಪ್ಪು ಸುಲ್ತಾನರೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ ದ್ವೀಪನಗರದ ಸಮಾಧಿ–ಸ್ಮಾರಕ ಭೂದೃಶ್ಯದ ಭಾಗವಾಗಿದೆ.'),citations:[citation('src-karnataka-tourism-srirangapatna-plan','Gumbaz containing the tomb of Tipu Sultan listed among protected monuments')],review:review('needs-review')
  },
  {
    id:'culture-mysuru-palace-1912',name:name('Mysuru Palace, completed 1912','ಮೈಸೂರು ಅರಮನೆ, 1912ರಲ್ಲಿ ಪೂರ್ಣ'),category:'architecture',date:dateRange(1897,1912,'range'),polityIds:['polity-mysore'],placeIds:['place-mysuru-palace'],peopleIds:[],relatedWorkIds:[],traditionTags:['palace','Indo-Saracenic','Wadiyar','stained-glass','Dasara'],continuity:'continuing-practice',
    description:name('The present palace combines Indo-Saracenic architecture, stained glass, carved ceilings, glazed tiles, and ceremonial spaces that remain central to Mysuru Dasara.','ಈಗಿನ ಅರಮನೆಯ ಇಂಡೋ–ಸಾರಸೆನಿಕ್ ವಾಸ್ತು, ಬಣ್ಣದ ಗಾಜು, ಕೆತ್ತಿದ ಛಾವಣಿ, ಮೆರುಗು ಹಂಚುಗಳು ಮತ್ತು ಸಮಾರಂಭದ ಸ್ಥಳಗಳು ಮೈಸೂರು ದಸರಾದ ಕೇಂದ್ರವಾಗಿ ಮುಂದುವರಿದಿವೆ.'),citations:[citation('src-karnataka-tourism-mysuru-palace','Present palace completed in 1912; Henry Irwin; Indo-Saracenic style and interiors')],review:review('reviewed')
  },
  {
    id:'culture-kadamba-hunting-archery',name:name('Kadamba hunting and archery traditions','ಕದಂಬರ ಬೇಟೆ ಮತ್ತು ಬಿಲ್ಲುವಿದ್ಯೆ ಪರಂಪರೆ'),category:'games-sports',date:dateRange(400,600,'circa'),polityIds:['polity-kadamba'],placeIds:['place-banavasi'],peopleIds:[],relatedWorkIds:[],traditionTags:['archery','hunting','martial-training','courtly-life'],continuity:'historic',
    description:name('Indicative timeline lead for courtly hunting and archery around Banavasi; the specific game forms, dates and evidence witnesses must be resolved from court texts, inscriptions, visual records, institutional archives and field studies.','ಬನವಾಸಿ ಸುತ್ತಲಿನ ಆಸ್ಥಾನ ಬೇಟೆ ಮತ್ತು ಬಿಲ್ಲುವಿದ್ಯೆಗೆ ಸೂಚಕ ಕಾಲರೇಖಾ ದಾರಿ; ನಿರ್ದಿಷ್ಟ ಆಟರೂಪಗಳು, ದಿನಾಂಕಗಳು ಮತ್ತು ಸಾಕ್ಷ್ಯಗಳನ್ನು ಆಸ್ಥಾನ ಪಠ್ಯಗಳು, ಶಾಸನಗಳು, ದೃಶ್ಯ ದಾಖಲೆಗಳು, ಸಂಸ್ಥಾ ಆರ್ಕೈವ್‌ಗಳು ಮತ್ತು ಕ್ಷೇತ್ರ ಅಧ್ಯಯನಗಳಿಂದ ಇನ್ನೂ ನಿರ್ಧರಿಸಬೇಕು.'),citations:[citation('src-asi-classical-age','Research lead only: resolve martial and hunting culture against specialist primary and art-historical studies')],review:review('needs-review')
  },
  {
    id:'culture-western-ganga-wrestling',name:name('Western Ganga wrestling and physical-training traditions','ಪಶ್ಚಿಮ ಗಂಗರ ಕುಸ್ತಿ ಮತ್ತು ದೈಹಿಕ ತರಬೇತಿ ಪರಂಪರೆ'),category:'games-sports',date:dateRange(350,1000,'range'),polityIds:['polity-western-ganga'],placeIds:['place-talakad'],peopleIds:[],relatedWorkIds:[],traditionTags:['wrestling','physical-training','Jain-court','heroic-culture'],continuity:'historic',
    description:name('Indicative lead for wrestling, strength training and heroic physical culture associated with the Western Ganga court and sacred landscape; item-level textual or visual witnesses remain to be reviewed.','ಪಶ್ಚಿಮ ಗಂಗರ ಆಸ್ಥಾನ ಮತ್ತು ಪವಿತ್ರ ಭೂದೃಶ್ಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಕುಸ್ತಿ, ಬಲಾಭ್ಯಾಸ ಮತ್ತು ವೀರ ದೈಹಿಕ ಸಂಸ್ಕೃತಿಗೆ ಸೂಚಕ ದಾರಿ; ವಸ್ತುಮಟ್ಟದ ಪಠ್ಯ ಅಥವಾ ದೃಶ್ಯ ಸಾಕ್ಷ್ಯಗಳನ್ನು ಇನ್ನೂ ಪರಿಶೀಲಿಸಬೇಕಿದೆ.'),citations:[citation('src-gazetteer-karnataka-1983','Research lead for Western Ganga courtly and physical culture; verify against epigraphic and art-historical studies')],review:review('needs-review')
  },
  {
    id:'culture-badami-chalukya-equestrian',name:name('Badami Chalukya equestrian, elephant and martial display','ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ಕುದುರೆಸವಾರಿ, ಆನೆ ಮತ್ತು ಸೈನಿಕ ಪ್ರದರ್ಶನ'),category:'games-sports',date:dateRange(550,750,'range'),polityIds:['polity-badami-chalukya'],placeIds:['place-badami'],peopleIds:[],relatedWorkIds:[],traditionTags:['equestrian','elephant','archery','military-display'],continuity:'historic',
    description:name('Indicative lead for equestrian, elephant and martial display in the Badami Chalukya court; iconographic panels and military records should be matched before publication.','ಬಾದಾಮಿ ಚಾಲುಕ್ಯರ ಆಸ್ಥಾನದಲ್ಲಿನ ಕುದುರೆಸವಾರಿ, ಆನೆ ಮತ್ತು ಸೈನಿಕ ಪ್ರದರ್ಶನಕ್ಕೆ ಸೂಚಕ ದಾರಿ; ಪ್ರಕಟಣೆಗೆ ಮುನ್ನ ಶಿಲ್ಪಚಿತ್ರಗಳು ಮತ್ತು ಸೈನಿಕ ದಾಖಲೆಗಳನ್ನು ಹೊಂದಿಸಬೇಕು.'),citations:[citation('src-karnataka-tourism-heritage','Research lead for Badami courtly and martial culture; expand with monument-level evidence')],review:review('needs-review')
  },
  {
    id:'culture-rashtrakuta-courtly-games',name:name('Rashtrakuta courtly games and board-game culture','ರಾಷ್ಟ್ರಕೂಟರ ಆಸ್ಥಾನ ಆಟಗಳು ಮತ್ತು ಫಲಕ ಆಟಗಳ ಸಂಸ್ಕೃತಿ'),category:'games-sports',date:dateRange(800,950,'range'),polityIds:['polity-rashtrakuta'],placeIds:['place-manyakheta'],peopleIds:[],relatedWorkIds:[],traditionTags:['board-games','courtly-life','physical-training','elite-culture'],continuity:'historic',
    description:name('Indicative lead for board games and elite leisure at Manyakheta; the precise games and their witnesses require comparison of literary, archaeological and visual sources.','ಮಾನ್ಯಖೇಟದ ಫಲಕ ಆಟಗಳು ಮತ್ತು ಗಣ್ಯರ ವಿರಾಮ ಸಂಸ್ಕೃತಿಗೆ ಸೂಚಕ ದಾರಿ; ನಿಖರ ಆಟಗಳು ಮತ್ತು ಅವುಗಳ ಸಾಕ್ಷ್ಯಗಳಿಗೆ ಸಾಹಿತ್ಯ, ಪುರಾತತ್ವ ಮತ್ತು ದೃಶ್ಯ ಮೂಲಗಳ ಹೋಲಿಕೆ ಅಗತ್ಯ.'),citations:[citation('src-gazetteer-karnataka-1983','Research lead for Rashtrakuta courtly leisure; verify with literary and archaeological sources')],review:review('needs-review')
  },
  {
    id:'culture-hoysala-wrestling-martial',name:name('Hoysala wrestling, martial exercise and festival contests','ಹೊಯ್ಸಳರ ಕುಸ್ತಿ, ಸೈನಿಕ ವ್ಯಾಯಾಮ ಮತ್ತು ಉತ್ಸವ ಸ್ಪರ್ಧೆಗಳು'),category:'games-sports',date:dateRange(1100,1300,'range'),polityIds:['polity-hoysala'],placeIds:['place-halebidu'],peopleIds:[],relatedWorkIds:[],traditionTags:['wrestling','martial-training','festival-contest','courtly-life'],continuity:'historic',
    description:name('Indicative lead for wrestling and festival contests in Hoysala courtly life; sculptural and inscriptional references need independent identification before attribution.','ಹೊಯ್ಸಳರ ಆಸ್ಥಾನ ಜೀವನದಲ್ಲಿನ ಕುಸ್ತಿ ಮತ್ತು ಉತ್ಸವ ಸ್ಪರ್ಧೆಗಳಿಗೆ ಸೂಚಕ ದಾರಿ; ಶಿಲ್ಪ ಮತ್ತು ಶಾಸನ ಉಲ್ಲೇಖಗಳನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಗುರುತಿಸಿದ ಬಳಿಕವೇ ನಿಗದಿ ಮಾಡಬೇಕು.'),citations:[citation('src-karnataka-tourism-heritage','Research lead for Hoysala athletic and festival culture; verify with temple sculpture and inscriptions')],review:review('needs-review')
  },
  {
    id:'culture-vijayanagara-athletic-court',name:name('Vijayanagara athletic court: wrestling, archery and equestrian display','ವಿಜಯನಗರದ ಕ್ರೀಡಾ ಆಸ್ಥಾನ: ಕುಸ್ತಿ, ಬಿಲ್ಲುವಿದ್ಯೆ ಮತ್ತು ಕುದುರೆಸವಾರಿ ಪ್ರದರ್ಶನ'),category:'games-sports',date:dateRange(1336,1565,'range'),polityIds:['polity-vijayanagara'],placeIds:['place-hampi'],peopleIds:[],relatedWorkIds:[],traditionTags:['wrestling','archery','equestrian','elephant','royal-ceremony'],continuity:'historic',
    description:name('Indicative lead for wrestling, archery, horse and elephant display within Vijayanagara’s ceremonial court; Hampi’s visual and travel accounts should be cited item by item.','ವಿಜಯನಗರದ ಸಮಾರಂಭದ ಆಸ್ಥಾನದಲ್ಲಿನ ಕುಸ್ತಿ, ಬಿಲ್ಲುವಿದ್ಯೆ, ಕುದುರೆ ಮತ್ತು ಆನೆ ಪ್ರದರ್ಶನಕ್ಕೆ ಸೂಚಕ ದಾರಿ; ಹಂಪಿಯ ದೃಶ್ಯ ಮತ್ತು ಪ್ರವಾಸಿ ವರದಿಗಳಿಗೆ ವಸ್ತುಮಟ್ಟದ ಉಲ್ಲೇಖಗಳನ್ನು ಸೇರಿಸಬೇಕು.'),citations:[citation('src-unesco-hampi','Hampi royal-centre research lead; sports interpretation requires specialist source')],review:review('needs-review')
  },
  {
    id:'culture-mysuru-dasara-equestrian',name:name('Mysuru Dasara equestrian and martial display','ಮೈಸೂರು ದಸರಾ ಕುದುರೆಸವಾರಿ ಮತ್ತು ಸೈನಿಕ ಪ್ರದರ್ಶನ'),category:'games-sports',date:dateRange(1610,1947,'range'),polityIds:['polity-mysore'],placeIds:['place-mysuru'],peopleIds:[],relatedWorkIds:[],traditionTags:['equestrian','procession','martial-display','Dasara'],continuity:'continuing-practice',
    description:name('Indicative lead for equestrian and martial display within the Mysuru Dasara procession; ceremonial records, photographs and palace archives should refine the dates and forms.','ಮೈಸೂರು ದಸರಾ ಮೆರವಣಿಗೆಯಲ್ಲಿನ ಕುದುರೆಸವಾರಿ ಮತ್ತು ಸೈನಿಕ ಪ್ರದರ್ಶನಕ್ಕೆ ಸೂಚಕ ದಾರಿ; ಸಮಾರಂಭದ ದಾಖಲೆಗಳು, ಛಾಯಾಚಿತ್ರಗಳು ಮತ್ತು ಅರಮನೆ ಆರ್ಕೈವ್‌ಗಳು ದಿನಾಂಕ ಮತ್ತು ರೂಪಗಳನ್ನು ನಿಖರಗೊಳಿಸಬೇಕು.'),citations:[citation('src-karnataka-tourism-dasara','Festival procession and ceremonial programme; expand with archival sport evidence')],review:review('needs-review')
  },
  {
    id:'culture-colonial-bengaluru-sports',name:name('Colonial Bengaluru clubs and imported field sports','ವಸಾಹತು ಕಾಲದ ಬೆಂಗಳೂರಿನ ಕ್ಲಬ್‌ಗಳು ಮತ್ತು ಪರಿಚಯವಾದ ಮೈದಾನ ಕ್ರೀಡೆಗಳು'),category:'games-sports',date:dateRange(1800,1947,'range'),polityIds:['polity-mysore'],placeIds:['place-bengaluru'],peopleIds:[],relatedWorkIds:[],traditionTags:['cricket','hockey','football','clubs','colonial-period'],continuity:'historic',
    description:name('Indicative lead for cricket, hockey, football and club institutions in colonial Bengaluru; club registers, newspapers and municipal archives are needed for a sourced city history.','ವಸಾಹತು ಕಾಲದ ಬೆಂಗಳೂರಿನ ಕ್ರಿಕೆಟ್, ಹಾಕಿ, ಫುಟ್ಬಾಲ್ ಮತ್ತು ಕ್ಲಬ್ ಸಂಸ್ಥೆಗಳಿಗೆ ಸೂಚಕ ದಾರಿ; ಮೂಲಾಧಾರಿತ ನಗರ ಇತಿಹಾಸಕ್ಕಾಗಿ ಕ್ಲಬ್ ನೋಂದಣಿಗಳು, ಪತ್ರಿಕೆಗಳು ಮತ್ತು ನಗರಪಾಲಿಕೆ ಆರ್ಕೈವ್‌ಗಳು ಅಗತ್ಯ.'),citations:[citation('src-gazetteer-karnataka-1983','Research lead for colonial urban institutions and sport; verify with club archives')],review:review('needs-review')
  },
  {
    id:'culture-modern-karnataka-indigenous-games',name:name('Modern Karnataka indigenous games and community sport','ಆಧುನಿಕ ಕರ್ನಾಟಕದ ಸ್ಥಳೀಯ ಆಟಗಳು ಮತ್ತು ಸಮುದಾಯ ಕ್ರೀಡೆ'),category:'games-sports',date:dateRange(1947,2026,'range'),polityIds:['polity-mysore'],placeIds:['place-bengaluru'],peopleIds:[],relatedWorkIds:[],traditionTags:['kabaddi','indigenous-games','community-sport','school-sport'],continuity:'continuing-practice',
    description:name('Indicative contemporary layer for kabaddi and other community games carried through schools, akhadas and local festivals; district-level documentation and living practitioners should be added.','ಶಾಲೆಗಳು, ಅಖಾಡಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಹಬ್ಬಗಳ ಮೂಲಕ ಮುಂದುವರಿದ ಕಬಡ್ಡಿ ಹಾಗೂ ಇತರ ಸಮುದಾಯ ಆಟಗಳಿಗೆ ಸೂಚಕ ಸಮಕಾಲೀನ ಪದರ; ಜಿಲ್ಲಾಮಟ್ಟದ ದಾಖಲೆ ಮತ್ತು ಜೀವಂತ ಆಟಗಾರರ ಸಾಕ್ಷ್ಯವನ್ನು ಸೇರಿಸಬೇಕು.'),citations:[citation('src-karnataka-tourism-heritage','Statewide heritage discovery lead; add district sports archives and practitioner interviews')],review:review('needs-review')
  }
]

atlasData.reigns = [
  {
    id:'reign-pulakeshin-ii-badami-chalukya',name:name('Reign of Pulakeshin II, c. 610–642','ಎರಡನೇ ಪುಲಕೇಶಿಯ ಆಳ್ವಿಕೆ, ಸು. 610–642'),periodType:'reign',polityId:'polity-badami-chalukya',rulerIds:['person-pulakeshin-ii'],capitalIds:['place-badami'],date:dateRange(610,642,'circa'),
    description:name('The imperial phase associated with Chalukya expansion and the check to Harsha near the Narmada.','ಚಾಲುಕ್ಯರ ವಿಸ್ತರಣೆ ಮತ್ತು ನರ್ಮದೆಯ ಬಳಿ ಹರ್ಷನ ಮುನ್ನಡೆಯನ್ನು ತಡೆದ ಸಾಮ್ರಾಜ್ಯ ಹಂತ.'),citations:[citation('src-maharashtra-gazetteer-chalukyas','Pulakeshin II, expansion, Harsha victory, and the 642 capture of Vatapi')],review:review('needs-review')
  },
  {
    id:'reign-vatapi-disruption-642-654',name:name('Vatapi disruption after the Pallava capture, c. 642–654','ಪಲ್ಲವರ ವಶದ ನಂತರ ವಾತಾಪಿಯ ವ್ಯತ್ಯಯ, ಸು. 642–654'),periodType:'political-phase',polityId:'polity-badami-chalukya',rulerIds:[],capitalIds:['place-badami'],date:dateRange(642,654,'circa'),
    description:name('A period of disrupted central authority after Vatapi was captured; it should not be represented as stable Pallava control over the entire Chalukya realm.','ವಾತಾಪಿ ವಶವಾದ ನಂತರ ಕೇಂದ್ರಾಧಿಕಾರ ವ್ಯತ್ಯಯಗೊಂಡ ಅವಧಿ; ಇದನ್ನು ಇಡೀ ಚಾಲುಕ್ಯ ಪ್ರದೇಶದ ಮೇಲಿನ ಸ್ಥಿರ ಪಲ್ಲವ ಆಳ್ವಿಕೆ ಎಂದು ತೋರಿಸಬಾರದು.'),citations:[citation('src-maharashtra-gazetteer-chalukyas','Administrative disruption and delayed restoration after the capture of Badami')],review:review('needs-review')
  },
  {
    id:'reign-vikramaditya-i-badami-chalukya',name:name('Reign of Vikramaditya I, c. 655–681','ಮೊದಲ ವಿಕ್ರಮಾದಿತ್ಯನ ಆಳ್ವಿಕೆ, ಸು. 655–681'),periodType:'reign',polityId:'polity-badami-chalukya',rulerIds:['person-vikramaditya-i'],capitalIds:['place-badami'],date:dateRange(655,681,'circa'),
    description:name('The restoration phase in which Chalukya sovereignty and the political centre at Vatapi were re-established.','ಚಾಲುಕ್ಯ ಸಾರ್ವಭೌಮತ್ವ ಮತ್ತು ವಾತಾಪಿಯ ರಾಜಕೀಯ ಕೇಂದ್ರವನ್ನು ಮರುಸ್ಥಾಪಿಸಿದ ಹಂತ.'),citations:[citation('src-maharashtra-gazetteer-chalukyas','Vikramaditya I and restoration of ancestral sovereignty')],review:review('needs-review')
  },
  {
    id:'reign-vikramaditya-ii-badami-chalukya',name:name('Reign of Vikramaditya II, c. 733–746','ಎರಡನೇ ವಿಕ್ರಮಾದಿತ್ಯನ ಆಳ್ವಿಕೆ, ಸು. 733–746'),periodType:'reign',polityId:'polity-badami-chalukya',rulerIds:['person-vikramaditya-ii'],capitalIds:['place-badami'],date:dateRange(733,746,'circa'),
    description:name('A late imperial phase associated with campaigns into Pallava territory and Kanchi.','ಪಲ್ಲವರ ಪ್ರದೇಶ ಮತ್ತು ಕಾಂಚಿಯತ್ತ ನಡೆದ ದಂಡಯಾತ್ರೆಗಳೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ ಕೊನೆಯ ಸಾಮ್ರಾಜ್ಯ ಹಂತ.'),citations:[citation('src-asi-early-history','Vikramaditya II campaigns; dates and territorial interpretation require epigraphic review')],review:review('needs-review')
  },
  {
    id:'reign-dantidurga-rashtrakuta',name:name('Reign of Dantidurga, c. 753–756','ದಂತಿದುರ್ಗನ ಆಳ್ವಿಕೆ, ಸು. 753–756'),periodType:'reign',polityId:'polity-rashtrakuta',rulerIds:['person-dantidurga'],capitalIds:[],date:dateRange(753,756,'circa'),
    description:name('The transition from Chalukya subordination to Rashtrakuta imperial sovereignty.','ಚಾಲುಕ್ಯರ ಅಧೀನತೆಯಿಂದ ರಾಷ್ಟ್ರಕೂಟ ಸಾಮ್ರಾಜ್ಯ ಸಾರ್ವಭೌಮತ್ವಕ್ಕೆ ನಡೆದ ಪರಿವರ್ತನೆ.'),citations:[citation('src-asi-rashtrakutas','Dantidurga and the overthrow of Chalukya supremacy')],review:review('needs-review')
  },
  {
    id:'reign-govinda-iii-rashtrakuta',name:name('Reign of Govinda III, c. 793–814','ಮೂರನೇ ಗೋವಿಂದನ ಆಳ್ವಿಕೆ, ಸು. 793–814'),periodType:'reign',polityId:'polity-rashtrakuta',rulerIds:['person-govinda-iii'],capitalIds:[],date:dateRange(793,814,'circa'),
    description:name('A period of exceptional military reach from Kannauj toward the far south, without implying uniform direct administration across that reach.','ಕನ್ನೌಜ್‌ನಿಂದ ದೂರದ ದಕ್ಷಿಣದವರೆಗೆ ಅಪಾರ ಸೈನಿಕ ತಲುಪುವಿಕೆಯ ಅವಧಿ; ಆ ಸಂಪೂರ್ಣ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಏಕರೂಪ ನೇರ ಆಡಳಿತವಿತ್ತು ಎಂಬ ಅರ್ಥವಲ್ಲ.'),citations:[citation('src-asi-rashtrakutas','Govinda III northern and southern campaigns and imperial prestige')],review:review('needs-review')
  },
  {
    id:'reign-amoghavarsha-i-rashtrakuta',name:name('Reign of Amoghavarsha I, c. 814–878','ಮೊದಲ ಅಮೋಘವರ್ಷನ ಆಳ್ವಿಕೆ, ಸು. 814–878'),periodType:'reign',polityId:'polity-rashtrakuta',rulerIds:['person-amoghavarsha-i'],capitalIds:['place-manyakheta'],date:dateRange(814,878,'circa'),
    description:name('A long reign during which Manyakheta became the principal imperial and cultural centre.','ಮಾನ್ಯಖೇಟ ಪ್ರಮುಖ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕೇಂದ್ರವಾದ ದೀರ್ಘ ಆಳ್ವಿಕೆ.'),citations:[citation('src-asi-rashtrakutas','Accession in 814 and the Manyakheta-centred imperial phase')],review:review('needs-review')
  },
  {
    id:'reign-vishnuvardhana-hoysala',name:name('Reign of Vishnuvardhana, c. 1108–1152','ವಿಷ್ಣುವರ್ಧನನ ಆಳ್ವಿಕೆ, ಸು. 1108–1152'),periodType:'reign',polityId:'polity-hoysala',rulerIds:['person-vishnuvardhana'],capitalIds:['place-belur','place-halebidu'],date:dateRange(1108,1152,'circa'),
    description:name('An expanding Hoysala phase governed from the linked royal centres of Belur and Halebidu.','ಬೇಲೂರು ಮತ್ತು ಹಳೇಬೀಡು ಎಂಬ ಸಂಯೋಜಿತ ರಾಜಕೇಂದ್ರಗಳಿಂದ ಆಡಳಿತ ನಡೆಸಿದ ವಿಸ್ತರಣೆಯ ಹೊಯ್ಸಳ ಹಂತ.'),citations:[citation('src-unesco-hoysala-dossier','Vishnuvardhana ruled from Belur and Halebidu; cultural and administrative roles')],review:review('needs-review')
  },
  {
    id:'reign-ballala-ii-hoysala',name:name('Reign of Veera Ballala II, 1173–1220','ವೀರ ಬಲ್ಲಾಳ IIರ ಆಳ್ವಿಕೆ, 1173–1220'),periodType:'reign',polityId:'polity-hoysala',rulerIds:['person-ballala-ii'],capitalIds:['place-halebidu'],date:dateRange(1173,1220,'range'),
    description:name('The Hoysala kingdom’s largest documented extent and assertion of independent sovereignty.','ಹೊಯ್ಸಳ ರಾಜ್ಯದ ದಾಖಲಾದ ಅತಿ ದೊಡ್ಡ ವ್ಯಾಪ್ತಿ ಮತ್ತು ಸ್ವತಂತ್ರ ಸಾರ್ವಭೌಮತ್ವದ ಸ್ಥಾಪನೆಯ ಹಂತ.'),citations:[citation('src-unesco-hoysala-dossier','Ballala II; kingdom at its largest extent')],review:review('needs-review')
  },
  {
    id:'reign-ballala-iii-hoysala',name:name('Reign of Veera Ballala III, c. 1292–1342','ವೀರ ಬಲ್ಲಾಳ IIIರ ಆಳ್ವಿಕೆ, ಸು. 1292–1342'),periodType:'reign',polityId:'polity-hoysala',rulerIds:['person-ballala-iii'],capitalIds:['place-halebidu'],date:dateRange(1292,1342,'circa'),
    description:name('A late Hoysala phase exposed to repeated northern invasions, including the 1311 campaign to Dwarasamudra.','1311ರ ದ್ವಾರಸಮುದ್ರ ದಂಡಯಾತ್ರೆ ಸೇರಿದಂತೆ ಪುನರಾವರ್ತಿತ ಉತ್ತರದ ದಾಳಿಗಳಿಗೆ ಒಳಗಾದ ಕೊನೆಯ ಹೊಯ್ಸಳ ಹಂತ.'),citations:[citation('src-asi-early-history','Malik Kafur campaign and late Hoysala political context')],review:review('needs-review')
  },
  {
    id:'reign-hyder-ali-mysore',name:name('Hyder Ali’s de facto rule, 1761–1782','ಹೈದರ್ ಅಲಿಯ ವಾಸ್ತವಿಕ ಆಡಳಿತ, 1761–1782'),periodType:'regency',polityId:'polity-mysore',rulerIds:['person-hyder-ali'],capitalIds:['place-srirangapatna'],date:dateRange(1761,1782,'range'),
    description:name('A military-state phase centred on Srirangapatna while the Wadiyar dynasty remained nominally in place.','ಒಡೆಯರ್ ವಂಶ ನಾಮಮಾತ್ರವಾಗಿ ಮುಂದುವರಿದಾಗ ಶ್ರೀರಂಗಪಟ್ಟಣ ಕೇಂದ್ರಿತ ಸೈನಿಕ ರಾಜ್ಯದ ಹಂತ.'),citations:[citation('src-unesco-srirangapatna','Srirangapatna as the political centre during Haidar Ali and Tipu Sultan, 1761–1799')],review:review('needs-review')
  },
  {
    id:'reign-tipu-sultan-mysore',name:name('Reign of Tipu Sultan, 1782–1799','ಟಿಪ್ಪು ಸುಲ್ತಾನರ ಆಳ್ವಿಕೆ, 1782–1799'),periodType:'reign',polityId:'polity-mysore',rulerIds:['person-tipu-sultan'],capitalIds:['place-srirangapatna'],date:dateRange(1782,1799,'range'),
    description:name('The Srirangapatna-centred phase of Mysore’s wars, diplomacy, territorial contraction, and final defeat.','ಮೈಸೂರಿನ ಯುದ್ಧಗಳು, ರಾಜತಾಂತ್ರಿಕತೆ, ಭೂಪ್ರದೇಶ ಕುಗ್ಗುವಿಕೆ ಮತ್ತು ಅಂತಿಮ ಸೋಲಿನ ಶ್ರೀರಂಗಪಟ್ಟಣ ಕೇಂದ್ರಿತ ಹಂತ.'),citations:[citation('src-unesco-srirangapatna','Capital through 1799 and political centre under Tipu Sultan')],review:review('needs-review')
  },
  {
    id:'reign-krishnaraja-iii-mysore',name:name('Reign of Krishnaraja Wadiyar III, 1799–1868','ಮೂರನೇ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್ ಆಳ್ವಿಕೆ, 1799–1868'),periodType:'reign',polityId:'polity-mysore',rulerIds:['person-krishnaraja-iii'],capitalIds:['place-mysuru'],date:dateRange(1799,1868,'range'),
    description:name('The restored, territorially reduced princely state with its royal capital returned to Mysuru.','ರಾಜಧಾನಿ ಮೈಸೂರಿಗೆ ಮರಳಿದ, ಭೂಪ್ರದೇಶದಲ್ಲಿ ಕುಗ್ಗಿದ ಮರುಸ್ಥಾಪಿತ ಸಂಸ್ಥಾನದ ಹಂತ.'),citations:[citation('src-asi-mysore-city','Restoration after 1799 and Mysuru as the royal capital')],review:review('needs-review')
  },
  {
    id:'reign-jayachamarajendra-mysore',name:name('Jayachamarajendra Wadiyar and accession, 1940–1947','ಜಯಚಾಮರಾಜೇಂದ್ರ ಒಡೆಯರ್ ಮತ್ತು ಸೇರ್ಪಡೆ, 1940–1947'),periodType:'reign',polityId:'polity-mysore',rulerIds:['person-jayachamarajendra'],capitalIds:['place-mysuru'],date:dateRange(1940,1947,'range'),
    description:name('The final monarchical period leading to Mysore’s accession to the Union of India.','ಮೈಸೂರು ಭಾರತ ಒಕ್ಕೂಟಕ್ಕೆ ಸೇರ್ಪಡೆಯಾಗುವವರೆಗೆ ನಡೆದ ಕೊನೆಯ ರಾಜಸತ್ತಾತ್ಮಕ ಅವಧಿ.'),citations:[citation('src-constitution-mysore','Instrument of Accession signed in August 1947')],review:review('needs-review')
  },
  {
    id:'reign-krishnadevaraya-vijayanagara',name:name('Reign of Krishnadevaraya, 1509–1530','ಕೃಷ್ಣದೇವರಾಯರ ಆಳ್ವಿಕೆ, 1509–1530'),
    periodType:'reign',polityId:'polity-vijayanagara',rulerIds:['person-krishnadevaraya'],capitalIds:['place-hampi'],date:dateRange(1509,1530,'year'),
    description:name('A dated research period for comparing territorial evidence during Vijayanagara’s documented apogee.','ವಿಜಯನಗರದ ದಾಖಲಾದ ಉಚ್ಛ್ರಾಯದ ಕಾಲದ ಭೂಪ್ರದೇಶ ಸಾಕ್ಷ್ಯವನ್ನು ಹೋಲಿಸಲು ಬಳಸುವ ದಿನಾಂಕಿತ ಸಂಶೋಧನಾ ಅವಧಿ.'),
    citations:[citation('src-unesco-hampi','Krishna Deva Raya, 1509–1530; period identified as the empire’s apogee')],review:review('needs-review')
  },
  {
    id:'reign-rama-raya-regency',name:name('Rama Raya regency, 1542–1565','ರಾಮರಾಯರ ಪ್ರಭುತ್ವ, 1542–1565'),
    periodType:'regency',polityId:'polity-vijayanagara',rulerIds:['person-rama-raya'],capitalIds:['place-hampi'],date:dateRange(1542,1565,'range'),
    description:name('The late Hampi political period ending with the defeat at Talikota in 1565.','1565ರ ತಾಳಿಕೋಟೆ ಸೋಲಿನೊಂದಿಗೆ ಅಂತ್ಯಗೊಂಡ ಹಂಪಿಯ ಕೊನೆಯ ರಾಜಕೀಯ ಹಂತ.'),
    citations:[citation('src-unesco-hampi','Battle of Talikota and destruction of the capital in 1565')],review:review('needs-review')
  },
  {
    id:'reign-vijayanagara-penukonda-reconstitution',name:name('Vijayanagara reconstitution at Penukonda, from 1566','ಪೆನುಕೊಂಡದಲ್ಲಿ ವಿಜಯನಗರದ ಪುನರ್-ರಚನೆ, 1566ರಿಂದ'),
    periodType:'political-phase',polityId:'polity-vijayanagara',rulerIds:[],capitalIds:['place-penukonda'],date:dateRange(1566,1585,'range'),
    description:name('A greatly reduced Vijayanagara state reconstituted at Penukonda after the 1565 defeat.','1565ರ ಸೋಲಿನ ನಂತರ ಪೆನುಕೊಂಡದಲ್ಲಿ ಬಹಳಷ್ಟು ಕುಗ್ಗಿದ ವಿಜಯನಗರ ರಾಜ್ಯವು ಪುನರ್-ರಚಿತವಾದ ರಾಜಕೀಯ ಹಂತ.'),
    citations:[citation('src-cambridge-deccan-courts','By 1566 a greatly reduced state had been reconstituted with its capital at Penukonda')],review:review('needs-review')
  }
]

atlasData.territorialExtents = [
  ...atlasData.polities.map(polity => ({
    id:`extent-${polity.id.replace('polity-','')}-core-prototype`,
    name:name(`${polity.name.en} core extent (prototype)`,`${polity.name.kn} ಮೂಲ ಆಡಳಿತ ವ್ಯಾಪ್ತಿ (ಪ್ರಾಯೋಗಿಕ)`),
    classification:'core-administered', controlLevel:'direct', duration:'sustained', confidence:'low', snapshotKind:'prototype', snapshotYear:null, reignId:null,
    date:{...polity.date}, polityIds:[polity.id], relatedEventIds:[],
    geometry:{...polity.extent,coordinates:polity.extent.coordinates.map(point=>[...point])},
    description:name('A schematic working extent inherited from the prototype; it is not a surveyed historical boundary.','ಪ್ರಾಯೋಗಿಕ ಮಾದರಿಯಿಂದ ಪಡೆದ ಅಂದಾಜು ವ್ಯಾಪ್ತಿ; ಇದು ಸಮೀಕ್ಷಿತ ಐತಿಹಾಸಿಕ ಗಡಿ ಅಲ್ಲ.'),
    citations:[citation('src-prototype-boundaries','Prototype synthesis; requires source-by-source boundary review')], review:review('needs-review')
  })),
  {
    id:'extent-badami-chalukya-pulakeshin-ii-618',name:name('Badami Chalukya core under Pulakeshin II, c. 618','ಎರಡನೇ ಪುಲಕೇಶಿಯ ಕಾಲದ ಬಾದಾಮಿ ಚಾಲುಕ್ಯ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 618'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:618,reignId:'reign-pulakeshin-ii-badami-chalukya',date:dateRange(610,642,'circa'),polityIds:['polity-badami-chalukya'],relatedEventIds:['event-pulakeshin-repels-harsha'],
    geometry:{type:'Polygon',coordinates:[[73.2,21.8],[78.2,21.8],[80.0,18.1],[78.7,14.0],[74.3,13.5],[72.9,17.0]],precision:'schematic'},description:name('A low-confidence core comparison envelope at the time of the Narmada victory; the wider campaign and suzerainty claims are not treated as uniform direct rule.','ನರ್ಮದಾ ವಿಜಯದ ಕಾಲದ ಕಡಿಮೆ-ವಿಶ್ವಾಸದ ಮೂಲ ಹೋಲಿಕೆ ವ್ಯಾಪ್ತಿ; ವ್ಯಾಪಕ ದಂಡಯಾತ್ರೆ ಮತ್ತು ಅಧಿಪತ್ಯದ ಹಕ್ಕುಗಳನ್ನು ಏಕರೂಪ ನೇರ ಆಳ್ವಿಕೆ ಎಂದು ಪರಿಗಣಿಸಲಾಗಿಲ್ಲ.'),citations:[citation('src-maharashtra-gazetteer-chalukyas','Pulakeshin II expansion and victory over Harsha'),citation('src-prototype-boundaries','Schematic analytical geometry')],review:review('needs-review')
  },
  {
    id:'extent-vatapi-pallava-occupation-642-654',name:name('Pallava occupation zone at Vatapi, c. 642–654','ವಾತಾಪಿಯಲ್ಲಿನ ಪಲ್ಲವ ವಶದ ವಲಯ, ಸು. 642–654'),classification:'temporary-occupation',controlLevel:'temporary',duration:'intermittent',confidence:'medium',snapshotKind:'political-phase',snapshotYear:642,reignId:'reign-vatapi-disruption-642-654',date:dateRange(642,654,'circa'),polityIds:['external-polity-pallava','polity-badami-chalukya'],relatedEventIds:['event-vatapi-captured','event-vatapi-sovereignty-restored'],
    geometry:{type:'Polygon',coordinates:[[75.45,15.72],[75.92,15.72],[75.92,16.12],[75.45,16.12]],precision:'schematic'},description:name('This compact zone marks attested occupation of the capital and nearby study area, not Pallava administration of the full former Chalukya realm.','ಈ ಸಣ್ಣ ವಲಯವು ರಾಜಧಾನಿ ಮತ್ತು ಸಮೀಪದ ಅಧ್ಯಯನ ಪ್ರದೇಶದ ದಾಖಲಾದ ವಶವನ್ನು ಸೂಚಿಸುತ್ತದೆ; ಹಿಂದಿನ ಇಡೀ ಚಾಲುಕ್ಯ ಪ್ರದೇಶದ ಪಲ್ಲವ ಆಡಳಿತವನ್ನಲ್ಲ.'),citations:[citation('src-maharashtra-gazetteer-chalukyas','Capture of Badami, disruption, and restoration')],review:review('needs-review')
  },
  {
    id:'extent-badami-chalukya-vikramaditya-i-655',name:name('Restored Badami Chalukya core under Vikramaditya I, c. 655','ಮೊದಲ ವಿಕ್ರಮಾದಿತ್ಯನ ಕಾಲದ ಮರುಸ್ಥಾಪಿತ ಚಾಲುಕ್ಯ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 655'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:655,reignId:'reign-vikramaditya-i-badami-chalukya',date:dateRange(655,681,'circa'),polityIds:['polity-badami-chalukya'],relatedEventIds:['event-vatapi-sovereignty-restored'],
    geometry:{type:'Polygon',coordinates:[[74.0,18.8],[77.8,19.0],[79.0,16.2],[78.0,14.1],[74.5,14.0],[73.7,16.3]],precision:'schematic'},description:name('A conservative envelope for the restored polity; distant provincial authority recovered unevenly and requires inscription-level review.','ಮರುಸ್ಥಾಪಿತ ರಾಜ್ಯದ ಮಿತಗೊಳಿಸಿದ ವ್ಯಾಪ್ತಿ; ದೂರದ ಪ್ರಾಂತೀಯ ಅಧಿಕಾರ ಅಸಮಾನವಾಗಿ ಮರಳಿದ್ದು ಶಾಸನಮಟ್ಟದ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'),citations:[citation('src-maharashtra-gazetteer-chalukyas','Vikramaditya I restored Chalukya sovereignty after 655'),citation('src-prototype-boundaries','Conservative schematic geometry')],review:review('needs-review')
  },
  {
    id:'extent-badami-chalukya-vikramaditya-ii-733',name:name('Badami Chalukya core under Vikramaditya II, c. 733','ಎರಡನೇ ವಿಕ್ರಮಾದಿತ್ಯನ ಕಾಲದ ಚಾಲುಕ್ಯ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 733'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:733,reignId:'reign-vikramaditya-ii-badami-chalukya',date:dateRange(733,746,'circa'),polityIds:['polity-badami-chalukya'],relatedEventIds:['event-vikramaditya-takes-kanchi'],
    geometry:{type:'Polygon',coordinates:[[73.8,19.2],[78.0,19.3],[79.2,16.2],[78.2,13.9],[74.3,14.1],[73.5,16.7]],precision:'schematic'},description:name('A late-dynasty core snapshot; the Kanchi expedition is displayed as campaign evidence rather than permanent Chalukya territory.','ವಂಶದ ಕೊನೆಯ ಹಂತದ ಮೂಲ snapshot; ಕಾಂಚಿ ದಂಡಯಾತ್ರೆಯನ್ನು ಶಾಶ್ವತ ಚಾಲುಕ್ಯ ಪ್ರದೇಶದ ಬದಲು ದಂಡಯಾತ್ರೆಯ ಸಾಕ್ಷ್ಯವಾಗಿ ತೋರಿಸಲಾಗಿದೆ.'),citations:[citation('src-asi-early-history','Vikramaditya II and the Kanchi campaign'),citation('src-prototype-boundaries','Schematic core geometry')],review:review('needs-review')
  },
  {
    id:'extent-rashtrakuta-dantidurga-753',name:name('Emergent Rashtrakuta core under Dantidurga, c. 753','ದಂತಿದುರ್ಗನ ಕಾಲದ ಉದಯೋನ್ಮುಖ ರಾಷ್ಟ್ರಕೂಟ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 753'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:753,reignId:'reign-dantidurga-rashtrakuta',date:dateRange(753,756,'circa'),polityIds:['polity-rashtrakuta'],relatedEventIds:['event-rashtrakuta-rise'],
    geometry:{type:'Polygon',coordinates:[[74.0,20.1],[78.2,20.0],[79.0,16.5],[77.8,14.4],[74.5,14.5],[73.5,17.2]],precision:'schematic'},description:name('A conservative foundation-phase envelope following the overthrow of Chalukya supremacy.','ಚಾಲುಕ್ಯ ಪ್ರಾಬಲ್ಯವನ್ನು ಕೊನೆಗೊಳಿಸಿದ ನಂತರದ ಸ್ಥಾಪನಾ ಹಂತದ ಮಿತಗೊಳಿಸಿದ ವ್ಯಾಪ್ತಿ.'),citations:[citation('src-asi-rashtrakutas','Dantidurga and the establishment of Rashtrakuta supremacy'),citation('src-prototype-boundaries','Schematic analytical geometry')],review:review('needs-review')
  },
  {
    id:'extent-rashtrakuta-govinda-iii-802',name:name('Rashtrakuta core under Govinda III, c. 802','ಮೂರನೇ ಗೋವಿಂದನ ಕಾಲದ ರಾಷ್ಟ್ರಕೂಟ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 802'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:802,reignId:'reign-govinda-iii-rashtrakuta',date:dateRange(793,813,'circa'),polityIds:['polity-rashtrakuta'],relatedEventIds:['event-rashtrakuta-north-campaigns'],
    geometry:{type:'Polygon',coordinates:[[72.8,21.8],[78.8,22.0],[81.0,18.0],[79.2,13.5],[75.4,12.7],[72.7,17.0]],precision:'schematic'},description:name('A low-confidence imperial core at the dynasty’s military high point; the much wider campaign reach is kept separate.','ವಂಶದ ಸೈನಿಕ ಉಚ್ಛ್ರಾಯದ ಕಡಿಮೆ-ವಿಶ್ವಾಸದ ಸಾಮ್ರಾಜ್ಯ ಮೂಲ ವ್ಯಾಪ್ತಿ; ಇನ್ನೂ ವ್ಯಾಪಕ ದಂಡಯಾತ್ರೆಯ ತಲುಪುವಿಕೆಯನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಇಡಲಾಗಿದೆ.'),citations:[citation('src-asi-rashtrakutas','Govinda III campaigns and imperial high point'),citation('src-prototype-boundaries','Schematic core geometry')],review:review('needs-review')
  },
  {
    id:'extent-rashtrakuta-amoghavarsha-850',name:name('Manyakheta-centred Rashtrakuta core, c. 850','ಮಾನ್ಯಖೇಟ ಕೇಂದ್ರಿತ ರಾಷ್ಟ್ರಕೂಟ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 850'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:850,reignId:'reign-amoghavarsha-i-rashtrakuta',date:dateRange(814,878,'circa'),polityIds:['polity-rashtrakuta'],relatedEventIds:['event-manyakheta-imperial-centre'],
    geometry:{type:'Polygon',coordinates:[[73.3,20.5],[78.7,20.8],[80.2,17.4],[78.8,13.8],[75.4,13.2],[73.0,16.9]],precision:'schematic'},description:name('A Manyakheta-centred comparison envelope for Amoghavarsha’s long reign, with campaign claims excluded from the core.','ಅಮೋಘವರ್ಷನ ದೀರ್ಘ ಆಳ್ವಿಕೆಯ ಮಾನ್ಯಖೇಟ ಕೇಂದ್ರಿತ ಹೋಲಿಕೆ ವ್ಯಾಪ್ತಿ; ದಂಡಯಾತ್ರೆಯ ಹಕ್ಕುಗಳನ್ನು ಮೂಲ ವ್ಯಾಪ್ತಿಯಿಂದ ಹೊರಗಿಡಲಾಗಿದೆ.'),citations:[citation('src-asi-rashtrakutas','Amoghavarsha and the Manyakheta-centred state'),citation('src-prototype-boundaries','Schematic comparison geometry')],review:review('needs-review')
  },
  {
    id:'extent-hoysala-vishnuvardhana-1117',name:name('Hoysala core under Vishnuvardhana, c. 1117','ವಿಷ್ಣುವರ್ಧನನ ಕಾಲದ ಹೊಯ್ಸಳ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 1117'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:1117,reignId:'reign-vishnuvardhana-hoysala',date:dateRange(1108,1152,'circa'),polityIds:['polity-hoysala'],relatedEventIds:['event-hoysala-belur-halebidu-centres'],
    geometry:{type:'Polygon',coordinates:[[74.9,14.3],[77.4,14.4],[78.0,12.2],[77.0,11.2],[75.2,11.4],[74.5,12.9]],precision:'schematic'},description:name('An expanding core linked to the dual royal centres of Belur and Halebidu.','ಬೇಲೂರು ಮತ್ತು ಹಳೇಬೀಡು ಎಂಬ ಎರಡು ರಾಜಕೇಂದ್ರಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ವಿಸ್ತರಿಸುತ್ತಿದ್ದ ಮೂಲ ವ್ಯಾಪ್ತಿ.'),citations:[citation('src-unesco-hoysala-dossier','Vishnuvardhana ruled from Belur and Halebidu'),citation('src-prototype-boundaries','Schematic core geometry')],review:review('needs-review')
  },
  {
    id:'extent-hoysala-ballala-ii-1187',name:name('Hoysala core under Veera Ballala II, c. 1187','ವೀರ ಬಲ್ಲಾಳ IIರ ಕಾಲದ ಹೊಯ್ಸಳ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 1187'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:1187,reignId:'reign-ballala-ii-hoysala',date:dateRange(1173,1220,'range'),polityIds:['polity-hoysala'],relatedEventIds:['event-hoysala-sovereignty'],
    geometry:{type:'Polygon',coordinates:[[74.4,15.4],[78.0,15.5],[79.0,12.8],[77.9,10.7],[75.0,10.8],[74.1,13.1]],precision:'schematic'},description:name('A low-confidence envelope for the kingdom’s documented largest extent under Ballala II.','ಬಲ್ಲಾಳ IIರ ಕಾಲದ ರಾಜ್ಯದ ದಾಖಲಾದ ಅತಿ ದೊಡ್ಡ ವ್ಯಾಪ್ತಿಯ ಕಡಿಮೆ-ವಿಶ್ವಾಸದ ಅಂದಾಜು.'),citations:[citation('src-unesco-hoysala-dossier','Kingdom reached its largest extent under Ballala II'),citation('src-prototype-boundaries','Schematic comparison geometry')],review:review('needs-review')
  },
  {
    id:'extent-hoysala-ballala-iii-1311',name:name('Late Hoysala core during the 1311 invasion','1311ರ ದಾಳಿಯ ಕಾಲದ ಕೊನೆಯ ಹೊಯ್ಸಳ ಮೂಲ ವ್ಯಾಪ್ತಿ'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:1311,reignId:'reign-ballala-iii-hoysala',date:dateRange(1292,1342,'circa'),polityIds:['polity-hoysala'],relatedEventIds:['event-malik-kafur-dwarasamudra'],
    geometry:{type:'Polygon',coordinates:[[74.8,14.6],[77.5,14.6],[78.2,12.1],[77.2,10.9],[75.1,11.1],[74.5,12.8]],precision:'schematic'},description:name('A conservative late-period core shown alongside the invasion route; payment of tribute is not mapped as permanent Delhi administration.','ದಂಡಯಾತ್ರೆಯ ಮಾರ್ಗದ ಜೊತೆಗೆ ತೋರಿಸಿದ ಕೊನೆಯ ಹಂತದ ಮಿತಗೊಳಿಸಿದ ಮೂಲ ವ್ಯಾಪ್ತಿ; ಕಪ್ಪಕಾಣಿಕೆ ಪಾವತಿಯನ್ನು ಶಾಶ್ವತ ದೆಹಲಿ ಆಡಳಿತವೆಂದು ನಕ್ಷೆಗೊಳಿಸಲಾಗಿಲ್ಲ.'),citations:[citation('src-asi-early-history','1311 campaign to Dwarasamudra'),citation('src-prototype-boundaries','Conservative schematic geometry')],review:review('needs-review')
  },
  {
    id:'extent-mysore-hyder-ali-1761',name:name('Mysore core under Hyder Ali, c. 1761','ಹೈದರ್ ಅಲಿಯ ಕಾಲದ ಮೈಸೂರು ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 1761'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'regency',snapshotYear:1761,reignId:'reign-hyder-ali-mysore',date:dateRange(1761,1781,'range'),polityIds:['polity-mysore'],relatedEventIds:['event-hyder-mysore','event-first-anglo-mysore-war'],
    geometry:{type:'Polygon',coordinates:[[74.7,14.7],[78.5,14.8],[79.0,11.4],[77.8,10.5],[75.2,10.8],[74.3,12.7]],precision:'schematic'},description:name('A schematic military-state core at Hyder Ali’s accession to de facto power; later wartime gains and losses are not collapsed into this single outline.','ಹೈದರ್ ಅಲಿ ವಾಸ್ತವಿಕ ಅಧಿಕಾರಕ್ಕೆ ಬಂದ ಕಾಲದ ಅಂದಾಜು ಸೈನಿಕ-ರಾಜ್ಯದ ಮೂಲ ವ್ಯಾಪ್ತಿ; ನಂತರದ ಯುದ್ಧಕಾಲದ ಲಾಭ-ನಷ್ಟಗಳನ್ನು ಈ ಒಂದೇ ಗಡಿಯೊಳಗೆ ಸೇರಿಸಲಾಗಿಲ್ಲ.'),citations:[citation('src-unesco-srirangapatna','Srirangapatna political centre from 1761'),citation('src-prototype-boundaries','Schematic comparison geometry')],review:review('needs-review')
  },
  {
    id:'extent-mysore-tipu-sultan-1787',name:name('Mysore core under Tipu Sultan, c. 1787','ಟಿಪ್ಪು ಸುಲ್ತಾನರ ಕಾಲದ ಮೈಸೂರು ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 1787'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:1787,reignId:'reign-tipu-sultan-mysore',date:dateRange(1782,1798,'range'),polityIds:['polity-mysore'],relatedEventIds:['event-tipu-ottoman-embassy','event-tipu-france-embassy','event-srirangapatna-1799'],
    geometry:{type:'Polygon',coordinates:[[74.4,15.1],[78.8,15.1],[79.3,11.1],[77.8,10.3],[74.9,10.7],[74.0,12.9]],precision:'schematic'},description:name('A pre-final-war comparison envelope for the Srirangapatna-centred state; overseas embassies remain diplomatic links, not territorial claims.','ಅಂತಿಮ ಯುದ್ಧಕ್ಕೂ ಮುನ್ನದ ಶ್ರೀರಂಗಪಟ್ಟಣ ಕೇಂದ್ರಿತ ರಾಜ್ಯದ ಹೋಲಿಕೆ ವ್ಯಾಪ್ತಿ; ವಿದೇಶಿ ರಾಯಭಾರಗಳು ರಾಜತಾಂತ್ರಿಕ ಕೊಂಡಿಗಳೇ ಹೊರತು ಭೂಪ್ರದೇಶದ ಹಕ್ಕುಗಳಲ್ಲ.'),citations:[citation('src-unesco-srirangapatna','Capital and political centre through 1799'),citation('src-prototype-boundaries','Schematic comparison geometry')],review:review('needs-review')
  },
  {
    id:'extent-mysore-wadiyar-restoration-1800',name:name('Reduced Mysore princely state after restoration, c. 1800','ಮರುಸ್ಥಾಪನೆಯ ನಂತರದ ಕುಗ್ಗಿದ ಮೈಸೂರು ಸಂಸ್ಥಾನ, ಸು. 1800'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:1800,reignId:'reign-krishnaraja-iii-mysore',date:dateRange(1799,1868,'range'),polityIds:['polity-mysore'],relatedEventIds:['event-srirangapatna-1799','event-mysore-capital-restored-1799'],
    geometry:{type:'Polygon',coordinates:[[75.2,14.2],[77.8,14.2],[78.2,11.6],[77.3,11.0],[75.6,11.2],[74.9,12.8]],precision:'schematic'},description:name('A deliberately reduced envelope for the post-1799 princely state, with Mysuru restored as capital under British paramountcy.','1799ರ ನಂತರದ ಸಂಸ್ಥಾನದ ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಕುಗ್ಗಿಸಿದ ವ್ಯಾಪ್ತಿ; ಬ್ರಿಟಿಷ್ ಪರಮಾಧಿಕಾರದಡಿ ಮೈಸೂರು ರಾಜಧಾನಿಯಾಗಿ ಮರುಸ್ಥಾಪಿತವಾಯಿತು.'),citations:[citation('src-asi-mysore-city','Post-1799 restoration and Mysuru royal capital'),citation('src-prototype-boundaries','Conservative schematic geometry')],review:review('needs-review')
  },
  {
    id:'extent-mysore-accession-1947',name:name('Mysore State at accession, 1947','ಸೇರ್ಪಡೆ ಸಮಯದ ಮೈಸೂರು ಸಂಸ್ಥಾನ, 1947'),classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:1947,reignId:'reign-jayachamarajendra-mysore',date:dateRange(1940,1947,'range'),polityIds:['polity-mysore'],relatedEventIds:['event-mysore-accession','event-independence'],
    geometry:{type:'Polygon',coordinates:[[74.9,14.5],[78.3,14.5],[78.6,11.7],[77.5,11.0],[75.5,11.1],[74.7,12.8]],precision:'schematic'},description:name('A schematic pre-accession envelope for the princely state; it is not yet a district-accurate administrative boundary.','ಸಂಸ್ಥಾನದ ಸೇರ್ಪಡೆಗೂ ಮುನ್ನದ ಅಂದಾಜು ವ್ಯಾಪ್ತಿ; ಇದು ಇನ್ನೂ ಜಿಲ್ಲಾಮಟ್ಟದ ನಿಖರ ಆಡಳಿತ ಗಡಿ ಅಲ್ಲ.'),citations:[citation('src-constitution-mysore','Instrument of Accession, August 1947'),citation('src-prototype-boundaries','Schematic pre-accession geometry')],review:review('needs-review')
  },
  {
    id:'extent-vijayanagara-krishnadevaraya-core-1520',name:name('Vijayanagara core snapshot under Krishnadevaraya, c. 1520','ಕೃಷ್ಣದೇವರಾಯರ ಕಾಲದ ವಿಜಯನಗರ ಮೂಲ ವ್ಯಾಪ್ತಿ, ಸು. 1520'),
    classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'reign',snapshotYear:1520,reignId:'reign-krishnadevaraya-vijayanagara',date:dateRange(1509,1530,'range'),
    polityIds:['polity-vijayanagara'],relatedEventIds:['event-raichur-1520'],
    geometry:{type:'Polygon',coordinates:[[74.2,17.7],[78.7,18.0],[80.5,15.8],[80.1,10.3],[76.0,8.8],[74.0,13.7]],precision:'schematic'},
    description:name('A low-confidence analytical envelope for the empire at its documented apogee; it is a comparison aid, not a surveyed frontier.','ಸಾಮ್ರಾಜ್ಯದ ದಾಖಲಾದ ಉಚ್ಛ್ರಾಯದ ಕಾಲದ ಕಡಿಮೆ-ವಿಶ್ವಾಸದ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವ್ಯಾಪ್ತಿ; ಇದು ಹೋಲಿಕೆಯ ಸಾಧನವೇ ಹೊರತು ಸಮೀಕ್ಷಿತ ಗಡಿಯಲ್ಲ.'),
    citations:[citation('src-unesco-hampi','Krishna Deva Raya’s reign identified as the apogee; geometry remains a prototype synthesis'),citation('src-prototype-boundaries','Schematic comparison geometry')],review:review('needs-review')
  },
  {
    id:'extent-vijayanagara-rama-raya-core-1565',name:name('Vijayanagara core snapshot before Talikota, 1565','ತಾಳಿಕೋಟೆಗೂ ಮುನ್ನ ವಿಜಯನಗರ ಮೂಲ ವ್ಯಾಪ್ತಿ, 1565'),
    classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'regency',snapshotYear:1565,reignId:'reign-rama-raya-regency',date:dateRange(1542,1565,'range'),
    polityIds:['polity-vijayanagara'],relatedEventIds:['event-talikota'],
    geometry:{type:'Polygon',coordinates:[[74.4,17.4],[78.5,17.7],[80.2,15.3],[79.7,10.7],[76.0,9.2],[74.1,13.8]],precision:'schematic'},
    description:name('A schematic late-Hampi comparison snapshot immediately before the 1565 defeat; the outline remains a research hypothesis.','1565ರ ಸೋಲಿಗೆ ತಕ್ಷಣ ಮುನ್ನದ ಹಂಪಿಯ ಕೊನೆಯ ಹಂತದ ಅಂದಾಜು ಹೋಲಿಕೆ snapshot; ಗಡಿಯ ರೂಪ ಇನ್ನೂ ಸಂಶೋಧನಾ ಊಹೆಯಾಗಿದೆ.'),
    citations:[citation('src-unesco-hampi','Talikota defeat and destruction of the capital in 1565'),citation('src-prototype-boundaries','Schematic comparison geometry')],review:review('needs-review')
  },
  {
    id:'extent-vijayanagara-penukonda-core-1570',name:name('Reduced Vijayanagara state at Penukonda, c. 1570','ಪೆನುಕೊಂಡದ ಕುಗ್ಗಿದ ವಿಜಯನಗರ ರಾಜ್ಯ, ಸು. 1570'),
    classification:'core-administered',controlLevel:'direct',duration:'sustained',confidence:'low',snapshotKind:'political-phase',snapshotYear:1570,reignId:'reign-vijayanagara-penukonda-reconstitution',date:dateRange(1566,1585,'range'),
    polityIds:['polity-vijayanagara'],relatedEventIds:['event-talikota'],
    geometry:{type:'Polygon',coordinates:[[75.7,15.3],[78.8,15.2],[79.6,13.2],[78.4,11.8],[76.5,12.0],[75.5,13.6]],precision:'schematic'},
    description:name('A deliberately conservative comparison envelope for the greatly reduced state reconstituted at Penukonda; its perimeter requires further regional source review.','ಪೆನುಕೊಂಡದಲ್ಲಿ ಪುನರ್-ರಚಿತವಾದ ಬಹಳಷ್ಟು ಕುಗ್ಗಿದ ರಾಜ್ಯದ ಉದ್ದೇಶಪೂರ್ವಕವಾಗಿ ಮಿತಗೊಳಿಸಿದ ಹೋಲಿಕೆ ವ್ಯಾಪ್ತಿ; ಇದರ ಪರಿಧಿಗೆ ಇನ್ನಷ್ಟು ಪ್ರಾದೇಶಿಕ ಆಕರ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'),
    citations:[citation('src-cambridge-deccan-courts','Greatly reduced state reconstituted at Penukonda by 1566'),citation('src-prototype-boundaries','Conservative schematic comparison geometry')],review:review('needs-review')
  },
  {
    id:'extent-raichur-doab-contested-1347-1520',name:name('Raichur Doab contested zone, 1347–1520','ರಾಯಚೂರು ದೋಆಬ್ ವಿವಾದಿತ ವಲಯ, 1347–1520'),
    classification:'contested-zone',controlLevel:'disputed',duration:'intermittent',confidence:'medium',date:dateRange(1347,1520,'range'),
    polityIds:['polity-vijayanagara','external-polity-bahmani'],relatedEventIds:['event-raichur-1520'],
    geometry:{type:'Polygon',coordinates:[[76.72,15.58],[77.72,15.68],[77.68,16.28],[76.78,16.22]],precision:'schematic'},
    description:name('The Krishna–Tungabhadra tract repeatedly changed hands; the polygon marks the study zone, not a fixed frontier.','ಕೃಷ್ಣಾ–ತುಂಗಭದ್ರಾ ನಡುವಿನ ಪ್ರದೇಶ ಹಲವು ಬಾರಿ ಕೈಬದಲಾಯಿತು; ಈ ಬಹುಭುಜವು ಅಧ್ಯಯನ ವಲಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ, ಸ್ಥಿರ ಗಡಿಯನ್ನಲ್ಲ.'),
    citations:[citation('src-cambridge-raichur-1520','Discussion of Raichur and Mudgal changing hands and the disputed Doab')],review:review('needs-review')
  },
  {
    id:'extent-chola-gangavadi-control-1004-1116',name:name('Chola control in Gangavadi, c. 1004–1116','ಗಂಗವಾಡಿಯಲ್ಲಿ ಚೋಳರ ನಿಯಂತ್ರಣ, ಸು. 1004–1116'),
    classification:'temporary-occupation',controlLevel:'temporary',duration:'multi-generational',confidence:'medium',date:dateRange(1004,1116,'circa'),
    polityIds:['external-polity-chola','polity-western-ganga'],relatedEventIds:['event-chola-gangavadi'],
    geometry:{type:'Polygon',coordinates:[[75.55,11.75],[77.85,11.75],[77.82,13.65],[75.62,13.62]],precision:'schematic'},
    description:name('A schematic study area for Chola annexation and administration in Gangavadi; local control varied over time.','ಗಂಗವಾಡಿಯಲ್ಲಿನ ಚೋಳರ ವಶಪಡಿಸಿಕೆ ಮತ್ತು ಆಡಳಿತದ ಅಂದಾಜು ಅಧ್ಯಯನ ವಲಯ; ಸ್ಥಳೀಯ ನಿಯಂತ್ರಣ ಕಾಲಾನುಸಾರ ಬದಲಾಗಿತ್ತು.'),
    citations:[citation('src-inflibnet-cholas','Rajaraja I: Gangavadi included in the Chola empire; provincial administration overview')],review:review('needs-review')
  },
  {
    id:'extent-rashtrakuta-kannauj-campaign-circa-800',name:name('Rashtrakuta campaign reach toward Kannauj','ಕನ್ನೌಜ್ ಕಡೆಗೆ ರಾಷ್ಟ್ರಕೂಟ ದಂಡಯಾತ್ರೆಯ ತಲುಪುವಿಕೆ'),
    classification:'campaign-reach',controlLevel:'none',duration:'episodic',confidence:'medium',date:dateRange(800,800,'circa'),
    polityIds:['polity-rashtrakuta'],relatedEventIds:['event-rashtrakuta-north-campaigns'],
    geometry:{type:'LineString',coordinates:[[77.29,17.17],[75.79,23.18],[79.92,27.05]],precision:'schematic'},
    description:name('This line records military reach during the tripartite struggle; it must not be read as continuous Rashtrakuta administration.','ಈ ರೇಖೆ ತ್ರಿಪಕ್ಷೀಯ ಸಂಘರ್ಷದ ಸೈನಿಕ ತಲುಪುವಿಕೆಯನ್ನು ದಾಖಲಿಸುತ್ತದೆ; ಇದನ್ನು ನಿರಂತರ ರಾಷ್ಟ್ರಕೂಟ ಆಡಳಿತವೆಂದು ಅರ್ಥೈಸಬಾರದು.'),
    citations:[citation('src-asi-early-history','Rashtrakuta northern campaigns; route reconstructed schematically')],review:review('needs-review')
  },
  {
    id:'extent-vijayanagara-southern-tributary-influence-1450',name:name('Vijayanagara tributary influence in the Tamil country, c. 1450','ತಮಿಳು ನಾಡಿನಲ್ಲಿ ವಿಜಯನಗರದ ಕಪ್ಪಕಾಣಿಕೆ ಪ್ರಭಾವ, ಸು. 1450'),
    classification:'tributary-influence',controlLevel:'indirect',duration:'intermittent',confidence:'low',date:dateRange(1400,1500,'century'),
    polityIds:['polity-vijayanagara'],relatedEventIds:[],
    geometry:{type:'Polygon',coordinates:[[77.0,9.0],[80.25,9.0],[80.18,12.25],[77.08,12.18]],precision:'schematic'},
    description:name('A low-confidence study zone for homage relationships outside the Deccan heartland, not a claim of uniform direct rule.','ದಖ್ಖನ್ ಮೂಲಪ್ರದೇಶದ ಹೊರಗಿನ ಕಪ್ಪಕಾಣಿಕೆ ಸಂಬಂಧಗಳ ಕಡಿಮೆ-ವಿಶ್ವಾಸದ ಅಧ್ಯಯನ ವಲಯ; ಇದು ಏಕರೂಪ ನೇರ ಆಳ್ವಿಕೆಯ ಹಕ್ಕು ಅಲ್ಲ.'),
    citations:[citation('src-cambridge-vijayanagara-conclusion','Discussion of distant southern lords retaining sovereignty while offering homage')],review:review('needs-review')
  }
]

// Contributor-supplied Hoysala KML layer. Keep these as independent research
// leads so the public map can show the geography without promoting uncertain
// temple identities or protection claims.
applyResearchWaveV022(atlasData,appendUniqueById)
applyDistrictHeritageConnections(atlasData.districtHistoryResearch)
appendUniqueById(atlasData.culturalHeritage, offbeatHoysalaTemples)

const personPolityRelationshipType=person=>{
  if(person.roles.includes('ruler')||person.roles.includes('queen')||person.roles.includes('foreign-monarch'))return'governed-or-represented'
  if(person.roles.includes('patron'))return'patron-associated-with'
  if(person.roles.some(role=>['poet','author','vachana-poet','scholar','religious-figure'].includes(role)))return'intellectual-or-religious-associated-with'
  if(person.roles.some(role=>['military-leader','soldier','lieutenant','defender','resistance-leader','resistance-fighter'].includes(role)))return'military-or-resistance-associated-with'
  return'community-associated-with'
}

atlasData.relationships = [
  ...atlasData.people.map(person => ({ id:`rel-${person.id}-polity`, fromId:person.id, type:personPolityRelationshipType(person), toId:person.polityId, date:person.date, citations:person.citations, review:person.review })),
  ...atlasData.reigns.flatMap(period => [
    { id:`rel-${period.id}-polity`, fromId:period.id, type:`${period.periodType}-of`, toId:period.polityId, date:period.date, citations:period.citations, review:period.review },
    ...period.rulerIds.map((rulerId,index) => ({ id:`rel-${period.id}-ruler-${index + 1}`, fromId:period.id, type:'held-by', toId:rulerId, date:period.date, citations:period.citations, review:period.review })),
    ...period.capitalIds.map((capitalId,index) => ({ id:`rel-${period.id}-capital-${index + 1}`, fromId:period.id, type:'capital-at', toId:capitalId, date:period.date, citations:period.citations, review:period.review }))
  ]),
  ...atlasData.works.map(work => ({ id:`rel-${work.id}-patronage`, fromId:work.id, type:work.associationType||'associated-with-court', toId:work.polityId, date:work.date, citations:work.citations, review:work.review })),
  ...atlasData.works.flatMap(work => (work.creatorIds||[]).map((creatorId,index) => ({ id:`rel-${work.id}-creator-${index + 1}`, fromId:work.id, type:'created-by', toId:creatorId, date:work.date, citations:work.citations, review:work.review }))),
  ...atlasData.inscriptions.map(item => ({ id:`rel-${item.id}-attests`, fromId:item.id, type:'attests', toId:item.polityId, date:item.date, citations:item.citations, review:item.review })),
  ...atlasData.events.flatMap(event => event.participants.map((participant,index) => ({ id:`rel-${event.id}-participant-${index + 1}`, fromId:event.id, type:`participant-${participant.role}`, toId:participant.polityId, date:event.date, citations:event.citations, review:event.review }))),
  ...atlasData.events.flatMap(event => (event.peopleIds || []).map(personId => ({ id:`rel-${personId}-${event.id}`, fromId:personId, type:'associated-with-event', toId:event.id, date:event.date, citations:event.citations, review:event.review }))),
  ...atlasData.events.filter(event => event.destinationPlaceId).map(event => ({ id:`rel-${event.id}-destination`, fromId:event.id, type:'reached-destination', toId:event.destinationPlaceId, date:event.date, citations:event.citations, review:event.review })),
  ...atlasData.culturalHeritage.flatMap(item => [
    ...item.polityIds.map((polityId,index) => ({ id:`rel-${item.id}-polity-${index + 1}`, fromId:item.id, type:`cultural-${item.category}`, toId:polityId, date:item.date, citations:item.citations, review:item.review })),
    ...item.placeIds.map((placeId,index) => ({ id:`rel-${item.id}-place-${index + 1}`, fromId:item.id, type:'cultural-location', toId:placeId, date:item.date, citations:item.citations, review:item.review })),
    ...item.peopleIds.map((personId,index) => ({ id:`rel-${item.id}-person-${index + 1}`, fromId:item.id, type:'cultural-patron-or-agent', toId:personId, date:item.date, citations:item.citations, review:item.review })),
    ...item.relatedWorkIds.map((workId,index) => ({ id:`rel-${item.id}-work-${index + 1}`, fromId:item.id, type:'cultural-work', toId:workId, date:item.date, citations:item.citations, review:item.review }))
  ]),
  ...atlasData.territorialExtents.flatMap(extent => extent.polityIds.map((polityId,index) => ({ id:`rel-${extent.id}-polity-${index + 1}`, fromId:extent.id, type:`territorial-evidence-${extent.classification}`, toId:polityId, date:extent.date, citations:extent.citations, review:extent.review }))),
  ...atlasData.territorialExtents.flatMap(extent => extent.relatedEventIds.map((eventId,index) => ({ id:`rel-${extent.id}-event-${index + 1}`, fromId:extent.id, type:'supported-by-event', toId:eventId, date:extent.date, citations:extent.citations, review:extent.review }))),
  ...atlasData.territorialExtents.filter(extent => extent.reignId).map(extent => ({ id:`rel-${extent.id}-period`, fromId:extent.id, type:'snapshot-for-period', toId:extent.reignId, date:extent.date, citations:extent.citations, review:extent.review })),
  ...atlasData.districtHistoryResearch.flatMap(item => [
    ...(item.placeIds||[]).map((toId,index)=>({id:`rel-${item.id}-place-${index+1}`,fromId:item.id,type:'district-history-place-context',toId,citations:item.citations||[],review:item.review})),
    ...(item.polityIds||[]).map((toId,index)=>({id:`rel-${item.id}-polity-${index+1}`,fromId:item.id,type:'district-history-polity-context',toId,citations:item.citations||[],review:item.review})),
    ...(item.peopleIds||[]).map((toId,index)=>({id:`rel-${item.id}-person-${index+1}`,fromId:item.id,type:'district-history-person-context',toId,citations:item.citations||[],review:item.review})),
    ...(item.eventIds||[]).map((toId,index)=>({id:`rel-${item.id}-event-${index+1}`,fromId:item.id,type:'district-history-event-context',toId,citations:item.citations||[],review:item.review}))
  ]),
  ...atlasData.heritageInventoryLeads.flatMap(item => [
    ...(item.placeIds||[]).map((toId,index)=>({id:`rel-${item.id}-place-${index+1}`,fromId:item.id,type:'heritage-place-context',toId,citations:item.citations||[],review:item.review})),
    ...(item.polityIds||[]).map((toId,index)=>({id:`rel-${item.id}-polity-${index+1}`,fromId:item.id,type:'heritage-polity-context',toId,citations:item.citations||[],review:item.review})),
    ...(item.peopleIds||[]).map((toId,index)=>({id:`rel-${item.id}-person-${index+1}`,fromId:item.id,type:'heritage-person-context',toId,citations:item.citations||[],review:item.review})),
    ...(item.eventIds||[]).map((toId,index)=>({id:`rel-${item.id}-event-${index+1}`,fromId:item.id,type:'heritage-event-context',toId,citations:item.citations||[],review:item.review}))
  ]),
]

export const collectionLabels = { polities:'Polities', externalPolities:'External polities', externalGovernancePhases:'External governance phases', events:'Historical events', culturalHeritage:'Art, culture & traditions', periodicals:'Newspapers & magazines', artifacts:'Kingdom symbols & artifacts', templeInventoryLeads:'Temple inventory leads', heritageInventoryLeads:'Heritage inventory leads', reigns:'Reigns & political periods', territorialExtents:'Territorial evidence', deepChronologies:'Deep-history chronologies', heritageAudits:'District heritage audits', districtHistoryResearch:'District deep-history research', inscriptionAudits:'District inscription audits', people:'Curated people', peopleCandidates:'People review candidates', places:'Places', inscriptions:'Inscriptions', works:'Literary works', sources:'Sources', relationships:'Relationships', politicalRelations:'Bilateral political relations', collaborations:'Collaborations' }
