// libreria que nos permitira conectarse a mongodb
const mongoose = require('mongoose')
const { Schema } = mongoose

const adminSchema = new Schema({
  name: { type: String, require: true },
  // nameDog:{type:String,require:true},
  phone: { type: Number, require: true },
  address: { type: String, require: true },
  arrayBreaks: [{ type: Schema.Types.ObjectId, ref: 'Break' }],
  status:{type:Boolean,default:true}
})

module.exports = mongoose.model('UserAdmin', adminSchema)
