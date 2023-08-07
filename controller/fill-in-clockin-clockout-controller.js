const { checkClockInOrClockOut } = require('../helpers/check-time-helper')
const { findEmployeeExistOrNot } = require('../models/check-employees-model')
const {
  fillInClockinData,
  fillInClockoutData
} = require('../models/check-employees-model')

const fillInClockinOrClockout = async (req, res) => {
  try {
    const { employeenumber } = req.params
    const { clockIn, clockOut } = req.body

    if (!clockIn && !clockOut) {
      return res
        .status(400)
        .json({ error: 'Request body of clockin or clockout required.' })
    }

    const rows = await findEmployeeExistOrNot(employeenumber)

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' })
    }

    //  check employee loss data of clockin or clockout data
    const haveClockInOrClockout = await checkClockInOrClockOut(
      rows,
      clockIn,
      clockOut
    )

    // employee have both clockin and clockout data
    if (!haveClockInOrClockout) {
      return res
        .status(400)
        .json({ error: 'You do not need to fill in clockin or clockout data.' })
    }

    const id = haveClockInOrClockout[0]
    const validTime = haveClockInOrClockout[1]

    //  if checkIn or checkOut time is not reasonable
    if (!validTime) {
      return res.status(400).json({
        error:
          'Work time must be less than off-work time or off-work time must be greater than work time.'
      })
    }

    if (!clockIn) {
      const updateClockoutRes = await fillInClockoutData(id, clockOut)
      if (updateClockoutRes) {
        return res
          .status(201)
          .json({ message: 'Clockout record updated successfully.' })
      }
    }
    const updateClockinRes = await fillInClockinData(id, clockIn)
    if (updateClockinRes) {
      return res
        .status(201)
        .json({ message: 'Clockin record updated successfully.' })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = fillInClockinOrClockout
