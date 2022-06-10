const express = require("express");
const app = express();
const router = express.Router();
const db = require('./models')
const { States } = require('./models')
const bodyParser = require("body-parser");
const cors = require('cors')

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


app.get('/insert', (req, res) => {
    States.create({
            stateName: "California",
            diesel: 4.29
        }).catch(err => {
            if (err) {
                console.log(err)
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