const mongoose = require('mongoose');
const { getMata, preSave } = require('../helpers')

const UserSchema = new mongoose.Schema({
  account: String,
  password: String,

  meta: getMata()
})

UserSchema.pre('save', preSave)

mongoose.model('User', UserSchema)