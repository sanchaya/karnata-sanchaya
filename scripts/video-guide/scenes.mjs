// One list drives both videos: `short` is the 2-3 minute overview, `long` the full tour.
// secs = seconds on screen in that cut; a scene without `short` is left out of the overview.
// Narration is a draft for the voice-over; the Kannada needs a native speaker's proofreading before it is recorded.
const scroll = async (page, steps = 4, gap = 1400) => { for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 380); await page.waitForTimeout(gap) } }
const setYear = async (page, selector, years, gap = 1600) => { for (const year of years) { await page.locator(selector).first().fill(String(year)); await page.waitForTimeout(gap) } }

export const scenes = [
  { id: 'atlas', hash: 'atlas', secs: { short: 28, long: 40 },
    en: 'The atlas opens on the map of Karnataka. Drag the timeline at the bottom to move through the centuries, and the kingdoms and records on the map change with the year.',
    kn: 'ಅಟ್ಲಸ್ ಕರ್ನಾಟಕದ ನಕ್ಷೆಯೊಂದಿಗೆ ತೆರೆಯುತ್ತದೆ. ಕೆಳಗಿನ ಕಾಲರೇಖೆಯನ್ನು ಎಳೆದರೆ ಶತಮಾನಗಳು ಬದಲಾಗುತ್ತವೆ; ನಕ್ಷೆಯ ರಾಜ್ಯಗಳು ಮತ್ತು ದಾಖಲೆಗಳೂ ವರ್ಷದೊಂದಿಗೆ ಬದಲಾಗುತ್ತವೆ.',
    run: async page => { await page.waitForTimeout(2500); const slider = page.locator('input[type=range]').first(); if (await slider.count()) await setYear(page, 'input[type=range]', [500, 800, 1100, 1500], 2200) } },
  { id: 'dynasties', hash: 'dynasties', secs: { short: 40, long: 70 },
    en: 'Dynasty maps show an estimated area of influence for every dynasty, drawn from capitals, inscriptions, coins and monuments, not from modern district lines. Pick a year, choose a dynasty from the rail, and hide or show the names.',
    kn: 'ರಾಜವಂಶ ನಕ್ಷೆಗಳು ರಾಜಧಾನಿ, ಶಾಸನ, ನಾಣ್ಯ ಮತ್ತು ಸ್ಮಾರಕಗಳ ಆಧಾರದ ಮೇಲೆ ಪ್ರತಿ ರಾಜವಂಶದ ಅಂದಾಜು ಪ್ರಭಾವ ಪ್ರದೇಶವನ್ನು ತೋರಿಸುತ್ತವೆ; ಇಂದಿನ ಜಿಲ್ಲಾ ಗಡಿಗಳ ಆಧಾರದ ಮೇಲೆ ಅಲ್ಲ. ವರ್ಷ ಆರಿಸಿ, ರೈಲ್‌ನಿಂದ ರಾಜವಂಶ ಆರಿಸಿ, ಹೆಸರುಗಳನ್ನು ತೋರಿಸಿ ಅಥವಾ ಮರೆಮಾಡಿ.',
    run: async page => { await page.waitForTimeout(2000); await page.evaluate(() => window.scrollTo(0, 330)); await setYear(page, '.dyn-timeline input[type=range]', [450, 800, 1150, 1500], 2400)
      await page.locator('.dyn-rail button').nth(1).click().catch(() => {}); await page.waitForTimeout(2500)
      const names = page.getByLabel(/Show dynasty names|ರಾಜವಂಶದ ಹೆಸರುಗಳನ್ನು ತೋರಿಸಿ/); if (await names.count()) { await names.uncheck(); await page.waitForTimeout(2000); await names.check(); await page.waitForTimeout(1500) } } },
  { id: 'who-ruled', hash: 'who-ruled', secs: { short: 22, long: 35 },
    en: 'Who ruled here? Click any place on the map to see which dynasties held it, century by century, with the records behind each claim.',
    kn: 'ಇಲ್ಲಿ ಯಾರು ಆಳಿದರು? ನಕ್ಷೆಯಲ್ಲಿ ಯಾವುದೇ ಸ್ಥಳವನ್ನು ಒತ್ತಿದರೆ ಯಾವ ರಾಜವಂಶಗಳು ಯಾವ ಶತಮಾನದಲ್ಲಿ ಅದನ್ನು ಆಳಿದವು ಎಂಬುದು, ಅವುಗಳ ದಾಖಲೆಗಳೊಂದಿಗೆ, ಕಾಣುತ್ತದೆ.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 3, 2200) } },
  { id: 'karnataka-history', hash: 'karnataka-history', secs: { short: 18, long: 35 },
    en: 'Name and administration traces the earliest references to the name Karnataka and how the region was divided and governed from 1657 to 1998.',
    kn: 'ಹೆಸರು ಮತ್ತು ಆಡಳಿತ ಪುಟವು ಕರ್ನಾಟಕ ಎಂಬ ಹೆಸರಿನ ಮೊದಲ ಉಲ್ಲೇಖಗಳನ್ನು ಮತ್ತು 1657 ರಿಂದ 1998 ರವರೆಗೆ ಪ್ರದೇಶವನ್ನು ವಿಭಜಿಸಿ ಆಳಿದ ರೀತಿಯನ್ನು ತೋರಿಸುತ್ತದೆ.',
    run: async page => { await page.waitForTimeout(2000); await scroll(page, 4, 2000) } },
  { id: 'epigraphy', hash: 'epigraphy', secs: { short: 22, long: 40 },
    en: 'Inscriptions are the backbone of the atlas. Browse them on the map and read the editions, with each record marked as reviewed or awaiting review.',
    kn: 'ಶಾಸನಗಳು ಅಟ್ಲಸ್‌ನ ಬೆನ್ನೆಲುಬು. ನಕ್ಷೆಯಲ್ಲಿ ಅವನ್ನು ಹುಡುಕಿ, ಪಾಠಗಳನ್ನು ಓದಿ; ಪ್ರತಿ ದಾಖಲೆಯೂ ಪರಿಶೀಲಿತ ಅಥವಾ ಪರಿಶೀಲನೆ ಬಾಕಿ ಎಂದು ಗುರುತಾಗಿರುತ್ತದೆ.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 3, 2200) } },
  { id: 'scripts', hash: 'scripts', secs: { long: 30 },
    en: 'Script evolution shows how Kannada letters changed from the Brahmi of the early inscriptions to the modern script.',
    kn: 'ಲಿಪಿ ವಿಕಾಸ ಪುಟವು ಆರಂಭಿಕ ಶಾಸನಗಳ ಬ್ರಾಹ್ಮಿಯಿಂದ ಇಂದಿನ ಕನ್ನಡ ಲಿಪಿಯವರೆಗೆ ಅಕ್ಷರಗಳು ಹೇಗೆ ಬದಲಾದವು ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತದೆ.',
    run: async page => { await page.waitForTimeout(2000); await scroll(page, 3, 2000) } },
  { id: 'coins', hash: 'coins', secs: { long: 30 },
    en: 'The coin explorer places coins by dynasty and period, as another line of evidence for who controlled a region.',
    kn: 'ನಾಣ್ಯ ಪುಟವು ರಾಜವಂಶ ಮತ್ತು ಕಾಲದ ಪ್ರಕಾರ ನಾಣ್ಯಗಳನ್ನು ಇರಿಸುತ್ತದೆ; ಒಂದು ಪ್ರದೇಶವನ್ನು ಯಾರು ನಿಯಂತ್ರಿಸಿದರು ಎಂಬುದಕ್ಕೆ ಇದು ಇನ್ನೊಂದು ಸಾಕ್ಷ್ಯ.',
    run: async page => { await page.waitForTimeout(2000); await scroll(page, 3, 2000) } },
  { id: 'district-history', hash: 'district-history', secs: { long: 35 },
    en: 'District history gathers what the atlas knows about each of Karnataka’s districts, and shows where research is still missing.',
    kn: 'ಜಿಲ್ಲಾ ಇತಿಹಾಸ ಪುಟವು ಕರ್ನಾಟಕದ ಪ್ರತಿ ಜಿಲ್ಲೆಯ ಬಗ್ಗೆ ಅಟ್ಲಸ್‌ಗೆ ತಿಳಿದಿರುವುದನ್ನು ಒಟ್ಟುಗೂಡಿಸಿ, ಸಂಶೋಧನೆ ಇನ್ನೂ ಬೇಕಾದ ಕಡೆ ತೋರಿಸುತ್ತದೆ.',
    run: async page => { await page.waitForTimeout(2500); await scroll(page, 3, 2200) } },
  { id: 'research', hash: 'research', secs: { long: 30 },
    en: 'Research lists the sources behind the atlas, so every claim can be traced to a book, an edition or a survey.',
    kn: 'ಸಂಶೋಧನೆ ಪುಟವು ಅಟ್ಲಸ್‌ನ ಹಿಂದಿನ ಆಕರಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡುತ್ತದೆ; ಪ್ರತಿ ಹೇಳಿಕೆಯನ್ನೂ ಪುಸ್ತಕ, ಪಾಠ ಅಥವಾ ಸಮೀಕ್ಷೆಗೆ ಹಿಂಬಾಲಿಸಬಹುದು.',
    run: async page => { await page.waitForTimeout(2000); await scroll(page, 3, 2000) } },
  { id: 'about', hash: 'about', secs: { short: 14, long: 25 },
    en: 'The atlas is a community project of Sanchaya, now part of Sanchi Foundation. Add a record, suggest a correction or support the work from the Contribute and Donate pages.',
    kn: 'ಈ ಅಟ್ಲಸ್ ಸಂಚಯದ ಸಮುದಾಯ ಯೋಜನೆ; ಸಂಚಯ ಈಗ ಸಂಚಿ ಫೌಂಡೇಶನ್‌ನ ಭಾಗ. ದಾಖಲೆ ಸೇರಿಸಿ, ತಿದ್ದುಪಡಿ ಸೂಚಿಸಿ ಅಥವಾ ದೇಣಿಗೆ ನೀಡಿ.',
    run: async page => { await page.waitForTimeout(2000); await scroll(page, 2, 2200) } },
]
