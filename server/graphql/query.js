import gql from "graphql-tag";

const Query = gql`
  type Query {
    getCompanyxId(id: ID!): Company
    validationCompanyExist(email: String!): [Company]
    searchUser(email: String!): User
    getTurnos(id: ID!): Turno
  }
`;

export default Query;
