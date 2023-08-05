//  check clockInTime whether is greater than clockOutTime
function workTimeGreaterThanOffWorkTime(clockInTime, clockOutTime) {
  const workTime = new Date(clockInTime)
  const offWorkTime = new Date(clockOutTime)
  return workTime > offWorkTime
}

module.exports = workTimeGreaterThanOffWorkTime
