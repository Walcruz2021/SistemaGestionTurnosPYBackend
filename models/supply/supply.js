import mongoose from "mongoose";
const { Schema } = mongoose;

const supplySchema = new Schema({
    //trim elmiina espacio al principio y al final
    //lowercase convierte automaticamente el texto a minuscula
    nameSupply: { type: String, required: true, trim: true, lowercase: true, unique: true },// no pueden haber dos supply con el mismo nombre
    idBrand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    // idCategory: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    createdAt: { type: Date, default: Date.now },
    description: { type: String, required: false },
    imgStore: { type: String, required: false },
}, { timestamps: true });

// Unique index-refuerza a apesar de que ya se puso a nameSupply como unique
supplySchema.index(
    { nameSupply: 1 },
    { unique: true }
);

const Supply = mongoose.model("Supply", supplySchema);
export default Supply

