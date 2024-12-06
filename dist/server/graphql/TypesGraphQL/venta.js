"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const Venta = (0, graphql_tag_1.default) `
  """
  Company Sales
  """
  type venta {
    date: String
    anio: Number
    mes: Number
    idTurno: Turnos
    name: String
    Dog: Perro
    notesTurn: String
    tipoServ: String
    valorServ: Number
    client: Cliente
    efectivo: Number
    transferencia: Number
    tarjeta: Number
    idCompany: Company
  }
`;
exports.default = Venta;
