import mongoose from "mongoose";
const { Schema } = mongoose;

const supplySchema = new Schema({
    nameSupply: { type: String, required: false },
    categorySupply: { type: String, required: true },
    // idSupplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    // nameSupplier: { type: String, required: false },
    idBrand: { type: Schema.Types.ObjectId, ref: 'Brand', required: false },
    nameBrand: { type: String, required: false },
    codeInt: { type: String, required: false },
    typeUnidMed: { type: String, required: true },
    valueUnidMed: { type: String, required: true },
    priceSale: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Supply = mongoose.model("Supply", supplySchema);
export default Supply

