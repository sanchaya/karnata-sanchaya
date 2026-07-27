import { unlink, writeFile } from 'node:fs/promises'

const raw=process.env.PUBLIC_SITE_URL?.trim()
if(raw){
  const siteUrl=new URL(raw.endsWith('/')?raw:`${raw}/`).href
  const today=new Date().toISOString().slice(0,10)
  const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n`
  await writeFile(new URL('../public/sitemap.xml',import.meta.url),sitemap)
  await writeFile(new URL('../public/robots.txt',import.meta.url),`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`)
  console.log(`SEO sitemap generated for ${siteUrl}`)
}else{
  await unlink(new URL('../public/sitemap.xml',import.meta.url)).catch(()=>{})
  await writeFile(new URL('../public/robots.txt',import.meta.url),'User-agent: *\nAllow: /\n')
  console.log('PUBLIC_SITE_URL is not set; keeping portable canonical metadata and omitting an environment-specific sitemap.')
}
