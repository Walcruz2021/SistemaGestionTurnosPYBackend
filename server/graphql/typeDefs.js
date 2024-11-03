import { mergeTypeDefs } from "@graphql-tools/merge";
//  import Cliente from "../../modelsTypesGraphQL";
import Company from "./TypesGraphQL/company.js";
import User from "./TypesGraphQL/user.js";
import Venta from "./TypesGraphQL/venta.js";
//import Company from "../../models/company.js";
//import Mascota from "./types/Mascota.js";
import Query from "./query.js";
import Mutation from "./mutation.js";
import Turno from "./TypesGraphQL/turno.js";

const typeDefs = mergeTypeDefs([Company, Query, User, Mutation, Turno]); //[Mascota. Cliente]
export default typeDefs;
