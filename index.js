const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express()
const port = process.env.PORT || 3001;
const url = process.env.CONNECTION_STRING_MONGODB_ATLAS;
const clientServer = process.env.CLIENT_SERVER;

const dbFunctions = require('./db_functions');
const af = require('./auxiliaryFunctions');

app.use(express.json());
app.use(cors({
    origin: clientServer,
    methods: 'GET,POST',
    optionsSuccessStatus: 200
  }));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=300');
    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes - the time frame for which requests are checked
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });

  
app.use(limiter);

app.get("/Alerts", async (req, res) => {
    try {
        const Alerts = await dbFunctions.getAllAlerts();
        const alertsByHour = af.countByHours(Alerts);
        res.status(200).json(alertsByHour);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error' + '(' + error + ')');
    }
});

app.get('/Alerts/cities', async (req, res) => {
    try {
        const Alerts = await dbFunctions.getAllAlerts();
        const cityNamesSet = new Set();
        Alerts.forEach(alert => {
            cityNamesSet.add(alert.city);
        });
        const cityNamesArray = Array.from(cityNamesSet);
        res.status(200).json(cityNamesArray);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error' + '(' + error + ')');
    }
});

app.get('/Alerts/:city', async (req, res) => {
    const {
        city
    } = req.params;
    let cityAlerts = [];
    try {
        await dbFunctions.ifCityExists(city);
        cityAlerts = await dbFunctions.getAlertsInSpecificCity(city);
        res.status(200).json(cityAlerts);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error' + '(' + error + ')');
    }
});

app.get('/Alerts/:city/last24', async (req, res) => {
    const {
        city
    } = req.params;
    let cityAlerts = [];
    try {
        const previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - 1);
        await dbFunctions.ifCityExists(city);
        cityAlerts = await dbFunctions.getAlertsSince(city, previousDay);
        const formatedAlerts = af.formatAlertsTime(cityAlerts);
        res.status(200).json(formatedAlerts);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error' + '(' + error + ')');
    }
});

app.get('/Alerts/:city/quarters', async (req, res) => {
    const {
        city
    } = req.params;
    let cityAlerts = [];
    try {
        await dbFunctions.ifCityExists(city);
        cityAlerts = await dbFunctions.getAlertsInSpecificCity(city);
        const alertsByDay = af.quarters(cityAlerts);
        res.status(200).json(alertsByDay);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error' + '(' + error + ')');
    }
});

app.get('/Alerts/:city/byHour', async (req, res) => {
    const {
        city
    } = req.params;
    let cityAlerts = [];
    try {
        await dbFunctions.ifCityExists(city);
        cityAlerts = await dbFunctions.getAlertsInSpecificCity(city);
        const alertsByHour = af.countByHours(cityAlerts);
        res.status(200).json(alertsByHour);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error' + '(' + error + ')');
    }
});

app.get('/Alerts/:city/byMin', async (req, res) => {
    const {
        city
    } = req.params;
    let cityAlerts = [];
    try {
        await dbFunctions.ifCityExists(city);
        cityAlerts = await dbFunctions.getAlertsInSpecificCity(city);
        const alertsByMin = af.countByMinutes(cityAlerts);
        res.status(200).json(alertsByMin);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error' + '(' + error + ')');
    }
});

app.get("/Alerts/:city/byDay", async (req, res) => {
    const {
        city
    } = req.params;
    let cityAlerts = [];
    try {
        await dbFunctions.ifCityExists(city);
        cityAlerts = await dbFunctions.getAlertsInSpecificCity(city);
        const alertsByDay = af.countAlertsPerDay(cityAlerts);
        res.status(200).json(alertsByDay);
        // }
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Internal Server Error' + '(' + error + ')');
    }
});


const start = async () => {
    try {
        await mongoose.connect(
            url, {
                dbName: 'PikudHaoref',
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        app.listen(port, () => console.log(`Server started on port ${port}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();