"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllersGastos_js_1 = require("../controllers/controllersGastos.js");
router.post("/addGastos", controllersGastos_js_1.addGastos);
router.get("/getGastosDirXanio/:idCompany", controllersGastos_js_1.getGastosDirXanio);
router.get("/getGastosIndXanio/:idCompany", controllersGastos_js_1.getGastosIndXanio);
router.get("/gastosXanioandMesNow/:idCompany", controllersGastos_js_1.gastosXanioandMesNow);
router.get("/gastosXanioandMesParam/:idCompany", controllersGastos_js_1.gastosXanioandMesParam);
router.get("/gtosXanio/:idCompany", controllersGastos_js_1.gtosXanio);
exports.default = router;
