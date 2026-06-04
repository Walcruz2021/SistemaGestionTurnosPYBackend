import mongoose from "mongoose";
const { Schema } = mongoose;

const companyShema = new Schema({
    nameCompany:{type:String,required:true},
    address:{type:String,required:true},
    cuit:{type:String},
    province:{type:String},
    country:{type:String},
    category:{type:String, required:true},
    // User:{
    //     type:Schema.Types.ObjectId,
    //     ref:'Users'
    // },
    slug:{type:String, required:true}
},{timestamps:true});

const Company=mongoose.model("Company", companyShema);
export default Company