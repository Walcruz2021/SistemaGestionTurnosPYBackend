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

  type: {
    type: String,
    enum: [
      "DAMAGED",// "DAÑADO"
      "EXPIRED", // "VENCIDO"   
      "LOST", // "PERDIDO"
      "THEFT", // "ROBO"
      "INVENTORY_DIFF", // "DIFERENCIA DE INVENTARIO"
      "DONATION", // "DONACIÓN"
      "SAMPLE" // "MUESTRA"
    ],
    required: true
  },

  unitCost: { type: Number, required: true },

  totalCost: { type: Number, required: true }, // quantity * unitCost

  description: { type: String },

  date: { type: Date, default: Date.now }

}, { timestamps: true });

const stockAdjustment = mongoose.model("StockAdjustment", stockAdjustmentSchema);
export default stockAdjustment;