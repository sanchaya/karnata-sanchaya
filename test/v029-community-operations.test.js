import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { parseCsv } from '../src/research-file-parser.js'

const source=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8')

test('v0.29 operational records remain permanent and reviewer gated',async()=>{
  const [server,migration]=await Promise.all([source('server/app.js'),source('server/migrations/011_v029_community_operations.sql')])
  for(const table of ['community_notifications','research_campaigns','research_campaign_members','research_import_batches'])assert.match(migration,new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`))
  assert.match(migration,/ADD COLUMN campaign_id/)
  for(const field of ['scope_json','member_role','closed','archived','staged','system'])assert.match(migration,new RegExp(field))
  assert.match(server,/app\.post\('\/api\/administration\/campaigns'/)
  assert.match(server,/app\.post\('\/api\/research-imports'/)
  assert.match(server,/app\.post\('\/api\/administration\/research-imports\/:id\/decision'/)
  assert.match(server,/Only drafts or change requests can be edited/)
  assert.match(server,/Contribution review completed/)
})

test('v0.29 contribution UI supports place inference, revision, campaigns, notifications and staging',async()=>{
  const [community,guided,places,operations,tasks]=await Promise.all(['src/Community.jsx','src/GuidedContributionForm.jsx','src/contribution-places.js','src/CommunityOperations.jsx','src/CommunityResearchTasks.jsx'].map(source))
  assert.match(community,/editingContribution/)
  assert.match(community,/BulkResearchStaging/)
  assert.match(guided,/matchContributionPlace/)
  assert.match(guided,/Save revision/)
  assert.match(operations,/Research campaigns/)
  assert.match(operations,/Stage a research CSV \/ KML/)
  assert.match(operations,/parseKml/)
  assert.match(places,/atlasData\.places/)
  assert.match(places,/talukByPlaceId/)
  assert.match(operations,/scope:/)
  assert.match(tasks,/politicalRelations/)
  for(const value of [community,guided,places,operations,tasks])assert.doesNotMatch(value,/localStorage\.|sessionStorage\.|indexedDB\s*\(/)
})

test('research CSV staging preserves quoted commas and escaped quotes',()=>{
  assert.deepEqual(parseCsv('name,place\n"Temple, old","He said ""Hampi"""'),[{name:'Temple, old',place:'He said "Hampi"'}])
})
