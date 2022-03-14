const mongoose = require('mongoose');
const { getMata } = require('../helpers')

const InviteCodeSchema = new mongoose.Schema({
  //邀请码
  code: String,
  //用来注册哪个账户
  user: String,

  meta: getMata()
})

mongoose.model('InviteCode', InviteCodeSchema)