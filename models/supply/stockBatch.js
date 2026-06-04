import mongoose from "mongoose";
const { Schema } = mongoose;

const stockBatchSchema = new Schema({
    idSupply: { type: Schema.Types.ObjectId, ref: 'Supply', required: true },
    quantity: { type: Number, required: true },        // stock disponible
    unitCost: { type: Number, required: true },        // precio unitario de compra
    datePurchase: { type: Date, required: true },      // fecha de compra
    buySupply: { type: Schema.Types.ObjectId, ref: 'BuySupply', required: true }, // opcional,
    nameLot: { type: String, required: false },
    idCompany: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    idCompanySupply: { type: Schema.Types.ObjectId, ref: 'CompanySupply', required: false },
    idVariant: { type: Schema.Types.ObjectId, ref: 'SupplyVariant', required: true },
}, { timestamps: true });


const StockBatch = mongoose.model("StockBatch", stockBatchSchema);
export default StockBatch