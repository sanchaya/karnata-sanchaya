import { useEffect, useId, useRef, useState } from 'react'
import BerundaArt from './BerundaArt'

const API = import.meta.env.VITE_COMMUNITY_API_URL || ''

const copy = {
  kn: {
    name: 'ಭೇರುಂಡ',
    open: 'ಭೇರುಂಡನನ್ನು ಕೇಳಿ',
    title: 'ಭೇರುಂಡ · ಅಟ್ಲಸ್ ಮಾರ್ಗದರ್ಶಿ',
    close: 'ಮುಚ್ಚಿ',
    greeting: 'ನಮಸ್ಕಾರ! ನಾನು ಭೇರುಂಡ. ಕರ್ನಾಟಕದ ರಾಜರು, ಶಾಸನಗಳು, ಸ್ಥಳಗಳು ಮತ್ತು ಆಕರಗಳ ಬಗ್ಗೆ ಅಟ್ಲಸ್ ದಾಖಲೆಗಳಿಂದ ಉತ್ತರಿಸುತ್ತೇನೆ.',
    note: 'ಉತ್ತರಗಳು ಅಟ್ಲಸ್ ದಾಖಲೆಗಳಿಂದ ಮಾತ್ರ. ಹಲವು ದಾಖಲೆಗಳು ಇನ್ನೂ ಪರಿಶೀಲನೆ ಬಾಕಿ.',
    label: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ',
    placeholder: 'ಉದಾ: ತಾಳಗುಂದ ಶಾಸನ ಯಾವುದರ ಬಗ್ಗೆ?',
    send: 'ಕೇಳಿ',
    thinking: 'ಹುಡುಕುತ್ತಿದ್ದೇನೆ…',
    sources: 'ಆಧಾರ ದಾಖಲೆಗಳು',
    needsReview: 'ಪರಿಶೀಲನೆ ಬಾಕಿ',
    suggestions: ['ಮಯೂರಶರ್ಮ ಯಾರು?', 'ತಾಳಗುಂದ ಶಾಸನದ ಬಗ್ಗೆ ಹೇಳಿ', 'ಹಂಪಿಯ ಬಗ್ಗೆ ಯಾವ ದಾಖಲೆಗಳಿವೆ?'],
    errors: {
      disabled: 'ಭೇರುಂಡ ಈಗ ವಿಶ್ರಾಂತಿಯಲ್ಲಿದ್ದಾನೆ.',
      daily: 'ಇಂದು ಭೇರುಂಡ ಬಹಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿದ್ದಾನೆ. ನಾಳೆ ಮತ್ತೆ ಬನ್ನಿ.',
      visitor: 'ದಯವಿಟ್ಟು ಕೆಲವು ನಿಮಿಷ ಕಾಯಿರಿ, ನಂತರ ಮತ್ತೆ ಕೇಳಿ.',
      'no-dataset': 'ಅಟ್ಲಸ್ ದತ್ತಾಂಶ ಇನ್ನೂ ಲಭ್ಯವಿಲ್ಲ.',
      model: 'ಈಗ ಉತ್ತರಿಸಲಾಗಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.',
      network: 'ಸಂಪರ್ಕ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ಪರಿಶೀಲಿಸಿ.',
    },
  },
  en: {
    name: 'Berunda',
    open: 'Ask Berunda',
    title: 'Berunda · Atlas guide',
    close: 'Close',
    greeting: 'Namaskara! I am Berunda. I answer questions about Karnataka’s rulers, inscriptions, places and sources from the atlas records.',
    note: 'Answers come only from atlas records. Many records are still awaiting review.',
    label: 'Your question',
    placeholder: 'e.g. What is the Talagunda inscription about?',
    send: 'Ask',
    thinking: 'Searching…',
    sources: 'Records used',
    needsReview: 'Awaiting review',
    suggestions: ['Who was Mayurasharma?', 'Tell me about the Talagunda inscription', 'What records exist about Hampi?'],
    errors: {
      disabled: 'Berunda is resting right now.',
      daily: 'Berunda has answered many questions today. Please come back tomorrow.',
      visitor: 'Please wait a few minutes before asking more.',
      'no-dataset': 'The atlas dataset is not available yet.',
      model: 'I could not answer just now. Please try again shortly.',
      network: 'Could not connect. Please check your internet.',
    },
  },
}

