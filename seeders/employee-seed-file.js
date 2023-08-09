const { Pool } = require('pg')
require('dotenv').config()
const jsonData = require('../public/member.json')
const {
  getUTCInMillisecondsFromTaipeiTime
} = require('../helpers/employees-time-helper')

const pool = new Pool({
  user: process.env.PGUSER,
  host: 'localhost',
  database: process.env.PGDB,
  password: process.env.PGPASSWORD,
  port: 5431
})

async function createTable() {
  try {
    const query = `CREATE TABLE IF NOT EXISTS employees (
                    id SERIAL PRIMARY KEY,
                    employeeNumber INT NOT NULL,
                    clockIn BIGINT CHECK (clockIn >= 0),
                    clockOut BIGINT CHECK (clockIn >= 0)
                  );`
    await pool.query(query)
    console.log('Create table successfully.')
  } catch (err) {
    console.log('Create table wrong:', err)
  }
}

async function insertEmployeesData() {
  try {
    await createTable()
    for (const employee of jsonData) {
      const { employeeNumber, clockIn, clockOut } = employee
      const haveClockInData = await getUTCInMillisecondsFromTaipeiTime(clockIn)
      const haveClockOutData = await getUTCInMillisecondsFromTaipeiTime(
        clockOut
      )

      const query =
        'INSERT INTO employees (employeeNumber, clockIn, clockOut) VALUES ($1, $2, $3)'
      await pool.query(query, [
        employeeNumber,
        haveClockInData || null,
        haveClockOutData || null
      ])
    }
    console.log('Data inserted successfully.')
  } catch (error) {
    console.error('Error inserting data:', error)
  }
  pool.end()
}

insertEmployeesData()
