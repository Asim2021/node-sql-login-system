const express = require('express')
const router = express.Router();

const toHome = (req,res)=>{
    res.render('index')

}

const toLogin = (req,res)=>{
    res.render('login')

}

const toRegister = (req,res)=>{
    res.render('register')

}

router.get('/', toHome)
router.get('/login', toLogin)
router.get('/register', toRegister)

module.exports = router