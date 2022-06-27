import express from 'express'
import {
	customerLogin,
	customerOtp,
	customerSignup,
	customerVerification,
	editCustomerProfile,
	getCustomerProfile,
} from '../controllers'
import { Authenticate } from '../middlewares'

const router = express.Router()

/* signup/create customer */
router.post('/signup', customerSignup)
/* login customer */
router.post('/login', customerLogin)
/* verify customer */
router.use(Authenticate)

router.patch('/verify', customerVerification)
/* otp requests */
router.get('/otp', customerOtp)
/* customer profile */
router.get('/profile', getCustomerProfile)
router.patch('/profile', editCustomerProfile)

export { router as customerRoutes }
