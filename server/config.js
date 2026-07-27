import path from 'node:path'
import { fileURLToPath } from 'node:url'

const serverDir=path.dirname(fileURLToPath(import.meta.url))
const rootDir=path.resolve(serverDir,'..')
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
  uploadDir:path.resolve(process.env.PRIVATE_UPLOAD_DIR||path.join(rootDir,'var','private-uploads')),
  documentEncryptionKey:process.env.DOCUMENT_ENCRYPTION_KEY||'',
  publicDir:path.join(rootDir,'dist'),
  rootDir,
  assertProductionSecrets(){if(this.env==='production'){required('DB_PASSWORD',this.database.password);required('DOCUMENT_ENCRYPTION_KEY',this.documentEncryptionKey);if(!this.appOrigin.startsWith('https://'))throw new Error('APP_ORIGIN must use HTTPS in production')}},
}

