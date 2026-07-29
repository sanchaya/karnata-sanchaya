import { useEffect, useRef, useState } from 'react'

const copy = {
  kn: {
    launch: 'ಮಾರ್ಗದರ್ಶಿ',
    dialogLabel: 'ಪುಟ ಮಾರ್ಗದರ್ಶಿ',
    stepOf: 'ಹಂತ',
    previous: 'ಹಿಂದಿನದು',
    next: 'ಮುಂದಿನದು',
    finish: 'ಮುಗಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    skip: 'ಈಗ ಬೇಡ',
  },
  en: {
    launch: 'Tour',
    dialogLabel: 'Page tour',
    stepOf: 'Step',
    previous: 'Back',
    next: 'Next',
    finish: 'Finish',
    close: 'Close',
    skip: 'Skip for now',
  },
}

const text = (value, locale) => typeof value === 'string' ? value : value?.[locale] || value?.kn || value?.en || ''

export default function GuidedTour({ tourKey, locale = 'kn', steps = [] }) {
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [highlight, setHighlight] = useState(null)
  const firstActionRef = useRef(null)
  const t = copy[locale] || copy.kn
  const storageKey = `karnataka-atlas-tour:${tourKey}`
  const current = steps[stepIndex]

  const updateHighlight = () => {
    if (!current?.target) {
      setHighlight(null)
      return
    }
    const target = document.querySelector(current.target)
    if (!target) {
      setHighlight(null)
      return
    }
    const rect = target.getBoundingClientRect()
    setHighlight({ top: Math.max(8, rect.top - 6), left: Math.max(8, rect.left - 6), width: rect.width + 12, height: rect.height + 12 })
  }

  useEffect(() => {
    if (!steps.length) return
    try {
      if (!localStorage.getItem(storageKey)) setOpen(true)
    } catch {
      setOpen(true)
    }
  }, [storageKey, steps.length])

  useEffect(() => {
    if (!open) return undefined
    setStepIndex(index => Math.min(index, Math.max(0, steps.length - 1)))
    window.setTimeout(() => {
      if (current?.target) document.querySelector(current.target)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      updateHighlight()
      firstActionRef.current?.focus()
    }, 80)
    const refresh = () => updateHighlight()
    window.addEventListener('resize', refresh)
    window.addEventListener('scroll', refresh, true)
    const observer = new MutationObserver(refresh)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      window.removeEventListener('resize', refresh)
      window.removeEventListener('scroll', refresh, true)
      observer.disconnect()
    }
  }, [open, stepIndex, current?.target, steps.length])

  if (!steps.length) return null

  const close = (remember = true) => {
    if (remember) {
      try { localStorage.setItem(storageKey, 'completed') } catch { /* private browsing */ }
    }
    setOpen(false)
    setHighlight(null)
  }
  const next = () => stepIndex >= steps.length - 1 ? close() : setStepIndex(index => index + 1)
  const onKeyDown = event => {
    if (event.key === 'Escape') { event.preventDefault(); close(false) }
    if (event.key === 'ArrowRight' || event.key === 'Enter') { event.preventDefault(); next() }
    if (event.key === 'ArrowLeft' && stepIndex > 0) { event.preventDefault(); setStepIndex(index => index - 1) }
  }

  return <>
    <button className="guided-tour-launcher" type="button" onClick={() => { setStepIndex(0); setOpen(true) }} aria-label={t.dialogLabel}>
      <span aria-hidden="true">?</span>{t.launch}
    </button>
    {open&&<div className="guided-tour-layer" onKeyDown={onKeyDown}>
      <div className="guided-tour-backdrop" aria-hidden="true"></div>
      {highlight&&<div className="guided-tour-highlight" style={highlight} aria-hidden="true"></div>}
      <section className="guided-tour-popover" role="dialog" aria-modal="true" aria-labelledby="guided-tour-title" aria-describedby="guided-tour-description">
        <div className="guided-tour-head"><span>{t.stepOf} {stepIndex + 1} / {steps.length}</span><button type="button" onClick={() => close(false)} aria-label={t.close}>×</button></div>
        <h2 id="guided-tour-title">{text(current?.title, locale)}</h2>
        <p id="guided-tour-description">{text(current?.body, locale)}</p>
        <div className="guided-tour-actions">
          <button type="button" className="guided-tour-skip" onClick={() => close()}>{t.skip}</button>
          <div><button type="button" disabled={stepIndex === 0} onClick={() => setStepIndex(index => index - 1)}>{t.previous}</button><button ref={firstActionRef} type="button" className="guided-tour-primary" onClick={next}>{stepIndex >= steps.length - 1 ? t.finish : t.next}</button></div>
        </div>
      </section>
    </div>}
  </>
}
