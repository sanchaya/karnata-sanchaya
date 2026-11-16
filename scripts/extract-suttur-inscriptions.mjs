#!/usr/bin/env node
// Reads our own OCR of "Suttur Inscriptions" (H. M. Nagaraja Rao, 2012; Internet Archive item damh.sutturinscriptio0000hmn) and writes the
// serial number, Epigraphia Carnatica reference, findspot words and Saka-year candidates of each record in Appendix I to
// data/imports/suttur-inscriptions.json. Facts only: no book text or translation is stored. Every row stays needs-review: OCR digits are unreliable.
// OCR: pdftoppm -r 300 -gray -png book.pdf pg; tesseract pg-NNN.png pg-NNN -l eng+kan --psm 4; cat pg-*.txt > ocr.txt
// Run: node scripts/extract-suttur-inscriptions.mjs ocr.txt
import { readFileSync, writeFileSync } from 'node:fs'
const [file] = process.argv.slice(2)
if (!file) throw new Error('usage: extract-suttur-inscriptions.mjs ocr.txt')
const lines = readFileSync(file, 'utf8').split('\n')
const start = lines.findIndex((line, i) => /^APPENDIX - \[/.test(line) && i > 400), end = lines.findIndex((line, i) => /^APPENDIX - II$/.test(line) && i > start)
const body = lines.slice(start, end)
const heads = []
// A heading counts only when it follows the previous serial (stray numbers such as page numbers or quantities are skipped).
body.forEach((line, i) => { const m = line.match(/^(\d{1,2})\.? ?\(([^)]*)\)/); if (m && +m[1] === (heads.at(-1)?.[1] || 0) + 1) heads.push([i, +m[1], m[2]]) })
const rows = heads.map(([i, serial, ref], k) => {
  const block = body.slice(i, k + 1 < heads.length ? heads[k + 1][0] : body.length)
  const nj = ref.match(/Nj\.? ?(\d{3})/)?.[1]
  const findspot = block.slice(1, 4).map(line => line.trim()).filter(line => line && !/^Texts and Translations|^\d+ Suttur/.test(line) && !/^Suttur|^Sutt[iu]r$/i.test(line))[0] || ''
  const saka = [...new Set([...block.join(' ').matchAll(/[Ss]aka[- ]?(?:var[a-z]*|year)?\s*[\[(]?(\d)[\])]?(\d{2,3})\b/g)].map(m => +(m[1] + m[2])))]
  return { serial, ecReference: nj ? `EC 3 (Revised), Nanjangud ${nj}` : null, findspot, sakaYearCandidates: saka.filter(y => y >= 850 && y <= 1850), ocrNote: nj ? '' : 'Heading not read by OCR; reference to be taken from the page image' }
})
const out = { source: { title: 'Suttur Inscriptions', author: 'H. M. Nagaraja Rao', publisher: 'JSS Granthamale, Mysuru, 2012', archiveItem: 'https://archive.org/details/damh.sutturinscriptio0000hmn', section: 'Appendix I (texts and translations)' }, status: 'needs-review', rows }
writeFileSync(new URL('../data/imports/suttur-inscriptions.json', import.meta.url), JSON.stringify(out, null, 1) + '\n')
console.log(rows.length, 'rows;', rows.filter(r => r.sakaYearCandidates.length).length, 'with a Saka year candidate')
