import mongoose from "mongoose";
const { Schema } = mongoose;

const supplyVariantSchema = new Schema({

    idSupply: { type: Schema.Types.ObjectId, ref: 'Supply', required: true },
    typeUnidMed: { type: String, required: true },//talle,litros,blister,caja
    valueUnitMed: { type: String, required: true },//xl,10,etc
    sku: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    description:{ type: String, required: false },
    name:{ type: String, required: true },
    imgStore: { type: [String], default: [], required: false },
}, { timestamps: true });

const SupplyVariant = mongoose.model("SupplyVariant", supplyVariantSchema);
export default SupplyVariant
