const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const {
  workTimeGreaterThanOffWorkTime,
  checkClockInOrClockOut,
  checkSignedOrUnsigned,
  calculateTimeDifferenceInHours,
  getUTCInMillisecondsFromTaipeiTime
} = require('../helpers/employees-time-helper')

describe('getUTCInMillisecondsFromTaipeiTime', () => {
  it('should convert Taipei time to UTC milliseconds', () => {
    const taipeiDateTime = '2022-01-03 08:55'
    // Convert the taipeiDateTime to the equivalent UTC time
    const utcEquivalent = dayjs.tz(taipeiDateTime, 'Asia/Taipei').utc()
    const expectedMilliseconds = utcEquivalent.valueOf()

    const result = getUTCInMillisecondsFromTaipeiTime(taipeiDateTime)

    expect(result).toBe(expectedMilliseconds)
  })

  it('should return null for Taipei time input is null', () => {
    const taipeiDateTime = null

    const result = getUTCInMillisecondsFromTaipeiTime(taipeiDateTime)

    expect(result).toBeNull()
  })
})

describe('calculateTimeDifferenceInHours', () => {
  it('should calculate time correctly in hour', () => {
    const timestamp1 = 1641345360000
    const timestamp2 = 1641374400000
    const result = calculateTimeDifferenceInHours(timestamp1, timestamp2)

    expect(result).toBe(8.07)
  })
})

describe('workTimeGreaterThanOffWorkTime', () => {
  it('should return true when work time is greater than off-work time', () => {
    const clockInTime = '9'
    const clockOutTime = '5'

    const result = workTimeGreaterThanOffWorkTime(clockInTime, clockOutTime)

    expect(result).toBe(true)
  })

  it('should return false when work time is not greater than off-work time', () => {
    const clockInTime = '8'
    const clockOutTime = '9'

    const result = workTimeGreaterThanOffWorkTime(clockInTime, clockOutTime)

    expect(result).toBe(false)
  })

  it('should handle equal times correctly', () => {
    const clockInTime = '9'
    const clockOutTime = '9'

    const result = workTimeGreaterThanOffWorkTime(clockInTime, clockOutTime)

    expect(result).toBe(false)
  })
})
