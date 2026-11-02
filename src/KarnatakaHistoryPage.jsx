import { useState } from 'react'
import { ADMIN_SNAPSHOTS, CENSUS_ATLAS_MAP_URL, EARLY_EXTENT, NAME_ATTESTATIONS, NAME_ETYMOLOGIES, UPRISINGS } from './data/census-historical-atlas'

const copy = {
  kn: {
    eyebrow: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ', title: 'ಕರ್ನಾಟಕದ ಹೆಸರು ಮತ್ತು ಆಡಳಿತ',
    intro: 'ಕರ್ನಾಟಕ ಎಂಬ ಹೆಸರು ಮೊದಲು ಎಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ, ಅದರ ಅರ್ಥವೇನು, ಮತ್ತು 1657ರಿಂದ 1997ರ ವರೆಗೆ ಕನ್ನಡ ನಾಡು ಯಾವ ಆಡಳಿತ ಘಟಕಗಳಲ್ಲಿ ಹಂಚಿಹೋಗಿ ಒಂದಾಯಿತು ಎಂಬುದನ್ನು ಕಾಲಕ್ರಮದಲ್ಲಿ ತೋರಿಸುತ್ತದೆ.',
    tabs: { name: 'ಕರ್ನಾಟಕ ಹೆಸರು', admin: 'ಆಡಳಿತ ಇತಿಹಾಸ' },
    attest: 'ಹೆಸರಿನ ಆರಂಭಿಕ ಉಲ್ಲೇಖಗಳು', undated: 'ಕಾಲ ಅನಿಶ್ಚಿತ', kinds: { literary: 'ಸಾಹಿತ್ಯ', inscription: 'ಶಾಸನ', 'copper-plate': 'ತಾಮ್ರಶಾಸನ' },
    meaning: 'ಹೆಸರಿನ ಅರ್ಥದ ಬಗ್ಗೆ ವಿದ್ವಾಂಸರ ಅಭಿಪ್ರಾಯಗಳು', meaningNote: 'ಯಾವುದೂ ಅಂತಿಮವಲ್ಲ; ಲೇಖನವೇ ಹೇಳುವಂತೆ ವಿಷಯಕ್ಕೆ ಇನ್ನಷ್ಟು ಸಂಶೋಧನೆ ಬೇಕು.', by: 'ಪ್ರತಿಪಾದಕರು',
    extent: 'ಆರಂಭಿಕ ಕರ್ನಾಟಕ ಎಲ್ಲಿತ್ತು', regions: 'ಇತರ ಪ್ರಾದೇಶಿಕ ಹೆಸರುಗಳು', core: 'ಕವಿರಾಜಮಾರ್ಗದ ಮುಖ್ಯ ಸ್ಥಳಗಳು',
    jump: 'ಕಾಲಕ್ಕೆ ಹೋಗಿ', facts: 'ಮುಖ್ಯ ಅಂಶಗಳು', units: 'ಘಟಕಗಳು', map: 'ನಕ್ಷೆ', uprisings: 'ಬ್ರಿಟಿಷ್ ವಿರುದ್ಧ ದಂಗೆಗಳು, 1800–1858', uprisingsNote: 'ಆಕರದ ನಕ್ಷೆ 27ರಲ್ಲಿ ಗುರುತಿಸಿದ ಸ್ಥಳಗಳು.', who: 'ನಾಯಕರು', where: 'ಸ್ಥಳ', freedom: 'ಸ್ವಾತಂತ್ರ್ಯ ಚಳವಳಿ ಪುಟ ನೋಡಿ →',
    source: 'ಆಕರ', note: 'ಇಲ್ಲಿರುವುದು ಭಾರತದ ಜನಗಣತಿ 2001ರ ಕರ್ನಾಟಕದ ಐತಿಹಾಸಿಕ ಭೂಪಟ ಸಂಗ್ರಹ (2004) ದಲ್ಲಿರುವ ದಿನಾಂಕ, ಹೆಸರು, ಸ್ಥಳ ಮತ್ತು ಅಂಕಿಗಳು ಮಾತ್ರ; ಪಠ್ಯ ಮತ್ತು ನಕ್ಷೆ ನಕಲಿಸಿಲ್ಲ. ವಿವರಗಳು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿವೆ. ಪರಿಶೀಲನೆ ಬಾಕಿ.', open: 'ಆಕರ ತೆರೆಯಿರಿ ↗',
  },
  en: {
    eyebrow: 'Karnataka Historical Atlas', title: 'The name Karnataka and its administration',
    intro: 'Where the name Karnataka first appears, what it may mean, and how the Kannada country was divided among administrative units and then brought together between 1657 and 1997.',
    tabs: { name: 'The name Karnataka', admin: 'Administrative history' },
    attest: 'Earliest references to the name', undated: 'date open', kinds: { literary: 'Literary', inscription: 'Inscription', 'copper-plate': 'Copper plate' },
    meaning: 'What scholars think the name means', meaningNote: 'None is settled; the article itself says the subject needs further research.', by: 'Proposed by',
    extent: 'Where early Karnataka lay', regions: 'Other regional names', core: 'Core places in the Kavirajamarga',
    jump: 'Jump to', facts: 'Key points', units: 'Units', map: 'Map', uprisings: 'Uprisings against the British, 1800 to 1858', uprisingsNote: 'The places the atlas marks on its map 27.', who: 'Led by', where: 'Where', freedom: 'See the freedom movement page →',
    source: 'Source', note: 'This page records only dates, names, places and figures from the Census of India 2001 “A Historical Atlas of Karnataka” (2004); no text or map is copied. Awaiting review.', open: 'Open the source ↗',
  },
}
const label = (value, locale) => value?.[locale] || value?.en || ''

