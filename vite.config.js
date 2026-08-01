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

export default defineConfig({
  plugins: [react(),peopleSeedPlugin],
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