// Where each kind of record lives in the portal. Unlisted collections open the atlas.
const PAGE_FOR = {
  people: '#people', martyrCandidates: '#freedom', inscriptions: '#epigraphy', epigraphiaArchiveTexts: '#epigraphy', inscriptionEditions: '#epigraphy',
  works: '#literature', coinRecords: '#coins', scriptEvolution: '#scripts', heritageInventoryLeads: '#district-inventory',
  heritageAudits: '#district-audit', inscriptionAudits: '#inscription-audit', districtHistoryResearch: '#district-history',
  politicalRelations: '#relations', externalPolities: '#relations', sources: '#research', periodicals: '#research', collaborations: '#research',
}
const REVIEWED = new Set(['reviewed', 'verified', 'published'])

const nameOf = (name, locale) => name?.[locale] || name?.kn || name?.en || ''

export default function Berunda({ locale = 'kn' }) {
  const t = copy[locale] || copy.kn
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const launcher = useRef(null)
  const input = useRef(null)
  const log = useRef(null)
  const titleId = useId()

  useEffect(() => {
    let active = true
    fetch(`${API}/api/berunda/status`).then(response => (response.ok ? response.json() : null)).then(body => { if (active) setEnabled(Boolean(body?.enabled)) }).catch(() => {})
    return () => { active = false }
  }, [])

  useEffect(() => { if (open) input.current?.focus() }, [open])
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight }, [messages, busy])

  const close = () => { setOpen(false); launcher.current?.focus() }

  const ask = async text => {
    const value = text.trim()
    if (!value || busy) return
    const history = messages.filter(message => !message.error).map(message => ({ role: message.role, content: message.content }))
    setMessages(list => [...list, { role: 'user', content: value }])
    setQuestion('')
    setBusy(true)
    try {
      const response = await fetch(`${API}/api/berunda/ask`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: value, locale, history }) })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw Object.assign(new Error(body.error || 'failed'), { code: body.code })
      setMessages(list => [...list, { role: 'assistant', content: body.answer, sources: body.sources || [] }])
    } catch (error) {
      const code = error.code || (error instanceof TypeError ? 'network' : 'model')
      setMessages(list => [...list, { role: 'assistant', content: t.errors[code] || t.errors.model, error: true }])
    } finally {
      setBusy(false)
      input.current?.focus()
    }
  }

  if (!enabled) return null

  return (
    <>
      <button ref={launcher} type="button" className="berunda-launcher" aria-haspopup="dialog" aria-expanded={open} onClick={() => (open ? close() : setOpen(true))}>
        <BerundaArt size={30} />
        <span>{t.name}</span>
        <span className="berunda-sr">{t.open}</span>
      </button>
      {open && (
        <section className="berunda-panel" role="dialog" aria-labelledby={titleId} onKeyDown={event => { if (event.key === 'Escape') close() }}>
          <header>
            <h2 id={titleId}><BerundaArt size={28} />{t.title}</h2>
            <button type="button" className="berunda-close" onClick={close} aria-label={t.close}>×</button>
          </header>
          <div className="berunda-log" ref={log} role="log" aria-live="polite" aria-busy={busy}>
            {!messages.length && <BerundaArt className="berunda-hero" size={112} paper />}
            <p className="berunda-bubble assistant">{t.greeting}</p>
            {!messages.length && (
              <div className="berunda-suggestions">
                {t.suggestions.map(suggestion => <button key={suggestion} type="button" onClick={() => ask(suggestion)}>{suggestion}</button>)}
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`berunda-message ${message.role}`}>
                <p className={`berunda-bubble ${message.role}${message.error ? ' error' : ''}`}>{message.content}</p>
                {message.sources?.length > 0 && (
                  <div className="berunda-sources">
                    <strong>{t.sources}</strong>
                    <ul>
                      {message.sources.map(source => (
                        <li key={source.id}>
                          <a href={PAGE_FOR[source.collection] || '#atlas'}>{nameOf(source.name, locale) || source.id}</a>
                          {source.date && <small> · {source.date}</small>}
                          {!REVIEWED.has(source.reviewStatus) && <mark>{t.needsReview}</mark>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            {busy && <p className="berunda-bubble assistant berunda-thinking">{t.thinking}</p>}
          </div>
          <form onSubmit={event => { event.preventDefault(); ask(question) }}>
            <label htmlFor={`${titleId}-q`} className="berunda-sr">{t.label}</label>
            <input id={`${titleId}-q`} ref={input} value={question} onChange={event => setQuestion(event.target.value)} maxLength={500} placeholder={t.placeholder} autoComplete="off" />
            <button type="submit" disabled={busy || !question.trim()}>{t.send}</button>
          </form>
          <p className="berunda-note">{t.note}</p>
        </section>
      )}
    </>
  )
}
