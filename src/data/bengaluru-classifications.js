/*
 * Working taxonomy for the Bengaluru inscription research queue.
 * These are research classifications, not claims that an item has been
 * verified. Records derived only from a locality page or KML remain marked as
 * needs-review in the explorer.
 */
export const bengaluruClassificationLabels = {
  kn: {
    all: 'ಎಲ್ಲ ವರ್ಗಗಳು',
    'hero-stone': 'ವೀರಗಲ್ಲು / ಯುದ್ಧ ಸ್ಮಾರಕ',
    'temple-record': 'ದೇವಾಲಯ / ಧಾರ್ಮಿಕ ದಾಖಲೆ',
    'foundation-construction': 'ಸ್ಥಾಪನೆ / ನಿರ್ಮಾಣ',
    'land-grant': 'ಭೂದಾನ / ತೆರಿಗೆ / ಅನುದಾನ',
    'memorial-nishidhi': 'ನಿಷಿಧಿ / ಜೈನ ಸ್ಮಾರಕ',
    'royal-political': 'ರಾಜಕೀಯ / ವಂಶಾವಳಿ',
    'military-conflict': 'ಯುದ್ಧ / ಸೈನಿಕ ಸಂದರ್ಭ',
    'trade-guild': 'ವ್ಯಾಪಾರ / ಗಿಲ್ಡ್',
    'boundary-administrative': 'ಗಡಿ / ಆಡಳಿತ',
    'copper-plate': 'ತಾಮ್ರಪಟ',
    'civic-waterworks': 'ನೀರಾವರಿ / ನಾಗರಿಕ ಕಾಮಗಾರಿ',
    'locality-survey': 'ಸ್ಥಳೀಯತೆ / ಸಮೀಕ್ಷಾ ದಾರಿ',
    'unresolved-site': 'ತಾಣ ಇನ್ನೂ ಬಗೆಹರಿದಿಲ್ಲ',
  },
  en: {
    all: 'All classifications',
    'hero-stone': 'Hero stone / martial memorial',
    'temple-record': 'Temple / religious record',
    'foundation-construction': 'Foundation / construction',
    'land-grant': 'Land grant / tax / endowment',
    'memorial-nishidhi': 'Nishidhi / Jain memorial',
    'royal-political': 'Royal / political',
    'military-conflict': 'War / military context',
    'trade-guild': 'Trade / guild',
    'boundary-administrative': 'Boundary / administration',
    'copper-plate': 'Copper plate',
    'civic-waterworks': 'Waterworks / civic infrastructure',
    'locality-survey': 'Locality / survey lead',
    'unresolved-site': 'Site unresolved',
  },
}

const includesAny = (text, terms) => terms.some(term => text.includes(term))

export function classifyBengaluruInscription(record) {
  const text = JSON.stringify(record).toLowerCase()
  const classifications = []
  const add = value => { if (!classifications.includes(value)) classifications.push(value) }

  if (includesAny(text, ['hero stone', 'hero-stone', 'hero stones', 'veeragalu', 'hulibete', 'tiger-hunt'])) add('hero-stone')
  if (includesAny(text, ['temple', 'devalaya', 'shiva', 'panchalingeshwara', 'basadi', 'jain'])) add('temple-record')
  if (includesAny(text, ['construction', 'foundation', 'consecration', 'pratishtha'])) add('foundation-construction')
  if (includesAny(text, ['grant', 'donation', 'land', 'tax', 'endowment', 'dana', 'donative'])) add('land-grant')
  if (includesAny(text, ['nishidhi', 'sanyasana', 'sallekhana', 'memorial', 'samadhi'])) add('memorial-nishidhi')
  if (includesAny(text, ['copper plate', 'copper-plate', 'tamarapat', 'tamra'])) add('copper-plate')
  if (includesAny(text, ['battle', 'war', 'conflict', 'military', 'nagatara', 'hulibete'])) add('military-conflict')
  if (includesAny(text, ['merchant', 'guild', 'trade', 'ವ್ಯಾಪಾರ'])) add('trade-guild')
  if (includesAny(text, ['boundary', 'village limit', 'administrative', 'revenue'])) add('boundary-administrative')
  if (includesAny(text, ['tank', 'lake', 'irrigation', 'waterworks', 'canal'])) add('civic-waterworks')
  if (includesAny(text, ['king', 'ruler', 'royal', 'dynasty', 'political'])) add('royal-political')
  if (record.kmlFolder || record.kmlStatus || record.discovery?.sourceType === 'wikipedia') add('locality-survey')
  if (record.kmlFolder || record.kmlStatus || record.resolution?.coordinates?.status !== 'verified') add('unresolved-site')
  if (!classifications.length) add('locality-survey')
  return classifications
}
