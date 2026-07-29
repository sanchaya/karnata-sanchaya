const SHELL_CACHE = 'karnataka-atlas-shell-v1'
const TILE_CACHE = 'karnataka-atlas-tiles-v1'
const SHELL_ASSETS = ['./', './index.html', './site.webmanifest', './sanchaya-logo.png', './karnataka-districts.geojson']

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => ![SHELL_CACHE, TILE_CACHE].includes(key)).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})

const networkFirst = request => fetch(request).then(response => {
  if (response.ok) caches.open(SHELL_CACHE).then(cache => cache.put(request, response.clone()))
  return response
}).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))

const cacheFirst = request => caches.match(request).then(cached => cached || fetch(request).then(response => {
  if (response.ok || response.type === 'opaque') caches.open(TILE_CACHE).then(cache => cache.put(request, response.clone()))
  return response
}))

self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.hostname === 'tile.openstreetmap.org' || url.hostname.endsWith('.tile.openstreetmap.org')) {
    event.respondWith(cacheFirst(request))
    return
  }
  if (url.origin === self.location.origin && !url.pathname.includes('/api/')) event.respondWith(networkFirst(request))
})
