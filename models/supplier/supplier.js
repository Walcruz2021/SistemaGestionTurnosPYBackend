import mongoose from "mongoose";
const { Schema } = mongoose;

const suppierSchema = new Schema({
    nameSupplier: {
        type: String, trim: true, required: true
    },
    address: {
        type: String, trim: true, required: true
    },
    cuit: { type: String, trim: true, required: false },
    phone: {
        type: String, trim: true, required: true
    },
    status: { type: Boolean, default: true },
    Company: {
        type: Schema.Types.ObjectId, ref: 'Company', required: true
    }
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", suppierSchema);
export default Supplier;