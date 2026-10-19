import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8')

test('v0.30 readiness is derived from live operational evidence',async()=>{
  const [server,admin,roadmap,pilot]=await Promise.all(['server/app.js','src/Admin.jsx','docs/roadmap-status.md','docs/v030-reviewer-pilot.md'].map(source))
  for(const migration of ['011_v029_community_operations.sql','012_password_reset.sql'])assert.match(server,new RegExp(migration.replaceAll('.','\\.')))
  for(const check of ['migrations','mail','reviewers','contributors','campaign','assignments','dataset'])assert.match(server,new RegExp(`id:'${check}'`))
  assert.match(server,/emailDeliveryConfigured\(config\)/)
  assert.match(server,/assignee<>reviewer/)
  assert.match(server,/communityOperationsReady\?await Promise\.all/, 'missing v0.29 tables must report a failed check instead of crashing readiness')
  assert.match(admin,/admin-pilot-readiness/)
  assert.match(admin,/readiness\.pilot\.checks\.map/)
  assert.match(roadmap,/Atlas v0\.30 — live reviewer pilot and evidence promotion/)
  assert.match(pilot,/Backup and isolated restore/)
  assert.match(pilot,/Approved-only publication/)
})

test('v0.30 does not pretend manual production drills are automated',async()=>{
  const server=await source('server/app.js')
  for(const check of ['backup-restore','signup-recovery','approved-static-release'])assert.match(server,new RegExp(check))
  assert.match(server,/manualChecks:/)
})

test('public release labels use the canonical Atlas schema version',async()=>{
  const [atlas,app,about,admin,evidence,explorer,citations]=await Promise.all(['src/data/atlas.js','src/App.jsx','src/About.jsx','src/Admin.jsx','src/EvidenceWorkflow.jsx','src/LiteratureEpigraphyExplorer.jsx','src/ResourcesCollaborations.jsx'].map(source))
  assert.match(atlas,/export const ATLAS_RELEASE_VERSION = '0\.30\.0'/)
  assert.match(app,/t\.appSubtitle} · v{ATLAS_RELEASE_VERSION}/)
  assert.match(app,/Karnataka Historical Atlas · v{ATLAS_RELEASE_VERSION}/)
  assert.match(about,/t\.eyebrow} · v{ATLAS_RELEASE_VERSION}/)
  for(const page of [admin,evidence,explorer,citations])assert.match(page,/ATLAS_RELEASE_VERSION/)
})
