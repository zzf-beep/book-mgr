const mongoose = require('mongoose');
const { getMata } = require('../helpers')

const UserSchema = new mongoose.Schema({
  account: String,
  password: String,

  meta: getMata()
})

mongoose.model('User', UserSchema)