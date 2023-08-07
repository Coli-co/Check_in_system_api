const pool = require('../config/pg-connect')
const { checkClockInOrClockOut } = require('../helpers/check-time-helper')

const fillInClockinOrClockout = async (req, res) => {
  try {
    const { employeenumber } = req.params
    const { clockIn, clockOut } = req.body
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
}

module.exports = fillInClockinOrClockout
