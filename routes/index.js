const express = require('express')
const router = express.Router()
const employees = require('./modules/employees')

router.use('/employees', employees)

module.exports = router
