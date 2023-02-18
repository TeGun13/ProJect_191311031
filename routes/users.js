const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { body } = require('express-validator')
const passportJWT = require('../middleware/passportJWT')
const checkAdmin = require('../middleware/checkAdmin')

router.get('/', userController.index)


//register
router.post(
  '/',
  [
    body('name').not().isEmpty().withMessage('Name cannot be empty'),
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Email is not correctly formatted'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ min: 5 })
      .withMessage('Password length must be as least 5 characters')
  ],
  userController.register
)
//login
router.post(
  '/login',
  [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Email is not correctly formatted'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ min: 5 })
      .withMessage('Password length must be as least 5 characters')
  ],
  userController.login
)
//delete use by admin
router.delete('/:id', [passportJWT.isLogin, checkAdmin.isAdmin], userController.delete)

module.exports = router
