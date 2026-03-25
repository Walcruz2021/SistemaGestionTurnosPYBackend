import mongoose from "mongoose";
const { Schema } = mongoose;

const detailsSupplySchema = new Schema({
    idSupply: { type: Schema.Types.ObjectId, ref: 'Supply', required: true },
    nameSupply: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitCost: { type: Number, required: true },
    idBrand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    nameBrand: { type: String, required: true },
    valueUnidMed: { type: String, required: false },
    details: { type: String, required: false }
});

const buySupplySchema = new Schema({
    montoN: { type: Number, required: true },
    montoB: { type: Number, required: true },
    paymentMethod: { type: String },
    Company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    iva: { type: Number },
    typeInvoice: { type: String },
    NInvoice: { type: String },
    taxes: { type: Number },
    date: { type: Date, required: true },
    nameSupplier: { type: String, required: true },
    idSupplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    detailsSupply: {
        type: [detailsSupplySchema],
        required: true
    }
}, { timestamps: true });

const BuySupply = mongoose.model("BuySupply", buySupplySchema);
export default BuySupply;

