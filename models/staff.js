const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const staffSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 5
    },
    role:{
      type: String,
      required: true,
      trim: true,
      default: 'admin'
    }
    ,
    salary: {
      type: Number
    },
    created: {
      type: Date,
      default: Date.now
    },
    photo: {
      type: String,
      default: 'nopic.png'
    }
  },
  { collection: 'staffs' }
  
)

staffSchema.methods.encryptPassword = async  (password) =>  {
  const salt = await bcrypt.genSalt(5)
  const hashPassword = bcrypt.hash(password, salt)
  return hashPassword
}

staffSchema.methods.checkPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password)
  return isValid
}


const staff = mongoose.model('Staff', staffSchema)
module.exports = staff