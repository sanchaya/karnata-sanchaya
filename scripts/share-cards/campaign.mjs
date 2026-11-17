// Renders the Instagram support-campaign creatives (1080x1350, Kannada and English): node scripts/share-cards/campaign.mjs [outDir]
// Needs Playwright (PLAYWRIGHT=<path to its index.mjs> when it is not installed in the project). Captions and the posting plan: docs/instagram-campaign.md.
// Numbers come from public/data/open/atlas-summary.json, never typed by hand. The Kannada is a draft and needs a native speaker's proofreading before posting.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'

const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright')
const root = fileURLToPath(new URL('../../', import.meta.url))
const out = process.argv[2] || 'output/campaign'
mkdirSync(out, { recursive: true })
const depth = JSON.parse(readFileSync(`${root}public/data/open/atlas-summary.json`, 'utf8')).meta.datasetDepth
const fmt = (n, lang) => Number(n).toLocaleString(lang === 'kn' ? 'en-IN' : 'en-IN')
const asset = name => pathToFileURL(`${root}public/${name}`)

const stat = (value, label) => `<div class="stat"><b>${value}</b><span>${label}</span></div>`
const list = rows => `<ul class="rows">${rows.map(([icon, text]) => `<li><i>${icon}</i><span>${text}</span></li>`).join('')}</ul>`
const chips = items => `<div class="chips">${items.map(x => `<b>${x}</b>`).join('')}</div>`

