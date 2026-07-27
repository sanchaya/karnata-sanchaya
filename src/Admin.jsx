import { useMemo, useRef, useState } from 'react'
import { atlasData, collectionLabels } from './data/atlas'
import { hasValidationErrors, validateAtlas } from './data/validate'

const STORAGE_KEY = 'karnataka-atlas-research-draft-v0.9'
const collections = Object.keys(collectionLabels)
const collectionPrefix = { polities:'polity', externalPolities:'external-polity', events:'event', culturalHeritage:'culture', reigns:'reign', territorialExtents:'extent', deepChronologies:'chronology', heritageAudits:'audit', inscriptionAudits:'inscription-audit', people:'person', places:'place', inscriptions:'inscription', works:'work', sources:'src', relationships:'rel', collaborations:'collaboration' }
const clone = value => JSON.parse(JSON.stringify(value))
const today = () => new Date().toISOString().slice(0,10)

function mergeBundledHeritage(savedAudits=[]) {
  const savedById=new Map(savedAudits.map(audit=>[audit.id,audit]))
  return atlasData.heritageAudits.map(bundled=>{
    const saved=savedById.get(bundled.id)
    if(!saved) return clone(bundled)
    const bundledSites=new Map(bundled.prioritySites.map(site=>[site.id,site]))
    const mergedSites=(saved.prioritySites||[]).map(site=>{
      const current=bundledSites.get(site.id)
      if(!current) return site
      bundledSites.delete(site.id)
      const savedVerification=site.verification
      const bundledVerification=current.verification
      const savedIsNewer=savedVerification?.lastVerified&&savedVerification.lastVerified>bundledVerification?.lastVerified
      const verification=savedIsNewer?savedVerification:bundledVerification
      return {...current,...site,verification,status:verification.verificationStatus}
    })
    return {...bundled,...saved,prioritySites:[...mergedSites,...bundledSites.values()]}
  })
}

function mergeBundledWorks(savedWorks=[]) {
  const savedById=new Map(savedWorks.map(work=>[work.id,work]))
  const bundledIds=new Set(atlasData.works.map(work=>work.id))
  const merged=atlasData.works.map(bundled=>{const saved=savedById.get(bundled.id);return saved?{...bundled,...saved,creator:saved.creator||bundled.creator,creatorRole:saved.creatorRole||bundled.creatorRole}:clone(bundled)})
  return [...merged,...savedWorks.filter(work=>!bundledIds.has(work.id))]
}

function mergeBundledRecords(savedRecords=[],bundledRecords=[]) {
  const savedById=new Map(savedRecords.map(record=>[record.id,record]))
  const bundledIds=new Set(bundledRecords.map(record=>record.id))
  return [...bundledRecords.map(bundled=>savedById.has(bundled.id)?{...clone(bundled),...savedById.get(bundled.id)}:clone(bundled)),...savedRecords.filter(record=>!bundledIds.has(record.id))]
}

function loadDraft() {
  try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)); return saved?{...clone(atlasData),...saved,meta:{...saved.meta,...atlasData.meta},heritageAudits:mergeBundledHeritage(saved.heritageAudits),inscriptionAudits:mergeBundledRecords(saved.inscriptionAudits,atlasData.inscriptionAudits),works:mergeBundledWorks(saved.works),inscriptions:mergeBundledRecords(saved.inscriptions,atlasData.inscriptions),people:mergeBundledRecords(saved.people,atlasData.people),places:mergeBundledRecords(saved.places,atlasData.places),sources:mergeBundledRecords(saved.sources,atlasData.sources),collaborations:mergeBundledRecords(saved.collaborations,atlasData.collaborations)}:clone(atlasData) }
  catch { return clone(atlasData) }
}

