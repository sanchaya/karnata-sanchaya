import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
