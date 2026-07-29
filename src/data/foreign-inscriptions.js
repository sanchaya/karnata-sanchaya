const name = (en, kn) => ({ en, kn })
const review = { status: 'needs-review', reviewer: null, updatedAt: '2026-07-29' }
const date = (from, to = from, precision = 'circa', era = 'CE') => ({ from, to, era, precision })
const citation = (sourceId, locator) => ({ sourceId, locator })

// These are deliberately research-stage records. They make the international
// epigraphic footprint discoverable without implying that a transcription,
// translation, or political attribution has already passed independent review.
export const foreignInscriptionSources = [
  { id: 'src-unesco-lumbini-ashoka-pillar', type: 'heritage-record', title: name('Lumbini, the Birthplace of the Lord Buddha', 'ಭಗವಾನ್ ಬುದ್ಧನ ಜನ್ಮಸ್ಥಳ ಲುಂಬಿನಿ'), authors: ['UNESCO World Heritage Centre'], year: null, url: 'https://whc.unesco.org/en/list/666', review },
  { id: 'src-unesco-shahbazgarhi-edicts', type: 'heritage-record', title: name('Shahbazgarhi rock edicts tentative-list dossier', 'ಶಹಬಾಜ್‌ಗಢಿ ಶಿಲಾಶಾಸನಗಳ ತಾತ್ಕಾಲಿಕ ಪಟ್ಟಿಯ ದಾಖಲೆ'), authors: ['UNESCO World Heritage Centre'], year: null, url: 'https://whc.unesco.org/en/tentativelists/1880/', review },
  { id: 'src-iranica-kandahar-ashoka', type: 'encyclopaedia', title: name('Kabul Museum: Greek and Aramaic edicts from Kandahar', 'ಕಾಬೂಲ್ ಮ್ಯೂಸಿಯಂ: ಕಂದಹಾರ್ ಗ್ರೀಕ್ ಮತ್ತು ಅರಾಮಿಕ್ ಶಾಸನಗಳು'), authors: ['Encyclopaedia Iranica'], year: null, url: 'https://www.iranicaonline.org/articles/kabul-museum/', review },
  { id: 'src-attalus-kandahar-edict', type: 'transcription-reference', title: name('The Kandahar Greek-Aramaic edict of Ashoka', 'ಕಂದಹಾರ್ ಅಶೋಕ ಗ್ರೀಕ್–ಅರಾಮಿಕ್ ಶಾಸನ'), authors: ['Attalus'], year: null, url: 'https://www.attalus.org/docs/other/inscr_241.html', review },
  { id: 'src-vietnam-vo-canh-heritage', type: 'government-heritage', title: name('Võ Cạnh stele', 'ವೋ ಕ್ಯಾಂಹ್ ಶಿಲಾಶಾಸನ'), authors: ['Vietnam Department of Cultural Heritage'], year: null, url: 'https://dsvh.gov.vn/bia-vo-canh-3065', review },
  { id: 'src-vietnam-national-museum-vo-canh', type: 'museum-record', title: name('Stele of Võ Cạnh', 'ವೋ ಕ್ಯಾಂಹ್ ಶಿಲಾಶಾಸನ'), authors: ['Vietnam National Museum of History'], year: null, url: 'https://vnmh.com.vn/fr/Articles/1010/28305/stele-de-vo-canh.html', review },
  { id: 'src-jmbras-takuapa-tamil', type: 'journal-article', title: name('Takuapa and its Tamil inscription', 'ತಕುವಾಪಾ ಮತ್ತು ಅದರ ತಮಿಳು ಶಾಸನ'), authors: ['J. R. Logan'], year: 1949, url: 'https://www.sabrizain.org/malaya/library/jmbras/jmbrasvol22-1.pdf', review },
  { id: 'src-ncas-lobu-tua-inscription', type: 'conference-paper', title: name('Tamil maritime inscriptions and the Lobu Tua evidence', 'ತಮಿಳು ಸಮುದ್ರ ಶಾಸನಗಳು ಮತ್ತು ಲೋಬು ತುವಾ ಸಾಕ್ಷ್ಯ'), authors: ['National Centre for Arts and Cultural Studies, Sri Lanka'], year: 2014, url: 'https://ncas.ac.lk/Proceedings/symposium2014/Annual%20Research%20Symposium%20-%202014/bookpdf/Art%2C%20Society%20%26%20History/45-50.pdf', review },
  { id: 'src-asean-india-shared-heritage', type: 'research-report', title: name('ASEAN–India Shared Cultural Heritage', 'ಆಸಿಯಾನ್–ಭಾರತ ಹಂಚಿಕೊಂಡ ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ'), authors: ['ASEAN–India Centre'], year: 2023, url: 'https://aseanindiacentre.org.in/sites/default/files/Publication/ASEAN%20%E2%80%93%20India%20Shared%20Cultural%20Heritage_SECURE-web_0.pdf', review },
  { id: 'src-epigraphia-indica-kalsi-lead', type: 'series', title: name('Epigraphia Indica: Kalsi and north Indian Ashokan edict lead', 'ಎಪಿಗ್ರಾಫಿಯಾ ಇಂಡಿಕಾ: ಕಾಲ್ಸಿ ಮತ್ತು ಉತ್ತರ ಭಾರತದ ಅಶೋಕ ಶಾಸನ ಸಂಶೋಧನಾ ಸುಳಿವು'), authors: ['Archaeological Survey of India and predecessor survey institutions'], year: 1892, url: 'https://onlinebooks.library.upenn.edu/webbin/serial?id=epigraphindica', review },
]

