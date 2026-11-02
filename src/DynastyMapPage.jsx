import { useCallback, useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { evidenceFor } from './data/dynasty-evidence'
import { DYNASTY_PHASES, dynastyAreasForYear } from './data/dynasty-areas'
import DynastyAreasControl from './DynastyAreasControl'
import { loadDistricts, loadStates } from './DynastyAreasLayer'
import DynastyGallery, { VIEW, eraFamily, nameLines, pathOf, washOf } from './DynastyGallery'
import DynastyEras from './DynastyEras'
import DynastyAssumptions from './DynastyAssumptions'
import DynastyHelpWanted from './DynastyHelpWanted'
import DynastyProfile from './DynastyProfile'
import SearchBox from './SearchBox'
import './script-fonts.css'

const URL_TEXT = 'karnata.sanchaya.net'
const COLS = 6, CELL_W = 360, CELL_H = 520, W = COLS * CELL_W + 100
const ROWS = Math.ceil((DYNASTY_PHASES.length + 1) / COLS), H = 360 + ROWS * CELL_H
const copy = {
  kn: { title: 'ಎಲ್ಲ ರಾಜವಂಶಗಳು ಮತ್ತು ಅವುಗಳ ಪ್ರದೇಶ (ಅಂದಾಜು)', intro: 'ಪ್ರತಿ ರಾಜವಂಶದ ಅಂದಾಜು ಪ್ರಭಾವ: ಅಟ್ಲಸ್‌ನಲ್ಲಿ ದಾಖಲಾದ ರಾಜಧಾನಿ, ಶಾಸನ, ಸ್ಮಾರಕ, ನಾಣ್ಯ ಮತ್ತು ಘಟನೆಗಳ ಸುತ್ತ ಮೃದು ಛಾಯೆಯಾಗಿ ತೋರಿಸಲಾಗಿದೆ. ಇವು ಗಡಿಗಳಲ್ಲ. ಹಂಚಿಕೊಳ್ಳಲು ಪೋಸ್ಟರ್ ನಕಲಿಸಿ ಅಥವಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ; ಅದರಲ್ಲಿ ಯೋಜನೆಯ ಕೊಂಡಿ ಮತ್ತು QR ಕೋಡ್ ಇದೆ.', copyImage: 'ಚಿತ್ರ ನಕಲಿಸಿ', download: 'ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್', copyLink: 'ಕೊಂಡಿ ನಕಲಿಸಿ', copied: 'ನಕಲಿಸಲಾಗಿದೆ', failed: 'ನಕಲಿಸಲಾಗಲಿಲ್ಲ; ಚಿತ್ರ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ', cta: 'ಇದು ಅಂದಾಜು ಚಿತ್ರಣ. ಇದನ್ನು ಪರಿಶೀಲಿಸಿ, ಕೊರತೆಗಳಿದ್ದರೆ ನಮ್ಮೊಂದಿಗೆ ಕೈಜೋಡಿಸಿ ತಿದ್ದಿ.', posterKn: 'ಕನ್ನಡ ಚಿತ್ರ', posterEn: 'English ಚಿತ್ರ', note: 'ದಾಖಲಾದ ಆಧಾರಗಳ ಸುತ್ತ ಮೃದು ಛಾಯೆ, ಗಡಿಗಳಲ್ಲ; ಪರಿಶೀಲನೆ ಬಾಕಿ. ಕಡಿಮೆ ದಾಖಲೆಗಳಿರುವ ರಾಜವಂಶಗಳಿಗೆ ರಾಜಧಾನಿ ಮಾತ್ರ ತೋರಿಸಲಾಗಿದೆ.', choose: 'ರಾಜವಂಶ ಆರಿಸಿ', pick: 'ವರ್ಷವನ್ನು ಬದಲಿಸಿ, ನಂತರ ಮೇಲಿನಿಂದ ರಾಜವಂಶ ಆರಿಸಿ. ಬಿಂದುವಿನ ಮೇಲೆ ಹೋದರೆ ದಾಖಲೆ ಕಾಣುತ್ತದೆ.', project: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ', scan: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' },
  en: { title: 'All dynasties and their areas (approximate)', intro: 'Each dynasty’s approximate influence, drawn as soft shading around the capitals, inscriptions, monuments, coins and events the atlas records for it. These are not borders. Copy or download the shareable poster; it carries the project link and a QR code.', copyImage: 'Copy image', download: 'Download image', copyLink: 'Copy link', copied: 'Copied', failed: 'Could not copy; download the image instead', cta: 'This is an approximate draft. Review it and collaborate with us on any shortcomings.', posterKn: 'Kannada poster', posterEn: 'English poster', note: 'Soft shading around recorded evidence, not borders; awaiting review. Dynasties with few records show a capital only.', choose: 'Choose a dynasty', pick: 'Move the year, then pick a dynasty above. Hover a dot to see its record.', project: 'Karnataka Historical Atlas', scan: 'Scan to explore' },
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
    ctx.fillStyle = '#fffdf8'; ctx.strokeStyle = '#e3dfd2'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.roundRect(x + 8, y + 8, CELL_W - 16, CELL_H - 16, 16); ctx.fill(); ctx.stroke()
    ctx.save(); ctx.translate(x + (CELL_W - VIEW.w * 0.55) / 2, y + 24); ctx.scale(0.55, 0.55)
    ctx.beginPath(); ctx.rect(0, 0, VIEW.w, VIEW.h); ctx.clip()
    ctx.lineWidth = 1.5
    for (const feature of states?.features || []) { const path = new Path2D(pathOf(feature.geometry)); ctx.fillStyle = '#f6f2e6'; ctx.fill(path); ctx.strokeStyle = '#ddd6c4'; ctx.stroke(path) }
    for (const shape of shapes) { ctx.fillStyle = '#e6dfcc'; ctx.fill(shape.path); ctx.strokeStyle = '#e6dfcc'; ctx.lineWidth = 1; ctx.stroke(shape.path) }
    const wash = washOf(phase)
    for (const disc of wash.filter(item => !item.lead)) {
      const gradient = ctx.createRadialGradient(disc.x, disc.y, 0, disc.x, disc.y, disc.r)
      gradient.addColorStop(0, phase.color); gradient.addColorStop(1, `${phase.color}00`)
      ctx.globalAlpha = Math.min(1, disc.alpha * 3.2); ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(disc.x, disc.y, disc.r, 0, 7); ctx.fill()
    }
    ctx.globalAlpha = 1; ctx.lineWidth = 2.5; ctx.strokeStyle = '#fff'
    for (const disc of wash) {
      ctx.beginPath(); ctx.arc(disc.x, disc.y, disc.lead ? 6 : disc.capital ? 6 : 3.5, 0, 7)
      if (disc.lead) { ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = phase.color; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = '#fff' }
      else { ctx.fillStyle = phase.color; ctx.fill(); ctx.stroke() }
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
  // The last cell is the call to action: the project, its link and a QR code.
  const x = left + (DYNASTY_PHASES.length % COLS) * CELL_W, y = top + Math.floor(DYNASTY_PHASES.length / COLS) * CELL_H
  ctx.fillStyle = '#1b1f3b'; ctx.beginPath(); ctx.roundRect(x + 8, y + 8, CELL_W - 16, CELL_H - 16, 16); ctx.fill()
  if (qr) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(x + 70, y + 40, 260, 260, 12); ctx.fill(); ctx.drawImage(qr, x + 78, y + 48, 244, 244) }
  ctx.fillStyle = '#fff'
  fitText(t.scan, x + CELL_W / 2, y + 352, 28, sans, '700')
  fitText(URL_TEXT, x + CELL_W / 2, y + 396, 28, 'Inter, sans-serif', '700')
  fitText(t.project, x + CELL_W / 2, y + 440, 22, sans)
  ctx.fillStyle = '#fff4d6'; ctx.strokeStyle = '#f0c96a'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.roundRect(left + 8, top + ROWS * CELL_H + 8, COLS * CELL_W - 16, 96, 16); ctx.fill(); ctx.stroke()
  ctx.fillStyle = '#1b1f3b'
  fitText(t.cta, W / 2, top + ROWS * CELL_H + 66, 32, sans, '700', COLS * CELL_W - 80)
  ctx.fillStyle = '#6b6f8a'; ctx.font = '22px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${t.project} · ${URL_TEXT}`, W / 2, H - 36)
}

const toBlob = canvas => new Promise(resolve => canvas.toBlob(resolve, 'image/png'))

const ICONS = {
  copy: 'M9 9h10v10H9zM5 15V5h10',
  download: 'M12 4v10m0 0-4-4m4 4 4-4M5 19h14',
  link: 'M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3A4 4 0 0 0 11 18.6l1-1',
}
const IconButton = ({ label, onClick, path }) => <button type="button" className="icon-btn" aria-label={label} title={label} onClick={onClick}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg></button>

const MIN_YEAR = 100, MAX_YEAR = 1950
// Years where a dynasty rises or the map changes sharply, in the same spirit as the home timeline's milestone buttons.
const MILESTONES = [345, 543, 753, 973, 1156, 1336, 1565, 1761, 1800, 1947]
const ui = {
  kn: { tabs: { map: 'ರಾಜವಂಶ ಭೂಪಟ', eras: 'ಯುಗಗಳ ನಕ್ಷೆಗಳು', download: 'ಡೌನ್‌ಲೋಡ್ ಮತ್ತು ಹಂಚಿಕೆ' }, year: 'ವರ್ಷ', ce: 'ಕ್ರಿ.ಶ.', all: 'ಈ ವರ್ಷದ ಎಲ್ಲ ರಾಜವಂಶಗಳು', active: 'ಈ ವರ್ಷ ಸಕ್ರಿಯ ರಾಜವಂಶಗಳು', none: 'ಈ ವರ್ಷಕ್ಕೆ ನಕ್ಷೆ ಮಾಡಿದ ರಾಜವಂಶ ಇಲ್ಲ', browse: 'ಎಲ್ಲ ರಾಜವಂಶಗಳ ಪಟ್ಟಿ', search: 'ರಾಜವಂಶ ಹುಡುಕಿ', searchHint: 'ಉದಾ: ಹೊಯ್ಸಳ, ಬಾದಾಮಿ, ಸಿಂದ', noMatch: 'ಯಾವ ರಾಜವಂಶವೂ ಸಿಗಲಿಲ್ಲ', evidence: 'ದಾಖಲೆಗಳು', help: 'ಸಹಕಾರ ಬೇಕು' },
  en: { tabs: { map: 'Dynasty map', eras: 'Maps by era', download: 'Download & share' }, year: 'Year', ce: 'CE', all: 'All dynasties this year', active: 'Dynasties active this year', none: 'No mapped dynasty for this year', browse: 'Browse all dynasties', search: 'Find a dynasty', searchHint: 'e.g. Hoysala, Badami, Sinda', noMatch: 'No dynasty found', evidence: 'records', help: 'Help wanted' },
}

// Zoom to the recorded evidence of the dynasties on show (padded by the wash), or leave the default view when there is none.
function FitEvidence({ phases, year }) {
  const map = useMap()
  useEffect(() => {
    // Only the Karnataka neighbourhood sets the view; a far capital (Thanjavur, Pune) must not zoom the map out to all of India.
    const points = phases.flatMap(phase => evidenceFor(phase, year)).filter(point => point.tier !== 'influence' && point.lat > 8 && point.lat < 20.5 && point.lng > 72.5 && point.lng < 80.5)
    if (points.length > 1) map.fitBounds(points.map(point => [point.lat, point.lng]), { padding: [60, 60], maxZoom: 8 })
    else if (points.length) map.setView([points[0].lat, points[0].lng], 7)
  }, [map, phases, year])
  return null
}

// The map sits in a hidden tab part of the time; Leaflet must re-measure it when the tab shows.
function InvalidateOnShow({ visible }) {
  const map = useMap()
  useEffect(() => { if (visible) setTimeout(() => map.invalidateSize(), 60) }, [map, visible])
  return null
}

export default function DynastyMapPage({ locale = 'kn' }) {
  const t = copy[locale] || copy.kn, u = ui[locale] || ui.kn
  const [status, setStatus] = useState('')
  const [tab, setTab] = useState('map')
  const [year, setYear] = useState(1100)
  const [chosenId, setChosenId] = useState('all')
  const active = useMemo(() => dynastyAreasForYear(year).active, [year])
  const chosen = active.find(phase => phase.id === chosenId)
  const phases = useMemo(() => (chosen ? [chosen] : active), [chosen, active])
  const searchItems = useMemo(() => DYNASTY_PHASES.map(phase => ({ id: phase.id, label: phase.name[locale], hint: `${phase.from}–${phase.to}`, search: `${phase.name.kn} ${phase.name.en} ${phase.capital.kn} ${phase.capital.en}` })), [locale])
  const pickFromList = phase => { setYear(current => Math.min(Math.max(current, phase.from), phase.to)); setChosenId(phase.id); setTab('map') }
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
    <div className="dyn-tabs" role="tablist">{Object.entries(u.tabs).map(([key, label]) => <button key={key} type="button" role="tab" id={`dyn-tab-${key}`} aria-selected={tab === key} aria-controls={`dyn-panel-${key}`} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>)}</div>

    <section className="dyn-panel" role="tabpanel" id="dyn-panel-map" aria-labelledby="dyn-tab-map" hidden={tab !== 'map'}>
      <SearchBox label={u.search} placeholder={u.searchHint} emptyText={u.noMatch} items={searchItems} onPick={item => pickFromList(DYNASTY_PHASES.find(phase => phase.id === item.id))} />
      <div className="dyn-timeline">
        <div className="dyn-timeline-head"><span>{u.year}</span><strong>{u.ce} {year}</strong></div>
        <input type="range" aria-label={u.year} min={MIN_YEAR} max={MAX_YEAR} value={year} onChange={event => setYear(Number(event.target.value))} />
        <div className="dyn-ticks">{MILESTONES.map(value => <button key={value} type="button" className={Math.abs(year - value) < 20 ? 'active' : ''} onClick={() => setYear(value)}>{value}</button>)}</div>
      </div>
      <div className="dyn-rail" role="group" aria-label={u.active}>
        <button type="button" aria-pressed={!chosen} className={!chosen ? 'active' : ''} onClick={() => setChosenId('all')}><strong>{u.all}</strong><small>{active.length}</small></button>
        {active.map(phase => <button key={phase.id} type="button" aria-pressed={chosen?.id === phase.id} className={chosen?.id === phase.id ? 'active' : ''} style={{ '--c': phase.color }} onClick={() => setChosenId(phase.id)}>
          <strong>{phase.name[locale]}</strong><small>{phase.from}–{phase.to} · {evidenceFor(phase, year).filter(point => point.kind !== 'lead').length} {u.evidence}</small>{evidenceFor(phase, year).filter(point => point.kind !== 'lead').length < 4 && <em>{u.help}</em>}</button>)}
        {!active.length && <p>{u.none}</p>}
      </div>
      <section className="dynasty-live" aria-label={t.title}>
        <MapContainer bounds={[[9.5, 73.5], [19.5, 80.5]]} minZoom={3} zoomSnap={0.25} scrollWheelZoom={false}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <InvalidateOnShow visible={tab === 'map'} />
          <FitEvidence phases={phases} year={year} />
          <DynastyAreasControl locale={locale} phases={phases} evidenceYear={year} labels={phases.length <= 4} />
        </MapContainer>
        <p>{t.pick} {t.note}</p>
      </section>
      <DynastyProfile phase={chosen} locale={locale} />
      <DynastyHelpWanted locale={locale} />
      <DynastyAssumptions locale={locale} />
      <details className="dyn-browse"><summary>{u.browse} ({DYNASTY_PHASES.length})</summary>
        <DynastyGallery locale={locale} selectedId={chosen?.id} onSelect={pickFromList} /></details>
    </section>

    <section className="dyn-panel" role="tabpanel" id="dyn-panel-eras" aria-labelledby="dyn-tab-eras" hidden={tab !== 'eras'}>
      <DynastyEras locale={locale} />
      <DynastyAssumptions locale={locale} />
    </section>

    <section className="dyn-panel" role="tabpanel" id="dyn-panel-download" aria-labelledby="dyn-tab-download" hidden={tab !== 'download'}>
      <section className="dynasty-share">
        <img src={`${import.meta.env.BASE_URL}karnata-qr.svg`} alt="" width="120" height="120" />
        <div className="dynasty-share-body">
          <div className="dynasty-share-url"><strong>{URL_TEXT}</strong><IconButton label={t.copyLink} onClick={copyLink} path={ICONS.link} /></div>
          <span>{t.project}</span>
          {[['kn', 'ಕನ್ನಡ', t.posterKn], ['en', 'English', t.posterEn]].map(([lang, tag, label]) => <div className="dynasty-map-actions" key={lang} role="group" aria-label={label}><b lang={lang}>{tag}</b><IconButton label={`${t.copyImage} · ${tag}`} onClick={() => copyImage(lang)} path={ICONS.copy} /><IconButton label={`${t.download} · ${tag}`} onClick={() => download(lang)} path={ICONS.download} /></div>)}
          <span role="status" className="dynasty-share-status">{status}</span>
        </div>
      </section>
      <DynastyAssumptions locale={locale} />
    </section>
  </main>
}
