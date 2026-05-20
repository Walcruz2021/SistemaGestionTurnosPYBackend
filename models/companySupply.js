import mongoose from "mongoose";
const { Schema } = mongoose;

const companySupplySchema = new Schema({
    idCompany: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    nameSupply: { type: String },
    idGlobalSupply: { type: Schema.Types.ObjectId, ref: 'Supply', required: false },
    nameSupply: { type: String, required: true },
    priceSale: { type: Number, required: false },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    visibleStore: { type: Boolean, required: false },
    description: { type: String, required: false },
    imgStore:[{type:String,required:false}]

}, { timestamps: true });

const CompanySupply = mongoose.model("CompanySupply", companySupplySchema);
export default CompanySupply