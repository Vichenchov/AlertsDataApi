exports.countByHours = cityAlerts => {
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

exports.countByMinutes = cityAlerts => {
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
      time: i,
      count: minCountArray[i],
    })
  }
  return resultArray
}

exports.countAlertsPerDay = cityAlerts => {
  let dayDate = cityAlerts[0].time;
  let countAM = 0;
  let countPM = 0;
  const alertsPerDayArray = [];

  cityAlerts.forEach(alert => {
    let currentAlertDay = alert.time;
    if (areDatesDifferent(currentAlertDay, dayDate)) {
      alertsPerDayArray.push({
        date: dayDate.getDate() +'/' + dayDate.getMonth(),
        amCount: countAM,
        pmCount: countPM,
        total: countAM + countPM
      });
      dayDate = currentAlertDay;
      countAM = 0;
      countPM = 0;
    }
    var hours = dayDate.getHours();
    hours >= 12 ? countPM++ : countAM++;
  });
  return alertsPerDayArray;
}

const areDatesDifferent = (date1, date2) => {
  return (
    date1.getDate() !== date2.getDate() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getFullYear() !== date2.getFullYear()
  );
}