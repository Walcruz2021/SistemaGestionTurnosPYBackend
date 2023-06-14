// libreria que nos permitira conectarse a mongodb
const mongoose = require('mongoose')
const { Schema } = mongoose

const breakSchema = new Schema({
  date: { type: String, require: true },
  notesBreak: { type: String, require: true },
  hourEntry: { type: String, require: true },
  hourExit: { type: String, require: true },

})

module.exports = mongoose.model('Break', breakSchema)
