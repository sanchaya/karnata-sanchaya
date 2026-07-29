const name = (en, kn) => ({ en, kn })
const review = { status: 'needs-review', reviewer: null, updatedAt: '2026-07-29' }
const sourceId = 'src-kml-offbeat-hoysala-temples'
const citation = { sourceId, locator: 'Google My Maps KML placemark; temple identity, date and authority require independent review' }
const newspaperCitations = [
  { sourceId: 'src-news-south-first-shashidhara-hoysala', locator: 'Dataset attribution and Shashidhara HG’s wider Hoysala-temple documentation; individual placemark match pending' },
  { sourceId: 'src-news-bangalore-mirror-shashidhara-hoysala', locator: 'Mapping project and 1,200-temple research context; individual placemark match pending' },
]
const date = { from: 1000, to: 1350, era: 'CE', precision: 'range' }

export const offbeatHoysalaSources = [
  {
    id: sourceId,
    type: 'contributor-kml',
    title: name('Offbeat Hoysala Temples — contributor KML layer', 'ಆಫ್‌ಬೀಟ್ ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳು — ಕೊಡುಗೆದಾರ KML ಪದರ'),
    authors: ['Shashidhara HG', 'Google My Maps'],
    year: 2026,
    url: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1MPXdOOt2CAsFAY00J_5OYMC7Ctu6heee',
    scope: name('Twelve KML placemarks supplied as a discovery layer. Names and coordinates are imported, but construction phases, protection registers, managing authority, photographs and item-level citations remain to be verified.', 'ಹನ್ನೆರಡು KML ಸ್ಥಳಚಿಹ್ನೆಗಳನ್ನು ಸಂಶೋಧನಾ ಅನ್ವೇಷಣಾ ಪದರವಾಗಿ ಸೇರಿಸಲಾಗಿದೆ. ಹೆಸರು ಮತ್ತು ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಆಮದು ಮಾಡಲಾಗಿದೆ; ನಿರ್ಮಾಣ ಹಂತ, ರಕ್ಷಣಾ ಪಟ್ಟಿ, ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ, ಛಾಯಾಚಿತ್ರ ಮತ್ತು ವಸ್ತುಮಟ್ಟದ ಆಕರಗಳನ್ನು ಇನ್ನೂ ಪರಿಶೀಲಿಸಬೇಕು.'),
    review,
  },
  { id: 'src-news-south-first-shashidhara-hoysala', type: 'newspaper', title: name('The South First: Bengaluru man documents over 1,500 Hoysala temples', 'ದಿ ಸೌತ್ ಫಸ್ಟ್: ಬೆಂಗಳೂರಿನ ವ್ಯಕ್ತಿ 1,500ಕ್ಕೂ ಹೆಚ್ಚು ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳನ್ನು ದಾಖಲಿಸಿದ್ದಾರೆ'), authors: ['Rashmi Gopal Rao'], year: 2025, url: 'https://thesouthfirst.com/featured/preserving-history-bengaluru-man-documents-over-1500-hoysala-temples/', review },
  { id: 'src-news-bangalore-mirror-shashidhara-hoysala', type: 'newspaper', title: name('Bangalore Mirror: Stone temple pilot', 'ಬೆಂಗಳೂರು ಮಿರರ್: ಕಲ್ಲಿನ ದೇವಾಲಯಗಳ ದಾಖಲೀಕರಣ'), authors: ['Bangalore Mirror Bureau'], year: 2022, url: 'https://bangaloremirror.indiatimes.com/bangalore/cover-story/stone-temple-pilot/amp_articleshow/90988381.cms', review },
]

const placemarks = [
  ['govindanahally', 'Govindanahally', 'ಗೋವಿಂದನಹಳ್ಳಿ', 12.7731264, 76.3901976],
  ['turuvekere', 'Turuvekere', 'ತುರುವೇಕೆರೆ', 13.1605403, 76.6672602],
  ['somnathpura', 'Somnathpura Temple', 'ಸೋಮನಾಥಪುರ ದೇವಾಲಯ', 12.2766856, 76.8828041],
  ['kikkeri', 'Kikkeri', 'ಕಿಕ್ಕೇರಿ', 12.7607556, 76.425938],
  ['haranhalli', 'Haranhalli', 'ಹರನಹಳ್ಳಿ', 13.2481506, 76.223288],
  ['korvangla', 'Korvangla', 'ಕೋರ್ವಂಗ್ಲ', 13.0512538, 76.1769248],
  ['beluru-chennakeshava', 'Beluru Sri Chennakeshava Temple', 'ಬೇಲೂರು ಶ್ರೀ ಚೆನ್ನಕೇಶವ ದೇವಾಲಯ', 13.1629404, 75.8604053],
  ['halebeedu', 'Halebeedu', 'ಹಳೇಬೀಡು', 13.2129844, 75.9942162],
  ['arsikere', 'Arsikere', 'ಅರಸೀಕೆರೆ', 13.3133834, 76.2565857],
  ['aralaguppe', 'Aralaguppe', 'ಅರಳಗುಪ್ಪೆ', 13.2516041, 76.6145548],
  ['hosaholalu', 'Hosaholalu', 'ಹೊಸಹೊಲಲು', 12.6426774, 76.4779977],
  ['nuggehalli-lakshmi-narasimha', 'Nuggehalli Sri Lakshmi Narasimha Temple', 'ನುಗ್ಗೇಹಳ್ಳಿ ಶ್ರೀ ಲಕ್ಷ್ಮೀನರಸಿಂಹ ದೇವಾಲಯ', 13.0109318, 76.475191],
]

export const offbeatHoysalaPlaces = placemarks.map(([id, en, kn, lat, lng]) => ({
  id: `place-kml-hoysala-${id}`,
  name: name(en, kn),
  kind: 'temple',
  location: { type: 'Point', coordinates: [lng, lat], precision: 'approximate' },
  sourceLayer: 'offbeat-hoysala-temples',
  citations: [citation, ...newspaperCitations],
  review,
}))

export const offbeatHoysalaTemples = placemarks.map(([id, en, kn]) => ({
  id: `culture-kml-hoysala-${id}`,
  name: name(`${en} — Hoysala temple research lead`, `${kn} — ಹೊಯ್ಸಳ ದೇವಾಲಯ ಸಂಶೋಧನಾ ಸುಳಿವು`),
  category: 'architecture',
  date,
  polityIds: ['polity-hoysala'],
  placeIds: [`place-kml-hoysala-${id}`],
  peopleIds: [],
  relatedWorkIds: [],
  traditionTags: ['Hoysala', 'temple', 'architecture', 'KML-discovery-lead'],
  continuity: 'unknown',
  timelineIndependent: true,
  sourceLayer: 'offbeat-hoysala-temples',
  description: name('Imported from the contributor KML as a mapped Hoysala-temple research lead. This is not yet an authority-confirmed monument record.', 'ಕೊಡುಗೆದಾರರ KMLಯಿಂದ ನಕ್ಷೆಗೊಳಿಸಿದ ಹೊಯ್ಸಳ ದೇವಾಲಯ ಸಂಶೋಧನಾ ಸುಳಿವಾಗಿ ಸೇರಿಸಲಾಗಿದೆ. ಇದು ಇನ್ನೂ ಪ್ರಾಧಿಕಾರ ದೃಢೀಕರಿಸಿದ ಸ್ಮಾರಕ ದಾಖಲೆ ಅಲ್ಲ.'),
  citations: [citation, ...newspaperCitations],
  review,
}))
