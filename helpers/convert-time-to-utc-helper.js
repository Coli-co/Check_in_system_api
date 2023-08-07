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

module.exports = getUTCInMillisecondsFromTaipeiTime
