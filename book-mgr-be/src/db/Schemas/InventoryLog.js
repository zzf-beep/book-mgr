const mongoose = require('mongoose');
const { getMata, preSave } = require('../helpers')

const InventoryLogSchema = new mongoose.Schema({
  type: String,
  num: Number,
  user: String,

  meta: getMata(),
})

InventoryLogSchema.pre('save', preSave)

mongoose.model('InventoryLog', InventoryLogSchema)