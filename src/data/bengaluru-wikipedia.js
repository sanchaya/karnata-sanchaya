const page = (title, slug, kind = 'locality') => ({ title, slug, kind, url: `https://en.wikipedia.org/wiki/${slug}` })

export const bengaluruWikipediaPages = [
  page('Inscription stones of Bengaluru', 'Inscription_stones_of_Bengaluru', 'overview'),
  page('Agara inscriptions and hero stones', 'Agara_inscriptions_and_hero_stones'),
  page('Allalasandra inscriptions and hero stones', 'Allalasandra_inscriptions_and_hero_stones'),
  page('Anjanapura inscriptions and hero stones', 'Anjanapura_inscriptions_and_hero_stones'),
  page('Basavanagudi inscriptions and hero stones', 'Basavanagudi_inscriptions_and_hero_stones'),
  page('Begur inscriptions and hero stones', 'Begur_inscriptions_and_hero_stones'),
  page('Bhoopasandra inscriptions and hero stones', 'Bhoopasandra_inscriptions_and_hero_stones'),
  page('Bileshivale inscriptions and hero stones', 'Bileshivale_inscriptions_and_hero_stones'),
  page('Byadarahalli inscriptions and hero stones', 'Byadarahalli_inscriptions_and_hero_stones'),
  page('Chikkabanavara inscriptions and hero stones', 'Chikkabanavara_inscriptions_and_hero_stones'),
  page('Dasarahalli inscriptions and hero stones', 'Dasarahalli_inscriptions_and_hero_stones'),
  page('Domlur inscriptions and hero stones', 'Domlur_inscriptions_and_hero_stones'),
  page('Gulakamale inscriptions and hero stones', 'Gulakamale_inscriptions_and_hero_stones'),
  page('Hebbal-Kittayya inscription', 'Hebbal-Kittayya_inscription'),
  page('Ivara Kandapura inscriptions and hero stones', 'Ivara_Kandapura_inscriptions_and_hero_stones'),
  page('Jakkur inscriptions and hero stones', 'Jakkur_inscriptions_and_hero_stones'),
  page('Jalahalli inscriptions and hero stones', 'Jalahalli_inscriptions_and_hero_stones'),
  page('Kaikondrahalli inscriptions and hero stones', 'Kaikondrahalli_inscriptions_and_hero_stones'),
  page('Kalya inscriptions and hero stones', 'Kalya_inscriptions_and_hero_stones'),
  page('Katigenahalli inscriptions and hero stones', 'Katigenahalli_inscriptions_and_hero_stones'),
  page('Kodigehalli inscriptions and hero stones', 'Kodigehalli_inscriptions_and_hero_stones'),
  page('Malleshwaram inscriptions and hero stones', 'Malleshwaram_inscriptions_and_hero_stones'),
  page('Marasuru Madivala inscriptions and hero stones', 'Marasuru_Madivala_inscriptions_and_hero_stones'),
  page('Singapura inscriptions and hero stones', 'Singapura_inscriptions_and_hero_stones'),
  page('Srinivagilu inscriptions and hero stones', 'Srinivagilu_inscriptions_and_hero_stones'),
  page('Yelahanka inscriptions and hero stones', 'Yelahanka_inscriptions_and_hero_stones'),
]

export const bengaluruWikipediaThemes = [
  { en: 'Hero stones / vīragallus', kn: 'ವೀರಗಲ್ಲುಗಳು' },
  { en: 'Grants and donations', kn: 'ದಾನ ಮತ್ತು ಅನುದಾನ ಶಾಸನಗಳು' },
  { en: 'Temple inscriptions', kn: 'ದೇವಾಲಯ ಶಾಸನಗಳು' },
  { en: 'Royal decrees and edicts', kn: 'ರಾಜಾಜ್ಞೆಗಳು ಮತ್ತು ಶಾಸನಾಜ್ಞೆಗಳು' },
  { en: 'Nisidhi / Jain memorial stones', kn: 'ನಿಷಿಧಿ / ಜೈನ ಸ್ಮಾರಕ ಕಲ್ಲುಗಳು' },
  { en: 'Construction commissions', kn: 'ನಿರ್ಮಾಣ ಕಾರ್ಯದ ಶಾಸನಗಳು' },
  { en: 'Languages and scripts', kn: 'ಭಾಷೆಗಳು ಮತ್ತು ಲಿಪಿಗಳು' },
  { en: 'Publication and preservation history', kn: 'ಪ್ರಕಟಣೆ ಮತ್ತು ಸಂರಕ್ಷಣಾ ಇತಿಹಾಸ' },
]

