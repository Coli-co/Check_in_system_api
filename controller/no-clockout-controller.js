const pool = require('../config/pg-connect')
const {
  workTimeGreaterThanOffWorkTime
} = require('../helpers/check-time-helper')

const employeesWithNoClockoutForSpecificDateRange = async (req, res) => {
  try {
    const { start, end } = req.query
    const checkDate = workTimeGreaterThanOffWorkTime(start, end)
    //  Make sure startDate is less than endDate.
    if (checkDate) {
      return res
        .status(400)
        .send({ message: 'start date must be less than end date.' })
    }
    const query = `
      SELECT *
      FROM employees
      WHERE clockOut IS NULL AND clockIn >= $1 AND clockIn <= $2;
    `
    const { rows } = await pool.query(query, [start, end])
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    return res.status(200).json({ data: rows })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = employeesWithNoClockoutForSpecificDateRange
