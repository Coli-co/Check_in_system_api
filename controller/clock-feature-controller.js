const pool = require('../config/pg-connect')

const {
  workTimeGreaterThanOffWorkTime
} = require('../helpers/check-time-helper')

const clockFeature = async (req, res) => {
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
}

module.exports = clockFeature
