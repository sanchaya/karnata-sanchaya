export const kingdoms = [
  {
    id: 'kadamba', name: 'Kadamba', kannada: 'ಕದಂಬ', start: 345, end: 540,
    capital: 'Banavasi', centre: [14.54, 75.01], color: '#8d4d2f',
    summary: 'An early indigenous dynasty of Karnataka, associated with Banavasi and the development of Kannada administration.',
    polygon: [[15.9,73.8],[16.1,75.4],[15.0,76.2],[13.7,75.8],[13.1,74.4],[14.2,73.7]],
    rulers: ['Mayurasharma','Kangavarma','Kakusthavarma'],
    literature: [],
  },
  {
    id: 'ganga', name: 'Western Ganga', kannada: 'ಪಶ್ಚಿಮ ಗಂಗ', start: 350, end: 1000,
    capital: 'Talakad', centre: [12.19, 77.03], color: '#34715c',
    summary: 'A long-lived southern Karnataka dynasty whose inscriptions and Jain patronage shaped the region.',
    polygon: [[13.7,75.7],[14.2,77.2],[13.4,78.0],[11.5,77.8],[11.2,75.9],[12.5,75.2]],
    rulers: ['Kongunivarma','Durvinita','Rachamalla IV'],
    literature: [],
  },
  {
    id: 'badami-chalukya', name: 'Badami Chalukya', kannada: 'ಬಾದಾಮಿ ಚಾಲುಕ್ಯ', start: 543, end: 757,
    capital: 'Vatapi (Badami)', centre: [15.92, 75.68], color: '#b97823',
    summary: 'A Deccan imperial power known for Aihole, Badami and Pattadakal, and for major developments in temple architecture.',
    polygon: [[17.7,74.0],[18.0,77.3],[16.2,78.7],[13.8,77.3],[13.8,74.5],[15.4,73.6]],
    rulers: ['Pulakeshin I','Kirtivarman I','Pulakeshin II','Vikramaditya I'],
    literature: [],
  },
  {
    id: 'rashtrakuta', name: 'Rashtrakuta', kannada: 'ರಾಷ್ಟ್ರಕೂಟ', start: 753, end: 982,
    capital: 'Manyakheta', centre: [17.17, 77.29], color: '#6d4c8d',
    summary: 'A major imperial dynasty whose courts supported Sanskrit, Kannada and Jain literary cultures.',
    polygon: [[19.0,73.5],[20.1,77.5],[18.4,80.1],[14.1,79.0],[12.9,76.1],[15.0,73.3]],
    rulers: ['Dantidurga','Krishna I','Amoghavarsha I','Krishna III'],
    literature: [
      {title:'Kavirajamarga', author:'Srivijaya / Amoghavarsha I', year:850, url:'https://sanchaya.org'},
      {title:'Vikramarjuna Vijaya', author:'Pampa', year:941, url:'https://sanchaya.org'},
      {title:'Adipurana', author:'Pampa', year:941, url:'https://sanchaya.org'}
    ],
  },
  {
    id: 'kalyani-chalukya', name: 'Kalyani Chalukya', kannada: 'ಕಲ್ಯಾಣಿ ಚಾಲುಕ್ಯ', start: 973, end: 1189,
    capital: 'Kalyani', centre: [17.86, 76.95], color: '#315f91',
    summary: 'A western Deccan dynasty associated with temple building, administration and flourishing Kannada literature.',
    polygon: [[19.2,74.0],[19.5,78.1],[17.0,79.0],[13.3,77.5],[13.7,74.5],[16.0,73.8]],
    rulers: ['Tailapa II','Satyashraya','Someshvara I','Vikramaditya VI'],
    literature: [
      {title:'Gadayuddha', author:'Ranna', year:982, url:'https://sanchaya.org'},
      {title:'Vikramankadeva Charita', author:'Bilhana', year:1085, url:'https://sanchaya.org'}
    ],
  },
  {
    id: 'hoysala', name: 'Hoysala', kannada: 'ಹೊಯ್ಸಳ', start: 1000, end: 1346,
    capital: 'Dwarasamudra', centre: [13.16, 75.86], color: '#9e334b',
    summary: 'A southern Karnataka power remembered for monumental temple architecture and rich Kannada literary patronage.',
    polygon: [[14.6,74.8],[15.1,77.2],[13.6,78.2],[11.3,77.4],[11.4,75.1],[13.0,74.5]],
    rulers: ['Vishnuvardhana','Ballala II','Narasimha III','Ballala III'],
    literature: [
      {title:'Janna’s Yashodhara Charite', author:'Janna', year:1209, url:'https://sanchaya.org'},
      {title:'Harishchandra Kavya', author:'Raghavanka', year:1225, url:'https://sanchaya.org'}
    ],
  },
  {
    id: 'vijayanagara', name: 'Vijayanagara', kannada: 'ವಿಜಯನಗರ', start: 1336, end: 1646,
    capital: 'Vijayanagara (Hampi)', centre: [15.34, 76.46], color: '#b1452d',
    summary: 'A powerful South Indian empire centred at Hampi, with extensive political, architectural and literary influence.',
    polygon: [[17.7,74.2],[18.0,78.5],[15.2,79.2],[11.1,78.4],[10.8,75.4],[13.8,73.8]],
    rulers: ['Harihara I','Bukka Raya I','Devaraya II','Krishnadevaraya'],
    literature: [
      {title:'Kumaravyasa Bharata', author:'Kumaravyasa', year:1430, url:'https://sanchaya.org'},
      {title:'Torave Ramayana', author:'Kumara Valmiki', year:1500, url:'https://sanchaya.org'}
    ],
  },
  {
    id: 'mysore', name: 'Kingdom of Mysore', kannada: 'ಮೈಸೂರು ಸಂಸ್ಥಾನ', start: 1399, end: 1947,
    capital: 'Mysuru', centre: [12.31, 76.65], color: '#4e6f9e',
    summary: 'A major early-modern and modern state ruled by the Wadiyars, with the Hyder Ali–Tipu Sultan interlude.',
    polygon: [[14.0,75.0],[14.2,77.3],[12.9,78.2],[11.4,77.5],[11.3,75.7],[12.4,74.8]],
    rulers: ['Yaduraya','Chikka Devaraja Wadiyar','Krishnaraja Wadiyar III','Jayachamarajendra Wadiyar'],
    literature: []
  }
]

