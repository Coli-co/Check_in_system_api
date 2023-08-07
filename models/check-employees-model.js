const pool = require('../config/pg-connect')

async function getAllEmployees() {
  const query = 'SELECT * FROM employees'
  const { rows } = await pool.query(query)
  return rows
}

async function employeesForSpecificDate(date) {
  const query = `
      SELECT *
      FROM employees
      WHERE clockIn = $1 OR clockOut = $1;
      `
  const { rows } = await pool.query(query, [date])
  return rows
}

module.exports = { getAllEmployees, employeesForSpecificDate }
