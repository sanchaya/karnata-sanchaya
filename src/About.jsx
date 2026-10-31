import {useEffect,useRef,useState} from 'react'
import {ATLAS_RELEASE_VERSION} from './data/atlas.js'

const RAZORPAY_BUTTON_ID='pl_FTB1pZqrFP6jrt'
const BANKS=[{bank:'SBI, Channasandra Branch',account:'34546182259',ifsc:'SBIN0017780'},{bank:'HDFC Bank',account:'50200074723594',ifsc:'HDFC0004178'}]

const copy={
  kn:{
    eyebrow:'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಭೂಪಟ · ನಮ್ಮ ಬಗ್ಗೆ',
    title:'ಕನ್ನಡ-ಪ್ರಥಮ ಸಾರ್ವಜನಿಕ ಇತಿಹಾಸ ಸಂಶೋಧನಾ ವೇದಿಕೆ',
    tagline:'ಒಂದು ನಕ್ಷೆ. ಒಂದು ಕಾಲರೇಖೆ. ಹಲವು ಸಾಕ್ಷ್ಯ ರೂಪಗಳು.',
    intro:'ಕರ್ನಾಟಕದ ರಾಜ್ಯಗಳು, ಜನರು, ಶಾಸನಗಳು, ಸಾಹಿತ್ಯ, ಸ್ಮಾರಕಗಳು, ಯುದ್ಧಗಳು ಮತ್ತು ಜಾಗತಿಕ ಸಂಬಂಧಗಳನ್ನು ಕಾಲರೇಖೆ, ಭೂಪಟ ಮತ್ತು ಪರಿಶೀಲಿಸಬಹುದಾದ ಆಕರಗಳ ಮೂಲಕ ಒಟ್ಟಿಗೆ ಅನ್ವೇಷಿಸುವ ಸಂಚಯದ ದೀರ್ಘಕಾಲಿಕ ಡಿಜಿಟಲ್ ಯೋಜನೆ.',
    purposeTitle:'ನಮ್ಮ ಉದ್ದೇಶ',purpose:'ವಿದ್ಯಾರ್ಥಿಗಳು, ಶಿಕ್ಷಕರು, ಸಂಶೋಧಕರು, ಇತಿಹಾಸಕಾರರು ಮತ್ತು ಸಾರ್ವಜನಿಕರಿಗೆ ವಿಶ್ವಾಸಾರ್ಹ, ದ್ವಿಭಾಷಾ ಮತ್ತು ಪರಸ್ಪರ ಸಂಪರ್ಕಿತ ಕರ್ನಾಟಕ ಇತಿಹಾಸದ ಪ್ರವೇಶವನ್ನು ಕಲ್ಪಿಸುವುದು.',
    methodTitle:'ಸಂಶೋಧನಾ ವಿಧಾನ',method:'ಪ್ರತಿ ದಾಖಲೆಗೆ ಸ್ಥಿರ ID, ದಿನಾಂಕ ಮತ್ತು ಸ್ಥಳ ನಿಖರತೆ, ಆಕರ ಉಲ್ಲೇಖ ಮತ್ತು ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ ಇರುತ್ತದೆ. ಪ್ರತಿ ಆಕರವನ್ನು ಅದರ ಸ್ವರೂಪದಿಂದ (ಪ್ರಾಧಿಕಾರ, ವಿದ್ವಾಂಸರ ಸಂಶೋಧನೆ, ವಿಶ್ವಕೋಶ, ಮಾಧ್ಯಮ, ಸಮುದಾಯ, ಉಲ್ಲೇಖ) ವರ್ಗೀಕರಿಸಲಾಗುತ್ತದೆ; ಇದು ಪರಿಶೀಲನೆ ಅಲ್ಲ, ಮೂಲದ ಸಾಮಾನ್ಯ ಸ್ವರೂಪದ ಸೂಚನೆ. ಪರಿಶೀಲನೆ ಬಾಕಿ ದಾಖಲೆಗಳು ಸಾರ್ವಜನಿಕ ಸಂಶೋಧನಾ ಸುಳಿವುಗಳಾಗಿ ಸ್ಪಷ್ಟ ಗುರುತಿನೊಂದಿಗೆ ಕಾಣುತ್ತವೆ.',
    languageTitle:'ಕನ್ನಡ ಮೊದಲು',language:'ಕನ್ನಡವು ಪ್ರಧಾನ ಅನುಭವ. ಇಂಗ್ಲಿಷ್ ಪೂರಕ ಸಂಶೋಧನಾ ಭಾಷೆಯಾಗಿ ಉಳಿಯುತ್ತದೆ. ಮೂಲ ಪಾಠ, ಅನುವಾದ ಮತ್ತು ಸ್ಥಳನಾಮಗಳ ಕನ್ನಡ ಗುಣಮಟ್ಟಕ್ಕೆ ಸ್ವತಂತ್ರ ವಿಮರ್ಶೆ ಅಗತ್ಯ.',
    stewardshipTitle:'ನಿರ್ವಹಣೆ ಮತ್ತು ಸಹಯೋಗ',stewardship:'ಸಂಚಯ ಈ ವೇದಿಕೆಯ ತಾಂತ್ರಿಕ ಮತ್ತು ಸಮುದಾಯ ನಿರ್ವಹಣೆಯನ್ನು ಮುನ್ನಡೆಸುತ್ತದೆ. ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು, ಇತಿಹಾಸ ಸಂಸ್ಥೆಗಳು, ಕ್ಷೇತ್ರ ಸಂಶೋಧಕರು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಜ್ಞಾನ ಯೋಜನೆಗಳ ಸಹಯೋಗವನ್ನು ಸ್ವಾಗತಿಸಲಾಗುತ್ತದೆ.',
    explore:'ಆಕರಗಳು ಮತ್ತು ಸಹಯೋಗಗಳು',evidence:'ಸಾಕ್ಷ್ಯ ಕಾರ್ಯವಿಧಾನ',contribute:'ಕೊಡುಗೆ ನೀಡಿ',sanchaya:'ಸಂಚಯದ ಬಗ್ಗೆ ಇನ್ನಷ್ಟು',
    initiativeBy:'ಸಂಚಯದ ಯೋಜನೆ',inCollab:'ಸಹಯೋಗ',copy:'ನಕಲಿಸಿ',copied:'ನಕಲಿಸಲಾಗಿದೆ',
    donateTitle:'ಈ ಕೆಲಸವನ್ನು ಬೆಂಬಲಿಸಿ',donateIntro:'ಸಂಚಯದ ಯೋಜನೆಗಳು 2011 ರಿಂದ ಸ್ವಯಂಸೇವಕರ ಶ್ರಮದಿಂದ ನಡೆಯುತ್ತಿವೆ. ಸಂಚಿ ಫೌಂಡೇಶನ್ ಮೂಲಕ ನೀಡುವ ದೇಣಿಗೆಗಳಿಗೆ 80G ಆದಾಯ ತೆರಿಗೆ ವಿನಾಯಿತಿ ಇದೆ.',donateOnline:'ಆನ್‌ಲೈನ್ ದೇಣಿಗೆ',donateBank:'ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ',accountName:'ಖಾತೆ ಹೆಸರು',accountNo:'ಖಾತೆ ಸಂಖ್ಯೆ',ifsc:'IFSC',donateMore:'ಹೆಚ್ಚಿನ ಆಯ್ಕೆಗಳು (ಚೆಕ್ ಮತ್ತು ಇತರೆ)'
  },
  en:{
    eyebrow:'Karnataka Historical Atlas · About',
    title:'A Kannada-first public history research platform',
    tagline:'One map. One timeline. Many forms of evidence.',
    intro:'A long-term Sanchaya initiative connecting Karnataka’s kingdoms, people, inscriptions, literature, monuments, wars and global relations through timelines, maps and reviewable sources.',
    purposeTitle:'Purpose',purpose:'Give students, teachers, researchers, historians and the public trustworthy, bilingual and interconnected access to Karnataka history.',
    methodTitle:'Research method',method:'Every record carries a stable ID, date and geographic precision, citations and a review status. Each source is classified by its character — authority, scholarly research, encyclopedic, media, community or reference; a tier describes the general character of a source, not verification. Pending records remain visible as clearly marked public research leads.',
    languageTitle:'Kannada first',language:'Kannada is the primary experience, with English as a supporting research language. Original texts, translations and Kannada place names require independent review.',
    stewardshipTitle:'Stewardship and collaboration',stewardship:'Sanchaya leads the platform’s technical and community stewardship. Collaborations with universities, history organisations, field researchers and public-knowledge projects are welcome.',
    explore:'Resources & collaborations',evidence:'Evidence workflow',contribute:'Contribute',sanchaya:'Learn more about Sanchaya',
    initiativeBy:'A Sanchaya initiative',inCollab:'In collaboration with',copy:'Copy',copied:'Copied',
    donateTitle:'Support this work',donateIntro:'Sanchaya’s projects have run on volunteer effort since 2011. Donations made through Sanchi Foundation receive 80G income tax exemption.',donateOnline:'Donate online',donateBank:'Bank transfer',accountName:'Account name',accountNo:'Account number',ifsc:'IFSC',donateMore:'More ways to give (cheque and others)'
  }
}

