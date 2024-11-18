const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const axios = require('axios');

// const user = require('./routes/user.route')
// const vault = require('./routes/vault.route')
// const investment = require('./routes/investment.route')
// const asset = require('./routes/asset.route')
const token = require('./routes/token.route')

// const mongoose = require("mongoose");
require("dotenv").config();

// const db_url = process.env.DB_URL || "mongodb://0.0.0.0:27017"

// mongoose.Promise = global.Promise;

// mongoose.connect(db_url);
// let conn = mongoose.connection;

// conn.on("connected", function(){
//     console.log("Mongoose connected to " + db_url);
// });

// conn.on("error", function(err){
//     console.log("Mongoose connection error" + err);
// });

// conn.on("disconnected", function(){
//     console.log("Mongoose disconnected");
// });

// mongoose.connection.db.admin().command({ ping: 1 });

// async function getData() {
//     const url = 'http://localhost:4001/v1/status';
//     const response = await fetch(url);
//     const jsonResponse = await response.json();
//     console.log("PQD: ", jsonResponse);
// } 
  
app.use(express.static('public'))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: '*'
}));
// app.use('/v1', user)
// app.use('/v1', vault)
// app.use('/v1', investment)
// app.use('/v1', asset)
app.use('/v1/token', token)
// app.use('/v1', chain)

app.get('/', async (req, res) => {
    res.json({
        code: 0,
        data: "Ok"
    })
})

app.listen(process.env.PORT || 3001, () =>{
    console.log("Listening at 3001")
});

module.exports = app;