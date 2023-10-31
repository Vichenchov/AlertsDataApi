exports.countByHours = (cityAlerts) => {
  let hourCountArray = new Array(24).fill(0) // Initialize the array with 24 periods

  // Iterate through the sorted array and populate the hourCountArray
  cityAlerts.forEach((alert) => {
    const hour = alert
      .time
      .getHours()
    hourCountArray[hour] += 1
  })

  // Create an array of objects with hour and count
  let resultArray = []
  for (let i = 0; i < 24; i++) {
    resultArray.push({
      time: (i < 10 ?
        '0' + i + ':00' :
        i + ':00') + '-' + (i + 1 < 10 ?
        '0' + (i + 1) + ':00' :
        i + 1 + ':00'),
      count: hourCountArray[i]
    })
  }
  return resultArray
}

exports.countByMin = (cityAlerts) => {
  let minCountArray = new Array(60).fill(0)

  cityAlerts.forEach((alert) => {
    const min = alert
      .time
      .getMinutes()
    minCountArray[min] += 1
  })

  let resultArray = []
  for (let i = 0; i < 60; i++) {
    resultArray.push({
      time: '00:' + (i < 10 ? ('0' + i) : i),
      count: minCountArray[i],
    })
  }
  return resultArray
}