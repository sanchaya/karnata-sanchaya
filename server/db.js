import mariadb from 'mariadb'
import { config } from './config.js'

export const pool=mariadb.createPool({...config.database,timezone:'Z',bigIntAsNumber:true,insertIdAsNumber:true})

export async function transaction(work){
  const connection=await pool.getConnection()
  try{await connection.beginTransaction();const result=await work(connection);await connection.commit();return result}
  catch(error){await connection.rollback();throw error}
  finally{await connection.release()}
}

export async function closeDatabase(){await pool.end()}

