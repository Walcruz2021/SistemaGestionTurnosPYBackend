"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const Cliente = (0, graphql_tag_1.default) `
  """
  Company Clients
  """
  type Cliente {
    id: ID
    name: String
    phone: String
    address: String
    notesCli: String
    turnos: [String]
    pedidos: [String]
    perros: [String]
    status: Boolean
    userLogin: Boolean
    userName: String
    Company: String
  }
`;
exports.default = Cliente;
