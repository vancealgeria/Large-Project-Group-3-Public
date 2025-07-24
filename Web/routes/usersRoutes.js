import express from 'express'
import { registerUser, loginUser, sendEmail, checkCode, sendRecoveryEmail, checkRecoveryCode, recoveryPasswordUpdate, verifyGetEmail, verifyUpdateEmail } from '../controllers/usersController.js'

// Creating an instance of Express router
const router = express.Router()

// Register user route
router.post('/', registerUser)

// Login user route
router.post('/login', loginUser)


// Send user a verification email route
router.post('/email', sendEmail)


// Check verification code route
router.post('/check', checkCode)


// Send user a recovery email route
router.post('/recoveryemail', sendRecoveryEmail)


// Check recovery code route
router.post('/recoverycheck', checkRecoveryCode)


// Update user's password from recovery
router.post('/recoverypasswordupdate', recoveryPasswordUpdate)

// Get a user's account email to the change email page
router.post('/verifygetemail', verifyGetEmail)

// Change a user's email
router.post('/verifyupdateemail', verifyUpdateEmail)


export { router as usersRoutes }