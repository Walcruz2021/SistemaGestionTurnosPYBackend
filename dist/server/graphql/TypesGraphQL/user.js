"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const User = (0, graphql_tag_1.default) `
  """
  User Loged Customer PymesYa
  """
  type User {
    id: ID
    fullName: String
    email: String
    status: Boolean
    companies: [Company]
  }
`;
exports.default = User;
