exports.countByHours = (cityAlerts) => {
    let hourCountArray = new Array(24).fill(0); // Initialize the array with 24 periods

    // Iterate through the sorted array and populate the hourCountArray
    cityAlerts.forEach((alert) => {
        const hour = alert.time.getHours();
        hourCountArray[hour] += 1;
    });

    // Create an array of objects with hour and count
    let resultArray = [];
    for (let i = 0; i < 24; i++) {
        resultArray.push({
            time: (i < 10 ? '0' + i + ':00' : i + ':00') + '-' + ((i + 1) < 10 ? '0' + (i + 1) + ':00' : (i + 1) + ':00'),
            count: hourCountArray[i],
        });
    }
    console.log(resultArray);
    return resultArray;
}

exports.goodHour = (alertsByHours) => {
    const goodHours = [];
    let minimalCount = alertsByHours[0].count;
    for (let i = 1; i < alertsByHours.length; i++) {
        if (alertsByHours[i].count < minimalCount)
            minimalCount = alertsByHours[i].count;
    }
    for (let i = 0; i < alertsByHours.length; i++) {
        if (alertsByHours[i].count == minimalCount)
            goodHours.push(alertsByHours[i].time);
    }
    return goodHours;
}

exports.badHour = (alertsByHours) => {
    const badHours = [];
    let maxCount = alertsByHours[0].count;
    for (let i = 1; i < alertsByHours.length; i++) {
        if (alertsByHours[i].count > maxCount)
            maxCount = alertsByHours[i].count;
    }
    for (let i = 0; i < alertsByHours.length; i++) {
        if (alertsByHours[i].count == maxCount)
            badHours.push(alertsByHours[i]);
    }
    return badHours;
}