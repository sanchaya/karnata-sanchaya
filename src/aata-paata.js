const segmenters=new Map()

export const AATA_ARCHIVE_START='2026-11-13'
export const archiveDateValid=(value,maxDate)=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&value>=AATA_ARCHIVE_START&&value<=maxDate
export const shiftArchiveDate=(value,days)=>{const date=new Date(`${value}T12:00:00Z`);date.setUTCDate(date.getUTCDate()+days);return date.toISOString().slice(0,10)}
export const archiveWeekKey=value=>{const date=new Date(`${value}T12:00:00Z`),day=date.getUTCDay()||7;date.setUTCDate(date.getUTCDate()+4-day);const first=new Date(Date.UTC(date.getUTCFullYear(),0,1));return `${date.getUTCFullYear()}-${String(Math.ceil((((date-first)/86400000)+1)/7)).padStart(2,'0')}`}

export const graphemes=(value,locale='kn')=>{
  const normalized=String(value||'').normalize('NFC').trim()
  if(typeof Intl?.Segmenter!=='function')return Array.from(normalized)
  if(!segmenters.has(locale))segmenters.set(locale,new Intl.Segmenter(locale,{granularity:'grapheme'}))
  return [...segmenters.get(locale).segment(normalized)].map(item=>item.segment)
}

export const normalizeAnswer=value=>String(value||'').normalize('NFC').trim().toLocaleLowerCase()

export const scoreGuess=(answer,guess,locale='kn')=>{
  const target=graphemes(normalizeAnswer(answer),locale)
  const attempt=graphemes(normalizeAnswer(guess),locale)
  if(target.length!==attempt.length)throw new Error('length-mismatch')
  const result=attempt.map(letter=>({letter,status:'absent'}))
  const remaining=new Map()
  target.forEach((letter,index)=>{
    if(letter===attempt[index])result[index].status='correct'
    else remaining.set(letter,(remaining.get(letter)||0)+1)
  })
  attempt.forEach((letter,index)=>{
    if(result[index].status==='correct')return
    const count=remaining.get(letter)||0
    if(count>0){result[index].status='present';remaining.set(letter,count-1)}
  })
  return result
}

export const stableNumber=value=>{
  let hash=2166136261
  for(const char of String(value)){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619)}
  return hash>>>0
}

