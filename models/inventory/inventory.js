import mongoose from "mongoose";
const { Schema } = mongoose;

const inventorySchema = new Schema({
    idCompany: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    idVariant: { type: Schema.Types.ObjectId, ref: 'Variant', required: true },
    currentStock: { type: Number, required: true }
}, { timestamps: true });

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory