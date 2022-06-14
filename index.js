const express = require("express");
const app = express();
const router = express.Router();
const db = require('./models')
const { States } = require('./models')
const bodyParser = require("body-parser");
const cors = require('cors')
const {PythonShell} = require('python-shell')
const {parse} = require("path");
const schedule = require('node-schedule');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json);
// app.use(cors());
//app.use('/api', router)

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