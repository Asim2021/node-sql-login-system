const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth')

const toHome = (req,res)=>{
    const user = req.user;
    res.render('index',{user})
}

const toLogin = (req,res)=>{
    res.render('login')
}

const toRegister = (req,res)=>{
    res.render('register')
}

const toProfile = (req,res)=>{
    const user = req.user
    if(user){
        res.render('profile',{user})
    }else{
        res.redirect('login')
    }
}

router.get('/',authController.isLoggedIn,toHome)
router.get('/login', toLogin)
router.get('/register', toRegister)
router.get('/profile',authController.isLoggedIn, toProfile)

module.exports = router