import { mergeTypeDefs } from "@graphql-tools/merge";
//  import Cliente from "../../modelsTypesGraphQL";
import Company from "./TypesGraphQL/company.js";
import User from "./TypesGraphQL/user.js";
//import Company from "../../models/company.js";
//import Mascota from "./types/Mascota.js";
import Query from "./query.js";
import { QueryDocumentKeys } from "graphql/language/ast.js";
//import Mutation from "./mutation.js";

const typeDefs = mergeTypeDefs([Company, Query, User]); //[Mascota. Cliente]
export default typeDefs;
