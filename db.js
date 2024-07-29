// I AM IMPORTING THE MYSQL MODULE I INSTALLED FROM NPM.....
// require('dotenv').config();
const mysql = require('mysql');

//CREATE CONNECTION TO THE DATABASE
const db = mysql.createConnection({
        host: "srv1373.hstgr.io",
        user: "u652330767_Ernest",
        password: "Adaintechnology2@",
        database: "u652330767_hacked8"       
});

//CONNECT TO THE DATABASE
db.connect((err)=>{
    if (err) {
        // display an error message if the connection failed
        console.log('Error connecting to the database:', err.stack)
    }else{
        //display a successful connected message
        console.log('Connected to the database as ID', db.threadId);
    }
})

module.exports = db