function RazorpayButton(){
  const form=useRef(null)
  useEffect(()=>{
    const node=form.current;if(!node)return
    const script=document.createElement('script')
    script.src='https://checkout.razorpay.com/v1/payment-button.js'
    script.async=true
    script.dataset.payment_button_id=RAZORPAY_BUTTON_ID
    node.appendChild(script)
    return()=>{node.replaceChildren()}
  },[])
  return <form ref={form} className="donate-razorpay"></form>
}

function CopyValue({value,label,t}){
  const [done,setDone]=useState(false)
  const copy=async()=>{try{await navigator.clipboard.writeText(value);setDone(true);setTimeout(()=>setDone(false),1600)}catch{/* clipboard blocked: the value stays selectable */}}
  return <span className="donate-value"><b>{value}</b><button type="button" onClick={copy} aria-label={`${t.copy}: ${label}`}>{done?t.copied:t.copy}</button></span>
}

export default function About({locale}){
  const t=copy[locale]||copy.kn
  const base=import.meta.env.BASE_URL
  const pillars=[[t.purposeTitle,t.purpose],[t.methodTitle,t.method],[t.languageTitle,t.language],[t.stewardshipTitle,t.stewardship]]
  return <main className="about-page portal-page" id="about">
    <section className="about-hero">
      <div className="about-hero-copy">
        <p className="eyebrow">{t.eyebrow} · v{ATLAS_RELEASE_VERSION}</p>
        <h2>{t.title}</h2>
        <p className="about-tagline">{t.tagline}</p>
        <p>{t.intro}</p>
        <div className="about-actions"><a href="#contribute" className="primary-link">{t.contribute}</a><a href="#research">{t.explore}</a><a href="#evidence">{t.evidence}</a></div>
      </div>
      <aside className="about-stewards" aria-label={t.stewardshipTitle}>
        <a href="https://sanchaya.org/" target="_blank" rel="noreferrer"><img src={`${base}sanchaya-logo.png`} alt="Sanchaya" width="56" height="56"/><span><small>{t.initiativeBy}</small><b>sanchaya.org ↗</b></span></a>
        <a href="https://sanchifoundation.org/" target="_blank" rel="noreferrer"><img src={`${base}sanchi-foundation-logo.png`} alt="Sanchi Foundation" width="112" height="50"/><span><small>{t.inCollab}</small><b>sanchifoundation.org ↗</b></span></a>
      </aside>
    </section>
    <section className="about-pillars">{pillars.map(([title,body],index)=><article key={title} className={`pillar-${index+1}`}><span aria-hidden="true">0{index+1}</span><h3>{title}</h3><p>{body}</p></article>)}</section>
    <section className="donate-section" aria-labelledby="donate-title">
      <div className="donate-intro"><h3 id="donate-title">{t.donateTitle}</h3><p>{t.donateIntro}</p><a href="https://sanchaya.org/support-us/" target="_blank" rel="noreferrer">{t.donateMore} ↗</a></div>
      <div className="donate-grid">
        <article className="donate-online"><h4>{t.donateOnline}</h4><RazorpayButton/></article>
        {BANKS.map(item=><article key={item.ifsc}><h4>{t.donateBank} · {item.bank}</h4><dl><div><dt>{t.accountName}</dt><dd>Sanchi Foundation ®</dd></div><div><dt>{t.accountNo}</dt><dd><CopyValue value={item.account} label={t.accountNo} t={t}/></dd></div><div><dt>{t.ifsc}</dt><dd><CopyValue value={item.ifsc} label={t.ifsc} t={t}/></dd></div></dl></article>)}
      </div>
    </section>
  </main>
}
