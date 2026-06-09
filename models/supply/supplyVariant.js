import mongoose from "mongoose";
const { Schema } = mongoose;

const supplyVariantSchema = new Schema({

    idSupply: { type: Schema.Types.ObjectId, ref: 'Supply', required: true },
    attributes: {
        type: Map,
        of: String,
        default: {}
    },
    attributeHash: { type: String, required: true },
    // typeUnidMed: { type: String, required: true },//talle,litros,blister,caja
    // valueUnitMed: { type: String, required: true },//xl,10,etc
    sku: { type: String, required: false, trim: true, lowercase: true },
    createdAt: { type: Date, default: Date.now },
    description: { type: String, required: false },
    name: { type: String, required: true, trim: true, lowercase: true },
    imgStore: { type: [String], default: [], required: false },
}, { timestamps: true });
supplyVariantSchema.index(
    { idSupply: 1, attributeHash: 1 , name: 1 },
    { unique: true }
);

const SupplyVariant = mongoose.model("SupplyVariant", supplyVariantSchema);
export default SupplyVariant
