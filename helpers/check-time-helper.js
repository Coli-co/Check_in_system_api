const pool = require('../config/pg-connect')

// check clockInTime whether is greater than clockOutTime
function workTimeGreaterThanOffWorkTime(clockInTime, clockOutTime) {
  return clockInTime > clockOutTime
}

// check employee who already has clockin data or clockout data and make it compare to new supplementary time (clockIn or clockOut) reasonable
async function checkClockInOrClockOut(data, clockIn, clockOut) {
  for (let i = 0; i < data.length; i++) {
    //  employee does not have clockIn data
    //  clockIn data must be less than original clockOut data
    if (!data[i]['clockin']) {
      const id = data[i]['id']
      const res = clockIn < data[i]['clockout']
      return [id, res]
    }

    //  employee does not have clockOut data
    //  clockOut data must be greater than original clockIn data
    if (!data[i]['clockout']) {
      const id = data[i]['id']
      const res = clockOut > data[i]['clockin']
      return [id, res]
    }
  }
  pool.end()
}

module.exports = {
  workTimeGreaterThanOffWorkTime,
  checkClockInOrClockOut
}
