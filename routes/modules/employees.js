const express = require('express')
const router = express.Router()
const clockFeature = require('../../controller/clock-feature-controller')
const fillInClockinOrClockout = require('../../controller/fill-in-clockin-clockout-controller')
const employeesWithNoClockoutForSpecificDateRange = require('../../controller/no-clockout-controller')
const employeesWithClockinEarliestForSpecificDate = require('../../controller/top-clockin-earliest-controller')
const allEmployeesOrEmployeesForSpecificDate = require('../../controller/check-employees-controller')

router.post('/', clockFeature)

//  supplementary time (clockIn or clockOut)
router.put('/:employeenumber', fillInClockinOrClockout)

// list all employees with clockOut=null within date range
router.get('/noclockout', employeesWithNoClockoutForSpecificDateRange)

// list top 5 employees with clockIn earlier for a specific date
router.get('/clockin-earliest', employeesWithClockinEarliestForSpecificDate)

// list all employees data or all employees for a specific date
router.get('/', allEmployeesOrEmployeesForSpecificDate)

module.exports = router
