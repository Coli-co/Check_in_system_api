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

module.exports = calculateTimeDifferenceInHours
