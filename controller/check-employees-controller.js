const pool = require('../config/pg-connect')
const processEmployeeData = require('../helpers/employee-data-helper')
const {
  getAllEmployees,
  employeesForSpecificDate
} = require('../models/check-employees-model')

const allEmployeesOrEmployeesForSpecificDate = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      const rows = await getAllEmployees()
      //  process employee data to specific format
      const result = processEmployeeData(rows)

      return res.status(200).json({ data: result })
    }

    const rows = await employeesForSpecificDate(date)

    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }

    const result = processEmployeeData(rows)
    return res.status(200).json({ data: result })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = allEmployeesOrEmployeesForSpecificDate
