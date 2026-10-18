import { useMemo, useState } from 'react'
import { atlasData } from './data/atlas'
import { canonicalDistrictName } from './data/district-normalization'

const text=(value,locale)=>value?.[locale]||value?.kn||value?.en||''
const needsReview=record=>!['reviewed','verified','published','authority-confirmed'].includes(record?.review?.status)
const withCanonicalTaskDistrict=record=>{const values=record.district?[record.district]:(record.districtText||[]);return values.length?{...record,district:{en:values.map(value=>canonicalDistrictName(value,'en')).join(', '),kn:values.map(value=>canonicalDistrictName(value,'kn')).join(', ')}}:record}
const taskRecords=()=>[
  ...(atlasData.inscriptions||[]).filter(needsReview).map(record=>({record,type:'inscription',group:'inscriptions'})),
  ...(atlasData.works||[]).filter(needsReview).map(record=>({record,type:'work',group:'literature'})),
  ...(atlasData.districtHistoryResearch||[]).filter(record=>record.recordKind==='candidate'&&needsReview(record)).map(record=>({record,type:'heritageCandidate',group:'districts'})),
  ...(atlasData.martyrCandidates||[]).map(record=>({record,type:'martyrCandidate',group:'people'})),
  ...(atlasData.culturalHeritage||[]).filter(needsReview).map(record=>({record,type:'culturalHeritage',group:'heritage'})),
  ...(atlasData.templeInventoryLeads||[]).filter(needsReview).map(record=>({record,type:'heritageCandidate',group:'heritage'})),
  ...(atlasData.politicalRelations||[]).filter(needsReview).map(record=>({record,type:'event',group:'relations'})),
  ...(atlasData.coinRecords||[]).filter(needsReview).map(record=>({record,type:'culturalHeritage',group:'material'})),
  ...(atlasData.scriptEvolution||[]).filter(needsReview).map(record=>({record,type:'inscription',group:'material'})),
  ...(atlasData.boundaryEvidence||[]).filter(needsReview).map(record=>({record,type:'territorialExtent',group:'territory'})),
  ...(atlasData.polities||[]).filter(needsReview).map(record=>({record,type:'polity',group:'governance'})),
  ...(atlasData.reigns||[]).filter(needsReview).map(record=>({record,type:'reign',group:'governance'})),
  ...(atlasData.people||[]).filter(record=>record.roles?.includes('ruler')&&needsReview(record)).map(record=>({record,type:'person',group:'governance'})),
  ...(atlasData.periodicalMapSites||[]).filter(needsReview).map(record=>({record,type:'periodical',group:'periodicals'})),
  ...(atlasData.sources||[]).filter(needsReview).map(record=>({record,type:'source',group:'evidence'})),
  ...(atlasData.inscriptionEditions||[]).filter(record=>!['verified','not-applicable'].includes(record.evidenceGates?.translation?.status)).map(record=>({record,type:'inscription',targetId:record.inscriptionId,group:'evidence'})),
].map(task=>({...task,record:withCanonicalTaskDistrict(task.record)}))

const groupLabels={
  kn:{all:'ಎಲ್ಲ ಕಾರ್ಯಗಳು',inscriptions:'ಶಾಸನಗಳು',literature:'ಸಾಹಿತ್ಯ',districts:'ಜಿಲ್ಲಾ ಇತಿಹಾಸ',people:'ವ್ಯಕ್ತಿಗಳು',heritage:'ಪರಂಪರೆ ಮತ್ತು ದೇವಾಲಯಗಳು',relations:'ರಾಜಕೀಯ ಸಂಬಂಧಗಳು',material:'ನಾಣ್ಯ ಮತ್ತು ಲಿಪಿ',territory:'ಭೂಪ್ರದೇಶ ಸಾಕ್ಷ್ಯ',governance:'ಆಳ್ವಿಕರು ಮತ್ತು ರಾಜವಂಶಗಳು',periodicals:'ಪತ್ರಿಕೆಗಳು ಮತ್ತು ನಿಯತಕಾಲಿಕೆಗಳು',evidence:'ಆಕರ ಮತ್ತು ಅನುವಾದ ಪರಿಶೀಲನೆ'},
  en:{all:'All tasks',inscriptions:'Inscriptions',literature:'Literature',districts:'District history',people:'People',heritage:'Heritage and temples',relations:'Political relations',material:'Coins and scripts',territory:'Territorial evidence',governance:'Rulers and dynasties',periodicals:'Newspapers and periodicals',evidence:'Source and translation review'},
}

