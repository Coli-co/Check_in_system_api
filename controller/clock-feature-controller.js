const clockinAndClockout = require('../models/add-employee-model')
const {
  workTimeGreaterThanOffWorkTime,
  checkSignedOrUnsigned
} = require('../helpers/check-time-helper')

const clockFeature = async (req, res) => {
  const { employeeNumber, clockIn, clockOut } = req.body

  if (!employeeNumber && !clockIn && !clockOut) {
    return res.status(400).json({
      error: 'Request body of employeeNumber or clockIn or clockOut required.'
    })
  }
  if (!checkSignedOrUnsigned(clockIn) || !checkSignedOrUnsigned(clockOut)) {
    return res.status(400).send({
      error: 'ClockIn or clockOut must be greater than zero.'
    })
  }
  const checkClockTime = workTimeGreaterThanOffWorkTime(clockIn, clockOut)
  //  make sure work time is less than off-work time
  if (checkClockTime) {
    return res
      .status(400)
      .json({ error: 'Work time should not be greater than off-work time.' })
  }
  try {
    const rowCount = await clockinAndClockout(employeeNumber, clockIn, clockOut)

    if (rowCount) {
      return res
        .status(201)
        .json({ message: 'Employee record created successfully' })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = clockFeature
