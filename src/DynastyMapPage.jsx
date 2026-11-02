import { useCallback, useEffect, useRef, useState } from 'react'
import { DYNASTY_PHASES } from './data/dynasty-areas'
import { ERA_FONTS } from './data/era-fonts'
import { loadDistricts } from './DynastyAreasLayer'
import { pathOf } from './DynastyGallery'
import './script-fonts.css'

const URL_TEXT = 'karnata.sanchaya.net'
const W = 1600, H = 1000, COLS = 6, CELL_W = 250, CELL_H = 350
const copy = {
  kn: { title: 'ಎಲ್ಲ ರಾಜವಂಶಗಳು ಮತ್ತು ಅವುಗಳ ಪ್ರದೇಶ (ಅಂದಾಜು)', intro: 'ಇಂದಿನ ಜಿಲ್ಲೆಗಳ ಆಕಾರದಲ್ಲಿ ಪ್ರತಿ ರಾಜವಂಶದ ಅಂದಾಜು ಪ್ರದೇಶ. ಈ ಚಿತ್ರವನ್ನು ನಕಲಿಸಿ ಅಥವಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಹಂಚಿಕೊಳ್ಳಿ; ಅದರಲ್ಲಿ ಯೋಜನೆಯ ಕೊಂಡಿ ಮತ್ತು ಕ್ಯೂಆರ್ ಇದೆ.', copyImage: 'ಚಿತ್ರ ನಕಲಿಸಿ', download: 'ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್', copyLink: 'ಕೊಂಡಿ ನಕಲಿಸಿ', copied: 'ನಕಲಿಸಲಾಗಿದೆ', failed: 'ನಕಲಿಸಲಾಗಲಿಲ್ಲ; ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ', note: 'ಅಂದಾಜು ಪ್ರದೇಶಗಳು; ಪರಿಶೀಲನೆ ಬಾಕಿ.', project: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ', scan: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' },
  en: { title: 'All dynasties and their areas (approximate)', intro: 'Each dynasty’s approximate area on today’s district shapes. Copy or download this image to share; it carries the project link and a QR code.', copyImage: 'Copy image', download: 'Download image', copyLink: 'Copy link', copied: 'Copied', failed: 'Could not copy; download the image instead', note: 'Approximate areas; awaiting review.', project: 'Karnataka Historical Atlas', scan: 'Scan to explore' },
}

const loadImage = src => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src })

