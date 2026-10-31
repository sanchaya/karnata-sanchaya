import path from 'node:path'
import { fileURLToPath } from 'node:url'

const serverDir=path.dirname(fileURLToPath(import.meta.url))
const rootDir=path.resolve(serverDir,'..')
// Load .env into process.env for direct `node server/*.js` / `npm run ...` invocations. Node does
// not overwrite variables already set (e.g. by systemd's EnvironmentFile= or `docker run -e`), and
// this is a silent no-op when no .env file exists, so it is safe across every deployment path.
try { process.loadEnvFile(path.join(rootDir,'.env')) } catch {}
const required=(name,value)=>{if(!value)throw new Error(`${name} is required`);return value}

export const config={
  env:process.env.NODE_ENV||'development',
  port:Number(process.env.PORT||8787),
  trustProxy:process.env.TRUST_PROXY==='true',
  appOrigin:process.env.APP_ORIGIN||'http://127.0.0.1:4173',
  database:{
    host:process.env.DB_HOST||'127.0.0.1',port:Number(process.env.DB_PORT||3306),
    user:process.env.DB_USER||'karnataka_atlas',password:process.env.DB_PASSWORD||'',database:process.env.DB_NAME||'karnataka_atlas',
    connectionLimit:Number(process.env.DB_POOL_SIZE||10),
  },
  sessionDays:Number(process.env.SESSION_DAYS||14),
  passwordResetMinutes:Number(process.env.PASSWORD_RESET_MINUTES||30),
  mail:{apiKey:process.env.RESEND_API_KEY||'',from:process.env.MAIL_FROM||''},
  publicMessageOrigins:(process.env.PUBLIC_MESSAGE_ALLOWED_ORIGINS||'').split(',').map(value=>value.trim()).filter(Boolean),
  berunda:{apiKey:process.env.ANTHROPIC_API_KEY||'',model:process.env.BERUNDA_MODEL||'claude-haiku-5-5',dailyLimit:Number(process.env.BERUNDA_DAILY_LIMIT||300),perVisitor:Number(process.env.BERUNDA_PER_VISITOR_LIMIT||12)},
  telegram:{botToken:process.env.TELEGRAM_BOT_TOKEN||'',chatId:process.env.TELEGRAM_ADMIN_CHAT_ID||''},
  uploadDir:path.resolve(process.env.PRIVATE_UPLOAD_DIR||path.join(rootDir,'var','private-uploads')),
  documentEncryptionKey:process.env.DOCUMENT_ENCRYPTION_KEY||'',
  publicDir:path.join(rootDir,'dist'),
  rootDir,
  assertProductionSecrets(){if(this.env==='production'){required('DB_PASSWORD',this.database.password);required('DOCUMENT_ENCRYPTION_KEY',this.documentEncryptionKey);if(!this.appOrigin.startsWith('https://'))throw new Error('APP_ORIGIN must use HTTPS in production')}},
}

