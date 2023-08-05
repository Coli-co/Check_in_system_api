const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

// check connection
const pgConnect = async () => {
  try {
    const res = await pool.query('SELECT NOW()')
    console.log(res.rows[0]['now'])
    const client = await pool.connect()
    client.release()
  } catch (err) {
    console.log('Connection err:', err)
  }
}

pgConnect()

module.exports = pool
