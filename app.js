const express = require('express')
const app = express()
const port = 3000
const pool = require('./config/pg-connect')
const bodyParser = require('body-parser')
const workTimeGreaterThanOffWorkTime = require('./helpers/check-time-helper')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())

app.get('/test', (req, res) => {
  console.log('Test api.')
  res.send('Hello world!')
})

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

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
