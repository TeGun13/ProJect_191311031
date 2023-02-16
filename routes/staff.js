const express = require('express')
const router = express.Router()
const staffController = require('../controllers/staffController')
const { body } = require('express-validator')
const passportJWT = require('../middleware/passportJWT')
const checkAdmin = require('../middleware/checkAdmin');

router.get('/', [passportJWT.isLogin], staffController.index)
router.get('/:id', staffController.show)
//register
router.post(
  '/',
  [
    body('name').not().isEmpty().withMessage('Name cannot be empty.'),
    body('salary')
      .not()
      .isEmpty()
      .withMessage('Salary cannot be empty.')
      .isNumeric()
      .withMessage('Salary must be a number'),
    body('role')
      .not()
      .isEmpty()
      .withMessage('Position cannot be empty.'),
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
  staffController.insert
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
  staffController.loginn
)

router.delete('/:id',[ passportJWT.isLogin,checkAdmin.isAdmin], staffController.destroy)






module.exports = router