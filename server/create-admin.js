import { randomUUID } from 'node:crypto'
import { closeDatabase, pool, transaction } from './db.js'
import { hashPassword } from './security.js'

const email=(process.env.ADMIN_EMAIL||'').trim().toLowerCase(),password=process.env.ADMIN_PASSWORD||'',name=(process.env.ADMIN_NAME||'Sanchaya Administrator').trim()
if(!email||!password)throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required.')
const id=randomUUID(),passwordHash=await hashPassword(password),now=new Date()
await transaction(async db=>{await db.query(`INSERT INTO users (id,email,password_hash,display_name,preferred_locale,profession,affiliation_type,institution_name,account_status,verified_badge,terms_accepted_at,privacy_accepted_at,approved_at) VALUES (?,?,?,?,?,'administrator','nonprofit','Sanchaya','approved',1,?,?,?)`,[id,email,passwordHash,name,'kn',now,now,now]);for(const role of ['contributor','reviewer','verification-officer','administrator'])await db.query('INSERT INTO user_roles (user_id,role,appointed_by) VALUES (?,?,?)',[id,role,id])})
console.log(`Created administrator ${email}`);await closeDatabase()

