"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importaciones de controladores
const controllersClients_js_1 = require("../controllers/controllersClients.js");
const controllersVentas_js_1 = require("../controllers/controllersVentas.js");
const controllersTurnos_js_1 = require("../controllers/controllersTurnos.js");
const controllersUserAdmin_js_1 = require("../controllers/controllersUserAdmin.js");
const controllersUser_js_1 = require("../controllers/controllersUser.js");
//import { refreshToken } from "../controllers/controllersRefreshToken.js";
//import { checkAuth } from "../middleware/auth.js";
const perro_js_1 = __importDefault(require("../models/perro.js"));
const controllerCompany_js_1 = require("../controllers/controllerCompany.js");
const router = express_1.default.Router();
//const { findByIdAndUpdate } = require("../models/users");
router.delete("/deleteClient/:id", controllersClients_js_1.deleteClient);
router.put("/editClient/:id", controllersClients_js_1.editClient);
router.get("/listClientsCompany/:id", controllersClients_js_1.listClients);
//find Client by idClient
router.get("/listClients/:id", controllersClients_js_1.listClientId);
//VENTAS
router.post("/addVentas/:idClient", controllersVentas_js_1.addVenta);
router.get("/listVentas", controllersVentas_js_1.listVentas);
// recibira idclient y buscara en la coleccion de ventas, las que tengan incorporados el idClient
router.get("/ventaCli/:idDog", controllersVentas_js_1.ventasxIdClient);
router.get("/ventasxAnio/:idCompany", controllersVentas_js_1.ventaXanio);
router.get("/vtasxAnioandMesNow/:idCompany", controllersVentas_js_1.vtasxAnioandMesNow);
router.get("/vtasxAnioandMesParam/:idCompany", controllersVentas_js_1.vtasxAnioandMesParam);
router.get("/listVentas/:id", controllersVentas_js_1.listVentasxId);
//TURNOS
router.get("/getTurnos/:id", controllersTurnos_js_1.listTurnos);
router.post("/turno", controllersTurnos_js_1.addTurno);
router.delete("/deleteTurno/:id", controllersTurnos_js_1.deleteTurno);
//turnosOcu=array de turnos ya ocupados
//turnosEmpr= es el array de turnos los cuales la empresa piensa abastecer
// modificacmos un turno que ya existe
router.put("/editTurno/:id", controllersTurnos_js_1.editTurno);
/// ////////////////////////PERROS//////////////////////////////
//COMPANY
router.get("/getCompany/:id", controllerCompany_js_1.getCompany);
router.post("/addCompany", controllerCompany_js_1.addCompany);
//USER
router.post("/addUser", controllersUser_js_1.addUser);
router.get("/validationCompanyExist/:email", controllersUser_js_1.validationCompanyExist);
router.get("/searchUser/:email", controllersUser_js_1.searchUser);
exports.default = router;
