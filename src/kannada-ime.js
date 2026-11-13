import $ from 'jquery'

let loadPromise

const registerAtlasKannada=()=>{
  if($.ime.inputmethods['kn-atlas-transliteration'])return
  $.ime.register({
    id:'kn-atlas-transliteration',
    name:'ಕನ್ನಡ ಲಿಪ್ಯಂತರಣ',
    description:'Kannada phonetic transliteration for Karnataka Historical Atlas games',
    date:'2026-11-13',
    author:'Sanchaya',
    license:'MIT',
    version:'1.0',
    contextLength:4,
    maxKeyLength:2,
    patterns:[
      ['ಕ್h','ಖ್'],['ಗ್h','ಘ್'],['ಚ್h','ಛ್'],['ಜ್h','ಝ್'],['ಟ್h','ಠ್'],['ಡ್h','ಢ್'],['ತ್h','ಥ್'],['ದ್h','ಧ್'],['ಪ್h','ಫ್'],['ಬ್h','ಭ್'],['ಸ್h','ಶ್'],['ಶ್h','ಷ್'],
      ['([ಕ-ಹಳಱ])್a','$1'],['([ಕ-ಹಳಱ])a','$1ಾ'],['([ಕ-ಹಳಱ])್i','$1ಿ'],['([ಕ-ಹಳಱ])ಿi','$1ೀ'],['([ಕ-ಹಳಱ])್u','$1ು'],['([ಕ-ಹಳಱ])ುu','$1ೂ'],['([ಕ-ಹಳಱ])್e','$1ೆ'],['([ಕ-ಹಳಱ])ೆe','$1ೇ'],['([ಕ-ಹಳಱ])್o','$1ೊ'],['([ಕ-ಹಳಱ])ೊo','$1ೋ'],
      ['ಅa','ಆ'],['ಇi','ಈ'],['ಉu','ಊ'],['ಎe','ಏ'],['ಒo','ಓ'],
      ['a','ಅ'],['i','ಇ'],['u','ಉ'],['e','ಎ'],['o','ಒ'],
      ['k','ಕ್'],['g','ಗ್'],['c','ಚ್'],['j','ಜ್'],['T','ಟ್'],['D','ಡ್'],['N','ಣ್'],['t','ತ್'],['d','ದ್'],['n','ನ್'],['p','ಪ್'],['b','ಬ್'],['m','ಮ್'],['y','ಯ್'],['r','ರ್'],['l','ಲ್'],['v','ವ್'],['w','ವ್'],['s','ಸ್'],['h','ಹ್'],['L','ಳ್'],['S','ಶ್'],['f','ಫ್'],['M','ಂ'],['H','ಃ'],
      ['0','೦'],['1','೧'],['2','೨'],['3','೩'],['4','೪'],['5','೫'],['6','೬'],['7','೭'],['8','೮'],['9','೯'],
    ],
  })
}

export const loadKannadaIme=()=>{
  if(!loadPromise){
    window.$=window.jQuery=$
    loadPromise=import('jquery.ime').then(()=>{registerAtlasKannada();return $})
  }
  return loadPromise
}

export const attachKannadaIme=async element=>{
  const jquery=await loadKannadaIme(),input=jquery(element)
  input.ime({showSelector:false,languages:['kn']})
  const ime=input.data('ime')
  ime.setLanguage('kn')
  ime.setIM('kn-atlas-transliteration')
  ime.enable()
  return {enable:()=>ime.enable(),disable:()=>ime.disable(),destroy:()=>ime.destroy()}
}
