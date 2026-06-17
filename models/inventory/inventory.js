import mongoose from "mongoose";
const { Schema } = mongoose;

const inventorySchema = new Schema({
    idCompany: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    idVariant: { type: Schema.Types.ObjectId, ref: 'SupplyVariant', required: true },
    currentStock: { type: Number, required: true }
}, { timestamps: true });
inventorySchema.index(
    {
        idCompany: 1,
        idVariant: 1
    },
    {
        unique: true
    }
);
const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory