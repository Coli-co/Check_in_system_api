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

describe('checkClockInOrClockOut', () => {
  //  employee does not have clockIn data
  //  clockIn data must be less than original clockOut data
  it('should return correctly when employee does not have clockIn data', async () => {
    const data = [{ id: 1, clockin: null, clockout: 1641373980000 }]
    const clockIn = 1741373980000
    const clockOut = null

    const result = await checkClockInOrClockOut(data, clockIn, clockOut)

    expect(result).toEqual([1, false])
  })
  //  employee does not have clockOut data
  //  clockOut data must be greater than original clockIn data
  it('should return correctly when employee does not have clockOut data', async () => {
    const data = [{ id: 2, clockin: 1741373980000, clockout: null }]
    const clockIn = null
    const clockOut = 1841373980000

    const result = await checkClockInOrClockOut(data, clockIn, clockOut)

    expect(result).toEqual([2, true])
  })

  it('should return [id, false]  when employee with both clockin & clockout data and wants to fill in clockin', async () => {
    const data = [{ id: 5, clockin: 1841373580000, clockout: 1841373980000 }]
    const clockIn = 1831373580000
    const clockOut = null

    const result = await checkClockInOrClockOut(data, clockIn, clockOut)

    expect(result).toBeUndefined()
  })

  it('should return [id, false] when employee with both clockin & clockout data and wants to fill in clockout', async () => {
    const data = [{ id: 5, clockin: 1841373580000, clockout: 1841373980000 }]
    const clockIn = null
    const clockOut = 1931373580000
    const result = await checkClockInOrClockOut(data, clockIn, clockOut)

    expect(result).toBeUndefined()
  })
})

describe('checkSignedOrUnsigned', () => {
  it('should return true when input greater than zero', () => {
    const input = 1931373580000
    const result = checkSignedOrUnsigned(input)
    expect(result).toBe(true)
  })
  it('should return false when input less than zero', () => {
    const input = -1931373580000
    const result = checkSignedOrUnsigned(input)
    expect(result).toBe(false)
  })
  it('should return false when input equal to zero', () => {
    const input = 0
    const result = checkSignedOrUnsigned(input)
    expect(result).toBe(false)
  })
})
