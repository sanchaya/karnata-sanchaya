import { useId, useMemo, useState } from 'react'

const fold = value => (value || '').toLowerCase().normalize('NFC')

// A visible search box with a keyboard-operable suggestion list (combobox pattern). `items` are { id, label, hint, search }.
export default function SearchBox({ label, placeholder, items, onPick, emptyText, maxResults = 8 }) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const results = useMemo(() => {
    const needle = fold(query).trim()
    if (!needle) return []
    return items.filter(item => fold(item.search || item.label).includes(needle)).slice(0, maxResults)
  }, [items, query, maxResults])
  const choose = item => { setQuery(item.label); setOpen(false); onPick(item) }
  const onKey = event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActive(index => Math.min(index + 1, results.length - 1)) }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(index => Math.max(index - 1, 0)) }
    else if (event.key === 'Enter' && open && results[active]) { event.preventDefault(); choose(results[active]) }
    else if (event.key === 'Escape') setOpen(false)
  }
  const listId = `${id}-list`
  return <div className="search-box">
    <label htmlFor={`${id}-input`}>{label}</label>
    <div className="search-box-field">
      <input id={`${id}-input`} type="text" role="combobox" aria-expanded={open && query.trim() !== ''} aria-controls={listId} aria-autocomplete="list"
        aria-activedescendant={open && results[active] ? `${id}-opt-${active}` : undefined} autoComplete="off" value={query} placeholder={placeholder}
        onChange={event => { setQuery(event.target.value); setActive(0); setOpen(true) }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 120)} onKeyDown={onKey} />
      {query && <button type="button" className="search-box-clear" aria-label="×" onClick={() => { setQuery(''); setOpen(false) }}>×</button>}
    </div>
    <ul id={listId} role="listbox" hidden={!(open && query.trim() !== '')}>
      {results.map((item, index) => <li key={item.id} id={`${id}-opt-${index}`} role="option" aria-selected={index === active} className={index === active ? 'active' : ''} onMouseDown={event => { event.preventDefault(); choose(item) }}>
        <strong>{item.label}</strong>{item.hint && <small>{item.hint}</small>}</li>)}
      {!results.length && query.trim() !== '' && <li role="presentation" className="empty">{emptyText}</li>}
    </ul>
  </div>
}