export default function KarnatakaHistoryPage({ locale = 'kn' }) {
  const t = copy[locale] || copy.kn
  const [tab, setTab] = useState('name')
  const attestations = [...NAME_ATTESTATIONS].sort((a, b) => (a.from ?? -1) - (b.from ?? -1))
  return <main className="portal-page karnataka-history-page" id="karnataka-history">
    <section className="script-hero"><div><p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2><p>{t.intro}</p></div></section>
    <div className="who-tabs" role="tablist">{Object.entries(t.tabs).map(([key, text]) => <button key={key} type="button" role="tab" id={`kh-tab-${key}`} aria-selected={tab === key} aria-controls={`kh-panel-${key}`} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{text}</button>)}</div>

    <section role="tabpanel" id="kh-panel-name" aria-labelledby="kh-tab-name" hidden={tab !== 'name'}>
      <h3>{t.attest}</h3>
      <ol className="kh-timeline">{attestations.map(item => <li key={item.id}>
        <div className="kh-year">{item.from == null ? t.undated : item.from === item.to ? item.from : `${item.from}–${item.to}`}</div>
        <div className="kh-card"><span className={`kh-kind kh-${item.kind}`}>{t.kinds[item.kind]}</span><h4>{label(item.title, locale)}</h4><p>{item.detail}</p><small>{item.where}</small></div>
      </li>)}</ol>
      <h3>{t.meaning}</h3><p className="kh-note">{t.meaningNote}</p>
      <ul className="kh-cards">{NAME_ETYMOLOGIES.map(item => <li key={item.id}><strong>{label(item, locale)}</strong><small>{t.by}: {item.who}</small></li>)}</ul>
      <h3>{t.extent}</h3>
      <p>{label(EARLY_EXTENT.core, locale)}</p>
      <div className="kh-two"><div><h4>{t.regions}</h4><ul>{EARLY_EXTENT.regionNames.map(item => <li key={item.name}><b>{item.name}</b>: {item.en}</li>)}</ul></div><div><h4>{t.core}</h4><ul>{EARLY_EXTENT.kavirajamargaCore.map(item => <li key={item}>{item}</li>)}</ul></div></div>
    </section>

    <section role="tabpanel" id="kh-panel-admin" aria-labelledby="kh-tab-admin" hidden={tab !== 'admin'}>
      <nav className="kh-jump" aria-label={t.jump}><span>{t.jump}</span>{ADMIN_SNAPSHOTS.map(item => <a key={item.id} href={`#kh-${item.id}`} onClick={event => { event.preventDefault(); document.getElementById(`kh-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>{item.from}</a>)}</nav>
      <ol className="kh-timeline">{ADMIN_SNAPSHOTS.map(item => <li key={item.id} id={`kh-${item.id}`}>
        <div className="kh-year">{item.from === item.to ? item.from : `${item.from}–${item.to}`}</div>
        <div className="kh-card"><h4>{label(item.title, locale)} <small>{t.map} {item.map}</small></h4>
          <h5>{t.facts}</h5><ul>{item.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>
          {item.units.length > 0 && <><h5>{t.units}</h5><dl className="kh-units">{item.units.map(unit => <div key={unit.name}><dt>{unit.name}</dt>{unit.detail && <dd>{unit.detail}</dd>}</div>)}</dl></>}
          {item.id === 'mysore-odeyars-1800' && <details className="kh-uprisings"><summary>{t.uprisings} ({UPRISINGS.length})</summary><p className="kh-note">{t.uprisingsNote} <a href="#freedom">{t.freedom}</a></p>
            <ul>{UPRISINGS.map(row => <li key={row.who + row.year}><b>{row.year}</b> · {row.en}<small>{t.who}: {row.who} · {t.where}: {row.where}</small></li>)}</ul></details>}
        </div>
      </li>)}</ol>
    </section>
    <p className="kh-source">{t.note} <a href={CENSUS_ATLAS_MAP_URL} target="_blank" rel="noreferrer">{t.open}</a></p>
  </main>
}
