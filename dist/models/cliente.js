"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteSchema = void 0;
// libreria que nos permitira conectarse a mongodb
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
exports.clienteSchema = new Schema({
    name: { type: String, require: true },
    // nameDog:{type:String,require:true},
    phone: { type: String, require: true },
    address: { type: String, require: true },
    notesCli: { type: String },
    turnos: [{ type: Schema.Types.ObjectId, ref: 'Turno' }],
    pedidos: [{ type: Schema.Types.ObjectId, ref: 'Venta' }],
    perros: [{
            type: Schema.Types.ObjectId,
            ref: 'Perro',
            nameDog: String
        }],
    status: { type: Boolean, default: true },
    userLogin: { type: Boolean, default: false },
    userName: { type: String },
    Company: { type: Schema.Types.ObjectId, ref: 'Company' },
    email: { type: String }
}, { timestamps: true });
const Cliente = mongoose_1.default.model('Cliente', exports.clienteSchema);
exports.default = Cliente;
