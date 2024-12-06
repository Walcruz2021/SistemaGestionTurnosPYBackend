"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadClients = exports.deleteClient = exports.editClient = exports.addClient = exports.listClientId = exports.listClients = void 0;
const cliente_js_1 = __importDefault(require("../models/cliente.js"));
const perro_js_1 = __importDefault(require("../models/perro.js"));
const venta_js_1 = __importDefault(require("../models/venta.js"));
//postman OK
//graphQL OK
const listClients = async (req, res) => {
    try {
        if (req.params.id) {
            const idCompany = req.params.id;
            console.log(idCompany);
            await cliente_js_1.default.find({ status: true, Company: idCompany }, function (err, clientes) {
                venta_js_1.default.populate(clientes, { path: "pedidos" }, function (err, clientes) { }),
                    perro_js_1.default.populate(clientes, { path: "perros" }, function (err, clientes) {
                        // res.status(200).send(clientes)
                        return res.status(200).json({
                            clientes,
                        });
                    });
            });
        }
    }
    catch (err) {
        return err;
    }
};
exports.listClients = listClients;
//postman OK
//graphQL OK
const listClientId = async (req, res, next) => {
    if (req.params.id) {
        const buscado = await cliente_js_1.default.findById(req.params.id);
        console.log(buscado);
        try {
            res.json({
                buscado,
            });
        }
        catch (error) {
            console.log(error);
        }
        return res.status(400);
    }
};
exports.listClientId = listClientId;
const addClient = async (req, res, next) => {
    try {
        const { name, phone, address, notesCli, status, Company } = req.body;
        const cliente = new cliente_js_1.default({
            name,
            // nameDog:nameDog,
            phone,
            address,
            notesCli,
            status,
            Company,
        });
        await cliente.save();
        res.json({
            status: "cliente guardado satisfactoriamente",
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.addClient = addClient;
const editClient = async (req, res) => {
    const { name, phone, address, notesCli } = req.body;
    const newClient = {
        name,
        phone,
        address,
        notesCli,
    };
    await cliente_js_1.default.findByIdAndUpdate(req.params.id, newClient, {
        userFindAndModify: false,
    });
    res.json({
        status: "cliente actualizado",
    });
};
exports.editClient = editClient;
const deleteClient = async (req, res) => {
    // await Cliente.findByIdAndRemove(req.params.id, { userFindAndModify: false });
    const newStatus = {
        status: false,
    };
    await cliente_js_1.default.findByIdAndUpdate(req.params.id, newStatus, {
        userFindAndModify: false,
    })
        .then(() => res.json({
        status: "CLENTE  ELIMINADO",
    }))
        .catch((err) => res.status(400).json("Error: " + err));
};
exports.deleteClient = deleteClient;
const uploadClients = async (req, res) => {
    //isNaN(valor) false si el valor es un número o puede ser convertido a un número
    //isNaN(true) por ejempo true puede convertirse a 1
    function isNumber(valor) {
        return typeof valor === "number" && !isNaN(valor);
    }
    function isString(valor) {
        return typeof valor === "string" && valor.trim().length > 0;
    }
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send("No se ha proporcionado ningún archivo.");
        }
        // Leer el archivo Excel
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convertir a formato JSON
        const data = XLSX.utils.sheet_to_json(sheet);
        //validation data with format Model
        const arrayDataFilter = data.filter((data) => {
            // this code verify if exist field and data - no son null, undefined, 0, false, o una cadena vacía ""
            return (data.name &&
                isString(data.name) &&
                isNumber(data.phone) &&
                data.phone &&
                data.address &&
                isString(data.address));
            // typeof data.name === "string" &&
            // data.name.trim() !== "" &&
            //   typeof data.phone === "string" &&
            //   data.phone.trim() !== "" &&
            //   typeof data.address === "string" &&
            //   data.address.trim() !== "";
        });
        // Guardar cada entrada en la base de datos
        //console.log(arrayDataFilter)
        if (arrayDataFilter.length === data.length) {
            //console.log(arrayDataFilter)
            await Promise.all(arrayDataFilter.map(async (entry) => {
                const newClient = new cliente_js_1.default(entry);
                await newClient.save();
            }));
            res.send("Archivo subido y datos guardados en la base de datos.");
            // arrayDataFilter.forEach(async (entry) => {
            //   const newClient = new Cliente(entry);
            //   await newClient.save();
            // });
        }
        else {
            res.status(400).send("Revise su Archivo");
        }
    }
    catch (error) {
        console.error("Error al procesar el archivo:", error);
        res.status(500).send("Hubo un error al procesar el archivo.");
    }
};
exports.uploadClients = uploadClients;
