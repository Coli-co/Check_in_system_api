const {
  processEmployeeData,
  transStringToInteger
} = require('../helpers/employee-data-helper')

const {
  checkSignedOrUnsigned,
  checkClockInOrClockOut,
  workTimeGreaterThanOffWorkTime
} = require('../helpers/employees-time-helper')

const {
  fillInClockinData,
  fillInClockoutData,
  clockinAndClockout,
  findEmployeeExistOrNot,
  employeesWithNoClockout,
  employeesForSpecificDate,
  employeesWithClockinEarliest,
  employeesForSpecificDateRange
} = require('../models/employees-model')

const {
  GetSuccessResponse,
  CreatedSuccessResponse,
  BadRequestError,
  NotFoundError
} = require('../middleware/custom-responses-handler')

const allEmployeesForSpecificDateRange = async (req, res, next) => {
  try {
    const { start, end } = req.query

    // check empty value
    if (!start || !end) {
      return next(
        new BadRequestError('Query params of start and end both required.')
      )
    }

    if (!checkSignedOrUnsigned(start) || !checkSignedOrUnsigned(end)) {
      return next(new BadRequestError('Start or end must be grater than zero.'))
    }

    if (workTimeGreaterThanOffWorkTime(start, end)) {
      return next(
        new BadRequestError('Start value must be less than end value.')
      )
    }
    const rows = await employeesForSpecificDateRange(start, end)
    if (rows.length === 0) {
      const successResponse = new GetSuccessResponse([])

      return next(successResponse)
    }
    const allRows = await processEmployeeData(rows)
    const result = await transStringToInteger(allRows)
    const successResponse = new GetSuccessResponse(result)

    return next(successResponse)
  } catch (error) {
    return next(error)
  }
}

const allEmployeesForSpecificDate = async (req, res, next) => {
  try {
    const { date } = req.query

    const rows = await employeesForSpecificDate(date)

    if (rows.length === 0) {
      const successResponse = new GetSuccessResponse([])
      return next(successResponse)
    }

    const allRows = await processEmployeeData(rows)
    const result = await transStringToInteger(allRows)
    const successResponse = new GetSuccessResponse(result)
    return next(successResponse)
  } catch (error) {
    return next(error)
  }
}

const employeesWithNoClockoutForSpecificDateRange = async (req, res, next) => {
  try {
    const { start, end } = req.query
    const checkDate = workTimeGreaterThanOffWorkTime(start, end)

    //  make sure startDate is less than endDate.
    if (checkDate) {
      return next(new BadRequestError('Start date must be less than end date.'))
    }

    const rows = await employeesWithNoClockout(start, end)
    if (rows.length === 0) {
      const successResponse = new GetSuccessResponse([])
      return next(successResponse)
    }
    const result = await transStringToInteger(rows)
    const successResponse = new GetSuccessResponse(result)
    return next(successResponse)
  } catch (error) {
    return next(error)
  }
}

const employeesWithClockinEarliestForSpecificDate = async (req, res, next) => {
  try {
    const { date } = req.query
    const rows = await employeesWithClockinEarliest(date)
    if (rows.length === 0) {
      const successResponse = new GetSuccessResponse([])
      return next(successResponse)
    }
    const result = await transStringToInteger(rows)
    const successResponse = new GetSuccessResponse(result)
    return next(successResponse)
  } catch (error) {
    return next(error)
  }
}

const fillInClockinOrClockout = async (req, res, next) => {
  try {
    const { employeenumber } = req.params
    const { clockIn, clockOut } = req.body

    if (!clockIn && !clockOut) {
      return next(
        new BadRequestError('Request body of clockin or clockout required.')
      )
    }

    const rows = await findEmployeeExistOrNot(employeenumber)

    if (rows.length === 0) {
      return next(new NotFoundError('Employee not found.'))
    }

    //  check employee loss data of clockin or clockout data
    const haveClockInOrClockout = await checkClockInOrClockOut(
      rows,
      clockIn,
      clockOut
    )

    // employee have both clockin and clockout data
    if (!haveClockInOrClockout) {
      return next(
        new BadRequestError(
          'You do not need to fill in clockin or clockout data.'
        )
      )
    }

    const id = haveClockInOrClockout[0]
    const validTime = haveClockInOrClockout[1]

    //  if checkIn or checkOut time is not reasonable
    if (!validTime) {
      return next(
        new BadRequestError(
          'Work time must be less than off-work time or off-work time must be greater than work time.'
        )
      )
    }

    if (!clockIn) {
      const updateClockoutRes = await fillInClockoutData(id, clockOut)
      if (updateClockoutRes) {
        return next(
          new CreatedSuccessResponse('Clockout record updated successfully.')
        )
      }
    }
    const updateClockinRes = await fillInClockinData(id, clockIn)
    if (updateClockinRes) {
      return next(
        new CreatedSuccessResponse('Clockin record updated successfully.')
      )
    }
  } catch (error) {
    return next(error)
  }
}

const clockFeature = async (req, res, next) => {
  const { employeeNumber, clockIn, clockOut } = req.body

  if (!employeeNumber && !clockIn && !clockOut) {
    return next(
      new BadRequestError(
        'Request body of employeeNumber or clockIn or clockOut required.'
      )
    )
  }

  if (checkSignedOrUnsigned(clockIn) && !clockOut) {
    const rowCount = await clockinAndClockout(employeeNumber, clockIn, clockOut)

    if (rowCount) {
      return next(
        new CreatedSuccessResponse('ClockIn record created successfully.')
      )
    }
  }

  if (checkSignedOrUnsigned(clockOut) && !clockIn) {
    const rowCount = await clockinAndClockout(employeeNumber, clockIn, clockOut)

    if (rowCount) {
      return next(
        new CreatedSuccessResponse('ClockOut record created successfully.')
      )
    }
  }
  if (!checkSignedOrUnsigned(clockIn) || !checkSignedOrUnsigned(clockOut)) {
    return next(
      new BadRequestError('ClockIn or clockOut must be greater than zero.')
    )
  }

  const checkClockTime = workTimeGreaterThanOffWorkTime(clockIn, clockOut)
  //  make sure work time is less than off-work time
  if (checkClockTime) {
    return next(
      new BadRequestError('Work time should not be greater than off-work time.')
    )
  }
  try {
    const rowCount = await clockinAndClockout(employeeNumber, clockIn, clockOut)

    if (rowCount) {
      return next(
        new CreatedSuccessResponse('Employee record created successfully')
      )
    }
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  clockFeature,
  fillInClockinOrClockout,
  allEmployeesForSpecificDate,
  allEmployeesForSpecificDateRange,
  employeesWithClockinEarliestForSpecificDate,
  employeesWithNoClockoutForSpecificDateRange
}
