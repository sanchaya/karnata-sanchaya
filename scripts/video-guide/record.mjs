// Records the portal guide videos: node scripts/video-guide/record.mjs short|long [outDir]
// Needs the built static site served at BASE (default http://localhost:4599), Playwright (PLAYWRIGHT=<path to its index.mjs>
// when it is not installed in the project) and ffmpeg. Writes <mode>.mp4 plus <mode>.en.srt and <mode>.kn.srt.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { scenes } from './scenes.mjs'
import { learnScenes } from './learn-scenes.mjs'

const { chromium } = await import(process.env.PLAYWRIGHT || 'playwright')
const mode = ['long', 'learn'].includes(process.argv[2]) ? process.argv[2] : 'short'
const out = process.argv[3] || `tmp/video-guide`
const base = process.env.BASE || 'http://localhost:4599'
// `learn` is English only and spoken with the macOS voice (VOICE, default Tara); each scene lasts as long as its narration needs.
const spoken = mode === 'learn'
const chosen = (spoken ? learnScenes : scenes.filter(scene => scene.secs[mode])).map(scene => ({ ...scene, len: spoken ? scene.secs : scene.secs[mode] }))
mkdirSync(`${out}/${mode}`, { recursive: true })
if (spoken) for (const scene of chosen) {
  const aiff = `${out}/${mode}/${scene.id}.aiff`
  execFileSync('say', ['-v', process.env.VOICE || 'Tara', '-r', '160', '-o', aiff, scene.en])
  const seconds = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', aiff]).toString())
  scene.len = Math.max(scene.len, Math.ceil(seconds + 1.5)); scene.audio = aiff
}

const browser = await chromium.launch()
const clips = []
for (const scene of chosen) {
  const dir = `${out}/${mode}/${scene.id}`
  rmSync(dir, { recursive: true, force: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir, size: { width: 1280, height: 720 } }, locale: spoken ? 'en-IN' : 'kn-IN' })
  // the first-visit welcome tour would cover the recording
  await context.addInitScript(() => { try { localStorage.setItem('karnataka-atlas-tour:welcome-v1', 'completed') } catch {} })
  const page = await context.newPage()
  const started = Date.now()
  await page.goto(`${base}/${spoken ? '?lang=en' : ''}#${scene.hash}`, { waitUntil: 'networkidle' })
  await scene.run(page).catch(error => console.error(`${scene.id}: ${error.message}`))
  const left = scene.len * 1000 - (Date.now() - started)
  if (left > 0) await page.waitForTimeout(left)
  const video = page.video()
  await context.close()
  const webm = await video.path()
  const mp4 = `${out}/${mode}/${scene.id}.mp4`
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', webm, '-t', String(scene.len), '-r', '30', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '22', mp4])
  if (scene.audio) { const joined = mp4.replace('.mp4', '.v.mp4'); execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-i', scene.audio, '-af', 'adelay=500|500,apad', '-t', String(scene.len), '-c:v', 'copy', '-c:a', 'aac', joined]); execFileSync('mv', [joined, mp4]) }
  clips.push(mp4)
  console.log('recorded', scene.id)
}
await browser.close()

const stamp = seconds => { const ms = Math.round(seconds * 1000); const p = (n, w = 2) => String(n).padStart(w, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}` }
for (const lang of spoken ? ['en'] : ['en', 'kn']) {
  let at = 0
  writeFileSync(`${out}/${mode}.${lang}.srt`, chosen.map((scene, index) => { const cue = `${index + 1}\n${stamp(at + 0.5)} --> ${stamp(at + scene.len - 0.5)}\n${scene[lang]}\n`; at += scene.len; return cue }).join('\n'))
}
writeFileSync(`${out}/${mode}/list.txt`, clips.map(clip => `file '${clip.split('/').pop()}'`).join('\n'))
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${out}/${mode}/list.txt`, '-c', 'copy', `${out}/${mode}.mp4`])
console.log(`wrote ${out}/${mode}.mp4 (${chosen.reduce((sum, scene) => sum + scene.len, 0)} s)`)
