const express = require('express')
const authRouter = express.Router()
const authController = require('../controllers/auth')


authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.get('/logout', authController.logout)

module.exports = authRouter;