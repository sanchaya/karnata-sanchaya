import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { sendTelegramMessage, sendWhatsAppMessage, telegramConfigured, whatsappConfigured } from '../server/notifications.js'

const source=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8')

test('portal messages are permanent, public to submit and administrator-only to triage',async()=>{
  const [server,migration,settingsMigration,contact,admin,integrations]=await Promise.all(['server/app.js','server/migrations/013_portal_messages.sql','server/migrations/014_message_notification_settings.sql','src/Contact.jsx','src/AdminInbox.jsx','src/AdminIntegrations.jsx'].map(source))
  assert.match(migration,/CREATE TABLE IF NOT EXISTS portal_messages/)
  assert.match(settingsMigration,/CREATE TABLE IF NOT EXISTS portal_notification_settings/)
  assert.match(server,/app\.post\('\/api\/public\/messages'/)
  assert.match(server,/app\.get\('\/api\/administration\/messages'/)
  assert.match(server,/requireRole\('administrator'\)/)
  assert.match(contact,/VITE_COMMUNITY_API_URL/)
  assert.doesNotMatch(contact,/TELEGRAM_BOT_TOKEN|localStorage|sessionStorage/)
  assert.match(admin,/admin-inbox/)
  assert.match(integrations,/notification-settings/)
})

test('telegram delivery is optional and keeps its token in the server request URL',async()=>{
  const empty={botToken:'',chatId:'',enabled:false}
  assert.equal(telegramConfigured(empty),false)
  assert.deepEqual(await sendTelegramMessage('hello',empty),{skipped:true})
  let request
  const configured={botToken:'secret-token',chatId:'-1001',enabled:true}
  await sendTelegramMessage('New message',configured,async(url,options)=>{request={url,options};return {ok:true,json:async()=>({ok:true})}})
  assert.match(request.url,/botsecret-token\/sendMessage$/)
  assert.deepEqual(JSON.parse(request.options.body),{chat_id:'-1001',text:'New message',disable_web_page_preview:true})
})

test('WhatsApp Cloud API delivery keeps its access token in the authorization header',async()=>{
  const configured={accessToken:'secret-access-token',phoneNumberId:'12345',recipient:'919999999999',apiVersion:'v22.0',enabled:true}
  assert.equal(whatsappConfigured(configured),true)
  let request
  await sendWhatsAppMessage('New message',configured,async(url,options)=>{request={url,options};return {ok:true,json:async()=>({messages:[{id:'1'}]})}})
  assert.equal(request.url,'https://graph.facebook.com/v22.0/12345/messages')
  assert.equal(request.options.headers.Authorization,'Bearer secret-access-token')
  assert.deepEqual(JSON.parse(request.options.body),{messaging_product:'whatsapp',to:'919999999999',type:'text',text:{body:'New message'}})
})
