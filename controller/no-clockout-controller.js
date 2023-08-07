const {
  workTimeGreaterThanOffWorkTime
} = require('../helpers/check-time-helper')
const { employeesWithNoClockout } = require('../models/check-employees-model')

const employeesWithNoClockoutForSpecificDateRange = async (req, res) => {
  try {
    const { start, end } = req.query
    const checkDate = workTimeGreaterThanOffWorkTime(start, end)

    //  make sure startDate is less than endDate.
    if (checkDate) {
      return res
        .status(400)
        .send({ message: 'Start date must be less than end date.' })
    }

    const rows = await employeesWithNoClockout(start, end)
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    return res.status(200).json({ data: rows })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = employeesWithNoClockoutForSpecificDateRange
