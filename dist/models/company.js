"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const companyShema = new Schema({
    nameCompany: { type: String },
    address: { type: String, required: true },
    cuit: { type: String },
    province: { type: String },
    country: { type: String },
    // User:{
    //     type:Schema.Types.ObjectId,
    //     ref:'Users'
    // }
}, { timestamps: true });
const Company = mongoose_1.default.model("Company", companyShema);
exports.default = Company;
