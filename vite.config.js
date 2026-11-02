import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const peopleSeed=readFileSync(fileURLToPath(new URL('./server/seeds/wikimedia-people-candidates.json',import.meta.url)))
const peopleSeedPath='/data/wikimedia-people-candidates.json'
const peopleSeedPlugin={
  name:'atlas-readonly-seed-asset',
  configureServer(server){server.middlewares.use(peopleSeedPath,(req,res)=>{res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(peopleSeed)})},
  generateBundle(){this.emitFile({type:'asset',fileName:peopleSeedPath.slice(1),source:peopleSeed})},
}

// OSM only supports the canonical, non-sharded tile host. Keep older explorer
// modules working during the migration instead of shipping retired {s} URLs.
const osmTileEndpointPlugin={
  name:'atlas-supported-osm-tile-endpoint',
  transform(code,id){
    if(!id.includes('/src/')||!code.includes('https://{s}.tile.openstreetmap.org/'))return null
    return code.replaceAll('https://{s}.tile.openstreetmap.org/','https://tile.openstreetmap.org/')
  },
}

// Cloudflare's Rocket Loader rewrites and delays page scripts, which breaks ES-module apps with lazy chunks.
// A script marked data-cfasync="false" is left alone, so the opt-out lives in the build rather than a dashboard rule.
const cloudflareScriptOptOutPlugin={
  name:'atlas-cloudflare-script-opt-out',
  transformIndexHtml:{order:'post',handler:html=>html.replace(/<script(?![^>]*data-cfasync)([^>]*\ssrc=)/g,'<script data-cfasync="false"$1')},
}

// The live edition needs /api/dataset before it can render. Asking for it from the HTML head overlaps that request with the
// bundle download instead of waiting for the bundle to start it. Static and custom-API builds skip it.
const earlyDatasetPlugin={
  name:'atlas-early-dataset',
  transformIndexHtml:{order:'pre',handler:html=>process.env.VITE_STATIC_DATASET==='true'||process.env.VITE_COMMUNITY_API_URL?html:html.replace('</head>','    <script data-cfasync="false" src="/early-dataset.js"></script>\n  </head>')},
}

export default defineConfig({
  plugins: [react(),peopleSeedPlugin,osmTileEndpointPlugin,earlyDatasetPlugin,cloudflareScriptOptOutPlugin],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['techfiz.tplinkdns.com'],
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
})
