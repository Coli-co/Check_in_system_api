const express = require('express')
const router = express.Router()
const employees = require('./modules/employees')
const homepage = require('./modules/homepage')

router.use('/employees', employees)
router.use('/', homepage)

module.exports = router
