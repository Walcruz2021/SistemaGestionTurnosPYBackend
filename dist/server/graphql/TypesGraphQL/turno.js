"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const graphql_scalars_1 = require("graphql-scalars");
const Turno = (0, graphql_tag_1.default) `
  """
  Client's Turns
  """
  scalar Date
  scalar Time
  type Turno {
    name: String
    nameDog: String
    idDog: String
    phone: Float
    date: Date
    notesTurn: String
    time: Time
    #   //(sellers)nombre de campo el cual contendra no solo el id del cliente sino ademas todos
    #   //los datos del mismo(pedidos,turnos,etc)
    Client: String
    Company: String
  }
`;
exports.default = Turno;
