import { decryptDocument, encryptDocument } from './security.js'

const supportedProviders=new Set(['telegram','whatsapp'])
const text=value=>typeof value==='string'?value.trim():''
const decode=(row,key)=>JSON.parse(decryptDocument(Buffer.from(row.settings_encrypted),key).toString('utf8'))
const summary=(provider,settings)=>({provider,enabled:Boolean(settings.enabled),configured:provider==='telegram'?Boolean(settings.botToken&&settings.chatId):Boolean(settings.accessToken&&settings.phoneNumberId&&settings.recipient),tokenStored:Boolean(provider==='telegram'?settings.botToken:settings.accessToken),chatId:settings.chatId||'',phoneNumberId:settings.phoneNumberId||'',recipient:settings.recipient||'',apiVersion:settings.apiVersion||'v22.0',templateName:settings.templateName||'',templateLanguage:settings.templateLanguage||'en',source:settings.source||'database'})

export const telegramConfigured=settings=>Boolean(settings?.botToken&&settings?.chatId)
export async function sendTelegramMessage(message,settings,fetchImpl=fetch){
  if(!settings?.enabled||!telegramConfigured(settings))return {skipped:true}
  const response=await fetchImpl(`https://api.telegram.org/bot${settings.botToken}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:settings.chatId,text:message,disable_web_page_preview:true})})
  if(!response.ok)throw new Error(`Telegram notification failed (${response.status})`)
  return response.json()
}

export const whatsappConfigured=settings=>Boolean(settings?.accessToken&&settings?.phoneNumberId&&settings?.recipient)
export async function sendWhatsAppMessage(message,settings,fetchImpl=fetch){
  if(!settings?.enabled||!whatsappConfigured(settings))return {skipped:true}
  const version=/^v\d+\.\d+$/.test(settings.apiVersion||'')?settings.apiVersion:'v22.0'
  const content=settings.templateName?{type:'template',template:{name:settings.templateName,language:{code:settings.templateLanguage||'en'},components:[{type:'body',parameters:[{type:'text',text:message.slice(0,1024)}]}]}}:{type:'text',text:{body:message}}
  const response=await fetchImpl(`https://graph.facebook.com/${version}/${encodeURIComponent(settings.phoneNumberId)}/messages`,{method:'POST',headers:{Authorization:`Bearer ${settings.accessToken}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to:settings.recipient,...content})})
  if(!response.ok)throw new Error(`WhatsApp notification failed (${response.status})`)
  return response.json()
}

export async function loadNotificationSettings(db,config){
  let rows=[]
  try{rows=await db.query('SELECT provider,enabled,settings_encrypted FROM portal_notification_settings')}
  catch(error){if(error.code!=='ER_NO_SUCH_TABLE')throw error}
  const stored=new Map(rows.map(row=>[row.provider,{...decode(row,config.documentEncryptionKey),enabled:Boolean(row.enabled),source:'database'}]))
  if(!stored.has('telegram'))stored.set('telegram',{...config.telegram,enabled:telegramConfigured(config.telegram),source:'environment'})
  if(!stored.has('whatsapp'))stored.set('whatsapp',{enabled:false,source:'database'})
  return stored
}

export async function saveNotificationSettings(db,config,provider,input,userId){
  if(!supportedProviders.has(provider))throw Object.assign(new Error('Unsupported notification provider.'),{status:400})
  const settings=await loadNotificationSettings(db,config),current=settings.get(provider)||{},enabled=input.enabled===true
  const next=provider==='telegram'
    ? {botToken:text(input.botToken)||current.botToken||'',chatId:text(input.chatId),enabled}
    : {accessToken:text(input.accessToken)||current.accessToken||'',phoneNumberId:text(input.phoneNumberId),recipient:text(input.recipient).replace(/[^\d]/g,''),apiVersion:/^v\d+\.\d+$/.test(text(input.apiVersion))?text(input.apiVersion):'v22.0',templateName:text(input.templateName),templateLanguage:text(input.templateLanguage)||'en',enabled}
  if(enabled&&!summary(provider,next).configured)throw Object.assign(new Error(`Complete the ${provider} settings before enabling notifications.`),{status:400})
  const encrypted=encryptDocument(Buffer.from(JSON.stringify(next)),config.documentEncryptionKey)
  await db.query('INSERT INTO portal_notification_settings (provider,enabled,settings_encrypted,updated_by) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE enabled=VALUES(enabled),settings_encrypted=VALUES(settings_encrypted),updated_by=VALUES(updated_by)',[provider,enabled,encrypted,userId])
  return summary(provider,next)
}

export async function sendPortalNotifications(message,db,config,fetchImpl=fetch,onlyProvider=null){
  const settings=await loadNotificationSettings(db,config),providers=onlyProvider?[onlyProvider]:['telegram','whatsapp']
  const results=await Promise.allSettled(providers.map(provider=>provider==='telegram'?sendTelegramMessage(message,settings.get(provider),fetchImpl):sendWhatsAppMessage(message,settings.get(provider),fetchImpl)))
  if(onlyProvider&&results[0].status==='rejected')throw results[0].reason
  results.filter(result=>result.status==='rejected').forEach(result=>console.error(result.reason.message))
  return results
}

export async function notificationSettingsSummary(db,config){const settings=await loadNotificationSettings(db,config);return ['telegram','whatsapp'].map(provider=>summary(provider,settings.get(provider)||{}))}
