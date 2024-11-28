"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// libreria que nos permitira conectarse a mongodb
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const turnoSchema = new Schema({
    name: { type: String, require: true },
    nameDog: { type: String, require: true },
    idDog: { type: String, require: true },
    phone: { type: Number, require: true },
    date: { type: String, require: true },
    notesTurn: { type: String, require: true },
    time: { type: String, require: true },
    //(sellers)nombre de campo el cual contendra no solo el id del cliente sino ademas todos
    //los datos del mismo(pedidos,turnos,etc)
    Client: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
    },
    Company: { type: Schema.Types.ObjectId, ref: "Company" },
    alertSent: { type: Boolean, default: false },
    isNotifications: { type: Boolean, default: false } //permite saber si se le  enviara notificacion o no
}, { timestamps: true });
const Turno = mongoose_1.default.model("Turno", turnoSchema);
exports.default = Turno;
