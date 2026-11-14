// localStorage and sessionStorage that never throw. Some browsers (in-app browsers such as WhatsApp and Instagram, strict privacy
// modes, blocked cookies) throw a SecurityError when the storage *property* is read, so the read must happen inside the try.
// Use this instead of touching localStorage or sessionStorage directly. get() gives null and set() gives false when unavailable.
const area=name=>globalThis[name]
export const safeStorage={
  get(key,which='localStorage'){try{return area(which).getItem(key)}catch{return null}},
  set(key,value,which='localStorage'){try{area(which).setItem(key,String(value));return true}catch{return false}},
}
export const session={get:key=>safeStorage.get(key,'sessionStorage'),set:(key,value)=>safeStorage.set(key,value,'sessionStorage')}
