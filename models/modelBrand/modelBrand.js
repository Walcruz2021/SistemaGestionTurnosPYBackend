import mongoose from "mongoose";
const { Schema } = mongoose;

const modelBrandSchema = new Schema({
    idBrand:{type: Schema.Types.ObjectId, ref: 'ModelBrand', required: false},
    nameModel: { type: String, required: true },

}, { timestamps: true });

const ModelBrand = mongoose.model("ModelBrand", modelBrandSchema);
export default ModelBrand