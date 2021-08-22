
import dotenv from 'dotenv'
dotenv.config()

import { promisify } from 'util'
import mysql from 'mysql'

const { DB_DATABASE, DB_DATABASE_TEST, NODE_ENV } = process.env;

let host = process.env.DB_HOST;
let user = process.env.DB_USER;
let password = process.env.DB_PASSWORD;
let database_name = NODE_ENV === "test" ? DB_DATABASE_TEST : DB_DATABASE;

const database = {
  host: host,
  user: user,
  password: password,
  database: database_name,
};

const pool = mysql.createPool(database)

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('DATABASE CONNECTION CLOSED')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.log('DATABASE HAS TO MANY CONNECTIONS')
    }
    if (err.code === 'ECONNREFUSED') {
      console.log('DATABASE CONNECTION WAS REFUSED')
    }
  }

  if (connection) connection.release()
  console.log('DB is Connected')
  return

})

pool.query = promisify(pool.query)
export default pool