export const posts = [
  { id: '01-why', color: ['#7a2e0e', '#c2581a'], emoji: '📜',
    title: { kn: 'ನಮ್ಮ ಇತಿಹಾಸ, ನಮ್ಮ ಭಾಷೆಯಲ್ಲಿ', en: 'Our history, in our language' },
    line: { kn: 'ಕನ್ನಡದಲ್ಲಿ ಕರ್ನಾಟಕದ ಇತಿಹಾಸ ಭೂಪಟ. ಎಲ್ಲರಿಗೂ ಉಚಿತ. 2011 ರಿಂದ ಸ್ವಯಂಸೇವಕರ ಶ್ರಮ.', en: 'A Kannada-first atlas of Karnataka’s history, free for everyone and built by volunteers since 2011.' },
    visual: lang => chips(lang === 'kn' ? ['ನಕ್ಷೆ', 'ಶಾಸನ', 'ರಾಜವಂಶ', 'ಸ್ಥಳ', 'ಹಕ್ಕಿ', 'ಜನರು'] : ['Maps', 'Inscriptions', 'Dynasties', 'Places', 'Birds', 'People']) },
  { id: '02-numbers', color: ['#1d3a6b', '#3a6fd0'], emoji: '🔢',
    title: { kn: 'ಇಷ್ಟೆಲ್ಲ ದಾಖಲೆ. ಇನ್ನೂ ಬಹಳ ಬಾಕಿ.', en: 'This much is built. Much more is waiting.' },
    line: { kn: `${fmt(depth.researchLeads, 'kn')} ಸುಳಿವುಗಳು ಇನ್ನೂ ಮನುಷ್ಯರ ಪರಿಶೀಲನೆಗೆ ಕಾಯುತ್ತಿವೆ.`, en: `${fmt(depth.researchLeads)} research leads still wait for a person to check them.` },
    visual: lang => stat(fmt(depth.totalRecords), lang === 'kn' ? 'ದಾಖಲೆಗಳು' : 'records') + stat(fmt(depth.sources), lang === 'kn' ? 'ಆಕರಗಳು' : 'sources') + stat(fmt(depth.relationships), lang === 'kn' ? 'ಸಂಬಂಧಗಳು' : 'relationships') },
  { id: '03-honest', color: ['#1f5c4a', '#2f9a78'], emoji: '✅',
    title: { kn: 'ಪ್ರತಿ ದಾಖಲೆಗೂ ಆಕರ', en: 'Every record shows its source' },
    line: { kn: 'ಪರಿಶೀಲನೆ ಆಗದಿದ್ದರೆ ಹಾಗೆಂದೇ ಹೇಳುತ್ತೇವೆ. ನಂಬಿಕೆಯೇ ನಮ್ಮ ಬಂಡವಾಳ.', en: 'If it is not checked yet, we say so. Trust is what we are building.' },
    visual: lang => list(lang === 'kn' ? [['📖', 'ಆಕರ ಮತ್ತು ಪುಟ ಸಂಖ್ಯೆ'], ['🔎', 'ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ ಕಾಣಿಸುತ್ತದೆ'], ['✎', 'ಯಾರಾದರೂ ತಿದ್ದುಪಡಿ ಸೂಚಿಸಬಹುದು']] : [['📖', 'Source and page locator'], ['🔎', 'Review status is visible'], ['✎', 'Anyone can suggest a fix']]) },
  { id: '04-games', color: ['#4361ee', '#7b4bb7'], emoji: '🎮',
    title: { kn: 'ಆಡಿ ಕಲಿಯಿರಿ, ಉಚಿತ', en: 'Play and learn, free' },
    line: { kn: 'ಪ್ರತಿದಿನ ಏಳು ಹೊಸ ಆಟ. ಶಾಲೆಗೆ ಮುದ್ರಿಸಬಹುದಾದ ಕಾರ್ಯಪತ್ರವೂ ಇದೆ. ಹೀಗೆ ಉಳಿಯಲು ನಿಮ್ಮ ಬೆಂಬಲ ಬೇಕು.', en: 'Seven new games every day and a printable classroom worksheet. Keeping them free takes your support.' },
    visual: lang => chips(lang === 'kn' ? ['ಪದಯಾನ', 'ಕಾಲಚೌಕ', 'ಪದಜಾಲ', 'ಎಲ್ಲಿದೆ?', 'ನಾನು ಯಾರು?', 'ಲಿಪಿ ಪತ್ತೆದಾರ'] : ['Word Trail', 'Time Grid', 'Crossword', 'Where is it?', 'Who am I?', 'Script Detective']) },
  { id: '05-birds', color: ['#2a6f3f', '#8bb23a'], emoji: '🐦',
    title: { kn: 'ಹಕ್ಕಿಗೆ ಕನ್ನಡ ಹೆಸರು ಕೊಡಿ', en: 'Give a bird its Kannada name' },
    line: { kn: 'ಇನ್ನೂ ಕನ್ನಡ ಹೆಸರಿಲ್ಲದ ಹಕ್ಕಿಗಳಿವೆ. ನಿಮ್ಮ ಊರಿನ ಹೆಸರು ತಿಳಿದಿದ್ದರೆ ಸೂಚಿಸಿ.', en: 'Some birds still have no Kannada name. If you know the name used in your village, tell us.' },
    visual: lang => `<div class="big">🦜 🦅 🦆 🕊️</div>` },
  { id: '06-where', color: ['#6b2340', '#c0446f'], emoji: '🧭',
    title: { kn: 'ನಿಮ್ಮ ಬೆಂಬಲ ಎಲ್ಲಿ ಹೋಗುತ್ತದೆ', en: 'Where your support goes' },
    line: { kn: 'ಸಂಚಿ ಫೌಂಡೇಶನ್ ಮೂಲಕ, ಲಾಭರಹಿತ ಕೆಲಸಕ್ಕೆ.', en: 'Through Sanchi Foundation, for non-profit work.' },
    visual: lang => list(lang === 'kn' ? [['🔍', 'ದಾಖಲೆಗಳನ್ನು ಆಕರದೊಂದಿಗೆ ಪರಿಶೀಲಿಸುವುದು'], ['📚', 'ಪುಸ್ತಕ, ಶಾಸನಗಳ ಡಿಜಿಟಲೀಕರಣ'], ['🌐', 'ತಾಣ ಉಚಿತವಾಗಿ ಚಾಲನೆಯಲ್ಲಿರುವುದು']] : [['🔍', 'Checking records against their sources'], ['📚', 'Digitising books and inscriptions'], ['🌐', 'Keeping the site online and free']]) },
  { id: '07-no-money', color: ['#5a3d8a', '#8a63c4'], emoji: '🤝',
    title: { kn: 'ಹಣವಿಲ್ಲದೆಯೂ ಸಹಾಯ ಮಾಡಬಹುದು', en: 'You can help without money too' },
    line: { kn: 'ಉಚಿತ ಖಾತೆ ತೆರೆದು ಕೊಡುಗೆ ನೀಡಿ. ಕೊಡುಗೆದಾರರ ಪಟ್ಟಿಯಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರು.', en: 'Open a free account and contribute. Your name goes on the contributors’ board.' },
    visual: lang => list(lang === 'kn' ? [['✎', 'ತಿದ್ದುಪಡಿ ಸೂಚಿಸಿ'], ['🐦', 'ಕನ್ನಡ ಹೆಸರು ಸೂಚಿಸಿ'], ['↗', 'ಶಾಲೆ, ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ']] : [['✎', 'Suggest a correction'], ['🐦', 'Suggest a Kannada name'], ['↗', 'Share with schools and friends']]) },
  { id: '08-80g', color: ['#8a5a00', '#d9a21f'], emoji: '🧾',
    title: { kn: 'ದೇಣಿಗೆಗೆ 80G ವಿನಾಯಿತಿ', en: 'Donations qualify for 80G' },
    line: { kn: 'ಸಂಚಿ ಫೌಂಡೇಶನ್ ಮೂಲಕ ನೀಡುವ ದೇಣಿಗೆಗೆ ರಸೀದಿ ಮತ್ತು 80G ಪ್ರಮಾಣಪತ್ರ: info@sanchifoundation.org', en: 'Donations through Sanchi Foundation get a receipt and an 80G certificate: info@sanchifoundation.org' },
    visual: lang => `<div class="big">🧾</div>` },
  { id: '09-donate', color: ['#7a2e0e', '#c2581a'], emoji: '♥', qr: true,
    title: { kn: 'ಈ ಕೆಲಸವನ್ನು ಬೆಂಬಲಿಸಿ', en: 'Support this work' },
    line: { kn: 'ಯಾವುದೇ ಮೊತ್ತ ಸಹಾಯ. UPI ಯಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ, ಅಥವಾ ಲಿಂಕ್ ನೋಡಿ.', en: 'Any amount helps. Scan with any UPI app, or use the link.' },
    visual: () => `<img class="qr" src="${asset('donate-qr.jpg')}">` },
]

