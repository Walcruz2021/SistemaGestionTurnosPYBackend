"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const gastoSchema = new Schema({
    año: { type: Number, require: true },
    date: { type: String, require: true },
    description: { type: String, require: true },
    efectivo: { type: Number, require: true },
    transferencia: { type: Number, require: true },
    tarjeta: { type: Number, require: true },
    categoryGasto: { type: String, require: true },
    value: { type: Number, require: true },
    mes: { type: Number, require: true },
    typeGasto: { type: String, require: true },
    idCompany: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
});
const Gasto = mongoose_1.default.model("Gasto", gastoSchema);
exports.default = Gasto;
