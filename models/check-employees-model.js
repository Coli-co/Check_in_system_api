const pool = require('../config/pg-connect')

async function getAllEmployees() {
  try {
    const query = 'SELECT * FROM employees'
    const { rows } = await pool.query(query)
    console.log('Get all employees data successfully.')
    return rows
  } catch (err) {
    console.log('Get all employees data err:', err)
  }
  pool.end()
}

async function employeesForSpecificDate(date) {
  try {
    const query = `
      SELECT *
      FROM employees
      WHERE clockIn = $1 OR clockOut = $1;
      `
    const { rows } = await pool.query(query, [date])
    console.log('Get employeesForSpecificDate data successfully.')
    return rows
  } catch (err) {
    console.log('Get employeesForSpecificDate data err:', err)
  }
  pool.end()
}

module.exports = { getAllEmployees, employeesForSpecificDate }
