import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8')

test('community contribution uses a guided structured workflow instead of JSON entry',async()=>{
  const [app,community,guided,tasks]=await Promise.all([source('src/App.jsx'),source('src/Community.jsx'),source('src/GuidedContributionForm.jsx'),source('src/CommunityResearchTasks.jsx')])
  assert.match(community,/GuidedContributionForm/)
  assert.match(community,/section='contribute'/)
  assert.match(community,/contributionView/)
  assert.doesNotMatch(community,/profileOnly/)
  for(const route of ['research-tasks','contribute','profile','reviews','operations'])assert.match(app,new RegExp(`view==='${route}'`))
  assert.match(app,/hash==='community'\?'contribute'/)
  assert.doesNotMatch(community,/name="record"/)
  assert.match(guided,/Guided contribution/)
  assert.match(guided,/Add missing record/)
  assert.match(guided,/Add evidence\/source/)
  assert.match(guided,/Page \/ inscription \/ record number/)
  assert.match(tasks,/Help complete one evidence gap/)
  assert.match(tasks,/contributeTarget/)
  for(const group of ['governance','periodicals','evidence'])assert.match(tasks,new RegExp(`group:'${group}'`))
  assert.match(guided,/periodical:'Newspaper \/ periodical'/)
  for(const value of [community,guided,tasks])assert.doesNotMatch(value,/localStorage\.|sessionStorage\.|indexedDB\s*\(/)
})

test('server assigns stable IDs and retains structured citation evidence',async()=>{
  const server=await source('server/app.js')
  assert.match(server,/contributionPrefix/)
  assert.match(server,/randomUUID\(\)\.slice\(0,12\)/)
  assert.match(server,/sourceType:clean\(item\.sourceType/)
  assert.match(server,/supportNote:clean\(item\.supportNote/)
  assert.match(server,/Every citation requires a title and item-level page, inscription or record locator/)
})

test('atlas detail selections hand off correction and source context',async()=>{
  const [app,actions]=await Promise.all([source('src/App.jsx'),source('src/ContributeActions.jsx')])
  assert.match(app,/ContributeActions/)
  assert.match(actions,/contributeTarget/)
  assert.match(actions,/contributeAction/)
  assert.match(actions,/Suggest correction/)
  assert.match(actions,/Add source/)
})
