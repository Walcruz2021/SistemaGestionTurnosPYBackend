import mongoose from "mongoose";
const { Schema } = mongoose;

const itemsSaleSchema = new Schema({
    idCompanySupply: { type: Schema.Types.ObjectId, ref: 'CompanySupply', required: true },
    idGlobalSupply: { type: Schema.Types.ObjectId, ref: 'Supply', required: true },
    idStockBatch: {
        type: Schema.Types.ObjectId,
        ref: "StockBatch",
        required: true
    },
    quantitySale: { type: Number, required: true },
    quantityReturned: { type: Number, required: false, default: 0 },
    unitCost: { type: Number, required: false },
    priceSaleUnit: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    surcharge: { type: Number, required: false },
    discount: { type: Number, required: false },
    profit: {
        type: Number,
        required: true
    },
    nameSupply:{type:String,required:true}
}, { _id: true });

const saleSupplySchema = new Schema({
    idCompany: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    numeSale: { type: String, unique: true, index: true },
    date: { type: Date, default: Date.now },
    paymentMethodEfectivo: { type: Number, required: false, default: 0 },
    paymentMethodTarjeta: { type: Number, required: false, default: 0 },
    paymentMethodTransferencia: { type: Number, required: false, default: 0 },


    platformMethod: { type: String, enum: ['Mercado Libre', 'Local', 'Facebook', 'Instagram', 'Tik Tok'], required: true },
    totalSale: { type: Number, required: true },
    items: { type: [itemsSaleSchema], required: true },
    totalCost: {
        type: Number,
        required: true
    },
    totalProfit: {
        type: Number,
        required: true
    },

    totalReturned: {
        type: Number,
        required: false,
        default: 0
    },
    status: { type: String, enum: ["completed", "partial_return","returned"] }
}, { timestamps: true });

const saleSupply = mongoose.model("SaleSupply", saleSupplySchema);
export default saleSupply;