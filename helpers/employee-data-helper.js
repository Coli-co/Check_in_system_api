const calculateTimeDifferenceInHours = require('./calculate-time-helper')
const restTime = 1.5

function processEmployeeData(data) {
  for (let i = 0; i < data.length; i++) {
    data[i]['rest'] = restTime
    if (data[i]['clockin'] !== null && data[i]['clockout'] !== null) {
      const totalWorkTime = calculateTimeDifferenceInHours(
        data[i]['clockin'],
        data[i]['clockout']
      )
      data[i]['totalWorkTime'] = totalWorkTime
    } else {
      data[i]['totalWorkTime'] = 0
    }
  }
  return data
}

module.exports = processEmployeeData
