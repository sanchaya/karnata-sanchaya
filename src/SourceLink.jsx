import { Fragment } from 'react'

export const isWikipediaUrl=url=>typeof url==='string'&&/wikipedia\.org/i.test(url)

export default function SourceLink({href,label,locale='en',className=''}){
  const wikipedia=isWikipediaUrl(href)
  return <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={wikipedia?`${locale==='kn'?'ವಿಕಿಪೀಡಿಯ ತೆರೆಯಿರಿ':'Open Wikipedia'}: ${label}`:label} title={wikipedia?`${locale==='kn'?'ವಿಕಿಪೀಡಿಯ':'Wikipedia'} · ${label}`:label}>{wikipedia?<span className="wikipedia-mark" aria-hidden="true">W</span>:<>{label} ↗</>}</a>
}
