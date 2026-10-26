const vowels={'ಅ':'a','ಆ':'a','ಇ':'i','ಈ':'i','ಉ':'u','ಊ':'u','ಋ':'ru','ೠ':'ru','ಎ':'e','ಏ':'e','ಐ':'ai','ಒ':'o','ಓ':'o','ಔ':'au'}
const consonants={'ಕ':'k','ಖ':'kh','ಗ':'g','ಘ':'gh','ಙ':'n','ಚ':'ch','ಛ':'chh','ಜ':'j','ಝ':'jh','ಞ':'n','ಟ':'t','ಠ':'th','ಡ':'d','ಢ':'dh','ಣ':'n','ತ':'t','ಥ':'th','ದ':'d','ಧ':'dh','ನ':'n','ಪ':'p','ಫ':'ph','ಬ':'b','ಭ':'bh','ಮ':'m','ಯ':'y','ರ':'r','ಱ':'r','ಲ':'l','ವ':'v','ಶ':'sh','ಷ':'sh','ಸ':'s','ಹ':'h','ಳ':'l'}
const signs={'ಾ':'a','ಿ':'i','ೀ':'i','ು':'u','ೂ':'u','ೃ':'ru','ೄ':'ru','ೆ':'e','ೇ':'e','ೈ':'ai','ೊ':'o','ೋ':'o','ೌ':'au'}
const digits={'೦':'0','೧':'1','೨':'2','೩':'3','೪':'4','೫':'5','೬':'6','೭':'7','೮':'8','೯':'9'}
const flatten=value=>value==null?'':Array.isArray(value)?value.map(flatten).join(' '):typeof value==='object'?Object.values(value).map(flatten).join(' '):String(value)
const clean=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().replace(/[^a-z0-9ಀ-೿]+/g,' ').trim()

export function transliterateKannada(value=''){
  const chars=[...String(value).normalize('NFC')]
  let output=''
  for(let index=0;index<chars.length;index+=1){
    const char=chars[index]
    if(consonants[char]){
      const next=chars[index+1]
      output+=consonants[char]
      if(next==='್'){index+=1;continue}
      if(signs[next]!==undefined){output+=signs[next];index+=1;continue}
      output+='a';continue
    }
    if(char==='ಂ'){
      output+=/[ಪಫಬಭಮ]/.test(chars[index+1]||'')?'m':'n'
      continue
    }
    output+=vowels[char]??digits[char]??(char==='ಃ'?'h':char)
  }
  return output
}

export const searchKeys=value=>{
  const text=flatten(value)
  return [...new Set([clean(text),clean(transliterateKannada(text))].filter(Boolean))]
}

export const buildSearchText=value=>searchKeys(value).join(' ')
export const matchesSearch=(searchText,query)=>{const keys=searchKeys(query);return !keys.length||keys.some(key=>searchText.includes(key))}
