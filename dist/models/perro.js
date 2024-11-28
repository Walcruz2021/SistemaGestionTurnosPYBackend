"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.perroShema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
// La propiedad required permite indicar si un campo es obligatorio true o no false. Si se intenta
// realizar un registro nuevo y alguno de los campos requeridos falta, automáticamente se va a impedir
// guardar dichos datos y nos mostraría un error indicando que dicha propiedad es requerida.
exports.perroShema = new Schema({
    raza: { type: String, require: true },
    tamaño: { type: String, require: true },
    nameDog: { type: String, require: true },
    notaP: { type: String, require: true },
    status: { type: Boolean, deafult: true }
});
const Perro = mongoose_1.default.model('Perro', exports.perroShema);
exports.default = Perro;
