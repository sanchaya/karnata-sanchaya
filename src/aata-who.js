import { graphemes, stableNumber } from './aata-paata.js'

const localized=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const era=(year,locale)=>`${year} ${locale==='kn'?'ಕ್ರಿ.ಶ.':'CE'}`

// Four clues per dynasty, from vague to specific: the period, the capital, a catalogued record, then the first letter.
export const whoClues=(phase,data,locale='kn')=>{
  const record=[...(data.inscriptions||[]),...(data.works||[])].find(item=>item.polityId&&item.polityId===phase.polityId)
  const span=phase.to-phase.from
  return [
    locale==='kn'?`ಸುಮಾರು ${era(phase.from,locale)}–${era(phase.to,locale)} ಅವಧಿಯಲ್ಲಿ ಸಕ್ರಿಯ`:`Active about ${era(phase.from,locale)}–${era(phase.to,locale)}`,
    locale==='kn'?`ರಾಜಧಾನಿ: ${localized(phase.capital,locale)}`:`Capital: ${localized(phase.capital,locale)}`,
    record?(locale==='kn'?`ಅಟ್ಲಸ್‌ನ ದಾಖಲೆ: ${localized(record.name,locale)}`:`An atlas record: ${localized(record.name,locale)}`):(locale==='kn'?`ಸುಮಾರು ${span} ವರ್ಷಗಳ ಅವಧಿ`:`A span of about ${span} years`),
    locale==='kn'?`ಹೆಸರು ಇದರಿಂದ ಪ್ರಾರಂಭ: ${graphemes(localized(phase.name,locale),locale)[0]}`:`The name begins with: ${graphemes(localized(phase.name,locale),locale)[0]}`,
  ]
}

// Five dynasties a day, each with six answer options that include the right one.
export const buildWhoRounds=(phases,data,locale='kn',seed='today',count=5)=>{
  const byHash=(items,key)=>[...items].sort((a,b)=>stableNumber(`${seed}:${key}:${a.id}`)-stableNumber(`${seed}:${key}:${b.id}`))
  const distinct=[...new Map(phases.map(phase=>[localized(phase.name,locale),phase])).values()]
  return byHash(distinct,'pick').slice(0,count).map(phase=>({
    id:phase.id,name:localized(phase.name,locale),clues:whoClues(phase,data,locale),
    options:byHash([phase,...byHash(distinct.filter(other=>other.id!==phase.id),phase.id).slice(0,5)],`opt:${phase.id}`).map(option=>({id:option.id,name:localized(option.name,locale)})),
  }))
}

// Right on clue 1 is worth 4 points, on clue 4 one point; running out of clues is 0.
export const whoPoints=cluesUsed=>Math.max(0,5-cluesUsed)
