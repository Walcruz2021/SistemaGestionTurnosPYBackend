// libreria que nos permitira conectarse a mongodb
import mongoose from "mongoose";
const { Schema } = mongoose;

 export const clienteSchema = new Schema({
  name: { type: String, require: true },
  // nameDog:{type:String,require:true},
  phone: { type: String, require: true },
  address: { type: String, require: true },
  notesCli: { type: String},
  turnos: [{ type: Schema.Types.ObjectId, ref: 'Turno' }],
  pedidos: [{ type: Schema.Types.ObjectId, ref: 'Venta' }],
  perros: [{
    type: Schema.Types.ObjectId,
    ref: 'Perro',
    nameDog: String
  }],
  status:{type:Boolean,default:true},
  userLogin:{type:Boolean,default:false},
  userName:{type:String},
  Company:{type:Schema.Types.ObjectId,ref:'Company'},
  email:{type:String}
},{timestamps:true})


const Cliente=mongoose.model('Cliente', clienteSchema)
export default Cliente