export default function CommunityResearchTasks({locale='kn'}){
  const kn=locale==='kn',[group,setGroup]=useState('all'),[query,setQuery]=useState(''),[limit,setLimit]=useState(18)
  const tasks=useMemo(()=>taskRecords(),[]),labels=groupLabels[kn?'kn':'en']
  const counts=useMemo(()=>Object.fromEntries(Object.keys(labels).filter(value=>value!=='all').map(value=>[value,tasks.filter(task=>task.group===value).length])),[tasks,labels])
  const filtered=useMemo(()=>{const needle=query.trim().toLowerCase();return tasks.filter(task=>(group==='all'||task.group===group)&&(!needle||JSON.stringify(task.record).toLowerCase().includes(needle)))},[tasks,group,query])
  const linkFor=task=>{const params=new URLSearchParams({contributeTarget:task.targetId||task.record.id,contributeType:task.type,contributeName:text(task.record.name,locale)});return `?${params}#community`}
  return <section className="community-card community-wide research-task-marketplace"><div className="research-task-heading"><div><p className="eyebrow">{kn?'ಸಣ್ಣ ಸಂಶೋಧನಾ ಕಾರ್ಯಗಳು':'Research tasks'}</p><h3>{kn?'ಒಂದು ಬಾಕಿ ಸಾಕ್ಷ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ':'Help complete one evidence gap'}</h3><p>{kn?'ಜಿಲ್ಲೆ, ವಿಷಯ ಅಥವಾ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ. ಪ್ರತಿಯೊಂದು ಕೊಡುಗೆಯೂ ಪ್ರಕಟಣೆಗೆ ಮುನ್ನ ಪರಿಶೀಲನೆಯಾಗುತ್ತದೆ.':'Search by district, topic or name. Every contribution is reviewed before publication.'}</p></div><b>{filtered.length.toLocaleString('en-IN')}</b></div><div className="research-task-progress" aria-label={kn?'ವಿಭಾಗವಾರು ಬಾಕಿ ಕಾರ್ಯಗಳು':'Open tasks by category'}>{Object.entries(counts).filter(([,count])=>count>0).map(([value,count])=><button type="button" className={group===value?'active':''} key={value} onClick={()=>{setGroup(value);setLimit(18)}}><span>{labels[value]}</span><b>{count.toLocaleString('en-IN')}</b></button>)}</div><div className="research-task-controls"><input value={query} onChange={event=>{setQuery(event.target.value);setLimit(18)}} placeholder={kn?'ಹೆಸರು, ಜಿಲ್ಲೆ, ವಿಷಯ ಹುಡುಕಿ…':'Search name, district or topic…'}/><select value={group} onChange={event=>{setGroup(event.target.value);setLimit(18)}}>{Object.entries(labels).map(([value,label])=><option value={value} key={value}>{label}{value==='all'?'':` · ${counts[value]||0}`}</option>)}</select></div><div className="research-task-grid">{filtered.slice(0,limit).map(task=><article key={`${task.type}-${task.record.id}`}><span>{labels[task.group]} · {task.record.review?.status||'needs-review'}</span><strong>{text(task.record.name,locale)||task.record.id}</strong><small>{text(task.record.district,locale)||text(task.record.place,locale)||task.record.districtText?.join(', ')||task.record.placeId||task.record.citation?.locator||task.record.id}</small><a href={linkFor(task)}>{kn?'ಸಾಕ್ಷ್ಯ ಸೇರಿಸಿ':'Contribute evidence'} →</a>{task.group==='evidence'&&<a href="#evidence">{kn?'ಮಾನವ ಸಾಕ್ಷ್ಯ ಕಾರ್ಯಪಟ್ಟಿ':'Open evidence workflow'} →</a>}</article>)}</div>{limit<filtered.length&&<button type="button" onClick={()=>setLimit(value=>value+18)}>{kn?'ಇನ್ನಷ್ಟು ಕಾರ್ಯಗಳು':'Show more tasks'}</button>}</section>
}
