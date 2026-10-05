const SHELL_CACHE = 'karnataka-atlas-shell-v4'
const TILE_CACHE = 'karnataka-atlas-tiles-v2'
const DATA_CACHE = 'karnataka-atlas-readonly-data-v3'
const SHELL_ASSETS = ['./', './index.html', './site.webmanifest', './sanchaya-logo.png', './karnataka-districts.geojson']

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => ![SHELL_CACHE, TILE_CACHE, DATA_CACHE].includes(key)).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})

const cacheResponse = async (cacheName, request, response, cacheable) => {
  if (!cacheable) return response
  // Clone before awaiting cache access: the browser may otherwise consume the
  // response body while the cache is opening, making Response.clone() throw.
  const copy = response.clone()
  try {
    const cache = await caches.open(cacheName)
    await cache.put(request, copy)
  } catch {
    // A cache quota/write failure must never make a successful network
    // response unavailable to the map or application shell.
  }
  return response
}

const networkFirst = async request => {
  try {
    const response = await fetch(request,{cache:request.mode === 'navigate' ? 'reload' : 'no-cache'})
    return cacheResponse(SHELL_CACHE, request, response, response.ok)
  } catch {
    return (await caches.match(request)) || caches.match('./index.html')
  }
}

const cacheFirst = async request => {
  const cached = await caches.match(request)
  if (cached) return cached
  const response = await fetch(request)
  return cacheResponse(TILE_CACHE, request, response, response.ok || response.type === 'opaque')
}

const liveDataset = async request => {
  try {
    const response = await fetch(request)
    return cacheResponse(DATA_CACHE, request, response, response.ok)
  } catch {
    const cache = await caches.open(DATA_CACHE)
    return (await cache.match(request)) || new Response(JSON.stringify({error:'Live dataset is unavailable.'}),{status:503,headers:{'Content-Type':'application/json'}})
  }
}

self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin === self.location.origin && url.pathname.endsWith('/api/dataset')) {
    event.respondWith(liveDataset(request))
    return
  }
  if (url.hostname === 'tile.openstreetmap.org' || url.hostname.endsWith('.tile.openstreetmap.org')) {
    event.respondWith(cacheFirst(request))
    return
  }
  if (url.origin === self.location.origin && !url.pathname.includes('/api/')) event.respondWith(networkFirst(request))
})
