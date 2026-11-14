// When to invite a reader to sign up. Never a pop-up: a slim, dismissible strip after the reader has looked around, and not to
// members, not while they are already on an account page, and not again for 30 days after "Not now".
export const JOIN_MIN_VIEWS=3
export const JOIN_SNOOZE_DAYS=30
const ACCOUNT_PAGES=new Set(['contribute','profile','reviews','operations','evidence','admin','research-tasks'])
export const shouldShowJoin=({views,dismissedAt,signedIn,view,now=Date.now()})=>{
  if(signedIn===true||ACCOUNT_PAGES.has(view)||views<JOIN_MIN_VIEWS)return false
  return !dismissedAt||now-Number(dismissedAt)>JOIN_SNOOZE_DAYS*86400000
}
// The sign-up page is on the live portal; the static mirror links across to it.
export const joinUrl=(staticEdition,siteUrl='https://karnata.sanchaya.net/')=>staticEdition?`${siteUrl}#contribute`:'#contribute'
