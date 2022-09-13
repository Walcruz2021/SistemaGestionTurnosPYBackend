// libreria que nos permitira conectarse a mongodb
const mongoose = require('mongoose')
const { Schema } = mongoose

const ventaSchema = new Schema({
  date: { type: String, require: true },
  año: { type: Number, require: false },
  mes: { type: Number, require: false },
  idTurno: {
    type: Schema.Types.ObjectId,
    ref: 'Turnos'
  },
  name: { type: String, require: true },
  Dog: {
    type: Schema.Types.ObjectId,
    ref: 'Perro'
  },
  notesTurn: { type: String, require: true },
  tipoServ: { type: String, require: true },
  valorServ: { type: Number, require: true },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente'
  },
  efectivo: { type: Number, require: true },
  transferencia: { type: Number, require: true },
  tarjeta: { type: Number, require: true }
})

module.exports = mongoose.model('Venta', ventaSchema)
