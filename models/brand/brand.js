import mongoose from "mongoose";
const { Schema } = mongoose;

const brandSchema = new Schema({
    nameBrand: { type: String, required: false,unique: true,trim:true, lowercase:true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category",required:true }],

}, { timestamps: true });

brandSchema.index(
    { nameBrand: 1 },
    { unique: true }
); 

const Brand = mongoose.model("Brand", brandSchema);
export default Brand