async function draw(canvas, districts, locale) {
  const t = copy[locale], base = import.meta.env.BASE_URL
  const families = [...new Set(DYNASTY_PHASES.map(phase => ERA_FONTS[phase.polityId]?.family).filter(Boolean))]
  await Promise.all(families.map(family => document.fonts.load(`24px "${family}"`, 'ಕ').catch(() => null)))
  await document.fonts.load('700 40px "Noto Sans Kannada"', 'ಕ').catch(() => null)
  const qr = await loadImage(`${base}karnata-qr.svg`).catch(() => null)
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#1b1f3b'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  ctx.font = '700 44px "Noto Sans Kannada", Inter, sans-serif'; ctx.fillText(t.title, W / 2, 80)
  ctx.fillStyle = '#6b6f8a'; ctx.font = '22px "Noto Sans Kannada", Inter, sans-serif'; ctx.fillText(t.note, W / 2, 118)
  const shapes = (districts?.features || []).map(feature => ({ id: feature.properties.id, path: new Path2D(pathOf(feature.geometry)) }))
  const left = (W - COLS * CELL_W) / 2, top = 150
  DYNASTY_PHASES.forEach((phase, index) => {
    const x = left + (index % COLS) * CELL_W, y = top + Math.floor(index / COLS) * CELL_H
    const own = new Set(phase.districts)
    ctx.fillStyle = '#fffdf8'; ctx.strokeStyle = '#e3dfd2'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.roundRect(x + 8, y + 8, CELL_W - 16, CELL_H - 16, 16); ctx.fill(); ctx.stroke()
    ctx.save(); ctx.translate(x + (CELL_W - 168) / 2, y + 24); ctx.scale(0.6, 0.6)
    for (const shape of shapes) {
      ctx.globalAlpha = own.has(shape.id) ? 0.85 : 0.6
      ctx.fillStyle = own.has(shape.id) ? phase.color : '#ece6d6'; ctx.fill(shape.path)
      ctx.globalAlpha = 1; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke(shape.path)
    }
    ctx.restore()
    const era = ERA_FONTS[phase.polityId]
    ctx.fillStyle = '#1b1f3b'
    ctx.font = `${era ? 30 : 24}px ${era ? `"${era.family}",serif` : '"Noto Sans Kannada", Inter, sans-serif'}`
    const name = phase.name[locale]
    const words = name.split(' '), lines = []
    for (const word of words) { const last = lines[lines.length - 1]; if (last && ctx.measureText(`${last} ${word}`).width < CELL_W - 36) lines[lines.length - 1] = `${last} ${word}`; else lines.push(word) }
    lines.slice(0, 2).forEach((line, i) => ctx.fillText(line, x + CELL_W / 2, y + 306 - (lines.length > 1 ? 0 : 14) + i * 0))
    ctx.fillStyle = '#6b6f8a'; ctx.font = '18px Inter, sans-serif'; ctx.fillText(`${phase.from}–${phase.to}`, x + CELL_W / 2, y + 330)
  })
  // The 12th cell is the call to action: the project, its link and a QR code.
  const x = left + (11 % COLS) * CELL_W, y = top + Math.floor(11 / COLS) * CELL_H
  ctx.fillStyle = '#1b1f3b'; ctx.beginPath(); ctx.roundRect(x + 8, y + 8, CELL_W - 16, CELL_H - 16, 16); ctx.fill()
  if (qr) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(x + 40, y + 24, 170, 170, 10); ctx.fill(); ctx.drawImage(qr, x + 44, y + 28, 162, 162) }
  ctx.fillStyle = '#fff'; ctx.font = '700 22px "Noto Sans Kannada", Inter, sans-serif'; ctx.fillText(t.scan, x + CELL_W / 2, y + 226)
  ctx.font = '700 20px Inter, sans-serif'; ctx.fillText(URL_TEXT, x + CELL_W / 2, y + 262)
  ctx.font = '18px "Noto Sans Kannada", Inter, sans-serif'; ctx.fillText(t.project, x + CELL_W / 2, y + 296)
  ctx.fillStyle = '#6b6f8a'; ctx.font = '22px Inter, sans-serif'; ctx.fillText(`${t.project} · ${URL_TEXT}`, W / 2, H - 36)
}

const toBlob = canvas => new Promise(resolve => canvas.toBlob(resolve, 'image/png'))

export default function DynastyMapPage({ locale = 'kn' }) {
  const t = copy[locale] || copy.kn
  const canvas = useRef(null)
  const [status, setStatus] = useState('')
  useEffect(() => { let on = true; loadDistricts().then(districts => on && canvas.current && draw(canvas.current, districts, locale)); return () => { on = false } }, [locale])
  const say = message => { setStatus(message); setTimeout(() => setStatus(''), 2500) }
  const copyImage = useCallback(async () => {
    try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': toBlob(canvas.current) })]); say(t.copied) } catch { say(t.failed) }
  }, [t])
  const download = useCallback(async () => {
    const link = document.createElement('a'); link.download = 'karnataka-dynasties-map.png'; link.href = URL.createObjectURL(await toBlob(canvas.current)); link.click(); URL.revokeObjectURL(link.href)
  }, [])
  const copyLink = useCallback(async () => { try { await navigator.clipboard.writeText(`https://${URL_TEXT}`); say(t.copied) } catch { say(t.failed) } }, [t])
  return <main className="portal-page dynasty-map-page" id="dynasties">
    <section className="script-hero"><div><p className="eyebrow">{t.project}</p><h2>{t.title}</h2><p>{t.intro}</p></div></section>
    <div className="dynasty-map-actions"><button type="button" onClick={copyImage}>{t.copyImage}</button><button type="button" onClick={download}>{t.download}</button><button type="button" onClick={copyLink}>{t.copyLink}</button><span role="status">{status}</span></div>
    <canvas ref={canvas} className="dynasty-map-canvas" role="img" aria-label={t.title} />
  </main>
}
