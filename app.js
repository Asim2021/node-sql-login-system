const path = require('path')
const express = require('express');
const mysql = require('mysql');
const {engine} = require('express-handlebars')

const app = express();
const PORT = 3005;

// INITIATING STATIC FILE USAGE
app.use(express.static(path.join(__dirname, '/public')))

// INITIATING HBS TEMPLATE ENGINE
app.engine('hbs',engine({extname:".hbs"}))
app.set('view engine','hbs')

// INITIATING SQL POOL CONNECTIVITY
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "node-login",
});

 pool.getConnection((err,connection)=>{
     if(err) return new Error('Connection to MYSQL not established')
     console.log(`MYSQL connected with threadId: ${connection.threadId}`)
 })

app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.get('/login',(req,res)=>{
    res.render('login')
})

app.listen(PORT,()=>{
    console.log(`The Server is running at http://localhost:${PORT}`)
})