// libreria que nos permitira conectarse a mongodb
const mongoose = require('mongoose')
const { Schema } = mongoose

const breakSchema = new Schema({
  notesBreak: { type: String, require: true },
  date: { type: String, require: true },
  ourEntry: { type: String, require: true },
  timeBreak: { type: String, require: true }
})

module.exports = mongoose.model('Break', breakSchema)
