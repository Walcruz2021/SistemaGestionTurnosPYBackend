"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllersClients_js_1 = require("../controllers/controllersClients.js");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post('/client', controllersClients_js_1.addClient);
router.post('/importClientsExcel', upload.single('file'), controllersClients_js_1.uploadClients);
exports.default = router;
