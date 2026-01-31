const express = require('express')
const { register, forgotPassword, login, getUser, logout } = require('../controllers/authController')
const verifyToken = require('../middlewares/verifyToken')
const authRouter = express.Router()


authRouter.post("/register",register)
authRouter.post("/login",login)
authRouter.get("/user",verifyToken,getUser)
authRouter.get("/logout",logout)
authRouter.get("/forgotPassword",forgotPassword)

module.exports = authRouter