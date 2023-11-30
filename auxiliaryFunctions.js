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
        date: dayDate.getDate() + '/' + (dayDate.getMonth() + 1),
        countAM: countAM,
        countPM: countPM,
        total: countAM + countPM
      });
      countAM = 0;
      countPM = 0;
    }
    dayDate = currentAlertDay;
    var hours = dayDate.getHours();
    hours >= 12 ? countPM++ : countAM++;
  });

  alertsPerDayArray.push({
    date: dayDate.getDate() + '/' + (dayDate.getMonth() + 1),
    countAM: countAM,
    countPM: countPM,
    total: countAM + countPM
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

exports.quarters = alerts => {
  let am1 = 0
  let am2 = 0
  let pm1 = 0
  let pm2 = 0

  alerts.forEach(alert => {
    if (alert.time.getHours() >= 0 && alert.time.getHours() < 6) {
      am1++;
    } else {
      if (alert.time.getHours() >= 6 && alert.time.getHours() < 12) {
        am2++;
      } else {
        if (alert.time.getHours() >= 12 && alert.time.getHours() < 18) {
          pm1++;
        } else {
          pm2++;
        }
      }
    }
  });

  return {
    am1: am1,
    am2: am2,
    pm1: pm1,
    pm2: pm2
  };
}

exports.formatAlertsTime = (alerts) => {
  const formatedTime = alerts.map((alert) => {
    return {
      city: alert.city,
      time: timeFormat(alert.time)
    }
  })
  return formatedTime;
}

const timeFormat = (time) => {
  let dd = time.getDate();
  let mm = time.getMonth();
  let yy = time.getFullYear();
  let h = time.getHours();
  let min = time.getMinutes();
  return {
    date: dd + "/" + mm + "/" + yy,
    hour: h + ":" + (min < 10 ? "0" + min : min)
  }
}