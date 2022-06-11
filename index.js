const express = require("express");
const app = express();
const router = express.Router();
const db = require('./models')
const { States } = require('./models')
const bodyParser = require("body-parser");
const cors = require('cors')
const {PythonShell} = require('python-shell')
const {parse} = require("path");

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json);
// app.use(cors());
//app.use('/api', router)

app.get('/select', (req, res) => {
    States.findAll().then((users)=>{
        res.send(users)
    }).catch((err)=>{
      console.log(err)
    })
})


//do a /insert to make new columns just like this!!!


app.get('/insert', (req, res) => {
    // States.create({
    //         stateName: "California",
    //         diesel: 4.29
    //     }).catch(err => {
    //         if (err) {
    //             console.log(err)
    //         }
    // })
    let parsedData = "none"
    PythonShell.run('parser.py', null, function(err, result) {
        if(err) {
            console.log(err)
        }
        else {
            parsedData = JSON.parse(result)
            console.log("python script finished")
            //parsedData = parsedData[0]
            //console.log(parsedData)

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
                });
            });

            res.send("Hi")
        }
    })

})

app.get('/delete', (req, res) => {
    res.send('select')
})

//ORM SEQUELIZE
db.sequelize.sync().then((req)=> {
    app.listen(3001, () => {
        console.log("server running")
    });
})