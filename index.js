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
            console.log(parsedData)
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