const localized=(value,locale)=>value?.[locale]||value?.en||value?.kn||String(value||'')
const yearLabel=(date,locale)=>{
  if(!date||!Number.isFinite(Number(date.from)))return locale==='kn'?'ದಿನಾಂಕ ಪರಿಶೀಲನೆ ಬಾಕಿ':'date under review'
  const from=Math.abs(Number(date.from)),to=Math.abs(Number(date.to??date.from)),era=date.era==='BCE'?(locale==='kn'?'ಕ್ರಿ.ಪೂ.':'BCE'):(locale==='kn'?'ಕ್ರಿ.ಶ.':'CE')
  return `${from}${to!==from?`–${to}`:''} ${era}`
}
const singleWord=(value,locale)=>{
  const clean=String(value||'').normalize('NFC').replace(/[()[\]{}.,:;!?/|·–—'"0-9]/gu,' ').trim().split(/\s+/u)[0]||''
  const letters=graphemes(clean,locale)
  const valid=locale==='kn'?/^[\u0C80-\u0CFF]+$/u.test(clean):/^[A-Za-z]+$/u.test(clean)
  return valid&&letters.length>=3&&letters.length<=11?clean:''
}

export const buildWordCatalog=(atlasData,geography,locale='kn')=>{
  const items=[]
  const add=(records,type,route,hint)=>records.forEach(record=>{
    const answer=singleWord(localized(record.name||record.title,locale),locale)
    if(answer)items.push({id:record.id,answer,type,route,hint:hint(record)})
  })
  add(atlasData.polities||[],'polity','dynasties',record=>locale==='kn'?`${yearLabel(record.date,locale)} ಅವಧಿಯ ರಾಜವಂಶ`:`A polity dated ${yearLabel(record.date,locale)}`)
  add(atlasData.places||[],'place','atlas',record=>locale==='kn'?'ಅಟ್ಲಸ್‌ನ ಐತಿಹಾಸಿಕ ಸ್ಥಳ':'A historical place in the atlas')
  add(atlasData.works||[],'work','literature',record=>locale==='kn'?`${localized(record.creator,locale)} ಅವರೊಂದಿಗೆ ಸಂಬಂಧಿಸಿದ ಕೃತಿ`:`A work associated with ${localized(record.creator,locale)}`)
  add(atlasData.inscriptions||[],'inscription','epigraphy',record=>locale==='kn'?`${yearLabel(record.date,locale)} ಕಾಲದ ಶಾಸನ`:`An inscription dated ${yearLabel(record.date,locale)}`)
  add(geography.protectedAreas||[],'nature','geography',record=>locale==='kn'?`${localized(record.districts,locale)} ಪ್ರದೇಶದ ಸಂರಕ್ಷಿತ ತಾಣ`:`A protected landscape in ${localized(record.districts,locale)}`)
  add(geography.highlights||[],'nature','geography',record=>locale==='kn'?'ಕರ್ನಾಟಕದ ಭೂಗೋಳ ಅಥವಾ ನಿಸರ್ಗದ ಗುರುತು':'A Karnataka geography or nature feature')
  return [...new Map(items.map(item=>[normalizeAnswer(item.answer),item])).values()]
}

const eventYear=event=>event?.date?.era==='BCE'?-Number(event.date.from):Number(event?.date?.from)
export const buildYearPuzzle=(events,locale='kn',seed='today')=>{
  const distinct=[...new Map((events||[]).filter(event=>Number.isFinite(eventYear(event))).map(event=>[eventYear(event),event])).entries()]
  if(distinct.length<4)throw new Error('year-puzzle-needs-four-events')
  const offset=stableNumber(seed)%distinct.length
  const choices=Array.from({length:4},(_,index)=>distinct[(offset+index*Math.max(1,Math.floor(distinct.length/4)))%distinct.length])
  const years=choices.map(([year])=>year)
  const pattern=[0,1,2,3,2,3,0,1,1,0,3,2,3,2,1,0]
  const solution=pattern.map(index=>years[index])
  const hidden=new Set([1,2,4,7,8,11,13,14,15])
  return {
    years,
    solution,
    givens:solution.map((year,index)=>hidden.has(index)?null:year),
    facts:choices.map(([year,event])=>({year,id:event.id,name:localized(event.name||event.title,locale),route:'atlas'})),
  }
}

const placementKey=(row,col)=>`${row}:${col}`
const canPlace=(grid,letters,row,col,direction,size)=>{
  const dr=direction==='down'?1:0,dc=direction==='across'?1:0
  if(row<0||col<0||row+dr*(letters.length-1)>=size||col+dc*(letters.length-1)>=size)return false
  let intersections=0
  for(let index=0;index<letters.length;index+=1){
    const existing=grid.get(placementKey(row+dr*index,col+dc*index))
    if(existing&&existing!==letters[index])return false
    if(existing===letters[index])intersections+=1
  }
  return grid.size===0||intersections>0
}
const layoutWords=(entries,locale,size,firstIndex)=>{
  const grid=new Map(),placed=[]
  const ordered=[entries[firstIndex],...entries.filter((_,index)=>index!==firstIndex)]
  ordered.forEach((entry,index)=>{
    const letters=graphemes(entry.answer,locale)
    if(index===0){
      const row=Math.floor(size/2),col=Math.max(0,Math.floor((size-letters.length)/2))
      letters.forEach((letter,i)=>grid.set(placementKey(row,col+i),letter))
      placed.push({...entry,letters,row,col,direction:'across'})
      return
    }
    let match=null
    for(const existing of placed){
      for(let a=0;a<letters.length&&!match;a+=1)for(let b=0;b<existing.letters.length&&!match;b+=1){
        if(letters[a]!==existing.letters[b])continue
        const direction=existing.direction==='across'?'down':'across'
        const row=direction==='down'?existing.row-a:existing.row+b
        const col=direction==='down'?existing.col+b:existing.col-a
        if(canPlace(grid,letters,row,col,direction,size))match={row,col,direction}
      }
      if(match)break
    }
    if(match){letters.forEach((letter,i)=>grid.set(placementKey(match.row+(match.direction==='down'?i:0),match.col+(match.direction==='across'?i:0)),letter));placed.push({...entry,letters,...match})}
  })
  return {grid,placed}
}

export const buildCrossword=(catalog,locale='kn',seed='weekly',size=13)=>{
  const pool=[...(catalog||[])].sort((a,b)=>stableNumber(`${seed}:${a.id}`)-stableNumber(`${seed}:${b.id}`)).slice(0,28)
  let best={grid:new Map(),placed:[]}
  pool.slice(0,12).forEach((_,index)=>{const result=layoutWords(pool,locale,size,index);if(result.placed.length>best.placed.length)best=result})
  const numbers=new Map(),sorted=[...best.placed].sort((a,b)=>a.row-b.row||a.col-b.col)
  sorted.forEach(entry=>{const key=placementKey(entry.row,entry.col);if(!numbers.has(key))numbers.set(key,numbers.size+1);entry.number=numbers.get(key)})
  return {size,cells:[...best.grid].map(([key,letter])=>{const [row,col]=key.split(':').map(Number);return{row,col,letter,number:numbers.get(key)||null}}),entries:sorted}
}

export const formattedGameYear=(year,locale='kn')=>`${Math.abs(year)} ${year<0?(locale==='kn'?'ಕ್ರಿ.ಪೂ.':'BCE'):(locale==='kn'?'ಕ್ರಿ.ಶ.':'CE')}`
