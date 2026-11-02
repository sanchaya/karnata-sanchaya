// Starts the live dataset request while the app bundle is still downloading; src/data/runtime.js picks the response up.
window.__atlasDataset = fetch('/api/dataset', { credentials: 'same-origin', headers: { Accept: 'application/json' } }).catch(() => null)
