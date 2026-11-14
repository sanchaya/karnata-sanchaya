import { stableNumber } from './aata-paata.js'
import { isKarnatakaPoint } from './map-focus.js'

export const haversineKm=([lat1,lng1],[lat2,lng2])=>{
  const rad=value=>value*Math.PI/180,a=Math.sin(rad(lat2-lat1)/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(rad(lng2-lng1)/2)**2
  return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}

// 1000 points for a pin on the spot, falling in a straight line to 0 at 400 km, about the width of Karnataka.
export const roundScore=km=>Math.max(0,Math.round(1000*(1-km/400)))

const localized=(value,locale)=>value?.[locale]||value?.en||value?.kn||''
const generic=(kind,locale)=>locale==='kn'?'ಅಟ್ಲಸ್‌ನ ಐತಿಹಾಸಿಕ ಸ್ಥಳ':`A historical ${String(kind||'place').replaceAll('-',' ')} in the atlas`

// Rounds are atlas places inside Karnataka. A place that was a capital or holds a catalogued inscription gets that as its clue.
export const buildWhereRounds=(data,locale='kn',seed='today',count=5)=>{
  const capitalOf=new Map((data.polities||[]).filter(polity=>polity.capitalId).map(polity=>[polity.capitalId,polity]))
  const siteOf=new Map((data.inscriptions||[]).filter(record=>record.placeId).map(record=>[record.placeId,record]))
  const places=(data.places||[]).map(place=>({place,coords:[place.location?.coordinates?.[1],place.location?.coordinates?.[0]]})).filter(({coords})=>isKarnatakaPoint(coords))
  const clueFor=({place})=>{
    const capital=capitalOf.get(place.id),site=siteOf.get(place.id)
    if(capital)return locale==='kn'?`${localized(capital.name,locale)} ರಾಜವಂಶದ ರಾಜಧಾನಿ`:`Capital of the ${localized(capital.name,locale)}`
    if(site)return locale==='kn'?`${localized(site.name,locale)} ಇಲ್ಲಿದೆ`:`Site of the ${localized(site.name,locale)}`
    return generic(place.kind,locale)
  }
  return places.sort((a,b)=>stableNumber(`${seed}:${a.place.id}`)-stableNumber(`${seed}:${b.place.id}`)).slice(0,count)
    .map(item=>({id:item.place.id,name:localized(item.place.name,locale),coords:item.coords,clue:clueFor(item),review:item.place.review?.status||null}))
}

const squares=km=>km<25?'🟩':km<100?'🟨':'🟥'
export const whereShareText=({title,date,kms,url})=>`${title} ${date} ${kms.reduce((sum,km)=>sum+roundScore(km),0)}/${kms.length*1000}\n${kms.map(squares).join('')}\n${url}`
