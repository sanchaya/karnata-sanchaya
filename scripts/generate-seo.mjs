import { unlink, writeFile } from 'node:fs/promises'

// robots.txt for every build. The sitemap is written to dist/ by scripts/prerender-pages.mjs, because it lists every
// prerendered page. Search crawlers are welcome; AI-training crawlers are not (a project decision).
const aiCrawlerRules=`User-agent: GPTBot
Disallow: /
User-agent: CCBot
Disallow: /
User-agent: ClaudeBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: Bytespider
Disallow: /
User-agent: Amazonbot
Disallow: /
User-agent: meta-externalagent
Disallow: /
`
const mirror=process.env.VITE_STATIC_DATASET==='true'
const site=(process.env.CANONICAL_SITE_URL||'https://karnata.sanchaya.net/').replace(/\/?$/,'/')
// The static mirror points its canonicals at the main site and offers no sitemap of its own.
await writeFile(new URL('../public/robots.txt',import.meta.url),`User-agent: *\nAllow: /\n\n${aiCrawlerRules}${mirror?'':`\nSitemap: ${site}sitemap.xml\n`}`)
await unlink(new URL('../public/sitemap.xml',import.meta.url)).catch(()=>{})
console.log(mirror?'robots.txt written (static mirror: no sitemap; canonicals point at the main site).':`robots.txt written; the sitemap for ${site} is generated after the build.`)
