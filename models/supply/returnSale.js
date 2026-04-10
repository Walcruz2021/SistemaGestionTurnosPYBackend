import mongoose from "mongoose";
const { Schema } = mongoose;

const itemsSaleSchema = new Schema({
    idItemSale: { type: Schema.Types.ObjectId, ref: 'ItemSale', required: true },
    idCompanySupply: { type: Schema.Types.ObjectId, ref: 'CompanySupply', required: true },
    idGlobalSupply: { type: Schema.Types.ObjectId, ref: 'Supply', required: true },
    idStockBatch: {
        type: Schema.Types.ObjectId,
        ref: "StockBatch",
        required: true
    },
    quantityReturned: { type: Number, required: true },
    unitCost: { type: Number, required: false },
    priceSaleUnit: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    surcharge: { type: Number, required: false },
    discount: { type: Number, required: false },
    profit: {
        type: Number,
        required: true
    },

}, { _id: false });

const returnSaleSchema = new Schema({
    idSale: { type: Schema.Types.ObjectId, ref: 'Sale', required: true },
    date: { type: Date },
    totalReturn: { type: Number },
    items: { type: [itemsSaleSchema], required: true },
    reason:{ type: String, required: false }
}, { timestamps: true });

const returnSalesSupply = mongoose.model("ReturnSalesSupply", returnSaleSchema);
export default returnSalesSupply;