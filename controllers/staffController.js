const fs = require('fs')
const path = require('path')
const uuidv4 = require('uuid')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const { validationResult } = require('express-validator')
const jwt = require("jsonwebtoken");

const Staff = require('../models/staff')
const config = require("../config/index");


//Staff view
exports.index = async (req, res) => {
  const staff = await Staff.find().sort({ _id: '1' })
  const staffWithPhotoDomain = staff.map((staff) => {
    return {
      name: staff.name,
      email : staff.email,
      password:staff.password,
      role: staff.role,
      salary: staff.salary,
      photo:  config.Domain + "/images/" + staff.photo
    }
  })
  res.send({ data: staffWithPhotoDomain })
}

//Staff with id
exports.show = async (req, res, next) => {
  try {
    const { id } = req.params
    const staff = await Staff.findById(id)
    if (!staff) {
      const error = new Error('Staff not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({
        data: staff
  })
  } catch (err) {
    next(err)
  }
}

exports.insert = async (req, res, next) => {
  try {
    const { name,email,password,role,salary, photo } = req.body
    // Validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const err = new Error('Input is incorrect')
      err.statusCode = 422
      err.validation = errors.array()
      throw err
    }
    const exitEmail = await Staff.findOne({ email: email })
    if (exitEmail) {
      const error = new Error("อีเมลนี้มีผู้ใช้งานในระบบแล้ว");
      error.statusCode = 400
      throw error;
    }

    // const photoName = 
    // let staff = Staff({
    //   name: name,
    //   email: email,
    //   password:password,
    //   role:role,
    //   salary: salary,
    //   photo: photoName
    // })

    let staffinsert = new Staff();
    staffinsert.name = name
    staffinsert.email = email
    staffinsert.password = await staffinsert.encryptPassword(password)
    staffinsert.role,
    staffinsert.salary,
    staffinsert.photoName = photo ? await saveImageToDisk(photo) : undefined

    const result = await staffinsert.save()
    return res.status(200).json({ message: `Insert Successful: ${result != null}` })
  } catch (e) {
    next(e)
  }
}


exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params
    const staff = await Staff.deleteOne({ _id: id })
    if (staff.deletedCount === 0) {
      const error = new Error('Staff not found')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'staff deleted successfully' })
  } catch (err) {
    next(err)
  }
}

exports.loginn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const staff = await Staff.findOne({ email: email });
    if (!staff) {
      const error = new Error("ไม่พบผู้ใช้งาน");
      error.statusCode = 404;
      throw error;
    }
    const isValid = await staff.checkPassword(password);
    if (!isValid) {
      const error = new Error("รหัสผ่านไม่ถูกต้อง");
      error.statusCode = 401;
      throw error;
    }

    // token
    const token = await jwt.sign(
      {
        id: staff._id,
        role: staff.roles,
      },
      "7BD3863E1132DAE50F7011F638DD2B0D62A674BB72296D77A441D1F3BCDC3F93",
      {
        expiresIn: "5 days",
      }
    );

    const expires_in = jwt.decode(token);

    res.status(200).json({
      access_token: token,
      expires_in: expires_in.exp,
      token_type: "Bearer",
    });
  } catch (error) {
    next(error);
  }
};


const saveImageToDisk = async (baseImage) => {
  //find project path
  const projectPath = path.resolve('./')
  //create path to save image
  const uploadPath = `${projectPath}/public/images/`
  //find file extension
  const ext = baseImage.substring(baseImage.indexOf('/') + 1, baseImage.indexOf(';base64'))
  //create file name w/ file extension by generate uuid
  let filename = ''
  if (ext === 'svg+xml') {
    filename = `${uuidv4.v4()}.svg`
  } else {
    filename = `${uuidv4.v4()}.${ext}`
  }
  //extract base64 data
  let image = decodeBase64Image(baseImage)
  //write new file with new filename at path
  await writeFileAsync(uploadPath + filename, image.data, 'base64')
  //return new filename
  return filename
}

const decodeBase64Image = (base64Str) => {
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
  let image = {}
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string')
  }
  image.type = matches[1]
  image.data = matches[2]
  return image
}

