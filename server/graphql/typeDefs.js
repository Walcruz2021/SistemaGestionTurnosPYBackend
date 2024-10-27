import gql from "graphql-tag";

const typeDefs = gql`
  type Cliente {
    id: ID
    name: String
  }

  type Company {
    id: ID
    nameCompany: String
  }

  type Query {
    hello: String
    getClients: [Cliente]
    getCompanyxId(id: ID!): Company
  }

  type Mutation {
    createMascota(nameDog: String, raza: String): Mascota
  }

  type Mascota {
    _id: ID
    nameDog: String
    raza: String
  }
`;

export default typeDefs;
