const express = require('express')
const router = express.Router()

const {
  clockFeature,
  fillInClockinOrClockout,
  allEmployeesOrEmployeesForSpecificDate,
  employeesWithClockinEarliestForSpecificDate,
  employeesWithNoClockoutForSpecificDateRange
} = require('../../controller/employees-controller')

// list all employees with clockOut=null within date range
router.get('/noclockout', employeesWithNoClockoutForSpecificDateRange)

// list top 5 employees with clockIn earlier for a specific date
router.get('/clockin-earliest', employeesWithClockinEarliestForSpecificDate)

//  supplementary time (clockIn or clockOut)
router.put('/:employeenumber', fillInClockinOrClockout)

router.post('/', clockFeature)

// list all employees data or all employees for a specific date
router.get('/', allEmployeesOrEmployeesForSpecificDate)

module.exports = router
