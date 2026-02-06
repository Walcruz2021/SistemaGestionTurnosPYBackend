import mongoose from "mongoose";
const { Schema } = mongoose;

const stockAdjustmentSchema = new Schema({
  idCompany: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },

  idCompanySupply: {
    type: Schema.Types.ObjectId,
    ref: "CompanySupply",
    required: true
  },    

  idStockBatch: {
    type: Schema.Types.ObjectId,
    ref: "StockBatch",
    required: true
  },

  quantity: { type: Number, required: true }, // SIEMPRE positiva

  typeAdjustment: {
    type: String,
    enum: [
      "DAÑADO",// "DAÑADO"
      "VENCIDO", // "VENCIDO"   
      "PERDIDO", // "PERDIDO"
      "ROBO", // "ROBO"
      "DIFERENCIA DE INVENTARIO", // "DIFERENCIA DE INVENTARIO"
      "DONACIÓN", // "DONACIÓN"
      "MUESTRA" // "MUESTRA"
    ],
    required: true
  },

  unitCost: { type: Number, required: true },

  totalCost: { type: Number, required: true }, // quantity * unitCost

  noteAdjustment: { type: String },

  date: { type: Date, default: Date.now }

}, { timestamps: true });

const stockAdjustment = mongoose.model("StockAdjustment", stockAdjustmentSchema);
export default stockAdjustment;