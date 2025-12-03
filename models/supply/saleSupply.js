import mongoose from "mongoose";
const { Schema } = mongoose;

const saleSupplySchema = new Schema({
    date: { type: String, required: false },
    totalSale: { type: Number, required: true },
    details: { type: String, required: true },
    priceBuy: { type: Number, required: true },
    priceSale: { type: Number, required: true },
}, { timestamps: true });

const saleSupply = mongoose.model("SaleSupply", saleSupplySchema);
export default saleSupply;