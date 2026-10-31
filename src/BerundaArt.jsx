import { useId } from 'react'

// Berunda in a watercolour style, drawn as SVG: translucent washes with wobbly, bleeding edges (turbulence displacement),
// darker pigment pooled at the rims, and a faint paper grain. Crimson, saffron and indigo follow the Gandaberunda emblem.
export default function BerundaArt({ size = 96, paper = false, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const wash = `wash${uid}`
  const bleed = `bleed${uid}`
  const grain = `grain${uid}`
  const half = `half${uid}`

  return (
    <svg className={className} viewBox="0 0 200 200" width={size} height={size} aria-hidden="true" focusable="false">
      <defs>
        {/* Wobbly edge plus a softened copy: the pigment looks like it has soaked into paper. */}
        <filter id={wash} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" result="wobble" />
          <feGaussianBlur in="wobble" stdDeviation="0.7" />
        </filter>
        <filter id={bleed} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="G" yChannelSelector="R" result="wobble" />
          <feGaussianBlur in="wobble" stdDeviation="3.2" />
        </filter>
        <filter id={grain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="speckle" />
          <feColorMatrix in="speckle" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0.35 0" />
        </filter>
        <g id={half}>
          {/* wing: outer crimson wash, inner saffron feathers */}
          <path d="M97 112C62 122 24 96 10 40c20 22 36 25 47 18-5 20 10 31 27 27-4 14 6 24 17 24z" fill="#c0392b" fillOpacity="0.62" />
          <path d="M96 106C70 112 44 98 30 66c14 12 26 14 35 10-2 12 8 20 20 17-1 8 4 13 11 13z" fill="#f4b41a" fillOpacity="0.7" />
          <path d="M92 100C78 100 62 92 52 78" fill="none" stroke="#7a1f1f" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
          {/* neck and head */}
          <path d="M97 98C86 90 80 78 80 66c0-4 12-4 14 6 2 10 2 18 6 26z" fill="#f4b41a" fillOpacity="0.8" />
          <circle cx="72" cy="58" r="15" fill="#f6c33b" fillOpacity="0.85" />
          <path d="M59 52C46 52 36 58 33 72c10-5 18-5 28-3z" fill="#c0392b" fillOpacity="0.78" />
          <path d="M66 44c-3-7-1-13 6-16-1 6 1 9 5 12-4 0-7 2-11 4z" fill="#c0392b" fillOpacity="0.7" />
          <circle cx="68" cy="54" r="2.4" fill="#2b1d0e" />
          {/* tail feather, indigo wash */}
          <path d="M96 150c-14 12-28 26-34 44 18-4 30-14 36-28z" fill="#2c3e91" fillOpacity="0.55" />
          {/* claw */}
          <path d="M90 148c-4 10-6 18-6 24m5-24c-1 9-1 17 1 24m4-24c2 8 4 15 8 20" fill="none" stroke="#7a4a12" strokeOpacity="0.7" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </defs>
      {paper && <rect width="200" height="200" fill="#fbf3dd" />}
      {paper && <rect width="200" height="200" filter={`url(#${grain})`} opacity="0.6" />}
      {/* pooled pigment halo, then crisp wobbly layer */}
      <g filter={`url(#${bleed})`} opacity="0.55">
        <use href={`#${half}`} />
        <use href={`#${half}`} transform="translate(200 0) scale(-1 1)" />
      </g>
      <g filter={`url(#${wash})`}>
        <ellipse cx="100" cy="124" rx="21" ry="34" fill="#f4b41a" fillOpacity="0.85" />
        <use href={`#${half}`} />
        <use href={`#${half}`} transform="translate(200 0) scale(-1 1)" />
        <path d="M100 98v54" stroke="#c0392b" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* loose ink line work, as if added after the washes dried */}
      <g fill="none" stroke="#3b1f12" strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M73 43c-4-6-3-11 3-14M127 43c4-6 3-11-3-14" />
        <path d="M82 100c9 6 27 6 36 0" />
      </g>
    </svg>
  )
}