export const foreignInscriptionPlaces = [
  ['kalsi-ashokan-edicts', 'Kalsi Ashokan rock edict site', 'ಕಾಲ್ಸಿ ಅಶೋಕ ಶಿಲಾಶಾಸನ ತಾಣ', 30.53, 77.42, 'India', 'IN'],
  ['kandahar-ashokan-inscriptions', 'Kandahar bilingual edict findspot', 'ಕಂದಹಾರ್ ದ್ವಿಭಾಷಾ ಶಾಸನ ಪತ್ತೆಸ್ಥಳ', 31.62, 65.72, 'Afghanistan', 'AF'],
  ['lumbini-ashoka-pillar', 'Lumbini Ashoka pillar', 'ಲುಂಬಿನಿ ಅಶೋಕ ಸ್ತಂಭ', 27.48, 83.28, 'Nepal', 'NP'],
  ['shahbazgarhi-rock-edicts', 'Shahbazgarhi rock edicts', 'ಶಹಬಾಜ್‌ಗಢಿ ಶಿಲಾಶಾಸನಗಳು', 34.17, 72.22, 'Pakistan', 'PK'],
  ['vocanh-stele', 'Võ Cạnh stele', 'ವೋ ಕ್ಯಾಂಹ್ ಶಿಲಾಶಾಸನ', 12.28, 109.17, 'Vietnam', 'VN'],
  ['takuapa-tamil-inscription', 'Takuapa Tamil inscription site', 'ತಕುವಾಪಾ ತಮಿಳು ಶಾಸನ ತಾಣ', 8.98, 98.35, 'Thailand', 'TH'],
  ['quanzhou-tamil-inscription', 'Quanzhou Tamil inscription site', 'ಕ್ವಾಂಝೌ ತಮಿಳು ಶಾಸನ ತಾಣ', 24.87, 118.68, 'China', 'CN'],
  ['galle-trilingual-inscription', 'Galle trilingual inscription site', 'ಗಾಲೆ ತ್ರಿಭಾಷಾ ಶಾಸನ ತಾಣ', 6.03, 80.22, 'Sri Lanka', 'LK'],
].map(([id, en, kn, lat, lng, countryName, countryCode]) => ({
  id: `place-${id}`, name: name(en, kn), kind: 'inscription-site', location: { type: 'Point', coordinates: [lng, lat], precision: 'approximate' },
  geographicScope: { region: 'international', countryCode, countryName: name(countryName, countryName), outsideKarnataka: true, outsideIndia: countryCode !== 'IN' },
  citations: [], review,
}))

export const foreignInscriptionPolities = [
  ['maurya', 'Mauryan Empire', 'ಮೌರ್ಯ ಸಾಮ್ರಾಜ್ಯ'],
  ['champa', 'Champa polity', 'ಚಂಪಾ ರಾಜ್ಯ'],
  ['ayyavole-guild', 'Ayyavole / Ainnurruvar merchant guild network', 'ಐಯ್ಯಾವೊಳೆ / ಐನ್ನೂರುವರ್ ವ್ಯಾಪಾರಿ ಸಂಘ ಜಾಲ'],
  ['song-china', 'Song China', 'ಸಾಂಗ್ ಚೀನಾ'],
  ['shakya-lumbini', 'Lumbini–Shakya sacred landscape', 'ಲುಂಬಿನಿ–ಶಾಕ್ಯ ಪವಿತ್ರ ಭೂದೃಶ್ಯ'],
  ['gandhara', 'Gandhara frontier', 'ಗಾಂಧಾರ ಗಡಿ ಪ್ರದೇಶ'],
  ['takuapa-port', 'Takuapa port polity', 'ತಕುವಾಪಾ ಬಂದರು ರಾಜ್ಯ'],
  ['barus-port', 'Barus / Lobu Tua port polity', 'ಬರೂಸ್ / ಲೋಬು ತುವಾ ಬಂದರು ರಾಜ್ಯ'],
  ['sri-lanka', 'Sri Lankan kingdoms', 'ಶ್ರೀಲಂಕಾ ರಾಜ್ಯಗಳು'],
].map(([id, en, kn]) => ({ id: `external-polity-${id}`, name: name(en, kn), type: 'external-polity', citations: [], review }))

