import { body, param, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../config/generalConfig.js'

export const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Middleware to validate email and password during login
export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email.'),
  body('password').notEmpty().withMessage('Password cannot be empty.'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Middleware to validate email in params
export const validateEmailParam = [
  param('email').isEmail().withMessage('Invalid email format.'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

// Middleware to check if email already exists
export const checkEmailExists = (doesEmailExist) => async (req, res, next) => {
  const { email } = req.body

  try {
    const emailExists = await doesEmailExist(email)
    if (emailExists) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' })
    }
    next()
  } catch (error) {
    console.error('Error checking email existence:', error)
    res.status(500).send('Internal Server Error')
  }
}

// Middleware to hash passwords
export const hashPassword = () => async (req, res, next) => {
  const { password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    req.body.password = hashedPassword // Replace plaintext password with hashed password
    next()
  } catch (error) {
    console.error('Error hashing password:', error)
    res.status(500).send('Internal Server Error')
  }
}
