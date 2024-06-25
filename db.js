// I AM IMPORTING THE MYSQL MODULE I INSTALLED FROM NPM.....
require('dotenv').config();
const mysql = require('mysql');

//CREATE CONNECTION TO THE DATABASE
const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASENAME       
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