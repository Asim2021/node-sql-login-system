const path = require('path')
const express = require('express');
const {engine} = require('express-handlebars')
const router = require('./routes/pages')
const authRouter = require('./routes/auth')
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 3005;

// PARSE URL-ENCODED BODY AND JSON TO GET DATA FROM HTML FORMS
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cookieParser());

// INITIATING STATIC FILE USAGE
app.use(express.static(path.join(__dirname, '/public')))

// INITIATING HBS TEMPLATE ENGINE
app.engine('hbs',engine({extname:".hbs"}))
app.set('view engine','hbs')

 // USING ROUTER
 app.use('/',router)
 app.use('/auth',authRouter)

app.listen(PORT,()=>{
    console.log(`The Server is running at http://localhost:${PORT}`)
})