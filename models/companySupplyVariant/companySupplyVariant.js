import mongoose from "mongoose";
const { Schema } = mongoose;

const companySupplyVariantSchema = new Schema({
    idCompanySupply: { type: Schema.Types.ObjectId, ref: 'CompanySupply', required: true },
    idSupplyVariant: { type: Schema.Types.ObjectId, ref: 'SupplyVariant', required: true },
    // visibleStore: { type: Boolean, required: true },
    priceSale: { type: Number, required: false },
}, { timestamps: true });
companySupplyVariantSchema.index(
    {
        idCompanySupply: 1,
        idSupplyVariant: 1
    },
    {
        unique: true
    }
);

const CompanySupplyVariant = mongoose.model("CompanySupplyVariant", companySupplyVariantSchema);
export default CompanySupplyVariant