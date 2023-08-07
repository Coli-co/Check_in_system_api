const pool = require('../config/pg-connect')
const processEmployeeData = require('../helpers/employee-data-helper')

const allEmployeesOrEmployeesForSpecificDate = async (req, res) => {
  try {
    const { date } = req.query
    if (!date) {
      const query = 'SELECT * FROM employees'
      const { rows } = await pool.query(query)
      //  process employee data to specific format
      const result = processEmployeeData(rows)

      return res.status(200).json({ data: result })
    }
    // list all employees for a specific date
    const query = `
      SELECT *
      FROM employees
      WHERE clockIn = $1 OR clockOut = $1;
      `
    const { rows } = await pool.query(query, [date])
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    // process employee data to specific format
    const result = processEmployeeData(rows)
    return res.status(200).json({ data: result })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = allEmployeesOrEmployeesForSpecificDate
