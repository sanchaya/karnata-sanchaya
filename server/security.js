import { createCipheriv, createDecipheriv, createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt=promisify(scryptCallback)
export const sha256=value=>createHash('sha256').update(value).digest('hex')
export const randomToken=(bytes=32)=>randomBytes(bytes).toString('base64url')

export async function hashPassword(password){
  if(typeof password!=='string'||password.length<12||password.length>200)throw new Error('Password must contain 12–200 characters.')
  const salt=randomBytes(16);const key=await scrypt(password,salt,64,{N:16384,r:8,p:1,maxmem:64*1024*1024})
  return `scrypt$16384$8$1$${salt.toString('base64url')}$${key.toString('base64url')}`
}

export async function verifyPassword(password,encoded){
  try{const [kind,n,r,p,saltText,keyText]=encoded.split('$');if(kind!=='scrypt')return false;const expected=Buffer.from(keyText,'base64url');const actual=await scrypt(password,Buffer.from(saltText,'base64url'),expected.length,{N:Number(n),r:Number(r),p:Number(p),maxmem:64*1024*1024});return timingSafeEqual(expected,actual)}catch{return false}
}

const documentKey=value=>{const key=Buffer.from(value,'base64');if(key.length!==32)throw new Error('DOCUMENT_ENCRYPTION_KEY must be a base64-encoded 32-byte key.');return key}
export function encryptDocument(buffer,keyText){const iv=randomBytes(12);const cipher=createCipheriv('aes-256-gcm',documentKey(keyText),iv);const encrypted=Buffer.concat([cipher.update(buffer),cipher.final()]);return Buffer.concat([Buffer.from('KHA1'),iv,cipher.getAuthTag(),encrypted])}
export function decryptDocument(buffer,keyText){if(buffer.subarray(0,4).toString()!=='KHA1')throw new Error('Unknown document format.');const decipher=createDecipheriv('aes-256-gcm',documentKey(keyText),buffer.subarray(4,16));decipher.setAuthTag(buffer.subarray(16,32));return Buffer.concat([decipher.update(buffer.subarray(32)),decipher.final()])}

