import mongoose from "mongoose";
const { Schema } = mongoose;

const gastoSchema = new Schema({
  año: { type: Number, require: true },
  date: { type: String, require: true },
  description:{ type: String, require: true },
  efectivo: { type: Number, require: true },
  transferencia : { type: Number, require: true },
  tarjeta : { type: Number, require: true },
  categoryGasto: { type: String, require: true },
  value:{ type: Number, require: true },
  mes: { type: Number, require: true },
  typeGasto:{ type: String, require: true },
  idCompany:{
    type: Schema.Types.ObjectId,
    ref:'Company'
  }
},{timestamps:true});

const Gasto = mongoose.model("Gasto", gastoSchema);
export default Gasto