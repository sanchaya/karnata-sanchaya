import { stableNumber } from './aata-paata.js'
import { ERA_FONTS } from './data/era-fonts.js'

const MODERN='modern'
export const SCRIPT_STYLES=[...Object.entries(ERA_FONTS).map(([id,font])=>({id,family:font.family,name:font.name,note:font.note})),{id:MODERN,family:'inherit',name:{kn:'ಇಂದಿನ ಕನ್ನಡ',en:'Modern Kannada'},note:{kn:'ಇಂದಿನ ಮುದ್ರಣ ರೂಪ',en:'Today’s print form'}}]

// Kannada words from the atlas catalogue, each drawn in one era typeface. The typefaces are modern recreations of each
// period's lettering, so the game teaches the look of the styles, not a dated reading of a particular inscription.
export const buildScriptRounds=(catalogKn,seed='today',count=5)=>{
  const words=[...catalogKn].filter(item=>/^[ಀ-೿]{3,8}$/u.test(item.answer)).sort((a,b)=>stableNumber(`${seed}:${a.id}`)-stableNumber(`${seed}:${b.id}`)).slice(0,count)
  return words.map((item,index)=>({id:item.id,word:item.answer,style:SCRIPT_STYLES[stableNumber(`${seed}:${item.id}:${index}`)%SCRIPT_STYLES.length]}))
}
