const n = (en, kn) => ({ en, kn })
const review = { status: 'needs-review', reviewer: null, updatedAt: '2026-08-08' }

// These are discovery and scholarly leads captured from the latest research pass.
// They remain needs-review until an editor confirms authorship, publication metadata
// and the underlying archival/official evidence.
export const freedomMovementResearchSources = [
  {
    id: 'src-freedom-utthana-kannada-press', type: 'journalistic-feature',
    title: n('Freedom movement and Kannada newspapers', 'ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಮತ್ತು ಕನ್ನಡದ ಪತ್ರಿಕೆಗಳು'),
    authors: ['Dr. Sibanti Padmanabha K. V.'], year: 2021,
    publisher: 'Utthana', url: 'https://utthana.in/?p=8687',
    scope: n('A Kannada feature mapping newspapers, editors and underground print networks that supported the freedom movement and Kannada identity across the former Karnataka regions. Treat its listed newspaper histories as leads to verify against press archives and the cited works.', 'ಹಳೆಯ ಕರ್ನಾಟಕ ಪ್ರದೇಶಗಳಲ್ಲಿ ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಮತ್ತು ಕನ್ನಡ ಅಸ್ಮಿತೆಗೆ ಬೆಂಬಲ ನೀಡಿದ ಪತ್ರಿಕೆಗಳು, ಸಂಪಾದಕರು ಮತ್ತು ಭೂಗತ ಮುದ್ರಣ ಜಾಲಗಳನ್ನು ದಾಖಲಿಸುವ ಕನ್ನಡ ಲೇಖನ. ಪತ್ರಿಕೆಗಳ ಇತಿಹಾಸವನ್ನು ಲೇಖನದಲ್ಲಿನ ಆಕರಗಳು ಮತ್ತು ಪತ್ರಿಕಾ ಆರ್ಕೈವ್‌ಗಳೊಂದಿಗೆ ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಬೇಕು.'),
    review,
  },
  {
    id: 'src-freedom-peepal-chauda-naik-bedkani', type: 'journalistic-feature',
    title: n('Chowda Naik Bedkani: Uttara Kannada freedom fighter', 'ಉತ್ತರ ಕನ್ನಡದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರ ಚೌಡಾ ನಾಯ್ಕ ಬೇಡ್ಕಣಿ'),
    authors: ['Umesh Naik'], year: null,
    publisher: 'Peepal Media', url: 'https://peepalmedia.com/apratima-horatagara-chaudaa-nayk-bedkani/',
    scope: n('A district biography lead on Siddapur resistance, tax refusal, imprisonment, the 1937 felicitation and the 1952 death of Chowda Naik Bedkani. Verify against district records and the cited 1998 booklet before promotion.', 'ಸಿದ್ದಾಪುರದ ಪ್ರತಿರೋಧ, ಕರ ನಿರಾಕರಣೆ, ಸೆರೆವಾಸ, 1937ರ ಸನ್ಮಾನ ಮತ್ತು 1952ರ ಮರಣದ ಕುರಿತು ಚೌಡಾ ನಾಯ್ಕ ಬೇಡ್ಕಣಿಯ ಜಿಲ್ಲಾ ಜೀವನಚರಿತ್ರೆ ಸುಳಿವು. ಉತ್ತೇಜನಕ್ಕೂ ಮೊದಲು ಜಿಲ್ಲಾ ದಾಖಲೆಗಳು ಮತ್ತು ಲೇಖನದಲ್ಲಿನ 1998ರ ಕಿರುಹೊತ್ತಿಗೆಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.'),
    review,
  },
  {
    id: 'src-freedom-kannadapress-overview', type: 'journalistic-feature',
    title: n('Freedom movement in Karnataka', 'ಕರ್ನಾಟಕದ ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ'),
    authors: ['Kannada Press'], year: 2022,
    url: 'https://kannadapress.com/2022/08/13/freedom-movement-in-karnataka/',
    scope: n('Secondary overview supplied for discovery. The page was not independently retrievable in the research pass; retain as a queue item and do not use as sole evidence.', 'ಅನ್ವೇಷಣೆಗೆ ಒದಗಿಸಿದ ದ್ವಿತೀಯ ಅವಲೋಕನ. ಸಂಶೋಧನಾ ಪಾಸ್‌ನಲ್ಲಿ ಪುಟವನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಪಡೆಯಲಾಗಲಿಲ್ಲ; ಸರದಿ ದಾಖಲೆಯಾಗಿ ಮಾತ್ರ ಇಟ್ಟು ಏಕೈಕ ಸಾಕ್ಷ್ಯವಾಗಿ ಬಳಸಬಾರದು.'),
    review,
  },
  {
    id: 'src-freedom-poojn-overview', type: 'journalistic-feature',
    title: n("Karnataka's role in India's freedom struggle", 'ಭಾರತದ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟದಲ್ಲಿ ಕರ್ನಾಟಕದ ಪಾತ್ರ'),
    authors: ['Poojn editorial team'], year: null,
    url: 'https://www.poojn.in/post/27030/karnatakas-role-in-indias-freedom-struggle-a-detailed-history',
    scope: n('Secondary overview useful for discovering names and places; verify every claim against government records, contemporary newspapers or scholarly works.', 'ಹೆಸರುಗಳು ಮತ್ತು ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಲು ಉಪಯುಕ್ತ ದ್ವಿತೀಯ ಅವಲೋಕನ; ಪ್ರತಿಯೊಂದು ಹೇಳಿಕೆಯನ್ನು ಸರ್ಕಾರಿ ದಾಖಲೆ, ಸಮಕಾಲೀನ ಪತ್ರಿಕೆ ಅಥವಾ ಶೈಕ್ಷಣಿಕ ಕೃತಿಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.'),
    review,
  },
  {
    id: 'src-freedom-sobagu-tumakuru', type: 'district-history-feature',
    title: n('Freedom fighters of Tumakuru district', 'ತುಮಕೂರು ಜಿಲ್ಲೆಯ ಸ್ವಾತಂತ್ರ್ಯ ವೀರರು'),
    authors: ['Rajeshwari / Sobagu'], year: null,
    url: 'https://www.sobagu.in/%E0%B2%A4%E0%B3%81%E0%B2%AE%E0%B2%95%E0%B3%82%E0%B2%B0%E0%B3%81-%E0%B2%9C%E0%B2%BF%E0%B2%B2%E0%B3%8D%E0%B2%B2%E0%B3%86%E0%B2%AF-%E0%B2%B8%E0%B3%8D%E0%B2%B5%E0%B2%BE%E0%B2%A4%E0%B2%82%E0%B2%A4%E0%B3%8D/',
    scope: n('A taluk-organised secondary list with names, movements, prison terms and post-independence roles. Use it to expand the Tumakuru queue, then verify against the cited Tumkur Info material and government recognition records.', 'ತಾಲೂಕುವಾರು ಹೆಸರುಗಳು, ಚಳವಳಿಗಳು, ಸೆರೆವಾಸ ಮತ್ತು ಸ್ವಾತಂತ್ರ್ಯೋತ್ತರ ಪಾತ್ರಗಳನ್ನು ನೀಡುವ ದ್ವಿತೀಯ ಪಟ್ಟಿ. ತುಮಕೂರು ಸರದಿಯನ್ನು ವಿಸ್ತರಿಸಲು ಬಳಸಿ; ನಂತರ ಲೇಖನದಲ್ಲಿನ ತುಮಕೂರು ಇನ್ಫೋ ಮತ್ತು ಸರ್ಕಾರಿ ಮಾನ್ಯತಾ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.'),
    review,
  },
  {
    id: 'src-freedom-women-gandhian-era-haliyal', type: 'journal-article',
    title: n('Selected Women Freedom Fighters of Karnataka during Gandhian Era', 'ಗಾಂಧೀಯುಗದ ಕರ್ನಾಟಕದ ಆಯ್ದ ಮಹಿಳಾ ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರು'),
    authors: ['Asma K. Haliyal'], year: 2025,
    publisher: 'AKSHARASURYA: Peer-Reviewed, Multi Lingual E-Journal',
    doi: '10.5281/zenodo.17411281', url: 'https://doi.org/10.5281/zenodo.17411281',
    scope: n('Six-page article profiling Ballary Siddamma, Umabai Kundapur, Kamaladevi Chattopadhyay, Yashodhara Dasappa, Nagamma Patil and T. Sunandamma. Use printed PDF pages 98–103 for locators; the biographies remain review leads until checked against the listed government histories and archival records. The article states a CC BY 4.0 licence.', 'ಬಳ್ಳಾರಿ ಸಿದ್ಧಮ್ಮ, ಉಮಾಬಾಯಿ ಕುಂದಾಪುರ, ಕಮಲಾದೇವಿ ಚಟ್ಟೋಪಾಧ್ಯಾಯ, ಯಶೋಧರಾ ದಾಸಪ್ಪ, ನಾಗಮ್ಮ ಪಾಟೀಲ ಮತ್ತು ಟಿ. ಸುನಂದಮ್ಮರ ಕುರಿತು ಆರು ಪುಟಗಳ ಲೇಖನ. ಸ್ಥಾನಸೂಚಿಗೆ PDF ಪುಟ 98–103 ಬಳಸಿ; ಲೇಖನದಲ್ಲಿನ ಜೀವನಚರಿತ್ರೆಗಳನ್ನು ಸರ್ಕಾರಿ ಇತಿಹಾಸ ಮತ್ತು ಆರ್ಕೈವ್ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸುವವರೆಗೆ ಸಂಶೋಧನಾ ಸುಳಿವಾಗಿಯೇ ಇಡಿ. ಲೇಖನವು CC BY 4.0 ಪರವಾನಗಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.'),
    review,
  },
]
