import mongoose from "mongoose";
const { Schema } = mongoose;

const suppierSchema = new Schema({
    nameSupplier: { type: String, required: false },
    address: { type: String, required: true },
    cuit: { type: String, required: true },
    phone: { type: Number, required: true },
    status:{type:Boolean, default:true},
    Company:{type: Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", suppierSchema);
export default Supplier;