import gql from "graphql-tag";

const Query = gql`
  type Query {
    hello: String
    getCompanyxId(id: ID!): Company
    validationCompanyExist(email:String!):Company
    searchUser(email:String!):User
  }
`;

export default Query;
