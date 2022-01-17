const mysql = require('mysql');

// INITIATING SQL POOL CONNECTIVITY
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "node-login",
});


exports.register = (req,res)=>{
    const {name, email, password, confirmPassword} = req.body
    pool.getConnection((err,connection)=>{
        const queryString = 'INSERT INTO users (name, email, password) VALUES = ?'
        if(err) return new Error('Connection to MYSQL not established')
        console.log(`MYSQL connected with threadId: ${connection.threadId}`)
        
        connection.query(queryString,[name, email, password],(err,rows)=>{
            connection.release();


        })
    })
}