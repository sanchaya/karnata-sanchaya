// Private visitor counting: no cookies, no IP address, no user agent stored. The browser sends a random id; the server keeps
// only an HMAC of it. "Live now" is kept in memory (one server process), totals in MariaDB (016_site_visits.sql).
import { createHmac } from 'node:crypto'

export const visitorHash=(secret,id)=>createHmac('sha256',secret).update(String(id)).digest('hex').slice(0,32)
export const isBot=userAgent=>!userAgent||/bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python-requests/i.test(userAgent)
const ID=/^[0-9a-f-]{16,64}$/i,VIEW=/^[a-z0-9-]{1,40}$/
// Returns a cleaned ping or null when the body is not a valid ping.
export function parsePing(body){
  if(!body||typeof body!=='object')return null
  const {v,s,view,kind}=body
  if(!ID.test(v||'')||!ID.test(s||'')||!VIEW.test(view||'')||!['view','beat'].includes(kind))return null
  return {v,s,view,kind}
}
export class LiveSessions{
  constructor(ttlMs=2*60*1000){this.ttlMs=ttlMs;this.sessions=new Map()}
  // True when this session was not live a moment ago (a new visit).
  touch(sessionHash,visitor,view,now=Date.now()){
    const fresh=!this.sessions.has(sessionHash)||now-this.sessions.get(sessionHash).seen>this.ttlMs
    this.sessions.set(sessionHash,{seen:now,visitor,view})
    if(this.sessions.size>5000)this.prune(now)
    return fresh
  }
  prune(now=Date.now()){for(const [key,entry] of this.sessions)if(now-entry.seen>this.ttlMs*5)this.sessions.delete(key)}
  snapshot(now=Date.now()){
    const live=[...this.sessions.values()].filter(entry=>now-entry.seen<=this.ttlMs),byView={}
    for(const entry of live)byView[entry.view]=(byView[entry.view]||0)+1
    return {sessions:live.length,visitors:new Set(live.map(entry=>entry.visitor)).size,byView}
  }
}
