const pool = require('../config/pg-connect')

async function clockinAndClockout(employeeNumber, clockIn, clockOut) {
  try {
    const query =
      'INSERT INTO employees (employeeNumber, clockIn, clockOut) VALUES ($1, $2, $3)'
    const res = await pool.query(query, [employeeNumber, clockIn, clockOut])
    console.log('New employee data inserted successfully.')
    return res.rowCount === 1
  } catch (err) {
    console.log('Inserting data error:', err)
  }
  pool.end()
}

module.exports = clockinAndClockout