const blankRecord = collection => collection === 'relationships'
  ? { id:'rel-', fromId:'', type:'associated-with', toId:'', date:{from:null,to:null,era:'CE',precision:'unknown'}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'territorialExtents'
    ? { id:'extent-', name:{en:'',kn:''}, classification:'core-administered', controlLevel:'direct', duration:'sustained', confidence:'low', snapshotKind:'prototype', snapshotYear:null, reignId:null, date:{from:null,to:null,era:'CE',precision:'unknown'}, polityIds:[], relatedEventIds:[], geometry:{type:'Polygon',coordinates:[],precision:'schematic'}, description:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'reigns'
    ? { id:'reign-', name:{en:'',kn:''}, periodType:'reign', polityId:'', rulerIds:[], capitalIds:[], date:{from:null,to:null,era:'CE',precision:'range'}, description:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'culturalHeritage'
    ? { id:'culture-', name:{en:'',kn:''}, category:'architecture', date:{from:null,to:null,era:'CE',precision:'unknown'}, polityIds:[], placeIds:[], peopleIds:[], relatedWorkIds:[], traditionTags:[], continuity:'unknown', description:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'deepChronologies'
    ? { id:'chronology-', name:{en:'',kn:''}, date:{from:null,to:null,era:'BCE',precision:'range'}, chronologyKind:'historiographic-periodization', geographicScope:{en:'',kn:''}, evidenceBasis:'secondary-synthesis', confidence:'provisional', description:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'heritageAudits'
    ? { id:'audit-', name:{en:'',kn:''}, district:{en:'',kn:''}, region:'', auditStatus:'seeded', categoryCoverage:{temple:'unassessed','coastal-temple':'unassessed',basadi:'unassessed',dargah:'unassessed',church:'unassessed',monastery:'unassessed',fort:'unassessed','palace-civic-architecture':'unassessed','colonial-architecture':'unassessed','archaeological-landscape':'unassessed','modern-heritage':'unassessed'}, prioritySites:[], methodologyNote:{en:'',kn:''}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'sources'
    ? { id:'src-', type:'book', title:{en:'',kn:''}, authors:[], publisher:'', year:null, doi:'', isbn:'', url:'', review:{status:'draft',reviewer:null,updatedAt:today()} }
  : collection === 'collaborations'
    ? { id:'collaboration-', name:{en:'',kn:''}, entityKind:'organization', stage:'upcoming', collaborationType:'research', url:'', contribution:{en:'',kn:''}, contactPath:'#community', review:{status:'draft',reviewer:null,updatedAt:today()} }
    : { id:`${collectionPrefix[collection]}-`, name:{en:'',kn:''}, date:{from:null,to:null,era:'CE',precision:'unknown'}, citations:[], review:{status:'draft',reviewer:null,updatedAt:today()} }

function recordTitle(record, collection = '', locale = 'en') {
  if (record.name?.en || record.name?.kn || record.title?.en || record.title?.kn) return record.name?.[locale] || record.title?.[locale] || record.name?.en || record.title?.en
  if (record.fromId != null || record.toId != null) return `${record.fromId || 'Relationship'} → ${record.toId || '…'}`
  return `Untitled ${collectionPrefix[collection] || 'record'}`
}

const adminText = {
  kn:{workspace:'ಸ್ಥಳೀಯ ಸಂಶೋಧನಾ ಕಾರ್ಯಕ್ಷೇತ್ರ · Atlas v0.2',title:'ದತ್ತಾಂಶ ಸಂಪಾದಕ',subtitle:'ಪರಿಶೀಲನೆ ಮತ್ತು ಹಸ್ತಾಂತರಕ್ಕಾಗಿ ಬ್ರೌಸರ್‌ನಲ್ಲೇ ಉಳಿಯುವ ಕರಡುಗಳು',back:'← ಸಾರ್ವಜನಿಕ ಭೂಪಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',warning:'ತಿದ್ದುಪಡಿಗಳು ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಉಳಿಯುತ್ತವೆ. ಪ್ರಕಟಿಸಲು JSON ರಫ್ತು ಮಾಡಿ, ಆವೃತ್ತಿ ನಿಯಂತ್ರಣದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ಇದು GitHubಗೆ ಬರೆಯುವುದಿಲ್ಲ ಅಥವಾ ಬಹು-ಬಳಕೆದಾರ ಸಮನ್ವಯ ನೀಡುವುದಿಲ್ಲ.',resourcesManagement:'ಆಕರಗಳು ಮತ್ತು ಸಹಯೋಗ ನಿರ್ವಹಣೆ',errors:'ದೋಷಗಳು',warnings:'ಎಚ್ಚರಿಕೆಗಳು',import:'JSON ಆಮದು',export:'JSON ರಫ್ತು',reset:'ಸ್ಥಳೀಯ ಕರಡು ಮರುಹೊಂದಿಸಿ',search:'ಎಲ್ಲ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಹುಡುಕಿ',searchPlaceholder:'ಹೆಸರು, ID, ಸ್ಥಿತಿ…',records:'ದಾಖಲೆಗಳು',new:'+ ಹೊಸ ದಾಖಲೆ',edit:'ದಾಖಲೆ ತಿದ್ದುಪಡಿ',create:'ದಾಖಲೆ ರಚಿಸಿ',delete:'ಅಳಿಸಿ',save:'ಸ್ಥಳೀಯ ಕರಡು ಉಳಿಸಿ',stableId:'ಸ್ಥಿರ ID / Stable ID',englishName:'ಇಂಗ್ಲಿಷ್ ಹೆಸರು / English name',kannadaName:'ಕನ್ನಡ ಹೆಸರು / Kannada name',start:'ಆರಂಭ ವರ್ಷ / Start year',end:'ಅಂತ್ಯ ವರ್ಷ / End year',datePrecision:'ದಿನಾಂಕ ನಿಖರತೆ / Date precision',reviewStatus:'ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ / Review status',reviewer:'ಪರಿಶೀಲಕರು / Reviewer',json:'ಸಂಪೂರ್ಣ ದಾಖಲೆ JSON',validation:'ಈ ದಾಖಲೆಯ ಪರಿಶೀಲನೆ',collections:{polities:'ರಾಜ್ಯಗಳು',people:'ವ್ಯಕ್ತಿಗಳು',places:'ಸ್ಥಳಗಳು',inscriptions:'ಶಾಸನಗಳು',works:'ಸಾಹಿತ್ಯ ಕೃತಿಗಳು',sources:'ಆಕರಗಳು',relationships:'ಸಂಬಂಧಗಳು'}},
  en:{workspace:'Local research workspace · Atlas v0.2',title:'Dataset editor',subtitle:'Browser-only drafts for review, validation, and handoff',back:'← Return to public atlas',warning:'Edits are stored only in this browser. Export JSON and review it in version control to publish. This workspace does not write to GitHub or provide multi-user sync.',resourcesManagement:'Resources & collaborations management',errors:'errors',warnings:'warnings',import:'Import JSON',export:'Export JSON',reset:'Reset local draft',search:'Search all fields',searchPlaceholder:'Name, ID, status…',records:'records',new:'+ New record',edit:'Edit record',create:'Create record',delete:'Delete',save:'Save local draft',stableId:'Stable ID',englishName:'English name',kannadaName:'Kannada name',start:'Start year',end:'End year',datePrecision:'Date precision',reviewStatus:'Review status',reviewer:'Reviewer',json:'Complete record JSON',validation:'Validation for this record',collections:collectionLabels}
}
Object.assign(adminText.kn.collections,{externalPolities:'ಬಾಹ್ಯ ರಾಜ್ಯಗಳು',events:'ಐತಿಹಾಸಿಕ ಘಟನೆಗಳು',culturalHeritage:'ಸ್ಮಾರಕಗಳು, ಕಲೆ ಮತ್ತು ಸಂಸ್ಕೃತಿ',reigns:'ಆಳ್ವಿಕೆ ಮತ್ತು ರಾಜಕೀಯ ಅವಧಿಗಳು',territorialExtents:'ಭೂಪ್ರದೇಶ ಸಾಕ್ಷ್ಯ',deepChronologies:'ಪ್ರಾಚೀನ ಕಾಲಕ್ರಮಗಳು',heritageAudits:'ಜಿಲ್ಲಾ ಪರಂಪರೆ ಪರಿಶೀಲನೆಗಳು'})
adminText.kn.collections.inscriptionAudits='ಜಿಲ್ಲಾ ಶಾಸನ ಪರಿಶೀಲನೆಗಳು'
adminText.kn.collections.collaborations='ಸಹಯೋಗಗಳು'
adminText.kn.workspace='ಸ್ಥಳೀಯ ಸಂಶೋಧನಾ ಕಾರ್ಯಕ್ಷೇತ್ರ · Atlas v0.18'
adminText.en.workspace='Local research workspace · Atlas v0.18'

export default function Admin({ onClose, locale='kn', onLocaleChange }) {
  const t=adminText[locale]
  const [data,setData] = useState(loadDraft)
  const [collection,setCollection] = useState('polities')
  const [query,setQuery] = useState('')
  const [selectedId,setSelectedId] = useState(data.polities[0]?.id || '')
  const [draft,setDraft] = useState(() => clone(data.polities[0] || blankRecord('polities')))
  const [jsonText,setJsonText] = useState(() => JSON.stringify(data.polities[0] || blankRecord('polities'),null,2))
  const [notice,setNotice] = useState('')
  const fileRef = useRef()
  const issues = useMemo(()=>validateAtlas(data),[data])
  const filtered = useMemo(() => (data[collection] || []).filter(record => JSON.stringify(record).toLowerCase().includes(query.toLowerCase())),[data,collection,query])
  const recordIssues = useMemo(()=>{
    const candidate=clone(data); const list=candidate[collection] || []; const index=list.findIndex(record=>record.id===selectedId)
    if(index>=0) list[index]=draft; else list.push(draft)
    return validateAtlas(candidate).filter(issue=>issue.id===(draft.id || 'row-1') || (!draft.id && issue.collection===collection))
  },[data,collection,selectedId,draft])
  const setEditor = record => { const next=clone(record); setDraft(next); setJsonText(JSON.stringify(next,null,2)) }

  const selectCollection = next => {
    setCollection(next)
    const first = data[next]?.[0]
    setSelectedId(first?.id || '')
    setEditor(first || blankRecord(next))
  }
  const selectRecord = record => { setSelectedId(record.id); setEditor(record); setNotice('') }
  const update = (path,value) => setDraft(current => {
    const next = clone(current); let node = next
    path.slice(0,-1).forEach(key => { node[key] ||= {}; node=node[key] })
    node[path.at(-1)] = value
    setJsonText(JSON.stringify(next,null,2))
    return next
  })
  const save = () => {
    const next = clone(data); const index = next[collection].findIndex(record => record.id === selectedId)
    const saved = { ...draft, review:{...draft.review,updatedAt:today()} }
    if (index >= 0) next[collection][index] = saved; else next[collection].push(saved)
    setData(next); setSelectedId(saved.id); localStorage.setItem(STORAGE_KEY,JSON.stringify(next)); setNotice('Draft saved in this browser.')
  }
  const create = () => { setSelectedId(''); setEditor(blankRecord(collection)); setNotice('New unsaved record.') }
  const remove = () => {
    if (!selectedId || !window.confirm(`Delete ${selectedId} from this local draft?`)) return
    const next={...data,[collection]:data[collection].filter(record=>record.id!==selectedId)}
    setData(next); localStorage.setItem(STORAGE_KEY,JSON.stringify(next)); const first=next[collection][0]; setSelectedId(first?.id||''); setEditor(first||blankRecord(collection))
  }
  const reset = () => {
    if (!window.confirm('Discard all browser-only edits and restore the bundled dataset?')) return
    const next=clone(atlasData); setData(next); localStorage.removeItem(STORAGE_KEY); setCollection('polities'); const first=next.polities[0]; setSelectedId(first?.id||''); setEditor(first||blankRecord('polities')); setNotice('Bundled dataset restored.')
  }
  const exportData = () => {
    const output={...data,meta:{...data.meta,exportedAt:new Date().toISOString()}}
    const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)],{type:'application/json'})); const a=document.createElement('a'); a.href=url; a.download=`karnataka-atlas-${today()}.json`; a.click(); URL.revokeObjectURL(url)
  }
  const importData = event => {
    const file=event.target.files?.[0]; if (!file) return
    const reader=new FileReader(); reader.onload=()=>{ try { const next=JSON.parse(reader.result); const nextIssues=validateAtlas(next); if (hasValidationErrors(nextIssues) && !window.confirm(`This file has ${nextIssues.filter(i=>i.severity==='error').length} errors. Import into the local workspace anyway?`)) return; setData(next); localStorage.setItem(STORAGE_KEY,JSON.stringify(next)); setCollection('polities'); const first=next.polities?.[0]; setSelectedId(first?.id||''); setEditor(first||blankRecord('polities')); setNotice(`Imported ${file.name}.`) } catch { setNotice('Import failed: the file is not valid JSON.') } }; reader.readAsText(file); event.target.value=''
  }

  return <div className="admin-shell" lang={locale}>
    <header className="admin-header"><div className="sanchaya-product-brand"><a className="sanchaya-mark" href="https://sanchaya.org" target="_blank" rel="noreferrer" aria-label="Sanchaya"><img src={`${import.meta.env.BASE_URL}sanchaya-logo.png`} alt="Sanchaya"/></a><div><p className="eyebrow">{t.workspace}</p><h1>{t.title}</h1><p className="admin-subtitle">{t.subtitle}</p></div></div><div className="admin-header-actions"><button className="secondary language-switch" onClick={onLocaleChange}>{locale==='kn'?'English':'ಕನ್ನಡ'}</button><button className="secondary" onClick={onClose}>{t.back}</button></div></header>
    <div className="admin-warning"><strong>{locale==='kn'?'ಸ್ಥಿರ-ಮೊದಲ ವಿನ್ಯಾಸ:':'Static-first:'}</strong> {t.warning}</div>
    <div className="admin-toolbar">
      <div className="health"><strong>{issues.filter(i=>i.severity==='error').length}</strong> {t.errors} <strong>{issues.filter(i=>i.severity==='warning').length}</strong> {t.warnings}</div>
      <div className="admin-resource-shortcuts"><span>{t.resourcesManagement}</span><button className={collection==='sources'?'active':''} onClick={()=>selectCollection('sources')}>{t.collections.sources} · {data.sources.length}</button><button className={collection==='collaborations'?'active':''} onClick={()=>selectCollection('collaborations')}>{t.collections.collaborations} · {data.collaborations.length}</button></div>
      <button onClick={()=>fileRef.current.click()}>{t.import}</button><input ref={fileRef} hidden type="file" accept="application/json,.json" onChange={importData}/><button onClick={exportData}>{t.export}</button><button className="danger-link" onClick={reset}>{t.reset}</button>
    </div>
    <main className="admin-main">
      <aside className="admin-nav">
        <label className="search">{t.search}<input value={query} onChange={event=>setQuery(event.target.value)} placeholder={t.searchPlaceholder}/></label>
        <nav>{collections.map(key=><button key={key} className={key===collection?'active':''} onClick={()=>selectCollection(key)}><span>{t.collections[key]}</span><b>{data[key]?.length || 0}</b></button>)}</nav>
      </aside>
      <section className="record-list">
        <div className="list-head"><div><p className="eyebrow">{t.collections[collection]}</p><strong>{filtered.length} {t.records}</strong></div><button className="primary" onClick={create}>{t.new}</button></div>
        {filtered.map(record=><button key={record.id} className={record.id===selectedId?'active':''} onClick={()=>selectRecord(record)}><strong>{recordTitle(record,collection,locale)}</strong><span>{locale==='kn'?(record.name?.en||record.title?.en||''):''}{locale==='kn'&&(record.name?.en||record.title?.en)?' · ':''}{record.id}</span><em className={`status ${record.review?.status}`}>{record.review?.status || 'invalid'}</em></button>)}
        {!filtered.length&&<p className="empty">No records match this search.</p>}
      </section>
      <section className="record-editor">
        <div className="editor-head"><div><p className="eyebrow">{selectedId?t.edit:t.create}</p><h2>{recordTitle(draft,collection,locale)}</h2>{locale==='kn'&&(draft.name?.en||draft.title?.en)&&<p className="entity-secondary">{draft.name?.en||draft.title?.en}</p>}</div>{selectedId&&<button className="danger-link" onClick={remove}>{t.delete}</button>}</div>
        <div className="form-grid">
          <label className="wide">{t.stableId}<input value={draft.id||''} onChange={e=>update(['id'],e.target.value)} placeholder={`${collectionPrefix[collection]}-unique-name`}/><small>Lowercase kebab-case; never reuse a published ID.</small></label>
          {collection==='relationships' ? <>
            <label>From ID <input value={draft.fromId||''} onChange={e=>update(['fromId'],e.target.value)}/></label><label>Relationship type <input value={draft.type||''} onChange={e=>update(['type'],e.target.value)}/></label><label className="wide">To ID <input value={draft.toId||''} onChange={e=>update(['toId'],e.target.value)}/></label>
          </> : collection==='sources' ? <>
            <label>English title <input value={draft.title?.en||''} onChange={e=>update(['title','en'],e.target.value)}/></label><label>Kannada title <input lang="kn" value={draft.title?.kn||''} onChange={e=>update(['title','kn'],e.target.value)}/></label><label className="wide">Authors / organizations<input value={(draft.authors||[]).join('; ')} onChange={e=>update(['authors'],e.target.value.split(';').map(value=>value.trim()).filter(Boolean))} placeholder="Author One; Institution Two"/></label><label>Source type <input value={draft.type||''} onChange={e=>update(['type'],e.target.value)}/></label><label>Publication year <input type="number" value={draft.year??''} onChange={e=>update(['year'],e.target.value===''?null:Number(e.target.value))}/></label><label className="wide">Publisher / repository<input value={draft.publisher||''} onChange={e=>update(['publisher'],e.target.value)}/></label><label>DOI<input value={draft.doi||''} onChange={e=>update(['doi'],e.target.value)}/></label><label>ISBN<input value={draft.isbn||''} onChange={e=>update(['isbn'],e.target.value)}/></label><label className="wide">URL <input type="url" value={draft.url||''} onChange={e=>update(['url'],e.target.value)}/></label>
          </> : collection==='collaborations' ? <>
            <label>{t.englishName}<input value={draft.name?.en||''} onChange={e=>update(['name','en'],e.target.value)}/></label><label>{t.kannadaName}<input lang="kn" value={draft.name?.kn||''} onChange={e=>update(['name','kn'],e.target.value)}/></label>
            <label>Entity / ಸಹಯೋಗಿ ಪ್ರಕಾರ<select value={draft.entityKind||'organization'} onChange={e=>update(['entityKind'],e.target.value)}>{['organization','university','individual'].map(value=><option key={value}>{value}</option>)}</select></label><label>Stage / ಹಂತ<select value={draft.stage||'upcoming'} onChange={e=>update(['stage'],e.target.value)}>{['steward','open','upcoming','active','complete'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">Collaboration type / ಸಹಯೋಗದ ಪ್ರಕಾರ<input value={draft.collaborationType||''} onChange={e=>update(['collaborationType'],e.target.value)}/></label><label className="wide">Public URL<input type="url" value={draft.url||''} onChange={e=>update(['url'],e.target.value)}/></label>
            <label className="wide">English scope / contribution<textarea rows="4" value={draft.contribution?.en||''} onChange={e=>update(['contribution','en'],e.target.value)}/></label><label className="wide">ಕನ್ನಡ ವ್ಯಾಪ್ತಿ / ಕೊಡುಗೆ<textarea lang="kn" rows="4" value={draft.contribution?.kn||''} onChange={e=>update(['contribution','kn'],e.target.value)}/></label>
          </> : <>
            <label>{t.englishName}<input value={draft.name?.en||''} onChange={e=>update(['name','en'],e.target.value)}/></label><label>{t.kannadaName}<input lang="kn" value={draft.name?.kn||''} onChange={e=>update(['name','kn'],e.target.value)}/></label>
          </>}
          {collection==='territorialExtents'&&<>
            <label>ವರ್ಗ / Classification<select value={draft.classification||'core-administered'} onChange={e=>update(['classification'],e.target.value)}>{['core-administered','tributary-influence','contested-zone','temporary-occupation','campaign-reach'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ನಿಯಂತ್ರಣ / Control<select value={draft.controlLevel||'direct'} onChange={e=>update(['controlLevel'],e.target.value)}>{['direct','indirect','disputed','temporary','none'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ಅವಧಿ / Duration<select value={draft.duration||'sustained'} onChange={e=>update(['duration'],e.target.value)}>{['sustained','multi-generational','intermittent','brief','episodic'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ವಿಶ್ವಾಸ / Confidence<select value={draft.confidence||'low'} onChange={e=>update(['confidence'],e.target.value)}>{['low','medium','high'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">ಸಂಬಂಧಿತ ರಾಜ್ಯ IDಗಳು / Polity IDs<input value={(draft.polityIds||[]).join(', ')} onChange={e=>update(['polityIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="polity-vijayanagara, external-polity-bahmani"/></label>
            <label>Snapshot ಪ್ರಕಾರ / Kind<select value={draft.snapshotKind||'prototype'} onChange={e=>update(['snapshotKind'],e.target.value)}>{['prototype','reign','regency','political-phase'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>Snapshot ವರ್ಷ / Year<input type="number" value={draft.snapshotYear??''} onChange={e=>update(['snapshotYear'],e.target.value===''?null:Number(e.target.value))}/></label>
            <label className="wide">ಆಳ್ವಿಕೆ ಅವಧಿ ID / Reign or period ID<input value={draft.reignId||''} onChange={e=>update(['reignId'],e.target.value||null)} placeholder="reign-krishnadevaraya-vijayanagara"/></label>
          </>}
          {collection==='reigns'&&<>
            <label>ಅವಧಿ ಪ್ರಕಾರ / Period type<select value={draft.periodType||'reign'} onChange={e=>update(['periodType'],e.target.value)}>{['reign','regency','political-phase'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ರಾಜ್ಯ ID / Polity ID<input value={draft.polityId||''} onChange={e=>update(['polityId'],e.target.value)} placeholder="polity-vijayanagara"/></label>
            <label className="wide">ಆಳ್ವಿಕರ IDಗಳು / Ruler IDs<input value={(draft.rulerIds||[]).join(', ')} onChange={e=>update(['rulerIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="person-krishnadevaraya"/></label>
            <label className="wide">ರಾಜಧಾನಿ IDಗಳು / Capital IDs<input value={(draft.capitalIds||[]).join(', ')} onChange={e=>update(['capitalIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="place-hampi"/></label>
          </>}
          {collection==='culturalHeritage'&&<>
            <label>ವರ್ಗ / Category<select value={draft.category||'architecture'} onChange={e=>update(['category'],e.target.value)}>{['architecture','visual-art','literature','performance','music','celebration','religious-tradition','craft'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label>ನಿರಂತರತೆ / Continuity<select value={draft.continuity||'unknown'} onChange={e=>update(['continuity'],e.target.value)}>{['historic','continuing-practice','material-survival','revived','unknown'].map(value=><option key={value}>{value}</option>)}</select></label>
            <label className="wide">ರಾಜ್ಯ IDಗಳು / Polity IDs<input value={(draft.polityIds||[]).join(', ')} onChange={e=>update(['polityIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="polity-hoysala"/></label>
            <label className="wide">ಸ್ಥಳ IDಗಳು / Place IDs<input value={(draft.placeIds||[]).join(', ')} onChange={e=>update(['placeIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="place-belur"/></label>
            <label className="wide">ವ್ಯಕ್ತಿ IDಗಳು / People IDs<input value={(draft.peopleIds||[]).join(', ')} onChange={e=>update(['peopleIds'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="person-vishnuvardhana"/></label>
            <label className="wide">ಪರಂಪರೆ tags / Tradition tags<input value={(draft.traditionTags||[]).join(', ')} onChange={e=>update(['traditionTags'],e.target.value.split(',').map(value=>value.trim()).filter(Boolean))} placeholder="Shaiva, sculpture, ritual"/></label>
          </>}
          {draft.date&&<><label>{t.start}<input type="number" value={draft.date.from??''} onChange={e=>update(['date','from'],e.target.value===''?null:Number(e.target.value))}/></label><label>{t.end}<input type="number" value={draft.date.to??''} onChange={e=>update(['date','to'],e.target.value===''?null:Number(e.target.value))}/></label><label>{t.datePrecision}<select value={draft.date.precision} onChange={e=>update(['date','precision'],e.target.value)}>{['unknown','year','circa','range','century'].map(x=><option key={x}>{x}</option>)}</select></label></>}
          <label>{t.reviewStatus}<select value={draft.review?.status||'draft'} onChange={e=>update(['review','status'],e.target.value)}>{['draft','needs-review','reviewed','published'].map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="wide">{t.reviewer}<input value={draft.review?.reviewer||''} onChange={e=>update(['review','reviewer'],e.target.value||null)} placeholder="Name or stable researcher ID"/></label>
          <label className="wide">{t.json}<textarea rows="14" value={jsonText} onChange={e=>{const value=e.target.value;setJsonText(value);try{setDraft(JSON.parse(value));setNotice('')}catch{setNotice('JSON editor has a syntax error.')}}}/><small>Advanced fields include geometry, citations, external links, descriptions, and entity references.</small></label>
        </div>
        {recordIssues.length>0&&<div className="issue-box"><h3>{t.validation}</h3>{recordIssues.map((issue,index)=><p key={`${issue.path}-${index}`} className={issue.severity}><strong>{issue.severity}</strong> {issue.path}: {issue.message}</p>)}</div>}
        <div className="editor-actions"><button className="primary" onClick={save}>{t.save}</button><span>{notice}</span></div>
      </section>
    </main>
  </div>
}
