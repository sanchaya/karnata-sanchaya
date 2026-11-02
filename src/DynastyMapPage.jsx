import { useCallback, useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { DYNASTY_PHASES } from './data/dynasty-areas'
import DynastyAreasLayer, { loadDistricts, loadStates } from './DynastyAreasLayer'
import DynastyGallery, { VIEW, eraFamily, nameLines, pathOf, reachFeatures } from './DynastyGallery'
import './script-fonts.css'

const URL_TEXT = 'karnata.sanchaya.net'
const W = 1700, H = 1920, COLS = 4, CELL_W = 400, CELL_H = 520
const copy = {
  kn: { title: 'ಎಲ್ಲ ರಾಜವಂಶಗಳು ಮತ್ತು ಅವುಗಳ ಪ್ರದೇಶ (ಅಂದಾಜು)', intro: 'ಇಂದಿನ ಜಿಲ್ಲೆಗಳ ಆಕಾರದಲ್ಲಿ ಪ್ರತಿ ರಾಜವಂಶದ ಅಂದಾಜು ಪ್ರದೇಶ. ಹಂಚಿಕೊಳ್ಳಲು ಚಿತ್ರವನ್ನು ನಕಲಿಸಿ ಅಥವಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ; ಅದರಲ್ಲಿ ಯೋಜನೆಯ ಕೊಂಡಿ ಮತ್ತು ಕ್ಯೂಆರ್ ಇದೆ.', copyImage: 'ಚಿತ್ರ ನಕಲಿಸಿ', download: 'ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್', copyLink: 'ಕೊಂಡಿ ನಕಲಿಸಿ', copied: 'ನಕಲಿಸಲಾಗಿದೆ', failed: 'ನಕಲಿಸಲಾಗಲಿಲ್ಲ; ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ', cta: 'ಇದು ಅಂದಾಜು ಚಿತ್ರಣ. ಇದನ್ನು ಪರಿಶೀಲಿಸಿ, ಕೊರತೆಗಳಿದ್ದರೆ ನಮ್ಮೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ ತಿದ್ದಿ.', posterKn: 'ಕನ್ನಡ ಚಿತ್ರ', posterEn: 'English ಚಿತ್ರ', note: 'ಅಂದಾಜು ಪ್ರದೇಶಗಳು; ಪರಿಶೀಲನೆ ಬಾಕಿ. ತಿಳಿ ಬಣ್ಣ = ಕರ್ನಾಟಕದ ಹೊರಗಿನ ವಿಸ್ತೃತ ಪ್ರಭಾವ.', choose: 'ರಾಜವಂಶ ಆರಿಸಿ', pick: 'ಭೂಪಟವನ್ನು ಜೂಮ್ ಮಾಡಿ ಅಥವಾ ಜಿಲ್ಲೆಯ ಮೇಲೆ ಸರಿಸಿ ನೋಡಿ; ಎಡಭಾಗದಲ್ಲಿ ರಾಜವಂಶವನ್ನು ಆರಿಸಿ.', project: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ', scan: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' },
  en: { title: 'All dynasties and their areas (approximate)', intro: 'Each dynasty’s approximate area on today’s district shapes. Copy or download the shareable poster; it carries the project link and a QR code.', copyImage: 'Copy image', download: 'Download image', copyLink: 'Copy link', copied: 'Copied', failed: 'Could not copy; download the image instead', cta: 'This is an approximate draft. Review it and collaborate with us on any shortcomings.', posterKn: 'Kannada poster', posterEn: 'English poster', note: 'Approximate areas; awaiting review. Lighter shading = wider reach beyond Karnataka.', choose: 'Choose a dynasty', pick: 'Zoom the map or hover a district; choose a dynasty on the left.', project: 'Karnataka Historical Atlas', scan: 'Scan to explore' },
}

const loadImage = src => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src })

