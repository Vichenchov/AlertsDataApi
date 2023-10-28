const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
require('dotenv').config();

const AlertModel = require('./alerts.model');

const app = express()
const port = process.env.PORT || 3001;
const url = process.env.CONNECTION_STRING_MONGODB_ATLAS;

const af = require('./auxiliaryFunctions');

app.use(express.json());
app.use(cors());

app.get("/Alerts", async (req, res) => {
    try {
        const Alerts = await AlertModel.find().sort({ time : 1});
        const alertsByHour = af.countByHours(Alerts);
        res.json(alertsByHour);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/Alerts/24', async (req, res) => {
    try {
        const previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - 1);
        const lastDayAlerts = await AlertModel.find({
            time: {
                $gte: previousDay
            }
        });
        res.json(lastDayAlerts); // Sending the response inside the try block
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/Alerts/cities', async (req, res) => {
    try {
        const Alerts = await AlertModel.find();
        const cityNamesSet = new Set();
        Alerts.forEach(alert => {
             cityNamesSet.add(alert.city);
        });
        const cityNamesArray = Array.from(cityNamesSet);
        res.json(cityNamesArray);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/Alerts/:city', async (req, res) => {
    try {
        const {
            city
        } = req.params;
        const cityAlerts = await AlertModel.find({
            city: city
        });
        res.json(cityAlerts);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/Alerts/:city/byHour', async (req, res) => {
    try {
        const {
            city
        } = req.params;
        const cityAlerts = await AlertModel.find({
            city: city
        }).sort({ time : 1});
        const alertsByHour = af.countByHours(cityAlerts);
        res.json(alertsByHour);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/Alerts/:city/goodHour', async (req, res) => {
    try {
        const {
            city
        } = req.params;
        const cityAlerts = await AlertModel.find({
            city: city
        }).sort({ time : 1});
        const alertsByHour =  af.countByHours(cityAlerts);
        const goodHour = af.goodHour(alertsByHour);
        res.json(goodHour);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/Alerts/:city/badHour', async (req, res) => {
    try {
        const {
            city
        } = req.params;
        const cityAlerts = await AlertModel.find({
            city: city
        }).sort({ time : 1});
        const alertsByHour =  af.countByHours(cityAlerts);
        const badHour = af.badHour(alertsByHour);
        res.json(badHour);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error');
    }
});

const start = async () => {
    try {
        await mongoose.connect(
            url, {
                dbName: 'PikudHaoref',
            }
        );
        app.listen(port, () => console.log(`Server started on port ${port}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();