import express from 'express'
import { login, logout, signUp, updateProfile } from '../controllers/userController.js'
import { checkauth, protectRoute } from '../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/signup',signUp)

userRouter.post('/login',login)

userRouter.post('/update-profile',protectRoute,  updateProfile)
userRouter.get('/check',protectRoute,  checkauth)
userRouter.post('/logout',protectRoute,logout)


export default userRouter