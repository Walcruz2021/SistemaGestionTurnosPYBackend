const mongoose = require("mongoose");
const { Schema } = mongoose;

const companyShema = new Schema({
    nameCompany:{type:String},
    address:{type:String,required:true},
    cuit:{type:String},
    province:{type:String},
    country:{type:String},
    // User:{
    //     type:Schema.Types.ObjectId,
    //     ref:'Users'
    // }
});

module.exports = mongoose.model("Company", companyShema);
