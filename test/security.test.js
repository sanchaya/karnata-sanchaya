import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { decryptDocument, encryptDocument, hashPassword, sha256, verifyPassword } from '../server/security.js'

test('password hashes verify without storing the password',async()=>{const hash=await hashPassword('ಕನ್ನಡ-atlas-password-2026');assert.equal(await verifyPassword('ಕನ್ನಡ-atlas-password-2026',hash),true);assert.equal(await verifyPassword('different-password',hash),false);assert.equal(hash.includes('ಕನ್ನಡ'),false)})
test('institution documents are authenticated and encrypted',()=>{const key=randomBytes(32).toString('base64'),plain=Buffer.from('private institution identity');const encrypted=encryptDocument(plain,key);assert.notDeepEqual(encrypted,plain);assert.deepEqual(decryptDocument(encrypted,key),plain);encrypted[encrypted.length-1]^=1;assert.throws(()=>decryptDocument(encrypted,key))})
test('sha256 is stable and suitable for opaque token lookup',()=>{assert.equal(sha256('atlas-token'),sha256('atlas-token'));assert.equal(sha256('atlas-token').length,64)})