const html = (post, lang) => {
  const other = lang === 'kn' ? 'en' : 'kn'
  return `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1080px;height:1350px;font-family:"Noto Sans Kannada","Kannada Sangam MN",system-ui,sans-serif;color:#fff;background:linear-gradient(160deg,${post.color[0]},${post.color[1]});display:flex;flex-direction:column;padding:64px 72px}
.top{display:flex;align-items:center;gap:18px;font-weight:700;font-size:30px}.top img{height:64px;border-radius:14px;background:#fff;padding:6px}.emoji{margin-left:auto;font-size:64px}
h1{margin:44px 0 8px;font-size:${lang === 'kn' ? 88 : 84}px;line-height:1.18}h2{margin:0;font-size:36px;font-weight:500;opacity:.85;line-height:1.3}
.stage{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;margin:20px 0}
.line{font-size:36px;line-height:1.45;text-align:center;font-weight:600;max-width:900px;margin:0}
.chips{display:flex;flex-wrap:wrap;gap:16px;justify-content:center;max-width:900px}.chips b{padding:18px 30px;border-radius:99px;background:#fff;color:#2b2118;font-size:44px}
.stat{display:flex;align-items:baseline;gap:24px;width:860px;padding:20px 34px;border-radius:22px;background:rgba(255,255,255,.16)}.stat b{font-size:86px;min-width:360px;text-align:right}.stat span{font-size:44px;font-weight:600}
.rows{margin:0;padding:0;list-style:none;display:grid;gap:18px;width:880px}.rows li{display:flex;align-items:center;gap:24px;padding:24px 30px;border-radius:20px;background:#fff;color:#2b2118;font-size:40px;font-weight:700}.rows i{font-style:normal;font-size:56px}
.big{font-size:170px}.qr{height:640px;border-radius:24px;box-shadow:0 14px 34px rgba(0,0,0,.35)}
.foot{display:flex;align-items:center;justify-content:space-between;font-size:28px}.foot b{padding:14px 28px;border-radius:99px;background:#fff;color:#2b2118;font-size:30px}
</style>
<div class="top"><img src="${asset('sanchaya-logo.png')}"><img src="${asset('sanchi-foundation-logo.png')}"><span class="emoji">${post.emoji}</span></div>
<div><h1>${post.title[lang]}</h1><h2>${post.title[other]}</h2></div>
<div class="stage">${post.visual(lang)}<p class="line">${post.line[lang]}</p></div>
<div class="foot"><span>${lang === 'kn' ? 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ' : 'Karnataka Historical Atlas'}</span><b>karnata.sanchaya.net${post.qr ? '/#donate' : ''}</b></div>`
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  for (const post of posts) for (const lang of ['kn', 'en']) {
    const file = `${out}/${post.id}.${lang}.html`
    writeFileSync(file, html(post, lang))
    await page.goto(pathToFileURL(file).href)
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `${out}/${post.id}.${lang}.png` })
    console.log(`${post.id}.${lang}.png`)
  }
  await browser.close()
}
