// Content for the Aata-Paata share images. `visual` is the illustration; every card is 1080x1080.
// The Kannada is a draft and needs a native speaker's proofreading before the images are posted.
const tiles = (rows, cls = '') => `<div class="tiles ${cls}">${rows.map(row => `<div>${row.map(([ch, st]) => `<span class="${st}">${ch}</span>`).join('')}</div>`).join('')}</div>`
const grid = rows => `<div class="ygrid">${rows.flat().map(v => `<span class="${v ? '' : 'blank'}">${v || ''}</span>`).join('')}</div>`
const era = ['Kadamba Kakusthavarman', 'Gangga Marasimha', 'Chalukya Vijayaditya', 'Hoysala Regular']
const eraNames = { kn: ['ಕದಂಬ', 'ಗಂಗ', 'ಚಾಲುಕ್ಯ', 'ಹೊಯ್ಸಳ'], en: ['Kadamba', 'Ganga', 'Chalukya', 'Hoysala'] }

export const cards = [
  { id: 'launch', color: ['#4361ee', '#7b4bb7'], emoji: '🎮',
    title: { kn: 'ಆಡಿ ಕಲಿಯಿರಿ', en: 'Learn by playing' },
    line: { kn: 'ಕರ್ನಾಟಕದ ಇತಿಹಾಸ — ಪ್ರತಿದಿನ ಆರು ಹೊಸ ಒಗಟುಗಳು', en: 'Karnataka’s history in six daily games' },
    visual: () => `<div class="chips">${['ಪದಯಾನ', 'ಕಾಲಚೌಕ', 'ಪದಜಾಲ', 'ಎಲ್ಲಿದೆ?', 'ನಾನು ಯಾರು?', 'ಲಿಪಿ ಪತ್ತೆದಾರ'].map(x => `<b>${x}</b>`).join('')}</div><div class="chips en">${['Word Trail', 'Time Grid', 'Crossword', 'Where is it?', 'Who am I?', 'Script Detective'].map(x => `<b>${x}</b>`).join('')}</div>` },
  { id: 'word', color: ['#2a9d5c', '#1d6b4a'], emoji: '🟩',
    title: { kn: 'ಪದಯಾನ', en: 'Word Trail' },
    line: { kn: 'ಆರು ಪ್ರಯತ್ನ, ಒಂದು ಕನ್ನಡ ಪದ. ಉತ್ತರ ಅಲ್ಲ, ಫಲಿತಾಂಶ ಹಂಚಿಕೊಳ್ಳಿ!', en: 'Six tries, one Kannada word. Share the grid, not the answer!' },
    visual: () => tiles([[['ಕ', 'absent'], ['ದಂ', 'present'], ['ಬ', 'correct'], ['ರು', 'absent']], [['ಹೊ', 'correct'], ['ಯ್ಸ', 'correct'], ['ಳ', 'correct'], ['', '']]]) },
  { id: 'year', color: ['#d98c1f', '#a85d0e'], emoji: '🔢',
    title: { kn: 'ಕಾಲಚೌಕ', en: 'Time Grid' },
    line: { kn: 'ಇತಿಹಾಸದ ಸುಡೊಕು: ನಾಲ್ಕು ವರ್ಷ, ಪ್ರತಿ ಸಾಲು-ಅಂಕಣದಲ್ಲಿ ಒಮ್ಮೆ', en: 'History Sudoku: four years, once in every row and column' },
    visual: () => grid([[455, '', 973, ''], ['', 1156, '', 455], [1156, '', 455, ''], ['', 455, '', 973]]) },
  { id: 'crossword', color: ['#2b7cc9', '#1b4f8a'], emoji: '✏️',
    title: { kn: 'ಇತಿಹಾಸ ಪದಜಾಲ', en: 'History Crossword' },
    line: { kn: 'ರಾಜವಂಶ, ಸ್ಥಳ, ಕೃತಿ, ಶಾಸನ — ಈ ವಾರದ ಪದಜಾಲ ಸಿದ್ಧ', en: 'Dynasties, places, works, inscriptions: this week’s crossword is ready' },
    visual: () => `<div class="xw">${['1000011', '1111111', '1010010', '1111110', '1010010', '0011000'].map(r => [...r].map(c => `<span class="${c === '1' ? 'on' : ''}"></span>`).join('')).join('')}</div>` },
  { id: 'where', color: ['#c0392b', '#8a2a20'], emoji: '📍',
    title: { kn: 'ಎಲ್ಲಿದೆ?', en: 'Where is it?' },
    line: { kn: 'ನಕ್ಷೆಯಲ್ಲಿ ಒಂದು ಗುರುತು. ಹತ್ತಿರವಿದ್ದಷ್ಟೂ ಹೆಚ್ಚು ಅಂಕ!', en: 'Drop a pin on the map. The closer, the more points!' },
    visual: () => `<svg viewBox="0 0 400 260" class="pinmap"><rect width="400" height="260" rx="22" fill="#e9f1f5"/><path d="M0 200 Q120 150 220 190 T400 150 V260 H0Z" fill="#cfe3ee"/><circle cx="270" cy="120" r="70" fill="none" stroke="#c0392b" stroke-width="3" stroke-dasharray="8 8" opacity=".5"/><line x1="130" y1="170" x2="270" y2="120" stroke="#2b2118" stroke-width="4" stroke-dasharray="10 8"/><circle cx="130" cy="170" r="16" fill="#4361ee" stroke="#fff" stroke-width="5"/><circle cx="270" cy="120" r="18" fill="#2a9d5c" stroke="#fff" stroke-width="5"/></svg><div class="scorebar"><span>🟩🟨🟥🟥🟥</span><b>1823 / 5000</b></div>` },
  { id: 'who', color: ['#7b4bb7', '#4b2d80'], emoji: '🤔',
    title: { kn: 'ನಾನು ಯಾರು?', en: 'Who am I?' },
    line: { kn: 'ಕಡಿಮೆ ಸುಳಿವಿನಲ್ಲಿ ರಾಜವಂಶವನ್ನು ಗುರುತಿಸಿ', en: 'Name the dynasty from as few clues as you can' },
    visual: lang => `<ol class="clues">${(lang === 'kn' ? ['ಸುಮಾರು 1156–1184 ಕ್ರಿ.ಶ.ರಲ್ಲಿ ಸಕ್ರಿಯ', 'ರಾಜಧಾನಿ: ಕಲ್ಯಾಣ', 'ಅಟ್ಲಸ್‌ನ ದಾಖಲೆ: ಒಂದು ಶಾಸನ', 'ಹೆಸರು ಇದರಿಂದ ಪ್ರಾರಂಭ: ಕ'] : ['Active about 1156–1184 CE', 'Capital: Kalyana', 'An atlas record: an inscription', 'The name begins with: K']).map((c, i) => `<li class="${i > 1 ? 'dim' : ''}">${c}</li>`).join('')}</ol>` },
  { id: 'script', color: ['#8d4d2f', '#5e2f1a'], emoji: '🔍',
    title: { kn: 'ಲಿಪಿ ಪತ್ತೆದಾರ', en: 'Script Detective' },
    line: { kn: 'ಒಂದೇ ಪದ, ನಾಲ್ಕು ಕಾಲದ ಅಕ್ಷರ ಶೈಲಿ — ಯಾವುದು ಯಾವುದು?', en: 'One word, four eras of lettering. Which is which?' },
    visual: lang => `<div class="eras">${era.map((f, i) => `<div><span style="font-family:'${f}'">ಕನ್ನಡ</span><small>${eraNames[lang][i]}</small></div>`).join('')}</div><p class="fine">${lang === 'kn' ? 'ಇಂದಿನ ಮುದ್ರಣ ಅಕ್ಷರಗಳು, ಆ ಕಾಲದ ಶೈಲಿಯ ನೆನಪಿಗೆ' : 'Modern typefaces recalling each period’s style'}</p>` },
  { id: 'worksheet', color: ['#28785b', '#1b5440'], emoji: '🏫',
    title: { kn: 'ತರಗತಿ ಕಾರ್ಯಪತ್ರ', en: 'Classroom worksheet' },
    line: { kn: 'ಶಿಕ್ಷಕರಿಗೆ: ಮುದ್ರಿಸಿ, ತರಗತಿಯಲ್ಲಿ ಬಳಸಿ. ಉತ್ತರಗಳು ಕೊನೆಯ ಪುಟದಲ್ಲಿ', en: 'For teachers: print it, use it in class. Answers on the last page' },
    visual: lang => `<div class="sheet"><b>${lang === 'kn' ? 'ಹೆಸರು: ________' : 'Name: ________'}</b>${[1, 2, 3].map(n => `<p>${n}. ________________</p>`).join('')}<i>${lang === 'kn' ? 'ಉತ್ತರಗಳು ▸' : 'Answer key ▸'}</i></div>` },
]