export const inscriptions = [
  {id:'talagunda', name:'Talagunda pillar inscription', year:455, place:'Talagunda', coords:[14.42,75.25], kingdom:'kadamba', language:'Sanskrit', script:'Southern Brahmi', note:'Important source for the Kadamba origin tradition.'},
  {id:'halmidi', name:'Halmidi inscription', year:450, place:'Halmidi', coords:[13.18,75.86], kingdom:'kadamba', language:'Kannada', script:'Early Kannada', note:'Among the earliest substantial Kannada inscriptions.'},
  {id:'aihole', name:'Aihole inscription', year:634, place:'Aihole', coords:[16.02,75.88], kingdom:'badami-chalukya', language:'Sanskrit', script:'Southern Brahmi', note:'Ravikirti’s prasasti of Pulakeshin II.'},
  {id:'shravanabelagola', name:'Shravanabelagola inscription cluster', year:981, place:'Shravanabelagola', coords:[12.86,76.49], kingdom:'ganga', language:'Kannada / Sanskrit', script:'Old Kannada', note:'Records connected with Chamundaraya and the Gommateshwara monument.'},
  {id:'hampi', name:'Hampi inscriptions', year:1520, place:'Hampi', coords:[15.34,76.46], kingdom:'vijayanagara', language:'Kannada / Telugu / Sanskrit', script:'Kannada / Telugu / Nagari', note:'Representative record cluster of the imperial capital.'}
]
