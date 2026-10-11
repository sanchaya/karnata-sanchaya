import { useMemo, useState } from 'react'
import { atlasData } from './data/atlas'

const text=(value,locale)=>value?.[locale]||value?.kn||value?.en||''
const needsReview=record=>!['reviewed','verified','published','authority-confirmed'].includes(record?.review?.status)
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
]

export default function CommunityResearchTasks({locale='kn'}){
  const kn=locale==='kn',[group,setGroup]=useState('all'),[query,setQuery]=useState(''),[limit,setLimit]=useState(18)
  const tasks=useMemo(()=>taskRecords(),[])
  const filtered=useMemo(()=>{const needle=query.trim().toLowerCase();return tasks.filter(task=>(group==='all'||task.group===group)&&(!needle||JSON.stringify(task.record).toLowerCase().includes(needle)))},[tasks,group,query])
  const linkFor=task=>{const params=new URLSearchParams({contributeTarget:task.record.id,contributeType:task.type,contributeName:text(task.record.name,locale)});return `?${params}#community`}
  return <section className="community-card community-wide research-task-marketplace"><div className="research-task-heading"><div><p className="eyebrow">{kn?'ಸಣ್ಣ ಸಂಶೋಧನಾ ಕಾರ್ಯಗಳು':'Research tasks'}</p><h3>{kn?'ಒಂದು ಬಾಕಿ ಸಾಕ್ಷ್ಯವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ':'Help complete one evidence gap'}</h3><p>{kn?'ಜಿಲ್ಲೆ, ವಿಷಯ ಅಥವಾ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ. ಪ್ರತಿಯೊಂದು ಕೊಡುಗೆಯೂ ಪ್ರಕಟಣೆಗೆ ಮುನ್ನ ಪರಿಶೀಲನೆಯಾಗುತ್ತದೆ.':'Search by district, topic or name. Every contribution is reviewed before publication.'}</p></div><b>{filtered.length.toLocaleString('en-IN')}</b></div><div className="research-task-controls"><input value={query} onChange={event=>{setQuery(event.target.value);setLimit(18)}} placeholder={kn?'ಹೆಸರು, ಜಿಲ್ಲೆ, ವಿಷಯ ಹುಡುಕಿ…':'Search name, district or topic…'}/><select value={group} onChange={event=>{setGroup(event.target.value);setLimit(18)}}><option value="all">{kn?'ಎಲ್ಲ ಕಾರ್ಯಗಳು':'All tasks'}</option><option value="inscriptions">{kn?'ಶಾಸನಗಳು':'Inscriptions'}</option><option value="literature">{kn?'ಸಾಹಿತ್ಯ':'Literature'}</option><option value="districts">{kn?'ಜಿಲ್ಲಾ ಇತಿಹಾಸ':'District history'}</option><option value="people">{kn?'ವ್ಯಕ್ತಿಗಳು':'People'}</option><option value="heritage">{kn?'ಪರಂಪರೆ ಮತ್ತು ದೇವಾಲಯಗಳು':'Heritage and temples'}</option><option value="relations">{kn?'ರಾಜಕೀಯ ಸಂಬಂಧಗಳು':'Political relations'}</option><option value="material">{kn?'ನಾಣ್ಯ ಮತ್ತು ಲಿಪಿ':'Coins and scripts'}</option><option value="territory">{kn?'ಭೂಪ್ರದೇಶ ಸಾಕ್ಷ್ಯ':'Territorial evidence'}</option></select></div><div className="research-task-grid">{filtered.slice(0,limit).map(task=><article key={`${task.type}-${task.record.id}`}><span>{task.group} · {task.record.review?.status||'needs-review'}</span><strong>{text(task.record.name,locale)||task.record.id}</strong><small>{text(task.record.district,locale)||task.record.districtText?.join(', ')||task.record.placeId||task.record.id}</small><a href={linkFor(task)}>{kn?'ಸಾಕ್ಷ್ಯ ಸೇರಿಸಿ':'Contribute evidence'} →</a></article>)}</div>{limit<filtered.length&&<button type="button" onClick={()=>setLimit(value=>value+18)}>{kn?'ಇನ್ನಷ್ಟು ಕಾರ್ಯಗಳು':'Show more tasks'}</button>}</section>
}