export const bengaluruWikipediaTimeline = [
  { year: 400, precision: 'circa', title: { en: 'Ganga-period evidence begins to appear in the Bengaluru region', kn: 'ಬೆಂಗಳೂರು ಪ್ರದೇಶದಲ್ಲಿ ಗಂಗ ಕಾಲದ ಸಾಕ್ಷ್ಯ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ' }, note: { en: 'The overview places the earliest documented Bengaluru-region inscription horizon in the early Ganga period.', kn: 'ಸಮಗ್ರ ಲೇಖನವು ಬೆಂಗಳೂರು ಪ್ರದೇಶದ ಆರಂಭಿಕ ಶಾಸನ ಪರಿಧಿಯನ್ನು ಗಂಗರ ಆರಂಭಿಕ ಕಾಲಕ್ಕೆ ಹೊಂದಿಸುತ್ತದೆ.' }, place: 'Bengaluru region', articleUrl: 'https://en.wikipedia.org/wiki/Inscription_stones_of_Bengaluru' },
  { year: 750, precision: 'year', title: { en: 'Hebbal-Kittayya hero stone records Perbboḷalnāḍu', kn: 'ಹೆಬ್ಬಾಳ-ಕಿಟ್ಟಯ್ಯ ವೀರಗಲ್ಲು ಪೆರ್ಬ್ಬೋಳಲ್‌ನಾಡನ್ನು ದಾಖಲಿಸುತ್ತದೆ' }, note: { en: 'A hero-stone record connects the locality with an older territorial name associated with Hebbal.', kn: 'ವೀರಗಲ್ಲಿನ ದಾಖಲೆ ಹೆಬ್ಬಾಳಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಹಳೆಯ ಪ್ರಾದೇಶಿಕ ಹೆಸರನ್ನು ದಾಖಲಿಸುತ್ತದೆ.' }, place: 'Hebbal', articleUrl: 'https://en.wikipedia.org/wiki/Inscription_stones_of_Bengaluru' },
  { year: 890, precision: 'year', title: { en: 'Begur hero stone records an early form of Bengaluru', kn: 'ಬೇಗೂರು ವೀರಗಲ್ಲು ಬೆಂಗಳೂರಿನ ಆರಂಭಿಕ ರೂಪದ ಹೆಸರನ್ನು ದಾಖಲಿಸುತ್ತದೆ' }, note: { en: 'The Begur record is used in the article as a major toponymic milestone for the city.', kn: 'ನಗರದ ಸ್ಥಳನಾಮ ಇತಿಹಾಸದ ಪ್ರಮುಖ ಮೈಲಿಗಲ್ಲಾಗಿ ಲೇಖನವು ಬೇಗೂರು ದಾಖಲೆಯನ್ನು ಬಳಸುತ್ತದೆ.' }, place: 'Begur', articleUrl: 'https://en.wikipedia.org/wiki/Begur_inscriptions_and_hero_stones' },
  { year: 1247, precision: 'year', title: { en: 'Madiwala tank reference preserves an older Bengaluru place-name form', kn: 'ಮಡಿವಾಳದ ಕೆರೆ ಉಲ್ಲೇಖ ಬೆಂಗಳೂರಿನ ಹಳೆಯ ಸ್ಥಳನಾಮ ರೂಪವನ್ನು ಉಳಿಸುತ್ತದೆ' }, note: { en: 'A Tamil record at Someshvara Temple is described as referring to an older form of the city name.', kn: 'ಸೋಮೇಶ್ವರ ದೇವಾಲಯದ ತಮಿಳು ದಾಖಲೆಯು ನಗರದ ಹೆಸರಿನ ಹಳೆಯ ರೂಪವನ್ನು ಉಲ್ಲೇಖಿಸುತ್ತದೆ.' }, place: 'Madiwala', articleUrl: 'https://en.wikipedia.org/wiki/Inscription_stones_of_Bengaluru' },
  { year: 1295, precision: 'year', title: { en: 'Belur temple complex preserves an early Tamil inscription', kn: 'ಬೇಲೂರು ದೇವಾಲಯ ಸಮುಚ್ಚಯದಲ್ಲಿ ಆರಂಭಿಕ ತಮಿಳು ಶಾಸನ' }, note: { en: 'The locality page identifies a temple-basement inscription and later donation evidence.', kn: 'ಸ್ಥಳೀಯ ಲೇಖನವು ದೇವಾಲಯದ ಅಡಿಪಾಯದ ಶಾಸನ ಮತ್ತು ನಂತರದ ದಾನ ದಾಖಲೆಯನ್ನು ಗುರುತಿಸುತ್ತದೆ.' }, place: 'Belur', articleUrl: 'https://en.wikipedia.org/wiki/Inscription_stones_of_Bengaluru' },
  { year: 1342, precision: 'year', title: { en: 'Jakkur land-grant record names the village', kn: 'ಜಕ್ಕೂರು ಭೂದಾನ ದಾಖಲೆಯಲ್ಲಿ ಗ್ರಾಮದ ಹೆಸರು' }, note: { en: 'The record anchors Jakkur as a named village in the medieval landscape.', kn: 'ಈ ದಾಖಲೆ ಮಧ್ಯಯುಗದ ಭೂದೃಶ್ಯದಲ್ಲಿ ಜಕ್ಕೂರನ್ನು ಹೆಸರಿಸಲಾದ ಗ್ರಾಮವಾಗಿ ಸ್ಥಾಪಿಸುತ್ತದೆ.' }, place: 'Jakkur', articleUrl: 'https://en.wikipedia.org/wiki/Jakkur_inscriptions_and_hero_stones' },
  { year: 1524, precision: 'year', title: { en: 'Singapura donation record links the village to a temple endowment', kn: 'ಸಿಂಗಾಪುರ ದಾನ ಶಾಸನ ಗ್ರಾಮವನ್ನು ದೇವಾಲಯದ ದಾನಕ್ಕೆ ಜೋಡಿಸುತ್ತದೆ' }, note: { en: 'A donation to a deity at Singapura is used to trace the locality’s historical name and patronage.', kn: 'ಸಿಂಗಾಪುರದ ದೇವತೆಗೆ ನೀಡಿದ ದಾನವು ಸ್ಥಳನಾಮ ಮತ್ತು ಆಶ್ರಯದ ಇತಿಹಾಸವನ್ನು ತೋರಿಸುತ್ತದೆ.' }, place: 'Singapura', articleUrl: 'https://en.wikipedia.org/wiki/Singapura_inscriptions_and_hero_stones' },
  { year: 1628, precision: 'year', title: { en: 'Chikkapete Telugu inscription records Bengaluru and local rule', kn: 'ಚಿಕ್ಕಪೇಟೆಯ ತೆಲುಗು ಶಾಸನ ಬೆಂಗಳೂರಿನ ಹೆಸರು ಮತ್ತು ಸ್ಥಳೀಯ ಆಡಳಿತವನ್ನು ದಾಖಲಿಸುತ್ತದೆ' }, note: { en: 'The overview identifies a Telugu record with place-name and political references.', kn: 'ಸಮಗ್ರ ಲೇಖನವು ಸ್ಥಳನಾಮ ಮತ್ತು ರಾಜಕೀಯ ಉಲ್ಲೇಖಗಳಿರುವ ತೆಲುಗು ದಾಖಲೆಯನ್ನು ಗುರುತಿಸುತ್ತದೆ.' }, place: 'Chikkapete', articleUrl: 'https://en.wikipedia.org/wiki/Inscription_stones_of_Bengaluru' },
  { year: 1669, precision: 'year', title: { en: 'Malleshwaram donation record names Mallapura and Ekoji I', kn: 'ಮಲ್ಲೇಶ್ವರಂ ದಾನ ಶಾಸನ ಮಲ್ಲಪುರ ಮತ್ತು ಏಕೋಜಿ Iರನ್ನು ದಾಖಲಿಸುತ್ತದೆ' }, note: { en: 'The record connects place-name history with Maratha patronage of the Mallikarjuna temple.', kn: 'ಈ ದಾಖಲೆ ಸ್ಥಳನಾಮ ಇತಿಹಾಸವನ್ನು ಮಲ್ಲಿಕಾರ್ಜುನ ದೇವಾಲಯದ ಮರಾಠ ಆಶ್ರಯದೊಂದಿಗೆ ಜೋಡಿಸುತ್ತದೆ.' }, place: 'Malleshwaram', articleUrl: 'https://en.wikipedia.org/wiki/Malleshwaram_inscriptions_and_hero_stones' },
  { year: 1705, precision: 'year', title: { en: 'Kothanur donation record refers to Bengaluru Fort', kn: 'ಕೋತನೂರು ದಾನ ಶಾಸನ ಬೆಂಗಳೂರು ಕೋಟೆಯನ್ನು ಉಲ್ಲೇಖಿಸುತ್ತದೆ' }, note: { en: 'The record is described as a Wodeyar-era village donation for temple upkeep.', kn: 'ದೇವಾಲಯ ನಿರ್ವಹಣೆಗೆ ಒಡೆಯರ ಕಾಲದ ಗ್ರಾಮ ದಾನದ ದಾಖಲೆಯಾಗಿ ಇದನ್ನು ವಿವರಿಸಲಾಗಿದೆ.' }, place: 'Kothanur', articleUrl: 'https://en.wikipedia.org/wiki/Inscription_stones_of_Bengaluru' },
]
