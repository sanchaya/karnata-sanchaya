// Sahitya Akademi awards for Kannada, 1955 to 2025, from the owner-supplied file src/data/imports/sahitya-akademi-kannada.csv
// (rows read by scripts/import-sahitya-akademi.mjs). The festival columns record whether a winner was matched, by name, to a speaker list
// of five literature festivals; they are the file's own analysis, not part of the award, and are not reviewed.
// `authorId` links a winner to a card on the Poets and writers page; it is set only where the person is clearly the same one.
import { sahityaAkademiRows } from './sahitya-akademi-kannada.generated.js'

export const AWARD_KINDS=['Main award','Translation','Bhasha Samman','Bala Sahitya Puraskar','Yuva Puraskar']
export const AWARD_KIND_LABELS={
  'Main award':{en:'Main award',kn:'ಮುಖ್ಯ ಪ್ರಶಸ್ತಿ'},
  Translation:{en:'Translation',kn:'ಅನುವಾದ'},
  'Bhasha Samman':{en:'Bhasha Samman',kn:'ಭಾಷಾ ಸಮ್ಮಾನ್'},
  'Bala Sahitya Puraskar':{en:'Bala Sahitya Puraskar (children’s literature)',kn:'ಬಾಲ ಸಾಹಿತ್ಯ ಪುರಸ್ಕಾರ'},
  'Yuva Puraskar':{en:'Yuva Puraskar (young writers)',kn:'ಯುವ ಪುರಸ್ಕಾರ'},
}
const AUTHOR_OF={
  'Kuvempu':'kuvempu','D. R. Bendre':'bendre','K. Shivaram Karanth':'karanth','V. K. Gokak':'gokak','D. V. Gundappa':'dvg',
  'Masti Venkatesha Iyengar':'masti','Gopalakrishna Adiga':'adiga','S. L. Bhyrappa':'bhyrappa','K. S. Narasimhaswamy':'narasimhaswamy',
  'Chennaveera Kanavi':'kanavi','Yashwant Chittal':'chittal','G. S. Shivarudrappa':'shivarudrappa','K. P. Poornachandra Tejaswi':'tejaswi',
  'P. Lankesh':'lankesh','Devanur Mahadeva':'devanur-mahadeva','Chandrashekhara Kambara':'kambara','Girish Karnad':'karnad',
  'Vaidehi':'vaidehi','Shantinath Desai':'shantinath-desai',
}
export const sahityaAkademiAwards=sahityaAkademiRows.map((row,i)=>({id:`sahitya-akademi-kannada-${i+1}`,...row,...(AUTHOR_OF[row.winner]?{authorId:AUTHOR_OF[row.winner]}:{}),review:{status:'needs-review'}}))
export const awardsByAuthorId=sahityaAkademiAwards.reduce((map,a)=>{if(a.authorId)(map[a.authorId]||(map[a.authorId]=[])).push(a);return map},{})
