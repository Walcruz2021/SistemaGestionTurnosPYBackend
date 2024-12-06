"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ventasxIdClient = exports.listVentasxId = exports.vtasxAnioandMesParam = exports.vtasxAnioandMesNow = exports.ventaXanio = exports.listVentas = exports.addVenta = void 0;
const cliente_js_1 = __importDefault(require("../models/cliente.js"));
const perro_js_1 = __importDefault(require("../models/perro.js"));
const venta_js_1 = __importDefault(require("../models/venta.js"));
const company_js_1 = __importDefault(require("../models/company.js"));
const addVenta = async (req, res, next) => {
    //console.log(req.params.idClient);
    const { date, valorServ, name, idTurno, notesTurn, tipoServ, transferencia, efectivo, tarjeta, año, mes, idCompany, } = req.body;
    const venta = new venta_js_1.default({
        idTurno,
        date,
        valorServ,
        name,
        notesTurn,
        tipoServ,
        transferencia,
        efectivo,
        tarjeta,
        año,
        mes,
        idCompany,
    });
    try {
        const cliente = await cliente_js_1.default.findById(req.params.idClient);
        // console.log(cliente,"---->")
        venta.client = cliente;
        const company = await company_js_1.default.findById(req.body.idCompany);
        venta.idCompany = company;
        const dog = await perro_js_1.default.findById(req.body.idDog);
        console.log(dog);
        venta.Dog = dog;
        await venta.save();
        //console.log(venta);
        cliente.pedidos.push(venta);
        await cliente.save();
        res.json({
            status: "Venta agendada",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.addVenta = addVenta;
const listVentas = async (req, res) => {
    // si no coloco el async y el await se enviara a la consola respuestas antes
    // de terminar de hacer la bsusqueda por completo de la BD y tirara errores
    // busqueda de todos los registros que existen en la BD
    const ventas = await venta_js_1.default.find();
    // res.send("hola mundo")
    res.json({
        ventas,
    });
};
exports.listVentas = listVentas;
const ventaXanio = async (req, res) => {
    const idCompany = req.params.idCompany;
    const { anio } = req.query;
    const ventas = await venta_js_1.default.find({ idCompany: idCompany, año: anio });
    if (ventas.length > 0) {
        res.status(200).json({
            ventas,
        });
    }
    else {
        res.status(204).json({
            msg: "vta no encontrada",
        });
    }
};
exports.ventaXanio = ventaXanio;
const vtasxAnioandMesNow = async (req, res) => {
    let now = new Date();
    let mes = now.getMonth() + 1;
    let anio = now.getFullYear();
    const idCompany = req.params.idCompany;
    console.log(idCompany);
    const vtas = await venta_js_1.default.find({
        idCompany: idCompany,
        mes: mes,
        año: anio,
    });
    try {
        if (vtas) {
            return res.status(200).json({
                vtas,
            });
        }
        else
            return res.status(204).json({
                msg: "no existen ventas",
            });
    }
    catch (error) {
        console.log(error);
    }
};
exports.vtasxAnioandMesNow = vtasxAnioandMesNow;
const vtasxAnioandMesParam = async (req, res) => {
    const { date } = req.query;
    let año = Math.trunc(date / 10);
    let mes = date % 10;
    const idCompany = req.params.idCompany;
    if (((Math.log(año) * Math.LOG10E + 1) | 0) > 4) {
        mes = "" + (año % 10) + mes;
        año = Math.trunc(año / 10);
    }
    const vtas = await venta_js_1.default.find({ idCompany: idCompany, mes: mes, año: año });
    if (vtas.length > 0) {
        return res.status(200).json({
            vtas,
        });
    }
    else
        return res.status(204).json({
            msg: "no existen ventas",
        });
};
exports.vtasxAnioandMesParam = vtasxAnioandMesParam;
const listVentasxId = async (req, res, next) => {
    // mongoose.Types.ObjectId.isValid(req.params) para resolver
    // CastError: Cast to ObjectId failed for value "{ _id: '[object Object]' }" (type Object) at path "_id" for model "Venta"
    // se valida si el valor del criterio para la búsqueda es un ObjectId válido
    const ventaID = await venta_js_1.default.findById(req.params.id);
    // res.json(buscado)
    try {
        if (ventaID) {
            res.status(200).json({
                ventaID,
            });
        }
        res.status(204).json({
            status: "venta no encontrada",
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.listVentasxId = listVentasxId;
const ventasxIdClient = async (req, res, next) => {
    // const perro=req.body
    // console.log(perro)
    // const {dog}=req.body
    const dog = req.params.idDog;
    await venta_js_1.default.find({ Dog: dog }, function (err, vta) {
        perro_js_1.default.populate(vta, { path: "Dog" }, function (err, vta) {
            if (vta.length > 0) {
                res.status(200).json({
                    vta,
                });
            }
            else
                res.status(204).json({
                    msg: "no existe dog",
                });
        });
    });
};
exports.ventasxIdClient = ventasxIdClient;
