import { useState } from 'react'

const guides={
  kn:[
    ['ವಿದ್ಯಾರ್ಥಿ / ಸಾರ್ವಜನಿಕರು','ಅಟ್ಲಸ್ ಅನ್ವೇಷಿಸಿ, ಆಕರಗಳನ್ನು ಓದಿ, ನಂತರ ಉಲ್ಲೇಖದೊಂದಿಗೆ ತಿದ್ದುಪಡಿ ಅಥವಾ ಹೊಸ ದಾಖಲೆ ಸೂಚಿಸಿ.'],
    ['ಶಿಕ್ಷಕರು / ಅಧ್ಯಾಪಕರು','ತರಗತಿಗೆ ಹಂಚಬಹುದಾದ ಭೂಪಟ ನೋಟ ಬಳಸಿ; ವಿದ್ಯಾರ್ಥಿಗಳ ಸಂಶೋಧನೆಯನ್ನು ಜಿಲ್ಲೆ ಅಥವಾ ವಿಷಯದ ಅಭಿಯಾನಕ್ಕೆ ಜೋಡಿಸಿ.'],
    ['ಸಂಶೋಧಕರು / ಕೊಡುಗೆದಾರರು','ಸ್ಥಿರ ID, ನಿಖರ ಸ್ಥಳ, ದಿನಾಂಕದ ಖಚಿತತೆ ಮತ್ತು ಪುಟ/ಶಾಸನ ಸಂಖ್ಯೆಯಿರುವ ಆಕರದೊಂದಿಗೆ ಕರಡು ಸಲ್ಲಿಸಿ.'],
    ['ಪರಿಶೀಲಕರು','ಸಲ್ಲಿಕೆಯ ಮೂಲ, ದಾವೆ ಮತ್ತು ಕನ್ನಡ ಅನುವಾದವನ್ನು ಸ್ವತಂತ್ರವಾಗಿ ಪರಿಶೀಲಿಸಿ; ಅನುಮೋದಿಸಿ, ತಿದ್ದುಪಡಿ ಕೇಳಿ ಅಥವಾ ತಿರಸ್ಕರಿಸಿ.'],
    ['ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿ','ಸಂಸ್ಥೆಯ ಗುರುತಿನ ವಿನಂತಿಗಳನ್ನು ಖಾಸಗಿಯಾಗಿ ಪರಿಶೀಲಿಸಿ; ಅಗತ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ ಉಳಿಸಬೇಡಿ.'],
    ['ನಿರ್ವಾಹಕರು','ಖಾತೆಗಳನ್ನು ಅನುಮೋದಿಸಿ, ಪಾತ್ರಗಳನ್ನು ನೇಮಿಸಿ, ಅಭಿಯಾನ/ಆಮದುಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಪರಿಶೀಲಿತ ಪರಿಷ್ಕರಣೆಯನ್ನು ಮಾತ್ರ ಪ್ರಕಟಿಸಿ.'],
  ],
  en:[
    ['Student / public','Explore the atlas and its sources, then suggest a correction or new record with a citation.'],
    ['Teacher / faculty','Share a map view in class and connect student research to a district or subject campaign.'],
    ['Researcher / contributor','Submit a draft with stable IDs, precise location, date certainty and page or inscription locators.'],
    ['Reviewer','Independently check the source, claim and Kannada translation; approve, request changes or reject.'],
    ['Verification officer','Privately assess institutional verification requests and retain no unnecessary personal data.'],
    ['Administrator','Approve accounts, appoint roles, manage campaigns/imports and publish only reviewed revisions.'],
  ],
}

export default function CommunityUserGuide({locale='kn'}){
  const [active,setActive]=useState(0),items=guides[locale]||guides.kn
  return <section className="community-role-guide" aria-labelledby="community-guide-title"><div><p className="eyebrow">{locale==='kn'?'ಬಳಕೆದಾರ ಮಾರ್ಗದರ್ಶಿ':'User guide'}</p><h3 id="community-guide-title">{locale==='kn'?'ನಿಮ್ಮ ಪಾತ್ರಕ್ಕೆ ತಕ್ಕಂತೆ ಆರಂಭಿಸಿ':'Start with your role'}</h3><p>{locale==='kn'?'ಖಾತೆ ಅನುಮೋದನೆಯ ನಂತರ ಕೊಡುಗೆ ಕಾರ್ಯಕ್ಷೇತ್ರ ತೆರೆಯುತ್ತದೆ. ಪ್ರಕಟಣೆಗೆ ಪ್ರತಿಯೊಂದು ದಾಖಲೆಯೂ ಮಾನವ ಪರಿಶೀಲನೆಗೊಳಗಾಗುತ್ತದೆ.':'The contribution workspace opens after account approval. Every record is human-reviewed before publication.'}</p></div><div className="community-guide-tabs" role="tablist" aria-label={locale==='kn'?'ಬಳಕೆದಾರ ಪಾತ್ರಗಳು':'User roles'}>{items.map(([title],index)=><button key={title} role="tab" aria-selected={active===index} className={active===index?'active':''} onClick={()=>setActive(index)}>{title}</button>)}</div><article><strong>{items[active][0]}</strong><p>{items[active][1]}</p></article><a href="https://github.com/sanchaya/karnata-sanchaya/blob/main/docs/user-guide.md" target="_blank" rel="noreferrer">{locale==='kn'?'ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ ಓದಿ ↗':'Read the complete guide ↗'}</a></section>
}
