const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {promisify} = require('node:util')

// INITIATING SQL POOL CONNECTIVITY
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "node-login",
});

exports.register = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  pool.getConnection((err, connection) => {
    let userEmailQuery = "SELECT email FROM users WHERE email = ?";
    let userInsertQuery = "INSERT INTO users SET ?";
    if (err) return new Error("Connection to MYSQL not established");
    console.log(`MYSQL connected with threadId: ${connection.threadId}`);

    connection.query(userEmailQuery,[email], async (err, rows) => {
      if(err) return console.log(err)
      if(rows.length > 0){
          return res.render('register',{existMessage:'User already exist'});
      }
      if(password!==confirmPassword){
        return res.render('register',{notMatchMessage:'Password does not match'});
      }

    let hashPassword = await bcrypt.hash(password,8);
      
      connection.query(userInsertQuery,[{name:name,email:email,password:hashPassword}],(err, rows) => {
        connection.release();
        if(err) return console.log(err)
         res.render('register',{userCreatedMessage:'User added successfully'});
      });

    });
  });
};


exports.login = (req, res) => {
  const {email , password} = req.body

  pool.getConnection((err, connection) => {
    if(err) return console.log(err)
    let searchUserByEmail = 'SELECT * FROM users WHERE email = ?'

    connection.query(searchUserByEmail,[email],async (err,data)=>{
      connection.release();
      if(err) return console.log(err)
      if(!data[0] || !await bcrypt.compare(password,data[0].password)) return res.render('login',{noUserFoundMessage:"Email or Password is incorrect."})
      if(data[0] && await bcrypt.compare(password,data[0].password)){
          let id = data[0].id;
          const token = jwt.sign({id},'smh@!sma0923y8$%&v.sgj',{
            expiresIn: '7d'
          })
          const cookieOptions = {
            expires:new Date(Date.now()+ 7*24*60*60*1000), 
            httpOnly:true,
          }
      res.cookie('jwt',token,cookieOptions);
      res.status(200).redirect('/')
      }
    })
  })
}

exports.isLoggedIn =async (req,res,next)=>{
  if(req.cookies.jwt){
    try{
      // VERIFYING THE TOKEN
      const decoded = await promisify(jwt.verify)(req.cookies.jwt,'smh@!sma0923y8$%&v.sgj')
      
      // CHECKING IF THE USER EXISTS
      pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM users WHERE id = ?',[decoded.id],(err,data)=>{
          if(err) throw err
          if(!data){
            return next()
          }
          req.user = data[0]
          return next()
        })
      })
    }catch(err){
      console.log(err)
      return next()
    }
  }else{
    next()
  }
}

exports.logout = (req,res)=>{
  res.cookie('jwt','logout',{ 
    expires : new Date(Date.now()+ 200),
    httpOnly : true
  })
  return res.status(200).redirect('/')
}