export const foreignInscriptionPeople = [
  { id: 'person-ashoka', name: name('Ashoka Maurya', 'ಅಶೋಕ ಮೌರ್ಯ'), roles: ['ruler'], date: date(268, 232, 'range', 'BCE'), polityId: 'external-polity-maurya', citations: [citation('src-unesco-lumbini-ashoka-pillar', 'Ashoka pillar and 249 BCE visit context')], review },
  { id: 'person-rajendra-chola', name: name('Rajendra Chola I', 'ರಾಜೇಂದ್ರ ಚೋಳ I'), roles: ['ruler'], date: date(1012, 1044, 'range'), polityId: 'external-polity-chola', citations: [citation('src-epigraphia-indica', 'Maritime and Chola inscriptional context; item-level citation pending')], review },
]

const inscription = (id, en, kn, dateValue, placeId, polityId, languages, scripts, description, citations, relationIds) => ({
  id: `inscription-${id}`, name: name(en, kn), date: dateValue, placeId: `place-${placeId}`, polityId, languages, scripts,
  geographicScope: foreignInscriptionPlaces.find(item => item.id === `place-${placeId}`)?.geographicScope || (placeId === 'lobu-tua' ? { region: 'international', countryCode: 'ID', countryName: name('Indonesia', 'ಇಂಡೋನೇಷ್ಯಾ'), outsideKarnataka: true, outsideIndia: true } : undefined),
  description: name(description.en, description.kn), citations, relationIds, review,
})

