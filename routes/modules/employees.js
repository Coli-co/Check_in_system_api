const express = require('express')
const router = express.Router()
const db = require('../../config/queries')

//  clockIn and clockOut feature
router.post('/', db.clockFeature)

//  supplementary time (clockIn or clockOut)
router.put('/:employeenumber', db.fillInClockinOrClockout)

// list all employees with clockOut=null within date range
router.get('/noclockout', db.employeesWithNoClockoutForSpecificDateRange)

// list top 5 employees with clockIn earlier for a specific date
router.get('/clockin-earliest', db.employeesWithClockinEarliestForSpecificDate)

// list all employees data or all employees for a specific date
router.get('/', db.allEmployeesOrEmployeesForSpecificDate)

module.exports = router
