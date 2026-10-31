import { useState, useEffect, useRef, useCallback } from 'react'
import ProvenanceBadge from './ProvenanceBadge'

const OVERVIEW_FIRST = 2
const LAST_SECTION_BY_ID = new Map()
const STATUS_LABEL = {
  published: { en: 'Published · reviewed', kn: 'ಪ್ರಕಟಿಸಿದೆ · ಪರಿಶೀಲಿಸಿದೆ' },
  reviewed: { en: 'Reviewed', kn: 'ಪರಿಶೀಲಿಸಿದೆ' },
  verified: { en: 'Verified', kn: 'ಪರಿಶೀಲಿಸಿದೆ' },
  'needs-review': { en: 'Needs review', kn: 'ಪರಿಶೀಲನೆ ಬಾಕಿ' },
  'research-pending': { en: 'Research pending', kn: 'ಸಂಶೋಧನೆ ಬಾಕಿ' },
  identified: { en: 'Identified', kn: 'ಗುರುತಿಸಿದೆ' }
}

export default function RecordInspector({ record, locale, t, onClose, onSuggestCorrection, onChooseRecord, open = true }){
  const containerRef = useRef(null)
  const closeRef = useRef(null)
  const [section, setSection] = useState(() => LAST_SECTION_BY_ID.get(record.id) || 'overview')
  const [expanded, setExpanded] = useState(new Set())
  const [full, setFull] = useState(false)

  useEffect(() => { LAST_SECTION_BY_ID.set(record.id, section) }, [record.id, section])

  // Move keyboard focus into the inspector when a record opens
  useEffect(() => {
    const el = containerRef.current
    if (el) { el.focus({ preventScroll: false }) }
    closeRef.current?.focus({ preventScroll: false })
  }, [record.id])

  const status = record.review?.status || 'needs-review'
  const statusText = (STATUS_LABEL[status] && STATUS_LABEL[status][locale]) || status

  const expandAllGroups = () => {
    // Full record = every section stacked, every connection group open; toggles back
    const next = !full
    setFull(next)
    setExpanded(next && record.connections ? new Set(record.connections.map((_,i)=>i)) : new Set())
    containerRef.current?.querySelector('.record-inspector-body')?.scrollTo?.({ top: 0 })
  }

  const toggleSection = key => { setSection(key) }
  const toggleGroup = index => {
    const next = new Set(expanded)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    setExpanded(next)
  }
  const groupExpanded = index => expanded.has(index)

  const sectionAria = {
    overview: t.recordOverview || 'Overview',
    connections: t.recordConnections || 'Connections',
    evidence: t.recordEvidence || 'Evidence'
  }

  const formatCitation = item => {
    const sourceTitle = item.title || ''
    const locator = item.locator ? ` · ${item.locator}` : ''
    return <span key={item.url || item.title}>{sourceTitle}{locator}</span>
  }

  return (
    <section
      ref={containerRef}
      className="record-inspector"
      data-open={open ? 'true' : 'false'}
      tabIndex={-1}
      role="region"
      aria-label={record.name || t.recordOverview || 'Record'}
      aria-modal="true"
    >
      <div className="record-inspector-bar">
      <button
        ref={closeRef}
        className="record-inspector-close"
        type="button"
        onClick={onClose}
        aria-label={t.close || 'Close'}
        title={t.close || 'Close'}
      >
        <span aria-hidden="true">✕</span>{t.close || 'Close'}
      </button>
      </div>

      <header className="record-inspector-head">
        <div className="record-inspector-eyebrow">
          {record.typeLabel}<span aria-hidden="true"> · </span>{record.dateLabel}
        </div>
        <div className="record-inspector-review">
          <span className="status-dot" aria-hidden="true" style={{background: status === 'published' || status === 'verified' || status === 'reviewed' ? '#24572c' : status === 'identified' ? '#3f37c9' : '#a46b3f'}}></span>
          <b>{statusText}</b>
        </div>
        <h1>{record.name}</h1>
        {record.nameAlt && <p className="record-inspector-alt" lang={locale === 'kn' ? 'en' : 'kn'}>{record.nameAlt}</p>}
        {record.summary && <p className="record-inspector-summary">{record.summary}</p>}
      </header>

      <nav className="record-inspector-tabs" role="tablist" aria-label={t.recordSections || 'Record sections'}>
        {['overview', 'connections', 'evidence'].map(key => (
          <button
            key={key}
            role="tab"
            aria-selected={section === key}
            aria-controls={`record-inspector-${key}`}
            id={`record-inspector-tab-${key}`}
            className={section === key ? 'active' : ''}
            onClick={() => toggleSection(key)}
            type="button"
          >
            {sectionAria[key]}
          </button>
        ))}
      </nav>

      <div className="record-inspector-body">
        {(full || section === 'overview') && (
          <section className="record-inspector-section" id="record-inspector-overview" data-active="true" aria-labelledby="record-inspector-tab-overview">
            <h2 id="record-inspector-heading-overview">{t.recordOverview || 'Overview'}</h2>
            {record.description && <p>{record.description}</p>}
            {record.descriptionAlt && <p className="english-support">{record.descriptionAlt}</p>}
            {record.meta && record.meta.length > 0 && (
              <dl className="record-inspector-meta">
                {record.meta.map((item, index) => (
                  <div key={item.label || index}>
                    <dt>{item.label}</dt>
                    <dd className="value-wrap"><strong>{item.value}</strong>{item.valueAlt && <small>{item.valueAlt}</small>}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        )}
        {(full || section === 'connections') && (
          <section className="record-inspector-section" id="record-inspector-connections" data-active="true" aria-labelledby="record-inspector-tab-connections">
            <h2 id="record-inspector-heading-connections">{t.recordConnections || 'Connections'}</h2>
            {record.connections && record.connections.length > 0 ? (
              record.connections.map((group, index) => {
                const visible = groupExpanded(index) ? group.items : group.items.slice(0, OVERVIEW_FIRST)
                const hasMore = group.items.length > OVERVIEW_FIRST
                return (
                  <div key={group.heading || index} className="record-inspector-connection">
                    <h3>
                      {group.heading}
                      {group.count != null && <b> · {group.count}</b>}
                    </h3>
                    <div className="connection-list">
                      {visible.map(item => (
                        <button
                          key={item.id || item.name}
                          type="button"
                          className="connection-item"
                          onClick={() => onChooseRecord && onChooseRecord(item.kind, item.record)}
                          aria-label={item.name + (item.sub ? ' · ' + item.sub : '')}
                        >
                          <div>
                            <strong>{item.name}</strong>{item.sub && <span>{item.sub}</span>}
                          </div>
                          {item.kind && <small aria-hidden="true">{item.kind}</small>}
                        </button>
                      ))}
                      {hasMore && !groupExpanded(index) && (
                        <button type="button" className="record-inspector-show-all" onClick={() => toggleGroup(index)} aria-expanded="false">
                          {t.showAll || 'Show all'} <span aria-hidden="true">▾</span>
                        </button>
                      )}
                      {hasMore && groupExpanded(index) && (
                        <button type="button" className="record-inspector-show-all" onClick={() => toggleGroup(index)} aria-expanded="true">
                          {t.showLess || 'Show less'} <span aria-hidden="true">▴</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="muted">{t.noConnections || 'No linked records yet.'}</p>
            )}
          </section>
        )}
        {(full || section === 'evidence') && (
          <section className="record-inspector-section" id="record-inspector-evidence" data-active="true" aria-labelledby="record-inspector-tab-evidence">
            <h2 id="record-inspector-heading-evidence">{t.recordEvidence || 'Evidence'}</h2>
            <ul className="record-inspector-evidence">
              {record.evidence?.reviewStatus && (
                <li>
                  <span className="label">{t.reviewStatus || 'Review status'}</span>
                  <span className="value">{record.evidence.reviewStatus}</span>
                </li>
              )}
              {record.evidence?.authorityBadge && (
                <li>
                  <span className="label">{t.authority || 'Authority'}</span>
                  <span className="value"><ProvenanceBadge tier="authority" locale={locale} short /> {t.authorityCited || 'Authority cited'}</span>
                </li>
              )}
              {record.evidence?.uncertainty && (
                <li>
                  <span className="label">{t.uncertainty || 'Uncertainty'}</span>
                  <span className="value">{record.evidence.uncertainty}</span>
                </li>
              )}
              {record.evidence?.precision && (
                <li>
                  <span className="label">{t.geographicPrecision || 'Precision'}</span>
                  <span className="value">{record.evidence.precision}</span>
                </li>
              )}
              {record.evidence?.stableId && (
                <li>
                  <span className="label">{t.stableId || 'Stable ID'}</span>
                  <span className="value">{record.evidence.stableId}</span>
                </li>
              )}
              {record.evidence?.sourceLinks && record.evidence.sourceLinks.length > 0 && (
                <li>
                  <span className="label">{t.sourceLinks || 'Source links'}</span>
                  <div className="citations">
                    {record.evidence.sourceLinks.map((link, index) => (
                      <p key={link.url || index}><a href={link.url} target="_blank" rel="noreferrer"><strong>{link.label}</strong></a></p>
                    ))}
                  </div>
                </li>
              )}
              {record.evidence?.citations && record.evidence.citations.length > 0 && (
                <li>
                  <span className="label">{t.sources || 'Citations'}</span>
                  <div className="citations">
                    {record.evidence.citations.map((citation, index) => (
                      <p key={citation.url || citation.title || index}>
                        <a href={citation.url} target={citation.url ? '_blank' : undefined} rel={citation.url ? 'noreferrer' : undefined}><strong>{citation.title}</strong></a>
                        {citation.locator && <span>{citation.locator}</span>}
                      </p>
                    ))}
                  </div>
                </li>
              )}
              {record.evidence?.notes && (
                <li>
                  <span className="label">{t.researchNotes || 'Research notes'}</span>
                  <span className="value">{record.evidence.notes}</span>
                </li>
              )}
              {record.evidence?.outstandingEvidence && (
                <li>
                  <span className="label">{t.outstandingEvidence || 'Outstanding evidence'}</span>
                  <span className="value">{record.evidence.outstandingEvidence}</span>
                </li>
              )}
              {record.evidence?.noSources && (
                <li><span className="value muted">{t.noSources || 'No citations have been attached yet.'}</span></li>
              )}
            </ul>
          </section>
        )}
      </div>

      <footer className="record-inspector-foot">
        <div className="record-inspector-actions">
          {record.actions?.viewFull !== false && (
            <button type="button" className="record-inspector-view-full" onClick={expandAllGroups} aria-pressed={full}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19 20 18.5L14.5 13H20v-2h-6.5L20 5.5 19.5 5L12 10.5z"/></svg>
              {full ? (t.showLess || 'Show less') : (t.viewFullRecord || 'View full record')}
            </button>
          )}
          {record.actions?.suggestCorrection !== false && (
            <button type="button" className="record-inspector-suggest" onClick={onSuggestCorrection}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              {t.suggestCorrection || 'Suggest correction'}
            </button>
          )}
        </div>
      </footer>
    </section>
  )
}
