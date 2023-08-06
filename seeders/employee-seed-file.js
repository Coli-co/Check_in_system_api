const pool = require('../config/pg-connect')
const getUTCInMillisecondsFromTaipeiTime = require('../helpers/convert-time-to-utc-helper')
const jsonData = require('../public/member.json')

async function insertEmployeesData() {
  try {
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
