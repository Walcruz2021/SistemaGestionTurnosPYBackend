"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// libreria que nos permitira conectarse a mongodb
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const ventaSchema = new Schema({
    date: { type: String, require: true },
    año: { type: Number, require: false },
    mes: { type: Number, require: false },
    idTurno: {
        type: Schema.Types.ObjectId,
        ref: 'Turnos'
    },
    name: { type: String, require: true },
    Dog: {
        type: Schema.Types.ObjectId,
        ref: 'Perro'
    },
    notesTurn: { type: String, require: true },
    tipoServ: { type: String, require: true },
    valorServ: { type: Number, require: true },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente'
    },
    efectivo: { type: Number, require: true },
    transferencia: { type: Number, require: true },
    tarjeta: { type: Number, require: true },
    idCompany: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }
});
const Venta = mongoose_1.default.model('Venta', ventaSchema);
exports.default = Venta;