export const foreignInscriptions = [
  inscription('kandahar-bilingual-edict', 'Kandahar Greek–Aramaic edict of Ashoka', 'ಕಂದಹಾರ್ ಅಶೋಕ ಗ್ರೀಕ್–ಅರಾಮಿಕ್ ಶಾಸನ', date(260, 250, 'circa', 'BCE'), 'kandahar-ashokan-inscriptions', 'external-polity-maurya', ['Greek', 'Aramaic'], ['Greek alphabet', 'Aramaic script'], { en: 'A bilingual Mauryan edict in the north-western frontier; wording, findspot and relationship to the two Kandahar fragments remain to be reconciled.', kn: 'ವಾಯವ್ಯ ಗಡಿಯಲ್ಲಿನ ಮೌರ್ಯ ದ್ವಿಭಾಷಾ ಧರ್ಮಶಾಸನ; ಪಾಠ, ಪತ್ತೆಸ್ಥಳ ಮತ್ತು ಎರಡು ಕಂದಹಾರ್ ತುಣುಕುಗಳ ಸಂಬಂಧವನ್ನು ಇನ್ನೂ ಹೋಲಿಸಬೇಕು.' }, [citation('src-iranica-kandahar-ashoka', 'Kandahar edicts in Greek and Aramaic'), citation('src-attalus-kandahar-edict', 'Greek–Aramaic text and translation pointer')], ['political-relation-maurya-kandahar-contact']),
  inscription('lumbini-ashoka-pillar', 'Lumbini Ashoka pillar inscription', 'ಲುಂಬಿನಿ ಅಶೋಕ ಸ್ತಂಭ ಶಾಸನ', date(249, 249, 'year', 'BCE'), 'lumbini-ashoka-pillar', 'external-polity-shakya-lumbini', ['Pali / Prakrit'], ['Early Brahmi'], { en: 'The pillar inscription records Ashoka’s visit to Lumbini; the published translation and exact pillar reading require item-level epigraphic review.', kn: 'ಅಶೋಕನು ಲುಂಬಿನಿಗೆ ಭೇಟಿ ನೀಡಿದುದನ್ನು ಸ್ತಂಭ ಶಾಸನ ದಾಖಲಿಸುತ್ತದೆ; ಪ್ರಕಟಿತ ಅನುವಾದ ಮತ್ತು ನಿಖರ ಪಾಠಕ್ಕೆ ವಸ್ತುಮಟ್ಟದ ಶಾಸನ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.' }, [citation('src-unesco-lumbini-ashoka-pillar', 'Ashoka pillar, 249 BCE, and Brahmi inscription')], ['political-relation-maurya-lumbini-pilgrimage']),
  inscription('shahbazgarhi-rock-edicts', 'Shahbazgarhi rock edicts', 'ಶಹಬಾಜ್‌ಗಢಿ ಶಿಲಾಶಾಸನಗಳು', date(250, 230, 'circa', 'BCE'), 'shahbazgarhi-rock-edicts', 'external-polity-gandhara', ['Prakrit'], ['Kharosthi'], { en: 'A north-western corpus of Ashoka’s major rock edicts, written in Kharosthi; individual panels and translations remain to be matched to a corpus edition.', kn: 'ಖರೋಷ್ಠಿ ಲಿಪಿಯಲ್ಲಿ ಬರೆದ ಅಶೋಕನ ಪ್ರಮುಖ ಶಿಲಾಶಾಸನಗಳ ವಾಯವ್ಯ ಸಂಕಲನ; ಪ್ರತ್ಯೇಕ ಫಲಕಗಳು ಮತ್ತು ಅನುವಾದಗಳನ್ನು ಕಾರ್ಪಸ್ ಆವೃತ್ತಿಗೆ ಜೋಡಿಸಬೇಕು.' }, [citation('src-unesco-shahbazgarhi-edicts', 'Fourteen major edicts and site context')], ['political-relation-maurya-gandhara-edict-network']),
  inscription('kalsi-rock-edicts', 'Kalsi Ashokan rock edicts', 'ಕಾಲ್ಸಿ ಅಶೋಕ ಶಿಲಾಶಾಸನಗಳು', date(250, 230, 'circa', 'BCE'), 'kalsi-ashokan-edicts', 'external-polity-maurya', ['Prakrit'], ['Brahmi'], { en: 'A major Ashokan edict site in present-day Uttarakhand, included to connect the Karnataka atlas to the wider Indian inscription geography.', kn: 'ಇಂದಿನ ಉತ್ತರಾಖಂಡದ ಪ್ರಮುಖ ಅಶೋಕ ಶಾಸನ ತಾಣ; ಕರ್ನಾಟಕ ಭೂಪಟವನ್ನು ವಿಶಾಲ ಭಾರತೀಯ ಶಾಸನ ಭೂಗೋಳಕ್ಕೆ ಜೋಡಿಸಲು ಸೇರಿಸಲಾಗಿದೆ.' }, [citation('src-epigraphia-indica-kalsi-lead', 'Kalsi corpus lead; item-level edition and authority record pending')], ['political-relation-maurya-kalsi-edict-network']),
  inscription('vocanh-stele', 'Võ Cạnh Sanskrit stele', 'ವೋ ಕ್ಯಾಂಹ್ ಸಂಸ್ಕೃತ ಶಿಲಾಶಾಸನ', date(100, 200, 'circa'), 'vocanh-stele', 'external-polity-champa', ['Sanskrit'], ['Early Brahmi-derived script'], { en: 'A Sanskrit inscription from central Vietnam, important for tracing early South Asian religious and literary connections with Champa.', kn: 'ಮಧ್ಯ ವಿಯೆಟ್ನಾಂನ ಸಂಸ್ಕೃತ ಶಾಸನ; ಚಂಪಾ ಜೊತೆಗಿನ ಆರಂಭಿಕ ದಕ್ಷಿಣ ಏಷ್ಯಾ ಧಾರ್ಮಿಕ ಮತ್ತು ಸಾಹಿತ್ಯ ಸಂಪರ್ಕಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮುಖ್ಯ.' }, [citation('src-vietnam-vo-canh-heritage', 'Official heritage record'), citation('src-vietnam-national-museum-vo-canh', 'Museum description and image record')], ['political-relation-champa-vocanh-contact']),
  inscription('takuapa-tamil-guild', 'Takuapa Tamil merchant-guild inscription', 'ತಕುವಾಪಾ ತಮಿಳು ವ್ಯಾಪಾರಿ ಸಂಘ ಶಾಸನ', date(800, 900, 'range'), 'takuapa-tamil-inscription', 'external-polity-ayyavole-guild', ['Tamil'], ['Tamil script'], { en: 'A Tamil inscription associated with the Takuapa port and merchant networks in the Thai–Malay peninsula; guild identity and date need a fresh edition check.', kn: 'ಥಾಯ್–ಮಲಯ ದ್ವೀಪಕಲ್ಪದ ತಕುವಾಪಾ ಬಂದರು ಮತ್ತು ವ್ಯಾಪಾರಿ ಜಾಲಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ತಮಿಳು ಶಾಸನ; ಸಂಘದ ಗುರುತು ಮತ್ತು ದಿನಾಂಕಕ್ಕೆ ಹೊಸ ಆವೃತ್ತಿ ಪರಿಶೀಲನೆ ಬೇಕು.' }, [citation('src-jmbras-takuapa-tamil', 'Takuapa and its Tamil inscription')], ['political-relation-ayyavole-takuapa']),
  inscription('lobu-tua-barus', 'Lobu Tua / Barus Tamil inscription', 'ಲೋಬು ತುವಾ / ಬರೂಸ್ ತಮಿಳು ಶಾಸನ', date(1088, 1088, 'year'), 'lobu-tua', 'external-polity-ayyavole-guild', ['Tamil'], ['Tamil script'], { en: 'A dated Tamil inscription from the Barus region of Sumatra, a key witness for merchant and port connections across the Indian Ocean.', kn: 'ಸುಮಾತ್ರಾದ ಬರೂಸ್ ಪ್ರದೇಶದ ದಿನಾಂಕಿತ ತಮಿಳು ಶಾಸನ; ಭಾರತೀಯ ಮಹಾಸಾಗರದ ವ್ಯಾಪಾರಿ ಮತ್ತು ಬಂದರು ಸಂಪರ್ಕಗಳಿಗೆ ಪ್ರಮುಖ ಸಾಕ್ಷ್ಯ.' }, [citation('src-ncas-lobu-tua-inscription', 'Lobu Tua / Barus inscription discussion')], ['political-relation-ayyavole-sumatra-barus']),
  inscription('quanzhou-tamil-temple', 'Quanzhou Tamil temple inscription', 'ಕ್ವಾಂಝೌ ತಮಿಳು ದೇವಾಲಯ ಶಾಸನ', date(1281, 1281, 'year'), 'quanzhou-tamil-inscription', 'external-polity-song-china', ['Tamil'], ['Tamil script'], { en: 'A Tamil inscription associated with Quanzhou’s maritime and religious world, dated 1281 in the shared-heritage literature; the stone and temple identification need item-level review.', kn: 'ಕ್ವಾಂಝೌ ಸಮುದ್ರ ಮತ್ತು ಧಾರ್ಮಿಕ ಜಗತ್ತಿಗೆ ಸಂಬಂಧಿಸಿದ ತಮಿಳು ಶಾಸನ; ಹಂಚಿಕೊಂಡ ಪರಂಪರೆ ಅಧ್ಯಯನಗಳಲ್ಲಿ 1281ಕ್ಕೆ ದಿನಾಂಕಿತವಾಗಿದೆ, ಆದರೆ ಕಲ್ಲು ಮತ್ತು ದೇವಾಲಯದ ಗುರುತಿಗೆ ವಸ್ತುಮಟ್ಟದ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.' }, [citation('src-asean-india-shared-heritage', 'Quanzhou Tamil inscription, 1281')], ['political-relation-ayyavole-quanzhou']),
  inscription('galle-trilingual', 'Galle trilingual inscription', 'ಗಾಲೆ ತ್ರಿಭಾಷಾ ಶಾಸನ', date(1300, 1500, 'range'), 'galle-trilingual-inscription', 'external-polity-sri-lanka', ['Chinese', 'Tamil', 'Persian'], ['Chinese, Tamil and Persian scripts'], { en: 'A multilingual Indian Ocean inscription used here as a research lead for the movement of merchants, diplomatic gifts and port communities.', kn: 'ವ್ಯಾಪಾರಿಗಳು, ರಾಜತಾಂತ್ರಿಕ ಕಾಣಿಕೆಗಳು ಮತ್ತು ಬಂದರು ಸಮುದಾಯಗಳ ಚಲನವಲನಕ್ಕೆ ಸಂಶೋಧನಾ ಸುಳಿವಾಗಿ ಬಳಸುತ್ತಿರುವ ಬಹುಭಾಷಾ ಭಾರತೀಯ ಮಹಾಸಾಗರ ಶಾಸನ.' }, [citation('src-asean-india-shared-heritage', 'Indian Ocean multilingual inscription context')], ['political-relation-galle-trilingual-maritime']),
]
