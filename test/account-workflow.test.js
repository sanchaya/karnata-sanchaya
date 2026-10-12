import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { emailDeliveryConfigured, sendPasswordResetEmail } from '../server/mailer.js'

const root=new URL('../',import.meta.url)
const read=path=>readFile(new URL(path,root),'utf8')

test('local password recovery returns a preview URL without leaking through production',async()=>{
  const development={env:'development',passwordResetMinutes:30,mail:{apiKey:'',from:''}}
  const production={...development,env:'production'}
  assert.equal(emailDeliveryConfigured(development),false)
  assert.deepEqual(await sendPasswordResetEmail({to:'researcher@example.org',url:'http://localhost/reset',config:development}),{previewUrl:'http://localhost/reset'})
  await assert.rejects(()=>sendPasswordResetEmail({to:'researcher@example.org',url:'https://atlas.example/reset',config:production}),/not configured/)
})

test('configured password recovery sends a plain-text bilingual-safe email',async()=>{
  let request
  const config={env:'production',passwordResetMinutes:30,mail:{apiKey:'secret',from:'Atlas <noreply@example.org>'}}
  const fetchImpl=async(url,options)=>{request={url,options};return {ok:true,json:async()=>({id:'mail-1'})}}
  const result=await sendPasswordResetEmail({to:'reader@example.org',url:'https://atlas.example/?resetToken=opaque#community',locale:'en',config,fetchImpl})
  assert.equal(result.id,'mail-1')
  assert.equal(request.url,'https://api.resend.com/emails')
  const payload=JSON.parse(request.options.body)
  assert.deepEqual(payload.to,['reader@example.org'])
  assert.match(payload.text,/resetToken=opaque/)
  assert.equal(payload.html,undefined)
})

test('signup, recovery and administrator approval contracts stay wired',async()=>{
  const [server,community,migration]=await Promise.all([read('server/app.js'),read('src/Community.jsx'),read('server/migrations/012_password_reset.sql')])
  assert.match(server,/acceptTerms!==true\|\|body\.acceptPrivacy!==true/)
  assert.match(community,/name="terms" type="checkbox" required/)
  assert.match(community,/name="privacy" type="checkbox" required/)
  assert.match(community,/student:'ವಿದ್ಯಾರ್ಥಿ'/)
  assert.match(community,/'research-institute':'ಸಂಶೋಧನಾ ಸಂಸ್ಥೆ'/)
  assert.match(community,/>\{t\.forgot\}</)
  assert.match(server,/\/api\/auth\/forgot-password/)
  assert.match(server,/\/api\/auth\/reset-password/)
  assert.match(server,/sha256\(token\)/)
  assert.match(server,/DELETE FROM sessions WHERE user_id=/)
  assert.match(migration,/token_hash CHAR\(64\) PRIMARY KEY/)
  assert.match(migration,/expires_at DATETIME\(3\) NOT NULL/)
  assert.match(migration,/used_at DATETIME\(3\) NULL/)
  for(const status of ['approved','rejected','suspended'])assert.match(server,new RegExp(`'${status}'`))
  for(const role of ['reviewer','verification-officer','exporter'])assert.match(community,new RegExp(role))
})
