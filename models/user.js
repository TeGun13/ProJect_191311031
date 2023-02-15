const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const schema = new Schema(
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
    role: {
      type: String,
      default: 'member'
    }
  },
  { collection: 'users' }
)

schema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(5)
  const hashPassword = bcrypt.hash(password, salt)
  return hashPassword
}

schema.methods.checkPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password)
  return isValid
}

const user = mongoose.model('User', schema)

module.exports = user