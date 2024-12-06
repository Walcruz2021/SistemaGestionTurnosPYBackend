"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const Query = (0, graphql_tag_1.default) `
  type Query {
    """
    The company is obtained according to the passed id
    """
    getCompanyxId(id: ID!): Company

    """
    Validates if the user passed as a parameter has companies under his/her charge
    """
    validationCompanyExist(email: String!): [Company]
    """
    Search for a user based on the email passed as a parameter
    """
    searchUser(email: String!): User

    """
    Search for a Turns based on the idCompany passed as parameter
    """
    getTurnos(idComp: ID!): [Turno]

    """
    Search for a Client based on the idClient passed as parameter
    """
    listClientId(idClient: ID!): Cliente

    """
    Search for a all Clients with status True based on the idCompany passed as parameter
    """
    listClients(idCompany: ID!): [Cliente]
  }
`;
exports.default = Query;
