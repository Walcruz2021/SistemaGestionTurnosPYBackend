"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTurnos = exports.editTurno = exports.deleteTurno = exports.addTurno = void 0;
const cliente_js_1 = __importDefault(require("../models/cliente.js"));
const turno_js_1 = __importDefault(require("../models/turno.js"));
const user_js_1 = __importDefault(require("../models/user.js"));
//const Break=require("../models/break.js")
// si no coloco el async y el await se enviara a la consola respuestas antes
// de terminar de hacer la bsusqueda por completo de la BD y tirara errores
// busqueda de todos los registros que existen en la BD
const addTurno = async (req, res, next) => {
    const { name, nameDog, phone, date, notesTurn, idClient, time, idDog, Company, } = req.body;
    const turno = new turno_js_1.default({
        name,
        nameDog,
        phone,
        date,
        notesTurn,
        idClient,
        time,
        idDog,
        Company,
    });
    try {
        const cliente = await cliente_js_1.default.findById(req.body.idClient);
        console.log(req.body.idClient);
        // console.log(cliente)
        // if (!cliente) {
        //   return res.status(204).json({
        //     msg: "Client not found",
        //   });
        // }
        // turno.Client = cliente;
        // await turno.save();
        // cliente.turnos.push(turno);
        // await cliente.save();
        // res.status(200).json({
        //   status: "turno agendado",
        //   turno,
        // });
    }
    catch (err) {
        next(err);
    }
};
exports.addTurno = addTurno;
const deleteTurno = async (req, res) => {
    await turno_js_1.default.findByIdAndRemove(req.params.id, { userFindAndModify: false })
        .then(() => res.status(200).json({
        status: "TURNO ELIMINADO",
    }))
        .catch((err) => res.status(400).json("Error: " + err));
};
exports.deleteTurno = deleteTurno;
const editTurno = async (req, res) => {
    const { date, time, notesTurn } = req.body;
    const newTurno = {
        date,
        time,
        notesTurn,
    };
    await turno_js_1.default.findByIdAndUpdate(req.params.id, newTurno, {
        userFindAndModify: false,
    });
    res.status(200).json({
        status: "turno actualizado",
    });
};
exports.editTurno = editTurno;
//postman OK
//graphQL OK
const listTurnos = async (req, res) => {
    const idCompany = req.params.id;
    console.log(idCompany);
    try {
        const turnos = await turno_js_1.default.find({ Company: idCompany });
        if (turnos.length > 0) {
            res.status(200).json({
                turnos,
            });
        }
        else {
            res.status(204).json({
                msg: "not found turnos",
            });
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
exports.listTurnos = listTurnos;
