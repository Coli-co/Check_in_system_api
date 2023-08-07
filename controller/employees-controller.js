const processEmployeeData = require('../helpers/employee-data-helper')
const {
  getAllEmployees,
  employeesForSpecificDate
} = require('../models/check-employees-model')
const {
  employeesWithClockinEarliest
} = require('../models/check-employees-model')
const { employeesWithNoClockout } = require('../models/check-employees-model')
const { checkClockInOrClockOut } = require('../helpers/check-time-helper')
const { findEmployeeExistOrNot } = require('../models/check-employees-model')
const clockinAndClockout = require('../models/add-employee-model')
const {
  workTimeGreaterThanOffWorkTime,
  checkSignedOrUnsigned
} = require('../helpers/check-time-helper')
const {
  fillInClockinData,
  fillInClockoutData
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

module.exports = {
  clockFeature,
  fillInClockinOrClockout,
  allEmployeesOrEmployeesForSpecificDate,
  employeesWithClockinEarliestForSpecificDate,
  employeesWithNoClockoutForSpecificDateRange
}
