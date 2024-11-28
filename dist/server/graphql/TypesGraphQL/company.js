"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const Company = (0, graphql_tag_1.default) `
  type Company {
    id: ID
    nameCompany: String
    address: String
    cuit: String
    province: String
    country: String
    emailUser:String
  }
`;
exports.default = Company;
