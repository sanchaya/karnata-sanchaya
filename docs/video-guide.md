# Video guide

`scripts/video-guide/` records the portal tours from the built static site, so they can be regenerated after a release.

- `scenes.mjs`: one list of scenes (route, what to do on the page, seconds on screen per cut, draft English and Kannada narration). `short` is the 2-3 minute overview (6 scenes, 144 s); `long` is the full tour (9 scenes, 370 s). Add a scene with `secs: { long: 30 }` to keep it out of the short cut.
- `record.mjs`: opens each scene in headless Chromium at 1280x720, records it, trims to the scene length and joins the clips with ffmpeg. It also writes `<cut>.en.srt` and `<cut>.kn.srt` caption files timed to the scenes. The first-visit welcome tour is switched off for the recording.

```bash
VITE_STATIC_DATASET=true npx vite build --outDir /tmp/dx
(cd /tmp/dx && python3 -m http.server 4599 &)
npm i --no-save playwright && npx playwright install chromium ffmpeg
node scripts/video-guide/record.mjs short output/video-guide   # or: long
```

If Playwright is installed elsewhere, point `PLAYWRIGHT` at its `index.mjs`. The videos are silent screen recordings with no pointer; the narration in `scenes.mjs` is a script for a voice-over. The Kannada text is a draft and needs a native speaker's proofreading before it is recorded or used as captions.
