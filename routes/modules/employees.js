const express = require('express')
const router = express.Router()
const pool = require('../../config/pg-connect')
const {
  workTimeGreaterThanOffWorkTime,
  checkClockInOrClockOut
} = require('../../helpers/check-time-helper')
const processEmployeeData = require('../../helpers/employee-data-helper')

router.post('/', async (req, res) => {
  const { employeeNumber, clockIn, clockOut } = req.body

  if (!employeeNumber && !clockIn && !clockOut) {
    return res.status(400).send({
      error: 'Request body of employeeNumber or clockIn or clockOut required.'
    })
  }
  const checkClockTime = workTimeGreaterThanOffWorkTime(clockIn, clockOut)
  //  Make sure work time is less than off-work time
  if (checkClockTime) {
    return res
      .status(400)
      .send({ error: 'Work time should not be greater than off-work time.' })
  }
  try {
    const query =
      'INSERT INTO employees (employeeNumber, clockIn, clockOut) VALUES ($1, $2, $3)'
    await pool.query(query, [employeeNumber, clockIn, clockOut])
    return res
      .status(201)
      .json({ message: 'Employee record created successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

//  supplementary time (clockIn or clockOut)
router.put('/:employeenumber', async (req, res) => {
  const { employeenumber } = req.params
  const { clockIn, clockOut } = req.body

  try {
    const sql = 'SELECT * FROM employees WHERE employeenumber = $1'
    const { rows } = await pool.query(sql, [employeenumber])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' })
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
      const clockInSQL = 'UPDATE employees SET clockout = $2 WHERE id = $1'
      await pool.query(clockInSQL, [id, clockOut])
      return res
        .status(201)
        .json({ message: 'clockout record updated successfully.' })
    }

    const clockOutSQL = 'UPDATE employees SET clockin = $2 WHERE id = $1'
    await pool.query(clockOutSQL, [id, clockIn])
    return res
      .status(201)
      .json({ message: 'clockin record updated successfully.' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// list all employees with clockOut=null within date range
router.get('/noclockout', async (req, res) => {
  try {
    const { start, end } = req.query
    const checkDate = workTimeGreaterThanOffWorkTime(start, end)
    //  Make sure startDate is less than endDate.
    if (checkDate) {
      return res
        .status(400)
        .send({ message: 'start date must be less than end date.' })
    }
    const query = `
      SELECT *
      FROM employees
      WHERE clockOut IS NULL AND clockIn >= $1 AND clockIn <= $2;
    `
    const { rows } = await pool.query(query, [start, end])
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    return res.status(200).json({ data: rows })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// list top 5 employees with clockIn earlier for a specific date
router.get('/clockin-earliest', async (req, res) => {
  try {
    const { date } = req.query

    const query = `
    SELECT *
      FROM employees
      WHERE clockIn = $1
      ORDER BY clockIn ASC
      LIMIT 5;
      `
    const { rows } = await pool.query(query, [date])
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    return res.status(200).json({ data: rows })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// list all employees data or all employees for a specific date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query
    if (!date) {
      const query = 'SELECT * FROM employees'
      const { rows } = await pool.query(query)
      //  process employee data to specific format
      const result = processEmployeeData(rows)

      return res.status(200).json({ data: result })
    }
    // list all employees for a specific date
    const query = `
      SELECT *
      FROM employees
      WHERE clockIn = $1 OR clockOut = $1;
      `
    const { rows } = await pool.query(query, [date])
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    // process employee data to specific format
    const result = processEmployeeData(rows)
    return res.status(200).json({ data: result })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