async function draw(canvas, districts, states, locale) {
  const t = copy[locale], base = import.meta.env.BASE_URL
  const families = [...new Set(DYNASTY_PHASES.map(eraFamily).filter(Boolean))]
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
  // Each name is shrunk to fit its card instead of wrapping, so lines never run into each other.
  const fitText = (text, x, baseline, size, face, weight = '', max = CELL_W - 48) => {
    let px = size
    do { ctx.font = `${weight} ${px}px ${face}`.trim(); px -= 1 } while (ctx.measureText(text).width > max && px > 12)
    ctx.fillText(text, x, baseline)
  }
  const sans = '"Noto Sans Kannada", Inter, sans-serif'
  DYNASTY_PHASES.forEach((phase, index) => {
    const x = left + (index % COLS) * CELL_W, y = top + Math.floor(index / COLS) * CELL_H
    const own = new Set(phase.districts)
    ctx.fillStyle = '#fffdf8'; ctx.strokeStyle = '#e3dfd2'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.roundRect(x + 8, y + 8, CELL_W - 16, CELL_H - 16, 16); ctx.fill(); ctx.stroke()
    ctx.save(); ctx.translate(x + (CELL_W - VIEW.w * 0.55) / 2, y + 24); ctx.scale(0.55, 0.55)
    ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip()
    for (const feature of reachFeatures(phase, states)) {
      const path = new Path2D(pathOf(feature.geometry))
      ctx.globalAlpha = 0.28; ctx.fillStyle = phase.color; ctx.fill(path)
      ctx.globalAlpha = 0.5; ctx.strokeStyle = phase.color; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.stroke(path); ctx.setLineDash([])
    }
    for (const shape of shapes) {
      ctx.globalAlpha = own.has(shape.id) ? 0.85 : 0.6
      ctx.fillStyle = own.has(shape.id) ? phase.color : '#ece6d6'; ctx.fill(shape.path)
      ctx.globalAlpha = 1; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke(shape.path)
    }
    ctx.restore()
    ctx.fillStyle = '#1b1f3b'
    let baseline = y + 372
    for (const line of nameLines(phase, locale)) {
      if (line.family) { fitText(line.text, x + CELL_W / 2, baseline, 32, `"${line.family}",serif`); baseline += 60 }
      else if (line.latin) { fitText(line.text, x + CELL_W / 2, baseline, 22, 'Inter, sans-serif', '700'); baseline += 30 }
      else { fitText(line.text, x + CELL_W / 2, baseline, 28, sans, '700'); baseline += 38 }
    }
    ctx.fillStyle = '#6b6f8a'; ctx.font = '18px Inter, sans-serif'; ctx.fillText(`${phase.from}–${phase.to}`, x + CELL_W / 2, y + CELL_H - 24)
  })
  // The 12th cell is the call to action: the project, its link and a QR code.
  const x = left + (11 % COLS) * CELL_W, y = top + Math.floor(11 / COLS) * CELL_H
  ctx.fillStyle = '#1b1f3b'; ctx.beginPath(); ctx.roundRect(x + 8, y + 8, CELL_W - 16, CELL_H - 16, 16); ctx.fill()
  if (qr) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(x + 70, y + 40, 260, 260, 12); ctx.fill(); ctx.drawImage(qr, x + 78, y + 48, 244, 244) }
  ctx.fillStyle = '#fff'
  fitText(t.scan, x + CELL_W / 2, y + 352, 28, sans, '700')
  fitText(URL_TEXT, x + CELL_W / 2, y + 396, 28, 'Inter, sans-serif', '700')
  fitText(t.project, x + CELL_W / 2, y + 440, 22, sans)
  ctx.fillStyle = '#fff4d6'; ctx.strokeStyle = '#f0c96a'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.roundRect(left + 8, top + 3 * CELL_H + 8, COLS * CELL_W - 16, 96, 16); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#1b1f3b'
  fitText(t.cta, W / 2, top + 3 * CELL_H + 66, 32, sans, '700', COLS * CELL_W - 80)
  ctx.fillStyle = '#6b6f8a'; ctx.font = '22px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${t.project} · ${URL_TEXT}`, W / 2, H - 36)
}

const toBlob = canvas => new Promise(resolve => canvas.toBlob(resolve, 'image/png'))

export default function DynastyMapPage({ locale = 'kn' }) {
  const t = copy[locale] || copy.kn
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(DYNASTY_PHASES[0])
  const [districts, setDistricts] = useState(null)
  useEffect(() => { let on = true; loadDistricts().then(data => on && setDistricts(data)); return () => { on = false } }, [])
  const say = message => { setStatus(message); setTimeout(() => setStatus(''), 2500) }
  // The shareable image is drawn on demand, off-screen, so the page itself stays a normal responsive layout.
  const render = useCallback(async lang => { const canvas = document.createElement('canvas'); await draw(canvas, await loadDistricts(), await loadStates(), lang); return toBlob(canvas) }, [])
  const copyImage = useCallback(async lang => {
    try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': render(lang) })]); say(t.copied) } catch { say(t.failed) }
  }, [render, t])
  const download = useCallback(async lang => {
    const link = document.createElement('a'); link.download = `karnataka-dynasties-map-${lang}.png`; link.href = URL.createObjectURL(await render(lang)); link.click(); URL.revokeObjectURL(link.href)
  }, [render])
  const copyLink = useCallback(async () => { try { await navigator.clipboard.writeText(`https://${URL_TEXT}`); say(t.copied) } catch { say(t.failed) } }, [t])
  return <main className="portal-page dynasty-map-page" id="dynasty-map">
    <section className="script-hero"><div><p className="eyebrow">{t.project}</p><h2>{t.title}</h2><p>{t.intro}</p></div></section>
    <div className="dynasty-layout">
      <aside className="dynasty-picker" aria-label={t.choose}><h3>{t.choose}</h3><DynastyGallery locale={locale} selectedId={selected.id} onSelect={setSelected} /></aside>
      <div className="dynasty-main">
        <section className="dynasty-live" aria-label={selected.name[locale]}>
          <MapContainer bounds={[[8, 73.5], [21, 81]]} minZoom={3} zoomSnap={0.25} scrollWheelZoom={false}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <DynastyAreasLayer locale={locale} districtGeojson={districts} phases={[selected]} fontFor={phase => (eraFamily(phase) ? `"${eraFamily(phase)}",serif` : undefined)} />
          </MapContainer>
          <p>{t.pick}</p>
        </section>
        <section className="dynasty-share">
          <img src={`${import.meta.env.BASE_URL}karnata-qr.svg`} alt="" width="120" height="120" />
          <div><strong>{URL_TEXT}</strong><span>{t.project}</span>
            {[['kn', t.posterKn], ['en', t.posterEn]].map(([lang, label]) => <div className="dynasty-map-actions" key={lang} role="group" aria-label={label}><b>{label}</b><button type="button" onClick={() => copyImage(lang)}>{t.copyImage}</button><button type="button" onClick={() => download(lang)}>{t.download}</button></div>)}
            <div className="dynasty-map-actions"><button type="button" onClick={copyLink}>{t.copyLink}</button><span role="status">{status}</span></div></div>
        </section>
        <p className="dynasty-map-note">{t.note}</p>
      </div>
    </div>
  </main>
}
