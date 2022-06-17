const express = require("express");
const app = express();
const router = express.Router();
const db = require('./models')
const { county, States } = require('./models')
const {PythonShell} = require('python-shell')
const schedule = require('node-schedule');


schedule.scheduleJob('5 0 * * *', () => {
    console.log("county job started");
    let parsedData = "none";
    PythonShell.run('countygrabber.py', null, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            parsedData = JSON.parse(result)
            console.log("python script finished")
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            let day = today.getDate();

            Object.keys(parsedData).forEach(function (key) {
                let stateCode = key;
                let individual = parsedData[key];
                Object.keys(individual).forEach(function (key2) {
                    let countyName = key2;
                    let gasPrice = parseFloat(individual[key2].replace(/\$|,/g, ''));
                    //console.log(countyName, gasPrice)
                    county.create({
                        stateName: stateCode,
                        countyName: countyName,
                        day: day,
                        month: month,
                        year: year,
                        gasPrice: gasPrice
                    }).catch(err => {
                        if (err) {
                            console.log(err)
                        }
                    })
                });
            });
        }
    })
})

app.get('/getcountyprice/:state/:countyName/:day/:month/:year', (req, res) => {
    county.findOne({
        where: {
            stateName: req.params.state,
            countyName: req.params.countyName,
            day:req.params.day,
            month:req.params.month,
            year:req.params.year
        },
        attributes: ['stateName', 'countyName', 'day', 'month', 'year', 'gasPrice']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/getcountyprice/:state/:countyName/:day/:month/', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    county.findOne({
        where: {
            stateName: req.params.state,
            countyName: req.params.countyName,
            day:req.params.day,
            month:req.params.month,
            year:year
        },
        attributes: ['stateName', 'countyName', 'day', 'month', 'year', 'gasPrice']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/getcountyprice/:state/:countyName/:day/', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    county.findOne({
        where: {
            stateName: req.params.state,
            countyName: req.params.countyName,
            day:req.params.day,
            month:month,
            year:year
        },
        attributes: ['stateName', 'countyName', 'day', 'month', 'year', 'gasPrice']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/getcountyprice/:state/:countyName', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    county.findOne({
        where: {
            stateName: req.params.state,
            countyName: req.params.countyName,
            day:day,
            month:month,
            year:year
        },
        attributes: ['stateName', 'countyName', 'day', 'month', 'year', 'gasPrice']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})


//temporary getMonth methods, change to add a year function
app.get('/monthlycountyprice/:state/:countyName/:month/', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    county.findAll({
        where: {
            stateName: req.params.state,
            countyName: req.params.countyName,
            month:req.params.month,
            year:year
        },
        attributes: ['stateName', 'countyName', 'day', 'month', 'year', 'gasPrice']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/monthlymetroprice/:state/:metro/:month/', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    States.findAll({
        where: {
            stateName: req.params.state,
            metro: req.params.metro,
            month:req.params.month,
            year:year
        },
        attributes: ['stateName', 'metro', 'day', 'month', 'year', 'regular', 'midgrade',
        'premium', 'diesel']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})

schedule.scheduleJob('0 0 * * *', () => {
    console.log("scheduled job begun");
    let parsedData = "none";
    PythonShell.run('parser.py', null, function(err, result) {
        if(err) {
            console.log(err)
        }
        else {
            parsedData = JSON.parse(result)
            console.log("python script finished")
            //parsedData = parsedData[0]
            //console.log(parsedData)
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            let day = today.getDate();
            //let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            Object.keys(parsedData).forEach(function(key) {
                let individual = parsedData[key];
                //console.log(key, parsedData[key]);
                Object.keys(individual).forEach(function(key2) {
                    //key1 is state
                    let regular = parseFloat(individual[key2][0].replace(/\$|,/g, ''));
                    let midgrade = parseFloat(individual[key2][1].replace(/\$|,/g, ''));
                    let premium = parseFloat(individual[key2][2].replace(/\$|,/g, ''));
                    let diesel = parseFloat(individual[key2][3].replace(/\$|,/g, ''));
                    console.log(key2 + ":", regular, midgrade, premium, diesel);
                    States.create({
                        stateName: key,
                        metro: key2,
                        day: day,
                        month: month,
                        year: year,
                        regular: regular,
                        midgrade: midgrade,
                        premium: premium,
                        diesel: diesel
                    }).catch(err => {
                        if (err) {
                            console.log(err)
                        }
                    })
                });
            });
            console.log('parsing complete')
        }
    })
    console.log("hey");
})

app.get('/getgasprice/:state/:metro/:day/:month/:year', (req, res) => {
    States.findOne({
        where: {
            stateName: req.params.state,
            metro: req.params.metro,
            day:req.params.day,
            month:req.params.month,
            year:req.params.year
        },
        attributes: ['stateName', 'metro', 'day', 'month', 'year', 'regular', 'midgrade',
            'premium', 'diesel']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
      console.log(err)
    })
})

app.get('/getgasprice/:state/:metro/:day/:month/', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    States.findOne({
        where: {
            stateName: req.params.state,
            metro: req.params.metro,
            day:req.params.day,
            month:req.params.month,
            year:year
        },
        attributes: ['stateName', 'metro', 'day', 'month', 'year', 'regular', 'midgrade',
            'premium', 'diesel']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/getgasprice/:state/:metro/:day/', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    States.findOne({
        where: {
            stateName: req.params.state,
            metro: req.params.metro,
            day:req.params.day,
            month:month,
            year:year
        },
        attributes: ['stateName', 'metro', 'day', 'month', 'year', 'regular', 'midgrade',
            'premium', 'diesel']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/getgasprice/:state/:metro', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    States.findOne({
        where: {
            stateName: req.params.state,
            metro: req.params.metro,
            day:day,
            month:month,
            year:year
        },
        attributes: ['stateName', 'metro', 'day', 'month', 'year', 'regular', 'midgrade',
            'premium', 'diesel']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/getgasprice/:state', (req, res) => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    States.findOne({
        where: {
            stateName: req.params.state,
            metro: req.params.state,
            day:day,
            month:month,
            year:year
        },
        attributes: ['stateName', 'metro', 'day', 'month', 'year', 'regular', 'midgrade',
            'premium', 'diesel']  //if change, change unique key made on SQL database
    }).then((price)=>{
        res.send(price)
    }).catch((err)=>{
        console.log(err)
    })
})








//ORM SEQUELIZE
db.sequelize.sync().then((req)=> {
    app.listen(3001, () => {
        console.log("server running")
    });
})