import mongoose from "mongoose";
const { Schema } = mongoose;

const companySupplySchema = new Schema({
    idCompany: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    idGlobalSupply: { type: Schema.Types.ObjectId, ref: 'Supply', required: false },
    priceSale: { type: Number, required: false },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },

}, { timestamps: true });

const CompanySupply = mongoose.model("CompanySupply", companySupplySchema);
export default CompanySupply