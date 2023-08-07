const {
  employeesWithClockinEarliest
} = require('../models/check-employees-model')

const employeesWithClockinEarliestForSpecificDate = async (req, res) => {
  try {
    const { date } = req.query
    const rows = await employeesWithClockinEarliest(date)
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    return res.status(200).json({ data: rows })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = employeesWithClockinEarliestForSpecificDate
