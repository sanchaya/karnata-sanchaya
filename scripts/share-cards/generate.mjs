// Renders the Aata-Paata share images: node scripts/share-cards/generate.mjs [outDir]
// Needs Playwright (PLAYWRIGHT=<path to its index.mjs> when it is not installed in the project). Writes <id>.<lang>.png, 1080x1080.
import { mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { cards } from './cards.mjs'

const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright')
const root = fileURLToPath(new URL('../../', import.meta.url))
const out = process.argv[2] || 'output/share-cards'
mkdirSync(out, { recursive: true })
const fonts = ['Kadamba-Kakusthavarman', 'Gangga-Marasimha', 'Chalukya-Vijayaditya', 'Hoysala-Regular'].map((file, i) => `@font-face{font-family:"${['Kadamba Kakusthavarman', 'Gangga Marasimha', 'Chalukya Vijayaditya', 'Hoysala Regular'][i]}";src:url("${pathToFileURL(`${root}src/fonts/${file}.woff`)}")}`).join('')
const logo = pathToFileURL(`${root}public/sanchaya-logo.png`)
const URLTEXT = 'karnata.sanchaya.net/#aata-paata'

const html = (card, lang) => {
  const other = lang === 'kn' ? 'en' : 'kn'
  return `<!doctype html><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box}body{margin:0;width:1080px;height:1080px;font-family:"Noto Sans Kannada","Kannada Sangam MN",system-ui,sans-serif;color:#fff;background:linear-gradient(145deg,${card.color[0]},${card.color[1]});display:flex;flex-direction:column;padding:64px;overflow:hidden}
.top{display:flex;align-items:center;gap:16px;font-weight:700;font-size:30px}.top img{width:64px;height:64px;border-radius:14px;background:#fff;padding:6px}.emoji{margin-left:auto;font-size:64px}
h1{margin:28px 0 4px;font-size:${lang === 'kn' ? 92 : 84}px;line-height:1.15}h2{margin:0;font-size:38px;font-weight:500;opacity:.85}
.stage{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;margin:24px 0}
.line{font-size:34px;line-height:1.4;text-align:center;font-weight:600}
.foot{display:flex;align-items:center;justify-content:space-between;font-size:28px}.foot b{padding:14px 26px;border-radius:99px;background:#fff;color:#2b2118;font-size:30px}
.tiles div{display:flex;gap:14px;margin:14px 0}.tiles span{width:112px;height:112px;border-radius:18px;display:grid;place-items:center;font-size:62px;font-weight:800;background:rgba(255,255,255,.18)}.tiles .correct{background:#2a9d5c}.tiles .present{background:#d9a21f}.tiles .absent{background:#5d6270}
.ygrid{display:grid;grid-template-columns:repeat(4,140px);gap:10px}.ygrid span{height:92px;border-radius:14px;background:#fff;color:#2b2118;display:grid;place-items:center;font-size:34px;font-weight:800}.ygrid .blank{background:rgba(255,255,255,.2)}
.xw{display:grid;grid-template-columns:repeat(7,58px);gap:6px}.xw span{height:58px;border-radius:8px;background:rgba(0,0,0,.18)}.xw .on{background:#fff}
.pinmap{width:600px;border-radius:22px;box-shadow:0 10px 30px rgba(0,0,0,.3)}.scorebar{display:flex;gap:24px;align-items:center;font-size:36px}.scorebar b{font-size:46px}
.clues{margin:0;padding:0;list-style:none;display:grid;gap:14px;width:820px}.clues li{padding:18px 24px;border-radius:16px;background:#fff;color:#2b2118;font-size:36px;font-weight:700}.clues li.dim{opacity:.55}
.chips{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;max-width:900px}.chips b{padding:16px 28px;border-radius:99px;background:#fff;color:#2b2118;font-size:42px}.chips.en b{background:rgba(255,255,255,.2);color:#fff;font-size:30px}
.eras{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:860px}.eras div{display:grid;gap:2px;padding:14px;border-radius:18px;background:#fffdf7;color:#2b2118;text-align:center}.eras span{display:block;height:104px;font-size:68px;line-height:1.6}.eras small{font-size:26px;font-weight:700}.fine{margin:0;font-size:24px;opacity:.85}
.sheet{width:560px;padding:34px;border-radius:12px;background:#fff;color:#2b2118;box-shadow:0 14px 34px rgba(0,0,0,.3);font-size:34px;transform:rotate(-2deg)}.sheet p{margin:14px 0}.sheet i{display:block;margin-top:18px;color:#28785b;font-weight:700}
</style>
<div class="top"><img src="${logo}"><span>ಆಟ–ಪಾಠ · Aata–Paata</span><span class="emoji">${card.emoji}</span></div>
<div><h1>${card.title[lang]}</h1><h2>${card.title[other]}</h2></div>
<div class="stage">${card.visual(lang)}<p class="line">${card.line[lang]}</p></div>
<div class="foot"><span>${lang === 'kn' ? 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ' : 'Karnataka Historical Atlas'}</span><b>${URLTEXT}</b></div>`
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } })
for (const card of cards) for (const lang of ['kn', 'en']) {
  const file = `${out}/${card.id}.${lang}.html`
  writeFileSync(file, html(card, lang))
  await page.goto(pathToFileURL(file).href)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${out}/${card.id}.${lang}.png` })
  console.log(`${card.id}.${lang}.png`)
}
await browser.close()
