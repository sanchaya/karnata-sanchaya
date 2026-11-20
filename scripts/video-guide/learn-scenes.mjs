// The English explainer for people who read English and want to learn about Kannada and Karnataka:
// node scripts/video-guide/record.mjs learn <outDir>. Each scene is spoken (`say`), and its length is
// the longer of `secs` and the narration. Narration states only what the pages do; keep it that way when editing.
const scroll = async (page, steps = 3, gap = 1800) => { for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 380); await page.waitForTimeout(gap) } }
const wait = ms => page => page.waitForTimeout(ms)

export const learnScenes = [
  { id: 'atlas', hash: 'atlas', secs: 16,
    en: 'The Karnataka Historical Atlas is a free guide to the history, heritage and language of Karnataka, built by the Sanchaya community. Start with the map. Drag the timeline, and the kingdoms and records change from century to century.',
    run: async page => { await page.waitForTimeout(2500); const slider = page.locator('input[type=range]').first(); if (await slider.count()) for (const year of [500, 900, 1300, 1700]) { await slider.fill(String(year)).catch(() => {}); await page.waitForTimeout(2600) } } },
  { id: 'who-ruled', hash: 'who-ruled', secs: 12,
    en: 'Wondering who ruled a place you know? Click it, and see which dynasties held it, century by century, with the records behind each claim.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 2, 2500) } },
  { id: 'epigraphy', hash: 'epigraphy', secs: 12,
    en: 'Inscriptions are the backbone of the atlas. Browse them on the map. Every record is marked reviewed or awaiting review, so you always know how far to trust it.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 2, 2500) } },
  { id: 'scripts', hash: 'scripts', secs: 10,
    en: 'To see how Kannada writing itself changed, open Scripts, and follow the letters from the earliest inscriptions to the script we read today.',
    run: async page => { await page.waitForTimeout(2000); await scroll(page, 2, 2200) } },
  { id: 'aata-paata', hash: 'aata-paata', secs: 16,
    en: 'Prefer to learn by playing? Aata-Paata has word games, a year grid, crosswords, map pinning, and dynasty, script and species games, all made from the atlas records. Everything works in English and in Kannada, so you pick up Kannada words as you play.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 2, 3000) } },
  { id: 'people', hash: 'people', secs: 10,
    en: 'Meet the people behind the history: rulers, queens, poets, scholars, soldiers and working people, each placed in time and on the map.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 2, 2200) } },
  { id: 'species', hash: 'species', secs: 10,
    en: 'Birds, animals and plants of Karnataka are listed with Kannada names collected from readers. If you know a name that is missing, you can suggest it.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 2, 2200) } },
  { id: 'recreation', hash: 'recreation', secs: 14,
    en: 'Under Experience, the games page lists games played in Karnataka across the centuries, with a map. Each entry says whether it was read in a book, only named, or known by word of mouth.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 2, 2800) } },
  { id: 'food', hash: 'food', secs: 12,
    en: 'Food culture covers recipes from the twelfth century Manasollasa, Mandya ragi mudde, festival and forest foods, each marked with how well it is sourced.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 2, 2600) } },
  { id: 'district-history', hash: 'district-history', secs: 10,
    en: 'The district pages gather local history and heritage district by district, and show where research is still missing.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 2, 2200) } },
  { id: 'about', hash: 'about', secs: 12,
    en: 'It is free, non-commercial and open to your corrections. Use Contribute to add a record or suggest a fix. Start exploring at karnata dot sanchaya dot net.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 1, 2500) } },
]
