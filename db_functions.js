const AlertModel = require('./alerts.model');

exports.getAllAlerts = async () => {
    try {
        const Alerts = await AlertModel.find().sort({
            time: 1
        });
        return Alerts;
    } catch (error) {
        console.log('Alerts');
        throw new Error('Error while fetching data from the database: ' + error.message);
    }
}

exports.getAlertsSince = async (city, Date) => {
    let Alerts = []
    try {
        if (city === 'ישראל') {
            Alerts = await AlertModel.find({
                time: {
                    $gte: Date
                }
            }).sort({
                time: -1
            });
        } else {
            Alerts = await AlertModel.find({
                time: {
                    $gte: Date
                },
                city: city
            }).sort({
                time: -1
            });
        }
        return Alerts;
    } catch (error) {
        throw new Error('Error while fetching data from the database: ' + error.message);
    }
}

exports.getAlertsInSpecificCity = async (city) => {
    let cityAlerts = []
    try {
        if (city === 'ישראל') {
            cityAlerts = this.getAllAlerts();
        } else {
            cityAlerts = await AlertModel.find({
                city: city
            }).sort({
                time: 1
            });
        }
        return cityAlerts;
    } catch (error) {
        throw new Error('Error while fetching data from the database: ' + error.message);
    }
}

exports.ifCityExists = async (city) => {
    if (city === 'ישראל') {
        return;
    } else {
        try {
            const ifCityExists = await AlertModel.findOne({
                city: city
            });
            if (ifCityExists === null) {
                throw new Error('City not found');
            }
        } catch (error) {
            throw new Error('Error while fetching data from the database: ' + error.message);
        }
    }
}