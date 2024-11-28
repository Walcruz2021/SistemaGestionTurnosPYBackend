"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const merge_1 = require("@graphql-tools/merge");
//  import Cliente from "../../modelsTypesGraphQL";
const company_js_1 = __importDefault(require("./TypesGraphQL/company.js"));
const user_js_1 = __importDefault(require("./TypesGraphQL/user.js"));
const venta_js_1 = __importDefault(require("./TypesGraphQL/venta.js"));
//import Company from "../../models/company.js";
//import Mascota from "./types/Mascota.js";
const query_js_1 = __importDefault(require("./query.js"));
const mutation_js_1 = __importDefault(require("./mutation.js"));
const turno_js_1 = __importDefault(require("./TypesGraphQL/turno.js"));
const cliente_js_1 = __importDefault(require("./TypesGraphQL/cliente.js"));
const typeDefs = (0, merge_1.mergeTypeDefs)([company_js_1.default, query_js_1.default, user_js_1.default, mutation_js_1.default, turno_js_1.default, cliente_js_1.default]); //[Mascota. Cliente]
exports.default = typeDefs;
