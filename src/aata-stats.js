import { shiftArchiveDate } from './aata-paata.js'

export const emptyStats=()=>({played:0,won:0,streak:0,best:0,last:null,dates:{}})

// Records one finished puzzle. Replaying an already recorded date changes nothing. Only a puzzle played on its own
// day (`today` equals `date`) moves the streak, so opening the archive cannot inflate it; pass today=null for weekly games.
export const recordResult=(stats,date,won,today)=>{
  const base={...emptyStats(),...stats}
  if(date in base.dates)return base
  const next={...base,dates:{...base.dates,[date]:won?1:0},played:base.played+1,won:base.won+(won?1:0)}
  if(date!==today)return next
  if(!won)return{...next,streak:0,last:null}
  const streak=base.last===shiftArchiveDate(date,-1)?base.streak+1:1
  return{...next,streak,best:Math.max(base.best,streak),last:date}
}

// A streak that was not extended yesterday or today has ended.
export const currentStreak=(stats,today)=>stats?.last&&(stats.last===today||stats.last===shiftArchiveDate(today,-1))?stats.streak:0

const marks={correct:'🟩',present:'🟨',absent:'⬛'}
export const wordShareText=({title,date,rows,url})=>`${title} ${date} ${rows.length}\n${rows.map(row=>row.map(item=>marks[item.status]||'⬛').join('')).join('\n')}\n${url}`
