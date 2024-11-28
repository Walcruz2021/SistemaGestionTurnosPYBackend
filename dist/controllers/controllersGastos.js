"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gastosXanioandMesParam = exports.gastosXanioandMesNow = exports.getGastosIndXanio = exports.gtosXanio = exports.getGastosDirXanio = exports.addGastos = void 0;
const gastos_js_1 = __importDefault(require("../models/gastos.js"));
const company_js_1 = __importDefault(require("../models/company.js"));
const addGastos = async (req, res) => {
    const { año, date, description, efectivo, tarjeta, transferencia, categoryGasto, value, mes, typeGasto, idCompany, } = req.body;
    const gasto = new gastos_js_1.default({
        año,
        date,
        description,
        efectivo,
        transferencia,
        tarjeta,
        categoryGasto,
        value,
        mes,
        typeGasto,
        idCompany,
    });
    const findCompany = await company_js_1.default.find({ _id: idCompany });
    if (findCompany) {
        await gasto.save();
        res.status(200).json({
            status: "Gasto Agendado",
        });
    }
    else {
        res.status(204).json({
            msg: "company not found",
        });
    }
};
exports.addGastos = addGastos;
const getGastosDirXanio = async (req, res) => {
    const { año } = req.body;
    const idCompany = req.params.idCompany;
    console.log(idCompany);
    const gastosFind = await gastos_js_1.default.find({
        idCompany: idCompany,
        año: año,
        typeGasto: "Gasto Directo",
    });
    if (gastosFind.length) {
        res.status(200).json({
            gastosFind,
        });
    }
    else {
        res.status(204).json({
            msg: "gastos not found",
        });
    }
};
exports.getGastosDirXanio = getGastosDirXanio;
const gtosXanio = async (req, res) => {
    const idCompany = req.params.idCompany;
    const { anio } = req.query;
    const gastos = await gastos_js_1.default.find({ idCompany: idCompany, año: anio });
    console.log(gastos);
    if (gastos.length > 0) {
        res.status(200).json({
            gastos,
        });
    }
    else {
        res.status(204).json({
            msg: "gastos no encontrado",
        });
    }
};
exports.gtosXanio = gtosXanio;
const getGastosIndXanio = async (req, res) => {
    const { año } = req.body;
    const idCompany = req.params.idCompany;
    console.log(idCompany);
    const gastosFind = await gastos_js_1.default.find({
        idCompany: idCompany,
        año: año,
        typeGasto: "Gasto Indirecto",
    });
    if (gastosFind.length) {
        res.status(200).json({
            gastosFind,
        });
    }
    else {
        res.status(204).json({
            msg: "gastos not found",
        });
    }
};
exports.getGastosIndXanio = getGastosIndXanio;
const gastosXanioandMesNow = async (req, res) => {
    let now = new Date();
    let mes = now.getMonth() + 1;
    let anio = now.getFullYear();
    const idCompany = req.params.idCompany;
    const gastos = await gastos_js_1.default.find({
        idCompany: idCompany,
        mes: mes,
        año: anio,
    });
    try {
        if (gastos) {
            return res.status(200).json({
                gastos,
            });
        }
        else
            return res.status(204).json({
                msg: "no existen gastos",
            });
    }
    catch (error) {
        console.log(error);
    }
};
exports.gastosXanioandMesNow = gastosXanioandMesNow;
const gastosXanioandMesParam = async (req, res) => {
    const { date } = req.query;
    let año = Math.trunc(date / 10);
    let mes = date % 10;
    const idCompany = req.params.idCompany;
    if (((Math.log(año) * Math.LOG10E + 1) | 0) > 4) {
        mes = "" + (año % 10) + mes;
        año = Math.trunc(año / 10);
    }
    const gtos = await gastos_js_1.default.find({ idCompany: idCompany, mes: mes, año: año });
    if (gtos.length > 0) {
        return res.status(200).json({
            gtos,
        });
    }
    else
        return res.status(204).json({
            msg: "no existen gastos",
        });
};
exports.gastosXanioandMesParam = gastosXanioandMesParam;
