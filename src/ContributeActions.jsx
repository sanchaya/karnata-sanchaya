export default function ContributeActions({recordId,recordType,name,locale='kn'}){
  const link=action=>{const params=new URLSearchParams(window.location.search);params.set('contributeTarget',recordId);params.set('contributeType',recordType);params.set('contributeName',name||recordId);params.set('contributeAction',action);return `${window.location.pathname}?${params}#contribute`}
  const kn=locale==='kn'
  return <div className="record-contribute-actions"><strong>{kn?'ಈ ದಾಖಲೆಯನ್ನು ಉತ್ತಮಗೊಳಿಸಿ':'Improve this record'}</strong><div><a href={link('correction')}>{kn?'ತಿದ್ದುಪಡಿ ಸೂಚಿಸಿ':'Suggest correction'}</a><a href={link('source')}>{kn?'ಆಕರ ಸೇರಿಸಿ':'Add source'}</a></div></div>
}
