const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

function getUTCInMillisecondsFromTaipeiTime(taipeiDateTime) {
  if (!taipeiDateTime) return null
  // Create a dayjs object for the Taipei time and set the time zone
  const taipeiTime = dayjs.tz(taipeiDateTime, 'Asia/Taipei')

  // Convert to UTC+0 time
  const utcTime = taipeiTime.utc()

  // Get the time in milliseconds
  const milliseconds = utcTime.valueOf()

  return milliseconds
}

function calculateTimeDifferenceInHours(timestamp1, timestamp2) {
  const date1 = timestamp1
  const date2 = timestamp2

  // Get the time difference in milliseconds
  const timeDiffInMilliseconds = date2 - date1

  // Convert milliseconds to hours
  const timeDiffInHours = Number(
    (timeDiffInMilliseconds / (1000 * 60 * 60)).toFixed(2)
  )

  return timeDiffInHours
}
// check clockInTime whether is greater than clockOutTime
function workTimeGreaterThanOffWorkTime(clockInTime, clockOutTime) {
  return Number(clockInTime) > Number(clockOutTime)
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
}

function checkSignedOrUnsigned(input) {
  return input > 0
}

module.exports = {
  workTimeGreaterThanOffWorkTime,
  checkClockInOrClockOut,
  checkSignedOrUnsigned,
  calculateTimeDifferenceInHours,
  getUTCInMillisecondsFromTaipeiTime
}
