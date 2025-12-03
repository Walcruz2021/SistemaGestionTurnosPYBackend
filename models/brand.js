import mongoose from "mongoose";
const { Schema } = mongoose;

const brandSchema = new Schema({
    nameBrand: { type: String, required: false },

}, { timestamps: true });

const Brand = mongoose.model("Brand", brandSchema);
export default Brand