const express = require('express')
const app = express()
const port = 3000
const pool = require('./config/pg-connect')
const bodyParser = require('body-parser')
const {
  workTimeGreaterThanOffWorkTime,
  checkClockInOrClockOut
} = require('./helpers/check-time-helper')
const processEmployeeData = require('./helpers/employee-data-helper')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())

// new employee record: clock in & clock out function
app.post('/employees', async (req, res) => {
  const { employeeNumber, clockIn, clockOut } = req.body

  const checkClockTime = workTimeGreaterThanOffWorkTime(clockIn, clockOut)
  //  Make sure work time is less than off-work time
  if (checkClockTime) {
    return res
      .status(400)
      .send({ message: 'Work time should not be greater than off-work time.' })
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
app.put('/employees/:employeeNumber', async (req, res) => {
  const { employeeNumber } = req.params
  const { clockIn, clockOut } = req.body

  try {
    const sql = 'SELECT * FROM employees WHERE employeeNumber = $1'
    const { rows } = await pool.query(sql, [employeeNumber])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    //  check checkIn or checkout of request body
    const clockResult = await checkClockInOrClockOut(rows, clockIn, clockOut)

    const id = clockResult[0]
    const validTime = clockResult[1]

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
      .json({ message: 'clockin record updated successfully' })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// list all employees with clockOut=null within date range
app.get('/employees/nonClockOut', async (req, res) => {
  // assuming the date format is 'YYYY-MM-DD'
  const { startDate, endDate } = req.query
  const checkDate = workTimeGreaterThanOffWorkTime(startDate, endDate)
  //  Make sure startDate is less than endDate.
  if (checkDate) {
    return res.status(400).send({ message: 'startDate must before endDate.' })
  }

  try {
    const query = `
      SELECT *
      FROM employees
      WHERE clockOut IS NULL AND clockIn >= $1 AND clockIn <= $2;
    `
    const { rows } = await pool.query(query, [startDate, endDate])
    if (rows.length === 0) {
      return res.status(200).json({ data: [] })
    }
    return res.status(200).json({ data: rows })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// list all employees
app.get('/employees', async (req, res) => {
  try {
    const query = 'SELECT * FROM employees'
    const { rows } = await pool.query(query)
    //  process employee data to specific format
    const result = processEmployeeData(rows)

    return res.status(200).json({ data: result })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// list all employees for a specific date
app.get('/employees/:date', async (req, res) => {
  const { date } = req.params
  try {
    // Assuming the date format is 'YYYY-MM-DD'
    const query = `
      SELECT *
      FROM employees
      WHERE DATE(clockIn) = $1 OR DATE(clockOut) = $1;
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

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
